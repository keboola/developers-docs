---
title: Generate Sources Command
permalink: /cli/commands/dbt/generate/sources/
---

* TOC
{:toc}

**Generates sources in the dbt project directory.**

```
kbc dbt generate sources [flags]
```

The command must be run in a directory with a dbt project (i.e. containing `dbt_project.yml`) or its subdirectory.

The command creates a file for each Storage bucket in `models/_sources` directory containing dbt source for every table in the bucket.

See [introduction to dbt support](/cli/dbt/) for more information.

## Options

`-H, --storage-api-host <string>`
: Storage API host, e.g. "connection.keboola.com"

`-T, --target-name <string>`
: Target name of the profile

[Global Options](/cli/commands/#global-options)

## Examples

```
➜ kbc dbt generate sources

Please enter Keboola Storage API host, eg. "connection.keboola.com".
? API host: connection.north-europe.azure.keboola.com


Please enter Keboola Storage API token. The value will be hidden.
? API token: **************************************************


Please enter target name.
Allowed characters: a-z, A-Z, 0-9, "_".
? Target Name: target1

Sources stored in "models/_sources" directory.
```

A generated source file `models/_sources/in.c-test.yml`:

{% raw  %}
```yaml
version: 2
sources:
    - name: in.c-test
      freshness:
        warn_after:
            count: 1
            period: day
      database: '{{ env_var("DBT_KBC_TARGET1_DATABASE") }}'
      schema: in.c-test
      loaded_at_field: '"_timestamp"'
      tables:
        - name: products
          quoting:
            database: true
            schema: true
            identifier: true
          columns: []
```
{% endraw %}

## Next Steps

- [dbt generate](/cli/commands/dbt/generate/)
- [Introduction to dbt support](/cli/dbt/)
