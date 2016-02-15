## Working with docker
To work with docker you need a running docker machine and a docker client. If you have no server at hand with docker machine, you can run it locally. To install docker machine on Win/Mac use [Docker Toolbox](https://www.docker.com/products/docker-toolbox), for other systems see the [documentation](https://docs.docker.com/machine/install-machine/). Docker Toolbox is a Oracle VM virtualbox containing a Tinycore distribution Linux, which is really a tiny OS containing only the docker machine server. Do not get confused about the Virtualbox as it really has nothing to do with Docker, it is there just to run the docker-machine. If you [set things up](?dopsat dolu) correctly, the client runs native and you don't need to worry about the VM being there.

## Getting started
If you have a ready docker machine (local or remote) and docker client, you can start playing with docker. To test that everything is running correctly you can example from [documentation](https://docs.docker.com/engine/userguide/containers/dockerizing/)

```
docker run hello-world
```

or

```
docker.io/library/hello-world:latest
```

If this works, you can use any image published in some docker registry e.g. [Docker Hub](https://hub.docker.com/) or [Quay](https://quay.io/).

### Useful commands
- `docker run` - run an image (create a container and run the command in `ENTRYPOINT` section of dockerfile)
- `docker build` - build in image (execute instructions in Dockerfile and create a runnable image)
- `docker-machine ls` - if you run your docker server localy, this will give you its IP address and state

### Creating your own image
To create your own image, you need to create a [Dockerfile](https://docs.docker.com/engine/reference/builder/). Dockerfile is a set of shell instructions which lead to configured OS environment. You can think of it as a bash shell script with some specifics. Each Dockerfile should be placed in its own directory, beaause that directory becomes Build context of the docker image. Build context contains files which can be injected into the Image. There is no other way to inject arbitrary files into the image other then to thru build context or download them from the internet.

Useful Dockerfile instructions:
- [`FROM`](https://docs.docker.com/engine/reference/builder/#from) - state the base image to start with
- [`RUN`](https://docs.docker.com/engine/reference/builder/#run) - execute and arbitrary shell command
- [`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) - set the command which will be executed when the image is run, this is the command that will actually run inside a container. When the command finishes the container finishes too.
- [`ENV`](https://docs.docker.com/engine/reference/builder/#env) - set environment variable, use this instead of `export`
- [`COPY`](https://docs.docker.com/engine/reference/builder/#copy) - copy files from Build context into the image

### Sample Image
Create an empty directory and it create a Dockerfile with the following contents.

```
FROM centos
ENTRYPOINT ping -c 2 example.com
```

The `FROM` instruction means that we start with base [centos](https://hub.docker.com/_/centos/) image. Second instruction means that when you run the image, it will ping _example.com_ twice and exit. When you run `docker build .` you should see an output like this:

```
Sending build context to Docker daemon 2.048 kB
Step 1 : FROM centos
 ---> 61b442687d68
Step 2 : ENTRYPOINT ping -c 2 example.com
 ---> Running in d05f349a8774
 ---> 183b626b8ac6
Removing intermediate container d05f349a8774
Successfully built 183b626b8ac6
```

You can then run the image using `docker run -i 183`. The switch _-i_ is important for receiving interactive output.

Second instruction will install the _iputils_ packages. The switch _-y_ is very important because the build process has to run non-interactively. When building your own image, it is very usefull to be able to run arbitrary commands in the image, you can do so by overriding the entrypoint using
`docker run -i -t --entrypoint=/bin/bash 183`. This will give you a shell inside the image where you can run arbitrary commands. Don't forget though that whatever you do will be lost once you exit (aka terminate) the container.


Dockerfile gotchas:
- Make absolutely sure that the script requires no interaction.
- Each Dockerfile instruction runs in its own shell and there is no state maintained between them. This means that having `RUN export foo=bar` makes no sense. You have to use `ENV` instruction to create environment variables.
- When you look at [existing dockerfiles](https://github.com/keboola/docker-base-python/blob/master/Dockerfile), you will realize that commands are squashed together to a [single instruction](https://github.com/keboola/docker-base-python/blob/master/Dockerfile#L30). This is done because each instruction creates a *layer* and there are a limited number of layers (layers are counted for the base images too). However this approache makes debugging more complicated so you better start with having:
```
RUN instruction1
RUN instruction2
```
and only once you are sure the image builds correctly and you are happy with the result, change this to:
```
RUN instruction1 \
	&& instruction2
```
- When you refer to files on the internet make sure that they are available publicly, so that the image can be rebuilt by a docker registry.
- Be careful about storing private things in the image (like credentials or keys), they will remain in the image unless you delete them.
- Be sure to delete temporary files, as they bloat the image.


## Setting up shared folders
TODO
