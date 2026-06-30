---
title: Local Command
permalink: /cli/legacy/commands/local/
redirect_from:
  - /cli/commands/local/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Operations in the [local directory](/cli/legacy/structure/) don't affect the project.**

```
kbc local [command]
```

|---
| Command | Description
|-|-|-
| **[kbc local create](/cli/legacy/commands/local/create/)** | **Create an object in the local directory.** |
| [kbc local create config](/cli/legacy/commands/local/create/config/) | Create an empty [configuration](https://help.keboola.com/components/). |
| [kbc local create row](/cli/legacy/commands/local/create/row/) | Create an empty [configuration row](https://help.keboola.com/components/#configuration-rows). |
| | |
| [kbc local persist](/cli/legacy/commands/local/persist/) | Detect new directories with a [configuration](https://help.keboola.com/components/) or a [configuration row](https://help.keboola.com/components/#configuration-rows). |
| [kbc local encrypt](/cli/legacy/commands/local/encrypt/) | Encrypt all [unencrypted secrets](/overview/encryption/#encrypting-data-with-api). |
| [kbc local validate](/cli/legacy/commands/local/validate/) | Validate the local directory. |
| [kbc local fix-paths](/cli/legacy/commands/local/fix-paths/) | Ensure that all local paths match [configured naming](/cli/legacy/structure/#naming). |
