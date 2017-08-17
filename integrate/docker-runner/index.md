---
title: Docker Runner
permalink: /integrate/docker-runner/
redirect_from:
    - /integrate/docker-bundle/
---

* TOC
{:toc}

Docker Runner is a [KBC component](/overview/) which provides an interface for
running other KBC components. Every component in Keboola Connection is represented by a [Docker images](/extend/docker/tutorial/) in Keboola Connection.

By developing functionality in [Docker](https://www.docker.com/) you will focus only on the application logic; all communication
with Storage API will be handled by Docker Runner. You can encapsulate any application into an Docker image
following a set of rules that will allow you to integrate the application into Keboola Connection.

There is a [predefined interface](/extend/common-interface/) with Docker Runner consisting of a
[folder structure](/extend/common-interface/) and a [serialized configuration file](/extend/common-interface/config-file/).
[Custom Science](/extend/custom-science/), [Docker Extensions](/extend/docker/) and also
R and Python Transformations are all dockerized applications and are run using Docker Runner.

## Workflow

The Docker Runner functionality can be described in a few simple steps:

- Download and build the specified Docker image
- Download all tables and files specified in the input mapping from Storage
- Create a configuration file (i.e. config.json)
- Run the Docker image (create a Docker container)
- Upload all tables and files in the output mapping to Storage
- Delete the container and all temporary files

When the application execution is finished, Docker Runner automatically collects the exit code and the content of STDOUT and STDERR.

### Features

The application is responsible for:

- Reading the configuration and source tables in CSV format and files (if specified).
- Writing the results to the predefined folders and files.
- Proper handling of success/error results by setting an appropriate exit code.

Docker Runner is responsible for:

- Authentication: Docker Runner makes sure the application is run by authorized users/tokens.
It is not possible to run an extension anonymously. The extension does not have an access to the KBC token
itself, and it receives only limited information about the project and end-user.
- Starting and stopping the extension: Docker Runner will boot a Docker container which contains the
extension. This ensures the extensions run in a precisely defined environment which is guaranteed to
be the same for each extension run (no application state is preserved).
- Reading and writing data to KBC Storage: Docker Runner ensures a custom extension
cannot access arbitrary data in the project. It will only receive the input mapping defined by the end-user;
and only those outputs defined in the output mapping by the end-user will be written to the project.
- Application isolation: Each extension is run in its own Docker container which is isolated from other
containers; the application cannot be affected by other running applications. It may also be limited
to have no network access.

For [Custom Science](/extend/custom-science/), Docker Runner also creates the Docker image from the
specified git repository on the fly.

## API

The Docker Runner API is described on [Apiary.io](http://docs.kebooladocker.apiary.io/). Docker Runner
has API calls to

- run a [docker extension](/extend/docker/)
- [encrypt values](/overview/encryption/)
- [creating sandbox](/extend/common-interface/sandbox/)
- run [component actions](/extend/common-interface/actions/)
- run a [docker extension](/extend/docker/) with a [specified docker image tag](http://docs.kebooladocker.apiary.io/#reference/run/create-a-job-with-image/run-job), usable for [testing images](https://developers.keboola.com/extend/docker/tutorial/automated-build/#run-test-jobs-of-your-new-image-against-live-configurations)

## Configuration

Extensions executed by Docker Runner store their configurations in
[Storage API Components Configurations](http://docs.keboola.apiary.io/#reference/component-configurations).

When creating the configuration, use
[this JSON schema](https://github.com/keboola/docker-bundle/blob/master/Resources/schemas/configuration.json)
to validate the configuration before storing it.
