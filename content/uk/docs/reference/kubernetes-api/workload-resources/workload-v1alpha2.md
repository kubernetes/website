---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha2"
  import: "k8s.io/api/scheduling/v1alpha2"
  kind: "Workload"
content_type: "api_reference"
description: "Workload дозволяє виражати обмеження планування, які слід використовувати при керуванні життєвим циклом робочих навантажень з точки зору планування, включаючи планування, витіснення, виселення та інші фази."
title: "Workload v1alpha2"
weight: 20
auto_generated: true
---

`apiVersion: scheduling.k8s.io/v1alpha2`

`import "k8s.io/api/scheduling/v1alpha2"`

## Workload {#Workload}

Workload дозволяє виражати обмеження планування, які слід використовувати при керуванні життєвим циклом робочих навантажень з точки зору планування, включаючи планування, витіснення, виселення та інші фази. Увімкнення Workload API керується функціональною можливістю GenericWorkload.

---

- **apiVersion**: scheduling.k8s.io/v1alpha2

- **kind**: Workload

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: <https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata>

- **spec** (<a href="{{< ref "../workload-resources/workload-v1alpha2#WorkloadSpec" >}}">WorkloadSpec</a>), обовʼязково

  Spec визначає бажану поведінку Workload.

## WorkloadSpec {#WorkloadSpec}

WorkloadSpec визначає бажаний стан Workload.

---

- **podGroupTemplates** ([]PodGroupTemplate), обовʼязково

  *Map: унікальні значення за ключем name будуть збережені під час обʼєднання*

  PodGroupTemplates — перелік шаблонів, що складають Workload. Максимальна кількість шаблонів — 8. Це поле є незмінним.

  <a name="PodGroupTemplate"></a>
  *PodGroupTemplate представляє шаблон для набору подів з політикою планування.*

  - **podGroupTemplates.name** (string), обовʼязково

    Name — унікальний ідентифікатор для PodGroupTemplate в межах Workload. Він повинен бути міткою DNS. Це поле є незмінним.

  - **podGroupTemplates.schedulingPolicy** (PodGroupSchedulingPolicy), обовʼязково

    SchedulingPolicy визначає політику планування для цього PodGroupTemplate.

    <a name="PodGroupSchedulingPolicy"></a>
    *PodGroupSchedulingPolicy визначає конфігурацію планування для PodGroup. Повинна бути встановлена точно одна політика.*

    - **podGroupTemplates.schedulingPolicy.basic** (BasicSchedulingPolicy)

      Basic визначає, що поди в цій групі повинні плануватися з використанням стандартної поведінки планування Kubernetes.

      <a name="BasicSchedulingPolicy"></a>
      *BasicSchedulingPolicy вказує, що слід використовувати стандартну поведінку планування Kubernetes.*

    - **podGroupTemplates.schedulingPolicy.gang** (GangSchedulingPolicy)

      Gang визначає, що поди в цій групі повинні плануватися з використанням семантики "все або нічого".

      <a name="GangSchedulingPolicy"></a>
      *GangSchedulingPolicy визначає параметри для групового  планування.*

      - **podGroupTemplates.schedulingPolicy.gang.minCount** (int32), обовʼязково

        MinCount — це мінімальна кількість подів, які повинні бути заплановані або заплановані одночасно, щоб планувальник допустив всю групу. Це повинно бути додатне ціле число.

  - **podGroupTemplates.disruptionMode** (string)

    DisruptionMode визначає режим, у якому дану PodGroup можна порушити. Одине з Pod, PodGroup. Це поле доступне лише тоді, коли увімкнено функціональну можливість WorkloadAwarePreemption.

    Можливі значення enum:
    - `"Pod"` означає, що окремі поди можуть отримати стан розладу або випереджені незалежно один від одного. Це не залежить від точного набору подів, які наразі працюють у цій PodGroup.
    - `"PodGroup"` означає, що вся PodGroup повинна отримати стан розладу або випереджена разом.

  - **podGroupTemplates.priority** (int32)

    Priority визначає значення пріоритету груп подів, створених з цього шаблону. Різні системні компоненти використовують це поле для визначення пріоритету групи подів. Коли увімкнено контролер допуску пріоритету, він забороняє користувачам встановлювати це поле. Контролер допуску пріоритету заповнює це поле з PriorityClassName. Чим вище значення, тим вищий пріоритет. Це поле доступне лише тоді, коли увімкнено функціональну можливість WorkloadAwarePreemption.

  - **podGroupTemplates.priorityClassName** (string)

    PriorityClassName визначає пріоритет, який слід враховувати при плануванні групи подів, створеної з цього шаблону. Якщо пріоритет класу не вказано, контролер допуску може встановити його на стандартний глобальний пріоритет класу, якщо він існує. В іншому випадку групи подів, створені з цього шаблону, матимуть пріоритет, встановлений на нуль. Це поле доступне лише тоді, коли увімкнено функціональну можливість WorkloadAwarePreemption.

  - **podGroupTemplates.resourceClaims** ([]PodGroupResourceClaim)

    *Patch strategies: retainKeys, обʼєднати за ключем `name`*

    *Map: унікальні значення за ключем name будуть збережені під час обʼєднання*

    ResourceClaims визначає, які ResourceClaims можуть бути спільно використані серед Podʼів у групі. Podʼи використовують пристрої, виділені для заявки PodGroup, визначаючи заявку у власному Spec.ResourceClaims, яка точно відповідає заявці PodGroup. Заявка повинна мати однакове імʼя та посилатися на той самий ResourceClaim або ResourceClaimTemplate.

    Це поле є альфа-рівнем і вимагає, щоб функціональна можливість DRAWorkloadResourceClaims була увімкнена.

    Це поле є незмінним.

    <a name="PodGroupResourceClaim"></a>
    *PodGroupResourceClaim посилається точно на один ResourceClaim, або безпосередньо, або шляхом вказання ResourceClaimTemplate, який потім перетворюється на ResourceClaim для PodGroup.*

    *Він додає імʼя, яке унікально ідентифікує ResourceClaim всередині PodGroup. Podʼи, які потребують доступу до ResourceClaim, визначають відповідне посилання у власному Spec.ResourceClaims. Заявка Podʼа повинна точно відповідати всім полям заявки PodGroup.*

    - **podGroupTemplates.resourceClaims.name** (string), обовʼязково

      Name унікально ідентифікує цю заявку на ресурс всередині PodGroup. Це повинно бути DNS_LABEL.

    - **podGroupTemplates.resourceClaims.resourceClaimName** (string)

      ResourceClaimName — це імʼя обʼєкта ResourceClaim у тому ж просторі імен, що й ця PodGroup. ResourceClaim буде зарезервовано для PodGroup замість його окремих podʼів.

      Точно один з ResourceClaimName та ResourceClaimTemplateName повинен бути встановлений.

    - **podGroupTemplates.resourceClaims.resourceClaimTemplateName** (string)

      ResourceClaimTemplateName — це імʼя обʼєкта ResourceClaimTemplate у тому ж просторі імен, що й ця PodGroup.

      Шаблон буде використаний для створення нового ResourceClaim, який буде привʼязаний до цієї PodGroup. Коли ця PodGroup буде видалена, ResourceClaim також буде видалено. Імʼя PodGroup та імʼя ресурсу, разом із згенерованим компонентом, будуть використані для формування унікального імені для ResourceClaim, яке буде записано в podgroup.status.resourceClaimStatuses.

      Це поле є незмінним, і після створення ResourceClaim панель управління не вноситиме жодних змін до відповідного ResourceClaim.

      Точно один з ResourceClaimName та ResourceClaimTemplateName повинен бути встановлений.

  - **podGroupTemplates.schedulingConstraints** (PodGroupSchedulingConstraints)

    SchedulingConstraints визначає необовʼязкові обмеження планування (наприклад, топологію) для цього PodGroupTemplate. Це поле доступне лише тоді, коли увімкнено функціональність TopologyAwareWorkloadScheduling.

    <a name="PodGroupSchedulingConstraints"></a>
    *PodGroupSchedulingConstraints визначає обмеження планування (наприклад, топологію) для PodGroup.*

    - **podGroupTemplates.schedulingConstraints.topology** ([]TopologyConstraint)

      *Atomic: буде замінено під час обʼєднання*

      Topology визначає обмеження топології для групи podʼів. Наразі можна вказати лише одне обмеження топології. Це може змінитися в майбутньому.

      <a name="TopologyConstraint"></a>
      *TopologyConstraint визначає обмеження топології для PodGroup.*

      - **podGroupTemplates.schedulingConstraints.topology.key** (string), обовʼязково

        Key визначає ключ мітки вузла, що представляє домен топології. Всі podʼи в межах PodGroup повинні бути розташовані в одному екземплярі домену. Різні PodGroup можуть розташовуватися в різних екземплярах домену, навіть якщо вони походять від одного PodGroupTemplate. Приклади: "topology.kubernetes.io/rack"

- **controllerRef** (TypedLocalObjectReference)

  ControllerRef — це необовʼязкове посилання на керуючий обʼєкт, такий як Deployment або Job. Це поле призначено для використання інструментами, такими як CLI, щоб надати посилання назад на оригінальне визначення робочого навантаження. Це поле є незмінним.

  <a name="TypedLocalObjectReference"></a>
  *TypedLocalObjectReference дозволяє посилатися на типізований обʼєкт всередині того самого простору імен.*

  - **controllerRef.kind** (string), обовʼязково

    Kind — це тип ресурсу, на який посилається. Він повинен бути назвою сегмента шляху.

  - **controllerRef.name** (string), обовʼязково

    Name — це назва ресурсу, на який посилається. Він повинен бути назвою сегмента шляху.

  - **controllerRef.apiGroup** (string)

    APIGroup — це група для ресурсу, на який посилається. Якщо APIGroup порожній, вказаний Kind повинен бути в основній групі API. Для будь-яких інших сторонніх типів встановлення APIGroup обовʼязкове. Він повинен бути піддоменом DNS.

## WorkloadList {#WorkloadList}

WorkloadList містить список ресурсів Workload.

---

- **apiVersion**: scheduling.k8s.io/v1alpha2

- **kind**: WorkloadList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку.

- **items** ([]<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>), обовʼязково

  Items — це список Workload.

## Операції {#Operations}

---

### `get` отримати вказаний Workload {#get-read-the-specified-Workload}

#### HTTP-запит {#http-request}

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва Workload

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): OK

