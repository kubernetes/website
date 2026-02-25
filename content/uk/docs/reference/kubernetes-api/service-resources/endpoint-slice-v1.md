---
api_metadata:
  apiVersion: "discovery.k8s.io/v1"
  import: "k8s.io/api/discovery/v1"
  kind: "EndpointSlice"
content_type: "api_reference"
description: "EndpointSlice представляє набір точок доступу сервісу."
title: "EndpointSlice"
weight: 3
auto_generated: false
---

`apiVersion: discovery.k8s.io/v1`

`import "k8s.io/api/discovery/v1"`

## EndpointSlice {#EndpointSlice}

EndpointSlice представляє набір точок доступу сервісу. Більшість EndpointSlice створюються контролером EndpointSlice для представлення Pod-ів, вибраних обʼєктами Service. Для даного сервісу може існувати декілька обʼєктів EndpointSlice, які необхідно обʼєднати для отримання повного набору точок доступу; ви можете знайти всі зрізи для певного сервісу, перерахувавши EndpointSlices у просторі імен сервісу, мітка `kubernetes.io/service-name` якого містить назву сервісу..

---

- **apiVersion**: discovery.k8s.io/v1

- **kind**: EndpointSlice

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта.

- **addressType** (string), обовʼязково

  addressType вказує тип адреси, яку містить цей EndpointSlice. Усі адреси в цьому сегменті повинні бути одного типу. Це поле є незмінним після створення. Наразі підтримуються такі типи адрес:
  - IPv4: Представляє адресу IPv4.
  - IPv6: Представляє адресу IPv6.
  - FQDN: Представляє повне доменне імʼя (Fully Qualified Domain Name). (Застаріло) Контролер EndpointSlice генерує лише зрізи адрес типу "IPv4" та "IPv6", а kube-proxy лише обробляє. Для типу "FQDN" семантика не визначена.

  Можливі значення переліку (enum):
  - `"FQDN"` представляє FQDN.
  - `"IPv4"` представляє IPv4-адресу.
  - `"IPv6"` представляє IPv6-адресу.

