---
api_metadata:
  apiVersion: "rbac.authorization.k8s.io/v1"
  import: "k8s.io/api/rbac/v1"
  kind: "Role"
content_type: "api_reference"
description: "Role 是一个按命名空间划分的 PolicyRule 逻辑分组，可以被 RoleBinding 作为一个单元引用。"
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
Role 是一个按命名空间划分的 PolicyRule 逻辑分组，可以被 RoleBinding 作为一个单元引用。

<hr>

- **apiVersion**: rbac.authorization.k8s.io/v1

- **kind**: Role

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。
<!--
Standard object's metadata.

- **rules** ([]PolicyRule)
  Rules holds all the PolicyRules for this Role

  <a name="PolicyRule"></a>
  *PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to.*

  - **rules.apiGroups** ([]string)
    APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed. "" represents the core API group and "*" represents all API groups.

  - **rules.resources** ([]string)
    Resources is a list of resources this rule applies to. '*' represents all resources.

  - **rules.verbs** ([]string), required
    Verbs is a list of Verbs that apply to ALL the ResourceKinds contained in this rule. '*' represents all verbs.

  - **rules.resourceNames** ([]string)
    ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.

  - **rules.nonResourceURLs** ([]string)
    NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path Since non-resource URLs are not namespaced, this field is only applicable for ClusterRoles referenced from a ClusterRoleBinding. Rules can either apply to API resources (such as "pods" or "secrets") or non-resource URL paths (such as "/api"),  but not both.
-->  

- **rules** ([]PolicyRule)
  
  rules 包含了这个 Role 的所有 PolicyRule。
  
  <a name="PolicyRule"></a>
  **PolicyRule 包含描述一个策略规则的信息，但不包含该规则适用于哪个主体或适用于哪个命名空间的信息。**
  
  - **rules.apiGroups** ([]string)
    
    apiGroups 是包含资源的 apiGroup 的名称。
    如果指定了多个 API 组，则允许对任何 API 组中的其中一个枚举资源来请求任何操作。
    "" 表示核心 API 组，“*” 表示所有 API 组。
  
  - **rules.resources** ([]string)
    
    resources 是此规则所适用的资源的列表。
    “*” 表示所有资源。

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

  标准的对象元数据。

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

### `get` 读取指定的 Role

#### HTTP 请求

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
#### 参数

- **name**（**路径参数**）：string，必需
  
  Role 的名称

- **namespace**（**路径参数**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查询参数**）：string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Role
#### HTTP Request
-->
### `list` 列出或观测类别为 Role 的对象

#### HTTP 请求

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
#### 参数

- **namespace**（**路径参数**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

200 (<a href="{{< ref "../authorization-resources/role-v1#RoleList" >}}">RoleList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Role
#### HTTP Request
-->
### `list` 列出或观测类别为 Role 的对象

#### HTTP 请求

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

200 (<a href="{{< ref "../authorization-resources/role-v1#RoleList" >}}">RoleList</a>): OK

401: Unauthorized

<!--
### `create` create a Role
#### HTTP Request
-->
### `create` 创建 Role

#### HTTP 请求

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
#### 参数

- **namespace**（**路径参数**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): Created

202 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Role
#### HTTP Request
-->
### `update` 替换指定的 Role

#### HTTP 请求

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
#### 参数

- **name**（**路径参数**）：string，必需
  
  Role 的名称

- **namespace**（**路径参数**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Role
#### HTTP Request
-->
### `patch` 部分更新指定的 Role

#### HTTP 请求

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
#### 参数

- **name**（**路径参数**）：string，必需
  
  Role 的名称

- **namespace**（**路径参数**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): OK

201 (<a href="{{< ref "../authorization-resources/role-v1#Role" >}}">Role</a>): Created

401: Unauthorized

<!--
### `delete` delete a Role
#### HTTP Request
-->
### `delete` 删除 Role

#### HTTP 请求

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
- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
- **propagationPolicy** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 参数

- **name**（**路径参数**）：string，必需
  
  Role 的名称

- **namespace**（**路径参数**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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
### `deletecollection` delete collection of Role
#### HTTP Request
-->
### `deletecollection` 删除 Role 的集合

#### HTTP 请求

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
#### 参数

- **namespace**（**路径参数**）：string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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
