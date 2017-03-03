---
title: Generic Extractor Recursive Jobs (under construction)
permalink: /extend/generic-extractor/recursion/
---

Jobs also allow you to set their children and filters to go through its result and for each one of the results create a "child" job using some attributes from the result.

For example, if you download a list of users, you can then download a list of orders for each user, and then details/items from each order etc..

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

