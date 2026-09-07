---
title: DRA 特性
content_type: concept
weight: 40
---
<!--
reviewers:
- klueska
- pohly
title: DRA Features
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This page describes optional DRA features for advanced use cases. Some of
these features require support from the DRA driver. Each feature notes its
maturity and the feature gate that enables it.
-->
本页面针对一些高级用例介绍可选的 DRA 特性。其中一些特性需要 DRA 驱动的支持。
每个特性都注明了其成熟度以及启用该特性的特性门控。

<!-- body -->

<!--
## Partitionable devices
-->
## 可分区设备   {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

<!--
Devices represented in DRA don't necessarily have to be a single unit connected to a single machine,
but can also be a logical device comprised of multiple devices connected to multiple machines.
These devices might consume overlapping resources of the underlying phyical devices,
meaning that when one logical device is allocated other devices will no longer be available.
-->
DRA 中表示的设备不一定必须是连接到单台机器的单个单元，也可以是由连接到多台机器的多个设备组成的逻辑设备。
这些设备可能会消耗底层物理设备的重叠资源，这意味着当分配一个逻辑设备时，其他设备将不再可用。

<!--
In the ResourceSlice API, this is represented as a list of named CounterSets, each of which
contains a set of named counters. The counters represent the resources available on the physical
device that are used by the logical devices advertised through DRA.
-->
在 ResourceSlice API 中，这表示为命名 CounterSet 的列表，每个 CounterSet 包含一组命名计数器。
这些计数器表示物理设备上可用于通过 DRA 通告的逻辑设备的资源。

<!--
Logical devices can specify the ConsumesCounters list. Each entry contains a reference to a CounterSet
and a set of named counters with the amounts they will consume. So for a device to be allocatable,
the referenced counter sets must have sufficient quantity for the counters referenced by the device.

CounterSets must be specified in separate ResourceSlices from devices.
Devices can consume counters from any CounterSet defined in the same resource pool as the device.
-->
逻辑设备可以指定 ConsumesCounters 列表。
每个条目包含对一个 CounterSet 的引用，以及一组命名计数器及其将消耗的数量。
因此，要使设备可分配，被引用的计数器集必须具有足够的数量来满足设备引用的计数器需求。

CounterSet 必须在与设备不同的 ResourceSlice 中指定。
设备可以消耗与其位于同一资源池中的任何 CounterSet 定义的计数器。

<!--
Here is an example of two devices, each consuming 6Gi of memory from a shared counter with 8Gi of memory.
Thus, only one of the devices can be allocated at any point in time.
The scheduler handles this and it is transparent to the consumer as the ResourceClaim API is not affected.
-->
以下是两个设备的示例，每个设备从一个具有 8Gi 内存的共享计数器中消耗 6Gi 内存。
因此，在任何时间点只能分配其中一个设备。
调度器会处理这种情况，并且对使用者是透明的，因为 ResourceClaim API 不受影响。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: resourceslice-with-countersets
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 2
  driver: dra.example.com
  sharedCounters:
  - name: gpu-1-counters
    counters:
      memory:
        value: 8Gi
