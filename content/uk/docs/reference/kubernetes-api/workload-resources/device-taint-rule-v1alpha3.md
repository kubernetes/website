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

## DeviceTaintRuleSpec {#DeviceTaintRuleSpec}

DeviceTaintRuleSpec визначає селектор та одну позначку taint.

---

- **taint** (DeviceTaint), обовʼязково

  Позначка taint, яку буде додано до відповідних пристроїв.

  <a name="DeviceTaint"></a>
  *Пристрій, до якого прикріплено цей taint, має «вплив» на будь-яку заявку, яка не толерує taint, і, через заявку, на podʼи, що використовують цю заявку.*

  - **taint.effect** (string), обовʼязково

    Вплив taint на заявки, які не толерують taint, а через такі заявки і на podʼи, які їх використовують. Допустимими ефектами є NoSchedule та NoExecute. PreferNoSchedule, що використовується для вузлів, тут не діє.

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

  - **deviceSelector.deviceClassName** (string)

    Якщо задано DeviceClassName, селектори, визначені у цьому полі, повинні задовольняти пристрій, який буде вибрано. Це поле відповідає class.metadata.name.

  - **deviceSelector.driver** (string)

    Якщо задано driver, буде вибрано лише пристрої з цим драйвером. Це поле відповідає slice.spec.driver.

  - **deviceSelector.pool** (string)

    Якщо задано pool, буде вибрано лише пристрої з цього пулу.

    Також слід вказати назву драйвера, щоб уникнути неоднозначності, коли різні драйвери використовують однакову назву пулу, але це не є обовʼязковим, оскільки вибір пулів з різних драйверів також може бути корисним, наприклад, коли драйвери з локальними пристроями вузла використовують назву вузла як назву пулу.

  - **deviceSelector.selectors** ([]DeviceSelector)

    *Atomic: буде замінено під час злиття*

    Selectors містить ті самі критерії відбору, що і ResourceClaim. Наразі підтримуються CEL-вирази. Всі ці селектори повинні бути задоволені.

    <a name="DeviceSelector"></a>
    *DeviceSelector повинен мати рівно одне встановлене поле.*

    - **deviceSelector.selectors.cel** (CELDeviceSelector)

      CEL містить вираз CEL для обраного пристрою.

      <a name="CELDeviceSelector"></a>
      *CELDeviceSelector містить CEL-вираз для вибору пристрою.*

      - **deviceSelector.selectors.cel.expression** (string), обовʼязково

        Expression — це CEL-вираз, який оцінює один пристрій. Він повинен мати значення true, якщо пристрій, що розглядається, задовольняє бажаним критеріям, і false, якщо не задовольняє. Будь-який інший результат є помилкою і призводить до переривання розподілу пристроїв.

        На вхід виразу подається обʼєкт з іменем "device", який має наступні властивості:

         - driver (string): імʼя драйвера, який визначає цей пристрій.
         - attributes (map[string]object): атрибути пристрою, згруповані за префіксом (наприклад, device.attributes["dra.example.com"] оцінює обʼєкт з усіма атрибутами, що мають префікс "dra.example.com").
         - capacity (map[string]object): потужності пристрою, згруповані за префіксом.

        Приклад: Розглянемо пристрій з driver="dra.example.com", який має два атрибути "model" і "ext.example.com/family" та одну одиницю "modules". Вхідні дані для цього виразу матимуть такі поля:

            device.driver
            device.attributes["dra.example.com"].model
            device.attributes["ext.example.com"].family
            device.capacity["dra.example.com"].modules

        Поле device.driver можна використовувати для перевірки наявності певного драйвера або як високорівневу передумову (тобто ви хочете розглядати пристрої лише з цим драйвером), або як частину багатокомпонентного виразу, призначеного для розгляду пристроїв з різними драйверами.

        Тип значення кожного атрибута визначено у визначенні пристрою, і користувачі, які пишуть ці вирази, повинні звернутися до документації до своїх конкретних драйверів. Тип значення кожної одиниці — Quantity (кількість).

        Якщо невідомий префікс використовується для пошуку в device.attributes або device.capacity, буде повернуто порожній map. Будь-яке посилання на невідоме поле призведе до помилки оцінки та переривання розподілу.

        Надійний вираз повинен перевіряти існування атрибутів перед тим, як посилатися на них.

        Для зручності використання увімкнено функцію cel.bind(), яку можна використовувати для спрощення виразів, що звертаються до декількох атрибутів з одним доменом. Наприклад

            cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)

        Довжина виразу повинна бути меншою або дорівнювати 10 Ki. Вартість його обчислення також обмежена, виходячи з передбачуваної кількості логічних кроків.

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

### `list` перелік або перегляд обʼєктів типу DeviceTaintRule {#list-list-or-watch-objects-of-kind-devicetaintrule}

#### HTTP Запит {#http-request-1}

GET /apis/resource.k8s.io/v1alpha3/devicetaintrules

#### Параметри {#parameters-1}

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

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRuleList" >}}">DeviceTaintRuleList</a>): OK

401: Unauthorized

### `create` створення DeviceTaintRule {#create-create-a-devicetaintrule}

#### HTTP Запит {#http-request-2}

POST /apis/resource.k8s.io/v1alpha3/devicetaintrules

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized

### `update` заміна вказаного DeviceTaintRule {#update-replace-the-specified-devicetaintrule}

#### HTTP Запит {#http-request-3}

PUT /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Параметри {#parameters-3}

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

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного DeviceTaintRule {#patch-partially-update-the-specified-devicetaintrule}

#### HTTP Запит {#http-request-4}

PATCH /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Параметри {#parameters-4}

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

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

201 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Created

401: Unauthorized

### `delete` видалення DeviceTaintRule {#delete-delete-a-devicetaintrule}

#### HTTP Запит {#http-request-5}

DELETE /apis/resource.k8s.io/v1alpha3/devicetaintrules/{name}

#### Параметри {#parameters-5}

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

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): OK

202 (<a href="{{< ref "../workload-resources/device-taint-rule-v1alpha3#DeviceTaintRule" >}}">DeviceTaintRule</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції DeviceTaintRule {#deletecollection-delete-collection-of-devicetaintrule}

#### HTTP Запит {#http-request-6}

DELETE /apis/resource.k8s.io/v1alpha3/devicetaintrules

#### Параметри {#parameters-6}

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
