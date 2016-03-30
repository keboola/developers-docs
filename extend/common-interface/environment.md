---
title: Environment Specification
permalink: /extend/common-interface/environment/
---

* TOC
{:toc}

Extensions (and other dockerized applications) use several [channels](/extend/common-interface/) to exchange information with Keboola Connection,
primarily [structured folders](/extend/common-interface/) and [configuration files](/extend/common-interface/config-file/).

Additional parts of the environment in which your application is executed are specified below:

## Environment Variables

The following environment variables are injected in the container:

 - `KBC_DATADIR`: This is always `/data/` in KBC; you can use this environment variable during application 
 development to create development and testing environments.
 - `KBC_RUNID`: RunId from Storage; couples all events within an API call (use this for logging)
 - `KBC_PROJECTID`: Id of the project in KBC.
 - `KBC_CONFIGID`: Id of the configuration or hash of configuration data if the configuration 
 is not named (`configData` was used in 
 [API call](http://docs.kebooladocker.apiary.io/#reference/run/create-a-job/create-a-run-job)).
 
 The following variables are available only if specifically requested in the [component registration](/extend/registration/) 
 (and approved by us):
 
 - `KBC_PROJECTNAME`: Name of the project in KBC.
 - `KBC_TOKENID`: Id of the token running the container.
 - `KBC_TOKENDESC`: Description (user name or token name) of the token running the container. 
 - `KBC_TOKEN`: The actual token running the container.  

## Return Values

The script defined in Dockerfile [`ENTRYPOINT`](/extend/docker/howto/) should provide an exit status. The
following rules apply:

- `exit code = 0`  The execution is considered successful (when `streaming_logs` is turned off, the contents 
of [STDOUT](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_.28stdout.29) will be sent to 
[Storage API Events](http://docs.keboola.apiary.io/#events) and displayed in [Job detail](https://help.keboola.com/???))
- `exit code = 1`  The execution fails with a *User Exception*;
the contents of both STDOUT and [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29) 
will be sent to a Storage API Events.
- `exit code > 1`  The execution fails with an *Application Exception*  
and the contents of both STDOUT and STDERR will be sent to internal logs.

It is fairly important to distinguish between a *User Exception* and *Application Exception*. In case of 
User Exception, the end-user will see a full error message. Therefore:

- Avoid messages which make no sense at all; for example 'Banana Error: Exceeding trifling witling' or only numeric errors.
- Avoid leaking sensitive information (such as credentials, tokens).
- Avoid errors which the user cannot solve -- for example 'Outdated OpenSSL library, update to OpenSSL 1.0.2'.
- Provide guidance on what the user should do (e.g. 'Input table is missing, make sure the output mapping produces table 'items.csv')

In case of an *Application Exception*, the end-user will see only a canned response ('An application error occurred'), with
the option to contact support. The actual output of the application will be sent to our internal logs only. In case of 
[Docker extensions](/extend/docker/) these can be forwarded to a place you specify in your
[component registration](/extend/registration/). In case of [Custom Science](/extend/custom-science/) these cannot be 
automatically forwarded to you.

## Standard Output and Standard Error

Docker Bundle listens to [STDOUT](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_.28stdout.29) 
and [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29) 
of the application and forwards any content live to [Storage API Events](http://docs.keboola.apiary.io/#events) 
(log levels `info` and `error`). You can turn off live forwarding by setting `streaming_logs` to `false` in the 
[component registration](/extend/registration/). The events are displayed in 
[Job detail](https://help.keboola.com/???).

Make sure your application does not use any output buffering otherwise all 
events will be cached after the application finishes. In R applications, the outputs printed in rapid succession
are sometimes joined into a single event; this is a known behavior of R and it has no workaround.

The events serve to pass only informational, status and warning/error messages. Absolutely no data should be 
passed through events. The amount of data in each event is limited (about 64KB). If live events are turned off, the amount
of complete application output is also limited (about 1MB). If the limit is exceeded, the message will be trimmed. 
 