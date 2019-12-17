---
title: Running Components
permalink: /extend/component/running/
redirect_from:
    - /extend/docker/running/
    - /extend/common-interface/sandbox/
---

* TOC
{:toc}

One of the great advantages of dockerized components is that the components always run in the
same environment defined by the Docker image. When running in KBC, there are, however, some outside
environment bindings for you to take care of.

Before you start, make sure you have [Docker set up correctly](/extend/component/docker-tutorial/setup/),
particularly that you know your **host path** for [sharing files](/extend/component/docker-tutorial/setup#sharing-files)
and that you understand the basic concepts of creating a [Dockerized application](/extend/component/docker-tutorial/howto/).
In this guide, we will use `/user/johndoe/data/` as the **host path** containing the
[data folder](/extend/common-interface/folders/).

You can also run your component in your own environment. In that case, set the `KBC_DATADIR` environment
variable to point to the data folder. With this approach, you loose the advantage of the properly defined
environment, but in some cases, it may be a nice shortcut.

For more details on how to develop a component, see the corresponding [tutorial](/extend/component/tutorial/),
especially the part on [debugging](/extend/component/tutorial/debugging/).

## Basic Run
The basic run command we use (assuming that we want to run the
[`keboola-test.ex-docs-tutorial`](https://github.com/keboola/ex-docs-tutorial) component) is as follows:

    docker run --volume=/user/johndoe/data/:/data --memory=4000m --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-123 quay.io/keboola/keboola-test.ex-docs-tutorial

The `--volume` parameter ensures the `/data/` folder will be mounted into the image. This is used
to inject the input data and configuration into the image. Make sure not to put any spaces around the `:` character.

The `--memory` and `--net` parameters are component limits and are specified in the [Developer Portal](https://components.keboola.com/).

The `-e` parameters define [environment variables](/extend/common-interface/environment/). When entering
environment variables on the command line, do **not** put any spaces around the `=` character.

### Test
Download our [sample data folder](/extend/data.zip), extract it into your **host folder**, and run this command:

    docker run --volume=/user/johndoe/data/:/data --memory=4000m --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-123 quay.io/keboola/keboola-test.ex-docs-tutorial

You should see the following output:

    All done

    Environment variables:
    KBC_RUNID: 123456789
    KBC_PROJECTID: 123
    KBC_DATADIR: /data/
    KBC_CONFIGID: test-123

In addition, the `destination.csv` file will be created in your **host folder** in the `data/out/tables/` folder, with the following contents:

    number,someText,double_number
    10,ab,20
    20,cd,40
    25,ed,50
    26,fg,52
    30,ij,60

If you encounter any errors, you can run the image interactively:

    docker run --volume=/user/johndoe/data/:/data --memory=4000m --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-123 -i -t --entrypoint=/bin/bash quay.io/keboola/keboola-test.ex-docs-tutorial

Then you can inspect the container with standard OS (CentOS) commands and/or run the script manually with
`php /home/main.php`.

After you have mastered this step, you can run any Docker component on your machine.

## Debugging
There are two API calls available for debugging purposes:

  - [Debug](https://kebooladocker.docs.apiary.io/#reference/debug/debug-component/create-a-debug-job)
  - [Run Tag](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job-with-image/create-a-dry-run-job)

The [Debug](https://kebooladocker.docs.apiary.io/#reference/debug) API call is useful for obtaining an
environment configuration for a component. It will create a snapshot of the
[data folder](/extend/common-interface/folders/)
(including input mapping and configuration files) and then it will upload the snapshot to the [Files section](https://help.keboola.com/storage/file-uploads/)
of Storage. Then the component will be run and another snapshot will be created with the resulting contents of the data directory.
This gives you snapshots of the data directory before and after a component is run. The debug
API call does not write any tables or files (other than the archive) to the KBC project, so it is very safe to run. Note however that
any side effects of the component are still performed (e.g. writers still write data to their destination).

The [Run Tag](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job-with-image/create-a-dry-run-job)
API call allows you to run a job in the production environment but using a specific tag of the Docker image.
This means you can test your unreleased image on real configurations in real projects without affecting
any users using that component. See the [tutorial](/extend/component/tutorial/debugging/#running-specific-tags)
for instructions.

## Preparing Data folder
In order to run and debug a KBC component (including [R](https://help.keboola.com/manipulation/transformations/r/) and [Python](https://help.keboola.com/manipulation/transformations/python/) Transformations)
on your own computer, you need to manually supply the component with
a [data folder and configuration file](/extend/common-interface/). The above mentioned
[Debug API call](https://kebooladocker.docs.apiary.io/#reference/debug/debug-component/create-a-debug-job)
is designed to do that.

We recommend that you use [Apiary or Postman](/overview/api/) to call the API.
A [collection of examples](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb) of the
Debug API calls is available in Postman Docs.

### Prepare
[Create a table](https://help.keboola.com/tutorial/load/) in KBC Storage.
In the following example, the table is stored in the `in.c-main` bucket and is called `sample`. The table ID is
therefore `in.c-main.sample`. You also need a [Storage API token](https://help.keboola.com/storage/tokens/).

{: .image-popup}
![Storage Screenshot](/extend/component/running/sandbox-data.png)

### Running without Configuration
In the [collection of sample requests](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb),
there is a **Run without Configuration** example with the following JSON in its body:

{% highlight json %}
{
	"configData": {
		"storage": {
			"input": {
				"tables": [
					{
						"source": "in.c-main.sample",
						"destination": "source.csv"
					}
				]
			}
		},
		"parameters": {
			"sound": "Moo",
			"repeat": 2
		}
	}
}
{% endhighlight %}

The node `configData.storage.input.tables.source` refers to the existing table ID (the table created
in the previous step) in Storage. The `configData.storage.input.tables.destination` node refers to the
destination to which the table will be downloaded for the component; it will therefore be the
**source** for the component.

The entire `configData.storage` node is generated by the UI. The node `parameters` contains arbitrary
parameters which are passed to the component. The URL of the request
is `https://syrup.keboola.com/docker/{{componentId}}/input` (in the [US Region](/overview/api/#regions-and-endpoints)).
The request body is in JSON. Replace the `componentId` by the ID of the component for which you
want to generate the config file (e.g., `keboola-test.ex-docs-tutorial`). Enter your Storage API token
into **X-StorageAPI-Token** header and run the request.

### Running with Configuration
In the [collection of sample requests](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb),
there is a **Run with Configuration** example with the the following JSON in its body:

{% highlight json %}
{
    "config": "328831433"
}
{% endhighlight %}

When you create a configuration in KBC, it is assigned a configuration ID --- `328831433` --- in our example.
Use this ID instead of manually crafting the request body. You need to replace `328831433` with your own
configuration ID. The request URL is as follows:

{: .image-popup}
![Configuration screenshot](/extend/component/running/input-configuration.png)

You can create a configuration for non-public components by visiting the direct URL:

    https://connection.keboola.com/admin/projects/{PROJECT_ID}/extractors/{COMPONENT_ID}

In this case replace `COMPONENT_ID` with `keboola-test.ex-docs-tutorial` and PROJECT_ID with the id of your testing project.

**Important**: If you actually want to **run** the above 328831433 configuration, you also need
to set the output mapping from `destination.csv` to a table.

### Getting Result
When running the request with valid parameters, you should receive a response similar to this:

{% highlight json %}
{
    "id": "176883685",
    "url": "https://syrup.keboola.com/queue/job/176883685",
    "status": "waiting"
}
{% endhighlight %}

This means that an [asynchronous job](/integrate/jobs/) which will prepare the archive of the data folder has been created.
If curious, view the job progress under **Jobs** in KBC:

{: .image-popup}
![Job progress screenshot](/extend/component/running/sandbox-progress.png)

The job will usually take slightly longer than the normal run job. When finished go to **Storage** --- **Files** in
KBC. There you will find a `stage_0.zip` file with the data folder before the component was run and `stage_output.zip` before
the component output mapping was supposed to be done. You can now use this folder from `stage_0.zip` to run
the component locally. You should now be able to run the component with it:

    docker run --volume=/user/johndoe/data/:/data --memory=4000m --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-123 -i -t --entrypoint=/bin/bash quay.io/keboola/keboola-test.ex-docs-tutorial


## Running Component
If you want to run a component during development, it is the easiest to build it locally and
[run the built version](/extend/component/tutorial/debugging/). If you want to run a production code component, you
need to do a couple of things. Let's assume you want to run the `keboola-test.ex-docs-tutorial` component and you have
already [prepared the data directory](#preparing-the-data-folder).

The next step is to obtain the repository settings and credentials from the
[Developer Portal](https://components.keboola.com/). You can either use the [API](https://kebooladeveloperportal.docs.apiary.io/#) or
the [CLI](https://github.com/keboola/developer-portal-cli-v2). The CLI is easier to use. First set your service account credentials
in the environment:

    export KBC_DEVELOPERPORTAL_USERNAME=keboola-test+ex_docs_tutorial_travis
    export KBC_DEVELOPERPORTAL_PASSWORD=RFlYs3HnDkbzyXIUkdPFRMubiCK-FTjy5-tNXrdzRX3qEBLvDQjnxFtAJGzg6UO.

or

    SET KBC_DEVELOPERPORTAL_USERNAME=keboola-test+ex_docs_tutorial_travis
    SET KBC_DEVELOPERPORTAL_PASSWORD=RFlYs3HnDkbzyXIUkdPFRMubiCK-FTjy5-tNXrdzRX3qEBLvDQjnxFtAJGzg6UO.

on Windows. Then run the command to obtain the component repository:

    docker run --rm  -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD quay.io/keboola/developer-portal-cli-v2 ecr:get-repository vendor component-id

for example:

    docker run --rm  -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD quay.io/keboola/developer-portal-cli-v2 ecr:get-repository keboola-test keboola-test.ex-docs-tutorial

You will receive the repository URI, e.g.:

    147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/keboola-test.ex-docs-tutorial

Then call a command to obtain credentials for the component repository:

    docker run --rm -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD quay.io/keboola/developer-portal-cli-v2 ecr:get-login vendor component-id

for example:

    docker run --rm -e KBC_DEVELOPERPORTAL_USERNAME -e KBC_DEVELOPERPORTAL_PASSWORD quay.io/keboola/developer-portal-cli-v2 ecr:get-login keboola-test keboola-test.ex-docs-tutorial

You will receive a `docker login` command which will authorize you to fetch the repository:

    docker login -u AWS -p ey...ODAzOH0= 147946154733.dkr.ecr.us-east-1.amazonaws.com

Then pull the image from the registry:

    docker pull 147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/keboola-test.ex-docs-tutorial

Or run it directly:

    docker run --volume=/user/johndoe/data/:/data --memory=4000m --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-123 147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/keboola-test.ex-docs-tutorial

The `/user/johndoe/data/` path refers to the contents of the data folder.

**Note for Windows users:**
If you receive the error `The stub received bad data.`, you have to modify the `%userprofile%\.docker\config.json` to e.g.:
{% highlight json %}
{
	"auths": {
		"https://index.docker.io/v1/": {
			"email": "email@example.com"
		}
	}
}
{% endhighlight %}

This is a known [bug in Docker](https://github.com/docker/for-win/issues/1306), see [the workaround](https://github.com/Azure/azure-cli/issues/4843).

## Running Transformations
Both R and Python transformations are implemented as Docker components. They can be run
locally as well. Use the [Debug API](/extend/component/running/#preparing-the-data-folder) call to obtain the data directory.
In the [API call](https://kebooladocker.docs.apiary.io/#reference/debug/debug-component/create-a-debug-job), specify the full
configuration (using the `configData` node). See [examples](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb)
for both R and Python transformations.

To run R transformations, use:

    docker run --volume=/user/johndoe/data/:/data --memory=4000m --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-123 [quay.io/keboola/r-transformation](https://quay.io/repository/keboola/r-transformation):latest

To run [Python transformations](https://quay.io/repository/keboola/python-transformation), use:

    docker run --volume=/user/johndoe/data/:/data --memory=4000m --net=bridge -e KBC_RUNID=123456789 -e KBC_PROJECTID=123 -e KBC_DATADIR=/data/ -e KBC_CONFIGID=test-123 quay.io/keboola/python-transformation:latest

The transformation will run automatically and produce results. If you want to get into
the container interactively, use the [`--entrypoint`](/extend/component/docker-tutorial/howto/) parameter.
