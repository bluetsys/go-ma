#!/usr/bin/env python3
"""PyTorch CPU vs CUDA GPU / float64 Pearson correlation.

python benchmark.py "Datas/주유소_지역별_평균판매가격-자동차용경유.csv" 100
Requires PyTorch with CUDA support and an NVIDIA GPU.
GPU results use SIMD field names for the existing report parser.
CPU uses PyTorch tensor operations, one thread (not a scalar baseline).
CUDA execution could not be tested in the generation environment.
"""
import argparse
import csv
import math
import os
import platform
import sys
import time
from datetime import datetime
from pathlib import Path

TRIALS = 5
TOLERANCE = 1e-10


def price(value):
    value = value.strip()
    if value in ("", "-", "NA", "N/A"):
        return math.nan
    result = float(value.replace(",", ""))
    if not math.isfinite(result) or result <= 0:
        raise ValueError("Invalid price: " + value)
    return result


def load_data(path):
    dates, prices = [], []
    valid = missing = 0
    with open(path, "r", encoding="utf-8-sig", newline="") as file:
        reader = csv.reader(file, strict=True)
        header = next(reader, None)
        if header is None or len(header) < 3:
            raise ValueError("At least two region columns required")
        names = [v.strip() for v in header[1:]]
        if any(not v for v in names):
            raise ValueError("Empty region name")
        for fields in reader:
            if not fields or all(not v.strip() for v in fields):
                continue
            if len(fields) != len(header):
                raise ValueError(f"Column count mismatch at line {reader.line_num}")
            digits = "".join(c for c in fields[0] if "0" <= c <= "9")
            if len(digits) != 8:
                raise ValueError(f"Invalid date at line {reader.line_num}")
            date = datetime.strptime(digits, "%Y%m%d").date()
            if dates and date <= dates[-1]:
                raise ValueError("Dates must be unique and ascending")
            row = []
            for column, value in enumerate(fields[1:], 2):
                try:
                    v = price(value)
                except ValueError as exc:
                    raise ValueError(f"Invalid price at line {reader.line_num}, column {column}") from exc
                row.append(v)
                if math.isfinite(v):
                    valid += 1
                else:
                    missing += 1
            dates.append(date)
            prices.append(row)
    if len(dates) < 3:
        raise ValueError("Insufficient dates")
    returns = [[math.nan] * (len(dates) - 1) for _ in names]
    for i in range(1, len(dates)):
        if (dates[i] - dates[i - 1]).days != 1:
            continue
        for r in range(len(names)):
            previous, current = prices[i - 1][r], prices[i][r]
            if math.isfinite(previous) and math.isfinite(current):
                returns[r][i - 1] = (current - previous) / previous * 100.0
    pairs = []
    for a in range(len(names)):
        for b in range(a + 1, len(names)):
            x, y = [], []
            for u, v in zip(returns[a], returns[b]):
                if math.isfinite(u) and math.isfinite(v):
                    x.append(u)
                    y.append(v)
            if len(x) >= 2:
                pairs.append((a, b, x, y))
    if not pairs:
        raise ValueError("No pairs with enough common consecutive-day returns")
    return names, dates, pairs, valid, missing


def make_tensors(torch, pairs):
    # Pad to equal row lengths; the mask excludes padding from covariance.
    width = max(len(p[2]) for p in pairs)
    x = torch.zeros((len(pairs), width), dtype=torch.float64)
    y = torch.zeros_like(x)
    mask = torch.zeros((len(pairs), width), dtype=torch.bool)
    counts = torch.empty((len(pairs), 1), dtype=torch.float64)
    for i, (_, _, px, py) in enumerate(pairs):
        n = len(px)
        x[i, :n] = torch.tensor(px, dtype=torch.float64)
        y[i, :n] = torch.tensor(py, dtype=torch.float64)
        mask[i, :n] = True
        counts[i, 0] = n
    return x, y, mask, counts


def calculate(torch, tensors):
    x, y, mask, counts = tensors
    mx = x.sum(dim=1, keepdim=True) / counts
    my = y.sum(dim=1, keepdim=True) / counts
    dx = (x - mx).masked_fill(~mask, 0.0)
    dy = (y - my).masked_fill(~mask, 0.0)
    xx = (dx * dx).sum(dim=1)
    yy = (dy * dy).sum(dim=1)
    xy = (dx * dy).sum(dim=1)
    correlation = xy / (xx.sqrt() * yy.sqrt())
    return correlation.clamp(-1.0, 1.0).masked_fill((xx <= 0) | (yy <= 0), float("nan"))


