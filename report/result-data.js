window.BENCHMARK_REPORT = {
  "schema_version": 1,
  "source_file": "report/results.txt",
  "generated_at": "2026-10-24T16:28:29.729940+00:00",
  "results": [
    {
      "id": "result-1",
      "label": "C++ · GCC 15.2.0",
      "detail": "GCC 15.2.0",
      "backend": "CPU SIMD",
      "metadata": {
        "runner": "GCC 15.2.0",
        "compiler": "GCC 15.2.0",
        "runtime": "",
        "environment": "Linux / x86_64 / 32 logical CPUs",
        "device": "",
        "test": "Pearson correlation of daily price changes / float64",
        "cpu_description": "Scalar / single thread",
        "simd_description": "AVX 256-bit / 4 doubles / single thread",
        "array": "6749 dates / 18 region columns / 112959 valid prices",
        "loops": 100,
        "trial_count": 5,
        "repeat_description": "100 per trial",
        "timing": "Pair means + centered covariance + correlation",
        "transfers": "",
        "validation": "PASS (151 pairs / tolerance 1.0e-10)",
        "formula": "",
        "operations_description": "Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 33.912,
        "upload_ms": null,
        "gpu_timing": "",
        "gpu_e2e_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 81.7976,
        "simd_average_ms": 30.4492,
        "cpu_median_ms": 80.204,
        "simd_median_ms": 30.396,
        "cpu_min_ms": 79.026,
        "simd_min_ms": 28.413,
        "cpu_max_ms": 86.733,
        "simd_max_ms": 32.779,
        "cpu_stdev_ms": 3.123060566175434,
        "simd_stdev_ms": 1.6307094161744464,
        "speedup": 2.686362860107983,
        "cpu_gflops": 10.873415,
        "simd_gflops": 29.210017,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.817976,
        "simd_per_run_ms": 0.304491,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232,
        "gpu_e2e_average_ms": null,
        "gpu_e2e_median_ms": null,
        "gpu_e2e_min_ms": null,
        "gpu_e2e_speedup": null
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 82.974,
          "simd_ms": 32.779,
          "speedup": 2.5313157814454375,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 80.204,
          "simd_ms": 31.047,
          "speedup": 2.583309176409959,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 80.051,
          "simd_ms": 29.611,
          "speedup": 2.7034210259700786,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 79.026,
          "simd_ms": 28.413,
          "speedup": 2.7813324886495616,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 86.733,
          "simd_ms": 30.396,
          "speedup": 2.8534346624555864,
          "gpu_e2e_ms": null
        }
      ],
      "top_pairs": [
        {
          "rank": 1,
          "region_a": "전남광주",
          "region_b": "경기",
          "samples": 97,
          "correlation": 0.969112097612
        },
        {
          "rank": 2,
          "region_a": "전남광주",
          "region_b": "충남",
          "samples": 97,
          "correlation": 0.966010194323
        },
        {
          "rank": 3,
          "region_a": "충남",
          "region_b": "경북",
          "samples": 6748,
          "correlation": 0.963612910272
        },
        {
          "rank": 4,
          "region_a": "전남광주",
          "region_b": "경남",
          "samples": 97,
          "correlation": 0.960824402513
        },
        {
          "rank": 5,
          "region_a": "전남광주",
          "region_b": "경북",
          "samples": 97,
          "correlation": 0.959174627152
        },
        {
          "rank": 6,
          "region_a": "전남광주",
          "region_b": "강원",
          "samples": 97,
          "correlation": 0.9561147653
        },
        {
          "rank": 7,
          "region_a": "충남",
          "region_b": "경남",
          "samples": 6748,
          "correlation": 0.949430636659
        },
        {
          "rank": 8,
          "region_a": "전남광주",
          "region_b": "충북",
          "samples": 97,
          "correlation": 0.946984550598
        },
        {
          "rank": 9,
          "region_a": "충북",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946816397324
        },
        {
          "rank": 10,
          "region_a": "강원",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946400963549
        }
      ],
      "warnings": []
    },
    {
      "id": "result-2",
      "label": "CUDA · NVIDIA GeForce RTX 3090",
      "detail": "NVIDIA CUDA 13.4",
      "backend": "CUDA GPU",
      "metadata": {
        "runner": "NVIDIA CUDA 13.4",
        "compiler": "NVIDIA CUDA 13.4",
        "runtime": "",
        "environment": "CUDA 8.6 / 32 logical CPUs",
        "device": "NVIDIA GeForce RTX 3090",
        "test": "Pearson correlation of daily price changes / float64",
        "cpu_description": "Scalar / single thread",
        "simd_description": "CUDA / SIMT / 256 threads per block",
        "array": "6749 dates / 18 region columns / 112959 valid prices",
        "loops": 100,
        "trial_count": 5,
        "repeat_description": "100 per trial",
        "timing": "Wall time; pair means + covariance + correlation",
        "transfers": "Launch + final synchronization included; transfers excluded",
        "validation": "PASS (151 pairs / tolerance 1.0e-10)",
        "formula": "",
        "operations_description": "Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 29.338,
        "upload_ms": 7.633,
        "gpu_timing": "Launch + final synchronization included; transfers excluded",
        "gpu_e2e_timing": "Allocation + packing + H2D + kernel + D2H included",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 81.786,
        "simd_average_ms": 6.2576,
        "cpu_median_ms": 81.924,
        "simd_median_ms": 6.232,
        "cpu_min_ms": 80.76,
        "simd_min_ms": 6.135,
        "cpu_max_ms": 83.041,
        "simd_max_ms": 6.421,
        "cpu_stdev_ms": 0.9582799695287373,
        "simd_stdev_ms": 0.13042162397394108,
        "speedup": 13.06986704167732,
        "cpu_gflops": 10.874948,
        "simd_gflops": 142.131575,
        "max_abs_error": 3.88578058619e-15,
        "cpu_per_run_ms": 0.817861,
        "simd_per_run_ms": 0.062577,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232,
        "gpu_e2e_average_ms": 656.5526,
        "gpu_e2e_median_ms": 660.423,
        "gpu_e2e_min_ms": 636.218,
        "gpu_e2e_speedup": 0.12456884642601371
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 81.924,
          "simd_ms": 6.421,
          "speedup": 12.758760317707523,
          "gpu_e2e_ms": 661.555
        },
        {
          "trial": 2,
          "cpu_ms": 80.76,
          "simd_ms": 6.135,
          "speedup": 13.163814180929096,
          "gpu_e2e_ms": 676.626
        },
        {
          "trial": 3,
          "cpu_ms": 82.295,
          "simd_ms": 6.363,
          "speedup": 12.933364765047934,
          "gpu_e2e_ms": 636.218
        },
        {
          "trial": 4,
          "cpu_ms": 83.041,
          "simd_ms": 6.137,
          "speedup": 13.53120417141926,
          "gpu_e2e_ms": 647.941
        },
        {
          "trial": 5,
          "cpu_ms": 80.91,
          "simd_ms": 6.232,
          "speedup": 12.982991014120666,
          "gpu_e2e_ms": 660.423
        }
      ],
      "top_pairs": [
        {
          "rank": 1,
          "region_a": "전남광주",
          "region_b": "경기",
          "samples": 97,
          "correlation": 0.969112097612
        },
        {
          "rank": 2,
          "region_a": "전남광주",
          "region_b": "충남",
          "samples": 97,
          "correlation": 0.966010194323
        },
        {
          "rank": 3,
          "region_a": "충남",
          "region_b": "경북",
          "samples": 6748,
          "correlation": 0.963612910272
        },
        {
          "rank": 4,
          "region_a": "전남광주",
          "region_b": "경남",
          "samples": 97,
          "correlation": 0.960824402513
        },
        {
          "rank": 5,
          "region_a": "전남광주",
          "region_b": "경북",
          "samples": 97,
          "correlation": 0.959174627152
        },
        {
          "rank": 6,
          "region_a": "전남광주",
          "region_b": "강원",
          "samples": 97,
          "correlation": 0.9561147653
        },
        {
          "rank": 7,
          "region_a": "충남",
          "region_b": "경남",
          "samples": 6748,
          "correlation": 0.949430636659
        },
        {
          "rank": 8,
          "region_a": "전남광주",
          "region_b": "충북",
          "samples": 97,
          "correlation": 0.946984550598
        },
        {
          "rank": 9,
          "region_a": "충북",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946816397324
        },
        {
          "rank": 10,
          "region_a": "강원",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946400963549
        }
      ],
      "warnings": []
    },
    {
      "id": "result-3",
      "label": "C# · .NET 10.0.13",
      "detail": ".NET 10.0.13",
      "backend": "CPU SIMD",
      "metadata": {
        "runner": ".NET 10.0.13",
        "compiler": "",
        "runtime": ".NET 10.0.13",
        "environment": "Ubuntu 26.04.1 LTS / X64 / 32 logical CPUs",
        "device": "",
        "test": "Pearson correlation of daily price changes / float64",
        "cpu_description": "Scalar / single thread",
        "simd_description": "AVX 256-bit / 4 doubles / single thread",
        "array": "6749 dates / 18 region columns / 112959 valid prices",
        "loops": 100,
        "trial_count": 5,
        "repeat_description": "100 per trial",
        "timing": "Pair means + centered covariance + correlation",
        "transfers": "",
        "validation": "PASS (151 pairs / tolerance 1.0E-010)",
        "formula": "",
        "operations_description": "Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 71.516,
        "upload_ms": null,
        "gpu_timing": "",
        "gpu_e2e_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 85.7336,
        "simd_average_ms": 34.971399999999996,
        "cpu_median_ms": 86.048,
        "simd_median_ms": 34.488,
        "cpu_min_ms": 83.638,
        "simd_min_ms": 33.416,
        "cpu_max_ms": 87.445,
        "simd_max_ms": 36.952,
        "cpu_stdev_ms": 1.4567921265575223,
        "simd_stdev_ms": 1.5572343433150972,
        "speedup": 2.451534682626375,
        "cpu_gflops": 10.374215,
        "simd_gflops": 25.432902,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.857337,
        "simd_per_run_ms": 0.349712,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232,
        "gpu_e2e_average_ms": null,
        "gpu_e2e_median_ms": null,
        "gpu_e2e_min_ms": null,
        "gpu_e2e_speedup": null
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 86.048,
          "simd_ms": 33.416,
          "speedup": 2.5750538664113,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 86.499,
          "simd_ms": 36.952,
          "speedup": 2.3408475860575884,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 87.445,
          "simd_ms": 34.488,
          "speedup": 2.5355196010206447,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 83.638,
          "simd_ms": 36.25,
          "speedup": 2.307255172413793,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 85.038,
          "simd_ms": 33.751,
          "speedup": 2.5195697905247254,
          "gpu_e2e_ms": null
        }
      ],
      "top_pairs": [
        {
          "rank": 1,
          "region_a": "전남광주",
          "region_b": "경기",
          "samples": 97,
          "correlation": 0.969112097612
        },
        {
          "rank": 2,
          "region_a": "전남광주",
          "region_b": "충남",
          "samples": 97,
          "correlation": 0.966010194323
        },
        {
          "rank": 3,
          "region_a": "충남",
          "region_b": "경북",
          "samples": 6748,
          "correlation": 0.963612910272
        },
        {
          "rank": 4,
          "region_a": "전남광주",
          "region_b": "경남",
          "samples": 97,
          "correlation": 0.960824402513
        },
        {
          "rank": 5,
          "region_a": "전남광주",
          "region_b": "경북",
          "samples": 97,
          "correlation": 0.959174627152
        },
        {
          "rank": 6,
          "region_a": "전남광주",
          "region_b": "강원",
          "samples": 97,
          "correlation": 0.9561147653
        },
        {
          "rank": 7,
          "region_a": "충남",
          "region_b": "경남",
          "samples": 6748,
          "correlation": 0.949430636659
        },
        {
          "rank": 8,
          "region_a": "전남광주",
          "region_b": "충북",
          "samples": 97,
          "correlation": 0.946984550598
        },
        {
          "rank": 9,
          "region_a": "충북",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946816397324
        },
        {
          "rank": 10,
          "region_a": "강원",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946400963549
        }
      ],
      "warnings": []
    },
    {
      "id": "result-4",
      "label": "Go · go1.27.3-X:simd / amd64",
      "detail": "go1.27.3-X:simd / amd64",
      "backend": "CPU SIMD",
      "metadata": {
        "runner": "go1.27.3-X:simd / amd64",
        "compiler": "",
        "runtime": "go1.27.3-X:simd / amd64",
        "environment": "linux / 32 logical CPUs / GOMAXPROCS=32",
        "device": "",
        "test": "Pearson correlation of daily price changes / float64",
        "cpu_description": "Scalar / single thread",
        "simd_description": "AVX 256-bit / 4 doubles / single thread",
        "array": "6749 dates / 18 region columns / 112959 valid prices",
        "loops": 100,
        "trial_count": 5,
        "repeat_description": "100 per trial",
        "timing": "Pair means + centered covariance + correlation",
        "transfers": "",
        "validation": "PASS (151 pairs / tolerance 1.0e-10)",
        "formula": "",
        "operations_description": "Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 27.171,
        "upload_ms": null,
        "gpu_timing": "",
        "gpu_e2e_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 84.962,
        "simd_average_ms": 42.617799999999995,
        "cpu_median_ms": 85.074,
        "simd_median_ms": 42.35,
        "cpu_min_ms": 80.983,
        "simd_min_ms": 41.788,
        "cpu_max_ms": 87.6,
        "simd_max_ms": 44.044,
        "cpu_stdev_ms": 2.7538214357506887,
        "simd_stdev_ms": 0.9583752918350922,
        "speedup": 1.9935801472624117,
        "cpu_gflops": 10.468441,
        "simd_gflops": 20.86961,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.84962,
        "simd_per_run_ms": 0.426179,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232,
        "gpu_e2e_average_ms": null,
        "gpu_e2e_median_ms": null,
        "gpu_e2e_min_ms": null,
        "gpu_e2e_speedup": null
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 87.6,
          "simd_ms": 41.788,
          "speedup": 2.0962955872499283,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 83.736,
          "simd_ms": 43.096,
          "speedup": 1.9430109522925565,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 85.074,
          "simd_ms": 42.35,
          "speedup": 2.008831168831169,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 80.983,
          "simd_ms": 44.044,
          "speedup": 1.838684043229498,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 87.417,
          "simd_ms": 41.811,
          "speedup": 2.090765588003157,
          "gpu_e2e_ms": null
        }
      ],
      "top_pairs": [
        {
          "rank": 1,
          "region_a": "전남광주",
          "region_b": "경기",
          "samples": 97,
          "correlation": 0.969112097612
        },
        {
          "rank": 2,
          "region_a": "전남광주",
          "region_b": "충남",
          "samples": 97,
          "correlation": 0.966010194323
        },
        {
          "rank": 3,
          "region_a": "충남",
          "region_b": "경북",
          "samples": 6748,
          "correlation": 0.963612910272
        },
        {
          "rank": 4,
          "region_a": "전남광주",
          "region_b": "경남",
          "samples": 97,
          "correlation": 0.960824402513
        },
        {
          "rank": 5,
          "region_a": "전남광주",
          "region_b": "경북",
          "samples": 97,
          "correlation": 0.959174627152
        },
        {
          "rank": 6,
          "region_a": "전남광주",
          "region_b": "강원",
          "samples": 97,
          "correlation": 0.9561147653
        },
        {
          "rank": 7,
          "region_a": "충남",
          "region_b": "경남",
          "samples": 6748,
          "correlation": 0.949430636659
        },
        {
          "rank": 8,
          "region_a": "전남광주",
          "region_b": "충북",
          "samples": 97,
          "correlation": 0.946984550598
        },
        {
          "rank": 9,
          "region_a": "충북",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946816397324
        },
        {
          "rank": 10,
          "region_a": "강원",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946400963549
        }
      ],
      "warnings": []
    },
    {
      "id": "result-5",
      "label": "C++ · Intel oneAPI 2026.2.0",
      "detail": "Intel oneAPI 2026.2.0",
      "backend": "CPU SIMD",
      "metadata": {
        "runner": "Intel oneAPI 2026.2.0",
        "compiler": "Intel oneAPI 2026.2.0",
        "runtime": "",
        "environment": "Linux / x86_64 / 32 logical CPUs",
        "device": "",
        "test": "Pearson correlation of daily price changes / float64",
        "cpu_description": "Scalar / single thread",
        "simd_description": "AVX 256-bit / 4 doubles / single thread",
        "array": "6749 dates / 18 region columns / 112959 valid prices",
        "loops": 100,
        "trial_count": 5,
        "repeat_description": "100 per trial",
        "timing": "Pair means + centered covariance + correlation",
        "transfers": "",
        "validation": "PASS (151 pairs / tolerance 1.0e-10)",
        "formula": "",
        "operations_description": "Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 32.106,
        "upload_ms": null,
        "gpu_timing": "",
        "gpu_e2e_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 80.6078,
        "simd_average_ms": 28.148600000000002,
        "cpu_median_ms": 80.618,
        "simd_median_ms": 26.881,
        "cpu_min_ms": 76.3,
        "simd_min_ms": 26.376,
        "cpu_max_ms": 85.822,
        "simd_max_ms": 31.182,
        "cpu_stdev_ms": 3.9971279939476547,
        "simd_stdev_ms": 2.117994169019357,
        "speedup": 2.8636521887411805,
        "cpu_gflops": 11.033938,
        "simd_gflops": 31.597113,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.806076,
        "simd_per_run_ms": 0.281488,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232,
        "gpu_e2e_average_ms": null,
        "gpu_e2e_median_ms": null,
        "gpu_e2e_min_ms": null,
        "gpu_e2e_speedup": null
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 85.822,
          "simd_ms": 29.565,
          "speedup": 2.902824285472687,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 76.3,
          "simd_ms": 26.739,
          "speedup": 2.8535098545196154,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 77.171,
          "simd_ms": 26.376,
          "speedup": 2.9258037609948437,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 80.618,
          "simd_ms": 26.881,
          "speedup": 2.999069975075332,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 83.128,
          "simd_ms": 31.182,
          "speedup": 2.665896991854275,
          "gpu_e2e_ms": null
        }
      ],
      "top_pairs": [
        {
          "rank": 1,
          "region_a": "전남광주",
          "region_b": "경기",
          "samples": 97,
          "correlation": 0.969112097612
        },
        {
          "rank": 2,
          "region_a": "전남광주",
          "region_b": "충남",
          "samples": 97,
          "correlation": 0.966010194323
        },
        {
          "rank": 3,
          "region_a": "충남",
          "region_b": "경북",
          "samples": 6748,
          "correlation": 0.963612910272
        },
        {
          "rank": 4,
          "region_a": "전남광주",
          "region_b": "경남",
          "samples": 97,
          "correlation": 0.960824402513
        },
        {
          "rank": 5,
          "region_a": "전남광주",
          "region_b": "경북",
          "samples": 97,
          "correlation": 0.959174627152
        },
        {
          "rank": 6,
          "region_a": "전남광주",
          "region_b": "강원",
          "samples": 97,
          "correlation": 0.9561147653
        },
        {
          "rank": 7,
          "region_a": "충남",
          "region_b": "경남",
          "samples": 6748,
          "correlation": 0.949430636659
        },
        {
          "rank": 8,
          "region_a": "전남광주",
          "region_b": "충북",
          "samples": 97,
          "correlation": 0.946984550598
        },
        {
          "rank": 9,
          "region_a": "충북",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946816397324
        },
        {
          "rank": 10,
          "region_a": "강원",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946400963549
        }
      ],
      "warnings": []
    },
    {
      "id": "result-6",
      "label": "Python · Python 3.14.4 / PyTorch 2.14.1+cu132",
      "detail": "Python 3.14.4 / PyTorch 2.14.1+cu132",
      "backend": "CUDA GPU",
      "metadata": {
        "runner": "Python 3.14.4 / PyTorch 2.14.1+cu132",
        "compiler": "",
        "runtime": "Python 3.14.4 / PyTorch 2.14.1+cu132",
        "environment": "Linux 6.18.54.1-microsoft-standard-WSL2 / x86_64 / 32 logical CPUs / CPU model unavailable",
        "device": "NVIDIA GeForce RTX 3090",
        "test": "Pearson correlation of daily price changes / float64",
        "cpu_description": "PyTorch CPU tensor operations / single thread / not scalar",
        "simd_description": "PyTorch CUDA GPU / float64 / GPU reported as SIMD",
        "array": "6749 dates / 18 region columns / 112959 valid prices",
        "loops": 100,
        "trial_count": 5,
        "repeat_description": "100 per trial",
        "timing": "Wall time; means + centered covariance + correlation; tensor temporaries included",
        "transfers": "Excluded from timing; inputs remain on device",
        "validation": "PASS (151 pairs / tolerance 1.0e-10)",
        "formula": "",
        "operations_description": "Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 174.528,
        "upload_ms": 4.457,
        "gpu_timing": "Python dispatch + kernel launches + final sync included",
        "gpu_e2e_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 484.4664,
        "simd_average_ms": 51.686,
        "cpu_median_ms": 459.096,
        "simd_median_ms": 50.483,
        "cpu_min_ms": 435.367,
        "simd_min_ms": 46.283,
        "cpu_max_ms": 563.428,
        "simd_max_ms": 56.143,
        "cpu_stdev_ms": 56.36946719013759,
        "simd_stdev_ms": 4.196000476644397,
        "speedup": 9.373261618233178,
        "cpu_gflops": 1.835874,
        "simd_gflops": 17.208107,
        "max_abs_error": 5.55111512313e-16,
        "cpu_per_run_ms": 4.844665,
        "simd_per_run_ms": 0.516861,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232,
        "gpu_e2e_average_ms": null,
        "gpu_e2e_median_ms": null,
        "gpu_e2e_min_ms": null,
        "gpu_e2e_speedup": null
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 563.428,
          "simd_ms": 50.483,
          "speedup": 11.160747182219758,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 523.516,
          "simd_ms": 46.283,
          "speedup": 11.31119417496705,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 459.096,
          "simd_ms": 55.728,
          "speedup": 8.238156761412576,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 435.367,
          "simd_ms": 49.793,
          "speedup": 8.743538248348163,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 440.925,
          "simd_ms": 56.143,
          "speedup": 7.853605970468268,
          "gpu_e2e_ms": null
        }
      ],
      "top_pairs": [
        {
          "rank": 1,
          "region_a": "전남광주",
          "region_b": "경기",
          "samples": 97,
          "correlation": 0.969112097612
        },
        {
          "rank": 2,
          "region_a": "전남광주",
          "region_b": "충남",
          "samples": 97,
          "correlation": 0.966010194323
        },
        {
          "rank": 3,
          "region_a": "충남",
          "region_b": "경북",
          "samples": 6748,
          "correlation": 0.963612910272
        },
        {
          "rank": 4,
          "region_a": "전남광주",
          "region_b": "경남",
          "samples": 97,
          "correlation": 0.960824402513
        },
        {
          "rank": 5,
          "region_a": "전남광주",
          "region_b": "경북",
          "samples": 97,
          "correlation": 0.959174627152
        },
        {
          "rank": 6,
          "region_a": "전남광주",
          "region_b": "강원",
          "samples": 97,
          "correlation": 0.9561147653
        },
        {
          "rank": 7,
          "region_a": "충남",
          "region_b": "경남",
          "samples": 6748,
          "correlation": 0.949430636659
        },
        {
          "rank": 8,
          "region_a": "전남광주",
          "region_b": "충북",
          "samples": 97,
          "correlation": 0.946984550598
        },
        {
          "rank": 9,
          "region_a": "충북",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946816397324
        },
        {
          "rank": 10,
          "region_a": "강원",
          "region_b": "충남",
          "samples": 6748,
          "correlation": 0.946400963549
        }
      ],
      "warnings": []
    }
  ]
};
