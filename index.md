---
title: Keboola Connection Developers Documentation
permalink: /
---

This site is aimed for developers who are working with Keboola Connection programatically. For end-users, there
is a separate documentation at [help.keboola.com](https://help.keboola.com)  

## Building for Keboola Connection
Keboola Connection (KBC) is an open system and we welcome developers to [build their own extensions](/extend/), whether for 
their own use or to offer other KBC users and customers. Apps for KBC are run in [Docker](/extend/). The main types of 
extensions one can build are:

- *Extractors* to allow customers to get data from new sources
- *Writers* to push data into new systems and consumption methods
- *Applications* that further enrich the data or add value in new ways

![Overview of KBC Components](/kbc-structure.png)

By building extensions for KBC, you get easy access to data from many sources, and simple path to 
deliver the data back to your customers. Your app or algorithm suddenly becomes available to all 
existing Keboola Connection subscribers and implementation partners, allowing you to focus only on 
areas of your product where you are adding value. And we take care of the billing, too. To become a 
Keboola Development Partner, [get in touch](http://www.keboola.com/contact/) - we want to hear 
what you'd like to build!

## Where to start
Keboola Connection (KBC) is extremly open system. Everything you can do in the KBC UI can be done 
programatically using the API of the corresponding component. All of our components have API 
documentation on [Apiary](http://docs.keboola.apiary.io/) and most of them have a 
public [Github repository](https://github.com/keboola/).
Our docker components are built either on [DockerHub](https://github.com/keboola/) 
or [Quay](https://quay.io/organization/keboola).

This means that there are virtually endless posibilities of what can be done with KBC programatically:

{% comment %} Sem prubezne doplnovat odkazy {% endcomment %}
- you can [extend KBC with code R and Python snipets](/extend/custom-science/) stored in a git repository
- you can [extend KBC with arbitrary Docker images](/extend/docker/)
- you may use it just to exchange data (using the Storage API)
- you can use KBC as a data-handling backbone for your product
- you can control any component of connection programatically (e.g. you can trigger data load when something happens in your system)
- you may use any component separately (e.g. you can use it to convert files to TDE and upload them to Tableau Server)
- you may use any special functionality build in any component (e.g. use GoodData writer for SSO and user management)  
- you can control whole connection processes within KBC from the outside
- you can build your own extractors for services we do not support yet
- you can wrap KBC in your own UI for your customers

and much more...
