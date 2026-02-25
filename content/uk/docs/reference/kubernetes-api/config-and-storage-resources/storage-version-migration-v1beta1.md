---
api_metadata:
  apiVersion: "storagemigration.k8s.io/v1beta1"
  import: "k8s.io/api/storagemigration/v1beta1"
  kind: "StorageVersionMigration"
content_type: "api_reference"
description: "StorageVersionMigration представляє міграцію збережених даних до останньої версії сховища."
title: "StorageVersionMigration v1beta1"
weight: 9
auto_generated: false
---

`apiVersion: storagemigration.k8s.io/v1beta1`

`import "k8s.io/api/storagemigration/v1beta1"`

## StorageVersionMigration {#StorageVersionMigration}

StorageVersionMigration представляє міграцію збережених даних до останньої версії сховища.

---

- **apiVersion**: storagemigration.k8s.io/v1beta1

- **kind**: StorageVersionMigration

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigrationSpec" >}}">StorageVersionMigrationSpec</a>)

  Специфікація міграції.

- **status** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigrationStatus" >}}">StorageVersionMigrationStatus</a>)

  Статус міграції.

## StorageVersionMigrationSpec {#StorageVersionMigrationSpec}

Специфіка міграції версії сховища.

---

- **resource** (GroupResource), обовʼязково

  Ресурс, який мігрує. Мігратор надсилає запити до точки доступу, що обслуговує ресурс. Незмінний.

  <a name="GroupResource"></a>
  *GroupResource визначає групу та ресурс, але не вимагає версії.  Це корисно для ідентифікації понять на етапах пошуку без використання частково дійсних типів.*

  - **resource.group** (string), обовʼязково

  - **resource.resource** (string), обовʼязково

## StorageVersionMigrationStatus {#StorageVersionMigrationStatus}

Статус міграції версії сховища.

---

- **conditions** ([]Condition)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Останні доступні спостереження за поточним станом міграції.

  <a name="Condition"></a>
  *Condition містить детальну інформацію про один аспект поточного стану цього ресурсу API.*

  - **conditions.lastTransitionTime** (Time), обовʼязково

    lastTransitionTime — це останній час, коли стан змінився з одного на інший. Це має бути момент, коли змінився базовий стан.  Якщо це невідомо, то можна використовувати час, коли змінилося поле API.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)? обовʼязково

    message містить зрозуміле для людини повідомлення з деталями про стан зміни. Може бути порожнім рядком.

  - **conditions.reason** (string),обовʼязково

    reason містить програмний ідентифікатор, що вказує причину останнього переходу стану. Постачальники конкретних типів станів можуть визначати очікувані значення та значення для цього поля, а також те, чи вважаються ці значення гарантованим API. Значення повинно бути рядком CamelCase. Це поле не може бути порожнім.

  - **conditions.status** (string), бовʼязково

    status стану, одне з True, False, Unknown.

  - **conditions.type** (string), бовʼязково

    type стану в CamelCase або в foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якого було встановлено стан. Наприклад, якщо .metadata.generation наразі дорівнює 12, але .status.conditions[x].observedGeneration дорівнює 9, стан є застарілим стосовно поточного стану екземпляра.

- **resourceVersion** (string)

  ResourceVersion для порівняння з кешем GC для виконання міграції. Це поточна версія ресурсу для даної групи, версії та ресурсу, коли kube-controller-manager вперше спостерігає цей ресурс StorageVersionMigration.

## StorageVersionMigrationList {#StorageVersionMigrationList}

StorageVersionMigrationList — колекція міграцій версій сховища.

---

- **apiVersion**: storagemigration.k8s.io/v1beta1

- **kind**: StorageVersionMigrationList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартний перелік метаданих. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>), обовʼязково

  Items — список міграцій StorageVersionMigration

## Операції {#Operations}

---

### `get` отримати вказаний StorageVersionMigration {#get-read-the-specified-storageversionmigration}

#### HTTP запит {#http-request}

GET /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized

### `get` отримати статус вказаного StorageVersionMigration {#get-read-status-of-the-specified-storageversionmigration}

#### HTTP запит {#http-request-1}

GET /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу StorageVersionMigration {#list-list-or-watch-objects-of-kind-storageversionmigration}

#### HTTP запит {#http-request-2}

GET /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigrationList" >}}">StorageVersionMigrationList</a>): OK

401: Unauthorized

### `create` створення StorageVersionMigration {#create-create-a-storageversionmigration}

#### HTTP запит {#http-request-3}

POST /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Accepted

401: Unauthorized

### `update` заміна вказаного StorageVersionMigration {#update-replace-the-specified-storageversionmigration}

#### HTTP запит {#http-request-4}

PUT /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного StorageVersionMigration {#update-replace-status-of-the-specified-storageversionmigration}

#### HTTP запит {#http-request-5}

PUT /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного StorageVersionMigration {#patch-partially-update-the-specified-storageversionmigration}

#### HTTP запит {#http-request-6}

PATCH /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

### `patch` частковеоновлення статусу вказаного StorageVersionMigration {#patch-partially-update-status-of-the-specified-storageversionmigration}

#### HTTP запит {#http-request-7}

PATCH /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1beta1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

### `delete` видалення StorageVersionMigration {#delete-delete-a-storageversionmigration}

#### HTTP запит {#http-request-8}

DELETE /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

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

### `deletecollection` видалення колекції StorageVersionMigration {#deletecollection-delete-collection-of-storageversionmigration}

#### HTTP запит {#http-request-9}

DELETE /apis/storagemigration.k8s.io/v1beta1/storageversionmigrations

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
