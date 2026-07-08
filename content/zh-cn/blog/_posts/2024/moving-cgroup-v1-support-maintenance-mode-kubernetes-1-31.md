---
layout: blog
title: "Kubernetes 1.31：对 cgroup v1 的支持转为维护模式"
date: 2024-08-14
slug: kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode
author: Harshal Patil
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.31: Moving cgroup v1 Support into Maintenance Mode"
date: 2024-08-14
slug: kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode
author: Harshal Patil
-->

<!--
As Kubernetes continues to evolve and adapt to the changing landscape of
container orchestration, the community has decided to move cgroup v1 support
into [maintenance mode](#what-does-maintenance-mode-mean) in v1.31.
This shift aligns with the broader industry's move towards cgroup v2, offering
improved functionalities: including scalability and a more consistent interface.
Before we dive into the consequences for Kubernetes, let's take a step back to
understand what cgroups are and their significance in Linux.
-->
随着 Kubernetes 不断发展，为了适应容器编排全景图的变化，社区决定在 v1.31 中将对 cgroup v1
的支持转为[维护模式](#what-does-maintenance-mode-mean)。
这一转变与行业更广泛地向 cgroup v2 的迁移保持一致，后者的功能更强，
包括可扩展性和更加一致的接口。在我们深入探讨对 Kubernetes 的影响之前，
先回顾一下 cgroup 的概念及其在 Linux 中的重要意义。

<!--
## Understanding cgroups

[Control groups](https://man7.org/linux/man-pages/man7/cgroups.7.html), or
cgroups, are a Linux kernel feature that allows the allocation, prioritization,
denial, and management of system resources (such as CPU, memory, disk I/O,
and network bandwidth) among processes. This functionality is crucial for
maintaining system performance and ensuring that no single process can
monopolize system resources, which is especially important in multi-tenant
environments.
-->
## 理解 cgroup   {#understanding-cgroups}

[控制组（Control Group）](https://man7.org/linux/man-pages/man7/cgroups.7.html)也称为 cgroup，
是 Linux 内核的一项特性，允许在进程之间分配、划分优先级、拒绝和管理系统资源（如 CPU、内存、磁盘 I/O 和网络带宽）。
这一功能对于维护系统性能至关重要，确保没有单个进程能够垄断系统资源，这在多租户环境中尤其重要。

<!--
There are two versions of cgroups:
[v1](https://docs.kernel.org/admin-guide/cgroup-v1/index.html) and
[v2](https://docs.kernel.org/admin-guide/cgroup-v2.html). While cgroup v1
provided sufficient capabilities for resource management, it had limitations
that led to the development of cgroup v2. Cgroup v2 offers a more unified and
consistent interface, on top of better resource control features.
-->
cgroup 有两个版本：
[v1](https://docs.kernel.org/admin-guide/cgroup-v1/index.html) 和
[v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)。
虽然 cgroup v1 提供了足够的资源管理能力，但其局限性促使了 cgroup v2 的开发。
cgroup v2 在更好的资源控制特性之外提供了更统一且更一致的接口。

<!--
## Cgroups in Kubernetes

For Linux nodes, Kubernetes relies heavily on cgroups to manage and isolate the
resources consumed by containers running in pods. Each container in Kubernetes
is placed in its own cgroup, which allows Kubernetes to enforce resource limits,
monitor usage, and ensure fair resource distribution among all containers.
-->
## Kubernetes 中的 cgroup

对于 Linux 节点，Kubernetes 在管理和隔离 Pod 中运行的容器所消耗的资源方面高度依赖 cgroup。
Kubernetes 中的每个容器都放在其自己的 cgroup 中，这使得 Kubernetes 能够强制执行资源限制、
监控使用情况并确保所有容器之间的资源公平分配。

<!--
### How Kubernetes uses cgroups

**Resource Allocation**
: Ensures that containers do not exceed their allocated CPU and memory limits.

**Isolation**
: Isolates containers from each other to prevent resource contention.

**Monitoring**
: Tracks resource usage for each container to provide insights and metrics.
-->
### Kubernetes 如何使用 cgroup   {#how-kubernetes-uses-cgroups}

**资源分配**
: 确保容器不超过其分配的 CPU 和内存限制。

**隔离**
: 将容器相互隔离，防止资源争用。

**监控**
: 跟踪每个容器的资源使用情况，以提供洞察数据和指标。

<!--
## Transitioning to Cgroup v2

The Linux community has been focusing on cgroup v2 for new features and
improvements. Major Linux distributions and projects like
[systemd](https://systemd.io/) are
[transitioning](https://github.com/systemd/systemd/issues/30852) towards cgroup v2.
Using cgroup v2 provides several benefits over cgroupv1, such as Unified Hierarchy,
Improved Interface, Better Resource Control,
[cgroup aware OOM killer](https://github.com/kubernetes/kubernetes/pull/117793),
[rootless support](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless/README.md#cgroup) etc.
-->
## 向 cgroup v2 过渡   {#transitioning-to-cgroup-v2}

Linux 社区一直在聚焦于为 cgroup v2 提供新特性和各项改进。
主要的 Linux 发行版和像 [systemd](https://systemd.io/)
这样的项目正在[过渡](https://github.com/systemd/systemd/issues/30852)到 cgroup v2。
使用 cgroup v2 相较于使用 cgroup v1 提供了多个好处，例如统一的层次结构、改进的接口、更好的资源控制，
以及 [cgroup 感知的 OOM 杀手](https://github.com/kubernetes/kubernetes/pull/117793)、
[非 root 支持](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless/README.md#cgroup)等。

<!--
Given these advantages, Kubernetes is also making the move to embrace cgroup
v2 more fully. However, this transition needs to be handled carefully to avoid
disrupting existing workloads and to provide a smooth migration path for users.

## Moving cgroup v1 support into maintenance mode

### What does maintenance mode mean?

When cgroup v1 is placed into maintenance mode in Kubernetes, it means that:
-->
鉴于这些优势，Kubernetes 也正在更全面地转向 cgroup v2。然而，
这一过渡需要谨慎处理，以避免干扰现有的工作负载，并为用户提供平滑的迁移路径。

## 对 cgroup v1 的支持转入维护模式   {#moving-cgroup-v1-support-into-maintenance-mode}

### 维护模式意味着什么？   {#what-does-maintenance-mode-mean}

当 cgroup v1 在 Kubernetes 中被置于维护模式时，这意味着：

<!--
1. **Feature Freeze**: No new features will be added to cgroup v1 support.
2. **Security Fixes**: Critical security fixes will still be provided.
3. **Best-Effort Bug Fixes**: Major bugs may be fixed if feasible, but some
issues might remain unresolved.
-->
1. **特性冻结**：不会再向 cgroup v1 添加新特性。
2. **安全修复**：仍将提供关键的安全修复。
3. **尽力而为的 Bug 修复**：在可行的情况下可能会修复重大 Bug，但某些问题可能保持未解决。

<!--
### Why move to maintenance mode?

The move to maintenance mode is driven by the need to stay in line with the
broader ecosystem and to encourage the adoption of cgroup v2, which offers
better performance, security, and usability. By transitioning cgroup v1 to
maintenance mode, Kubernetes can focus on enhancing support for cgroup v2
and ensure it meets the needs of modern workloads. It's important to note
that maintenance mode does not mean deprecation; cgroup v1 will continue to
receive critical security fixes and major bug fixes as needed.
-->
### 为什么要转入维护模式？   {#why-move-to-maintenance-mode}

转入维护模式的原因是为了与更广泛的生态体系保持一致，也为了鼓励采用 cgroup v2，后者提供了更好的性能、安全性和可用性。
通过将 cgroup v1 转入维护模式，Kubernetes 可以专注于增强对 cgroup v2 的支持，并确保其满足现代工作负载的需求。
需要注意的是，维护模式并不意味着弃用；cgroup v1 将继续按需进行关键的安全修复和重大 Bug 修复。

<!--
## What this means for cluster administrators

Users currently relying on cgroup v1 are highly encouraged to plan for the
transition to cgroup v2. This transition involves:

1. **Upgrading Systems**: Ensuring that the underlying operating systems and
container runtimes support cgroup v2.
2. **Testing Workloads**: Verifying that workloads and applications function
correctly with cgroup v2.
-->
## 这对集群管理员意味着什么   {#what-this-means-for-cluster-administrators}

目前强烈鼓励那些依赖 cgroup v1 的用户做好向 cgroup v2 过渡的计划。这一过渡涉及：

1. **升级系统**：确保底层操作系统和容器运行时支持 cgroup v2。
2. **测试工作负载**：验证工作负载和应用程序在 cgroup v2 下正常工作。

<!--
## Further reading

- [Linux cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- [Cgroup v2 in Kubernetes](/docs/concepts/architecture/cgroups/)
- [Kubernetes 1.25: cgroup v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
-->
## 进一步阅读   {#further-reading}

- [Linux cgroup](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- [Kubernetes 中的 cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/)
- [Kubernetes 1.25：cgroup v2 进阶至 GA](/zh-cn/blog/2022/08/31/cgroupv2-ga-1-25/)
