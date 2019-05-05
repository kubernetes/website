---
title: 联邦命名空间
content_template: templates/task
---

{{% capture overview %}}

{{< note >}}
{{< include "federation-current-state.md" >}}
{{< /note >}}

本指南介绍如何在联邦控制平面中使用命名空间。

联邦控制平面中的命名空间（在本指南中称为“联邦命名空间”）与提供相同功能的传统 [Kubernetes 命名空间](/docs/concepts/overview/working-with-objects/namespaces/)非常相似。在联邦控制平面中创建它们可确保它们在联邦中的所有集群之间同步。

<!--
This guide explains how to use Namespaces in Federation control plane.

Namespaces in federation control plane (referred to as "federated Namespaces" in
this guide) are very similar to the traditional [Kubernetes
Namespaces](/docs/concepts/overview/working-with-objects/namespaces/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* 一般来说您还应具备 [Kubernetes 的基本工作知识](/docs/setup/pick-right-solution/)，尤其是[命名空间](/docs/concepts/overview/working-with-objects/namespaces/)。

<!--
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/pick-right-solution/) in
general and [Namespaces](/docs/concepts/overview/working-with-objects/namespaces/) in particular.
-->

{{% /capture %}}

{{% capture steps %}}

## 创建联邦命名空间

联邦命名空间的 API 与传统 Kubernetes 命名空间的 API 100％兼容。您可以通过给联邦 API 服务器发送请求来创建一个命名空间。

您可以通过运行以下 kubectl 命令来执行此操作：

<!--
## Creating a Federated Namespace

The API for Federated Namespaces is 100% compatible with the
API for traditional Kubernetes Namespaces. You can create a Namespace by sending
a request to the federation apiserver.

You can do that using kubectl by running:
-->

``` shell
kubectl --context=federation-cluster create -f myns.yaml
```

参数 `--context=federation-cluster` 用于告知 kubectl 要向联邦 API 服务器提交请求而不是 Kubernetes 集群。

一旦联邦命名空间被创建，联邦控制平面将在所有基础的 Kubernetes 集群中创建与之相匹配的命名空间。
您可以通过检查每个基础集群来验证这一点，例如：

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated Namespace is created, the federation control plane will create
a matching Namespace in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->

``` shell
kubectl --context=gce-asia-east1a get namespaces myns
```

以上假设您在客户机中为该区域的集群配置了一个名为 'gce-asia-east1a' 的上下文。基础命名空间的名称和 spec 将与您在上面创建的联合命名空间的名称和 spec 相匹配。


<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
spec of the underlying Namespace will match those of
the Federated Namespace that you created above.
-->

## 更新联邦命名空间

您可以像更新 Kubernetes 命名空间一样更新联邦命名空间，只需要将请求发送给联邦的 API 服务器，而不是发送给特定的 Kubernetes 集群。
联邦控制平面将确保每当更新联邦命名空间时，它都会更新所有基础集群中的相应命名空间以与其匹配。

<!--
## Updating a Federated Namespace

You can update a federated Namespace as you would update a Kubernetes
Namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.
Federation control plan will ensure that whenever the federated Namespace is
updated, it updates the corresponding Namespaces in all underlying clusters to
match it.
-->

## 删除联邦命名空间

您可以删除联邦命名空间就像删除 Kubernetes 命名空间一样，只需要将请求发送给联邦的 API 服务器，而不是发送给特定的 Kubernetes 集群。

例如，您可以通过运行以下 kubectl 命令来执行此操作：

<!--
## Deleting a Federated Namespace

You can delete a federated Namespace as you would delete a Kubernetes
Namespace, just send the request to federation apiserver instead of sending it
to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:
-->
```shell
kubectl --context=federation-cluster delete ns myns
```

与在 Kubernetes 中一样，删除联邦命名空间将从联邦控制平面中删除该命名空间中的所有资源。

<!--
As in Kubernetes, deleting a federated Namespace will delete all resources in that
Namespace from the federation control plane.
-->

{{< note >}}
就此，删除联邦命名空间不会从基础集群中删除相应的命名空间或这些命名空间中的资源。用户必须手动删除它们。我们打算在将来解决这个问题。
<!--
At this point, deleting a federated Namespace will not delete the corresponding Namespace, or resources in those Namespaces, from underlying clusters. Users must delete them manually. We intend to fix this in the future.
-->
{{< /note >}}

{{% /capture %}}
