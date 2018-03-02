---
title: Extending Keboola Connection
permalink: /extend/
---

As an open system consisting of many built-in, interoperating components,
such as Storage or Extractors, [Keboola Connection (KBC)](/overview/) can be easily extended.
We encourage you to [**build your own components**](/extend/component/tutorial), whether for
your own use or to be offered to other KBC users and customers.

* TOC
{:toc}

There are two main options for extending KBC: (a) creating your own **component** and (b) using **Generic 
Extractor** to build an extractor for a RESTful API.

## Advantages of Extending KBC

Depending on your role, extending KBC offers various advantages:

- If you already are a **KBC customer**: 
    - Create your own component to convert your business problem into cloud. We will take care of the technical arrangements around running it.
    - Create extractors or writers for communicating with your legacy systems, even if they are completely non-standard.
    - Create components to experiment with new business solutions. No need to ask your IT to allocate resources to you. [Fail fast](https://en.wikipedia.org/wiki/Fail-fast#Business).
    - Easily access data from many different sources.
- If you are an **external company**:
    - Create connectors (Extractors/Writers) so that KBC users can easily connect to your service and broaden your customer base.
    - Create applications containing or using your algorithms and easily "deploy" them to KBC customers. They won't be exposed to end-users, neither will be the end-user data exposed to you.
	- Easily deliver the data back to your customers.
- If you are a **data scientist**:
    - Create applications for delivering your work to your customer. We will take care of the technical arrangements. No need to rent servers and feed data to them.
    - Make your application or algorithm available to all existing KBC subscribers and implementation partners.
    - Focus only on areas of your product where you are adding value.
    - Let Keboola be in charge of the billing.

## Component
A [component](/extend/component/) can be used as:

- **Extractor**, allowing customers to get data from new sources. It only processes input tables from external sources (usually API).
- **Application**, further enriching the data or adding value in new ways. It processes input tables stored as CSV files and generates result tables as CSV files.
- **Writer**, pushing data into new systems and consumption methods. It does not generate any data in KBC projects.
- **Processor**, adjusting the inputs or outputs of other components. It has to be run together with one of the above components.

All components are run using [Docker Runner](/extend/docker-runner/), a component that takes
care of their authentication, starting, stopping, isolation, reading data from and writing it to KBC Storage. They must adhere to the
[common interface](/extend/common-interface/). Creating components requires an elementary knowledge of [Docker](https://www.docker.com/what-docker).
They can be implemented in virtually any programming language and be fully customized and tailored to anyone's needs.
They also support OAuth authorization. To get started with building a component, see our [**tutorial**](/extend/component/tutorial/).

## Generic Extractor
[Generic Extractor](/extend/generic-extractor/) is a KBC component acting like a
customizable [HTTP REST client](/extend/generic-extractor/tutorial/rest/). It can be configured to extract data 
from virtually any API and offers a vast amount of configuration options. With Generic Extractor, you can build an 
entirely new extractor for KBC in less than an hour. 

Components based on Generic Extractor are built using [JSON configuration](/extend/generic-extractor/tutorial/) and a
[published template](/extend/generic-extractor/publish/). They have a predefined UI, require no knowledge of Docker or
other tools, and they use a Keboola owned [repository](https://github.com/keboola/kbc-ui-templates/). To get 
started with Generic Extractor, see our [**tutorial**](/extend/generic-extractor/tutorial/).
