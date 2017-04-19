---
title: Functions
permalink: /extend/generic-extractor/functions/
---

Functions can be used in several places of Generic Extractor configuration to introduce dynamically generated values instead of
statically provided ones. Functions are simple pre-defined functions which allow you to add extra flexibility when needed. Functions
also allow referencing already existing values in the configuration instead of copying them. Using functions is also advantageous (and sometimes necessary)
when you [register your configuration as a new component](/extend/generic-extractor/registration/).

## Configuration
A function is used instead of a simple value in specific parts (see [below](#function-contexts) of Generic Extractor configuration. The function
configuration is an object with properties `function` (one of [available function names](#supported-functions) and `args` (function arguments), e.g.:

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
- a reference to a value from [function context (see below)](#function-contexts),
- another function object.

Additionally, the function may be replaced by a plain reference to the function context. This mean that you can write (where permitted)
a configuration value in three possible ways:

**Simple value:**

{% highlight json %}
{
    ...,
    "baseUrl": "http://example.com/
}
{% endhighlight %}

**A function call:**

{% highlight json %}
{
    ...,
    "baseUrl": {
        "function": "concat",
        "args": {
            "http://",
            "example.com"
        }
    }
}
{% endhighlight %}

**A reference to a value from function context:**
{% highlight json %}
{
    ...,
    "baseUrl": {
        "attr": "someUrl"
    }
}
{% endhighlight %}

All these forms may be combined freely and they may be nested in a virtually unlimited way, e.g.:

{% highlight json %}
{
    ...,
    "baseUrl": {
        "function": "concat",
        "args": [
            "https://",
            {
                "attr": "domain"
            }
        ]
    }
}
{% endhighlight %}

### Supported functions

- md5
- sha1
- time
- date
- strtotime
- base64_encode
- hash_hmac

#### Sprintf
The `sprintf` function formats values and inserts them into a string. The `sprintf` function maps directly to
the [original PHP function](http://php.net/manual/en/function.sprintf.php) which is very versatile and has many
uses. The function accepts two or more arguments. The first argument is a string with
[formatting directives](http://php.net/manual/en/function.sprintf.php) (marked with percent character `%`),
other arguments are values inserted into the string:

{% highlight json %}
{
    "function": "sprintf",
    "args": [
        "Three %s are %.2f %s.",
        "apples",
        0.5,
        "plums"
    ]
}
{% endhighlight %}

The above will produce `Three apples are 0.50 plums.`
(see [simple insert example](#api-base-url) or [formatting example](#job-placeholders))

#### Concat
The `concat` function concatenates an arbitrary number of strings into one. For example:

{% highlight json %}
{
    "function": "concat",
    "args": [
        "Hen",
        "Or",
        "Egg"
    ]
}
{% endhighlight %}

The above will produce `HenOrEgg` (see [example](#api-base-url). See also the
[implode function](#implode).

- ifempty

#### Implode
The implode function concatenates an arbitrary number of strings into one using a delimiter. The function takes
two arguments, first is the delimiter string which is used for the concatenation, second is an array of values to
be concatenated. For example:

{% highlight json %}
{
    "function": "implode",
    "args": [
        ",",
        [
            "apples",
            "oranges",
            "plums"
        ]
    ]
}
{% endhighlight %}

The above will produce `apples,oranges,plums`. todo example

See also the [concat function](#concat).


- urlencode (available only in `api.baseUrl` context)

### Function Contexts
Every place in the Generic Extractor configuration in which a function may be used may allow different arguments of the function.
This is referred to as a **function context**. Many contexts share access to *configuration attributes*.

#### Configuration Attributes
The *configuration attributes* are accessible in some function contexts and they represent the entire [`config`](http://localhost:4000/extend/generic-extractor/config/)
section of Generic Extractor configuration. There is some processing involved which means that:

- the [`jobs`](http://localhost:4000/extend/generic-extractor/config/jobs/) section is removed entirely,
- all other values are flattened (keys are concatenated using dot `.`) into a one-level deep object,
- the result object is available in a property named `attr`.

For example the following configuration:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com"
        },
        "config": {
            "debug": true,
            "outputBucket": "get-tutorial",
            "server": "localhost:8888",
            "incrementalOutput": false,
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ],
            "http": {
                "headers": {
                    "X-AppKey": "ThisIsSecret"
                }
            },
            "userData": {
                "tag": "fullExtract",
                "mode": "development"
            },
            "mappings": {
                "content": {
                    "whatever": "foobar"
                }
            }
        }
    }
}
{% endhighlight %}

Will be converted to the following function context:

{% highlight json %}
{
	"attr": {
		"debug": true,
		"outputBucket": "mock-server",
		"server": "localhost:8888",
		"incrementalOutput": false,
		"http.headers.X-AppKey": "ThisIsSecret",
		"userData.tag": "fullExtract",
		"userData.mode": "development",
		"mappings.content.whatever": "foobar"
	}
}
{% endhighlight %}

### Placeholder Context
The Placeholder function context refers to configuration of [placeholders in child jobs](/extend/generic-extractor/config/jobs/children/#placeholders).
When using function to process placeholder value, the placeholder must be specified as an object with `path` property. Therefore instead of writing:

{% highlight json %}
"placeholders": {
    "user-id": "userId"
}
{% endhighlight %}

You have to write:

{% highlight json %}
"placeholders": {
    "user-id": {
        "path": "userId",
        "function": ...
    }
}
{% endhighlight %}

The placeholder function context contains the following structure:

{% highlight json %}
{
    "placeholder": {
        "value": "???"
    }
}
{% endhighlight %}

Where `???` is the value obtained from the response JSON from the path provided in the `path` property
of the placeholder. See [example](#job-placeholders).

### Base URL Context
The Base URL function context is used when setting the [`baseURL` for API](/extend/generic-extractor/api/#base-url). The
base URL function context contains [*configuration attributes*](/#function-contexts).


### Parameters Context


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

See the [full example](todo:085-function-job-placeholders) (or a not-so-useful example of [using reference](todo:086-function-job-placeholders-reference)).

### Job Parameters


### API Base URL
When you use [register your Generic Extractor configuration](/extend/generic-extractor/registration/), chances are that you want the end-user to
provide part of the API configuration. Due to the limitations of [how templates work](todo), the parameter obtained from the end-user configuration
will be only available in the `config` section. Let's say that the end-user enters `www.example.com` as the API server and that values becomes
available as the `server` property of the `config` section, e.g:

{% highlight json %}
"config": {
    "outputBucket": "ge-tutorial",
    "server": "www.example.com",
    "jobs": [
        {
            "endpoint": "users",
            "dataType": "users"
        }
    ]
}
{% endhighlight %}

This means that the [*configuration attributes*](#configuration-attributes) will be available as:

{% highlight json %}
{
    "attr": {
        "outputBucket": "ge-tutorial",
        "server": "www.example.com"
    }
}
{% endhighlight %}

You can then use the [`concat` function](todo) to access that value and merge it with other parts to create the
final API URL (`http://example.com/api/1.0/`):

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": {
                "function": "concat",
                "args": [
                    "http://",
                    {
                        "attr": "server"
                    },
                    "/api/1.0/"
                ]
            }
        },
    }
}
{% endhighlight %}

See the [full example with concat](todo:087-function-baseurl) or an alternative [example with sprintf](088-function-baseurl-sprintf).


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

