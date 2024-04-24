---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "ClusterRole"
content_type: "api_reference"
description: "ClusterRole 是一个集群级别的 PolicyRule 逻辑分组，可以被 RoleBinding 或 ClusterRoleBinding 作为一个单元引用。"  
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

ClusterRole 是一个集群级别的 PolicyRule 逻辑分组，
可以被 RoleBinding 或 ClusterRoleBinding 作为一个单元引用。

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
    ClusterRoleSelectors holds a list of selectors which will be used to find ClusterRoles and create the rules. If any of the selectors match, then the ClusterRole's permissions will be added
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。

- **aggregationRule** (AggregationRule)
  
  aggregationRule 是一个可选字段，用于描述如何构建这个 ClusterRole 的 rules。
  如果设置了 aggregationRule，则 rules 将由控制器管理，对 rules 的直接变更会被该控制器阻止。
  
  <a name="AggregationRule"></a>
  **aggregationRule 描述如何定位并聚合其它 ClusterRole 到此 ClusterRole。**
  
  - **aggregationRule.clusterRoleSelectors** ([]<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)
    
    clusterRoleSelectors 包含一个选择器的列表，用于查找 ClusterRole 并创建规则。
    如果发现任何选择器匹配的 ClusterRole，将添加其对应的权限。

<!--
- **rules** ([]PolicyRule)
  Rules holds all the PolicyRules for this ClusterRole

  <a name="PolicyRule"></a>
  *PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to.*

  - **rules.apiGroups** ([]string)
    APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed. "" represents the core API group and "*" represents all API groups.

  - **rules.resources** ([]string)
    Resources is a list of resources this rule applies to. '*' represents all resources.
-->
- **rules** ([]PolicyRule)
  
  rules 包含了这个 ClusterRole 的所有 PolicyRule。
  
  <a name="PolicyRule"></a>
  **PolicyRule 包含描述一个策略规则的信息，但不包含该规则适用于哪个主体或适用于哪个命名空间的信息。**
  
  - **rules.apiGroups** ([]string)
    
    apiGroups 是包含资源的 apiGroup 的名称。
    如果指定了多个 API 组，则允许针对任何 API 组中的其中一个枚举资源来请求任何操作。
    "" 表示核心 API 组，“*” 表示所有 API 组。
  
  - **rules.resources** ([]string)
    
    resources 是此规则所适用的资源的列表。“*” 表示所有资源。

  <!--
  - **rules.verbs** ([]string), required
    Verbs is a list of Verbs that apply to ALL the ResourceKinds contained in this rule. '*' represents all verbs.

  - **rules.resourceNames** ([]string)
    ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.

  - **rules.nonResourceURLs** ([]string)
    NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path Since non-resource URLs are not namespaced, this field is only applicable for ClusterRoles referenced from a ClusterRoleBinding. Rules can either apply to API resources (such as "pods" or "secrets") or non-resource URL paths (such as "/api"),  but not both.
  -->

  - **rules.verbs** ([]string)，必需
    
    verbs 是适用于此规则中所包含的所有 ResourceKinds 的动作。
    “*” 表示所有动作。
  
  - **rules.resourceNames** ([]string)
    
    resourceNames 是此规则所适用的资源名称白名单，可选。
    空集合意味着允许所有资源。
  
  - **rules.nonResourceURLs** ([]string)
    
    nonResourceURLs 是用户应有权访问的一组部分 URL。
    允许使用 “*”，但仅能作为路径中最后一段且必须用于完整的一段，
    因为非资源 URL 没有划分命名空间。
    此字段仅适用于从 ClusterRoleBinding 引用的 ClusterRole。
    rules 可以应用到 API 资源（如 “pod” 或 “secret”）或非资源 URL 路径（如 “/api”），
    但不能同时应用于两者。

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

  标准的对象元数据。

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
### `get` 读取指定的 ClusterRole

#### HTTP 请求

GET /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

<!--
#### Parameters

- **name** (*in path*): string, required
  name of the ClusterRole

- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  ClusterRole 的名称

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ClusterRole
#### HTTP Request
-->
### `list` 列出或观测类别为 ClusterRole 的对象

#### HTTP 请求

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
#### 参数

- **allowWatchBookmarks**（**查询参数**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRoleList" >}}">ClusterRoleList</a>): OK

401: Unauthorized

<!--
### `create` create a ClusterRole
#### HTTP Request
-->
### `create` 创建一个 ClusterRole

#### HTTP 请求

POST /apis/rbac.authorization.k8s.io/v1/clusterroles

<!--
#### Parameters
- **body**: <a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **body**：<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>，必需

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

202 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ClusterRole
#### HTTP Request
-->
### `update` 替换指定的 ClusterRole

#### HTTP 请求

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
#### 参数

- **name**（**路径参数**）：string，必需
  
  ClusterRole 的名称

- **body**：<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>，必需

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ClusterRole
#### HTTP Request
-->
### `patch` 部分更新指定的 ClusterRole

#### HTTP 请求

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
#### 参数

- **name**（**路径参数**）：string，必需
  
  ClusterRole 的名称

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): OK

201 (<a href="{{< ref "../authorization-resources/cluster-role-v1#ClusterRole" >}}">ClusterRole</a>): Created

401: Unauthorized

<!--
### `delete` delete a ClusterRole
#### HTTP Request
-->
### `delete` 删除一个 ClusterRole

#### HTTP 请求

DELETE /apis/rbac.authorization.k8s.io/v1/clusterroles/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ClusterRole
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  ClusterRole 的名称

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ClusterRole
#### HTTP Request
-->
### `deletecollection` 删除 ClusterRole 的集合

#### HTTP 请求

DELETE /apis/rbac.authorization.k8s.io/v1/clusterroles

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 参数

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized