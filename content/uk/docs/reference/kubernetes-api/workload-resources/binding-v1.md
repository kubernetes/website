---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Binding"
content_type: "api_reference"
description: "Звʼязування привʼязує один обʼєкт до іншого; наприклад, Pod привʼязується до вузла планувальником."
title: "Binding"
weight: 2
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Binding {#Binding}

Binding звʼязує один обʼєкт з іншим; наприклад, Pod звʼязується з вузлом за допомогою планувальника.

---

- **apiVersion**: v1

- **kind**: Binding

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **target** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>), обовʼязково

  Цільовий обʼєкт, з яким ви хочете звʼязати стандартний обʼєкт.

## Операції {#Операції}

---

### `create` створення Binding {#create-create-a-binding}

#### HTTP запит {#http-request}

POST /api/v1/namespaces/{namespace}/bindings

#### Параметри {#parameters}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized

### `create` створення звʼязування для Pod {#create-create-binding-of-a-pod}

#### HTTP запит {#http-request-1}

POST /api/v1/namespaces/{namespace}/pods/{name}/binding

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя Binding

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): OK

201 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Created

202 (<a href="{{< ref "../workload-resources/binding-v1#Binding" >}}">Binding</a>): Accepted

401: Unauthorized
