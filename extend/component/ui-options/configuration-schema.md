---
title: Configuration Schema
permalink: /extend/component/ui-options/configuration-schema/
redirect_from:
    - /extend/registration/configuration-schema/
---

The default input for a component configuration is a JSON text area.

{: .image-popup}
![Generic configuration screenshot](/extend/component/ui-options/configuration.png)

If you define a JSON schema, we are able to display a nice form and
let the user to fill the JSON using a set of defined inputs.

{: .image-popup}
![Configuration schema](/extend/component/ui-options/configuration-schema-1.png)

Using the configuration schema also allows us to validate the user input on frontend.

## Creating Schema

JSON schemas are well documented on the [json-schema.org](https://json-schema.org/) website.

We use [JSON Editor](https://github.com/json-editor/json-editor) for displaying schema.
The supported formatting options for
the editor are available in the [official editor documentation](https://github.com/json-editor/json-editor#format).

For developing and testing,
use, for example JSON Editor available [on-line](http://jeremydorn.com/json-editor/) or
[JSON Editor Interactive Playground](https://pmk65.github.io/jedemov2/dist/demo.html).

### Example
Let's assume your component accepts the following configuration:

{% highlight json %}

{
    "username": "foo",
    "#password": "baz",
    "dateFrom": "yesterday",
    "dateTo": "today"
}

{% endhighlight %}

This looks like an appropriate form:

{: .image-popup}
![Configuration form](/extend/component/ui-options/form.png)

The form above can be created using this JSON Schema:

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
            "default": "",
            "propertyOrder": 1
        },
        "#password": {
            "title": "Password",
            "type": "string",
            "format": "password",
            "minLength": 1,
            "default": "",
            "propertyOrder": 2
        },
        "dateFrom": {
            "title": "Date from",
            "type": "string",
            "description": "Any date accepted by strtotime (https://www.php.net/manual/en/function.strtotime.php) function",
            "minLength": 1,
            "default": "",
            "propertyOrder": 3
        },
        "dateTo": {
            "title": "Date to",
            "type": "string",
            "description": "Any date accepted by strtotime (https://www.php.net/manual/en/function.strtotime.php) function",
            "minLength": 1,
            "default": "",
            "propertyOrder": 4
        }
    }
}
{% endhighlight %}

### Links Example
If you want to provide links to external resources, keep in mind that the configuration schema does not support markdown, 
but it has a `links` feature. The above example can be modified so that the links are clickable:

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
            "default": "",
            "propertyOrder": 1
        },
        "#password": {
            "title": "Password",
            "type": "string",
            "format": "password",
            "minLength": 1,
            "default": "",
            "propertyOrder": 2
        },
        "dateFrom": {
            "title": "Date from",
            "type": "string",
            "description": "Any date accepted by the strtotime function",            
            "minLength": 1,
            "default": "",
            "propertyOrder": 3,
            "links": [
                {
                    "rel": "strtotime Documentation",
                    "href": "https://www.php.net/manual/en/function.strtotime.php"
                }
            ]
        },
        "dateTo": {
            "title": "Date to",
            "type": "string",
            "description": "Any date accepted by the strtotime function",
            "minLength": 1,
            "default": "",
            "propertyOrder": 4,
            "links": [
                {
                    "rel": "strtotime Documentation",
                    "href": "https://www.php.net/manual/en/function.strtotime.php"
                }
            ]
        }
    }
}
{% endhighlight %}

Which renders like this:

{: .image-popup}
![Configuration Schema with links](/extend/component/ui-options/configuration-schema-2.png)
