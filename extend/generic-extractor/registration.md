---
title: Generic Extractor Registration
permalink: /extend/generic-extractor/registration/
---

* TOC
{:toc}

It is possible to register a Generic Extractor configuration and create a 
completely new extractor based on it. This allows you to share the API extractor between various
projects and simplify its further configuration. The 
[registration process](https://developers.keboola.com/extend/registration/)
is common to all components, thought there are some specifics for Generic Extractor.

## Configuration Considerations
Before converting your configuration to a universally available component, you need to consider
what values in the configuration should be provided by the end-user (typically authentication values).
Then design a [configuration schema](/extend/registration/configuration-schema/) for setting 
those values. You can [test the schema online](http://jeremydorn.com/json-editor/). The values obtained from
the end-user will be stored in the [`config` property](/extend/generic-extractor/config/).
Then you have to modify your configuration so that it reads those values from the `config` properties.
Do not forget that if you prefix a value with hash `#`, it will be 
[encrypted](/overview/encryption/) when the configuration is saved.
You should also try to make the extractor [work incrementally](/extend/generic-extractor/incremental/) 
if possible.

## Submission
The following fields from the [checklist](/extend/registration/checklist/) are 
not applicable:

- **Application Type** -- always `extractor`,
- **Docker image URL** -- not used, provided by Keboola,
- **Docker image tag** -- not used, provided by Keboola,
- **Required memory** -- not used, provided by Keboola,
- **Encryption** -- always `true`,
- **Token forwarding** -- always `false`,
- **UI options** -- always `genericTemplatesUI`,
- **Networking** -- always `dataIn`,
- **Actions** -- always `run`,
- **Logger** -- not used, provided by Keboola,
- **Staging Storage** -- not used, provided by Keboola

Because the UI is assumed to be `genericTemplatesUI`, you have to provide 
[**Configuration schema**](/extend/registration/configuration-schema/).
An example of the templates UI is shown on the picture below.

{: .image-popup}
![Screenshot - Generic templates UI](/extend/generic-extractor/template-1.png)

The `Config` section of the templates UI is defined by the Configuration Schema you provide. 
The `Template` section contains at least one template. Template is simply one configuration of 
Generic Extractor. For example you might want to provide one configuration for incremental loading
and a different configuration for full loading. The template UI also has the option to
`Switch to JSON editor` which displays the configuration JSON and allows the end-user to modify it.
Notice that the JSON editor allows modification only to the [`config`](/extend/generic-extractor/config)
section. Other sections, such as [`api`](/extend/generic-extractor/api/) or 
[`authorization`](/extend/generic-extractor/api/authentication#oauth20) may not be modified by the end-user.
Optionally, the templates UI may contain interface to negotiate 

## Example
Let's say that you have the following working API configuration:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "login",
                "loginRequest": {
                    "endpoint": "token",
                    "headers": {
                        "Authorization": {
                            "function": "base64_encode",
                            "args": [
                                "JohnDoe:TopSecret"
                            ]
                        }
                    }
                },
                "apiRequest": {
                    "headers": {
                        "X-Api-Auth": "auth.token"
                    }
                }
            },
            "default": {
                "http": {
                    "params": {
                        "accountId": 123
                    }
                }
            }
        },
        "config": {
            "incrementalOutput": true,            
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "type": "active"
                    }
                },
                {
                    "endpoint": "orders",
                    "dataType": "orders"
                }
            ]
        }
    }
}
{% endhighlight %}

You identify, that four values of that configuration can be set by the end-user:

- `JohnDoe` --- you can create a string parameter `login`,
- `TopSecret` --- you can create a string parameter `#password` (it will be encrypted),
- `123` --- you can create a numeric parameter `accountId`,
- `active` --- you can create a enumeration parameter `userType` (with values `active`, `inactive`, `all`).

The parameters names are completely arbitrary, only they mustn't conflict with existing
configuration properties of [Generic Extractor](/extend/generic-extractor/config/) (e.g. `jobs`, `mappings`)
Now you can create a [configuration schema](/extend/registration/configuration-schema/) for the four parameters.

