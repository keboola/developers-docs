---
title: Keboola Connection Developers Documentation
permalink: /
---

This site is aimed for developers who are working with Keboola Connection programmatically. For end-users, there
is a separate documentation at [help.keboola.com](https://help.keboola.com).  

## Building for Keboola Connection
Keboola Connection (KBC) is an open system and we welcome developers to [build their own extensions](/extend/), whether for 
their own use or to be offered to other KBC users and customers. Applications for KBC are run in [Docker](/extend/). The main types of 
extensions one can build are:

- *Extractors* to allow customers to get data from new sources
- *Writers* to push data into new systems and consumption methods
- *Applications* that further enrich the data or add value in new ways

![Overview of KBC Components](/kbc-structure.png)

By building extensions for KBC, you get an easy access to data from many sources, and a simple path to 
deliver the data back to your customers. Your application or algorithm suddenly becomes available to all 
existing Keboola Connection subscribers and implementation partners, allowing you to focus only on 
areas of your product where you are adding value. And we take care of the billing, too. To become a 
Keboola Development Partner, [get in touch](http://www.keboola.com/contact/) - we want to hear 
what you would like to build!

## Where to Start
Keboola Connection (KBC) is an extremely open system. Everything you can do in the KBC UI can be done 
programatically using the API of the corresponding component. All of our components have API 
documentation on [Apiary](http://docs.keboola.apiary.io/) and most of them have a 
public [Github repository](https://github.com/keboola/).
Our Docker components are built either on [DockerHub](https://github.com/keboola/) 
or [Quay](https://quay.io/organization/keboola).

This means that there are virtually endless possibilities of what can be done with KBC programmatically. For instance, you can:


- [Extend KBC with code R and Python snipets](/extend/custom-science/) stored in a git repository
- [Extend KBC with arbitrary Docker images](/extend/docker/)
- Use it just to exchange data (using the Storage API)
- Use KBC as a data-handling backbone for your product
- Control any component of connection programmatically (for example, you can trigger data load when something happens in your system)
- Use any component separately (you can use it to convert files to TDE and upload them to Tableau Server, to give an instance)
- Use any special functionality build in any component (for example, use GoodData writer for SSO and user management)  
- Control whole connection processes within KBC from the outside
- Build your own extractors for services we do not support yet
- Wrap KBC in your own UI for your customers

And much more...
