#!/usr/bin/env python3
"""기존 index.html / style.css / app.js용 데이터 생성기. Python 3.9+.

python make_report.py result.txt
python make_report.py result.txt -o result.json --js-output result-data.js

입력 기본값: result.txt. 출력 기본값: result.json, result-data.js.
HTML/CSS/app.js는 생성하거나 수정하지 않습니다.
기존 schema_version=1과 window.BENCHMARK_REPORT를 유지합니다.
CUDA GPU 시간도 기존 화면과 호환되도록 simd_* 키에 저장합니다.
GFLOPS는 원본 로그에 명시된 값만 저장하고 없으면 null입니다.
"""
import argparse
import json
import math
import re
import statistics
import sys
from datetime import datetime, timezone
from pathlib import Path

NUMBER = r"[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?"
META = re.compile(r"^\s*([A-Za-z][A-Za-z0-9 /_-]*?)\s*:\s*(.*?)\s*$")
START = re.compile(r"^\s*(?:Compiler|Runtime)\s*:", re.M)
TRIAL = re.compile(rf"^\s*(\d+)\s+({NUMBER})\s+({NUMBER})\s+({NUMBER})x\s*$")
PAIR = re.compile(rf"^\s*(\d+)\s+(.+?)\s{{2,}}(.+?)\s{{2,}}(\d+)\s+({NUMBER})\s*$")


def number(value):
    match = re.match(rf"\s*({NUMBER})", str(value))
    if not match:
        return None
    value = float(match.group(1))
    return value if math.isfinite(value) else None


def integer(value):
    value = number(value)
    return int(value) if value is not None and value.is_integer() else None


def label(meta):
    version = meta.get("Compiler", meta.get("Runtime", "Unknown"))
    if "CUDA" in version:
        return "CUDA · " + meta.get("Device", version)
    if version.startswith("Python"):
        return "Python · " + version
    if version.startswith(".NET"):
        return "C# · " + version
    if version.lower().startswith("go"):
        return "Go · " + version
    return "C++ · " + version


