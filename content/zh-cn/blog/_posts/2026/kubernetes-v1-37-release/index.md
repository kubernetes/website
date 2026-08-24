---
layout: blog
title: "Kubernetes v1.37：<版本名称>"
draft: true
evergreen: true
slug: kubernetes-v1-37-release
author: >
  [Kubernetes v1.37 发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md)
translator: >
  [Paco Xu](https://github.com/pacoxu)（DaoCloud）
release_announcement:
  minor_version: "1.37"
  themes:
    - "Release CodeName 1"
---
<!--
layout: blog
title: "Kubernetes v1.37: <Release Name>"
draft: true
evergreen: true
slug: kubernetes-v1-37-release
author: >
  [Kubernetes v1.37 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md)
release_announcement:
  minor_version: "1.37"
  themes:
    - "Release CodeName 1"
-->

<!--
**Editors:** Arsh Sharma, Christopher Tineo, Kirti Goyal, Sophia Ugochukwu, Swathi Rao, Troy Connor
-->
**编辑**：Arsh Sharma、Christopher Tineo、Kirti Goyal、Sophia Ugochukwu、Swathi Rao、Troy Connor

<!--
Similar to previous releases, the release of [Kubernetes v1.37](/releases/1.37/) introduces new Stable, Beta, and Alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.

This release consists of 67 enhancements.
Of those enhancements, 16 have graduated to Stable, 23 have graduated to Beta,
27 are entering Alpha, and 1 is a deprecation/removal.
-->
与之前的版本类似，[Kubernetes v1.37](/zh-cn/releases/1.37/) 的发布引入了新的稳定（GA）、
Beta 和 Alpha 特性。持续交付高质量版本，彰显了我们开发周期的韧性与社区蓬勃的支持。

此版本包含 67 项增强。其中，16 项已进阶至稳定阶段，23 项已进阶至 Beta 阶段，
27 项进入 Alpha 阶段，另有 1 项弃用或移除。

<!--
## Release theme and logo
-->
## 发布主题与徽标   {#release-theme-and-logo}

<!-- Logo image size is recommended to be no more than 2160px -->

<!-- Figure src="k8s-1.37.svg" alt="Kubernetes v1.37 <release theme> logo" class="release-logo" -->
{{< figure src="k8s-1.37.svg" alt="Kubernetes v1.37 <发布主题>徽标" class="release-logo" >}}

<!--
## Spotlight on key updates

Kubernetes v1.37 is packed with new features and improvements. Here are a few select updates the [Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md) would like to highlight!
-->
## 重点更新速览   {#spotlight-on-key-updates}

Kubernetes v1.37 带来了大量新特性与改进。
以下是[发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md)
希望重点介绍的部分更新！

<!--
### Stable: Resilient watchcache initialization

Kubernetes v1.37 completes the _resilient watch cache initialization_ work: the
`ResilientWatchCacheInitialization` feature gate reached Stable back in v1.34, and in v1.37 the remaining
`WatchCacheInitializationPostStartHook` gate graduates to Stable and is locked on. It has defaulted to
enabled since v1.36, hardening the API server at startup and during
recovery.  Watchcache initialization and reinitialization no longer create the thundering-herd requests against `etcd`, and
requests are handled gracefully instead of piling up while the cache warms.
-->
### 稳定（GA）阶段：弹性监视缓存初始化   {#stable-resilient-watchcache-initialization}

Kubernetes v1.37 完成了**弹性监视缓存初始化**相关工作：
`ResilientWatchCacheInitialization` 特性门控早在 v1.34 就已进阶至稳定阶段；
在 v1.37 中，剩余的 `WatchCacheInitializationPostStartHook` 门控也进阶至稳定阶段并被锁定为启用。
该门控从 v1.36 起默认启用，加强了 API 服务器启动和恢复期间的可靠性。
监视缓存的初始化和重新初始化不再向 `etcd` 发起由惊群效应引发的大量并发请求；
缓存预热期间，请求会得到妥善处理，而不会不断堆积。

<!--
Instead of allowing expensive list and watch requests to overload `etcd` or exhaust API Priority and Fairness capacity, `kube-apiserver` now safely delegates bounded requests and rejects others with HTTP 429 responses. This reduces the risk of control
plane outages in large clusters.  Clients (including custom controllers and operators) should be designed to handle HTTP `429 Too Many Requests` responses gracefully by respecting `Retry-After` headers and implementing exponential backoff.

This work was done as part of [KEP #4568](https://www.kubernetes.dev/resources/keps/4568/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).
-->
`kube-apiserver` 不再允许代价高昂的 list 和 watch 请求压垮 `etcd`，
或耗尽 API 优先级和公平性（APF）容量，只将处理开销有界的请求转交给 `etcd`，
并以 HTTP 429 响应拒绝其他请求。这降低了大型集群控制平面发生中断的风险。
客户端（包括自定义控制器和 Operator）应妥善处理 HTTP `429 Too Many Requests` 响应：
遵循 `Retry-After` 响应头并实现指数退避。

此项工作是 [KEP #4568](https://www.kubernetes.dev/resources/keps/4568/) 的一部分，
由 [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/) 牵头完成。

<!--
### Beta: HorizontalPodAutoscaler scale to zero

In Kubernetes v1.37, HorizontalPodAutoscaler _scale to zero_ support is graduating to Beta. First introduced in
Kubernetes v1.16, it is now **enabled by default**.
For workloads that are using object or external metrics, this feature allows HorizontalPodAutoscalers to scale down to
zero Pods when idle, then restore them when demand returns. Doing that can reduce costs for queue consumers, batch jobs,
and GPU workloads. Setting `spec.minReplicas: 0` applies this functionality for workloads.
-->
### Beta 阶段：HorizontalPodAutoscaler 缩容至零   {#beta-horizontalpodautoscaler-scale-to-zero}

在 Kubernetes v1.37 中，HorizontalPodAutoscaler 对**缩容至零**的支持进阶至 Beta 阶段。
该特性最初在 Kubernetes v1.16 中引入，现在**默认启用**。
对于使用对象指标或外部指标的工作负载，此特性允许 HorizontalPodAutoscaler
在工作负载空闲时将 Pod 数量缩减至零，并在需求恢复时重新扩容。
这可以降低队列消费者、批处理作业和 GPU 工作负载的成本。
为工作负载设置 `spec.minReplicas: 0` 即可应用此功能。

<!--
Scaling to zero based on CPU and memory metrics is **not** supported because those metrics depend on active Pods.
Instead, this feature is for situations such as leaving the replica count at zero until there is queued work to process.

While the HorizontalPodAutoscaler is holding a
workload at zero replicas, it records a `ScaledToZero` condition with `True` in the HorizontalPodAutoscaler's status. The
`HorizontalPodAutoscaler` controller then uses this condition to distinguish a workload that it scaled to zero (and will
scale back up when the metric returns) from one that was manually deactivated by setting its replica count to 0. Once the
workload is scaled back up, the condition is set to `False` with the reason `NotScaledToZero`.
-->
不支持根据 CPU 和内存指标缩容至零，因为这些指标依赖于活跃的 Pod。
此特性适用于让副本数保持为零、直至队列中出现待处理工作等场景。

当 HorizontalPodAutoscaler 将工作负载维持在零副本时，
它会在 HorizontalPodAutoscaler 状态中记录值为 `True` 的 `ScaledToZero` 状况。
`HorizontalPodAutoscaler` 控制器随后使用此状况来区分两类工作负载：
一类由控制器缩容至零（并会在指标恢复时重新扩容），
另一类则由用户手动将副本数设为 0 而停用。
工作负载重新扩容后，该状况会被设为 `False`，原因为 `NotScaledToZero`。

<!--
This work was done as part of [KEP #2021](https://www.kubernetes.dev/resources/keps/2021/) led by [SIG Autoscaling](https://www.kubernetes.dev/community/community-groups/sigs/autoscaling/).
-->
此项工作是 [KEP #2021](https://www.kubernetes.dev/resources/keps/2021/) 的一部分，
由 [SIG Autoscaling](https://www.kubernetes.dev/community/community-groups/sigs/autoscaling/) 牵头完成。

<!--
### Beta: Manifest-based admission control configuration

Kubernetes v1.37 graduates [manifest-based admission control](/docs/reference/access-authn-authz/manifest-admission-control/)
configuration to Beta. Admission webhooks and CEL-based policies can now be loaded from manifest files on disk, via the
`staticManifestsDir` field in `AdmissionConfiguration`, instead of living only in the Kubernetes API. Policies loaded this
way are enforced from API server startup, keep working while `etcd` is unavailable, and can protect the API-based admission
resources themselves from modification.

This work was done as part of [KEP #5793](https://www.kubernetes.dev/resources/keps/5793/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).
-->
### Beta 阶段：基于清单的准入控制配置   {#beta-manifest-based-admission-control-configuration}

Kubernetes v1.37 将[基于清单的准入控制](/zh-cn/docs/reference/access-authn-authz/manifest-admission-control/)
配置进阶至 Beta 阶段。现在可以通过 `AdmissionConfiguration` 中的 `staticManifestsDir` 字段，
从磁盘上的清单文件加载准入 Webhook 和基于 CEL 的策略，而不再只能将它们存放在 Kubernetes API 中。
以这种方式加载的策略从 API 服务器启动时起便会强制执行，
在 `etcd` 不可用期间仍能继续工作，还能保护基于 API 的准入资源本身免遭修改。

此项工作是 [KEP #5793](https://www.kubernetes.dev/resources/keps/5793/) 的一部分，
由 [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/) 牵头完成。

<!--
### Alpha: Pod-level checkpoint and restore

Kubernetes v1.37 introduces Alpha support for **Pod-level** checkpoint and restore,
extending the CRI with `CheckpointPod` and `RestorePod` RPCs.
These RPCs allow the kubelet and compatible container runtimes to create a Pod checkpoint and restore a Pod from it.
To make it work, your container runtime(s) also must implement these new RPCs.

This work was done as part of [KEP #5823](https://www.kubernetes.dev/resources/keps/5823/) led by
[SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).
-->
### Alpha 阶段：Pod 级检查点与恢复   {#alpha-pod-level-checkpoint-and-restore}

Kubernetes v1.37 引入了对 **Pod 级**检查点与恢复的 Alpha 支持，
通过 `CheckpointPod` 和 `RestorePod` RPC 扩展了 CRI。
这些 RPC 允许 kubelet 和兼容的容器运行时为 Pod 创建检查点，并从中恢复 Pod。
要使用此功能，你的容器运行时也必须实现这些新 RPC。

此项工作是 [KEP #5823](https://www.kubernetes.dev/resources/keps/5823/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 牵头完成。

<!--
## Features graduating to Stable

This lists all the features that graduated to Stable (also known as _General Availability_). For a full list of updates
including new features and graduations from Alpha to Beta, see the release notes.

This release includes a total of 16 enhancements promoted to Stable:
-->
## 进阶至稳定阶段的特性   {#features-graduating-to-stable}

本节列出了所有进阶至稳定阶段（也称为**正式发布**，GA）的特性。
有关新特性以及从 Alpha 进阶至 Beta 等更新的完整列表，请参阅发布说明。

此版本共有 16 项增强进阶至稳定阶段：

<!--
### KYAML

KYAML is a safer and less ambiguous subset of YAML designed specifically for Kubernetes, **not a replacement for it**. Every
KYAML file is valid YAML, so KYAML is a valid input for any version of `kubectl`, and spec files do not need to be written in
KYAML for the input to be parsed. Your existing manifests, tooling, and pipelines don't need to change.
Introduced as an Alpha feature in v1.34 and graduating to Beta in v1.35, KYAML graduates to Stable in v1.37 with conformance
testing complete, and `kubectl get -o kyaml` is now Stable.
-->
### KYAML

KYAML 是专为 Kubernetes 设计的、更安全且歧义更少的 YAML 子集，**并非 YAML 的替代品**。
每个 KYAML 文件都是有效的 YAML，因此 KYAML 可作为任意版本 `kubectl` 的有效输入；
规范文件无需使用 KYAML 编写也能被解析。你现有的清单、工具和流水线无需更改。
KYAML 在 v1.34 中作为 Alpha 特性引入，在 v1.35 中进阶至 Beta；
随着一致性测试完成，KYAML 在 v1.37 中进阶至稳定阶段，`kubectl get -o kyaml` 现在也已稳定。

<!--
To learn more about KYAML, check out [How to Pretty-Print Your Kubernetes YAML as KYAML and Why You'd Want To](/blog/2026/08/11/how-to-pretty-print-kubernetes-yaml-as-kyaml/).

This work was done as part of [KEP #5295](https://www.kubernetes.dev/resources/keps/5295/) led by [SIG CLI](https://www.kubernetes.dev/community/community-groups/sigs/cli/).
-->
要进一步了解 KYAML，请阅读[如何将 Kubernetes YAML 美化输出为 KYAML，以及为什么值得这样做](/blog/2026/08/11/how-to-pretty-print-kubernetes-yaml-as-kyaml/)。

此项工作是 [KEP #5295](https://www.kubernetes.dev/resources/keps/5295/) 的一部分，
由 [SIG CLI](https://www.kubernetes.dev/community/community-groups/sigs/cli/) 牵头完成。

<!--
### The metrics.k8s.io API

The metrics.k8s.io API graduates to Stable in Kubernetes v1.37 after spending nearly nine years in Beta. The API provides a
standard way to retrieve CPU and memory usage for pods and nodes, powering widely used Kubernetes features such as the
HorizontalPodAutoscaler (HPA) and commands like `kubectl top`.

The graduation follows the Kubernetes project’s goal of avoiding permanent Beta APIs. Now that `v1` exists, future
Kubernetes releases will move over to it; `v1beta1` remains usable throughout the transition, in line with the API
deprecation policy, so you can adopt the Stable API without breaking existing workflows.
-->
### metrics.k8s.io API   {#the-metricsk8sio-api}

metrics.k8s.io API 在经历近九年的 Beta 阶段后，于 Kubernetes v1.37 中进阶至稳定阶段。
该 API 提供了检索 Pod 和节点 CPU 与内存用量的标准方式，
为 HorizontalPodAutoscaler（HPA）以及 `kubectl top` 等广泛使用的 Kubernetes 功能和命令提供支持。

此次进阶体现了 Kubernetes 项目避免 API 永久停留在 Beta 阶段的目标。
现在 `v1` 已经可用，未来的 Kubernetes 版本将迁移到该版本；
依照 API 弃用策略，在过渡期间 `v1beta1` 仍可使用，
因此你可以采用稳定版 API，而不会破坏现有工作流。

<!--
This work was done as part of [KEP #5207](https://www.kubernetes.dev/resources/keps/5207/) led
by [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/).
-->
此项工作是 [KEP #5207](https://www.kubernetes.dev/resources/keps/5207/) 的一部分，
由 [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/) 牵头完成。

<!--
### `SELinuxMount` and `SELinuxChangePolicy`

In Kubernetes v1.37, SELinuxMount and `SELinuxChangePolicy` flags reach Stable and are enabled by default: this means that
volumes get mounted with `-o context=<label>` (the MountOption default) instead of being recursively relabeled, but only when
the volume's CSI driver opts in via `.spec.seLinuxMount: true` for the CSIDriver object.

A mount can only carry one SELinux context, so [Pods with different SELinux labels sharing a volume on the same node, which
used to coexist under recursive relabeling, can now fail to start](https://www.kubernetes.dev/resources/keps/1710/#story-3-cluster-upgrade).
To retain the old behavior for a workload, it is advised to set the `.spec.seLinuxChangePolicy` to `Recursive` on a Pod.
-->
### `SELinuxMount` 和 `SELinuxChangePolicy`

在 Kubernetes v1.37 中，`SELinuxMount` 和 `SELinuxChangePolicy` 特性门控进阶至稳定阶段并默认启用：
这意味着卷将使用 `-o context=<label>`（MountOption 的默认值）挂载，而不是被递归重新打标签；
不过，仅当卷的 CSI 驱动通过在 CSIDriver 对象中设置 `.spec.seLinuxMount: true` 明确选择启用时才会如此。

一次挂载只能携带一个 SELinux 上下文，因此，
[位于同一节点、具有不同 SELinux 标签并共享卷的 Pod，以前可在递归重新打标签方式下共存，
现在可能无法启动](https://www.kubernetes.dev/resources/keps/1710/#story-3-cluster-upgrade)。
要为工作负载保留原有行为，建议在 Pod 上将 `.spec.seLinuxChangePolicy` 设为 `Recursive`。

<!--
This behavior itself also isn't locked until v1.38, so disabling it cluster-wide remains an option for one more release.

Clusters without SELinux enabled see no effect at all. To learn more, check [SELinux Volume Label Changes goes GA (and likely
implications in v1.37)](/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)

This work was done as part of [KEP #1710](https://www.kubernetes.dev/resources/keps/1710/) led by [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).
-->
此行为本身要到 v1.38 才会锁定，因此在接下来的一个版本中仍可选择在整个集群范围内将其禁用。

未启用 SELinux 的集群完全不受影响。要了解更多信息，请参阅
[SELinux 卷标签变更进阶至 GA（以及在 v1.37 中可能产生的影响）](/zh-cn/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)。

此项工作是 [KEP #1710](https://www.kubernetes.dev/resources/keps/1710/) 的一部分，
由 [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/) 牵头完成。

<!--
### DRA features graduating to Stable
-->
### 进阶至稳定阶段的 DRA 特性   {#dra-features-graduating-to-stable}

<!--
#### DRA: ResourceClaim status with possible standardized network interface data

The ResourceClaim `.status.devices` reaches Stable in Kubernetes v1.37, which allows drivers to report device-specific device
status data for each allocated device in a resource claim. This makes it easier to see how a device is configured,
troubleshoot problems, and use the device with other services.

This is particularly useful for network devices; before this field was added, if a Pod requested a network device via DRA,
there was no way for any other component in the system to learn the IP address that was assigned to that network device.
The new status field provides a standardized way for the DRA driver to export that information to components that need it,
making DRA fully usable for attaching secondary network interfaces to Pods.
-->
#### DRA：ResourceClaim 状态可包含标准化的网络接口数据   {#dra-resourceclaim-status-with-possible-standardized-network-interface-data}

ResourceClaim 的 `.status.devices` 在 Kubernetes v1.37 中进阶至稳定阶段，
允许驱动针对资源申领中的每个已分配设备报告设备特定的状态数据。
这让用户更容易查看设备的配置方式、排查问题，以及配合其他服务使用设备。

这对于网络设备尤其有用。在添加此字段之前，如果 Pod 通过 DRA 请求网络设备，
系统中的其他组件无法获知分配给该网络设备的 IP 地址。
新的状态字段为 DRA 驱动提供了一种标准化方式，
可将这些信息导出给需要它们的组件，使 DRA 能够完整支持为 Pod 挂接辅助网络接口。

<!--
This work was done as part of [KEP #4817](https://www.kubernetes.dev/resources/keps/4817/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) and [SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/).
-->
此项工作是 [KEP #4817](https://www.kubernetes.dev/resources/keps/4817/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 和
[SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/) 牵头完成。

<!--
#### DRA: Handle extended resource requests via DRA Driver

DRA Extended Resource support reaches Stable in Kubernetes v1.37. This feature allows DRA drivers to fulfill requests made
through the traditional _extended resource_ mechanism, such as `abc.example/gpu: 3` in a Pod spec, without requiring a
separate [device plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).

With this mechanism, an extended resource name can be assigned directly to a DeviceClass. Pods requesting that resource can then have a device allocated through DRA without needing to define a ResourceClaim in the workload.
-->
#### DRA：通过 DRA 驱动处理扩展资源请求   {#dra-handle-extended-resource-requests-via-dra-driver}

DRA 扩展资源支持在 Kubernetes v1.37 中进阶至稳定阶段。
此特性允许 DRA 驱动满足通过传统**扩展资源**机制提出的请求，
例如 Pod 规约中的 `abc.example/gpu: 3`，而无需单独的
[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。

借助此机制，可以将扩展资源名称直接分配给 DeviceClass。
请求该资源的 Pod 随后可通过 DRA 获得设备分配，
而无需在工作负载中定义 ResourceClaim。

<!--
This work was done as part of [KEP #5004](https://www.kubernetes.dev/resources/keps/5004/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
此项工作是 [KEP #5004](https://www.kubernetes.dev/resources/keps/5004/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
#### DRA: device taints and tolerations

Support for taints and tolerations for physical devices managed through DRA is now Stable in Kubernetes v1.37. By default, any available device can be considered for scheduling. This enhancement provides greater control over device scheduling by allowing DRA drivers to mark specific devices as tainted, preventing them from being selected for workloads. Alternatively, cluster administrators can create a DeviceTaintRule to taint devices based on specific selection criteria, such as all devices managed by a particular driver.

This work was done as part of [KEP #5055](https://www.kubernetes.dev/resources/keps/5055/)
led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
#### DRA：设备污点和容忍度   {#dra-device-taints-and-tolerations}

Kubernetes v1.37 现已为通过 DRA 管理的物理设备提供稳定的污点和容忍度支持。
默认情况下，任何可用设备都可纳入调度考虑。
此项增强允许 DRA 驱动将特定设备标记为带有污点，防止工作负载选择这些设备，
从而提供更精细的设备调度控制。
集群管理员也可以创建 DeviceTaintRule，按照特定选择条件为设备添加污点，
例如选择由某个特定驱动管理的所有设备。

此项工作是 [KEP #5055](https://www.kubernetes.dev/resources/keps/5055/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
#### DRA: standard numaNode device attribute {#dra-standard-numanode-device-attribute}

Kubernetes v1.37 defines a new standard NUMA node device attribute. It standardizes
`resource.kubernetes.io/numaNode` as a shared attribute name for device NUMA node information, allowing devices managed by
different DRA drivers to be compared based on the same NUMA node. This avoids each driver defining its own attribute name and
provides a consistent way to identify NUMA placement across devices. The enhancement lands directly as Stable because it is a
naming and registration KEP with no feature gate or in-tree behavior changes.

This work was done as part of [KEP #6072](https://www.kubernetes.dev/resources/keps/6072/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node).
-->
#### DRA：标准 `numaNode` 设备属性   {#dra-standard-numanode-device-attribute}

Kubernetes v1.37 定义了新的标准 NUMA 节点设备属性。
它将 `resource.kubernetes.io/numaNode` 标准化为设备 NUMA 节点信息的共享属性名称，
使不同 DRA 驱动管理的设备可以基于同一 NUMA 节点进行比较。
这避免了每个驱动自行定义属性名称，并提供了一种跨设备识别 NUMA 放置的一致方式。
由于这是一项命名和注册类 KEP，没有特性门控或树内行为变更，因此此增强直接以稳定状态引入。

此项工作是 [KEP #6072](https://www.kubernetes.dev/resources/keps/6072/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 牵头完成。

<!--
### Node declared features {#node-declared-features}

_Node declared features_ graduate to Stable in Kubernetes v1.37, providing a framework to declare the availability of specific, feature-gated Kubernetes features for Nodes.
This would then be used by control plane components (such as the `kube-scheduler`, admission controllers, or the API server itself) to manage version skew.

The feature introduces a new `.status.declaredFeatures` field for Nodes, which is used to declare a feature graduating
through the Alpha → Beta → Stable stages. The control plane can use this to adopt
the correct behavior even in a cluster running a mixture of different node versions.
-->
### 节点声明式特性   {#node-declared-features}

**节点声明式特性**在 Kubernetes v1.37 中进阶至稳定阶段，
为节点声明特定的、受特性门控控制的 Kubernetes 特性是否可用提供了框架。
控制平面组件（例如 `kube-scheduler`、准入控制器或 API 服务器本身）
随后可以使用这些信息来管理版本偏差。

此特性为 Node 引入了新的 `.status.declaredFeatures` 字段，
用于声明正经历 Alpha → Beta → Stable 各阶段的特性。
即使集群中混合运行不同版本的节点，控制平面也能据此采用正确的行为。

<!--
Once features graduate to Stable and the control plane can assume all nodes support them across the supported version skew
window, nodes stop reporting them.

The `kubelet` determines its declared features when it starts, based only on feature gates and the node’s static
configuration (so any changes require a `kubelet` restart).

This work was done as part of [KEP #5328](https://www.kubernetes.dev/resources/keps/5328/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).
-->
当特性进阶至稳定阶段，并且控制平面可以假定在受支持的版本偏差窗口内所有节点都支持这些特性后，
节点便会停止报告这些特性。

`kubelet` 启动时仅根据特性门控和节点的静态配置确定所声明的特性，
因此任何更改都需要重启 `kubelet`。

此项工作是 [KEP #5328](https://www.kubernetes.dev/resources/keps/5328/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 牵头完成。

<!--
### Storage version migrator {#storage-version-migrator}

Kubernetes v1.37 sees the StorageVersionMigration API (`storagemigration.k8s.io/v1`) graduate to Stable and become enabled by
default. It helps migrate existing resources, both built-in and custom, from an older storage version to the new storage
version after an API upgrade, such as when the preferred storage version changes from `v1beta1` to `v1`. It can also be used to rewrite existing
data after a change to encryption at rest, so that stale data is stored using the new encryption settings.

Historically, cluster administrators and CustomResourceDefinition authors had to use manual `kubectl get` or
`kubectl replace` scripts, or deploy the out-of-tree `kube-storage-version-migrator` component to rewrite existing resources. These
approaches were often tedious, error-prone, and difficult to monitor.
-->
### 存储版本迁移器   {#storage-version-migrator}

在 Kubernetes v1.37 中，StorageVersionMigration API（`storagemigration.k8s.io/v1`）
进阶至稳定阶段并默认启用。在 API 升级之后，例如首选存储版本从 `v1beta1` 改为 `v1` 时，
它可以帮助将内置和自定义的现有资源从旧存储版本迁移到新存储版本。
它还可用于在静态数据加密配置变更后重写现有数据，
使原有数据也使用新的加密设置进行存储。

以往，集群管理员和 CustomResourceDefinition 作者必须手动使用 `kubectl get` 或
`kubectl replace` 脚本，或者部署树外的 `kube-storage-version-migrator` 组件来重写现有资源。
这些方法通常繁琐、容易出错且难以监控。

<!--
To start a storage version migration, users would need to create a declarative StorageVersionMigration object. The built-in
`StorageVersionMigrator` controller in the Kubernetes control plane watches for these objects and automatically migrates
existing resources to the default storage version for that API. Since StorageVersionMigration is a standard Kubernetes API,
CRD authors can trigger migrations as part of a CRD upgrade instead of managing the migration separately.

This work was done as part of [KEP #4192](https://www.kubernetes.dev/resources/keps/4192/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).
-->
要启动存储版本迁移，用户需要创建声明式的 StorageVersionMigration 对象。
Kubernetes 控制平面中内置的 `StorageVersionMigrator` 控制器会监视这些对象，
并自动将现有资源迁移到相应 API 的默认存储版本。
由于 StorageVersionMigration 是标准的 Kubernetes API，
CRD 作者可以将迁移作为 CRD 升级的一部分触发，而无需单独管理迁移。

此项工作是 [KEP #4192](https://www.kubernetes.dev/resources/keps/4192/) 的一部分，
由 [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/) 牵头完成。

<!--
### Stable: Pod certificates and Cluster Trust Bundles {#pod-certificates-and-clustertrustbundles}

[Pod certificates](/docs/reference/access-authn-authz/certificate-signing-requests/#pod-certificate-requests) and the closely related [ClusterTrustBundles](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
both graduate to Stable in Kubernetes v1.37, providing first-class support for distributing private keys, X.509
certificates, and trust bundles to Pods.

To use this, the developer or administrator chooses a signer name and deploys a _signer controller_ that
watches PodCertificateRequest objects, issues and refreshes certificates for eligible Pods, and maintains the corresponding ClusterTrustBundle objects containing the trust anchors needed to verify those certificates.
A workload then opts into this identity by defining a `podCertificate` projected volume with the chosen signer name. Workloads can also mount a ClusterTrustBundle projected volume to load the trust anchor information.
-->
### 稳定（GA）阶段：Pod 证书和 ClusterTrustBundle   {#pod-certificates-and-clustertrustbundles}

[Pod 证书](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#pod-certificate-requests)和与其密切相关的
[ClusterTrustBundle](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
均在 Kubernetes v1.37 中进阶至稳定阶段，
原生支持向 Pod 分发私钥、X.509 证书和信任包。

要使用此功能，开发者或管理员需要选择一个签名者名称，并部署一个**签名者控制器**。
该控制器监视 PodCertificateRequest 对象，为符合条件的 Pod 签发和刷新证书，
并维护包含验证这些证书所需信任锚的对应 ClusterTrustBundle 对象。
随后，工作负载通过定义一个使用所选签名者名称的 `podCertificate` 投射卷，
选择使用这一身份。工作负载还可以挂载 ClusterTrustBundle 投射卷来加载信任锚信息。

<!--
This work was done as part of two KEPs - [KEP #4317](https://www.kubernetes.dev/resources/keps/4317/) and [KEP #3257](https://www.kubernetes.dev/resources/keps/3257/) led by [SIG Auth](https://www.kubernetes.dev/community/community-groups/sigs/auth/).
-->
此项工作由 [SIG Auth](https://www.kubernetes.dev/community/community-groups/sigs/auth/) 牵头，
是两项 KEP 的一部分：[KEP #4317](https://www.kubernetes.dev/resources/keps/4317/) 和
[KEP #3257](https://www.kubernetes.dev/resources/keps/3257/)。

<!--
## Features graduating to Beta
-->
## 进阶至 Beta 阶段的特性   {#features-graduating-to-beta}

<!--
### Gang scheduling support in Kubernetes

As Kubernetes becomes the de facto standard for managing AI/ML workloads at scale, scheduling workloads such as AI/ML training jobs and HPC simulations becomes more important than ever. However, scheduling becomes challenging because the default Kubernetes scheduler schedules Pods individually, which can result in some Pods being scheduled while others remain pending due to insufficient resources. This partial scheduling can lead to deadlocks and inefficient use of cluster resources.

_Gang scheduling_ graduates to Beta in Kubernetes v1.37, improving upon native support for gang scheduling through the  Workload API and PodGroup concept.
This feature implements an _all-or-nothing_ scheduling strategy, ensuring that a defined group of Pods is scheduled only when the cluster has sufficient resources to accommodate the entire group. The Beta graduation of this enhancement also introduces workload-aware preemption to avoid premature preemptions that do not help a workload make progress, along with PodGroup queueing to better coordinate competing workloads.
-->
### Kubernetes 中的编组调度支持   {#gang-scheduling-support-in-kubernetes}

随着 Kubernetes 成为大规模管理 AI/ML 工作负载的事实标准，
调度 AI/ML 训练作业和 HPC 模拟等工作负载变得前所未有地重要。
然而，默认的 Kubernetes 调度器逐个调度 Pod，因而可能出现部分 Pod 已调度、
其他 Pod 因资源不足仍处于待处理状态的情况，这给调度带来了挑战。
这种部分调度可能导致死锁和集群资源利用效率低下。

**编组调度**在 Kubernetes v1.37 中进阶至 Beta 阶段，
通过 Workload API 和 PodGroup 概念改进对编组调度的原生支持。
此特性实现了**全有或全无**的调度策略：
只有当集群拥有足以容纳整个 Pod 组的资源时，才会调度所定义的这一组 Pod。
此项增强进阶至 Beta 的同时还引入了工作负载感知的抢占，
以避免无法帮助工作负载取得进展的过早抢占；
同时引入 PodGroup 排队机制，以更好地协调相互竞争的工作负载。

<!--
Importantly, it addresses livelock scenarios that can occur when multiple workloads are being scheduled simultaneously by the `kube-scheduler`, preventing them from repeatedly interfering with one another without making progress.

This work was done as part of [KEP #4671](https://www.kubernetes.dev/resources/keps/4671/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
更重要的是，它解决了 `kube-scheduler` 同时调度多个工作负载时可能出现的活锁场景，
防止这些工作负载反复相互干扰却始终无法取得进展。

此项工作是 [KEP #4671](https://www.kubernetes.dev/resources/keps/4671/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
### Native histogram support for Kubernetes metrics

Kubernetes exposes hundreds of histogram metrics in [Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/) across its control plane components, which are essential to
monitor cluster health and debug performance issues. However, classical Prometheus histograms relied on static, pre-defined
buckets that forced a compromise between data accuracy and memory usage. To mitigate this, Prometheus introduced _native
histograms_ that use dynamic exponential bucket boundaries instead of fixed boundaries, providing significant storage efficiency,
improved query performance, and finer-grained visibility into distributions while maintaining full backward compatibility
with existing monitoring infrastructure.
-->
### Kubernetes 指标的原生直方图支持   {#native-histogram-support-for-kubernetes-metrics}

Kubernetes 的控制平面组件以 [Prometheus 格式](https://prometheus.io/docs/instrumenting/exposition_formats/)
公开数百项直方图指标，这些指标对于监控集群健康状况和调试性能问题至关重要。
然而，经典 Prometheus 直方图依赖静态的预定义桶，迫使用户在数据精度与内存用量之间作出权衡。
为缓解这一问题，Prometheus 引入了**原生直方图**，
使用动态指数桶边界取代固定边界，在保持与现有监控基础设施完全向后兼容的同时，
显著提高存储效率、改善查询性能，并提供对数据分布更细粒度的可见性。

<!--
Kubernetes v1.37 graduates native histogram support for Kubernetes metrics to Beta. Building on the Alpha implementation,
which introduced the `NativeHistograms` feature gate, the Beta phase improves the implementation and rollout experience. When
enabled, Kubernetes components expose histograms in both classic and native formats when the requested scrape protocol supports Native
Histograms, (specifically `PrometheusProto`), allowing existing dashboards and alerts to continue working while users migrate at
their own pace. The implementation also refactored histograms created in `init()` functions to use lazy initialization,
ensuring native histogram options are correctly applied after feature gates are parsed. These changes provide a more reliable
implementation while retaining safe rollout and rollback through the feature gate or Prometheus-side configuration for
Prometheus 3.x users.

This work was done as part of [KEP #5808](https://www.kubernetes.dev/resources/keps/5808/) led by [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/).
-->
Kubernetes v1.37 将 Kubernetes 指标的原生直方图支持进阶至 Beta 阶段。
Beta 阶段在引入 `NativeHistograms` 特性门控的 Alpha 实现基础上，
改进了实现和上线体验。启用后，如果所请求的抓取协议支持原生直方图
（具体为 `PrometheusProto`），Kubernetes 组件会同时以经典格式和原生格式公开直方图，
使现有仪表板和告警可以继续工作，用户也能按照自己的节奏进行迁移。
此实现还重构了在 `init()` 函数中创建的直方图，改用延迟初始化，
确保解析特性门控后正确应用原生直方图选项。
这些变更提供了更可靠的实现，同时保留了通过特性门控或 Prometheus 端配置进行安全上线和回滚的能力，
方便 Prometheus 3.x 用户使用。

此项工作是 [KEP #5808](https://www.kubernetes.dev/resources/keps/5808/) 的一部分，
由 [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/) 牵头完成。

<!--
### WAS: Features graduating to Beta
-->
### WAS：进阶至 Beta 阶段的特性   {#was-features-graduating-to-beta}

<!--
#### Workload-aware preemption

Kubernetes traditionally performs preemption at the Pod level, which can be inefficient for workloads made up of multiple
tightly coupled Pods. In Kubernetes v1.37, Workload-aware Preemption graduates to Beta, allowing the scheduler to consider a
PodGroup when making preemption decisions. This helps the scheduler consider the workload as a whole when preempting lower
priority workloads, reducing cases where individual Pods are disrupted without providing enough capacity for the workload to
make progress.

This work was done as part of [KEP #5710](https://www.kubernetes.dev/resources/keps/5710/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
#### 工作负载感知的抢占   {#workload-aware-preemption}

Kubernetes 传统上在 Pod 级别执行抢占，
这对于由多个紧密耦合的 Pod 组成的工作负载而言可能效率不高。
在 Kubernetes v1.37 中，工作负载感知的抢占进阶至 Beta 阶段，
允许调度器在作出抢占决策时考虑 PodGroup。
这有助于调度器在抢占低优先级工作负载时将工作负载视为一个整体，
减少个别 Pod 遭到干扰、却未能为工作负载提供足够容量以取得进展的情况。

此项工作是 [KEP #5710](https://www.kubernetes.dev/resources/keps/5710/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
#### DRA: ResourceClaim support for workloads

Dynamic Resource Allocation (DRA) allows Pods to request specialized resources through ResourceClaims. In Kubernetes v1.37,
DRA ResourceClaims support for workloads graduates to Beta, allowing Workload and PodGroup APIs to associate
ResourceClaims and ResourceClaimTemplates with the groups of Pods. This allows ResourceClaims to be shared across a
workload rather than reserved individually for each Pod, while ResourceClaimTemplates can create claims for PodGroups
automatically.

This work was done as part of [KEP #5729](https://www.kubernetes.dev/resources/keps/5729/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
#### DRA：工作负载的 ResourceClaim 支持   {#dra-resourceclaim-support-for-workloads}

动态资源分配（DRA）允许 Pod 通过 ResourceClaim 请求专用资源。
在 Kubernetes v1.37 中，DRA 对工作负载 ResourceClaim 的支持进阶至 Beta 阶段，
允许 Workload 和 PodGroup API 将 ResourceClaim 和 ResourceClaimTemplate 与 Pod 组关联。
这使 ResourceClaim 可以在整个工作负载中共享，
而不必为每个 Pod 单独预留；同时 ResourceClaimTemplate 可以自动为 PodGroup 创建申领。

此项工作是 [KEP #5729](https://www.kubernetes.dev/resources/keps/5729/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
### cAdvisor-less, CRI-full container and Pod stats {#cadvisor-less-cri-full-stats}

The `kubelet` has historically obtained container and Pod statistics from `cAdvisor`, while the Container Runtime
Interface (CRI) exposes statistics of its own. Having two sources for the same metrics makes it harder to tell where a
particular value came from.

In Kubernetes v1.37, the cAdvisor-less, CRI-full Container and Pod Stats enhancement graduates to Beta. The enhancement
expands the CRI to provide the container and pod statistics needed by Kubernetes, allowing the `kubelet` to get these metrics
directly from the container runtime instead of relying on `cAdvisor` for them.
-->
### 不使用 cAdvisor、完全通过 CRI 获取容器和 Pod 统计数据   {#cadvisor-less-cri-full-stats}

以往，`kubelet` 从 `cAdvisor` 获取容器和 Pod 的统计数据，
而容器运行时接口（CRI）也会公开自己的统计数据。
同一指标存在两个来源，导致难以判断某个具体数值来自何处。

在 Kubernetes v1.37 中，
不使用 cAdvisor、完全通过 CRI 获取容器和 Pod 统计数据的增强进阶至 Beta 阶段。
此增强扩展 CRI，以提供 Kubernetes 所需的容器和 Pod 统计数据，
让 `kubelet` 可以直接从容器运行时获取这些指标，而不再依赖 `cAdvisor`。

<!--
This moves container and pod metrics toward a single source of truth, while reducing duplicated metric collection and
simplifying how the `kubelet` gathers and exposes these statistics.

This feature is Beta in v1.37 but **off** by default; enable the `PodAndContainerStatsFromCRI` feature gate to try it.

This work was done as part of [KEP #2371](https://www.kubernetes.dev/resources/keps/2371/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).
-->
这使容器和 Pod 指标逐步统一到单一数据源，
同时减少重复的指标收集，并简化 `kubelet` 收集和公开这些统计数据的方式。

此特性在 v1.37 中处于 Beta 阶段，但默认**关闭**；
若要试用，请启用 `PodAndContainerStatsFromCRI` 特性门控。

此项工作是 [KEP #2371](https://www.kubernetes.dev/resources/keps/2371/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 牵头完成。

<!--
### Support memory QoS with cgroups v2

Kubernetes is improving its quality of service mechanisms to cover memory protection and isolation for Kubernetes workloads. For nodes running Linux, the _memory
QoS_ feature uses memory requests and limits to configure cgroup controls that can protect requested memory from reclamation and throttle memory usage before
workloads reach their hard limits. This can help reduce the impact of memory pressure on memory-sensitive workloads and improve node stability.

In Kubernetes v1.37, memory QoS support is graduating to Beta. The feature uses cgroups v2 memory controls such as `memory.min`,
`memory.low` and `memory.high` to provide different levels of memory protection and throttling. For example, memory requests
can be used to protect memory from reclamation, while `memory.high` can be used to throttle workloads that exceed their
configured threshold.
-->
### 使用 cgroup v2 支持内存 QoS   {#support-memory-qos-with-cgroups-v2}

Kubernetes 正在改进其服务质量机制，以覆盖 Kubernetes 工作负载的内存保护和隔离。
对于运行 Linux 的节点，**内存 QoS** 特性使用内存请求和限制来配置 cgroup 控制，
既能保护所请求的内存不被回收，也能在工作负载达到硬限制之前对内存用量进行节流。
这有助于减轻内存压力对内存敏感型工作负载的影响，并提高节点稳定性。

在 Kubernetes v1.37 中，内存 QoS 支持进阶至 Beta 阶段。
此特性使用 `memory.min`、`memory.low` 和 `memory.high` 等 cgroup v2 内存控制，
提供不同级别的内存保护和节流。例如，可以使用内存请求保护内存不被回收，
而 `memory.high` 可用于对超过所配置阈值的工作负载进行节流。

<!--
The `MemoryQoS` feature gate is enabled by default in v1.37. Cluster operators can control memory protection through the `kubelet`’s
`memoryReservationPolicy` setting and configure memory throttling with `memoryThrottlingFactor`. The defaults are designed to
avoid introducing unexpected memory throttling for existing workloads when upgrading to v1.37, while allowing operators to
opt into the additional memory protection capabilities.

This work was done as part of [KEP #2570](https://www.kubernetes.dev/resources/keps/2570/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).
-->
`MemoryQoS` 特性门控在 v1.37 中默认启用。
集群运维人员可以通过 `kubelet` 的 `memoryReservationPolicy` 设置控制内存保护，
并使用 `memoryThrottlingFactor` 配置内存节流。
这些默认值旨在避免升级到 v1.37 时给现有工作负载带来意外的内存节流，
同时允许运维人员选择使用额外的内存保护能力。

此项工作是 [KEP #2570](https://www.kubernetes.dev/resources/keps/2570/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 牵头完成。

<!--
### Pod-level resource managers

In Kubernetes v1.37, _Pod-level resource managers_ graduate to Beta behind the `PodLevelResourceManagers` feature gate,

which stays **disabled by default**. Enabling it allows the topology, CPU, and memory resource

managers to use the resources defined for an entire Pod when making

allocation and NUMA alignment decisions. This makes it possible to manage a Pod as a single resource unit while still
supporting different resource requirements between the containers within it.
-->
### Pod 级资源管理器   {#pod-level-resource-managers}

在 Kubernetes v1.37 中，**Pod 级资源管理器**在 `PodLevelResourceManagers`
特性门控控制下进阶至 Beta 阶段；该门控仍**默认禁用**。
启用后，拓扑、CPU 和内存资源管理器在作出分配和 NUMA 对齐决策时，
可以使用为整个 Pod 定义的资源。
这样就能将 Pod 作为单个资源单元进行管理，
同时仍支持 Pod 内各容器具有不同的资源需求。

<!--
With pod-level resource management, a Pod can reserve a NUMA-aligned pool of CPU and memory based on its overall resource budget. Containers that require dedicated resources can receive exclusive portions of that pool, while other containers, such as sidecars or supporting workloads, can share the remaining resources. This is particularly useful for performance-sensitive workloads such as AI/ML and high-performance computing, where keeping resources close to each other on the same NUMA node can improve performance without requiring every container in the Pod to have dedicated resources.

The feature also supports a container scope, where containers can continue to receive independent NUMA-aligned allocations. This provides more flexibility for workloads that combine a performance-sensitive container with other containers that have different resource requirements.

This work was done as part of [KEP #5526](https://www.kubernetes.dev/resources/keps/5526/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).
-->
借助 Pod 级资源管理，Pod 可以根据其整体资源预算，
预留一个与 NUMA 对齐的 CPU 和内存池。
需要专用资源的容器可以独占该资源池的一部分，
而其他容器（例如边车或辅助工作负载）可以共享其余资源。
这对于 AI/ML 和高性能计算等性能敏感型工作负载尤其有用：
将相关资源集中分配在同一 NUMA 节点内，可以提高性能，
而无需为 Pod 中的每个容器都分配专用资源。

此特性还支持容器作用域，各容器可以继续获得独立的 NUMA 对齐分配。
对于将性能敏感型容器与其他具有不同资源需求的容器组合在一起的工作负载，
这提供了更大的灵活性。

此项工作是 [KEP #5526](https://www.kubernetes.dev/resources/keps/5526/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 牵头完成。

<!--
### Watch-based route controller reconciliation

The route controller in the cloud-controller-manager library previously reconciled routes on a fixed interval, by default every 10 seconds. This could result in unnecessary requests to infrastructure providers, even when nothing had changed and could also delay route updates when a new Node is added.

Watch-based route controller reconciliation graduated to beta in Kubernetes v1.37. This release also adds observability for this work: the route controller's Alpha `route_sync_total` metric gains two labels, `trigger` (`periodic` or `node_change`) and `outcome` (`changed`, `noop`, or `error`), so operators can see whether periodic reconciliation is actually correcting route drift or just running as a no-op, and can track failed reconciles.
-->
### 基于监视的路由控制器调谐   {#watch-based-route-controller-reconciliation}

以前，cloud-controller-manager 库中的路由控制器按固定时间间隔调谐路由，
默认每 10 秒一次。即使没有任何变化，这也可能导致向基础设施提供商发出不必要的请求；
而且在添加新 Node 时，还可能延迟路由更新。

基于监视的路由控制器调谐在 Kubernetes v1.37 中进阶至 Beta 阶段。
此版本还为这项工作增加了可观测性：
路由控制器的 Alpha 指标 `route_sync_total` 新增了两个标签：
`trigger`（`periodic` 或 `node_change`）和 `outcome`（`changed`、`noop` 或 `error`）。
因此，运维人员可以了解周期性调谐是在实际修正路由漂移，还是仅在执行空操作，
并可以跟踪失败的调谐。

<!--
With watch-based route controller reconciliation the route controller can reconcile routes from watch events instead of waiting for the next fixed interval: a reconciliation can start as soon as relevant Node changes occur, such as a Node being added or removed or when its addresses or assigned Pod CIDRs change. A less frequent periodic reconciliation still runs to catch outdated routes and keep the state consistent. This behavior sits behind the CloudControllerManagerWatchBasedRoutesReconciliation feature gate and is disabled by default, so the transition has not changed default behavior.

This reduces unnecessary requests to infrastructure providers while allowing routes for newly added Nodes to be reconciled sooner. The change does not alter the route reconciliation logic itself; it changes when reconciliation is triggered.

This work was done as part of [KEP #5237](https://www.kubernetes.dev/resources/keps/5237/) led by [SIG Cloud Provider](https://www.kubernetes.dev/community/community-groups/sigs/cloud-provider/).
-->
借助基于监视的路由控制器调谐，路由控制器可以根据监视事件调谐路由，
而不必等待下一个固定时间间隔。
一旦发生相关 Node 变更，例如添加或移除 Node，
或者其地址或分配的 Pod CIDR 发生变化，调谐就可以立即开始。
频率较低的周期性调谐仍会运行，以捕获过时路由并保持状态一致。
此行为受 `CloudControllerManagerWatchBasedRoutesReconciliation` 特性门控控制且默认禁用，
因此这一变化没有改变默认行为。

这既减少了对基础设施提供商的不必要请求，
又允许更快调谐新添加 Node 的路由。
该变更不会改变路由调谐逻辑本身，只会改变触发调谐的时机。

此项工作是 [KEP #5237](https://www.kubernetes.dev/resources/keps/5237/) 的一部分，
由 [SIG Cloud Provider](https://www.kubernetes.dev/community/community-groups/sigs/cloud-provider/) 牵头完成。

<!--
### Storage capacity scoring of Nodes

The `VolumeBinding` scheduler plugin has always been able to score nodes for statically bound PVs based on free capacity, but that scoring never extended to dynamic provisioning.

When a CSI driver provisions a new volume on demand, the scheduler had no way to prefer a node with more or less free space.

This was a gap for local storage, as an admin might want pods landing on the node with the most free capacity to leave room for a later volume expansion or on the node with the least (but still sufficient) free capacity to bin-pack workloads and cut down on the number of nodes a cloud cluster needs to run.
-->
### 根据存储容量为 Node 评分   {#storage-capacity-scoring-of-nodes}

`VolumeBinding` 调度插件一直能够根据可用容量，
针对静态绑定的 PV 为 Node 评分，但这种评分从未扩展到动态制备。

当 CSI 驱动按需制备新卷时，调度器无法优先选择可用空间更多或更少的 Node。

这对本地存储而言是一项能力缺口。
管理员可能希望将 Pod 放置到可用容量最多的 Node 上，为以后扩容卷留出空间；
也可能希望将 Pod 放置到可用容量最少但仍然充足的 Node 上，
对工作负载进行资源装箱，减少云集群运行所需的节点数量。

<!--
Kubernetes v1.37 graduates storage capacity scoring for dynamic provisioning to Beta behind the `StorageCapacityScoring`
feature gate. First introduced in Alpha all the way back in v1.33, and now consolidating (and deprecating) the older
`VolumeCapacityPriority` gate from [KEP #1845](https://www.kubernetes.dev/resources/keps/1845/). When enabled, the
VolumeBinding plugin's `Score` extension point reads `CSIStorageCapacity` objects published by a driver's external
provisioner sidecar and scores nodes for dynamic provisioning the same way it already does for static bindings. Admins choose
the strategy via the `Shape` setting in `VolumeBindingArgs`, defaulting to "prefer the node with the maximum allocatable" so
there's headroom for expansion later.
-->
Kubernetes v1.37 在 `StorageCapacityScoring` 特性门控控制下，
将动态制备的存储容量评分进阶至 Beta 阶段。
该特性早在 v1.33 中首次以 Alpha 形式引入，
现在整合并弃用 [KEP #1845](https://www.kubernetes.dev/resources/keps/1845/)
中较早的 `VolumeCapacityPriority` 门控。
启用后，VolumeBinding 插件的 `Score` 扩展点会读取驱动的外部制备器边车所发布的
`CSIStorageCapacity` 对象，并以已用于静态绑定的相同方式，
针对动态制备为 Node 评分。
管理员通过 `VolumeBindingArgs` 中的 `Shape` 设置选择策略，
默认策略为“优先选择可分配容量最大的 Node”，为以后扩容留出余量。

<!--
The feature depends solely on the `StorageCapacityScoring` gate: scoring for statically
bound PVs runs as soon as it's enabled, independent of any CSI driver. A driver only needs `StorageCapacity: true` on its
`CSIDriver` object so that its dynamically-provisioned volumes also get capacity-aware scoring. The feature is fully
reversible, and disabling the gate stops all VolumeBinding capacity scoring — static and dynamic alike — without affecting
already scheduled pods.

This work was done as part of [KEP #4049](https://www.kubernetes.dev/resources/keps/4049/) led by [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).
-->
此特性仅依赖 `StorageCapacityScoring` 门控：
一旦启用，静态绑定 PV 的评分就会运行，不依赖任何 CSI 驱动。
驱动只需在其 `CSIDriver` 对象上设置 `StorageCapacity: true`，
其动态制备的卷也可获得容量感知评分。
此特性完全可逆；禁用门控会停止所有 VolumeBinding 容量评分，
无论静态还是动态均是如此，并且不会影响已经调度的 Pod。

此项工作是 [KEP #4049](https://www.kubernetes.dev/resources/keps/4049/) 的一部分，
由 [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/) 牵头完成。

<!--
### Integrate CSI volume attach limits with Cluster Autoscaler

Kubernetes v1.37 improves Cluster Autoscaler's integration with CSI volume attach limits, so that when it creates new
nodes for pending Pods, Cluster Autoscaler can more accurately determine how many new nodes are required to attach all
pending Pods that use CSI volumes. Cluster Autoscaler already had visibility into CSI volume attach limits for existing
nodes, but not for the nodes it was about to create, which means it could undershoot scale-ups and leave volume-backed
Pods pending even after adding capacity. The problem compounds on the scheduling side: the `NodeVolumeLimits` plugin treats a node with no published CSI driver info as having no limits at all, so a freshly created node that hasn't yet reported its `CSINode` object can get crowded with more volume-backed pods than it can actually mount, which is a race condition that, until now, cluster admins had no way to close.
-->
### 将 CSI 卷挂接限制与 Cluster Autoscaler 集成   {#integrate-csi-volume-attach-limits-with-cluster-autoscaler}

Kubernetes v1.37 改进了 Cluster Autoscaler 与 CSI 卷挂接限制的集成。
因此，当 Cluster Autoscaler 为待处理的 Pod 创建新 Node 时，
它可以更准确地确定需要多少个新 Node，才能挂接所有使用 CSI 卷的待处理 Pod。
Cluster Autoscaler 已能了解现有 Node 的 CSI 卷挂接限制，
但不了解即将创建的 Node 的限制，这意味着扩容可能不足；
即使添加了容量，使用卷的 Pod 仍可能处于待处理状态。
调度侧会进一步放大这个问题：`NodeVolumeLimits` 插件会将没有已发布 CSI 驱动信息的 Node
视为完全不受限制。因此，尚未报告其 `CSINode` 对象的新建 Node 上，
可能会塞入超出其实际挂载能力的使用卷的 Pod。
这是一个直到现在集群管理员都无法消除的竞态条件。

<!--
Kubernetes v1.37 graduates CSI-aware autoscaling to Beta behind the `VolumeLimitScaling` feature gate, first introduced in Alpha in v1.35. Cluster autoscaler now runs its scale-up simulations against templated `CSINode` objects, so it correctly accounts for attach limits whether it's scaling an existing node group or scaling one from zero. On the scheduler side, admins can opt in per `CSIDriver`, via a new `PreventPodSchedulingIfMissing` field, to block pod placement on nodes that haven't reported their driver yet, with dedicated `CSIDriverMissingOnNode` and `CSINodeMissing` errors making those scheduling failures easier to debug. The Beta phase adds e2e coverage for scale-down behavior and CSI opt-in scenarios, and updates the `failed_scale_ups_total` and `scaled_up_nodes_total` metrics to include CSI driver information. Both the autoscaler and scheduler changes stay strictly opt-in: disabling the feature gate restores today's default of unlimited pod placement on nodes without `CSINode` data, so distros and admins running autoscalers that aren't CSI-aware yet (e.g. Karpenter) aren't forced into the new behavior.

This work was done as part of [KEP #5030](https://www.kubernetes.dev/resources/keps/5030/) led by [SIG Autoscaling](https://www.kubernetes.dev/community/community-groups/sigs/autoscaling/).
-->
Kubernetes v1.37 在 `VolumeLimitScaling` 特性门控控制下，
将 CSI 感知的自动扩缩容进阶至 Beta 阶段；该特性最初在 v1.35 中以 Alpha 形式引入。
Cluster Autoscaler 现在使用模板化的 `CSINode` 对象运行扩容模拟，
因此无论是在扩展现有节点组还是将节点组从零开始扩展，都能正确计入挂接限制。
在调度器一侧，管理员可以通过新的 `PreventPodSchedulingIfMissing` 字段，
按 `CSIDriver` 选择启用：阻止将 Pod 放置到尚未报告其驱动的 Node 上。
专用的 `CSIDriverMissingOnNode` 和 `CSINodeMissing` 错误也让这类调度失败更易调试。
Beta 阶段增加了缩容行为和 CSI 选择启用场景的端到端测试覆盖，
并更新 `failed_scale_ups_total` 和 `scaled_up_nodes_total` 指标，
使其包含 CSI 驱动信息。
自动扩缩器和调度器的变更都严格保持为选择启用：
禁用特性门控会恢复当前的默认行为，即在没有 `CSINode` 数据的 Node 上不限制 Pod 放置；
因此，运行尚未感知 CSI 的自动扩缩器（例如 Karpenter）的发行版和管理员，
不会被迫采用新行为。

此项工作是 [KEP #5030](https://www.kubernetes.dev/resources/keps/5030/) 的一部分，
由 [SIG Autoscaling](https://www.kubernetes.dev/community/community-groups/sigs/autoscaling/) 牵头完成。

<!--
### Report last used time on a PVC

`PersistentVolumeClaims` tend to outlive the workloads that created them. When an app gets deleted or migrated, and its PVC just sits there, consuming storage and increasing costs. Today Kubernetes gives cluster admins no way to tell how long a PVC has been sitting idle; the `kubelet` is the only component that really knows when a volume was last mounted, but nothing surfaces that information at the API level, so admins are left guessing which PVCs are actually safe to clean up.
-->
### 报告 PVC 的最后使用时间   {#report-last-used-time-on-a-pvc}

`PersistentVolumeClaim` 往往比创建它的工作负载存续得更久。
应用被删除或迁移后，其 PVC 可能一直留在那里，占用存储并增加成本。
目前，Kubernetes 无法让集群管理员判断 PVC 已空闲多长时间；
`kubelet` 是唯一真正知道卷最后挂载时间的组件，
但 API 层并未公开这些信息，因此管理员只能猜测哪些 PVC 确实可以安全清理。

<!--
Kubernetes v1.37 graduates PVC "last used" tracking to Beta behind the `PersistentVolumeClaimUnusedSinceTime` feature gate, which shipped disabled by default in Alpha (v1.36) and is now enabled by default in Beta. The feature adds a new `Unused` condition to `PersistentVolumeClaimStatus`, managed by the existing PVC protection controller: `Status=True (Reason=NoPodsUsingPVC)` once the last non-terminal Pod referencing the PVC goes away, and back to `Status=False (Reason=PodUsingPVC)` as soon as a Pod starts referencing it again. The condition's `lastTransitionTime` doubles as an "unused since" timestamp, so admins can query how long a PVC has actually been idle without Kubernetes tracking which Pod used it last or making any deletion decision itself; that's left entirely to the admin. One thing worth noting is that the timestamp reflects when the controller observed no Pods using the PVC, not the exact moment the volume unmounted at the infrastructure level, so the reported idle time may run a little short of the true figure but should never overstate it.

This work was done as part of [KEP #5541](https://www.kubernetes.dev/resources/keps/5541/) led by [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).
-->
Kubernetes v1.37 在 `PersistentVolumeClaimUnusedSinceTime` 特性门控控制下，
将 PVC“最后使用时间”跟踪进阶至 Beta 阶段。
该特性在 Alpha（v1.36）阶段默认禁用，现在进入 Beta 后默认启用。
此特性在 `PersistentVolumeClaimStatus` 中新增由现有 PVC 保护控制器管理的 `Unused` 状况：
当最后一个引用该 PVC 的非终止态 Pod 消失后，状况变为
`Status=True (Reason=NoPodsUsingPVC)`；
一旦又有 Pod 开始引用该 PVC，状况便恢复为
`Status=False (Reason=PodUsingPVC)`。
该状况的 `lastTransitionTime` 同时充当“从何时起未使用”的时间戳，
因此管理员可以查询 PVC 实际空闲了多长时间；
Kubernetes 无需跟踪最后使用它的是哪个 Pod，也不会自行作出任何删除决定，
删除完全由管理员决定。
值得注意的是，该时间戳反映控制器观测到没有 Pod 使用 PVC 的时间，
而不是卷在基础设施层面卸载的确切时刻。
因此，报告的空闲时间可能略短于实际值，但不应夸大实际空闲时间。

此项工作是 [KEP #5541](https://www.kubernetes.dev/resources/keps/5541/) 的一部分，
由 [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/) 牵头完成。

<!--
### etcd RangeStream support

`etcd`'s unary `Range` RPC builds an entire response in memory before sending it back, which becomes a problem at scale. On a large list, say kube-apiserver's watch cache warming up on a big cluster, the raw key-value slice, its serialized protobuf form, and the gRPC send buffer all have to coexist in memory at once, and the resulting spikes ripple through kube-apiserver too. Pagination doesn't really fix the underlying cost either because each paginated page still walks the entire B-tree index to recompute the total result count, turning what should be an `O(limit)` operation into an `O(total_keys)` one on every single page.
-->
### etcd RangeStream 支持   {#etcd-rangestream-support}

`etcd` 的一元 `Range` RPC 会先在内存中构建完整响应，再将其发回；
这种方式在大规模环境中会成为问题。
以大型集群中 kube-apiserver 的监视缓存预热所需的大型列表为例：
原始键值切片、序列化后的 protobuf 形式以及 gRPC 发送缓冲区
必须同时存在于内存中，由此产生的内存峰值也会波及 kube-apiserver。
分页也无法真正消除底层开销，因为每一页仍需遍历整个 B 树索引，
重新计算结果总数，使本应为 `O(limit)` 的操作在每一页都变成 `O(total_keys)`。

<!--
Kubernetes v1.37 ships `etcd` `RangeStream` support directly at Beta, behind the `EtcdRangeStream` feature gate (`kube-apiserver` only, **on** by default).
This release adds a new server-streaming `RangeStream` RPC that reuses the existing `RangeRequest` but returns chunks instead of one buffered blob: the server paginates internally with adaptive chunk sizing (each chunk's target size adjusts based on `MaxRequestBytes` and the value sizes observed so far), pins a single MVCC revision so the merged stream stays snapshot-consistent, and derives the total key count from the running tally it builds while streaming, rather than a separate index walk.
`kube-apiserver`'s watch cache initialization is the primary consumer, and it now decodes each chunk into synthetic _created_ events inline as they arrive instead of assembling the full list in memory first, with the same treatment applied to direct `GetList` calls when `WatchList` is disabled.
-->
Kubernetes v1.37 直接以 Beta 形式发布 `etcd` `RangeStream` 支持，
受 `EtcdRangeStream` 特性门控控制（仅用于 `kube-apiserver`，**默认开启**）。
此版本新增服务器流式 `RangeStream` RPC，复用现有 `RangeRequest`，
但返回多个数据块，而不是一个缓冲后的大块数据。
服务器在内部使用自适应数据块大小进行分页：
每个数据块的目标大小会根据 `MaxRequestBytes` 和目前观测到的值大小进行调整；
它固定使用同一个 MVCC 修订版本，使合并后的流保持快照一致性；
并根据流式传输期间不断累加的计数得出键总数，而不是另行遍历索引。
`kube-apiserver` 的监视缓存初始化是主要使用方，
现在会在每个数据块到达时就地将其解码为合成的**创建**事件，
而不是先在内存中组装完整列表。
当禁用 `WatchList` 时，直接 `GetList` 调用也采用相同处理方式。

<!--
The feature requires `etcd` 3.7+; against older `etcd`, `kube-apiserver` detects the Unimplemented response and falls back to unary `Range` automatically, with zero behavior change. If the pinned revision gets compacted mid-stream, `kube-apiserver` treats it the same as any other watch cache init failure and retries, which is no worse than the compaction races a paginated List call can already hit today. Beta graduation criteria include a scalability test measuring large-list latency on a 5000-node cluster, and `etcdctl get --stream` ships alongside it for anyone who wants to poke at the new RPC directly.

This work was done as part of [KEP #5966](https://www.kubernetes.dev/resources/keps/5966/) led by [SIG etcd](https://www.kubernetes.dev/community/community-groups/sigs/etcd/).
-->
此特性要求使用 `etcd` 3.7 或更高版本；
面对旧版 `etcd` 时，`kube-apiserver` 会检测到 Unimplemented 响应，
并自动回退到一元 `Range`，行为不会发生变化。
如果固定的修订版本在流式传输过程中被压缩，
`kube-apiserver` 会将其视为与其他监视缓存初始化失败相同的情况并重试；
这并不比当前分页 List 调用已经可能遇到的压缩竞态更糟。
Beta 进阶标准包括一项可扩缩性测试，用于测量 5000 节点集群上的大型列表延迟；
同时还提供 `etcdctl get --stream`，方便希望直接试用新 RPC 的用户。

此项工作是 [KEP #5966](https://www.kubernetes.dev/resources/keps/5966/) 的一部分，
由 [SIG etcd](https://www.kubernetes.dev/community/community-groups/sigs/etcd/) 牵头完成。

<!--
### Concurrent watch object decode

`kube-apiserver` decodes and transforms every watch event from `etcd` one at a time on a single goroutine, so one slow per-event transform, most notably a CRD conversion webhook call, blocks every event queued behind it. That's mostly a nuisance for built-in resources, but for a CRD whose served version differs from its stored version, converting a cold cache serially can take minutes. If that exceeds `etcd`'s default 5-minute compaction interval, the revision the cache started reading from gets compacted before initialization finishes, the watch can't resume, and init just restarts and never converges for a large enough resource, with every client trying to list or watch it getting errors in the meantime.
-->
### 并发解码监视对象   {#concurrent-watch-object-decode}

`kube-apiserver` 在单个 goroutine 上逐一解码和转换来自 `etcd` 的每个监视事件，
因此，只要单个事件的转换较慢——最典型的是 CRD 转换 Webhook 调用——
就会阻塞其后排队的所有事件。
对内置资源而言，这通常只是带来不便；
但对于所提供版本与存储版本不同的 CRD，串行转换冷缓存可能耗时数分钟。
如果耗时超过 `etcd` 默认的 5 分钟压缩间隔，
缓存开始读取时使用的修订版本，可能在初始化完成前被 etcd 压缩，
监视无法恢复，初始化只会重新开始；
对于足够大的资源，初始化将永远无法收敛，
期间所有尝试列举或监视该资源的客户端都会收到错误。

<!--
The `ConcurrentWatchObjectDecode` gate has actually been in Beta, off by default, since v1.31, and Kubernetes v1.37 flips it on by default. Enabling it moves the decode/transform step onto a bounded pool of worker goroutines (10 by default, tuned from a sweep that showed gains flattening out around 8–12) instead of a single one, with a collector reassembling events back into their original order before delivery, so event ordering is preserved exactly. In benchmarks over 150k pods, concurrent decode alone cuts cache initialization about 40%, and about 55% combined with the new `EtcdRangeStream` feature also landing this release (see KEP 5966). The main tradeoff to watch is conversion webhook load. With the feature on, up to 10 conversions can now run concurrently against a webhook during cache init instead of one at a time. The total call volume is unchanged, only how many run at once, so this mainly matters for webhooks that cap their own concurrency below 10.

This work was done as part of [KEP #6178](https://www.kubernetes.dev/resources/keps/6178/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).
-->
`ConcurrentWatchObjectDecode` 门控其实从 v1.31 起就已处于 Beta 阶段，
但默认关闭；Kubernetes v1.37 将其改为默认开启。
启用后，解码和转换步骤将不再由单个 goroutine 处理，
而是移至有界的工作 goroutine 池（默认 10 个；调优测试显示，收益在 8 到 12 个左右趋于平缓）。
收集器会在交付前将事件重新组装为原始顺序，因此事件顺序得到严格保留。
在超过 15 万个 Pod 的基准测试中，仅并发解码一项就将缓存初始化时间缩短约 40%；
与此版本同时引入的新 `EtcdRangeStream` 特性结合使用时（参见 KEP 5966），
缩短幅度约为 55%。
需要关注的主要权衡是转换 Webhook 的负载。
启用此特性后，缓存初始化期间最多可有 10 个转换同时针对同一 Webhook 运行，
而不再是一次一个。调用总量没有变化，变化的只是同时运行的数量，
因此这主要影响将自身并发上限设为低于 10 的 Webhook。

此项工作是 [KEP #6178](https://www.kubernetes.dev/resources/keps/6178/) 的一部分，
由 [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/) 牵头完成。

<!--
### Stale controller mitigation {#stale-controller-mitigation}

Every controller in `kube-controller-manager` works off a local cache built from watching the `kube-apiserver`, and that watch
stream is only eventually consistent. A change can show up in milliseconds, or it can take seconds or even minutes under
load. Today operators have no visibility into that lag and no way to tell a normal delay from a controller that's fallen
dangerously out of sync, so a controller can keep reconciling against a view of the world that's already stale.
-->
### 缓解控制器状态陈旧问题   {#stale-controller-mitigation}

`kube-controller-manager` 中的每个控制器都基于监视 `kube-apiserver` 所构建的本地缓存工作，
而该监视流仅具备最终一致性。
一项变更可能在数毫秒内出现，也可能在有负载时耗费数秒甚至数分钟。
目前，运维人员看不到这种延迟，也无法区分正常延迟与控制器已严重失去同步的情况；
因此，控制器可能持续基于已经陈旧的集群视图执行调谐。

<!--
Stale controller mitigation has been Beta since v1.36, enabled by default per controller behind a `StaleControllerConsistency<Controller>`
feature gate; Kubernetes v1.37 extends it to the HorizontalPodAutoscaler controller and adds the circuit-breaking variant and
extra metrics described below. The core mechanism
is a _read your writes_ guarantee: client-go's `ResourceEventHandlerFuncs` gets a new `BookmarkFunc` callback so a controller
can reliably track the resource version of objects it cares about, even through edge cases the existing add/update/delete
callbacks miss. A controller records the resource version of its own writes and, on its next reconcile, skips and requeues
until its informer cache has actually caught up to that write. The DaemonSet controller is a good example of this. It tracks
DaemonSet → Pod resource versions so it won't re-reconcile against its own stale pod cache. A second, circuit-breaking
variant targets latency-sensitive controllers like node-lifecycle, which can otherwise read a stale node lease from cache and
wrongly decide it's expired; instead, it does a live GET on the disruptive decision and marks its cache "not ready" until
it's caught up, rather than acting on a stale read. `StaleControllerConsistency` gates the mitigation itself (scoped
-->
缓解控制器状态陈旧问题的特性从 v1.36 起处于 Beta 阶段，
由每个控制器对应的 `StaleControllerConsistency<Controller>` 特性门控控制并默认启用。
Kubernetes v1.37 将其扩展到 HorizontalPodAutoscaler 控制器，
并添加下述熔断机制和额外指标。
其核心机制是**读己之写**保证：
client-go 的 `ResourceEventHandlerFuncs` 新增 `BookmarkFunc` 回调，
即使遇到现有添加、更新和删除回调所遗漏的边缘情况，
控制器也能可靠跟踪其所关注对象的资源版本。
控制器会记录自身写入的资源版本，并在下一次调谐时跳过处理并重新入队，
直至其 informer 缓存真正赶上这次写入。
DaemonSet 控制器就是一个很好的例子：
它会跟踪 DaemonSet → Pod 的资源版本，
从而避免基于自身陈旧的 Pod 缓存再次调谐。
第二种熔断机制面向 node-lifecycle 等延迟敏感型控制器；
否则，这些控制器可能从缓存读取陈旧的节点租约，并错误地判定其已过期。
新机制会在作出破坏性决策前执行实时 GET，
并将缓存标记为“未就绪”直至其追上最新状态，而不是根据陈旧读取采取行动。

<!--
initially to controllers KCM has flagged as high-scale), `MonitorInformerStaleness` is a separate, observation-only gate that
polls the apiserver directly every 5 seconds purely to surface how far behind an informer's cache actually is, and
`AtomicFIFO` / `UnlockWhileProcessingFIFO` are the underlying client-go workqueue plumbing the mitigation depends on. None of
this changes default reconciler behavior; a paused-and-requeued controller can look stuck when it's really just waiting on
its cache, and it rolls back cleanly since nothing it does is irreversible.

This work was done as part of [KEP #5647](https://www.kubernetes.dev/resources/keps/5647) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).
-->
`StaleControllerConsistency` 控制缓解机制本身
（最初作用于 KCM 标记为大规模使用的控制器）；
`MonitorInformerStaleness` 是一个单独的、仅用于观测的门控，
每 5 秒直接轮询 API 服务器，专门用于显示 informer 缓存实际落后了多少；
`AtomicFIFO` 和 `UnlockWhileProcessingFIFO` 则是该缓解机制所依赖的底层 client-go 工作队列机制。
这些都不会改变调谐器的默认行为。
暂停并重新入队的控制器看起来可能像是卡住了，
实际上只是在等待其缓存追上；由于等待期间不会执行不可逆操作，因此可以安全回退。

此项工作是 [KEP #5647](https://www.kubernetes.dev/resources/keps/5647) 的一部分，
由 [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/) 牵头完成。

<!--
### Manifest-based admission control config

In Kubernetes, admission control is responsible for enforcing policies on resources before they are accepted by the API
server. However, admission webhooks and policies configured through the Kubernetes API are dependent on the API server and
etcd during cluster startup and cannot protect the admission configuration resources themselves. This creates a gap during
cluster bootstrap and allows critical admission policies to be modified or removed by users with sufficient privileged access.

In Kubernetes v1.37, [manifest-based admission control](/docs/reference/access-authn-authz/manifest-admission-control/) configuration graduates to Beta, allowing admission webhooks and CEL-based

policies to be loaded from manifest files on disk and enforced from API server startup. Because the configuration is managed
independently of the Kubernetes API, it can also protect API-based admission resources from modification. Manifest files are
watched for changes and valid updates are reloaded automatically, while invalid updates leave the previously loaded
configuration in place.
-->
### 基于清单的准入控制配置   {#manifest-based-admission-control-config}

在 Kubernetes 中，准入控制负责在 API 服务器接受资源之前对其执行策略。
然而，通过 Kubernetes API 配置的准入 Webhook 和策略在集群启动期间依赖 API 服务器和 etcd，
并且无法保护准入配置资源自身。
这会在集群引导期间形成缺口，
使拥有足够特权访问权限的用户可以修改或移除关键准入策略。

在 Kubernetes v1.37 中，
[基于清单的准入控制](/zh-cn/docs/reference/access-authn-authz/manifest-admission-control/)配置进阶至 Beta 阶段，
允许从磁盘上的清单文件加载准入 Webhook 和基于 CEL 的策略，
并从 API 服务器启动时起强制执行这些策略。
由于配置独立于 Kubernetes API 进行管理，
它还可以保护基于 API 的准入资源免遭修改。
系统会监视清单文件的变化并自动重新加载有效更新；
如果更新无效，则继续使用先前加载的配置。

<!--
This work was done as part of [KEP #5793](https://www.kubernetes.dev/resources/keps/5793/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/)
-->
此项工作是 [KEP #5793](https://www.kubernetes.dev/resources/keps/5793/) 的一部分，
由 [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/) 牵头完成。

<!--
### Improved handling for undecryptable resources

Kubernetes stores resources in etcd, where encryption at rest can be used to protect sensitive data. However, when encrypted
resources can no longer be decrypted, for example because the encryption key is unavailable, the API server cannot read or
manage those resources normally. This can leave resources in the cluster that cannot be accessed through the Kubernetes API,
requiring administrators to manually modify the underlying etcd data to recover them.

Kubernetes v1.37 includes Beta support for cluster administrators to identify and remove resources that cannot be decrypted by the API server.
-->
### 改进无法解密资源的处理方式   {#improved-handling-for-undecryptable-resources}

Kubernetes 将资源存储在 etcd 中，并可使用静态数据加密保护敏感数据。
然而，如果加密资源不再能够解密，例如加密密钥不可用，
API 服务器就无法正常读取或管理这些资源。
这可能导致集群中留有无法通过 Kubernetes API 访问的资源，
管理员必须手动修改底层 etcd 数据才能将其恢复。

Kubernetes v1.37 提供 Beta 支持，
使集群管理员可以识别并移除 API 服务器无法解密的资源。

<!--
Previously Alpha, and introduced in Kubernetes v1.32, this support allows problem API resources to be removed via

the Kubernetes API rather than directly manipulating the etcd file. This feature also provides safeguards for administrators
to verify affected resources before deletion.

This work was done as part of [KEP #3926](https://www.kubernetes.dev/resources/keps/3926/) led by [SIG Auth](https://www.kubernetes.dev/community/community-groups/sigs/auth/).
-->
此项支持在 Kubernetes v1.32 中引入，此前处于 Alpha 阶段。
它允许通过 Kubernetes API 移除有问题的 API 资源，
而不是直接操作 etcd 文件。
此特性还提供安全措施，供管理员在删除前核实受影响的资源。

此项工作是 [KEP #3926](https://www.kubernetes.dev/resources/keps/3926/) 的一部分，
由 [SIG Auth](https://www.kubernetes.dev/community/community-groups/sigs/auth/) 牵头完成。

<!--
## New features in Alpha
-->
## Alpha 阶段的新特性   {#new-features-in-alpha}

<!--
### New `Recreate` strategy for StatefulSet rollouts

Kubernetes v1.37 introduces the `Recreate` strategy for StatefulSet rollouts. The StatefulSet API previously only offered two update
strategies: OnDelete (manual) and RollingUpdate (automatic, default). Similar to Deployments, the `Recreate` update strategy
deletes all of the StatefulSet's Pods before creating new Pods that reflect modifications made to a StatefulSet's
`.spec.template`. Using this strategy requires the `StatefulSetRecreateStrategy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#StatefulSetRecreateStrategy) to be enabled.

This work was done as part of [KEP #3541](https://www.kubernetes.dev/resources/keps/3541/) led by [SIG Apps](https://www.kubernetes.dev/community/community-groups/sigs/apps/).
-->
### 为 StatefulSet 上线引入了 `Recreate` 策略   {#new-recreate-strategy-for-statefulset-rollouts}

Kubernetes v1.37 为 StatefulSet 上线引入了 `Recreate` 策略。
此前，StatefulSet API 仅提供两种更新策略：OnDelete（手动）和 RollingUpdate（自动、默认）。
与 Deployment 类似，`Recreate` 更新策略会先删除 StatefulSet 的所有 Pod，
再创建反映 StatefulSet `.spec.template` 变更的新 Pod。
使用此策略需要启用 `StatefulSetRecreateStrategy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#StatefulSetRecreateStrategy)。

此项工作是 [KEP #3541](https://www.kubernetes.dev/resources/keps/3541/) 的一部分，
由 [SIG Apps](https://www.kubernetes.dev/community/community-groups/sigs/apps/) 牵头完成。

<!--
### DRA: Alpha features to look out for
-->
### DRA：值得关注的 Alpha 特性   {#dra-alpha-features-to-look-out-for}

<!--
#### DRA: Node allocatable resource request

Kubernetes v1.37 improves Alpha support for managing node resources such as CPU, memory, and huge pages through DRA. It
unifies standard and DRA resource accounting, helping prevent the same node capacity from being counted twice.

This update introduces distinct API fields for `mapping` (for devices directly modeling core resources, like CPU/memory DRA drivers) and `overhead` (like auxiliary host memory for accelerator devices). The kubelet now enforces these allocations across pod and container cgroups, integrates them with Memory QoS, OOM score calculations, and in-place pod resizing.
-->
#### DRA：Node 可分配资源请求   {#dra-node-allocatable-resource-request}

Kubernetes v1.37 改进了通过 DRA 管理 CPU、内存和巨页等节点资源的 Alpha 支持。
它统一了标准资源和 DRA 资源的计量方式，有助于防止同一份节点容量被重复计算。

此更新为 `mapping`（用于直接对核心资源建模的设备，例如 CPU/内存 DRA 驱动）
和 `overhead`（例如加速器设备所需的辅助主机内存）引入了不同的 API 字段。
kubelet 现在会在 Pod 和容器 cgroup 中强制实施这些分配，
并将其与内存 QoS、OOM 分数计算和 Pod 原地调整大小集成。

<!--
This work was done as part of [KEP #5517](https://www.kubernetes.dev/resources/keps/5517/),
led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) with participation from [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).
-->
此项工作是 [KEP #5517](https://www.kubernetes.dev/resources/keps/5517/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头，
[SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 参与完成。

<!--
#### DRA: derived attributes

Kubernetes v1.37 introduces Alpha support for [derived attributes in DRA](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#derived-attributes). Workloads can use CEL expressions to create virtual
attributes from device information and use them when selecting related devices.

This makes it easier to co-locate devices such as GPUs and network interfaces, even when their drivers use different
attribute names or formats. For example, a workload can derive a shared NUMA identifier and use it to select devices with
matching topology.
-->
#### DRA：派生属性   {#dra-derived-attributes}

Kubernetes v1.37 为 [DRA 中的派生属性](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#derived-attributes)
引入 Alpha 支持。工作负载可以使用 CEL 表达式根据设备信息创建虚拟属性，
并在选择相关设备时使用这些属性。

即使 GPU、网络接口等设备的驱动使用不同的属性名称或格式，
此功能也能让这些设备更容易共置。
例如，工作负载可以派生出共享的 NUMA 标识符，
并使用它选择拓扑匹配的设备。

<!--
This work was done as part of [KEP #6080](https://www.kubernetes.dev/resources/keps/6080/), led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) with participation from [SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/).
-->
此项工作是 [KEP #6080](https://www.kubernetes.dev/resources/keps/6080/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头，
[SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/) 参与完成。

<!--
#### DRA: device compatibility groups {#dra-device-compatibility-groups}

DRA can be used to manage devices that support different partitioning or virtualization schemes. However, some of these
configurations cannot be used together on the same physical device, such as MIG and vGPU on a GPU. Previously, these
incompatibilities could only be detected during device preparation, after the scheduler had already made its decision.

In Kubernetes v1.37, DRA  adds device compatibility groups, allowing resource drivers to describe which devices can be
allocated together. The scheduler can use this information when making allocation decisions, preventing incomplete devices
from being assigned together and avoiding Pod startup failures caused by incomplete device configurations.
-->
#### DRA：设备兼容性组   {#dra-device-compatibility-groups}

DRA 可用于管理支持不同分区或虚拟化方案的设备。
然而，某些配置无法在同一物理设备上同时使用，
例如 GPU 上的 MIG 和 vGPU。
以前，只有在调度器已经作出决策后的设备准备阶段，才能发现这些不兼容情况。

在 Kubernetes v1.37 中，DRA 新增设备兼容性组，
允许资源驱动描述哪些设备可以一起分配。
调度器可以在作出分配决策时使用这些信息，
防止将不兼容的设备一起分配，
并避免设备配置不兼容所导致的 Pod 启动失败。

<!--
This work was done as part of [KEP #5963](https://www.kubernetes.dev/resources/keps/5963/), led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
此项工作是 [KEP #5963](https://www.kubernetes.dev/resources/keps/5963/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
### Scheduler preemption for in-place Pod resize {#scheduler-preemption-in-place-pod-resize}

Kubernetes v1.37 introduces _scheduler preemption for in-place pod resize_, behind  the (opt-in, Alpha) `InPlacePodVerticalScalingSchedulerPreemption` feature gate. This change addresses an important feature gap that remained after the core [pn-place Pod vertical scaling](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize-inplace) feature graduated to Stable: if a running pod requested additional resources that exceeded the node's available capacity, `kubelet` marked the
request as `Deferred`, leaving the pod waiting until sufficient resources became available on the node. With this
enhancement, the Kubernetes control plane can actively free up capacity on a fully-utilized node and preempt lower-priority
workloads, enabling the pending in-place resizes of critical, higher-priority applications to succeed.

This work was done as part of [KEP #5836](https://www.kubernetes.dev/resources/keps/5836/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
### Pod 原地调整大小的调度器抢占   {#scheduler-preemption-in-place-pod-resize}

Kubernetes v1.37 引入了**Pod 原地调整大小的调度器抢占**，
受选择启用的 Alpha 特性门控 `InPlacePodVerticalScalingSchedulerPreemption` 控制。
此变更补齐了核心
[Pod 原地纵向扩缩](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize-inplace)
特性进阶至稳定阶段后仍存在的一项重要能力缺口：
如果运行中的 Pod 请求额外资源，且请求量超过 Node 的可用容量，
`kubelet` 会将该请求标记为 `Deferred`，
使 Pod 一直等待，直至 Node 上有足够的资源可用。
借助此项增强，Kubernetes 控制平面可以主动在资源已饱和的 Node 上腾出容量，
并抢占优先级较低的工作负载，
从而让关键的高优先级应用所等待的原地调整大小操作得以成功。

此项工作是 [KEP #5836](https://www.kubernetes.dev/resources/keps/5836/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
### Dynamic resize of memory-backed volumes

Also building upon in-place Pod vertical scaling, the Alpha _in-place scaling for memory backed volumes_ feature extends the pod

`/resize` subresource, which previously only enabled dynamic CPU and memory adjustments without restarting containers, to
support updating the `sizeLimit` of memory-backed (medium: Memory) `emptyDir` volumes on running pods. When a volume's `sizeLimit`
is explicitly adjusted via the /resize subresource, Kubelet dynamically updates the underlying tmpfs mount without container
disruption while safely preventing out-of-memory errors or false-positive eviction triggers. This is particularly useful for
stateful and memory-intensive workloads that rely on in-memory ephemeral storage, allowing them to dynamically scale storage
limits alongside container memory capacity without incurring Pod restarts or application downtime.
-->
### 动态调整内存支持卷的大小   {#dynamic-resize-of-memory-backed-volumes}

Alpha 阶段的**内存支持卷原地扩缩**特性同样建立在 Pod 原地纵向扩缩的基础上。
它扩展了 Pod 的 `/resize` 子资源：
该子资源此前仅支持在不重启容器的情况下动态调整 CPU 和内存，
现在还支持更新运行中 Pod 上由内存支持（`medium: Memory`）的 `emptyDir` 卷的 `sizeLimit`。
通过 `/resize` 子资源显式调整卷的 `sizeLimit` 时，
kubelet 在不中断容器的情况下更新底层 tmpfs 挂载，并避免 OOM 或误触发驱逐。
这对于依赖内存中临时存储的有状态和内存密集型工作负载尤其有用：
它们可以随容器内存容量一起动态扩缩存储限制，
而无需重启 Pod，也不会导致应用停机。

<!--
This is an opt-in, off-by-default Alpha feature. To try it out, enable the

`InPlacePodVerticalScalingMemoryBackedVolumes` feature gate.

This work was done as part of [KEP #6030](https://www.kubernetes.dev/resources/keps/6030/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) and [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).
-->
这是一个选择启用且默认关闭的 Alpha 特性。
若要试用，请启用 `InPlacePodVerticalScalingMemoryBackedVolumes` 特性门控。

此项工作是 [KEP #6030](https://www.kubernetes.dev/resources/keps/6030/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 和
[SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/) 牵头完成。

<!--
### Specialized lifecycle management for Nodes

Several Kubernetes components need to understand a Node's lifecycle state, and today each one infers it from a different mix
of Node readiness, taints, Pod state, labels, annotations, and provider APIs. This enhancement introduces well-known
lifecycle conditions on Nodes, giving administrators a single Kubernetes-owned place to publish lifecycle state that core
controllers and ecosystem tooling can consume. These new Node Conditions are: `DrainInProgress`, `Drained`, `MaintenancePlanned`, `MaintenanceInProgress`, and `GracefulNodeShutdownInProgress`

This work was done as part of [KEP #5683](https://www.kubernetes.dev/resources/keps/5683/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).
-->
### Node 的专用生命周期管理   {#specialized-lifecycle-management-for-nodes}

多个 Kubernetes 组件都需要了解 Node 的生命周期状态，
目前各组件分别根据 Node 就绪状态、污点、Pod 状态、标签、注解和提供商 API 的不同组合来推断。
此项增强在 Node 上引入了众所周知的生命周期状况，
为管理员提供一个由 Kubernetes 管理的统一位置，
用于发布可供核心控制器和生态系统工具使用的生命周期状态。
这些新的 Node 状况包括：`DrainInProgress`、`Drained`、`MaintenancePlanned`、
`MaintenanceInProgress` 和 `GracefulNodeShutdownInProgress`。

此项工作是 [KEP #5683](https://www.kubernetes.dev/resources/keps/5683/) 的一部分，
由 [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) 牵头完成。

<!--
### WAS: Alpha features to look out for
-->
### WAS：值得关注的 Alpha 特性   {#was-alpha-features-to-look-out-for}

<!--
#### CompositePodGroup API

While previous releases introduced support for gang scheduling of workloads with
a flat structure, modern AI/ML workloads are complex and have more sophisticated
scheduling requirements. In Kubernetes v1.37, the new Alpha `CompositePodGroup`
API allows Kubernetes to describe complex workloads as a hierarchy of groups
instead of a flat set of Pods. This enables multi-level gang scheduling,
workload-aware preemption and topology-aware scheduling.

This work was done as part of [KEP #6012](https://www.kubernetes.dev/resources/keps/6012/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/)
-->
#### CompositePodGroup API

虽然先前版本已为扁平结构的工作负载引入编组调度支持，
但现代 AI/ML 工作负载十分复杂，具有更精细的调度要求。
在 Kubernetes v1.37 中，新的 Alpha `CompositePodGroup` API
允许 Kubernetes 将复杂工作负载描述为多组构成的层次结构，
而不是扁平的 Pod 集合。
这使多级编组调度、工作负载感知的抢占和拓扑感知调度成为可能。

此项工作是 [KEP #6012](https://www.kubernetes.dev/resources/keps/6012/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
#### Workload Aware Scheduling Controller APIs

As an Alpha feature Kubernetes v1.37 provides common framework for integrating workload controllers (such as JobSet, TrainJob, LWS, and RayJob, along with core workloads such as `Job`) with _Workload-aware Scheduling_ (WAS).

The framework provides reusable `scheduling.k8s.io` API primitives, such as _topology constraints_ and _disruption policies_,
along with shared libraries that handle the creation of scheduling resources. This allows controllers to expose WAS features
natively within their APIs in a consistent way without implementing the same scheduling logic separately.
-->
#### 工作负载感知调度控制器 API   {#workload-aware-scheduling-controller-apis}

作为一项 Alpha 特性，Kubernetes v1.37 提供了一个通用框架，
用于将工作负载控制器（例如 JobSet、TrainJob、LWS 和 RayJob，
以及 `Job` 等核心工作负载）与**工作负载感知调度**（WAS）集成。

该框架提供可复用的 `scheduling.k8s.io` API 原语，
例如**拓扑约束**和**干扰策略**，
并提供处理调度资源创建的共享库。
因此，各控制器可以通过自身 API，在自身 API 中以一致方式提供 WAS 能力，
而无需分别实现相同的调度逻辑。

<!--
This work was done as part of [KEP #6089](https://www.kubernetes.dev/resources/keps/6089/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
此项工作是 [KEP #6089](https://www.kubernetes.dev/resources/keps/6089/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
#### Integrate workload APIs with the Job controller {#workload-apis-job-controller}

Initially introduced in Kubernetes v1.36 with limited functionality, this feature builds on top of the [Workload Aware Scheduling Controller APIs](#workload-aware-scheduling-controller-apis) adding a new user-facing `spec.scheduling` field to the `batch/v1` Job in Kubernetes v1.37, allowing users
to explicitly configure scheduling policies, topology constraints, disruption modes, and resource claims. If
`spec.scheduling` is omitted, the Job defaults to Basic scheduling, preserving existing behavior while still creating a Basic
Workload/PodGroup for workload-aware scheduling, without enforcing a minCount gate. Users can explicitly opt into Gang
scheduling, where `minCount` defaults to the Job’s parallelism, and the controller uses the shared `workloadbuilder` library
to translate the scheduling configuration into the corresponding Workload and PodGroup objects instead of implementing custom
translation logic.
-->
#### 将工作负载 API 与 Job 控制器集成   {#workload-apis-job-controller}

此特性最初在 Kubernetes v1.36 中引入，当时功能有限。
它建立在[工作负载感知调度控制器 API](#workload-aware-scheduling-controller-apis) 的基础上；
Kubernetes v1.37 为 `batch/v1` Job 新增面向用户的 `spec.scheduling` 字段，
允许用户显式配置调度策略、拓扑约束、干扰模式和资源申领。
如果省略 `spec.scheduling`，Job 默认使用 Basic 调度，
既保留现有行为，又仍会为工作负载感知调度创建 Basic Workload/PodGroup，
但不强制执行 `minCount` 约束。
用户可以显式选择使用 Gang 调度；此时 `minCount` 默认等于 Job 的并行度，
控制器使用共享的 `workloadbuilder` 库，
将调度配置转换为相应的 Workload 和 PodGroup 对象，
而不是实现自定义转换逻辑。

<!--
This work was done as part of [KEP #5547](https://www.kubernetes.dev/resources/keps/5547/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).
-->
此项工作是 [KEP #5547](https://www.kubernetes.dev/resources/keps/5547/) 的一部分，
由 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) 牵头完成。

<!--
### localhost NodePort userspace proxy for `nftables`

Kubernetes v1.37 adds an opt-in userspace proxy to the `nftables` `kube-proxy` backend, allowing NodePort services to be accessed
through `localhost` over IPv4 and IPv6. This closes a gap between the `nftables` and `iptables` backends, as `nftables` could not
previously serve localhost NodePorts.

The proxy is enabled when `localhost` or a loopback address is included in the `kube-proxy` `--nodeport-addresses`
configuration. This can be useful for workloads such as local container registries that rely on `localhost:<NodePort>`
connections. The existing behavior of the `iptables` and `ipvs` backends is unchanged.
-->
### `nftables` 的 localhost NodePort 用户空间代理   {#localhost-nodeport-userspace-proxy-for-nftables}

Kubernetes v1.37 为 `nftables` `kube-proxy` 后端新增选择启用的用户空间代理，
允许通过 IPv4 或 IPv6 的回环地址访问 NodePort Service。
这弥合了 `nftables` 与 `iptables` 后端之间的一项差距，
因为 `nftables` 此前无法提供 localhost NodePort 服务。

当 `kube-proxy` 的 `--nodeport-addresses` 配置中包含 `localhost` 或回环地址时，
该代理会启用。这对依赖 `localhost:<NodePort>` 连接的本地容器镜像仓库等工作负载很有用。
`iptables` 和 `ipvs` 后端的现有行为保持不变。

<!--
This work was done as part of [KEP #6032](https://www.kubernetes.dev/resources/keps/6032/) led by [SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/).
-->
此项工作是 [KEP #6032](https://www.kubernetes.dev/resources/keps/6032/) 的一部分，
由 [SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/) 牵头完成。

<!--
## Other notable changes
-->
## 其他值得关注的变更   {#other-notable-changes}

<!--
### `maxUnavailable` for StatefulSets back on by default

The `maxUnavailable` field for StatefulSets has been re-enabled by default in Kubernetes v1.37 (after a bug was observed
in v1.36).

The bug occurred where a faulty initial StatefulSet revision created a Pod that never became ready, and with
`MaxUnavailableStatefulSet` enabled, the StatefulSet controller failed to update that Pod to the newer, corrected
revision. When the bug triggered, the affected Pod could end up stuck in a CrashLoopBackOff state indefinitely (see [kubernetes#137409](https://github.com/kubernetes/kubernetes/issues/137409)).
-->
### StatefulSet 的 `maxUnavailable` 恢复默认启用   {#maxunavailable-for-statefulsets-back-on-by-default}

Kubernetes v1.37 恢复默认启用 StatefulSet 的 `maxUnavailable` 字段
（该字段在 v1.36 中发现缺陷后曾被关闭）。

该缺陷的触发场景是：有问题的初始 StatefulSet 修订版本创建了一个始终无法就绪的 Pod；
启用 `MaxUnavailableStatefulSet` 时，StatefulSet 控制器无法将该 Pod
更新到较新的、已修正的修订版本。
一旦触发该缺陷，受影响的 Pod 最终可能无限期地卡在 CrashLoopBackOff 状态
（参见 [kubernetes#137409](https://github.com/kubernetes/kubernetes/issues/137409)）。

<!--
### Improved `nftables` performance
-->
### 改进 `nftables` 性能   {#improved-nftables-performance}

<!--
### Context handling and contextual logging in client-go

Support for context propagation and contextual logging in client-go is complete, with the exception of a small number of
authentication plugin log calls that still rely on the global klog logger because the underlying APIs do not support context
passing.
-->
### client-go 中的上下文处理和上下文日志记录   {#context-handling-and-contextual-logging-in-client-go}

client-go 已完成上下文传播和上下文日志记录支持；
仅有少量身份认证插件日志调用仍依赖全局 klog 日志记录器，
因为底层 API 不支持传递上下文。

<!--
## Graduations, deprecations, and removals in v1.37
-->
## v1.37 中的进阶、弃用和移除   {#graduations-deprecations-and-removals-in-v137}

<!--
### Graduations to Stable

This lists all the features that graduated to Stable (also known as general availability). For a full list of updates
including new features and graduations from Alpha to Beta, see the release notes.

This release includes a total of 16 enhancements promoted to Stable:
-->
### 进阶至稳定阶段   {#graduations-to-stable}

以下列出了所有进阶至稳定阶段（也称为正式发布，GA）的特性。
有关新特性以及从 Alpha 进阶至 Beta 等更新的完整列表，请参阅发布说明。

此版本共有 16 项增强进阶至稳定阶段：

<!--
* [Speed up recursive SELinux label change](https://www.kubernetes.dev/resources/keps/1710/)
* [ClusterTrustBundles](https://www.kubernetes.dev/resources/keps/3257/)
* [Pod Certificates](https://www.kubernetes.dev/resources/keps/4317/)
* [Allow setting arbitrary FQDN as the pod's hostname](https://www.kubernetes.dev/resources/keps/4762/)
* [DRA: Resource Claim Status with possible standardized network interface data](https://www.kubernetes.dev/resources/keps/4817/)
* [Configurable tolerance for HorizontalPodAutoscalers](https://www.kubernetes.dev/resources/keps/4951/)
* [Relaxed validation for Services names](https://www.kubernetes.dev/resources/keps/5311/)
* [Add Resource Health Status to the Pod Status for Device Plugin and DRA](https://www.kubernetes.dev/resources/keps/4680/)
* [DRA: device taints and tolerations](https://www.kubernetes.dev/resources/keps/5055/)
* [DRA: Handle extended resource requests via DRA Driver](https://www.kubernetes.dev/resources/keps/5004/)
* [Node Declared Features](https://www.kubernetes.dev/resources/keps/5328/)
* [Add condition for sandbox creation](https://www.kubernetes.dev/resources/keps/3085/)
* [Move Storage Version Migrator in-tree](https://www.kubernetes.dev/resources/keps/4192/)
* [Resilient Watchcache Initialization](https://www.kubernetes.dev/resources/keps/4568/)
* [DRA: Standard numaNode Device Attribute](https://www.kubernetes.dev/resources/keps/6072/)
* [metrics.k8s.io API definition](https://www.kubernetes.dev/resources/keps/5207/)
* [KYAML](https://www.kubernetes.dev/resources/keps/5295/)
-->
* [加快递归更改 SELinux 标签的速度](https://www.kubernetes.dev/resources/keps/1710/)
* [ClusterTrustBundle](https://www.kubernetes.dev/resources/keps/3257/)
* [Pod 证书](https://www.kubernetes.dev/resources/keps/4317/)
* [允许将任意 FQDN 设为 Pod 的主机名](https://www.kubernetes.dev/resources/keps/4762/)
* [DRA：ResourceClaim 状态可包含标准化的网络接口数据](https://www.kubernetes.dev/resources/keps/4817/)
* [HorizontalPodAutoscaler 的可配置容差](https://www.kubernetes.dev/resources/keps/4951/)
* [放宽 Service 名称验证](https://www.kubernetes.dev/resources/keps/5311/)
* [为设备插件和 DRA 向 Pod 状态添加资源健康状态](https://www.kubernetes.dev/resources/keps/4680/)
* [DRA：设备污点和容忍度](https://www.kubernetes.dev/resources/keps/5055/)
* [DRA：通过 DRA 驱动处理扩展资源请求](https://www.kubernetes.dev/resources/keps/5004/)
* [节点声明式特性](https://www.kubernetes.dev/resources/keps/5328/)
* [为沙箱创建添加状况](https://www.kubernetes.dev/resources/keps/3085/)
* [将存储版本迁移器移入树内](https://www.kubernetes.dev/resources/keps/4192/)
* [弹性监视缓存初始化](https://www.kubernetes.dev/resources/keps/4568/)
* [DRA：标准 `numaNode` 设备属性](https://www.kubernetes.dev/resources/keps/6072/)
* [metrics.k8s.io API 定义](https://www.kubernetes.dev/resources/keps/5207/)
* [KYAML](https://www.kubernetes.dev/resources/keps/5295/)

<!--
## Deprecations, removals and community updates

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's
overall health.
See the Kubernetes [deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on this process.
Many of these deprecations and removals were announced in the [Deprecations and Removals blog](/blog/2026/07/31/kubernetes-v1-37-sneak-peek/)
-->
## 弃用、移除和社区动态   {#deprecations-removals-and-community-updates}

随着 Kubernetes 不断发展和成熟，为了项目的整体健康，
某些特性可能会被弃用、移除或由更好的特性替代。
有关此过程的更多详细信息，请参阅 Kubernetes
[弃用和移除政策](/zh-cn/docs/reference/using-api/deprecation-policy/)。
其中许多弃用和移除已在[弃用和移除博客](/zh-cn/blog/2026/07/31/kubernetes-v1-37-sneak-peek/)中公布。

<!--
### Deprecation of `kube-dns`

CoreDNS has been the default cluster DNS add-on since Kubernetes v1.13, and `kube-dns` has not kept pace since then; features like EndpointSlices and dual-stack Services aren't available in it.

Kubernetes has already retired the kube-dns subproject and has split node-local-dns out into its own [repository](https://github.com/kubernetes-sigs/node-local-dns), where it continues to be maintained and works with CoreDNS. It is expected that no new packages will be built for kube-dns after v1.40.

If you still run `kube-dns`, [start planning to migrate your clusters to CoreDNS](/docs/tasks/administer-cluster/coredns/).
-->
### 弃用 `kube-dns`   {#deprecation-of-kube-dns}

从 Kubernetes v1.13 起，CoreDNS 一直是默认的集群 DNS 插件，
而 `kube-dns` 此后没有跟上发展；它不支持 EndpointSlice 和双协议栈 Service 等特性。

Kubernetes 已经停用了 kube-dns 子项目，
并将 node-local-dns 拆分到其独立的[仓库](https://github.com/kubernetes-sigs/node-local-dns)中；
node-local-dns 仍在持续维护，并可与 CoreDNS 配合使用。
预计 v1.40 之后不会再为 kube-dns 构建新软件包。

如果你仍在运行 `kube-dns`，请[开始规划将集群迁移到 CoreDNS](/zh-cn/docs/tasks/administer-cluster/coredns/)。

<!--
### Deprecating `kube-proxy`'s support for `ipvs` mode

`kube-proxy` support for `ipvs` mode was introduced in v1.8 to resolve `iptables` performance bottlenecks. However, since the
kernel `ipvs` API alone cannot fully implement Kubernetes Services, `ipvs` mode continues to use `iptables` underneath
([KEP-3866, "The ipvs mode of kube-proxy will not save us"](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3866-nftables-proxy/README.md#the-ipvs-mode-of-kube-proxy-will-not-save-us)).
-->
### 弃用 `kube-proxy` 对 `ipvs` 模式的支持   {#deprecating-kube-proxys-support-for-ipvs-mode}

`kube-proxy` 对 `ipvs` 模式的支持是在 v1.8 中引入的，旨在解决 `iptables` 性能瓶颈。
然而，由于内核 `ipvs` API 单独无法完全实现 Kubernetes Service，
`ipvs` 模式在底层仍继续使用 `iptables`
（[KEP-3866，“kube-proxy 的 ipvs 模式救不了我们”](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3866-nftables-proxy/README.md#the-ipvs-mode-of-kube-proxy-will-not-save-us)）。

<!--
Clusters running `kube-proxy` in `ipvs` mode (or mode: `ipvs` in KubeProxyConfiguration) now log a deprecation warning on startup. The deprecation timeline looks like this:
- By v1.40, `ipvs` mode for `kube-proxy` is expected to be disabled by default (still selectable via the feature gate)
- By v1.43, support for `ipvs` mode would be removed entirely [KEP #5495, Graduation Criteria](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md#graduation-criteria).
To confirm which mode you’re currently running, use:
-->
在 `ipvs` 模式下运行 `kube-proxy` 的集群
（或在 KubeProxyConfiguration 中设置 `mode: ipvs`）
现在会在启动时记录一条弃用警告。弃用时间表如下：

- 到 v1.40，`kube-proxy` 的 `ipvs` 模式预计将默认禁用（仍可通过特性门控选择）
- 到 v1.43，对 `ipvs` 模式的支持将被完全移除
  [KEP #5495，进阶标准](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md#graduation-criteria)。

要确认你当前运行的是哪种模式，请使用：

```bash
kubectl -n kube-system get configmap kube-proxy -o jsonpath='{.data.config\.conf}' | grep 'mode:'
```

<!--
To understand the rationale behind this deprecation, see [KEP #5495](https://www.kubernetes.dev/resources/keps/5495/).
-->
要了解此次弃用背后的原因，请参阅
[KEP #5495](https://www.kubernetes.dev/resources/keps/5495/)。

<!--
### `kubectl`: `kubectl run --filename/-f` to be deprecated

The `--filename` (or `-f`) flag for `kubectl run` is being deprecated as the generated pod is always built purely from CLI arguments like `NAME` and `--image`.

See [kubernetes/kubernetes#138671](https://github.com/kubernetes/kubernetes/issues/138671) for the original issue and discussion.
-->
### `kubectl`：`kubectl run --filename/-f` 将被弃用   {#kubectl-kubectl-run-filename-f-to-be-deprecated}

`kubectl run` 的 `--filename`（或 `-f`）参数将被弃用，
因为生成的 Pod 始终完全根据 `NAME` 和 `--image` 等 CLI 参数构建。

原始 Issue 和讨论请参阅
[kubernetes/kubernetes#138671](https://github.com/kubernetes/kubernetes/issues/138671)。

<!--
### `kubelet`: static Pods can no longer reference Secrets or ConfigMaps

Static Pods were never meant to read API resources directly, since they aren't created through the API server — but a bug let them reference Secrets or ConfigMaps via fields like `configMapRef` or `secretRef`. That bug is now fixed: as of v1.37 these references are strictly prohibited, and the `PreventStaticPodAPIReferences` feature gate that previously let you opt out of the restriction has been removed.

See [kubernetes/kubernetes#140226](https://github.com/kubernetes/kubernetes/issues/140226) for the original issue and discussion.
-->
### `kubelet`：静态 Pod 不再能引用 Secret 或 ConfigMap   {#kubelet-static-pods-can-no-longer-reference-secrets-or-configmaps}

静态 Pod 从未打算直接读取 API 资源，因为它们不是通过 API 服务器创建的；
但一个缺陷曾允许它们通过 `configMapRef` 或 `secretRef` 等字段引用 Secret 或 ConfigMap。
该缺陷现已修复：从 v1.37 起，这些引用被严格禁止，
并且先前用于绕过此限制的 `PreventStaticPodAPIReferences` 特性门控已被移除。

原始 Issue 和讨论请参阅
[kubernetes/kubernetes#140226](https://github.com/kubernetes/kubernetes/issues/140226)。

<!--
### Ongoing major change: Future removal of cgroup v1 support

As modern Linux distributions and container runtimes use [cgroup v2](/docs/concepts/architecture/cgroups/) as the default,
support for the legacy cgroup v1 is officially being phased out. Since the v1.35 release, the `failCgroupV1` setting has
defaulted to true. Consequently, the `kubelet` will fail to initialize on any nodes that still rely on cgroup v1 unless an
explicit configuration override is applied.
-->
### 持续推进的重大变更：未来将移除 cgroup v1 支持   {#ongoing-major-change-future-removal-of-cgroup-v1-support}

随着现代 Linux 发行版和容器运行时默认使用
[cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/)，
对旧版 cgroup v1 的支持已正式进入逐步淘汰阶段。
从 v1.35 版本起，`failCgroupV1` 设置默认为 true。
因此，除非显式应用配置覆盖，
否则 `kubelet` 将无法在仍依赖 cgroup v1 的任何节点上完成初始化。

<!-- failCgroupV1: false # temporary override -->
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failCgroupV1: false # 临时覆盖
```

<!--
Using this override should be considered a short-term fix. Advanced resource management capabilities, such as memory QoS and in-place scaling for memory-backed volumes, work only on cgroups v2. While the override remains available in Kubernetes
v1.37, users are encouraged to migrate to cgroups v2, as support for cgroups v1 is planned to be removed in a future release.

To learn more about this deprecation, refer to [KEP #5573](https://www.kubernetes.dev/resources/keps/5573/).
-->
使用此覆盖应被视为短期解决方案。
内存 QoS 和内存支持卷原地扩缩等高级资源管理能力仅适用于 cgroup v2。
虽然 Kubernetes v1.37 中仍可使用此覆盖，
但由于计划在未来版本中移除 cgroup v1 支持，建议用户迁移到 cgroup v2。

要进一步了解此次弃用，请参阅
[KEP #5573](https://www.kubernetes.dev/resources/keps/5573/)。

<!--
### Release notes

Check out the full details of the Kubernetes v1.37 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md).
-->
### 发布说明   {#release-notes}

请在[发布说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md)
中查看 Kubernetes v1.37 版本的完整详情。

<!--
### Availability

[Kubernetes v1.37](/releases/1.37/) is available for download from
the [Kubernetes download page](/releases/download/) or direct from on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.37.0).

To get started with Kubernetes, check out [these tutorials](/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/).
You can also easily install v1.37 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).
-->
### 获取 Kubernetes v1.37   {#availability}

你可以从 [Kubernetes 下载页面](/zh-cn/releases/download/)或直接从
[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.37.0)
下载 [Kubernetes v1.37](/zh-cn/releases/1.37/)。

要开始使用 Kubernetes，请查阅[这些教程](/zh-cn/docs/tutorials/)，
或者使用 [minikube](https://minikube.sigs.k8s.io/) 运行本地 Kubernetes 集群。
你还可以使用 [kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
轻松安装 v1.37。

<!--
### Release team

Kubernetes is only possible with the support, commitment, and hard work of its community.
Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the
Kubernetes releases you rely on.

This requires the specialized skills of people from all corners of our community, from the code itself to its documentation
and project management.
-->
### 发布团队   {#release-team}

没有社区的支持、投入和辛勤工作，就不可能有 Kubernetes。
每个发布团队都由尽心尽力的社区志愿者组成，
他们协同构建你所依赖的 Kubernetes 版本中的众多组成部分。

从代码本身到文档和项目管理，
这项工作需要社区各个角落贡献者的专业技能。

<!--
We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.37 release to our community.

The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over several
release cycles.

A very special thanks goes out to our release lead, [Dipesh Rawat](https://github.com/dipesh-rawat), for supporting us
through a successful release cycle, advocating for us, making sure that we could all contribute in the best way possible, and
challenging us to improve the release process.
-->
我们要感谢整个[发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md)，
感谢大家投入大量时间和辛勤工作，将 Kubernetes v1.37 版本交付给社区。

发布团队成员既有首次担任影子角色的新人，
也有在多个发布周期中积累了丰富经验、再次回归的团队负责人。

我们要特别感谢发布负责人 [Dipesh Rawat](https://github.com/dipesh-rawat)：
他支持我们顺利完成整个发布周期，为我们发声，
确保每个人都能以最佳方式作出贡献，并推动我们持续改进发布流程。

<!--
### Project velocity

The CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects.

This includes everything from individual contributions to the number of companies that are contributing and is an
illustration of the depth and breadth of effort that goes into evolving this ecosystem.
-->
### 项目活跃度   {#project-velocity}

CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)
项目汇总了与 Kubernetes 及各子项目发展速度有关的许多有趣数据统计。

这些数据涵盖从个人贡献到参与贡献的公司数量等各个方面，
体现了推动该生态演进所投入努力的深度与广度。

<!--
In the v1.37 release cycle, which ran for 15 weeks from May 18th, 2026, to August 26th, 2026, contributions to Kubernetes reached a maximum of 212 different companies and 1,709 individuals at any given time.

Source for this data:

- [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1779058800000&to=1787781600000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1779055200000&to=1787781600000%20&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)
-->
v1.37 发布周期从 2026 年 5 月 18 日到 2026 年 8 月 26 日，共计 15 周；
在此期间，任何给定时点为 Kubernetes 贡献的公司和个人的数量峰值分别为 212 家和 1,709 名。

数据来源：

- [为 Kubernetes 作出贡献的公司](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1779058800000&to=1787781600000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)
- [整个生态系统的贡献](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1779055200000&to=1787781600000%20&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

<!--
By contribution we mean when someone makes a commit, code review, comment, creates an issue or PR, reviews a PR (including
blogs and documentation), or comments on issues and PRs.

If you are interested in contributing, see our [getting started](https://www.kubernetes.dev/docs/guide/#getting-started)
page.
-->
这里所说的贡献包括提交 Commit、进行代码评审、发表评论、创建 Issue 或 PR、
评审 PR（包括博客和文档），以及在 Issue 和 PR 上发表评论。

如果你有兴趣参与贡献，请查看我们的[入门](https://www.kubernetes.dev/docs/guide/#getting-started)页面。

<!--
### Event update

Explore the upcoming KubeCons worldwide:

- [KubeCon + CloudNativeCon China](https://www.lfopensource.cn/kubecon-cloudnativecon-openinfra-summit-pytorch-conference-china/):
  September 7–9, 2026, in Shanghai, China
- [KubeCon + CloudNativeCon North America](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/):
  November 9–12, 2026, in Salt Lake City, United States
-->
### 活动动态   {#event-update}

了解即将在世界各地举办的 KubeCon：

- [KubeCon + CloudNativeCon 中国站](https://www.lfopensource.cn/kubecon-cloudnativecon-openinfra-summit-pytorch-conference-china/)：
  2026 年 9 月 7 日至 9 日，中国上海
- [KubeCon + CloudNativeCon 北美站](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)：
  2026 年 11 月 9 日至 12 日，美国盐湖城

<!--
Kubernetes Community Days (KCDs) taking place for the rest of 2026:

- [KCD x Ceph x OpenInfra Day Korea](https://community2.cncf.io/events/details/cncf-kcd-south-korea-presents-kcd-x-ceph-x-openinfra-day-korea-2026/):
  September 1, 2026, in Seoul, South Korea
- [KCD San Francisco Bay Area](https://community2.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area-2026/):
  September 1, 2026, in Mountain View, United States
- [KCD Washington DC](https://community2.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2026/):
  September 15, 2026, in Washington, DC, United States
- [KCD Gujarat](https://community2.cncf.io/events/details/cncf-kcd-gujarat-presents-kcd-gujarat-2026/):
  September 19, 2026, in Ahmedabad, India
- [KCD São Paulo](https://community2.cncf.io/events/details/cncf-kcd-brasil-presents-kcd-sao-paulo-2026/):
  September 26, 2026, in São Paulo, Brazil
- [KCD Sofia](https://community2.cncf.io/events/details/cncf-kcd-sofia-presents-kubernetes-community-days-sofia-2026/):
  September 29, 2026, in Sofia, Bulgaria
- [KCD UK – Edinburgh](https://community2.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2026/):
  October 19–20, 2026, in Edinburgh, United Kingdom
- [KCD Nigeria](https://community2.cncf.io/events/details/cncf-kcd-nigeria-presents-kcd-nigeria-2026-telling-the-african-cloud-native-story/):
  October 24, 2026, in Lagos, Nigeria
- [KCD Porto](https://community2.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2026-collab-with-devops-days-portugal/):
  November 19–20, 2026, in Porto, Portugal
- [KCD Suisse Romande](https://community2.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande-2026/):
  December 9–10, 2026, in Meyrin, Switzerland
- [KCD Provence](https://community2.cncf.io/events/details/cncf-kcd-provence-presents-kcd-provence-2026/):
  December 10, 2026, in Aix-en-Provence, France
- [KCD Florida – Miami](https://community2.cncf.io/events/details/cncf-kcd-florida-presents-kcd-florida-2026-miami/):
  December 11, 2026, in Miami, United States
-->
2026 年即将举办的 Kubernetes Community Days（KCD）：

- [KCD x Ceph x OpenInfra Day 韩国站](https://community2.cncf.io/events/details/cncf-kcd-south-korea-presents-kcd-x-ceph-x-openinfra-day-korea-2026/)：
  2026 年 9 月 1 日，韩国首尔
- [KCD 旧金山湾区站](https://community2.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area-2026/)：
  2026 年 9 月 1 日，美国山景城
- [KCD 华盛顿特区站](https://community2.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2026/)：
  2026 年 9 月 15 日，美国华盛顿特区
- [KCD 古吉拉特站](https://community2.cncf.io/events/details/cncf-kcd-gujarat-presents-kcd-gujarat-2026/)：
  2026 年 9 月 19 日，印度艾哈迈达巴德
- [KCD 圣保罗站](https://community2.cncf.io/events/details/cncf-kcd-brasil-presents-kcd-sao-paulo-2026/)：
  2026 年 9 月 26 日，巴西圣保罗
- [KCD 索非亚站](https://community2.cncf.io/events/details/cncf-kcd-sofia-presents-kubernetes-community-days-sofia-2026/)：
  2026 年 9 月 29 日，保加利亚索非亚
- [KCD 英国爱丁堡站](https://community2.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2026/)：
  2026 年 10 月 19 日至 20 日，英国爱丁堡
- [KCD 尼日利亚站](https://community2.cncf.io/events/details/cncf-kcd-nigeria-presents-kcd-nigeria-2026-telling-the-african-cloud-native-story/)：
  2026 年 10 月 24 日，尼日利亚拉各斯
- [KCD 波尔图站](https://community2.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2026-collab-with-devops-days-portugal/)：
  2026 年 11 月 19 日至 20 日，葡萄牙波尔图
- [KCD 杭州站](https://sessionize.com/kcd-hangzhou-2026/):
  2026 年 11 月 28 日，中国杭州
- [KCD 瑞士法语区站](https://community2.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande-2026/)：
  2026 年 12 月 9 日至 10 日，瑞士梅兰
- [KCD 普罗旺斯站](https://community2.cncf.io/events/details/cncf-kcd-provence-presents-kcd-provence-2026/)：
  2026 年 12 月 10 日，法国艾克斯普罗旺斯
- [KCD 佛罗里达迈阿密站](https://community2.cncf.io/events/details/cncf-kcd-florida-presents-kcd-florida-2026-miami/)：
  2026 年 12 月 11 日，美国迈阿密

<!--
### Upcoming release webinar

Join members of the Kubernetes v1.37 Release Team on Wednesday, September 23rd, 2026 at 4:00 PM (UTC) to learn about the release highlights of this release. For more information and registration, visit the [event page on the CNCF Online Programs site](https://community2.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v137-webinar/).
-->
### 即将举办的版本发布网络研讨会   {#upcoming-release-webinar}

欢迎于 2026 年 9 月 23 日星期三 16:00（UTC）参加 Kubernetes v1.37 发布团队成员主持的活动，
了解此版本的亮点。有关更多信息和报名方式，请访问
[CNCF 在线项目网站上的活动页面](https://community2.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v137-webinar/)。

<!--
## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://kubernetes.dev/community/community-groups/sigs/) (SIGs) that align with your interests.

If you don't know where to start, join our monthly [New Contributor Orientations](https://www.kubernetes.dev/docs/orientation/)
where we teach the community how the project is structured, and we'll guide you on how to make your first contribution to the project.
-->
## 参与进来   {#get-involved}

参与 Kubernetes 最简单的方式，是加入与你兴趣相符的众多
[特别兴趣小组](https://kubernetes.dev/community/community-groups/sigs/)（SIG）之一。

如果你不知道从何开始，请参加我们每月举办的
[新贡献者入门活动](https://www.kubernetes.dev/docs/orientation/)；
我们会向社区介绍项目的组织结构，并指导你完成对项目的首次贡献。

<!--
- Read more on how to become a [Kubernetes Contributor](https://www.kubernetes.dev/docs/guide/)
- Read more about what’s happening with Kubernetes on our [blog](https://kubernetes.io/blog/)
- Join us on [Slack](http://slack.k8s.io/)
- Follow us on [Bluesky](https://bsky.app/profile/kubernetes.io) for the latest updates
- Follow us on [LinkedIn](https://www.linkedin.com/company/kubernetes/)
- Follow us on [X](https://x.com/kubernetesio)
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your [Kubernetes End User Story](https://www.cncf.io/case-studies/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
- 进一步了解如何成为 [Kubernetes 贡献者](https://www.kubernetes.dev/docs/guide/)
- 在我们的[博客](https://kubernetes.io/blog/)中进一步了解 Kubernetes 动态
- 在 [Slack](https://slack.k8s.io/) 上加入我们
- 在 [Bluesky](https://bsky.app/profile/kubernetes.io) 上关注我们，获取最新动态
- 在 [LinkedIn](https://www.linkedin.com/company/kubernetes/) 上关注我们
- 在 [X](https://x.com/kubernetesio) 上关注我们
- 在 [Discuss](https://discuss.kubernetes.io/) 上参与社区讨论
- 在 [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes) 上提问（或回答问题）
- 分享你的 [Kubernetes 最终用户案例](https://www.cncf.io/case-studies/)
- 进一步了解 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)
