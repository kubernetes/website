---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "ControllerRevision"
content_type: "api_reference"
description: "ControllerRevision впроваджує незмінюваний знімок даних стану."
title: "ControllerRevision"
weight: 8
auto_generated: false
---

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## ControllerRevision {#ControllerRevision}

ControllerRevision впроваджує незмінюваний знімок даних стану. Клієнти відповідають за серіалізацію та десеріалізацію обʼєктів, які містять їх внутрішній стан. Після успішного створення ControllerRevision, його не можна оновити. API Server не пройде валідацію всіх запитів, які намагаються змінити поле Data. Однак ControllerRevision може бути видалено. Зверніть увагу, що через використання цього обʼєкта обома контролерами DaemonSet і StatefulSet для оновлення та відкату, він знаходиться на стадії бета-тестування. З усім тим, його назва та представлення можуть змінюватися в майбутніх версіях, і клієнти не повинні покладатися на його стабільність. Він призначений головним чином для внутрішнього використання контролерами.

---

- **apiVersion**: apps/v1

- **kind**: ControllerRevision

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стаціонарні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **revision** (int64), обовʼязково

  поле revision показує номер ревізії стану представленого в Data.

- **data** (RawExtension)

  Data є серіалізованим представленням стану.

  <a name="RawExtension"></a>
  *RawExtension використовується для утримання розширень у зовнішніх версіях.*

  *Щоб використовувати це, створіть поле, яке має RawExtension як тип у вашій зовнішній, версійній структурі, і Object у вашій внутрішній структурі. Вам також потрібно зареєструвати різні типи втулків.*

  // Внутрішній пакет:

  ```go
  type MyAPIObject struct {
    runtime.TypeMeta `json:",inline"`
    MyPlugin runtime.Object `json:"myPlugin"`
  }

  type PluginA struct {
    AOption string `json:"aOption"`
  }
  ```

  // Зовнішній пакет:

  ```go
  type MyAPIObject struct {
    runtime.TypeMeta `json:",inline"`
    MyPlugin runtime.RawExtension `json:"myPlugin"`
   }

  type PluginA struct {
    AOption string `json:"aOption"`
  }
  ```

  // У мережі JSON буде виглядати приблизно так:

  ```json
  {
    "kind":"MyAPIObject",
    "apiVersion":"v1",
    "myPlugin": {
      "kind":"PluginA",
      "aOption":"foo",
    },
  }
  ```

  *Що ж відбувається? Спочатку декодування використовує json або yaml для перетворення серіалізованих даних у вашу зовнішню структуру MyAPIObject. Це призводить до збереження сирого JSON, але не до його розпакування. Наступним кроком є копіювання (використовуючи pkg/conversion) у внутрішню структуру. У пакеті runtime, функції перетворення, встановлені в DefaultScheme, розпакують JSON, збережений у RawExtension, перетворюючи його в правильний тип обʼєкта і зберігаючи його в Object. (TODO: У випадку, якщо обʼєкт невідомого типу, буде створено обʼєкт runtime.Unknown і збережено.)*

## ControllerRevisionList {#ControllerRevisionList}

ControllerRevisionList — це ресурс, що містить список обʼєктів ControllerRevision.

---

- **apiVersion**: apps/v1

- **kind**: ControllerRevisionList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>), обовʼязково

  Items — це список ControllerRevisions

## Операції {#operations}

---

### `get` отримати вказаний ControllerRevision {#get-read-the-specified-controllerrevision}

#### HTTP запит {#http-request}

GET /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва ControllerRevision

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ControllerRevision {#list-list-or-watch-objects-of-kind-controllerrevision}

#### HTTP-запит {#http-request-1}

GET /apis/apps/v1/namespaces/{namespace}/controllerrevisions

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

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevisionList" >}}">ControllerRevisionList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ControllerRevision {#list-list-or-watch-objects-of-kind-controllerrevision-1}

#### HTTP-запит {#http-request-2}

GET /apis/apps/v1/controllerrevisions

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

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevisionList" >}}">ControllerRevisionList</a>): OK

401: Unauthorized

### `create` створення ControllerRevision {#create-create-a-controllerrevision}

#### HTTP-запит {#http-request-3}

POST /apis/apps/v1/namespaces/{namespace}/controllerrevisions

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

202 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Accepted

401: Unauthorized

### `update` зміна вказаного ControllerRevision {#update-replace-the-specified-controllerrevision}

#### HTTP-запит {#http-request-4}

PUT /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя ControllerRevision

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ControllerRevision {#patch-partially-update-the-specified-controllerrevision}

#### HTTP-запит {#http-request-5}

PATCH /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя ControllerRevision

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

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

401: Unauthorized

### `delete` видалення ControllerRevision {#delete-delete-a-controllerrevision}

#### HTTP-запит {#http-request-6}

DELETE /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязковий

  імʼя ControllerRevision

- **namespace** (*в шляху*): string, обовʼязковий

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

### `deletecollection` видалення колекції ControllerRevision {#deletecollection-delete-collection-of-controllerrevision}

#### HTTP-запит {#http-request-7}

DELETE /apis/apps/v1/namespaces/{namespace}/controllerrevisions

#### Параметри {#parameters-7}

- **namespace** (*в шляху*): string, обовʼязковий

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
