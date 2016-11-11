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

![Overview of KBC Components](/kbc-structure.png){: .img-responsive}

## Working with KBC
Everything you can do in the KBC UI can be done programatically using the API of the corresponding component.
All of our components have API documentation on [Apiary](http://docs.keboola.apiary.io/) and
most of them have a public [Github repository](https://github.com/keboola/).
Our Docker components are built either on [DockerHub](https://github.com/keboola/)
or [Quay](https://quay.io/organization/keboola).

This means that there are virtually **endless possibilities of what can be done with KBC programmatically**.

## Important Components
There are some components which are probably more important than others:

- [Storage](/integrate/storage/) component which is used to store all data in your KBC projects (data in tables,
file uploads, configurations and logs)
- [Docker Runner](/integrate/docker-bundle) component which is used internally to run all
[dockerized components](/extend/docker/); therefore many extractors, writers and applications share its features
- [Transformations](/integrate/transformations/) component which encapsulates all types of transformations (SQL with
various backends, R, Python)
- [Orchestrator](/integrate/orchestrator/) component which takes care of grouping different tasks together and
running them regularly at scheduled times

## Component Common Features
All components share some common behaviour such as [running jobs](/overview/jobs/), *Component Configuration*, or
*Components API*, which allows each component to be run in [Orchestrations](https://help.keboola.com/automate/).
This means that once worked your way through one component, you have seen them all.
**Most of our components are open source**. If you are interested in their code, have a look at
[our repositories](/overview/repositories/).

### Components API
What each component does is defined purely by that component, and so is the content of the configuration.
Each component has a `/run` API call that accepts either a reference to component configuration
(`config` field) or full component configuration (`configData` field) in JSON body, and
[queues an asynchronous job](/overview/jobs/).

For more details, see
[full API description](http://docs.keboolaconnector.apiary.io/#reference/sample-component's-api-calls-required-for-orchestration).

### Components Configuration
All components store their configuration in [Storage](/integrate/storage/). Management of the
configurations is done through
[Storage Components Configurations API](http://docs.keboola.apiary.io/#reference/component-configurations).
Stored configurations can be referenced in `/run` API calls.

{% comment %}
TODO dát link na component detail endpoint

TODO doplnit schemata
{% endcomment %}

Configuration can be defined with a JSON schema stored within the Component detail.
Docker Extensions without their own schemas can use a generic [Docker Extension schema](/integrate/docker-bundle/#configuration).

## Specific Components

Apart from the above common API, some components offer other API calls:

  - [Storage](/integrate/storage/)
  - [Transformations](/integrate/transformations/)

