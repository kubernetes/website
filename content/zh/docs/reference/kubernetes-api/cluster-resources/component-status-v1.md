---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ComponentStatus"
content_type: "api_reference"
description: "ComponentStatus (和 ComponentStatusList) 保存集群验证信息。"
title: "组件状态"
weight: 10
auto_generated: flase
---

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

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## ComponentStatus {#ComponentStatus}

<!--
ComponentStatus (and ComponentStatusList) holds the cluster validation info. Deprecated: This API is deprecated in v1.19+
-->
ComponentStatus (和 ComponentStatusList) 保存集群验证信息。已弃用:此API在v1.19+版本已弃用
<hr>

- **apiVersion**: v1


- **kind**: ComponentStatus


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
<!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
  标准对象的 metadata。更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
- **conditions** ([]ComponentCondition)
<!--  
  *Patch strategy: merge on key `type`*

  List of component conditions observed

 <a name="ComponentCondition"></a>
  *Information about the condition of a component.*
-->
  *补丁策略：合并在 `type` 健上*

  观察到的组件条件列表

  *有关组件条件的信息。*
<!--
  - **conditions.status** (string), required

    Status of the condition for a component. Valid values for "Healthy": "True", "False", or "Unknown".
-->
  - **conditions.status** (string), 必需的
    
    组件的条件状态。有效值为 "Healthy": "True", "False", or "Unknown"。
<!--
  - **conditions.type** (string), required

    Type of condition for a component. Valid value: "Healthy"
-->
  - **conditions.type** (string), 必需的

    组件的条件类型。 有效值为: "Healthy"
  - **conditions.error** (string)
<!--
    Condition error code for a component. For example, a health check error code.
-->

    组件的条件错误代码。 例如， 健康检查错误代码。

  - **conditions.message** (string)
<!--
    Message about the condition for a component. For example, information about a health check.
-->
    关于组件条件的消息。例如，健康检查信息。



## ComponentStatusList {#ComponentStatusList}
<!--
Status of all the conditions for the component as a list of ComponentStatus objects. Deprecated: This API is deprecated in v1.19+
-->
组件的所有条件的状态，作为 ComponentStatus 对象的列表。已弃用:此API在v1.19+版本已弃用。
<hr>

- **apiVersion**: v1


- **kind**: ComponentStatusList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
<!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
  标准 metadata 列表。更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
<!--
- **items** ([]<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>), required

  List of ComponentStatus objects.
-->
- **items** ([]<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>), 必需的

  ComponentStatus 对象列表。




## Operations {#Operations}



<hr>





<!--
### `get` read the specified ComponentStatus

#### HTTP Request

GET /api/v1/componentstatuses/{name}

#### Parameters
-->
### `get` 读取指定的组件状态。

#### HTTP 请求

GET /api/v1/componentstatuses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the ComponentStatus


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

-->

- **name** (*在路径内*): string, 必需的

  ComponentStatus 的名称。


- **pretty** (*在查询时*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>): OK

401: Unauthorized
-->
#### 响应


200 (<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>): 成功

401: 未经授权的
<!--
### `list` list objects of kind ComponentStatus

#### HTTP Request

GET /api/v1/componentstatuses
-->
### `list` 列出种类为 ComponentStatus 的对象

#### HTTP 请求	

GET /api/v1/componentstatuses
<!--
#### Parameters

-->
#### 参数

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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>


<!--
#### Response
-->
#### 参数
<!--
200 (<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatusList" >}}">ComponentStatusList</a>): OK

401: Unauthorized
-->
200 (<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatusList" >}}">ComponentStatusList</a>): 成功

401: 未经授权的

