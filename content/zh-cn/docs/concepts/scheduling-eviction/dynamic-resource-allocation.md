---
title: 动态资源分配
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "ResourcePoolStatusRequest"
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
  kind: "DeviceTaintRule"
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
  kind: "ResourcePoolStatusRequest"
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
  kind: "DeviceTaintRule"
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
[dynamic volume provisioning](/docs/concepts/storage/dynamic-provisioning/),
in which you use PersistentVolumeClaims to claim storage capacity from storage classes
and request the claimed capacity in your Pods.
-->
使用 DRA 来分配资源的体验与[动态卷制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)类似，
你可以使用 PersistentVolumeClaim 基于存储类来申领存储容量，并在 Pod
中请求这些已申领的容量。

<!--
### Benefits of DRA {#dra-benefits}
-->
### DRA 的好处 {#dra-benefits}

<!--
DRA provides a flexible way to categorize, request, and use devices in your cluster.
Using DRA provides benefits like the following:
-->
DRA 为集群中的设备提供了一种灵活的方式来进行分类、请求和使用。使用 DRA 具有以下好处：

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
* **设备共享**：通过引用相应的资源申领，可以让多个容器或 Pod 共享同一个资源。
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

The workflow of using DRA to allocate devices involves the following types of users:
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
  * Optionally, create DeviceClasses that workload operators can use to claim devices.
-->
* **设备所有者**：为设备负责。设备的所有者可以是商业厂商、集群运营者或其他实体。
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
  cluster. To use DRA to allocate devices to Pods, workload operators do the following:

  * Create ResourceClaims or ResourceClaimTemplates to request specific
    configurations within DeviceClasses.
  * Deploy workloads that use specific ResourceClaims or ResourceClaimTemplates.
-->
* **工作负载运维人员**：负责在集群中部署和管理工作负载。
  若要使用 DRA 为 Pod 分配设备，工作负载运维人员需要执行以下操作：

  * 创建 ResourceClaim 或 ResourceClaimTemplate，以便基于指定的 DeviceClass
    请求特定的设备配置；
  * 部署引用这些 ResourceClaim 或 ResourceClaimTemplate 的工作负载。

<!--
## DRA terminology {#terminology}

