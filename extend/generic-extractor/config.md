---
title: Generic Extractor Config
permalink: /extend/generic-extractor/config/
---

This section defines the actual run of the extractor

## Config items

### `incrementalOutput`
- Sets the incremental flag for Docker bundle

### `debug`
- Output all requests to events log

### `jobs`
- Define resources to be exported from the API
- [link](/extend/generic-extractor/jobs/)

### `mappings`
- Allows to override the default JSON parser and manually map data to CSV files
- [link](/extend/generic-extractor/mappings/)

### `outputBucket`
- Used **only** if the application doesn't use the default_bucket flag in KBC

### `http`
- Values for required headers defined in [api](/extend/generic-extractor/api/)'s `requiredHeaders`
- See example in the [API config documentation](/extend/generic-extractor/api/)

### `userData`
- A set of `key:value` pairs that will be added to the `root` of all endpoints' results
- Example:

        {
            "config": {
                "userData": {
                    "some": "tag",
                    "another": "identifier"
                }
            }
        }

    - With this config, if the usual result CSV would look like this:

            "id","username"
            "1","Joe",
            "2","Garry"

    - ...the result will instead look like this:

            "id","username","some","another"
            "1","Joe","tag","identifier"
            "2","Garry","tag","identifier"

- [User functions](/extend/generic-extractor/user-functions/) can be used as a value, for intance to fill in a current date:

    - Config:

            {
                "config": {
                    "userData": {
                        "export_date": {
                            "function": "date",
                            "args": [
                                "Y-m-d"
                            ]
                        }
                    }
                }
            }

    - Result:

            "id","username","export_date"
            "1","Joe","2016-06-30"
            "2","Garry","2016-06-30"

## Example

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
