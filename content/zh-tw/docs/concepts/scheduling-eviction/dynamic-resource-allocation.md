---
title: 動態資源分配
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
本頁描述 Kubernetes 中的 **動態資源分配（DRA）**。

<!-- body -->
<!--
## About DRA {#about-dra}
-->
## 關於 DRA {#about-dra}

{{< glossary_definition prepend="DRA 是" term_id="dra" length="all" >}}


<!--
Allocating resources with DRA is a similar experience to
[dynamic volume provisioning](/docs/concepts/storage/dynamic-provisioning/), in
which you use PersistentVolumeClaims to claim storage capacity from storage
classes and request the claimed capacity in your Pods.
-->
使用 DRA 來分配資源的體驗與[動態卷製備](/zh-cn/docs/concepts/storage/dynamic-provisioning/)類似，
你可以使用 PersistentVolumeClaim 基於存儲類來申領存儲容量，並在 Pod
中請求這些已申領的容量。

<!--
### Benefits of DRA {#dra-benefits}
-->
### DRA 的好處 {#dra-benefits}

<!--
DRA provides a flexible way to categorize, request, and use devices in your
cluster. Using DRA provides benefits like the following:
-->
DRA 爲集羣中的設備提供了一種靈活的方式來進行分類、請求和使用。 使用 DRA 具有以下好處：

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
* **靈活地過濾設備**：使用 Common Expression Language (CEL) 對特定設備屬性進行細粒度過濾。
* **設備共享**：通過引用相應的資源聲明，可以讓多個容器或 Pod 共享同一個資源。
* **集中化的設備分類**：設備驅動和集羣管理員可以使用設備類，
  來爲應用運維人員提供針對不同使用場景優化的硬件類別。
  例如，你可以創建一個面向通用工作負載的成本優化型設備類，以及一個面向關鍵任務的高性能設備類。
* **簡化 Pod 的資源請求**：使用 DRA 後，應用運維人員無需在 Pod 的資源請求中明確指定設備的規格。
  相反，Pod 只需引用一個資源申領，這個申領中的設備配置將會自動應用到該 Pod。

<!--
These benefits provide significant improvements in the device allocation
workflow when compared to
[device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/),
which require per-container device requests, don't support device sharing, and
don't support expression-based device filtering.
-->

這些好處相較於[設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)，
在設備分配的流程中帶來了顯著的改進。設備插件需要爲每個容器單獨請求設備，且不支持設備共享，
也無法基於表達式進行對設備進行過濾。

<!--
### Types of DRA users {#dra-user-types}

The workflow of using DRA to allocate devices involves the following types of
users:
-->

### DRA 用戶的類型 {#dra-user-types}
使用 DRA 進行設備分配的工作流程裏通常涉及到以下幾類用戶：


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
* **設備所有者**： 爲設備負責。設備的所有者可以是商業廠商、集羣運營者，或其他實體。
  若要使用 DRA，設備必須具備兼容 DRA 的驅動程序，該驅動需完成以下工作：

  * 創建 ResourceSlice，向 Kubernetes 提供節點及資源的信息；
  * 當集羣中的資源容量發生變化時，更新相應的 ResourceSlice；
  * 可選地，創建 DeviceClass 以供工作負載運維人員申領設備。

<!--
* **Cluster admin**: responsible for configuring clusters and nodes,
  attaching devices, installing drivers, and similar tasks. To use DRA,
  cluster admins do the following:

  * Attach devices to nodes.
  * Install device drivers that support DRA.
  * Optionally, create DeviceClasses that workload operators can use to claim
    devices.
-->
* **集羣管理員**：負責集羣與節點配置、設備掛接、驅動安裝等相關工作。
  若要使用 DRA，集羣管理員需要執行以下操作：

  * 將設備掛接到節點上；
  * 安裝支持 DRA 的設備驅動；
  * 可選地，創建 DeviceClass 以供工作負載運維人員用來申領設備。

<!--
* **Workload operator**: responsible for deploying and managing workloads in the
  cluster. To use DRA to allocate devices to Pods, workload operators do the
  following:

  * Create ResourceClaims or ResourceClaimTemplates to request specific
    configurations within DeviceClasses.
  * Deploy workloads that use specific ResourceClaims or ResourceClaimTemplates.
-->
* **工作負載運維人員**：負責在集羣中部署和管理工作負載。
  若要使用 DRA 爲 Pod 分配設備，工作負載運維人員需要執行以下操作：

  * 創建 ResourceClaim 或 ResourceClaimTemplate，以便於基於指定的 DeviceClass
    請求特定的設備配置；
  * 部署引用這些 ResourceClaim 或 ResourceClaimTemplate 的工作負載。

<!--
## DRA terminology {#terminology}

DRA uses the following Kubernetes API kinds to provide the core allocation
functionality. All of these API kinds are included in the
`resource.k8s.io/v1`
{{< glossary_tooltip text="API group" term_id="api-group" >}}.
-->
## DRA 術語 {#terminology}

DRA 使用以下幾種 Kubernetes API 類別來提供核心的資源分配功能。所有這些 API 類別均屬於
`resource.k8s.io/v1` {{< glossary_tooltip text="API 組" term_id="api-group" >}}。

<!--
DeviceClass
: Defines a category of devices that can be claimed and how to select specific
  device attributes in claims. The DeviceClass parameters can match zero or
  more devices in ResourceSlices. To claim devices from a DeviceClass,
  ResourceClaims select specific device attributes.
-->
DeviceClass
: 定義一類可被申領的設備，以及在聲明中如何按設備屬性來選擇這些設備。
  DeviceClass 中的參數可與 ResourceSlice 中的零個或多個設備匹配。
  當申領某個 DeviceClass 的設備時，ResourceClaim 會按照特定的設備屬性來過濾。

