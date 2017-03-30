---
title: Running Generic Extractor
permalink: /extend/generic-extractor/running/
---

* TOC
{:toc}

Normally, you run Generic Extractor from within the KBC UI. You can find it in the `Extractors` section.
To run Generic Extractor, you have to only provide its configuration JSON. No other settings are necessary.

![todo](Screenshot - Generic Extractor Configuration)

Because creating the configuration JSON can be a non-trivial task, there are some things which can help 
you in developing the configuration.

## Debug Mode
Debug mode can be turned on by setting `debug: true` in the `config` section of the configuration, e.g:

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

In debug mode, the extractor displays all API requests it sends. This may help you understanding what is
really happening, why something is skipped, etc

![todo](Screenshot - Debug Logs)

**Warning:** If the API sends sensitive data (e.g. authorization token) in the URL, these may become
visible in the events. Also debug mode considerably slows the extraction. Therefore it should never
be turned on in production configurations.

## Running Locally
If you are working on a complicated configuration, or you are developing a new component based on 
Generic Extractor, running every configuration from KBC UI may be slow and tedious. 
You may run Generic Extractor locally, provided that you have installed [Docker](todo docker tutorial). 
This step is in no way necessary to run or configure generic extractor in KBC.

- run from ECR TODO
- build and run from source code TODO

## Running Examples
All examples references in this documentation are actually runnable against the proper API. Because
it is difficult to find the specific API for the case (and gain access to it). You can test 
these configurations against a [mock server](todo github repo). To run the examples, pull the 
Generic Extractor source code and run the script `doc/run_samples.sh`. If you want to create your 
own example, follow the instructions in the [mock server repository](todo github repo)
