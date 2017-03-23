---
title: 联邦 ConfigMaps
---

本指南解释了如何在联邦控制层使用 - ConfigMaps[配置映射]。

* TOC
{:toc}

## 前提条件

本指南假设您有一个正在运行的 Kubernetes 集群联邦的安装。如果没有，然后转到
[联邦管理员指南](/docs/admin/federation/) 了解如何启动联邦集群 (或让集群管理员为您执行此操作)。
其他教程，如 Kelsey Hightower 的
[Kubernetes 联邦教程](https://github.com/kelseyhightower/kubernetes-cluster-federation),
也可以帮助您创建一个联邦 Kubernetes 集群。

您还应该有一些
[Kubernetes 的基础工作知识](/docs/getting-started-guides/) ，特别是对 [ConfigMaps](/docs/user-guide/ConfigMaps/) 要有些了解。

## 概述

联邦 ConfigMaps 与传统的 [Kubernetes
ConfigMaps](/docs/user-guide/configmap/) 非常类似，并提供相同的功能。
在联邦控制层创建它们，可确保它们同步到联邦中的所有集群。

## 创建联邦 ConfigMaps

联邦 ConfigMap 的 API 100% 兼容传统 Kubernetes ConfigMap 的 API。您可以向联邦 apiserver 发送创建 ConfigMap 的请求。

您可以使用 [kubectl](/docs/user-guide/kubectl/) 来运行:

``` shell
kubectl --context=federation-cluster create -f myconfigmap.yaml
```

此选项 `--context=federation-cluster` 标记告诉 kubectl 提交请求到联邦 apiserver 而不是发送它到 Kubernetes 集群。

一旦联邦 ConfigMap 被创建, 联邦控制层将在所有底层的 Kubernetes 集群中创建匹配 ConfigMap。
您可以通过检查每一个基础集群来验证这一点，例如:

``` shell
kubectl --context=gce-asia-east1a get configmap myconfigmap
```

以上假设您在您的客户端中为您的集群在该区域中配置了名为'gce-asia-east1a'的上下文。

基础集群中的这些 ConfigMaps 将匹配联邦 ConfigMap。


## 更新联邦 ConfigMaps

您可以更新联邦的 ConfigMap，就像更新 Kubernetes 的ConfigMap一样;但是，对于联邦 ConfigMap，您必须将请求发送到联邦 apiserver 而不是发送它到一个特定的 Kubernetes 集群。
联邦控制层会确保每次联邦 ConfigMap 更新时，它将所有基础集群中的相应 ConfigMaps 更新并匹配它。

## 删除联邦 ConfigMaps

您可以通过删除联邦 ConfigMap 来删除 Kubernetes 集群的 ConfigMap; 但是，对于联邦 ConfigMap，你必须将请求发送到联邦 apiserver 而不是发送它到一个特定的 Kubernetes 集群。

例如， 您可以使用 kubectl 通过运行:

```shell
kubectl --context=federation-cluster delete configmap
```

注意，在这一点上，删除联邦 ConfigMap 不会删除基础集群中创建的相应的 ConfigMaps。
您必须手动删除基础集群的 ConfigMaps，我们计划将来修复此问题。
