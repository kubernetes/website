---
title: 使用 Antrea 提供 NetworkPolicy
content_type: task
weight: 10
---
<!--
---
title: Use Antrea for NetworkPolicy
content_type: task
weight: 10
---
-->

<!-- overview -->
<!--
This page shows how to install and use Antrea CNI plugin on Kubernetes.
For background on Project Antrea, read the [Introduction to Antrea](https://antrea.io/docs/).
-->
本页展示了如何在 kubernetes 中安装和使用 Antrea CNI 插件。
要了解 Antrea 项目的背景，请阅读 [Antrea 介绍](https://antrea.io/docs/)。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster. Follow the
[kubeadm getting started guide](/docs/reference/setup-tools/kubeadm/) to bootstrap one.
-->
你需要拥有一个 kuernetes 集群。
遵循 [kubeadm 入门指南](/zh-cn/docs/reference/setup-tools/kubeadm/)自行创建一个。

<!-- steps -->

<!--
## Deploying Antrea with kubeadm

Follow [Getting Started](https://github.com/vmware-tanzu/antrea/blob/main/docs/getting-started.md) guide to deploy Antrea for kubeadm.
-->
## 使用 kubeadm 部署 Antrea
遵循[入门](https://github.com/vmware-tanzu/antrea/blob/main/docs/getting-started.md)指南
为 kubeadm 部署 Antrea 。

## {{% heading "whatsnext" %}}

<!--
Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
-->
一旦你的集群已经运行，你可以遵循 
[声明网络策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
来尝试 Kubernetes NetworkPolicy。