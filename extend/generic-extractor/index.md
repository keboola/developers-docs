---
title: Generic Extractor (under construction)
permalink: /extend/generic-extractor/
---

Generic Extractor is a [KBC component](/overview/) which acts like a customizable 
[HTTP REST](todo) client. This means that it can be configured to extract data from
virtually any *sane* web API. Due to versatility of different APIs running in the wild, 
Generic Extractor offers a vast amount of configuration options. This may make it 
look somewhat abstract and hard to understand at first sight, but once you configure
your first extractor, you'll see that is a great tool. With generic extractor you can
build an entirely new extractor for KBC in less than an hour. 
To get started quickly, you can follow the [tutorial](/extend/generic-extractor/tutorial).
{% comment %}
TODO
terms
- endpoint
- api
- rest
{% endcomment %}

## Generic Extractor requirements
Using generic extractor you can extract data from some [REST API](todo) into KBC only by
configuring it. Generic extractor requires no programming skills or other tools, you only 
need to know how to write [JSON](todo). 
Also you should have the documentation of your chosen API at hand and that API should
be [RESTful](todo) and more or less follow the HTTP specification. 

### REST HTTP API
An [API (Application Programing Interface)](todo) is an [interface](todo) to some application or **service**
designed for machine access. API can be seen as the UI (User Interface) of some application designed
for machines -- another applications. So that another application can be programmed to consume the 
API, it has to have some specification.

A common specification for communicating on the web is HTTP protocol. HTTP protocol is used by web browsers,
but it can also be used be other API clients. HTTP protocol defines how two parties (client and server) ought 
to communicate:

- A client creates a HTTP **request** and sends it to the server over the network.
- A server processes the request, creates a **response** and sends it to the client over the network.

A HTTP request is composed of:

- URL
- HTTP Method
- HTTP Headers
- Optional Body

### URL
An [URL (Uniform Resource Locator)](todo) is simply an address. It allows you to locate 
a **Resource**. Yes, it is the same address you see in your web 
browsers' address bar. It is important to understand the parts of URL. So an address

    https://www.example.com:8080/customers/acme/order/?show=deleted&fields=all

is composed of the following components:

- `https` -- **protocol** (HTTP or HTTPS),
- `www.example.com` -- **host** -- network address of the HTTP server,
- `8080` -- **port** -- an optional network identifier within the target server; default value is `80`
- `/customers/acme/order/` -- an optional **path** to a **resource** we wish to obtain; default value is `\`
- `show=deleted&fields=all` -- optional **request parameters**, separated by the character `&` (ampersand); the 
actual parameters are:
    - `show` with value `deleted`, and`
    - `fields` with value `all`

Sometimes you may also encounter the term [URI (Uniform Resource Identifier)](todo). It is used in case 
a single **Resource** may be accessed through multiple URLs. For example a web page `http://example.com` may
display the same content as `http://example.com/home`. In such case one of the URLs (probably the second one)
is chosen as an identifier and becomes URI. So, for our use, there is no important difference between URI and URL.

### Method
An HTTP **Method** describes a type of the request to make. It also called a **HTTP Verb** because it 
describes what to do with the **resource**. Common HTTP verbs are:

- `GET` -- for obtaining a resource,
- `POST` -- for updating a resource,
- `PUT` -- for creating a resource,
- `DELETE` -- for deleting a resource

Since Generic Extractor only reads data from another API, you will most commonly use the `GET` method. The
other HTTP methods are not so important for us. 

### Headers
A HTTP request can contain [**headers**](todo), which include additional information about the request. 
A typical example of a header is `Content-type`. For example for a web page, there would be a
`Content-Type: text/html`. For an API request, it is commonly set to `Content-type: application/json`. 
Apart from standard headers, there are also non-standard headers, these are marked with `X-`, an 
example is the `X-StorageAPIToken` header used for [Storage API](todo).

### Body
Request **body** is used in case o `POST` and `PUT` requests. These are special in that it allows 
to send additional parameters to the server. These are sometimes called **POST data** (also spelled as **postdata**) 
and are send in the request **body**. POST method therefore allows setting request parameters in two 
places -- in URL and in a request body.

## HTTP response
A HTTP response is composed of:

- Response Headers -- same as the request headers (only sent by the server),
- Response Body -- the actual content of the resource,
- Status Code -- status of the request.

### HTTP Status
HTTP Status and [status code](todo) represent a standardized way to describe the response state. For example 
status `200 OK` (200 is the status code) is associated with successful response. There are many 
HTTP Statuses, but the following rules apply:

- Status codes `2xx` (e.g. 200) represent success
- Status codes `3xx` represent redirection
- Status codes `4xx` represent client error
- Status codes `5xx` represent server error

## REST API
[REST (Representational state transfer)](todo) or RESTful API is an API which follows a
set of loosely defined principles:

- The API URLs (or URIs) represent individual **resources**. This emphasizes that each API endpoint 
represents a resource of a *single type*. I.e it represents e.g. list of users and not a list of users
and their invoices.
- Each resource is **represented** in a structured format (JSON or XML). This is to emphasizes that the
data are not transferred e.g. as ordinary text or web page.
- **Messages** (request and response) are transferred using HTTP methods (`GET`, `POST`, ...). This
emphasizes that for obtaining data, only the `GET` method should be used. Also the `GET` method
must not cause any modifications of data.
- The entire communication is **stateless**. This means that multiple requests can be called in 
arbitrary order and they must yield same results. This is to emphasize, that it is not correct for
an API to have endpoints e.g. `setFilter`, `getFilteredResult` because they imply that a some 
state (a filter) is retained between the API endpoints.

### Generic extractor
The above describes the basic concepts of an API, of HTTP protocol and of a HTTP REST API. When you 
understand these concepts (and the associated jargon), you should be able to use the Generic Extractor 
to get responses from virtually any HTTP REST API. Since the REST rules are not rigidly specified it 
is not possible to ensure that the GE will be capable of reading 100% of APIs or 100% of an API 
declared as RESTful by someone.




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
