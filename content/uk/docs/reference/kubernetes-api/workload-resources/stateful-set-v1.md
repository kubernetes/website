---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "StatefulSet"
content_type: "api_reference"
description: "StatefulSet представляє набір Podʼів з постійною ідентичністю."
title: "StatefulSet"
weight: 7
auto_generated: false
---

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## StatefulSet {#StatefulSet}

StatefulSet представляє набір Podʼів з постійною ідентичністю. Ідентичність визначається як:

- Мережа: єдине стабільне DNS та імʼя хосту.
- Сховище: Стільки VolumeClaims, скільки потрібно.

StatefulSet гарантує, що вказана мережева ідентичність завжди буде зіставлятись з вказаним сховищем.

---

- **apiVersion**: apps/v1

- **kind**: StatefulSet

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetSpec" >}}">StatefulSetSpec</a>)

  Spec визначає бажані ідентичності Podʼів у цьому наборі.

- **status** (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetStatus" >}}">StatefulSetStatus</a>)

  Status — це поточний стан Podʼів у цьому StatefulSet. Ці дані можуть бути застарілими на певний проміжок часу.

## StatefulSetSpec {#StatefulSetSpec}

StatefulSetSpec — це специфікація StatefulSet.

---

- **serviceName** (string)

  serviceName — це назва Service, який керує цим StatefulSet. Цей сервіс повинен існувати до створення StatefulSet і відповідає за мережеву ідентичність набору. Podʼи отримують DNS/hostnames, які відповідають шаблону: pod-specific-string.serviceName.default.svc.cluster.local, де "pod-specific-string" управляється контролером StatefulSet.

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), обовʼязково

  selector — це запит міток для Podʼів, які повинні відповідати кількості реплік. Він повинен відповідати міткам шаблону Podʼа. Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), обовʼязково

  template — це обʼєкт, який описує Pod, що буде створений у випадку недостатньої кількості реплік. Кожен Pod, створений StatefulSet, буде відповідати цьому шаблону, але матиме унікальну ідентичність у порівнянні з іншими Podʼами StatefulSet. Кожен Pod буде названий за форматом \<statefulsetname\>-\<podindex\>. Наприклад, Pod у StatefulSet з імʼям "web" з індексом номер "3" буде називатися "web-3". Єдине дозволене значення для template.spec.restartPolicy — "Always".

- **replicas** (int32)

  replicas — це бажана кількість реплік даного шаблону. Це репліки в тому сенсі, що вони є екземплярами одного і того ж шаблону, але кожна репліка також має постійну ідентичність. Якщо не вказано, стандартне значення — 1.

