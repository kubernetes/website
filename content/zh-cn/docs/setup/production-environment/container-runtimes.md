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
v1.24 之前的 Kubernetes 版本包括与 Docker Engine 的直接集成，使用名为 **dockershim** 的组件。 
这种特殊的直接整合不再是 Kubernetes 的一部分
（这次删除被作为 v1.20 发行版本的一部分[宣布](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)）。

<!--
You can read
[Check whether Dockershim deprecation affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/)
to understand how this removal might
affect you. To learn about migrating from using dockershim, see
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).
-->
你可以阅读[检查 Dockershim 弃用是否会影响你](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/) 
以了解此删除可能会如何影响你。 
要了解如何使用 dockershim 进行迁移，
请参阅[从 dockershim 迁移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)。

<!--
If you are running a version of Kubernetes other than v{{< skew currentVersion >}},
check the documentation for that version.
-->
如果你正在运行 v{{< skew currentVersion >}} 以外的 Kubernetes 版本，检查该版本的文档。
{{< /note >}}

<!-- body -->

<!-- 
## Install and configure prerequisites

The following steps apply common settings for Kubernetes nodes on Linux. 

You can skip a particular setting if you're certain you don't need it.

For more information, see [Network Plugin Requirements](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements) or the documentation for your specific container runtime.
-->
## 安装和配置先决条件  {#install-and-configure-prerequisites}

以下步骤将通用设置应用于 Linux 上的 Kubernetes 节点。

如果你确定不需要某个特定设置，则可以跳过它。

有关更多信息，请参阅[网络插件要求](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements) 
或特定容器运行时的文档。

<!-- 
### Forwarding IPv4 and letting iptables see bridged traffic

Verify that the `br_netfilter` module is loaded by running `lsmod | grep br_netfilter`. 

To load it explicitly, run `sudo modprobe br_netfilter`.

In order for a Linux node's iptables to correctly view bridged traffic, verify that `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config. For example: 
-->
### 转发 IPv4 并让 iptables 看到桥接流量

通过运行 `lsmod | grep br_netfilter` 来验证 `br_netfilter` 模块是否已加载。

若要显式加载此模块，请运行 `sudo modprobe br_netfilter`。

为了让 Linux 节点的 iptables 能够正确查看桥接流量，请确认 `sysctl` 配置中的
`net.bridge.bridge-nf-call-iptables` 设置为 1。例如：

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 设置所需的 sysctl 参数，参数在重新启动后保持不变
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 应用 sysctl 参数而不重新启动
sudo sysctl --system
```

<!--
## Cgroup drivers

On Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
are used to constrain resources that are allocated to processes.
-->
## Cgroup 驱动程序  {#cgroup-drivers}

在 Linux 上，{{<glossary_tooltip text="控制组（CGroup）" term_id="cgroup" >}}
用于限制分配给进程的资源。

<!--
When [systemd](https://www.freedesktop.org/wiki/Software/systemd/) is chosen as the init
system for a Linux distribution, the init process generates and consumes a root control group
(`cgroup`) and acts as a cgroup manager.
Systemd has a tight integration with cgroups and allocates a cgroup per systemd unit. It's possible
to configure your container runtime and the kubelet to use `cgroupfs`. Using `cgroupfs` alongside
systemd means that there will be two different cgroup managers.
-->
当某个 Linux 系统发行版使用 [systemd](https://www.freedesktop.org/wiki/Software/systemd/)
作为其初始化系统时，初始化进程会生成并使用一个 root 控制组（`cgroup`），并充当 cgroup 管理器。
Systemd 与 cgroup 集成紧密，并将为每个 systemd 单元分配一个 cgroup。
你也可以配置容器运行时和 kubelet 使用 `cgroupfs`。
连同 systemd 一起使用 `cgroupfs` 意味着将有两个不同的 cgroup 管理器。

<!--
A single cgroup manager simplifies the view of what resources are being allocated
and will by default have a more consistent view of the available and in-use resources.
When there are two cgroup managers on a system, you end up with two views of those resources.
In the field, people have reported cases where nodes that are configured to use `cgroupfs`
for the kubelet and Docker, but `systemd` for the rest of the processes, become unstable under
resource pressure.
-->
单个 cgroup 管理器将简化分配资源的视图，并且默认情况下将对可用资源和使用
中的资源具有更一致的视图。
当有两个管理器共存于一个系统中时，最终将对这些资源产生两种视图。
在此领域人们已经报告过一些案例，某些节点配置让 kubelet 和 docker 使用
`cgroupfs`，而节点上运行的其余进程则使用 systemd; 这类节点在资源压力下
会变得不稳定。

<!--
Changing the settings such that your container runtime and kubelet use `systemd` as the cgroup driver
stabilized the system. To configure this for Docker, set `native.cgroupdriver=systemd`.
-->
更改设置，令容器运行时和 kubelet 使用 `systemd` 作为 cgroup 驱动，以此使系统更为稳定。
对于 Docker，要设置 `native.cgroupdriver=systemd` 选项。

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
如果 kubelet 已经使用某 cgroup 驱动的语义创建了 pod，更改运行时以使用
别的 cgroup 驱动，当为现有 Pods 重新创建 PodSandbox 时会产生错误。
重启 kubelet 也可能无法解决此类问题。

如果你有切实可行的自动化方案，使用其他已更新配置的节点来替换该节点，
或者使用自动化方案来重新安装。
{{< /caution >}}

<!--
### Cgroup version 2 {#cgroup-v2}

Cgroup v2 is the next version of the cgroup Linux API.  Differently than cgroup v1, there is a single
hierarchy instead of a different one for each controller.
-->
### Cgroup v2 {#cgroup-v2}

Cgroup v2 是 cgroup Linux API 的下一个版本。与 cgroup v1 不同的是，
Cgroup v2 只有一个层次结构，而不是每个控制器有一个不同的层次结构。

<!--
The new version offers several improvements over cgroup v1, some of these improvements are:

- cleaner and easier to use API
- safe sub-tree delegation to containers
- newer features like Pressure Stall Information
-->
新版本对 cgroup v1 进行了多项改进，其中一些改进是：

- 更简洁、更易于使用的 API
- 可将安全子树委派给容器
- 更新的功能，如压力失速信息（Pressure Stall Information）

<!--
Even if the kernel supports a hybrid configuration where some controllers are managed by cgroup v1
and some others by cgroup v2, Kubernetes supports only the same cgroup version to manage all the
controllers.

If systemd doesn't use cgroup v2 by default, you can configure the system to use it by adding
`systemd.unified_cgroup_hierarchy=1` to the kernel command line.
-->
尽管内核支持混合配置，即其中一些控制器由 cgroup v1 管理，另一些由 cgroup v2 管理，
Kubernetes 仅支持使用同一 cgroup 版本来管理所有控制器。

如果 systemd 默认不使用 cgroup v2，你可以通过在内核命令行中添加 
`systemd.unified_cgroup_hierarchy=1` 来配置系统去使用它。

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
# 此示例适用于使用 DNF 包管理器的 Linux 操作系统
# 你的系统可能使用不同的方法来设置 Linux 内核使用的命令行。
sudo dnf install -y grubby && \
  sudo grubby \
  --update-kernel=ALL \
  --args="systemd.unified_cgroup_hierarchy=1"
```

