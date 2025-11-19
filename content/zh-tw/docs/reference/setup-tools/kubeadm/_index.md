---
title: "Kubeadm"
weight: 10
no_list: true
content_type: concept
card:
  title: kubeadm 命令參考
  name: setup
  weight: 80
---
<!--
title: "Kubeadm"
weight: 10
no_list: true
content_type: concept
card:
  title: kubeadm command reference
  name: setup
  weight: 80
-->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">

<!-- 
Kubeadm is a tool built to provide `kubeadm init` and `kubeadm join` as best-practice "fast paths" for creating Kubernetes clusters.
 -->
Kubeadm 是一個提供了 `kubeadm init` 和 `kubeadm join` 的工具，
作爲創建 Kubernetes 集羣的 “快捷途徑” 的最佳實踐。

<!-- 
kubeadm performs the actions necessary to get a minimum viable cluster up and running. By design, it cares only about bootstrapping,
not about provisioning machines. Likewise, installing various nice-to-have addons, like the Kubernetes Dashboard, monitoring solutions, and cloud-specific addons, is not in scope.
 -->
kubeadm 通過執行必要的操作來啓動和運行最小可用集羣。
按照設計，它只關注啓動引導，而非配置機器。同樣的，
安裝各種 “錦上添花” 的擴展，例如 Kubernetes Dashboard、
監控方案、以及特定雲平臺的擴展，都不在討論範圍內。

<!-- 
Instead, we expect higher-level and more tailored tooling to be built on top of kubeadm, and ideally, using kubeadm as the basis of all deployments will make it easier to create conformant clusters.
 -->
相反，我們希望在 kubeadm 之上構建更高級別以及更加合規的工具，
理想情況下，使用 kubeadm 作爲所有部署工作的基準將會更加易於創建一致性集羣。

<!-- 
## How to install
 -->
## 如何安裝

<!-- 
To install kubeadm, see the [installation guide](/docs/setup/production-environment/tools/kubeadm/install-kubeadm).
-->
要安裝 kubeadm, 請查閱
[安裝指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

## {{% heading "whatsnext" %}}

<!-- 
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) to bootstrap a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) to upgrade a Kubernetes cluster to a newer version
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token) to manage tokens for `kubeadm join`
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm certs](/docs/reference/setup-tools/kubeadm/kubeadm-certs) to manage Kubernetes certificates
* [kubeadm kubeconfig](/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig) to manage kubeconfig files
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version) to print the kubeadm version
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) to preview a set of features made available for gathering feedback from the community
 -->
* [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init)
  用於搭建控制平面節點
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join)
  用於搭建工作節點並將其加入到集羣中
* [kubeadm upgrade](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-upgrade)
  用於升級 Kubernetes 集羣到新版本
* [kubeadm config](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config)
  如果你使用了 v1.7.x 或更低版本的 kubeadm 版本初始化你的集羣，則使用
  `kubeadm upgrade` 來配置你的集羣
* [kubeadm token](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token)
  用於管理 `kubeadm join` 使用的令牌
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset)
  用於恢復通過 `kubeadm init` 或者 `kubeadm join` 命令對節點進行的任何變更
* [kubeadm certs](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-certs)
  用於管理 Kubernetes 證書
* [kubeadm kubeconfig](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-kubeconfig)
  用於管理 kubeconfig 文件
* [kubeadm version](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-version)
  用於打印 kubeadm 的版本信息
* [kubeadm alpha](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-alpha)
  用於預覽一組可用於收集社區反饋的特性
