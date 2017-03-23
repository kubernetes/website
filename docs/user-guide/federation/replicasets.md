---
title: 联邦 ReplicaSets
---

本指南介绍如何在联邦控制层中使用副本集 - ReplicaSets。

* TOC
{:toc}

## 前提条件

本指南假设您有一个正在运行的 Kubernetes 集群联邦的安装。如果没有，然后转到
[联邦管理员指南](/docs/admin/federation/) 了解如何启动联邦集群 (或让集群管理员为您执行此操作)。
其他教程，如 Kelsey Hightower 的
[Kubernetes 联邦教程](https://github.com/kelseyhightower/kubernetes-cluster-federation),
也可以帮助您创建一个联邦 Kubernetes 集群。

您还应该有一些
[Kubernetes 的基础工作知识](/docs/getting-started-guides/) ，特别是对 [ReplicaSets](/docs/user-guide/replicasets/) 要有些了解。

## 概述

联邦控制层中的 Replica Sets(在本指南中称为 "联邦副本集") 与传统的 [Kubernetes
ReplicaSets](/docs/user-guide/replicasets/)非常相似，并提供相同的功能。
在联邦控制层中创建副本集可确保所需数量幅本存在于注册的集群之间。

## 创建联邦幅本集

联邦 Replica Set 的 API 与传统的 Kubernetes Replica Set 的 API 是 100% 兼容的。您可以通过向联邦 apiserver 发送请求来创建 Replica Set。

您可以通过使用 [kubectl](/docs/user-guide/kubectl/) 运行:

``` shell
kubectl --context=federation-cluster create -f myrs.yaml
```

此选项 '--context=federation-cluster' 标记告诉 kubectl 提交请求给联邦 apiserver 而不是发送到 Kubernetes 集群。

一旦创建了联邦 replica set，联邦控制层将在所有基础的 Kubernetes 集群中创建 replica set。
您可以通过检查每个基础集群来验证这一点，例如：

``` shell
kubectl --context=gce-asia-east1a get rs myrs
```

以上假设您在您的客户端中为您的集群在该区域中配置了名为'gce-asia-east1a'的上下文。

底层集群中的这些幅本集将与联邦副本集匹配，但幅本数量除外。联邦控制层将确保每个集群中的副本总和与联邦副本集中所需的副本数匹配。

### 基础集群中的幅本集分布

默认情况下，副本在所有基础集群中均匀分布。例如:
如果您有 3 个注册的集群，并且创建了一个联邦的副本集
`spec.replicas = 9`，那么 3 个集群中的每个副本集都会有
`spec.replicas=3`。
要修改每个集群中的副本数，您可以参阅
[联邦副本集参考 ](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/federation/apis/federation/types.go)
在联邦幅本集中添加注解关健字 `federation.kubernetes.io/replica-set-preferences`。


## 更新联邦副本集

您可以更新联邦副本集，就像更新 Kubernetes 副本集。但是，对于联邦副本集，您必须将请求发送到联邦 apiserver 而不是发送到特定的 Kubernetes 集群。
联邦控制层将确保每当联邦副本集更新后，它会更新所有基础集群中的相应副本集，并匹配它。
如果您的更新包括副本数量的更改，联邦控制层将变更度层集群中的副本数，以确保它们的总和等于联邦副本集所需副本数。

## 删除联邦副本集

您可以通过删除联邦副本集，来删除 Kubernetes 副本集。但是，对于联邦副本集，您必须将请求发送到联邦 apiserver 而不是发送到特定的 Kubernetes 集群。

例如，您可以通过运行 kubectl 来执行此操作:

```shell
kubectl --context=federation-cluster delete rs myrs
```

请注意，此时，删除联邦副本集将不会删除来自基础集群的相应副本集。您必须手动删除底层幅本集，我们计划在未来解决此问题。
