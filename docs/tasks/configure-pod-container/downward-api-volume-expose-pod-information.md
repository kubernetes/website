---
title: Exposing Pod Information Using a DownwardApiVolumeFile
---

{% capture overview %}

This page shows how a Pod can use a DownwardAPIVolume to expose information
about itself to Containers running in the Pod. A DownwardAPIVolume can expose
Pod fields and Container fields.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Storing Pod fields

In this exercise, you create a Pod that has one Container.
Here is the configuration file for the Pod:

{% include code.html language="yaml" file="dapi-volume.yaml" ghlink="/docs/tasks/configure-pod-container/dapi-volume.yaml" %}

In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
[DownwardAPIVolumeFile](/docs/resources-reference/v1.5/#downwardapivolumefile-v1).
The first element specifies that the value of the Pod's
`metadata.labels` field should be stored in a file named `labels`.
The second element specifies that the value of the Pod's `annotations` 
field should be stored in a file named `annotations`.

**Note**: The fields in this example are Pod fields. They are not
fields of the Container in the Pod.

Create the Pod:

```shell
kubectl create -f http://k8s.io/docs/tasks/configure-pod-container/dapi-volume.yaml
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
/# cat /etc/labels
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
/# cat /etc/annotations
```

View the files in the `/etc` directory:

```shell
/# ls -laR /etc
```

In the output, you can see that the `labels` and `annotations` files
are in a temporary subdirectory: in this example,
`..2982_06_02_21_47_53.299460680' In the `/etc` directory, `..data` is
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

## Storing Container fields

The preceding exercise, you stored Pod fields in a DownwardAPIVolume. 
In this next exercise, you store Container fields. Here is the configuration
file for a Pod that has one Container:

{% include code.html language="yaml" file="dapi-volume-resources.yaml" ghlink="/docs/tasks/configure-pod-container/dapi-volume-resources.yaml" %}

In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
DownwardAPIVolumeFile.

The first element specifies that in the Container named `client-container`,
the value of the `limits.cpu` field 
`metadata.labels` field should be stored in a file named `cpu_limit`.

Create the Pod:

```shell
kubectl create -f http://k8s.io/docs/tasks/configure-pod-container/dapi-volume-resources.yaml
```

Get a shell into the Container that is running in your Pod:

```
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

In your shell, view the `cpu_limit` file:

```shell
/# cat /etc/cpu_limit
```
You can use similar commands to view the `cpu_request`, `mem_limit` and
`mem_request` files.

{% endcapture %}


{% capture whatsnext %}

* [PodSpec](/docs/resources-reference/v1.5/#podspec-v1)
* [Volume](/docs/resources-reference/v1.5/#volume-v1)
* [DownwardAPIVolumeSource](/docs/resources-reference/v1.5/#downwardapivolumesource-v1)
* [DownwardAPIVolumeFile](/docs/resources-reference/v1.5/#downwardapivolumefile-v1)
* [ResourceFieldSelector](/docs/resources-reference/v1.5/#resourcefieldselector-v1)

{% endcapture %}

{% include templates/task.md %}
