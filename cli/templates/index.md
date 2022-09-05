---
title: Templates
permalink: /cli/templates/
---

* TOC
{:toc}

**Warning: "templates" is an experimental feature.**

Keboola CLI allows you to create a template from an existing project and apply it to another project.

If you want to use the experimental "templates" feature, you must enable it by the environment variable:
```sh
export KBC_TEMPLATES_PRIVATE_BETA=true
```

See the [tutorial](/cli/templates/tutorial/) on how to create and use a template.

## Available Commands

|---
| Command | Description
|-|-|-
| **[kbc local template](/cli/commands/local/template/)** | Manage template instances in the [project directory](/cli/structure/). |
| [kbc local template delete](/cli/commands/local/template/delete/) | Delete an instance of a template in the project directory. |
| [kbc local template list](/cli/commands/local/template/list/) | List used templates instances in the project directory. |
| [kbc local template use](/cli/commands/local/template/use/) | Use a template in the project directory. |
| | |
| **[kbc template](/cli/commands/template/)** | Manage [templates](/cli/templates/structure/#template) in the [template repository](/cli/templates/structure/#repository). |
| [kbc template repository](/cli/commands/template/repository/) | Manage a template [repository directory](/cli/templates/structure/). |
| [kbc template repository init](/cli/commands/template/repository/init/) | Initialize a new [repository directory](/cli/templates/structure/#repository) in an empty directory. |
| [kbc template create](/cli/commands/template/create/) | Create a new template from an existing project. |
| [kbc template describe](/cli/commands/template/describe/) | Describe the template and its inputs. |
| [kbc template list](/cli/commands/template/list/) | List the templates in the repository. |
| [kbc template test](/cli/commands/template/test/) | Manage template tests. |
| [kbc template test run](/cli/commands/template/test/run/) | Run template tests. |



## Next Steps
- [Create Template Tutorial](/cli/templates/tutorial/)
- [Use Template Tutorial](/cli/templates/tutorial/#use-template)
- [Template Structure](/cli/templates/structure/)
