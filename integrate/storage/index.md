---
title: Storage
permalink: /integrate/storage/
---

* TOC
{:toc}

Storage is the central component of KBC. It stores all the data in 
[**buckets** and **tables**](https://help.keboola.com/storage/) and 
it controls access to the data using **tokens**. All data manipulations are audited 
using **events**.
Apart from that, it also maintains index of all other KBC **components** and
stores their **configurations**. 
All this (and a couple of other things) is available through 
[Storage API (SAPI)](http://docs.keboola.apiary.io/#). Most calls to Storage API require that
you pass a [Storage API Token](https://help.keboola.com/storage/tokens/) with the request. The Storage 
token authorizes access to a specific project and is required regardless of whether you use the bare 
API or any of the clients.

## Storage API clients
We recommend that you use one of our Storage API clients for working with the API. Although
you can work directly with the API, the client does simplify some tasks. There are
a couple of Storage clients available with different feature sets:

- [SAPI PHP client](https://github.com/keboola/storage-api-php-client) - a PHP library, which supports most of 
the features of the Storage API, you need to use it programatically in PHP.
- [SAPI R client](/integrate/stroage/r-client/) - an R library, which most data manipulation features of the Storage API, you
need to use it programatically in R. 
- [SAPI PHP CLI client](https://github.com/keboola/storage-api-cli) - a CLI (command line interface) application which supports basic data manipulation 
features of the Storage API, you can use it from command line, provided that you have PHP interpretter 
available.
- [SAPI Windows CLI client](/integrate/storage/win-cli-client/) - a CLI application which supports basic data manipulation
features, you can use it from Windows command line.

Additional tools:

- [Storage API Console](/intgrate/storage/console/) - a UI to work with KBC storage,
this is accessible for anyone having a Storage Token (does not have to be a KBC project admin) 
- [Table Importer Servvice](/integrate/storage/table-importer/) - a service designed for 
simplified table loads

The choice of client is purely upon you, we recommend that you use the solution which is the most 
straightforward for you.

## Table imports and exports
Tables are imported to Storage and exported from Storage via asynchronous (background) jobs. 
Technically, when importing a table, the actual data is first transported to an Amazon S3 storage
and then bulk loaded into Storage internal database. Similarly, when exporting a table, the data
is first offloaded to an Amazon S3 storage and downloaded from there. While this process is 
much more complicated than a simple file upload or download, it offers betters features for 
manageability and tracability. We recommend that you use on of the above mentioned clients to 
import and export data, because they handle the entire process and you don't need to worry about
the technical details. If all you need is to import data into Storage (e.g. for 
project prototyping), you may 
also use the [Storage Importer Service](/integrate/storage/importer/).
If for some reason, you insist on handling the file uploads/downloads manually,
[read on](/integrate/storage/api/import-export/).
