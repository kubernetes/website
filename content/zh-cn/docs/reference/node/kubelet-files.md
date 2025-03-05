---
content_type: "reference"
title: kubelet 所使用的本地文件和路径
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
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 是一个运行在 Kubernetes
{{< glossary_tooltip text="节点" term_id="node" >}}上的无状态进程。本文简要介绍了 kubelet 读写的文件。

{{< note >}}

<!--
This document is for informational purpose and not describing any guaranteed behaviors or APIs.
It lists resources used by the kubelet, which is an implementation detail and a subject to change at any release.
-->
本文仅供参考，而非描述保证会发生的行为或 API。
本文档列举 kubelet 所使用的资源。所给的信息属于实现细节，可能会在后续版本中发生变更。

{{< /note >}}

<!--
The kubelet typically uses the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} as
the source of truth on what needs to run on the Node, and the
{{<glossary_tooltip text="container runtime" term_id="container-runtime">}} to retrieve
the current state of containers. So long as you provide a _kubeconfig_ (API client configuration)
to the kubelet, the kubelet does connect to your control plane; otherwise the node operates in
_standalone mode_.
-->
kubelet 通常使用{{< glossary_tooltip text="控制面" term_id="control-plane" >}}作为需要在 Node
上运行的事物的真实来源，并使用{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}获取容器的当前状态。
只要你向 kubelet 提供 **kubeconfig**（API 客户端配置），kubelet 就会连接到你的控制面；
否则，节点将以**独立（Standalone）**模式运行。

<!--
On Linux nodes, the kubelet also relies on reading cgroups and various system files to collect metrics.

On Windows nodes, the kubelet collects metrics via a different mechanism that does not rely on
paths.

There are also a few other files that are used by the kubelet as well as kubelet communicates using local Unix-domain sockets. Some are sockets that the
kubelet listens on, and for other sockets the kubelet discovers them and then connects
as a client.
-->
在 Linux 节点上，kubelet 还需要读取 cgroups 和各种系统文件来收集指标。

在 Windows 节点上，kubelet 不依赖于路径，而是通过其他机制来收集指标。

kubelet 所使用的还有其他文件，包括其使用本地 Unix 域套接字进行通信的文件。
有些文件是 kubelet 要监听的套接字，而其他套接字则是 kubelet 先发现后作为客户端连接的。

{{< note >}}

