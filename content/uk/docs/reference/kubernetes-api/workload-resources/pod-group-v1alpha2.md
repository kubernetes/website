---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha2"
  import: "k8s.io/api/scheduling/v1alpha2"
  kind: "PodGroup"
content_type: "api_reference"
description: "PodGroup представляє екземпляр виконання podʼів, згрупованих разом."
title: "PodGroup v1alpha2"
weight: 4
auto_generated: false
---

`apiVersion: scheduling.k8s.io/v1alpha2`

`import "k8s.io/api/scheduling/v1alpha2"`

## PodGroup {#PodGroup}

PodGroup представляє екземпляр виконання podʼів, згрупованих разом. PodGroups створюються контролерами робочих навантажень (Job, LWS, JobSet тощо) з Workload.podGroupTemplates. Увімкнення API PodGroup керується прапорцем функції GenericWorkload.

---

- **apiVersion**: scheduling.k8s.io/v1alpha2

- **kind**: PodGroup

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Детальніше: <https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata>

- **spec** (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroupSpec" >}}">PodGroupSpec</a>), обовʼязково

  Spec визначає бажаний стан PodGroup.

- **status** (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroupStatus" >}}">PodGroupStatus</a>)

  Status представляє поточний спостережуваний стан PodGroup.

## PodGroupSpec {#PodGroupSpec}

PodGroupSpec визначає бажаний стан PodGroup.

---

- **schedulingPolicy** (PodGroupSchedulingPolicy), обовʼязково

  SchedulingPolicy визначає політику планування для цього екземпляра PodGroup. Контролери очікують, що це поле буде заповнене шляхом копіювання його з PodGroupTemplate. Це поле є незмінним.

  <a name="PodGroupSchedulingPolicy"></a>
  *PodGroupSchedulingPolicy визначає конфігурацію планування для PodGroup. Має бути встановлено точно одну політику.*

  - **schedulingPolicy.basic** (BasicSchedulingPolicy)

    Basic визначає, що podʼи в цій групі повинні плануватися з використанням стандартної поведінки планування Kubernetes.

    <a name="BasicSchedulingPolicy"></a>
    *BasicSchedulingPolicy вказує, що слід використовувати стандартну поведінку планування Kubernetes.*

  - **schedulingPolicy.gang** (GangSchedulingPolicy)

    Gang визначає, що podʼи в цій групі повинні плануватися з використанням семантики "все або нічого".

    <a name="GangSchedulingPolicy"></a>
    *GangSchedulingPolicy визначає параметри для групового планування.*

    - **schedulingPolicy.gang.minCount** (int32), обовʼязково

      MinCount визначає мінімальну кількість podʼів, які повинні бути заплановані або запущені одночасно, щоб планувальник дозволив всю групу. Це повинно бути додатне ціле число.

- **disruptionMode** (string)

  DisruptionMode визначає режим, у якому даний PodGroup може отримати розлад. Контролери очікують, що це поле буде заповнене шляхом копіювання його з PodGroupTemplate. Одне з Pod, PodGroup. Зазвичай — Pod, якщо не встановлено. Це поле є незмінним. Це поле доступне лише тоді, коли увімкнено функціональну можливість WorkloadAwarePreemption.

  Можливі значення enum:
  - `"Pod"` означає, що окремі podʼи можуть отримати розлад або бути передані незалежно. Це не залежить від точного набору podʼів, які наразі працюють у цьому PodGroup.
  - `"PodGroup"` означає, що вся PodGroup має отримати розлад чи випередження разом.

- **podGroupTemplateRef** (PodGroupTemplateReference)

  PodGroupTemplateRef вказує на необов’язковий шаблон PodGroup у складі іншого об’єкта (наприклад, Workload), який було використано для створення PodGroup. Це поле є незмінним.

  <a name="PodGroupTemplateReference"></a>
  *PodGroupTemplateReference вказує на шаблон PodGroup, визначений у деякому об'єкті (наприклад, Workload). Має бути встановлено точно одне посилання.*

  - **podGroupTemplateRef.workload** (WorkloadPodGroupTemplateReference)

    Workload вказує на PodGroupTemplate у складі обʼєкта Workload, який було використано для створення PodGroup.

    <a name="WorkloadPodGroupTemplateReference"></a>
    *WorkloadPodGroupTemplateReference вказує на PodGroupTemplate у складі обʼєкта Workload.*

    - **podGroupTemplateRef.workload.podGroupTemplateName** (string), обовʼязково

      PodGroupTemplateName визначає імʼя PodGroupTemplate у складі обʼєкта Workload.

    - **podGroupTemplateRef.workload.workloadName** (string), обовʼязково

      WorkloadName визначає імʼя обʼєкта Workload.

- **priority** (int32)

  Priority є значенням пріоритету цієї групи podʼів. Різні системні компоненти використовують це поле для визначення пріоритету групи podʼів. Коли увімкнено контролер допуску пріоритету (Priority Admission Controller), він забороняє користувачам встановлювати це поле. Контролер допуску пріоритету заповнює це поле з PriorityClassName. Чим вище значення, тим вищий пріоритет. Це поле є незмінним. Це поле доступне лише тоді, коли увімкнено функціональну можливість WorkloadAwarePreemption.

- **priorityClassName** (string)

  PriorityClassName визначає пріоритет, який слід враховувати при плануванні цієї групи podʼів. Контролери очікують, що це поле буде заповнене шляхом копіювання його з PodGroupTemplate. Інакше воно перевіряється та розвʼязується аналогічно до PriorityClassName в PodGroupTemplate (тобто, якщо пріоритет класу не вказано, контролер допуску може встановити його на стандартний глобальний пріоритет, якщо він існує. Інакше пріоритет групи podʼів буде нульовим). Це поле є незмінним. Це поле доступне лише тоді, коли увімкнено функціональну можливість WorkloadAwarePreemption.

- **resourceClaims** ([]PodGroupResourceClaim)

  *Patch strategies: retainKeys, обʼєднати за ключем `name`*

  *Map: унікальні значення за ключем name будуть збережені під час обʼєднання*

  ResourceClaims визначає, які ResourceClaims можуть бути спільно використані серед Podʼів у групі. Podʼи використовують пристрої, виділені для заявок PodGroup, визначаючи заявку у власному Spec.ResourceClaims, яка точно відповідає заявці PodGroup. Заявка повинна мати однакове імʼя та посилатися на той самий ResourceClaim або ResourceClaimTemplate.

  Це поле є альфа-рівням і вимагає, щоб функціональна можливість DRAWorkloadResourceClaims була увімкнена.

  Це поле є незмінним.

  <a name="PodGroupResourceClaim"></a>
  *PodGroupResourceClaim посилається точно на один ResourceClaim, або безпосередньо, або шляхом вказівки ResourceClaimTemplate, який потім перетворюється на ResourceClaim для PodGroup.*

  *Воно додає імʼя, яке унікально ідентифікує ResourceClaim всередині PodGroup. Podʼи, які потребують доступу до ResourceClaim, визначають відповідне посилання у власному Spec.ResourceClaims. Заявка Pod повинна точно відповідати всім полям заявки PodGroup.*

  - **resourceClaims.name** (string), обовʼязково

    Name унікально ідентифікує цю заявку на ресурс всередині PodGroup. Це повинно бути DNS_LABEL.

  - **resourceClaims.resourceClaimName** (string)

    ResourceClaimName є імʼям обʼєкта ResourceClaim у тому ж просторі імен, що й цей PodGroup. ResourceClaim буде зарезервовано для PodGroup замість його окремих podʼів.

    Необхідно вказати саме один із параметрів ResourceClaimName або ResourceClaimTemplateName.

  - **resourceClaims.resourceClaimTemplateName** (string)

    ResourceClaimTemplateName є імʼям обʼєкта ResourceClaimTemplate у тому ж просторі імен, що й цей PodGroup.

    Шаблон буде використаний для створення нового ResourceClaim, який буде привʼязаний до цієї PodGroup. Коли цей PodGroup буде видалено, ResourceClaim також буде видалено. Імʼя PodGroup та імʼя ресурсу разом із згенерованим компонентом будуть використані для формування унікального імені для ResourceClaim, яке буде записано в podgroup.status.resourceClaimStatuses.

    Це поле є незмінним, і після створення ResourceClaim панель управління не вноситиме жодних змін до відповідного ResourceClaim.

    Необхідно вказати саме один із параметрів ResourceClaimName або ResourceClaimTemplateName.

- **schedulingConstraints** (PodGroupSchedulingConstraints)

  SchedulingConstraints визначає необовʼязкові обмеження планування (наприклад, топологію) для цієї PodGroup. Контролери очікують заповнення цього поля шляхом копіювання його з PodGroupTemplate. Це поле є незмінним. Це поле доступне лише тоді, коли увімкнено функціональну можливість TopologyAwareWorkloadScheduling.

  <a name="PodGroupSchedulingConstraints"></a>
  *PodGroupSchedulingConstraints визначає обмеження планування (наприклад, топологію) для PodGroup.*

  - **schedulingConstraints.topology** ([]TopologyConstraint)

    *Atomic: буде замінено під час злиття*

    Topology визначає обмеження топології для групи podʼів. Наразі можна вказати лише одне обмеження топології. Це може змінитися в майбутньому.

    <a name="TopologyConstraint"></a>
    *TopologyConstraint визначає обмеження топології для PodGroup.*

    - **schedulingConstraints.topology.key** (string), обовʼязково

      Key визначає ключ мітки вузла, що позначає домен топології. Усі поди у PodGroup повинні розміщуватися в одному й тому ж екземплярі домену. Різні PodGroup можуть розміщуватися в різних екземплярах домену, навіть якщо вони походять від одного й того ж PodGroupTemplate. Приклади: "topology.kubernetes.io/rack"

## PodGroupStatus {#PodGroupStatus}

PodGroupStatus представляє інформацію про стан групи podʼів.

---

- **conditions** ([]Condition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення за ключем type будуть збережені під час злиття*

  Conditions представляють останні спостереження за станом PodGroup.

  Відомі типи станів:
  - "PodGroupScheduled": Вказує, чи були задоволені вимоги до планування.
  - "DisruptionTarget": Вказує, чи PodGroup буде завершено через порушення, наприклад, через передчасне завершення.

  Відомі причини для стану PodGroupScheduled:
  - "Unschedulable": PodGroup не може бути заплановано через обмеження ресурсів, правила спорідненості/антиспорідненості або недостатню ємність для групи.
  - "SchedulerError": PodGroup не може бути заплановано через внутрішню помилку, яка сталася під час планування, наприклад через помилки розбору nodeAffinity.

  Відомі причини для стану DisruptionTarget:
  - "PreemptionByScheduler": PodGroup було передчасно завершено планувальником, щоб звільнити місце для PodGroup або Pod з вищим пріоритетом.

  <a name="Condition"></a>
  *Обмеження Condition містить деталі щодо одного аспекту поточного стану цього ресурсу API.*

  - **conditions.lastTransitionTime** (Time), обовʼязково

    lastTransitionTime — це останній час, коли умова перейшла з одного стану в інший. Це має бути час, коли змінилася основна умова. Якщо це невідомо, можна використовувати час, коли змінилося поле API.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string), обовʼязково

    message є зрозумілим для людини повідомленням, яке вказує деталі щодо переходу. Це може бути порожній рядок.

  - **conditions.reason** (string), обовʼязково

    reason містить програмний ідентифікатор, який вказує причину останнього переходу стану. Виробники конкретних типів станів можуть визначати очікувані значення та значення для цього поля, а також чи вважаються ці значення гарантованим API. Значення повинно бути рядком у CamelCase. Це поле не може бути порожнім.

  - **conditions.status** (string), обовʼязково

    status — статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    type — тип стану в форматі CamelCase або у форматі foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якого було встановлен стан. Наприклад, якщо .metadata.generation наразі 12, але .status.conditions[x].observedGeneration дорівнює 9, стан застарів щодо поточного стану екземпляра.

