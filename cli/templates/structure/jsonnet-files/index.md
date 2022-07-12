---
title: Jsonnet Files
permalink: /cli/templates/structure/jsonnet-files/
---

* TOC
{:toc}

**Warning: "templates" is an experimental feature.**

All project [JSON files](/cli/structure/) are in a template defined by [Jsonnet](https://jsonnet.org/) files.
Jsonnet is based on JSON syntax. Valid JSON is also valid Jsonnet.
In addition, Jsonnet offers more language constructs such as [conditions, cycles, variables, ...](https://jsonnet.org/learning/tutorial.html).


## Functions

In addition to the [standard Jsonnet functions](https://jsonnet.org/ref/stdlib.html), the following functions are also available: 

**`ConfigId("<config-id>")`**

- **Replaces a configuration human-readable ID by a generated unique ID.**
- In a template, each configuration has a human-readable name, e.g., `my-config`.
- When applying a template, a human-readable ID is replaced by a generated unique ID, e.g., `5038695485`.
- As a result, it is possible to create multiple instances of a template.
- `ConfigId` function is primarily used in the [template manifest](/cli/templates/structure/#manifest-1), but it can be used in any Jsonnet file.

For example, a bucket ID that contains a configuration ID can be composed in this way:
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

- **Replaces a configuration row human-readable ID by a generated unique ID.**
- Similar to `ConfigId`, but for configuration rows.

**`Input("<input-id>")`**

- **Returns the value of the [user input](/cli/templates/structure/inputs/).**
- If the input is hidden, because the [showIf](/cli/templates/structure/inputs/#show-if) condition was evaluated as `false`:
  - Function returns an empty value for the input type, e.g., `0` for `int`, `false` for `bool`, etc.

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

**`InputIsAvailable(inputId)`**

- **Returns `true` if the input has been filled in by the user and `false` if the step has been skipped or `showIf = false`**.

**`InstanceId()`**

- **Returns id of current template instance.**
- e.g. `V1StGXR8IZ5jdHi6BAmyT`

**`InstanceIdShort()`**

- **Returns id of current template instance shorten to 8 characters.**
- e.g. `V1StGXR8`



## Next Steps
- [User Inputs](/cli/templates/structure/inputs/)
- [Template Structure](/cli/templates/structure/)
