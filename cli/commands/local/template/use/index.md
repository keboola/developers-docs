---
title: Use Template
permalink: /cli/commands/local/template/use/
---

* TOC
{:toc}

**Use [template](/cli/templates/structure/#template) in the [local directory](/cli/structure/).**

```
kbc local template use <repository>/<template>/<version> [flags]
```

Applies the [template](/cli/templates/structure/#template) to the [project directory](/cli/structure/).
Changes are made only locally. To save changes to the project, run [kbc sync push](/cli/commands/sync/push/) afterwards.
You will be prompted for target branch and [user inputs](/cli/templates/structure/inputs/).

### Options

`-b, --branch string <string>`
: target branch ID or name

`-f, --inputs-file <string>`
: JSON file with inputs values

[Global Options](/cli/commands/#global-options)

### Examples

See [Use Template Tutorial](/cli/templates/tutorial/#use-template).

```
➜ kbc local template use my-repository/my-template/v0

? Select target branch:  [Use arrows to move, type to filter]
> Main (251721)

? MySQL Host: my-mysql.com

? MySQL Port: 3306
...

Plan for "encrypt" operation:
  C main/extractor/keboola.ex-db-mysql/my-data-source
    parameters.db.#password
Encrypt done.
New objects from "my-repository/my-template/v0" template:
  + C main/extractor/keboola.ex-db-mysql/my-data-source
  + R main/extractor/keboola.ex-db-mysql/my-data-source/rows/table1
  + R main/extractor/keboola.ex-db-mysql/my-data-source/rows/table2
  + C main/transformation/keboola.snowflake-transformation/my-transformation
Template "my-repository/my-template/v0" has been applied.
```

## Next Steps

- [Templates](/cli/templates/)
- [Create Template Tutorial](/cli/templates/tutorial/)
- [Use Template Tutorial](/cli/templates/tutorial/#use-template)
