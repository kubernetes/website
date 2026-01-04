---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "DeviceTaintRule"
content_type: "api_reference"
description: "DeviceTaintRule додає одну позначку taint до всіх пристроїв, які відповідають селектору."
title: "DeviceTaintRule v1alpha3"
weight: 15
auto_generated: true
---

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`

## DeviceTaintRule {#DeviceTaintRule}

DeviceTaintRule додає одну позначку taint до всіх пристроїв, які відповідають селектору. Це має той самий ефект, як якби позначку taint було вказано безпосередньо в ResourceSlice драйвером DRA.

---

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: DeviceTaintRule

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта

- **spec** (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleSpec" >}}">DeviceTaintRuleSpec</a>), обовʼязково

  Spec визначає селектор та одну позначку taint.

  Зміна spec автоматично збільшує номер metadata.generation.

- **status** (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleStatus" >}}">DeviceTaintRuleStatus</a>)

  Status надає інформацію про те, що було запрошено в специфікації.

## DeviceTaintRuleSpec {#DeviceTaintRuleSpec}

DeviceTaintRuleSpec визначає селектор та одну позначку taint.

---

- **taint** (DeviceTaint), обовʼязково

  Позначка taint, яку буде додано до відповідних пристроїв.

  <a name="DeviceTaint"></a>
  *Пристрій, до якого прикріплено цей taint, має «вплив» на будь-яку заявку, яка не толерує taint, і, через заявку, на podʼи, що використовують цю заявку.*

  - **taint.effect** (string), обовʼязково

    Вплив taint на заявки, які не толерують taint, а через такі заявки і на podʼи, які їх використовують.

    Допустимими ефектами є None, NoSchedule та NoExecute. PreferNoSchedule, що використовується для вузлів, тут не діє. У майбутньому можуть бути додані інші ефекти. Споживачі повинні ставитися до невідомих ефектів як до None.

    Можливі значення переліку (enum):
    - `"NoExecute"` Виселення Podʼів, які вже працюють і не толерують taint пристрою.
    - `"NoSchedule"` Не дозволяти новим podʼам планувати використання tainted device, якщо вони не толерують taint, але дозволяти всім podʼам, надісланим до Kubelet без проходження через планувальник, запускатися, і дозволяти всім вже запущеним podʼам продовжувати працювати.
    - `"None"` Немає ефекту, позначка taint є суто інформаційною.

  - **taint.key** (string), обовʼязково

    Ключ taint може бути застосований до пристрою. Має бути імʼям мітки.

  - **taint.timeAdded** (Time)

    TimeAdded представляє час коли taint було додано. Додається автоматично під час створення або оновлення, якщо не встановлено..

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **taint.value** (string)

    Значення відповідного ключа taint. Має бути значення мітки.

- **deviceSelector** (DeviceTaintSelector)

  DeviceSelector визначає, до якого пристрою (пристроїв) буде застосовано taint. Для того, щоб пристрій було знайдено, мають бути виконані всі критерії селектора. Порожній селектор відповідає всім пристроям. Без селектора не буде знайдено жодного пристрою.

  <a name="DeviceTaintSelector"></a>
  *Селектор DeviceTaintSelector визначає, до якого пристрою (пристроїв) застосовується правило DeviceTaintRule. Порожній селектор відповідає всім пристроям. Без селектора не буде знайдено жодного пристрою.*

  - **deviceSelector.device** (string)

    Якщо задано значення device, буде обрано лише пристрої з такою назвою. Це поле відповідає slice.spec.devices[].name.

    Для уникнення двозначності може знадобитися вказати також драйвер і пул, але це не є обовʼязковим.

  - **deviceSelector.driver** (string)

    Якщо задано driver, буде вибрано лише пристрої з цим драйвером. Це поле відповідає slice.spec.driver.

  - **deviceSelector.pool** (string)

    Якщо задано pool, буде вибрано лише пристрої з цього пулу.

    Також слід вказати назву драйвера, щоб уникнути неоднозначності, коли різні драйвери використовують однакову назву пулу, але це не є обовʼязковим, оскільки вибір пулів з різних драйверів також може бути корисним, наприклад, коли драйвери з локальними пристроями вузла використовують назву вузла як назву пулу.

## DeviceTaintRuleStatus {#DeviceTaintRuleStatus}

DeviceTaintRuleStatus надає інформацію про поточне виселення подів.

---

- **conditions** ([]Condition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Conditions надають інформацію про стан DeviceTaintRule та кластера в певний момент часу у форматі, придатному для читання машиною та людиною.

  Наразі в рамках цього API визначено такий стан, але можуть бути додані й інші:
  - Type: EvictionInProgress
  - Status: True, якщо в даний момент є pod'и, які потрібно виселити, False в іншому випадку (включає ефекти, які не спричиняють виселення).
  - Reason: не вказано, може змінюватися
  - Message: містить інформацію про кількість pod'ів, що очікують на виселення, та pod'ів, які вже виселені, у форматі, зрозумілому для людини, що періодично оновлюється, може змінюватися

  Для `effect: None` стан вказаний вище встановлюється один раз для кожної зміни специфікації, а повідомлення містить інформацію про те, що відбудеться, якщо ефект буде `NoExecute`. Цей відгук можна використовувати для прийняття рішення про те, чи зміна ефекту на `NoExecute` буде працювати як передбачалося. Він встановлюється тільки один раз, щоб уникнути необхідності постійного оновлення стану.

  Повинно бути не більше 8 записів.

  <a name="Condition"></a>
  *Condition містить детальну інформацію про один аспект поточного стану цього ресурсу API.*

  - **conditions.lastTransitionTime** (Time), обовʼязково

    lastTransitionTime — це останній час, коли стан змінився з одного на інший. Це має бути момент, коли змінився базовий стан.  Якщо це невідомо, то можна використовувати час, коли змінилося поле API.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string), обовʼязково

    message — це повідомлення, яке може прочитати людина, із детальною інформацією про перехід. Це може бути порожній рядок.

  - **conditions.reason** (string), обовʼязково

    reason містить програмний ідентифікатор, що вказує причину останнього переходу стану. Постачальники конкретних типів станів можуть визначати очікувані значення та значення для цього поля, а також те, чи вважаються ці значення гарантованим API. Значення повинно бути рядком CamelCase. Це поле не може бути порожнім.

  - **conditions.status** (string), обовʼязково

    status стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    type стану в форматі CamelCase або в foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якого було встановлено стан. Наприклад, якщо .metadata.generation наразі дорівнює 12, але .status.conditions[x].observedGeneration дорівнює 9, стан є застарілим стосовно поточного стану екземпляра.

## DeviceTaintRuleList {#DeviceTaintRuleList}

DeviceTaintRuleList є колекцією DeviceTaintRules.

---

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: DeviceTaintRuleList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку

- **items** ([]<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>), обовʼязково

  Items є переліком DeviceTaintRules.

## Операції {#operations}

---

### `get` отримати вказаний DeviceTaintRule {#get-read-the-specified-devicetaintrule}

#### HTTP Запит {#http-request}

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя DeviceTaintRule

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

401: Unauthorized

### `get` отримати статус вказаного DeviceTaintRule {#get-read-status-of-the-specified-devicetaintrule}

#### HTTP Запит {#http-request-1}

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя DeviceTaintRule

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу DeviceTaintRule {#list-list-or-watch-objects-of-kind-devicetaintrule}

#### HTTP Запит {#http-request-2}

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleList" >}}">DeviceTaintRuleList</a>): OK

401: Unauthorized

### `create` створення DeviceTaintRule {#create-create-a-devicetaintrule}

#### HTTP Запит {#http-request-3}

POST /apis/resource.k8s.io/v1alpha3/devicetaintrules

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized

### `update` заміна вказаного DeviceTaintRule {#update-replace-the-specified-devicetaintrule}

#### HTTP Запит {#http-request-4}

PUT /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя the DeviceTaintRule

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного DeviceTaintRule {#update-replace-status-of-the-specified-devicetaintrule}

#### HTTP Request

PUT /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя the DeviceTaintRule

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного DeviceTaintRule {#patch-partially-update-the-specified-devicetaintrule}

#### HTTP Запит {#http-request-6}

PATCH /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя DeviceTaintRule

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного DeviceTaintRule {#patch-partially-update-status-of-the-specified devicetaintrule}

#### HTTP Запит {#http-request-7}

PATCH /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя DeviceTaintRule

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

### `delete` видалення DeviceTaintRule {#delete-delete-a-devicetaintrule}

#### HTTP Запит {#http-request-8}

DELETE /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя DeviceTaintRule

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції DeviceTaintRule {#deletecollection-delete-collection-of-devicetaintrule}

#### HTTP Запит {#http-request-9}

DELETE /apis/resource.k8s.io/v1alpha3/devicetaintrules

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
