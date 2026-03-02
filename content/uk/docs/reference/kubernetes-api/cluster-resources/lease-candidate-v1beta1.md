---
api_metadata:
  apiVersion: "coordination.k8s.io/v1beta1"
  import: "k8s.io/api/coordination/v1beta1"
  kind: "LeaseCandidate"
content_type: "api_reference"
description: "LeaseCandidate визначає кандидата для обʼєкта Lease."
title: "LeaseCandidate v1beta1"
weight: 6
auto_generated: true
---

`apiVersion: coordination.k8s.io/v1beta1`

`import "k8s.io/api/coordination/v1beta1"`

## LeaseCandidate {#LeaseCandidate}

LeaseCandidate визначає кандидата для обʼєкта Lease. Кандидати створюються таким чином, щоб скоординовані вибори лідера обрали найкращого лідера зі списку кандидатів.

---

- **apiVersion**: coordination.k8s.io/v1beta1

- **kind**: LeaseCandidate

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidateSpec" >}}">LeaseCandidateSpec</a>)

  spec містить специфікацію Lease. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## LeaseCandidateSpec {#LeaseCandidateSpec}

LeaseCandidateSpec — це специфікація Lease.

---

- **binaryVersion** (string), обовʼязково

  BinaryVersion - це бінарна версія. Вона має бути у форматі semver без символу `v`. Це поле є обовʼязковим.

- **leaseName** (string), обовʼязково

  LeaseName — імʼя Lease, на який претендує цей кандидат. Обмеження для цього поля такі ж, як і для Lease.name. Кілька кандидатів на оренду можуть посилатися на один і той самий Lease.name. Це поле є незмінним.

- **strategy** (string), обовʼязково

  Strategy — це стратегія, яку координовані вибори лідера будуть використовувати для вибору лідера. Якщо кілька кандидатів на один і той самий Lease повертають різні стратегії, буде використано стратегію, надану кандидатом з найновішою версією BinaryVersion. Якщо конфлікт все ще існує, це є помилкою користувача, і координовані вибори лідера не будуть керувати Lease, доки не буде вирішено.

- **emulationVersion** (string)

  EmulationVersion — версія емуляції. Вона має бути у форматі semver без початкового `v`. EmulationVersion має бути менше або дорівнювати BinaryVersion. Це поле є обовʼязковим, якщо стратегія має значення "OldestEmulationVersion"

- **pingTime** (MicroTime)

  PingTime — це час, коли сервер востаннє запитував LeaseCandidate на поновлення. Це робиться тільки під час виборів лідера, щоб перевірити, чи не став якийсь LeaseCandidate неприйнятним. Коли PingTime буде оновлено, LeaseCandidate відповість оновленням RenewTime.

  <a name="MicroTime"></a>
  *MicroTime — це версія Time з мікросекундною точністю.*

- **renewTime** (MicroTime)

  RenewTime — це час, коли LeaseCandidate востаннє оновлювався. Кожного разу, коли обʼєкту Lease потрібно провести вибори лідера, поле PingTime оновлюється, щоб повідомити обʼєкту LeaseCandidate, що йому слід оновити RenewTime. Старі обʼєкти LeaseCandidate також видаляються, якщо з моменту останнього оновлення пройшло кілька годин. Поле PingTime регулярно оновлюється, щоб запобігти збиранню сміття для все ще активних LeaseCandidates.

  <a name="MicroTime"></a>
  *MicroTime — це версія Time з мікросекундною точністю.*

## LeaseCandidateList {#LeaseCandidateList}

LeaseCandidateList — список обʼєктів Lease.

---

- **apiVersion**: coordination.k8s.io/v1beta1

- **kind**: LeaseCandidateList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>), обовʼязково

  items — список об\єктів схеми.

## Операції {#operations}

---

### `get` отримати вказаний LeaseCandidate {#get-read-the-specified-leasecandidate}

#### HTTP запит {#http-request}

GET /apis/coordination.k8s.io/v1beta1/namespaces/{namespace}/leasecandidates/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя LeaseCandidate

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу LeaseCandidate {#list-list-or-watch-objects-of-kind-leasecandidate}

#### HTTP запит {#http-request-1}

GET /apis/coordination.k8s.io/v1beta1/namespaces/{namespace}/leasecandidates

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

200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidateList" >}}">LeaseCandidateList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу LeaseCandidate {#list-list-or-watch-objects-of-kind-leasecandidate-1}

#### HTTP запит {#http-request-2}

GET /apis/coordination.k8s.io/v1beta1/leasecandidates

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

200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidateList" >}}">LeaseCandidateList</a>): OK

401: Unauthorized

### `create` створення LeaseCandidate {#create-create-a-leasecandidate}

#### HTTP запит {#http-request-3}

POST /apis/coordination.k8s.io/v1beta1/namespaces/{namespace}/leasecandidates

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>): Created

202 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>): Accepted

401: Unauthorized

### `update` заміна вказаного LeaseCandidate {#update-replace-the-specified-leasecandidate}

#### HTTP запит {#http-request-4}

PUT /apis/coordination.k8s.io/v1beta1/namespaces/{namespace}/leasecandidates/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя LeaseCandidate

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного LeaseCandidate {#patch-partially-update-the-specified-leasecandidate}

#### HTTP запит {#http-request-5}

PATCH /apis/coordination.k8s.io/v1beta1/namespaces/{namespace}/leasecandidates/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя LeaseCandidate

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

200 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>): OK

201 (<a href="{{< ref "../cluster-resources/lease-candidate-v1beta1#LeaseCandidate" >}}">LeaseCandidate</a>): Created

401: Unauthorized

### `delete` видалення LeaseCandidate {#delete-delete-a-leasecandidate}

#### HTTP запит {#http-request-6}

DELETE /apis/coordination.k8s.io/v1beta1/namespaces/{namespace}/leasecandidates/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя LeaseCandidate

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

### `deletecollection` видалення колекції LeaseCandidate {#deletecollection-delete-collection-of-leasecandidate}

#### HTTP запит {#http-request-7}

DELETE /apis/coordination.k8s.io/v1beta1/namespaces/{namespace}/leasecandidates

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
