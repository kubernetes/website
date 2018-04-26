---
assignees:
- erictune
- deads2k
- liggitt
title: Using RBAC Authorization
---

* TOC
{:toc}

<!--Role-Based Access Control ("RBAC") uses the "rbac.authorization.k8s.io" API group 
to drive authorization decisions, allowing admins to dynamically configure policies
through the Kubernetes API.-->
基于角色的访问控制（Role-Based Access Control, 即"RBAC"）使用"rbac.authorization.k8s.io"
API Group实现授权决策，允许管理员通过Kubernetes API动态配置策略。

<!--As of 1.6 RBAC mode is in beta.-->
截至Kubernetes 1.6，RBAC模式处于beta版本。

<!--To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.-->
要启用RBAC，请使用`--authorization-mode=RBAC`启动API Server。

<!--## API Overview-->
## API概述

<!--The RBAC API declares four top-level types which will be covered in this
section. Users can interact with these resources as they would with any other
API resource (via `kubectl`, API calls, etc.). For instance,
`kubectl create -f (resource).yml` can be used with any of these examples,
though readers who wish to follow along should review the section on
bootstrapping first.-->
本节将介绍RBAC API所定义的四种顶级类型。用户可以像使用其他Kubernetes API资源一样
（例如通过`kubectl`、API调用等）与这些资源进行交互。例如，命令`kubectl create -f (resource).yml`
可以被用于以下所有的例子，当然，读者在尝试前可能需要先阅读以下相关章节的内容。

<!--### Role and ClusterRole-->
### Role与ClusterRole

<!--In the RBAC API, a role contains rules that represent a set of permissions.
Permissions are purely additive (there are no "deny" rules).
A role can be defined within a namespace with a `Role`, or cluster-wide with a `ClusterRole`.-->
在RBAC API中，一个角色包含了一套表示一组权限的规则。
权限以纯粹的累加形式累积（没有"否定"的规则）。
角色可以由名字空间（namespace）内的`Role`对象定义，而整个Kubernetes集群范围内有效的角色则通过`ClusterRole`对象实现。

<!--A `Role` can only be used to grant access to resources within a single namespace.
Here's an example `Role` in the "default" namespace that can be used to grant read access to pods:-->
一个`Role`对象只能用于授予对某一单一名字空间中资源的访问权限。
以下示例描述了"default"名字空间中的一个`Role`对象的定义，用于授予对pod的读访问权限：

<!--```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```-->
```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # 空字符串""表明使用core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

<!--A `ClusterRole` can be used to grant the same permissions as a `Role`,
but because they are cluster-scoped, they can also be used to grant access to:-->
`ClusterRole`对象可以授予与`Role`对象相同的权限，但由于它们属于集群范围对象，
也可以使用它们授予对以下几种资源的访问权限：

<!--* cluster-scoped resources (like nodes)
* non-resource endpoints (like "/healthz")
* namespaced resources (like pods) across all namespaces (needed to run `kubectl get pods --all-namespaces`, for example)-->
* 集群范围资源（例如节点，即node）
* 非资源类型endpoint（例如"/healthz"）
* 跨所有名字空间的名字空间范围资源（例如pod，需要运行命令`kubectl get pods --all-namespaces`来查询集群中所有的pod）

<!--The following `ClusterRole` can be used to grant read access to secrets in any particular namespace,
or across all namespaces (depending on how it is [bound](#rolebinding-and-clusterrolebinding)):-->
下面示例中的`ClusterRole`定义可用于授予用户对某一特定名字空间，或者所有名字空间中的secret（取决于其[绑定](#rolebinding-and-clusterrolebinding)方式）的读访问权限：

<!--```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```-->
```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  # 鉴于ClusterRole是集群范围对象，所以这里不需要定义"namespace"字段
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

<!--### RoleBinding and ClusterRoleBinding-->
### RoleBinding与ClusterRoleBinding

<!--A role binding grants the permissions defined in a role to a user or set of users.
It holds a list of subjects (users, groups, or service accounts), and a reference to the role being granted.
Permissions can be granted within a namespace with a `RoleBinding`, or cluster-wide with a `ClusterRoleBinding`.-->
角色绑定将一个角色中定义的各种权限授予一个或者一组用户。
角色绑定包含了一组相关主体（即subject, 包括用户——User、用户组——Group、或者服务账户——Service Account）以及对被授予角色的引用。
在名字空间中可以通过`RoleBinding`对象授予权限，而集群范围的权限授予则通过`ClusterRoleBinding`对象完成。


<!--A `RoleBinding` may reference a `Role` in the same namespace.
The following `RoleBinding` grants the "pod-reader" role to the user "jane" within the "default" namespace.
This allows "jane" to read pods in the "default" namespace.-->
`RoleBinding`可以引用在同一名字空间内定义的`Role`对象。
下面示例中定义的`RoleBinding`对象在"default"名字空间中将"pod-reader"角色授予用户"jane"。
这一授权将允许用户"jane"从"default"名字空间中读取pod。

