---
title: 通过文件暴露 Pod 信息给容器
cn-approvers:
- pigletfly
---
<!--
---
title: Expose Pod Information to Containers Through Files
---
-->

{% capture overview %}

<!--
This page shows how a Pod can use a DownwardAPIVolumeFile to expose information
about itself to Containers running in the Pod. A DownwardAPIVolumeFile can expose
Pod fields and Container fields.
-->
本文展示了如何使用 DownwardAPIVolumeFile 暴露 Pod 自身信息给运行在这个 Pod 中的容器。DownwardAPIVolumeFile 可以暴露 Pod 的字段和 Container 字段。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

<!--
## The Downward API

There are two ways to expose Pod and Container fields to a running Container:

* [Environment variables](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/)
* DownwardAPIVolumeFiles

Together, these two ways of exposing Pod and Container fields are called the
*Downward API*.
-->
## Downward API

有两种方法可以暴露 Pod 和 Container 字段给一个运行的容器：

* [环境变量](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/)
* DownwardAPIVolumeFiles

这两种暴露 Pod 和 Container 字段的方法被称为 *Downward API* 。

<!--
## Store Pod fields

In this exercise, you create a Pod that has one Container.
Here is the configuration file for the Pod:
-->
## 存储 Pod 字段

在本练习中，您创建了一个 Pod，里面运行了一个容器。
下面是这个 Pod 的配置文件：

{% include code.html language="yaml" file="dapi-volume.yaml" ghlink="/docs/tasks/inject-data-application/dapi-volume.yaml" %}

<!--
In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc`.
-->
在这个配置文件中，您可以看到这个 Pod 有一个 `downwardAPI` 卷，容器把卷挂载在 `/etc` 。

<!--
Look at the `items` array under `downwardAPI`. Each element of the array is a
[DownwardAPIVolumeFile](/docs/resources-reference/{{page.version}}/#downwardapivolumefile-v1-core).
The first element specifies that the value of the Pod's
`metadata.labels` field should be stored in a file named `labels`.
The second element specifies that the value of the Pod's `annotations`
field should be stored in a file named `annotations`.
-->
看下在 `downwardAPI` 下的 `items` 数组。这个数组中的每个元素是一个 [DownwardAPIVolumeFile](/docs/resources-reference/{{page.version}}/#downwardapivolumefile-v1-core)。
第一个元素指定了 Pod 的 `metadata.labels` 字段的值应该存储在一个名字为 `labels` 的文件中。
第二个元素指定了 Pod 的 `annotations` 字段的值应该存储在一个名字为 `annotations` 的文件中。

<!--
**Note:** The fields in this example are Pod fields. They are not
fields of the Container in the Pod.
-->
**注意:**  在本例中的字段是 Pod 的字段。它们不是 Pod 中 Container 的字段。
{: .note}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-volume.yaml
```

<!--
Verify that Container in the Pod is running:
-->
验证 Pod 中的容器是否运行：

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
The output shows the contents of the `labels` file and the `annotations` file:
-->
输出展示了 `labels` 和 `annotations` 的文件内容：

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

<!--
Get a shell into the Container that is running in your Pod:
-->
获取您的 Pod 中运行的容器的 shell：

```
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

<!--
In your shell, view the `labels` file:
-->
在您的 shell 中，查看 `labels` 文件：

```shell
/# cat /etc/labels
```

<!--
The output shows that all of the Pod's labels have been written
to the `labels` file:
-->
输出展示了这个 Pod 的全部 labels 都被写入了  `labels` 文件：

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

<!--
Similarly, view the `annotations` file:
-->
相似的，查看 `annotations` 文件：

```shell
/# cat /etc/annotations
```

<!--
View the files in the `/etc` directory:
-->
查看 `/etc` 目录下的文件：

```shell
/# ls -laR /etc
```

<!--
In the output, you can see that the `labels` and `annotations` files
are in a temporary subdirectory: in this example,
`..2982_06_02_21_47_53.299460680`. In the `/etc` directory, `..data` is
a symbolic link to the temporary subdirectory. Also in  the `/etc` directory,
`labels` and `annotations` are symbolic links.
-->
在这个输出中，您可以看到 `labels` 和 `annotations` 文件是在一个临时的子目录中：在本例中，是 `..2982_06_02_21_47_53.299460680` 目录。
在 `/etc` 目录中, `..data` 是链接到临时子目录的符号链接。在 `/etc` 目录中, `labels` 和 `annotations` 也是符号链接。


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
使用符号链接可以实现元数据的动态原子刷新；更新被写入了一个临时目录，并且 `..data` 符号链接通过使用 [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html) 自动更新。

<!--
Exit the shell:
-->
退出 shell：

```shell
/# exit
```

<!--
## Store Container fields

The preceding exercise, you stored Pod fields in a DownwardAPIVolumeFile.
In this next exercise, you store Container fields. Here is the configuration
file for a Pod that has one Container:
-->
## 存储 Container 字段

在前面的练习中，您将 Pod 字段存储在 DownwardAPIVolumeFile 中。
在下一个练习中，您将存储 Container 字段。这里是包含一个容器的 Pod 的配置文件：

{% include code.html language="yaml" file="dapi-volume-resources.yaml" ghlink="/docs/tasks/inject-data-application/dapi-volume-resources.yaml" %}

<!--
In the configuration file, you can see that the Pod has a `downwardAPI` Volume,
and the Container mounts the Volume at `/etc`.
-->
在这个配置文件中，您可以看到这个 Pod 有一个 `downwardAPI` 卷，容器把卷挂载在 `/etc` 。

<!--
Look at the `items` array under `downwardAPI`. Each element of the array is a
DownwardAPIVolumeFile.

The first element specifies that in the Container named `client-container`,
the value of the `limits.cpu` field
should be stored in a file named `cpu_limit`.
-->
看下在 `downwardAPI` 下的 `items` 数组。这个数组中的每个元素是一个 [DownwardAPIVolumeFile](/docs/resources-reference/{{page.version}}/#downwardapivolumefile-v1-core)。

第一个元素指定了名字为 `client-container` 容器的 `limits.cpu` 字段应该存储在名为 `cpu_limit` 的文件中。

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-volume-resources.yaml
```

