---
title: Integrate
permalink: /integrate/
---

You can look at Keboola Connection as a system of independent and loosely coupled microservices. Each microservice has its own code base, and a publicly accessible API and configuration. 
We do not cheat or have any advantage over other developers; our UI and other components use only these public APIs. 
As a result, it's very easy to, for example, write custom scripts to bootstrap a project, or do something that our UI does not offer. 
Let's have a look into this!

You can look at Keboola Connection as a system of independent and loosely coupled components
- microservices. 
Each microservice has it's own code base and, publicly accessible API and configuration stored 
in a place you can access. We don't cheat or have any advantage over other developers, our UI 
and other components use only these public APIs. As result it's very easy to eg. write custom 
scripts to bootstrap a project or do something that our UI does not offer. Let's have a look into this!

One of the very important components is [Storage](/integrate/storage/), which not only stores all the data in
project, but also provides additional functions such as managing other components 
and their configurations. When you are integrating your systems with KBC, 
**chances are that you want to start with [Storage](/integrate/storage/)**.

## Common

All components share some common behaviour. Each component has *Component API* which allows it
to be run in [Orchestrations](https://help.keboola.com/automate/) and *Component Configuration*. 

### Components API

Each component has a `/run` API call, that accepts either a reference to component configuration
(`config` field) or full component configuration (`configData` field) in JSON body and 
[queues an asynchronous job](/overview/jobs/).  
For more details, see 
[full API description](http://docs.keboolaconnector.apiary.io/#reference/sample-coponent's-api-calls-required-for-orchestration).
What each component does is defined purely by that component, so is the contents of the configuration.
The common property is that each component has `/run` which accepts configuration in some form.
Each component has a `/run` API call that accepts its configuration in JSON body and queues the job. For more details, see the [full API description](http://docs.keboolaconnector.apiary.io/#reference/sample-coponent's-api-calls-required-for-orchestration).

### Components Configuration
All components store their configuration in [Storage](/integrate/storage/). Management of the
configurations is done thru   
[Storage Components Configurations API](http://docs.keboola.apiary.io/#reference/component-configurations). 
Stored configurations can be referenced in `/run` API calls. 

{% comment %} 

TODO dát link na component detail endpoint

TODO doplnit schemata
{% endcomment %}

Configuration can be defined with a JSON schema, that is stored within the Component detail. 
Docker Extensions without their own schemas can use a generic 
[Docker Extension schema](/overview/docker-bundle/#configuration).
A configuration can be defined with a JSON schema stored within the Component detail. Docker Extensions without their own schemas can use a generic [Docker Extension schema](/overview/docker-bundle/#configuration).

## Specific Components

Apart from the above common API, some components offer other API calls:

  - [Storage](/integrate/storage/)
  - [Transformations](/integrate/transformations/)

{% comment %}
  - [Docker Runner](/overview/docker-bundle/) - kam s tim? nedat do integrate, to je potreba znovu precist
  - gdwriter

  - Storage
    - API
    - Curl
    - Commandline
  - Transformation
    - API
    - IO Mapping
    - Sandbox
  - Extractors
    - ...
  - Writers
{% endcomment %}
