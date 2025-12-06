---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "DaemonSet"
content_type: "api_reference"
description: "DaemonSet представляє налаштування набору фонових служб (демонів)."
title: "DaemonSet"
weight: 9
auto_generated: false
---

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## DaemonSet {#DaemonSet}

DaemonSet представляє налаштування набору фонових служб (демонів).

---

- **apiVersion**: apps/v1

- **kind**: DaemonSet

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetSpec" >}}">DaemonSetSpec</a>)

  Бажана поведінка цього DaemonSet. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetStatus" >}}">DaemonSetStatus</a>)

  Поточний стан цього DaemonSet. Ці дані можуть бути неактуальними протягом певного часу. Заповнюється системою. Тільки для читання. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## DaemonSetSpec {#DaemonSetSpec}

DaemonSetSpec є специфікацією DaemonSet.

---

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), обовʼязково

  Запит міток для Podʼів, якими керує набір демонів. Має мати збіг з міткам шаблону Pod. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), обовʼязково

  Обʼєкт, який описує Pod, який буде створено. DaemonSet створює рівно одну копію цього Pod на кожному вузлі, який відповідає селектору вузлів шаблону (або на кожному вузлі, якщо селектор вузлів не вказано). Єдине допустиме значення параметра `restartPolicy` шаблону — "Always". Докладніше: [https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template](/docs/concepts/workloads/controllers/replicationcontroller#pod-template)

- **minReadySeconds** (int32)

  Мінімальна кількість секунд, протягом яких новий Pod DaemonSet має бути готовим без збоїв будь-якого з його контейнерів, щоб вважатися доступним. Стандартне значення — 0 (Pod вважається доступним, як тільки він буде готовим).

- **updateStrategy** (DaemonSetUpdateStrategy)

  Стратегія оновлення для заміни поточних Podʼів DaemonSet новими Podʼами.

  <a name="DaemonSetUpdateStrategy"></a>
  *DaemonSetUpdateStrategy є структурою, що використовується для управління стратегією оновлення для DaemonSet.*

  - **updateStrategy.type** (string)

    Тип оновлення набору демонів. Може бути "RollingUpdate" або "OnDelete". Стандартне значення — RollingUpdate.

    Можливі значення переліку (enum):
    - `"OnDelete"` Змінюйє старі демони тільки тоді, коли їх роботу зупинено
    - `"RollingUpdate"` Замініє старі демони новими за допомогою послідовного оновлення, тобто замінює їх на кожному вузлі по черзі.

  - **updateStrategy.rollingUpdate** (RollingUpdateDaemonSet)

    Налаштування параметрів постійного оновлення. Присутній тільки якщо type = "RollingUpdate".

    <a name="RollingUpdateDaemonSet"></a>
    *Spec для контролю небхідної поведінки постійного оновлення набору демонів.*

    - **updateStrategy.rollingUpdate.maxSurge** (IntOrString)

      Максимальна кількість вузлів з навним доступним Pod DaemonSet, яка може мати оновлений Pod DaemonSet під час оновлення. Значення може бути абсолютним числом (наприклад, 5) або відсотком від бажаних Podʼів (наприклад, 10%). Це не може бути 0, якщо MaxUnavailable дорівнює 0. Абсолютне число обчислюється з відсотка, округленого в більшу сторону до мінімуму 1. Стандартне значення — 0. Наприклад: коли це встановлено на 30%, як максимум 30% від загальної кількості вузлів, повинні мати Pod демона (тобто status.desiredNumberScheduled), можуть мати свій новий Pod створений до того, як старий Pod буде видалений. Оновлення починається з запуску нових Podʼів на 30% вузлів. Як тільки оновлений Pod доступний (готовий протягом принаймні minReadySeconds), старий Pod DaemonSet на цьому вузлі позначається як видалений. Якщо старий Pod стає недоступним з будь-якої причини (готовність переходить у false, його виселяють або переносять з вузла), на цьому вузлі негайно створюється оновлений Pod без урахування обмежень по сплеску навантаження. Дозвіл на сплеск означає можливість подвоєння ресурсів, які використовуються DaemonSet на будь-якому вузлі, якщо перевірка готовності не вдається, тому ресурсомісткі DaemonSet повинні враховувати, що вони можуть спричинити виселення під час розладу.

      <a name="IntOrString"></a>
      *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      Максимальна кількість Podʼів DaemonSet, які можуть бути недоступні під час оновлення. Значення може бути абсолютним числом (наприклад, 5) або відсотком від загальної кількості Podʼів DaemonSet на початок оновлення (наприклад, 10%). Абсолютне число обчислюється з відсотка, округленого в більшу сторону. Це не може бути 0, якщо MaxSurge дорівнює 0. Стандартне значення — 1. Наприклад: коли це встановлено на 30%, максимум 30% від загальної кількості вузлів, які повинні виконувати Pod демона (тобто status.desiredNumberScheduled), можуть мати свої Pod зупинені для оновлення в будь-який час. Оновлення починається з зупинки не більше 30% цих Podʼів DaemonSet і потім запускає нові Pod DaemonSet на їх місця. Після того, як нові Pod стануть доступними, вони продовжують роботу з іншими Podʼами DaemonSet, забезпечуючи тим самим, що принаймні 70% від початкової кількості Podʼів DaemonSet доступні.

      <a name="IntOrString"></a>
      *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

- **revisionHistoryLimit** (int32)

  Кількість версій історії, яку потрібно зберегти, щоб дозволити відкат. Це вказівник для розрізнення між явним нулем та не вказаним значенням. Стандартне значення — 10.

## DaemonSetStatus {#DaemonSetStatus}

DaemonSetStatus представляє поточний стан DaemonSet.

---

- **numberReady** (int32), обовʼязково

  Кількість вузлів, на яких має бути запущений Pod демона й один або кілька з них у стані Ready.

- **numberAvailable** (int32)

  Кількість вузлів, на яких має бути запущений Pod демона й один або кілька з них запущені та доступні (готові щонайменше протягом spec.minReadySeconds).

- **numberUnavailable** (int32)

  Кількість вузлів, на яких має бути запущений Pod демона, але жоден з них не запущений і доступний (готовий щонайменше протягом spec.minReadySeconds).

- **numberMisscheduled** (int32), обовʼязково

  Кількість вузлів, на яких запущений Pod демона, але вони не повинні його виконувати. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/](/docs/concepts/workloads/controllers/daemonset/)

