---
title: 联邦事件
content_type: concept
---

<!--
---
title: Federated Events
content_type: concept
---
-->

<!-- overview -->

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!--
This guide explains how to use events in federation control plane to help in debugging.
-->
本指南介绍如何在联邦控制平面中使用事件来帮助调试。




<!-- body -->

<!--
## Prerequisites
-->

## 先决条件

<!--
This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/concepts/cluster-administration/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.
-->

本指南假定您正在运行 Kubernetes 集群联邦安装。
如果没有，请转到[联邦管理员指南](/docs/concepts/cluster-administration/federation/)，了解如何启动集群联邦（或让集群管理员为您执行此操作）。
其他教程，例如[这个](https://github.com/kelseyhightower/kubernetes-cluster-federation)由 Kelsey Hightower，也可为您提供帮助。

<!--
You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general.
-->
你还应该具备 [kubernetes 基本工作知识](/docs/tutorials/kubernetes-basics/)。

<!--
## View federation events
-->

## 查看联邦事件

<!--
Events in federation control plane (referred to as "federation events" in
this guide) are very similar to the traditional Kubernetes
Events providing the same functionality.
Federation Events are stored only in federation control plane and are not passed on to the underlying Kubernetes clusters.
-->
联邦控制平面中的事件（本指南中称为“联邦事件”）与提供相同功能的传统 Kubernetes 事件非常相似。
联邦事件仅存储在联邦控制平面中，不会传递给基础 Kubernetes 集群。

<!--
Federation controllers create events as they process API resources to surface to the
user, the state that they are in.
You can get all events from federation apiserver by running:
-->
联邦控制器在处理 API 资源时创建事件，以便向用户显示它们所处的状态。您可以通过运行以下命令从联邦 apiserver 获取所有事件：

```shell
kubectl --context=federation-cluster get events
```

<!--
The standard kubectl get, update, delete commands will all work.
-->
标准的 kubectl get，update，delete 命令都可以正常工作。


