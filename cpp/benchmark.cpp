#include <immintrin.h>
#include <algorithm>
#include <chrono>
#include <cctype>
#include <cmath>
#include <cstdio>
#include <fstream>
#include <limits>
#include <stdexcept>
#include <string>
#include <thread>
#include <utility>
#include <vector>

#ifdef _MSC_VER
#define NOINLINE __declspec(noinline)
#else
#define NOINLINE __attribute__((noinline))
#endif

constexpr int Trials = 5;
constexpr double Tolerance = 1e-10;
using Clock = std::chrono::steady_clock;

struct PairData {
    int first, second;
    std::vector<double> x, y;
};

struct Dataset {
    std::vector<std::string> headers, dates;
    std::vector<std::vector<double>> prices;
    std::vector<PairData> pairs;
    std::size_t valid = 0, missing = 0, observations = 0;
};

std::string trim(const std::string& value) {
    const auto begin = value.find_first_not_of(" \t\r\n");
    if (begin == std::string::npos) return "";
    return value.substr(begin, value.find_last_not_of(" \t\r\n") - begin + 1);
}

std::vector<std::string> parseCSV(const std::string& line) {
    std::vector<std::string> fields;
    std::string field;
    bool quoted = false;
    bool closedQuote = false;
    bool fieldStarted = false;
    for (std::size_t i = 0; i < line.size(); ++i) {
        const char c = line[i];
        if (c == '"') {
            if (quoted && i + 1 < line.size() && line[i + 1] == '"') {
                field += '"';
                ++i;
            } else if (quoted) { quoted = false; closedQuote = true; }
            else if (!fieldStarted && !closedQuote) { quoted = true; fieldStarted = true; }
            else throw std::runtime_error("Invalid quote in CSV field");
        } else if (c == ',' && !quoted) {
            fields.push_back(trim(field));
            field.clear();
            closedQuote = false;
            fieldStarted = false;
        } else if (!quoted && closedQuote && !std::isspace(static_cast<unsigned char>(c))) {
            throw std::runtime_error("Unexpected data after CSV quote");
        } else if (c != '\r') {
            field += c;
            if (!std::isspace(static_cast<unsigned char>(c))) fieldStarted = true;
        }
    }
    if (quoted) throw std::runtime_error("Unclosed CSV quote");
    fields.push_back(trim(field));
    return fields;
}

// UTF-8 BOM이 있는 CSV도 처리합니다.
void removeBOM(std::string& text) {
    if (text.size() >= 3 && static_cast<unsigned char>(text[0]) == 0xEF && static_cast<unsigned char>(text[1]) == 0xBB && static_cast<unsigned char>(text[2]) == 0xBF) text.erase(0, 3);
}

std::string dateDigits(const std::string& value) {
    std::string result;
    for (unsigned char c : value) {
        if (c >= '0' && c <= '9') result += static_cast<char>(c);
    }
    if (result.size() != 8) throw std::runtime_error("Invalid date: expected YYYYMMDD");
    return result;
}