<!--
ResourceClaim
: Describes a request for access to attached resources, such as
  devices, in the cluster. ResourceClaims provide Pods with access to
  a specific resource. ResourceClaims can be created by workload operators
  or generated by Kubernetes based on a ResourceClaimTemplate.
-->
ResourceClaim
: 描述了對集羣中已掛接資源（如設備）的分配請求。
  ResourceClaim 使 Pod 能夠訪問某個特定的資源。
  ResourceClaim 既可以由工作負載運維人員創建，
  也可以由 Kubernetes 根據 ResourceClaimTemplate 自動生成。

<!--
ResourceClaimTemplate
: Defines a template that Kubernetes uses to create per-Pod
  ResourceClaims for a workload. ResourceClaimTemplates provide Pods with
  access to separate, similar resources. Each ResourceClaim that Kubernetes
  generates from the template is bound to a specific Pod. When the Pod
  terminates, Kubernetes deletes the corresponding ResourceClaim.
-->
ResourceClaimTemplate
: 定義一個模板，Kubernetes 會根據它爲工作負載中的每個 Pod 創建獨立的 ResourceClaim。
  ResourceClaimTemplate 使 Pod 能夠訪問相互獨立但相似的資源。 
  Kubernetes 根據模板生成的每個 ResourceClaim 都會與某個特定的 Pod 綁定。
  當該 Pod 終止時，Kubernetes 將會自動刪除對應的 ResourceClaim。

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
: 代表了掛接在節點上的一個或更多的資源，例如設備。驅動程序創建並管理集羣中的 ResourceSlice。
  當一個 ResourceClaim 被創建並被 Pod 使用的時候，Kubernetes 會使用 ResourceSlice
  來找到夠訪問到被申領資源的節點。Kubernetes 將資源分配給 ResourceClaim 並將 Pod 
  調度到該節點從而使得 Pod 能夠訪問到特定資源。

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

