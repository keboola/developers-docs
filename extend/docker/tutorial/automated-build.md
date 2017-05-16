---
title: Automated Build
permalink: /extend/docker/tutorial/automated-build/
---

* TOC
{:toc}

An important part of the Docker ecosystem is a *Docker registry*. A Docker registry acts as a folder of images; 
it takes care of storing and building images as well.
[Docker Hub](https://hub.docker.com/) is the official Docker registry. 
There are also alternative registries, such as [Quay](https://quay.io/), or completely private registries 
such as [AWS ECR](https://aws.amazon.com/ecr/) where we are keen to host your images for you.

We support public and private images on both Docker Hub and Quay registries, and private images on AWS ECR. Other registries are not yet supported. 

From now on we strongly recommend to use **AWS ECR** provisioned by **Keboola Developer Portal**.

## Working with a Registry
In order to run an image, *pull* (`docker pull`) that image to your machine. The `docker run` 
command does that automatically for you. So, when you do:

    docker run -i quay.io/keboola/base-php70
    
you will see something like this:

    Unable to find image 'quay.io/keboola/base-php70:latest' locally
    latest: Pulling from keboola/base-php70 
    a3ed95caeb02: Pull complete

When you build an image locally, *push* (`docker push`) it to the Docker registry. Then the
image can be shared with anyone (if public) or with your organization (if private). 

Because the image is defined only by the Dockerfile instructions (and optionally *build context*), you can take 
a shortcut and give the registry only the Dockerfile. The registry will then build the image on its own
infrastructure. This is best done by setting up an automated build which links a git repository 
containing the Dockerfile (and usually the application code) with the registry. 

## Setting up a Repository on AWS ECR

If you do not have a Keboola Developer Portal account yet, head to the [API documentation](http://docs.kebooladeveloperportal.apiary.io/#)
 and create a new account and register your vendor.
 
The [Get credentials to ECR repository API call](http://docs.kebooladeveloperportal.apiary.io/#reference/0/apps/get-credentials-to-ecr-repository)
will create a repository and temporary credentials to log into AWS ECR registry and to upload your image. 

If you want to integrate this process in a CI tool like Travis or CircleCI, you certainly do not want to use your Keboola Developer Portal 
 credentials to log in. For this case the [Generate credentials for service account](http://docs.kebooladeveloperportal.apiary.io/#reference/0/vendors/generate-credentials-for-service-account)
 API call will create a service user which credentials are safe to share with Travis or the CI tool of your choice.
 
### Sample integration with Travis CI

We have created the [Developer Portal CLI](https://github.com/keboola/developer-portal-cli-v2) tool to assist you with the integration. 
The CLI (delivered as a Docker image) will provide you with commands to retrieve the repository and credentials to our AWS ECR registry. 
You can then use these to log in and push your image. 

The Developer Portal CLI tool requires these ENV variables

 - KBC_DEVELOPERPORTAL_USERNAME
 - KBC_DEVELOPERPORTAL_PASSWORD
 - KBC_DEVELOPERPORTAL_URL
 
Generate the username and password using [Generate credentials for service account API call](http://docs.kebooladeveloperportal.apiary.io/#reference/0/vendors/generate-credentials-for-service-account) 
 and set the `KBC_DEVELOPERPORTAL_URL` variable to `https://apps.keboola.com`. Insert these environment variables in the settings of your repository in Travis.

{: .image-popup}
![Environment variables in Travis CI](/extend/docker/tutorial/travis-envs.png)

Then simply paste this code in your deploy script:

    docker pull quay.io/keboola/developer-portal-cli-v2:latest
    export REPOSITORY=`docker run --rm  -e KBC_DEVELOPERPORTAL_USERNAME=$KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD=$KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL=$KBC_DEVELOPERPORTAL_URL quay.io/keboola/developer-portal-cli-v2:latest ecr:get-repository keboola docker-demo`
    docker tag keboola/docker-demo-app:latest $REPOSITORY:$TRAVIS_TAG
    docker tag keboola/docker-demo-app:latest $REPOSITORY:latest
    eval $(docker run --rm -e KBC_DEVELOPERPORTAL_USERNAME=$KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD=$KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL=$KBC_DEVELOPERPORTAL_URL quay.io/keboola/developer-portal-cli-v2:latest ecr:get-login keboola docker-demo)
    docker push $REPOSITORY:$TRAVIS_TAG
    docker push $REPOSITORY:latest

This code will tag your image with relevant tags (`latest` and the tag of the build) and push them to our registry. 

You can see both [`.travis.yml`](https://github.com/keboola/docker-demo-app/blob/master/.travis.yml) and the deploy script ([`deploy.sh`](https://github.com/keboola/docker-demo-app/blob/master/deploy.sh)) 
in our [Docker Demo App](https://github.com/keboola/docker-demo-app) GitHub repository.

Please note, that pushing the image to the registry does not update the tag in your application configuration. You have 
to manually update the application configuration using the [Keboola Developer Portal API](http://docs.kebooladeveloperportal.apiary.io/).



Contact us at [support@keboola.com](mailto:support@keboola.com) if you have any questions.
