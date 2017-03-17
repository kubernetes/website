---
title: 联邦 DaemonSet
---

本指南介绍如何在联邦控制平台中使用 - DaemonSets[守护进程]。

* TOC
{:toc}

## 前指条件

本指南假设您有一个正在运行的 Kubernetes 集群联邦的安装。如果没有，然后转到
[联邦管理员指南](/docs/admin/federation/) 了解如何启动联邦集群 (或让集群管理员为您执行此操作)。
其他教程，如 Kelsey Hightower 的
[Kubernetes 联邦教程](https://github.com/kelseyhightower/kubernetes-cluster-federation),
也可以帮助您创建一个联邦 Kubernetes 集群。

您还应该有一些
[Kubernetes 的基础工作知识](/docs/getting-started-guides/) ，特别是对 DaemonSets 要有些了解。

## 概述

联邦控制平台的 DaemonSets ("联邦 Daemonsets" 本指南) 非常类似于传统的[Kubernetes
DaemonSets](/docs/user-guide/DaemonSets/) 并提供相同的功能。
在联邦控制平台中创建 DaemonSets 可以确保它们同步到联邦中的所有集群。

## 创建联邦 Daemonset

联邦 Daemonset 的 API 100% 兼容传统 Kubernetes DaemonSet 的 API。您可以向联邦 apiserver 发送创建 DaemonSet的请求。

您可以使用 [kubectl](/docs/user-guide/kubectl/) 来运行:

``` shell
kubectl --context=federation-cluster create -f mydaemonset.yaml
```

此选项 `--context=federation-cluster` 标记告诉 kubectl 提交请求到联邦 apiserver 而不是发送它到 Kubernetes 集群。

一旦联邦的 Daemonset 被创建，联邦控制台将在所有基础集群中创建或匹配 DaemonSet。
您可以通过检查每个基础集群来验证这一点，例如:

``` shell
kubectl --context=gce-asia-east1a get daemonset mydaemonset
```

以上假设您在您的客户端中为您的集群在该区域中配置了名为'gce-asia-east1a'的上下文。

基础集群中的这些 DaemonSets 将匹配联邦 DaemonSets。

## 更新联邦 Daemonset

您可以更新联邦 Daemonset 就像更新 Kubernetes 的 DaemonSet一样; 但是，对于联邦 Daemonset，你必须将请求发送到联邦 apiserver 而不是发送它到特定的 Kubernetes 集群。
联邦控制台确保每当联邦 Daemonset 更新时，它将所有基础集群中的相应 DaemonSets 更新并匹配它。

## 删除联邦 Daemonset

您可以通过删除联邦 Daemonset 来删除 Kubernetes 集群的 Daemonset; 但是，对于联邦 Daemonset，你必须将请求发送到联邦 apiserver 而不是发送它到一个特定的 Kubernetes 集群。

例如， 您可以使用 kubectl 通过运行:

```shell
kubectl --context=federation-cluster delete daemonset mydaemonset
```
