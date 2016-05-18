---
title: Background Jobs
permalink: /overview/jobs/
---

* TOC
{:toc}

Most operations (such as extracting data, running an application) are executed in KBC as
background (asynchronous) jobs. This means that when you trigger the operation (i.e. run an extractor), a
*job* is created and pushed into a *queue*. The job waits in the queue until it is picked up by a worker 
server, which actually executes it. The job queuing and
execution is fully automatic. So if you are working with asynchronous parts of your API, you need to 

- *create* a job
- and *wait* for it to finish. 

Different [components](/overview/) have different upper limits on how long can a job run,
from couple of seconds to several hours. 

## Job Ids
When a job is created, *JobId* is assigned to it. When the job is put into a queue, it gets *RunId* assigned. 
An executing job can spawn *child jobs* (sub-jobs) and become their *parent-job*. 
Usually, a parent job waits until all its child jobs have finished. 

A JobId refers to the job definition, to what should be done. RunId refers to the actual job execution, so 
one JobId may, though very rarely, have multiple RunIds. Jobs can be *hierarchically* organized. 
In such case, a child job's RunId contains parent's RunId as a prefix. 
For example, assume that a job with ID 123 is executed and assigned RunId 789. 
When it spawns a child job, that child job will have its JobId, for instance, `234`, and its RunId will have `789.` as a prefix, 
for example `789.876`. Jobs may be nested without limits, but in practice they don't go beyond three levels.

## Job Status
A job can have different statuses:

- created (right after it is created, but before it is put in a queue) 
- waiting (a job is in a queue, waiting to be picked up by a worker server)
- processing (job stuff is being done)
- success (job finished)
- error (job finished)
- warning (job finished, but some child job failed)
- terminating (user has requested to abort a job)
- cancelled (job was created, but it was aborted before its execution actually begun)
- terminated (job was created and it was aborted in the middle of execution)

