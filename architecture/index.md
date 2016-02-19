---
title: Architecture
permalink: /architecture/
---

Keboola Connection (KBC) is a system composed of many components orchestrated together through (mostly REST) APIs. Everything you can do in the KBC UI can be done programatically using the API of the corresponding component. Although the whole system is quite complex, it is modular and therefore you rarely need to work with more then few components. All of our components have API documentation on [Apiary] and most of them have a public [github repository]().  Our docker components are built either on [DockerHub] or [Quay]. 