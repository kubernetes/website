---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourceSlice"
content_type: "api_reference"
description: "ResourceSlice представляє один або декілька ресурсів у пулі подібних ресурсів, керованих спільним драйвером."
title: "ResourceSlice v1alpha3"
weight: 18
auto_generated: false
---

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`

## ResourceSlice {#ResourceSlice}

ResourceSlice представляє один або кілька ресурсів у пулі подібних ресурсів, що управляються спільним драйвером. Пул може охоплювати більше ніж один ResourceSlice, і точна кількість ResourceSlices, що складають пул, визначається драйвером.

Наразі підтримуються лише пристрої з атрибутами та ємностями (capacities). Кожен пристрій у певному пулі, незалежно від кількості ResourceSlices, повинен мати унікальне імʼя. ResourceSlice, в якому пристрій публікується, може змінюватися з часом. Унікальний ідентифікатор для пристрою — це кортеж \<імʼя драйвера>, \<імʼя пулу>, \<імʼя пристрою>.

Щоразу, коли драйверу потрібно оновити пул, він інкрементує номер pool.Spec.Pool.Generation і оновлює всі ResourceSlices з новим номером і новими визначеннями ресурсів. Споживач повинен використовувати лише ResourceSlices з найвищим номером покоління та ігнорувати всі інші.

При виділенні всіх ресурсів в пулі, що відповідають певним критеріям, або при пошуку найкращого рішення серед кількох різних альтернатив, споживач повинен перевірити кількість ResourceSlices у пулі (включену в кожен ResourceSlice), щоб визначити, чи є його погляд на пул повним, і, якщо ні, чекати, поки драйвер завершить оновлення пулу.

Для ресурсів, які не є локальними для вузла, імʼя вузла не встановлюється. Замість цього драйвер може використовувати селектор вузлів для вказівки, де пристрої доступні.

Це альфа-тип і вимагає активації функціональної можливості DynamicResourceAllocation.

---

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: ResourceSlice

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта

- **spec** (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSliceSpec" >}}">ResourceSliceSpec</a>), обовʼязково

  Містить інформацію, опубліковану драйвером.

  Зміна специфікації автоматично інкрементує номер metadata.generation.

## ResourceSliceSpec {#ResourceSliceSpec}

ResourceSliceSpec містить інформацію, опубліковану драйвером в одному ResourceSlice.

---

- **driver** (string), обовʼязково

  Driver ідентифікує драйвер DRA, який надає інформацію про ємність. Можна використовувати селектор полів для переліку лише об'єктів ResourceSlice з певним імʼям драйвера.

  Має бути піддоменом DNS і закінчуватися доменом DNS, що належить постачальнику драйвера. Це поле є незмінним.

- **pool** (ResourcePool), обовʼязково

  Pool описує пул, до якого належить цей ResourceSlice.

  <a name="ResourcePool"></a>
  *ResourcePool описує пул, до якого належать ResourceSlices.*

  - **pool.generation** (int64), обовʼязково

    Generation відстежує зміни в пулі з часом. Щоразу, коли драйвер змінює щось в одному або кількох ресурсах у пулі, він повинен змінити покоління у всіх ResourceSlices, які є частиною цього пулу. Споживачі ResourceSlices повинні враховувати лише ресурси з пулу з найвищим номером покоління. Покоління може бути скинуто драйверами, що має бути прийнятно для споживачів, за умови, що всі ResourceSlices у пулі оновлені, щоб відповідати новому поколінню або видалені.

    Поєднаний з ResourceSliceCount, цей механізм дозволяє споживачам виявляти пули, які складаються з кількох ResourceSlices і знаходяться в неповному стані.

  - **pool.name** (string), обовʼязково

    Name використовується для ідентифікації пулу. Для локальних на вузлі пристроїв це часто є імʼя вузла, але це не є обовʼязковим.

    Не повинно перевищувати 253 символи і повинно складатися з одного або кількох піддоменів DNS, розділених косими рисками. Це поле є незмінним.

  - **pool.resourceSliceCount** (int64), обовʼязково

    ResourceSliceCount — це загальна кількість ResourceSlices у пулі на цьому номері покоління. Має бути більше нуля.

    Споживачі можуть використовувати це для перевірки, чи вони бачили всі ResourceSlices, що належать одному й тому ж пулу.

- **allNodes** (boolean)

  AllNodes вказує на те, що всі вузли мають доступ до ресурсів у пулі.

  Має бути встановлено точно одне з полів NodeName, NodeSelector або AllNodes.

- **devices** ([]Device)

  *Atomic: буде замінено під час злиття*

  Devices перераховує деякі або всі пристрої в цьому пулі.

  Не повинно бути більше ніж 128 записів.

  <a name="Device"></a>
  *Device представляє один індивідуальний апаратний екземпляр, який може бути вибраний на основі його атрибутів. Окрім імені, має бути встановлено точно одне поле.*

  - **devices.name** (string), обовʼязково

    Name є унікальним ідентифікатором серед усіх пристроїв, які управляються драйвером у пулі. Має бути піддоменом DNS.

  - **devices.basic** (BasicDevice)

    Basic визначає один екземпляр пристрою.

    <a name="BasicDevice"></a>
    *BasicDevice визначає один екземпляр пристрою.*

    - **devices.basic.attributes** (map[string]DeviceAttribute)

      Attributes визначає набір атрибутів для цього пристрою. Імʼя кожного атрибута повинно бути унікальним у цьому наборі.

      Максимальна кількість атрибутів та ємностей разом — 32.

      <a name="DeviceAttribute"></a>
      *DeviceAttribute має бути встановлено точно одне поле.*

      - **devices.basic.attributes.bool** (boolean)

        BoolValue є значенням true/false.

      - **devices.basic.attributes.int** (int64)

        IntValue є числом.

      - **devices.basic.attributes.string** (string)

        StringValue є рядком. Не повинно бути довше 64 символів.

      - **devices.basic.attributes.version** (string)

        VersionValue є семантичною версією відповідно до специфікації semver.org 2.0.0. Не повинна перевищувати 64 символи в довжину.

    - **devices.basic.capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Capacity визначає набір ємностей для цього пристрою. Імʼя кожної ємності повинно бути унікальним у цьому наборі.

      Максимальна кількість атрибутів та ємностей разом — 32.

- **nodeName** (string)

  NodeName ідентифікує вузол, який надає ресурси в цьому пулі. Селектор полів можна використовувати для переліку лише обʼєктів ResourceSlice, що належать певному вузлу.

  Це поле може використовуватися для обмеження доступу з вузлів до ResourceSlices з тим же іменем вузла. Воно також вказує автомасштабувальникам, що додавання нових вузлів того ж типу, що й старий вузол, може також зробити нові ресурси доступними.

  Має бути встановлено точно одне з полів NodeName, NodeSelector або AllNodes. Це поле є незмінним.

- **nodeSelector** (NodeSelector)

  NodeSelector визначає, які вузли мають доступ до ресурсів у пулі, коли цей пул не обмежений до одного вузла.

  Має бути використано точно один термін.

  Має бути встановлено точно одне з полів NodeName, NodeSelector або AllNodes.

  <a name="NodeSelector"></a>
  *Селектор вузлів представляє обʼєднання результатів одного або кількох запитів міток по набору вузлів; тобто, він представляє логічну операцію OR селекторів, представлених термінами селектора вузлів.*

  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), обовʼязково

    *Atomic: буде замінено під час злиття*

    Обовʼязково. Список термінів селектора вузлів. Терміни обʼєднуються операцією OR.

    <a name="NodeSelectorTerm"></a>
    *Null або порожній термін селектора вузла не відповідає жодному об'єкту. Вимоги до них складаються за принципом AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm.*

    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: буде замінено під час злиття*

      Список вимог до селектора вузлів за мітками вузлів.

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: буде замінено під час злиття*

      Список вимог до селектора вузла за полями вузла.

## ResourceSliceList {#ResourceSliceList}

ResourceSliceList — колекція класів ResourceSlices.

---

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: ResourceSliceList

- **items** ([]<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>), обовʼязково

  Items is the list of resource ResourceSlices.

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку

## Операції {#Operations}

---

### `get` отримати вказаний ResourceSlice {#get-read-the-specified-resourceslice}

#### HTTP запит {#http-request}

GET /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceSlice

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourceSlice {#list-list-or-watch-objects-of-kind-resourceslice}

#### HTTP запит {#http-request-1}

GET /apis/resource.k8s.io/v1alpha3/resourceslices

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSliceList" >}}">ResourceSliceList</a>): OK

401: Unauthorized

### `create` створення ResourceSlice {#create-create-a-resourceslice}

#### HTTP запит {#http-request-2}

POST /apis/resource.k8s.io/v1alpha3/resourceslices

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ResourceSlice {#update-replace-the-specified-resourceslice}

#### HTTP запит {#http-request-3}

PUT /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceSlice

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ResourceSlice {#patch-partially-update-the-specified-resourceslice}

#### HTTP запит {#http-request-4}

PATCH /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceSlice

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized

### `delete` видалення ResourceSlice {#delete-delete-a-resourceslice}

#### HTTP запит {#http-request-5}

DELETE /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceSlice

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ResourceSlice {#deletecollection-delete-collection-of-resourceslice}

#### HTTP запит {#http-request-6}

DELETE /apis/resource.k8s.io/v1alpha3/resourceslices

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
