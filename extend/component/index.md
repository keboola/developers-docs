---
title: Components
permalink: /extend/component/
redirect_from:
    - /extend/docker/
    - /extend/custom-science/
    - /extend/custom-science/development/

---

Components allow you to [extend](/extend/) KBC in an arbitrary way.
The data interface to components is very similar to [Transformations](https://help.keboola.com/manipulation/transformations/) --- data is exchanged as
CSV files in [designated directories](/extend/common-interface/).

### Introduction to Creating a Component
As a developer you have to implement the application logic in an arbitrary language and store it in a
git repository. The component must adhere to our [Common Interface](/extend/common-interface/).
There is a [Component Generator](https://github.com/keboola/component-generator) tool which allows you to quickly bootstrap
the component.

We also provide libraries to help you with implementation in
[R](https://github.com/keboola/r-docker-application) and
[Python](https://github.com/keboola/python-docker-application) and
[PHP](https://github.com/keboola/php-docker-application).
We also have an example component in [PHP](https://github.com/keboola/docker-demo-app).

The main part of the [Common interface](/extend/common-interface/) is that
all components process input tables stored in [CSV files](/extend/common-interface/folders/) and
generate result tables in CSV files. Extractors work the same way. However, instead of reading their
input from KBC tables, they get it from an external source (usually an API). Similarly, writers
do not generate any KBC tables.

Apart from this basic usage, the common interface offers many more features such as:

- passing parameters
- error control
- working with metadata
- OAuth support
- working with non-csv files
- logging configuration

Our [Docker Runner component](/extend/docker-runner/) makes sure that the common interface is honored
from our side. It also takes care of executing your component in its own
[isolated environment](/extend/docker-runner/).

Before you start developing a new component, you need to:

- Have a [KBC project](/#development-project) where you can test your code.
- Get yourself acquainted with [Docker](/extend/component/docker-tutorial/). You must be
able to [run `docker`](/extend/component/docker-tutorial/setup/) commands.
- You should be able to send API requests. Although you can use the [Apiary](https://apiary.io/) client console, we
recommend using [Postman](https://www.getpostman.com/) as it is
more convenient. A list of [sample requests](https://documenter.getpostman.com/view/3086797/collection/77h845D)
is available.
- Have a git repository ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, although any other host should work as well).

You can work with your component in your KBC projects immediately as soon as you
[create it](/extend/component/tutorial/). However, to make the component publicly available to all users,
it must be [published](/extend/publish/).

## Next Steps
- Create a [developer account](/extend/component/tutorial/#before-you-start) so that you can create your own components.
- Follow our [tutorial](/extend/component/tutorial/) to build a "Hello, World!" component in 10 minutes.
- If you are new to Docker, there is a [quick introduction](/extend/component/docker-tutorial/) available,
along with a [guide to setting up Docker](/extend/component/docker-tutorial/setup/) and a
[guide to building dockerized applications](/extend/component/docker-tutorial/howto/).
- Follow the [next steps](/extend/component/tutorial/input-mapping/) of the tutorial to understand how your Component interacts with KBC
- See more about [testing and debugging components](/extend/component/tutorial/debugging/) in KBC environment.
- Request [publication](/extend/publish/) of your component.

## Custom Science Migration Guide
