---
title: "Download a file from internet and gunzip it in memory in GoLang"
date: "2019-11-20"
---

In this blog post we I will share how to download a gzip file from a website and process it after decompressing it in memory. We won't be using disk storage.

## What is Gunzip or gzip

gzip is a file format and a computer program which can compress/decompress a file. Whenever you want to reduce the size of a file, you can use gzip to compress that file. You can also compress a directory/folder using gzip along with tar: first create a tar and then compress it. Usually a file compressed with gzip ends with **.gz** extension and a directory compressed with gzip ends with **.tar.gz**.  Since internet can explain gzip better than I can, we will not waste more time on this.

### Download a gzip file from IMDB's website
Downloading a gzip file is no different than downloading any other binary file in GoLang. We will use GoLang's net/http package to do it. 

```go
resp, err := http.Get("https://datasets.imdbws.com/title.ratings.tsv.gz")
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		log.Fatalf("could not pull data from imdb, status code is %d", resp.StatusCode)
	}
```

The above given code, downloads ratings file from IMDB. Now we have to read the response body and decompress it using compress/gzip package of GoLang as shown below:

```go
gReader, err := gzip.NewReader(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	scanner := bufio.NewScanner(gReader)

	done := false
	for scanner.Scan() {
		line := scanner.Text()
		println(line)
		done = true
		if done {
			break
		}
	}
```

The above code wraps the http response body in gzip reader, this reader can decompress the input. And then we wrap this gzip reader inside a scanner. Scanner let us read a io.Reader line by line. The above program, intentionally, just prints the first line of the file downloaded from IMDB because the file is too big and will screw my terminal. 

I found this quite easy to be able to download and decompress a file in memory in golang. 

Thanks for reading.