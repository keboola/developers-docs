---
title: About docker
permalink: /extend/docker/tutorial/
---


Docker is a technology stack for running things in virutalized environments. In KBC we use a limited set of docker features,
which are described here. For full technical description of docker, you should consult the 
[official documentation](https://docs.docker.com/).

## What is docker
At first sight it might seem that docker is similar to other virutualization technologies (such as VMware or VirutalBox) but
there are some [fundamental differences](https://docs.docker.com/engine/understanding-docker/). 
The main difference is that docker runs only virtualized applications, not the entire
OS.

Docker has *Docker images* and *Docker containers*. To create a Docker Image, you must create a *Dockerfile*. Dockerfile
contains instructions on how the docker Image should be build and this represents the environment (OS + modifications) in 
which an application runs. 
A Docker image contains everything what is required to run an application. An image usually has *entrypoint* which is 
a single command that is executed when the image is run.

When you run an image (start an application in it), a *Docker Container* is created. The Container
is isolated from the image itself and cannot make permanent changes to it - this is very important (and maybe somewhat
surprising). When you run the Image again (and create a new Container), it won't be anyhow affected by the previous 
Container. Docker image is therefore stateless and acts like a template, the state is stored only in the container.


## Docker Images
*Docker Images* are created by executing instruction writen in *Dockerfile*. Dockerfile is a simple text
file consisting mostly of shell commands which must execute in order to prepare the application for running.
 Docker Images can be based on other Images. So if
you need minor modification to some system, there is no need to build the whole thing from scratch. If you want Images to be
reused, you can *push* your Dockerfile to docker *Registry*. The Registry ([Dockerhub](https://hub.docker.com/), 
[Quay](https://quay.io/)) will build the Image, and anyone who wish to use it, can download it. 

Docker images are named with the scheme: `registry-name/account-name/image-name:tag` Where _registry-name_ 
and _acoount-name_ can sometimes be omitted. For example you can refer to docker _hello-world_ image as: `hello-world`
or as `docker.io/library/hello-world:latest`
Where the `docker.io` refers to [Docker Hub](https://hub.docker.com/) registry, 
the `library` refers to _account_ (common library is default), the third part refers to the _image name_ `hello-world` 
and the fourth part refers to the _tag_ `latest`. 

Image tags work similar as Git tags as they refer to a specific build of the image. However docker tags can be moved 
easily so they do not need to always refer to the same build. The general convention is that tags *latest* 
and *master* both point to the same (latest) build and are movable. Please note that some of our 
[Keboola images](/extend/docker/images/) do not follow this convention. 

## Running docker Images in KBC
We have wrapped docker in our [Docker bundle component](/overview/docker-bundle/). The component 
runs [registred](/extend/registration/) docker images. The Docker Bundle component 
has [API](https://app.apiary.io/kebooladocker/editor) 
which basically allows to run the docker images and encrypt arbitrary values. The 
[Docker bundle component](/overview/docker-bundle/) takes 
care of injecting the right data, creating and runing the container, terminating the container and uploading 
the result data to KBC Storage. All images which are supposed to be run in KBC must have an `ENTRYPOINT`. 
We also recommned that you base your image on [one of our images](/extend/docker/images/).

Before you attempt to run docker applications in KBC, make sure to 
[setup your docker environment](/extend/docker/tutorial/setup).
Before you develop dockerized appliction for KBC, you should be able to 
[create and run dockerized applications](/extend/docker/tutorial/howto/) in your environment.

If you are already familiar with docker, you can jump straight into example application 
application code [in PHP](https://github.com/keboola/docker-demo-app).
The demo application itself is started by a single script 
[`/src/run.php`](https://github.com/keboola/docker-demo-app/blob/master/src/run.php). 
The application can exist independently (without Docker), contains unit and functional tests.
The repository contains also the Docker image definition in 
[**Dockerfile**](https://github.com/keboola/docker-demo-app/blob/master/Dockerfile). Docker image definition prepares the 
docker environment including the application. A hook from Dockerhub builds the docker image automatically on every commit.  
A similar application is also available [in Python](https://github.com/keboola/python-custom-application-text-splitter).


