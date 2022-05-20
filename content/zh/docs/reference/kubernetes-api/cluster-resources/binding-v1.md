---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Binding"
content_type: "api_reference"
description: "Binding 即将一个对象与另一个对象联系起来;例如，一个 pod 被调度程序绑定到一个节点。"
title: "Binding"
weight: 9
auto_generated: true
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


## Binding {#Binding}
<!--
Binding ties one object to another; for example, a pod is bound to a node by a scheduler. Deprecated in 1.7, please use the bindings subresource of pods instead.
-->
Binding 即将一个对象与另一个对象联系起来;例如，一个 pod 被调度程序绑定到一个节点。1.7已弃用，请使用 pods 的 bindings 子资源。
<hr>

- **apiVersion**: v1


- **kind**: Binding


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
<!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **target** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>), required

  The target object that you want to bind to the standard object.
-->
  标准对象的元数据 更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **target** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>), 必需的

  要绑定到标准对象的目标对象。

## Operations {#Operations}

<hr>

<!--
### `create` create a Binding

#### HTTP Request

POST /api/v1/namespaces/{namespace}/bindings

#### Parameters
-->
### `创建` 创建一个 Binding

#### HTTP 请求

POST /api/v1/namespaces/{namespace}/bindings

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>, required
-->
- **namespace** (**在路径上**): string, 必需的

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>, 必需的

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

-->
- **dryRun** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **fieldValidation** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized

<!--
### `create` create binding of a Pod

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods/{name}/binding
-->
### `create` 创建Pod的绑定

#### HTTP 请求

POST /api/v1/namespaces/{namespace}/pods/{name}/binding
<!--
#### Parameters


- **name** (*in path*): string, required

  name of the Binding


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>, required
-->
#### 参数

- **name** (*在路径内*): string, 必需的

  Binding 的名称

- **namespace** (*在路径内*): string, 必需的

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>, 必需的

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
- **dryRun** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized
