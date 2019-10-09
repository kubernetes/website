---
title: 通过文件将Pod信息呈现给容器
content_template: templates/task
---

{{% capture overview %}}

此页面描述Pod如何使用DownwardAPIVolumeFile把自己的信息呈现给pod中运行的容器。DownwardAPIVolumeFile可以呈现pod的字段和容器字段。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Downward API

有两种方式可以将Pod和Container字段呈现给运行中的容器：

* [环境变量](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/)
* DownwardAPIVolumeFile

这两种呈现Pod和Container字段的方式都称为*Downward API*。

## 存储Pod字段

在这个练习中，你将创建一个包含一个容器的pod。这是该pod的配置文件：

{{< code file="dapi-volume.yaml" >}}

在配置文件中，你可以看到Pod有一个`downwardAPI`类型的Volume，并且挂载到容器中的`/etc`。

查看`downwardAPI`下面的`items`数组。每个数组元素都是一个[DownwardAPIVolumeFile](/docs/resources-reference/{{< param "version" >}}/#downwardapivolumefile-v1-core)。
第一个元素指示Pod的`metadata.labels`字段的值保存在名为`labels`的文件中。
第二个元素指示Pod的`annotations`字段的值保存在名为`annotations`的文件中。

{{< note >}}
**注意:** 本示例中的字段是Pod字段，不是Pod中容器的字段。 
{{< /note >}}

创建 Pod：

```shell
kubectl create -f https://k8s.io/cn/docs/tasks/inject-data-application/dapi-volume.yaml
```

验证Pod中的容器运行正常：

```shell
kubectl get pods
```

查看容器的日志：

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

<!--
The output shows the contents of the labels file and the annotations file:
-->
输出显示 `labels` 和 `annotations` 文件的内容：

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

进入Pod中运行的容器，打开一个shell：

```
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

在该shell中，查看`labels`文件：

```shell
/# cat /etc/labels
```

输出显示Pod的所有labels都已写入`labels`文件。

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

同样，查看`annotations`文件：

```shell
/# cat /etc/annotations
```

查看`/etc`目录下的文件：

```shell
/# ls -laR /etc
```

在输出中可以看到，`labels` 和 `annotations`文件都在一个临时子目录中：这个例子，`..2982_06_02_21_47_53.299460680`。在`/etc`目录中，`..data`是一个指向临时子目录
的符号链接。`/etc`目录中，`labels` 和 `annotations`也是符号链接。

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

用符号链接可实现元数据的动态原子刷新；更新将写入一个新的临时目录，然后`..data`符号链接完成原子更新，通过使用[rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html)。

退出shell：

```shell
/# exit
```

## 存储容器字段

前面的练习中，你将Pod字段保存到DownwardAPIVolumeFile中。接下来这个练习，你将存储容器字段。这里是包含一个容器的pod的配置文件：

{{< code file="dapi-volume-resources.yaml" >}}

在这个配置文件中，你可以看到Pod有一个`downwardAPI`类型的Volume,并且挂载到容器的`/etc`目录。

查看`downwardAPI`下面的`items`数组。每个数组元素都是一个DownwardAPIVolumeFile。

第一个元素指定名为`client-container`的容器中`limits.cpu`字段的值应保存在名为`cpu_limit`的文件中。

创建Pod：

```shell
kubectl create -f https://k8s.io/cn/docs/tasks/inject-data-application/dapi-volume-resources.yaml
```

进入Pod中运行的容器，打开一个shell：

```
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

在shell中，查看`cpu_limit`文件：

```shell
/# cat /etc/cpu_limit
```
你可以使用同样的命令查看`cpu_request`, `mem_limit` 和`mem_request` 文件.

{{% /capture %}}

{{% capture discussion %}}

## Capabilities of the Downward API

下面这些信息可以通过环境变量和DownwardAPIVolumeFiles提供给容器：

能通过`fieldRef`获得的：
  * `metadata.name` - Pod名称
  * `metadata.namespace` - Pod名字空间
  * `metadata.uid` - Pod的UID, 版本要求 v1.8.0-alpha.2
  * `metadata.labels['<KEY>']` - 单个 pod 标签值 `<KEY>` (例如, `metadata.labels['mylabel']`); 版本要求 Kubernetes 1.9+
  * `metadata.annotations['<KEY>']` - 单个 pod 的标注值 `<KEY>` (例如, `metadata.annotations['myannotation']`); 版本要求 Kubernetes 1.9+

能通过`resourceFieldRef`获得的：
  * 容器的CPU约束值
  * 容器的CPU请求值
  * 容器的内存约束值
  * 容器的内存请求值
  * 容器的临时存储约束值, 版本要求 v1.8.0-beta.0
  * 容器的临时存储请求值, 版本要求 v1.8.0-beta.0

此外，以下信息可通过DownwardAPIVolumeFiles从`fieldRef`获得：

* `metadata.labels` - all of the pod’s labels, formatted as `label-key="escaped-label-value"` with one label per line
* `metadata.annotations` - all of the pod’s annotations, formatted as `annotation-key="escaped-annotation-value"` with one annotation per line
* `metadata.labels` - 所有Pod的标签，以`label-key="escaped-label-value"`格式显示，每行显示一个label
* `metadata.annotations` - Pod的注释，以`annotation-key="escaped-annotation-value"`格式显示，每行显示一个标签

以下信息可通过环境变量从`fieldRef`获得：

* `status.podIP` - 节点IP
* `spec.serviceAccountName` - Pod服务帐号名称, 版本要求 v1.4.0-alpha.3
* `spec.nodeName` - 节点名称, 版本要求 v1.4.0-alpha.3
* `status.hostIP` - 节点IP, 版本要求 v1.7.0-alpha.1

{{< note >}}
如果容器未指定CPU和memory limits，则Downward API默认为节点可分配值。
{{< /note >}}

## 投射密钥到指定路径并且指定文件权限

你可以将密钥投射到指定路径并且指定每个文件的访问权限。更多信息，请参阅[Secrets](/docs/concepts/configuration/secret/).

## Downward API的动机

对于容器来说，有时候拥有自己的信息是很有用的，可避免与Kubernetes过度耦合。Downward API使得容器使用自己或者集群的信息，而不必通过Kubernetes客户端或API服务器。

一个例子是有一个现有的应用假定要用一个非常熟悉的环境变量来保存一个唯一标识。一种可能是给应用增加处理层，但这样是冗余和易出错的，而且它违反了低耦合的目标。更好的选择是使用Pod名称作为标识，把Pod名称注入这个环境变量中。
{{% /capture %}}


{{% capture whatsnext %}}

* [PodSpec](/docs/resources-reference/{{< param "version" >}}/#podspec-v1-core)
* [Volume](/docs/resources-reference/{{< param "version" >}}/#volume-v1-core)
* [DownwardAPIVolumeSource](/docs/resources-reference/{{< param "version" >}}/#downwardapivolumesource-v1-core)
* [DownwardAPIVolumeFile](/docs/resources-reference/{{< param "version" >}}/#downwardapivolumefile-v1-core)
* [ResourceFieldSelector](/docs/resources-reference/{{< param "version" >}}/#resourcefieldselector-v1-core)

{{% /capture %}}