- **endpoints** ([]Endpoint), обовʼязково

  *Atomic: буде замінено під час злиття*

  endpoints — список унікальних точок доступу у цьому зрізі. Кожен зріз може містити максимум 1000 точок доступу.

  <a name="Endpoint"></a>
  *Точка доступу являє собою окремий логічний “бекенд", що реалізує сервіс.*

  - **endpoints.addresses** ([]string), обовʼязково

    *Set: унікальні значення будуть збережені під час злиття*

    адреси цієї точки доступу. Для EndpointSlices з типом addressType "IPv4" або "IPv6" значеннями є IP-адреси в канонічній формі. Синтаксис і семантика інших значень addressType не визначені. Це значення має містити принаймні одну адресу, але не більше 100. EndpointSlices, згенеровані контролером EndpointSlice, завжди матимуть рівно 1 адресу. Для додаткових адрес, окрім першої, семантика не визначена, і kube-proxy їх не розглядає.

  - **endpoints.conditions** (EndpointConditions)

    conditions містить інформацію про поточний стан точки доступу.

    <a name="EndpointConditions"></a>
    *EndpointConditions представляє поточний стано точки доступу.*

    - **endpoints.conditions.ready** (boolean)

      ready вказує на те, що ця точка доступу готова до отримання трафіку, відповідно до системи, яка керує точкою доступу. Значення nil слід інтерпретувати як "true". Загалом, точка доступу повинна бути позначена як готова, якщо вона обслуговує трафік, а не завершує роботу, хоча в деяких випадках це можна змінити, наприклад, коли пов’язаний Service встановив прапорець publishNotReadyAddresses.

    - **endpoints.conditions.serving** (boolean)

      serving вказує на те, що ця точка доступу може отримувати трафік, відповідно до системи, яка керує точкою доступу. Для точок доступу, що підтримуються podʼами, контролер EndpointSlice позначить точку доступу як таку, що обслуговується, якщо стан Ready podʼа має значення True. Значення nil слід інтерпретувати як "true".

    - **endpoints.conditions.terminating** (boolean)

      terminating означає, що ця точка доступу завершує роботу. Нульове значення має інтерпретуватись як "false".

  - **endpoints.deprecatedTopology** (map[string]string)

    deprecatedTopology містить інформацію про топологію, яка є частиною v1beta1 API. Це поле є застарілим і буде вилучено, коли буде вилучено API v1beta1 (не раніше kubernetes v1.24).  Хоча це поле може містити значення, воно не може бути записане через v1 API, і будь-які спроби запису до нього будуть проігноровані. Замість цього інформацію про топологію можна знайти у полях zone та nodeName.

  - **endpoints.hints** (EndpointHints)

    hints містить інформацію, повʼязану з тим, як слід використовувати точку доступу.

    <a name="EndpointHints"></a>
    *EndpointHints надає підказки, що описують, як слід використовувати точку доступу.*

    - **endpoints.hints.forNodes** ([]ForNode)

      *Atomic: буде замінено під час злиття*

      forNodes вказує на вузол(и), якими має споживатися ця точка доступу під час використання маршрутизації з урахуванням топології. Може містити максимум 8 записів.

      <a name="ForNode"></a>
      *ForNode надає інформацію про те, які вузли повинні використовувати цю точку доступу.*

      - **endpoints.hints.forNodes.name** (string), обовʼязково

        name представляє імʼя вузла.

    - **endpoints.hints.forZones** ([]ForZone)

      *Atomic: буде замінено під час злиття*

      forZones вказує на зону(и), до якої(их) повинна потрапити ця точка доступу, використовуючи топологічно орієнтовану маршрутизацію. Може містити максимум 8 елементів.

      <a name="ForZone"></a>
      *ForZone надає інформацію про те, які зони повинні використовувати цю точку доступу.*

      - **endpoints.hints.forZones.name** (string), обовʼязково

        name — назва зони.

  - **endpoints.hostname** (string)

    ім'я хосту цієї точки доступу. Це поле може використовуватися споживачами точок доступу, щоб відрізняти їх одна від одної (наприклад, в іменах DNS). Кілька точок доступу, які використовують одне й те саме ім'я хосту, слід вважати взаємозамінними (наприклад, кілька значень A в DNS). Повинні бути малими літерами і проходити перевірку DNS-мітки (RFC 1123).

  - **endpoints.nodeName** (string)

    nodeName — імʼя вузла, на якому розміщено цю точку доступу. Це може бути використано для визначення локальних для вузла точок доступу.

  - **endpoints.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

    targetRef — посилання на обʼєкт Kubernetes, який представляє цю точку доступу.

  - **endpoints.zone** (string)

    зона — назва зони, в якій існує ця точка доступу.

