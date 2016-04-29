---
title: Actions
permalink: /extend/common-interface/actions/
---

* TOC
{:toc}

Actions provide a way to execute more tasks in a single application, from a single code base. 

## Use Case

In our database extractor the main task is the data extraction itself. But we also want to be 
able to test the credentials (using SSH tunnel and SSL connection) and list tables available in the database. 
These tasks would be very helpful in the UI. It's not possible to do these things directly in the browser, setting up a 
separate application would bring an overhead of maitaining both the extractor's Docker image and the new application. 

## Solution

The default component's action (`run`) executes as an asynchronous job. It's queued, has plenty of execution time and you don't 
wait for it. 

For each Docker Extension or Custom Science App you can specify other tasks (actions) apart from `run`. These 
tasks will be executed using the same Docker image, but Docker Runner will wait for its execution and use 
the returned value as the API response. So these additional actions are executed synchronously and have a very 
limited execution time.   

## Changing Your Application

If you don't want to use actions, there's no need to change the code of your application. 

If you find them useful, the [configuration file](/extend/common-interface/config-file/#configuration-file-structure) 
contains the `action` property, which contains the name of the action. Just grab the value and act accordingly.

You will also need to register the [actions](/extend/registration/) with the component.

## Running Actions

These actions are available through the [API](http://docs.kebooladocker.apiary.io/#reference/actions). As the actions 
do not load the configuration from Storage, you need to fully specify the whole configuration. If any of your parameters 
are encrypted, they will be decrypted before passing to your application. 

Do not specify the `action` attribute in the request body. It's already in the URI. Use any of `parameters`, 
`storage` or `runtime` as you would when storing the configuration to Storage.

*Note: use https://syrup-docker.keboola.com/ for running calling this part of the API.*

### Exit Codes

Actions use the same [exit codes](https://developers.keboola.com/extend/common-interface/environment/#return-values) as default `run` action.

### Return Values

As the output of the application is passed back through the API, all output from actions MUST be JSON (except for application error, exit code 2).
 
If your application will output an invalid JSON on its STDOUT, an application error will be raised.

## Limits

Actions share the same limits as the default `run` action, only the execution time is limited to 30 seconds. 
This time does not include pulling the image.
