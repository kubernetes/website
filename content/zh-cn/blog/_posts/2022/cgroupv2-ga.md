---
layout: blog
title: "Kubernetes 1.25: cgroup v2 升级到 GA"
date: 2022-08-31
slug: cgroupv2-ga-1-25
---

<!--
layout: blog
title: "Kubernetes 1.25: cgroup v2 graduates to GA"
date: 2022-08-31
slug: cgroupv2-ga-1-25
-->

<!--
**Authors:**: David Porter (Google), Mrunal Patel (Red Hat)
-->
**作者**: David Porter (Google), Mrunal Patel (Red Hat)

<!--
Kubernetes 1.25 brings cgroup v2 to GA (general availability), letting the
[kubelet](/docs/concepts/overview/components/#kubelet) use the latest container resource
management capabilities.
-->
Kubernetes 1.25 将 cgroup v2 正式发布（GA），
让 [kubelet](/zh-cn/docs/concepts/overview/components/#kubelet) 使用最新的容器资源管理能力。

<!--
## What are cgroups?
-->
## 什么是 cgroup？

<!--
Effective [resource management](/docs/concepts/configuration/manage-resources-containers/) is a
critical aspect of Kubernetes. This involves managing the finite resources in
your nodes, such as CPU, memory, and storage.

*cgroups* are a Linux kernel capability that establish resource management
functionality like limiting CPU usage or setting memory limits for running
processes.
-->
有效的[资源管理](/zh-cn/docs/concepts/configuration/manage-resources-containers/)是 Kubernetes 的一个关键方面。
这涉及管理节点中的有限资源，例如 CPU、内存和存储。

**cgroups** 是一种可建立资源管理功能的 Linux 内核能力，
例如为正在运行的进程限制 CPU 使用率或设置内存限制。

<!--
When you use the resource management capabilities in Kubernetes, such as configuring
[requests and limits for Pods and containers](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits),
Kubernetes uses cgroups to enforce your resource requests and limits.

The Linux kernel offers two versions of cgroups: cgroup v1 and cgroup v2.
-->
当你使用 Kubernetes 中的资源管理能力时，例如配置 
[Pod 和容器的请求和限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)，
Kubernetes 会使用 cgroups 来强制执行你的资源请求和限制。

Linux 内核提供了两个版本的 cgroup：cgroup v1 和 cgroup v2。

<!--
## What is cgroup v2?
-->
## 什么是 cgroup v2？

<!--
cgroup v2 is the latest version of the Linux cgroup API. cgroup v2 provides a
unified control system with enhanced resource management capabilities.

cgroup v2 has been in development in the Linux Kernel since 2016 and in recent
years has matured across the container ecosystem. With Kubernetes 1.25, cgroup
v2 support has graduated to general availability.
-->
cgroup v2 是 Linux cgroup API 的最新版本,
提供了一个具有增强的资源管理能力的统一控制系统。

自 2016 年以来，cgroup v2 一直在 Linux 内核中进行开发，
近年来在整个容器生态系统中已经成熟。在 Kubernetes 1.25 中，
对 cgroup v2 的支持已升级为正式发布。

<!--
Many recent releases of Linux distributions have switched over to cgroup v2 by
default so it's important that Kubernetes continues to work well on these new
updated distros.

cgroup v2 offers several improvements over cgroup v1, such as the following:
-->
默认情况下，许多最新版本的 Linux 发行版已切换到 cgroup v2，
因此 Kubernetes 继续在这些新更新的发行版上正常运行非常重要。

cgroup v2 对 cgroup v1 进行了多项改进，例如：

<!--
* Single unified hierarchy design in API
* Safer sub-tree delegation to containers
* Newer features like [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
* Enhanced resource allocation management and isolation across multiple resources
    * Unified accounting for different types of memory allocations (network and kernel memory, etc)
    * Accounting for non-immediate resource changes such as page cache write backs
-->
* API 中单个统一的层次结构设计
* 为容器提供更安全的子树委派能力
* [压力阻塞信息](https://www.kernel.org/doc/html/latest/accounting/psi.html)等新功能
* 增强的资源分配管理和跨多个资源的隔离
  * 统一核算不同类型的内存分配（网络和内核内存等）
  * 考虑非即时资源更改，例如页面缓存回写

<!--
Some Kubernetes features exclusively use cgroup v2 for enhanced resource
management and isolation. For example,
the [MemoryQoS feature](/blog/2021/11/26/qos-memory-resources/) improves
memory utilization and relies on cgroup v2 functionality to enable it. New
resource management features in the kubelet will also take advantage of the new
cgroup v2 features moving forward.
-->
一些 Kubernetes 特性专门使用 cgroup v2 来增强资源管理和隔离。 
例如，[MemoryQoS 特性](/blog/2021/11/26/qos-memory-resources/)提高了内存利用率并依赖
cgroup v2 功能来启用它。kubelet 中的新资源管理特性也将利用新的 cgroup v2 特性向前发展。

<!--
## How do you use cgroup v2?

Many Linux distributions are switching to cgroup v2 by default; you might start
using it the next time you update the Linux version of your control plane and
nodes!

Using a Linux distribution that uses cgroup v2 by default is the recommended
method. Some of the popular Linux distributions that use cgroup v2 include the
following:

* Container Optimized OS (since M97)
* Ubuntu (since 21.10)
* Debian GNU/Linux (since Debian 11 Bullseye)
* Fedora (since 31)
* Arch Linux (since April 2021)
* RHEL and RHEL-like distributions (since 9)
-->
## 如何使用 cgroup v2?

许多 Linux 发行版默认切换到 cgroup v2； 
你可能会在下次更新控制平面和节点的 Linux 版本时开始使用它！

推荐使用默认使用 cgroup v2 的 Linux 发行版。 
一些使用 cgroup v2 的流行 Linux 发行版包括：

* Container-Optimized OS（从 M97 开始）
* Ubuntu（从 21.10 开始，推荐 22.04+）
* Debian GNU/Linux（从 Debian 11 Bullseye 开始）
* Fedora（从 31 开始）
* Arch Linux（从 2021 年 4 月开始）
* RHEL 和类似 RHEL 的发行版（从 9 开始）

<!--
To check if your distribution uses cgroup v2 by default,
refer to [Check your cgroup version](/docs/concepts/architecture/cgroups/#check-cgroup-version) or
consult your distribution's documentation.

If you're using a managed Kubernetes offering, consult your provider to
determine how they're adopting cgroup v2, and whether you need to take action.

To use cgroup v2 with Kubernetes, you must meet the following requirements:
-->
要检查你的发行版是否默认使用 cgroup v2，
请参阅你的发行版文档或遵循[识别 Linux 节点上的 cgroup 版本](/zh-cn/docs/concepts/architecture/cgroups/#check-cgroup-version)。

如果你使用的是托管 Kubernetes 产品，请咨询你的提供商以确定他们如何采用 cgroup v2，
以及你是否需要采取行动。

要将 cgroup v2 与 Kubernetes 一起使用，必须满足以下要求：

<!--
* Your Linux distribution enables cgroup v2 on kernel version 5.8 or later
* Your container runtime supports cgroup v2. For example:
  * [containerd](https://containerd.io/) v1.4 or later
  * [cri-o](https://cri-o.io/) v1.20 or later
* The kubelet and the container runtime are configured to use the [systemd cgroup driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)
-->
* 你的 Linux 发行版在内核版本 5.8 或更高版本上启用 cgroup v2
* 你的容器运行时支持 cgroup v2。例如：
   * [containerd](https://containerd.io/) v1.4 或更高版本
   * [cri-o](https://cri-o.io/) v1.20 或更高版本
* kubelet 和容器运行时配置为使用 [systemd cgroup 驱动程序](/zh-cn/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

<!--
The kubelet and container runtime use a [cgroup driver](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
to set cgroup paramaters. When using cgroup v2, it's strongly recommended that both
the kubelet and your container runtime use the
[systemd cgroup driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver),
so that there's a single cgroup manager on the system. To configure the kubelet
and the container runtime to use the driver, refer to the
[systemd cgroup driver documentation](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver).
-->
kubelet 和容器运行时使用 [cgroup 驱动](/zh-cn/docs/setup/production-environment/container-runtimes#cgroup-drivers) 
来设置 cgroup 参数。使用 cgroup v2 时，强烈建议 kubelet 和你的容器运行时都使用 
[systemd cgroup 驱动程序](/zh-cn/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)，
以便系统上只有一个 cgroup 管理员。要配置 kubelet 和容器运行时以使用该驱动程序，
请参阅 [systemd cgroup 驱动程序文档](/zh-cn/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)。

<!--
## Migrate to cgroup v2

When you run Kubernetes with a Linux distribution that enables cgroup v2, the
kubelet should automatically adapt without any additional configuration
required, as long as you meet the requirements.

In most cases, you won't see a difference in the user experience when you
switch to using cgroup v2 unless your users access the cgroup file system
directly.
-->
## 迁移到 cgroup v2

当你使用启用 cgroup v2 的 Linux 发行版运行 Kubernetes 时，只要你满足要求，
kubelet 应该会自动适应而无需任何额外的配置。

在大多数情况下，除非你的用户直接访问 cgroup 文件系统，
否则当你切换到使用 cgroup v2 时，不会感知到用户体验有什么不同。

<!--
If you have applications that access the cgroup file system directly, either on
the node or from inside a container, you must update the applications to use
the cgroup v2 API instead of the cgroup v1 API.

Scenarios in which you might need to update to cgroup v2 include the following:

* If you run third-party monitoring and security agents that depend on the cgroup file system, update the
  agents to versions that support cgroup v2.
* If you run [cAdvisor](https://github.com/google/cadvisor) as a stand-alone
  DaemonSet for monitoring pods and containers, update it to v0.43.0 or later.
* If you deploy Java applications with the JDK, prefer to use JDK 11.0.16 and
  later or JDK 15 and later, which [fully support cgroup v2](https://bugs.openjdk.org/browse/JDK-8230305).
-->
如果你在节点上或从容器内直接访问 cgroup 文件系统的应用程序，
你必须更新应用程序以使用 cgroup v2 API 而不是 cgroup v1 API。

你可能需要更新到 cgroup v2 的场景包括：

* 如果你运行依赖于 cgroup 文件系统的第三方监控和安全代理，请将代理更新到支持 cgroup v2 的版本。
* 如果你将 [cAdvisor](https://github.com/google/cadvisor) 作为独立的 DaemonSet 运行以监控 Pod 和容器，
  请将其更新到 v0.43.0 或更高版本。
* 如果你使用 JDK 部署 Java 应用程序，首选使用[完全支持 cgroup v2](https://bugs.openjdk.org/browse/JDK-8230305)
  的 JDK 11.0.16 及更高版本或 JDK 15 及更高版本。

<!--
## Learn more

* Read the [Kubernetes cgroup v2 documentation](/docs/concepts/architecture/cgroups/)
* Read the enhancement proposal, [KEP 2254](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2254-cgroup-v2/README.md)
* Learn more about
  [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html) on Linux Manual Pages
  and [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html) on the Linux Kernel documentation
-->
## 进一步了解

* 阅读 [Kubernetes cgroup v2 文档](/zh-cn/docs/concepts/architecture/cgroups/)
* 阅读增强提案 [KEP 2254](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2254-cgroup-v2/README.md)
* 学习更多关于 Linux 手册页上的 [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html) 和 Linux 内核文档上的
  [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

<!--
## Get involved

Your feedback is always welcome! SIG Node meets regularly and are available in
the `#sig-node` channel in the Kubernetes [Slack](https://slack.k8s.io/), or
using the SIG [mailing list](https://github.com/kubernetes/community/tree/master/sig-node#contact).

cgroup v2 has had a long journey and is a great example of open source
community collaboration across the industry because it required work across the
stack, from the Linux Kernel to systemd to various container runtimes, and (of
course) Kubernetes.
-->
## 参与其中

随时欢迎你的反馈！SIG Node 定期开会，可在 Kubernetes [Slack](https://slack.k8s.io/)的 
`#sig-node` 频道中获得，或使用 SIG [邮件列表](https://github.com/kubernetes/community/tree/master/sig-node#contact)。

cgroup v2 经历了漫长的旅程，是整个行业开源社区协作的一个很好的例子，
因为它需要跨堆栈的工作，从 Linux 内核到 systemd 到各种容器运行时，当然还有 Kubernetes。

<!--
## Acknowledgments

We would like to thank [Giuseppe Scrivano](https://github.com/giuseppe) who
initiated cgroup v2 support in Kubernetes, and reviews and leadership from the
SIG Node community including chairs [Dawn Chen](https://github.com/dchen1107)
and [Derek Carr](https://github.com/derekwaynecarr).

We'd also like to thank the maintainers of container runtimes like Docker,
containerd and CRI-O, and the maintainers of components like
[cAdvisor](https://github.com/google/cadvisor)
and [runc, libcontainer](https://github.com/opencontainers/runc),
which underpin many container runtimes. Finally, this wouldn't have been
possible without support from systemd and upstream Linux Kernel maintainers.

It's a team effort!
-->
## 致谢

我们要感谢 [Giuseppe Scrivano](https://github.com/giuseppe) 在 Kubernetes 中发起对 cgroup v2 的支持，
还要感谢 SIG Node 社区主席 [Dawn Chen](https://github.com/dchen1107) 和
[Derek Carr](https://github.com/derekwaynecarr) 所作的审查和领导工作。

我们还要感谢 Docker、containerd 和 CRI-O 等容器运行时的维护者，
以及支持多种容器运行时的 [cAdvisor](https://github.com/google/cadvisor) 和
[runc, libcontainer](https://github.com/opencontainers/runc) 等组件的维护者。
最后，如果没有 systemd 和上游 Linux 内核维护者的支持，这将是不可能的。