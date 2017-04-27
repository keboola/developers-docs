---
title: Generic Extractor Parameter Map
permalink: /extend/generic-extractor/map/
---

Use the following sample configuration to navigate among various configuration options:

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
                        "type": {
                            "attr": "userType"
                        }
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
    },
    "iterations": [
        {
            "userType": "active"
        },
        {
            "userType": "inactive"
        }
    ],
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "{\"status\": \"ok\",\"refresh_token\": \"1234abcd5678efgh\"}",
                "appKey": "someId",
                "#appSecret": "clientSecret"
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
    $("span.nt:contains('\"authentication\"')").wrap("<a href='/extend/generic-extractor/api/authentication'></a>");

    // Jobs
    $("span.nt:contains('\"endpoint\"')").wrap("<a href='/extend/generic-extractor/config/jobs/#endpoint'></a>");
    $("span.nt:contains('\"params\"')").last().wrap("<a href='/extend/generic-extractor/config/jobs/#request-parameters'></a>");    
    $("span.nt:contains('\"method\"')").last().wrap("<a href='/extend/generic-extractor/config/jobs/#method'></a>");
    $("span.nt:contains('\"dataField\"')").wrap("<a href='/extend/generic-extractor/config/jobs/#data-field'></a>");
    $("span.nt:contains('\"dataType\"')").wrap("<a href='/extend/generic-extractor/config/jobs/#data-type'></a>");
    $("span.nt:contains('\"responseFilter\"')").wrap("<a href='/extend/generic-extractor/config/jobs/#response-filter'></a>");
    $("span.nt:contains('\"responseFilterDelimiter\"')").wrap("<a href='/extend/generic-extractor/config/jobs/#response-filter'></a>");
    $("span.nt:contains('\"scroller\"')").last().wrap("<a href='/extend/generic-extractor/config/jobs/#scroller'></a>");

    // Child jobs
    $("span.nt:contains('\"children\"')").wrap("<a href='/extend/generic-extractor/config/jobs/#children'></a>");
    $("span.nt:contains('\"recursionFilter\"')").wrap("<a href='/extend/generic-extractor/config/jobs/children/#filter'></a>");
    $("span.nt:contains('\"placeholders\"')").wrap("<a href='/extend/generic-extractor/config/jobs/children/#placeholders'></a>");

    // Config root
    $("span.nt:contains('\"config\"')").wrap("<a href='/extend/generic-extractor/config/'></a>");
    $("span.nt:contains('\"debug\"')").wrap("<a href='/extend/generic-extractor/running/#debug-mode'></a>");
    $("span.nt:contains('\"jobs\"')").wrap("<a href='/extend/generic-extractor/config/jobs/'></a>");
    $("span.nt:contains('\"mappings\"')").wrap("<a href='/extend/generic-extractor/config/mappings/'></a>");
    $("span.nt:contains('\"api\"')").wrap("<a href='/extend/generic-extractor/api/'></a>");
    $("span.nt:contains('\"outputBucket\"')").wrap("<a href='/extend/generic-extractor/config/#output-bucket'></a>");
    $("span.nt:contains('\"http\"')").last().wrap("<a href='/extend/generic-extractor/config/#http'></a>");

    // Mappings
    $("span.nt:contains('\"type\"')").last().wrap("<a href='/extend/generic-extractor/config/mappings/#configuration'></a>");
    $("span.s2:contains('\"column\"')").wrap("<a href='/extend/generic-extractor/config/mappings/#column-mapping'></a>");
    $("span.s2:contains('\"user\"')").wrap("<a href='/extend/generic-extractor/config/mappings/#user-mapping'></a>");
    $("span.s2:contains('\"table\"')").wrap("<a href='/extend/generic-extractor/config/mappings/#table-mapping'></a>");
    $("span.nt:contains('\"mapping\"')").wrap("<a href='/extend/generic-extractor/config/mappings/#column-mapping'></a>");
    $("span.nt:contains('\"tableMapping\"')").wrap("<a href='/extend/generic-extractor/config/mappings/#table-mapping'></a>");
    
    // Authorization
    $("span.nt:contains('\"authorization\"')").wrap("<a href='/extend/generic-extractor/api/authentication/#oauth'></a>");
    $("span.nt:contains('\"oauth_api\"')").wrap("<a href='/extend/generic-extractor/api/authentication/#oauth'></a>");
    $("span.nt:contains('\"credentials\"')").wrap("<a href='/extend/generic-extractor/api/authentication/#oauth'></a>");

    $("span.nt:contains('\"iterations\"')").wrap("<a href='/extend/generic-extractor/iterations/'></a>");    
}, false);
</script>
<style>
pre a {
    border-bottom: 1px dashed navy;
}
</style>
