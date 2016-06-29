---
title: Submission Checklist
permalink: /extend/registration/checklist/
---

| # | Name | Note | &#9745; | Example |
| --- | ----- | ---- | ---- | ---- |
| 0 | **Vendor ID** | Prefixes application id.  | &#9744; | `keboola` |
| 1 | **Application name** | Do not use the word *extractor* or *writer* in your app.  | &#9744; | `iTunes` |
| 2 | **Application type** | One of `extractor`, `writer`, `application` | &#9744; | `extractor` |
| 3 | **Short description** | One sentence describing your app or the app you are integrating | &#9744; | Tailor-made predictive models (recommendation engines, propensity models and many more) in R |
| 4 | **Full description** | Markdown or a link to a markdown document describing what the component does (shown on the application intro page)| &#9744; |  |
| 5 | **Application icon URL** | PNG, 32x32px and 64x64px sizes on a public *HTTPS* URL | &#9744; | `https://d3iz2gfan5zufq.cloudfront.net/images/cloud-services/docker-demo-32-1.png`{: .td-break-code} |
| 6 | **Vendor full name** | Will be visible to end-users | &#9744; | Company LTD |
| 7 | **Vendor address** |  Will be visible to end-users  | &#9744; | 1 Connected Way, BigTown, CS |
| 8 | **Email address** | Will be visible to end-users and we will send error notifications to this address | &#9744; | `info@company.com` |
| 9 | **License agreement URL** | Can be included in your public source repository | &#9744; | `https://github.com/org/reponame/master/blob/LICENSE.md`{: .td-break-code} |
| 10 | **Docker image URL** [More info](/extend/docker/tutorial/#docker-images) | Currently supported are DockerHub (public and private) and Quay (public, [private](/extend/registration/#using-a-private-repository)) | &#9744; | `https://hub.docker.com/r/keboola/docker-demo` |
| 11 | **Docker image tag** [More info](/extend/docker/tutorial/#docker-images) | Tag of the image in the Docker repository; typically `latest` or `master` or `1.0.0` | &#9744; | `latest` |
| 12 | **Required memory**  | Maximum memory your image will use | &#9744; | `512M` |
| 13 | **Processing timeout**  | Maximum processing time in seconds | &#9744; | `3600` |
| 14 | **Configuration format**  | Format to store configuration file, state file and all manifests; `yaml` or `json` | &#9744; | `yaml` |
| 15 | **Streaming logs**  | STDOUT will immediately forward to Storage API events; `true` or `false`. [More info](/extend/common-interface/environment/#standard-output-and-standard-error) | &#9744; | `false` |
| 16 | **Encryption** | All parameter attributes with keys prefixed by `#` will be encrypted. If you pass sensitive data in configuration (credentials, tokens), it is encouraged to turn the encryption on; `true` or `false`. [More info](/overview/encryption/#encrypting-data-with-api) | &#9744; | `true` |
| 17 | **Default bucket** | All tables should be uploaded to a pregenerated bucket;`true` or `false`. [More info](/extend/common-interface/folders/#default-bucket) | &#9744; | `false` |
| 18 | **Default bucket stage** | `in` or `out`. [More info](/extend/common-interface/folders/#default-bucket) | &#9744; | `in` |
| 19 | **Token forwarding** | Application needs Storage API token and its details; `true` or `false` | &#9744; | `false` |
| 20 | **Component documentation** | Instructions to help end-user configure the application (linked from application configuration page) and payment information (if any) | &#9744; | `https://github.com/org/reponame/master/blob/CONFIGURATION.md`{: .td-break-code} |
| 21 | **UI options** | Which UI helpers to use; any combination of `tableInput`, `tableOutput`, `fileInput`, `fileOutput`, `excludeFromNewList`. [More info](/extend/registration/#ui-options) | &#9744; | `tableInput, tableOutput` |
| 22 | **Test configuration** | JSON configuration to test the application | &#9744; |  |
| 23 | **Configuration schema** | [JSON schema](http://json-schema.org/) describing the configuration. [More info](/extend/registration/configuration-schema/) | &#9744; |  |
| 24 | **Configuration description** | Markdown explaining the configuration. Use headlines level 3 or higher (h3, h4, ...) | &#9744; |  |
| 25 | **Networking** | If the app downloads or uploads the client data to the Internet, any of `dataIn` (eg. for extractors), `dataOut` (eg. for writers) | &#9744; | `dataIn` |
| 26 | **Actions** | List of supported [actions](/extend/common-interface/actions/), default `run` | &#9744; | `run` |
| 27 | **Fees** | Using the component in KBC implies additional fees; `true` or `false` | &#9744; | `false` |
| 28 | **Service limits / Reasonable usage** | Description of service or usage limits. Define what is maximum expected usage of your component. This may vary depending on the memory/time limits, API usage limits and other factors. | &#9744; | `10k tweets, 10k followers` |
| 29 | **Logger** | Specify a way to [log events](/extend/common-interface/logging/#gelf-logger) from your application; 'standard' or 'gelf' | &#9744; | `standard` |
