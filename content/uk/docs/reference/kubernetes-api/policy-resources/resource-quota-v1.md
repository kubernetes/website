---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ResourceQuota"
content_type: "api_reference"
description: "ResourceQuota встановлює сукупні обмеження квоти, що застосовуються до простору імен."
title: "ResourceQuota"
weight: 3
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ResourceQuota {#ResourceQuota}

ResourceQuota встановлює сукупні квоти, які застосовуються для кожного простору імен.

---

- **apiVersion**: v1

- **kind**: ResourceQuota

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaSpec" >}}">ResourceQuotaSpec</a>)

  Spec визначає бажані квоти. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaStatus" >}}">ResourceQuotaStatus</a>)

  Status визначає фактично застосовані квоти та їх поточне використання. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ResourceQuotaSpec {#ResourceQuotaSpec}

ResourceQuotaSpec визначає бажані жорсткі обмеження для застосування квоти.

---

- **hard** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  hard — це набір бажаних жорстких обмежень для кожного названого ресурсу. Докладніше: [https://kubernetes.io/docs/concepts/policy/resource-quotas/](/docs/concepts/policy/resource-quotas/)

- **scopeSelector** (ScopeSelector)

  scopeSelector — це також набір фільтрів, таких як scopes, які повинні відповідати кожному обʼєкту, відстежуваному квотою, але виражені за допомогою ScopeSelectorOperator у поєднанні з можливими значеннями. Для відповідності ресурсу повинні відповідати як scopes, так і scopeSelector (якщо зазначено у spec).

  <a name="ScopeSelector"></a>
  *Селектор області застосування являє собою AND селекторів, представлених вимогами селектора ресурсу з обмеженою областю застосування.*

  - **scopeSelector.matchExpressions** ([]ScopedResourceSelectorRequirement)

    *Atomic: буде замінено під час злиття*

    Список вимог селектора за областю застосування ресурсів.

    <a name="ScopedResourceSelectorRequirement"></a>
    *Вимога до селектора ресурсу з областю застосування — це селектор, який містить значення, імʼя області застосування та оператор, який повʼязує імʼя області застосування зі значеннями.*

    - **scopeSelector.matchExpressions.operator** (string), обовʼязково

      Представляє стосунок області застосування з
      до набору значень. Допустимі оператори In, NotIn, Exists, DoesNotExists.

      Можливі значення переліку (enum):
      - `"DoesNotExist"`
      - `"Exists"`
      - `"In"`
      - `"NotIn"`

    - **scopeSelector.matchExpressions.scopeName** (string), обовʼязково

      Імʼя області застосування, до якої застосовується селектор.

      Можливі значення переліку (enum):
      - `"BestEffort"` Збігається зі всіма обʼєктами pod, які мають найкращу якість обслуговування
      - `"CrossNamespacePodAffinity"` Збігається зі всіма обʼєктами pod, які мають згадану крос-просторову под (анти)спорідненість.
      - `"NotBestEffort"` Збігається зі всіма обʼєктами pod, які не мають найкращої якості обслуговування
      - `"NotTerminating"` Збігається зі всіма обʼєктами pod, де spec.activeDeadlineSeconds дорівнює nil
      - `"PriorityClass"` Збігається зі всіма обʼєктами pod, які мають згаданий клас пріоритету
      - `"Terminating"` Збігається зі всіма обʼєктами pod, де spec.activeDeadlineSeconds >=0
      - `"VolumeAttributesClass"` Збігається зі всіма обʼєктами pvc, які мають згаданий клас атрибутів томів.

    - **scopeSelector.matchExpressions.values** ([]string)

      *Atomic: буде замінено під час злиття*

      Масив рядкових значень. Якщо оператор In або NotIn, масив значень не повинен бути порожнім. Якщо оператор Exists або DoesNotExist, масив значень повинен бути порожнім. Цей масив замінюється під час стратегії обʼєднання патчів.

- **scopes** ([]string)

  *Atomic: буде замінено під час злиття*

  Набір фільтрів, які повинні відповідати кожному обʼєкту, відстежуваному квотою. Якщо не вказано, квота відповідає всім обʼєктам.

## ResourceQuotaStatus {#ResourceQuotaStatus}

ResourceQuotaStatus визначає застосовані жорсткі обмеження та спостережуване використання.

---

- **hard** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Hard — це набір застосованих жорстких обмежень для кожного названого ресурсу. Докладніше: [https://kubernetes.io/docs/concepts/policy/resource-quotas/](/docs/concepts/policy/resource-quotas/)

- **used** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Used — це поточне спостережуване загальне використання ресурсу в просторі імен.

## ResourceQuotaList {#ResourceQuotaList}

ResourceQuotaList — це список елементів ResourceQuota.

---

- **apiVersion**: v1

- **kind**: ResourceQuotaList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>), обовʼязково

  Items — це список обʼєктів ResourceQuota. Докладніше: [https://kubernetes.io/docs/concepts/policy/resource-quotas/](/docs/concepts/policy/resource-quotas/)

## Операції {#operations}

---

### `get` отримати вказану ResourceQuota {#get-read-the-specified-resourcequota}

#### HTTP запит {#http-request}

GET /api/v1/namespaces/{namespace}/resourcequotas/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceQuota

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

401: Unauthorized

### `get` отримати статус вказаної ResourceQuota {#get-read-status-of-the-specified-resourcequota}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceQuota

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourceQuota {#list-list-or-watch-objects-of-kind-resourcequota}

#### HTTP запит {#http-request-2}

GET /api/v1/namespaces/{namespace}/resourcequotas

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

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaList" >}}">ResourceQuotaList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourceQuota {#list-list-or-watch-objects-of-kind-resourcequota-1}

#### HTTP запит {#http-request-3}

GET /api/v1/resourcequotas

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

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaList" >}}">ResourceQuotaList</a>): OK

401: Unauthorized

### `create` створення ResourceQuota {#create-create-a-resourcequota}

#### HTTP запит {#http-request-4}

POST /api/v1/namespaces/{namespace}/resourcequotas

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

202 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Accepted

401: Unauthorized

### `update` заміна вказаної ResourceQuota {#update-replace-the-specified-resourcequota}

#### HTTP запит {#http-request-5}

PUT /api/v1/namespaces/{namespace}/resourcequotas/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceQuota

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized

### `update` заміна статусу вказаної ResourceQuota {#update-replace-status-of-the-specified-resourcequota}

#### HTTP запит {#http-request-6}

PUT /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceQuota

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної ResourceQuota {#patch-partially-update-the-specified-resourcequota}

#### HTTP запит {#http-request-7}

PATCH /api/v1/namespaces/{namespace}/resourcequotas/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceQuota

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

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаної ResourceQuota {#patch-partially-update-status-of-the-specified-resourcequota}

#### HTTP запит {#http-request-8}

PATCH /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceQuota

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

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized

### `delete` видалення ResourceQuota {#delete-delete-a-resourcequota}

#### HTTP запит {#http-request-9}

DELETE /api/v1/namespaces/{namespace}/resourcequotas/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  імʼя ResourceQuota

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

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

202 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ResourceQuota {#deletecollection-delete-collection-of-resourcequotas}

#### HTTP запит {#http-request-10}

DELETE /api/v1/namespaces/{namespace}/resourcequotas

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
