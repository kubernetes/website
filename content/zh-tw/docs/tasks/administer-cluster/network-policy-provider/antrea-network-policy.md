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
本頁展示瞭如何在 kubernetes 中安裝和使用 Antrea CNI 插件。
要了解 Antrea 項目的背景，請閱讀 [Antrea 介紹](https://antrea.io/docs/)。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster. Follow the
[kubeadm getting started guide](/docs/reference/setup-tools/kubeadm/) to bootstrap one.
-->
你需要擁有一個 kuernetes 叢集。
遵循 [kubeadm 入門指南](/zh-cn/docs/reference/setup-tools/kubeadm/)自行創建一個。

<!-- steps -->

<!--
## Deploying Antrea with kubeadm

Follow [Getting Started](https://github.com/vmware-tanzu/antrea/blob/main/docs/getting-started.md) guide to deploy Antrea for kubeadm.
-->
## 使用 kubeadm 部署 Antrea
遵循[入門](https://github.com/vmware-tanzu/antrea/blob/main/docs/getting-started.md)指南
爲 kubeadm 部署 Antrea 。

## {{% heading "whatsnext" %}}

<!--
Once your cluster is running, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
-->
一旦你的叢集已經運行，你可以遵循 
[聲明網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
來嘗試 Kubernetes NetworkPolicy。