---
title: 联邦 ConfigMap
content_template: templates/task
---
<!--
---
title: Federated ConfigMap
content_template: templates/task
---
-->

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}
<!--
This guide explains how to use ConfigMaps in a Federation control plane.

Federated ConfigMaps are very similar to the traditional [Kubernetes
ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) and provide the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->
本指南介绍如何在联邦控制平面中使用 ConfigMap。

联邦 ConfigMap 与传统 [Kubernetes
ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) 非常相似且提供相同的功能。
在联邦控制平面中创建它们可以确保它们在联邦的所有集群中同步。

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
<!--
* You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) in particular.
-->
* 通常我们还期望您拥有基本的 [Kubernetes 应用知识](/docs/tutorials/kubernetes-basics/)，
特别是 [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) 相关的应用知识。
{{% /capture %}}

{{% capture steps %}}

<!--
## Creating a Federated ConfigMap

The API for Federated ConfigMap is 100% compatible with the
API for traditional Kubernetes ConfigMap. You can create a ConfigMap by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f myconfigmap.yaml
```

The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a Federated ConfigMap is created, the federation control plane will create
a matching ConfigMap in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get configmap myconfigmap
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These ConfigMaps in underlying clusters will match the Federated ConfigMap.
-->
## 创建联邦 ConfigMap

联邦 ConfigMap 的 API 100% 兼容传统 Kubernetes ConfigMap 的 API。您可以通过向联邦 apiserver 发送请求来创建 ConfigMap。
您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行下面的指令来创建联邦 ConfigMap：

``` shell
kubectl --context=federation-cluster create -f myconfigmap.yaml
```

`--context=federation-cluster` 参数告诉 kubectl 将请求提交到联邦 apiserver 而不是发送给某一个 Kubernetes 集群。

一旦联邦 ConfigMap 被创建，联邦控制平面就会在所有底层 Kubernetes 集群中创建匹配的 ConfigMap。
您可以通过检查底层每个集群来对其进行验证，例如：

``` shell
kubectl --context=gce-asia-east1a get configmap myconfigmap
```

上面的命令假定您在客户端中配置了一个叫做 ‘gce-asia-east1a’ 的上下文。

这些底层集群中的 ConfigMap 将与 联邦 ConfigMap 相匹配。

<!--
## Updating a Federated ConfigMap

You can update a Federated ConfigMap as you would update a Kubernetes
ConfigMap; however, for a Federated ConfigMap, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the Federated ConfigMap is
updated, it updates the corresponding ConfigMaps in all underlying clusters to
match it.
-->
## 更新联邦 ConfigMap

您可以像更新 Kubernetes ConfigMap 一样更新联邦 ConfigMap。
但是对于联邦 ConfigMap，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。
联邦控制平面会确保每当联邦 ConfigMap 更新时，它会更新所有底层集群中的 ConfigMap 来和更新后的内容保持一致。

<!--
## Deleting a Federated ConfigMap

You can delete a Federated ConfigMap as you would delete a Kubernetes
ConfigMap; however, for a Federated ConfigMap, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete configmap
```
-->
## 删除联邦 ConfigMap

您可以像删除 Kubernetes ConfigMap 一样删除联邦 ConfigMap。
但是，对于联邦 ConfigMap，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。
例如，您可以使用 kubectl 运行下面的命令来删除联邦 ConfigMap：

```shell
kubectl --context=federation-cluster delete configmap
```

{{< note >}}
<!--
Deleting a Federated ConfigMap does not delete the corresponding ConfigMaps from underlying clusters. You must delete the underlying ConfigMaps manually.
-->
要注意的是这时删除联邦 ConfigMap 并不会删除底层集群中对应的 ConfigMap。您必须自己手动删除底层集群中的 ConfigMap。
{{< /note >}}

{{% /capture %}}


