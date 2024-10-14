---
title: Data Streams Tutorial
permalink: /integrate/data-streams/tutorial/
redirect_from: /integrate/push-data/tutorial/
---

* TOC
{:toc}


In this tutorial, we will set up a source for the [`issues`](https://docs.github.com/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#issues) event from GitHub Webhooks. This will allow you to monitor and analyse activity relating to issues in any of your GitHub repositories.

You will need your project's master token, and a GitHub repository in which you have the `Admin` role.

### Creating a Source

To start ingesting events, you must first create a source. Send the following payload to the `https://stream.keboola.com/v1/branches/{branchId}/sources` endpoint:
```
{
  "name": "Github Issues",
  "exports": [
    {
      "name": "Events",
      "conditions": { "count": 1 },
      "mapping": {
        "tableId": "in.c-github.issues",
        "columns": [
          {
            "primaryKey": true,
            "type": "id",
            "name": "id"
          },
          { "type": "datetime", "name": "datetime" },
          { "type": "ip", "name": "ip" },
          { "type": "body", "name": "body" },
          { "type": "headers", "name": "headers" },
          {
            "type": "path",
            "name": "id",
            "path": "issue.id",
            "defaultValue": "undefined", 
            "rawString": true
          },
          {
            "type": "template",
            "name": "template",
            "template": {
              "language": "jsonnet",
              "content": "'#' + Body('issue.id') + ': ' + Body('issue.body', 'n/a')"
            }
          }
        ]
      }
    }
  ]
}
```

You can do this using `curl`, or anything else that allows you to send an HTTP request:
```
$ curl --header 'Content-Type: application/json' \
       --header 'X-StorageApi-Token: <YOUR_TOKEN>' \
       --data '{ ...the payload above... }' \
       https://stream.keboola.com/v1/branches/{branchId}/sources
```

The response will contain the task that has been created:
```
{
  "id": "2023-02-16T16:04:39.570Z_Pg7U4",
  "sourceId": "github-issues",
  "url": "https://stream.keboola.com/v1/branches/{branchId}/sources/github-issues/tasks/source.create/2023-02-16T16:04:39.570Z_Pg7U4",
  "type": "source.create",
  "createdAt": "2023-02-17T11:20:57.406Z",
  "isFinished": false,
  "result": ""
}
```

You can query the task's status by querying the `url` field and wait until the `isFinished` field is set to `true`:
```
{
  "id": "2023-02-16T16:04:39.570Z_Pg7U4",
  "sourceId": "github-issues",
  "url": "https://stream.keboola.com/v1/branches/{branchId}/sources/github-issues/tasks/source.create/2023-02-16T16:04:39.570Z_Pg7U4",
  "type": "source.create",
  "createdAt": "2023-02-17T11:20:57.406Z",
  "finishedAt": "2023-02-17T11:20:57.753Z",
  "isFinished": true,
  "duration": 343,
  "result": "source created"
}
```

Upon success, query the source url `https://stream.keboola.com/v1/branches/{branchId}/sources/github-issues` and the response will contain the source you've just created:
```
{
  "id": "github-issues",
  "url": "https://stream.keboola.com/stream/<YOUR_PROJECT_ID>/github-issues/<SECRET>"
  "name": "Github Issues",
  "exports": [
    {
      "id": "events",
      "name": "Events",
      "conditions": {
        "count": 1,
        "size": "5MB",
        "time": "5m"
      },
      "mapping": {
        "tableId": "in.c-github.issues",
        "columns": [
          {
            "primaryKey": true,
            "type": "id",
            "name": "id"
          },
          { "type": "datetime", "name": "datetime" },
          { "type": "ip", "name": "ip" },
          { "type": "body", "name": "body" },
          { "type": "headers", "name": "headers" },
          {
            "type": "path",
            "name": "id",
            "path": "issue.id",
            "defaultValue": "undefined", 
            "rawString": true
          },
          {
            "type": "template",
            "name": "template",
            "template": {
              "language": "jsonnet",
              "content": "'#' + Body('issue.id') + ': ' + Body('issue.body', 'n/a')",
            }
          }
        ]
      }
    }
  ]
}
```

The most important part of the response is the `url` field. This is the endpoint you will point your GitHub webhook to. Once you've created the source and obtained its `url` field, you are ready to configure the GitHub webhook.

Normally the url only returns a short response to reduce traffic. You can add `?verbose=true` to the url to receive more information about what happened with the request. Note that this makes the response slower so it is recommended to only use this parameter for testing purposes.

### Configuring the Github Webhook

Go to the `Settings` tab of your repository.

![Github repository tabs](./gh-tabs.png)

Open the `Webhooks` page.

![Github settings pages](./gh-settings-webhook.png)

Click `Add webhook`.

![Github add webhook](./gh-settings-webhook-add.png)

Enter the source `url` into the `Payload URL` field, and set the `Content Type` to `application/json`.

For `Which events would you like to trigger this webhook?`, click `Let me select individual events`, then find `Issues` and tick it:

![Github webhook let me select individual events selected](./gh-settings-webhook-individual-events.png)
![Github webhook issues checkbox selected](./gh-settings-webhook-issues.png)

Click `Add webhook` at the bottom of the page.

Any events related to issues in your repository will now be buffered by the source, and uploaded to your table every minute.

To see your integration at work, head over to your repository and [open a few issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue).

### Results

The following token was generated.

![Keboola token settings screenshot showing the generated token](./token.png)

This token only has the minimal set of permissions, which in this case is access to a single bucket, and the ability to manipulate files. Currently, files are used as staging storage in order to prevent data loss. You can see these files in your project's Storage.

![Keboola storage file](./github_webhook_export_file.png)

Because the table `in.c-github-issues` did not exist, it was created.

![Keboola storage table](./github_webhook_export_table.png)

And finally, you can take a look at the destination table's data sample to find your data, ready for further processing.

![Keboola storage table sample data](./github_webhook_export_table_data.png)


## Next Steps

- [Data Streams Overview](/integrate/data-streams/overview/)
- [Stream API Reference](https://stream.keboola.com/v1/documentation/)
