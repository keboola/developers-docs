---
title: Custom Science PHP
permalink: /extend/custom-science/php/
---

* TOC
{:toc}

So far there are no known limitations to the architecture of your PHP code. Please note:

- The repository of your PHP application must always contain the `main.php` script.
- If set, your application must always produce the tables and files listed in the output mapping (even if the files were empty).

If you are starting with Custom Science, consider going through the
[Quickstart](/extend/custom-science/quick-start/).
You can also have a look at our [example repository](https://github.com/keboola/docs-custom-science-example-php-basic.git).

## Packages
To install a package, create a [`composer.json`](https://getcomposer.org/doc/00-intro.md) file in the root of the repository:

{% highlight json %}
{
    "require": {
        "keboola/csv": "^1.1"
    }
}
{% endhighlight %}

The code is executed in a docker image derived from our [PHP image](https://github.com/keboola/docker-custom-php/blob/master/Dockerfile).
The `composer.json` (and `composer.lock` if present) files will be automatically processed with `composer install` before your application is
run. The composer command will run only if the `composer.json` is present, so it is not required.

## PHP Modules
The following PHP modules (extensions) are available in the PHP installation:
Core, ctype, curl, date, dom, fileinfo, filter, ftp, hash, iconv, json, libxml, mbstring, mysqlnd, openssl, pcre, 
PDO, pdo_sqlite, Phar, posix, readline, Reflection, session, SimpleXML, SPL, sqlite3, standard, tokenizer, 
xml, xmlreader, xmlwriter, zlib.

If you need to enable another built-in PHP extension, please contact us on [support](mailto:support@keboola.com). 
If you need to install [PECL extensions](https://pecl.php.net/), please create your own
[Docker extension](https://developers.keboola.com/extend/docker/) instead of using Custom Science.  

## Reading and Writing Files
Tables from Storage are imported to the PHP script from CSV files. The CSV files can be read by
[our CSV library](https://github.com/keboola/php-csv). We recommend using this library over standard
`fgetcsv` functions. Below is the code for basic reading and writing of files, it is also available in our
[git repository](https://github.com/keboola/docker-custom-php)

{% highlight php %}
<?php

require "vendor/autoload.php";

// read the configuration file
$dataDir = getenv('KBC_DATADIR') . DIRECTORY_SEPARATOR;
$configFile = $dataDir . 'config.json';
$config = json_decode(file_get_contents($configFile), true);

$multiplier = $config['parameters']['multiplier'];

// create output file and write header
$outFile = new \Keboola\Csv\CsvFile(
    $dataDir . 'out' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'destination.csv'
);
$outFile->writeRow(['number', 'someText', 'double_number']);

// read input file and write rows of output file
$inFile = new Keboola\Csv\CsvFile($dataDir . 'in' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'source.csv');
foreach ($inFile as $rowNum => $row) {
    if ($rowNum == 0) {
        // skip header
        continue;
    }
    $outFile->writeRow([
        $row[0],
        $row[1],
        $row[0] * $multiplier
    ]);
}
{% endhighlight %}

The above example shows how to write file line-by-line; this is the most memory-efficient way which
allows you to process data files of any size.

To test the above code, set an ouput mapping to `result.csv` and the following *runtime* configuration:

- Repository: `https://github.com/keboola/docker-custom-php.git`
- Version: `0.0.2`

## Error Handling
An important part of the application is handling errors. By
[the specification](/extend/common-interface/environment/), we assume that command return
code: 0 = no error, 1 = user error (shown to the end-user in KBC), > 1 = application error
(the end-user will receive only a generic message). To implement this, you should wrap your
entire script in `try-catch` statement.

{% highlight php %}
try {

} catch (\InvalidArgumentException $e) {
    echo $e->getMessage();
    exit(1);
} catch (\Throwable) {
    echo $e->getMessage();
    exit(2);
}
{% endhighlight %}

In this case, we consider everything derived from `InvalidArgumentException` to be an error which should be shown to the end-user.
It may be a good idea to create your own exception type for this.
Every other error will lead to a generic message and only developers will see the details. Here we use
the [`Throwable`](http://php.net/manual/en/class.throwable.php) ancestor, which also catches PHP errors. You can, of
course, modify this logic to your liking.
