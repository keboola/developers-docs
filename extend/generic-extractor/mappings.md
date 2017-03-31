---
title: Mapping
permalink: /extend/generic-extractor/mappings/
---

Generic Extractor receives JSON responses, 
[merges them together](/extend/generic-extractor/jobs/#merging-responses) and converts them to CSV files
which are then imported to KBC. **Mapping** allows you to modify the behavior of this conversion process.
The reasons to modify this process are TODO prepsat to nasledujici - reasons to use
Ideally, the built in JSON parser would analyze and parse the result into a table with no configuration. However, that also assumes the data is not known before received from the API, and doesn't allow setting a primary key. In some cases with very complicated JSONs, it could also result into a hardly useful yet large amount of tables on the output, in which case it is often better to create the mapping and define what columns/tables will be created.

doplnit odkaz na tutorial
The automatic conversion process is defined by the following rules (see [example](todo basic example) below:

- if the value of a JSON field is a [scalar](todo), then it is saved as the value of a column with the name of the field
- if the value of a JSON field is an object, then each of the object variable values will be added as a value of a column with the concatenated name
- if the value of a JSON field is an [array](todo), then a new table will be created and linked by `JSON_parentId` column.

Mapping configuration allows you to manually modify or override this behavior for a 
[`dataType`](/extend/generic-extractor/jobs/#data-type) defined in a job. Example configuration can look like this:

{% highlight json %}
"mappings": {
    "users": {
        "address.country": {
            "type": "column",
            "mapping": {
                "destination": "country"
            }
        }
    }
}
{% endhighlight %}

## Configuration
The `mappings` configuration is a deeply nested object. The first level of keys are `dataType` 
values used in the [job configurations](/extend/generic-extractor/jobs/#data-type). The 
second level of keys are names of properties found (or expected) in the response. 
The value is then an object with the following properties:

- `type` (optional, string) -- Mapping type, either `column`, `table` or `user`. Default value is `column`.
- `mapping` (required, object) -- Mapping configuration, depends on the mapping type.

TODO: primarni klic na vic sloupcich ?

The following configuration 

{% highlight json %}
"mappings": {
    "users": {
        "id": {
            "type": "column",
            "mapping": {
                "destination": "user_id"
            }
        }
    }
}
{% endhighlight %}

### Column Mapping
The column mapping represents a basic mapping type which allows you to select extracted 
columns, rename them and optionally set primary key for the extracted table. The mapping 
configuration requires:

- `type` (optional, string) -- can be omitted or must be set to `column`,
- `mapping` (required, object) -- object with properties:
  - `destination` (required, string) -- name of the column in the output table,
  - `primaryKey` (optional, boolean) -- if `true`, then a primary key will be set on the column. Default value is `false`.

### User Mapping
User mapping has the same configuration as the [column mapping](#column-mapping). The only difference is
that it applies to virtual properties. This is useful mainly for working with auto-generated properties/columns
in child jobs (see [example](#mapping-child-jobs)).

### Table Mapping
Table mapping allows you to create a new table from a particular property of the response object. Table
mapping is by default used for arrays 

co kurva znamena tahle veta:

"If the destination is the same as the current parsed 'type' (destination of the parent), parentKey.disable must be true to preserve consistency of structure of the child and parent"
- asi kdybych chtel address dotahhnout do users

## Examples

### Automatic Mapping
Without any configuration the following JSON response:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "address": {
            "street": "Blossom Avenue",
            "country": "United Kingdom"
        },
        "interests": [
            "girls", "cars", "flowers"
        ]
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "address": {
            "street": "Whiteheaven Mansions",
            "city": "London",
            "country": "United Kingdom"
        },
        "interests": [
            "boys", "cars", "flowers"
        ]
    }
]
{% endhighlight %}

is converted to the following CSV files (and subsequently Storage tables)

users:

|id|name|address\_street|address\_country|address\_city|interests|
|123|John Doe|Blossom Avenue|United Kingdom||users_dab021748b7f93c10476ebe151de4459|
|234|Jane Doe|Whiteheaven Mansions|United Kingdom|London|users_aeb1d126471eef24c0769437f4e7adaa|

users_interests:
|data|JSON_parentId|
|girls|users_dab021748b7f93c10476ebe151de4459|
|cars|users_dab021748b7f93c10476ebe151de4459|
|flowers|users_dab021748b7f93c10476ebe151de4459|
|boys|users_aeb1d126471eef24c0769437f4e7adaa|
|cars|users_aeb1d126471eef24c0769437f4e7adaa|
|flowers|users_aeb1d126471eef24c0769437f4e7adaa|

The nested properties `address.street`, `address.county` and `address_city` were automatically 
flattened into columns named as concatenation of the parent and child property name. The 
array property `interests` was turned into a separate table and linked through using 
`JSON_parentId` column and autogenerated keys.

See the [full example](todo:063-mapping-automatic).

### Basic Manual Mapping
Maybe you are not interested in the user `interests` and you want to simplify the users table
to four columns `country`, `name` and `id`. The following mapping configuration does
the trick:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/"
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ],
            "mappings": {
                "users": {
                    "address.country": {
                        "type": "column",
                        "mapping": {
                            "destination": "country"
                        }
                    },
                    "name": {
                        "type": "column",
                        "mapping": {
                            "destination": "name"
                        }
                    },
                    "id": {
                        "mapping": {
                            "destination": "id",
                            "primaryKey": true
                        }
                    }
                }
            }
        }    
    }
}
{% endhighlight %}

The `mappings` settings has the key `users` which is the value of `job.dataType` property. The keys in
the `users` objects are names of properties in the JSON response, the values are mapping configurations for
each of the property. The mapping is always exhaustive, which means that only the mentioned properties will
get processed and all others will be completely ignored. The above configuration will also set a primary
key on the `id` column.

All three mapped properties are mapped to columns (the `id` property relies on the default value for `type`). 
Notice that in for the nested properties, you need to enter the name/path in the JSON response (`address.country`).
You can't use the auto-generated name produced without any mapping (`address_country`), because the automatic 
processing is turned off by the mapping.

Take great care to use correct keys in the mapping! If you misspell the first-level key, the entire configuration 
will be ignored (it will refer to a non-existent data type). If you misspell the second-level key, you'll get 
an empty column in the result (it will refer to a non-existent property of the response). With the 
correct settings, the following table will be produced:

|country|name|id|
|United Kingdom|John Doe|123|
|United Kingdom|Jane Doe|234|

See the [full example](todo:064-mapping-basic).

### Mapping Child Jobs
Let's say that you have an API endpoint `/users` which returns a response similar to:

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

More details about the user, can be retrieved through another endpoint `/user/{id}`, where `{id}` is 
the user ID:

{% highlight json %}
{
    "id": 123,
    "name": "John Doe",
    "address": {
        "city": "London",
        "country": "UK",
        "street": "Whitehaven Mansions"
    },
    "interests": [
        "girls", "cars", "flowers"
    ]
}
{% endhighlight %}

To handle this situation in Generic Extractor, you need to use a [child job](todo). 

{% highlight json %}
"jobs": [
    {
        "endpoint": "users",
        "dataType": "users",
        "children": [
            {
                "endpoint": "user/{user-id}",
                "dataType": "user-detail",
                "dataField": ".",
                "placeholders": {
                    "user-id": "id"
                }
            }
        ]
    }
]
{% endhighlight %}

The produced user-detail table will look like this:

|id|name|address\_city|address\_country|address\_street|interests|parent_id|
|123|John Doe|London|UK|Whitehaven Mansions|user-detail_3484bd6e10690a3a2e77079f69ceaa42|123|
|234|Jane Doe|St Mary Mead|UK|High Street|user-detail_a7655e39a0399dc842b44365778cd295|234|

Now you can use the following mapping to shape the table:

{% highlight json %}
"mapping": {
    "user-detail": {
        "address.country": {
            "type": "column",
            "mapping": {
                "destination": "country"
            }
        },
        "parent_id": {
            "type": "user",
            "mapping": {
                "destination": "user_id"
            }
        }
    }
}
{% endhighlight %}

The above mapping will cause Generic Extractor to return the following user-detail table:

|country|user_id|
|UK|123|
|UK|234|

The important part in the mapping configuration is that you **must** use `"type": "user"` 
for the mapping type of the `parent_id` (`user_id`) column. This is because the 
column `parent_id` does not really exist in the response as it is generated dynamically for the child job.

See the [full example](todo:065-mapping-child-jobs).

## Table Mapping Examples

### Basic Table Mapping
Because all output columns must be listed in mapping, the above settings skip the `interests` property of 
the response:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "address": {
            "street": "Blossom Avenue",
            "country": "United Kingdom"
        },
        "interests": [
            "girls", "cars", "flowers"
        ]
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "address": {
            "street": "Whiteheaven Mansions",
            "city": "London",
            "country": "United Kingdom"
        },
        "interests": [
            "boys", "cars", "flowers"
        ]
    }
]
{% endhighlight %}

