---
title: Run Template Tests
permalink: /cli/commands/template/test/run/
---

* TOC
{:toc}

**Run [template](/cli/templates/structure/#template) tests in the [repository directory]((/cli/templates/structure/#repository)).
See [Test Structure](/cli/templates/tests/) for more details.**

```
kbc template test run [template] [version] [flags]
```

This command runs tests for a specified template or all templates in the repository (if you do not provide the `template` parameter).

If you provide `template` but not the `version` parameter, the default version will be used.

This command must be run in the [repository directory](/cli/templates/structure#repository).

It requires at least one existing project in a public Keboola stack defined in the environment variable `KBC_TEST_PROJECTS_FILE`. 

For example: 
```
KBC_TEST_PROJECTS_FILE=./projects.json
``` 

This is an example of a projects file:
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

`--local-only <bool>`
: Run only local tests (default false)

`--remote-only <bool>`
: Run only remote tests (default false)

`--test-name <string>`
: Run only the test with the specified name

`--test-projects-file <string>`
: File containing the projects available for templates

`--verbose <bool>`
: Show details about running tests (default false)


[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc template test run --local-only
PASS keboola/my-template/0.0.1 one local
PASS keboola/template-2/2.0.0 one local
```

## Next Steps

- [Tests](/cli/templates/tests/)
- [Templates](/cli/templates/)
- [All Commands](/cli/commands/)
