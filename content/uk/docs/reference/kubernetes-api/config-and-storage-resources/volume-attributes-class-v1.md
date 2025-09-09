---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "VolumeAttributesClass"
content_type: "api_reference"
description: "VolumeAttributesClass представляє специфікацію змінних атрибутів тома, визначених драйвером CSI."
title: "VolumeAttributesClass v1"
weight: 12
auto_generated: false
---


`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## VolumeAttributesClass {#VolumeAttributesClass}

VolumeAttributesClass представляє специфікацію змінних атрибутів тома, визначених драйвером CSI. Клас можна вказати під час динамічного резервування PersistentVolumeClaims і змінити у специфікації PersistentVolumeClaim після резервування.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: VolumeAttributesClass

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **driverName** (string), обовʼязково

  Імʼя драйвера CSI Це поле є незмінним.

## VolumeAttributesClassList {#VolumeAttributesClassList}

VolumeAttributesClassList — це колекція обʼєктів VolumeAttributesClass.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: VolumeAttributesClassList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>), обовʼязково

  items — це список обʼєктів VolumeAttributesClass.

## Операції {#operations}

---

### `get` отримати вказаний VolumeAttributesClass {#get-read-the-specified-volumeattributesalass}

#### HTTP запит {#http-request}

GET /apis/storage.k8s.io/v1/volumeattributesclasses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttributesClass

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу VolumeAttributesClass {#list-or-watch-objects-of-kind-volumeattributesalass}

#### HTTP запит {#http-request-1}

GET /apis/storage.k8s.io/v1/volumeattributesclasses

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClassList" >}}">VolumeAttributesClassList</a>): OK

401: Unauthorized

### `create` створення VolumeAttributesClass {#create-a-new-volumeattributesalass}

#### HTTP запит {#http-request-2}

POST /apis/storage.k8s.io/v1/volumeattributesclasses

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Accepted

401: Unauthorized

### `update` заміна вказаного VolumeAttributesClass {#update-replace-the-specified-volumeattributesalass}

#### HTTP запит {#http-request-3}

PUT /apis/storage.k8s.io/v1/volumeattributesclasses/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttributesClass

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного VolumeAttributesClass {#patch-partially-update-the-specified-volumeattributesalass}

#### HTTP запит {#http-request-4}

PATCH /apis/storage.k8s.io/v1/volumeattributesclasses/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttributesClass

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

401: Unauthorized

### `delete` видалення VolumeAttributesClass {#delete-delete-a-volumeattributesalass}

#### HTTP запит {#http-request-5}

DELETE /apis/storage.k8s.io/v1/volumeattributesclasses/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя VolumeAttributesClass

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Accepted

401: Unauthorized


### `deletecollection` видалення колекції VolumeAttributesClass {#deletecollection-delete-collection-of-volumeattributesalass}

#### HTTP запит {#http-request-6}

DELETE /apis/storage.k8s.io/v1/volumeattributesclasses

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