The `interests` property cannot be saved as a column, therefore a mapping of type `table` must be used.

{% highlight json %}
"mappings": {
    "users": {
        "name": {
            "type": "column",
            "mapping": {
                "destination": "name"
            }
        },
        "id": {
            "type": "column",
            "mapping": {
                "destination": "id"
            }
        },                
        "interests": {
            "type": "table",
            "destination": "user-interests",
            "tableMapping": {
                "": {
                    "type": "column",
                    "mapping": {
                        "destination": "interest"
                    }
                }
            }
        }
    }
}
{% endhighlight %}

The table mapping follows the same structure as normal mapping. Each item is another mapping 
definition identified by the property name in the JSON file. Because the `interests` property
itself is an array, its value has no name therefore the key is empty string `""`. The mapping
value is standard [column mapping](todo). The above configuration produces the 
same result as the automatic mapping of columns.

See the [full example](todo:066-mapping-tables-basic).

### Nested Properties
Let's say that you have an API which returns a response like this:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "contacts": {
            "email": "john.doe@example.com",
            "phone": "987345765",
            "addresses": [
                {
                    "street": "Blossom Avenue",
                    "country": "United Kingdom"
                },
                {
                    "street": "Whiteheaven Mansions",
                    "city": "London",
                    "country": "United Kingdom"
                }
            ]
        }
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "contacts": {
            "email": "jane.doe@example.com",
            "skype": "jane.doe",
            "addresses": [
                {
                    "street": "Whiteheaven Mansions",
                    "city": "London",
                    "country": "United Kingdom"
                }
            ]
        }
    }
]
{% endhighlight %}

