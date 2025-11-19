---
content_type: "reference"
title: kubelet 所使用的本地文件和路徑
weight: 42
---
<!--
content_type: "reference"
title: Local Files And Paths Used By The Kubelet
weight: 42
-->

<!--
The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} is mostly a stateless
process running on a Kubernetes {{< glossary_tooltip text="node" term_id="node" >}}.
This document outlines files that kubelet reads and writes.
-->
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 是一個運行在 Kubernetes
{{< glossary_tooltip text="節點" term_id="node" >}}上的無狀態進程。本文簡要介紹了 kubelet 讀寫的文件。

{{< note >}}

<!--
This document is for informational purpose and not describing any guaranteed behaviors or APIs.
It lists resources used by the kubelet, which is an implementation detail and a subject to change at any release.
-->
本文僅供參考，而非描述保證會發生的行爲或 API。
本文檔列舉 kubelet 所使用的資源。所給的信息屬於實現細節，可能會在後續版本中發生變更。

{{< /note >}}

<!--
The kubelet typically uses the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} as
the source of truth on what needs to run on the Node, and the
{{<glossary_tooltip text="container runtime" term_id="container-runtime">}} to retrieve
the current state of containers. So long as you provide a _kubeconfig_ (API client configuration)
to the kubelet, the kubelet does connect to your control plane; otherwise the node operates in
_standalone mode_.
-->
kubelet 通常使用{{< glossary_tooltip text="控制面" term_id="control-plane" >}}作爲需要在 Node
上運行的事物的真實來源，並使用{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}獲取容器的當前狀態。
只要你向 kubelet 提供 **kubeconfig**（API 客戶端配置），kubelet 就會連接到你的控制面；
否則，節點將以**獨立（Standalone）**模式運行。

<!--
On Linux nodes, the kubelet also relies on reading cgroups and various system files to collect metrics.

On Windows nodes, the kubelet collects metrics via a different mechanism that does not rely on
paths.

There are also a few other files that are used by the kubelet as well,
as kubelet communicates using local Unix-domain sockets. Some are sockets that the
kubelet listens on, and for other sockets the kubelet discovers them and then connects
as a client.
-->
在 Linux 節點上，kubelet 還需要讀取 cgroups 和各種系統文件來收集指標。

在 Windows 節點上，kubelet 不依賴於路徑，而是通過其他機制來收集指標。

kubelet 所使用的還有其他文件，包括其使用本地 Unix 域套接字進行通信的文件。
有些文件是 kubelet 要監聽的套接字，而其他套接字則是 kubelet 先發現後作爲客戶端連接的。

{{< note >}}

