---
api_metadata:
  apiVersion: "storagemigration.k8s.io/v1alpha1"
  import: "k8s.io/api/storagemigration/v1alpha1"
  kind: "StorageVersionMigration"
content_type: "api_reference"
description: "StorageVersionMigration представляє міграцію збережених даних до останньої версії сховища."
title: "StorageVersionMigration v1alpha1"
weight: 9
auto_generated: false
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: storagemigration.k8s.io/v1alpha1`

`import "k8s.io/api/storagemigration/v1alpha1"`

## StorageVersionMigration {#StorageVersionMigration}

StorageVersionMigration представляє міграцію збережених даних до останньої версії сховища.

---

- **apiVersion**: storagemigration.k8s.io/v1alpha1

- **kind**: StorageVersionMigration

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationSpec" >}}">StorageVersionMigrationSpec</a>)

  Специфікація міграції.

- **status** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationStatus" >}}">StorageVersionMigrationStatus</a>)

  Статус міграції.

## StorageVersionMigrationSpec {#StorageVersionMigrationSpec}

Специфіка міграції версії сховища.

---

- **continueToken** (string)

  Токен, який використовується в опціях списку, щоб отримати наступну порцію обʼєктів для міграції. Коли .status.conditions вказує на те, що міграція виконується, користувачі можуть використовувати цей токен, щоб перевірити хід міграції.

- **resource** (GroupVersionResource), обовʼязково

  Ресурс, який мігрує. Мігратор надсилає запити до точки доступу, що обслуговує ресурс. Незмінний.

  <a name="GroupVersionResource"></a>
  *Імена групи, версії та ресурсу.*

  - **resource.group** (string)

    Імʼя групи.

  - **resource.resource** (string)

    Імʼя ресурсу.

  - **resource.version** (string)

    Імʼя версії.

## StorageVersionMigrationStatus {#StorageVersionMigrationStatus}

Статус міграції версії сховища.

---

- **conditions** ([]MigrationCondition)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Останні доступні спостереження за поточним станом міграції.

  <a name="MigrationCondition"></a>
  *Описує стан міграції на певний момент.*

  - **conditions.status** (string), обовʼязково

    Статус стану, одни з: True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану.

  - **conditions.lastUpdateTime** (Time)

    Час, коли булі остання зміна стану.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    message містить зрозуміле для людини повідомлення з деталями про стан зміни.

  - **conditions.reason** (string)

    reason умови останньої зміни.

- **resourceVersion** (string)

  ResourceVersion для порівняння з кешем GC для виконання міграції. Це поточна версія ресурсу для даної групи, версії та ресурсу, коли kube-controller-manager вперше спостерігає цей ресурс StorageVersionMigration.

## StorageVersionMigrationList {#StorageVersionMigrationList}

StorageVersionMigrationList — колекція міграцій версій сховища.

---

- **apiVersion**: storagemigration.k8s.io/v1alpha1

- **kind**: StorageVersionMigrationList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартний перелік метаданих. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>), обовʼязково

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Items — список міграцій StorageVersionMigration

## Операції {#Operations}

---

### `get` отримати вказаний StorageVersionMigration {#get-read-the-specified-storageversionmigration}

#### HTTP запит {#http-request}

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized

### `get` отримати статус вказаного StorageVersionMigration {#get-read-status-of-the-specified-storageversionmigration}

#### HTTP запит {#http-request-1}

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу StorageVersionMigration {#list-list-or-watch-objects-of-kind-storageversionmigration}

#### HTTP запит {#http-request-2}

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationList" >}}">StorageVersionMigrationList</a>): OK

401: Unauthorized

### `create` створення StorageVersionMigration {#create-create-a-storageversionmigration}

#### HTTP запит {#http-request-3}

POST /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Accepted

401: Unauthorized

### `update` заміна вказаного StorageVersionMigration {#update-replace-the-specified-storageversionmigration}

#### HTTP запит {#http-request-4}

PUT /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного StorageVersionMigration {#update-replace-status-of-the-specified-storageversionmigration}

#### HTTP запит {#http-request-5}

PUT /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного StorageVersionMigration {#patch-partially-update-the-specified-storageversionmigration}

#### HTTP запит {#http-request-6}

PATCH /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

### `patch` частковеоновлення статусу вказаного StorageVersionMigration {#patch-partially-update-status-of-the-specified-storageversionmigration}

#### HTTP запит {#http-request-7}

PATCH /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

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

200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized

### `delete` видалення StorageVersionMigration {#delete-delete-a-storageversionmigration}

#### HTTP запит {#http-request-8}

DELETE /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя StorageVersionMigration

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

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

DELETE /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

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
