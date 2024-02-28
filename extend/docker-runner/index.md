---
title: Docker Runner
permalink: /extend/docker-runner/
redirect_from:
    - /integrate/docker-bundle/
    - /integrate/docker-runner/
---

* TOC
{:toc}

Docker Runner is a core [Keboola component](/overview/#important-components), which
provides an interface for running other Keboola components. Every component in Keboola is
represented by a [Docker image](/extend/component/docker-tutorial/).
Running a component means creating and executing an [asynchronous job](/integrate/jobs/).

Developing functionality in [Docker](https://www.docker.com/) allows you to focus only on the application logic; all communication
with the [Storage API](https://keboola.docs.apiary.io/#) will be handled by Docker Runner. You can encapsulate any application into a Docker image
following a set of rules that will allow you to integrate the application into Keboola.

There is a [predefined interface](/extend/common-interface/) with Docker Runner, consisting
mainly of a [folder structure](/extend/common-interface/folders/) and a [serialized configuration file](/extend/common-interface/config-file/).
All [components](/extend/component/), including our internal R and Python Transformations, are run using Docker Runner.

## Workflow
The Docker Runner functionality can be described in the following steps:

- Download and build the specified Docker image.
- Download all [tables](/extend/common-interface/folders/#dataintables-folder) and [files](/extend/common-interface/folders/#datainfiles-folder) specified in the input mapping from Storage.
- Create a [configuration file](/extend/common-interface/config-file/).
- Run [before processors](/extend/component/processors/) if there are any.
- Run the Docker image (create a Docker container).
- Run [after processors](/extend/component/processors/) if there are any.
- Upload all [tables](/extend/common-interface/folders/#dataouttables-folder) and
[files](/extend/common-interface/folders/#dataoutfiles-folder) in the output mapping to Storage.
- Delete the container and all temporary files.

When the component execution is finished, Docker Runner automatically collects the exit code and the content of STDOUT and STDERR.
The following schema illustrates the workflow of running a dockerized component.

![Docker Workflow](/extend/docker-runner/docker-runner.svg)

### Features
The component is responsible for these processes:

- Reading the configuration and source tables in CSV format and files (if specified)
- Writing the results to the predefined folders and files
- Proper handling of success/error results by setting an appropriate exit code

Docker Runner is responsible for the following processes:

- **Authentication:** Docker Runner makes sure the component is run by authorized users/tokens.
It is not possible to run a component anonymously. The component does not have an access to the Keboola token
itself, and it receives only limited information about the project and the end-user.
- **Starting and stopping** the component: Docker Runner will boot a Docker container which contains the
component. This ensures the component runs in a precisely defined environment, which is guaranteed to
be the same for each component run. No component state is preserved (with the exception of the
[state file](/extend/common-interface/config-file/#state-file).
- **Reading and writing data** to Keboola Storage: Docker Runner ensures a custom component
cannot access arbitrary data in the project. It will only receive the input mapping defined by the end user;
and only those outputs defined in the output mapping by the end user will be written to the project.
- **Component isolation**: Each component is run in its own Docker container, which is isolated from other
containers; the component cannot be affected by other running components. It may also be limited
to have no network access.

## API
The Docker Runner API is described on [Apiary.io](https://kebooladocker.docs.apiary.io/#). Docker Runner
has API calls to

- run a [component](/extend/component/).
- [encrypt values](/overview/encryption/).
- [prepare the data folder](/extend/component/running/#preparing-the-data-folder).
- run [component actions](/extend/common-interface/actions/).
- run a [component](/extend/component/) with a [specified Docker image tag](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job-with-image/run-job), usable for [testing images](/extend/component/deployment/#test-live-configurations).

## Configuration
Components executed by Docker Runner store their configurations in
[Storage API components configurations](https://keboola.docs.apiary.io/#reference/components-and-configurations).

When creating the configuration, use
[this JSON schema](https://github.com/keboola/docker-bundle/blob/master/Resources/schemas/configuration.json)
to validate the configuration before storing it. The configuration contains the following nodes,
all of them are optional:

- `parameters` --- an arbitrary object passed to the dockerized application itself
- `storage` --- configuration of [input and output mapping](/extend/common-interface/folders/); specific options correspond to the options of the
[unload data](https://keboola.docs.apiary.io/#reference/tables/unload-data-asynchronously) and
[load data](https://keboola.docs.apiary.io/#reference/tables/load-data-asynchronously) API calls.
- `runtime` --- configuration for modifying some image parameters at run time
- `processors` --- configuration of [Processors](/extend/component/processors/)
- `authorization` --- OAuth authorization [injected to the configuration](/extend/common-interface/oauth/); not stored in the component configuration
- `image_parameters` --- an arbitrary object passed from the [component](/extend/component/); not stored in the component configuration
- `action` --- an [action](/extend/common-interface/actions/) being executed; not stored in the component configuration
