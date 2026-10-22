// .NET 8+ / x64. CPU scalar vs AVX float64, single thread.
// Run in Release mode. Arguments: [UTF-8 CSV path] [loops, default 100].
// Build/runtime validation was not available in the generation environment.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.Intrinsics;
using System.Runtime.Intrinsics.X86;
using System.Text;

internal static class Program
{
    const int Trials = 5;
    const double Tolerance = 1e-10;
    sealed record Pair(int A, int B, double[] X, double[] Y);
    sealed record Dataset(string[] Names, List<DateTime> Dates, List<Pair> Pairs, long Valid, long Missing, long Observations);
    static List<string> ParseCsv(string line)
    {
        var fields = new List<string>();
        var field = new StringBuilder();
        bool quoted = false;
        bool closedQuote = false;
        bool fieldStarted = false;
        for (int i = 0; i < line.Length; i++)
        {
            char c = line[i];
            if (c == '"')
            {
                if (quoted && i + 1 < line.Length && line[i + 1] == '"') { field.Append('"'); i++; }
                else if (quoted) { quoted = false; closedQuote = true; }
                else if (!fieldStarted && !closedQuote) { quoted = true; fieldStarted = true; }
                else throw new FormatException("Invalid quote in CSV field");
            }
            else if (c == ',' && !quoted) { fields.Add(field.ToString().Trim()); field.Clear(); closedQuote = false; fieldStarted = false; }
            else if (!quoted && closedQuote && !char.IsWhiteSpace(c)) throw new FormatException("Unexpected data after CSV quote");
            else { field.Append(c); if (!char.IsWhiteSpace(c)) fieldStarted = true; }
        }
        if (quoted) throw new FormatException("Unclosed CSV quote");
        fields.Add(field.ToString().Trim());
        return fields;
    }
    static double Price(string s)
    {
        if (s == "" || s == "-" || s == "NA" || s == "N/A") return double.NaN;
        double v = double.Parse(s.Replace(",", ""), NumberStyles.Float, CultureInfo.InvariantCulture);
        if (!double.IsFinite(v) || v <= 0) throw new FormatException("Invalid price: " + s);
        return v;
    }
    static Dataset Load(string path)
    {
        using var reader = new StreamReader(path, new UTF8Encoding(false, true), false);
        string first = reader.ReadLine() ?? throw new FormatException("Empty CSV");
        var header = ParseCsv(first.TrimStart('\uFEFF'));
        if (header.Count < 3) throw new FormatException("At least two region columns required");
        string[] names = header.Skip(1).ToArray();
        if (names.Any(string.IsNullOrWhiteSpace)) throw new FormatException("Empty region name");
        var prices = names.Select(_ => new List<double>()).ToArray();
        var dates = new List<DateTime>();
        long valid = 0, missing = 0, observations = 0;
        int lineNumber = 1;
        string? line;
        while ((line = reader.ReadLine()) != null)
        {
            lineNumber++;
            if (string.IsNullOrWhiteSpace(line)) continue;
            var fields = ParseCsv(line);
            if (fields.Count != header.Count) throw new FormatException($"Column count mismatch at line {lineNumber}");
            string digits = new string(fields[0].Where(c => c >= '0' && c <= '9').ToArray());
            if (digits.Length != 8) throw new FormatException($"Invalid date at line {lineNumber}");
            DateTime date = DateTime.ParseExact(digits, "yyyyMMdd", CultureInfo.InvariantCulture);
            if (dates.Count > 0 && date <= dates[^1]) throw new FormatException("Dates must be unique and ascending");
            dates.Add(date);
            for (int r = 0; r < names.Length; r++)
            {
                double v;
                try { v = Price(fields[r + 1]); }
                catch (Exception e) { throw new FormatException($"Invalid price at line {lineNumber}, column {r + 2}", e); }
                prices[r].Add(v);
                if (double.IsFinite(v)) valid++; else missing++;
            }
        }
        if (dates.Count < 3) throw new FormatException("Insufficient dates");
        var returns = new double[names.Length][];
        for (int r = 0; r < names.Length; r++)
        {
            returns[r] = new double[dates.Count - 1];
            Array.Fill(returns[r], double.NaN);
            for (int i = 1; i < dates.Count; i++)
            {
                double p = prices[r][i - 1], q = prices[r][i];
                if ((dates[i] - dates[i - 1]).Days == 1 && double.IsFinite(p) && double.IsFinite(q)) returns[r][i - 1] = (q - p) / p * 100;
            }
        }
        var pairs = new List<Pair>();
        for (int a = 0; a < names.Length; a++)
        {
            for (int b = a + 1; b < names.Length; b++)
            {
                var x = new List<double>();
                var y = new List<double>();
                for (int i = 0; i < dates.Count - 1; i++)
                {
                    if (double.IsFinite(returns[a][i]) && double.IsFinite(returns[b][i])) { x.Add(returns[a][i]); y.Add(returns[b][i]); }
                }
                if (x.Count >= 2) { pairs.Add(new Pair(a, b, x.ToArray(), y.ToArray())); observations += x.Count; }
            }
        }
        if (pairs.Count == 0) throw new FormatException("No pairs with enough common dates");
        return new Dataset(names, dates, pairs, valid, missing, observations);
    }
    static double Finish(double xy, double xx, double yy) => xx <= 0 || yy <= 0 ? double.NaN : Math.Clamp(xy / (Math.Sqrt(xx) * Math.Sqrt(yy)), -1, 1);
    [MethodImpl(MethodImplOptions.NoInlining)]
    static void CPU(List<Pair> pairs, double[] output)
    {
        for (int p = 0; p < pairs.Count; p++)
        {
            double[] x = pairs[p].X, y = pairs[p].Y;
            int n = x.Length;
            double sx = 0, sy = 0;
            for (int i = 0; i < n; i++) { sx += x[i]; sy += y[i]; }
            double mx = sx / n, my = sy / n, xx = 0, yy = 0, xy = 0;
            for (int i = 0; i < n; i++) { double dx = x[i] - mx, dy = y[i] - my; xx += dx * dx; yy += dy * dy; xy += dx * dy; }
            output[p] = Finish(xy, xx, yy);
        }
    }
    static double Sum(Vector256<double> v) => ((v.GetElement(0) + v.GetElement(1)) + v.GetElement(2)) + v.GetElement(3);
    [MethodImpl(MethodImplOptions.NoInlining)]
    static void SIMD(List<Pair> pairs, double[] output)
    {
        for (int p = 0; p < pairs.Count; p++)
        {
            double[] x = pairs[p].X, y = pairs[p].Y;
            int n = x.Length, end = n - n % 4;
            var sx = Vector256<double>.Zero;
            var sy = Vector256<double>.Zero;
            for (int i = 0; i < end; i += 4)
            {
                sx = Avx.Add(sx, Vector256.LoadUnsafe(ref x[i]));
                sy = Avx.Add(sy, Vector256.LoadUnsafe(ref y[i]));
            }
            double sumX = Sum(sx), sumY = Sum(sy);
            for (int i = end; i < n; i++) { sumX += x[i]; sumY += y[i]; }
            double meanX = sumX / n, meanY = sumY / n;
            var mx = Vector256.Create(meanX);
            var my = Vector256.Create(meanY);
            var xx = Vector256<double>.Zero;
            var yy = Vector256<double>.Zero;
            var xy = Vector256<double>.Zero;
            for (int i = 0; i < end; i += 4)
            {
                var dx = Avx.Subtract(Vector256.LoadUnsafe(ref x[i]), mx);
                var dy = Avx.Subtract(Vector256.LoadUnsafe(ref y[i]), my);
                xx = Avx.Add(xx, Avx.Multiply(dx, dx));
                yy = Avx.Add(yy, Avx.Multiply(dy, dy));
                xy = Avx.Add(xy, Avx.Multiply(dx, dy));
            }
            double sumXX = Sum(xx), sumYY = Sum(yy), sumXY = Sum(xy);
            for (int i = end; i < n; i++) { double dx = x[i] - meanX, dy = y[i] - meanY; sumXX += dx * dx; sumYY += dy * dy; sumXY += dx * dy; }
            output[p] = Finish(sumXY, sumXX, sumYY);
        }
    }
    static double Validate(double[] cpu, double[] simd)
    {
        double max = 0;
        for (int i = 0; i < cpu.Length; i++)
        {
            if (double.IsNaN(cpu[i]) && double.IsNaN(simd[i])) continue;
            if (!double.IsFinite(cpu[i]) || !double.IsFinite(simd[i])) throw new Exception("Non-finite mismatch");
            double e = Math.Abs(cpu[i] - simd[i]);
            if (e > Tolerance) throw new Exception($"Validation failed at pair {i}");
            max = Math.Max(max, e);
        }
        return max;
    }
    static double Benchmark(Action<List<Pair>, double[]> fn, List<Pair> pairs, double[] output, int loops)
    {
        var timer = Stopwatch.StartNew();
        for (int i = 0; i < loops; i++) fn(pairs, output);
        return timer.Elapsed.TotalMilliseconds;
    }
    static string Pad(string text, int width) => text + new string(' ', Math.Max(0, width - text.Sum(c => c < 128 ? 1 : 2)));
    static int Main(string[] args)
    {
        Console.OutputEncoding = new UTF8Encoding(false);
        CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;
        try
        {
            if (!Avx.IsSupported) throw new PlatformNotSupportedException("AVX-capable x64 CPU/runtime required");
            string path = args.Length > 0 ? args[0] : "../datas/utf8/주유소_지역별_평균판매가격-보통휘발유.csv";
            int loops = args.Length > 1 ? int.Parse(args[1]) : 100;
            if (loops < 1) throw new ArgumentException("Loops must be positive");
            var timer = Stopwatch.StartNew();
            Dataset d = Load(path);
            double loadMs = timer.Elapsed.TotalMilliseconds;
            var cpu = new double[d.Pairs.Count];
            var simd = new double[d.Pairs.Count];
            Console.WriteLine($"Runtime       : .NET {Environment.Version}\nEnvironment   : {System.Runtime.InteropServices.RuntimeInformation.OSDescription} / {System.Runtime.InteropServices.RuntimeInformation.ProcessArchitecture} / {Environment.ProcessorCount} logical CPUs\nFile          : {path}\nTest          : Pearson correlation of daily price changes / float64\nCPU           : Scalar / single thread\nSIMD          : AVX 256-bit / 4 doubles / single thread\nArray         : {d.Dates.Count} dates / {d.Names.Length} region columns / {d.Valid} valid prices\nPeriod        : {d.Dates[0]:yyyyMMdd} - {d.Dates[^1]:yyyyMMdd}\nMissing       : {d.Missing} / excluded, not zero-filled\nPairs         : {d.Pairs.Count}\nObservations  : {d.Observations}\nPreprocess    : {loadMs:F3} ms / excluded\nTiming        : Pair means + centered covariance + correlation\nLoops         : {loops} per trial\nTrials        : {Trials}\nTolerance     : {Tolerance:E1}");
            var sampleSizes = d.Pairs.Select(p => p.X.Length).OrderBy(n => n).ToArray();
            Console.WriteLine($"Sample counts : {sampleSizes[0]} / {sampleSizes[sampleSizes.Length / 2]} / {sampleSizes[^1]} (min / median / max)");
            for (int i = 0; i < 30; i++) { CPU(d.Pairs, cpu); SIMD(d.Pairs, simd); }
            double maxError = Validate(cpu, simd), cpuTotal = 0, simdTotal = 0;
            Console.WriteLine($"\n{"Trial",-8} {"CPU(ms)",14} {"SIMD(ms)",14} {"Speedup",12}");
            for (int t = 0; t < Trials; t++)
            {
                double c, s;
                if (t % 2 == 0) { c = Benchmark(CPU, d.Pairs, cpu, loops); s = Benchmark(SIMD, d.Pairs, simd, loops); }
                else { s = Benchmark(SIMD, d.Pairs, simd, loops); c = Benchmark(CPU, d.Pairs, cpu, loops); }
                maxError = Math.Max(maxError, Validate(cpu, simd));
                cpuTotal += c;
                simdTotal += s;
                Console.WriteLine($"{t + 1,-8} {c,14:F3} {s,14:F3} {c / s,11:F2}x");
            }
            Console.WriteLine($"\nCPU checksum  : {cpu.Where(double.IsFinite).Sum():F12}\nSIMD checksum : {simd.Where(double.IsFinite).Sum():F12}\nMax abs error : {maxError:G12}\nValidation    : PASS ({cpu.Length} pairs / tolerance {Tolerance:E1})\nUndefined     : {cpu.Count(double.IsNaN)} zero-variance pairs\nCPU average   : {cpuTotal / Trials:F3} ms\nSIMD average  : {simdTotal / Trials:F3} ms\nSIMD speedup  : {cpuTotal / simdTotal:F2}x\nCPU per run   : {cpuTotal / Trials / loops:F6} ms\nSIMD per run  : {simdTotal / Trials / loops:F6} ms");
            int width = Math.Max(12, d.Names.Max(s => s.Sum(c => c < 128 ? 1 : 2)) + 2), rank = 0;
            Console.WriteLine("\n일별 가격 변동률 상관계수 상위 10개 지역 쌍");
            Console.WriteLine($"{Pad("순위", 8)}{Pad("지역 A", width)}{Pad("지역 B", width)}{"Samples",12} {"Correlation",16}");
            foreach (int i in Enumerable.Range(0, simd.Length).Where(i => double.IsFinite(simd[i])).OrderByDescending(i => simd[i]).ThenBy(i => i).Take(10))
            {
                Pair p = d.Pairs[i];
                Console.WriteLine($"{++rank,-8}{Pad(d.Names[p.A], width)}{Pad(d.Names[p.B], width)}{p.X.Length,12} {simd[i],16:F12}");
            }
            return 0;
        }
        catch (Exception e) { Console.Error.WriteLine("Error: " + e.Message); return 1; }
    }
}
