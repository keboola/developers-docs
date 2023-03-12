---
title: Table Import
permalink: /cli/commands/remote/table/import/
---

* TOC
{:toc}

Import data to a table from a Storage file. 

```
kbc remote table import [table] [file] [flags]
```

### Options

`-H, --storage-api-host <string>`
: Keboola Connection instance URL, e.g., `connection.keboola.com`

`--columns <string>`
: Comma separated list of column names. If present, the first row in the CSV file is not treated as a header.

`--incremental-load <bool>`
: Data are either added to existing data in the table or replace the existing data.

`--without-headers <bool>`
: States if the CSV file contains headers on the first row or not.

[Global Options](/cli/commands/#global-options)

### Examples

Preview a table in the terminal:
```
➜ $ cat my.csv | kbc remote table import in.c-main.products 1234567
File with id "1234567" imported to table "in.c-main.products"
```

```
➜ kbc remote table import
? Table: <selection prompt>
? File: <selection prompt>

File with id "1234567" imported to table "in.c-main.products"
```

## Next Steps

- [All Commands](/cli/commands/)
- [Upload files to Storage](/cli/commands/remote/file/upload/)
- [Learn more about Tables](https://help.keboola.com/storage/tables/)
