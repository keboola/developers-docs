---
title: Data Streams Overview
permalink: /integrate/data-streams/overview/
redirect_from: /integrate/push-data/overview/
---

![Data Streams diagram](../push_data.drawio.png)

* TOC
{:toc}

A receiver represents an endpoint for receiving events.

Receivers are managed using the Buffer API. The full API reference is available at https://buffer.keboola.com/v1/documentation/, and the OpenAPI specification is available at https://buffer.keboola.com/v1/documentation/openapi3.json.

Events are received using HTTP. Receivers are associated with a maximum of 20 `exports`. Each export represents a `mapping` from event data to `columns` in a destination `table`. Data may be mapped using pre-defined mappings, or a custom `template`.

## Columns

|Field|Type|Description|
|:-|:-|:-|
|`name`|string|Name of the column. Names must be unique.|
|`type`|string|The type of the column. Available types and their descriptions are listed below.|
|`primaryKey`|boolean|Make this column a primary key. Multiple columns may be part of the primary key at the same time.|

The available column types are:

|Type|Description|
|:-|:-|
| `id`| event ID |
| `datetime` | time of the event |
| `ip` | IP of the event sender |
| `body` | the unaltered event body |
| `headers` | the unaltered request headers |
| `template` | a custom mapping using a template language |

### Template (Jsonnet)

The `template` column type currently only supports the `jsonnet` templating language.The following `jsonnet` globals are available:

|Name|Description|Usage example|Example value|
|:-|:-|:-|:-|
| `Ip()` | IP address of the client | `Ip()` | `127.0.0.1` |
| `Body()` | Get the entire request body as an object. | `Body()` | `{ "a": "b" }` |
| `Body(string)` | Get a field from the request body by path. Fails if the header does not exist, in which case the record will not be saved. | `Body("deeply.nested.path")` | `1000` |
| `Body(string, any)` | Get a field from the request body by path, or a default value. | `Body("deeply.nested.path", 2000)` | `1000` |
| `BodyStr()` | Get the entire request body as a string. | `BodyStr()` | `"{\"a\":\"b\"}"` |
| `Header()` | Get all request headers. | `Header()` | `{ "Content-Type": "application/json" }` |
| `Header(string)` | Get the value of a single request header. Fails if the header does not exist, in which case the record will not be saved. | `Header("Content-Type")` | `"application/json"` |
| `Header(string, string)` | Get the value of a single request header, or a default value. | `Header("Content-Type")` | `"application/json"` |
| `HeaderStr()` | Get the request headers as a string, each line containing one "header: value" pair. The lines are sorted alphabetically. | `HeaderStr()` | `Content-Type: application/json` |
| `Now()` | Get the current UTC datetime as a string formatted using the default format. | `Now()` | `"2023-01-14T08:04:05.123Z"` |
| `Now(string)` | Get the current UTC datetime as a string formatted using a custom [`strftime`](https://man7.org/linux/man-pages/man3/strftime.3.html)-compatible format. | `Now("%Y-%m-%d")` | `2023-01-14` |

### Conditions

Incoming events are immediately mapped to the schema defined in each export, and each new row is appended to a CSV file. This CSV file is stored in your Keboola project. When certain conditions are met, the data from the file is uploaded to the destination table, and the file is cleared. These `conditions` are defined by the export:

| Condition | Minimum | Maximum | Default |
| :- | :-: | :-: | :-: |
| `time` | 30 seconds | 24 hours | 5 minutes |
| `size` | 100 B | 50 MB | 5 MB |
| `count` | 1 | 10 million | 1 thousand |

## Create Receivers and Exports

Receivers may be created using the [`POST /v1/receivers`](https://buffer.keboola.com/v1/documentation/#/configuration/CreateReceiver) endpoint.

If a receiver or export `id` is omitted, it will be generated from the corresponding `name` field.

A receiver may be created without any exports. The exports can then be created separately using the [`POST /v1/receivers/{receiverId}/exports`](https://buffer.keboola.com/v1/documentation/#/configuration/CreateExport) endpoint.

***Warning**: Events sent to a receiver without any exports will be permanently lost. This is because data is buffered per export, not per receiver.*

The requests are asynchronous and create a task that must be completed before the receiver or export is ready to use. The task status can be checked using the [`GET /v1/receivers/{receiverId}/tasks/{taskId}`](https://buffer.keboola.com/v1/documentation/#/configuration/GetTask) endpoint.

Export tables are created if they do not exist. If they already exist, the schema defined by `export.columns` must match the existing schema. If the table schema is manually altered and it no longer matches, the upload from staging storage to the table will fail. The data is kept in the staging storage for up to 7 days during which you can recover any failures.

## Delete Receivers and Exports

Receivers may be deleted using the [`DELETE /v1/receivers/{receiverId}`](https://buffer.keboola.com/v1/documentation/#/configuration/DeleteReceiver) endpoint. Exports may be deleted using the [`DELETE /v1/receivers/{receiverId}/exports/{exportId}`](https://buffer.keboola.com/v1/documentation/#/configuration/DeleteExport) endpoint.

## Update Receivers and Exports

A receiver may be updated using the [`PATCH /v1/receivers/{receiverId}`](https://buffer.keboola.com/v1/documentation/#/configuration/UpdateReceiver) endpoint. Exports maybe updated using the [`PATCH /v1/receivers/{receiverId}/exports/{exportId}`](https://buffer.keboola.com/v1/documentation/#/configuration/UpdateExport) endpoint.

The `UpdateReceiver` endpoint may only update the receiver's name. Exports may only be updated separately.

If an export's `mapping.tableId` is updated, it is handled the same way as in the create operation. If the table exists, `mapping.columns` must match the existing table's schema. If the table does not exist, it is created.

## Tokens

A token is generated for each receiver export. These tokens have the minimum possible scope, which is a `write` permission for the bucket in which the destination table is stored. You can see these tokens at `https://connection.keboola.com/admin/projects/<project-id>/tokens-settings`. Their description is in the format `[_internal] Buffer Export <export-id> for Receiver <receiver-id>`.

These tokens should not be deleted or refreshed manually. To refresh tokens, use the [`POST /v1/receivers/{receiverId}/tokens/refresh`](https://buffer.keboola.com/v1/documentation/#/configuration/RefreshReceiverTokens) endpoint.

## Kafka Integration
To connect Keboola with [Apache Kafka®](https://kafka.apache.org/) and ingest data from Kafka topics via data streams, use the Kafka Connect HTTP Sink Connector
to establish a communication channel between Kafka and Keboola.

The Kafka Connect HTTP Sink Connector acts as a bridge, seamlessly integrating Kafka with Keboola's Data Stream HTTP API. Here's a breakdown of the process:

- Data Consumption: The connector continuously reads data records from one or more Kafka topics.
- Batching: The events can be efficiently grouped based on a predefined maximum size (batch.max.size).
- API Interaction: The data is sent as the POST request in JSON format to Keboola's Data Stream API URL.

**Key Points to Remember:**

- This integration relies on the Kafka Connect HTTP Sink Connector, requiring configuration on the Kafka side.
- Data records from Kafka topics are transformed into strings before being sent to Keboola.
- The target Keboola API URL is represented by the created data stream in Keboola.
- Only POST HTTP methods are supported for data ingestion.

## Next Steps

- [Data Streams Tutorial](/integrate/data-streams/tutorial/)
- [Buffer API Reference](https://buffer.keboola.com/v1/documentation/)
