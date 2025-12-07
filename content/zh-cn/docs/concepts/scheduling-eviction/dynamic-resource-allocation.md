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
-->

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!--
This page describes _dynamic resource allocation (DRA)_ in Kubernetes.
-->
本页描述 Kubernetes 中的 **动态资源分配（DRA）**。

<!-- body -->
<!--
## About DRA {#about-dra}
-->
## 关于 DRA {#about-dra}

{{< glossary_definition prepend="DRA 是" term_id="dra" length="all" >}}


<!--
Allocating resources with DRA is a similar experience to
[dynamic volume provisioning](/docs/concepts/storage/dynamic-provisioning/), in
which you use PersistentVolumeClaims to claim storage capacity from storage
classes and request the claimed capacity in your Pods.
-->
使用 DRA 来分配资源的体验与[动态卷制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)类似，
你可以使用 PersistentVolumeClaim 基于存储类来申领存储容量，并在 Pod
中请求这些已申领的容量。

<!--
### Benefits of DRA {#dra-benefits}
-->
### DRA 的好处 {#dra-benefits}

<!--
DRA provides a flexible way to categorize, request, and use devices in your
cluster. Using DRA provides benefits like the following:
-->
DRA 为集群中的设备提供了一种灵活的方式来进行分类、请求和使用。 使用 DRA 具有以下好处：

<!--
* **Flexible device filtering**: use common expression language (CEL) to perform
  fine-grained filtering for specific device attributes.
* **Device sharing**: share the same resource with multiple containers or Pods
  by referencing the corresponding resource claim.
* **Centralized device categorization**: device drivers and cluster admins can
  use device classes to provide app operators with hardware categories that are
  optimized for various use cases. For example, you can create a cost-optimized
  device class for general-purpose workloads, and a high-performance device
  class for critical jobs.
* **Simplified Pod requests**: with DRA, app operators don't need to specify
  device quantities in Pod resource requests. Instead, the Pod references a
  resource claim, and the device configuration in that claim applies to the Pod.
-->
* **灵活地过滤设备**：使用 Common Expression Language (CEL) 对特定设备属性进行细粒度过滤。
* **设备共享**：通过引用相应的资源声明，可以让多个容器或 Pod 共享同一个资源。
* **集中化的设备分类**：设备驱动和集群管理员可以使用设备类，
  来为应用运维人员提供针对不同使用场景优化的硬件类别。
  例如，你可以创建一个面向通用工作负载的成本优化型设备类，以及一个面向关键任务的高性能设备类。
* **简化 Pod 的资源请求**：使用 DRA 后，应用运维人员无需在 Pod 的资源请求中明确指定设备的规格。
  相反，Pod 只需引用一个资源申领，这个申领中的设备配置将会自动应用到该 Pod。

<!--
These benefits provide significant improvements in the device allocation
workflow when compared to
[device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/),
which require per-container device requests, don't support device sharing, and
don't support expression-based device filtering.
-->

这些好处相较于[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)，
在设备分配的流程中带来了显著的改进。设备插件需要为每个容器单独请求设备，且不支持设备共享，
也无法基于表达式进行对设备进行过滤。

<!--
### Types of DRA users {#dra-user-types}

The workflow of using DRA to allocate devices involves the following types of
users:
-->

### DRA 用户的类型 {#dra-user-types}
使用 DRA 进行设备分配的工作流程里通常涉及到以下几类用户：


<!--
* **Device owner**: responsible for devices. Device owners might be commercial
  vendors, the cluster operator, or another entity. To use DRA, devices must
  have DRA-compatible drivers that do the following:

  * Create ResourceSlices that provide Kubernetes with information about
    nodes and resources.
  * Update ResourceSlices when resource capacity in the cluster changes.
  * Optionally, create DeviceClasses that workload operators can use to
    claim devices.
-->
* **设备所有者**： 为设备负责。设备的所有者可以是商业厂商、集群运营者，或其他实体。
  若要使用 DRA，设备必须具备兼容 DRA 的驱动程序，该驱动需完成以下工作：

  * 创建 ResourceSlice，向 Kubernetes 提供节点及资源的信息；
  * 当集群中的资源容量发生变化时，更新相应的 ResourceSlice；
  * 可选地，创建 DeviceClass 以供工作负载运维人员申领设备。

<!--
* **Cluster admin**: responsible for configuring clusters and nodes,
  attaching devices, installing drivers, and similar tasks. To use DRA,
  cluster admins do the following:

  * Attach devices to nodes.
  * Install device drivers that support DRA.
  * Optionally, create DeviceClasses that workload operators can use to claim
    devices.
-->
* **集群管理员**：负责集群与节点配置、设备挂接、驱动安装等相关工作。
  若要使用 DRA，集群管理员需要执行以下操作：

  * 将设备挂接到节点上；
  * 安装支持 DRA 的设备驱动；
  * 可选地，创建 DeviceClass 以供工作负载运维人员用来申领设备。

<!--
* **Workload operator**: responsible for deploying and managing workloads in the
  cluster. To use DRA to allocate devices to Pods, workload operators do the
  following:

  * Create ResourceClaims or ResourceClaimTemplates to request specific
    configurations within DeviceClasses.
  * Deploy workloads that use specific ResourceClaims or ResourceClaimTemplates.
-->
* **工作负载运维人员**：负责在集群中部署和管理工作负载。
  若要使用 DRA 为 Pod 分配设备，工作负载运维人员需要执行以下操作：

  * 创建 ResourceClaim 或 ResourceClaimTemplate，以便于基于指定的 DeviceClass
    请求特定的设备配置；
  * 部署引用这些 ResourceClaim 或 ResourceClaimTemplate 的工作负载。

<!--
## DRA terminology {#terminology}

DRA uses the following Kubernetes API kinds to provide the core allocation
functionality. All of these API kinds are included in the
`resource.k8s.io/v1`
{{< glossary_tooltip text="API group" term_id="api-group" >}}.
-->
## DRA 术语 {#terminology}

DRA 使用以下几种 Kubernetes API 类别来提供核心的资源分配功能。所有这些 API 类别均属于
`resource.k8s.io/v1` {{< glossary_tooltip text="API 组" term_id="api-group" >}}。

