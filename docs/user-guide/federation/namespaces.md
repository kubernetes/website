---
title: 联邦 Namespaces
---

本指南介绍如何在联邦控制层使用命名空间。

* TOC
{:toc}

## 前提条件

本指南假设您有一个正在运行的 Kubernetes 集群联邦的安装。如果没有，然后转到
[联邦管理员指南](/docs/admin/federation/) 了解如何启动联邦集群 (或让集群管理员为您执行此操作)。
其他教程，如 Kelsey Hightower 的
[Kubernetes 联邦教程](https://github.com/kelseyhightower/kubernetes-cluster-federation),
也可以帮助您创建一个联邦 Kubernetes 集群。

您还应该有一些
[Kubernetes 的基础工作知识](/docs/getting-started-guides/) ，特别是对 [Namespaces](/docs/user-guide/namespaces/) 要有些了解。

## 概述

联邦控制层的 Namespaces (本指南中称为 "联邦 namespaces") 与传统的 [Kubernetes
Namespaces](/docs/user-guide/namespaces/) 非常相似，并提供相同的功能。
在联邦控制层创建 Namespaces 可确保它们在联邦中同步所有集群。

## 创建联邦 Namespace

联邦 Namespaces 的 API 与传统的 Kubernetes Namespaces 100% 兼容。您可以通过发送创建命名空间请求到联邦 apiserver。

您可以通过运行 kubectl 来执行此操作:

``` shell
kubectl --context=federation-cluster create -f myns.yaml
```

此选项 '--context=federation-cluster' 标记告诉 kubectl 将请求提交给联邦 apiserver 而不是发送到 Kubernetes 集群。

一旦创建了联邦 namespace，联邦控制层将在所有底层的 Kubernetes 集群中创建一个匹配的 namespace。

您可以通过检查每个基础集群来验证这一点，例如:

``` shell
kubectl --context=gce-asia-east1a get namespaces myns
```

以上假设您在您的客户端中为您的集群在该区域中配置了名为'gce-asia-east1a'的上下文。
底层集群的 namespace 将与您上面创建的联邦 Namespace 相匹配。

## 更新联邦 Namespace

您可以通过更新联邦 namespace，来更新 Kubernetes namespace，只需将请求发送给联邦 apiserver，而不是将其发送到特定的 Kubernetes 集群。
联邦控制层将确保联邦 namespace 被更新时，它将更新所有底层集群中的相应 namespaces，使之与之匹配。

## 删除联邦 Namespace

您可以通过删除联邦 namespace，来删除 Kubernetes namespace，只需发送请求到联邦 apiserver 而不是发送它到一个特定的 Kubernetes 集群。

例如，您可以通过运行 kubectl 来执行此操作:

```shell
kubectl --context=federation-cluster delete ns myns
```

与 Kubernetes 一样，删除联邦 namespace 将从联邦控制层中删除该 namespace 中的所有资源。

请注意一点，此时删除联邦 namespace 将不会删除来自基础集群的 namespace 中的相应 namespace 和资源。用户应用手动移除它们，我们打算在未来解决此问题。
