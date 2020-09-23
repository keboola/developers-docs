---
title: Automation/Common Tasks
permalink: /automate/
---

## Automation

Use the KBC Orchestrator component to specify what tasks should be executed in what order and 
configure their automatic execution (specified intervals, specified times of the day, etc.).

The Keboola Storage API ([SAPI](https://keboola.docs.apiary.io/)) provides full automation of the data warehouse cycle. 
The end-to-end serverless solution automatically enables you to connect data sources, automatically store data 
in the correct format, check for format inconsistencies, and choose different metadata providers based on the
operation you wish to perform on the data. The platform scales the needed resources automatically across various 
types of data (structured, semi-structured, and non-structured) and processes.

The whole environment tracks all the [operational metadata](https://keboola.docs.apiary.io/#reference/events) 
and can be accessed without needing a server via APIs. This is useful when automating development, testing and 
production run of data jobs with automatic controls of [pipelines](https://keboola.docs.apiary.io/#reference/development-branches).

As SAPI is part of the wider Keboola Connection platform, it is an essential element in providing coherent data 
fabric across clouds, users, services, and on premise.


## CI/CD

No matter whether you use Jenkins, CircleCI, AWS CodeBuilder, or Azure DevOps, you can utilise 
the Keboola Connection API within your existing CI/CD pipeline to deploy and manage new versions of your data 
pipeline and data process automation tasks.

## Documentation

You can learn about how to set up our Orchestrator on [help.keboola.com/tutorial/automate/](https://help.keboola.com/tutorial/automate/).

{% comment %} 
  - Load data from your system
  - Trigger orchestrations
  - Send data
  - Copy buckets from different projects


Orchestrator

spusteni jobu
API pro konfiguraci, nepouzivat normalni api
custom joby
{% endcomment %}
