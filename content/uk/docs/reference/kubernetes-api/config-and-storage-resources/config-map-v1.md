---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ConfigMap"
content_type: "api_reference"
description: "ConfigMap містить конфігураційні дані, які використовуються Podʼами."
title: "ConfigMap"
weight: 1
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ConfigMap {#ConfigMap}

ConfigMap містить конфігураційні дані, які використовуються Podʼами.

---

- **apiVersion**: v1

- **kind**: ConfigMap

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Детальніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **binaryData** (map[string][]byte)

  BinaryData містить бінарні дані. Кожен ключ повинен складатися з алфавітно-цифрових символів, '-', '_' або '.'. BinaryData може містити байтові послідовності, які не належать до діапазону UTF-8. Ключі, що зберігаються у BinaryData, не повинні збігатися з ключами у полі Data, це перевіряється під час валідації. Використання цього поля вимагатиме apiserver та kubelet версії 1.10+.

- **data** (map[string]string)

  Data містить конфігураційні дані. Кожен ключ повинен складатися з алфавітно-цифрових символів, '-', '_' або '.'. Значення з байтовими послідовностями, що не належать до діапазону UTF-8, повинні використовувати поле BinaryData. Ключі, що зберігаються у Data, не повинні збігатися з ключами у полі BinaryData, це перевіряється під час валідації.

- **immutable** (boolean)

  Immutable, якщо встановлено в true, гарантує, що дані, збережені у ConfigMap, не можуть бути оновлені (можна змінювати лише метадані обʼєкта). Якщо не встановлено в true, поле можна змінити у будь-який час. Стандартне значення — nil.

## ConfigMapList {#ConfigMapList}

ConfigMapList — це ресурс, що містить список обʼєктів ConfigMap.

---

- **apiVersion**: v1

- **kind**: ConfigMapList

- **metadata** ([ListMeta](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata))

  Докладніще: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([][ConfigMap](../config-and-storage-resources/config-map-v1#ConfigMap)), обовʼязкове

  Items — це список ConfigMap.

## Операції {#operations}

---

### `get` отримати вказаний ConfigMap {#get-read-the-specified-configmap}

#### HTTP запит {#http-request}

GET /api/v1/namespaces/{namespace}/configmaps/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва ConfigMap

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ConfigMap {#list-list-or-watch-objects-of-kind-configmap}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/configmaps

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

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMapList" >}}">ConfigMapList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ConfigMap {#list-list-or-watch-objects-of-kind-configmap-1}

#### HTTP запит {#http-request-2}

GET /api/v1/configmaps

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

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMapList" >}}">ConfigMapList</a>): OK

401: Unauthorized

### `create` створення ConfigMap {#create-create-a-configmap}

#### HTTP запит {#http-request-3}

POST /api/v1/namespaces/{namespace}/configmaps

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ConfigMap {#update-replace-the-specified-configmap}

#### HTTP запит {#http-request-4}

PUT /api/v1/namespaces/{namespace}/configmaps/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  назва ConfigMap

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ConfigMap {#patch-partially-update-the-specified-configmap}

#### HTTP запит {#http-request-5}

PATCH /api/v1/namespaces/{namespace}/configmaps/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва ConfigMap

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

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): Created

401: Unauthorized

### `delete` видалення ConfigMap {#delete-delete-a-configmap}

#### HTTP запит {#http-request-6}

DELETE /api/v1/namespaces/{namespace}/configmaps/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва ConfigMap

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

### `deletecollection` видалення колекції ConfigMap {#deletecollection-delete-collection-of-configmap}

#### HTTP запит {#http-request-7}

DELETE /api/v1/namespaces/{namespace}/configmaps

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
