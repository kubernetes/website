---
title: 联邦 Deployment
---

本指南介绍如何在联邦控制平台中使用 - Deployments[部署]。

* TOC
{:toc}

## 前指条件

本指南假设您有一个正在运行的 Kubernetes 集群联邦的安装。如果没有，然后转到
[联邦管理员指南](/docs/admin/federation/) 了解如何启动联邦集群 (或让集群管理员为您执行此操作)。
其他教程，如 Kelsey Hightower 的
[Kubernetes 联邦教程](https://github.com/kelseyhightower/kubernetes-cluster-federation),
也可以帮助您创建一个联邦 Kubernetes 集群。

您还应该有一些
[Kubernetes 的基础工作知识](/docs/getting-started-guides/) ，特别是对 [Deployment](/docs/user-guide/deployments) 要有些了解。

## 概述

联邦控制平台的 Deployments ("联邦 Deployments" 本指南) 非常类似于传统的[Kubernetes
Deployments](/docs/user-guide/deployments/) 并提供相同的功能。
在联邦控制平台中创建部署，可以确保期望的应用副本数存在于跨集群的注册。

**从Kubernetes 版本1.5开始， 联邦 Deployment 是一个 Alpha 特性。核心部署的功能是存在的，但一些功能
(例如完全的兼容性) 仍在开发中。**

## 创建联邦 Deployment

联邦 Deployment 的 API 与传统Kubernetes Deployment 的 API 是兼容的。您可以通过向联邦 apiserver 发送创建 Deployment 请求。

您可以使用 [kubectl](/docs/user-guide/kubectl/) 来运行:

``` shell
kubectl --context=federation-cluster create -f mydeployment.yaml
```

此选项 '--context=federation-cluster' 标记告诉 kubectl 提交请求到联邦 apiserver 而不是发送到 Kubernetes
集群。

一旦联邦的 Deployment 被创建，联邦控制台将在所有基础集群中创建或匹配 Deployment。
您可以通过检查每个基础集群来验证这一点，例如:

``` shell
kubectl --context=gce-asia-east1a get deployment mydep
```

以上假设您在您的客户端中为您的集群在该区域中配置了名为'gce-asia-east1a'的上下文。

底层集群中的这些部署将与联邦部署匹配，但副本数和修订相关的注释除外。
联邦控制台确保每个集群中的副本总数与联邦部署中所需的副本数相匹配。

### 在底层集群中分配副本

默认情况下，副本在所有底层集群中平均分布。例如:
如果您有三个注册的集群，并创建了一个联邦部署
`spec.replicas = 9`，那么三个集群中的每个部署都会有
`spec.replicas=3`。
要修改每个集群中的副本数，您可以在联邦部署中指定
[Federated ReplicaSet Preference](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/federation/apis/federation/types.go)
带键的注解 `federation.kubernetes.io/deployment-preferences`。

## 更新联邦 Deployment

您可以更新联邦 Deployment 就像更新 Kubernetes 的 Deployment 一样; 但是，对于联邦 Deployment，你必须将请求发送到联邦 apiserver 而不是发送它到特定的 Kubernetes 集群。
联邦控制台确保每当更新联邦部署时，它都会更新所有基础集群中的相应部署以与其匹配。因此，如果选择滚动更新策略，则底层集群将独立执行滚动更新，`maxSurge` 和 `maxUnavailable`将仅适用于单个集群。此行为可能在将来更改。
如果更新包括副本数量的更改，联邦控制平台将底层集群中的副本数更改为确保其总数仍等于联邦部署中所需副本的数量。

## 删除联邦 Deployment

您可以通过删除联邦部署来删除 Kubernetes 集群的部署;但是，对于联邦部署，您必须将请求发送到联邦 apiserver 而不是发送它到一个特定的 Kubernetes 集群。

例如，您可以使用 kubectl 通过运行:

```shell
kubectl --context=federation-cluster delete deployment mydep
```
