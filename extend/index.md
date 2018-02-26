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

There are two main options for extending KBC --
you can either create your own **Component** or you can use
**Generic Extractor** to build an extractor for a RESTful API.

Extending KBC offers many advantages, depending on what your role is:

- If you already are a KBC customer:
    - You can create your own component to convert your business problem into cloud, we'll take care of the technical arrangements around running it.
    - You can create extractors or writers for communicating with your legacy systems, evne if they are completely non-standard.
    - You can create components to experiment with new business solutions, no need to ask your IT to allocate resources to you, [fail fast](https://en.wikipedia.org/wiki/Fail-fast#Business).
    - Easy access to data from many different sources.
- If you are an external company:
    - You can create connectors (Extractors/Writers) so that KBC users can easily connect to your service, and broaden your customer base.
    - You can create applications containing or using your algorithms and easily "deploy" them to KBC customers. They won't be exposed to end-users, neither will be the end-user data exposed to you.
    - Simple path to delivering the data back to your customers.

- If you are a data scientist
    - You can create applications for delivering your work to your customer, we'll take care of the technical arrangements, no need to rent servers and feed data to them.
    - Availability of your application or algorithm to all existing KBC subscribers and implementation partners.
    - Opportunity for you to focus only on areas of your product where you are adding value.
    - Keboola in charge of the billing.

## Component
A [Component](/extend/component/) can be used as:

- **Extractor** -- allowing customers to get data from new sources. It only processes input tables from external sources (usually API).
- **Application** -- further enriching the data or add value in new ways. It processes input tables stored as CSV files and generates result tables as CSV files.
- **Writer** -- pushing data into new systems and consumption methods. It does not generate any data in KBC project.
- **Processor** -- adjusting the inputs or outputs of other components. It has to be run together with any of the above components.

All components are run using the [Docker Runner component](/extend/docker-runner/) which takes
care of their authentication, starting, stopping, isolation, and reading data from and writing it to KBC Storage. They must adhere to the
[common interface](/extend/common-interface/). Creating components requires an elementary knowledge of [Docker](https://www.docker.com/what-docker).
They can be implemented in virtually any programming language and be fully customized and tailored to anyone's needs.
They also support OAuth authorization. To get started with building a component, see our [**tutorial**](/extend/component/tutorial/).

## Generic Extractor
[Generic Extractor](/extend/generic-extractor/) is a KBC component acting like a
customizable [HTTP REST client](/extend/generic-extractor/tutorial/rest/). It can be configured to extract data from virtually
any API and offers a vast amount of configuration options. With Generic Extractor you
can build an entirely new extractor for KBC in less than an hour. Components based on
Generic Extractor are build using [JSON configuration](/extend/generic-extractor/tutorial/) and a
[published template](/extend/generic-extractor/publish/). They have a predefined UI, require no knowledge of docker or
other tools, they use a Keboola owned [repository](https://github.com/keboola/kbc-ui-templates/). To get started with Generic Extractor,
see our [**tutorial**](/extend/generic-extractor/tutorial/).
