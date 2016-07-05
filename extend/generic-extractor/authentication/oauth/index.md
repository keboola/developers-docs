---
title: OAuth Authentication
permalink: /extend/generic-extractor/authentication/oauth/
---

## OAuth Authentication
Set up OAuth based APIs

## Configuration
An API using OAuth (both 1.0 and 2.0) needs to be implemented as a component registered under it's own KBC Component ID and [registered](http://docs.oauthv2.apiary.io/#reference/manage/addlist-supported-api/add-new-component) to the [OAuth API](http://docs.oauthv2.apiary.io/)

### 1) Register the component
[link](/extend/registration/)

The component **must** have the **encryption** enabled

### 2) Add the component to OAuth API
[link](http://docs.oauthv2.apiary.io/#reference/manage/addlist-supported-api/add-new-component)

### 3) Configure the component API part according to one of [1.0](/extend/generic-extractor/authentication/oauth/10/) or [2.0](/extend/generic-extractor/authentication/oauth/20/) OAuth configurations
