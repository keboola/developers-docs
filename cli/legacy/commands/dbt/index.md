---
title: dbt Command
permalink: /cli/legacy/commands/dbt/
redirect_from:
  - /cli/commands/dbt/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Work with dbt inside your repository.**

The commands must be run in a directory with a dbt project (i.e. containing `dbt_project.yml`) or its subdirectory.

See the [introduction to dbt support](/cli/legacy/dbt/) for more information.

```
kbc dbt [command]
```

|---
| Command | Description
|-|-|-
| [kbc dbt init](/cli/legacy/commands/dbt/init/) | Initialize profiles, sources, and environment variables for use with dbt. |
| [kbc dbt generate](/cli/legacy/commands/dbt/generate/) | Generate profiles, sources, or environment variables for use with dbt. |
| [kbc dbt generate profile](/cli/legacy/commands/dbt/generate/profile/) | Generate profiles for use with dbt. |
| [kbc dbt generate sources](/cli/legacy/commands/dbt/generate/sources/) | Generate sources for use with dbt. |
| [kbc dbt generate env](/cli/legacy/commands/dbt/generate/env/) | Generate environment variables for use with dbt. |
