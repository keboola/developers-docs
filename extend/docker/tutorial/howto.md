---
title: Howto create a dockerized application
permalink: /extend/docker/tutorial/howto/
---

Here we will guide you through basic steps, which are necessary for developing docker images for 
KBC - this is a very limited set of docker features, so you don't really need to know everyting 
about the docker stack.
We don't aim to replace the very nice official tutorials for
[Windows](https://docs.docker.com/windows/step_one/) and [Mac OS X](https://docs.docker.com/mac/) and 
a whole list of other [Tutorials](https://docs.docker.com/mac/).
Before you start, make sure that you have [docker installed](/extend/docker/tutorial/setup/) 

## Creating your own image
To create your own image, you need to create a [Dockerfile](https://docs.docker.com/engine/reference/builder/). 
Dockerfile is a set of shell instructions which lead to configured OS environment. You can think of it as a 
bash shell script with some specifics. Each Dockerfile should be placed in its own directory, beause that directory 
becomes *Build context* of the docker image. Build context contains files which can be injected into the 
Image. There is no other way to inject arbitrary files into the image other then to thru build 
context or download them from the internet.

Useful Dockerfile instructions:
- [`FROM`](https://docs.docker.com/engine/reference/builder/#from) - state the base image to start with
- [`RUN`](https://docs.docker.com/engine/reference/builder/#run) - execute and arbitrary shell command
- [`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) - set the command which 
will be executed when the image is run, this is the command that will actually run inside a container.
 When the command finishes the container finishes too.
- [`ENV`](https://docs.docker.com/engine/reference/builder/#env) - set environment variable, use this instead of `export`
- [`WORKDIR`](https://docs.docker.com/engine/reference/builder/#workdir) - set current working directory
- [`COPY`](https://docs.docker.com/engine/reference/builder/#copy) - copy files from Build context into the image

Note that in dockerfile, each instruction is executed in it's own shell, therefore you *MUST* use instructions
`ENV` and `WORKDIR` to set environment variables and current directory.

### Sample Image
Create an empty directory and it create a Dockerfile with the following contents.

{: .highlight .language-dockerfile}
    FROM quay.io/keboola/base
    ENTRYPOINT ping -c 2 example.com

The `FROM` instruction means that we start with our [base image](https://quay.io/repository/keboola/base)
whin in turn is based on [CentOS](https://hub.docker.com/_/centos/) image. 
Second instruction means that when you run the image, it will ping _example.com_ twice and exit. 
When you run
 
    docker build .
    
you should see an output like this:

    Sending build context to Docker daemon 3.584 kB
    Step 1 : FROM quay.io/keboola/base
    latest: Pulling from keboola/base
    a3ed95caeb02: Already exists
    3286cdf780ef: Already exists
    ecfdc5e942e9: Already exists
    Digest: sha256:cbd64500481e64bff852f8a34ab7fdcd35befb03afabde29adb6cf33643f8e2d
    Status: Downloaded newer image for quay.io/keboola/base:latest
    ---> 4ed770742c49
    Step 2 : ENTRYPOINT ping -c 2 example.com
    ---> Running in 2bb58014055f
    ---> b818507de866
    Removing intermediate container 2bb58014055f
    Successfully built b818507de866

The `b818507de866` is volatile image hash, which is used to refer to the image and can be abreviated to first three 
characters (`b81` in this case).
Additionally, you can name the image by passsing the `--tag` option, e.g. 

    docker build --tag=my-image .

When an image is built, you can then run it image using `docker run -i b81` or 

    docker run -i my-image . 
     
The switch _-i_ is important for receiving interactive output. You should see an output like this:

    docker run -i my-image
    PING example.com (93.184.216.34) 56(84) bytes of data.
    64 bytes from 93.184.216.34: icmp_seq=1 ttl=50 time=121 ms
    64 bytes from 93.184.216.34: icmp_seq=2 ttl=50 time=121 ms

    --- example.com ping statistics ---
    2 packets transmitted, 2 received, 0% packet loss, time 1000ms
    rtt min/avg/max/mdev = 121.615/121.721/121.828/0.364 ms

### Inspecting the image
When building your own image, it is very usefull to be able
to run arbitrary commands in the image, you can do so by overriding the entrypoint using the `--entrypoint` 
option (which means that your application won't execute, you'll have to run it manually). The `-t`
option opens **i**nteractive **t**erminal: 

    `docker run -i -t --entrypoint=/bin/bash my-image`.

The option `--entrypoint` overrides the `ENTRYPOINT` specified in the `Dockerfile`. This ensures that 
bash shell is run instead of your application. You then have to run the command previously defined
entrypoint manually. 

It is also possible to inspect a running container. Assume you have the following `Dockerfile`:

{: .highlight .language-dockerfile}
    FROM quay.io/keboola/base
    ENTRYPOINT ping example.com
 
When you build it using:
    
    docker build --tag=my-image .
    
Then run the image (create a new container and run the image entrypoint in it):

    docker run my-image
    
Open a new command line window and run:

    docker ps
    
This will show you a list of running containers - something like:

    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
    dafd708d0d7e        my-image            "/bin/sh -c 'ping exa"   58 seconds ago      Up 57 seconds                           jolly_rosalind

The important part is *container ID*. You can then run an arbitrary command in the running container with
the following command:

    docker exec *container_id* *command*

E.g.

    docker exec -i -t daf /bin/bash

Will execute **i**nteractive **t**erminal with bash shell in the container *daf* (container ID can 
be shortened to first 3 letters). You can verify that `ping` is still running by: 

    ps -A
    
Which will give you something like:
    
    PID     TTY     TIME        CMD
    1 ?             00:00:01    ping
    25 ?            00:00:00    bash
    41 ?            00:00:00    ps
   

### Installing things
Chances are that your application requires something special. You can install whatever you need
using standard commands. You can create Dockerfile:

{: .highlight .language-dockerfile}
    FROM quay.io/keboola/base
    RUN yum -y install php-cli
    ENTRYPOINT php -r "echo 'Hello world from PHP';"

The `RUN` command will install the specified package `php-cli`. You can build the image with:

    docker build --tag=my-image . 
    
And then run the image (and create a new container):

    docker run -i my-image

Which will give you:
    
    Hello world from PHP


### Loading files into image 
When you need to add files into your image, you do so using the *build context* (which is simply
the directory in which *Dockerfile* is and in which you are building the image). Create a `test.php`
file in the same directory as *Dockerfile* with the following contents: 

{: .highlight .language-php}
    <?php

    echo "Hello world from PHP file";

Then change the Dockerfile to:

{: .highlight .language-dockerfile}
    FROM quay.io/keboola/base
    RUN yum -y install php-cli
    COPY . /home/
    ENTRYPOINT php /home/test.php

The `COPY` command will copy the entire contents of the directory with Dockerfile into the `/home/`
directory inside the image. The `ENTRYPOINT` command then simply executes the file when the image 
is run. When you `docker build` and `docker run` the image, you will receive:

    Hello world from PHP file


## Dockerfile gotchas
- Make absolutely sure that the *Dockerfile* script requires no interaction.
- Each Dockerfile instruction runs in its own shell and there is no state maintained between them. 
This means that e.g. having `RUN export foo=bar` makes no sense. You have to use `ENV` instruction
to create environment variables.
- When you look at [existing dockerfiles](https://github.com/keboola/docker-base-php70/blob/master/Dockerfile), 
you will realize that commands are squashed together 
to a [single instruction](https://github.com/keboola/docker-base-php70/blob/master/Dockerfile#L9). This is 
done because each instruction creates a *layer* and there are a limited number of layers (layers are counted for the base 
images too). However this approache makes debugging more complicated so you better start with having:

    RUN instruction1
    RUN instruction2

and only once you are sure the image builds correctly and you are happy with the result, change this to:

{: .highlight .language-dockerfile}
    RUN instruction1 \
        && instruction2

- When you refer to files on the internet make sure that they are available publicly, so that the image can be 
rebuilt by a docker registry.
- Be careful about storing private things in the image (like credentials or keys), they will remain in 
the image unless you delete them.
- Be sure to delete temporary files, as they bloat the image. That's why we add `yum clean all` everywhere.
- Consult 
the [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/) 
for more detailed information 

The above code is available in a [sample repository](https://github.com/keboola/docs-docker-example-image).
Now that you are able to create dockerized applications, you can get yourself familiar with
[docker registry](/extend/docker/tutorial/automated-build). 
