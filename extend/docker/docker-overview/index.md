---
title: Docker
permalink: /extend/docker/docker-overview/
---

## Docker
Docker is a technology stack for running things in virutalized environments. In KBC we use a limited set of docker features, which are described here. For full technical description of docker, you should consult the [official documentation](https://docs.docker.com/).

### What is docker
At first sight it might seem that docker is similar to other virutualization technologies (such as VMware or VirutalBox) but there are some fundamental differences. The difference is that docker has *Docker images* and *Docker containers*. To create a Docker Image, you must create a *Dockerfile*. Dockerfile contains instructions on how the docker Image should be build and this is the environment (OS + modifications) in which an application runs. When you run an image (start an application in it), a docker Container is created. The Container is isolated from the image itself and cannot make permanent changes to it - this is one of those fundamental differences. When a Container is terminated (usually because it has nothing more to do), its state is deleted. When you run the Image again (and create a new Container), it won't be anyhow affected by the previous Container. Docker is therefore somewhat stateless.

### Docker Images
Docker Images are created by executing instruction writen in Dockerfile. Docker Images can be based on other Images. So if you need minor modification to some system, there is no need to build the whole thing from scratch. If you want Images to be reused, you can push your Dockerfile to docker *Registry*. The Registry ([Dockerhub](https://hub.docker.com/), [Quay](https://quay.io/)) will build the Image, and anyone who wish to use it, can download it. 

Docker images are named with the scheme: `registry-name/account-name/image-name:tag` Where _registry-name_ and _acoount-name_ can sometimes be omitted. The for example you can refer to docker _hello-world_ image as: `hello-world`
or as `docker.io/library/hello-world:latest`
Where the `docker.io` refers to [Docker Hub](https://hub.docker.com/) registry (which is default), the second docker refers to common library (which is default), the third part refers to the image `hello-world` and the fourth part refers to the tag `latest`. Image tags work the same as git tag as they refer to a specific build of the image. However docker tags can be moved easily so they do not need to always refer to the same build. The general convention is that tags *latest* and *master* both point to the same (latest) build. Please note that many of our Keboola images do NOT follow this convention. In keboola, we use [Docker Hub](https://hub.docker.com/) and [Quay](https://quay.io/) registry, in both registries we have the account *Keboola*. So our images are either: `keboola/base` or `keboola/base` Some images are present on both registries and as long as the same tag is used, they refer to exact same build and are freely interchangeable.

## Running docker Images in KBC
We have wrapped docker in our [Docker bundle component](https://github.com/keboola/docker-bundle). The component runs [registred](/extend/registration) docker images. The Docker Bundle component has [API](https://app.apiary.io/kebooladocker/editor) which basically allows to run the docker images. The Docker bundle component takes care of injecting the right data, creating and runing the container, terminating the container and uploading the result data to KBC Storage. 






