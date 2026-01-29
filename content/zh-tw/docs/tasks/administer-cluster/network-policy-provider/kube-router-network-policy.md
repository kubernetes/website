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
本頁展示如何使用 [Kube-router](https://github.com/cloudnativelabs/kube-router) 提供 NetworkPolicy。


## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster running. If you do not already have a cluster, you can create one by using any of the cluster installers like Kops, Bootkube, Kubeadm etc.
-->
你需要擁有一個運行中的 Kubernetes 叢集。如果你還沒有叢集，可以使用任意的叢集
安裝程式如 Kops、Bootkube、Kubeadm 等創建一個。

<!-- steps -->
<!--
## Installing Kube-router addon

The Kube-router Addon comes with a Network Policy Controller that watches Kubernetes API server for any NetworkPolicy and pods updated and configures iptables rules and ipsets to allow or block traffic as directed by the policies. Please follow the [trying Kube-router with cluster installers](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers) guide to install Kube-router addon.
-->
## 安裝 kube-router 插件   {#installing-kube-router-addon}

kube-router 插件自帶一個網路策略控制器，監視來自於 Kubernetes API 伺服器的
NetworkPolicy 和 Pod 的變化，根據策略指示設定 iptables 規則和 ipsets 來允許或阻止流量。
請根據 [通過叢集安裝程式嘗試 kube-router](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers) 指南安裝 kube-router 插件。

## {{% heading "whatsnext" %}}

<!--
Once you have installed the Kube-router addon, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
-->
在你安裝了 kube-router 插件後，可以參考
[聲明網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
去嘗試使用 Kubernetes NetworkPolicy。

