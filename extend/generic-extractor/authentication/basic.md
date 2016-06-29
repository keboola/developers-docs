---
title: Basic Authentication
permalink: /extend/generic-extractor/authentication/basic/
---

Use simple combination of `username` and `password`.

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
