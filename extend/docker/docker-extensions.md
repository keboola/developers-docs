---
title: Docker Extensions
permalink: /extend/docker/docker-overview/
---

## Docker extensions
Docker extensions allow you to extend KBC in a more flexible way then [Custom science](/extend/custom-science/). If you are new to extending KBC with your own code, you might want to start [Custom science](/extend/custom-science/) first as a simple starting point to extending KBC. Any Custom science extension can be very easily converted to docker extension. Docker extensions must be [registred](/extend/registration) by us to become fully usable. See the [overview](/extend/) for comparison with other customization options. In docker extensions, the data interface is very similar to [transformations](/?/) and [Custom science](/extend/custom-science/) - data are exchanged as CSV files in designated directories.

Before you start
- You must have a git repository ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, although any other host should work as well). It is easier to start with public repository.
- It is recommended that you have a KBC project, where you can test your code.
- Get yourself acquainted with [Docker](/extend/docker/docker-overview/)
- Decide what is your environment (aka choose or build docker image)
