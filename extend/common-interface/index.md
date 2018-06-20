---
title: Common Interface
permalink: /extend/common-interface/
---

To exchange data between your component and Keboola Connection (KBC), use

* a predefined set of input and output [folders](/extend/common-interface/folders) for tables and files,
* a [configuration file](/extend/common-interface/config-file/),
* [environment](/extend/common-interface/environment/) variables and return values.

Optionally, you can use

* [logging](/extend/common-interface/logging),
* [manifest files](/extend/common-interface/manifest-files/) for working with table and file meta-data,
* the [OAuth](/extend/common-interface/oauth/) part of the configuration file, and
* [actions](/extend/common-interface/actions/) for quick synchronous tasks.

In addition to that, [Docker Runner](/extend/docker-runner/) provides tools for
[encryption](/overview/encryption) and [OAuth2 authorization](/extend/common-interface/oauth/).

To quickly get the picture, have a look a [random sample data folder](/extend/data.zip).

### Component Limits
Even though you can define your own limits for your component, all components are also subject to the following service limits:

* Both memory and swap sizes are set to an equal value
* Docker [overlay2](https://docs.docker.com/storage/storagedriver/overlayfs-driver/) size is set to 10 GB

The size allocated for overlay2 is consumed by memory swapping, and all other operations in the component
(for instance, ad hoc module installations); only input and output folders (`/data/`) and `/tmp/` are excluded.
As the swap size cannot be larger than the allocated disk space, we cannot safely increase the memory limit over 8 GB.

If you need more than 8 GB of memory/swap or larger disk space, get in touch with us to discuss possible solutions.
