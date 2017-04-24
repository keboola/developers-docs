---
title: Basic Authentication
permalink: /extend/generic-extractor/api/authentication/basic/
---

Basic Authentication provides the [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)
method. It requires entering a username and password in the configuration and sends the encoded values in the 
`Authorization` header. A sample Basic authentication looks like this:

{% highlight json %}
{
    "api": {
        ...,
        "authentication": {
            "type": "basic"
        }
    },
    "config": {
        "#username": "JohnDoe",
        "#password": "secret"
    }
}
{% endhighlight %}

The `username` and `password` fields are part of the [`config` section](/extend/generic-extractor/config/). 
They are also prefixed by the hash `#` character, which means they are stored [encrypted](/overview/encryption/). 
If the API expects something else than a username and a password in the `Authorization` header, or if it requires 
a custom authorization header, use the [Default Headers option](/extend/generic-extractor/api/#headers).

## Configuration Parameters
This `basic` type of authentication has no configuration parameters. The login and password must be provided in the 
[`config` section](/extend/generic-extractor/config/) of the Generic Extractor configuration.

## Basic Configuration Example
Assume you have an API which requires you to use the HTTP Basic authentication to send the login and password in 
the `Authorization` header. Assume that your login is `JohnDo` and password is `secret`. The following 
configuration solves the situation:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "debug": true,
            "#username": "JohnDoe",
            "#password": "secret",
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users"
                }
            ]
        }
    }
}
{% endhighlight %}

The following HTTP header will be sent:

    Authorization: Basic Sm9obkRvZTpzZWNyZXQ=

