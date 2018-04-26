---
title: 联邦 Event
cn-approvers:
- pigletfly
---
<!--
---
title: Federated Events
---
-->

<!--
This guide explains how to use events in federation control plane to help in debugging.


* TOC
{:toc}
-->
本指南阐述了如何使用联邦控制平面中的 event 来帮助调试。

<!--
## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/concepts/cluster-administration/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.

You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general.
-->
## 前提条件

本指南假定您已经安装好了一个 Kubernetes 联邦集群。如果还没有安装，可以参考 [联邦管理指南](/docs/admin/federation/) 去学习如何安装一个联邦集群(或者让您的集群管理员为您做这件事)。其他的指南，比如由 Kelsey Hightower 写的 [这篇文章](https://github.com/kelseyhightower/kubernetes-cluster-federation)，也可以帮助您。

您应该对 [Kubernetes 工作知识](/docs/setup/) 有基本了解。

<!--
## Overview

Events in federation control plane (referred to as "federation events" in
this guide) are very similar to the traditional Kubernetes
Events providing the same functionality.
Federation Events are stored only in federation control plane and are not passed on to the underlying Kubernetes clusters.

Federation controllers create events as they process API resources to surface to the
user, the state that they are in.
You can get all events from federation apiserver by running:

```shell
kubectl --context=federation-cluster get events
```

The standard kubectl get, update, delete commands will all work.
-->
## 概述

在联邦控制平面中的 Event (在本指南中称为"联邦 event") 和传统的 Kubernetes Event 很相似，提供了一样的功能。联邦 Event 只存储在联邦控制平面中，不会传递到底层的 Kubernetes 集群中。

当联邦控制器处理用户表面工作的 API 资源以及它们所处的状态时，会创建 event。
您可以通过运行以下命令从联邦 apiserver 获取所有的 event：

```shell
kubectl --context=federation-cluster get events
```

标准的 kubectl get，update，delete 命令都可以工作。
