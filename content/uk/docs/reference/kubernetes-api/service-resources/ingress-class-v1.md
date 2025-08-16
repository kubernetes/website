---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IngressClass"
content_type: "api_reference"
description: "IngressClass представляє клас Ingress, на який посилається Ingress Spec."
title: "IngressClass"
weight: 5
auto_generated: false
---

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

## IngressClass {#IngressClass}

IngressClass представляє клас Ingress, на який посилається Ingress Spec. Анотацію `ingressclass.kubernetes.io/is-default-class` можна використовувати, щоб вказати, що IngressClass слід вважати стандартним класом. Коли для одного ресурсу IngressClass ця анотація має значення true, новим ресурсам Ingress без вказаного класу буде присвоєно цей клас.

---

- **apiVersion**: networking.k8s.io/v1

- **kind**: IngressClass

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартний обʼєкт метаданих. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassSpec" >}}">IngressClassSpec</a>)

  spec — є бажаним станом IngressClass. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## IngressClassSpec {#IngressClassSpec}

IngressClassSpec надає інформацію про клас Ingress.

---

- **controller** (string)

  controller вказує на імʼя контролера, який має обробляти цей клас. Це дозволяє використовувати різні "різновиди", керовані тим самим контролером. Наприклад, для одного імплементованого контролера можуть існувати різні параметри. Це повинно бути вказане як шлях з префіксом домену, не довше ніж 250 символів, наприклад, "acme.io/ingress-controller". Це поле є незмінним.

- **parameters** (IngressClassParametersReference)

  parameters це посилання на спеціалізований ресурс, що містить додаткову конфігурацію для контролера. Це необовʼязково, якщо контролер не вимагає додаткових параметрів.

  <a name="IngressClassParametersReference"></a>
  *IngressClassParametersReference ідентифікує обʼєкт API. Це може бути використано для вказівки на обʼєкт, що належить кластеру або області простору імен.*

  - **parameters.kind** (string), обовʼязково

    kind це тип ресурсу, на який вказується посилання.

  - **parameters.name** (string), обовʼязково

    name це імʼя ресурсу, на який вказується посилання.

  - **parameters.apiGroup** (string)

    apiGroup це група для ресурсу, на який вказується посилання. Якщо apiGroup не вказано, вказаний Kind повинен бути в основній групі API. Для будь-яких інших типів сторонніх ресурсів apiGroup є обовʼязковим.

  - **parameters.namespace** (string)

    namespace це простір імен для ресурсу, на який вказується посилання. Це поле обовʼязкове, коли scope встановлено на "Namespace", і його не слід встановлювати, коли scope встановлено у "Cluster".

  - **parameters.scope** (string)

    scope вказує на те, чи відноситься ресурс до кластера або простору імен. Цей параметр може мати значення "Cluster" (типово) або "Namespace".

## IngressClassSpec {#IngressClassSpec}

IngressClassSpec надає інформацію про клас Ingress.

---

- **controller** (string)

  controller вказує на імʼя контролера, який повинен обробляти цей клас. Це дозволяє використовувати різні "різновиди", які контролюються тим самим контролером. Наприклад, у вас можуть бути різні параметри для одного й того ж імплементаційного контролера. Це повинно бути вказано як шлях з префіксом домену довжиною не більше 250 символів, наприклад, "acme.io/ingress-controller". Це поле є незмінним.

- **parameters** (IngressClassParametersReference)

  parameters це посилання на власний ресурс, що містить додаткову конфігурацію для контролера. Це необовʼязково, якщо контролер не потребує додаткових параметрів.

  <a name="IngressClassParametersReference"></a>
  *IngressClassParametersReference ідентифікує обʼєкт API. Це може бути використано для  {#list-list-or-watch-objects-of-kind-ingressclass}вказівки на ресурс, обмежений кластером або простором імен.*
 {#http-request-1}
  - **parameters.kind** (string), обовʼязково

    kind це тип ресурсу, на який вказується посилання.
 {#parameters-1}
  - **parameters.name** (string), обовʼязково

    name це імʼя ресурсу, на який вказується посилання.

  - **parameters.apiGroup** (string)

    apiGroup це група для ресурсу, на який вказується посилання. Якщо apiGroup не вказано, вказаний Kind повинен належати до основної групи API. Для будь-яких інших типів сторонніх ресурсів apiGroup є обовʼязковим.

  - **parameters.namespace** (string)

    namespace це простір імен для ресурсу, на який вказується посилання. Це поле є обовʼязковим, коли scope встановлено на "Namespace", і його не слід встановлювати, коли scope встановлено на "Cluster".

  - **parameters.scope** (string)

    scope вказує, чи це посилання на ресурс, обмежений кластером або простором імен. Це може бути встановлено на "Cluster" (стандартно) або "Namespace".

## IngressClassList {#IngressClassList}

IngressClassList є колекцією IngressClasses.

---

- **apiVersion**: networking.k8s.io/v1

- **kind**: IngressClassList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку.

- **items** ([]<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>), обовʼязково

  items це список IngressClasses.

## Операції {#operations}

---

### `get` отримати вказаний IngressClass {#get-read-the-specified-ingressclass}

#### HTTP запит {#http-request}

GET /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя IngressClass

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): ОК

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу IngressClass {#list-list-or-watch-objects-of-kind-ingressclass}

#### HTTP запит {#http-request-1}

GET /apis/networking.k8s.io/v1/ingressclasses

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

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassList" >}}">IngressClassList</a>): ОК

401: Unauthorized

### `create` створення IngressClass {#create-create-an-ingressclass}

#### HTTP запит {#http-request-2}

POST /apis/networking.k8s.io/v1/ingressclasses

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): ОК

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

202 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Accepted

401: Unauthorized

### `update` заміна вказаного IngressClass {#update-replace-the-specified-ingressclass}

#### HTTP запит {#http-request-3}

PUT /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя IngressClass

- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): ОК

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного IngressClass {#patch-partially-update-the-specified-ingressclass}

#### HTTP запит {#http-request-4}

PATCH /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя IngressClass

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

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): ОК

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized

### `delete` видалення IngressClass {#delete-delete-an-ingressclass}

#### HTTP запит {#http-request-5}

DELETE /apis/networking.k8s.io/v1/ingressclasses/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя IngressClass

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): ОК

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції IngressClass {#deletecollection-delete-collection-of-ingressclass}

#### HTTP запит {#http-request-6}

DELETE /apis/networking.k8s.io/v1/ingressclasses

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): ОК

401: Unauthorized