With the automatic mapping (without any `mappings` configuration), the following tables will be extracted:

users:

|id|name|contacts\_email|contacts\_phone|contacts\_addresses|contacts\_skype|
|123|John Doe|john.doe@example.com|987345765|users.contacts_912c86dec7acdb9d8a17c97eb464aec6||
|234|Jane Doe|jane.doe@example.com||users.contacts_4cf9e859113127acb138872cc630e75f|jane.doe|

users.contacts:

|street|country|city|JSON_parentId|
|Blossom Avenue|United Kingdom||users.contacts_912c86dec7acdb9d8a17c97eb464aec6|
|Whiteheaven Mansions|United Kingdom|London|users.contacts_912c86dec7acdb9d8a17c97eb464aec6|
|Whiteheaven Mansions|United Kingdom|London|users.contacts_4cf9e859113127acb138872cc630e75f|

This might not be exactly what you want. Perhaps you would like the contacts to be separate from users and 
addresses. This can be done using the following mapping configuration: 

{% highlight json %}
"mappings": {
    "users": {
        "id": {
            "type": "column",
            "mapping": {
                "destination": "id"
            }
        },
        "name": {
            "type": "column",
            "mapping": {
                "destination": "name"
            }
        },
        "contacts": {
            "type": "table",
            "destination": "user-contact",
            "tableMapping": {
                "email": {
                    "type": "column",
                    "mapping": {
                        "destination": "email"
                    }
                },
                "phone": {
                    "type": "column",
                    "mapping": {
                        "destination": "tel"
                    }
                },
                "addresses": {
                    "type": "table",
                    "destination": "user-address",
                    "tableMapping": {
                        "street": {
                            "type": "column",
                            "mapping": {
                                "destination": "street"
                            }
                        },
                        "country": {
                            "type": "column",
                            "mapping": {
                                "destination": "country"
                            }
                        }
                    }
                }
            }
        }
    }
}
{% endhighlight %}

