---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1"
  import: "k8s.io/api/scheduling/v1"
  kind: "PriorityClass"
content_type: "api_reference"
description: "`PriorityClass` визначає зіставлення імені класу пріоритету з цілим значенням пріоритету."
title: "PriorityClass"
weight: 14
auto_generated: true
---

`apiVersion: scheduling.k8s.io/v1`

`import "k8s.io/api/scheduling/v1"`

## PriorityClass {#PriorityClass}

`PriorityClass` визначає зіставлення імені класу пріоритету з цілим значенням пріоритету.

---

- **apiVersion**: scheduling.k8s.io/v1

- **kind**: PriorityClass

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **value** (int32), обовʼязково

  Представляє ціле значення цього класу пріоритету. Це фактичний пріоритет, який отримують Podʼи, коли вони мають імʼя цього класу у їхній специфікації.

- **description** (string)

  Опис є довільним рядком, який зазвичай надає вказівки про те, коли слід використовувати цей клас пріоритету.

- **globalDefault** (boolean)

  Визначає, чи слід вважати цей PriorityClass за стандартний пріоритет для Podʼів, які не мають жодного класу пріоритету. Може бути встановлено лише один PriorityClass як `globalDefault`. Однак, якщо існує більше одного PriorityClass з полем `globalDefault`, встановленим на true, то за стандартний пріоритет буде використовувати найменше значення серед таких глобальних пріоритетних класів.

- **preemptionPolicy** (string)

  Політика для випередження Podʼів з нижчим пріоритетом. Один із варіантів: Never, PreemptLowerPriority. Стандартно використовується PreemptLowerPriority, якщо не встановлено жодного значення.

  Можливі значення переліку (enum):
  - `"Never"` означає, що цей pod ніколи не витісняє інші podʼи з нижчим пріоритетом.
  - `"PreemptLowerPriority"` означає, що цей pod може витісняти інші podʼи з нижчим пріоритетом.

## PriorityClassList {#PriorityClassList}

---

- **apiVersion**: scheduling.k8s.io/v1

- **kind**: PriorityClassList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>), обовʼязково

  items — це список класів пріоритету

## Операції {#operations}

---

### `get` отримати вказаний PriorityClass {#get-read-the-specified-priorityclass}

#### HTTP запит {#http-request}

GET /apis/scheduling.k8s.io/v1/priorityclasses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityClass

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PriorityClass {#list-list-or-watch-objects-of-kind-priorityclass}

#### HTTP запит {#http-request-1}

GET /apis/scheduling.k8s.io/v1/priorityclasses

#### Параметри {#parameters-1}

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

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClassList" >}}">PriorityClassList</a>): OK

401: Unauthorized

### `create` створення PriorityClass {#create-create-a-priorityclass}

#### HTTP запит {#http-request-2}

POST /apis/scheduling.k8s.io/v1/priorityclasses

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

202 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Accepted

401: Unauthorized

### `update` заміна вказаного PriorityClass {#update-replace-the-specified-priorityclass}

#### HTTP запит {#http-request-3}

PUT /apis/scheduling.k8s.io/v1/priorityclasses/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityClass

- **body**: <a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного PriorityClass {#patch-partially-update-the-specified-priorityclass}

#### HTTP запит {#http-request-4}

PATCH /apis/scheduling.k8s.io/v1/priorityclasses/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityClass

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

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

401: Unauthorized

### `delete` видалення PriorityClass {#delete-delete-a-priorityclass}

#### HTTP запит {#http-request-5}

DELETE /apis/scheduling.k8s.io/v1/priorityclasses/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityClass

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

#### Відповідь {#response-5}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції PriorityClass {#deletecollection-delete-collection-of-priorityclass}

#### HTTP запит {#http-request-6}

DELETE /apis/scheduling.k8s.io/v1/priorityclasses

#### Параметри {#parameters-6}

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