def benchmark(torch, tensors, loops, device=None):
    if device is not None:
        torch.cuda.synchronize(device)
    start = time.perf_counter()
    output = None
    for _ in range(loops):
        output = calculate(torch, tensors)
    if device is not None:
        torch.cuda.synchronize(device)
    return (time.perf_counter() - start) * 1000.0, output


def validate(cpu, gpu):
    if len(cpu) != len(gpu):
        raise ValueError("Validation failed: output sizes differ")
    maximum = 0.0
    for i, (a, b) in enumerate(zip(cpu, gpu)):
        if math.isnan(a) and math.isnan(b):
            continue
        if not math.isfinite(a) or not math.isfinite(b):
            raise ValueError(f"Validation failed: non-finite mismatch at pair {i}")
        error = abs(a - b)
        if error > TOLERANCE:
            raise ValueError(f"Validation failed at pair {i}: {error:.12g}")
        maximum = max(maximum, error)
    return maximum


def pad(text, width):
    used = sum(1 if ord(c) < 128 else 2 for c in text)
    return text + " " * max(0, width - used)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("csv", nargs="?", default="../Datas/주유소_지역별_평균판매가격-보통휘발유.csv")
    parser.add_argument("loops", nargs="?", type=int, default=100)
    parser.add_argument("--device", type=int, default=0, help="CUDA device index")
    args = parser.parse_args(argv)
    if args.loops < 1:
        parser.error("loops must be positive")
    try:
        import torch
    except ImportError:
        print("Error: CUDA-enabled PyTorch is required.", file=sys.stderr)
        return 1
    try:
        if not torch.cuda.is_available():
            raise RuntimeError("CUDA unavailable: check NVIDIA driver and CUDA-enabled PyTorch")
        if not 0 <= args.device < torch.cuda.device_count():
            raise ValueError("Invalid CUDA device index")
        torch.set_num_threads(1)
        torch.set_num_interop_threads(1)
        device = torch.device(f"cuda:{args.device}")
        torch.cuda.set_device(device)
        torch.cuda.init()
        # Eager execution; no torch.compile, autocast, TF32 or float32 conversion.
        with torch.inference_mode():
            start = time.perf_counter()
            names, dates, pairs, valid, missing = load_data(args.csv)
            cpu_tensors = make_tensors(torch, pairs)
            preprocess_ms = (time.perf_counter() - start) * 1000.0
            torch.cuda.synchronize(device)
            start = time.perf_counter()
            gpu_tensors = tuple(t.to(device) for t in cpu_tensors)
            torch.cuda.synchronize(device)
            upload_ms = (time.perf_counter() - start) * 1000.0
            observations = sum(len(p[2]) for p in pairs)
            print(f"Runtime       : Python {platform.python_version()} / PyTorch {torch.__version__}")
            print(f"Environment   : {platform.system()} {platform.release()} / {platform.machine()} / {os.cpu_count() or 'unknown'} logical CPUs / {platform.processor() or 'CPU model unavailable'}")
            print(f"Device        : {torch.cuda.get_device_name(device)}")
            print(f"File          : {args.csv}")
            print("Test          : Pearson correlation of daily price changes / float64")
            print("CPU           : PyTorch CPU tensor operations / single thread / not scalar")
            print("SIMD          : PyTorch CUDA GPU / float64 / GPU reported as SIMD")
            print(f"Array         : {len(dates)} dates / {len(names)} region columns / {valid} valid prices")
            print(f"Period        : {dates[0]:%Y%m%d} - {dates[-1]:%Y%m%d}")
            print(f"Missing       : {missing} prices / excluded, not zero-filled")
            print(f"Pairs         : {len(pairs)} / common consecutive-day returns only")
            print(f"Observations  : {observations} across all pairs")
            sample_sizes = sorted(len(pair[2]) for pair in pairs)
            print(f"Sample counts : {sample_sizes[0]} / {sample_sizes[len(sample_sizes) // 2]} / {sample_sizes[-1]} (min / median / max)")
            print(f"Preprocess    : {preprocess_ms:.3f} ms / CSV + returns + padded tensors / excluded")
            print(f"Upload        : {upload_ms:.3f} ms / allocation + upload / excluded")
            print("Timing        : Wall time; means + centered covariance + correlation; tensor temporaries included")
            print("GPU timing    : Python dispatch + kernel launches + final sync included")
            print("Transfers     : Excluded from timing; inputs remain on device")
            print("Operations    : Identical padded batched tensor operations on CPU/GPU; padding masked")
            print(f"Loops         : {args.loops} per trial")
            print(f"Trials        : {TRIALS}")
            print(f"Validation    : Absolute tolerance {TOLERANCE:.1e}; zero-variance pairs are undefined\n")
            for _ in range(5):
                cpu_result = calculate(torch, cpu_tensors)
                gpu_result = calculate(torch, gpu_tensors)
            torch.cuda.synchronize(device)
            cpu_values = cpu_result.tolist()
            gpu_values = gpu_result.cpu().tolist()
            maximum = validate(cpu_values, gpu_values)
            cpu_total = simd_total = 0.0
            print(f"{'Trial':<8} {'CPU(ms)':>14} {'SIMD(ms)':>14} {'Speedup':>12}")
            for trial in range(TRIALS):
                if trial % 2 == 0:
                    cpu_ms, cpu_result = benchmark(torch, cpu_tensors, args.loops)
                    simd_ms, gpu_result = benchmark(torch, gpu_tensors, args.loops, device)
                else:
                    simd_ms, gpu_result = benchmark(torch, gpu_tensors, args.loops, device)
                    cpu_ms, cpu_result = benchmark(torch, cpu_tensors, args.loops)
                # Result transfer and validation are outside the timed region.
                cpu_values = cpu_result.tolist()
                gpu_values = gpu_result.cpu().tolist()
                maximum = max(maximum, validate(cpu_values, gpu_values))
                cpu_total += cpu_ms
                simd_total += simd_ms
                print(f"{trial + 1:<8} {cpu_ms:14.3f} {simd_ms:14.3f} {cpu_ms / simd_ms:11.2f}x")
            print(f"\nCPU checksum  : {sum(v for v in cpu_values if math.isfinite(v)):.12f}")
            print(f"SIMD checksum : {sum(v for v in gpu_values if math.isfinite(v)):.12f}")
            print(f"Max abs error : {maximum:.12g}")
            print(f"Validation    : PASS ({len(pairs)} pairs / tolerance {TOLERANCE:.1e})")
            print(f"Undefined     : {sum(math.isnan(v) for v in cpu_values)} zero-variance pairs")
            # Useful Pearson FLOPs, excluding tensor padding and reduction overhead.
            useful_flops = (10 * observations + 6 * len(pairs)) * args.loops
            print("Operations    : Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers")
            print(f"CPU GFLOPS    : {useful_flops / (cpu_total / TRIALS) / 1e6:.6f}")
            print(f"SIMD GFLOPS   : {useful_flops / (simd_total / TRIALS) / 1e6:.6f}")
            print(f"CPU average   : {cpu_total / TRIALS:.3f} ms")
            print(f"SIMD average  : {simd_total / TRIALS:.3f} ms")
            print(f"SIMD speedup  : {cpu_total / simd_total:.2f}x")
            print(f"CPU per run   : {cpu_total / TRIALS / args.loops:.6f} ms")
            print(f"SIMD per run  : {simd_total / TRIALS / args.loops:.6f} ms")
            order = sorted((i for i, v in enumerate(gpu_values) if math.isfinite(v)), key=lambda i: (-gpu_values[i], i))[:10]
            width = max(12, max(sum(1 if ord(c) < 128 else 2 for c in name) for name in names) + 2)
            print("\n일별 가격 변동률 상관계수 상위 10개 지역 쌍")
            print(f"{pad('순위', 8)}{pad('지역 A', width)}{pad('지역 B', width)}{'Samples':>12} {'Correlation':>16}")
            for rank, i in enumerate(order, 1):
                a, b, x, _ = pairs[i]
                print(f"{rank:<8}{pad(names[a], width)}{pad(names[b], width)}{len(x):12d} {gpu_values[i]:16.12f}")
        return 0
    except (OSError, ValueError, RuntimeError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