401: Unauthorized

### `list` список або перегляд обʼєктів типу Workload {#list-list-or-watch-objects-of-kind-workload}

#### HTTP-запит {#http-request-1}

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads

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

- **shardSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#WorkloadList" >}}">WorkloadList</a>): OK

401: Unauthorized

### `list` список або перегляд обʼєктів типу Workload {#list-list-or-watch-objects-of-kind-workload-1}

#### HTTP-запит {#http-request-2}

GET /apis/scheduling.k8s.io/v1alpha2/workloads

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

- **shardSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#WorkloadList" >}}">WorkloadList</a>): OK

401: Unauthorized

### `create` створення Workload {#create-create-a-workload}

#### HTTP-запит {#http-request-3}

POST /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): Created

202 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): Accepted

401: Unauthorized

### `update` замінити вказаний Workload {#update-replace-the-specified-workload}

#### HTTP-запит {#http-request-4}

PUT /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  назва Workload

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): Created

401: Unauthorized

### `patch` часткове оновленя вказаного Workload {#patch-wartially-wpdate-whe-wpecified-workload}

#### HTTP-запит {#http-request-5}

PATCH /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва Workload

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

200 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha2#Workload" >}}">Workload</a>): Created

401: Unauthorized

### `delete` видалення Workload {#delete-delete-a-workload}

#### HTTP-запит {#http-request-6}

DELETE /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва Workload

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

### `deletecollection` видалити колекцію Workload {#deletecollection-delete-collection-of-workload}

#### HTTP-запит {#http-request-7}

DELETE /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/workloads

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

- **shardSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-7}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
