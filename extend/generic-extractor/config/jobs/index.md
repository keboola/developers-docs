---
title: Jobs
permalink: /extend/generic-extractor/config/jobs/
---

* TOC
{:toc}

The jobs section of the configuration contains descriptions of the API resources to be
extracted. The `jobs` configuration property is an array of processed API endpoints. A
**single job represents a single [API resource](/extend/generic-extractor/tutorial/rest)**.
If new to Generic Extractor, learn about [jobs in our tutorial](/extend/generic-extractor/tutorial/jobs/) first.

<details>
  <summary>Click to see a sample job configuration.</summary>

{% highlight json %}
{
    ...,
    "config": {
    "jobs": [
        {
                "endpoint": "users",
                "method": "get",
                "dataField": "items",
                "dataType": "users",
                "params": {
                    "type": "active"
                },
                "responseFilter": "additional.address/details",
                "responseFilterDelimiter": "/",
                "children": [
                    {
                        "endpoint": "users/{user_id}/orders",
                        "dataField": "items",
                        "recursionFilter": "id>20",
                        "placeholders": {
                            "user_id": "id"
                        }
                    }
                ]
            }
        ]
    }
}
{% endhighlight %}
</details>
<br>
Generic Extractor reads and processes the responses from the API endpoints in a pretty complex
way. Each response is processed in the following steps:

