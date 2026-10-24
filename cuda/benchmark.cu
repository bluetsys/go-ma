#include <cuda_runtime.h>
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

#define CUDA_CHECK(call)                                                                      \
    do                                                                                        \
    {                                                                                         \
        const cudaError_t status = (call);                                                    \
        if (status != cudaSuccess)                                                            \
            throw std::runtime_error(std::string(#call) + ": " + cudaGetErrorString(status)); \
    } while (0)

#ifdef _MSC_VER
#define NOINLINE __declspec(noinline)
#else
#define NOINLINE __attribute__((noinline))
#endif

constexpr int Trials = 5;
constexpr int Threads = 256;
constexpr double Tolerance = 1e-10;
using Clock = std::chrono::steady_clock;

struct PairData
{
    int first, second;
    std::vector<double> x, y;
};

struct Dataset
{
    std::vector<std::string> headers, dates;
    std::vector<std::vector<double>> prices;
    std::vector<PairData> pairs;
    std::size_t valid = 0, missing = 0, observations = 0;
};

struct DeviceData
{
    double *x = nullptr;
    double *y = nullptr;
    double *output = nullptr;
    unsigned long long *offsets = nullptr;
    cudaStream_t stream = nullptr;

    DeviceData() = default;
    DeviceData(const DeviceData &) = delete;
    DeviceData &operator=(const DeviceData &) = delete;

    ~DeviceData()
    {
        if (stream)
            cudaStreamSynchronize(stream);
        if (output)
            cudaFree(output);
        if (offsets)
            cudaFree(offsets);
        if (y)
            cudaFree(y);
        if (x)
            cudaFree(x);
        if (stream)
            cudaStreamDestroy(stream);
    }
};

std::string trim(const std::string &value)
{
    const auto begin = value.find_first_not_of(" \t\r\n");
    if (begin == std::string::npos)
        return "";
    return value.substr(begin, value.find_last_not_of(" \t\r\n") - begin + 1);
}

std::vector<std::string> parseCSV(const std::string &line)
{
    std::vector<std::string> fields;
    std::string field;
    bool quoted = false;
    bool closedQuote = false;
    bool fieldStarted = false;
    for (std::size_t i = 0; i < line.size(); ++i)
    {
        const char c = line[i];
        if (c == '"')
        {
            if (quoted && i + 1 < line.size() && line[i + 1] == '"')
            {
                field += '"';
                ++i;
            }
            else if (quoted) { quoted = false; closedQuote = true; }
            else if (!fieldStarted && !closedQuote) { quoted = true; fieldStarted = true; }
            else throw std::runtime_error("Invalid quote in CSV field");
        }
        else if (c == ',' && !quoted)
        {
            fields.push_back(trim(field));
            field.clear();
            closedQuote = false;
            fieldStarted = false;
        }
        else if (!quoted && closedQuote && !std::isspace(static_cast<unsigned char>(c)))
        {
            throw std::runtime_error("Unexpected data after CSV quote");
        }
        else if (c != '\r')
        {
            field += c;
            if (!std::isspace(static_cast<unsigned char>(c))) fieldStarted = true;
        }
    }
    if (quoted)
        throw std::runtime_error("Unclosed CSV quote");
    fields.push_back(trim(field));
    return fields;
}

void removeBOM(std::string &text)
{
    if (text.size() >= 3 && static_cast<unsigned char>(text[0]) == 0xEF && static_cast<unsigned char>(text[1]) == 0xBB && static_cast<unsigned char>(text[2]) == 0xBF)
        text.erase(0, 3);
}

std::string dateDigits(const std::string &value)
{
    std::string result;
    for (unsigned char c : value)
    {
        if (c >= '0' && c <= '9')
            result += static_cast<char>(c);
    }
    if (result.size() != 8)
        throw std::runtime_error("Invalid date: expected YYYYMMDD");
    return result;
}

long long dayNumber(const std::string &date)
{
    int year = std::stoi(date.substr(0, 4));
    const int month = std::stoi(date.substr(4, 2));
    const int day = std::stoi(date.substr(6, 2));
    if (year < 1 || month < 1 || month > 12)
        throw std::runtime_error("Invalid year or month");
    const bool leap = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    const int lengths[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (day < 1 || day > lengths[month - 1] + (month == 2 && leap))
        throw std::runtime_error("Invalid day");
    year -= month <= 2;
    const int era = (year >= 0 ? year : year - 399) / 400;
    const unsigned yoe = static_cast<unsigned>(year - era * 400);
    const unsigned doy = (153 * (month + (month > 2 ? -3 : 9)) + 2) / 5 + day - 1;
    const unsigned doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    return static_cast<long long>(era) * 146097 + doe;
}

double parsePrice(std::string value)
{
    value = trim(value);
    if (value.empty() || value == "-" || value == "NA" || value == "N/A")
        return std::numeric_limits<double>::quiet_NaN();
    value.erase(std::remove(value.begin(), value.end(), ','), value.end());
    std::size_t end = 0;
    const double result = std::stod(value, &end);
    if (end != value.size() || !std::isfinite(result) || result <= 0)
        throw std::runtime_error("Invalid price: " + value);
    return result;
}

Dataset loadData(const std::string &path)
{
    std::ifstream file(path, std::ios::binary);
    if (!file)
        throw std::runtime_error("Cannot open CSV: " + path);
    Dataset data;
    std::string line;
    if (!std::getline(file, line))
        throw std::runtime_error("Empty CSV");
    removeBOM(line);
    const auto header = parseCSV(line);
    if (header.size() < 3)
        throw std::runtime_error("At least two region columns are required");
    data.headers.assign(header.begin() + 1, header.end());
    for (const auto &name : data.headers)
    {
        if (name.empty())
            throw std::runtime_error("Empty region name in CSV header");
    }
    data.prices.resize(data.headers.size());
    std::vector<long long> days;
    std::size_t lineNumber = 1;
    while (std::getline(file, line))
    {
        ++lineNumber;
        if (trim(line).empty())
            continue;
        const auto fields = parseCSV(line);
        if (fields.size() != header.size())
            throw std::runtime_error("Column count mismatch at line " + std::to_string(lineNumber));
        const std::string date = dateDigits(fields[0]);
        const long long day = dayNumber(date);
        if (!days.empty() && day <= days.back())
            throw std::runtime_error("Dates must be unique and ascending");
        days.push_back(day);
        data.dates.push_back(date);
        for (std::size_t region = 0; region < data.prices.size(); ++region)
        {
            double price;
            try
            {
                price = parsePrice(fields[region + 1]);
            }
            catch (const std::exception &)
            {
                throw std::runtime_error("Invalid price at line " + std::to_string(lineNumber) + ", column " + std::to_string(region + 2));
            }
            data.prices[region].push_back(price);
            if (std::isfinite(price))
                ++data.valid;
            else
                ++data.missing;
        }
    }
    if (file.bad())
        throw std::runtime_error("CSV read failed");
    if (data.dates.size() < 3)
        throw std::runtime_error("Insufficient dates");
    const double missing = std::numeric_limits<double>::quiet_NaN();
    std::vector<std::vector<double>> returns(data.prices.size(), std::vector<double>(data.dates.size() - 1, missing));
    for (std::size_t region = 0; region < data.prices.size(); ++region)
    {
        for (std::size_t i = 1; i < data.dates.size(); ++i)
        {
            const double previous = data.prices[region][i - 1];
            const double current = data.prices[region][i];
            if (days[i] - days[i - 1] == 1 && std::isfinite(previous) && std::isfinite(current))
                returns[region][i - 1] = ((current - previous) / previous) * 100.0;
        }
    }
    for (std::size_t a = 0; a < returns.size(); ++a)
    {
        for (std::size_t b = a + 1; b < returns.size(); ++b)
        {
            PairData pair{static_cast<int>(a), static_cast<int>(b), {}, {}};
            for (std::size_t i = 0; i < returns[a].size(); ++i)
            {
                if (std::isfinite(returns[a][i]) && std::isfinite(returns[b][i]))
                {
                    pair.x.push_back(returns[a][i]);
                    pair.y.push_back(returns[b][i]);
                }
            }
            if (pair.x.size() >= 2)
            {
                data.observations += pair.x.size();
                data.pairs.push_back(std::move(pair));
            }
        }
    }
    if (data.pairs.empty())
        throw std::runtime_error("No region pairs with enough common dates");
    return data;
}

double finishCorrelation(double xy, double xx, double yy)
{
    if (xx <= 0 || yy <= 0)
        return std::numeric_limits<double>::quiet_NaN();
    return std::clamp(xy / (std::sqrt(xx) * std::sqrt(yy)), -1.0, 1.0);
}

NOINLINE void calculateCPU(const std::vector<PairData> &pairs, std::vector<double> &output)
{
    for (std::size_t p = 0; p < pairs.size(); ++p)
    {
        const auto &pair = pairs[p];
        const std::size_t n = pair.x.size();
        double sx = 0, sy = 0;
        for (std::size_t i = 0; i < n; ++i)
        {
            sx += pair.x[i];
            sy += pair.y[i];
        }
        const double mx = sx / static_cast<double>(n);
        const double my = sy / static_cast<double>(n);
        double xx = 0, yy = 0, xy = 0;
        for (std::size_t i = 0; i < n; ++i)
        {
            const double dx = pair.x[i] - mx;
            const double dy = pair.y[i] - my;
            xx += dx * dx;
            yy += dy * dy;
            xy += dx * dy;
        }
        output[p] = finishCorrelation(xy, xx, yy);
    }
}

// 지역 쌍마다 블록 하나를 배정합니다.
__global__ void calculateGPU(const double *x, const double *y, const unsigned long long *offsets, double *output)
{
    __shared__ double a[Threads];
    __shared__ double b[Threads];
    __shared__ double c[Threads];
    __shared__ double meanX, meanY;
    const int thread = threadIdx.x;
    const unsigned long long begin = offsets[blockIdx.x];
    const unsigned long long end = offsets[blockIdx.x + 1];
    const unsigned long long count = end - begin;
    double sx = 0, sy = 0;
    for (unsigned long long i = begin + thread; i < end; i += blockDim.x)
    {
        sx += x[i];
        sy += y[i];
    }
    a[thread] = sx;
    b[thread] = sy;
    __syncthreads();
    for (int stride = Threads / 2; stride > 0; stride /= 2)
    {
        if (thread < stride)
        {
            a[thread] += a[thread + stride];
            b[thread] += b[thread + stride];
        }
        __syncthreads();
    }
    if (thread == 0)
    {
        meanX = a[0] / static_cast<double>(count);
        meanY = b[0] / static_cast<double>(count);
    }
    __syncthreads();
    double xx = 0, yy = 0, xy = 0;
    for (unsigned long long i = begin + thread; i < end; i += blockDim.x)
    {
        const double dx = x[i] - meanX;
        const double dy = y[i] - meanY;
        xx += dx * dx;
        yy += dy * dy;
        xy += dx * dy;
    }
    a[thread] = xx;
    b[thread] = yy;
    c[thread] = xy;
    __syncthreads();
    for (int stride = Threads / 2; stride > 0; stride /= 2)
    {
        if (thread < stride)
        {
            a[thread] += a[thread + stride];
            b[thread] += b[thread + stride];
            c[thread] += c[thread + stride];
        }
        __syncthreads();
    }
    if (thread == 0)
    {
        if (a[0] <= 0 || b[0] <= 0)
        {
            output[blockIdx.x] = __longlong_as_double(0x7ff8000000000000LL);
        }
        else
        {
            const double r = c[0] / (sqrt(a[0]) * sqrt(b[0]));
            output[blockIdx.x] = isfinite(r) ? fmax(-1.0, fmin(1.0, r)) : r;
        }
    }
}

void uploadData(const Dataset &data, DeviceData &device)
{
    std::vector<double> x, y;
    std::vector<unsigned long long> offsets;
    x.reserve(data.observations);
    y.reserve(data.observations);
    offsets.reserve(data.pairs.size() + 1);
    offsets.push_back(0);
    for (const auto &pair : data.pairs)
    {
        x.insert(x.end(), pair.x.begin(), pair.x.end());
        y.insert(y.end(), pair.y.begin(), pair.y.end());
        offsets.push_back(static_cast<unsigned long long>(x.size()));
    }
    CUDA_CHECK(cudaStreamCreate(&device.stream));
    CUDA_CHECK(cudaMalloc(reinterpret_cast<void **>(&device.x), x.size() * sizeof(double)));
    CUDA_CHECK(cudaMalloc(reinterpret_cast<void **>(&device.y), y.size() * sizeof(double)));
    CUDA_CHECK(cudaMalloc(reinterpret_cast<void **>(&device.offsets), offsets.size() * sizeof(unsigned long long)));
    CUDA_CHECK(cudaMalloc(reinterpret_cast<void **>(&device.output), data.pairs.size() * sizeof(double)));
    CUDA_CHECK(cudaMemcpy(device.x, x.data(), x.size() * sizeof(double), cudaMemcpyHostToDevice));
    CUDA_CHECK(cudaMemcpy(device.y, y.data(), y.size() * sizeof(double), cudaMemcpyHostToDevice));
    CUDA_CHECK(cudaMemcpy(device.offsets, offsets.data(), offsets.size() * sizeof(unsigned long long), cudaMemcpyHostToDevice));
}

void downloadResult(const DeviceData &device, std::vector<double> &output)
{
    CUDA_CHECK(cudaStreamSynchronize(device.stream));
    CUDA_CHECK(cudaMemcpy(output.data(), device.output, output.size() * sizeof(double), cudaMemcpyDeviceToHost));
}

double benchmarkGPUEndToEnd(const Dataset &data, std::vector<double> &output, int pairs, int loops)
{
    const auto start = Clock::now();
    for (int i = 0; i < loops; ++i)
    {
        DeviceData device;
        uploadData(data, device);
        calculateGPU<<<pairs, Threads, 0, device.stream>>>(device.x, device.y, device.offsets, device.output);
        CUDA_CHECK(cudaGetLastError());
        downloadResult(device, output);
    }
    return std::chrono::duration<double, std::milli>(Clock::now() - start).count();
}

using Kernel = void (*)(const std::vector<PairData> &, std::vector<double> &);

NOINLINE double benchmarkCPU(const std::vector<PairData> &pairs, std::vector<double> &output, int loops)
{
    Kernel volatile invoke = calculateCPU;
    const auto start = Clock::now();
    for (int i = 0; i < loops; ++i)
        invoke(pairs, output);
    return std::chrono::duration<double, std::milli>(Clock::now() - start).count();
}

double benchmarkGPU(DeviceData &device, int pairs, int loops)
{
    CUDA_CHECK(cudaStreamSynchronize(device.stream));
    const auto start = Clock::now();
    for (int i = 0; i < loops; ++i)
    {
        calculateGPU<<<pairs, Threads, 0, device.stream>>>(device.x, device.y, device.offsets, device.output);
    }
    CUDA_CHECK(cudaGetLastError());
    CUDA_CHECK(cudaStreamSynchronize(device.stream));
    return std::chrono::duration<double, std::milli>(Clock::now() - start).count();
}

double validate(const std::vector<double> &cpu, const std::vector<double> &gpu)
{
    double maximum = 0;
    for (std::size_t i = 0; i < cpu.size(); ++i)
    {
        if (std::isnan(cpu[i]) && std::isnan(gpu[i]))
            continue;
        if (!std::isfinite(cpu[i]) || !std::isfinite(gpu[i]))
            throw std::runtime_error("Validation failed: non-finite mismatch");
        const double error = std::abs(cpu[i] - gpu[i]);
        maximum = std::max(maximum, error);
        if (error > Tolerance)
            throw std::runtime_error("Validation failed at pair " + std::to_string(i));
    }
    return maximum;
}

// 한글 지역명은 터미널에서 글자당 2칸으로 계산합니다.
std::size_t regionWidth(const std::string &text)
{
    std::size_t width = 0;
    for (std::size_t i = 0; i < text.size();)
    {
        const unsigned char c = static_cast<unsigned char>(text[i]);
        if (c < 0x80)
        {
            ++width;
            ++i;
        }
        else
        {
            width += 2;
            const std::size_t bytes = (c & 0xE0) == 0xC0 ? 2 : (c & 0xF0) == 0xE0 ? 3
                                                           : (c & 0xF8) == 0xF0   ? 4
                                                                                  : 1;
            i += std::min(bytes, text.size() - i);
        }
    }
    return width;
}

std::string padRegion(const std::string &text, std::size_t width)
{
    const std::size_t used = regionWidth(text);
    return text + std::string(width > used ? width - used : 0, ' ');
}

void printTopPairs(const Dataset &data, const std::vector<double> &result)
{
    std::vector<std::size_t> order;
    for (std::size_t i = 0; i < result.size(); ++i)
    {
        if (std::isfinite(result[i]))
            order.push_back(i);
    }
    std::sort(order.begin(), order.end(), [&](std::size_t a, std::size_t b)
              {
        if (result[a] != result[b]) return result[a] > result[b];
        return a < b; });
    std::size_t width = 12;
    for (const auto &name : data.headers)
        width = std::max(width, regionWidth(name) + 2);
    std::printf("\n일별 가격 변동률 상관계수 상위 10개 지역 쌍\n");
    std::printf("%s%s%s%12s %16s\n", padRegion("순위", 8).c_str(), padRegion("지역 A", width).c_str(), padRegion("지역 B", width).c_str(), "Samples", "Correlation");
    for (std::size_t rank = 0; rank < std::min<std::size_t>(10, order.size()); ++rank)
    {
        const std::size_t i = order[rank];
        const auto &pair = data.pairs[i];
        const auto regionA = padRegion(data.headers[pair.first], width);
        const auto regionB = padRegion(data.headers[pair.second], width);
        std::printf("%-8zu%s%s%12zu %16.12f\n", rank + 1, regionA.c_str(), regionB.c_str(), pair.x.size(), result[i]);
    }
}

int main(int argc, char **argv)
{
    try
    {
        const std::string path = argc > 1 ? argv[1] : "../datas/utf8/주유소_지역별_평균판매가격-보통휘발유.csv";
        int loops = 100;
        if (argc > 2)
        {
            std::size_t used = 0;
            const std::string argument = argv[2];
            loops = std::stoi(argument, &used);
            if (used != argument.size())
                throw std::runtime_error("Invalid loops argument");
        }
        if (loops < 1)
            throw std::runtime_error("Loops must be positive");
        CUDA_CHECK(cudaFree(0));
        int deviceId = 0;
        CUDA_CHECK(cudaGetDevice(&deviceId));
        cudaDeviceProp properties{};
        CUDA_CHECK(cudaGetDeviceProperties(&properties, deviceId));
        if (properties.maxThreadsPerBlock < Threads)
            throw std::runtime_error("GPU does not support requested block size");

        const auto loadStart = Clock::now();
        const Dataset data = loadData(path);
        const double loadMs = std::chrono::duration<double, std::milli>(Clock::now() - loadStart).count();
        if (data.pairs.size() > static_cast<std::size_t>(properties.maxGridSize[0]))
            throw std::runtime_error("Too many pairs for CUDA grid");
        const int pairCount = static_cast<int>(data.pairs.size());
        std::vector<double> cpu(data.pairs.size()), gpu(data.pairs.size());

        DeviceData device;
        const auto uploadStart = Clock::now();
        uploadData(data, device);
        const double uploadMs = std::chrono::duration<double, std::milli>(Clock::now() - uploadStart).count();

        std::printf("Compiler      : NVIDIA CUDA %d.%d\n", __CUDACC_VER_MAJOR__, __CUDACC_VER_MINOR__);
        std::printf("Device        : %s\n", properties.name);
        std::printf("Environment   : CUDA %d.%d / %u logical CPUs\n", properties.major, properties.minor, std::thread::hardware_concurrency());
        std::printf("File          : %s\n", path.c_str());
        std::printf("Test          : Pearson correlation of daily price changes / float64\n");
        std::printf("CPU           : Scalar / single thread\n");
        std::printf("GPU           : CUDA / SIMT / %d threads per block\n", Threads);
        std::printf("Array         : %zu dates / %zu region columns / %zu valid prices\n", data.dates.size(), data.headers.size(), data.valid);
        std::printf("Period        : %s - %s\n", data.dates.front().c_str(), data.dates.back().c_str());
        std::printf("Missing       : %zu prices / excluded, not zero-filled\n", data.missing);
        std::printf("Pairs         : %zu / common consecutive-day returns only\n", data.pairs.size());
        std::printf("Observations  : %zu across all pairs\n", data.observations);
        std::vector<std::size_t> sampleSizes; for (const auto &pair : data.pairs) sampleSizes.push_back(pair.x.size()); std::sort(sampleSizes.begin(), sampleSizes.end());
        std::printf("Sample counts : %zu / %zu / %zu (min / median / max)\n", sampleSizes.front(), sampleSizes[sampleSizes.size() / 2], sampleSizes.back());
        std::printf("Preprocess    : %.3f ms / excluded from benchmark\n", loadMs);
        std::printf("Upload        : %.3f ms / packing + allocation + upload / excluded\n", uploadMs);
        std::printf("Timing        : Wall time; pair means + covariance + correlation\n");
        std::printf("GPU timing    : Launch + final synchronization included; transfers excluded\n");
        std::printf("GPU end-to-end: Allocation + packing + H2D + kernel + D2H included\n");
        std::printf("Loops         : %d per trial\n", loops);
        std::printf("Trials        : %d\n", Trials);
        std::printf("Validation    : Absolute tolerance %.1e; zero-variance pairs are undefined\n\n", Tolerance);

        for (int i = 0; i < 5; ++i)
            calculateCPU(data.pairs, cpu);
        for (int i = 0; i < 5; ++i)
        {
            calculateGPU<<<pairCount, Threads, 0, device.stream>>>(device.x, device.y, device.offsets, device.output);
        }
        CUDA_CHECK(cudaGetLastError());
        downloadResult(device, gpu);

        double maxError = validate(cpu, gpu);
        double cpuTotal = 0, gpuTotal = 0, gpuEndToEndTotal = 0;
        std::printf("%-8s %14s %14s %14s %12s %12s\n", "Trial", "CPU(ms)", "GPU(ms)", "GPU E2E(ms)", "GPU speedup", "E2E speedup");
        for (int trial = 0; trial < Trials; ++trial)
        {
            double cpuMs, gpuMs, gpuEndToEndMs;
            if (trial % 2 == 0)
            {
                cpuMs = benchmarkCPU(data.pairs, cpu, loops);
                gpuMs = benchmarkGPU(device, pairCount, loops);
                gpuEndToEndMs = benchmarkGPUEndToEnd(data, gpu, pairCount, loops);
            }
            else
            {
                gpuMs = benchmarkGPU(device, pairCount, loops);
                cpuMs = benchmarkCPU(data.pairs, cpu, loops);
                gpuEndToEndMs = benchmarkGPUEndToEnd(data, gpu, pairCount, loops);
            }
            maxError = std::max(maxError, validate(cpu, gpu));
            downloadResult(device, gpu);
            maxError = std::max(maxError, validate(cpu, gpu));
            cpuTotal += cpuMs;
            gpuTotal += gpuMs;
            gpuEndToEndTotal += gpuEndToEndMs;
            std::printf("%-8d %14.3f %14.3f %14.3f %11.2fx %11.2fx\n", trial + 1, cpuMs, gpuMs, gpuEndToEndMs, cpuMs / gpuMs, cpuMs / gpuEndToEndMs);
        }

        double cpuChecksum = 0, gpuChecksum = 0;
        std::size_t undefined = 0;
        for (std::size_t i = 0; i < cpu.size(); ++i)
        {
            if (std::isnan(cpu[i]))
            {
                ++undefined;
                continue;
            }
            cpuChecksum += cpu[i];
            gpuChecksum += gpu[i];
        }
        std::printf("\nCPU checksum  : %.12f\n", cpuChecksum);
        std::printf("GPU checksum  : %.12f\n", gpuChecksum);
        std::printf("Max abs error : %.12g\n", maxError);
        std::printf("Validation    : PASS (%zu pairs / tolerance %.1e)\n", cpu.size(), Tolerance);
        std::printf("Undefined     : %zu zero-variance pairs\n", undefined);
        // Useful Pearson FLOPs: 10 per observation + 6 per pair (sqrt counts as one).
        // Excludes parallel reduction overhead, padding, comparisons and transfers.
        const double usefulFlops = (10.0 * data.observations + 6.0 * data.pairs.size()) * loops;
        std::printf("Operations    : Useful Pearson FLOPs = (10 * observations + 6 * pairs) * loops; sqrt=1; excludes padding/reduction overhead/comparisons/transfers\n");
        std::printf("CPU GFLOPS    : %.6f\n", usefulFlops / (cpuTotal / Trials) / 1e6);
        std::printf("GPU GFLOPS   : %.6f\n", usefulFlops / (gpuTotal / Trials) / 1e6);
        std::printf("CPU average   : %.3f ms\n", cpuTotal / Trials);
        std::printf("GPU average   : %.3f ms\n", gpuTotal / Trials);
        std::printf("GPU speedup   : %.2fx\n", cpuTotal / gpuTotal);
        std::printf("GPU E2E average: %.3f ms\n", gpuEndToEndTotal / Trials);
        std::printf("GPU E2E speedup: %.2fx\n", cpuTotal / gpuEndToEndTotal);
        std::printf("CPU per run   : %.6f ms\n", cpuTotal / Trials / loops);
        std::printf("GPU per run   : %.6f ms\n", gpuTotal / Trials / loops);
        if (cpuTotal >= gpuTotal)
            std::printf("\nGPU가 CPU보다 약 %.2f배 빠릅니다.\n", cpuTotal / gpuTotal);
        else
            std::printf("\nCPU가 GPU보다 약 %.2f배 빠릅니다.\n", gpuTotal / cpuTotal);
        printTopPairs(data, gpu);
        return 0;
    }
    catch (const std::exception &error)
    {
        std::fprintf(stderr, "Error: %s\n", error.what());
        return 1;
    }
}
