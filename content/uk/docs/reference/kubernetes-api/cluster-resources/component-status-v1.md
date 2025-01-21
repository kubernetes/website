---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ComponentStatus"
content_type: "api_reference"
description: "ComponentStatus (і ComponentStatusList) містить інформацію про валідацію кластера."
title: "ComponentStatus"
weight: 2
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ComponentStatus {#ComponentStatus}

ComponentStatus (і ComponentStatusList) містить інформацію про валідацію кластера. Застаріло: Цей API застарів у версії v1.19+

---

- **apiVersion**: v1

- **kind**: ComponentStatus

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **conditions** ([]ComponentCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Список спостережуваних станів компонента

  <a name="ComponentCondition"></a>
  *Інформація про стан компонента.*

  - **conditions.status** (string), обовʼязково

    Статус стану компонента. Допустимі значення для "Healthy": "True", "False" або "Unknown".

  - **conditions.type** (string), обовʼязково

    Тип стану компонента. Допустиме значення: "Healthy"

  - **conditions.error** (string)

    Код помилки стану компонента. Наприклад, код помилки перевірки справності.

  - **conditions.message** (string)

    Повідомлення про стан компонента. Наприклад, інформація про перевірку справності.

## ComponentStatusList {#ComponentStatusList}

Стан усіх умов для компонента у вигляді списку обʼєктів ComponentStatus. Застаріло: Цей API застарів у версії v1.19+

---

- **apiVersion**: v1

- **kind**: ComponentStatusList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>), обовʼязкове

  Список обʼєктів ComponentStatus.

## Операції {#operations}

---

### `get` отримання вказаного ComponentStatus {#get-read-the-specified-componentstatus}

#### HTTP запит {#http-request}

GET /api/v1/componentstatuses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя ComponentStatus

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ComponentStatus {#list-list-objects-of-kind-componentstatus}

#### HTTP запит {#http-request-1}

GET /api/v1/componentstatuses

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

200 (<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatusList" >}}">ComponentStatusList</a>): OK

401: Unauthorized
