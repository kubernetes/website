---
# title: Overview of kubeadm
title: kubeadm 概述
weight: 10
---
<img src="https://raw.githubusercontent.com/cncf/artwork/master/projects/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">
<!-- Kubeadm is a tool built to provide `kubeadm init` and `kubeadm join` as best-practice “fast paths” for creating Kubernetes clusters. -->
Kubeadm 是一个工具，它提供了 `kubeadm init` 以及 `kubeadm join` 这两个命令作为快速创建 kubernetes 集群的最佳实践。

<!-- kubeadm performs the actions necessary to get a minimum viable cluster up and running. By design, it cares only about bootstrapping, not about provisioning machines. Likewise, installing various nice-to-have addons, like the Kubernetes Dashboard, monitoring solutions, and cloud-specific addons, is not in scope. -->
kubeadm 通过执行必要的操作来启动和运行一个最小可用的集群。它被故意设计为只关心启动集群，而不是之前的节点准备工作。同样的，诸如安装各种各样值得拥有的插件，例如 Kubernetes Dashboard、监控解决方案以及特定云提供商的插件，这些都不在它负责的范围。

<!-- Instead, we expect higher-level and more tailored tooling to be built on top of kubeadm, and ideally, using kubeadm as the basis of all deployments will make it easier to create conformant clusters. -->
相反，我们期望由一个基于 kubeadm 从更高层设计的更加合适的工具来做这些事情；并且，理想情况下，使用 kubeadm 作为所有部署的基础将会使得创建一个符合期望的集群变得容易。

<!-- ## What's next -->
## 接下可以做什么

<!-- * [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) to bootstrap a Kubernetes master node -->
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) 启动一个 Kubernetes 主节点
<!-- * [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) to bootstrap a Kubernetes worker node and join it to the cluster -->
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) 启动一个 Kubernetes 工作节点并且将其加入到集群
<!-- * [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) to upgrade a Kubernetes cluster to a newer version -->
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) 更新一个 Kubernetes 集群到新版本
<!-- * [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade` -->
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config) 如果使用 v1.7.x 或者更低版本的 kubeadm 初始化集群，您需要对集群做一些配置以便使用 `kubeadm upgrade` 命令
<!-- * [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token) to manage tokens for `kubeadm join` -->
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token) 管理 `kubeadm join` 使用的令牌
<!-- * [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) to revert any changes made to this host by `kubeadm init` or `kubeadm join` -->
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) 还原 `kubeadm init` 或者 `kubeadm join` 对主机所做的任何更改
<!-- * [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version) to print the kubeadm version -->
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version) 打印 kubeadm 版本
<!-- * [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) to preview a set of features made available for gathering feedback from the community -->
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) 预览一组可用的新功能以便从社区搜集反馈
