---
title: Generic Extractor Configuration
permalink: /extend/generic-extractor/configuration/
---

* TOC
{:toc}

*To configure your first Generic Extractor, follow our [tutorial](/extend/generic-extractor/tutorial/).*

To get an overall idea of what to expect when configuring Generic Extractor, take a look at the following **overview** of various configuration sections. 

Then go through a [sample configuration](#configuration-map) featuring all configuration options and their 
nesting. The **configuration map** is also available as a [separate article](/extend/generic-extractor/map/).

### Configuration Sections
*Click on the section names if you want to learn more.* 

- **`parameters`**
	- [**`api`**](/extend/generic-extractor/configuration/api/) --- sets the basic properties of the API.
		- [**`baseUrl`**](/extend/generic-extractor/configuration/api/#base-url) --- defines the URL to which the 
		API requests should be sent.
		- [**`pagination`**](/extend/generic-extractor/configuration/api/pagination/) --- breaks a result with a 
		large number of items into separate pages.
		- [**`authentication`**](/extend/generic-extractor/configuration/api/authentication/) --- needs to be 
		configured for any API which is not public.
		- [**`retryConfig`**](/extend/generic-extractor/configuration/api/#retry-configuration) --- automatically, 
		and repeatedly, retries failed HTTP requests.
		- [**`http`**](/extend/generic-extractor/configuration/api/#default-http-options) --- set the default 
		headers and parameters sent with each API call. 
	- [**`config`**](/extend/generic-extractor/configuration/config/) --- describes the actual extraction.
		- [**`debug`**](/extend/generic-extractor/running/#debug-mode) --- shows all HTTP requests sent by 
		Generic Extractor.
		- **`username`** --- authentication parameter
		- **`password`** --- authentication parameter
		- [**`outputBucket`**](/extend/generic-extractor/configuration/config/#output-bucket) --- defines the name 
		of a Storage Bucket in which the extracted tables will be stored.
		- [**`http`**](/extend/generic-extractor/configuration/config/#http) --- sets the HTTP headers sent with 
		every request.
		- [**`jobs`**](/extend/generic-extractor/configuration/config/jobs/) --- describes the API endpoints 
		(resources) to be extracted.
		- [**`mappings`**](/extend/generic-extractor/configuration/config/#mappings) --- describes how the JSON 
		response is converted into CSV files that will be imported into Storage (optional).
		- [**`incremental output`**](/extend/generic-extractor/incremental/) ---  loads the extracted data into 
		Storage incrementally.
		- [**`user data`**](/extend/generic-extractor/configuration/config/#user-data) --- adds arbitrary data to 
		extracted records.
- [**`iterations`**](/extend/generic-extractor/iterations/) --- executes a configuration multiple times, each time 
with different values.
- **`authorization`** 

There are also simple pre-defined [**`functions`**](/extend/generic-extractor/functions/) available, adding extra 
flexibility when needed. 

Generic Extractor can be run from within the [**KBC user interface**](/extend/generic-extractor/running/) (only 
configuration [JSON](/extend/generic-extractor/tutorial/json/) needed), or [**locally**](/extend/generic-extractor/running/#running-locally) 
([Docker](/extend/docker/tutorial/) needed).

### Configuration Map  
The following sample configuration shows various configuration options and their nesting. 
You can use the map to navigate between them. The parameter map is also available 
[separately](/extend/generic-extractor/map/) and we recommend pinning it to your toolbar for quick reference.

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
    $("span.nt:contains('\"baseUrl\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#base-url'></a>");
    $("span.nt:contains('\"retryConfig\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#retry-configuration'></a>");
    $("span.nt:contains('\"http\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#default-http-options'></a>");
    $("span.nt:contains('\"headers\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#headers'></a>");
    $("span.nt:contains('\"params\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span.nt:contains('\"defaultOptions\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#default-request-parameters'></a>");
    $("span.nt:contains('\"requiredHeaders\"')").wrap("<a href='/extend/generic-extractor/configuration/api/#required-headers'></a>");
    $("span.nt:contains('\"pagination\"')").wrap("<a href='/extend/generic-extractor/configuration/api/pagination/'></a>");
    $("span.nt:contains('\"scrollers\"')").wrap("<a href='/extend/generic-extractor/configuration/api/pagination/multiple/'></a>");
    $("span.nt:contains('\"method\"')").first().wrap("<a href='/extend/generic-extractor/configuration/api/pagination/#paging-strategy'></a>");
    $("span.nt:contains('\"authentication\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication'></a>");

    // Jobs
    $("span.nt:contains('\"endpoint\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#endpoint'></a>");
    $("span.nt:contains('\"params\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#request-parameters'></a>");    
    $("span.nt:contains('\"method\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#method'></a>");
    $("span.nt:contains('\"dataField\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#data-field'></a>");
    $("span.nt:contains('\"dataType\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#data-type'></a>");
    $("span.nt:contains('\"responseFilter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span.nt:contains('\"responseFilterDelimiter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#response-filter'></a>");
    $("span.nt:contains('\"scroller\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#scroller'></a>");

    // Child jobs
    $("span.nt:contains('\"children\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/#children'></a>");
    $("span.nt:contains('\"recursionFilter\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/children/#filter'></a>");
    $("span.nt:contains('\"placeholders\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/children/#placeholders'></a>");

    // Config root
    $("span.nt:contains('\"config\"')").wrap("<a href='/extend/generic-extractor/configuration/config/'></a>");
    $("span.nt:contains('\"debug\"')").wrap("<a href='/extend/generic-extractor/running/#debug-mode'></a>");
    $("span.nt:contains('\"jobs\"')").wrap("<a href='/extend/generic-extractor/configuration/config/jobs/'></a>");
    $("span.nt:contains('\"mappings\"')").wrap("<a href='/extend/generic-extractor/configuration/configuration/config/mappings/'></a>");
    $("span.nt:contains('\"api\"')").wrap("<a href='/extend/generic-extractor/configuration/api/'></a>");
    $("span.nt:contains('\"outputBucket\"')").wrap("<a href='/extend/generic-extractor/configuration/config/#output-bucket'></a>");
    $("span.nt:contains('\"http\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/#http'></a>");

    // Mappings
    $("span.nt:contains('\"type\"')").last().wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#configuration'></a>");
    $("span.s2:contains('\"column\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span.s2:contains('\"user\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#user-mapping'></a>");
    $("span.s2:contains('\"table\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#table-mapping'></a>");
    $("span.nt:contains('\"mapping\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#column-mapping'></a>");
    $("span.nt:contains('\"tableMapping\"')").wrap("<a href='/extend/generic-extractor/configuration/config/mappings/#table-mapping'></a>");
    
    // Authorization
    $("span.nt:contains('\"authorization\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span.nt:contains('\"oauth_api\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");
    $("span.nt:contains('\"credentials\"')").wrap("<a href='/extend/generic-extractor/configuration/api/authentication/#oauth'></a>");

    $("span.nt:contains('\"iterations\"')").wrap("<a href='/extend/generic-extractor/iterations/'></a>");    
}, false);
</script>
<style>
pre a {
    border-bottom: 1px dashed navy;
}
</style>
