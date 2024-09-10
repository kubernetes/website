---
title: 关于 cgroup v2
content_type: concept
weight: 50
---
<!--
title: About cgroup v2
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
On Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
constrain resources that are allocated to processes.

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and the
underlying container runtime need to interface with cgroups to enforce
[resource management for pods and containers](/docs/concepts/configuration/manage-resources-containers/) which
includes cpu/memory requests and limits for containerized workloads.

There are two versions of cgroups in Linux: cgroup v1 and cgroup v2. cgroup v2 is
the new generation of the `cgroup` API.
-->
在 Linux 上，{{< glossary_tooltip text="控制组" term_id="cgroup" >}}约束分配给进程的资源。

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 和底层容器运行时都需要对接 cgroup
来强制执行[为 Pod 和容器管理资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)，
这包括为容器化工作负载配置 CPU/内存请求和限制。

Linux 中有两个 cgroup 版本：cgroup v1 和 cgroup v2。cgroup v2 是新一代的 `cgroup` API。

<!-- body -->

<!--
## What is cgroup v2? {#cgroup-v2}
-->
## 什么是 cgroup v2？  {#cgroup-v2}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
cgroup v2 is the next version of the Linux `cgroup` API. cgroup v2 provides a
unified control system with enhanced resource management
capabilities.
-->
cgroup v2 是 Linux `cgroup` API 的下一个版本。cgroup v2 提供了一个具有增强资源管理能力的统一控制系统。

<!--
cgroup v2 offers several improvements over cgroup v1, such as the following:

