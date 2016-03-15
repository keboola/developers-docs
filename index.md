---
title: Keboola Connection Developers Documentation
permalink: /
---

This site is aimed for developers who are working with Keboola Connection programatically. For end-users, there
is a separate documentation at [help.keboola.com](https://help.keboola.com)  

Keboola Connection (KBC) is extremly open system. Everything you can do in the KBC UI can be done 
programatically using the API of the corresponding component. All of our components have API 
documentation on [Apiary](http://docs.keboola.apiary.io/) and most of them have a 
public [Github repository](https://github.com/keboola/).
Our docker components are built either on [DockerHub](https://github.com/keboola/) 
or [Quay](https://quay.io/organization/keboola).

This means that there are virtually endless posibilities of what can be done with KBC programatically:
- you may use it just to exchange data (using the Storage API)
- you can control any component of connection programatically (e.g. you can trigger data load when something happens in your system)
- you may use any component separately (e.g. you can use it to convert files to TDE and upload them to Tableau Server)
- you may use any special functionality build in any compoentn (e.g. use GoodData writer for SSO and user management)  
- you can control whole connection processes within KBC from the outside
- you can build your own extractors for services we do not support yet
- you can [extend KBC with code R and Python snipets](/extend/custom-science/) stored in a git repository
- you can [extend KBC with arbitrary Docker images](/extend/docker/)
