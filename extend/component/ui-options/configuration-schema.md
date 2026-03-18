---
title: Configuration Schema
permalink: /extend/component/ui-options/configuration-schema/
redirect_from:
    - /extend/registration/configuration-schema/
---

The default input for a component configuration is a JSON text area.

{: .image-popup}
![Generic configuration screenshot](/extend/component/ui-options/configuration.png)

If you define a JSON schema, we are able to display a nice form and
let the user to fill the JSON using a set of defined inputs.

{: .image-popup}
![Configuration schema](/extend/component/ui-options/configuration-schema-1.png)

Using the configuration schema also allows us to validate the user input on frontend.

## Creating Schema

JSON schemas are well documented on the [json-schema.org](https://json-schema.org/) website.

We use [RJSF (React JSON Schema Form)](https://rjsf-team.github.io/react-jsonschema-form/) for rendering schemas
into forms. The schema supports standard JSON Schema properties as well as custom extensions documented
in [UI Element Examples](/extend/component/ui-options/configuration-schema/examples/) and
[Sync Action Examples](/extend/component/ui-options/configuration-schema/sync-action-examples/).

### Supported Formats

The following `format` values are supported in property definitions:

| Format | Type | Description |
|---|---|---|
| `password` | string | Masked password input with show/hide toggle |
| `textarea` | string | Multi-line text area |
| `editor` | string/object | CodeMirror code editor (JSON, SQL, Python, etc.) |
| `date` | string | Date picker input |
| `checkbox` | boolean | Checkbox toggle |
| `radio` | string | Radio button group (requires `enum`) |
| `select` | array | Multi-select dropdown (with `uniqueItems: true`) |
| `trim` | string | Standard text input with automatic whitespace trimming |
| `grid` / `grid-strict` | object | Responsive grid layout for grouped fields |
| `tabs` / `tabs-top` / `categories` | object | Tabbed layout for grouped fields |
| `table` | array | Editable table for arrays of objects |
| `info` | any | Static informational alert (uses `title` as message) |
| `ssh-editor` | object | SSH key/form editor |
| `sync-action` | button | Action button triggering a sync action |
| `test-connection` | button | Connection test button |

### Supported Options

The following `options` keys can be used in property definitions:

| Option | Description |
|---|---|
| `options.async` | Dynamic option loading via sync actions. See [Sync Action Examples](/extend/component/ui-options/configuration-schema/sync-action-examples/). |
| `options.dependencies` | Conditional field visibility based on other field values. See [Dynamic Options](/extend/component/ui-options/configuration-schema/examples/#changing-set-of-options-dynamically-based-on-selection). |
| `options.tags` | Enable tag-style input for multi-select arrays |
| `options.creatable` | Allow user-created values in select dropdowns |
| `options.tooltip` | Help text displayed as a tooltip |
| `options.enum_titles` | Display labels for `enum` values |
| `options.hidden` | Hide the field from the UI |
| `options.collapsed` | Start object sections in collapsed state |
| `options.disable_collapse` | Prevent collapsing of object sections |
| `options.enabled` | Set to `false` to disable a field |
| `options.grid_columns` | Number of grid columns (1–12) in `grid`/`grid-strict` layouts |
| `options.grid_break` | Force a new row in grid layouts |
| `options.editor` | CodeMirror editor options: `mode`, `lineNumbers`, `lint`, `input_height` |
| `options.input_height` | Height for textarea fields (e.g., `"100px"`) |
| `options.inputAttributes` | HTML input attributes (e.g., `placeholder`) |
| `options.only_keys` | SSH editor variant showing only key fields |
| `options.disable_array_add` | Disable adding items to arrays |
| `options.disable_array_delete` | Disable removing items from arrays |
| `options.disable_array_reorder` | Disable reordering items in arrays |

### Example
Let's assume your component accepts the following configuration:

{% highlight json %}

{
    "username": "foo",
    "#password": "baz",
    "dateFrom": "yesterday",
    "dateTo": "today"
}

{% endhighlight %}

This looks like an appropriate form:

{: .image-popup}
![Configuration form](/extend/component/ui-options/form.png)

The form above can be created using this JSON Schema:

{% highlight json %}
{
    "title": "Parameters",
    "type": "object",
    "required": [
        "dateFrom",
        "dateTo",
        "username",
        "#password"
    ],
    "properties": {
        "username": {
            "title": "Username",
            "type": "string",
            "minLength": 1,
            "default": "",
            "propertyOrder": 1
        },
        "#password": {
            "title": "Password",
            "type": "string",
            "format": "password",
            "minLength": 1,
            "default": "",
            "propertyOrder": 2
        },
        "dateFrom": {
            "title": "Date from",
            "type": "string",
            "description": "Any date accepted by strtotime (https://www.php.net/manual/en/function.strtotime.php) function",
            "minLength": 1,
            "default": "",
            "propertyOrder": 3
        },
        "dateTo": {
            "title": "Date to",
            "type": "string",
            "description": "Any date accepted by strtotime (https://www.php.net/manual/en/function.strtotime.php) function",
            "minLength": 1,
            "default": "",
            "propertyOrder": 4
        }
    }
}
{% endhighlight %}

### Links Example
If you want to provide links to external resources, keep in mind that the configuration schema does not support markdown,
but it has a `links` feature. The above example can be modified so that the links are clickable:

{% highlight json %}
{
    "title": "Parameters",
    "type": "object",
    "required": [
        "dateFrom",
        "dateTo",
        "username",
        "#password"
    ],
    "properties": {
        "username": {
            "title": "Username",
            "type": "string",
            "minLength": 1,
            "default": "",
            "propertyOrder": 1
        },
        "#password": {
            "title": "Password",
            "type": "string",
            "format": "password",
            "minLength": 1,
            "default": "",
            "propertyOrder": 2
        },
        "dateFrom": {
            "title": "Date from",
            "type": "string",
            "description": "Any date accepted by the strtotime function",
            "minLength": 1,
            "default": "",
            "propertyOrder": 3,
            "links": [
                {
                    "rel": "strtotime Documentation",
                    "href": "https://www.php.net/manual/en/function.strtotime.php"
                }
            ]
        },
        "dateTo": {
            "title": "Date to",
            "type": "string",
            "description": "Any date accepted by the strtotime function",
            "minLength": 1,
            "default": "",
            "propertyOrder": 4,
            "links": [
                {
                    "rel": "strtotime Documentation",
                    "href": "https://www.php.net/manual/en/function.strtotime.php"
                }
            ]
        }
    }
}
{% endhighlight %}

Which renders like this:

{: .image-popup}
![Configuration Schema with links](/extend/component/ui-options/configuration-schema-2.png)

### Deprecated Features

The following features from the legacy JSON Editor library are **no longer supported**:

- **`enumSource` / `watch`** — Dynamic enum population based on other field values. Use `options.async` with `autoload` instead for cascading dropdowns. See [Sync Action Examples](/extend/component/ui-options/configuration-schema/sync-action-examples/#autoload).
