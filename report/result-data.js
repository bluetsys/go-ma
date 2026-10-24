window.BENCHMARK_REPORT = {
  "schema_version": 1,
  "source_file": "report/results.txt",
  "generated_at": "2026-10-24T16:34:30.448434+00:00",
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
        "preprocess_ms": 31.306,
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
        "cpu_average_ms": 79.834,
        "simd_average_ms": 29.1926,
        "cpu_median_ms": 79.034,
        "simd_median_ms": 29.714,
        "cpu_min_ms": 77.154,
        "simd_min_ms": 27.555,
        "cpu_max_ms": 84.116,
        "simd_max_ms": 30.342,
        "cpu_stdev_ms": 3.010304220506626,
        "simd_stdev_ms": 1.26543581425531,
        "speedup": 2.7347341449545435,
        "cpu_gflops": 11.140848,
        "simd_gflops": 30.467472,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.798341,
        "simd_per_run_ms": 0.291924,
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
          "cpu_ms": 84.116,
          "simd_ms": 27.555,
          "speedup": 3.052658319724188,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 79.034,
          "simd_ms": 29.714,
          "speedup": 2.659823652150502,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 77.223,
          "simd_ms": 30.342,
          "speedup": 2.5450860193790787,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 81.643,
          "simd_ms": 30.208,
          "speedup": 2.702694650423729,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 77.154,
          "simd_ms": 28.144,
          "speedup": 2.7414013644115975,
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
        "preprocess_ms": 28.708,
        "upload_ms": 7.525,
        "gpu_timing": "Launch + final synchronization included; transfers excluded",
        "gpu_e2e_timing": "Allocation + packing + H2D + kernel + D2H included",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 81.2022,
        "simd_average_ms": 6.263,
        "cpu_median_ms": 81.268,
        "simd_median_ms": 6.318,
        "cpu_min_ms": 78.519,
        "simd_min_ms": 6.151,
        "cpu_max_ms": 84.188,
        "simd_max_ms": 6.355,
        "cpu_stdev_ms": 2.041620116476127,
        "simd_stdev_ms": 0.10172266217515159,
        "speedup": 12.965384001277345,
        "cpu_gflops": 10.953159,
        "simd_gflops": 142.008291,
        "max_abs_error": 3.88578058619e-15,
        "cpu_per_run_ms": 0.812021,
        "simd_per_run_ms": 0.062632,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232,
        "gpu_e2e_average_ms": 641.748,
        "gpu_e2e_median_ms": 637.899,
        "gpu_e2e_min_ms": 629.569,
        "gpu_e2e_speedup": 0.12653284466800052
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 80.525,
          "simd_ms": 6.355,
          "speedup": 12.671125098347758,
          "gpu_e2e_ms": 637.899
        },
        {
          "trial": 2,
          "cpu_ms": 84.188,
          "simd_ms": 6.151,
          "speedup": 13.686880182084215,
          "gpu_e2e_ms": 663.361
        },
        {
          "trial": 3,
          "cpu_ms": 81.268,
          "simd_ms": 6.318,
          "speedup": 12.862931307375753,
          "gpu_e2e_ms": 645.267
        },
        {
          "trial": 4,
          "cpu_ms": 81.511,
          "simd_ms": 6.154,
          "speedup": 13.245206369840753,
          "gpu_e2e_ms": 632.644
        },
        {
          "trial": 5,
          "cpu_ms": 78.519,
          "simd_ms": 6.337,
          "speedup": 12.390563358055864,
          "gpu_e2e_ms": 629.569
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
        "preprocess_ms": 69.051,
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
        "cpu_average_ms": 82.3824,
        "simd_average_ms": 31.0008,
        "cpu_median_ms": 82.843,
        "simd_median_ms": 31.438,
        "cpu_min_ms": 80.079,
        "simd_min_ms": 27.945,
        "cpu_max_ms": 83.678,
        "simd_max_ms": 34.027,
        "cpu_stdev_ms": 1.4599439372797878,
        "simd_stdev_ms": 2.6064829176497595,
        "speedup": 2.657428195401409,
        "cpu_gflops": 10.796236,
        "simd_gflops": 28.690326,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.823824,
        "simd_per_run_ms": 0.310007,
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
          "cpu_ms": 82.843,
          "simd_ms": 28.747,
          "speedup": 2.8817963613594464,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 81.888,
          "simd_ms": 34.027,
          "speedup": 2.4065594968701327,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 83.424,
          "simd_ms": 31.438,
          "speedup": 2.653603918824353,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 80.079,
          "simd_ms": 32.847,
          "speedup": 2.4379395378573383,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 83.678,
          "simd_ms": 27.945,
          "speedup": 2.9943818214349616,
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
        "preprocess_ms": 30.832,
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
        "cpu_average_ms": 85.489,
        "simd_average_ms": 42.9656,
        "cpu_median_ms": 85.306,
        "simd_median_ms": 44.295,
        "cpu_min_ms": 83.298,
        "simd_min_ms": 39.244,
        "cpu_max_ms": 86.966,
        "simd_max_ms": 45.71,
        "cpu_stdev_ms": 1.509951654855212,
        "simd_stdev_ms": 3.131885422553002,
        "speedup": 1.9897080455061724,
        "cpu_gflops": 10.403919,
        "simd_gflops": 20.700724,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.854889,
        "simd_per_run_ms": 0.429656,
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
          "cpu_ms": 83.298,
          "simd_ms": 39.959,
          "speedup": 2.084586701368903,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 86.86,
          "simd_ms": 45.62,
          "speedup": 1.9039894782989917,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 86.966,
          "simd_ms": 44.295,
          "speedup": 1.9633367197200584,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 85.306,
          "simd_ms": 45.71,
          "speedup": 1.866243710347845,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 85.015,
          "simd_ms": 39.244,
          "speedup": 2.16631841810213,
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
        "preprocess_ms": 30.029,
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
        "cpu_average_ms": 82.2952,
        "simd_average_ms": 28.5946,
        "cpu_median_ms": 81.979,
        "simd_median_ms": 28.226,
        "cpu_min_ms": 76.977,
        "simd_min_ms": 25.988,
        "cpu_max_ms": 87.962,
        "simd_max_ms": 33.322,
        "cpu_stdev_ms": 3.920254545306975,
        "simd_stdev_ms": 2.966869360116823,
        "speedup": 2.8779979436676855,
        "cpu_gflops": 10.807677,
        "simd_gflops": 31.104463,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.822952,
        "simd_per_run_ms": 0.285946,
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
          "cpu_ms": 82.978,
          "simd_ms": 25.988,
          "speedup": 3.1929352008619363,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 76.977,
          "simd_ms": 26.236,
          "speedup": 2.934021954566245,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 81.979,
          "simd_ms": 28.226,
          "speedup": 2.9043789414015446,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 81.58,
          "simd_ms": 29.201,
          "speedup": 2.7937399404129994,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 87.962,
          "simd_ms": 33.322,
          "speedup": 2.639757517555969,
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
        "preprocess_ms": 185.356,
        "upload_ms": 4.157,
        "gpu_timing": "Python dispatch + kernel launches + final sync included",
        "gpu_e2e_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 495.3408,
        "simd_average_ms": 50.7308,
        "cpu_median_ms": 471.882,
        "simd_median_ms": 50.531,
        "cpu_min_ms": 448.747,
        "simd_min_ms": 45.043,
        "cpu_max_ms": 570.135,
        "simd_max_ms": 57.235,
        "cpu_stdev_ms": 51.331841202123265,
        "simd_stdev_ms": 4.688454670784394,
        "speedup": 9.764103858011307,
        "cpu_gflops": 1.795571,
        "simd_gflops": 17.532172,
        "max_abs_error": 5.55111512313e-16,
        "cpu_per_run_ms": 4.953407,
        "simd_per_run_ms": 0.507307,
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
          "cpu_ms": 570.135,
          "simd_ms": 52.976,
          "speedup": 10.762137571730594,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 526.235,
          "simd_ms": 47.869,
          "speedup": 10.993231527711044,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 459.705,
          "simd_ms": 50.531,
          "speedup": 9.097484712354792,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 471.882,
          "simd_ms": 57.235,
          "speedup": 8.24464051716607,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 448.747,
          "simd_ms": 45.043,
          "speedup": 9.962635703660947,
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
      "id": "result-7",
      "label": "Python · Python 3.14.4 / pure Python CPU",
      "detail": "Python 3.14.4 / pure Python CPU",
      "backend": "CPU",
      "metadata": {
        "runner": "Python 3.14.4 / pure Python CPU",
        "compiler": "",
        "runtime": "Python 3.14.4 / pure Python CPU",
        "environment": "Linux / x86_64 / single thread",
        "device": "",
        "test": "Pearson correlation of daily price changes / float64",
        "cpu_description": "Pure Python scalar loops / no PyTorch / single thread",
        "simd_description": "",
        "array": "6749 dates / 18 region columns / 112959 valid prices",
        "loops": 100,
        "trial_count": 5,
        "repeat_description": "100 per trial",
        "timing": "Wall time; pair means + centered covariance + correlation",
        "transfers": "",
        "validation": "PASS (151 pairs / tolerance 1.0e-10)",
        "formula": "",
        "operations_description": "Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes comparisons",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 143.653,
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
        "cpu_average_ms": 5460.2904,
        "simd_average_ms": null,
        "cpu_median_ms": 5431.681,
        "simd_median_ms": null,
        "cpu_min_ms": 5429.346,
        "simd_min_ms": null,
        "cpu_max_ms": 5522.577,
        "simd_max_ms": null,
        "cpu_stdev_ms": 42.93306179158449,
        "simd_stdev_ms": null,
        "speedup": null,
        "cpu_gflops": 0.162889,
        "simd_gflops": null,
        "max_abs_error": 3.88578058619e-15,
        "cpu_per_run_ms": 54.602906,
        "simd_per_run_ms": null,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": null,
        "gpu_e2e_average_ms": null,
        "gpu_e2e_median_ms": null,
        "gpu_e2e_min_ms": null,
        "gpu_e2e_speedup": null
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 5429.346,
          "simd_ms": null,
          "speedup": null,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 5522.577,
          "simd_ms": null,
          "speedup": null,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 5429.653,
          "simd_ms": null,
          "speedup": null,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 5488.195,
          "simd_ms": null,
          "speedup": null,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 5431.681,
          "simd_ms": null,
          "speedup": null,
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
