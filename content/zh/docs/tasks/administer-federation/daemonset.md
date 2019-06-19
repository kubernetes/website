---
title: 联邦（Federated） DaemonSet
content_template: templates/task
---
<!--
---
title: Federated DaemonSet
content_template: templates/task
---
-->

{{% capture overview %}}

{{< note >}}
{{< include "federation-current-state.md" >}}
{{< /note >}}

<!--
This guide explains how to use DaemonSets in a federation control plane.
-->
本指南介绍了如何在联邦控制平面中使用 DaemonSet。

<!--
DaemonSets in the federation control plane ("Federated Daemonsets" in
this guide) are very similar to the traditional Kubernetes
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/) and provide the same functionality.
-->
联邦控制平面中的 DaemonSet （即本指南中的联邦 DaemonSet）与传统的 Kubernetes [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) 非常相似，并提供相同的功能。

<!--
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->
在联邦控制平面中创建它们可以确保它们跨联邦中的所有集群保持同步。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
* {{< include "federated-task-tutorial-prereqs.md" >}}
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
general and [DaemonSets](/docs/concepts/workloads/controllers/daemonset/) in particular.
* -->
* {{< include "federated-task-tutorial-prereqs.md" >}}
* 您还需要具备基本的 [Kubernetes 工作知识](/docs/setup/pick-right-solution/)，特别是关于 [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)。

{{% /capture %}}

{{% capture steps %}}

<!--
## Creating a Federated Daemonset
-->
## 创建一个联邦 DaemonSet

<!--
The API for Federated Daemonset is 100% compatible with the
API for traditional Kubernetes DaemonSet.
-->
用于联邦 DaemonSet 的 API 与用于传统 Kubernetes DaemonSet 的 API 100% 兼容。
<!--
You can create a DaemonSet by sending a request to the federation apiserver.
-->
您可以通过向联邦 apiserver 发送请求来创建 DaemonSet。

<!--
You can do that using [kubectl](/docs/user-guide/kubectl/) by running:
-->
您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行以下命令来执行此操作：

``` shell
kubectl --context=federation-cluster create -f mydaemonset.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数告诉 kubectl 将请求提交给联邦 apiserver，
而不是发送给 Kubernetes 集群。

<!--
Once a Federated Daemonset is created, the federation control plane will create
a matching DaemonSet in all underlying Kubernetes clusters.
-->
一旦创建了联邦 DaemonSet，联邦控制平面将在所有底层 Kubernetes 集群中创建匹配的 DaemonSet。
<!--
You can verify this by checking each of the underlying clusters, for example:
-->
您可以通过检查每个基础集群来验证这一点，例如：

``` shell
kubectl --context=gce-asia-east1a get daemonset mydaemonset
```

<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.
-->
上面假设您的客户机中为该区域中的集群配置了一个名为 'gce-asia-east1a' 的上下文。

<!--
## Updating a Federated Daemonset
-->
## 更新联邦 DaemonSet

<!--
You can update a Federated Daemonset as you would update a Kubernetes DaemonSet;
-->
您可以像更新 Kubernetes DaemonSet 一样更新联邦 DaemonSet；
<!--
however, for a Federated Daemonset, you must send the request to
-->
但是，对于联邦 DaemonSet，您必须将请求发送到
<!--
the federation apiserver instead of sending it to a specific Kubernetes cluster.
-->
联邦 apiserver 而不是将其发送到特定的 Kubernetes 集群。
<!--
The federation control plane ensures that whenever the Federated Daemonset is
updated, it updates the corresponding DaemonSets in all underlying clusters to
match it.
-->
联邦控制平面确保每当更新联邦 DaemonSet 时，它都会更新所有底层集群中的相应 DaemonSet 以匹配它。

<!--
## Deleting a Federated Daemonset
-->
## 删除联邦 DaemonSet

<!--
You can delete a Federated Daemonset as you would delete a Kubernetes DaemonSet; 
-->
您可以删除联邦 DaemonSet，就像删除 Kubernetes DaemonSet 一样；
<!--
however, for a Federated Daemonset, you must send the request to
-->
但是，对于联邦 DaemonSet，您必须将请求发送到
<!--
the federation apiserver instead of sending it to a specific Kubernetes cluster.
-->
联邦 apiserver 而不是将其发送到特定的 Kubernetes 集群。

<!--
For example, you can do that using kubectl by running:
-->
例如，您可以通过使用 kubectl 运行以下命令执行此操作：

```shell
kubectl --context=federation-cluster delete daemonset mydaemonset
```

{{% /capture %}}
