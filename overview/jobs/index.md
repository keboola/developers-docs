---
title: Background Jobs
permalink: /overview/jobs/
---

* TOC
{:toc}

Most operations, such as extracting data, or running an application are executed in KBC as
background, asynchronous, jobs. When an operation is triggered, for example, you run an extractor, a
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
- warning (a job is finished, but some child job failed)
- terminating (a user has requested to abort a job)
- cancelled (a job was created, but it was aborted before its execution actually began)
- terminated (a job was created and it was aborted in the middle of its execution)

## Creating and Running a Job
Usually, you need to know the *component URI* and *configurationId* to create a job. There are, however,
more possibilities how a job can be created. To obtain a list of all components available
in the project, and their configuration, you can use the
[corresponding API call](http://docs.keboola.apiary.io/#reference/component-configurations/list-components/get-components).
Which is a GET request to `https://connection.keboola.com/v2/storage/components`, containing your Storage Token in
`X-StorageAPI-Token` header.
A sample of the response is below:

{% highlight json %}
  ...
  {
    "id": "keboola.ex-db-mysql",
    "type": "extractor",
    "name": "MySQL",
    "description": "World's most popular open source database",
    "longDescription": "Extracts data from [MySQL](https://www.mysql.com/) Database.",
    "hasUI": false,
    "hasRun": false,
    "ico32": "https://d3iz2gfan5zufq.cloudfront.net/images/cloud-services/wr-db-mysql-32-1.png",
    "ico64": "https://d3iz2gfan5zufq.cloudfront.net/images/cloud-services/wr-db-mysql-64-1.png",
    "data": {
      "definition": {
        "type": "quayio",
        "uri": "keboola/db-extractor-mysql",
        "tag": "0.0.13"
      },
      "synchronous_actions": [
        "testConnection"
      ]
    },
    "flags": [
      "encrypt",
      "genericDockerUI"
    ],
    "configurationSchema": {},
    "emptyConfiguration": {},
    "configurationDescription": null,
    "uri": "https://syrup.keboola.com/docker/keboola.ex-db-mysql",
    "documentationUrl": "http://wiki.keboola.com/home/keboola-connection/user-space/extractors/next-generation-generic-extractor-tutorial/ex-db-mysql",
    "configurations": [
      {
        "id": "sampledatabase",
        "name": "sample-database",
        "description": "",
        "created": "2016-05-27T23:26:53+0200",
        "creatorToken": {
          "id": 53044,
          "description": "ondrej.popelka@keboola.com"
        },
        "version": 2,
        "changeDescription": ""
      }
    ]
  },
  ...
{% endhighlight %}

From there, the important part is the `uri` field and `configurations.id` field. For instance, in the
above, there is a database extractor with `uri` `https://syrup.keboola.com/docker/keboola.ex-db-mysql` and a
configuration with id `sampledatabase`.

To [create a job](http://docs.keboolaconnector.apiary.io/#reference/sample-coponent)
running that configuration, call `POST` to URL `https://syrup.keboola.com/docker/keboola.ex-db-mysql/run`
with the `X-StorageApi-Token` header containing your Storage token and with request body:

{% highlight json %}
{
    "config": "sampledatabase"
}
{% endhighlight %}

When a job is created, you will obtain a response similar to this:

{% highlight json %}
{
  "id": "189164612",
  "url": "https://syrup.keboola.com/queue/job/189164612",
  "status": "waiting"
}
{% endhighlight %}

This means that the job was created (and `waiting` in the queue) and will automatically start executing.
From the above response, the most important part is `url` which gives you URL of the resource for
[Job status polling](https://en.wikipedia.org/wiki/Polling_(computer_science)).

## Job Polling
If you want to get the actual job result, poll the [Job API](http://docs.syrupqueue.apiary.io/#reference/jobs/job/view-job-detail)
for the current state of the job. For example, to poll for the above job, send a `GET` request to
`https://syrup.keboola.com/queue/job/189164612` with `X-StorageApi-Token` header containing your Storage token.
You will receive a response similar to this:

{% highlight json %}
{
  "id": 189164918,
  "runId": "189164919",
  "lockName": "docker-1134-keboola.ex-db-mysql-sampledatabase",
  "project": {
    "id": 1134,
    "name": "Tutorial"
  },
  "token": {
    "id": "53044",
    "description": "ondrej.popelka@keboola.com"
  },
  "component": "docker",
  "command": "run",
  "params": {
    "config": "sampledatabase",
    "component": "keboola.ex-db-mysql",
    "mode": "run"
  },
  "result": {},
  "status": "processing",
  "process": {
    "host": "kbc-vpc-syrup-docker-worker-i-f14fe56c",
    "pid": 17116
  },
  "createdTime": "2016-05-29T09:39:28+02:00",
  "startTime": "2016-05-29T09:39:29+02:00",
  "endTime": null,
  "durationSeconds": null,
  "waitSeconds": null,
  "nestingLevel": 0,
  "encrypted": true,
  "error": null,
  "errorNote": null,
  "terminatedBy": {
    "id": null,
    "description": null
  },
  "_index": "prod_syrup_docker_2015_2",
  "_type": "jobs",
  "isFinished": false
}
{% endhighlight %}

From the above response, the most important part is the `status` field (`processing`, in this case)
at this time. To obtain the Job result, send the above API call once the job status changes
to one of the finished states (or use the `isFinished` field).

## Working with Jobs
To work with Job API, you need two things:

- [API to create a Job](http://docs.keboolaconnector.apiary.io/#reference/sample-coponent)
- [API to poll Job status](http://docs.syrupqueue.apiary.io/#reference/jobs/job/view-job-detail)

The first API is specific for each component, so to obtain the actual URLs and parameters,
use the [Component API](http://docs.keboola.apiary.io/#reference/component-configurations/list-components/get-components).
The second API is generic for all components. To work with the API, use our
[Syrup PHP Client](https://github.com/keboola/syrup-php-client). In case you want to implement things
yourself, copy the part of [Job Polling](https://github.com/keboola/syrup-php-client/blob/master/src/Keboola/Syrup/Client.php#L328).

Note that there are some other special cases of asynchronous operations which are
in principle the same, but may differ in little details. The most common ones are:

- [Storage Jobs](http://docs.keboola.apiary.io/#reference/jobs/manage-jobs/job-detail), triggered, for instance, by
[asynchronous imports](http://docs.keboola.apiary.io/#reference/tables/create-table-asynchronously/create-new-table-from-csv-file-asynchronously)
or [exports](http://docs.keboola.apiary.io/#reference/tables/table-export-asynchronously/asynchronous-export)
- [GoodData Writer Jobs](http://docs.keboolagooddatawriterv2.apiary.io/#introduction/synchronous-vs.-asynchronous-tasks)

Apart from running predefined configurations with a `run` action, each component may
provide additional options to create an asynchronous background job, or it may also support synchronous actions.