- Receive the JSON in the response.
- Find an object in the response array, or find the object identified by [`dataField`](#data-field).
- Flatten the object structure into one or more tables.
- Create the tables in Storage and load data into them.

## Merging Responses
The first two steps are the responsibility of [Jobs](/extend/generic-extractor/config/jobs/) resulting in 
an array of objects. Generic Extractor then tries to find a common super-set of
properties of all objects, for example, with the following response:

{% highlight json %}
[
    {
        "id": 123,
        "name": "foo",
        "color": "green"
    },
    {
        "id": 321,
        "name": "bar",
        "size": "large"
    }
]
{% endhighlight %}

The super-set of object properties consists of `id`, `name`, `color` and `size`. In the Generic Extractor
configuration, this is referred to as [`dataType`](#dataType). If the `dataType` configuration is not set, a name is
automatically generated. This merging of the object structure requires that the objects are compatible.

The responses are merged into type-less tables. This means that values `42` and `apples` are perfectly compatible
because they get converted to a string. Also, the scalar and array values are compatible because the
scalar is [upgraded to an array](#upgrading-to-array). The following are the incompatible combinations:

- Scalar and object values
- Object and array values

For example, this would not be allowed:

{% highlight json %}
[
    {
        "id": 123,
        "name": "foo",
        "color": "green"
    },
    {
        "id": 321,
        "name": "bar",
        "color": {
            "items": ["red", "blue"]
        }
    }
]
{% endhighlight %}

If you want to process the above response, use the
[`responseFilter` setting](/extend/generic-extractor/config/jobs/#response-filter).

## Endpoint
The endpoint property is **required** and represents the URL of the resource. It can be either of the following:

- URL fragment relative to the [`baseURL` property](/extend/generic-extractor/api/#baseurl) of the API definition
- Absolute URL from the domain specified in the [`baseURL` property](/extend/generic-extractor/api/#baseurl) of the API definition
- Full absolute URL

Assume the following [API definition](/extend/generic-extractor/api/):

{% highlight json %}
"api": {
    "baseURL": "https://example.com/3.0/"
}
{% endhighlight %}

### Relative URL Fragment
The relative endpoint **must not start** with a slash; so, with
`endpoint` set to  `campaign`, the final resource URL would be
`https://example.com/3.0/campaign`.

### Absolute Domain URL
The absolute endpoint **must start** with a slash. So, with `/endpoint`
set to `campaign`, the final resource URL would be `https://example.com/campaign`.
This means that the path part specified in the `baseURL` is ignored and fully
replaced by the value specified in `endpoint`.

### Absolute Full URL
The full absolute URL must start with a protocol. So, with endpoint set to
`https://eu.example.com/campaign`, this would be the final resource URL
and the path specified in the `baseURL` is completely ignored.

### Specifying Endpoint
The following table summarizes some possible outcomes:

|`baseURL`|`endpoint`|actual URL|
|---------|----------|----------|
|`https://example.com/3.0/`|`campaign`|`https://example.com/3.0/campaign`|
|`https://example.com/3.0/`|`campaign/`|`https://example.com/3.0/campaign/`|
|`https://example.com/3.0/`|`/1.0/campaign`|`https://example.com/1.0/campaign`|
|`https://example.com/3.0/`|`https://eu.example.com/3.0/`|`https://eu.example.com/3.0/campaign`|
|`https://example.com/`|`campaign`|`https://example.com/campaign`|
|`https://example.com`|`campaign`|`https://example.comcampaign`|

It is highly recommended to use the relative URL fragments. This means that the
`baseURL` property of the `api` section **must end** with a slash.

Use the other two options for handling exceptions in the API extraction (for instance, falling back
to an older API version). Note that using a different domain (or even a base path) may
interfere with the authentication --- depending on the specification of the target API.

Also, closely follow the target API specification regarding trailing slashes. For some APIs,
both `https://example.com/3.0/campaign` and `https://example.com/3.0/campaign/` URLs may
be accepted and valid. For other APIs, however, only one version may be supported.

## Request Parameters
The `params` section defines [request parameters](/extend/generic-extractor/tutorial/rest). They
may be optional or required, depending on the target API specification. The `params` section is
an object with arbitrary properties (or, more precisely, parameters understood by the target
API). It is also allowed to use [function calls](todo).

Assume that `api.baseUrl` is set to `https://example.com/3.0/`, `jobs[].endpoint`
is set to `mock-api` and that the `param` parameters are set as follows:

{% highlight json %}
    "params": {
        "startDate": "2016-01-20",
        "types": ["new", "active", "finished"],
        "filter": {
            "query": "q=user:johnDoe",
            "tags": {
                "first": true,
                "second": false
            }
        }
    }
{% endhighlight %}

See our [examples](/extend/generic-extractor/config/jobs/#examples-with-http-methods-and-parameters).

## Method
The `method` parameter defines the [HTTP request method](/extend/generic-extractor/tutorial/rest/).
The following are the allowed values:

- `GET` (default)
- `POST`
- `FORM`

### GET
The HTTP method encodes the parameters in the URL. Therefore the above `params` definition gets transformed
in the following URL:

    https://example.com/3.0/mock-api?startDate=2016-01-20&types%5B0%5D=new&types%5B1%5D=active&types%5B2%5D=finished&filter%5Bquery%5D=q%3Duser%3AjohnDoe&filter%5Btags%5D%5Bfirst%5D=1&filter%5Btags%5D%5Bsecond%5D=0

or, in a more readable [URLDecoded](https://urldecode.org/) form:

    https://example.com/3.0/mock-api?/mock-server/web/users/12/orders/2/tickets/000/comments?startDate=2016-01-20&types[0]=new&types[1]=active&types[2]=finished&filter[query]=q=user:johnDoe&filter[tags][first]=1&filter[tags][second]=0

### POST
The HTTP POST method sends the parameters in the request body. They are sent as a JSON object in the same form
as entered in the configuration. For the above defined `params` property, the request body would be:

{% highlight json %}
{
    "startDate": "2016-01-20",
    "types": ["new", "active", "finished"],
    "filter": {
        "query": "q=user:johnDoe",
        "tags": {
            "first": true,
            "second": false
        }
    }
}
{% endhighlight %}

Also, the `Content-Type: application/json` HTTP header is added to the request.
See our [examples](/extend/generic-extractor/config/jobs/#examples-with-http-methods-and-parameters).

### FORM
The `FORM` method type sends the request the same way the HTTP POST method does. However,
the parameters from the `param` object are encoded as form data, mimicking the request being sent by
a web form. This method **does not** support nested objects in the `param` object.
For example, the following `params` field:

{% highlight json %}
    "params": {
        "startDate": "2016-01-20",
        "types": ["new", "active", "finished"]
    }
{% endhighlight %}

will be sent as the following POST request body:

    startDate=2016-01-20&types%5B0%5D=new&types%5B1%5D=active&types%5B2%5D=finished

or, in a more readable [URLDecoded](https://urldecode.org/) form:

   startDate=2016-01-20&types[0]=new&types[1]=active&types[2]=finished

Also, the `Content-Type: application/x-www-form-urlencoded` HTTP header will be added to the request.

## Data Type
The `dataType` parameter assigns a name to the object(s) obtained from the endpoint.
Setting it is optional. If not set, a name will be generated automatically from the `endpoint`
value and parent jobs. The parameter is also used as the name of the output table within the
specified [output bucket](/extend/generic-extractor/api/#outputBucket).

Note that you can use the same `dataType` for multiple resources, provided that the result objects may
be [merged into a single one](/extend/generic-extractor/config/mappings/). This can be used,
for example, in a situation where two API endpoints return the same resource:

{% highlight json %}
    "jobs": [
        {
            "endpoint": "solved-tickets/",
            "dataType": "tickets"
        },
        {
            "endpoint": "unsolved-tickets/",
            "dataType": "tickets"
        }
    ]
{% endhighlight %}

In the above case, only a single `tickets` table will be produced in the output bucket. It
will contain records from both API endpoints.

## Data Field
The `dataField` parameter is used to determine what part of the API **response** will be
extracted. The following rules are applied by default:

- If the response is a single *array*, use the whole response.
- If the response is an [object](/extend/generic-extractor-tutorial/json/) and there is a single *array* property,
use that property.
- If the response is an object with none or multiple array properties, require that `dataField` is configured.

Apart from cases where required, the `dataField` configuration may also be set to override the
above default behaviour. The `dataField` parameter contains a
[dot separated path](/extend/generic-extractor/tutorial/json/) to the response property you want to
extract. The `dataField` parameter may be written in two ways --- either as a simple string or
as an object with the `path` property. For instance, these two configurations are equivalent:

{% highlight json %}
    "jobs": [
        {
            "endpoint": "solved-tickets/",
            "dataField": "tickets"
        }
    ]
{% endhighlight %}

{% highlight json %}
    "jobs": [
        {
            "endpoint": "solved-tickets/",
            "dataField": {
                "path": "tickets"
            }
        }
    ]
{% endhighlight %}

## Response Filter
The `responseFilter` option allows you to skip parts of the API response from processing. This can
be useful if

- you do not want to flatten the JSON structure using the default
[JSON Parser](/extend/generic-extractor/config/jobs/#merging-responses) (as in the above examples). 
- the API response is inconsistent and the objects cannot be flattened.

The value of the `responseFilter` property is either a path to a property in the response, or
an array of such paths. The path is dot-separated unless set otherwise in the `responseFilterDelimiter` configuration.
If you want to refer to the items of an array, use `[]` --- see an [example below](#skip-flattening-in-nested-objects).
The same result can be achieved using `forceType` parameter in
[column mapping](/extend/generic-extrator/config/mapping/#column-mapping).

## Children
The `children` configuration allows you to retrieve sub-resources of the processes API resource.
These **child jobs** (**nested jobs**) are executed for each object retrieved from the
parent response. The definition of child jobs is the same as the definition of parent jobs,
except for **placeholders**. The children configuration is described in a
[separate article](/extend/generic-extractor/config/jobs/children/).

## Scroller
The `scroller` parameter can be used to assign a predefined scroller in case
[`multiple` pagination](/extend/generic-extractor/api/pagination/multiple/) is used. If the
`multiple` pagination method is not used, the `scroller` parameter has no use. If `scroller` is not
set, the pagination method specified in the [`api` configuration](/extend/generic-extractor/api/pagination/)
is used. If no pagination method is specified in the `api` section, then the job uses no pagination.

## Examples

### Simple array
To extract data from the following API response:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "married": true
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "married": false
    }
]
{% endhighlight %}

do not set the `dataField` parameter at all, or set it to an empty string (`"dataField": ""`).
The following table will be extracted:

|id|name|married|
|--|---|---|
|123|John Doe|1|
|234|Jane Doe||

Notice that the [boolean value](/extend/generic-extractor/tutorial/json/#data-values) `married` is converted
to `1` when true and left empty otherwise (`false` and `null`).

See the [full example](todo:1-simple-job).

### Array within an object
To extract data from the following API response:

{% highlight json %}
{
    "users": [
        {
            "id": 123,
            "name": "John Doe"
        },
        {
            "id": 234,
            "name": "Jane Doe"
        }
    ]
}
{% endhighlight %}

do not set the `dataField` parameter at all, or set it to an empty string or to the value `users`.
(`"dataField": ""` or `"dataField": "users"`)
The following table will be extracted:

|id|name|
|--|----|
|123|John Doe|
|234|Jane Doe|

See the [full example](todo:2-array-in-object).

### Multiple arrays within an object
To extract data from the following API response:

{% highlight json %}
{
    "users": [
        {
            "id": 123,
            "name": "John Doe"
        },
        {
            "id": 234,
            "name": "Jane Doe"
        }
    ],
    "userTypes": [
        "member",
        "guest"
    ]
}
{% endhighlight %}

set the `dataField` parameter to the value `users` (`"dataField": "users"`). Not setting the
`dataField` parameter would result in an error
(`More than one array found in the response! Use the 'dataField' parameter to specify a key to the data array.`).
The following table will be extracted:

|id|name|
|--|----|
|123|John Doe|
|234|Jane Doe|

See the [full example](todo:3-multiple-arrays-in-object).

### Array within a nested object
To extract data from the following API response:

{% highlight json %}
{
    "members": {
        "active": [
            {
                "id": 123,
                "name": "John Doe"
            },
            {
                "id": 234,
                "name": "Jane Doe"
            }
        ],
        "inactive": [
            {
                "id": 345,
                "name": "Jimmy Doe"
            }
        ]
    }
}
{% endhighlight %}

set the `dataField` parameter to the value `members.active` (`"dataField": "members.active"`). Not setting the
`dataField` parameter would result in a warning (`No data array found in the response!`).
The following table will be extracted:

|id|name|
|--|----|
|123|John Doe|
|234|Jane Doe|

See the [full example](todo:4-array-in-nested-object).

### Two arrays within a nested object
To extract both `active` and `inactive` arrays from the above API response, you need to use two jobs:

{% highlight json %}
{
    "members": {
        "active": [
            {
                "id": 123,
                "name": "John Doe"
            },
            {
                "id": 234,
                "name": "Jane Doe"
            }
        ],
        "inactive": [
            {
                "id": 345,
                "name": "Jimmy Doe"
            }
        ]
    }
}
{% endhighlight %}

In the first job, set the `dataField` parameter to the value `members.active`. In the second job, set
the `dataField` parameter to the value `members.inactive`. The entire `jobs` section will look like this:

{% highlight json %}
    "jobs": [
        {
            "endpoint": "users-5",
            "dataField": "members.active"
        },
        {
            "endpoint": "users-5",
            "dataField": "members.inactive"
        }
    ]
{% endhighlight %}


The following table will be extracted:

|id|name|
|--|----|
|123|John Doe|
|234|Jane Doe|
|345|Jimmy Doe|

See the [full example](todo:5-two-arrays-in-nested-object).

### Simple object
You may encounter and API response like this:

{% highlight json %}
{
    "id": 123,
    "name": "John Doe"
}
{% endhighlight %}

You have to set the `dataField` parameter to value `.` (`"dataField": "."`). Not setting the
`dataField` parameter would result in a warning (`No data array found in the response!`) and no data extracted.
The following table will be extracted:

|id|name|
|--|----|
|123|John Doe|

See the [full example](todo:6-simple-object).

### Nested object
You may encounter and API response like this:

{% highlight json %}
{
    "user": {
        "id": 123,
        "name": "John Doe"
    }
}
{% endhighlight %}

You have to set the `dataField` parameter to the value `user` (`"dataField": "user"`). Not setting the
`dataField` parameter would result in a warning (`No data array found in the response!`) and no data extracted.
The following table will be extracted:

|id|name|
|--|----|
|123|John Doe|

See the [full example](todo:7-nested-object).

### Single object in an array
You may encounter an API response like this:

{% highlight json %}
{
    "member": {
        "history": [
            {
                "id": 123,
                "name": "John Doe",
                "version": 2
            },
            {
                "id": 123,
                "name": "Jonh Doe",
                "version": 1
            }
        ]
    }
}
{% endhighlight %}

To extract the first item from the `history` array, set the `dataField` parameter to the value `member.history.0`.
The following table will be extracted:

|id|name|version|
|--|----|-------|
|123|John Doe|2 |

See the [full example](todo:8-single-object-in-array).

### Nested array
You may encounter an API response like this:

{% highlight json %}
{
    "members": [
        {
            "type": "active",
            "items": [
                {
                    "id": 123,
                    "name": "John Doe"
                },
                {
                    "id": 234,
                    "name": "Jane Doe"
                }
            ]
        },
        {
            "type": "inactive",
            "items": [
                {
                    "id": 345,
                    "name": "Jimmy Doe"
                }
            ]
        }
    ]
}
{% endhighlight %}

To extract the `items` from the `members` array, set the `dataField` parameter to the value `members.0.items`.
The following table will be extracted:

|id|name|
|--|----|
|123|John Doe|
|234|Jane Doe|

See the [full example](todo:9-nested-array).

## Examples with Complicated Objects
The above examples show how simple objects are extracted from different objects. Generic
Extractor can also extract objects with non-scalar properties. The default
[JSON to CSV mapping](todo) flattens nested objects and produces secondary tables from nested arrays.

### Object with nested array
You may encounter an API response like this:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "tags": ["active", "admin"]
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "tags": ["active"]
        }
    ]
}
{% endhighlight %}

To extract the `members` array, set the `dataField` parameter to the value `members` or to an empty value.
The following tables will be extracted:

Users:

|id|name|tags|
|---|---|----|
|123|John Doe|users-10_3ca896f39b257a4f2d2f4784e7680c87|
|234|Jane Doe|users-10_a15f4be71e739e1b2ea32bd4209d756e|

Tags:

|data|JSON_parentId|
|----|-------------|
|active|users-10_3ca896f39b257a4f2d2f4784e7680c87|
|admin|users-10_3ca896f39b257a4f2d2f4784e7680c87|
|active|users-10_a15f4be71e739e1b2ea32bd4209d756e|

Each member contains a nested array of `tags` that cannot be serialized into a single
database (CSV) column. Therefore the [JSON-CSV mapper] creates another table for the
`tags` with tag values. It also generates a unique member identifier, puts it
in the `tags` column and uses it in a new `JSON_parentId` column. This
way, the 1:N relationship between Members and Tags is represented.

See the [full example](todo:10-object-wth-nested-array).

### Upgrading to array
You may encounter the following API response:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "tags": "active"
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "tags": ["active", "admin"]
        }
    ]
}
{% endhighlight %}

when you extract the `members` array (set the `dataField` parameter to the value `members` or to an empty value).
The following tables will be extracted:

Users:

|id|name|tags|
|---|---|----|
|123|John Doe|users-17_c6f3e32262682b6efd6c85ad97d2d503|
|234|Jane Doe|users-17_92df9d5b9af8821316172285b196318e|

Tags:

|data|JSON_parentId|
|----|-------------|
|active|users-17_c6f3e32262682b6efd6c85ad97d2d503|
|active|users-17_92df9d5b9af8821316172285b196318e|
|admin|users-17_92df9d5b9af8821316172285b196318e|

As you can see, the scalar value `tags` in the first member object was automatically upgraded to
a single-element array because the `tags` property is an array elsewhere (second member) in the response.

See the [full example](todo:17-upgrading-array).

### Object with nested object
You may encounter an API response like this:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "address": {
                "street": "Elm Street",
                "city": "New York"
            }
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "address": {
                "street": "Bates Street",
                "city": "Chicago",
                "state": "USA"
            }
        }
    ]
}
{% endhighlight %}

To extract the `members` array, set the `dataField` parameter to the value `members` or to an empty value.
The following table will be extracted:

|id|name|address\_street|address\_city|address_state|
|---|---|---|---|---|
|123|John Doe|Elm Street|New York||
|234|Jane Doe|Bates Street|Chicago|USA|

The properties of nested `address` objects are automatically flattened into the parent object. Therefore
the `address.city` property is flattened into the `address_city` column.

See the [full example](todo:11-object-with-nested-object).

### Object with a deeply nested object
The above two examples show the basic principles of the JSON-CSV mapping used by Generic Extractor.
They are applied to all child properties. So, when you encounter an API response like this:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "contacts": [
                {
                    "type": "address",
                    "properties": {
                        "street": "Elm Street",
                        "city": "New York"
                    }
                },
                {
                    "type": "email",
                    "primary": true,
                    "properties": {
                        "address": "john.doe@example.com"
                    }
                }
            ]
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "contacts": [
                {
                    "type": "address",
                    "primary": false,
                    "properties": {
                        "street": "Bates Street",
                        "city": "Chicago",
                        "state": "USA"
                    }
                },
                {
                    "type": "phone",
                    "primary": true,
                    "properties": {
                        "number": "123 456 789"
                    }
                }
            ]
        }
    ]
}
{% endhighlight %}

the following two tables will be extracted:

Users:

|id|name|contacts|
|---|---|---|
|123|John Doe|users-12_8505d6585e28c00d461ba64f085d1055|
|234|Jane Doe|users-12_ec8c48efecb10334072f03a860113ea2|

Contacts:

|type|properties\_street|properties\_city|properties\_address|properties\_state|properties\_number|primary|JSON_parentId|
|---|---|---|---|---|---|---|---|
|address|Elm Street|New York|||||users-12_8505d6585e28c00d461ba64f085d1055|
|email|||john.doe@example.com|||1|users-12_8505d6585e28c00d461ba64f085d1055|
|address|Bates Street|Chicago||USA|||users-12_ec8c48efecb10334072f03a860113ea2|
|phone|||||123 456 789|1|users-12_ec8c48efecb10334072f03a860113ea2|

The obtained table is rather sparse because the properties of the nested `contacts`
objects do not match exactly. For example, the `properties_number` column was created
as a result of flattening the `properties.number` object that is contained only once
in the response. Therefore the column has a single value.

The rows in the *Contacts* table are again linked through an
auto-generated key to the parent *Users* table. Also notice that the
[Boolean value](/extend/generic-extractor/tutorial/json/#data-values)
`primary` is converted to `1` when true and left empty otherwise.

See the [full example](todo:12-deeply-nested-object).

## Response Filter Examples

### Skip flattening
If you have an API response like this:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "tags": ["active", "admin"]
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "tags": ["active"]
        }
    ]
}
{% endhighlight %}

