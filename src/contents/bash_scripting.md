---
title: "Bash scripting"
date: "2020-10-23"
---

### Redirect output of a loop to a file
Wrap the loop in parenthisis and then use redirection operator.
```bash
(for i in {1..10}; do \
    echo "line number $i"; \
done) > output.txt 2>&1
```

### Feed output of a command into a `while` loop
I want to open a chrome tab with every url with `https` scheme in file `urls.txt` given below.
```txt
https://www.google.com
http://youtube.com
```

I can `cat` this file, filter on `https` and then use `while` to open a Google Chrome tab for each such url as shown below:
```bash
cat urls.txt | grep "https://" | (while read url; do open -a "Google Chrome" "$url"; done)
```     

### Repeat something using `for` loop
Print parrot names.
```bash
numTabs=30; \
beingAt=6899; \
N=$((numTabs-1)); \
for((j=0;j<=N;j++)); do \
   parrotNumber=$(($beginAt - $j)); \
   parrotName="parrot${parrotNumber}"; \
   echo "$parrotName";
done
```

### Access array by index
#### Print alternative elements.
```bash
array=(apple banana mango rotten republic); \
arrayLength=${#array[@]}; \
for((i=0;i<$arrayLength;i++)); do \
   remainder=$(($i%2)); \
   if [ "$remainder" = "0" ]; then \
     echo "${array[$i]}"; \
   fi \
done
```
#### Print every third element
```bash
array=(apple banana mango rotten republic); \
for((i=0;i<${#array[@]};i=i+3)); do \
     echo "${array[$i]}"; \
done
```