## Creating and Running a Job
Usually, you need to know the *component URI* and *configurationId* to create a job. There are, however, 
more possibilities how a job can be created. To obtain a list of all components available
in the project, and their configuration, you can use the 
[corresponding API call](http://docs.keboola.apiary.io/#reference/component-configurations/list-components/get-components).
A sample of the response is below:

{% highlight json %}
[
  {
    "id": "ex-db",
    "type": "extractor",
    "name": "Database",
    "description": "Fetch data from MySQL, MSSQL, Oracle or PgSQL",
    "longDescription": null,
    "hasUI": true,
    "hasRun": true,
    "ico32": "",
    "ico64": "",
    "data": {},
    "flags": [],
    "configurationSchema": {},
    "emptyConfiguration": {},
    "configurationDescription": null,
    "uri": "https://syrup.keboola.com/ex-db",
    "configurations": [
      {
        "id": "sampledatabase",
        "name": "Sample database",
        "description": "",
        "created": "2016-03-29T12:26:17+0200",
        "creatorToken": {
          "id": 53044,
          "description": "ondrej.popelka@keboola.com"
        },
        "version": 1,
        "changeDescription": null
      }
    ]
  },
  ...
{% endhighlight %}

From there, the important part is the `uri` field and `configurations.id` field. For instance, in the 
above, there is a database extractor with `uri` `https://syrup.keboola.com/ex-db` and a 
configuration with id `sampledatabase`.

To [create a job](http://docs.keboolaconnector.apiary.io/#reference/sample-coponent) 
running that configuration, call `POST` to URL `https://syrup.keboola.com/ex-db/run` 
with the `X-StorageApi-Token` header containing your Storage token. 

When a job is created, you will obtain a response similar to this:

{% highlight json %}
{
  "id": 186985832,
  "runId": "186985833",
  "lockName": "ex-db-1134-sampledatabase",
  "project": {
    "id": 1134,
    "name": "Tutorial"
  },
  "component": "ex-db",
  "command": "run",
  "params": {
    "config": "sampledatabase"
  },
  "result": {},
  "status": "waiting",
  "process": {
    "host": "kbc-vpc-syrup-API-i-b1d16d36",
    "pid": 26675
  },
  "createdTime": "2016-05-15T18:14:47+02:00",
  "startTime": null,
  "endTime": null,
  "durationSeconds": null,
  "waitSeconds": null,
  "nestingLevel": 0,
  "isFinished": false,
  "_index": null,
  "_type": null,
  "url": "https://syrup.keboola.com/queue/job/186985832"
} 
{% endhighlight %}

This means that the job was created (and `waiting` in the queue) and will automatically start executing.
From the above response, the most important part is `url` which gives you URL of the resource for
[Job status polling](https://en.wikipedia.org/wiki/Polling_(computer_science)).  

## Job Polling
If you want to get the actual job result, poll the [Job API](http://docs.syrupqueue.apiary.io/#reference/jobs/job/view-job-detail) 
for the current state of the job. For example, to poll for the above job, you need to send a `GET` request to
`https://syrup.keboola.com/queue/job/186985832` with `X-StorageApi-Token` header containing your Storage token. 
You will receive a response similar to this:

{% highlight json %}
{
  "id": 186986553,
  "runId": "186986554",
  "lockName": "ex-db-1134-sampledatabase",
  "project": {
    "id": 1134,
    "name": "Tutorial"
  },
  "token": {
    "id": "53044",
    "description": "ondrej.popelka@keboola.com"
  },
  "component": "ex-db",
  "command": "run",
  "params": {
    "config": "sampledatabase"
  },
  "result": {},
  "status": "processing",
  "process": {
    "host": "kbc-vpc-syrup-WORKER-i-77963aea",
    "pid": 10200
  },
  "createdTime": "2016-05-15T18:38:32+02:00",
  "startTime": "2016-05-15T18:38:33+02:00",
  "endTime": null,
  "durationSeconds": null,
  "waitSeconds": null,
  "nestingLevel": 0,
  "error": null,
  "errorNote": null,
  "terminatedBy": {
    "id": null,
    "description": null
  },
  "encrypted": null,
  "_index": "prod_syrup_ex-db_2015_2",
  "_type": "jobs",
  "isFinished": false
}
{% endhighlight %}

From the above response, the most important part is the `status` field (`processing`, in this case)
at this time. To obtain the Job result, send the above API call once the job status changes
to one of the finished states (or use the `isFinished` field).  
 
## Working with Jobs
To work with Job API, you need two things:

- [the API to create a Job](http://docs.keboolaconnector.apiary.io/#reference/sample-coponent)
- [the API to poll Job status](http://docs.syrupqueue.apiary.io/#reference/jobs/job/view-job-detail)

The first API is specific for each component, so to obtain the actual URLs and parameters,
use the [Component API](http://docs.keboola.apiary.io/#reference/component-configurations/list-components/get-components).
The second API is generic for all components. To work with the API, use our 
[Syrup PHP Client](https://github.com/keboola/syrup-php-client). In case you want to implement things
yourself, copy the part of [Job Polling](https://github.com/keboola/syrup-php-client/blob/master/src/Keboola/Syrup/Client.php#L328). 

Note that there are some other special cases of asynchronous operations, which are 
in principle the same, but may differ in little details. The most common ones are:

- [Storage Jobs](http://docs.keboola.apiary.io/#reference/jobs/manage-jobs/job-detail), triggered e.g. by
[asynchronous imports](http://docs.keboola.apiary.io/#reference/tables/create-table-asynchronously/create-new-table-from-csv-file-asynchronously)
or [exports](http://docs.keboola.apiary.io/#reference/tables/table-export-asynchronously/asynchronous-export).
- [GoodData Writer Jobs](http://docs.keboolagooddatawriterv2.apiary.io/#introduction/synchronous-vs.-asynchronous-tasks) 

Apart from running predefined configurations with a `run` action, each component may
provide additional options to create an asynchronous background job or it may also support synchronous actions. 
