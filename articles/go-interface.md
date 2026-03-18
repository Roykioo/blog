# Go Interface: The Art of Abstraction

**Tag:** Golang
**Date:** 2026-03-18
**ReadTime:** 8 min

---

Go's interface is one of its most powerful features. Unlike other languages where you must explicitly declare "I implement this interface," Go uses **implicit implementation** - if your type has the methods an interface requires, it automatically satisfies that interface.

## Why Interfaces Matter

Interfaces let you write code that works with any type that satisfies certain behavior, not just specific types. This is the heart of Go's philosophy: **program to interfaces, not implementations**.

```go
type Writer interface {
    Write([]byte) (int, error)
}
```

Any type with a `Write` method satisfies `Writer`. A file, a network connection, a buffer - they all work the same way through this interface.

## Practical Example

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

func ReadAll(r Reader) ([]byte, error) {
    // Works with *os.File, *bytes.Buffer, HTTP response body...
}
```

## Key Principles

1. **Accept interfaces, return structs** - Flexible input, concrete output
2. **Small interfaces** - The standard library's `io.Reader` has just one method
3. **Interface composition** - Combine small interfaces into larger ones

## The Empty Interface

`interface{}` or `any` in Go 1.18+ holds any value. Use sparingly - type safety is your friend.

---

Mastering interfaces is mastering Go. Start small, compose thoughtfully, and let the type system work for you.
