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

#### md5
The [`md5` function](http://php.net/manual/en/function.md5.php) calculates the [MD5 hash](https://en.wikipedia.org/wiki/MD5) of a string. The function takes one argument, which 
is the string to hash.

{% highlight json %}
{
    "function": "md5",
    "args": [
        "NotSoSecret"
    ]
}
{% endhighlight %}

The above will produce `1228d3ff5089f27721f1e0403ad86e73`. See [example](#job-parameters).

#### sha1
The [`sha1` function](http://php.net/manual/en/function.sha1.php) calculates the [SHA-1 hash](https://en.wikipedia.org/wiki/SHA-1) of a string. The function takes one argument, which 
is the string to hash.

{% highlight json %}
{
    "function": "sha1",
    "args": [
        "NotSoSecret"
    ]
}
{% endhighlight %}

The above will produce `64d5d2977cc2573afbd187ff5e71d1529fd7f6d8`. See [example](#job-parameters).

#### base64_encode
The [`base64_encode` function](http://php.net/manual/en/function.base64-encode.php) converts a
string to the [MIME Base64 encoding](https://en.wikipedia.org/wiki/Base64#MIME). The function
takes one argument, which is the string to encode.

{% highlight json %}
{
    "function": "base64_encode",
    "args": [
        "TeaPot"
    ]
}
{% endhighlight %}

The above will produce `VGVhUG90`. See [example](#nested-functions)


TODO
- hash_hmac

- urlencode (available only in `api.baseUrl` context)


#### time
The [`time` function](http://php.net/manual/en/function.time.php) returns the current time as a 
[Unix timestamp](https://en.wikipedia.org/wiki/Unix_timehttps://en.wikipedia.org/wiki/Unix_time). 
To obtain the current time in a more readable format, you probably want to use the
the [`date` function](#date). The function takes no arguments.

{% highlight json %}
{
    "function": "time"
}
{% endhighlight %}

The above will produce something like `1492674974`. TODO example ?

#### date
The [`date` function](http://php.net/manual/en/function.date.php) formats the provided or the current 
timestamp into a human readable format. The function takes either one or two arguments. The first argument
is a [formatting string](http://php.net/manual/en/function.date.php#refsect1-function.date-parameters). 
The second argument is optional 
[Unix timestamp](https://en.wikipedia.org/wiki/Unix_timehttps://en.wikipedia.org/wiki/Unix_time), if not
provided, the current time is used.

{% highlight json %}
{
    "function": "date",
    "args": [
        "Y-m-d"
    ]
}
{% endhighlight %}

The above will produce something like `2017-04-20`. 

{% highlight json %}
{
    "function": "date",
    "args": [
        "Y-m-d H:i:s",
        1490000000
    ]
}
{% endhighlight %}

The above will produce `2017-03-20 8:53:20`. See [example](#user-data).

#### strtotime
The `strtotime` function converts a string date into a [Unix timestamp](https://en.wikipedia.org/wiki/Unix_timehttps://en.wikipedia.org/wiki/Unix_time). The function takes
one or two arguments. The first argument is the string date, the second argument is the base for
relative dates (see below).

{% highlight json %}
{
    "function": "strtotime",
    "args": [
        "21 oct 2017 9:16pm"
    ]
}
{% endhighlight %}

The above will produce `1508620560` which represents the date `2017-10-21 21:16:00`. However the
`strtotime` function is most useful with relative dates which it also allows. For example, you can
write:

{% highlight json %}
{
    "function": "strtotime",
    "args": [
        "-7 days",
        1508620560
    ]
}
{% endhighlight %}

The above will give `1508015760` which represents the date `2017-10-14 21:16:00`. The second argument
specifies the base date (as a Unix timestamp) from which the relative date is computed. This is particularly
useful for [incremental extraction](/extend/generic-extractor/incremental/). Also note that 
it is common to combine the `strtottime` and `date` functions to convert between string and timestamp
representation of a date (see [example](#nested-strtotime).

#### sprintf
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

#### concat
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

The above will produce `HenOrEgg` (see [example 1](#api-base-url), [example 2](#headers)). See also the
[`implode` function](#implode).

#### implode
The [`implode` function](http://php.net/manual/en/function.implode.php) concatenates an arbitrary number 
of strings into one using a delimiter. The function takes
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

The above will produce `apples,oranges,plums`. (see [example](#headers))
The delimiter can be empty in which case the `implode` function is equivalent to the [`concat` function](#concat):

{% highlight json %}
{
    "function": "implode",
    "args": [
        "",
        [
            "Hen",
            "Or",
            "Egg"
        ]
    ]
}
{% endhighlight %}

#### ifempty
The `ifempty` function can be useful for handling optional values. The function takes two arguments and 
returns the first one if it is not empty. If the first argument is empty, it returns the second argument.

{% highlight json %}
{
    "function": "ifempty",
    "args": [
        "",
        "Banzai"
    ]
}
{% endhighlight %}

The above will return `Banzai`. For the `ifempty` function an empty string and the values `0` and `null` are
considered 'empty' (see an [example](. 

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
                    "X-AppKey": "ThisIsSecret",
                    "X-Auth": {
                        "function": "concat",
                        "args": [
                            "Tea",
                            "Pot"
                        ]
                    }
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
        "http.headers.X-Auth.function": "concat",
        "http.headers.X-Auth.args.0": "Tea",
        "http.headers.X-Auth.args.1": "Pot",
		"userData.tag": "fullExtract",
		"userData.mode": "development",
		"mappings.content.whatever": "foobar"
	}
}
{% endhighlight %}

#### Placeholder Context
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

#### Base URL Context
The Base URL function context is used when setting the [`baseURL` for API](/extend/generic-extractor/api/#base-url). The
base URL function context contains [*configuration attributes*](/#function-contexts). See [example](#api-base-url).

#### Headers Context
The Headers function context is used when setting the [`http.headers` for API](/extend/generic-extractor/api/#headers)
or the [`http.headers` in config](/extend/generic-extractor/config/#http). The Headers function context contains [*configuration attributes*](/#function-contexts). See [example](#headers).

#### Parameters Context
The Parameters function context is used when setting job [request parameters -- `params`](/extend/generic-extractor/config/jobs/#request-parameters). The parameters context contains 
[*configuration attributes*](/#function-contexts) plus the times of the current (`currentStart`) and 
previous (`previousStart`) run of Generic Extractor. The times are [Unix timestamps](https://en.wikipedia.org/wiki/Unix_time).
If the extraction is run for the first time, the `previousStart` is 0.

With the following configuration:

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
            "jobs": [
                ...
            ]
        }
    }
}
{% endhighlight %}

The parameters function context will contain:

{% highlight json %}
{
	"attr": {
		"debug": true,
		"outputBucket": "mock-server",
		"server": "localhost:8888",
    },
    "time": {
        "previousStart": 0,
        "currentStart": 1492678268
    }
}
{% endhighlight %}

See [example of using parameters context](#job-parameters). The `time` values are used in
[incremental processing](todo).

#### User Data Context
The User Data function context is used when setting the [`userData`](/extend/generic-extractor/config/#user-data). The
The parameters context contains [*configuration attributes*](/#function-contexts) plus the times of the current (`currentStart`) and previous (`previousStart`) run of Generic Extractor. The User Data Context is therefore 
same as the [Parameters Context](#parameters-context). See [example](#user-data).



## Examples
TODO: poskladat examply stejne jako contexty a to  asi ?
- api url
- api headers (+ config headers)
- job parameters
- job placeholders
- user data ?

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
Let's say that you have an API, which requires that you send a hash of some value with every request. Specifically,
each request must be done with [HTTP POST method](/extend/generic-extractor/tutorial/rest/#method) with content:

{% highlight json %}
{
    "token": "someValue"
}
{% endhighlight %}

The following configuration does exactly that:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "tokenValue": "NotSoSecret",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "method": "POST",
                    "params": {
                        "token": {
                            "function": "md5",
                            "args": [
                                {
                                    "attr": "tokenValue"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

In the above configuration, the value of the token is taken from the configuration root (using the `attr` reference).
This is useful in case of the configuration is used as part of a [template](todo). The actual hash will be generated
of the `NotSoSecret` value.
See the [full example](todo:089-function-job-parameters-md5) or an alternative [with SHA1 hash](090-function-job-parameters-sha1).

### Optiona Job Parameters 
Let's say you have an API which allows you to send the list of columns to be contained in the API response.
For example to list users and include their `id`, `name` and `login` properties, you have to call
`/users?showColumns=id,name,login`. Also you want to enter these values an array in the `config` section, because
the config is generated by a [template](todo). If the end-user does not wish to filter the columns, she can
list all the columns (which would be annoying) or leave the column filter empty. In that case, the API
call would be `/users?showColumns=all`. The following configuration does exactly that:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "columns": "",
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "method": "GET",
                    "params": {
                        "showColumns": {
                            "function": "ifempty",
                            "args": [
                                {
                                    "attr": "columns"
                                },
                                "all"
                            ]
                        }
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

See the [full example](097-function-ifempty).

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

### User Data
Assume that you have an API which returns a response that does not contain any time information in 
the response, e.g.:

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

You may want to add the extraction time to each record so that you at least know when 
each record was obtained (when the creation time is unknown). You can add additional data to
each record using the [`userData` configuration](/extend/generic-extractor/config/#user-data):

{% highlight json %}
"userData": {
    "extractionDate": {
        "function": "date",
        "args": [
            "Y-m-d H:i:s",
            {
                "time": "currentStart"
            }
        ]
    }
}
{% endhighlight %}

The following table will be extracted:

|id|name|extractionDate|
|3|John Doe|2017-04-20 10:17:20|
|234|Jane Doe|2017-04-20 10:17:20|

You may also be tempted to use an alternative configuration:

{% highlight json %}
"userData": {
    "extractionDate": {
        "function": "date",
        "args": [
            "Y-m-d H:i:s"
        ]
    }
}
{% endhighlight %}

The alternative configuration also puts current date, but whereas the first one puts a single same
date to each record, the alternative configuration will return different times for different records 
as they are extracted. 
See the [full example](todo:091-function-user-data) or an alternative [example with set date](092-function-user-date-set-date).

### Headers
Suppose you have an API which requires you to send a custom `X-Api-Auth` header with every request.
The header must contain user name and password separated by a colon -- e.g. `JohnDoe:TopSecret`. 

This can be done using the following `api` configuration:

{% highlight json %}
"api": {
    "baseUrl": "http://example.com/",
    "http": {
        "headers": {
            "X-Api-Auth": {
                "function": "concat",
                "args": [
                    {
                        "attr": "credentials.#username"
                    },
                    ":",
                    {
                        "attr": "credentials.#password"
                    }
                ]
            }
        }
    }
}
{% endhighlight %}

Alternatively, you can achieve the same result using the `implode` function:

{% highlight json %}
"api": {
    "baseUrl": "http://mock-server:80/093-function-api-http-headers/",
    "http": {
        "headers": {
            "X-Api-Auth": {
                "function": "implode",
                "args": [
                    ":",
                    [
                        {
                            "attr": "credentials.#username"
                        },
                        {
                            "attr": "credentials.#password"
                        }
                    ]
                ]
            }
        }
    }
}
{% endhighlight %}

Both configurations rely of having the username and password parameters 
in the [`config` section](/extend/generic-extractor/config/). In this case also nested in a `credentials` property:

{% highlight json %}
"config": {
    "credentials": {
        "#username": "JohnDoe",
        "#password": "TopSecret"
    },
    "jobs": ...
}
{% endhighlight %}

See the [example](todo:093-function-api-http-headers) or an 
[alternative example setting headers in the `config` section](todo:094-function-config-headers).

### Nested Functions
If the API in the [above example](#headers) would try to mimic 
[HTTP authentication](/extend/generic-extractor/api/authentication/basic/),
the header has to be sent as [base64 encoded](todo) value. That is instead of sending
`JohnDoe:TopSecret`, you have to send `Sm9obkRvZTpUb3BTZWNyZXQ=`. To do this you have to wrap the `concat` 
function which generates the header value in another function (`base64_encode`).

{% highlight json %}
"api": {
    "baseUrl": "http://example.com/",
    "http": {
        "headers": {
            "X-Api-Auth": {
                "function": "base64_encode",
                "args": [
                    {
                        "function": "concat",
                        "args": [
                            {
                                "attr": "#username"
                            },
                            ":",
                            {
                                "attr": "#password"
                            }
                        ]
                    }
                ]
            }
        }
    }
}
{% endhighlight %}

See the [example](todo:095-function-nested). 

### Nested StrToTime
Suppose you have an API which requires you to specify `from` and `to` date parameters to obtain orders created 
in that time interval. You want to specify only the `from` date and extract a week of data.
So you want to enter (preferably in a [template](todo)) the value `2017-10-04` and send an API request to
`/orders?from=2017-10-04&to=2017-10-11`. The following configuration can be used:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "startDate": "2017-10-04",
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "method": "GET",
                    "params": {
                        "from": {
                            "attr": "startDate"
                        },
                        "to": {
                            "function": "date",
                            "args": [
                                "Y-m-d",
                                {
                                    "function": "strtotime",
                                    "args": [
                                        "+7 days",
                                        {
                                            "function": "strtotime",
                                            "args": [
                                                {
                                                    "attr": "startDate"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

The configuration probably seems rather complicated, so taken apart -- the most innermost part:

{% highlight json %}
{
    "function": "strtotime",
    "args": [
        {
            "attr": "startDate"
        }
    ]
}
{% endhighlight %}

Takes the value from the `config` property `startDate` (which is `2017-10-04`) and converts it to
some timestamp value (`???` below). Then there is an outer part:

{% highlight json %}
{
    "function": "strtotime",
    "args": [
        "+7 days",
        ???
    ]
}
{% endhighlight %}

This takes the timestamp representing `2017-10-04` and adds 7 days to it. This yields another 
timestamp value (`???` below). Then there is another outer part:

{% highlight json %}
{
    "function": "date",
    "args": [
        "Y-m-d",
        ???
}
{% endhighlight %}

The converts the timestamp back to a string format (`Y-m-d` format) which yields `2017-10-11`. This
value is assigned to the `to` parameter of the API call.



todo, muze se pouzit user funkce v ## Force Stop scrolleru  ?


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

