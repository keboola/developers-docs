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
| [kbc local create](/cli/commands/local/create/) | Create an object in the local directory. |
| [kbc local create config](/cli/commands/local/create/config/) | Create an empty [configuration](https://help.keboola.com/components/). |
| [kbc local create row](/cli/commands/local/create/row/) | Create an empty [configuration row](https://help.keboola.com/components/#configuration-rows). |
| [kbc local persist](/cli/commands/local/persist/) | Detect new directories with a [configuration](https://help.keboola.com/components/) or a [configuration row](https://help.keboola.com/components/#configuration-rows). |
| [kbc local encrypt](/cli/commands/local/encrypt/) | Encrypt all [unencrypted secrets](/overview/encryption/#encrypting-data-with-api). |
| [kbc local validate](/cli/commands/local/validate/) | Validate the local directory. |
| [kbc local fix-paths](/cli/commands/local/fix-paths/) | Ensure that all local paths match [configured naming](/cli/structure/#naming). |
