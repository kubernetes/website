---
title: 容器執行階段
content_type: concept
weight: 20
---
<!-- 
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
您需要在叢集中的每個節點安裝
{{< glossary_tooltip text="容器執行階段" term_id="container-runtime" >}}，
以便 Pod 能在這些節點上執行。本頁概述所需的設定內容，並說明設定節點時的相關工作。

<!-- 
Kubernetes {{< skew currentVersion >}} requires that you use a runtime that
conforms with the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).
-->
Kubernetes {{< skew currentVersion >}} 要求您使用符合
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI) 的執行階段。

<!-- 
See [CRI version support](#cri-versions) for more information.
-->
如需更多資訊，請參閱 [CRI 版本支援](#cri-versions)。

<!-- 
This page provides an outline of how to use several common container runtimes with
Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)
-->
本頁概述了如何將數種常見的容器執行階段與 Kubernetes 搭配使用。

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
You can read
[Check whether Dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
to understand how this removal might affect you. To learn about migrating from using dockershim, see
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

If you are running a version of Kubernetes other than v{{< skew currentVersion >}},
check the documentation for that version.
-->
Kubernetes v1.24 之前的版本透過一個名為 _dockershim_ 的組件，直接與 Docker Engine 整合。
這種特殊的直接整合已不再是 Kubernetes 的一部分（這項移除已於 v1.20 版本發布時[公告](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)）。
您可以閱讀[確認 Dockershim 移除是否會影響您](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)，
了解此移除可能對您造成的影響。
若要了解如何從 dockershim 遷移，請參閱[從 dockershim 遷移](/docs/tasks/administer-cluster/migrating-from-dockershim/)。

如果您執行的 Kubernetes 版本不是 v{{< skew currentVersion >}}，請查看該版本的文件。
{{< /note >}}

<!-- body -->
<!-- 
## Install and configure prerequisites
-->
## 安裝與設定前置作業

<!-- 
### Network configuration
-->
### 網路設定

<!-- 
By default, the Linux kernel does not allow IPv4 packets to be routed
between interfaces. Most Kubernetes cluster networking implementations
will change this setting (if needed), but some might expect the
administrator to do it for them. (Some might also expect other sysctl
parameters to be set, kernel modules to be loaded, etc; consult the
documentation for your specific network implementation.)
-->
預設情況下，Linux 核心不允許在介面之間路由 IPv4 封包。
大多數 Kubernetes 叢集網路實作都會修改此設定（如果需要），但有些實作可能會要求管理員自行完成這項設定。
（有些實作也可能預期管理員設定其他 sysctl 參數、載入核心模組等；請針對您所使用的特定網路實作，參閱其說明文件。）

<!-- 
### Enable IPv4 packet forwarding {#prerequisite-ipv4-forwarding-optional}
-->
### 啟用 IPv4 封包轉發 {#prerequisite-ipv4-forwarding-optional}

<!-- 
To manually enable IPv4 packet forwarding:
-->
若要手動啟用 IPv4 封包轉發：

```bash
# 設定所需的 sysctl 參數，這些參數會在重新開機後保留
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# 不重新開機，直接套用 sysctl 參數
sudo sysctl --system
```

<!-- 
Verify that `net.ipv4.ip_forward` is set to 1 with:
-->
透過以下指令驗證 `net.ipv4.ip_forward` 是否已設定為 1：

```bash
sysctl net.ipv4.ip_forward
```

<!-- 
## cgroup drivers
-->
## cgroup 驅動程式

<!-- 
On Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
are used to constrain resources that are allocated to processes.
-->
在 Linux 系統上，{{< glossary_tooltip text="控制群組" term_id="cgroup" >}} 是用於限制分配給行程的資源。

<!-- 
Both the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and the
underlying container runtime need to interface with control groups to enforce
[resource management for pods and containers](/docs/concepts/configuration/manage-resources-containers/)
and set resources such as cpu/memory requests and limits. To interface with control
groups, the kubelet and the container runtime need to use a *cgroup driver*.
It's critical that the kubelet and the container runtime use the same cgroup
driver and are configured the same.
-->
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 與底層的容器執行階段都需要與控制群組互動，
以強制執行 [Pod 與容器的資源管理](/docs/concepts/configuration/manage-resources-containers/)，並設定如 CPU、記憶體等資源的請求與限制。
為了與控制群組互動，kubelet 和容器執行階段需要使用 *cgroup 驅動程式*。
kubelet 和容器執行階段必須使用相同的 cgroup 驅動程式，且設定保持一致，這一點非常重要。

<!-- 
There are two cgroup drivers available:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)
-->
有兩種可用的 cgroup 驅動程式：

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

<!-- 
### cgroupfs driver {#cgroupfs-cgroup-driver}
-->
### cgroupfs 驅動程式 {#cgroupfs-cgroup-driver}

<!-- 
The `cgroupfs` driver is the [default cgroup driver in the kubelet](/docs/reference/config-api/kubelet-config.v1beta1).
 When the `cgroupfs` driver is used, the kubelet and the container runtime directly interface with
 the cgroup filesystem to configure cgroups.
-->
`cgroupfs` 驅動程式是 [kubelet 預設的 cgroup 驅動程式](/docs/reference/config-api/kubelet-config.v1beta1)。
當使用 `cgroupfs` 驅動程式時，kubelet 和容器執行階段會直接透過 cgroup 檔案系統來設定 cgroup。

<!-- 
The `cgroupfs` driver is **not** recommended when
[systemd](https://www.freedesktop.org/wiki/Software/systemd/) is the
init system because systemd expects a single cgroup manager on
the system. Additionally, if you use [cgroup v2](/docs/concepts/architecture/cgroups), use the `systemd`
cgroup driver instead of `cgroupfs`.
-->
當 [systemd](https://www.freedesktop.org/wiki/Software/systemd/) 是系統的 init 系統時，
**不建議**使用 `cgroupfs` 驅動程式，因為 systemd 預期系統上只有單一 cgroup 管理器。
此外，如果您使用 [cgroup v2](/docs/concepts/architecture/cgroups)，請使用 `systemd` cgroup 驅動程式而非 `cgroupfs`。

<!-- 
### systemd cgroup driver {#systemd-cgroup-driver}
-->
### systemd cgroup 驅動程式 {#systemd-cgroup-driver}

<!-- 
When [systemd](https://www.freedesktop.org/wiki/Software/systemd/) is chosen as the init
system for a Linux distribution, the init process generates and consumes a root control group
(`cgroup`) and acts as a cgroup manager.
-->
當 Linux 發行版選擇 [systemd](https://www.freedesktop.org/wiki/Software/systemd/) 作為 init 系統時，
init 行程會產生並使用一個 root control group（根控制群組，`cgroup`），並扮演 cgroup 管理器的角色。

<!-- 
systemd has a tight integration with cgroups and allocates a cgroup per systemd
unit. As a result, if you use `systemd` as the init system with the `cgroupfs`
driver, the system gets two different cgroup managers.
-->
systemd 與 cgroup 具有緊密的整合，並會為每個 systemd 單元分配一個 cgroup。
因此，如果您將 `systemd` 作為 init 系統並搭配 `cgroupfs` 驅動程式使用，系統中將會出現兩個不同的 cgroup 管理器。

<!-- 
Two cgroup managers result in two views of the available and in-use resources in
the system. In some cases, nodes that are configured to use `cgroupfs` for the
kubelet and container runtime, but use `systemd` for the rest of the processes become
unstable under resource pressure.
-->
兩個 cgroup 管理器會導致系統對可用資源與已用資源產生兩種不同的解讀。
在某些情況下，如果節點被設定為在 kubelet 和容器執行階段使用 `cgroupfs`，而其他行程則使用 `systemd`；
在資源壓力下，系統可能會變得不穩定。

<!-- 
The approach to mitigate this instability is to use `systemd` as the cgroup driver for
the kubelet and the container runtime when systemd is the selected init system.
-->
若 systemd 是所選的 init 系統，建議讓 kubelet 和容器執行階段也使用 `systemd` 作為 cgroup 驅動程式，以緩解這種不穩定性。

<!-- 
To set `systemd` as the cgroup driver, edit the
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
option of `cgroupDriver` and set it to `systemd`. For example:
-->
若要將 cgroup 驅動程式設定為 `systemd`，請編輯 [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) 
中的 `cgroupDriver` 選項，並將其設定為 `systemd`。例如：

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
從 v1.22 及後續版本開始，當使用 kubeadm 建立叢集時，如果使用者未在 `KubeletConfiguration` 下設定 `cgroupDriver` 欄位，kubeadm 預設會將其設定為 `systemd`。
{{< /note >}}

<!-- 
If you configure `systemd` as the cgroup driver for the kubelet, you must also
configure `systemd` as the cgroup driver for the container runtime. Refer to
the documentation for your container runtime for instructions. For example:

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)
-->
如果您將 kubelet 的 cgroup 驅動程式設定為 `systemd`，您也必須將容器執行階段的 cgroup 驅動程式設定為 `systemd`。相關說明請參閱您的容器執行階段文件。例如：

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

<!-- 
In Kubernetes {{< skew currentVersion >}}, with the `KubeletCgroupDriverFromCRI`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled and a container runtime that supports the `RuntimeConfig` CRI RPC,
the kubelet automatically detects the appropriate cgroup driver from the runtime,
and ignores the `cgroupDriver` setting within the kubelet configuration.
-->
在 Kubernetes {{< skew currentVersion >}} 中，若啟用 `KubeletCgroupDriverFromCRI`
[功能開關](/docs/reference/command-line-tools-reference/feature-gates/)，
並且容器執行階段支援 `RuntimeConfig` CRI RPC，kubelet 將自動從執行階段偵測合適的 cgroup 驅動程式，
並忽略 kubelet 設定中的 `cgroupDriver` 設定。

<!-- 
However, older versions of container runtimes (specifically,
containerd 1.y and below) do not support the `RuntimeConfig` CRI RPC, and
may not respond correctly to this query, and thus the Kubelet falls back to using the
value in its own `--cgroup-driver` flag.
-->
然而，較舊版本的容器執行階段（具體來說，containerd 1.y 及更低版本）不支援 `RuntimeConfig` CRI RPC，因此可能無法正確回應此查詢，導致 kubelet 改用自身 `--cgroup-driver` 參數的值。

<!-- 
In Kubernetes 1.36, this fallback behavior will be dropped, and older versions
of containerd will fail with newer kubelets.
-->
在 Kubernetes 1.36 中，此退回機制將被移除，這意味著較舊版本的 containerd 將無法搭配較新的 kubelet 運作。

{{< caution >}}
<!--
Changing the cgroup driver of a Node that has joined a cluster is a sensitive operation.
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the Pod sandbox
for such existing Pods. Restarting the kubelet may not solve such errors.

If you have automation that makes it feasible, replace the node with another using the updated
configuration, or reinstall it using automation.
-->
對於已加入叢集的節點，變更其 cgroup 驅動程式是一項敏感的操作。
若 kubelet 已依照某種 cgroup 驅動程式的語意建立 Pod，之後將容器執行階段改為另一種 cgroup 驅動程式時，嘗試重建這些既有 Pod 的沙盒可能會引發錯誤。這類錯誤可能無法透過重啟 kubelet 來解決。 

如果您的自動化流程允許，請使用已更新設定的另一個節點來替換該節點，或是透過自動化機制重新安裝該節點。
{{< /caution >}}

<!-- 
### Migrating to the `systemd` driver in kubeadm managed clusters
-->
### 在 kubeadm 管理的叢集中遷移至 `systemd` 驅動程式

<!-- 
If you wish to migrate to the `systemd` cgroup driver in existing kubeadm managed clusters,
follow [configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
-->
如果您希望在現有由 kubeadm 管理的叢集中遷移至 `systemd` cgroup 驅動程式，請遵循[設定 cgroup 驅動程式](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)的說明。

<!-- 
## CRI version support {#cri-versions}
-->
## CRI 版本支援 {#cri-versions}

<!-- 
Your container runtime must support at least v1alpha2 of the container runtime interface.
-->
您的容器執行階段必須至少支援 v1alpha2 的容器執行階段介面。

<!-- 
Kubernetes [starting v1.26](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_only works_ with v1 of the CRI API. Earlier versions default
to v1 version, however if a container runtime does not support the v1 API, the kubelet falls back to
using the (deprecated) v1alpha2 API instead.
-->
Kubernetes [自 v1.26 起](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_僅支援_ v1 版本的 CRI API。較早版本預設使用 v1 版本，但如果容器執行階段不支援 v1 API，kubelet 將改用（已棄用的）v1alpha2 API。

<!-- 
## Container runtimes
-->
## 容器執行階段

{{% thirdparty-content %}}

<!-- 
### containerd
-->
### containerd

<!-- 
This section outlines the necessary steps to use containerd as CRI runtime.
-->
本節概述將 containerd 作為 CRI 執行階段所需的步驟。

<!-- 
To install containerd on your system, follow the instructions on
[getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
Return to this step once you've created a valid `config.toml` configuration file.
-->
若要在您的系統上安裝 containerd，請遵循 [getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) 中的說明。
當您建立好有效的 `config.toml` 設定檔後，請回到此步驟。

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
<!--
You can find this file under the path `/etc/containerd/config.toml`.
-->
您可以在 `/etc/containerd/config.toml` 路徑下找到此檔案。
{{% /tab %}}
{{% tab name="Windows" %}}
<!--
You can find this file under the path `C:\Program Files\containerd\config.toml`.
-->
您可以在 `C:\Program Files\containerd\config.toml` 路徑下找到此檔案。
{{% /tab %}}
{{< /tabs >}}

<!-- 
On Linux the default CRI socket for containerd is `/run/containerd/containerd.sock`.
On Windows the default CRI endpoint is `npipe://./pipe/containerd-containerd`.
-->
在 Linux 上，containerd 的預設 CRI socket 為 `/run/containerd/containerd.sock`。
在 Windows 上，預設的 CRI 端點為 `npipe://./pipe/containerd-containerd`。

<!-- 
#### Configuring the `systemd` cgroup driver {#containerd-systemd}
-->
#### 設定 `systemd` cgroup 驅動程式 {#containerd-systemd}

<!-- 
To use the `systemd` cgroup driver in `/etc/containerd/config.toml` with `runc`,
set the following config based on your Containerd version
-->
若要在 `/etc/containerd/config.toml` 中搭配 `runc` 使用 `systemd` cgroup 驅動程式，請根據您的 Containerd 版本設定以下配置：

<!-- 
Containerd versions 1.x:
-->
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
Containerd 2.x 版本：

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

<!-- 
The `systemd` cgroup driver is recommended if you use [cgroup v2](/docs/concepts/architecture/cgroups).
-->
如果您使用 [cgroup v2](/docs/concepts/architecture/cgroups)，則建議使用 `systemd` cgroup 驅動程式。

{{< note >}}
<!--
If you installed containerd from a package (for example, RPM or `.deb`), you may find
that the CRI integration plugin is disabled by default.

You need CRI support enabled to use containerd with Kubernetes. Make sure that `cri`
is not included in the`disabled_plugins` list within `/etc/containerd/config.toml`;
if you made changes to that file, also restart `containerd`.

If you experience container crash loops after the initial cluster installation or after
installing a CNI, the containerd configuration provided with the package might contain
incompatible configuration parameters. Consider resetting the containerd configuration
with `containerd config default > /etc/containerd/config.toml` as specified in
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
and then set the configuration parameters specified above accordingly.
-->
如果您是透過套件（例如 RPM 或 `.deb`）安裝 containerd，您可能會發現 CRI 整合外掛程式預設為停用。

您需要啟用 CRI 支援才能讓 containerd 與 Kubernetes 一起運作。請確認 `/etc/containerd/config.toml` 中的 `disabled_plugins` 列表未包含 `cri`；如果您修改了該檔案，請同時重新啟動 `containerd`。

如果您在叢集初始安裝後或安裝 CNI 後遇到容器不斷重啟，可能是因為套件提供的 containerd 設定包含不相容的參數。建議參照 [getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics) 的說明，使用 `containerd config default > /etc/containerd/config.toml` 重設 containerd 設定，再依照上方說明設定指定的參數。
{{< /note >}}

<!-- 
If you apply this change, make sure to restart containerd:
-->
如果您套用了上述變更，請務必重新啟動 containerd：

```shell
sudo systemctl restart containerd
```

<!-- 
When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).
-->
使用 kubeadm 時，請手動設定 [kubelet 的 cgroup 驅動程式](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver)。

<!-- 
In Kubernetes v1.28, you can enable automatic detection of the
cgroup driver as an alpha feature. See [systemd cgroup driver](#systemd-cgroup-driver)
for more details.
-->
在 Kubernetes v1.28 中，您可以將自動偵測 cgroup 驅動程式啟用為 alpha 階段功能。如需更多細節，請參閱 [systemd cgroup 驅動程式](#systemd-cgroup-driver)。

<!-- 
#### Overriding the sandbox (pause) image {#override-pause-image-containerd}
-->
#### 覆寫沙盒（pause）映像檔 {#override-pause-image-containerd}

<!-- 
In your [containerd config](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) you can overwrite the
sandbox image by setting the following config:
-->
在您的 [containerd 設定](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)中，您可以透過設定以下內容來覆寫沙盒映像檔：

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

<!-- 
You might need to restart `containerd` as well once you've updated the config file: `systemctl restart containerd`.
-->
更新設定檔後，您可能還需要重新啟動 `containerd`：`systemctl restart containerd`。

<!-- 
### CRI-O
-->
### CRI-O

<!-- 
This section contains the necessary steps to install CRI-O as a container runtime.
-->
本節包含將 CRI-O 安裝為容器執行階段所需的步驟。

<!-- 
To install CRI-O, follow [CRI-O Install Instructions](https://github.com/cri-o/packaging/blob/main/README.md#usage).
-->
若要安裝 CRI-O，請遵循 [CRI-O 安裝說明](https://github.com/cri-o/packaging/blob/main/README.md#usage)。

<!-- 
#### cgroup driver
-->
#### cgroup 驅動程式

<!-- 
CRI-O uses the systemd cgroup driver per default, which is likely to work fine
for you. To switch to the `cgroupfs` cgroup driver, either edit
`/etc/crio/crio.conf` or place a drop-in configuration in
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`, for example:
-->
CRI-O 預設使用 systemd cgroup 驅動程式，這通常可以正常運作。若要切換為 `cgroupfs` cgroup 驅動程式，您可以編輯 `/etc/crio/crio.conf` 或是在 `/etc/crio/crio.conf.d/02-cgroup-manager.conf` 放置一個補充設定檔，例如：

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
您也應注意已變更的 `conmon_cgroup`。當 CRI-O 與 `cgroupfs` 搭配使用時，`conmon_cgroup` 必須設定為 `pod`。一般來說，必須保持 kubelet（通常透過 kubeadm 設定）和 CRI-O 的 cgroup 驅動程式設定同步。

<!-- 
In Kubernetes v1.28, you can enable automatic detection of the
cgroup driver as an alpha feature. See [systemd cgroup driver](#systemd-cgroup-driver)
for more details.
-->
在 Kubernetes v1.28 中，您可以將自動偵測 cgroup 驅動程式啟用為 alpha 階段功能。如需更多細節，請參閱 [systemd cgroup 驅動程式](#systemd-cgroup-driver)。

<!-- 
For CRI-O, the CRI socket is `/var/run/crio/crio.sock` by default.
-->
對於 CRI-O，預設的 CRI socket 是 `/var/run/crio/crio.sock`。

<!-- 
#### Overriding the sandbox (pause) image {#override-pause-image-cri-o}
-->
#### 覆寫沙盒（pause）映像檔 {#override-pause-image-cri-o}

<!-- 
In your [CRI-O config](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) you can set the following
config value:
-->
在您的 [CRI-O 設定](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md)中，您可以設定以下配置值：

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

<!-- 
This config option supports live configuration reload to apply this change: `systemctl reload crio` or by sending
`SIGHUP` to the `crio` process.
-->
此設定選項支援即時重新載入以套用變更：執行 `systemctl reload crio`，或向 `crio` 行程發送 `SIGHUP` 訊號。

<!-- 
### Docker Engine {#docker}
-->
### Docker Engine {#docker}

{{< note >}}
<!--
These instructions assume that you are using the
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) adapter to integrate
Docker Engine with Kubernetes.
-->
這些說明假設您正在使用 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) 轉接器，以將 Docker Engine 與 Kubernetes 整合。
{{< /note >}}

<!-- 
1. On each of your nodes, install Docker for your Linux distribution as per
  [Install Docker Engine](https://docs.docker.com/engine/install/#server).
-->
1. 在您的每個節點上，根據[安裝 Docker Engine](https://docs.docker.com/engine/install/#server) 的說明，為您的 Linux 發行版安裝 Docker。

<!-- 
2. Install [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), following the directions in the install section of the documentation.
-->
2. 請依照文件中安裝章節的說明，安裝 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install)。

<!-- 
For `cri-dockerd`, the CRI socket is `/run/cri-dockerd.sock` by default.
-->
對於 `cri-dockerd`，預設的 CRI socket 是 `/run/cri-dockerd.sock`。

<!-- 
### Mirantis Container Runtime {#mcr}
-->
### Mirantis 容器執行階段 {#mcr}

<!-- 
[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) is a commercially
available container runtime that was formerly known as Docker Enterprise Edition.
-->
[Mirantis 容器執行階段](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) 是一種商用的容器執行階段，其前身為 Docker Enterprise Edition。

<!-- 
You can use Mirantis Container Runtime with Kubernetes using the open source
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) component, included with MCR.
-->
您可以透過 MCR 內建的開源 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) 組件，將 Mirantis 容器執行階段搭配 Kubernetes 使用。

<!-- 
To learn more about how to install Mirantis Container Runtime,
visit [MCR Deployment Guide](https://docs.mirantis.com/mcr/25.0/install.html).
-->
要進一步了解如何安裝 Mirantis 容器執行階段，請參閱 [MCR 部署指南](https://docs.mirantis.com/mcr/25.0/install.html)。

<!-- 
Check the systemd unit named `cri-docker.socket` to find out the path to the CRI
socket.
-->
檢查名為 `cri-docker.socket` 的 systemd 單元，以找出 CRI socket 的路徑。

<!-- 
#### Overriding the sandbox (pause) image {#override-pause-image-cri-dockerd-mcr}
-->
#### 覆寫沙盒（pause）映像檔 {#override-pause-image-cri-dockerd-mcr}

<!-- 
The `cri-dockerd` adapter accepts a command line argument for
specifying which container image to use as the Pod infrastructure container (“pause image”).
The command line argument to use is `--pod-infra-container-image`.
-->
`cri-dockerd` 轉接器接受一個命令列參數，用於指定要作為 Pod 基礎設施容器（「pause 映像檔」）使用的容器映像檔。
要使用的命令列參數為 `--pod-infra-container-image`。

<!-- 
## {{% heading "whatsnext" %}}
-->
## {{% heading "whatsnext" %}}

<!-- 
As well as a container runtime, your cluster will need a working
[network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).
-->
除了容器執行階段之外，您的叢集也需要可用的[網路外掛程式](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)。
