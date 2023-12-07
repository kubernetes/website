---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Namespace"
content_type: "api_reference"
description: "Namespace 为名字提供作用域。"
title: "Namespace"
weight: 2
---

<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Namespace"
content_type: "api_reference"
description: "Namespace provides a scope for Names."
title: "Namespace"
weight: 2
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Namespace {#Namespace}
<!--
Namespace provides a scope for Names. Use of multiple namespaces is optional.
-->
Namespace 为名字提供作用域。使用多个命名空间是可选的。
<hr>

- **apiVersion**: v1

- **kind**: Namespace

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceSpec" >}}">NamespaceSpec</a>)
  <!--
  Spec defines the behavior of the Namespace. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  spec 定义了 Namespace 的行为。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceStatus" >}}">NamespaceStatus</a>)
  <!--
  Status describes the current status of a Namespace. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  status 描述了当前 Namespace 的状态。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## NamespaceSpec {#NamespaceSpec}
<!--
NamespaceSpec describes the attributes on a Namespace.
-->
NamespaceSpec 用于描述 Namespace 的属性。

<hr>

- **finalizers** ([]string)
  <!--
  Finalizers is an opaque list of values that must be empty to permanently remove object from storage. More info: https://kubernetes.io/docs/tasks/administer-cluster/namespaces/
  -->

  finalizers 是一个不透明的值列表，只有此列表为空时才能从存储中永久删除对象。 更多信息： https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/namespaces/

## NamespaceStatus {#NamespaceStatus}
<!--
NamespaceStatus is information about the current status of a Namespace.
-->
NamespaceStatus 表示 Namespace 的当前状态信息。
<hr>

- **conditions** ([]NamespaceCondition)
  <!--
  *Patch strategy: merge on key `type`*
  
  Represents the latest available observations of a namespace's current state.
  -->
  **补丁策略：基于 `type` 健合并**
  
  表示命名空间当前状态的最新可用状况。

  <a name="NamespaceCondition"></a>
  <!--
  *NamespaceCondition contains details about state of namespace.*

  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.
  -->
  **NamespaceCondition 包含命名空间状态的详细信息。**

  - **conditions.status** (string)，必需

    状况（condition）的状态，取值为 True、False 或 Unknown 之一。
  <!--
  - **conditions.type** (string), required

    Type of namespace controller condition.
    
  - **conditions.lastTransitionTime** (Time)
  -->
  - **conditions.type** (string), 必需

    命名空间控制器状况的类型。
    
  - **conditions.lastTransitionTime** (Time)

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->
    **Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。为 time 包的许多函数方法提供了封装器。**

  - **conditions.message** (string)

  - **conditions.reason** (string)

- **phase** (string)

  <!--
  Phase is the current lifecycle phase of the namespace. More info: https://kubernetes.io/docs/tasks/administer-cluster/namespaces/
  -->
  phase 是命名空间的当前生命周期阶段。更多信息： https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/namespaces/

## NamespaceList {#NamespaceList}
<!--
NamespaceList is a list of Namespaces.
-->
NamespaceList 是一个命名空间列表。
<hr>

- **apiVersion**: v1


- **kind**: NamespaceList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->
  标准的列表元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>), required
-->

- **items** ([]<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)，必需

  <!--
  Items is the list of Namespace objects in the list. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
  -->
  items 是列表中的 Namespace 对象列表。更多信息： https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces/

<!--
## Operations {#Operations}
-->

## 操作 {#Operations}

<!--
### `get` read the specified Namespace

#### HTTP Request

GET /api/v1/namespaces/{name}

#### Parameters
-->
<hr>

### `get` 读取指定的 Namespace

#### HTTP 请求

GET /api/v1/namespaces/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Namespace

- **pretty** (*in query*): string
-->
- **name** (**路径参数**)：string，必需

  Namespace 的名称

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

401：Unauthorized

<!--
### `get` read status of the specified Namespace

#### HTTP Request

GET /api/v1/namespaces/{name}/status

#### Parameters
-->
### `get` 读取指定 Namespace 的状态

#### HTTP 请求

GET /api/v1/namespaces/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Namespace
-->
- **name** (**路径参数**)：string，必需

  Namespace 的名称
<!--
- **pretty** (*in query*): string
-->

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

401：Unauthorized

<!--
### `list` list or watch objects of kind Namespace

#### HTTP Request

GET /api/v1/namespaces

#### Parameters
-->
### `list` 列出或者检查类别为 Namespace 的对象

#### HTTP 请求

GET /api/v1/namespaces

#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean
-->
- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceList" >}}">NamespaceList</a>)：OK

401：Unauthorized

<!--
### `create` create a Namespace

#### HTTP Request

POST /api/v1/namespaces

#### Parameters
-->
### `create` 创建一个 Namespace

#### HTTP 请求

POST /api/v1/namespaces

#### 参数
<!--
- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, required
-->
- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*):string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

202 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Accepted

401：Unauthorized

<!--
### `update` replace the specified Namespace

#### HTTP Request

PUT /api/v1/namespaces/{name}

#### Parameters
-->
### `update` 替换指定的 Namespace

#### HTTP 请求

PUT /api/v1/namespaces/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, required
-->
- **name** (**路径参数**)：string，必需

  Namespace 的名称

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>， 必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401：Unauthorized

<!--
### `update` replace finalize of the specified Namespace

#### HTTP Request

PUT /api/v1/namespaces/{name}/finalize

#### Parameters
-->
### `update` 替换指定 Namespace 的终结器

#### HTTP 请求

PUT /api/v1/namespaces/{name}/finalize

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, required
-->
- **name** (**路径参数**)：string，必需

  Namespace 的名称

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401：Unauthorized

<!--
### `update` replace status of the specified Namespace

#### HTTP Request

PUT /api/v1/namespaces/{name}/status

#### Parameters
-->
### `update` 替换指定 Namespace 的状态

#### HTTP 请求

PUT /api/v1/namespaces/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, required
-->
- **name** (**路径阐述**)：string，必需

  Namespace 的名称

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>，必需  

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401: Unauthorized

<!--
### `patch` partially update the specified Namespace

#### HTTP Request

PATCH /api/v1/namespaces/{name}

#### Parameters
-->
### `patch` 部分更新指定的 Namespace

#### HTTP 请求

PATCH /api/v1/namespaces/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Namespace
-->
- **name** (**路径参数**)：string，必需

  Namespace 的名称

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需
  
<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Namespace

#### HTTP Request

PATCH /api/v1/namespaces/{name}/status

#### Parameters
-->
### `patch` 部分更新指定 Namespace 的状态

#### HTTP 请求

PATCH /api/v1/namespaces/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Namespace
-->
- **name** (**路径参数**)：string，必需

  Namespace 的名称

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需
  

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应


200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401：Unauthorized

<!--
### `delete` delete a Namespace

#### HTTP Request

DELETE /api/v1/namespaces/{name}

#### Parameters
-->
### `delete` 删除一个 Namespace

#### HTTP 请求

DELETE /api/v1/namespaces/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Namespace
-->
- **name** (**路径参数**)：string，必需

  Namespace 的名称

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (*查询参数*)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>)：OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>)：Accepted

401：Unauthorized