and extract the `members` array with the
[default settings](/extend/generic-extractor/config/jobs/#an-object-with-nested-object), two tables will be 
produced. If you set the response filter to `"responseFilter": "tags"`, then the `tags` property of the `members`
items will not be processed and will be stored as a [serialized](https://en.wikipedia.org/wiki/Serialization)
JSON string. The following table will be extracted:

|id|name|tags|
|---|---|---|
|123|John Doe|["active","admin"]|
|234|Jane Doe|["active"]|

The `tags` column contains serialized JSON fragments, which can be processed by
the JSON capable database (e.g., [Snowflake](https://docs.snowflake.net/manuals/sql-reference/functions-semistructured.html)).

See the [full example](todo:13-skip-flatten).

### Skip flattening in nested objects
If you have the following API response:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "contacts": [
                {
                    "type": "address",
                    "properties": {
                        "street": "Elm Street",
                        "city": "New York"
                    }
                },
                {
                    "type": "email",
                    "primary": true,
                    "properties": {
                        "address": "john.doe@example.com"
                    }
                }
            ]
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "contacts": [
                {
                    "type": "address",
                    "primary": false,
                    "properties": {
                        "street": "Bates Street",
                        "city": "Chicago",
                        "state": "USA"
                    }
                },
                {
                    "type": "phone",
                    "primary": true,
                    "properties": {
                        "number": "123 456 789"
                    }
                }
            ]
        }
    ]
}
{% endhighlight %}

and extract the `members` array with the
[default settings](/extend/generic-extractor/config/jobs/#an-object-with-a-deeply-nested-object), 
two tables will be produced and the `properties` object will be flattened into a sparse table.
To avoid that, set the response filter to `"responseFilter": "contacts[].properties"`. This will
leave the `properties` child of the `contacts` array of the `members` array unprocessed.
The following two tables will be produced:

Users:

|id|name|contacts|
|---|---|---|
|123|John Doe|users-12_0b9650e0f68b0c6738843d5b4ff0a961|
|234|Jane Doe|users-12_cf76fb6794380244946d2bc4fa3aa04a|

Contacts:

|type|properties|primary|JSON_parentId|
|---|---|---|---|
|address|{"street":"Elm Street","city":"New York"}||users-12_0b9650e0f68b0c6738843d5b4ff0a961|
|email|{"address":"john.doe@example.com"}|1|users-12_0b9650e0f68b0c6738843d5b4ff0a961|
|address|{"street":"Bates Street","city":"Chicago","state":"USA"}||users-12_cf76fb6794380244946d2bc4fa3aa04a|
|phone|{"number":"123 456 789"}|1|users-12_cf76fb6794380244946d2bc4fa3aa04a|

The `properties` column contains JSON serialized objects. When setting the `responseFilter` parameter,
remember to use the correct path to the properties you wish to skip from processing. That is to say that
setting `responseFilter` to

- `contacts` skips the entire `contacts` property and does not create the *Contacts:* table at all.
- `properties` does nothing because there is no `properties` property under the `members` array items.
- `contacts.properties` does nothing because there is no `properties` property under the `contacts` array.

The last two options might seem inconsistent. This is because the `responseFilter` path is set **relative to**
the objects of the processed array (not to the array itself, not to the JSON root). Thus the only correct
setting in this case is `contacts[].properties`.

See the [full example](todo:14-skip-flatten-nested).

### Skip Boolean conversion
TODO: tohle tak nefunguje! Bud se to musi vyhodit, nebo updatnout GE! TODO

If you have an API response like this:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "married": true
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "married": false
    }
]
{% endhighlight %}

