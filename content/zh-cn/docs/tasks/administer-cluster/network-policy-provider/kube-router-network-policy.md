---
title: 使用 kube-router 提供 NetworkPolicy
content_type: task
weight: 40
---
<!--
reviewers:
- murali-reddy
title: Use Kube-router for NetworkPolicy
content_type: task
weight: 40
-->

<!-- overview -->
<!--
This page shows how to use [Kube-router](https://github.com/cloudnativelabs/kube-router) for NetworkPolicy.
-->
本页展示如何使用 [Kube-router](https://github.com/cloudnativelabs/kube-router) 提供 NetworkPolicy。


## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster running. If you do not already have a cluster, you can create one by using any of the cluster installers like Kops, Bootkube, Kubeadm etc.
-->
你需要拥有一个运行中的 Kubernetes 集群。如果你还没有集群，可以使用任意的集群
安装程序如 Kops、Bootkube、Kubeadm 等创建一个。

<!-- steps -->
<!--
## Installing Kube-router addon

The Kube-router Addon comes with a Network Policy Controller that watches Kubernetes API server for any NetworkPolicy and pods updated and configures iptables rules and ipsets to allow or block traffic as directed by the policies. Please follow the [trying Kube-router with cluster installers](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers) guide to install Kube-router addon.
-->
## 安装 kube-router 插件   {#installing-kube-router-addon}

kube-router 插件自带一个网络策略控制器，监视来自于 Kubernetes API 服务器的
NetworkPolicy 和 Pod 的变化，根据策略指示配置 iptables 规则和 ipsets 来允许或阻止流量。
请根据 [通过集群安装程序尝试 kube-router](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers) 指南安装 kube-router 插件。

## {{% heading "whatsnext" %}}

<!--
Once you have installed the Kube-router addon, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
-->
在你安装了 kube-router 插件后，可以参考
[声明网络策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
去尝试使用 Kubernetes NetworkPolicy。

