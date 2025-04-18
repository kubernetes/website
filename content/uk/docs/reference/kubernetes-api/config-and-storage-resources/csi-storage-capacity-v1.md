---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIStorageCapacity"
content_type: "api_reference"
description: "CSIStorageCapacity зберігає результат одного виклику CSI GetCapacity."
title: "CSIStorageCapacity"
weight: 5
auto_generated: false
---

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSIStorageCapacity {#CSIStorageCapacity}

CSIStorageCapacity зберігає результат одного виклику CSI GetCapacity. Для заданого StorageClass це описує доступну місткість у певному сегменті топології. Це можна використовувати під час розгляду місця для створення нових PersistentVolumes.

Наприклад, це може виражати такі речі:

- StorageClass "standard" має "1234 GiB" доступних у "topology.kubernetes.io/zone=us-east1"
- StorageClass "localssd" має "10 GiB" доступних у "kubernetes.io/hostname=knode-abc123"

Наступні три випадки означають, що місткість недоступна для певної комбінації:

- не існує обʼєкта з відповідною топологією та імʼям класу зберігання
- такий обʼєкт існує, але місткість не задана
- такий обʼєкт існує, але місткість дорівнює нулю

Виробник цих обʼєктів може вирішити, який підхід є більш відповідним.

Вони споживаються планувальником kube-scheduler, коли драйвер CSI вибирає планування з урахуванням місткості за допомогою CSIDriverSpec.StorageCapacity. Планувальник порівнює MaximumVolumeSize із запитаним розміром очікуваних томів, щоб відфільтрувати невідповідні вузли. Якщо MaximumVolumeSize не задано, він повертається до порівняння з менш точною Capacity. Якщо і це не задано, планувальник припускає, що місткість недостатня, і пробує інший вузол.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIStorageCapacity

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Імʼя не має особливого значення. Воно повинно бути піддоменом DNS (допускаються точки, 253 символи). Щоб уникнути конфліктів з іншими драйверами CSI у кластері, рекомендується використовувати csisc-\<uuid>, згенероване імʼя або імʼя у зворотному порядку домену, яке закінчується унікальним імʼям драйвера CSI.

  Обʼєкти знаходяться в межах простору імен.

  Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **storageClassName** (string), обовʼязково

  storageClassName представляє імʼя StorageClass, до якого відноситься звітна місткість. Воно повинно відповідати тим самим вимогам, що й імʼя обʼєкта StorageClass (не порожнє, піддомен DNS). Якщо цей обʼєкт більше не існує, обʼєкт CSIStorageCapacity застарів і повинен бути видалений його творцем. Це поле незмінне.

- **capacity** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity — це значення, яке повідомляє драйвер CSI у своєму GetCapacityResponse для GetCapacityRequest з топологією і параметрами, що відповідають попереднім полям.

  Семантика наразі (CSI spec 1.2) визначена як: доступна місткість у байтах сховища, яка може бути використана для створення томів. Якщо не задано, ця інформація наразі недоступна.

- **maximumVolumeSize** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  maximumVolumeSize — це значення, яке повідомляє драйвер CSI у своєму GetCapacityResponse для GetCapacityRequest з топологією і параметрами, що відповідають попереднім полям.

  Це визначено починаючи з CSI spec 1.4.0 як найбільший розмір, який може бути використаний у полі CreateVolumeRequest.capacity_range.required_bytes для створення тому з тими самими параметрами, що й у GetCapacityRequest. Відповідне значення в API Kubernetes — це ResourceRequirements.Requests у запиті на том.

- **nodeTopology** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  nodeTopology визначає, які вузли мають доступ до сховища, для якого була надана місткість. Якщо не задано, сховище недоступне з жодного вузла у кластері. Якщо порожнє, сховище доступне з усіх вузлів. Це поле незмінне.

## CSIStorageCapacityList {#CSIStorageCapacityList}

CSIStorageCapacityList — це колекція обʼєктів CSIStorageCapacity.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIStorageCapacityList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>), обовʼязково

  items — це список обʼєктів CSIStorageCapacity.

## Операції {#operations}

---

### `get` отримати вказаний CSIStorageCapacity {#get-read-the-specified-csistoragecapacity}

#### HTTP запит {#http-request}

GET /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя CSIStorageCapacity

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу CSIStorageCapacity {#list-list-or-watch-objects-of-kind-csistoragecapacity}

#### HTTP запит {#http-request-1}

GET /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacityList" >}}">CSIStorageCapacityList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів CSIStorageCapacity {#list-list-or-watch-objects-of-kind-csistoragecapacity-1}

#### HTTP запит {#http-request-2}

GET /apis/storage.k8s.io/v1/csistoragecapacities

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacityList" >}}">CSIStorageCapacityList</a>): OK

401: Unauthorized

### `create` створення CSIStorageCapacity {#create-create-a-csistoragecapacity}

#### HTTP запит {#http-request-3}

POST /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Accepted

401: Unauthorized

### `update` заміна вказаного CSIStorageCapacity {#update-replace-the-specified-csistoragecapacity}

#### HTTP запит {#http-request-4}

PUT /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя CSIStorageCapacity

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного CSIStorageCapacity {#patch-partially-update-the-specified-csistoragecapacity}

#### HTTP запит {#http-request-5}

PATCH /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя CSIStorageCapacity

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

401: Unauthorized

### `delete` видалення CSIStorageCapacity {#delete-delete-a-csistoragecapacity}

#### HTTP запит {#http-request-6}

DELETE /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя CSIStorageCapacity

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

### `deletecollection` видалення колекції CSIStorageCapacity {#deletecollection-delete-collection-of-csistoragecapacity}

#### HTTP запит {#http-request-7}

DELETE /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

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