long long dayNumber(const std::string& date) {
    int year = std::stoi(date.substr(0, 4));
    const int month = std::stoi(date.substr(4, 2));
    const int day = std::stoi(date.substr(6, 2));
    if (year < 1 || month < 1 || month > 12) throw std::runtime_error("Invalid year or month");
    const bool leap = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    const int lengths[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (day < 1 || day > lengths[month - 1] + (month == 2 && leap)) throw std::runtime_error("Invalid day");
    year -= month <= 2;
    const int era = (year >= 0 ? year : year - 399) / 400;
    const unsigned yoe = static_cast<unsigned>(year - era * 400);
    const unsigned doy = (153 * (month + (month > 2 ? -3 : 9)) + 2) / 5 + day - 1;
    const unsigned doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    return static_cast<long long>(era) * 146097 + doe;
}

double parsePrice(std::string value) {
    value = trim(value);
    if (value.empty() || value == "-" || value == "NA" || value == "N/A") return std::numeric_limits<double>::quiet_NaN();
    value.erase(std::remove(value.begin(), value.end(), ','), value.end());
    std::size_t end = 0;
    const double result = std::stod(value, &end);
    if (end != value.size() || !std::isfinite(result) || result <= 0) throw std::runtime_error("Invalid price: " + value);
    return result;
}

Dataset loadData(const std::string& path) {
    std::ifstream file(path, std::ios::binary);
    if (!file) throw std::runtime_error("Cannot open CSV: " + path);
    Dataset data;
    std::string line;
    if (!std::getline(file, line)) throw std::runtime_error("Empty CSV");
    removeBOM(line);
    const auto header = parseCSV(line);
    if (header.size() < 3) throw std::runtime_error("At least two region columns are required");
    data.headers.assign(header.begin() + 1, header.end());
    for (const auto& name : data.headers) {
        if (name.empty()) throw std::runtime_error("Empty region name in CSV header");
    }
    data.prices.resize(data.headers.size());
    std::vector<long long> days;
    std::size_t lineNumber = 1;
    while (std::getline(file, line)) {
        ++lineNumber;
        if (trim(line).empty()) continue;
        const auto fields = parseCSV(line);
        if (fields.size() != header.size()) throw std::runtime_error("Column count mismatch at line " + std::to_string(lineNumber));
        const std::string date = dateDigits(fields[0]);
        const long long day = dayNumber(date);
        if (!days.empty() && day <= days.back()) throw std::runtime_error("Dates must be unique and ascending");
        days.push_back(day);
        data.dates.push_back(date);
        for (std::size_t region = 0; region < data.prices.size(); ++region) {
            double price;
            try {
                price = parsePrice(fields[region + 1]);
            } catch (const std::exception&) {
                throw std::runtime_error("Invalid price at line " + std::to_string(lineNumber) + ", column " + std::to_string(region + 2));
            }
            data.prices[region].push_back(price);
            if (std::isfinite(price)) ++data.valid;
            else ++data.missing;
        }
    }
    if (file.bad()) throw std::runtime_error("CSV read failed");
    if (data.dates.size() < 3) throw std::runtime_error("Insufficient dates");
    const double missing = std::numeric_limits<double>::quiet_NaN();
    std::vector<std::vector<double>> returns(data.prices.size(), std::vector<double>(data.dates.size() - 1, missing));
    for (std::size_t region = 0; region < data.prices.size(); ++region) {
        for (std::size_t i = 1; i < data.dates.size(); ++i) {
            const double previous = data.prices[region][i - 1];
            const double current = data.prices[region][i];
            if (days[i] - days[i - 1] == 1 && std::isfinite(previous) && std::isfinite(current)) returns[region][i - 1] = ((current - previous) / previous) * 100.0;
        }
    }
    for (std::size_t a = 0; a < returns.size(); ++a) {
        for (std::size_t b = a + 1; b < returns.size(); ++b) {
            PairData pair{static_cast<int>(a), static_cast<int>(b), {}, {}};
            for (std::size_t i = 0; i < returns[a].size(); ++i) {
                if (std::isfinite(returns[a][i]) && std::isfinite(returns[b][i])) {
                    pair.x.push_back(returns[a][i]);
                    pair.y.push_back(returns[b][i]);
                }
            }
            if (pair.x.size() >= 2) {
                data.observations += pair.x.size();
                data.pairs.push_back(std::move(pair));
            }
        }
    }
    if (data.pairs.empty()) throw std::runtime_error("No region pairs with enough common dates");
    return data;
}

double finishCorrelation(double xy, double xx, double yy) {
    if (xx <= 0 || yy <= 0) return std::numeric_limits<double>::quiet_NaN();
    return std::clamp(xy / (std::sqrt(xx) * std::sqrt(yy)), -1.0, 1.0);
}

NOINLINE void calculateCPU(const std::vector<PairData>& pairs, std::vector<double>& output) {
    for (std::size_t p = 0; p < pairs.size(); ++p) {
        const auto& pair = pairs[p];
        const std::size_t n = pair.x.size();
        double sx = 0, sy = 0;
#if defined(__clang__)
#pragma clang loop vectorize(disable) interleave(disable)
#endif
        for (std::size_t i = 0; i < n; ++i) {
            sx += pair.x[i];
            sy += pair.y[i];
        }
        const double mx = sx / static_cast<double>(n);
        const double my = sy / static_cast<double>(n);
        double xx = 0, yy = 0, xy = 0;
#if defined(__clang__)
#pragma clang loop vectorize(disable) interleave(disable)
#endif
        for (std::size_t i = 0; i < n; ++i) {
            const double dx = pair.x[i] - mx;
            const double dy = pair.y[i] - my;
            xx += dx * dx;
            yy += dy * dy;
            xy += dx * dy;
        }
        output[p] = finishCorrelation(xy, xx, yy);
    }
}

inline double horizontalSum(__m256d value) {
    alignas(32) double lanes[4];
    _mm256_store_pd(lanes, value);
    return ((lanes[0] + lanes[1]) + lanes[2]) + lanes[3];
}

NOINLINE void calculateSIMD(const std::vector<PairData>& pairs, std::vector<double>& output) {
    for (std::size_t p = 0; p < pairs.size(); ++p) {
        const auto& pair = pairs[p];
        const std::size_t n = pair.x.size();
        const std::size_t end = n - n % 4;
        __m256d sx = _mm256_setzero_pd();
        __m256d sy = _mm256_setzero_pd();
        for (std::size_t i = 0; i < end; i += 4) {
            sx = _mm256_add_pd(sx, _mm256_loadu_pd(pair.x.data() + i));
            sy = _mm256_add_pd(sy, _mm256_loadu_pd(pair.y.data() + i));
        }
        double sumX = horizontalSum(sx);
        double sumY = horizontalSum(sy);
        for (std::size_t i = end; i < n; ++i) {
            sumX += pair.x[i];
            sumY += pair.y[i];
        }
        const double meanX = sumX / static_cast<double>(n);
        const double meanY = sumY / static_cast<double>(n);
        const __m256d mx = _mm256_set1_pd(meanX);
        const __m256d my = _mm256_set1_pd(meanY);
        __m256d xx = _mm256_setzero_pd();
        __m256d yy = _mm256_setzero_pd();
        __m256d xy = _mm256_setzero_pd();
        for (std::size_t i = 0; i < end; i += 4) {
            const __m256d dx = _mm256_sub_pd(_mm256_loadu_pd(pair.x.data() + i), mx);
            const __m256d dy = _mm256_sub_pd(_mm256_loadu_pd(pair.y.data() + i), my);
            xx = _mm256_add_pd(xx, _mm256_mul_pd(dx, dx));
            yy = _mm256_add_pd(yy, _mm256_mul_pd(dy, dy));
            xy = _mm256_add_pd(xy, _mm256_mul_pd(dx, dy));
        }
        double sumXX = horizontalSum(xx);
        double sumYY = horizontalSum(yy);
        double sumXY = horizontalSum(xy);
        for (std::size_t i = end; i < n; ++i) {
            const double dx = pair.x[i] - meanX;
            const double dy = pair.y[i] - meanY;
            sumXX += dx * dx;
            sumYY += dy * dy;
            sumXY += dx * dy;
        }
        output[p] = finishCorrelation(sumXY, sumXX, sumYY);
    }
}

using Kernel = void (*)(const std::vector<PairData>&, std::vector<double>&);

NOINLINE double benchmark(Kernel fn, const std::vector<PairData>& pairs, std::vector<double>& output, int loops) {
    Kernel volatile invoke = fn;
    const auto start = Clock::now();
    for (int i = 0; i < loops; ++i) invoke(pairs, output);
    return std::chrono::duration<double, std::milli>(Clock::now() - start).count();
}

double validate(const std::vector<double>& cpu, const std::vector<double>& simd) {
    double maximum = 0;
    for (std::size_t i = 0; i < cpu.size(); ++i) {
        if (std::isnan(cpu[i]) && std::isnan(simd[i])) continue;
        if (!std::isfinite(cpu[i]) || !std::isfinite(simd[i])) throw std::runtime_error("Validation failed: non-finite mismatch");
        const double error = std::abs(cpu[i] - simd[i]);
        maximum = std::max(maximum, error);
        if (error > Tolerance) throw std::runtime_error("Validation failed at pair " + std::to_string(i));
    }
    return maximum;
}

void printCompiler() {
#if defined(__INTEL_LLVM_COMPILER)
    const int version = __INTEL_LLVM_COMPILER;
    std::printf("Compiler      : Intel oneAPI %d.%d.%d\n", version / 10000, (version / 100) % 100, version % 100);
#elif defined(__clang__)
    std::printf("Compiler      : Clang %s\n", __clang_version__);
#elif defined(__GNUC__)
    std::printf("Compiler      : GCC %s\n", __VERSION__);
#elif defined(_MSC_VER)
    std::printf("Compiler      : MSVC %d\n", _MSC_VER);
#endif
}

// CSV의 한글 지역명은 터미널에서 글자당 2칸으로 계산합니다.
std::size_t regionWidth(const std::string& text) {
    std::size_t width = 0;
    for (std::size_t i = 0; i < text.size();) {
        const unsigned char c = static_cast<unsigned char>(text[i]);
        if (c < 0x80) {
            ++width;
            ++i;
        } else {
            width += 2;
            const std::size_t bytes = (c & 0xE0) == 0xC0 ? 2 : (c & 0xF0) == 0xE0 ? 3 : (c & 0xF8) == 0xF0 ? 4 : 1;
            i += std::min(bytes, text.size() - i);
        }
    }
    return width;
}

std::string padRegion(const std::string& text, std::size_t width) {
    const std::size_t used = regionWidth(text);
    return text + std::string(width > used ? width - used : 0, ' ');
}

void printTopPairs(const Dataset& data, const std::vector<double>& result) {
    std::vector<std::size_t> order;
    for (std::size_t i = 0; i < result.size(); ++i) {
        if (std::isfinite(result[i])) order.push_back(i);
    }
    std::sort(order.begin(), order.end(), [&](std::size_t a, std::size_t b) {
        if (result[a] != result[b]) return result[a] > result[b];
        return a < b;
    });
    std::size_t width = 12;
    for (const auto& name : data.headers) width = std::max(width, regionWidth(name) + 2);
    std::printf("\n일별 가격 변동률 상관계수 상위 10개 지역 쌍\n");
    std::printf("%s%s%s%12s %16s\n", padRegion("순위", 8).c_str(), padRegion("지역 A", width).c_str(), padRegion("지역 B", width).c_str(), "Samples", "Correlation");
    for (std::size_t rank = 0; rank < std::min<std::size_t>(10, order.size()); ++rank) {
        const std::size_t i = order[rank];
        const auto& pair = data.pairs[i];
        const auto regionA = padRegion(data.headers[pair.first], width);
        const auto regionB = padRegion(data.headers[pair.second], width);
        std::printf("%-8zu%s%s%12zu %16.12f\n", rank + 1, regionA.c_str(), regionB.c_str(), pair.x.size(), result[i]);
    }
}

int main(int argc, char** argv) {
    try {
        const std::string path = argc > 1 ? argv[1] : "../datas/utf8/주유소_지역별_평균판매가격-보통휘발유.csv";
        int loops = 100;
        if (argc > 2) {
            std::size_t used = 0;
            const std::string argument = argv[2];
            loops = std::stoi(argument, &used);
            if (used != argument.size()) throw std::runtime_error("Invalid loops argument");
        }
        if (loops < 1) throw std::runtime_error("Loops must be positive");
        const auto loadStart = Clock::now();
        const Dataset data = loadData(path);
        const double loadMs = std::chrono::duration<double, std::milli>(Clock::now() - loadStart).count();
        std::vector<double> cpu(data.pairs.size()), simd(data.pairs.size());
        printCompiler();
        std::printf("File          : %s\n", path.c_str());
#if defined(_WIN32)
        std::printf("Environment   : Windows / ");
#elif defined(__APPLE__)
        std::printf("Environment   : macOS / ");
#elif defined(__linux__)
        std::printf("Environment   : Linux / ");
#else
        std::printf("Environment   : unknown OS / ");
#endif
#if defined(__x86_64__) || defined(_M_X64)
        std::printf("x86_64 / %u logical CPUs\n", std::thread::hardware_concurrency());
#elif defined(__aarch64__) || defined(_M_ARM64)
        std::printf("ARM64 / %u logical CPUs\n", std::thread::hardware_concurrency());
#else
        std::printf("unknown architecture / %u logical CPUs\n", std::thread::hardware_concurrency());
#endif
        std::printf("Test          : Pearson correlation of daily price changes / float64\n");
        std::printf("CPU           : Scalar / single thread\n");
        std::printf("SIMD          : AVX 256-bit / 4 doubles / single thread\n");
        std::printf("Array         : %zu dates / %zu region columns / %zu valid prices\n", data.dates.size(), data.headers.size(), data.valid);
        std::printf("Period        : %s - %s\n", data.dates.front().c_str(), data.dates.back().c_str());
        std::printf("Missing       : %zu prices / excluded, not zero-filled\n", data.missing);
        std::printf("Pairs         : %zu / common consecutive-day returns only\n", data.pairs.size());
        std::printf("Observations  : %zu across all pairs\n", data.observations);
        std::vector<std::size_t> sampleSizes; for (const auto& pair : data.pairs) sampleSizes.push_back(pair.x.size()); std::sort(sampleSizes.begin(), sampleSizes.end());
        std::printf("Sample counts : %zu / %zu / %zu (min / median / max)\n", sampleSizes.front(), sampleSizes[sampleSizes.size() / 2], sampleSizes.back());
        std::printf("Preprocess    : %.3f ms / excluded from benchmark\n", loadMs);
        std::printf("Timing        : Pair means + centered covariance + correlation\n");
        std::printf("Loops         : %d per trial\n", loops);
        std::printf("Trials        : %d\n", Trials);
        std::printf("Validation    : Absolute tolerance %.1e; zero-variance pairs are undefined\n\n", Tolerance);
        for (int i = 0; i < 5; ++i) {
            calculateCPU(data.pairs, cpu);
            calculateSIMD(data.pairs, simd);
        }
        double maxError = validate(cpu, simd);
        double cpuTotal = 0, simdTotal = 0;
        std::printf("%-8s %14s %14s %12s\n", "Trial", "CPU(ms)", "SIMD(ms)", "Speedup");
        for (int trial = 0; trial < Trials; ++trial) {
            double cpuMs, simdMs;
            if (trial % 2 == 0) {
                cpuMs = benchmark(calculateCPU, data.pairs, cpu, loops);
                simdMs = benchmark(calculateSIMD, data.pairs, simd, loops);
            } else {
                simdMs = benchmark(calculateSIMD, data.pairs, simd, loops);
                cpuMs = benchmark(calculateCPU, data.pairs, cpu, loops);
            }
            maxError = std::max(maxError, validate(cpu, simd));
            cpuTotal += cpuMs;
            simdTotal += simdMs;
            std::printf("%-8d %14.3f %14.3f %11.2fx\n", trial + 1, cpuMs, simdMs, cpuMs / simdMs);
        }
        double cpuChecksum = 0, simdChecksum = 0;
        std::size_t undefined = 0;
        for (std::size_t i = 0; i < cpu.size(); ++i) {
            if (std::isnan(cpu[i])) {
                ++undefined;
                continue;
            }
            cpuChecksum += cpu[i];
            simdChecksum += simd[i];
        }
        std::printf("\nCPU checksum  : %.12f\n", cpuChecksum);
        std::printf("SIMD checksum : %.12f\n", simdChecksum);
        std::printf("Max abs error : %.12g\n", maxError);
        std::printf("Validation    : PASS (%zu pairs / tolerance %.1e)\n", cpu.size(), Tolerance);
        std::printf("Undefined     : %zu zero-variance pairs\n", undefined);
        // Useful Pearson FLOPs: 10 per observation + 6 per pair (sqrt counts as one).
        // Excludes parallel reduction overhead, padding, comparisons and transfers.
        const double usefulFlops = (10.0 * data.observations + 6.0 * data.pairs.size()) * loops;
        std::printf("Operations    : Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers\n");
        std::printf("CPU GFLOPS    : %.6f\n", usefulFlops / (cpuTotal / Trials) / 1e6);
        std::printf("SIMD GFLOPS   : %.6f\n", usefulFlops / (simdTotal / Trials) / 1e6);
        std::printf("CPU average   : %.3f ms\n", cpuTotal / Trials);
        std::printf("SIMD average  : %.3f ms\n", simdTotal / Trials);
        std::printf("SIMD speedup  : %.2fx\n", cpuTotal / simdTotal);
        std::printf("CPU per run   : %.6f ms\n", cpuTotal / Trials / loops);
        std::printf("SIMD per run  : %.6f ms\n", simdTotal / Trials / loops);
        printTopPairs(data, simd);
        return 0;
    } catch (const std::exception& error) {
        std::fprintf(stderr, "Error: %s\n", error.what());
        return 1;
    }
}
