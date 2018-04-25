---
title: 联邦 Secret
cn-approvers:
- pigletfly
---
<!--
---
title: Federated Secrets
---
-->
<!--
This guide explains how to use secrets in Federation control plane.

* TOC
{:toc}
-->
本指南阐述了如果在联邦控制平面中使用 secret 。

* TOC
{:toc}

<!--
## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.

You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general and [Secrets](/docs/concepts/configuration/secret/) in particular.
-->

## 前提条件

本指南假定您已经安装好了一个 Kubernetes 联邦集群。如果还没有安装，可以参考 [联邦管理指南](/docs/admin/federation/) 去学习如何安装一个联邦集群(或者让您的集群管理员为您做这件事)。其他的指南，比如由 Kelsey Hightower 写的 [这篇文章](https://github.com/kelseyhightower/kubernetes-cluster-federation)，也可以帮助您。

您应该对 [Kubernetes 工作知识](/docs/setup/) 有基本了解，尤其是 [Secret](/docs/concepts/configuration/secret/)。

<!--
## Overview

Secrets in federation control plane (referred to as "federated secrets" in
this guide) are very similar to the traditional [Kubernetes
Secrets](/docs/concepts/configuration/secret/) providing the same functionality.
Creating them in the federation control plane ensures that they are synchronized
across all the clusters in federation.
-->
## 概述

在联邦控制平面中的 Secret (在本指南中称为"联邦 secret") 和传统的 [Kubernetes Secret](/docs/concepts/configuration/secret/)很相似，提供了一样的功能。在联邦控制平面中创建联邦 secret 可以确保它们同步到联邦的所有集群中。

<!--
## Creating a Federated Secret

The API for Federated Secret is 100% compatible with the
API for traditional Kubernetes Secret. You can create a secret by sending
a request to the federation apiserver.
-->
## 创建联邦 Secret

联邦 Secret 的 API 和传统的 Kubernetes Secret API 是100%兼容的。您可以通过请求联邦 apiserver 来创建一个 secret。

<!--
You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
kubectl --context=federation-cluster create -f mysecret.yaml
```
-->
您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行下面的指令来创建联邦 Secret：

``` shell
kubectl --context=federation-cluster create -f mysecret.yaml
```

<!--
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.
-->
`--context=federation-cluster` 参数告诉 kubectl 发送请求到联邦 apiserver 而不是某个 Kubernetes 集群。

<!--
Once a federated secret is created, the federation control plane will create
a matching secret in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get secret mysecret
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

These secrets in underlying clusters will match the federated secret.
-->
一旦联邦 secret 被创建了，联邦控制平面就会在所有底层 Kubernetes 集群中创建匹配的 secret。
您可以通过检查底层每个集群来对其进行验证，例如：

``` shell
kubectl --context=gce-asia-east1a get secret mysecret
```

上面的命令假定您在客户端中配置了一个叫做 'gce-asia-east1a' 的上下文，用于请求那个区域的集群。

这些底层集群中的 secret 将会和联邦 secret 保持一致。

<!--
## Updating a Federated Secret

You can update a federated secret as you would update a Kubernetes
secret; however, for a federated secret, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plan ensures that whenever the federated secret is
updated, it updates the corresponding secrets in all underlying clusters to
match it.
-->
## 更新联邦 Secret

您可以像更新 Kubernetes secret 一样更新联邦 secret。但是，对于联邦 secret，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。联邦控制平面会确保任何时候联邦 secret 更新后，它会将对应的 secret 更新到所有的底层集群中来和它保持一致。

<!--
## Deleting a Federated Secret

You can delete a federated secret as you would delete a Kubernetes
secret; however, for a federated secret, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete secret mysecret
```

Note that at this point, deleting a federated secret will not delete the
corresponding secrets from underlying clusters.
You must delete the underlying secrets manually.
We intend to fix this in the future.
-->

## 删除联邦 Secret

您可以像删除 Kubernetes secret 一样删除联邦 Secret。但是，对于联邦 secret，您必须发送请求到联邦 apiserver 而不是某个特定的 Kubernetes 集群。

例如，您可以使用 kubectl 运行下面的命令来删除联邦 secret：

```shell
kubectl --context=federation-cluster delete secret mysecret
```

要注意的是这时删除联邦 secret 并不会删除底层集群中对应的 secret。您必须自己手动删除底层集群中的 secret。
我们打算未来修复这个问题。