The above configuration defines that `contacts` field will be mapped into a separate table
with columns `email` and `tel` (value of `mapping.destination`). The `address` field will be 
mapped into yet another separate table with columns `street` and `country`. 

With the above configuration, the following tables will be created:

users:

|id|name|user-contact|
|123|John Doe|b5d72095c441b3a3d6f23ad8142c3f8b|
|234|Jane Doe|5f7f2ab65a680f1a9387a8fafe6b9050|

user-contact:

|email|tel|user-address|users_pk|
|john.doe@example.com|987345765|1c439a9a39548290f7b7a4513a9224e7|b5d72095c441b3a3d6f23ad8142c3f8b|
|jane.doe@example.com||605e865710f95dba665f6d0e8bc19f1a|5f7f2ab65a680f1a9387a8fafe6b9050|

user-address:

|street|country|user-contact_pk|
|Blossom Avenue|United Kingdom|1c439a9a39548290f7b7a4513a9224e7|
|Whiteheaven Mansions|United Kingdom|1c439a9a39548290f7b7a4513a9224e7|
|Whiteheaven Mansions|United Kingdom|605e865710f95dba665f6d0e8bc19f1a|

See the [full example](todo:067-mapping-tables-nested).

### Array Items
With the same API response as above: 

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "contacts": {
            "email": "john.doe@example.com",
            "phone": "987345765",
            "addresses": [
                {
                    "street": "Blossom Avenue",
                    "country": "United Kingdom"
                },
                {
                    "street": "Whiteheaven Mansions",
                    "city": "London",
                    "country": "United Kingdom"
                }
            ]
        }
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "contacts": {
            "email": "jane.doe@example.com",
            "skype": "jane.doe",
            "addresses": [
                {
                    "street": "Whiteheaven Mansions",
                    "city": "London",
                    "country": "United Kingdom"
                }
            ]
        }
    }
]
{% endhighlight %}

let's say that you know that the `addresses` array contains only two items at most and therefore
you want to mark them as primary and secondary address.

{% highlight json %}
"mappings": {
    "users": {
        "id": {
            "type": "column",
            "mapping": {
                "destination": "id"
            }
        },
        "name": {
            "type": "column",
            "mapping": {
                "destination": "name"
            }
        },
        "contacts": {
            "type": "table",
            "destination": "user-contact",
            "tableMapping": {
                "email": {
                    "type": "column",
                    "mapping": {
                        "destination": "email"
                    }
                },
                "phone": {
                    "type": "column",
                    "mapping": {
                        "destination": "tel"
                    }
                },
                "addresses.0": {
                    "type": "table",
                    "destination": "primary-address",
                    "tableMapping": {
                        "street": {
                            "type": "column",
                            "mapping": {
                                "destination": "street"
                            }
                        },
                        "country": {
                            "type": "column",
                            "mapping": {
                                "destination": "country"
                            }
                        }
                    }
                },
                "addresses.1": {
                    "type": "table",
                    "destination": "secondary-address",
                    "tableMapping": {
                        "street": {
                            "type": "column",
                            "mapping": {
                                "destination": "street"
                            }
                        },
                        "country": {
                            "type": "column",
                            "mapping": {
                                "destination": "country"
                            }
                        }
                    }
                }
            }
        }
    }
}
{% endhighlight %}

The above is pretty long configuration, but the important part is:

{% highlight json %}
"addresses.0": {
    "type": "table",
    "destination": "primary-address",
    "tableMapping": {
        "street": {
            "type": "column",
            "mapping": {
                "destination": "street"
            }
        },
        "country": {
            "type": "column",
            "mapping": {
                "destination": "country"
            }
        }
    }
}
{% endhighlight %}

This picks the first item (rember that arrays indexes are [zero-based](todo)) and places it in the
`primary-address` table. Analogously, the `addresses.1` mapping picks the second item from the `addressess` 
array and stores it in the `seconday-address` table.

