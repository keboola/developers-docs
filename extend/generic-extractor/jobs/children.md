---
title: Child Jobs
permalink: /extend/generic-extractor/jobs/children/
---

* TOC
{:toc}

Child jobs allows you to iterate/traverse over sub-resources of an API resource. For example if you download a
list of users, you can download details of each user or a list of orders for each users. You can see basic example
of using child jobs in the [corresponding part of the tutorial](/extend/generic-extractor/tutorial/jobs/#child-jobs).
Child jobs may contain other child jobs, so you may query for sub-sub-resources in a virtually unlimited depth.
The configuration of a child job is the same a configuration of [any job](/extend/generic-extractor/jobs) with two 
additional fields `placeholders` and `recursionFilter`.

## Placeholders
In a child job, the `endpoint` configuration must contain a **placeholder**. The placeholder is 
enclosed in curly braces `{}`. For example an endpoint:

{% highlight json %}
{
    ...,
    "endpoint": "user/{user-id}"
}
{% endhighlight %}

defines a placeholder **user-id**. The **placeholder name** is rather arbitrary (it should not contain any 
special characters though). To assign it a value, you have 
to use the `placeholders` configuration. The `placeholders` configuration is an object whose properties
are placeholder names. The value of each `placeholders` object property is a **property path** in the 
parent job response. The placeholder in the child `endpoint` will be replaced by the **value** of that
parent property. The property path is configured relative to the extracted 
object ([see example](#accessing-deeply-nested-id)). The child `endpoint` is 
configured relative to the [`api.baseUrl` configuration](todo),
not relative to the parent endpoint.

The following configuration:

{% highlight json %}
{
    ...,
    "endpoint": "user/{user-id}",
    "placeholders": {
        "user-id": "userId"
    }
}
{% endhighlight %}

means that Generic extractor will send as many requests to `/user/XXX` endpoint as there
are result objects in the parent API response. The `XXX` will be replaced by `userId` value
of each individual response.

### Placeholder Level
Optionally, the placeholder name may be prefixed by nesting **level**. Nesting allows you to 
refer to properties in other objects then the direct parent. Level is written as the
placeholder name prefix, delimited by colon `:` -- i.e `2:user-id`. 

The default level is 1 -- i.e. placeholder `user-id` is equivalent to `1:user-id` and 
means that the property path will be searched in direct parent of the child job. Level
is counted from the child 'upwards'. Therefore a placeholder `2:user-id` means that 
the property path will be searched in parent of the child parent ('two levels up`).
See the [corresponding examples](todo).

## Filter
The configuration option `recursionFilter` allows you to skip some child jobs from processing. This can be
useful in cases when:
- some resources are not accessible to you and querying them would cause an error in the extraction,
- some resources return inconsistent or incomplete responses,
- you are not interested in some resources and you want to speed up the extraction.

The `responseFilter` configuration contains a string expression with filter condition composed of:

- a name of a property from parent response, 
- a comparison operator -- `<`, `>`, `<=`, `>=`, `==` (equal), `!=` (not equal), `~~` (like), `!~` (unlike)
- a value to compare
- optionally logical operators `|` (or), `&` (and) may be used to join multiple conditions

An example response filter may be `type!=employee` or `product.value>150`. *Important:* The expression is 
whitespace sensitive, therefore `type != employee` will filter properties `type ` to not contain 
a value ` employee` (which is probably not what you intended to do). String comparisons are always **case sensitive**.

## Examples

### Basic Example
Let's say that you have an API with two endpoints:

- `/users/` -- returns a list of users,
- `/user/?` -- returns user details with given user ID.

The `users` API returns a response like this:

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

The `user/123` response returns a response like this:

{% highlight json %}
{
    "id": 123,
    "name": "John Doe",
    "address": {
        "city": "London",
        "country": "UK",
        "street": "Whitehaven Mansions"
    }
}
{% endhighlight %}

Now you can use the following configuration which will retrieve the user list and user 
details for each user.

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://mock-server:80/021-basic-child-job/"
        },
        "config": {
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "children": [
                        {
                            "endpoint": "user/{user-id}",
                            "dataField": ".",
                            "placeholders": {
                                "user-id": "id"
                            }
                        }
                    ]
                }
            ]
        }
    }
}
{% endhighlight %}

