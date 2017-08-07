---
title: Automated Build
permalink: /extend/docker/tutorial/automated-build/
---

* TOC
{:toc}

An important part of the Docker ecosystem is a **Docker registry**. It acts as a folder of images, taking
care of their storing and building.
[Docker Hub](https://hub.docker.com/) is the official Docker registry.
There are also alternative registries, such as [Quay](https://quay.io/), or completely private registries
such as [AWS ECR](https://aws.amazon.com/ecr/) where we are keen to host your images for you.

We support public and private images on both Docker Hub and Quay registries, as well as private images on AWS ECR.
Other registries are not yet supported.

For reliability reasons, we strongly recommend to use the [**AWS ECR**](#setting-up-a-repository-on-aws-ecr)
provisioned by the **Keboola Developer Portal**.

## Working with a Registry
In order to run an image, **pull** (`docker pull`) that image to your machine. The `docker run`
command does that automatically for you. So, when you do:

    docker run -i quay.io/keboola/base-php70

you will see something like this:

    Unable to find image 'quay.io/keboola/base-php70:latest' locally
    latest: Pulling from keboola/base-php70
    a3ed95caeb02: Pull complete

When you build an image locally, **push** (`docker push`) it to the Docker registry. Then the
image can be shared with anyone (if public), or with your organization (if private).

Because the image is defined only by the Dockerfile instructions (and optionally *build context*), you can take
a shortcut and give the registry only the Dockerfile. The registry will then build the image on its own
infrastructure. This is best done by setting up an automated build which links a git repository
containing the Dockerfile (and usually the application code) with the registry.

## Setting up a Repository on Quay
This may get slightly confusing because we will create a new *Image Repository* and link
that to an existing *Github Repository*. Use the
[sample repository](https://github.com/keboola/docs-docker-example-basic)
created in our [tutorial](/extend/docker/tutorial/howto/).

Create an account and organization, and then *Create a New Repository*:

{: .image-popup}
![Create Repository](/extend/docker/tutorial/quay-intro.png)

In the repository configuration, select *Link to a Github Repository Push*:

{: .image-popup}
![Repository configuration](/extend/docker/tutorial/quay-new-repository.png)

Then link the image repository to a Github repository
(you can use our [sample repository](https://github.com/keboola/docs-docker-example-basic)):

{: .image-popup}
![Link repositories](/extend/docker/tutorial/quay-link-repository.png)

After that, configure the build trigger. The easiest way to do that is setting the trigger to `All Branches and Tags`.
It will trigger an image rebuild on every commit to the repository.
You can also set the build trigger only to a specific branch, for example, `heads/master`:

{: .image-popup}
![Configure build trigger for branch](/extend/docker/tutorial/quay-build-trigger-master.png)

An alternative option is to configure the trigger to a specific tag. For Semantic versioning,
the following regular expression `^tags/[0-9]+\.[0-9]+\.[0-9]+$` ensures the image is rebuilt only when you create a new tag.

{: .image-popup}
![Configure build trigger for tag](/extend/docker/tutorial/quay-build-trigger-tag.png)

Regardless of your chosen approach, finish setting up the trigger by completing the wizard:

{: .image-popup}
![Configure build trigger](/extend/docker/tutorial/quay-build-trigger.png)

Pushing a new commit into a git repository or creating a new tag (depending on the trigger setting) will now
trigger a new build of the Docker Image. Also note that the image automatically inherits the git repository tag
or branch name. So, when you push a commit to the `master` branch, you will get an image with a tag master (which will
move away from any older image builds). When creating a `1.0.0` tag, you will get an image with a `1.0.0` tag.

## Setting up a Repository on AWS ECR

If you do not have a Keboola Developer Portal account yet, head to the [API documentation](http://docs.kebooladeveloperportal.apiary.io/#),
create a new account and register your vendor.

The [Get credentials to ECR repository API call](http://docs.kebooladeveloperportal.apiary.io/#reference/0/apps/get-credentials-to-ecr-repository)
will create a repository and temporary credentials to log into AWS ECR registry and to upload your Docker image.

If you want to integrate this process in a CI tool like Travis or CircleCI, do not use your Keboola Developer Portal
 credentials to log in. For this case the [Generate credentials for a service account API call](http://docs.kebooladeveloperportal.apiary.io/#reference/0/vendors/generate-credentials-for-service-account)
 will create a service user whose credentials are safe to share with Travis or the CI tool of your choice.

### Sample Integration with Travis CI
Generate the service username and password using [Generate credentials for service account API call](http://docs.kebooladeveloperportal.apiary.io/#reference/0/vendors/generate-credentials-for-service-account)
and save these to environment variables:

 - `KBC_DEVELOPERPORTAL_USERNAME` with the login
 - `KBC_DEVELOPERPORTAL_PASSWORD` with the password
 - `KBC_DEVELOPERPORTAL_URL` with the string `https://apps.keboola.com`
 - `KBC_DEVELOPERPORTAL_VENDOR` with the vendor of the app
 - `KBC_DEVELOPERPORTAL_APP` the appId
 - `KBC_APP_REPOSITORY` the app repository name (ex. `keboola/docker-demo-app`)

{: .image-popup}
![Environment variables in Travis CI](/extend/docker/tutorial/travis-envs.png)

Then simply paste this code in your deploy script:

{% highlight bash %}
# Deploy to repository provided by Keboola Developer Portal
docker pull quay.io/keboola/developer-portal-cli-v2:latest
export REPOSITORY=`docker run --rm  \
    -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL \
    quay.io/keboola/developer-portal-cli-v2:latest ecr:get-repository $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP`
docker tag $KBC_APP_REPOSITORY:latest $REPOSITORY:$TRAVIS_TAG
docker tag $KBC_APP_REPOSITORY:latest $REPOSITORY:latest
eval $(docker run --rm
    -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL \
    quay.io/keboola/developer-portal-cli-v2:latest ecr:get-login $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP)
docker push $REPOSITORY:$TRAVIS_TAG
docker push $REPOSITORY:latest

# Deploy the application to KBC
docker run --rm -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL \
    quay.io/keboola/developer-portal-cli-v2:latest update-app-repository $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP $TRAVIS_TAG

{% endhighlight %}

This code will tag your image with the relevant tags (`latest` and the tag of the build) and push them to our registry.
Finally it will update the application in Developer Portal to use the current tag. This means that the new version of the application is immediately deployed into KBC.

This sample deployment script uses the [Developer Portal CLI](https://github.com/keboola/developer-portal-cli-v2) tool.
The CLI (delivered as a Docker image) provides the deploy script with simple commands to retrieve the repository
and credentials to our AWS ECR registry. The `ecr:get-repository` command returns the repository associated with user in
`KBC_DEVELOPERPORTAL_USERNAME` variable. The `ecr:get-login` command returns a `docker login ...` command to authenticate
to that repository.

#### Run test jobs of your new image against live configurations

Before deploying your new image to the developer portal, you may want to try it out on some 'real' configurations in your project. 
You can do this by adding some environment variables to travis with an appropriate storage token and configurationId  
(It is highly recommended to create a dedicated token for this task)

The commands will need 2 extra environment variables including the ones listed above.

- `KBC_STORAGE_TOKEN` - the storage token that the test(s) will run under
- `KBC_APP_TEST_CONFIG` - the configuration to test.

Note that if you want to run multiple test jobs, simple repeat the command with the different configuration IDs that you'd like to test.

Then simply add the following steps to your `script` section in `.travis.yml` to run the test jobs. 

```yaml
    # push master image to ECR
    - docker pull quay.io/keboola/developer-portal-cli-v2:0.0.1
    - export REPOSITORY=`docker run --rm -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL quay.io/keboola/developer-portal-cli-v2:latest ecr:get-repository $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP`
    - docker tag $KBC_APP_REPOSITORY:latest $REPOSITORY:master
    - eval $(docker run --rm -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL quay.io/keboola/developer-portal-cli-v2:latest ecr:get-login $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP)
    - docker push $REPOSITORY:master
    # Run live test job on new master image
    # env requires: KBC_STORAGE_TOKEN and KBC_APP_TEST_CONFIG (a token to a test project where the app has a configuration)
    - docker pull quay.io/keboola/syrup-cli:latest
    - docker run --rm -e KBC_STORAGE_TOKEN quay.io/keboola/syrup-cli:latest run-job $KBC_DEVELOPERPORTAL_APP $KBC_APP_TEST_CONFIG master
```

This commands above do as follows:
* Pull the developer portal cli client [Developer Portal CLI](https://github.com/keboola/developer-portal-cli-v2)
* Gets the application's KBC repository url from the developer portal
* Tags the image as master
* Pushes the image to repository
* Pulls the job runner cli client [Syrup PHP CLI](https://github.com/keboola/syrup-php-cli)
* Runs the specified test job on KBC using the /{component}/{config}/run/tag/{tag} [Keboola Docker API](api http://docs.kebooladocker.apiary.io/#reference/run/create-a-job-with-image/run-job)

You can see both [`.travis.yml`](https://github.com/keboola/docker-demo-app/blob/master/.travis.yml) and the deploy script ([`deploy.sh`](https://github.com/keboola/docker-demo-app/blob/master/deploy.sh))
in our [Docker Demo App](https://github.com/keboola/docker-demo-app) GitHub repository.

