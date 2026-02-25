---
api_metadata:
  apiVersion: "policy/v1"
  import: "k8s.io/api/policy/v1"
  kind: "PodDisruptionBudget"
content_type: "api_reference"
description: "PodDisruptionBudget — обʼєкт, який визначає максимальний розлад, який може бути завданий колекції Podʼів."
title: "PodDisruptionBudget"
weight: 5
auto_generated: false
---

`apiVersion: policy/v1`

`import "k8s.io/api/policy/v1"`

## PodDisruptionBudget {#PodDisruptionBudget}

PodDisruptionBudget — обʼєкт, який визначає максимальний розлад, який може бути завданий колекції Podʼів.

---

- **apiVersion**: policy/v1

- **kind**: PodDisruptionBudget

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetSpec" >}}">PodDisruptionBudgetSpec</a>)

  Специфікація бажаної поведінки PodDisruptionBudget.

- **status** (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetStatus" >}}">PodDisruptionBudgetStatus</a>)

  Останній спостережуваний стан PodDisruptionBudget.

## PodDisruptionBudgetSpec {#PodDisruptionBudgetSpec}

PodDisruptionBudgetSpec — це опис PodDisruptionBudget.

---

- **maxUnavailable** (IntOrString)

  Виселення дозволяється, якщо щонайбільше "maxUnavailable" Podʼів, вибраних за допомогою "selector", є недоступними після виселення, тобто навіть за відсутності виселеного Podʼа. Наприклад, можна запобігти всім добровільним виселенням, вказавши 0. Це взаємозаперечне налаштування з "minAvailable".

  <a name="IntOrString"></a>
  *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

- **minAvailable** (IntOrString)

  Виселення дозволяється, якщо щонайменше "minAvailable" Podʼів, вибраних за допомогою "selector", залишаться доступними після виселення, тобто навіть за відсутності виселеного Podʼа. Наприклад, можна запобігти всім добровільним виселенням, вказавши "100%".

  <a name="IntOrString"></a>
  *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  Запит міток для Podʼів, виселення яких керується бюджетом розладів. Нульовий селектор не вибиратиме жодного Podʼа, тоді як порожній ({}) селектор вибиратиме всі Podʼи в межах простору імен.

- **unhealthyPodEvictionPolicy** (string)

  UnhealthyPodEvictionPolicy визначає критерії, коли несправні Podʼи слід вважати кандидатами на виселення. Поточна реалізація вважає справними ті Podʼи, у яких у status.conditions є елемент із type="Ready",status="True".

  Дійсні політики: IfHealthyBudget і AlwaysAllow. Якщо політика не вказана, буде використано стандартну поведінку, яка відповідає політиці IfHealthyBudget.

  Політика IfHealthyBudget означає, що працюючі Podʼи (status.phase="Running"), але ще не справні, можуть бути виселені лише у випадку, якщо захищений застосунок не в розладі (status.currentHealthy принаймні дорівнює status.desiredHealthy). Справні Podʼи підпадають під дію PDB для виселення.

  Політика AlwaysAllow означає, що всі працюючі Podʼи (status.phase="Running"), але ще не справні, вважаються в стані розладу і можуть бути виселені незалежно від того, чи виконуються критерії у PDB. Це означає, що працюючі Podʼи застосунка в розладі можуть не мати шансу стати справними. Справні Podʼи підпадають під дію PDB для виселення.

  У майбутньому можуть бути додані додаткові політики. Клієнти, які приймають рішення про виселення, повинні забороняти виселення несправних Podʼів, якщо вони стикаються з незнайомою політикою в цьому полі.

  Можливі значення переліку (enum):
  - `"AlwaysAllow"` політика означає, що всі запущені podʼи (status.phase="Running"), але ще не працездатні, вважаються порушеними і можуть бути вилучені незалежно від того, чи відповідають вони критеріям PDB. Це означає, що потенційні запущені podʼи порушеного застосунку можуть не отримати шансу стати працездатними. Працездатні podʼи підпадають під PDB для виселення.
  - `"IfHealthyBudget"` політика означає, що працюючі podʼи (status.phase="Running"), але ще не справні, можуть бути виселені лише у випадку, якщо захищений застосунок не в розладі (status.currentHealthy принаймні дорівнює status.desiredHealthy). Справні podʼи підпадають під дію PDB для виселення.

## PodDisruptionBudgetStatus {#PodDisruptionBudgetStatus}

PodDisruptionBudgetStatus представляє інформацію про стан PodDisruptionBudget. Статус може відставати від фактичного стану системи.

---

- **currentHealthy** (int32), обовʼязково

  поточна кількість справних Podʼів

- **desiredHealthy** (int32), обовʼязково

  мінімально бажана кількість справних Podʼів

- **disruptionsAllowed** (int32), обовʼязково

  Кількість розладів Podʼів, які наразі дозволені.

- **expectedPods** (int32), обовʼязково

  загальна кількість Podʼів, врахованих цим бюджетом розладів

