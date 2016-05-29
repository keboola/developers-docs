---
title: Logging Specification
permalink: /extend/common-interface/logging/
---

* TOC
{:toc}

There are two main options how your application can display events to KBC end-user:

- using [standard output](https://en.wikipedia.org/wiki/Standard_streams) and standard error
- using [Graylog GELF](http://docs.graylog.org/en/2.0/pages/gelf.html) compatible logger

These two options are mutualy exclusive. Using the standard output option requires no extra work from you or your
application. You simply print all informational messages to standard output and all error messsages to standard error.
These will be forwared to Storage Events as informational or error messages. This is the simplest approach and also
a recommended approach for [Custom Science](/extend/custom-science/) extensions.
Using a [GELF](http://docs.graylog.org/en/2.0/pages/gelf.html) compatible logger requires that you implement or include
such logger in your application, but it offers much greater flexibility - you can send different kinds of messages (such
as error, informational, warning, debug) and these messages can contain additional structured information (not only a plain text string).

## Standard Output and Standard Error
By default the Docker Bundle listens to [STDOUT](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_.28stdout.29)
and [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29)
of the application and forwards any content live to [Storage API Events](http://docs.keboola.apiary.io/#events)
(log levels `info` and `error`). You can turn off live forwarding by setting `streaming_logs` to `false` in the
[component registration](/extend/registration/). The events are displayed in
[Job detail](https://help.keboola.com/management/jobs/).

Make sure your application does not use any output buffering otherwise all
events will be cached after the application finishes. In R applications, the outputs printed in rapid succession
are sometimes joined into a single event; this is a known behavior of R and it has no workaround.

The events serve to pass only informational and error messages. Absolutely no data should be
passed through events. The amount of data in each event is limited (about 64KB). If live events are turned off, the amount
of complete application output is also limited (about 1MB). If the limit is exceeded, the message will be trimmed.

## Gelf Logger
[GELF](http://docs.graylog.org/en/2.0/pages/gelf.html) is log format which allows to
send [structured](http://docs.graylog.org/en/2.0/pages/gelf.html#gelf-format-specification) event messages. When you turn on
GELF logging in [component registration](/extend/registration/), our [Docker Runner](/overview/docker-bundle/) will listen
for messages on the **transport** you specify ([UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol),
[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol),
[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)). Additionally you can specify how each level of
message is handled (silenced or displayed).

### Setting up
When you enable GELF logger in component registration, you also need to choose the log **transport** it uses. The supported
transports are UDP, TCP and HTTP. We suggest using TCP as it offers a nice compromise betwen transport overhead and
reliability, but the final choice is up to you. If you choose UDP as transport, you should make sure that there is a little delay
between your application start and the first message sent (about 1s) to give the network sockets some time to intialize.

Additionally, you can set visibility of each event message:

- `none` - Message is ignored enitrely.
- `camouflage` - A generic error message is shown to the end-user instead of the real message content, full message is logged internally.
- `normal` - Event message (GELF `short_message` field) is shown to the end-user, full message is logged internally.
- `verbose` - Full message is shown to the user including GELF additional fields

Default settings for message visibilities are the following:

[KBC Level](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md#5-psrlogloglevel) | Gelf Log Method | [Syslog Level](https://en.wikipedia.org/wiki/Syslog#Severity_level) | Default KBC Verbosity
100 | `debug()` | 7 | none
200 | `info()`  | 6 | normal
250 | `notice()` | 5 | normal
300 | `warning()` | 4 | normal
400 | `error()` | 3 | normal
500 | `critical()` | 2 | camouflage
550 | `alert()` | 1 | camouflage
600 | `emergency()` | 0 | camouflage

## Examples
Since GELF is sort of standard format for structured logs, there is a [number of libraries](https://marketplace.graylog.org/addons?kind=gelf)
available for client implementation. The following examples show how to use GELF logger in some common languages.
You must always use environment variables `KBC_LOGGER_ADDR` and `KBC_LOGGER_PORT` in your client, which will be injected into your component by
our Docker Runner. **Never rely on the default logger settings!**.

### PHP
For PHP, you can use the official [GELF client](https://github.com/bzikarsky/gelf-php) library. To install it, use

    composer require graylog2/gelf-php

You can then test the logging with a simple script:

{% highlight php %}
<?php

require("vendor/autoload.php");

$transport = new Gelf\Transport\TcpTransport(getenv('KBC_LOGGER_ADDR'), getenv('KBC_LOGGER_PORT'));
$logger = new \Gelf\Logger($transport);

$logger->emergency("A sample emergency message", ["some" => ["structured" => "data"]]);
{% endhighlight %}

You can see a complete component in
a [sample repository](https://github.com/keboola/docs-example-logging-php). To use other transports, you can use
`UdpTransport` or `HttpTransport` class (AMQP transport is not supported yes). For additional examples on using the library,
see its [official documentation](https://github.com/bzikarsky/gelf-php).

### Python
For Python, there are [a number of libraries](https://marketplace.graylog.org/addons?kind=gelf&tag=python). You can use for
example [pygelf library](https://github.com/keeprocking/pygelf). To install it, use:

    pip install pygelf

You can then test the logging with a simple script:

{% highlight python %}
from pygelf import GelfTcpHandler
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()
fields = {"_some": {"structured": "data"}}
logger.addHandler(GelfTcpHandler(host=os.getenv('KBC_LOGGER_ADDR'), port=os.getenv('KBC_LOGGER_PORT'), debug=False, **fields))
logging.critical('A sample emergency message')
{% endhighlight %}

Due to the nature of python logging, only [some error levels](https://docs.python.org/2/library/logging.html#logging-levels) are
permitted.

### Javascript
There are a number of libraries available for [NodeJS](https://marketplace.graylog.org/addons?kind=gelf&tag=nodejs). You can
use for example the [GrayGelf library](https://github.com/wavded/graygelf).

    npm install graygelf

You can then test the logging with a simple script:

{% highlight js %}
var log = require('graygelf')({
  host: process.env.KBC_LOGGER_ADDR,
  port: process.env.KBC_LOGGER_PORT
})

log.info('hello', 'world')
log.info.a('short', 'full', { foo: 'bar' })
{% endhighlight %}

Note that the library supports only UDP transport.

## Local development
When you are developing your application, you need the GELF server to listen to messages from your application. You
can either use:

- the fully fledged official Graylog server - see the [installation guide](http://docs.graylog.org/en/2.0/pages/installation.html)
- or [mock server](https://github.com/keboola/docs-example-logging-mock-server), based e.g. on [PHP server](https://github.com/keboola/gelf-server) or [Node JS Server](https://github.com/wavded/graygelf).

### Using Mock Server with Docker Compose
A conveniet way to use the [mock server](https://github.com/keboola/docs-example-logging-mock-server) is using [Docker Compose](https://docs.docker.com/compose/). With
Docker Compose, you can set both your docker image and the log server to run altogether and
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

### Using Mock Server manually
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

(Note: use double quotes in the above command when running on windows)
You can now start yor client using that address as `KBC_LOGGER_ADDR` environment variable together with (`KBC_LOGGER_PORT` set to 12202) e.g.:

    docker run -e KBC_LOGGER_ADDR=172.17.0.3 -e KBC_LOGGER_PORT=12202 quay.io/keboola/docs-example-logging-php:master

You will now see messages printed in the output of your server.
