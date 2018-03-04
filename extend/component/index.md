---
title: Components
permalink: /extend/component/
redirect_from:
    - /extend/docker/
    - /extend/custom-science/
    - /extend/custom-science/development/

---

* TOC
{:toc}

Components allow you to [extend](/extend/) Keboola Connection (KBC).
The data interface to components is very similar to [Transformations](https://help.keboola.com/manipulation/transformations/) --- data is exchanged as
CSV files in [designated directories](/extend/common-interface/).

### Intro to Component Creation
As a developer, you implement the application logic in a language of your choice and store it in a
git repository. The component must adhere to our [common interface](/extend/common-interface/).
To start quickly, use our [component generator](https://github.com/keboola/component-generator) that can generate a skeleton of the component for you. We also provide libraries to help you with implementation in
[R](https://github.com/keboola/r-docker-application),
[Python](https://github.com/keboola/python-docker-application), and
[PHP](https://github.com/keboola/php-docker-application).
Check our example component in [PHP](https://github.com/keboola/docker-demo-app).

The main part of the [common interface](/extend/common-interface/) is the specification how 
[CSV files and designated folders](/extend/common-interface/folders/) are used to exchange data between KBC and components:

- Applications process input tables stored in CSV files and generate result tables in CSV files.
- Extractors write results in the same way as applications, but instead of reading their
input from KBC tables, they get it from an external source (usually an API).
- Writers, on the other hand, access their input tables in the same way as applications, but push their results into external systems and do not generate any KBC tables.


Apart from this basic usage, the common interface offers many more features, such as:

- Passing parameters
- Error control
- Working with metadata
- OAuth support
- Working with non-CSV files
- Logging configuration

Our [Docker Runner component](/extend/docker-runner/) makes sure that the common interface is honoured
from our side. It also takes care of executing your component in its own [isolated environment](/extend/docker-runner/).

## Requirements
Before you start developing a new component, you should:

- Have a [KBC project](/#development-project) where you can test your code.
- Get yourself acquainted with [Docker](/extend/component/docker-tutorial/). You should be
able to [run `docker`](/extend/component/docker-tutorial/setup/) commands. Strictly speaking, you can get away
without using it, but it will certainly speed things up for you.
- Be able to send API requests. Although you can use the [Apiary](https://apiary.io/) client console, we
recommend using [Postman](https://www.getpostman.com/) as it is
more convenient. A list of [sample requests](https://documenter.getpostman.com/view/3086797/collection/77h845D)
is available.
- Have a git repository ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) are recommended, 
although any other host should work as well).

You can work with your component in your KBC projects immediately as soon as you
[create it](/extend/component/tutorial/). However, to make the component publicly available to all users,
it must be [published](/extend/publish/).

## Next Steps
- Create a [developer account](/extend/component/tutorial/#before-you-start) so that you can create your own components.
- Follow our [tutorial](/extend/component/tutorial/) to build a "Hello, World!" component in 10 minutes.
- If new to Docker, follow a [quick introduction](/extend/component/docker-tutorial/),
along with a [guide to setting up Docker](/extend/component/docker-tutorial/setup/) and a
[guide to building dockerized applications](/extend/component/docker-tutorial/howto/).
- Follow the [next steps](/extend/component/tutorial/input-mapping/) of the tutorial to understand how your component interacts with KBC.
- See more about [testing and debugging of components](/extend/component/tutorial/debugging/) in the KBC environment.
- Request [publication](/extend/publish/) of your component.

## Custom Science Migration Guide
Previously we have supported a Custom Science component, which was offered as an intermediate before a fully fledged component.
We believe it was fully superseded by components and we [encourage you to migrate](http://status.keboola.com/farewell-to-custom-science).

Follow these steps to migrate:

- If you do not have it yet, create an account in our [Developer Portal](https://components.keboola.com/).
- [Join an existing vendor](/extend/component/tutorial/#before-you-start) or create a new one.
- Add a [new component](/extend/component/tutorial/#creating-a-component).
- Set `genericDockerUI-tableInput` and `genericDockerUI-tableOutput` (possibly also `genericDockerUI-fileInput` if you need it) in the UI options of the component.
- Create a [service account](/extend/component/tutorial/#creating-a-deployment-account).
- Migrate the component code.

**Important:** Every component has the amount of RAM limited to 64M by default. If you need more, ask us at 
[support@keboola.com](mailto:support@keboola.com). For R code, you probably need at least 300M.

### Code Migration
There should be no changes required in the component code. The only difference you might run into is that your
code is no longer put in the `/home/` directory, but in the `/code/` directory. The easiest way to migrate is
to use our [component generator tool](https://github.com/keboola/component-generator).
Run it with:

    docker run -i -t --volume=/path/to/repository/:/code/ quay.io/keboola/component-generator --update

where `/path/to/repository/` is the path to your Custom Science git repository. Choose a template according to the
language used - `python-simple`, `php-simple` or `r-simple` and skip overwriting the `main.*` file.

If you do not want the component generator to touch your repository, see the [deployment templates](https://github.com/keboola/component-generator/tree/master/templates-common)
and [language templates](https://github.com/keboola/component-generator/tree/master/templates). You can copy the files to your
repository manually. You can still use the component generator to set up Travis integration:

    docker run -i -t --volume=/path/to/repository/:/code/ quay.io/keboola/component-generator --setup-only

If you want to set up the deployment integration manually, read the [deployment documentation](/extend/component/deployment/).
It also describes integration with [Bitbucket](/extend/component/deployment/#bitbucket-integration)
and [GitLab](/extend/component/deployment/#gitlab-integration), which is also seamless. Basically, you need to do the following:

- Enable the building of the repository (either on [Travis](https://docs.travis-ci.com/) or in [BitBucket Pipelines](https://bitbucket.org/product/features/pipelines) or [GitLab CI](https://about.gitlab.com/features/gitlab-ci-cd/)).
- Set the [environment variables](/extend/component/deployment/#deploy-configuration).
- Create a [normal version](https://semver.org/#spec-item-2) git tag (`x.y.z` tag) and push to the repository.
- Wait for the build to finish and automatically deploy the new version of your component to KBC.