- **ports** ([]EndpointPort)

  *Atomic: буде замінено під час злиття*

  ports визначає список мережевих портів, доступних для кожної точки доступу у цьому зрізі. Кожен порт повинен мати унікальне імʼя. Кожен зріз може містити максимум 100 портів. Сервіси завжди мають принаймні 1 порт, тому EndpointSlice, згенеровані контролером EndpointSlice, також завжди матимуть принаймні 1 порт. EndpointSlice, що використовуються для інших цілей, можуть мати порожній список портів.

  <a name="EndpointPort"></a>
  *EndpointPort представляє Port, який використовується EndpointSlice*

  - **ports.port** (int32)

    порт — це номер порту точки доступу. Якщо EndpointSlice походить від сервісу Kubernetes, його потрібно встановити на цільовий порт сервісу. EndpointSlice, що використовуються для інших цілей, можуть мати порт nil.

  - **ports.protocol** (string)

    протокол представляє IP-протокол для цього порту. Має бути UDP, TCP або SCTP. Стандартно використовується TCP.

    Можливі значення переліку (enum):
    - `"SCTP"` означає протокол SCTP.
    - `"TCP"` означає протокол TCP.
    - `"UDP"` означає протокол UDP.

  - **ports.name** (string)

    name - імʼя цього порту. Усі порти у фрагменті EndpointSlice повинні мати унікальне імʼя. Якщо EndpointSlice є похідним від сервісу Kubernetes, це імʼя відповідає Service.ports[].name. Імʼя має бути або порожнім рядком, або пройти перевірку DNS_LABEL:
    - повинно мати довжину не більше 63 символів.
    - має складатися з малих літер та цифр або символу '-'.
    - повинно починатися і закінчуватися буквено-цифровим символом. Стандартно - порожній рядок.

  - **ports.appProtocol** (string)

    Протокол застосунку для цього порту. Це використовується як підказка для реалізацій, щоб запропонувати багатший функціонал для протоколів, які вони розуміють. Це поле дотримується стандартного синтаксису міток Kubernetes. Допустимі значення:

    - Імена протоколів без префіксів — зарезервовані для стандартних імен служб IANA (відповідно до RFC-6335 та https://www.iana.org/assignments/service-names).

    - Імена з префіксами, визначені Kubernetes:
      - 'kubernetes.io/h2c' — HTTP/2 з попередніми знаннями без шифрування, як описано в https://www.rfc-editor.org/rfc/rfc9113.html#name-starting-http-2-with-prior-
      - 'kubernetes.io/ws' — WebSocket без шифрування, як описано в https://www.rfc-editor.org/rfc/rfc6455
      - 'kubernetes.io/wss' — WebSocket через TLS, як описано в https://www.rfc-editor.org/rfc/rfc6455

    - Інші протоколи повинні використовувати імена з префіксами, визначеними реалізацією, наприклад, mycompany.com/my-custom-protocol.

## EndpointSliceList {#EndpointSliceList}

EndpointSliceList представляє список зрізів точок доступу

---

- **apiVersion**: discovery.k8s.io/v1

- **kind**: EndpointSliceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку.

- **items** ([]<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>), обовʼязково

  items — список зрізів точок доступу

## Операції {#Operations}

---

### `get` отримати вказанний EndpointSlice {#get-read-the-specified-endpointslice}

#### HTTP запит {#http-request}

GET /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя EndpointSlice

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів EndpointSlice {#list-list-or-watch-objects-of-kind-endpointslice}

#### HTTP запит {#http-request-1}

GET /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices

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

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSliceList" >}}">EndpointSliceList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів EndpointSlice {#list-list-or-watch-objects-of-kind-endpointslice-1}

#### HTTP запит {#http-request-2}

GET /apis/discovery.k8s.io/v1/endpointslices

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

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSliceList" >}}">EndpointSliceList</a>): OK

401: Unauthorized

### `create` створення EndpointSlice {#create-create-an-endpointslice}

#### HTTP запит {#http-request-3}

POST /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>): OK

201 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>): Created

202 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>): Accepted

401: Unauthorized

### `update` заміна вказаного EndpointSlice {#update-replace-the-specified-endpointslice}

#### HTTP запит {#http-request-4}

PUT /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя EndpointSlice

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>): OK

201 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного EndpointSlice {#patch-partially-update-the-specified-endpointslice}

#### HTTP запит {#http-request-5}

PATCH /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя EndpointSlice

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

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>): OK

201 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>): Created

401: Unauthorized

### `delete` видалення EndpointSlice {#delete-delete-an-endpointslice}

#### HTTP запит {#http-request-6}

DELETE /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя EndpointSlice

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

### `deletecollection` видалення колекції EndpointSlice {#deletecollection-delete-collection-of-endpointslice}

#### HTTP запит {#http-request-7}

DELETE /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices

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
