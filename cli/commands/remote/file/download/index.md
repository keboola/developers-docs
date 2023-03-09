---
title: File Download
permalink: /cli/commands/remote/file/download/
---

* TOC
  {:toc}

**Download a [file](https://help.keboola.com/storage/files/) from Storage.**

```
kbc remote file download [id] [flags]
```

### Options

`-H, --storage-api-host <string>`
: Keboola Connection instance URL, e.g., `connection.keboola.com`

`-o, --output <string>`
: Path and/or name of the destination file (if the file is not sliced) or directory (if the file is sliced). If `-`, output goes to `stdout` without any extra text, so the command is pipeable.

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ $ kbc remote file download 1234567 -o name
File "1234567" downloaded to "name.csv".
```

If you don't specify the file ID, the command will let you select a file by name. 
```
➜ $ kbc remote file download
? File: <selection prompt>
? Enter a name for the destination: 

File "1234567" downloaded to "name.csv"
```

If you specify `-` as output, the file will be printed to standard output. 
```
➜ kbc remote file download 1234567 -o -
col1,col2,col3
val1,val2,val3
...
```

## Next Steps

- [All Commands](/cli/commands/)
- [Learn more about Files Storage](https://help.keboola.com/storage/files/)