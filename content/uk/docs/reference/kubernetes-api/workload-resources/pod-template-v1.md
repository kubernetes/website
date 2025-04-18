---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PodTemplate"
content_type: "api_reference"
description: "PodTemplate описує шаблон для створення копій наперед визначеного Podʼа."
title: "PodTemplate"
weight: 3
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## PodTemplate {#PodTemplate}

PodTemplate описує шаблон для створення копій наперед визначеного Podʼа.

---

- **apiVersion**: v1

- **kind**: PodTemplate

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Метадані стандартного обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  Template — визначає Podʼи, які будуть створені з цього шаблону. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodTemplateList {#PodTemplateList}

PodTemplateList — список PodTemplate.

---

- **apiVersion**: v1

- **kind**: PodTemplateList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Метадані стандартного списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>), обовʼязково

  Список шаблонів Pod.

## Операції {#operations}

---

### `get` прочитати вказаний PodTemplate {#get-read-the-specified-podtemplate}

#### HTTP-запит {#http-request}

GET /api/v1/namespaces/{namespace}/podtemplates/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodTemplate

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodTemplate {#list-list-or-watch-objects-of-kind-podtemplate}

#### HTTP-запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/podtemplates

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

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateList" >}}">PodTemplateList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodTemplate {#list-list-or-watch-objects-of-kind-podtemplate-1}

#### HTTP-запит {#http-request-2}

GET /api/v1/podtemplates

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

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateList" >}}">PodTemplateList</a>): OK

401: Unauthorized

### `create` створення PodTemplate {#create-create-a-podtemplate}

#### HTTP-запит {#http-request-3}

POST /api/v1/namespaces/{namespace}/podtemplates

#### Параметри {#parameters-3}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Accepted

401: Unauthorized

### `update` замінити вказаний PodTemplate {#update-replace-the-specified-podtemplate}

#### HTTP-запит {#http-request-4}

PUT /api/v1/namespaces/{namespace}/podtemplates/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodTemplate

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

401: Unauthorized

### `patch` частково оновити вказаний PodTemplate {#patch-partially-update-the-specified-podtemplate}

#### HTTP-запит {#http-request-5}

PATCH /api/v1/namespaces/{namespace}/podtemplates/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodTemplate

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

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

401: Unauthorized

### `delete` видалити PodTemplate {#delete-delete-a-podtemplate}

#### HTTP-запит {#http-request-6}

DELETE /api/v1/namespaces/{namespace}/podtemplates/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodTemplate

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

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Accepted

401: Unauthorized

### `deletecollection` видалити колекцію PodTemplate {#deletecollection-delete-collection-of-podtemplate}

#### HTTP-запит {#http-request-7}

DELETE /api/v1/namespaces/{namespace}/podtemplates

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
