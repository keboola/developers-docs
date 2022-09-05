---
title: Run Templates Tests
permalink: /cli/commands/template/test/run/
---

* TOC
{:toc}

**Run [templates](/cli/templates/structure/#template) tests in the [repository directory]((/cli/templates/structure/#repository)).**

```
kbc template test run [template] [version] [flags]
```

The command will run tests for a specified template or all templates in the repository (if you don't provide `template` parameter).

If you provide `template` but don't provide `version` parameter, the default version will be used.

The command must be run in the [repository directory](/cli/templates/structure#repository).

## Options

`--local-only <bool>`
: run only local tests (default false)

`--remote-only <bool>`
: run only remote tests (default false)

`--test-name <string>`
: run only a test with specified name

`--verbose <bool>`
: show details about running tests (default false)


[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc template test run --local-only
PASS keboola/my-template/0.0.1 one local
PASS keboola/template-2/2.0.0 one local
```

## Next Steps

- [Templates](/cli/templates/)
- [All Commands](/cli/commands/)
