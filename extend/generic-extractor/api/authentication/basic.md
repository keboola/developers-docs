---
title: Basic Authentication
permalink: /extend/generic-extractor/api/authentication/basic/
---

Basic Authentication provides [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)
method. It requires entering a username and password in configuration and sends the encoded values in `Authorization` 
header.

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

The `username` and `password` field are supplied in the [`config`](/extend/generic-extractor/configuration)
section. They are also prefixed by the hash `#` character which means that they are stored
[encrypted](/overview/encryption/). If the API expects something else then username and password in the 
`Authorization` header, or if it requires a custom authorization header, you have to use the
[Default Headers option](/extend/generic-extractor/api/#headers).

## Configuration Parameters
This `basic` type of authentication has no configuration parameters. The login and
password must be provided in the [`config`](/extend/generic-extractor/configuration) section of Generic Extractor configuration.

## Examples

### Basic Configuration
Assume you have an API which requires you to use HTTP Basic authentication to send login and password in 
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

