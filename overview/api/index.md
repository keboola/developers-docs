---
title: Calling API 
permalink: /overview/api/
---

All our [KBC components](/architecture/) have a public API on [apiary](https://apiary.io/). If you need to send requests to our 
API, we recommend you use either use the Apiary Console or Postman Client. Most of our APIs take and produce data in JSON format. 
Many of our APIs require *Storage API token* which is entered in `X-StorageApi-Token` header.

## The Apiary console
You can send requests to our API directly from the Apiary console by clicking on **Switch to console** or **Try**. Then you need to fill request headers and parameters
and **Call Resource**.

![Apiary console](/architecture/api/apiary-console.png)

The Apiary console is fine when you send API requests only ocassionally, it requires no application installation but has no history and other useful features.
 
## Postman client
[Postman](https://www.getpostman.com/) is a generic HTTP API client. We recommend you use this client if you work with KBC API on a more regular basis. We also have 
a collection of usefull API calls, which you can import by clicking the button

[![Run in Postman](https://run.pstmn.io/button.png)](https://www.getpostman.com/run-collection/7dc2e4b41225738f5411)

Or with the following procedure: 

- Get and run [Postman](https://www.getpostman.com/)
- Go to **Import** - **From URL** 
- Enter [https://www.getpostman.com/collections/87da6ac847f5edcac776](https://www.getpostman.com/collections/87da6ac847f5edcac776)

![Apiary console](/architecture/api/postman-import.png)