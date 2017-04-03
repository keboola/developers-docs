---
title: Running Generic Extractor
permalink: /extend/generic-extractor/running/
---

* TOC
{:toc}

Normally, you run Generic Extractor from within the KBC UI. You can find it in the `Extractors` section.
To run Generic Extractor, you only have to provide its configuration JSON. No other settings are necessary.

{: .image-popup}
![Screenshot - Generic Extractor Configuration](/extend/generic-extractor/configuration.png)

Because creating the configuration JSON can be a non-trivial task, there are some things which can help 
you in developing the configuration.

## Debug Mode
Debug mode can be turned on by setting `"debug": true` in the `config` section of the configuration, e.g:

{% highlight json %}
{
    "api": {
        ...
    },
    "config": {
        "debug": true,
        ...
    }
}
{% endhighlight %}

In debug mode, the extractor displays all API requests it sends. This may help you understanding what is
really happening, why something is skipped, etc.

{: .image-popup}
![Screenshot - Debug Logs](/extend/generic-extractor/events.png)

**Warning:** If the API sends sensitive data (e.g. authorization token) in the URL, these may become
visible in the events. Also debug mode considerably slows the extraction. Therefore it should never
be turned on in production configurations.

## Running Locally
If you are working on a complicated configuration, or you are developing a new component based on 
Generic Extractor, running every configuration from KBC UI may be slow and tedious. 
You may run Generic Extractor locally, provided that you have access to
[Docker](/extend/docker/tutorial/). 
This step is in **not necessary** to run or configure Generic Extractor in KBC.

### Run Built Version
Create an empty directory somewhere and in it create a `config.json` file with a
configuration you want to execute, e.g.:

{% highlight json %}
{
  "parameters": {
    "api": {
      "baseUrl": "https://api.github.com",
      "http": {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      }
    },
    "config": {
      "debug": true,
      "jobs": [
        {
          "endpoint": "/orgs/keboola/members",
          "dataType": "members"
        }
      ]
    }
  }
}
{% endhighlight %}

Then run Generic extractor in the current directory by executing the following command on *nix systems:

    docker run -v ($pwd):/data quay.io/keboola/generic-extractor:latest

or on Windows:

    docker run -v %cd%:/data quay.io/keboola/generic-extractor:latest

You should see:

    DEBUG: Using NO Auth [] []
    DEBUG: Using automatic conversion of single values to arrays where required. [] []
    DEBUG: GET /orgs/keboola/members HTTP/1.1 Host: api.github.com User-Agent: Guzzle/5.3.1 curl/7.38.0 PHP/7.0.17   [] []
    DEBUG: Analyzing members {"rowsAnalyzed":[],"rowsToAnalyze":7} []
    DEBUG: Processing results for __kbc_default. [] []
    INFO: Extractor finished successfully. [] []

And output tables created in `/out/tables` sub-directory of the current directory.
It is recommended to remove the contents of the `out/tables` directory before running the extractor again.

### Building and Running the Image

To build the container from source:

- Clone this repository: `git clone https://github.com/keboola/generic-extractor.git`
- Switch to the created directory: `cd generic-extractor`
- Build the container: `docker-compose build`
- Install dependencies locally: `docker-compose run --rm extractor composer install`
- Create **data folder** for configuration: `mkdir data`

To run the build container:

- Create a configuration file `config.json` in the **data folder**.
- Run extraction: `docker-compose run --rm extractor`.
- You will find the extracted data in the `out/tables` sub-directory of the **data folder**

Before running the extractor again, it is recommended to clear the `out` directory by
running `docker-compose run --rm extractor rm -rf data/out`.

## Running Examples
All examples referenced in this documentation are actually runnable against the proper API. Because
it is difficult to find the specific API for the case (and gain access to it). You can test 
these configurations against a [mock server](https://github.com/keboola/ex-generic-mock-server). 

To run the examples:

- Clone this repository: `git clone https://github.com/keboola/generic-extractor.git`
- Navigate to the documentation directory: `cd generic-extractor/doc`
- Run a single example of your choice -- e.g.: `docker-compose run -e "KBC_EXAMPLE_NAME=001-simple-job" extractor`
- The output will be available in `examples/001-simple-job/out/tables`
- Or run all examples by executing `./run-samples.sh`

If you want to create your own example, follow the instructions in the [mock server repository](https://github.com/keboola/ex-generic-mock-server/blob/master/README.md#creating-examples)
