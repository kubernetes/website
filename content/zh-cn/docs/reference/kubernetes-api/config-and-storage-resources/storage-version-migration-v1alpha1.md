---
api_metadata:
  apiVersion: "storagemigration.k8s.io/v1alpha1"
  import: "k8s.io/api/storagemigration/v1alpha1"
  kind: "StorageVersionMigration"
content_type: "api_reference"
description: "StorageVersionMigration 表示存储的数据向最新存储版本的一次迁移。"
title: "StorageVersionMigration v1alpha1"
weight: 9
---
<!--
api_metadata:
  apiVersion: "storagemigration.k8s.io/v1alpha1"
  import: "k8s.io/api/storagemigration/v1alpha1"
  kind: "StorageVersionMigration"
content_type: "api_reference"
description: "StorageVersionMigration represents a migration of stored data to the latest storage version."
title: "StorageVersionMigration v1alpha1"
weight: 9
auto_generated: true
-->

`apiVersion: storagemigration.k8s.io/v1alpha1`

`import "k8s.io/api/storagemigration/v1alpha1"`

## StorageVersionMigration {#StorageVersionMigration}

<!--
StorageVersionMigration represents a migration of stored data to the latest storage version.
-->
StorageVersionMigration 表示存储的数据向最新存储版本的一次迁移。

<hr>

- **apiVersion**: storagemigration.k8s.io/v1alpha1

- **kind**: StorageVersionMigration

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationSpec" >}}">StorageVersionMigrationSpec</a>)

  Specification of the migration.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationSpec" >}}">StorageVersionMigrationSpec</a>)

  迁移的规约。

<!--
- **status** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationStatus" >}}">StorageVersionMigrationStatus</a>)

  Status of the migration.

## StorageVersionMigrationSpec {#StorageVersionMigrationSpec}

Spec of the storage version migration.
-->
- **status** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationStatus" >}}">StorageVersionMigrationStatus</a>)

  迁移的状态。

## StorageVersionMigrationSpec {#StorageVersionMigrationSpec}

存储版本迁移的规约。

<hr>

<!--
- **continueToken** (string)

  The token used in the list options to get the next chunk of objects to migrate. When the .status.conditions indicates the migration is "Running", users can use this token to check the progress of the migration.

- **resource** (GroupVersionResource), required

  The resource that is being migrated. The migrator sends requests to the endpoint serving the resource. Immutable.

  <a name="GroupVersionResource"></a>
  *The names of the group, the version, and the resource.*
-->
- **continueToken** (string)

  在 list 操作中用来获取下一批要迁移的对象时所用的令牌。
  当 `.status.conditions` 指示迁移处于 “Running” 状态时，用户可以使用此令牌检查迁移的进度。

- **resource** (GroupVersionResource)，必需

  正在被迁移的资源。迁移程序向提供资源的端点发送请求。不可变更。

  <a name="GroupVersionResource"></a>
  **组、版本和资源的名称。**

  <!--
  - **resource.group** (string)

    The name of the group.

  - **resource.resource** (string)

    The name of the resource.

  - **resource.version** (string)

    The name of the version.
  -->

  - **resource.group** (string)

    组的名称。

  - **resource.resource** (string)

    资源的名称。

  - **resource.version** (string)

    版本的名称。

## StorageVersionMigrationStatus {#StorageVersionMigrationStatus}

<!--
Status of the storage version migration.
-->
存储版本迁移的状态。

<hr>

