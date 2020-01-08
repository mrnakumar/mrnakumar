---
title: "Starting a mongodb docker container with user authentication"
date: "2020-01-08"
---

This post is about running mongodb in docker with authentication. We will be setting up admin user and a non admin user. Admin user will be like super user and non-admin user is a user with readWrite permission on database. We will also create couple of databases on container run. 

#### Dockerfile
This is how my docker file looks like with base image of mongo:4.0.2, where 4.0.2 is the mongodb versioin.

```
FROM mongo:4.2.0

COPY ./users_init.sh /docker-entrypoint-initdb.d/
```

The file `users_init.sh` contains the code that will be invoked on fresh docker start up. This also means that if you mount your existing mongodb data path as volume then this script will be ignored and no user creation will happen. This fiile is a linux shell script with javascript code in it. The javascript code is responsible for createing databases `tomi` and `imdb` and creatiion of the non-admin user. This user is given readWrite permission on the aforementioned databases. Below is the contents of this file:

```bash
#!/bin/bash
set -e

# dbUser is the userName used from applicatoin code to interact with databases and dbPwd is the password for this user.
# MONGO_INITDB_ROOT_USERNAME & MONGO_INITDB_ROOT_PASSWORD is the config for db admin.
# admin user is expected to be already created when this script executes. We use it here to authenticate as admin to create
# dbUser and databases.

echo ">>>>>>> trying to create database and users"
if [ -n "${MONGO_INITDB_ROOT_USERNAME:-}" ] && [ -n "${MONGO_INITDB_ROOT_PASSWORD:-}" ] && [ -n "${dbUser:-}" ] && [ -n "${dbPwd:-}" ]; then
mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD<<EOF
db=db.getSiblingDB('tomi');
db=db.getSiblingDB('imdb');
use tomi;
db.createUser({
  user:  '$dbUser',
  pwd: '$dbPwd',
  roles: [{
    role: 'readWrite',
    db: 'tomi'
  }]
});
use imdb;
db.createUser({
  user:  '$dbUser',
  pwd: '$dbPwd',
  roles: [{
    role: 'readWrite',
    db: 'imdb'
  }]
});
EOF
else
    echo "MONGO_INITDB_ROOT_USERNAME,MONGO_INITDB_ROOT_PASSWORD,dbUser and dbPwd must be provided. Some of these are missing, hence exiting database and user creatioin"
    exit 403
fi
```
#### Environment variables
As you can see from the contents of the file `users_init.sh` above, it uses certain environment variables. From where these  variables come from? They are coming from an environment file which is passed to docker at the time of running the container. 
The variables `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` are the inbuilt env variables in the base image ie. `mongo:4.0.2` and if these variables are present then a root user with these credentials is already created, before the script `users_init.sh` is executed. In the script we start mongo cli by authenticating as this user and then create the non-admin user and assign permission as per our needs. 

In the above script, the javascript statement `db.getSiblingDB('tomi');` creates the database `tomi` and the statement `db.getSiblingDB('imdb');` creates the database `imdb`. The statement to create user and assign roles should be self explanatory. 

Here is the content of the environment file:
```
MONGO_INITDB_ROOT_USERNAME=u
MONGO_INITDB_ROOT_PASSWORD=p
MONGO_INITDB_DATABASE=admin
dbUser=o
dbPwd=o
```

As you can see, our root user has a username of `u` and password of `p` while our non-root user has userName `o` and password `o`.  You can have different files for development and production and pass the path to this environment file in docker run command. 

#### Buliding the docker image

Assuming that all above files are in the same directory, below is the command you can use :
```
sudo docker build  -f Dockerfile -t mongoauth .
```

#### How to run this
Since I wanted to connect to this mongodb from another docker container I created a network and run this container on this network. My application code which will connect to this mongodb contianer will also use same network to find this container. Important thing to note is the path to the environment variables file. The command to run can be :
```
sudo docker run --name mongodb --rm  --network n1 --env-file .env  --log-driver=journald -v /var/lib/mongodb:/data/db -d mongoauth
```
Of course, you must have the network n1 already created for the above command to not fail. To creat the network you can use the following command:
```
sudo docker network create -d bridge n1
```

This is all you need to run a docker mongodb container with authentication.

In case you want to use docker-compose to run the mongodb instead, then your compose.yml file can look like the one given below:

```docker-compose
version: '3'
services:
  mongodb:
    image: mongo:4.2.0
    ports:
      - "27017:27017"
    volumes:
      - "ok8:/data/db"
      - "./users_init.sh:/docker-entrypoint-initdb.d/users_init.sh:ro"
    networks:
      - network1
    environment: 
        MONGO_INITDB_ROOT_USERNAME: $u
        MONGO_INITDB_ROOT_PASSWORD: $p
    env_file: 
      - $ef

networks:
   network1:
    driver: "bridge"
volumes: 
    ok8:
```
From the compose file above, it is clear that we are passing path to our environment file in argumnet variable `ef`, we will pass this one from command-line when we do docker-compose up. Similarly root user name and password are being passed in variables `u` and `p`.  The environment variables required by the script file `users_init.sh` should be available in the environment file given by argument variable `ef`. 

This is how you can run the docker-compose up to bring this up:
```
sudo u=u p=p ef=.env docker-compose up 
```
Make sure the above command is running from the directory where compose yml, .env  and users_init sh files are present. 

Thanks for reading.