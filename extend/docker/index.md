---
title: Docker Extensions
permalink: /extend/docker/
---

Docker [extensions](/extend/) allow you to extend KBC in a more flexible way than [Custom Science](/extend/custom-science/).
At the same time, a significant implementation effort on your part is required. In Docker extensions, the data interface is
very similar to [Transformations](https://help.keboola.com/manipulation/transformations/)
and [Custom Science](/extend/custom-science/) --- data is exchanged as
CSV files in [designated directories](/extend/common-interface/).


Advantages:

* Customizable UI (input/output mapping)
* Configuration using [JSON Schema editor](/extend/registration/configuration-schema/)
* Branding possible; documentation and extended description can be provided
* Arbitrary application environment; can be fully private
* Automatically offered to all KBC users
* Support for OAuth2

Disadvantages:

* Extension [registration](/extend/registration/) by Keboola is required
* Maintaining your own Docker image is necessary on AWS ECR (or Dockerhub or Quay)

See the [overview](/extend/) for comparison with other customization options.

### How to Create a Docker Extension
If you are new to extending KBC with your own code, you might want to start by creating a
simple [Custom Science extension](/extend/custom-science/) first. Any Custom Science extension can be easily
converted to a Docker extension.

As a developer, implement the application logic in an arbitrary language, and store it in a git repository.
The extension must adhere to our [Common Interface](/extend/common-interface/).
We provide libraries to help you with implementation in
[R](https://github.com/keboola/r-docker-application) and [Python](https://github.com/keboola/python-docker-application).
We also have an example application in [PHP](https://github.com/keboola/docker-demo-app). When you have your
application ready, wrap it in a [Docker image](todo). All images which are supposed to be run in KBC
must have an `ENTRYPOINT`.

All applications process input tables stored in [CSV files](/extend/common-interface/folders/) and generate result tables in CSV files.
Extractors work the same way. However, instead of reading their input from KBC tables, they get it from an external source
(usually an API).
Similarly, writers do not generate any KBC tables.
Our [Docker Runner component](/extend/docker-runner/) makes sure that the CSV files are created in and taken from the right places. The execution of your extension happens in its own [isolated environment](/extend/docker-runner/).
Before you (or anyone else) can use your *Docker extension*, it must be [registered](/extend/registration/).

If you are new to Docker, there is a [quick introduction](/extend/docker/tutorial/) available,
along with a [guide to setting up Docker](/extend/docker/tutorial/setup/) and a
[guide to building dockerized applications](/extend/docker/tutorial/howto/).
To create a simple Docker extension on your own, go to our [Quick Start guide](/extend/docker/quick-start/).
You can also [test and debug existing images](/extend/docker/running/) in the KBC environment.
