---
title: Use Template
permalink: /cli/commands/local/template/upgrade/
---

* TOC
{:toc}

**Use a [template](/cli/templates/structure/#template) in the [local directory](/cli/structure/).**

```
kbc local template upgrade [flags]
```

Upgrades the existing [template](/cli/templates/structure/#template) in the [project directory](/cli/structure/).
Changes are made only locally. To save changes to the project, run [kbc sync push](/cli/commands/sync/push/) afterwards.
You will be prompted to select a target branch and provide [user inputs](/cli/templates/structure/inputs/).

### Options

`-b, --branch string <string>`
: target branch ID or name

`--dry-run bool <bool>`
: print what needs to be done

`-f, --inputs-file string <string>`
: JSON file with input values

`-i, --instance string <string>`
: instance ID of the template to upgrade

`-V, --version string <string>`
: target version; the default is the latest stable version

[Global Options](/cli/commands/#global-options)

### Examples


```
➜ kbc local template upgrade

? Select branch:  [Use arrows to move, type to filter]
> Main (997933)

? Select template instance: [Use arrows to move, type to filter]
> data-quality 1.0.0 (06YeEsQLdR66jhn81zmmtqnpQ)

New objects from "my-repository/my-template/v0" template:
   ...
  * R main/_shared/keboola.snowflake-transformation/codes/keboola-test-table-compare-structure
  * R main/_shared/keboola.snowflake-transformation/codes/keboola-test-table-empty
  * R main/_shared/keboola.snowflake-transformation/codes/keboola-test-time-series-complete
  * R main/_shared/keboola.snowflake-transformation/codes/keboola-test-time-series-complete-range
  * C main/other/keboola.orchestrator/data-quality-example
  * C main/transformation/keboola.python-transformation-v2/generate-sample-data
  * C main/transformation/keboola.snowflake-transformation/data-quality-core-abort-fail-example
  * C main/transformation/keboola.snowflake-transformation/data-quality-core-abort-fail-example/variables
  * R main/transformation/keboola.snowflake-transformation/data-quality-core-abort-fail-example/variables/values/default
  * C main/transformation/keboola.snowflake-transformation/data-quality-core-full-example
  * C main/transformation/keboola.snowflake-transformation/data-quality-core-full-example/variables
  * R main/transformation/keboola.snowflake-transformation/data-quality-core-full-example/variables/values/default
Template instance "06YeEsQLdR66jhn81zmmtqnpQ" has been upgraded to "keboola/data-quality/1.0.0".
```

## Next Steps

- [Templates](/cli/templates/)
- [Create Template Tutorial](/cli/templates/tutorial/)
- [Use Template Tutorial](/cli/templates/tutorial/#use-template)
