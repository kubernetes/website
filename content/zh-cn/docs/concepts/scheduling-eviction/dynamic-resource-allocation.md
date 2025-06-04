---
title: 动态资源分配
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceSlice"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceSlice"
---
<!--
reviewers:
- klueska
- pohly
title: Dynamic Resource Allocation
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceSlice"
-->

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

{{< feature-state feature_gate_name="DRAControlPlaneController" >}}

<!-- 
Dynamic resource allocation is an API for requesting and sharing resources
between pods and containers inside a pod. It is a generalization of the
persistent volumes API for generic resources. Typically those resources
are devices like GPUs.

Third-party resource drivers are
responsible for tracking and preparing resources, with allocation of
resources handled by Kubernetes via _structured parameters_ (introduced in Kubernetes 1.30).
Different kinds of resources support arbitrary parameters for defining requirements and
initialization.
-->
动态资源分配是一个用于在 Pod 之间和 Pod 内部容器之间请求和共享资源的 API。
它是持久卷 API 针对一般资源的泛化。通常这些资源是 GPU 这类设备。

第三方资源驱动程序负责跟踪和准备资源，
Kubernetes 通过**结构化参数**（在 Kubernetes 1.30 中引入）处理资源的分配。
不同类别的资源支持任意参数来定义要求和初始化。

<!--
Kubernetes v1.26 through to 1.31 included an (alpha) implementation of _classic DRA_,
which is no longer supported. This documentation, which is for Kubernetes
v{{< skew currentVersion >}}, explains the current approach to dynamic resource
allocation within Kubernetes.
-->
Kubernetes v1.26 至 1.31 包含了**经典 DRA** 的（Alpha）实现，该实现已不再支持。
本文档适用于 Kubernetes v{{< skew currentVersion >}}，解释了 Kubernetes
中当前的动态资源分配方法。

## {{% heading "prerequisites" %}}