<!--
Get a shell into the Container that is running in your Pod:
-->
获取您的 Pod 中运行的容器的 shell：

```
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

<!--
In your shell, view the `cpu_limit` file:
-->
在您的 shell 中，查看 `cpu_limit` 文件：

```shell
/# cat /etc/cpu_limit
```
<!--
You can use similar commands to view the `cpu_request`, `mem_limit` and
`mem_request` files.
-->
您可以使用相似的命令查看 `cpu_request`、`mem_limit` 和 `mem_request` 文件。

{% endcapture %}

{% capture discussion %}

<!--
## Capabilities of the Downward API
-->
## Downward API 的能力

<!--
The following information is available to Containers through environment
variables and DownwardAPIVolumeFiles:
-->
以下信息可以通过环境变量和 DownwardAPIVolumeFiles 提供给容器：

<!--
* The Node’s name
* The Node's IP
* The Pod’s name
* The Pod’s namespace
* The Pod’s IP address
* The Pod’s service account name
* The Pod’s UID
* A Container’s CPU limit
* A Container’s CPU request
* A Container’s memory limit
* A Container’s memory request
-->
* Node 名称
* Node IP
* Pod 名称
* Pod namespace
* Pod IP 地址
* Pod 的 serviceaccount 名称
* Pod 的 UID
* 容器的 CPU limit
* 容器的 CPU request
* 容器的内存 limit
* 容器的内存 request

<!--
In addition, the following information is available through
DownwardAPIVolumeFiles.
-->
另外，通过 DownwardAPIVolumeFiles 还可以提供以下信息：

<!--
* The Pod's labels
* The Pod's annotations
-->
* Pod 的 labels
* Pod 的 annotations

<!--
**Note:** If CPU and memory limits are not specified for a Container, the
Downward API defaults to the node allocatable value for CPU and memory.
{: .note}
-->
**注意:** 如果 CPU 和 内存 limits 没有指定，Downward API 的默认值是 Node 可分配的 CPU 和内存。
{: .note}

## Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. For more information, see
[Secrets](/docs/concepts/configuration/secret/).

<!--
## Motivation for the Downward API
-->
## Downward API 的动机

<!--
It is sometimes useful for a Container to have information about itself, without
being overly coupled to Kubernetes. The Downward API allows containers to consume
information about themselves or the cluster without using the Kubernetes client
or API server.
-->
对于容器来说，有时在不和 Kubernetes 过度耦合的情况下获得关于它自己的信息非常有用。Downward API 允许容器获取有关自己或集群的信息，而不使用 Kubernetes 客户端
或 API server。

<!--
An example is an existing application that assumes a particular well-known
environment variable holds a unique identifier. One possibility is to wrap the
application, but that is tedious and error prone, and it violates the goal of low
coupling. A better option would be to use the Pod's name as an identifier, and
inject the Pod's name into the well-known environment variable.
-->
一个例子是假定一个已经存在的应用程序拥有一个特别的知名环境变量，这个环境变量有唯一的标识符。一种可能性是包装应用程序，
但是很乏味而且容易出错，它违反了低耦合的目标。一个更好的选择是，使用 Pod 名称作为标识符，然后将 Pod 名称转入到这环境变量中。



{% endcapture %}


{% capture whatsnext %}

* [PodSpec](/docs/resources-reference/{{page.version}}/#podspec-v1-core)
* [Volume](/docs/resources-reference/{{page.version}}/#volume-v1-core)
* [DownwardAPIVolumeSource](/docs/resources-reference/{{page.version}}/#downwardapivolumesource-v1-core)
* [DownwardAPIVolumeFile](/docs/resources-reference/{{page.version}}/#downwardapivolumefile-v1-core)
* [ResourceFieldSelector](/docs/resources-reference/{{page.version}}/#resourcefieldselector-v1-core)

{% endcapture %}

{% include templates/task.md %}

