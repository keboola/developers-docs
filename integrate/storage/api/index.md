---
title: Storage API
permalink: /integrate/storage/api/
---

* TOC
{:toc}

If you are new to KBC, you should make yourself familiar with
the [Storage component](https://help.keboola.com/storage/) before you start using it.
For a general introduction to working with KBC APIs, see the [API Introduction](/overview/api/).
[Storage API](https://keboola.docs.apiary.io/) provides a number of functions. These are the most important ones:

- [Component configurations](https://keboola.docs.apiary.io/#reference/component-configurations)
- [Storage tables](https://keboola.docs.apiary.io/#reference/tables)
- [File uploads](https://keboola.docs.apiary.io/#reference/files)
- [Storage buckets](https://keboola.docs.apiary.io/#reference/buckets)

Virtually, all API calls require a [Storage API token](https://help.keboola.com/storage/tokens/) to
be passed as the `X-StorageApi-Token` header.
Please note that the Storage API calls require the request to be sent
as `form-data` (unlike the rest of KBC API, which is sent as `application/json`).

For exporting tables from and importing tables to Storage, we highly recommend that you use one of the
[available clients](/integrate/storage/) or the [Storage API Importer service](/integrate/storage/api/importer/).
All imports and exports are done using CSV files. See
the [RFC4180 Specification](https://tools.ietf.org/html/rfc4180) for the format
and encoding specification, and
[User documentation](https://help.keboola.com/storage/tables/csv-files/) for help on how to create such files.

Continue reading the following sections for guidance on how to get started:

- [Storage importer service for the easiest upload of data via API](/integrate/storage/api/importer/)
- [Getting started with component configurations](/integrate/storage/api/configurations/)
- [Importing and exporting data](/integrate/storage/api/import-export/)
- [TDE exporter for exporting data to Tableau Data Extracts](/integrate/storage/api/tde-exporter/)
