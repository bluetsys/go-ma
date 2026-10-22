// Requires amd64 Go with experimental simd/archsimd and GOEXPERIMENT=simd.
// Arguments: [UTF-8 CSV path] [loops, default 100].
// API reference: https://pkg.go.dev/simd/archsimd
// Build/runtime validation was not available in the generation environment.
package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"os"
	"runtime"
	"simd/archsimd"
	"sort"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"
)

const trials = 5
const tolerance = 1e-10

type pair struct {
	a, b int
	x, y []float64
}
type dataset struct {
	names                        []string
	dates                        []time.Time
	pairs                        []pair
	valid, missing, observations int
}

func finite(v float64) bool { return !math.IsNaN(v) && !math.IsInf(v, 0) }
func price(s string) (float64, error) {
	s = strings.TrimSpace(s)
	if s == "" || s == "-" || s == "NA" || s == "N/A" {
		return math.NaN(), nil
	}
	v, err := strconv.ParseFloat(strings.ReplaceAll(s, ",", ""), 64)
	if err != nil || !finite(v) || v <= 0 {
		return 0, fmt.Errorf("invalid price: %q", s)
	}
	return v, nil
}
func load(path string) (*dataset, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	if !utf8.Valid(content) {
		return nil, fmt.Errorf("CSV must be UTF-8")
	}
	reader := csv.NewReader(strings.NewReader(strings.TrimPrefix(string(content), "\ufeff")))
	header, err := reader.Read()
	if err != nil {
		return nil, err
	}
	if len(header) < 3 {
		return nil, fmt.Errorf("at least two region columns required")
	}
	d := &dataset{names: header[1:]}
	prices := make([][]float64, len(d.names))
	for i := range d.names {
		d.names[i] = strings.TrimSpace(d.names[i])
		if d.names[i] == "" {
			return nil, fmt.Errorf("empty region name")
		}
	}
	for {
		fields, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		var digits strings.Builder
		for _, c := range fields[0] {
			if c >= '0' && c <= '9' {
				digits.WriteRune(c)
			}
		}
		date, err := time.Parse("20060102", digits.String())
		if err != nil || date.Year() < 1 {
			return nil, fmt.Errorf("invalid date: %q", fields[0])
		}
		if len(d.dates) > 0 && !date.After(d.dates[len(d.dates)-1]) {
			return nil, fmt.Errorf("dates must be unique and ascending")
		}
		d.dates = append(d.dates, date)
		for r := range d.names {
			v, err := price(fields[r+1])
			if err != nil {
				return nil, fmt.Errorf("date %s, column %d: %w", digits.String(), r+2, err)
			}
			prices[r] = append(prices[r], v)
			if finite(v) {
				d.valid++
			} else {
				d.missing++
			}
		}
	}
	if len(d.dates) < 3 {
		return nil, fmt.Errorf("insufficient dates")
	}
	returns := make([][]float64, len(d.names))
	for r := range d.names {
		returns[r] = make([]float64, len(d.dates)-1)
		for i := 1; i < len(d.dates); i++ {
			p, q := prices[r][i-1], prices[r][i]
			returns[r][i-1] = math.NaN()
			if d.dates[i].Sub(d.dates[i-1]) == 24*time.Hour && finite(p) && finite(q) {
				returns[r][i-1] = (q - p) / p * 100
			}
		}
	}
	for a := range d.names {
		for b := a + 1; b < len(d.names); b++ {
			p := pair{a: a, b: b}
			for i, x := range returns[a] {
				y := returns[b][i]
				if finite(x) && finite(y) {
					p.x = append(p.x, x)
					p.y = append(p.y, y)
				}
			}
			if len(p.x) >= 2 {
				d.observations += len(p.x)
				d.pairs = append(d.pairs, p)
			}
		}
	}
	if len(d.pairs) == 0 {
		return nil, fmt.Errorf("no pairs with enough common dates")
	}
	return d, nil
}
func finish(xy, xx, yy float64) float64 {
	if xx <= 0 || yy <= 0 {
		return math.NaN()
	}
	return math.Max(-1, math.Min(1, xy/(math.Sqrt(xx)*math.Sqrt(yy))))
}