---
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: resourceslice-with-devices
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 2
  driver: dra.example.com
  devices:
  - name: device-1
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
  - name: device-2
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
```

<!--
Partitionable devices is controlled by the
[`DRAPartitionableDevices` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
in the `kube-apiserver` and `kube-scheduler`.
-->
可分区设备由 `kube-apiserver` 和 `kube-scheduler` 中的
[`DRAPartitionableDevices` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)控制。

<!--
## Device compatibility groups
-->
## 设备兼容性组   {#device-compatibility-groups}

{{< feature-state feature_gate_name="DRADeviceCompatibilityGroups" >}}

<!--
Device compatibility groups let a DRA driver declare which partitioned devices
can be co-allocated on the same physical hardware. Without this feature,
incompatible device combinations are only detected when the kubelet prepares
the Pod on a node — resulting in a failed preparation. With compatibility
groups, the scheduler rejects incompatible combinations at scheduling time,
before any node-side work begins.
-->
设备兼容性组允许 DRA 驱动声明哪些分区设备可以在同一物理硬件上共同分配。
如果没有此特性，不兼容的设备组合只有在 kubelet 在节点上准备 Pod 时才会被检测到 —— 这会导致准备失败。
有了兼容性组，调度器会在调度时、任何节点端工作开始之前就拒绝不兼容的组合。

<!--
This is most useful for hardware that supports mutually exclusive operating
modes. For example, a GPU that can run in either MIG mode or vGPU mode: a
device in MIG mode and a device in vGPU mode cannot be co-allocated because
they consume overlapping physical resources in incompatible ways. By declaring
`compatibilityGroups`, the driver makes this constraint visible to the
scheduler.
-->
这对于支持互斥操作模式的硬件最为有用。例如，可以在 MIG 模式或 vGPU 模式下运行的 GPU：
处于 MIG 模式的设备和处于 vGPU 模式的设备不能共同分配，因为它们以不兼容的方式消耗重叠的物理资源。
通过声明 `compatibilityGroups`，驱动使此约束对调度器可见。

<!--
This feature builds on [partitionable devices](#partitionable-devices): the
`compatibilityGroups` field lives on `device.consumesCounters[]` entries, which
only exist for partitionable devices. Both the `DRADeviceCompatibilityGroups`
and `DRAPartitionableDevices` feature gates must be enabled in the
`kube-apiserver` and `kube-scheduler`.
-->
此特性建立在[可分区设备](#partitionable-devices)的基础之上：
`compatibilityGroups` 字段位于 `device.consumesCounters[]` 条目上，而该条目仅存在于可分区设备中。
`DRADeviceCompatibilityGroups` 和 `DRAPartitionableDevices` 这两个特性门控都必须在
`kube-apiserver` 和 `kube-scheduler` 中启用。

<!--
### How it works
-->
### 工作原理   {#device-compatibility-groups-how-it-works}

<!--
A driver defines a `compatibilityGroups` list for each
`device.consumesCounters[]` entry in a ResourceSlice. The list contains
at most 2 opaque string names that represent the operating mode or partition
type of that device on that particular counter set.
-->
驱动为 ResourceSlice 中的每个 `device.consumesCounters[]` 条目定义一个 `compatibilityGroups` 列表。
该列表最多包含 2 个不透明的字符串名称，表示该设备在该特定计数器集上的操作模式或分区类型。

<!--
When the scheduler allocates multiple devices that draw from the same counter
set, it computes the intersection of their `compatibilityGroups`. Allocation
succeeds only if that intersection is non-empty — meaning every co-allocated
device shares at least one common group name. Devices drawing from different
counter sets are never compared against each other.
-->
当调度器分配从同一计数器集获取资源的多个设备时，它会计算这些设备的 `compatibilityGroups` 的交集。
只有当该交集非空时 —— 即每个共同分配的设备至少共享一个共同的组名 —— 分配才会成功。
从不同计数器集获取资源的设备永远不会相互比较。

<!--
A device that declares no groups (an unset, nil, or empty list) is treated as
a special case: it is only co-allocatable with other no-group devices on the
same counter set. It is never co-allocatable with a device that declares one or
more groups.
-->
未声明任何组的设备（未设置、为 nil 或为空列表）被视为特殊情况：它只能与同一计数器集上其他没有组的设备共同分配。
它永远不能与声明了一个或多个组的设备共同分配。

<!--
The constraint applies across all claims being allocated in a single scheduling
cycle: if two claims each allocate a device from the same counter set, the
cross-claim group intersection is also enforced.
-->
此约束适用于在单个调度周期内分配的所有声明：
如果两个声明各自从同一计数器集分配一个设备，则跨声明的组交集也会被强制执行。

<!--
### Example {#device-compatibility-groups-example}

Consider a GPU that can operate in either MIG mode or vGPU mode. The driver
publishes two devices, each consuming 4 GiB from the same shared memory counter
of 8 GiB. Based on counter capacity alone, both devices could be allocated
together. Each device declares its operating mode as a compatibility group,
making the two modes mutually exclusive:
-->
### 示例   {#device-compatibility-groups-example}

考虑一个可以在 MIG 模式或 vGPU 模式下运行的 GPU。
驱动发布两个设备，每个设备从同一个 8 GiB 的共享内存计数器中消耗 4 GiB。
仅根据计数器容量，两个设备可以一起分配。每个设备将其操作模式声明为一个兼容性组，从而使两种模式互斥：

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-counters
spec:
  nodeName: worker-1
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 2
  driver: gpu.example.com
  sharedCounters:
  - name: gpu-0-memory
    counters:
      memory:
        value: 8Gi
---
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-devices
spec:
  nodeName: worker-1
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 2
  driver: gpu.example.com
  devices:
  - name: gpu-0-mig
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 4Gi
      compatibilityGroups:
      - mig
  - name: gpu-0-vgpu
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 4Gi
      compatibilityGroups:
      - vgpu
```

<!--
In this example:
- `gpu-0-mig` belongs to the `mig` group.
- `gpu-0-vgpu` belongs to the `vgpu` group.
-->
在此示例中：

- `gpu-0-mig` 属于 `mig` 组。
- `gpu-0-vgpu` 属于 `vgpu` 组。

