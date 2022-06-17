---
title: 使用 RBAC 鑑權
content_type: concept
aliases: [/zh-cn/rbac/]
weight: 70
---

<!--
reviewers:
- erictune
- deads2k
- liggitt
title: Using RBAC Authorization
content_type: concept
aliases: [/rbac/]
weight: 70
-->

<!-- overview -->
<!--
Role-based access control (RBAC) is a method of regulating access to computer or
network resources based on the roles of individual users within your organization.
-->
基於角色（Role）的訪問控制（RBAC）是一種基於組織中使用者的角色來調節控制對
計算機或網路資源的訪問的方法。

<!-- body -->
<!--
RBAC authorization uses the `rbac.authorization.k8s.io`
{{< glossary_tooltip text="API group" term_id="api-group" >}} to drive authorization
decisions, allowing you to dynamically configure policies through the Kubernetes API.
-->
RBAC 鑑權機制使用 `rbac.authorization.k8s.io`
{{< glossary_tooltip text="API 組" term_id="api-group" >}}
來驅動鑑權決定，允許你透過 Kubernetes API 動態配置策略。

<!--
To enable RBAC, start the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
with the `--authorization-mode` flag set to a comma-separated list that includes `RBAC`;
for example:
-->
要啟用 RBAC，在啟動 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}
時將 `--authorization-mode` 引數設定為一個逗號分隔的列表並確保其中包含 `RBAC`。

<!--
```shell
kube-apiserver --authorization-mode=Example,RBAC --other-options --more-options
```
-->
```shell
kube-apiserver --authorization-mode=Example,RBAC --<其他選項> --<其他選項>
```

<!--
## API objects {#api-overview}

The RBAC API declares four kinds of Kubernetes object: _Role_, _ClusterRole_,
_RoleBinding_ and _ClusterRoleBinding_. You can
[describe objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects),
or amend them, using tools such as `kubectl`, just like any other Kubernetes object.

-->
## API 物件  {#api-overview}

RBAC API 聲明瞭四種 Kubernetes 物件：_Role_、_ClusterRole_、_RoleBinding_ 和
_ClusterRoleBinding_。你可以像使用其他 Kubernetes 物件一樣，
透過類似 `kubectl` 這類工具
[描述物件](/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects),
或修補物件。

