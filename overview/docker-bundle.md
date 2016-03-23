---
title: Docker Bundle
permalink: /overview/docker-bundle/
---

Docker Bundle is a [KBC component](/overview/) which provides an interface for 
running [Docker images](/extend/docker/tutorial) in Keboola Connection. 
By developing functionality in [Docker](https://www.docker.com/) you will focus only on the application logic; all communication 
with Storage API will be handled by Docker Bundle. You can encapsulate any application into an Docker image 
following a set of rules that will allow you to integrate the application into Keboola Connection.

There is a [predefined interface](/extend/common-interface/) with Docker Bundle consisting of a
[folder structure](/extend/common-interface/) and a [serialized configuration file](/extend/config-file/). 
[Custom Science](/extend/custom-science/), [Docker Extensions](/extend/docker/) and also 
R and Python Transformations are all dockerized applications and are run using Docker Bundle. 

## Workflow

Docker Bundle functionality can be described in few simple steps:

- Download and build the specified Docker image
- Download all tables and files specified in the input mapping from Storage
- Create a configuration file (i.e. config.json)
- Run the Docker image (create a Docker container)
- Upload all tables and files in the output mapping to Storage
- Delete the container and all temporary files

When the application execution is finished, Docker Bundle automatically collects the exit code and the content of STDOUT and STDERR.

### Features 

The application is responsible for:

- Reading the configuration and source tables in CSV format and files (if specified).
- Writing the results to the predefined folders and files.
- Proper handling of success/error results by setting an appropriate exit code.

Docker Bundle is responsible for:

- Authentication: Docker Bundle makes sure the application is run by authorized users/tokens. 
It is not possible to run an extension anonymously. The extension does not have an access to the KBC token 
itself, and it receives only limited information about the project and end-user.
- Starting and stopping the extension: Docker Bundle will boot a Docker container which contains the 
extension. This ensures the extensions run in a precisely defined environment which is guaranteed to 
be the same for each extension run (no application state is preserved).
- Reading and writing data to KBC Storage: Docker Bundle ensures a custom extension 
cannot access arbitrary data in the project. It will only receive the input mapping defined by the end-user; 
and only those outputs defined in the output mapping by the end-user will be written to the project. 
- Application isolation: Each extension is run in its own Docker container which is isolated from other 
containers; the application cannot be affected by other running applications. It may also be limited 
to have no network access.

For [Custom Science](/extend/custom-science/), Docker Bundle also creates the Docker image from the 
specified git repository on the fly.
