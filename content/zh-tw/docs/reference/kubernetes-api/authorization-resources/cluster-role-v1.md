---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "ClusterRole"
content_type: "api_reference"
description: "ClusterRole 是一個叢集級別的 PolicyRule 邏輯分組，可以被 RoleBinding 或 ClusterRoleBinding 作爲一個單元引用。"  
title: "ClusterRole" 
weight: 5  
---
<!--
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "ClusterRole"
content_type: "api_reference"
description: "ClusterRole is a cluster level, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding or ClusterRoleBinding."
title: "ClusterRole"
weight: 5
auto_generated: true
-->

`apiVersion: rbac.authorization.k8s.io/v1`

`import "k8s.io/api/rbac/v1"`

<!-- 
## ClusterRole {#ClusterRole}
ClusterRole is a cluster level, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding or ClusterRoleBinding.
<hr>
-->
## ClusterRole {#ClusterRole}

ClusterRole 是一個叢集級別的 PolicyRule 邏輯分組，
可以被 RoleBinding 或 ClusterRoleBinding 作爲一個單元引用。

<hr>

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: ClusterRole

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard object's metadata.
- **aggregationRule** (AggregationRule)
  AggregationRule is an optional field that describes how to build the Rules for this ClusterRole. If AggregationRule is set, then the Rules are controller managed and direct changes to Rules will be stomped by the controller.
  <a name="AggregationRule"></a>
  *AggregationRule describes how to locate ClusterRoles to aggregate into the ClusterRole*
  - **aggregationRule.clusterRoleSelectors** ([]<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)
    *Atomic: will be replaced during a merge*
    ClusterRoleSelectors holds a list of selectors which will be used to find ClusterRoles and create the rules. If any of the selectors match, then the ClusterRole's permissions will be added
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。

- **aggregationRule** (AggregationRule)
  
  aggregationRule 是一個可選字段，用於描述如何構建這個 ClusterRole 的 rules。
  如果設置了 aggregationRule，則 rules 將由控制器管理，對 rules 的直接變更會被該控制器阻止。
  
  <a name="AggregationRule"></a>
  **aggregationRule 描述如何定位並聚合其它 ClusterRole 到此 ClusterRole。**
  
  - **aggregationRule.clusterRoleSelectors** ([]<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    **原子：將在合併期間被替換**
  
    clusterRoleSelectors 包含一個選擇器的列表，用於查找 ClusterRole 並創建規則。
    如果發現任何選擇器匹配的 ClusterRole，將添加其對應的權限。

<!--
- **rules** ([]PolicyRule)

  *Atomic: will be replaced during a merge*

  Rules holds all the PolicyRules for this ClusterRole

  <a name="PolicyRule"></a>
  *PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to.*

  - **rules.apiGroups** ([]string)

    *Atomic: will be replaced during a merge*

    APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed. "" represents the core API group and "*" represents all API groups.

  - **rules.resources** ([]string)

    *Atomic: will be replaced during a merge*

    Resources is a list of resources this rule applies to. '*' represents all resources.
-->
- **rules** ([]PolicyRule)

  **原子：將在合併期間被替換**

  rules 包含了這個 ClusterRole 的所有 PolicyRule。
  
  <a name="PolicyRule"></a>
  **PolicyRule 包含描述一個策略規則的信息，但不包含該規則適用於哪個主體或適用於哪個命名空間的信息。**
  
  - **rules.apiGroups** ([]string)

    **原子：將在合併期間被替換**

    apiGroups 是包含資源的 apiGroup 的名稱。
    如果指定了多個 API 組，則允許針對任何 API 組中的其中一個枚舉資源來請求任何操作。
    "" 表示核心 API 組，“*” 表示所有 API 組。
  
  - **rules.resources** ([]string)

    **原子：將在合併期間被替換**

    resources 是此規則所適用的資源的列表。“*” 表示所有資源。

  <!--
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

<!-- 
## ClusterRoleList {#ClusterRoleList}

ClusterRoleList is a collection of ClusterRoles
-->
## ClusterRoleList {#ClusterRoleList}

ClusterRoleList 是 ClusterRole 的集合。

<hr>

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: ClusterRoleList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata.

- **items** ([]<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>), required

  Items is a list of ClusterRoles
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的對象元數據。

- **items** ([]<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>)，必需
  
  items 是 ClusterRole 的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified ClusterRole
#### HTTP Request
-->
### `get` 讀取指定的 ClusterRole

#### HTTP 請求

GET /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required
  name of the ClusterRole

- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  ClusterRole 的名稱

- **pretty**（**查詢參數**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ClusterRole
#### HTTP Request
-->
### `list` 列出或觀測類別爲 ClusterRole 的對象

#### HTTP 請求

GET /apis/rbac.authorization.k8s.io/v1/clusterroles

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
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

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRoleList" >}}">ClusterRoleList</a>): OK

401: Unauthorized

<!--
### `create` create a ClusterRole
#### HTTP Request
-->
### `create` 創建一個 ClusterRole

#### HTTP 請求

POST /apis/rbac.authorization.k8s.io/v1/clusterroles

<!--
#### Parameters
- **body**: <a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **body**：<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

202 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ClusterRole
#### HTTP Request
-->
### `update` 替換指定的 ClusterRole

#### HTTP 請求

PUT /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ClusterRole
- **body**: <a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  ClusterRole 的名稱

- **body**：<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ClusterRole
#### HTTP Request
-->
### `patch` 部分更新指定的 ClusterRole

#### HTTP 請求

PATCH /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ClusterRole
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  ClusterRole 的名稱

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

401: Unauthorized

<!--
### `delete` delete a ClusterRole
#### HTTP Request
-->
### `delete` 刪除一個 ClusterRole

#### HTTP 請求

DELETE /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ClusterRole
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name**（**路徑參數**）：string，必需
  
  ClusterRole 的名稱

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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
### `deletecollection` delete collection of ClusterRole
#### HTTP Request
-->
### `deletecollection` 刪除 ClusterRole 的集合

#### HTTP 請求

DELETE /apis/rbac.authorization.k8s.io/v1/clusterroles

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 參數

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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
