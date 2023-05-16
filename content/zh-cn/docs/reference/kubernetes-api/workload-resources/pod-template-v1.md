---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PodTemplate"
content_type: "api_reference"
description: "PodTemplate 描述一种模板，用来为预定义的 Pod 生成副本。"
title: "PodTemplate"
weight: 2
---

<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PodTemplate"
content_type: "api_reference"
description: "PodTemplate describes a template for creating copies of a predefined pod."
title: "PodTemplate"
weight: 2
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## PodTemplate {#PodTemplate}

<!--
PodTemplate describes a template for creating copies of a predefined pod.
-->
PodTemplate 描述一种模板，用来为预定义的 Pod 生成副本。

<hr>

- **apiVersion**: v1

- **kind**: PodTemplate

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  <!--
  Template defines the pods that will be created from this pod template. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  template 定义将基于此 Pod 模板所创建的 Pod。
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodTemplateSpec {#PodTemplateSpec}

<!--
PodTemplateSpec describes the data a pod should have when created from a template
-->
PodTemplateSpec 描述基于某模板所创建的 Pod 所应具有的数据。

<hr>

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  <!--
  Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  Pod 预期行为的规约。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodTemplateList {#PodTemplateList}

<!--
PodTemplateList is a list of PodTemplates.
-->
PodTemplateList 是 PodTemplate 对象的列表。

<hr>

- **apiVersion**: v1

- **kind**: PodTemplateList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->
  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>), required
-->
- **items** ([]<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>)，必需

  <!--
  List of pod templates
  -->
  PodTemplate 对象列表。

<!--
## Operations {#Operations}

<hr>
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified PodTemplate

#### HTTP Request
-->
### `get` 读取指定的 PodTemplate

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/podtemplates/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the PodTemplate
-->
- **name** （**路径参数**）：string，必需

  PodTemplate 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodTemplate

#### HTTP Request
-->
### `list` 列出或监视 PodTemplate 类型的对象

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/podtemplates

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateList" >}}">PodTemplateList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodTemplate

#### HTTP Request
-->
### `list` 列出或监视 PodTemplate 类型的对象

#### HTTP 请求

GET /api/v1/podtemplates

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateList" >}}">PodTemplateList</a>): OK

401: Unauthorized

<!--
### `create` create a PodTemplate

#### HTTP Request
-->
### `create` 创建一个 PodTemplate

#### HTTP 请求

POST /api/v1/namespaces/{namespace}/podtemplates

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PodTemplate

#### HTTP Request
-->
### `update` 替换指定的 PodTemplate

#### HTTP 请求

PUT /api/v1/namespaces/{namespace}/podtemplates/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the PodTemplate
-->
- **name** （**路径参数**）：string，必需

  PodTemplate 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PodTemplate

#### HTTP Request
-->
### `patch` 部分更新指定的 PodTemplate

#### HTTP 请求

PATCH /api/v1/namespaces/{namespace}/podtemplates/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the PodTemplate
-->
- **name** （**路径参数**）：string，必需

  PodTemplate 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

401: Unauthorized

<!--
### `delete` delete a PodTemplate

#### HTTP Request
-->
### `delete` 删除一个 PodTemplate

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/podtemplates/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the PodTemplate
-->
- **name** （**路径参数**）：string，必需

  PodTemplate 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PodTemplate

#### HTTP Request
-->
### `deletecollection` 删除 PodTemplate 的集合

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/podtemplates

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string
-->
- **continue** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** （**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

