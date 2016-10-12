---
title: Common Interface
permalink: /extend/common-interface/
---

To exchange data between your extension and Keboola Connection, use

* a predefined set of input and output [folders](/extend/common-interface/folders) for tables and files,
* a [configuration file](/extend/common-interface/config-file/),
* [environment](/extend/common-interface/environment/) variables and return values,
* optional [logging](/extend/common-interface/logging) option,
* optional [manifest files](/extend/common-interface/manifest-files/) for working with table and file meta-data,
* optional [OAuth](/extend/common-interface/oauth/) part of configuration file, and
* optional [actions](/extend/common-interface/actions/) for quick synchronous tasks.

Additionally, [Docker Runner](/overview/docker-bundle/) provides tools for
[encryption](/overview/encryption) and [OAuth2 authorization](/extend/common-interface/oauth/).

### Extension limits

Even when you can define limits for your extension, all extensions are subject to these service limits:

* both memory and swap sizes are set to equal value
* Docker devicemapper size is set to 10 GB

Size allocated for devicemapper is consumed by memory swapping, /tmp and all other operations in the extension (eg. ad hoc module installations); only input and output folders are excluded. As the swap size cannot be larger than the allocated disk space, we cannot safely increase the memory limit over 8 GB. 

If you need more than 8 GB of memory/swap or larger disk space, get in touch with us to discuss possible solutions. 
