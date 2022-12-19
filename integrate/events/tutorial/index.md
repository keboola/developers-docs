---
title: Events Tutorial
permalink: /integrate/events/tutorial/
---

* TOC
{:toc}


In this tutorial, we will setup a receiver for the [`issues`](https://docs.github.com/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#issues) event from Github Webhooks. This will allow you to monitor and analyse activity relating to issues on any of your Github repositories.

You will need your project's master token, and a Github repository in which you have the `Admin` role.

To start ingesting events, you must first create a receiver. Send the following payload to the `https://buffer.keboola.com/v1/receivers` endpoint:
```
{
  "name": "Github Issues",
  "exports": [
    {
      "name": "Events",
      "conditions": {
        "time": "2m"
      },
      "mapping": {
        "tableId": "in.c-github-issues.events",
        "columns": [
          { "type": "id", "name": "id" },
          { "type": "datetime", "name": "datetime" },
          { "type": "ip", "name": "ip" },
          { "type": "body", "name": "body" },
          { "type": "headers", "name": "headers" },
          {
            "type": "template",
            "name": "template",
            "template": {
              "language": "jsonnet",
              "undefinedValueStrategy": "error",
              "content": "body.issue.body",
            }
          }
        ]
      }
    }
  ]
}
```

You can do this using `curl`, or anything else that allows you to send a HTTP request:
```
$ curl --header 'Content-Type: application/json' \
       --header 'X-StorageApi-Token: <YOUR_TOKEN>' \
       --data '{ ...the payload above... }' \
       https://buffer.keboola.com/v1/receivers
```

Upon success, the response will contain the receiver you've just created:
```
{
  "id": "github-issues",
  "url": "https://buffer.keboola.com/v1/import/<YOUR_PROJECT_ID>/github-issues/<SECRET>"
  "name": "Github Issues",
  "exports": [
    {
      "id": "events",
      "name": "Events",
      "conditions": {
        "count": 1000,
        "size": "1MB",
        "time": "2m"
      },
      "mapping": {
        "tableId": "in.c-github-issues.events",
        "columns": [
          { "type": "id", "name": "id" },
          { "type": "datetime", "name": "datetime" },
          { "type": "ip", "name": "ip" },
          { "type": "body", "name": "body" },
          { "type": "headers", "name": "headers" },
          {
            "type": "template",
            "name": "template",
            "template": {
              "language": "jsonnet",
              "undefinedValueStrategy": "error",
              "content": "Body.issue.body",
            }
          }
        ]
      }
    }
  ]
}
```

The most important part of the response is the `url` field. This is the endpoint you will point your Github Webhook to.

Here's a quick overview of some of the other fields:
- `id` and `export.id` - The unique IDs of these resources. They are optional, and generated from the `name` fields if they are omitted.
- `conditions` - Under which conditions will the data be uploaded to the destination table.
- `mapping.tableId` - The destination table ID. If they table does not exist, it will be created. 
- `columns` - The schema for the destination table. If the table already exists, this field must match the existing table's schema.
- `columns[].type` - Defines how incoming request data should be mapped to the columns. The available column types are:
  - `id` - the event ID.
  - `datetime` - the time when the event was received.
  - `ip` - the IP of the request sender.
  - `body` - the request body.
  - `headers` - the request headers.
  - `template` - a custom mapping using a template language. Currently, we only support [`jsonnet`](https://jsonnet.org/).

Once you've created the receiver and obtained its `url` field, you are ready to configure the Github Webhook:

Go to the `Settings` tab of your repository.

![Github repository tabs](./gh-tabs.png)

Open the `Webhooks` page.

![Github settings pages](./gh-settings-webhook.png)

Click `Add webhook`.

![Github add webhook](./gh-settings-webhook-add.png)

Enter the receiver `url` into the `Payload URL` field, and set the `Content Type` to `application/json`.

![Github webhook form](./gh-settings-webhook-form.png)

For `Which events would you like to trigger this webhook?`, click `Let me select individual events`, then find `Issues` and tick it:

![Github webhook let me select individual events selected](./gh-settings-webhook-individual-events.png)
![Github webhook issues checkbox selected](./gh-settings-webhook-issues.png)

Click `Add webhook` at the bottom of the page.

Any events related to issues in your repository will now be received by the Buffer API and uploaded to your table.

## Next Steps
- [Events Overview](/integrate/events/overview/)
