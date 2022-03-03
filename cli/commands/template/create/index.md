---
title: Create Template
permalink: /cli/commands/template/create/
---

* TOC
{:toc}

**Create a new [template](/cli/templates/structure/#template) in the [repository directory]((/cli/templates/structure/#repository)) from an existing [project](/cli/#subsystems).**

```
kbc template create [flags]
```

An interactive dialog will start. It will guide you through the process of creating a new template.
See [Create Template Tutorial](/cli/templates/tutorial).


The command must be run in the [repository directory](/cli/templates/structure#repository).

## Options

`-a, --all-configs`
: use all configs from the branch

`--all-inputs`
: use all found config/row fields as user inputs

`-b, --branch string`
: source branch ID or name

`-c, --configs string`
: comma separated list of {componentId}:{configId}

`--description string`
: template description

`--id string`
: template ID

`--name string`
: template name

`-H, --storage-api-host string`
: storage API host, eg. "connection.keboola.com"

[Global Options](/cli/commands/#global-options)

## Examples

See [Create Template Tutorial](/cli/templates/tutorial/#create-template).

## Next Steps

- [All Commands](/cli/commands/)
- [Init](/cli/commands/sync/init/)
