---
api_metadata:
  apiVersion: "flowcontrol.apiserver.k8s.io/v1"
  import: "k8s.io/api/flowcontrol/v1"
  kind: "FlowSchema"
content_type: "api_reference"
description: "FlowSchema визначає схему групи потоків."
title: "FlowSchema"
weight: 1
auto_generated: false
---

`apiVersion: flowcontrol.apiserver.k8s.io/v1`

`import "k8s.io/api/flowcontrol/v1"`

## FlowSchema {#FlowSchema}

FlowSchema визначає схему групи потоків. Зверніть увагу, що потік складається з набору вхідних API-запитів з подібними атрибутами та ідентифікується парою рядків: імʼям FlowSchema та "розрізнювачем потоку".

---

- **apiVersion**: flowcontrol.apiserver.k8s.io/v1

- **kind**: FlowSchema

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  `metadata` — стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaSpec" >}}">FlowSchemaSpec</a>)

  `spec` — специфікація бажаної поведінки FlowSchema. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaStatus" >}}">FlowSchemaStatus</a>)

  `status` — поточний статус FlowSchema. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## FlowSchemaSpec {#FlowSchemaSpec}

FlowSchemaSpec описує вигляд специфікації FlowSchema.

---

- **distinguisherMethod** (FlowDistinguisherMethod)

  `distinguisherMethod` визначає, як обчислюється розрізнювач потоку для запитів, які відповідають цій схемі. `nil` вказує на те, що розрізнювач вимкнений і завжди буде пустий рядок.

  <a name="FlowDistinguisherMethod"></a>
  *FlowDistinguisherMethod вказує на метод розрізнювача потоку.*

  - **distinguisherMethod.type** (string), обовʼязково

    `type` - це тип методу розрізнювача потоку. Підтримувані типи: "ByUser" та "ByNamespace". Обовʼязково.

- **matchingPrecedence** (int32)

  `matchingPrecedence` використовується для вибору серед FlowSchema, які відповідають заданому запиту. Обрана FlowSchema є серед тих, що мають чисельно найменший (який ми вважаємо логічно найвищим) MatchingPrecedence. Кожне значення MatchingPrecedence повинно бути в діапазоні [1, 10000]. Зауважте, що якщо пріоритет не вказано, він буде стандартно встановлений на 1000.

- **priorityLevelConfiguration** (PriorityLevelConfigurationReference), обовʼязково

  `priorityLevelConfiguration` повинна посилатися на PriorityLevelConfiguration в кластері. Якщо посилання не вдається вирішити, FlowSchema буде ігноруватися і позначатися як недійсна в її статусі. Обовʼязково.

  <a name="PriorityLevelConfigurationReference"></a>
  *PriorityLevelConfigurationReference містить інформацію, яка посилається на використання "request-priority".*

  - **priorityLevelConfiguration.name** (string), обовʼязково

    `name` — це імʼя конфігурації рівня пріоритетів, на яку є посилання. Обовʼязково.

