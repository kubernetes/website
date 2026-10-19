---
layout: blog
title: "Kubernetes v1.37：Memory QoS 进阶到 Beta"
slug: kubernetes-v1-37-memory-qos-graduates-to-beta
date: 2026-09-14T10:30:00-08:00
author: >
  Qi Wang (Red Hat),
  Sohan Kunkerkar (Red Hat)
translator: >
  [Paco Xu](https://github.com/pacoxu) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.37: Memory QoS Graduates to Beta"
slug: kubernetes-v1-37-memory-qos-graduates-to-beta
date: 2026-09-14T10:30:00-08:00
author: >
  Qi Wang (Red Hat),
  Sohan Kunkerkar (Red Hat)
-->

<!--
Memory QoS has graduated to Beta in Kubernetes v1.37 and is now enabled by
default. On Linux nodes running cgroup v2, the feature uses the memory controller
to give the kernel better guidance on how to treat container memory. It was first introduced as
Alpha in v1.22, and expanded in v1.36 with tiered memory reservation.

This post covers what changed in v1.37, what the Beta promotion means for
cluster operators, and how to configure the feature.
-->
Memory QoS 已在 Kubernetes v1.37 中进阶到 Beta，并默认启用。
在运行 cgroup v2 的 Linux 节点上，该特性使用内存控制器，
为内核提供更好的指引来处理容器内存。
它最早在 v1.22 中以 Alpha 形式引入，并在 v1.36 中扩展了分层内存预留。

本文介绍 v1.37 中的变更、进阶到 Beta 对集群运维人员的意义，以及如何配置该特性。

<!--
## What changed in v1.37
-->
## v1.37 的变更

<!--
### Memory QoS is Beta and enabled by default
-->
### Memory QoS 为 Beta 且默认启用

<!--
The `MemoryQoS` feature gate is now Beta in v1.37.
This means every v1.37 `kubelet` has the feature gate turned on without any
configuration change. Turning on the feature by default is safe because the
default `kubelet` configuration does not enable memory throttling or memory
reservation. No `memory.high`, `memory.min`, or `memory.low` values are
written to cgroups unless you explicitly configure them.

You can opt into specific behaviors through `kubelet` configuration fields:

1. Set `memoryThrottlingFactor` (for example, `0.9`) to enable `memory.high` throttling on Burstable and BestEffort containers. The default is `null`, which means no throttling.
2. Set `memoryReservationPolicy` to `TieredReservation` to enable tiered memory protection via `memory.min` and `memory.low`. The default is `None`, which means no memory reservation.
-->
`MemoryQoS` 特性门控在 v1.37 中已是 Beta。
这意味着在每个 v1.37 版本的 `kubelet` 中，该特性都会默认启用，无需更改配置。
默认开启该特性是安全的，因为默认的 `kubelet` 配置并不会启用内存节流或内存预留。
除非你显式配置，否则不会向 cgroup 写入 `memory.high`、`memory.min` 或 `memory.low` 值。

你可以通过 `kubelet` 配置字段选择性启用特定行为：

1. 设置 `memoryThrottlingFactor`（例如 `0.9`），
   以对 Burstable 和 BestEffort 容器启用 `memory.high` 节流。
   默认值为 `null`，表示不进行节流。
2. 将 `memoryReservationPolicy` 设置为 `TieredReservation`，
   以通过 `memory.min` 和 `memory.low` 启用分层内存保护。
   默认值为 `None`，表示不进行内存预留。

<!--
### Default `memoryThrottlingFactor` changed to null
-->
### 默认的 `memoryThrottlingFactor` 变更为 `null`

<!--
In earlier Alpha releases, `memoryThrottlingFactor` defaulted to `0.9`, which
meant enabling the feature gate caused the `kubelet` to set
`memory.high` on containers. In v1.37, the default is `null`, so the `kubelet`
does not set `memory.high` unless you configure a value.

This change was made because, with the feature gate now on by default, an
automatic `memory.high` could throttle workloads that were previously running
without throttling. Making it `null` ensures that upgrading to v1.37 does not
change runtime behavior for existing clusters.

If your `kubelet` configuration file already contains an explicit
`memoryThrottlingFactor` value, that value is preserved during the upgrade and
throttling continues to work as before. If your configuration file does not
include `memoryThrottlingFactor`, the `kubelet` uses the new `null` default and
stops setting `memory.high`. To keep throttling in that case, add
`memoryThrottlingFactor` explicitly:
-->
在更早的 Alpha 版本中，`memoryThrottlingFactor` 的默认值为 `0.9`，
这意味着启用特性门控后，`kubelet` 会为容器设置 `memory.high`。
在 v1.37 中，默认值为 `null`，
因此除非你配置了具体数值，否则 `kubelet` 不会设置 `memory.high`。

作出这一变更是因为特性门控现已默认开启，
如果自动设置 `memory.high`，可能会节流那些此前在无节流情况下运行的工作负载。
将其设为 `null` 可确保升级到 v1.37 时不会改变现有集群的运行时行为。

如果你的 `kubelet` 配置文件中已经显式包含 `memoryThrottlingFactor` 值，
该值会在升级时被保留，节流行为会继续按原样工作。
如果你的配置文件不包含 `memoryThrottlingFactor`，
`kubelet` 会使用新的 `null` 默认值，并停止设置 `memory.high`。
若要在这种情况下继续启用节流，请显式添加 `memoryThrottlingFactor`：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
```

<!--
## How to configure MemoryQoS in v1.37

For full details on configuring Memory QoS, see [Memory QoS with cgroup v2](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2), [Configuring memory reservation](/docs/concepts/workloads/pods/pod-qos/#configuring-memory-reservation), and [System requirements](/docs/concepts/workloads/pods/pod-qos/#system-requirements)
-->
## 如何在 v1.37 中配置 MemoryQoS

有关配置 Memory QoS 的完整说明，请参阅
[使用 cgroup v2 的内存 QoS](/zh-cn/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2)、
[配置内存预留](/zh-cn/docs/concepts/workloads/pods/pod-qos/#configuring-memory-reservation)
以及[系统要求](/zh-cn/docs/concepts/workloads/pods/pod-qos/#system-requirements)。

<!--
### Enable memory throttling only

Set `memoryThrottlingFactor` to a value between 0 and 1. The `kubelet` uses this
factor to calculate `memory.high` for Burstable and BestEffort containers. See
[Memory throttling](/docs/concepts/workloads/pods/pod-qos/#memory-throttling)
for how `memory.high` is calculated for each QoS class.
-->
### 仅启用内存节流

将 `memoryThrottlingFactor` 设置为 0 到 1 之间的值。
`kubelet` 使用该因子为 Burstable 和 BestEffort 容器计算 `memory.high`。
有关各 QoS 类如何计算 `memory.high`，请参阅
[内存抑制](/zh-cn/docs/concepts/workloads/pods/pod-qos/#memory-throttling)。

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
```

<!--
### Enable memory throttling and tiered reservation
-->
### 同时启用内存节流与分层内存预留

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
memoryReservationPolicy: TieredReservation
```

<!--
### Enable tiered reservation without throttling
-->
### 启用分层内存预留但不启用节流

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryReservationPolicy: TieredReservation
```

<!--
### Disable Memory QoS entirely

To disable the feature after upgrading, set the feature gate to `false`
and ensure a compatible kubelet configuration. The `kubelet` rejects the configuration if
`memoryThrottlingFactor` is set to anything other than the former default of `0.9`, or if
`memoryReservationPolicy` is `TieredReservation`, so remove or adjust those fields if you set them.
-->
### 完全禁用 Memory QoS

升级后若要禁用该特性，请将特性门控设置为 `false`，并确保 `kubelet` 配置兼容。
如果 `memoryThrottlingFactor` 被设置为除此前默认值 `0.9` 以外的任何值，
或者 `memoryReservationPolicy` 为 `TieredReservation`，
`kubelet` 会拒绝该配置，因此若你设置过这些字段，请删除或调整它们。

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: false
```

<!--
When the feature gate is off, or `memoryReservationPolicy` is not `TieredReservation`, the
`kubelet` resets stale protection at startup on cgroup v2 nodes: `memory.min=0` and `memory.low=0`
on the root kubepods cgroup, and `memory.low=0` on the Burstable QoS cgroup.
For containers, stale `memory.high` values are reset to `max` on reconciliation paths such as restart or resize.
-->
当特性门控关闭，或 `memoryReservationPolicy` 不是 `TieredReservation` 时，
`kubelet` 会在 cgroup v2 节点启动时重置残留的保护设置：
将根 kubepods cgroup 的 `memory.min` 和 `memory.low` 重置为 `0`，
并将 Burstable QoS cgroup 的 `memory.low` 重置为 `0`。
对于容器，残留的 `memory.high` 值会在重启或原地调整资源等协调路径上被重置为 `max`。

<!--
## Known limitation: memory reservation is node-wide

`memoryReservationPolicy` applies to every pod on the node. With `TieredReservation`, every Guaranteed pod gets `memory.min` and every Burstable pod gets `memory.low`; there is no way to opt individual pods in or out. A node that mixes workloads needing hard reservation with workloads that should stay reclaimable has to choose one policy for all of them.

Hard reservation also covers everything charged to the container's cgroup, including page cache, so a pod that reads large files can hold memory the kernel would otherwise reclaim to serve its neighbors.

SIG Node is tracking both in [kubernetes/kubernetes#140246](https://github.com/kubernetes/kubernetes/issues/140246). If this affects you, that issue is the best place to describe your workload.
-->
## 已知限制：内存预留是节点范围的

`memoryReservationPolicy` 作用于节点上的每一个 Pod。
在 `TieredReservation` 下，每个 Guaranteed Pod 都会获得 `memory.min`，
每个 Burstable Pod 都会获得 `memory.low`；无法让单个 Pod 单独加入或退出。
若节点上同时混合了需要硬预留的工作负载和其内存应保持可回收的工作负载，
则必须为它们统一选择一种策略。

硬预留还会覆盖计入容器 cgroup 的所有内容，包括页缓存，
因此读取大文件的 Pod 可能会占住内核本可回收并提供给相邻工作负载的内存。

SIG Node 正在 [kubernetes/kubernetes#140246](https://github.com/kubernetes/kubernetes/issues/140246)
中跟踪以上两点。如果你受到影响，最适合在该 Issue 中说明你的工作负载情况。

<!--
## What to expect next

The next milestone for Memory QoS is graduation to GA. Feedback from Beta
users will shape any remaining adjustments before that step. If you run into
issues, please file bugs at
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues).
-->
## 后续展望

Memory QoS 的下一个里程碑是进阶到 GA。
Beta 用户的反馈将决定 GA 之前还需要做哪些调整。
如果你遇到问题，请在 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues)
提交缺陷报告。

<!--
## How can I learn more?

- [KEP-2570: Memory QoS](https://www.kubernetes.dev/resources/keps/2570/)
- [Pod Quality of Service Classes](/docs/concepts/workloads/pods/pod-qos/)
- [Memory QoS with cgroup v2](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2)
- [Managing Resources for Containers](/docs/concepts/configuration/manage-resources-containers/)
- [Kubernetes cgroups v2 support](/docs/concepts/architecture/cgroups/)
- [Linux kernel cgroups v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)
-->
## 如何进一步了解？

- [KEP-2570: Memory QoS](https://www.kubernetes.dev/resources/keps/2570/)
- [Pod Quality of Service Classes](/zh-cn/docs/concepts/workloads/pods/pod-qos/)
- [Memory QoS with cgroup v2](/zh-cn/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2)
- [Managing Resources for Containers](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
- [Kubernetes cgroups v2 support](/zh-cn/docs/concepts/architecture/cgroups/)
- [Linux kernel cgroups v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)

<!--
## Getting involved

This feature is driven by
[SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/). If
you are interested in contributing or have feedback, you can reach out through:

- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [SIG Node meetings](https://www.kubernetes.dev/community/community-groups/sigs/node/#meetings)
-->
## 参与其中

此特性由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 推动。
如果你有兴趣参与贡献或提供反馈，可以通过以下渠道联系我们：

- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [SIG Node 会议](https://www.kubernetes.dev/community/community-groups/sigs/node/#meetings)
