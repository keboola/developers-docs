---
title: Component Registration
permalink: /extend/registration/
---

## Introduction
As described in the [architecture overview](/architecture/), KBC consists of many different components. If you want your [Docker extension](/extend/docker/) or [Custom Science extension](/extend/custom-science/) to be generally available in KBC, it must be registered in our **component list**. The Component list itself is provided by [Storage Component API](http://docs.keboola.apiary.io/#) in the dedicated [Components section](http://docs.keboola.apiary.io/#reference/components). 
Only registered components can be run by KBC users, and any KBC user can use any component with the following exceptions:

- the KBC user (or their token) has [limited access to the component](/token-permissions/)
- the component itself limits where (in what projects, for which users) it can run

Note that it is not at all necessary to register your Custom Science extension as a component, unless you want other KBC users to use it. 
However, it is necessary to register your Docker extension, even if it supposed to be used only in a single project.


## Registration
The registration process is simple, but it must be done by Keboola. To register your extension, please fill in the [checklist](/extend/registration/checklist) and contact us.

### UI Options
Each extension will receive a **Generic UI**. The generic UI will always show a text field for entering the component configuration in JSON format. Additionally, you can request other parts of the generic UI by adding any of `tableInput`, `tableOutput`, `fileInput`, `fileOutput` flags in the checklist. Each of the options is shown below:

[TODO:screenshoty]
[TODO:doplnit moznosti IO mappingu v UI - where/tagy u FU apod]

### Hide Extension from KBC App Store
You might want to test your extension before it is made available to all users. This is possible - the extension can be 
hidden from the list of all components (UI flag `excludeFromNewList`). 
This is useful if you want to continue testing and developing the application without making it available to all KBC users.
However, this does not really prevent anyone from using it.
To use a non-published extension, you can create the configuration using 
the [component API](http://docs.keboola.apiary.io/#reference/components/create-config/create-config). 
Or visit directly the following URL: https://connection.keboola.com/admin/projects/{projectId}/applications/{componentId}
*projectid* is simply the ID of your KBC project and when your extension is registered, 
you will obtain *componentId* (e.g. _myCompany.acmeApplication_).

