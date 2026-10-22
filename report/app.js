"use strict";

const $ = id => document.getElementById(id);
let report = null;
let loading = false;

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

function format(value, digits = 3) {
    return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "—";
}

function showError(error) {
    $("error").textContent = error.message;
    $("error").hidden = false;
    if (!report) $("source").textContent = "로딩 실패";
}

function bar(label, value, maximum, className) {
    const width = maximum > 0 ? Math.max(0, Math.min(100, value / maximum * 100)) : 0;
    return `<div class="bar-row">
        <span>${escapeHTML(label)}</span>
        <div class="track">
            <div class="bar ${className}" style="width:${width}%"
                role="img" aria-label="${escapeHTML(label)} ${format(value)} ms"></div>
        </div>
        <span class="value">${format(value)} ms</span>
    </div>`;
}

function scale(maximum) {
    return `<div class="scale">
        <span>0</span>
        <span>${format(maximum / 2, 1)}</span>
        <span>${format(maximum, 1)} ms</span>
    </div>`;
}

// 이전 index.html에서도 추가 비교 화면이 표시되도록 누락된 영역을 생성합니다.
function ensureComparisonPanels() {
    const rankingPanel = $("ranking")?.closest("section");
    if (!rankingPanel) return;

    if (!$("cpu-ranking")) {
        rankingPanel.insertAdjacentHTML("afterend", `
            <section class="panel">
                <h2>CPU 실행 시간 비교</h2>
                <div id="cpu-ranking"></div>
                <p class="note">단위: ms · 낮을수록 빠름 · 선택한 차트 기준으로 정렬</p>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr><th>순위</th><th>구현</th><th id="cpu-stat-heading">평균 시간 (ms)</th></tr>
                        </thead>
                        <tbody id="cpu-ranking-table"></tbody>
                    </table>
                </div>
            </section>`);
    }

    if (!$("combined-ranking")) {
        $("cpu-ranking").closest("section").insertAdjacentHTML("afterend", `
            <section class="panel combined-panel">
                <h2>SIMD · CPU 통합 비교</h2>
                <div class="legend">
                    <span><i class="swatch cpu"></i>CPU</span>
                    <span><i class="swatch simd"></i>CPU SIMD</span>
                    <span><i class="swatch gpu"></i>CUDA GPU (SIMD 표기)</span>
                </div>
                <div id="combined-ranking"></div>
                <p class="note">단위: ms · CPU와 SIMD/GPU 전체 결과를 같은 축척으로 비교</p>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr><th>순위</th><th>구현</th><th>실행 방식</th><th id="combined-stat-heading">평균 시간 (ms)</th></tr>
                        </thead>
                        <tbody id="combined-ranking-table"></tbody>
                    </table>
                </div>
            </section>`);
    }
}

