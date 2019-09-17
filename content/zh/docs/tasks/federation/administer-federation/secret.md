---
title: 联邦 Secret
content_template: templates/concept
---

<!--
---
title: Federated Secrets
content_template: templates/concept
---
-->

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!--
This guide explains how to use secrets in Federation control plane.

Secrets in federation control plane (referred to as "federated secrets" in
this guide) are very similar to the traditional [Kubernetes
Secrets](/docs/concepts/configuration/secret/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->
本指南解释了如何在联邦控制平面中使用 secret。

联邦控制平面中的 Secret（在本指南中称为“联邦 secret”）与提供相同功能的传统 [Kubernetes Secret](/docs/concepts/configuration/secret/) 非常相似。
在联邦控制平面中创建它们可以确保它们跨联邦中的所有集群同步。

{{% /capture %}}


{{% capture body %}}

<!--
## Prerequisites
-->

## 先决条件

<!--
This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.
-->
本指南假设你有一个正在运行的 Kubernetes 集群联邦安装。
如果没有，请访问[联邦管理指南](/docs/admin/federation/)，了解如何启动联邦集群（或者让集群管理员为你做这件事）。
其他教程，例如[这里](https://github.com/kelseyhightower/kubernetes-cluster-federation) Kelsey Hightower，也可以帮助您。

<!--
You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [Secrets](/docs/concepts/configuration/secret/) in particular.
-->
你还应该具有一个基本的 [Kubernetes 工作知识](/docs/tutorials/kubernetes-basics/)，
特别是 [Secret](/docs/concepts/configuration/secret/)。

<!--
## Creating a Federated Secret
-->

## 创建联邦 Secret

<!--
The API for Federated Secret is 100% compatible with the
API for traditional Kubernetes Secret. You can create a secret by sending
a request to the federation apiserver.
-->
用于联邦 Secret 的 API 与用于传统的 Kubernetes Secret 的 API 100% 兼容。
您可以通过向联邦 apiserver 发送请求来创建一个 Secret。

<!--
You can do that using [kubectl](/docs/user-guide/kubectl/) by running:
-->
你可以使用 [kubectl](/docs/user-guide/kubectl/) 来运行：

``` shell
kubectl --context=federation-cluster create -f mysecret.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数通知 kubectl 将请求提交给联邦 apiserver，而不是将其发送到 Kubernetes 集群。

<!--
Once a federated secret is created, the federation control plane will create
a matching secret in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->
创建联邦命名空间后，联邦控制平面将在所有基础 Kubernetes 集群中创建匹配的命名空间。您可以通过检查每个基础集群来验证这一点，例如：

``` shell
kubectl --context=gce-asia-east1a get secret mysecret
```

<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These secrets in underlying clusters will match the federated secret.
-->
以上假设您在客户端中为该区域中的集群配置了名为 “gce-asia-east1a” 的上下文。
集群底层中的这些 secret 将与联邦 secret 匹配。

<!--
## Updating a Federated Secret
-->

## 更新联邦 Secret

<!--
You can update a federated secret as you would update a Kubernetes
secret; however, for a federated secret, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated secret is
updated, it updates the corresponding secrets in all underlying clusters to
match it.
-->
您可以像更新 Kubernetes secret 一样更新联邦 secret，但是，对于联邦 secret 必须将请求发送到联邦 apiserver，
而不是将其发送到指定的 Kubernetes 集群。联邦控制平面将确保每当更新联邦 secret 时，它都会更新所有基础集群中的相应 secret 以与其匹配。

<!--
## Deleting a Federated Secret
-->

## 删除联邦 Secret

<!--
You can delete a federated secret as you would delete a Kubernetes
secret; however, for a federated secret, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
-->
你可以删除一个联邦 secret，就像删除一个 Kubernetes secret 一样；但是，
对于联邦 secret，必须将请求发送到联邦 apiserver，而不是发送到指定的 Kubernetes 集群。

<!--
For example, you can do that using kubectl by running:
-->
例如，您可以通过运行以下命令使用 kubectl 执行此操作：

```shell
kubectl --context=federation-cluster delete secret mysecret
```

{{< note >}}

<!--
At this point, deleting a federated secret will not delete the corresponding secrets from underlying clusters. You must delete the underlying secrets manually. We intend to fix this in the future.
-->
此时，删除联邦 secret 不会从集群底层中删除相应的 secret。你必须手动删除底层 secret。我们打算将来解决这个问题。

{{< /note >}}

{{% /capture %}}
