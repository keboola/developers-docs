---
title: Configuration Schema
permalink: /extend/registration/configuration-schema/
---

* TOC
{:toc}

The default input for component configuration is a JSON textarea.

{: .image-popup}
![Generic configuration screenshot](/extend/registration/configuration.png)

If you define a JSON schema, we're able to display a nice form and 
let the user to fill the JSON using a set of defined inputs.

{: .image-popup}
![Configuration schema](/extend/registration/configuration-schema.png)

Using the configuration schema also allows us to validate the user input (both frontend and backend).
 
## Creating Schema

JSON schema is well documented on [json-schema.org](http://json-schema.org/) website and JSON Editor is available 
[online](http://jeremydorn.com/json-editor/) to develop and test JSON schemas.

The form above is created using this JSON Schema.

{% highlight json %}

{
  "title": "Parameters",
  "type": "object",
  "required": [
    "dateFrom",
    "dateTo",
    "api"
  ],
  "properties": {
    "api": {
      "title": "Authorization",
      "required": [
        "username",
        "user_id",
        "#password"
      ],
      "type": "object",
      "properties": {
        "username": {
          "title": "Username",
          "type": "string",
          "minLength": 1,
          "default": ""
        },
        "#password": {
          "title": "Password",
          "type": "string",
          "format": "password",
          "minLength": 1,
          "default": ""
        },
        "user_id": {
          "title": "User ID",
          "type": "string",
          "minLength": 1,
          "default": ""
        }
      }
    },
    "dateFrom": {
      "title": "Date from",
      "type": "string",
      "description": "Any format supported by https://secure.php.net/manual/en/datetime.construct.php",
      "minLength": 1,
      "default": ""
    },
    "dateTo": {
      "title": "Date to",
      "type": "string",
      "description": "Any format supported by https://secure.php.net/manual/en/datetime.construct.php",
      "minLength": 1,
      "default": ""
    }
  }
}

{% endhighlight %}

## Update Component

To update your component's configuration schema, contact us at [support@keboola.com](mailto:support@keboola.com). 
