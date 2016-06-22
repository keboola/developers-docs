

## Working with data
KBC Table Storage (Tables) and KBC File Storage (File Uploads) are heavily connected together.
The KBC File Storage is a technically a layer on top of Amazon S3 service and KBC Table
Storage is a layer on top of a [database backend](https://help.keboola.com/storage/#backends).

Uploading a table therefore means that you need to request a
[file upload](http://docs.keboola.apiary.io/#reference/files/upload-file/upload-arbitrary-file-to-keboola) from
KBC File Storage. Which will give you destination for the uploaded file on an S3 server.
Then you need to upload the file there. When the upload is finished, the data file
will be available in *File Uploads* section. Then you need to initiate
an [asynchronous table import](http://docs.keboola.apiary.io/#reference/tables/load-data-asynchronously/imports-data)
from the uploaded file (use it as `dataFileId` parameter) into destination table. The import
is asynchronous, so the request only creates a job and you need to poll for it's results.
The imported files must conform to the [supported CSV format](http://docs.keboola.apiary.io/#reference/csv-files-formats).

![Schema of file upload process](/integrate/storage/async-import-handling.png)

Exporting a table from storage is analogous to the import. First, data is [asynchronously
exported](http://docs.keboola.apiary.io/#reference/tables/unload-data-asynchronously/asynchronous-export) from
Storage table into File uploads, then you can request [downloading of
the file](http://docs.keboola.apiary.io/#reference/files/manage-files/file-detail), which will give you
access to an S3 server for actual file download.

### Manually uploading a file
To upload a file to KBC file Storage, you have to follow the instructions outlined in the
[API documentation](http://docs.keboola.apiary.io/#reference/files/upload-file/upload-arbitrary-file-to-keboola).
This means that you first need to create a file resource - to create a new file with name
[`new-file.csv`](/intergrate/storage/new-table.csv) and size `52` bytes,
you have to call:

{% highlight bash %}
curl --request POST --header "X-StorageApi-Token:storage-token" --form "name=new-file.csv" --form "sizeBytes=52"  https://connection.keboola.com/v2/storage/files/prepare?federationToken=1
{% endhighlight %}

Which will return a response similar to this:

{% highlight json %}
{
  "id": 192726698,
  "created": "2016-06-22T10:44:35+0200",
  "isPublic": false,
  "isSliced": false,
  "isEncrypted": false,
  "name": "new_file2.csv",
  "url": "https://s3.amazonaws.com/kbc-sapi-files/exp-180/1134/files/2016/06/22/192726697.new_file2?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJ2N244XSWYVVYVLQ%2F20160622%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20160622T084435Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=86136cced74cdf919953cde9e2a0b837bd0b8f147aa6b7b30c2febde3b92d83d",
  "region": "us-east-1",
  "sizeBytes": 52,
  "tags": [],
  "maxAgeDays": 180,
  "runId": null,
  "runIds": [],
  "creatorToken": {
    "id": 53044,
    "description": "ondrej.popelka@keboola.com"
  },
  "uploadParams": {
    "key": "exp-180/1134/files/2016/06/22/192726697.new_file2.csv",
    "bucket": "kbc-sapi-files",
    "acl": "private",
    "credentials": {
      "AccessKeyId": "ASI...H7Q",
      "SecretAccessKey": "QbO...7qu",
      "SessionToken": "Ago...bsF",
      "Expiration": "2016-06-22T20:44:35+00:00"
    }
  }
}
{% endhighlight %}

The important part is `id` of the file, which will be needed later, `uploadParams.credentials` node which gives you credentials to AWS S3 to upload your file and
the `key` and `bucket` nodes, which define the target S3 destination as *s3://`bucket`/`key`*.
To upload the files to S3, you need an S3 client, there are a wide number of clients of available - you can use for example
[S3 AWS command line client](http://docs.aws.amazon.com/cli/latest/userguide/installing.html). Before
you use it, you need to [pass the credentials](http://docs.aws.amazon.com/cli/latest/topic/config-vars.html#credentials), e.g by executing:

on *nix systems:
{% highlight bash %}
export AWS_ACCESS_KEY_ID=ASI...H7Q
export AWS_SECRET_ACCESS_KEY=QbO...7qu
export AWS_SESSION_TOKEN=Ago...wU=
{% endhighlight %}

or on Windows:
{% highlight bash %}
SET AWS_ACCESS_KEY_ID=ASI...H7Q
SET AWS_SECRET_ACCESS_KEY=QbO...7qu
SET AWS_SESSION_TOKEN=Ago...bsF
{% endhighlight %}

Then you can actually upload the file `new-table.csv` by executing the AWS S3 CLI [cp command](http://docs.aws.amazon.com/cli/latest/reference/s3/cp.html):
{% highlight bash %}
aws s3 cp new-table.csv s3://kbc-sapi-files/exp-180/1134/files/2016/06/22/192726697.new_file2.csv
{% endhighlight %}

Then you can import the file into Table Storage, by calling either
[Create Table API call](http://docs.keboola.apiary.io/#reference/tables/create-table-asynchronously/create-new-table-from-csv-file-asynchronously
(for new table) or
[Load Data API call]http://docs.keboola.apiary.io/#reference/tables/load-data-asynchronously/create-new-table-from-csv-file-asynchronously
(for existing table).

curl --request POST --header "X-StorageApi-Token:storage-token" --form "name=new-table" --form "dataFileId=192726698" https://connection.keboola.com/v2/storage/buckets/in.c-main/tables-async

This will create an asynchronous job which will import data from the file `192726698` into a destination table `new-table` in bucket `in.c-main`.
You then have to [poll for the job results](/overview/jobs/#polling), or review its status in the UI.

### Table Importer Service
The process of importing data into Storage tables can be simplified a bit by using the
[*Table Importer*](https://github.com/keboola/sapi-table-importer). The Table importer
is a KBC component, which takes files from KBC File Storage (*File Uploads*) and imports them in Storage tables.
The advantage of Table Importer is that can be configured as part of KBC orchestration.
To use the importer service, you need to create a configuration table for it. The table must be placed in
the bucket `sys.c-table-importer` and its name may be arbitrary. Configuration of a
[sample table](/integrate/storage/sys.c-table-importer.test-config.csv) is shown below:

{: .image-popup}
![Screenshot - Table importer configuration](/integrate/storage/api-table-exporter-setting.png)

Any table in `sys.c-table-importer` bucket can contain any number of rows, each row corresponds to a single destination table and has to have the following columns:
- `table` - Full name of the destination table in storage in format `bucketName`.`tableName`.
- `tag` - Tag of uploaded file which will be converted into the destination table.
- `rowId` - Unique (sequential) identifier of the row.
- `primaryKey` - Optional name of column marked as primary column in the table.
- `incremental` - 0 or 1 for incremental load of the destination table (append data to table).
- `enclosure` - CSV enclosure for strings (by default `"`).
- `delimiter` - CSV delimiter (by default `,`).
- `escapedBy` - CSV escape character for enclosure, leave empty to default to escaping by double enclosure.

You can test the above configuration by uploading a [CSV file](integrate/storage/new-table.csv) into *File Uploads* and assigning a tag `new-data` to it. You
can do so programatically via the API or via the UI.

{: .image-popup}
![Screenshot - File upload Tag](/integrate/storage/api-upload-file.png)

You can then run the configuration by executing the [`run` API call](http://docs.sapitableimporter.apiary.io/#reference/api/importer-run/run-import):

{% highlight bash %}
curl --request POST --header "X-StorageApi-Token:storage-token" https://syrup.keboola.com/table-importer/run
{% endhighlight %}

Which will run the import job and return:
{% highlight json %}
{
  "id": "192637706",
  "url": "https://syrup.keboola.com/queue/job/192637706",
  "status": "waiting"
}
{% endhighlight %}

Then you can [poll for the job status](/overview/jobs/) or review the job progress in UI.
The table importer will take all files with the specified tags (`new-data`) and import them into
the specified table (`in.c-main.new-table`). The Table Importer records the last processed files, so
 that each file is processed only once. Last processed file is recroded in table attributes:

{: .image-popup}
![Screenshot - Table attributes](table-importer-last-processed.png)

### Working with sliced files
Depending on the backend and table size, the data file may be sliced into chunks.
Requirements for uploading sliced files are described in the respective part of the
[API documentation](http://docs.keboola.apiary.io/#reference/files/upload-file/upload-arbitrary-file-to-keboola).
When you attempt too download sliced file, you will instead obtain its manifest which
lists the indivudal parts. You need to download the parts individually and join them
together. For a reference implementation of this process, see
our [TableExporter class](https://github.com/keboola/storage-api-php-client/blob/master/src/Keboola/StorageApi/TableExporter.php).
Also note, that when you export a table throught the *Table* - *Export* UI, the file will
be already merged and not listed in *File Uploads* section.

When you want to download a sliced file, you then need to [obtain credentials](http://docs.keboola.apiary.io/#reference/files/manage-files/file-detail)
to download the file from AWS S3. Assuming, that the file ID is e.g 192611596, you would call:

{% highlight bash %}
curl --header "X-StorageAPI-Token: storage-token" https://connection.keboola.com/v2/storage/files/192611596?federationToken=1
{% endhighlight %}

which will return a response similar to:

{% highlight json %}
{
  "id": 192611596,
  "created": "2016-06-21T15:25:35+0200",
  "name": "in.c-redshift.blog-data.csv",
  "url": "https://s3.amazonaws.com/kbc-sapi-files/exp-30/578/table-exports/in/c-redshift/blog-data/192611594.csvmanifest?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJ2N244XSWYVVYVLQ%2F20160621%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20160621T135137Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=ee69d94f0af06bcf924df0f710dcd92e6503a13c8a11a86be2606552bf9a8b26",
  "region": "us-east-1",
  "sizeBytes": 24541,
  "tags": [
    "table-export"
  ],
  ...
  "s3Path": {
    "bucket": "kbc-sapi-files",
    "key": "exp-30/578/table-exports/in/c-redshift/blog-data/192611594.csv"
  },
  "credentials": {
    "AccessKeyId": "ASI...UQQ",
    "SecretAccessKey": "LHU...HAp",
    "SessionToken": "Ago...uwU=",
    "Expiration": "2016-06-22T01:51:37+00:00"
  }
}
{% endhighlight %}

The field `url` contains the URL to the file manifest. When you download it, you will obtain a JSON file with contents
similar to:

{% highlight json %}
{
  "entries": [
    {"url":"s3://kbc-sapi-files/exp-30/578/table-exports/in/c-redshift/blog-data/192611594.csv0000_part_00"},
    {"url":"s3://kbc-sapi-files/exp-30/578/table-exports/in/c-redshift/blog-data/192611594.csv0001_part_00"}
  ]
}
{% endhighlight %}

Now, you can download the actual data file slices, URLs are are provided in the manifest file, and credentials to them
are returned as part of the previous file info call. To download the files from S3, you need an S3 client, there
are a wide number of clients of available - you can use for example
[S3 AWS command line client](http://docs.aws.amazon.com/cli/latest/userguide/installing.html). Before
you use it, you need to [pass the credentials](http://docs.aws.amazon.com/cli/latest/topic/config-vars.html#credentials), e.g by executing:

on *nix systems:
{% highlight bash %}
export AWS_ACCESS_KEY_ID=ASI...UQQ
export AWS_SECRET_ACCESS_KEY=LHU...HAp
export AWS_SESSION_TOKEN=Ago...wU=
{% endhighlight %}

or on Windows:
{% highlight bash %}
SET AWS_ACCESS_KEY_ID=ASI...UQQ
SET AWS_SECRET_ACCESS_KEY=LHU...HAp
SET AWS_SESSION_TOKEN=Ago...wU=
{% endhighlight %}

Then you can actuall download the files by executing the AWS S3 CLI [cp command](http://docs.aws.amazon.com/cli/latest/reference/s3/cp.html):
{% highlight bash %}
aws s3 cp s3://kbc-sapi-files/exp-30/578/table-exports/in/c-redshift/blog-data/192611594.csv0000_part_00 192611594.csv0000_part_00
aws s3 cp s3://kbc-sapi-files/exp-30/578/table-exports/in/c-redshift/blog-data/192611594.csv0001_part_00 192611594.csv0001_part_00
{% endhighlight %}

Then you need to merge the files together by executing:

on *nix systems:
{% highlight bash %}
cat 192611594.csv0000_part_00 192611594.csv0001_part_00 > merged.csv
{% endhighlight %}

or on Windows:
{% highlight bash %}
copy 192611594.csv0000_part_00 /B +192611594.csv0001_part_00 /B merged2.csv
{% endhighlight %}
