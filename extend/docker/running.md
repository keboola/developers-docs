---
title: Running Images
permalink: /extend/docker/running/
---

One of the great advantages of dockerized applications is that the applications always run in the
same environment defined by the docker image. When running in KBC there are however some outside
envrionment bindings you need to tak care of. Before you start make sure, you have
[docker setup correctly](/extend/docker/tutorial/setup/), particularly that you know
you *host path* for [sharing files](/extend/docker/tutorial/setup/sharing-files/). In this guide
we will use /Users/JohnDoe/data/ as the *host path* containing the 
[sandbox data folder](/extend/common-interface/sandbox/) 

## Basic run
Basic run command that we use is:

`docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 
--net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ 
-e KBC_CONFIGID=test-78 quay.io/keboola/docs-example-parameters

The `--volume` parameter makes sure that a `/data/` folder will be mounted into the image. This is used
to inject the input data and configuration into the image. Make sure not to put any spaces around `:`

The parameters `--memory` `--cpu-shares` and `--net` are component limits and are defined by the options you specify 
when [registering the application](/extend/registration/). Components maintained by Keboola have
their limits described in their documentation. 

The parameters `-e` define [environment variables](/extend/common-interface/environment/). When entering
enviroment variables on command line, take care NOT to put any spaces around `=` 

### Test it
Get a sample [data folder](/extend/docker/data-parameters.zip) and try running:

    docker run --volume=/Users/JohnDoe/data/:/data --memory=8192m --cpu-shares=1024 --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-78 quay.io/keboola/docs-docker-example-parameters

You should see output:

    All done

    Environment variables:
    KBC_RUNID: 123456789
    KBC_PROJECTID: 123
    KBC_DATADIR: /data/
    KBC_CONFIGID: test-78

And a file `destination.csv` will be created in your `data/out/tables/` directory, with contents:

    number,someText,double_number
    10,ab,20
    20,cd,40
    25,ed,50
    26,fg,52
    30,ij,60



[![Run in Postman](https://run.pstmn.io/button.png)](https://www.getpostman.com/run-collection/7dc2e4b41225738f5411)


In the [Quick Start](/extend/docker/quick-start/), we have shown how to basically run docker images 
in KBC environment. There are however some more details to consider - 
like [environment variables](/extend/common-interface/environment). You should be able to run
your image with basic parameters - [data folder sandbox](/extend/common-interface/sandbox) 
which is [properly mounted](/extend/docker/tutorial/sharing-files/):

     docker run --volume=/c/Users/ondre/data/:/data/ yourImageName


- command line
- environemnt
- datadirectory

When you need to debug the container, you can enter into it
-- entrpoint

When you need to debug a running application, you can enter into it
docker exec

The option `-i` and `-t` make the container run in *i*nteractive *t*erminal. The option 
`--entrypoint` overrides the `ENTRYPOINT` specified in the `Dockerfile`. This ensures that 
bash shell is run instead of your application. 

Your application will now have the contents of /data and simulate the KBC environment. Apart from the data directory you 
might want to work with environment variables. To do so, use the -e switch in docker run

`docker run --volume=/c/Users/JohnDoe/data:/data/ -e=KBC_PROJECT_ID:572 quay.io/keboola/doc-sample`

(make sure to put NO spaces around = and : characters)

For more details on see [Howto](/extend/docker/running/) You can now develop the application logic. 
When the image/container is run, it should produce result tables and files in the respective folders.

Running docker application

Running transformatinos

Running Custom science paplications
