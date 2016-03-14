---
title: Installation and Running
permalink: /extend/docker/tutorial/setup/
---

To work with docker you need a running [docker machine server](https://docs.docker.com/machine/)
and a [docker engine client](https://docs.docker.com/engine/quickstart/). If you have no server at hand 
with docker machine, you can run everything locally. To install docker machine on Win/Mac 
use [Docker Toolbox](https://www.docker.com/products/docker-toolbox) (this will also install docker client), for 
other systems see the [documentation](https://docs.docker.com/machine/install-machine/). 

Docker Toolbox is actually Oracle VM VirtualBox image containing a Tinycore distribution Linux, 
which is really a tiny OS containing only the docker machine server. Do not get confused about 
the VirtualBox as it really has nothing to do with Docker, it is there just to run the 
docker-machine server. Apart from [some issues with sharing files](#sharing-files)  
you don't need to worry about the VM being there.

## Getting started
If you have a ready docker machine (local or remote) and docker client, you can start playing with docker. 
To test that everything is running correctly you can start with example 
from [documentation](https://docs.docker.com/engine/userguide/containers/dockerizing/).
If you use DockerToolbox, start by running the following commands in 
[Docker Quickstart Terminal](https://docs.docker.com/engine/installation/windows/#using-the-docker-quickstart-terminal)
or on the command line:

    docker run hello-world

or

    docker.io/library/hello-world:latest

If this works, you can use any image published in some docker 
registry e.g. [Docker Hub](https://hub.docker.com/) or [Quay](https://quay.io/).
If the above fails, make sure that your client is set up properly, if you are using Docker Toolbox, the following might help:

- start *Docker Quickstart Terminal*, watch for any errors, particulary certificates and network
- if things work from Quickstart terminal, but not from normal command line, you need to set up 
[environment settings](https://docs.docker.com/engine/installation/windows/#using-docker-from-windows-command-prompt-cmd-exe) 
by running `docker-machine env --shell cmd` which will give you the necessary environment variables. You can then set
[those permanently](http://www.computerhope.com/issues/ch000549.htm). (or keep using the Quickstart Terminal)
- if things work nowhere, you might want to 
[recreate your docker machine](https://docs.docker.com/machine/get-started/) by running
`docker-machine rm default` and `docker-machine create --driver=virtualbox default` 
- If neither helps, uninstall both Docker Toolbox and Oracle VM VirtualBox, reboot, and install 
the latest Docker toolbox version again.


## Generally useful commands

- [`docker run`](https://docs.docker.com/engine/reference/run/) - run an 
image (create a container and run the command in `ENTRYPOINT` section of *Dockerfile*)
- [`docker build`](https://docs.docker.com/engine/reference/commandline/build/) - build 
an image (execute instructions in *Dockerfile* and create a runnable image)
- [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) - pull
a newer version of an image (force update of the cached copy)
- [`docker-machine ls`](https://docs.docker.com/machine/reference/ls/) - this will give 
you list of running docker servers its IP address and state

## Sharing files
Sharing files between the host OS and the container is done using the `--volume` parameter of `docker run` command:

    docker run --volume=/hostPath/:/containerPath/ imageName

Make sure not to use any spaces around `:`. The details of file sharing are dependent on the host OS you're using. 
There is a very 
useful [guide for Rocker image](https://github.com/rocker-org/rocker/wiki/Sharing-files-with-host-machine) which
describes all the sharing options in great detail. 

### Linux
On linux systems, where docker runs natively, there is really not much to think about. The only think, that can bite 
you are file and directory permissions. Keep in mind that files created within the running docker container on
a mounted host volume will be created with the permissions of users of that container (not the host OS).

### Mac OS
With Docker Toolbox you can follow the 
[official example](https://docs.docker.com/engine/installation/mac/#mount-a-volume-on-the-container). 
The basic limitation is the your host path should be in `/Users/` directory.

### Windows
With Docker Toolbox you can take similar aproach to Mac OS, but beware of different path conventions. Because the
docker-machine itself runs in a TinyCore Linux VM, you actually have to use that VM paths as the host OS path. As
with Mac OS, the shared folder is `C:/Users`

Let's assume you have folder `C:/Users/JohnDoe/MyData` which you want to share with docker container. 
Docker toolbox takes care of mapping the entire `C:/Users` folder into the VM in which the docker-machine server
runs. In that VM, the folder is accesible as `/c/Users`. (You can check that by manually running the Oracle 
VM Virtualbox, and starting/showing the `default` virtual machine; check the folder contents with `ls /c/`).

![Oracle VM Virtualbox screenshot](/extend/docker/tutorial/virtualbox.png)

If you want to map the `C:/Users/JohnDoe/MyData` into a `/home/mydata` folder a container, you therefore have to write

    docker run --volume=/c/Users/JohnDoe/MyData/:/home/mydata/ imageName 

Beware that the "host path" is now case sensitive, and has to use forward slashes (because it is not really windows path).
