---
api_metadata:
  apiVersion: "coordination.k8s.io/v1"
  import: "k8s.io/api/coordination/v1"
  kind: "Lease"
content_type: "api_reference"
description: "Lease визначає концепцію оренди."
title: "Lease"
weight: 5
auto_generated: false
---

`apiVersion: coordination.k8s.io/v1`

`import "k8s.io/api/coordination/v1"`

## Lease {#Lease}

Lease визначає концепцію оренди.

---

- **apiVersion**: coordination.k8s.io/v1

- **kind**: Lease

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/lease-v1#LeaseSpec" >}}">LeaseSpec</a>)

  Spec містить специфікацію оренди. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## LeaseSpec {#LeaseSpec}

LeaseSpec — це специфікація оренди.

---

- **acquireTime** (MicroTime)

  acquireTime — це час, коли поточну оренду було отримано.

  <a name="MicroTime"></a>
  *MicroTime — це версія Time з точністю до мікросекунд.*

- **holderIdentity** (string)

  holderIdentity містить ідентифікатор власника поточної оренди. Якщо використовується координований вибір лідера, ідентифікатор власника повинен відповідати значенню поля LeaseCandidate.metadata.name, яке було обране.

- **leaseDurationSeconds** (int32)

  leaseDurationSeconds — це тривалість, яку кандидати на оренду повинні чекати, щоб примусово її отримати. Вона вимірюється від часу останнього спостережуваного renewTime.

- **leaseTransitions** (int32)

  leaseTransitions — це кількість переходів оренди між власниками.

- **preferredHolder** (string)

  PreferredHolder сигналізує тримачу лізингу, що існує більш оптимальний тримач лізингу і що лізинг слід передати. Це поле може бути встановлене лише якщо також встановлена стратегія (Strategy).

- **renewTime** (MicroTime)

  renewTime — це час, коли поточний власник оренди останнього разу оновив оренду.

  <a name="MicroTime"></a>
  *MicroTime — це версія Time з точністю до мікросекунд.*

- **strategy** (string)

  Strategy вказує стратегію для вибору лідера в координованому виборі лідера. Якщо це поле не вказано, координування для цього лізингу не активне. (Альфа) Для використання цього поля потрібно увімкнути функціональну можливість CoordinatedLeaderElection.

## LeaseList {#LeaseList}

LeaseList — це список обʼєктів Lease.

---

- **apiVersion**: coordination.k8s.io/v1

- **kind**: LeaseList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>), обовʼязково

  items — це список обʼєктів схеми.

## Операції {#operations}

---

### `get` отримати вказаний Lease {#get-read-the-specified-lease}

#### HTTP запит {#http-request}

GET /apis/coordination.k8s.io/v1/namespaces/{namespace}/leases/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя Lease

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Lease {#list-list-or-watch-objects-of-kind-lease}

#### HTTP запит {#http-request-1}

GET /apis/coordination.k8s.io/v1/namespaces/{namespace}/leases

#### Параметри {#parameters-1}

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

#### Відповідь {#response-1}

200 (<a href="{{< ref "../cluster-resources/lease-v1#LeaseList" >}}">LeaseList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Lease {#list-list-or-watch-objects-of-kind-lease-1}

#### HTTP запит {#http-request-2}

GET /apis/coordination.k8s.io/v1/leases

#### Параметри {#parameters-2}

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

200 (<a href="{{< ref "../cluster-resources/lease-v1#LeaseList" >}}">LeaseList</a>): OK

401: Unauthorized

### `create` створення Lease {#create-create-a-lease}

#### HTTP запит {#http-request-3}

POST /apis/coordination.k8s.io/v1/namespaces/{namespace}/leases

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>): Created

202 (<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Lease {#update-replace-the-specified-lease}

#### HTTP запит {#http-request-4}

PUT /apis/coordination.k8s.io/v1/namespaces/{namespace}/leases/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя Lease

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Lease {#patch-partially-update-the-specified-lease}

#### HTTP запит {#http-request-5}

PATCH /apis/coordination.k8s.io/v1/namespaces/{namespace}/leases/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя Lease

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

#### Відповідь {#response-5}

200 (<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-v1#Lease" >}}">Lease</a>): Created

401: Unauthorized

### `delete` видалення Lease {#delete-delete-a-lease}

#### HTTP запит {#http-request-6}

DELETE /apis/coordination.k8s.io/v1/namespaces/{namespace}/leases/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя Lease

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції Lease {#deletecollection-delete-collection-of-lease}

#### HTTP запит {#http-request-7}

DELETE /apis/coordination.k8s.io/v1/namespaces/{namespace}/leases

#### Параметри {#parameters-7}

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

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
