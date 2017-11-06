---
title: How to Create Dockerized Application
permalink: /extend/docker/tutorial/howto/
---

* TOC
{:toc}

The following are the basic steps for developing KBC Docker Images. There is no need to know everything about the Docker stack since this is a very limited set of Docker features.
The official [Tutorial](https://docs.docker.com/get-started/) is not being replaced here.
Before you start, make sure you have [Docker installed](/extend/docker/tutorial/setup/).

The code discussed below is available in our [sample repository](https://github.com/keboola/docs-docker-example-image).

## Creating Your Own Image
To create your own image, create a [Dockerfile](https://docs.docker.com/engine/reference/builder/).
Dockerfile is a set of shell instructions leading to a configured OS environment. You can think of it as a
bash shell script with some specifics. Each Dockerfile should be placed in its own folder because the folder
becomes *Build Context* of the Docker image. Build context contains files which can be injected into the
Image. There is no other way to inject arbitrary files into the image other than through the build
context or download them from the Internet.

Useful Dockerfile instructions:

- [`FROM`](https://docs.docker.com/engine/reference/builder/#from): State the base image to start with.
- [`RUN`](https://docs.docker.com/engine/reference/builder/#run): Execute an arbitrary shell command.
- [`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint): Set the command which
will be executed when the image is run; this is the command that will actually run inside a container.
When the command finishes, the container finishes too.
- [`ENV`](https://docs.docker.com/engine/reference/builder/#env): Set an environment variable, use this instead of `export`.
- [`WORKDIR`](https://docs.docker.com/engine/reference/builder/#workdir): Set the current working folder.
- [`COPY`](https://docs.docker.com/engine/reference/builder/#copy): Copy files from Build context into the image.

Note that in Dockerfile, each instruction is executed in its own shell. Therefore, the
`ENV` and `WORKDIR` instructions *MUST* be used to set environment variables and the current folder.

### Sample Image
Create an empty folder, and then create a Dockerfile with the following contents inside the folder.

{% highlight dockerfile %}
FROM alpine
ENTRYPOINT ping -c 2 example.com
{% endhighlight %}

The `FROM` instruction means we start with the [Alpine Linux image](https://hub.docker.com/_/alpine/).
The second instruction means that when you run the image, it will ping _example.com_ twice and exit.
When you run

    docker build .

you should see an output like this:

    Sending build context to Docker daemon  2.048kB
    Step 1/2 : FROM alpine
    ---> 37eec16f1872
    Step 2/2 : ENTRYPOINT ping -c 2 example.com
    ---> Running in 8339a4e2e1c2
    ---> ad16195c696d
    Removing intermediate container 8339a4e2e1c2
    Successfully built ad16195c696d

The `ad16195c696d` is a volatile image hash which is used to refer to the image and can be abbreviated to first three
characters (`ad1` in this case).
Additionally, you can name the image by passing the `--tag` option, e.g.

    docker build --tag=my-image .

After an image has been built, run it using `docker run ad1` or

    docker run my-image .

You should see an output like this:

    docker run my-image .
    PING example.com (93.184.216.34): 56 data bytes
    64 bytes from 93.184.216.34: seq=0 ttl=37 time=137.057 ms
    64 bytes from 93.184.216.34: seq=1 ttl=37 time=145.279 ms

    --- example.com ping statistics ---
    2 packets transmitted, 2 packets received, 0% packet loss
    round-trip min/avg/max = 137.057/141.168/145.279 ms

### Inspecting the Image
When building your own image, the ability to run arbitrary commands in the image is very useful. Override the entrypoint using the `--entrypoint`
option (which means that your application will not execute, and you will have to run it manually). The `-i` and `-t`
options opens **i**nteractive **t**erminal:

    docker run -i -t --entrypoint=/bin/sh my-image

The option `--entrypoint` overrides the `ENTRYPOINT` specified in the `Dockerfile`. This ensures that a
sh shell is run instead of your application. You then have to run the `ping` command, previously defined in the entrypoint, manually.

It is also possible to inspect a running container. Assume you have the following `Dockerfile`:

{% highlight dockerfile %}
FROM alpine
ENTRYPOINT ping example.com
{% endhighlight %}

When you build it using:

    docker build --tag=my-image .

Then run the image (create a new container and run the image entrypoint in it):

    docker run my-image

Open a new command line window and run:

    docker ps

This will show you a list of running containers - something like:

    CONTAINER ID  IMAGE     COMMAND                  CREATED          STATUS         NAMES
    f7def769a470  my-image  "/bin/sh -c 'ping ..."   16 seconds ago   Up 13 seconds  sharp_ptolemy

The important part is the *container ID*. You can then run an arbitrary command in the running container with
the following command:

    docker exec *container_id* *command*

For example:

    docker exec -i -t f7d /bin/sh

will execute **i**nteractive **t**erminal with the shell in the container *daf* (container ID can
be shortened to first 3 letters). Verify that `ping` is still running by:

    ps -A

which will give you something like:

    PID  USER   TIME   COMMAND
    1    root   0:00   /bin/sh -c ping example.com .
    5    root   0:00   ping example.com
    11   root   0:00   /bin/sh
    15   root   0:00   /bin/sh
    19   root   0:00   ps -A

### Installing Things
Chances are that your application requires something special. You can install whatever you need
using standard commands. You can create Dockerfile:

{% highlight dockerfile %}
FROM debian
RUN apt-get update
RUN apt-get install -y php-cli
ENTRYPOINT php -r "echo 'Hello world from PHP';"
{% endhighlight %}

The `RUN` commands will install the specified `php-cli` package. Build the image with:

    docker build --tag=my-image .

and then run the image (and create a new container):

    docker run my-image

You should see the following output:

    Hello world from PHP


### Loading Files into Image
When you need to add files into your image, use the *build context* (which is simply
the folder in which the *Dockerfile* is and in which you are building the image). Create a `test.php`
file in the same folder as the *Dockerfile* with the following contents:

{% highlight php %}
<?php

echo "Hello world from PHP file";
{% endhighlight %}

Then change the Dockerfile to:

{% highlight dockerfile %}
FROM debian
RUN apt-get update
RUN apt-get install -y php-cli
ENTRYPOINT php -r "echo 'Hello world from PHP';"
COPY . /code/
ENTRYPOINT php /code/test.php
{% endhighlight %}

The `COPY` command copies the entire contents of the folder with Dockerfile into the `/code/`
folder inside the image. The `ENTRYPOINT` command then simply executes the file when the image
is run. When you `docker build` and `docker run` the image, you will receive:

    Hello world from PHP file

## Dockerfile Gotchas
- Make absolutely sure that the *Dockerfile* script requires no interaction.
- Each Dockerfile instruction runs in its own shell and there is no state maintained between them.
This means that, for instance, having `RUN export foo=bar` makes no sense. Use `ENV foo=bar` instruction
to create environment variables.
- When you look at the [existing Dockerfiles](https://github.com/keboola/docker-custom-python/blob/master/Dockerfile),
you will realize that commands are squashed together
to a [single instruction](https://github.com/keboola/docker-custom-python/blob/master/Dockerfile#L6). This is
because each instruction creates a *layer* and there is a limited number of layers (layers are counted for the base
images too). However, this approach makes debugging more complicated. So, you better start with having

{% highlight dockerfile %}
RUN instruction1
RUN instruction2
{% endhighlight %}

and only once you are sure the image builds correctly and you are happy with the result, change this to:

{% highlight dockerfile %}
RUN instruction1 \
    && instruction2
{% endhighlight %}

- When you refer to files on the Internet, make sure they are available publicly, so that the image can be
rebuilt by a Docker registry.
- Be careful about storing private things in the image (like credentials or keys); they will remain in
the image unless you delete them.
- Be sure to delete temporary files, as they bloat the image. That's why we add `rm -rf /var/lib/apt/lists/*` everywhere.
- Consult
the [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)
for more detailed information.

Now that you are able to create dockerized applications, get yourself familiar with the
[Docker registry](/extend/docker/tutorial/registry/).
