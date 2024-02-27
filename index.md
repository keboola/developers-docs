---
title: Keboola Developers Documentation
permalink: /
---

This documentation site is aimed for developers who are working with Keboola programmatically.
For end-users, there is a separate documentation ready at [help.keboola.com](https://help.keboola.com/).

* TOC
{:toc}

## What Keboola Is
Cloud based, extremely open and extendable, Keboola is the ideal environment for working with your data, be it loading from various sources,
manipulating, enriching, or finally, pushing the data to new systems and consumption methods.

The Keboola system consists of many independent and loosely connected [**components**](/overview/),
such as Extractors, Storage or Writers, that are orchestrated together through (mostly REST) [APIs](/overview/api/).

## Where to Start
In this documentation, we will show you how to

- [**Integrate Keboola with other systems**](/integrate/).
	- Use Keboola just to exchange data (using the [Storage API](/integrate/storage/)).
	- Use Keboola as a [data-handling backbone](/overview/api/) for your product.
	- Wrap Keboola in your own UI for your customers.
	- Control whole data processing pipeline within Keboola from the [outside](/integrate/).
- [**Extend Keboola by building your own components**](/extend/) for your own use or for other Keboola users and customers.
	- [Extend Keboola with arbitrary Docker images](/extend/component/).
	- Build your own [extractors](/extend/generic-extractor/) for services we do not support yet.
- [**Automate your processes**](/automate/) to run any component in specified intervals or at specified times of the day.
	- Control any component of the Keboola [programmatically](/integrate/jobs/) (for example, you can trigger data load when something happens in your system).

## Development Project
If you are a **3rd party developer** working with Keboola, chances are that you do not have an access to
a project in Keboola. It is not strictly necessary to have a Keboola project, but it certainly helps because you can test your code in action.

You can apply for a development project with the following features:

- 3.5GB storage space
- Snowflake backend
- 10 users
- 3 orchestrations

Under the following conditions:

- You do not belong to a company which already has a project in Keboola.
- You will use the project fairly (not abuse it or use it for production).
- You will remain active in the development.

Note that once you [register](/extend/component/tutorial/#before-you-start) (and join a vendor) in
our [Developer portal](https://components.keboola.com/), you will gain access to a development project.
If you don't have it, or need a development project for other reasons,
[send us an email](mailto:support@keboola.com). Not into creative writing? Feel free to use our template:

	Hello,
	I'm *XY* (from the *YZ* company) and I'd like to develop an *extractor|writer|application* for Keboola.
	My component will do *some really awesome things*.
