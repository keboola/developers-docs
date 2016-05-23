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
[online](http://jeremydorn.com/json-editor/) to develop and test JSON schemas. Make sure to list all configuration 
properties as `required`. This is to make sure that the actual configuration will always contain all properties. If
you want a property to be optional, set a default value for it.

### Example

Let's assume your application accepts this configuration.

{% highlight json %}

{
    "username": "foo",
    "#password": "baz",
    "dateFrom": "yesterday",
    "dateTo": "today"
}

{% endhighlight %}

This looks like an appropriate form.

{: .image-popup}
![Configuration form](/extend/registration/form.png)

The form above can be created using this JSON Schema.

{% highlight json %}

{
  "title": "Parameters",
  "type": "object",
  "required": [
    "dateFrom",
    "dateTo",
    "username",
    "#password"
  ],
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
    "dateFrom": {
      "title": "Date from",
      "type": "string",
      "minLength": 1,
      "default": ""
    },
    "dateTo": {
      "title": "Date to",
      "type": "string",
      "minLength": 1,
      "default": ""
    }
  }
}

{% endhighlight %}

