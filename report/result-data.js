window.BENCHMARK_REPORT = {
  "schema_version": 1,
  "source_file": "report/results.txt",
  "generated_at": "2026-10-22T01:25:48.537451+00:00",
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
        "preprocess_ms": 36.28,
        "upload_ms": null,
        "gpu_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 88.7176,
        "simd_average_ms": 33.2362,
        "cpu_median_ms": 88.817,
        "simd_median_ms": 32.932,
        "cpu_min_ms": 87.465,
        "simd_min_ms": 31.535,
        "cpu_max_ms": 89.836,
        "simd_max_ms": 34.629,
        "cpu_stdev_ms": 0.8440842967381854,
        "simd_stdev_ms": 1.3505656962917432,
        "speedup": 2.6693063587293375,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.887174,
        "simd_per_run_ms": 0.332362,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 89.836,
          "simd_ms": 34.587,
          "speedup": 2.597392083730881
        },
        {
          "trial": 2,
          "cpu_ms": 88.636,
          "simd_ms": 34.629,
          "speedup": 2.5595887839671954
        },
        {
          "trial": 3,
          "cpu_ms": 87.465,
          "simd_ms": 32.932,
          "speedup": 2.655927365480384
        },
        {
          "trial": 4,
          "cpu_ms": 88.817,
          "simd_ms": 32.498,
          "speedup": 2.732998953781771
        },
        {
          "trial": 5,
          "cpu_ms": 88.834,
          "simd_ms": 31.535,
          "speedup": 2.816996987474235
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
        "preprocess_ms": 33.395,
        "upload_ms": 8.098,
        "gpu_timing": "Launch + final synchronization included; transfers excluded",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 93.9448,
        "simd_average_ms": 6.8624,
        "cpu_median_ms": 89.211,
        "simd_median_ms": 6.855,
        "cpu_min_ms": 83.806,
        "simd_min_ms": 6.334,
        "cpu_max_ms": 107.671,
        "simd_max_ms": 7.384,
        "cpu_stdev_ms": 11.163702553364635,
        "simd_stdev_ms": 0.4092716701654296,
        "speedup": 13.689787829330847,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 3.88578058619e-15,
        "cpu_per_run_ms": 0.939449,
        "simd_per_run_ms": 0.068624,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 83.806,
          "simd_ms": 7.384,
          "speedup": 11.349674972914409
        },
        {
          "trial": 2,
          "cpu_ms": 84.92,
          "simd_ms": 6.855,
          "speedup": 12.388037928519328
        },
        {
          "trial": 3,
          "cpu_ms": 89.211,
          "simd_ms": 6.334,
          "speedup": 14.084464793179666
        },
        {
          "trial": 4,
          "cpu_ms": 104.116,
          "simd_ms": 7.113,
          "speedup": 14.637424434134681
        },
        {
          "trial": 5,
          "cpu_ms": 107.671,
          "simd_ms": 6.626,
          "speedup": 16.249773619076365
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
        "preprocess_ms": 76.816,
        "upload_ms": null,
        "gpu_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 89.3832,
        "simd_average_ms": 32.9046,
        "cpu_median_ms": 87.537,
        "simd_median_ms": 32.275,
        "cpu_min_ms": 84.04,
        "simd_min_ms": 31.404,
        "cpu_max_ms": 97.913,
        "simd_max_ms": 36.038,
        "cpu_stdev_ms": 5.293894284928625,
        "simd_stdev_ms": 1.8228548488565934,
        "speedup": 2.7164347841943073,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.89383,
        "simd_per_run_ms": 0.329047,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 86.912,
          "simd_ms": 31.404,
          "speedup": 2.7675455356005605
        },
        {
          "trial": 2,
          "cpu_ms": 87.537,
          "simd_ms": 32.002,
          "speedup": 2.7353602899818763
        },
        {
          "trial": 3,
          "cpu_ms": 90.514,
          "simd_ms": 32.804,
          "speedup": 2.759236678453847
        },
        {
          "trial": 4,
          "cpu_ms": 84.04,
          "simd_ms": 32.275,
          "speedup": 2.603872966692487
        },
        {
          "trial": 5,
          "cpu_ms": 97.913,
          "simd_ms": 36.038,
          "speedup": 2.716937676896609
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
        "preprocess_ms": 25.836,
        "upload_ms": null,
        "gpu_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 97.849,
        "simd_average_ms": 52.6462,
        "cpu_median_ms": 94.17,
        "simd_median_ms": 51.034,
        "cpu_min_ms": 85.419,
        "simd_min_ms": 46.092,
        "cpu_max_ms": 116.125,
        "simd_max_ms": 66.075,
        "cpu_stdev_ms": 12.889446904347759,
        "simd_stdev_ms": 7.857898173175829,
        "speedup": 1.8586146768427732,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.978491,
        "simd_per_run_ms": 0.526463,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 105.714,
          "simd_ms": 66.075,
          "speedup": 1.5999091940976162
        },
        {
          "trial": 2,
          "cpu_ms": 85.419,
          "simd_ms": 51.919,
          "speedup": 1.6452358481480769
        },
        {
          "trial": 3,
          "cpu_ms": 87.817,
          "simd_ms": 46.092,
          "speedup": 1.9052547079753535
        },
        {
          "trial": 4,
          "cpu_ms": 94.17,
          "simd_ms": 48.111,
          "speedup": 1.9573486312901418
        },
        {
          "trial": 5,
          "cpu_ms": 116.125,
          "simd_ms": 51.034,
          "speedup": 2.2754438217658817
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
        "preprocess_ms": 39.722,
        "upload_ms": null,
        "gpu_timing": "",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 92.032,
        "simd_average_ms": 35.955,
        "cpu_median_ms": 87.156,
        "simd_median_ms": 32.418,
        "cpu_min_ms": 85.008,
        "simd_min_ms": 31.083,
        "cpu_max_ms": 104.548,
        "simd_max_ms": 44.865,
        "cpu_stdev_ms": 8.493425015857854,
        "simd_stdev_ms": 6.114588579781963,
        "speedup": 2.559643999443749,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 4.99600361081e-15,
        "cpu_per_run_ms": 0.920317,
        "simd_per_run_ms": 0.359549,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 104.548,
          "simd_ms": 44.865,
          "speedup": 2.330279728073108
        },
        {
          "trial": 2,
          "cpu_ms": 97.137,
          "simd_ms": 39.815,
          "speedup": 2.4397086525178953
        },
        {
          "trial": 3,
          "cpu_ms": 87.156,
          "simd_ms": 31.083,
          "speedup": 2.8039764501496
        },
        {
          "trial": 4,
          "cpu_ms": 86.311,
          "simd_ms": 31.594,
          "speedup": 2.7318794707855925
        },
        {
          "trial": 5,
          "cpu_ms": 85.008,
          "simd_ms": 32.418,
          "speedup": 2.6222468998704422
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
      "label": "C++ · Python 3.12.3 / PyTorch 2.14.0+cu130",
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
        "preprocess_ms": 211.955,
        "upload_ms": 4.416,
        "gpu_timing": "Python dispatch + kernel launches + final sync included",
        "tolerance": 1e-10,
        "undefined": 0,
        "sample_min": 97,
        "sample_median": 6748,
        "sample_max": 6748
      },
      "summary": {
        "cpu_average_ms": 666.1942,
        "simd_average_ms": 52.944199999999995,
        "cpu_median_ms": 680.185,
        "simd_median_ms": 52.001,
        "cpu_min_ms": 545.432,
        "simd_min_ms": 47.443,
        "cpu_max_ms": 744.67,
        "simd_max_ms": 62.565,
        "cpu_stdev_ms": 82.89265165984254,
        "simd_stdev_ms": 5.715727836417686,
        "speedup": 12.582949595989742,
        "cpu_gflops": null,
        "simd_gflops": null,
        "max_abs_error": 5.55111512313e-16,
        "cpu_per_run_ms": 6.661941,
        "simd_per_run_ms": 0.529443,
        "cpu_checksum": 123.937354174232,
        "simd_checksum": 123.937354174232
      },
      "trials": [
        {
          "trial": 1,
          "cpu_ms": 624.904,
          "simd_ms": 62.565,
          "speedup": 9.988076400543434
        },
        {
          "trial": 2,
          "cpu_ms": 680.185,
          "simd_ms": 52.336,
          "speedup": 12.996503362885967
        },
        {
          "trial": 3,
          "cpu_ms": 735.78,
          "simd_ms": 52.001,
          "speedup": 14.149343281859965
        },
        {
          "trial": 4,
          "cpu_ms": 744.67,
          "simd_ms": 50.376,
          "speedup": 14.782237573447674
        },
        {
          "trial": 5,
          "cpu_ms": 545.432,
          "simd_ms": 47.443,
          "speedup": 11.49657483717303
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