- **rules** ([]PolicyRulesWithSubjects)

  *Atomic: буде замінено під час злиття*

  `rules` описують, які запити будуть відповідати цій схемі потоку. Ця FlowSchema відповідає запиту, якщо принаймні один член rules відповідає запиту. Якщо це порожній масив, то запити, які відповідають FlowSchema, не буде.

  <a name="PolicyRulesWithSubjects"></a>
  *PolicyRulesWithSubjects визначає тест, який застосовується до запиту до apiserver. Тест враховує субʼєкт, який робить запит, дієслово, яке запитується, і ресурс, яким має бути дія. Цей PolicyRulesWithSubjects відповідає запиту, якщо і тільки якщо обидва (а) принаймні один член subjects відповідає запиту і (б) принаймні один член resourceRules або nonResourceRules відповідає запиту.*

  - **rules.subjects** ([]Subject), обовʼязково

    *Atomic: буде замінено під час злиття*

    `subjects` — це список звичайних користувачів, службових облікових записів або груп, яких це правило стосується. У цьому зрізі повинен бути принаймні один член. Зріз, який включає як системні групи "system:authenticated" і "system:unauthenticated", відповідає кожному запиту. Обовʼязково.

    <a name="Subject"></a>
    *Тема відповідає ініціатору запиту, визначеному системою автентифікації запиту. Існує три способи зіставлення автора; за обліковим записом користувача, групи або службового облікового запиту.*

    - **rules.subjects.kind** (string), обовʼязково

      `kind` показує, яке з полів не пусте. Обовʼязково.

    - **rules.subjects.group** (GroupSubject)

      `group` відповідає на підставі назви групи користувачів.

      <a name="GroupSubject"></a>
      *GroupSubject містить детальну інформацію для субʼєкта типу групи.*

      - **rules.subjects.group.name** (string), обовʼязково

        `name` — це назва групи користувачів, з якою є збіг, або "\*" для відповідності всім групам користувачів. Див. https://github.com/kubernetes/apiserver/blob/master/pkg/authentication/user/user.go для деяких відомих назв груп. Обовʼязково.

    - **rules.subjects.serviceAccount** (ServiceAccountSubject)

      `serviceAccount` відповідає службовим обліковим записам.

      <a name="ServiceAccountSubject"></a>
      *ServiceAccountSubject містить детальну інформацію для субʼєкта типу службового облікового запису.*

      - **rules.subjects.serviceAccount.name** (string), обовʼязково

        `name` — це імʼя облікових записів ServiceAccount, або "\*" для відповідності незалежно від імені. Обовʼязково.

      - **rules.subjects.serviceAccount.namespace** (string), обовʼязково

        `namespace` — це простір імен відповідних обʼєктів ServiceAccount. Обовʼязково.

    - **rules.subjects.user** (UserSubject)

      `user` збіг на основі імені користувача.

      <a name="UserSubject"></a>
      *UserSubject містить детальну інформацію для субʼєкта типу користувача.*

      - **rules.subjects.user.name** (string), обовʼязково

        `name` — це імʼя користувача, яке має збіг, або "\*" для відповідності всім іменам користувачів. Обовʼязково.

  - **rules.nonResourceRules** ([]NonResourcePolicyRule)

    *Atomic: буде замінено під час злиття*

    `nonResourceRules` — це список NonResourcePolicyRules, які ідентифікують відповідні запити відповідно до їх дієслова і цільового URL без ресурсів.

    <a name="NonResourcePolicyRule"></a>
    *NonResourcePolicyRule є предикатом, який відповідає запитам без ресурсів відповідно до їх дієслова і цільового URL без ресурсів. NonResourcePolicyRule відповідає запиту, якщо і тільки якщо обидва (а) принаймні один член verbs відповідає запиту і (б) принаймні один член nonResourceURLs відповідає запиту.*

    - **rules.nonResourceRules.nonResourceURLs** ([]string), обовʼязково

      *Set: унікальні значення будуть збережені під час злиття*

      `nonResourceURLs` — це набір префіксів URL, до яких користувач має мати доступ і не може бути порожнім. Наприклад:

      - "/healthz" є допустимим
      - "/hea\*" є недійсним
      - "/hea" є допустимим, але не відповідає нічому
      - "/hea/\*" також не відповідає нічому
      - "/healthz/\*" відповідає всім перевіркам стану компонентів. "\*" відповідає всім URL без ресурсів. Якщо він присутній, він повинен бути єдиним елементом. Обовʼязково.

    - **rules.nonResourceRules.verbs** ([]string), обовʼязково

      *Set: унікальні значення будуть збережені під час злиття*

      `verbs` — це список відповідних дієслів і не може бути порожнім. "\*" відповідає всім дієсловам. Якщо він присутній, він повинен бути єдиним елементом. Обовʼязково.

  - **rules.resourceRules** ([]ResourcePolicyRule)

    *Atomic: буде замінено під час злиття*

    `resourceRules` — це зріз ResourcePolicyRules, які ідентифікують відповідні запити відповідно до їх дієслова і цільового ресурсу. Принаймні одна з resourceRules або nonResourceRules має бути не порожньою.

    <a name="ResourcePolicyRule"></a>
    *ResourcePolicyRule є предикатом, який відповідає деяким запитам ресурсів, перевіряючи дієслово запиту і цільовий ресурс. ResourcePolicyRule відповідає запиту ресурсу, якщо і тільки якщо: (а) принаймні один член verbs відповідає запиту, (б) принаймні один член apiGroups відповідає запиту, (в) принаймні один член resources відповідає запиту, і (г) або (d1) запит не вказує простір імен (тобто `Namespace==""`) і clusterScope є true або (d2) запит вказує простір імен, і принаймні один член namespaces відповідає простору імен запиту.*

    - **rules.resourceRules.apiGroups** ([]string), обовʼязково

      *Set: унікальні значення будуть збережені під час злиття*

      `apiGroups` — це список відповідних API-груп і не може бути порожнім. "\*" відповідає всім API-групам і, якщо він присутній, він повинен бути єдиним елементом. Обовʼязково.

    - **rules.resourceRules.resources** ([]string), обовʼязково

      *Set: унікальні значення будуть збережені під час злиття*

      `resources` — це список відповідних ресурсів (тобто в нижньому регістрі та множині) і, за бажанням, субресурс. Наприклад, ["services", "nodes/status"]. Цей список не може бути порожнім. "\*" відповідає всім ресурсам і, якщо він присутній, він повинен бути єдиним елементом. Обовʼязково.

    - **rules.resourceRules.verbs** ([]string), обовʼязково

      *Set: унікальні значення будуть збережені під час злиття*

      `verbs` — це список відповідних дієслів і не може бути порожнім. "\*" відповідає всім дієсловам і, якщо він присутній, він повинен бути єдиним елементом. Обовʼязково.

    - **rules.resourceRules.clusterScope** (boolean)

      `clusterScope` показує, чи потрібно відповідати запитам, які не вказують простір імен (це стається або тому, що ресурс не має простору імен, або запит цілісно охоплює всі простори імен). Якщо це поле відсутнє або false, то поле namespaces повинне містити не порожній список.

    - **rules.resourceRules.namespaces** ([]string)

      *Set: унікальні значення будуть збережені під час злиття*

      `namespaces` — це список цільових просторів імен, які обмежують збіги. Запит, який вказує на простір імен, має збіг тільки у випадку, якщо або (a) цей список містить цільовий простір імен або (b) цей список містить "\*". Зверніть увагу, що "\*" відповідає будь-якому вказаному простору імен, але не відповідає запиту, який *не вказує* простір імен (див. поле clusterScope для цього). Цей список може бути порожнім, але лише в тому випадку, якщо clusterScope є true.