- **updateStrategy** (StatefulSetUpdateStrategy)

  updateStrategy вказує на StatefulSetUpdateStrategy, яка буде використовуватися для оновлення Podʼів у StatefulSet при внесенні змін до шаблону.

  <a name="StatefulSetUpdateStrategy"></a>
  *StatefulSetUpdateStrategy вказує стратегію, яку контролер StatefulSet буде використовувати для виконання оновлень. Вона включає будь-які додаткові параметри, необхідні для виконання оновлення для зазначеної стратегії.*

  - **updateStrategy.type** (string)

    Type вказує тип StatefulSetUpdateStrategy. Стандартне значення — RollingUpdate.

    Можливі значення переліку (enum):
    - `"OnDelete"` запускає стару поведінку. Відстеження версій та упорядковані послідовні перезапуски вимкнені. Podʼи відтворюються з StatefulSetSpec, коли вони видаляються вручну. Коли операція масштабування виконується за цією стратегією, версія специфікації вказується поточним значенням StatefulSet's currentRevision.
    - `"RollingUpdate"` вказує, що оновлення буде застосовано до всіх Podʼів у StatefulSet з урахуванням обмежень порядку StatefulSet. Коли операція масштабування виконується за цією стратегією, нові Podʼи будуть створені з версії специфікації, вказаної в updateRevision StatefulSet.

  - **updateStrategy.rollingUpdate** (RollingUpdateStatefulSetStrategy)

    RollingUpdate використовується для передачі параметрів, коли Type є RollingUpdateStatefulSetStrategyType.

    <a name="RollingUpdateStatefulSetStrategy"></a>
    *RollingUpdateStatefulSetStrategy використовується для передачі параметрів для RollingUpdateStatefulSetStrategyType.*

    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      Максимальна кількість Podʼів, які можуть бути недоступні під час оновлення. Значення може бути абсолютним числом (наприклад, 5) або відсотком від бажаної кількості Podʼів (наприклад, 10%). Абсолютна кількість розраховується від відсотків шляхом округлення в більшу сторону. Це не може бути 0. Стандартне значення — 1. Це поле є бета-рівнем і є стандартно активним. Поле застосовується до всіх Podʼів у діапазоні від 0 до Replicas-1. Це означає, що якщо будь-який Pod у діапазоні від 0 до Replicas-1 недоступний, він буде враховуватися як MaxUnavailable. Це налаштування може бути неефективним для OrderedReady podManagementPolicy. Ця політика гарантує, що поди створюються і стають готовими по одному.

      <a name="IntOrString"></a>
      *IntOrString — це тип, який може містити int32 або рядок. Під час перетворення з/у JSON або YAML він створює або споживає внутрішній тип. Це дозволяє мати, наприклад, поле JSON, яке може приймати назву або номер.*

    - **updateStrategy.rollingUpdate.partition** (int32)

      Partition вказує порядковий номер, на якому StatefulSet повинен бути розділений для оновлень. Під час rolling update всі Podʼи від порядкового номера Replicas-1 до Partition оновлюються. Всі Podʼи від порядкового номера Partition-1 до 0 залишаються незмінними. Це корисно для проведення канаркового розгортання. Стандартне значення — 0.

- **podManagementPolicy** (string)

  podManagementPolicy контролює, як Podʼи створюються під час початкового масштабування, при заміні Podʼів на вузлах або при масштабуванні вниз. Стандартне значення — `OrderedReady`, коли Podʼи створюються в порядку зростання (pod-0, потім pod-1 і т.д.), і контролер чекатиме, поки кожен Pod буде готовий, перш ніж продовжити. При масштабуванні вниз Podʼи видаляються у зворотному порядку. Альтернативною політикою є `Parallel`, яка створює Podʼи паралельно для досягнення бажаного масштабу без очікування, а при масштабуванні вниз видаляє всі Podʼи одночасно.

  Можливі значення переліку (enum):
  - `"OrderedReady"` створюватиме podʼи у строго зростаючому порядку при збільшенні масштабу та строго спадному порядку при зменшенні масштабу, просуваючись лише тоді, коли попередній pod готовий або завершений. Одночасно змінюватиметься не більше одного podʼа.
  - `"Parallel"` створюватиме та видалятиме podʼи, щойно зміниться кількість реплік stateful set, і не чекатиме, поки podʼи стануть готовими або завершать термінацію.

- **revisionHistoryLimit** (int32)

  revisionHistoryLimit — це максимальна кількість ревізій, які будуть зберігатися в історії ревізій StatefulSet. Історія ревізій складається з усіх ревізій, які не представлені поточною застосованою версією StatefulSetSpec. Стандартне значення — 10.

- **volumeClaimTemplates** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>)

  *Atomic: буде замінено під час злиття*

  volumeClaimTemplates — це список запитів, до яких Podʼи можуть звертатися. Контролер StatefulSet відповідає за призначення мережевих ідентичностей запитам таким чином, щоб зберігати ідентичність Podʼа. Кожен запит у цьому списку повинен мати принаймні один відповідний (за імʼям) volumeMount в одному з контейнерів в шаблоні. Запит у цьому списку має пріоритет над будь-якими volumes у шаблоні з таким самим імʼям.

