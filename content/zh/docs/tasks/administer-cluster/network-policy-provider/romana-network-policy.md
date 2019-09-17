---
reviewers:
- chrismarino
title: 使用 Romana 作为 NetworkPolicy
content_template: templates/task
weight: 40
---

{{% capture overview %}}

<!-- This page shows how to use Romana for NetworkPolicy. -->
本页展示如何使用 Romana 作为 NetworkPolicy。

{{% /capture %}}

{{% capture prerequisites %}}

<!-- Complete steps 1, 2, and 3 of  the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/). -->
完成[kubeadm 入门指南](/docs/getting-started-guides/kubeadm/)中的1、2、3步。

{{% /capture %}}

{{% capture steps %}}
<!-- 
## Installing Romana with kubeadm

Follow the [containerized installation guide](https://github.com/romana/romana/tree/master/containerize) for kubeadm.

## Applying network policies

To apply network policies use one of the following:

* [Romana network policies](https://github.com/romana/romana/wiki/Romana-policies).
    * [Example of Romana network policy](https://github.com/romana/core/blob/master/doc/policy.md).
* The NetworkPolicy API.
 -->
## 使用 kubeadm 安装 Romana

按照[容器化安装指南](https://github.com/romana/romana/tree/master/containerize)获取 kubeadm。

## 运用网络策略

使用以下的一种方式去运用网络策略：

* [Romana 网络策略](https://github.com/romana/romana/wiki/Romana-policies)
    * [Romana 网络策略例子](https://github.com/romana/core/blob/master/doc/policy.md)
* NetworkPolicy API

{{% /capture %}}

{{% capture whatsnext %}}
<!-- 
Once you have installed Romana, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
 -->
Romana 安装完成后，您可以按照[声明 Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)去尝试使用 Kubernetes NetworkPolicy。

{{% /capture %}}
