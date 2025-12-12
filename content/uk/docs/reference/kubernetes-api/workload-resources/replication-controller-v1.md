---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ReplicationController"
content_type: "api_reference"
description: "ReplicationController представляє конфігураці. контролера реплікації."
title: "ReplicationController"
weight: 4
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ReplicationController {#ReplicationController}

ReplicationController представляє конфігурацію контролера реплікації.

---

- **apiVersion**: v1

- **kind**: ReplicationController

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Якщо мітки (Labels) ReplicationController пусті, вони стандартно встановлюються такими ж, як у Pod(ів), які контролює replication controller. Стандартні метадані обʼєкта. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerSpec" >}}">ReplicationControllerSpec</a>)

  Spec визначає специфікацію бажаної поведінки replication controller. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerStatus" >}}">ReplicationControllerStatus</a>)

  Status — це останній спостережуваний статус replication controller. Ці дані можуть бути застарілими на деякий час. Заповнюється системою. Тільки для читання. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ReplicationControllerSpec {#ReplicationControllerSpec}

ReplicationControllerSpec — це специфікація контролера реплікації.

---

- **selector** (map[string]string)

  Selector — це запит міток (label query) з Podʼів, які повинні відповідати кількості реплік. Якщо Selector порожній, стандартно встановлюються мітки, які присутні в шаблоні Pod. Ключі та значення міток, які повинні збігатись для контролю цим контролером реплікації, за відсутності стандартних значень встановлюються мітки з шаблону Pod. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  Template — це обʼєкт, який описує Pod, який буде створений у разі виявлення недостатньої кількості реплік. Це має перевагу над TemplateRef. Єдине дозволене значення template.spec.restartPolicy — "Always". Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template](/docs/concepts/workloads/controllers/replicationcontroller#pod-template)

- **replicas** (int32)

  Replicas — це кількість бажаних реплік. Це вказівка для розрізнення між явним нульовим значенням та невказаною кількістю. Стандартне значення — 1. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller](/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller)

- **minReadySeconds** (int32)

  Мінімальна кількість секунд, протягом яких новий створений Pod повинен бути готовим без збоїв жодного з його контейнерів, щоб його вважати доступним. Стандартне значення — 0 (Pod буде вважатися доступним, як тільки він буде готовий)

## ReplicationControllerStatus {#ReplicationControllerStatus}

ReplicationControllerStatus представляє поточний статус контролера реплікації.

---

- **replicas** (int32), обовʼязково

  Replicas — це найновіша зафіксована кількість реплік. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller](/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller)

- **availableReplicas** (int32)

  Кількість доступних реплік (готових принаймні протягом minReadySeconds) для цього контролера реплікації.

- **readyReplicas** (int32)

  Кількість готових реплік для цього контролера реплікації.

- **fullyLabeledReplicas** (int32)

  Кількість Podʼів, які мають мітки, що відповідають міткам шаблону Pod контролера реплікації.

- **conditions** ([]ReplicationControllerCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Представляє останні доступні спостереження поточного стану контролера реплікації.

  <a name="ReplicationControllerCondition"></a>
  *ReplicationControllerCondition описує стан контролера реплікації в певний момент.*

  - **conditions.status** (string), обовʼязково

    Статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану контролера реплікації.

  - **conditions.lastTransitionTime** (Time)

    Останній час переходу стану з одного статусу в інший.

    <a name="Time"></a>
    *Time є обгорткою навколо time.Time, яка підтримує правильне перетворення в YAML та JSON. Надаються обгортки для багатьох методів створення, які пропонує пакет time.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, із зазначенням деталей про перехід.

  - **conditions.reason** (string)

    Причина останнього переходу умови.

- **observedGeneration** (int64)

  ObservedGeneration показує покоління останнього спостереження контролера реплікації.

## ReplicationControllerList {#ReplicationControllerList}

ReplicationControllerList — це колекція контролерів реплікації.

---

- **apiVersion**: v1

- **kind**: ReplicationControllerList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>), обовʼязково

  Список контролерів реплікації. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller](/docs/concepts/workloads/controllers/replicationcontroller)

## Операції {#operations}

---

### `get` читання вказаного ReplicationController {#get-read-the-specified-replicationcontroller}

#### HTTP-запит {#http-request}

GET /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicationController

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): ОК

401: Unauthorized

### `get` читання статусу вказаного ReplicationController {#get-read-status-of-the-specified-replicationcontroller}

#### HTTP-запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicationController

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): ОК

401: Unauthorized

### `list` перелік або спостереження за обʼєктами типу ReplicationController {#list-list-or-watch-objects-of-kind-replicationcontroller}

#### HTTP-запит {#http-request-2}

GET /api/v1/namespaces/{namespace}/replicationcontrollers

#### Параметри {#parameters-2}

- **namespace** (*в шляху*): string, обов\язково

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

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerList" >}}">ReplicationControllerList</a>): ОК

401: Unauthorized

### `list` перелік або спостереження за обʼєктами типу ReplicationController {#list-list-or-watch-objects-of-kind-replicationcontroller-1}

#### HTTP-запит {#http-request-3}

GET /api/v1/replicationcontrollers

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

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerList" >}}">ReplicationControllerList</a>): ОК

401: Unauthorized

### `create` створення ReplicationController {#create-create-a-replicationcontroller}

#### HTTP-запит {#http-request-4}

POST /api/v1/namespaces/{namespace}/replicationcontrollers

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): ОК

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

202 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ReplicationController {#update-replace-the-specified-replicationcontroller}

#### HTTP-запит {#http-request-5}

PUT /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicationController

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): ОК

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного ReplicationController {#update-replace-status-of-the-specified-replicationcontroller}

#### HTTP-запит {#http-request-6}

PUT /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicationController

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): ОК

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ReplicationController {#patch-partially-update-the-specified-replicationcontroller}

#### HTTP-запит {#http-request-7}

PATCH /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicationController

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): ОК

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного ReplicationController {#patch-partially-update-status-of-the-specified-replicationcontroller}

#### HTTP-запит {#http-request-8}

PATCH /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicationController

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

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): ОК

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

### `delete` видалення ReplicationController {#delete-delete-a-replicationcontroller}

#### HTTP-запит {#http-request-9}

DELETE /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicationController

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): ОК

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ReplicationController {#deletecollection-delete-collection-of-replicationcontroller}

#### HTTP-запит {#http-request-10}

DELETE /api/v1/namespaces/{namespace}/replicationcontrollers

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

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): ОК

401: Unauthorized
