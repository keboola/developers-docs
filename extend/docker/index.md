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

Disadvantages:

* [Registration checklist](/extend/registration/checklist/) must be completed
* Extension [registration](/extend/registration/) by Keboola is required
* Maintaining your own Docker image is necessary (on Dockerhub or Quay)

See the [overview](/extend/) for comparison with other customization options.


### How to Create a Docker Extension
If you are new to extending KBC with your own code, you might want to start by creating a 
simple [Custom Science extension](/extend/custom-science/) first. Any Custom Science extension can be very easily 
converted to a Docker extension. 

Before You Start, Make Sure to

- Have a git repository ready; ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, although any other host should work as well). It is easier to start with a public repository.
- Have a [KBC project](/overview/devel-project/), where you can test your code.
- Get yourself acquainted with [Docker](/extend/docker/tutorial/). You should be able to at least run a Docker image.
- Be able to send API requests. You can use an [Apiary](https://apiary.io/) client console, but we 
recommend using [Postman](https://www.getpostman.com/) as it is 
more convenient. If you do use Postman, you can [import a list](/overview/api/)
of [sample requests](https://www.getpostman.com/collections/87da6ac847f5edcac776).

To create a simple Docker Extension on your own, go to [Quick start guide](/extend/docker/quick-start/).
If you are new to docker, there is a [quick introdution](/extend/docker/tutorial/) and a 
 [guide to working with docker](/extend/docker/tutorial/howto/). 
If you need to test and debug your image, there is a guide for [running images](/extend/docker/running/) in KBC environment.


