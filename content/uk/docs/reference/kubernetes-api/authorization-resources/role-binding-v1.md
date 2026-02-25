---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "RoleBinding"
content_type: "api_reference"
description: "RoleBinding посилається на роль, але не містить її."
title: "RoleBinding"
weight: 8
auto_generated: false
---

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`

## RoleBinding {#RoleBinding}

RoleBinding посилається на роль, але не містить її. RoleBinding може посилатися на Role в поточному просторі імен або на ClusterRole в глобальному просторі імен. RoleBinding додає інформацію про субʼєкти через Subjects і інформацію про простір імен, в якому існує. RoleBindings у визначеному просторі імен мають вплив лише в цьому просторі імен.

---

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: RoleBinding

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта.

- **roleRef** (RoleRef), обовʼязкове

  RoleRef може посилатися на Role в поточному просторі імен або на ClusterRole в глобальному просторі імен. Якщо RoleRef не може бути розвʼязано, Авторизатор повинен повернути помилку. Це поле є незмінним.

  <a name="RoleRef"></a>
  *RoleRef містить інформацію, яка посилається на використану роль*

  - **roleRef.apiGroup** (string), обовʼязкове

    APIGroup — це група для вказаного ресурсу

  - **roleRef.kind** (string), обовʼязкове

    Kind — тип вказаного ресурсу

  - **roleRef.name** (string), обовʼязкове

    Name — це імʼя вказаного ресурсу

- **subjects** ([]Subject)

  *Atomic: буде замінено під час злиття*

  Subjects містить посилання на обʼєкти, до яких застосовується роль.

  <a name="Subject"></a>
  *Subject містить посилання на обʼєкт або ідентифікатори користувачів, до яких застосовується привʼязка ролей. Може містити або пряме посилання на обʼєкт API, або значення для не-обʼєктів, таких як імена користувачів і груп.*

  - **subjects.kind** (string), обовʼязкове

    Kind — тип обʼєкта, на який посилається. Значення, визначені цією API групою, є "User", "Group" та "ServiceAccount". Якщо Авторизатор не впізнає значення kind, він повинен повідомити про помилку.

  - **subjects.name** (string), обовʼязкове

    Name — імʼя обʼєкта, на який посилається.

  - **subjects.apiGroup** (string)

    APIGroup — це API група вказаного субʼєкта. Стандартно — "" для субʼєктів ServiceAccount. Стандартно — "rbac.authorization.k8s.io" для субʼєктів User і Group.

  - **subjects.namespace** (string)

    Namespace — простір імен вказаного обʼєкта. Якщо тип обʼєкта не простір імен, наприклад, "User" або "Group", і це значення не порожнє, Авторизатор повинен повідомити про помилку.

## RoleBindingList {#RoleBindingList}

RoleBindingList — це колекція RoleBindings.

---

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: RoleBindingList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані обʼєкта.

- **items** ([]<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>), обовʼязкове

  Items — це список RoleBindings.

## Операції {#Operations}

---

### `get` отримати вказаний RoleBinding {#get-read-the-specified-rolebinding}

#### HTTP запит {#http-request}

GET /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/rolebindings/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя RoleBinding

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу RoleBinding {#list-list-or-watch-objects-of-kind-rolebinding}

#### HTTP запит {#http-request-1}

GET /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/rolebindings

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

200 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBindingList" >}}">RoleBindingList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу RoleBinding {#list-list-or-watch-objects-of-kind-rolebinding-1}

#### HTTP запит {#http-request-2}

GET /apis/rbac.authorization.k8s.io/v1/rolebindings

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

200 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBindingList" >}}">RoleBindingList</a>): OK

401: Unauthorized

### `create` створення RoleBinding {#create-create-a-rolebinding}

#### HTTP запит {#http-request-3}

POST /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/rolebindings

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>): Created

202 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>): Accepted

401: Unauthorized

### `update` заміна вказаного RoleBinding {#update-replace-the-specified-rolebinding}

#### HTTP запит {#http-request-4}

PUT /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/rolebindings/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя RoleBinding

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного RoleBinding {#patch-partially-update-the-specified-rolebinding}

#### HTTP запит {#http-request-5}

PATCH /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/rolebindings/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя RoleBinding

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

200 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-binding-v1#RoleBinding" >}}">RoleBinding</a>): Created

401: Unauthorized

### `delete` видалення RoleBinding {#delete-delete-a-rolebinding}

#### HTTP запит {#http-request-6}

DELETE /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/rolebindings/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя RoleBinding

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

### `deletecollection` видалення колекції RoleBinding {#deletecollection-delete-collection-of-rolebinding}

#### HTTP запит {#http-request-7}

DELETE /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/rolebindings

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
