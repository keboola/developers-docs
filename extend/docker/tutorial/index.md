---
title: About Docker
permalink: /extend/docker/tutorial/
---

* TOC
{:toc}

Docker is a technology stack for running things in virtualized environments. In KBC, we use a limited set of Docker features.
Their description follows. For full technical description of Docker, consult the
[official documentation](https://docs.docker.com/).

## What Is Docker
At first sight, Docker is similar to other virtualization technologies (such as VMware or VirtualBox).
However, there are some [fundamental differences](https://docs.docker.com/engine/understanding-docker/).
The main difference is that Docker runs only virtualized applications, not the entire OS.

Docker has *Docker Images* and *Docker Containers*. To create a Docker Image, create *Dockerfile*. Dockerfile
contains instructions on how the Docker Image should be built, and this represents the environment (OS + modifications) in
which an application runs.
A Docker Image contains everything that is required to run an application. An image usually has an *entrypoint* which is
a single command that is executed when the image is run.

When you run an image (start an application in it), *Docker Container* is created. The container is a sandbox
isolated from the image itself and cannot make permanent changes to it; this is very important (and maybe somewhat
surprising). When you run the Image again (and create a new Container), it won't be affected in any way by the previous
Container. Docker Image is therefore stateless and acts like a template. The state is stored only in the container.


## Docker Images
*Docker Images* are created by executing instructions written in *Dockerfile*. Dockerfile is a simple text
file consisting mostly of shell commands which must be executed to prepare the application for running.
Docker Images can be based on other Images. So if
you need minor modification to a system, you do not have to build the whole thing from scratch. If you want Images to be
reused, *push* your Dockerfile to Docker *Registry*. The Registry ([Dockerhub](https://hub.docker.com/),
[Quay](https://quay.io/)) will build the image; anyone interested in using it can download it. 
[AWS ECR](https://aws.amazon.com/ecr/) is a private repository and has no build triggers, you need to push the images manually or using a deploy script in your CI pipeline.

Docker Images names are based on the following scheme: `registry-name/account-name/image-name:tag` Where _registry-name_
and _acoount-name_ can sometimes be omitted. For example, you can refer to a Docker _hello-world_ image as: `hello-world`
or as `docker.io/library/hello-world:latest`.
Where the `docker.io` refers to the [Docker Hub](https://hub.docker.com/) registry,
the `library` refers to _account_ (common library is default), `hello-world` refers to the _image name_,
and `latest` refers to the _tag_.

Image tags work similarly to Git tags as they refer to a specific build of the image. However, Docker tags can be moved
easily, so they do not need to always refer to the same build. The general convention is that the *latest*
and *master* tags both point to the same (latest) build and are movable. Please note, that some of our
[Keboola images](/extend/docker/images/) do not follow this convention.

## Running Docker Images in KBC
We have wrapped Docker in our [Docker Runner component](/integrate/docker-bundle/). The component
runs [registered](/extend/registration/) Docker Images. Docker Runner
has an [API](http://docs.kebooladocker.apiary.io/#)
which allows to run Docker Images and encrypt arbitrary values.
[Docker Runner](/integrate/docker-bundle/) takes
care of injecting the right data, creating, running, and terminating the container, and uploading
the result data to KBC Storage. All images to be run in KBC must have an `ENTRYPOINT`.
We also recommend that you base your image on [one of our images](/extend/docker/images/).

Before you run Docker applications in KBC, make sure to
[set up your Docker environment](/extend/docker/tutorial/setup/).
Before you develop a dockerized application for KBC, you should be able to
[create and run dockerized applications](/extend/docker/tutorial/howto/) in your own environment.

If you are already familiar with Docker, jump straight into our sample application
code [in PHP](https://github.com/keboola/docker-demo-app).
The demo application itself starts with a single
[`/src/run.php`](https://github.com/keboola/docker-demo-app/blob/master/src/run.php) script.
The application can exist independently (without Docker), and contains unit and functional tests.
The repository includes also the Docker Image definition in
[**Dockerfile**](https://github.com/keboola/docker-demo-app/blob/master/Dockerfile). The Docker environment including the application
is prepared by the Docker Image definition. A hook from Dockerhub builds Docker Image automatically on every commit.
A similar application is also available [in Python](https://github.com/keboola/python-custom-application-text-splitter).


