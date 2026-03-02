---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Secret"
content_type: "api_reference"
description: "Secret зберігає секретні дані певного типу."
title: "Secret"
weight: 2
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Secret {#Secret}

Secret зберігає секретні дані певного типу. Загальна кількість байт значень у полі Data має бути меншою за MaxSecretSize.

---

- **apiVersion**: v1

- **kind**: Secret

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше:  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **data** (map[string][]byte)

  Data містить секретні дані. Кожен ключ повинен складатися з алфавітно-цифрових символів, '-', '_' або '.'. Сериалізована форма секретних даних є рядком, закодованим у base64, що представляє довільне (можливо, не рядкове) значення даних. Описано в https://tools.ietf.org/html/rfc4648#section-4.

- **immutable** (boolean)

  Immutable, якщо встановлено в true, гарантує, що дані, збережені в Secret, не можуть бути оновлені (можна змінювати лише метадані обʼєкта). Якщо не встановлено в true, поле можна змінити у будь-який час. Стандартне значення — nil.

- **stringData** (map[string]string)

  stringData дозволяє вказувати небінарні секретні дані у вигляді рядків. Це поле надається як поле вводу лише для запису для зручності. Усі ключі та значення обʼєднуються в поле data при записі, перезаписуючи будь-які наявні значення. Поле stringData ніколи не виводиться при читанні з API.

- **type** (string)

  Використовується для полегшення програмної обробки секретних даних. Більше інформації: [https://kubernetes.io/docs/concepts/configuration/secret/#secret-types](/docs/concepts/configuration/secret/#secret-types).

## SecretList {#SecretList}

SecretList — це список обʼєктів Secret.

---

- **apiVersion**: v1

- **kind**: SecretList

- **metadata** ([ListMeta](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds))

  Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([][Secret](../config-and-storage-resources/secret-v1#Secret)), обовʼязково

  Items — це список секретних обʼєктів. Більше інформації: [https://kubernetes.io/docs/concepts/configuration/secret](/docs/concepts/configuration/secret)

## Операції {#operations}

---

### `get` отримати вказаний Secret {#get-read-the-specified-secret}

#### HTTP запит {#http-request}

GET /api/v1/namespaces/{namespace}/secrets/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the Secret

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Response {#response}

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Secret {#list-list-or-watch-objects-of-kind-secret}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/secrets

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

#### Response {#response-1}

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#SecretList" >}}">SecretList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Secret {#list-list-or-watch-objects-of-kind-secret-1}

#### HTTP запит {#http-request-2}

GET /api/v1/secrets

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

#### Response {#response-2}

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#SecretList" >}}">SecretList</a>): OK

401: Unauthorized

### `create` створення Secret {#create-create-a-secret}

#### HTTP запит {#http-request-3}

POST /api/v1/namespaces/{namespace}/secrets

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Response {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Secret {#update-replace-the-specified-secret}

#### HTTP запит {#http-request-4}

PUT /api/v1/namespaces/{namespace}/secrets/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  name of the Secret

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Response {#response-4}

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Secret {#patch-partially-update-the-specified-secret}

#### HTTP запит {#http-request-5}

PATCH /api/v1/namespaces/{namespace}/secrets/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name of the Secret

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

#### Response {#response-5}

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

401: Unauthorized

### `delete` видалення Secret {#delete-delete-a-secret}

#### HTTP запит {#http-request-6}

DELETE /api/v1/namespaces/{namespace}/secrets/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  name of the Secret

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

#### Response {#response-6}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції Secret {#deletecollection-delete-collection-of-secret}

#### HTTP запит {#http-request-7}

DELETE /api/v1/namespaces/{namespace}/secrets

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

#### Response {#response-7}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
