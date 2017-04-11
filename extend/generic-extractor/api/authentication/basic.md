---
title: Basic Authentication (under construction)
permalink: /extend/generic-extractor/authentication/basic/
---

Use simple combination of `username` and `password` in config.

## Configuration

- **authentication.type**: `basic`

## Example:

### Configuration:

    {
        "api": {
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "username": "joe",
            "password": "P0t4t0"
        }
    }
