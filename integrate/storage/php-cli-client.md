---
title: Storage PHP CLI Client
permalink: /integrate/storage/php-cli-client/
---

* TOC
{:toc}

The Storage API PHP command line interface (CLI) client is a portable command line client which provides
a simple implementation of [Storage API](http://docs.keboola.apiary.io/). 
It runs on any platform which has PHP CLI installed.

Currently, the client implements 

- functions for exporting and importing tables; 
- functions for creating and deleting buckets; and additionally,
- the [project backup feature](https://help.keboola.com/management/project-export/).

The client source is available in our [Github repository](https://github.com/keboola/storage-api-cli).

## Installation
<a href='https://s3.amazonaws.com/keboola-storage-api-cli/builds/sapi-client.phar' download>Download the latest version</a>.

You may place the downloaded file anywhere that will make it easy for you to access
(such as `/usr/local/bin`). If you use *nix platform, you need to `chmod` the file
`chmod 755 composer.phar`. You may rename it to `sapi-client` to avoid having to type the .phar
extension every time.

Storage API CLI requires PHP 5.5 or newer.

- For PHP 5.4 use
<a href='https://s3.amazonaws.com/keboola-storage-api-cli/builds/sapi-client.0.2.9.phar' download>version 0.2.9</a>.
(5.4 version is no longer supported)
- For PHP 5.3 use
<a href='https://s3.amazonaws.com/keboola-storage-api-cli/builds/sapi-client.0.1.9.phar' download>version 0.1.9</a>.

## Running the Client
To print available commands (assuming that the current directory is the directory you installed the client to), run
{% highlight bash %}
php sapi-client.phar
{% endhighlight %}


### Example - Create a table
To create a new table in Storage, use the `create-table` command. Provide the name of an
existing bucket, the name of the new table and a CSV file with the table's contents.

To create the`new-table` table in the `in.c-main` bucket, use

{% highlight bash %}
php sapi-client.phar create-table in.c-main new-table new-table.csv --token=storage_token
{% endhighlight %}

The above command will import the contents of `new-table.csv` in the current directory into the newly
created table. You should see an output similar to this one:

    Authorized as: ondrej.popelka@keboola.com (Odinuv Sandbox)
    Bucket found ok
    Table create start
    Table create end
    Table id: in.c-main.new-table

### Example - Importing Data
If you want only to import new data into the table, use the `write-table` command and provide
the ID (*bucketName.tableName*) of an existing table.

To import data into the `new-table` table in the `in.c-main` bucket, use

{% highlight bash %}
php sapi-client.phar write-table in.c-main.new-table new-data.csv --token=storage_token --incremental
{% endhighlight %}

The above command will import the contents of the `new-data.csv` file into the existing table. If the
`--incremental` parameter is supplied, the table contents will be appended. If the parameter is not
supplied, the table contents will be overwritten. You should see an output similar to this one:

    Authorized as: ondrej.popelka@keboola.com (Tutorial)
    Table found ok
    Import start
    Import done in 17 secs.

    Results:
    transaction:
    warnings:
    importedColumns:
        - id
        - secondCol
    totalRowsCount: 8
    totalDataSizeBytes: 4096


### Example - Exporting Data
If you want to export a table from Storage, use the `export-table` command. Provide
the ID (*bucketName.tableName*) of an existing table.

To export data from the `old-table` table in `in.c-main` bucket, use

{% highlight bash %}
sapi-client export-table in.c-main.old-table old-data.csv --token=storage_token
{% endhighlight %}

The above command will export the table from Storage and save it as `old-data.csv` in
the current directory. You should see an output similar to this one:

    Authorized as: ondrej.popelka@keboola.com (Tutorial)
    Table found ok
    Export done in 17 secs.

