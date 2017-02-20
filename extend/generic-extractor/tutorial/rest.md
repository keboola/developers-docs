---
title: REST HTTP API Introduction
permalink: /extend/generic-extractor/tutorial/rest/
---

* TOC
{:toc}

An [API (Application Programing Interface)](todo) is an [interface](todo) to some application or **service**
designed for machine access. API can be seen as the UI (User Interface) of some application designed
for machines (another applications). So that another application can be programmed to consume the 
API, it has to have some sort of specification.

A common specification for communicating on the web is [HTTP protocol](todo). HTTP protocol is used by web browsers,
but it can also be used be other API clients. HTTP protocol defines how two parties (client and server) ought 
to communicate:

- A client creates a HTTP **request** and sends it to the server over the network.
- A server processes the request, creates a **response** and sends it to the client over the network.

## HTTP Request
A HTTP request is composed of:

- URL
- HTTP Method
- HTTP Headers
- Optional Body

### URL
An [URL (Uniform Resource Locator)](todo) is simply an address. It allows you to locate 
a **Resource**. Yes, it is the same address you see in your web 
browser address bar. It is important to understand the parts of URL. So an address

    https://www.example.com:8080/customers/acme/order/?show=deleted&fields=all

is composed of the following components:

- `https` -- **protocol** (HTTP or HTTPS),
- `www.example.com` -- **host** -- network address of the HTTP server,
- `8080` -- **port** -- an optional network identifier within the target server; default value is `80`
- `/customers/acme/order/` -- an optional **path** to a **resource** we wish to obtain; default value is `\`
- `show=deleted&fields=all` -- optional **request parameters** (also called **query string** or **query string parameters**), 
separated by the character `&` (ampersand); the actual parameters are:
    - `show` with value `deleted`, and`
    - `fields` with value `all`.

Sometimes you may also encounter the term [URI (Uniform Resource Identifier)](todo). It is used in case 
a single **Resource** may be accessed through multiple URLs. For example a web page `http://example.com` may
display the same content as `http://example.com/home`. In such case one of the URLs (probably the second one)
is chosen as an identifier and becomes URI. For our use, there is no important difference between URI and URL.
An API **end-point** is identified by its URL (or URI), each API end-point should represent a distinct 
**resource** (users, invoices etc.). Because they ultimately refer to the same thing, the terms
end-point, resource, URL, URI are used interchangeably.

### Method
An HTTP **Method** describes a type of the request to make. It also called a **HTTP Verb** because it 
describes what to do with the **resource**. Common HTTP verbs are:

- `GET` -- for obtaining a resource,
- `POST` and `PATCH` -- for updating a resource,
- `PUT` -- for creating a resource,
- `DELETE` -- for deleting a resource

Since Generic Extractor only reads data from another API, you will most commonly use 
the `GET` method (and sometimes the `POST` method). The other HTTP methods are not so important for us. 

### Headers
A HTTP request can contain [**headers**](todo), which include additional information about the request 
and response. A typical example of a header is `Content-type`. For example for a web page, a
`Content-Type: text/html` would be used because a [HTML page](todo) is being transferred. For an API request, 
it is commonly set to `Content-type: application/json` because we are transferring [JSON data](todo). 
Apart from standard headers, there are also non-standard headers, these are marked with prefix `X-`, an 
example is the `X-StorageAPIToken` header used with KBC [Storage API](todo).

### Body
Request **body** is used in case of `POST`, `PUT` and `PATCH` requests. These are special in that they allow
to send additional parameters to the server. These are sometimes called **POST data** (also spelled as **postdata**) 
and are send in the request **body**. POST method therefore allows setting request parameters in two 
places -- in URL and in the request body.

## HTTP response
An HTTP response is composed of:

- Response Headers -- same as the request headers (only sent by the server),
- Response Body -- the actual content of the resource,
- Status Code -- status of the request.

#### HTTP Status
HTTP Status and [status code](todo) represent a standardized way to describe the response state. For example 
status `200 OK` (200 is the status code) is associated with successful response. There are many 
HTTP Statuses, but the following rules apply:

- Status codes `2xx` (e.g. 200) represent success
- Status codes `3xx` represent [redirection](todo)
- Status codes `4xx` represent client error (the request is wrong)
- Status codes `5xx` represent server error (the server failed to create the response)

## REST API
[REST (Representational state transfer)](todo) (or RESTful) is an API which follows a
set of loosely defined principles:

- The API URLs (or URIs) represent individual **resources**. This emphasizes that each API endpoint 
represents a resource of a *single type*. I.e it represents e.g. list of users and not a list of users
and their invoices.
- Each resource is **represented** in a structured format ([JSON](todo) or [XML](todo)). 
This is to emphasizes that the data are not transferred e.g. as an ordinary text or a web page.
- **Messages** (request and response) are transferred using HTTP methods (`GET`, `POST`, ...). This
emphasizes that for obtaining data, only the `GET` method should be used. Also the `GET` method
must not cause any modifications of data.
- The entire communication is **stateless**. This means that multiple requests can be called in 
arbitrary order and they must yield same results. This is to emphasize that it is not correct for
an API to have endpoints e.g. `setFilter`, `getFilteredResult` because they imply that some 
state (a filter) is retained between that API endpoints.

## Summary
The above describes the basic concepts of an API, of HTTP protocol and of a HTTP REST API. When you 
understand these concepts (and the associated jargon), you should be able to use the Generic Extractor 
to get responses from virtually any HTTP REST API. Since the REST rules are not rigidly specified it 
is not possible to ensure that the Generic Extractor will be capable of reading 100% of APIs 
or 100% of end-points API declared as RESTful by someone.

