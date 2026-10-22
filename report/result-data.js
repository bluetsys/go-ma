window.BENCHMARK_REPORT = {
  "schema_version": 1,
  "source_file": "report\\results.txt",
  "generated_at": "2026-10-22T02:18:34.805585+00:00",
  "results": [
    {
      "id": "result-1",
      "label": "C++ · GCC 13.3.0",
      "detail": "GCC 13.3.0",
      "backend": "CPU SIMD",
      "metadata": {
        "runner": "GCC 13.3.0",
        "compiler": "GCC 13.3.0",
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
        "operations_description": "",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 35.501,
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
        "cpu_average_ms": 95.215,
        "simd_average_ms": 36.178,
        "cpu_median_ms": 94.914,
        "simd_median_ms": 33.057,
        "cpu_min_ms": 87.276,
        "simd_min_ms": 32.617,
        "cpu_max_ms": 109.678,
        "simd_max_ms": 43.744,
        "cpu_stdev_ms": 8.859704227568772,
        "simd_stdev_ms": 4.953599045138796,
        "speedup": 2.6318480844712258,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.95215,
        "simd_per_run_ms": 0.361779,
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
          "cpu_ms": 88.763,
          "simd_ms": 32.728,
          "speedup": 2.712142507944268,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 94.914,
          "simd_ms": 32.617,
          "speedup": 2.9099549314774507,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 109.678,
          "simd_ms": 43.744,
          "speedup": 2.507269568397952,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 95.444,
          "simd_ms": 38.744,
          "speedup": 2.46345240553376,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 87.276,
          "simd_ms": 33.057,
          "speedup": 2.6401669842998454,
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
      "detail": "NVIDIA CUDA 12.0",
      "backend": "CUDA GPU",
      "metadata": {
        "runner": "NVIDIA CUDA 12.0",
        "compiler": "NVIDIA CUDA 12.0",
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
        "operations_description": "",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 39.684,
        "upload_ms": 9.779,
        "gpu_timing": "Launch + final synchronization included; transfers excluded",
        "gpu_e2e_timing": "Allocation + packing + H2D + kernel + D2H included",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 98.7582,
        "simd_average_ms": 6.6621999999999995,
        "cpu_median_ms": 102.138,
        "simd_median_ms": 6.64,
        "cpu_min_ms": 88.166,
        "simd_min_ms": 6.379,
        "cpu_max_ms": 111.264,
        "simd_max_ms": 6.919,
        "cpu_stdev_ms": 9.743745901859308,
        "simd_stdev_ms": 0.2129335577122591,
        "speedup": 14.823661853441807,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 3.88578058619e-15,
        "cpu_per_run_ms": 0.987581,
        "simd_per_run_ms": 0.066621,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232,
        "gpu_e2e_average_ms": 800.0964,
        "gpu_e2e_median_ms": 795.91,
        "gpu_e2e_min_ms": 724.43,
        "gpu_e2e_speedup": 0.12343287633840122
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 102.659,
          "simd_ms": 6.64,
          "speedup": 15.46069277108434,
          "gpu_e2e_ms": 865.287
        },
        {
          "trial": 2,
          "cpu_ms": 111.264,
          "simd_ms": 6.919,
          "speedup": 16.080936551524786,
          "gpu_e2e_ms": 795.91
        },
        {
          "trial": 3,
          "cpu_ms": 89.564,
          "simd_ms": 6.557,
          "speedup": 13.659295409486043,
          "gpu_e2e_ms": 724.43
        },
        {
          "trial": 4,
          "cpu_ms": 88.166,
          "simd_ms": 6.379,
          "speedup": 13.821288603229346,
          "gpu_e2e_ms": 828.254
        },
        {
          "trial": 5,
          "cpu_ms": 102.138,
          "simd_ms": 6.816,
          "speedup": 14.985035211267606,
          "gpu_e2e_ms": 786.601
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
        "environment": "Ubuntu 24.04.5 LTS / X64 / 32 logical CPUs",
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
        "operations_description": "",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 99.22,
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
        "cpu_average_ms": 101.9404,
        "simd_average_ms": 38.8192,
        "cpu_median_ms": 96.109,
        "simd_median_ms": 37.972,
        "cpu_min_ms": 84.781,
        "simd_min_ms": 34.985,
        "cpu_max_ms": 137.956,
        "simd_max_ms": 46.228,
        "cpu_stdev_ms": 21.219942137055885,
        "simd_stdev_ms": 4.442483055679561,
        "speedup": 2.6260304179375153,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 1.019402,
        "simd_per_run_ms": 0.388194,
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
          "cpu_ms": 102.164,
          "simd_ms": 34.985,
          "speedup": 2.920222952694012,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 88.692,
          "simd_ms": 35.888,
          "speedup": 2.4713553276861346,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 96.109,
          "simd_ms": 37.972,
          "speedup": 2.5310491941430526,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 84.781,
          "simd_ms": 39.023,
          "speedup": 2.172590523537401,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 137.956,
          "simd_ms": 46.228,
          "speedup": 2.9842519685039366,
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
      "label": "Go · go1.27.1-X:simd / amd64",
      "detail": "go1.27.1-X:simd / amd64",
      "backend": "CPU SIMD",
      "metadata": {
        "runner": "go1.27.1-X:simd / amd64",
        "compiler": "",
        "runtime": "go1.27.1-X:simd / amd64",
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
        "operations_description": "",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 27.379,
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
        "cpu_average_ms": 102.0768,
        "simd_average_ms": 52.5546,
        "cpu_median_ms": 96.104,
        "simd_median_ms": 52.904,
        "cpu_min_ms": 89.919,
        "simd_min_ms": 47.688,
        "cpu_max_ms": 115.345,
        "simd_max_ms": 56.718,
        "cpu_stdev_ms": 11.624571570599924,
        "simd_stdev_ms": 3.2237905949363403,
        "speedup": 1.9423000079916888,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 1.020767,
        "simd_per_run_ms": 0.525549,
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
          "cpu_ms": 115.345,
          "simd_ms": 53.161,
          "speedup": 2.169729689057768,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 96.104,
          "simd_ms": 56.718,
          "speedup": 1.694417997813745,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 113.705,
          "simd_ms": 47.688,
          "speedup": 2.3843524576413353,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 89.919,
          "simd_ms": 52.904,
          "speedup": 1.6996635415091486,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 95.311,
          "simd_ms": 52.302,
          "speedup": 1.8223203701579291,
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
        "operations_description": "",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 47.357,
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
        "cpu_average_ms": 91.9064,
        "simd_average_ms": 35.341,
        "cpu_median_ms": 84.551,
        "simd_median_ms": 34.407,
        "cpu_min_ms": 83.328,
        "simd_min_ms": 30.778,
        "cpu_max_ms": 104.975,
        "simd_max_ms": 40.811,
        "cpu_stdev_ms": 10.72473308758777,
        "simd_stdev_ms": 3.8679521067355536,
        "speedup": 2.600560255793554,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.919064,
        "simd_per_run_ms": 0.353412,
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
          "cpu_ms": 104.975,
          "simd_ms": 37.383,
          "speedup": 2.8080945884492947,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 102.213,
          "simd_ms": 40.811,
          "speedup": 2.5045453431672833,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 84.465,
          "simd_ms": 34.407,
          "speedup": 2.454878367774,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 83.328,
          "simd_ms": 33.326,
          "speedup": 2.5003900858188803,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 84.551,
          "simd_ms": 30.778,
          "speedup": 2.7471245694976933,
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
      "label": "Python · Python 3.12.3 / PyTorch 2.14.0+cu130",
      "detail": "Python 3.12.3 / PyTorch 2.14.0+cu130",
      "backend": "CUDA GPU",
      "metadata": {
        "runner": "Python 3.12.3 / PyTorch 2.14.0+cu130",
        "compiler": "",
        "runtime": "Python 3.12.3 / PyTorch 2.14.0+cu130",
        "environment": "Linux 6.18.54.1-microsoft-standard-WSL2 / x86_64 / 32 logical CPUs / x86_64",
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
        "operations_description": "Identical padded batched tensor operations on CPU/GPU; padding masked",
        "file": "Datas/주유소_지역별_평균판매가격-자동차용경유.csv",
        "period": "20080415 - 20261006",
        "pairs": 151,
        "observations": 889329,
        "missing": 8523,
        "preprocess_ms": 238.662,
        "upload_ms": 6.215,
        "gpu_timing": "Python dispatch + kernel launches + final sync included",
        "gpu_e2e_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 696.9964,
        "simd_average_ms": 49.9982,
        "cpu_median_ms": 697.886,
        "simd_median_ms": 49.679,
        "cpu_min_ms": 599.079,
        "simd_min_ms": 48.552,
        "cpu_max_ms": 794.455,
        "simd_max_ms": 52.48,
        "cpu_stdev_ms": 69.13009808903792,
        "simd_stdev_ms": 1.5685804729117334,
        "speedup": 13.940429855474799,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 5.55111512313e-16,
        "cpu_per_run_ms": 6.969964,
        "simd_per_run_ms": 0.499983,
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
          "cpu_ms": 692.973,
          "simd_ms": 48.552,
          "speedup": 14.272800296589223,
          "gpu_e2e_ms": null
        },
        {
          "trial": 2,
          "cpu_ms": 794.455,
          "simd_ms": 49.679,
          "speedup": 15.991767145071359,
          "gpu_e2e_ms": null
        },
        {
          "trial": 3,
          "cpu_ms": 700.589,
          "simd_ms": 50.425,
          "speedup": 13.893683688646506,
          "gpu_e2e_ms": null
        },
        {
          "trial": 4,
          "cpu_ms": 697.886,
          "simd_ms": 48.855,
          "speedup": 14.284842902466483,
          "gpu_e2e_ms": null
        },
        {
          "trial": 5,
          "cpu_ms": 599.079,
          "simd_ms": 52.48,
          "speedup": 11.415377286585366,
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
