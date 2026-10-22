source /opt/intel/oneapi/setvars.sh

g++ -O3 -std=c++17 -mavx2 -ffp-contract=off -fno-fast-math -fno-tree-vectorize -fno-tree-slp-vectorize benchmark.cpp -o benchmark
icpx -O3 -std=c++17 -mavx2 -fp-model=strict -ffp-contract=off -fno-vectorize -fno-slp-vectorize benchmark.cpp -o benchmark.icpx