---
title: Keboola Images
permalink: /extend/docker/images/
---

In Keboola, we use both 
[Docker Hub](https://hub.docker.com/r/keboola/) and 
[Quay](https://quay.io/organization/keboola) registry to store docker images. 
In both registries, our account is called *Keboola*. 
Some images are present in both registries. 
As long as the same tag is used, they refer to the exact same build and are freely interchangeable. 
In that case, you should use the one in the same registry as your image. 


## Base images

Unless you have some special requirements, we highly encourage you to use Keboola Base Images as the base for your docker images.
They have no entrypoint and they do not contain any application logic. 
Both of these things are up to you to implement.


- base 
[Quay](https://quay.io/repository/keboola/base), 
[DockeHub](https://hub.docker.com/r/keboola/base/), 
[Dockerfile](https://github.com/keboola/docker-base) -- 
Base image for all other images, contains CentOS7, 
uses `master`, `latest` tags.
- R Language
  - docker-base-r: 
[Quay](https://quay.io/repository/keboola/docker-base-r),
[DockerHub](https://hub.docker.com/r/keboola/docker-base-r/), 
[Dockerfile](https://github.com/keboola/docker-base-r) -
Base image for all R images, 
uses `X.Y.Z-a` tags, see [below](#tags).
  - docker-base-r-packages: 
[Quay](https://quay.io/repository/keboola/docker-base-r-packages), 
[Dockerfile](https://github.com/keboola/docker-base-r-packages) - 
Base image with installed common R packages installed, 
uses `X.Y.Z-A` tags, see [below](#tags). 
- Python Language
  - base-python: 
[Quay](https://quay.io/repository/keboola/base-python), 
[Dockerfile](https://github.com/keboola/docker-base-python) --
Base image for all Python images, 
uses `X.Y.Z-a` tags, see [below](#tags).
- PHP Language
  - docker-base-php55:
[DockerHub](https://hub.docker.com/r/keboola/base-php55/), 
[Dockerfile](https://github.com/keboola/docker-base-php55/) 
  - docker-base-php56: 
[Quay](https://quay.io/repository/keboola/docker-base-php56),
[DockerHub](https://hub.docker.com/r/keboola/base-php56/), 
[Dockerfile](https://github.com/keboola/docker-base-php56) -- 
Base image for all PHP 5.6 images, 
uses `X.Y.Z` tags.
  - base-php70: 
[Quay](https://quay.io/repository/keboola/base-php70),
[DockerHub](https://hub.docker.com/r/keboola/base-php70/), 
[Dockerfile](https://github.com/keboola/docker-base-php70) --
Base image for all PHP 7.0 images, 
uses `master` and `latest` tags. 
- Ruby Language
  - base-ruby:
[Quay](https://quay.io/repository/keboola/base-ruby), 
[Dockerfile](https://github.com/keboola/docker-base-ruby) --
Base image for all Ruby images, 
uses `master`, `latest` tags.
 
## Application images

For inspiration, these are our docker images used in transformations and custom applications. 
Docker extensions use the same [common interface](/extend/common-interface/).

Transformations:

- python-transformation:
[Quay](https://quay.io/repository/keboola/python-transformation), 
[Dockerfile](https://github.com/keboola/python-transformation) -- 
Image for Python transformations, 
uses `X.Y.Z` tags.
- r-transformation:
[Quay](https://quay.io/repository/keboola/r-transformation), 
[Dockerfile](https://github.com/keboola/r-transformation) -- 
Image for R transformations, 
uses `X.Y.Z` tags. 

Custom applications:

- docker-custom-r:
[Quay](https://quay.io/repository/keboola/docker-custom-r),
[Dockerfile](https://github.com/keboola/docker-custom-r) -- 
Image for Custom Science R, 
uses `X.Y.Z` tags.
- docker-custom-python: 
[Quay](https://quay.io/repository/keboola/docker-custom-python),
[Dockerfile](https://github.com/keboola/docker-custom-python) -- 
Image for Custom Science Python 3.x, 
uses `X.Y.Z` tags.
- docker-custom-python2:
[Quay](https://quay.io/repository/keboola/docker-custom-python2),
[Dockerfile](https://github.com/keboola/docker-custom-python2) -- 
Image for Custom Science Python 2.x, 
uses `X.Y.Z` tags.

## Tags
We use three types of tags:

- `master`, `latest`: The tag is movable and always points to the latest image build 
- `X.Y.Z`: The tags follow [Semantic versioning](http://semver.org/) and are fixed to a specific image build 
- `X.Y.Z-a`: The `X.Y.Z` tag section refers to a specific environment version and the `a` part refers to our revision. 
For example, the *docker-base-r* image with `3.2.1-k` tag contains R version *3.2.1*. *k* is our revision. Similarly, all other images
with `3.2.1-?` tag contain R version *3.2.1*, though there are minor differences in what and how is installed. Generally
the latest minor revision should be used. 

