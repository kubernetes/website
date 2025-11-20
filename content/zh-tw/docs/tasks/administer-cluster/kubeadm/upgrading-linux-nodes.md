---
title: 升級 Linux 節點
content_type: task
weight: 40
---
<!--
title: Upgrading Linux nodes
content_type: task
weight: 40
-->

<!-- overview -->

<!--
This page explains how to upgrade a Linux Worker Nodes created with kubeadm.
-->
本頁講述瞭如何升級用 kubeadm 創建的 Linux 工作節點。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}

<!--
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Linux Worker nodes.
-->
* 你自己要熟悉[升級剩餘 kubeadm 叢集的過程](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)。
  你需要先升級控制面節點，再升級 Linux 工作節點。

<!-- steps -->

<!--
## Changing the package repository

If you're using the community-owned package repositories (`pkgs.k8s.io`), you need to 
enable the package repository for the desired Kubernetes minor release. This is explained in
[Changing the Kubernetes package repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)
document.
-->
## 更改軟體包倉庫   {#changing-the-package-repository}

如果你正在使用社區自治的軟體包倉庫（`pkgs.k8s.io`），
你需要啓用所需的 Kubernetes 小版本的軟體包倉庫。
這一點在[更改 Kubernetes 軟體包倉庫](/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/)文檔中有詳細說明。

{{% legacy-repos-deprecation %}}

<!--
## Upgrading worker nodes

### Upgrade kubeadm

Upgrade kubeadm:
-->
## 升級工作節點   {#upgrading-worker-nodes}

### 升級 kubeadm   {#upgrade-kubeadm}

升級 kubeadm：

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
# 將 {{< skew currentVersion >}}.x-* 中的 x 替換爲最新的補丁版本
sudo apt-mark unhold kubeadm && \
sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
sudo apt-mark hold kubeadm
```
{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}
<!--
For systems with DNF:
```shell
# replace x in {{< skew currentVersion >}}.x-* with the latest patch version
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```
-->
對於使用 DNF 的系統：
```shell
# 將 {{< skew currentVersion >}}.x-* 中的 x 替換爲最新的補丁版本
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```

<!--
For systems with DNF5:
```shell
# replace x in {{< skew currentVersion >}}.x-* with the latest patch version
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
```
-->
對於使用 DNF5 的系統：
```shell
# 將 {{< skew currentVersion >}}.x-* 中的 x 替換爲最新的補丁版本
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
```
{{% /tab %}}
{{< /tabs >}}

<!--
### Call "kubeadm upgrade"

For worker nodes this upgrades the local kubelet configuration:
-->
### 執行 "kubeadm upgrade"    {#call-kubeadm-upgrade}

對於工作節點，下面的命令會升級本地的 kubelet 設定：

```shell
sudo kubeadm upgrade node
```

<!--
### Drain the node

Prepare the node for maintenance by marking it unschedulable and evicting the workloads:
-->
### 騰空節點   {#drain-node}

將節點標記爲不可調度並驅逐所有負載，準備節點的維護：

<!--
```shell
# execute this command on a control plane node
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```
-->
```shell
# 在控制平面節點上執行此命令
# 將 <node-to-drain> 替換爲你正騰空的節點的名稱
kubectl drain <node-to-drain> --ignore-daemonsets
```

<!--
### Upgrade kubelet and kubectl

1. Upgrade the kubelet and kubectl:
-->
### 升級 kubelet 和 kubectl   {#upgrade-kubelet-and-kubectl}

1. 升級 kubelet 和 kubectl:

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
   # 將 {{< skew currentVersion >}}.x-* 中的 x 替換爲最新的補丁版本
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```
   {{% /tab %}}
   {{% tab name="CentOS、RHEL 或 Fedora" %}}
   <!--
   For systems with DNF:
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   -->
   對於使用 DNF 的系統：
   ```shell
   # 將 {{< skew currentVersion >}}.x-* 中的 x 替換爲最新的補丁版本
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   <!--
   For systems with DNF5:
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```
   -->
   對於使用 DNF5 的系統：
   ```shell
   # 將 {{< skew currentVersion >}}.x-* 中的 x 替換爲最新的補丁版本
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```
   {{% /tab %}}
   {{< /tabs >}}

<!--
1. Restart the kubelet:
-->
2. 重啓 kubelet：

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

<!--
### Uncordon the node

Bring the node back online by marking it schedulable:
-->
### 取消對節點的保護   {#uncordon-node}

通過將節點標記爲可調度，讓節點重新上線：

<!--
```shell
# execute this command on a control plane node
# replace <node-to-uncordon> with the name of your node
kubectl uncordon <node-to-uncordon>
```
-->
```shell
# 在控制平面節點上執行此命令
# 將 <node-to-uncordon> 替換爲你的節點名稱
kubectl uncordon <node-to-uncordon>
```

## {{% heading "whatsnext" %}}

<!--
* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
-->
* 查閱如何[升級 Windows 節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)。
