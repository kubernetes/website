---
title: 關於 cgroup v2
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
在 Linux 上，{{< glossary_tooltip text="控制組" term_id="cgroup" >}}約束分配給進程的資源。

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 和底層容器運行時都需要對接 cgroup
來強制執行[爲 Pod 和容器管理資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)，
這包括爲容器化工作負載設定 CPU/內存請求和限制。

Linux 中有兩個 cgroup 版本：cgroup v1 和 cgroup v2。cgroup v2 是新一代的 `cgroup` API。

<!-- body -->

<!--
## What is cgroup v2? {#cgroup-v2}
-->
## 什麼是 cgroup v2？  {#cgroup-v2}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
cgroup v2 is the next version of the Linux `cgroup` API. cgroup v2 provides a
unified control system with enhanced resource management
capabilities.
-->
cgroup v2 是 Linux `cgroup` API 的下一個版本。cgroup v2 提供了一個具有增強資源管理能力的統一控制系統。

<!--
cgroup v2 offers several improvements over cgroup v1, such as the following:

- Single unified hierarchy design in API
- Safer sub-tree delegation to containers
- Newer features like [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Enhanced resource allocation management and isolation across multiple resources
  - Unified accounting for different types of memory allocations (network memory, kernel memory, etc)
  - Accounting for non-immediate resource changes such as page cache write backs
-->
cgroup v2 對 cgroup v1 進行了多項改進，例如：

- API 中單個統一的層次結構設計
- 更安全的子樹委派給容器
- 更新的功能特性，
  例如[壓力阻塞信息（Pressure Stall Information，PSI）](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- 跨多個資源的增強資源分配管理和隔離
  - 統一覈算不同類型的內存分配（網路內存、內核內存等）
  - 考慮非即時資源變化，例如頁面緩存回寫

<!--
Some Kubernetes features exclusively use cgroup v2 for enhanced resource
management and isolation. For example, the
[MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) feature improves memory QoS
and relies on cgroup v2 primitives.
-->
一些 Kubernetes 特性專門使用 cgroup v2 來增強資源管理和隔離。
例如，[MemoryQoS](/zh-cn/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) 特性改進了內存 QoS 並依賴於 cgroup v2 原語。

<!--
## Using cgroup v2 {#using-cgroupv2}

The recommended way to use cgroup v2 is to use a Linux distribution that
enables and uses cgroup v2 by default.

To check if your distribution uses cgroup v2, refer to [Identify cgroup version on Linux nodes](#check-cgroup-version).
-->
## 使用 cgroup v2  {#using-cgroupv2}

使用 cgroup v2 的推薦方法是使用一個默認啓用 cgroup v2 的 Linux 發行版。

要檢查你的發行版是否使用 cgroup v2，請參閱[識別 Linux 節點上的 cgroup 版本](#check-cgroup-version)。

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

* 操作系統發行版啓用 cgroup v2
* Linux 內核爲 5.8 或更高版本
* 容器運行時支持 cgroup v2。例如：
  * [containerd](https://containerd.io/) v1.4 和更高版本
  * [cri-o](https://cri-o.io/) v1.20 和更高版本
* kubelet 和容器運行時被設定爲使用
  [systemd cgroup 驅動](/zh-cn/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

<!--
### Linux Distribution cgroup v2 support

For a list of Linux distributions that use cgroup v2, refer to the [cgroup v2 documentation](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)
-->
### Linux 發行版 cgroup v2 支持  {#linux-distribution-cgroup-v2-support}

有關使用 cgroup v2 的 Linux 發行版的列表，
請參閱 [cgroup v2 文檔](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)。

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
<!--
* Container Optimized OS (since M97)
* Ubuntu (since 21.10, 22.04+ recommended)
* Debian GNU/Linux (since Debian 11 bullseye)
* Fedora (since 31)
* Arch Linux (since April 2021)
* RHEL and RHEL-like distributions (since 9)
-->
* Container-Optimized OS（從 M97 開始）
* Ubuntu（從 21.10 開始，推薦 22.04+）
* Debian GNU/Linux（從 Debian 11 Bullseye 開始）
* Fedora（從 31 開始）
* Arch Linux（從 2021 年 4 月開始）
* RHEL 和類似 RHEL 的發行版（從 9 開始）

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
要檢查你的發行版是否使用 cgroup v2，
請參閱你的發行版文檔或遵循[識別 Linux 節點上的 cgroup 版本](#check-cgroup-version)中的指示說明。

你還可以通過修改內核 cmdline 引導參數在你的 Linux 發行版上手動啓用 cgroup v2。
如果你的發行版使用 GRUB，則應在 `/etc/default/grub` 下的 `GRUB_CMDLINE_LINUX`
中添加 `systemd.unified_cgroup_hierarchy=1`，
然後執行 `sudo update-grub`。不過，推薦的方法仍是使用一個默認已啓用 cgroup v2 的發行版。

<!--
### Migrating to cgroup v2 {#migrating-cgroupv2}

To migrate to cgroup v2, ensure that you meet the [requirements](#requirements), then upgrade
to a kernel version that enables cgroup v2 by default.

The kubelet automatically detects that the OS is running on cgroup v2 and
performs accordingly with no additional configuration required.
-->
### 遷移到 cgroup v2   {#migrating-cgroupv2}

要遷移到 cgroup v2，需確保滿足[要求](#requirements)，然後升級到一個默認啓用 cgroup v2 的內核版本。

kubelet 能夠自動檢測操作系統是否運行在 cgroup v2 上並相應調整其操作，無需額外設定。

<!--
There should not be any noticeable difference in the user experience when
switching to cgroup v2, unless users are accessing the cgroup file system
directly, either on the node or from within the containers.

cgroup v2 uses a different API than cgroup v1, so if there are any
applications that directly access the cgroup file system, they need to be
updated to newer versions that support cgroup v2. For example:
-->
切換到 cgroup v2 時，使用者體驗應沒有任何明顯差異，除非使用者直接在節點上或從容器內訪問 cgroup 文件系統。

cgroup v2 使用一個與 cgroup v1 不同的 API，因此如果有任何應用直接訪問 cgroup 文件系統，
則需要將這些應用更新爲支持 cgroup v2 的版本。例如：

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
* 一些第三方監控和安全代理可能依賴於 cgroup 文件系統。你要將這些代理更新到支持 cgroup v2 的版本。
* 如果以獨立的 DaemonSet 的形式運行 [cAdvisor](https://github.com/google/cadvisor) 以監控 Pod 和容器，
  需將其更新到 v0.43.0 或更高版本。
* 如果你部署 Java 應用程序，最好使用完全支持 cgroup v2 的版本：
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372、11.0.16、15 及更高的版本
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0、11.0.20.0、17.0.8.0 及更高的版本
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 及更高的版本
* 如果你正在使用 [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) 包，
  確保你使用的版本是 v1.5.1 或者更高。

<!--
## Identify the cgroup version on Linux Nodes  {#check-cgroup-version}

The cgroup version depends on the Linux distribution being used and the
default cgroup version configured on the OS. To check which cgroup version your
distribution uses, run the `stat -fc %T /sys/fs/cgroup/` command on
the node:
-->
## 識別 Linux 節點上的 cgroup 版本 {#check-cgroup-version}

cgroup 版本取決於正在使用的 Linux 發行版和操作系統上設定的默認 cgroup 版本。
要檢查你的發行版使用的是哪個 cgroup 版本，請在該節點上運行 `stat -fc %T /sys/fs/cgroup/` 命令：

```shell
stat -fc %T /sys/fs/cgroup/
```

<!--
For cgroup v2, the output is `cgroup2fs`.

For cgroup v1, the output is `tmpfs.`
-->
對於 cgroup v2，輸出爲 `cgroup2fs`。

對於 cgroup v1，輸出爲 `tmpfs`。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Learn more about [container runtime](/docs/concepts/architecture/cri)
- Learn more about [cgroup drivers](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
-->
- 進一步瞭解 [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- 進一步瞭解[容器運行時](/zh-cn/docs/concepts/architecture/cri)
- 進一步瞭解 [cgroup 驅動](/zh-cn/docs/setup/production-environment/container-runtimes#cgroup-drivers)

