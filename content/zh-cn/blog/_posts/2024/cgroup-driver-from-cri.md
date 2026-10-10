---
layout: blog
title: "Kubernetes 1.31: 节点 Cgroup 驱动程序的自动配置 (beta)"
date: 2024-08-21
slug: cri-cgroup-driver-lookup-now-beta
author: >
  Peter Hunt (Red Hat)
translator: >
  XiaoYang Zhang (Huawei)
---
<!--
layout: blog
title: "Kubernetes 1.31: Autoconfiguration For Node Cgroup Driver (beta)"
date: 2024-08-21
slug: cri-cgroup-driver-lookup-now-beta
author: >
Peter Hunt (Red Hat)
-->

<!--
Historically, configuring the correct cgroup driver has been a pain point for users running new
Kubernetes clusters. On Linux systems, there are two different cgroup drivers:
`cgroupfs` and `systemd`. In the past, both the [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
and CRI implementation (like CRI-O or containerd) needed to be configured to use
the same cgroup driver, or else the kubelet would exit with an error. This was a
source of headaches for many cluster admins. However, there is light at the end of the tunnel!
-->
一直以来，为新运行的 Kubernetes 集群配置正确的 cgroup 驱动程序是用户的一个痛点。
在 Linux 系统中，存在两种不同的 cgroup 驱动程序：`cgroupfs` 和 `systemd`。
过去，[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 和 CRI
实现（如 CRI-O 或 containerd）需要配置为使用相同的 cgroup 驱动程序， 否则 kubelet 会报错并退出。
这让许多集群管理员头疼不已。不过，现在曙光乍现！

<!--
## Automated cgroup driver detection

In v1.28.0, the SIG Node community introduced the feature gate
`KubeletCgroupDriverFromCRI`, which instructs the kubelet to ask the CRI
implementation which cgroup driver to use. A few minor releases of Kubernetes
happened whilst we waited for support to land in the major two CRI implementations
(containerd and CRI-O), but as of v1.31.0, this feature is now beta!
-->
## 自动检测 cgroup 驱动程序

在 v1.28.0 版本中，SIG Node 社区引入了 `KubeletCgroupDriverFromCRI` 特性门控，
它指示 kubelet 向 CRI 实现询问使用哪个 cgroup 驱动程序。在两个主要的 CRI 实现（containerd
和 CRI-O）增加对该功能的支持这段期间，Kubernetes 经历了几次小版本发布，但从 v1.31.0 版本开始，此功能现已进入 beta 阶段！

<!--
In addition to setting the feature gate, a cluster admin needs to ensure their
CRI implementation is new enough:

- containerd: Support was added in v2.0.0
- CRI-O: Support was added in v1.28.0
-->
除了设置特性门控之外，集群管理员还需要确保 CRI 实现版本足够新：

- containerd：v2.0.0 版本开始支持
- CRI-O：v1.28.0 版本开始支持

<!--
Then, they should ensure their CRI implementation is configured to the
cgroup_driver they would like to use.
-->
然后，他们应该确保配置其 CRI 实现使用他们想要的 cgroup 驱动程序。

<!--
## Future work

Eventually, support for the kubelet's `cgroupDriver` configuration field will be
dropped, and the kubelet will fail to start if the CRI implementation isn't new
enough to have support for this feature.
-->
## 未来工作

最终，kubelet 对 `cgroupDriver` 配置字段的支持将会被移除，如果 CRI 实现的版本不够新，无法支持此功能，kubelet 将无法启动。