---
title: 升级 Linux 节点
content_type: task
weight: 100
---
<!--
title: Upgrading Linux nodes
content_type: task
weight: 100
-->

<!-- overview -->

<!--
This page explains how to upgrade a Linux Worker Nodes created with kubeadm.
-->
本页讲述了如何升级用 kubeadm 创建的 Linux 工作节点。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}

<!--
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Linux Worker nodes.
-->
* 你自己要熟悉[升级剩余 kubeadm 集群的过程](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)。
  你需要先升级控制面节点，再升级 Linux 工作节点。

<!-- steps -->

<!--
## Changing the package repository

If you're using the community-owned package repositories (`pkgs.k8s.io`), you need to 
enable the package repository for the desired Kubernetes minor release. This is explained in
[Changing the Kubernetes package repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)
document.
-->
## 更改软件包仓库   {#changing-the-package-repository}

如果你正在使用社区自治的软件包仓库（`pkgs.k8s.io`），
你需要启用所需的 Kubernetes 小版本的软件包仓库。
这一点在[更改 Kubernetes 软件包仓库](/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/)文档中有详细说明。

{{% legacy-repos-deprecation %}}

<!--
## Upgrading worker nodes

### Upgrade kubeadm

Upgrade kubeadm:
-->
## 升级工作节点   {#upgrading-worker-nodes}

### 升级 kubeadm   {#upgrade-kubeadm}

升级 kubeadm：

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
<!--
```shell
# replace x in {{< skew currentVersion >}}.x-* with the latest patch version
sudo apt-mark unhold kubeadm && \
sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
sudo apt-mark hold kubeadm
```
-->
```shell
# 将 {{< skew currentVersion >}}.x-* 中的 x 替换为最新的补丁版本
sudo apt-mark unhold kubeadm && \
sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
sudo apt-mark hold kubeadm
```
{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}
<!--
```shell
# replace x in {{< skew currentVersion >}}.x-* with the latest patch version
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```
-->
```shell
# 将 {{< skew currentVersion >}}.x-* 中的 x 替换为最新的补丁版本
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```
{{% /tab %}}
{{< /tabs >}}

<!--
### Call "kubeadm upgrade"

For worker nodes this upgrades the local kubelet configuration:
-->
### 执行 "kubeadm upgrade"    {#call-kubeadm-upgrade}

对于工作节点，下面的命令会升级本地的 kubelet 配置：

```shell
sudo kubeadm upgrade node
```

<!--
### Drain the node

Prepare the node for maintenance by marking it unschedulable and evicting the workloads:
-->
### 腾空节点   {#drain-node}

将节点标记为不可调度并驱逐所有负载，准备节点的维护：

<!--
```shell
# execute this command on a control plane node
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```
-->
```shell
# 在控制平面节点上执行此命令
# 将 <node-to-drain> 替换为你正腾空的节点的名称
kubectl drain <node-to-drain> --ignore-daemonsets
```

<!--
### Upgrade kubelet and kubectl

1. Upgrade the kubelet and kubectl:
-->
### 升级 kubelet 和 kubectl   {#upgrade-kubelet-and-kubectl}

1. 升级 kubelet 和 kubectl:

   {{< tabs name="k8s_kubelet_and_kubectl" >}}
   {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
   <!--
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```
   -->
   ```shell
   # 将 {{< skew currentVersion >}}.x-* 中的 x 替换为最新的补丁版本
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```
   {{% /tab %}}
   {{% tab name="CentOS、RHEL 或 Fedora" %}}
   <!--
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   -->
   ```shell
   # 将 {{< skew currentVersion >}}.x-* 中的 x 替换为最新的补丁版本
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   {{% /tab %}}
   {{< /tabs >}}

<!--
1. Restart the kubelet:
-->
2. 重启 kubelet：

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

<!--
### Uncordon the node

Bring the node back online by marking it schedulable:
-->
### 取消对节点的保护   {#uncordon-node}

通过将节点标记为可调度，让节点重新上线：

<!--
```shell
# execute this command on a control plane node
# replace <node-to-uncordon> with the name of your node
kubectl uncordon <node-to-uncordon>
```
-->
```shell
# 在控制平面节点上执行此命令
# 将 <node-to-uncordon> 替换为你的节点名称
kubectl uncordon <node-to-uncordon>
```

## {{% heading "whatsnext" %}}

<!--
* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
-->
* 查阅如何[升级 Windows 节点](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)。
