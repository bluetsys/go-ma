# CPU · SIMD 벤치마크

C++, Intel oneAPI C++, CUDA, C#, Go, Python으로 구현한 주유소 지역별 평균 판매가격 데이터 처리 벤치마크입니다. 구현별 CPU 및 SIMD/GPU 실행 시간과 검증 결과를 `index.html`에서 비교할 수 있습니다.

추가로 `analyze/README.MD`의 실제 데이터 C# 분석 및 보고서 작성 예제와 `AppleSilicon/README.MD`의 Apple Silicon 벤치마크 내용을 추가할 예정입니다.

## 데이터 출처

원본 주유소 지역별 평균 판매가격 데이터는 한국석유공사 오피넷의 [지역별 평균 판매가격 조회](https://www.opinet.co.kr/user/dopospdrg/dopOsPdrgAreaView.do)에서 제공합니다. 저장소의 `Datas/` 폴더에 포함된 CSV 파일을 벤치마크 입력으로 사용합니다.

## 구성

- `cpp/`: C++ AVX2 및 Intel oneAPI C++ 구현
- `cuda/`: CUDA GPU 구현
- `dotnet/`: C# 구현
- `go/`: Go 구현
- `python/`: PyTorch 기반 Python 구현
- `Datas/`: 오피넷에서 제공하는 지역별 평균 판매가격 CSV 파일
- `report/`: 실행 결과 로그, HTML 보고서 데이터, 보고서 생성기
- `index.html`: 결과 시각화 페이지
- `build.sh`: 컴파일이 필요한 구현 빌드
- `run.sh`: 벤치마크 실행 및 보고서 데이터 생성

## 준비 사항

각 언어와 실행 환경의 설치 방법은 해당 언어의 공식 설치 안내를 참고하세요. 프로젝트는 Linux 또는 WSL 환경을 기준으로 하며, 사용할 구현에 필요한 컴파일러, SDK, 런타임과 라이브러리를 설치해야 합니다.

- C++: C++17 컴파일러 및 AVX2 지원 CPU
- Intel oneAPI C++: Intel oneAPI 설치 및 `icpx`
- CUDA: NVIDIA CUDA Toolkit, 지원되는 NVIDIA GPU 및 드라이버
- C#: .NET SDK
- Go: Go 도구체인
- Python: Python 3 및 Python 구현에 필요한 PyTorch 설치. CUDA 실행에는 CUDA를 지원하는 PyTorch와 호환되는 NVIDIA GPU 및 드라이버가 필요합니다.

`build.sh`는 C++, CUDA, C# 및 Go 프로그램을 빌드합니다. Intel oneAPI 환경의 `setvars.sh` 경로는 `cpp/build.sh`에 설정되어 있으므로, 설치 위치가 다르면 해당 경로를 환경에 맞게 수정하세요.

## 실행

프로젝트 루트에서 다음 명령을 실행합니다.

```bash
./build.sh
./run.sh
```

`run.sh`는 각 벤치마크를 실행해 출력을 `report/results.txt`에 저장하고, 완료 후 `report/result.json`과 `report/result-data.js`를 생성합니다. 실행 스크립트는 현재 프로젝트 폴더를 기준으로 경로를 설정합니다.

## 결과 보기

`index.html`을 브라우저에서 열어 생성된 결과를 확인합니다. 브라우저의 로컬 파일 접근 제한으로 결과가 표시되지 않으면 프로젝트 루트에서 간단한 HTTP 서버를 실행하고 `http://localhost:8000`으로 접속하세요.

```bash
python3 -m http.server 8000
```

## 측정 결과 해석

보고서의 시간 단위는 밀리초(ms)이며, CPU 실행 시간과 SIMD 또는 CUDA GPU 실행 시간을 비교합니다. CUDA 결과는 GPU에서 측정한 값입니다. 처리 결과는 구현별 검증 상태와 함께 표시됩니다. 실행 환경과 컴파일 옵션이 다르면 측정 결과도 달라질 수 있습니다.

## 테스트 결과 예시

`report/results.txt`에 기록된 실행 중 일부를 발췌했습니다. 각 수치는 5회 측정 평균이며, 한 회 측정은 100회 반복 실행 시간입니다.

| 구현 | CPU 평균 (ms) | SIMD/GPU 계산 평균 (ms) | CUDA 전송 포함 평균 (ms) | 계산 전용 가속 | 전송 포함 가속 | 검증 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| CUDA (GeForce RTX 3090) | 90.033 | 6.427 | 741.922 | 14.01x | 0.12x | PASS |
| C++ (GCC 13.3.0) | 93.661 | 31.706 | — | 2.95x | — | PASS |
| C++ (Intel oneAPI 2026.2.0) | 89.346 | 35.113 | — | 2.54x | — | PASS |
| C# (.NET 10.0.13) | 100.504 | 36.000 | — | 2.79x | — | PASS |
| Go (1.27.1, amd64) | 95.817 | 46.470 | — | 2.06x | — | PASS |
| Python (PyTorch 2.14.0, CUDA GPU) | 638.006 | 48.131 | — | 13.26x | — | PASS |

CUDA 측정은 같은 프로그램에서 세 가지 실행 방식을 각각 측정했습니다.

| CUDA 실행 방식 | 평균 시간 (ms) | CPU 대비 |
| --- | ---: | ---: |
| GPU 메모리 복사 포함 | 741.922 | 0.12x |
| GPU 메모리 복사 제외 (계산만) | 6.427 | 14.01x |
| CPU | 90.033 | 1.00x |

\* CUDA의 계산 전용 배율은 메모리 전송을 제외합니다. 전송 포함 측정에는 메모리 할당, 입력 데이터 구성과 H2D 전송, GPU 계산, D2H 결과 회수가 포함됩니다. 여기서는 전송 포함 CUDA 실행이 CPU보다 느려 0.12x입니다.

측정 대상은 2008-04-15부터 2026-10-06까지의 자동차용 경유 가격 데이터에서 계산한 151개 지역 쌍의 일별 가격 변동률 피어슨 상관계수입니다. 기록된 구현은 1e-10 허용 오차 기준으로 검증을 통과했습니다. 이 값은 제공된 WSL2/i9-13900K 환경의 예시이며, 다른 장비나 실행 조건에서의 성능을 보장하지 않습니다. 전체 결과와 개별 회차는 `report/results.txt` 및 `index.html`에서 확인할 수 있습니다.

## GFLOPS 측정

Python은 기존 PyTorch CPU/GPU 비교 외에 `python3 python/benchmark.py "CSV 경로" 100 --cpu-only`로 순수 Python CPU 계산을 실행할 수 있습니다. 이 모드는 PyTorch·NumPy·GPU 없이 표준 라이브러리와 스칼라 반복문만 사용하며, `math.fsum`으로 별도 계산한 기준값과 검증합니다. `run.sh`는 두 Python 모드를 각각 실행합니다. 순수 Python은 CPU 비교와 통합 표에 포함되며 SIMD/GPU 순위에서는 제외됩니다.

각 벤치마크는 실제 회차 평균 시간으로 CPU 및 SIMD/GPU의 유효 GFLOPS를 계산합니다.

`GFLOPS = (10 × 관측값 수 + 6 × 지역 쌍 수) × 반복 횟수 / (평균 시간(ms) × 1,000,000)`

관측값당 평균 합산 2회, 중심화 뺄셈 2회, 제곱·곱 3회, 누적 덧셈 3회를 셉니다. 지역 쌍당 평균 나눗셈 2회, 제곱근 2회, 곱셈 1회, 나눗셈 1회를 셉니다. 제곱근은 1 FLOP으로 간주합니다. 구현별 SIMD/GPU 병렬 합산 부가 연산, PyTorch 패딩, 비교, 메모리 전송은 연산량에서 제외합니다. 따라서 이 값은 하드웨어 명령어 카운터 측정값이 아닌 동일한 유효 작업량 기준의 처리량입니다. GPU 시간은 메모리 전송 제외 기준입니다.

빌드 후 `./run.sh`를 실행하면 새 GFLOPS가 로그와 보고서에 반영됩니다. 이전 로그에 GFLOPS가 없으면 값을 추정하지 않고 `미측정`으로 표시합니다.

## 컴파일러 및 라이선스

`cpp/`의 C++ 구현은 GNU Compiler Collection의 `g++`로 빌드합니다. GCC 컴파일러 자체는 GNU General Public License(GPL) 버전 3 이상에 따라 배포됩니다. 이 저장소의 C++ 소스 코드와 GCC 자체는 별개의 저작물이며, 컴파일러를 사용했다는 사실만으로 프로젝트 소스의 라이선스가 GCC 라이선스로 바뀌지는 않습니다. GCC가 프로그램에 포함할 수 있는 런타임 구성요소에는 별도의 GCC Runtime Library Exception이 적용될 수 있습니다. 자세한 내용은 [GCC 라이선스 안내](https://gcc.gnu.org/onlinedocs/gcc/Copying.html)와 [libstdc++ 라이선스 안내](https://gcc.gnu.org/onlinedocs/libstdc%2B%2B/manual/license.html)를 참고하세요.

## 빌드 및 테스트 환경

벤치마크는 다음 환경에서 빌드하고 실행했습니다.

| 항목 | 환경 |
| --- | --- |
| 운영체제 | Ubuntu 24.04.5 LTS (Noble Numbat), WSL2 |
| 커널 | Linux 6.18.54.1-microsoft-standard-WSL2 |
| 아키텍처 | x86_64 |
| 프로세서 | 13th Gen Intel(R) Core(TM) i9-13900K |
| 논리 CPU | 32 (16코어, 코어당 2스레드) |
| 메모리 | 62 GiB RAM |
| 스왑 | 16 GiB |

메모리 사용량은 측정 시점에 따라 달라질 수 있으므로 총 메모리 용량만 기재했습니다.
