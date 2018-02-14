---
title: Debugging
permalink: /extend/component/tutorial/debugging/
---

* TOC
{:toc}

Because all the components [run in an isolated environment](/extend/docker-runner/) it may be harder to debug them. There is no way to
examine the component while it is running. However there some options how the production environment can be
replicated locally, so that you can analyze what is happening if something is not right.

## Check Errors and Version
There are two [types of errors](/extend/common-interface/environment/#return-values), in case of
application errors, you (or any other end-user) will only see a generic error message in the job result:

    Internal Error Something is broken. Our developers were notified about this error and will let you know what went wrong.

At the same moment, you should receive a full error message on your vendor [channel for receiving errors](/extend/component/tutorial/#before-you-start) (typically a Slack
or email message). If you have not received a message or you don't have a channel for receiving errors, contact us to set it up.

Also, if the component is misbehaving, please double check that you are running the correct version. This can be checked in
job detail in the **Parameters & Results** section, where you can see the tag used to execute the job:

{: .image-popup}
![Screenshot -- Job Tags](/extend/component/tutorial/debug-1.png)

You should be able to trace the tag to specific version of your source code.

## Running Locally

### Step 1 -- Obtaining Sample Data and Configuration
Data between KBC and your Docker image are exchanged using [CSV files](/extend/common-interface/) in
designated [directories](/extend/common-interface/folders/); they will be
injected into the image when we [run it](/extend/docker-runner/). To simulate this, download an archive containing the data files
and [configuration](/extend/common-interface/config-file/) in the exact same format you get in the production environment.

Use the [Input data API call](https://kebooladocker.docs.apiary.io/#reference/sandbox/input-data/create-an-input-job).
You can see it in our [API requests collection](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#4c9c7c9f-6cd6-58e7-27e3-aef62538e0ba).
In the [API call](http://docs.kebooladocker.apiary.io/#reference/sandbox/input-data/create-an-input-job), either specify the
full configuration (using the `configData` node) or refer to an existing configuration
of the component (using the `config` node). See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#4c9c7c9f-6cd6-58e7-27e3-aef62538e0ba).

The Input data API call will prepare the data folder for the component and put it inside an archive and upload it to KBC Storage.
When running the request with valid parameters, you should receive a response similar to this:

{% highlight json %}
{
    "id": "176883685",
    "url": "https://syrup.keboola.com/queue/job/176883685",
    "status": "waiting"
}
{% endhighlight %}

This means an [asynchronous job](/integrate/jobs/) which will prepare the archive has been created.
If curious, view the job progress under **Jobs** in KBC.
When the job finishes, you'll see a `data.zip` file uploaded to your project.
The job will be usually executed very quickly, so you might as well go straight to **Storage** --- **Files** in
KBC.

{: .image-popup}
![Screenshot -- Job Tags](/extend/component/tutorial/debug-2.png)

You can send the Input API call with a reference to existing configuration id, or you can also supply the configuration directly in
the API request. In such case, use the `configData` attribute in request body, e.g.:

{% highlight json %}
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
{% endhighlight %}

The above request corresponds to the following setting in the UI:

{: .image-popup}
![Configuration Screenshot](/extend/component/tutorial/configuration-sample.png)

### Step 2 -- Build the Image
Then you can build your component code locally:

    docker build path/to/component/code --tag=my-component

or

    docker build . --tag=my-component

in the component directory. It should produce output similar to the one below:

{: .image-popup}
![Screenshot -- Building](/extend/component/tutorial/debug-3.png)

### Step 3 -- Running Component with Sample Data
Once you have prepared the data folder with sample data and configuration, inject it into the Docker Image.
In addition to the options shown in the example, there are many [other options](/extend/common-interface/config-file/) available.

When you run an image, a *container* is created in which the component is running isolated.
Use the following command to run the image:

    docker run --volume=physicalhostpath:/data/ imageTag

An Image tag is the tag you supplied in the `--tag` parameter for `docker build` (`my-component` in the above example).
The physical host path depends on the system you are running. If in doubt,
see [Setting up Docker](/extend/component/docker-tutorial/setup/#sharing-files). In our example image with default Windows
installation of Docker, this would be:

    docker run --volume=C:\Users\JohnDoe\data\:/data/ my-component

Where the contents of the sample data folder are put in the user's home directory. If you have set everything correctly,
you should see **Hello world from python**; and a `destination.csv` file will appear in the `data/out/tables/` folder.

{: .image-popup}
![Screenshot -- Running](/extend/component/tutorial/debug-4.png)

You can then examine what the component did, and what files it produced in the `data/out` folder. You can
also read more in-depth information about [Running images](/extend/component/running/).

### Step 4 -- Debugging
Chances are that you received an ugly error message or warning. In that case, you might want to check the
contents of the image; specifically, if all the files are where you expect
them to be.

To work with the component container interactively, use the following command:

    docker run --volume=physicalhostpath:/data/ -i -t --entrypoint=/bin/bash imageTag

For instance:

    docker run --volume=C:\Users\JohnDoe\data\:/data/ -i -t --entrypoint=/bin/bash my-component

This will override the default command specified in the `Dockerfile` -- `CMD ["python", "-u", "/code/main.py"]`
to launch [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) instead. The [`-i` and `-t` flags](https://docs.docker.com/engine/reference/commandline/run/)
ensure that the container runs in interactive mode.
You can then inspect the container contents: 'ls /data/'. For more details, see [Howto](/extend/component/docker-tutorial/howto/).

### Step 4 -- Modifying
Chances are that you want to modify the component code often. If you modify the component code, you have to rebuild the
docker image. This is slow and tedious. Instead, you can run the image with the following command:

    docker run --volume=physicalhostpathtodata:/data/ --volume=physicalhostpathtocode:/code/ -i -t my-component

For instance:

    docker run --volume=C:\Users\JohnDoe\data\:/data/ --volume=D:\wwwroot\ex-docs-tutorial\:/code/ -i -t my-component

This means that the directory with the component code will shadow the one inside the image (defined by the `COPY . /code/`
instruction in `Dockerfile`) and you will run the current code in the image environment.

## Running Specific Tags
The Input data API call has its limitations, namely, it cannot run when encryption is enabled.
In such situations, an alternative may be to run a specific image tag.

Let's say that you need to list all files on input for some reason. Following the
[example component](/extend/component/tutorial/), you would have to add something like this
to the component code:

{% highlight python %}
from os import listdir

mypath = '/data/in/tables'
onlyfiles = [f for f in listdir(mypath)]
print(onlyfiles)
{% endhighlight %}

Since you are debugging, it is not wise to add this for all customers. Therefore you can commit
the code and tag it with some **non-**[normal version tag](https://semver.org/#spec-item-2) -- for example `0.0.7-test`.
Such tag will be deployed as a docker image, but it won't (automatically) update in the
Developer Portal. That means the previous tag will be still used for all jobs. But, you can
manually run the new tag, using the [Run Tag API call](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job-with-image/run-job). Again, feel free to use our [collection](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#e8adcb14-951c-6199-2484-367ad6620c08).

So if you added the above debug code to component `keboola-test.ex-docs-tutorial` and
tagged the release `0.0.7-test`. You can run a configuration `354678919` by issuing the
following API call:

    curl -X POST \
    https://syrup.keboola.com/docker/keboola-test.ex-docs-tutorial/run/tag/0.0.7-test \
    -H 'Content-Type: application/json' \
    -H 'X-StorageApi-Token: your-token' \
    -d '{
    "config": "354678919"
    }'

In the job detail, you'll see under **Parameters & Results** that a specific tag was requested. In the job events, you can then see that it was indeed used and
that the script printed out all files in `/data/in/tables/` folder

{: .image-popup}
![Screenshot -- Image Results](/extend/component/tutorial/debug-4.png)

## Summary
You can find more information about [running components](/extend/component/running/) in the
corresponding part of the [documentation](/extend/component/running/).
This concludes our development tutorial which showed the most important aspects of creating components for KBC. Our platform offers a lot more features,
so we encourage you to read more in our documentation:

- exchanging data in [data folders](/extend/common-interface/folders/)
- [manifest files](/extend/common-interface/manifest-files/)
- [OAuth support](/extend/common-interface/oauth/)
- or general information about the [common interface](/extend/common-interface/)
- [deployment settings](/extend/component/deployment/)
- [UI settings](/extend/component/ui-options/)
- [Running components locally](/extend/component/running/)
