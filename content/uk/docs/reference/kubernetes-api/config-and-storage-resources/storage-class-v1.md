---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "StorageClass"
content_type: "api_reference"
description: "StorageClass описує параметри класу сховища, для якого PersistentVolumes можна динамічно виділяти."
title: "StorageClass"
weight: 8
auto_generated: false
---

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## StorageClass {#StorageClass}

`StorageClass` описує параметри класу сховища, для якого `PersistentVolumes` можна динамічно виділяти.

Класи сховищ не мають простору імен; імʼя класу сховища згідно з etcd знаходиться в ObjectMeta.Name.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: StorageClass

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **provisioner** (string), обовʼязково

  provisioner вказує на тип провізора.

- **allowVolumeExpansion** (boolean)

  allowVolumeExpansion показує, чи дозволяє клас зберігання розширення тому.

- **allowedTopologies** ([]TopologySelectorTerm)

  *Atomic: буде замінено під час обʼєднання*

  allowedTopologies обмежує топологію вузлів, де томи можуть динамічно виділятися. Кожен втулок тому визначає свої власні специфікації топології. Порожній список TopologySelectorTerm означає, що обмежень по топології немає. Це поле враховується лише серверами, які включають функцію VolumeScheduling.

  <a name="TopologySelectorTerm"></a>
  *Термін селектора топології представляє результат запитів до міток. Нульовий або порожній термін селектора топології не відповідає жодному обʼєкту. Вимоги до них обʼєднуються за принципом AND. Він надає підмножину функціональності як NodeSelectorTerm. Це альфа-версія функції та в майбутньому вона може змінитися.*

  - **allowedTopologies.matchLabelExpressions** ([]TopologySelectorLabelRequirement)

    *Atomic: буде замінено під час злиття*

    Список вимог до вибору топології за мітками.

    <a name="TopologySelectorLabelRequirement"></a>
    *Вимога вибору топології — це селектор, що відповідає заданій мітці. Це альфа-функція і може змінитися в майбутньому.*

    - **allowedTopologies.matchLabelExpressions.key** (string), обовʼязково

      Ключ мітки, до якого застосовується селектор.

    - **allowedTopologies.matchLabelExpressions.values** ([]string), обовʼязково

      *Atomic: буде замінено під час злиття*

      Масив рядкових значень. Одне значення повинно відповідати мітці для вибору. Кожен запис у Values поєднується оператором OR.

- **mountOptions** ([]string)

  *Atomic: буде замінено під час злиття*

  mountOptions контролює параметри монтування для динамічно виділених PersistentVolumes цього класу зберігання. Наприклад, ["ro", "soft"]. Не перевіряється — монтування PVs просто не вдасться, якщо один з них недійсний.

- **parameters** (map[string]string)

  parameters містить параметри для провайдера, який повинен створити томи цього класу зберігання.

- **reclaimPolicy** (string)

  reclaimPolicy контролює політику відновлення для динамічно виділених PersistentVolumes цього класу зберігання. Стандартне значення — Delete.

  Можливі значення переліку (enum):
  - `"Delete"` означає, що том буде видалено з Kubernetes після звільнення його заявки. Втулок тому повинен підтримувати видалення.
  - `"Recycle"` означає, що том буде повернений до пулу незвʼязаних постійних томів після звільнення від його вимоги. Втулок тому повинен підтримувати Recycling.
  - `"Retain"` означає, що том залишиться в поточній фазі (Released) для ручного відновлення адміністратором. Стандартна політика — Retain.

- **volumeBindingMode** (string)

  volumeBindingMode вказує, як PersistentVolumeClaims повинні виділятися та звʼязуватися. Якщо не встановлено, використовується VolumeBindingImmediate. Це поле враховується лише серверами, які включають функцію VolumeScheduling.

  Можливі значення переліку (enum):
  - `"Immediate"` вказує, що PersistentVolumeClaims повинні бути негайно надані та привʼязані. Це стандартний режим.
  - `"WaitForFirstConsumer"` вказує, що PersistentVolumeClaims не повинні бути надані та привʼязані до створення першого Pod, який посилається на PeristentVolumeClaim. Надання та привʼязка тома відбуватимуться під час планування Pod.

## StorageClassList {#StorageClassList}

StorageClassList — це колекція класів зберігання.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: StorageClassList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>), обовʼязкове

  items — це список StorageClasses.

## Операції {#operations}

---

### `get` отримати вказаний StorageClass {#get-read-the-specified-storageclass}

#### HTTP запит {#http-request}

GET /apis/storage.k8s.io/v1/storageclasses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageClass

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу StorageClass {#list-list-or-watch-objects-of-kind-storageclass}

#### HTTP запит {#http-request-1}

GET /apis/storage.k8s.io/v1/storageclasses

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClassList" >}}">StorageClassList</a>): OK

401: Unauthorized

### `create` створення StorageClass {#create-create-a-storageclass}

#### HTTP запит {#http-request-2}

POST /apis/storage.k8s.io/v1/storageclasses

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Accepted

401: Unauthorized

### `update` заміна вказаного StorageClass {#update-replace-the-specified-storageclass}

#### HTTP запит {#http-request-3}

PUT /apis/storage.k8s.io/v1/storageclasses/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageClass

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного StorageClass {#patch-partially-update-the-specified-storageclass}

#### HTTP запит {#http-request-4}

PATCH /apis/storage.k8s.io/v1/storageclasses/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageClass

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

401: Unauthorized

### `delete` видалення StorageClass {#delete-delete-a-storageclass}

#### HTTP запит {#http-request-5}

DELETE /apis/storage.k8s.io/v1/storageclasses/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageClass

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції StorageClass {#deletecollection-delete-collection-of-storageclass}

#### HTTP запит {#http-request-6}

DELETE /apis/storage.k8s.io/v1/storageclasses

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
