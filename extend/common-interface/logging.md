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
(log levels `info` and `error`). The events are displayed in [Job detail](https://help.keboola.com/management/jobs/).

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
our Docker Runner. **Never rely on the default logger settings!**. When you are developing your application, you need the
[GELF server for development](/extend/common-interface/logging/development/)


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
`UdpTransport` or `HttpTransport` class (AMQP transport is not supported yet). For additional examples on using the library,
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

### Node.js
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
