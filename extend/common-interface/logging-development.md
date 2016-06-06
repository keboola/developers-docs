---
title: Local development
permalink: /extend/common-interface/logging/development/
---

* TOC
{:toc}

When you are developing your application which is using GELF logging, you need the GELF server to listen to messages from your application. You
can either use:

- the fully fledged official Graylog server - see the [installation guide](http://docs.graylog.org/en/2.0/pages/installation.html)
- or [mock server](https://github.com/keboola/docs-example-logging-mock-server), based e.g. on [PHP server](https://github.com/keboola/gelf-server) or [Node JS Server](https://github.com/wavded/graygelf).

## Using Mock Server with Docker Compose
A conveniet way to use the [mock server](https://github.com/keboola/docs-example-logging-mock-server) is using [Docker Compose](https://docs.docker.com/compose/). With
Docker Compose, you can set both your docker image and the log server to run together and
set the networking stuff automatically. Each of our sample repositories mentioned above contains a sample `docker-compose.yml` which you can use
to derive your own. For example the [sample PHP client](https://github.com/keboola/docs-example-logging-php) contains the following
[`docker-compose.yml`](https://github.com/keboola/docs-example-logging-php/blob/master/docker-compose.yml):

{% highlight yaml %}
server:
  image: "quay.io/keboola/docs-example-logging-mock-server:master"
  ports:
    - 12202:12202/tcp
  environment:
    SERVER_TYPE: tcp
client:
  image: "quay.io/keboola/docs-example-logging-php:master"
  links:
    - server:log-server
  environment:
    KBC_LOGGER_ADDR: log-server
    KBC_LOGGER_PORT: 12202
{% endhighlight %}

This instructs docker to create two containers `server` and `client`. The important part is `links: server:log-server` which links
 the `server` container to the `client` container with the DNS name `log-server`. When you run the above setup (the current
 directory should be root of docs-example-logging-php repository) with:

    docker-compose up

 You will obtain an output like this:

    Creating docsexampleloggingphp_server_1
    Creating docsexampleloggingphp_client_1
    Attaching to docsexampleloggingphp_server_1, docsexampleloggingphp_client_1
    server_1  | array(6) {
    server_1  |   ["version"]=>
    server_1  |   string(3) "1.0"
    server_1  |   ["host"]=>
    server_1  |   string(12) "590227a73319"
    server_1  |   ["short_message"]=>
    server_1  |   string(26) "A sample emergency message"
    server_1  |   ["level"]=>
    server_1  |   int(0)
    server_1  |   ["timestamp"]=>
    server_1  |   float(1464443278.9355)
    server_1  |   ["_some"]=>
    server_1  |   array(1) {
    server_1  |     ["structured"]=>
    server_1  |     string(4) "data"
    server_1  |   }
    server_1  | }
    docsexampleloggingphp_client_1 exited with code 0

This will start the GELF mock server, then the client. All the example client does is that it logs *A sample emergency message* to the server
and terminates, which is indicated by the message `docsexampleloggingphp_client_1 exited with code 0`. The GELF mock server
just prints every received message to the standard output, so you can see that it indeed received the messages from the client.
The server will keep running, you can terminate it by pressing CTRL+C.

You can modify the above setup simply by changing the `image` of the `client` in the docker-compose.yml so that your own image is used. Note that the port 12202 is
hardcoded in the mock server and should not be changed in the `docker-compose.yml`.

## Using Mock Server manually
If you want to set things manually, you can start the [mock server](https://github.com/keboola/docs-example-logging-mock-server) by:

    docker run -e SERVER_TYPE=tcp quay.io/keboola/docs-example-logging-mock-server

This will print

    TCP Server listening on port 12202 .

The command (and server will keep running), so then you need to run another command line instance to find the container ID with:

    docker ps

Which will give you:

    CONTAINER ID        IMAGE                                              COMMAND                  CREATED             STATUS              PORTS                  NAMES
    6cc7c2af97cb        quay.io/keboola/docs-example-logging-mock-server   "/bin/sh -c ./start.s"   4 seconds ago       Up 2 seconds        12202/tcp, 12202/udp   drunk_hopper

You then need to find out the IP address of the running container, e.g. by running docker inspect:

    docker inspect --format '{{ .NetworkSettings.IPAddress }}' 6cc

Which will give you e.g:

    172.17.0.2

(Note: use double quotes in the above command when running on Windows)
You can now start yor client using that address as `KBC_LOGGER_ADDR` environment variable together with (`KBC_LOGGER_PORT` set to 12202) e.g.:

    docker run -e KBC_LOGGER_ADDR=172.17.0.3 -e KBC_LOGGER_PORT=12202 quay.io/keboola/docs-example-logging-php:master

You will now see messages printed in the output of your server.