The `jobs` section defines a single job for `users` resource. This job has child jobs for 
the `users/{user-id}` resource. The `user-id` placeholder in the endpoint URL will be 
replaced by the value of `id` property of each user in the parent job response. This means that 
Generic extractor will make three API calls:

- `users`
- `users/123`
- `users/234`

The [`dataField`](/extend/generic-extractor/jobs/TODO) is set to dot to retrieve the 
entire response as a single object. Running the Generic Extractor will produce the following tables:

users:

|id|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

user__user-id:

|id|name|address\_city|address\_country|address\_street|parent\_id|
|---|---|---|---|---|---|
|123|John Doe|London|UK|Whitehaven Mansions|123|
|234|Jane Doe|St Mary Mead|UK|High Street|234|

Notice that the table representing child resources contains all the responses 
merged into a single table. The [usual merging rules](/extend/generic-extractor/jobs/TODO) apply.
Also notice that a new column `parent_id` was added which contains the **placeholder value** used 
to retrieve the resource. The `parent_id` column is not always named `parent_id`.
It's name is created by joining a `parent_` prefix to the **placeholder path**.

Also notice that the table name is rather
ugly because it was generated automatically. It is therefore advisable to 
use the [dataType](/extend/generic-extractor/jobs/TODO) property to define a friendly name for the 
table (see the next example).

See [full example](todo:021-basic-child-job)

### Basic Job With Data Type
To avoid automatic table names, it is advisable to always use the `dataType` property for
child jobs:

{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "dataType": "user-detail",
                    "placeholders": {
                        "user-id": "id"
                    }
                }
            ]
        }
    ]
}

In the above configuration, the `dataType` is set to `user-detail`, hence you will obtain the 
following tables:

users:

|id|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

user-detail:

|id|name|address\_city|address\_country|address\_street|parent\_id|
|---|---|---|---|---|---|
|123|John Doe|London|UK|Whitehaven Mansions|123|
|234|Jane Doe|St Mary Mead|UK|High Street|234|

See [full example](todo:022-basic-child-job-datatype)

### Accessing Nested ID
If the placeholder value is nested within the response object, you can use
dot notation to access child properties of the response object. E.g. if the 
parent response with list of users returns a response similar to this:

{% highlight json %}
[
    {
        "name": "John Doe",
        "user-info": {
            "id": 123,
            "active": true
        }
    },
    {
        "name": "Jane Doe",
        "user-info": {
            "id": 234,
            "active": false
        }
    }
]
{% endhighlight %}

You have to modify the `placeholders` definition:

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "dataType": "user-detail",
                    "placeholders": {
                        "user-id": "user-info.id"
                    }
                }
            ]
        }
    ]
}
{% endhighlight %}

Setting the placeholder to `"user-id": "user-info.id"` means that the `user-id` placeholder 
will be replaced by the value of `id` property inside the `user-info` object in the parent response.
If you fail to set a correct path for the placeholder, you will receive an error:

    No value found for user-id in parent result. (level: 1)

When you set the correct path, you will receive the following tables:

users:

|name|user-info\_id|user-info\_active|
|---|---|---|
|John Doe|123|1|
|Jane Doe|234||

user detail:

|id|name|address\_city|address\_country|address\_street|parent\_user-info\_id|
|---|---|---|---|---|---|
|123|John Doe|London|UK|Whitehaven Mansions|123|
|234|Jane Doe|St Mary Mead|UK|High Street|234|

Notice that the parent reference column name is concatenation of `parent` prefix and 
`user-info_id` placeholder path (with special characters replaced by the underscore `_`).