<!--```yaml
# This role binding allows "jane" to read pods in the "default" namespace.
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```-->
```yaml
# 以下角色绑定定义将允许用户"jane"从"default"名字空间中读取pod。
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

<!--A `RoleBinding` may also reference a `ClusterRole` to grant the permissions to namespaced
resources defined in the `ClusterRole` within the `RoleBinding`'s namespace.
This allows administrators to define a set of common roles for the entire cluster,
then reuse them within multiple namespaces.-->
`RoleBinding`对象也可以引用一个`ClusterRole`对象用于在`RoleBinding`所在的名字空间内授予用户对所引用的`ClusterRole`中
定义的名字空间资源的访问权限。这一点允许管理员在整个集群范围内首先定义一组通用的角色，然后再在不同的名字空间中复用这些角色。

<!--For instance, even though the following `RoleBinding` refers to a `ClusterRole`,
"dave" (the subject) will only be able read secrets in the "development"
namespace (the namespace of the `RoleBinding`).-->
例如，尽管下面示例中的`RoleBinding`引用的是一个`ClusterRole`对象，但是用户"dave"（即角色绑定主体）还是只能读取"development"
名字空间中的secret（即`RoleBinding`所在的名字空间）。

<!--```yaml
# This role binding allows "dave" to read secrets in the "development" namespace.
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: read-secrets
  namespace: development # This only grants permissions within the "development" namespace.
subjects:
- kind: User
  name: dave
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```-->
```yaml
# 以下角色绑定允许用户"dave"读取"development"名字空间中的secret。
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: read-secrets
  namespace: development # 这里表明仅授权读取"development"名字空间中的资源。
subjects:
- kind: User
  name: dave
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

<!--Finally, a `ClusterRoleBinding` may be used to grant permission at the cluster level and in all
namespaces. The following `ClusterRoleBinding` allows any user in the group "manager" to read 
secrets in any namespace.-->
最后，可以使用`ClusterRoleBinding`在集群级别和所有名字空间中授予权限。下面示例中所定义的`ClusterRoleBinding`
允许在用户组"manager"中的任何用户都可以读取集群中任何名字空间中的secret。

<!--```yaml
# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```-->
```yaml
# 以下`ClusterRoleBinding`对象允许在用户组"manager"中的任何用户都可以读取集群中任何名字空间中的secret。
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

<!--### Referring to Resources-->
### 对资源的引用

<!--Most resources are represented by a string representation of their name, such as "pods", just as it
appears in the URL for the relevant API endpoint. However, some Kubernetes APIs involve a
"subresource", such as the logs for a pod. The URL for the pods logs endpoint is:-->
大多数资源由代表其名字的字符串表示，例如"pods"，就像它们出现在相关API endpoint的URL中一样。然而，有一些Kubernetes API还
包含了"子资源"，比如pod的logs。在Kubernetes中，pod logs endpoint的URL格式为：

```
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

<!--In this case, "pods" is the namespaced resource, and "log" is a subresource of pods. To represent
this in an RBAC role, use a slash to delimit the resource and subresource. To allow a subject
to read both pods and pod logs, you would write:-->
在这种情况下，"pods"是名字空间资源，而"log"是pods的子资源。为了在RBAC角色中表示出这一点，我们需要使用斜线来划分资源
与子资源。如果需要角色绑定主体读取pods以及pod log，您需要定义以下角色：

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

<!--Resources can also be referred to by name for certain requests through the `resourceNames` list.
When specified, requests using the "get", "delete", "update", and "patch" verbs can be restricted
to individual instances of a resource. To restrict a subject to only "get" and "update" a single
configmap, you would write:-->
通过`resourceNames`列表，角色可以针对不同种类的请求根据资源名引用资源实例。当指定了`resourceNames`列表时，不同动作
种类的请求的权限，如使用"get"、"delete"、"update"以及"patch"等动词的请求，将被限定到资源列表中所包含的资源实例上。
例如，如果需要限定一个角色绑定主体只能"get"或者"update"一个configmap时，您可以定义以下角色：

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  resources: ["configmap"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

<!--Notably, if `resourceNames` are set, then the verb must not be list, watch, create, or deletecollection.
Because resource names are not present in the URL for create, list, watch, and deletecollection API requests,
those verbs would not be allowed by a rule with resourceNames set, since the resourceNames portion of the
rule would not match the request.-->
值得注意的是，如果设置了`resourceNames`，则请求所使用的动词不能是list、watch、create或者deletecollection。
由于资源名不会出现在create、list、watch和deletecollection等API请求的URL中，所以这些请求动词不会被设置了`resourceNames`
的规则所允许，因为规则中的`resourceNames`部分不会匹配这些请求。

<!--#### Role Examples-->
#### 一些角色定义的例子

<!--Only the `rules` section is shown in the following examples.-->
在以下示例中，我们仅截取展示了`rules`部分的定义。

<!--Allow reading the resource "pods" in the core API group:-->
允许读取core API Group中定义的资源"pods"：

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

<!--Allow reading/writing "deployments" in both the "extensions" and "apps" API groups:-->
允许读写在"extensions"和"apps" API Group中定义的"deployments"：

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

<!--Allow reading "pods" and reading/writing "jobs":-->
允许读取"pods"以及读写"jobs"：

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch", "extensions"]
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

<!--Allow reading a `ConfigMap` named "my-config" (must be bound with a `RoleBinding` to limit to a single `ConfigMap` in a single namespace):-->
允许读取一个名为"my-config"的`ConfigMap`实例（需要将其通过`RoleBinding`绑定从而限制针对某一个名字空间中定义的一个`ConfigMap`实例的访问）：

```yaml
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

<!--Allow reading the resource "nodes" in the core group (because a `Node` is cluster-scoped, this must be in a `ClusterRole` bound with a `ClusterRoleBinding` to be effective):-->
允许读取core API Group中的"nodes"资源（由于`Node`是集群级别资源，所以此`ClusterRole`定义需要与一个`ClusterRoleBinding`绑定才能有效）：

```yaml
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

<!--Allow "GET" and "POST" requests to the non-resource endpoint "/healthz" and all subpaths (must be in a `ClusterRole` bound with a `ClusterRoleBinding` to be effective):-->
允许对非资源endpoint "/healthz"及其所有子路径的"GET"和"POST"请求（此`ClusterRole`定义需要与一个`ClusterRoleBinding`绑定才能有效）：

<!--```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' in a nonResourceURL is a suffix glob match
  verbs: ["get", "post"]
```-->
```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # 在非资源URL中，'*'代表后缀通配符
  verbs: ["get", "post"]
```

<!--### Referring to Subjects-->
### 对角色绑定主体（Subject）的引用

<!--A `RoleBinding` or `ClusterRoleBinding` binds a role to *subjects*.
Subjects can be groups, users or service accounts.-->
`RoleBinding`或者`ClusterRoleBinding`将角色绑定到*角色绑定主体*（Subject）。
角色绑定主体可以是用户组（Group）、用户（User）或者服务账户（Service Accounts）。

<!--Users are represented by strings.  These can be plain usernames, like
"alice", email-style names, like "bob@example.com", or numeric ids
represented as a string.  It is up to the Kubernetes admin to configure
the [authentication modules](/docs/admin/authentication/) to produce
usernames in the desired format.  The RBAC authorization system does
not require any particular format.  However, the prefix `system:` is
reserved for Kubernetes system use, and so the admin should ensure
usernames do not contain this prefix by accident.-->
用户由字符串表示。可以是纯粹的用户名，例如"alice"、电子邮件风格的名字，如 "bob@example.com"
或者是用字符串表示的数字id。由Kubernetes管理员配置[认证模块](/docs/admin/authentication/)
以产生所需格式的用户名。对于用户名，RBAC授权系统不要求任何特定的格式。然而，前缀`system:`是
为Kubernetes系统使用而保留的，所以管理员应该确保用户名不会意外地包含这个前缀。

<!--Group information in Kubernetes is currently provided by the Authenticator
modules. Groups, like users, are represented as strings, and that string 
has no format requirements, other than that the prefix `system:` is reserved.-->
Kubernetes中的用户组信息由授权模块提供。用户组与用户一样由字符串表示。Kubernetes对用户组
字符串没有格式要求，但前缀`system:`同样是被系统保留的。

<!--[Service Accounts](/docs/tasks/configure-pod-container/configure-service-account/) have usernames with the `system:serviceaccount:` prefix and belong
to groups with the `system:serviceaccounts:` prefix.-->
[服务账户](/docs/tasks/configure-pod-container/configure-service-account/)拥有包含
`system:serviceaccount:`前缀的用户名，并属于拥有`system:serviceaccounts:`前缀的用户组。

<!--#### Role Binding Examples-->
#### 角色绑定的一些例子

<!--Only the `subjects` section of a `RoleBinding` is shown in the following examples.-->
以下示例中，仅截取展示了`RoleBinding`的`subjects`字段。

<!--For a user named "alice@example.com":-->
一个名为"alice@example.com"的用户：

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

<!--For a group named "frontend-admins":-->
一个名为"frontend-admins"的用户组：

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

<!--For the default service account in the kube-system namespace:-->
kube-system名字空间中的默认服务账户：

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

<!--For all service accounts in the "qa" namespace:-->
名为"qa"名字空间中的所有服务账户：

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

<!--For all service accounts everywhere:-->
在集群中的所有服务账户：

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

<!--For all authenticated users (version 1.5+):-->
所有认证过的用户（version 1.5+）：

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

<!--For all unauthenticated users (version 1.5+):-->
所有未认证的用户（version 1.5+）：

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

<!--For all users (version 1.5+):-->
所有用户（version 1.5+）：

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

<!--## Default Roles and Role Bindings-->
## 默认角色与默认角色绑定

<!--API servers create a set of default `ClusterRole` and `ClusterRoleBinding` objects.
Many of these are `system:` prefixed, which indicates that the resource is "owned" by the infrastructure.
Modifications to these resources can result in non-functional clusters. One example is the `system:node` ClusterRole.
This role defines permissions for kubelets. If the role is modified, it can prevent kubelets from working.-->
API Server会创建一组默认的`ClusterRole`和`ClusterRoleBinding`对象。
这些默认对象中有许多包含`system:`前缀，表明这些资源由Kubernetes基础组件"拥有"。
对这些资源的修改可能导致非功能性集群（non-functional cluster）。一个例子是`system:node` ClusterRole对象。
这个角色定义了kubelets的权限。如果这个角色被修改，可能会导致kubelets无法正常工作。

<!--All of the default cluster roles and rolebindings are labeled with `kubernetes.io/bootstrapping=rbac-defaults`.-->
所有默认的ClusterRole和ClusterRoleBinding对象都会被标记为`kubernetes.io/bootstrapping=rbac-defaults`。

<!--### Auto-reconciliation-->
### 自动更新

<!--At each start-up, the API server updates default cluster roles with any missing permissions,
and updates default cluster role bindings with any missing subjects.
This allows the cluster to repair accidental modifications,
and to keep roles and rolebindings up-to-date as permissions and subjects change in new releases.-->
每次启动时，API Server都会更新默认ClusterRole所缺乏的各种权限，并更新默认ClusterRoleBinding所缺乏的各个角色绑定主体。
这种自动更新机制允许集群修复一些意外的修改。由于权限和角色绑定主体在新的Kubernetes释出版本中可能变化，这也能够保证角色和角色
绑定始终保持是最新的。

<!--To opt out of this reconciliation, set the `rbac.authorization.kubernetes.io/autoupdate` 
annotation on a default cluster role or rolebinding to `false`.
Be aware that missing default permissions and subjects can result in non-functional clusters.-->
如果需要禁用自动更新，请将默认ClusterRole以及ClusterRoleBinding的`rbac.authorization.kubernetes.io/autoupdate`
设置成为`false`。
请注意，缺乏默认权限和角色绑定主体可能会导致非功能性集群问题。

<!--Auto-reconciliation is enabled in Kubernetes version 1.6+ when the RBAC authorizer is active.-->
自Kubernetes 1.6+起，当集群RBAC授权器（RBAC Authorizer）处于开启状态时，可以启用自动更新功能.

<!--### Discovery Roles-->
### 发现类角色

<!--<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>Allows a user read-only access to basic information about themselves.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>Allows read-only access to API discovery endpoints needed to discover and negotiate an API level.</td>
</tr>
</table>-->
<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>默认ClusterRole</th>
<th>默认ClusterRoleBinding</th>
<th>描述</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>允许用户只读访问有关自己的基本信息。</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>允许只读访问API discovery endpoints, 用于在API级别进行发现和协商。</td>
</tr>
</table>

<!--### User-facing Roles-->
### 面向用户的角色

<!--Some of the default roles are not `system:` prefixed. These are intended to be user-facing roles.
They include super-user roles (`cluster-admin`),
roles intended to be granted cluster-wide using ClusterRoleBindings (`cluster-status`),
and roles intended to be granted within particular namespaces using RoleBindings (`admin`, `edit`, `view`).-->
一些默认角色并不包含`system:`前缀，它们是面向用户的角色。
这些角色包含超级用户角色（`cluster-admin`），即旨在利用ClusterRoleBinding（`cluster-status`）在集群范围内授权的角色，
以及那些使用RoleBinding（`admin`、`edit`和`view`）在特定名字空间中授权的角色。

<!--<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>cluster-admin</b></td>
<td><b>system:masters</b> group</td>
<td>Allows super-user access to perform any action on any resource.
When used in a <b>ClusterRoleBinding</b>, it gives full control over every resource in the cluster and in all namespaces.
When used in a <b>RoleBinding</b>, it gives full control over every resource in the rolebinding's namespace, including the namespace itself.</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>None</td>
<td>Allows admin access, intended to be granted within a namespace using a <b>RoleBinding</b>.
If used in a <b>RoleBinding</b>, allows read/write access to most resources in a namespace,
including the ability to create roles and rolebindings within the namespace.
It does not allow write access to resource quota or to the namespace itself.</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>None</td>
<td>Allows read/write access to most objects in a namespace.
It does not allow viewing or modifying roles or rolebindings.</td>
</tr>
<tr>
<td><b>view</b></td>
<td>None</td>
<td>Allows read-only access to see most objects in a namespace.
It does not allow viewing roles or rolebindings.
It does not allow viewing secrets, since those are escalating.</td>
</tr>
</table>-->
<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>默认ClusterRole</th>
<th>默认ClusterRoleBinding</th>
<th>描述</th>
</tr>
<tr>
<td><b>cluster-admin</b></td>
<td><b>system:masters</b> group</td>
<td>超级用户权限，允许对任何资源执行任何操作。
在<b>ClusterRoleBinding</b>中使用时，可以完全控制集群和所有名字空间中的所有资源。
在<b>RoleBinding</b>中使用时，可以完全控制RoleBinding所在名字空间中的所有资源，包括名字空间自己。</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>None</td>
<td>管理员权限，利用<b>RoleBinding</b>在某一名字空间内部授予。
在<b>RoleBinding</b>中使用时，允许针对名字空间内大部分资源的读写访问，
包括在名字空间内创建角色与角色绑定的能力。
但不允许对资源配额（resource quota）或者名字空间本身的写访问。</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>None</td>
<td>允许对某一个名字空间内大部分对象的读写访问，但不允许查看或者修改角色或者角色绑定。</td>
</tr>
<tr>
<td><b>view</b></td>
<td>None</td>
<td>允许对某一个名字空间内大部分对象的只读访问。
不允许查看角色或者角色绑定。
由于可扩散性等原因，不允许查看secret资源。</td>
</tr>
</table>

### Core Component Roles
### 核心组件角色

<!--<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>Allows access to the resources required by the kube-scheduler component.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> user</td>
<td>Allows access to the resources required by the kube-controller-manager component.
The permissions required by individual control loops are contained in the <a href="#controller-roles">controller roles</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td><b>system:nodes</b> group (deprecated in 1.7)</td>
<td>Allows access to resources required by the kubelet component, <b>including read access to all secrets, and write access to all pods</b>.
As of 1.7, use of the [Node authorizer](/docs/admin/authorization/node/) 
and [NodeRestriction admission plugin](/docs/admin/admission-controllers#NodeRestriction) 
is recommended instead of this role, and allow granting API access to kubelets based on the pods scheduled to run on them.
As of 1.7, when the `Node` authorization mode is enabled, the automatic binding to the `system:nodes` group is not created.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> user</td>
<td>Allows access to the resources required by the kube-proxy component.</td>
</tr>
</table>-->
<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>默认ClusterRole</th>
<th>默认ClusterRoleBinding</th>
<th>描述</th>
</tr>
<tr>
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>允许访问kube-scheduler组件所需要的资源。</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> user</td>
<td>允许访问kube-controller-manager组件所需要的资源。
单个控制循环所需要的权限请参阅<a href="#controller-roles">控制器（controller）角色</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td><b>system:nodes</b> group (deprecated in 1.7)</td>
<td>允许对kubelet组件所需要的资源的访问，<b>包括读取所有secret和对所有pod的写访问</b>。
自Kubernetes 1.7开始, 相比较于这个角色，更推荐使用[Node authorizer](/docs/admin/authorization/node/) 
以及[NodeRestriction admission plugin](/docs/admin/admission-controllers#NodeRestriction)，
并允许根据调度运行在节点上的pod授予kubelets API访问的权限。
自Kubernetes 1.7开始，当启用`Node`授权模式时，对`system:nodes`用户组的绑定将不会被自动创建。
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> user</td>
<td>允许对kube-proxy组件所需要资源的访问。</td>
</tr>
</table>

<!--### Other Component Roles-->
### 其它组件角色

<!--<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:auth-delegator</b></td>
<td>None</td>
<td>Allows delegated authentication and authorization checks.
This is commonly used by add-on API servers for unified authentication and authorization.</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/heapster">Heapster</a> component.</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> component.</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b>kube-dns</b> service account in the <b>kube-system</b> namespace</td>
<td>Role for the <a href="/docs/admin/dns/">kube-dns</a> component.</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>None</td>
<td>Allows access to the resources required to perform <a href="/docs/admin/kubelet-tls-bootstrapping/">Kubelet TLS bootstrapping</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> component.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>None</td>
<td>Allows access to the resources required by most <a href="/docs/user-guide/persistent-volumes/#provisioner">dynamic volume provisioners</a>.</td>
</tr>
</table>-->
<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>默认ClusterRole</th>
<th>默认ClusterRoleBinding</th>
<th>描述</th>
</tr>
<tr>
<td><b>system:auth-delegator</b></td>
<td>None</td>
<td>允许委托认证和授权检查。
通常由附加API Server用于统一认证和授权。</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>None</td>
<td><a href="https://github.com/kubernetes/heapster">Heapster</a>组件的角色。</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>None</td>
<td><a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a>组件的角色。</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b>kube-dns</b> service account in the <b>kube-system</b> namespace</td>
<td><a href="/docs/admin/dns/">kube-dns</a>组件的角色。</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>None</td>
<td>允许对执行<a href="/docs/admin/kubelet-tls-bootstrapping/">Kubelet TLS引导（Kubelet TLS bootstrapping）</a>所需要资源的访问.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>None</td>
<td><a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a>组件的角色。</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>None</td>
<td>允许对大部分<a href="/docs/user-guide/persistent-volumes/#provisioner">动态存储卷创建组件（dynamic volume provisioner）</a>所需要资源的访问。</td>
</tr>
</table>

<!--### Controller Roles-->
### 控制器（Controller）角色

<!--The [Kubernetes controller manager](/docs/admin/kube-controller-manager/) runs core control loops.
When invoked with `--use-service-account-credentials`, each control loop is started using a separate service account.
Corresponding roles exist for each control loop, prefixed with `system:controller:`.
If the controller manager is not started with `--use-service-account-credentials`, 
it runs all control loops using its own credential, which must be granted all the relevant roles.
These roles include:-->
[Kubernetes controller manager](/docs/admin/kube-controller-manager/)负责运行核心控制循环。
当使用`--use-service-account-credentials`选项运行controller manager时，每个控制循环都将使用单独的服务账户启动。
而每个控制循环都存在对应的角色，前缀名为`system:controller:`。
如果不使用`--use-service-account-credentials`选项时，controller manager将会使用自己的凭证运行所有控制循环，而这些凭证必须被授予相关的角色。
这些角色包括：

* system:controller:attachdetach-controller
* system:controller:certificate-controller
* system:controller:cronjob-controller
* system:controller:daemon-set-controller
* system:controller:deployment-controller
* system:controller:disruption-controller
* system:controller:endpoint-controller
* system:controller:generic-garbage-collector
* system:controller:horizontal-pod-autoscaler
* system:controller:job-controller
* system:controller:namespace-controller
* system:controller:node-controller
* system:controller:persistent-volume-binder
* system:controller:pod-garbage-collector
* system:controller:replicaset-controller
* system:controller:replication-controller
* system:controller:resourcequota-controller
* system:controller:route-controller
* system:controller:service-account-controller
* system:controller:service-controller
* system:controller:statefulset-controller
* system:controller:ttl-controller

<!--## Privilege Escalation Prevention and Bootstrapping-->
## 初始化与预防权限升级

<!--The RBAC API prevents users from escalating privileges by editing roles or role bindings.
Because this is enforced at the API level, it applies even when the RBAC authorizer is not in use.-->
RBAC API会阻止用户通过编辑角色或者角色绑定来升级权限。
由于这一点是在API级别实现的，所以在RBAC授权器（RBAC authorizer）未启用的状态下依然可以正常工作。

<!--A user can only create/update a role if they already have all the permissions contained in the role,
at the same scope as the role (cluster-wide for a `ClusterRole`, within the same namespace or cluster-wide for a `Role`).
For example, if "user-1" does not have the ability to list secrets cluster-wide, they cannot create a `ClusterRole`
containing that permission. To allow a user to create/update roles:-->
用户只有在拥有了角色所包含的所有权限的条件下才能创建／更新一个角色，这些操作还必须在角色所处的相同范围内进行（对于`ClusterRole`来说是集群范围，对于`Role`来说是在与角色相同的名字空间或者集群范围）。
例如，如果用户"user-1"没有权限读取集群范围内的secret列表，那么他也不能创建包含这种权限的`ClusterRole`。为了能够让用户创建／更新角色，需要：

<!--1. Grant them a role that allows them to create/update `Role` or `ClusterRole` objects, as desired.
2. Grant them roles containing the permissions you would want them to be able to set in a `Role` or `ClusterRole`. If they attempt to create or modify a `Role` or `ClusterRole` with permissions they themselves have not been granted, the API request will be forbidden.-->
1. 授予用户一个角色以允许他们根据需要创建／更新`Role`或者`ClusterRole`对象。
2. 授予用户一个角色包含他们在`Role`或者`ClusterRole`中所能够设置的所有权限。如果用户尝试创建或者修改`Role`或者`ClusterRole`以设置那些他们未被授权的权限时，这些API请求将被禁止。

<!--A user can only create/update a role binding if they already have all the permissions contained in the referenced role 
(at the same scope as the role binding) *or* if they've been given explicit permission to perform the `bind` verb on the referenced role.
For example, if "user-1" does not have the ability to list secrets cluster-wide, they cannot create a `ClusterRoleBinding`
to a role that grants that permission. To allow a user to create/update role bindings:-->
用户只有在拥有所引用的角色中包含的所有权限时才可以创建／更新角色绑定（这些操作也必须在角色绑定所处的相同范围内进行）*或者*用户被明确授权可以在所引用的角色上执行绑定操作。
例如，如果用户"user-1"没有权限读取集群范围内的secret列表，那么他将不能创建`ClusterRole`来引用那些授予了此项权限的角色。为了能够让用户创建／更新角色绑定，需要：

<!--1. Grant them a role that allows them to create/update `RoleBinding` or `ClusterRoleBinding` objects, as desired.
2. Grant them permissions needed to bind a particular role:
    * implicitly, by giving them the permissions contained in the role.
    * explicitly, by giving them permission to perform the `bind` verb on the particular role (or cluster role).-->
1. 授予用户一个角色以允许他们根据需要创建／更新`RoleBinding`或者`ClusterRoleBinding`对象。
2. 授予用户绑定某一特定角色所需要的权限：
    * 隐式地，通过授予用户所有所引用的角色中所包含的权限
    * 显式地，通过授予用户在特定Role（或者ClusterRole）对象上执行`bind`操作的权限

<!--For example, this cluster role and role binding would allow "user-1" to grant other users the `admin`, `edit`, and `view` roles in the "user-1-namespace" namespace:-->
例如，下面例子中的ClusterRole和RoleBinding将允许用户"user-1"授予其它用户"user-1-namespace"名字空间内的`admin`、`edit`和`view`等角色和角色绑定。

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  resourceNames: ["admin","edit","view"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: role-grantor-binding
  namespace: user-1-namespace
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

<!--When bootstrapping the first roles and role bindings, it is necessary for the initial user to grant permissions they do not yet have.
To bootstrap initial roles and role bindings:-->
当初始化第一个角色和角色绑定时，初始用户需要能够授予他们尚未拥有的权限。
初始化初始角色和角色绑定时需要：

<!--* Use a credential with the `system:masters` group, which is bound to the `cluster-admin` super-user role by the default bindings.
* If your API server runs with the insecure port enabled (`--insecure-port`), you can also make API calls via that port, which does not enforce authentication or authorization.-->
* 使用包含`system：masters`用户组的凭证，该用户组通过默认绑定绑定到`cluster-admin`超级用户角色。
* 如果您的API Server在运行时启用了非安全端口（`--insecure-port`），您也可以通过这个没有施行认证或者授权的端口发送角色或者角色绑定请求。

<!--## Command-line Utilities-->
## 一些命令行工具

<!--Two `kubectl` commands exist to grant roles within a namespace or across the entire cluster.-->
有两个`kubectl`命令可以用于在名字空间内或者整个集群内授予角色。

### `kubectl create rolebinding`

<!--Grants a `Role` or `ClusterRole` within a specific namespace. Examples:-->
在某一特定名字空间内授予`Role`或者`ClusterRole`。示例如下：

<!--* Grant the `admin` `ClusterRole` to a user named "bob" in the namespace "acme":-->
* 在名为"acme"的名字空间中将`admin` `ClusterRole`授予用户"bob"：

    `kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme`

<!--* Grant the `view` `ClusterRole` to a service account named "myapp" in the namespace "acme":-->
* 在名为"acme"的名字空间中将`view` `ClusterRole`授予服务账户"myapp"：

    `kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme`

### `kubectl create clusterrolebinding`

<!--Grants a `ClusterRole` across the entire cluster, including all namespaces. Examples:-->
在整个集群中授予`ClusterRole`，包括所有名字空间。示例如下：

<!--* Grant the `cluster-admin` `ClusterRole` to a user named "root" across the entire cluster:-->
* 在整个集群范围内将`cluster-admin` `ClusterRole`授予用户"root"：

    `kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root`

<!--* Grant the `system:node` `ClusterRole` to a user named "kubelet" across the entire cluster:-->
* 在整个集群范围内将`system:node` `ClusterRole`授予用户"kubelet"：

    `kubectl create clusterrolebinding kubelet-node-binding --clusterrole=system:node --user=kubelet`

<!--* Grant the `view` `ClusterRole` to a service account named "myapp" in the namespace "acme" across the entire cluster:-->
* 在整个集群范围内将`view` `ClusterRole`授予名字空间"acme"内的服务账户"myapp"：

    `kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp`

<!--See the CLI help for detailed usage-->
请参阅CLI帮助文档以获得上述命令的详细用法

<!--## Service Account Permissions-->
## 服务账户（Service Account）权限

<!--Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the "kube-system" namespace
(beyond discovery permissions given to all authenticated users).-->
默认的RBAC策略将授予控制平面组件（control-plane component）、节点（node）和控制器（controller）一组范围受限的权限，
但对于"kube-system"名字空间以外的服务账户，则*不授予任何权限*（超出授予所有认证用户的发现权限）。

<!--This allows you to grant particular roles to particular service accounts as needed.
Fine-grained role bindings provide greater security, but require more effort to administrate.
Broader grants can give unnecessary (and potentially escalating) API access to service accounts, but are easier to administrate.-->
这一点允许您根据需要向特定服务账号授予特定权限。
细粒度的角色绑定将提供更好的安全性，但需要更多精力管理。
更粗粒度的授权可能授予服务账号不需要的API访问权限（甚至导致潜在授权扩散），但更易于管理。

<!--In order from most secure to least secure, the approaches are:-->
从最安全到最不安全可以排序以下方法：

<!--1. Grant a role to an application-specific service account (best practice)-->
1. 对某一特定应用程序的服务账户授予角色（最佳实践）

   <!--This requires the application to specify a `serviceAccountName` in its pod spec,
   and for the service account to be created (via the API, application manifest, `kubectl create serviceaccount`, etc.).-->
   要求应用程序在其pod规范（pod spec）中指定`serviceAccountName`字段，并且要创建相应服务账户（例如通过API、应用程序清单或者命令`kubectl create serviceaccount`等）。

   <!--For example, grant read-only permission within "my-namespace" to the "my-sa" service account:-->
   例如，在"my-namespace"名字空间中授予服务账户"my-sa"只读权限：
   
   ```shell
   kubectl create rolebinding my-sa-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:my-sa \
     --namespace=my-namespace
   ```

<!--2. Grant a role to the "default" service account in a namespace-->
2. 在某一名字空间中授予"default"服务账号一个角色

   <!--If an application does not specify a `serviceAccountName`, it uses the "default" service account.-->
   如果一个应用程序没有在其pod规范中指定`serviceAccountName`，它将默认使用"default"服务账号。

   <!--NOTE: Permissions given to the "default" service account are available to any pod in the namespace that does not specify a `serviceAccountName`.-->
   注意：授予"default"服务账号的权限将可用于名字空间内任何没有指定`serviceAccountName`的pod。

   <!--For example, grant read-only permission within "my-namespace" to the "default" service account:-->
   下面的例子将在"my-namespace"名字空间内授予"default"服务账号只读权限：
   ```shell
   kubectl create rolebinding default-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:default \
     --namespace=my-namespace
   ```

   <!--Many [add-ons](/docs/concepts/cluster-administration/addons/) currently run as the "default" service account in the "kube-system" namespace.
   To allow those add-ons to run with super-user access, grant cluster-admin permissions to the "default" service account in the "kube-system" namespace.
   NOTE: Enabling this means the "kube-system" namespace contains secrets that grant super-user access to the API.-->
   目前，许多[加载项（addon）]（/ docs / concepts / cluster-administration / addons /）作为"kube-system"名字空间中的"default"服务帐户运行。
   要允许这些加载项使用超级用户访问权限，请将cluster-admin权限授予"kube-system"名字空间中的"default"服务帐户。
   注意：启用上述操作意味着"kube-system"名字空间将包含允许超级用户访问API的秘钥。
   
   ```shell
   kubectl create clusterrolebinding add-on-cluster-admin \
     --clusterrole=cluster-admin \
     --serviceaccount=kube-system:default
   ```

<!--3. Grant a role to all service accounts in a namespace-->
3. 为名字空间中所有的服务账号授予角色

   <!--If you want all applications in a namespace to have a role, no matter what service account they use,
   you can grant a role to the service account group for that namespace.-->
   如果您希望名字空间内的所有应用程序都拥有同一个角色，无论它们使用什么服务账户，您可以为该名字空间的服务账户用户组授予角色。

   <!--For example, grant read-only permission within "my-namespace" to to all service accounts in that namespace:-->
   下面的例子将授予"my-namespace"名字空间中的所有服务账户只读权限：
   
   ```shell
   kubectl create rolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts:my-namespace \
     --namespace=my-namespace
   ```

<!--4. Grant a limited role to all service accounts cluster-wide (discouraged)-->
4. 对集群范围内的所有服务账户授予一个受限角色（不鼓励）

   <!--If you don't want to manage permissions per-namespace, you can grant a cluster-wide role to all service accounts.-->
   如果您不想管理每个命名空间的权限，则可以将集群范围角色授予所有服务帐户。

   <!--For example, grant read-only permission across all namespaces to all service accounts in the cluster:-->
   下面的例子将所有名字空间中的只读权限授予集群中的所有服务账户：
   
   ```shell
   kubectl create clusterrolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts
   ```

<!--5. Grant super-user access to all service accounts cluster-wide (strongly discouraged)-->
5. 授予超级用户访问权限给集群范围内的所有服务帐户（强烈不鼓励）

   <!--If you don't care about partitioning permissions at all, you can grant super-user access to all service accounts.-->
   如果您根本不关心权限分块，您可以对所有服务账户授予超级用户访问权限。

   <!--WARNING: This allows any user with read access to secrets or the ability to create a pod to access super-user credentials.-->
   警告：这种做法将允许任何具有读取权限的用户访问secret或者通过创建一个容器的方式来访问超级用户的凭据。

   ```shell
   kubectl create clusterrolebinding serviceaccounts-cluster-admin \
     --clusterrole=cluster-admin \
     --group=system:serviceaccounts
   ```

<!--## Upgrading from 1.5-->
## 从版本1.5升级

<!--Prior to Kubernetes 1.6, many deployments used very permissive ABAC policies,
including granting full API access to all service accounts.-->
在Kubernetes 1.6之前，许多部署使用非常宽泛的ABAC策略，包括授予对所有服务帐户的完整API访问权限。

<!--Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the "kube-system" namespace
(beyond discovery permissions given to all authenticated users).-->
默认的RBAC策略将授予控制平面组件（control-plane components）、节点（nodes）和控制器（controller）一组范围受限的权限，
但对于"kube-system"名字空间以外的服务账户，则*不授予任何权限*（超出授予所有认证用户的发现权限）。

<!--While far more secure, this can be disruptive to existing workloads expecting to automatically receive API permissions.
Here are two approaches for managing this transition:-->
虽然安全性更高，但这可能会影响到期望自动接收API权限的现有工作负载。
以下是管理此转换的两种方法：

<!--### Parallel Authorizers-->
### 并行授权器（authorizer）

<!--Run both the RBAC and ABAC authorizers, and include the legacy ABAC policy:-->
同时运行RBAC和ABAC授权器，并包括旧版ABAC策略：

```
--authorization-mode=RBAC,ABAC --authorization-policy-file=mypolicy.jsonl
```

<!--The RBAC authorizer will attempt to authorize requests first. If it denies an API request,
the ABAC authorizer is then run. This means that any request allowed by *either* the RBAC
or ABAC policies is allowed.-->
RBAC授权器将尝试首先授权请求。如果RBAC授权器拒绝API请求，则ABAC授权器将被运行。这意味着RBAC策略*或者*ABAC策略所允许的任何请求都是可通过的。

<!--When run with a log level of 2 or higher (`--v=2`), you can see RBAC denials in the apiserver log (prefixed with `RBAC DENY:`).
You can use that information to determine which roles need to be granted to which users, groups, or service accounts.
Once you have [granted roles to service accounts](#service-account-permissions) and workloads are running with no RBAC denial messages
in the server logs, you can remove the ABAC authorizer.-->
当以日志级别为2或更高（`--v = 2`）运行时，您可以在API Server日志中看到RBAC拒绝请求信息（以`RBAC DENY:`为前缀）。
您可以使用该信息来确定哪些角色需要授予哪些用户，用户组或服务帐户。
一旦[授予服务帐户角色](#service-account-permissions)，并且服务器日志中没有RBAC拒绝消息的工作负载正在运行，您可以删除ABAC授权器。

<!--### Permissive RBAC Permissions-->
### 宽泛的RBAC权限

<!--You can replicate a permissive policy using RBAC role bindings.-->
您可以使用RBAC角色绑定来复制一个宽泛的策略。

<!--**WARNING: The following policy allows ALL service accounts to act as cluster administrators.
Any application running in a container receives service account credentials automatically,
and could perform any action against the API, including viewing secrets and modifying permissions.
This is not a recommended policy.**-->
**警告：以下政策略允许所有服务帐户作为集群管理员。
运行在容器中的任何应用程序都会自动接收服务帐户凭据，并且可以对API执行任何操作，包括查看secret和修改权限。
因此，并不推荐使用这种策略。**

```
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
