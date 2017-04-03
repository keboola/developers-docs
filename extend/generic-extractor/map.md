---
title: Generic Extractor Parameter Map
permalink: /extend/generic-extractor/map/
---

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "https://example.com/v3.0/",
            "pagination": {
                "method": "multiple",
                "scrollers": {
                    "offset_scroll": {
                        "method": "offset",
                        "offsetParam": "offset",
                        "limitParam": "count"
                    }
                }
            },
            "authentication": {
                "type": "basic"
            },
            "retryConfig": {
                "maxRetries": 3
            },
            "http": {
                "headers": {
                    "Accept": "application/json"
                },                
                "defaultOptions": {
                    "params": {
                        "company": 123
                    }
                },
                "requiredHeaders": ["X-AppKey"]
            }
        },
        "config": {
            "debug": true,
            "username": "dummy",
            "#password": "secret",
            "outputBucket": "ge-tutorial",
            "http": {
                "headers": {
                    "X-AppKey": "ThisIsSecret"
                }
            },            
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
                    "scroller": "offset_scroll",
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
                    "name": {
                        "type": "column",
                        "mapping": {
                            "destination": "text"
                        }
                    },
                    "address": {
                        "type": "table",
                        "destination": "addresses",
                        "tableMapping": {
                            "street": {
                                "type": "column",
                                "mapping": {
                                    "destination": "streetName"
                                }
                            }
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
    // Api
    $("span.nt:contains('\"baseUrl\"')").wrap("<a href='/extend/generic-extractor/api/#base-url'></a>");
    $("span.nt:contains('\"retryConfig\"')").wrap("<a href='/extend/generic-extractor/api/#retry-configuration'></a>");
    $("span.nt:contains('\"http\"')").first().wrap("<a href='/extend/generic-extractor/api/#default-http-options'></a>");
    $("span.nt:contains('\"headers\"')").first().wrap("<a href='/extend/generic-extractor/api/#headers'></a>");
    $("span.nt:contains('\"params\"')").first().wrap("<a href='/extend/generic-extractor/api/#default-request-parameters'></a>");
    $("span.nt:contains('\"defaultOptions\"')").wrap("<a href='/extend/generic-extractor/api/#default-request-parameters'></a>");
    $("span.nt:contains('\"requiredHeaders\"')").wrap("<a href='/extend/generic-extractor/api/#required-headers'></a>");
    $("span.nt:contains('\"pagination\"')").wrap("<a href='/extend/generic-extractor/api/pagination/'></a>");
    $("span.nt:contains('\"scrollers\"')").wrap("<a href='/extend/generic-extractor/api/pagination/multiple/'></a>");
    $("span.nt:contains('\"method\"')").first().wrap("<a href='/extend/generic-extractor/api/pagination/#paging-strategy'></a>");
    // Jobs
    $("span.nt:contains('\"endpoint\"')").wrap("<a href='/extend/generic-extractor/jobs/#endpoint'></a>");
    $("span.nt:contains('\"params\"')").last().wrap("<a href='/extend/generic-extractor/jobs/#request-parameters'></a>");    
    $("span.nt:contains('\"method\"')").last().wrap("<a href='/extend/generic-extractor/jobs/#method'></a>");
    $("span.nt:contains('\"dataField\"')").wrap("<a href='/extend/generic-extractor/jobs/#data-field'></a>");
    $("span.nt:contains('\"dataType\"')").wrap("<a href='/extend/generic-extractor/jobs/#data-type'></a>");
    $("span.nt:contains('\"responseFilter\"')").wrap("<a href='/extend/generic-extractor/jobs/#response-filter'></a>");
    $("span.nt:contains('\"responseFilterDelimiter\"')").wrap("<a href='/extend/generic-extractor/jobs/#response-filter'></a>");
    $("span.nt:contains('\"scroller\"')").last().wrap("<a href='/extend/generic-extractor/jobs/#scroller'></a>");
    $("span.nt:contains('\"jobs\"')").wrap("<a href='/extend/generic-extractor/jobs/'></a>");
    // Child jobs
    $("span.nt:contains('\"children\"')").wrap("<a href='/extend/generic-extractor/jobs/#children'></a>");
    $("span.nt:contains('\"recursionFilter\"')").wrap("<a href='/extend/generic-extractor/jobs/children/#filter'></a>");
    $("span.nt:contains('\"placeholders\"')").wrap("<a href='/extend/generic-extractor/jobs/children/#placeholders'></a>");

    // Config root
    $("span.nt:contains('\"debug\"')").wrap("<a href='/extend/generic-extractor/running/#debug-mode'></a>");

    // Mappings
    $("span.nt:contains('\"mappings\"')").wrap("<a href='/extend/generic-extractor/mappings'></a>");
    $("span.nt:contains('\"type\"')").last().wrap("<a href='/extend/generic-extractor/mappings/#configuration'></a>");
    $("span.nt:contains('\"column\"')").wrap("<a href='/extend/generic-extractor/mappings/#column-mapping'></a>");
    $("span.nt:contains('\"user\"')").wrap("<a href='/extend/generic-extractor/mappings/#user-mapping'></a>");
    $("span.nt:contains('\"table\"')").wrap("<a href='/extend/generic-extractor/mappings/#table-mapping'></a>");
    
}, false);
</script>