- **desiredNumberScheduled** (int32), обовʼязково

  Загальна кількість вузлів, на яких має бути запущений Pod демона (включаючи вузли, на яких Pod демона вже правильно запущений). Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/](/docs/concepts/workloads/controllers/daemonset/)

- **currentNumberScheduled** (int32), обовʼязково

  Кількість вузлів, на яких запущено принаймні один Pod демона і які повинні виконувати Pod демона. Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/](/docs/concepts/workloads/controllers/daemonset/)

- **updatedNumberScheduled** (int32)

  Загальна кількість вузлів, на яких запущено оновлений Pod демона.

- **collisionCount** (int32)

  Кількість колізій хешів для DaemonSet. Контролер DaemonSet використовує це поле як механізм уникнення колізій при створенні імені для найновішого ControllerRevision.

- **conditions** ([]DaemonSetCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Представляє останні доступні спостереження поточного стану DaemonSet.

  <a name="DaemonSetCondition"></a>
  *DaemonSetCondition описує стан DaemonSet у певний момент часу.*

  - **conditions.status** (string), обовʼязково

    Статус стану, один із True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану DaemonSet.

  - **conditions.lastTransitionTime** (Time)

    Час останнього зміни стану з одного статусу до іншого.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, із зазначенням деталей про перехід.

  - **conditions.reason** (string)

    Причина останньої зміни стану.

- **observedGeneration** (int64)

  Останнє покоління, яке спостерігається контролером набору демонів.

## DaemonSetList {#DaemonSetList}

DaemonSetList є колекцією DaemonSet.

---

- **apiVersion**: apps/v1

- **kind**: DaemonSetList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>), обовʼязково

  Список DaemonSet.

## Операції {#operations}

---

### `get` отримати вказаний DaemonSet {#get-read-the-specified-daemonset}

#### HTTP запит {#http-request}

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  Назва DaemonSet.

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: Unauthorized

### `get` отримати статус вказаного DaemonSet {#get-read-the-status-of-the-specified-daemonset}

#### HTTP запит {#http-request-1}

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя DaemonSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу DaemonSet {#list-list-or-watch-objects-of-kind-daemonset}

#### HTTP запит {#http-request-2}

GET /apis/apps/v1/namespaces/{namespace}/daemonsets

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

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу DaemonSet {#list-list-or-watch-objects-of-kind-daemonset-1}

#### HTTP запит {#http-request-3}

GET /apis/apps/v1/daemonsets

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

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: Unauthorized

### `create` створення DaemonSet {#create-create-a-daemonset}

#### HTTP запит {#http-request-4}

POST /apis/apps/v1/namespaces/{namespace}/daemonsets

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

202 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Accepted

401: Unauthorized

### `update` заміна вказаного DaemonSet {#update-replace-the-specified-daemonset}

#### HTTP запит {#http-request-5}

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва DaemonSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного DaemonSet {#update-replace-the-status-of-the-specified-daemonset}

#### HTTP запит {#http-request-6}

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва DaemonSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}


200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного DaemonSet {#patch-partially-update-the-specified-daemonset}

#### HTTP запит {#http-request-7}

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  назва DaemonSet

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

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного DaemonSet {#patch-partially-update-the-status-of-the-specified-daemonset}

#### HTTP запит {#http-request-8}

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  назва DaemonSet

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

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized

### `delete` видалення DaemonSet {#delete-delete-a-daemonset}

#### HTTP запит {#http-request-9}

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  назва DaemonSet

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

### `deletecollection` видалення колекції DaemonSet {#deletecollection-delete-collection-of-daemonset}

#### HTTP запит {#http-request-10}

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets

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
