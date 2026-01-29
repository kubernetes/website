---
api_metadata:
  apiVersion: "resource.k8s.io/v1beta1"
  import: "k8s.io/api/resource/v1beta1"
  kind: "ResourceSlice"
content_type: "api_reference"
description: "ResourceSlice 表示一個或多個資源，這些資源位於同一個驅動所管理的、彼此相似的資源構成的資源池。"
title: "ResourceSlice v1beta1"
weight: 17
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1beta1"
  import: "k8s.io/api/resource/v1beta1"
  kind: "ResourceSlice"
content_type: "api_reference"
description: "ResourceSlice represents one or more resources in a pool of similar resources, managed by a common driver."
title: "ResourceSlice v1beta1"
weight: 17
auto_generated: true
-->

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: resource.k8s.io/v1beta1`

`import "k8s.io/api/resource/v1beta1"`

<!--
## ResourceSlice {#ResourceSlice}

ResourceSlice represents one or more resources in a pool of similar resources, managed by a common driver. A pool may span more than one ResourceSlice, and exactly how many ResourceSlices comprise a pool is determined by the driver.

At the moment, the only supported resources are devices with attributes and capacities. Each device in a given pool, regardless of how many ResourceSlices, must have a unique name. The ResourceSlice in which a device gets published may change over time. The unique identifier for a device is the tuple \<driver name>, \<pool name>, \<device name>.
-->
## ResourceSlice {#ResourceSlice}

ResourceSlice 表示一個或多個資源，這些資源位於同一個驅動所管理的、彼此相似的資源構成的資源池。
一個池可以包含多個 ResourceSlice，一個池包含多少個 ResourceSlice 由驅動確定。

目前，所支持的資源只能是具有屬性和容量的設備。
給定池中的每個設備，無論有多少個 ResourceSlice，必須具有唯一名稱。
發佈設備的 ResourceSlice 可能會隨着時間的推移而變化。
設備的唯一標識符是元組 \<驅動名稱\>、\<池名稱\>、\<設備名稱\>。

<!--
Whenever a driver needs to update a pool, it increments the pool.Spec.Pool.Generation number and updates all ResourceSlices with that new number and new resource definitions. A consumer must only use ResourceSlices with the highest generation number and ignore all others.

When allocating all resources in a pool matching certain criteria or when looking for the best solution among several different alternatives, a consumer should check the number of ResourceSlices in a pool (included in each ResourceSlice) to determine whether its view of a pool is complete and if not, should wait until the driver has completed updating the pool.
-->
每當驅動需要更新池時，pool.spec.pool.generation 編號加一，
並用新的編號和新的資源定義來更新所有 ResourceSlice。
資源使用者必須僅使用 generation 編號最大的 ResourceSlice，並忽略所有其他 ResourceSlice。

從池中分配符合某些條件的所有資源或在多個不同分配方案間尋找最佳方案時，
資源使用者應檢查池中的 ResourceSlice 數量（包含在每個 ResourceSlice 中），
以確定其對池的視圖是否完整，如果不完整，則應等到驅動完成對池的更新。

<!--
For resources that are not local to a node, the node name is not set. Instead, the driver may use a node selector to specify where the devices are available.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.
-->
對於非某節點本地的資源，節點名稱不會被設置。
驅動可以使用節點選擇算符來給出設備的可用位置。

此特性爲 Alpha 級別，需要啓用 DynamicResourceAllocation 特性門控。

<hr>

- **apiVersion**: resource.k8s.io/v1beta1

- **kind**: ResourceSlice

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSliceSpec" >}}">ResourceSliceSpec</a>), required

  Contains the information published by the driver.
  
  Changing the spec automatically increments the metadata.generation number.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。

- **spec** (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSliceSpec" >}}">ResourceSliceSpec</a>)，必需

  包含驅動所發佈的資訊。
  
  更改 spec 會自動讓 metadata.generation 編號加一。

## ResourceSliceSpec {#ResourceSliceSpec}

<!--
ResourceSliceSpec contains the information published by the driver in one ResourceSlice.
-->
ResourceSliceSpec 包含驅動在一個 ResourceSlice 中所發佈的資訊。

<hr>

<!--
- **driver** (string), required

  Driver identifies the DRA driver providing the capacity information. A field selector can be used to list only ResourceSlice objects with a certain driver name.
  
  Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver. This field is immutable.
-->
- **driver** (string)，必需

  driver 標明提供容量資訊的 DRA 驅動。可以使用字段選擇算符僅列舉具有特定驅動名稱的 ResourceSlice 對象。
  
  字段值必須是 DNS 子域名並且應以驅動供應商所擁有的 DNS 域結尾。此字段是不可變更的。

<!--
- **pool** (ResourcePool), required

  Pool describes the pool that this ResourceSlice belongs to.

  <a name="ResourcePool"></a>
  *ResourcePool describes the pool that ResourceSlices belong to.*
-->
- **pool** (ResourcePool)，必需

  pool 描述 ResourceSlice 所屬的池。

  <a name="ResourcePool"></a>
  **ResourcePool 描述 ResourceSlice 所屬的池。**

  <!--
  - **pool.generation** (int64), required

    Generation tracks the change in a pool over time. Whenever a driver changes something about one or more of the resources in a pool, it must change the generation in all ResourceSlices which are part of that pool. Consumers of ResourceSlices should only consider resources from the pool with the highest generation number. The generation may be reset by drivers, which should be fine for consumers, assuming that all ResourceSlices in a pool are updated to match or deleted.
    
    Combined with ResourceSliceCount, this mechanism enables consumers to detect pools which are comprised of multiple ResourceSlices and are in an incomplete state.
  -->

  - **pool.generation** (int64)，必需

    generation 跟蹤池中隨時間發生的變化。每當驅動更改池中一個或多個資源的某些內容時，
    它必須爲所有屬於該池的 ResourceSlice 更改 generation。
    ResourceSlice 的使用者應僅考慮池中 generation 編號最大的資源。
    generation 可以被驅動重置，這對於使用者來說應該沒問題，
    前提是池中的所有 ResourceSlice 都已被更新以匹配，或都已被刪除。

    結合 resourceSliceCount，此機制讓使用者能夠檢測資源池包含多個
    ResourceSlice 且處於不完整狀態的情況。

  <!--
  - **pool.name** (string), required

    Name is used to identify the pool. For node-local devices, this is often the node name, but this is not required.
    
    It must not be longer than 253 characters and must consist of one or more DNS sub-domains separated by slashes. This field is immutable.
  -->

  - **pool.name** (string)，必需

    name 用作池的標識符。對於節點本地設備，字段值通常是節點名稱，但這不是必須的。

    此字段不得超過 253 個字符，並且必須由一個或多個用斜槓分隔的 DNS 子域組成。此字段是不可變更的。

  <!--
  - **pool.resourceSliceCount** (int64), required

    ResourceSliceCount is the total number of ResourceSlices in the pool at this generation number. Must be greater than zero.
    
    Consumers can use this to check whether they have seen all ResourceSlices belonging to the same pool.
  -->

  - **pool.resourceSliceCount** (int64)，必需

    resourceSliceCount 是池中帶有對應 generation 編號的 ResourceSlice 的總數。必須大於零。
    
    資源使用者可以使用此字段檢查他們是否能看到屬於同一池的所有 ResourceSlice。

<!--
- **allNodes** (boolean)

  AllNodes indicates that all nodes have access to the resources in the pool.
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set.
-->
- **allNodes** (boolean)

  allNodes 表示所有節點都可以訪問池中的資源。
  
  nodeName、nodeSelector 和 allNodes 之一必須被設置。

<!--
- **devices** ([]Device)

  *Atomic: will be replaced during a merge*
  
  Devices lists some or all of the devices in this pool.
  
  Must not have more than 128 entries.

  <a name="Device"></a>
  *Device represents one individual hardware instance that can be selected based on its attributes. Besides the name, exactly one field must be set.*
-->
- **devices** ([]Device)

  **原子性：將在合併期間被替換**
  
  devices 列舉池中的部分或全部設備。
  
  列表大小不得超過 128 個條目。

  <a name="Device"></a>
  **Device 表示可以基於其屬性進行選擇的一個單獨硬件實例。name 之外，必須且只能設置一個字段。**

  <!--
  - **devices.name** (string), required

    Name is unique identifier among all devices managed by the driver in the pool. It must be a DNS label.

  - **devices.basic** (BasicDevice)

    Basic defines one device instance.

    <a name="BasicDevice"></a>
    *BasicDevice defines one device instance.*
  -->

  - **devices.name** (string)，必需

    name 是池中由驅動所管理的設備的標識符，在所有設備中唯一。此字段值必須是 DNS 標籤。

  - **devices.basic** (BasicDevice)

    basic 定義一個設備實例。

    <a name="BasicDevice"></a>
    **BasicDevice 定義一個設備實例。**

    <!--
    - **devices.basic.attributes** (map[string]DeviceAttribute)

      Attributes defines the set of attributes for this device. The name of each attribute must be unique in that set.
      
      The maximum number of attributes and capacities combined is 32.

      <a name="DeviceAttribute"></a>
      *DeviceAttribute must have exactly one field set.*
    -->

    - **devices.basic.attributes** (map[string]DeviceAttribute)

      attributes 定義設備的屬性集。在該集合中每個屬性的名稱必須唯一。
      
      attributes 和 capacities 兩個映射合起來，最多包含 32 個屬性。

      <a name="DeviceAttribute"></a>
      **DeviceAttribute 必須設置一個字段。**

      <!--
      - **devices.basic.attributes.bool** (boolean)

        BoolValue is a true/false value.

      - **devices.basic.attributes.int** (int64)

        IntValue is a number.

      - **devices.basic.attributes.string** (string)

        StringValue is a string. Must not be longer than 64 characters.

      - **devices.basic.attributes.version** (string)

        VersionValue is a semantic version according to semver.org spec 2.0.0. Must not be longer than 64 characters.
      -->

      - **devices.basic.attributes.bool** (boolean)

        bool 字段值是 true/false。

      - **devices.basic.attributes.int** (int64)

        int 字段值是一個整數。

      - **devices.basic.attributes.string** (string)

        string 字段值是一個字符串。不得超過 64 個字符。

      - **devices.basic.attributes.version** (string)

        version 字段值是符合 semver.org 2.0.0 規範的語義版本。不得超過 64 個字符。

    <!--
    - **devices.basic.capacity** (map[string]DeviceCapacity)

      Capacity defines the set of capacities for this device. The name of each capacity must be unique in that set.
      
      The maximum number of attributes and capacities combined is 32.
    -->

    - **devices.basic.capacity** (map[string]DeviceCapacity)

      capacity 定義設備的容量集。在該集合中每個容量的名稱必須唯一。
      
      attributes 和 capacities 兩個映射合起來，最多包含 32 個屬性。

      <!--
      <a name="DeviceCapacity"></a>
      *DeviceCapacity describes a quantity associated with a device.*

      - **devices.basic.capacity.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>), required

        Value defines how much of a certain device capacity is available.
      -->
  
      <a name="DeviceCapacity"></a>
      **DeviceCapacity 描述與設備相關的數量。**

      - **devices.basic.capacity.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)，必需

        value 定義特定設備有多少容量是可用的。

<!--
- **nodeName** (string)

  NodeName identifies the node which provides the resources in this pool. A field selector can be used to list only ResourceSlice objects belonging to a certain node.
  
  This field can be used to limit access from nodes to ResourceSlices with the same node name. It also indicates to autoscalers that adding new nodes of the same type as some old node might also make new resources available.
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set. This field is immutable.
-->
- **nodeName** (string)

  nodeName 標明提供池中資源的某個節點。可以使用字段選擇算符僅列舉屬於特定節點的 ResourceSlice 對象。
  
  此字段可用於限制節點只能訪問具有相同節點名稱的 ResourceSlice。
  此字段還向負責添加相同類型節點的自動擴縮容程式指明，某些舊節點也能夠提供新資源供訪問。
  
  nodeName、nodeSelector 和 allNodes 三個字段必須設置其一。此字段是不可變更的。

<!--
- **nodeSelector** (NodeSelector)

  NodeSelector defines which nodes have access to the resources in the pool, when that pool is not limited to a single node.
  
  Must use exactly one term.
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
-->
- **nodeSelector** (NodeSelector)

  nodeSelector 定義當池所涉及的節點不止一個時，在哪些節點上可以訪問到資源。
  
  此字段中只能設置一個判定條件。
  
  nodeName、nodeSelector 和 allNodes 三個字段必須設置其一。

  <a name="NodeSelector"></a>
  **NodeSelector 表示在一組節點上一個或多個標籤查詢結果的並集；
  也就是說，它表示由節點選擇算符條件所表示的選擇算符的邏輯或計算結果。**

  <!--
  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

    *Atomic: will be replaced during a merge*
    
    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
  -->

  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

    **原子性：將在合併期間被替換**

    必需。節點選擇算符條件的列表。這些條件最終會被按照邏輯或操作組合起來。

    <a name="NodeSelectorTerm"></a>
    **未指定或空的節點選擇算符條件不會匹配任何對象。各個條件最少是按邏輯與運算組合到一起的。
    TopologySelectorTerm 類型實現了 NodeSelectorTerm 的一個子集。**

    <!--
    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's labels.

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's fields.
    -->

    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      **原子性：將在合併期間被替換**
      
      基於節點標籤的節點選擇算符要求的列表。

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      **原子性：將在合併期間被替換**
      
      基於節點字段的節點選擇算符要求的列表。

## ResourceSliceList {#ResourceSliceList}

<!--
ResourceSliceList is a collection of ResourceSlices.
-->
ResourceSliceList 是 ResourceSlice 的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1beta1

- **kind**: ResourceSliceList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata

- **items** ([]<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>), required

  Items is the list of resource ResourceSlices.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元資料。

- **items** ([]<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>)，必需

  items 是 ResourceSlice 資源的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified ResourceSlice

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 ResourceSlice

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta1/resourceslices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceSlice

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ResourceSlice 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceSlice

#### HTTP Request
-->
### `list` 列舉或監視類別爲 ResourceSlice 的對象

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta1/resourceslices

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSliceList" >}}">ResourceSliceList</a>): OK

401: Unauthorized

<!--
### `create` create a ResourceSlice

#### HTTP Request
-->
### `create` 創建 ResourceSlice

#### HTTP 請求

POST /apis/resource.k8s.io/v1beta1/resourceslices

<!--
#### Parameters

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ResourceSlice

#### HTTP Request
-->
### `update` 替換指定的 ResourceSlice

#### HTTP 請求

PUT /apis/resource.k8s.io/v1beta1/resourceslices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceSlice

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ResourceSlice 的名稱。

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ResourceSlice

#### HTTP Request
-->
### `patch` 部分更新指定的 ResourceSlice

#### HTTP 請求

PATCH /apis/resource.k8s.io/v1beta1/resourceslices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceSlice

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ResourceSlice 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized

<!--
### `delete` delete a ResourceSlice

#### HTTP Request
-->
### `delete` 刪除 ResourceSlice

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1beta1/resourceslices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceSlice

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ResourceSlice 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-slice-v1beta1#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ResourceSlice

#### HTTP Request
-->
### `deletecollection` 刪除 ResourceSlice 的集合

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1beta1/resourceslices

<!--
#### Parameters

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