<!--
- **conditions** ([]MigrationCondition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  The latest available observations of the migration's current state.

  <a name="MigrationCondition"></a>
  *Describes the state of a migration at a certain point.*
-->
- **conditions** ([]MigrationCondition)

  **补丁策略：基于键 `type` 合并**
  
  **Map：合并时将保留 type 键的唯一值**
  
  迁移当前状态的最新可用观察结果。

  <a name="MigrationCondition"></a>
  **描述迁移在某一时间点的状态。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of the condition.
  -->

  - **conditions.status** (string)，必需

    状况的状态，可选值为 True、False 或 Unknown。

  - **conditions.type** (string)，必需

    状况的类别。

  <!--
  - **conditions.lastUpdateTime** (Time)

    The last time this condition was updated.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastUpdateTime** (Time)

    上一次更新此状况的时间。

    <a name="Time"></a>
    **Time 是 time.Time 的包装器，支持正确编码为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。**

  <!--
  - **conditions.message** (string)

    A human readable message indicating details about the transition.

  - **conditions.reason** (string)

    The reason for the condition's last transition.
  -->

  - **conditions.message** (string)

    一条人类可读的消息，指示关于转换的细节。

  - **conditions.reason** (string)

    上次状况转换的原因。

<!--
- **resourceVersion** (string)

  ResourceVersion to compare with the GC cache for performing the migration. This is the current resource version of given group, version and resource when kube-controller-manager first observes this StorageVersionMigration resource.
-->
- **resourceVersion** (string)

  在执行迁移时，要与垃圾收集（GC）缓存进行比较的资源版本（ResourceVerion）。
  这是 kube-controller-manager 第一次观察到 StorageVersionMigration
  资源时所给定组、版本和资源的当前资源版本。

## StorageVersionMigrationList {#StorageVersionMigrationList}

<!--
StorageVersionMigrationList is a collection of storage version migrations.
-->
StorageVersionMigrationList 是 StorageVersionMigration 对象的集合。

<hr>

- **apiVersion**: storagemigration.k8s.io/v1alpha1

- **kind**: StorageVersionMigrationList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>), required

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  Items is the list of StorageVersionMigration
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>)，必需

  **补丁策略：基于键 `type` 合并**
  
  **Map：合并时将保留 type 键的唯一值**
  
  items 是 StorageVersionMigration 的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified StorageVersionMigration

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 StorageVersionMigration

#### HTTP 请求

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  StorageVersionMigration 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified StorageVersionMigration

#### HTTP Request
-->
### `get` 读取指定 StorageVersionMigration 的状态

#### HTTP 请求

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  StorageVersionMigration 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind StorageVersionMigration

#### HTTP Request
-->
### `list` 列举或监视类别为 StorageVersionMigration 的对象

#### HTTP 请求

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationList" >}}">StorageVersionMigrationList</a>): OK

401: Unauthorized

<!--
### `create` create a StorageVersionMigration

#### HTTP Request
-->
### `create` 创建 StorageVersionMigration

#### HTTP 请求

POST /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

<!--
#### Parameters

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, required

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

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified StorageVersionMigration

#### HTTP Request
-->
### `update` 替换指定的 StorageVersionMigration

#### HTTP 请求

PUT /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, required

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

  StorageVersionMigration 的名称。

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified StorageVersionMigration

#### HTTP Request
-->
### `update` 替换指定 StorageVersionMigration 的状态

#### HTTP 请求

PUT /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, required

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

  StorageVersionMigration 的名称。

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified StorageVersionMigration

#### HTTP Request
-->
### `patch` 部分更新指定的 StorageVersionMigration

#### HTTP 请求

PATCH /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

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

  StorageVersionMigration 的名称。

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified StorageVersionMigration

#### HTTP Request
-->
### `patch` 部分更新指定 StorageVersionMigration 的状态

#### HTTP 请求

PATCH /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

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

  StorageVersionMigration 的名称。

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

<!--
### `delete` delete a StorageVersionMigration

#### HTTP Request
-->
### `delete` 删除 StorageVersionMigration

#### HTTP 请求

DELETE /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

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

  StorageVersionMigration 的名称。

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of StorageVersionMigration

#### HTTP Request
-->
### `deletecollection` 删除 StorageVersionMigration 的集合

#### HTTP 请求

DELETE /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

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
