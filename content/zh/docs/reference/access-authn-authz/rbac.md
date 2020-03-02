---
title: 使用 RBAC 鉴权
content_template: templates/concept
weight: 70
---

<!--
---
reviewers:
- erictune
- deads2k
- liggitt
title: Using RBAC Authorization
content_template: templates/concept
weight: 70
---
-->

{{% capture overview %}}
<!--
Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise.
-->
基于角色（Role）的访问控制（RBAC）是一种基于企业中用户的角色来调节控制对计算机或网络资源的访问方法。
{{% /capture %}}

{{% capture body %}}
<!--
`RBAC` uses the `rbac.authorization.k8s.io` {{< glossary_tooltip text="API Group" term_id="api-group" >}}
to drive authorization decisions, allowing admins to dynamically configure policies
through the Kubernetes API.

As of 1.8, RBAC mode is stable and backed by the rbac.authorization.k8s.io/v1 API.

To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.
-->
`RBAC` 使用 `rbac.authorization.k8s.io` {{< glossary_tooltip text="API 组" term_id="api-group" >}}
来驱动鉴权操作，允许管理员通过 Kubernetes API 动态配置策略。

在 1.8 版本中，RBAC 模式是稳定的并通过 rbac.authorization.k8s.io/v1 API 提供支持。

要启用 RBAC，在启动 API 服务器时添加 `--authorization-mode=RBAC` 参数。

<!--
## API Overview

The RBAC API declares four top-level types which will be covered in this
section. Users can interact with these resources as they would with any other
API resource (via `kubectl`, API calls, etc.). For instance,
`kubectl apply -f (resource).yml` can be used with any of these examples,
though readers who wish to follow along should review the section on
bootstrapping first.
-->

## API 概述

本节介绍 RBAC API 所声明的四种顶级类型。用户可以像与其他 API 资源交互一样，
（通过 `kubectl`、API 调用等方式）与这些资源交互。例如，
命令 `kubectl apply -f (resource).yml` 可以用在这里的任何一个例子之上。
尽管如此，建议读者循序渐进阅读下面的章节，由浅入深。

<!--
### Role and ClusterRole

In the RBAC API, a role contains rules that represent a set of permissions.
Permissions are purely additive (there are no "deny" rules).
A role can be defined within a namespace with a `Role`, or cluster-wide with a `ClusterRole`.

A `Role` can only be used to grant access to resources within a single namespace.
Here's an example `Role` in the "default" namespace that can be used to grant read access to pods:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

A `ClusterRole` can be used to grant the same permissions as a `Role`,
but because they are cluster-scoped, they can also be used to grant access to:

* cluster-scoped resources (like nodes)
* non-resource endpoints (like "/healthz")
* namespaced resources (like pods) across all namespaces (needed to run `kubectl get pods --all-namespaces`, for example)

The following `ClusterRole` can be used to grant read access to secrets in any particular namespace,
or across all namespaces (depending on how it is [bound](#rolebinding-and-clusterrolebinding)):

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```
-->
### Role 和 ClusterRole

在 RBAC API 中，一个角色包含一组相关权限的规则。权限是纯粹累加的（不存在拒绝某操作的规则）。
角色可以用 `Role`  来定义到某个命名空间上，
或者用 `ClusterRole` 来定义到整个集群作用域。

一个 `Role` 只可以用来对某一命名空间中的资源赋予访问权限。
下面的 `Role` 示例定义到名称为 "default" 的命名空间，可以用来授予对该命名空间中的 Pods 的读取权限：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" 指定核心 API 组
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

`ClusterRole` 可以授予的权限和 `Role` 相同，
但是因为 `ClusterRole` 属于集群范围，所以它也可以授予以下访问权限：

* 集群范围资源 （比如 nodes）
* 非资源端点（比如 "/healthz"）
* 跨命名空间访问的有名字空间作用域的资源（如 Pods），比如运行命令`kubectl get pods --all-namespaces` 时需要此能力

下面的 `ClusterRole` 示例可用来对某特定命名空间下的 Secrets 的读取操作授权，
或者跨所有命名空间执行授权（取决于它是如何[绑定](#rolebinding-and-clusterrolebinding)的）:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # 此处的 "namespace" 被省略掉是因为 ClusterRoles 是没有命名空间的。
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

<!--
### RoleBinding and ClusterRoleBinding

A role binding grants the permissions defined in a role to a user or set of users.
It holds a list of subjects (users, groups, or service accounts), and a reference to the role being granted.
Permissions can be granted within a namespace with a `RoleBinding`, or cluster-wide with a `ClusterRoleBinding`.

A `RoleBinding` may reference a `Role` in the same namespace.
The following `RoleBinding` grants the "pod-reader" role to the user "jane" within the "default" namespace.
This allows "jane" to read pods in the "default" namespace.

`roleRef` is how you will actually create the binding.  The `kind` will be either `Role` or `ClusterRole`, and the `name` will reference the name of the specific `Role` or `ClusterRole` you want. In the example below, this RoleBinding is using `roleRef` to bind the user "jane" to the `Role` created above named `pod-reader`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "jane" to read pods in the "default" namespace.
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role #this must be Role or ClusterRole
  name: pod-reader # this must match the name of the Role or ClusterRole you wish to bind to
  apiGroup: rbac.authorization.k8s.io
```
-->
### RoleBinding 和 ClusterRoleBinding

角色绑定（RoleBinding）是将角色中定义的权限赋予一个或者一组用户。
它包含若干主体（用户，组和服务账户）的列表和对这些主体所获得的角色的引用。
可以使用 `RoleBinding` 在指定的命名空间中执行授权，
或者在集群范围的命名空间使用 `ClusterRoleBinding` 来执行授权。

一个 `RoleBinding` 可以引用同一的命名空间中的 `Role` 。
下面的例子 `RoleBinding` 将 "pod-reader" 角色授予在 "default" 命名空间中的用户 "jane"；
这样，用户 "jane" 就具有了读取 "default" 命名空间中 pods 的权限。

`roleRef` 里的内容决定了实际创建绑定的方法。`kind` 可以是 `Role` 或 `ClusterRole`，
`name` 将引用你要指定的 `Role` 或 `ClusterRole` 的名称。在下面的例子中，角色绑定使用
`roleRef` 将用户 "jane" 绑定到前文创建的角色 `Role`，其名称是 `pod-reader`。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# 此角色绑定使得用户 "jane" 能够读取 "default" 命名空间中的 Pods
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role #this must be Role or ClusterRole
  name: pod-reader # 这里的名称必须与你想要绑定的 Role 或 ClusterRole 名称一致
  apiGroup: rbac.authorization.k8s.io
```

<!--
A `RoleBinding` may also reference a `ClusterRole` to grant the permissions to namespaced
resources defined in the `ClusterRole` within the `RoleBinding`'s namespace.
This allows administrators to define a set of common roles for the entire cluster,
then reuse them within multiple namespaces.

For instance, even though the following `RoleBinding` refers to a `ClusterRole`,
"dave" (the subject, case sensitive) will only be able to read secrets in the "development"
namespace (the namespace of the `RoleBinding`).

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "dave" to read secrets in the "development" namespace.
kind: RoleBinding
metadata:
  name: read-secrets
  namespace: development # This only grants permissions within the "development" namespace.
subjects:
- kind: User
  name: dave # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```
-->
`RoleBinding` 也可以引用 `ClusterRole`，对 `ClusterRole` 所定义的、位于 `RoleBinding` 命名空间内的资源授权。
这可以允许管理者在
整个集群中定义一组通用的角色，然后在多个命名空间中重用它们。

例如下面的例子，`RoleBinding` 指定的是 `ClusterRole`，
"dave" （主体，区分大小写）将只可以读取在"development"
命名空间（ `RoleBinding` 的命名空间）中的"secrets"。


```yaml
apiVersion: rbac.authorization.k8s.io/v1
# 这个角色绑定允许 "dave" 用户在 "development" 命名空间中有读取 secrets 的权限。 
kind: RoleBinding
metadata:
  name: read-secrets
  namespace: development # 这里只授予 "development" 命名空间的权限。
subjects:
- kind: User
  name: dave # 名称区分大小写
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

<!--
Finally, a `ClusterRoleBinding` may be used to grant permission at the cluster level and in all
namespaces. The following `ClusterRoleBinding` allows any user in the group "manager" to read 
secrets in any namespace.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

You cannot modify which `Role` or `ClusterRole` a binding object refers to.
Attempts to change the `roleRef` field of a binding object will result in a validation error.
To change the `roleRef` field on an existing binding object, the binding object must be deleted and recreated.
There are two primary reasons for this restriction:

1. A binding to a different role is a fundamentally different binding.
Requiring a binding to be deleted/recreated in order to change the `roleRef`
ensures the full list of subjects in the binding is intended to be granted
the new role (as opposed to enabling accidentally modifying just the roleRef 
without verifying all of the existing subjects should be given the new role's permissions).
2. Making `roleRef` immutable allows giving `update` permission on an existing binding object
to a user, which lets them manage the list of subjects, without being able to change the 
role that is granted to those subjects.

The `kubectl auth reconcile` command-line utility creates or updates a manifest file containing RBAC objects,
and handles deleting and recreating binding objects if required to change the role they refer to.
See [command usage and examples](#kubectl-auth-reconcile) for more information.
-->

最后，`ClusterRoleBinding` 可用来在集群级别或对所有命名空间执行授权。
下面的例子允许 "manager" 组中的任何用户读取任意命名空间中 "secrets"。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# 这个集群角色绑定允许 "manager" 组中的任何用户读取任意命名空间中 "secrets"。
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # 名称区分大小写
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

你不能修改绑定对象所引用的 `Role` 或 `ClusterRole` 。
试图改变绑定对象的 `roleRef` 将导致验证错误。想要
改变现有绑定对象中 `roleRef` 字段的内容，必须删除并
重新创建绑定对象。这种限制有两个主要原因：

1.关于不同角色的绑定是完全不一样的。更改 `roleRef`
 需要删除/重建绑定，确保要赋予绑定的完整主体列表是新
的角色（而不是只是启用修改 `roleRef` 在不验证所有现有
主体的情况下的，应该授予新角色对应的权限）。

2.使得 `roleRef` 不可以改变现有绑定主体用户的 `update` 权限，
这样可以让它们能够管理主体列表，而不能更改授予这些主体相关
的角色。

命令 `kubectl auth reconcile` 可以创建或者更新包含 RBAC 对象的清单文件，
并且在必要的情况下删除和重新创建绑定对象，以改变所引用的角色。
更多相关信息请参照[命令用法和示例](#kubectl-auth-reconcile)

<!--
### Referring to Resources

Most resources are represented by a string representation of their name, such as "pods", just as it
appears in the URL for the relevant API endpoint. However, some Kubernetes APIs involve a
"subresource", such as the logs for a pod. The URL for the pods logs endpoint is:

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

In this case, "pods" is the namespaced resource, and "log" is a subresource of pods. To represent
this in an RBAC role, use a slash to delimit the resource and subresource. To allow a subject
to read both pods and pod logs, you would write:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```
-->
### 对资源的引用

大多数资源都是使用名称的字符串表示，例如在相关的 API 端点的 URL 之中出现的  "pods" 。
然而有一些 Kubernetes API 涉及 "子资源（subresources）"，例如 pod 的日志。Pod 日志相关的端点 URL 如下：

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

在这种情况下，"pods" 是有命名空间的资源，而 "log" 是 pods 的子资源。在 RBAC 角色中，
使用"/"分隔资源和子资源。允许一个主体要同时读取 pods 和 pod logs，你可以这么写：


```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

<!--
Resources can also be referred to by name for certain requests through the `resourceNames` list.
When specified, requests can be restricted to individual instances of a resource. To restrict a
subject to only "get" and "update" a single configmap, you would write:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

Note that `create` requests cannot be restricted by resourceName, as the object name is not known at
authorization time. The other exception is `deletecollection`.
-->
对于某些请求，也可以通过 `resourceNames` 列表按名称引用资源。
在指定时，可以将请求类型限制资源的单个实例。限制只可以 "get" 和 "update"
的单一configmap，你可以这么写：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

需要注意的是，`create` 请求不能被 resourceName 限制，因为在鉴权时还不知道对象名称。
另一个例外是 `deletecollection`。

<!--
### Aggregated ClusterRoles

As of 1.9, ClusterRoles can be created by combining other ClusterRoles using an `aggregationRule`. The
permissions of aggregated ClusterRoles are controller-managed, and filled in by unioning the rules of any
ClusterRole that matches the provided label selector. An example aggregated ClusterRole:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # Rules are automatically filled in by the controller manager.
```

Creating a ClusterRole that matches the label selector will add rules to the aggregated ClusterRole. In this case
rules can be added to the "monitoring" ClusterRole by creating another ClusterRole that has the label
`rbac.example.com/aggregate-to-monitoring: true`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpoints
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# These rules will be added to the "monitoring" role.
rules:
- apiGroups: [""]
  resources: ["services", "endpoints", "pods"]
  verbs: ["get", "list", "watch"]
```
-->
### Aggregated ClusterRoles

从 1.9 开始，集群角色（ClusterRole）可以通过使用 `aggregationRule` 的方式并组合其他 ClusterRoles 来创建。
聚合集群角色的权限是由控制器管理的，方法是通过过滤与标签选择器匹配的 ClusterRules，并将其中的权限进行组合。
一个聚合集群角色的示例如下：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # 具体规则由控制器管理器自动填写。
```

创建一个与标签选择器匹配的 ClusterRole 之后，其上定义的规则将成为聚合集群角色的一部分。在下面的例子中，
通过创建一个新的、标签同样为 `rbac.example.com/aggregate-to-monitoring: true` 的
ClusterRole，新的规则可被添加到 "monitoring" 集群角色中。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpoints
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# 这些规则将被添加到 "monitoring" 角色中。
rules:
- apiGroups: [""]
  resources: ["services", "endpoints", "pods"]
  verbs: ["get", "list", "watch"]
```

<!--
The default user-facing roles (described below) use ClusterRole aggregation. This lets admins include rules
for custom resources, such as those served by CustomResourceDefinitions or Aggregated API servers, on the
default roles.

For example, the following ClusterRoles let the "admin" and "edit" default roles manage the custom resource
"CronTabs" and the "view" role perform read-only actions on the resource.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # Add these permissions to the "admin" and "edit" default roles.
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    # Add these permissions to the "view" default role.
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```
-->

默认的面向用户的角色（如下所述）使用 ClusterRole 聚合。这使得管理者可以为自定义资源设置使用规则属性，
比如通过 CustomResourceDefinitions 或聚合 API 服务器为默认角色提供的服务。

例如，在以下 ClusterRoles 中让 "admin" 和 "edit" 拥有管理自定义资源 "CronTabs" 的权限，
 "view" 角色对资源有只读操作权限。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # 将这些权限添加到默认角色 "admin" 和 "edit" 中。
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    # 将这些权限添加到默认角色 "view" 中。
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

<!--
#### Role Examples

Only the `rules` section is shown in the following examples.

Allow reading the resource "pods" in the core {{< glossary_tooltip text="API Group" term_id="api-group" >}}:

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

Allow reading/writing "deployments" in both the "extensions" and "apps" API groups:

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```
Allow reading "pods" and reading/writing "jobs":

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch", "extensions"]
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```
-->
#### 角色示例

在以下示例中，我们仅截取展示了 `rules` 对应部分，
允许读取在核心 {{< glossary_tooltip text="API 组" term_id="api-group" >}}下的 Pods:

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

允许读/写在 "extensions" 和 "apps" API 组中的 "deployments" 资源：

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

允许读取 "pods" 和读/写 "jobs" :

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch", "extensions"]
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

<!--
Allow reading a `ConfigMap` named "my-config" (must be bound with a `RoleBinding` to limit to a single `ConfigMap` in a single namespace):

```yaml
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

Allow reading the resource "nodes" in the core group (because a `Node` is cluster-scoped, this must be in a `ClusterRole` bound with a `ClusterRoleBinding` to be effective):

```yaml
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

Allow "GET" and "POST" requests to the non-resource endpoint "/healthz" and all subpaths (must be in a `ClusterRole` bound with a `ClusterRoleBinding` to be effective):

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' in a nonResourceURL is a suffix glob match
  verbs: ["get", "post"]
```
-->
允许读取名称为 "my-config"的 `ConfigMap` （需要通过 `RoleBinding` 绑定带某名字空间中特定的 `ConfigMap`）：

```yaml
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

允许读取在核心组中的 "nodes" 资源（因为 `Node` 是集群范围的，所以需要 `ClusterRole` 绑定到 `ClusterRoleBinding` 才生效）

```yaml
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

允许在非资源端点 "/healthz" 和其子路径上发起 "GET" 和 "POST" 请求（必须在 `ClusterRole` 绑定 `ClusterRoleBinding` 才生效）

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' 在 nonResourceURL 中的意思是后缀全局匹配。
  verbs: ["get", "post"]
```

<!--
### Referring to Subjects

A `RoleBinding` or `ClusterRoleBinding` binds a role to *subjects*.
Subjects can be groups, users or service accounts.

Users are represented by strings.  These can be plain usernames, like
"alice", email-style names, like "bob@example.com", or numeric IDs
represented as a string.  It is up to the Kubernetes admin to configure
the [authentication modules](/docs/reference/access-authn-authz/authentication/) to produce
usernames in the desired format.  The RBAC authorization system does
not require any particular format.  However, the prefix `system:` is
reserved for Kubernetes system use, and so the admin should ensure
usernames do not contain this prefix by accident.

Group information in Kubernetes is currently provided by the Authenticator
modules. Groups, like users, are represented as strings, and that string 
has no format requirements, other than that the prefix `system:` is reserved.

[Service Accounts](/docs/tasks/configure-pod-container/configure-service-account/) have usernames with the `system:serviceaccount:` prefix and belong
to groups with the `system:serviceaccounts:` prefix.
-->
### 对主体的引用

`RoleBinding` 或者 `ClusterRoleBinding` 需要绑定角色到 *主体*。
主体可以是组，用户或者服务账户。

用户是由字符串表示，它们可以是普通的用户名，像 "alice"，或者是
邮件格式 "bob@example.com"，或者是数字ID。由 Kubernetes 管理员配置[身份认证模块](/docs/reference/access-authn-authz/authentication/)
需要的格式。RBAC 鉴权系统不对格式作任何要求，但是前缀 `system:` 是 Kubernetes 系统保留的，
所以管理员要确保配置的用户名不能出现上述前缀格式。

用户组信息是 Kubernetes 现在提供的一种身份验证模块，与用户一样，对组的字符串没有格式要求，
只是不能使用保留的前缀 `system:` 。

[服务账号](/docs/tasks/configure-pod-container/configure-service-account/) 的用户名前缀为`system:serviceaccount:`，
属于前缀为 `system:serviceaccounts:` 的用户组。

<!--
#### Role Binding Examples

Only the `subjects` section of a `RoleBinding` is shown in the following examples.

For a user named "alice@example.com":

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

For a group named "frontend-admins":

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

For the default service account in the kube-system namespace:

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```
-->
#### RoleBinding的示例

下面的示例只是展示 `RoleBinding` 中 `subjects` 的部分。

用户的名称为 "alice@example.com":

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

组的名称为 "frontend-admins":

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

服务账号在 kube-system 命名空间中:

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

在名称为 "qa" 命名空间中所有的服务账号:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

<!--
For all service accounts in the "qa" namespace:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

For all service accounts everywhere:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

For all authenticated users (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

For all unauthenticated users (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

For all users (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```
-->

所有的服务账号:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

所有认证过的用户 （版本 1.5+）:

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

所有未认证的用户 （版本 1.5+）:

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

所有用户 （版本 1.5+）:

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

<!--
## Default Roles and Role Bindings

API servers create a set of default `ClusterRole` and `ClusterRoleBinding` objects.
Many of these are `system:` prefixed, which indicates that the resource is "owned" by the infrastructure.
Modifications to these resources can result in non-functional clusters. One example is the `system:node` ClusterRole.
This role defines permissions for kubelets. If the role is modified, it can prevent kubelets from working.

All of the default cluster roles and rolebindings are labeled with `kubernetes.io/bootstrapping=rbac-defaults`.
-->
## 默认 Roles 和 Role Bindings

API servers创建一组默认为 `ClusterRole` 和 `ClusterRoleBinding` 的对象。
其中许多是以 `system:` 为前缀的，它表示资源是基础设施 "owned" 的。对于这些资源的修改可能导致集群功能失效。
例如，`system:node` 是集群角色，它是定义 kubelets 相关的权限，如果这个角色被修改，它将导致 kubelets 无法正常工作。

所有默认的 ClusterRole 和 ClusterRoleBinding 对象都会被标记为 `kubernetes.io/bootstrapping=rbac-defaults`。

<!--
### Auto-reconciliation

At each start-up, the API server updates default cluster roles with any missing permissions,
and updates default cluster role bindings with any missing subjects.
This allows the cluster to repair accidental modifications,
and to keep roles and rolebindings up-to-date as permissions and subjects change in new releases.

To opt out of this reconciliation, set the `rbac.authorization.kubernetes.io/autoupdate` 
annotation on a default cluster role or rolebinding to `false`.
Be aware that missing default permissions and subjects can result in non-functional clusters.

Auto-reconciliation is enabled in Kubernetes version 1.6+ when the RBAC authorizer is active.
-->
### 自动更新

在每次启动时，API Server 都会更新默认 ClusterRole 所缺少的各种权限，并更新默认 ClusterRoleBinding 所缺少的各个角色绑定主体。
这种自动更新机制允许集群去修复一些特殊的修改。
由于权限和角色绑定主体在新的 Kubernetes 版本中可能发生变化，所以这样的话也能够保证角色和角色绑定始终保持是最新的。

如果要禁止此功能,请将默认ClusterRole以及ClusterRoleBinding的`rbac.authorization.kubernetes.io/autoupdate`设置成`false`。

注意，缺乏默认权限和角色绑定主体可能会导致非功能性集群问题。

自动更新功能在 Kubernetes 版本1.6+ 的 RBAC 认证是默认开启的。

<!--
### Discovery Roles

Default role bindings authorize unauthenticated and authenticated users to read API information that is deemed safe to be publicly accessible (including CustomResourceDefinitions). To disable anonymous unauthenticated access add `--anonymous-auth=false` to the API server configuration.

To view the configuration of these roles via `kubectl` run:

```
kubectl get clusterroles system:discovery -o yaml
```

NOTE: editing the role is not recommended as changes will be overwritten on API server restart via auto-reconciliation (see above).

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> group</td>
<td>Allows a user read-only access to basic information about themselves. Prior to 1.14, this role was also bound to `system:unauthenticated` by default.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> group</td>
<td>Allows read-only access to API discovery endpoints needed to discover and negotiate an API level. Prior to 1.14, this role was also bound to `system:unauthenticated` by default.</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>Allows read-only access to non-sensitive information about the cluster. Introduced in 1.14.</td>
</tr>
</table>
-->
### Discovery Roles

无论是经过身份验证的还是未经过身份验证的用户，默认角色的用户读取API被认为是安全的，可以公开访问（包括CustomResourceDefinitions），
如果要禁用匿名未经过身份验证的用户访问，请在 API server 中添加 `--anonymous-auth=false` 的配置选项。

通过运行命令 `kubectl` 可以查看这些角色的配置信息:

```
kubectl get clusterroles system:discovery -o yaml
```

注意：不建议编辑这个角色，因为更改将在 API server 重启时自动更新时覆盖（见上文）

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>默认 ClusterRole</th>
<th>默认 ClusterRoleBinding</th>
<th>描述</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> 组</td>
<td>允许用户以只读的方式去访问他们自己的基本信息。在1.14版本之前，这个角色在默认情况下也绑定在 `system:unauthenticated` 上。</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> 组</td>
<td>允许以只读方式访问 API 发现端点，这些端点用来发现和协商 API 级别。在1.14版本之前，这个角色在默认情况下绑定在 `system:unauthenticated` 上。</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td><b>system:authenticated</b> 和 <b>system:unauthenticated</b> 组</td>
<td>允许对集群的非敏感信息进行只读访问，它是在1.14版本中引入的。</td>
</tr>
</table>

<!--
### User-facing Roles

Some of the default roles are not `system:` prefixed. These are intended to be user-facing roles.
They include super-user roles (`cluster-admin`),
roles intended to be granted cluster-wide using ClusterRoleBindings (`cluster-status`),
and roles intended to be granted within particular namespaces using RoleBindings (`admin`, `edit`, `view`).

As of 1.9, user-facing roles use [ClusterRole Aggregation](#aggregated-clusterroles) to allow admins to include
rules for custom resources on these roles. To add rules to the "admin", "edit", or "view" role, create a
ClusterRole with one or more of the following labels:

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

<table>
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
</table>
-->
### 面向用户的角色

一些默认的角色不是前缀 `system:` 开头的。这些是面向用户的角色。它们包括 super-user 角色（`cluster-admin`），
使用 ClusterRoleBindings （`cluster-status`）在集群范围内授予角色，
以及使用 RoleBindings （`admin`, `edit`, `view`）在特定命名空间中授予的角色。

在 1.9 开始，面向用户的角色使用[ClusterRole Aggregation](#aggregated-clusterroles)允许管理员在包含这些角色上的
自定义资源上添加规则。如果想要添加 "admin" "edit" 或者 "view" ，需要先创建使用以下一个或多个的 ClusterRole 的标签：

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>默认 ClusterRole</th>
<th>默认 ClusterRoleBinding</th>
<th>描述</th>
</tr>
<tr>
<td><b>cluster-admin</b></td>
<td><b>system:masters</b> 组</td>
<td>允许超级用户在平台上的任何资源的所有操作。
当在 <b>ClusterRoleBinding</b> 中使用时，可以授权对集群中以及所有命名空间中的全部资源进行完全控制。
当在 <b>RoleBinding</b> 中使用时，可以授权控制 RoleBinding 所在命名空间中的所有资源，包括命名空间本身。</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>无</td>
<td>允许管理员访问权限，旨在使用 <b>RoleBinding</b> 在命名空间内执行授权。
如果在 <b>RoleBinding</b> 中使用，则可授予对命名空间中的大多数资源的读/写权限，
包括创建角色和绑定角色（RoleBinding）的能力。
但是它不允许对资源配额或者命名空间本身进行写操作。</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>无</td>
<td>允许对命名空间的大多数对象进行读/写操作。
它不允许查看或者修改角色（Roles）或者角色绑定（RoleBindings）。</td>
</tr>
<tr>
<td><b>view</b></td>
<td>无</td>
<td>允许对命名空间的大多数对象有只读权限。
它不允许查看角色（Roles）或角色绑定（RoleBindings）。
它不允许查看 Secrets，因为这类操作属于越权。</td>
</tr>
</table>

<!--
### Core Component Roles

<table>
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
<td><b>system:volume-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>Allows access to the volume resources required by the kube-scheduler component.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> user</td>
<td>Allows access to the resources required by the kube-controller-manager component.
The permissions required by individual control loops are contained in the <a href="#controller-roles">controller roles</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>None in 1.8+</td>
<td>Allows access to resources required by the kubelet component, <b>including read access to all secrets, and write access to all pod status objects</b>.

As of 1.7, use of the <a href="/docs/reference/access-authn-authz/node/">Node authorizer</a> and <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction admission plugin</a> is recommended instead of this role, and allow granting API access to kubelets based on the pods scheduled to run on them.
Prior to 1.7, this role was automatically bound to the `system:nodes` group.
In 1.7, this role was automatically bound to the `system:nodes` group if the `Node` authorization mode is not enabled.
In 1.8+, no binding is automatically created.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> user</td>
<td>Allows access to the resources required by the kube-proxy component.</td>
</tr>
</table>
-->
### 核心组件角色

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>默认 ClusterRole</th>
<th>默认 ClusterRoleBinding</th>
<th>描述</th>
</tr>
<tr>
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> 用户</td>
<td>允许访问 kube-scheduler 组件所需要的资源。</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<td><b>system:kube-scheduler</b> 用户</td>
<td>允许访问 kube-scheduler 组件所需要的的卷资源。</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> 用户</td>
<td>允许访问 kube-controller-manager 组件所需要的资源。
各个控制环所需要的权限包含在 <a href="#controller-roles">controller roles</a> 之中。</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>在版本1.8之后无</td>
<td>允许访问 kubelet 组件所需要的资源，<b>它包括读取所有的 Secrets 和对所有 Pod 状态对象的写操作。</b>

从版本 1.7 开始，推荐使用 <a href="/docs/reference/access-authn-authz/node/">Node authorizer</a> 和 <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction 准入插件</a> 来代替这个角色，它允许基于 kubelet 上调度执行的 Pods 来授权对 kubelet  API 的访问。
在版本 1.7 之前，这个角色会自动绑定到 `system:nodes` 组。
在版本 1.7中，如果未启用`Node` 鉴权模式，这个角色将自动绑定到 `system:nodes` 组
在版本 1.8+ 之后，不再自动创建绑定。
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> 用户</td>
<td>允许访问 kube-proxy 组件所需要的资源。</td>
</tr>
</table>

<!--
### Other Component Roles

<table>
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
<td>Role for the <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a> component.</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>None</td>
<td>Allows full access to the kubelet API.</td>
</tr>  
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>None</td>
<td>Allows access to the resources required to perform
<a href="/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/">Kubelet TLS bootstrapping</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> component.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>None</td>
<td>Allows access to the resources required by most <a href="/docs/concepts/storage/persistent-volumes/#provisioner">dynamic volume provisioners</a>.</td>
</tr>
</table>
-->
### 其他组件角色

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>默认 ClusterRole</th>
<th>默认 ClusterRoleBinding</th>
<th>描述</th>
</tr>
<tr>
<td><b>system:auth-delegator</b></td>
<td>无</td>
<td>允许代理身份认证和鉴权，
它通常用在插件式 API 服务器上，以实现统一的身份认证和鉴权。</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>无</td>
<td>为 <a href="https://github.com/kubernetes/heapster">Heapster</a> 组件定义的角色。</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>无</td>
<td>为 <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> 组件定义的角色。</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td>在<b>kube-system</b>命名空间中的<b>kube-dns</b>服务账号</td>
<td>为 <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a> 组件定义的角色。</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>无</td>
<td>允许完全访问 kubelet API 。</td>
</tr>  
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>无</td>
<td>允许访问执行
<a href="/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/">Kubelet TLS 启动引导</a> 所需要的资源。</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>无</td>
<td>为 <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> 组件定义的角色。</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>无</td>
<td>允许访问大部分的 <a href="/docs/concepts/storage/persistent-volumes/#provisioner">动态卷驱动</a> 所需要的资源。</td>
</tr>
</table>

<!--
### Controller Roles

The [Kubernetes controller manager](/docs/admin/kube-controller-manager/) runs core control loops.
When invoked with `--use-service-account-credentials`, each control loop is started using a separate service account.
Corresponding roles exist for each control loop, prefixed with `system:controller:`.
If the controller manager is not started with `--use-service-account-credentials`, 
it runs all control loops using its own credential, which must be granted all the relevant roles.
These roles include:

* system:controller:attachdetach-controller
* system:controller:certificate-controller
* system:controller:clusterrole-aggregation-controller
* system:controller:cronjob-controller
* system:controller:daemon-set-controller
* system:controller:deployment-controller
* system:controller:disruption-controller
* system:controller:endpoint-controller
* system:controller:expand-controller
* system:controller:generic-garbage-collector
* system:controller:horizontal-pod-autoscaler
* system:controller:job-controller
* system:controller:namespace-controller
* system:controller:node-controller
* system:controller:persistent-volume-binder
* system:controller:pod-garbage-collector
* system:controller:pv-protection-controller
* system:controller:pvc-protection-controller
* system:controller:replicaset-controller
* system:controller:replication-controller
* system:controller:resourcequota-controller
* system:controller:root-ca-cert-publisher
* system:controller:route-controller
* system:controller:service-account-controller
* system:controller:service-controller
* system:controller:statefulset-controller
* system:controller:ttl-controller
-->
### 控制器角色   {#controller-roles}

[Kubernetes 控制器管理器](/docs/admin/kube-controller-manager/) 运行核心控制环。
当使用 `--use-service-account-credentials` 参数时, 每个控制环使用一个单独的服务账号启动。
每个控制环都有相应的、前缀为 `system:controller:` 的角色。
如果控制管理器启动时未设置 `--use-service-account-credentials`，
它使用自己的身份信息来运行所有的控制环，该身份必须被授予所有相关的角色。
这些角色包括:

* system:controller:attachdetach-controller
* system:controller:certificate-controller
* system:controller:clusterrole-aggregation-controller
* system:controller:cronjob-controller
* system:controller:daemon-set-controller
* system:controller:deployment-controller
* system:controller:disruption-controller
* system:controller:endpoint-controller
* system:controller:expand-controller
* system:controller:generic-garbage-collector
* system:controller:horizontal-pod-autoscaler
* system:controller:job-controller
* system:controller:namespace-controller
* system:controller:node-controller
* system:controller:persistent-volume-binder
* system:controller:pod-garbage-collector
* system:controller:pv-protection-controller
* system:controller:pvc-protection-controller
* system:controller:replicaset-controller
* system:controller:replication-controller
* system:controller:resourcequota-controller
* system:controller:root-ca-cert-publisher
* system:controller:route-controller
* system:controller:service-account-controller
* system:controller:service-controller
* system:controller:statefulset-controller
* system:controller:ttl-controller

<!--
## Privilege Escalation Prevention and Bootstrapping

The RBAC API prevents users from escalating privileges by editing roles or role bindings.
Because this is enforced at the API level, it applies even when the RBAC authorizer is not in use.

A user can only create/update a role if at least one of the following things is true:

1. They already have all the permissions contained in the role, at the same scope as the object being modified
(cluster-wide for a `ClusterRole`, within the same namespace or cluster-wide for a `Role`)
2. They are given explicit permission to perform the `escalate` verb on the `roles` or `clusterroles` resource in the `rbac.authorization.k8s.io` API group (Kubernetes 1.12 and newer)

For example, if "user-1" does not have the ability to list secrets cluster-wide, they cannot create a `ClusterRole`
containing that permission. To allow a user to create/update roles:

1. Grant them a role that allows them to create/update `Role` or `ClusterRole` objects, as desired.
2. Grant them permission to include specific permissions in the roles the create/update:
    * implicitly, by giving them those permissions (if they attempt to create or modify a `Role` or `ClusterRole` with permissions they themselves have not been granted, the API request will be forbidden)
    * or explicitly allow specifying any permission in a `Role` or `ClusterRole` by giving them permission to perform the `escalate` verb on `roles` or `clusterroles` resources in the `rbac.authorization.k8s.io` API group (Kubernetes 1.12 and newer)

A user can only create/update a role binding if they already have all the permissions contained in the referenced role 
(at the same scope as the role binding) *or* if they've been given explicit permission to perform the `bind` verb on the referenced role.
For example, if "user-1" does not have the ability to list secrets cluster-wide, they cannot create a `ClusterRoleBinding`
to a role that grants that permission. To allow a user to create/update role bindings:

1. Grant them a role that allows them to create/update `RoleBinding` or `ClusterRoleBinding` objects, as desired.
2. Grant them permissions needed to bind a particular role:
    * implicitly, by giving them the permissions contained in the role.
    * explicitly, by giving them permission to perform the `bind` verb on the particular role (or cluster role).
-->
## 初始化与预防权限升级

RBAC API 会阻止用户通过编辑角色或者角色绑定来升级权限。 
由于这一点是在 API 级别实现的，所以在 RBAC 鉴权器（RBAC authorizer）未启用的状态下依然可以正常工作。

用户只有在符合下列条件之一的情况下，才能创建/更新角色:


1. 他们已经拥有角色中包含的所有权限，且其作用域与正被修改的对象相同。
（对 `ClusterRole` 而言意味着集群范围，对 `Role` 而言意味着相同命名空间或者集群范围）
2. 他们被明确允许在 `rbac.authorization.k8s.io` API 组中的 `roles` 或者 `clusterroles` 资源上使用 `escalate` 动词（Kubernetes 版本 1.12 及以上）

例如，如果 "user-1" 没有列举集群范围所有 Secrets 的权限，他将不能创建包含对应权限的  `ClusterRole`。
若要允许用户创建/更新角色：

根据需要授予他们一个角色，允许他们根据需要创建/更新 `Role` 或者 `ClusterRole` 对象。
2. 授予他们在所创建/更新角色中包含特殊权限的权限:
    * 隐式的，通过给他们权限（如果它们试图创建或者更改 `Role` 或 `ClusterRole` 的权限，但自身没有被授权，API 请求将被禁止）
    * 或通过允许他们在 `Role` 或 `ClusterRole` 资源上执行 `escalate` 动作的权限，它包含在 `rbac.authorization.k8s.io` API 组中 （Kubernetes 1.12 及以上版本）

如果用户已经拥有引用角色中包含的权限，那他则只能创建/更新角色绑定。
（在角色绑定相同的作用域内）*或* 如果他们被授予对所引用角色执行 `bind` 操作的显式权限。
例如，如果 "user-1" 没有集群范围内 Secret 的列表权限，他就不能创建可以授予角色权限的 `ClusterRoleBinding`。
通过以下方法可以允许用户创建/更新角色绑定：

授予他们一个角色，允许他们根据需要创建/更新 `RoleBinding` 或者`ClusterRoleBinding` 对象。
2. 授予他们绑定特定角色所需的权限:
    * 隐式地，通过给他们授予角色中包含的权限。
    * 显式地，通过允许他们对特定角色（或集群角色）执行`bind` 操作的权限。

<!--
For example, this cluster role and role binding would allow "user-1" to grant other users the `admin`, `edit`, and `view` roles in the "user-1-namespace" namespace:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
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
apiVersion: rbac.authorization.k8s.io/v1
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

When bootstrapping the first roles and role bindings, it is necessary for the initial user to grant permissions they do not yet have.
To bootstrap initial roles and role bindings:

* Use a credential with the `system:masters` group, which is bound to the `cluster-admin` super-user role by the default bindings.
* If your API server runs with the insecure port enabled (`--insecure-port`), you can also make API calls via that port, which does not enforce authentication or authorization.
-->
例如，这个集群角色和角色绑定将允许 "user-1" 有对"user-1-namespace" 命名空间中的角色执行 `admin`、`edit` 和 `view` 操作权限：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
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
apiVersion: rbac.authorization.k8s.io/v1
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

当初始化第一个角色和角色绑定时，需要为初始用户授予他们尚未拥有的权限。 对初始角色和角色绑定进行初始化时需要：

* 使用用户组为 `system:masters` 的凭据，该用户组由默认绑定关联到 `cluster-admin` 这个超级用户角色。
* 如果你的 API server 启动时启用了不安全端口（使用`--insecure-port`）, 你也可以通过该端口调用 API ，这样操作会绕过身份验证或鉴权。

<!--
## Command-line Utilities

### `kubectl create role`

Creates a `Role` object defining permissions within a single namespace. Examples:

* Create a `Role` named "pod-reader" that allows user to perform "get", "watch" and "list" on pods:

    ```
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* Create a `Role` named "pod-reader" with resourceNames specified:

    ```
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Create a `Role` named "foo" with apiGroups specified:

    ```
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Create a `Role` named "foo" with subresource permissions:

    ```
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Create a `Role` named "my-component-lease-holder" with permissions to get/update a resource with a specific name:

    ```
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```
-->
## 一些命令行工具

### `kubectl create role`

创建 `Role` 对象，定义在某命名空间中的权限。例如:

* 创建名称为 "pod-reader" 的 `Role` 对象，允许用户对 pods 执行 "get"、"watch" 和 "list" 操作：

    ```
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* 创建名称为 "pod-reader" 的 `Role` 对象并指定 resourceNames：

    ```
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* 创建名为 "foo" 的 `Role` 对象并指定 apiGroups:

    ```
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* 创建名为 "foo" 的 `Role` 对象并指定子资源权限:

    ```
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```

* 创建名为 "my-component-lease-holder" 的 `Role` 对象，使其具有对特定名称资源执行 get/update 的权限：

    ```
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```

<!--
### `kubectl create clusterrole`

Creates a `ClusterRole` object. Examples:

* Create a `ClusterRole` named "pod-reader" that allows user to perform "get", "watch" and "list" on pods:

    ```
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* Create a `ClusterRole` named "pod-reader" with resourceNames specified:

    ```
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Create a `ClusterRole` named "foo" with apiGroups specified:

    ```
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Create a `ClusterRole` named "foo" with subresource permissions:

    ```
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Create a `ClusterRole` name "foo" with nonResourceURL specified:

    ```
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* Create a `ClusterRole` name "monitoring" with aggregationRule specified:

    ```
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```
-->
### `kubectl create clusterrole`

创建 `ClusterRole` 对象。例如：

* 创建名称为 "pod-reader" 的 `ClusterRole` 对象，允许用户对 pods 对象执行 "get"、"watch" 和 "list" 操作：

    ```
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* 创建名为 "pod-reader" 的 `ClusterRole` 对象并指定资源名称：

    ```
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* 创建名为 "foo" 的 `ClusterRole` 对象并指定 apiGroups：

    ```
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* 创建名为 "foo" 的`ClusterRole` 对象并指定子资源:

    ```
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* 创建名为 "foo" 的 `ClusterRole` 对象并指定非资源路径：

    ```
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* 创建名为 "monitoring" 的 `ClusterRole` 对象并指定聚合规则：

    ```
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```

<!--
### `kubectl create rolebinding`

Grants a `Role` or `ClusterRole` within a specific namespace. Examples:

* Within the namespace "acme", grant the permissions in the `admin` `ClusterRole` to a user named "bob":

    ```
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* Within the namespace "acme", grant the permissions in the `view` `ClusterRole` to the service account in the namespace "acme" named "myapp" :

    ```
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* Within the namespace "acme", grant the permissions in the `view` `ClusterRole` to a service account in the namespace "myappnamespace" named "myapp":

    ```
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```
-->
### `kubectl create rolebinding`

在特定的命名空间中对 `Role` 或 `ClusterRole` 授权。例如：

* 在命名空间 "acme" 中，将名为 `admin` 的 `ClusterRole` 中的权限授予名称 "bob" 的用户:

    ```
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* 在命名空间 "acme"中，将名为 `view` 的 `ClusterRole` 中的权限授予该命名空间 "acme" 中名为  "myapp" 的服务账号：

    ```
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* 在命名空间 "acme" 中，将名为 `view` 的 `ClusterRole` 对象中的权限授予命名空间 "myappnamespace" 中名称为 "myapp" 的服务账号：

    ```
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```

<!--
### `kubectl create clusterrolebinding`

Grants a `ClusterRole` across the entire cluster, including all namespaces. Examples:

* Across the entire cluster, grant the permissions in the `cluster-admin` `ClusterRole` to a user named "root":

    ```
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* Across the entire cluster, grant the permissions in the `system:node-proxier	` `ClusterRole` to a user named "system:kube-proxy":

    ```
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* Across the entire cluster, grant the permissions in the `view` `ClusterRole` to a service account named "myapp" in the namespace "acme":

    ```
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```
-->
### `kubectl create clusterrolebinding`

在整个集群、包括所有的命名空间中对 `ClusterRole` 授权。例如：

* 在整个集群范围，将名为 `cluster-admin` 的 `ClusterRole` 中定义的权限授予名为 "root" 用户：

    ```
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* 在整个集群范围，将名为 `system:node-proxier` 的 `ClusterRole` 的权限授予名为 "system:kube-proxy" 的用户：

    ```
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* 在整个集群范围，将名为 `view` 的 `ClusterRole` 对象中定义的权限授予 "acme" 命名空间中名为 "myapp" 的服务账号：

    ```
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```

<!--
### `kubectl auth reconcile` {#kubectl-auth-reconcile}

Creates or updates `rbac.authorization.k8s.io/v1` API objects from a manifest file.

Missing objects are created, and the containing namespace is created for namespaced objects, if required.

Existing roles are updated to include the permissions in the input objects,
and remove extra permissions if `--remove-extra-permissions` is specified.

Existing bindings are updated to include the subjects in the input objects,
and remove extra subjects if `--remove-extra-subjects` is specified.

Examples:

* Test applying a manifest file of RBAC objects, displaying changes that would be made:

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run
    ```

* Apply a manifest file of RBAC objects, preserving any extra permissions (in roles) and any extra subjects (in bindings):

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* Apply a manifest file of RBAC objects, removing any extra permissions (in roles) and any extra subjects (in bindings):

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
    ```

See the CLI help for detailed usage.
-->
### `kubectl auth reconcile` {#kubectl-auth-reconcile}

使用清单文件来创建或者更新 `rbac.authorization.k8s.io/v1` API 对象。

尚不存在的对象会被创建，如果对应的命名空间也不存在，必要的话也会被创建。
已经存在的角色会被更新，使之包含输入对象中所给的权限。如果指定了 `--remove-extra-permissions`，可以删除其余权限。

已经存在的绑定也会被更新，使之包含输入对象中所给的主体。如果指定了 `--remove-extra-permissions`，则可以删除其余主体。

例如:

* 测试应用 RBAC 对象的清单文件，显示将要进行的更改：

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run
    ```

* 应用 RBAC 对象的清单文件， 保留角色中的其余权限和绑定中的其他主体：

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* 应用 RBAC 对象的清单文件, 删除角色中的其他权限和绑定中的其他主体：

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
    ```

查看 CLI 帮助获取详细的用法。

<!--
## Service Account Permissions

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

This allows you to grant particular roles to particular service accounts as needed.
Fine-grained role bindings provide greater security, but require more effort to administrate.
Broader grants can give unnecessary (and potentially escalating) API access to service accounts, but are easier to administrate.

In order from most secure to least secure, the approaches are:

1. Grant a role to an application-specific service account (best practice)

    This requires the application to specify a `serviceAccountName` in its pod spec,
    and for the service account to be created (via the API, application manifest, `kubectl create serviceaccount`, etc.).

    For example, grant read-only permission within "my-namespace" to the "my-sa" service account:

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. Grant a role to the "default" service account in a namespace

    If an application does not specify a `serviceAccountName`, it uses the "default" service account.

    {{< note >}}Permissions given to the "default" service
    account are available to any pod in the namespace that does not
    specify a `serviceAccountName`.{{< /note >}}

    For example, grant read-only permission within "my-namespace" to the "default" service account:

    ```shell
    kubectl create rolebinding default-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:default \
      --namespace=my-namespace
    ```

    Many [add-ons](/docs/concepts/cluster-administration/addons/) currently run as the "default" service account in the `kube-system` namespace.
    To allow those add-ons to run with super-user access, grant cluster-admin permissions to the "default" service account in the `kube-system` namespace.

    {{< note >}}Enabling this means the `kube-system`
    namespace contains secrets that grant super-user access to the
    API.{{< /note >}}

    ```shell
    kubectl create clusterrolebinding add-on-cluster-admin \
      --clusterrole=cluster-admin \
      --serviceaccount=kube-system:default
    ```
-->
## 服务账号权限

默认的 RBAC 策略为控制面组件、节点和控制器授予权限。
但是不会对 `kube-system` 命名空间之外的服务账号授予权限。
（除了授予所有已认证用户的 discovery 权限）

这使得您可以根据需要向特定服务账号授予特定权限。 细粒度的角色绑定可带来更好的安全性，但需要更多精力管理。
更粗粒度的授权可能导致服务账号被授予不必要的 API 访问权限（甚至导致潜在的权限升级），但更易于管理。

按从最安全到最不安全的顺序，存在以下方法：

1. 为特定应用的服务账户授予角色（最佳实践）

    这要求应用在其 pod 规范中指定  `serviceAccountName` ，
	并额外创建服务账号（包括通过 API、应用程序清单、`kubectl create serviceaccount` 等）。  

    例如，在命名空间 "my-namespace" 中授予服务账号 "my-sa" 只读权限：

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. 将角色授予某命名空间中的 ”default” 服务账号

    如果一个应用没有指定 `serviceAccountName`，那么它将使用 "default" 服务账号。

    {{< note >}}不指定 `serviceAccountName` 的话，
	"default" 服务账号的权限会授予给命名空间中所有未指定 `serviceAccountName` 的 Pods。{{< /note >}}


    例如，在命名空间 "my-namespace" 中授予服务账号 "default" 只读权限：

    ```shell
    kubectl create rolebinding default-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:default \
      --namespace=my-namespace
    ```

    许多附加组件 [add-ons](/docs/concepts/cluster-administration/addons/) 目前在 `kube-system` 命名空间以 "default" 服务账号运行。
    要允许这些附加组件以超级用户权限运行，需要将集群的 cluster-admin 权限授予 `kube-system` 命名空间中的 "default" 服务账号。

    {{< note >}}启用这一配置意味着在 `kube-system` 命名空间中包含以超级用户账号来访问 API 的 Secrets。{{< /note >}}

    ```shell
    kubectl create clusterrolebinding add-on-cluster-admin \
      --clusterrole=cluster-admin \
      --serviceaccount=kube-system:default
    ```

<!--
3. Grant a role to all service accounts in a namespace

    If you want all applications in a namespace to have a role, no matter what service account they use,
    you can grant a role to the service account group for that namespace.

    For example, grant read-only permission within "my-namespace" to all service accounts in that namespace:

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. Grant a limited role to all service accounts cluster-wide (discouraged)

    If you don't want to manage permissions per-namespace, you can grant a cluster-wide role to all service accounts.

    For example, grant read-only permission across all namespaces to all service accounts in the cluster:

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. Grant super-user access to all service accounts cluster-wide (strongly discouraged)

    If you don't care about partitioning permissions at all, you can grant super-user access to all service accounts.

    {{< warning >}}
    This allows any user with read access
    to secrets or the ability to create a pod to access super-user
    credentials.
    {{< /warning >}}

    ```shell
    kubectl create clusterrolebinding serviceaccounts-cluster-admin \
      --clusterrole=cluster-admin \
      --group=system:serviceaccounts
    ```
-->

3. 将角色授予命名空间中所有的服务账号

    如果你想要在命名空间中所有的应用都具有某角色，无论它们使用的什么服务账号，
    你可以将角色授予该命名空间的服务账号组。

    例如，在命名空间 "my-namespace" 中的只读权限授予该命名空间中的所有服务账号：

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. 对集群范围内的所有服务账户授予一个受限角色（不鼓励）

    如果你不想管理每一个命名空间的权限，你可以向所有的服务账号授予集群范围的角色。

    例如，为集群范围的所有服务账号授予跨所有命名空间的只读权限：

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. 授予超级用户访问权限给集群范围内的所有服务帐户（强烈不鼓励）

    如果你不关心如何区分权限，你可以将超级用户访问权限授予所有服务账号。

    {{< warning >}}
	这将允许所有能够读取 Secrets 和创建 Pods 的用户访问超级用户的私密信息。
    {{< /warning >}}

    ```shell
    kubectl create clusterrolebinding serviceaccounts-cluster-admin \
      --clusterrole=cluster-admin \
      --group=system:serviceaccounts
    ```

<!--
## Upgrading from 1.5

Prior to Kubernetes 1.6, many deployments used very permissive ABAC policies,
including granting full API access to all service accounts.

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

While far more secure, this can be disruptive to existing workloads expecting to automatically receive API permissions.
Here are two approaches for managing this transition:
-->
# 从版本1.5升级

在Kubernetes 1.6版本之前，许多部署可以使用非常宽松的 ABAC 策略，
包括授予所有服务帐户全权访问 API 的能力。

默认的 RBAC 策略被授予控制面组件、节点和控制器。
`kube-system` 命名空间外的服务账号将没有权限
（除了授予所有认证用户的发现权限之外）

这样做虽然安全得多，但可能会干扰期望自动获得 API 权限的现有工作负载。
这里有两种方法来完成这种转变:

<!--
### Parallel Authorizers

Run both the RBAC and ABAC authorizers, and specify a policy file that contains
[the legacy ABAC policy](/docs/reference/access-authn-authz/abac/#policy-file-format):

```
--authorization-mode=RBAC,ABAC --authorization-policy-file=mypolicy.json
```



The RBAC authorizer will attempt to authorize requests first. If it denies an API request,
the ABAC authorizer is then run. This means that any request allowed by *either* the RBAC
or ABAC policies is allowed.

When the apiserver is run with a log level of 5 or higher for the RBAC component (`--vmodule=rbac*=5` or `--v=5`),
you can see RBAC denials in the apiserver log (prefixed with `RBAC DENY:`).
You can use that information to determine which roles need to be granted to which users, groups, or service accounts.
Once you have [granted roles to service accounts](#service-account-permissions) and workloads are running with no RBAC denial messages
in the server logs, you can remove the ABAC authorizer.
-->
### 平行鉴权

同时运行 RBAC 和 ABAC 鉴权模式, 并指定包含
[现有的 ABAC 策略](/docs/reference/access-authn-authz/abac/#policy-file-format) 的策略文件：

```
--authorization-mode=RBAC,ABAC --authorization-policy-file=mypolicy.json
```

RBAC 鉴权器将首先尝试对请求进行鉴权。如果它拒绝 API 请求，
则 ABAC 鉴权器运行。这意味着被 RBAC 或 ABAC 策略所允许的任何请求
都是被允许的请求。

如果 API 服务器启动时，RBAC 组件的日志级别为 5 或更高（`--vmodule=rbac*=5` or `--v=5`），
你可以在 API 服务器的日志中看到 RBAC 的细节 （前缀 `RBAC DENY:`）
您可以使用这些信息来确定需要将哪些角色授予哪些用户、组或服务帐户。
一旦你将 [角色授予服务账号](#服务账号权限) ，工作负载运行时在服务器日志中
没有出现 RBAC 拒绝消息，就可以删除 ABAC 鉴权器。

<!--
## Permissive RBAC Permissions

You can replicate a permissive policy using RBAC role bindings.

{{< warning >}}
The following policy allows **ALL** service accounts to act as cluster administrators.
Any application running in a container receives service account credentials automatically,
and could perform any action against the API, including viewing secrets and modifying permissions.
This is not a recommended policy.

```
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

-->

## 宽松的 RBAC 权限

可以使用 RBAC 角色绑定在多个场合使用宽松的策略。

{{< warning >}}
下面的策略允许 **所有** 服务帐户充当集群管理员。
容器中运行的所有应用程序都会自动收到服务帐户的凭据，
可以对 API 执行任何操作，包括查看 Secrets 和修改权限。
这个策略是不被推荐的。

```
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

{{% /capture %}}
