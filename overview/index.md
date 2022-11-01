---
title: Keboola Connection Overview
permalink: /overview/
---

* TOC
{:toc}

Keboola Connection (KBC) is an open system of many components orchestrated together
through (mostly REST) APIs. Although quite complex, it is modular and therefore
you rarely need to work with more than a few components.

## KBC Architecture
The following chart shows how KBC is structured. All KBC parts are briefly described [here](https://help.keboola.com/overview/).

![Overview of KBC Components](/kbc_structure.png){: .img-responsive}

## Working with KBC
Everything you can do in the KBC UI can be done programatically using the API of the corresponding component.
All of our components have API documentation on [Apiary](https://keboola.docs.apiary.io/#) and
most of them have a public [Github repository](https://github.com/keboola/).
Our Docker components are built either on [DockerHub](https://github.com/keboola/), [Quay](https://quay.io/organization/keboola) or privately on [AWS ECR](https://aws.amazon.com/ecr/).

This means that there are virtually **endless possibilities of what can be done with KBC programmatically**.

## Important Components
There are some components which are probably more important than others:

- [Storage](/integrate/storage/) component which is used to store all data in your KBC projects (data in tables,
file uploads, configurations and logs)
- [Docker Runner](/extend/docker-runner) component which is used internally to run almost all
[components](/extend/component/); therefore all extractors, writers and applications share its features
- [Transformations](https://help.keboola.com/transformations/) component which encapsulates all types of transformations (SQL with
various backends, R, Python)
- [Orchestrator](/automate/) component which takes care of grouping different tasks together and
running them regularly at scheduled times

## Component Common Features
All components share some common behaviour such as [*Component Configuration*](/integrate/storage/api/configurations/)
[Running Jobs](/integrate/jobs/), which allows each component to be run in [Orchestrations](https://help.keboola.com/orchestrator/).
This means that once worked your way through one component, you have seen them all.
**Most of our components are open source**. If you are interested in their code, have a look at
[our repositories](/overview/repositories/).
Apart from that common features, some components define additional [synchronous actions](/extend/common-interface/actions/).
This (and many other information) can be retrieved using the [Developer Portal API](https://kebooladeveloperportal.docs.apiary.io/#)
(specifically the [Get app detail call](https://kebooladeveloperportal.docs.apiary.io/#reference/0/public-api/get-app-detail)
which lists all components available in KBC.

### Running Jobs
What each component does is defined purely by that component, and so is the content of the configuration.
Each component has a `/run` API call that accepts either a reference to component configuration
(`config` field) or full component configuration (`configData` field) in JSON body, and
[queues an asynchronous job](/integrate/jobs/).

For more details, see
[full API description](https://kebooladocker.docs.apiary.io/#reference/run/run-job).

### Components Configuration
All components store their configuration in [Storage](/integrate/storage/). Management of the
configurations is done through
[Storage Components Configurations API](https://keboola.docs.apiary.io/#reference/component-configurations).
Stored configurations can be referenced in `/run` API calls.

Configuration can be defined with a JSON schema stored within the Component detail.
Docker Components without their own schemas can use a generic [Docker Component schema](/extend/docker-runner/#configuration).

## Specific Components

Apart from the above common API, some components offer other API calls:

  - [Storage](/integrate/storage/)
  - [Transformations](/integrate/transformations/)

