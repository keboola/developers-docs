---
title: UI Elements examples
permalink: /extend/component/ui-options/configuration-schema/examples/

---

* TOC
{:toc}

[JSON schema](https://json-schema.org/) allows for design of some advanced UI elements. Some of these are often reused 
in many components. This page contains list of commonly used UI elements and some advanced tips for UI design.

### API Token & Secret Values

Always prefix private parameters like passwords with # sign. These will be automatically hashed and hidden from the view. 
Use a textual input field with `"format":"password"` in the JsonSchema for these values to hide the content also during the typing.

{: .image-popup}
![password](/extend/component/ui-options/ui-examples/password.png)

```json
"#api_token": {
  "type": "string",
  "title": "API token",
  "format": "password",
  "propertyOrder": 1
}
```


### Checkboxes

{: .image-popup}
![checkboxes](/extend/component/ui-options/ui-examples/checkbox.png)

```json
"campaigns": {
  "type": "boolean",
  "title": "Download Campaigns",
  "default": false,
  "format": "checkbox",
  "propertyOrder": 30
},
"segments": {
  "type": "boolean",
  "title": "Download Segments",
  "default": false,
  "format": "checkbox",
  "propertyOrder": 40
}
```


### Multi Selection

{: .image-popup}
![multiselect](/extend/component/ui-options/ui-examples/multi_select.png)

```json
"types": {
  "type": "array",
  "title": "Types",
  "description": "Activity types",
  "items": {
    "enum": [
      "page",
      "event",
      "attribute_change",
      "failed_attribute_change",
      "stripe_event",
      "drafted_email",
      "failed_email",
      "dropped_email",
      "sent_email",
      "spammed_email",
      "bounced_email",
      "delivered_email",
      "triggered_email",
      "opened_email"
    ],
    "type": "string"
  },
  "format": "select",
  "uniqueItems": true,
  "propertyOrder": 360
}
```


### Date range

When date range is applicable it should be bounded by two parameters From Date and To Date. 
These should be text fields that accept particular date in specified format or a string defining a relative interval in strtotime manner. 

**TIP** A convenient Python function for parsing such values and conversion to date can be found in the KDS tooling 
([parse_datetime_interval](https://github.com/keboola/python-utils#getting-converted-date-period-from-string))

{: .image-popup}
![Date period](/extend/component/ui-options/ui-examples/det_period.png)

```json
"date_from": {
  "propertyOrder": 5,
  "type": "string",
  "title": "From date [inclusive]",
  "description": "Date from. Date in YYYY-MM-DD format or a string i.e. 5 days ago, 1 month ago, yesterday, etc. If left empty, all records are downloaded."
},
"date_to": {
  "propertyOrder": 7,
  "type": "string",
  "title": "To date [exclusive]",
  "default": "now",
  "description": "Date to. Date in YYYY-MM-DD format or a string i.e. 5 days ago, 1 month ago, yesterday, etc. If left empty, all records are downloaded."
}
```


### Loading options (Incremental vs Full)

This may be combined in loading options block. (See bellow)

{: .image-popup}
![Date period](/extend/component/ui-options/ui-examples/load_type.png)

```json
"incremental_output": {
  "type": "number",
  "enum": [
    0,
    1
  ],
  "options": {
    "enum_titles": [
      "Full Load",
      "Incremental Update"
    ]
  },
  "default": 1,
  "title": "Load type",
  "description": "If set to Incremental update, the result tables will be updated based on primary key. Full load overwrites the destination table each time. NOTE: If you wish to remove deleted records, this needs to be set to Full load and the Period from attribute empty.",
  "propertyOrder": 365
}
```


### Visual separation of sections

It often happens that the configuration can be split into multiple sections. 
It is advisable to split these visually using JSON Schema objects or arrays to achieve it using the generic UI.


#### Example 1 - Object blocks (Loading Options)

Loading options block:

{: .image-popup}
![loading options block](/extend/component/ui-options/ui-examples/loading_options_block.png)


```json
    "loading_options": { 
      "type": "object", 
      "title": "Loading Options", 
      "propertyOrder": 400, 
      "format": "grid", 
      "required": [ 
        "incremental_output", 
        "date_since", 
        "date_to" 
      ], 
      "properties": { 
        "date_since": { 
          "type": "string", 
          "title": "Period from date [including].", 
          "default": "1 week ago", 
          "description": " Date in YYYY-MM-DD format or dateparser string i.e. 5 days ago, 1 month ago, yesterday, etc. If left empty, all records are downloaded.", 
          "propertyOrder": 300 
        }, 
        "date_to": { 
          "type": "string", 
          "title": "Period to date [excluding].", 
          "default": "now", 
          "description": " Date in YYYY-MM-DD format or dateparser string i.e. 5 days ago, 1 month ago, yesterday, etc. If left empty, all records are downloaded.", 
          "propertyOrder": 400 
        }, 
        "incremental_output": { 
          "type": "number", 
          "enum": [ 
            0, 
            1 
          ], 
          "options": { 
            "enum_titles": [ 
              "Full Load", 
              "Incremental Update" 
            ] 
          }, 
          "default": 1, 
          "title": "Load type", 
          "description": "If set to Incremental update, the result tables will be updated based on primary key. Full load overwrites the destination table each time. NOTE: If you wish to remove deleted records, this needs to be set to Full load and the Period from attribute empty.", 
          "propertyOrder": 450 
        } 
      } 
    }
```



#### Example 2 - Optional blocks using Arrays

Create an array with parameter `"maxItems": 1` to create optional blocks.

{: .image-popup}
![optional block](/extend/component/ui-options/ui-examples/optional_block_array.gif)

```json
"customers": { 
      "type": "array", 
      "title": "Customers", 
      "description": "Download Customers.", 
      "propertyOrder": 4000, 
      "maxItems": 1, 
      "items": { 
        "type": "object", 
        "title": "Setup", 
        "required": [ 
          "filters", 
          "attributes" 
        ], 
        "properties": { 
          "filters": { 
            "type": "string", 
            "title": "Filter", 
            "description": "Optional JSON filter, as defined in https://customer.io/docs/api-triggered-data-format#general-syntax. Example value: {\"and\":[{\"segment\":{\"id\":7}},{\"segment\":{\"id\":5}}]} If left empty, all users are donwnloaded", 
            "format": "textarea", 
            "propertyOrder": 1 
          }, 
          "attributes": { 
      "type": "string", 
      "title": "Attributes", 
      "format": "textarea","options": { 
        "input_height": "100px" 
      }, 
      "description": "Comma separated list of required customer attributes. Each customer may have different set of columns, this is to limit only to attributes you need. All attributes are downloaded if left empty.", 
      "uniqueItems": true, 
      "propertyOrder": 700 
    } 
        } 
      } 
    }
```


### Changing set of options dynamically based on selection

In some cases different set of options is available for different types of the same object, e.g. Report type. 
JSON Schema allows to define different schemas based on selection. 
This may be useful in configuration rows scenario, where each row could represent different type of Report, Endpoint, etc.

{: .image-popup}
![dynamic selection](/extend/component/ui-options/ui-examples/dynamic_sel.gif)

**NOTE:** An alternative notation of the below code is by using the [dependencies](https://github.com/json-editor/json-editor#dependencies). 

```json
"query": {
            "title": "Endpoint",
            "description": "Fetch data from given date range. i.e. Products, Customers, Orders",
            "anyOf": [{
                    "title": "Customes",
                    "additionalProperties": false,
                    "properties": {
                        "endpoint": {
                            "type": "string",
                            "enum": [
                                "customers"
                            ],
                            "options": {
                                "hidden": true
                            }
                        }
                    },
                    "type": "object",
                    "options": {
                        "keep_oneof_values": false
                    }
                }, {
                    "title": "Orders",
                    "additionalProperties": false,
                    "properties": {
                        "endpoint": {
                            "type": "string",
                            "enum": [
                                "orders"
                            ],
                            "options": {
                                "hidden": true
                            }
                        },
                        "date_from": {
                            "type": "string",
                            "title": "Date From",
                            "description": "Report to download from this data. Date in YYYY-MM-DD format"
                        },
                        "date_to": {
                            "type": "string",
                            "title": "Date To",
                            "default": "now",
                            "description": "Max report date to download. Date in YYYY-MM-DD format or dateparser string i.e. 5 days ago, 1 month ago, yesterday, etc. If left empty, all records are downloaded."
                        },
                        "customer_type": {
                            "type": "string",
                            "title": "Customer type",
                            "default": "registered"
                        }
                    },
                    "type": "object",
                    "options": {
                        "keep_oneof_values": false
                    }
                }, {
                    "title": "Products",
                    "additionalProperties": false,
                    "properties": {
                        "endpoint": {
                            "type": "string",
                            "enum": [
                                "products"
                            ],
                            "options": {
                                "hidden": true
                            }
                        },
                        "date_from": {
                            "type": "string",
                            "title": "Date From",
                            "description": "Report to download from this data. Date in YYYY-MM-DD format"
                        },
                        "date_to": {
                            "type": "string",
                            "title": "Date To",
                            "default": "now",
                            "description": "Max report date to download. Date in YYYY-MM-DD format or dateparser string i.e. 5 days ago, 1 month ago, yesterday, etc. If left empty, all records are downloaded."
                        }
                    },
                    "type": "object",
                    "options": {
                        "keep_oneof_values": false
                    }
                }
            ]
        }
```