See the [full example](todo:068-mapping-tables-nested-array).

### Directly Mapping Array
With the same API response as above:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe",
        "contacts": {
            "email": "john.doe@example.com",
            "phone": "987345765",
            "addresses": [
                {
                    "street": "Blossom Avenue",
                    "country": "United Kingdom"
                },
                {
                    "street": "Whiteheaven Mansions",
                    "city": "London",
                    "country": "United Kingdom"
                }
            ]
        }
    },
    {
        "id": 234,
        "name": "Jane Doe",
        "contacts": {
            "email": "jane.doe@example.com",
            "skype": "jane.doe",
            "addresses": [
                {
                    "street": "Whiteheaven Mansions",
                    "city": "London",
                    "country": "United Kingdom"
                }
            ]
        }
    }
]
{% endhighlight %}

If you map the table as in the [previous example](todo), you will receive a `primary-address` table:

|street|country|user-contact_pk|
|Blossom Avenue|United Kingdom|1c439a9a39548290f7b7a4513a9224e7|
|Whiteheaven Mansions|United Kingdom|605e865710f95dba665f6d0e8bc19f1a|

Notice that the records link to the `user-contact` table. This may produce unnecesarilly complicated
links between tables, because from the response it is obvious that each address is assigned to 
a specific user. To avoid this, you can directly map a nested property:

{% highlight json %}
"mappings": {
    "users": {
        "id": {
            "type": "column",
            "mapping": {
                "destination": "id"
            }
        },
        "name": {
            "type": "column",
            "mapping": {
                "destination": "name"
            }
        },
        "contacts": {
            "type": "table",
            "destination": "user-contact",
            "tableMapping": {
                "email": {
                    "type": "column",
                    "mapping": {
                        "destination": "email"
                    }
                },
                "phone": {
                    "type": "column",
                    "mapping": {
                        "destination": "tel"
                    }
                }
            }
        },
        "contacts.addresses.0": {
            "type": "table",
            "destination": "primary-address",
            "tableMapping": {
                "street": {
                    "type": "column",
                    "mapping": {
                        "destination": "street"
                    }
                },
                "country": {
                    "type": "column",
                    "mapping": {
                        "destination": "country"
                    }
                }
            }
        }
    }
}
{% endhighlight %}

The mapping for `primary-address` table is now **not nested** inside the mapping for the
`contacts` table. Therefore it links directly to the `users` table. The content is the same because
the mapping still refers to the same property -- the first item of the `adddresses` property of `contacts` 
(`contacts.addresses.0`). The following table is produced:

|street|country|users_pk|
|Blossom Avenue|United Kingdom|b5d72095c441b3a3d6f23ad8142c3f8b|
|Whiteheaven Mansions|United Kingdom|5f7f2ab65a680f1a9387a8fafe6b9050|

The user table now contains additonal column `primary-address`:

|id|name|user-contact|primary-address|
|123|John Doe|b5d72095c441b3a3d6f23ad8142c3f8b|b5d72095c441b3a3d6f23ad8142c3f8b|
|234|Jane Doe|5f7f2ab65a680f1a9387a8fafe6b9050|5f7f2ab65a680f1a9387a8fafe6b9050|

See the [full example](todo:069-mapping-tables-nested-direct).

### Using Primary Keys
In the above example, you can see that the `primary-address` table contains 
an autogenerated key to link back to users. This is unnecessary, because you can safely link to
the user ID. To do this, you need only to specify a primary key for a table:

{% highlight json %}
"mappings": {
    "users": {
        "id": {
            "type": "column",
            "mapping": {
                "destination": "id",
                "primaryKey": true
            }
        },
        "name": {
            "type": "column",
            "mapping": {
                "destination": "name"
            }
        },
        "contacts": {
            "type": "table",
            "destination": "user-contact",
            "tableMapping": {
                "parentKey": {
                    "primaryKey": true,
                    "destination": "userId"
                },
                "email": {
                    "type": "column",
                    "mapping": {
                        "destination": "email"
                    }
                },
                "phone": {
                    "type": "column",
                    "mapping": {
                        "destination": "phone"
                    }
                }
            }
        },
        "contacts.addresses.0": {
            "type": "table",
            "destination": "primary-address",
            "tableMapping": {
                "street": {
                    "type": "column",
                    "mapping": {
                        "destination": "street"
                    }
                },
                "country": {
                    "type": "column",
                    "mapping": {
                        "destination": "country"
                    }
                }
            }
        }
    }
}
{% endhighlight %}

