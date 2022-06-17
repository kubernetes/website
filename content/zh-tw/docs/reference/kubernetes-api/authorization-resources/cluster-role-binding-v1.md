---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "ClusterRoleBinding"
content_type: "api_reference"
description: "ClusterRoleBinding 引用 ClusterRole，但不包含它。"
title: "ClusterRoleBinding"
weight: 6
auto_generated: false
---
<!-- 
---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "ClusterRoleBinding"
content_type: "api_reference"
description: "ClusterRoleBinding references a ClusterRole, but not contain it."
title: "ClusterRoleBinding"
weight: 6
auto_generated: true
---
-->
<!-- 
`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`
-->
`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`
<!--
## ClusterRoleBinding {#ClusterRoleBinding}
ClusterRoleBinding references a ClusterRole, but not contain it.  It can reference a ClusterRole in the global namespace, and adds who information via Subject.
-->
## ClusterRoleBinding {#ClusterRoleBinding}

ClusterRoleBinding 引用 ClusterRole，但不包含它。
它可以引用全域性名稱空間中的 ClusterRole，並透過 Subject 新增主體資訊。
<!-- 
<hr>
- **apiVersion**: rbac.authorization.k8s.io/v1
- **kind**: ClusterRoleBinding
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard object's metadata.
-->
<hr>

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: ClusterRoleBinding

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準物件的元資料。
<!-- 
- **roleRef** (RoleRef), required
  RoleRef can only reference a ClusterRole in the global namespace. If the RoleRef cannot be resolved, the Authorizer must return an error.
  <a name="RoleRef"></a>
  *RoleRef contains information that points to the role being used*
  - **roleRef.apiGroup** (string), required
    APIGroup is the group for the resource being referenced
  - **roleRef.kind** (string), required
    Kind is the type of resource being referenced
  - **roleRef.name** (string), required
    Name is the name of resource being referenced
-->
- **roleRef** (RoleRef)，必需

  RoleRef 只能引用全域性名稱空間中的 ClusterRole。
  如果無法解析 RoleRef，則 Authorizer 必定返回一個錯誤。
  
  <a name="RoleRef"></a>
  **RoleRef 包含指向正被使用的角色的資訊。**

  - **roleRef.apiGroup** (string)，必需

    apiGroup 是被引用資源的組

  - **roleRef.kind** (string)，必需

    kind 是被引用的資源的類別

  - **roleRef.name** (string)，必需

    name 是被引用的資源的名稱
<!-- 
- **subjects** ([]Subject)
  Subjects holds references to the objects the role applies to.
  <a name="Subject"></a>
  *Subject contains a reference to the object or user identities a role binding applies to.  This can either hold a direct API object reference, or a value for non-objects such as user and group names.*
-->
- **subjects** ([]Subject)

  Subjects 包含角色所適用的物件的引用。
  
  <a name="Subject"></a>
  **Subject 包含對角色繫結所適用的物件或使用者標識的引用。其中可以包含直接 API 物件的引用或非物件（如使用者名稱和組名）的值。**
  <!--
  - **subjects.kind** (string), required
    Kind of object being referenced. Values defined by this API group are "User", "Group", and "ServiceAccount". If the Authorizer does not recognized the kind value, the Authorizer should report an error.
  - **subjects.name** (string), required
    Name of the object being referenced. 
  -->
  - **subjects.kind** (string)，必需

    被引用的物件的類別。這個 API 組定義的值是 `User`、`Group` 和 `ServiceAccount`。
    如果 Authorizer 無法識別類別值，則 Authorizer 應報告一個錯誤。

  - **subjects.name** (string)，必需

    被引用的物件的名稱。
  <!-- 
    - **subjects.apiGroup** (string)
    APIGroup holds the API group of the referenced subject. Defaults to "" for ServiceAccount subjects. Defaults to "rbac.authorization.k8s.io" for User and Group subjects.
  - **subjects.namespace** (string)
    Namespace of the referenced object.  If the object kind is non-namespace, such as "User" or "Group", and this value is not empty the Authorizer should report an error.
  -->
  - **subjects.apiGroup** (string)

    apiGroup 包含被引用主體的 API 組。對於 ServiceAccount 主體預設為 ""。
    對於 User 和 Group 主體，預設為 "rbac.authorization.k8s.io"。

  - **subjects.namespace** (string)

    被引用物件的名稱空間。
    如果物件類別是 "User" 或 "Group" 等非名稱空間作用域的物件且該值不為空，
    則 Authorizer 應報告一個錯誤。
<!-- 
## ClusterRoleBindingList {#ClusterRoleBindingList}
ClusterRoleBindingList is a collection of ClusterRoleBindings
<hr>
- **apiVersion**: rbac.authorization.k8s.io/v1
- **kind**: ClusterRoleBindingList
-->
## ClusterRoleBindingList {#ClusterRoleBindingList}

