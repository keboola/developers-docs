---
title: Create Bucket
permalink: /cli/commands/remote/create/bucket/
---

* TOC
{:toc}

**Create a new [bucket](https://help.keboola.com/storage/buckets/) in Keboola Storage.**

```
kbc remote create bucket [flags]
```

### Options

`--stage <string>`
: Stage of the bucket, allowed values: `in`, `out`

`--display-name <string>`
: Display name of the bucket for the UI

`--name <string>`
: Name of the bucket

`--description <string>`
: Description of the bucket

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc remote create bucket

? Select a stage for the bucket:  [Use arrows to move, type to filter]
  in
> out
? Select a stage for the bucket: out

Enter a display name for the bucket: Bucket1

Enter a name for the bucket: bucket1

? Enter a description for the bucket: Test description

Created bucket "out.c-bucket1".
```

## Next Steps

- [All Commands](/cli/commands/)
- [Create Configuration](/cli/commands/local/create/config/)
- [Create Configuration Row](/cli/commands/local/create/row/)
