---
cn-approvers:
- lichuqiang
title: 联邦 DaemonSet
---
<!--
---
title: Federated DaemonSet
---
-->

{% capture overview %}
<!--
This guide explains how to use DaemonSets in a federation control plane.
-->
本指南说明了如何在联邦控制平面中使用 DaemonSet。

<!--
DaemonSets in the federation control plane ("Federated Daemonsets" in
this guide) are very similar to the traditional Kubernetes
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/) and provide the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->
联邦控制平面中的 DaemonSet（在本指南中称为 “联邦 DaemonSet”）与传统的 Kubernetes
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) 非常类似，
并提供相同的功能。 在联邦控制平面中创建联邦 DaemonSet 可以确保它们同步到联邦的所有集群中。
{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
<!--
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
general and [DaemonSets](/docs/concepts/workloads/controllers/daemonset/) in particular.
-->
* 通常我们还期望您拥有基本的 [ Kubernetes 应用知识](/docs/setup/pick-right-solution/)，特别是 [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) 相关的应用知识。

{% endcapture %}

{% capture steps %}

<!--
## Creating a Federated Daemonset

The API for Federated Daemonset is 100% compatible with the
API for traditional Kubernetes DaemonSet. You can create a DaemonSet by sending
a request to the federation apiserver.
-->
## 创建联邦 Daemonset

联邦 Daemonset 的 API 和传统的 Kubernetes Daemonset API 是 100% 兼容的。
您可以通过向联邦 apiserver 发送请求来创建一个 DaemonSet。

<!--
You can do that using [kubectl](/docs/user-guide/kubectl/) by running:
-->
您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行下面的指令来创建联邦 Daemonset：

``` shell
kubectl --context=federation-cluster create -f mydaemonset.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数告诉 kubectl 发送请求到联邦 apiserver 而不是某个 Kubernetes 集群。

<!--
Once a Federated Daemonset is created, the federation control plane will create
a matching DaemonSet in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->
一旦联邦 Daemonset 被创建，联邦控制平面就会在所有底层 Kubernetes 集群中创建匹配的 Daemonset。
您可以通过检查底层每个集群来对其进行验证，例如：

``` shell
kubectl --context=gce-asia-east1a get daemonset mydaemonset
```

<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.
-->
上面的命令假定您在客户端中配置了一个叫做 'gce-asia-east1a' 的上下文，用于向相应区域的集群发送请求。


<!--
## Updating a Federated Daemonset

You can update a Federated Daemonset as you would update a Kubernetes
DaemonSet; however, for a Federated Daemonset, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the Federated Daemonset is
updated, it updates the corresponding DaemonSets in all underlying clusters to
match it.
-->
## 更新联邦 Daemonset

您可以像更新 Kubernetes Daemonset 一样更新联邦 Daemonset。 但是，对于联邦 Daemonset，
您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。
联邦控制平面会确保每当联邦 Daemonset 更新时，它会更新所有底层集群中的 Daemonset 来和更新后的内容保持一致。

<!--
## Deleting a Federated Daemonset

You can delete a Federated Daemonset as you would delete a Kubernetes
DaemonSet; however, for a Federated Daemonset, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
-->
## 删除联邦 Daemonset

您可以像删除 Kubernetes Daemonset 一样删除联邦 Daemonset。但是，对于联邦 Daemonset，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。

<!--
For example, you can do that using kubectl by running:
-->
例如，您可以使用 kubectl 运行下面的命令来删除联邦 Daemonset：

```shell
kubectl --context=federation-cluster delete daemonset mydaemonset
```

{% endcapture %}

{% include templates/task.md %}
