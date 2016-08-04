---
title: Custom Science PHP
permalink: /extend/custom-science/php/
---

* TOC
{:toc}

Your PHP Custom Science Application can be created in multiple ways (as described below). There are no known
limitations to the architecture of your PHP code. Please note:

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

## Reading and Writing Files
Tables from Storage are imported to the PHP script from CSV files. The CSV files can be read by
[our CSV library](https://github.com/keboola/php-csv). We recommend using this library over standard
`fgetcsv` functions. Below is the code for basic writing of files, it is also available in our
[git repository](https://github.com/keboola/docker-custom-php)

{% highlight php %}
<?php

require "vendor/autoload.php";

// read the configuration file
$configFile = getenv('KBC_DATADIR') . DIRECTORY_SEPARATOR . 'config.json';
$config = json_decode(file_get_contents($configFile), true);

$length = $config['parameters']['length'];
$count = $config['parameters']['count'];

// create output file and write header
$csv = new \Keboola\Csv\CsvFile(
    getenv('KBC_DATADIR') . DIRECTORY_SEPARATOR . 'out' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'result.csv'
);
$csv->writeRow(['id', 'string']);

// generate some roandom rows
for ($i = 0; $i < $count; $i++) {
    $csv->writeRow([
        $i,
        substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, $length),
    ]);
}
{% endhighlight %}

The above example shows how to write file line-by-line; this is the most memory-efficient way which
allows you to process data files of any size.

To test the above code, set an ouput mapping to `result.csv` and the following *runtime* configuration:

- Repository: `https://github.com/keboola/docker-custom-php.git`
- Version: `0.0.1`
