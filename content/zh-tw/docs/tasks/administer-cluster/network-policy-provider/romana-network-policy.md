---
title: 使用 Romana 提供 NetworkPolicy
content_type: task
weight: 50
---

<!--
reviewers:
- chrismarino
title: Romana for NetworkPolicy
content_type: task
weight: 50
-->

<!-- overview -->

<!--
This page shows how to use Romana for NetworkPolicy.
-->
本頁展示如何使用 Romana 作爲 NetworkPolicy。

## {{% heading "prerequisites" %}}

<!--
Complete steps 1, 2, and 3 of the [kubeadm getting started guide](/docs/reference/setup-tools/kubeadm/).
-->
完成 [kubeadm 入門指南](/zh-cn/docs/reference/setup-tools/kubeadm/)中的 1、2、3 步。

<!-- steps -->
<!--
## Installing Romana with kubeadm

Follow the [containerized installation guide](https://github.com/romana/romana/tree/master/containerize) for kubeadm.

## Applying network policies

To apply network policies use one of the following:

* [Romana network policies](https://github.com/romana/romana/wiki/Romana-policies).
    * [Example of Romana network policy](https://github.com/romana/core/blob/master/doc/policy.md).
* The NetworkPolicy API.
 -->
## 使用 kubeadm 安裝 Romana

按照[容器化安裝指南](https://github.com/romana/romana/tree/master/containerize)，
使用 kubeadm 安裝。

## 應用網路策略

使用以下的一種方式應用網路策略：

* [Romana 網路策略](https://github.com/romana/romana/wiki/Romana-policies)
  * [Romana 網路策略例子](https://github.com/romana/core/blob/master/doc/policy.md)
* NetworkPolicy API

## {{% heading "whatsnext" %}}

<!--
Once you have installed Romana, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
 -->
Romana 安裝完成後，你可以按照
[聲明網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
去嘗試使用 Kubernetes NetworkPolicy。

