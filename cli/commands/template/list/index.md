---
title: List Templates
permalink: /cli/commands/template/list/
---

* TOC
{:toc}

**List [templates](/cli/templates/structure/#template) in the [repository directory]((/cli/templates/structure/#repository)).**

```
kbc template list [flags]
```

The command must be run in the [repository directory](/cli/templates/structure#repository).

## Options

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc template list

 Template ID:          my-template 
 Name:                 My Template 
 Description:          Full workflow to ... 
 Default version:      1.0.0 
  
   Version:            1.0.0 
   Stable:             true 
   Description:        notes 
  
   Version:            0.0.1 
   Stable:             false 
   Description:        notes 
  
  
 Template ID:          second-template 
 Name:                 Second Template 
 Description:          Full workflow to ... 
 Default version:      1.0.2 
  
   Version:            1.0.2 
   Stable:             true 
   Description:        notes 
```

## Next Steps

- [Templates](/cli/templates/)
- [All Commands](/cli/commands/)