DRA uses the following Kubernetes API kinds to provide the core allocation
functionality. All of these API kinds are included in the `resource.k8s.io/v1`
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
: 定义一类可被申领的设备，以及在申领中如何按设备属性来选择这些设备。
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
: 描述对集群中已挂接资源（如设备）的分配请求。
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
  当 Pod 终止时，Kubernetes 将会自动删除对应的 ResourceClaim。

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
  调度到节点从而使得 Pod 能够访问到特定资源。

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
你可以使用[通用表达式语言（CEL）](https://cel.dev)来按照特定属性选择设备。
随后，引用 DeviceClass 的 ResourceClaim 就可以请求该类别的设备配置。

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
DeviceClass 并从其中选择具体设备的 _request_。
ResourceClaim 也可以使用 _selectors_ 来筛选满足特定条件的设备，并通过 _constraints_
来限制可以满足请求的设备。ResourceClaim 可以被工作负载运维人员创建，也可以由 Kubernetes
根据 ResourceClaimTemplate 生成。ResourceClaimTemplate 定义了一个模板来让
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
* [**PodGroup ResourceClaimTemplate**](#workload-resourceclaims): you want
  {{< glossary_tooltip text="PodGroups" term_id="podgroup" >}} to have
  independent access to separate, similarly-configured devices that can be
  shared by their Pods. Kubernetes generates one ResourceClaim for the PodGroup
  from the specification in the ResourceClaimTemplate. The lifetime of each
  generated ResourceClaim is bound to the lifetime of the corresponding
  PodGroup. This requires the
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  feature to be enabled.
-->
#### ResourceClaim 和 ResourceClaimTemplate 的使用场景 {#when-to-use-rc-rct}

使用方式取决于你的需求，例如：

* **ResourceClaim**：你希望多个 Pod 对某个特定设备进行共享访问。你可以创建 ResourceClaim
  并对其生命周期进行手动管理。
* **ResourceClaimTemplate**：你希望 Pod 能够有对独立但有相似配置的设备进行独立访问。
  Kubernetes 可以基于 ResourceClaimTemplate 中的定义生成 ResourceClaim，而每个生成的
  ResourceClaim 的生命周期都与其所对应的 Pod 的生命周期是相绑定的。
* [**PodGroup ResourceClaimTemplate**](#workload-resourceclaims)：你希望
  {{< glossary_tooltip text="PodGroup" term_id="podgroup" >}}
  能够独立访问单独但配置相似、可由其 Pod 共享的设备。
  Kubernetes 会基于 ResourceClaimTemplate 中的规约为 PodGroup 生成一个 ResourceClaim。
  每个生成的 ResourceClaim 的生命周期都绑定到对应的 PodGroup。
  这需要启用
  [`DRAWorkloadResourceClaims`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  特性。

<!--
When you define a workload, you can use
{{< glossary_tooltip term_id="cel" text="Common Expression Language (CEL)" >}}
to filter for specific device attributes or capacity. The available parameters
for filtering depend on the device and the drivers.
-->
当你在定义一个工作负载时，你可以使用{{< glossary_tooltip term_id="cel" text="通用表达式语言（CEL）" >}}
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
该 Pod 将不会被调度。这个行为类似于 PersistentVolumeClaim：
被 Pod 引用的 PersistentVolumeClaim 必须存在于与该 Pod 相同的命名空间中。

<!--
You can reference an auto-generated ResourceClaim in a Pod, but this isn't
recommended because auto-generated ResourceClaims are bound to the lifetime of
the Pod or PodGroup that triggered the generation.

To learn how to claim resources using one of these methods, see
[Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).
-->
你能够在 Pod 中引用一个自动生成的 ResourceClaim，但并不推荐这样做。因为自动生成的
ResourceClaim 是和触发它生成的 Pod 或 PodGroup 的生命周期相绑定的。

要了解如何使用这种方式申领资源，
请参阅[使用 DRA 为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)。

<!--
#### Prioritized list {#prioritized-list}
-->
#### 按优先级排序的列表 {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

<!--
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
If the pod is eligible for multiple nodes in the cluster, the scheduler will use the
index of chosen subrequests from any prioritized lists as one of the inputs when it
scores each node. So nodes that can allocate devices requested in a higher ranked
subrequest are more likely to be chosen than nodes that can only allocate devices for
lower ranked subrequests.
-->
如果 Pod 符合集群中多个节点的部署条件，调度器会将已选子请求的优先级列表索引作为每个节点评分的输入之一。
因此，能够分配优先级更高的子请求中请求的设备的节点，比只能分配优先级更低子请求中请求的设备的节点更有可能被选中。

<!--
The decision is made on a per-Pod basis, so if the Pod is a member of a ReplicaSet or
similar grouping, you cannot rely on all the members of the group having the same subrequest
chosen. Your workload must be able to accommodate this.

#### Workload ResourceClaims

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

When you organize Pods with the
[Workload API](/docs/concepts/workloads/workload-api/),
you can reserve ResourceClaims for entire
{{< glossary_tooltip text="PodGroups" term_id="podgroup" >}}
instead of individual Pods and generate ResourceClaimTemplates for a
PodGroup instead of a single Pod, allowing the Pods within a PodGroup to share
access to devices allocated to the generated ResourceClaim.

This feature targets two problems:

- The ResourceClaim API's `status.reservedFor` list can only contain 256 items.
  Since kube-scheduler only records individual Pods in that list, only 256 Pods
  can share a ResourceClaim. By allowing PodGroups to be recorded in
  `status.reservedFor`, many more than 256 Pods can share a ResourceClaim.
- Pods can only share a ResourceClaim when its exact name is known. For complex
  workloads that replicate _groups_ of Pods, ResourceClaims shared by the Pods
  in each group need to be created and deleted explicitly when the set of
  groups scales up and down. By generating ResourceClaims for each PodGroup, a
  single ResourceClaimTemplate can form the basis for ResourceClaims that are
  both replicated automatically and shareable among the Pods in a PodGroup.

The PodGroup API defines a `spec.resourceClaims` field with the same structure
and similar meaning as the `spec.resourceClaims` field in the Pod API:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

Like claims made by Pods, claims for PodGroups defining a `resourceClaimName`
refer to a ResourceClaim by name. Claims defining a `resourceClaimTemplateName`
refer to a ResourceClaimTemplate which replicates into one ResourceClaim for the
entire PodGroup that can be shared amongst its Pods.

When a Pod defines a claim with a `name`, `resourceClaimName`, and
`resourceClaimTemplateName` that all match one of its PodGroup's
`spec.resourceClaims`, then kube-scheduler reserves the ResourceClaim for the
PodGroup instead of the Pod. If the Pod's claim does not match one made by its
PodGroup, then kube-scheduler reserves the ResourceClaim for the Pod. In either
case, reservation is recorded in the ResourceClaim's `status.reservedFor`.
PodGroup reservations and the corresponding resource allocation persist in the
ResourceClaim until the PodGroup is deleted, even if the group no longer has any
Pods.

When a Pod claim matching a PodGroup claim defines a
`resourceClaimTemplateName`, then one ResourceClaim is generated for the
PodGroup. Other Pods in the group defining the same claim will share that
generated ResourceClaim instead of prompting a new ResourceClaim to be generated
for each Pod. Whether or not a `resourceClaimTemplateName` claim matches a
PodGroup claim, the name of the generated ResourceClaim is recorded in the Pod's
`status.resourceClaimStatuses`.

ResourceClaims generated from a ResourceClaimTemplate for a
PodGroup follow the lifecycle of the PodGroup. The ResourceClaim is first
created when both the PodGroup and its ResourceClaimTemplate exist. The
ResourceClaim is deleted after the PodGroup has been deleted and the
ResourceClaim is no longer reserved.

Consider the following example:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
---
apiVersion: v1
kind: Pod
metadata:
  name: training-group-pod-1
  namespace: some-ns
spec:
  ...
  schedulingGroup:
    podGroupName: training-group
  resourceClaims:
  - name: pod-claim
    resourceClaimName: my-pod-claim
  - name: pod-claim-template
    resourceClaimTemplateName: my-pod-template
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

In this example, the `training-group` PodGroup has one Pod named `training-group-pod-1`.
The Pod's `pod-claim` and `pod-claim-template` claims do not match
any claim made by the PodGroup, so those claims are not affected by the
PodGroup: ResourceClaim `my-pod-claim` becomes reserved for the Pod and a
ResourceClaim is generated from ResourceClaimTemplate `my-pod-template` and also
becomes reserved for the Pod. The `pg-claim` and `pg-claim-template` do match
claims made by the PodGroup. ResourceClaim `my-pg-claim` becomes reserved for
the PodGroup and a ResourceClaim is generated from ResourceClaimTemplate
`my-pg-template` and also becomes reserved for the PodGroup.

Associating ResourceClaims with Workload API resources is an *alpha feature* and
only enabled when the [`DRAWorkloadResourceClaims` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
is enabled in the kube-apiserver, kube-controller-manager, kube-scheduler, and kubelet.
-->
该决策是针对每个 Pod 独立做出的。因此如果该 Pod 是 ReplicaSet 或其他类似组中的一员的时候，
你不能假定该组中的所有成员都会选择相同的子请求。你的工作负载必须能够适应这种情况。

#### 工作负载 ResourceClaim {#workload-resourceclaims}

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

当你使用 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 组织 Pod 时，
可以为整个 {{< glossary_tooltip text="PodGroup" term_id="podgroup" >}}
而不是单个 Pod 预留 ResourceClaim，也可以为 PodGroup 而不是单个 Pod 生成
ResourceClaimTemplate，让 PodGroup 中的 Pod 共享对已分配给所生成 ResourceClaim
的设备的访问。

此特性面向两个问题：

- ResourceClaim API 的 `status.reservedFor` 列表只能包含 256 个条目。
  由于 kube-scheduler 在该列表中只记录单个 Pod，因此只有 256 个 Pod 可以共享一个
  ResourceClaim。允许在 `status.reservedFor` 中记录 PodGroup 后，远多于 256 个 Pod
  也可以共享一个 ResourceClaim。
- 只有在知道 ResourceClaim 的确切名称时，Pod 才能共享该 ResourceClaim。
  对于复制 Pod **组**的复杂工作负载，每个组中由 Pod 共享的 ResourceClaim
  需要在组集合扩缩时被显式创建和删除。通过为每个 PodGroup 生成 ResourceClaim，
  单个 ResourceClaimTemplate 可以作为 ResourceClaim 的基础，
  这些 ResourceClaim 既可以自动复制，也可以被 PodGroup 中的 Pod 共享。

PodGroup API 定义了 `spec.resourceClaims` 字段，其结构和含义与 Pod API 中的
`spec.resourceClaims` 字段相同或相似：

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

与 Pod 发起的申领类似，为 PodGroup 定义 `resourceClaimName` 的申领通过名称引用
ResourceClaim。定义 `resourceClaimTemplateName` 的申领引用一个 ResourceClaimTemplate，
该模板会为整个 PodGroup 复制出一个可被其 Pod 共享的 ResourceClaim。

当某个 Pod 定义的申领中 `name`、`resourceClaimName` 和 `resourceClaimTemplateName`
都与其 PodGroup 的某个 `spec.resourceClaims` 匹配时，kube-scheduler 会为 PodGroup
而不是该 Pod 预留 ResourceClaim。如果 Pod 的申领与其 PodGroup 发起的申领不匹配，
kube-scheduler 会为该 Pod 预留 ResourceClaim。无论哪种情况，预留信息都会记录在
ResourceClaim 的 `status.reservedFor` 中。PodGroup 预留及相应的资源分配会一直保留在
ResourceClaim 中，直到 PodGroup 被删除，即使该组中已不再有任何 Pod。

当与 PodGroup 申领匹配的 Pod 申领定义了 `resourceClaimTemplateName` 时，
系统会为 PodGroup 生成一个 ResourceClaim。组中定义了相同申领的其他 Pod
会共享这个生成的 ResourceClaim，而不会促使系统为每个 Pod 生成新的 ResourceClaim。
无论 `resourceClaimTemplateName` 申领是否与 PodGroup 申领匹配，
生成的 ResourceClaim 名称都会记录在 Pod 的 `status.resourceClaimStatuses` 中。

基于 ResourceClaimTemplate 为 PodGroup 生成的 ResourceClaim 遵循 PodGroup 的生命周期。
当 PodGroup 及其 ResourceClaimTemplate 都存在时，ResourceClaim 首先被创建。
当 PodGroup 已被删除且 ResourceClaim 不再被预留后，该 ResourceClaim 会被删除。

请考虑以下示例：

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
---
apiVersion: v1
kind: Pod
metadata:
  name: training-group-pod-1
  namespace: some-ns
spec:
  ...
  schedulingGroup:
    podGroupName: training-group
  resourceClaims:
  - name: pod-claim
    resourceClaimName: my-pod-claim
  - name: pod-claim-template
    resourceClaimTemplateName: my-pod-template
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

在此示例中，`training-group` PodGroup 有一个名为 `training-group-pod-1` 的 Pod。
该 Pod 的 `pod-claim` 和 `pod-claim-template` 申领与 PodGroup 发起的任何申领都不匹配，
因此这些申领不受 PodGroup 影响：ResourceClaim `my-pod-claim` 会被预留给该 Pod，
系统会基于 ResourceClaimTemplate `my-pod-template` 生成一个 ResourceClaim，
并同样将其预留给该 Pod。`pg-claim` 和 `pg-claim-template` 则与 PodGroup 发起的申领匹配。
ResourceClaim `my-pg-claim` 会被预留给 PodGroup，系统会基于 ResourceClaimTemplate
`my-pg-template` 生成一个 ResourceClaim，并同样将其预留给 PodGroup。

将 ResourceClaim 与 Workload API 资源相关联是一个 **Alpha 特性**，
只有在 kube-apiserver、kube-controller-manager、kube-scheduler 和 kubelet
中启用
[`DRAWorkloadResourceClaims` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
时才可用。

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
* **资源池**：一组由驱动程序管理的一个或多个资源。
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
* **设备**：那些在被管理的资源池内的设备。一个 ResourceSlice 可以列出资源池中的所有设备，
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

#### Naming and prioritization {#resourceslice-naming-and-prioritization}

The order in which the Kubernetes scheduler evaluates devices for allocation is
determined by the lexicographical sorting of ResourceSlice and resource pool names.
The scheduler uses a first-fit strategy, meaning it selects the first available device
that satisfies the claim's requirements.

This allows the priority of resource allocation to be influenced by the names
assigned to pools and ResourceSlices. Note that pools without
[binding conditions](#device-binding-conditions) are always evaluated before those
with binding conditions, regardless of their names.

For drivers built using the `k8s.io/dynamic-resources/kubeletplugin` Go package or
the ResourceSlice controller from that module, these components automatically handle
ResourceSlice naming to ensure they are evaluated in the order specified by the driver.
-->
DeviceClass 可以通过这些属性来选择这个 ResourceSlice，
而 ResourceClaim 则可以在该 DeviceClass 中进一步筛选特定的设备。

#### 命名和优先级 {#resourceslice-naming-and-prioritization}

Kubernetes 调度器评估设备以进行分配的顺序，
由 ResourceSlice 和资源池名称的字典序排序确定。
调度器使用首个适配策略，这意味着它会选择第一个满足申领要求的可用设备。

这使得分配给资源池和 ResourceSlice 的名称能够影响资源分配优先级。
注意，无论名称如何，没有[绑定状况](#device-binding-conditions)的资源池
总是会先于带有绑定状况的资源池被评估。

对于使用 `k8s.io/dynamic-resources/kubeletplugin` Go 包或该模块中的
ResourceSlice 控制器构建的驱动，这些组件会自动处理 ResourceSlice 命名，
以确保它们按驱动指定的顺序被评估。

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
### 用户工作流程  {#user-workflow}

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
1. **创建驱动程序**：设备的所有者或第三方实体会创建那些能够在集群内创建并管理
   ResourceSlice 的驱动程序。这些驱动程序还可以创建那些用于定义设备类别和请求方式的
   DeviceClass。
1. **配置集群**：集群管理员创建集群，将设备挂接到节点上，并安装支持 DRA 的设备驱动程序。
   集群管理员可以创建那些用于定义设备类别和请求方式的 DeviceClass。
1. **资源申领**：工作负载运维人员创建 ResourceClaimTemplate 或 ResourceClaim，
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
     `resourceclaim-controller` generates ResourceClaims for the workload.
   * If the workload uses a specific ResourceClaim, Kubernetes checks whether
     that ResourceClaim exists in the cluster. If the ResourceClaim doesn't
     exist, the Pods won't deploy.
-->
2. **创建工作负载**：集群控制面检查那些引用了 ResourceClaimTemplate 或特定
   ResourceClaim 的工作负载。

   * 如果这个工作负载使用了一个 ResourceClaimTemplate，那么一个被叫做
     `resourceclaim-controller` 的控制器会为这个工作负载生成 ResourceClaim。
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
   with the allocation details. The scheduler uses a first-fit strategy and
   evaluates pools and ResourceSlices in lexicographical order by their names.
   Drivers can prioritize specific slices or pools by naming them appropriately.
   For details, see [Naming and prioritization](#resourceslice-naming-and-prioritization).
-->
4. **分配资源**：在为 Pod 的 ResourceClaim 找到符合条件的 ResourceSlice 之后，
   Kubernetes 调度器会将分配的详细信息更新在 ResourceClaim 上。
   调度器使用首个适配策略，并按名称的字典序评估资源池和 ResourceSlice。
   驱动可以通过适当命名特定切片或资源池来赋予其更高优先级。
   有关细节，参阅[命名和优先级](#resourceslice-naming-and-prioritization)。

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
`DynamicResource` 提供了与动态资源分配相关的特定信息，例如设备名称和申领名称。
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
network interface device. Updating this field requires specific synthetic RBAC permissions,
see
[Hardening Guide - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
and
[Harden Dynamic Resource Allocation in Your Cluster](/docs/tasks/administer-cluster/hardening-dra/).
-->
DRA 驱动程序可以在 ResourceClaim 的 `status.devices`
字段中为已分配的设备上报特定于驱动的[设备状态](/zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status)数据。
例如，驱动程序可以在其中列出分配给某个网络接口设备的 IP 地址。
更新此字段需要特定的合成 RBAC 权限，参阅
[加固指南 - 动态资源分配](/zh-cn/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
和[加固集群中的动态资源分配](/zh-cn/docs/tasks/administer-cluster/hardening-dra/)。

<!--
The accuracy of the information that a driver adds to a ResourceClaim
`status.devices` field depends on the driver. Evaluate drivers to decide whether
you can rely on this field as the only source of device information.
-->
上报到 ResourceClaim 的 `status.devices` 字段上的信息的准确性取决于驱动程序。
请对所用驱动进行评估，从而判断能否将此字段作为设备信息的唯一来源。

<!--
If you disable the
[`DRAResourceClaimDeviceStatus` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourceClaimDeviceStatus), the
`status.devices` field automatically gets cleared when storing the ResourceClaim.
A ResourceClaim device status is supported when it is possible, from a DRA
driver, to update an existing ResourceClaim where the `status.devices` field is
set.
-->
如果你禁用了
[`DRAResourceClaimDeviceStatus` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAResourceClaimDeviceStatus)，
那么 `status.devices` 字段会在 ResourceClaim 被保存时被自动清理。
若想支持 ResourceClaim 的设备状态，需要 DRA 驱动程序能够对设置了 `status.devices`
字段的存量 ResourceClaim 对象进行更新。

<!--
For details about the `status.devices` field, see the
{{</* api-reference page="workload-resources/resource-claim-v1" anchor="ResourceClaimStatus" text="ResourceClaim" */>}} API reference.
-->
更多`status.devices`字段的详细信息，请参阅
{{< api-reference page="workload-resources/resource-claim-v1" anchor="ResourceClaimStatus" text="ResourceClaim" >}}
的 API 参考。

<!--
### Device Health Monitoring {#device-health-monitoring}
-->
### 设备健康监控 {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

<!--
Kubernetes provides a mechanism for monitoring and reporting the health of dynamically allocated infrastructure resources.
For stateful applications running on specialized hardware, it is critical to know when a device has failed or become unhealthy. It is also helpful to find out if the device recovers.

To use this functionality, the `ResourceHealthStatus` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/resource-health-status/) must be enabled (beta and enabled by default since v1.36), and the DRA driver must implement the `DRAResourceHealth` gRPC service.
-->
Kubernetes 提供了一种机制用于监控和上报动态分配的基础设施资源的健康状况。
对于跑在专用硬件上的有状态的应用而言，了解设备何时发生故障或变得不健康是至关重要的。
同时，获知设备是否恢复也同样有助于维护应用的稳定性。

要使用此功能，必须启用 `ResourceHealthStatus`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/ResourceHealthStatus/)
（自 v1.36 起为 Beta 且默认启用），同时
设备驱动程序必须实现了 `DRAResourceHealth` gRPC 服务。

<!--
When a DRA driver detects that an allocated device has become unhealthy, it reports this status back to the kubelet. This health information is then exposed directly in the Pod's status. The kubelet populates the `allocatedResourcesStatus` field in the status of each container, detailing the health of each device assigned to that container. Each resource health entry can include an optional `message` field with additional human-readable context about the health status, such as error details or failure reasons.

If the kubelet does not receive a health update from a DRA driver within a timeout period, the device's health status is marked as "Unknown". DRA drivers can configure this timeout on a per-device basis by setting the `health_check_timeout_seconds` field in the `DeviceHealth` gRPC message. If not specified, the kubelet uses a default timeout of 30 seconds. This allows different hardware types (for example, GPUs, FPGAs, or storage devices) to use appropriate timeout values based on their health-reporting characteristics.

This provides crucial visibility for users and controllers to react to hardware failures.
For a Pod that is failing, you can inspect this status to determine if the failure was related to an unhealthy device.

{{< note >}}
Device health status is not updated in the Pod status after a Pod has terminated (for example, in Failed state).
{{< /note >}}
-->
当一个 DRA 驱动程序发现某个已分配的设备变为不健康，他要将这个状态汇报回 kubelet。
这些健康状态的信息会直接暴露在 Pod 的状态中。kubelet 会在每个容器的状态中填充
`allocatedResourcesStatus` 字段，以详细描述分配给该容器的每个设备的健康状况。
每个资源健康状况条目都可以包含可选的 `message` 字段，
提供有关健康状况的额外人类可读上下文，例如错误详情或失败原因。

如果 kubelet 在超时时间内没有收到来自 DRA 驱动的健康状况更新，
设备的健康状态会被标记为 "Unknown"。
DRA 驱动可以通过在 `DeviceHealth` gRPC 消息中设置
`health_check_timeout_seconds` 字段，按设备配置此超时时间。
如果未指定，kubelet 会使用默认的 30 秒超时时间。
这允许不同硬件类型（例如 GPU、FPGA 或存储设备）根据其健康状况报告特征使用合适的超时值。

这为用户和控制器提供了关键的可观测性，使其能够及时响应硬件故障。
对于处于失败状态的 Pod，可以通过检查该状态信息来判断故障是否与某个不健康的设备有关。

{{< note >}}
Pod 终止后（例如处于 Failed 状态时），设备健康状态不会再更新到 Pod 状态中。
{{< /note >}}

<!--
## Pre-scheduled Pods

When you - or another API client - create a Pod with `spec.nodeName` already set, the scheduler gets bypassed.
If some ResourceClaim needed by that Pod does not exist yet, is not allocated
or not reserved for the Pod, then the kubelet will fail to run the Pod and
re-check periodically because those requirements might still get fulfilled later.
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
## Limitations

* The Kubernetes scheduler doesn't support
  [preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/) for
  DRA resources. This means that an existing Pod that's running on a node and is
  using DRA resources can't be preempted by a higher-priority Pod that also needs
  DRA resources. The high-priority Pod will remain in a pending state until the device
  becomes available, which happens when the conflicting Pod terminates or is
  manually deleted.
-->
## 限制 {#limitations}

* Kubernetes 调度器当前不支持对 DRA 资源进行[抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
  这意味着，已经在某个节点上运行并使用了 DRA 资源的现有 Pod，
  无法被另一个同样需要 DRA 资源的更高优先级 Pod 抢占。
  该高优先级 Pod 将保持在 Pending 状态，
  直到设备资源变为可用——通常发生在冲突的 Pod 终止或被手动删除之后。

<!--
## DRA beta features {#beta-features}

The following sections describe DRA features that support advanced use
cases. Usage of them is optional and may only be relevant with DRA
drivers that support them.

Some of them are available in the Alpha or Beta
[feature stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
Those depend on feature gates and may depend on additional
{{< glossary_tooltip text="API groups" term_id="api-group" >}}.
For more information, see
[Set up DRA in the cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/).
-->
## DRA Beta 特性  {#beta-features}

以下各小节介绍了支持高级使用场景的 DRA 特性。
这些特性的使用是可选的，并且可能只与支持它们的 DRA 驱动有关。

其中一些特性处于 Alpha 或 Beta
[特性阶段](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)。
这些特性依赖于特性门控，并且可能依赖于额外的
{{< glossary_tooltip text="API 组" term_id="api-group" >}}。

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
Admin access is a privileged mode and should not be granted to regular users in
multi-tenant clusters. Only users authorized to
create ResourceClaim or ResourceClaimTemplate objects in namespaces labeled with
`resource.kubernetes.io/admin-access: "true"` (case-sensitive) can use the
`adminAccess` field. This ensures that non-admin users cannot misuse the
feature.

Admin access is a *beta feature* and is enabled by default with the
[`DRAAdminAccess` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAAdminAccess)
in the kube-apiserver, kube-scheduler, and kubelet.

### Granular status authorization {#granular-status-authorization}

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Starting in Kubernetes v1.36, DRA enforces fine-grained authorization checks for updates
to `ResourceClaim` status by using synthetic subresources and node-aware verbs.

For security hardening guidance, including RBAC examples for scheduler and DRA
drivers, see
[Hardening Guide - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/).

For a step-by-step cluster administrator procedure, see
[Harden Dynamic Resource Allocation in Your Cluster](/docs/tasks/administer-cluster/hardening-dra/).
-->
管理性质访问是一种特权模式，在多租户集群中不应该对普通用户开放。
只有在标有 `resource.kubernetes.io/admin-access: "true"`（区分大小写）
的命名空间中只有被授权创建 ResourceClaim 或 ResourceClaimTemplate
对象的用户才能使用 `adminAccess` 字段。这确保了非管理员用户不能滥用此特性。

管理性质访问是一个 **Beta 特性**，默认通过 kube-apiserver、kube-scheduler 和 kubelet
中的
[`DRAAdminAccess` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAAdminAccess)
启用。

### 细粒度状态鉴权 {#granular-status-authorization}

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

从 Kubernetes v1.36 开始，DRA 会通过合成子资源和感知节点的动词，
对 `ResourceClaim` 状态的更新实施细粒度鉴权检查。

有关安全加固指导，包括调度器和 DRA 驱动的 RBAC 示例，参阅
[加固指南 - 动态资源分配](/zh-cn/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)。

有关面向集群管理员的分步过程，参阅
[加固集群中的动态资源分配](/zh-cn/docs/tasks/administer-cluster/hardening-dra/)。

<!--
## DRA alpha features {#alpha-features}

The following sections describe DRA features that are available in the Alpha
[feature stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
They depend on enabling feature gates and may depend on additional
{{< glossary_tooltip text="API groups" term_id="api-group" >}}.
For more information, see
[Set up DRA in the cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/).
-->
## DRA Alpha 特性  {#alpha-features}

以下各小节描述可供使用的 Alpha 阶段 DRA 特性。
它们依赖于启用特性门控，并且可能依赖于额外的
{{< glossary_tooltip text="API 组" term_id="api-group" >}}以在集群中安装 DRA。

更多信息请参阅[在集群中安装 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)。

<!--
### Extended resource allocation by DRA {#extended-resource}
-->
### 使用 DRA 分配扩展资源 {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

<!--
You can provide an extended resource name for a DeviceClass. The scheduler will then
select the devices matching the class for the extended resource requests.
This allows users to continue using extended resource requests in a pod to request
either extended resources provided by device plugin, or DRA devices.
The same extended resource can be provided either by device plugin, or DRA on one single cluster node.
The same extended resource can be provided by device plugin on some nodes, and DRA on other nodes in the same cluster.

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
prefix `deviceclass.resource.kubernetes.io/` and the DeviceClass name.
This works for any DeviceClass, even if it does not specify an extended resource name.
The resulting ResourceClaim will contain a request for an `ExactCount` of the
specified number of devices of that DeviceClass.

Extended resource allocation by DRA is a *beta feature* and is enabled by default with the
[`DRAExtendedResource` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource)
in the kube-apiserver, kube-scheduler, kube-controller-manager, and kubelet.
-->
另外，用户可以使用一种特殊的扩展资源来分配设备，而不一定需要显式创建 ResourceClaim。
你可以使用扩展资源名称前缀 `deviceclass.resource.kubernetes.io/` 并加上 DeviceClass 的名称。
这种方式适用于任意 DeviceClass，即使该类未显式指定扩展资源名称。
生成的 ResourceClaim 将包含一个请求，要求按照 `ExactCount` 模式，
从该 DeviceClass 中分配指定数量的设备。

通过 DRA 分配扩展资源是一个 **Beta 特性**，默认通过 kube-apiserver、kube-scheduler、
kube-controller-manager 和 kubelet 中的
[`DRAExtendedResource` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource)
启用。

<!--
### Partitionable devices {#partitionable-devices}
-->
### 可切分设备  {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

<!--
Devices represented in DRA don't necessarily have to be a single unit connected to a single machine,
but can also be a logical device comprised of multiple devices connected to multiple machines.
These devices might consume overlapping resources of the underlying phyical devices,
meaning that when one logical device is allocated other devices will no longer be available.
-->
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
-->
在 ResourceSlice API 中，这类设备表示为命名 CounterSet 列表，每个 CounterSet 包含一组命名计数器。
计数器表示物理设备上可供通过 DRA 发布的逻辑设备使用的资源。

逻辑设备可以指定 ConsumesCounter 列表。每个条目包含对某个 CounterSet 的引用和一组命名计数器及其消耗量。
因此，要使设备可被分配，所引用的 CounterSet 必须具有设备引用的计数器所需的足够数量。

<!--
CounterSets must be specified in separate ResourceSlices from devices.
Devices can consume counters from any CounterSet defined in the same resource pool as the device.

Here is an example of two devices, each consuming 6Gi of memory from the a shared counter with 8Gi of memory.
Thus, only one of the devices can be allocated at any point in time.
The scheduler handles this and it is transparent to the consumer as the ResourceClaim API is not affected.
-->
CounterSet 必须在与设备不同的 ResourceSlice 中指定。
设备可以使用与自身位于同一资源池中的任意 CounterSet 中的计数器。

以下是两个设备的示例，每个设备从具有 8Gi 内存的共享计数器中消耗 6Gi 内存。
因此，在任何时间点只能分配其中一个设备。调度器处理这种情况，
对使用者来说是透明的，因为 ResourceClaim API 不受影响。

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
Partitionable devices is a *beta feature* and enabled when the
[`DRAPartitionableDevices` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
is kept enabled in the kube-apiserver and kube-scheduler.
-->
可切分设备是一个 **Beta 特性**，当 kube-apiserver 和 kube-scheduler 中的
[`DRAPartitionableDevices` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices)
保持启用时可用。

<!--
### Consumable capacity
-->
### 可消耗容量   {#consumable-capacity}

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

<!--
The consumable capacity feature allows the same devices to be consumed by multiple independent ResourceClaims,
with the Kubernetes scheduler managing how much of the device's capacity is used up by each claim.
This is analogous to how Pods can share the resources on a Node; ResourceClaims can share the resources on a Device.

The device driver can set `allowMultipleAllocations` field added in `.spec.devices` of `ResourceSlice`
to allow allocating that device to multiple independent ResourceClaims or to multiple requests within a ResourceClaim.

Users can set `capacity` field added in `spec.devices.requests` of `ResourceClaim` to specify the device resource requirements for each allocation.
-->
可消耗容量特性允许同一台设备被多个独立的 ResourceClaim 同时使用，
由 Kubernetes 调度器负责管理每个申领消耗了多少设备容量。
这一机制类似于多个 Pod 可以共享同一节点上的资源，
多个 ResourceClaim 也可以共享同一设备上的资源。

设备驱动程序可以在 ResourceSlice 的 `.spec.devices` 中设置
`allowMultipleAllocations` 字段，以允许将该设备分配给多个独立的 ResourceClaim，
或分配给同一 ResourceClaim 中的多个请求。

用户可以在 ResourceClaim 的 `spec.devices.requests` 中新增的 `capacity` 字段进行设置，
以指定每次分配所需的设备资源容量。

<!--
For the device that allows multiple allocations, the requested capacity is drawn from — or consumed from — its total capacity,
a concept known as **consumable capacity**.
Then, the scheduler ensures that the aggregate consumed capacity across all claims does not exceed the device’s overall capacity.
Furthermore, driver authors can use the `requestPolicy` constraints on individual device capacities to control
how those capacities are consumed.
For example, the driver author can specify that a given capacity is only consumed in increments of 1Gi.
-->
对于允许多次分配的设备，请求的容量将从设备的总容量中提取或消耗，
这一机制被称为**可消耗容量（Consumable Capacity）**。
随后，调度器会确保所有申领合计消耗的容量总和不会超过设备的整体容量。
此外，驱动程序的作者还可以通过在单个设备的容量上使用 `requestPolicy`
约束来控制这些容量的消耗方式。
例如，驱动作者可以规定某个资源的容量只能以 1Gi 为单位进行消耗。

<!--
Here is an example of a network device which allows multiple allocations and contains a consumable bandwidth capacity.
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
In this example, a multiply-allocatable device was chosen. However, any `resource.example.com` device
with at least the requested 1G bandwidth could have met the requirement.
If a non-multiply-allocatable device were chosen, the allocation would have resulted in the entire device.
To force the use of a only multiply-allocatable devices, you can use the CEL criteria `device.allowMultipleAllocations == true`.

#### DistinctAttribute constraint

When requesting multiple devices in a ResourceClaim, you can use the DistinctAttribute
constraint to ensure that each allocated device has a different value for a specified
attribute. This constraint was introduced with the consumable capacity feature.

The DistinctAttribute constraint is particularly useful when working with
multiply-allocatable devices. It prevents the scheduler from allocating the same
device multiple times within a single ResourceClaim, even when that device allows
multiple allocations.

Beyond preventing duplicate allocations, this constraint helps optimize performance
by ensuring devices are distributed based on their attributes. For example, you can
use it to distribute devices across different NUMA nodes to optimize memory bandwidth
and reduce contention.
-->
在这个例子里，选中的是一个可多次分配的设备。
但是实际上，任何不小于所请求的 1G 带宽的 `resource.example.com` 类型的设备都可以满足该需求。
如果选中的是一个不可多次分配的设备，那么此次分配将导致整个设备被占用。
若要强制仅使用可多次分配的设备，你可以使用 CEL 表达式
`device.allowMultipleAllocations == true`。

#### DistinctAttribute 约束 {#distinctattribute-constraint}

当在 ResourceClaim 中请求多个设备时，你可以使用 DistinctAttribute 约束来确保每个已分配设备
在指定属性上具有不同的值。此约束随可消耗容量特性一起引入。

在使用可多次分配设备时，DistinctAttribute 约束尤其有用。
即使某设备允许多次分配，它也可以防止调度器在单个 ResourceClaim 中多次分配同一设备。

除了防止重复分配之外，此约束还可以通过确保设备按属性分布来帮助优化性能。
例如，你可以使用它将设备分布到不同的 NUMA 节点上，以优化内存带宽并减少竞争。

<!--
### Device taints and tolerations {#device-taints-and-tolerations}
-->
### 设备污点和容忍度  {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

<!--
Device taints are similar to node taints: a taint has a string key, a string value, and an effect.
The effect is applied to the ResourceClaim which is using a tainted device and to all Pods referencing that ResourceClaim.
The "NoSchedule" effect prevents scheduling those Pods.
Tainted devices are ignored when trying to allocate a ResourceClaim because using them would prevent scheduling of Pods.
-->
设备污点类似于节点污点：污点具有字符串形式的键、字符串形式的值和效果。
效果应用于使用带污点设备的 ResourceClaim 以及引用该 ResourceClaim 的所有 Pod。
"NoSchedule" 效果会阻止调度这些 Pod。
在尝试分配 ResourceClaim 时会忽略带污点的设备，
因为使用它们会阻止 Pod 的调度。

<!--
The "NoExecute" effect implies "NoSchedule" and in addition causes eviction of all Pods
which have been scheduled already.
This eviction is implemented in the device taint eviction controller in kube-controller-manager by deleting affected Pods.

The "None" effect is ignored by the scheduler and eviction controller.
DRA drivers can use it to communicate exceptions to admins or other controllers,
like for example degraded health of a device. Admins can also use it to
do dry-runs of pod eviction in DeviceTaintRules (more on that below).
-->
"NoExecute" 效果隐含 "NoSchedule" 效果，此外还会导致已调度的所有 Pod 被驱逐。
这种驱逐是通过 kube-controller-manager 中的设备污点驱逐控制器删除受影响的 Pod 来实现的。

"None" 效果会被调度器和驱逐控制器忽略。
DRA 驱动程序可以使用它向管理员或其他控制器传达异常信息，例如设备健康状况下降。
管理员也可以使用它在 DeviceTaintRules 中执行 Pod 驱逐的预演（详见下文）。

<!--
ResourceClaims can tolerate taints. If a taint is tolerated, its effect does not apply.
An empty toleration matches all taints. A toleration can be limited to certain effects
and/or match certain key/value pairs.
A toleration can check that a certain key exists, regardless which value it has, or it can check
for specific values of a key.
For more information on this matching see the
[node taint concepts](/docs/concepts/scheduling-eviction/taint-and-toleration#concepts).
-->
ResourceClaim 可以容忍污点。如果污点被容忍，其效果将不会生效。
空容忍度匹配所有污点。容忍度可以限制为特定效果和/或匹配特定键/值对。
容忍度可以检查某个键是否存在，无论其值是什么，也可以检查某个键是否具有特定值。
有关此匹配机制的更多信息，请参阅[节点污点概念](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration#concepts)。

<!--
Eviction can be delayed by tolerating a taint for a certain duration.
That delay starts at the time when a taint gets added to a device, which is recorded in a field of the taint.

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
Device taints and tolerations is a *beta feature* and enabled when the
[`DRADeviceTaints` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceTaints)
is kept enabled in the kube-apiserver, kube-controller-manager and kube-scheduler.
To use DeviceTaintRules, the `resource.k8s.io/v1beta2` API version must be
enabled together with the [`DRADeviceTaintRules` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceTaintRules).
In contrast to `DRADeviceTaints`, `DRADeviceTaintRules` is off by default because of this dependency
on the beta API group, which has to be off by default.
-->
设备污点和容忍度是一个 **Beta 特性**，
当 kube-apiserver、kube-controller-manager 和 kube-scheduler 中的
[`DRADeviceTaints` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceTaints)
保持启用时可用。
要使用 DeviceTaintRules，必须同时启用 `resource.k8s.io/v1beta2` API 版本和
[`DRADeviceTaintRules` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceTaintRules)。
与 `DRADeviceTaints` 不同，`DRADeviceTaintRules` 默认关闭，
因为它依赖于必须默认关闭的 Beta API 组。

<!--
You can add taints to devices in the following ways, by using the DeviceTaintRule API kind.
-->
你可以通过以下方式使用 DeviceTaintRule API 类型向设备添加污点。

<!--
#### Taints set by the driver

A DRA driver can add taints to the device information that it publishes in ResourceSlices.
Consult the documentation of a DRA driver to learn whether the driver uses taints and what their keys and values are.
-->
#### 由驱动程序设置的污点 {#taints-set-by-the-driver}

DRA 驱动程序可以为其在 ResourceSlice 中发布的设备信息添加污点。
请查阅 DRA 驱动程序的文档，了解驱动程序是否使用污点以及它们的键和值是什么。

<!--
#### Taints set by an admin
-->
#### 由管理员设置的污点 {#taints-set-by-an-admin}

{{< feature-state feature_gate_name="DRADeviceTaintRules" >}}

<!--
An admin or a control plane component can taint devices without having to tell
the DRA driver to include taints in its device information in ResourceSlices.
They do that by creating DeviceTaintRules.
Each DeviceTaintRule adds one taint to devices which match the device selector.
Without such a selector, no devices are tainted. 
This makes it harder to accidentally evict all pods using ResourceClaims when leaving out the selector by mistake.
-->
管理员或控制平面组件可以在不告诉 DRA 驱动程序在其 ResourceSlice
中的设备信息中包含污点的情况下为设备添加污点。他们通过创建 DeviceTaintRule 来实现这一点。
每个 DeviceTaintRule 为匹配设备选择算符的设备添加一个污点。
如果没有指定这样的选择算符，则不会为任何设备添加污点。这使得在错误地遗漏选择算符时，
意外驱逐所有使用 ResourceClaim 的 Pod 变得更加困难。

<!--
Devices can be selected by giving the name of a DeviceClass, driver, pool, and/or device.
The DeviceClass selects all devices that are selected by the selectors in that DeviceClass.
With just the driver name, an admin can taint all devices managed by that driver,
for example while doing some kind of maintenance of that driver across the entire cluster.
Adding a pool name can limit the taint to a single node, if the driver manages node-local devices.

Finally, adding the device name can select one specific device.
The device name and pool name can also be used alone, if desired.
For example, drivers for node-local devices are encouraged to use the node name as their pool name.
Then tainting with that pool name automatically taints all devices on a node.
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
Drivers might use stable names like "gpu-0" that hide which specific device is currently assigned to that name.
To support tainting a specific hardware instance, CEL selectors can be used in a DeviceTaintRule
to match a vendor-specific unique ID attribute, if the driver supports one for its hardware.

The taint applies as long as the DeviceTaintRule exists.
It can be modified and and removed at any time.
Here is one example of a DeviceTaintRule for a fictional DRA driver:
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
apiVersion: resource.k8s.io/v1beta2
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
apiVersion: resource.k8s.io/v1beta2
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
The kube-apiserver automatically tracks when this taint was created by setting the
`timeAdded` field in the `spec`. The toleration period starts at that time
stamp. During updates which change the effect (see simulated eviction flow
below), the kube-apiserver automatically updates the time stamp. Users can control
the time stamp explicitly by setting the field when creating a DeviceTaintRule and
by changing it to some different value when updating.

The status contains a condition added by the eviction controller:
-->
kube-apiserver 会通过设置 `spec` 中的 `timeAdded` 字段，
自动跟踪此污点的创建时间。容忍期限从该时间戳开始。
在变更效果的更新期间（参阅下面的模拟驱逐流程），kube-apiserver 会自动更新时间戳。
用户可以在创建 DeviceTaintRule 时设置该字段，并在更新时将其改为其他值，
以显式控制这个时间戳。

状态中包含驱逐控制器添加的状况：

```shell
kubectl describe devicetaintrules
```

```
Name:         example
...
Spec:
  Device Selector:
    Driver:  dra.example.com
  Taint:
    Effect:      NoExecute
    Key:         dra.example.com/unhealthy
    Time Added:  2025-11-05T18:15:37Z
    Value:       Broken
Status:
  Conditions:
    Last Transition Time:  2025-11-05T18:15:37Z
    Message:               1 pod evicted since starting the controller.
    Observed Generation:   1
    Reason:                Completed
    Status:                False
    Type:                  EvictionInProgress
Events:                    <none>
```

<!--
Pods get evicted by deleting them. Usually this happens very quickly,
except when a toleration for the taint delays it for a certain period or
when there are very many pods which need to be evicted. When it takes
longer, the message provides information about the current status:
-->
Pod 会被删除以进行驱逐。通常情况下，这个过程很快，除非对污点的容忍度导致驱逐延迟一段时间，
或者需要驱逐的 Pod 数量非常多。如果耗时较长，消息会提供有关当前状态的信息：

```
2 pods need to be evicted in 2 different namespaces. 1 pod evicted since starting the controller.
```

<!--
The condition can be used to check whether an eviction is currently active:
-->
该状况可用于检查当前是否存在进行中的驱逐行为：

```shell
kubectl wait --for=condition=EvictionInProgress=false DeviceTaintRule/example
```

<!--
Beware of the potential race between scheduler and controller observing the new
taint at different times, which can lead to pods still being scheduled at a
time when the controller thinks that there are none which need to be evicted
and thus sets this condition to `False`. In practice, this race is made very
unlikely by updating the status only after an intentional delay of a few
seconds.

For `effect: None`, the message provides information about the number of
affected devices, how many of those are allocated, and how many pods would be
evicted if the effect was `NoExecute`. This can be used to do a dry-run before
actually triggering eviction:

- Create a DeviceTaintRule with the desired selectors and `effect: None`.

- Review the message:
-->
注意调度器和控制器可能在不同时间观察到新的污点，这会导致在控制器认为没有需要驱逐的
Pod 时，Pod 仍然会被调度，从而将此状况设置为 `False`。
实际上，通过故意延迟几秒钟后才更新状态，可以大大降低这种竞争发生的可能性。

对于 `effect: None`，消息会提供有关受影响设备数量、已分配设备数量以及如果效果为
`NoExecute` 将驱逐多少个 Pod 的信息。这可用于在实际触发驱逐之前进行预演：

- 创建一个包含所需选择器和 `effect: None` 的 DeviceTaintRule。
- 查看消息：

  ```
  3 published devices selected. 1 allocated device selected.
  1 pod would be evicted in 1 namespace if the effect was NoExecute.
  This information will not be updated again. Recreate the DeviceTaintRule to trigger an update.
  ```

  <!--
  Published devices are those listed in ResourceSlices. Tainting them
  prevents allocation for new pods. Only allocated devices cause
  eviction of the pods using them.
  -->

  已发布的设备是指 ResourceSlice 中列出的设备。为其设置污点会阻止将其分配给新的 Pod。
  只有已分配的设备才会导致正在使用它们的 Pod 被驱逐。

<!--
- Edit the DeviceTaintRule and change the effect into `NoExecute`.
-->
- 编辑 DeviceTaintRule 并将 effect 更改为 `NoExecute`。

<!--
### Resource pool status {#resource-pool-status}

{{< feature-state feature_gate_name="DRAResourcePoolStatus" >}}

You can query the availability of devices in resource pools using the
ResourcePoolStatusRequest API. This provides visibility into how many devices
are available, allocated, or unavailable across your cluster's DRA resource pools.

To check resource pool status:

1. Create a ResourcePoolStatusRequest specifying the driver name (required) and
   optionally a limit on the number of pools returned. You can also limit it to a single pool by specifying a pool name:

   ```yaml
   apiVersion: resource.k8s.io/v1beta2
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

1. Wait for the controller to process the request:

   ```shell
   kubectl wait --for=condition=Complete resourcepoolstatusrequest/check-gpus --timeout=30s
   ```

1. Read the status to see pool availability:

   ```shell
   kubectl get resourcepoolstatusrequest/check-gpus -o yaml
   ```

   The status includes:
   - `poolCount`: total number of pools matching the filter (may exceed the number
     of pools listed if truncated by the limit).
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
   - `conditions`: includes `Complete` (success) or `Failed` (error) condition types.

1. Delete the request when done:

   ```shell
   kubectl delete resourcepoolstatusrequest/check-gpus
   ```

ResourcePoolStatusRequest objects are processed once by a controller in
kube-controller-manager. The spec is immutable once created, and the entire
object becomes immutable once the status is populated. To get updated
availability data, delete and recreate the request. Completed requests are
automatically cleaned up after 1 hour.

This feature requires explicit RBAC permissions on the ResourcePoolStatusRequest
resource. No default ClusterRoles include this permission.

Resource pool status is an *alpha feature* and only enabled when the
[`DRAResourcePoolStatus` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
is enabled in the kube-apiserver and kube-controller-manager.
-->
### 资源池状态 {#resource-pool-status}

{{< feature-state feature_gate_name="DRAResourcePoolStatus" >}}

你可以使用 ResourcePoolStatusRequest API 查询资源池中设备的可用性。
这可以让你了解集群 DRA 资源池中有多少设备可用、已分配或不可用。

要检查资源池状态：

1. 创建 ResourcePoolStatusRequest，指定驱动名称（必需），
   并可选指定返回的资源池数量限制。你也可以通过指定资源池名称将查询限制为单个资源池：

   ```yaml
   apiVersion: resource.k8s.io/v1beta2
   kind: ResourcePoolStatusRequest
   metadata:
     name: check-gpus
   spec:
     driver: example.com/gpu
     # 可选：过滤到某个特定资源池
     # poolName: my-pool
     # 可选：限制返回的资源池数量（默认 100，最大 1000）
     # limit: 10
   ```

1. 等待控制器处理请求：

   ```shell
   kubectl wait --for=condition=Complete resourcepoolstatusrequest/check-gpus --timeout=30s
   ```

1. 读取状态以查看资源池可用性：

   ```shell
   kubectl get resourcepoolstatusrequest/check-gpus -o yaml
   ```

   状态中包含：
   - `poolCount`：与过滤条件匹配的资源池总数（如果因限制而截断，可能超过列出的资源池数量）。
   - `pools`：资源池详情列表，每项包含：
     - `driver` 和 `poolName`：标识资源池。
     - `generation`：跨 ResourceSlice 观测到的最新资源池代际。
     - `resourceSliceCount`：组成该资源池的 ResourceSlice 数量。
     - `totalDevices`：资源池中的设备总数。
     - `allocatedDevices`：当前已分配给申领的设备。
     - `availableDevices`：可用于分配的设备
       （totalDevices - allocatedDevices - unavailableDevices）。
     - `unavailableDevices`：由于污点或其他状况而不可用的设备。
     - `nodeName`：与资源池关联的节点（如有）。
     - `validationError`：当资源池数据无法被完整验证时设置
       （例如在代际滚动期间）。设置此字段时，设备计数字段可能未设置。
   - `conditions`：包含 `Complete`（成功）或 `Failed`（错误）状况类型。

1. 完成后删除请求：

   ```shell
   kubectl delete resourcepoolstatusrequest/check-gpus
   ```

ResourcePoolStatusRequest 对象由 kube-controller-manager 中的控制器处理一次。
对象创建后其规约不可变；填充状态后，整个对象都不可变。
要获取更新后的可用性数据，请删除并重新创建请求。
已完成的请求会在 1 小时后自动清理。

此特性需要对 ResourcePoolStatusRequest 资源具备显式 RBAC 权限。
默认 ClusterRole 都不包含此权限。

资源池状态是一个 **Alpha 特性**，只有在 kube-apiserver 和 kube-controller-manager
中启用
[`DRAResourcePoolStatus` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)
时才可用。

<!--
### Device binding conditions
-->
### 设备绑定状况  {#device-binding-conditions}

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
[PreBind 阶段](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)实现的。
在该阶段，调度器会在继续执行绑定之前检查所有所需的设备状况是否已满足。

这种机制通过避免过早绑定以及支持与外部设备控制器进行协调的方式，提高了调度的可靠性。

<!--
To use this feature, device drivers (typically managed by driver owners) must publish the
following fields in the `Device` section of a `ResourceSlice`. Cluster administrators
must enable the `DRADeviceBindingConditions` and `DRAResourceClaimDeviceStatus` feature
gates for the scheduler to honor these fields.
-->
要使用此特性，设备驱动程序（通常由驱动程序所有者管理）必须在 `ResourceSlice` 的
`Device` 部分中发布以下字段。此外为了让调度器能够考虑这些字段，集群管理员必须启用
`DRADeviceBindingConditions` 和 `DRAResourceClaimDeviceStatus` 特性门控。

<!--
`bindingConditions`
: A list of _condition types_ that must be set to True (in the `.status.conditions` field of the associated ResourceClaim) before the Pod can be bound. These conditions typically represent readiness signals, such as DeviceAttached or DeviceInitialized.

`bindingFailureConditions`
: A list of condition types that, if set to True in
  status.conditions field of the associated ResourceClaim, indicate a failure state.
  If any of these conditions are True, the scheduler will abort binding and reschedule the Pod.

`bindsToNode`
: if set to `true`, the scheduler records the selected node name in the
  `status.allocation.nodeSelector` field of the ResourceClaim.
  This does not affect the Pod's `spec.nodeSelector`. Instead, it sets a node selector
  inside the ResourceClaim, which external controllers can use to perform node-specific
  operations such as device attachment or preparation.
-->
`bindingConditions`
: 一个**状况类型**列表，在 Pod 可被绑定之前，
  所关联 ResourceClaim 的 `.status.conditions` 字段中的这些状况必须被设置为 True。
  这些状况通常表示就绪信号，例如 DeviceAttached 或 DeviceInitialized。

`bindingFailureConditions`
: 一个状况类型列表，如果在所关联 ResourceClaim 的 status.conditions 字段中
  这些状况类型被设置为 True，则表示失败状态。
  如果其中任何一个状况为 True，调度器会中止绑定并重新调度 Pod。

`bindsToNode`
: 若设置为 `true`，调度器会将所选节点的名称记录到 ResourceClaim 的
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
The scheduler waits up to **600 seconds** (default) for all `bindingConditions` to become `True`.
If the timeout is reached or any `bindingFailureConditions` are `True`, the scheduler
clears the allocation and reschedules the Pod.
A cluster administration can configure this timeout duration by editing the kube-scheduler configuration file.

An example of configuring this timeout in `KubeSchedulerConfiguration` is given below:

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

#### Example {#device-binding-conditions-example}

Here is an example of a ResourceSlice that you might see in a cluster where there's a DRA driver in use, and that driver supports binding conditions:
-->
调度器会等待 `bindingConditions` 变为 `True`，但最长不超过 **600 秒**（默认）。
如果发生超时或者任意一个 `bindingFailureConditions` 变为 `True`,
那么调度器将清除当前的分配并重新调度该 Pod。
集群管理员可以通过编辑 kube-scheduler 配置文件来配置此超时时长。

下面给出在 `KubeSchedulerConfiguration` 中配置此超时设置的示例：

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

#### 示例 {#device-binding-conditions-example}

下面是你可能在使用了 DRA 驱动且该驱动支持绑定状况的集群中看到的 ResourceSlice 示例：

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

- The ResourceSlice targets nodes labeled with `accelerator-type=high-performance`, 
so that the scheduler uses only a specific set of eligible nodes.
- The scheduler selects one node from the selected group (for example, `node-3`) and sets 
the `status.allocation.nodeSelector` field in the ResourceClaim to that node name.
- The `dra.example.com/is-prepared` binding condition indicates that the device `gpu-1`
must be prepared (the `is-prepared` condition has a status of `True`) before binding. 
- If the `gpu-1` device preparation fails (the `preparing-failed` condition has a status of `True`), the scheduler aborts binding.
- The scheduler waits up to 600 seconds (default) for the device to become ready.
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
- 调度器会等待最多 600 秒（默认），直到此设备变为就绪状态。
- 外部控制器可以使用 ResourceClaim 中的节点选择器，
  以在选定节点上执行特定于该节点的初始化或配置操作。

<!--
Device binding conditions is a *beta feature* and is enabled by default, controlled by the
[`DRADeviceBindingConditions` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceBindingConditions)
in the kube-apiserver and kube-scheduler.
-->
设备绑定状况是一个 **Beta 特性**，默认启用，
由 kube-apiserver 和 kube-scheduler 中的
[`DRADeviceBindingConditions` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceBindingConditions)
控制。

<!--
### Node allocatable resources {#node-allocatable-resources}

{{< feature-state feature_gate_name="DRANodeAllocatableResources" >}}

Devices managed by DRA can have an underlying footprint composed of node-allocatable
resources, such as `cpu`, `memory`, `hugepages`, or `ephemeral-storage`.
This feature integrates these DRA-based requests into the scheduler's standard
accounting alongside regular Pod `spec` requests for these resources.

Users (PodSpec authors) can use a mixture of Pod-level resources, container-level resources,
and resource claims with associated node-allocatable resources. These devices represent
resources like CPUs or memory directly, or they could be accelerators, network interface cards,
or other devices that require some host resources when allocated. The DRA driver will
populate information in the ResourceSlice that tells the scheduler how to calculate the
node allocatable resources when the device is allocated to a ResourceClaim.
PodSpec authors do not need to make that calculation themselves.

When authoring a PodSpec using claims for these types of devices, there are a few things to be aware of:

*   When Pod-level resources are used, the sum of all container and claim resources
    must not exceed the Pod-level resources; otherwise, the Pod will fail to schedule.
*   A container's total resource requirement is the sum of its container-level resources
    and any node-allocatable resources from its associated resource claims.
*   Claims that consume node allocatable resources cannot be shared between Pods.

#### Details for DRA Driver Authors

DRA drivers declare this node allocatable resource footprint using the
`nodeAllocatableResourceMappings` field on devices within a ResourceSlice.
This mapping translates the requested DRA device or capacity into standard
resources that are tracked in the node's `status.allocatable` (note that extended
resources are not supported for this mapping). This is useful both for drivers that directly
expose native resources (like a CPU or Memory DRA driver) and for devices that
require auxiliary node dependencies (like an accelerator that needs host memory).

This mapping defines the translation of the requested DRA device or capacity
units to the corresponding quantity of the node-allocatable resource. The
scheduler calculates the exact quantity using:

*   **Device-based scaling:** If `capacityKey` is not set, the
    `allocationMultiplier` multiplies the device count allocated to the claim.
    The `allocationMultiplier` defaults to 1 if not specified.
*   **Capacity-based scaling:** If `capacityKey` is set, it references a
    capacity name defined in the device's `capacity` map. The scheduler looks
    up the amount of that capacity consumed by the claim and multiplies it by
    the `allocationMultiplier`.

##### Example: CPU DRA Driver (Capacity-based scaling)

Here is an example where a CPU DRA driver exposes a CPU socket as a pool of 128
CPUs using [DRA consumable capacity](#consumable-capacity). The `capacityKey` links the consumed
`cpu.example.com/cpu` capacity directly to the node's standard `cpu`
allocatable resource:
-->
### 节点可分配资源 {#node-allocatable-resources}

{{< feature-state feature_gate_name="DRANodeAllocatableResources" >}}

DRA 管理的设备可以具有由节点可分配资源组成的底层占用量，
例如 `cpu`、`memory`、`hugepages` 或 `ephemeral-storage`。
此特性会将这些基于 DRA 的请求与常规 Pod `spec` 中对此类资源的请求一起，
纳入调度器的标准核算。

用户（PodSpec 作者）可以混合使用 Pod 级别资源、容器级别资源，
以及带有关联节点可分配资源的资源申领。这些设备可以直接表示 CPU 或内存等资源，
也可以是加速器、网络接口卡，或其他在分配时需要某些主机资源的设备。
DRA 驱动会在 ResourceSlice 中填充信息，告诉调度器当设备分配给 ResourceClaim 时
如何计算节点可分配资源。PodSpec 作者不需要自行执行该计算。

使用此类设备的申领编写 PodSpec 时，需要注意以下几点：

*   使用 Pod 级别资源时，所有容器资源和申领资源之和不得超过 Pod 级别资源；
    否则 Pod 将无法调度。
*   容器的总资源需求是其容器级别资源与其关联资源申领中的所有节点可分配资源之和。
*   消耗节点可分配资源的申领不能在 Pod 之间共享。

#### DRA 驱动作者的细节 {#details-for-dra-driver-authors}

DRA 驱动使用 ResourceSlice 中设备上的 `nodeAllocatableResourceMappings` 字段
声明此节点可分配资源占用量。此映射会将所请求的 DRA 设备或容量转换为
节点 `status.allocatable` 中跟踪的标准资源（注意，扩展资源不支持此映射）。
这既适用于直接暴露原生资源（如 CPU 或内存 DRA 驱动）的驱动，
也适用于需要辅助节点依赖项（如需要主机内存的加速器）的设备。

此映射定义了所请求的 DRA 设备或容量单位到相应节点可分配资源数量的转换。
调度器使用以下方式计算确切数量：

*   **基于设备的扩缩：** 如果未设置 `capacityKey`，
    `allocationMultiplier` 会乘以分配给申领的设备数量。
    如果未指定，`allocationMultiplier` 默认为 1。
*   **基于容量的扩缩：** 如果设置了 `capacityKey`，
    它会引用设备 `capacity` 映射中定义的容量名称。
    调度器查找该申领消耗的容量数量，并将其乘以 `allocationMultiplier`。

##### 示例：CPU DRA 驱动（基于容量的扩缩） {#example-cpu-dra-driver-capacity-based-scaling}

下面的示例中，CPU DRA 驱动使用 [DRA 可消耗容量](#consumable-capacity)
将 CPU 插槽作为包含 128 个 CPU 的资源池公开。`capacityKey` 将消耗的
`cpu.example.com/cpu` 容量直接关联到节点的标准 `cpu` 可分配资源：

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
    nodeAllocatableResourceMappings:
      cpu:
        capacityKey: "cpu.example.com/cpu"
        # 如果省略，allocationMultiplier 默认为 1
  - name: socket1cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResourceMappings:
      cpu:
        capacityKey: "cpu.example.com/cpu"
        # 如果省略，allocationMultiplier 默认为 1
```

<!--
##### Example: Accelerator with Auxiliary Resources (Device-based scaling)

Here is an example of a resource slice where an accelerator requires an
additional 8Gi of memory per device instance to function:
-->
##### 示例：带辅助资源的加速器（基于设备的扩缩） {#example-accelerator-with-auxiliary-resources-device-based-scaling}

下面的资源切片示例中，加速器的每个设备实例都需要额外 8Gi 内存才能工作：

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
    nodeAllocatableResourceMappings:
      memory:
        allocationMultiplier: "8Gi"
```

<!--
After a Pod is successfully bound to the node, the exact quantities of
node-allocatable resources allocated via DRA are included in the Pod's
`status.nodeAllocatableResourceClaimStatuses` field.

Node-allocatable resources is an alpha feature and is enabled when the
[`DRANodeAllocatableResources` feature gate](/docs/reference/command-line-tools-reference/feature-gates/#DRANodeAllocatableResources) is enabled in the kube-apiserver,
kube-scheduler, and kubelet. In the alpha phase, the kubelet does not account
for these resources when determining QoS classes, configuring cgroups, or making
eviction decisions.
-->
Pod 成功绑定到节点后，通过 DRA 分配的节点可分配资源的确切数量会包含在 Pod 的
`status.nodeAllocatableResourceClaimStatuses` 字段中。

节点可分配资源是一个 Alpha 特性，当 kube-apiserver、kube-scheduler 和 kubelet 中启用
[`DRANodeAllocatableResources` 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRANodeAllocatableResources)
时可用。在 Alpha 阶段，kubelet 在确定 QoS 类、配置 cgroup 或做出驱逐决策时
不会核算这些资源。

<!--
### DRA device metadata in containers {#device-metadata}

{{< feature-state state="alpha" for_k8s_version="v1.36" >}}

DRA drivers can expose device metadata such as device attributes (PCI bus
addresses or mdevUUID for mediated devices) or network configuration directly
to containers as JSON files.
This lets applications inside the container discover information about allocated
devices without querying the Kubernetes API or building custom controllers.

KEP-5304 defines a
[device metadata protocol](#device-metadata-protocol) that drivers must
follow so applications inside the container see a consistent layout across
drivers and clusters. The
[DRA kubelet plugin library](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
implements this protocol for you; the rest of this section describes how to
use it.

Device metadata follows the same rules as device access: it is available inside
a container only when that container requests the device in its container
specification, and not otherwise. For how to request DRA devices in Pods and
containers, see
[Request devices in workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads).
-->
### 容器中的 DRA 设备元数据 {#device-metadata}

{{< feature-state state="alpha" for_k8s_version="v1.36" >}}

DRA 驱动可以将设备元数据（例如设备属性，PCI 总线地址、用于 mediated 设备的 mdevUUID，
或网络配置）以 JSON 文件形式直接暴露给容器。
这使容器内的应用能够发现已分配设备的信息，而不必查询 Kubernetes API 或构建自定义控制器。

KEP-5304 定义了驱动必须遵循的[设备元数据协议](#device-metadata-protocol)，
以便容器内的应用在不同驱动和集群中看到一致的布局。
[DRA kubelet 插件库](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
会为你实现此协议；本节其余部分介绍如何使用它。

设备元数据遵循与设备访问相同的规则：只有当容器在其容器规约中请求了设备时，
该元数据才会在容器内可用，否则不可用。有关如何在 Pod 和容器中请求 DRA 设备，
参阅[在工作负载中使用 DRA 请求设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads)。

<!--
#### Device metadata protocol {#device-metadata-protocol}

The protocol consists of four rules:

1. **File paths.** Metadata files live inside containers under
   `/var/run/kubernetes.io/dra-device-attributes`. For a directly referenced
   ResourceClaim the path is
   `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`; for a
   claim created from a ResourceClaimTemplate the path is
   `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`
   (where `podClaimName` is `pod.spec.resourceClaims[].name`).

   In cases where the ResourceClaim request uses the
   [prioritized list](#prioritized-list) feature, only the top-level request
   name is used for the `<requestName>` segment in the file path (that is,
   the `/<subrequest>` portion is dropped). Inside the
   JSON file, the `requests[].name` field carries the full
   `<request>/<subrequest>` reference (for example, `gpu/high-memory`) so
   that consumers can identify which alternative was allocated.

   The path constants are defined in
   [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata).

1. **JSON API.** Each file is a stream of one or more
   [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
   objects serialized as versioned JSON with `apiVersion` and `kind`, following
   Kubernetes API conventions. The same metadata is encoded once per supported
   API version (newest first). All objects in the stream are semantically
   equivalent; consumers should use the first object they can decode.

1. **Generation.** When a driver updates a metadata file the embedded
   `metadata.generation` field must increase so consumers can detect changes.

1. **Container exposure.** Files are typically exposed via
   {{< glossary_tooltip text="CDI" term_id="cdi" >}} bind-mounts, but other
   mechanisms are permitted as long as the file appears at the correct path and
   is read-only inside the container.
-->
#### 设备元数据协议 {#device-metadata-protocol}

此协议包含四条规则：

1. **文件路径。** 元数据文件位于容器内的
   `/var/run/kubernetes.io/dra-device-attributes` 下。
   对于直接引用的 ResourceClaim，路径为
   `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`；
   对于基于 ResourceClaimTemplate 创建的申领，路径为
   `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`
   （其中 `podClaimName` 是 `pod.spec.resourceClaims[].name`）。

   当 ResourceClaim 请求使用[按优先级排序的列表](#prioritized-list)特性时，
   文件路径中的 `<requestName>` 片段只使用顶层请求名称（也就是丢弃 `/<subrequest>` 部分）。
   在 JSON 文件中，`requests[].name` 字段携带完整的 `<request>/<subrequest>` 引用
   （例如 `gpu/high-memory`），以便使用者能够识别分配了哪个替代项。

   路径常量定义在
   [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata)。

1. **JSON API。** 每个文件都是一个或多个
   [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
   对象的流，这些对象按照 Kubernetes API 约定，以带 `apiVersion` 和 `kind` 的版本化 JSON
   序列化。同一份元数据会按每个受支持的 API 版本编码一次（最新版本在前）。
   流中的所有对象在语义上等价；使用者应使用它能解码的第一个对象。

1. **代际。** 当驱动更新元数据文件时，嵌入的 `metadata.generation` 字段必须递增，
   以便使用者检测变化。

1. **容器暴露。** 文件通常通过 {{< glossary_tooltip text="CDI" term_id="cdi" >}}
   绑定挂载暴露，但也允许其他机制，只要文件出现在正确路径并在容器内为只读即可。

<!--
#### How device metadata works {#device-metadata-how-it-works}

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

When device metadata is enabled, the driver generates metadata files and CDI
bind-mount specifications while preparing the allocated devices for the pod,
before the consuming containers start. The metadata appears inside containers at
the well-known paths as [defined above](#device-metadata-protocol).

When a single request allocates devices from multiple DRA drivers, each driver
writes its own metadata file. Containers enumerate `*-metadata.json` files in
the request directory to discover all devices.

The Go package
[`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata)
provides utilities for reading and decoding these metadata files by applications
inside the container.
-->
#### 设备元数据的工作方式 {#device-metadata-how-it-works}

设备元数据是驱动侧特性，不需要任何 Kubernetes API 变更或特性门控。
使用 DRA kubelet 插件库是实现驱动的常见方式，但驱动也可以通过其他方式构建。
使用 kubelet 插件的驱动在启动插件时通过传递 `EnableDeviceMetadata` 和
`MetadataVersions`
[选项](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Option)
启用此特性。`MetadataVersions` 指定要序列化到元数据文件中的 API 版本，
必须由驱动显式设置。请查看你的 DRA 驱动文档，以了解是否支持设备元数据以及如何启用它。

启用设备元数据后，驱动会在为 Pod 准备已分配设备时、使用这些设备的容器启动前，
生成元数据文件和 CDI 绑定挂载规约。元数据会出现在[上文定义](#device-metadata-protocol)的
众所周知路径中。

当单个请求从多个 DRA 驱动分配设备时，每个驱动都会写入自己的元数据文件。
容器会枚举请求目录中的 `*-metadata.json` 文件以发现所有设备。

Go 包
[`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata)
提供了供容器内应用读取和解码这些元数据文件的工具。

<!--
#### Metadata schema {#device-metadata-schema}

Each metadata file conforms to the
[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
API (`metadata.resource.k8s.io/v1alpha1`).
The following example shows a metadata file for a GPU device allocated through
a ResourceClaimTemplate:
-->
#### 元数据模式 {#device-metadata-schema}

每个元数据文件都遵循
[`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata)
API（`metadata.resource.k8s.io/v1alpha1`）。
以下示例展示了通过 ResourceClaimTemplate 分配的 GPU 设备的元数据文件：

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
#### Immediate and deferred metadata {#device-metadata-lifecycle}

Drivers provide metadata in one of two ways:

Immediate
: The driver populates metadata while preparing the claim on the
  node and writes the metadata file before the container starts. This is
  typical for GPU drivers where device information is known at preparation time.

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

In both cases, metadata remains available to each consuming container for the
lifetime of that container. Metadata files are cleaned up after all containers
in the Pod have terminated.

To learn how to use device metadata in your workloads, see
[Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/).

#### Custom drivers {#device-metadata-custom-drivers}

Custom, hand-crafted drivers that do not use the DRA kubelet plugin library
must implement the [device metadata protocol](#device-metadata-protocol)
themselves. That means writing `DeviceMetadata` JSON at the correct file paths,
incrementing `metadata.generation` on every update, and exposing the files
read-only inside the container through CDI or an equivalent mechanism.
-->
#### 立即元数据和延迟元数据 {#device-metadata-lifecycle}

驱动通过以下两种方式之一提供元数据：

立即
: 驱动在节点上准备申领时填充元数据，并在容器启动前写入元数据文件。
  这通常适用于在准备时已知设备信息的 GPU 驱动。

延迟
: 在某些情况下，例如网络驱动，设备信息在设备分配时不可用，
  但会在 Pod 沙箱创建后变为可用。在这些情况下，驱动使用空元数据文件创建 CDI 挂载，
  之后通过在容器启动前运行的 NRI 钩子写入实际元数据。
  这确保应用永远不会看到缺失或部分写入的文件。每次更新都必须递增
  `metadata.generation`，以便使用者检测变化。DRA kubelet 插件库中的
  `MetadataUpdater` API 会自动为驱动作者处理代际记账。

在这两种情况下，元数据在每个使用它的容器的生命周期内保持可用。
Pod 中所有容器终止后，元数据文件会被清理。

要了解如何在你的工作负载中使用设备元数据，参阅
[访问 DRA 设备元数据](/zh-cn/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)。

#### 定制驱动 {#device-metadata-custom-drivers}

未使用 DRA kubelet 插件库的定制手写驱动必须自行实现[设备元数据协议](#device-metadata-protocol)。
这意味着在正确的文件路径写入 `DeviceMetadata` JSON，
在每次更新时递增 `metadata.generation`，并通过 CDI 或等效机制将文件以只读方式暴露到容器中。

<!--
### List type attributes {#list-type-attributes}

{{< feature-state feature_gate_name="DRAListTypeAttributes" >}}

This feature improves the ResourceSlice API, allowing DRA drivers to specify list values for device attributes instead of only scalars.
This is useful for modeling more complex internal node topologies, for example when a CPU has adjacency to multiple PCIe roots.

For ResourceClaim authors (end users), this means that the `matchAttribute` and `distinctAttribute` work better for these cases.

- `matchAttribute` — the two attributes must have a *non-empty list intersection*, rather than be identical (scalar values are treated as single-item lists).
  This just means that if one driver publishes a single value for, say, the PCIe root, and another driver publishes a list, the constraint is met as long as
  the single value appears somewhere in the list.
- `distinctAttribute` — the attribute values must be *pairwise-disjoint* (no value shared between any two devices)

To help ResourceClaim authors use attributes that may be lists inside CEL expressions, this feature also introduces an `includes()` CEL function.
-->
### 列表型属性 {#list-type-attributes}

{{< feature-state feature_gate_name="DRAListTypeAttributes" >}}

此特性改进了 ResourceSlice API，允许 DRA 驱动为设备属性指定列表值，而不仅限于标量。
这有助于为更复杂的节点内部拓扑建模，例如 CPU 与多个 PCIe 根之间存在邻接关系的情况。

对于 ResourceClaim 作者（最终用户）而言，这意味着 `matchAttribute` 和 `distinctAttribute`
在这些场景中工作得更好。

- `matchAttribute`：两个属性必须具有**非空列表交集**，而不是必须完全相同
  （标量值会被视为单元素列表）。这意味着如果一个驱动发布了某个单值（例如 PCIe 根），
  而另一个驱动发布了列表，只要该单值出现在列表中的任意位置，约束就会满足。
- `distinctAttribute`：属性值必须**两两不相交**（任意两个设备之间没有共享值）。

为帮助 ResourceClaim 作者在 CEL 表达式中使用可能为列表的属性，
此特性还引入了 `includes()` CEL 函数。

```
# 标量属性（向后兼容）
# 假设：device.attributes["dra.example.com"].model = "model-a"
device.attributes["dra.example.com"].model.includes("model-a")  # true
device.attributes["dra.example.com"].model.includes("model-b")  # false

# 列表型属性（需要 DRAListTypeAttributes）
# 假设：device.attributes["dra.example.com"].supported-models= ["model-a", "model-b"]
device.attributes["dra.example.com"].supported-models.includes("model-a")  # true
device.attributes["dra.example.com"].supported-models.includes("model-c")  # false
```

<!--
#### Details for DRA Driver Authors

By default, each `DeviceAttribute` holds exactly one scalar value: a boolean, an integer,
a string, or a semantic version string. The `DRAListTypeAttributes` feature gate extends
`DeviceAttribute` with four list-type fields, allowing a device to advertise multiple
values for a single attribute:

- **`bools`** — a list of boolean values
- **`ints`** — a list of 64-bit integer values
- **`strings`** — a list of strings (each at most 64 characters)
- **`versions`** — a list of semantic version strings per semver.org spec 2.0.0
  (each at most 64 characters)

The total number of individual attribute values per device (scalar fields plus all list
elements combined) is limited to **48**. When any device in a ResourceSlice uses this feature or other advanced features such as taints,
the ResourceSlice will be limited to at most **64** devices.
use list-type attributes or other advanced features such as taints.

Here is an example of a device advertising multiple supported models using a list-type
string attribute:
-->
#### DRA 驱动作者的细节 {#details-for-dra-driver-authors-list-type-attributes}

默认情况下，每个 `DeviceAttribute` 只保存一个标量值：布尔值、整数、
字符串或语义版本字符串。`DRAListTypeAttributes` 特性门控使用四个列表型字段扩展
`DeviceAttribute`，允许设备为单个属性发布多个值：

- **`bools`**：布尔值列表
- **`ints`**：64 位整数列表
- **`strings`**：字符串列表（每个最多 64 个字符）
- **`versions`**：符合 semver.org 规约 2.0.0 的语义版本字符串列表
  （每个最多 64 个字符）

每个设备的单独属性值总数（标量字段加上所有列表元素）限制为 **48**。
当 ResourceSlice 中的任何设备使用此特性或污点等其他高级特性时，
该 ResourceSlice 最多只能包含 **64** 个设备。
使用列表型属性或污点等其他高级特性也受此限制。

下面是一个使用列表型字符串属性发布多个支持型号的设备示例：

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: example-resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: gpu-0
    attributes:
      dra.example.com/supported-models:
        strings:
        - model-a
        - model-b
```

<!--
List type attributes is an *alpha feature* and only enabled when the
`DRAListTypeAttributes` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver and kube-scheduler.
-->
列表型属性是一个 **Alpha 特性**，只有在 kube-apiserver 和 kube-scheduler
中启用 `DRAListTypeAttributes`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时才可用。

## {{% heading "whatsnext" %}}

<!-- 
- [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Allocate devices to workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- [Access DRA device metadata](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP.
-->
- [在集群中安装 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)
- [使用 DRA 为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- [访问 DRA 设备元数据](/zh-cn/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
- 了解更多该设计的信息，
  参阅[使用结构化参数的动态资源分配 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)。
