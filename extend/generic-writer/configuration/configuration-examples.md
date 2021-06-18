---
title: Generic Writer Configuration examples
permalink: /extend/generic-writer/configuration-examples/
---

* TOC
{:toc}


### Configuration example - Iterations

This configuration sends POST request to `https://example.com/test/[[id]]` where `[[id]]` is column expected in the input table. 
It will send as many requests as there are rows in the input table. Each request object is wrapped in `{"data":{}}` object.

```json
{
    "path": "https://example.com/test/[[id]]",
    "mode": "JSON",
    "method": "POST",
    "iteration_mode": {
      "iteration_par_columns": [
        "id"
      ]
    },
    "user_parameters": {
      "#token": "Bearer 123456",
    "token_encoded": {
      "function": "concat",
      "args": [
        "Basic ",
        {
          "function": "base64_encode",
          "args": [
            {
              "attr": "#token"
            }
          ]
        }
      ]
    },
      "date": {
        "function": "concat",
        "args": [
          {
            "function": "string_to_date",
            "args": [
              "yesterday",
              "%Y-%m-%d"
            ]
          },
          "T"
        ]
      }
    },
    "headers": [
      {
        "key": "Authorization",
        "value": {
          "attr": "token_encoded"
        }
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "additional_requests_pars": [
      {
        "key": "params",
        "value": {
          "date": {
            "attr": "date"
          }
        }
      }
    ],
    "json_data_config": {
      "chunk_size": 1,
      "delimiter": "_",
      "request_data_wrapper": "{ \"data\": [[data]]}",
      "infer_types_for_unknown": true,
      "column_types": [
        {
          "column": "bool_bool2",
          "type": "number"
        },
        {
          "column": "bool_bool1",
          "type": "bool"
        },
        {
          "column": "id",
          "type": "string"
        },
        {
          "column": "field.id",
          "type": "string"
        },
        {
          "column": "ansconcat",
          "type": "string"
        },
        {
          "column": "time_submitted",
          "type": "string"
        },
        {
          "column": "id2",
          "type": "string"
        },
        {
          "column": "time_11",
          "type": "bool"
        },
        {
          "column": "time_reviewed_r2",
          "type": "bool"
        },
        {
          "column": "time_reviewed_r1_r1",
          "type": "bool"
        }
      ]
    },
    "debug": true
  }
```

### Exponea batch events writer

Writes customer [Events](https://docs.exponea.com/reference#add-event) into [Exponea API](https://docs.exponea.com) 
in [batches](https://docs.exponea.com/reference#batch-commands) of `40` requests.

**Input table:**

| name             | data__customer_ids__registered | data__properties__price | data__timestamp | data__event_type | data__properties__test |
|------------------|--------------------------------|-------------------------|-----------------|------------------|------------------------|
| customers/events | milan@test.com              | 150                     | 123456.78       | testing_event    | a                      |
| customers/events | petr@test.com               | 150                     | 123456.78       | testing_event    | a                      |
| customers/events | masha@test.com    | 150                     | 123456.78       | testing_event    | a                      |


**Result request:**

```json
{
    "commands": [{
            "name": "customers/events",
            "data": {
                "customer_ids": {
                    "registered": "milan@keboola.com"
                },
                "properties": {
                    "price": 150,
                    "test": "a"
                },
                "timestamp": 123456.78,
                "event_type": "testing_event"
            }
        }, {
            "name": "customers/events",
            "data": {
                "customer_ids": {
                    "registered": "petr@keboola.com"
                },
                "properties": {
                    "price": 150,
                    "test": "a"
                },
                "timestamp": 123456.78,
                "event_type": "testing_event"
            }
        }, {
            "name": "customers/events",
            "data": {
                "customer_ids": {
                    "registered": "masha.reutovski@keboola.com"
                },
                "properties": {
                    "price": 150,
                    "test": "a"
                },
                "timestamp": 123456.78,
                "event_type": "testing_event"
            }
        }
    ]
}

```


**Writer config**

```json
{
  "path": "https://api-demoapp.exponea.com/track/v2/projects/1234566/batch",
  "mode": "JSON",
  "method": "POST",
  "user_parameters": {
    "#token": "12345",
    "token_encoded": {
      "function": "concat",
      "args": [
        "Basic ",
        {
          "function": "base64_encode",
          "args": [
            {
              "attr": "#token"
            }
          ]
        }
      ]
    }
  },
  "headers": [
    {
      "key": "Authorization",
      "value": {
        "attr": "token_encoded"
      }
    },
    {
      "key": "Content-type",
      "value": "application/csv"
    }
  ],
  "additional_requests_pars": [],
  "json_data_config": {
    "chunk_size": 40,
    "request_data_wrapper": "{\"commands\":{{data}}}",
    "infer_types_for_unknown": true,
    "delimiter": "__",
    "column_types": []
  },
  "debug": true
}
```

### Customer.io User event

Updates user events via [Customer.io API](https://customer.io/docs/api/#apitrackeventsevent_add) based on user_id column.

The API uses Basic http authentication which is mimicked by the `base64_encode` function. The field `#token` is expected to contain 
`user:password`.

** Input Table:**

| user_id        | data_price | data_date | name          |
|----------------|------------|-----------|---------------|
| a@test.com     | 150        | 1.1.20    | testing_event |
| petr@test.com  | 150        | 1.1.20    | testing_event |
| masha@test.com | 150        | 1.1.20    | testing_event |

**Json request:**

For each row in input one request:

POST `https://track.customer.io/api/v1/customers/a@test.com/events`

```json
{"data": {"price": 150, "date": "1.1.20"}, "name": "testing_event"}
```

**Writer config:**

```json
{
  "path": "https://track.customer.io/api/v1/customers/{{user_id}}/events",
  "mode": "JSON",
  "method": "POST",
  "user_parameters": {
    "#token": "1234",
    "token_encoded": {
      "function": "concat",
      "args": [
        "Basic ",
        {
          "function": "base64_encode",
          "args": [
            {
              "attr": "#token"
            }
          ]
        }
      ]
    }
  },
  "iteration_mode": {
    "iteration_par_columns": [
      "user_id"
    ]
  },
  "headers": [
    {
      "key": "Authorization",
      "value": {
        "attr": "token_encoded"
      }
    },
    {
      "key": "Content-type",
      "value": "application/csv"
    }
  ],
  "additional_requests_pars": [],
  "json_data_config": {
    "chunk_size": 1,
    "infer_types_for_unknown": true,
    "delimiter": "_",
    "column_types": []
  },
  "debug": true
}
```

### Slack notification

Send notifications to slack channels via API. Note that you need to create an app with appropriate permissions at https://api.slack.com/apps
 and retrieve the API token.



**Input Table:**

| channel        | text       |
|----------------|------------|
| AC098098   | Hello        |
| AC092131   | World        |


**Configuration:**

```json
{
  "path": "https://slack.com/api/chat.postMessage",
  "mode": "JSON",
  "method": "POST",
  "user_parameters": {
    "#token": "",
    "token_encoded": {
      "function": "concat",
      "args": [
        "Bearer ",
        {
          "attr": "#token"
        }
      ]
    }
  },
  "headers": [
    {
      "key": "Authorization",
      "value": {
        "attr": "token_encoded"
      }
    },
    {
      "key": "Content-type",
      "value": "application/json"
    }
  ],
  "additional_requests_pars": [],
  "json_data_config": {
    "chunk_size": 1,
    "infer_types_for_unknown": true,
    "delimiter": "_",
    "column_types": []
  },
  "debug": true
}

```