DeviceClass 允許集羣管理員或設備驅動程序定義集羣中的設備類別。
這些 DeviceClass 告訴運維人員他們可以使用什麼設備以及他們能夠如何請求這些設備。
你可以使用 [通用表達式語言（CEL）](https://cel.dev) 來按照特定屬性選擇設備。
隨後，引用該 DeviceClass 的 ResourceClaim 就可以請求該類別的設備配置。

要創建 DeviceClass，請參閱[在集羣中安裝 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).

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

ResourceClaim 定義某個工作負載所需的資源。每個 ResourceClaim 都包含一個或多個引用了某個
DeviceClass 並從其中選擇具體的設備的 _request_。

ResourceClaim 也可以使用 _selectors_ 來篩選滿足特定條件的設備，並通過 _constraints_
來限制可以滿足請求的設備。ResourceClaim 可以被工作負載運維人員創建，也可以由 Kubernetes
根據 ResourceClaimTemplate 生成。ResourceClaimTemplate 定義了一個模版來讓
Kubernetes 能根據它爲 Pod 自動生成 ResourceClaim。

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

#### ResourceClaim 和 ResourceClaimTemplate 的使用場景 {#when-to-use-rc-rct}

使用方式取決於你的需求，例如：

* **ResourceClaim**： 你希望多個 Pod 對某個特定設備進行共享訪問。你可以創建 ResourceClaim
  並對其生命週期進行手動管理。
* **ResourceClaimTemplate**：你希望 Pod 能夠有對獨立但有相似配置的設備進行獨立訪問。
  Kubernetes 可以基於 ResourceClaimTemplate 中的定義生成 ResourceClaim，而每個生成的
  ResourceClaim 的生命週期都與其所對應的 Pod 的生命週期是相綁定的。

<!--
When you define a workload, you can use
{{< glossary_tooltip term_id="cel" text="Common Expression Language (CEL)" >}}
to filter for specific device attributes or capacity. The available parameters
for filtering depend on the device and the drivers.
-->
當你在定義一個工作負載時，你可以使用
{{< glossary_tooltip term_id="cel" text="通用表達式語言（CEL）" >}}
來針對特定設備的屬性和容量進行過濾。這些可用於過濾的參數則取決於具體的設備與其驅動程序。

<!--
If you directly reference a specific ResourceClaim in a Pod, that ResourceClaim
must already exist in the same namespace as the Pod. If the ResourceClaim
doesn't exist in the namespace, the Pod won't schedule. This behavior is similar
to how a PersistentVolumeClaim must exist in the same namespace as a Pod that
references it.
-->
如果你直接將一個特定的 ResourceClaim 關聯到一個 Pod，則這個 ResourceClaim
必須已存在於與該 Pod 相同的命名空間中。如果這個 ResourceClaim 在該命名空間不存在，
該 Pod 將不會被調度。 這個行爲類似於 PersistentVolumeClaim：
被 Pod 引用的 PersistentVolumeClaim 必須存在於與該 Pod 相同的命名空間中。

<!--
You can reference an auto-generated ResourceClaim in a Pod, but this isn't
recommended because auto-generated ResourceClaims are bound to the lifetime of
the Pod that triggered the generation.

To learn how to claim resources using one of these methods, see
[Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).
-->
你能夠在 Pod 中引用一個自動生成的 ResourceClaim，但並不推薦這樣做。因爲自動生成的
ResourceClaim 是和觸發它生成的 Pod 的生命週期相綁定的。

要了解如何使用這種方式申領資源，
請參閱[使用 DRA 爲工作負載分配設備](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)。

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
#### 按優先級排序的列表 {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

你可以在 ResourceClaim 中爲請求提供按優先級排序的子請求列表。調度器將選擇第一個能夠分配的子請求。
這使得用戶能夠在首選設備不可用時指定工作負載可以使用的替代設備。

在下面的示例中，ResourceClaimTemplate 請求了一個顏色爲黑色且尺寸爲大的設備。
如果具有這些屬性的設備不可用，那麼 Pod 將無法被調度。而使用按優先級排序的列表特性，
就可以指定第二個替代方案，即請求兩個顏色爲白色且尺寸爲小的設備。
如果大型黑色設備可用就分配它，但如果它不可用但有兩個小型白色設備可用，
Pod 仍然能夠運行。

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
該決策是針對每個 Pod 獨立做出的。 因此如果該 Pod 是 ReplicaSet 或其他類似組中的一員的時候，
你不能假定該組中的所有成員都會選擇相同的子請求。你的工作負載必須能夠適應這種情況。

按優先級排序的列表是一個 *Beta 特性*，
在 kube-apiserver 和 kube-scheduler 中通過 `DRAPrioritizedList`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 默認啓用。

### ResourceSlice {#resourceslice}

<!--
Each ResourceSlice represents one or more
{{< glossary_tooltip term_id="device" text="devices" >}} in a pool. The pool is
managed by a device driver, which creates and manages ResourceSlices. The
resources in a pool might be represented by a single ResourceSlice or span
multiple ResourceSlices.
-->
每個 ResourceSlice 代表資源池中的一個或多個{{< glossary_tooltip term_id="device" text="設備" >}}。
該資源池由設備驅動程序管理，它負責創建並維護這些 ResourceSlice。
資源池中的資源可以由單個 ResourceSlice 表示，也可以分佈在多個 ResourceSlice 中。

<!--
ResourceSlices provide useful information to device users and to the scheduler,
and are crucial for dynamic resource allocation. Every ResourceSlice must include
the following information:
-->
ResourceSlice 爲設備使用者和調度器提供了有用的信息，是實現動態資源分配的關鍵組成部分。
每個 ResourceSlice 都必須包含以下信息：

<!--
* **Resource pool**: a group of one or more resources that the driver manages.
  The pool can span more than one ResourceSlice. Changes to the resources in a
  pool must be propagated across all of the ResourceSlices in that pool. The
  device driver that manages the pool is responsible for ensuring that this
  propagation happens.
-->
* **資源池**: 一組由驅動程序管理的一個或多個資源。
  一個資源池可以跨越多個 ResourceSlice。當資源池中的資源發生變化時，
  必須將這些變更同步到該資源池內的所有 ResourceSlice。
  負責管理該資源池的設備驅動程序應確保這一同步過程的正確執行。

<!--
* **Devices**: devices in the managed pool. A ResourceSlice can list every
  device in a pool or a subset of the devices in a pool. The ResourceSlice
  defines device information like attributes, versions, and capacity. Device
  users can select devices for allocation by filtering for device information
  in ResourceClaims or in DeviceClasses.
-->
* **設備**： 那些在被管理的資源池內的設備。一個 ResourceSlice 可以列出資源池中的所有設備，
  也可以僅列出其中的一部分。ResourceSlice 定義了設備的一系列信息，例如屬性、版本以及容量等。
  設備使用者可以在 ResourceClaim 或 DeviceClass 中通過篩選這些設備信息來選擇要分配的設備。

<!--
* **Nodes**: the nodes that can access the resources. Drivers can choose which
  nodes can access the resources, whether that's all of the nodes in the
  cluster, a single named node, or nodes that have specific node labels.
-->
* **節點**：能夠訪問這些資源的節點。驅動程序可以自行決定哪些節點可訪問這些資源，
  可以是集羣中的所有節點、某個特定名稱的節點，或者是那些具有特定節點標籤的節點。

<!--
Drivers use a {{< glossary_tooltip text="controller" term_id="controller" >}} to
reconcile ResourceSlices in the cluster with the information that the driver has
to publish. This controller overwrites any manual changes, such as cluster users
creating or modifying ResourceSlices.

Consider the following example ResourceSlice:
-->
驅動程序使用 {{< glossary_tooltip text="控制器" term_id="controller" >}}，
將集羣中的 ResourceSlice 與驅動程序需要發佈的信息進行協調。
該控制器會覆蓋任何手動的更改，例如集羣用戶對 ResourceSlice 的創建或更改。

以下是一個 ResourceSlice 的示例：

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
  # allNodes 字段定義了是否集羣中的任意節點都能夠訪問該設備。
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
這個 ResourceSlice 由 `resource-driver.example.com` 驅動程序在 `black-cat-pool`
資源池中進行管理。其中字段 `allNodes: true` 表示集羣中的任意節點都可以訪問這些設備。
該 ResourceSlice 中包含一個名爲 large-black-cat 的設備，其具有以下屬性：

* `color`: `black`
* `size`: `large`
* `cat`: `true`

<!--
A DeviceClass could select this ResourceSlice by using these attributes, and a
ResourceClaim could filter for specific devices in that DeviceClass.
-->
DeviceClass 可以通過這些屬性來選擇這個 ResourceSlice，
而 ResourceClaim 則可以在該 DeviceClass 中進一步篩選特定的設備。

<!--
## How resource allocation with DRA works {#how-it-works}

The following sections describe the workflow for the various
[types of DRA users](#dra-user-types) and for the Kubernetes system during
dynamic resource allocation.
-->
## DRA 資源分配的工作原理 {#how-it-works}

接下來的一節將介紹在動態資源分配過程中，多種
[DRA 用戶的類型](#dra-user-types)以及 Kubernetes 系統各自的工作流程。

<!--
### Workflow for users {#user-workflow}
-->
### 用戶工作流程{#user-workflow}

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
1. **創建驅動程序**： 設備的所有者或第三方實體會創建那些能夠在集羣內創建並管理
   ResourceSlice 的驅動程序。這些驅動程序還可以創建那些用於定義設備類別和請求方式的
   DeviceClass。
1. **配置集羣**： 集羣管理員創建集羣，將設備掛接到節點上，並安裝支持 DRA 的設備驅動程序。
   集羣管理員可以創建那些用於定義設備類別和請求方式的 DeviceClass。
1. **資源申領**： 工作負載運維人員創建 ResourceClaimTemplate 或 ResourceClaim，
   以請求指定 DeviceClass 所提供的特定設備配置。同時，應用運維人員通過修改其 Kubernetes
   清單以在工作負載中引用這些 ResourceClaimTemplate 或 ResourceClaim。

<!--
### Workflow for Kubernetes {#kubernetes-workflow}
-->
### Kubernetes 工作流程 {#kubernetes-workflow}

<!--
1. **ResourceSlice creation**: drivers in the cluster create ResourceSlices that
   represent one or more devices in a managed pool of similar devices.
-->
1. **創建ResourceSlice**：集羣中的驅動程序負責創建 ResourceSlice，
   用於表示在受管控的相似設備資源池中一個或多個設備。

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
2. **創建工作負載**：集羣控制面檢查那些引用了 ResourceClaimTemplate 或特定
   ResourceClaim 的工作負載。

   * 如果這個工作負載使用了一個 ResourceClaimTemplate，那麼一個被叫做
     `resourceclaim-controller` 的控制器會爲這個工作負載中的每個
     Pod 生成 ResourceClaim。
   * 如果這個工作負載使用了一個特定的 ResourceClaim， 那麼 Kubernetes 將會檢查這個
     ResourceClaim 在集羣中是否存在。如果 ResourceClaim 不存在，則 Pod 將不會被部署。

<!--
1. **ResourceSlice filtering**: for every Pod, Kubernetes checks the
   ResourceSlices in the cluster to find a device that satisfies all of the
   following criteria:

   * The nodes that can access the resources are eligible to run the Pod.
   * The ResourceSlice has unallocated resources that match the requirements of
     the Pod's ResourceClaim.
-->
3. **過濾 ResourceSlice**：對於任意一個 Pod，Kubernetes 會檢查集羣中的 ResourceSlice
   以找到一個滿足所有以下條件的設備：

   * 能夠訪問該資源的節點必須符合運行該 Pod 的條件；
   * 該 ResourceSlice 中存在尚未分配的資源，並且這些資源符合該 Pod 所引用的 ResourceClaim 的要求。

<!--
1. **Resource allocation**: after finding an eligible ResourceSlice for a
   Pod's ResourceClaim, the Kubernetes scheduler updates the ResourceClaim
   with the allocation details.
-->
4. **分配資源**：在爲 Pod 的 ResourceClaim 找到符合條件的 ResourceSlice 之後，
   Kubernetes 調度器會將分配的詳細信息更新在 ResourceClaim 上。

<!--
1. **Pod scheduling**: when resource allocation is complete, the scheduler
   places the Pod on a node that can access the allocated resource. The device
   driver and the kubelet on that node configure the device and the Pod's access
   to the device.
-->
5. **調度Pod**：當資源完成分配後，調度器將 Pod 放在可以訪問該資源的節點上。
   節點上的設備驅動程序以及 kubelet 將對設備進行配置，從而使得 Pod 能夠訪問到該設備。

<!--
## Observability of dynamic resources {#observability-dynamic-resources}

You can check the status of dynamically allocated resources by using any of the
following methods:

* [kubelet device metrics](#monitoring-resources)
* [ResourceClaim status](#resourceclaim-device-status)
* [Device health monitoring](#device-health-monitoring)
-->
## 動態資源的可觀測性 {#observability-dynamic-resources}

你可以使用以下任意方式來檢查動態分配資源的狀態：

* [kubelet 設備指標](#monitoring-resources)
* [ResourceClaim 狀態](#resourceclaim-device-status)
* [設備健康監控](#device-health-monitoring)


<!--
### kubelet device metrics {#monitoring-resources}

The `PodResourcesLister` kubelet gRPC service lets you monitor in-use devices.
The `DynamicResource` message provides information that's specific to dynamic
resource allocation, such as the device name and the claim name. For details,
see
[Monitoring device plugin resources](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
-->
### kubelet 設備指標 {#monitoring-resources}

kubelet 的 `PodResourcesLister` gRPC 服務可以對在使用的設備進行監控。
`DynamicResource` 提供了與動態資源分配相關的特定信息，例如設備名稱和聲明名稱。
更多細節請參閱[監控設備插件資源](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

<!--
### ResourceClaim device status {#resourceclaim-device-status}
-->
### ResourceClaim 設備狀態 {#resourceclaim-device-status}

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

<!--
DRA drivers can report driver-specific
[device status](/docs/concepts/overview/working-with-objects/#object-spec-and-status)
data for each allocated device in the `status.devices` field of a ResourceClaim.
For example, the driver might list the IP addresses that are assigned to a
network interface device.
-->
DRA 驅動程序可以在 ResourceClaim 的 `status.devices`
字段中爲已分配的設備上報特定於驅動的[設備狀態](/zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status)數據。
例如，驅動程序可以在其中列出分配給某個網絡接口設備的 IP 地址。

<!--
The accuracy of the information that a driver adds to a ResourceClaim
`status.devices` field depends on the driver. Evaluate drivers to decide whether
you can rely on this field as the only source of device information.
-->
上報到 ResourceClaim 的 `status.devices` 字段上的信息的準確性取決於驅動程序。
請對所用驅動進行評估，從而判斷能否將此字段作爲設備信息的唯一來源。

<!--
If you disable the `DRAResourceClaimDeviceStatus`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), the
`status.devices` field automatically gets cleared when storing the ResourceClaim.
A ResourceClaim device status is supported when it is possible, from a DRA
driver, to update an existing ResourceClaim where the `status.devices` field is
set.
-->
如果你禁用了`DRAResourceClaimDeviceStatus`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
那麼 `status.devices` 字段會在 ResourceClaim 被保存時被自動清理。
ResourceClaim 的設備狀態的支持，需要 DRA 驅動程序能夠對設置了 `status.devices`
字段的存量 ResourceClaim 對象進行更新。

<!--
For details about the `status.devices` field, see the
{{< api-reference page="workload-resources/resource-claim-v1beta1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} API reference.
-->
更多`status.devices`字段的詳細信息，請參閱
{{< api-reference page="workload-resources/resource-claim-v1beta1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} 的 API 參考。

<!--
### Device Health Monitoring {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

As an alpha feature, Kubernetes provides a mechanism for monitoring and reporting the health of dynamically allocated infrastructure resources.
For stateful applications running on specialized hardware, it is critical to know when a device has failed or become unhealthy. It is also helpful to find out if the device recovers.

To enable this functionality, the `ResourceHealthStatus` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/resource-health-status/) must be enabled, and the DRA driver must implement the `DRAResourceHealth` gRPC service.

When a DRA driver detects that an allocated device has become unhealthy, it reports this status back to the kubelet. This health information is then exposed directly in the Pod's status. The kubelet populates the `allocatedResourcesStatus` field in the status of each container, detailing the health of each device assigned to that container.

This provides crucial visibility for users and controllers to react to hardware failures. For a Pod that is failing, you can inspect this status to determine if the failure was related to an unhealthy device.
-->
### 設備健康監控 {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

作爲一種 Alpha 特性，Kubernetes 提供了一種機制用於監控和上報動態分配的基礎設施資源的健康狀況。
對於跑在專用硬件上的有狀態的應用而言，瞭解設備何時發生故障或變得不健康是至關重要的。  
同時，獲知設備是否恢復也同樣有助於維護應用的穩定性。

要開啓這個功能，`ResourceHealthStatus`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
必須啓用的同時，設備驅動程序必須實現了 `DRAResourceHealth` gRPC 服務。

當一個 DRA 驅動程序發現某個已分配的設備變爲不健康，他要將這個狀態彙報回 kubelet。
這些健康狀態的信息會直接暴露在 Pod 的狀態中。 kubelet 會在每個容器的狀態中填充
`allocatedResourcesStatus` 字段，以詳細描述分配給該容器的每個設備的健康狀況。

這爲用戶和控制器提供了關鍵的可觀測性，使其能夠及時響應硬件故障。
對於處於失敗狀態的 Pod，可以通過檢查該狀態信息來判斷故障是否與某個不健康的設備有關。

<!--
## Pre-scheduled Pods

When you - or another API client - create a Pod with `spec.nodeName` already set, the scheduler gets bypassed.
If some ResourceClaim needed by that Pod does not exist yet, is not allocated
or not reserved for the Pod, then the kubelet will fail to run the Pod and
re-check periodically because those requirements might still get fulfilled
later.
-->
## 預調度的 Pod   {#pre-scheduled-pods}

當你（或別的 API 客戶端）創建設置了 `spec.nodeName` 的 Pod 時，調度器將被繞過。
如果 Pod 所需的某個 ResourceClaim 尚不存在、未被分配或未爲該 Pod 保留，那麼 kubelet
將無法運行該 Pod，並會定期重新檢查，因爲這些要求可能在以後得到滿足。

<!--
Such a situation can also arise when support for dynamic resource allocation
was not enabled in the scheduler at the time when the Pod got scheduled
(version skew, configuration, feature gate, etc.). kube-controller-manager
detects this and tries to make the Pod runnable by reserving the required
ResourceClaims. However, this only works if those were allocated by
the scheduler for some other pod.
-->
這種情況也可能發生在 Pod 被調度時調度器中未啓用動態資源分配支持的時候（原因可能是版本偏差、配置、特性門控等）。
kube-controller-manager 能夠檢測到這一點，並嘗試通過預留所需的一些 ResourceClaim 來使 Pod 可運行。
然而，這只有在這些 ResourceClaim 已經被調度器爲其他 Pod 分配的情況下才有效。

<!--
It is better to avoid bypassing the scheduler because a Pod that is assigned to a node
blocks normal resources (RAM, CPU) that then cannot be used for other Pods
while the Pod is stuck. To make a Pod run on a specific node while still going
through the normal scheduling flow, create the Pod with a node selector that
exactly matches the desired node:
-->
繞過調度器並不是一個好的選擇，因爲分配給節點的 Pod 會鎖住一些正常的資源（RAM、CPU），
而這些資源在 Pod 被卡住時無法用於其他 Pod。爲了讓一個 Pod 在特定節點上運行，
同時仍然通過正常的調度流程進行，請在創建 Pod 時使用與期望的節點精確匹配的節點選擇算符：

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
你還可以在准入時變更傳入的 Pod，取消設置 `.spec.nodeName` 字段，並改爲使用節點選擇算符。

<!--
## DRA beta features {#beta-features}

The following sections describe DRA features that are available in the Beta
[feature stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
For more information, see
[Set up DRA in the cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/).
-->
## DRA Beta 特性  {#beta-features}

以下各小節闡述了可以在 Beta
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
中獲取到的 DRA 特性。

欲瞭解更多信息，
請參閱[在集羣中安裝 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)。

<!--
### Admin access {#admin-access}
-->
### 管理性質的訪問 {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

<!--
You can mark a request in a ResourceClaim or ResourceClaimTemplate as having
privileged features for maintenance and troubleshooting tasks. A request with
admin access grants access to in-use devices and may enable additional
permissions when making the device available in a container:
-->
你可以在 ResourceClaim 或 ResourceClaimTemplate
中標記一個請求爲具有用於維護和故障排除任務的特權特性。
具有管理員訪問權限的請求可以允許用戶訪問使用中的設備，
並且在將設備提供給容器時可能授權一些額外的訪問權限：

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
如果此特性被禁用，創建此類 ResourceClaim 時將自動移除 `adminAccess` 字段。

管理性質訪問是一種特權模式，在多租戶集羣中不應該對普通用戶開放。
從 Kubernetes v1.33 開始，在標有 `resource.k8s.io/admin-access: "true"`（區分大小寫）
的命名空間中只有被授權創建 ResourceClaim 或 ResourceClaimTemplate
對象的用戶才能使用 `adminAccess` 字段。這確保了非管理員用戶不能濫用此特性。
從 Kubernetes v1.34 開始，此標籤已被更新爲 `resource.kubernetes.io/admin-access: "true"`。

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

以下各小節描述可供使用的 Alpha 階段 DRA 特性。
要使用這些特性，你還必須開啓 DynamicResourceAllocation 特性門控和 DRA
{{< glossary_tooltip text="API 組" term_id="api-group" >}} 以在集羣中安裝 DRA。

更多信息請參閱[在集羣中安裝 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)。

<!--
### Extended resource allocation by DRA {#extended-resource}
-->
### 使用 DRA 分配擴展資源 {#extended-resource}

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
你可以爲 DeviceClass 提供一個擴展資源名稱。對於此擴展資源的請求，
此後調度器會從該類的設備中選擇匹配的設備。這允許用戶在 Pod
中繼續使用擴展資源請求通過設備插件來申請擴展資源，或是 DRA 設備。
在集羣的單個節點上，同一個擴展資源要麼通過設備插件，要麼通過 DRA 提供。
在同一個集羣內，同一個擴展資源在某些節點上可以由設備插件提供，而在其他節點上由 DRA 提供。

在下面的例子中，該 DeviceClass 的 extendedResourceName 被賦值爲 `example.com/gpu`。
那麼如果一個 Pod 請求了 `example.com/gpu: 2` 的擴展資源，
它就會被調度到具有兩個或更多個具有符合該 DeviceClass 設備的節點上。

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
另外，用戶可以使用一種特殊的擴展資源來分配設備，而不一定需要顯式創建 ResourceClaim。
你可以使用擴展資源名稱前綴 `deviceclass.resource.kubernetes.io/` 並加上 DeviceClass 的名稱。
這種方式適用於任意 DeviceClass，即使該類未顯式指定擴展資源名稱。
生成的 ResourceClaim 將包含一個請求，要求按照 `ExactCount` 模式，
從該 DeviceClass 中分配指定數量的設備。

通過 DRA 來分配擴展資源是一個 *Alpha 特性*，它只有當 
kube-apiserver，kube-scheduler 和 kubelet 中啓用了 `DRAExtendedResource`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
時，該特性纔會被啓用。

<!--
### Partitionable devices {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Devices represented in DRA don't necessarily have to be a single unit connected to a single machine,
but can also be a logical device comprised of multiple devices connected to multiple machines. These
devices might consume overlapping resources of the underlying phyical devices, meaning that when one
logical device is allocated other devices will no longer be available.
-->
### 可切分設備  {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

DRA 中表示的設備不一定必須是連接到單個機器的單個單元，
也可以是由連接到多個機器的多個設備組成的邏輯設備。
這些設備可能會消耗底層物理設備的重疊資源，這意味着當一個邏輯設備被分配時，
其他設備將不再可用。

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
在 ResourceSlice API 中，這類設備表示爲命名 CounterSet 列表，每個 CounterSet 包含一組命名計數器。
計數器表示物理設備上可供通過 DRA 發佈的邏輯設備使用的資源。

邏輯設備可以指定 ConsumesCounter 列表。每個條目包含對某個 CounterSet 的引用和一組命名計數器及其消耗量。
因此，要使設備可被分配，所引用的 CounterSet 必須具有設備引用的計數器所需的足夠數量。

以下是兩個設備的示例，每個設備從具有 8Gi 內存的共享計數器中消耗 6Gi 內存。
因此，在任何時間點只能分配其中一個設備。調度器處理這種情況，
對使用者來說是透明的，因爲 ResourceClaim API 不受影響。

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
可切分設備是一個 *Alpha 特性*，它只有當
kube-apiserver 和 kube-scheduler 中啓用了 `DRAPartitionableDevices`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
時，該特性纔會被啓用。


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
可消耗容量特性允許同一臺設備被多個獨立的 ResourceClaim 同時使用，
由 Kubernetes 調度器負責管理每個聲明消耗了多少設備容量。
這一機制類似於多個 Pod 可以共享同一節點上的資源，
多個 ResourceClaim 也可以共享同一設備上的資源。

設備驅動程序可以在 ResourceSlice 的 `.spec.devices` 中設置
`allowMultipleAllocations` 字段，以允許將該設備分配給多個獨立的 ResourceClaim，
或分配給同一 ResourceClaim 中的多個請求。

用戶可以在 ResourceClaim 的 `spec.devices.requests` 中新增的 `capacity` 字段進行設置，
以指定每次分配所需的設備資源容量。

<!--
For the device that allows multiple allocations, the requested capacity is drawn from — or consumed from — its total capacity, a concept known as **consumable capacity**.
Then, the scheduler ensures that the aggregate consumed capacity across all claims does not exceed the device’s overall capacity. Furthermore, driver authors can use the `requestPolicy` constraints on individual device capacities to control how those capacities are consumed. For example, the driver author can specify that a given capacity is only consumed in increments of 1Gi.
-->
對於允許多次分配的設備，請求的容量將從設備的總容量中提取或消耗，
這一機制被稱爲**可消耗容量（Consumable Capacity）**。
隨後，調度器會確保所有聲明合計消耗的容量總和不會超過設備的整體容量。
此外，驅動程序的作者還可以通過在單個設備的容量上使用 `requestPolicy`
約束來控制這些容量的消耗方式。
例如，驅動作者可以規定某個資源的容量只能以 1Gi 爲單位進行消耗。

<!--
Here is an example of a network device which allows multiple allocations and contains
a consumable bandwidth capacity.
-->
下面是一個支持多次分配、並具有可消耗帶寬容量的網絡設備的示例。

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
可消耗容量能被請求，如下例所示。

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
分配的結果將包含已消耗的容量和份額的標識符。

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
在這個例子裏，選中的是一個可多次分配的設備。
但是實際上，任何不小於所請求的 1G 帶寬的 `resource.example.com` 類型的設備都可以滿足該需求。
如果選中的是一個不可多次分配的設備，那麼此次分配將導致整個設備被佔用。
若要強制僅使用可多次分配的設備，你可以使用 CEL 表達式
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
### 設備污點和容忍度  {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

設備污點類似於節點污點：污點具有字符串形式的鍵、字符串形式的值和效果。
效果應用於使用帶污點設備的 ResourceClaim 以及引用該 ResourceClaim 的所有 Pod。
"NoSchedule" 效果會阻止調度這些 Pod。
在嘗試分配 ResourceClaim 時會忽略帶污點的設備，
因爲使用它們會阻止 Pod 的調度。

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
"NoExecute" 效果隱含 "NoSchedule" 效果，此外還會導致已調度的所有 Pod 被驅逐。
這種驅逐是通過 kube-controller-manager 中的設備污點驅逐控制器刪除受影響的 Pod 來實現的。

ResourceClaim 可以容忍污點。如果污點被容忍，其效果將不會生效。
空容忍度匹配所有污點。容忍度可以限制爲特定效果和/或匹配特定鍵/值對。
容忍度可以檢查某個鍵是否存在，無論其值是什麼，也可以檢查某個鍵是否具有特定值。
有關此匹配機制的更多信息，請參閱[節點污點概念](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration#concepts)。

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
通過容忍污點一段時間可以延遲驅逐。該延遲從污點添加到設備時開始，
並被記錄在污點的字段中。

如上所述，污點也適用於在節點上分配"所有"設備的 ResourceClaim。
所有設備必須不帶污點，或者必須容忍其所有污點。
分配具有管理員訪問權限的設備（[上文](#admin-access)所述）也不例外。
使用該模式的管理員必須明確容忍所有污點才能訪問帶污點的設備。

<!--
Device taints and tolerations is an *alpha feature* and only enabled when the
`DRADeviceTaints` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver, kube-controller-manager and kube-scheduler.
To use DeviceTaintRules, the `resource.k8s.io/v1alpha3` API version must be
enabled.
-->
設備污點和容忍度是一個 *Alpha 特性*，它只有當
kube-apiserver、kube-controller-manager 和 kube-scheduler 中啓用了 `DRADeviceTaints`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
時，該特性纔會被啓用。
要使用 DeviceTaintRules，必須啓用 `resource.k8s.io/v1alpha3` API 版本。

<!--
You can add taints to devices in the following ways, by using the
DeviceTaintRule API kind.
-->
你可以通過以下方式使用 DeviceTaintRule API 類型向設備添加污點。

<!--
#### Taints set by the driver

A DRA driver can add taints to the device information that it publishes in ResourceSlices.
Consult the documentation of a DRA driver to learn whether the driver uses taints and what
their keys and values are.
-->
#### 由驅動程序設置的污點 {#taints-set-by-the-driver}

DRA 驅動程序可以爲其在 ResourceSlice 中發佈的設備信息添加污點。
請查閱 DRA 驅動程序的文檔，瞭解驅動程序是否使用污點以及它們的鍵和值是什麼。

<!--
#### Taints set by an admin

An admin or a control plane component can taint devices without having to tell
the DRA driver to include taints in its device information in ResourceSlices. They do that by
creating DeviceTaintRules. Each DeviceTaintRule adds one taint to devices which
match the device selector. Without such a selector, no devices are tainted. This
makes it harder to accidentally evict all pods using ResourceClaims when leaving out
the selector by mistake.
-->
#### 由管理員設置的污點 {#taints-set-by-an-admin}

管理員或控制平面組件可以在不告訴 DRA 驅動程序在其 ResourceSlice
中的設備信息中包含污點的情況下爲設備添加污點。他們通過創建 DeviceTaintRule 來實現這一點。
每個 DeviceTaintRule 爲匹配設備選擇算符的設備添加一個污點。
如果沒有指定這樣的選擇算符，則不會爲任何設備添加污點。這使得在錯誤地遺漏選擇算符時，
意外驅逐所有使用 ResourceClaim 的 Pod 變得更加困難。

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
可以通過提供 DeviceClass、驅動程序（driver）、資源池（pool）和/或設備的名稱來選擇設備。
DeviceClass 選擇該 DeviceClass 中的選擇算符所選擇的所有設備。
通過僅使用驅動程序名稱，管理員可以爲該驅動程序管理的所有設備添加污點，
例如在對整個集羣中的該驅動程序進行某種維護時。
如果驅動程序管理節點本地設備，添加池名稱可以將污點限制爲單個節點。

最後，添加設備名稱可以選擇一個特定設備。如果需要，設備名稱和池名稱也可以單獨使用。
例如，鼓勵負責製備節點本地設備的驅動程序使用節點名稱作爲其池名稱。
然後使用該池名稱添加污點會自動爲節點上的所有設備添加污點。

<!--
Drivers might use stable names like "gpu-0" that hide which specific device is
currently assigned to that name. To support tainting a specific hardware
instance, CEL selectors can be used in a DeviceTaintRule to match a vendor-specific
unique ID attribute, if the driver supports one for its hardware.

The taint applies as long as the DeviceTaintRule exists. It can be modified and
and removed at any time. Here is one example of a DeviceTaintRule for a fictional
DRA driver:
-->
驅動程序可能使用像 "gpu-0" 這樣的穩定名稱，
這些名稱隱藏了當前分配給該名稱的特定設備。
爲了支持爲特定硬件實例添加污點，
可以在 DeviceTaintRule 中使用 CEL 選擇算符來匹配特定於供應商的唯一 ID 屬性，
前提是驅動程序支持硬件對應的這類屬性。

只要 DeviceTaintRule 存在，污點就會生效。它可以隨時被修改和刪除。
以下是一個虛構的 DRA 驅動程序的 DeviceTaintRule 示例：

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
  # 這個特定驅動程序的整個硬件安裝已損壞。
  # 驅逐所有 Pod 並且不調度新的 Pod。
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
### 設備綁定狀況 {#device-binding-conditions}

{{< feature-state feature_gate_name="DRADeviceBindingConditions" >}}

<!--
Device Binding Conditions allow the Kubernetes scheduler to delay Pod binding until
external resources, such as fabric-attached GPUs or reprogrammable FPGAs, are confirmed
to be ready.
-->
設備綁定狀況允許 Kubernetes 調度器在確認外部資源 
（例如光纖掛接下的 GPU 或可重編程的 FPGA）確認就緒之前延遲對 Pod 的綁定操作。

<!--
This waiting behavior is implemented in the 
[PreBind phase](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)
of the scheduling framework.
During this phase, the scheduler checks whether all required device conditions are
satisfied before proceeding with binding.

This improves scheduling reliability by avoiding premature binding and enables coordination
with external device controllers.
-->
這種等待機制是在調度框架的 
[PreBind 階段](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)
實現的。
在該階段，調度器會在繼續執行綁定之前檢查所有所需的設備狀況是否已滿足。

這種機制通過避免過早綁定以及支持與外部設備控制器進行協調的方式，提高了調度的可靠性。

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
要使用此特性，設備驅動程序（通常由驅動程序所有者管理）必須在 `ResourceSlice` 的 
`Device` 部分中發佈以下字段。 此外爲了讓調度器能夠考慮這些字段，集羣管理員必須啓用 
`DRADeviceBindingConditions` 和 `DRAResourceClaimDeviceStatus` 特性門控。

- `bindingConditions`：一個狀況類型的列表，在 Pod 能被綁定之前，
  所關聯的 ResourceClaim 的 status.conditions 字段中的這些狀況類型必須被設置爲 True。
  這些狀況通常表示設備就緒信號，例如 "DeviceAttached" 或 "DeviceInitialized"。

- `bindingFailureConditions`：一個狀況類型的列表，如果在其所關聯的 
  ResourceClaim 的 status.conditions 字段中對應的狀況類型被設置爲 True，
  則代表了一種失敗的狀態。如果其中的任何一個狀況被設置爲 True，
  調度器將中止綁定，並重新調度該 Pod。

- `bindsToNode`：若設置爲 `true`，調度器會將所選節點的名稱記錄到 ResourceClaim 的
  `status.allocation.nodeSelector` 字段中。
  這不會影響 Pod 的 `spec.nodeSelector`，而是在 ResourceClaim 內部設置一個節點選擇器，
  從而外部控制器能夠用它來執行一個節點相關的操作，例如設備掛載或準備。

<!--
All condition types listed in bindingConditions and bindingFailureConditions are evaluated
from the `status.conditions` field of the ResourceClaim.
External controllers are responsible for updating these conditions using standard Kubernetes
condition semantics (`type`, `status`, `reason`, `message`, `lastTransitionTime`).
-->
所有 bindingConditions 和 bindingFailureConditions 中列出的狀況類型，都會根據
ResourceClaim 的 `status.conditions` 字段中進行評估。
外部控制器負責使用標準的 Kubernetes 狀況語義
（如 `type`、`status`、`reason`、`message`、`lastTransitionTime`）
對這些狀況進行更新。

<!--
The scheduler waits up to **600 seconds** for all `bindingConditions` to become `True`.
If the timeout is reached or any `bindingFailureConditions` are `True`, the scheduler
clears the allocation and reschedules the Pod.
-->
調度器會等待`bindingConditions` 變爲 `True`，但最長不超過 **600秒**。
如果發生超時或者任意一個 `bindingFailureConditions` 變爲 `True`,
那麼調度器將清除當前的分配並重新調度該 Pod。

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
此 ResourceSlice 示例具有以下屬性：

- 該 ResourceSlice 針對的是帶有標籤 `accelerator-type=high-performance` 的節點，
  因此調度器僅會使用符合條件的節點的一個特定集合。
- 調度器會從選定的組中選擇一個節點（例如 `node-3`），
  並將該節點名稱寫入 ResourceClaim 的 `status.allocation.nodeSelector` 字段。
- `dra.example.com/is-prepared`綁定狀況表示設備 `gpu-1` 在執行綁定前必須準備就緒，
  即 `is-prepared` 狀況必須有一個處於 `True`的狀態。
- 如果設備 `gpu-1` 的準備過程中發生失敗，即 `preparing-failed` 狀況有一個處於`True`的狀態，
  那麼調度器將放棄進行綁定。
- 調度器會等待最多 600 秒，直到此設備變爲就緒狀態。
- 外部控制器可以使用 ResourceClaim 中的節點選擇器，
  以在選定節點上執行特定於該節點的初始化或配置操作。


## {{% heading "whatsnext" %}}

<!-- 
- [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Allocate devices to workloads using DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP.
-->
- [在集羣中安裝 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)
- [使用 DRA 爲工作負載分配設備](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
- 瞭解更多該設計的信息，
  參閱[使用結構化參數的動態資源分配 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)。