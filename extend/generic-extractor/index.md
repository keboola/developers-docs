---
title: Generic Extractor
permalink: /extend/generic-extractor/
---

* TOC
{:toc}

Generic Extractor is a [KBC component](/overview/) which acts like a **customizable 
[HTTP REST](/generic-extractor/tutorial/rest/) client**. It can be configured to extract data from
virtually any *sane* web API. 

Due to the versatility of different APIs running in the wild, Generic Extractor offers a **vast amount 
of configuration options**. Even though it may seem somewhat abstract and hard to understand at first, 
once you configure your first extractor, you will see that it is a great tool. With it you can build 
an entirely new extractor for KBC in **less than an hour**. 

To get started quickly, follow the [tutorial](/extend/generic-extractor/tutorial).

## Generic Extractor Requirements
Generic Extractor allows you to extract data from an API into KBC only by configuring it. 
No programming skills or other tools are required. 

You just need to do two easy things before you start: 

- Learn how to [write JSON](/extend/generic-extractor/tutorial/json/). 
- Have the documentation of your chosen API at hand. The API should be [RESTful](/extend/generic-extractor/tutorial/rest/) 
and, more or less, follow the HTTP specification. 

## Registering Generic Extractor
Each configuration of Generic Extractor can be [registered](/extend/registration/) as 
a new standalone component. For the registration, configurations have to be 
[converted to a template](/extend/generic-extractor/registration/#submission).

It is *not required* to register your Generic Extractor configuration. However, when registered, 
it can be easily used in multiple projects. A great advantage of using templates is that they
are not limiting the configuration at all. You can always switch to JSON 
[freeform configuration](/extend/generic-extractor/registration/#submission) when necessary. 

Also note that templates can be used only with registered configurations of Generic Extractor.

## Generic Extractor Source 
As with any other KBC components, the Generic Extractor source is available on 
[GitHub](https://github.com/keboola/generic-extractor/). Apart from the 
main repository, it uses some vital libraries (which partially define its capabilities):

- [Juicer](https://github.com/keboola/juicer) --- component responsible for processing HTTP JSON responses
- [CSV Map](https://github.com/keboola/php-csvmap) --- library which converts JSON data into CSV tables
- [Filter](https://github.com/keboola/php-filter) --- library which allows to match values together
- [JSON Parser](https://github.com/keboola/php-jsonparser) --- JSON parser which produces CSV tables while maintaining relations

{% comment %}
## Introduction
Generic Extractor allows exporting data from REST APIs not implemented in Keboola Connection or 
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