---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "StorageClass"
content_type: "api_reference"
description: "StorageClass 为可以动态制备 PersistentVolume 的存储类描述参数。"
title: "StorageClass"
weight: 6
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "StorageClass"
content_type: "api_reference"
description: "StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned."
title: "StorageClass"
weight: 6
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## StorageClass {#StorageClass}
<!--
StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned.

StorageClasses are non-namespaced; the name of the storage class according to etcd is in ObjectMeta.Name.
-->
StorageClass 为可以动态制备 PersistentVolume 的存储类描述参数。

StorageClass 是不受名字空间作用域限制的；按照 etcd 设定的存储类的名称位于 ObjectMeta.Name 中。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: StorageClass

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **provisioner** (string), required
  provisioner indicates the type of the provisioner.

- **allowVolumeExpansion** (boolean)
  allowVolumeExpansion shows whether the storage class allow volume expand
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **provisioner** (string)，必需

  provisioner 表示制备器的类别。

- **allowVolumeExpansion** (boolean)

  allowVolumeExpansion 显示存储类是否允许卷扩充。

<!--
- **allowedTopologies** ([]TopologySelectorTerm)
  *Atomic: will be replaced during a merge*
  
  allowedTopologies restrict the node topologies where volumes can be dynamically provisioned. Each volume plugin defines its own supported topology specifications. An empty TopologySelectorTerm list means there is no topology restriction. This field is only honored by servers that enable the VolumeScheduling feature.

  <a name="TopologySelectorTerm"></a>
  *A topology selector term represents the result of label queries. A null or empty topology selector term matches no objects. The requirements of them are ANDed. It provides a subset of functionality as NodeSelectorTerm. This is an alpha feature and may change in the future.*
-->
- **allowedTopologies** ([]TopologySelectorTerm)

  **原子性：将在合并期间被替换**
  
  allowedTopologies 限制可以动态制备卷的节点拓扑。每个卷插件定义其自己支持的拓扑规约。
  空的 TopologySelectorTerm 列表意味着没有拓扑限制。
  只有启用 VolumeScheduling 功能特性的服务器才能使用此字段。
  
  <a name="TopologySelectorTerm"></a> 
  **拓扑选择器条件表示标签查询的结果。
  一个 null 或空的拓扑选择器条件不会匹配任何对象。各个条件的要求按逻辑与的关系来计算。
  此选择器作为 NodeSelectorTerm 所提供功能的子集。此功能为 Alpha 特性，将来可能会变更。**

<!--
  - **allowedTopologies.matchLabelExpressions** ([]TopologySelectorLabelRequirement)
    A list of topology selector requirements by labels.
    <a name="TopologySelectorLabelRequirement"></a>
    *A topology selector requirement is a selector that matches given label. This is an alpha feature and may change in the future.*

    - **allowedTopologies.matchLabelExpressions.key** (string), required
      The label key that the selector applies to.
    - **allowedTopologies.matchLabelExpressions.values** ([]string), required
      An array of string values. One value must match the label to be selected. Each entry in Values is ORed.
-->  
  - **allowedTopologies.matchLabelExpressions** ([]TopologySelectorLabelRequirement)

    按标签设置的拓扑选择器要求的列表。
    
    <a name="TopologySelectorLabelRequirement"></a> 
    **拓扑选择器要求是与给定标签匹配的一个选择器。此功能为 Alpha 特性，将来可能会变更。**
    
    - **allowedTopologies.matchLabelExpressions.key** (string)，必需

      选择器所针对的标签键。
    
    - **allowedTopologies.matchLabelExpressions.values** ([]string)，必需

      字符串数组。一个值必须与要选择的标签匹配。values 中的每个条目按逻辑或的关系来计算。

<!--
- **mountOptions** ([]string)

  mountOptions controls the mountOptions for dynamically provisioned PersistentVolumes of this storage class. e.g. ["ro", "soft"]. Not validated - mount of the PVs will simply fail if one is invalid.

- **parameters** (map[string]string)
  parameters holds the parameters for the provisioner that should create volumes of this storage class.
-->
- **mountOptions** ([]string)

  mountOptions 控制此存储类动态制备的 PersistentVolume 的挂载配置。
  （例如 ["ro", "soft"]）。
  系统对选项作检查——如果有一个选项无效，则这些 PV 的挂载将失败。

- **parameters** (map[string]string)

  parameters 包含应创建此存储类卷的制备器的参数。

<!--
- **reclaimPolicy** (string)

  reclaimPolicy controls the reclaimPolicy for dynamically provisioned PersistentVolumes of this storage class. Defaults to Delete.

- **volumeBindingMode** (string)
  volumeBindingMode indicates how PersistentVolumeClaims should be provisioned and bound.  When unset, VolumeBindingImmediate is used. This field is only honored by servers that enable the VolumeScheduling feature.
-->
- **reclaimPolicy** (string)

  reclaimPolicy 控制此存储类动态制备的 PersistentVolume 的 reclaimPolicy。默认为 Delete。

- **volumeBindingMode** (string)

  volumeBindingMode 指示应该如何制备和绑定 PersistentVolumeClaim。
  未设置时，将使用 VolumeBindingImmediate。
  只有启用 VolumeScheduling 功能特性的服务器才能使用此字段。

## StorageClassList {#StorageClassList}
<!--
StorageClassList is a collection of storage classes.
-->
StorageClassList 是存储类的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: StorageClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>), required
  items is the list of StorageClasses
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>)，必需

  items 是 StorageClass 的列表。

<!--
## Operations {#Operations}
### `get` read the specified StorageClass
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 StorageClass
#### HTTP 请求
GET /apis/storage.k8s.io/v1/storageclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the StorageClass
- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  StorageClass 的名称

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind StorageClass
#### HTTP Request
-->
### `list` 列出或观测类别为 StorageClass 的对象
#### HTTP 请求
GET /apis/storage.k8s.io/v1/storageclasses

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 参数
- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClassList" >}}">StorageClassList</a>): OK

401: Unauthorized

<!--
### `create` create a StorageClass
#### HTTP Request
-->
### `create` 创建 StorageClass
#### HTTP 请求
POST /apis/storage.k8s.io/v1/storageclasses

<!--
#### Parameters
- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数
- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified StorageClass
#### HTTP Request
-->
### `update` 替换指定的 StorageClass
#### HTTP 请求
PUT /apis/storage.k8s.io/v1/storageclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the StorageClass
- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  StorageClass 的名称

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified StorageClass
#### HTTP Request
-->
### `patch` 部分更新指定的 StorageClass
#### HTTP 请求
PATCH /apis/storage.k8s.io/v1/storageclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the StorageClass
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  StorageClass 的名称

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

401: Unauthorized

<!--
### `delete` delete a StorageClass
#### HTTP Request
-->
### `delete` 删除 StorageClass
#### HTTP 请求
DELETE /apis/storage.k8s.io/v1/storageclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the StorageClass
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  StorageClass 的名称

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of StorageClass
#### HTTP Request
-->
### `deletecollection` 删除 StorageClass 的集合
#### HTTP 请求
DELETE /apis/storage.k8s.io/v1/storageclasses

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 参数
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
