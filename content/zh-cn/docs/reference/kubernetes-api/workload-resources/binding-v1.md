---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Binding"
content_type: "api_reference"
description: "Binding 将一个对象与另一个对象绑定起来；例如，调度程序将一个 Pod 绑定到一个节点。"
title: "Binding"
weight: 2
auto_generated: true
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Binding"
content_type: "api_reference"
description: "Binding ties one object to another; for example, a pod is bound to a node by a scheduler."
title: "Binding"
weight: 2
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Binding {#Binding}

<!--
Binding ties one object to another; for example, a pod is bound to a node by a scheduler. Deprecated in 1.7, please use the bindings subresource of pods instead.
-->
Binding 将一个对象与另一个对象绑定在一起；例如，调度程序将一个 Pod 绑定到一个节点。
1.7 版中已弃用，请使用 Pod 的 Binding 子资源代替。

<hr>

- **apiVersion**: v1

- **kind**: Binding

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **target** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>), required

  <!--
  The target object that you want to bind to the standard object.
  -->
  想要绑定到标准对象的目标对象。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `create` create a Binding

#### HTTP Request
-->
### `create` 创建 Binding

POST /api/v1/namespaces/{namespace}/bindings

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>, required
-->
#### 参数

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
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

200 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized

<!--
### `create` create binding of a Pod

#### HTTP Request
-->
### `create` 创建 Pod 的 binding

POST /api/v1/namespaces/{namespace}/pods/{name}/binding

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the Binding

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
#### 参数

- **name** (**路径参数**): string, 必需

  CronJob 的名称

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
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

200 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized
