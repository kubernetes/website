---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolumeClaim"
content_type: "api_reference"
description: "PersistentVolumeClaim — це запит користувача на постійний том і заявка на нього."
title: "PersistentVolumeClaim"
weight: 6
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## PersistentVolumeClaim {#PersistentVolumeClaim}

PersistentVolumeClaim представляє запит користувача на отримання та право на постійний том.

---

- **apiVersion**: v1

- **kind**: PersistentVolumeClaim

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Метадані стандартного обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>)

  Специфікація визначає бажані характеристики тому, запитаного автором Podʼа. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims](/docs/concepts/storage/persistent-volumes#persistentvolumeclaims)

- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimStatus" >}}">PersistentVolumeClaimStatus</a>)

  Статус представляє поточну інформацію/стан запиту на постійний том. Тільки для читання. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims](/docs/concepts/storage/persistent-volumes#persistentvolumeclaims)

## PersistentVolumeClaimSpec {#PersistentVolumeClaimSpec}

PersistentVolumeClaimSpec описує загальні атрибути пристроїв зберігання та дозволяє вказувати джерело для атрибутів, специфічних для постачальника.

---

- **accessModes** ([]string)

  *Atomic: буде замінено під час злиття*

  accessModes містить бажані режими доступу, якими повинен користуватися том. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1](/docs/concepts/storage/persistent-volumes#access-modes-1)

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  selector — це запит мітки для томів, які слід враховувати при звʼязуванні.

- **resources** (VolumeResourceRequirements)

  resources представляє мінімальні ресурси, якими повинен володіти том. Користувачам дозволяється вказувати вимоги до ресурсів, які нижчі за попереднє значення, але все ще мають бути вищими, ніж місткість, вказана в полі статусу вимоги. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources](/docs/concepts/storage/persistent-volumes#resources)

  <a name="VolumeResourceRequirements"></a>
  *VolumeResourceRequirements описує вимоги до ресурсів збереження для томів.*

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits описує максимальну кількість дозволених обчислювальних ресурсів. Додаткова інформація: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests описує мінімальну кількість обчислювальних ресурсів, що потрібна. Якщо Requests відсутній для контейнера, він стандартно встановлюється як Limits, якщо це явно вказано, інакше — як значення, визначене реалізацією. Запити не можуть перевищувати Limits. Додаткова інформація: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

- **volumeName** (string)

  volumeName — це посилання на звʼязування з постійним томом, що підтримує цей запит.

- **storageClassName** (string)

  storageClassName — це назва StorageClass, необхідного для вимоги. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1](/docs/concepts/storage/persistent-volumes#class-1)

- **volumeMode** (string)

  volumeMode визначає тип тому, необхідного для вимоги. Значення Filesystem підтверджується, коли воно не включене у специфікацію вимоги.

  Можливі значення переліку (enum):
  - `"Block"` означає, що том не буде відформатований та не міститиме файлову систему, а залишиться необробленим блоковим пристроєм.
  - `"Filesystem"` означає, що том буде або вже відформатований та містить файлову систему.

### Бета-рівень {#beta-level}

- **dataSource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  Поле dataSource може використовуватися для вказівки на:

  - Наявний обʼєкт VolumeSnapshot (snapshot.storage.k8s.io/VolumeSnapshot)
  - Наявний PVC (PersistentVolumeClaim)

  Якщо провайдер або зовнішній контролер може підтримувати вказане джерело даних, він створить новий том на основі вмісту вказаного джерела даних. Коли вмикається функціональна властивість AnyVolumeDataSource, вміст dataSource буде скопійовано до dataSourceRef, а вміст dataSourceRef буде скопійовано до dataSource, коли не вказано dataSourceRef.namespace. Якщо вказано простір імен, то dataSourceRef не буде скопійовано до dataSource.

- **dataSourceRef** (TypedObjectReference)

  dataSourceRef вказує на обʼєкт, з якого потрібно заповнити том даними, якщо потрібний непорожній том. Це може бути будь-який обʼєкт з непорожньої API-групи (не базовий обʼєкт) або обʼєкт PersistentVolumeClaim. Коли вказано це поле, звʼязування тому вдасться тільки в тому випадку, якщо тип вказаного обʼєкта відповідає якомусь встановленому наповнювачу тому або динамічному провайдеру. Це поле замінить функціональність поля dataSource і як таке, якщо обидва поля непорожні, вони повинні мати однакове значення. Для забезпечення зворотної сумісності, коли простір імен не вказано в dataSourceRef, обидва поля (dataSource та dataSourceRef) будуть автоматично встановлені в одне значення, якщо одне з них порожнє, а інше — непорожнє. Коли простір імен вказаний в dataSourceRef, dataSource не встановлюється в те ж саме значення і повинно бути порожнім. Є три важливі відмінності між dataSource та dataSourceRef:

  - Поки dataSource дозволяє лише два конкретних типи обʼєктів, dataSourceRef дозволяє будь-які не базові обʼєкти, а також обʼєкти PersistentVolumeClaim.
  - Поки dataSource ігнорує заборонені значення (вилучаючи їх), dataSourceRef зберігає всі значення і генерує помилку, якщо вказано заборонене значення.
  - Поки dataSource дозволяє лише локальні обʼєкти, dataSourceRef дозволяє обʼєкти в будь-яких просторах імен.

  (Бета) Використання цього поля вимагає ввімкненої властивості AnyVolumeDataSource. (Альфа) Використання поля namespace у dataSourceRef вимагає ввімкненої властивості CrossNamespaceVolumeDataSource.

  <a name="TypedObjectReference"></a>
  *TypedObjectReference містить достатньо інформації, щоб ви могли знайти типізований обʼєкт, на який є посилання*

  - **dataSourceRef.kind** (string), обовʼязково

    Kind — це тип ресурсу, на який вказується

  - **dataSourceRef.name** (string), обовʼязково

    Name — це назва ресурсу, на який вказується

  - **dataSourceRef.apiGroup** (string)

    APIGroup — це група для ресурсу, на який вказується. Якщо APIGroup не вказано, вказаний Kind повинен бути в базовій групі API. Для будь-яких інших сторонніх типів APIGroup обовʼязковий.

  - **dataSourceRef.namespace** (string)

    Namespace — це простір імен ресурсу, на який вказується. Зверніть увагу, що при вказанні простору імен для призначення namespace необхідний обʼєкт gateway.networking.k8s.io/ReferenceGrant в просторі імен-джерелі, щоб дозволити власнику цього простору імен приймати посилання. Див. документацію ReferenceGrant для отримання деталей. (Альфа) Це поле вимагає ввімкненої властивості CrossNamespaceVolumeDataSource.

- **volumeAttributesClassName** (string)

  Поле `volumeAttributesClassName` може бути використане для встановлення `VolumeAttributesClass`, який буде використано заявкою. Якщо вказано, драйвер CSI створить або оновить том із атрибутами, визначеними у відповідному `VolumeAttributesClass`. Це поле має інше призначення, ніж `storageClassName`, і може бути змінене після створення заявки. Порожнє значення означає, що жоден `VolumeAttributesClass` не буде застосований до заявки, однак не можна скинути це поле на порожне значпння після його встановлення. Порожній рядок або значення nil вказує, що до заявки не буде застосовано жодного VolumeAttributesClass. Якщо заявка переходить у стан помилки Infeasible, це поле можна скинути до попереднього значення (включно з nil), щоб скасувати зміну. Якщо ресурс, на який посилається `volumeAttributesClass`, не існує, PersistentVolumeClaim отримає стан Pending ("Очікування"), що буде відображено в полі `modifyVolumeStatus`, доки такий ресурс не зʼявиться. Докладніше: [https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/](/docs/concepts/storage/volume-attributes-classes/). (Beta) Використання цього поля вимагає ввімкнення функціональної можливості `VolumeAttributesClass` (стандартно вимкнено).

## PersistentVolumeClaimStatus {#PersistentVolumeClaimStatus}

PersistentVolumeClaimStatus — це поточний статус запиту на постійний том.

---

- **accessModes** ([]string)

  *Atomic: буде замінено під час злиття*

  accessModes містить фактичні режими доступу, якими володіє том, що підтримує PVC. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1](/docs/concepts/storage/persistent-volumes#access-modes-1)

- **allocatedResourceStatuses** (map[string]string)

  allocatedResourceStatuses зберігає статус ресурсу, який змінюється для даного PVC. Імена ключів відповідають стандартному синтаксису міток Kubernetes. Допустимі значення:

  - Ключі без префіксу:
    - storage — місткість тому.
  - Власні ресурси повинні використовувати визначені реалізацією префіксовані імена, наприклад, "example.com/my-custom-resource".

  Крім вищезазначених значень — ключі без префіксу або з префіксом kubernetes.io вважаються зарезервованими й, отже, не можуть використовуватися.

  ClaimResourceStatus може бути в одному з наступних станів:

  - ControllerResizeInProgress: Стан встановлюється, коли контролер зміни розміру починає змінювати розмір тому в панелі управління.
  - ControllerResizeFailed: Стан встановлюється, коли зміна розміру не вдалася у контролері зміни розміру з термінальною помилкою.
  - NodeResizePending: Стан встановлюється, коли контролер зміни розміру завершив зміну розміру тому, але подальша зміна розміру тому необхідна на вузлі.
  - NodeResizeInProgress: Стан встановлюється, коли kubelet починає змінювати розмір тому.
  - NodeResizeFailed: Стан встановлюється, коли зміна розміру не вдалася у kubelet з термінальною помилкою. Тимчасові помилки не встановлюють NodeResizeFailed.

  Наприклад, якщо PVC розширюється для більшої місткості, це поле може бути в одному з наступних станів:

  - pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeInProgress"
  - pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeFailed"
  - pvc.status.allocatedResourceStatus['storage'] = "NodeResizePending"
  - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeInProgress"
  - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeFailed"

  Якщо це поле не встановлено, це означає, що операція зміни розміру для даного PVC не виконується.

  Контролер, що отримує оновлення PVC з невідомим раніше resourceName або ClaimResourceStatus, повинен ігнорувати оновлення з метою, для якої він був створений. Наприклад, контролер, який відповідає лише за зміну розміру місткості тому, повинен ігнорувати оновлення PVC, які змінюють інші дійсні ресурси, повʼязані з PVC.

- **allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  allocatedResources відстежує ресурси, виділені для PVC, включаючи його місткість. Імена ключів відповідають стандартному синтаксису міток Kubernetes. Допустимі значення:

  - Ключі без префіксу:
    - storage - місткість тому.
  - Власні ресурси повинні використовувати визначені реалізацією префіксовані імена, наприклад, "example.com/my-custom-resource"

  Крім вищезазначених значень — ключі без префіксу або з префіксом kubernetes.io вважаються зарезервованими й, отже, не можуть використовуватися.

  Місткість, зазначена тут, може бути більшою за фактичну місткість, коли запит на розширення тому виконується. Для квоти на зберігання використовується більше значення з allocatedResources і PVC.spec.resources. Якщо allocatedResources не встановлено, для розрахунку квоти використовується лише PVC.spec.resources. Якщо запит на розширення місткості тому знижено, allocatedResources знижується лише в тому випадку, якщо операції розширення не виконуються і якщо фактична місткість тому дорівнює або нижча за запитану місткість.

  Контролер, що отримує оновлення PVC з невідомим раніше resourceName, повинен ігнорувати оновлення з метою, для якої він був створений. Наприклад, контролер, який відповідає лише за зміну розміру місткості тому, повинен ігнорувати оновлення PVC, які змінюють інші дійсні ресурси, повʼязані з PVC.

- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity представляє фактичні ресурси базового тому.

- **conditions** ([]PersistentVolumeClaimCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  conditions — це поточний стан запиту на постійний том. Якщо базовий постійний том змінюється в розмірі, стан буде встановлено на 'Resizing'.

  <a name="PersistentVolumeClaimCondition"></a>
  *PersistentVolumeClaimCondition містить деталі про стан pvc*

  - **conditions.status** (string), обовʼязково

    Status — це статус стану. Може бути True, False, Unknown. Докладніше: [https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=conditions.status,-(string)%2C%20обовʼязково)

  - **conditions.type** (string), обовʼязково

    Тип — це тип стану. Докладніше: [https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1)

  - **conditions.lastProbeTime** (Time)

    lastProbeTime - це час, коли ми обстежили стан.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime — це час, коли стан перейшов з одного статусу до іншого.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    message — це зрозуміле для людини повідомлення, що вказує на деталі останнього переходу.

  - **conditions.reason** (string)

    reason — це унікальний, короткий, зрозумілий для машини рядок, який вказує причину останнього переходу стану. Якщо він повідомляє "Resizing", це означає, що базовий постійний том змінюється в розмірі.

- **currentVolumeAttributesClassName** (string)

  `currentVolumeAttributesClassName` — це поточна назва VolumeAttributesClass, яку використовує PVC. Якщо не встановлено, то до цього PersistentVolumeClaim не застосовано жодного VolumeAttributeClass.

- **modifyVolumeStatus** (ModifyVolumeStatus)

  `ModifyVolumeStatus` представляє обʼєкт статусу операції ControllerModifyVolume. Якщо не встановлено, спроба виконання операції ModifyVolume не відбувається.

  <a name="ModifyVolumeStatus"></a>
  *ModifyVolumeStatus представляє обʼєкт стану операції ControllerModifyVolume*.

  - **modifyVolumeStatus.status** (string), required

    `status` — це статус операції ControllerModifyVolume. Він може перебувати в одному з наступних станів:
    - Pending
      : Pending вказує на те, що PersistentVolumeClaim не може бути змінений через невиконані вимоги, такі як відсутність вказаного VolumeAttributesClass.
    - InProgress
      : InProgress вказує на те, що том наразі модифікується.
    - Infeasible
      : Infeasible вказує на те, що запит було відхилено як недійсний драйвером CSI. Щоб усунути помилку, потрібно вказати дійсний VolumeAttributesClass.

    Примітка: Нові статуси можуть бути додані в майбутньому. Споживачі повинні перевіряти наявність невідомих статусів і відповідно обробляти помилки.

    Можливі значення переліку (enum):
    - `"InProgress"` InProgress вказує, що том модифікується
    - `"Infeasible"` Infeasible вказує, що запит був відхилений драйвером CSI як недійсний. Щоб вирішити цю помилку, потрібно вказати дійсний VolumeAttributesClass
    - `"Pending"` Pending вказує, що PersistentVolumeClaim не може бути змінений через невиконання вимог, таких як відсутність вказаного VolumeAttributesClass

  - **modifyVolumeStatus.targetVolumeAttributesClassName** (string)

    targetVolumeAttributesClassName — імʼя класу VolumeAttributesClass, який зараз узгоджується з PVC

- **phase** (string)

  phase представляє поточну фазу запиту на постійний том.

  Можливі значення переліку (enum):
  - `"Bound"` використовується для PersistentVolumeClaims, які прив'язані
  - `"Lost"` використовується для PersistentVolumeClaims, які втратили свій базовий PersistentVolume. Заявка була привʼязана до PersistentVolume, але цей том більше не існує, і всі дані на ньому були втрачені.
  - `"Pending"` — використовується для PersistentVolumeClaims, які ще не привʼязані.

## PersistentVolumeClaimList {#PersistentVolumeClaimList}

PersistentVolumeClaimList — це список елементів PersistentVolumeClaim.

---

- **apiVersion**: v1

- **kind**: PersistentVolumeClaimList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>), обовʼязково

  items — це список запитів на постійні томи. Додаткова інформація: [https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims](/docs/concepts/storage/persistent-volumes#persistentvolumeclaims)

## Операції {#operations}

---

### `get` отримати вказаний PersistentVolumeClaim {#get-read-the-specified-persistentvolumeclaim}

#### HTTP-запит {#http-request}

GET /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязковий

  імʼя PersistentVolumeClaim

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

401: Unauthorized

### `get` отримати статус вказаного PersistentVolumeClaim {#get-read-the-status-of-the-specified-persistentvolumeclaim}

#### HTTP-запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязковий

  імʼя PersistentVolumeClaim

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

401: Unauthorized

### `list` перелік або спостереження за обʼєктами типу PersistentVolumeClaim {#list-list-or-watch-objects-of-kind-persistentvolumeclaim}

#### HTTP-запит {#http-request-2}

GET /api/v1/namespaces/{namespace}/persistentvolumeclaims

#### Параметри {#parameters-2}

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimList" >}}">PersistentVolumeClaimList</a>): OK

401: Unauthorized

### `list` перелік або спостереження за обʼєктами типу PersistentVolumeClaim {#list-list-or-watch-objects-of-kind-persistentvolumeclaim-1}

#### HTTP-запит {#http-request-3}

GET /api/v1/persistentvolumeclaims

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimList" >}}">PersistentVolumeClaimList</a>): OK

401: Unauthorized

### `create` створити PersistentVolumeClaim {#create-create-a-persistentvolumeclaim}

#### HTTP-запит {#http-request-4}

POST /api/v1/namespaces/{namespace}/persistentvolumeclaims

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Accepted

401: Unauthorized

### `update` замінити вказаний PersistentVolumeClaim {#update-replace-the-specified-persistentvolumeclaim}

#### HTTP-запит {#http-request-5}

PUT /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязковий

  імʼя PersistentVolumeClaim

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

### `update` замінити статус вказаного PersistentVolumeClaim {#update-replace-the-status-of-the-specified-persistentvolumeclaim}

#### HTTP-запит {#http-request-6}

PUT /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязковий

  імʼя PersistentVolumeClaim

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, обовʼязковий

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

### `patch` частково оновити вказаний PersistentVolumeClaim {#patch-partially-update-the-specified-persistentvolumeclaim}

#### HTTP-запит {#http-request-7}

PATCH /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязковий

  імʼя PersistentVolumeClaim

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязковий

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

### `patch` частково оновити статус вказаного PersistentVolumeClaim {#patch-partially-update-the-status-of-the-specified-persistentvolumeclaim}

#### HTTP-запит {#http-request-8}

PATCH /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязковий

  імʼя PersistentVolumeClaim

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязковий

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

### `delete` видалити PersistentVolumeClaim {#delete-delete-a-persistentvolumeclaim}

#### HTTP-запит {#http-request-9}

DELETE /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязковий

  імʼя PersistentVolumeClaim

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Accepted

401: Unauthorized

### `deletecollection` видалити колекцію PersistentVolumeClaim {#deletecollection-delete-collection-of-persistentvolumeclaim}

#### HTTP-запит {#http-request-10}

DELETE /api/v1/namespaces/{namespace}/persistentvolumeclaims

#### Параметри {#parameters-10}

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">простір імен</a>

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
