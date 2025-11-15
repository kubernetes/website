---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Endpoints"
content_type: "api_reference"
description: "Endpoints — є колекцією точок доступу, що фактично утворюють Service."
title: "Endpoints"
weight: 2
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Endpoints {#Endpoints}

Endpoints — є колекцією точок доступу, що фактично утворюють Service.

```json
Name: "mysvc",
Subsets: [
  {
    Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
    Ports: [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
  },
  {
    Addresses: [{"ip": "10.10.3.3"}],
    Ports: [{"name": "a", "port": 93}, {"name": "b", "port": 76}]
  },
]
```

Endpoints — це застарілий API, який не містить інформації про всі функції Сервісу. Використовуйте discoveryv1.EndpointSlice для отримання повної інформації про точки доступу Сервісу.

Застаріло: Цей API застарів у версії 1.33+. Використовуйте discoveryv1.EndpointSlice.

---

- **apiVersion**: v1

- **kind**: Endpoints

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Детальніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **subsets** ([]EndpointSubset)

  *Atomic: буде замінено під час злиття*

  Набір всіх точок доступу є обʼєднанням (union) всіх субнаборів. Адреси розміщуються в субнабори відповідно до IP-адрес, які вони поділяють. Одна адреса з кількома портами, деякі з яких готові, а деякі ні (тому що вони належать різним контейнерам), буде відображатися в різних субнаборах для різних портів. Жодна адреса не зʼявиться одночасно в Addresses і NotReadyAddresses в одному субнаборі. Набори адрес і портів, які складають Service.

  <a name="EndpointSubset"></a>
  *EndpointSubset – це група адрес з одним набором портів. Розширений набір точок доступу є декартовим добутком Addresses x Ports. Наприклад, задано:*

  ```json
  {
    Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
    Ports:     [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
  }
  ```

  *Отриманий набір точок доступу може виглядати як:*

  ```output
  a: [ 10.10.1.1:8675, 10.10.2.2:8675 ],
  b: [ 10.10.1.1:309, 10.10.2.2:309 ]
  ```

  *Застаріло: Цей API застарів у версії v1.33+.*

  - **subsets.addresses** ([]EndpointAddress)

    *Atomic: буде замінено під час злиття*

    IP-адреси, які пропонують відповідні порти, позначені як готові. Ці точки доступу повинні вважатися безпечними для використання балансувальниками навантаження та клієнтами.

    <a name="EndpointAddress"></a>
    *EndpointAddress — це кортеж, що описує одну IP-адресу. Застаріло: Цей API застарів у версії v1.33+.*

    - **subsets.addresses.ip** (string), обовʼязкове

      IP цієї точки доступу. Не може бути loopback (127.0.0.0/8 або ::1), link-local (169.254.0.0/16 або fe80::/10), або link-local multicast (224.0.0.0/24 або ff02::/16).

    - **subsets.addresses.hostname** (string)

      Імʼя хоста цієї точки доступу

    - **subsets.addresses.nodeName** (string)

      Необовʼязково: Вузол, на якому знаходиться ця точка доступу. Це може бути використано для визначення точок доступу що є локальними для вузла.

    - **subsets.addresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      Посилання на обʼєкт, що надає точку доступу.

  - **subsets.notReadyAddresses** ([]EndpointAddress)

    *Atomic: буде замінено під час злиття*

    IP-адреси, які пропонують відповідні порти, але наразі не позначені як готові, тому що вони ще не завершили запуск, нещодавно не пройшли перевірку готовності або нещодавно не пройшли перевірку на справність.

    <a name="EndpointAddress"></a>
    *EndpointAddress — це кортеж, що описує одну IP-адресу. Застаріло: Цей API застарів у версії v1.33+.*

    - **subsets.notReadyAddresses.ip** (string), обовʼязкове

      IP цієї точки доступу. Не може бути loopback (127.0.0.0/8 або ::1), link-local (169.254.0.0/16 або fe80::/10), або link-local multicast (224.0.0.0/24 або ff02::/16).

    - **subsets.notReadyAddresses.hostname** (string)

      Імʼя хоста цієї точки доступу

    - **subsets.notReadyAddresses.nodeName** (string)

      Необовʼязково: Вузол, на якому знаходиться ця точка доступу. Це може бути використано для визначення точок доступу що є локальними для вузла.

    - **subsets.notReadyAddresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      Посилання на обʼєкт, що надає точку доступу.

  - **subsets.ports** ([]EndpointPort)

    *Atomic: буде замінено під час злиття*

    Номери портів, доступні на відповідних IP-адресах.

    <a name="EndpointPort"></a>
    *EndpointPort — це кортеж, що описує один порт. Застаріло: Цей API застарів у версії v1.33+.*

    - **subsets.ports.port** (int32), обовʼязкове

      Номер порту точки доступу.

    - **subsets.ports.protocol** (string)

      IP-протокол для цього порту. Повинен бути UDP, TCP або SCTP. Стандартно — TCP.

      Можливі значення переліку (enum):
      - `"SCTP"` означає протокол SCTP.
      - `"TCP"` означає протокол TCP.
      - `"UDP"` означає протокол UDP.

    - **subsets.ports.name** (string)

      Імʼя цього порту. Це повинно відповідати полю 'name' у відповідному ServicePort. Повинно бути DNS_LABEL. Необовʼязкове, лише якщо визначено один порт.

    - **subsets.ports.appProtocol** (string)

      Протокол програми для цього порту. Використовується як підказка для реалізацій, щоб пропонувати багатший функціонал для протоколів, які вони розуміють. Це поле відповідає стандартному синтаксису міток Kubernetes. Дійсні значення:

      - Непрефіксовані назви протоколів – зарезервовані для стандартних імен служб IANA (згідно RFC-6335 та https://www.iana.org/assignments/service-names).
      - Назви з префіксами, визначеними Kubernetes:

        - 'kubernetes.io/h2c' — HTTP/2 з попередніми знаннями без шифрування, як описано в https://www.rfc-editor.org/rfc/rfc9113.html#name-starting-http-2-with-prior-
        - 'kubernetes.io/ws' — WebSocket без шифрування, як описано в https://www.rfc-editor.org/rfc/rfc6455
        - 'kubernetes.io/wss' — WebSocket через TLS, як описано в https://www.rfc-editor.org/rfc/rfc6455

      - Інші протоколи повинні використовувати назви з префіксами визначені реалізацією, такі як mycompany.com/my-custom-protocol.

## EndpointsList {#EndpointsList}

EndpointsList – це список точок доступу. Застаріло: Цей API застарів у версії v1.33+.

---

- **apiVersion**: v1

- **kind**: EndpointsList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>), обовʼязкове

  Список точок доступу.

## Операції {#operations}

---

### `get` отримати вказані Endpoints {#get-read-the-specified-endpoints}

#### HTTP запит {#http-request}

GET /api/v1/namespaces/{namespace}/endpoints/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва Endpoints

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Endpoints {#list-list-or-watch-objects-of-kind-endpoints}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/endpoints

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

200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Endpoints {#list-list-or-watch-objects-of-kind-endpoints-1}

#### HTTP запит {#http-request-2}

GET /api/v1/endpoints

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

200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized

### `create` створення Endpoints {#create-create-endpoints}

#### HTTP запит {#http-request-3}

POST /api/v1/namespaces/{namespace}/endpoints

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

202 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Accepted

401: Unauthorized

### `update` заміна Endpoints {#update-replace-the-specified-endpoints}

#### HTTP запит {#http-request-4}

PUT /api/v1/namespaces/{namespace}/endpoints/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  назва Endpoints

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized

### `patch` часткове оновлення Endpoints {#patch-partially-update-the-specified-endpoints}

#### HTTP запит {#http-request-5}

PATCH /api/v1/namespaces/{namespace}/endpoints/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва Endpoints

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

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized

### `delete` видалення Endpoints {#delete-delete-endpoints}

#### HTTP запит {#http-request-6}

DELETE /api/v1/namespaces/{namespace}/endpoints/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва Endpoints

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

### `deletecollection` видалити колекцію Endpoints {#deletecollection-delete-collection-of-endpoints}

#### HTTP запит {#http-request-7}

DELETE /api/v1/namespaces/{namespace}/endpoints

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
