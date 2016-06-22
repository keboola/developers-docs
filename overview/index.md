---
title: KBC Overview
permalink: /overview/
---

Keboola Connection (KBC) is a system composed of many components orchestrated together 
through (mostly REST) APIs. Although the whole system is quite complex, it is modular and therefore 
you rarely need to work with more then few components.

There are some components which are probably more important than others:
- [Storage](/integrate/storage/) component which is used to store all data in your KBC projects (data in tables, 
file uploads, configurations and logs)
- [Docker Runner](/overview/docker-bundle) component which is used internally to run all 
[dockerized components](/extend/docker/) and therefore many extractors, writers and applications share its features
- [Transformations](/integrate/transformations/) component which encapsulates all types of transformations (SQL with
various backends, R, Python)
- [Orchestrator](/intergate/orchestrator/) component which takes care of grouping different tasks together and 
running them regularly at scheduled times

Many other components (not mentioned above) share the same properties, 
such as [running jobs](/overview/jobs/) or [component API](/integrate/#component-api). This means, that
once worked your way thru one component, you've seen them all. Most of our components are 
open source, so if you are interested in code, have a look [at our repositories](/overview/repositories/).

