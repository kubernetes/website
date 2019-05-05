---
title: 联邦事件
content_template: templates/concept
---

<!--
---
title: Federated Events
content_template: templates/concept
---
-->


{{% capture overview %}}

{{< note >}}
{{< include "federation-current-state.md" >}}
{{< /note >}}

<!--
This guide explains how to use events in federation control plane to help in debugging.
-->
本指南介绍如何在联邦控制平面中使用事件来帮助调试。

{{% /capture %}}


{{% capture body %}}

<!--
## Prerequisites
-->
## 前提条件

<!--
This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/concepts/cluster-administration/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.
-->
本指南假设您已安装好了 Kubernetes 集群联邦。如果没有，请先查看 [联邦管理指南](/docs/admin/federation/) 来学习怎样安装集群联邦（也可以让您的管理员替您完成安装）。
其他的教程，例如 Kelsey Hightower 编写的 [这个教程](https://github.com/kelseyhightower/kubernetes-cluster-federation) 也会帮到你。

<!--
You are also expected to have a basic
[working knowledge of Kubernetes](/docs/setup/) in
general.
-->
您还应该具备 [Kubernetes 的基本操作](/docs/setup) 的知识。

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
联邦控制平面的事件（本指南中称为“联邦事件”）与传统的 Kubernetes 事件非常相似，提供相同功能。
联邦事件仅存储在联邦控制平面中，不会传递给下层 Kubernetes 集群。

<!--
Federation controllers create events as they process API resources to surface to the
user, the state that they are in.
You can get all events from federation apiserver by running:
-->
联邦控制器在处理 API 资源时创建事件，以向用户显示它们所处的状态。
您可以通过运行以下命令从联邦 API 服务器获取所有事件：

```shell
kubectl --context=federation-cluster get events
```

<!--
The standard kubectl get, update, delete commands will all work.
-->
标准的 kubectl get、update、delete 命令都可以正常工作。

{{% /capture %}}
