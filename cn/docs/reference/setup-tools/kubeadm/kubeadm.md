---
cn-approvers:
- tianshapjq
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm 概述
---
<!--
---
approvers:
- mikedanese
- luxas
- jbeda
title: Overview of kubeadm
---
-->
<!--
Kubeadm is a tool built to provide `kubeadm init` and `kubeadm join` as best-practice “fast paths” for creating Kubernetes clusters. 

kubeadm performs the actions necessary to get a minimum viable cluster up and running. By design, it cares only about bootstrapping, not about provisioning machines. Likewise, installing various nice-to-have addons, like the Kubernetes Dashboard, monitoring solutions, and cloud-specific addons, is not in scope.

Instead, we expect higher-level and more tailored tooling to be built on top of kubeadm, and ideally, using kubeadm as the basis of all deployments will make it easier to create conformant clusters.
-->
Kubeadm 是一个工具，通过提供 `kubeadm init` 和 `kubeadm join` 来作为创建 Kubernetes 集群的最佳实践“快速路径”。

kubeadm 执行必要的操作来启动并运行一个最小可行集群。按照设计，它只关心引导，而不关心配置机器。同样，安装各种不同的插件，如 Kubernetes Dashboard、监控解决方案以及云特定的插件，都不在范围之内。

相反，我们期望用户能够基于 kubeadm 构建更高级别和更加定制化的工具，理想情况下，使用 kubeadm 作为所有部署的基础，可以更容易地创建一致的集群。

<!--
## What's next

* [kubeadm init](kubeadm-init.md) to bootstrap a Kubernetes master node
* [kubeadm join](kubeadm-join.md) to bootstrap a Kubernetes worker node and join it to the cluster
* [kubeadm upgrade](kubeadm-upgrade.md) to upgrade a Kubernetes cluster to a newer version
* [kubeadm config](kubeadm-config.md) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
* [kubeadm token](kubeadm-token.md) to manage tokens for `kubeadm join`
* [kubeadm reset](kubeadm-reset.md) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
## 接下来

* [kubeadm init](kubeadm-init.md) 启动一个 Kubernetes master 节点
* [kubeadm join](kubeadm-join.md) 启动一个 Kubernetes worker 节点 并且将其加入到集群中
* [kubeadm upgrade](kubeadm-upgrade.md) 更新 Kubernetes 集群到更新的版本
* [kubeadm config](kubeadm-config.md) 如果您使用 kubeadm v1.7.x 或者更低的版本来初始化您的集群，在 `kubeadm upgrade` 之前请先执行该配置
* [kubeadm token](kubeadm-token.md) 为 `kubeadm join` 管理 token
* [kubeadm reset](kubeadm-reset.md) 恢复由 `kubeadm init` 或者 `kubeadm join` 对主机所做的任何修改
