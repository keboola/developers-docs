---
title: Keboola Connection Developers Documentation
permalink: /
showLinkToGithubPage: false
---

This documentation site is aimed for developers who are working with Keboola Connection (KBC) programmatically. 
For end-users, there is a separate documentation ready at [help.keboola.com](https://help.keboola.com/).

* TOC
{:toc}

### What KBC Is
Cloud based, extremely open and extendable, KBC is the ideal environment for working with your data, be it loading from various sources, 
manipulating, enriching, or finally, pushing the data to new systems and consumption methods. 

The KBC system consists of many independent and loosely connected [**components**](/overview/), 
such as Extractors, Storage or Writers, that are orchestrated together through (mostly REST) APIs.

### Where to Start
In this documentation, we will show you how to  

{% comment %} Sem prubezne doplnovat odkazy {% endcomment %}
- [**Integrate KBC with other systems**](/integrate/).
	- Use KBC just to exchange data (using the Storage API).	
	- Use KBC as a data-handling backbone for your product.
	- Wrap KBC in your own UI for your customers.
	- Control whole connection processes within KBC from the outside.
- [**Extend KBC by building your own components**](/extend/) for your own use or for other KBC users and customers.
	- [Extend KBC with code R and Python snippets](/extend/custom-science/) stored in a git repository.
	- [Extend KBC with arbitrary Docker images](/extend/docker/).
	- Build your own extractors for services we do not support yet.
- [**Automate your processes**](/automate/) to run any component in specified intervals or at specified times of the day.
	- Control any component of the KBC connection programmatically (for example, you can trigger data load 
	when something happens in your system).

However, that is not everything KBC can be used for. It also enables you to  

- Use any component separately (you can use it to convert files to TDE and upload them to Tableau Server, to give an instance).
- Use any special functionality build in any component (for example, use GoodData writer for SSO and user management).
- Experiment and do something completely out of the box.

## Development Project
If you are a **3rd party developer** working with KBC, chances are that you do not have an access to
a project in KBC. It is not strictly necessary to have a KBC project, but it certainly helps because you can test your code in action. 

You can apply for a development project with the following features:

- 3.5GB storage space
- Snowflake backend
- 10 users
- 3 orchestrations
- Possibility to create a demo development project in GoodData with 0.5GB storage and 10 users (expires in 1 month)
 
Under the following conditions:

- You do not belong to a company which already has a project in KBC.
- You will use the project fairly (not abuse it or use it for production).
- You will write an email to devel@keboola.com.
- You will remain active in the development.

If you wish to apply for a KBC development project, [send us an email](mailto:support@keboola.com). 
Not into creative writing? Feel free to use our template:

	Hello,
	I'm *XY* (from the *YZ* company) and I'd like to develop an *extractor|writer|application* for KBC.
	My component will do *some really awesome things*.

