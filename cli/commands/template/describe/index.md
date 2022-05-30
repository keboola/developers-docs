---
title: Describe Template
permalink: /cli/commands/template/describe/
---

* TOC
  {:toc}

**Describe [template](/cli/templates/structure/#template) and its inputs in the [repository directory]((/cli/templates/structure/#repository)).**

```
kbc template describe <template-id> [version] [flags]
```

If you don't provide `version` parameter, the default version will be used.

The command must be run in the [repository directory](/cli/templates/structure#repository).

## Options

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc template describe

 Template ID:          my-template 
 Name:                 My Template 
 Description:          Full workflow to ... 
  
 Version:              0.0.1 
 Stable:               false 
 Description:          notes 
 Components:
   - keboola.ex-aws-s3
  
 Group ID:             g01 
 Description:          Default Group 
 Required:             all 
  
   Step ID:            g01-s01 
   Name:               Default Step 
   Description:        Default Step 
   Dialog Name:        Default Step 
   Dialog Description: Default Step 
  
     Input ID:         ex-generic-v2-api-base-url 
     Name:             Api BaseUrl 
     Description:      a 
     Type:             string 
     Kind:             input 
     Default:          "https://jsonplaceholder.typicode.com" 
  
     Input ID:         ex-db-mysql-db-host 
     Name:             Db Host 
     Description:      b 
     Type:             string 
     Kind:             input 
     Default:          "mysql.example.com" 
  
     Input ID:         ex-db-mysql-incremental 
     Name:             Incremental 
     Description:      c 
     Type:             bool 
     Kind:             confirm 
     Default:          false 
  
 Group ID:             g02 
 Description:          Group 2 
 Required:             all 
  
   Step ID:            g02-s01 
   Name:               Step 2-1 
   Description:        Step 2-1 
   Dialog Name:        Step 2-1 
   Dialog Description: Step 2-1 
  
     Input ID:         ex-generic-v2-api-base-url-2 
     Name:             Api BaseUrl 
     Description:      a 
     Type:             string 
     Kind:             input 
     Default:          "https://jsonplaceholder.typicode.com" 
```

## Next Steps

- [Templates](/cli/templates/)
- [All Commands](/cli/commands/)
