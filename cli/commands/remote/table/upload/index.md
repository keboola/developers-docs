---
title: Table Upload
permalink: /cli/commands/remote/table/upload/
---

* TOC
{:toc}

**Upload a CSV file to a [table](https://help.keboola.com/storage/tables/).**

```
kbc remote table upload [file] [table] [flags]
```

`file`
: Path and/or name of the source file. If `-`, input is expected from standard input, so the command is pipeable.

`table`
: ID of the destination table.

### Options

`-H, --storage-api-host <string>`
: Keboola Connection instance URL, e.g., `connection.keboola.com`

`--columns <string>`
: Comma-separated list of column names. If present, the first row in the CSV file is not treated as a header.

`--incremental-load`
: Data are either added to existing data in the table or replace the existing data.

`--without-headers`
: States if the CSV file contains headers on the first row or not.

`--name <string>`
: Name of the file to be created

`--primary-key <string>`
: Comma-separated list of columns representing the primary key for the newly created table if the table doesn't exist.

`--tags <string>`
: Comma-separated list of tags for the uploaded file.


[Global Options](/cli/commands/#global-options)

### Examples

Create a table from a CSV file:
```
➜ kbc remote table upload accounts.csv in.c-users.accounts \
  --name accounts.csv
  --tags local-file
  --primary-key Id
File "accounts.csv" uploaded with file id "734370450".
Table "in.c-users.accounts" does not exist, creating it.
Bucket "in.c-users" does not exist, creating it.
Created new table "in.c-users.accounts" from file with id "734370450".
```

## Next Steps

- [All Commands](/cli/commands/)
- [Learn more about Tables](https://help.keboola.com/storage/tables/)
