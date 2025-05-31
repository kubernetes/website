---
api_metadata:
  apiVersion: "flowcontrol.apiserver.k8s.io/v1"
  import: "k8s.io/api/flowcontrol/v1"
  kind: "PriorityLevelConfiguration"
content_type: "api_reference"
description: "PriorityLevelConfiguration представляє конфігурацію рівня пріоритету."
title: "PriorityLevelConfiguration"
weight: 6
auto_generated: false
---

`apiVersion: flowcontrol.apiserver.k8s.io/v1`

`import "k8s.io/api/flowcontrol/v1"`

## PriorityLevelConfiguration {#PriorityLevelConfiguration}

PriorityLevelConfiguration представляє конфігурацію рівня пріоритету.

---

- **apiVersion**: flowcontrol.apiserver.k8s.io/v1

- **kind**: PriorityLevelConfiguration

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  `metadata` — стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationSpec" >}}">PriorityLevelConfigurationSpec</a>)

  `spec` — специфікація бажаної поведінки "request-priority". Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationStatus" >}}">PriorityLevelConfigurationStatus</a>)

  `status` — поточний статус "request-priority". Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PriorityLevelConfigurationSpec {#PriorityLevelConfigurationSpec}

PriorityLevelConfigurationSpec визначає конфігурацію рівня пріоритету.

---

- **exempt** (ExemptPriorityLevelConfiguration)

  `exempt` вказує, як обробляються запити для виняткового рівня пріоритету. Це поле ПОВИННО бути порожнім, якщо `type` встановлено на `"Limited"`. Це поле МОЖЕ бути не порожнім, якщо `type` встановлено на `"Exempt"`. Якщо воно порожнє і `type` встановлено на `"Exempt"`, застосовуються стандартне значення для `ExemptPriorityLevelConfiguration`.

  <a name="ExemptPriorityLevelConfiguration"></a>
  *ExemptPriorityLevelConfiguration описує настроювані аспекти обробки запитів на виключення. В обов’язковому винятковому об’єкті конфігурації значення в полях тут можуть змінювати авторизовані користувачі, на відміну від решти `spec`.*

  - **exempt.lendablePercent** (int32)

    `lendablePercent` вказує частку NominalCL рівня, яка може бути позичена іншими рівнями пріоритету. Значення цього поля повинно бути в діапазоні від 0 до 100 включно, стандартне значення — 0. Кількість місць, які інші рівні можуть позичати у цього рівня, визначається наступним чином:

    LendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )

  - **exempt.nominalConcurrencyShares** (int32)

    `nominalConcurrencyShares` (NCS) вносить свій внесок до обчислення NominalConcurrencyLimit (NominalCL) цього рівня. Це кількість виконавчих місць, які номінально зарезервовані для цього рівня пріоритету. Це НЕ обмежує розподіл з цього рівня, але впливає на інші рівні пріоритету через механізм позичання. Ліміт конкурентності сервера (ServerCL) розподіляється серед всіх рівнів пріоритету пропорційно їх значенням NCS:

    NominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)

    Більші значення означають більший номінальний ліміт конкурентності за рахунок інших рівнів пріоритету. Стандартно це поле має значення 0.

