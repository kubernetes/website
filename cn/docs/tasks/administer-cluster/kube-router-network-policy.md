---
approvers:
- murali-reddy
title: 使用 Kube-router 来提供 NetworkPolicy
cn-approvers:
- chentao1596
---

{% capture overview %}
<!--
This page shows how to use [Kube-router](https://github.com/cloudnativelabs/kube-router) for NetworkPolicy.
-->
本页展示怎么样使用 [Kube-router](https://github.com/cloudnativelabs/kube-router) 来提供 NetworkPolicy
{% endcapture %}

{% capture prerequisites %}
<!--
You need to have a Kubernetes cluster running. If you do not already have a cluster, you can create one by using any of the cluster installers like Kops, Bootkube, Kubeadm etc.
-->
首先，需要准备好一个正常运行的 Kubernetes 集群。如果还没有，您可以使用 Kops、Bootkube、Kubeadm 等集群安装工具创建一个。

{% endcapture %}

{% capture steps %}
<!--
## Installing Kube-router addon
-->
## 安装 Kube-router 插件
<!--
The Kube-router Addon comes with a Network Policy Controller that watches Kubernetes API server for any NetworkPolicy and pods updated and configures iptables rules and ipsets to allow or block traffic as directed by the policies. Please follow the [trying Kube-router with cluster installers](https://github.com/cloudnativelabs/kube-router/tree/master/Documentation#try-kube-router-with-cluster-installers) guide to install Kube-router addon.
-->
Kube-router 插件带有一个网络策略控制器，该控制器通过 Kubernetes API 服务观察所有 NetworkPolicy 和 pod 的更新，然后根据策略配置 iptables 规则和 ipsets，以实现按指示来允许或阻塞流量。请参考 [在集群安装时使用 Kube-router](https://github.com/cloudnativelabs/kube-router/tree/master/Documentation#try-kube-router-with-cluster-installers) 指南来安装 Kube-router 插件。
{% endcapture %}

{% capture whatsnext %}
<!--
Once you have installed the Kube-router addon, you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.
-->
Kube-router 插件安装完成之后，您可以参考 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough) 去尝试使用 Kubernetes NetworkPolicy。
{% endcapture %}

{% include templates/task.md %}