<!--
DeviceClass
: Defines a category of devices that can be claimed and how to select specific
  device attributes in claims. The DeviceClass parameters can match zero or
  more devices in ResourceSlices. To claim devices from a DeviceClass,
  ResourceClaims select specific device attributes.
-->
DeviceClass
: 定义一类可被申领的设备，以及在声明中如何按设备属性来选择这些设备。
  DeviceClass 中的参数可与 ResourceSlice 中的零个或多个设备匹配。
  当申领某个 DeviceClass 的设备时，ResourceClaim 会按照特定的设备属性来过滤。

<!--
ResourceClaim
: Describes a request for access to attached resources, such as
  devices, in the cluster. ResourceClaims provide Pods with access to
  a specific resource. ResourceClaims can be created by workload operators
  or generated by Kubernetes based on a ResourceClaimTemplate.
-->
ResourceClaim
: 描述了对集群中已挂接资源（如设备）的分配请求。
  ResourceClaim 使 Pod 能够访问某个特定的资源。
  ResourceClaim 既可以由工作负载运维人员创建，
  也可以由 Kubernetes 根据 ResourceClaimTemplate 自动生成。

<!--
ResourceClaimTemplate
: Defines a template that Kubernetes uses to create per-Pod
  ResourceClaims for a workload. ResourceClaimTemplates provide Pods with
  access to separate, similar resources. Each ResourceClaim that Kubernetes
  generates from the template is bound to a specific Pod. When the Pod
  terminates, Kubernetes deletes the corresponding ResourceClaim.
-->
ResourceClaimTemplate
: 定义一个模板，Kubernetes 会根据它为工作负载中的每个 Pod 创建独立的 ResourceClaim。
  ResourceClaimTemplate 使 Pod 能够访问相互独立但相似的资源。 
  Kubernetes 根据模板生成的每个 ResourceClaim 都会与某个特定的 Pod 绑定。
  当该 Pod 终止时，Kubernetes 将会自动删除对应的 ResourceClaim。

<!--
ResourceSlice
: Represents one or more resources that are attached to nodes, such as devices.
  Drivers create and manage ResourceSlices in the cluster. When a ResourceClaim
  is created and used in a Pod, Kubernetes uses ResourceSlices to find nodes
  that have access to the claimed resources. Kubernetes allocates resources to
  the ResourceClaim and schedules the Pod onto a node that can access the
  resources.
-->
ResourceSlice
: 代表了挂接在节点上的一个或更多的资源，例如设备。驱动程序创建并管理集群中的 ResourceSlice。
  当一个 ResourceClaim 被创建并被 Pod 使用的时候，Kubernetes 会使用 ResourceSlice
  来找到够访问到被申领资源的节点。Kubernetes 将资源分配给 ResourceClaim 并将 Pod 
  调度到该节点从而使得 Pod 能够访问到特定资源。

<!--
### DeviceClass {#deviceclass}

