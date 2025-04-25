---
api_metadata:
  apiVersion: "storage.k8s.io/v1beta1"
  import: "k8s.io/api/storage/v1beta1"
  kind: "VolumeAttributesClass"
content_type: "api_reference"
description: "VolumeAttributesClass 表示由 CSI 驱动所定义的可变更卷属性的规约。"
title: "VolumeAttributesClass v1beta1"
weight: 12
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1beta1"
  import: "k8s.io/api/storage/v1beta1"
  kind: "VolumeAttributesClass"
content_type: "api_reference"
description: "VolumeAttributesClass represents a specification of mutable volume attributes defined by the CSI driver."
title: "VolumeAttributesClass v1beta1"
weight: 12
auto_generated: true
-->

`apiVersion: storage.k8s.io/v1beta1`

`import "k8s.io/api/storage/v1beta1"`

## VolumeAttributesClass {#VolumeAttributesClass}

<!--
VolumeAttributesClass represents a specification of mutable volume attributes defined by the CSI driver. The class can be specified during dynamic provisioning of PersistentVolumeClaims, and changed in the PersistentVolumeClaim spec after provisioning.
-->
VolumeAttributesClass 表示由 CSI 驱动所定义的可变更卷属性的规约。
此类可以在动态制备 PersistentVolumeClaim 期间被指定，
并且可以在制备之后在 PersistentVolumeClaim 规约中更改。

<hr>

- **apiVersion**: storage.k8s.io/v1beta1

- **kind**: VolumeAttributesClass

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **driverName** (string), required

  Name of the CSI driver This field is immutable.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **driverName** (string)，必需

  CSI 驱动的名称。此字段是不可变更的。

<!--
- **parameters** (map[string]string)

  parameters hold volume attributes defined by the CSI driver. These values are opaque to the Kubernetes and are passed directly to the CSI driver. The underlying storage provider supports changing these attributes on an existing volume, however the parameters field itself is immutable. To invoke a volume update, a new VolumeAttributesClass should be created with new parameters, and the PersistentVolumeClaim should be updated to reference the new VolumeAttributesClass.
  
  This field is required and must contain at least one key/value pair. The keys cannot be empty, and the maximum number of parameters is 512, with a cumulative max size of 256K. If the CSI driver rejects invalid parameters, the target PersistentVolumeClaim will be set to an "Infeasible" state in the modifyVolumeStatus field.
-->
- **parameters** (map[string]string)

  parameters 保存由 CSI 驱动所定义的卷属性。这些值对 Kubernetes 是不透明的，被直接传递给 CSI 驱动。
  下层存储驱动支持更改现有卷的这些属性，但 parameters 字段本身是不可变更的。
  要触发一次卷更新，应该使用新的参数创建新的 VolumeAttributesClass，
  并且应更新 PersistentVolumeClaim，使之引用新的 VolumeAttributesClass。

  此字段是必需的，必须至少包含一个键/值对。键不能为空，参数最多 512 个，累计最大尺寸为 256K。
  如果 CSI 驱动拒绝无效参数，则目标 PersistentVolumeClaim
  的状态中 modifyVolumeStatus 字段将被设置为 “Infeasible”。

## VolumeAttributesClassList {#VolumeAttributesClassList}

<!--
VolumeAttributesClassList is a collection of VolumeAttributesClass objects.
-->
VolumeAttributesClassList 是 VolumeAttributesClass 对象的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1beta1

- **kind**: VolumeAttributesClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>), required

  items is the list of VolumeAttributesClass objects.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>)，必需

  items 是 VolumeAttributesClass 对象的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified VolumeAttributesClass

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 VolumeAttributesClass

#### HTTP 请求

GET /apis/storage.k8s.io/v1beta1/volumeattributesclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the VolumeAttributesClass

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  VolumeAttributesClass 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind VolumeAttributesClass

#### HTTP Request
-->
### `list` 列举或监视类别为 VolumeAttributesClass 的对象

#### HTTP 请求

GET /apis/storage.k8s.io/v1beta1/volumeattributesclasses

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClassList" >}}">VolumeAttributesClassList</a>): OK

401: Unauthorized

<!--
### `create` create a VolumeAttributesClass

#### HTTP Request
-->
### `create` 创建 VolumeAttributesClass

#### HTTP 请求

POST /apis/storage.k8s.io/v1beta1/volumeattributesclasses

<!--
#### Parameters

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified VolumeAttributesClass

#### HTTP Request
-->
### `update` 替换指定的 VolumeAttributesClass

#### HTTP 请求

PUT /apis/storage.k8s.io/v1beta1/volumeattributesclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the VolumeAttributesClass

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  VolumeAttributesClass 的名称。

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified VolumeAttributesClass

#### HTTP Request
-->
### `patch` 部分更新指定的 VolumeAttributesClass

#### HTTP 请求

PATCH /apis/storage.k8s.io/v1beta1/volumeattributesclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the VolumeAttributesClass

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
#### 参数

- **name** (**路径参数**): string，必需

  VolumeAttributesClass 的名称。

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

401: Unauthorized

<!--
### `delete` delete a VolumeAttributesClass

#### HTTP Request
-->
### `delete` 删除 VolumeAttributesClass

#### HTTP 请求

DELETE /apis/storage.k8s.io/v1beta1/volumeattributesclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the VolumeAttributesClass

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  VolumeAttributesClass 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1beta1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of VolumeAttributesClass

#### HTTP Request
-->
### `deletecollection` 删除 VolumeAttributesClass 的集合

#### HTTP 请求

DELETE /apis/storage.k8s.io/v1beta1/volumeattributesclasses

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

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
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

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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
