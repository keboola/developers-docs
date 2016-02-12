---
title: Docker Extensions
permalink: /extend/docker/
---

## Docker extensions
Docker extensions allow you to extend KBC in a more flexible way then [Custom science](/extend/custom-science/). If you are new to extending KBC with your own code, you might want to start [Custom science](/extend/custom-science/) first as a simple starting point to extending KBC. Any Custom science extension can be very easily converted to docker extension. Docker extensions must be [registred](/extend/registration) by us to become fully usable. See the [overview](/extend/) for comparison with other customization options. In docker extensions, the data interface is very similar to [transformations](/?/) and [Custom science](/extend/custom-science/) - data are exchanged as CSV files in designated directories.

Before you start
- You must have a git repository ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, although any other host should work as well). It is easier to start with public repository.
- It is recommended that you have a KBC project, where you can test your code.
- Get yourself acquainted with [Docker](/extend/docker/docker-overview/), you should be able to at least run a docker image.
- Be able to send API requests. You can use apiary client, but we recommend using Postman as it is more convenient. If you do use postman, you can [import a list] of [sample requests].

### Step 1 - Prepare the docker environment
You need to provide a Docker Image which will run your application. You can either choose any of our images or build your own image. We support both public and private images. If you build your own image, we recommend that you base your image on one of our base images. This is either php-base, r-base or r-base-packages, python-base, node-base. The keboola base images have no entrypoint and the do not contain any application logic. 

Example dockerfile
FROM keboola/php-base

COPY . /home/
RUN curl composer
RUN composer install
ENTRYPOINT php main.php

The above image will take keboola PHP image, add composer to it, copy your application code from the build context (that's the same directory in which the Dockerfile resides). When the image is run, it will execute the PHP script. 

The dockerfile and the application can be in same VCS repository and it is best to link them with docker image and setup [automated build]. The image must be available in one of the supported registries (Dockerhub, Quay) to be usable in KBC.


### Step 2 - Simulate KBC envrionment
Data between KBC and your docker image are exchanged using CSV files stored which will be injected into the image when we run it. To simulate this, you can download an archive containing the data files and configuration in exact same format as you will obtain it in production enviromnent.

To obtain configuration send a Sandbox Request to docker-bundle. You will obtain an archive which contains /data/ folder which contains tables and files from input mapping and configuration depending on the request body. Sample request:

storage: {
	input: {
	....
	}
}
 
The sample request corresponds to the following setting in the UI (though UI for your component will become available only when it is [registered]). 

[TODO:obrazek]

In the request you need to enter configuration format which you choose to be either yaml or json. Once you have prepared the data folder with sample data and configuration you can inject it into the docker image. Apart from the options shown in the example there are plenty of [other options]

### Step 3 - Running together
Now you can run your image together with the data we provide. Use the following command

docker run --volume=physicalhostpath:/data/ imageName

The physical host path depends on the system you are running. For more information see [setting up docker]. In our example image with default installation of docker on windows this would be something like

docker run --volume=/c/Users/JohnDoe/data:/data/ quay.io/keboola/doc-sample

Your application will now have the contents of /data and simulate the KBC environemnt. Apart from the data directory you might want to work with environment variables, to do so, use the -e switch in docker run

docker run --volume=/c/Users/JohnDoe/data:/data/ -e=KBC_PROJECT_ID:572 quay.io/keboola/doc-sample

(make sure to put to NO spaces around = and : characters)

You can now develop the application logic. When the image/container is run, it should produce result tables and files in the respective folders.


### Step 4 - Deployment
To deploy the application to production, it must first be registered. Currently only Keboola can register applications. To register an application, fill the following checklist and contact us:

[TODO:tabulka]

There are two modes for deployment:
- automatic: use tag *latest* or *master* on the docker image. If you commit code to your application repository and a([utoamtically) rebuild] the image, the next time time your application is run, it will be updated to the latest version
- manual: use (semantic) versioning tags on your docker images. Let us know when you want to change the image tag to a new version. 
At the begininig it is probably more straightforward to work in the automatic mode because your deployment is fully automated and requies no interaction from us. Once the application gets more mature you should probably switch to manual versioning and prehaps notify your users about modifications.

Note that when you register the application, there is the option to hide that application from the application store. This is useful if you want to continue test and develop the application without making it available to all KBC users. In such case the application configuration can be created by accessing the URL http:///.../ or - as everything - through the API.
































