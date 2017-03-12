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
                    "endpoint": "campaigns",
                    "dataField": "campaigns",
                    "responseFilter": "campaigns.tasks/tags",
                    "responseFilterDelimiter": "/",
                    "children": [
                        {
                            "endpoint": "campaigns/{campaign_id}/send-checklist",
                            "dataField": "items",
                            "placeholders": {
                                "campaign_id": "id"
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

<script src='/assets/js/jquery-3.1.1.min'></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    $("span.nt:contains('\"endpoint\"')").wrap("<a href='/extend/generic-extractor/jobs/#endpoint'></a>");
    $("span.nt:contains('\"params\"')").wrap("<a href='/extend/generic-extractor/jobs/#request-parameters'></a>");
    $("span.nt:contains('\"method\"')").wrap("<a href='/extend/generic-extractor/jobs/#method'></a>");
    $("span.nt:contains('\"dataField\"')").wrap("<a href='/extend/generic-extractor/jobs/#data-field'></a>");
    $("span.nt:contains('\"dataType\"')").wrap("<a href='/extend/generic-extractor/jobs/#data-type'></a>");
    $("span.nt:contains('\"responseFilter\"')").wrap("<a href='/extend/generic-extractor/jobs/#response-filter'></a>");
    $("span.nt:contains('\"responseFilterDelimiter\"')").wrap("<a href='/extend/generic-extractor/jobs/#response-filter'></a>");
    $("span.nt:contains('\"children\"')").wrap("<a href='/extend/generic-extractor/jobs/#children'></a>");
}, false);
</script>
