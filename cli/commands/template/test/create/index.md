---
title: Create Template Tests
permalink: /cli/commands/template/test/create/
---

* TOC
{:toc}

**Create [template](/cli/templates/structure/#template) tests in the [repository directory]((/cli/templates/structure/#repository)). 
See the [test structure](/cli/templates/tests/) for more details.**

```
kbc template test create [template] [version] [flags]
```

This command creates a test for the specified template.

If you do not provide the `version` parameter, the default version will be used.

This command must be run in the [repository directory](/cli/templates/structure#repository).

It requires at least one existing project in a public Keboola stack, defined in the environment variable `KBC_TEST_PROJECTS_FILE`.

For example:
```
KBC_TEST_PROJECTS_FILE=./projects.json
``` 

Example project file:
```json
[
  {
    "host": "connection.keboola.com",
    "project": 12345,
    "stagingStorage": "s3",
    "backend": "snowflake",
    "token": "XXXX",
    "legacyTransformation": true
  }
]
```

## Options

`--test-name <string>`
: Run only the test with the specified name

`--inputs-file <string>`
: Path to the file containing the template inputs

`--test-projects-file <string>`
: File containing the projects available for templates

`--verbose <bool>`
: Show details (default false)


[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc template test create my-template 0.0.1 --test-name one --inputs-file ./inputs.json
New objects from "keboola/my-template/0.0.1" template:
  + C main/extractor/ex-generic-v2/empty
Template "keboola/my-template/0.0.1" has been applied, instance ID: 1234
The test was created in the folder tests/one.
```

## Next Steps

- [Tests](/cli/templates/tests/)
- [Templates](/cli/templates/)
- [All Commands](/cli/commands/)
