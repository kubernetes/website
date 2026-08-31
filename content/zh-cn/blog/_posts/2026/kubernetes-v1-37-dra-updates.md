---
layout: blog
title: 'Kubernetes v1.37：DRA 新进展'
date: 2026-09-03T10:30:00-08:00
draft: false
slug: kubernetes-v1-37-dra-updates
author: >
  [Kashish Verma](https://github.com/KashishV999)
translator: >
  [Paco Xu](https://github.com/pacoxu) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.37: DRA Updates'
date: 2026-09-03T10:30:00-08:00
slug: kubernetes-v1-37-dra-updates
author: >
  [Kashish Verma](https://github.com/KashishV999)
-->

<!--
Kubernetes 1.37 is here and [Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) keeps pushing past where it started! This release brings DRA Extended Resource support to GA, a milestone the team has been building toward for three straight releases. Several more features graduate to Beta or GA. A fresh batch of alpha features rounds out the release.
-->
Kubernetes 1.37 现已发布，
[动态资源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
也在不断突破最初的边界！
此版本中，DRA 扩展资源支持正式进入 GA；这是团队连续三个版本努力达成的重要里程碑。
此外还有多项特性进阶至 Beta 或 GA，以及一批全新的 Alpha 特性，共同构成了本次更新。

<!--
I'll dive into what's new for DRA in Kubernetes 1.37!
-->
下面我们来深入了解 Kubernetes 1.37 中 DRA 的新变化！

<!--
## What's stable in 1.37
-->
## v1.37 中的稳定特性 { #whats-stable-in-1-37 }

<!--
[DRA Extended Resource support](https://www.kubernetes.dev/resources/keps/5004) has graduated to GA. This is the mechanism that lets DRA drivers satisfy requests made through the traditional extended resource API, think `example.com/gpu` in a Pod spec, without requiring a separate device plugin alongside the DRA driver. An extended resource name can be set directly on a DeviceClass, and Pods requesting it get matched to a device through DRA with no ResourceClaim needed on the workload's part.
-->
[DRA 扩展资源支持](https://www.kubernetes.dev/resources/keps/5004)已进阶至 GA。
借助此机制，DRA 驱动无需再搭配单独的设备插件，
即可满足通过传统扩展资源 API 发出的请求，例如 Pod 规约中的 `example.com/gpu`。
集群管理员可以直接在 DeviceClass 上设置扩展资源名称。
请求该扩展资源的 Pod 将通过 DRA 获得设备，工作负载侧无需显式声明或引用 ResourceClaim。

<!--
It's been on a steady path since KEP acceptance in 1.34. Alpha landed in 1.35, Beta in 1.36, and now it's Stable. For cluster operators, this is what makes DRA adoption gradual. Existing workloads written against extended resources keep working unmodified while the backend allocation logic moves over to DRA.
-->
自该 KEP 在 1.34 中获批以来，这项特性一直稳步推进：
1.35 中进入 Alpha，1.36 中进入 Beta，如今已经稳定。
这让集群运维人员可以逐步采用 DRA：
在后端分配逻辑迁移到 DRA 的同时，基于扩展资源编写的现有工作负载无需修改即可继续运行。

<!--
[ResourceClaims status with possible standardized network interface data](https://www.kubernetes.dev/resources/keps/4817/) adds a `devices` field to ResourceClaim `.status`, letting DRA drivers report per-device status, including, for network devices, the interface name, MAC address, and IP addresses. This gives users and controllers visibility into device state that was previously invisible once a device was configured in a Pod, and makes it possible to build things like network services that rely on a device's reported IPs.
-->
[ResourceClaim 设备状态（可包含标准化网络接口数据）](https://www.kubernetes.dev/resources/keps/4817/)
为 ResourceClaim 的 `.status` 添加了 `devices` 字段，
使 DRA 驱动可以报告各个设备的状态；对于网络设备，
报告内容包括接口名称、MAC 地址和 IP 地址。
过去，设备在 Pod 中配置完成后，其状态便不可见；
现在用户和控制器可以查看这些状态，
并能够构建依赖设备所报告 IP 地址的服务等。

<!--
[DRA: device taints and tolerations](https://www.kubernetes.dev/resources/keps/5055/) is now Stable; DRA drivers can mark devices as tainted so they're skipped for new Pod scheduling, and cluster admins can apply the same taints cluster-wide via a DeviceTaintRule, without reconfiguring drivers. Pods already using a tainted device can be evicted automatically, unless their ResourceClaim explicitly tolerates the taint. This mirrors node taints and tolerations, letting operators take a single device offline for maintenance or mark it degraded, without disrupting the rest of the cluster.
-->
[DRA：设备污点和容忍度](https://www.kubernetes.dev/resources/keps/5055/)现已进入 Stable。
DRA 驱动可以为设备添加污点，让调度新 Pod 时跳过这些设备；
集群管理员也可以通过集群级 DeviceTaintRule，为符合选择条件的设备添加相同污点，而无需重新配置驱动。
除非 Pod 的 `ResourceClaim` 明确容忍相应污点，
否则已经在使用带污点设备的 Pod 可以被自动驱逐。
此机制与节点污点和容忍度类似，运维人员可以将单个设备下线维护或将其标记为已降级，
而不影响集群的其他部分。

<!--
[Standard numaNode device attribute](https://github.com/kubernetes/enhancements/issues/6072) standardizes `resource.kubernetes.io/numaNode` as a shared attribute name, so devices from different drivers can be compared on the same NUMA node instead of each driver inventing its own name for it. It landed directly as stable in 1.37, since it's a naming/registration KEP with no feature gate or in-tree behavior change.
-->
[标准化 `numaNode` 设备属性](https://github.com/kubernetes/enhancements/issues/6072)
将 `resource.kubernetes.io/numaNode` 标准化为共享属性名称，
使系统能够比较不同驱动所管理的设备是否位于同一 NUMA 节点，
而不再需要各个驱动自行定义属性名称。
由于这是一项仅涉及命名和注册的 KEP，既不涉及特性门控，也不改变 Kubernetes 内置行为，
因此在 1.37 中直接进入 Stable。

<!--
## Feature promoted to Beta
-->
## 进阶至 Beta 的特性 { #feature-promoted-to-beta }

<!--
[ResourceClaim support for workloads](https://www.kubernetes.dev/resources/keps/5729)
graduates to Beta behind the `DRAWorkloadResourceClaims` feature gate, which stays disabled by default.
In a cluster that has the feature enabled, Workloads and PodGroups can reference ResourceClaims directly, so
a single claim can be shared across an entire group of Pods. This is instead of claims being capped at 256
Pods through the old per-Pod reservation limit.
-->
[面向工作负载的 ResourceClaim 支持](https://www.kubernetes.dev/resources/keps/5729)
已进阶至 Beta，由默认仍处于禁用状态的 `DRAWorkloadResourceClaims` 特性门控控制。
在启用此特性的集群中，Workload 和 PodGroup 可以直接引用 ResourceClaim，
同一个 Pod 组内的所有 Pod 可以共享一个 ResourceClaim，
不再受 `status.reservedFor` 最多包含 256 个 Pod 条目的限制。

<!--
The [DRA Device Attributes Downward API](https://www.kubernetes.dev/resources/keps/5304/) is aimed at
supporting device injection into KubeVirt VMs. Drivers populate a `Metadata` field when preparing a claim,
and the framework writes it to a JSON file mounted into the container via CDI, letting workloads read a
device's PCI bus address, MAC address, and other attributes directly instead of requiring custom controllers
to watch and translate ResourceClaims and ResourceSlices.
-->
[DRA 设备属性 Downward API](https://www.kubernetes.dev/resources/keps/5304/)
旨在支持将设备注入 KubeVirt 虚拟机。
驱动在为 ResourceClaim 执行节点侧准备时，在 PrepareResourceClaims 返回结果的 `Device.Metadata` 字段中填入元数据。
框架随后将其写入 JSON 文件，并通过容器设备接口（Container Device Interface，CDI）把该文件挂载到容器中。
这样，工作负载就能直接读取设备的 PCI 总线地址、MAC 地址和其他属性，
无需自定义控制器监视 ResourceClaim 和 ResourceSlice 并转换其中的数据。
<!--
## Alpha features
-->
## Alpha 特性 { #alpha-features }

<!--
[List types for attributes](https://www.kubernetes.dev/resources/keps/5491) moved into a second Alpha in 1.37,
letting a device attribute hold more than one value instead of a single scalar, such as a CPU that's
adjacent to more than one PCIe root. This makes it possible to match or distinguish devices based on
overlapping or non-overlapping sets of values, while single-value attributes keep working as they do today.
-->
[属性的列表类型](https://www.kubernetes.dev/resources/keps/5491)在 1.37 中进入第二个 Alpha 版本，
允许一个设备属性保存多个值，而不再局限于单个标量；
例如，一个 CPU 可能与多个 PCIe root 相邻。
由此可以根据相互重叠或互不重叠的值集合来匹配或区分设备，
同时单值属性仍按现有方式工作。

<!--
[Node allocatable resource requests](https://www.kubernetes.dev/resources/keps/5517) moved into Alpha 2. It
lets the scheduler and kubelet treat DRA-managed CPU, memory, and similar node resources the same way they
treat ordinary resource requests, so a node doesn't get oversubscribed and users no longer have to duplicate
the same request in both a ResourceClaim and the pod spec.
-->
[节点可分配资源请求](https://www.kubernetes.dev/resources/keps/5517)已进入第二个 Alpha 版本。
借助此特性，调度器和 kubelet 能以处理普通资源请求的相同方式，
处理由 DRA 管理的 CPU、内存及类似节点资源，
从而避免节点资源被过度分配，
用户也不再需要同时在 ResourceClaim 和 Pod 规约中重复声明同一个请求。

<!--
[Resource availability visibility](https://www.kubernetes.dev/resources/keps/5677) moved to a second Alpha in Kubernetes 1.37. Users create a ResourcePoolStatusRequest to get a point-in-time availability snapshot. To refresh it, delete and recreate the request; it is not a continuous monitoring API.
-->
[资源可用情况的可见性](https://www.kubernetes.dev/resources/keps/5677)
在 Kubernetes 1.37 中进入 Alpha 2。
用户可以创建 ResourcePoolStatusRequest，获取某一时刻的资源可用性快照。
若要刷新快照，需要删除并重新创建该请求；这不是一个持续监控 API。

<!--
[DRA: Optional Node Operations](https://www.kubernetes.dev/resources/keps/5945) lets a driver skip kubelet's
prepare and unprepare calls for allocations that don't need any setup on the node. This makes it possible to
avoid an unnecessary dependency on the driver for allocations where there's genuinely nothing for it to do
locally.
-->
[DRA：可选节点操作](https://www.kubernetes.dev/resources/keps/5945)
对于无需执行节点本地准备操作的分配，驱动可以显式声明退出节点侧流程，
使 kubelet 跳过对插件的 NodePrepareResources 和 NodeUnprepareResources 调用，
从而避免不必要的节点侧驱动依赖。

<!--
[Derived Attributes](https://www.kubernetes.dev/resources/keps/6080) is a new feature that lets you use [CEL](/docs/reference/using-api/cel/) expressions to match up devices based on your own
custom rules. Before this, pairing devices from different vendors (like a GPU/TPU and a NIC on the same NUMA
node) only worked if both drivers used the exact same attribute name. If one used `numa` and the other used
`numaNode`, the scheduler couldn't pair them together. Now, you can easily bridge these differences yourself
inside your manifest, meaning you don't have to wait for hardware vendors to agree on standardized attribute
names. Beyond just fixing naming differences, you can also use CEL to handle more complex scenarios like
slicing a specific ID out of a long, monolithic topology string, or grouping devices into custom performance
tiers based on their available capacity.
-->
[派生属性](https://www.kubernetes.dev/resources/keps/6080)是一项新特性，
允许你使用 [CEL](/zh-cn/docs/reference/using-api/cel/) 表达式，
按照自定义规则匹配设备。
在此之前，只有当两个驱动使用完全相同的属性名称时，
才能配对不同供应商的设备，例如位于同一 NUMA 节点上的 GPU/TPU 和 NIC。
如果一个驱动使用 `numa`，另一个使用 `numaNode`，调度器就无法将它们配对。
现在，你可以直接在清单中轻松弥合这些差异，
无需等待硬件供应商就标准化属性名称达成一致。
除了处理名称差异，你还可以使用 CEL 应对更复杂的场景，
例如从较长且包含多项信息的拓扑字符串中截取特定 ID，
或根据设备的可用容量将其划分到自定义性能层级。

<!--
[DRA Device Compatibility Groups](https://www.kubernetes.dev/resources/keps/5963) lets drivers tag partitions
of a device, like MIG vs vGPU profiles on the same GPU, with compatibility groups, so the scheduler rejects
incompatible combinations up front instead of the driver failing at node preparation time. It's controlled by
the `DRADeviceCompatibilityGroups` feature gate, disabled by default.
-->
[DRA 设备兼容性组](https://www.kubernetes.dev/resources/keps/5963)
允许驱动使用兼容性组标记设备的各个分区，
例如区分同一 GPU 上采用 MIG 或 vGPU 的不同分区模式（profile）。
这样，调度器就能提前拒绝不兼容的组合，
而不是等到 NodePrepareResources 阶段才由驱动判定失败。
此特性由默认禁用的 `DRADeviceCompatibilityGroups` 特性门控控制。

<!--
[PreQueueingHint extension point](https://www.kubernetes.dev/resources/keps/6132) is new as Alpha in 1.37.
DRA ResourceClaim events used to trigger a full scan of every unschedulable pod, an O(N²) cost during large
scale-ups. The DRA plugin now uses a pod informer index to narrow that to just the pods actually affected,
cutting the requeue path to O(1) and roughly doubling scheduling throughput in early benchmarks. Controlled
by the `SchedulerPreQueueingHints` feature gate.
-->
[PreQueueingHint 扩展点](https://www.kubernetes.dev/resources/keps/6132)
是 1.37 中新增的 Alpha 特性。
过去，DRA ResourceClaim 事件会触发对所有不可调度 Pod 的完整扫描，
在大规模扩容期间会产生 O(N²) 的开销。
现在，DRA 插件使用 Pod informer 索引，将扫描范围缩小到真正受影响的 Pod，
使重新入队路径的复杂度降至 O(1)；初步基准测试显示，调度吞吐量大约提升了一倍。
此特性由 `SchedulerPreQueueingHints` 特性门控控制。

<!--
[DRA Consumable Capacity](https://www.kubernetes.dev/resources/keps/5075) now supports fractional values in
CapacityRequestPolicyRange, enabling more precise capacity requests and allocation for devices with fractional resources.
This improves flexibility for workloads that require fine-grained resource allocation. The enhancement is gated by the
`DRAFractionalCapacityRange` feature gate, which is in Beta in 1.37.
-->
[DRA 可消耗容量](https://www.kubernetes.dev/resources/keps/5075)
现在支持在 `CapacityRequestPolicyRange` 中使用小数值，
因而可以对以小数计量的设备容量提出更精确的请求并完成分配，
让需要细粒度资源分配的工作负载更加灵活。
此增强由 1.37 中处于 Beta 阶段的 `DRAFractionalCapacityRange` 特性门控控制。

<!--
## What’s next
-->
## 后续计划 { #whats-next }

<!--
DRA continues to mature with every release. Several features currently in Alpha and Beta are on track to progress in the
coming releases, and the community keeps working on DRA's performance, scalability, and reliability. Expect another
ambitious set of DRA features in Kubernetes 1.38.
-->
DRA 在每个版本中都在不断成熟。
目前处于 Alpha 和 Beta 阶段的多项特性有望在后续版本中继续进阶，
社区也在持续改进 DRA 的性能、可扩展性和可靠性。
Kubernetes 1.38 预计还会带来一系列又一批重要的 DRA 特性。

<!--
## Getting involved
-->
## 参与其中 { #getting-involved }

<!--
A good starting point is joining the WG Device Management [Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and [meetings](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings) which happens at US/EU and EU/APAC friendly time slots.
-->
如果你想参与，可以先加入设备管理工作组（WG Device Management）的
[Slack 频道](https://kubernetes.slack.com/archives/C0409NGC1TK)和
[会议](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings)。
会议时间分别对美国/欧洲和欧洲/亚太地区的参与者比较友好。

<!--
Not all enhancement ideas are tracked as issues yet, so come talk to us if you want to help or have some ideas yourself! We have work to do at all levels, from difficult core changes to usability enhancements in `kubectl` which could be picked up by newcomers.
-->
并非所有增强想法都已经通过 Issue 跟踪，
因此，如果你希望提供帮助或有自己的想法，欢迎与我们交流！
我们在各个层面都有工作可做，
从复杂的核心改动，到适合新手参与的 `kubectl` 易用性增强，不一而足。

<!--
## Acknowledgments
The following KEP owners added or promoted a feature in the 1.37 release (in alphabetic order):
-->
## 致谢 { #acknowledgments }

以下 KEP 负责人在 1.37 版本中新增了特性或推动了特性进阶（按字母顺序排列）：

* Alay Patel ([alaypatel07](https://github.com/alaypatel07))
* Byonggon Chun ([bg-chun](https://github.com/bg-chun))
* Gaurav Ghildiyal ([gauravkghildiyal](https://github.com/gauravkghildiyal))
* Jiefeng Xu ([jiefeng-xu](https://github.com/jiefeng-xu))
* John A. Hull ([johnahull](https://github.com/johnahull))
* Jon Huhn ([nojnhuh](https://github.com/nojnhuh))
* Lionel Jouin ([LionelJouin](https://github.com/LionelJouin))
* Patrick Ohly ([pohly](https://github.com/pohly))
* Praveen Krishna ([pravk03](https://github.com/pravk03))
* Shingo Omura ([everpeace](https://github.com/everpeace))
* Troy Chiu ([troychiu](https://github.com/troychiu))

<!--
This would not have been possible without the help of the reviewers and approvers.
So a huge thanks to everyone else who helped shape this release, in ways big and small. Given enough eyeballs, all bugs are shallow and this release had plenty of them, watching closely and caring enough to make things better. DRA got better this cycle because of all of you.
-->
如果没有 Reviewers 和 Approvers 的帮助，这一切都不可能实现。
因此，也要衷心感谢所有以各种方式为本次发布作出贡献的贡献者。
只要有足够多的人关注，所有缺陷都将无所遁形；
这个版本正是因为有众多贡献者密切关注并用心改进，才变得更加完善。
DRA 在本周期取得的进步，离不开你们每一个人。
