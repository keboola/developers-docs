---
title: Deployment
permalink: /extend/registration/deployment/
redirect_from: /extend/docker/tutorial/automated-build/
---

* TOC
{:toc}

When you create a new [Docker extension](/extend/docker/), we recommend that you set up an automated deployment. This
will automatically deploy a new version of your application to Keboola Connection.

## Before You Start
- Have a [KBC project](/#development-project) where you can test your code.
- Have a [Developer Portal account](https://apps.keboola.com/) and be a [member of a vendor](/extend/registration/#obtaining-account).

## Step 1 --- Preliminaries
- Have your [docker extension](/extend/docker/quick-start/) code ready in a git repository. For turbo start, you can fork
[our example repository](https://github.com/keboola/docs-deploy-example).
- [Register your application](/extend/registration/). It does not need to be approved nor working, you only need to obtain the **application id** e.g. `ujovlado.ex-wuzzzup`.
- Create a **Service Account** in [Developer Portal](https://apps.keboola.com/):

{: .image-popup}
![Screenshot -- Create account](/extend/registration/portal-service-account-1.png)

{: .image-popup}
![Screenshot -- Account details](/extend/registration/portal-service-account-2.png)

Note both username and password.

## Step 2 --- Add Deploy Script
Add the following deploy script to your repository, let's name it `deploy.sh`

{% highlight bash %}
#!/bin/bash
set -e

# Obtain the application repository and log in
docker pull quay.io/keboola/developer-portal-cli-v2:latest
export REPOSITORY=`docker run --rm  \
    -e KBC_DEVELOPERPORTAL_USERNAME \
    -e KBC_DEVELOPERPORTAL_PASSWORD \
    quay.io/keboola/developer-portal-cli-v2:latest \
    ecr:get-repository ${KBC_DEVELOPERPORTAL_VENDOR} ${KBC_DEVELOPERPORTAL_APP}`
eval $(docker run --rm \
    -e KBC_DEVELOPERPORTAL_USERNAME \
    -e KBC_DEVELOPERPORTAL_PASSWORD \
    quay.io/keboola/developer-portal-cli-v2:latest \
    ecr:get-login ${KBC_DEVELOPERPORTAL_VENDOR} ${KBC_DEVELOPERPORTAL_APP})

# Push to the repository
docker tag ${KBC_APP_REPOSITORY}:latest ${REPOSITORY}:${TRAVIS_TAG}
docker tag ${KBC_APP_REPOSITORY}:latest ${REPOSITORY}:latest
docker push ${REPOSITORY}:${TRAVIS_TAG}
docker push ${REPOSITORY}:latest

# Deploy to KBC -> update the tag in Keboola Developer Portal (needs $KBC_DEVELOPERPORTAL_VENDOR & $KBC_DEVELOPERPORTAL_APP)
docker run --rm \
    -e KBC_DEVELOPERPORTAL_USERNAME \
    -e KBC_DEVELOPERPORTAL_PASSWORD \
    quay.io/keboola/developer-portal-cli-v2:latest \
    update-app-repository ${KBC_DEVELOPERPORTAL_VENDOR} ${KBC_DEVELOPERPORTAL_APP} ${TRAVIS_TAG} ecr ${REPOSITORY}
{% endhighlight %}

This code will tag your image with the relevant tags (`latest` and the tag of the build) and push them to
our registry.
Finally, it will update the application in Developer Portal to use the current tag. This means that the new version
of the application is immediately deployed into KBC.

This sample deployment script uses the [Developer Portal CLI](https://github.com/keboola/developer-portal-cli-v2)
tool. The CLI (delivered as a Docker image) provides the deploy script with simple commands to retrieve the
repository and credentials to our AWS ECR registry. The `ecr:get-repository` command returns the repository
associated with the user in the variable `KBC_DEVELOPERPORTAL_USERNAME`. The `ecr:get-login` command returns a
`docker login ...` command to authenticate to that repository.

Make sure that the `deploy.sh` file line endings is set to *Unix (LF)*. Also make sure that the file is executable, i.e. by executing
`git update-index --chmod=+x deploy.sh`. Commit the deploy script to your application repository.

## Step 3 --- Add Deploy Automation
There are multiple options for automating application development. We recommend using [Travis CI](https://docs.travis-ci.com/) service, to
use it, add the following `.travis.yml` file:

{% highlight yaml %}
language: bash

services:
  - docker

script:
  - docker build --tag=my-application .

deploy:
  provider: script
  skip_cleanup: true
  script: ./deploy.sh
  on:
    tags: true
{% endhighlight %}

The above configuration defines that whenever you commit and push to the repository, the command `docker build --tag=my-application .` will get executed.
If that command executes successfully and a tag was created, the `deploy.sh` script in the repository will be executed. Commit the deploy configuration to your application
repository.

## Step 4 --- Configure Deploy Automation
Go to [Travis CI](https://travis-ci.org/) and add a new repository:

{: .image-popup}
![Screenshot -- Add Repository](/extend/registration/deploy-config-1.png)

Turn on building of the repository and go to repository configuration:

{: .image-popup}
![Screenshot -- Configure Repository](/extend/registration/deploy-config-2.png)

Set the following environment variables in the repository configuration:

 - `KBC_DEVELOPERPORTAL_USERNAME` with the **Service Account** login -- in the [above example](/extend/registration/deployment/#step-1-----preliminaries): `ujovlado+docs_deploy_example_travis`
 - `KBC_DEVELOPERPORTAL_PASSWORD` with the **Service Account** password -- in the [above example](/extend/registration/deployment/#step-1-----preliminaries): `2nQSm...ts-t`
 - `KBC_DEVELOPERPORTAL_URL` with the string `https://apps-api.keboola.com`
 - `KBC_DEVELOPERPORTAL_VENDOR` with the vendor of the application -- in the [above example](/extend/registration/deployment/#step-1-----preliminaries): `ujovlado`
 - `KBC_DEVELOPERPORTAL_APP` the application id -- in the [above example](/extend/registration/deployment/#step-1-----preliminaries): `ujovlado.ex-wuzzzup`
 - `KBC_APP_REPOSITORY` the docker repository name (tag used when building the application with docker) (ex. `my-application`)

{: .image-popup}
![Screenshot -- Repository Configuration](/extend/registration/deploy-config-3.png)

## Step 5 --- Trigger the build
Commit and push anything to the repository. In Travis, you should see an output similar to this:

{: .image-popup}
![Screenshot -- Build Log](/extend/registration/deploy-log-1.png)

Now push a tag to the repository (we recommend using [Semantic Versioning](http://semver.org/)):

    git tag 0.0.1
    git push origin --tags

In Travis, you should see an output similar to this:

{: .image-popup}
![Screenshot -- Build and Deploy Log](/extend/registration/deploy-log-1.png)

If no errors occurred, the application is now deployed into KBC. You can verify that in the Developer portal, the
application repository and tag was automatically set:

{: .image-popup}
![Screenshot -- Deploy Verification](/extend/registration/deploy-final.png)

The application is now runnable in KBC. You can view all settings in our
[example repository](https://github.com/keboola/docs-docker-example-basic). You can also
review [Travis Configuration](https://travis-ci.org/keboola/docs-deploy-example)

*Note that it takes up to **5 minutes** before the changes in Developer Portal are propagated to all KBC instances in all regions.*

## Manual Deployment
If you want to use some other continuous integration setting or deploy to the repository manually, you can do so without limitations.
As in the [above script](/extend/registration/deployment/#step-2-----add-deploy-script),
we recommend using [Developer Portal CLI client](https://github.com/keboola/developer-portal-cli-v2). This CLI tools (runnable in Docker or PHP)
allows you to obtain the repository for an application and push credentials to that repository. If you want to get even more low level, you
can also use the [Developer Portal API](http://docs.kebooladeveloperportal.apiary.io/#) which has the same functions. It also allows you
to generate [Generate credentials for a service account](http://docs.kebooladeveloperportal.apiary.io/#reference/0/vendors/generate-credentials-for-service-account)
programmatically.

## Test Live Configurations
Before deploying your new image to the developer portal, you may want to try it out on some 'real' configurations
in your project. You can do this by adding some environment variables to Travis with an appropriate
[Storage token](https://help.keboola.com/storage/tokens/)
and configuration Id. It is highly recommended to create a dedicated token for this task.

The commands will need two extra environment variables apart from the
[ones listed above](/extend/registration/deployment/#step-4-----configure-deploy-automation):

- `KBC_STORAGE_TOKEN` --- the Storage token that the test(s) will run under
- `KBC_APP_TEST_CONFIG` --- ID of the configuration to test

{: .image-popup}
![Screenshot -- Sample Configurations](/extend/registration/configuration-sample.png)

If you are still using our [sample application code](https://github.com/keboola/docs-deploy-example-tests),
use the [sample table](/extend/source.csv) as input.

Then add the following steps to your `script` section in `.travis.yml` to run the test jobs.

{% highlight yaml %}
language: bash

services:
  - docker

script:
  - docker build --tag=my-application .
  # push test image to ECR
  - docker pull quay.io/keboola/developer-portal-cli-v2:latest
  - export REPOSITORY=`docker run --rm -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL quay.io/keboola/developer-portal-cli-v2:latest ecr:get-repository $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP`
  - docker tag $KBC_APP_REPOSITORY:latest $REPOSITORY:test
  - eval $(docker run --rm -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD -e KBC_DEVELOPERPORTAL_URL quay.io/keboola/developer-portal-cli-v2:latest ecr:get-login $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP)
  - docker push $REPOSITORY:test
  # Run live test job on new test image
  - docker pull quay.io/keboola/syrup-cli:latest
  - docker run --rm -e KBC_STORAGE_TOKEN quay.io/keboola/syrup-cli:latest run-job $KBC_DEVELOPERPORTAL_APP $KBC_APP_TEST_CONFIG test

deploy:
  provider: script
  skip_cleanup: true
  script: ./deploy.sh
  on:
    tags: true
{% endhighlight %}

The commands above do as follows:

- Build the application image and tag it `my-application`.
- Pull the developer portal cli client [Developer Portal CLI](https://github.com/keboola/developer-portal-cli-v2).
- Get the application's KBC repository url from the developer portal.
- Tag the image as `test`.
- Push the image to the repository.
- Pull the job runner cli client [Syrup PHP CLI](https://github.com/keboola/syrup-php-cli).
- Run the specified test job on KBC using the `/{component}/{config}/run/tag/{tag}` -- [Keboola Docker API](http://docs.kebooladocker.apiary.io/#reference/run/create-a-job-with-image/run-job).

Note that if you want to run multiple test jobs, simply repeat the command with the different configuration IDs
that you would like to test.

When you commit to the application repository, the docker image will be built and using a `test` tag, it will be tested in production KBC.
It will not be deployed to production however! When you create a new tag (`x.y.z`) in the repository, the docker image will be build and tested using the
`test` tag and if all succeeds, it will deploy the specified tag (`x.y.z`) into KBC --- a new version will be available in production.
You can see the code in the [Sample repository](https://github.com/keboola/docs-deploy-example-tests).

You can see both [`.travis.yml`](https://github.com/keboola/docker-demo-app/blob/master/.travis.yml) and
the deploy script ([`deploy.sh`](https://github.com/keboola/docker-demo-app/blob/master/deploy.sh))
in our [Docker Demo App](https://github.com/keboola/docker-demo-app) GitHub repository.
