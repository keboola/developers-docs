---
title: Automated build
permalink: /extend/docker/tutorial/automated-build/
---

An important part of docker ecosystem is *docker registry*. A docker registry acts as a directory of images, plus
it takes care of storing and building the images. The most official docker registry is 
[Docker Hub](https://hub.docker.com/). There are also alternative registries, such as 
[Quay](https://quay.io/), there may also be completely private registries.

We support both Docker Hub and Quay registries, on both registries we support both
public and private images. Other registries are not yet supported. 

## Working with a registry
When you want to run some image, you first need to *pull* (`docker pull`) that image to your machine. Docker run 
command does that automatically for you, so when you do:

    docker run -i quay.io/keboola/base-php70
    
You will see something like:

    Unable to find image 'quay.io/keboola/base-php70:latest' locally
    latest: Pulling from keboola/base-php70 
    a3ed95caeb02: Pull complete

When you build an image locally, you can *push* (`docker push`) it to the docker registry, then the
image can be shared with anyone (if public) or with your organization (if private). 

Because the image is defined only by the Dockerfile instructions (and optionaly *build context*), you can take 
a shortcut and give the registry only the Dockerfile. The registry will then build the image on it's own
infrastructure. This is best done by setting up an automated build which links a git repository 
containing the Dockerfile (and usualy the application code) with the registry. 


## Setting up a Repository on Quay
This may get sligtly confusing, because we will create a new *Image Repository* and link
that to an existing *Github Repository*. You can use the 
[sample repository](https://github.com/keboola/docs-docker-example-basic) 
created in [tutorial](/extend/docker/tutorial/howto/).

Create account and organization, and then *Create New Repository*:

![Create Repository](/extend/docker/tutorial/quay-intro.png)

In repository configuration, select to link to Github repository: 

![Repository configuration](/extend/docker/tutorial/quay-new-repository.png)

Then link the image repository to github repository
(you can also use our sample repository 
[https://github.com/keboola/docs-docker-example-basic](https://github.com/keboola/docs-docker-example-basic):
 
![Link repositories](/extend/docker/tutorial/quay-link-repository.png)

Then configure the build trigger. The easiest is to set the trigger to `All Branches and Tags` which 
will trigger image rebuild on every commit to the respository. A more solid approach is 
to set the build trigger only to a specified branch e.g `heads/master`:
  
![Configure build trigger for branch](/extend/docker/tutorial/quay-build-trigger-master.png)

Alterantive option is to configure the trigger to a specific tag. If you are using 
Semantic versioning, the you can user regular expresssion `^tags/[0-9]+\.[0-9]+\.[0-9]+$`.
In that case an image will be rebuild only when you create a new tag.
 
![Configure build trigger for tag](/extend/docker/tutorial/quay-build-trigger-tag.png)

Regardless of which aproache you tak, you can then finish seting up the trigger by completeing the wizard:

![Configure build trigger](/extend/docker/tutorial/quay-build-trigger.png)

Pushing a new commit or creating a new tag (depedning on the trigger setting) into the git repository will now
trigger build of the docker image. Also note that the image will automatically inherit the git repository tag 
or branch name. So when you push a commit to `master` branch, you'll get image with tag master (which will
move away from any older image builds). When you create a tag `1.0.0`, you'll get an image with tag `1.0.0`.