A DeviceClass lets cluster admins or device drivers define categories of devices
in the cluster. DeviceClasses tell operators what devices they can request and
how they can request those devices. You can use
[common expression language (CEL)](https://cel.dev) to select devices based on
specific attributes. A ResourceClaim that references the DeviceClass can then
request specific configurations within the DeviceClass.

To create a DeviceClass, see
[Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).
-->
### DeviceClass {#deviceclass}

DeviceClass 允许集群管理员或设备驱动程序定义集群中的设备类别。
这些 DeviceClass 告诉运维人员他们可以使用什么设备以及他们能够如何请求这些设备。
你可以使用 [通用表达式语言（CEL）](https://cel.dev) 来按照特定属性选择设备。
随后，引用该 DeviceClass 的 ResourceClaim 就可以请求该类别的设备配置。

要创建 DeviceClass，请参阅[在集群中安装 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).

<!--
### ResourceClaims and ResourceClaimTemplates {#resourceclaims-templates}

A ResourceClaim defines the resources that a workload needs. Every ResourceClaim
has _requests_ that reference a DeviceClass and select devices from that
DeviceClass. ResourceClaims can also use _selectors_ to filter for devices that
meet specific requirements, and can use _constraints_ to limit the devices that
can satisfy a request. ResourceClaims can be created by workload operators or
can be generated by Kubernetes based on a ResourceClaimTemplate. A
ResourceClaimTemplate defines a template that Kubernetes can use to
auto-generate ResourceClaims for Pods.
-->

### ResourceClaim 和 ResourceClaimTemplate {#resourceclaims-templates}

ResourceClaim 定义某个工作负载所需的资源。每个 ResourceClaim 都包含一个或多个引用了某个
DeviceClass 并从其中选择具体的设备的 _request_。

ResourceClaim 也可以使用 _selectors_ 来筛选满足特定条件的设备，并通过 _constraints_
来限制可以满足请求的设备。ResourceClaim 可以被工作负载运维人员创建，也可以由 Kubernetes
根据 ResourceClaimTemplate 生成。ResourceClaimTemplate 定义了一个模版来让
Kubernetes 能根据它为 Pod 自动生成 ResourceClaim。

<!--
#### Use cases for ResourceClaims and ResourceClaimTemplates {#when-to-use-rc-rct}

The method that you use depends on your requirements, as follows:

* **ResourceClaim**: you want multiple Pods to share access to specific
  devices. You manually manage the lifecycle of ResourceClaims that you create.
* **ResourceClaimTemplate**: you want Pods to have independent access to
  separate, similarly-configured devices. Kubernetes generates ResourceClaims
  from the specification in the ResourceClaimTemplate. The lifetime of each
  generated ResourceClaim is bound to the lifetime of the corresponding Pod.
-->

#### ResourceClaim 和 ResourceClaimTemplate 的使用场景 {#when-to-use-rc-rct}

使用方式取决于你的需求，例如：

* **ResourceClaim**： 你希望多个 Pod 对某个特定设备进行共享访问。你可以创建 ResourceClaim
  并对其生命周期进行手动管理。
* **ResourceClaimTemplate**：你希望 Pod 能够有对独立但有相似配置的设备进行独立访问。
  Kubernetes 可以基于 ResourceClaimTemplate 中的定义生成 ResourceClaim，而每个生成的
  ResourceClaim 的生命周期都与其所对应的 Pod 的生命周期是相绑定的。

<!--
When you define a workload, you can use
{{< glossary_tooltip term_id="cel" text="Common Expression Language (CEL)" >}}
to filter for specific device attributes or capacity. The available parameters
for filtering depend on the device and the drivers.
-->
当你在定义一个工作负载时，你可以使用
{{< glossary_tooltip term_id="cel" text="通用表达式语言（CEL）" >}}
来针对特定设备的属性和容量进行过滤。这些可用于过滤的参数则取决于具体的设备与其驱动程序。

<!--
If you directly reference a specific ResourceClaim in a Pod, that ResourceClaim
must already exist in the same namespace as the Pod. If the ResourceClaim
doesn't exist in the namespace, the Pod won't schedule. This behavior is similar
to how a PersistentVolumeClaim must exist in the same namespace as a Pod that
references it.
-->
如果你直接将一个特定的 ResourceClaim 关联到一个 Pod，则这个 ResourceClaim
必须已存在于与该 Pod 相同的命名空间中。如果这个 ResourceClaim 在该命名空间不存在，
该 Pod 将不会被调度。 这个行为类似于 PersistentVolumeClaim：
被 Pod 引用的 PersistentVolumeClaim 必须存在于与该 Pod 相同的命名空间中。

<!--
You can reference an auto-generated ResourceClaim in a Pod, but this isn't
recommended because auto-generated ResourceClaims are bound to the lifetime of
the Pod that triggered the generation.

To learn how to claim resources using one of these methods, see
[Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).
-->
你能够在 Pod 中引用一个自动生成的 ResourceClaim，但并不推荐这样做。因为自动生成的
ResourceClaim 是和触发它生成的 Pod 的生命周期相绑定的。

要了解如何使用这种方式申领资源，
请参阅[使用 DRA 为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)。

<!--
#### Prioritized list {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

You can provide a prioritized list of subrequests for requests in a ResourceClaim or
ResourceClaimTemplate. The scheduler will then select the first subrequest that can be allocated.
This allows users to specify alternative devices that can be used by the workload if the primary
choice is not available.

In the example below, the ResourceClaimTemplate requested a device with the color black
and the size large. If a device with those attributes is not available, the pod cannot
be scheduled. With the prioritized list feature, a second alternative can be specified, which
requests two devices with the color white and size small. The large black device will be
allocated if it is available. If it is not, but two small white devices are available,
the pod will still be able to run.
-->
#### 按优先级排序的列表 {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

你可以在 ResourceClaim 中为请求提供按优先级排序的子请求列表。调度器将选择第一个能够分配的子请求。
这使得用户能够在首选设备不可用时指定工作负载可以使用的替代设备。

在下面的示例中，ResourceClaimTemplate 请求了一个颜色为黑色且尺寸为大的设备。
如果具有这些属性的设备不可用，那么 Pod 将无法被调度。而使用按优先级排序的列表特性，
就可以指定第二个替代方案，即请求两个颜色为白色且尺寸为小的设备。
如果大型黑色设备可用就分配它，但如果它不可用但有两个小型白色设备可用，
Pod 仍然能够运行。

```yaml
apiVersion: resource.k8s.io/v1
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
The decision is made on a per-Pod basis, so if the Pod is a member of a ReplicaSet or
similar grouping, you cannot rely on all the members of the group having the same subrequest
chosen. Your workload must be able to accommodate this.

Prioritized lists is a *beta feature* and is enabled by default with the
`DRAPrioritizedList` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in
the kube-apiserver and kube-scheduler.
-->
该决策是针对每个 Pod 独立做出的。 因此如果该 Pod 是 ReplicaSet 或其他类似组中的一员的时候，
你不能假定该组中的所有成员都会选择相同的子请求。你的工作负载必须能够适应这种情况。

按优先级排序的列表是一个 *Beta 特性*，
在 kube-apiserver 和 kube-scheduler 中通过 `DRAPrioritizedList`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 默认启用。

### ResourceSlice {#resourceslice}

<!--
Each ResourceSlice represents one or more
{{< glossary_tooltip term_id="device" text="devices" >}} in a pool. The pool is
managed by a device driver, which creates and manages ResourceSlices. The
resources in a pool might be represented by a single ResourceSlice or span
multiple ResourceSlices.
-->
每个 ResourceSlice 代表资源池中的一个或多个{{< glossary_tooltip term_id="device" text="设备" >}}。
该资源池由设备驱动程序管理，它负责创建并维护这些 ResourceSlice。
资源池中的资源可以由单个 ResourceSlice 表示，也可以分布在多个 ResourceSlice 中。

<!--
ResourceSlices provide useful information to device users and to the scheduler,
and are crucial for dynamic resource allocation. Every ResourceSlice must include
the following information:
-->
ResourceSlice 为设备使用者和调度器提供了有用的信息，是实现动态资源分配的关键组成部分。
每个 ResourceSlice 都必须包含以下信息：

<!--
* **Resource pool**: a group of one or more resources that the driver manages.
  The pool can span more than one ResourceSlice. Changes to the resources in a
  pool must be propagated across all of the ResourceSlices in that pool. The
  device driver that manages the pool is responsible for ensuring that this
  propagation happens.
-->
* **资源池**: 一组由驱动程序管理的一个或多个资源。
  一个资源池可以跨越多个 ResourceSlice。当资源池中的资源发生变化时，
  必须将这些变更同步到该资源池内的所有 ResourceSlice。
  负责管理该资源池的设备驱动程序应确保这一同步过程的正确执行。

<!--
* **Devices**: devices in the managed pool. A ResourceSlice can list every
  device in a pool or a subset of the devices in a pool. The ResourceSlice
  defines device information like attributes, versions, and capacity. Device
  users can select devices for allocation by filtering for device information
  in ResourceClaims or in DeviceClasses.
-->
* **设备**： 那些在被管理的资源池内的设备。一个 ResourceSlice 可以列出资源池中的所有设备，
  也可以仅列出其中的一部分。ResourceSlice 定义了设备的一系列信息，例如属性、版本以及容量等。
  设备使用者可以在 ResourceClaim 或 DeviceClass 中通过筛选这些设备信息来选择要分配的设备。

<!--
* **Nodes**: the nodes that can access the resources. Drivers can choose which
  nodes can access the resources, whether that's all of the nodes in the
  cluster, a single named node, or nodes that have specific node labels.
-->
* **节点**：能够访问这些资源的节点。驱动程序可以自行决定哪些节点可访问这些资源，
  可以是集群中的所有节点、某个特定名称的节点，或者是那些具有特定节点标签的节点。

<!--
Drivers use a {{< glossary_tooltip text="controller" term_id="controller" >}} to
reconcile ResourceSlices in the cluster with the information that the driver has
to publish. This controller overwrites any manual changes, such as cluster users
creating or modifying ResourceSlices.

Consider the following example ResourceSlice:
-->
驱动程序使用 {{< glossary_tooltip text="控制器" term_id="controller" >}}，
将集群中的 ResourceSlice 与驱动程序需要发布的信息进行协调。
该控制器会覆盖任何手动的更改，例如集群用户对 ResourceSlice 的创建或更改。

以下是一个 ResourceSlice 的示例：

<!--
```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: cat-slice
spec:
  driver: "resource-driver.example.com"
  pool:
    generation: 1
    name: "black-cat-pool"
    resourceSliceCount: 1
  # The allNodes field defines whether any node in the cluster can access the device.
  allNodes: true
  devices:
  - name: "large-black-cat"
    attributes:
      color:
        string: "black"
      size:
        string: "large"
      cat:
        bool: true
```
-->
```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: cat-slice
spec:
  driver: "resource-driver.example.com"
  pool:
    generation: 1
    name: "black-cat-pool"
    resourceSliceCount: 1
  # allNodes 字段定义了是否集群中的任意节点都能够访问该设备。
  allNodes: true
  devices:
  - name: "large-black-cat"
    attributes:
      color:
        string: "black"
      size:
        string: "large"
      cat:
        bool: true
```

<!--
This ResourceSlice is managed by the `resource-driver.example.com` driver in the
`black-cat-pool` pool. The `allNodes: true` field indicates that any node in the
cluster can access the devices. There's one device in the ResourceSlice, named
`large-black-cat`, with the following attributes:
-->
这个 ResourceSlice 由 `resource-driver.example.com` 驱动程序在 `black-cat-pool`
资源池中进行管理。其中字段 `allNodes: true` 表示集群中的任意节点都可以访问这些设备。
该 ResourceSlice 中包含一个名为 large-black-cat 的设备，其具有以下属性：

* `color`: `black`
* `size`: `large`
* `cat`: `true`

<!--
A DeviceClass could select this ResourceSlice by using these attributes, and a
ResourceClaim could filter for specific devices in that DeviceClass.
-->
DeviceClass 可以通过这些属性来选择这个 ResourceSlice，
而 ResourceClaim 则可以在该 DeviceClass 中进一步筛选特定的设备。

<!--
## How resource allocation with DRA works {#how-it-works}

The following sections describe the workflow for the various
[types of DRA users](#dra-user-types) and for the Kubernetes system during
dynamic resource allocation.
-->
## DRA 资源分配的工作原理 {#how-it-works}

接下来的一节将介绍在动态资源分配过程中，多种
[DRA 用户的类型](#dra-user-types)以及 Kubernetes 系统各自的工作流程。

<!--
### Workflow for users {#user-workflow}
-->
### 用户工作流程{#user-workflow}

<!--
1. **Driver creation**: device owners or third-party entities create drivers
   that can create and manage ResourceSlices in the cluster. These drivers
   optionally also create DeviceClasses that define a category of devices and
   how to request them.
1. **Cluster configuration**: cluster admins create clusters, attach devices to
   nodes, and install the DRA device drivers. Cluster admins optionally create
   DeviceClasses that define categories of devices and how to request them.
1. **Resource claims**: workload operators create ResourceClaimTemplates or
   ResourceClaims that request specific device configurations within a
   DeviceClass. In the same step, workload operators modify their Kubernetes
   manifests to request those ResourceClaimTemplates or ResourceClaims.
-->
1. **创建驱动程序**： 设备的所有者或第三方实体会创建那些能够在集群内创建并管理
   ResourceSlice 的驱动程序。这些驱动程序还可以创建那些用于定义设备类别和请求方式的
   DeviceClass。
1. **配置集群**： 集群管理员创建集群，将设备挂接到节点上，并安装支持 DRA 的设备驱动程序。
   集群管理员可以创建那些用于定义设备类别和请求方式的 DeviceClass。
1. **资源申领**： 工作负载运维人员创建 ResourceClaimTemplate 或 ResourceClaim，
   以请求指定 DeviceClass 所提供的特定设备配置。同时，应用运维人员通过修改其 Kubernetes
   清单以在工作负载中引用这些 ResourceClaimTemplate 或 ResourceClaim。

<!--
### Workflow for Kubernetes {#kubernetes-workflow}
-->
### Kubernetes 工作流程 {#kubernetes-workflow}

<!--
1. **ResourceSlice creation**: drivers in the cluster create ResourceSlices that
   represent one or more devices in a managed pool of similar devices.
-->
1. **创建ResourceSlice**：集群中的驱动程序负责创建 ResourceSlice，
   用于表示在受管控的相似设备资源池中一个或多个设备。

<!--
1. **Workload creation**: the cluster control plane checks new workloads for
   references to ResourceClaimTemplates or to specific ResourceClaims.

   * If the workload uses a ResourceClaimTemplate, a controller named the
     `resourceclaim-controller` generates ResourceClaims for every Pod in the
     workload.
   * If the workload uses a specific ResourceClaim, Kubernetes checks whether
     that ResourceClaim exists in the cluster. If the ResourceClaim doesn't
     exist, the Pods won't deploy.
-->
2. **创建工作负载**：集群控制面检查那些引用了 ResourceClaimTemplate 或特定
   ResourceClaim 的工作负载。

   * 如果这个工作负载使用了一个 ResourceClaimTemplate，那么一个被叫做
     `resourceclaim-controller` 的控制器会为这个工作负载中的每个
     Pod 生成 ResourceClaim。
   * 如果这个工作负载使用了一个特定的 ResourceClaim， 那么 Kubernetes 将会检查这个
     ResourceClaim 在集群中是否存在。如果 ResourceClaim 不存在，则 Pod 将不会被部署。

<!--
1. **ResourceSlice filtering**: for every Pod, Kubernetes checks the
   ResourceSlices in the cluster to find a device that satisfies all of the
   following criteria:

   * The nodes that can access the resources are eligible to run the Pod.
   * The ResourceSlice has unallocated resources that match the requirements of
     the Pod's ResourceClaim.
-->
3. **过滤 ResourceSlice**：对于任意一个 Pod，Kubernetes 会检查集群中的 ResourceSlice
   以找到一个满足所有以下条件的设备：

   * 能够访问该资源的节点必须符合运行该 Pod 的条件；
   * 该 ResourceSlice 中存在尚未分配的资源，并且这些资源符合该 Pod 所引用的 ResourceClaim 的要求。

<!--
1. **Resource allocation**: after finding an eligible ResourceSlice for a
   Pod's ResourceClaim, the Kubernetes scheduler updates the ResourceClaim
   with the allocation details.
-->
4. **分配资源**：在为 Pod 的 ResourceClaim 找到符合条件的 ResourceSlice 之后，
   Kubernetes 调度器会将分配的详细信息更新在 ResourceClaim 上。

<!--
1. **Pod scheduling**: when resource allocation is complete, the scheduler
   places the Pod on a node that can access the allocated resource. The device
   driver and the kubelet on that node configure the device and the Pod's access
   to the device.
-->
5. **调度Pod**：当资源完成分配后，调度器将 Pod 放在可以访问该资源的节点上。
   节点上的设备驱动程序以及 kubelet 将对设备进行配置，从而使得 Pod 能够访问到该设备。

<!--
## Observability of dynamic resources {#observability-dynamic-resources}

You can check the status of dynamically allocated resources by using any of the
following methods:

* [kubelet device metrics](#monitoring-resources)
* [ResourceClaim status](#resourceclaim-device-status)
* [Device health monitoring](#device-health-monitoring)
-->
## 动态资源的可观测性 {#observability-dynamic-resources}

你可以使用以下任意方式来检查动态分配资源的状态：

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

kubelet 的 `PodResourcesLister` gRPC 服务可以对在使用的设备进行监控。
`DynamicResource` 提供了与动态资源分配相关的特定信息，例如设备名称和声明名称。
更多细节请参阅[监控设备插件资源](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

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
network interface device.
-->
DRA 驱动程序可以在 ResourceClaim 的 `status.devices`
字段中为已分配的设备上报特定于驱动的[设备状态](/zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status)数据。
例如，驱动程序可以在其中列出分配给某个网络接口设备的 IP 地址。

<!--
The accuracy of the information that a driver adds to a ResourceClaim
`status.devices` field depends on the driver. Evaluate drivers to decide whether
you can rely on this field as the only source of device information.
-->
上报到 ResourceClaim 的 `status.devices` 字段上的信息的准确性取决于驱动程序。
请对所用驱动进行评估，从而判断能否将此字段作为设备信息的唯一来源。

<!--
If you disable the `DRAResourceClaimDeviceStatus`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), the
`status.devices` field automatically gets cleared when storing the ResourceClaim.
A ResourceClaim device status is supported when it is possible, from a DRA
driver, to update an existing ResourceClaim where the `status.devices` field is
set.
-->
如果你禁用了`DRAResourceClaimDeviceStatus`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
那么 `status.devices` 字段会在 ResourceClaim 被保存时被自动清理。
ResourceClaim 的设备状态的支持，需要 DRA 驱动程序能够对设置了 `status.devices`
字段的存量 ResourceClaim 对象进行更新。

<!--
For details about the `status.devices` field, see the
{{< api-reference page="workload-resources/resource-claim-v1beta1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} API reference.
-->
更多`status.devices`字段的详细信息，请参阅
{{< api-reference page="workload-resources/resource-claim-v1beta1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} 的 API 参考。

<!--
### Device Health Monitoring {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

As an alpha feature, Kubernetes provides a mechanism for monitoring and reporting the health of dynamically allocated infrastructure resources.
For stateful applications running on specialized hardware, it is critical to know when a device has failed or become unhealthy. It is also helpful to find out if the device recovers.

To enable this functionality, the `ResourceHealthStatus` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/resource-health-status/) must be enabled, and the DRA driver must implement the `DRAResourceHealth` gRPC service.

When a DRA driver detects that an allocated device has become unhealthy, it reports this status back to the kubelet. This health information is then exposed directly in the Pod's status. The kubelet populates the `allocatedResourcesStatus` field in the status of each container, detailing the health of each device assigned to that container.

This provides crucial visibility for users and controllers to react to hardware failures. For a Pod that is failing, you can inspect this status to determine if the failure was related to an unhealthy device.
-->
### 设备健康监控 {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

作为一种 Alpha 特性，Kubernetes 提供了一种机制用于监控和上报动态分配的基础设施资源的健康状况。
对于跑在专用硬件上的有状态的应用而言，了解设备何时发生故障或变得不健康是至关重要的。  
同时，获知设备是否恢复也同样有助于维护应用的稳定性。

要开启这个功能，`ResourceHealthStatus`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
必须启用的同时，设备驱动程序必须实现了 `DRAResourceHealth` gRPC 服务。

当一个 DRA 驱动程序发现某个已分配的设备变为不健康，他要将这个状态汇报回 kubelet。
这些健康状态的信息会直接暴露在 Pod 的状态中。 kubelet 会在每个容器的状态中填充
`allocatedResourcesStatus` 字段，以详细描述分配给该容器的每个设备的健康状况。

这为用户和控制器提供了关键的可观测性，使其能够及时响应硬件故障。
对于处于失败状态的 Pod，可以通过检查该状态信息来判断故障是否与某个不健康的设备有关。

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
## DRA beta features {#beta-features}

The following sections describe DRA features that are available in the Beta
[feature stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
For more information, see
[Set up DRA in the cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/).
-->
## DRA Beta 特性  {#beta-features}

以下各小节阐述了可以在 Beta
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
中获取到的 DRA 特性。

欲了解更多信息，
请参阅[在集群中安装 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)。

<!--
### Admin access {#admin-access}
-->
### 管理性质的访问 {#admin-access}

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
apiVersion: resource.k8s.io/v1
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
feature. Starting with Kubernetes v1.34, this label has been updated to `resource.kubernetes.io/admin-access: "true"`.
-->
如果此特性被禁用，创建此类 ResourceClaim 时将自动移除 `adminAccess` 字段。

管理性质访问是一种特权模式，在多租户集群中不应该对普通用户开放。
从 Kubernetes v1.33 开始，在标有 `resource.k8s.io/admin-access: "true"`（区分大小写）
的命名空间中只有被授权创建 ResourceClaim 或 ResourceClaimTemplate
对象的用户才能使用 `adminAccess` 字段。这确保了非管理员用户不能滥用此特性。
从 Kubernetes v1.34 开始，此标签已被更新为 `resource.kubernetes.io/admin-access: "true"`。

<!--
## DRA alpha features {#alpha-features}

The following sections describe DRA features that are available in the Alpha
[feature stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
To use any of these features, you must also set up DRA in your clusters by
enabling the DynamicResourceAllocation feature gate and the DRA
{{< glossary_tooltip text="API groups" term_id="api-group" >}}. For more
information, see
[Set up DRA in the cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/).
-->
## DRA Alpha 特性  {#alpha-features}

以下各小节描述可供使用的 Alpha 阶段 DRA 特性。
要使用这些特性，你还必须开启 DynamicResourceAllocation 特性门控和 DRA
{{< glossary_tooltip text="API 组" term_id="api-group" >}} 以在集群中安装 DRA。

更多信息请参阅[在集群中安装 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)。

<!--
### Extended resource allocation by DRA {#extended-resource}
-->
### 使用 DRA 分配扩展资源 {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

<!--
You can provide an extended resource name for a DeviceClass. The scheduler will then
select the devices matching the class for the extended resource requests. This allows
users to continue using extended resource requests in a pod to request either
extended resources provided by device plugin, or DRA devices. The same extended
resource can be provided either by device plugin, or DRA on one single cluster node.
The same extended resource can be provided by device plugin on some nodes, and
DRA on other nodes in the same cluster.

In the example below, the DeviceClass is given an extendedResourceName `example.com/gpu`.
If a pod requested for the extended resource `example.com/gpu: 2`, it can be scheduled to
a node with two or more devices matching the DeviceClass.
-->
你可以为 DeviceClass 提供一个扩展资源名称。对于此扩展资源的请求，
此后调度器会从该类的设备中选择匹配的设备。这允许用户在 Pod
中继续使用扩展资源请求通过设备插件来申请扩展资源，或是 DRA 设备。
在集群的单个节点上，同一个扩展资源要么通过设备插件，要么通过 DRA 提供。
在同一个集群内，同一个扩展资源在某些节点上可以由设备插件提供，而在其他节点上由 DRA 提供。

在下面的例子中，该 DeviceClass 的 extendedResourceName 被赋值为 `example.com/gpu`。
那么如果一个 Pod 请求了 `example.com/gpu: 2` 的扩展资源，
它就会被调度到具有两个或更多个具有符合该 DeviceClass 设备的节点上。

```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceClass
metadata:
  name: gpu.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == 'gpu.example.com' && device.attributes['gpu.example.com'].type
        == 'gpu'
  extendedResourceName: example.com/gpu
```

<!--
In addition, users can use a special extended resource to allocate devices without
having to explicitly create a ResourceClaim. Using the extended resource name
prefix `deviceclass.resource.kubernetes.io/` and the DeviceClass name. This works
for any DeviceClass, even if it does not specify the an extended resource name.
The resulting ResourceClaim will contain a request for an `ExactCount` of the
specified number of devices of that DeviceClass.

Extended resource allocation by DRA is an *alpha feature* and only enabled when the
`DRAExtendedResource` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver, kube-scheduler, and kubelet.
-->
另外，用户可以使用一种特殊的扩展资源来分配设备，而不一定需要显式创建 ResourceClaim。
你可以使用扩展资源名称前缀 `deviceclass.resource.kubernetes.io/` 并加上 DeviceClass 的名称。
这种方式适用于任意 DeviceClass，即使该类未显式指定扩展资源名称。
生成的 ResourceClaim 将包含一个请求，要求按照 `ExactCount` 模式，
从该 DeviceClass 中分配指定数量的设备。

通过 DRA 来分配扩展资源是一个 *Alpha 特性*，它只有当 
kube-apiserver，kube-scheduler 和 kubelet 中启用了 `DRAExtendedResource`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
时，该特性才会被启用。

<!--
### Partitionable devices {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Devices represented in DRA don't necessarily have to be a single unit connected to a single machine,
but can also be a logical device comprised of multiple devices connected to multiple machines. These
devices might consume overlapping resources of the underlying phyical devices, meaning that when one
logical device is allocated other devices will no longer be available.
-->
### 可切分设备  {#partitionable-devices}

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
Partitionable devices is an *alpha feature* and only enabled when the
`DRAPartitionableDevices`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver and kube-scheduler.
-->
可切分设备是一个 *Alpha 特性*，它只有当
kube-apiserver 和 kube-scheduler 中启用了 `DRAPartitionableDevices`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
时，该特性才会被启用。


<!--
## Consumable capacity
-->
## 可消耗容量   {#consumable-capacity}

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

<!--
The consumable capacity feature allows the same devices to be consumed by multiple independent ResourceClaims, with the Kubernetes scheduler
managing how much of the device's capacity is used up by each claim. This is analogous to how Pods can share
the resources on a Node; ResourceClaims can share the resources on a Device.

The device driver can set `allowMultipleAllocations` field added in `.spec.devices` of `ResourceSlice` to allow allocating that device to multiple independent ResourceClaims or to multiple requests within a ResourceClaim.

Users can set `capacity` field added in `spec.devices.requests` of `ResourceClaim` to specify the device resource requirements for each allocation.
-->
可消耗容量特性允许同一台设备被多个独立的 ResourceClaim 同时使用，
由 Kubernetes 调度器负责管理每个声明消耗了多少设备容量。
这一机制类似于多个 Pod 可以共享同一节点上的资源，
多个 ResourceClaim 也可以共享同一设备上的资源。

设备驱动程序可以在 ResourceSlice 的 `.spec.devices` 中设置
`allowMultipleAllocations` 字段，以允许将该设备分配给多个独立的 ResourceClaim，
或分配给同一 ResourceClaim 中的多个请求。

用户可以在 ResourceClaim 的 `spec.devices.requests` 中新增的 `capacity` 字段进行设置，
以指定每次分配所需的设备资源容量。

<!--
For the device that allows multiple allocations, the requested capacity is drawn from — or consumed from — its total capacity, a concept known as **consumable capacity**.
Then, the scheduler ensures that the aggregate consumed capacity across all claims does not exceed the device’s overall capacity. Furthermore, driver authors can use the `requestPolicy` constraints on individual device capacities to control how those capacities are consumed. For example, the driver author can specify that a given capacity is only consumed in increments of 1Gi.
-->
对于允许多次分配的设备，请求的容量将从设备的总容量中提取或消耗，
这一机制被称为**可消耗容量（Consumable Capacity）**。
随后，调度器会确保所有声明合计消耗的容量总和不会超过设备的整体容量。
此外，驱动程序的作者还可以通过在单个设备的容量上使用 `requestPolicy`
约束来控制这些容量的消耗方式。
例如，驱动作者可以规定某个资源的容量只能以 1Gi 为单位进行消耗。

<!--
Here is an example of a network device which allows multiple allocations and contains
a consumable bandwidth capacity.
-->
下面是一个支持多次分配、并具有可消耗带宽容量的网络设备的示例。

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
可消耗容量能被请求，如下例所示。

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
分配的结果将包含已消耗的容量和份额的标识符。

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
In this example, a multiply-allocatable device was chosen. However, any `resource.example.com` device with at least the requested 1G bandwidth could have met the requirement. If a non-multiply-allocatable device were chosen, the allocation would have resulted in the entire device. To force the use of a only multiply-allocatable devices, you can use the CEL criteria `device.allowMultipleAllocations == true`.
-->
在这个例子里，选中的是一个可多次分配的设备。
但是实际上，任何不小于所请求的 1G 带宽的 `resource.example.com` 类型的设备都可以满足该需求。
如果选中的是一个不可多次分配的设备，那么此次分配将导致整个设备被占用。
若要强制仅使用可多次分配的设备，你可以使用 CEL 表达式
`device.allowMultipleAllocations == true`。

<!--
### Device taints and tolerations {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

Device taints are similar to node taints: a taint has a string key, a string
value, and an effect. The effect is applied to the ResourceClaim which is
using a tainted device and to all Pods referencing that ResourceClaim.
The "NoSchedule" effect prevents scheduling those Pods.
Tainted devices are ignored when trying to allocate a ResourceClaim
because using them would prevent scheduling of Pods.
-->
### 设备污点和容忍度  {#device-taints-and-tolerations}

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
-->
通过容忍污点一段时间可以延迟驱逐。该延迟从污点添加到设备时开始，
并被记录在污点的字段中。

如上所述，污点也适用于在节点上分配"所有"设备的 ResourceClaim。
所有设备必须不带污点，或者必须容忍其所有污点。
分配具有管理员访问权限的设备（[上文](#admin-access)所述）也不例外。
使用该模式的管理员必须明确容忍所有污点才能访问带污点的设备。

<!--
Device taints and tolerations is an *alpha feature* and only enabled when the
`DRADeviceTaints` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver, kube-controller-manager and kube-scheduler.
To use DeviceTaintRules, the `resource.k8s.io/v1alpha3` API version must be
enabled.
-->
设备污点和容忍度是一个 *Alpha 特性*，它只有当
kube-apiserver、kube-controller-manager 和 kube-scheduler 中启用了 `DRADeviceTaints`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
时，该特性才会被启用。
要使用 DeviceTaintRules，必须启用 `resource.k8s.io/v1alpha3` API 版本。

<!--
You can add taints to devices in the following ways, by using the
DeviceTaintRule API kind.
-->
你可以通过以下方式使用 DeviceTaintRule API 类型向设备添加污点。

<!--
#### Taints set by the driver

A DRA driver can add taints to the device information that it publishes in ResourceSlices.
Consult the documentation of a DRA driver to learn whether the driver uses taints and what
their keys and values are.
-->
#### 由驱动程序设置的污点 {#taints-set-by-the-driver}

DRA 驱动程序可以为其在 ResourceSlice 中发布的设备信息添加污点。
请查阅 DRA 驱动程序的文档，了解驱动程序是否使用污点以及它们的键和值是什么。

<!--
#### Taints set by an admin

An admin or a control plane component can taint devices without having to tell
the DRA driver to include taints in its device information in ResourceSlices. They do that by
creating DeviceTaintRules. Each DeviceTaintRule adds one taint to devices which
match the device selector. Without such a selector, no devices are tainted. This
makes it harder to accidentally evict all pods using ResourceClaims when leaving out
the selector by mistake.
-->
#### 由管理员设置的污点 {#taints-set-by-an-admin}

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
### Device Binding Conditions {#device-binding-conditions}
-->
### 设备绑定状况 {#device-binding-conditions}

{{< feature-state feature_gate_name="DRADeviceBindingConditions" >}}

<!--
Device Binding Conditions allow the Kubernetes scheduler to delay Pod binding until
external resources, such as fabric-attached GPUs or reprogrammable FPGAs, are confirmed
to be ready.
-->
设备绑定状况允许 Kubernetes 调度器在确认外部资源 
（例如光纤挂接下的 GPU 或可重编程的 FPGA）确认就绪之前延迟对 Pod 的绑定操作。

<!--
This waiting behavior is implemented in the 
[PreBind phase](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)
of the scheduling framework.
During this phase, the scheduler checks whether all required device conditions are
satisfied before proceeding with binding.

This improves scheduling reliability by avoiding premature binding and enables coordination
with external device controllers.
-->
这种等待机制是在调度框架的 
[PreBind 阶段](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)
实现的。
在该阶段，调度器会在继续执行绑定之前检查所有所需的设备状况是否已满足。

这种机制通过避免过早绑定以及支持与外部设备控制器进行协调的方式，提高了调度的可靠性。

<!--
To use this feature, device drivers (typically managed by driver owners) must publish the
following fields in the `Device` section of a `ResourceSlice`. Cluster administrators
must enable the `DRADeviceBindingConditions` and `DRAResourceClaimDeviceStatus` feature
gates for the scheduler to honor these fields.

- `bindingConditions`: A list of condition types that must be set to True in the
  status.conditions field of the associated ResourceClaim before the Pod can be bound.
  These typically represent readiness signals such as "DeviceAttached" or "DeviceInitialized".
- `bindingFailureConditions`: A list of condition types that, if set to True in
  status.conditions field of the associated ResourceClaim, indicate a failure state.
  If any of these conditions are True, the scheduler will abort binding and reschedule the Pod.
- `bindsToNode`: if set to `true`, the scheduler records the selected node name in the
  `status.allocation.nodeSelector` field of the ResourceClaim.
  This does not affect the Pod's `spec.nodeSelector`. Instead, it sets a node selector
  inside the ResourceClaim, which external controllers can use to perform node-specific
  operations such as device attachment or preparation.
-->
要使用此特性，设备驱动程序（通常由驱动程序所有者管理）必须在 `ResourceSlice` 的 
`Device` 部分中发布以下字段。 此外为了让调度器能够考虑这些字段，集群管理员必须启用 
`DRADeviceBindingConditions` 和 `DRAResourceClaimDeviceStatus` 特性门控。

- `bindingConditions`：一个状况类型的列表，在 Pod 能被绑定之前，
  所关联的 ResourceClaim 的 status.conditions 字段中的这些状况类型必须被设置为 True。
  这些状况通常表示设备就绪信号，例如 "DeviceAttached" 或 "DeviceInitialized"。

- `bindingFailureConditions`：一个状况类型的列表，如果在其所关联的 
  ResourceClaim 的 status.conditions 字段中对应的状况类型被设置为 True，
  则代表了一种失败的状态。如果其中的任何一个状况被设置为 True，
  调度器将中止绑定，并重新调度该 Pod。

- `bindsToNode`：若设置为 `true`，调度器会将所选节点的名称记录到 ResourceClaim 的
  `status.allocation.nodeSelector` 字段中。
  这不会影响 Pod 的 `spec.nodeSelector`，而是在 ResourceClaim 内部设置一个节点选择器，
  从而外部控制器能够用它来执行一个节点相关的操作，例如设备挂载或准备。

<!--
All condition types listed in bindingConditions and bindingFailureConditions are evaluated
from the `status.conditions` field of the ResourceClaim.
External controllers are responsible for updating these conditions using standard Kubernetes
condition semantics (`type`, `status`, `reason`, `message`, `lastTransitionTime`).
-->
所有 bindingConditions 和 bindingFailureConditions 中列出的状况类型，都会根据
ResourceClaim 的 `status.conditions` 字段中进行评估。
外部控制器负责使用标准的 Kubernetes 状况语义
（如 `type`、`status`、`reason`、`message`、`lastTransitionTime`）
对这些状况进行更新。

<!--
The scheduler waits up to **600 seconds** for all `bindingConditions` to become `True`.
If the timeout is reached or any `bindingFailureConditions` are `True`, the scheduler
clears the allocation and reschedules the Pod.
-->
调度器会等待`bindingConditions` 变为 `True`，但最长不超过 **600秒**。
如果发生超时或者任意一个 `bindingFailureConditions` 变为 `True`,
那么调度器将清除当前的分配并重新调度该 Pod。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-slice
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

- The ResourceSlice targets nodes labeled with `accelerator-type=high-performance`, 
so that the scheduler uses only a specific set of eligible nodes.
- The scheduler selects one node from the selected group (for example, `node-3`) and sets 
the `status.allocation.nodeSelector` field in the ResourceClaim to that node name.
- The `dra.example.com/is-prepared` binding condition indicates that the device `gpu-1`
must be prepared (the `is-prepared` condition has a status of `True`) before binding. 
- If the `gpu-1` device preparation fails (the `preparing-failed` condition has a status of `True`), the scheduler aborts binding.
- The scheduler waits up to 600 seconds for the device to become ready.
- External controllers can use the node selector in the ResourceClaim to perform
node-specific setup on the selected node.
-->
此 ResourceSlice 示例具有以下属性：

- 该 ResourceSlice 针对的是带有标签 `accelerator-type=high-performance` 的节点，
  因此调度器仅会使用符合条件的节点的一个特定集合。
- 调度器会从选定的组中选择一个节点（例如 `node-3`），
  并将该节点名称写入 ResourceClaim 的 `status.allocation.nodeSelector` 字段。
- `dra.example.com/is-prepared`绑定状况表示设备 `gpu-1` 在执行绑定前必须准备就绪，
  即 `is-prepared` 状况必须有一个处于 `True`的状态。
- 如果设备 `gpu-1` 的准备过程中发生失败，即 `preparing-failed` 状况有一个处于`True`的状态，
  那么调度器将放弃进行绑定。
- 调度器会等待最多 600 秒，直到此设备变为就绪状态。
- 外部控制器可以使用 ResourceClaim 中的节点选择器，
  以在选定节点上执行特定于该节点的初始化或配置操作。


## {{% heading "whatsnext" %}}

<!-- 
- [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Allocate devices to workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP.
-->
- [在集群中安装 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)
- [使用 DRA 为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- 了解更多该设计的信息，
  参阅[使用结构化参数的动态资源分配 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)。