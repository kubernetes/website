---
title: 动态资源分配
content_type: concept
weight: 20
aliases:
- /zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/
---
<!--
reviewers:
- klueska
- pohly
title: Dynamic Resource Allocation
content_type: concept
weight: 20
aliases:
- /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
-->

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!--
This section introduces _dynamic resource allocation (DRA)_ in Kubernetes.
-->
本节介绍 Kubernetes 中的**动态资源分配（Dynamic Resource Allocation，DRA）**。

{{< glossary_definition prepend="DRA 是" term_id="dra" length="all" >}}

<!--
Allocating resources with DRA offers a similar experience to
[dynamic volume provisioning](/docs/concepts/storage/dynamic-provisioning/),
in which you use PersistentVolumeClaims to _claim_ storage capacity from storage classes,
and request the claimed capacity for use in your Pods.
-->
使用 DRA 分配资源提供了与
[动态卷制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)
类似的体验：你使用 PersistentVolumeClaims 从存储类中**申领**存储容量，
并在 Pod 中请求使用该已申领的容量。

<!-- body -->

<!--
### Benefits of DRA {#dra-benefits}
-->
### DRA 的优势 {#dra-benefits}

<!--
DRA provides a flexible way to categorize, request, and use devices in your cluster.
Using DRA provides benefits like the following:

* **Flexible device filtering**: use common expression language (CEL) to perform
  fine-grained filtering for specific device attributes.
* **Device sharing**: share the same resource with multiple containers or Pods
  by referencing the corresponding resource claim.
* **Device configuration**: attach vendor-specific device configurations to your resource claim, enabling per-workload device configuration, rather than today's per-node device configuration
* **Centralized device categorization**: device drivers and cluster admins can
  use device classes to provide app operators with hardware categories that are
  optimized for various use cases. For example, you can create a cost-optimized
  device class for general-purpose workloads, and a high-performance device
  class for critical jobs.
* **Simplified Pod requests**: with DRA, app operators don't need to specify
  device quantities in Pod resource requests. Instead, the Pod references a
  resource claim, and the device configuration in that claim applies to the Pod.
-->
DRA 提供了一种灵活的方式来分类、请求和使用集群中的设备。
使用 DRA 具有以下优势：

* **灵活的设备过滤：** 使用公共表达式语言（CEL）对特定设备属性进行细粒度过滤。
* **设备共享：** 通过引用相应的资源申领，与多个容器或 Pod 共享同一资源。
* **设备配置：** 将特定于供应商的设备配置附加到你的资源申领，
  启用按工作负载的设备配置，而非如今的按节点设备配置。
* **集中式设备分类：** 设备驱动和集群管理员可以使用 DeviceClass
  为应用运维人员提供针对各种用例优化的硬件类别。
  例如，你可以为通用工作负载创建成本优化的 DeviceClass，
  为关键作业创建高性能的 DeviceClass。
* **简化的 Pod 请求：** 通过 DRA，应用运维人员无需在 Pod 资源请求中指定设备数量。
  相反，Pod 引用一个资源申领，该申领中的设备配置将应用于该 Pod。

<!--
These benefits provide significant improvements in the device allocation
workflow when compared to
[device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/),
which require per-container device requests, don't support device sharing, and
don't support expression-based device filtering.
-->
与需要按容器请求设备、不支持设备共享且不支持基于表达式的设备过滤的
[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)相比，
这些优势在设备分配工作流方面提供了显著改进。

<!--
### Types of DRA users {#dra-user-types}
-->
### DRA 用户类型 {#dra-user-types}

<!--
The workflow of using DRA to allocate devices involves the following types of users:
-->
使用 DRA 分配设备的工作流涉及以下类型的用户：

<!--
* **Device owner**: responsible for devices. Device owners might be commercial
  vendors, the cluster operator, or another entity. To use DRA, devices must
  have DRA-compatible drivers that do the following:

  * Create ResourceSlices that provide Kubernetes with information about
    nodes and resources.
  * Update ResourceSlices when resource capacity in the cluster changes.
  * Configure devices according to the claim, and attach them to containers via Container Device Interface (CDI).
  * Optionally, create DeviceClasses that workload operators can use to
    claim devices.
-->
* **设备所有者（Device owner）：** 负责设备。设备所有者可以是商业供应商、
  集群运维人员或其他实体。要使用 DRA，设备必须具备兼容 DRA 的驱动，
  这些驱动需要完成以下工作：

  * 创建 ResourceSlice，为 Kubernetes 提供关于节点和资源的信息。
  * 当集群中的资源容量发生变化时更新 ResourceSlice。
  * 根据申领配置设备，并通过容器设备接口（Container Device Interface，CDI）
    将它们附加到容器。
  * 可选地，创建工作负载运维人员可用于申领设备的 DeviceClass。

<!--
* **Cluster admin**: responsible for configuring clusters and nodes,
  attaching devices, installing drivers, and similar tasks. To use DRA,
  cluster admins do the following:

  * Attach devices to nodes.
  * Install device drivers that support DRA.
  * Optionally, create DeviceClasses that workload operators can use to claim devices.
-->
* **集群管理员（Cluster admin）：** 负责配置集群和节点、附加设备、
  安装驱动等类似任务。要使用 DRA，集群管理员需要完成以下工作：

  * 将设备附加到节点。
  * 安装支持 DRA 的设备驱动。
  * 可选地，创建工作负载运维人员可用于申领设备的 DeviceClass。

<!--
* **Workload operator**: responsible for deploying and managing workloads in the
  cluster. To use DRA to allocate devices to Pods, workload operators do the following:

  * Create ResourceClaims or ResourceClaimTemplates to request specific
    configurations within DeviceClasses.
  * Deploy workloads that use specific ResourceClaims or ResourceClaimTemplates.
-->
* **工作负载运维人员（Workload operator）：** 负责在集群中部署和管理工作负载。
  要使用 DRA 为 Pod 分配设备，工作负载运维人员需要完成以下工作：

  * 创建 ResourceClaim 或 ResourceClaimTemplate，以在 DeviceClass 中请求特定配置。
  * 部署使用特定 ResourceClaim 或 ResourceClaimTemplate 的工作负载。

<!--
## Limitations
-->
## 限制

<!--
* The Kubernetes scheduler doesn't support
  [preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/) for
  DRA resources. This means that an existing Pod that's running on a node and is
  using DRA resources can't be preempted by a higher-priority Pod that also needs
  DRA resources. The high-priority Pod will remain in a pending state until the device
  becomes available, which happens when the conflicting Pod terminates or is
  manually deleted.
-->
* Kubernetes 调度器不支持为 DRA 资源进行
  [抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
  这意味着在节点上运行并使用 DRA 资源的现有 Pod，
  不能被同样需要 DRA 资源的更高优先级 Pod 抢占。
  高优先级 Pod 将保持挂起状态，直到设备可用——这发生在冲突 Pod 终止
  或被手动删除时。

## {{% heading "whatsnext" %}}

<!--
- [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Allocate devices to workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- [Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP.
-->
- [在集群中设置 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [使用 DRA 为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- [访问 DRA 设备元数据](/zh-cn/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
- 有关设计的更多信息，请参阅
  [使用结构化参数的动态资源分配](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP。
