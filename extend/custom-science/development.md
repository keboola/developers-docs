---
title: Development guide
permalink: /extend/custom-science/development/
---

When you develop code for Custom Science application, the following rules must be honored:
- Application code must be stored in a private or public git repository
- *Runtime* settings must be created in Custom Science Application configuration
- The application code must follow our [common interface](/common-interface). If possible, you can use [Python](/extend/custom-science/python/) or [R](/extend/custom-science/r) librararies. 
- There is no interaction with Keboola (we do not have to configure/approve your code or anything else). 
You should let the end-user know what she has to do.

## Git repository configuration
You must have a git repository ready ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, 
although any other host should work as well). Both private and public repositories are supported. The repository must use tags to 
mark releases, we recommend that you use [Semantic versioning](http://semver.org/), untagged git commits cannot be used in Custom
Science. 

### Public repository
Basic *Runtime* settings for public repository are entered in JSON format: 

	{
		"repository": "https://github.com/keboola/docs-custom-science-example-1",
		"version": "0.0.1"
	}
    

### Private repositoy
*Runtime* settings for public repository require that git credentials are supplied too. Username must be supplied in the
`username` field and must not be encrypted. Password must be supplied encrypted in `#password`. 

	{
		"repository": "https://github.com/keboola/docs-custom-science-example-1",
		"version": "0.0.1",
        "username": "",
        "#password": ""
	}

- The Git repository can be public or private, in case of private repository `username` and `#password` must be 
present in **runtime configuration**. In case of public repository they mustn't be present.
[Python](/extend/custom-science/python/) or [R](/extend/custom-science/r)
(https://github.com/keboola/python-custom-application-text-splitter).
The password to the repository must be encrypted, plain passwords are not allowed. Application ID for encryption is `dca-custom-science-r` for R applications, `dca-custom-science-python` for Python 3.x and `dca-custom-science-python2` for Python 2.x.
The repository of a R application must contain script `main.R` in it's root which will be the actual code executed (or it will call the actual code). See an [example repository](https://github.com/keboola/r-custom-application-transpose).
The repository of a Python application must contain script `main.py` in it's root which will be the actual code executed (or it will source the actual code). See an [example repository](https://github.com/keboola/python-custom-application-text-splitter).
The repository information (address, version and credentials) must be entered in the runtime configuration field. 
If you are not supporting dynamic input/output mapping, you must instruct the end-user how to set IO mapping.
