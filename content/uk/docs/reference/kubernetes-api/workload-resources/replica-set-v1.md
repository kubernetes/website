---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "ReplicaSet"
content_type: "api_reference"
description: "ReplicaSet забезпечує, що в будь-який момент часу задана кількість реплік Podʼів працює."
title: "ReplicaSet"
weight: 5
auto_generated: false
---

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## ReplicaSet {#ReplicaSet}

ReplicaSet забезпечує, що в будь-який момент часу задана кількість реплік Podʼів працює.

---

- **apiVersion**: apps/v1

- **kind**: ReplicaSet

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Якщо мітки ReplicaSet порожні, вони стандартно встановлюються такими самими, як у Pod(ах), яким керує ReplicaSet. Стандартні метадані обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetSpec" >}}">ReplicaSetSpec</a>)

  Spec визначає специфікацію бажаної поведінки ReplicaSet. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetStatus" >}}">ReplicaSetStatus</a>)

  Статус — це останній зареєстрований статус ReplicaSet. Ці дані можуть бути застарілими на деякий час. Заповнюється системою. Тільки для читання. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ReplicaSetSpec {#ReplicaSetSpec}

ReplicaSetSpec — це специфікація ReplicaSet.

---

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), обовʼязково

  Селектор — це запит міток до Podʼів, які повинні відповідати кількості реплік. Ключі міток та їх значення, які повинні відповідати, щоб ними керував цей ReplicaSet. Вони повинні відповідати міткам шаблону Podʼа. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  Шаблон — це обʼєкт, що описує Pod, який буде створений, якщо виявлено недостатню кількість реплік. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/#pod-template](/docs/concepts/workloads/controllers/replicaset/#pod-template)

- **replicas** (int32)

  Replicas — це бажана кількість podʼів. Це вказівник для розрізнювання між явною нульовою та невизначеною кількістю. Стандартне значення — 1. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/replicaset](/docs/concepts/workloads/controllers/replicaset)

- **minReadySeconds** (int32)

  Мінімальна кількість секунд, протягом яких новий створений Pod повинен бути готовим без збоїв жодного з його контейнерів, щоб його вважати доступним. Стандартне значення — 0 (Pod буде вважатися доступним, як тільки він буде готовий)

## ReplicaSetStatus {#ReplicaSetStatus}

ReplicaSetStatus відображає поточний стан ReplicaSet.

---

- **replicas** (int32), обовʼязково

  Replicas — це остання зафіксована кількість podʼів, що не завершують роботу. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/replicaset](/docs/concepts/workloads/controllers/replicaset)

- **availableReplicas** (int32)

  Кількість доступних podʼів, що не завершують роботу (готових протягом принаймні minReadySeconds) для цього набору реплік.

- **readyReplicas** (int32)

  Кількість podʼів, що не завершують свою роботу, на які націлений цей ReplicaSet зі станом Ready.

- **terminatingReplicas** (int32)

  Кількість podʼів, що завершують свою роботу, для цього набору реплік. Podʼи, що завершуються, мають ненульову мітку часу .metadata.deletionTimestamp і ще не досягли фази Failed або Succeeded .status.phase.

  Це бета-поле, яке вимагає увімкнення функціональної можливості DeploymentReplicaSetTerminatingReplicas (типов увімкнено).

- **fullyLabeledReplicas** (int32)

  Кількість podʼів, що не завершують свою роботу, які мають мітки, що відповідають міткам шаблону Podʼа набору реплік.

- **conditions** ([]ReplicaSetCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Представляє останні доступні спостереження поточного стану набору реплік.

  <a name="ReplicaSetCondition"></a>
  *ReplicaSetCondition описує стан набору реплік в певний момент часу.*

  - **conditions.status** (string), обовʼязково

    Статус стану, одне з: True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану набору реплік.

  - **conditions.lastTransitionTime** (Time)

    Останній раз, коли стан переходив з одного статусу в інший.

    <a name="Time"></a>
    *Time - це обгортка навколо time.Time, яка підтримує правильне перетворення у YAML і JSON. Надаються обгортки для багатьох методів, які пропонує пакет time.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, із зазначенням деталей про перехід.

  - **conditions.reason** (string)

    Причина останнього переходу умови.

- **observedGeneration** (int64)

  ObservedGeneration показує покоління останнього зафіксованого ReplicaSet.

## ReplicaSetList {#ReplicaSetList}

ReplicaSetList — це колекція ReplicaSets.

---

- **apiVersion**: apps/v1

- **kind**: ReplicaSetList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>), обовʼязково

  Список ReplicaSets. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/replicaset](/docs/concepts/workloads/controllers/replicaset)

## Операції {#operations}

---

### `get` зчитування вказаного ReplicaSet {#get-read-the-specified-replicaset}

#### HTTP-запит {#http-request}

GET /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicaSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

401: Unauthorized

### `get` зчитування статусу вказаного ReplicaSet {#get-read-the-status-of-the-specified-replicaset}

#### HTTP-запит {#http-request-1}

GET /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicaSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

401: Unauthorized

### `list` список або перегляд обʼєктів типу ReplicaSet {#list-list-or-watch-objects-of-kind-replicaset}

#### HTTP-запит {#http-request-2}

GET /apis/apps/v1/namespaces/{namespace}/replicasets

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetList" >}}">ReplicaSetList</a>): OK

401: Unauthorized

### `list` список або перегляд обʼєктів типу ReplicaSet {#list-list-or-watch-objects-of-kind-replicaset-1}

#### HTTP-запит {#http-request-3}

GET /apis/apps/v1/replicasets

#### Параметри {#parameters-3}

- **`allowWatchBookmarks`** (*в запиті*): boolean

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetList" >}}">ReplicaSetList</a>): OK

401: Unauthorized

### `create` створення ReplicaSet {#create-create-a-replicaset}

#### HTTP-запит {#http-request-4}

POST /apis/apps/v1/namespaces/{namespace}/replicasets

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

202 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ReplicaSet {#update-replace-the-specified-replicaset}

#### HTTP-запит {#http-request-5}

PUT /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicaSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного ReplicaSet {#update-replace-the-status-of-the-specified-replicaset}

#### HTTP-запит {#http-request-6}

PUT /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicaSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ReplicaSet {#patch-partially-update-the-specified-replicaset}

#### HTTP-запит {#http-request-7}

PATCH /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicaSet

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного ReplicaSet {#patch-partially-update-the-status-of-the-specified-replicaset}

#### HTTP-запит {#http-request-8}

PATCH /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicaSet

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized

### `delete` видалення ReplicaSet {#delete-delete-a-replicaset}

#### HTTP-запит {#http-request-9}

DELETE /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  назва ReplicaSet

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ReplicaSet {#deletecollection-delete-collection-of-replicasets}

#### HTTP-запит {#http-request-10}

DELETE /apis/apps/v1/namespaces/{namespace}/replicasets

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
