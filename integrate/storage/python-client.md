---
title: Python Client Library
permalink: /integrate/storage/python-client/
---

* TOC
{:toc}

The Python client library is a [Storage API client](http://docs.keboola.apiary.io/) which you can use in your Python code.
The current implementation supports all basic data manipulations:

- Importing data
- Exporting data
- Creating and deleting buckets and tables
- Creating and deleting workspaces

The client source code is available in our [Github repository](https://github.com/keboola/sapi-python-client/).

## Installation
This library is available on [Github](https://github.com/keboola/sapi-python-client), so we
recommend that you use the `pip` package to install it:

    pip3 install git+https://github.com/keboola/sapi-python-client.git

## Usage
The client contains a `Client` class which encapsulates all API endpoints and hold storage token and URL. Each API endpoint is
represented by its own class (`Files`, `Buckets`, `Jobs`, ...) which can be used standalone if you only work with one endpoint.
This means that the two following examples are equivalent:

{% highlight python %}
from kbcstorage.client import Client

client = Client('https://connection.keboola.com', 'your-token')
client.tables.detail('in.c-demo.some-table')
{% endhighlight %}

{% highlight python %}
from kbcstorage.tables import Tables

tables = Tables('https://connection.keboola.com', 'your-token')
tables.detail('in.c-demo.some-table')
{% endhighlight %}

### Example --- Create a Table and Import Data
To create a new table in Storage, use the `create` function of the `Tables` class. Provide the name of an existing bucket,
the name of the new table and a CSV file with the table's contents.

To create the `new-table` table in the `in.c-main` bucket, use

{% highlight python %}
from kbcstorage.client import Client

client = Client('https://connection.keboola.com', 'your-token')
client.tables.create(name='new-table',
                     bucket_id='in.c-main',
                     file_path='coords.csv',
                     primary_key=['id'])
{% endhighlight %}

The above command will import the contents of the `coords.csv` file into the newly created table. It will
also mark the `id` column as the primary key.

### Example --- Export Data
If you want to export a table from Storage and import it into Python, use the `importTable` function. Provide
the ID (*bucketName.tableName*) of an existing table.

To export data from the `old-table` table in the `in.c-main` bucket, use

{% highlight python %}
from kbcstorage.client import Client
import csv

client = Client('https://connection.keboola.com', 'your-token')
client.tables.export_to_file(table_id='in.c-main.new-table', path_name='.')
with open('./new-table', mode='rt', encoding='utf-8') as in_file:
    lazy_lines = (line.replace('\0', '') for line in in_file)
    reader = csv.reader(lazy_lines, lineterminator='\n')
    for row in reader:
        print(row)
{% endhighlight %}

The above command will export the table from Storage into file `new-table` and read it using
[CSV Reader](https://docs.python.org/3.6/library/csv.html#reader-objects).

### Other Examples

{% highlight python %}
# create a client
client = Client('https://connection.keboola.com', 'your-token')

# create a bucket
client.buckets.create(name='demo', stage='in')

# list buckets
client.buckets.list()

# list all tables
client.tables.list()

# list all tables in a bucket
client.buckets.list_tables(bucket_id='in.c-demo')

# delete a table
client.tables.delete(table_id='in.c-demo.some-table')

# delete a bucket
client.buckets.delete(bucket_id='in.c-main', force=True)

{% endhighlight %}
