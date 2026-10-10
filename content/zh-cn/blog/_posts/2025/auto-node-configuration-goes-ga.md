---
layout: blog
title: "Kubernetes v1.34：节点 Cgroup 驱动程序自动配置升级到 GA"
date: 2025-09-12T10:30:00-08:00
slug: kubernetes-v1-34-cri-cgroup-driver-lookup-now-GA
author: Peter Hunt (Red Hat), Sergey Kanzhelev (Google)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
---
layout: blog
title: "Kubernetes v1.34: Autoconfiguration for Node Cgroup Driver Goes GA"
date: 2025-09-12T10:30:00-08:00
slug: kubernetes-v1-34-cri-cgroup-driver-lookup-now-GA
author: Peter Hunt (Red Hat), Sergey Kanzhelev (Google)
---
-->

<!--
Historically, configuring the correct cgroup driver has been a pain point for users running new
Kubernetes clusters. On Linux systems, there are two different cgroup drivers:
`cgroupfs` and `systemd`. In the past, both the [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
and CRI implementation (like CRI-O or containerd) needed to be configured to use
the same cgroup driver, or else the kubelet would misbehave without any explicit
error message. This was a source of headaches for many cluster admins. Now, we've
(almost) arrived at the end of that headache.
-->
历史上，配置正确的 CGroup 驱动程序一直是运行新 Kubernetes 集群的用户的痛点。
在 Linux 系统上，有两种不同的 cgroup 驱动程序：`cgroupfs` 和 `systemd`。
过去，[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
和 CRI 实现（如 CRI-O 或 containerd）都需要配置为使用相同的 CGroup 驱动程序，
否则 kubelet 会出现异常行为而没有任何明确的错误消息。这曾是许多集群管理员头痛的根源。
现在，我们（几乎）已经结束了这种头痛。

<!--
## Automated cgroup driver detection
-->
## 自动化 CGroup 驱动程序检测

<!--
In v1.28.0, the SIG Node community introduced the feature gate
`KubeletCgroupDriverFromCRI`, which instructs the kubelet to ask the CRI
implementation which cgroup driver to use. You can read more [here](/blog/2024/08/21/cri-cgroup-driver-lookup-now-beta/).
After many releases of waiting for each CRI implementation to have major versions released
and packaged in major operating systems, this feature has gone GA as of Kubernetes 1.34.0.

In addition to setting the feature gate, a cluster admin needs to ensure their
CRI implementation is new enough:

- containerd: Support was added in v2.0.0
- CRI-O: Support was added in v1.28.0
-->
在 v1.28.0 中，SIG Node 社区引入了特性门控 `KubeletCgroupDriverFromCRI`，
它指示 kubelet 询问 CRI 实现应该使用哪种 CGroup 驱动程序。
你可以在[此处](/blog/2024/08/21/cri-cgroup-driver-lookup-now-beta/)阅读更多内容。
经过多个版本的等待，每个 CRI 实现都发布了主要版本并打包到主要操作系统中，
此特性从 Kubernetes 1.34.0 开始升级为 GA。

除了设置特性门控外，集群管理员还需要确保他们的 CRI 实现足够新：

- containerd：在 v2.0.0 中添加了支持
- CRI-O：在 v1.28.0 中添加了支持

<!--
## Announcement: Kubernetes is deprecating containerd v1.y support
-->
## 公告：Kubernetes 弃用 containerd v1.y 支持

<!--
While CRI-O releases versions that match Kubernetes versions, and thus CRI-O
versions without this behavior are no longer supported, containerd maintains its
own release cycle. containerd support for this feature is only in v2.0 and
later, but Kubernetes 1.34 still supports containerd 1.7 and other LTS releases
of containerd.
-->
虽然 CRI-O 发布与 Kubernetes 版本匹配的版本，因此不再支持没有此行为的 CRI-O 版本，
但 containerd 保持其自己的发布周期。此功能的 containerd 支持仅在 v2.0 及更高版本中可用，
但 Kubernetes 1.34 仍然支持 containerd 1.7 和其他 containerd 的 LTS 版本。

<!--
The Kubernetes SIG Node community has formally agreed upon a final support
timeline for containerd v1.y. The last Kubernetes release to offer this support
will be the last released version of v1.35, and support will be dropped in
v1.36.0. To assist administrators in managing this future transition,
a new detection mechanism is available. You are able to monitor
the `kubelet_cri_losing_support` metric to determine if any nodes in your cluster
are using a containerd version that will soon be outdated. The presence of
this metric with a version label of `1.36.0` will indicate that the node's containerd
runtime is not new enough for the upcoming requirements. Consequently, an
administrator will need to upgrade containerd to v2.0 or a later version before,
or at the same time as, upgrading the kubelet to v1.36.0.
-->
Kubernetes SIG Node 社区已正式同意 containerd v1.y 的最终支持时间表。
提供此支持的最后一个 Kubernetes 版本将是 v1.35 的最后一个发布版本，支持将在 v1.36.0 中删除。
为了帮助管理员管理此未来过渡，提供了一种新的检测机制。
你可以监控 `kubelet_cri_losing_support` 指标来确定集群中的任何节点是否正在使用即将过时的
containerd 版本。
此指标存在 `1.36.0` 版本标签将表明节点的 containerd 运行时对于即将到来的要求来说不够新。
因此，管理员需要在将 kubelet 升级到 v1.36.0 之前或同时将 containerd 升级到 v2.0 或更高版本。
