---
title: Expose Pod Information to Containers Through Files
content_type: task
weight: 40
---

<!-- overview -->

This page shows how a Pod can use a
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
to expose information about itself to Containers running in the Pod.
A `DownwardAPIVolumeFile` can expose Pod fields and Container fields.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## The Downward API

There are two ways to expose Pod and Container fields to a running Container:

* [Environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* Volume files

Together, these two ways of exposing Pod and Container fields are called the
"Downward API".

## Store Pod fields

In this exercise, you create a Pod that has one Container.
Here is the configuration file for the Pod:

{{< codenew file="pods/inject/dapi-volume.yaml" >}}

In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
[DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core).
The first element specifies that the value of the Pod's
`metadata.labels` field should be stored in a file named `labels`.
The second element specifies that the value of the Pod's `annotations`
field should be stored in a file named `annotations`.

{{< note >}}
The fields in this example are Pod fields. They are not
fields of the Container in the Pod.
{{< /note >}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

Verify that the container in the Pod is running:

```shell
kubectl get pods
```

View the container's logs:

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

The output shows the contents of the `labels` file and the `annotations` file:

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

Get a shell into the container that is running in your Pod:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

In your shell, view the `labels` file:

```shell
/# cat /etc/podinfo/labels
```

The output shows that all of the Pod's labels have been written
to the `labels` file:

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

Similarly, view the `annotations` file:

```shell
/# cat /etc/podinfo/annotations
```

View the files in the `/etc/podinfo` directory:

```shell
/# ls -laR /etc/podinfo
```

In the output, you can see that the `labels` and `annotations` files
are in a temporary subdirectory: in this example,
`..2982_06_02_21_47_53.299460680`. In the `/etc/podinfo` directory, `..data` is
a symbolic link to the temporary subdirectory. Also in the `/etc/podinfo` directory,
`labels` and `annotations` are symbolic links.

```
drwxr-xr-x  ... Feb 6 21:47 ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 ..data -> ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 annotations -> ..data/annotations
lrwxrwxrwx  ... Feb 6 21:47 labels -> ..data/labels

/etc/..2982_06_02_21_47_53.299460680:
total 8
-rw-r--r--  ... Feb  6 21:47 annotations
-rw-r--r--  ... Feb  6 21:47 labels
```

Using symbolic links enables dynamic atomic refresh of the metadata; updates are
written to a new temporary directory, and the `..data` symlink is updated
atomically using [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html).

{{< note >}}
A container using Downward API as a
[subPath](/docs/concepts/storage/volumes/#using-subpath) volume mount will not
receive Downward API updates.
{{< /note >}}

Exit the shell:

```shell
/# exit
```

## Store Container fields

The preceding exercise, you stored Pod fields in a
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)..
In this next exercise, you store Container fields. Here is the configuration
file for a Pod that has one Container:

{{< codenew file="pods/inject/dapi-volume-resources.yaml" >}}

In the configuration file, you can see that the Pod has a
[`downwardAPI` volume](/docs/concepts/storage/volumes/#downwardapi),
and the Container mounts the volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core).

The first element specifies that in the Container named `client-container`,
the value of the `limits.cpu` field in the format specified by `1m` should be
stored in a file named `cpu_limit`. The `divisor` field is optional and has the
default value of `1` which means cores for cpu and bytes for memory.

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

Get a shell into the container that is running in your Pod:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

In your shell, view the `cpu_limit` file:

```shell
/# cat /etc/podinfo/cpu_limit
```

You can use similar commands to view the `cpu_request`, `mem_limit` and
`mem_request` files.

<!-- discussion -->

<!-- TODO: This section should be extracted out of the task page. -->
## Capabilities of the Downward API

The following information is available to containers through environment
variables and `downwardAPI` volumes:

* Information available via `fieldRef`:

  * `metadata.name` - the pod's name
  * `metadata.namespace` - the pod's namespace
  * `metadata.uid` - the pod's UID
  * `metadata.labels['<KEY>']` - the value of the pod's label `<KEY>`
    (for example, `metadata.labels['mylabel']`)
  * `metadata.annotations['<KEY>']` - the value of the pod's annotation `<KEY>`
    (for example, `metadata.annotations['myannotation']`)

* Information available via `resourceFieldRef`:

  * A Container's CPU limit
  * A Container's CPU request
  * A Container's memory limit
  * A Container's memory request
  * A Container's hugepages limit (provided that the `DownwardAPIHugePages`
    [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled)
  * A Container's hugepages request (provided that the `DownwardAPIHugePages`
    [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled)
  * A Container's ephemeral-storage limit
  * A Container's ephemeral-storage request

In addition, the following information is available through
`downwardAPI` volume `fieldRef`:

* `metadata.labels` - all of the pod's labels, formatted as `label-key="escaped-label-value"`
  with one label per line
* `metadata.annotations` - all of the pod's annotations, formatted as
  `annotation-key="escaped-annotation-value"` with one annotation per line

The following information is available through environment variables:

* `status.podIP` - the pod's IP address
* `spec.serviceAccountName` - the pod's service account name
* `spec.nodeName` - the name of the node to which the scheduler always attempts to
  schedule the pod
* `status.hostIP` - the IP of the node to which the Pod is assigned

{{< note >}}
If CPU and memory limits are not specified for a Container, the
Downward API defaults to the node allocatable value for CPU and memory.
{{< /note >}}

## Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. For more information, see
[Secrets](/docs/concepts/configuration/secret/).

## Motivation for the Downward API

It is sometimes useful for a container to have information about itself, without
being overly coupled to Kubernetes. The Downward API allows containers to consume
information about themselves or the cluster without using the Kubernetes client
or API server.

An example is an existing application that assumes a particular well-known
environment variable holds a unique identifier. One possibility is to wrap the
application, but that is tedious and error prone, and it violates the goal of low
coupling. A better option would be to use the Pod's name as an identifier, and
inject the Pod's name into the well-known environment variable.

## {{% heading "whatsnext" %}}

* Check the [`PodSpec`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
  API definition which defines the desired state of a Pod.
* Check the [`Volume`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
  API definition which defines a generic volume in a Pod for containers to access.
* Check the [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core)
  API definition which defines a volume that contains Downward API information.
* Check the [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
  API definition which contains references to object or resource fields for
  populating a file in the Downward API volume.
* Check the [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
  API definition which specifies the container resources and their output format.