The most important part in the above configuration is the `"primaryKey": true` setting for 
the `id` column in the `users` table. Thanks to this, Generic Extractor is able to automatically link
all related records to this ID. In the `user-contact` and `primary-address` tables, a column
`users_pk` will be created which will contain the user ID. The name is auto-generated as the
name of the parent table with suffix `_pk`. 

To override this auto-generated name, the following configuration is used in the `user-contact` 
table to rename the `users_pk` column to `userId`.

{% highlight json %}
"parentKey": {
    "primaryKey": true,
    "destination": "userId"
},

It also marks the `userId` column in the `user-contact` table as primary key. The following tables
are produced by the above mapping configuration:

users:
|id|name|
|123|John Doe|
|234|Jane Doe|

user-contact:
|email|phone|userId|
|john.doe@example.com|987345765|123|
|jane.doe@example.com||234|

primary-address:
|street|country|users_pk|
|Blossom Avenue|United Kingdom|123|
|Whiteheaven Mansions|United Kingdom|234|



ze se to automaticky rozpona struktura a merguje

- **dataType**: Sets name for the data result, used by the parser - 
both automatic [JSON parser](https://github.com/keboola/php-jsonparser#parse-characteristics) 
and [manual mapping](#TODO). This value is also used to name the output table.



Manually map the JSON data to CSV files for some or all `dataType`s.

## Configuration

- **mappings** attribute can be used to force the extractor to map the response into columns in a CSV file as described in the [JSON to CSV Mapper documentation](https://github.com/keboola/php-csvmap).
Each property in the `mappings` object must follow the mapper settings, where the key is the `dataType` of a `job`. Note that if a `dataType` is not set, it is generated from the endpoint and might be confusing if ommited.

- If there's no mapping for a `dataType`, the standard JSON parser processes the result.

- In a [recursive job](/extend/generic-extractor/recursion/), the placeholer prepended by `parent_` is available as `type: user` to link the child to a parent. See example below:



    Jobs:

        {
          "jobs": [
            {
              "endpoint": "orgs/keboola/repos",
              "dataType": "repos",
              "children": [
                {
                  "endpoint": "repos/keboola/{1:name}/issues",
                  "placeholders": {
                    "1:name": "name"
                  },
                  "dataType": "issues"
                }
              ]
            }
          ]
        }

    Mappings (of the child):

        {
          "mappings": {
            "issues": {
              "parent_name": {
                "type": "user",
                "mapping": {
                  "destination": "repo_name"
                }
              },
              "title": {
                "mapping": {
                  "destination": "title"
                }
              },
              "id": {
                "mapping": {
                  "destination": "id",
                  "primaryKey": true,
                  "propertyOrder": 1
                }
              }
            }
          }
        }

    The `parent_name` is the `parent_` prefix together with the value of placeholder `1:name`.

## Example

### Config

{% highlight json %}
{
  "mappings": {
    "data": {
      "id": {
        "mapping": {
          "destination": "id",
          "primaryKey": true
        }
      },
      "status": {
        "mapping": {
          "destination": "st"
        }
      }
    }
  },
  "jobs": [
    {
      "endpoint": "data.json",
      "dataType": "data"
    }
  ]
}
{% endhighlight %}

### Data

{% highlight json %}
{
    "results": [
        {
            "id": 1,
            "status": "new"
        },
        {
            "id": 2,
            "status": "active"
        }
    ]
}
{% endhighlight %}

### Result CSV

{% highlight csv %}
"id","st"
"1","new",
"2","active"
{% endhighlight %}

The `id` column will also be set as a primary key in the table imported to KBC/Storage, according to the mapping
