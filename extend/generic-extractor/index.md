---
title: Generic Extractor
permalink: /extend/generic-extractor/
---

Generic Extractor is a [KBC component](/overview/) which acts like a customizable 
[HTTP REST](todo) client. This means that it can be configured to extract data from
virtually any sane API. Due to versatility of different APIs running in the wild, 
Generic Extractor offers a vast amount of configuration options. This may make it 
look somewhat abstract and hard to understand at first sight, but once you configure
your first extractor, you'll see that is a great tool. With generic extractor you can
build an entirely new extractor for KBC in less than an hour. 
To get started quickly, you can follow the [tutorial](/extend/generic-extractor/tutorial).

pojmy
- endpoint
- api
- rest

## Generic Extractor requirements
Using generic extractor you can extract data from some [REST API](todo) into KBC only by
configuring it. Generic extractor requires no programming skills, you only 
need to know how to write [JSON](todo). 
Also you should have the documentation of your chosen API at hand and that API should
be [RESTful](todo). That means that the API should have API endpoints representing
resources and subresources and that the API reponds to HTTP GET requests - it does not
send any PUT/POST/DELETE requests - which means that the API must not:
- modify data on GET
- require a PUT/POST/DELETE to obtain data

Also the API response must be either a CSV data or JSON data.

TODO priklad api

## Registering Generic Extractor
A configuration of Generic Extractor can be [registered](/extend/registration/) as 
a new standalone component. For the registration we require a working (one or more) configurations.
The working configurations can be converted to templates, so the new extractor may 
serve multiple API endpoints withing a single component. [TODO prikld](TODO).

It is not required to registrer your generic extractor configuration as a new component, but
there are some advantages. When your configuration is registered, it may be used in multiple
projects easily and it may be converted to templates.  
A great advantage of using templates is that they are not limiting the use at all, since you may still
switch to JSON freeform configuration when necessary [TODO obrazek](todo). To be able to use templates, your GE
configuration must be registered.

## Generic Extractor Source 
As with any other KBC components, Generic Extractor source is available on [github](todo). Apart from the 
main repository, it uses some vital librariries (which partially define its capabilities):

- [juicer](todo) - a component reponsible for processing HTTP JSON responses
- [csvmap](todo) - a library which converts JSON data into CSV tables
- [phpfilter](todo) - a library which allows to match values together
- [jsonparser](todo) - a JSON parser which produces CSV tables while maintaining relations

Generic extractor also allows to use some customized modules [todo](todo). However these must
be activated in the extractor code and cannot activated only by configuration.

TUTORIAL
{% comment %}
TODO
{% endcomment %}
## Introduction
Generic extractor allows exporting data from REST APIs not implemented in Keboola Connection or creating custom configurations to export any data from any REST API.

## Configuration
The configuration consists of 2 main parts:

- `api`
    - Defines the basic API characteristics, such as pagination, authentication, base URL etc
    - [Documentation](/extend/generic-extractor/api/)
- `config`
    - This part defines the configuration itself - resources from the API, authentication credentials, ...
    - Each resource is a "job" within the extractor, and can contain children for recursive API calls (eg tickets > comments for each ticket)
    - [Documentation](/extend/generic-extractor/config/)
