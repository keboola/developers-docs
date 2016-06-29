---
title: Installation and Running
permalink: /extend/docker/tutorial/setup/
---

* TOC
{:toc}

To work with Docker, you need a running [Docker machine server](https://docs.docker.com/machine/)
and a [Docker engine client](https://docs.docker.com/engine/quickstart/). If you have no server
with Docker machine at hand, run everything locally. To install a Docker machine on Win/Mac, 
use [Docker Toolbox](https://www.docker.com/products/docker-toolbox) (this will also install a Docker client). For 
other systems, see our [documentation](https://docs.docker.com/machine/install-machine/). 

Docker Toolbox is actually an Oracle VM VirtualBox image containing a Tinycore distribution Linux, 
which is a tiny OS containing only the Docker machine server. Do not get confused about 
the VirtualBox as it really has nothing to do with Docker. It is there just to run the 
Docker-machine server. Apart from [some issues with sharing files](#sharing-files),  
do not worry about the VM being there.

## Getting Started
If you have a Docker machine (local or remote) and Docker client ready, it is time to play with Docker. 
To test that everything is running correctly, start with an example 
from our [documentation](https://docs.docker.com/engine/userguide/containers/dockerizing/).
If you use DockerToolbox, run the following commands in 
[Docker Quickstart Terminal](https://docs.docker.com/engine/installation/windows/#using-the-docker-quickstart-terminal)
or on the command line:

    docker run hello-world

or

    docker run docker.io/library/hello-world:latest

If this works, use any image published in any Docker 
registry, e.g. [Docker Hub](https://hub.docker.com/) or [Quay](https://quay.io/).
Note that in some configurations you may need to use `sudo` to run `docker`. 
If the above fails, make sure your client is set up properly. If you are using Docker Toolbox, the following might help:

- Start *Docker Quickstart Terminal*; watch for any errors, particularly certificates and network.
- If things work from Quickstart terminal, but not from the normal command line, set up 
[environment settings](https://docs.docker.com/engine/installation/windows/#using-docker-from-windows-command-prompt-cmd-exe) 
by running `docker-machine env --shell cmd`. It will give you the necessary environment variables. After that, set
[those permanently](http://www.computerhope.com/issues/ch000549.htm), (or keep using the Quickstart Terminal)
- If things work nowhere, you might want to 
[recreate your Docker machine](https://docs.docker.com/machine/get-started/) by running
`docker-machine rm default` and `docker-machine create --driver=virtualbox default`.
- If neither helps, uninstall both Docker Toolbox and Oracle VM VirtualBox. Then reboot, and install 
the latest Docker toolbox version again.


## Generally Useful Commands

- [`docker run`](https://docs.docker.com/engine/reference/run/): Run an 
image (create a container and run the command in `ENTRYPOINT` section of *Dockerfile*).
- [`docker build`](https://docs.docker.com/engine/reference/commandline/build/): Build 
an image (execute instructions in *Dockerfile* and create a runnable image).
- [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/): Pull
a newer version of an image (force update of the cached copy).
- [`docker-machine ls`](https://docs.docker.com/machine/reference/ls/): This will give 
you a list of running docker servers, their IP address and state.

## Sharing Files
Sharing files between the host OS and the container is done using the `--volume` parameter of the `docker run` command:

    docker run --volume=/hostPath/:/containerPath/ imageName

Do not use any spaces around `:`. The details of file sharing are dependent on the host OS you are using. 
There is a very 
useful [guide for Rocker image](https://github.com/rocker-org/rocker/wiki/Sharing-files-with-host-machine) which
describes all the sharing options in great detail. 

### Linux
On Linux systems, where Docker runs natively, there is really not much to think about. The only things that can bite 
you are file and directory permissions. Keep in mind that files created within the running Docker container on
a mounted host volume will be created with the permissions of users of that container (not the host OS).

### Mac OS
With Docker Toolbox, follow the 
[official example](https://docs.docker.com/engine/installation/mac/#mount-a-volume-on-the-container). 
The basic limitation is that your host path should be in the `/Users/` directory.

### Windows
With Docker Toolbox, take an approach similar to Mac OS, but beware of different path conventions. Because the
Docker-machine itself runs in a TinyCore Linux VM, use that VM path as the host OS path. As
with Mac OS, the shared folder is `C:/Users`.

Let's assume you have a folder called `C:/Users/JohnDoe/MyData`, and you want to share it with Docker Container. 
Docker Toolbox takes care of mapping the entire `C:/Users` folder into the VM in which the Docker-machine server
runs. In that VM, the folder is accessible as `/c/Users`. (Check that by manually running the Oracle 
VM Virtualbox, and starting/showing the `default` virtual machine; check the folder contents with `ls /c/`).

{: .image-popup}
![Oracle VM Virtualbox screenshot](/extend/docker/tutorial/virtualbox.png)

If you want to map the `C:/Users/JohnDoe/MyData` into a `/home/mydata` folder of the container, write:

    docker run --volume=/c/Users/JohnDoe/MyData/:/home/mydata/ imageName 

Remember that the "host path" is now case sensitive, and has to use forward slashes (because it is not really a Windows path).
