---
title: Create Template Tests
permalink: /cli/commands/template/test/create/
---

* TOC
{:toc}

**Create [template](/cli/templates/structure/#template) tests in the [repository directory]((/cli/templates/structure/#repository)). 
See [Tests Structure](/cli/templates/tests/) for more details.**

```
kbc template test create [template] [version] [flags]
```

The command will create a test for the specified template.

If you don't provide the `version` parameter, the default version will be used.

The command must be run in the [repository directory](/cli/templates/structure#repository).

It requires at least one existing project in a public Keboola stack defined in the environment variable `TEST_KBC_PROJECTS`,
accepting projects in the format `storage_api_host|project_id|project_token` and divided by `;`. 

For example: 
```
TEST_KBC_PROJECTS="connection.keboola.com|1234|project-1234-token;host2|id2|token2;...."
``` 

## Options

`--test-name <string>`
: Run only a test with a specified name

`--inputs-file <string>`
: Path to a file with the template inputs

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
