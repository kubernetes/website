---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "Role"
content_type: "api_reference"
description: "Role 是一個按命名空間劃分的 PolicyRule 邏輯分組，可以被 RoleBinding 作爲一個單元引用。"
title: "Role"
weight: 7
---
<!--
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "Role"
content_type: "api_reference"
description: "Role is a namespaced, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding."
title: "Role"
weight: 7
auto_generated: true
-->

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`

## Role {#Role}

<!--
Role is a namespaced, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding.
-->
Role 是一個按命名空間劃分的 PolicyRule 邏輯分組，可以被 RoleBinding 作爲一個單元引用。

<hr>

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: Role

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata.
  -->

  標準的對象元資料。

<!--
- **rules** ([]PolicyRule)

  *Atomic: will be replaced during a merge*

  Rules holds all the PolicyRules for this Role

  <a name="PolicyRule"></a>
  *PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to.*

  - **rules.apiGroups** ([]string)

    *Atomic: will be replaced during a merge*

    APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed. "" represents the core API group and "*" represents all API groups.

  - **rules.resources** ([]string)

    *Atomic: will be replaced during a merge*

    Resources is a list of resources this rule applies to. '*' represents all resources.

  - **rules.verbs** ([]string), required

    *Atomic: will be replaced during a merge*

    Verbs is a list of Verbs that apply to ALL the ResourceKinds contained in this rule. '*' represents all verbs.

  - **rules.resourceNames** ([]string)

    *Atomic: will be replaced during a merge*

    ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.

  - **rules.nonResourceURLs** ([]string)

    *Atomic: will be replaced during a merge*

    NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path Since non-resource URLs are not namespaced, this field is only applicable for ClusterRoles referenced from a ClusterRoleBinding. Rules can either apply to API resources (such as "pods" or "secrets") or non-resource URL paths (such as "/api"),  but not both.
-->  

- **rules** ([]PolicyRule)

  **原子：將在合併期間被替換**

  rules 包含了這個 Role 的所有 PolicyRule。

  <a name="PolicyRule"></a>
  **PolicyRule 包含描述一個策略規則的資訊，但不包含該規則適用於哪個主體或適用於哪個命名空間的資訊。**

  - **rules.apiGroups** ([]string)

    **原子：將在合併期間被替換**
  
    apiGroups 是包含資源的 apiGroup 的名稱。
    如果指定了多個 API 組，則允許對任何 API 組中的其中一個枚舉資源來請求任何操作。
    "" 表示核心 API 組，“*” 表示所有 API 組。
  
  - **rules.resources** ([]string)

    **原子：將在合併期間被替換**

    resources 是此規則所適用的資源的列表。
    “*” 表示所有資源。

  - **rules.verbs** ([]string)，必需

    **原子：將在合併期間被替換**

    verbs 是適用於此規則中所包含的所有 ResourceKinds 的動作。
    “*” 表示所有動作。
  
  - **rules.resourceNames** ([]string)

    **原子：將在合併期間被替換**
  
    resourceNames 是此規則所適用的資源名稱白名單，可選。
    空集合意味着允許所有資源。
  
  - **rules.nonResourceURLs** ([]string)

    **原子：將在合併期間被替換**
  
    nonResourceURLs 是使用者應有權訪問的一組部分 URL。
    允許使用 “*”，但僅能作爲路徑中最後一段且必須用於完整的一段，
    因爲非資源 URL 沒有劃分命名空間。
    此字段僅適用於從 ClusterRoleBinding 引用的 ClusterRole。
    rules 可以應用到 API 資源（如 “pod” 或 “secret”）或非資源 URL 路徑（如 “/api”），
    但不能同時應用於兩者。

## RoleList {#RoleList}

<!--
RoleList is a collection of Roles
-->
RoleList 是 Role 的集合。

<hr>

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: RoleList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata.

- **items** ([]<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>), required

  Items is a list of Roles
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的對象元資料。

- **items** ([]<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>)，必需
  
  items 是 Role 的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified Role
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 Role

#### HTTP 請求

GET /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/roles/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Role

- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  Role 的名稱

- **namespace**（**路徑參數**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Role
#### HTTP Request
-->
### `list` 列出或觀測類別爲 Role 的對象

#### HTTP 請求

GET /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/roles

<!--
#### Parameters
- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
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
- **sendInitialEvents** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
- **timeoutSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
- **watch** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks**（**查詢參數**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/role-v1#RoleList" >}}">RoleList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Role
#### HTTP Request
-->
### `list` 列出或觀測類別爲 Role 的對象

#### HTTP 請求

GET /apis/rbac.authorization.k8s.io/v1/roles

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
- **sendInitialEvents** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
- **timeoutSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
- **watch** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **allowWatchBookmarks**（**查詢參數**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/role-v1#RoleList" >}}">RoleList</a>): OK

401: Unauthorized

<!--
### `create` create a Role
#### HTTP Request
-->
### `create` 創建 Role

#### HTTP 請求

POST /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/roles

<!--
#### Parameters
- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
- **body**: <a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>, required
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **fieldManager** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
- **fieldValidation** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>，必需

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): Created

202 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Role
#### HTTP Request
-->
### `update` 替換指定的 Role

#### HTTP 請求

PUT /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/roles/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Role
- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
- **body**: <a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>, required
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **fieldManager** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
- **fieldValidation** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  Role 的名稱

- **namespace**（**路徑參數**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>，必需

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Role
#### HTTP Request
-->
### `patch` 部分更新指定的 Role

#### HTTP 請求

PATCH /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/roles/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Role
- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
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
#### 參數

- **name**（**路徑參數**）：string，必需
  
  Role 的名稱

- **namespace**（**路徑參數**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查詢參數**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): Created

401: Unauthorized

<!--
### `delete` delete a Role
#### HTTP Request
-->
### `delete` 刪除 Role

#### HTTP 請求

DELETE /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/roles/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Role
- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **gracePeriodSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
- **propagationPolicy** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  Role 的名稱

- **namespace**（**路徑參數**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Role
#### HTTP Request
-->
### `deletecollection` 刪除 Role 的集合

#### HTTP 請求

DELETE /apis/rbac.authorization.k8s.io/v1/namespaces/{namespace}/roles

<!--
#### Parameters
- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
- **fieldSelector** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
- **gracePeriodSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
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
- **sendInitialEvents** (*in query*): boolean
  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
- **timeoutSeconds** (*in query*): integer
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds**（**查詢參數**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
