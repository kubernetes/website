---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1alpha1"
  import: "k8s.io/api/scheduling/v1alpha1"
  kind: "Workload"
content_type: "api_reference"
description: "Workload дозволяє виражати обмеження планування, які слід використовувати при керуванні життєвим циклом робочих навантажень з точки зору планування, включаючи планування, витіснення, виселення та інші фази."
title: "Workload v1alpha1"
weight: 19
auto_generated: true
---

`apiVersion: scheduling.k8s.io/v1alpha1`

`import "k8s.io/api/scheduling/v1alpha1"`

## Workload {#Workload}

Workload дозволяє виражати обмеження планування, які слід використовувати при керуванні життєвим циклом робочих навантажень з точки зору планування, включаючи планування, витіснення, виселення та інші фази.

---

- **apiVersion**: scheduling.k8s.io/v1alpha1

- **kind**: Workload

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Назва повинна бути піддоменом DNS.

- **spec** (<a href="{{< ref "../workload-resources/workload-v1alpha1#WorkloadSpec" >}}">WorkloadSpec</a>), обовʼязково

  Spec визначає бажану поведінку Workload.

## WorkloadSpec {#WorkloadSpec}

WorkloadSpec визначає бажаний стан Workload.

---

- **podGroups** ([]PodGroup), обовʼязково

  *Map: унікальні значення імені ключа будуть збережені під час злиття*

  PodGroups — це список груп подів, які складають Workload. Максимальна кількість груп подів — 8. Це поле є незмінним.

  <a name="PodGroup"></a>
  *PodGroup представляє набір подів із спільною політикою планування.*

  - **podGroups.name** (string), обовʼязково

    Name — це унікальний ідентифікатор для PodGroup у межах Workload. Він повинен бути міткою DNS. Це поле є незмінним.

  - **podGroups.policy** (PodGroupPolicy), обовʼязково

    Policy визначає політику планування для цієї PodGroup.

    <a name="PodGroupPolicy"></a>
    *PodGroupPolicy визначає конфігурацію планування для PodGroup.*

    - **podGroups.policy.basic** (BasicSchedulingPolicy)

      Basic вказує, що поди в цій групі повинні плануватися з використанням стандартної поведінки планування Kubernetes.

      <a name="BasicSchedulingPolicy"></a>
      *BasicSchedulingPolicy вказує, що слід використовувати стандартну поведінку планування Kubernetes.*

    - **podGroups.policy.gang** (GangSchedulingPolicy)

      Gang вказує, що поди в цій групі повинні плануватися з використанням семантики все-або-нічого.

      <a name="GangSchedulingPolicy"></a>
      *GangSchedulingPolicy визначає параметри для групового планування.*

      - **podGroups.policy.gang.minCount** (int32), обовʼязково

        MinCount — це мінімальна кількість підів, які повинні бути заплановані або заплановані одночасно, щоб планувальник прийняв всю групу. Це має бути додатне ціле число.

- **controllerRef** (TypedLocalObjectReference)

  ControllerRef — це необовʼязкове посилання на керуючий обʼєкт, такий як Deployment або Job. Це поле призначено для використання інструментами, такими як CLI, щоб надати посилання назад на оригінальне визначення робочого навантаження. Після встановлення його не можна змінити.

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

- **apiVersion**: scheduling.k8s.io/v1alpha1

- **kind**: WorkloadList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку.

- **items** ([]<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>), обовʼязково

  Items — це список Workload.

## Операції {#Operations}

---

### `get` отримати вказаний Workload {#get-read-the-specified-Workload}

#### HTTP-запит {#http-request}

GET /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва Workload

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): OK

401: Unauthorized

### `list` список або перегляд обʼєктів типу Workload {#list-list-or-watch-objects-of-kind-workload}

#### HTTP-запит {#http-request-1}

GET /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads

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

200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#WorkloadList" >}}">WorkloadList</a>): OK

401: Unauthorized

### `list` список або перегляд обʼєктів типу Workload {#list-list-or-watch-objects-of-kind-workload-1}

#### HTTP-запит {#http-request-2}

GET /apis/scheduling.k8s.io/v1alpha1/workloads

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

200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#WorkloadList" >}}">WorkloadList</a>): OK

401: Unauthorized

### `create` створення Workload {#create-create-a-workload}

#### HTTP-запит {#http-request-3}

POST /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): Created

202 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): Accepted

401: Unauthorized

### `update` замінити вказаний Workload {#update-replace-the-specified-workload}

#### HTTP-запит {#http-request-4}

PUT /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  назва Workload

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): Created

401: Unauthorized

### `patch` часткове оновленя вказаного Workload {#patch-wartially-wpdate-whe-wpecified-workload}

#### HTTP-запит {#http-request-5}

PATCH /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads/{name}

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

200 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): OK

201 (<a href="{{< ref "../workload-resources/workload-v1alpha1#Workload" >}}">Workload</a>): Created

401: Unauthorized

### `delete` видалення Workload {#delete-delete-a-workload}

#### HTTP-запит {#http-request-6}

DELETE /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads/{name}

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

DELETE /apis/scheduling.k8s.io/v1alpha1/namespaces/{namespace}/workloads

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
