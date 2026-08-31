---
title: DRA 的工作原理
content_type: concept
weight: 20
---
<!--
reviewers:
- klueska
- pohly
title: How DRA Works
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
This page describes how Kubernetes allocates devices to workloads with dynamic
resource allocation (DRA), and how pre-scheduled Pods interact with the process.
-->
本页介绍 Kubernetes 如何通过动态资源分配（DRA）为工作负载分配设备，
以及预先调度的 Pod 如何与该流程交互。

<!-- body -->

<!--
## How resource allocation with DRA works {#how-it-works}
-->
## 如何使用 DRA 进行资源分配 {#how-it-works}

<!--
The following sections describe the workflow for the various
[types of DRA users](/docs/concepts/resource-management/dynamic-resource-allocation/#dra-user-types)
and for the Kubernetes system during
dynamic resource allocation.
-->
以下各节描述了各种
[DRA 用户类型](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/#dra-user-types)的工作流，
以及 Kubernetes 系统在动态资源分配过程中的工作流。

<!--
### Workflow for users {#user-workflow}
-->
### 用户的工作流 {#user-workflow}

<!--
1. **Driver creation**: device owners or third-party entities create drivers
   that can create and manage ResourceSlices in the cluster. These drivers
   optionally also create DeviceClasses that define a category of devices and
   how to request them.
-->
1. **驱动创建：** 设备所有者或第三方实体创建驱动，
   这些驱动能够在集群中创建和管理 ResourceSlice。
   这些驱动还可以选择性地创建 DeviceClass，
   用于定义设备的类别以及如何请求它们。

<!--
1. **Cluster configuration**: cluster admins create clusters, attach devices to
   nodes, and install the DRA device drivers. Cluster admins optionally create
   DeviceClasses that define categories of devices and how to request them.
-->
2. **集群配置：** 集群管理员创建集群、将设备附加到节点并安装 DRA 设备驱动。
   集群管理员还可以选择性地创建 DeviceClass，
   用于定义设备的类别以及如何请求它们。

<!--
1. **Resource claims**: workload operators create ResourceClaimTemplates or
   ResourceClaims that request specific device configurations within a
   DeviceClass. In the same step, workload operators modify their Kubernetes
   manifests to request those ResourceClaimTemplates or ResourceClaims.
-->
3. **资源申领：** 工作负载运维人员创建 ResourceClaimTemplate 或 ResourceClaim，
   在 DeviceClass 中请求特定设备配置。在同一阶段，
   工作负载运维人员修改其 Kubernetes 清单以请求这些
   ResourceClaimTemplate 或 ResourceClaim。

<!--
### Workflow for Kubernetes {#kubernetes-workflow}
-->
### Kubernetes 的工作流 {#kubernetes-workflow}

<!--
1. **ResourceSlice creation**: drivers in the cluster create ResourceSlices that
   represent one or more devices in a managed pool of similar devices.
-->
1. **ResourceSlice 创建：** 集群中的驱动创建 ResourceSlice，
   用于表示被管理的同类设备池中一个或多个设备。

<!--
1. **Workload creation**: the cluster control plane checks new workloads for
   references to ResourceClaimTemplates or to specific ResourceClaims.
-->
2. **工作负载创建：** 集群控制平面检查新工作负载中是否引用了
   ResourceClaimTemplate 或特定的 ResourceClaim。

   <!--
   * If the workload uses a ResourceClaimTemplate, a controller named the
     `resourceclaim-controller` generates ResourceClaims for the workload.
   * If the workload uses a specific ResourceClaim, Kubernetes checks whether
     that ResourceClaim exists in the cluster. If the ResourceClaim doesn't
     exist, the Pods won't deploy.
   -->
   *  如果工作负载使用 ResourceClaimTemplate，名为 `resourceclaim-controller`
      的控制器会为该工作负载生成 ResourceClaim。
   *  如果工作负载使用特定的 ResourceClaim，Kubernetes 会检查该
      ResourceClaim 在集群中是否存在。如果 ResourceClaim 不存在，
      Pod 将无法部署。

<!--
1. **ResourceSlice filtering**: for every Pod, Kubernetes checks the
   ResourceSlices in the cluster to find a device that satisfies all of the
   following criteria:

   * The nodes that can access the resources are eligible to run the Pod.
   * The ResourceSlice has unallocated resources that match the requirements of
     the Pod's ResourceClaim.
-->
3. **ResourceSlice 过滤：** 对于每个 Pod，Kubernetes 检查集群中的 ResourceSlice，
   以找到满足以下所有条件的设备：

   * 可以访问这些资源的节点有资格运行该 Pod。
   * ResourceSlice 具有与 Pod 的 ResourceClaim 需求匹配的未分配资源。

<!--
1. **Resource allocation**: after finding an eligible ResourceSlice for a
   Pod's ResourceClaim, the Kubernetes scheduler updates the ResourceClaim
   with the allocation details. The scheduler uses a first-fit strategy and
   evaluates pools and ResourceSlices in lexicographical order by their names.
   Drivers can prioritize specific slices or pools by naming them appropriately.
   For details, see
   [Naming and prioritization](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#resourceslice-naming-and-prioritization).
-->
4. **资源分配：** 在为 Pod 的 ResourceClaim 找到合格的 ResourceSlice 后，
   Kubernetes 调度器使用分配详情更新 ResourceClaim。
   调度器使用最先适应（first-fit）策略，并按池和 ResourceSlice 的名称字典序对其进行评估。
   驱动可以通过适当的命名为特定的 slice 或池设置优先级。详细信息请参阅
   [命名与优先级](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#resourceslice-naming-and-prioritization)。

<!--
1. **Pod scheduling**: when resource allocation is complete, the scheduler
   places the Pod on a node that can access the allocated resource. The device
   driver and the `kubelet` on that node coordinate via gRPC to configure the
   device and the Pod's access to the device, unless the driver declared
   [optional node operations](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#optional-node-operations)
   for devices that do not require node-local preparation or cleanup.
-->
5. **Pod 调度：** 资源分配完成后，调度器将 Pod 放置在可以访问所分配资源的节点上。
   该节点上的设备驱动和 `kubelet` 通过 gRPC 协调以配置设备和 Pod
   对设备的访问权限，除非驱动为不需要节点本地制备或清理的设备声明了
   [可选的节点操作](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#optional-node-operations)。

<!--
## Pre-scheduled Pods
-->
## 预先调度的 Pod

<!--
When you - or another API client - create a Pod with `spec.nodeName` already set, the scheduler gets bypassed.
If some ResourceClaim needed by that Pod does not exist yet, is not allocated
or not reserved for the Pod, then the kubelet will fail to run the Pod and
re-check periodically because those requirements might still get fulfilled later.
-->
当你（或另一个 API 客户端）创建 Pod 时，如果 `spec.nodeName` 已经被设置，
调度器将被绕开。如果该 Pod 所需的某个 ResourceClaim 尚不存在、尚未分配或未为该 Pod
保留，那么 kubelet 将无法运行该 Pod，并会周期性地重新检查，
因为这些需求可能稍后仍会被满足。

<!--
Such a situation can also arise when support for dynamic resource allocation
was not enabled in the scheduler at the time when the Pod got scheduled
(version skew, configuration, feature gate, etc.). kube-controller-manager
detects this and tries to make the Pod runnable by reserving the required
ResourceClaims. However, this only works if those were allocated by
the scheduler for some other pod.
-->
当 Pod 被调度时调度器中尚未启用动态资源分配支持时（版本偏差、配置、特性门控等），
也可能出现这种情况。
kube-controller-manager 会检测到此情况，并通过保留所需的 ResourceClaim
尝试使 Pod 变为可运行状态。但是，这仅在这些 ResourceClaim 已被调度器为其他某个 Pod 分配时才有效。

<!--
It is better to avoid bypassing the scheduler because a Pod that is assigned to a node
blocks normal resources (RAM, CPU) that then cannot be used for other Pods
while the Pod is stuck. To make a Pod run on a specific node while still going
through the normal scheduling flow, create the Pod with a node selector that
exactly matches the desired node:
-->
最好避免绕开调度器，因为被分配到节点的 Pod 在挂起期间会阻塞常规资源（RAM、CPU），
使其无法被其他 Pod 使用。若要让 Pod 在特定节点上运行，
同时仍经过正常的调度流程，请为 Pod 创建一个与目标节点精确匹配的节点选择算符：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: name-of-the-intended-node
  ...
```

<!--
You may also be able to mutate the incoming Pod, at admission time, to unset
the `.spec.nodeName` field and to use a node selector instead.
-->
你也可以在准入阶段变更进入系统的 Pod，取消 `.spec.nodeName` 字段的设置，
改为使用节点选择算符。

<!--
## Device binding conditions
-->
## 设备绑定条件

{{< feature-state feature_gate_name="DRADeviceBindingConditions" >}}

<!--
Device Binding Conditions allow the Kubernetes scheduler to delay Pod binding until
external resources, such as fabric-attached GPUs or reprogrammable FPGAs, are confirmed
to be ready.
-->
设备绑定条件（Device Binding Conditions）允许 Kubernetes 调度器延迟 Pod 绑定，
直到外部资源（例如通过交换架构连接的 GPU 或可重新编程的 FPGA）被确认就绪为止。

<!--
This waiting behavior is implemented in the
[PreBind phase](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)
of the scheduling framework.
During this phase, the scheduler checks whether all required device conditions are
satisfied before proceeding with binding.
-->
这种等待行为在调度框架的
[PreBind 阶段](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)中实现。
在此阶段，调度器在继续绑定之前会检查所有必需的设备条件是否均已满足。

<!--
This improves scheduling reliability by avoiding premature binding and enables coordination
with external device controllers.
-->
这通过避免过早绑定提高了调度的可靠性，并支持与外部设备控制器的协调。

<!--
To use this feature, device drivers (typically managed by driver owners) must publish the
following fields in the `Device` section of a `ResourceSlice`. Cluster administrators
must enable the `DRADeviceBindingConditions` and `DRAResourceClaimDeviceStatus` feature
gates for the scheduler to honor these fields.
-->
要使用此特性，设备驱动（通常由驱动所有者管理）必须在 `ResourceSlice` 的
`Device` 部分发布以下字段。集群管理员必须启用 `DRADeviceBindingConditions` 和
`DRAResourceClaimDeviceStatus` 特性门控，调度器才会遵循这些字段。

<!--
`bindingConditions`
: A list of _condition types_ that must be set to True (in the `.status.conditions` field of the associated ResourceClaim) before the Pod can be bound. These conditions typically represent readiness signals, such as DeviceAttached or DeviceInitialized.
-->
`bindingConditions`
: 在 Pod 可以被绑定之前必须被设置为 True
  （位于关联 ResourceClaim 的 `.status.conditions` 字段中）的**条件类型**列表。
  这些条件通常表示就绪信号，例如 DeviceAttached（设备已挂接）或
  DeviceInitialized（设备已初始化）。

<!--
`bindingFailureConditions`
: A list of condition types that, if set to True in
  status.conditions field of the associated ResourceClaim, indicate a failure state.
  If any of these conditions are True, the scheduler will abort binding and reschedule the Pod.
-->
`bindingFailureConditions`
: 条件类型列表，若在关联 ResourceClaim 的 `status.conditions` 字段中被设置为 True，
  则表示失败状态。如果其中任意条件为 True，调度器将中止绑定并重新调度该 Pod。

<!--
`bindsToNode`
: if set to `true`, the scheduler records the selected node name in the
  `status.allocation.nodeSelector` field of the ResourceClaim.
  This does not affect the Pod's `spec.nodeSelector`. Instead, it sets a node selector
  inside the ResourceClaim, which external controllers can use to perform node-specific
  operations such as device attachment or preparation.
-->
`bindsToNode`
: 若设置为 `true`，调度器会在 ResourceClaim 的
  `status.allocation.nodeSelector` 字段中记录所选中的节点名称。
  这不会影响 Pod 的 `spec.nodeSelector`。相反，
  它会在 ResourceClaim 内部设置一个节点选择算符，
  外部控制器可以使用它来执行节点特定的操作，例如设备挂接或制备。

<!--
All condition types listed in bindingConditions and bindingFailureConditions are evaluated
from the `status.conditions` field of the ResourceClaim.
External controllers are responsible for updating these conditions using standard Kubernetes
condition semantics (`type`, `status`, `reason`, `message`, `lastTransitionTime`).
-->
bindingConditions 和 bindingFailureConditions 中列出的所有条件类型
都根据 ResourceClaim 的 `status.conditions` 字段进行评估。
外部控制器负责使用标准 Kubernetes
条件语义（`type`、`status`、`reason`、`message`、`lastTransitionTime`）更新这些条件。

<!--
The scheduler waits up to **600 seconds** (default) for all `bindingConditions` to become `True`.
If the timeout is reached or any `bindingFailureConditions` are `True`, the scheduler
clears the allocation and reschedules the Pod.
A cluster administration can configure this timeout duration by editing the kube-scheduler configuration file.
-->
调度器最多等待 **600 秒**（默认值），以等待所有 `bindingConditions` 变为 `True`。
如果达到超时或任何 `bindingFailureConditions` 为 `True`，
调度器会清除分配并重新调度该 Pod。集群管理员可以通过编辑 kube-scheduler
配置文件来配置此超时时间。

<!--
An example of configuring this timeout in `KubeSchedulerConfiguration` is given below:
-->
以下给出了在 `KubeSchedulerConfiguration` 中配置此超时的示例：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- schedulerName: default-scheduler
  pluginConfig:
  - name: DynamicResources
    args:
      apiVersion: kubescheduler.config.k8s.io/v1
      kind: DynamicResourcesArgs
      bindingTimeout: 60s
```

<!--
### Example {#device-binding-conditions-example}
-->
### 示例 {#device-binding-conditions-example}

<!--
Here is an example of a ResourceSlice that you might see in a cluster where there's a DRA driver in use, and that driver supports binding conditions:
-->
以下是你可能在集群中看到的一个 ResourceSlice 示例，
该集群中正在使用某个 DRA 驱动，并且该驱动支持绑定条件：

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-slice-1
spec:
  driver: dra.example.com
  nodeSelector:
    nodeSelectorTerms:
    - matchExpressions:
      - key: accelerator-type
        operator: In
        values:
        - "high-performance"
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 1
  devices:
    - name: gpu-1
      attributes:
        vendor:
          string: "example"
        model:
          string: "example-gpu"
      bindsToNode: true
      bindingConditions:
        - dra.example.com/is-prepared
      bindingFailureConditions:
        - dra.example.com/preparing-failed
```

<!--
This example ResourceSlice has the following properties:
-->
该示例 ResourceSlice 具有以下属性：

<!--
- The ResourceSlice targets nodes labeled with `accelerator-type=high-performance`, 
so that the scheduler uses only a specific set of eligible nodes.
-->
- ResourceSlice 目标为带有 `accelerator-type=high-performance` 标签的节点，
  因此调度器仅使用特定的一组合格节点。

<!--
- The scheduler selects one node from the selected group (for example, `node-3`) and sets 
the `status.allocation.nodeSelector` field in the ResourceClaim to that node name.
-->
- 调度器从所选组中选择一个节点（例如 `node-3`），并将 ResourceClaim 中的
  `status.allocation.nodeSelector` 字段设置为该节点名称。

<!--
- The `dra.example.com/is-prepared` binding condition indicates that the device `gpu-1`
must be prepared (the `is-prepared` condition has a status of `True`) before binding. 
-->
- `dra.example.com/is-prepared` 绑定条件指示设备 `gpu-1` 必须被制备
  （`is-prepared` 条件的状态为 `True`）后才能绑定。

<!--
- If the `gpu-1` device preparation fails (the `preparing-failed` condition has a status of `True`), the scheduler aborts binding.
-->
- 如果 `gpu-1` 设备制备失败（`preparing-failed` 条件状态为 `True`），
  调度器会中止绑定。

<!--
- The scheduler waits up to 600 seconds (default) for the device to become ready.
-->
- 调度器最多等待 600 秒（默认值），等待设备准备就绪。

<!--
- External controllers can use the node selector in the ResourceClaim to perform
node-specific setup on the selected node.
-->
- 外部控制器可以使用 ResourceClaim 中的节点选择算符，在选定的节点上执行节点特定的设置。

<!--
Device binding conditions is controlled by the
[`DRADeviceBindingConditions` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceBindingConditions)
in the `kube-apiserver` and `kube-scheduler`.
-->
设备绑定条件由 `kube-apiserver` 和 `kube-scheduler` 中的
[`DRADeviceBindingConditions` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceBindingConditions)控制。

<!--
## Node allocatable resources {#node-allocatable-resources}
-->
## 节点可分配资源 {#node-allocatable-resources}

{{< feature-state feature_gate_name="DRANodeAllocatableResources" >}}

<!--
Devices managed by DRA can have an underlying footprint composed of node allocatable
resources, such as `cpu`, `memory`, or `hugepages`.
This feature integrates these DRA-based requests into the scheduler's standard
accounting alongside regular Pod `spec` requests for these resources.
-->
由 DRA 管理的设备可能具有由节点可分配资源（如 `cpu`、`memory` 或 `hugepages`）
构成的底层占用。此特性将这些基于 DRA 的请求与常规 Pod `spec`
中对这些资源的请求一起整合到调度器的标准核算中。

<!--
DRA drivers define how devices consume node allocatable resources using two distinct models:
-->
DRA 驱动使用两种不同的模型来定义设备如何消耗节点可分配资源：

<!--
*   **Direct Resource Mapping (`mapping`)**: The DRA device directly provides a standard node resource (such as a custom CPU core pool or memory block). The claim allocation directly maps to standard CPU or memory capacity on the node.
-->
* **直接资源映射（`mapping`）：** DRA 设备直接提供标准节点资源
  （例如自定义 CPU 核心池或内存块）。申领分配直接映射到节点上的标准 CPU 或内存容量。

<!--
*   **Auxiliary Device Overhead (`overhead`)**: The DRA device (such as a GPU or accelerator) requires host resources (such as host RAM) as secondary overhead to operate when allocated to a Pod or container.
-->
* **辅助设备开销（`overhead`）：** DRA 设备（例如 GPU 或加速器）在被分配给
  Pod 或容器时，需要主机资源（例如主机 RAM）作为辅助开销才能运行。

<!--
### Considerations for Pod Authors
-->
### Pod 编写者的注意事项

<!--
When authoring a PodSpec using claims for these types of devices, there are a few things to be aware of:
-->
在使用申领为这些类型的设备编写 PodSpec 时，需要注意以下几点：

<!--
*   When Pod-level resources are used, the scheduler strictly validates them against both container requests and limits:

    *  The sum of all container requests and DRA claim resources must not exceed the Pod-level requests; otherwise, the Pod will fail to schedule.
    *  Each individual container's limit plus its DRA allocations must not exceed the Pod-level limits; otherwise, the Pod will fail to schedule.
-->
* 当使用 Pod 级资源时，调度器会同时针对容器的 requests 和 limits 对其进行严格验证：

  * 所有容器 requests 与 DRA 申领资源的总和不得超过 Pod 级 requests；
    否则该 Pod 将无法调度。
  * 每个单独容器的 limit 加上其 DRA 分配不得超过 Pod 级 limits；
    否则该 Pod 将无法调度。

<!--
* A container's total resource requirement is the sum of its container-level resources
  and any node allocatable resources from its associated resource claims.

*   **Claim Sharing Restriction**: Claims that use direct resource mappings (`mapping`) cannot be shared across multiple Pods. Claims for devices 
    with `overhead` can support device sharing and overhead is tracked per Pod or per container.

*   Pods with DRA claims support in-place resizing for standard requests in `spec`. The scheduler ensures 
    that resized standard requests combined with static DRA allocations still fit on the node.
-->
* 容器的总资源需求等于其容器级资源与其关联资源申领中的任何节点可分配资源之和。

* **申领共享限制：** 使用直接资源映射（`mapping`）的申领不能在多个 Pod 之间共享。
  带有 `overhead` 的设备申领支持设备共享，且开销按每个 Pod 或每个容器追踪。

* 带有 DRA 申领的 Pod 支持对 `spec` 中的标准 requests 进行就地调整大小。
  调度器确保调整后的标准 requests 与静态 DRA 分配结合后仍然能适配节点。

<!--
### Details for DRA Driver Authors
-->
### DRA 驱动编写者的细节

<!--
DRA drivers declare this node allocatable resource footprint using the
`nodeAllocatableResources` field on devices within a ResourceSlice.
This defines the translation of the requested DRA device or capacity into standard
resources that are tracked in the node's `status.allocatable` (note that extended
resources are not supported for this field). This is useful both for drivers that directly
expose native resources (like a CPU or Memory DRA driver) and for devices that
require auxiliary node dependencies (like an accelerator that needs host memory).
-->
DRA 驱动使用 ResourceSlice 中设备上的 `nodeAllocatableResources` 字段
来声明此节点可分配资源占用。
它定义了将请求的 DRA 设备或容量转换为在节点的 `status.allocatable`
中追踪的标准资源的映射（注意，此字段不支持扩展资源）。
这对于直接暴露原生资源的驱动（例如 CPU 或内存 DRA 驱动）
和需要辅助节点依赖的设备（例如需要主机内存的加速器）都非常有用。

<!--
The `nodeAllocatableResources` field supports two different use cases:
-->
`nodeAllocatableResources` 字段支持两种不同的使用场景：

<!--
*   **Mapping**: Used when the DRA device directly represents the standard resource
    (e.g., a CPU or Memory DRA driver). The scheduler calculates the exact quantity
    by scaling the capacity using `capacityMultiplier`, or scaling the device count
    using `deviceMultiplier`.
-->
* **映射（Mapping）：** 当 DRA 设备直接代表标准资源时使用
  （例如 CPU 或内存 DRA 驱动）。调度器通过使用 `capacityMultiplier` 缩放容量，
  或使用 `deviceMultiplier` 缩放设备数量来计算精确的数量。

<!--
*   **Overhead**: Used when the device requires auxiliary node dependencies (e.g.,
    host memory consumed by a GPU). This can be defined as a flat `perPod` cost or
    a variable `perContainer` cost that scales linearly with the number of
    referencing containers.
-->
* **开销（Overhead）：** 当设备需要辅助节点依赖时使用
 （例如 GPU 消耗的主机内存）。这可以定义为固定的 `perPod` 成本，
  或定义为随引用容器数量线性缩放的可变 `perContainer` 成本。

<!--
#### Example: CPU DRA Driver (Mapping)
-->
#### 示例：CPU DRA 驱动（映射 Mapping）

<!--
Here is an example where a CPU DRA driver exposes a CPU socket as a pool of 128
CPUs using [DRA consumable capacity](#consumable-capacity). The `capacityKey` links the consumed
`cpu.example.com/cpu` capacity directly to the node's standard `cpu`
allocatable resource:
-->
以下示例中，CPU DRA 驱动使用 [DRA 可消耗容量](#consumable-capacity)将一个
CPU 插槽作为 128 个 CPU 的池暴露出来。`capacityKey` 将消耗的
`cpu.example.com/cpu` 容量直接链接到节点的标准 `cpu` 可分配资源：

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: my-node-cpus
spec:
  driver: cpu.example.com
  nodeName: my-node
  pool:
    name: socket-cpus
    generation: 1
    resourceSliceCount: 1
  devices:
  - name: socket0cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResources:
      mapping:
        cpu:
          capacityKey: "cpu.example.com/cpu"
  - name: socket1cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResources:
      mapping:
        cpu:
          capacityKey: "cpu.example.com/cpu"
          capacityMultiplier: 1
```

<!--
#### Example: Accelerator with Auxiliary Resources (Overhead)
-->
#### 示例：带辅助资源的加速器（Overhead）

<!--
Here is an example of a resource slice where an accelerator requires an
additional 8Gi of memory per Pod to function:
-->
以下资源切片示例中，一台加速器每个 Pod 需要额外 8Gi 的内存才能运行：

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: my-node-xpus
spec:
  driver: xpu.example.com
  nodeName: my-node
  pool:
    name: xpu-pool
    generation: 1
    resourceSliceCount: 1
  devices:
  - name: xpu-model-x-001
    attributes:
      example.com/model:
        string: "model-x"
    nodeAllocatableResources:
      overhead:
        memory:
          perPod: "8Gi"
```

<!--
After a Pod is successfully bound to the node, the exact quantities of 
node allocatable resources allocated via DRA are aggregated by the `kube-scheduler`
and embedded directly into the Pod's `status.nodeAllocatableResourceClaimStatuses` field.
This provides a clear, persistent handoff from the scheduler to the `kubelet`.
-->
在 Pod 成功绑定到节点后，通过 DRA 分配的精确节点可分配资源数量会由
`kube-scheduler` 聚合，并直接嵌入到 Pod 的
`status.nodeAllocatableResourceClaimStatuses` 字段中。
这提供了从调度器到 `kubelet` 的清晰、持久的交接。

<!--
Crucially, the `kubelet` natively consumes this API to perfectly align system-level boundaries:
- **cgroups**: Pod and container cgroups would now include DRA based allocations, preventing workloads from being artificially throttled by the kernel.
- **OOM Scores**: The `kubelet` factors the container's DRA memory requests into its effective memory request.
-->
关键是，`kubelet` 原生地消费此 API 来完美对齐系统级边界：

- **cgroups：** Pod 和容器的 cgroups 现在将包含基于 DRA 的分配，
  防止工作负载被内核人为地节流。
- **OOM Scores：** `kubelet` 将容器的 DRA 内存 requests 计算到其有效内存请求中。

<!--
Node allocatable resources is an alpha feature and is enabled when the
[`DRANodeAllocatableResources` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRANodeAllocatableResources) is enabled in the `kube-apiserver`,
`kube-scheduler`, and `kubelet`.
-->
节点可分配资源是一个 Alpha 特性，当在 `kube-apiserver`、`kube-scheduler` 和
`kubelet` 中启用 [`DRANodeAllocatableResources` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRANodeAllocatableResources)
时即启用。