<!--
If you change the command line for the kernel, you must reboot the node before your
change takes effect.

There should not be any noticeable difference in the user experience when switching to cgroup v2, unless
users are accessing the cgroup file system directly, either on the node or from within the containers.

In order to use it, cgroup v2 must be supported by the CRI runtime as well.
-->
如果更改内核的命令行，则必须重新启动节点才能使更改生效。

切换到 cgroup v2 时，用户体验不应有任何明显差异，
除非用户直接在节点上或在容器内访问 cgroup 文件系统。
为了使用它，CRI 运行时也必须支持 cgroup v2。

<!-- 
### Migrating to the `systemd` driver in kubeadm managed clusters

If you wish to migrate to the `systemd` cgroup driver in existing kubeadm managed clusters,
follow [configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
-->
### 将 kubeadm 托管的集群迁移到 `systemd` 驱动

如果你希望将现有的由 kubeadm 管理的集群迁移到 `systemd` cgroup 驱动程序，
请按照[配置 cgroup 驱动程序](/zh-cn/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)操作。

<!--
## CRI version support {#cri-versions}

Your container runtime must support at least v1alpha2 of the container runtime interface.

Kubernetes {{< skew currentVersion >}}  defaults to using v1 of the CRI API.
If a container runtime does not support the v1 API, the kubelet falls back to
using the (deprecated) v1alpha2 API instead.
-->
## CRI 版本支持 {#cri-versions}

你的容器运行时必须至少支持容器运行时接口的 v1alpha2。

Kubernetes {{< skew currentVersion >}} 默认使用 v1 的 CRI API。如果容器运行时不支持 v1 API，
则 kubelet 会回退到使用（已弃用的）v1alpha2 API。

<!-- 
## Container runtimes
 -->
## 容器运行时

{{% thirdparty-content %}}

### containerd

<!--
This section outlines the necessary steps to use containerd as CRI runtime.

Use the following commands to install Containerd on your system:
-->
本节概述了使用 containerd 作为 CRI 运行时的必要步骤。

使用以下命令在系统上安装 Containerd：

<!-- 
Follow the instructions for [getting started with containerd](https://github.com/containerd/containerd/blob/main/docs getting-started.md). Return to this step once you've created a valid configuration file, `config.toml`. 
 -->

按照[开始使用 containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) 的说明进行操作。 
创建有效的配置文件 `config.toml` 后返回此步骤。

{{< tabs name="找到 config.toml 文件" >}}
{{% tab name="Linux" %}}
<!-- You can find this file under the path `/etc/containerd/config.toml`. -->
你可以在路径 `/etc/containerd/config.toml` 下找到此文件。
{{% /tab %}}
{{< tab name="Windows" >}}
<!-- You can find this file under the path `C:\Program Files\containerd\config.toml`. -->
你可以在路径 `C:\Program Files\containerd\config.toml` 下找到此文件。
{{< /tab >}}
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
#### 配置 `systemd` cgroup 驱动程序 {#containerd-systemd}

结合 `runc` 使用 `systemd` cgroup 驱动，在 `/etc/containerd/config.toml` 中设置 

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

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
#### Overriding the sandbox (pause) image {#override-pause-image-containerd}

In your [containerd config](https://github.com/containerd/cri/blob/master/docs/config.md) you can overwrite the
sandbox image by setting the following config:
-->
#### 重载沙箱（pause）镜像    {#override-pause-image-containerd}

在你的 [containerd 配置](https://github.com/containerd/cri/blob/master/docs/config.md)中，
你可以通过设置以下选项重载沙箱镜像：

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "k8s.gcr.io/pause:3.2"
```

<!--
You might need to restart `containerd` as well once you've updated the config file: `systemctl restart containerd`.
-->
一旦你更新了这个配置文件，可能就同样需要重启 `containerd`：`systemctl restart containerd`。

### CRI-O

<!--
This section contains the necessary steps to install CRI-O as a container runtime.

To install CRI-O, follow [CRI-O Install Instructions](https://github.com/cri-o/cri-o/blob/main/install.md#readme).
-->
本节包含安装 CRI-O 作为容器运行时的必要步骤。

要安装 CRI-O，请按照 [CRI-O 安装说明](https://github.com/cri-o/cri-o/blob/main/install.md#readme)执行操作。

<!--
#### cgroup driver

CRI-O uses the systemd cgroup driver per default, which is likely to work fine
for you. To switch to the `cgroupfs` cgroup driver, either edit
`/etc/crio/crio.conf` or place a drop-in configuration in
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`, for example: 
-->
#### cgroup 驱动程序   {#cgroup-driver}

CRI-O 默认使用 systemd cgroup 驱动程序，这对你来说可能工作得很好。
要切换到 `cgroupfs` cgroup 驱动程序，请编辑 `/etc/crio/crio.conf` 或在
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
你还应该注意到 `conmon_cgroup` 被更改，当使用 CRI-O 和 `cgroupfs` 时，必须将其设置为值 `pod`。
通常需要保持 kubelet 的 cgroup 驱动配置（通常通过 kubeadm 完成）和 CRI-O 同步。

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
[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) adapter to integrate
Docker Engine with Kubernetes.
-->
以下操作假设你使用 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) 适配器来将
Docker Engine 与 Kubernetes 集成。
{{< /note >}} 

<!--
1. On each of your nodes, install Docker for your Linux distribution as per
   [Install Docker Engine](https://docs.docker.com/engine/install/#server). 
-->
1. 在你的每个节点上，遵循[安装 Docker Engine](https://docs.docker.com/engine/install/#server)
   指南为你的 Linux 发行版安装 Docker。

<!-- 
2. Install [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd), following
   the instructions in that source code repository.
-->
2. 按照源代码仓库中的说明安装 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)。

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
你可以使用 MCR 中包含的开源 [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)
组件将 Mirantis Container Runtime 与 Kubernetes 一起使用。

<!--
To learn more about how to install Mirantis Container Runtime,
visit [MCR Deployment Guide](https://docs.mirantis.com/mcr/20.10/install.html). 
-->
要了解有关如何安装 Mirantis Container Runtime 的更多信息，
请访问 [MCR 部署指南](https://docs.mirantis.com/mcr/20.10/install.html)。

<!-- 
Check the systemd unit named `cri-docker.socket` to find out the path to the CRI socket.
-->
检查名为 `cri-docker.socket` 的 systemd 单元以找出 CRI 套接字的路径。

<!--
#### Overriding the sandbox (pause) image {#override-pause-image-cri-dockerd-mcr}

The `cri-dockerd` adapter accepts a command line argument for
specifying which container image to use as the Pod infrastructure container (“pause image”).
The command line argument to use is `--pod-infra-container-image`.
-->
#### 重载沙箱（pause）镜像   {#override-pause-image-cri-dockerd-mcr}

`cri-dockerd` 适配器能够接受一个命令行参数是，设置用哪个容器镜像作为 Pod
的基础设施容器（“pause 镜像”）。
要使用的命令行参数是 `--pod-infra-container-image`。

## {{% heading "whatsnext" %}}

<!-- 
As well as a container runtime, your cluster will need a working
[network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model).
-->
除了容器运行时，你的集群还需要有效的[网络插件](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model)。