and want to avoid the [default Boolean conversion], add the `married` property to
the response filter. Setting `"responseFilter": "married"` will cause Generic Extractor to
return the following table:

|id|name|married|
|---|---|---|
|123|John Doe|true|
|234|Jane Doe|false|

See the [full example](todo:15-skip-boolean).

### Inconsistent object
If you have an API response like this:

{% highlight json %}
[
    {
        "id": 123,
        "name": "foo",
        "color": "green"
    },
    {
        "id": 321,
        "name": "bar",
        "color": {
            "items": ["red", "blue"]
        }
    }
]
{% endhighlight %}

you will receive an error similar to `Error parsing response JSON: Unhandled type change from "scalar" to "object" in 'users-16.color'`. This means that the objects returned in the response are incompatible and cannot
be [merged into a table](#merging-responses) by Generic Extractor. To avoid the error and still retrieve the data,
use the `responseFilter` to skip the `color` property. When you set `"responseFilter": "color"`, you
will obtain the following table:

|id|name|color|
|---|---|---|
|123|foo|"green"|
|321|bar|{"items":["red","blue"]}|

See the [full example](todo:16-inconsistent-object).

### Multiple filters
You might have a complex API response like this:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "tags": {
                "items": ["active", "admin"]
            },
            "contacts": [
                {
                    "type": "address",
                    "properties": {
                        "street": "Elm Street",
                        "city": "New York"
                    }
                },
                {
                    "type": "email",
                    "primary": true,
                    "properties": "john.doe@example.com"
                }
            ]
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "tags": "none",
            "contacts": [
                {
                    "type": "address",
                    "primary": false,
                    "properties": {
                        "street": "Bates Street",
                        "city": "Chicago",
                        "state": "USA"
                    }
                },
                {
                    "type": "phone",
                    "primary": true,
                    "properties": "123 456 789"
                }
            ]
        }
    ]
}
{% endhighlight %}

