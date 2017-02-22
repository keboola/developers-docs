---
title: JSON Introduction
permalink: /extend/generic-extractor/tutorial/json/
---

* TOC
{:toc}

[JSON (JavaScript Object Notation)](http://www.json.org/) is a format for describing structured 
kind of data. For working with JSON you should be familiar with basic programming jargon. 

## Object Representation
JSON is used to described **objects** and their **properties**. For example you can describe a 
a person "John Doe" using the following JSON:

{% highlight json %}
{
    "firstName": "John",
    "lastName": "Doe"
}
{% endhighlight %}

The terminology varies a lot, so the **object** is also commonly called **record**, **structure**, 
**dictionary**, **hash table**, **keyed list**, **key-value**, **associative array**. A **property** is
also commonly called a **field**, **key**, **index**. Objects may be further organized into other
objects or into **arrays**. An **array** is a simple list of (usually the same) things, 
it is also commonly called a **collection**, **list**, **vector** or **sequence**. Both **array** and
**object** are collection of things. The core difference is that items in array are identified
by their numeric position and the array maintains order of the items. Items in object are 
identified by their name (property name) and the order of items is not maintainted. Arrays are
numericaly indexed (also called *ordinal arrays*) and objects are indexed by name (also called *associative arrays*).

To describe the John Doe family, you might use the following JSON:

{% highlight json %}
[
    {
        "firstName": "John",
        "lastName": "Doe",
        "role": "father"
    },
    {
        "firstName": "Jenny",
        "lastName": "Doe",
        "role": "mother"
    },
    {
        "firstName": "Jimmy",
        "lastName": "Doe",
        "role": "son"
    }    
]
{% endhighlight %}

The above structure is an **array** (marked by the square brackets `[]`) of 
three **objects** (marked by the curly brackets `{}`). Each object has **properties** 
(in double quotes `"` before the colon `:`, e.g. `firstName`). Each property has a **value** (in double 
quotes after the colon, e.g. `John`). Properties and objects are separated using commas `,`. Notice that 
the last item has no comma.

## Data Values
A value of each property always has some data type. Available data types are:

- string -- text
- number -- a number
- integer -- a whole number (without decimal part)
- boolean -- a value which is either `true` or `false`
- array -- a collection of values
- object -- a collection of named values

The types `string`, `number`, `integer`, `boolean` represent **scalar values**. The
types `array` and `object` represent **structured values** (they are composed of 
other values). For example:

{% highlight json %}
{
    "stringProperty": "someText",
    "numberProperty": 12.45,
    "integerProperty": 42,
    "booleanProperty": false,
    "arrayProperty": ["first", "second"],
    "objectProperty": {
        "name": "John",
        "surname": "Doe"
    }
}
{% endhighlight %}

Notice that the boolean value is `false` without quotes. It would be invalid writing it in the quotes,
because it would be considered a string then. `false` (and `true`) are **keywords** which must be written
without quotes. Another keyword is `null` which represents no value (or unknown value).

## References
There are multiple ways to refer to particular properties in a JSON document (e.g. [JSONPath](http://jsonpath.com/). 
For the purpose of this documentation we will use simple *dot notation*. Let's consider this JSON describing the
Doe's family.

{% highlight json %}
{
    "address": {
        "city": "Fresno",
        "street": "Main Street"        
    },
    "members": [
        {
            "firstName": "John",
            "age": 42,
            "shoeSize": 42.5,
            "lastName": "Doe",
            "interests": ["cars", "girls", "lego"],
            "adult": true
        },
        {
            "firstName": "Jenny",
            "adult": true,
            "shoeSize": "24.5",
            "lastName": "Doe",
            "age": 42,
            "interests": ["cars", "boys", "painting"]
        },
        {
            "adult": false,
            "firstName": "Jimmy",
            "lastName": "Doe",
            "shoeSize": null,
            "age": 1,
            "interests": ["cars", "lego", "painting"]
        }
    ]
}
{% endhighlight %}

To refer to the Joe's city, we would write `address.city`. To refer to little Jimmy`s shoe size, we
would write `members[2].shoeSize`. Array items indexes are *zero-based* so the third item has 
index `2`. Also note that the order of items in an object is not important. It is also worth noting
that `[]` represents an empty array and `{}` represents an empty object.

## Summary
This page contains a little introduction to JSON documents. We intentionally avoided many details, 
but you should now understand what JSON is, and how to write some stuff in it.
