---
api_metadata:
  apiVersion: "resource.k8s.io/v1"
  import: "k8s.io/api/resource/v1"
  kind: "ResourceClaimTemplate"
content_type: "api_reference"
description: "ResourceClaimTemplate використовується для створення обʼєктів ResourceClaim."
title: "ResourceClaimTemplate v1"
weight: 17
auto_generated: true
---

`apiVersion: resource.k8s.io/v1`

`import "k8s.io/api/resource/v1"`

## ResourceClaimTemplate {#ResourceClaimTemplate}

ResourceClaimTemplate використовується для створення обʼєктів ResourceClaim.

Це альфа-тип і вимагає увімкнення функціональної можливості DynamicResourceAllocation.

---

- **apiVersion**: resource.k8s.io/v1

- **kind**: ResourceClaimTemplate

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта.

- **spec** (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplateSpec" >}}">ResourceClaimTemplateSpec</a>), обовʼязково

  Описує ResourceClaim, який буде створений.

  Це поле є незмінним. ResourceClaim буде створено панеллю управління для Pod, коли це буде потрібно, а потім більше не буде оновлюватися.

## ResourceClaimTemplateSpec {#ResourceClaimTemplateSpec}

ResourceClaimTemplateSpec містить метадані та поля для ResourceClaim.

---

- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), обовʼязково

  Специфікація для ResourceClaim. Весь вміст копіюється без змін в ResourceClaim, який створюється з цього шаблону. Ті ж самі поля, що й в ResourceClaim, є дійсними тут.

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  ObjectMeta може містити мітки та анотації, які будуть скопійовані до ResourceClaim при створенні його. Інші поля не дозволені та будуть відхилені під час перевірки на валідність.

## ResourceClaimTemplateList {#ResourceClaimTemplateList}

ResourceClaimTemplateList є колекцією шаблонів заявок.

---

- **apiVersion**: resource.k8s.io/v1

- **kind**: ResourceClaimTemplateList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку.

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>), обовʼязково

  Items — це список шаблонів заявок на ресурси.

## Операції {#operations}

---

### `get` отримати вказаний ResourceClaimTemplate {#get-read-the-specified-resourceclaimtemplate}

#### HTTP запит {#http-request}

GET /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaimtemplates/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the ResourceClaimTemplate

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourceClaimTemplate {#list-or-watch-objects-of-kind-resourceclaimtemplate}

#### HTTP запит {#http-request-1}

GET /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaimtemplates

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplateList" >}}">ResourceClaimTemplateList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourceClaimTemplate {#list-or-watch-objects-of-kind-resourceclaimtemplate-1}

#### HTTP запит {#http-request-2}

GET /apis/resource.k8s.io/v1/resourceclaimtemplates

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplateList" >}}">ResourceClaimTemplateList</a>): OK

401: Unauthorized

### `create` створення ResourceClaimTemplate {#create-create-a-resourceclaimtemplate}

#### HTTP запит {#http-request-3}

POST /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaimtemplates

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ResourceClaimTemplate {#update-replace-the-specified-resourceclaimtemplate}

#### HTTP запит {#http-request-4}

PUT /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaimtemplates/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  name of the ResourceClaimTemplate

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ResourceClaimTemplate {#patch-partially-update-the-specified-resourceclaimtemplate}

#### HTTP запит {#http-request-5}

PATCH /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaimtemplates/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name of the ResourceClaimTemplate

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

401: Unauthorized

### `delete` видалення ResourceClaimTemplate {#delete-delete-a-resourceclaimtemplate}

#### HTTP запит {#http-request-6}

DELETE /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaimtemplates/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  Назва шаблону ResourceClaimTemplate

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-template-v1#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ResourceClaimTemplate {#deletecollection-delete-collection-of-resourceclaimtemplate}

#### HTTP запит {#http-request-7}

DELETE /apis/resource.k8s.io/v1/namespaces/{namespace}/resourceclaimtemplates

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

