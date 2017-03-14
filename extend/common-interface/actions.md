---
title: Actions
permalink: /extend/common-interface/actions/
---

* TOC
{:toc}

Actions provide a way to execute very quick tasks in a single Docker extension, using a single code base.
The default component's action (`run`) executes as a background, asynchronous job. It is queued, has plenty of
execution time, and there are cases when you might not want to wait for it. Apart from the default `run`, there
can be synchronous actions with limited execution time and you must wait for them. When we refer to
**actions**, we mean *synchronous actions*. Using actions is fully optional.

## Use Case
For example, in our database extractor, the main task (`run` action) is the data extraction itself. But we also want to be
able to test the database credentials and list tables available in the database.
These tasks would be very helpful in the UI. It is not possible to do these things directly in the browser. Setting up a
separate application would bring an overhead of maintaining both the extractor's Docker image and the new application.

## Solution
For each registered Docker Extension or Custom Science App, you can specify other actions (apart from the default `run`). These
actions will be executed using the same Docker image, but [Docker Runner](/integrate/docker-bundle/) will wait for its execution and use
the returned value as the API response. So, these additional actions are executed *synchronously* and have a very
limited execution time (maximum 30 seconds).

![Docker Actions overview](/extend/common-interface/docker-actions.png)

The [configuration file](/extend/common-interface/config-file/#configuration-file-structure)
contains the `action` property with the name of the currently executed action. Just grab the value and act accordingly.
All actions must be explicitly specified when [registering](/extend/registration/) your component.

## Running Actions
Actions are available through the [API](http://docs.kebooladocker.apiary.io/#reference/actions/run-custom-docker-extension-action).
They do not load the configuration from Storage, so you need to fully specify the whole configuration in the request body.
If any of your parameters are encrypted, they will be decrypted before they are passed to your application.

Do not specify the `action` attribute in the request body, it is already in the URI. Use any of `parameters`,
`storage` or `runtime` inside the `configData` root element as you would when creating an asynchronous jobs. For instance:

{% highlight json %}

{
    "configData": {
        "parameters": {
            "key": "val"
        }
    }
}

{% endhighlight %}

*Note: use **https://docker-runner.keboola.com/** for running calling this part of the API.*

### Return Values

As the application output is passed back through the API, all output from an action **MUST** be JSON (except for errors).

If your application outputs an invalid JSON on its STDOUT, an application error will be raised.

## Handling User and Application errors

Actions use the same [exit codes](https://developers.keboola.com/extend/common-interface/environment/#return-values) as the default `run` action.

If an user or application error is detected, STDERR/STDOUT is handled as the message string and is returned to the user. The message is wrapped into a standardized structure.

For example

{% highlight python %}
print('user error message')
sys.exit(1)
{% endhighlight %}

yields this message on the API (HTTP status code 400)

{% highlight json %}
{
  "status": "error",
  "error": "User error",
  "code": 400,
  "message": "user error message",
  "exceptionId": "docker-7ed4c3b599776e8a2a84a7f185f5f7f2",
  "runId": 0
}
{% endhighlight %}

and 

{% highlight python %}
print('application error message')
sys.exit(2)
{% endhighlight %}

yields this message on the API (HTTP status code 500)

{% highlight json %}
{
  "status": "error",
  "error": "Application error",
  "code": 500,
  "message": "Contact support@keboola.com and attach this exception id.",
  "exceptionId": "docker-2a51922e0753cf78297ad6d384200206",
  "runId": 0
}
{% endhighlight %}

## Limits

Actions share the same limits as the default `run` action, only the execution time is limited to 30 seconds.
This time does not include pulling the Docker image.
