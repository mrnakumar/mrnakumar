---
title: "Primary key in mongo db"
date: "2019-12-03"
---

Each document in mongo db is required to have a primary key and this key is always indexed. While inserting a document in mongo, if you do not include an '_id' field then mongo will create a new value of bson type ObjectId and set _id field with it. Does the primary key always needs to be of type ObjectId? Is it okay to create ObjectId in application code? 

### ObjectId
ObjectId is a bson type. It's values are 12 bytes in size. Don't be confused when you see a ObjectId with 24 characters in RoboMongo, because each of those characters do not represent a byte. Since this is a Hexadecimal string and each character represents just 4 bits, these 24 characters just go as 12 bytes.  The values of this type are good for sorting the documents in collection because they contain timestamp in them. This means that ObjectId is structured in a way where timestamp, integer counter are encoded in those 12 bytes. 

ObjectId can be a good default primary key choice if you do not have a meaningful primary key in your document. But if you have a meaningful primary key in your application then you might want to use that key as primary key instead of default generated ObjectId. If you don't then you will have to create an index on your key field to do efficient lookup by that key. 

### Can I create ObjectId?
Creating ObjectId is easy as long as you can provide the correct hex string to its constructor/creatorFunction. For my case where I had to use an IMDB movieId as a primary key, this wasn't a good option. Because for example, IMDB movie id does not contain a timestamp in it, a counter intialized to a random value etc, all these things need to be present in the hex string that you pass to the constructor of ObjectId in GoLang. I could have transformed these ID's to ObjectIds by using some crazy and hard to understand code, but that is not what I usually want. 
So as long as an application can generate 24 byte hex string in a format expected by ObjectId constructor, it can create an ObjectId and use it in whatever way it wants. 

### Other types for _id field?
You can use most of the bson type for _id field but not all, for example you can use int, long etc. In my case I just used the moveId for _id fields and movieId was a string in my applicatoin. And it is working fine so far, both for insert and findById. I haven't tested it on a sharded cluster though. I don't think that will be an issue. 

### Query on ObjectId
One more case is when you are using ObjectId for _id field and you want to provide a findById feature in your applicatoin. Users will provide you not the ObjectId instance but a hex string. If you query mongo by string and field is of type ObjectId then obviously you will find zero documents with it. GoLang official driver provides a way to convert a hex string to ObjectId, you can use this as follows:

```go
     id, err := primitive.ObjectIDFromHex(idString)
     if err!=nil{
         //may be take some action
     }
```

Thanks for reading.