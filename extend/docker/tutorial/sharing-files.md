---
title: Sharing files
permalink: /extend/docker/tutorial/sharing-files/
---

Sharing files between the host OS and the container is done using the `--volume` parameter of `docker run` command:

    docker run --volume=/hostPath/:/containerPath/ imageName

Make sure not to use any spaces around `:`. The details of file sharing are dependent on the host OS you're using. 
There is a very 
useful [guide for Rocker image](https://github.com/rocker-org/rocker/wiki/Sharing-files-with-host-machine) which
describes all the sharing options in great detail. 

## Linux
On linux systems, where docker runs natively, there is really not much to think about. The only think, that can bite 
you are file and directory permissions. Keep in mind that files created within the running docker container on
a mounted host volume will be created with the permissions of users of that container (not the host OS).

## Mac OS
With Docker Toolbox you can follow the 
[official example](https://docs.docker.com/engine/installation/mac/#mount-a-volume-on-the-container). 
The basic limitation is the your host path should be in `/Users/` directory.

## Windows
With Docker Toolbox you can take similar aproach to Mac OS, but beware of different path conventions. Because the
docker-machine itself runs in a TinyCore Linux VM, you actually have to use that VM paths as the host OS path. As
with Mac OS, the shared folder is `C:/Users`

Let's assume you have folder `C:/Users/JohnDoe/MyData` which you want to share with docker container. 
Docker toolbox takes care of mapping the entire `C:/Users` folder into the VM in which the docker-machine server
runs. In that VM, the folder is accesible as `/c/Users`. (You can check that by manually running the Oracle 
VM Virtualbox, and starting the `default` virtual machine).

![Oracle VM Virtualbox screenshot](/extend/docker/tutorial/virtualbox.png)

If you want to map the `C:/Users/JohnDoe/MyData` into a `/home/mydata` folder a container, you therefore have to write

    docker run --volume=/c/Users/JohnDoe/MyData/:/home/mydata/ imageName 

Beware that the "host path" is now case sensitive, and has to use forwar slashes (because it is not really windows path).








 
