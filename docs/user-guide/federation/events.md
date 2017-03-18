---
title: 联邦 Events
---

本指南介绍如何在联邦控制平台中使用事件来帮助调试 - events。

* TOC
{:toc}

## Prerequisites

本指南假设您有一个正在运行的 Kubernetes 集群联邦的安装。如果没有，然后转到
[联邦管理员指南](/docs/admin/federation/) 了解如何启动联邦集群 (或让集群管理员为您执行此操作)。
其他教程，如 Kelsey Hightower 的
[Kubernetes 联邦教程](https://github.com/kelseyhightower/kubernetes-cluster-federation),
也可以帮助您创建一个联邦 Kubernetes 集群。

您还应该有一些
[Kubernetes 的基础工作知识](/docs/getting-started-guides/)。

## 概述

联邦控制平台中的事件 (参考"联邦事件"指南) 非常类似于传统 Kubernetes 中的事件，并提供相同功能。
联邦事件仅存储在联邦控制台中，不会传递到底层的 Kubernetes 集群。

联邦控制器通过创建事件向用户展示 API 资源当前所处的状态。
您可以通过运行以下命令从联邦 apiserver 获取所有事件:

```shell
kubectl --context=federation-cluster get events
```

标准的 kubectl get, update, delete 命令都可以工作。
