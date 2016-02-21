---
title: Encryption
permalink: /architecture/encryption/
---


Many of [KBC components](/architecture) provide Encryption API. The principle of the API is that it encrypts values which are supposed to
be securely stored and decrypted inside the components itself. This means that the encryption keys are stored inside the components and are not 
accessible to API users. This also means that there is no decryption API and there is no way the end-user can decrypt the encrypted values.
Furthermore the encrypted values are not transferable between components (this may be a bit confusing in case of components which encapsulate 
other components, such as [docker component](/architecture/docker-bundle/). Also note that encryption keys are different in production and 
development, so values encrypted on development server will not be readable on production (and vice versa). 

## Encrypting data
The encryption API can encrypt either strings or arbitrary JSON data. In case of strings, the whole string is encrypted. In case of JSON data,
only keys which start with `#` character and they are scalar, are encrypted. Therefore, encrypting a JSON structure e.g.:

    {
        "foo": "bar",
        "#encryptMe": "secret",
        "#encryptMeToo": {
            "another": "secret"
        }
    }

yields:

    {
        "foo": "bar",
        "#encryptMe": "KBC::Encrypted==ENCODEDSTRING==",
        "#encryptMeToo": {
            "another": "secret"
        }
    }


If you want to encrypt e.g. only password The body of the request is simply the text string you want to encrypt (no JSON or quotation is used). e.g. encrypting:

    mySecretPassword 

yields:

    KBC::Encrypted==ENCODEDSTRING==


If you happen to receive the error:

    This API call is only supported for components that use the 'encrypt' flag.
    
ask a Keboola Developer to enable encryption for your application.

You can use sample Postman requests from collection: 
[https://www.getpostman.com/collections/87da6ac847f5edcac776](https://www.getpostman.com/collections/87da6ac847f5edcac776) 
(see [introduction](/architecture/api/) for instructions on importing this to postman):

![Postman screenshot](/architecture/encryption-postman.png)



## Encryption Options
Our [docker component](/architecture/docker-bundle/) provides [Encryption API](http://docs.kebooladocker.apiary.io/#reference/encrypt). 
There are three options here:

- [Base encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/base-encryption/encrypt-data)
- [Image encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-encryption/encrypt-data)
- [Image configuration encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-configuration-encryption/encrypt-data)

### Base Encryption
[Base encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/base-encryption/encrypt-data)
 encrypts data so that they are globally usable for all dockerized components. Data encrypted using this method can be decrypted in all projects 
and in all [Docker components](/architecture/docker-bundle) (uncluding custom-science applications). Note that the under all
circumstances the data are decrypted only inside component application code, decrypted data are never available to the end-user. The API
call requires an arbitrary valid Storage API token. The encrypted value is identified by string `KBC::Encrypted`

### Image Encryption
[Image encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-encryption/encrypt-data)
 encrypts data so that they are usable within a single KBC component. Data encrypted using this method can be
decrypted in all projects but always only in the component for which they were encrypted. The API
call requires an arbitrary valid Storage API token and an `image` parameter which is the name of the component ID obtained during its
[registration](/extend/registration/). The encrypted value is identified by string `KBC::ComponentEncrypted`
  
### Image Configuration Encryption
[Image Configuration Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-configuration-encryption/encrypt-data)
 encrypts data so that they are usable only in a single KBC component and project. Data encrypted
using this method can be decrypted in all configurations but only in the project for which they were encrypted and only in the
component for which they were encrypted. Selected project is derived from This option requires that you have a StorageAPI token to the project. 
The API
call requires valid Storage API token for the respective project an `image` parameter which is the name of the component ID obtained during its
[registration](/extend/registration/). The data can be decrypted only in the project associated with the supplied Storage token.  
The encrypted value is identified by string `KBC::ComponentProjectEncrypted`

## Which encryption method should i choose?
You should not use the Base encryption unless you develop multiple components and have a very good reason for transferable ciphers. 
If a encrypted value has to be readable withinin multiple projects, it must be encrypted using 
[Image encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-encryption/encrypt-data) (`/docker/*{componentId}*/encrypt`). 
If an encrypted value does not have to be transferable betwen projects, its should be encrypted using 
[Image Configuration Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-configuration-encryption/encrypt-data) 
(`/docker/*{componentId}*/**configs**/encrypt`). 
