---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIStorageCapacity"
content_type: "api_reference"
description: "CSIStorageCapacity 存储一个 CSI GetCapacity 调用的结果。"
title: "CSIStorageCapacity"
weight: 10
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIStorageCapacity"
content_type: "api_reference"
description: "CSIStorageCapacity stores the result of one CSI GetCapacity call."
title: "CSIStorageCapacity"
weight: 10
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSIStorageCapacity {#CSIStorageCapacity}

<!--
CSIStorageCapacity stores the result of one CSI GetCapacity call. For a given StorageClass, this describes the available capacity in a particular topology segment.  This can be used when considering where to instantiate new PersistentVolumes.

For example this can express things like: - StorageClass "standard" has "1234 GiB" available in "topology.kubernetes.io/zone=us-east1" - StorageClass "localssd" has "10 GiB" available in "kubernetes.io/hostname=knode-abc123"

The following three cases all imply that no capacity is available for a certain combination: - no object exists with suitable topology and storage class name - such an object exists, but the capacity is unset - such an object exists, but the capacity is zero
-->
CSIStorageCapacity 存储一个 CSI GetCapacity 调用的结果。
对于给定的 StorageClass，此结构描述了特定拓扑段中可用的容量。
当考虑在哪里实例化新的 PersistentVolume 时可以使用此项。

例如，此结构可以描述如下内容：

- “standard” 的 StorageClass 容量为 “1234 GiB”，可用于 “topology.kubernetes.io/zone=us-east1”
- “localssd” 的 StorageClass 容量为 “10 GiB”，可用于 “kubernetes.io/hostname=knode-abc123”

以下三种情况均暗示了某些组合没有可用的容量：

- 不存在拓扑和存储类名称合适的对象
- 这种对象存在，但容量未设置
- 这种对象存在，但容量为零

<!--
The producer of these objects can decide which approach is more suitable.

They are consumed by the kube-scheduler when a CSI driver opts into capacity-aware scheduling with CSIDriverSpec.StorageCapacity. The scheduler compares the MaximumVolumeSize against the requested size of pending volumes to filter out unsuitable nodes. If MaximumVolumeSize is unset, it falls back to a comparison against the less precise Capacity. If that is also unset, the scheduler assumes that capacity is insufficient and tries some other node.
-->
这些对象的制作方可以决定哪种方法更合适。

当 CSI 驱动选择使用 CSIDriverSpec.StorageCapacity 进行容量感知调度时，kube-scheduler 会使用这些对象。
该调度器将 MaximumVolumeSize 与 pending 卷的请求大小进行比较，以过滤掉不合适的节点。
如果未设置 MaximumVolumeSize，则回退为与不太精确的容量（Capacity）进行比较。
如果还是未设置，则该调度器假定容量不足并尝试某些其他节点。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIStorageCapacity

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. The name has no particular meaning. It must be a DNS subdomain (dots allowed, 253 characters). To ensure that there are no conflicts with other CSI drivers on the cluster, the recommendation is to use csisc-\<uuid>, a generated name, or a reverse-domain name which ends with the unique CSI driver name.

  Objects are namespaced.

  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。
  此名称没有特定的含义。
  它必须是 DNS 子域名（允许英文句点，最多 253 个字符）。
  为了确保与集群上的其他 CSI 驱动没有冲突，建议使用一个生成的名称 csisc-\<uuid>，
  或使用以唯一 CSI 驱动名称结尾的反向域名。

  这些对象是有命名空间的。

  更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **storageClassName** (string), required

  storageClassName represents the name of the StorageClass that the reported capacity applies to. It must meet the same requirements as the name of a StorageClass object (non-empty, DNS subdomain). If that object no longer exists, the CSIStorageCapacity object is obsolete and should be removed by its creator. This field is immutable.

- **capacity** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity is the value reported by the CSI driver in its GetCapacityResponse for a GetCapacityRequest with topology and parameters that match the previous fields.

  The semantic is currently (CSI spec 1.2) defined as: The available capacity, in bytes, of the storage that can be used to provision volumes. If not set, that information is currently unavailable.
-->

- **storageClassName** (string)，必需

  storageClassName 是已报告容量所对应的 StorageClass 的名称。
  它必须满足与 StorageClass 对象名称相同的要求（非空，DNS 子域名）。
  如果该对象不再存在，则 CSIStorageCapacity 对象将被废弃且应由创建者移除。
  此字段不可变更。

- **capacity** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity 是 CSI 驱动在其 GetCapacityResponse 中为 GetCapacityRequest 报告的值，其拓扑和参数与之前的字段匹配。

  该语义目前（CSI 规范 1.2）定义为：可用于制备卷的可用存储容量（单位为字节）。
  如果未设置，则该信息目前不可用。

<!--
- **maximumVolumeSize** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  maximumVolumeSize is the value reported by the CSI driver in its GetCapacityResponse for a GetCapacityRequest with topology and parameters that match the previous fields.

  This is defined since CSI spec 1.4.0 as the largest size that may be used in a CreateVolumeRequest.capacity_range.required_bytes field to create a volume with the same parameters as those in GetCapacityRequest. The corresponding value in the Kubernetes API is ResourceRequirements.Requests in a volume claim.
-->
- **maximumVolumeSize** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  maximumVolumeSize 是 CSI 驱动在其 GetCapacityResponse 中为 GetCapacityRequest 报告的值，其拓扑和参数与之前的字段匹配。

  自从 CSI 规范 1.4.0 起，这定义为 `CreateVolumeRequest.capacity_range.required_bytes` 字段中可以使用的最大值，
  以便用 GetCapacityRequest 中相同的参数创建一个卷。
  Kubernetes API 中的相应值是卷声明中的 ResourceRequirements.Requests。

<!--
- **nodeTopology** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  nodeTopology defines which nodes have access to the storage for which capacity was reported. If not set, the storage is not accessible from any node in the cluster. If empty, the storage is accessible from all nodes. This field is immutable.
-->
- **nodeTopology** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  nodeTopology 定义了哪些节点有权访问已报告容量的存储。
  如果未设置，则不能从集群中的任意节点访问此存储。
  如果留空，则可以从所有节点访问此存储。此字段不可变更。

## CSIStorageCapacityList {#CSIStorageCapacityList}

<!--
CSIStorageCapacityList is a collection of CSIStorageCapacity objects.
-->
CSIStorageCapacityList 是 CSIStorageCapacity 对象的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIStorageCapacityList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>), required

  *Map: unique values on key name will be kept during a merge*

  items is the list of CSIStorageCapacity objects.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。
  更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>)，必需

  **映射：有关键名称的唯一值将在合并期间被保留**

  items 是 CSIStorageCapacity 对象的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified CSIStorageCapacity
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 CSIStorageCapacity