- **limited** (LimitedPriorityLevelConfiguration)

  `limited` вказує, як обробляються запити для обмеженого рівня пріоритету. Це поле повинно бути не порожнім лише тоді, коли `type` встановлено на `"Limited"`.

  <a name="LimitedPriorityLevelConfiguration"></a>
  *LimitedPriorityLevelConfiguration вказує, як обробляти запити, які підлягають обмеженням. Він вирішує дві проблеми:*
    - *Які обмеження на запити для цього рівня пріоритету?*
    - *Що робити з запитами, які перевищують ліміт?*

  - **limited.borrowingLimitPercent** (int32)

    `borrowingLimitPercent`, якщо вказано, налаштовує ліміт на кількість місць, які цей рівень пріоритету може позичати від інших рівнів пріоритету. Ліміт відомий як BorrowingConcurrencyLimit (BorrowingCL) і є обмеженням на загальну кількість місць, які цей рівень може позичати одночасно. Це поле визначає співвідношення цього ліміту до номінального ліміту конкурентності рівня. Коли це поле не є нульовим, воно має вказувати невідʼємне ціле число, і ліміт обчислюється так:

    BorrowingCL(i) = round( NominalCL(i) * borrowingLimitPercent(i)/100.0 )

    Значення цього поля може перевищувати 100, що означає, що цей рівень пріоритету може позичати більше місць, ніж його власний номінальний ліміт конкурентності (NominalCL). Якщо це поле залишити `nil`, ліміт фактично нескінченний.

  - **limited.lendablePercent** (int32)

    `lendablePercent` вказує частку NominalCL рівня, яка може бути позичена іншими рівнями пріоритету. Значення цього поля повинно бути в діапазоні від 0 до 100 включно, стандартно — 0. Кількість місць, які інші рівні можуть позичати у цього рівня, визначається наступним чином:

    LendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )

  - **limited.limitResponse** (LimitResponse)

    `limitResponse` вказує, як поводитися з запитами, які зараз не можна виконати.

    <a name="LimitResponse"></a>
    *LimitResponse визначає, як обробляти запити, які зараз не можна виконати.*

    - **limited.limitResponse.type** (string), обовʼязково

      `type` — "Queue" або "Reject". "Queue" означає, що запити, які зараз не можна виконати, утримуються в черзі, поки їх не буде можливо виконати або досягнуто обмеження черги. "Reject" означає, що запити, які зараз не можна виконати, відхиляються. Обовʼязковщ.

    - **limited.limitResponse.queuing** (QueuingConfiguration)

      `queuing` містить параметри конфігурації для черги. Це поле може бути не порожнім лише тоді, коли `type` встановлено на `"Queue"`.

      <a name="QueuingConfiguration"></a>
      *QueuingConfiguration містить параметри конфігурації для черги*

      - **limited.limitResponse.queuing.handSize** (int32)

        `handSize` — невелике позитивне число, яке налаштовує розподіл замовлень до черг. При включенні запита на цьому рівні пріоритету ідентифікатор потоку запиту (пара рядків) хешується, і значення хеша використовується для перетасовки списку черг і роздачі руки розміру, вказаного тут. Запит поміщається в одну з найкоротших черг в цій руці. `handSize` не повинно бути більшим, ніж `queues`, і повинно бути значно меншим (щоб кілька важких потоків не насичували більшість черг). Див. документацію для користувачів для більш детальної інформації щодо налаштування цього поля. Стандартне значення — 8.

      - **limited.limitResponse.queuing.queueLengthLimit** (int32)

        `queueLengthLimit` — максимальна кількість запитів, які дозволяється очікувати в заданій черзі цього рівня пріоритету одночасно; зайві запити відхиляються. Це значення повинно бути позитивним. Якщо не вказано, воно стандартно буде встановлено на 50.

      - **limited.limitResponse.queuing.queues** (int32)

        `queues` — кількість черг для цього рівня пріоритету. Черги існують незалежно в кожному apiserver. Значення повинно бути позитивним. Встановлення його на 1 фактично виключає shufflesharding і, таким чином, робить метод відмінності асоційованих схем потоків неактуальним. Стандартно поле має значення 64.

  - **limited.nominalConcurrencyShares** (int32)

    `nominalConcurrencyShares` (NCS) вносить свій внесок до обчислення NominalConcurrencyLimit (NominalCL) цього рівня. Це кількість виконавчих місць, доступних на цьому рівні пріоритету. Це використовується як для запитів, розподілених з цього рівня пріоритету, так і для запитів, розподілених з інших рівнів пріоритету, які позичають місця з цього рівня. Ліміт конкурентності сервера (ServerCL) розподіляється серед обмежених рівнів пріоритету в пропорції до їх значень NCS:

    NominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)

    Більші значення означають більший номінальний ліміт конкурентності, за рахунок інших рівнів пріоритету.

    Якщо не вказано, стандартно це поле має значення 30.

    Встановлення цього поля в нуль підтримує створення «вʼязниці» для цього рівня пріоритету, яка використовується для утримання деяких запитів

