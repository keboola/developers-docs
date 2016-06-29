---
title: Generic Extractor Config
permalink: /extend/generic-extractor/config/
---

This section defines the actual run of the extractor

## Config items

- `incrementalOutput`
    - Sets the incremental flag for Docker bundle
- `debug`
    - Output all requests to events log
- `jobs` (TODO link to def)
- `mappings` (TODO link)
- `outputBucket`
    - Used **only** if the application doesn't use the default_bucket flag in KBC
- `http`
    - Values for required headers defined in [api](/extend/generic-extractor/api/)'s `requiredHeaders`
    - See example in the [API config documentation](/extend/generic-extractor/api/)

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
