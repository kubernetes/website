---
title: 动态资源的可观测性
content_type: concept
weight: 30
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "ResourcePoolStatusRequest"
---
<!--
title: Observability of Dynamic Resources
content_type: concept
weight: 30
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "ResourcePoolStatusRequest"
-->

<!-- overview -->

<!--
This page describes how to observe the status and health of resources that are
dynamically allocated with DRA.
-->
本页介绍如何观测通过 DRA 动态分配的资源的状态和健康状况。

<!-- body -->

<!--
## Observability of dynamic resources {#observability-dynamic-resources}

You can check the status of dynamically allocated resources by using any of the
following methods:

* [kubelet device metrics](#monitoring-resources)
* [ResourceClaim status](#resourceclaim-device-status)
* [Device health monitoring](#device-health-monitoring)
-->
## 动态资源的可观测性 {#observability-dynamic-resources}

你可以使用以下任一方法检查动态分配的资源的状态：

* [kubelet 设备指标](#monitoring-resources)
* [ResourceClaim 状态](#resourceclaim-device-status)
* [设备健康监控](#device-health-monitoring)

<!--
### kubelet device metrics {#monitoring-resources}

The `PodResourcesLister` kubelet gRPC service lets you monitor in-use devices.
The `DynamicResource` message provides information that's specific to dynamic
resource allocation, such as the device name and the claim name. For details,
see
[Monitoring device plugin resources](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
-->
### kubelet 设备指标 {#monitoring-resources}

`PodResourcesLister` kubelet gRPC 服务让你可以监控正在使用的设备。
`DynamicResource` 消息提供特定于动态资源分配的信息，例如设备名称和申领名称。
有关细节请参阅[监控设备插件资源](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。

<!--
### ResourceClaim device status {#resourceclaim-device-status}
-->
### ResourceClaim 设备状态 {#resourceclaim-device-status}

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

<!--
DRA drivers can report driver-specific
[device status](/docs/concepts/overview/working-with-objects/#object-spec-and-status)
data for each allocated device in the `status.devices` field of a ResourceClaim.
For example, the driver might list the IP addresses that are assigned to a
network interface device. Updating this field requires specific synthetic RBAC permissions,
see
[Hardening Guide - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
and
[Harden Dynamic Resource Allocation in Your Cluster](/docs/tasks/administer-cluster/hardening-dra/).
-->
DRA 驱动可以在 ResourceClaim 的 `status.devices` 字段中，
为每个已分配的设备报告驱动特定的[设备状态](/zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status)数据。
例如，驱动可能会列出分配给某个网络接口设备的 IP 地址。更新此字段需要特定的合成 RBAC 权限，
请参阅[强化指南 - 动态资源分配](/zh-cn/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)和[在集群中强化动态资源分配（DRA）](/zh-cn/docs/tasks/administer-cluster/hardening-dra/)。

<!--
The accuracy of the information that a driver adds to a ResourceClaim
`status.devices` field depends on the driver. Evaluate drivers to decide whether
you can rely on this field as the only source of device information.
-->
驱动添加到 ResourceClaim `status.devices` 字段中的信息是否准确取决于驱动本身。
请评估各个驱动，以决定是否可以将此字段作为设备信息的唯一来源。

<!--
If you disable the
[`DRAResourceClaimDeviceStatus` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourceClaimDeviceStatus), the
`status.devices` field automatically gets cleared when storing the ResourceClaim.
A ResourceClaim device status is supported when it is possible, from a DRA
driver, to update an existing ResourceClaim where the `status.devices` field is
set.
-->
如果你禁用
[`DRAResourceClaimDeviceStatus` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAResourceClaimDeviceStatus)，
则在存储 ResourceClaim 时，`status.devices` 字段会被自动清除。
当 DRA 驱动能够更新 `status.devices` 字段已设置的现有 ResourceClaim 时，
就支持 ResourceClaim 设备状态。

<!--
In the following example, the `status.devices` field of a ResourceClaim has been
populated by the driver (`resource-driver.example.com`) responsible for managing
the allocated device:
-->
在以下示例中，负责管理已分配设备的驱动（`resource-driver.example.com`）
填充了 ResourceClaim 的 `status.devices` 字段：

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: macvlan-eth0
spec:
...
status:
  allocation:
    devices:
      results:
      - device: eth0
        driver: resource-driver.example.com
        pool: nic-worker-a
        request: macvlan-eth0
        shareID: 8e7acdf9-0290-4ecd-a801-a654b021d2b7
        consumedCapacity:
          resource-driver.example.com/bandwidth: 1G
  devices:
  - conditions:
    - lastTransitionTime: "2025-10-21T08:38:17Z"
      message: Device successfully allocated and assigned to the pod
      reason: NetworkReady
      status: "True"
      type: NetworkReady
    device: eth0
    driver: resource-driver.example.com
    networkData:
      hardwareAddress: 00:01:ec:84:fb:51
      interfaceName: net1
      ips:
      - 10.10.1.2/24
      - 2001:db8::1/64
    pool: nic-worker-a
    shareID: 8e7acdf9-0290-4ecd-a801-a654b021d2b7
```

<!--
If a device has not been allocated, a driver's request to update the `status.devices`
field of the ResourceClaim with that device is rejected. When a device is
deallocated (removed from `status.allocation.devices`), the corresponding entry in
`status.devices` is automatically removed.
-->
如果某个设备尚未被分配，则驱动使用该设备更新 ResourceClaim
`status.devices` 字段的请求会被拒绝。
当设备被取消分配（从 `status.allocation.devices` 中移除）时，
`status.devices` 中相应的条目会被自动移除。

<!--
For details about the `status.devices` field, see the
{{< api-reference page="resource/resource-claim-v1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} API reference.
-->
有关 `status.devices` 字段的细节，请参阅
{{< api-reference page="resource/resource-claim-v1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} API 参考。

<!--
### Device Health Monitoring {#device-health-monitoring}
-->
### 设备健康监控 {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

<!--
Kubernetes provides a mechanism for monitoring and reporting the health of dynamically allocated infrastructure resources.
For stateful applications running on specialized hardware, it is critical to know when a device has failed or become unhealthy. It is also helpful to find out if the device recovers.
-->
Kubernetes 提供了一种机制来监控和报告动态分配的基础设施资源的健康状况。
对于在专用硬件上运行的有状态应用，了解设备何时发生故障或变得不健康至关重要。
了解设备是否恢复也同样有帮助。

<!--
To use this functionality, the `ResourceHealthStatus` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/resource-health-status/) must be enabled (beta and enabled by default since v1.36), and the DRA driver must implement the `DRAResourceHealth` gRPC service.
-->
要使用此功能，必须启用 `ResourceHealthStatus`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#ResourceHealthStatus)
（自 v1.36 起为 Beta 版并默认启用），
并且 DRA 驱动必须实现 `DRAResourceHealth` gRPC 服务。

<!--
When a DRA driver detects that an allocated device has become unhealthy, it reports this status back to the kubelet. This health information is then exposed directly in the Pod's status. The kubelet populates the `allocatedResourcesStatus` field in the status of each container, detailing the health of each device assigned to that container. Each resource health entry can include an optional `message` field with additional human-readable context about the health status, such as error details or failure reasons.
-->
当 DRA 驱动检测到已分配的设备变得不健康时，它会将此状态报告回 kubelet。
随后此健康信息会直接暴露在 Pod 的状态中。
kubelet 会填充每个容器状态中的 `allocatedResourcesStatus` 字段，
详细说明分配给该容器的每个设备的健康状况。
每个资源健康状况条目都可以包含一个可选的 `message` 字段，
其中包含有关健康状况的更多易于理解的上下文信息，如错误详情或故障原因。

<!--
If the kubelet does not receive a health update from a DRA driver within a timeout period, the device's health status is marked as "Unknown". DRA drivers can configure this timeout on a per-device basis by setting the `health_check_timeout_seconds` field in the `DeviceHealth` gRPC message. If not specified, the kubelet uses a default timeout of 30 seconds. This allows different hardware types (for example, GPUs, FPGAs, or storage devices) to use appropriate timeout values based on their health-reporting characteristics.
-->
如果在超时时间段内 kubelet 未收到来自 DRA 驱动的健康更新，
则该设备的健康状况会被标记为 “Unknown”。
DRA 驱动可以通过在 `DeviceHealth` gRPC 消息中
设置 `health_check_timeout_seconds` 字段，按设备配置此超时时间。
如果未指定，kubelet 使用 30 秒的默认超时时间。
这允许不同的硬件类型（例如 GPU、FPGA 或存储设备）根据其健康状况报告特征使用合适的超时值。

<!--
This provides crucial visibility for users and controllers to react to hardware failures.
For a Pod that is failing, you can inspect this status to determine if the failure was related to an unhealthy device.
-->
这为用户和控制器应对硬件故障提供了关键的可见性。
对于发生故障的 Pod，你可以检查此状态以确定故障是否与不健康的设备有关。

{{< note >}}
<!--
Device health status is not updated in the Pod status after a Pod has terminated (for example, in Failed state).
-->
Pod 终止后（例如处于 Failed 状态），设备健康状况不会在 Pod 状态中更新。
{{< /note >}}

<!--
## Resource pool status {#resource-pool-status}
-->
## 资源池状态 {#resource-pool-status}

{{< feature-state feature_gate_name="DRAResourcePoolStatus" >}}

<!--
You can query the availability of devices in resource pools using the
ResourcePoolStatusRequest API. This provides visibility into how many devices
are available, allocated, or unavailable across your cluster's DRA resource pools.
-->
你可以使用 ResourcePoolStatusRequest API 查询资源池中设备的可用性。
这让你能够了解整个集群的 DRA 资源池中有多少设备可用、已分配或不可用。

<!--
To check resource pool status:
-->
要检查资源池状态：

<!--
1. Create a ResourcePoolStatusRequest specifying the driver name (required) and
   optionally a limit on the number of pools returned. You can also limit it to a single pool by specifying a pool name:
-->
1. 创建一个 ResourcePoolStatusRequest，指定驱动名称（必需），
   并可选地指定返回的资源池数量限制。
   你还可以通过指定资源池名称将其限制为单个资源池：

   <!--
   ```yaml
   apiVersion: resource.k8s.io/v1alpha3
   kind: ResourcePoolStatusRequest
   metadata:
     name: check-gpus
   spec:
     driver: example.com/gpu
     # Optional: filter to a specific pool
     # poolName: my-pool
     # Optional: limit number of pools returned (default: 100, max: 1000)
     # limit: 10
   ```
   -->

   ```yaml
   apiVersion: resource.k8s.io/v1alpha3
   kind: ResourcePoolStatusRequest
   metadata:
     name: check-gpus
   spec:
     driver: example.com/gpu
     # 可选：筛选特定的资源池
     # poolName: my-pool
     # 可选：限制返回的资源池数量（默认值：100，最大值：1000）
     # limit: 10
   ```

<!--
1. Wait for the controller to process the request:
-->
2. 等待控制器处理该请求：

   ```shell
   kubectl wait --for=condition=Complete resourcepoolstatusrequest/check-gpus --timeout=30s
   ```

<!--
1. Read the status to see pool availability:
-->
3. 读取状态以查看资源池可用性：

   ```shell
   kubectl get resourcepoolstatusrequest/check-gpus -o yaml
   ```

   <!--
   The status includes:
   - `poolCount`: total number of pools matching the filter (may exceed the number
     of pools listed if truncated by the limit).
   -->

   状态中包括：

   - `poolCount`：与筛选条件匹配的资源池总数
     （如果因 limit 而被截断，所列出的资源池数量可能更少）。

   <!--
   - `pools`: a list of pool details, each containing:
     - `driver` and `poolName`: identify the pool.
     - `generation`: the latest pool generation observed across ResourceSlices.
     - `resourceSliceCount`: the number of ResourceSlices making up the pool.
     - `totalDevices`: total devices in the pool.
     - `allocatedDevices`: devices currently allocated to claims.
     - `availableDevices`: devices available for allocation
       (totalDevices - allocatedDevices - unavailableDevices).
     - `unavailableDevices`: devices not available due to taints or other conditions.
     - `nodeName`: the node associated with the pool, if any.
     - `validationError`: set when the pool's data could not be fully validated
       (for example, during a generation rollout). When set, device count fields
       may be unset.
     - `partitionSummary`: for [partitionable](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
       pools, per-partition-type allocatability (see
       [Partition summary](#resource-pool-partition-summary)).
     - `shareableSummary`: for pools with [shareable devices](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity),
       aggregate capacity usage (see
       [Shareable summary](#resource-pool-shareable-summary)).
   -->

   - `pools`：资源池详情列表，每一项包含：
     - `driver` 和 `poolName`：标识该资源池。
     - `generation`：在所有 ResourceSlice 中观测到的最新资源池代数。
     - `resourceSliceCount`：构成该资源池的 ResourceSlice 数量。
     - `totalDevices`：资源池中的设备总数。
     - `allocatedDevices`：当前已分配给申领的设备。
     - `availableDevices`：可供分配的设备
       （totalDevices - allocatedDevices - unavailableDevices）。
     - `unavailableDevices`：因污点或其他状况而不可用的设备。
     - `nodeName`：与该资源池关联的节点（如果有）。
     - `validationError`：当资源池的数据无法被完整验证时设置
       （例如在代数更新上线期间）。设置后，设备计数字段可能未被设置。
     - `partitionSummary`：对于[可分区](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)资源池，提供按分区类型划分的可分配性
       （参见[分区摘要](#resource-pool-partition-summary)）。
     - `shareableSummary`：对于包含[可共享设备](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)的资源池，提供聚合容量使用量
       （参见[共享摘要](#resource-pool-shareable-summary)）。

   <!--
   - `conditions`: includes `Complete` (success) or `Failed` (error) condition types.
   -->

   - `conditions`：包括 `Complete`（成功）或 `Failed`（错误）状况类型。

<!--
1. Delete the request when done:
-->
4. 完成后删除该请求：

   ```shell
   kubectl delete resourcepoolstatusrequest/check-gpus
   ```

<!--
ResourcePoolStatusRequest objects are processed once by a controller in
kube-controller-manager. The spec is immutable once created, and the entire
object becomes immutable once the status is populated. To get updated
availability data, delete and recreate the request. Completed requests are
automatically cleaned up after 1 hour.
-->
ResourcePoolStatusRequest 对象由 kube-controller-manager 中的控制器处理一次。
规约一经创建便不可变，而一旦状态被填充，整个对象也会变为不可变。
要获取更新的可用性数据，请删除并重新创建该请求。
已完成的请求会在 1 小时后被自动清理。

<!--
This feature requires explicit RBAC permissions on the ResourcePoolStatusRequest
resource. No default ClusterRoles include this permission.
-->
此功能需要对 ResourcePoolStatusRequest 资源的显式 RBAC 权限。
没有任何默认的 ClusterRole 包含此权限。

<!--
Resource pool status is controlled by the
[`DRAResourcePoolStatus` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
in the `kube-apiserver` and `kube-controller-manager`.
-->
资源池状态由 `kube-apiserver` 和 `kube-controller-manager` 中的
[`DRAResourcePoolStatus` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)控制。

<!--
### Partition summary {#resource-pool-partition-summary}
-->
### 分区摘要 {#resource-pool-partition-summary}

{{< feature-state feature_gate_name="DRAPartitionableDevicesType" >}}

<!--
A single physical device such as a GPU may be advertised as several partition
types (for example, a full GPU versus a half-sized MIG slice) that draw from the
same shared counters. Because these partitions compete for the same underlying
capacity, a plain device count does not tell you how many of each type can still
be allocated. For [partitionable](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
pools, the `partitionSummary` view answers that question. For each partition type
it reports:
-->
GPU 等单个物理设备可能会被通告为多个分区类型
（例如完整 GPU 与半尺寸的 MIG 切片），这些分区类型从同一组共享计数器取用资源。
由于这些分区会竞争相同的底层容量，单纯的设备计数无法告诉你每种类型还有多少仍可分配。
对于[可分区](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)资源池，
`partitionSummary` 视图可以回答这个问题。对于每个分区类型，它会报告：

<!--
- `attribute`: the fully qualified name of the device attribute whose value
  groups this entry. It is the ResourceSlice's `spec.partitionTypeAttribute`, or
  the request's `spec.defaultPartitionTypeAttribute` when the slice declares none.
- `type`: the value of that attribute on the device (for example, `Full` or
  `Half`).
- `total`: the number of devices of this partition type in the pool.
- `allocatable`: how many *additional* devices of this partition type could still
  be allocated given current shared-counter consumption.
-->
- `attribute`：其值用于分组此条目的设备属性的完全限定名称。
  它对应 ResourceSlice 的 `spec.partitionTypeAttribute`；
  当切片未声明该属性时，则对应请求的 `spec.defaultPartitionTypeAttribute`。
- `type`：设备上该属性的值（例如 `Full` 或 `Half`）。
- `total`：资源池中此分区类型的设备数量。
- `allocatable`：在当前共享计数器消耗情况下，
  此分区类型还有多少**额外**设备仍可分配。

<!--
The named attribute must be a string attribute. If a partitionable device's
partition-type attribute is missing or is not a string (for example, an integer,
boolean, or version value), the pool reports a validation error instead of a
partition summary. There is no special handling for
[list-type attributes](/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes);
a non-string attribute is simply not a valid partition-type attribute.
-->
指定的属性必须是字符串属性。如果可分区设备的分区类型属性缺失，或者不是字符串
（例如整数、布尔值或版本值），则资源池会报告验证错误，而不是分区摘要。
对于[列表类型属性](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes)没有特殊处理；
非字符串属性根本就不是有效的分区类型属性。

<!--
To produce this view, the driver labels each partitionable device with a string
attribute whose value names the partition type, and names that attribute in the
ResourceSlice's `partitionTypeAttribute` field:
-->
为了生成此视图，驱动为每个可分区设备打上一个字符串属性，
其值指明分区类型，并在 ResourceSlice 的 `partitionTypeAttribute` 字段中指定该属性：

<!--
```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
# ...
spec:
  # Every partitionable device in this slice carries this attribute; devices
  # that share a value share the same shared-counter cost.
  partitionTypeAttribute: gpu.example.com/profile
```
-->
```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
# ...
spec:
  # 此切片中的每个可分区设备都带有该属性；
  # 共享同一值的设备具有相同的共享计数器开销。
  partitionTypeAttribute: gpu.example.com/profile
```

<!--
If a driver has not yet been updated to declare `partitionTypeAttribute`, a
request can still obtain a partition summary by naming a fallback attribute in
its spec. A slice's own `partitionTypeAttribute` always takes precedence; the
request-level default applies only to devices whose slice does not declare one:
-->
如果驱动尚未更新以声明 `partitionTypeAttribute`，
请求仍可以通过在规约中指定一个回退属性来获取分区摘要。
切片自身的 `partitionTypeAttribute` 始终优先；
请求级别的默认值只适用于其切片未声明该属性的设备：

<!--
```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: ResourcePoolStatusRequest
metadata:
  name: check-gpu-partitions
spec:
  driver: gpu.example.com
  # Fallback grouping attribute for slices that don't declare one themselves.
  defaultPartitionTypeAttribute: gpu.example.com/profile
```
-->
```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: ResourcePoolStatusRequest
metadata:
  name: check-gpu-partitions
spec:
  driver: gpu.example.com
  # 供自身未声明分组属性的切片使用的回退分组属性。
  defaultPartitionTypeAttribute: gpu.example.com/profile
```

<!--
When neither the slice nor the request names an attribute, a partitionable pool
reports no `partitionSummary`.
-->
当切片和请求都未指定属性时，可分区资源池不会报告 `partitionSummary`。

<!--
The `partitionSummary` view is controlled by the
[`DRAPartitionableDevicesType` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevicesType)
in the `kube-apiserver` and `kube-controller-manager`, which in turn requires the
[`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
and
[`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
feature gates to be enabled.
-->
`partitionSummary` 视图由 `kube-apiserver` 和 `kube-controller-manager` 中的
[`DRAPartitionableDevicesType` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevicesType)控制，
而该门控又要求启用
[`DRAResourcePoolStatus`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
和
[`DRAPartitionableDevices`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
特性门控。

<!--
### Shareable summary {#resource-pool-shareable-summary}

For pools that contain [shareable devices](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)
(devices that set `allowMultipleAllocations` and can be consumed by multiple
claims), `shareableSummary` reports aggregate capacity usage across the pool:
-->
### 共享摘要 {#resource-pool-shareable-summary}

对于包含[可共享设备](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)的资源池
（即设置了 `allowMultipleAllocations`、可被多个申领消耗的设备），`shareableSummary` 会报告整个资源池的聚合容量使用量：

<!--
- `fullyAvailableDevices`: shareable devices with no capacity consumed.
- `partiallyAvailableDevices`: shareable devices with some, but not all, capacity
  consumed.
- `capacity`: per capacity name, the aggregate `total`, `consumed`, and
  `available` (`total` minus `consumed`, never negative) amounts across the pool.
-->
- `fullyAvailableDevices`：未消耗任何容量的可共享设备。
- `partiallyAvailableDevices`：消耗了部分但不是全部容量的可共享设备。
- `capacity`：按容量名称给出整个资源池中聚合的 `total`、`consumed` 和
  `available`（即 `total` 减去 `consumed`，不会为负）数量。

<!--
The `shareableSummary` is populated only when at least one device in the pool is
shareable. It is part of the [resource pool status](#resource-pool-status)
feature (the
[`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
feature gate) and does not require `DRAPartitionableDevicesType`; the shareable
devices it summarizes come from the
[consumable capacity](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)
feature.
-->
只有当资源池中至少有一个设备可共享时，才会填充 `shareableSummary`。
它属于[资源池状态](#resource-pool-status)功能
（[`DRAResourcePoolStatus`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus) 特性门控），
不要求启用 `DRAPartitionableDevicesType`；
它所汇总的可共享设备来自[可消耗容量](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity)特性。

<!--
## DRA device metadata in containers {#device-metadata}
-->
## 容器中的 DRA 设备元数据 {#device-metadata}

{{< feature-state state="beta" for_k8s_version="v1.37" >}}

<!--
DRA drivers can expose device metadata such as device attributes (PCI bus
addresses or mediated device UUIDs) and network configuration directly to
containers as JSON files.
This lets applications discover information about allocated devices without
querying the Kubernetes API or using custom controllers.
-->
DRA 驱动可以将设备元数据（例如设备属性（PCI 总线地址或中介设备 UUID）
和网络配置）以 JSON 文件的形式直接暴露给容器。
这让应用无需查询 Kubernetes API 或使用自定义控制器，
即可发现已分配设备的相关信息。

<!--
KEP-5304 defines a
[device metadata protocol](#device-metadata-protocol) that drivers must follow
so that applications see a consistent layout across drivers and clusters. The
[DRA kubelet plugin library](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
implements this protocol.
-->
KEP-5304 定义了驱动必须遵循的[设备元数据协议](#device-metadata-protocol)，
以便应用在不同驱动和集群之间看到一致的布局。
[DRA kubelet 插件库](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)实现了此协议。

<!--
Device metadata follows the same rules as device access: it is available inside
a container only when that container requests the device. For details, see
[Request devices in workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads).
-->
设备元数据遵循与设备访问相同的规则：只有当容器请求该设备时，元数据才在该容器内可用。
有关细节请参阅[使用 DRA 在工作负载中请求设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads)。

<!--
### Device metadata protocol {#device-metadata-protocol}

The protocol consists of four rules:
-->
### 设备元数据协议 {#device-metadata-protocol}

该协议由四条规则组成：

<!--
1. **File paths.** Metadata files live inside containers under
   `/var/run/kubernetes.io/dra-device-attributes`. For a directly referenced
   ResourceClaim, the path is
   `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`. For a
   claim created from a ResourceClaimTemplate, the path is
   `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`,
   where `podClaimName` is `pod.spec.resourceClaims[].name`.
-->
1. **文件路径。** 元数据文件位于容器内的
   `/var/run/kubernetes.io/dra-device-attributes` 下。
   对于直接引用的 ResourceClaim，路径为
   `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`。
   对于由 ResourceClaimTemplate 创建的申领，路径为
   `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`，
   其中 `podClaimName` 为 `pod.spec.resourceClaims[].name`。

   <!--
   When a request uses a [prioritized list](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#prioritized-list), only the
   top-level request name is used for the `<requestName>` path segment. The
   `requests[].name` field in the file contains the full
   `<request>/<subrequest>` reference, such as `gpu/high-memory`.
   -->
   当请求使用[优先级列表](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#prioritized-list)时，
   `<requestName>` 路径段只使用顶层请求名称。文件中的 `requests[].name` 字段包含完整的
   `<request>/<subrequest>` 引用，例如 `gpu/high-memory`。

   <!--
   The path constants are defined in
   [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata).
   -->
   路径常量定义在
   [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata)。

<!--
1. **JSON API.** Each file is a stream of one or more
   [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)
   objects. Each object has `apiVersion` and `kind`, following Kubernetes API
   conventions. The same metadata is encoded once per configured API version
   in the order selected by the driver. Consumers use the first version that
   they can decode and skip unknown versions. A malformed object in a known
   version is an error.
-->
2. **JSON API。** 每个文件是一个或多个
   [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)
   对象的流。每个对象都有 `apiVersion` 和 `kind`，遵循 Kubernetes API 约定。
   同一份元数据会按驱动选择的顺序，为每个已配置的 API 版本各编码一次。
   使用方会使用它们能够解码的第一个版本，并跳过未知版本。
   已知版本中的格式错误对象会被视为错误。

<!--
1. **Generation.** The initial file has `metadata.generation` set to `1`.
   Each update increments the generation so that consumers can detect changes.
-->
3. **代数。** 初始文件的 `metadata.generation` 设为 `1`。
   每次更新都会递增该代数，以便使用方能够检测到变化。

<!--
1. **Container exposure.** The DRA kubelet plugin library uses
   {{< glossary_tooltip text="CDI" term_id="cdi" >}} to bind-mount each file
   read-only. Other implementations can use a different mechanism as long as
   the file appears at the required path and is read-only.
-->
4. **容器暴露。** DRA kubelet 插件库使用
   {{< glossary_tooltip text="CDI" term_id="cdi" >}} 将每个文件以只读方式绑定挂载。
   其他实现可以使用不同的机制，只要文件出现在所需的路径上并且是只读的即可。

<!--
### Enable device metadata in a driver {#device-metadata-enable}

Device metadata is a driver-side feature. It has no Kubernetes feature gate and
is disabled by default in the DRA kubelet plugin library. A driver must enable
the feature and explicitly select the versions that it writes:
-->
### 在驱动中启用设备元数据 {#device-metadata-enable}

设备元数据是驱动侧的功能。它没有 Kubernetes 特性门控，
并且在 DRA kubelet 插件库中默认禁用。
驱动必须启用该功能并明确选择要写入的版本：

```go
kubeletplugin.EnableDeviceMetadata(true, []schema.GroupVersion{
	metadatav1beta1.SchemeGroupVersion,
	metadatav1alpha1.SchemeGroupVersion,
})
```

<!--
The `v1beta1` version is required. A driver can also write `v1alpha1` for
compatibility with older consumers. The order in the slice is the order in the
metadata stream; the framework does not sort the versions. Drivers should put
the newest version first. Enabling device metadata with no versions, without
`v1beta1`, or with an unknown version causes the plugin to fail during startup.
-->
`v1beta1` 版本是必需的。驱动也可以写入 `v1alpha1`，以兼容较旧的使用方。
切片中的顺序就是元数据流中的顺序；框架不会对版本排序。驱动应将最新版本放在最前面。
启用了设备元数据但未提供版本、缺少 `v1beta1` 或使用未知版本，
都会导致插件在启动期间失败。

<!--
For each prepared device, the driver can populate
[`Device.Metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Device)
with
[`kubeletplugin.DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#DeviceMetadata).
Drivers should include the attributes that they publish for that device in its
ResourceSlice, so workloads see the same information at runtime. Drivers can
also include attributes that are only relevant at runtime. For network devices,
drivers can add interface names, IP addresses, and hardware addresses after CNI
configuration by calling
[`UpdateRequestMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Helper.UpdateRequestMetadata).
-->
对于每个已准备的设备，驱动可以用
[`kubeletplugin.DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#DeviceMetadata)
填充
[`Device.Metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Device)。
驱动应在其 ResourceSlice 中包含它为该设备发布的属性，这样工作负载在运行时能看到相同的信息。
驱动也可以包含仅在运行时才有意义的属性。对于网络设备，驱动可以在 CNI 配置完成后，
通过调用
[`UpdateRequestMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Helper.UpdateRequestMetadata)
添加接口名称、IP 地址和硬件地址。

<!--
The kubelet plugin API links above describe integration for driver authors.
The DRA framework does not define a universal command-line flag, so cluster
operators enable the feature through the deployment configuration provided by
their driver.
-->
上面的 kubelet 插件 API 链接描述了面向驱动开发者的集成方式。
DRA 框架没有定义通用的命令行标志，
因此集群运维人员通过其驱动提供的部署配置来启用该功能。

<!--
When enabled, the DRA kubelet plugin library writes metadata files while
preparing allocated devices. It also writes CDI specifications to `/var/run/cdi`
by default. The container runtime must be configured to discover CDI
specifications from that directory. The library determines the minimum CDI
specification version required for each generated specification.
-->
启用后，DRA kubelet 插件库会在准备已分配设备时写入元数据文件。
它还会默认将 CDI 规范写入 `/var/run/cdi`。
容器运行时必须配置为从该目录发现 CDI 规范。
该库会为生成的每个规范确定所需的最低 CDI 规范版本。

<!--
When one request allocates devices from multiple DRA drivers, each driver writes
its own metadata file. Consumers that know the driver name should construct the
exact path from the claim, request, and driver names. Go consumers can use
[`ReadResourceClaimMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimMetadata)
or
[`ReadResourceClaimTemplateMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimTemplateMetadata)
to read and merge all per-driver files for a request.
-->
当一个请求从多个 DRA 驱动分配设备时，每个驱动都会写入自己的元数据文件。
知道驱动名称的使用方应根据申领、请求和驱动名称构造确切的路径。
Go 使用方可以使用
[`ReadResourceClaimMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimMetadata)
或
[`ReadResourceClaimTemplateMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimTemplateMetadata)
来读取并合并某个请求的所有按驱动划分的文件。

<!--
### Metadata schema {#device-metadata-schema}

Each object in a metadata file conforms to the
[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)
API (`metadata.resource.k8s.io/v1beta1`).
-->
### 元数据模式 {#device-metadata-schema}

元数据文件中的每个对象都符合
[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)
API（`metadata.resource.k8s.io/v1beta1`）。

<!--
The schema contains:
-->
该模式包含：

<!--
- Standard object metadata for the ResourceClaim, including its name,
  namespace, UID, and metadata generation.
- The optional `podClaimName` for a claim generated from a
  ResourceClaimTemplate.
- A list of requests. Each request has a required name and a list of allocated
  devices.
- The driver, pool, and name for each device.
- Optional device attributes and network data.
-->
- ResourceClaim 的标准对象元数据，包括其名称、名字空间、UID 和元数据代数。
- 对于由 ResourceClaimTemplate 生成的申领，可选的 `podClaimName`。
- 请求列表。每个请求有一个必需的名称和一个已分配设备的列表。
- 每个设备的驱动、资源池和名称。
- 可选的设备属性和网络数据。

<!--
Attribute values use the same representation as ResourceSlice device
attributes. Each attribute has exactly one scalar value (`int`, `bool`,
`string`, or `version`) or list value (`ints`, `bools`, `strings`, or
`versions`). Device capacity values are not included in device metadata.
-->
属性值使用与 ResourceSlice 设备属性相同的表示形式。
每个属性恰好有一个标量值（`int`、`bool`、`string` 或 `version`）
或列表值（`ints`、`bools`、`strings` 或 `versions`）。
设备容量值不包含在设备元数据中。

<!--
Network data can contain `interfaceName`, `ips`, and `hardwareAddress`.
For field constraints, see the
[`DeviceMetadata` API documentation](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata).
-->
网络数据可以包含 `interfaceName`、`ips` 和 `hardwareAddress`。
有关字段约束，请参阅
[`DeviceMetadata` API 文档](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata)。

<!--
The following example shows one object in a metadata stream for a GPU device
allocated through a ResourceClaimTemplate:
-->
以下示例展示通过 ResourceClaimTemplate 分配的 GPU 设备在元数据流中的一个对象：

```json
{
  "kind": "DeviceMetadata",
  "apiVersion": "metadata.resource.k8s.io/v1beta1",
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
The DRA kubelet plugin does not validate metadata before writing it. Go
consumers can opt in to generated validation when decoding a stream. Decoding
and validation have separate results: a validation error does not prevent a
successfully decoded object from being returned. For usage, see
[Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/#read-metadata-application).
-->
DRA kubelet 插件在写入元数据之前不会对其进行验证。Go 使用方在解码流时可以选择启用生成的验证。
解码和验证的结果是分开的：验证错误不会阻止返回已成功解码的对象。有关用法，
请参阅[访问 DRA 设备元数据](/zh-cn/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/#read-metadata-application)。

<!--
### Immediate and deferred metadata {#device-metadata-lifecycle}

For immediate metadata, the driver supplies attributes or network data while it
prepares the claim. The DRA kubelet plugin writes the file with generation `1`
before the consuming container starts.
-->
### 即时元数据与延迟元数据 {#device-metadata-lifecycle}

对于即时元数据，驱动在准备申领时提供属性或网络数据。
DRA kubelet 插件在使用该设备的容器启动之前写入代数 `1` 的文件。

<!--
For deferred metadata, the driver can prepare a device without attributes or
network data. The initial generation `1` file contains the device identity. The
driver later calls `UpdateRequestMetadata` to replace the complete stream
atomically and increment the generation. An update requires the initial file to
exist. If device preparation returns no devices for a request, the framework
creates neither a metadata file nor a metadata CDI device for that request.
-->
对于延迟元数据，驱动可以在没有属性或网络数据的情况下准备设备。初始的代数 `1` 文件包含设备标识。
驱动稍后调用 `UpdateRequestMetadata` 以原子方式替换整个流并递增代数。
更新要求初始文件存在。如果设备准备为某个请求返回空设备，
框架不会为该请求创建元数据文件，也不会创建元数据 CDI 设备。

<!--
Metadata remains available to each consuming container for the lifetime of that
container. The framework removes the metadata files and CDI specifications
after the claim is unprepared.
-->
在每个使用该设备的容器的生命期内，元数据对该容器始终可用。
框架在申领被取消准备后移除元数据文件和 CDI 规范。

<!--
To learn how to use device metadata in your workloads, see
[Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/).
-->
要了解如何在工作负载中使用设备元数据，
请参阅[访问 DRA 设备元数据](/zh-cn/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)。

<!--
### Custom drivers {#device-metadata-custom-drivers}

Custom drivers that do not use the DRA kubelet plugin library must implement the
[device metadata protocol](#device-metadata-protocol) themselves. This includes
writing the versioned `DeviceMetadata` stream at the correct paths, incrementing
`metadata.generation` on every update, and exposing files read-only through CDI
or an equivalent mechanism.
-->
### 自定义驱动 {#device-metadata-custom-drivers}

不使用 DRA kubelet 插件库的自定义驱动必须自行实现[设备元数据协议](#device-metadata-protocol)。
这包括在正确的路径下写入带版本的 `DeviceMetadata` 流、在每次更新时递增 `metadata.generation`，
以及通过 CDI 或等效机制以只读方式暴露文件。
