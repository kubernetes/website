---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "LimitRange"
content_type: "api_reference"
description: "LimitRange встановлює обмеження на використання ресурсів для кожного типу ресурсу у просторі імен."
title: "LimitRange"
weight: 2
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## LimitRange {#LimitRange}

LimitRange встановлює обмеження на використання ресурсів для кожного типу ресурсу в просторі імен.

---

- **apiVersion**: v1

- **kind**: LimitRange

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRangeSpec" >}}">LimitRangeSpec</a>)

  Spec визначає застосовувані обмеження. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## LimitRangeSpec {#LimitRangeSpec}

LimitRangeSpec визначає мінімальні та максимальні обмеження на використання ресурсів, які відповідають певному типу.

---

- **limits** ([]LimitRangeItem), обовʼязково

  *Atomic: буде замінено під час злиття*

  Limits — це список обʼєктів LimitRangeItem, що застосовуються.

  <a name="LimitRangeItem"></a>
  *LimitRangeItem визначає мінімальні та максимальні обмеження на використання будь-якого ресурсу, який відповідає певному типу.*

  - **limits.type** (string), обовʼязково

    Тип ресурсу, до якого застосовується це обмеження.

  - **limits.default** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Стандартні граничні значення запиту ресурсу за назвою ресурсу, якщо обмеження ресурсів не вказано.

  - **limits.defaultRequest** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    DefaultRequest — це стандартне значення запиту на вимоги до ресурсу за назвою ресурсу, якщо запит на ресурси не вказано.

  - **limits.max** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Максимальні обмеження на використання цього типу за назвою ресурсу.

  - **limits.maxLimitRequestRatio** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    MaxLimitRequestRatio, якщо зазначено, названий ресурс повинен мати запит і обмеження, які обидва є ненульовими, де обмеження, поділене на запит, менше або дорівнює перерахованому значенню; це представляє максимальне навантаження для названого ресурсу.

  - **limits.min** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Мінімальні обмеження на використання цього типу за назвою ресурсу.

## LimitRangeList {#LimitRangeList}

LimitRangeList — це список елементів LimitRange.

---

- **apiVersion**: v1

- **kind**: LimitRangeList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>), обовʼязкове

  Items — це список обʼєктів LimitRange. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

## Операції {#operations}

---

### `get` отримати вказаний LimitRange {#get-read-the-specified-limitrange}

#### HTTP запит {#http-request}

GET /api/v1/namespaces/{namespace}/limitranges/{name}

#### Параметри {#parametrs}

- **name** (*в шляху*): string, обовʼязково

  імʼя LimitRange

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу LimitRange {#list-list-or-watch-objects-of-kind-limitrange}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/limitranges

#### Параметри {#parametrs-1}

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

200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRangeList" >}}">LimitRangeList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу LimitRange {#list-list-or-watch-objects-of-kind-limitrange-1}

#### HTTP запит {#http-request-2}

GET /api/v1/limitranges

#### Параметри {#parametrs-2}

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

200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRangeList" >}}">LimitRangeList</a>): OK

401: Unauthorized

### `create` створення LimitRange {#create-create-a-limitrange}

#### HTTP запит {#http-request-3}

POST /api/v1/namespaces/{namespace}/limitranges

#### Параметри {#parametrs-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): OK

201 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): Created

202 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): Accepted

401: Unauthorized

### `update` заміна вказаного LimitRange {#update-replace-the-specified-limitrange}

#### HTTP запит {#http-request-4}

PUT /api/v1/namespaces/{namespace}/limitranges/{name}

#### Параметри {#parametrs-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя LimitRange

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): OK

201 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного LimitRange {#patch-partially-update-the-specified-limitrange}

#### HTTP запит {#http-request-5}

PATCH /api/v1/namespaces/{namespace}/limitranges/{name}

#### Параметри {#parametrs-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя LimitRange

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

200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): OK

201 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): Created

401: Unauthorized

### `delete` видалення LimitRange {#delete-delete-a-limitrange}

#### HTTP запит {#http-request-6}

DELETE /api/v1/namespaces/{namespace}/limitranges/{name}

#### Параметри {#parametrs-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя LimitRange

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

### `deletecollection` видалення колекції LimitRange {#deletecollection-delete-collection-of-limitrange}

#### HTTP запит {#http-request-7}

DELETE /api/v1/namespaces/{namespace}/limitranges

#### Параметри {#parametrs-7}

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
