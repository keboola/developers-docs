---
title: Generic Extractor
permalink: /extend/generic-extractor/
---

## Introduction
Generic extractor allows exporting data from REST APIs not implemented in Keboola Connection or creating custom configurations to export any data from any REST API.

## Configuration
The configuration consists of 2 main parts:

- `api`
    - Defines the basic API characteristics, such as pagination, authentication, base URL etc
    - [Documentation](/extend/generic-extractor/api/)
- `config`
    - This part defines the configuration itself - resources from the API, authentication credentials, ...
    - Each resource is a "job" within the extractor, and can contain children for recursive API calls (eg tickets > comments for each ticket)
    - [Documentation](/extend/generic-extractor/config/)
