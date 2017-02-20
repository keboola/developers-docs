---
title: Generic Extractor
permalink: /extend/generic-extractor/
---

Generic Extractor is a [KBC component](/overview/) which acts like a customizable 
[HTTP REST](/generic-extractor/tutorial/rest/) client. This means that it can be configured to extract data from
virtually any *sane* web API. Due to versatility of different APIs running in the wild, 
Generic Extractor offers a vast amount of configuration options. This may make it 
look somewhat abstract and hard to understand at first sight, but once you configure
your first extractor, you'll see that is a great tool. With generic extractor you can
build an entirely new extractor for KBC in less than an hour. 
To get started quickly, you can follow the [tutorial](/extend/generic-extractor/tutorial).

## Generic Extractor requirements
Using generic extractor you can extract data from an API into KBC only by configuring it. 
Generic extractor requires no programming skills or other tools, you only 
need to know how to write [JSON](/extend/generic-extractor/tutorial/json/). 
Also you should have the documentation of your chosen API at hand and that API should
be [RESTful](/extend/generic-extractor/tutorial/rest/) and more or less follow the HTTP specification. 

## Registering Generic Extractor
A configuration of Generic Extractor can be [registered](/extend/registration/) as 
a new standalone component. For the registration, the configuration of 
generic extractor has to be [converted to template](todo).

It is *not required* to register your generic extractor configuration, but when registered, 
it may be used in multiple projects easily. A great advantage of using templates is that they
are not limiting the configuration at all, since you can always switch to JSON [freeform 
configuration](todo) when necessary. Also note that templates can be used only with registered
configurations of generic extractor.

## Generic Extractor Source 
As with any other KBC components, Generic Extractor source is available on 
[GitHub](https://github.com/keboola/generic-extractor/). Apart from the 
main repository, it uses some vital libraries (which partially define its capabilities):

- [Juicer](https://github.com/keboola/juicer) - a component responsible for processing HTTP JSON responses
- [CSV Map](https://github.com/keboola/php-csvmap) - a library which converts JSON data into CSV tables
- [Filter](https://github.com/keboola/php-filter) - a library which allows to match values together
- [JSON Parser](https://github.com/keboola/php-jsonparser) - a JSON parser which produces CSV tables while maintaining relations

{% comment %}
## Introduction
Generic extractor allows exporting data from REST APIs not implemented in Keboola Connection or 
creating custom configurations to export any data from any REST API.

## Configuration
The configuration consists of 2 main parts:

- `api`
    - Defines the basic API characteristics, such as pagination, authentication, base URL etc
    - [Documentation](/extend/generic-extractor/api/)
- `config`
    - This part defines the configuration itself - resources from the API, authentication credentials, ...
    - Each resource is a "job" within the extractor, and can contain children for recursive API calls (eg tickets > comments for each ticket)
    - [Documentation](/extend/generic-extractor/config/)
{% endcomment %}