---
title: Expose Pod Information to Containers Through Files
content_template: templates/task
---

{{% capture overview %}}

This page shows how a Pod can use a DownwardAPIVolumeFile to expose information
about itself to Containers running in the Pod. A DownwardAPIVolumeFile can expose
Pod fields and Container fields.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## The Downward API

There are two ways to expose Pod and Container fields to a running Container:

* [Environment variables](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/)
* DownwardAPIVolumeFiles

Together, these two ways of exposing Pod and Container fields are called the
*Downward API*.

## Store Pod fields

In this exercise, you create a Pod that has one Container.
Here is the configuration file for the Pod:

{{< code file="dapi-volume.yaml" >}}

In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
[DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core).
The first element specifies that the value of the Pod's
`metadata.labels` field should be stored in a file named `labels`.
The second element specifies that the value of the Pod's `annotations`
field should be stored in a file named `annotations`.

{{< note >}}
**Note:** The fields in this example are Pod fields. They are not
fields of the Container in the Pod.
{{< /note >}}

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-volume.yaml
```

Verify that Container in the Pod is running:

```shell
kubectl get pods
```

View the Container's logs:

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

Get a shell into the Container that is running in your Pod:

```
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
a symbolic link to the temporary subdirectory. Also in  the `/etc/podinfo` directory,
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
atomically using
[rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html).

{{< note >}}
**Note:** A container using Downward API as a
[subPath](/docs/concepts/storage/volumes/#using-subpath) volume mount will not
receive Downward API updates.
{{< /note >}}

Exit the shell:

```shell
/# exit
```

## Store Container fields

The preceding exercise, you stored Pod fields in a DownwardAPIVolumeFile.
In this next exercise, you store Container fields. Here is the configuration
file for a Pod that has one Container:

{{< code file="dapi-volume-resources.yaml" >}}

In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
DownwardAPIVolumeFile.

The first element specifies that in the Container named `client-container`,
the value of the `limits.cpu` field
should be stored in a file named `cpu_limit`.

Create the Pod:

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-volume-resources.yaml
```

Get a shell into the Container that is running in your Pod:

```
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

In your shell, view the `cpu_limit` file:

```shell
/# cat /etc/podinfo/cpu_limit
```
You can use similar commands to view the `cpu_request`, `mem_limit` and
`mem_request` files.

{{% /capture %}}

{{% capture discussion %}}

## Capabilities of the Downward API

The following information is available to containers through environment
variables and `downwardAPI` volumes:

* Information available via `fieldRef`:
  * `spec.nodeName` - the node’s name
  * `status.hostIP` - the node's IP
  * `metadata.name` - the pod’s name
  * `metadata.namespace` - the pod’s namespace
  * `status.podIP` - the pod’s IP address
  * `spec.serviceAccountName` - the pod’s service account name
  * `metadata.uid` - the pod’s UID
  * `metadata.labels['<KEY>']` - the value of the pod’s label `<KEY>` (for example, `metadata.labels['mylabel']`); available in Kubernetes 1.9+
  * `metadata.annotations['<KEY>']` - the value of the pod’s annotation `<KEY>` (for example, `metadata.annotations['myannotation']`); available in Kubernetes 1.9+
* Information available via `resourceFieldRef`:
  * A Container’s CPU limit
  * A Container’s CPU request
  * A Container’s memory limit
  * A Container’s memory request

In addition, the following information is available through
`downwardAPI` volume `fieldRef`:

* `metadata.labels` - all of the pod’s labels, formatted as `label-key="escaped-label-value"` with one label per line
* `metadata.annotations` - all of the pod’s annotations, formatted as `annotation-key="escaped-annotation-value"` with one annotation per line

{{< note >}}
**Note:** If CPU and memory limits are not specified for a Container, the
Downward API defaults to the node allocatable value for CPU and memory.
{{< /note >}}

## Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. For more information, see
[Secrets](/docs/concepts/configuration/secret/).

## Motivation for the Downward API

It is sometimes useful for a Container to have information about itself, without
being overly coupled to Kubernetes. The Downward API allows containers to consume
information about themselves or the cluster without using the Kubernetes client
or API server.

An example is an existing application that assumes a particular well-known
environment variable holds a unique identifier. One possibility is to wrap the
application, but that is tedious and error prone, and it violates the goal of low
coupling. A better option would be to use the Pod's name as an identifier, and
inject the Pod's name into the well-known environment variable.

{{% /capture %}}


{{% capture whatsnext %}}

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
* [DownwardAPIVolumeSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core)
* [DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)

{{% /capture %}}



