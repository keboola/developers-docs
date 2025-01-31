---
title: Templates Inputs
permalink: /cli/templates/structure/inputs/
---

* TOC
{:toc}

All user inputs are defined in  
[repository](/cli/templates/structure/#repository) / 
[template](/cli/templates/structure/#template) / 
[version](/cli/templates/structure/#versioning) / 
`src` / 
`inputs.jsonnet`.

Users must fill in these inputs before the template is applied.
In the template [Jsonnet files](/cli/templates/structure/jsonnet-files/), inputs are referenced using the [Input function](/cli/templates/structure/jsonnet-files/#functions). 

Inputs are divided into steps, and steps are grouped into groups. Each group defines how many steps the user must select. 
A template must contain at least one group with one step. 

## Definition

**Structure of the `inputs.jsonnet` file**:
- `stepsGroups` – an array of step groups
  - `description` string – group description
  - `required` string – define how many steps must be selected by the user 
    - One of: `optional`, `exactlyOne`, `atLeastOne`, `zeroOrOne`, `all`
  - `steps` – an array of steps within the group
    - `icon` – component or common icon, [read more](#icons) 
    - `name` (string) – step name
    - `description` (string) – step description
    - `backend` string (optional) – step backend, used to filter transformations for different backends
    - `dialogName` (string) – name of the step presented to the user in the UI dialog (`name` is used if empty)
    - `dialogDescription` (string) – step description as presented to the user in the UI dialog (`description` is used if empty)
    - `inputs` – an array of input definitions
      - `id` string – input ID
        - Used in [Jsonnet](/cli/templates/structure/jsonnet-files) function `Input`, e.g., `Input("id")`
      - `name` string – input name
      - `description` (string) – input description
      - `type` string – input data type
        - One of: `string`, `int`, `double`, `bool`, `string[]`, `object`
      - `kind` (string) – input visual style, see below
      - `default` – default value (must match `type`)
      - `rules` (string) – comma-separated validation rules, [read more](#rules) about syntax
      - `showIf` (string) – condition for displaying the input, [read more](#show-if) about syntax
      - `options` – an array of selectable options (only for `kind = select/multiselect`)
          - `value` (string) – option value
          - `label` (string) – visible option name
      - `componentId` (string) – ID of the component to be authorized for (allowed only for `kind = oauth`)
      - `oauthInputId` (string) – ID of the linked `kind=oauth` input (allowed only for `kind = oauthAccounts`)

**Allowed combinations of `type` and `kind`**:
- Type `string`
  - Kind `input` – single-line text
  - Kind `hidden` – single-line text with masked characters
  - Kind `textarea` – multi-line text
  - Kind `select` – drop-down list (one option must be selected)
- Type `int`
  - Kind `input` – single-line text
- Type `double`
  - Kind `input` – single-line text
- Type `bool`
  - Kind `confirm` – yes/no prompt 
- Type `string[]`
  - Kind `multiselect` – drop-down list (multiple options can be selected)
- Type `object`
  - Kind `oauth` – OAuth authorization (requires `componentId`)
  - Kind `oauthAccounts` – OAuth account selector (requires `oauthInputId`)


**Example of `inputs.jsonnet`**:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: "api-base-url",
              name: "Api Url",
              description: "Please enter URL of your API.",
              type: "string",
              kind: "input",
              default: "https://jsonplaceholder.typicode.com/todos/1",
            },
          ]
        }
      ]
    }
  ]
}
```

### Icons

There are several places where the template author can specify an icon to be displayed in the UI. For security reasons,
it is not possible to load images from external sites.

The icon is defined as a string and can take one of the following forms:

- `component:<component-id>` e.g., `component:keboola.ex-onedrive` (uses the component icon).
- `common:<icon-name>`, e.g., `common:upload` (uses an icon from the predefined set).
  - Supported icons: `upload`, `download`, `settings`, `import`
  
**The Snowflake writer (data destination) component ID differs** accross AWS, Azure, and GCP stacks due to variations in staging storage.

AWS stacks: `keboola.wr-db-snowflake`
Azure stacks: `keboola.wr-snowflake-blob-storage`
GCP stacks (BigQuery backend): `keboola.wr-db-snowflake-gcs`
GCP stacks (Snowflake backend): `keboola.wr-db-snowflake-gcs-s3`
- Use the placeholder `"<keboola.wr-snowflake>"` in `inputs.jsonnet` for the `icon` field.

### Rules

Each user input can have validation `rules`.
- Rules are separated by `,`.
- Rule parameters are separated by `=`.
- Example: The rule `required,min=0` specifies that the value cannot be empty and must be `0` or more.
- Rules are interpreted by the [go-playground/validator](https://pkg.go.dev/github.com/go-playground/validator) library.
- See the full [list of available rules](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Required).

### Show If

Each user input can have a `showIf` condition, allowing inputs to be dynamically shown or hidden based on previous values.
- The value of a previous input is referenced by `[<input-id>]`.
- Example: The condition `[some-previous-input] == 'value'` means that the input will only be displayed if `some-previous-input` has the value `value`.
- The condition is interpreted by the [Knetic/govaluate](https://github.com/Knetic/govaluate) library.
- See available [operators and types](https://github.com/Knetic/govaluate/blob/master/MANUAL.md#operators).

## Example Inputs

#### String Input

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-string',
              name: 'My String',
              description: 'Input Description',
              type: 'string',
              kind: 'input',
              rules: 'required',
              default: 'default value',
              showIf: "[some-previous-input] == 'value'",
            },
          ]
        }
      ]
    }
  ]
}
```

