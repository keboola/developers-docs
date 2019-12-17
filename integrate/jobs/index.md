---
title: Background Jobs
permalink: /integrate/jobs/
redirect_from: /overview/jobs/
---

* TOC
{:toc}

Most operations, such as extracting data or running an application are executed in KBC as
background, asynchronous jobs. When an operation is triggered, for example, you run an extractor, a
*job* is created and pushed into a *queue*. The job waits in the queue until it is picked up by a worker
server, which actually executes it. The job queuing and execution are fully automatic.
So, if you are working with asynchronous parts of your API, you need to

- *create* a job, and
- *wait* for it to finish.

[Components](/overview/) differ in their upper limits on how long can a job run,
from a couple of seconds to several hours.

## Job Ids
When a job is created, *JobId* is assigned to it. When the job is put into a queue, it gets its own *RunId*.
An executing job can spawn *child jobs* (sub-jobs) and become their *parent-job*.
Usually, a parent job waits until all its child jobs have finished.

A JobId refers to the job definition, to what should be done. RunId refers to the actual job execution. That is why
one JobId may, though very rarely, have multiple RunIds.

Jobs can be *hierarchically* organized.
In such case, a child job's RunId contains its parent's RunId as a prefix.
For example, assume that a job with ID 123 is executed and assigned RunId 789.
When it spawns a child job, that child job will have its JobId, for instance, `234`, and its RunId will have `789.` as a prefix,
for example `789.876`. Jobs may be nested without limits, but in practice they do not go beyond three levels.

## Job Status
A job can have different statuses:

- created (right after a job is created, but before it is put in a queue)
- waiting (a job is in a queue, waiting to be picked up by a worker server)
- processing (job stuff is being done)
- success (a job is finished)
- error (a job is finished)
- warning (a job is finished, but one of its child jobs failed)
- terminating (a user has requested to abort a job)
- cancelled (a job was created, but it was aborted before its execution actually began)
- terminated (a job was created and it was aborted in the middle of its execution)

