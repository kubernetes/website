---
api_metadata:
  apiVersion: "apiregistration.k8s.io/v1"
  import: "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"
  kind: "APIService"
content_type: "api_reference"
description: "APIService представляє сервер для певної GroupVersion."
title: "APIService"
weight: 1
auto_generated: false
---

`apiVersion: apiregistration.k8s.io/v1`

`import "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"`

## APIService {#APIService}

APIService представляє сервер для певної GroupVersion. Імʼя повинно бути "version.group".

---

- **apiVersion**: apiregistration.k8s.io/v1

- **kind**: APIService

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceSpec" >}}">APIServiceSpec</a>)

  Spec містить інформацію для пошуку та звʼязку з сервером

- **status** (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceStatus" >}}">APIServiceStatus</a>)

  Status містить похідну інформацію про сервер API

## APIServiceSpec {#APIServiceSpec}

APIServiceSpec містить інформацію для пошуку та звʼязку з сервером. Підтримується лише https, хоча ви можете вимкнути перевірку сертифіката.

---

- **groupPriorityMinimum** (int32), обовʼязково

  GroupPriorityMinimum — це мінімальний пріоритет, який має мати ця група. Вищий пріоритет означає, що група має перевагу для клієнтів над групами з нижчим пріоритетом. Зверніть увагу, що інші версії цієї групи можуть мати ще вищі значення GroupPriorityMinimum, що надає групі вищий пріоритет. Першочергове сортування базується на GroupPriorityMinimum, впорядкованому від найвищого до найнижчого (20 перед 10). Вторинне сортування базується на алфавітному порівнянні імені обʼєкта. (v1.bar перед v1.foo) Ми рекомендуємо щось на зразок: *.k8s.io (за винятком extensions) на 18000, а PaaS (OpenShift, Deis) рекомендується бути у 2000-х.

- **versionPriority** (int32), обовʼязково

  VersionPriority контролює впорядкування цієї версії API всередині її групи. Повинно бути більше нуля. Першочергове сортування базується на VersionPriority, впорядкованому від найвищого до найнижчого (20 перед 10). Оскільки це всередині групи, число може бути маленьким, ймовірно, у 10-х. У випадку рівних пріоритетів версій, для визначення порядку всередині групи буде використовуватися рядок версії. Якщо рядок версії "kube-like", він буде сортуватися вище за рядки версій, які не є "kube-like", які впорядковуються лексикографічно. "Kube-like" версії починаються з "v", потім йде число (основна версія), потім за бажанням рядок "alpha" або "beta" і ще одне число (другорядна версія). Ці версії сортуються спочатку за принципом GA > beta > alpha (де GA — це версія без суфікса, такого як beta або alpha), а потім порівнюються основна версія, потім другорядна версія. Приклад відсортованого списку версій: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.

- **caBundle** ([]byte)

  *Atomic: буде замінено під час злиття*

  CABundle — це PEM закодований набір сертифікатів CA, який буде використовуватися для перевірки сертифіката сервера API. Якщо не вказано, використовуються системні довірені корені на сервері API.

- **group** (string)

  Group — це назва групи API, яку хостить цей сервер

- **insecureSkipTLSVerify** (boolean)

  InsecureSkipTLSVerify вимикає перевірку сертифіката TLS при звʼязку з цим сервером. Це категорично не рекомендується. Вам слід використовувати CABundle замість цього.

- **service** (ServiceReference)

  Service — це посилання на сервіс для цього сервера API. Воно повинно спілкуватись на порту 443. Якщо Service дорівнює nil, це означає, що обробка для версії API групи виконується локально на цьому сервері. Виклик просто делегується звичайному ланцюгу обробки для виконання.

  <a name="ServiceReference"></a>
  *ServiceReference утримує посилання на Service.legacy.k8s.io*

  - **service.name** (string)

    Name — це імʼя сервісу

  - **service.namespace** (string)

    Namespace — це простір імен сервісу

  - **service.port** (int32)

    Якщо вказано, порт сервісу, який хостить webhook. Стандартно — 443 для зворотної сумісності. `port` повинен бути допустимим номером порту (1-65535 включно).

- **version** (string)

  Version — це версія API, яку хостить цей сервер. Наприклад, "v1"

## APIServiceStatus {#APIServiceStatus}

APIServiceStatus містить похідну інформацію про сервер API

---

- **conditions** ([]APIServiceCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення за ключем type будуть збережені під час злиття*

  Поточний стан сервісу apiService.

  <a name="APIServiceCondition"></a>
  *APIServiceCondition описує стан APIService у певний момент часу*

  - **conditions.status** (string), обовʼязково

    Status — це стан статусу. Може бути True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Type — це тип статусу.

  - **conditions.lastTransitionTime** (Time)

    Останній раз, коли стан статусу змінився з одного на інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, що вказує деталі про останню зміну статусу.

  - **conditions.reason** (string)

    Унікальна, однослівна, CamelCase причина останньої зміни статусу.

## APIServiceList {#APIServiceList}

APIServiceList — це список обʼєктів APIService.

---

- **apiVersion**: apiregistration.k8s.io/v1

- **kind**: APIServiceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>), обовʼязково

  Items — це список APIService

## Операції {#operations}

---

### `get` отримати вказаний APIService {#get-read-the-specified-apiservice}

#### HTTP запит {#http-request}

GET /apis/apiregistration.k8s.io/v1/apiservices/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя APIService

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

401: Unauthorized

### `get` отримати статус вказаного APIService {#get-read-status-of-the-specified-apiservice}

#### HTTP запит {#http-request-1}

GET /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя APIService

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу APIService {#list-or-watch-objects-of-kind-apiservice}

#### HTTP запит {#http-request-2}

GET /apis/apiregistration.k8s.io/v1/apiservices

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

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceList" >}}">APIServiceList</a>): OK

401: Unauthorized

### `create` створення APIService {#create-create-an-apiservice}

#### HTTP запит {#http-request-3}

POST /apis/apiregistration.k8s.io/v1/apiservices

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

202 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Accepted

401: Unauthorized

### `update` заміна вказаного APIService {#update-replace-the-specified-apiservice}

#### HTTP запит {#http-request-4}

PUT /apis/apiregistration.k8s.io/v1/apiservices/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя APIService

- **body**: <a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного APIService {#update-replace-status-of-the-specified-apiservice}

#### HTTP запит {#http-request-5}

PUT /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя APIService

- **body**: <a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного APIService {#patch-partially-update-the-specified-apiservice}

#### HTTP запит {#http-request-6}

PATCH /apis/apiregistration.k8s.io/v1/apiservices/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя APIService

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

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

### `patch` чатскове оновлення статусу вказаного APIService {#patch-partially-update-status-of-the-specified-apiservice}

#### HTTP запит {#http-request-7}

PATCH /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя APIService

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

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

### `delete` видаленя APIService {#delete-delete-an-apiservice}

#### HTTP запит {#http-request-8}

DELETE /apis/apiregistration.k8s.io/v1/apiservices/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя APIService

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

### `deletecollection` видаленя колекції APIService {#deletecollection-delete-collection-of-apiservice}

#### HTTP запит {#http-request-9}

DELETE /apis/apiregistration.k8s.io/v1/apiservices

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