<!--
This page lists paths as Linux paths, which map to the Windows paths by adding a root disk
`C:\` in place of `/` (unless specified otherwise).
For example, `/var/lib/kubelet/device-plugins` maps to `C:\var\lib\kubelet\device-plugins`.
-->
本頁列舉的路徑爲 Linux 路徑，若要映射到 Windows，你可以添加根磁盤 `C:\` 替換 `/`（除非另行指定）。
例如，`/var/lib/kubelet/device-plugins` 映射到 `C:\var\lib\kubelet\device-plugins`。

{{< /note >}}

<!--
## Configuration

### Kubelet configuration files

The path to the kubelet configuration file can be configured
using the command line argument `--config`. The kubelet also supports
[drop-in configuration files](/docs/tasks/administer-cluster/kubelet-config-file/#kubelet-conf-d)
to enhance configuration.
-->
## 配置   {#configuration}

### kubelet 配置文件   {#kubelet-configuration-files}

你可以使用命令行參數 `--config` 指定 kubelet 配置文件的路徑。kubelet
還支持[插件（Drop-in）配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/#kubelet-conf-d)來增強配置。

<!--
### Certificates

Certificates and private keys are typically located at `/var/lib/kubelet/pki`,
but can be configured using the `--cert-dir` kubelet command line argument.
Names of certificate files are also configurable.
-->
### 證書   {#certificates}

證書和私鑰通常位於 `/var/lib/kubelet/pki`，但你可以使用 `--cert-dir` kubelet 命令行參數進行配置。
證書文件的名稱也是可以配置的。

<!--
### Manifests

Manifests for static pods are typically located in `/etc/kubernetes/manifests`.
Location can be configured using the `staticPodPath` kubelet configuration option.
-->
### 清單   {#manifests}

靜態 Pod 的清單通常位於 `/etc/kubernetes/manifests`。
你可以使用 `staticPodPath` kubelet 配置選項進行配置。

<!--
### Systemd unit settings

When kubelet is running as a systemd unit, some kubelet configuration may be declared
in systemd unit settings file. Typically it includes:

- command line arguments to [run kubelet](/docs/reference/command-line-tools-reference/kubelet/)
- environment variables, used by kubelet or [configuring golang runtime](https://pkg.go.dev/runtime#hdr-Environment_Variables)
-->
### systemd 單元設置    {#systemd-unit-settings}

當 kubelet 作爲 systemd 單元運行時，一些 kubelet 配置可以在 systemd 單元設置文件中聲明。
這些配置通常包括：

- [運行 kubelet 的命令行參數](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
- kubelet 所使用的環境變量或[配置 Golang 運行時](https://pkg.go.dev/runtime#hdr-Environment_Variables)

<!--
## State

### Checkpoint files for resource managers {#resource-managers-state}

All resource managers keep the mapping of Pods to allocated resources in state files.
State files are located in the kubelet's base directory, also termed the _root directory_
(but not the same as `/`, the node root directory). You can configure the base directory
for the kubelet
using the kubelet command line argument `--root-dir`.
-->
## 狀態   {#state}

### 資源管理器的檢查點文件   {#resource-managers-state}

所有資源管理器將 Pod 與已分配資源之間的映射保存在狀態文件中。
狀態文件位於 kubelet 的基礎目錄，也稱爲**根目錄**（但與節點根目錄 `/` 不同）之下。
你可以使用 kubelet 命令行參數 `--root-dir` 來配置 kubelet 的基礎目錄。

<!--
Names of files:

- `memory_manager_state` for the [Memory Manager](/docs/tasks/administer-cluster/memory-manager/)
- `cpu_manager_state` for the [CPU Manager](/docs/tasks/administer-cluster/cpu-management-policies/)
- `dra_manager_state` for [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
-->
文件名稱：

- `memory_manager_state` 對應[內存管理器](/zh-cn/docs/tasks/administer-cluster/memory-manager/)
- `cpu_manager_state` 對應 [CPU 管理器](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)
- `dra_manager_state` 對應 [DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)

<!--
### Checkpoint file for device manager {#device-manager-state}

Device manager creates checkpoints in the same directory with socket files: `/var/lib/kubelet/device-plugins/`.
The name of a checkpoint file is `kubelet_internal_checkpoint` for
[Device Manager](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)

### Pod resource checkpoints
-->
### 設備管理器的檢查點文件   {#device-manager-state}

設備管理器在與套接字文件相同的目錄（`/var/lib/kubelet/device-plugins/`）中創建檢查點。
對於[設備管理器](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)，
檢查點文件的名稱爲 `kubelet_internal_checkpoint`。

### Pod 狀態檢查點   {#pod-resource-checkpoints}

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

<!--
If a node has enabled the `InPlacePodVerticalScaling`[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
the kubelet stores a local record of _allocated_ and _actuated_ Pod resources.
See [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
for more details on how these records are used.
-->
如果某個節點已啓用了 `InPlacePodVerticalScaling`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
則 kubelet 存儲有關 Pod 資源**已分配**和**已應用**狀態的本地記錄。  
有關如何使用這些記錄的更多細節，
請參閱[調整分配給容器的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。

<!--
Names of files:

- `allocated_pods_state` records the resources allocated to each pod running on the node
- `actuated_pods_state` records the resources that have been accepted by the runtime
  for each pod pod running on the node

The files are located within the kubelet base directory
(`/var/lib/kubelet` by default on Linux; configurable using `--root-dir`).
-->
文件名稱如下：

- `allocated_pods_state`：記錄分配給該節點上每個 Pod 的資源。
- `actuated_pods_state`：記錄運行時已接受並應用於該節點上每個 Pod 的資源。

這些文件位於 kubelet 的基礎目錄中（在 Linux 系統中默認是 `/var/lib/kubelet`；
也可以通過 `--root-dir` 參數進行配置）。

<!--
### Container runtime

Kubelet communicates with the container runtime using socket configured via the
configuration parameters:

- `containerRuntimeEndpoint` for runtime operations
- `imageServiceEndpoint` for image management operations

The actual values of those endpoints depend on the container runtime being used.
-->
### 容器運行時   {#container-runtime}

kubelet 使用通過配置參數所配置的套接字與容器運行時進行通信：

- `containerRuntimeEndpoint` 用於運行時操作
- `imageServiceEndpoint` 用於鏡像管理操作

這些端點的實際值取決於所使用的容器運行時。

<!--
### Device plugins

The kubelet exposes a socket at the path `/var/lib/kubelet/device-plugins/kubelet.sock` for
various [Device Plugins to register](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-implementation).

When a device plugin registers itself, it provides its socket path for the kubelet to connect.

The device plugin socket should be in the directory `device-plugins` within the kubelet base
directory. On a typical Linux node, this means `/var/lib/kubelet/device-plugins`.
-->
### 設備插件   {#device-plugins}

kubelet 在路徑 `/var/lib/kubelet/device-plugins/kubelet.sock`
爲各個[要註冊的設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-implementation)公開一個套接字。

當設備插件註冊自己時，它會爲提供其套接字路徑供 kubelet 連接使用。

設備插件套接字應位於 kubelet 基礎目錄中的 `device-plugins` 目錄內。
在典型的 Linux 節點上，這意味着 `/var/lib/kubelet/device-plugins`。

<!--
### Pod resources API

[Pod Resources API](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
will be exposed at the path `/var/lib/kubelet/pod-resources`.
-->
### Pod Resources API

[Pod Resources API](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
將在路徑 `/var/lib/kubelet/pod-resources` 上被公開。

<!--
### DRA, CSI, and Device plugins

The kubelet looks for socket files created by device plugins managed via [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/),
device manager, or storage plugins, and then attempts to connect
to these sockets. The directory that the kubelet looks in is `plugins_registry` within the kubelet base
directory, so on a typical Linux node this means `/var/lib/kubelet/plugins_registry`.
-->
### DRA、CSI 和設備插件   {#dra-csi-and-device-plugins}

kubelet 會查找通過 [DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
設備管理器或存儲插件所管理的設備插件所創建的套接字文件，然後嘗試連接到這些套接字。
kubelet 查找的目錄是 kubelet 基礎目錄下的 `plugins_registry`，
因此在典型的 Linux 節點上這意味着 `/var/lib/kubelet/plugins_registry`。

<!--
Note, for the device plugins there are two alternative registration mechanisms
Only one should be used for a given plugin.

The types of plugins that can place socket files into that directory are:

- CSI plugins
- DRA plugins
- Device Manager plugins

(typically `/var/lib/kubelet/plugins_registry`).
-->
請注意，對於設備插件，有兩種備選的註冊機制。每個給定的插件只能使用其中一種註冊機制。

可以將套接字文件放入該目錄的插件類型包括：

- CSI 插件
- DRA 插件
- 設備管理器插件

（通常是 `/var/lib/kubelet/plugins_registry`）。

<!--
### Graceful node shutdown
-->
### 節點體面關閉   {#graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

<!--
[Graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)
stores state locally at `/var/lib/kubelet/graceful_node_shutdown_state`.
-->
[節點體面關閉](/zh-cn/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)將狀態存儲在本地目錄
`/var/lib/kubelet/graceful_node_shutdown_state`。

<!--
### Image Pull Records
-->
### 鏡像拉取記錄   {#image-pull-records}

{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}

<!--
The kubelet stores records of attempted and successful image pulls, and uses it
to verify that the image was previously successfully pulled with the same credentials.
-->
kubelet 存儲鏡像拉取的嘗試記錄和成功記錄，並使用這些記錄來驗證鏡像是否曾使用相同的憑據被成功拉取過。

<!--
These records are cached as files in the `image_registry` directory within
the kubelet base directory. On a typical Linux node, this means `/var/lib/kubelet/image_manager`.
There are two subdirectories to `image_manager`:
* `pulling` - stores records about images the Kubelet is attempting to pull.
* `pulled` - stores records about images that were successfully pulled by the Kubelet, 
  along with metadata about the credentials used for the pulls.
-->
這些記錄作爲文件緩存在 kubelet 基礎目錄下的 `image_registry` 目錄中。
在典型的 Linux 節點上，這個路徑通常爲 `/var/lib/kubelet/image_manager`。  
`image_manager` 目錄下包含兩個子目錄：

* `pulling`：存儲 kubelet 正在嘗試拉取的鏡像的相關記錄。
* `pulled`：存儲 kubelet 成功拉取的鏡像記錄，以及與拉取所用憑據相關的元數據。

<!--
See [Ensure Image Pull Credential Verification](/docs/concepts/containers/images#ensureimagepullcredentialverification)
for details.
-->
更多細節請參閱[確保鏡像拉取憑據驗證](/zh-cn/docs/concepts/containers/images#ensureimagepullcredentialverification)。

<!--
## Security profiles & configuration

### Seccomp

Seccomp profile files referenced from Pods should be placed in `/var/lib/kubelet/seccomp`.
See the [seccomp reference](/docs/reference/node/seccomp/) for details.
-->
## 安全配置文件和配置   {#security-profiles-configuration}

### Seccomp

被 Pod 引用的 Seccomp 配置文件應放置在 `/var/lib/kubelet/seccomp`。
有關細節請參見 [Seccomp 參考](/zh-cn/docs/reference/node/seccomp/)。

<!--
### AppArmor

The kubelet does not load or refer to AppArmor profiles by a Kubernetes-specific path.
AppArmor profiles are loaded via the node operating system rather then referenced by their path.

## Locking
-->
### AppArmor

kubelet 不會通過特定於 Kubernetes 的路徑加載或引用 AppArmor 配置文件。
AppArmor 配置文件通過節點操作系統被加載，而不是通過其路徑被引用。

## 加鎖   {#locking}

{{< feature-state state="alpha" for_k8s_version="v1.2" >}}

<!--
A lock file for the kubelet; typically `/var/run/kubelet.lock`. The kubelet uses this to ensure
that two different kubelets don't try to run in conflict with each other.
You can configure the path to the lock file using the the `--lock-file` kubelet command line argument.

If two kubelets on the same node use a different value for the lock file path, they will not be able to
detect a conflict when both are running.
-->
kubelet 的鎖文件；通常爲 `/var/run/kubelet.lock`。
kubelet 使用此文件確保嘗試運行兩個不同的、彼此衝突的 kubelet。
你可以使用 `--lock-file` kubelet 命令行參數來配置這個鎖文件的路徑。

如果同一節點上的兩個 kubelet 使用不同的鎖文件路徑值，則這兩個 kubelet 在同時運行時將不會檢測到衝突。

## {{% heading "whatsnext" %}}

<!--
- Learn about the kubelet [command line arguments](/docs/reference/command-line-tools-reference/kubelet/).
- Review the [Kubelet Configuration (v1beta1) reference](/docs/reference/config-api/kubelet-config.v1beta1/)
-->
- 瞭解 kubelet [命令行參數](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)。
- 查閱 [kubelet 配置 (v1beta1) 參考文檔](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
