---
title: About Docker
permalink: /extend/component/docker-tutorial/
redirect_from:
    - /extend/docker/tutorial/
---

* TOC
{:toc}

Docker is a technology stack for running things in virtualized environments. In Keboola, we use a limited set of Docker features.
Their description follows. For a full technical description of Docker, consult its
[official documentation](https://docs.docker.com/).

## What Docker Is
At first sight, Docker is similar to other virtualization technologies (such as VMware or VirtualBox).
However, there are some [fundamental differences](https://docs.docker.com/engine/understanding-docker/),
the main one being that Docker runs only virtualized applications, not the entire OS.

Docker has **Docker Images** and **Docker Containers**. To create a Docker image, create a **Dockerfile**.
Dockerfiles contain instructions on how the Docker image should be built, and this represents the environment
(OS + modifications) in which an application runs.

A Docker image contains everything required to run an application. It usually has an **entrypoint**, which is
a single command executed when the image is run.

When you run an image (start an application in it), a **Docker container** is created. The container is a sandbox
isolated from the image itself and cannot make permanent changes to it. Maybe somewhat surprising, this is very important.
When you run the image again (and create a new container), it won't be affected in any way by the previous
container. The Docker image is therefore stateless and acts as a template. The state is stored only in the container.

## Docker Images
Docker Images are created by executing the instructions written in a **Dockerfile**. It is a simple text
file consisting mostly of shell commands which must be executed to prepare the application for running.
Docker images can be based on other images. So if
you need minor modification to a system, you do not have to build the whole thing from scratch. If you want Images to be
reused, *push* your Dockerfile to a **Docker registry**. The registries ([Dockerhub](https://hub.docker.com/),
[Quay](https://quay.io/)) will build the image; anyone interested in using it can download it.
[AWS ECR](https://aws.amazon.com/ecr/) is a private repository and has no build triggers. You need to push the images manually or
using a [deploy script](/extend/component/deployment/) in your CI pipeline.

Docker image names are based on the following scheme: `registry-name/account-name/image-name:tag` where _registry-name_
and _account-name_ can sometimes be omitted. For example, you can refer to a Docker _hello-world_ image as: `hello-world`
or as `docker.io/library/hello-world:latest`
where the `docker.io` refers to the [Docker Hub](https://hub.docker.com/) registry,
the `library` refers to _account_ (common library is default), `hello-world` refers to the _image name_,
and `latest` refers to the _tag_.

Image tags work similarly to Git tags as they refer to a specific build of the image. However, Docker tags can be moved
easily, so they do not always need to refer to the same build. The general convention is that the *latest*
tag points to the same (latest) build and is movable.

## Running Docker Images in Keboola
We have wrapped Docker in our [Docker Runner component](/extend/docker-runner/). The component
runs [components](/extend/component/) Docker images. Docker Runner
has an [API](/extend/docker-runner/#api)
which allows to run Docker Images and encrypt arbitrary values.
[Docker Runner](/extend/docker-runner/) takes
care of injecting the right data, creating, running, and terminating the container, and uploading
the result data to Keboola Storage. All images to be run in Keboola must have an `ENTRYPOINT` or `CMD`.

Before you run components in Keboola, make sure to
[set up your Docker environment](/extend/component/docker-tutorial/setup/).
Before you develop a dockerized component for Keboola, you should be able to
[create and run dockerized applications](/extend/component/docker-tutorial/howto/) in your own environment.

If you are already familiar with Docker, jump straight into [component development tutorial](/extend/component/tutorial/)
or explore our sample component code [in PHP](https://github.com/keboola/docker-demo-app).
The demo component itself starts with a single
[`/src/run.php`](https://github.com/keboola/docker-demo-app/blob/master/run.php) script,
can exist independently (without Docker), and contains unit and functional tests.
The repository includes also the Docker image definition in the
[**Dockerfile**](https://github.com/keboola/docker-demo-app/blob/master/Dockerfile). The Docker environment including the component
is prepared by the Docker image definition. The [Travis CI](https://docs.travis-ci.com/) service is used to builds Docker image automatically on every commit and
[deploy it to Keboola](/extend/component/deployment/) and public registries.
A similar component is also available [in Python](https://github.com/keboola/python-custom-application-text-splitter).
