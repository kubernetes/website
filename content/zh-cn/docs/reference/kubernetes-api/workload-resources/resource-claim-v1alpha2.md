---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha2"
  import: "k8s.io/api/resource/v1alpha2"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim 描述资源使用者需要哪些资源。"
title: "ResourceClaim v1alpha2"
weight: 15
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha2"
  import: "k8s.io/api/resource/v1alpha2"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim describes which resources are needed by a resource consumer."
title: "ResourceClaim v1alpha2"
weight: 15
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1alpha2`

`import "k8s.io/api/resource/v1alpha2"`

## ResourceClaim {#ResourceClaim}

<!--
ResourceClaim describes which resources are needed by a resource consumer. Its status tracks whether the resource has been allocated and what the resulting attributes are.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.
-->
ResourceClaim 描述资源使用者需要哪些资源。它的状态跟踪资源是否已被分配以及产生的属性是什么。

这是一个 Alpha 级别的资源类型，需要启用 DynamicResourceAllocation 特性门控。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha2

- **kind**: ResourceClaim

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。

<!--
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), required

  Spec describes the desired attributes of a resource that then needs to be allocated. It can only be set once when creating the ResourceClaim.

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  Status describes whether the resource is available and with which attributes.
-->
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaimSpec" >}}">ResourceClaimSpec</a>)，必需

  spec 描述了需要被分配的资源所需的属性。它只能在创建 ResourceClaim 时设置一次。

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  status 描述资源是否可用以及具有哪些属性。

## ResourceClaimSpec {#ResourceClaimSpec}

<!--
ResourceClaimSpec defines how a resource is to be allocated.
-->
ResourceClaimSpec 定义资源如何被分配。

<hr>

<!--
- **resourceClassName** (string), required

  ResourceClassName references the driver and additional parameters via the name of a ResourceClass that was created as part of the driver deployment.

- **allocationMode** (string)

  Allocation can start immediately or when a Pod wants to use the resource. "WaitForFirstConsumer" is the default.
-->
- **resourceClassName** (string)，必需

  resourceClassName 通过部署驱动时创建的 ResourceClass 名称来引用驱动和附加参数。

- **allocationMode** (string)

  分配可以立即开始或在 Pod 想要使用资源时开始。"WaitForFirstConsumer" 是默认值。

<!--
- **parametersRef** (ResourceClaimParametersReference)

  ParametersRef references a separate object with arbitrary parameters that will be used by the driver when allocating a resource for the claim.

  The object must be in the same namespace as the ResourceClaim.

  <a name="ResourceClaimParametersReference"></a>
  _ResourceClaimParametersReference contains enough information to let you locate the parameters for a ResourceClaim. The object must be in the same namespace as the ResourceClaim._
-->
- **parametersRef** (ResourceClaimParametersReference)

  parametersRef 引用一个单独的对象，包含驱动为申领分配资源时将使用的任意参数。

  此对象必须与 ResourceClaim 在同一个名字空间中。

  <a name="ResourceClaimParametersReference"></a>
  **ResourceClaimParametersReference 包含足够信息，便于你定位 ResourceClaim 的参数。
  该对象必须与 ResourceClaim 在相同的名字空间中。**

  <!--
  - **parametersRef.kind** (string), required

    Kind is the type of resource being referenced. This is the same value as in the parameter object's metadata, for example "ConfigMap".

  - **parametersRef.name** (string), required

    Name is the name of resource being referenced.

  - **parametersRef.apiGroup** (string)

    APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.
  -->

  - **parametersRef.kind** (string)，必需

    kind 是所引用资源的类别。这个值与参数对象元数据中的值相同，例如 "ConfigMap"。

  - **parametersRef.name** (string)，必需

    name 是所引用资源的名称。

  - **parametersRef.apiGroup** (string)

    apiGroup 是所引用资源的组。对于核心 API 而言此值为空。
    字段值与创建资源时所用的 apiVersion 中的组匹配。

## ResourceClaimStatus {#ResourceClaimStatus}

<!--
ResourceClaimStatus tracks whether the resource has been allocated and what the resulting attributes are.
-->
ResourceClaimStatus 跟踪资源是否已被分配以及产生的属性是什么。

<hr>

<!--
- **allocation** (AllocationResult)

  Allocation is set by the resource driver once a resource or set of resources has been allocated successfully. If this is not specified, the resources have not been allocated yet.

  <a name="AllocationResult"></a>
  _AllocationResult contains attributes of an allocated resource._
-->
- **allocation** (AllocationResult)

  一旦某资源或资源集已被成功分配，资源驱动就会设置 allocation 的值。
  如果此项未被设置，则表示资源尚未被分配。

  <a name="AllocationResult"></a>
  **AllocationResult 包含已分配资源的属性。**

  <!--
  - **allocation.availableOnNodes** (NodeSelector)

    This field will get set by the resource driver after it has allocated the resource to inform the scheduler where it can schedule Pods using the ResourceClaim.

    Setting this field is optional. If null, the resource is available everywhere.

    <a name="NodeSelector"></a>
    _A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms._
  -->

  - **allocation.availableOnNodes** (NodeSelector)

    在资源驱动完成资源分配之后，将设置此字段以通知调度器可以将使用了 ResourceClaim 的 Pod 调度到哪里。

    设置此字段是可选的。如果字段值为空，表示资源可以在任何地方访问。

    <a name="NodeSelector"></a>
    **节点选择算符表示对一组节点执行一个或多个标签查询的结果的并集；
    也就是说，它表示由节点选择算符条件表示的选择算符的逻辑或计算结果。**

    <!--
    - **allocation.availableOnNodes.nodeSelectorTerms** ([]NodeSelectorTerm), required

      Required. A list of node selector terms. The terms are ORed.

      <a name="NodeSelectorTerm"></a>
      _A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm._
    -->

    - **allocation.availableOnNodes.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

      必需。节点选择算符条件的列表。这些条件以逻辑或进行计算。

      <a name="NodeSelectorTerm"></a>
      **一个 null 或空的节点选择算符条件不会与任何对象匹配。条件中的要求会按逻辑与的关系来计算。
      TopologySelectorTerm 类别实现了 NodeSelectorTerm 的子集。**

      - **allocation.availableOnNodes.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        <!--
        A list of node selector requirements by node's labels.
        -->

        基于节点标签所设置的节点选择算符要求的列表。

      - **allocation.availableOnNodes.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        <!--
        A list of node selector requirements by node's fields.
        -->

        基于节点字段所设置的节点选择算符要求的列表。

  - **allocation.resourceHandles** ([]ResourceHandle)

    <!--
    _Atomic: will be replaced during a merge_

    ResourceHandles contain the state associated with an allocation that should be maintained throughout the lifetime of a claim. Each ResourceHandle contains data that should be passed to a specific kubelet plugin once it lands on a node. This data is returned by the driver after a successful allocation and is opaque to Kubernetes. Driver documentation may explain to users how to interpret this data if needed.
    -->

    **原子性：将在合并期间被替换**

    resourceHandles 包含应在申领的整个生命期中保持的、与某资源分配所关联的状态。
    每个 resourceHandle 包含应向特定 kubelet 插件传递的数据，
    一旦资源落到某具体节点上，这些数据就会被传递给该插件。
    此数据将在成功分配后由驱动返回，并对 Kubernetes 不透明。
    必要时驱动文档可能会向用户阐述如何解读这些数据。

    <!--
    Setting this field is optional. It has a maximum size of 32 entries. If null (or empty), it is assumed this allocation will be processed by a single kubelet plugin with no ResourceHandle data attached. The name of the kubelet plugin invoked will match the DriverName set in the ResourceClaimStatus this AllocationResult is embedded in.

    <a name="ResourceHandle"></a>
    _ResourceHandle holds opaque resource data for processing by a specific kubelet plugin._
    -->

    设置此字段是可选的。它最大可以有 32 个条目。如果为 null（或为空），
    则假定此分配将由某个确定的 kubelet 插件处理，
    不会附加 resourceHandle 数据。所调用的 kubelet 插件的名称将与嵌入此
    AllocationResult 的 ResourceClaimStatus 中设置的 driverName 匹配。

    <a name="ResourceHandle"></a>
    **resourceHandle 保存不透明的资源数据，以供特定的 kubelet 插件处理。**

    <!--
    - **allocation.resourceHandles.data** (string)

      Data contains the opaque data associated with this ResourceHandle. It is set by the controller component of the resource driver whose name matches the DriverName set in the ResourceClaimStatus this ResourceHandle is embedded in. It is set at allocation time and is intended for processing by the kubelet plugin whose name matches the DriverName set in this ResourceHandle.

      The maximum size of this field is 16KiB. This may get increased in the future, but not reduced.
    -->

    - **allocation.resourceHandles.data** (string)

      data 包含与此 resourceHandle 关联的不透明数据。
      data 由资源驱动中的控制器组件设置，该驱动的名字与嵌入此 resourceHandle 的
      ResourceClaimStatus 中设置的 driverName 相同。
      data 在分配时进行设置，供 kubelet 插件处理；所指的插件的名称与此 resourceHandle
      所设置的 driverName 相同。

      该字段的最大值为 16KiB。此值在未来可能会增加，但不会减少。

    - **allocation.resourceHandles.driverName** (string)

      <!--
      DriverName specifies the name of the resource driver whose kubelet plugin should be invoked to process this ResourceHandle's data once it lands on a node. This may differ from the DriverName set in ResourceClaimStatus this ResourceHandle is embedded in.
      -->

      driverName 指定资源驱动的名称；一旦 resourceHandle 落到某具体节点，
      就应调用该驱动对应的 kubelet 插件来处理此数据。
      字段值可能与嵌入此 resourceHandle 的 ResourceClaimStatus 中设置的 driverName 不同。

  - **allocation.shareable** (boolean)

    <!--
    Shareable determines whether the resource supports more than one consumer at a time.
    -->

    shareable 确定资源是否同时支持多个使用者。

<!--
- **deallocationRequested** (boolean)

  DeallocationRequested indicates that a ResourceClaim is to be deallocated.

  The driver then must deallocate this claim and reset the field together with clearing the Allocation field.

  While DeallocationRequested is set, no new consumers may be added to ReservedFor.
-->
- **deallocationRequested** (boolean)
  
  deallocationRequested 表示某 ResourceClaim 将被取消分配。

  出现请求后，驱动必须释放此申领，重置此字段并清除 allocation 字段。

  在 deallocationRequested 被设置时，不能将新的使用者添加到 reservedFor。

<!--
- **driverName** (string)

  DriverName is a copy of the driver name from the ResourceClass at the time when allocation started.

- **reservedFor** ([]ResourceClaimConsumerReference)

  _Map: unique values on key uid will be kept during a merge_

  ReservedFor indicates which entities are currently allowed to use the claim. A Pod which references a ResourceClaim which is not reserved for that Pod will not be started.
-->
- **driverName** (string)

  driverName 是在确定了分配之后，从 ResourceClass 复制而来的驱动名称。

- **reservedFor** ([]ResourceClaimConsumerReference)

  **Map：合并期间根据键 uid 保留不重复的值**

  reservedFor 标明目前哪些实体允许使用申领。如果引用未为某个 Pod 预留的 ResourceClaim，则该 Pod 将不会启动。

  <!--
  There can be at most 32 such reservations. This may get increased in the future, but not reduced.

  <a name="ResourceClaimConsumerReference"></a>
  _ResourceClaimConsumerReference contains enough information to let you locate the consumer of a ResourceClaim. The user must be a resource in the same namespace as the ResourceClaim._
  -->

  最多可以有 32 个这样的预留。这一限制可能会在未来放宽，但不会减少。

  <a name="ResourceClaimConsumerReference"></a>
  **ResourceClaimConsumerReference 包含足够的信息以便定位 ResourceClaim 的使用者。
  用户必须是与 ResourceClaim 在同一名字空间中的资源。**

  <!--
  - **reservedFor.name** (string), required

    Name is the name of resource being referenced.

  - **reservedFor.resource** (string), required

    Resource is the type of resource being referenced, for example "pods".

  - **reservedFor.uid** (string), required

    UID identifies exactly one incarnation of the resource.

  - **reservedFor.apiGroup** (string)

    APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.
  -->
  
  - **reservedFor.name** (string)，必需

    name 是所引用资源的名称。

  - **reservedFor.resource** (string)，必需

    resource 是所引用资源的类别，例如 "pods"。

  - **reservedFor.uid** (string)，必需

    uid 用于唯一标识资源的某实例。

  - **reservedFor.apiGroup** (string)

    apiGroup 是所引用资源的组。对于核心 API 而言此值为空。
    字段值与创建资源时所用的 apiVersion 中的组匹配。

## ResourceClaimList {#ResourceClaimList}

<!--
ResourceClaimList is a collection of claims.
-->
ResourceClaimList 是申领的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha2

- **kind**: ResourceClaimList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>), required

  Items is the list of resource claims.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>)，必需

  items 是资源申领的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified ResourceClaim

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 ResourceClaim

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Response
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ResourceClaim

#### HTTP Request
-->
### `get` 读取指定 ResourceClaim 的状态

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Response
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaim

#### HTTP Request
-->
### `list` 列出或监视 ResourceClaim 类别的对象

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaim

#### HTTP Request
-->
### `list` 列出或监视 ResourceClaim 类别的对象

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha2/resourceclaims

<!--
#### Parameters

- **allowWatchBookmarks** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 参数

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

<!--
### `create` create a ResourceClaim

#### HTTP Request
-->
### `create` 创建 ResourceClaim

#### HTTP 请求

POST /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ResourceClaim

#### HTTP Request
-->
### `update` 替换指定的 ResourceClaim

#### HTTP 请求

PUT /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ResourceClaim

#### HTTP Request
-->
### `update` 替换指定 ResourceClaim 的状态

#### HTTP 请求

PUT /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ResourceClaim

#### HTTP Request
-->
### `patch` 部分更新指定的 ResourceClaim

#### HTTP 请求

PATCH /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ResourceClaim

#### HTTP Request
-->
### `patch` 部分更新指定 ResourceClaim 的状态

#### HTTP 请求

PATCH /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims/{name}/status

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

<!--
### `delete` delete a ResourceClaim

#### HTTP Request
-->
### `delete` 删除 ResourceClaim

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims/{name}

<!--
#### Parameters

- **name** (_in path_): string, required

  name of the ResourceClaim

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需

  ResourceClaim 的名称。

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-v1alpha2#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ResourceClaim

#### HTTP Request
-->
### `deletecollection` 删除 ResourceClaim 的集合

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha2/namespaces/{namespace}/resourceclaims

<!--
#### Parameters

- **namespace** (_in path_): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (_in query_): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (_in query_): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 参数

- **namespace**（**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
