---
cn-approvers:
- lichuqiang
title: 联邦 Deployment
---
<!--
---
title: Federated Deployment
---
-->

{% capture overview %}
<!--
This guide explains how to use Deployments in the Federation control plane.
-->
本指南说明了如何在联邦控制平面中使用 Deployment。

<!--
Deployments in the federation control plane (referred to as "Federated Deployments" in
this guide) are very similar to the traditional [Kubernetes
Deployment](/docs/concepts/workloads/controllers/deployment/) and provide the same functionality.
Creating them in the federation control plane ensures that the desired number of
replicas exist across the registered clusters.
-->
联邦控制平面中的 Deployment（在本指南中称为 “联邦 Deployment”）与传统的
[Kubernetes Deployment](/docs/concepts/workloads/controllers/deployment/) 非常类似，
并提供相同的功能。 在联邦控制平面中创建联邦 Deployment 确保所需的副本数存在于注册的群集中。

<!--
**As of Kubernetes version 1.5, Federated Deployment is an Alpha feature. The core
functionality of Deployment is present, but some features
(such as full rollout compatibility) are still in development.**
-->
**到 Kubernetes 1.5 版本为止，联邦 Deployment 还是一个 Alpha 特性。 Deployment 的核心功能已经提供，
但一些特性（例如完整的 rollout 兼容性）仍在开发中。**
{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
<!--
* You should also have a basic
[working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
general and [Deployments](/docs/concepts/workloads/controllers/deployment/) in particular.
-->
* 通常您还应当拥有基本的 [Kubernetes 应用知识](/docs/setup/pick-right-solution/)，特别是 [Deployment](/docs/concepts/workloads/controllers/deployment/) 相关的应用知识。

{% endcapture %}

{% capture steps %}
<!--
## Creating a Federated Deployment

The API for Federated Deployment is compatible with the
API for traditional Kubernetes Deployment. You can create a Deployment by sending
a request to the federation apiserver.
-->
## 创建联邦 Deployment

联邦 Deployment 的 API 和传统的 Kubernetes Deployment API 是兼容的。
您可以通过向联邦 apiserver 发送请求来创建一个 Deployment。

<!--
You can do that using [kubectl](/docs/user-guide/kubectl/) by running:
-->
您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行下面的指令来创建联邦 Deployment：

``` shell
kubectl --context=federation-cluster create -f mydeployment.yaml
```

<!--
The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数告诉 kubectl 发送请求到联邦 apiserver 而不是某个 Kubernetes 集群。

<!--
Once a Federated Deployment is created, the federation control plane will create
a Deployment in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->
一旦联邦 Deployment 被创建，联邦控制平面会在所有底层 Kubernetes 集群中创建一个 Deployment。
您可以通过检查底层每个集群来对其进行验证，例如：

``` shell
kubectl --context=gce-asia-east1a get deployment mydep
```

<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.
-->
上面的命令假定您在客户端中配置了一个叫做 'gce-asia-east1a' 的上下文，用于向相应区域的集群发送请求。

<!--
These Deployments in underlying clusters will match the federation Deployment
_except_ in the number of replicas and revision-related annotations.
Federation control plane ensures that the
sum of replicas in each cluster combined matches the desired number of replicas in the
Federated Deployment.
-->
底层集群中的这些 Deployment 会匹配联邦 Deployment 中副本数和修订版本（revision）相关注解_之外_的信息。
联邦控制平面确保所有集群中的副本总数与联邦 Deployment 中请求的副本数量匹配。

<!--
### Spreading Replicas in Underlying Clusters

By default, replicas are spread equally in all the underlying clusters. For example:
if you have 3 registered clusters and you create a Federated Deployment with
`spec.replicas = 9`, then each Deployment in the 3 clusters will have
`spec.replicas=3`.
-->
### 在底层集群中分布副本

默认情况下，副本会被平均分布到所有的底层集群中。 例如： 如果您有3个注册的集群并且创建了一个副本数为 9
（`spec.replicas = 9`）的联邦 Deployment，那么这 3 个集群中的每个 Deployment 都将有 3 个副本
（`spec.replicas=3`）。
<!--
To modify the number of replicas in each cluster, you can specify
[FederatedReplicaSetPreference](https://github.com/kubernetes/federation/blob/{{page.githubbranch}}/apis/federation/types.go)
as an annotation with key `federation.kubernetes.io/deployment-preferences`
on Federated Deployment.
-->
为修改每个集群中的 副本数，您可以在联邦 Deployment 中以注解的形式指定 [FederatedReplicaSetPreference](https://github.com/kubernetes/federation/blob/{{page.githubbranch}}/apis/federation/types.go)，
其中注解的键为 `federation.kubernetes.io/deployment-preferences`。


<!--
## Updating a Federated Deployment

You can update a Federated Deployment as you would update a Kubernetes
Deployment; however, for a Federated Deployment, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The federation control plane ensures that whenever the Federated Deployment is
updated, it updates the corresponding Deployments in all underlying clusters to
match it. So if the rolling update strategy was chosen then the underlying
cluster will do the rolling update independently and `maxSurge` and `maxUnavailable`
will apply only to individual clusters. This behavior may change in the future.
-->
## 更新联邦 Deployment

您可以像更新 Kubernetes Deployment 一样更新联邦 Deployment。 但是，对于联邦 Deployment，
您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。
联邦控制平面会确保每当联邦 Deployment 更新时，它会更新所有底层集群中相应的 Deployment 来和更新后的内容保持一致。
所以如果（在联邦 Deployment 中）选择了滚动更新，那么底层集群会独立地进行滚动更新，并且联邦 Deployment
中的 `maxSurge` and `maxUnavailable` 只会应用于独立的集群中。 将来这种行为可能会改变。

<!--
If your update includes a change in number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that their sum remains equal to the number of desired replicas in
Federated Deployment.
-->
如果您的更新包括副本数量的变化，联邦控制平面会改变底层集群中的副本数量，以确保它们的总数等于联邦 Deployment 中请求的数量。

<!--
## Deleting a Federated Deployment

You can delete a Federated Deployment as you would delete a Kubernetes
Deployment; however, for a Federated Deployment, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
-->
## 删除联邦 Deployment

您可以像删除 Kubernetes Deployment 一样删除联邦 Deployment。但是，对于联邦 Deployment，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。

<!--
For example, you can do that using kubectl by running:
-->
例如，您可以使用 kubectl 运行下面的命令来删除联邦 Deployment：

```shell
kubectl --context=federation-cluster delete deployment mydep
```

{% endcapture %}

{% include templates/task.md %}
