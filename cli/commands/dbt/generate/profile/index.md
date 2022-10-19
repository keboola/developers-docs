---
title: Generate Profile Command
permalink: /cli/commands/dbt/generate/profile/
---

* TOC
{:toc}

**Generates profile file in the dbt project directory.**

```
kbc dbt generate profile [flags]
```

The command must be run in a directory with a dbt project (i.e. containing `dbt_project.yml`) or its subdirectory.

The command creates a `profiles.yml` file if it does not exist yet and prepares outputs for the selected target.

See [introduction to dbt support](/cli/dbt/) for more information.

## Options

`-T, --target-name <string>`
: Target name of the profile

[Global Options](/cli/commands/#global-options)

## Examples

```
➜ kbc dbt generate profile -T target1

Profile stored in "profiles.yml".
```

The generated `profiles.yml`:

{% raw  %}
```yaml
TestProject:
    target: target1
    outputs:
        target1:
            account: '{{ env_var("DBT_KBC_TARGET1_ACCOUNT") }}'
            database: '{{ env_var("DBT_KBC_TARGET1_DATABASE") }}'
            password: '{{ env_var("DBT_KBC_TARGET1_PASSWORD") }}'
            schema: '{{ env_var("DBT_KBC_TARGET1_SCHEMA") }}'
            type: '{{ env_var("DBT_KBC_TARGET1_TYPE") }}'
            user: '{{ env_var("DBT_KBC_TARGET1_USER") }}'
            warehouse: '{{ env_var("DBT_KBC_TARGET1_WAREHOUSE") }}'
send_anonymous_usage_stats: false
```
{% endraw %}

## Next Steps

- [dbt generate](/cli/commands/dbt/generate/)
- [Introduction to dbt support](/cli/dbt/)
