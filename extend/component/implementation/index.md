---
title: Implementation
permalink: /extend/component/implementation/
redirect_from:
    - /extend/docker/images/
---

* TOC
{:toc}

In this article some good practices in developing the component code are described. If you aim to publish
your component, we strongly suggest that you follow these. Here are some best practices which should be
followed across all components. We also recommend that you check our [component templates](https://github.com/keboola/component-generator).

## Docker
You may use any docker image, you see fit. We recommend to base your images on the [official library](https://hub.docker.com/explore/)
as that is the most stable.

We publicly provide the images for transformations and sandboxes.
The images for *Sandboxes* and *Transformations* both share the same common ancestor image *Custom* with a couple
of pre-installed packages (that saves a lot of time when building the image yourself).
This means that the images for R and Python share the same common code base and always use the
exact same version of R and Python respectively.

Ancestor images:

- docker-custom-r:
[Quay](https://quay.io/repository/keboola/docker-custom-r),
[Dockerfile](https://github.com/keboola/docker-custom-r) --
Custom R Image
- docker-custom-python:
[Quay](https://quay.io/repository/keboola/docker-custom-python),
[Dockerfile](https://github.com/keboola/docker-custom-python) --
Custom Python Image

Transformations:

- python-transformation:
[Quay](https://quay.io/repository/keboola/python-transformation),
[Dockerfile](https://github.com/keboola/python-transformation) --
Image for Python transformations
- r-transformation:
[Quay](https://quay.io/repository/keboola/r-transformation),
[Dockerfile](https://github.com/keboola/r-transformation) --
Image for R transformations

Sandboxes:

- docker-jupyter:
[Quay](https://quay.io/repository/keboola/docker-jupyter),
[Dockerfile](https://github.com/keboola/docker-jupyter) --
Image for Python Jupyter Sandbox
- docker-rstudio:
[Quay](https://quay.io/repository/keboola/docker-rstudio),
[Dockerfile](https://github.com/keboola/docker-rstudio) --
Image for RStudio Sandbox

All of the repositories use [Semantic versioning](http://semver.org/) tags. These are always fixed to a specific image build.
Additionally the `latest` tag is available and it always points to the latest tagged build. That means that the `latest` tag
can be used safely (though it refers to different versions over time).

## Memory
KBC [Components](/extend/component/) can be used to process substantial amounts of data (i.e., dozens of Gigabytes) which are not
going to fit into memory. Every component should therefore be written so that it processes data in chunks of
a limited size (typically rows of a table). Many of the KBC components run with less then 100MB memory limit.
While the KBC platform is capable of running jobs with ~8GB of memory without problems, we are not particularly
happy to allow it and we certainly don't want to allow components where the amount of used memory
depends on the size of the processed data.

## Error Handling
Depending on the component [exit code](/extend/common-interface/environment/#return-values), the component job is marked as
successful or failed.

- `exit code = 0`  The job is considered successful.
- `exit code = 1`  The job fails with a *User error*.
- `exit code > 1`  The job fails with an *Application error*.

During execution of the component, all the output sent to STDOUT is captured and sent live to Job Events.
The output to [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29) is captured too and
in case of the job is successful or fails with User error it is displayed as the last event of the job. In case the
job ends with application error, the entire contents of STDERR is hidden from the end-user and sent only to
vendor internal logs. The end-user will see only a canned response ('An application error occurred') with
the option to contact support.

This means that you do not have to worry about the internals of your component leaking to the end-user provided that
the component exit code is correct. On the other hand, the user error is supposed to be solvable by the end user, therefore:

- Avoid messages which make no sense at all. For example, 'Banana Error: Exceeding trifling witling' or only numeric errors.
- Avoid leaking sensitive information (such as credentials, tokens).
- Avoid errors which the user cannot solve. For example, 'An outdated OpenSSL library, update to OpenSSL 1.0.2'.
- Provide guidance on what the user should do. For example, 'The input table is missing; make sure the output mapping destination is set to `items.csv`'.

Also keep in mind that the output of the components (Job events) serve to pass only informational and error messages; **no data** can be passed through.
The event message size is limited (about 64KB). If the limit is exceeded, the message will be trimmed. If the component produces
obscene amount (dozens of MBs) of output in very short time, it may be terminated with internal error.
Also make sure your component does not use any [output buffering](#langauge-specific-notes), otherwise all events will be cached after the application finishes.
