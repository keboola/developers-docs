---
title: Templates Inputs
permalink: /cli/templates/structure/inputs/
---

* TOC
{:toc}

**Warning: "templates" is an experimental feature.**

All user inputs are defined in  
[repository](/cli/templates/structure/#repository) / 
[template](/cli/templates/structure/#template) / 
[version](/cli/templates/structure/#versioning) / 
`src` / 
`inputs.jsonnet`.

Users must fill in these inputs before the template is applied.
In the template [Jsonnet files](/cli/templates/structure/jsonnet-files/), inputs are referenced by the [Input function](/cli/templates/structure/jsonnet-files/#functions). 

## Definition

**Structure of the `inputs.jsonnet` file**:
- `inputs` - array of inputs definitions
    - `id` string - input ID
      - used in [Jsonnet](/cli/templates/structure/jsonnet-files) function `Input`, e.g., `Input("id")`
    - `name` string - input name
    - `description` string - input description
    - `type` string - input data type
      - one of `string`, `int`, `double`, `bool`, `string[]`
    - `kind` string - input visual style, see bellow.
    - `default` - default value, must match `type`.
    - `rules` string - comma separated validation rules, [read more](#rules) about syntax.
    - `showIf` string - condition when the input should be displayed, [read more](#show-if) about syntax.
    - `options` array of options, only for `kind = select/multiselect`
        - `id` string - option value
        - `name` string - option visible name

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


**Example of `inputs.jsonnet`**:
```jsonnet
{
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
```

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
          id: 'value1',
          name: 'Name 1',
        },
        {
          id: 'value2',
          name: 'Name 2',
        },
        {
          id: 'value3',
          name: 'Name 3',
        },
      ],
    },
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
          id: 'value1',
          name: 'Name 1',
        },
        {
          id: 'value2',
          name: 'Name 2',
        },
        {
          id: 'value3',
          name: 'Name 3',
        },
      ],
    },
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

## Next Steps
- [Jsonnet Files](/cli/templates/structure/jsonnet-files)
- [Template Structure](/cli/templates/structure)
