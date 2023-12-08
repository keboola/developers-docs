---
title: Encryption
permalink: /overview/encryption/
---

* TOC
{:toc}

Many of the [KBC components](/overview/) use the Encryption API, which encrypts sensitive values
intended for secure storage. These values are then decrypted within the component itself. 
This process ensures that the encrypted values are only accessible inside the components and not
by API users. Additionally, there is no decryption API available, meaning end-users cannot decrypt
these values.

Decryption occurs solely during the serialization of configuration to the Docker container's 
configuration file. The decrypted data are stored on the Docker host drive and are promptly 
deleted after the container's completion. The component code exclusively accesses the decrypted data.

## UI Interaction
When saving arbitrary configuration data, values prefixed with the `#` character are automatically encrypted.
For instance, consider the following configuration:

{: .image-popup}
![Screenshot - Configuration editor - before](/overview/encryption-1.png)

After saving, the configuration appears as:

{: .image-popup}
![Screenshot - Configuration editor - after](/overview/encryption-2.png)

Once saved, the value becomes encrypted and irreversible. The component defines which values are
encrypted, indicating that not all values can be encrypted unless explicitly supported by the component.

For example, a component requiring the following configuration:

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "password"
}
{% endhighlight %}

indicates that the password will be encrypted, while the username will not. Adding a
prefix `#` to `username` is ineffective, as the component does not recognize such a key,
even though its value would be encrypted and decrypted normally. Internally, the
[Encryption API](#encrypting-data-with-api) encrypts these values before saving.

### UI Configuration Adjustment
The UI prioritizes encrypted values over plain ones. If both `password` and `#password` are provided, only `#password` will be retained.
Consequently, this configuration:

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "KBC::ProjectSecure::ENCODEDSTRING",
    "password": "secret",
}
{% endhighlight %}

will be transformed to:

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "KBC::ProjectSecure::ENCODEDSTRING"
}
{% endhighlight %}

## Encrypting Data with API
The [Encryption API](https://keboolaencryption.docs.apiary.io/#reference/encrypt/encryption/encrypt-data) can handle
both strings and arbitrary JSON data. For strings, the entire string is encrypted. In JSON data,
only scalar keys starting with `#` are encrypted. For example, encrypting the following:

{% highlight json %}
{
    "foo": "bar",
    "#encryptMe": "secret",
    "#encryptMeToo": {
        "another": "secret"
    }
}
{% endhighlight %}

results in:

{% highlight json %}
{
    "foo": "bar",
    "#encryptMe": "KBC::ProjectSecure::ENCODEDSTRING",
    "#encryptMeToo": {
        "another": "secret"
    }
}
{% endhighlight %}

To encrypt a single string, such as a password, simply submit the text string for encryption
(no JSON or quotation is used). For example, encrypting

    mySecretPassword

yields

    KBC::ProjectSecure::ENCODEDSTRING

The `Content-Type` header in the request differentiates whether the body is treated as a string (`text/plain`) or JSON (`application/json`).

You can use the [Console in Apiary](https://keboolaencryption.docs.apiary.io/#reference/encrypt/encryption/encrypt-data?console=1) to
call the API resource endpoint.

{: .image-popup}
![Console screenshot](/overview/encryption-console.png)

### Encryption Parameters
The [Encryption API](https://keboolaencryption.docs.apiary.io/#reference/encrypt/encryption/encrypt-data)
accepts the following parameters:

- `componentId` (optional) --- id of a [Keboola Connection component](/extend/component/tutorial/#creating-a-component),
- `projectId` (optional) --- id of a Keboola Connection project,
- `configId` (optional) --- id of a component configuration,
- `branchType` (optional) --- Branch type --- either `default` (meaning default production branch) or `dev` (meaning any development branch other than the production).

Depending on the provided parameters, different types of ciphers are created:

- If only the component id is provided, then the cipher starts with `KBC::ComponentSecure::` and it can be
decrypted in all configurations of the given component. This is recommended for Component specific secrets 
valid across all customers (e.g. some kind of master authorization token)

- If both the component id and project id are provided, then the cipher starts with `KBC::ProjectSecure::` and it
can be decrypted in all configurations of the given component within the given project. This is **recommended for all secrets** 
used within a typical Keboola Connection project.

- If branch type is added to the both the component id and project id, then the cipher starts with `KBC::BranchTypeSecure::` and it
can be decrypted in all configurations of the given component within the given project either in the default production branch or in any of 
the development branches. This means that such encrypted value is not transferrable from production to development (and vice versa).
Notice that it is not possible to encrypt value for only a single development branch.

- If all three IDs (component id, project id and configuration id) are provided, then the cipher starts with
`KBC::ConfigSecure::` and it can be decrypted only within the given configuration of the given component in the given project.
This type of cipher is useful when you want to prevent copying a configuration.

- If branch type is added to all three IDs (component id, project id and configuration id), then the cipher starts with `KBC::BranchTypeConfigSecure::` and it
can be decrypted and it can be decrypted only within the given configuration of the given component in the given project either in the default production 
branch or in any of the development branches. This means that such encrypted value is not transferrable from production to development (and vice versa).
Notice that it is not possible to encrypt value for only a single development branch.

- If only the project id is provided, then the cipher starts with `KBC::ProjectWideSecure::` and it can be
decrypted in all configurations in the given project. This type of cipher is useful for encrypting things shared across multiple 
components, e.g. SSH tunnel settings.

- If branch type is added to the project id, then the cipher starts with `KBC::ProjectWideBranchTypeSecure::` and it can be
decrypted in all configurations in the given project either in the default production 
branch or in any of the development branches. This means that such encrypted value is not transferrable from production to development (and vice versa).
Notice that it is not possible to encrypt value for only a single development branch. 

The following rules apply to all ciphers:

- Providing only a configuration id without a project id is not allowed. Similarly providing only branch type without project is not allowed.
- Cipher decryption is only possible in the [region](/overview/api/#regions-and-endpoints) where the cipher was originally created. One specific example are ciphers with prefixes having different suffixes, such as, `KBC::ProjectSecureKV::` (Azure) or `KBC::ProjectSecureGKMS::` (GCP) instead of `KBC::ProjectSecure::` (AWS). Despite using the same business logic, the region and technology are different and such ciphers are never interchangeable.
- There is no decryption API, the cipher is decrypted only internally just before a component is run.
- Ciphering an already encrypted value has no effect.
- There is no way to retrieve the component, project or configuration id or branch type from the cipher.
- None of the IDs referenced at the cipher creation have to exist. I.e. you can create a cipher for a component that has not been registered yet and that cipher will start working as soon as the component is registered. Similarly, you can create ciphers for projects and configurations without having any access to them.

By default, values encrypted in component configurations are encrypted using the `KBC::ProjectSecure::` cipher.
This means that the cipher is not transferable between regions, components or projects. It is transferable
between different configurations of the same component within the project where it was created. If, for some
reason, you create a configuration containing `KBC::ConfigSecure::` ciphers, note that the configuration will not work when copied.
