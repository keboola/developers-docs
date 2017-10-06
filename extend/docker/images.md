---
title: Keboola Images
permalink: /extend/docker/images/
---

In Keboola, we use
[Docker Hub](https://hub.docker.com/r/keboola/),
[Quay](https://quay.io/organization/keboola) and [AWS ECR](https://aws.amazon.com/ecr/) registries to store Docker images.
In Docker Hub and Quay registries, our account is called *Keboola*.
Some images are present in all registries.
As long as the same tags are used, they refer to the exact same build and are freely interchangeable.
In that case, you should use the one in the same registry as your image.

The images for *Sandboxes* and *Transformations* are based on images for *Custom Science Extensions*.
This means that all images for R and Python share the same common code base and
always use the exact same version of R and Python respectively.

Custom Science Extensions:

- docker-custom-r:
[Quay](https://quay.io/repository/keboola/docker-custom-r),
[Dockerfile](https://github.com/keboola/docker-custom-r) --
Image for Custom Science R.
- docker-custom-python:
[Quay](https://quay.io/repository/keboola/docker-custom-python),
[Dockerfile](https://github.com/keboola/docker-custom-python) --
Image for Custom Science Python 3.x.
- docker-custom-python2:
[Quay](https://quay.io/repository/keboola/docker-custom-python2),
[Dockerfile](https://github.com/keboola/docker-custom-python2) --
Image for Custom Science Python 2.x.

Transformations:

- python-transformation:
[Quay](https://quay.io/repository/keboola/python-transformation),
[Dockerfile](https://github.com/keboola/python-transformation) --
Image for Python transformations.
- r-transformation:
[Quay](https://quay.io/repository/keboola/r-transformation),
[Dockerfile](https://github.com/keboola/r-transformation) --
Image for R transformations.

Sandboxes:

- docker-jupyter:
[Quay](https://quay.io/repository/keboola/docker-jupyter),
[Dockerfile](https://github.com/keboola/docker-jupyter) --
Image for Python Jupyter Sandbox.
- docker-rstudio:
[Quay](https://quay.io/repository/keboola/docker-rstudio),
[Dockerfile](https://github.com/keboola/docker-rstudio) --
Image for RStudio Sandbox.

All of the repositories use [Semantic versioning](http://semver.org/) tags. These are always fixed to a specific image build.
Additionally the `latest` tag is available and it always points to the latest tagged build. That means that the `latest` tag
and can be used safely (though it refers to different versions over time).
