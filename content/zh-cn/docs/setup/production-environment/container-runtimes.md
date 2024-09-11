---
title: 容器运行时
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
你需要在集群内每个节点上安装一个
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}
以使 Pod 可以运行在上面。本文概述了所涉及的内容并描述了与节点设置相关的任务。

<!-- 
Kubernetes {{< skew currentVersion >}} requires that you use a runtime that
conforms with the
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

See [CRI version support](#cri-versions) for more information.

This page provides an outline of how to use several common container runtimes with Kubernetes.
-->
Kubernetes {{< skew currentVersion >}}
要求你使用符合{{<glossary_tooltip term_id="cri" text="容器运行时接口">}}（CRI）的运行时。

有关详细信息，请参阅 [CRI 版本支持](#cri-versions)。
本页简要介绍在 Kubernetes 中几个常见的容器运行时的用法。

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
v1.24 之前的 Kubernetes 版本直接集成了 Docker Engine 的一个组件，名为 **dockershim**。
这种特殊的直接整合不再是 Kubernetes 的一部分
（这次删除被作为 v1.20 发行版本的一部分[宣布](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)）。

<!--
You can read
[Check whether Dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
to understand how this removal might affect you. To learn about migrating from using dockershim, see
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).
-->
你可以阅读[检查 Dockershim 移除是否会影响你](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)以了解此删除可能会如何影响你。
要了解如何使用 dockershim 进行迁移，
请参阅[从 dockershim 迁移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)。

<!--
If you are running a version of Kubernetes other than v{{< skew currentVersion >}},
check the documentation for that version.
-->
如果你正在运行 v{{< skew currentVersion >}} 以外的 Kubernetes 版本，查看对应版本的文档。
{{< /note >}}

<!-- body -->

<!-- 
## Install and configure prerequisites
-->
## 安装和配置先决条件  {#install-and-configure-prerequisites}

<!--
By default, the Linux kernel does not allow IPv4 packets to be routed
between interfaces. Most Kubernetes cluster networking implementations
will change this setting (if needed), but some might expect the
administrator to do it for them. (Some might also expect other sysctl
parameters to be set, kernel modules to be loaded, etc; consult the
documentation for your specific network implementation.)
-->
默认情况下，Linux 内核不允许 IPv4 数据包在接口之间路由。
大多数 Kubernetes 集群网络实现都会更改此设置（如果需要），但有些人可能希望管理员为他们执行此操作。
（有些人可能还期望设置其他 sysctl 参数、加载内核模块等；请参阅你的特定网络实施的文档。）

<!-- 
### Enable IPv4 packet forwarding {#prerequisite-ipv4-forwarding-optional}

To manually enable IPv4 packet forwarding:
-->
### 启用 IPv4 数据包转发   {#prerequisite-ipv4-forwarding-optional}

手动启用 IPv4 数据包转发：

```bash
# 设置所需的 sysctl 参数，参数在重新启动后保持不变
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# 应用 sysctl 参数而不重新启动
sudo sysctl --system
```

<!--
Verify that `net.ipv4.ip_forward` is set to 1 with:
-->
使用以下命令验证 `net.ipv4.ip_forward` 是否设置为 1：

```bash
sysctl net.ipv4.ip_forward
```

<!--
## cgroup drivers

On Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
are used to constrain resources that are allocated to processes.
-->
## cgroup 驱动  {#cgroup-drivers}

在 Linux 上，{{<glossary_tooltip text="控制组（CGroup）" term_id="cgroup" >}}用于限制分配给进程的资源。

<!--
Both the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and the
underlying container runtime need to interface with control groups to enforce
[resource management for pods and containers](/docs/concepts/configuration/manage-resources-containers/)
and set resources such as cpu/memory requests and limits. To interface with control
groups, the kubelet and the container runtime need to use a *cgroup driver*.
It's critical that the kubelet and the container runtime use the same cgroup
driver and are configured the same.
-->
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 和底层容器运行时都需要对接控制组来强制执行
[为 Pod 和容器管理资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
并为诸如 CPU、内存这类资源设置请求和限制。若要对接控制组，kubelet 和容器运行时需要使用一个 **cgroup 驱动**。
关键的一点是 kubelet 和容器运行时需使用相同的 cgroup 驱动并且采用相同的配置。

<!--
There are two cgroup drivers available:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)
-->
可用的 cgroup 驱动有两个：

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
### cgroupfs 驱动 {#cgroupfs-cgroup-driver}

`cgroupfs` 驱动是 [kubelet 中默认的 cgroup 驱动](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1)。
当使用 `cgroupfs` 驱动时， kubelet 和容器运行时将直接对接 cgroup 文件系统来配置 cgroup。

当 [systemd](https://www.freedesktop.org/wiki/Software/systemd/) 是初始化系统时，
**不** 推荐使用 `cgroupfs` 驱动，因为 systemd 期望系统上只有一个 cgroup 管理器。
此外，如果你使用 [cgroup v2](/zh-cn/docs/concepts/architecture/cgroups)，
则应用 `systemd` cgroup 驱动取代 `cgroupfs`。

<!--
### systemd cgroup driver {#systemd-cgroup-driver}

When [systemd](https://www.freedesktop.org/wiki/Software/systemd/) is chosen as the init
system for a Linux distribution, the init process generates and consumes a root control group
(`cgroup`) and acts as a cgroup manager.

systemd has a tight integration with cgroups and allocates a cgroup per systemd
unit. As a result, if you use `systemd` as the init system with the `cgroupfs`
driver, the system gets two different cgroup managers.
-->
### systemd cgroup 驱动 {#systemd-cgroup-driver}

当某个 Linux 系统发行版使用 [systemd](https://www.freedesktop.org/wiki/Software/systemd/)
作为其初始化系统时，初始化进程会生成并使用一个 root 控制组（`cgroup`），并充当 cgroup 管理器。

systemd 与 cgroup 集成紧密，并将为每个 systemd 单元分配一个 cgroup。
因此，如果你 `systemd` 用作初始化系统，同时使用 `cgroupfs` 驱动，则系统中会存在两个不同的 cgroup 管理器。

<!--
Two cgroup managers result in two views of the available and in-use resources in
the system. In some cases, nodes that are configured to use `cgroupfs` for the
kubelet and container runtime, but use `systemd` for the rest of the processes become
unstable under resource pressure.

The approach to mitigate this instability is to use `systemd` as the cgroup driver for
the kubelet and the container runtime when systemd is the selected init system.
-->
同时存在两个 cgroup 管理器将造成系统中针对可用的资源和使用中的资源出现两个视图。某些情况下，
将 kubelet 和容器运行时配置为使用 `cgroupfs`、但为剩余的进程使用 `systemd`
的那些节点将在资源压力增大时变得不稳定。

当 systemd 是选定的初始化系统时，缓解这个不稳定问题的方法是针对 kubelet 和容器运行时将
`systemd` 用作 cgroup 驱动。

<!--
To set `systemd` as the cgroup driver, edit the
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
option of `cgroupDriver` and set it to `systemd`. For example:
-->
要将 `systemd` 设置为 cgroup 驱动，需编辑 [`KubeletConfiguration`](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
的 `cgroupDriver` 选项，并将其设置为 `systemd`。例如：

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
从 v1.22 开始，在使用 kubeadm 创建集群时，如果用户没有在
`KubeletConfiguration` 下设置 `cgroupDriver` 字段，kubeadm 默认使用 `systemd`。
{{< /note >}}

<!--
If you configure `systemd` as the cgroup driver for the kubelet, you must also
configure `systemd` as the cgroup driver for the container runtime. Refer to
the documentation for your container runtime for instructions. For example:
-->
如果你将 `systemd` 配置为 kubelet 的 cgroup 驱动，你也必须将 `systemd`
配置为容器运行时的 cgroup 驱动。参阅容器运行时文档，了解指示说明。例如：

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

<!--
In Kubernetes {{< skew currentVersion >}}, with the `KubeletCgroupDriverFromCRI`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled and a container runtime that supports the `RuntimeConfig` CRI RPC,
the kubelet automatically detects the appropriate cgroup driver from the runtime,
and ignores the `cgroupDriver` setting within the kubelet configuration.
-->
在 Kubernetes {{< skew currentVersion >}} 中，启用 `KubeletCgroupDriverFromCRI`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)结合支持
`RuntimeConfig` CRI RPC 的容器运行时，kubelet 会自动从运行时检测适当的 Cgroup
驱动程序，并忽略 kubelet 配置中的 `cgroupDriver` 设置。

{{< caution >}}
<!--
Changing the cgroup driver of a Node that has joined a cluster is a sensitive operation. 
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the Pod sandbox
for such existing Pods. Restarting the kubelet may not solve such errors.

If you have automation that makes it feasible, replace the node with another using the updated
configuration, or reinstall it using automation.
-->
注意：更改已加入集群的节点的 cgroup 驱动是一项敏感的操作。
如果 kubelet 已经使用某 cgroup 驱动的语义创建了 Pod，更改运行时以使用别的
cgroup 驱动，当为现有 Pod 重新创建 PodSandbox 时会产生错误。
重启 kubelet 也可能无法解决此类问题。

如果你有切实可行的自动化方案，使用其他已更新配置的节点来替换该节点，
或者使用自动化方案来重新安装。
{{< /caution >}}

<!-- 
### Migrating to the `systemd` driver in kubeadm managed clusters

If you wish to migrate to the `systemd` cgroup driver in existing kubeadm managed clusters,
follow [configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
-->
### 将 kubeadm 管理的集群迁移到 `systemd` 驱动

如果你希望将现有的由 kubeadm 管理的集群迁移到 `systemd` cgroup 驱动，
请按照[配置 cgroup 驱动](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)操作。

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

你的容器运行时必须至少支持 v1alpha2 版本的容器运行时接口。

Kubernetes [从 1.26 版本开始](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)**仅适用于**
v1 版本的容器运行时（CRI）API。早期版本默认为 v1 版本，
但是如果容器运行时不支持 v1 版本的 API，
则 kubelet 会回退到使用（已弃用的）v1alpha2 版本的 API。

<!-- 
## Container runtimes
-->
## 容器运行时

{{% thirdparty-content %}}

### containerd

<!--
This section outlines the necessary steps to use containerd as CRI runtime.
-->
本节概述了使用 containerd 作为 CRI 运行时的必要步骤。

<!-- 
To install containerd on your system, follow the instructions on
[getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
Return to this step once you've created a valid `config.toml` configuration file.
-->
要在系统上安装 containerd，请按照[开始使用 containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)
的说明进行操作。创建有效的 `config.toml` 配置文件后返回此步骤。

{{< tabs name="finding-your-config-toml-file" >}}
{{% tab name="Linux" %}}
<!--
You can find this file under the path `/etc/containerd/config.toml`.
-->
你可以在路径 `/etc/containerd/config.toml` 下找到此文件。
{{% /tab %}}
{{% tab name="Windows" %}}
<!--
You can find this file under the path `C:\Program Files\containerd\config.toml`.
-->
你可以在路径 `C:\Program Files\containerd\config.toml` 下找到此文件。
{{% /tab %}}
{{< /tabs >}}

<!-- 
On Linux the default CRI socket for containerd is `/run/containerd/containerd.sock`.
On Windows the default CRI endpoint is `npipe://./pipe/containerd-containerd`.
-->
在 Linux 上，containerd 的默认 CRI 套接字是 `/run/containerd/containerd.sock`。
在 Windows 上，默认 CRI 端点是 `npipe://./pipe/containerd-containerd`。

<!--
#### Configuring the `systemd` cgroup driver {#containerd-systemd}

To use the `systemd` cgroup driver in `/etc/containerd/config.toml` with `runc`, set
-->
#### 配置 `systemd` cgroup 驱动 {#containerd-systemd}

结合 `runc` 使用 `systemd` cgroup 驱动，在 `/etc/containerd/config.toml` 中设置：

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

<!--
The `systemd` cgroup driver is recommended if you use [cgroup v2](/docs/concepts/architecture/cgroups).
-->
如果你使用 [cgroup v2](/zh-cn/docs/concepts/architecture/cgroups)，则推荐 `systemd` cgroup 驱动。

{{< note >}}
<!--
If you installed containerd from a package (for example, RPM or `.deb`), you may find
that the CRI integration plugin is disabled by default.

You need CRI support enabled to use containerd with Kubernetes. Make sure that `cri`
is not included in the`disabled_plugins` list within `/etc/containerd/config.toml`;
if you made changes to that file, also restart `containerd`.
-->
如果你从软件包（例如，RPM 或者 `.deb`）中安装 containerd，你可能会发现其中默认禁止了
CRI 集成插件。

你需要启用 CRI 支持才能在 Kubernetes 集群中使用 containerd。
要确保 `cri` 没有出现在 `/etc/containerd/config.toml` 文件中 `disabled_plugins`
列表内。如果你更改了这个文件，也请记得要重启 `containerd`。

<!--
If you experience container crash loops after the initial cluster installation or after
installing a CNI, the containerd configuration provided with the package might contain
incompatible configuration parameters. Consider resetting the containerd configuration
with `containerd config default > /etc/containerd/config.toml` as specified in
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
and then set the configuration parameters specified above accordingly.
-->
如果你在初次安装集群后或安装 CNI 后遇到容器崩溃循环，则随软件包提供的 containerd
配置可能包含不兼容的配置参数。考虑按照
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
中指定的 `containerd config default > /etc/containerd/config.toml` 重置 containerd
配置，然后相应地设置上述配置参数。
{{< /note >}}

<!--
If you apply this change, make sure to restart containerd:
-->
如果你应用此更改，请确保重新启动 containerd：

```shell
sudo systemctl restart containerd
```

<!--
When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).
-->
当使用 kubeadm 时，请手动配置
[kubelet 的 cgroup 驱动](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver)。

<!--
In Kubernetes v1.28, you can enable automatic detection of the
cgroup driver as an alpha feature. See [systemd cgroup driver](#systemd-cgroup-driver)
for more details.
-->
在 Kubernetes v1.28 中，你可以启用 Cgroup 驱动程序的自动检测的 Alpha 级别特性。
详情参阅 [systemd cgroup 驱动](#systemd-cgroup-driver)。

<!--
#### Overriding the sandbox (pause) image {#override-pause-image-containerd}

In your [containerd config](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) you can overwrite the
sandbox image by setting the following config:
-->
#### 重载沙箱（pause）镜像    {#override-pause-image-containerd}

在你的 [containerd 配置](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)中，
你可以通过设置以下选项重载沙箱镜像：

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.2"
```

<!--
You might need to restart `containerd` as well once you've updated the config file: `systemctl restart containerd`.
-->
一旦你更新了这个配置文件，可能就同样需要重启 `containerd`：`systemctl restart containerd`。

### CRI-O

<!--
This section contains the necessary steps to install CRI-O as a container runtime.

To install CRI-O, follow [CRI-O Install Instructions](https://github.com/cri-o/packaging/blob/main/README.md#usage).
-->
本节包含安装 CRI-O 作为容器运行时的必要步骤。

要安装 CRI-O，请按照 [CRI-O 安装说明](https://github.com/cri-o/packaging/blob/main/README.md#usage)执行操作。

<!--
#### cgroup driver

CRI-O uses the systemd cgroup driver per default, which is likely to work fine
for you. To switch to the `cgroupfs` cgroup driver, either edit
`/etc/crio/crio.conf` or place a drop-in configuration in
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`, for example: 
-->
#### cgroup 驱动   {#cgroup-driver}

CRI-O 默认使用 systemd cgroup 驱动，这对你来说可能工作得很好。
要切换到 `cgroupfs` cgroup 驱动，请编辑 `/etc/crio/crio.conf` 或在
`/etc/crio/crio.conf.d/02-cgroup-manager.conf` 中放置一个插入式配置，例如：

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
你还应该注意当使用 CRI-O 时，并且 CRI-O 的 cgroup 设置为 `cgroupfs` 时，必须将 `conmon_cgroup` 设置为值 `pod`。
通常需要保持 kubelet 的 cgroup 驱动配置（通常通过 kubeadm 完成）和 CRI-O 同步。

<!--
In Kubernetes v1.28, you can enable automatic detection of the
cgroup driver as an alpha feature. See [systemd cgroup driver](#systemd-cgroup-driver)
for more details.
-->
在 Kubernetes v1.28 中，你可以启用 Cgroup 驱动程序的自动检测的 Alpha 级别特性。
详情参阅 [systemd cgroup 驱动](#systemd-cgroup-driver)。

<!-- 
For CRI-O, the CRI socket is `/var/run/crio/crio.sock` by default.
-->
对于 CRI-O，CRI 套接字默认为 `/var/run/crio/crio.sock`。

<!--
#### Overriding the sandbox (pause) image {#override-pause-image-cri-o}

In your [CRI-O config](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) you can set the following
config value:
-->
#### 重载沙箱（pause）镜像   {#override-pause-image-cri-o}

在你的 [CRI-O 配置](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md)中，
你可以设置以下配置值：

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.6"
```

<!--
This config option supports live configuration reload to apply this change: `systemctl reload crio` or by sending
`SIGHUP` to the `crio` process.
-->
这一设置选项支持动态配置重加载来应用所做变更：`systemctl reload crio`。
也可以通过向 `crio` 进程发送 `SIGHUP` 信号来实现。

### Docker Engine {#docker}

{{< note >}}
<!-- 
These instructions assume that you are using the
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) adapter to integrate
Docker Engine with Kubernetes.
-->
以下操作假设你使用 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) 适配器来将
Docker Engine 与 Kubernetes 集成。
{{< /note >}}

<!--
1. On each of your nodes, install Docker for your Linux distribution as per
  [Install Docker Engine](https://docs.docker.com/engine/install/#server).
-->
1. 在你的每个节点上，遵循[安装 Docker Engine](https://docs.docker.com/engine/install/#server)
   指南为你的 Linux 发行版安装 Docker。

<!-- 
2. Install [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install), following the directions in the install section of the documentation.
-->
2. 请按照文档中的安装部分指示来安装 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install)。

<!--
For `cri-dockerd`, the CRI socket is `/run/cri-dockerd.sock` by default.
-->
对于 `cri-dockerd`，默认情况下，CRI 套接字是 `/run/cri-dockerd.sock`。

<!-- 
### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR) is a commercially
available container runtime that was formerly known as Docker Enterprise Edition.

You can use Mirantis Container Runtime with Kubernetes using the open source
[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) component, included with MCR.
-->
### Mirantis 容器运行时 {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR)
是一种商用容器运行时，以前称为 Docker 企业版。
你可以使用 MCR 中包含的开源 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/)
组件将 Mirantis Container Runtime 与 Kubernetes 一起使用。

<!--
To learn more about how to install Mirantis Container Runtime,
visit [MCR Deployment Guide](https://docs.mirantis.com/mcr/20.10/install.html). 
-->
要了解有关如何安装 Mirantis Container Runtime 的更多信息，
请访问 [MCR 部署指南](https://docs.mirantis.com/mcr/20.10/install.html)。

<!-- 
Check the systemd unit named `cri-docker.socket` to find out the path to the CRI
socket.
-->
检查名为 `cri-docker.socket` 的 systemd 单元以找出 CRI 套接字的路径。

<!--
#### Overriding the sandbox (pause) image {#override-pause-image-cri-dockerd-mcr}

The `cri-dockerd` adapter accepts a command line argument for
specifying which container image to use as the Pod infrastructure container (“pause image”).
The command line argument to use is `--pod-infra-container-image`.
-->
#### 重载沙箱（pause）镜像   {#override-pause-image-cri-dockerd-mcr}

`cri-dockerd` 适配器能够接受指定用作 Pod 的基础容器的容器镜像（“pause 镜像”）作为命令行参数。
要使用的命令行参数是 `--pod-infra-container-image`。

## {{% heading "whatsnext" %}}

<!-- 
As well as a container runtime, your cluster will need a working
[network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).
-->
除了容器运行时，你的集群还需要有效的[网络插件](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)。
