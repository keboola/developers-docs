---
title: Installation and Running
permalink: /extend/docker/tutorial/setup/
---

* TOC
{:toc}

To work with Docker, you need to have it installed. If you have a computer with a Docker machine at hand, you can obtain a
cheap [hosted server](https://www.digitalocean.com/features/one-click-apps/docker/) or
run everything locally. To install a Docker machine on Win/Mac,
use [Docker Community Edition](https://store.docker.com/search?type=edition&offering=community). For
other systems, see the [documentation](https://docs.docker.com/engine/installation/).

## Getting Started
To test that everything is running correctly, start with an example
from the Docker [documentation](https://docs.docker.com/get-started/).
Run the following commands on the command line:

    docker run hello-world
,
or

    docker run docker.io/library/hello-world:latest

If this works, use any image published in any Docker
registry, e.g. [Docker Hub](https://hub.docker.com/), [Quay](https://quay.io/) or [AWS ECR](https://aws.amazon.com/ecr/).
Note that in some configurations, you may need to use `sudo` to run `docker`. If you run into problems, consult the
official troubleshooting ([Windows](https://docs.docker.com/docker-for-windows/troubleshoot/), [Mac](https://docs.docker.com/docker-for-mac/troubleshoot/)).

## Generally Useful Commands
- [`docker run`](https://docs.docker.com/engine/reference/run/): Run an
image (create a container and run the command in `ENTRYPOINT` section of **Dockerfile**).
- [`docker build`](https://docs.docker.com/engine/reference/commandline/build/): Build
an image (execute instructions in **Dockerfile** and create a runnable image).
- [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/): Pull
a newer version of an image (force update of the cached copy).

## Sharing Files
Sharing files between the host OS and the container is done using the `--volume` parameter of the `docker run` command:

    docker run --volume=/hostPath/:/containerPath/ imageName

Do not use any spaces around `:`. The details of file sharing are somewhat
[dependent on the host OS](https://docs.docker.com/engine/admin/volumes/volumes/#start-a-container-with-a-volume) you are using.
There is a very
useful [guide for Rocker image](https://github.com/rocker-org/rocker/wiki/Sharing-files-with-host-machine), which
describes all the sharing options in great detail.

On Linux systems, where Docker runs natively, there is really not much to think about. The only things that can bite
you are file and directory permissions. Keep in mind that files created within the running Docker container on
a mounted host volume will be created with the permissions of users of that container (not the host OS).

On Mac OS, follow the [official example](https://docs.docker.com/docker-for-mac/osxfs/).
The limitation is that your host path must be in a shared directory (e.g., `/Users/`).

On Windows, follow the [official example](https://docs.docker.com/docker-for-windows/#shared-drives).
The limitation is that you must use absolute paths with `docker run`.
