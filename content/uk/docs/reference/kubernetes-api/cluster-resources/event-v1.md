---
api_metadata:
  apiVersion: "events.k8s.io/v1"
  import: "k8s.io/api/events/v1"
  kind: "Event"
content_type: "api_reference"
description: "Подія — це повідомлення про подію десь у кластері."
title: "Event"
weight: 3
auto_generated: false
---

`apiVersion: events.k8s.io/v1`

`import "k8s.io/api/events/v1"`

## Event {#Event}

Event — це звіт про подію десь у кластері. Зазвичай це вказує на зміну стану в системі. Події мають обмежений термін зберігання, і тригери та повідомлення можуть змінюватися з часом. Споживачі подій не повинні покладатися на час події з певною причиною, що відображає послідовний тригер, або на продовження існування подій з цією причиною. До подій слід ставитися як до інформативних, можливо найкращих, додаткових даних.

---

- **apiVersion**: events.k8s.io/v1

- **kind**: Event

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **eventTime** (MicroTime), обовʼязково

  eventTime — це час, коли подія вперше спостерігалась. Це обовʼязкове поле.

  <a name="MicroTime"></a>
  *MicroTime — це версія Time з мікросекундною точністю.*

- **action** (string)

  action — це дія, яка була виконана або яка не вдалася щодо відповідного обʼєкта. Це машинний код. Це поле не може бути порожнім для нових Подій і може містити не більше 128 символів.

- **deprecatedCount** (int32)

  deprecatedCount — застаріле поле, яке забезпечує зворотню сумісність з типом подій core.v1.

- **deprecatedFirstTimestamp** (Time)

  deprecatedFirstTimestamp — застаріле поле, яке забезпечує зворотню сумісність з типом подій core.v1.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **deprecatedLastTimestamp** (Time)

  deprecatedLastTimestamp — застаріле поле, яке забезпечує зворотню сумісність з типом подій core.v1.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **deprecatedSource** (EventSource)

  deprecatedSource — застаріле поле, яке забезпечує зворотню сумісність з типом подій core.v1.

  <a name="EventSource"></a>
  *EventSource — містить інформацію для події.*

  - **deprecatedSource.component** (string)

    Компонент, з якого була згенерована подія.

  - **deprecatedSource.host** (string)

    Імʼя вузла, на якому була згенерована подія.

- **note** (string)

  note — опис статусу цієї операції, зрозумілий людині. Максимальна довжина примітки — 1 кБ, але бібліотеки повинні бути готові обробляти значення до 64 кБ.

- **reason** (string)

  reason — це причина виконання дії. Це текст зрозумілий людині. Це поле не може бути порожнім для нових Подій і може містити не більше 128 символів.

- **regarding** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  regarding — це обʼєкт, про який йдеться у цій Події. У більшості випадків це обʼєкт, який реалізує контролер звітів, наприклад, ReplicaSetController реалізує ReplicaSets, і ця подія випускається через те, що він діє на деякі зміни в обʼєкті ReplicaSet.

- **related** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  related — це необовʼязковий вторинний обʼєкт для складніших дій. Наприклад, коли обʼєкт, щодо якого йдеться, спричинює створення або видалення повʼязаного обʼєкта.

- **reportingController** (string)

  reportingController — це імʼя контролера, який випустив цю Подію, наприклад, `kubernetes.io/kubelet`. Це поле не може бути порожнім для нових Подій.

- **reportingInstance** (string)

  reportingInstance — це ідентифікатор інстанції контролера, наприклад, `kubelet-xyzf`. Це поле не може бути порожнім для нових Подій і може містити не більше 128 символів.

- **series** (EventSeries)

  series — це дані про серію Подій, яку представляє ця подія, або nil, якщо це поодинока Подія.

  <a name="EventSeries"></a>
  *EventSeries — містить інформацію про серію подій, тобто процес, що триває певний час. Частота оновлення EventSeries залежить від звітування подій. Стандартний інструмент повідомлення про події в "k8s.io/client-go/tools/events/event_broadcaster.go" показує, як ця структура оновлюється на тактах та може керувати індивідуалізованими реалізаціями інструментів звітування.*

  - **series.count** (int32), обовʼязково

    count — це кількість випадків у цій серії до останнього часу такту.

  - **series.lastObservedTime** (MicroTime), обовʼязково

    lastObservedTime — це час, коли останню Подію з серії було побачено перед останім тактом.

    <a name="MicroTime"></a>
    *MicroTime — це версія Time з мікросекундною точністю.*

- **type** (string)

  type — це тип цієї події (Normal, Warning), нові типи можуть бути додані у майбутньому. Це машинне кодування. Це поле не може бути порожнім для нових Подій.

## EventList {#EventList}

EventList — це список обʼєктів подій.

---

- **apiVersion**: events.k8s.io/v1

- **kind**: EventList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>), обовʼязково

## Операції {#operations}

---

### `get` отримати вказаний Event {#get-read-the-specified-event}

#### HTTP запит {#http-request}

GET /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя Event

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Event {#list-list-or-watch-objects-of-kind-event}

#### HTTP запит {#http-request-1}

GET /apis/events.k8s.io/v1/namespaces/{namespace}/events

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

200 (<a href="{{< ref "../cluster-resources/event-v1#EventList" >}}">EventList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів  типу Event {#list-list-or-watch-objects-of-kind-event-1}

#### HTTP запит {#http-request-2}

GET /apis/events.k8s.io/v1/events

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

200 (<a href="{{< ref "../cluster-resources/event-v1#EventList" >}}">EventList</a>): OK

401: Unauthorized

### `create` створення Event {#create-create-an-event}

#### HTTP запит {#http-request-3}

POST /apis/events.k8s.io/v1/namespaces/{namespace}/events

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

202 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Event {#update-replace-the-specified-event}

#### HTTP запит {#http-request-4}

PUT /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя Event

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Event {#patch-partially-update-the-specified-event}

#### HTTP запит {#http-request-5}

PATCH /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя Event

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

200 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): OK

201 (<a href="{{< ref "../cluster-resources/event-v1#Event" >}}">Event</a>): Created

401: Unauthorized

### `delete` видалення Event {#delete-delete-an-event}

#### HTTP запит {#http-request-6}

DELETE /apis/events.k8s.io/v1/namespaces/{namespace}/events/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя Event

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

### `deletecollection` видалення колекції Event {#deletecollection-delete-collection-of-event}

#### HTTP запит {#http-request-7}

DELETE /apis/events.k8s.io/v1/namespaces/{namespace}/events

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
