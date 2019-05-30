---
title: Encryption
permalink: /overview/encryption/
---

* TOC
{:toc}

Many of the [KBC components](/overview/) use the Encryption API; it encrypts sensitive values
which are supposed to be securely stored and decrypted inside the component itself.

This means that the encrypted values are available inside the components and are not accessible
to the API users. Also, there is no decryption API and there is no way the end-user can decrypt
the encrypted values.

Decryption is only executed when serializing configuration to the configuration file for
the Docker container. The decrypted data are stored on the Docker host drive and are
deleted immediately after the container finishes. The actual component code always reads
the decrypted data.

## UI Interaction
When saving arbitrary configuration data, values marked by the `#` character are automatically encrypted.
Given the following configuration:

{: .image-popup}
![Screenshot - Configuration editor - before](/overview/encryption-1.png)

After you save the configuration, you will receive:

{: .image-popup}
![Screenshot - Configuration editor - after](/overview/encryption-2.png)

Once the configuration has been saved, the value is encrypted and there is no way to decrypt it.
What values are encrypted is defined by the component. It means you cannot freely encrypt any
value unless the component explicitly supports it.

For example, if the component states that it requires the configuration

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "password"
}
{% endhighlight %}

it means the password will always be encrypted and the username will not be encrypted. You
cannot pass `#username` because the component does not expect such a key to exist
(although its value will be encrypted and decrypted normally). Internally, the
[encrypt API call](#encrypting-data-with-api) is used to encrypt the values before saving them.

### UI Configuration Adjustment
The UI prefers encrypted values to plain values; if you provide both `password` and `#password`, only the latter will be saved.
The following configuration

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "KBC::ProjectSecure::ENCODEDSTRING",
    "password": "secret",
}
{% endhighlight %}

will become

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "KBC::ProjectSecure::ENCODEDSTRING"
}
{% endhighlight %}

## Encrypting Data with API
The [Encryption API](https://keboolaencryption.docs.apiary.io/#reference/encrypt/encryption/encrypt-data) can encrypt
either strings or arbitrary JSON data. For strings, the whole string is encrypted. For JSON data,
only the keys which start with the `#` character and are scalar are encrypted. For example, encrypting

{% highlight json %}
{
    "foo": "bar",
    "#encryptMe": "secret",
    "#encryptMeToo": {
        "another": "secret"
    }
}
{% endhighlight %}

yields

{% highlight json %}
{
    "foo": "bar",
    "#encryptMe": "KBC::ProjectSecure::ENCODEDSTRING",
    "#encryptMeToo": {
        "another": "secret"
    }
}
{% endhighlight %}

If you want to encrypt a single string, a password for instance, the body of the request is simply the text string
you want to encrypt (no JSON or quotation is used). To give an example, encrypting

    mySecretPassword

yields

    KBC::ProjectSecure::ENCODEDSTRING

The `Content-Type` header is used to distinguish between treating the body as a string (`text/plain`) or JSON (`application/json`).

You can use the [Console in Apiary](https://keboolaencryption.docs.apiary.io/#reference/encrypt/encryption/encrypt-data?console=1) to
call the API resource endpoint.

{: .image-popup}
![Console screenshot](/overview/encryption-console.png)

### Encryption Parameters
The [Encryption API](https://keboolaencryption.docs.apiary.io/#reference/encrypt/encryption/encrypt-data)
accepts the following parameters:

- `componentId` (required) --- id of a [KBC component](/extend/component/tutorial/#creating-a-component)
- `projectId` (optional) --- id of a KBC project
- `configId` (optional) --- id of a component configuration

Depending on the provided parameters, different types of ciphers are created:

- If only the component id is provided, then the cipher starts with `KBC::ComponentSecure::` and it can be
decrypted in all configurations of the given component.

- If both the component id and project id are provided, then the cipher starts with `KBC::ProjectSecure::` and it
can be decrypted in all configurations of the given component within the given project.

- If all three (component id, project id and configuration id) are provided, then the cipher starts with
`KBC::ConfigSecure::` and it can be decrypted only within the given configuration of the given component in the given project.

The following rules apply to all ciphers:

- Providing only a configuration id without a project id is not allowed.
- The cipher can be decrypted only in the same [region](/overview/api/#regions-and-endpoints) where it was created.
- There is no decryption API, the cipher is decrypted only internally just before a component is run.
- Ciphering an already encrypted value has no effect.
- There is no way to retrieve the component, project or configuration id from the cipher.

By default, values encrypted in component configurations are encrypted using the `KBC::ProjectSecure::` cipher.
This means that the cipher is not transferable between stacks, components or projects. It is transferable
between different configurations of the same component within the project where it was created. If, for some
reason, you create a configuration containing `KBC::ConfigSecure::` ciphers, note that the configuration will not work when copied.
