---
title: Storage API
permalink: /integrate/storage/api/
---

* TOC
{:toc}

For a geneal introduction to working with KBC APIs, see the [API Introduction](/overview/api/).
The [Storage API](http://docs.keboola.apiary.io/) provides a number of functions. The most important are:

- [component configurations](http://docs.keboola.apiary.io/#reference/component-configurations/)
- [storage tables](http://docs.keboola.apiary.io/#reference/tables)
- [file uplads](http://docs.keboola.apiary.io/#reference/files)
- [storage buckets](http://docs.keboola.apiary.io/#reference/buckets)

Virtually all API calls require a [Storage API token](https://help.keboola.com/storage/tokens/) to
be passed as `X-StorageApi-Token` header. Note that the Storage API calls require request to be sent
as `form-data` (unlike the rest of KBC API, which is sent as `application/json`). If you need to
export/import tables from/to Storage, we highly recommend that you use on of the
[available clients](/integrate/storage/) or the [Storage API Importer service](/integrate/storage/api/importer/).

To get started you can continue to:

- [storage importer service for easiest upload of data via API](/integrate/storage/api/importer/)
- [getting started with component configurations](/integrate/storage/api/configurations/)
- [importing and exporting data](/integrate/storage/api/import-export/)
- [TDE exporter for exporting data to Tableu Data Extracts](/integrate/storage/api/tde-exporter/)
