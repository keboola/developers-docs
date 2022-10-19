---
title: dbt Command
permalink: /cli/commands/dbt/
---

* TOC
{:toc}

**Work with dbt inside your repository.**

The commands must be run in a directory with a dbt project (i.e. containing `dbt_project.yml`) or its subdirectory.

See the [introduction to dbt support](/cli/dbt/) for more information.

```
kbc dbt [command]
```

|---
| Command | Description
|-|-|-
| [kbc dbt init](/cli/commands/dbt/init/) | Initialize profiles, sources, and environment variables for use with dbt. |
| [kbc dbt generate](/cli/commands/dbt/generate/) | Generate profiles, sources, or environment variables for use with dbt. |
| [kbc dbt generate profile](/cli/commands/dbt/generate/profile/) | Generate a profile for use with dbt. |
| [kbc dbt generate sources](/cli/commands/dbt/generate/sources/) | Generate sources for use with dbt. |
| [kbc dbt generate env](/cli/commands/dbt/generate/env/) | Generate environment variables for use with dbt. |