- Single unified hierarchy design in API
- Safer sub-tree delegation to containers
- Newer features like [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Enhanced resource allocation management and isolation across multiple resources
  - Unified accounting for different types of memory allocations (network memory, kernel memory, etc)
  - Accounting for non-immediate resource changes such as page cache write backs
-->
cgroup v2 对 cgroup v1 进行了多项改进，例如：

- API 中单个统一的层次结构设计
- 更安全的子树委派给容器
- 更新的功能特性，
  例如[压力阻塞信息（Pressure Stall Information，PSI）](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- 跨多个资源的增强资源分配管理和隔离
  - 统一核算不同类型的内存分配（网络内存、内核内存等）
  - 考虑非即时资源变化，例如页面缓存回写

<!--
Some Kubernetes features exclusively use cgroup v2 for enhanced resource
management and isolation. For example, the
[MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) feature improves memory QoS
and relies on cgroup v2 primitives.
-->
一些 Kubernetes 特性专门使用 cgroup v2 来增强资源管理和隔离。
例如，[MemoryQoS](/zh-cn/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) 特性改进了内存 QoS 并依赖于 cgroup v2 原语。

<!--
## Using cgroup v2 {#using-cgroupv2}

The recommended way to use cgroup v2 is to use a Linux distribution that
enables and uses cgroup v2 by default.

To check if your distribution uses cgroup v2, refer to [Identify cgroup version on Linux nodes](#check-cgroup-version).
-->
## 使用 cgroup v2  {#using-cgroupv2}

使用 cgroup v2 的推荐方法是使用一个默认启用 cgroup v2 的 Linux 发行版。

要检查你的发行版是否使用 cgroup v2，请参阅[识别 Linux 节点上的 cgroup 版本](#check-cgroup-version)。

<!--
### Requirements

cgroup v2 has the following requirements:

* OS distribution enables cgroup v2
* Linux Kernel version is 5.8 or later
* Container runtime supports cgroup v2. For example:
  * [containerd](https://containerd.io/) v1.4 and later
  * [cri-o](https://cri-o.io/) v1.20 and later
* The kubelet and the container runtime are configured to use the [systemd cgroup driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)
-->
### 要求  {#requirements}

cgroup v2 具有以下要求：

* 操作系统发行版启用 cgroup v2
* Linux 内核为 5.8 或更高版本
* 容器运行时支持 cgroup v2。例如：
  * [containerd](https://containerd.io/) v1.4 和更高版本
  * [cri-o](https://cri-o.io/) v1.20 和更高版本
* kubelet 和容器运行时被配置为使用
  [systemd cgroup 驱动](/zh-cn/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

<!--
### Linux Distribution cgroup v2 support

For a list of Linux distributions that use cgroup v2, refer to the [cgroup v2 documentation](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)
-->
### Linux 发行版 cgroup v2 支持  {#linux-distribution-cgroup-v2-support}

有关使用 cgroup v2 的 Linux 发行版的列表，
请参阅 [cgroup v2 文档](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)。

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
<!--
* Container Optimized OS (since M97)
* Ubuntu (since 21.10, 22.04+ recommended)
* Debian GNU/Linux (since Debian 11 bullseye)
* Fedora (since 31)
* Arch Linux (since April 2021)
* RHEL and RHEL-like distributions (since 9)
-->
* Container-Optimized OS（从 M97 开始）
* Ubuntu（从 21.10 开始，推荐 22.04+）
* Debian GNU/Linux（从 Debian 11 Bullseye 开始）
* Fedora（从 31 开始）
* Arch Linux（从 2021 年 4 月开始）
* RHEL 和类似 RHEL 的发行版（从 9 开始）

<!--
To check if your distribution is using cgroup v2, refer to your distribution's
documentation or follow the instructions in [Identify the cgroup version on Linux nodes](#check-cgroup-version).

You can also enable cgroup v2 manually on your Linux distribution by modifying
the kernel cmdline boot arguments. If your distribution uses GRUB,
`systemd.unified_cgroup_hierarchy=1` should be added in `GRUB_CMDLINE_LINUX`
under `/etc/default/grub`, followed by `sudo update-grub`.  However, the
recommended approach is to use a distribution that already enables cgroup v2 by
default.
-->
要检查你的发行版是否使用 cgroup v2，
请参阅你的发行版文档或遵循[识别 Linux 节点上的 cgroup 版本](#check-cgroup-version)中的指示说明。

你还可以通过修改内核 cmdline 引导参数在你的 Linux 发行版上手动启用 cgroup v2。
如果你的发行版使用 GRUB，则应在 `/etc/default/grub` 下的 `GRUB_CMDLINE_LINUX`
中添加 `systemd.unified_cgroup_hierarchy=1`，
然后执行 `sudo update-grub`。不过，推荐的方法仍是使用一个默认已启用 cgroup v2 的发行版。

<!--
### Migrating to cgroup v2 {#migrating-cgroupv2}

To migrate to cgroup v2, ensure that you meet the [requirements](#requirements), then upgrade
to a kernel version that enables cgroup v2 by default.

The kubelet automatically detects that the OS is running on cgroup v2 and
performs accordingly with no additional configuration required.
-->
### 迁移到 cgroup v2   {#migrating-cgroupv2}

要迁移到 cgroup v2，需确保满足[要求](#requirements)，然后升级到一个默认启用 cgroup v2 的内核版本。

kubelet 能够自动检测操作系统是否运行在 cgroup v2 上并相应调整其操作，无需额外配置。

<!--
There should not be any noticeable difference in the user experience when
switching to cgroup v2, unless users are accessing the cgroup file system
directly, either on the node or from within the containers.

cgroup v2 uses a different API than cgroup v1, so if there are any
applications that directly access the cgroup file system, they need to be
updated to newer versions that support cgroup v2. For example:
-->
切换到 cgroup v2 时，用户体验应没有任何明显差异，除非用户直接在节点上或从容器内访问 cgroup 文件系统。

cgroup v2 使用一个与 cgroup v1 不同的 API，因此如果有任何应用直接访问 cgroup 文件系统，
则需要将这些应用更新为支持 cgroup v2 的版本。例如：

<!--
* Some third-party monitoring and security agents may depend on the cgroup filesystem.
 Update these agents to versions that support cgroup v2.
* If you run [cAdvisor](https://github.com/google/cadvisor) as a stand-alone
 DaemonSet for monitoring pods and containers, update it to v0.43.0 or later.
 * If you deploy Java applications, prefer to use versions which fully support cgroup v2:
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 and later
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0, and later
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 and later
* If you are using the [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) package, make sure
  the version you use is v1.5.1 or higher.
-->
* 一些第三方监控和安全代理可能依赖于 cgroup 文件系统。你要将这些代理更新到支持 cgroup v2 的版本。
* 如果以独立的 DaemonSet 的形式运行 [cAdvisor](https://github.com/google/cadvisor) 以监控 Pod 和容器，
  需将其更新到 v0.43.0 或更高版本。
* 如果你部署 Java 应用程序，最好使用完全支持 cgroup v2 的版本：
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372、11.0.16、15 及更高的版本
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0、11.0.20.0、17.0.8.0 及更高的版本
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 及更高的版本
* 如果你正在使用 [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) 包，
  确保你使用的版本是 v1.5.1 或者更高。

<!--
## Identify the cgroup version on Linux Nodes  {#check-cgroup-version}

The cgroup version depends on the Linux distribution being used and the
default cgroup version configured on the OS. To check which cgroup version your
distribution uses, run the `stat -fc %T /sys/fs/cgroup/` command on
the node:
-->
## 识别 Linux 节点上的 cgroup 版本 {#check-cgroup-version}

cgroup 版本取决于正在使用的 Linux 发行版和操作系统上配置的默认 cgroup 版本。
要检查你的发行版使用的是哪个 cgroup 版本，请在该节点上运行 `stat -fc %T /sys/fs/cgroup/` 命令：

```shell
stat -fc %T /sys/fs/cgroup/
```

<!--
For cgroup v2, the output is `cgroup2fs`.

For cgroup v1, the output is `tmpfs.`
-->
对于 cgroup v2，输出为 `cgroup2fs`。

对于 cgroup v1，输出为 `tmpfs`。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Learn more about [container runtime](/docs/concepts/architecture/cri)
- Learn more about [cgroup drivers](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
-->
- 进一步了解 [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- 进一步了解[容器运行时](/zh-cn/docs/concepts/architecture/cri)
- 进一步了解 [cgroup 驱动](/zh-cn/docs/setup/production-environment/container-runtimes#cgroup-drivers)

