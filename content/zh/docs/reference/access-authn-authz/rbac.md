---
reviewers:
- erictune
- deads2k
- liggitt
title: 使用 RBAC 授权
content_template: templates/concept
weight: 70
---

{{% capture overview %}}
基于角色的访问控制(RBAC)是一种基于企业中用户的角色来调节控制对计算机或网络资源的访问的方法。
{{% /capture %}}

{{% capture body %}}
`RBAC` 使用 `rbac.authorization.k8s.io` {{< glossary_tooltip text="API Group" term_id="api-group" >}}
作为认证驱动，通过Kubernetes API允许管理员动态配置策略。

在1.8版本中, RBAC 模式是稳定的并且得到rbac.authorization.k8s.io/v1 API支持。

要启用RBAC, 在kubernetes的apiserver中添加 `--authorization-mode=RBAC`参数。

## API 概述

本文将介绍关于RBAC API声明的四种顶级类型，用户可以像其他资源
一样与API资源(via `kubectl`, API calls, etc.)进行交互。例如，
`kubectl apply -f (resource).yml`可以用在以上的任何一个例子
中，读者在此之前可以阅读下面的章节作为引导。

### 角色和集群角色

在RBAC API中，一个角色包含表示一组权限的规则。权限是附加的条件
（没有“拒绝”规则）。一个角色`Role`可以定义在一个命名空间namespace，
或者像`ClusterRole`作用于整个集群范围内。

一个`Role`可以只对单一的命名空间进行授权它的资源控制权限。
这里有一个例子 `Role`在名称为"default" 命名空间，对这个命名空间的pods有读取权限：

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

一个`ClusterRole`可以和`Role`一样授予相同的权限，
但是因为`ClusterRole`属于集群范围，所以它也可以授予以下访问权限：

* 集群范围资源 (比如 nodes)
* 非集群endpoints (比如 "/healthz")
* 跨命名空间的资源 (比如 运行 `kubectl get pods --all-namespaces`下的pods)