<!-- 
Kubernetes v{{< skew currentVersion >}} includes cluster-level API support for
dynamic resource allocation, but it [needs to be enabled](#enabling-dynamic-resource-allocation)
explicitly. You also must install a resource driver for specific resources that
are meant to be managed using this API. If you are not running Kubernetes
v{{< skew currentVersion>}}, check the documentation for that version of Kubernetes.
-->
Kubernetes v{{< skew currentVersion >}} 包含用于动态资源分配的集群级 API 支持，
但它需要被[显式启用](#enabling-dynamic-resource-allocation)。
你还必须为此 API 要管理的特定资源安装资源驱动程序。
如果你未运行 Kubernetes v{{< skew currentVersion>}}，
请查看对应版本的 Kubernetes 文档。

<!-- body -->

## API

<!-- 
The `resource.k8s.io/v1beta1` and `resource.k8s.io/v1beta2`
{{< glossary_tooltip text="API groups" term_id="api-group" >}} provide these types:
-->
`resource.k8s.io/v1beta1` 和 `resource.k8s.io/v1beta2`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}
提供了以下类型：

<!--
ResourceClaim
: Describes a request for access to resources in the cluster,
  for use by workloads. For example, if a workload needs an accelerator device
  with specific properties, this is how that request is expressed. The status
  stanza tracks whether this claim has been satisfied and what specific
  resources have been allocated.
-->
ResourceClaim
: 描述对集群中资源的访问请求，工作负载需要使用这些资源。
  例如，如果工作负载需要具有特定属性的加速器设备，就可以通过这种方式表达该请求。
  状态部分跟踪此请求是否已被满足以及具体已分配了哪些资源。

<!--
ResourceClaimTemplate
: Defines the spec and some metadata for creating
  ResourceClaims. Created by a user when deploying a workload.
  The per-Pod ResourceClaims are then created and removed by Kubernetes
  automatically.
-->
ResourceClaimTemplate
: 定义用于创建 ResourceClaim 的规约和一些元数据。
  部署工作负载时由用户创建。
  每个 Pod 的 ResourceClaim 随后会被 Kubernetes 自动创建和移除。

<!--
DeviceClass
: Contains pre-defined selection criteria for certain devices and
  configuration for them. DeviceClasses are created by a cluster administrator
  when installing a resource driver. Each request to allocate a device
  in a ResourceClaim must reference exactly one DeviceClass.
-->
DeviceClass
: 包含某些设备的预定义选择标准和配置。
  DeviceClass 由集群管理员在安装资源驱动程序时创建。
  对 ResourceClaim 中某个设备的每个分配请求都必须准确引用一个 DeviceClass。

<!--
ResourceSlice
: Used by DRA drivers to publish information about resources (typically devices)
  that are available in the cluster.
-->
ResourceSlice
: 用于 DRA 驱动程序发布关于集群中可用资源（通常是设备）的信息。

<!--
DeviceTaintRule
: Used by admins or control plane components to add device taints
  to the devices described in ResourceSlices.
-->
DeviceTaintRule
: 用于管理员或控制平面组件为 ResourceSlice 中描述的设备添加设备污点。

<!--
All parameters that select devices are defined in the ResourceClaim and
DeviceClass with in-tree types. Configuration parameters can be embedded there.
Which configuration parameters are valid depends on the DRA driver -- Kubernetes
only passes them through without interpreting them.
-->
所有选择设备的参数都在 ResourceClaim 和 DeviceClass 中使用内置类型定义。
其中可以嵌入配置参数。哪些配置参数有效取决于 DRA 驱动程序 —— Kubernetes 只是将它们传递下去而不进行解释。

<!-- 
The `core/v1` `PodSpec` defines ResourceClaims that are needed for a Pod in a
`resourceClaims` field. Entries in that list reference either a ResourceClaim
or a ResourceClaimTemplate. When referencing a ResourceClaim, all Pods using
this PodSpec (for example, inside a Deployment or StatefulSet) share the same
ResourceClaim instance. When referencing a ResourceClaimTemplate, each Pod gets
its own instance.
-->
`core/v1` 的 `PodSpec` 在 `resourceClaims` 字段中定义 Pod 所需的 ResourceClaim。
该列表中的条目引用 ResourceClaim 或 ResourceClaimTemplate。
当引用 ResourceClaim 时，使用此 PodSpec 的所有 Pod
（例如 Deployment 或 StatefulSet 中的 Pod）共享相同的 ResourceClaim 实例。
引用 ResourceClaimTemplate 时，每个 Pod 都有自己的实例。

<!-- 
The `resources.claims` list for container resources defines whether a container gets
access to these resource instances, which makes it possible to share resources
between one or more containers.

Here is an example for a fictional resource driver. Two ResourceClaim objects
will get created for this Pod and each container gets access to one of them.
-->
容器资源的 `resources.claims` 列表定义容器可以访问的资源实例，
从而可以实现在一个或多个容器之间共享资源。

下面是一个虚构的资源驱动程序的示例。
该示例将为此 Pod 创建两个 ResourceClaim 对象，每个容器都可以访问其中一个。

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: DeviceClass
metadata:
  name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers:
  - name: container0
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: container1
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    resourceClaimTemplateName: large-black-cat-claim-template
```

<!-- 
## Scheduling
-->
## 调度  {#scheduling}

<!--
### With structured parameters
-->
### 使用结构化参数 {#with-structured-parameters}

<!-- 
The scheduler is responsible for allocating resources to a ResourceClaim whenever a pod needs
them. It does so by retrieving the full list of available resources from
ResourceSlice objects, tracking which of those resources have already been
allocated to existing ResourceClaims, and then selecting from those resources
that remain.
-->
调度器负责在 Pod 需要资源时为 ResourceClaim 分配资源。
通过从 ResourceSlice 对象中检索可用资源的完整列表，
跟踪已分配给现有 ResourceClaim 的资源，然后从剩余的资源中进行选择。

<!--
The only kind of supported resources at the moment are devices. A device
instance has a name and several attributes and capacities. Devices get selected
through CEL expressions which check those attributes and capacities. In
addition, the set of selected devices also can be restricted to sets which meet
certain constraints.
-->
目前唯一支持的资源类别是设备。
设备实例具有名称以及多个属性和容量信息。
设备通过 CEL 表达式被选择，这些表达式检查设备的属性和容量。
此外，所选择的设备集合还可以限制为满足特定约束的集合。

<!--
The chosen resource is recorded in the ResourceClaim status together with any
vendor-specific configuration, so when a pod is about to start on a node, the
resource driver on the node has all the information it needs to prepare the
resource.
-->
所选资源与所有供应商特定配置一起被记录在 ResourceClaim 状态中，
因此当 Pod 即将在节点上启动时，节点上的资源驱动程序具有准备资源所需的所有信息。

<!--
By using structured parameters, the scheduler is able to reach a decision
without communicating with any DRA resource drivers. It is also able to
schedule multiple pods quickly by keeping information about ResourceClaim
allocations in memory and writing this information to the ResourceClaim objects
in the background while concurrently binding the pod to a node.
-->
通过使用结构化参数，调度器能够在不与 DRA 资源驱动程序通信的情况下做出决策。
它还能够通过将 ResourceClaim 分配信息保存在内存中，并在同时将 Pod 绑定到节点的同时将此信息写入
ResourceClaim 对象中，快速调度多个 Pod。

<!-- 
## Monitoring resources
-->
## 监控资源  {#monitoring-resources}

<!-- 
The kubelet provides a gRPC service to enable discovery of dynamic resources of
running Pods. For more information on the gRPC endpoints, see the
[resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
-->
kubelet 提供了一个 gRPC 服务，以便发现正在运行的 Pod 的动态资源。
有关 gRPC 端点的更多信息，请参阅[资源分配报告](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。

<!--
## Pre-scheduled Pods

When you - or another API client - create a Pod with `spec.nodeName` already set, the scheduler gets bypassed.
If some ResourceClaim needed by that Pod does not exist yet, is not allocated
or not reserved for the Pod, then the kubelet will fail to run the Pod and
re-check periodically because those requirements might still get fulfilled
later.
-->
## 预调度的 Pod   {#pre-scheduled-pods}

当你（或别的 API 客户端）创建设置了 `spec.nodeName` 的 Pod 时，调度器将被绕过。
如果 Pod 所需的某个 ResourceClaim 尚不存在、未被分配或未为该 Pod 保留，那么 kubelet
将无法运行该 Pod，并会定期重新检查，因为这些要求可能在以后得到满足。

<!--
Such a situation can also arise when support for dynamic resource allocation
was not enabled in the scheduler at the time when the Pod got scheduled
(version skew, configuration, feature gate, etc.). kube-controller-manager
detects this and tries to make the Pod runnable by reserving the required
ResourceClaims. However, this only works if those were allocated by
the scheduler for some other pod.
-->
这种情况也可能发生在 Pod 被调度时调度器中未启用动态资源分配支持的时候（原因可能是版本偏差、配置、特性门控等）。
kube-controller-manager 能够检测到这一点，并尝试通过预留所需的一些 ResourceClaim 来使 Pod 可运行。
然而，这只有在这些 ResourceClaim 已经被调度器为其他 Pod 分配的情况下才有效。

<!--
It is better to avoid bypassing the scheduler because a Pod that is assigned to a node
blocks normal resources (RAM, CPU) that then cannot be used for other Pods
while the Pod is stuck. To make a Pod run on a specific node while still going
through the normal scheduling flow, create the Pod with a node selector that
exactly matches the desired node:
-->
绕过调度器并不是一个好的选择，因为分配给节点的 Pod 会锁住一些正常的资源（RAM、CPU），
而这些资源在 Pod 被卡住时无法用于其他 Pod。为了让一个 Pod 在特定节点上运行，
同时仍然通过正常的调度流程进行，请在创建 Pod 时使用与期望的节点精确匹配的节点选择算符：

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
你还可以在准入时变更传入的 Pod，取消设置 `.spec.nodeName` 字段，并改为使用节点选择算符。

<!--
## Admin access
-->
## 管理性质的访问  {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

<!--
You can mark a request in a ResourceClaim or ResourceClaimTemplate as having
privileged features for maintenance and troubleshooting tasks. A request with
admin access grants access to in-use devices and may enable additional
permissions when making the device available in a container:
-->
你可以在 ResourceClaim 或 ResourceClaimTemplate
中标记一个请求为具有用于维护和故障排除任务的特权特性。
具有管理员访问权限的请求可以允许用户访问使用中的设备，
并且在将设备提供给容器时可能授权一些额外的访问权限：

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          allocationMode: All
          adminAccess: true
```

<!--
If this feature is disabled, the `adminAccess` field will be removed
automatically when creating such a ResourceClaim.

Admin access is a privileged mode and should not be granted to regular users in
multi-tenant clusters. Starting with Kubernetes v1.33, only users authorized to
create ResourceClaim or ResourceClaimTemplate objects in namespaces labeled with
`resource.k8s.io/admin-access: "true"` (case-sensitive) can use the
`adminAccess` field. This ensures that non-admin users cannot misuse the
feature.
-->
如果此特性被禁用，创建此类 ResourceClaim 时将自动移除 `adminAccess` 字段。

管理性质访问是一种特权模式，在多租户集群中不应该对普通用户开放。
从 Kubernetes v1.33 开始，在标有 `resource.k8s.io/admin-access: "true"`（区分大小写）
的命名空间中只有被授权创建 ResourceClaim 或 ResourceClaimTemplate
对象的用户才能使用 `adminAccess` 字段。这确保了非管理员用户不能滥用此特性。

<!--
## ResourceClaim Device Status
-->
## ResourceClaim 设备状态  {#resourceclaim-device-status}

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

<!--
The drivers can report driver-specific device status data for each allocated device
in a resource claim. For example, IPs assigned to a network interface device can be 
reported in the ResourceClaim status.

The drivers setting the status, the accuracy of the information depends on the implementation 
of those DRA Drivers. Therefore, the reported status of the device may not always reflect the 
real time changes of the state of the device.

When the feature is disabled, that field automatically gets cleared when storing the ResourceClaim. 

A ResourceClaim device status is supported when it is possible, from a DRA driver, to update an 
existing ResourceClaim where the `status.devices` field is set.
-->
驱动程序可以报告资源申领中各个已分配设备的、特定于驱动程序的设备状态。
例如，可以在 ResourceClaim 状态中报告分配给网络接口设备的 IP。

驱动程序设置状态，信息的准确性取决于 DRA 驱动程序的具体实现。
因此，所报告的设备状态可能并不总是反映设备状态的实时变化。

当此特性被禁用时，该字段会在存储 ResourceClaim 时自动清除。

针对一个已经设置了 `status.devices` 字段的现有 ResourceClaim 而言，如果 DRA
驱动能够更新该 ResourceClaim，则有可能支持 ResourceClaim 设备状态这一特性。


<!--
## Prioritized List

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

You can provide a prioritized list of subrequests for requests in a ResourceClaim. The
scheduler will then select the first subrequest that can be allocated. This allows users to
specify alternative devices that can be used by the workload if the primary choice is not
available.

In the example below, the ResourceClaimTemplate requested a device with the color black
and the size large. If a device with those attributes are not available, the pod can not
be scheduled. With the priotized list feature, a second alternative can be specified, which
requests two devices with the color white and size small. The large black device will be
allocated if it is available. But if it is not and two small white devices are available,
the pod will still be able to run.
-->
## 按优先级排序的列表  {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

你可以在 ResourceClaim 中为请求提供按优先级排序的子请求列表。调度器将选择第一个能够分配的子请求。
这使得用户能够在首选设备不可用时指定工作负载可以使用的替代设备。

在下面的示例中，ResourceClaimTemplate 请求了一个颜色为黑色且尺寸为大的设备。
如果具有这些属性的设备不可用，Pod 将无法被调度。使用按优先级排序的列表特性，
可以指定第二个替代方案，即请求两个颜色为白色且尺寸为小的设备。
如果大型黑色设备可用，将分配它。但如果它不可用且有两个小型白色设备可用，
Pod 仍然能够运行。

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: prioritized-list-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        firstAvailable:
        - name: large-black
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
        - name: small-white
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "white" &&
                device.attributes["resource-driver.example.com"].size == "small"
          count: 2
```

<!--
## Partitionable Devices

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Devices represented in DRA don't necessarily have to be a single unit connected to a single machine,
but can also be a logical device comprised of multiple devices connected to multiple machines. These
devices might consume overlapping resources of the underlying phyical devices, meaning that when one
logical device is allocated other devices will no longer be available.
-->
## 可切分设备  {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

DRA 中表示的设备不一定必须是连接到单个机器的单个单元，
也可以是由连接到多个机器的多个设备组成的逻辑设备。
这些设备可能会消耗底层物理设备的重叠资源，这意味着当一个逻辑设备被分配时，
其他设备将不再可用。

<!--
In the ResourceSlice API, this is represented as a list of named CounterSets, each of which
contains a set of named counters. The counters represent the resources available on the physical
device that are used by the logical devices advertised through DRA.

Logical devices can specify the ConsumesCounters list. Each entry contains a reference to a CounterSet
and a set of named counters with the amounts they will consume. So for a device to be allocatable,
the referenced counter sets must have sufficient quantity for the counters referenced by the device.

Here is an example of two devices, each consuming 6Gi of memory from the a shared counter with
8Gi of memory. Thus, only one of the devices can be allocated at any point in time. The scheduler
handles this and it is transparent to the consumer as the ResourceClaim API is not affected.
-->
在 ResourceSlice API 中，这类设备表示为命名 CounterSet 列表，每个 CounterSet 包含一组命名计数器。
计数器表示物理设备上可供通过 DRA 发布的逻辑设备使用的资源。

逻辑设备可以指定 ConsumesCounter 列表。每个条目包含对某个 CounterSet 的引用和一组命名计数器及其消耗量。
因此，要使设备可被分配，所引用的 CounterSet 必须具有设备引用的计数器所需的足够数量。

以下是两个设备的示例，每个设备从具有 8Gi 内存的共享计数器中消耗 6Gi 内存。
因此，在任何时间点只能分配其中一个设备。调度器处理这种情况，
对使用者来说是透明的，因为 ResourceClaim API 不受影响。

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1beta2
metadata:
  name: resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  sharedCounters:
  - name: gpu-1-counters
    counters:
      memory:
        value: 8Gi
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
## Device taints and tolerations

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

Device taints are similar to node taints: a taint has a string key, a string
value, and an effect. The effect is applied to the ResourceClaim which is
using a tainted device and to all Pods referencing that ResourceClaim.
The "NoSchedule" effect prevents scheduling those Pods.
Tainted devices are ignored when trying to allocate a ResourceClaim
because using them would prevent scheduling of Pods.
-->
## 设备污点和容忍度  {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

设备污点类似于节点污点：污点具有字符串形式的键、字符串形式的值和效果。
效果应用于使用带污点设备的 ResourceClaim 以及引用该 ResourceClaim 的所有 Pod。
"NoSchedule" 效果会阻止调度这些 Pod。
在尝试分配 ResourceClaim 时会忽略带污点的设备，
因为使用它们会阻止 Pod 的调度。

<!--
The "NoExecute" effect implies "NoSchedule" and in addition causes eviction
of all Pods which have been scheduled already. This eviction is implemented
in the device taint eviction controller in kube-controller-manager by
deleting affected Pods.

ResourceClaims can tolerate taints. If a taint is tolerated, its effect does
not apply. An empty toleration matches all taints. A toleration can be limited to
certain effects and/or match certain key/value pairs. A toleration can check
that a certain key exists, regardless which value it has, or it can check
for specific values of a key.
For more information on this matching see the
[node taint concepts](/docs/concepts/scheduling-eviction/taint-and-toleration#concepts).
-->
"NoExecute" 效果隐含 "NoSchedule" 效果，此外还会导致已调度的所有 Pod 被驱逐。
这种驱逐是通过 kube-controller-manager 中的设备污点驱逐控制器删除受影响的 Pod 来实现的。

ResourceClaim 可以容忍污点。如果污点被容忍，其效果将不会生效。
空容忍度匹配所有污点。容忍度可以限制为特定效果和/或匹配特定键/值对。
容忍度可以检查某个键是否存在，无论其值是什么，也可以检查某个键是否具有特定值。
有关此匹配机制的更多信息，请参阅[节点污点概念](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration#concepts)。

<!--
Eviction can be delayed by tolerating a taint for a certain duration.
That delay starts at the time when a taint gets added to a device, which is recorded in a field
of the taint.

Taints apply as described above also to ResourceClaims allocating "all" devices on a node.
All devices must be untainted or all of their taints must be tolerated.
Allocating a device with admin access (described [above](#admin-access))
is not exempt either. An admin using that mode must explicitly tolerate all taints
to access tainted devices.

Taints can be added to devices in two different ways:
-->
通过容忍污点一段时间可以延迟驱逐。该延迟从污点添加到设备时开始，
并被记录在污点的字段中。

如上所述，污点也适用于在节点上分配"所有"设备的 ResourceClaim。
所有设备必须不带污点，或者必须容忍其所有污点。
分配具有管理员访问权限的设备（[上文](#admin-access)所述）也不例外。
使用该模式的管理员必须明确容忍所有污点才能访问带污点的设备。

可以通过两种不同的方式向设备添加污点：

<!--
### Taints set by the driver

A DRA driver can add taints to the device information that it publishes in ResourceSlices.
Consult the documentation of a DRA driver to learn whether the driver uses taints and what
their keys and values are.
-->
### 由驱动程序设置的污点  {#taints-set-by-the-driver}

DRA 驱动程序可以为其在 ResourceSlice 中发布的设备信息添加污点。
请查阅 DRA 驱动程序的文档，了解驱动程序是否使用污点以及它们的键和值是什么。

<!--
### Taints set by an admin

An admin or a control plane component can taint devices without having to tell
the DRA driver to include taints in its device information in ResourceSlices. They do that by
creating DeviceTaintRules. Each DeviceTaintRule adds one taint to devices which
match the device selector. Without such a selector, no devices are tainted. This
makes it harder to accidentally evict all pods using ResourceClaims when leaving out
the selector by mistake.
-->
### 由管理员设置的污点  {#taints-set-by-an-admin}

管理员或控制平面组件可以在不告诉 DRA 驱动程序在其 ResourceSlice
中的设备信息中包含污点的情况下为设备添加污点。他们通过创建 DeviceTaintRule 来实现这一点。
每个 DeviceTaintRule 为匹配设备选择算符的设备添加一个污点。
如果没有指定这样的选择算符，则不会为任何设备添加污点。这使得在错误地遗漏选择算符时，
意外驱逐所有使用 ResourceClaim 的 Pod 变得更加困难。

<!--
Devices can be selected by giving the name of a DeviceClass, driver, pool,
and/or device. The DeviceClass selects all devices that are selected by the
selectors in that DeviceClass. With just the driver name, an admin can taint
all devices managed by that driver, for example while doing some kind of
maintenance of that driver across the entire cluster. Adding a pool name can
limit the taint to a single node, if the driver manages node-local devices.

Finally, adding the device name can select one specific device. The device name
and pool name can also be used alone, if desired. For example, drivers for node-local
devices are encouraged to use the node name as their pool name. Then tainting with
that pool name automatically taints all devices on a node.
-->
可以通过提供 DeviceClass、驱动程序（driver）、资源池（pool）和/或设备的名称来选择设备。
DeviceClass 选择该 DeviceClass 中的选择算符所选择的所有设备。
通过仅使用驱动程序名称，管理员可以为该驱动程序管理的所有设备添加污点，
例如在对整个集群中的该驱动程序进行某种维护时。
如果驱动程序管理节点本地设备，添加池名称可以将污点限制为单个节点。

最后，添加设备名称可以选择一个特定设备。如果需要，设备名称和池名称也可以单独使用。
例如，鼓励负责制备节点本地设备的驱动程序使用节点名称作为其池名称。
然后使用该池名称添加污点会自动为节点上的所有设备添加污点。

<!--
Drivers might use stable names like "gpu-0" that hide which specific device is
currently assigned to that name. To support tainting a specific hardware
instance, CEL selectors can be used in a DeviceTaintRule to match a vendor-specific
unique ID attribute, if the driver supports one for its hardware.

The taint applies as long as the DeviceTaintRule exists. It can be modified and
and removed at any time. Here is one example of a DeviceTaintRule for a fictional
DRA driver:
-->
驱动程序可能使用像 "gpu-0" 这样的稳定名称，
这些名称隐藏了当前分配给该名称的特定设备。
为了支持为特定硬件实例添加污点，
可以在 DeviceTaintRule 中使用 CEL 选择算符来匹配特定于供应商的唯一 ID 属性，
前提是驱动程序支持硬件对应的这类属性。

只要 DeviceTaintRule 存在，污点就会生效。它可以随时被修改和删除。
以下是一个虚构的 DRA 驱动程序的 DeviceTaintRule 示例：

<!--
```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: DeviceTaintRule
metadata:
  name: example
spec:
  # The entire hardware installation for this
  # particular driver is broken.
  # Evict all pods and don't schedule new ones.
  deviceSelector:
    driver: dra.example.com
  taint:
    key: dra.example.com/unhealthy
    value: Broken
    effect: NoExecute
```
-->
```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: DeviceTaintRule
metadata:
  name: example
spec:
  # 这个特定驱动程序的整个硬件安装已损坏。
  # 驱逐所有 Pod 并且不调度新的 Pod。
  deviceSelector:
    driver: dra.example.com
  taint:
    key: dra.example.com/unhealthy
    value: Broken
    effect: NoExecute
```

<!-- 
## Enabling dynamic resource allocation
-->
## 启用动态资源分配 {#enabling-dynamic-resource-allocation}

<!--
Dynamic resource allocation is a *beta feature* which is off by default and only enabled when the
`DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
and the `resource.k8s.io/v1beta1` and `resource.k8s.io/v1beta2` {{< glossary_tooltip text="API groups" term_id="api-group" >}}
are enabled. For details on that, see the `--feature-gates` and `--runtime-config`
[kube-apiserver parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
kube-scheduler, kube-controller-manager and kubelet also need the feature gate.
-->
动态资源分配是一个 **Beta 特性**，默认关闭，只有在启用 `DynamicResourceAllocation`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
和 `resource.k8s.io/v1beta1` 和 `resource.k8s.io/v1beta2`
{{< glossary_tooltip text="API 组" term_id="api-group" >}} 时才启用。
有关详细信息，参阅 `--feature-gates` 和 `--runtime-config`
[kube-apiserver 参数](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。
kube-scheduler、kube-controller-manager 和 kubelet 也需要设置该特性门控。

<!--
When a resource driver reports the status of the devices, then the
`DRAResourceClaimDeviceStatus` feature gate has to be enabled in addition to
`DynamicResourceAllocation`.
-->
当资源驱动程序报告设备状态时，除了需要启用 `DynamicResourceAllocation` 外，
还必须启用 `DRAResourceClaimDeviceStatus` 特性门控。

<!-- 
A quick check whether a Kubernetes cluster supports the feature is to list
DeviceClass objects with:
-->
快速检查 Kubernetes 集群是否支持该特性的方法是列举 DeviceClass 对象：

```shell
kubectl get deviceclasses
```

<!-- 
If your cluster supports dynamic resource allocation, the response is either a
list of DeviceClass objects or:
-->
如果你的集群支持动态资源分配，则响应是 DeviceClass 对象列表或：

```
No resources found
```

<!-- 
If not supported, this error is printed instead:
-->
如果不支持，则会输出如下错误：

```
error: the server doesn't have a resource type "deviceclasses"
```

<!-- 
The default configuration of kube-scheduler enables the "DynamicResources"
plugin if and only if the feature gate is enabled and when using
the v1 configuration API. Custom configurations may have to be modified to
include it.
-->
kube-scheduler 的默认配置仅在启用特性门控且使用 v1 配置 API 时才启用 "DynamicResources" 插件。
自定义配置可能需要被修改才能启用它。

<!-- 
In addition to enabling the feature in the cluster, a resource driver also has to
be installed. Please refer to the driver's documentation for details.
-->
除了在集群中启用该功能外，还必须安装资源驱动程序。
欲了解详细信息，请参阅驱动程序的文档。

<!--
### Enabling admin access

[Admin access](#admin-access) is an *alpha feature* and only enabled when the
`DRAAdminAccess` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver and kube-scheduler.
-->
### 启用管理性质访问  {#enabling-admin-access}

[管理性质访问](#admin-access) 是一个 **Alpha 级别特性**，仅在 kube-apiserver 和 kube-scheduler
中启用了 `DRAAdminAccess` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才生效。

<!--
### Enabling Device Status

[ResourceClaim Device Status](#resourceclaim-device-status) is an *alpha feature* 
and only enabled when the `DRAResourceClaimDeviceStatus` 
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver.
-->
### 启用设备状态  {#enabling-device-status}

[ResourceClaim 设备状态](#resourceclaim-device-status) 是一个 **Alpha 级别特性**，
仅在 kube-apiserver 中启用了 `DRAResourceClaimDeviceStatus`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才生效。

<!--
### Enabling Prioritized List

[Prioritized List](#prioritized-list) is an *alpha feature* and only enabled when the
`DRAPrioritizedList` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver and kube-scheduler. It also requires that the
`DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled.
-->
### 启用按优先级排序的列表  {#enabling-prioritized-list}

[带优先级的列表](#prioritized-list) 是一个 **Alpha 级别特性**，仅在 kube-apiserver 和 kube-scheduler
中启用了 `DRAPrioritizedList` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才生效。
它还要求启用 `DynamicResourceAllocation` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
### Enabling Partitionable Devices

[Partitionable Devices](#partitionable-devices) is an *alpha feature*
and only enabled when the `DRAPartitionableDevices`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver and kube-scheduler.
-->
### 启用可切分的设备  {#enabling-partitionable-devices}

[可切分设备](#partitionable-devices) 是一个 **Alpha 级别特性**，仅在 kube-apiserver 和 kube-scheduler
中启用了 `DRAPartitionableDevices` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才生效。

<!--
### Enabling device taints and tolerations

[Device taints and tolerations](#device-taints-and-tolerations) is an *alpha feature* and only enabled when the
`DRADeviceTaints` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver, kube-controller-manager and kube-scheduler. To use DeviceTaintRules, the
`resource.k8s.io/v1alpha3` API version must be enabled.
-->
### 启用设备污点和容忍度  {#enabling-device-taints-and-tolerations}

[设备污点和容忍度](#device-taints-and-tolerations) 是一个 **Alpha 级别特性**，仅在 kube-apiserver、kube-controller-manager
和 kube-scheduler 中启用了 `DRADeviceTaints` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才生效。
要使用 DeviceTaintRules，必须启用 `resource.k8s.io/v1alpha3` API 版本。

## {{% heading "whatsnext" %}}

<!-- 
- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP.
-->
- 了解更多该设计的信息，
  参阅[使用结构化参数的动态资源分配 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)。
