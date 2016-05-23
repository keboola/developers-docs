---
title: Integrate
permalink: /integrate/
---

* TOC
{:toc}

You can look at Keboola Connection as a system of independent and loosely coupled microservices. Each microservice has it's own code base and, publicly accessible API and configuration stored in a place you can access. We don't cheat or have any advantage over other developers, our UI and other components use only these public APIs. As result it's very easy to eg. write custom scripts to bootstrap a project or do something that our UI does not offer. Let's have a look into this!

## Common

All components share a common behaviour base. 

### Components API

Each component has a `/run` API call, that accepts its configuration in JSON body and queues the job. For more details, see [full API description](http://docs.keboolaconnector.apiary.io/#reference/sample-coponent's-api-calls-required-for-orchestration).

### Components Configuration

All components store their configuration in [Storage API Components Configurations](http://docs.keboola.apiary.io/#reference/component-configurations). Stored configurations can be referenced in `/run` API calls. 

{% comment %} 

TODO dát link na component detail endpoint

{% endcomment %}

Configuration can be defined with a JSON schema, that is stored within the Component detail. Docker Extensions without their own schemas can use a generic [Docker Extension schema](/overview/docker-bundle/#configuration).

## Specific Components

  - [Transformations](./transformations/)


{% comment %}
  - Storage
    - API
    - Curl
    - Commandline
  - Transformation
    - API
    - IO Mapping
    - Sandbox
  - Extractors
    - Mailchimp
    - App Annie
    - ...
  - Writers
{% endcomment %}