CLI dialog:
```
Input Description
? My String: (default value) foo bar
```

#### String Hidden

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-string',
              name: 'My String',
              description: 'Input Description',
              type: 'string',
              kind: 'hidden',
              rules: 'required',
              showIf: "[some-previous-input] == 'value'",
            },
          ]
        }
      ]
    }
  ]
}
```

CLI dialog:
```
Input Description
? My String: **********
```

#### String Textarea

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-string',
              name: 'My String',
              description: 'Input Description',
              type: 'string',
              kind: 'textarea',
              rules: 'required',
              default: 'default value',
              showIf: "[some-previous-input] == 'value'",
            },
          ]
        }
      ]
    }
  ]
}
```

CLI dialog:
```
Input Description
? My String: [Enter to launch editor]
```

The value is edited in the editor defined by the `EDITOR` or `VISUAL` environment variable.

#### String Select

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-string',
              name: 'My String',
              description: 'Input Description',
              type: 'string',
              kind: 'select',
              rules: 'required',
              default: 'value2',
              showIf: "[some-previous-input] == 'value'",
              options: [
                {
                  value: 'value1',
                  label: 'Name 1',
                },
                {
                  value: 'value2',
                  label: 'Name 2',
                },
                {
                  value: 'value3',
                  label: 'Name 3',
                },
              ],
            },
          ]
        }
      ]
    }
  ]
}
```

CLI dialog:
```
Input Description
? My String:  [Use arrows to move, type to filter]
  Name 1
> Name 2
  Name 3
```

#### Int Input

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-int',
              name: 'My Int',
              description: 'Input Description',
              type: 'int',
              kind: 'input',
              rules: 'required',
              default: 123,
              showIf: "[some-previous-input] == 456",
            },
          ]
        }
      ]
    }
  ]
}
```

CLI dialog:
```
Input Description
? My Int: (123) 789
```


#### Double Input

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-double',
              name: 'My Double',
              description: 'Input Description',
              type: 'double',
              kind: 'input',
              rules: 'required',
              default: 123.45,
              showIf: "[some-previous-input] == 456.78",
            },
          ]
        }
      ]
    }
  ]
}
```

CLI dialog:
```
Input Description
? My Double: (123.45) 789.12
```

#### Bool Confirm

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-bool',
              name: 'My Bool',
              description: 'Input Description',
              type: 'bool',
              kind: 'confirm',
              rules: 'required',
              default: true,
              showIf: "[some-previous-input] == true",
            },
          ]
        }
      ]
    }
  ]
}
```

CLI dialog:
```
Input Description
? My Bool: (Y/n)
```

#### String[] Multiselect

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-string-array',
              name: 'String Values',
              description: 'Input Description',
              type: 'string[]',
              kind: 'multiselect',
              rules: 'required',
              default: ['value2', 'value3'],
              options: [
                {
                  value: 'value1',
                  label: 'Name 1',
                },
                {
                  value: 'value2',
                  label: 'Name 2',
                },
                {
                  value: 'value3',
                  label: 'Name 3',
                },
              ],
            },
            },
          ]
        }
      ]
    }
  ]
}
```

CLI dialog:
```
Input Description
? String Values:  [Use arrows to move, space to select, <right> to all, <left> to none, type to filter]
> [ ]  Name 1
  [x]  Name 2
  [x]  Name 3
