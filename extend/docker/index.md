---
title: Docker Extensions
permalink: /extend/docker/
---

## Docker Extensions
Docker extensions allow you to extend KBC in a more flexible way than [Custom Science](/extend/custom-science/). At the same time, significant implementation effort on your part is required. In Docker extensions, the data interface is very similar to [transformations](/?/) and [Custom Science](/extend/custom-science/) - data are exchanged as CSV files in designated directories.


Advantages:

* Customizable UI (input/output mapping) 
* Standard (customizable), or your own UI can be used
* Branding possible; Documentation and extended description can be provided
* Arbitrary application environment; can be fully private
* Automatically offered to all KBC users

Disadvantages:

* [Registration checklist](/extend/registration/checklist/) must be completed
* Extension [registration](/extend/registration/)by Keboola is required
* Maintaining your own Docker image is necessary (on dockerhub or Quay)

See the [overview](/extend/) for comparison with other customization options.


### How to Create a Docker Extension
If you are new to extending KBC with your own code, you might want to start by creating a simple [Custom Science extension](/extend/custom-science/) first. Any Custom Science extension can be very easily converted to a Docker extension. 

Before You Start, Make Sure to

- Have a git repository ready; ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, although any other host should work as well). It is easier to start with a public repository.
- Have a KBC project, where you can test your code.
- Get yourself acquainted with [Docker](/extend/docker/tutorial/). You should be able to at least run a Docker image.
- Be able to send API requests. You can use an apiary client, but we recommend using Postman as it is more convenient. If you do use Postman, you can [import a list] of [sample requests].

### Step 1 - Prepare the Docker Environment
You need to provide a Docker Image which will run your application. You can either choose any of our images or build your own image. We support both public and private images. If you build your own image, we recommend that you base your image on one of our base images. This is either php-base, r-base or r-base-packages, python-base, node-base. The Keboola base images have no entrypoint and they do not contain any application logic. 

Example dockerfile:

	```
	FROM keboola/php-base

	COPY . /home/
	RUN curl composer
	RUN composer install
	ENTRYPOINT php main.php
	```

The above image will take the Keboola PHP image, add a composer to it, and copy your application code from the build context (that is the same directory in which the Dockerfile resides). When the image is run, it will execute the PHP script. 

The dockerfile and the application can be in the same VCS repository. It is best to link them with the Docker image and setup [automated build](/extend/docker/tutorial/automated-build/). To be usable in KBC, the image must be available in one of the supported registries (Dockerhub, Quay).


### Step 2 - Simulate KBC Environment
Data between KBC and your Docker image are exchanged using [CSV files](/extend/common-interface/) stored which will be injected into the image when we run it. To simulate this, you can download an archive containing the data files and [configuration](/extend/common-interface/config-file/) in the exact same format as you will obtain it in production environment.

To obtain the configuration, send a Sandbox Request to docker-bundle. You will receive an archive which contains a [/data/ folder](/extend/common-interface/) with tables and files from input mapping and configuration depending on the request body. A sample request:

	```
	storage: {
		input: {
		....
		}
	}
	```
 
The sample request corresponds to the following setting in the UI (though UI for your component will become available only when it is [registered]). 

[TODO:obrazek]

In the request, you need to enter a configuration format which you choose to be either yaml or json. Once you have prepared the data folder with sample data and configuration, you can inject it into the Docker image. Apart from the options shown in the example, there are plenty of [other options](/extend/common-interface/config-file/)

### Step 3 - Running together
Now you can run your image together with the data we provide. Use the following command:

`docker run --volume=physicalhostpath:/data/ imageName`

The physical host path depends on the system you are running. For more information, see [Setting up Docker](/extend/docker/tutorial/sharing-files/). In our example image with default installation of Docker on windows, this would be something like

`docker run --volume=/c/Users/JohnDoe/data:/data/ quay.io/keboola/doc-sample`

Your application will now have the contents of /data and simulate the KBC environment. Apart from the data directory you might want to work with environment variables. To do so, use the -e switch in docker run

`docker run --volume=/c/Users/JohnDoe/data:/data/ -e=KBC_PROJECT_ID:572 quay.io/keboola/doc-sample`

(make sure to put NO spaces around = and : characters)

You can now develop the application logic. When the image/container is run, it should produce result tables and files in the respective folders.


### Step 4 - Deployment
To deploy the application to production, it must first be registered. Currently only Keboola can register applications. To register an application, fill the following checklist and contact us:

[TODO:tabulka]

There are two modes for deployment:

- automatic: use tag *latest* or *master* on the docker image. If you commit code to your application repository and [(automatically) rebuild] the image, the next time time your application is run, it will be updated to the latest version
- manual: use [Semantic versioning](http://semver.org/ versioning tags on your docker images. Let us know when you want to change the image tag to a new version. 

At the beginning, it is probably more straightforward to work in the automatic mode because your deployment is fully automated and requires no interaction from us. Once the application gets more mature, you should probably switch to manual versioning and perhaps notify your users about modifications.

Note that when you register the application, there is the option to hide that application from the application store. This is useful if you want to continue testing and developing the application without making it available to all KBC users. In such case, the application configuration can be created by accessing the URL http:///.../ or - as everything else - through the API.

