---
title: Create Table
permalink: /cli/commands/remote/create/table/
---

* TOC
{:toc}

**Create a [table](https://help.keboola.com/storage/tables/) in Keboola Storage.**

```
kbc remote create table [flags]
```

### Options

`--bucket <string>`
: Bucket ID

`--columns <string>`
: Comma-separated list of column names

`--columns-from <string>`
: The path to the table definition file in json

`--name <string>`
: Name of the table

`--primary-key <string>`
: Comma-separated list of columns used as a primary key

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc remote create table

? Select a bucket:  [Use arrows to move, type to filter]
  bucket1 (in.c-bucket1)
> bucket2 (in.c-bucket2)

Enter the table name.
? Table name: my-table

Would you define column types?
? Columns Types Definition: [? for help] (Y/n)
```
If you don't want to define column types, choose `n/N` and enter names of columns
```
Would you define column types?
? Columns Types Definition: No

Enter a comma-separated list of column names.
? Columns: id,name,age

? Select columns for the primary key:  [Use arrows to move, space to select]
> [x]  id
  [ ]  name
  [ ]  age

Created table "in.c-bucket2.my-table".
```
To define column types, choose `y/Y`, then start an editor. 

```
Would you define column types?
? Columns Types Definition: Yes

Columns definition from file
? Columns definition from file: [Enter to launch editor]
```
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

## Next Steps

- [All Commands](/cli/commands/)
- [Create Bucket](/cli/commands/remote/create/bucket/)
- [Table Upload](/cli/commands/remote/table/upload/)
