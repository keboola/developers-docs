---
title: Iterations
permalink: /extend/generic-extractor/iterations/
---

The `iterations` section allows you to execute the configuration multiple times while using different
values each time. `iterations` is configured as an array of objects, where each object contains the
same properties as the [`config`](/extend/generic-extractor/config/) section. All properties of the object are optional. 

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "users"
                }
            ]
        },
        "iterations": [
            {
                "username": "JohnDoe",
                "#password": "TopSecret"
            },
            {
                "username": "DoeJohn",
                "#password": "EvenMoreSecret"
            }
        ]
    }
}
{% endhighlight %}

The above `iterations` configuration defines that the entire Generic Configuration will be executed
twice. First with username `JohnDoe` (and the respective password) and second time with
username `DoeJohn` (and the respective password). The most typical use for `iterations` is extraction of 
the same data from multiple accounts. This also means that `iterations` configuration can always be
replaced by creating multiple complete configurations of Generic extractor.

Keep in mind that `iterations` applies only to things specified in the `config` section. 
You cannot specify anything from the `api` section (you have to use [functions](/extend/generic-extractor/functions/)).
Also, it is not possible to iterate over values returned in response. The number of iterations and their
values must be defined in the configuration.

## Configuration
The values defined in `iterations` override those in the
the `config` section therefore you can use anything allowed in the `config` section (including arbitrary user
attributes used in [functions](/extend/generic-extractor/functions/)). Although anything is allowed, it does not
make much sens to use `jobs` and `mappings` in iterations. Also if you use `userData` in iterations, they
must result in same columns (otherwise the resulting table cannot be imported into Storage). If
you use `incrementalOutput` then only the last value of `incrementalOutput` is honored.

## Examples

### Iterating Parameters
Suppose, you have an API which takes an URL parameter `account_id` which filters the returned data to a
certain account. The following configuration executed entire configuration for two accounts `345` and `456`:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "outputBucket": "ge-tutorial",
            "userData": {
                "account": {
                    "attr": "accountId"
                }
            },
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "account_id": {
                            "attr": "accountId"
                        }
                    }
                }
            ]
        },
        "iterations": [
            {
                "accountId": 345
            },
            {
                "accountId": 456
            }
        ]
    }
}
{% endhighlight %}

Notice that the `iterations` override values in the `config` section, which means that the 
below configuration would yield exactly the same result as the above one:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "outputBucket": "ge-tutorial",
            "accountId": 123,
            "userData": {
                "account": {
                    "attr": "accountId"
                }
            },
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "account_id": {
                            "attr": "accountId"
                        }
                    }
                }
            ]
        },
        "iterations": [
            {
                "accountId": 345
            },
            {
                "accountId": 456
            }
        ]
    }
}
{% endhighlight %}

Even though it might look as if the first execution would be with `account_id=123` it is not true actually.
The configuration will be executed only twice, the first time with `account_id=345` and `account_id=456`. 
See [example [EX112]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/112-iterations-params).

### Iterating Headers
Suppose you have an API from which you want to extract data from two accounts (`JohnDoe` and `DoeJohn`). The 
API uses [HTTP Basic Authentication](/extend/generic-extractor/api/authentication/basic/) method. Plus each user
has his own API token which must be provided in the `X-Api-Token` header. 

Even if the above parameters relate to the [`api` configuration](/extend/generic-extractor/api/) which cannot 
be directly included in `iterations` it is still possible to use them.

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ]
        },
        "iterations": [
            {
                "http": {
                    "headers": {
                        "X-Api-Token": "1234abcd"
                    }
                },
                "username": "JohnDoe",
                "#password": "TopSecret"
            },
            {
                "http": {
                    "headers": {
                        "X-Api-Token": "zyxv9876"
                    }
                },                
                "username": "DoeJohn",
                "#password": "EvenMoreSecret"
            }
        ]
    }
}
{% endhighlight %}

The above configuration overrides `username` and `#password` from the config section and overrides also 
the `http.headers.X-Api-Token` setting. It is also possible to simplify this configuration 
using [functions and references](/extend/generic-extractor/functions/):

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "http": {
                "headers": {
                    "X-Api-Token": {
                        "attr": "apiToken"
                    }
                }
            },
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ]
        },
        "iterations": [
            {
                "apiToken": "1234abcd",
                "username": "JohnDoe",
                "#password": "TopSecret"
            },
            {
                "apiToken": "zyxv9876",
                "username": "DoeJohn",
                "#password": "EvenMoreSecret"
            }
        ]
    }
}
{% endhighlight %}

See [example [EX113]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/113-iterations-headers).