See [full example](todo:023-child-job-nested-id)

### Accessing Deeply Nested Id
The placeholder path is configured **relative to** the extracted object. Assume that the 
parent endpoint returns a complicated response like this:

{% highlight json %}
{    
    "active-users": {
        "items": [
            {
                "name": "John Doe",
                "user-info": {
                    "id": 123,
                    "active": true
                }
            },
            {
                "name": "Jane Doe",
                "user-info": {
                    "id": 234,
                    "active": true
                }
            }
        ],
        "description": "Active Users"
    },
    "inactive-users": {
        "items": [
            {
                "name": "Jimmy Doe",
                "user-info": {
                    "id": 345,
                    "active": false
                }
            }
        ],
        "description": "Inactive Users"
    }
}
{% endhighlight %}

The following job definition extracts `active-users` array together with details for each user.

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "dataField": "active-users.items",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "dataType": "user-detail",
                    "placeholders": {
                        "user-id": "user-info.id"
                    }
                }
            ]
        }
    ]
}
{% endhighlight %}

Notice that the placeholder path remains set `user-info.id` to because it is relative to 
the parent object which itself is located at path `active-users.items`. This 
may be confusing because the endpoint property in that child job is set relative to the
`api.baseUrl` and not to the parent URL.

Placeholders must be used in child jobs so that each child job sends a different API request. 
The placeholder
`placeholders`

Note: it is technically possible to define a child job without using `placeholders` configuration 
or without having a placeholder in the `endpoint`. But then all the child requests are same which is 
usually not what you intend to do.

See [full example](todo:024-child-job-deeply-nested-id)

### Naming Conflict
Because a new column is added to the table representing child properties, it is possible that you 
run into a naming conflict. I.e. if the child response with user details looks like this:

{% highlight json %}
{
    "id": 123,
    "name": "John Doe",
    "parent_id": "admins",
    "address": {
        "city": "London",
        "country": "UK",
        "street": "Whitehaven Mansions"
    }
}
{% endhighlight %}

And you use the following job configuration:

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "placeholders": {
                        "user-id": "id"
                    }
                }
            ]
        }
    ]
}
{% endhighlight %}

The output for the child job will contain column `parent_id` and at the same time, Generic Extractor will attempt
to create a column `parent_id` with the placeholder value. The outcome is that Generic Extractor 
overwrites the original column and that column is lost.

See [full example](todo:025-naming-conflict)

### Nesting Level
By default, the placeholder value is taken from the object retrieved in the parent job. As long as the child
jobs are nested only one level deep, there is no other option anyway. Let's see what happens with a deeper nesting.
Let's say that you have an API with two endpoints:

- `/users/` -- returns a list of users,
- `/user/?` -- returns user details with given user ID,
- `/user/?/orders` -- returns a list of user orders,
- `/user/?/orders/?` -- returns order detail with given user and order ID.

The `users` API returns a response like this:

{% highlight json %}
[
    {
        "userId": 123,
        "name": "John Doe"
    },
    {
        "userId": 234,
        "name": "Jane Doe"
    }
]
{% endhighlight %}

The `user/123` response returns a response like this:

{% highlight json %}
{
    "userId": 123,
    "name": "John Doe",
    "description": "Good ol' father John"
}
{% endhighlight %}

The `user/123/orders` response returns a response like this:

{% highlight json %}
[
    {
        "orderId": "1234",
        "price": "$12"
    },
    {
        "orderId": "1345",
        "price": "$1212"
    }
]
{% endhighlight %}

The `user/123/order/1234` response returns a response like this:

{% highlight json %}
{
    "orderId": 1234,
    "price": "$12",
    "timestamp": "2017-05-06 8:21:45",
    "state": "cancelled"
}
{% endhighlight %}