Because both `tags` and `contacts.properties` properties are inconsistent (sometimes using an object,
sometimes using a scalar value), you have to define multiple response filters. This can be done by using
an array of paths:

{% highlight json %}
"responseFilter": [
    "contacts[].properties",
    "tags"
]
{% endhighlight %}

Then you will obtain the following tables:

Users:

|id|name|tags|contacts|
|---|---|---|---|
|123|John Doe|{"items":["active","admin"]}|users-18_19318ac6aa76a92c8d90e603f69e02f6|
|234|Jane Doe|"none"|users-18_3fdf6b12b11f85cb4eb9c34ce0322ecd|

Contacts:

|type|properties|primary|JSON_parentId|
|---|---|---|---|
|address|{"street":"Elm Street","city":"New York"}||users-18_19318ac6aa76a92c8d90e603f69e02f6|
|email|"john.doe@example.com"|1|users-18_19318ac6aa76a92c8d90e603f69e02f6|
|address|{"street":"Bates Street","city":"Chicago","state":"USA"}||users-18_3fdf6b12b11f85cb4eb9c34ce0322ecd|
|phone|"123 456 789"|1|users-18_3fdf6b12b11f85cb4eb9c34ce0322ecd|

See the [full example](todo:18-multiple-filters).

### Setting delimiter
The default delimiter used for referencing nested properties is a dot `.`. If the names of
properties in the API response contain dots, it might be necessary to change the default delimiter.
The API response might look like this:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "primary.address": {
                "street": "Elm Street",
                "city": "New York"
            },
            "secondary.address": {
                "street": "Cemetery Ridge",
                "city": "New York"
            }
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "primary.address": {
                "street": " Blossom Avenue",
                "state": "U.K."
            },
            "secondary.address": {
                "street": "1313 Webfoot Walk",
                "city": "Duckburg",
                "state": "Calisota"
            }
        }
    ]
}
{% endhighlight %}

