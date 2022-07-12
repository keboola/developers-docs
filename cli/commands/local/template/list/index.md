---
title: List Templates Instances
permalink: /cli/commands/local/template/list/
---

* TOC 
{:toc}

**List [templates](/cli/templates/structure/#template) instances used in the project.**

```
kbc local template list [flags]
```

Lists instances of all templates that were used in the project.

### Options

`-b, --branch string <string>`
: branch ID or name

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc local template list -b main
Template ID:          api-demo
Instance ID:          Kr2U26rYqefnpdeZ88qffZCcB
RepositoryName:       keboola
Version:              0.0.1
Name:                 tmpl1
Created:
  Date:               2022-05-02T14:56:32Z
  TokenID:            25254
Updated:
  Date:               2022-05-02T14:56:32Z
  TokenID:            25254
```

## Next Steps

- [Templates](/cli/templates/)
- [Create Template Tutorial](/cli/templates/tutorial/)
- [Use Template Tutorial](/cli/templates/tutorial/#use-template)
