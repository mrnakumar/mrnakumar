---
title: "Iterate over elements of string of digits in Go language"
date: "2020-04-14"
---

A short code example of how to iterate over a string in go lang, when every element of string is a numeric digit.

Suppose we have a function `increment` as shown below:
```go
func increment(a int32) int32 {
    return a + 1
}
```

The above given function needs an int32 as parameter. Our main function is given a string of digits, and we have to print each digit after incrementing it by one. Clearly, we need to get numeric value of each digit in the input string. 

```go
func main() {
    input := "1234"
    for _, r := range input {
        println(increment(r-'0'))
    }
}
```

As we can see in the above code snippet, we can iterate over a string in Go Lang by using range. Variable 'r' contains rune for each character in string 'input' one at a time. Actual numeric value can be acheived by subtracting the ASCII value of digit ZERO.

OUTPUT: <br/>
2 <br />
3 <br/>
4 <br/>
5