<!--
This page lists paths as Linux paths, which map to the Windows paths by adding a root disk
`C:\` in place of `/` (unless specified otherwise). For example, `/var/lib/kubelet/device-plugins` maps to `C:\var\lib\kubelet\device-plugins`.
-->
本页列举的路径为 Linux 路径，若要映射到 Windows，你可以添加根磁盘 `C:\` 替换 `/`（除非另行指定）。
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

你可以使用命令行参数 `--config` 指定 kubelet 配置文件的路径。kubelet
还支持[插件（Drop-in）配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/#kubelet-conf-d)来增强配置。

<!--
### Certificates

Certificates and private keys are typically located at `/var/lib/kubelet/pki`,
but can be configured using the `--cert-dir` kubelet command line argument.
Names of certificate files are also configurable.
-->
### 证书   {#certificates}

证书和私钥通常位于 `/var/lib/kubelet/pki`，但你可以使用 `--cert-dir` kubelet 命令行参数进行配置。
证书文件的名称也是可以配置的。

<!--
### Manifests

Manifests for static pods are typically located in `/etc/kubernetes/manifests`.
Location can be configured using the `staticPodPath` kubelet configuration option.
-->
### 清单   {#manifests}

静态 Pod 的清单通常位于 `/etc/kubernetes/manifests`。
你可以使用 `staticPodPath` kubelet 配置选项进行配置。

<!--
### Systemd unit settings

When kubelet is running as a systemd unit, some kubelet configuration may be declared
in systemd unit settings file. Typically it includes:

- command line arguments to [run kubelet](/docs/reference/command-line-tools-reference/kubelet/)
- environment variables, used by kubelet or [configuring golang runtime](https://pkg.go.dev/runtime#hdr-Environment_Variables)
-->
### systemd 单元设置    {#systemd-unit-settings}

当 kubelet 作为 systemd 单元运行时，一些 kubelet 配置可以在 systemd 单元设置文件中声明。
这些配置通常包括：

- [运行 kubelet 的命令行参数](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
- kubelet 所使用的环境变量或[配置 Golang 运行时](https://pkg.go.dev/runtime#hdr-Environment_Variables)

<!--
## State

### Checkpoint files for resource managers {#resource-managers-state}

All resource managers keep the mapping of Pods to allocated resources in state files.
State files are located in the kubelet's base directory, also termed the _root directory_
(but not the same as `/`, the node root directory). You can configure the base directory
for the kubelet
using the kubelet command line argument `--root-dir`.
-->
## 状态   {#state}

### 资源管理器的检查点文件   {#resource-managers-state}

所有资源管理器将 Pod 与已分配资源之间的映射保存在状态文件中。
状态文件位于 kubelet 的基础目录，也称为**根目录**（但与节点根目录 `/` 不同）之下。
你可以使用 kubelet 命令行参数 `--root-dir` 来配置 kubelet 的基础目录。

<!--
Names of files:

- `memory_manager_state` for the [Memory Manager](/docs/tasks/administer-cluster/memory-manager/)
- `cpu_manager_state` for the [CPU Manager](/docs/tasks/administer-cluster/cpu-management-policies/)
- `dra_manager_state` for [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
-->
文件名称：

- `memory_manager_state` 对应[内存管理器](/zh-cn/docs/tasks/administer-cluster/memory-manager/)
- `cpu_manager_state` 对应 [CPU 管理器](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)
- `dra_manager_state` 对应 [DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)

<!--
### Checkpoint file for device manager {#device-manager-state}

Device manager creates checkpoints in the same directory with socket files: `/var/lib/kubelet/device-plugins/`.
The name of a checkpoint file is `kubelet_internal_checkpoint` for [Device Manager](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)

### Pod status checkpoint storage {#pod-status-manager-state}
-->
### 设备管理器的检查点文件   {#device-manager-state}

设备管理器在与套接字文件相同的目录（`/var/lib/kubelet/device-plugins/`）中创建检查点。
对于[设备管理器](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)，
检查点文件的名称为 `kubelet_internal_checkpoint`。

### Pod 状态检查点存储   {#pod-status-manager-state}

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

<!--
If your cluster has  
[in-place Pod vertical scaling](/docs/concepts/workloads/autoscaling/#in-place-resizing)  
enabled ([feature gate](/docs/reference/command-line-tools-reference/feature-gates/)  
name `InPlacePodVerticalScaling`), then the kubelet stores a local record of allocated Pod resources. 

The file name is `pod_status_manager_state` within the kubelet base directory
(`/var/lib/kubelet` by default on Linux; configurable using `--root-dir`).
-->
如果你的集群启用了[就地 Pod 垂直扩缩容](/zh-cn/docs/concepts/workloads/autoscaling/#in-place-resizing)
（[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)名称为 `InPlacePodVerticalScaling`），
则 kubelet 会在本地存储为 Pod 分配资源的记录。

文件名为 `pod_status_manager_state`，位于 kubelet 基础目录内
（在 Linux 上默认为 `/var/lib/kubelet`；你可以使用 `--root-dir` 进行配置）。

<!--
### Container runtime

Kubelet communicates with the container runtime using socket configured via the
configuration parameters:

- `containerRuntimeEndpoint` for runtime operations
- `imageServiceEndpoint` for image management operations

The actual values of those endpoints depend on the container runtime being used.
-->
### 容器运行时   {#container-runtime}

kubelet 使用通过配置参数所配置的套接字与容器运行时进行通信：

- `containerRuntimeEndpoint` 用于运行时操作
- `imageServiceEndpoint` 用于镜像管理操作

这些端点的实际值取决于所使用的容器运行时。

<!--
### Device plugins

The kubelet exposes a socket at the path `/var/lib/kubelet/device-plugins/kubelet.sock` for
various [Device Plugins to register](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-implementation).

When a device plugin registers itself, it provides its socket path for the kubelet to connect.

The device plugin socket should be in the directory `device-plugins` within the kubelet base
directory. On a typical Linux node, this means `/var/lib/kubelet/device-plugins`.
-->
### 设备插件   {#device-plugins}

kubelet 在路径 `/var/lib/kubelet/device-plugins/kubelet.sock`
为各个[要注册的设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-implementation)公开一个套接字。

当设备插件注册自己时，它会为提供其套接字路径供 kubelet 连接使用。

设备插件套接字应位于 kubelet 基础目录中的 `device-plugins` 目录内。
在典型的 Linux 节点上，这意味着 `/var/lib/kubelet/device-plugins`。

<!--
### Pod resources API

[Pod Resources API](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
will be exposed at the path `/var/lib/kubelet/pod-resources`.
-->
### Pod Resources API

[Pod Resources API](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
将在路径 `/var/lib/kubelet/pod-resources` 上被公开。

<!--
### DRA, CSI, and Device plugins

The kubelet looks for socket files created by device plugins managed via [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/),
device manager, or storage plugins, and then attempts to connect
to these sockets. The directory that the kubelet looks in is `plugins_registry` within the kubelet base
directory, so on a typical Linux node this means `/var/lib/kubelet/plugins_registry`.
-->
### DRA、CSI 和设备插件   {#dra-csi-and-device-plugins}

kubelet 会查找通过 [DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
设备管理器或存储插件所管理的设备插件所创建的套接字文件，然后尝试连接到这些套接字。
kubelet 查找的目录是 kubelet 基础目录下的 `plugins_registry`，
因此在典型的 Linux 节点上这意味着 `/var/lib/kubelet/plugins_registry`。

<!--
Note, for the device plugins there are two alternative registration mechanisms. Only one should be used for a given plugin.

The types of plugins that can place socket files into that directory are:

- CSI plugins
- DRA plugins
- Device Manager plugins

(typically `/var/lib/kubelet/plugins_registry`).
-->
请注意，对于设备插件，有两种备选的注册机制。每个给定的插件只能使用其中一种注册机制。

可以将套接字文件放入该目录的插件类型包括：

- CSI 插件
- DRA 插件
- 设备管理器插件

（通常是 `/var/lib/kubelet/plugins_registry`）。

<!--
### Graceful node shutdown
-->
### 节点体面关闭   {#graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

<!--
[Graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)
stores state locally at `/var/lib/kubelet/graceful_node_shutdown_state`.
-->
[节点体面关闭](/zh-cn/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)将状态存储在本地目录
`/var/lib/kubelet/graceful_node_shutdown_state`。

<!--
## Security profiles & configuration

### Seccomp

Seccomp profile files referenced from Pods should be placed in `/var/lib/kubelet/seccomp`.
See the [seccomp reference](/docs/reference/node/seccomp/) for details.
-->
## 安全配置文件和配置   {#security-profiles-configuration}

### Seccomp

被 Pod 引用的 Seccomp 配置文件应放置在 `/var/lib/kubelet/seccomp`。
有关细节请参见 [Seccomp 参考](/zh-cn/docs/reference/node/seccomp/)。

<!--
### AppArmor

The kubelet does not load or refer to AppArmor profiles by a Kubernetes-specific path.
AppArmor profiles are loaded via the node operating system rather then referenced by their path.

## Locking
-->
### AppArmor

kubelet 不会通过特定于 Kubernetes 的路径加载或引用 AppArmor 配置文件。
AppArmor 配置文件通过节点操作系统被加载，而不是通过其路径被引用。

## 加锁   {#locking}

{{< feature-state state="alpha" for_k8s_version="v1.2" >}}

<!--
A lock file for the kubelet; typically `/var/run/kubelet.lock`. The kubelet uses this to ensure
that two different kubelets don't try to run in conflict with each other.
You can configure the path to the lock file using the the `--lock-file` kubelet command line argument.

If two kubelets on the same node use a different value for the lock file path, they will not be able to
detect a conflict when both are running.
-->
kubelet 的锁文件；通常为 `/var/run/kubelet.lock`。
kubelet 使用此文件确保尝试运行两个不同的、彼此冲突的 kubelet。
你可以使用 `--lock-file` kubelet 命令行参数来配置这个锁文件的路径。

如果同一节点上的两个 kubelet 使用不同的锁文件路径值，则这两个 kubelet 在同时运行时将不会检测到冲突。

## {{% heading "whatsnext" %}}

<!--
- Learn about the kubelet [command line arguments](/docs/reference/command-line-tools-reference/kubelet/).
- Review the [Kubelet Configuration (v1beta1) reference](/docs/reference/config-api/kubelet-config.v1beta1/)
-->
- 了解 kubelet [命令行参数](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)。
- 查阅 [kubelet 配置 (v1beta1) 参考文档](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
