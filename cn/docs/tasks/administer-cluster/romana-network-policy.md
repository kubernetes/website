---
approvers:
- chrismarino
title: 使用 Romana 来提供 NetworkPolicy 
---

{% capture overview %}

<!--
This page shows how to use Romana for NetworkPolicy.
-->
本页展示怎么样使用 Romana 来提供 NetworkPolicy

{% endcapture %}

{% capture prerequisites %}

<!--
Complete steps 1, 2, and 3 of  the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/).
-->
完成 [kubeadm 入门指南](/docs/getting-started-guides/kubeadm/)中的步骤1、2和3

{% endcapture %}

{% capture steps %}

<!--
## Installing Romana with kubeadm
-->
## 使用 kubeadm 安装 Romana

<!--
Follow the [containerized installation guide](https://github.com/romana/romana/tree/master/containerize) for kubeadmin.
-->
按照[容器化安装指南](https://github.com/romana/romana/tree/master/containerize)中使用 kubeadm 的方式安装

<!--
## Applying network policies
-->
## 应用网络策略

<!--
To apply network policies use one of the following:
-->
要应用网络策略，请使用以下方式之一：

<!--
* [Romana network policies](https://github.com/romana/romana/wiki/Romana-policies).
    * [Example of Romana network policy](https://github.com/romana/core/tree/master/policy).
-->
* [Romana 网络策略](https://github.com/romana/romana/wiki/Romana-policies)
    * [Romana 网络策略示例](https://github.com/romana/core/tree/master/policy)
<!--
* The NetworkPolicy API.
-->
* NetworkPolicy API

{% endcapture %}

{% capture whatsnext %}

<!--
Once your have installed Romana, you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.
-->
Romana 安装完成之后，您可以通过 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough)去尝试使用 Kubernetes NetworkPolicy

{% endcapture %}

{% include templates/task.md %}
