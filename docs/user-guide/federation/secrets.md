---
title: 联邦 Secrets
---

本指南介绍了如何在联邦控制层中使用秘密 - Secrets。

* TOC
{:toc}

## 前提条件

本指南假设您有一个正在运行的 Kubernetes 集群联邦的安装。如果没有，然后转到
[联邦管理员指南](/docs/admin/federation/) 了解如何启动联邦集群 (或让集群管理员为您执行此操作)。
其他教程，如 Kelsey Hightower 的
[Kubernetes 联邦教程](https://github.com/kelseyhightower/kubernetes-cluster-federation),
也可以帮助您创建一个联邦 Kubernetes 集群。

您还应该有一些
[Kubernetes 的基础工作知识](/docs/getting-started-guides/) ，特别是对 [Secrets](/docs/user-guide/secrets/) 要有些了解。

## 概述

联邦控制层的 Secrets (本指南简称 "联邦 secrets") 与传统的 [Kubernetes
Secrets](/docs/user-guide/secrets/) 非常相似，并提供相同的功能。
在联邦控制层中创建 Secrets 可确保它们在联邦中的所有集群之间同步。

## 创建联邦 Secret

联邦 Secret 的 API 与传统的 Kubernetes Secret 的 API 是 100% 兼容的。您可以通过发送创建一个 secret 请求到联邦的 apiserver。

您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行:

``` shell
kubectl --context=federation-cluster create -f mysecret.yaml
```

此选项 '--context=federation-cluster' 标记告诉 kubectl 提交请求到联邦 apiserver 而不是发送到到  Kubernetes 集群。

一旦联邦 secret 被创建，联邦控制层就会在所有基础的 Kubernetes 集群中创建并匹配 secret。
您可以通过检查每个基础集群来验证这一点，例如:

``` shell
kubectl --context=gce-asia-east1a get secret mysecret
```

以上假设您在您的客户端中为您的集群在该区域中配置了名为'gce-asia-east1a'的上下文。

底层集群中的这些 secret 将与联邦 secret 相匹配。

## 更新联邦 Secret

您可以通过更新联邦 secret，来更新 Kubernetes secret。然而，对于联邦 secret，您必须将请求发送到联邦 apiserver 而不是发送到特定的 Kubernetes 集群。
联邦控制层将确保每当联邦 secret 被更新，它会更新所有基础集群中相应 secrets 并匹配它。

## 删除联邦 Secret

您可以通过删除联邦 secret，来删除Kubernetes secret。然而，对于联邦 secret，您必须将请求发送到联邦 apiserver 而不是发送到特定的 Kubernetes 集群。

例如，您可以通过运行 kubectl 来执行此操作:

```shell
kubectl --context=federation-cluster delete secret mysecret
```

请注意，此时删除联邦 secret 将不会删除基础集群相应的 secrets。您必须手动删除底层 secrets。
我们计划未来解决此问题。