{{< caution >}}
<!--
These objects, by design, impose access restrictions. If you are making changes
to a cluster as you learn, see
[privilege escalation prevention and bootstrapping](#privilege-escalation-prevention-and-bootstrapping)
to understand how those restrictions can prevent you making some changes.
-->
這些物件在設計時即實施了一些訪問限制。如果你在學習過程中對叢集做了更改，請參考
[避免特權提升和引導](#privilege-escalation-prevention-and-bootstrapping)
一節，以瞭解這些限制會以怎樣的方式阻止你做出修改。
{{< /caution >}}

<!--
### Role and ClusterRole

An RBAC _Role_ or _ClusterRole_ contains rules that represent a set of permissions.
Permissions are purely additive (there are no "deny" rules).

A Role always sets permissions within a particular {{< glossary_tooltip text="namespace" term_id="namespace" >}};
when you create a Role, you have to specify the namespace it belongs in.

ClusterRole, by contrast, is a non-namespaced resource. The resources have different names (Role
and ClusterRole) because a Kubernetes object always has to be either namespaced or not namespaced;
it can't be both.
-->
### Role 和 ClusterRole   {#role-and-clusterole}

RBAC 的 _Role_ 或 _ClusterRole_ 中包含一組代表相關許可權的規則。
這些許可權是純粹累加的（不存在拒絕某操作的規則）。

Role 總是用來在某個{{< glossary_tooltip text="名字空間" term_id="namespace" >}}
內設定訪問許可權；在你建立 Role 時，你必須指定該 Role 所屬的名字空間。

與之相對，ClusterRole 則是一個叢集作用域的資源。這兩種資源的名字不同（Role 和
ClusterRole）是因為 Kubernetes 物件要麼是名字空間作用域的，要麼是叢集作用域的，
不可兩者兼具。

<!--
ClusterRoles have several uses. You can use a ClusterRole to:

1. define permissions on namespaced resources and be granted within individual namespace(s)
1. define permissions on namespaced resources and be granted across all namespaces
1. define permissions on cluster-scoped resources

If you want to define a role within a namespace, use a Role; if you want to define
a role cluster-wide, use a ClusterRole.
-->
ClusterRole 有若干用法。你可以用它來：

1. 定義對某名字空間域物件的訪問許可權，並將在各個名字空間內完成授權；
1. 為名字空間作用域的物件設定訪問許可權，並跨所有名字空間執行授權；
1. 為叢集作用域的資源定義訪問許可權。

如果你希望在名字空間內定義角色，應該使用 Role；
如果你希望定義叢集範圍的角色，應該使用 ClusterRole。

<!--
#### Role example

Here's an example Role in the "default" namespace that can be used to grant read access to
{{< glossary_tooltip text="pods" term_id="pod" >}}:
-->
#### Role 示例 {#role-example}

下面是一個位於 "default" 名字空間的 Role 的示例，可用來授予對
{{< glossary_tooltip text="pods" term_id="pod" >}} 的讀訪問許可權：

<!--
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
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" 標明 core API 組
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

<!--
#### ClusterRole example

A ClusterRole can be used to grant the same permissions as a Role.
Because ClusterRoles are cluster-scoped, you can also use them to grant access to:

* cluster-scoped resources (like {{< glossary_tooltip text="nodes" term_id="node" >}})
* non-resource endpoints (like `/healthz`)
* namespaced resources (like Pods), across all namespaces

  For example: you can use a ClusterRole to allow a particular user to run
  `kubectl get pods --all-namespaces`
-->
###  ClusterRole 示例 {#clusterrole-example}

ClusterRole 可以和 Role 相同完成授權。
因為 ClusterRole 屬於叢集範圍，所以它也可以為以下資源授予訪問許可權：

* 叢集範圍資源（比如 {{< glossary_tooltip text="節點（Node）" term_id="node" >}}）
* 非資源端點（比如 `/healthz`）
* 跨名字空間訪問的名字空間作用域的資源（如 Pods）

  比如，你可以使用 ClusterRole 來允許某特定使用者執行 `kubectl get pods --all-namespaces`

<!--
Here is an example of a ClusterRole that can be used to grant read access to
{{< glossary_tooltip text="secrets" term_id="secret" >}} in any particular namespace,
or across all namespaces (depending on how it is [bound](#rolebinding-and-clusterrolebinding)):
-->
下面是一個 ClusterRole 的示例，可用來為任一特定名字空間中的
{{< glossary_tooltip text="Secret" term_id="secret" >}} 授予讀訪問許可權，
或者跨名字空間的訪問許可權（取決於該角色是如何[繫結](#rolebinding-and-clusterrolebinding)的）：

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced
  name: secret-reader
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Secret
  # objects is "secrets"
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" 被忽略，因為 ClusterRoles 不受名字空間限制
  name: secret-reader
rules:
- apiGroups: [""]
  # 在 HTTP 層面，用來訪問 Secret 資源的名稱為 "secrets"
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

<!--
The name of a Role or a ClusterRole object must be a valid
[path segment name](/docs/concepts/overview/working-with-objects/names#path-segment-names).
-->
Role 或 ClusterRole 物件的名稱必須是合法的
[路徑區段名稱](/zh-cn/docs/concepts/overview/working-with-objects/names#path-segment-names)。

<!--
### RoleBinding and ClusterRoleBinding

A role binding grants the permissions defined in a role to a user or set of users.
It holds a list of *subjects* (users, groups, or service accounts), and a reference to the
role being granted.
A RoleBinding grants permissions within a specific namespace whereas a ClusterRoleBinding
grants that access cluster-wide.

A RoleBinding may reference any Role in the same namespace. Alternatively, a RoleBinding
can reference a ClusterRole and bind that ClusterRole to the namespace of the RoleBinding.
If you want to bind a ClusterRole to all the namespaces in your cluster, you use a
ClusterRoleBinding.

The name of a RoleBinding or ClusterRoleBinding object must be a valid
[path segment name](/docs/concepts/overview/working-with-objects/names#path-segment-names).
-->
### RoleBinding 和 ClusterRoleBinding   {#rolebinding-and-clusterrolebinding}

角色繫結（Role Binding）是將角色中定義的許可權賦予一個或者一組使用者。
它包含若干 **主體**（使用者、組或服務賬戶）的列表和對這些主體所獲得的角色的引用。
RoleBinding 在指定的名字空間中執行授權，而 ClusterRoleBinding 在叢集範圍執行授權。

一個 RoleBinding 可以引用同一的名字空間中的任何 Role。
或者，一個 RoleBinding 可以引用某 ClusterRole 並將該 ClusterRole 繫結到
RoleBinding 所在的名字空間。
如果你希望將某  ClusterRole 繫結到叢集中所有名字空間，你要使用 ClusterRoleBinding。

RoleBinding 或 ClusterRoleBinding 物件的名稱必須是合法的
[路徑區段名稱](/zh-cn/docs/concepts/overview/working-with-objects/names#path-segment-names)。

<!--
#### RoleBinding examples {#rolebinding-example}

Here is an example of a RoleBinding that grants the "pod-reader" Role to the user "jane"
within the "default" namespace.
This allows "jane" to read pods in the "default" namespace.
-->
#### RoleBinding 示例   {#rolebinding-example}

下面的例子中的 RoleBinding 將 "pod-reader" Role 授予在 "default" 名字空間中的使用者 "jane"。
這樣，使用者 "jane" 就具有了讀取 "default" 名字空間中 pods 的許可權。

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "jane" to read pods in the "default" namespace.
# You need to already have a Role named "pod-reader" in that namespace.
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
# You can specify more than one "subject"
- kind: User
  name: jane # "name" is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  # "roleRef" specifies the binding to a Role / ClusterRole
  kind: Role #this must be Role or ClusterRole
  name: pod-reader # this must match the name of the Role or ClusterRole you wish to bind to
  apiGroup: rbac.authorization.k8s.io
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
# 此角色繫結允許 "jane" 讀取 "default" 名字空間中的 Pods
# 你需要在該名稱空間中有一個名為 “pod-reader” 的 Role
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
# 你可以指定不止一個“subject（主體）”
- kind: User
  name: jane # "name" 是區分大小寫的
  apiGroup: rbac.authorization.k8s.io
roleRef:
  # "roleRef" 指定與某 Role 或 ClusterRole 的繫結關係
  kind: Role # 此欄位必須是 Role 或 ClusterRole
  name: pod-reader # 此欄位必須與你要繫結的 Role 或 ClusterRole 的名稱匹配
  apiGroup: rbac.authorization.k8s.io
```

<!--
A RoleBinding can also reference a ClusterRole to grant the permissions defined in that
ClusterRole to resources inside the RoleBinding's namespace. This kind of reference
lets you define a set of common roles across your cluster, then reuse them within
multiple namespaces.

For instance, even though the following RoleBinding refers to a ClusterRole,
"dave" (the subject, case sensitive) will only be able to read Secrets in the "development"
namespace, because the RoleBinding's namespace (in its metadata) is "development".
-->
RoleBinding 也可以引用 ClusterRole，以將對應 ClusterRole 中定義的訪問許可權授予
RoleBinding 所在名字空間的資源。這種引用使得你可以跨整個叢集定義一組通用的角色，
之後在多個名字空間中複用。

例如，儘管下面的 RoleBinding 引用的是一個 ClusterRole，"dave"（這裡的主體，
區分大小寫）只能訪問 "development" 名字空間中的 Secrets 物件，因為 RoleBinding
所在的名字空間（由其 metadata 決定）是 "development"。

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "dave" to read secrets in the "development" namespace.
# You need to already have a ClusterRole named "secret-reader".
kind: RoleBinding
metadata:
  name: read-secrets
  #
  # The namespace of the RoleBinding determines where the permissions are granted.
  # This only grants permissions within the "development" namespace.
  namespace: development
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
```yaml
apiVersion: rbac.authorization.k8s.io/v1
# 此角色繫結使得使用者 "dave" 能夠讀取 "development" 名字空間中的 Secrets
# 你需要一個名為 "secret-reader" 的 ClusterRole
kind: RoleBinding
metadata:
  name: read-secrets
  # RoleBinding 的名字空間決定了訪問許可權的授予範圍。
  # 這裡隱含授權僅在 "development" 名字空間內的訪問許可權。
  namespace: development
subjects:
- kind: User
  name: dave # 'name' 是區分大小寫的
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

<!--
#### ClusterRoleBinding example

To grant permissions across a whole cluster, you can use a ClusterRoleBinding.
The following ClusterRoleBinding allows any user in the group "manager" to read
secrets in any namespace.
-->
#### ClusterRoleBinding 示例   {#clusterrolebinding-example}

要跨整個叢集完成訪問許可權的授予，你可以使用一個 ClusterRoleBinding。
下面的 ClusterRoleBinding 允許 "manager" 組內的所有使用者訪問任何名字空間中的
Secrets。

<!--
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
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
# 此叢集角色繫結允許 “manager” 組中的任何人訪問任何名字空間中的 secrets
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # 'name' 是區分大小寫的
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

<!--
After you create a binding, you cannot change the Role or ClusterRole that it refers to.
If you try to change a binding's `roleRef`, you get a validation error. If you do want
to change the `roleRef` for a binding, you need to remove the binding object and create
a replacement.

There are two reasons for this restriction:
-->
建立了繫結之後，你不能再修改繫結物件所引用的 Role 或 ClusterRole。
試圖改變繫結物件的 `roleRef` 將導致合法性檢查錯誤。
如果你想要改變現有繫結物件中 `roleRef` 欄位的內容，必須刪除重新建立繫結物件。

這種限制有兩個主要原因：

<!--
1. Making `roleRef` immutable allows granting someone `update` permission on an existing binding
object, so that they can manage the list of subjects, without being able to change
the role that is granted to those subjects.
-->
1. 將 `roleRef` 設定為不可以改變，這使得可以為使用者授予對現有繫結物件的 `update` 許可權，
   這樣可以讓他們管理主體列表，同時不能更改被授予這些主體的角色。
<!--

1. A binding to a different role is a fundamentally different binding.
Requiring a binding to be deleted/recreated in order to change the `roleRef`
ensures the full list of subjects in the binding is intended to be granted
the new role (as opposed to enabling or accidentally modifying only the roleRef
without verifying all of the existing subjects should be given the new role's
permissions).
-->
1. 針對不同角色的繫結是完全不一樣的繫結。要求透過刪除/重建繫結來更改 `roleRef`,
   這樣可以確保要賦予繫結的所有主體會被授予新的角色（而不是在允許或者不小心修改
   了 `roleRef` 的情況下導致所有現有主體未經驗證即被授予新角色對應的許可權）。

<!--
The `kubectl auth reconcile` command-line utility creates or updates a manifest file containing RBAC objects,
and handles deleting and recreating binding objects if required to change the role they refer to.
See [command usage and examples](#kubectl-auth-reconcile) for more information.
-->
命令 `kubectl auth reconcile` 可以建立或者更新包含 RBAC 物件的清單檔案，
並且在必要的情況下刪除和重新建立繫結物件，以改變所引用的角色。
更多相關資訊請參照[命令用法和示例](#kubectl-auth-reconcile)

<!--
### Referring to resources
-->
### 對資源的引用    {#referring-to-resources}

<!--
In the Kubernetes API, most resources are represented and accessed using a string representation of
their object name, such as `pods` for a Pod. RBAC refers to resources using exactly the same
name that appears in the URL for the relevant API endpoint.
Some Kubernetes APIs involve a
_subresource_, such as the logs for a Pod. A request for a Pod's logs looks like:
-->
在 Kubernetes API 中，大多數資源都是使用物件名稱的字串表示來呈現與訪問的。
例如，對於 Pod 應使用 "pods"。
RBAC 使用對應 API 端點的 URL 中呈現的名字來引用資源。
有一些 Kubernetes API 涉及 **子資源（subresource）**，例如 Pod 的日誌。
對 Pod 日誌的請求看起來像這樣：

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

<!--
In this case, `pods` is the namespaced resource for Pod resources, and `log` is a
subresource of `pods`. To represent this in an RBAC role, use a slash (`/`) to
delimit the resource and subresource. To allow a subject to read `pods` and
also access the `log` subresource for each of those Pods, you write:
-->
在這裡，`pods` 對應名字空間作用域的 Pod 資源，而 `log` 是 `pods` 的子資源。
在 RBAC 角色表達子資源時，使用斜線（`/`）來分隔資源和子資源。
要允許某主體讀取 `pods` 同時訪問這些 Pod 的 `log` 子資源，你可以這麼寫：

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
You can also refer to resources by name for certain requests through the `resourceNames` list.
When specified, requests can be restricted to individual instances of a resource.
Here is an example that restricts its subject to only `get` or `update` a
{{< glossary_tooltip term_id="ConfigMap" >}} named `my-configmap`:
-->
對於某些請求，也可以透過 `resourceNames` 列表按名稱引用資源。
在指定時，可以將請求限定為資源的單個例項。
下面的例子中限制可以 "get" 和 "update" 一個名為 `my-configmap` 的
{{< glossary_tooltip term_id="ConfigMap" >}}：

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing ConfigMap
  # objects is "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  # 在 HTTP 層面，用來訪問 ConfigMap 資源的名稱為 "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

{{< note >}}
<!--
You cannot restrict `create` or `deletecollection` requests by their resource name.
For `create`, this limitation is because the name of the new object may not be known at authorization time.
If you restrict `list` or `watch` by resourceName, clients must include a `metadata.name` field selector in their `list` or `watch` request that matches the specified resourceName in order to be authorized.
For example, `kubectl get configmaps --field-selector=metadata.name=my-configmap`
-->
你不能使用資源名字來限制 `create` 或者 `deletecollection` 請求。
對於 `create` 請求而言，這是因為在鑑權時可能還不知道新物件的名字。
如果你使用 resourceName 來限制 `list` 或者 `watch` 請求，
客戶端必須在它們的 `list` 或者 `watch` 請求裡包含一個與指定的 resourceName 匹配的 `metadata.name` 欄位選擇器。
例如，`kubectl get configmaps --field-selector=metadata.name=my-configmap`
{{< /note >}}

<!--
### Aggregated ClusterRoles

You can _aggregate_ several ClusterRoles into one combined ClusterRole.
A controller, running as part of the cluster control plane, watches for ClusterRole
objects with an `aggregationRule` set. The `aggregationRule` defines a label
{{< glossary_tooltip text="selector" term_id="selector" >}} that the controller
uses to match other ClusterRole objects that should be combined into the `rules`
field of this one.

Here is an example aggregated ClusterRole:
-->
### 聚合的 ClusterRole    {#aggregated-clusterroles}

你可以將若干 ClusterRole **聚合（Aggregate）** 起來，形成一個複合的 ClusterRole。
某個控制器作為叢集控制面的一部分會監視帶有 `aggregationRule` 的 ClusterRole
物件集合。`aggregationRule` 為控制器定義一個標籤
{{< glossary_tooltip text="選擇算符" term_id="selector" >}}供後者匹配
應該組合到當前 ClusterRole 的 `roles` 欄位中的 ClusterRole 物件。

下面是一個聚合 ClusterRole 的示例：

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # The control plane automatically fills in the rules
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # 控制面自動填充這裡的規則
```

<!--
If you create a new ClusterRole that matches the label selector of an existing aggregated ClusterRole,
that change triggers adding the new rules into the aggregated ClusterRole.
Here is an example that adds rules to the "monitoring" ClusterRole, by creating another
ClusterRole labeled `rbac.example.com/aggregate-to-monitoring: true`.
-->
如果你建立一個與某個已存在的聚合 ClusterRole 的標籤選擇算符匹配的 ClusterRole，
這一變化會觸發新的規則被新增到聚合 ClusterRole 的操作。
下面的例子中，透過建立一個標籤同樣為 `rbac.example.com/aggregate-to-monitoring: true`
的 ClusterRole，新的規則可被新增到 "monitoring" ClusterRole 中。

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpoints
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# When you create the "monitoring-endpoints" ClusterRole,
# the rules below will be added to the "monitoring" ClusterRole.
rules:
- apiGroups: [""]
  resources: ["services", "endpoints", "pods"]
  verbs: ["get", "list", "watch"]
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpoints
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# 當你建立 "monitoring-endpoints" ClusterRole 時，
# 下面的規則會被新增到 "monitoring" ClusterRole 中
rules:
- apiGroups: [""]
  resources: ["services", "endpoints", "pods"]
  verbs: ["get", "list", "watch"]
```

<!--
The [default user-facing roles](#default-roles-and-role-bindings) use ClusterRole aggregation. This lets you,
as a cluster administrator, include rules for custom resources, such as those served by
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
or aggregated API servers, to extend the default roles.

For example: the following ClusterRoles let the "admin" and "edit" default roles manage the custom resource
named CronTab, whereas the "view" role can perform only read actions on CronTab resources.
You can assume that CronTab objects are named `"crontabs"` in URLs as seen by the API server.
-->
預設的[面向使用者的角色](#default-roles-and-role-bindings)使用 ClusterRole 聚合。
這使得作為叢集管理員的你可以為擴充套件預設規則，包括為定製資源設定規則，
比如透過 CustomResourceDefinitions 或聚合 API 伺服器提供的定製資源。

例如，下面的 ClusterRoles 讓預設角色 "admin" 和 "edit" 擁有管理自定義資源 "CronTabs" 的許可權，
 "view" 角色對 CronTab 資源擁有讀操作許可權。
你可以假定 CronTab 物件在 API 伺服器所看到的 URL 中被命名為 `"crontabs"`。

<!--
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
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # 新增以下許可權到預設角色 "admin" 和 "edit" 中
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
    # 新增以下許可權到 "view" 預設角色中
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

<!--
#### Role examples

The following examples are excerpts from Role or ClusterRole objects, showing only
the `rules` section.

Allow reading `"pods"` resources in the core
{{< glossary_tooltip text="API Group" term_id="api-group" >}}:
-->
#### Role 示例   {#role-examples}

以下示例均為從 Role 或 ClusterRole 物件中截取出來，我們僅展示其 `rules` 部分。

允許讀取在核心 {{< glossary_tooltip text="API 組" term_id="api-group" >}}下的
`"Pods"`：

<!--
```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Pod
  # objects is "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```
-->
```yaml
rules:
- apiGroups: [""]
  # 在 HTTP 層面，用來訪問 Pod 資源的名稱為 "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

<!--
Allow reading/writing Deployments (at the HTTP level: objects with `"deployments"`
in the resource part of their URL) in the `"apps"` API groups:
-->
允許在 `"apps"` API 組中讀/寫 Deployment（在 HTTP 層面，對應 URL
中資源部分為 `"deployments"`）：

<!--
```yaml
rules:
- apiGroups: ["apps"]
  #
  # at the HTTP level, the name of the resource for accessing Deployment
  # objects is "deployments"
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```
-->
```yaml
rules:
- apiGroups: ["apps"]
  #
  # 在 HTTP 層面，用來訪問 Deployment 資源的名稱為 "deployments"
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

<!--
Allow reading Pods in the core API group, as well as reading or writing Job
resources in the `"batch"` API group:
-->
允許讀取核心 API 組中的 Pod 和讀/寫 `"batch"` API 組中的 Job 資源：

<!--
```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Pod
  # objects is "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch"]
  #
  # at the HTTP level, the name of the resource for accessing Job
  # objects is "jobs"
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```
-->
```yaml
rules:
- apiGroups: [""]
  # 在 HTTP 層面，用來訪問 Pod 資源的名稱為 "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch"]
  # 在 HTTP 層面，用來訪問 Job 資源的名稱為 "jobs"
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

<!--
Allow reading a ConfigMap named "my-config" (must be bound with a
RoleBinding to limit to a single ConfigMap in a single namespace):
-->
允許讀取名稱為 "my-config" 的 ConfigMap（需要透過 RoleBinding 繫結以
限制為某名字空間中特定的 ConfigMap）：

<!--
```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing ConfigMap
  # objects is "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```
-->
```yaml
rules:
- apiGroups: [""]
  # 在 HTTP 層面，用來訪問 ConfigMap 資源的名稱為 "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

<!--
Allow reading the resource `"nodes"` in the core group (because a
Node is cluster-scoped, this must be in a ClusterRole bound with a
ClusterRoleBinding to be effective):
-->
允許讀取在核心組中的 `"nodes"` 資源（因為 `Node` 是叢集作用域的，所以需要
ClusterRole 繫結到 ClusterRoleBinding 才生效）：

<!--
```yaml
rules:
- apiGroups: [""]
  #
  # at the HTTP level, the name of the resource for accessing Node
  # objects is "nodes"
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```
-->
```yaml
rules:
- apiGroups: [""]
  # 在 HTTP 層面，用來訪問 Node 資源的名稱為 "nodes"
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

<!--
Allow GET and POST requests to the non-resource endpoint `/healthz` and
all subpaths (must be in a ClusterRole bound with a ClusterRoleBinding
to be effective):
-->
允許針對非資源端點 `/healthz` 和其子路徑上發起 GET 和 POST 請求
（必須在 ClusterRole 繫結 ClusterRoleBinding 才生效）：

<!--
```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' in a nonResourceURL is a suffix glob match
  verbs: ["get", "post"]
```
-->
```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # nonResourceURL 中的 '*' 是一個全域性萬用字元
  verbs: ["get", "post"]
```

<!--
### Referring to subjects

A RoleBinding or ClusterRoleBinding binds a role to subjects.
Subjects can be groups, users or
{{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}}.

Kubernetes represents usernames as strings.
These can be: plain names, such as "alice"; email-style names, like "bob@example.com";
or numeric user IDs represented as a string.  It is up to you as a cluster administrator
to configure the [authentication modules](/docs/reference/access-authn-authz/authentication/)
so that authentication produces usernames in the format you want.
-->
### 對主體的引用   {#referring-to-subjects}

RoleBinding 或者 ClusterRoleBinding 可繫結角色到某 **主體（Subject）** 上。
主體可以是組，使用者或者
{{< glossary_tooltip text="服務賬戶" term_id="service-account" >}}。

Kubernetes 用字串來表示使用者名稱。
使用者名稱可以是普通的使用者名稱，像 "alice"；或者是郵件風格的名稱，如 "bob@example.com"，
或者是以字串形式表達的數字 ID。
你作為 Kubernetes 管理員負責配置
[身份認證模組](/zh-cn/docs/reference/access-authn-authz/authentication/)
以便後者能夠生成你所期望的格式的使用者名稱。


{{< caution >}}
<!--
The prefix `system:` is reserved for Kubernetes system use, so you should ensure
that you don't have users or groups with names that start with `system:` by
accident.
Other than this special prefix, the RBAC authorization system does not require any format
for usernames.
-->
字首 `system:` 是 Kubernetes 系統保留的，所以你要確保
所配置的使用者名稱或者組名不能出現上述 `system:` 字首。
除了對字首的限制之外，RBAC 鑑權系統不對使用者名稱格式作任何要求。
{{< /caution >}}

<!--
In Kubernetes, Authenticator modules provide group information.
Groups, like users, are represented as strings, and that string has no format requirements,
other than that the prefix `system:` is reserved.

[ServiceAccounts](/docs/tasks/configure-pod-container/configure-service-account/) have names prefixed
with `system:serviceaccount:`, and belong to groups that have names prefixed with `system:serviceaccounts:`.
-->
在 Kubernetes 中，鑑權模組提供使用者組資訊。
與使用者名稱一樣，使用者組名也用字串來表示，而且對該字串沒有格式要求，
只是不能使用保留的字首 `system:`。

[服務賬戶](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
的使用者名稱字首為 `system:serviceaccount:`，屬於字首為 `system:serviceaccounts:`
的使用者組。

{{< note >}}
<!--
- `system:serviceaccount:` (singular) is the prefix for service account usernames.
- `system:serviceaccounts:` (plural) is the prefix for service account groups.
-->
- `system:serviceaccount:` （單數）是用於服務賬戶使用者名稱的字首；
- `system:serviceaccounts:` （複數）是用於服務賬戶組名的字首。
{{< /note >}}

<!--
#### RoleBinding examples {#role-binding-examples}

The following examples are `RoleBinding` excerpts that only
show the `subjects` section.

For a user named `alice@example.com`:
-->
#### RoleBinding 示例   {#role-binding-examples}

下面示例是 `RoleBinding` 中的片段，僅展示其 `subjects` 的部分。

對於名稱為 `alice@example.com` 的使用者：

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

<!--
For a group named `frontend-admins`:
-->
對於名稱為 `frontend-admins` 的使用者組：

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

<!--
For the default service account in the "kube-system" namespace:
-->
對於 `kube-system` 名字空間中的預設服務賬戶：

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

<!--
For all service accounts in the "qa" namespace:
-->
對於 "qa" 名稱空間中的所有服務賬戶：

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

<!--
For all service accounts in any namespace:
-->
對於在任何名字空間中的服務賬戶：

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

<!--
For all authenticated users:
-->
對於所有已經過認證的使用者：

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

<!--
For all unauthenticated users:
-->
對於所有未透過認證的使用者：

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

<!--
For all users:
-->
對於所有使用者：

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
## Default roles and role bindings

API servers create a set of default ClusterRole and ClusterRoleBinding objects.
Many of these are `system:` prefixed, which indicates that the resource is directly
managed by the cluster control plane.
All of the default ClusterRoles and ClusterRoleBindings are labeled with `kubernetes.io/bootstrapping=rbac-defaults`.
-->
## 預設 Roles 和 Role Bindings {#default-roles-and-role-bindings}

API 伺服器建立一組預設的 ClusterRole 和 ClusterRoleBinding 物件。
這其中許多是以 `system:` 為字首的，用以標識對應資源是直接由叢集控制面管理的。
所有的預設 ClusterRole 和 ClusterRoleBinding 都有
`kubernetes.io/bootstrapping=rbac-defaults`
標籤。

{{< caution >}}
<!--
Take care when modifying ClusterRoles and ClusterRoleBindings with names
that have a `system:` prefix.
Modifications to these resources can result in non-functional clusters.
-->
在修改名稱包含 `system:` 字首的 ClusterRole 和 ClusterRoleBinding
時要格外小心。
對這些資源的更改可能導致叢集無法正常運作。
{{< /caution >}}

<!--
### Auto-reconciliation

At each start-up, the API server updates default cluster roles with any missing permissions,
and updates default cluster role bindings with any missing subjects.
This allows the cluster to repair accidental modifications, and helps to keep roles and role bindings
up-to-date as permissions and subjects change in new Kubernetes releases.

To opt out of this reconciliation, set the `rbac.authorization.kubernetes.io/autoupdate`
annotation on a default cluster role or rolebinding to `false`.
Be aware that missing default permissions and subjects can result in non-functional clusters.

Auto-reconciliation is enabled by default if the RBAC authorizer is active.
-->
### 自動協商   {#auto-reconciliation}

在每次啟動時，API 伺服器都會更新預設 ClusterRole 以新增缺失的各種許可權，並更新
預設的 ClusterRoleBinding 以增加缺失的各類主體。
這種自動協商機制允許叢集去修復一些不小心發生的修改，並且有助於保證角色和角色繫結
在新的發行版本中有許可權或主體變更時仍然保持最新。

如果要禁止此功能，請將預設 ClusterRole 以及 ClusterRoleBinding 的
`rbac.authorization.kubernetes.io/autoupdate` 註解設定成 `false`。
注意，缺少預設許可權和角色繫結主體可能會導致叢集無法正常工作。

如果基於 RBAC 的鑑權機制被啟用，則自動協商功能預設是被啟用的。

<!--
### API discovery roles {#discovery-roles}

Default role bindings authorize unauthenticated and authenticated users to read API information that is deemed safe to be publicly accessible (including CustomResourceDefinitions). To disable anonymous unauthenticated access, add `--anonymous-auth=false` to the API server configuration.

To view the configuration of these roles via `kubectl` run:
-->
### API 發現角色  {#discovery-roles}

無論是經過身份驗證的還是未經過身份驗證的使用者，預設的角色繫結都授權他們讀取被認為
是可安全地公開訪問的 API（包括 CustomResourceDefinitions）。
如果要禁用匿名的未經過身份驗證的使用者訪問，請在 API 伺服器配置中中新增
`--anonymous-auth=false` 的配置選項。

透過執行命令 `kubectl` 可以檢視這些角色的配置資訊:

```shell
kubectl get clusterroles system:discovery -o yaml
```

{{< note >}}
<!--
If you edit that ClusterRole, your changes will be overwritten on API server restart
via [auto-reconciliation](#auto-reconciliation). To avoid that overwriting,
either do not manually edit the role, or disable auto-reconciliation.
-->
如果你編輯該 ClusterRole，你所作的變更會被 API 伺服器在重啟時自動覆蓋，
這是透過[自動協商](#auto-reconciliation)機制完成的。要避免這類覆蓋操作，
要麼不要手動編輯這些角色，要麼禁止自動協商機制。
{{< /note >}}

<table>
<!--
<caption>Kubernetes RBAC API discovery roles</caption>
-->
<caption>Kubernetes RBAC API 發現角色</caption>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<!--
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
-->
<th>預設 ClusterRole</th>
<th>預設 ClusterRoleBinding</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:basic-user</b></td>
<!--
<td><b>system:authenticated</b> group</td>
-->
<td><b>system:authenticated</b> 組</td>
<td>
<!--
Allows a user read-only access to basic information about themselves.
Prior to v1.14, this role was also bound to <tt>system:unauthenticated</tt> by default.
-->
允許使用者以只讀的方式去訪問他們自己的基本資訊。在 v1.14 版本之前，這個角色在預設情況下也繫結在 <tt>system:unauthenticated</tt> 上。
</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<!--
<td><b>system:authenticated</b> group</td>
-->
<td><b>system:authenticated</b> 組</td>
<td>
<!--
Allows read-only access to API discovery endpoints needed to discover and negotiate an API level.
Prior to v1.14, this role was also bound to <tt>system:unauthenticated</tt> by default.
-->
允許以只讀方式訪問 API 發現端點，這些端點用來發現和協商 API 級別。
在 v1.14 版本之前，這個角色在預設情況下繫結在 <tt>system:unauthenticated</tt> 上。
</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<!--
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
-->
<td><b>system:authenticated</b> 和 <b>system:unauthenticated</b> 組</td>
<td>
<!--
Allows read-only access to non-sensitive information about the cluster. Introduced in Kubernetes v1.14.
-->
允許對叢集的非敏感資訊進行只讀訪問，它是在 v1.14 版本中引入的。
</td>
</tr>
</tbody>
</table>

<!--
### User-facing roles

Some of the default ClusterRoles are not `system:` prefixed. These are intended to be user-facing roles.
They include super-user roles (`cluster-admin`), roles intended to be granted cluster-wide
using ClusterRoleBindings, and roles intended to be granted within particular
namespaces using RoleBindings (`admin`, `edit`, `view`).

User-facing ClusterRoles use [ClusterRole aggregation](#aggregated-clusterroles) to allow admins to include
rules for custom resources on these ClusterRoles. To add rules to the `admin`, `edit`, or `view` roles, create
a ClusterRole with one or more of the following labels:
-->
### 面向使用者的角色   {#user-facing-roles}

一些預設的 ClusterRole 不是以字首 `system:` 開頭的。這些是面向使用者的角色。
它們包括超級使用者（Super-User）角色（`cluster-admin`）、
使用 ClusterRoleBinding 在叢集範圍內完成授權的角色（`cluster-status`）、
以及使用 RoleBinding 在特定名字空間中授予的角色（`admin`、`edit`、`view`）。

面向使用者的 ClusterRole 使用 [ClusterRole 聚合](#aggregated-clusterroles)以允許管理員在
這些 ClusterRole 上新增用於定製資源的規則。如果想要新增規則到 `admin`、`edit` 或者 `view`，
可以建立帶有以下一個或多個標籤的 ClusterRole：

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<!--
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
-->
<th>預設 ClusterRole</th>
<th>預設 ClusterRoleBinding</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>cluster-admin</b></td>
<!--
<td><b>system:masters</b> group</td>
-->
<td><b>system:masters</b> 組</td>
<td>
<!--
Allows super-user access to perform any action on any resource.
When used in a <b>ClusterRoleBinding</b>, it gives full control over every resource in the cluster and in all namespaces.
When used in a <b>RoleBinding</b>, it gives full control over every resource in the role binding's namespace, including the namespace itself.
-->
允許超級使用者在平臺上的任何資源上執行所有操作。
當在 <b>ClusterRoleBinding</b> 中使用時，可以授權對叢集中以及所有名字空間中的全部資源進行完全控制。
當在 <b>RoleBinding</b> 中使用時，可以授權控制角色繫結所在名字空間中的所有資源，包括名字空間本身。
</td>
</tr>
<tr>
<td><b>admin</b></td>
<!--
<td>None</td>
--->
<td>無</td>
<td>
<!--
Allows admin access, intended to be granted within a namespace using a <b>RoleBinding</b>.
If used in a <b>RoleBinding</b>, allows read/write access to most resources in a namespace,
including the ability to create roles and role bindings within the namespace.
This role does not allow write access to resource quota or to the namespace itself.
This role also does not allow write access to Endpoints in clusters created
using Kubernetes v1.22+. More information is available in the
["Write Access for Endpoints" section](#write-access-for-endpoints).
-->
允許管理員訪問許可權，旨在使用 <b>RoleBinding</b> 在名字空間內執行授權。

如果在 <b>RoleBinding</b> 中使用，則可授予對名字空間中的大多數資源的讀/寫許可權，
包括建立角色和角色繫結的能力。
此角色不允許對資源配額或者名字空間本身進行寫操作。
此角色也不允許對 Kubernetes v1.22+ 建立的 Endpoints 進行寫操作。
更多資訊參閱 [“Endpoints 寫許可權”小節](#write-access-for-endpoints)。
</td>
</tr>
<tr>
<td><b>edit</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Allows read/write access to most objects in a namespace.
This role does not allow viewing or modifying roles or role bindings.
However, this role allows accessing Secrets and running Pods as any ServiceAccount in
the namespace, so it can be used to gain the API access levels of any ServiceAccount in
the namespace. This role also does not allow write access to Endpoints in
clusters created using Kubernetes v1.22+. More information is available in the
["Write Access for Endpoints" section](#write-access-for-endpoints).
-->
允許對名字空間的大多數物件進行讀/寫操作。

它不允許檢視或者修改角色或者角色繫結。
不過，此角色可以訪問 Secret，以名字空間中任何 ServiceAccount 的身份執行 Pods，
所以可以用來了解名字空間內所有服務賬戶的 API 訪問級別。
此角色也不允許對 Kubernetes v1.22+ 建立的 Endpoints 進行寫操作。
更多資訊參閱 [“Endpoints 寫操作”小節](#write-access-for-endpoints)。
</td>
</tr>
<tr>
<td><b>view</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Allows read-only access to see most objects in a namespace.
It does not allow viewing roles or rolebindings.
-->
允許對名字空間的大多數物件有隻讀許可權。
它不允許檢視角色或角色繫結。

<!--
This role does not allow viewing Secrets, since reading
the contents of Secrets enables access to ServiceAccount credentials
in the namespace, which would allow API access as any ServiceAccount
in the namespace (a form of privilege escalation).
-->
此角色不允許檢視 Secrets，因為讀取 Secret 的內容意味著可以訪問名字空間中
ServiceAccount 的憑據資訊，進而允許利用名字空間中任何 ServiceAccount 的
身份訪問 API（這是一種特權提升）。
</td>
</tr>
</tbody>
</table>

<!--
### Core component roles
-->
### 核心元件角色   {#core-component-roles}

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<!--
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
-->
<th>預設 ClusterRole</th>
<th>預設 ClusterRoleBinding</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:kube-scheduler</b></td>
<!--
<td><b>system:kube-scheduler</b> user</td>
-->
<td><b>system:kube-scheduler</b> 使用者</td>
<td>
<!--
Allows access to the resources required by the {{< glossary_tooltip term_id="kube-scheduler" text="scheduler" >}} component.
-->
允許訪問 {{< glossary_tooltip term_id="kube-scheduler" text="scheduler" >}}
元件所需要的資源。
</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<!--
<td><b>system:kube-scheduler</b> user</td>
-->
<td><b>system:kube-scheduler</b> 使用者</td>
<td>
<!--
Allows access to the volume resources required by the kube-scheduler component.
-->
允許訪問 kube-scheduler 元件所需要的卷資源。
</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<!--
<td><b>system:kube-controller-manager</b> user</td>
-->
<td><b>system:kube-controller-manager</b> 使用者</td>
<td>
<!--
Allows access to the resources required by the {{< glossary_tooltip term_id="kube-controller-manager" text="controller manager" >}} component.
The permissions required by individual controllers are detailed in the <a href="#controller-roles">controller roles</a>.
-->
允許訪問{{< glossary_tooltip term_id="kube-controller-manager" text="控制器管理器" >}}
元件所需要的資源。
各個控制迴路所需要的許可權在<a href="#controller-roles">控制器角色</a>詳述。
</td>
</tr>
<tr>
<td><b>system:node</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Allows access to resources required by the kubelet, <b>including read access to all secrets, and write access to all pod status objects</b>.
-->
允許訪問 kubelet 所需要的資源，<b>包括對所有 Secret 的讀操作和對所有 Pod 狀態物件的寫操作。</b>

<!--
You should use the <a href="/docs/reference/access-authn-authz/node/">Node authorizer</a> and
<a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction admission plugin</a>
instead of the <tt>system:node</tt> role, and allow granting API access to kubelets based on the Pods scheduled to run on them.
-->
你應該使用 <a href="/zh-cn/docs/reference/access-authn-authz/node/">Node 鑑權元件</a>和
<a href="/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction 准入外掛</a>而不是
<tt>system:node</tt> 角色。同時基於 kubelet 上排程執行的 Pod 來授權
kubelet 對 API 的訪問。

<!--
The <tt>system:node</tt> role only exists for compatibility with Kubernetes clusters upgraded from versions prior to v1.8.
-->
<tt>system:node</tt> 角色的意義僅是為了與從 v1.8 之前版本升級而來的叢集相容。
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<!-- <td><b>system:kube-proxy</b> user</td> -->
<td><b>system:kube-proxy</b> 使用者</td>
<!-- td>Allows access to the resources required by the {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} component.</td-->
<td>允許訪問 {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
元件所需要的資源。</td>
</tr>
</tbody>
</table>

<!--
### Other component roles
-->
### 其他元件角色    {#other-component-roles}

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<!--
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
-->
<th>預設 ClusterRole</th>
<th>預設 ClusterRoleBinding</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:auth-delegator</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Allows delegated authentication and authorization checks.
This is commonly used by add-on API servers for unified authentication and authorization.
-->
允許將身份認證和鑑權檢查操作外包出去。
這種角色通常用在外掛式 API 伺服器上，以實現統一的身份認證和鑑權。
</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Role for the <a href="https://github.com/kubernetes/heapster">Heapster</a> component (deprecated).
-->
為 <a href="https://github.com/kubernetes/heapster">Heapster</a> 元件（已棄用）定義的角色。
</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<!-- td>Role for the <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> component.</td -->
<td>為 <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> 元件定義的角色。</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<!--
<td><b>kube-dns</b> service account in the <b>kube-system</b> namespace</td>
-->
<td>在 <b>kube-system</b> 名字空間中的 <b>kube-dns</b> 服務賬戶</td>
<!-- td>Role for the <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a> component.</td -->
<td>為 <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a> 元件定義的角色。</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Allows full access to the kubelet API.
-->
允許 kubelet API 的完全訪問許可權。
</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Allows access to the resources required to perform
<a href="/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/">Kubelet TLS bootstrapping</a>.
-->
允許訪問執行
<a href="/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/">kubelet TLS 啟動引導</a>
所需要的資源。
</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Role for the <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> component.
-->
為 <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> 元件定義的角色。
</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<!--
<td>None</td>
-->
<td>無</td>
<td>
<!--
Allows access to the resources required by most <a href="/docs/concepts/storage/persistent-volumes/#dynamic">dynamic volume provisioners</a>.
-->
允許訪問大部分
<a href="/zh-cn/docs/concepts/storage/persistent-volumes/#dynamic">動態卷驅動</a>
所需要的資源。
</td>
</tr>
<tr>
<td><b>system:monitoring</b></td>
<!--
<td><b>system:monitoring</b> group</td>
-->
<td><b>system:monitoring</b> 組</td>
<td>
<!--
Allows read access to control-plane monitoring endpoints
(i.e. {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} liveness and readiness endpoints
(<tt>/healthz</tt>, <tt>/livez</tt>, <tt>/readyz</tt>), the individual health-check endpoints
(<tt>/healthz/*</tt>, <tt>/livez/*</tt>, <tt>/readyz/*</tt>),  and <tt>/metrics</tt>).
 Note that individual health check endpoints and the metric endpoint may expose sensitive information.
-->
允許對控制平面監控端點的讀取訪問（例如：{{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
存活和就緒端點（<tt>/healthz</tt>、<tt>/livez</tt>、<tt>/readyz</tt>），
各個健康檢查端點（<tt>/healthz/*</tt>、<tt>/livez/*</tt>、<tt>/readyz/*</tt>）和 <tt>/metrics</tt>）。
請注意，各個執行狀況檢查端點和度量標準端點可能會公開敏感資訊。
</td>
</tr>
</tbody>
</table>

<!--
### Roles for built-in controllers {#controller-roles}

The Kubernetes {{< glossary_tooltip term_id="kube-controller-manager" text="controller manager" >}} runs
{{< glossary_tooltip term_id="controller" text="controllers" >}} that are built in to the Kubernetes
control plane.
When invoked with `--use-service-account-credentials`, kube-controller-manager starts each controller
using a separate service account.
Corresponding roles exist for each built-in controller, prefixed with `system:controller:`.
If the controller manager is not started with `--use-service-account-credentials`, it runs all control loops
using its own credential, which must be granted all the relevant roles.
These roles include:
-->
### 內建控制器的角色   {#controller-roles}

Kubernetes {{< glossary_tooltip term_id="kube-controller-manager" text="控制器管理器" >}}
執行內建於 Kubernetes 控制面的{{< glossary_tooltip term_id="controller" text="控制器" >}}。
當使用 `--use-service-account-credentials` 引數啟動時，kube-controller-manager
使用單獨的服務賬戶來啟動每個控制器。
每個內建控制器都有相應的、字首為 `system:controller:` 的角色。
如果控制管理器啟動時未設定 `--use-service-account-credentials`，
它使用自己的身份憑據來執行所有的控制器，該身份必須被授予所有相關的角色。
這些角色包括：

* `system:controller:attachdetach-controller`
* `system:controller:certificate-controller`
* `system:controller:clusterrole-aggregation-controller`
* `system:controller:cronjob-controller`
* `system:controller:daemon-set-controller`
* `system:controller:deployment-controller`
* `system:controller:disruption-controller`
* `system:controller:endpoint-controller`
* `system:controller:expand-controller`
* `system:controller:generic-garbage-collector`
* `system:controller:horizontal-pod-autoscaler`
* `system:controller:job-controller`
* `system:controller:namespace-controller`
* `system:controller:node-controller`
* `system:controller:persistent-volume-binder`
* `system:controller:pod-garbage-collector`
* `system:controller:pv-protection-controller`
* `system:controller:pvc-protection-controller`
* `system:controller:replicaset-controller`
* `system:controller:replication-controller`
* `system:controller:resourcequota-controller`
* `system:controller:root-ca-cert-publisher`
* `system:controller:route-controller`
* `system:controller:service-account-controller`
* `system:controller:service-controller`
* `system:controller:statefulset-controller`
* `system:controller:ttl-controller`

<!--
## Privilege escalation prevention and bootstrapping

The RBAC API prevents users from escalating privileges by editing roles or role bindings.
Because this is enforced at the API level, it applies even when the RBAC authorizer is not in use.
-->
## 初始化與預防許可權提升 {#privilege-escalation-prevention-and-bootstrapping}

RBAC API 會阻止使用者透過編輯角色或者角色繫結來提升許可權。
由於這一點是在 API 級別實現的，所以在 RBAC 鑑權元件未啟用的狀態下依然可以正常工作。

<!--
### Restrictions on role creation or update

You can only create/update a role if at least one of the following things is true:

1. You already have all the permissions contained in the role, at the same scope as the object being modified
(cluster-wide for a ClusterRole, within the same namespace or cluster-wide for a Role).
2. You are granted explicit permission to perform the `escalate` verb on the `roles` or `clusterroles` resource in the `rbac.authorization.k8s.io` API group.
-->
### 對角色建立或更新的限制 {#restrictions-on-role-creation-or-update}

只有在符合下列條件之一的情況下，你才能建立/更新角色:

1. 你已經擁有角色中包含的所有許可權，且其作用域與正被修改的物件作用域相同。
  （對 ClusterRole 而言意味著叢集範圍，對 Role 而言意味著相同名字空間或者叢集範圍）。
2. 你被顯式授權在 `rbac.authorization.k8s.io` API 組中的 `roles` 或 `clusterroles` 資源
   使用 `escalate` 動詞。

<!--
For example, if `user-1` does not have the ability to list Secrets cluster-wide, they cannot create a ClusterRole
containing that permission. To allow a user to create/update roles:

1. Grant them a role that allows them to create/update Role or ClusterRole objects, as desired.
2. Grant them permission to include specific permissions in the roles they create/update:
    * implicitly, by giving them those permissions (if they attempt to create or modify a Role or ClusterRole with permissions they themselves have not been granted, the API request will be forbidden)
    * or explicitly allow specifying any permission in a `Role` or `ClusterRole` by giving them permission to perform the `escalate` verb on `roles` or `clusterroles` resources in the `rbac.authorization.k8s.io` API group
-->
例如，如果 `user-1` 沒有列舉叢集範圍所有 Secret 的許可權，他將不能建立包含該許可權的 ClusterRole。
若要允許使用者建立/更新角色：

1. 根據需要賦予他們一個角色，允許他們根據需要建立/更新 Role 或者 ClusterRole 物件。
2. 授予他們在所建立/更新角色中包含特殊許可權的許可權:
   * 隱式地為他們授權（如果它們試圖建立或者更改 Role 或 ClusterRole 的許可權，
     但自身沒有被授予相應許可權，API 請求將被禁止）。
   * 透過允許他們在 Role 或 ClusterRole 資源上執行 `escalate` 動作顯式完成授權。
     這裡的 `roles` 和 `clusterroles` 資源包含在 `rbac.authorization.k8s.io` API 組中。

<!--
### Restrictions on role binding creation or update

You can only create/update a role binding if you already have all the permissions contained in the referenced role
(at the same scope as the role binding) *or* if you have been authorized to perform the `bind` verb on the referenced role.
For example, if `user-1` does not have the ability to list Secrets cluster-wide, they cannot create a ClusterRoleBinding
to a role that grants that permission. To allow a user to create/update role bindings:
-->
### 對角色繫結建立或更新的限制 {#restrictions-on-role-binding-creation-or-update}

只有你已經具有了所引用的角色中包含的全部許可權時，或者你被授權在所引用的角色上執行 `bind`
動詞時，你才可以建立或更新角色繫結。這裡的許可權與角色繫結的作用域相同。
例如，如果使用者 `user-1` 沒有列舉叢集範圍所有 Secret 的能力，則他不可以建立
ClusterRoleBinding 引用授予該許可許可權的角色。
如要允許使用者建立或更新角色繫結：

<!--
1. Grant them a role that allows them to create/update RoleBinding or ClusterRoleBinding objects, as desired.
2. Grant them permissions needed to bind a particular role:
    * implicitly, by giving them the permissions contained in the role.
    * explicitly, by giving them permission to perform the `bind` verb on the particular Role (or ClusterRole).

For example, this ClusterRole and RoleBinding would allow `user-1` to grant other users the `admin`, `edit`, and `view` roles in the namespace `user-1-namespace`:
-->
1. 賦予他們一個角色，使得他們能夠根據需要建立或更新 RoleBinding 或 ClusterRoleBinding
   物件。
2. 授予他們繫結某特定角色所需要的許可許可權：
   * 隱式授權下，可以將角色中包含的許可許可權授予他們；
   * 顯式授權下，可以授權他們在特定 Role （或 ClusterRole）上執行 `bind` 動詞的許可權。

例如，下面的 ClusterRole 和 RoleBinding 將允許使用者 `user-1` 把名字空間 `user-1-namespace`
中的 `admin`、`edit` 和 `view` 角色賦予其他使用者：

<!--
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
  # omit resourceNames to allow binding any ClusterRole
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
-->
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
  # 忽略 resourceNames 意味著允許繫結任何 ClusterRole
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

<!--
When bootstrapping the first roles and role bindings, it is necessary for the initial user to grant permissions they do not yet have.
To bootstrap initial roles and role bindings:

* Use a credential with the "system:masters" group, which is bound to the "cluster-admin" super-user role by the default bindings.
* If your API server runs with the insecure port enabled (`--insecure-port`), you can also make API calls via that port, which does not enforce authentication or authorization.
-->
當啟動引導第一個角色和角色繫結時，需要為初始使用者授予他們尚未擁有的許可權。
對初始角色和角色繫結進行初始化時需要：

* 使用使用者組為 `system:masters` 的憑據，該使用者組由預設繫結關聯到 `cluster-admin`
  這個超級使用者角色。
* 如果你的 API 伺服器啟動時啟用了不安全埠（使用 `--insecure-port`），你也可以透過
  該埠呼叫 API，這樣的操作會繞過身份驗證或鑑權。

<!--
## Command-line utilities
-->
## 一些命令列工具 {#command-line-utilities}

### `kubectl create role`

<!--
Creates a Role object defining permissions within a single namespace. Examples:

* Create a Role named "pod-reader" that allows users to perform `get`, `watch` and `list` on pods:
-->
建立 Role 物件，定義在某一名字空間中的許可權。例如:

* 建立名稱為 “pod-reader” 的 Role 物件，允許使用者對 Pods 執行 `get`、`watch` 和 `list` 操作：

  ```shell
  kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
  ```

<!--
* Create a Role named "pod-reader" with resourceNames specified:
-->
* 建立名稱為 “pod-reader” 的 Role 物件並指定 `resourceNames`：

  ```shell
  kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  ```

<!--
* Create a Role named "foo" with apiGroups specified:
-->
* 建立名為 “foo” 的 Role 物件並指定 `apiGroups`：

  ```shell
  kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
  ```

<!--
* Create a Role named "foo" with subresource permissions:
-->
* 建立名為 “foo” 的 Role 物件並指定子資源許可權:

  ```shell
  kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
  ```

<!--
* Create a Role named "my-component-lease-holder" with permissions to get/update a resource with a specific name:
-->
* 建立名為 “my-component-lease-holder” 的 Role 物件，使其具有對特定名稱的
  資源執行 get/update 的許可權：

  ```shell
  kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
  ```

### `kubectl create clusterrole`

<!--
Creates a ClusterRole. Examples:

* Create a ClusterRole named "pod-reader" that allows user to perform `get`, `watch` and `list` on pods:
-->
建立 ClusterRole 物件。例如：

* 建立名稱為 “pod-reader” 的 ClusterRole 物件，允許使用者對 Pods 物件執行 `get`、
  `watch` 和 `list` 操作：

  ```shell
  kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
  ```

<!--
* Create a ClusterRole named "pod-reader" with resourceNames specified:
-->
* 建立名為 “pod-reader” 的 ClusterRole 物件並指定 `resourceNames`：

  ```shell
  kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
  ```

<!--
* Create a ClusterRole named "foo" with apiGroups specified:
-->
* 建立名為 “foo” 的 ClusterRole 物件並指定 `apiGroups`：

  ```shell
  kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
  ```

<!--
* Create a ClusterRole named "foo" with subresource permissions:
-->
* 建立名為 “foo” 的 ClusterRole 物件並指定子資源:

  ```shell
  kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
  ```

<!--
* Create a ClusterRole named "foo" with nonResourceURL specified:
-->
* 建立名為 “foo” 的 ClusterRole 物件並指定 `nonResourceURL`：

  ```shell
  kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
  ```

<!--
* Create a ClusterRole named "monitoring" with an aggregationRule specified:
-->
* 建立名為 “monitoring” 的 ClusterRole 物件並指定 `aggregationRule`：

  ```shell
  kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
  ```

### `kubectl create rolebinding`

<!--
Grants a Role or ClusterRole within a specific namespace. Examples:

* Within the namespace "acme", grant the permissions in the "admin" ClusterRole to a user named "bob":
-->
在特定的名字空間中對 `Role` 或 `ClusterRole` 授權。例如：

* 在名字空間 “acme” 中，將名為 `admin` 的 ClusterRole 中的許可權授予名稱 “bob” 的使用者:

  ```shell
  kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
  ```

<!--
* Within the namespace "acme", grant the permissions in the "view" ClusterRole to the service account in the namespace "acme" named "myapp":
-->
* 在名字空間 “acme” 中，將名為 `view` 的 ClusterRole 中的許可權授予名字空間 “acme”
  中名為 `myapp` 的服務賬戶：

  ```shell
  kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
  ```

<!--
* Within the namespace "acme", grant the permissions in the "view" ClusterRole to a service account in the namespace "myappnamespace" named "myapp":
-->
* 在名字空間 “acme” 中，將名為 `view` 的 ClusterRole 物件中的許可權授予名字空間
  “myappnamespace” 中名稱為 `myapp` 的服務賬戶：

  ```shell
  kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
  ```

### `kubectl create clusterrolebinding`

<!--
Grants a ClusterRole across the entire cluster (all namespaces). Examples:

* Across the entire cluster, grant the permissions in the "cluster-admin" ClusterRole to a user named "root":
-->
在整個叢集（所有名字空間）中用 ClusterRole 授權。例如：

* 在整個叢集範圍，將名為 `cluster-admin` 的 ClusterRole 中定義的許可權授予名為
  “root” 使用者：

  ```shell
  kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
  ```

<!--
* Across the entire cluster, grant the permissions in the "system:node-proxier" ClusterRole to a user named "system:kube-proxy":
-->
* 在整個叢集範圍內，將名為 `system:node-proxier` 的 ClusterRole 的許可權授予名為
  “system:kube-proxy” 的使用者：

  ```shell
  kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
  ```

<!--
* Across the entire cluster, grant the permissions in the "view" ClusterRole to a service account named "myapp" in the namespace "acme":
-->
* 在整個叢集範圍內，將名為 `view` 的 ClusterRole 中定義的許可權授予 “acme” 名字空間中
  名為 “myapp” 的服務賬戶：

  ```shell
  kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
  ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

<!--
Creates or updates `rbac.authorization.k8s.io/v1` API objects from a manifest file.

Missing objects are created, and the containing namespace is created for namespaced objects, if required.

Existing roles are updated to include the permissions in the input objects,
and remove extra permissions if `--remove-extra-permissions` is specified.

Existing bindings are updated to include the subjects in the input objects,
and remove extra subjects if `--remove-extra-subjects` is specified.

Examples:
-->
使用清單檔案來建立或者更新 `rbac.authorization.k8s.io/v1` API 物件。

尚不存在的物件會被建立，如果對應的名字空間也不存在，必要的話也會被建立。
已經存在的角色會被更新，使之包含輸入物件中所給的許可權。如果指定了
`--remove-extra-permissions`，可以刪除額外的許可權。

已經存在的繫結也會被更新，使之包含輸入物件中所給的主體。如果指定了
`--remove-extra-permissions`，則可以刪除多餘的主體。

例如:

<!--
* Test applying a manifest file of RBAC objects, displaying changes that would be made:
-->
* 測試應用 RBAC 物件的清單檔案，顯示將要進行的更改：

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client
  ```

<!--
* Apply a manifest file of RBAC objects, preserving any extra permissions (in roles) and any extra subjects (in bindings):
-->
* 應用 RBAC 物件的清單檔案，保留角色中的額外許可權和繫結中的其他主體：

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml
  ```

<!--
* Apply a manifest file of RBAC objects, removing any extra permissions (in roles) and any extra subjects (in bindings):
-->
* 應用 RBAC 物件的清單檔案，刪除角色中的額外許可權和繫結中的其他主體：

  ```shell
  kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
  ```

<!--
## ServiceAccount permissions {#service-account-permissions}

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

This allows you to grant particular roles to particular ServiceAccounts as needed.
Fine-grained role bindings provide greater security, but require more effort to administrate.
Broader grants can give unnecessary (and potentially escalating) API access to
ServiceAccounts, but are easier to administrate.
-->
## 服務賬戶許可權   {#service-account-permissions}

預設的 RBAC 策略為控制面元件、節點和控制器授予許可權。
但是不會對 `kube-system` 名字空間之外的服務賬戶授予許可權。
（除了授予所有已認證使用者的發現許可權）

這使得你可以根據需要向特定 ServiceAccount 授予特定許可權。
細粒度的角色繫結可帶來更好的安全性，但需要更多精力管理。
粗粒度的授權可能導致 ServiceAccount 被授予不必要的 API 訪問許可權（甚至導致潛在的許可權提升），
但更易於管理。

<!--
In order from most secure to least secure, the approaches are:

1. Grant a role to an application-specific service account (best practice)
-->
按從最安全到最不安全的順序，存在以下方法：

1. 為特定應用的服務賬戶授予角色（最佳實踐）

   <!--
   This requires the application to specify a `serviceAccountName` in its pod spec,
   and for the service account to be created (via the API, application manifest, `kubectl create serviceaccount`, etc.).

   For example, grant read-only permission within "my-namespace" to the "my-sa" service account:
   -->
   這要求應用在其 Pod 規約中指定 `serviceAccountName`，
   並額外建立服務賬戶（包括透過 API、應用程式清單、`kubectl create serviceaccount` 等）。

   例如，在名字空間 “my-namespace” 中授予服務賬戶 “my-sa” 只讀許可權：

   ```shell
   kubectl create rolebinding my-sa-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:my-sa \
     --namespace=my-namespace
   ```

<!--
2. Grant a role to the "default" service account in a namespace
-->
2. 將角色授予某名字空間中的 “default” 服務賬戶

   <!--
   If an application does not specify a `serviceAccountName`, it uses the "default" service account.

   {{< note >}}
   Permissions given to the "default" service account are available to any pod
   in the namespace that does not specify a `serviceAccountName`.
   {{< /note >}}

   For example, grant read-only permission within "my-namespace" to the "default" service account:
   -->
   如果某應用沒有指定 `serviceAccountName`，那麼它將使用 “default” 服務賬戶。

   {{< note >}}
   "default" 服務賬戶所具有的許可權會被授予給名字空間中所有未指定
   `serviceAccountName` 的 Pod。
   {{< /note >}}

   例如，在名字空間 "my-namespace" 中授予服務賬戶 "default" 只讀許可權：

   ```shell
   kubectl create rolebinding default-view \
     --clusterrole=view \
     --serviceaccount=my-namespace:default \
     --namespace=my-namespace
   ```

   <!--
   Many [add-ons](/docs/concepts/cluster-administration/addons/) run as the
   "default" service account in the `kube-system` namespace.
   To allow those add-ons to run with super-user access, grant cluster-admin
   permissions to the "default" service account in the `kube-system` namespace.

   {{< caution >}}
   Enabling this means the `kube-system` namespace contains Secrets
   that grant super-user access to your cluster's API.
   {{< /caution >}}
   -->
   許多[外掛元件](/zh-cn/docs/concepts/cluster-administration/addons/)在 `kube-system`
   名字空間以 “default” 服務賬戶執行。
   要允許這些外掛元件以超級使用者許可權執行，需要將叢集的 `cluster-admin` 許可權授予
   `kube-system` 名字空間中的 “default” 服務賬戶。

   {{< caution >}}
   啟用這一配置意味著在 `kube-system` 名字空間中包含以超級使用者賬號來訪問叢集 API
   的 Secrets。
   {{< /caution >}}

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
-->
3. 將角色授予名字空間中所有服務賬戶

   如果你想要名字空間中所有應用都具有某角色，無論它們使用的什麼服務賬戶，
   可以將角色授予該名字空間的服務賬戶組。

   例如，在名字空間 “my-namespace” 中的只讀許可權授予該名字空間中的所有服務賬戶：

   ```shell
   kubectl create rolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts:my-namespace \
     --namespace=my-namespace
   ```

<!--
4. Grant a limited role to all service accounts cluster-wide (discouraged)

   If you don't want to manage permissions per-namespace, you can grant a cluster-wide role to all service accounts.

   For example, grant read-only permission across all namespaces to all service accounts in the cluster:
-->
4. 在叢集範圍內為所有服務賬戶授予一個受限角色（不鼓勵）

   如果你不想管理每一個名字空間的許可權，你可以向所有的服務賬戶授予叢集範圍的角色。

   例如，為叢集範圍的所有服務賬戶授予跨所有名字空間的只讀許可權：


   ```shell
   kubectl create clusterrolebinding serviceaccounts-view \
     --clusterrole=view \
     --group=system:serviceaccounts
   ```

<!--
5. Grant super-user access to all service accounts cluster-wide (strongly discouraged)

   If you don't care about partitioning permissions at all, you can grant super-user access to all service accounts.

   {{< warning >}}
   This allows any application full access to your cluster, and also grants
   any user with read access to Secrets (or the ability to create any pod)
   full access to your cluster.
   {{< /warning >}}
-->
5. 授予超級使用者訪問許可權給叢集範圍內的所有服務帳戶（強烈不鼓勵）

   如果你不在乎如何區分許可權，你可以將超級使用者訪問許可權授予所有服務賬戶。

   {{< warning >}}
   這樣做會允許所有應用都對你的叢集擁有完全的訪問許可權，並將允許所有能夠讀取
   Secret（或建立 Pod）的使用者對你的叢集有完全的訪問許可權。
   {{< /warning >}}

   ```shell
   kubectl create clusterrolebinding serviceaccounts-cluster-admin \
     --clusterrole=cluster-admin \
     --group=system:serviceaccounts
   ```

<!--
## Write access for Endpoints

Kubernetes clusters created before Kubernetes v1.22 include write access to
Endpoints in the aggregated "edit" and "admin" roles. As a mitigation for
[CVE-2021-25740](https://github.com/kubernetes/kubernetes/issues/103675), this
access is not part of the aggregated roles in clusters that you create using
Kubernetes v1.22 or later.

Existing clusters that have been upgraded to Kubernetes v1.22 will not be
subject to this change. The [CVE
announcement](https://github.com/kubernetes/kubernetes/issues/103675) includes
guidance for restricting this access in existing clusters.

If you want new clusters to retain this level of access in the aggregated roles,
you can create the following ClusterRole:
-->
## Endpoints 寫許可權 {#write-access-for-endpoints}

在 Kubernetes v1.22 之前版本建立的集群裡，
“edit” 和 “admin” 聚合角色包含對 Endpoints 的寫許可權。
作為 [CVE-2021-25740](https://github.com/kubernetes/kubernetes/issues/103675) 的緩解措施，
此訪問許可權不包含在 Kubernetes 1.22 以及更高版本叢集的聚合角色裡。

升級到 Kubernetes v1.22 版本的現有叢集不會包括此變化。
[CVE 公告](https://github.com/kubernetes/kubernetes/issues/103675)包含了在現有集群裡限制此訪問許可權的指引。

如果你希望在新叢集的聚合角色裡保留此訪問許可權，你可以建立下面的 ClusterRole：

{{< codenew file="access/endpoints-aggregated.yaml" >}}

<!--
## Upgrading from ABAC

Clusters that originally ran older Kubernetes versions often used
permissive ABAC policies, including granting full API access to all
service accounts.

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

While far more secure, this can be disruptive to existing workloads expecting to automatically receive API permissions.
Here are two approaches for managing this transition:
-->
## 從 ABAC 升級 {#upgrading-from-abac}

原來執行較老版本 Kubernetes 的叢集通常會使用限制寬鬆的 ABAC 策略，
包括授予所有服務帳戶全權訪問 API 的能力。

預設的 RBAC 策略為控制面元件、節點和控制器等授予有限的許可權，但不會為
`kube-system` 名字空間外的服務賬戶授權
（除了授予所有認證使用者的發現許可權之外）。

這樣做雖然安全得多，但可能會干擾期望自動獲得 API 許可權的現有工作負載。
這裡有兩種方法來完成這種轉換:

<!--
### Parallel authorizers

Run both the RBAC and ABAC authorizers, and specify a policy file that contains
the [legacy ABAC policy](/docs/reference/access-authn-authz/abac/#policy-file-format):
-->
### 並行鑑權    {#parallel-authorizers}

同時執行 RBAC 和 ABAC 鑑權模式，並指定包含
[現有的 ABAC 策略](/zh-cn/docs/reference/access-authn-authz/abac/#policy-file-format)
的策略檔案：

```shell
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

<!--
To explain that first command line option in detail: if earlier authorizers, such as Node,
deny a request, then the RBAC authorizer attempts to authorize the API request. If RBAC
also denies that API request, the ABAC authorizer is then run. This means that any request
allowed by *either* the RBAC or ABAC policies is allowed.
-->
關於命令列中的第一個選項：如果早期的鑑權元件，例如 Node，拒絕了某個請求，則
RBAC 鑑權元件嘗試對該 API 請求鑑權。如果 RBAC 也拒絕了該 API 請求，則執行 ABAC
鑑權元件。這意味著被 RBAC 或 ABAC 策略所允許的任何請求都是被允許的請求。

<!--
When the kube-apiserver is run with a log level of 5 or higher for the RBAC component
(`--vmodule=rbac*=5` or `--v=5`), you can see RBAC denials in the API server log
(prefixed with `RBAC`).
You can use that information to determine which roles need to be granted to which users, groups, or service accounts.
-->
如果 kube-apiserver 啟動時，RBAC 元件的日誌級別為 5 或更高（`--vmodule=rbac*=5` 或 `--v=5`），
你可以在 API 伺服器的日誌中看到 RBAC  拒絕的細節（字首 `RBAC`）
你可以使用這些資訊來確定需要將哪些角色授予哪些使用者、組或服務帳戶。

<!--
Once you have [granted roles to service accounts](#service-account-permissions) and workloads
are running with no RBAC denial messages in the server logs, you can remove the ABAC authorizer.
-->
一旦你[將角色授予服務賬戶](#service-account-permissions)且工作負載執行時，
伺服器日誌中沒有出現 RBAC 拒絕訊息，就可以刪除 ABAC 鑑權器。

<!--
### Permissive RBAC permissions

You can replicate a permissive ABAC policy using RBAC role bindings.
-->
### 寬鬆的 RBAC 許可權   {#permissive-rbac-permissions}

你可以使用 RBAC 角色繫結複製寬鬆的 ABAC 策略。

{{< warning >}}
<!--
The following policy allows **ALL** service accounts to act as cluster administrators.
Any application running in a container receives service account credentials automatically,
and could perform any action against the API, including viewing secrets and modifying permissions.
This is not a recommended policy.
-->
下面的策略允許 **所有** 服務帳戶充當叢集管理員。
容器中執行的所有應用程式都會自動收到服務帳戶的憑據，可以對 API 執行任何操作，
包括檢視 Secrets 和修改許可權。這一策略是不被推薦的。

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

<!--
After you have transitioned to use RBAC, you should adjust the access controls
for your cluster to ensure that these meet your information security needs.
-->
在你完成到 RBAC 的遷移後，應該調整叢集的訪問控制，確保相關的策略滿足你的資訊保安需求。
