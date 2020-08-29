---
title: 通过文件将 Pod 信息呈现给容器
content_type: task
weight: 40
---

<!-- overview -->

<!--
This page shows how a Pod can use a DownwardAPIVolumeFile to expose information
about itself to Containers running in the Pod. A DownwardAPIVolumeFile can expose
Pod fields and Container fields.
-->
此页面描述 Pod 如何使用 DownwardAPIVolumeFile 把自己的信息呈现给 Pod 中运行的容器。
DownwardAPIVolumeFile 可以呈现 Pod 的字段和容器字段。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## The Downward API

There are two ways to expose Pod and Container fields to a running Container:

* [Environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* Volume Files
-->
## Downward API

有两种方式可以将 Pod 和 Container 字段呈现给运行中的容器：

* [环境变量](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/)
* 卷文件

这两种呈现 Pod 和 Container 字段的方式都称为 *Downward API*。

<!--
## Store Pod fields

In this exercise, you create a Pod that has one Container.
Here is the configuration file for the Pod:
-->
## 存储 Pod 字段

在这个练习中，你将创建一个包含一个容器的 Pod。Pod 的配置文件如下：

{{< codenew file="pods/inject/dapi-volume.yaml" >}}

<!--
In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
[DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core).
The first element specifies that the value of the Pod's
`metadata.labels` field should be stored in a file named `labels`.
The second element specifies that the value of the Pod's `annotations`
field should be stored in a file named `annotations`.
-->
在配置文件中，你可以看到 Pod 有一个 `downwardAPI` 类型的卷，并且挂载到容器中的 `/etc` 目录。

查看 `downwardAPI` 下面的 `items` 数组。
每个数组元素都是一个 
[DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
对象。
第一个元素指示 Pod 的 `metadata.labels` 字段的值保存在名为 `labels` 的文件中。
第二个元素指示 Pod 的 `annotations` 字段的值保存在名为 `annotations` 的文件中。

<!--
The fields in this example are Pod fields. They are not
fields of the Container in the Pod.
-->
{{< note >}}
本示例中的字段是Pod字段，不是Pod中容器的字段。
{{< /note >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
验证Pod中的容器运行正常：

```shell
kubectl get pods
```

<!--
View the Container's logs:
-->
查看容器的日志：

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

<!--
The output shows the contents of the labels file and the annotations file:
-->
输出显示 `labels` 和 `annotations` 文件的内容：

```
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

<!--
Get a shell into the Container that is running in your Pod:
-->
进入 Pod 中运行的容器，打开一个 Shell：

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

<!--
In your shell, view the `labels` file:
-->
在该 Shell中，查看 `labels` 文件：

```shell
/# cat /etc/labels
```

<!--
The output shows that all of the Pod's labels have been written
to the `labels` file:
-->
输出显示 Pod 的所有标签都已写入 `labels` 文件。

```
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

<!--
Similarly, view the `annotations` file:
-->
同样，查看`annotations`文件：

```shell
/# cat /etc/annotations
```

<!--
View the files in the `/etc/podinfo` directory:
-->
查看`/etc/podinfo`目录下的文件：

```shell
/# ls -laR /etc/podinfo
```

<!--
In the output, you can see that the `labels` and `annotations` files
are in a temporary subdirectory: in this example,
`..2982_06_02_21_47_53.299460680`. In the `/etc/podinfo` directory, `..data` is
a symbolic link to the temporary subdirectory. Also in the `/etc/podinfo` directory,
`labels` and `annotations` are symbolic links.
-->
在输出中可以看到，`labels` 和 `annotations` 文件都在一个临时子目录中。
在这个例子，`..2982_06_02_21_47_53.299460680`。
在 `/etc/podinfo` 目录中，`..data` 是一个指向临时子目录
的符号链接。`/etc/podinfo` 目录中，`labels` 和 `annotations` 也是符号链接。

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

<!--
Using symbolic links enables dynamic atomic refresh of the metadata; updates are
written to a new temporary directory, and the `..data` symlink is updated
atomically using
[rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html).
-->
用符号链接可实现元数据的动态原子性刷新；更新将写入一个新的临时目录，
然后通过使用[rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html)
完成 `..data` 符号链接的原子性更新。

<!--
A container using Downward API as a
[subPath](/docs/concepts/storage/volumes/#using-subpath) volume mount will not
receive Downward API updates.
-->
{{< note >}}
如果容器以
[subPath](/zh/docs/concepts/storage/volumes/#using-subpath)卷挂载方式来使用
Downward API，则该容器无法收到更新事件。
{{< /note >}}

退出 Shell：

```shell
/# exit
```

## 存储容器字段

<!--
The preceding exercise, you stored Pod fields in a DownwardAPIVolumeFile.
In this next exercise, you store Container fields. Here is the configuration
file for a Pod that has one Container:
-->
前面的练习中，你将 Pod 字段保存到 DownwardAPIVolumeFile 中。
接下来这个练习，你将存储 Container 字段。这里是包含一个容器的 Pod 的配置文件：

{{< codenew file="pods/inject/dapi-volume-resources.yaml" >}}

<!--
In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc/podinfo`.

Look at the `items` array under `downwardAPI`. Each element of the array is a
DownwardAPIVolumeFile.

The first element specifies that in the Container named `client-container`,
the value of the `limits.cpu` field in the format specified by `1m` should be
stored in a file named `cpu_limit`. The `divisor` field is optional and has the
default value of `1` which means cores for cpu and bytes for memory.

Create the Pod:
-->
在这个配置文件中，你可以看到 Pod 有一个 `downwardAPI` 类型的卷，并且挂载到容器的 `/etc/podinfo` 目录。

查看 `downwardAPI` 下面的 `items` 数组。每个数组元素都是一个 DownwardAPIVolumeFile。

第一个元素指定名为 `client-container` 的容器中 `limits.cpu` 字段的值应保存在名为
`cpu_limit` 的文件中。

创建Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

<!--
Get a shell into the Container that is running in your Pod:
-->
打开一个 Shell，进入 Pod 中运行的容器：

```
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

<!--
In your shell, view the `cpu_limit` file:
-->
在 Shell 中，查看 `cpu_limit` 文件：

```shell
/# cat /etc/cpu_limit
```

<!--
You can use similar commands to view the `cpu_request`, `mem_limit` and
`mem_request` files.
-->
你可以使用同样的命令查看 `cpu_request`、`mem_limit` 和 `mem_request` 文件.

<!-- discussion -->
<!--
## Capabilities of the Downward API
-->
## Downward API 的能力

<!--
The following information is available to containers through environment
variables and `downwardAPI` volumes:

* Information available via `fieldRef`:
  * `metadata.name` - the pod’s name
  * `metadata.namespace` - the pod’s namespace
  * `metadata.uid` - the pod’s UID, available since v1.8.0-alpha.2
  * `metadata.labels['<KEY>']` - the value of the pod’s label `<KEY>` (for example, `metadata.labels['mylabel']`); available in Kubernetes 1.9+
  * `metadata.annotations['<KEY>']` - the value of the pod’s annotation `<KEY>` (for example, `metadata.annotations['myannotation']`); available in Kubernetes 1.9+
-->
下面这些信息可以通过环境变量和 `downwardAPI` 卷提供给容器：

* 能通过 `fieldRef` 获得的：
  * `metadata.name` - Pod 名称
  * `metadata.namespace` - Pod 名字空间
  * `metadata.uid` - Pod的UID, 版本要求 v1.8.0-alpha.2
  * `metadata.labels['<KEY>']` - Pod 标签 `<KEY>` 的值 (例如, `metadata.labels['mylabel']`）； 
    版本要求 Kubernetes 1.9+
  * `metadata.annotations['<KEY>']` - Pod 的注解 `<KEY>` 的值（例如, `metadata.annotations['myannotation']`）； 版本要求 Kubernetes 1.9+

<!--
* Information available via `resourceFieldRef`:
  * A Container’s CPU limit
  * A Container’s CPU request
  * A Container’s memory limit
  * A Container’s memory request
  * A Container’s ephemeral-storage limit, available since v1.8.0-beta.0
  * A Container’s ephemeral-storage request, available since v1.8.0-beta.0
-->
* 能通过 `resourceFieldRef` 获得的：
  * 容器的 CPU 约束值
  * 容器的 CPU 请求值
  * 容器的内存约束值
  * 容器的内存请求值
  * 容器的临时存储约束值, 版本要求 v1.8.0-beta.0
  * 容器的临时存储请求值, 版本要求 v1.8.0-beta.0

<!--
In addition, the following information is available through
`downwardAPI` volume `fieldRef`:
-->
此外，以下信息可通过 `downwardAPI` 卷从 `fieldRef` 获得：
<!--
* `metadata.labels` - all of the pod’s labels, formatted as `label-key="escaped-label-value"` with one label per line
* `metadata.annotations` - all of the pod’s annotations, formatted as `annotation-key="escaped-annotation-value"` with one annotation per line
-->
* `metadata.labels` - Pod 的所有标签，以 `label-key="escaped-label-value"` 格式显示，每行显示一个标签
* `metadata.annotations` - Pod 的所有注解，以 `annotation-key="escaped-annotation-value"`
  格式显示，每行显示一个标签

<!--
The following information is available through environment variables:
-->
以下信息可通过环境变量获得：

* `status.podIP` - 节点 IP
* `spec.serviceAccountName` - Pod 服务帐号名称, 版本要求 v1.4.0-alpha.3
* `spec.nodeName` - 节点名称, 版本要求 v1.4.0-alpha.3
* `status.hostIP` - 节点 IP, 版本要求 v1.7.0-alpha.1

<!--
If CPU and memory limits are not specified for a Container, the
Downward API defaults to the node allocatable value for CPU and memory.
-->
{{< note >}}
如果容器未指定 CPU 和内存限制，则 Downward API 默认将节点可分配值
视为容器的 CPU 和内存限制。
{{< /note >}}

<!--
## Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. For more information, see
[Secrets](/docs/concepts/configuration/secret/).
-->
## 投射键名到指定路径并且指定文件权限

你可以将键名投射到指定路径并且指定每个文件的访问权限。
更多信息，请参阅[Secrets](/zh/docs/concepts/configuration/secret/).

<!--
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
-->
## Downward API的动机

对于容器来说，有时候拥有自己的信息是很有用的，可避免与 Kubernetes 过度耦合。
Downward API 使得容器使用自己或者集群的信息，而不必通过 Kubernetes 客户端或
API 服务器来获得。

一个例子是有一个现有的应用假定要用一个非常熟悉的环境变量来保存一个唯一标识。
一种可能是给应用增加处理层，但这样是冗余和易出错的，而且它违反了低耦合的目标。
更好的选择是使用 Pod 名称作为标识，把 Pod 名称注入这个环境变量中。

## {{% heading "whatsnext" %}}


* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
* [DownwardAPIVolumeSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core)
* [DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)

