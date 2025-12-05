---
layout: blog
title: "Kubernetes 1.31：對 cgroup v1 的支持轉爲維護模式"
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
隨着 Kubernetes 不斷發展，爲了適應容器編排全景圖的變化，社區決定在 v1.31 中將對 cgroup v1
的支持轉爲[維護模式](#what-does-maintenance-mode-mean)。
這一轉變與行業更廣泛地向 cgroup v2 的遷移保持一致，後者的功能更強，
包括可擴展性和更加一致的介面。在我們深入探討對 Kubernetes 的影響之前，
先回顧一下 cgroup 的概念及其在 Linux 中的重要意義。

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

[控制組（Control Group）](https://man7.org/linux/man-pages/man7/cgroups.7.html)也稱爲 cgroup，
是 Linux 內核的一項特性，允許在進程之間分配、劃分優先級、拒絕和管理系統資源（如 CPU、內存、磁盤 I/O 和網路帶寬）。
這一功能對於維護系統性能至關重要，確保沒有單個進程能夠壟斷系統資源，這在多租戶環境中尤其重要。

<!--
There are two versions of cgroups:
[v1](https://docs.kernel.org/admin-guide/cgroup-v1/index.html) and
[v2](https://docs.kernel.org/admin-guide/cgroup-v2.html). While cgroup v1
provided sufficient capabilities for resource management, it had limitations
that led to the development of cgroup v2. Cgroup v2 offers a more unified and
consistent interface, on top of better resource control features.
-->
cgroup 有兩個版本：
[v1](https://docs.kernel.org/admin-guide/cgroup-v1/index.html) 和
[v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)。
雖然 cgroup v1 提供了足夠的資源管理能力，但其侷限性促使了 cgroup v2 的開發。
cgroup v2 在更好的資源控制特性之外提供了更統一且更一致的介面。

<!--
## Cgroups in Kubernetes

For Linux nodes, Kubernetes relies heavily on cgroups to manage and isolate the
resources consumed by containers running in pods. Each container in Kubernetes
is placed in its own cgroup, which allows Kubernetes to enforce resource limits,
monitor usage, and ensure fair resource distribution among all containers.
-->
## Kubernetes 中的 cgroup

對於 Linux 節點，Kubernetes 在管理和隔離 Pod 中運行的容器所消耗的資源方面高度依賴 cgroup。
Kubernetes 中的每個容器都放在其自己的 cgroup 中，這使得 Kubernetes 能夠強制執行資源限制、
監控使用情況並確保所有容器之間的資源公平分配。

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

**資源分配**
: 確保容器不超過其分配的 CPU 和內存限制。

**隔離**
: 將容器相互隔離，防止資源爭用。

**監控**
: 跟蹤每個容器的資源使用情況，以提供洞察資料和指標。

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
## 向 cgroup v2 過渡   {#transitioning-to-cgroup-v2}

Linux 社區一直在聚焦於爲 cgroup v2 提供新特性和各項改進。
主要的 Linux 發行版和像 [systemd](https://systemd.io/)
這樣的項目正在[過渡](https://github.com/systemd/systemd/issues/30852)到 cgroup v2。
使用 cgroup v2 相較於使用 cgroup v1 提供了多個好處，例如統一的層次結構、改進的介面、更好的資源控制，
以及 [cgroup 感知的 OOM 殺手](https://github.com/kubernetes/kubernetes/pull/117793)、
[非 root 支持](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2033-kubelet-in-userns-aka-rootless/README.md#cgroup)等。

<!--
Given these advantages, Kubernetes is also making the move to embrace cgroup
v2 more fully. However, this transition needs to be handled carefully to avoid
disrupting existing workloads and to provide a smooth migration path for users.

## Moving cgroup v1 support into maintenance mode

### What does maintenance mode mean?

When cgroup v1 is placed into maintenance mode in Kubernetes, it means that:
-->
鑑於這些優勢，Kubernetes 也正在更全面地轉向 cgroup v2。然而，
這一過渡需要謹慎處理，以避免干擾現有的工作負載，併爲使用者提供平滑的遷移路徑。

## 對 cgroup v1 的支持轉入維護模式   {#moving-cgroup-v1-support-into-maintenance-mode}

### 維護模式意味着什麼？   {#what-does-maintenance-mode-mean}

當 cgroup v1 在 Kubernetes 中被置於維護模式時，這意味着：

<!--
1. **Feature Freeze**: No new features will be added to cgroup v1 support.
2. **Security Fixes**: Critical security fixes will still be provided.
3. **Best-Effort Bug Fixes**: Major bugs may be fixed if feasible, but some
issues might remain unresolved.
-->
1. **特性凍結**：不會再向 cgroup v1 添加新特性。
2. **安全修復**：仍將提供關鍵的安全修復。
3. **盡力而爲的 Bug 修復**：在可行的情況下可能會修復重大 Bug，但某些問題可能保持未解決。

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
### 爲什麼要轉入維護模式？   {#why-move-to-maintenance-mode}

轉入維護模式的原因是爲了與更廣泛的生態體系保持一致，也爲了鼓勵採用 cgroup v2，後者提供了更好的性能、安全性和可用性。
通過將 cgroup v1 轉入維護模式，Kubernetes 可以專注於增強對 cgroup v2 的支持，並確保其滿足現代工作負載的需求。
需要注意的是，維護模式並不意味着棄用；cgroup v1 將繼續按需進行關鍵的安全修復和重大 Bug 修復。

<!--
## What this means for cluster administrators

Users currently relying on cgroup v1 are highly encouraged to plan for the
transition to cgroup v2. This transition involves:

1. **Upgrading Systems**: Ensuring that the underlying operating systems and
container runtimes support cgroup v2.
2. **Testing Workloads**: Verifying that workloads and applications function
correctly with cgroup v2.
-->
## 這對叢集管理員意味着什麼   {#what-this-means-for-cluster-administrators}

目前強烈鼓勵那些依賴 cgroup v1 的使用者做好向 cgroup v2 過渡的計劃。這一過渡涉及：

1. **升級系統**：確保底層操作系統和容器運行時支持 cgroup v2。
2. **測試工作負載**：驗證工作負載和應用程式在 cgroup v2 下正常工作。

<!--
## Further reading

- [Linux cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- [Cgroup v2 in Kubernetes](/docs/concepts/architecture/cgroups/)
- [Kubernetes 1.25: cgroup v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
-->
## 進一步閱讀   {#further-reading}

- [Linux cgroup](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- [Kubernetes 中的 cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/)
- [Kubernetes 1.25：cgroup v2 進階至 GA](/zh-cn/blog/2022/08/31/cgroupv2-ga-1-25/)
