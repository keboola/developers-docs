---
title: Docker Extensions Quick start
permalink: /extend/docker/quick-start/
---

This tutorial guides you through the process of creating a simple Docker Application in PHP. 
The application logic is trivial: it takes a table with numbers as an input, and creates another table 
with an extra column containing those numbers multiplied by two. A test in KBC is included. 

Before You Start, Make Sure to
- Have a git repository ready; ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, although any other host should work as well). It is easier to start with a public repository.
- Have a [KBC project](/overview/devel-project/), where you can test your code.
- Get yourself acquainted with [Docker](/extend/docker/tutorial/). You must be able to run `docker` commands.
- It is recommended that you are able to send API requests. You can use an [Apiary](https://apiary.io/) client console, but we 
recommend using [Postman](https://www.getpostman.com/) as it is
more convenient. If you do use Postman, you can [import a list](/overview/api/)
of [sample requests](https://www.getpostman.com/collections/87da6ac847f5edcac776).


## Step 1 - Create some application code.

In the root of your repository, create a PHP script named 
[`main.php`](https://github.com/keboola/docs-docker-example-basic/blob/master/main.php) with the following contents:

    <?php

    $fhIn = fopen('/data/in/tables/source.csv', 'r');
    $fhOut = fopen('/data/out/tables/destination.csv', 'w');

    $header = fgetcsv($fhIn);
    $numberIndex = array_search('number', $header);
    fputcsv($fhOut, array_merge($header, ['double_number']));

    while ($row = fgetcsv($fhIn)) {
        $row[] = $row[$numberIndex] * 2;
        fputcsv($fhOut, $row);
    }

    fclose($fhIn);
    fclose($fhOut);
    echo "All done";
    
As mentioned above, this script reads a CSV file, takes a column named
_numbre_, multiplies it's value by 2 and adds the new values as a new column. 
We take care to properly find the column index (`$numberIndex`), as it is not safe to rely on the order of columns.
Finally the result is writen to another CSV file. Note that we open both the input and output file simulatenously 
and as soon as a row is processed,
it is immediately written to _destination.csv_. This approach keeps only a single row of data in memory and is
generally very efficient. It is not required to implement the processing in this way, but keep in mind that data files
incoming from KBC can by quite large (i.e Gigabytes).

You can test the code on [sample table](/extend/source.csv):

{:.table}
number | someText | double_number
--- | --- | ---
10 | ab | 20
20 | cd | 40
25 | ed | 50
26 | fg | 52
30 | ij | 60


## Step 2 - Wrap the application in a docker image
You need to create a Docker Image which will contain your application and when the image is run, it will run 
your application. 

### Step 2.1 - Wrap the application in an image
To create your own image, create a file named 
[`Dockerfile`](https://github.com/keboola/docs-docker-example-basic/blob/master/Dockerfile) in the same directory as the 
application code (in the root of your repository). 

	FROM quay.io/keboola/docker-base-php56:0.0.2
    COPY . /home/
    ENTRYPOINT php /home/main.php

The above image will inherit from our [Keboola PHP56 base image](https://quay.io/repository/keboola/docker-base-php56)
(which is defined by its own [Dockerfile](https://github.com/keboola/docker-base-php56/blob/master/Dockerfile).
The instruction `COPY . /home/` will copy the application code (which currently is only `main.php`) 
from the *build context* (that is the same directory in which the Dockerfile resides) into the image. Then it will run
`composer`. The `ENTRYPOINT` line specifies that image is run, it will execute the PHP application script. 

The Dockerfile and the application can be in two repositories or in a 
single [git repository](https://github.com/keboola/docs-docker-example-basic). Using a single repository makes 
things generally easier, but it is not required.

### Step 2.2 - Build the image
On command line, navigate to the directory with your repository in issue the command
    
    docker build --tag=test .

_Don't forget the dot at the end_. The command should produce similar output to the below one:

 ![Docker build output](/extend/docker/build-output.png)

Out of that output, the most important thing is *Successfully built ded5321d5ba5* which gives us a 
hash of the new image `ded5321d5ba5`, which can be abreviated to first 3 characters, so we can
later refer to it as `ded` or as `test` (tag of the image). 

## Step 3 - Obtaining sample data and configuration
Data between KBC and your Docker image are exchanged using [CSV files](/extend/common-interface/) which will be 
injected into the image when we run it. To simulate this, you can download an archive containing the data files 
and [configuration](/extend/common-interface/config-file/) in the exact same format as you will obtain it
in production environment.

To obtain the configuration, send a [Sandbox API Request](/extend/common-interface/sandbox/). You will receive an 
archive which contains a [/data/ folder](/extend/common-interface/) with tables and files from input mapping and
configuration depending on the request body. In the request, you need to enter a configuration format which 
you choose to be either `Yaml` or `JSON`. A sample request to `https://syrup.keboola.com/docker/sandbox?format=json`:

    {
        "config": "my-test-config",
        "configData": {
            "storage": {
                "input": {
                    "tables": [
                        {
                            "source": "in.c-main.test",
                            "destination": "source.csv"
                        }
                    ]
                },
                "output": {
                    "tables": [
                        {
                            "source": "destination.csv",
                            "destination": "out.c-main.test"
                        }            		
                    ]
                }
            },
            "parameters": {
            }
        }
    }
 
The sample request corresponds to the following setting in the UI (though the UI for your component will become 
available only when your extension is complete and [registered](/extend/registration/)).

![Configuration Screenshot](/extend/docker/configuration-sample.png) 

Alternatively - to quickly get the picture, you can download a [random sample data folder](/extend/docker/data.zip),
 which can be used together with the above [sample application](https://github.com/keboola/docs-docker-example-basic).

## Step 4 - Running the application with sample data 
Once you have prepared the data folder with sample data and configuration, you can inject it into the Docker image. 
Apart from the options shown in the example, there are plenty of [other options](/extend/common-interface/config-file/)

When you run an image a *container* is created in which the application is running isolated. 
Use the following command to run the image:

    docker run --volume=physicalhostpath:/data/ imageTag

Image tag can be either the tag you supplied in the `--tag` parameter for `docker build` or the image hash you received
when the image was build (`ded` in the above example). 
The physical host path depends on the system you are running. If in doubt, 
see [Setting up Docker](/extend/docker/tutorial/sharing-files/). In our example image with default installation of Docker on 
Windows, this would be:

    docker run --volume=/c/Users/ondre/data/:/data/ test

Where the contents of the sample data folder are put in the users' home directory. If you have set everyting correctly,
you should see **All done** and a `destination.csv` file will appear in the `data/out/tables/` directory.

### Step 4.1 Debugging

Chances are, that you received some ugly error or warning. In that case, you might want to check out the 
contents of the image and specifically if all the files are were you expect 
them to be - see [debugging](/extend/docker/running/).

To work with the application container interactively, use the following command:

    docker run --volume=physicalhostpath:/data/ -i -t --entrypoint=/bin/bash imageTag

e.g.

    docker run --volume=/c/Users/JohnDoe/data:/data/ -i -t --entrypoint=/bin/bash test

You can then inspect the container contents: 'ls /data/'. For more details on see [Howto](/extend/docker/running/)


### Step 5 - Deployment

It is best to use a docker registry ([Dockerhub](https://hub.docker.com/), [Quay](https://quay.io/)) for 
deployment. It is best to set up [automated build](/extend/docker/tutorial/automated-build/). To 
be usable in KBC, the image must be available in one of the supported registries (Dockerhub, Quay).
We support both public and private images. 

To deploy the application to production, it must first be [registered](/extend/registration/). Once the
application is registered with us, we will automatically pull the image and make it available in production.
There are two modes for deployment:

- automatic: use tag *latest* or *master* on the docker image. If you commit code to your application 
repository and [(automatically) rebuild] the image, the next time time your application is run, 
it will be updated to the latest version
- manual: use [Semantic versioning](http://semver.org/) versioning tags on your docker images. 
Let us know when you want to change the image tag to a new version. 

The deployment mode is specified only be the tags you use, the *lastest* and *master* tags are autoupdating.
At the beginning, it is probably more straightforward to work in the automatic mode because your deployment is 
fully automated and requires no interaction from us. Once the application gets more mature, you should probably 
switch to manual versioning and perhaps notify your users about modifications.
