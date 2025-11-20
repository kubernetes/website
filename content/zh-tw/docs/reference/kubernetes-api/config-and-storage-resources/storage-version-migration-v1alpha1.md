---
api_metadata:
  apiVersion: "storagemigration.k8s.io/v1alpha1"
  import: "k8s.io/api/storagemigration/v1alpha1"
  kind: "StorageVersionMigration"
content_type: "api_reference"
description: "StorageVersionMigration 表示儲存的資料向最新儲存版本的一次遷移。"
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
StorageVersionMigration 表示儲存的資料向最新儲存版本的一次遷移。

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

  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationSpec" >}}">StorageVersionMigrationSpec</a>)

  遷移的規約。

<!--
- **status** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationStatus" >}}">StorageVersionMigrationStatus</a>)

  Status of the migration.

## StorageVersionMigrationSpec {#StorageVersionMigrationSpec}

Spec of the storage version migration.
-->
- **status** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationStatus" >}}">StorageVersionMigrationStatus</a>)

  遷移的狀態。

## StorageVersionMigrationSpec {#StorageVersionMigrationSpec}

儲存版本遷移的規約。

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

  在 list 操作中用來獲取下一批要遷移的對象時所用的令牌。
  當 `.status.conditions` 指示遷移處於 “Running” 狀態時，使用者可以使用此令牌檢查遷移的進度。

- **resource** (GroupVersionResource)，必需

  正在被遷移的資源。遷移程式向提供資源的端點發送請求。不可變更。

  <a name="GroupVersionResource"></a>
  **組、版本和資源的名稱。**

  <!--
  - **resource.group** (string)

    The name of the group.

  - **resource.resource** (string)

    The name of the resource.

  - **resource.version** (string)

    The name of the version.
  -->

  - **resource.group** (string)

    組的名稱。

  - **resource.resource** (string)

    資源的名稱。

  - **resource.version** (string)

    版本的名稱。

## StorageVersionMigrationStatus {#StorageVersionMigrationStatus}

<!--
Status of the storage version migration.
-->
儲存版本遷移的狀態。

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

  **補丁策略：基於鍵 `type` 合併**
  
  **Map：合併時將保留 type 鍵的唯一值**
  
  遷移當前狀態的最新可用觀察結果。

  <a name="MigrationCondition"></a>
  **描述遷移在某一時間點的狀態。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of the condition.
  -->

  - **conditions.status** (string)，必需

    狀況的狀態，可選值爲 True、False 或 Unknown。

  - **conditions.type** (string)，必需

    狀況的類別。

  <!--
  - **conditions.lastUpdateTime** (Time)

    The last time this condition was updated.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastUpdateTime** (Time)

    上一次更新此狀況的時間。

    <a name="Time"></a>
    **Time 是 time.Time 的包裝器，支持正確編碼爲 YAML 和 JSON。爲 time 包提供的許多工廠方法提供了包裝器。**

  <!--
  - **conditions.message** (string)

    A human readable message indicating details about the transition.

  - **conditions.reason** (string)

    The reason for the condition's last transition.
  -->

  - **conditions.message** (string)

    一條人類可讀的消息，指示關於轉換的細節。

  - **conditions.reason** (string)

    上次狀況轉換的原因。

<!--
- **resourceVersion** (string)

  ResourceVersion to compare with the GC cache for performing the migration. This is the current resource version of given group, version and resource when kube-controller-manager first observes this StorageVersionMigration resource.
-->
- **resourceVersion** (string)

  在執行遷移時，要與垃圾收集（GC）緩存進行比較的資源版本（ResourceVerion）。
  這是 kube-controller-manager 第一次觀察到 StorageVersionMigration
  資源時所給定組、版本和資源的當前資源版本。

## StorageVersionMigrationList {#StorageVersionMigrationList}

<!--
StorageVersionMigrationList is a collection of storage version migrations.
-->
StorageVersionMigrationList 是 StorageVersionMigration 對象的集合。

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

  標準的列表元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>)，必需

  **補丁策略：基於鍵 `type` 合併**
  
  **Map：合併時將保留 type 鍵的唯一值**
  
  items 是 StorageVersionMigration 的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified StorageVersionMigration

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 StorageVersionMigration

#### HTTP 請求

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  StorageVersionMigration 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified StorageVersionMigration

#### HTTP Request
-->
### `get` 讀取指定 StorageVersionMigration 的狀態

#### HTTP 請求

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the StorageVersionMigration

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  StorageVersionMigration 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind StorageVersionMigration

#### HTTP Request
-->
### `list` 列舉或監視類別爲 StorageVersionMigration 的對象

#### HTTP 請求

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationList" >}}">StorageVersionMigrationList</a>): OK

401: Unauthorized

<!--
### `create` create a StorageVersionMigration

#### HTTP Request
-->
### `create` 創建 StorageVersionMigration

#### HTTP 請求

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
#### 參數

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified StorageVersionMigration

#### HTTP Request
-->
### `update` 替換指定的 StorageVersionMigration

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  StorageVersionMigration 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified StorageVersionMigration

#### HTTP Request
-->
### `update` 替換指定 StorageVersionMigration 的狀態

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  StorageVersionMigration 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified StorageVersionMigration

#### HTTP Request
-->
### `patch` 部分更新指定的 StorageVersionMigration

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  StorageVersionMigration 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified StorageVersionMigration

#### HTTP Request
-->
### `patch` 部分更新指定 StorageVersionMigration 的狀態

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  StorageVersionMigration 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

<!--
### `delete` delete a StorageVersionMigration

#### HTTP Request
-->
### `delete` 刪除 StorageVersionMigration

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  StorageVersionMigration 的名稱。

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of StorageVersionMigration

#### HTTP Request
-->
### `deletecollection` 刪除 StorageVersionMigration 的集合

#### HTTP 請求

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
