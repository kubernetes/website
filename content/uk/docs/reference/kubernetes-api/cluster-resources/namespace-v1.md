---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Namespace"
content_type: "api_reference"
description: "Простір імен надає область видимості для імен."
title: "Namespace"
weight: 7
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Namespace {#Namespace}

Namespace надає область видимості для імен. Використання кількох просторів імен є необовʼязковим.

---

- **apiVersion**: v1

- **kind**: Namespace

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceSpec" >}}">NamespaceSpec</a>)

  Spec визначає поведінку простору імен. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceStatus" >}}">NamespaceStatus</a>)

  Status описує поточний статус простору імен. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## NamespaceSpec {#NamespaceSpec}

NamespaceSpec описує атрибути простору імен.

---

- **finalizers** ([]string)

  *Atomic: буде замінено під час злиття*

  Finalizers є непрозорим списком значень, які повинні бути порожніми щоб назавжди видалити обʼєкт з сховища. Докладніше: [https://kubernetes.io/docs/tasks/administer-cluster/namespaces/](/docs/tasks/administer-cluster/namespaces/)

## NamespaceStatus {#NamespaceStatus}

NamespaceStatus — це інформація про поточний статус простору імен.

---

- **conditions** ([]NamespaceCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Представляє останні доступні спостереження поточного стану простору імен.

  <a name="NamespaceCondition"></a>
  *NamespaceCondition містить деталі про стан контролера просторів імен.*

  - **conditions.status** (string), обовʼязково

    Статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану контролера просторів імен.

  - **conditions.lastTransitionTime** (Time)

    Останній час, коли стан переходив з одного статусу в інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    Читабельне для людини повідомлення з деталями останнього переходу.

  - **conditions.reason** (string)

    Унікальна, однослівна, CamelCase причина останнього переходу стану.

- **phase** (string)

  Phase — це поточна фаза життєвого циклу простору імен. Докладніше: [https://kubernetes.io/docs/tasks/administer-cluster/namespaces/](/docs/tasks/administer-cluster/namespaces/)

  Можливі значення переліку (enum):

  - `"Active"` означає, що простір імен доступний для використання в системі.
  - `"Terminating"` означає, що простір імен проходить процес належного припинення роботи.

## NamespaceList {#NamespaceList}

NamespaceList — це список просторів імен.

---

- **apiVersion**: v1

- **kind**: NamespaceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: [https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>), обовʼязково

  Items — це список обʼєктів просторів імен у списку. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/](/docs/concepts/overview/working-with-objects/namespaces/)

## Операції {#operations}

---

### `get` отримати вказаний Namespace {#get-read-the-specified-namespace}

#### HTTP запит {#http-request}

GET /api/v1/namespaces/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя Namespace

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): OK

401: Unauthorized

### `get` отримати статус вказаного Namespace {#get-read-status-of-the-specified-namespace}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя Namespace

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Namespace {#list-list-or-watch-objects-of-kind-namespace}

#### HTTP запит {#http-request-2}

GET /api/v1/namespaces

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

200 (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceList" >}}">NamespaceList</a>): OK

401: Unauthorized

### `create` створення Namespace {#create-create-a-namespace}

#### HTTP запит {#http-request-3}

POST /api/v1/namespaces

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): Created

202 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Namespace {#update-replace-the-specified-namespace}

#### HTTP запит {#http-request-4}

PUT /api/v1/namespaces/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): Created

401: Unauthorized

### `update` заміна, завершення вказаного Namespace {#update-replace-finalize-of-the-specified-namespace}

#### HTTP запит

PUT /api/v1/namespaces/{name}/finalize

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного Namespace {#update-replace-status-of-the-specified-namespace}

#### HTTP запит {#http-request-5}

PUT /api/v1/namespaces/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Namespace {#patch-partially-update-the-specified-namespace}

#### HTTP запит {#http-request-6}

PATCH /api/v1/namespaces/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя Namespace

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного Namespace {#patch-partially-update-status-of-the-specified-namespace}

#### HTTP запит {#http-request-7}

PATCH /api/v1/namespaces/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя Namespace

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

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>): Created

401: Unauthorized

### `delete` видалення Namespace {#delete-delete-a-namespace}

#### HTTP запит {#http-request-8}

DELETE /api/v1/namespaces/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  імʼя Namespace

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
