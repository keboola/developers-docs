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
- You should provide instruction on how the appliction should be setup to the end-user. This is especially:
 - any requirements for application configuration,
 - If you are not supporting dynamic input/output mapping, the names of input/output files.

## Git repository configuration
You must have a git repository ready ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, 
although any other host should work as well). Both private and public repositories are supported. The repository must use tags to 
mark releases, we recommend that you use [Semantic versioning](http://semver.org/), untagged git commits cannot be used in Custom
Science. Repository information is entered into the *Runtime* configuration field when creating application confiugration. The 
repository information is not available to the application itself. 

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
        "username": "JohnDoe",
        "#password": "MySecretPassword"
	}

Password to the repository must be always [encrypted](/architecture/encryption/) (plain passwords are not allowed), there are two main encryption options:

- encryption on configuration save
- encrypt password beforehand

#### Encryption on save
When you enter plaintext password into the runtime setting, it will be encrypted once the configuration is saved. After that
the password is shown only encrypted (e.g. `KBC::ComponentProjectEncrypted==UEh3raTcaLg=`). Once the password is encrypted, it cannot be 
decrypted. The advantage of this approach is that it is very easy to use, the obivous disadvantage is that the end-user must 
know the password to the git repository (though only when creating the configuration).
  
#### Encryption beforehand
If you require that the end-user has no access to git repository password, you must encrypt it beforehand. You must use our 
[Encryption API](/architecture/encryption/). There are three more options here:

- [Base encryption](/architecture/encryption/#base-encryption) - Encrypted values will be readable in all dockerized applications.
- [Image encryption](/architecture/encryption/#image-encryption) - Encrypted values will be readable in all instances of the specific custom-science application,
 In the API call, the `componentId` parameter is `dca-custom-science-r` for R applications, `dca-custom-science-python` for Python 3.x and `dca-custom-science-python2` 
for Python 2.x. This is probably the best choice to start with in a Custom Science application.  
- [Image configuration encryption](/architecture/encryption/#image-configuration-encryption) -Encrypted values will be readable in all instances of the 
specific custom-science application in *a single project*,
 In the API call, the `componentId` parameter is `dca-custom-science-r` for R applications, `dca-custom-science-python` for Python 3.x and `dca-custom-science-python2` 
for Python 2.x. This is the most secure way, but you need to encrypt password for each project in which your Custom science application will be used.

## Git repository contents
Our only requirement is that the in the root of the repository a `main.R` (for R Custom Science) or `main.py` (for Python Custom Science) 
(which will be the actual code executed by us) must be present. If this requirement cannot be honored, it can be circumvented by [registering](/registration/) the application. 
Otherwise the repository contents are arbitrary.
However you might want to check out specific notses for [Python](/extend/custom-science/python/) or [R](/extend/custom-science/r) regarding implementation 
details in each language.

