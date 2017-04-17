---
title: User Functions
permalink: /extend/generic-extractor/user-functions/
---

TODO: prejmenovat na "function calls" ??

User functions can be used in several places of Generic Extractor configuration to introduce dynamically generated values instead of
statically provided ones. User functions are simple pre-defined functions which allow you to add extra flexibility when needed. User functions
also allow referencing an already existing value in the configuration instead of copying it. Using user functions is also advantageous (and sometimes necessary)
when you [register your configuration as a new component](/extend/generic-extractor/registration/).

## Configuration
A user function is used instead of a simple value in specific parts (see [below](todo) of Generic Extractor configuration. The function
configuration is an object with properties `function` (one of [available function names](todo) and `args` (function arguments), e.g.:

{% highlight json %}
{
    "function": "concat",
    "args": [
        "John",
        "Doe"
    ]
}
{% endhighlight %}

The argument of a function can be any of:

- [scalar](todo) value (as in the above example),
- a reference to function context (see below),
- another function object.

### Allowed functions

- md5
- sha1
- time
- date
- strtotime
- base64_encode
- hash_hmac
- sprintf
- concat
- ifempty
- implode
- urlencode (available only in `api.baseUrl` context)

or a reference to another value in the configuration:

{% highlight json %}
{
    "attr": "username"
}
{% endhighlight %}

or a reference to a parameter in the function **context**:

{% highlight json %}
todo
{% endhighlight %}

or a simple value:

{% highlight json %}
{
    "a scalar value"
}
{% endhighlight %}

All these forms may be combined freely and they may be nested in a virtually unlimited way, e.g.:

{
    "function": "concat",
    "args": [
        {
            "attr": "username"
        },
        "-spacer-",
        {
            "function": "time"
        }
    ]
}

## Supported Functions

## Function Contexts
Apart from

### Placeholder Context

The placeholder function context contains the following structure:

{% highlight json %}
{
    "placeholder": {
        "value": "???"
    }
}
{% endhighlight %}

Where `???` is the value provided in the `path` property of the respective placeholder.




## Examples

### Job Placeholders
Let's say you have an API which has and endpoint `/users` which returns a list of user and
endpoint `/user/{userId}` which returns details of a specific user with given ID. The list response
looks like this:

{% highlight json %}
[
    {
        "id": 3,
        "name": "John Doe"
    },
    {
        "id": 234,
        "name": "Jane Doe"
    }
]
{% endhighlight %}

To obtain the details of the first user, the user-id has to be padded to five digits. The details API call for the
first user must be sent to `/user/00003`, and for the second user to `/user/00234`. To achieve this you can use the
`sprintf` function which allows [number padding](http://php.net/manual/en/function.sprintf.php#example-5484). The
following `placeholders` configuration in the child job calls the function with first argument set to
`%'.05d` (which is a sprintf [format](http://php.net/manual/en/function.sprintf.php) to pad with zeros to 5 digits)
and second argument set to the value of the `id` property found in the parent response. The placeholder path must
be specified in the `path` property, that means that the configuration:

{% highlight json %}
"placeholders": {
    "user-id": "id"
}
{% endhighlight %}

has to be converted to:

{% highlight json %}
"placeholders": {
    "user-id": {
        "path": "id",
        "function": "sprintf",
        "args": [
            "%'.05d",
            {
                "placeholder": "value"
            }
        ]
    }
}
{% endhighlight %}

The following `user-detail` table will be extracted:

|id|name|address\_city|address\_country|address\_street|parent\_id|
|123|John Doe|London|UK|Whitehaven Mansions|00003|
|234|Jane Doe|St Mary Mead|UK|High Street|00234|

Notice that the `parent_id` column contains the processed value and not the original one.

See the [full example](todo:085-function-job-placeholders).

## User functions

Use [php-codebuilder](https://github.com/keboola/php-codebuilder) library for advanced functionality, such as dynamically transforming strings or date values in API call parameters.

parameters :
    - OR contain an [user function](/extend/generic-extractor/user-functions/) as described below, for example to load value from parameters:
    - Example

            {
                "start_date": {
                    "function":"date",
                    "args": [
                        "Y-m-d+H:i",
                        {
                            "time":"previousStart"
                        }
                    ]
                }
            }



        - You can also use an [user function](/extend/generic-extractor/user-functions/) on the value from a parent using an object as the placeholder value
        - That object MUST contain a `path` key that would be the value of the placeholer, and a `function`. To access the value in the function arguments, use `{"placeholder": "value"}`
            - Example:

                    {
                        "placeholders": {
                            "1:id": {
                                "path": "id",
                                "function": "urlencode",
                                "args": [
                                    {
                                        "placeholder": "value"
                                    }
                                ]
                            }
                        }
                    }

        - Further documentation can be found at [keboola/php-filter](https://github.com/keboola/php-filter)


### `baseUrl`
- Either a string with base URL of the API (eg `https://connection.keboola.com/v2/`)
- OR an [user function](/extend/generic-extractor/user-functions/), if there's a configurable part of the base URL, such as a subdomain, or an account ID..
- Example using a function:

        {
            "api": {
                "function": "concat",
                "args": [
                    "https://",
                    { "attr": "domain" },
                    ".zendesk.com/api/v2/"
                ]
            },
            "config": {
                "domain": "yourDomain"
            }
        }

    - for *https://__yourDomain__.zendesk.com/api/v2/*
    - uses `config` part, where attribute **domain** would contain `yourDomain`

todo, muze se pouzit user funkce v ## Force Stop scrolleru  ?

- [User functions](/extend/generic-extractor/user-functions/) can be used as a value, for intance to fill in a current date:

    - Config:

            {
                "config": {
                    "userData": {
                        "export_date": {
                            "function": "date",
                            "args": [
                                "Y-m-d"
                            ]
                        }
                    }
                }
            }

    - Result:

            "id","username","export_date"
            "1","Joe","2016-06-30"
            "2","Garry","2016-06-30"

## Example

    {
        "config": {
            "incrementalOutput": true,
            "jobs": [
                {
                    "endpoint": "events"
                }
            ]
        }
    }

###  Query auth

- **authentication.type**: `query`
- **authentication.query**: An object that describes each query parameter, where each key in the object is the actual query parameter, and its value is either its value, pointer to a config value or an [user function](/extend/generic-extractor/user-functions/)

## Example:

### Configuration:

{% highlight json %}
{
    "api": {
        "authentication": {
            "type": "url.query",
            "query": {
                "apiKey": {
                    "attr": "apiKey"
                },
                "sig": {
                    "function": "md5",
                    "args": [
                        {
                            "function": "concat",
                            "args": [
                                {
                                    "attr": "apiKey"
                                },
                                {
                                    "attr": "#secret"
                                },
                                {
                                    "function": "time"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    "config": {
        "apiKey": "asdf1234",
        "#secret": "KBC::ComponentEncrypted==gvrevgrew\grewvgr\ev6\u45bu\65^|VH|^vh==",
        "jobs": []
    }
}
{% endhighlight %}

- The first item will look for the *apiKey* query parameter value in the config attribute named *apiKey*
- The second item will generate a *sig* parameter value from MD5 of merged configuration table attributes *apiKey* and *secret*, followed by current *time()* at the time of the request (time() being the PHP function)
- Allowed functions are listed below in the *User functions* section
- If you're using any config parameter by using `"attr": "parameterName"`, it has to be identical string to the one in the actual config, including eventual `#` if KBC Docker's encryption is used.

- Data available in query functions:
    - **attr**: An attribute from `config` (first level only)
    - **query**: A value from a query parameter
        - Ex.: `{ "query": "par1" }` will return `val1` if the request query contains `?par1=val1`
    - **request**: Information about the request
        - Available information:
            - `url`
            - `path`
            - `queryString`
            - `method`
            - `hostname`
            - `port`
            - `resource`

- For an example that includes request data in a function, please refer to the [OAuth 20 HMAC example part](/extend/generic-extractor/authentication/oauth/20/#example-for-mac-authentication).

## Example:

### Configuration:

{% highlight json %}
{
    "api": {
        "authentication": {
            "type": "login",
            "loginRequest": {
                "endpoint": "Security/Login",
                "headers": {
                    "Content-Type": "application/json"
                },
                "method": "POST",
                "params": {
                    "UserName": {
                        "attr": "username"
                    },
                    "PassWord": {
                        "attr": "password"
                    }
                }
            },
            "apiRequest": {
                "headers": {
                    "X-Api-Token": "Ticket"
                }
            }
        }
    },
    "config": {
        "username": "whoever",
        "password": "soSecret",
        "jobs": [
            {
                "endpoint": "reports"
            }
        ]
    }
}
{% endhighlight %}

This example will first send the following request:

```
POST Security/Login
Host: ...(baseUrl)...
Content-Type: application/json

{
    "UserName": "whoever",
    "PassWord": "soSecret"
}
```

And expect a reply such as:

```
{
    "Ticket": "12345abcde"
}
```

Then the value from `Ticket` in the JSON will be used as a `X-Api-Token` header in actual API requests:

```
GET reports
Host: ...(baseUrl)...
X-Api-Token: 12345abcde
```

