---
title: Docker Extensions Quick start
permalink: /extend/docker/
---

### Step 1 - Create some application code.


    ```
    <?php
    echo "Hello world";
    ```


### Step 1 - Prepare the Docker Environment
First, you need to create a Docker Image which will run your application. To build your own image, create
and empty directory and in it crate a file named `Dockerfile`. 

Example [Dockerfile](https://github.com/kebool):

	```
	FROM quay.io/keboola/docker-base-php56
    COPY . /home/
    ENTRYPOINT php ./src/run.php --data=/data
	```

The above image will inhertif from our [Keboola PHP56 base image](https://quay.io/repository/keboola/docker-base-php56)
(which is defined by its own [Dockerfile](https://github.com/keboola/docker-base-php56/blob/master/Dockerfile).
The instruction `COPY . /home/` will copy the application code from the *build context* 
(that is the same directory in which the Dockerfile resides) into the image. Then it will run
`composer`. The `ENTRYPOINT` line specifies that image is run, it will execute the PHP application script. 

The dockerfile and the application can be in the same [VCS repository](https:/github.com). It is best to link 
them with the Docker image and setup [automated build](/extend/docker/tutorial/automated-build/). To 
be usable in KBC, the image must be available in one of the supported registries ([Dockerhub](), [Quay]()).

We support both public and private images. If you build your own image, we recommend that you base your image
 on one of our [base images](/extend/docker/images/).  
[own image](/extend/docker/howto/)

### Step 2 - Simulate KBC Environment
Data between KBC and your Docker image are exchanged using [CSV files](/extend/common-interface/) which will be 
injected into the image when we run it. To simulate this, you can download an archive containing the data files 
and [configuration](/extend/common-interface/config-file/) in the exact same format as you will obtain it
in production environment.

To obtain the configuration, send a [Sandbox API Request](/extend/common-interface/sandbox/). You will receive an 
archive which contains a [/data/ folder](/extend/common-interface/) with tables and files from input mapping and
configuration depending on the request body. In the request, you need to enter a configuration format which 
you choose to be either `Yaml` or `JSON`. A sample request:

	```
	storage: {
		input: {
		....
		}
	}
	```
 
The sample request corresponds to the following setting in the UI (though UI for your component will become 
available only when your extension is [registered]). 

[TODO:obrazek]

Alternatively - to quickly get the picture, you can download a [random sample data folder](), which can be used
together with the [sample application](/docker-demo-app/)

Once you have prepared the data folder with sample data and configuration, you can inject it into the Docker image. 
Apart from the options shown in the example, there are plenty of [other options](/extend/common-interface/config-file/)


### Step 3 - Running together
Now you can run your image together with the data we provide. Use the following command:

`docker run --volume=physicalhostpath:/data/ imageName`

The physical host path depends on the system you are running. For more information, 
see [Setting up Docker](/extend/docker/tutorial/sharing-files/). In our example image with default installation of Docker on 
Windows, this would be something like

`docker run --volume=/c/Users/JohnDoe/data:/data/ quay.io/keboola/doc-sample`

Your application will now have the contents of /data and simulate the KBC environment. Apart from the data directory you 
might want to work with environment variables. To do so, use the -e switch in docker run

`docker run --volume=/c/Users/JohnDoe/data:/data/ -e=KBC_PROJECT_ID:572 quay.io/keboola/doc-sample`

(make sure to put NO spaces around = and : characters)

For more details on see [Howto](/extend/docker/running/) You can now develop the application logic. 
When the image/container is run, it should produce result tables and files in the respective folders.

### Step 4 - Deployment
To deploy the application to production, it must first be [registered](/extend/registration/).There are two modes for deployment:

- automatic: use tag *latest* or *master* on the docker image. If you commit code to your application 
repository and [(automatically) rebuild] the image, the next time time your application is run, 
it will be updated to the latest version
- manual: use [Semantic versioning](http://semver.org/ versioning tags on your docker images. 
Let us know when you want to change the image tag to a new version. 

The deployment mode is specified only be the tags you use, the *lastest* and *master* tags are autoupdating.
At the beginning, it is probably more straightforward to work in the automatic mode because your deployment is 
fully automated and requires no interaction from us. Once the application gets more mature, you should probably 
switch to manual versioning and perhaps notify your users about modifications.