Then you can create a job configuration with three nested children to retrieve all the API resources:

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{1:user-id}",
                    "dataField": ".",
                    "dataType": "user-detail",
                    "placeholders": {
                        "1:user-id": "userId"
                    },
                    "children": [
                        {
                            "endpoint": "user/{2:user-id}/orders",
                            "dataType": "orders",
                            "placeholders": {
                                "2:user-id": "userId"
                            },
                            "children": [
                                {
                                    "endpoint": "user/{3:user-id}/order/{1:order-id}",
                                    "dataType": "order-detail",
                                    "dataField": ".",
                                    "placeholders": {
                                        "3:user-id": "userId",
                                        "1:order-id": "orderId"
                                    }                                            
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
{% endhighlight %}

The `jobs` configuration retrieves all users from the `users` API endpoint. The first child retrieves
details for each user (from `user/?` endpoint) and stores them in the `user-detail` table. The second 
child retrieves each user orders (from `user/?/orders` endpoint) and stores them in the `orders` table.
Finally the deepest nested child returns details of each order (for each user) from the 
`user/?/order/?` endpoint and stores them in the `order-detail` table. Therefore the following four tables
will be produced:

users:
|userId|name|
|---|---|
|123|John Doe|
|234|Jane Doe|

user-detail:
|userId|name|description|parent\_userId|
|---|---|---|---|
|123|John Doe|Good ol' father John|123|
|234|Jane Doe|Good young mommy Jenny|234|

orders:
|orderId|price|parent\_userId|
|---|---|---|
|1234|$12|123|
|1345|$1212|123|
|2345|$42|234|

order-detail:
|orderId|price|timestamp|state|parent\_userId|parent\_orderId|
|---|---|---|---|---|---|
|1234|$12|2017-05-06 8:21:45|cancelled|123|1234|
|1345|$1212|2017-12-24 12:30:53|delivered|123|1345|
|2345|$42|2017-01-12 2:12:43|cancelled|234|2345|

Notice that each table contains additional columns with the placeholder property path prefixed with `parent_`.

See [full example](todo:026-basic-deeper-nesting)

### Nesting Level Alternative

Because the required user and order IDs are present in multiple requests (in the list and in the detail), there
are multiple ways how the jobs may be configured. For example the following configuration produces the 
exact same result as the above configuration:

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "dataType": "user-detail",
                    "placeholders": {
                        "user-id": "userId"
                    },
                    "children": [
                        {
                            "endpoint": "user/{user-id}/orders",
                            "dataType": "orders",
                            "children": [
                                {
                                    "endpoint": "user/{user-id}/order/{order-id}",
                                    "dataType": "order-detail",
                                    "dataField": ".",
                                    "placeholders": {
                                        "order-id": "orderId"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
{% endhighlight %}

The above configuration is less explicit and not really recommended, but still acceptable. 
Placeholders are defined globally, which means that
the second nested child job to `user/{user-id}/orders` does not define any, because it relies on those 
defined by its parent job (which happen to be correct). Also the deepest child defines only `order-id` placeholder,
because again the `user-id` placeholder was defined in some of its parents. Even though the
placeholders are defined globally, the placeholders defined in child jobs override the placeholders in the
parent jobs. E.g. in this (probably **very incorrect** configuration) the `1:user-id` placeholder in the 
deepest child will really contain `orderId` value.

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{1:user-id}",
                    "dataField": ".",
                    "dataType": "user-detail",
                    "placeholders": {
                        "1:user-id": "userId"
                    },
                    "children": [
                        {
                            "endpoint": "user/{2:user-id}/orders",
                            "dataType": "orders",
                            "placeholders": {
                                "2:user-id": "userId"
                            },
                            "children": [
                                {
                                    "endpoint": "user/{1:user-id}/order/{2:order-id}",
                                    "dataType": "order-detail",
                                    "dataField": ".",
                                    "placeholders": {
                                        "1:user-id": "orderId",
                                        "2:order-id": "userId"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
{% endhighlight %}

See [full example](todo:027-basic-deeper-nesting-alternative)

### Deep Job Nesting
Let's see how you can retrieve more nested API resource:

{% highlight json %}
{
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{1:user-id}",
                    "dataField": ".",
                    "dataType": "user-detail",
                    "placeholders": {
                        "1:user-id": "id"
                    },
                    "children": [
                        {
                            "endpoint": "user/{2:user-id}/orders",
                            "dataType": "orders",
                            "placeholders": {
                                "2-user-id": "id"
                            },
                            "children": [
                                {
                                    "endpoint": "user/{3:user-id}/order/{1:order-id}",
                                    "dataType": "order-detail",
                                    "dataField": ".",
                                    "placeholders": {
                                        "3:user-id": "id",
                                        "1:order-id": "id"
                                    },
                                    "children": [
                                        {
                                            "endpoint": "user/{4:user-id}/order/{2:order-id}/items",
                                            "dataType": "order-items",
                                            "placeholders": {
                                                "4:user-id": "id",
                                                "2:order-id": "id"
                                            },
                                            "children": [
                                                {
                                                    "endpoint": "user/{5:user-id}/order/{3:order-id}/item/{1:item-id}",
                                                    "dataType": "item-detail",
                                                    "dataField": ".",
                                                    "placeholders": {
                                                        "5:user-id": "id",
                                                        "3:order-id": "id",
                                                        "1:item-id": "id"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
{% endhighlight %}

The above configuration assumes that all API resources simply have an `id` property (unlike in
previous example where users had `userId` and orders had `orderId`). This makes the configuration look 
rather cryptic. You have to read the deepest child placeholder configuration:

    "5:user-id": "id",
    "3:order-id": "id",
    "1:item-id": "id"

as:

- go five levels up, pick the `id` property from the response and put it in place of the `user-id` in the endpoint URL
- go three levels up, pick the `id` property from the response and put it in place of the `order-id` in the endpoint URL
- go one level up, pick the `id` property from the response and put it in place of the `item-id` in the endpoint URL

Important: Once you run into using placeholders with same property path, their order becomes important. 
This is because the property path is used as a name of an additional column in the extracted table. Because 
the property path is `id` in all cases, it will lead to column `parent_id` in all cases and therefore it 
will get overwritten. With the above configuration, the following `item-detail` table will be produced.

|id|code|name|parent_id|
|---|---|---|---|
|345|PA10|Pick Axe|345|
|456|TB20|Tooth Brush|456|

Where the `parent_id` column refers to the `1:item-id` placeholder. If you would use a placeholder configuration

{% highlight json %}
{
    ...,
    "placeholders": {
        "1:item-id": "id",
        "3:order-id": "id",
        "5:user-id": "id"
    }
}
{% endhighlight %}

You would obtain an `item-detail` table:

|id|code|name|parent_id|
|---|---|---|---|
|345|PA10|Pick Axe|123|
|456|TB20|Tooth Brush|123|

Where the `parent_id` column refers the `5:user-id` placeholder.

See [full example](todo:028-advanced-deep-nesting)

### Simple Filter
Let's assume that you have an API which has two resources: 

- `users` -- returning a list of users
- `users/?` -- returning a user detail

The `users` API returns a response like this:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "role": "parent",
        "type": "admin"
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "role": "parent",
        "type": "administrator"
    },
    {
    	"id": 345,
    	"name": "Jimmy Doe",
    	"role": "child",
    	"type": "user"
    },
    {
    	"id": 456,
    	"name": "Janet Doe",
    	"role": "child",
    	"type": "user"
    }
]
{% endhighlight %}

The `user/123` API endpoint returns a response like this:

{% highlight json %}
{
    "id": 123,
    "name": "John Doe",
    "userRole": "parent",
    "userType": "admin",
    "description": "Father John"
}
{% endhighlight %}

A simple child filter can be then set up using the following `jobs` configuration:

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "dataType": "user-deail",
                    "placeholders": {
                        "user-id": "id"
                    },
                    "recursionFilter": "role==parent"
                }
            ]
        }
    ]
}
{% endhighlight %}

The `recursionFilter` setting will cause Generic Extractor to query only the sub-resources for which the 
filter evaluates to true. The filter property name `type` refers to the parent response, but it 
does filter only the children. I.e the following tables will be returned:

users:
|id|name|role|type|
|---|---|---|---|
|123|John Doe|parent|admin|
|234|Jane Doe|parent|administrator|
|345|Jimmy Doe|child|user|
|456|Janet Doe|child|user|

user-detail:
|id|name|userRole|userType|description|parent\_id|
|---|---|---|---|---|---|
|123|John Doe|parent|admin|Father John|123|
|234|Jane Doe|parent|administrator|Mother Jane|234|

You can see from the above tables that the filter is applied to the child results only so that
the details for only the wanted users are retrieved.

### Not Like Filter
Apart from the standard comparison operators, the recursive filter allows to use 
a **like** comparison operator `~`. It expects that the value contains a placeholder `%` 
which matches any number of characters. The following configuration:

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "recursionFilter": "type!~%min%",
                    "dataType": "user-detail",
                    "placeholders": {
                        "user-id": "id"
                    }
                }
            ]
        }
    ]
}
{% endhighlight %}

filters out all child resources not containing the string `min` in their parent type property.
The expression `%min%` matches any string which contains any number of characters (including none)
before and after the string `min`. The operator `!~` is negative like, therefore the 
following `user-detail` table will be extracted:

|id|name|userRole|userType|description|parent\_id|
|---|---|---|---|---|---|
|345|Jimmy Doe|child|user|Sonny Jimmy|345|
|456|Janet Doe|child|user|Missy Jennie|456|

### Combining Filters
Multiple filters can be combined using the 
[logical](https://en.wikipedia.org/wiki/Boolean_algebra#Basic_operations) `&` (and) and `|` (or) operators.
For example the following configuration retrieves details for user which have 
both `id < 400` and `role = child`. 

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "dataType": "user-detail",
                    "recursionFilter": "id<400&role==child",
                    "placeholders": {
                        "user-id": "id"
                    }
                }
            ]
        }
    ]
}
{% endhighlight %}

The following `user-detail` will be produced:

|id|name|userRole|userType|description|parent\_id|
|---|---|---|---|---|---|
|345|Jimmy Doe|child|user|Sonny Jimmy|345|

### Multiple Filter Combinations
Although you can join multiple filter expression with logical operators as in the 
above example, there is no support for parentheses. The following configuration
combines multiple filters:

{% highlight json %}
{
    ...,
    "jobs": [
        {
            "endpoint": "users",
            "recursionFilter": "role=parent|id>300&id<400",
            "children": [
                {
                    "endpoint": "user/{user-id}",
                    "dataField": ".",
                    "placeholders": {
                        "user-id": "id"
                    }
                }
            ]
        }
    ]
}
{% endhighlight %}

The precedence of logical operators is defined so that the first operator occurring in the 
expression takes precedence over the second. I.e. the condition `role=parent|id>300&id<400` 
is interpreted as `role=parent|(id>300&id<400)` because the operator `|` takes precedence 
over the `&` operator. The condition `id>300&id<400|role==parent` is interpreted as
`id>300&(id<400|role==parent)` because the `&` operator takes precedence over the `|` operator.

With the above configuration, the following `user-detail` table will be produced:

|id|name|userRole|userType|description|parent\_id|
|---|---|---|---|---|---|
|123|John Doe|parent|admin|Father John|123|
|234|Jane Doe|parent|administrator|Mother Jane|234|
|345|Jimmy Doe|child|user|Sonny Jimmy|345|

Because the described system of operator precedence may lead to rather unusual behavior, 
we recommend that you keep the recursive filter simple.