function draw() {
    if (!report) return;
    ensureComparisonPanels();

    const stat = $("stat").value;
    const cpuKey = `cpu_${stat}_ms`;
    const simdKey = `simd_${stat}_ms`;
    const rows = report.results;
    const maximum = rows.reduce((max, row) => Math.max(max, row.summary[cpuKey], row.summary[simdKey], row.summary[`gpu_e2e_${stat}_ms`] ?? 0), 0);

    $("comparison").innerHTML = rows.map(row => {
        const className = row.backend === "CUDA GPU" ? "gpu" : "simd";
        const acceleratedLabel = row.backend === "CUDA GPU" ? "GPU (복사 제외)" : "SIMD";
        return `<div class="group">
            <div class="group-title">${escapeHTML(row.label)}</div>
            ${bar("CPU", row.summary[cpuKey], maximum, "cpu")}
            ${bar(acceleratedLabel, row.summary[simdKey], maximum, className)}
            ${row.summary.gpu_e2e_average_ms == null ? "" : bar("GPU (복사 포함)", row.summary[`gpu_e2e_${stat}_ms`], maximum, "gpu")}
        </div>`;
    }).join("") + scale(maximum);

    const simdItems = rows.flatMap(row => {
        const items = [{label: row.label, value: row.summary[simdKey], mode: row.backend === "CUDA GPU" ? "GPU (복사 제외)" : "SIMD", className: row.backend === "CUDA GPU" ? "gpu" : "simd"}];
        if (row.summary.gpu_e2e_average_ms != null) items.push({label: row.label, value: row.summary[`gpu_e2e_${stat}_ms`], mode: "GPU (복사 포함)", className: "gpu"});
        return items;
    }).sort((a, b) => a.value - b.value);
    const simdMaximum = simdItems.reduce((max, item) => Math.max(max, item.value), 0);

    $("ranking").innerHTML = simdItems.map(item => `<div class="group">
        <div class="group-title">${escapeHTML(item.label)} · ${escapeHTML(item.mode)}</div>
        ${bar(item.mode, item.value, simdMaximum, item.className)}
    </div>`).join("") + scale(simdMaximum);

    const cpuSorted = [...rows].sort((a, b) => a.summary[cpuKey] - b.summary[cpuKey]);
    const cpuMaximum = cpuSorted.reduce((max, row) => Math.max(max, row.summary[cpuKey]), 0);

    $("cpu-ranking").innerHTML = cpuSorted.map((row, index) => `<div class="group">
        <div class="group-title">${index + 1}. ${escapeHTML(row.label)}</div>
        ${bar("CPU", row.summary[cpuKey], cpuMaximum, "cpu")}
    </div>`).join("") + scale(cpuMaximum);

    $("cpu-ranking-table").innerHTML = cpuSorted.map((row, index) => `<tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(row.label)}</td>
        <td>${format(row.summary[cpuKey])}</td>
    </tr>`).join("");

    const combined = rows.flatMap(row => [
        {
            label: row.label,
            mode: "CPU",
            value: row.summary[cpuKey],
            className: "cpu"
        },
        {
            label: row.label,
            mode: row.backend === "CUDA GPU" ? "GPU (복사 제외)" : "SIMD",
            value: row.summary[simdKey],
            className: row.backend === "CUDA GPU" ? "gpu" : "simd"
        },
        ...(row.summary.gpu_e2e_average_ms == null ? [] : [{label: row.label, mode: "GPU (복사 포함)", value: row.summary[`gpu_e2e_${stat}_ms`], className: "gpu"}])
    ]).sort((a, b) => a.value - b.value);

    const combinedMaximum = combined.reduce((max, item) => Math.max(max, item.value), 0);

    $("combined-ranking").innerHTML = combined.map((item, index) => `<div class="group">
        <div class="group-title">${index + 1}. ${escapeHTML(item.label)} · ${escapeHTML(item.mode)}</div>
        ${bar(item.className === "cpu" ? "CPU" : "SIMD", item.value, combinedMaximum, item.className)}
    </div>`).join("") + scale(combinedMaximum);

    $("combined-ranking-table").innerHTML = combined.map((item, index) => `<tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(item.label)}</td>
        <td>${escapeHTML(item.mode)}</td>
        <td>${format(item.value)}</td>
    </tr>`).join("");
    $("combined-title").textContent = `4. SIMD · CPU 통합 비교 (${combined.length}개 항목)`;

    const statLabel = { average: "평균", median: "중앙값", min: "최소" }[stat];
    $("cpu-stat-heading").textContent = `${statLabel} 시간 (ms)`;
    $("combined-stat-heading").textContent = `${statLabel} 시간 (ms)`;
}