If you want to filter the `secondary.address` field, you cannot set the `responseFilter` setting to
`secondary.address` because it would be interpreted as an `address` property of the `secondary` property.
If you set `"responseFilter": "secondary.address`, the extraction will work as if you did not set the
filter at all (because it will be filtering the non-existent `address` property).

For the filter to work correctly, set the `responseFilterDelimiter` to an arbitrary character not
used in the response property names. The following would be a valid configuration:

{% highlight json %}
{
    ...
    "responseFilter": "secondary.address",
    "responseFilterDelimiter": "#"
}
{% endhighlight %}

It might by tempting to change the response filter to `secondary#address`. However, this would be
incorrect as it would again mean that we are referring to an `address` property nested in the `secondary`
object. With the above settings you will obtain a table like this:

|id|name|primary\_address\_street|primary\_address\_city|primary\_address\_state|secondary\_address|
|---|---|---|---|---|---|
|123|John Doe|Elm Street|New York||{"street":"Cemetery Ridge","city":"New York"}|
|234|Jane Doe|Blossom Avenue||U.K.|{"street":"1313 Webfoot Walk","city":"Duckburg","state":"Calisota"}|

See the [full example](todo:19-different-delimiter).

### Setting delimiter --- more complex
For the custom set delimiter in the response filter, you need to have a complex API response. For example:

{% highlight json %}
{
    "members": [
        {
            "id": 123,
            "name": "John Doe",
            "primary.address": {
                "street": "Elm Street",
                "city": "New York",
                "tags": []
            },
            "secondary.address": {
                "street": "Cemetery Ridge",
                "city": "New York",
                "tags": ["work", "usaddress"]
            }
        },
        {
            "id": 234,
            "name": "Jane Doe",
            "primary.address": {
                "street": " Blossom Avenue",
                "state": "U.K.",
                "tags": ["home"]
            },
            "secondary.address": {
                "street": "1313 Webfoot Walk",
                "city": "Duckburg",
                "state": "Calisota"
            }
        }
    ]
}
{% endhighlight %}

To filter out all the `tags` properties, you need to set the following:

{% highlight json %}
{
    "responseFilter": [
        "secondary.address#tags",
        "primary.address#tags"
    ],
    "responseFilterDelimiter": "#"
}
{% endhighlight %}

You will obtain a table similar to the one below:

|id|name|primary\_address\_street|primary\_address\_city|primary\_address\_tags|primary\_address\_state|secondary\_address\_street|secondary\_address\_city|secondary\_address\_tags|secondary\_address\_state|
|123|John Doe|Elm Street|New York|||Cemetery Ridge|New York|["work","usaddress"]||
|234|Jane Doe|Blossom Avenue||["home"]|U.K.|1313 Webfoot Walk|Duckburg||Calisota|

