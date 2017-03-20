---
title: Generic Extractor Parameter Map
permalink: /extend/generic-extractor/map/
---

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "https://example.com/3.0/",
            "authentication": {
                "type": "basic"
            },
            "pagination": {
                "method": "offset",
                "offsetParam": "offset",
                "limitParam": "count",
                "limit": 10
            }
        },
        "config": {
            "debug": true,
            "username": "dummy",
            "#password": "secret",
            "outputBucket": "ge-tutorial",
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
            ],
            "mappings": {
                "content": {
                    "parent_id": {
                        "type": "user",
                        "mapping": {
                            "destination": "campaign_id",
                            "primaryKey": true
                        }
                    },
                    "plain_text": {
                        "mapping": {
                            "destination": "text"
                        }
                    },
                    "html": {
                        "mapping": {
                            "destination": "html"
                        }
                    }
                }
            }
        }
    }
}
{% endhighlight %}

<script>
document.addEventListener('DOMContentLoaded', function() {
    $("span.nt:contains('\"endpoint\"')").wrap("<a href='/extend/generic-extractor/jobs/#endpoint'></a>");
    $("span.nt:contains('\"params\"')").last().wrap("<a href='/extend/generic-extractor/jobs/#request-parameters'></a>");    
    $("span.nt:contains('\"method\"')").last().wrap("<a href='/extend/generic-extractor/jobs/#method'></a>");
    $("span.nt:contains('\"dataField\"')").wrap("<a href='/extend/generic-extractor/jobs/#data-field'></a>");
    $("span.nt:contains('\"dataType\"')").wrap("<a href='/extend/generic-extractor/jobs/#data-type'></a>");
    $("span.nt:contains('\"responseFilter\"')").wrap("<a href='/extend/generic-extractor/jobs/#response-filter'></a>");
    $("span.nt:contains('\"responseFilterDelimiter\"')").wrap("<a href='/extend/generic-extractor/jobs/#response-filter'></a>");
    $("span.nt:contains('\"jobs\"')").wrap("<a href='/extend/generic-extractor/jobs/'></a>");
    $("span.nt:contains('\"children\"')").wrap("<a href='/extend/generic-extractor/jobs/#children'></a>");
    $("span.nt:contains('\"recursionFilter\"')").wrap("<a href='/extend/generic-extractor/jobs/children/#filter'></a>");
    $("span.nt:contains('\"placeholders\"')").wrap("<a href='/extend/generic-extractor/jobs/children/#placeholders'></a>");
}, false);
</script>
