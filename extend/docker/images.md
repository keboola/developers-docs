---
title: Keboola Base Images
permalink: /extend/docker/images/
---

Keboola Base Images are Docker images which serve as a base for applications written in a specific programming language. 
They have no entrypoint and they do not contain any application logic.
We highly encourage you to use those, unless you have some special requirements.

In Keboola, we use both [Docker Hub](https://hub.docker.com/) and [Quay](https://quay.io/) registry. 
In both registries, our account is called *Keboola*, therefore our images are `keboola/base` and `quay.io/keboola/base`, respectively.
Some images are present in both registries.  
As long as the same tag is used, they refer to the exact same build and 
are freely interchangeable. In that case, you should use the one in the same registry as your image. 


## Base images
- [base](https://quay.io/repository/keboola/base), [Dockerfile](https://github.com/keboola/docker-base) - Base image for 
all other images, contains CentOS7, uses tags `master`, `latest`.
- R Language
  - [docker-base-r](https://quay.io/repository/keboola/docker-base-r), [Dockerfile](https://github.com/keboola/docker-base-r) -
Base image for all R images, uses tags `X.Y.Z-a`, see [below](#tags) 
  - [docker-base-r-packages] (https://quay.io/repository/keboola/docker-base-r-packages), 
 [Dockerfile](https://github.com/keboola/docker-base-r-packages) - Base image with installed common 
 R packages installed, uses `X.Y.Z-A` tags , see [below](#tags) 
- Python Language
  - [base-python](https://quay.io/repository/keboola/base-python), [Dockerfile](https://github.com/keboola/docker-base-python) -
 Base image for all Python images, uses `X.Y.Z-a` tags (see [below](#tags))
- PHP Language
  - [docker-base-php56] (https://quay.io/repository/keboola/docker-base-php56), 
 [Dockerfile](https://github.com/keboola/docker-base-php56) - Base image for all PHP 5.6 images, uses `X.Y.Z` tags .
  - [base-php70](https://quay.io/repository/keboola/base-php70), [Dockerfile](https://github.com/keboola/docker-base-php70) -
 Base image for all PHP 7.0 images, uses `master` and `latest` tags 
- Ruby Language
  - [base-ruby](https://quay.io/repository/keboola/base-ruby), [Dockerfile](https://github.com/keboola/docker-base-ruby) -
 Base image for all Ruby images, uses tags `master`, `latest`
 
## Application images
Transformations:

- [python-transformation](https://quay.io/repository/keboola/python-transformation), 
[Dockerfile](https://github.com/keboola/python-transformation) - Image for Python transformations, uses `X.Y.Z` tags.
- [r-transformation](https://quay.io/repository/keboola/r-transformation), 
[Dockerfile](https://github.com/keboola/r-transformation) - Image for R transformations, uses `X.Y.Z` tags 

Custom applications:

- [docker-custom-r](https://quay.io/repository/keboola/docker-custom-r),
[Dockerfile](https://github.com/keboola/docker-custom-r) - Image for Custom Science R, uses `X.Y.Z` tags
- [docker-custom-python](https://quay.io/repository/keboola/docker-custom-python),
[Dockerfile](https://github.com/keboola/docker-custom-python) - Image for Custom Science Python 3.x, uses `X.Y.Z` tags
- [docker-custom-python2](https://quay.io/repository/keboola/docker-custom-python2),
[Dockerfile](https://github.com/keboola/docker-custom-python2)- Image for Custom Science Python 2.x, uses `X.Y.Z` tags

## Tags
We use three types of tags:

- `master`, `latest`: The tag is movable and always points to the latest image build 
- `X.Y.Z`: The tags follow [Semantic versioning](http://semver.org/) and are fixed to a specific image build 
- `X.Y.Z-a`: The `X.Y.Z` tag section refers to a specific environment version and the `a` part refers to our revision. 
For example, the *docker-base-r* image with `3.2.1-k` tag contains R version *3.2.1*. *k* is our revision. Similarly, all other images
with `3.2.1-?` tag contain R version *3.2.1*, though there are minor differences in what and how is installed. Generally
the latest minor revision should be used. 