<!--
If a Pod or PodGroup requests two devices from this pool, the scheduler checks
whether the two chosen devices share a common compatibility group on the
`gpu-0-memory` counter set. Since `{"mig"} ∩ {"vgpu"} = ∅`, the pair is
rejected — even though the counter set has enough memory for both. Both
requests can only be satisfied by two MIG devices (or two vGPU devices) from a
pool where such pairs exist.
-->
如果一个 Pod 或 PodGroup 从该资源池请求两个设备，
调度器会检查所选的两个设备在 `gpu-0-memory` 计数器集上是否共享一个共同的兼容性组。
由于 `{"mig"} ∩ {"vgpu"} = ∅`，该设备对会被拒绝——即使计数器集有足够的内存同时满足两者。
两个请求只能通过来自存在此类设备对的资源池中的两个 MIG 设备（或两个 vGPU 设备）来满足。

<!--
### Constraints {#device-compatibility-groups-constraints}
-->
### 约束条件   {#device-compatibility-groups-constraints}

<!--
- Each `consumesCounters[]` entry may declare at most **2** group names.
- Group names must be unique within a single entry.
- Group names are opaque to Kubernetes; they are meaningful only within the
  publishing driver's pool.
- Groups are compared per counter set: groups on one counter set have no effect
  on co-allocation decisions for a different counter set.
-->
- 每个 `consumesCounters[]` 条目最多可以声明 **2** 个组名。
- 组名在单个条目内必须唯一。
- 组名对 Kubernetes 是不透明的；它们仅在发布驱动的资源池内有意义。
- 组按计数器集进行比较：一个计数器集上的组对另一个计数器集的共同分配决策没有影响。

<!--
### Version-skew safety {#device-compatibility-groups-version-skew}
-->
### 版本偏差安全   {#device-compatibility-groups-version-skew}

<!--
When the `DRADeviceCompatibilityGroups` feature gate is disabled (the default
for alpha), the kube-apiserver strips the `compatibilityGroups` field from any
new or updated ResourceSlice — unless the old object already had the field
set. The scheduler then treats devices in any pool that previously had grouped
devices as belonging to an incomplete pool and skips them entirely.
-->
当 `DRADeviceCompatibilityGroups` 特性门控被禁用时（Alpha 阶段的默认设置），
kube-apiserver 会从任何新的或更新的 ResourceSlice 中剥离 `compatibilityGroups`
字段——除非旧对象已经设置了该字段。
然后，调度器会将任何以前有分组设备的资源池中的设备视为属于不完整的资源池，并完全跳过它们。

<!--
Only a non-empty list counts as the field being set: `compatibilityGroups: null`
and `compatibilityGroups: []` are treated identically to omitting the field.
Devices with them behave exactly like devices with no groups — they do not
cause the scheduler to treat the pool as incomplete.
-->
只有非空列表才算作设置了该字段：`compatibilityGroups: null` 和 `compatibilityGroups: []`
被视为与省略该字段相同。
带有这些值的设备的行为与没有组的设备完全相同 —— 它们不会导致调度器将资源池视为不完整。

