---
api_metadata:
  apiVersion: "resource.k8s.io/v1"
  import: "k8s.io/api/resource/v1"
  kind: "DeviceClass"
content_type: "api_reference"
description: "`DeviceClass` — це ресурс, наданий постачальником або адміністратором, який містить конфігурацію пристрою та селектори."
title: "DeviceClass"
weight: 2
auto_generated: true
---

`apiVersion: resource.k8s.io/v1`

`import "k8s.io/api/resource/v1"`

## DeviceClass {#DeviceClass}

DeviceClass — це ресурс, наданий постачальником або адміністратором, який містить конфігурацію пристрою та селектори. На нього можна посилатися у запитах до пристрою, щоб застосувати ці пресети. Охоплює кластер.

Це альфа-тип і вимагає увімкнення функціональної можливості DynamicResourceAllocation.

---

- **apiVersion**: resource.k8s.io/v1

- **kind**: DeviceClass

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартний обʼєкт метаданих

- **spec** (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClassSpec" >}}">DeviceClassSpec</a>), обовʼязково

  Spec визначає, що можна призначити і як це налаштувати.

  Поле є змінюваним. Споживачі повинні бути готові до того, що класи можуть змінюватися в будь-який час, як через оновлення, так і через заміну. Розподілення заявок виконується один раз на основі того, що було встановлено в класах на момент виділення.

  Зміна spec автоматично збільшує номер metadata.generation.

## DeviceClassSpec {#DeviceClassSpec}

DeviceClassSpec використовується в [DeviceClass] для визначення того, що може бути призначено і як це налаштувати.

---

- **config** ([]DeviceClassConfiguration)

  *Atomic: буде замінено під час злиття*

  Config визначає параметри конфігурації, які застосовуються до кожного пристрою, що описується у цьому класі. Деякі класи потенційно можуть задовольнятися кількома драйверами, тому кожен екземпляр конфігурації постачальника застосовується лише до одного драйвера.

  Вони передаються драйверу, але не враховуються при розподілі заявки.

  <a name="DeviceClassConfiguration"></a>
  *DeviceClassConfiguration використовується в DeviceClass.*

  - **config.opaque** (OpaqueDeviceConfiguration)

    Opaque надає специфічні для драйвера параметри конфігурації.

    <a name="OpaqueDeviceConfiguration"></a>
    *OpaqueDeviceConfiguration містить параметри конфігурації драйвера у форматі, визначеному постачальником драйвера.*

    - **config.opaque.driver** (string), обовʼязково

      Driver використовується для визначення, в який втулок kubelet потрібно передати ці параметри конфігурації.

      Політика допуску, надана розробником драйвера, може використовувати це для прийняття рішення про те, чи потрібно перевіряти їх.

      Повинен бути DNS піддоменом і закінчуватися на DNS домен, що належить постачальнику драйвера. Мають використовуватись символи нижнього регістру.

    - **config.opaque.parameters** (RawExtension), обовʼязково

      Параметри можуть містити довільні дані. Відповідальність за перевірку та керування версіями покладається на розробника драйверів. Зазвичай це включає самоідентифікацію та версію ("kind" + "apiVersion" для типів Kubernetes), а також конвертацію між різними версіями.

      Довжина вихідних даних повинна бути меншою або дорівнювати 10 Ki.

      <a name="RawExtension"></a>
      *RawExtension використовується для зберігання розширень у зовнішніх версіях.*

      Щоб використовувати це, створіть поле, яке має тип RawExtension у вашій зовнішній, версійованій структурі, і Object у вашій внутрішній структурі. Також потрібно зареєструвати ваші різні типи втулків.

      // Внутрішній пакунок:

        ```go
      	type MyAPIObject struct {
      		runtime.TypeMeta `json:",inline"`
      		MyPlugin runtime.Object `json:"myPlugin"`
      	}

      	type PluginA struct {
      		AOption string `json:"aOption"`
      	}
        ```

      // Зовнішній пакунок:

        ```go
      	type MyAPIObject struct {
      		runtime.TypeMeta `json:",inline"`
      		MyPlugin runtime.RawExtension `json:"myPlugin"`
      	}

      	type PluginA struct {
      		AOption string `json:"aOption"`
      	}
        ```

      // Готовий JSON буде виглядати приблизно так:

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

      Що відбувається? Спочатку декодування використовує json або yaml для десеріалізації даних у ваш зовнішній MyAPIObject. Це призводить до зберігання необробленого JSON, але без розпакування. Наступний крок — копіювання (за допомогою pkg/conversion) у внутрішню структуру. Функції перетворення, встановлені в DefaultScheme пакета runtime, розпаковують JSON, збережений у RawExtension, перетворюючи його в правильний тип обʼєкта і зберігаючи його в Object. (TODO: У випадку, коли обʼєкт має невідомий тип, буде створено і збережено обʼєкт runtime.Unknown.)

- **extendedResourceName** (string)

  ExtendedResourceName — це розширена назва ресурсу для пристроїв цього класу. Пристрої цього класу можуть використовуватися для задоволення розширених запитів на ресурси пода. Вона має той самий формат, що й назва розширеного ресурсу подп. Вона повинна бути унікальною серед усіх класів пристроїв у кластері. Якщо два класи пристроїв мають однакову назву, то для задоволення розширених запитів на ресурси пода вибирається клас, створений пізніше. Якщо два класи створені одночасно, то вибирається імʼя класу, яке сортується лексикографічно першим.

  Це поле alpha.

