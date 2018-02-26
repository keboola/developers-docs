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
- Get yourself acquainted with [Docker](/extend/component/docker-tutorial/). You should be
able to [run `docker`](/extend/component/docker-tutorial/setup/) commands. Strictly speaking, you can get away
without using it, but it will certainly speed things up for you.
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
Previously we have supported a Custom Science component, which was offered as an intermediate before a fully fledged component.
We believe it was fully superseded by components and we [encourage you to migrate](http://status.keboola.com/farewell-to-custom-science).

Follow these steps to migrate:

- If you don't have it yet, create an account in our [Developer Portal](https://components.keboola.com/).
- Create new or [join an existing Vendor](/extend/component/tutorial/#before-you-start).
- Add a [new component](/extend/component/tutorial/#creating-a-component).
- Set `genericDockerUI-tableInput` and `genericDockerUI-tableOutput` (possibly also `genericDockerUI-fileInput` if you need it) in the UI options of the component.
- Create a [service account](/extend/component/tutorial/#creating-a-deployment-account)
- Migrate the component code.

**Important:** Every component the amount of RAM limited to 64M by default. If you need more, ask us at [support@keboola.com](mailto:support@keboola.com). For R code, you'll probably need at least 300M.

### Code Migration
There should be no changes required in the component code. The only difference you might run into is that your
code is no longer put in the `/home/` directory, but in the `/code/` directory. The easiest way to migrate is
to use our [Component Generator tool](https://github.com/keboola/component-generator).
Run it with:

    docker run -i -t --volume=/path/to/repository/:/code/ quay.io/keboola/component-generator --update

where `/path/to/repository/` is the path to your Custom Science git repository. Choose a template according to the
language used - `python-simple`, `php-simple` or `r-simple` and skip overwriting the `main.*` file.

If you don't want the component generator to touch your repository, see the [deployment template](https://github.com/keboola/component-generator/tree/master/templates-common)
and [language templates](https://github.com/keboola/component-generator/tree/master/templates). You can copy the files to your
repository manually. You can still use the Component Generator, to setup travis integration:

    docker run -i -t --volume=/path/to/repository/:/code/ quay.io/keboola/component-generator --setup-only

If you want to setup the deployment integration manually, read the [deployment documentation](/extend/component/deployment/).
It also describes integration with [Bitbucket](/extend/component/deployment/#bitbucket-integration) which is also seamless.
Basically you need to:

- enable building of the repository (either on Travis or in [Bucket Pipelines](https://bitbucket.org/product/features/pipelines))
- set the [environment variables](/extend/component/deployment/#deploy-configuration)
- create a [normal version](https://semver.org/#spec-item-2) git tag (`x.y.z` tag) and push to the repository
- wait for the build finish and automatically deploy the new version of your component to KBC
