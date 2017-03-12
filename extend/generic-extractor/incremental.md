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
