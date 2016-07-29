---
title: Storage API Importer
permalink: /integrate/storage/api/importer/
---

* TOC
{:toc}

The [whole process of importing](/integrate/storage/api/) a table into Storage can be simplified with the
Storage API Importer Service 
{% comment %}[Storage API Importer Service](https://bitbucket.org/keboola/sapi-importer-bundle){% endcomment %}. 
The SAPI Importer allows you to make an HTTP POST request and import a file into Storage Table.

The HTTP request must contain the `tableId` and `data` form fields. Therefore to
upload a `new-table.csv` CSV file (and replace the contents) into a `new-table` table in the `in.c-main` bucket,
call:

{% highlight bash %}
curl --request POST --header "X-StorageApi-Token:storage-token" --form "tableId=in.c-main.new-table" --form "data=@new-table.csv" "https://syrup.keboola.com/sapi-importer/run"
{% endhighlight %}

Using the SAPI Importer is the easiest way to upload data into KBC Table Storage (except for
using one of the [API clients](/integrate/storage/#clients)). However, the disadvantage is that the whole data file
has to be posted in a single HTTP request. **The maximum limit for a file transfer is 45 minutes**.
This means that for substantially large files (usually more than hundreds of MB)
you may experience timeouts. If that happens, use the above outlined approach and upload the
files [directly to S3](#manually-uploading-a-file).

## Parameters

- `tableId` (required) Storage Table ID, example: in.c-main.users
- `data` (required) Uploaded CSV file. Raw file or compressed by [gzip](http://www.gzip.org/) or [ZIP](https://en.wikipedia.org/wiki/Zip_(file_format))
- `delimiter` (optional) Field delimiter used in a CSV file. The default value is ' , '. Use '\t' or type the tab char for tabulator.
- `enclosure` (optional) Field enclosure used in a CSV file. The default value is '"'.
- `escapedBy` (optional) CSV escape character; empty by default.
- `incremental` (optional) If incremental is set to 0 (its default), the target table is truncated before each import. 
- `partial` (optional) If partial is set to 1, only some of the table columns can be imported. It is useful for column updates in combination with incremental.

## Examples
To load data incrementally (append new data to existing contents):

{% highlight bash %}
curl --request POST --header "X-StorageApi-Token:storage-token" --form "incremental=1" --form "tableId=in.c-main.new-table" --form "data=@new-table.csv" "https://syrup.keboola.com/sapi-importer/run"
{% endhighlight %}

To load data with a non-default delimiter (tabulator) and enclosure (empty):

{% highlight bash %}
curl --request POST --header "X-StorageApi-Token:storage-token" --form "delimiter=\t" --form "enclosure=" --form "tableId=in.c-main.new-table" --form "data=@new-table.csv" "https://syrup.keboola.com/sapi-importer/run"
{% endhighlight %}

