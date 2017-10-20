---
title: Deployment
permalink: /extend/registration/deployment/
redirect_from: /extend/docker/tutorial/automated-build/
---

* TOC
{:toc}

We support public and private images on both Docker Hub and Quay registries, as well as private images on AWS ECR.
TODO dopsat uvod
## Setting up a Repository on AWS ECR

If you do not have a Keboola Developer Portal account yet, head to the [API documentation](http://docs.kebooladeveloperportal.apiary.io/#),
create a new account and register your vendor.

The [Get credentials to ECR repository API call](http://docs.kebooladeveloperportal.apiary.io/#reference/0/apps/get-credentials-to-ecr-repository)
will create a repository and temporary credentials for logging into the AWS ECR registry and uploading
your Docker image.

If you want to integrate this process into a CI tool like Travis or CircleCI, do not use your Keboola Developer
Portal credentials to log in.
For this case, the [Generate credentials for a service account API call](http://docs.kebooladeveloperportal.apiary.io/#reference/0/vendors/generate-credentials-for-service-account)
will create a service user whose credentials are safe to share with Travis or the CI tool of your choice.

### Sample Integration with Travis CI
Generate the service username and password using the [Generate credentials for service account API call](http://docs.kebooladeveloperportal.apiary.io/#reference/0/vendors/generate-credentials-for-service-account)
and save these to environment variables:

 - `KBC_DEVELOPERPORTAL_USERNAME` with the login
 - `KBC_DEVELOPERPORTAL_PASSWORD` with the password
 - `KBC_DEVELOPERPORTAL_URL` with the string `https://apps-api.keboola.com`
 - `KBC_DEVELOPERPORTAL_VENDOR` with the vendor of the app
 - `KBC_DEVELOPERPORTAL_APP` the appId
 - `KBC_APP_REPOSITORY` the app repository name (ex. `keboola/docker-demo-app`)

{: .image-popup}
![Environment variables in Travis CI](/extend/docker/tutorial/travis-envs.png)

Then simply paste this code in your deploy script:

{% highlight bash %}
# Deploy to repository provided by Keboola Developer Portal
docker pull quay.io/keboola/developer-portal-cli-v2:latest
export REPOSITORY=`docker run --rm \
  -e KBC_DEVELOPERPORTAL_USERNAME \
  -e KBC_DEVELOPERPORTAL_PASSWORD \
  -e KBC_DEVELOPERPORTAL_URL \
  quay.io/keboola/developer-portal-cli-v2:latest ecr:get-repository \
  $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP`
docker tag $KBC_APP_REPOSITORY:latest $REPOSITORY:$TRAVIS_TAG
docker tag $KBC_APP_REPOSITORY:latest $REPOSITORY:latest
eval $(docker run --rm \
  -e KBC_DEVELOPERPORTAL_USERNAME \
  -e KBC_DEVELOPERPORTAL_PASSWORD \
  -e KBC_DEVELOPERPORTAL_URL \
  quay.io/keboola/developer-portal-cli-v2:latest ecr:get-login \
  $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP)
docker push $REPOSITORY:$TRAVIS_TAG
docker push $REPOSITORY:latest

# Deploy the application to KBC
docker run --rm \
  -e KBC_DEVELOPERPORTAL_USERNAME \
  -e KBC_DEVELOPERPORTAL_PASSWORD \
  -e KBC_DEVELOPERPORTAL_URL \
  quay.io/keboola/developer-portal-cli-v2:latest update-app-repository \
  $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP $TRAVIS_TAG

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

#### Run test jobs of your new image against live configurations

Before deploying your new image to the developer portal, you may want to try it out on some 'real' configurations
in your project. You can do this by adding some environment variables to Travis with an appropriate storage token
and configurationId. (It is highly recommended to create a dedicated token for this task.)

The commands will need two extra environment variables including the ones listed above:

- `KBC_STORAGE_TOKEN` --- the storage token that the test(s) will run under
- `KBC_APP_TEST_CONFIG` --- the configuration to test

Note that if you want to run multiple test jobs, simply repeat the command with the different configuration IDs
that you would like to test.

Then simply add the following steps to your `script` section in `.travis.yml` to run the test jobs.

{% highlight bash %}
# Push master image to ECR
docker pull quay.io/keboola/developer-portal-cli-v2:latest
export REPOSITORY=`docker run --rm \
  -e KBC_DEVELOPERPORTAL_USERNAME \
  -e KBC_DEVELOPERPORTAL_PASSWORD \
  -e KBC_DEVELOPERPORTAL_URL \
  quay.io/keboola/developer-portal-cli-v2:latest ecr:get-repository \
  $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP`
docker tag $KBC_APP_REPOSITORY:latest $REPOSITORY:master
eval $(docker run --rm \
  -e KBC_DEVELOPERPORTAL_USERNAME \
  -e KBC_DEVELOPERPORTAL_PASSWORD \
  -e KBC_DEVELOPERPORTAL_URL \
  quay.io/keboola/developer-portal-cli-v2:latest ecr:get-login \
  $KBC_DEVELOPERPORTAL_VENDOR $KBC_DEVELOPERPORTAL_APP)
docker push $REPOSITORY:master

# Run live test job on new master image
# env requires: KBC_STORAGE_TOKEN and KBC_APP_TEST_CONFIG (a token to a test project where the app has a configuration)
docker pull quay.io/keboola/syrup-cli:latest
docker run --rm \
  -e KBC_STORAGE_TOKEN \
  quay.io/keboola/syrup-cli:latest run-job \
  $KBC_DEVELOPERPORTAL_APP $KBC_APP_TEST_CONFIG master
{% endhighlight %}

The commands above do as follows:

* Pull the developer portal cli client [Developer Portal CLI](https://github.com/keboola/developer-portal-cli-v2)
* Get the application's KBC repository url from the developer portal
* Tag the image as master
* Push the image to the repository
* Pull the job runner cli client [Syrup PHP CLI](https://github.com/keboola/syrup-php-cli)
* Run the specified test job on KBC using the `/{component}/{config}/run/tag/{tag}` -- [Keboola Docker API](http://docs.kebooladocker.apiary.io/#reference/run/create-a-job-with-image/run-job)

You can see both [`.travis.yml`](https://github.com/keboola/docker-demo-app/blob/master/.travis.yml) and
the deploy script ([`deploy.sh`](https://github.com/keboola/docker-demo-app/blob/master/deploy.sh))
in our [Docker Demo App](https://github.com/keboola/docker-demo-app) GitHub repository.

