---
---

It is sometimes useful for a container to have information about itself, but we
want to be careful not to over-couple containers to Kubernetes. The downward
API allows containers to consume information about themselves or the system and
expose that information how they want it, without necessarily coupling to the
Kubernetes client or REST API.

An example of this is a "legacy" app that is already written assuming
that a particular environment variable will hold a unique identifier.  While it
is often possible to "wrap" such applications, this is tedious and error prone,
and violates the goal of low coupling.  Instead, the user should be able to use
the Pod's name, for example, and inject it into this well-known variable.


## Capabilities

The following information is available to a `Pod` through the downward API:

*   The pod's name
*   The pod's namespace
*   The pod's IP

More information will be exposed through this same API over time.


## Exposing pod information into a container

Containers consume information from the downward API using environment
variables or using a volume plugin.


### Environment variables

Most environment variables in the Kubernetes API use the `value` field to carry
simple values.  However, the alternate `valueFrom` field allows you to specify
a `fieldRef` to select fields from the pod's definition.  The `fieldRef` field
is a structure that has an `apiVersion` field and a `fieldPath` field.  The
`fieldPath` field is an expression designating a field of the pod.  The
`apiVersion` field is the version of the API schema that the `fieldPath` is
written in terms of.  If the `apiVersion` field is not specified it is
defaulted to the API version of the enclosing object.

The `fieldRef` is evaluated and the resulting value is used as the value for
the environment variable.  This allows users to publish their pod's name in any
environment variable they want.


## Example

This is an example of a pod that consumes its name and namespace via the
downward API:

{% include code.html language="yaml" file="downward-api/dapi-pod.yaml" ghlink="/docs/user-guide/downward-api/dapi-pod.yaml" %}


### Downward API volume

Using a similar syntax it's possible to expose pod information to containers using plain text files.
Downward API are dumped to a mounted volume. This is achieved using a `downwardAPI`
volume type and the different items represent the files to be created. `fieldPath` references the field to be exposed.

Downward API volume permits to store more complex data like [`metadata.labels`](/docs/user-guide/labels) and [`metadata.annotations`](/docs/user-guide/annotations). Currently key/value pair set fields are saved using `key="value"` format:

```conf
key1="value1"
key2="value2"
```

In future, it will be possible to specify an output format option.

Downward API volumes can expose:

*   The pod's name
*   The pod's namespace
*   The pod's labels
*   The pod's annotations

The downward API volume refreshes its data in step with the kubelet refresh loop. When labels will be modifiable on the fly without respawning the pod containers will be able to detect changes through mechanisms such as [inotify](https://en.wikipedia.org/wiki/Inotify).

In future, it will be possible to specify a specific annotation or label.


## Example

This is an example of a pod that consumes its labels and annotations via the downward API volume, labels and annotations are dumped in `/etc/podlabels` and in `/etc/annotations`, respectively:

{% include code.html language="yaml" file="downward-api/volume/dapi-volume.yaml" ghlink="/docs/user-guide/downward-api/volume/dapi-volume.yaml" %}


Some more thorough examples:

   * [environment variables](/docs/user-guide/environment-guide/)
   * [downward API](/docs/user-guide/downward-api/)