- **type** (string), required

  `type` вказує, чи підлягає цей рівень пріоритету обмеженням на виконання запитів. Значення `"Exempt"` означає, що запити цього рівня пріоритету не підлягають обмеженням (і, отже, ніколи не ставляться в чергу) і не впливають на потужність, доступну для інших рівнів пріоритету. Значення `"Limited"` означає, що (a) запити цього рівня пріоритету *підлягають* обмеженням і (b) частина обмеженої потужності сервера доступна виключно для цього рівня пріоритету. Обовʼязкове.

## PriorityLevelConfigurationStatus {#PriorityLevelConfigurationStatus}

PriorityLevelConfigurationStatus представляє поточний стан "пріоритету запитів".

---

- **conditions** ([]PriorityLevelConfigurationCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення за ключем типу зберігатимуться під час обʼєднання*

  `conditions` - поточний стан "пріоритету запитів".

  <a name="PriorityLevelConfigurationCondition"></a>
  *PriorityLevelConfigurationCondition визначає стан рівня пріоритету.*

  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` — останній час, коли стан змінився з одного статусу на інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    `message` — це повідомлення, зрозуміле людині та вказує на деталі останнього переходу.

  - **conditions.reason** (string)

    `reason` — унікальна причина, одне слово, у CamelCase причина останнього переходу стану.

  - **conditions.status** (string)

    `status` — це стан статусу. Може бути True, False, Unknown. Обовʼязково.

  - **conditions.type** (string)

    `type` - це тип умови. Обовʼязково.

## PriorityLevelConfigurationList {#PriorityLevelConfigurationList}

PriorityLevelConfigurationList — це список обʼєктів PriorityLevelConfiguration.

---

- **apiVersion**: flowcontrol.apiserver.k8s.io/v1

- **kind**: PriorityLevelConfigurationList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  `metadata` — це стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>), обовʼязково

  `items` — це список пріоритетів запитів.

## Операції {#operations}

---

### `get` отримати вказану PriorityLevelConfiguration {#get-read-the-specified-prioritylevelconfiguration}

#### HTTP запит {#http-request}

GET /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityLevelConfiguration

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

401: Unauthorized

### `get` отримати статус вказаної PriorityLevelConfiguration {#get-read-status-of-the-specified-prioritylevelconfiguration}

#### HTTP запит {#http-request-1}

GET /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityLevelConfiguration

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PriorityLevelConfiguration {#list-list-or-watch-objects-of-kind-prioritylevelconfiguration}

#### HTTP запит {#http-request-2}

GET /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations

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

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfigurationList" >}}">PriorityLevelConfigurationList</a>): OK

401: Unauthorized

### `create` створення PriorityLevelConfiguration {#create-create-a-prioritylevelconfiguration}

#### HTTP запит {#http-request-3}

POST /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

202 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Accepted

401: Unauthorized

### `update` заміна вказаної PriorityLevelConfiguration {#update-replace-the-specified-prioritylevelconfiguration}

#### HTTP запит {#http-request-4}

PUT /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityLevelConfiguration

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

### `update` заміна статусу вказаної PriorityLevelConfiguration {#update-replace-status-of-the-specified-prioritylevelconfiguration}

#### HTTP запит {#http-request-5}

PUT /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityLevelConfiguration

- **body**: <a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної PriorityLevelConfiguration {#patch-partially-update-the-specified-prioritylevelconfiguration}

#### HTTP запит {#http-request-6}

PATCH /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityLevelConfiguration

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

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаної PriorityLevelConfiguration {#patch-partially-update-status-of-the-specified-prioritylevelconfiguration}

#### HTTP запит {#http-request-7}

PATCH /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityLevelConfiguration

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

200 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): OK

201 (<a href="{{< ref "../policy-resources/priority-level-configuration-v1#PriorityLevelConfiguration" >}}">PriorityLevelConfiguration</a>): Created

401: Unauthorized

### `delete` видалення PriorityLevelConfiguration {#delete-delete-a-prioritylevelconfiguration}

#### HTTP запит {#http-request-8}

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя PriorityLevelConfiguration

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

### `deletecollection` вилучення колекції PriorityLevelConfiguration {#deletecollection-delete-collection-of-prioritylevelconfiguration}

#### HTTP запит {#http-request-9}

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations

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
