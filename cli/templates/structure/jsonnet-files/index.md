---
title: Jsonnet Files
permalink: /cli/templates/structure/jsonnet-files/
---

* TOC
{:toc}

All project [JSON files](/cli/structure/) are in a template defined by [Jsonnet](https://jsonnet.org/) files.
Jsonnet builds on JSON syntax, meaning that valid JSON is also valid Jsonnet.
In addition, Jsonnet offers more language constructs, such as [conditions, cycles, and variables](https://jsonnet.org/learning/tutorial.html).


## Functions

In addition to the [standard Jsonnet functions](https://jsonnet.org/ref/stdlib.html), the following functions are also available: 

--------------------------------------

**`ConfigId(string configId) string`**

- Replaces a configuration human-readable ID with a generated unique ID.
- In a template, each configuration has a human-readable name, e.g., `my-config`.
- When applying a template, a human-readable ID is replaced with a generated unique ID, e.g., `5038695485`.
- As a result, it is possible to create multiple instances of a template.
- The `ConfigId` function is most commonly used in the [template manifest](/cli/templates/structure/#repository-manifest), but it can also be applied in any Jsonnet file.

For example, you can compose a bucket ID containing a configuration ID as follows:
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

- Replaces a configuration row human-readable ID by a generated unique ID.
- Similar to `ConfigId`, but for configuration rows.

--------------------------------------

**`Input(string inputId) string`**

- Returns the value of the [user input](/cli/templates/structure/inputs/).
- If the input is hidden because the [showIf](/cli/templates/structure/inputs/#show-if) condition was evaluated as `false`:
  - The function returns an empty value for the input type, e.g., `0` for `int`, `false` for `bool`, etc.

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

- Returns `true` if the input has been filled in by the user and `false` if the step has been skipped or `showIf = false`.

--------------------------------------

**`InstanceId() string`**

- Returns the ID of the current template instance.
- E.g., `V1StGXR8IZ5jdHi6BAmyT`
- This function is not supported in the preview endpoint, which is used for simple template configurations that do not have InstanceIDs.

--------------------------------------

**`InstanceIdShort() string`**

- Returns the ID of the current template instance shortened to 8 characters.
- E.g., `V1StGXR8`
- This function is not supported in the preview endpoint, which is used for simple template configurations that do not have InstanceIDs.

--------------------------------------

**`ComponentIsAvailable(string componentId) bool`**

- Returns `true` if the component is available; otherwise, it returns `false`.

--------------------------------------

**`SnowflakeWriterComponentId() string`**

- Returns `componentId` of the Snowflake writer.
  - Returns `keboola.wr-db-snowflake` for AWS stacks.
  - Returns `keboola.wr-snowflake-blob-storage` for Azure stacks.
  - Returns `keboola.wr-db-snowflake-gcs` for GCP stacks and the BigQuery backend.
  - Returns `keboola.wr-db-snowflake-gcs-s3` for GCP stacks and the Snowflake backend.

--------------------------------------

**`HasProjectBackend(backend string) bool`**

- Returns `true` if the backend is available; otherwise, it returns `false`.

--------------------------------------

**`RandomID() string`**

- Returns a random ID truncated to 8 characters.
  

## Next Steps
- [User Inputs](/cli/templates/structure/inputs/)
- [Template Structure](/cli/templates/structure/)