def parse_logs(text, source="log"):
    text = re.sub(r"\x1b\[[0-?]*[ -/]*[@-~]", "", text.lstrip("\ufeff"))
    starts = [match.start() for match in START.finditer(text)]
    records = []
    for index, begin in enumerate(starts):
        block = text[begin:starts[index + 1] if index + 1 < len(starts) else len(text)]
        meta, trials, pairs = {}, [], []
        pair_section = False
        table_mode = None
        for line in block.splitlines():
            if "상위" in line and "지역" in line or "Top positively correlated" in line:
                pair_section = True
            if "Trial" in line and "CPU(ms)" in line:
                table_mode = "GPU" if "GPU(ms)" in line else "SIMD"
            match = META.match(line)
            if match:
                key, value = match.groups()
                # 마지막 Validation 필드는 실제 PASS/FAIL 결과입니다.
                meta[key.strip()] = value.strip()
                continue
            if table_mode == "GPU_E2E" and not pair_section:
                e2e_match = re.match(rf"^\s*(\d+)\s+({NUMBER})\s+({NUMBER})\s+({NUMBER})\s+({NUMBER})x\s+({NUMBER})x\s*$", line)
                if e2e_match:
                    rank, cpu_ms, gpu_ms, e2e_ms, gpu_speedup, _ = e2e_match.groups()
                    trials.append({"trial": int(rank), "cpu_ms": float(cpu_ms), "accelerated_ms": float(gpu_ms), "logged_speedup": float(gpu_speedup), "gpu_e2e_ms": float(e2e_ms)})
            match = TRIAL.match(line)
            if meta.get("Backend") == "CPU" and not pair_section:
                cpu_match = re.match(rf"^\s*(\d+)\s+({NUMBER})\s*$", line)
                if cpu_match:
                    trials.append({"trial": int(cpu_match[1]), "cpu_ms": float(cpu_match[2]), "accelerated_ms": None})
            if match and not pair_section and table_mode != "GPU_E2E":
                rank, cpu, accelerated, speedup = match.groups()
                trials.append({"trial": int(rank), "cpu_ms": float(cpu), "accelerated_ms": float(accelerated), "logged_speedup": float(speedup)})
            if "GPU E2E(ms)" in line:
                table_mode = "GPU_E2E"
            if pair_section:
                match = PAIR.match(line)
                if match:
                    rank, a, b, samples, correlation = match.groups()
                    pairs.append({"rank": int(rank), "a": a.strip(), "b": b.strip(), "samples": int(samples), "correlation": float(correlation)})
        mode = "GPU" if "GPU average" in meta else "SIMD"
        loops = integer(meta.get("Loops"))
        warnings = []
        if not loops or loops < 1:
            loops = None
            warnings.append("반복 횟수가 없어 회당 시간을 계산할 수 없습니다.")
        if any(not math.isfinite(t[k]) or t[k] <= 0 for t in trials for k in ("cpu_ms", "accelerated_ms") if t[k] is not None):
            raise ValueError(f"{source}: {index + 1}번 실행의 시간이 유효하지 않습니다.")
        expected = integer(meta.get("Trials"))
        if expected is not None and len(trials) != expected:
            warnings.append(f"측정 회차 누락: 로그 {len(trials)}회 / 선언 {expected}회")
        if len({t['trial'] for t in trials}) != len(trials):
            warnings.append("중복된 Trial 번호가 있습니다.")
        trial_numbers = [t["trial"] for t in trials]
        if expected is not None and sorted(trial_numbers) != list(range(1, expected + 1)):
            warnings.append("측정 회차 번호가 선언된 범위와 일치하지 않습니다.")
        cpu_mean = statistics.mean(t["cpu_ms"] for t in trials) if trials else number(meta.get("CPU average"))
        accelerated = [t["accelerated_ms"] for t in trials if t["accelerated_ms"] is not None]
        accel_mean = statistics.mean(accelerated) if accelerated else number(meta.get(mode + " average"))
        if not trials:
            warnings.append("회차별 측정값 없음: 로그 요약값을 사용합니다.")
        cpu_run = number(meta.get("CPU per run"))
        accel_run = number(meta.get(mode + " per run"))
        if cpu_run is None and cpu_mean is not None and loops:
            cpu_run = cpu_mean / loops
        if accel_run is None and accel_mean is not None and loops:
            accel_run = accel_mean / loops
        for kind, value in (("CPU", cpu_run), (mode, accel_run)):
            mean = cpu_mean if kind == "CPU" else accel_mean
            if value is not None and mean is not None and loops and abs(value - mean / loops) > max(0.000002, abs(value) * 0.001):
                warnings.append(f"{kind} 회당 시간과 회차 평균/반복 횟수가 일치하지 않습니다.")
        status_text = meta.get("Validation", "")
        status = "PASS" if re.match(r"PASS\b", status_text) else "FAIL" if re.match(r"FAIL\b", status_text) else "UNKNOWN"
        if status != "PASS":
            warnings.append("검증 결과: " + (status_text or "없음"))
        file = meta.get("File", "(파일명 없음)")
        # 이름이 같더라도 기간/크기가 다르면 별개의 데이터 그룹으로 처리합니다.
        identity = (file.replace("\\", "/").split("/")[-1], meta.get("Period", ""), meta.get("Array", ""), integer(meta.get("Pairs")), integer(meta.get("Observations")))
        records.append({"source": source, "label": label(meta), "meta": meta, "file": file, "identity": identity, "mode": mode, "loops": loops, "trials": trials, "pairs": pairs, "cpu_mean": cpu_mean, "accel_mean": accel_mean, "cpu_run": cpu_run, "accel_run": accel_run, "speedup": cpu_mean / accel_mean if cpu_mean is not None and accel_mean is not None and accel_mean > 0 else None, "error": number(meta.get("Max abs error")), "status": status, "warnings": warnings})
        if "GPU E2E average" in meta:
            e2e_values = [t["gpu_e2e_ms"] for t in trials if "gpu_e2e_ms" in t]
            if e2e_values:
                records[-1]["gpu_e2e"] = {"values": e2e_values, "mean": statistics.mean(e2e_values), "speedup": cpu_mean / statistics.mean(e2e_values) if cpu_mean else None}
                if len(e2e_values) != len(trials):
                    records[-1]["warnings"].append("CUDA end-to-end 측정 회차가 일부 누락되었습니다.")
    return records