<!--
Device compatibility groups is controlled by the
[`DRADeviceCompatibilityGroups` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceCompatibilityGroups)
in the kube-apiserver and kube-scheduler. The
[`DRAPartitionableDevices` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
must also be enabled.
-->
设备兼容性组由 kube-apiserver 和 kube-scheduler 中的
[`DRADeviceCompatibilityGroups` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceCompatibilityGroups)控制。
同时还必须启用
[`DRAPartitionableDevices` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)。

<!--
## Consumable capacity
-->
## 可消耗容量   {#consumable-capacity}

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

<!--
The consumable capacity feature allows the same devices to be consumed by multiple independent ResourceClaims,
with the Kubernetes scheduler managing how much of the device's capacity is used up by each claim.
This is analogous to how Pods can share the resources on a Node; ResourceClaims can share the resources on a Device.

The device driver can set `allowMultipleAllocations` field added in `.spec.devices` of `ResourceSlice`
to allow allocating that device to multiple independent ResourceClaims or to multiple requests within a ResourceClaim.
-->
可消耗容量特性允许多个独立的 ResourceClaim 消耗同一设备，由 Kubernetes 调度器管理每个声明消耗了多少设备容量。
这类似于 Pod 如何共享节点上的资源；ResourceClaim 可以共享设备上的资源。

设备驱动可以设置 `ResourceSlice` 的 `.spec.devices` 中新增的 `allowMultipleAllocations` 字段，
以允许将该设备分配给多个独立的 ResourceClaim 或一个 ResourceClaim 内的多个请求。

<!--
Users can set `capacity` field added in `spec.devices.requests` of `ResourceClaim` to specify the device resource requirements for each allocation.
-->
用户可以设置 `ResourceClaim` 的 `spec.devices.requests` 中新增的 `capacity` 字段，以指定每次分配的设备资源需求。

<!--
For the device that allows multiple allocations, the requested capacity is drawn from — or consumed from — its total capacity,
a concept known as **consumable capacity**.
Then, the scheduler ensures that the aggregate consumed capacity across all claims does not exceed the device's overall capacity.
Furthermore, driver authors can use the `requestPolicy` constraints on individual device capacities to control
how those capacities are consumed.
For example, the driver author can specify that a given capacity is only consumed in increments of 1Gi.
-->
对于允许多次分配的设备，所请求的容量从其总容量中提取（即消耗），这一概念被称为**可消耗容量**。
然后，调度器确保所有声明的总消耗容量不超过设备的整体容量。
此外，驱动开发者可以对各个设备容量使用 `requestPolicy` 约束来控制这些容量的消耗方式。
例如，驱动开发者可以指定某个容量只能以 1Gi 的增量消耗。

<!--
Here is an example of a network device which allows multiple allocations and contains a consumable bandwidth capacity.
-->
下面是一个网络设备的示例，该设备允许多次分配并包含可消耗的带宽容量。

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: eth1
    allowMultipleAllocations: true
    attributes:
      name:
        string: "eth1"
    capacity:
      bandwidth:
        requestPolicy:
          default: "1M"
          validRange:
            min: "1M"
            step: "8"
        value: "10G"
```

<!--
The consumable capacity can be requested as shown in the below example.
-->
可消耗容量的请求方式如下例所示。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: bandwidth-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          capacity:
            requests:
              bandwidth: 1G
```

<!--
The allocation result will include the consumed capacity and the identifier of the share.
-->
分配结果将包含已消耗的容量和共享标识符。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
status:
  allocation:
    devices:
      results:
      - consumedCapacity:
          bandwidth: 1G
        device: eth1
        shareID: "a671734a-e8e5-11e4-8fde-42010af09327"
```

<!--
In this example, a multiply-allocatable device was chosen. However, any `resource.example.com` device
with at least the requested 1G bandwidth could have met the requirement.
If a non-multiply-allocatable device were chosen, the allocation would have resulted in the entire device.
To force the use of a only multiply-allocatable devices, you can use the CEL criteria `device.allowMultipleAllocations == true`.
-->
在本例中，选择了一个可多次分配的设备。
然而，任何至少具有所请求 1G 带宽的 `resource.example.com` 设备都可以满足该需求。
如果选择了不可多次分配的设备，则分配将占用整个设备。
要强制只使用可多次分配的设备，可以使用 CEL 条件 `device.allowMultipleAllocations == true`。

<!--
### DistinctAttribute constraint

When requesting multiple devices in a ResourceClaim, you can use the DistinctAttribute
constraint to ensure that each allocated device has a different value for a specified
attribute. This constraint was introduced with the consumable capacity feature.
-->
### DistinctAttribute 约束   {#distinctattribute-constraint}

在一个 ResourceClaim 中请求多个设备时，你可以使用 DistinctAttribute
约束来确保每个已分配设备在指定属性上具有不同的值。此约束是随可消耗容量特性一起引入的。

<!--
The DistinctAttribute constraint is particularly useful when working with
multiply-allocatable devices. It prevents the scheduler from allocating the same
device multiple times within a single ResourceClaim, even when that device allows
multiple allocations.
-->
DistinctAttribute 约束在处理可多次分配的设备时特别有用。
它可以防止调度器在单个 ResourceClaim 内多次分配同一设备，即使该设备允许多次分配也是如此。

<!--
Beyond preventing duplicate allocations, this constraint helps optimize performance
by ensuring devices are distributed based on their attributes. For example, you can
use it to distribute devices across different NUMA nodes to optimize memory bandwidth
and reduce contention.
-->
除了防止重复分配外，此约束还有助于通过确保设备根据其属性分布来优化性能。
例如，你可以使用它在不同的 NUMA 节点间分布设备，以优化内存带宽并减少争用。

<!--
## Granular status authorization
-->
## 细粒度状态授权   {#granular-status-authorization}

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

<!--
Starting in Kubernetes v1.36, DRA enforces fine-grained authorization checks for updates
to `ResourceClaim` status by using synthetic subresources and node-aware verbs.
-->
从 Kubernetes v1.36 开始，DRA 通过使用合成子资源和节点感知动词，对 `ResourceClaim` 状态的更新实施细粒度的授权检查。

<!--
For security hardening guidance, including RBAC examples for scheduler and DRA
drivers, see
[Hardening Guide - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/).

For a step-by-step cluster administrator procedure, see
[Harden Dynamic Resource Allocation in Your Cluster](/docs/tasks/administer-cluster/hardening-dra/).
-->
有关安全加固指南（包括调度器和 DRA 驱动的 RBAC 示例），
请参见[加固指南 - 动态资源分配](/zh-cn/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)。

有关集群管理员的分步操作流程，请参见[在集群中加固动态资源分配](/zh-cn/docs/tasks/administer-cluster/hardening-dra/)。

<!--
## Optional node operations
-->
## 可选节点操作   {#optional-node-operations}

{{< feature-state feature_gate_name="DRAOptionalNodeOperations" >}}

<!--
In Dynamic Resource Allocation (DRA), the `kubelet` coordinates with a node-local
driver via gRPC to prepare allocated devices before container start
(`NodePrepareResources`) and to unprepare them upon Pod termination
(`NodeUnprepareResources`). While this setup is critical for node-local hardware
such as GPUs or FPGAs, some resources are managed entirely in the control plane
and require no node-local setup.
-->
在动态资源分配（DRA）中，`kubelet` 通过 gRPC 与节点本地驱动协作，
在容器启动前准备已分配的设备（`NodePrepareResources`），并在 Pod 终止时取消准备（`NodeUnprepareResources`）。
虽然这种设置对于 GPU 或 FPGA 等节点本地硬件至关重要，但某些资源完全在控制平面中管理，不需要节点本地设置。

<!--
The optional node operations feature allows resource drivers to declare that
specific node-local gRPC operations can be skipped. When configured, the `kubelet`
bypasses driver lookup and gRPC calls for those devices, eliminating the need to
deploy and maintain empty node-local drivers on every worker node.
-->
可选节点操作特性允许资源驱动声明可以跳过特定的节点本地 gRPC 操作。
配置后，`kubelet` 会绕过这些设备的驱动查找和 gRPC 调用，从而无需在每个工作节点上部署和维护空的节点本地驱动。

<!--
### Driver configuration

Driver authors can specify the `skipNodeOperations` field in
`.spec.skipNodeOperations` of a ResourceSlice. This field is a list of unique
strings specifying the node-local operations to bypass for all devices in that
slice.
-->
### 驱动配置   {#driver-configuration}

驱动开发者可以在 ResourceSlice 的 `.spec.skipNodeOperations` 中指定 `skipNodeOperations` 字段。
该字段是一个唯一字符串列表，指定要为该切片中所有设备绕过的节点本地操作。

<!--
Valid values are:
-->
有效值包括：

<!--
* `"NodePrepareResources"`: Skips `NodePrepareResources` gRPC calls. This value
  cannot be specified unless `"NodeUnprepareResources"` is also listed (or `"*"`
  is specified). This limitation avoids Pods getting stuck in Terminating if a
  node-local plugin is missing, since the plugin is not checked during Pod
  startup when preparation is skipped.
-->
* `"NodePrepareResources"`：跳过 `NodePrepareResources` gRPC 调用。
  除非同时列出了 `"NodeUnprepareResources"`（或指定了 `"*"`），否则不能指定该值。
  此限制避免了在缺少节点本地插件时 Pod 卡在 Terminating 状态的问题，因为当跳过准备操作时，
  Pod 启动期间不会检查插件。

<!--
* `"NodeUnprepareResources"`: Skips `NodeUnprepareResources` gRPC calls.

* `"*"`: Skips all node-local resource operations.
-->
* `"NodeUnprepareResources"`：跳过 `NodeUnprepareResources` gRPC 调用。

* `"*"`：跳过所有节点本地资源操作。

<!--
Here is an example of a ResourceSlice for a control-plane resource that skips
all node-local operations:
-->
以下是一个用于控制平面资源的 ResourceSlice 示例，该资源跳过所有节点本地操作：

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: control-plane-resources
spec:
  nodeName: worker-1
  pool:
    name: central-pool
    generation: 1
    resourceSliceCount: 1
  driver: control-plane.example.com
  skipNodeOperations:
  - "*"
  devices:
  - name: virtual-device-1
```

<!--
### Allocation result and execution

When the Kubernetes scheduler allocates a device to a ResourceClaim, it copies
the `skipNodeOperations` list from the ResourceSlice into the allocation
result:
-->
### 分配结果与执行   {#allocation-result-and-execution}

当 Kubernetes 调度器将设备分配给 ResourceClaim 时，
它会将 `skipNodeOperations` 列表从 ResourceSlice 复制到分配结果中：

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
status:
  allocation:
    devices:
      results:
      - device: virtual-device-1
        driver: control-plane.example.com
        pool: central-pool
        skipNodeOperations:
        - "*"
```

<!--
When a Pod runs on a node, the `kubelet` reads the allocation results. If all
allocated devices for a given driver within a ResourceClaim skip a specific
operation, the `kubelet` completely bypasses calling that gRPC hook for that
driver.
-->
当 Pod 在节点上运行时，`kubelet` 读取分配结果。
如果 ResourceClaim 中某个给定驱动的所有已分配设备都跳过某项特定操作，
则 `kubelet` 会完全绕过对该驱动的该 gRPC 钩子调用。

<!--
### Operational considerations

#### In-place driver updates
-->
### 操作注意事项   {#operational-considerations}

#### 原地驱动更新   {#in-place-driver-updates}

<!--
Because the `skipNodeOperations` setting is copied from the ResourceSlice into
the ResourceClaim at allocation time, running Pods and active allocations
retain whatever setting was in place when they were scheduled.
-->
由于 `skipNodeOperations` 设置是在分配时从 ResourceSlice 复制到 ResourceClaim 中的，
因此正在运行的 Pod 和活跃的分配会保留它们被调度时的设置。

<!--
If a driver's node operation requirements are updated in place (for example,
changing from requiring node operations to skipping them), existing claims will
still use the previous configuration. To avoid issues—such as terminating Pods
hanging while waiting for a decommissioned node plugin—cluster administrators
should ensure no active claims exist for a driver before altering its node
operation requirements or removing node-local driver DaemonSets.
-->
如果驱动的节点操作要求被原地更新（例如，从需要节点操作变为跳过节点操作），现有的声明仍将使用之前的配置。
为避免出现问题 —— 例如终止中的 Pod 在等待已停用的节点插件时挂起 —— 集群管理员应在更改驱动的节点操作要求或移除节点本地驱动 DaemonSet
之前，确保该驱动没有活跃的声明存在。

<!--
#### Node declared features integration
-->
#### 节点声明特性集成   {#node-declared-features-integration}

<!--
To prevent Pods from being scheduled onto nodes where the `kubelet` does not
support skipping DRA operations (which would cause the `kubelet` to fail while
waiting for a missing node plugin), this feature integrates with [Node Declared
Features](/docs/concepts/scheduling-eviction/node-declared-features/). When a
Pod uses a ResourceClaim with `skipNodeOperations` configured, the Kubernetes
scheduler verifies that the target node declares support for the
`DRAOptionalNodeOperations` feature in its `.status.declaredFeatures` before
scheduling the Pod.
-->
为了防止 Pod 被调度到 `kubelet` 不支持跳过 DRA 操作的节点上（这会导致 `kubelet` 在等待缺失的节点插件时失败），
该特性与[节点声明特性](/zh-cn/docs/concepts/scheduling-eviction/node-declared-features/)集成。
当 Pod 使用配置了 `skipNodeOperations` 的 ResourceClaim 时，Kubernetes 调度器会在调度 Pod 之前，
验证目标节点是否在其 `.status.declaredFeatures` 中声明了对 `DRAOptionalNodeOperations` 特性的支持。

<!--
Optional node operations is controlled by the
[`DRAOptionalNodeOperations`](/docs/reference/command-line-tools-reference/feature-gates/#DRAOptionalNodeOperations)
feature gate in the `kube-apiserver`, `kube-scheduler`, and `kubelet`.
-->
可选节点操作由 `kube-apiserver`、`kube-scheduler` 和 `kubelet` 中的
[`DRAOptionalNodeOperations`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAOptionalNodeOperations)
特性门控控制。

<!--
## DRA device metadata in containers {#device-metadata}
-->
## 容器中的 DRA 设备元数据   {#device-metadata}

{{< feature-state state="alpha" for_k8s_version="v1.36" >}}

<!--
DRA drivers can expose device metadata such as device attributes (PCI bus
addresses or mdevUUID for mediated devices) or network configuration directly
to containers as JSON files.
This lets applications inside the container discover information about allocated
devices without querying the Kubernetes API or building custom controllers.
-->
DRA 驱动可以将设备元数据（例如设备属性 —— PCI 总线地址或中介设备的 mdevUUID —— 或网络配置）作为 JSON 文件直接暴露给容器。
这使得容器内的应用无需查询 Kubernetes API 或构建自定义控制器即可发现已分配设备的信息。

<!--
KEP-5304 defines a
[device metadata protocol](#device-metadata-protocol) that drivers must
follow so applications inside the container see a consistent layout across
drivers and clusters. The
[DRA kubelet plugin library](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
implements this protocol for you; the rest of this section describes how to
use it.
-->
KEP-5304 定义了驱动必须遵循的[设备元数据协议](#device-metadata-protocol)，
以便容器内的应用在不同驱动和集群之间看到一致的布局。
[DRA kubelet 插件库](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)为你实现了此协议；
本节其余部分介绍如何使用它。

<!--
Device metadata follows the same rules as device access: it is available inside
a container only when that container requests the device in its container
specification, and not otherwise. For how to request DRA devices in Pods and
containers, see
[Request devices in workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads).
-->
设备元数据遵循与设备访问相同的规则：仅当容器在其容器规约中请求该设备时，元数据才在容器内可用，否则不可用。
有关如何在 Pod 和容器中请求 DRA 设备，请参阅[在工作负载中使用 DRA 请求设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads)。

<!--
### Device metadata protocol

The protocol consists of four rules:
-->
### 设备元数据协议   {#device-metadata-protocol}

该协议包含四条规则：

<!--
1. **File paths.** Metadata files live inside containers under
   `/var/run/kubernetes.io/dra-device-attributes`. For a directly referenced
   ResourceClaim the path is
   `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`; for a
   claim created from a ResourceClaimTemplate the path is
   `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`
   (where `podClaimName` is `pod.spec.resourceClaims[].name`).
-->
1. **文件路径。** 元数据文件位于容器内的 `/var/run/kubernetes.io/dra-device-attributes` 目录下。
   对于直接引用的 ResourceClaim，路径为
   `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`；
   对于从 ResourceClaimTemplate 创建的声明，路径为
   `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`
   （其中 `podClaimName` 是 `pod.spec.resourceClaims[].name`）。

   <!--
   In cases where the ResourceClaim request uses the
   [prioritized list](#prioritized-list) feature, only the top-level request
   name is used for the `<requestName>` segment in the file path (that is,
   the `/<subrequest>` portion is dropped). Inside the
   JSON file, the `requests[].name` field carries the full
   `<request>/<subrequest>` reference (for example, `gpu/high-memory`) so
   that consumers can identify which alternative was allocated.
   -->
   当 ResourceClaim 请求使用[优先级列表](#prioritized-list)特性时，
   文件路径中的 `<requestName>` 段仅使用顶层请求名称（即，`/<subrequest>` 部分被丢弃）。
   在 JSON 文件内部， `requests[].name` 字段携带完整的 `<request>/<subrequest>`
   引用（例如 `gpu/high-memory`），以便消费者能够识别分配的是哪个备选项。

   <!--
   The path constants are defined in
   [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata).
   -->
   路径常量定义在 [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata) 中。

<!--
1. **JSON API.** Each file is a stream of one or more
   [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
   objects serialized as versioned JSON with `apiVersion` and `kind`, following
   Kubernetes API conventions. The same metadata is encoded once per supported
   API version (newest first). All objects in the stream are semantically
   equivalent; consumers should use the first object they can decode.
-->
1. **JSON API。** 每个文件是一个或多个
   [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
   对象的流，这些对象按照 Kubernetes API 约定，序列化为带有 `apiVersion` 和 `kind` 的版本化 JSON。
   相同的元数据针对每个支持的 API 版本编码一次（最新版本优先）。
   流中的所有对象在语义上是等价的；消费者应使用他们能够解码的第一个对象。

<!--
1. **Generation.** When a driver updates a metadata file the embedded
   `metadata.generation` field must increase so consumers can detect changes.
-->
1. **世代号。** 当驱动更新元数据文件时，嵌入的 `metadata.generation` 字段必须递增，以便消费者能够检测到变化。

<!--
1. **Container exposure.** Files are typically exposed via
   {{< glossary_tooltip text="CDI" term_id="cdi" >}} bind-mounts, but other
   mechanisms are permitted as long as the file appears at the correct path and
   is read-only inside the container.
-->
1. **容器暴露。** 文件通常通过 {{< glossary_tooltip text="CDI" term_id="cdi" >}} 绑定挂载暴露，
   但也允许使用其他机制，只要文件出现在正确的路径上并且在容器内是只读的。

<!--
### How device metadata works {#device-metadata-how-it-works}
-->
### 设备元数据如何工作   {#device-metadata-how-it-works}

<!--
Device metadata is a driver-side feature that does not require any Kubernetes
API changes or feature gates. Using the DRA kubelet plugin library is a common
way to implement a driver, but drivers can be built in other ways as well.
Drivers that use the kubelet plugin enable this feature by passing the
`EnableDeviceMetadata` and `MetadataVersions`
[options](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Option)
when starting the plugin. `MetadataVersions` specifies which API versions are
serialized into the metadata file and must be set explicitly by the driver.
Check the documentation of your DRA driver to learn whether device metadata is
supported and how to enable it.
-->
设备元数据是一个驱动端的特性，不需要任何 Kubernetes API 更改或特性门控。
使用 DRA kubelet 插件库是实现驱动的常用方式，但驱动也可以通过其他方式构建。
使用 kubelet 插件的驱动通过在启动插件时传递 `EnableDeviceMetadata` 和 `MetadataVersions`
[选项](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Option)来启用此特性。
`MetadataVersions` 指定哪些 API 版本被序列化到元数据文件中，并且必须由驱动显式设置。
请查看你的 DRA 驱动的文档，了解是否支持设备元数据以及如何启用它。

<!--
When device metadata is enabled, the driver generates metadata files and CDI
bind-mount specifications while preparing the allocated devices for the pod,
before the consuming containers start. The metadata appears inside containers at
the well-known paths as [defined above](#device-metadata-protocol).
-->
启用设备元数据后，驱动在为 Pod 准备已分配设备时、在消费容器启动之前，生成元数据文件和 CDI 绑定挂载规约。
元数据按照[上文定义](#device-metadata-protocol)的知名路径出现在容器内部。

<!--
When a single request allocates devices from multiple DRA drivers, each driver
writes its own metadata file. Containers enumerate `*-metadata.json` files in
the request directory to discover all devices.
-->
当单个请求从多个 DRA 驱动分配设备时，每个驱动写入自己的元数据文件。
容器枚举请求目录中的 `*-metadata.json` 文件以发现所有设备。

<!--
The Go package
[`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata)
provides utilities for reading and decoding these metadata files by applications
inside the container.
-->
Go 包 [`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata)
提供了供容器内应用读取和解码这些元数据文件的工具。

<!--
### Metadata schema {#device-metadata-schema}

Each metadata file conforms to the
[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
API (`metadata.resource.k8s.io/v1alpha1`).
The following example shows a metadata file for a GPU device allocated through
a ResourceClaimTemplate:
-->
### 元数据模式   {#device-metadata-schema}

每个元数据文件都符合
[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata) API
（`metadata.resource.k8s.io/v1alpha1`）。以下示例显示了通过 ResourceClaimTemplate 分配的 GPU 设备的元数据文件：

```json
{
  "kind": "DeviceMetadata",
  "apiVersion": "metadata.resource.k8s.io/v1alpha1",
  "metadata": {
    "name": "pod0-gpu-2kqrd",
    "namespace": "gpu-test1",
    "uid": "c7e7b22e-239b-4498-b27c-7f1344481e14",
    "generation": 1
  },
  "podClaimName": "gpu",
  "requests": [
    {
      "name": "gpu",
      "devices": [
        {
          "driver": "gpu.example.com",
          "pool": "worker-0",
          "name": "gpu-0",
          "attributes": {
            "driverVersion": {
              "version": "1.0.0"
            },
            "index": {
              "int": 0
            },
            "model": {
              "string": "LATEST-GPU-MODEL"
            },
            "uuid": {
              "string": "gpu-18db0e85-99e9-c746-8531-ffeb86328b39"
            }
          }
        }
      ]
    }
  ]
}
```

<!--
### Immediate and deferred metadata

Drivers provide metadata in one of two ways:
-->
### 即时元数据与延迟元数据   {#device-metadata-lifecycle}

驱动以以下两种方式之一提供元数据：

<!--
Immediate
: The driver populates metadata while preparing the claim on the
  node and writes the metadata file before the container starts. This is
  typical for GPU drivers where device information is known at preparation time.
-->
即时
: 驱动在节点上准备声明时填充元数据，并在容器启动前写入元数据文件。
  这是 GPU 驱动的典型情况，设备信息在准备时已知。

<!--
Deferred
: In some cases, for example a network driver, the device information is
  not available during device allocation time but becomes available after the
  pod sandbox is created. In those cases the driver creates the CDI mount with
  an empty metadata file and writes the actual metadata later via an NRI hook
  that runs before the container starts. This ensures applications never see a
  missing or partially written file. Each update must increment
  `metadata.generation` so consumers can detect changes. The `MetadataUpdater`
  API in the DRA kubelet plugin library handles generation bookkeeping
  automatically for driver authors.
-->
延迟
: 在某些情况下，例如网络驱动，设备信息在设备分配时不可用，但在 Pod 沙箱创建后变为可用。
  在这些情况下，驱动使用空的元数据文件创建 CDI 挂载，然后通过在容器启动前运行的 NRI
  钩子稍后写入实际元数据。这确保应用永远不会看到缺失或部分写入的文件。
  每次更新都必须递增 `metadata.generation`，以便消费者能够检测到变化。
  DRA kubelet 插件库中的 `MetadataUpdater`API 为驱动开发者自动处理世代号的簿记工作。

<!--
In both cases, metadata remains available to each consuming container for the
lifetime of that container. Metadata files are cleaned up after all containers
in the Pod have terminated.
-->
在两种情况下，元数据在每个消费容器的生命周期内都保持可用。
元数据文件在 Pod 中的所有容器终止后被清理。

<!--
To learn how to use device metadata in your workloads, see
[Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/).
-->
要了解如何在工作负载中使用设备元数据，
参阅[访问 DRA 设备元数据](/zh-cn/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)。

<!--
### Custom drivers {#device-metadata-custom-drivers}

Custom, hand-crafted drivers that do not use the DRA kubelet plugin library
must implement the [device metadata protocol](#device-metadata-protocol)
themselves. That means writing `DeviceMetadata` JSON at the correct file paths,
incrementing `metadata.generation` on every update, and exposing the files
read-only inside the container through CDI or an equivalent mechanism.
-->
### 自定义驱动   {#device-metadata-custom-drivers}

不使用 DRA kubelet 插件库的自定义手工驱动必须自己实现[设备元数据协议](#device-metadata-protocol)。
这意味着在正确的文件路径写入 `DeviceMetadata` JSON，每次更新时递增 `metadata.generation`，
并通过 CDI 或等效机制将文件以只读方式暴露在容器内部。