- **minReadySeconds** (int32)

  Мінімальна кількість секунд, протягом яких новий створений Pod повинен бути готовим без збоїв жодного з його контейнерів, щоб його вважати доступним. Стандартне значення — 0 (Pod буде вважатися доступним, як тільки він буде готовий)

- **persistentVolumeClaimRetentionPolicy** (StatefulSetPersistentVolumeClaimRetentionPolicy)

  persistentVolumeClaimRetentionPolicy описує життєвий цикл запитів на постійні томи, створених з volumeClaimTemplates. Стандартно усі запити на постійні томи створюються за необхідності та зберігаються до ручного видалення. Ця політика дозволяє змінювати життєвий цикл, наприклад, видаляючи запити на постійні томи під час видалення їх StatefulSet або при масштабуванні вниз Podʼів.

  <a name="StatefulSetPersistentVolumeClaimRetentionPolicy"></a>

  *StatefulSetPersistentVolumeClaimRetentionPolicy описує політику, яка використовується для PVC, створених з VolumeClaimTemplates StatefulSet.*

  - **persistentVolumeClaimRetentionPolicy.whenDeleted** (string)

    WhenDeleted визначає, що відбувається з PVC, створеними з VolumeClaimTemplates StatefulSet, коли StatefulSet видаляється. Стандартна політика `Retain` призводить до того, що на PVC не впливає видалення StatefulSet. Політика `Delete` призводить до видалення таких PVC.

  - **persistentVolumeClaimRetentionPolicy.whenScaled** (string)

    WhenScaled визначає, що відбувається з PVC, створеними з VolumeClaimTemplates StatefulSet, коли StatefulSet масштабується вниз. Стандартна політика `Retain` призводить до того, що на PVC не впливає масштабування вниз. Політика `Delete` призводить до видалення відповідних PVC для будь-яких зайвих Podʼів, що перевищують кількість реплік.

- **ordinals** (StatefulSetOrdinals)

  ordinals контролює нумерацію індексів реплік у StatefulSet. Стандартна поведінка ordinals призначає індекс "0" першій репліці та збільшує індекс на одиницю для кожної додаткової запитаної репліки.

  <a name="StatefulSetOrdinals"></a>
  *StatefulSetOrdinals описує політику, яка використовується для призначення порядкових номерів реплік у цьому StatefulSet.*

  - **ordinals.start** (int32)

    start — це число, що представляє індекс першої репліки. Його можна використовувати для нумерації реплік з альтернативного індексу (наприклад, з 1) замість стандартної індексації з 0, або для організації поступового переміщення реплік з одного StatefulSet до іншого. Якщо встановлено, індекси реплік будуть у діапазоні:

    - [.spec.ordinals.start, .spec.ordinals.start + .spec.replicas].

    Якщо не встановлено, стандартне значення — 0. Індекси реплік будуть у діапазоні:

    - [0, .spec.replicas].

## StatefulSetStatus {#StatefulSetStatus}

StatefulSetStatus представляє поточний стан StatefulSet.

---

- **replicas** (int32), обовʼязково

  replicas — це кількість Podʼів, створених контролером StatefulSet.

- **readyReplicas** (int32)

  readyReplicas — це кількість Podʼів, створених для цього StatefulSet, які мають стан Ready.

- **currentReplicas** (int32)

  currentReplicas — це кількість Podʼів, створених контролером StatefulSet з версії StatefulSet, зазначеної в currentRevision.

- **updatedReplicas** (int32)

  updatedReplicas — це кількість Podʼів, створених контролером StatefulSet з версії StatefulSet, зазначеної в updateRevision.

- **availableReplicas** (int32)

  Загальна кількість доступних Podʼів (готових принаймні minReadySeconds), на які спрямований цей statefulset.

- **collisionCount** (int32)

  collisionCount — це кількість хеш-колізій для StatefulSet. Контролер StatefulSet використовує це поле як механізм уникнення колізій при створенні імені для найновішого ControllerRevision.

