---
title: Child Jobs
permalink: /extend/generic-extractor/jobs/children/
---

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

### Examples

#### Basic Example
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
{% endhighlight}

The output for the child job will contain column `parent_id` and at the same time, Generic Extractor will attempt
to create a column `parent_id` with the placeholder value. The outcome is that Generic Extractor 
overwrites the original column and that column is lost.




Jobs also allow you to set their children and filters to go through its result and for each one of the results create a "child" job using some attributes from the result.

## Job configuration

This extends the basic functionality of a [job](/extend/generic-extractor/jobs/)

- **children**: Array of child jobs that use the jobs' results to iterate
    - The endpoint must use a placeholder enclosed in `{}`
    - The placeholder can be prefixed by a number, that refers to higher level of nesting. By default, data from direct parent are used. The direct parent can be referred as `{id}` or `{1:id}`. A "grandparent" result would then be `{2:id}` etc.
    - Results in the child table will contain column(s) containing parent data used in the placeholder(s), prefixed by **parent_**. For example, if your placeholder is `{ticket_id}`, a column **parent_ticket_id** containing the value of current iteration will be appended to each row.

    - **placeholders** array must define each placeholder. It must be a set of `key: value` pairs, where **key** is the placeholder (eg `"1:id"`) and the value is a path within the response object - if nested, use `.` as a separator.
        - Example job config:

                {
                    "endpoint": "tickets.json",
                    "children": [
                        {
                            "endpoint": "tickets/{id}/comments.json",
                            "placeholders": {
                                "id": "id"
                            },
                            "children": [
                                {
                                    "endpoint": "tickets/{2:ticket_id}/comments/{comment_id}/details.json",
                                    "placeholders": {
                                        "comment_id": "id",
                                        "2:ticket_id": "id"
                                    }
                                }
                            ]
                        }
                    ]
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

    - **recursionFilter**:
        - Can contain a value consisting of a name of a field from the parent's response, logical operator and a value to compare against. Supported operators are "**==**", "**<**", "**>**", "**<=**", "**>=**", "**!=**"
        - Example: `type!=employee` or `product.value>150`
        - The filter is whitespace sensitive, therefore `value == 100` will look into `value␣` for a `␣100` value, instead of `value` and `100` as likely desired.
        - Further documentation can be found at [keboola/php-filter](https://github.com/keboola/php-filter)

