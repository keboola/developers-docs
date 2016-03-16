---
title: Docker Bundle
permalink: /overview/docker-bundle/
---

Docker Bundle is KBC component which provides an interface for 
running [Docker](/extend/docker/tutorial) images in Keboola Connection. 
By developing functionality in Docker you'll focus only on the application logic, all communication 
with Storage API will be handled by Docker bundle.

KBC responsibility is:
Create application instance from the repository specified by 3rd party developer (this is done by building a docker image and running a docker container from it).
Provide the application instance with the configuration file in JSON or YAML format (/data/ directory).
Provide the application instance with source data files in predefined directories - this corresponds to input mapping in the UI (/data/ directory).  
Run the application instance with a command specified by the 3rd party developer (see below).
Ensure isolation of the application instance - the application cannot access any other tables/files from the project outside those specified in input mapping, the application cannot access data of any other application, nor its data can by accessed by any other application. The application can however connect to outside internet.
Grab the specified outputs of the application and feed them to KBC Storage (this corresponds to output mapping in the UI)
Application responsibility is:
Read the configuration and source tables in CSV format and files (if specified).
Write the results to predefined directories and files.
Properly handle success/error results by setting appropriate exit code.

## Workflow

What happens before and after running a Docker container.

  - Download and build specified docker image
  - Download all tables and files specified in input mapping
  - Create configuration file (i.e config.yml)
  - Run the container
  - Upload all tables and files in output mapping
  - Delete the container and all temporary files


Docker bundle's functionality can be described in few simple steps:

 - Download your Docker image from Dockerhub
 - Download all required tables and files from Storage (will be mounted into `/data`)
 - Run the container
 - Upload all result tables and files to Storage

When the app execution is finished, Docker bundle automatically collects the exit code and the content of STDOUT and STDERR.

## Architecture

You can encapsulate any app into an Docker image following a set of simple rules that will allow you to integrate the app into Keboola Connection.

There is a predefined interface with the Docker bundle consisting of a folder structure and a serialized configuration file. The app usually grabs some data (tables or files) from Storage, processes them using parameters from the configuration and then stores the data back to Storage. Docker bundle abstracts from the Keboola Connection Storage and communicates with your app using the simple directory structure - before starting your app, it downloads all required tables and files and after your app is done, it grabs all the results and uploads them back to Storage.



### Common Properties of Custom Extensions 

Our Docker component takes care of some things, which means that the Custom extension itself is simpler and 
generally more secure.

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