- **conditions** ([]Condition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення за ключем type зберігаються під час обʼєднання*

  Conditions містить стани для PDB. Контролер розладів встановлює стан DisruptionAllowed. Нижче наведені відомі значення для поля reason (у майбутньому можуть бути додані додаткові причини):

  - SyncFailed: Контролер зіткнувся з помилкою і не зміг обчислити кількість дозволених розладів. Тому розлади не дозволяються, і статус стану буде False.
  - InsufficientPods: Кількість Podʼів дорівнює або менша за кількість, необхідну для PodDisruptionBudget. Розлади не дозволяються, і статус стану буде False.
  - SufficientPods: Є більше Podʼів, ніж потрібно для PodDisruptionBudget. Стан буде True, і кількість дозволених розладів буде вказана у властивості disruptionsAllowed.

  <a name="Condition"></a>
  *Condition містить деталі щодо одного аспекту поточного стану цього ресурсу API.*

  - **conditions.lastTransitionTime** (Time), обовʼязково

    lastTransitionTime — це час останнього переходу стану з одного в інший. Це має бути момент, коли змінився основний стан. Якщо це невідомо, то допустимо використовувати час, коли змінилося поле API.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string), обовʼязково

    message — це повідомлення, зрозуміле людині, вказує деталі про зміну стану. Це може бути порожній рядок.

  - **conditions.reason** (string), обовʼязково

    reason містить програмний ідентифікатор, що вказує причину останньої зміни стану. Виробники певних типів станів можуть визначати очікувані значення та значення для цього поля та чи вважаються ці значення гарантованими API. Значення має бути рядком у CamelCase. Це поле не може бути порожнім.

  - **conditions.status** (string), обовʼязково

    статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    тип стану в CamelCase або у форматі foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якого було встановлено стан. Наприклад, якщо .metadata.generation наразі дорівнює 12, але .status.conditions[x].observedGeneration дорівнює 9, стан застарів щодо поточного стану екземпляра.

- **disruptedPods** (map[string]Time)

  DisruptedPods містить інформацію про Podʼи, виселення яких було оброблено субресурсом виселення API-сервера, але ще не було зафіксовано контролером PodDisruptionBudget. Pod буде в цьому map з моменту, коли API-сервер обробив запит на виселення, до моменту, коли контролер PDB побачить Pod як такий, що позначений для видалення (або після тайм-ауту). Ключем у map є назва Podʼа, а значенням — час, коли API-сервер обробив запит на виселення. Якщо видалення не відбулося і Pod все ще є, він буде автоматично видалений зі списку контролером PodDisruptionBudget через певний час. Якщо все йде добре, цей map повинен бути порожнім більшу частину часу. Велика кількість записів у map може вказувати на проблеми з видаленням Podʼів.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **observedGeneration** (int64)

  Останнє спостережене покоління під час оновлення цього статусу PDB. DisruptionsAllowed та інша інформація про статус дійсні лише, якщо observedGeneration дорівнює поколінню обʼєкта PDB.

## PodDisruptionBudgetList {#PodDisruptionBudgetList}

PodDisruptionBudgetList —це колекція PodDisruptionBudgets.

---

- **apiVersion**: policy/v1

- **kind**: PodDisruptionBudgetList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>), обовʼязково

  Елементи — це список PodDisruptionBudgets

## Операції {#operations}

---

### `get` отримати вказаний PodDisruptionBudget {#get-read-the-specified-poddisruptionbudget}

#### HTTP запит {#http-request}

GET /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodDisruptionBudget

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

401: Unauthorized

### `get` отримати статус вказаного PodDisruptionBudget {#get-read-status-of-the-specified-poddisruptionbudget}

#### HTTP запит {#http-request-1}

GET /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodDisruptionBudget

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodDisruptionBudget {#list-list-or-watch-objects-of-kind-poddisruptionbudget}

#### HTTP запит {#http-request-2}

GET /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets

#### Параметри {#parameters-2}

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

#### Відповідь {#response-2}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetList" >}}">PodDisruptionBudgetList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodDisruptionBudget {#list-list-or-watch-objects-of-kind-poddisruptionbudget-1}

#### HTTP запит {#http-request-3}

GET /apis/policy/v1/poddisruptionbudgets

#### Параметри {#parameters-3}

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

#### Відповідь {#response-3}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetList" >}}">PodDisruptionBudgetList</a>): OK

401: Unauthorized

### `create` ствоерння PodDisruptionBudget {#create-create-a-poddisruptionbudget}

#### HTTP запит {#http-request-4}

POST /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

202 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Accepted

401: Unauthorized

### `update` заміна вказаного PodDisruptionBudget {#update-replace-the-specified-poddisruptionbudget}

#### HTTP запит {#http-request-5}

PUT /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodDisruptionBudget

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized

### `update` заміна статусу вказанрого PodDisruptionBudget {#update-replace-status-of-the-specified-poddisruptionbudget}

#### HTTP запит {#http-request-6}

PUT /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodDisruptionBudget

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного PodDisruptionBudget {#patch-partially-update-the-specified-poddisruptionbudget}

#### HTTP запит {#http-request-7}

PATCH /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodDisruptionBudget

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного PodDisruptionBudget {#patch-partially-update-status-of-the-specified-poddisruptionbudget}

#### HTTP запит {#http-request-8}

PATCH /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodDisruptionBudget

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

#### Відповідь {#response-8}

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized

### `delete` видалення PodDisruptionBudget {#delete-delete-a-poddisruptionbudget}

#### HTTP запит {#http-request-9}

DELETE /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodDisruptionBudget

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції PodDisruptionBudget {#deletecollection-delete-collection-of-poddisruptionbudget}

#### HTTP запит {#http-request-10}

DELETE /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets

#### Параметри {#parameters-10}

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

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
