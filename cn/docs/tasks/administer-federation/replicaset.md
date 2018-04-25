---
title: 联邦 ReplicaSet
cn-approvers:
- pigletfly
---

<!--
---
title: Federated ReplicaSets
---
-->
<!--
{% capture overview %}
This guide explains how to use ReplicaSets in the Federation control plane.

ReplicaSets in the federation control plane (referred to as "federated ReplicaSets" in
this guide) are very similar to the traditional [Kubernetes
ReplicaSets](/docs/concepts/workloads/controllers/replicaset/), and provide the same functionality.
Creating them in the federation control plane ensures that the desired number of
replicas exist across the registered clusters.
{% endcapture %}
-->
{% capture overview %}
本指南阐述了如何在联邦控制平面中使用 ReplicaSet 。

在联邦控制平面中的 ReplicaSet (在本指南中称为"联邦 ReplicaSet") 和传统的 [Kubernetes ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)很相似，提供了一样的功能。在联邦控制平面中创建联邦 ReplicaSet 可以确保在联邦的所有集群中都有预期数量的副本。
{% endcapture %}

<!--
{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general and [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/) in particular.
{% endcapture %}

{% capture steps %}
-->
{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
* 您应该对 [Kubernetes 工作知识](/docs/setup/) 有基本了解，尤其是 [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) 相关的知识。
{% endcapture %}

{% capture steps %}

<!--
## Creating a Federated ReplicaSet

The API for Federated ReplicaSet is 100% compatible with the
API for traditional Kubernetes ReplicaSet. You can create a ReplicaSet by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f myrs.yaml
```
-->
## 创建联邦 ReplicaSet

联邦 ReplicaSet 的 API 和传统的 Kubernetes ReplicaSet API 是 100% 兼容的。您可以通过请求联邦 apiserver 来创建联邦 ReplicaSet。

您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行下面的指令来创建联邦 ReplicaSet

``` shell
kubectl --context=federation-cluster create -f myrs.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated ReplicaSet is created, the federation control plane will create
a ReplicaSet in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get rs myrs
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

The ReplicaSets in the underlying clusters will match the federation ReplicaSet
except in the number of replicas. The federation control plane will ensure that the
sum of the replicas in each cluster match the desired number of replicas in the
federation ReplicaSet.
-->
`--context=federation-cluster` 参数告诉 kubectl 发送请求到联邦 apiserver 而不是某个 Kubernetes 集群。

一旦联邦 ReplicaSet 被创建了，联邦控制平面就会在所有底层 Kubernetes 集群中创建一个 ReplicaSet.
您可以通过检查底层每个集群来对其进行验证，例如：

``` shell
kubectl --context=gce-asia-east1a get rs myrs
```

上面的命令假定您在客户端中配置了一个叫做 'gce-asia-east1a' 的上下文，用于请求那个区域的集群。

底层集群中的 ReplicaSet 的副本数将会和联邦 ReplicaSet 的副本数保持一致。联邦控制平面将确保联邦的所有集群都和联邦 ReplicaSet 有同样的副本数。

<!--
### Spreading Replicas in Underlying Clusters

By default, replicas are spread equally in all the underlying clusters. For example:
if you have 3 registered clusters and you create a federated ReplicaSet with
`spec.replicas = 9`, then each ReplicaSet in the 3 clusters will have
`spec.replicas=3`.
To modify the number of replicas in each cluster, you can specify
[FederatedReplicaSetPreference](https://github.com/kubernetes/federation/blob/{{page.githubbranch}}/apis/federation/types.go)
as an annotation with key `federation.kubernetes.io/replica-set-preferences`
on the federated ReplicaSet.
-->
### 底层集群中副本的分布

默认情况下，副本在所有底层集群中是均匀分布的。例如：如果您有 3 个注册的集群并且用 `spec.replicas = 9` 参数创建了一个联邦 ReplicaSet，然后在这 3 个集群中每个 ReplicaSet 的副本数会是 `spec.replicas=3` 。
如果要修改每个集群中的副本数，您可以在联邦 ReplicaSet 中使用 `federation.kubernetes.io/replica-set-preferences` 作为注解键值来修改 [FederatedReplicaSetPreference](https://github.com/kubernetes/federation/blob/{{page.githubbranch}}/apis/federation/types.go) 。

<!--
## Updating a Federated ReplicaSet

You can update a federated ReplicaSet as you would update a Kubernetes
ReplicaSet; however, for a federated ReplicaSet, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated ReplicaSet is
updated, it updates the corresponding ReplicaSet in all underlying clusters to
match it.
If your update includes a change in number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that their sum remains equal to the number of desired replicas in
federated ReplicaSet.
-->

## 更新联邦 ReplicaSet

您可以像更新 Kubernetes ReplicaSet 一样更新联邦 ReplicaSet。但是，对于联邦 ReplicaSet，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。联邦控制平面会确保任何时候联邦 ReplicaSet 更新后，它会将对应的 ReplicaSet 更新到所有的底层集群中来和它保持一致。

如果您做了包含副本数量的更改，联邦控制平面将会更改底层集群中的副本数以确保它们的总数和联邦 ReplicaSet 期望的副本数保持一致。

<!--
## Deleting a Federated ReplicaSet

You can delete a federated ReplicaSet as you would delete a Kubernetes
ReplicaSet; however, for a federated ReplicaSet, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete rs myrs
```

Note that at this point, deleting a federated ReplicaSet will not delete the
corresponding ReplicaSets from underlying clusters.
You must delete the underlying ReplicaSets manually.
We intend to fix this in the future.

{% endcapture %}

{% include templates/task.md %}
-->
## 删除联邦 ReplicaSet

您可以像删除 Kubernetes ReplicaSet 一样删除联邦 ReplicaSet 。但是，对于联邦 ReplicaSet ，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。

例如，您可以使用 kubectl 运行下面的命令来删除联邦 ReplicaSet：

```shell
kubectl --context=federation-cluster delete rs myrs
```

要注意的是这时删除联邦 ReplicaSet 并不会删除底层集群中对应的 ReplicaSet。您必须自己手动删除底层集群中的 ReplicaSet。
我们打算在将来修复这个问题。

{% endcapture %}

{% include templates/task.md %}
