---
title: Running Images
permalink: /extend/docker/running/
---

One of the great advantages of dockerized applications is that the applications always run in the
same environment defined by the docker image. When running in KBC there are however some outside
envrionment bindings you need to tak care of. Before you start, make sure, you have
[docker setup correctly](/extend/docker/tutorial/setup/), particularly that you know
you *host path* for [sharing files](/extend/docker/tutorial/setup/sharing-files/). In this guide
we will use /Users/JohnDoe/data/ as the *host path* containing the 
[sandbox data folder](/extend/common-interface/sandbox/).

Note that you can also run your application in your own environment and just use the `KBC_DATADIR` environment
variable to point it to the data directory. With this approach you loose the advantage of the properly defined 
environment, but in some cases it may be a nice shortcut. 

For more details on see [Howto Guide](/extend/docker/tutorial/howto/) for developing your own 
[docker extensions](/extend/docker/) or [Custom Science](/extend/custom-science). Regardles of   
which approach you take, when the image is run, it should consume tables and files in `in` subfolders and
produce result tables and files in the respective `out` subfolders.

Note: whenever we use version tags on docker repositories (such as quay.io/keboola/python-transformation:0.0.14),
please make sure to check that this is the current version in the docker repository.

## Basic run
Basic run command that we use is:

    `docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 quay.io/keboola/docs-docker-example-parameters

The `--volume` parameter makes sure that a `/data/` folder will be mounted into the image. This is used
to inject the input data and configuration into the image. Make sure not to put any spaces around `:`

The parameters `--memory` `--cpu-shares` and `--net` are component limits and are defined by the options you specify 
when [registering the application](/extend/registration/). Components maintained by Keboola have
their limits described in their documentation. 

The parameters `-e` define [environment variables](/extend/common-interface/environment/). When entering
enviroment variables on command line, take care NOT to put any spaces around `=` 

### Test it
Use a [sample data folder](/extend/docker/data-parameters.zip), extract it into your *host folder* and try running:

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 quay.io/keboola/docs-docker-example-parameters

You should see output:

    All done

    Environment variables:
    KBC_RUNID: 123456789
    KBC_PROJECTID: 123
    KBC_DATADIR: /data/
    KBC_CONFIGID: test-78

And a file `destination.csv` will be created in your *host folder* in `data/out/tables/` directory, with contents:

    number,someText,double_number
    10,ab,20
    20,cd,40
    25,ed,50
    26,fg,52
    30,ij,60

If you run into any errors, you can run the image interactively:

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 -i -t --entrypoint=/bin/bash quay.io/keboola/docs-docker-example-parameters

Then you can inspect the container with standard OS (CentOS) commands and/or run the script manually with
`php /home/main.php`

If you mastared this step, you can run any docker component on your machine. The following chapters describe 
some common situations, though there are only minor differences. 

## Running unregistered docker extension
Docker extensions which are not registered do not yet have their component Id. This is somewhat limiting, because you 
can get only sample of the data the component will receive by using 
the [Sandbox call](/extend/common-interface/sandbox/#sandbox). In the 
[API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/sandbox/create-a-sandbox-job) you need to manually 
specify the input/output mapping and parameters. The configuration format (JSON or Yaml) is specified by the 
`format` parameter in the URL.

[![Run in Postman](https://run.pstmn.io/button.png)](https://www.getpostman.com/run-collection/7dc2e4b41225738f5411)

You can use *Sandbox introduction* request for a simple start or more advanced *Sandbox Example* which has 
more configuration options. The request URL is e.g. `https://syrup.keboola.com/docker/sandbox?format=json`

To run the component use a command line, e.g: 

    `docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 
    --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ 
    -e KBC_CONFIGID=test-78 quay.io/keboola/docs-example-parameters

Where the path `/Users/JohnDoe/data/` referes to the contents of the data folder, which you
obtained in the above Sandbox API call (`data.zip` file stored in the *Storage* - *File uploads*) and
`quay.io/keboola/docs-example-parameters` should be replaced by your docker image name.


## Running registered docker extension
Docker extensions which are already [registered](/extend/register/) already have *component ID* 
(in form *vendor.componentName*, e.g. *keboola.docs-docker-example-parameters*). To obtain sample data for 
registered component you can use the [Input data](/extend/common-interface/sandbox/#input-data) call. 
In the [API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/input-data/create-an-input-job) you
can either specify the full configuration (using `configData` node) or refer to an existing configuration
of the component (using `config` node). The configuration format is now fixed to what was specified in component
registration.

[![Run in Postman](https://run.pstmn.io/button.png)](https://www.getpostman.com/run-collection/7dc2e4b41225738f5411)

You can use *Input Data introduction* request for sample request refering to an existing configuration or
*Input Data full example* for a request specifying the whole configuration. The request URL is 
e.g. `https://syrup.keboola.com/docker/keboola.docs-docker-example-parameters/input where you need to 
replace `keboola.docs-docker-example-parameters` with your component ID.

