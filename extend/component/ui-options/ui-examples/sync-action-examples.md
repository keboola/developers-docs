---
title: Sync Action UI Elements Examples
permalink: /extend/component/ui-options/configuration-schema/sync-action-examples/

---

* TOC
{:toc}

Some UI elements are using [sync actions](https://developers.keboola.com/extend/common-interface/actions/) to get some values dynamically 
from the component code. This section provides a list of the elements currently supported. 

Each element specifies `action` attribute which relates to the name of the sync action registered in the Developer Portal.

*Note: Support for these elements is also abstracted in the official [Python Component library](https://github.com/keboola/python-component#framework-support).*

### Dynamically Loaded Dropdowns

Drop-down lists (values and labels) can be loaded by the component sync action. 

The sync action code has to return the following stdout:

```
[
 { label: 'Joe', value: 'joe' },
 { label: 'Doe', value: 'doe },
 { label: 'Jane', value: 'jane' }
]
```

The `label` value is optional. 

When used in Python, you can use the [SelectElement](https://github.com/keboola/python-component#selectelement) class as return value.

#### Dynamically loaded multi select

```json
{
    "test_columns": {
      "type": "array",
      "propertyOrder": 10,
      "description": "Element loaded by an arbitrary sync action.",
      "items": {
        "enum": [],
        "type": "string"
      },
      "format": "select",
      "options": {
        "async": {
          "label": "Re-load test columns",
          "action": "testColumns"
        }
      },
      "uniqueItems": true
    }
}
```

The above code will create the following element which triggers an action named `testColumns`:

{: .image-popup}
![Screenshot](/extend/component/ui-options/ui-examples/dynamic_dropdown_multi.gif)


#### Dynamically loaded single select

```json
{
  "test_columns_single": {
    "propertyOrder": 40,
    "type": "string",
    "description": "Element loaded by an arbitrary sync action. (single)",
    "enum": [],
    "format": "select",
    "options": {
      "async": {
        "label": "Re-load test columns",
        "action": "testColumns"
      }
    }
  }
}
```

The above code will create the following element which triggers an action named `testColumns`:

{: .image-popup}
![ Screenshot](/extend/component/ui-options/ui-examples/single-drop.gif)



### Generic Validation Button

This button can be used to return feedback from the component. The output supports MarkDown notation.

Example use-cases are query testing, testing connection, report validation, etc.

The sync action code has to return the following stdout (JSON string):

```json
{
  "message": "###This is display text. \n\n And can contain **Mark Down** notation. ",
  "type": "info", //possible values: success, info, warning, danger
  "status": "success" // this is required and will never be other value than "success"
}
```


When used in Python, you can use the [ValidationResult](https://github.com/keboola/python-component#validationresult) class as return value.

#### Example

```json
{
  "validation_button": {
    "type": "button",
    "format": "sync-action",
    "propertyOrder": 10,
    "options": {
      "async": {
        "label": "Validate",
        "action": "validate_report"
      }
    }
  }
}
```

The above code will create the following element which triggers an action named `validate_report`:

{: .image-popup}
![screenshot](/extend/component/ui-options/ui-examples/generic-button.gif)


### Test Connection


This button can be used for simple connection tests. 

The sync action code has to return the following stdout (JSON string) or error (exit code >0):

```json
{
  "status": "success" // this is required and will never be other value than "success"
}
```

The name of this sync action **has to be always `testConnection`.**


When used in Python, the method does not need to return anything, or it can just throw an exception.


#### Example

```json
{
    "test_connection": {
      "type": "button",
      "format": "sync-action",
      "propertyOrder": 30,
      "options": {
        "async": {
          "label": "TEST CONNECTION",
          "action": "validate_connection"
        }
      }
    }
}
```

The above code will create the following element which triggers an action named `testConnection`:

{: .image-popup}
![multiselect](/extend/component/ui-options/ui-examples/test_connection.png)
