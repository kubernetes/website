---
reviewers:
- murali-reddy
title: 使用 Kube-router 作为 NetworkPolicy
content_template: templates/task
weight: 30
---

{{% capture overview %}}
<!-- This page shows how to use [Kube-router](https://github.com/cloudnativelabs/kube-router) for NetworkPolicy. -->
本页展示了如何使用 [Kube-router](https://github.com/cloudnativelabs/kube-router) 作为 NetworkPolicy。
{{% /capture %}}

{{% capture prerequisites %}}
<!-- You need to have a Kubernetes cluster running. If you do not already have a cluster, you can create one by using any of the cluster installers like Kops, Bootkube, Kubeadm etc. -->

您需要拥有一个正在运行的 Kubernetes 集群。如果您还没有集群，可以使用任意的集群安装器如 Kops，Bootkube，Kubeadm 等创建一个。
{{% /capture %}}

{{% capture steps %}}
<!-- ## Installing Kube-router addon
The Kube-router Addon comes with a Network Policy Controller that watches Kubernetes API server for any NetworkPolicy and pods updated and configures iptables rules and ipsets to allow or block traffic as directed by the policies. Please follow the [trying Kube-router with cluster installers](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers) guide to install Kube-router addon. -->

## 安装 Kube-router 插件
Kube-router 插件自带一个Network Policy 控制器，监视来自于Kubernetes API server 的 NetworkPolicy 和 pods 的变化，根据策略指示配置 iptables 规则和 ipsets 来允许或阻止流量。请根据 [尝试通过集群安装器使用 Kube-router](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers) 指南安装 Kube-router 插件。
{{% /capture %}}

{{% capture whatsnext %}}
<!-- Once you have installed the Kube-router addon, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy. -->
在您安装 Kube-router 插件后，可以根据 [声明 Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) 去尝试使用 Kubernetes NetworkPolicy。
{{% /capture %}}