- **conditions** ([]StatefulSetCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Представляє останні доступні спостереження поточного стану StatefulSet.

  <a name="StatefulSetCondition"></a>
  *StatefulSetCondition описує стан StatefulSet у певний момент часу.*

  - **conditions.status** (string), обовʼязково

    Статус стану, один з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану StatefulSet.

  - **conditions.lastTransitionTime** (Time)

    Останній час, коли стан переходив з одного статусу в інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, із зазначенням деталей про перехід.

  - **conditions.reason** (string)

    Причина останнього переходу умови.

- **currentRevision** (string)

  currentRevision, якщо не порожній, вказує версію StatefulSet, яка використовується для створення Podʼів у послідовності [0,currentReplicas].

- **updateRevision** (string)

  updateRevision, якщо не порожній, вказує версію StatefulSet, яка використовується для створення Podʼів у послідовності [replicas-updatedReplicas,replicas]

- **observedGeneration** (int64)

  observedGeneration — останнє покоління, яке спостерігалося для цього StatefulSet. Воно відповідає поколінню StatefulSet, яке оновлюється при зміні сервером API.

## StatefulSetList {#StatefulSetList}

StatefulSetList — це колекція StatefulSet.

---

- **apiVersion**: apps/v1

- **kind**: StatefulSetList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>), обовʼязково

  Items — це список StatefulSet.

## Операції {#operations}

---

### `get` отримати вказаний StatefulSet {#get-read-the-specified-statefulset}

#### HTTP-запит {#http-request}

GET /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва StatefulSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

401: Unauthorized

### `get` отримати статус вказаного StatefulSet {#get-read-the-status-of-the-specified-statefulset}

#### HTTP-запит {#http-request-1}

GET /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  назва StatefulSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу StatefulSet {#list-list-or-watch-objects-of-kind-statefulset}

#### HTTP-запит {#http-request-2}

GET /apis/apps/v1/namespaces/{namespace}/statefulsets

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetList" >}}">StatefulSetList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу StatefulSet {#list-list-or-watch-objects-of-kind-statefulset-1}

#### HTTP-запит {#http-request-3}

GET /apis/apps/v1/statefulsets

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetList" >}}">StatefulSetList</a>): OK

401: Unauthorized

### `create` створення StatefulSet {#create-create-a-statefulset}

#### HTTP-запит {#http-request-4}

POST /apis/apps/v1/namespaces/{namespace}/statefulsets

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

202 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Accepted

401: Unauthorized

### `update` заміна вказаного StatefulSet {#update-replace-the-specified-statefulset}

#### HTTP-запит {#http-request-5}

PUT /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва StatefulSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного StatefulSet {#update-replace-the-status-of-the-specified-statefulset}

#### HTTP-запит {#http-request-6}

PUT /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва StatefulSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, обовʼязково

- **dryRun** (*в запиті*): string

  [<a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного StatefulSet {#patch-partially-update-the-specified-statefulset}

#### HTTP-запит {#http-request-7}

PATCH /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  назва StatefulSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#patch" >}}">patch</a>, обовʼязково

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized


### `patch` часткове оновлення статусу вказакного StatefulSet {#patch-partially-update-the-status-of-the-specified-statefulset}

#### HTTP-запит {#http-request-8}

PATCH /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

#### Параметри {#parameters-8}

- **name** (*в запиті*): string, обовʼязково

  назва StatefulSet

- **namespace** (*в запиті*): string, обовʼязково

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized

### `delete` видалення StatefulSet {#delete-delete-a-statefulset}

#### HTTP-запит {#http-request-9}

DELETE /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  назва StatefulSet

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#deleteOptions" >}}">DeleteOptions</a>

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

### `deletecollection` видалення колекції StatefulSet {#deletecollection-delete-collection-of-statefulset}

#### HTTP-запит {#http-request-10}

DELETE /apis/apps/v1/namespaces/{namespace}/statefulsets

#### Параметри {#parameters-10}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#deleteOptions" >}}">DeleteOptions</a>

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

- **limit** *в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** *в запиті*): string

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