See the [full example](todo:20-setting-delimiter-complex).

## Examples with HTTP Methods and Parameters

### Request parameters
Assume that you have an API with the endpoint `users` which requires the
[GET parameter](/extend/generic-extractor/tutorial/rest/#url) `type` to specify which
users are to be retrieved. For example, a request to `/users?type=active` returns a response
with active users:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "married": true
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "married": false
    }
]
{% endhighlight %}

To retrieve inactive users, send a request to `/users?type=inactive`. This
can be solved using the following jobs configuration:

{% highlight json %}
"jobs": [
    {
        "endpoint": "users",
        "params": {
            "type": "active"
        }
    },
    {
        "endpoint": "users",
        "params": {
            "type": "inactive"
        }
    }
]
{% endhighlight %}

The [`params` configuration](/extend/generic-extractor/config/jobs/#request-parameters) option specifies the 
parameters to be sent to the API. Therefore the `type` property is the name defined by the API itself.
The above configuration produces the following table:

|id|name|married|
|---|---|---|
|123|John Doe|1|
|234|Jane Doe||
|345|Jimmy Doe||

See the [full example](todo:033-job-parameters).

### POST request
You may encounter an API which is not exactly [RESTful](/extend/generic-extractor/tutorial/rest/)
and has to be queried using the [HTTP POST method](/extend/generic-extractor/tutorial/rest/#method).
Assume that you have an API with the endpoint `getUsers` that expects an empty HTTP POST request. The endpoint
then returns the following response:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "married": true
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "married": false
    }
]
{% endhighlight %}

Generic Extractor can handle this too, using the [`method` configuration](/extend/generic-extractor/config/jobs/#method):

{% highlight json %}
"jobs": [
    {
        "endpoint": "getUsers",
        "method": "POST"
    }
]
{% endhighlight %}

The above configuration produces the following table:

|id|name|married|
|---|---|---|
|123|John Doe|1|
|234|Jane Doe||

See the [full example](todo:034-post-request).

### Complex POST request
A not-exactly-[RESTful](/extend/generic-extractor/tutorial/rest/) API (see above) may require some JSON
parameters in the request. Let's say you have the `getUsers` endpoint which requires an HTTP POST request with
the following body:

{% highlight json %}
{
    "filter": {
        "type": "active"
    },
    "return": {
        "fields": ["id", "name"]
    }
}
{% endhighlight %}

The request returns the following JSON:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe"
    },
    {
        "id": 234,
        "name": "Jane Doe"
    }
]
{% endhighlight %}

The above situation can be handled by passing the entire request JSON to the
[`params` configuration](/extend/generic-extractor/config/jobs/#request-parameters).

{% highlight json %}
"jobs": [
    {
        "endpoint": "getUsers",
        "method": "POST",
        "params": {
            "filter": {
                "type": "active"
            },
            "return": {
                "fields": ["id", "name"]
            }
        }
    }
]
{% endhighlight %}

The above configuration produces the following table:

|id|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

See the [full example](todo:035-complex-post).

### Complex GET request
Sometimes even the HTTP GET requests require complex parameters. Suppose the API
endpoint `/users` requires the `filter` and `return` definitions. The API may describe
the configuration in many different ways, e.g.:

|filter|name|example value|
|---|---|---|
|Name of property for filtering|field|type|
|Filtering operator|operator|equal|
|Value to use in filter|value|active|

|return|name|example value|
|---|---|---|
|Names of properties to return in response|fields|id,name|

In the HTTP protocol, this would be encoded in the following [query string](/extend/generic-extractor/tutorial/rest/#url)

    filter[field]=type&filter[operator]=equal&filter[value]=active&return[fields][0]=id&return[fields][1]=name

or, in the [URL Encoded](https://www.w3schools.com/tags/ref_urlencode.asp) form:

    filter%5Bfield%5D%3Dtype%26filter%5Boperator%5D%3Dequal%26filter%5Bvalue%5D%3Dactive%26return%5Bfields%5D%5B0%5D%3Did%26return%5Bfields%5D%5B1%5D%3Dname

The following JSON is returned:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe"
    },
    {
        "id": 234,
        "name": "Jane Doe"
    }
]
{% endhighlight %}

The above situation can be handled by encoding the parameters in a JSON into the
[`params` configuration](/extend/generic-extractor/config/jobs/#request-parameters).

{% highlight json %}
"jobs": [
    {
        "endpoint": "getUsers",
        "method": "POST",
        "params": {
            "filter": {
                "field": "type",
                "operator": "equal",
                "value": "active"
            },
            "return": {
                "fields": ["id", "name"]
            }
        }
    }
]
{% endhighlight %}

The above configuration produces the following table:

|id|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

See the [full example](todo:036-complex-get).
