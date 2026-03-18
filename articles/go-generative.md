# Go Generics: Type Parameters in Action

**Tag:** Golang
**Date:** 2026-03-18
**ReadTime:** 6 min

---

Go 1.18 brought generics - the ability to write code that works with multiple types while maintaining type safety.

## Basic Syntax

```go
func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}
```

`[T constraints.Ordered]` is a **type parameter**. The function works with any type `T` that satisfies the constraint.

## Type Constraints

Constraints define what operations are allowed:

```go
type Number interface {
    int | int64 | float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}
```

## Generic Types

```go
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() T {
    n := len(s.items) - 1
    item := s.items[n]
    s.items = s.items[:n]
    return item
}
```

## When to Use Generics

**Good use cases:**
- Container types (stacks, queues, lists)
- Algorithms (sort, search, min/max)
- Data transformation utilities

**Avoid when:**
- Simple interfaces work fine
- It makes code harder to read
- YAGNI (You Ain't Gonna Need It)

## Type Inference

Go can often infer type arguments:

```go
Min(1, 2)           // inferred as int
Min(3.14, 2.71)     // inferred as float64
```

---

Generics are powerful but use them judiciously. Prefer simple, readable code over clever abstractions.