```

#### OAuth authorization

The OAuth authorization input (`kind=oauth`) is fully supported only in the UI.
- It can be used for any component that supports OAuth authorization (see the `componentId` field).
- If a template containing an `oauth` input is used in the CLI, it will leave the value empty.
- Links to configurations that require additional authorization will be printed at the end.

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Data extraction",
      required: "all",
      steps: [
        {
          name: "Awesome API",
          description: "Data extraction from Awesome API",
          inputs: [
            {
              id: 'my-oauth',
              name: 'oAuth',
              description: 'oAuth Authorization',
              type: 'object',
              kind: 'oauth',
              componentId: 'keboola.ex-google-ads'
            },
          ]
        }
      ]
    }
  ]
}
```

Input usage in a `config.jsonnet`:
```jsonnet
{
  authorization: {
    oauth_api: Input("my-oauth"),
  },
}
```

CLI output:
```
Template "keboola/my-template-id/1.2.3" has been applied, instance ID: inst12345

The template generated configurations that need OAuth authorization. Please follow the links and complete the setup:
- https://connection.keboola.com/admin/projects/123/components/ex-generic-v2/456789
```


#### OAuth accounts

The OAuth accounts input (`kind=oauthAccounts`) is fully supported only in the UI.
- In the CLI, it will leave the value empty.
- It is an additional input linked to the `kind=oauth` input via the `oauthInputId` field.
- It allows users to select specific accounts, as an OAuth account may have access to multiple accounts.

Definition in `inputs.jsonnet`:
```jsonnet
{
  stepsGroups: [
    {
      description: "Instagram",
      required: "all",
      steps: [
        {
          name: "Instagram",
          description: "Data extraction from Instagram",
          inputs: [
            {
              {
                id: "my-oauth",
                name: "Instagram oAuth",
                description: "Instagram Authorization",
                type: "object",
                kind: "oauth",
                componentId: "keboola.ex-instagram",
              },
              {
                id: "my-oauth-accounts",
                name: "Instagram Profiles",
                description: "Instagram Profiles",
                type: "object",
                kind: "oauthAccounts",
                oauthInputId: "my-oauth",
              },
          ]
        }
      ]
    }
  ]
}
```

Inputs usage in a `config.jsonnet`:
```jsonnet
{
  authorization: {
    oauth_api: Input("my-oauth"),
  },
  parameters: Input("my-oauth-accounts") + {
    other1: "value1",
    other2: "value2",
  }
}
```


The OAuth accounts input can only be used with the components listed below:

##### keboola.ex-google-analytics-v4

Example value for `profiles` mode:
```json
{
  "profiles": [
    {
      "id": "PROFILE_ID",
      "name": "All Web Site Data",
      "webPropertyId": "WEB_PROPORTY_ID",
      "webPropertyName": "WEB_PROPRTY_NAME",
      "accountId": "ACCOUNT_ID",
      "accountName": "ACCOUNT_NAME"
    }
  ]
}
```

Example value for `properties` mode:
```json
{
  "properties": [
    {
      "accountKey": "accounts/ACCOUNT_ID",
      "accountName": "ACCOUNT_NAME",
      "propertyKey": "properties/PROPERTY_ID",
      "propertyName": "PROPERTY_NAME"
    }
  ]
}
```

##### keboola.ex-google-ads

Example value:
```json
{
  "customerId": ["1234abcd"],
  "onlyEnabledCustomers": true
}
```

##### keboola.ex-facebook-ads

Example value:
```json
{
  "accounts": {
    "act_12345678": {
      "account_id": "12345678",
      "business_name": "",
      "currency": "CZK",
      "id": "act_12345678",
      "name": "Jane Doe"
    }
  }
}
```

##### keboola.ex-facebook

Example value:
```json
{
  "accounts": {
    "123456789101112": {
      "category": "Just for fun",
      "category_list": [
        {
          "id": "9876543210000",
          "name": "Just for fun"
        }
      ],
      "name": "PAGE_NAME",
      "id": "123456789101112",
      "tasks": [
        "ANALYZE",
        "ADVERTISE",
        "MODERATE",
        "CREATE_CONTENT",
        "MANAGE"
      ]
    }
  }
}
```

##### keboola.ex-instagram

Example value:
```json
{
  "accounts": {
    "123456789101112": {
      "category": "Musician/Band",
      "fb_page_id": "9876543210000",
      "id": "123456789101112",
      "name": "Entita"
    }
  }
}
```

## Next Steps
- [Jsonnet Files](/cli/templates/structure/jsonnet-files)
- [Template Structure](/cli/templates/structure)