#### HTTP 请求

GET /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIStorageCapacity
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  CSIStorageCapacity 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CSIStorageCapacity
#### HTTP Request
-->
### `list` 列出或观测类别为 CSIStorageCapacity 的对象

#### HTTP 请求

GET /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

<!--
#### Parameters
- **namespace** (*in path*): string, required
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

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacityList" >}}">CSIStorageCapacityList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CSIStorageCapacity
#### HTTP Request
-->
### `list` 列出或观测类别为 CSIStorageCapacity 的对象

#### HTTP 请求

GET /apis/storage.k8s.io/v1/csistoragecapacities

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacityList" >}}">CSIStorageCapacityList</a>): OK

401: Unauthorized

<!--
### `create` create a CSIStorageCapacity
#### HTTP Request
-->
### `create` 创建 CSIStorageCapacity

#### HTTP 请求

POST /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified CSIStorageCapacity
#### HTTP Request
-->
### `update` 替换指定的 CSIStorageCapacity

#### HTTP 请求

PUT /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIStorageCapacity
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  CSIStorageCapacity 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified CSIStorageCapacity
#### HTTP Request
-->
### `patch` 部分更新指定的 CSIStorageCapacity

#### HTTP 请求

PATCH /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIStorageCapacity
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  CSIStorageCapacity 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

401: Unauthorized

<!--
### `delete` delete a CSIStorageCapacity
#### HTTP Request
-->
### `delete` 删除 CSIStorageCapacity

#### HTTP 请求

DELETE /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIStorageCapacity
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  CSIStorageCapacity 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CSIStorageCapacity
#### HTTP Request
-->
### `deletecollection` 删除 CSIStorageCapacity 的集合

#### HTTP 请求

DELETE /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

<!--
#### Parameters
- **namespace** (*in path*): string, required
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

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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