function validate(data) {
    if (!data || !Array.isArray(data.results) || !data.results.length) {
        throw new Error("result-data.js에 벤치마크 결과가 없습니다.");
    }

    const required = [
        "cpu_average_ms", "simd_average_ms",
        "cpu_median_ms", "simd_median_ms",
        "cpu_min_ms", "simd_min_ms"
    ];

    for (const row of data.results) {
        if (!row || !row.metadata || !row.summary || !Array.isArray(row.trials)) {
            throw new Error("결과 데이터 구조가 올바르지 않습니다.");
        }
        for (const key of required) {
            if (!Number.isFinite(row.summary[key]) || row.summary[key] < 0) {
                throw new Error(`유효하지 않은 측정값: ${row.label} / ${key}`);
            }
        }
        if (row.label.startsWith("CUDA · ") && row.summary.gpu_e2e_average_ms == null) {
            throw new Error(`CUDA 메모리 복사 포함 측정값이 없습니다: ${row.label}`);
        }
        if (row.summary.gpu_e2e_average_ms != null && (!Number.isFinite(row.summary.gpu_e2e_average_ms) || row.summary.gpu_e2e_average_ms <= 0)) {
            throw new Error(`유효하지 않은 CUDA 전송 포함 시간: ${row.label}`);
        }
        if (row.trials.some(trial => trial.gpu_e2e_ms != null && (!Number.isFinite(trial.gpu_e2e_ms) || trial.gpu_e2e_ms <= 0))) {
            throw new Error(`유효하지 않은 CUDA 전송 포함 회차 시간: ${row.label}`);
        }
        if (!row.id || typeof row.label !== "string" || !["CPU SIMD", "CUDA GPU"].includes(row.backend)) {
            throw new Error("결과 식별 정보 또는 backend가 올바르지 않습니다.");
        }
        if (row.metadata.trial_count !== row.trials.length || row.trials.length === 0) {
            throw new Error(`측정 횟수 불일치: ${row.label}`);
        }
        if (row.metadata.validation && !/^PASS\b/.test(row.metadata.validation)) {
            throw new Error(`검증에 통과하지 않은 결과: ${row.label}`);
        }
        for (const key of ["speedup", "max_abs_error", "cpu_stdev_ms", "simd_stdev_ms"]) {
            if (row.summary[key] != null && (!Number.isFinite(row.summary[key]) || row.summary[key] < 0)) {
                throw new Error(`유효하지 않은 요약값: ${row.label} / ${key}`);
            }
        }
        const trialIds = new Set();
        for (const trial of row.trials) {
            if (!trial || !Number.isInteger(trial.trial) || trialIds.has(trial.trial) ||
                !Number.isFinite(trial.cpu_ms) || trial.cpu_ms <= 0 ||
                !Number.isFinite(trial.simd_ms) || trial.simd_ms <= 0) {
                throw new Error(`유효하지 않은 회차별 결과: ${row.label}`);
            }
            trialIds.add(trial.trial);
        }
        if (!Array.isArray(row.warnings) || !Array.isArray(row.top_pairs)) throw new Error(`결과 배열 누락: ${row.label}`);
        for (const pair of row.top_pairs) {
            if (!Number.isInteger(pair.samples) || pair.samples < 2 || !Number.isFinite(pair.correlation) || Math.abs(pair.correlation) > 1) {
                throw new Error(`유효하지 않은 지역 쌍 결과: ${row.label}`);
            }
        }
    }
}

