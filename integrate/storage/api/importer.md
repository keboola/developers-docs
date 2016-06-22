---
title: Storage API Importer
permalink: /integrate/storage/api/importer/
---

* TOC
{:toc}

The [whole process of importing](/integrate/storage/api/) a table into Storage can be simplified with the
Storage API Importer Service
{% comment %}[Storage API Importer Service](https://bitbucket.org/keboola/sapi-importer-bundle){% endcomment %}
Importer Service. The SAPI Importer allows you simply to do a HTTP POST and import a file
into Storage Table.

The HTTP requst must contain form fields `tableId` and `data`. Therefore to
upload a CSV file `new-table.csv` (and replace the contents) into a table `new-table` in bucket `in.c-main`,
you would call:

{% highlight bash %}
curl --request POST --header "X-StorageApi-Token:storage-token" --form "tableId=in.c-main.new-table" --form "data=@new-table.csv" "https://syrup.keboola.com/sapi-importer/run"
{% endhighlight %}

Using the SAPI Importer is the simplest way to upload data into KBC Table Storage (except for
using on of the [API clients](/integrate/storage/#clients)). The disadvantage of is that the whole data file
has to be posted in a single HTTP request. **The maximum limit for file transfer is 45 minutes**.
This means that for substantialy large files (usually more than hundreds of MB)
you may experience timeouts, in which case, you must use the approach outlined above and upload the
files [directly to S3](#manually-uploading-a-file).

## Parameters

- `tableId` (required) Storage Table ID, example: in.c-main.users
- `data` (required) Uploaded CSV file. Raw file or compressed by [gzip](http://www.gzip.org/) or [ZIP](https://en.wikipedia.org/wiki/Zip_(file_format))
- `delimiter` (optional) Field delimiter used in CSV file. Default value is ','. Use '\t' or type the tab char for tabulator.
- `enclosure` (optional) Field enclosure used in CSV file. Default value is '"'.
- `escapedBy` (optional) CSV escape character. Default is empty.
- `incremental` (optional) If incremental is set to 0 target table is truncated before each import. Default is 0.
- `partial` (optional) If partial is set to 1 only some of table columns can be imported. Useful for column updates in combination with incremental.

## Examples
To load data incrementally (append new data to existing contents):

{% highlight bash %}
curl --request POST --header "X-StorageApi-Token:storage-token" --form "incremental=1" --form "tableId=in.c-main.new-table" --form "data=@new-table.csv" "https://syrup.keboola.com/sapi-importer/run"
{% endhighlight %}

To load data with non-default delimiter and enclosure (delimiter is tabulator and enclosure is empty):

{% highlight bash %}
curl --request POST --header "X-StorageApi-Token:storage-token" --form "delimiter=\t" --form "enclosure=" --form "tableId=in.c-main.new-table" --form "data=@new-table.csv" "https://syrup.keboola.com/sapi-importer/run"
{% endhighlight %}