//go:noinline
func calculateCPU(pairs []pair, output []float64) {
	for p := range pairs {
		x, y := pairs[p].x, pairs[p].y
		sx, sy := 0.0, 0.0
		for i := range x {
			sx += x[i]
			sy += y[i]
		}
		mx, my := sx/float64(len(x)), sy/float64(len(x))
		xx, yy, xy := 0.0, 0.0, 0.0
		for i := range x {
			dx, dy := x[i]-mx, y[i]-my
			xx += float64(dx * dx)
			yy += float64(dy * dy)
			xy += float64(dx * dy)
		}
		output[p] = finish(xy, xx, yy)
	}
}
func horizontalSum(v archsimd.Float64x4) float64 {
	var lanes [4]float64
	v.StoreArray(&lanes)
	return ((lanes[0] + lanes[1]) + lanes[2]) + lanes[3]
}

//go:noinline
func calculateSIMD(pairs []pair, output []float64) {
	for p := range pairs {
		x, y := pairs[p].x, pairs[p].y
		n := len(x)
		end := n - n%4
		var sx, sy archsimd.Float64x4
		for i := 0; i < end; i += 4 {
			sx = sx.Add(archsimd.LoadFloat64x4(x[i : i+4]))
			sy = sy.Add(archsimd.LoadFloat64x4(y[i : i+4]))
		}
		sumX, sumY := horizontalSum(sx), horizontalSum(sy)
		for i := end; i < n; i++ {
			sumX += x[i]
			sumY += y[i]
		}
		meanX, meanY := sumX/float64(n), sumY/float64(n)
		mx, my := archsimd.BroadcastFloat64x4(meanX), archsimd.BroadcastFloat64x4(meanY)
		var xx, yy, xy archsimd.Float64x4
		for i := 0; i < end; i += 4 {
			dx := archsimd.LoadFloat64x4(x[i : i+4]).Sub(mx)
			dy := archsimd.LoadFloat64x4(y[i : i+4]).Sub(my)
			xx = xx.Add(dx.Mul(dx))
			yy = yy.Add(dy.Mul(dy))
			xy = xy.Add(dx.Mul(dy))
		}
		sumXX, sumYY, sumXY := horizontalSum(xx), horizontalSum(yy), horizontalSum(xy)
		for i := end; i < n; i++ {
			dx, dy := x[i]-meanX, y[i]-meanY
			sumXX += float64(dx * dx)
			sumYY += float64(dy * dy)
			sumXY += float64(dx * dy)
		}
		output[p] = finish(sumXY, sumXX, sumYY)
	}
}
func validate(cpu, simd []float64) (float64, error) {
	maximum := 0.0
	for i, c := range cpu {
		s := simd[i]
		if math.IsNaN(c) && math.IsNaN(s) {
			continue
		}
		if !finite(c) || !finite(s) {
			return 0, fmt.Errorf("non-finite mismatch at pair %d", i)
		}
		e := math.Abs(c - s)
		if e > tolerance {
			return 0, fmt.Errorf("validation failed at pair %d: %.12g", i, e)
		}
		maximum = math.Max(maximum, e)
	}
	return maximum, nil
}

