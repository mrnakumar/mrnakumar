---
title: "Dockerizing golang application"
date: "2020-01-09"
---

In this post, I will be talking about how to dockerize a golang application. I am using a multistage build as recommended in docker best practices. This will help me in keeping the size of image less. The contnets of Dockerfile are:

```

FROM golang:1.13.4 as builder
ARG sourceLocation=/
WORKDIR ${sourceLocation}
COPY . .
RUN unset GOPATH && GOOS=linux CGO_ENABLED=0 go build -o tomi .

FROM alpine:latest
ARG sourceLocation=/
EXPOSE 8000
WORKDIR ${sourceLocation}
COPY --from=builder ${sourceLocation}/tomi .
COPY --from=builder ${sourceLocation}/frontend ./frontend
CMD [ "./tomi"  ]

```

The base image is golang:1.13.4 where `1.13.4` is the version of golang. ARG sourceLocation is used to set the current working directory. The interesting thing is the command to build the executable of application. I am using `unset GOPATH` in build command because the build fails without having this. Using go modules when GOPATH is set, kind of confuses the go build command and it fails with not so helpful error message. Another interesting thing is `CGO_ENABLED=0` in the build command. Setting CGO_ENABLED TO `0` disables cgo. Otherwise, the container start will fail because when you enable CGO then it needs libc at runtime which is not present on `alpine` image. In my case, I don't need cgo anyway so I disabled it. If you must need cgo then you can change the image, which means that instead of `alpine` you can use another base image which has the `libc`. For example, ubuntu based images have libc in them. 

Finally, I copy the executable file `tomi` in the final image. Also copied the frontend folder which contains all the html, css, js and other statci stuff. So the final image is an alpine image with one binary executable tomi and the static files folder in the same location. 

Value of build argument `sourceLocation` is passed from the docker build command as usual. To build the image, I `cd` to the folder containing Dockerfile. My build context is `/home/fakegandhi/code/tomi/` which is passed in the command. The docker build command is:

```
sudo docker build -t tomi/first --no-cache --build-arg sourceLocation=/ -f Dockerfile /home/fakegandhi/code/tomi/

```

To run the image, I use the same network on which the mongodb container is running because my application expects a mongodb connection. The network `n1` is expected to be already created before running the mongodb container, so we won't create it here again. The command to start the container is:

```
sudo docker run --rm --network n1 -p 8000:8000 tomi/first

```

That is all for this post!!

Thanks for reading.