## FlowSchemaStatus {#FlowSchemaStatus}

FlowSchemaStatus відображає поточний стан FlowSchema.

---

- **conditions** ([]FlowSchemaCondition)

  *Patch стратегія: злиття за ключем `type`*

  *Map: унікальні значення за ключем type будуть збережені під час злиття*

  `conditions` — це список поточних станів FlowSchema.

  <a name="FlowSchemaCondition"></a>
  *FlowSchemaCondition описує умови для FlowSchema.*

  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` — час останнього переходу стану з одного статусу в інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    `message` — повідомлення зрозуміле людині, що вказує деталі про останній перехід.

  - **conditions.reason** (string)

    `reason` — унікальна причина у вигляді одного слова у CamelCase для останньої зміни стану.

  - **conditions.status** (string)

    `status` — статус стану. Може бути True, False, Unknown. Обовʼязково.

  - **conditions.type** (string)

    `type` — тип стану. Обовʼязково.

## FlowSchemaList {#FlowSchemaList}

FlowSchemaList - це список обʼєктів FlowSchema.

---

- **apiVersion**: flowcontrol.apiserver.k8s.io/v1

- **kind**: FlowSchemaList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  `metadata` — стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>), обовʼязково

  `items` — список обʼєктів FlowSchema.

## Операції {#operations}

---

### `get` отримату вказану FlowSchema {#get-read-the-specified-flowschema}

#### HTTP запит {#http-request}

GET /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя FlowSchema

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

401: Unauthorized

### `get` отримати статус вказаної  FlowSchema {#get-read-status-of-the-specified-flowschema}

#### HTTP запит {#http-request-1}

GET /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя FlowSchema

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

401: Unauthorized

### `list` перелвк або перегляд обʼєктів типу FlowSchema {#list-list-or-watch-objects-of-kind-flowschema}

#### HTTP запит {#http-request-2}

GET /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchemaList" >}}">FlowSchemaList</a>): OK

401: Unauthorized

### `create` створення FlowSchema {#create-create-a-flowschema}

#### HTTP запит {#http-request-3}

POST /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

202 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Accepted

401: Unauthorized

### `update` заміна вказаної FlowSchema {#update-replace-the-specified-flowschema}

#### HTTP запит {#http-request-4}

PUT /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя FlowSchema

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

### `update`заміна статусу вказаної FlowSchema {#update-replace-status-of-the-specified-flowschema}

#### HTTP запит {#http-request-5}

PUT /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя FlowSchema

- **body**: <a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної  FlowSchema {#patch-partially-update-the-specified-flowschema}

#### HTTP запит {#http-request-6}

PATCH /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя FlowSchema

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаної FlowSchema {#patch-partially-update-status-of-the-specified-flowschema}

#### HTTP запит {#http-request-7}

PATCH /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя FlowSchema

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

200 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): OK

201 (<a href="{{< ref "../policy-resources/flow-schema-v1#FlowSchema" >}}">FlowSchema</a>): Created

401: Unauthorized

### `delete` видалення FlowSchema {#delete-delete-a-flowschema}

#### HTTP запит {#http-request-8}

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя FlowSchema

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

### `deletecollection` видалення колекції FlowSchema {#deletecollection-delete-collection-of-flowschema}

#### HTTP запит {#http-request-9}

DELETE /apis/flowcontrol.apiserver.k8s.io/v1/flowschemas

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
