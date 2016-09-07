---
assignees:
- bgrant0607
- mikedanese

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
*   A container's cpu limit
*   A container's cpu request
*   A container's memory limit
*   A container's memory request

More information will be exposed through this same API over time.


## Exposing pod information into a container

Containers consume information from the downward API using environment
variables or using a volume plugin.


## Environment variables

Most environment variables in the Kubernetes API use the `value` field to carry
simple values.  However, the alternate `valueFrom` field allows you to specify
a `fieldRef` to select fields from the pod's definition, and a `resourceFieldRef`
to select fields from one of its container's definition.

The `fieldRef` field is a structure that has an `apiVersion` field and a `fieldPath`
field.  The `fieldPath` field is an expression designating a field of the pod.  The
`apiVersion` field is the version of the API schema that the `fieldPath` is
written in terms of.  If the `apiVersion` field is not specified it is
defaulted to the API version of the enclosing object.

The `fieldRef` is evaluated and the resulting value is used as the value for
the environment variable.  This allows users to publish their pod's name in any
environment variable they want.

The `resourceFieldRef` is a structure that has a `containerName` field, a `resource`
field, and a `divisor` field. The `containerName` is the name of a container,
whose resource (cpu or memory) information is to be exposed. The `containerName` is
optional for environment variables and defaults to the current container. The
`resource` field is an expression designating a resource in a container, and the `divisor`
field specifies an output format of the resource being exposed. If the `divisor`
is not specified, it defaults to "1" for cpu and memory. The table shows possible
values for cpu and memory resources for `resource` and `divisor` settings:


| Setting        | Cpu          | Memory  |
| ------------- |-------------| -----|
| resource | limits.cpu, requests.cpu| limits.memory, requests.memory|
| divisor | 1(cores), 1m(millicores) | 1(bytes), 1k(kilobytes), 1M(megabytes), 1G(gigabytes), 1T(terabytes), 1P(petabytes), 1E(exabytes), 1Ki(kibibyte), 1Mi(mebibyte), 1Gi(gibibyte), 1Ti(tebibyte), 1Pi(pebibyte), 1Ei(exbibyte)|


### Example

This is an example of a pod that consumes its name and namespace via the
downward API:

{% include code.html language="yaml" file="dapi-pod.yaml" ghlink="/docs/user-guide/downward-api/dapi-pod.yaml" %}

This is an example of a pod that consumes its container's resources via the downward API:

{% include code.html language="yaml" file="dapi-container-resources.yaml" ghlink="/docs/user-guide/downward-api/dapi-container-resources.yaml" %}

## Downward API volume

Using a similar syntax it's possible to expose pod information to containers using plain text files.
Downward API are dumped to a mounted volume. This is achieved using a `downwardAPI`
volume type and the different items represent the files to be created. `fieldPath` references the field to be exposed.
For exposing a container's resources limits and requests, `containerName` must be specified with `resourceFieldRef`.

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
*   A container's cpu limit
*   A container's cpu request
*   A container's memory limit
*   A container's memory request

The downward API volume refreshes its data in step with the kubelet refresh loop. When labels will be modifiable on the fly without respawning the pod containers will be able to detect changes through mechanisms such as [inotify](https://en.wikipedia.org/wiki/Inotify).

In future, it will be possible to specify a specific annotation or label.


### Example

This is an example of a pod that consumes its labels and annotations via the downward API volume, labels and annotations are dumped in `/etc/labels` and in `/etc/annotations`, respectively:

{% include code.html language="yaml" file="volume/dapi-volume.yaml" ghlink="/docs/user-guide/downward-api/volume/dapi-volume.yaml" %}

This is an example of a pod that consumes its container's resources via the downward API volume.

{% include code.html language="yaml" file="volume/dapi-volume-resources.yaml" ghlink="/docs/user-guide/downward-api/volume/dapi-volume-resources.yaml" %}

Some more thorough examples:

   * [environment variables](/docs/user-guide/environment-guide/)
   * [downward API](/docs/user-guide/downward-api/)

## Default values for container resource limits

If cpu and memory limits are not specified for a container, the downward API will default to the node allocatable value for cpu and memory.
