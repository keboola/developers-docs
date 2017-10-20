---
title: Docker Runner
permalink: /extend/docker-runner/
redirect_from:
    - /integrate/docker-bundle/
    - /integrate/docker-runner/
---

* TOC
{:toc}

Docker Runner is a core [KBC component](/overview/#important-components) which provides an interface for
running other KBC components. Every component in Keboola Connection is represented by a [Docker image](/extend/docker/tutorial/) in Keboola Connection.

Developing functionality in [Docker](https://www.docker.com/) allows you to focus only on the application logic; all communication
with [Storage API](http://docs.keboola.apiary.io/#) will be handled by Docker Runner. You can encapsulate any application into an Docker image
following a set of rules that will allow you to integrate the application into Keboola Connection.

There is a [predefined interface](/extend/common-interface/) with Docker Runner consisting mainly of a
[folder structure](/extend/common-interface/) and a [serialized configuration file](/extend/common-interface/config-file/).
[Custom Science](/extend/custom-science/), [Docker Extensions](/extend/docker/) and also
R and Python Transformations are all dockerized applications and are run using Docker Runner.

## Workflow
The Docker Runner functionality can be described in a few steps:

- Download and build the specified Docker image.
- Download all [tables](/extend/common-interface/folders/#dataintables-folder) and [files](/extend/common-interface/folders/#datainfiles-folder) specified in the input mapping from Storage.
- Create a [configuration file](/extend/common-interface/config-file/).
- Run [before processors](/integrate/docker-runner/processors/) if there are any.
- Run the Docker image (create a Docker container).
- Run [after processors](/integrate/docker-runner/processors/) if there are any.
- Upload all [tables](/extend/common-interface/folders/#dataouttables-folder) and [files](/extend/common-interface/folders/#dataoutfiles-folder) in the output mapping to Storage.
- Delete the container and all temporary files.

When the application execution is finished, Docker Runner automatically collects the exit code and the content of STDOUT and STDERR.
The following schema illustrates the workflow of running a dockerized component.

![Docker Workflow](/extend/docker-runner/docker-runner.svg)

### Features
The application is responsible for these processes:

- Reading the configuration and source tables in CSV format and files (if specified).
- Writing the results to the predefined folders and files.
- Proper handling of success/error results by setting an appropriate exit code.

Docker Runner is responsible for the following processes:

- Authentication: Docker Runner makes sure the application is run by authorized users/tokens.
It is not possible to run an extension anonymously. The extension does not have an access to the KBC token
itself, and it receives only limited information about the project and end-user.
- Starting and stopping the extension: Docker Runner will boot a Docker container which contains the
extension. This ensures the extensions run in a precisely defined environment which is guaranteed to
be the same for each extension run. No application state is preserved (with the exception of the
[state file](https://developers.keboola.com/extend/common-interface/config-file/#state-file).
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

- run a [docker extension](/extend/docker/),
- [encrypt values](/overview/encryption/),
- [create a sandbox](/extend/common-interface/sandbox/),
- run [component actions](/extend/common-interface/actions/), and 
- run a [docker extension](/extend/docker/) with a [specified docker image tag](http://docs.kebooladocker.apiary.io/#reference/run/create-a-job-with-image/run-job), usable for [testing images](https://developers.keboola.com/extend/docker/tutorial/automated-build/#run-test-jobs-of-your-new-image-against-live-configurations).

## Configuration

Extensions executed by Docker Runner store their configurations in
[Storage API Components Configurations](http://docs.keboola.apiary.io/#reference/component-configurations).

When creating the configuration, use
[this JSON schema](https://github.com/keboola/docker-bundle/blob/master/Resources/schemas/configuration.json)
to validate the configuration before storing it. The configuration contains the following nodes:

- `parameters` --- An arbitrary object passed to the dockerzied application itself.
- `storage` --- Configuration of [input and output mapping](https://developers.keboola.com/extend/common-interface/folders/). Specific options correspond to the options of the 
[Unload table](http://docs.keboola.apiary.io/#reference/tables/unload-data-asynchronously) and
[Load table](http://docs.keboola.apiary.io/#reference/tables/load-data-asynchronously) API calls.
- `runtime` --- Configuration for running [Custom Science](https://developers.keboola.com/extend/custom-science/) extensions.
- `processors` --- Configuration of [Processors](https://developers.keboola.com/extend/docker-runner/processors/)
- `authorization` --- OAuth authorization [injected to the configuration](https://developers.keboola.com/extend/common-interface/oauth/). Not stored in Component Configuration.
- `image_parameters` --- An arbitrary object passed from the [registered component](https://developers.keboola.com/extend/registration/). Not stored in Component Configuration.
- `action` --- An [Action](https://developers.keboola.com/extend/common-interface/actions/) being executed. Not stored in Component Configuration.