- **resourceClaimStatuses** ([]PodGroupResourceClaimStatus)

  *Patch strategies: retainKeys, обʼєднання за ключем `name`*

  *Map: унікальні значення за ключем name будуть збережені під час злиття*

  Status of resource claims.

  <a name="PodGroupResourceClaimStatus"></a>
  *PodGroupResourceClaimStatus зберігається в PodGroupStatus для кожного PodGroupResourceClaim, який посилається на ResourceClaimTemplate. Він зберігає згенероване імʼя для відповідного ResourceClaim.*

  - **resourceClaimStatuses.name** (string), обовʼязково

    Name унікально ідентифікує цей запит на ресурс всередині PodGroup. Значення повинно відповідати імені запису в podgroup.spec.resourceClaims, що означає, що рядок повинен бути DNS_LABEL.

  - **resourceClaimStatuses.resourceClaimName** (string)

    ResourceClaimName — це імʼя ResourceClaim, яке було згенеровано для PodGroup у просторі імен PodGroup. Якщо це поле не встановлено, то генерація ResourceClaim не була необхідною. У цьому випадку запис podgroup.spec.resourceClaims можна ігнорувати.

## PodGroupList {#PodGroupList}

PodGroupList містить список ресурсів PodGroup.

---

- **apiVersion**: scheduling.k8s.io/v1alpha2

- **kind**: PodGroupList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку.

- **items** ([]<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>), обовʼязково

  Items — це список PodGroups.

## Operations {#Operations}

---

### `get` отримати вказану PodGroup {#get-read-the-specified-podgroup}

#### HTTP Запит {#http-request}

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the PodGroup

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

401: Unauthorized

### `get` отримати статус вказаної PodGroup {#get-read-status-of-the-specified-podgroup}

#### HTTP Запит {#http-request-1}

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя PodGroup

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodGroup {#list-list-or-watch-objects-of-kind-podgroup}

#### HTTP Запит {#http-request-2}

GET /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups

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

- **shardSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroupList" >}}">PodGroupList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodGroup {#list-list-or-watch-objects-of-kind-podgroup-1}

#### HTTP Запит {#http-request-3}

GET /apis/scheduling.k8s.io/v1alpha2/podgroups

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

- **shardSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroupList" >}}">PodGroupList</a>): OK

401: Unauthorized

### `create` створення PodGroup {#create-create-a-podgroup}

#### HTTP Запит {#http-request-4}

POST /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Accepted

401: Unauthorized

### `update` заміна вказаної PodGroup {#update-replace-the-specified-podgroup}

#### HTTP Запит {#http-request-5}

PUT /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name of the PodGroup

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

401: Unauthorized

### `update` заміна статусу вказаної PodGroup {#update-replace-status-of-the-specified-podgroup}

#### HTTP Запит {#http-request-6}

PUT /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  name of the PodGroup

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної PodGroup {#patch-partially-update-the-specified-podgroup}

#### HTTP Запит {#http-request-7}

PATCH /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя PodGroup

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

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаної PodGroup {#patch-partially-update-status-of-the-specified-podgroup}

#### HTTP Запит {#http-request-8}

PATCH /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя PodGroup

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

200 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-group-v1alpha2#PodGroup" >}}">PodGroup</a>): Created

401: Unauthorized

### `delete` видалення PodGroup {#delete-delete-a-podgroup}

#### HTTP Запит {#http-request-9}

DELETE /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  name — імʼя PodGroup

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

### `deletecollection` видалення колекції PodGroup {#deletecollection-delete-collection-of-podgroup}

#### HTTP Запит {#http-request-10}

DELETE /apis/scheduling.k8s.io/v1alpha2/namespaces/{namespace}/podgroups

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

- **shardSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#shardSelector" >}}">shardSelector</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
