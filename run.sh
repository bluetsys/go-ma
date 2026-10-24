#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"
RESULTS_FILE="$ROOT_DIR/report/results.txt"

: > "$RESULTS_FILE"
exec > >(tee -a "$RESULTS_FILE") 2>&1

echo "========================================================="
./cpp/benchmark "Datas/주유소_지역별_평균판매가격-자동차용경유.csv" 100
echo "========================================================="
./cuda/benchmark "Datas/주유소_지역별_평균판매가격-자동차용경유.csv" 100
echo "========================================================="
DOTNET_TieredCompilation=0 dotnet dotnet/bin/Release/net*/Benchmark.dll "Datas/주유소_지역별_평균판매가격-자동차용경유.csv" 100
echo "========================================================="
./go/benchmark "Datas/주유소_지역별_평균판매가격-자동차용경유.csv" 100
echo "========================================================="
./cpp/benchmark.icpx "Datas/주유소_지역별_평균판매가격-자동차용경유.csv" 100
echo "========================================================="
python3 ./python/benchmark.py "Datas/주유소_지역별_평균판매가격-자동차용경유.csv" 100
echo "========================================================="
python3 ./python/benchmark.py "Datas/주유소_지역별_평균판매가격-자동차용경유.csv" 100 --cpu-only

python3 ./report/make_report.py ./report/results.txt
