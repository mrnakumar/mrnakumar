---
title: "Custom sort in Go language"
date: "2020-04-14"
---

Go language provides library functions to sort slice of many common types. However, when you have some collection of custom 
type, then  it is not so straightforward to sort it because you won't find built-in methods to do so unless you are ready to
use reflection. 

`sort` package has an interface that can be implemented by any collection you want to sort. The interface looks lik:
```go
type Interface interface {
    // Len is the number of elements in the collection.
    Len() int
    // Less reports whether the element with
    // index i should sort before the element with index j.
    Less(i, j int) bool
    // Swap swaps the elements with indexes i and j.
    Swap(i, j int)
}
```

Here is an example, of how I implemented the above interface to sort a slice of custom type.

```go

//Our Custom type 
type ElementWithIndex struct {
	index   int
	element int32
}

//Type defination to make code more readable
type GamingArray []*ElementWithIndex

//this function just invokes built-in sort function, like we do on an slice of primitive types like []int32
//this works because the slice of type `[]*ElementWithIndex` implements `sort.Interface`
func sortByElement(ewi []*ElementWithIndex) {
	sort.Sort(GamingArray(ewi))
}

//Next three methods are our implementation of methods from `sort.Interface` for our collection 
func (a GamingArray) Len() int {
	return len(a)
}

func (a GamingArray) Less(i, j int) bool {
	return a[i].element > a[j].element
}

func (a GamingArray) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
```

The above code snippet, demonstrates how to sort a collection of custom type in reverse order on some field. As you can see,
we just invoked the built-in sort function and everything worked out becuase our collection is sortable as it implements `sort.Interface`.

 Thanks for reading.