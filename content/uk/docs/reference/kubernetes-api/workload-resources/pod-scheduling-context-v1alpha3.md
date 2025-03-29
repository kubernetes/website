---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "PodSchedulingContext"
content_type: "api_reference"
description: "Обʼєкти PodSchedulingContext містять інформацію, необхідну для планування Pod з ResourceClaims, що використовують режим виділення \"WaitForFirstConsumer\"."
title: "PodSchedulingContext v1alpha3"
weight: 15
auto_generated: false
---

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`

## PodSchedulingContext {#PodSchedulingContext}

Обʼєкти PodSchedulingContext містять інформацію, необхідну для планування Pod з ResourceClaims, що використовують режим виділення "WaitForFirstConsumer".

Це тип альфа-версії та потребує включення функціональних можливостей DRAControlPlaneController.

---

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: PodSchedulingContext

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Метадані стандартного обʼєкта

- **spec** (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextSpec" >}}">PodSchedulingContextSpec</a>), обовʼязково

  Специфікація описує, де потрібні ресурси для Pod.

- **status** (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextStatus" >}}">PodSchedulingContextStatus</a>)

  Статус описує, де можуть бути виділені ресурси для Pod.

## PodSchedulingContextSpec {#PodSchedulingContextSpec}

PodSchedulingContextSpec описує, де потрібні ресурси для Pod.

---

- **potentialNodes** ([]string)

  *Atomic: буде замінено під час злиття*

  PotentialNodes перелічує вузли, де можливий запуск Pod.

  Розмір цього поля обмежений 128. Цього достатньо для багатьох кластерів. В більших кластерах може знадобитися більше спроб для знаходження вузла, що відповідає всім очікуваним ресурсам. В майбутньому це обмеження може бути збільшено, але не зменшено.

- **selectedNode** (string)

  SelectedNode — це вузол, для якого буде виконана спроба виділити ресурси, на які посилається Pod і які використовують виділення "WaitForFirstConsumer".

## PodSchedulingContextStatus {#PodSchedulingContextStatus}

PodSchedulingContextStatus описує, де можуть бути виділені ресурси для Pod.

---

- **resourceClaims** ([]ResourceClaimSchedulingStatus)

  *Map: унікальні значення за ключем будуть збережені під час обʼєднання*

  ResourceClaims описує доступність ресурсів для кожного входження pod.spec.resourceClaims, де відповідний ResourceClaim використовує режим виділення "WaitForFirstConsumer".

  <a name="ResourceClaimSchedulingStatus"></a>
  *ResourceClaimSchedulingStatus містить інформацію про конкретний ResourceClaim з режимом виділення "WaitForFirstConsumer".*

  - **resourceClaims.name** (string), обовʼязково

    Імʼя відповідає полю pod.spec.resourceClaims[*].Name.

  - **resourceClaims.unsuitableNodes** ([]string)

    *Atomic: буде замінено під час злиття*

    UnsuitableNodes перелічує вузли, для яких ResourceClaim не може бути виділено.

    Розмір цього поля обмежений 128, так само як і для PodSchedulingSpec.PotentialNodes. Це обмеження може бути збільшено в майбутньому, але не зменшено.

## PodSchedulingContextList {#PodSchedulingContextList}

PodSchedulingContextList є колекцією обʼєктів планування Pod.

---

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: PodSchedulingContextList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку

- **items** ([]<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>), обовʼязково

  Items — це список обʼєктів PodSchedulingContext.

## Операції {#operations}

---

### `get` отримати вказаний PodSchedulingContext {#get-read-the-specified-podschedulingcontext}

#### HTTP запит {#http-request}

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя контексту планування для Pod

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

401: Unauthorized

### `get` отримати статус вказаного PodSchedulingContext {#get-read-the-status-of-the-specified-podschedulingcontext}

#### HTTP запит {#http-request-1}

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя контексту планування для Pod

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodSchedulingContext {#list-list-or-watch-objects-of-kind-podschedulingcontext}

#### HTTP запит {#http-request-2}

GET /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

#### Параметри {#parameters-2}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextList" >}}">PodSchedulingContextList</a>): OK

401: Unauthorized

### `list` список або перегляд обʼєктів типу PodSchedulingContext {#list-list-or-watch-objects-of-kind-podschedulingcontext-1}

#### HTTP запит {#http-request-3}

GET /apis/resource.k8s.io/v1alpha3/podschedulingcontexts

#### Параметри {#parameters-3}

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContextList" >}}">PodSchedulingContextList</a>): OK

401: Unauthorized

### `create` створення PodSchedulingContext {#create-create-a-podschedulingcontext}

#### HTTP запит {#http-request-4}

POST /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Accepted

401: Unauthorized

### `update` заміна вказаного PodSchedulingContext {#update-replace-the-specified-podschedulingcontext}

#### HTTP запит {#http-request-5}

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя контексту планування для Pod

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized


### `update` заміна статусус вказаного PodSchedulingContext {#update-replace-the-status-of-the-specified-podschedulingcontext}

#### HTTP запит {#http-request-6}

PUT /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва the PodSchedulingContext

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного PodSchedulingContext {#patch-partially-update-the-specified-podschedulingcontext}

#### HTTP запит {#http-request-7}

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя контексту планування для Pod

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

401: Unauthorized


### `patch` часткове оновлення статусу вказаного PodSchedulingContext {#patch-partially-update-the-status-of-the-specified-podschedulingcontext}

#### HTTP запит {#http-request-8}

PATCH /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  назва the PodSchedulingContext

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-8}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Created

401: Unauthorized

### `delete` видалення PodSchedulingContext {#delete-delete-a-podschedulingcontext}

#### HTTP запит {#http-request-9}

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodSchedulingContext

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


#### Відповідь {#response-9}

200 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-scheduling-context-v1alpha3#PodSchedulingContext" >}}">PodSchedulingContext</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції PodSchedulingContext {#deletecollection-delete-collection-of-podschedulingcontext}

#### HTTP запит {#http-request-10}

DELETE /apis/resource.k8s.io/v1alpha3/namespaces/{namespace}/podschedulingcontexts

#### Параметри {#parameters-10}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-10}


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