{% highlight json %}
{
  "title": "Person",
  "type": "object",
  "properties": {
    "login": {
      "type": "string",
      "title": "Login:",
      "description": "Your API user name",
      "minLength": 4
    },
    "#password": {
      "type": "string",
      "title": "Password:",
      "description": "Your API password",
      "minLength": 4
    },
    "accountId": {
      "type": "integer",
      "title": "Account ID",
      "description": "See in-app help for obtaining Account Id"
    },
    "userType": {
      "title": "User type:",
      "type": "string",
      "enum": [
        "active",
        "inactive",
        "all"
      ],
      "default": "active",
      "description": "Specify which users to obtain"
    }
  },
  "required": [
     "login", "#password", "accountId", "userType"
  ]
}
{% endhighlight %}

When you test the [schema online](http://jeremydorn.com/json-editor/), you will obtain the
configuration JSON it produces:

{: .image-popup}
![Screenshot - Schema Test](/extend/generic-extractor/schema-test.png)

{% highlight json %}
{
  "login": "JohnDoe",
  "#password": "TopSecret",
  "accountId": 123,
  "userType": "inactive"
}
{% endhighlight %}

The above properties will be merged into the [`config` section](/extend/generic-extractor/config/). Now
you have to modify the configuration so that it reads them from there using 
[functions and references](/extend/generic-extractor/functions/).

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "login",
                "loginRequest": {
                    "endpoint": "token",
                    "headers": {
                        "Authorization": {
                            "function": "base64_encode",
                            "args": [
                                {
                                    "function": "concat",
                                    "args": [
                                        {
                                            "attr": "username"
                                        },
                                        ":",
                                        {
                                            "attr": "#password"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                "apiRequest": {
                    "headers": {
                        "X-Api-Auth": "auth.token"
                    }
                }
            }
        },
        "config": {
            "incrementalOutput": true,            
            "username": "JohnDoe",
            "#password": "TopSecret",
            "accountId": 123,
            "userType": "active",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users",
                    "params": {
                        "accountId": {
                            "attr": "accountId"
                        },
                        "type": {
                            "attr": "userType"
                        }
                    }                    
                },
                {
                    "endpoint": "orders",
                    "dataType": "orders",
                    "params": {
                        "accountId": {
                            "attr": "accountId"
                        }                        
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

The argument to the `base64_encode` function is now the 
[`concat` function](/extend/generic-extractor/functions/#concat) which joins together the 
values of the `username` and `#password` fields. The `accountId` parameter needs to be moved to the 
`jobs` section, because the `http.defaultOptions.params` section does not support function calls (yet!).
The `type` parameter was changed to a reference to the `userType` field. 

When you handled the configuration parameters, you can turn the configuration into a template. Separate
the `api` section to individual `api.json` file:

{% highlight json %}
{
    "baseUrl": "http://example.com/",
    "authentication": {
        "type": "login",
        "loginRequest": {
            "endpoint": "token",
            "headers": {
                "Authorization": {
                    "function": "base64_encode",
                    "args": [
                        {
                            "function": "concat",
                            "args": [
                                {
                                    "attr": "username"
                                },
                                ":",
                                {
                                    "attr": "#password"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        "apiRequest": {
            "headers": {
                "X-Api-Auth": "auth.token"
            }
        }
    }
}
{% endhighlight %}

Then remove the user provided values (`username`, `#password`, `accountId`, `userType`) from
the `config` section add `name` and `description` to it. Save the file into a 
separate `template.json` file.

{% highlight json %}
{
    "name": "Basic",
    "description": "Basic incremental template",
    "incrementalOutput": true,
    "jobs": [
        {
            "endpoint": "users",
            "dataType": "users",
            "params": {
                "accountId": {
                    "attr": "accountId"
                },
                "type": {
                    "attr": "userType"
                }
            }                    
        },
        {
            "endpoint": "orders",
            "dataType": "orders",
            "params": {
                "accountId": {
                    "attr": "accountId"
                }                        
            }
        }
    ]
}
{% endhighlight %}

You can create as many `template.json` files as you wish. All of them need to share the same `api.json` 
configuration however. When you want to register your component, attach the `api.json` and all 
`template.json` files. 
