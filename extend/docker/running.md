---
title: Running Images
permalink: /extend/docker/running/
---

* TOC
{:toc}

One of the great advantages of dockerized applications is that the applications always run in the
same environment defined by the docker image. When running in KBC, there are, however, some outside
environment bindings for you to take care of. Before you start, make sure, you have
[docker set up correctly](/extend/docker/tutorial/setup/), particularly that you know
your *host path* for [sharing files](/extend/docker/tutorial/setup#sharing-files). In this guide,
we will use /Users/JohnDoe/data/ as the *host path* containing the 
[sandbox data folder](/extend/common-interface/sandbox/).

You can also run your application in your own environment. In that case, set the `KBC_DATADIR` environment
variable to point to the data folder. With this approach, you loose the advantage of the properly defined 
environment, but in some cases it may be a nice shortcut. 

For more details on how to develop your own 
[Docker extension](/extend/docker/) or [Custom Science](/extend/custom-science/), go to [Howto Guide](/extend/docker/tutorial/howto/). Regardless of   
the chosen approach, the image -- when being run -- should consume tables and files from `in` subfolders and
produce result tables and files in the respective `out` subfolders.

Note: Whenever we use version tags on Docker repositories (such as quay.io/keboola/python-transformation:0.0.14),
please make sure it is the current version in the Docker repository.

## Basic Run
The basic run command that we use is:

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 quay.io/keboola/docs-docker-example-parameters

The `--volume` parameter ensures the `/data/` folder will be mounted into the image. This is used
to inject the input data and configuration into the image. Make sure not to put any spaces around the `:` character.

The `--memory` `--cpu-shares` and `--net` parameters are component limits and are defined by the options you specify 
when [registering the application](/extend/registration/). Components maintained by Keboola have
their limits described in their documentation. 

The `-e` parameters define [environment variables](/extend/common-interface/environment/). When entering
environment variables on the command line, do _not_ put any spaces around the `=` character.

### Test it
Download our [sample data folder](/extend/docker/data-parameters.zip), extract it into your *host folder* and run:

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 quay.io/keboola/docs-docker-example-parameters

You should see the following output:

    All done

    Environment variables:
    KBC_RUNID: 123456789
    KBC_PROJECTID: 123
    KBC_DATADIR: /data/
    KBC_CONFIGID: test-78

In addition, the `destination.csv` file will be created in your *host folder* in the `data/out/tables/` folder, with the following contents:

    number,someText,double_number
    10,ab,20
    20,cd,40
    25,ed,50
    26,fg,52
    30,ij,60

If you encounter any errors, you can run the image interactively:

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 -i -t --entrypoint=/bin/bash quay.io/keboola/docs-docker-example-parameters

Then you can inspect the container with standard OS (CentOS) commands and/or run the script manually with
`php /home/main.php`.

After you have mastered this step, you can run any Docker component on your machine. The following chapters describe 
some common situations, though there are only minor differences. 

## Running an Unregistered Docker Extension
Unregistered Docker extensions do not have their component Id yet. This is somewhat limiting because you 
get only a sample of the data the component will receive by using 
the [Sandbox call](/extend/common-interface/sandbox/#create-sandbox-api-call). In the 
[API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/sandbox/create-a-sandbox-job), manually 
specify the input/output mapping and parameters. The configuration format (JSON or Yaml) is specified by the 
`format` parameter in the URL.

[![Run in Postman](https://run.pstmn.io/button.png)](https://app.getpostman.com/run-collection/7dc2e4b41225738f5411)

You can use *Sandbox introduction* request for a simple start or the more advanced *Sandbox Example* which provides
more configuration options. The request URL is e.g. `https://syrup.keboola.com/docker/sandbox?format=json`.

To run the component, use the command line. For example: 

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 
    --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ 
    -e KBC_CONFIGID=test-78 quay.io/keboola/docs-example-parameters

Where the `/Users/JohnDoe/data/` path refers to the contents of the data folder, which you
obtained in the above Sandbox API call (`data.zip` file stored in the *Storage* - *File uploads*). The 
`quay.io/keboola/docs-example-parameters` parameter should be replaced by your Docker image name.


## Running a Registered Docker Extension
Already [registered](/extend/registration/) Docker extensions have been assigned their *component ID* 
(in the form of *vendor.componentName*, e.g. *keboola.docs-docker-example-parameters*). To obtain the sample data for 
a registered component, use the [Input data](/extend/common-interface/sandbox/#input-data-api-call) call. 
In the [API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/input-data/create-an-input-job), either specify the full configuration (using the `configData` node) or refer to an existing configuration
of the component (using the `config` node). The configuration format is now fixed to what has been specified in the component
registration.

[![Run in Postman](https://run.pstmn.io/button.png)](https://app.getpostman.com/run-collection/7dc2e4b41225738f5411)

You can use an *Input Data introduction* request for a sample request referring to an existing configuration, or
*Input Data full example* for a request specifying the whole configuration. The request URL is 
e.g. `https://syrup.keboola.com/docker/keboola.docs-docker-example-parameters/input where `keboola.docs-docker-example-parameters` must be replaced with your component ID.

To run the component, use the command line. For example: 

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 quay.io/keboola/docs-docker-example-parameters

The `/Users/JohnDoe/data/` path refers to the contents of the data folder, which you
obtained in the above Input data API call (`data.zip` file stored in the *Storage* - *File uploads*), and
`quay.io/keboola/docs-example-parameters` should be replaced by your Docker image name.


Note: If your extension uses encryption, the Input Data API call will be disabled (for security reasons):

    This API call is not supported for components that use the 'encrypt' flag.

In that case, revert to the [Sandbox call](/extend/common-interface/sandbox/#create-sandbox-api-call).


## Running Custom Science Extensions
Running Custom Science extensions is slightly more complicated, because their Docker images are build dynamically
on execution. Also, because the Custom Science component uses encryption, 
the [Sandbox call](/extend/common-interface/sandbox/#create-sandbox-api-call) must be used. In the 
[API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/sandbox/create-a-sandbox-job), manually 
specify the input/output mapping and parameters. The configuration format must be *JSON*.

[![Run in Postman](https://run.pstmn.io/button.png)](https://app.getpostman.com/run-collection/7dc2e4b41225738f5411)

Use either *Sandbox introduction* request for a simple start, or the more advanced *Sandbox Example* in case you wish to have 
more configuration options available. The request URL is e.g. `https://syrup.keboola.com/docker/sandbox?format=json`

### Custom Science R

You can run the image with:
  
    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 -i -t --entrypoint=/bin/bash/ [quay.io/keboola/docker-custom-r](https://quay.io/repository/keboola/docker-custom-r):1.0.2

Then:
    
    cd /data/

And then execute:

    git clone -b your_version --depth 1 your_repository /home/
    
for example:
    
    git clone -b 0.0.2 --depth 1 https://github.com/keboola/docs-custom-science-example-r-parameters /home/ 

and then run the application with:

    Rscript /home/main.R
    
### Custom Science Python

You can run the image with:
  
    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 -i -t --entrypoint=/bin/bash/ [quay.io/keboola/docker-custom-python](https://quay.io/repository/keboola/docker-custom-python):0.0.4

Then:
    
    cd /data/

(Note: for running Python 2.x applications, use the `quay.io/keboola/docker-custom-python2:0.0.2` image)

Then execute:

    git clone -b your_version --depth 1 your_repository /home/
    
for example:
    
    git clone -b 1.0.0 --depth 1 https://github.com/keboola/docs-custom-science-example-python-parameters.git /home/ 

and then run the application with:

    python /home/main.py


## Running Transformations 
Both R and Python Transformations are implemented as Docker components. They can be run 
locally as well. Use the [Input data](/extend/common-interface/sandbox/#input-data-api-call) call. 
In the [API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/input-data/create-an-input-job), specify full configuration (using `configData` node). The configuration format is 

[![Run in Postman](https://run.pstmn.io/button.png)](https://app.getpostman.com/run-collection/7dc2e4b41225738f5411)

Use *R Transformations* request for a sample request. The only special thing about the request is that
the body of the transformation is passed in `parameters.script` node either as a string or as an
array of lines. The request URL is 
e.g. `https://syrup.keboola.com/docker/keboola.r-transformation/input` for R transformations
 or `https://syrup.keboola.com/docker/keboola.python-transformation/input` for Python transformations.

To run R Transformations, use: 

    `docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 [quay.io/keboola/r-transformation](https://quay.io/repository/keboola/r-transformation):0.0.8

To run Python transformations, use: 

    `docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 [quay.io/keboola/python-transformation](https://quay.io/repository/keboola/python-transformation):0.0.14
 
The transformation will run automatically and produce results. If you want to get interactively into
the container, use the [`--entrypoint`](/extend/docker/tutorial/howto/) parameter. 


### Debugging

For debugging purposes, it is possible to obtain the [sandbox](/extend/common-interface/sandbox/). 
There are three API calls available for that purpose:
  
  - [Sandbox](http://docs.kebooladocker.apiary.io/#reference/sandbox/sandbox/create-a-sandbox-job)
  - [Input](http://docs.kebooladocker.apiary.io/#reference/sandbox/input-data/create-an-input-job)
  - [Dry run](http://docs.kebooladocker.apiary.io/#reference/sandbox/dry-run/create-a-dry-run-job)

The [Sandbox](http://docs.kebooladocker.apiary.io/#reference/sandbox) API call is useful for obtaining a 
sample environment configuration when starting with development of a new Docker Extension or
Custom Science extension. 

The [Input](http://docs.kebooladocker.apiary.io/#reference/input) API call is useful for obtaining an 
environment configuration for a registered Docker extension (without encryption) or Transformations. 

The [Dry run](http://docs.kebooladocker.apiary.io/#reference/dry-run) API call is the last step.
It will do everything except output mapping and is therefore useful for debugging an existing application
in production without modifying files and tables in a KBC project.



