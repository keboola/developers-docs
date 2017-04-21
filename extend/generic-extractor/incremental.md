## Example

{% highlight json %}
{
    "config": {
        "jobs": [
            {
                "endpoint": "users",
                "params": {
                    "type": "customer",
                    "last_seen_after": {
                        "time": "previousStart"
                    }
                }
            }
        ]
    }
}
{% endhighlight %}

This config would create a request such as the following:

`GET users?type=customer&last_seen_after=1467845525`

..where the timestamp would be the time of last execution of the extractor configuration.

a jeste pres PK


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
