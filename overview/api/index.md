---
title: Calling API 
permalink: /overview/api/
---

* TOC
{:toc}

All our [KBC components](/overview/) have a public API on [apiary](https://apiary.io/). For sending requests to our 
API, we recommend either the Apiary Console or Postman Client. Most of our APIs take and produce data in JSON format. 
Many of them require a *Storage API token* which is entered in the `X-StorageApi-Token` header.

## The Apiary Console
Send requests to our API directly from the Apiary console by clicking on **Switch to console** or **Try**. 
Then fill the request headers and parameters and **Call Resource**.

{: .image-popup}
![Apiary console](/overview/api/apiary-console.png)

The Apiary console is fine if you send API requests only occasionally. It requires no application installation; 
however, it has no history and no other useful features.
 
## Postman Client
[Postman](https://www.getpostman.com/) is a generic HTTP API client. Use it if you work with KBC API on a more regular basis. 
We also provide a collection of useful API calls; they can be imported either by clicking the following button,

[![Run in Postman](https://run.pstmn.io/button.png)](https://app.getpostman.com/run-collection/7dc2e4b41225738f5411)

or with the following procedure: 

- Get and run [Postman](https://www.getpostman.com/)
- Go to **Import** - **From URL** 
- Enter [https://www.getpostman.com/collections/87da6ac847f5edcac776](https://www.getpostman.com/collections/87da6ac847f5edcac776)

{: .image-popup}
![Apiary console](/overview/api/postman-import.png)

## cURL
[cURL](https://curl.haxx.se/) is a common library used by many systems. There is also 
a [command-line interface (CLI)](https://curl.haxx.se/docs/manpage.html) available. 
You can use the cURL CLI to create simple scripts working with KBC API. For example, to [Run a Job](/overview/jobs/), 
use:

{% highlight shell %}
curl --data "{\"config\": \"sampledatabase\"}" --header "X-StorageAPI-Token: YourStorageToken" https://syrup.keboola.com/ex-db/run 
{% endhighlight %}

To call the [encryption API](/overview/encryption/) for [R Custom Science](/extend/custom-science/), use:

{% highlight shell %}
curl --data "sometext" --header "X-StorageAPI-Token: YourStorageToken" --header "Content-Type: text/plain" https://syrup.keboola.com/docker/dca-custom-science-r/encrypt
{% endhighlight %}
