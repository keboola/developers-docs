---
title: Docker Bundle
permalink: /overview/docker-bundle/
---

Docker Bundle is [KBC component](/overview/) which provides an interface for 
running [Docker images](/extend/docker/tutorial) in Keboola Connection. 
By developing functionality in [Docker](https://www.docker.com/) you'll focus only on the application logic, all communication 
with Storage API will be handled by Docker bundle. You can encapsulate any app into an Docker image 
following a set of rules that will allow you to integrate the app into Keboola Connection.

There is a [predefined interface](/extend/common-interface/) with the Docker bundle consisting of a
[folder structure](/extend/common-interface/) and a [serialized configuration file](/extend/config-file/). 
[Custom Science](/extend/custom-science/), [Docker Extensions](/extend/docker/) and also 
R and Python Transformations are all dockerized applications and are run using Docker Bundle. 

## Workflow

Docker bundle's functionality can be described in few simple steps:

- Download and build specified docker image
- Download all tables and files specified in input mapping from Storage
- Create configuration file (i.e config.json)
- Run the docker image (create a docker container)
- Upload all tables and files in output mapping to Storage
- Delete the container and all temporary files

When the app execution is finished, Docker bundle automatically collects the exit code and the content of STDOUT and STDERR.

### Features 

Application responsibility is:

- Read the configuration and source tables in CSV format and files (if specified).
- Write the results to predefined directories and files.
- Properly handle success/error results by setting appropriate exit code.


Docker bundle reponsibility is:

- Authentication - The Docker component makes sure that the application is run by authorized users/tokens. 
It is not possible to run an extension anonymously. The extension does not have access to the KBC token 
itself, and it receives only limited information about the project and end-user.
- Starting and stopping the extension - The Docker component will boot a Docker container which contains the 
extension. This ensures that the extensions run in a precisely defined environment which is guaranteed to 
be the same for each extension run (no application state is preserved)
- Reading and writing data to KBC Storage - The Docker component ensures that a custom extension 
cannot access arbitrary data in the project. It will only receive the input mapping defined by the end-user, 
and it will write to the project only those outputs defined in the output mapping by the end-user. 
- Application isolation - each extension is run in its own Docker container which is isolated from other 
containers; the application cannot be affected by other running applications. It may also be limited 
to have no network access.

For [Custom science](/extend/custom-science/) Docker Bundle also creates the docker image on fly from the 
specified git repository.
