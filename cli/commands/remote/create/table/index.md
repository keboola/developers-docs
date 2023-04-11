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

`--name <string>`
: Name of the table

`--primary-key <string>`
: Comma-separated list of columns used as primary key

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc remote create table

? Select a bucket:  [Use arrows to move, type to filter]
  bucket1 (in.c-bucket1)
> bucket2 (in.c-bucket2)

Enter the table name.
? Table name: my-table

Enter a comma-separated list of column names.
? Columns: id,name,age

? Select columns for primary key:  [Use arrows to move, space to select]
> [x]  id
  [ ]  name
  [ ]  age

Created table "in.c-bucket2.my-table".
```

## Next Steps

- [All Commands](/cli/commands/)
- [Create Bucket](/cli/commands/remote/create/bucket/)
- [Table Upload](/cli/commands/remote/table/upload/)
