---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourcePoolStatusRequest"
content_type: "api_reference"
description: "ResourcePoolStatusRequest запускає одноразовий розрахунок стану пулу ресурсів на основі наданих фільтрів."
title: "ResourcePoolStatusRequest v1alpha3"
weight: 10
auto_generated: false
---

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`


## ResourcePoolStatusRequest {#ResourcePoolStatusRequest}

ResourcePoolStatusRequest запускає одноразовий розрахунок стану пулу ресурсів на основі наданих фільтрів. Після встановлення стану запит вважається завершеним і не буде повторно оброблятися. Користувачі повинні видаляти та створювати запити заново, щоб отримати оновлену інформацію.

---

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: ResourcePoolStatusRequest

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>), обовʼязково

  Стандартні метадані обʼєкта

- **spec** (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequestSpec" >}}">ResourcePoolStatusRequestSpec</a>), обовʼязково

  Spec визначає фільтри для включення пулів у стан. Spec є незмінним після створення.

- **status** (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequestStatus" >}}">ResourcePoolStatusRequestStatus</a>)

  Status заповнюється контролером з розрахованим станом пулу. Коли status не є nil, запит вважається завершеним, і весь обʼєкт стає незмінним.

## ResourcePoolStatusRequestSpec {#ResourcePoolStatusRequestSpec}

ResourcePoolStatusRequestSpec визначає фільтри для запиту стану пулу.

---

- **driver** (string), обовʼязково

  Driver визначає імʼя драйвера DRA для фільтрації пулів. Включатимуться лише пули з ResourceSlices з цим драйвером. Має бути піддоменом DNS (наприклад, "gpu.example.com").

- **limit** (int32)

  Limit необовʼязково вказує максимальну кількість пулів для повернення у стані. Якщо більше пулів відповідають критеріям фільтрації, відповідь буде скорочена (тобто len(status.pools) \< status.poolCount).

  Стандартні значення: 100 Мінімум: 1 Максимум: 1000

- **poolName** (string)

  PoolName необовʼязково фільтрує за конкретним імʼям пулу. Якщо не вказано, включаються всі пули з зазначеного драйвера. Коли вказано, імʼя повинно бути непустим дійсним імʼям пулу ресурсів (піддомени DNS, розділені "/").


## ResourcePoolStatusRequestStatus {#ResourcePoolStatusRequestStatus}

ResourcePoolStatusRequestStatus містить розраховану інформацію про стан пулу.

---

- **poolCount** (int32), обовʼязково

  PoolCount є загальною кількістю пулів, які відповідають критеріям фільтрації, незалежно від усічення. Це допомагає користувачам зрозуміти, скільки пулів існує, навіть коли відповідь усічена. Значення 0 означає, що жоден пул не відповідав критеріям фільтрації.

- **conditions** ([]Condition)

  *Patch strategy: злиття за ключем `type`*

  *Map: унікальні значення за ключем type будуть збережені під час злиття*

  Conditions надають інформацію про стан запиту. Стан з type=Complete або type=Failed завжди буде встановлений, коли статус заповнений.

  Відомі типи станів:

  - "Complete": True, коли запит був успішно оброблений
  - "Failed": True, коли запит не вдалося обробити

  <a name="Condition"></a>
  *Condition містить деталі щодо одного аспекту поточного стану цього API ресурсу.*

  - **conditions.lastTransitionTime** (Time), обовʼязково

    lastTransitionTime є останнім часом, коли стан перейшов з одного стану в інший. Це має бути тоді, коли змінився основний стан. Якщо це невідомо, тоді можна використовувати час, коли змінилося поле API.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string), обовʼязково

    message є зрозумілим для людини повідомленням, що вказує деталі щодо переходу. Це може бути порожній рядок.

  - **conditions.reason** (string), обовʼязково

    reason містить програмний ідентифікатор, що вказує причину останнього переходу стану. Виробники конкретних типів станів можуть визначати очікувані значення та значення для цього поля, а також чи вважаються ці значення гарантованим API. Значення повинно бути рядком у CamelCase. Це поле не може бути порожнім.

  - **conditions.status** (string), обовʼязково

    status — статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    type — тип стану у CamelCase або у foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якого було встановлено стан. Наприклад, якщо .metadata.generation наразі 12, але .status.conditions[x].observedGeneration 9, стан застарів щодо поточного стану екземпляра.

- **pools** ([]PoolStatus)

  *Atomic: буде замінено під час злиття*

  Pools cмістить перші `spec.limit` відповідні пули, відсортовані за драйвером, а потім за назвою пулу. Якщо `len(pools) \< poolCount`, список був усічений. Коли опущено, жоден пул не відповідав фільтрам запиту.

  <a name="PoolStatus"></a>
  *PoolStatus містить інформацію про стан одного пулу ресурсів.*

  - **pools.driver** (string), обовʼязково

    Driver — драйвер DRA для цього пулу. Має бути піддоменом DNS (наприклад, "gpu.example.com").

  - **pools.generation** (int64), обовʼязково

    Generation — покоління пулу, спостережуване серед усіх ResourceSlices у цьому пулі. Повідомляється лише останнє покоління. Під час розгортання покоління, якщо не всі слайси останнього покоління були опубліковані, пул включається з validationError, а поля кількості пристроїв не встановлюються.

  - **pools.poolName** (string), обовʼязково

    PoolName — назва пулу. Має бути дійсною назвою пулу ресурсів (піддомени DNS, розділені "/").

  - **pools.allocatedDevices** (int32)

    AllocatedDevices — кількість пристроїв, які наразі виділені для заявок. Значення 0 означає, що жоден пристрій не виділено. Може бути не встановлено, коли встановлено validationError.

  - **pools.availableDevices** (int32)

    AvailableDevices — кількість пристроїв, доступних для виділення. Це дорівнює TotalDevices - AllocatedDevices - UnavailableDevices. Значення 0 означає, що наразі жоден пристрій не доступний. Може бути не встановлено, коли встановлено validationError.

  - **pools.nodeName** (string)

    NodeName — вузол, з яким повʼязаний цей пул. Якщо опущено, пул не повʼязаний з конкретним вузлом. Має бути дійсним піддоменом DNS (RFC1123).

  - **pools.resourceSliceCount** (int32)

    ResourceSliceCount — кількість ResourceSlices, які складають цей пул. Може бути не встановлено, коли встановлено validationError.

  - **pools.totalDevices** (int32)

    TotalDevices — загальна кількість пристроїв у пулі по всіх слайсах. Значення 0 означає, що пул не має пристроїв. Може бути не встановлено, коли встановлено validationError.

  - **pools.unavailableDevices** (int32)

    UnavailableDevices — кількість пристроїв, які недоступні через taints або інші умови, але не виділені. Значення 0 означає, що всі невиділені пристрої доступні. Може бути не встановлено, коли встановлено validationError.

  - **pools.validationError** (string)

    ValidationError — встановлюється, коли дані пулу не можуть бути повністю перевірені (наприклад, неповне публікування слайсу). Коли встановлено, поля кількості пристроїв та ResourceSliceCount можуть бути не встановлені.

## ResourcePoolStatusRequestList {#ResourcePoolStatusRequestList}

ResourcePoolStatusRequestList є колекцією ResourcePoolStatusRequests.

---

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: ResourcePoolStatusRequestList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку

- **items** ([]<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>), обовʼязково

  Items є списком ResourcePoolStatusRequests.

## Операції {#Operations}

---

### `get` отримати вказаний ResourcePoolStatusRequest {#get-read-the-specified-resourcepoolstatusrequest}

#### HTTP запит {#http-request}

GET /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя ResourcePoolStatusRequest

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

401: Unauthorized

### `get` отримати статус вказаного ResourcePoolStatusRequest {#get-read-status-of-the-specified-resourcepoolstatusrequest}

#### HTTP запит {#http-request-1}

GET /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя ResourcePoolStatusRequest

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourcePoolStatusRequest {#list-list-or-watch-objects-of-kind-resourcepoolstatusrequest}

#### HTTP запит {#http-request-2}

GET /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests

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

- **shardSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequestList" >}}">ResourcePoolStatusRequestList</a>): OK

401: Unauthorized

### `create` створення ResourcePoolStatusRequest {#create-create-a-resourcepoolstatusrequest}

#### HTTP запит {#http-request-3}

POST /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

202 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Accepted

401: Unauthorized

### `update` заміна зазначеного ResourcePoolStatusRequest {#update-replace-the-specified-resourcepoolstatusrequest}

#### HTTP запит {#http-request-4}

PUT /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя ResourcePoolStatusRequest


- **body**: <a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}


200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

401: Unauthorized

### `update` заміна статусу зазначеного ResourcePoolStatusRequest {#update-replace-status-of-the-specified-resourcepoolstatusrequest}

#### HTTP запит {#http-request-5}

PUT /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя ResourcePoolStatusRequest

- **body**: <a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

401: Unauthorized

### `patch` часткове оновлення зазначеного ResourcePoolStatusRequest {#patch-partially-update-the-specified-resourcepoolstatusrequest}

#### HTTP запит {#http-request-6}

PATCH /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя ResourcePoolStatusRequest

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

200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

401: Unauthorized


### `patch` часткове оновлення статусу зазначеного ResourcePoolStatusRequest {#patch-partially-update-status-of-the-specified-resourcepoolstatusrequest}

#### HTTP запит {#http-request-7}

PATCH /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя ResourcePoolStatusRequest

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

200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

201 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Created

401: Unauthorized

### `delete` видалити ResourcePoolStatusRequest {#delete-delete-a-resourcepoolstatusrequest}

#### HTTP запит {#http-request-8}

DELETE /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя ResourcePoolStatusRequest

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

200 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): OK

202 (<a href="{{< ref "../cluster-resources/resource-pool-status-request-v1alpha3#ResourcePoolStatusRequest" >}}">ResourcePoolStatusRequest</a>): Accepted

401: Unauthorized

### `deletecollection` видалити колекцію ResourcePoolStatusRequest {#deletecollection-delete-collection-of-resourcepoolstatusrequest}

#### HTTP запит {#http-request-9}

DELETE /apis/resource.k8s.io/v1alpha3/resourcepoolstatusrequests

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

- **shardSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