## APIs for Working with Jobs
To create a Job, use our Docker Runner API described on [Apiary.io](https://kebooladocker.docs.apiary.io/#). Docker Runner
has API calls to

- create a job --- run a [component](/extend/component/),
- [encrypt values](/overview/encryption/),
- [prepare the data folder](/extend/component/running/#preparing-the-data-folder), and
- run a [component](/extend/component/) with a [specified docker image tag](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job-with-image/run-job), usable for [testing images](/extend/component/deployment/#test-live-configurations).

You also need a *Syrup Queue* API to [poll Job status](https://syrupqueue.docs.apiary.io/#reference/jobs/job/view-job-detail).

The first API requires a component parameter; use the [Component API](https://keboola.docs.apiary.io/#reference/component-configurations/list-components/get-components)
to get a list of components.
The second API is generic for all components. To work with the API, use our
[Syrup PHP Client](https://github.com/keboola/syrup-php-client). In case you want to implement things
yourself, copy the part of [Job Polling](https://github.com/keboola/syrup-php-client/blob/master/src/Keboola/Syrup/Client.php#L328).

Note that there are other special cases of asynchronous operations which are
in principle the same, but may differ in little details. The most common one is:
[Storage Jobs](https://keboola.docs.apiary.io/#reference/jobs/manage-jobs/job-detail), triggered, for instance, by
[asynchronous imports](https://keboola.docs.apiary.io/#reference/tables/create-table-asynchronously/create-new-table-from-csv-file-asynchronously)
or [exports](https://keboola.docs.apiary.io/#reference/tables/unload-data-asynchronously/asynchronous-export)

Apart from running predefined configurations with a `run` action, each component may
provide additional options to create an asynchronous background job, or it may also support synchronous actions.

The following diagram shows a typical flow of creating a job. Note that it is also possible to create a job without an existing
configuration --- using the `configData` field.

{: .image-popup}
![Asynchronous Jobs](/integrate/jobs/async-jobs.svg)

The highlighted [Docker Runner](/extend/docker-runner) part is described in a [separate article](/extend/docker-runner).

## Creating and Running a Job
You need to know the *component Id* and *configuration Id* to create a job. To obtain a list of all components available
in the project, and their configuration, you can use the
[corresponding API call](https://keboola.docs.apiary.io/#reference/component-configurations/list-components/get-components).
See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb).
A snippet of the response is below:

{% highlight json %}
[
  {
    "id": "keboola.ex-db-snowflake",
    "type": "extractor",
    "name": "Snowflake",
    "description": "Cloud-Native Elastic Data Warehouse Service",
    "uri": "https://syrup.keboola.com/docker/keboola.ex-db-snowflake",
    "documentationUrl": "https://github.com/keboola/db-extractor-snowflake/blob/master/README.md",
    "configurations": [
      {
        "id": "328864809",
        "name": "Sample database",
        "description": "",
        "created": "2017-11-06T13:28:48+0100",
        "creatorToken": {
          "id": 27865,
          "description": "ondrej.popelka@keboola.com"
        },
        "version": 3,
        "changeDescription": "Create query account",
        "isDeleted": false,
        "currentVersion": {
          "created": "2017-11-06T13:30:12+0100",
          "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
          },
          "changeDescription": "Create query account"
        }
      }
    ]
  }
]
{% endhighlight %}

From there, the important part is the `id` field and `configurations.id` field. For instance, in the
above, there is a database extractor with the `id` `keboola.ex-db-snowflake` and a
configuration with the id `328864809`.

Then use the [create a job](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job/run-job)
API call and pass the configuration ID in request body:

{% highlight json %}
{
    "config": "328864809"
}
{% endhighlight %}

See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb).
When a job is created, you will obtain a response similar to this:

{% highlight json %}
{
    "id": "328865608",
    "url": "https://syrup.keboola.com/queue/job/328865608",
    "status": "waiting"
}
{% endhighlight %}

This means that the job was created (and `waiting` in the queue) and will automatically start executing.
From the above response, the most important part is `url`, which gives you the URL of the resource for
[Job status polling](https://en.wikipedia.org/wiki/Polling_(computer_science)).

## Job Polling
If you want to get the actual job result, poll the [Job API](https://syrupqueue.docs.apiary.io/#reference/jobs/job/view-job-detail)
for the current state of the job. See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb).

You will receive a response similar to this:

{% highlight json %}
{
  "id": 328865608,
  "runId": "328865609",
  "lockName": "docker-572-keboola.ex-db-snowflake-328864809",
  "project": {
    "id": 572,
    "name": "Testing"
  },
  "token": {
    "id": "27865",
    "description": "ondrej.popelka@keboola.com"
  },
  "component": "docker",
  "command": "run",
  "params": {
    "config": 328864809,
    "component": "keboola.ex-db-snowflake",
    "mode": "run"
  },
  "result": {
    "message": "Component processing finished.",
    "images": [
      [
        {
          "id": "147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/keboola.ex-db-snowflake:1.2.5",
          "digests": [
            "147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/keboola.ex-db-snowflake@sha256:84aaf9ed2b233da38d47f6f53a386ae53f0d12dbb8c6046494923c0a173c25af"
          ]
        }
      ]
    ]
  },
  "status": "success",
  "process": {
    "host": "kbc-us-east-1-syrup-docker-i-0a8853007e0a668e1",
    "pid": 69880
  },
  "createdTime": "2017-11-06T13:35:41+01:00",
  "startTime": "2017-11-06T13:35:41+01:00",
  "endTime": "2017-11-06T13:36:23+01:00",
  "durationSeconds": 42,
  "waitSeconds": 0,
  "nestingLevel": 0,
  "encrypted": true,
  "error": null,
  "errorNote": null,
  "terminatedBy": {
    "id": null,
    "description": null
  },
  "usage": [],
  "_index": "prod_syrup_docker_2017_3",
  "_type": "jobs",
  "isFinished": true
}
{% endhighlight %}

From the above response, the most important part is the `status` field (`processing`, in this case)
at this time. To obtain the Job result, send the above API call once the job status changes
to one of the finished states or until `isFinished` is true.
