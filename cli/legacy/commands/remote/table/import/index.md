---
title: Table Import
permalink: /cli/legacy/commands/remote/table/import/
redirect_from:
  - /cli/commands/remote/table/import/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

Import data to a table from a Storage file. 

```
kbc remote table import [table] [file] [flags]
```

### Options

`-H, --storage-api-host <string>`
: Keboola instance URL, e.g., `connection.keboola.com`

`--columns <string>`
: Comma-separated list of column names. If present, the first row in the CSV file is not treated as a header.

`--incremental-load <bool>`
: Data are either added to existing data in the table or replace the existing data.

`--file-delimiter <string>`
: Delimiter of the CSV file. Default is `,`.

`--file-enclosure <string>`
: Enclosure of the CSV file. Default is `"`.

`--file-escaped-by <string>`
: Escape character of the CSV file. By default, no escaping is used. (Note: You can specify either the `enclosure` or `escapedBy` parameter, but not both.)

`--file-without-headers`
: States if the CSV file contains headers on the first row or not.

[Global Options](/cli/legacy/commands/#global-options)

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

- [All Commands](/cli/legacy/commands/)
- [Upload files to Storage](/cli/legacy/commands/remote/file/upload/)
- [Learn more about Tables](https://help.keboola.com/storage/tables/)
