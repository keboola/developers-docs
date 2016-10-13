---
title: Common Interface
permalink: /extend/common-interface/
---

To exchange data between your extension and Keboola Connection (KBC), use

* a predefined set of input and output [folders](/extend/common-interface/folders) for tables and files,
* a [configuration file](/extend/common-interface/config-file/),
* [environment](/extend/common-interface/environment/) variables and return values.

Optionally, you can use

* [logging](/extend/common-interface/logging),
* [manifest files](/extend/common-interface/manifest-files/) for working with table and file meta-data,
* the [OAuth](/extend/common-interface/oauth/) part of the configuration file, and
* [actions](/extend/common-interface/actions/) for quick synchronous tasks. 

In addition to that, [Docker Runner](/overview/docker-bundle/) provides tools for
[encryption](/overview/encryption) and [OAuth2 authorization](/extend/common-interface/oauth/).

### Extension Limits

Even though you can define your own limits for your extension, all extensions are also subject to the following service limits:
 
* Both memory and swap sizes are set to an equal value
* Docker [devicemapper](https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/) size is set to 10 GB

The size allocated for devicemapper is consumed by memory swapping, /tmp and all other operations in the extension 
(for instance, ad hoc module installations); only input and output folders are excluded. 
As the swap size cannot be larger than the allocated disk space, we cannot safely increase the memory limit over 8 GB. 

If you need more than 8 GB of memory/swap or larger disk space, get in touch with us to discuss possible solutions. 