- **selectors** ([]DeviceSelector)

  *Atomic: буде замінено під час злиття*

  Кожному селектору повинен відповідати пристрій, що заявляється в цьому класі.

  <a name="DeviceSelector"></a>
  *DeviceSelector повинен мати рівно одне встановлене поле.*

  - **selectors.cel** (CELDeviceSelector)

    CEL містить вираз CEL для вибору пристрою.

    <a name="CELDeviceSelector"></a>
    *CELDeviceSelector містить вираз CEL для вибору пристрою.*

    - **selectors.cel.expression** (string), обовʼязково

      Вираз є виразом CEL, який оцінює один пристрій. Він має оцінюватися як true, коли пристрій відповідає бажаним критеріям, і як false, коли не відповідає. Будь-який інший результат є помилкою і призводить до зупинки надання пристроїв.

      Вхідні дані виразу — це обʼєкт з назвою "device", який має наступні властивості:
      - driver (рядок): імʼя драйвера, який визначає цей пристрій.
      - attributes (map[string]object): атрибути пристрою, згруповані за префіксом (наприклад, device.attributes["dra.example.com"] оцінюється як обʼєкт з усіма атрибутами, які були префіксовані "dra.example.com").
      - capacity (map[string]object): обсяги пристрою, згруповані за префіксом.
      - allowMultipleAllocations (bool): властивість allowMultipleAllocations пристрою (v1.34+ з увімкненою функцією DRAConsumableCapacity).

      Приклад: Розглянемо пристрій з driver="dra.example.com", який надає два атрибути з назвою "model" та "ext.example.com/family" і один обсяг з назвою "modules". Вхідні дані для цього виразу будуть мати такі поля:

      ```none
      device.driver
      device.attributes["dra.example.com"].model
      device.attributes["ext.example.com"].family
      device.capacity["dra.example.com"].modules
      ```

      Поле device.driver можна використовувати для перевірки конкретного драйвера, або як загальну попередню умову (тобто ви хочете розглядати лише пристрої від цього драйвера), або як частину виразу з кількома умовами, який призначений для розгляду пристроїв з різних драйверів.

      Тип значення кожного атрибута визначається визначенням пристрою, і користувачі, які пишуть ці вирази, повинні звертатися до документації для своїх конкретних драйверів. Тип значення кожного обсягу — Quantity.

      Якщо невідомий префікс використовується для запиту в device.attributes або device.capacity, буде повернено порожній map. Будь-яке посилання на невідоме поле спричинить помилку оцінки і зупинку виділення.

      Робочий вираз має перевіряти наявність атрибутів перед їх використанням.

      Для зручності використання доступна функція cel.bind(), яка може бути використана для спрощення виразів, що звертаються до кількох атрибутів з одного домену. Наприклад:

      ```none
      cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
      ```

      Довжина виразу повинна бути меншою або дорівнювати 10 Ki. Вартість його обчислення також обмежена на основі передбачуваної кількості логічних кроків.

## DeviceClassList {#DeviceClassList}

DeviceClassList — це колекція класів.

---

- **apiVersion**: resource.k8s.io/v1

- **kind**: DeviceClassList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку

- **items** ([]<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>), обовʼязково

  Items — список класів ресурсів.

## Operations {#Operations}

---

### `get` отримати вказаний DeviceClass {#get-read-the-specified-deviceclass}

#### HTTP запит {#http-request}

GET /apis/resource.k8s.io/v1/deviceclasses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the DeviceClass

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу DeviceClass {#list-list-or-watch-objects-of-kind-deviceclass}

#### HTTP запит {#http-request-1}

GET /apis/resource.k8s.io/v1/deviceclasses

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

200 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClassList" >}}">DeviceClassList</a>): OK

401: Unauthorized

### `create` створення DeviceClass {#create-create-a-deviceclass}

#### HTTP запит {#http-request-2}

POST /apis/resource.k8s.io/v1/deviceclasses

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): Created

202 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): Accepted

401: Unauthorized

### `update` заміна вказаного DeviceClass {#update-replace-the-specified-deviceclass}

#### HTTP запит {#http-request-3}

PUT /apis/resource.k8s.io/v1/deviceclasses/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  name of the DeviceClass

- **body**: <a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного DeviceClass {#patch-partially-update-the-specified-deviceclass}

#### HTTP запит {#http-request-4}

PATCH /apis/resource.k8s.io/v1/deviceclasses/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  name of the DeviceClass

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

200 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): OK

201 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): Created

401: Unauthorized

### `delete` видалення DeviceClass {#delete-delete-a-deviceclass}

#### HTTP запит {#http-request-5}

DELETE /apis/resource.k8s.io/v1/deviceclasses/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name of the DeviceClass

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

200 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): OK

202 (<a href="{{< ref "../extend-resources/device-class-v1#DeviceClass" >}}">DeviceClass</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції DeviceClass {#deletecollection-delete-collection-of-deviceclass}

#### HTTP запит {#http-request-6}

DELETE /apis/resource.k8s.io/v1/deviceclasses

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
