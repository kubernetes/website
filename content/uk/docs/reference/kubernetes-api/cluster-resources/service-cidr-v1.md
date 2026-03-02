---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "ServiceCIDR"
content_type: "api_reference"
description: "ServiceCIDR визначає діапазон IP-адрес у форматі CIDR (наприклад, 192.168.0.0/24 або 2001:db2::/64)."
title: "ServiceCIDR"
weight: 10
auto_generated: false
---

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

## ServiceCIDR {#ServiceCIDR}

ServiceCIDR визначає діапазон IP-адрес у форматі CIDR (наприклад, 192.168.0.0/24 або 2001:db2::/64). Цей діапазон використовується для виділення ClusterIP для обʼєктів Service.

---

- **apiVersion**: networking.k8s.io/v1

- **kind**: ServiceCIDR

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDRSpec" >}}">ServiceCIDRSpec</a>)

  spec — це бажаний стан ServiceCIDR. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.

- **status** (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDRStatus" >}}">ServiceCIDRStatus</a>)

  status представляє поточний стан ServiceCIDR. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.

## ServiceCIDRSpec {#ServiceCIDRSpec}

ServiceCIDRSpec визначає CIDR, які користувач хоче використовувати для виділення ClusterIP для Services.

---

- **cidrs** ([]string)

  *Atomic: буде замінено під час злиття*

  CIDRs визначає IP-блоки у нотації CIDR (наприклад, "192.168.0.0/24" або "2001:db8::/64"), з яких призначаються IP-адреси для сервісів кластера. Дозволено не більше двох CIDR, по одному для кожного сімейства IP. Це поле є незмінним.

## ServiceCIDRStatus {#ServiceCIDRStatus}

ServiceCIDRStatus описує поточний стан ServiceCIDR.

---

- **conditions** ([]Condition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  conditions містить масив metav1.Condition, який описує стан ServiceCIDR. Поточний стан сервісу.

  <a name="Condition"></a>
  *Condition містить деталі для одного аспекту поточного стану цього API-ресурсу.*

  - **conditions.lastTransitionTime** (Time), обовʼязково

    lastTransitionTime — це останній час, коли стан змінився з одного статусу на інший. Це повинно відповідати моменту, коли змінився основний стан. Якщо це невідомо, можна використовувати час, коли змінилося поле API.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string), обовʼязково

    message — це зрозуміле для людини повідомлення, яке надає деталі про перехід. Це може бути порожній рядок.

  - **conditions.reason** (string), обовʼязково

    reason містить програмний ідентифікатор, що вказує причину останньої зміни стану. Виробники певних типів станів можуть визначати очікувані значення та значення для цього поля та чи вважаються ці значення гарантованими API. Значення має бути рядком у CamelCase. Це поле не може бути порожнім.

  - **conditions.status** (string), обовʼязково

    статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    тип стану в CamelCase або у форматі foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якого було встановлено стан. Наприклад, якщо .metadata.generation наразі дорівнює 12, але .status.conditions[x].observedGeneration дорівнює 9, стан застарів щодо поточного стану екземпляра.

## ServiceCIDRList {#ServiceCIDRList}

ServiceCIDRList містить список об'єктів ServiceCIDR.

---

- **apiVersion**: networking.k8s.io/v1

- **kind**: ServiceCIDRList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>), обовʼязково

  items — це список ServiceCIDR.

## Операції {#Operations}

---

### `get` Отримати вказаний ServiceCIDR {#get-read-the-specified-servicecidr}

#### HTTP запит {#http-request}

GET /apis/networking.k8s.io/v1/servicecidrs/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя ServiceCIDR

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

401: Unauthorized

### `get` отримати статус вказаного ServiceCIDR {#get-read-status-of-the-specified-servicecidr}

#### HTTP запит {#http-request-1}

GET /apis/networking.k8s.io/v1/servicecidrs/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя ServiceCIDR

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ServiceCIDR {#list-list-objects-of-kind-servicecidr}

#### HTTP запит {#http-request-2}

GET /apis/networking.k8s.io/v1/servicecidrs

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

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDRList" >}}">ServiceCIDRList</a>): OK

401: Unauthorized

### `create` створення ServiceCIDR {#create-create-a-servicecidr}

#### HTTP запит {#http-request-3}

POST /apis/networking.k8s.io/v1/servicecidrs

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

202 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ServiceCIDR {#update-replace-the-specified-servicecidr}

#### HTTP запит {#http-request-4}

PUT /apis/networking.k8s.io/v1/servicecidrs/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя ServiceCIDR

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного ServiceCIDR {#update-replace-status-of-the-specified-servicecidr}

#### HTTP запит {#http-request-5}

PUT /apis/networking.k8s.io/v1/servicecidrs/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя ServiceCIDR

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ServiceCIDR {#patch-partially-update-the-specified-servicecidr}

#### HTTP запит {#http-request-6}

PATCH /apis/networking.k8s.io/v1/servicecidrs/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя ServiceCIDR

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного ServiceCIDR {#patch-partially-update-status-of-the-specified-servicecidr}

#### HTTP запит {#http-request-7}

PATCH /apis/networking.k8s.io/v1/servicecidrs/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя ServiceCIDR

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

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

### `delete` видалення ServiceCIDR {#delete-delete-a-servicecidr}

#### HTTP запит {#http-request-8}

DELETE /apis/networking.k8s.io/v1/servicecidrs/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  name of the ServiceCIDR

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

#### Відповідь {#response-8}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ServiceCIDR {#deletecollection-delete-collection-of-servicecidr}

#### HTTP запит {#http-request-9}

DELETE /apis/networking.k8s.io/v1/servicecidrs

#### Параметри {#parameters-9}

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
