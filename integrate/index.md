---
title: Integrate
permalink: /integrate/
---

* TOC
{:toc}

You can look at Keboola Connection as a system of independent and loosely coupled microservices. Each microservice has it's own code base and, publicly accessible API and configuration stored in a place you can access. We don't cheat or have any advantage over other developers, our UI and other components use only these public APIs. As result it's very easy to eg. write custom scripts to bootstrap a project or do something that our UI does not offer. Let's have a look into this!     

  - [Transformation](./transformations/)
  - [Docker Components](./docker/)

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
