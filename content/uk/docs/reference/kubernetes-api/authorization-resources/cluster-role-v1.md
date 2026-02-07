---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "ClusterRole"
content_type: "api_reference"
description: "ClusterRole — це логічне групування PolicyRules на рівні кластера, на яке можна посилатися як на єдине ціле за допомогою привʼязки RoleBinding або ClusterRoleBinding."
title: "ClusterRole"
weight: 5
auto_generated: false
---

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`

## ClusterRole {#ClusterRole}

ClusterRole — це логічне групування PolicyRules на рівні кластера, на яке можна посилатися як на єдине ціле за допомогою привʼязки RoleBinding або ClusterRoleBinding.

---

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: ClusterRole

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта.

- **aggregationRule** (AggregationRule)

  AggregationRule — це необовʼязкове поле, яке описує, як створити правила для цього ClusterRole. Якщо AggregationRule встановлено, то правила управляються контролером і прямі зміни до правил будуть перезаписані контролером.

  <a name="AggregationRule"></a>
  *AggregationRule описує, як знайти ClusterRoles для обʼєднання у ClusterRole*

  - **aggregationRule.clusterRoleSelectors** ([]<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    *Atomic: буде замінено під час злиття*

    ClusterRoleSelectors містить список селекторів, які будуть використані для пошуку ClusterRoles та створення правил. Якщо будь-який з селекторів збігається, тоді дозволи ClusterRole будуть додані.

- **rules** ([]PolicyRule)

  *Atomic: буде замінено під час злиття*

  Rules містить всі PolicyRules для цього ClusterRole.

  <a name="PolicyRule"></a>
  *PolicyRule містить інформацію, яка описує правило політики, але не містить інформації про те, до кого застосовується правило або до якого простору імен воно відноситься.*

  - **rules.apiGroups** ([]string)

    *Atomic: буде замінено під час злиття*

    APIGroups — це назва APIGroup, яка містить ресурси. Якщо вказано декілька API груп, будь-яка дія, запитана для одного з перерахованих ресурсів у будь-якій API групі, буде дозволена. "" представляє основну API групу, а "*" представляє всі API групи.

  - **rules.resources** ([]string)

    *Atomic: буде замінено під час злиття*

    Resources — це список ресурсів, до яких застосовується це правило. '*' представляє всі ресурси.

  - **rules.verbs** ([]string), обовʼязкове

    *Atomic: буде замінено під час злиття*

    Verbs — це список дієслів, які застосовуються до ВСІХ ResourceKinds, що містяться у цьому правилі. '*' представляє всі дієслова.

  - **rules.resourceNames** ([]string)

    *Atomic: буде замінено під час злиття*

    ResourceNames — це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що дозволено все.

  - **rules.nonResourceURLs** ([]string)

    *Atomic: буде замінено під час злиття*

    NonResourceURLs — це набір часткових URL-адрес, до яких користувач повинен мати доступ. '*' дозволені, але тільки як повний, кінцевий крок у шляху. Оскільки не ресурсні URL-адреси не належать до простору імен, це поле застосовується тільки для ClusterRoles, на які посилається ClusterRoleBinding. Правила можуть застосовуватися або до API ресурсів (таких як "pods" або "secrets"), або до не ресурсних URL-шляхів (таких як "/api"), але не до обох одночасно.

## ClusterRoleList {#ClusterRoleList}

ClusterRoleList — це колекція ClusterRoles.

---

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: ClusterRoleList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані обʼєкта.

- **items** ([]<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>), обовʼязково

  Items — це список ClusterRoles.

## Операції {#Operations}

---

### `get` отримати вказану ClusterRole {#get-read-the-specified-clusterrole}

#### HTTP запит {#http-request}

GET /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя ClusterRole

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ClusterRole {#list-list-or-watch-objects-of-kind-clusterrole}

#### HTTP запит {#http-request-1}

GET /apis/rbac.authorization.k8s.io/v1/clusterroles

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

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRoleList" >}}">ClusterRoleList</a>): OK

401: Unauthorized

### `create` створення ClusterRole {#create-create-a-clusterrole}

#### HTTP запит {#http-request-2}

POST /apis/rbac.authorization.k8s.io/v1/clusterroles

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

202 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Accepted

401: Unauthorized

### `update` заміна вказаної ClusterRole {#update-replace-the-specified-clusterrole}

#### HTTP запит {#http-request-3}

PUT /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя ClusterRole

- **body**: <a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної ClusterRole {#patch-partially-update-the-specified-clusterrole}

#### HTTP запит {#http-request-4}

PATCH /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя ClusterRole

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

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

401: Unauthorized

### `delete` видалення ClusterRole {#delete-delete-a-clusterrole}

#### HTTP запит {#http-request-5}

DELETE /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя ClusterRole

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

### `deletecollection` видалення колекції ClusterRole {#deletecollection-delete-collection-of-clusterrole}

#### HTTP запит {#http-request-6}

DELETE /apis/rbac.authorization.k8s.io/v1/clusterroles

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
