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

{{< note >}}
{{< include "federation-current-state.md" >}}
{{< /note >}}

<!--
This guide explains how to use secrets in Federation control plane.

Secrets in federation control plane (referred to as "federated secrets" in
this guide) are very similar to the traditional [Kubernetes
Secrets](/docs/concepts/configuration/secret/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->

本指南解释了怎样使用联邦控制平面中的 secret。

联邦控制平面中的 secret (请参考本文的 "联邦 secrets" 章节) 和传统的[Kubernetes Secrets](/docs/concepts/configuration/secret/)非常类似并提供相同的功能。
在联邦控制平面中创建它们可以确保它们在联邦中的所有集群之间同步。

{{% /capture %}}


{{% capture body %}}

<!--
## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.
-->

## 前提条件

本指南假设您安装好了 Kubernetes 集群联邦。如果没有，请先查看 [federation admin guide](/docs/admin/federation/) 来学习怎样安装集群联邦（也可以让您的管理员替您完成安装）。
其他的教程，例如 Kelsey Hightower 编写的 [这个教程](https://github.com/kelseyhightower/kubernetes-cluster-federation) 也会帮到你。

<!--
You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general and [Secrets](/docs/concepts/configuration/secret/) in particular.
-->

也希望您大概了解一些基本的 [Kubernetes 知识](/docs/setup/) 特别是和 [Secrets](/docs/concepts/configuration/secret/) 相关的知识。

<!--
## Creating a Federated Secret

The API for Federated Secret is 100% compatible with the
API for traditional Kubernetes Secret. You can create a secret by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:
-->

## 创建联邦 Secret

联邦 Secret 的 API 与传统的 Kubernetes Secret 的 API 100% 兼容。
你可以通过向联邦的 ApiServer 发出请求来创建 Secret。

``` shell
kubectl --context=federation-cluster create -f mysecret.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.
-->

`--context=federation-cluster` 参数告诉 kubectl 将请求提交给联邦 ApiServer 而不是将其发送到 Kubernetes 集群上。

<!--
Once a federated secret is created, the federation control plane will create
a matching secret in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:
-->

在创建完联邦 secret 后，联邦控制平面将在所有底层 Kubernetes 集群中创建匹配的 secret。
您可以通过检查每个底层集群来验证这一点，例如：

``` shell
kubectl --context=gce-asia-east1a get secret mysecret
```

<!--
The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These secrets in underlying clusters will match the federated secret.
-->

以上假设您在客户端上为该区域的集群配置了一个名为 'gce-asia-east1a' 的上下文。

底层集群中的这些 secret 将与联邦 secret 相匹配。

<!--
## Updating a Federated Secret

You can update a federated secret as you would update a Kubernetes
secret; however, for a federated secret, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plan ensures that whenever the federated secret is
updated, it updates the corresponding secrets in all underlying clusters to
match it.
-->

## 更新联邦 secret

您可以像更新 Kubernetes secret 那样更新联邦 secret；但是，对于联邦 secret，必须将请求发送到联邦 ApiServer，而非某个 Kubernetes 集群上。
联邦控制平面确保每当联邦 secret 被更新时，它来更新所有底层集群中的相应 secret ，以便相互匹配。

<!--
## Deleting a Federated Secret

You can delete a federated secret as you would delete a Kubernetes
secret; however, for a federated secret, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:
-->

## 删除联邦 Secret

您可以像删除 Kubernetes secret 那样删除联邦 secret；但是，对于联邦 secret，必须将请求发送到联邦 ApiServer，而不是将其发送到特定的 Kubernetes 集群。

例如，您可以使用 kubectl 来进行删除：

```shell
kubectl --context=federation-cluster delete secret mysecret
```

{{< note >}}
<!--At this point, deleting a federated secret will not delete the corresponding secrets from underlying clusters. You must delete the underlying secrets manually. We intend to fix this in the future.-->
目前，删除联邦 secret 并不会从底层集群中删除相应的 secret。您必须手动删除底层 secret。我们考虑在将来解决这个问题。
{{< /note >}}

{{% /capture %}}
