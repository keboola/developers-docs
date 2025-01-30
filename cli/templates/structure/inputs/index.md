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
In the template [Jsonnet files](/cli/templates/structure/jsonnet-files/), inputs are referenced by the [Input function](/cli/templates/structure/jsonnet-files/#functions). 

Inputs are divided into steps and the steps into groups. Each group defines how many steps need to be selected by the user. 
The template needs to contain at least one group with one step. 

## Definition

**Structure of the `inputs.jsonnet` file**:
- `stepsGroups` - array of groups of steps
  - `description` string - group description
  - `required` string, define how many steps need to be selected by the user 
    - one of: `optional`, `exactlyOne`, `atLeastOne`, `zeroOrOne`, `all`
  - `steps` - array of steps within the group
    - `icon` - component or common icon, [read more](#icons) 
    - `name` string - name of the step
    - `description` string - step description
    - `backend` string (optional) - step backend, used to filter transformations for different backends.
    - `dialogName` string - name of the step presented to the user in the UI dialog (`name` is used if empty)
    - `dialogDescription` string - description of the step presented to the user in the UI dialog (`description` is used if empty)
    - `inputs` - array of inputs definitions
      - `id` string - input ID
        - used in [Jsonnet](/cli/templates/structure/jsonnet-files) function `Input`, e.g., `Input("id")`
      - `name` string - input name
      - `description` string - input description
      - `type` string - input data type
        - one of `string`, `int`, `double`, `bool`, `string[]`, `object`
      - `kind` string - input visual style, see below.
      - `default` - default value, must match `type`.
      - `rules` string - comma separated validation rules, [read more](#rules) about syntax
      - `showIf` string - condition when the input should be displayed, [read more](#show-if) about syntax
      - `options` array of options, only for `kind = select/multiselect`
          - `value` string - option value
          - `label` string - option visible name
      - `componentId` string - id of the component to be authorized for, allowed only for `kind = oauth`
      - `oauthInputId` string - id of the linked `kind=oauth` input, allowed only for `kind = oauthAccounts`

**Allowed combinations of `type` and `kind`**:
- Type `string`
  - Kind `input` - one line text
  - Kind `hidden`  - one line text, characters are masked.
  - Kind `textarea` - multi-line text
  - Kind `select` - drop-down list, one option must be selected.
- Type `int`
  - Kind `input` - one line text
- Type `double`
  - Kind `input` - one line text
- Type `bool`
  - Kind `confirm` - yes/no prompt 
- Type `string[]`
  - Kind `multiselect` - drop-down list, multiple options can be selected.
- Type `object`
  - Kind `oauth` - oAuth authorization, also needs `componentId` to be defined.
  - Kind `oauthAccounts` - oAuth accounts selector, also needs `oauthInputId` to be defined.


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

The icon is defined as a string and can have one of these forms:

- `component:<component-id>` eg., `component:keboola.ex-onedrive` - the component icon is used.
- `common:<icon-name>`, eg. `common:upload` - an icon from the predefined set is used
  - these icons are currently supported: `upload`, `download`, `settings`, `import`
  

**Snowflake writer (data destination) component ID differs** on AWS, Azure and GCP stacks because staging storage differs.

- Component ID `keboola.wr-db-snowflake` is used for AWS stacks.
- Component ID `keboola.wr-snowflake-blob-storage` is used for Azure stacks.
- Component ID `keboola.wr-db-snowflake-gcs` is used for GCP and the BigQuery backend.
- Component ID `keboola.wr-db-snowflake-gcs-s3` is used for GCP and the Snowflake backend.
- Please use:
  - Placeholder `"<keboola.wr-snowflake>"` in the `inputs.jsonnet` for a field `icon`.

### Rules

Each user input can have validation `rules`.
- Rules are separated by `,`.
- Rule parameters are separated by `=`.
- E.g.. the rule `required,min=0` specifies that value cannot be empty and must be `0` or more.
- Rules are interpreted by the [go-playground/validator](https://pkg.go.dev/github.com/go-playground/validator) library.
- See the full [list of available rules](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Required).

### Show If

Each user input can have the `showIf` condition.
- It can be used to show/hide the input based on the previous values.
- The value of a previous input is referenced by `[<input-id>]`.
- E.g., the condition `[some-previous-input] == 'value'` specifies that the input will be displayed only if the previous input `some-previous-input` has the value `value`.
- Condition is interpreted by the [Knetic/govaluate](https://github.com/Knetic/govaluate) library.
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

Value is edited in the editor defined by the `EDITOR` or `VISUAL` environment variable.

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

#### oAuth Authorization

The OAuth authorization input (`kind=oauth`) is fully supported only in the UI.
It can be used for any component that supports oAuth authorization, see `componentId` field.
If you use a template containing `oauth` input in the CLI, it will leave
an empty value. Links to configurations that need to be authorized additionally will be printed at the end.

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

The template generated configurations that need oAuth authorization. Please follow the links and complete the setup:
- https://connection.keboola.com/admin/projects/123/components/ex-generic-v2/456789
```


#### oAuth Accounts

The OAuth accounts input (`kind=oauthAccounts`) is fully supported only in the UI.
In the CLI, it will leave an empty value.
It is an additional input to the `kind=oauth` input, they are linked by `oauthInputId` field.
It allows selection of user accounts, as an oAuth account can have access to multiple accounts.

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


OAuth Accounts input can only be used with the components listed below:

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
