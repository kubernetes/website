---
title: 联邦命名空间
content_type: task
---

<!--
---
title: Federated Namespaces
content_type: task
---
-->

<!-- overview -->

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!--
This guide explains how to use Namespaces in Federation control plane.
-->
本指南介绍如何在联邦控制平面中使用命名空间。

<!--
Namespaces in federation control plane (referred to as "federated Namespaces" in
this guide) are very similar to the traditional [Kubernetes
Namespaces](/docs/concepts/overview/working-with-objects/namespaces/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->
联邦控制平面中的命名空间（本指南中称为“联邦命名空间”）与提供相同功能的传统 Kubernetes 命名空间非常相似。
在联邦控制平面中创建它们可确保它们在联邦中的所有集群之间同步



## {{% heading "prerequisites" %}}


* {{< include "federated-task-tutorial-prereqs.md" >}}
* 您还需要具备基本的 [Kubernetes 工作知识](/docs/tutorials/Kubernetes-basics/)，
特别是[命名空间](/docs/concepts/overview/working-objects/Namespaces/)。

<!--
You are also expected to have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [Namespaces](/docs/concepts/overview/working-with-objects/namespaces/) in particular.
-->



<!-- steps -->

<!--
## Creating a Federated Namespace
-->

## 创建联邦命名空间

<!--
The API for Federated Namespaces is 100% compatible with the
API for traditional Kubernetes Namespaces. You can create a Namespace by sending
a request to the federation apiserver.
-->
联邦命名空间的 API 与传统 Kubernetes 命名空间的 API 100％ 兼容。您可以通过向联邦身份验证程序发送请求来创建命名空间。

<!--
You can do that using kubectl by running:
-->
您可以通过运行以下命令使用 kubectl 执行此操作：

``` shell
kubectl --context=federation-cluster create -f myns.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数通知 kubectl 将请求提交给联邦 apiserver，而不是将其发送到 Kubernetes 集群。

<!--
Once a federated Namespace is created, the federation control plane will create
a matching Namespace in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->
创建联邦命名空间后，联邦控制平面将在所有基础 Kubernetes 集群中创建匹配的命名空间。您可以通过检查每个基础集群来验证这一点，例如：

``` shell
kubectl --context=gce-asia-east1a get namespaces myns
```

<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
spec of the underlying Namespace will match those of
the Federated Namespace that you created above.
-->
以上假设您在客户端中为该区域中的集群配置了名为 “gce-asia-east1a” 的上下文。
基础命名空间的名称和规范将与您在上面创建的联邦命名空间的名称和规范相匹配。

<!--
## Updating a Federated Namespace
-->

## 更新联邦命名空间

<!--
You can update a federated Namespace as you would update a Kubernetes
Namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.
Federation control plane will ensure that whenever the federated Namespace is
updated, it updates the corresponding Namespaces in all underlying clusters to
match it.
-->
您可以像更新 Kubernetes 命名空间一样更新联邦命名空间，只需将请求发送到联邦身份验证程序，而不是将其发送到指定的 Kubernetes 集群。
联邦控制平面将确保每当更新联邦命名空间时，它都会更新所有基础集群中的相应命名空间以与其匹配。

<!--
## Deleting a Federated Namespace
-->

## 删除联邦命名空间

<!--
You can delete a federated Namespace as you would delete a Kubernetes
Namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.
-->
你可以删除联邦命名空间，就像删除 Kubernetes 命名空间一样，只需将请求发送到联邦身份验证器，而不是发送到指定的 Kubernetes 群集。

<!--
For example, you can do that using kubectl by running:
-->
例如，您可以通过运行以下命令使用 kubectl 执行此操作：

```shell
kubectl --context=federation-cluster delete ns myns
```

<!--
As in Kubernetes, deleting a federated Namespace will delete all resources in that
Namespace from the federation control plane.
-->
与在 Kubernetes 中一样，删除联邦命名空间将从联邦控制平面中删除该命名空间中的所有资源。

{{< note >}}

<!--
At this point, deleting a federated Namespace will not delete the corresponding Namespace, or resources in those Namespaces, from underlying clusters. Users must delete them manually. We intend to fix this in the future.
-->
此时，删除联邦命名空间，不会从底层集群中删除相应的命名空间或这些命名空间中的资源。用户必须手动删除它们。我们打算将来解决这个问题。

{{< /note >}}