ClusterRoleBindingList 是 ClusterRoleBinding 的集合。

<hr>

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: ClusterRoleBindingList
<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard object's metadata.
- **items** ([]<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>), required
  Items is a list of ClusterRoleBindings
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的物件元資料。

- **items** ([]<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>)，必需

  items 是 ClusterRoleBindings 的列表。
<!-- 
## Operations {#Operations}
<hr>
-->
## 操作 {#Operations}

<hr>

<!-- 
### `get` read the specified ClusterRoleBinding
#### HTTP Request
-->
### `get` 讀取指定的 ClusterRoleBinding

#### HTTP 請求

GET /apis/rbac.authorization.k8s.io/v1/clusterrolebindings/{name}
<!-- 
#### Parameters
- **name** (*in path*): string, required
  name of the ClusterRoleBinding
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 引數

- **name** (**路徑引數**): string，必需

  ClusterRoleBinding 的名稱

- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
<!-- 
#### Response
200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): OK

401: Unauthorized
<!-- 
### `list` list or watch objects of kind ClusterRoleBinding
#### HTTP Request
-->
### `list` 列出或觀測類別為 ClusterRoleBinding 的物件

#### HTTP 請求

GET /apis/rbac.authorization.k8s.io/v1/clusterrolebindings
<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
- **continue** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
- **fieldSelector** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
- **labelSelector** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
- **limit** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
- **resourceVersion** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
- **resourceVersionMatch** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
- **timeoutSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
- **watch** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 引數

- **allowWatchBookmarks** (**查詢引數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **timeoutSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢引數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
<!-- 
#### Response
200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBindingList" >}}">ClusterRoleBindingList</a>): OK
401: Unauthorized
### `create` create a ClusterRoleBinding
#### HTTP Request
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBindingList" >}}">ClusterRoleBindingList</a>): OK

401: Unauthorized

### `create` 建立 ClusterRoleBinding

#### HTTP 請求

POST /apis/rbac.authorization.k8s.io/v1/clusterrolebindings
<!-- 
#### Parameters
- **body**: <a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>, required
-->
#### 引數

- **body**: <a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>，必需
<!--
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **fieldManager** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
- **fieldValidation** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
<!--
#### Response
200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): OK
201 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): Created
202 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): Accepted
401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): Created

202 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): Accepted

401: Unauthorized
<!--
### `update` replace the specified ClusterRoleBinding
#### HTTP Request
#### Parameters
- **name** (*in path*): string, required
  name of the ClusterRoleBinding
- **body**: <a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>, required
-->
### `update` 替換指定的 ClusterRoleBinding

#### HTTP 請求

PUT /apis/rbac.authorization.k8s.io/v1/clusterrolebindings/{name}

#### 引數

- **name** (**路徑引數**): string，必需

  ClusterRoleBinding 的名稱

- **body**: <a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>，必需
<!--
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **fieldManager** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
- **fieldValidation** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
<!--
#### Response
200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): Created

401: Unauthorized
<!--
### `patch` partially update the specified ClusterRoleBinding
#### HTTP Request
#### Parameters
- **name** (*in path*): string, required
  name of the ClusterRoleBinding
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
### `patch` 部分更新指定的 ClusterRoleBinding

#### HTTP 請求

PATCH /apis/rbac.authorization.k8s.io/v1/clusterrolebindings/{name}

#### 引數

- **name** (**路徑引數**): string，必需

  ClusterRoleBinding 的名稱

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需
<!--
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **fieldManager** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
- **fieldValidation** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
- **force** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢引數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
<!--
#### Response
200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): OK
201 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-binding-v1#ClusterRoleBinding" >}}">ClusterRoleBinding</a>): Created

401: Unauthorized
<!--
### `delete` delete a ClusterRoleBinding
#### HTTP Request
#### Parameters
- **name** (*in path*): string, required
  name of the ClusterRoleBinding
-->
### `delete` 刪除 ClusterRoleBinding

#### HTTP 請求

DELETE /apis/rbac.authorization.k8s.io/v1/clusterrolebindings/{name}

#### 引數

- **name** (**路徑引數**): string，必需

  ClusterRoleBinding 的名稱
<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **gracePeriodSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
- **propagationPolicy** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
<!--
#### Response
200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK
202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted
401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
<!--
### `deletecollection` delete collection of ClusterRoleBinding
#### HTTP Request
-->
### `deletecollection` 刪除 ClusterRoleBinding 的集合

#### HTTP 請求

DELETE /apis/rbac.authorization.k8s.io/v1/clusterrolebindings
<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **fieldSelector** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
- **gracePeriodSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
- **labelSelector** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
- **limit** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
- **propagationPolicy** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
- **resourceVersion** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
- **resourceVersionMatch** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
- **timeoutSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 引數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **timeoutSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
<!--
#### Response
200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK
401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
