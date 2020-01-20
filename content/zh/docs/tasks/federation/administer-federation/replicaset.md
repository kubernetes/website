---
title: 联邦 ReplicaSet
content_template: templates/task
---
<!--
---
title: Federated ReplicaSets
content_template: templates/task
---
-->

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!--
This guide explains how to use ReplicaSets in the Federation control plane.

ReplicaSets in the federation control plane (referred to as "federated ReplicaSets" in
this guide) are very similar to the traditional [Kubernetes
ReplicaSets](/docs/concepts/workloads/controllers/replicaset/), and provide the same functionality.
Creating them in the federation control plane ensures that the desired number of
replicas exist across the registered clusters.
-->
本指南阐述了如何在联邦控制平面中使用 ReplicaSet。
在联邦控制平面中的 ReplicaSet (在本指南中称为”联邦 ReplicaSet”) 和传统的 [Kubernetes
ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) 很相似，提供了一样的功能。在联邦控制平面中创建联邦 ReplicaSet 可以确保在联邦的所有集群中都有预期数量的副本。
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
<!--
* You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/) in particular.
-->
* 你还应该具备基本的 [Kubernetes 应用知识](/docs/tutorials/kubernetes-basics/)，特别是 [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/) 相关的应用知识。

{{% /capture %}}

{{% capture steps %}}

<!--
## Creating a Federated ReplicaSet

The API for Federated ReplicaSet is 100% compatible with the
API for traditional Kubernetes ReplicaSet. You can create a ReplicaSet by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f myrs.yaml
```

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
## 创建联邦 ReplicaSet

联邦 ReplicaSet 的 API 和传统的 Kubernetes ReplicaSet API 是 100% 兼容的。您可以通过请求联邦 apiserver 来创建联邦 ReplicaSet。

您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行下面的指令来创建联邦 ReplicaSet：

``` shell
kubectl --context=federation-cluster create -f myrs.yaml
```

`--context=federation-cluster` 参数告诉 kubectl 发送请求到联邦 apiserver 而不是某个 Kubernetes 集群。

一旦联邦 ReplicaSet 被创建了，联邦控制平面就会在所有底层 Kubernetes 集群中创建一个 ReplicaSet。您可以通过检查底层每个集群来对其进行验证，例如：

``` shell
kubectl --context=gce-asia-east1a get rs myrs
```

上面的命令假定您在客户端中配置了一个叫做 ‘gce-asia-east1a’ 的上下文。

底层集群中的 ReplicaSet 的副本数将会和联邦 ReplicaSet 的副本数保持一致。联邦控制平面将确保联邦的所有集群都和联邦 ReplicaSet 有同样的副本数。

<!--
### Spreading Replicas in Underlying Clusters

By default, replicas are spread equally in all the underlying clusters. For example:
if you have 3 registered clusters and you create a federated ReplicaSet with
`spec.replicas = 9`, then each ReplicaSet in the 3 clusters will have
`spec.replicas=3`.
To modify the number of replicas in each cluster, you can add an annotation with
key `federation.kubernetes.io/replica-set-preferences` to the federated ReplicaSet.
The value of the annoation is a serialized JSON that contains fields shown in
the following example:

```
{
  "rebalance": true,
  "clusters": {
    "foo": {
      "minReplicas": 10,
      "maxReplicas": 50,
      "weight": 100
    },
    "bar": {
      "minReplicas": 10,
      "maxReplicas": 100,
      "weight": 200
    }
  }
}
```

The `rebalance` boolean field specifies whether replicas already scheduled and running
may be moved in order to match current state to the specified preferences.
The `clusters` object field contains a map where users can specify the constraints
for replica placement across the clusters (`foo` and `bar` in the example).
For each cluster, you can specify the minimum number of replicas that should be
assigned to it (default is zero), the maximum number of replicas the cluster can
accept (default is unbounded) and a number expressing the relative weight of
preferences to place additional replicas to that cluster.
-->
### 底层集群中副本的分布

默认情况下，副本在所有底层集群中是均匀分布的。例如：如果您有 3 个注册的集群并且用 `spec.replicas = 9` 参数创建了一个联邦 ReplicaSet，然后在这 3 个集群中每个 ReplicaSet 的副本数会是 `spec.replicas=3`。
如果要修改每个集群中的副本数，您可以在联邦 ReplicaSet 中使用 `federation.kubernetes.io/replica-set-preferences` 作为注解键值来修改联合副本集。
注解的键值是序列化的 JSON，其中包含以下示例中显示的字段：

```
{
  "rebalance": true,
  "clusters": {
    "foo": {
      "minReplicas": 10,
      "maxReplicas": 50,
      "weight": 100
    },
    "bar": {
      "minReplicas": 10,
      "maxReplicas": 100,
      "weight": 200
    }
  }
}
```
`rebalance` 布尔字段指定是否可以移动已调度和正在运行的副本，以便将当前状态与指定的首选项相匹配。
`clusters` 对象字段包含一个映射，用户可以在其中指定跨集群的副本放置的约束（示例中为 `foo` 和 `bar`）。
对于每个集群，您可以指定应分配给它的最小副本数（默认值为零），集群可以接受的最大副本数（默认为无限制）以及表示要添加该群集的副本的首选项的相对权重的数字。

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

您可以像更新 Kubernetes ReplicaSet 一样更新联邦 ReplicaSet。但是对于联邦 ReplicaSet，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。联邦控制平面会确保任何时候联邦 ReplicaSet 更新后，它会将对应的 ReplicaSet 更新到所有的底层集群中来和它保持一致。

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
-->
## 删除联邦 ReplicaSet

您可以像删除 Kubernetes ReplicaSet 一样删除联邦 ReplicaSet。但是对于联邦 ReplicaSet ，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。

例如，您可以使用 kubectl 运行下面的命令来删除联邦 ReplicaSet：

```shell
kubectl --context=federation-cluster delete rs myrs
```

{{< note >}}
<!--
At this point, deleting a federated ReplicaSet will not delete the corresponding ReplicaSets from underlying clusters. You must delete the underlying ReplicaSets manually. We intend to fix this in the future.
-->
要注意的是这时删除联邦 ReplicaSet 并不会删除底层集群中对应的 ReplicaSet。您必须自己手动删除底层集群中的 ReplicaSet。我们打算在将来修复这个问题。
{{< /note >}}

{{% /capture %}}


