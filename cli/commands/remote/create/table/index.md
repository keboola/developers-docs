---
title: Create Table
permalink: /cli/commands/remote/create/table/
---

* TOC
{:toc}

To create a [table](https://help.keboola.com/storage/tables/) in Keboola Storage directly from the command line interface, use the following command:

```
kbc remote create table [flags]
```

### Options

`--bucket <string>`
: Specifies the bucket ID where the table will be created.

`--columns <string>`
: Defines a comma-separated list of column names for the table.

`--columns-from <string>`
: Indicates the path to the table definition file in JSON format.

`--name <string>`
: Sets the name of the new table.

`--primary-key <string>`
: Determines a comma-separated list of columns to be used as the primary key.

[Global Options](/cli/commands/#global-options)

### Usage Examples

**Creating a table without defining column types:**

```
➜ kbc remote create table

? Select a bucket:  [Use arrows to move, type to filter]
  bucket1 (in.c-bucket1)
> bucket2 (in.c-bucket2)

Enter the table name.
? Table name: my-table

Want to define column types?
? Columns Types Definition: [? for help] (Y/n)
```
If you want to skip defining column types, select `n/N` when prompted and enter the names of the columns.
```
Want to define column types?
? Columns Types Definition: No

Enter a comma-separated list of column names.
? Columns: id,name,age

? Select columns for the primary key:  [Use arrows to move, space to select]
> [x]  id
  [ ]  name
  [ ]  age

Created table "in.c-bucket2.my-table".
```
**Defining column types:**

To define column types, select `y/Y`. Then, start an editor. 

```
Want to define column types?
? Columns Types Definition: Yes

Columns definition from file
? Columns definition from file: [Enter to launch editor]
```
**Edit the YAML file in the editor:**

Edit or replace this part of the text with your definition. Keep the same format. Then save your changes and close the editor.

```
- name: id
  definition:
    type: VARCHAR
  basetype: STRING
- name: name
  definition:
    type: VARCHAR
  basetype: STRING
```
```
Columns definition from file
? Columns definition from file: <Received>

? Select columns for the primary key:  [Use arrows to move, space to select]
> [x]  id
  [ ]  name

Created table "in.c-bucket2.my-table".
```
**Defining column types using a JSON file:**

```
kbc remote create table --columns-from <definition.json> [flags]
```
Example JSON file:
```json
[
    {
      "name": "id",
      "definition": {
        "type": "VARCHAR"
      },
      "basetype": "STRING"
    },
    {
      "name": "name",
      "definition": {
        "type": "VARCHAR"
      },
      "basetype": "STRING"
    }
]
```



## Next Steps

- [All Commands](/cli/commands/)
- [Create a Bucket](/cli/commands/remote/create/bucket/)
- [Table Upload](/cli/commands/remote/table/upload/)
