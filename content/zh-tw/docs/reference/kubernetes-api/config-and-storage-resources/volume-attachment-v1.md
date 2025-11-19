---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "VolumeAttachment"
content_type: "api_reference"
description: "VolumeAttachment 抓取將指定卷掛接到指定節點或從指定節點解除掛接指定卷的意圖。"
title: "VolumeAttachment"
weight: 11
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "VolumeAttachment"
content_type: "api_reference"
description: "VolumeAttachment captures the intent to attach or detach the specified volume to/from the specified node."
title: "VolumeAttachment"
weight: 11
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## VolumeAttachment {#VolumeAttachment}

<!--
VolumeAttachment captures the intent to attach or detach the specified volume to/from the specified node.

VolumeAttachment objects are non-namespaced.
-->
VolumeAttachment 抓取將指定卷掛接到指定節點或從指定節點解除掛接指定卷的意圖。

VolumeAttachment 對象未劃分命名空間。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: VolumeAttachment

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachmentSpec" >}}">VolumeAttachmentSpec</a>), required

  spec represents specification of the desired attach/detach volume behavior. Populated by the Kubernetes system.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachmentSpec" >}}">VolumeAttachmentSpec</a>)，必需

  spec 表示期望的掛接/解除掛接卷行爲的規約。由 Kubernetes 系統填充。

<!--
- **status** (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachmentStatus" >}}">VolumeAttachmentStatus</a>)

  status represents status of the VolumeAttachment request. Populated by the entity completing the attach or detach operation, i.e. the external-attacher.
-->
- **status** (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachmentStatus" >}}">VolumeAttachmentStatus</a>)

  status 表示 VolumeAttachment 請求的狀態。由完成掛接或解除掛接操作的實體
 （即外部掛接器）進行填充。

## VolumeAttachmentSpec {#VolumeAttachmentSpec}

<!--
VolumeAttachmentSpec is the specification of a VolumeAttachment request.
-->
VolumeAttachmentSpec 是 VolumeAttachment 請求的規約。

<hr>

<!--
- **attacher** (string), required

  attacher indicates the name of the volume driver that MUST handle this request. This is the name returned by GetPluginName().

- **nodeName** (string), required

  nodeName represents the node that the volume should be attached to.
-->
- **attacher** (string)，必需

  attacher 表示必須處理此請求的卷驅動的名稱。這是由 GetPluginName() 返回的名稱。

- **nodeName** (string)，必需

  nodeName 表示卷應掛接到的節點。

<!--
- **source** (VolumeAttachmentSource), required
  source represents the volume that should be attached.

  <a name="VolumeAttachmentSource"></a>
  *VolumeAttachmentSource represents a volume that should be attached. Right now only PersistentVolumes can be attached via external attacher, in the future we may allow also inline volumes in pods. Exactly one member can be set.*

  - **source.inlineVolumeSpec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeSpec" >}}">PersistentVolumeSpec</a>)
    inlineVolumeSpec contains all the information necessary to attach a persistent volume defined by a pod's inline VolumeSource. This field is populated only for the CSIMigration feature. It contains translated fields from a pod's inline VolumeSource to a PersistentVolumeSpec. This field is beta-level and is only honored by servers that enabled the CSIMigration feature.

  - **source.persistentVolumeName** (string)

    persistentVolumeName represents the name of the persistent volume to attach.
-->
- **source** (VolumeAttachmentSource)，必需

  source 表示應掛接的卷。

  <a name="VolumeAttachmentSource"></a>
  **VolumeAttachmentSource 表示應掛接的卷。現在只能通過外部掛接器掛接 PersistentVolume，
  將來我們可能還允許 Pod 中的內聯卷。只能設置一個成員。**

  - **source.inlineVolumeSpec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeSpec" >}}">PersistentVolumeSpec</a>)

    inlineVolumeSpec 包含掛接由 Pod 的內聯 VolumeSource 定義的持久卷時所有必需的信息。
    僅爲 CSIMigation 特性填充此字段。
    它包含從 Pod 的內聯 VolumeSource 轉換爲 PersistentVolumeSpec 的字段。
    此字段處於 Beta 階段，且只有啓用 CSIMigration 特性的服務器才能使用此字段。

  - **source.persistentVolumeName** (string)

    persistentVolumeName 是要掛接的持久卷的名稱。

## VolumeAttachmentStatus {#VolumeAttachmentStatus}

<!--
VolumeAttachmentStatus is the status of a VolumeAttachment request.

<hr>

- **attached** (boolean), required

  attached indicates the volume is successfully attached. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.
-->
VolumeAttachmentStatus 是 VolumeAttachment 請求的狀態。

<hr>

- **attached** (boolean)，必需

  attached 表示卷被成功掛接。此字段只能由完成掛接操作的實體（例如外部掛接器）進行設置。

<!--
- **attachError** (VolumeError)

  attachError represents the last error encountered during attach operation, if any. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.

  <a name="VolumeError"></a>
  *VolumeError captures an error encountered during a volume operation.*
-->
- **attachError** (VolumeError)

  attachError 表示掛接操作期間遇到的最後一個錯誤，如果有。
  此字段只能由完成掛接操作的實體（例如外部掛接器）進行設置。

  <a name="VolumeError"></a>
  **VolumeError 抓取卷操作期間遇到的一個錯誤。**

  <!--
  - **attachError.errorCode** (int32)

    errorCode is a numeric gRPC code representing the error encountered during Attach or Detach operations.
    
    This is an optional, beta field that requires the MutableCSINodeAllocatableCount feature gate being enabled to be set.
  -->

  - **attachError.errorCode** (int32)

    errorCode 是一個 gRPC 錯誤碼，代表在 Attach 或 Detach 操作期間遇到的錯誤。

    這是一個可選的、Beta 階段的字段，要求啓用了 MutableCSINodeAllocatableCount
    特性門控才能設置。

  <!--
  - **attachError.message** (string)

    message represents the error encountered during Attach or Detach operation. This string may be logged, so it should not contain sensitive information.

  - **attachError.time** (Time)

    time represents the time the error was encountered.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **attachError.message** (string)

    message 表示掛接或解除掛接操作期間遇到的錯誤。
    此字符串可以放入日誌，因此它不應包含敏感信息。

  - **attachError.time** (Time)

    遇到錯誤的時間。

    <a name="Time"></a>
    **time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
    爲 time 包提供的許多工廠方法提供了包裝類。**

