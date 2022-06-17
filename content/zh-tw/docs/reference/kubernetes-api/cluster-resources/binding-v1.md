---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Binding"
content_type: "api_reference"
description: "Binding 將一個物件與另一個物件聯絡起來; 例如，一個 Pod 被排程程式繫結到一個節點。"
title: "Binding"
weight: 9
auto_generated: true
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## Binding {#Binding}
<!--
Binding ties one object to another; for example, a pod is bound to a node by a scheduler. Deprecated in 1.7, please use the bindings subresource of pods instead.
-->
Binding 將一個物件與另一個物件聯絡起來; 例如，一個 Pod 被排程程式繫結到一個節點。
已在 1.7 版本棄用，請使用 Pod 的 binding 子資源。
<hr>

- **apiVersion**: v1


- **kind**: Binding


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
<!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
  標準物件的元資料， 更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **target** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>), required

  The target object that you want to bind to the standard object.
-->

- **target** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)， 必需

  要繫結到標準物件的目標物件。
<!--
## Operations {#Operations}
-->
## 操作   {#operations}

<hr>

<!--
### `create` create a Binding

#### HTTP Request

POST /api/v1/namespaces/{namespace}/bindings

#### Parameters
-->
### `create` 建立一個 Binding

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/bindings

#### 引數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>, required
-->
- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **fieldValidation** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized

<!--
### `create` create binding of a Pod

#### HTTP Request

POST /api/v1/namespaces/{namespace}/pods/{name}/binding
-->
### `create` 建立 Pod 的繫結

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/pods/{name}/binding
<!--
#### Parameters


- **name** (*in path*): string, required

  name of the Binding


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>, required
-->
#### 引數

- **name** (**路徑引數**): string, 必需

  Binding 的名稱

- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>, 必需

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
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 響應

200 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../cluster-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized
