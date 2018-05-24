---
title: Exposing Pod Information to Containers Through Files
content_template: templates/task
weight: 40
---

{{% capture overview %}}

This page shows how a Deployment can use a DownwardAPIVolumeFile to expose information about itself to Containers running in the Deployment. A DownwardAPIVolumeFile can expose Deployment fields and Container fields.

{{% endcapture %}}


{{% capture prerequisites %}}

{{% include task-tutorial-prereqs.md %}}

{{% endcapture %}}

{{% capture steps %}}

## The Downward API

There are two ways to expose Deployment and Container fields to a running Container:

* [Environment variables](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/)
* DownwardAPIVolumeFiles

Together, these two ways of exposing Deployment and Container fields are called the
*Downward API*.

## Storing Deployment fields

In this exercise, you create a Deployment that has one Container.
Here is the configuration file for the Deployment:

{{% include code.html language="yaml" file="dapi-volume.yaml" ghlink="/docs/tasks/inject-data-application/dapi-volume.yaml" %}

In the configuration file, you can see that the Deployment has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
[DownwardAPIVolumeFile](/docs/resources-reference/v1.6/#downwardapivolumefile-v1-core).
The first element specifies that the value of the Deployment's
`metadata.labels` field should be stored in a file named `labels`.
The second element specifies that the value of the Deployment's `annotations`
field should be stored in a file named `annotations`.

{{< note >}}
**Note**: The fields in this example are Deployment fields. They are not
fields of the Container in the Deployment.
{{< /note >}}

Create the Deployment:

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-volume.yaml
```

Verify that Container in the Deployment is running:

```shell
kubectl get deployments
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

Get a shell into the Container that is running in your Deployment:

```
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

In your shell, view the `labels` file:

```shell
cat /etc/deploymentinfo/labels
/
```

The output shows that all of the Deployment's labels have been written
to the `labels` file:

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

Similarly, view the `annotations` file:

```shell
/cat /etc/deploymentinfo/annotations
```

View the files in the `/etc/deployment info` directory:

```shell
/ls -laR /etc/deploymentinfo
```

In the output, you can see that the `labels` and `annotations` files
are in a temporary subdirectory: in this example,
`..2982_06_02_21_47_53.299460680`. In the `/etc` directory, `..data` is
a symbolic link to the temporary subdirectory. Also in  the `/etc` directory,
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

Exit the shell:

```shell
exit
/
```

## Storing Container fields

The preceding exercise, you stored Deployment fields in a DownwardAPIVolumeFile.
In this next exercise, you store Container fields. Here is the configuration
file for a Deployment that has one Container:

{{% include code.html language="yaml" file="dapi-volume-resources.yaml" ghlink="/docs/tasks/inject-data-application/dapi-volume-resources.yaml" %}}

In the configuration file, you can see that the Deployment has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
DownwardAPIVolumeFile.

The first element specifies that in the Container named `client-container`,
the value of the `limits.cpu` field
should be stored in a file named `cpu_limit`.

Create the Deployment:

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-volume-resources.yaml
```

Get a shell into the Container that is running in your Deployment:

```
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

In your shell, view the `cpu_limit` file:

```shell
cat /etc/deploymentinfo/cpu_limit
```
You can use similar commands to view the `cpu_request`, `mem_limit` and
`mem_request` files.

{{% endcapture %}}

{{% capture discussion %}}

## Capabilities of the Downward API

The following information is available to Containers through environment
variables and DownwardAPIVolumeFiles:

* The node’s name
* The Deployment's name
* The Deployment's namespace
* The Deployment's IP address
* The Deployment's service account name
* A Container’s CPU limit
* A container’s CPU request
* A Container’s memory limit
* A Container’s memory request

In addition, the following information is available through
DownwardAPIVolumeFiles.

* The Deployment's labels
* The Deployment's annotations

{{< note >}}
**Note**: If CPU and memory limits are not specified for a Container, the
Downward API defaults to the node allocatable value for CPU and memory.
{{< /note >}}

## Projecting keys to specific paths and file permissions

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
coupling. A better option would be to use the Deployment's name as an identifier, and
inject the Deployment's name into the well-known environment variable.

{{% endcapture %}}


{{% capture whatsnext %}}

* [PodSpec](/docs/resources-reference/v1.6/#podspec-v1-core)
* [Volume](/docs/resources-reference/v1.6/#volume-v1-core)
* [DownwardAPIVolumeSource](/docs/resources-reference/v1.6/#downwardapivolumesource-v1-core)
* [DownwardAPIVolumeFile](/docs/resources-reference/v1.6/#downwardapivolumefile-v1-core)
* [ResourceFieldSelector](/docs/resources-reference/v1.6/#resourcefieldselector-v1-core)

{{% endcapture %}}

{{% include templates/task.md %}}
