---
title: Docker Extensions
permalink: /extend/docker/
---

Docker extensions allow you to extend KBC in a more flexible way than [Custom Science](/extend/custom-science/). At the same 
time, significant implementation effort on your part is required. In Docker extensions, the data interface is 
very similar to [transformations](https://help.keboola.com/transformations/) 
and [Custom Science](/extend/custom-science/) - data are exchanged as 
CSV files in [designated directories](/extend/common-interface/).


Advantages:

* Customizable UI (input/output mapping) 
* Standard (customizable), or your own UI can be used
* Branding possible; Documentation and extended description can be provided
* Arbitrary application environment; can be fully private
* Automatically offered to all KBC users
* Support for OAuth2

Disadvantages:

* [Registration checklist](/extend/registration/checklist/) must be completed
* Extension [registration](/extend/registration/) by Keboola is required
* Maintaining your own Docker image is necessary (on Dockerhub or Quay)

See the [overview](/extend/) for comparison with other customization options.


### How to Create a Docker Extension
If you are new to extending KBC with your own code, you might want to start by creating a 
simple [Custom Science extension](/extend/custom-science/) first. Any Custom Science extension can be very easily 
converted to a Docker extension. 

As a developer, you need to implement the application logic in arbitrary language and store it in a git repository. 
The extension must adhere to our [Common Interface](/extend/common-interface/).
We provide libraries to help you with implementation in
 [R](https://github.com/keboola/r-docker-application) and [Python](https://github.com/keboola/python-docker-application). 
 We also have an example application in [PHP](https://github.com/keboola/docker-demo-app). When you have your
 application ready, you need to wrap it in a Docker image.  All images which are supposed to be run in KBC
  must have an `ENTRYPOINT`. 
We also recommned that you base your image on [one of our images](/extend/docker/images/).

A Docker extension processes input tables stored in [CSV files](/extend/common-interface/) and generates 
result tables in CSV files.  An extractor works the same way, however, it does not read input from 
KBC tables, but instead from its source (usualy some API). Similarly, a Writer does not generate any KBC tables. 
We make sure the CSV files are created in and taken from the right places. 

The execution of your extension happens in its own [isolated environment](/architecture/docker-bundle/).

Before you (or anyone else) can use your *Docker extension*, it must be [registered](/extend/registration/) 

If you are new to docker, there is a [quick introdution](/extend/docker/tutorial/),
a [guide to setting up docker](/extend/docker/tutorial/setup/) and  
 [guide to building dockerized applications](/extend/docker/tutorial/howto/). 
To create a simple Docker Extension on your own, go to [Quick start guide](/extend/docker/quick-start/).
If you need to test and debug an existing image, there is a guide 
for [running and debugging images](/extend/docker/running/) in KBC environment.