To run the component use a command line, e.g: 

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 quay.io/keboola/docs-docker-example-parameters

Where the path `/Users/JohnDoe/data/` referes to the contents of the data folder, which you
obtained in the above Input data API call (`data.zip` file stored in the *Storage* - *File uploads*)  and
`quay.io/keboola/docs-example-parameters` should be replaced by your docker image name.


Note: If your extension uses encryption, the Input Data API call will be disabled (for security reasons):

    This API call is not supported for components that use the 'encrypt' flag.

In that case you have to revert to the [Sandbox call](/extend/common-interface/sandbox/#sandbox).


## Running Custom Science Extensions
Running Custom Science extensions is sligtly more complicated, because their docker images are build dynamically
on execution. Also, because the Custom Science component uses encryption, you must use the  
the [Sandbox call](/extend/common-interface/sandbox/#sandbox). In the 
[API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/sandbox/create-a-sandbox-job) you need to manually 
specify the input/output mapping and parameters. The configuration format must be *JSON*.

[![Run in Postman](https://run.pstmn.io/button.png)](https://www.getpostman.com/run-collection/7dc2e4b41225738f5411)

You can use *Sandbox introduction* request for a simple start or more advanced *Sandbox Example* which has 
more configuration options. The request URL is e.g. `https://syrup.keboola.com/docker/sandbox?format=json`

### Custom Science R

You can run the image with:
  
    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 -i -t --entrypoint=/bin/bash/ [quay.io/keboola/docker-custom-r](https://quay.io/repository/keboola/docker-custom-r):1.0.2

Then:
    
    cd /data/

And then execute:

    git clone -b your_version --depth 1 your_repository /home/
    
e.g.
    
    git clone -b 0.0.2 --depth 1 https://github.com/keboola/docs-custom-science-example-r-parameters /home/ 

and then run the application with:

    Rscript /home/main.R
    
### Custom Science Python

You can run the image with:
  
    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 -i -t --entrypoint=/bin/bash/ [quay.io/keboola/docker-custom-python](https://quay.io/repository/keboola/docker-custom-python):0.0.4

Then:
    
    cd /data/

(Note: for running Python 2.x applications use image `quay.io/keboola/docker-custom-python2:0.0.2` )
Then execute:

    git clone -b your_version --depth 1 your_repository /home/
    
e.g.
    
    git clone -b 1.0.0 --depth 1 https://github.com/keboola/docs-custom-science-example-python-parameters.git /home/ 

and then run the application with:

    python /home/main.py


## Running transformations 
Both R and Python transformations are also implemented as docker components. This means that you can run those
locally too. Use the [Input data](/extend/common-interface/sandbox/#input-data) call. 
In the [API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/input-data/create-an-input-job) you
have to specify full configuration (using `configData` node). The configuration format is 

[![Run in Postman](https://run.pstmn.io/button.png)](https://www.getpostman.com/run-collection/7dc2e4b41225738f5411)

You can use *R Transformations* request for sample request. The only special thing about the request is that
the body of the transformation is passed in `parameters.script` node either as a string or as an
array of lines. The request URL is 
e.g. `https://syrup.keboola.com/docker/keboola.r-transformation/input` for R transformations
 or `https://syrup.keboola.com/docker/keboola.python-transformation/input` for Python transformations.

To run R transformations use: 

    `docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 [quay.io/keboola/r-transformation](https://quay.io/repository/keboola/r-transformation):0.0.8

To run Python transformations use: 

    `docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 [quay.io/keboola/python-transformation](https://quay.io/repository/keboola/python-transformation):0.0.14
 
The transformation will run automatically and produce results. If you want to get interactively into
the container, use the [`--entrypoint`](/docker/tutorial/howto/) parameter. 