下面的例子是`ClusterRole`可以授权对任意命名空间下的secrets有读取权限，
或者跨所有命名空间（取决于它是如何[绑定]的(#rolebinding-and-clusterrolebinding)）:

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

### 绑定角色和绑定集群角色

一个角色绑定将角色中定义的权限赋予一个或者一组用户。
它主要包含以下主体（users, groups, or service accounts）和
赋予角色的绑定。权限可以在指定的命名空间中被赋予`RoleBinding`，
或者在集群范围的命名空间中被赋予如`ClusterRoleBinding`。


一个`RoleBinding`可以引用`Role` 相同的命名空间。
下面的例子`RoleBinding`将"pod-reader"角色给在"default"命名空间中的用户"jane"
同时给用户"jane"读取"default"命名空间中pods的权限。

`roleRef`标签里是你实际创建绑定的方法。 `kind`可以是`Role` 或 `ClusterRole`，
`name`将引用你将要指定的`Role` 或 `ClusterRole`的名称。在下面的例子中，角色绑定使用
`roleRef`将用户"jane" 给角色`Role`，它的名称是 `pod-reader`。

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

一个`RoleBinding`也可以引用`ClusterRole`来赋予命名空间
在`RoleBinding`中`ClusterRole`对应的权限。这可以允许管理者在
整个集群中定义一组通用的角色，然后在多个命名空间中重用它们。

例如下面的例子，`RoleBinding`指定的是`ClusterRole`，
"dave" （主体，大小写敏感）将只可以读取在"development"
命名空间（`RoleBinding`的命名空间）中的"secrets"。


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

最后，一个`ClusterRoleBinding`可以使用集群级别赋予权限和整个命名空间。
下面的例子允许 "manager"组中的任何用户读取任意命名空间中"secrets"的权限。


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

你不能修改`Role`或`ClusterRole`绑定的主体对象。
试图改变`roleRef`的绑定对象将导致验证错误。想要
改变现有绑定对象中`roleRef`字段的内容，必须删除并
重新创建绑定对象，这种限制有两个主要的原因：

1.到不同角色的绑定是完全不同的绑定。更改`roleRef`
需要删除/重建绑定，确保要赋予绑定的完整主体列表是新
的角色（而不是只是启用修改`roleRef`在不验证所有现有
主体的情况下，应该授予新角色权限）。
2.使得`roleRef`不可以改变现有绑定主体用户的`update`权限，
这样可以让它们能够管理主体列表，而不能更改授予这些主体相关
的角色。

命令`kubectl auth reconcile`可以创建或者更新包含RBAC对象的清单文件，
处理删除和重新创建绑定对象如果需要更改它们引用的角色。
更多信息请参照[command usage and examples](#kubectl-auth-reconcile)


### 对资源的引用

大多数资源都是使用名称的字符串表示，比如"pods"出现在相关的API endpoint的URL之中，
然而有有一些Kubernetes APIs频及"subresource"，例如pod的日志，它相关的endpoint URL如下：

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

在这种情况下，"pods"是命名空间的资源，而"log"是pods的子资源。在RBAC角色中，
使用"/"分隔资源和子资源。允许一个主体要同时读取pods和pod logs，你可以这么写：


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

对于某些请求，也可以通过`resourceNames`列表按名称引用资源。
在指定时，可以将请求限制为资源的单个实例。限制一个只可以 "get"和"update"
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

需要注意的是，`create`请求不能被resourceName限制，因为不知道对象名称的
授权时间。另一个例外是 `deletecollection`。


### 聚合集群角色

从1.9开始，集群角色可以通过使用`aggregationRule`的方式组合其他ClusterRoles来创建。
聚合集群角色的权限是由控制器管理，并通过标记规则和提供标签选择器来匹配ClusterRoles。
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
rules: [] # Rules are automatically filled in by the controller manager.
```

创建一个标签选择器匹配的ClusterRole上的规则将成为聚合集群角色。在这种情况下，
可以通过创建另一个具有标签为`rbac.example.com/aggregate-to-monitoring: true`的
ClusterRole作为"monitoring"集群角色。

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

默认的面向用户的角色(如下所述)使用ClusterRole聚合。这让管理者包括规则属性自定义资源，
比如在默认角色上，由CustomResourceDefinitions或Aggregated API servers提供服务。

例如，在以下ClusterRoles中让"admin"和"edit"拥有管理自定义资源"CronTabs"的权限，
"view"角色对资源只有只读操作权限。

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

#### 角色示例

在以下示例中，我们仅截取展示了`rules`部分的定义

允许读取 "pods" 资源的在 {{< glossary_tooltip text="API Group" term_id="api-group" >}}中:

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

允许 读/写 "deployments" 资源在 "extensions"和"apps" API groups中:

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

允许读取 "pods" 和 读/写 "jobs":

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch", "extensions"]
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

允许读取 `ConfigMap` 名称为 "my-config" (需要通过 `RoleBinding` 绑定去限制单一 `ConfigMap` 在单一的 namespace 上):

```yaml
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

允许读取"nodes"资源在core group中（因为`Node` 是集群范围的，所以需要`ClusterRole`绑定`ClusterRoleBinding`才可以有效）

```yaml
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

允许"GET"和"POST"请求在非资源端点"/healthz"和其子路径（必须在`ClusterRole`绑定`ClusterRoleBinding`才有效）

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' in a nonResourceURL is a suffix glob match
  verbs: ["get", "post"]
```

### 对主体的引用

一个`RoleBinding`或者`ClusterRoleBinding`需要绑定角色到 *主体*。
主体可以是 groups, users 或者 service accounts

Users 是由字符串表示，它们可以是普通的用户名，像"alice"，或者是
邮件格式"bob@example.com"，或者是数字ID。由Kubernetes管理员配置[authentication modules](/docs/reference/access-authn-authz/authentication/)
需要的格式。在RBAC授权系统中可以不需要任何特定的格式。但是前缀`system:`是Kubernetes系统保留的，
所以管理员要确保配置的用户名不能出现上述前缀格式。

Group是Kubernetes现在提供的一种身份验证模块，与Users一样，Group字符串没有格式要求，
只是保留的前缀`system:`。

[Service Accounts](/docs/tasks/configure-pod-container/configure-service-account/)是有前缀`system:serviceaccount:`的用户名和
所属指向`system:serviceaccounts:`的组。

#### 角色绑定示例

下面的示例只是展示RoleBinding`中`subjects`的部分。

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

所有的服务账号:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

所有认证过的用户 (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

所有未认证的用户 (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

所有用户 (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

## 默认角色和角色绑定

API servers 创建一组默认的`ClusterRole`和`ClusterRoleBinding`对象。
其中许多是前缀`system:`，表示资源是由基础设施"owned"的。对于这些资源的修改可能导致集群功能失效。
例如，`system:node`是集群角色，它是定义里kubelets的权限，如果这个角色被修改，它将导致kubelets无法正常工作。

所有默认的ClusterRole和ClusterRoleBinding对象都会被标记为`kubernetes.io/bootstrapping=rbac-defaults`。

### 自动更新

在每次启动时，API Server都会更新默认ClusterRole所缺少的各种权限，并更新默认ClusterRoleBinding所缺少的各个角色绑定主体。
这种自动更新机制允许集群修复一些意外的修改。
由于权限和角色绑定主体在新的Kubernetes释出版本中可能变化，这也能够保证角色和角色 绑定始终保持是最新的。

如果要禁止此功能,请将默认ClusterRole以及ClusterRoleBinding的`rbac.authorization.kubernetes.io/autoupdate`设置成`false`。

注意，缺乏默认权限和角色绑定主体可能会导致非功能性集群问题。

自动更新功能在Kubernetes version 1.6+的RBAC认证是默认开启的。

### 发现角色

默认角色绑定授权未经过身份验证的和经过身份验证的用户读取API是安全的，可以公开访问（包括CustomResourceDefinitions），
如果要禁用匿名未经过身份验证的用户访问，请再API server中添加`--anonymous-auth=false`的配置选项。

通过运行 `kubectl` 命令查看这些角色的配置信息:

```
kubectl get clusterroles system:discovery -o yaml
```

注意：不建议编辑角色，因为更改将在 API server重启时自动更新时覆盖（见上文）

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

### 面向用户的角色

一些默认的角色不是前缀`system:`的。这些是面向用户的角色。它们包括super-user角色(`cluster-admin`)，
使用ClusterRoleBindings (`cluster-status`)在集群范围内授予角色，
以及使用RoleBindings (`admin`, `edit`, `view`)在特定命名空间中授予的角色。

在1.9开始，面向用户的角色使用[ClusterRole Aggregation](#aggregated-clusterroles)允许管理员在包含这些角色上的
自定义资源规则。如果想要添加"admin", "edit" 或者 "view" ，需要先创建一个使用以下一个或多个的ClusterRole标签：

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

### 核心组件角色

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

### 其他组件角色

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

### 控制器角色

[Kubernetes controller manager](/docs/admin/kube-controller-manager/) 运行核心控制循环。
当使用 `--use-service-account-credentials`, 每个控制循环使用一个单独的服务账号启动。
每个控制循环都有相应的角色,前缀加上 `system:controller:`标识。
如果控制管理器没有以 `--use-service-account-credentials`启动, 
它使用自己的认证运行所有的控制循环，并且必须授予所有相关的角色。
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

## 初始化与预防权限升级

RBAC API会阻止用户通过编辑角色或者角色绑定来升级权限。 
由于这一点是在API级别实现的，所以在RBAC授权器（RBAC authorizer）未启用的状态下依然可以正常工作。

用户只有在符合下列条件之一的情况下，才能创建/更新角色::


1. 它们已经拥有角色中包含的所有权限，其作用域与被修改的对象相同。
(集群范围内的 `ClusterRole`, 在相同命名空间或者集群范围的 `Role`)
2. 它们被明确地允许允许 `escalate` verb 在 `roles` 或者 `clusterroles` 资源，在 `rbac.authorization.k8s.io` API group 中(Kubernetes 1.12 and newer)

例如，如果"user-1"没有secrets集群范围的权限，它将不能创建`ClusterRole`包含该权限。
下面的方法允许用户创建/更新角色：

1. 授予它们一个角色，允许它们根据需要创建/更新`Role`或者`ClusterRole`对象。
2. 授予它们在创建/更新角色中包含特定权限的权限:
    * 隐式的，通过给它们权限（如果它们试图创建或者更改一个`Role`或`ClusterRole`的权限，自身没有被授权，API请求将被禁止）
    * 或通过允许允许它们权限在`Role`或`ClusterRole`资源中`escalate` verb在`rbac.authorization.k8s.io` API group (Kubernetes 1.12 and newer)

如果用户已经拥有引用角色中包含的权限，则只能创建/更新绑定角色。
（在绑定角色相同的范围内）*或* 如果它们被授予对引用角色执行`bind` verb的显式权限。
例如，如果"user-1"没有集群范围内secret的列表权限，它就不能创建`ClusterRoleBinding`授予
该角色权限，通过以下方法可以允许用户创建/更新角色绑定：

1. 授予它们一个角色，允许它们根据需要创建/更新`RoleBinding`或者`ClusterRoleBinding`对象。
2. 授予它们绑定特定角色所需的权限:
    * 隐式地，通过给它们角色中包含的权限。
    * 显式地，通过允许它们对特定角色（或集群角色）执行`bind` verb

例如，这个集群角色和角色绑定将允许"user-1"有 `admin`, `edit`, 和 `view`在"user-1-namespace"命名空间的权限：

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
当初始化第一个角色和角色绑定时，初始用户需要能够授予他们尚未拥有的权限。 初始化初始角色和角色绑定时需要：

* 在`system:masters` 组中使用凭据, 它将绑定 `cluster-admin` 这个超级用户角色上。
* 如果你的 API server 运行在安全端口上需要使用 (`--insecure-port`), 你也可以通过该端口调用API在没有强制身份验证或授权。

## 一些命令行工具

### `kubectl create role`

创建 `Role` 对象在单一命名空间授予权限，例如:

* 创建 `Role` 名称为 "pod-reader" 运行用户有 "get", "watch" 和 "list" 的权限在pods上:

    ```
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* 创建 `Role` 名称为 "pod-reader" 并指定resourceNames:

    ```
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* 创建 `Role` 名称为 "foo" 并指定apiGroups:

    ```
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* 创建 `Role` 名称为 "foo" 并指定subresource资源权限:

    ```
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```

* 创建 a `Role` 名称为 "my-component-lease-holder" 具有 get/update 对特定名称资源的权限:

    ```
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```

### `kubectl create clusterrole`

创建 `ClusterRole`对象，例如:

* 创建 `ClusterRole` 名称为 "pod-reader" 运行用户有 "get", "watch" and "list" 在pods的权限:

    ```
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* 创建 `ClusterRole` 名称为 "pod-reader" 并指定resourceNames:

    ```
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* 创建 `ClusterRole` 名称为 "foo" 并指定apiGroups:

    ```
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* 创建 `ClusterRole` 名称为 "foo" 并指定subresource权限:

    ```
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* 创建 `ClusterRole` 名称为 "foo" 并知道nonResourceURL:

    ```
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* 创建 `ClusterRole` 名称为 "monitoring" 并指定aggregationRule:

    ```
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```

### `kubectl create rolebinding`

授权 `Role` 或 `ClusterRole` 在特定的命名空间中，例如:

* 在命名空间为 "acme", 授予权限 `admin` `ClusterRole` 对名称为 "bob"的用户:

    ```
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* 在命名空间为 "acme", 授予权限 `view` `ClusterRole` 对于 service account 在命名空间 "acme" 名称为 "myapp" :

    ```
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* 在命名空间为 "acme", 授予权限 `view` `ClusterRole` 对于 service account 在命名空间 "myappnamespace" 名称为 "myapp":

    ```
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```

### `kubectl create clusterrolebinding`

授权 `ClusterRole` 整个集群, 包括所有的命名空间，例如:

* 整个集群, 授权权限 `cluster-admin` `ClusterRole` 对名称为 "root"用户:

    ```
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* 整个集群, 授予权限 `system:node-proxier	` `ClusterRole` 用户名称为 "system:kube-proxy":

    ```
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* 整个集群, 授予权限 `view` `ClusterRole` 给 service account 名称为 "myapp" 在 "acme"命名空间中:

    ```
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

创建或者更新在 `rbac.authorization.k8s.io/v1` API 主体在快速清单中。

将缺少主体并带命名空间的对象被创建，如果需要的话。
更新现有角色，并将权限赋给对应主体中，如果指定`--remove-extra-permissions`将删除额外的权限。

对现有绑定进行更新。将主体赋予包含的对象中，如果指定`--remove-extra-permissions`将删除额外的主体。

例如:

* 测试应用RBAC对象的清单文件，并显示将要进行的更改:

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run
    ```

* 应用RBAC对象的清单文件， 保留任何额外的权限 (in roles) 和任何额外的主体 (in bindings):

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* 应用RBAC对象的清单文件, 删除额外的权限 (in roles)和删除额外的主体 (in bindings):

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
    ```

查看 CLI 帮助获取详细的用法。

## 服务账号权限

默认的RBAC策略将授予在control-plane components, nodes,
and controllers相关的权限, 但是在`kube-system`命名空间外的服务账号将不授予权限。
(超出授予所有认证用户的发现权限)

这一点允许您根据需要向特定服务账号授予特定权限。 细粒度的角色绑定将提供更好的安全性，但需要更多精力管理。
更粗粒度的授权可能授予服务账号不需要的API访问权限（甚至导致潜在授权扩散），但更易于管理。

从最安全到最不安全可以排序以下方法:

1. 对某一特定应用程序的服务账户授予角色（最佳实践）

    This requires the application to specify a `serviceAccountName` in its pod spec,
    and for the service account to be created (via the API, application manifest, `kubectl create serviceaccount`, etc.).

    For example, grant read-only permission within "my-namespace" to the "my-sa" service account:

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. 在某一命名空间中授予”default”服务账号一个角色

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

3. 为命名空间中所有的服务账号授予角色

    If you want all applications in a namespace to have a role, no matter what service account they use,
    you can grant a role to the service account group for that namespace.

    For example, grant read-only permission within "my-namespace" to all service accounts in that namespace:

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. 对集群范围内的所有服务账户授予一个受限角色（不鼓励）

    If you don't want to manage permissions per-namespace, you can grant a cluster-wide role to all service accounts.

    For example, grant read-only permission across all namespaces to all service accounts in the cluster:

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. 授予超级用户访问权限给集群范围内的所有服务帐户（强烈不鼓励）

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

## 从版本1.5升级

在Kubernetes 1.6之前，许多部署使用非常宽松的ABAC策略，
包括授予所有服务帐户的完整API访问权。

默认的RBAC策略被授予control-plane components, nodes,
and controllers, 在`kube-system`命名空间外的服务账号将没有权限。
超出授予所有认证用户的发现权限)

虽然安全得多，但这可能会干扰期望自动接收API权限的现有工作负载。
这里有两种方法来管理这种转变:

### 平行授权

同时运行RBAC和ABAC授权模式, 并指定包含的策略文件。
[the legacy ABAC policy](/docs/reference/access-authn-authz/abac/#policy-file-format):

```
--authorization-mode=RBAC,ABAC --authorization-policy-file=mypolicy.json
```

RBAC授权器将首先尝试授权请求。如果它拒绝API请求，
然后运行ABAC授权器。这意味着RBAC允许的任何请求
或ABAC政策是允许的。

当apiserver运行时，RBAC组件的日志级别为5或更高(`--vmodule=rbac*=5` or `--v=5`),
你可以看到apiserver日志中RBAC的细节 (前缀 `RBAC DENY:`)
您可以使用这些信息来确定需要将哪些角色授予哪些用户、组或服务帐户。
一旦你 [granted roles to service accounts](#service-account-permissions) 和工作负载在没有RBAC拒绝消息的情况下运行
在服务器日志中，可以删除ABAC授权器。

## 宽泛的RBAC权限

可以使用RBAC角色绑定复制许可策略。

{{< warning >}}
下面的策略运行 **ALL** 服务帐户充当集群管理员。
任何在容器中运行的应用程序都会自动接收服务帐户凭据，
可以对API执行任何操作，包括查看秘钥和修改权限，
这不是一个推荐的策略。

```
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

{{% /capture %}}
