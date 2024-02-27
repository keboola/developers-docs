---
title: Docker Registry
permalink: /extend/component/docker-tutorial/registry/
redirect_from:
    - /extend/docker/tutorial/automated-build/
    - /extend/docker/tutorial/registry/
---

* TOC
{:toc}

An important part of the Docker ecosystem is a **Docker registry**. It acts as a folder of images, taking
care of their storing and building.
[Docker Hub](https://hub.docker.com/) is the official Docker registry.

For reliability reasons, we strongly recommend to use the [Amazon AWS ECR](https://aws.amazon.com/ecr/)
[provisioned by the **Keboola Developer Portal**](/extend/component/deployment/).
We also support Docker Hub and [Quay](https://quay.io/), both public and private repositories.

## Working with Registry
In order to run an image, **pull** (`docker pull`) the image to your machine. The `docker run`
command does that automatically for you. So, when you do:

    docker run -i quay.io/keboola/docker-custom-php

you will see something like this:

    Unable to find image 'quay.io/keboola/docker-custom-php:latest' locally
    latest: Pulling from keboola/docker-custom-php
    ad74af05f5a2: Pull complete
    8fa9669af8ec: Pull complete
    Digest: sha256:ff21e0f0e58614aa5d8104d9f263552e583e6ddeb6215e83cae181d5169a150a
    Status: Downloaded newer image for quay.io/keboola/docker-custom-php:latest
    Interactive shell

When you build an image locally, **push** (`docker push`) it to the Docker registry. Then the
image can be shared with anyone (if public), or with your organization (if private).

Because the image is defined only by the Dockerfile instructions (and optionally **build context**), you can take
a shortcut and give the registry only the Dockerfile. The registry will then build the image on its own
infrastructure. This is best done by setting up an [automated deploy script](/extend/component/deployment/) or
by linking a git repository containing the Dockerfile (and usually the application code) with the registry.

## Setting Up Repository on Quay
This may get slightly confusing because we will create a new **Image Repository** and link
that to an existing **Github Repository**. Use the
[sample repository](https://github.com/keboola/docs-docker-example-basic)
created in our [tutorial](/extend/component/docker-tutorial/howto/).

Create an account and organization, and then **create a new repository**:

{: .image-popup}
![Create Repository](/extend/component/docker-tutorial/quay-intro.png)

In the repository configuration, select **Link to a Github Repository Push**:

{: .image-popup}
![Repository configuration](/extend/component/docker-tutorial/quay-new-repository.png)

Then link the image repository to a Github repository. You can use
our [sample repository](https://github.com/keboola/docs-docker-example-basic):

{: .image-popup}
![Link repositories](/extend/component/docker-tutorial/quay-link-repository.png)

After that, configure the build trigger. The easiest way to do that is setting the trigger to
`All Branches and Tags`.
It will trigger an image rebuild on every commit to the repository.
You can also set the build trigger only to a specific branch, for example, `head/master`:

{: .image-popup}
![Configure build trigger for branch](/extend/component/docker-tutorial/quay-build-trigger-master.png)

An alternative option is to configure the trigger to a specific tag. For Semantic versioning,
the following regular expression `^tags/[0-9]+\.[0-9]+\.[0-9]+$` ensures the image is rebuilt only
when you create a new tag.

{: .image-popup}
![Configure build trigger for tag](/extend/component/docker-tutorial/quay-build-trigger-tag.png)

Regardless of your chosen approach, finish setting up the trigger by completing the wizard:

{: .image-popup}
![Configure build trigger](/extend/component/docker-tutorial/quay-build-trigger.png)

Pushing a new commit into a git repository or creating a new tag (depending on the trigger setting) will now
trigger a new build of the Docker image. Also note that the image automatically inherits the git repository tag
or branch name. So, when you push a commit to the `master` branch, you will get an image with a tag `master` (which
will move away from any older image builds). When creating a `1.0.0` tag, you will get an image with a `1.0.0` tag.

When using images in Keboola, we **highly recommend to use our [ECR repository](/extend/component/deployment/)**.
