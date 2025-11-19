---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Binding"
content_type: "api_reference"
description: "Binding 將一個對象與另一個對象綁定起來；例如，調度程序將一個 Pod 綁定到一個節點。"
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
Binding ties one object to another; for example, a pod is bound to a node by a scheduler.
-->
Binding 將一個對象與另一個對象綁定在一起；例如，調度程序將一個 Pod 綁定到一個節點。

<hr>

- **apiVersion**: v1

- **kind**: Binding

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **target** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>), required

  <!--
  The target object that you want to bind to the standard object.
  -->
  想要綁定到標準對象的目標對象。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `create` create a Binding

#### HTTP Request
-->
### `create` 創建 Binding

POST /api/v1/namespaces/{namespace}/bindings

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>, required
-->
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>，必需

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

200 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized

<!--
### `create` create binding of a Pod

#### HTTP Request
-->
### `create` 創建 Pod 的 binding

POST /api/v1/namespaces/{namespace}/pods/{name}/binding

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the Binding

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CronJob 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>，必需

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

200 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized
