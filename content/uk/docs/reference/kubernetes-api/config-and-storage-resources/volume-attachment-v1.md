---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "VolumeAttachment"
content_type: "api_reference"
description: "VolumeAttachment фіксує намір приєднати або відʼєднати вказаний том до/від вказаного вузла."
title: "VolumeAttachment"
weight: 11
auto_generated: false
---

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## VolumeAttachment {#VolumeAttachment}

VolumeAttachment фіксує намір приєднати або відʼєднати вказаний том до/від вказаного вузла.

Обʼєкти VolumeAttachment не належать до просторів імен.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: VolumeAttachment

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachmentSpec" >}}">VolumeAttachmentSpec</a>), обовʼязково

  spec представляє специфікацію бажаної поведінки при приєднанні/відʼєднанні тому. Заповнюється системою Kubernetes.

- **status** (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachmentStatus" >}}">VolumeAttachmentStatus</a>)

  status представляє статус запиту VolumeAttachment. Заповнюється сутністю, що завершує операцію приєднання або відʼєднання, тобто external-attacher.

## VolumeAttachmentSpec {#VolumeAttachmentSpec}

VolumeAttachmentSpec — це специфікація запиту на приєднання тому.

---

- **attacher** (string), обовʼязково

  attacher вказує назву драйвера тому, який МАЄ обробити цей запит. Це назва, яку повертає GetPluginName().

- **nodeName** (string), обовʼязково

  nodeName представляє вузол, до якого повинен бути приєднаний том.

- **source** (VolumeAttachmentSource), обовʼязково

  source представляє том, який повинен бути приєднаний.

  <a name="VolumeAttachmentSource"></a>
  *VolumeAttachmentSource представляє том, який повинен бути приєднаний. Зараз лише PersistenVolumes можуть бути приєднані за допомогою зовнішнього attacherʼa, у майбутньому ми можемо дозволити також inline томи в Podʼах. Може бути встановлений лише один елемент.*

  - **source.inlineVolumeSpec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-v1#PersistentVolumeSpec" >}}">PersistentVolumeSpec</a>)

    inlineVolumeSpec містить всю необхідну інформацію для приєднання persistent volume, визначеного VolumeSource Podʼа. Це поле заповнюється лише для функції CSIMigration. Воно містить перетворені поля з VolumeSource Podʼа до PersistentVolumeSpec. Це поле є на рівні beta і враховується лише серверами, які включили функцію CSIMigration.

  - **source.persistentVolumeName** (string)

    persistentVolumeName представляє імʼя persistent volume для приєднання.

## VolumeAttachmentStatus {#VolumeAttachmentStatus}

VolumeAttachmentStatus — це статус запиту на приєднання тому.

---

- **attached** (boolean), обовʼязково

  attached вказує, що том успішно приєднаний. Це поле має бути встановлено лише сутністю, яка завершує операцію приєднання, тобто external-attacher.

- **attachError** (VolumeError)

  attachError представляє останню помилку, яка виникла під час операції приєднання, якщо така була. Це поле має бути встановлено лише сутністю, яка завершує операцію приєднання, тобто external-attacher.

  <a name="VolumeError"></a>
  *VolumeError фіксує помилку, яка виникла під час операції з томом.*

  - **attachError.errorCode** (int32)

    errorCode є числовим кодом gRPC, що представляє помилку, що виникаж під час операцій Attach або Detach.

    Це опціональне бета-поле, яке потребує увімкнення функціональної можливості MutableCSINodeAllocatableCount.

  - **attachError.message** (string)

    message представляє помилку, яка виникла під час операції приєднання або відʼєднання. Цей рядок може бути доданий в лог, тож він не повинен містити конфіденційної інформації.

  - **attachError.time** (Time)

    time представляє час, коли сталася помилка.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **attachmentMetadata** (map[string]string)

  attachmentMetadata заповнюється будь-якою інформацією, яка повертається під час успішної операції приєднання і яка повинна бути передана в наступні виклики WaitForAttach або Mount. Це поле має бути встановлено лише сутністю, яка завершує операцію приєднання, тобто external-attacher.

- **detachError** (VolumeError)

  detachError представляє останню помилку, яка виникла під час операції відʼєднання, якщо така була. Це поле має бути встановлено лише сутністю, яка завершує операцію відʼєднання, тобто external-attacher.

  <a name="VolumeError"></a>
  *VolumeError фіксує помилку, яка виникла під час операції з томом.*

  - **detachError.errorCode** (int32)

    errorCode є числовим кодом gRPC, що представляє помилку, що виникаж під час операцій Attach або Detach.

    Це опціональне бета-поле, яке потребує увімкнення функціональної можливості MutableCSINodeAllocatableCount.

  - **detachError.message** (string)

    message представляє помилку, яка виникла під час операції приєднання або відʼєднання. Цей рядок може бути доданий в лог, тож він не повинен містити конфіденційної інформації.

  - **detachError.time** (Time)

    time представляє час, коли сталася помилка.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

## VolumeAttachmentList {#VolumeAttachmentList}

VolumeAttachmentList — це колекція обʼєктів VolumeAttachment.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: VolumeAttachmentList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>), обовʼязково

  items — це список VolumeAttachments.

## Операції {#operations}

---

### `get` отримати вказаний VolumeAttachment {#get-read-the-specified-volumeattachment}

#### HTTP запит {#http-request}

GET /apis/storage.k8s.io/v1/volumeattachments/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttachment

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

401: Unauthorized

### `get` отримати статус вказаного VolumeAttachment {#get-read-status-of-the-specified-volumeattachment}

#### HTTP запит {#http-request-1}

GET /apis/storage.k8s.io/v1/volumeattachments/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttachment

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

401: Unauthorized

### `list` перелік абоперегляд обʼєктів типу VolumeAttachment {#list-list-or-watch-objects-of-kind-volumeattachment}

#### HTTP запит {#http-request-2}

GET /apis/storage.k8s.io/v1/volumeattachments

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachmentList" >}}">VolumeAttachmentList</a>): OK

401: Unauthorized

### `create` створення VolumeAttachment {#create-create-a-volumeattachment}

#### HTTP запит {#http-request-3}

POST /apis/storage.k8s.io/v1/volumeattachments

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Accepted

401: Unauthorized

### `update` заміна вказаного VolumeAttachment {#update-replace-the-specified-volumeattachment}

#### HTTP запит {#http-request-4}

PUT /apis/storage.k8s.io/v1/volumeattachments/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttachment

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

401: Unauthorized

### `update` заміна вказаного VolumeAttachment {#update-replace-status-of-the-specified-volumeattachment}

#### HTTP запит {#http-request-5}

PUT /apis/storage.k8s.io/v1/volumeattachments/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttachment

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного VolumeAttachment {#patch-partially-update-the-specified-volumeattachment}

#### HTTP запит {#http-request-6}

PATCH /apis/storage.k8s.io/v1/volumeattachments/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttachment

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного VolumeAttachment {#patch-partially-update-status-of-the-specified-volumeattachment}

#### HTTP запит {#http-request-7}

PATCH /apis/storage.k8s.io/v1/volumeattachments/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttachment

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Created

401: Unauthorized

### `delete` видалення VolumeAttachment {#delete-delete-a-volumeattachment}

#### HTTP запит {#http-request-8}

DELETE /apis/storage.k8s.io/v1/volumeattachments/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttachment

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/volume-attachment-v1#VolumeAttachment" >}}">VolumeAttachment</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції VolumeAttachment {#deletecollection-delete-collection-of-volumeattachment}

#### HTTP запит {#http-request-9}

DELETE /apis/storage.k8s.io/v1/volumeattachments

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
