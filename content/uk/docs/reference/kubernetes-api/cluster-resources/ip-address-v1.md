---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IPAddress"
content_type: "api_reference"
description: "IP-адреса являє собою одну IP-адресу з одного сімейства IP-адрес."
title: "IPAddress"
weight: 4
auto_generated: false
---

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

## IPAddress {#IPAddress}

IPAddress представляє одну IP-адресу одного сімейства IP. Цей обʼєкт призначений для використання API, які оперують IP-адресами. Обʼєкт використовується ядром API Service для виділення IP-адрес. IP-адресу можна представити у різних форматах. Щоб гарантувати унікальність IP-адреси, імʼя обʼєкта є IP-адреса в канонічному форматі: чотири десяткові цифри, розділені крапками без ведучих нулів для IPv4 і представлення, визначене RFC 5952 для IPv6. Дійсні: 192.168.1.5 або 2001:db8::1 або 2001:db8:aaaa:bbbb:cccc:dddd:eeee:1 Недійсні: 10.01.2.3 або 2001:db8:0:0:0::1

---

- **apiVersion**: networking.k8s.io/v1

- **kind**: IPAddress

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddressSpec" >}}">IPAddressSpec</a>)

  spec відображає бажаний стан IPAddress. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## IPAddressSpec {#IPAddressSpec}

IPAddressSpec описує атрибути IP-адреси.

---

- **parentRef** (ParentReference), обовʼязково

  ParentRef посилається на ресурс, до якого приєднана IPAddress. IPAddress повинна мати посилання на батьківський обʼєкт.

  <a name="ParentReference"></a>
  *ParentReference описує посилання на батьківський обʼєкт.*

  - **parentRef.name** (string)

    Імʼя є іменем обʼєкта, на який посилаються.

  - **parentRef.resource** (string)

    Ресурс є ресурсом обʼєкта, на який посилаються.

  - **parentRef.group** (string)

    Група є групою обʼєкта, на який посилаються.

  - **parentRef.namespace** (string)

    Простір імен є простором імен обʼєкта, на який посилаються.

## IPAddressList {#IPAddressList}

IPAddressList містить список IPAddress.

---

- **apiVersion**: networking.k8s.io/v1

- **kind**: IPAddressList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Метадані стандартного обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>), обовʼязково

  items є списком IP-адрес (IPAddress).

## Операції {#operations}

---

### `get` отримати вказану IPAddress {#get-read-the-specified-ipaddress}

#### HTTP запит {#http-request}

GET /apis/networking.k8s.io/v1/ipaddresses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя IPAddress

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу IPAddress {#list-list-or-watch-objects-of-kind-ipaddress}

#### HTTP запит {#http-request-1}

GET /apis/networking.k8s.io/v1/ipaddresses

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

200 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddressList" >}}">IPAddressList</a>): OK

401: Unauthorized

### `create` створення IPAddress {#create-create-an-ipaddress}

#### HTTP запит {#http-request-2}

POST /apis/networking.k8s.io/v1/ipaddresses

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>): Created

202 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>): Accepted

401: Unauthorized

### `update` заміна вказаної IPAddress {#update-replace-the-specified-ipaddress}

#### HTTP запит {#http-request-3}

PUT /apis/networking.k8s.io/v1/ipaddresses/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя IPAddress

- **body**: <a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної IPAddress {#patch-partially-update-the-specified-ipaddress}

#### HTTP запит {#http-request-4}

PATCH /apis/networking.k8s.io/v1/ipaddresses/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя IPAddress

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

200 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1#IPAddress" >}}">IPAddress</a>): Created

401: Unauthorized

### `delete` видалення IPAddress {#delete-delete-an-ipaddress}

#### HTTP запит {#http-request-5}

DELETE /apis/networking.k8s.io/v1/ipaddresses/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя IPAddress

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції IPAddress {#deletecollection-delete-collection-of-ipaddress}

#### HTTP запит {#http-request-6}

DELETE /apis/networking.k8s.io/v1/ipaddresses

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
