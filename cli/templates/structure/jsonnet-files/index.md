---
title: Jsonnet Files
permalink: /cli/templates/structure/jsonnet-files/
---

* TOC
{:toc}

All project [JSON files](/cli/structure/) in a template are defined by [Jsonnet](https://jsonnet.org/) files.
Jsonnet builds on JSON syntax, meaning that valid JSON is also valid Jsonnet.
In addition, Jsonnet offers more language constructs, such as [conditions, cycles, and variables](https://jsonnet.org/learning/tutorial.html).


## Functions

In addition to the [standard Jsonnet functions](https://jsonnet.org/ref/stdlib.html), the following functions are also available: 

--------------------------------------

**`ConfigId(string configId) string`**

- Replaces a human-readable configuration ID with a generated unique ID.
- In a template, each configuration has a human-readable name (e.g., `my-config`).
- When applying a template, the human-readable ID is replaced with a generated unique ID (e.g., `5038695485`).
- This allows a creation of multiple instances of a template.
- The `ConfigId` function is primarily used in the [template manifest](/cli/templates/structure/#repository-manifest) but can also be applied in any Jsonnet file.

Example: 
<br>Composing a bucket ID containing a configuration ID:
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

--------------------------------------

**`ConfigRowId(string rowId) string`**

- Replaces a human-readable configuration row ID with a generated unique ID.
- Similar to `ConfigId`, but applies to configuration rows.

--------------------------------------

**`Input(string inputId) string`**

- Returns the value of the [user input](/cli/templates/structure/inputs/).
- If the input is hidden because the [showIf](/cli/templates/structure/inputs/#show-if) condition evaluated to `false`:
  - The function returns a default empty value based on the input type (e.g., `0` for `int`, `false` for `bool`, etc.).

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

--------------------------------------

**`InputIsAvailable(string inputId) string`**

- Returns `true` if the input has been filled by the user.
- Return `false` if the step was skipped or `showIf = false`.

--------------------------------------

**`InstanceId() string`**

- Returns the ID of the current template instance.
- Example: `V1StGXR8IZ5jdHi6BAmyT`
- This function is not supported in the preview endpoint, which is used for simple template configurations that do not have InstanceIDs.

--------------------------------------

**`InstanceIdShort() string`**

- Returns the shortend ID of the current template instance (8 characters).
- Example: `V1StGXR8`
- This function is not supported in the preview endpoint.
  
--------------------------------------

**`ComponentIsAvailable(string componentId) bool`**

- Returns `true` if the component is available, otherwise returns `false`.

--------------------------------------

**`SnowflakeWriterComponentId() string`**

- Returns the component ID of the Snowflake writer based on the stack.
  - AWS: `keboola.wr-db-snowflake`
  - Azure: `keboola.wr-snowflake-blob-storage`
  - GCP stacks (BigQuery backend): `keboola.wr-db-snowflake-gcs`
  - GCP stacks (Snowflake backend): `keboola.wr-db-snowflake-gcs-s3`
- This function is not supported in the `inputs.jsonnet` because project backends are unknown before template loading.

--------------------------------------

**`HasProjectBackend(backend string) bool`**

- Returns `true` if the specified backend is available, otherwise returns `false`.

--------------------------------------

**`RandomID() string`**

- Returns a random ID truncated to 8 characters.
  

## Next Steps
- [User Inputs](/cli/templates/structure/inputs/)
- [Template Structure](/cli/templates/structure/)
