---
title: "Channels in Go Lang. An introduction."
date: "2019-11-08"
---

In this blog post we are going to learn the basics of channels in go programming language.

### What is a channel

You can think of a channel as a pipe which carries data. You write data to channel and someone consumes that data. Channels are very useful to make concurrent parts of your program talk to each other and can help you avoid having to use memory synchronization techniqes in concurrent programs.

### How to create a channel

Channel is created with specific type. A channel of type `string` can only carry `string` data. A channel of `int` can only carry `int`.

Following code snippet shows how to create an unbuffered channel and perform read/write operations on it. Unbeffered channels are synchronous. Buffered channel blocks consumer/producer when it is empty/full. You can understand unbuffered channel as a buffered channel which is always full and empty at the same time, hence every put on an ubbuffered channel blocks until there is some consumer to consume that data, similarly every consume request blocks until there is some producer to produce some data.

```go
dictionaryRequestChannel := make(chan string)
dictionaryRequestChannel <- "Hello"
println(<- dictionaryRequestChannel)
```

Above statement creates a string channel and assigns it to variable <b>dictionaryRequestChannel</b> and then performs write followed by a read operation.

### Read-only/Write-only channel
A channel can be bidirectional or unidirectional. If a part of your program is never going to write to a channel then pass read-only version of that channel to that part of your program. This will make your program easy to understand and reason about. Following code snippet passes a read-only version of <b>dictionaryRequestChannel</b> to function <i>reader</i> and a write-only version to function <i>writer</i>. Another function named readerWriter gets the bidirectional channel. In each of these method definations notice the place where <b><- </b> is placed in method parameter.

```go
func reader(dictionaryChannel <- chan string){
    println(<- dictionaryChannel)
    //println(dictionaryChannel <- "Hello") this won't compile, because dictionaryChannel is read-only
}

func writer(dictionaryChannel chan <- string){
    dictionaryChannel<- "Hello"
    //println(<- dictionaryChannel) won't compile because dictionaryChannel is write only
}

func readerWriter(dictionaryChannel chan string){
    dictionaryChannel <- "Hello"
    println(<-dictionaryChannel)
}

func caller(){
    dictionaryRequestChannel := make(chan string)
    go reader(dictionaryRequestChannel)
    go writer(dictionaryRequestChannel)
    go readerWriter(dictionaryRequestChannel)
}
```

### Channel select 
Channel select allows you to use one or more channels in very interesting ways. We will discuss couple of commonly used channel select patterns here.

#### Select from multiple channels
Take a look the following code 
```go
     func politics(bjp <- chan string, congress <- chan string){
    	select{
        	case <- bjp:{
        		println("bjp recruited a criminal")
        	}
        
    		case <- congress:{
    			println("congress recruited a criminal")
    		}
    	}
    }
```

The above code will read a single message from one of the channels bjp or congress. Whichever channel has data available  will be picked up to read from. If both the channels have the data at the same time then one of them is picked randomly with equal probability. Case clause is not executed in top down manner like switch statement in many programming languages.

One problem with the above code is that the select statement will block if none of the channels has data available. If you want to do something else in the meantime while none of the channels have any data then you can add a default case as show in below given code snippet.

```go
     func politics(bjp <- chan string, congress <- chan string){
    
    	select{
        	case <- bjp:{
        		println("bjp recruited a criminal")
        	}
        
    		case <- congress:{
    			println("congress recruited a criminal")
    		}
    	    default:{
    		    println("nobody seems to be recruiting criminals")
    	    }    
	}
}
```
In above given code snippet, the select statement will execute the default statement immediately if none of the channels has data available. 

#### Timeout on select
You can use timeout if you want to take some action after waiting on channel(s) for data for a certain amount of time as shown below.

```go
   func politics(bjp <- chan string, congress <- chan string){
    
    	select{
        	case <- bjp:{
        		println("bjp recruited a criminal")
        	}
        
    		case <- congress:{
    			println("congress recruited a criminal")
    		}
    		case <-time.After(1 * time.Second):{
				println("did not find any criminal after long wait")	
    		}
	    }
    }
```
The timeout pattern is very useful in many situations. In your coding career with GoLang you are very likely to encounter a need to use timeout with channel select. 

That is all for this introductory post on channels.

Thanks for reading. 