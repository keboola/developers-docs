---
title: Local Command
permalink: /cli/commands/local/
---

* TOC
{:toc}

**Operations in the [local directory](/cli/structure/) don't affect the project.**

```
kbc local [command]
```

|---
| Command | Description
|-|-|-
| **[kbc local create](/cli/commands/local/create/)** | **Create an object in the local directory.** |
| [kbc local create config](/cli/commands/local/create/config/) | Create an empty [configuration](https://help.keboola.com/components/). |
| [kbc local create row](/cli/commands/local/create/row/) | Create an empty [configuration row](https://help.keboola.com/components/#configuration-rows). |
| | |
| [kbc local persist](/cli/commands/local/persist/) | Detect new directories with a [configuration](https://help.keboola.com/components/) or a [configuration row](https://help.keboola.com/components/#configuration-rows). |
| [kbc local encrypt](/cli/commands/local/encrypt/) | Encrypt all [unencrypted secrets](/overview/encryption/#encrypting-data-with-api). |
| [kbc local validate](/cli/commands/local/validate/) | Validate the local directory. |
| [kbc local fix-paths](/cli/commands/local/fix-paths/) | Ensure that all local paths match [configured naming](/cli/structure/#naming). |
| | |
| **[kbc local template](/cli/commands/local/template/)** | **Manage [templates](/cli/templates/structure/#template) instances in the [project directory](/cli/structure/).** |
| [kbc local template delete](/cli/commands/local/template/delete/) | Delete a template instance from the local directory. |
| [kbc local template list](/cli/commands/local/template/list/) | List templates instances used in the project. |
| [kbc local template upgrade](/cli/commands/local/template/upgrade/) | Upgrade a template instance from the local directory. |
| [kbc local template use](/cli/commands/local/template/use/) | Use the template in the project directory. |
