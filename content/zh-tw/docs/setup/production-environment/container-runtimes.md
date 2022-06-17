---
title: 容器執行時
content_type: concept
weight: 20
---
<!--
reviewers:
- vincepri
- bart0sh
title: Container Runtimes
content_type: concept
weight: 20
-->

<!-- overview -->

<!-- 
{{% dockershim-removal %}}

You need to install a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
into each node in the cluster so that Pods can run there. This page outlines
what is involved and describes related tasks for setting up nodes.
 -->
你需要在叢集內每個節點上安裝一個
{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}
以使 Pod 可以執行在上面。本文概述了所涉及的內容並描述了與節點設定相關的任務。


<!-- 
Kubernetes {{< skew currentVersion >}} requires that you use a runtime that conforms with the {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

See [CRI version support](#cri-versions) for more information.
This page provides an outline of how to use several common container runtimes with Kubernetes.
 -->

Kubernetes {{< skew currentVersion >}} 要求你使用符合{{<glossary_tooltip term_id="cri" text="容器執行時介面">}} (CRI)的執行時。

有關詳細資訊，請參閱 [CRI 版本支援](#cri-versions)。
本頁簡要介紹在 Kubernetes 中幾個常見的容器執行時的用法。

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

<!-- 
{{< note >}}
Kubernetes releases before v1.24 included a direct integration with Docker Engine,
using a component named _dockershim_. That special direct integration is no longer
part of Kubernetes (this removal was
[announced](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
as part of the v1.20 release).
You can read
[Check whether Dockershim deprecation affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/)
to understand how this removal might
affect you. To learn about migrating from using dockershim, see
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

If you are running a version of Kubernetes other than v{{< skew currentVersion >}},
check the documentation for that version.
{{< /note >}}

 -->
 {{< note >}}
提示：v1.24 之前的 Kubernetes 版本包括與 Docker Engine 的直接整合，使用名為 _dockershim_ 的元件。 
這種特殊的直接整合不再是 Kubernetes 的一部分
（這次刪除被作為 v1.20 發行版本的一部分[宣佈](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)）。
你可以閱讀[檢查 Dockershim 棄用是否會影響你](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/) 
以瞭解此刪除可能會如何影響你。 
要了解如何使用 dockershim 進行遷移，請參閱[從 dockershim 遷移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)。

如果你正在執行 v{{< skew currentVersion >}} 以外的 Kubernetes 版本，檢查該版本的文件。
{{< /note >}}

<!-- body -->
<!-- 
## Install and configure prerequisites

The following steps apply common settings for Kubernetes nodes on Linux. 

You can skip a particular setting if you're certain you don't need it.

For more information, see [Network Plugin Requirements](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements) or the documentation for your specific container runtime.
 -->

## 安裝和配置先決條件

以下步驟將通用設定應用於 Linux 上的 Kubernetes 節點。

如果你確定不需要某個特定設定，則可以跳過它。

有關更多資訊，請參閱[網路外掛要求](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements) 
或特定容器執行時的文件。

<!-- 
### Forwarding IPv4 and letting iptables see bridged traffic

Verify that the `br_netfilter` module is loaded by running `lsmod | grep br_netfilter`. 

To load it explicitly, run `sudo modprobe br_netfilter`.

In order for a Linux node's iptables to correctly view bridged traffic, verify that `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config. For example: 
-->

### 轉發 IPv4 並讓 iptables 看到橋接流量

透過執行 `lsmod | grep br_netfilter` 來驗證 `br_netfilter` 模組是否已載入。

若要顯式載入此模組，請執行 `sudo modprobe br_netfilter`。

為了讓 Linux 節點的 iptables 能夠正確檢視橋接流量，請確認 `sysctl` 配置中的
`net.bridge.bridge-nf-call-iptables` 設定為 1。 例如：

<!-- 
```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
``` 
-->

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 設定所需的 sysctl 引數，引數在重新啟動後保持不變
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 應用 sysctl 引數而不重新啟動
sudo sysctl --system
```

<!--
## Cgroup drivers
-->
## Cgroup 驅動程式

<!--
On Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}} are used to constrain resources that are allocated to processes.

When [systemd](https://www.freedesktop.org/wiki/Software/systemd/) is chosen as the init
system for a Linux distribution, the init process generates and consumes a root control group
(`cgroup`) and acts as a cgroup manager.
Systemd has a tight integration with cgroups and allocates a cgroup per systemd unit. It's possible
to configure your container runtime and the kubelet to use `cgroupfs`. Using `cgroupfs` alongside
systemd means that there will be two different cgroup managers.
-->
在 Linux 上，{{<glossary_tooltip text="控制組（CGroup）" term_id="cgroup" >}}用於限制分配給程序的資源。

當某個 Linux 系統發行版使用 [systemd](https://www.freedesktop.org/wiki/Software/systemd/)
作為其初始化系統時，初始化程序會生成並使用一個 root 控制組（`cgroup`），並充當 cgroup 管理器。
Systemd 與 cgroup 整合緊密，並將為每個 systemd 單元分配一個 cgroup。
你也可以配置容器執行時和 kubelet 使用 `cgroupfs`。
連同 systemd 一起使用 `cgroupfs` 意味著將有兩個不同的 cgroup 管理器。

<!--
A single cgroup manager simplifies the view of what resources are being allocated
and will by default have a more consistent view of the available and in-use resources.
When there are two cgroup managers on a system, you end up with two views of those resources.
In the field, people have reported cases where nodes that are configured to use `cgroupfs`
for the kubelet and Docker, but `systemd` for the rest of the processes, become unstable under
resource pressure.
-->
單個 cgroup 管理器將簡化分配資源的檢視，並且預設情況下將對可用資源和使用
中的資源具有更一致的檢視。
當有兩個管理器共存於一個系統中時，最終將對這些資源產生兩種檢視。
在此領域人們已經報告過一些案例，某些節點配置讓 kubelet 和 docker 使用
`cgroupfs`，而節點上執行的其餘程序則使用 systemd; 這類節點在資源壓力下
會變得不穩定。

<!--
Changing the settings such that your container runtime and kubelet use `systemd` as the cgroup driver
stabilized the system. To configure this for Docker, set `native.cgroupdriver=systemd`.
-->
更改設定，令容器執行時和 kubelet 使用 `systemd` 作為 cgroup 驅動，以此使系統更為穩定。
對於 Docker, 設定 `native.cgroupdriver=systemd` 選項。

<!--
{{< caution >}}
Changing the cgroup driver of a Node that has joined a cluster is a sensitive operation. 
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the Pod sandbox
for such existing Pods. Restarting the kubelet may not solve such errors.

If you have automation that makes it feasible, replace the node with another using the updated
configuration, or reinstall it using automation.
{{< /caution >}}
-->
注意：更改已加入叢集的節點的 cgroup 驅動是一項敏感的操作。
如果 kubelet 已經使用某 cgroup 驅動的語義建立了 pod，更改執行時以使用
別的 cgroup 驅動，當為現有 Pods 重新建立 PodSandbox 時會產生錯誤。
重啟 kubelet 也可能無法解決此類問題。
如果你有切實可行的自動化方案，使用其他已更新配置的節點來替換該節點，
或者使用自動化方案來重新安裝。

<!--
### Cgroup version 2 {#cgroup-v2}

Cgroup v2 is the next version of the cgroup Linux API.  Differently than cgroup v1, there is a single
hierarchy instead of a different one for each controller.
-->
### Cgroup v2 {#cgroup-v2}

Cgroup v2 是 cgroup Linux API 的下一個版本。與 cgroup v1 不同的是，
Cgroup v2 只有一個層次結構，而不是每個控制器有一個不同的層次結構。

<!--
The new version offers several improvements over cgroup v1, some of these improvements are:

- cleaner and easier to use API
- safe sub-tree delegation to containers
- newer features like Pressure Stall Information
-->
新版本對 cgroup v1 進行了多項改進，其中一些改進是：

- 更簡潔、更易於使用的 API
- 可將安全子樹委派給容器
- 更新的功能，如壓力失速資訊（Pressure Stall Information）

<!--
Even if the kernel supports a hybrid configuration where some controllers are managed by cgroup v1
and some others by cgroup v2, Kubernetes supports only the same cgroup version to manage all the
controllers.

If systemd doesn't use cgroup v2 by default, you can configure the system to use it by adding
`systemd.unified_cgroup_hierarchy=1` to the kernel command line.
-->
儘管核心支援混合配置，即其中一些控制器由 cgroup v1 管理，另一些由 cgroup v2 管理，
Kubernetes 僅支援使用同一 cgroup 版本來管理所有控制器。

如果 systemd 預設不使用 cgroup v2，你可以透過在核心命令列中新增 
`systemd.unified_cgroup_hierarchy=1` 來配置系統去使用它。

<!-- 
```shell
# This example is for a Linux OS that uses the DNF package manager
# Your system might use a different method for setting the command line
# that the Linux kernel uses.
sudo dnf install -y grubby && \
  sudo grubby \
  --update-kernel=ALL \
  --args="systemd.unified_cgroup_hierarchy=1"
``` 
-->

```shell
# 此示例適用於使用 DNF 包管理器的 Linux 作業系統
# 你的系統可能使用不同的方法來設定 Linux 核心使用的命令列。
sudo dnf install -y grubby && \
  sudo grubby \
  --update-kernel=ALL \
  --args="systemd.unified_cgroup_hierarchy=1"
```

<!--
If you change the command line for the kernel, you must reboot the node before your change takes effect.

There should not be any noticeable difference in the user experience when switching to cgroup v2, unless
users are accessing the cgroup file system directly, either on the node or from within the containers.

In order to use it, cgroup v2 must be supported by the CRI runtime as well.
-->
如果更改核心的命令列，則必須重新啟動節點才能使更改生效。

切換到 cgroup v2 時，使用者體驗不應有任何明顯差異，
除非使用者直接在節點上或在容器內訪問 cgroup 檔案系統。
為了使用它，CRI 執行時也必須支援 cgroup v2。

<!-- 
### Migrating to the `systemd` driver in kubeadm managed clusters
-->
### 將 kubeadm 託管的叢集遷移到 `systemd` 驅動

<!-- 
If you wish to migrate to the `systemd` cgroup driver in existing kubeadm managed clusters, follow [configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

## CRI version support {#cri-versions}

Your container runtime must support at least v1alpha2 of the container runtime interface.

Kubernetes {{< skew currentVersion >}}  defaults to using v1 of the CRI API.If a container runtime does not support the v1 API, the kubelet falls back to using the (deprecated) v1alpha2 API instead.
-->
如果你希望將現有的由 kubeadm 管理的叢集遷移到 `systemd` cgroup 驅動程式，
請按照[配置 cgroup 驅動程式](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)操作。

## CRI 版本支援 {#cri-versions}

你的容器執行時必須至少支援容器執行時介面的 v1alpha2。

Kubernetes {{< skew currentVersion >}} 預設使用 v1 的 CRI API。如果容器執行時不支援 v1 API，
則 kubelet 會回退到使用（已棄用的）v1alpha2 API。

<!-- 
## Container runtimes
 -->
## 容器執行時

{{% thirdparty-content %}}

### containerd

<!--
This section outlines the necessary steps to use containerd as CRI runtime.

Use the following commands to install Containerd on your system:

-->
本節概述了使用 containerd 作為 CRI 執行時的必要步驟。

使用以下命令在系統上安裝 Containerd：

<!-- 
Follow the instructions for [getting started with containerd](https://github.com/containerd/containerd/blob/main/docs getting-started.md). Return to this step once you've created a valid configuration file, `config.toml`. 
 -->

按照[開始使用 containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) 的說明進行操作。 
建立有效的配置檔案 `config.toml` 後返回此步驟。

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
<!-- You can find this file under the path `/etc/containerd/config.toml`. -->
你可以在路徑 `/etc/containerd/config.toml` 下找到此檔案。
{{% /tab %}}
{{< tab name="Windows" >}}
<!-- You can find this file under the path `C:\Program Files\containerd\config.toml`. -->
你可以在路徑 `C:\Program Files\containerd\config.toml` 下找到此檔案。
{{< /tab >}}
{{< /tabs >}}

<!-- 
On Linux the default CRI socket for containerd is `/run/containerd/containerd.sock`.
On Windows the default CRI endpoint is `npipe://./pipe/containerd-containerd`.

#### Configuring the `systemd` cgroup driver {#containerd-systemd}
--> 
在 Linux 上，containerd 的預設 CRI 套接字是 `/run/containerd/containerd.sock`。
在 Windows 上，預設 CRI 端點是 `npipe://./pipe/containerd-containerd`。

#### 配置 `systemd` cgroup 驅動程式 {#containerd-systemd}

<!-- 
To use the `systemd` cgroup driver in `/etc/containerd/config.toml` with `runc`, set
-->
結合 `runc` 使用 `systemd` cgroup 驅動，在 `/etc/containerd/config.toml` 中設定 

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

<!--
If you apply this change, make sure to restart containerd:
-->
如果你應用此更改，請確保重新啟動 containerd：

```shell
sudo systemctl restart containerd
```

<!--
When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).
-->
當使用 kubeadm 時，請手動配置
[kubelet 的 cgroup 驅動](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).

### CRI-O

<!--
This section contains the necessary steps to install CRI-O as a container runtime.

-->
本節包含安裝 CRI-O 作為容器執行時的必要步驟。

<!-- 
To install CRI-O, follow [CRI-O Install Instructions](https://github.com/cri-o/cri-o/blob/main/install.md#readme).
-->

要安裝 CRI-O，請按照 [CRI-O 安裝說明](https://github.com/cri-o/cri-o/blob/main/install.md#readme)執行操作。

<!-- #### cgroup driver -->

#### cgroup 驅動程式

<!--
 CRI-O uses the systemd cgroup driver per default, which is likely to work fine for you. To switch to the `cgroupfs` cgroup driver, either edit `/etc/crio/crio.conf` or place a drop-in configuration in `/etc/crio/crio.conf.d/02-cgroup-manager.conf`, for example: 
-->

CRI-O 預設使用 systemd cgroup 驅動程式，這對你來說可能工作得很好。要切換到 `cgroupfs` cgroup 驅動程式，
請編輯 `/etc/crio/crio.conf` 或在 `/etc/crio/crio.conf.d/02-cgroup-manager.conf` 中放置一個插入式配置 ，例如：


```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

<!--
 You should also note the changed `conmon_cgroup`, which has to be set to the value `pod` when using CRI-O with `cgroupfs`. It is generally necessary to keep the cgroup driver configuration of the kubelet (usually done via kubeadm) and CRI-O in sync.
-->

你還應該注意到 `conmon_cgroup` 被更改，當使用 CRI-O 和 `cgroupfs` 時，必須將其設定為值 `pod`。
通常需要保持 kubelet 的 cgroup 驅動配置（通常透過 kubeadm 完成）和 CRI-O 同步。

<!-- 
For CRI-O, the CRI socket is `/var/run/crio/crio.sock` by default.

### Docker Engine {#docker}

-->
對於 CRI-O，CRI 套接字預設為 `/var/run/crio/crio.sock`。

### Docker Engine {#docker}

<!-- 
{{< note >}}
These instructions assume that you are using the [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) adapter to integrate
Docker Engine with Kubernetes.
{{< /note >}} 
-->

{{< note >}}
以下操作假設你使用 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) 介面卡來將
Docker Engine 與 Kubernetes 整合。
{{< /note >}} 

<!--
 1. On each of your nodes, install Docker for your Linux distribution as per [Install Docker Engine](https://docs.docker.com/engine/install/#server). 
 -->

1. 在你的每個節點上，遵循[安裝 Docker 引擎](https://docs.docker.com/engine/install/#server)指南為你的
   Linux 發行版安裝 Docker。

<!-- 
2. Install [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd), following the instructions in that source code repository.
-->
2. 按照原始碼倉庫中的說明安裝 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)。


<!--
For `cri-dockerd`, the CRI socket is `/run/cri-dockerd.sock` by default.
 
### Mirantis Container Runtime {#mcr}
-->
對於 `cri-dockerd`，預設情況下，CRI 套接字是 `/run/cri-dockerd.sock`。
 
### Mirantis 容器執行時 {#mcr}

<!--
[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR) is a commercially available container runtime that was formerly known as Docker Enterprise Edition.
You can use Mirantis Container Runtime with Kubernetes using the open source [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) component, included with MCR.
-->
[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR) 是一種商用容器執行時，以前稱為 Docker 企業版。
你可以使用 MCR 中包含的開源 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) 元件將 Mirantis Container Runtime 與 Kubernetes 一起使用。

<!--
To learn more about how to install Mirantis Container Runtime, visit [MCR Deployment Guide](https://docs.mirantis.com/mcr/20.10/install.html). 
-->
要了解有關如何安裝 Mirantis Container Runtime 的更多資訊，請訪問 [MCR 部署指南](https://docs.mirantis.com/mcr/20.10/install.html)。
<!-- 
Check the systemd unit named `cri-docker.socket` to find out the path to the CRI socket.
-->
檢查名為 `cri-docker.socket` 的 systemd 單元以找出 CRI 套接字的路徑。

## {{% heading "whatsnext" %}}

<!-- 
As well as a container runtime, your cluster will need a working [network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model).
-->

除了容器執行時，你的叢集還需要有效的[網路外掛](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model)。