function render(data) {
    validate(data);
    report = data;
    $("error").hidden = true;

    $("source").textContent = `${data.source_file} · ${data.results.length}개 결과 · 생성 ${data.generated_at}`;

    $("summary").innerHTML = data.results.map(row => {
        const s = row.summary;
        return `<tr>
            <td>${escapeHTML(row.label)}</td>
            <td>${format(s.cpu_average_ms)}</td>
            <td>${format(s.simd_average_ms)}</td>
            <td>${format(s.gpu_e2e_average_ms)}</td>
            <td>${s.speedup == null ? "—" : format(s.speedup, 2) + "×"}</td>
            <td>${s.gpu_e2e_speedup == null ? "—" : format(s.gpu_e2e_speedup, 2) + "×"}</td>
            <td>${format(s.cpu_gflops)}</td>
            <td>${format(s.simd_gflops)}</td>
            <td>${escapeHTML(s.max_abs_error ?? "—")}</td>
            <td>${escapeHTML(row.metadata.validation ?? "미표기")}</td>
        </tr>`;
    }).join("");

    $("cuda-note").hidden = !data.results.some(row => row.backend === "CUDA GPU");
    const cudaRow = data.results.find(row => row.backend === "CUDA GPU");
    const labels = {
        runner: "실행 이름",
        compiler: "컴파일러",
        runtime: "런타임",
        environment: "환경",
        device: "장치",
        test: "테스트",
        cpu_description: "CPU",
        simd_description: "SIMD",
        array: "배열",
        loops: "반복 횟수",
        trial_count: "측정 횟수",
        repeat_description: "반복",
        timing: "측정 범위",
        transfers: "데이터 전송",
        gpu_e2e_timing: "CUDA 전송 포함 측정 범위",
        validation: "검증",
        formula: "계산식",
        operations_description: "연산량"
    };

    $("details").innerHTML = data.results.map(row => {
        const detail = row.detail && row.detail !== row.label ? " · " + escapeHTML(row.detail) : "";
        return `<details>
            <summary>${escapeHTML(row.label)}${detail}</summary>
            <dl class="metadata">
                ${Object.entries(row.metadata).map(([key, value]) =>
                    `<dt>${escapeHTML(labels[key] ?? key)}</dt><dd>${escapeHTML(value)}</dd>`
                ).join("")}
                <dt>CPU 체크섬</dt>
                <dd>${escapeHTML(row.summary.cpu_checksum ?? "—")}</dd>
                <dt>SIMD 체크섬</dt>
                <dd>${escapeHTML(row.summary.simd_checksum ?? "—")}</dd>
        <dt>측정 편차</dt>
        <dd>CPU 표준편차 ${format(row.summary.cpu_stdev_ms)} ms · 가속 표준편차 ${format(row.summary.simd_stdev_ms)} ms</dd>
        <dt>지역 쌍 표본 수</dt>
        <dd>${row.metadata.sample_min == null ? "—" : `${escapeHTML(row.metadata.sample_min)} / ${escapeHTML(row.metadata.sample_median)} / ${escapeHTML(row.metadata.sample_max)} (최소 / 중앙값 / 최대)`}</dd>
        <dt>분석 주의</dt>
        <dd>${row.warnings.length ? row.warnings.map(escapeHTML).join(" · ") : "없음"}</dd>
            </dl>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr><th>회차</th><th>CPU (ms)</th><th>SIMD / GPU 계산 (ms)</th><th>CUDA 전송 포함 (ms)</th><th>가속 배율</th></tr>
                    </thead>
                    <tbody>
                        ${row.trials.map(trial => `<tr>
                            <td>${escapeHTML(trial.trial)}</td>
                            <td>${format(trial.cpu_ms)}</td>
                            <td>${format(trial.simd_ms)}</td>
                            <td>${format(trial.gpu_e2e_ms)}</td>
                            <td>${format(trial.speedup, 2)}×</td>
                        </tr>`).join("")}
                    </tbody>
                </table>
            </div>
        </details>`;
    }).join("");

    $("content").hidden = false;
    draw();
}

function reloadData() {
    if (loading) return;
    loading = true;
    $("reload").disabled = true;
    $("error").hidden = true;

    const previous = window.BENCHMARK_REPORT;
    window.BENCHMARK_REPORT = undefined;

    const script = document.createElement("script");
    const url = new URL("./report/result-data.js", document.baseURI);
    url.searchParams.set("_", Date.now().toString());
    script.src = url.href;

    const finish = () => {
        script.remove();
        loading = false;
        $("reload").disabled = false;
    };

    script.onload = () => {
        try {
            render(window.BENCHMARK_REPORT);
        } catch (error) {
            window.BENCHMARK_REPORT = previous;
            showError(error);
        } finally {
            finish();
        }
    };

    script.onerror = () => {
        window.BENCHMARK_REPORT = previous;
        showError(new Error("result-data.js를 읽지 못했습니다. index.html과 같은 폴더에 두세요."));
        finish();
    };

    document.head.appendChild(script);
}

function initialize() {
    $("stat").addEventListener("change", draw);
    $("reload").addEventListener("click", reloadData);
    if (window.BENCHMARK_REPORT) {
        try {
            render(window.BENCHMARK_REPORT);
        } catch (error) {
            showError(error);
        }
    } else {
        reloadData();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
    initialize();
}