<!--
- **attachmentMetadata** (map[string]string)

  attachmentMetadata is populated with any information returned by the attach operation, upon successful attach, that must be passed into subsequent WaitForAttach or Mount calls. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.

-->
- **attachmentMetadata** (map[string]string)

  成功掛接時，attachmentMetadata 字段將由掛接操作返回的任何信息進行填充，
  這些信息必須傳遞到後續的 WaitForAttach 或 Mount 調用中。
  此字段只能由完成掛接操作的實體（例如外部掛接器）進行設置。

<!--
- **detachError** (VolumeError)

  detachError represents the last error encountered during detach operation, if any. This field must only be set by the entity completing the detach operation, i.e. the external-attacher.

  <a name="VolumeError"></a>
  *VolumeError captures an error encountered during a volume operation.*
-->
- **detachError** (VolumeError)

  detachError 表示解除掛接操作期間遇到的最後一個錯誤，如果有。
  此字段只能由完成解除掛接操作的實體（例如外部掛接器）進行設置。

  <a name="VolumeError"></a>
  **VolumeError 抓取卷操作期間遇到的一個錯誤。**

  <!--
  - **attachError.errorCode** (int32)

    errorCode is a numeric gRPC code representing the error encountered during Attach or Detach operations.
    
    This is an optional, beta field that requires the MutableCSINodeAllocatableCount feature gate being enabled to be set.
  -->

  - **attachError.errorCode** (int32)

    errorCode 是一個 gRPC 錯誤碼，代表在 Attach 或 Detach 操作期間遇到的錯誤。

    這是一個可選的、Beta 階段的字段，要求啓用了 MutableCSINodeAllocatableCount
    特性門控才能設置。

  <!--
  - **detachError.message** (string)

    message represents the error encountered during Attach or Detach operation. This string may be logged, so it should not contain sensitive information.

  - **detachError.time** (Time)

    time represents the time the error was encountered.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **detachError.message** (string)

    message 表示掛接或解除掛接操作期間遇到的錯誤。
    此字符串可以放入日誌，因此它不應包含敏感信息。

  - **detachError.time** (Time)

    time 表示遇到錯誤的時間。

    <a name="Time"></a>
    **time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
    爲 time 包提供的許多工廠方法提供了包裝類。**

## VolumeAttachmentList {#VolumeAttachmentList}

<!--
VolumeAttachmentList is a collection of VolumeAttachment objects.
-->
VolumeAttachmentList 是 VolumeAttachment 對象的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: VolumeAttachmentList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>), required

  items is the list of VolumeAttachments
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>)，必需

  items 是 VolumeAttachment 的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified VolumeAttachment
#### HTTP Request
-->
### `get` 讀取指定的 VolumeAttachment

#### HTTP 請求

GET /apis/storage.k8s.io/v1/volumeattachments/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the VolumeAttachment
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttachment 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified VolumeAttachment
#### HTTP Request
-->
### `get` 讀取指定的 VolumeAttachment 的狀態

#### HTTP 請求

GET /apis/storage.k8s.io/v1/volumeattachments/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the VolumeAttachment
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttachment 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind VolumeAttachment
#### HTTP Request
-->
### `list` 列舉或觀測類別爲 VolumeAttachment 的對象

#### HTTP 請求

GET /apis/storage.k8s.io/v1/volumeattachments

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachmentList" >}}">VolumeAttachmentList</a>): OK

401: Unauthorized

<!--
### `create` create a VolumeAttachment
#### HTTP Request
-->
### `create` 創建 VolumeAttachment

#### HTTP 請求

POST /apis/storage.k8s.io/v1/volumeattachments

<!--
#### Parameters
- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified VolumeAttachment
#### HTTP Request
-->
### `update` 替換指定的 VolumeAttachment

#### HTTP 請求

PUT /apis/storage.k8s.io/v1/volumeattachments/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the VolumeAttachment
- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttachment 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified VolumeAttachment
#### HTTP Request
-->
### `update` 替換指定的 VolumeAttachment 的狀態

#### HTTP 請求

PUT /apis/storage.k8s.io/v1/volumeattachments/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the VolumeAttachment
- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttachment 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified VolumeAttachment
#### HTTP Request
-->
### `patch` 部分更新指定的 VolumeAttachment

#### HTTP 請求

PATCH /apis/storage.k8s.io/v1/volumeattachments/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the VolumeAttachment
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttachment 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified VolumeAttachment
#### HTTP Request
-->
### `patch` 部分更新指定的 VolumeAttachment 的狀態

#### HTTP 請求

PATCH /apis/storage.k8s.io/v1/volumeattachments/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the VolumeAttachment
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttachment 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

401: Unauthorized

<!--
### `delete` delete a VolumeAttachment
#### HTTP Request
-->
### `delete` 刪除 VolumeAttachment

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/volumeattachments/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the VolumeAttachment
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttachment 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of VolumeAttachment
#### HTTP Request
-->
### `deletecollection` 刪除 VolumeAttachment 的集合

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/volumeattachments

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
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