//go:noinline
func benchmark(fn func([]pair, []float64), pairs []pair, output []float64, loops int) float64 {
	start := time.Now()
	for i := 0; i < loops; i++ {
		fn(pairs, output)
	}
	return float64(time.Since(start).Nanoseconds()) / 1e6
}
func width(s string) int {
	n := 0
	for _, c := range s {
		if c < 128 {
			n++
		} else {
			n += 2
		}
	}
	return n
}
func pad(s string, n int) string { return s + strings.Repeat(" ", max(0, n-width(s))) }
func run() error {
	if !archsimd.X86.AVX() {
		return fmt.Errorf("AVX-capable amd64 CPU/runtime required")
	}
	path := "../datas/utf8/주유소_지역별_평균판매가격-보통휘발유.csv"
	loops := 100
	if len(os.Args) > 1 {
		path = os.Args[1]
	}
	if len(os.Args) > 2 {
		var err error
		loops, err = strconv.Atoi(os.Args[2])
		if err != nil || loops < 1 {
			return fmt.Errorf("loops must be a positive integer")
		}
	}
	start := time.Now()
	d, err := load(path)
	if err != nil {
		return err
	}
	loadMs := float64(time.Since(start).Nanoseconds()) / 1e6
	cpu, simd := make([]float64, len(d.pairs)), make([]float64, len(d.pairs))
	fmt.Printf("Runtime       : %s / %s\nEnvironment   : %s / %d logical CPUs / GOMAXPROCS=%d\nFile          : %s\nTest          : Pearson correlation of daily price changes / float64\nCPU           : Scalar / single thread\nSIMD          : AVX 256-bit / 4 doubles / single thread\n", runtime.Version(), runtime.GOARCH, runtime.GOOS, runtime.NumCPU(), runtime.GOMAXPROCS(0), path)
	fmt.Printf("Array         : %d dates / %d region columns / %d valid prices\nPeriod        : %s - %s\nMissing       : %d / excluded, not zero-filled\nPairs         : %d\nObservations  : %d\n", len(d.dates), len(d.names), d.valid, d.dates[0].Format("20060102"), d.dates[len(d.dates)-1].Format("20060102"), d.missing, len(d.pairs), d.observations)
	sampleSizes := make([]int, len(d.pairs)); for i := range d.pairs { sampleSizes[i] = len(d.pairs[i].x) }; sort.Ints(sampleSizes)
	fmt.Printf("Sample counts : %d / %d / %d (min / median / max)\n", sampleSizes[0], sampleSizes[len(sampleSizes)/2], sampleSizes[len(sampleSizes)-1])
	fmt.Printf("Preprocess    : %.3f ms / excluded\nTiming        : Pair means + centered covariance + correlation\nLoops         : %d per trial\nTrials        : %d\nTolerance     : %.1e\n", loadMs, loops, trials, tolerance)
	for i := 0; i < 5; i++ {
		calculateCPU(d.pairs, cpu)
		calculateSIMD(d.pairs, simd)
	}
	maximum, err := validate(cpu, simd)
	if err != nil {
		return err
	}
	runtime.GC()
	cpuTotal, simdTotal := 0.0, 0.0
	fmt.Printf("\n%-8s %14s %14s %12s\n", "Trial", "CPU(ms)", "SIMD(ms)", "Speedup")
	for t := 0; t < trials; t++ {
		var c, s float64
		if t%2 == 0 {
			c = benchmark(calculateCPU, d.pairs, cpu, loops)
			s = benchmark(calculateSIMD, d.pairs, simd, loops)
		} else {
			s = benchmark(calculateSIMD, d.pairs, simd, loops)
			c = benchmark(calculateCPU, d.pairs, cpu, loops)
		}
		e, err := validate(cpu, simd)
		if err != nil {
			return err
		}
		maximum = math.Max(maximum, e)
		cpuTotal += c
		simdTotal += s
		fmt.Printf("%-8d %14.3f %14.3f %11.2fx\n", t+1, c, s, c/s)
	}
	cpuSum, simdSum, undefined := 0.0, 0.0, 0
	order := make([]int, 0, len(cpu))
	for i, c := range cpu {
		if math.IsNaN(c) {
			undefined++
			continue
		}
		cpuSum += c
		simdSum += simd[i]
		order = append(order, i)
	}
	fmt.Printf("\nCPU checksum  : %.12f\nSIMD checksum : %.12f\nMax abs error : %.12g\nValidation    : PASS (%d pairs / tolerance %.1e)\nUndefined     : %d zero-variance pairs\n", cpuSum, simdSum, maximum, len(cpu), tolerance, undefined)
	fmt.Printf("CPU average   : %.3f ms\nSIMD average  : %.3f ms\nSIMD speedup  : %.2fx\nCPU per run   : %.6f ms\nSIMD per run  : %.6f ms\n", cpuTotal/trials, simdTotal/trials, cpuTotal/simdTotal, cpuTotal/trials/float64(loops), simdTotal/trials/float64(loops))
	sort.Slice(order, func(a, b int) bool {
		if simd[order[a]] != simd[order[b]] {
			return simd[order[a]] > simd[order[b]]
		}
		return order[a] < order[b]
	})
	w := 12
	for _, name := range d.names {
		w = max(w, width(name)+2)
	}
	fmt.Println("\n일별 가격 변동률 상관계수 상위 10개 지역 쌍")
	fmt.Printf("%s%s%s%12s %16s\n", pad("순위", 8), pad("지역 A", w), pad("지역 B", w), "Samples", "Correlation")
	for rank, i := range order[:min(10, len(order))] {
		p := d.pairs[i]
		fmt.Printf("%-8d%s%s%12d %16.12f\n", rank+1, pad(d.names[p.a], w), pad(d.names[p.b], w), len(p.x), simd[i])
	}
	return nil
}
func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
}
