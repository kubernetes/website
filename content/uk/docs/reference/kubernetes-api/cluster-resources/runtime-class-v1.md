---
api_metadata:
  apiVersion: "node.k8s.io/v1"
  import: "k8s.io/api/node/v1"
  kind: "RuntimeClass"
content_type: "api_reference"
description: "RuntimeClass визначає клас середовища виконання контейнерів, підтримуваних у кластері."
title: "RuntimeClass"
weight: 9
auto_generated: false
---

`apiVersion: node.k8s.io/v1`

`import "k8s.io/api/node/v1"`

## RuntimeClass {#RuntimeClass}

RuntimeClass визначає клас середовища виконання контейнерів, підтримуваних у кластері. RuntimeClass використовується для визначення, яке середовище виконання контейнерів використовується для запуску всіх контейнерів у Podʼі. RuntimeClass визначаються вручну користувачем або провайдером кластера і посилаються в PodSpec. Kubelet відповідає за розвʼязання посилання RuntimeClassName перед запуском Podʼа. Для отримання додаткової інформації дивіться: [https://kubernetes.io/docs/concepts/containers/runtime-class/](/docs/concepts/containers/runtime-class/)

---

- **apiVersion**: node.k8s.io/v1

- **kind**: RuntimeClass

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **handler** (string), обовʼязково

  handler визначає базове середовище виконання та конфігурацію, яку реалізація CRI буде використовувати для обробки Podʼів цього класу. Можливі значення специфічні для конфігурації вузла та CRI. Припускається, що всі обробники доступні на кожному вузлі, і обробники з однаковими назвами еквівалентні на кожному вузлі. Наприклад, обробник з назвою "runc" може вказувати, що для запуску контейнерів у Podʼі буде використовуватися середовище виконання runc OCI (з використанням нативних Linux контейнерів). Handler повинен бути у нижньому регістрі, відповідати вимогам мітки DNS (RFC 1123) і бути незмінним.

- **overhead** (Overhead)

  overhead представляє накладні витрати ресурсів, повʼязані з запуском Podʼа для даного RuntimeClass. Для отримання додаткової інформації дивіться [https://kubernetes.io/docs/concepts/scheduling-eviction/pod-overhead/](/docs/concepts/scheduling-eviction/pod-overhead/)

  <a name="Overhead"></a>
  *Структура Overhead представляє накладні витрати ресурсів, повʼязані з запуском Podʼа.*

  - **overhead.podFixed** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    podFixed представляє фіксовані накладні витрати ресурсів, повʼязані з запуском Podʼа.

- **scheduling** (Scheduling)

  scheduling містить обмеження планування, щоб забезпечити розміщення Podʼів, які працюють з цим RuntimeClass, на вузлах, які його підтримують. Якщо scheduling дорівнює nil, передбачається, що цей RuntimeClass підтримується всіма вузлами.

  <a name="Scheduling"></a>
  *Scheduling визначає обмеження планування для вузлів, які підтримують RuntimeClass.*

  - **scheduling.nodeSelector** (map[string]string)

    nodeSelector перераховує мітки, які повинні бути присутніми на вузлах, що підтримують цей RuntimeClass. Podʼи, що використовують цей RuntimeClass, можуть бути розміщені тільки на вузлах, що відповідають цьому селектору. Селектор вузла RuntimeClass обʼєднується з наявним селектором вузла Podʼа. Будь-які конфлікти призведуть до відхилення Podʼа на етапі допуску.

  - **scheduling.tolerations** ([]Toleration)

    *Atomic: буде замінено під час злиття*

    tolerations додаються (за винятком дублікатів) до Podʼів, що працюють з цим RuntimeClass під час допуску, ефективно обʼєднуючи набір вузлів, які Pod та RuntimeClass можуть толерувати.

    <a name="Toleration"></a>
    *Pod, до якого привʼязаний цей Toleration, толерує будь-який taint, що відповідає трійці <key,value,effect> за допомогою оператора порівняння <operator>.*

    - **scheduling.tolerations.key** (string)

      Key — це ключ taint, до якого застосовується toleration. Порожній ключ означає відповідність всім ключам taint. Якщо ключ порожній, оператор повинен бути Exists; ця комбінація означає відповідність усім значенням та всім ключам.

    - **scheduling.tolerations.operator** (string)

      Operator представляє відношення ключа до значення. Допустимі оператори: Exists, Equal, Lt та Gt. Стандартне значення — Equal. Exists еквівалентно шаблону для значення, так що Pod може толерувати всі taints певної категорії. Lt і Gt виконують числові порівняння ( вимагає функціональної можливості TaintTolerationComparisonOperators).

      Можливі значення переліку (enum):
      - `"Equal"`
      - `"Exists"`
      - `"Gt"`
      - `"Lt"`

    - **scheduling.tolerations.value** (string)

      Value — це значення taint, з яким збігається toleration. Якщо оператор Exists, значення повинно бути порожнім, інакше — це просто звичайний рядок.

    - **scheduling.tolerations.effect** (string)

      Effect вказує ефект taint для порівняння. Порожній означає відповідність всім ефектам taint. Якщо вказано, допустимі значення — NoSchedule, PreferNoSchedule та NoExecute.

      Можливі значення переліку (enum):
      - `"NoExecute"` Виселяти всі вже запущені podʼи, які не толерантні до taint. Наразі застосовується NodeController.
      - `"NoSchedule"` Не дозволяти новим podʼам плануватися на вузол, якщо вони не толерані до taint, але дозволяти всім podʼам, переданим до Kubelet без проходження через планувальник, запускатися, і дозволяти всім вже запущеним podʼам продовжувати роботу. Застосовується планувальником.
      - `"PreferNoSchedule"` Як і TaintEffectNoSchedule, але планувальник намагається не планувати нові podʼи на вузол, а не повністю забороняти планувати нові podsʼи на вузол. Застосовується планувальником.

    - **scheduling.tolerations.tolerationSeconds** (int64)

      TolerationSeconds представляє період часу, протягом якого toleration (який повинен мати ефект NoExecute, інакше це поле ігнорується) толерує taint. Стандартне значення — не встановлено, що означає толерування taint назавжди (не виселяти). Нульові та відʼємні значення будуть розглядатися системою як 0 (негайне виселення).

## RuntimeClassList {#RuntimeClassList}

RuntimeClassList — це список обʼєктів RuntimeClass.

---

- **apiVersion**: node.k8s.io/v1

- **kind**: RuntimeClassList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>), обовʼязково

  items — це список обʼєктів схеми.

## Операції {#operations}

---

### `get` отримати вказаний RuntimeClass {#get-read-the-specified-runtimeclass}

#### HTTP запит {#http-request}

GET /apis/node.k8s.io/v1/runtimeclasses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя RuntimeClass

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу RuntimeClass {#list-watch-objects-runtimeclass}

#### HTTP запит {#http-request-1}

GET /apis/node.k8s.io/v1/runtimeclasses

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

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClassList" >}}">RuntimeClassList</a>): OK

401: Unauthorized

### `create` створення RuntimeClass {#create-create-a-runtimeclass}

#### HTTP запит {#http-request-2}

POST /apis/node.k8s.io/v1/runtimeclasses

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): OK

201 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): Created

202 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): Accepted

401: Unauthorized

### `update` заміна вказаного RuntimeClass {#update-replace-the-specified-runtimeclass}

#### HTTP запит {#http-request-3}

PUT /apis/node.k8s.io/v1/runtimeclasses/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя RuntimeClass

- **body**: <a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): OK

201 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного RuntimeClass {#patch-partially-update-the-specified-runtimeclass}

#### HTTP запит {#http-request-4}

PATCH /apis/node.k8s.io/v1/runtimeclasses/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя RuntimeClass

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

200 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): OK

201 (<a href="{{< ref "../cluster-resources/runtime-class-v1#RuntimeClass" >}}">RuntimeClass</a>): Created

401: Unauthorized

### `delete` видалення RuntimeClass {#delete-delete-a-runtimeclass}

#### HTTP запит {#http-request-5}

DELETE /apis/node.k8s.io/v1/runtimeclasses/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя RuntimeClass

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

### `deletecollection` видалення колекції RuntimeClass {#deletecollection-delete-collection-of-runtimeclass}

#### HTTP запит {#http-request-6}

DELETE /apis/node.k8s.io/v1/runtimeclasses

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
