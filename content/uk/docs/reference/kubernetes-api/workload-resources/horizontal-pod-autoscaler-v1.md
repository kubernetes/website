---
api_metadata:
  apiVersion: "autoscaling/v1"
  import: "k8s.io/api/autoscaling/v1"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "Конфігурація горизонтального автомасштабування Podʼів."
title: "HorizontalPodAutoscaler"
weight: 12
auto_generated: false
---

`apiVersion: autoscaling/v1`

`import "k8s.io/api/autoscaling/v1"`

## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

Конфігурація горизонтального автомасштабування Podʼів.

---

- **apiVersion**: autoscaling/v1

- **kind**: HorizontalPodAutoscaler

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **spec** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a>)

  spec визначає поведінку автомасштабування. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.

- **status** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a>)

  status містить поточну інформацію про автомасштабування.

## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

Специфікація горизонтального автомасштабування Podʼів.

---

- **maxReplicas** (int32), обовʼязково

  maxReplicas — верхня межа для кількості Podʼів, яку може встановити автомасштабувальник; не може бути менше, ніж MinReplicas.

- **scaleTargetRef** (CrossVersionObjectReference), обовʼязково

  посилання на масштабований ресурс; горизонтальний автомасштабувальник  Podʼів буде вивчати поточне використання ресурсу і встановлювати бажану кількість Podʼів за допомогою його субресурсу Scale (масштаб).

  <a name="CrossVersionObjectReference"></a>
  *CrossVersionObjectReference містить достатньо інформації для ідентифікації зазначеного ресурсу.*

  - **scaleTargetRef.kind** (string), обовʼязково

    kind — це тип посилання; Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  - **scaleTargetRef.name** (string), обовʼязково

    name — це імʼя посилання; Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

  - **scaleTargetRef.apiVersion** (string)

    apiVersion - версія API посилання

- **minReplicas** (int32)

  minReplicas — нижня межа для кількості реплік, до яких може масштабуватися автомасштабувальник. Стандартне значення — 1 Pod. minReplicas може бути 0, якщо увімкнутий альфа-функціонал HPAScaleToZero і налаштовано принаймні одну метрику Object або External. Масштабування активне, поки є принаймні значення однієї метрики.

- **targetCPUUtilizationPercentage** (int32)

  targetCPUUtilizationPercentage — це цільове середнє використання CPU (представлене як відсоток від запитаного показника CPU) для всіх Podʼів; якщо не вказано, буде використана стандартна політика автоматичного масштабування.

## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

Поточний статус горизонтального автомасштабування Podʼів.

---

- **currentReplicas** (int32), обовʼязково

  currentReplicas — поточна кількість реплік Podʼів, що керуються цим автомасштабувальником.

- **desiredReplicas** (int32), обовʼязково

  desiredReplicas — бажана кількість реплік Podʼів, що керуються цим автомасштабувальником.

- **currentCPUUtilizationPercentage** (int32)

  currentCPUUtilizationPercentage — поточне середнє використання CPU у всіх Podʼах, виражене як відсоток від запитаної кількості CPU; наприклад, значення 70 означає, що в середньому Pod використовує зараз 70% свого запитаного CPU.

- **lastScaleTime** (Time)

  lastScaleTime — час останнього масштабування HorizontalPodAutoscaler кількості Podʼів; використовується автомасштабувальником для контролю частоти змін кількості Podʼів.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **observedGeneration** (int64)

  observedGeneration — останнє покоління, сяке спостерігається цим автомасштабувальником.

## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

Список обʼєктів горизонтального автомасштабування Podʼів.

---

- **apiVersion**: autoscaling/v1

- **kind**: HorizontalPodAutoscalerList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку.

- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>), обовʼязкове поле

  items — список обʼєктів горизонтального автомасштабування Podʼів.

## Операції {#operations}

---

### `get` отримати вказаний HorizontalPodAutoscaler {#get-read-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request}

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

### `get` отримати статус вказаного HorizontalPodAutoscaler {#get-read-status-of-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-1}

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

### `list` список або перегляд за обʼєктів типу HorizontalPodAutoscaler {#list-list-or-watch-objects-of-kind-horizontalpodautoscaler}

#### HTTP запит {#http-request-2}

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

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

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

### `list` список або перегляд обʼєктів типу HorizontalPodAutoscaler {#list-list-or-watch-objects-of-kind-horizontalpodautoscaler-1}

#### HTTP запит {#http-request-3}

GET /apis/autoscaling/v1/horizontalpodautoscalers

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

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): ОК

401: Unauthorized

### `create` створення HorizontalPodAutoscaler {#create-create-a-horizontalpodautoscaler}

#### HTTP запит {#http-request-4}

POST /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): ОК

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

202 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Accepted

401: Unauthorized

### `update` заміна вказаного HorizontalPodAutoscaler {#update-replace-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-5}

PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  Назва HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): ОК

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного HorizontalPodAutoscaler {#update-replace-status-of-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-6}

PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  Назва HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): ОК

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного HorizontalPodAutoscaler {#patch-partially-update-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-7}

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  Назва HorizontalPodAutoscaler

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

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): ОК

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного HorizontalPodAutoscaler {#patch-partially-update-status-of-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-8}

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  Назва HorizontalPodAutoscaler

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

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): ОК

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

### `delete` видалення HorizontalPodAutoscaler {#delete-delete-a-horizontalpodautoscaler}

#### HTTP запит {#http-request-9}

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  Назва HorizontalPodAutoscaler

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

### `deletecollection` видалення колекції HorizontalPodAutoscaler {#deletecollection-delete-collection-of-horizontalpodautoscaler}

#### HTTP запит {#http-request-10}

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

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
