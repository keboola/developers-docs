---
title: Keboola Base Images
permalink: /extend/docker/images/
---

Keboola Base Images are Docker images which serve as a base for applications written in a specific langauge. 
The Keboola base images have no entrypoint and they do not contain any application logic.
We highly encourage you to use those unless you have some special requirements.

In Keboola, we use both [Docker Hub](https://hub.docker.com/) and [Quay](https://quay.io/) registry, 
in both registries we have the account *Keboola*. So our images are either: `keboola/base` or `quay.io/keboola/base` 
Some images are present on both registries and as long as the same tag is used, they refer to exact same build and 
are freely interchangeable. In that case, you should use the one in same registry as your image. 

* Keboola base - centos 7
* Keboola base PHP 6
 
