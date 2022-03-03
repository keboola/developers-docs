---
title: Jsonnet Files
permalink: /cli/templates/structure/jsonnet-files/
---

* TOC
{:toc}

**Warning: "templates" is an experimental feature.**

All project [JSON files](/cli/structure/) are in template defined by [Jsonnet](https://jsonnet.org/) files.
Jsonnet is based on JSON syntax. Valid JSON is also valid Jsonnet.
In addition, Jsonnet offers more language constructs such as [conditions, cycles, variables, ...](https://jsonnet.org/learning/tutorial.html)


## Functions

In addition to the [standard Jsonnet functions](https://jsonnet.org/ref/stdlib.html), the following functions are also available: 

**`ConfigId("<config-id>")`**

- **Replaces configuration human-readable ID by a generated unique ID.**
- In template, each configuration has a human-readable name, e.g. `my-config`.
- When applying template, human-readable ID is replaced by a generated unique ID, e.g. `5038695485`.
- As a result, it is possible to create multiple instances of template.
- `ConfigId` function is primarily used in [template manifest](/cli/templates/structure/#manifest-1), but it can be used in any Jsonnet file.

For example, a bucket ID that contains configuration ID can be composed in this way:
```jsonnet
{
 storage: {
  input: {
   tables: [
    {source: "in.c-keboola-ex-aws-s3-" + ConfigId("config-with-output-mapping") + ".table"},
   ],
  },
 },
}
```

**`ConfigRowId("<row-id>")`**

- **Replaces configuration row human-readable ID by a generated unique ID.**
- Similar to `ConfigId`, but for configuration rows.

**`Input("<input-id>")`**

- **Returns value of the [user input](/cli/templates/structure/inputs/).**
- If the input is hidden, because the [showIf](/cli/templates/structure/inputs/#show-if) condition was evaluated as `false`:
  - Function returns default value of the input, if it is defined. 
  - Otherwise, it returns empty value, e.g. `0` for `int` type, `false` for `bool` type, ...

Example:
```jsonnet
{
  parameters: {
    api: {
      baseUrl: Input("base-url"),
    },
  },
}
```

## Next Steps
- [User Inputs](/cli/templates/structure/inputs/)
- [Template Structure](/cli/templates/structure/)
