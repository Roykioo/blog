# Go Concurrency: Goroutines and Channels

**Tag:** Golang
**Date:** 2026-03-18
**ReadTime:** 10 min

---

Go's concurrency model is built on **CSP (Communicating Sequential Processes)**. The famous quote says it all:

> "Don't communicate by sharing memory; share memory by communicating."

## Goroutines

A goroutine is a lightweight thread managed by the Go runtime:

```go
go func() {
    fmt.Println("Running in background")
}()
```

Goroutines have tiny stacks (2KB initially) and can grow/shrink. You can spawn thousands of them.

## Channels

Channels are typed conduits for goroutine communication:

```go
ch := make(chan int)

go func() {
    ch <- 42 // send
}()

val := <-ch // receive
```

### Buffered vs Unbuffered

```go
unbuffered := make(chan int)   // blocks until receiver ready
buffered := make(chan int, 10) // can hold 10 values
```

## Select

Select lets you wait on multiple channel operations:

```go
select {
case msg := <-ch1:
    fmt.Println("from ch1:", msg)
case msg := <-ch2:
    fmt.Println("from ch2:", msg)
case <-time.After(time.Second):
    fmt.Println("timeout")
}
```

## Common Patterns

### Worker Pool
```go
jobs := make(chan Job, 100)
results := make(chan Result, 100)

for i := 0; i < 5; i++ {
    go worker(jobs, results)
}
```

### Pipeline
```go
func pipeline(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- process(n)
        }
        close(out)
    }()
    return out
}
```

---

Concurrency in Go is about simplicity. Start with goroutines and channels, add complexity only when needed.
