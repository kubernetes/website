---
title: 容器運行時
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

{{% dockershim-removal %}}

<!-- 
You need to install a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
into each node in the cluster so that Pods can run there. This page outlines
what is involved and describes related tasks for setting up nodes.
-->
你需要在叢集內每個節點上安裝一個
{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}
以使 Pod 可以運行在上面。本文概述了所涉及的內容並描述了與節點設置相關的任務。

<!-- 
Kubernetes {{< skew currentVersion >}} requires that you use a runtime that
conforms with the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

See [CRI version support](#cri-versions) for more information.

This page provides an outline of how to use several common container runtimes with Kubernetes.
-->
Kubernetes {{< skew currentVersion >}}
要求你使用符合{{<glossary_tooltip term_id="cri" text="容器運行時接口">}}（CRI）的運行時。

有關詳細信息，請參閱 [CRI 版本支持](#cri-versions)。
本頁簡要介紹在 Kubernetes 中幾個常見的容器運行時的用法。

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)


{{< note >}}
<!-- 
Kubernetes releases before v1.24 included a direct integration with Docker Engine,
using a component named _dockershim_. That special direct integration is no longer
part of Kubernetes (this removal was
[announced](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
as part of the v1.20 release).
-->
v1.24 之前的 Kubernetes 版本直接集成了 Docker Engine 的一個組件，名爲 **dockershim**。
這種特殊的直接整合不再是 Kubernetes 的一部分
（這次刪除被作爲 v1.20 發行版本的一部分[宣佈](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)）。

<!--
You can read
[Check whether Dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
to understand how this removal might affect you. To learn about migrating from using dockershim, see
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).
-->
你可以閱讀[檢查 Dockershim 移除是否會影響你](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)以瞭解此刪除可能會如何影響你。
要了解如何使用 dockershim 進行遷移，
請參閱[從 dockershim 遷移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)。

<!--
If you are running a version of Kubernetes other than v{{< skew currentVersion >}},
check the documentation for that version.
-->
如果你正在運行 v{{< skew currentVersion >}} 以外的 Kubernetes 版本，查看對應版本的文檔。
{{< /note >}}

<!-- body -->

<!-- 
## Install and configure prerequisites
-->
## 安裝和設定先決條件  {#install-and-configure-prerequisites}

<!--
By default, the Linux kernel does not allow IPv4 packets to be routed
between interfaces. Most Kubernetes cluster networking implementations
will change this setting (if needed), but some might expect the
administrator to do it for them. (Some might also expect other sysctl
parameters to be set, kernel modules to be loaded, etc; consult the
documentation for your specific network implementation.)
-->
默認情況下，Linux 內核不允許 IPv4 數據包在接口之間路由。
大多數 Kubernetes 叢集網路實現都會更改此設置（如果需要），但有些人可能希望管理員爲他們執行此操作。
（有些人可能還期望設置其他 sysctl 參數、加載內核模塊等；請參閱你的特定網路實施的文檔。）

<!-- 
### Enable IPv4 packet forwarding {#prerequisite-ipv4-forwarding-optional}

To manually enable IPv4 packet forwarding:
-->
### 啓用 IPv4 數據包轉發   {#prerequisite-ipv4-forwarding-optional}

手動啓用 IPv4 數據包轉發：

```bash
# 設置所需的 sysctl 參數，參數在重新啓動後保持不變
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# 應用 sysctl 參數而不重新啓動
sudo sysctl --system
```

<!--
Verify that `net.ipv4.ip_forward` is set to 1 with:
-->
使用以下命令驗證 `net.ipv4.ip_forward` 是否設置爲 1：

```bash
sysctl net.ipv4.ip_forward
```

<!--
## cgroup drivers

On Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
are used to constrain resources that are allocated to processes.
-->
## cgroup 驅動  {#cgroup-drivers}

在 Linux 上，{{<glossary_tooltip text="控制組（CGroup）" term_id="cgroup" >}}用於限制分配給進程的資源。

<!--
Both the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and the
underlying container runtime need to interface with control groups to enforce
[resource management for pods and containers](/docs/concepts/configuration/manage-resources-containers/)
and set resources such as cpu/memory requests and limits. To interface with control
groups, the kubelet and the container runtime need to use a *cgroup driver*.
It's critical that the kubelet and the container runtime use the same cgroup
driver and are configured the same.
-->
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 和底層容器運行時都需要對接控制組來強制執行
[爲 Pod 和容器管理資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
併爲諸如 CPU、內存這類資源設置請求和限制。若要對接控制組，kubelet 和容器運行時需要使用一個 **cgroup 驅動**。
關鍵的一點是 kubelet 和容器運行時需使用相同的 cgroup 驅動並且採用相同的設定。

<!--
There are two cgroup drivers available:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)
-->
可用的 cgroup 驅動有兩個：

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

<!--
### cgroupfs driver {#cgroupfs-cgroup-driver}

The `cgroupfs` driver is the [default cgroup driver in the kubelet](/docs/reference/config-api/kubelet-config.v1beta1).
When the `cgroupfs` driver is used, the kubelet and the container runtime directly interface with
the cgroup filesystem to configure cgroups.

The `cgroupfs` driver is **not** recommended when
[systemd](https://www.freedesktop.org/wiki/Software/systemd/) is the
init system because systemd expects a single cgroup manager on
the system. Additionally, if you use [cgroup v2](/docs/concepts/architecture/cgroups), use the `systemd`
cgroup driver instead of `cgroupfs`.
-->
### cgroupfs 驅動 {#cgroupfs-cgroup-driver}

`cgroupfs` 驅動是 [kubelet 中默認的 cgroup 驅動](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1)。
當使用 `cgroupfs` 驅動時， kubelet 和容器運行時將直接對接 cgroup 文件系統來設定 cgroup。

當 [systemd](https://www.freedesktop.org/wiki/Software/systemd/) 是初始化系統時，
**不** 推薦使用 `cgroupfs` 驅動，因爲 systemd 期望系統上只有一個 cgroup 管理器。
此外，如果你使用 [cgroup v2](/zh-cn/docs/concepts/architecture/cgroups)，
則應用 `systemd` cgroup 驅動取代 `cgroupfs`。

<!--
### systemd cgroup driver {#systemd-cgroup-driver}

When [systemd](https://www.freedesktop.org/wiki/Software/systemd/) is chosen as the init
system for a Linux distribution, the init process generates and consumes a root control group
(`cgroup`) and acts as a cgroup manager.

systemd has a tight integration with cgroups and allocates a cgroup per systemd
unit. As a result, if you use `systemd` as the init system with the `cgroupfs`
driver, the system gets two different cgroup managers.
-->
### systemd cgroup 驅動 {#systemd-cgroup-driver}

當某個 Linux 系統發行版使用 [systemd](https://www.freedesktop.org/wiki/Software/systemd/)
作爲其初始化系統時，初始化進程會生成並使用一個 root 控制組（`cgroup`），並充當 cgroup 管理器。

systemd 與 cgroup 集成緊密，並將爲每個 systemd 單元分配一個 cgroup。
因此，如果你 `systemd` 用作初始化系統，同時使用 `cgroupfs` 驅動，則系統中會存在兩個不同的 cgroup 管理器。

<!--
Two cgroup managers result in two views of the available and in-use resources in
the system. In some cases, nodes that are configured to use `cgroupfs` for the
kubelet and container runtime, but use `systemd` for the rest of the processes become
unstable under resource pressure.

The approach to mitigate this instability is to use `systemd` as the cgroup driver for
the kubelet and the container runtime when systemd is the selected init system.
-->
同時存在兩個 cgroup 管理器將造成系統中針對可用的資源和使用中的資源出現兩個視圖。某些情況下，
將 kubelet 和容器運行時設定爲使用 `cgroupfs`、但爲剩餘的進程使用 `systemd`
的那些節點將在資源壓力增大時變得不穩定。

當 systemd 是選定的初始化系統時，緩解這個不穩定問題的方法是針對 kubelet 和容器運行時將
`systemd` 用作 cgroup 驅動。

<!--
To set `systemd` as the cgroup driver, edit the
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
option of `cgroupDriver` and set it to `systemd`. For example:
-->
要將 `systemd` 設置爲 cgroup 驅動，需編輯 [`KubeletConfiguration`](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
的 `cgroupDriver` 選項，並將其設置爲 `systemd`。例如：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

{{< note >}}
<!--
Starting with v1.22 and later, when creating a cluster with kubeadm, if the user does not set
the `cgroupDriver` field under `KubeletConfiguration`, kubeadm defaults it to `systemd`.
-->
從 v1.22 開始，在使用 kubeadm 創建叢集時，如果使用者沒有在
`KubeletConfiguration` 下設置 `cgroupDriver` 字段，kubeadm 默認使用 `systemd`。
{{< /note >}}

<!--
If you configure `systemd` as the cgroup driver for the kubelet, you must also
configure `systemd` as the cgroup driver for the container runtime. Refer to
the documentation for your container runtime for instructions. For example:
-->
如果你將 `systemd` 設定爲 kubelet 的 cgroup 驅動，你也必須將 `systemd`
設定爲容器運行時的 cgroup 驅動。參閱容器運行時文檔，瞭解指示說明。例如：

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

<!--
In Kubernetes {{< skew currentVersion >}}, with the `KubeletCgroupDriverFromCRI`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled and a container runtime that supports the `RuntimeConfig` CRI RPC,
the kubelet automatically detects the appropriate cgroup driver from the runtime,
and ignores the `cgroupDriver` setting within the kubelet configuration.
-->
在 Kubernetes {{< skew currentVersion >}} 中，啓用 `KubeletCgroupDriverFromCRI`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)結合支持
`RuntimeConfig` CRI RPC 的容器運行時，kubelet 會自動從運行時檢測適當的 Cgroup
驅動程序，並忽略 kubelet 設定中的 `cgroupDriver` 設置。

<!--
However, older versions of container runtimes (specifically,
containerd 1.y and below) do not support the `RuntimeConfig` CRI RPC, and
may not respond correctly to this query, and thus the Kubelet falls back to using the
value in its own `--cgroup-driver` flag.

In Kubernetes 1.36, this fallback behavior will be dropped, and older versions
of containerd will fail with newer kubelets.
-->
然而，較舊版本的容器運行時（特別是 containerd 1.y 及以下版本）
不支持 `RuntimeConfig` CRI RPC，可能無法正確響應此查詢。
因此，kubelet 會回退到使用其自身的 `--cgroup-driver` 標誌中的值。

在 Kubernetes 1.36 中，這種回退行爲將被移除，舊版本的 containerd
將無法與新版本的 kubelet 一起工作。

{{< caution >}}
<!--
Changing the cgroup driver of a Node that has joined a cluster is a sensitive operation. 
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the Pod sandbox
for such existing Pods. Restarting the kubelet may not solve such errors.

If you have automation that makes it feasible, replace the node with another using the updated
configuration, or reinstall it using automation.
-->
注意：更改已加入叢集的節點的 cgroup 驅動是一項敏感的操作。
如果 kubelet 已經使用某 cgroup 驅動的語義創建了 Pod，更改運行時以使用別的
cgroup 驅動，當爲現有 Pod 重新創建 PodSandbox 時會產生錯誤。
重啓 kubelet 也可能無法解決此類問題。

如果你有切實可行的自動化方案，使用其他已更新設定的節點來替換該節點，
或者使用自動化方案來重新安裝。
{{< /caution >}}

<!-- 
### Migrating to the `systemd` driver in kubeadm managed clusters

If you wish to migrate to the `systemd` cgroup driver in existing kubeadm managed clusters,
follow [configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
-->
### 將 kubeadm 管理的叢集遷移到 `systemd` 驅動

如果你希望將現有的由 kubeadm 管理的叢集遷移到 `systemd` cgroup 驅動，
請按照[設定 cgroup 驅動](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)操作。

<!--
## CRI version support {#cri-versions}

Your container runtime must support at least v1alpha2 of the container runtime interface.

Kubernetes {{< skew currentVersion >}}  defaults to using v1 of the CRI API.
If a container runtime does not support the v1 API, the kubelet falls back to
using the (deprecated) v1alpha2 API instead.

Kubernetes [starting v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_only works_ with v1 of the CRI API. Earlier versions default
to v1 version, however if a container runtime does not support the v1 API, the kubelet falls back to
using the (deprecated) v1alpha2 API instead.
-->
## CRI 版本支持 {#cri-versions}

你的容器運行時必須至少支持 v1alpha2 版本的容器運行時接口。

Kubernetes [從 1.26 版本開始](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)**僅適用於**
v1 版本的容器運行時（CRI）API。早期版本默認爲 v1 版本，
但是如果容器運行時不支持 v1 版本的 API，
則 kubelet 會回退到使用（已棄用的）v1alpha2 版本的 API。

<!-- 
## Container runtimes
-->
## 容器運行時

{{% thirdparty-content %}}

### containerd

<!--
This section outlines the necessary steps to use containerd as CRI runtime.
-->
本節概述了使用 containerd 作爲 CRI 運行時的必要步驟。

<!-- 
To install containerd on your system, follow the instructions on
[getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
Return to this step once you've created a valid `config.toml` configuration file.
-->
要在系統上安裝 containerd，請按照[開始使用 containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)
的說明進行操作。創建有效的 `config.toml` 設定文件後返回此步驟。

{{< tabs name="finding-your-config-toml-file" >}}
{{% tab name="Linux" %}}
<!--
You can find this file under the path `/etc/containerd/config.toml`.
-->
你可以在路徑 `/etc/containerd/config.toml` 下找到此文件。
{{% /tab %}}
{{% tab name="Windows" %}}
<!--
You can find this file under the path `C:\Program Files\containerd\config.toml`.
-->
你可以在路徑 `C:\Program Files\containerd\config.toml` 下找到此文件。
{{% /tab %}}
{{< /tabs >}}

<!-- 
On Linux the default CRI socket for containerd is `/run/containerd/containerd.sock`.
On Windows the default CRI endpoint is `npipe://./pipe/containerd-containerd`.
-->
在 Linux 上，containerd 的默認 CRI 套接字是 `/run/containerd/containerd.sock`。
在 Windows 上，默認 CRI 端點是 `npipe://./pipe/containerd-containerd`。

<!--
#### Configuring the `systemd` cgroup driver {#containerd-systemd}

To use the `systemd` cgroup driver in `/etc/containerd/config.toml` with `runc`,
set the following config based on your Containerd version

Containerd versions 1.x:
-->
#### 設定 `systemd` cgroup 驅動 {#containerd-systemd}

要在 `/etc/containerd/config.toml` 中將 `runc` 設定爲使用 `systemd` cgroup 驅動，
請根據你使用的 Containerd 版本設置以下設定：

Containerd 1.x 版本：

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

<!--
Containerd versions 2.x:
-->
Containerd versions 2.x 版本：

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```


<!--
The `systemd` cgroup driver is recommended if you use [cgroup v2](/docs/concepts/architecture/cgroups).
-->
如果你使用 [cgroup v2](/zh-cn/docs/concepts/architecture/cgroups)，則推薦 `systemd` cgroup 驅動。

{{< note >}}
<!--
If you installed containerd from a package (for example, RPM or `.deb`), you may find
that the CRI integration plugin is disabled by default.

You need CRI support enabled to use containerd with Kubernetes. Make sure that `cri`
is not included in the`disabled_plugins` list within `/etc/containerd/config.toml`;
if you made changes to that file, also restart `containerd`.
-->
如果你從軟件包（例如，RPM 或者 `.deb`）中安裝 containerd，你可能會發現其中默認禁止了
CRI 集成插件。

你需要啓用 CRI 支持才能在 Kubernetes 叢集中使用 containerd。
要確保 `cri` 沒有出現在 `/etc/containerd/config.toml` 文件中 `disabled_plugins`
列表內。如果你更改了這個文件，也請記得要重啓 `containerd`。

<!--
If you experience container crash loops after the initial cluster installation or after
installing a CNI, the containerd configuration provided with the package might contain
incompatible configuration parameters. Consider resetting the containerd configuration
with `containerd config default > /etc/containerd/config.toml` as specified in
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
and then set the configuration parameters specified above accordingly.
-->
如果你在初次安裝叢集后或安裝 CNI 後遇到容器崩潰循環，則隨軟件包提供的 containerd
設定可能包含不兼容的設定參數。考慮按照
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
中指定的 `containerd config default > /etc/containerd/config.toml` 重置 containerd
設定，然後相應地設置上述設定參數。
{{< /note >}}

<!--
If you apply this change, make sure to restart containerd:
-->
如果你應用此更改，請確保重新啓動 containerd：

```shell
sudo systemctl restart containerd
```

<!--
When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).
-->
當使用 kubeadm 時，請手動設定
[kubelet 的 cgroup 驅動](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver)。

<!--
In Kubernetes v1.28, you can enable automatic detection of the
cgroup driver as an alpha feature. See [systemd cgroup driver](#systemd-cgroup-driver)
for more details.
-->
在 Kubernetes v1.28 中，你可以啓用 Cgroup 驅動程序的自動檢測的 Alpha 級別特性。
詳情參閱 [systemd cgroup 驅動](#systemd-cgroup-driver)。

<!--
#### Overriding the sandbox (pause) image {#override-pause-image-containerd}

In your [containerd config](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) you can overwrite the
sandbox image by setting the following config:
-->
#### 重載沙箱（pause）映像檔    {#override-pause-image-containerd}

在你的 [containerd 設定](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)中，
你可以通過設置以下選項重載沙箱映像檔：

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

<!--
You might need to restart `containerd` as well once you've updated the config file: `systemctl restart containerd`.
-->
一旦你更新了這個設定文件，可能就同樣需要重啓 `containerd`：`systemctl restart containerd`。

### CRI-O

<!--
This section contains the necessary steps to install CRI-O as a container runtime.

To install CRI-O, follow [CRI-O Install Instructions](https://github.com/cri-o/packaging/blob/main/README.md#usage).
-->
本節包含安裝 CRI-O 作爲容器運行時的必要步驟。

要安裝 CRI-O，請按照 [CRI-O 安裝說明](https://github.com/cri-o/packaging/blob/main/README.md#usage)執行操作。

<!--
#### cgroup driver

CRI-O uses the systemd cgroup driver per default, which is likely to work fine
for you. To switch to the `cgroupfs` cgroup driver, either edit
`/etc/crio/crio.conf` or place a drop-in configuration in
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`, for example: 
-->
#### cgroup 驅動   {#cgroup-driver}

CRI-O 默認使用 systemd cgroup 驅動，這對你來說可能工作得很好。
要切換到 `cgroupfs` cgroup 驅動，請編輯 `/etc/crio/crio.conf` 或在
`/etc/crio/crio.conf.d/02-cgroup-manager.conf` 中放置一個插入式設定，例如：

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

<!--
You should also note the changed `conmon_cgroup`, which has to be set to the value
`pod` when using CRI-O with `cgroupfs`. It is generally necessary to keep the
cgroup driver configuration of the kubelet (usually done via kubeadm) and CRI-O
in sync.
-->
你還應該注意當使用 CRI-O 時，並且 CRI-O 的 cgroup 設置爲 `cgroupfs` 時，必須將 `conmon_cgroup` 設置爲值 `pod`。
通常需要保持 kubelet 的 cgroup 驅動設定（通常通過 kubeadm 完成）和 CRI-O 同步。

<!--
In Kubernetes v1.28, you can enable automatic detection of the
cgroup driver as an alpha feature. See [systemd cgroup driver](#systemd-cgroup-driver)
for more details.
-->
在 Kubernetes v1.28 中，你可以啓用 Cgroup 驅動程序的自動檢測的 Alpha 級別特性。
詳情參閱 [systemd cgroup 驅動](#systemd-cgroup-driver)。

<!-- 
For CRI-O, the CRI socket is `/var/run/crio/crio.sock` by default.
-->
對於 CRI-O，CRI 套接字默認爲 `/var/run/crio/crio.sock`。

<!--
#### Overriding the sandbox (pause) image {#override-pause-image-cri-o}

In your [CRI-O config](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) you can set the following
config value:
-->
#### 重載沙箱（pause）映像檔   {#override-pause-image-cri-o}

在你的 [CRI-O 設定](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md)中，
你可以設置以下設定值：

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

<!--
This config option supports live configuration reload to apply this change: `systemctl reload crio` or by sending
`SIGHUP` to the `crio` process.
-->
這一設置選項支持動態設定重加載來應用所做變更：`systemctl reload crio`。
也可以通過向 `crio` 進程發送 `SIGHUP` 信號來實現。

### Docker Engine {#docker}

{{< note >}}
<!-- 
These instructions assume that you are using the
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) adapter to integrate
Docker Engine with Kubernetes.
-->
以下操作假設你使用 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) 適配器來將
Docker Engine 與 Kubernetes 集成。
{{< /note >}}

<!--
1. On each of your nodes, install Docker for your Linux distribution as per
  [Install Docker Engine](https://docs.docker.com/engine/install/#server).
-->
1. 在你的每個節點上，遵循[安裝 Docker Engine](https://docs.docker.com/engine/install/#server)
   指南爲你的 Linux 發行版安裝 Docker。

<!-- 
2. Install [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), following the directions in the install section of the documentation.
-->
2. 請按照文檔中的安裝部分指示來安裝 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install)。

<!--
For `cri-dockerd`, the CRI socket is `/run/cri-dockerd.sock` by default.
-->
對於 `cri-dockerd`，默認情況下，CRI 套接字是 `/run/cri-dockerd.sock`。

<!-- 
### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) is a commercially
available container runtime that was formerly known as Docker Enterprise Edition.

You can use Mirantis Container Runtime with Kubernetes using the open source
[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) component, included with MCR.
-->
### Mirantis 容器運行時 {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR)
是一種商用容器運行時，以前稱爲 Docker 企業版。
你可以使用 MCR 中包含的開源 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/)
組件將 Mirantis Container Runtime 與 Kubernetes 一起使用。

<!--
To learn more about how to install Mirantis Container Runtime,
visit [MCR Deployment Guide](https://docs.mirantis.com/mcr/25.0/install.html). 
-->
要了解有關如何安裝 Mirantis Container Runtime 的更多信息，
請訪問 [MCR 部署指南](https://docs.mirantis.com/mcr/25.0/install.html)。

<!-- 
Check the systemd unit named `cri-docker.socket` to find out the path to the CRI
socket.
-->
檢查名爲 `cri-docker.socket` 的 systemd 單元以找出 CRI 套接字的路徑。

<!--
#### Overriding the sandbox (pause) image {#override-pause-image-cri-dockerd-mcr}

The `cri-dockerd` adapter accepts a command line argument for
specifying which container image to use as the Pod infrastructure container (“pause image”).
The command line argument to use is `--pod-infra-container-image`.
-->
#### 重載沙箱（pause）映像檔   {#override-pause-image-cri-dockerd-mcr}

`cri-dockerd` 適配器能夠接受指定用作 Pod 的基礎容器的容器映像檔（“pause 映像檔”）作爲命令列參數。
要使用的命令列參數是 `--pod-infra-container-image`。

## {{% heading "whatsnext" %}}

<!-- 
As well as a container runtime, your cluster will need a working
[network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).
-->
除了容器運行時，你的叢集還需要有效的[網路插件](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)。