def build_report(records, source):
    results = []
    for index, r in enumerate(records, 1):
        m = r["meta"]
        gpu = "CUDA" in m.get("Compiler", "") or "CUDA" in m.get("SIMD", "") or r["mode"] == "GPU"
        mode = r["mode"]
        cpu = [t["cpu_ms"] for t in r["trials"]]
        simd = [t["accelerated_ms"] for t in r["trials"] if t["accelerated_ms"] is not None]
        sample_counts = [p["samples"] for p in r["pairs"]]
        sample_meta = re.search(r"(\d+)\s*/\s*(\d+)\s*/\s*(\d+)", m.get("Sample counts", ""))
        metadata = {
            "runner": m.get("Runner", m.get("Compiler", m.get("Runtime", ""))),
            "compiler": m.get("Compiler", ""),
            "runtime": m.get("Runtime", ""),
            "environment": m.get("Environment", ""),
            "device": m.get("Device", ""),
            "test": m.get("Test", ""),
            "cpu_description": m.get("CPU", ""),
            "simd_description": m.get(mode, ""),
            "array": m.get("Array", ""),
            "loops": r["loops"],
            "trial_count": integer(m.get("Trials")) or len(cpu),
            "repeat_description": m.get("Loops", ""),
            "timing": m.get("Timing", ""),
            "transfers": m.get("Transfers", m.get("GPU timing", "")),
            "validation": m.get("Validation", ""),
            "formula": m.get("Formula", ""),
            "operations_description": m.get("Operations", ""),
            "file": m.get("File", ""),
            "period": m.get("Period", ""),
            "pairs": integer(m.get("Pairs")),
            "observations": integer(m.get("Observations")),
            "missing": integer(m.get("Missing")),
            "preprocess_ms": number(m.get("Preprocess")),
            "upload_ms": number(m.get("Upload")),
            "gpu_timing": m.get("GPU timing", ""),
            "gpu_e2e_timing": m.get("GPU end-to-end", ""),
            "tolerance": number(m.get("Tolerance")),
            "undefined": integer(m.get("Undefined")),
            "sample_min": int(sample_meta.group(1)) if sample_meta else min(sample_counts) if sample_counts else None,
            "sample_median": int(sample_meta.group(2)) if sample_meta else statistics.median(sample_counts) if sample_counts else None,
            "sample_max": int(sample_meta.group(3)) if sample_meta else max(sample_counts) if sample_counts else None,
        }
        if metadata["tolerance"] is None:
            match = re.search(r"tolerance\s+(" + NUMBER + r")", m.get("Validation", ""), re.I)
            if match:
                metadata["tolerance"] = float(match.group(1))
        summary = {
            "cpu_average_ms": r["cpu_mean"],
            "simd_average_ms": r["accel_mean"],
            "cpu_median_ms": statistics.median(cpu) if cpu else None,
            "simd_median_ms": statistics.median(simd) if simd else None,
            "cpu_min_ms": min(cpu) if cpu else None,
            "simd_min_ms": min(simd) if simd else None,
            "cpu_max_ms": max(cpu) if cpu else None,
            "simd_max_ms": max(simd) if simd else None,
            "cpu_stdev_ms": statistics.stdev(cpu) if len(cpu) > 1 else 0.0 if cpu else None,
            "simd_stdev_ms": statistics.stdev(simd) if len(simd) > 1 else 0.0 if simd else None,
            "speedup": r["speedup"],
            "cpu_gflops": number(m.get("CPU GFLOPS")),
            "simd_gflops": number(m.get(mode + " GFLOPS")),
            "max_abs_error": r["error"],
            "cpu_per_run_ms": r["cpu_run"],
            "simd_per_run_ms": r["accel_run"],
            "cpu_checksum": number(m.get("CPU checksum")),
            "simd_checksum": number(m.get(mode + " checksum")),
            "gpu_e2e_average_ms": r.get("gpu_e2e", {}).get("mean"),
            "gpu_e2e_median_ms": statistics.median(r["gpu_e2e"]["values"]) if r.get("gpu_e2e") else None,
            "gpu_e2e_min_ms": min(r["gpu_e2e"]["values"]) if r.get("gpu_e2e") else None,
            "gpu_e2e_speedup": r.get("gpu_e2e", {}).get("speedup"),
        }
        results.append({
            "id": "result-" + str(index),
            "label": r["label"],
            "detail": m.get("Compiler", m.get("Runtime", "")),
            "backend": "CPU" if m.get("Backend") == "CPU" else "CUDA GPU" if gpu else "CPU SIMD",
            "metadata": metadata,
            "summary": summary,
            "trials": [{"trial": t["trial"], "cpu_ms": t["cpu_ms"], "simd_ms": t["accelerated_ms"], "speedup": t["cpu_ms"] / t["accelerated_ms"] if t["accelerated_ms"] else None, "gpu_e2e_ms": t.get("gpu_e2e_ms")} for t in r["trials"]],
            "top_pairs": [{"rank": p["rank"], "region_a": p["a"], "region_b": p["b"], "samples": p["samples"], "correlation": p["correlation"]} for p in r["pairs"]],
            "warnings": r["warnings"],
        })
    return {"schema_version": 1, "source_file": source, "generated_at": datetime.now(timezone.utc).isoformat(), "results": results}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input", nargs="?", default="result.txt", help="입력 로그 (기본: result.txt)")
    parser.add_argument("-o", "--output", default="./report/result.json", help="출력 JSON")
    parser.add_argument("--js-output", default=None, help="출력 JS (기본: JSON과 같은 폴더의 result-data.js)")
    parser.add_argument("--encoding", default="utf-8-sig", help="입력 인코딩")
    args = parser.parse_args(argv)
    try:
        source = Path(args.input)
        output = Path(args.output)
        js_output = Path(args.js_output) if args.js_output else output.with_name("result-data.js")
        if output.suffix.lower() != ".json" or js_output.suffix.lower() != ".js":
            raise ValueError("출력 확장자는 각각 .json, .js여야 합니다.")
        if js_output.name.lower() == "app.js":
            raise ValueError("기존 app.js는 덮어쓰지 않습니다. result-data.js를 지정하세요.")
        if len({source.resolve(), output.resolve(), js_output.resolve()}) != 3:
            raise ValueError("입력과 출력 파일 경로는 서로 달라야 합니다.")
        records = parse_logs(source.read_text(encoding=args.encoding), str(source))
        if not records:
            raise ValueError("Compiler/Runtime으로 시작하는 벤치마크 로그가 없습니다.")
        data = build_report(records, str(source))
        payload = json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)
        js_payload = payload.replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
        for path in (output, js_output):
            path.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(payload + "\n", encoding="utf-8")
        js_output.write_text("window.BENCHMARK_REPORT = " + js_payload + ";\n", encoding="utf-8")
        print(f"완료: {output}, {js_output} ({len(records)}개 실행 결과)")
        return 0
    except (OSError, UnicodeError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
