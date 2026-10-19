---
title: 用户伪装
content_type: reference
weight: 50
---
<!--
title: User Impersonation
content_type: reference
weight: 50
-->

<!-- overview -->

<!--
User _impersonation_ is a method of allowing authenticated users to act as another user,
group, or service account through HTTP headers.
-->
用户 **伪装（Impersonation）** 是一种允许已认证用户通过 HTTP 头部以另一个用户、
组或服务账号身份执行操作的方法。

<!-- body -->
<!--
A user can act as another user through impersonation headers. These let requests
manually override the user info a request authenticates as. For example, an admin
could use this feature to debug an authorization policy by temporarily
impersonating another user and seeing if a request was denied.

Impersonation requests first authenticate as the requesting user, then switch
to the impersonated user info.
-->
用户可以通过伪装头部以另一个用户的身份执行操作。
这些头部允许请求手动覆盖请求认证所得到的用户信息。
例如，管理员可以使用此特性临时伪装成另一个用户，
查看某个请求是否被拒绝，从而调试鉴权策略。

伪装请求首先以发出请求的用户身份通过认证，然后切换到被伪装的用户信息。

<!--
* A user makes an API call with their credentials _and_ impersonation headers.
* API server authenticates the user.
* API server ensures the authenticated users have impersonation privileges.
* Request user info is replaced with impersonation values.
* Request is evaluated, authorization acts on impersonated user info.
-->
* 用户使用自己的凭据**以及**伪装头部发起 API 调用。
* API 服务器对用户进行认证。
* API 服务器确保已认证用户具有伪装权限。
* 请求中的用户信息被替换为伪装值。
* 请求被评估，鉴权基于被伪装的用户信息执行。

<!--
The following HTTP headers can be used to performing an impersonation request:

* `Impersonate-User`: The username to act as.
* `Impersonate-Uid`: A unique identifier that represents the user being impersonated. Optional.
   Requires "Impersonate-User". Kubernetes does not impose any format requirements on this string.
* `Impersonate-Group`: A group name to act as. Can be provided multiple times to set multiple groups.
  Optional. Requires "Impersonate-User".
* `Impersonate-Extra-( extra name )`: A dynamic header used to associate extra fields with the user.
  Optional. Requires "Impersonate-User". In order to be preserved consistently, `( extra name )`
  must be lower-case, and any characters which aren't [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6)
  MUST be utf8 and [percent-encoded](https://tools.ietf.org/html/rfc3986#section-2.1).
-->
以下 HTTP 头部可用于执行伪装请求：

* `Impersonate-User`：要伪装成的用户名。
* `Impersonate-Uid`：表示被伪装用户的唯一标识符。可选。
  需要设置 "Impersonate-User"。Kubernetes 不对此字符串施加任何格式要求。
* `Impersonate-Group`：要伪装成的组名。可以多次提供以设置多个组。
  可选。需要设置 "Impersonate-User"。
* `Impersonate-Extra-( extra name )`：用于将额外字段关联到用户的动态头部。
  可选。需要设置 "Impersonate-User"。为了被一致地保留，`( extra name )`
  必须是小写，并且所有不是 [HTTP 头部标签合法字符](https://tools.ietf.org/html/rfc7230#section-3.2.6)
  的字符都**必须**采用 UTF-8 并进行[百分号编码](https://tools.ietf.org/html/rfc3986#section-2.1)。

{{< note >}}
<!--
Prior to 1.11.3 (and 1.10.7, 1.9.11), `( extra name )` could only contain characters which
were [legal in HTTP header labels](https://tools.ietf.org/html/rfc7230#section-3.2.6).
-->
在 1.11.3（以及 1.10.7、1.9.11）之前，`( extra name )` 只能包含
[HTTP 头部标签中的合法字符](https://tools.ietf.org/html/rfc7230#section-3.2.6)。
{{< /note >}}

{{< note >}}
<!--
`Impersonate-Uid` is only available in versions 1.22.0 and higher.
-->
`Impersonate-Uid` 仅在 1.22.0 及更高版本中可用。
{{< /note >}}

<!--
An example of the impersonation headers used when impersonating a user with groups:
-->
伪装带有组的用户时所使用的伪装头部示例：

```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
```

<!--
An example of the impersonation headers used when impersonating a user with a UID and
extra fields:
-->
伪装带有 UID 和额外字段的用户时所使用的伪装头部示例：

```http
Impersonate-User: jane.doe@example.com
Impersonate-Uid: 06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-acme.com%2Fproject: some-project
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
```

<!--
When using `kubectl` set the `--as` command line argument to configure the `Impersonate-User`
header, you can also set the `--as-group` flag to configure the `Impersonate-Group` header，
set the `--as-uid` flag (1.23) to configure `Impersonate-Uid` header, and set the
`--as-user-extra` flag (1.35) to configure `Impersonate-Extra-( extra name )` header.
-->
使用 `kubectl` 时，设置 `--as` 命令行参数可以配置 `Impersonate-User`
头部；还可以设置 `--as-group` 标志来配置 `Impersonate-Group` 头部，
设置 `--as-uid` 标志（1.23）来配置 `Impersonate-Uid` 头部，以及设置
`--as-user-extra` 标志（1.35）来配置 `Impersonate-Extra-( extra name )` 头部。

```bash
kubectl drain mynode
```

```none
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)
```

<!--
Set the `--as` and `--as-group` flag:
-->
设置 `--as` 和 `--as-group` 标志：

```bash
kubectl drain mynode --as=superman --as-group=system:masters
```

```none
node/mynode cordoned
node/mynode drained
```

<!--
To impersonate a user, user identifier (UID), group or extra fields, the impersonating user must
have the ability to perform the **impersonate** verb on the kind of attribute
being impersonated ("user", "uid", "group", etc.). For clusters that enable the RBAC
authorization plugin, the following ClusterRole encompasses the rules needed to
set user and group impersonation headers:
-->
若要伪装用户、用户标识符（UID）、组或额外字段，执行伪装的用户必须能够对被伪装的属性类别
（"user"、"uid"、"group" 等）执行 **impersonate** 动词。对于启用了 RBAC
鉴权插件的集群，以下 ClusterRole 包含了设置用户和组伪装头部所需的规则：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonator
rules:
- apiGroups: [""]
  resources: ["users", "groups", "serviceaccounts"]
  verbs: ["impersonate"]
```

<!--
For impersonation, extra fields and impersonated UIDs are both under the "authentication.k8s.io" `apiGroup`.
Extra fields are evaluated as sub-resources of the resource "userextras". To
allow a user to use impersonation headers for the extra field `scopes` and
for UIDs, a user should be granted the following role:
-->
对于伪装，额外字段和被伪装的 UID 都位于 "authentication.k8s.io" `apiGroup` 下。
额外字段被作为 "userextras" 资源的子资源来评估。若要允许用户针对额外字段
`scopes` 和 UID 使用伪装头部，应向用户授予以下角色：

<!--
# Can set "Impersonate-Extra-scopes" header and the "Impersonate-Uid" header.
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: scopes-and-uid-impersonator
rules:
# 可以设置 "Impersonate-Extra-scopes" 头部和 "Impersonate-Uid" 头部。
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes", "uids"]
  verbs: ["impersonate"]
```

<!--
The values of impersonation headers can also be restricted by limiting the set
of `resourceNames` a resource can take.
-->
还可以通过限制资源可接受的 `resourceNames` 集合来约束伪装头部的取值。

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# Can impersonate the user "jane.doe@example.com"
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# Can impersonate the groups "developers" and "admins"
- apiGroups: [""]
  resources: ["groups"]
  verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# Can impersonate the extras field "scopes" with the values "view" and "development"
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]

# Can impersonate the uid "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
- apiGroups: ["authentication.k8s.io"]
  resources: ["uids"]
  verbs: ["impersonate"]
  resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# 可以伪装用户 "jane.doe@example.com"
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# 可以伪装组 "developers" 和 "admins"
- apiGroups: [""]
  resources: ["groups"]
  verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# 可以伪装取值为 "view" 和 "development" 的额外字段 "scopes"
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]

# 可以伪装 UID "06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"
- apiGroups: ["authentication.k8s.io"]
  resources: ["uids"]
  verbs: ["impersonate"]
  resourceNames: ["06f6ce97-e2c5-4ab8-7ba5-7654dd08d52b"]
```

{{< note >}}
<!--
Impersonating a user or group allows you to perform any action as if you were that user or group;
for that reason, impersonation is not namespace scoped.
If you want to allow impersonation using Kubernetes RBAC,
this requires using a ClusterRole and a ClusterRoleBinding,
not a Role and RoleBinding.

Granting impersonation over ServiceAccounts is namespace scoped, but the impersonated ServiceAccount
could perform actions outside of namespace.
-->
伪装用户或组允许你像该用户或组一样执行任何操作；因此，伪装不受命名空间范围约束。
如果你想使用 Kubernetes RBAC 允许伪装，这需要使用 ClusterRole 和 ClusterRoleBinding，
而不是 Role 和 RoleBinding。

授予对 ServiceAccount 的伪装权限是命名空间范围的，但被伪装的 ServiceAccount
可能会在命名空间之外执行操作。
{{< /note >}}

<!--
## Constrained Impersonation
-->
## 受限伪装   {#constrained-impersonation}

{{< feature-state feature_gate_name="ConstrainedImpersonation" >}}

<!--
With the **impersonate** verb, impersonation cannot be limited or scoped.
It either grants full impersonation or none at all. Once granted permission to
impersonate a user, you can perform any action that user can perform across all
resources and namespaces.

With constrained impersonation, an impersonator can be limited to impersonate another
user only for specific actions on specific resources, rather than being able to perform all actions
that the impersonated user can perform.

This feature is enabled by setting the `ConstrainedImpersonation`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/#ConstrainedImpersonation).
-->
使用 **impersonate** 动词时，伪装无法被限制或限定范围。它要么授予完整伪装权限，
要么完全不授予。一旦被授予伪装某个用户的权限，你就可以跨所有资源和命名空间执行该用户可执行的任何操作。

借助受限伪装，可以限制伪装者只能在特定资源上为特定操作伪装成另一个用户，
而不是能够执行被伪装用户可执行的所有操作。

通过设置 `ConstrainedImpersonation`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#ConstrainedImpersonation)可以启用此特性。

<!--
### Understanding constrained impersonation

Constrained impersonation requires **two separate permissions**:

1. **Permission to impersonate a specific identity** (user, UID, group, service account or node)
2. **Permission to perform specific actions at a particular scope when impersonating** (for
   example, only `list` and `watch` pods in the `default` namespace)

This means an impersonator can be limited to impersonate another user only for specific operations.
-->
### 理解受限伪装   {#understanding-constrained-impersonation}

受限伪装需要**两个独立权限**：

1. **伪装特定身份的权限**（用户、UID、组、服务账号或节点）。
2. **在伪装时于特定范围执行特定操作的权限**（例如，只能在 `default` 命名空间中
   `list` 和 `watch` Pod）。

这意味着伪装者可以被限制为只能针对特定操作伪装成另一个用户。

<!--
### Impersonation modes

Constrained impersonation defines three distinct modes, each with its own set of verbs:
-->
### 伪装模式   {#impersonation-modes}

受限伪装定义了三种不同模式，每种模式都有自己的一组动词：

<!--
#### user-info mode

Use this mode to impersonate generic users (not service accounts or nodes). This mode applies when
the `Impersonate-User` header value:
- Does **not** start with `system:serviceaccount:`
- Does **not** start with `system:node:`

**Verbs:**
- `impersonate:user-info` - Permission to impersonate a specific user, group, UID, or extra field
- `impersonate-on:user-info:<verb>` - Permission to perform `<verb>` when impersonating a generic user
-->
#### user-info 模式

使用此模式伪装普通用户（不是服务账号或节点）。当 `Impersonate-User` 头部值满足以下条件时，
适用此模式：

- **不**以 `system:serviceaccount:` 开头
- **不**以 `system:node:` 开头

**动词：**

- `impersonate:user-info`：伪装特定用户、组、UID 或额外字段的权限。
- `impersonate-on:user-info:<verb>`：伪装普通用户时执行 `<verb>` 的权限。

<!--
#### ServiceAccount mode

Use this mode to impersonate ServiceAccounts.

**Verbs:**
- `impersonate:serviceaccount` - Permission to impersonate a specific service account
- `impersonate-on:serviceaccount:<verb>` - Permission to perform `<verb>` when impersonating a service account
-->
#### ServiceAccount 模式

使用此模式伪装 ServiceAccount。

**动词：**

- `impersonate:serviceaccount`：伪装特定服务账号的权限。
- `impersonate-on:serviceaccount:<verb>`：伪装服务账号时执行 `<verb>` 的权限。

<!--
#### arbitrary-node and associated-node modes

Use these modes to impersonate nodes. This mode applies when the `Impersonate-User` header value
starts with `system:node:`.

**Verbs:**
- `impersonate:arbitrary-node` - Permission to impersonate any specified node
- `impersonate:associated-node` - Permission to impersonate only the node to which the impersonator is bound
- `impersonate-on:arbitrary-node:<verb>` - Permission to perform `<verb>` when impersonating any node
- `impersonate-on:associated-node:<verb>` - Permission to perform `<verb>` when impersonating the associated node
-->
#### arbitrary-node 和 associated-node 模式

使用这些模式伪装节点。当 `Impersonate-User` 头部值以 `system:node:` 开头时，
适用此模式。

**动词：**

- `impersonate:arbitrary-node`：伪装任意指定节点的权限。
- `impersonate:associated-node`：仅伪装伪装者所绑定节点的权限。
- `impersonate-on:arbitrary-node:<verb>`：伪装任意节点时执行 `<verb>` 的权限。
- `impersonate-on:associated-node:<verb>`：伪装关联节点时执行 `<verb>` 的权限。

{{< note >}}
<!--
The `impersonate:associated-node` verb only applies when the impersonator is a service account bound to the
node it's trying to impersonate. This is determined by checking if the service account's user info
contains an extra field with key `authentication.kubernetes.io/node-name` that matches the node
being impersonated.
-->
`impersonate:associated-node` 动词仅在伪装者是绑定到其尝试伪装节点的服务账号时适用。
这是通过检查服务账号的用户信息中是否包含键为 `authentication.kubernetes.io/node-name`
且与被伪装节点匹配的额外字段来确定的。
{{< /note >}}

<!--
### Configuring constrained impersonation with RBAC

All constrained impersonation permissions use the `authentication.k8s.io` API group. Here's how to
configure the different modes.
-->
### 使用 RBAC 配置受限伪装   {#configuring-constrained-impersonation-with-rbac}

所有受限伪装权限都使用 `authentication.k8s.io` API 组。以下展示如何配置不同模式。

<!--
#### Example: Impersonate a user for specific actions

This example shows how to allow a service account to impersonate a user named `jane.doe@example.com`,
but only to `list` and `watch` pods in the `default` namespace. You need both a `ClusterRoleBinding`
for the identity permission and a `RoleBinding` for the action permission

**Step 1: Grant permission to impersonate the user identity**
-->
#### 示例：针对特定操作伪装用户

此示例展示如何允许某个服务账号伪装名为 `jane.doe@example.com` 的用户，
但只能在 `default` 命名空间中 `list` 和 `watch` Pod。你既需要一个用于身份权限的
`ClusterRoleBinding`，也需要一个用于操作权限的 `RoleBinding`。

**步骤 1：授予伪装用户身份的权限**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-jane-identity
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["users"]
  resourceNames: ["jane.doe@example.com"]
  verbs: ["impersonate:user-info"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: impersonate-jane-identity
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-jane-identity
subjects:
- kind: ServiceAccount
  name: my-controller
  namespace: default
```

<!--
**Step 2: Grant permission to perform specific actions when impersonating**
-->
**步骤 2：授予伪装时执行特定操作的权限**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: impersonate-list-watch-pods
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs:
  - "impersonate-on:user-info:list"
  - "impersonate-on:user-info:watch"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: impersonate-list-watch-pods
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: impersonate-list-watch-pods
subjects:
- kind: ServiceAccount
  name: my-controller
  namespace: default
```

<!--
Now the `my-controller` service account can impersonate `jane.doe@example.com` to list and watch
pods in the `default` namespace, but **cannot** perform other actions like deleting pods or
accessing resources in other namespaces.
-->
现在，`my-controller` 服务账号可以伪装成 `jane.doe@example.com` 来列举和监视
`default` 命名空间中的 Pod，但**不能**执行删除 Pod 或访问其他命名空间中资源等其他操作。

<!--
#### Example: Impersonate a ServiceAccount

To allow impersonating a service account named `app-sa` in the `production` namespace to create
and update deployments:
-->
#### 示例：伪装 ServiceAccount

若要允许伪装 `production` 命名空间中名为 `app-sa` 的服务账号来创建和更新 Deployment：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: impersonate-app-sa
  namespace: default
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["serviceaccounts"]
  resourceNames: ["app-sa"]
  # 对于服务账号，你必须在 RoleBinding 中指定命名空间
  verbs: ["impersonate:serviceaccount"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: impersonate-manage-deployments
  namespace: production
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs:
  - "impersonate-on:serviceaccount:create"
  - "impersonate-on:serviceaccount:update"
  - "impersonate-on:serviceaccount:patch"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: impersonate-app-sa
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: impersonate-app-sa
subjects:
- kind: ServiceAccount
  name: deputy-controller
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: impersonate-manage-deployments
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: impersonate-manage-deployments
subjects:
- kind: ServiceAccount
  name: deputy-controller
  namespace: default
```

<!--
#### Example: Impersonate a node

To allow `node-impersonator` ServiceAccount in `default` namespace impersonating
a node named `mynode` to get and list pods:
-->
#### 示例：伪装节点

若要允许 `default` 命名空间中的 `node-impersonator` ServiceAccount
伪装名为 `mynode` 的节点来获取和列举 Pod：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-node-sa
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["nodes"]
  resourceNames: ["mynode"]
  verbs: ["impersonate:arbitrary-node"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-list-pods
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs:
      - "impersonate-on:arbitrary-node:list"
      - "impersonate-on:arbitrary-node:get"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: impersonate-node-sa
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-node-sa
subjects:
- kind: ServiceAccount
  name: node-impersonator
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: impersonate-list-pods
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-list-pods
subjects:
  - kind: ServiceAccount
    name: node-impersonator
    namespace: default
```

<!--
#### Example: Node agent impersonating the associated node

This is a common pattern for node agents (like CNI plugins) that need to read pods on their node
without having cluster-wide pod access.
-->
#### 示例：节点代理伪装关联节点

对于需要读取自身节点上 Pod、但不具有集群范围 Pod 访问权限的节点代理
（例如 CNI 插件），这是一种常见模式。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-associated-node-identity
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["nodes"]
  verbs: ["impersonate:associated-node"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-list-pods-on-node
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs:
  - "impersonate-on:associated-node:list"
  - "impersonate-on:associated-node:get"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-agent-impersonate-node
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-associated-node-identity
subjects:
- kind: ServiceAccount
  name: node-agent
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-agent-impersonate-list-pods
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-list-pods-on-node
subjects:
- kind: ServiceAccount
  name: node-agent
  namespace: kube-system
```

<!--
The controller would get the node name using the downward API:
-->
控制器将使用 Downward API 获取节点名称：

```yaml
env:
- name: MY_NODE_NAME
  valueFrom:
    fieldRef:
      fieldPath: spec.nodeName
```

<!--
Then configure the kubeconfig to impersonate:
-->
然后配置 kubeconfig 以进行伪装：

```go
kubeConfig, _ := clientcmd.BuildConfigFromFlags("", "")
kubeConfig.Impersonate = rest.ImpersonationConfig{
    UserName: "system:node:" + os.Getenv("MY_NODE_NAME"),
}
```

<!--
### Using constrained impersonation

From a client perspective, using constrained impersonation is identical to using traditional
impersonation. You use the same impersonation headers:
-->
### 使用受限伪装   {#using-constrained-impersonation}

从客户端角度看，使用受限伪装与使用传统伪装完全相同。你使用相同的伪装头部：

```http
Impersonate-User: jane.doe@example.com
```

<!--
Or with kubectl:
-->
或者使用 kubectl：

```bash
kubectl get pods -n default --as=jane.doe@example.com
```

<!--
The difference is entirely in the authorization checks performed by the API server.
-->
区别完全在于 API 服务器所执行的鉴权检查。

<!--
### Working with `impersonate` verb

- If you have existing RBAC rules using the `impersonate` verb, they continue
  to function when the feature gate is enabled.

- When an impersonation request is made, the API server first checks for
  constrained impersonation permissions. If those checks fail, it falls back to checking the
  `impersonate` permission.
-->
### 使用 `impersonate` 动词   {#working-with-impersonate-verb}

- 如果你已有使用 `impersonate` 动词的 RBAC 规则，启用此特性门控后，这些规则会继续生效。

- 发出伪装请求时，API 服务器首先检查受限伪装权限。如果这些检查失败，
  它会回退为检查 `impersonate` 权限。

<!--
## Auditing

An audit event is logged for each impersonation request to help track how impersonation is used.

When a request uses constrained impersonation, the audit event includes an `authenticationMetadata`
object with an `impersonationConstraint` field that indicates which constrained impersonation verb
was used to authorize the request.

For non-watch requests that take longer than 500ms, the API server also adds an
`apiserver.latency.k8s.io/impersonation` annotation to the audit event
recording the time taken to process the impersonation (along with other handlers that contributed
to the overall duration).

Example audit event:
-->
## 审计   {#auditing}

系统会为每个伪装请求记录审计事件，以帮助跟踪伪装的使用方式。

当请求使用受限伪装时，审计事件包含一个 `authenticationMetadata` 对象，
其中的 `impersonationConstraint` 字段表明使用哪个受限伪装动词对请求进行了鉴权。

对于耗时超过 500ms 的非 watch 请求，API 服务器还会向审计事件添加
`apiserver.latency.k8s.io/impersonation` 注解，记录处理伪装所用的时间
（以及其他对总耗时有贡献的处理程序）。

审计事件示例：

```json
{
  "kind": "Event",
  "apiVersion": "audit.k8s.io/v1",
  "user": {
    "username": "system:serviceaccount:default:my-controller"
  },
  "impersonatedUser": {
    "username": "jane.doe@example.com"
  },
  "authenticationMetadata": {
    "impersonationConstraint": "impersonate:user-info"
  },
  "annotations": {
    "apiserver.latency.k8s.io/impersonation": "100ms"
  },
  "verb": "list",
  "objectRef": {
    "resource": "pods",
    "namespace": "default"
  }
}
```

<!--
The `impersonationConstraint` value indicates which mode was used (for example, `impersonate:user-info`,
`impersonate:associated-node`). The specific action (for example, `list`) can be determined from the
`verb` field in the audit event. For slow requests, the latency annotation records the time (for example,
`100ms`) taken to process the impersonation for the request.
-->
`impersonationConstraint` 值表示使用了哪种模式
（例如 `impersonate:user-info`、`impersonate:associated-node`）。
具体操作（例如 `list`）可以根据审计事件中的 `verb` 字段确定。对于慢请求，
延迟注解会记录为该请求处理伪装所用的时间（例如 `100ms`）。

<!--
## Metrics

`kube-apiserver` exposes the following Prometheus metrics for constrained impersonation:

- `apiserver_impersonation_attempts_total{mode, decision}`: a counter that increments on each
  impersonation attempt. A `mode` is one of `associated-node`,
  `arbitrary-node`, `serviceaccount`, `user-info`, or `legacy`. The `decision` is `allowed` or `denied`.
- `apiserver_impersonation_attempts_duration_seconds{mode, decision}`: a histogram tracking the time taken to
  resolve the impersonated user. The `mode` and `decision` labels have the same values as above. Because of
  caching within the handler, this reflects the amortized latency cost of impersonation requests.
- `apiserver_impersonation_authorization_attempts_total{mode, decision}`:  a counter that increments each
  time an impersonation attempt invokes the authorizer. The `mode` and `decision` labels have the same values as above.
- `apiserver_impersonation_authorization_attempts_duration_seconds{mode, decision}`: a histogram
  tracking the time taken by the authorizer for each impersonation attempt.
  The `mode` and `decision` labels have the same values as above.
-->
## 指标   {#metrics}

`kube-apiserver` 为受限伪装公开以下 Prometheus 指标：

- `apiserver_impersonation_attempts_total{mode, decision}`：计数器，每次伪装尝试都会递增。
  `mode` 是 `associated-node`、`arbitrary-node`、`serviceaccount`、`user-info`
  或 `legacy` 之一。`decision` 为 `allowed` 或 `denied`。
- `apiserver_impersonation_attempts_duration_seconds{mode, decision}`：直方图，
  跟踪解析被伪装用户所用的时间。`mode` 和 `decision` 标签的取值与上面相同。
  由于处理程序内部存在缓存，这反映的是伪装请求的摊销延迟成本。
- `apiserver_impersonation_authorization_attempts_total{mode, decision}`：计数器，
  每当伪装尝试调用鉴权器时递增。`mode` 和 `decision` 标签的取值与上面相同。
- `apiserver_impersonation_authorization_attempts_duration_seconds{mode, decision}`：
  直方图，跟踪鉴权器处理每次伪装尝试所用的时间。`mode` 和 `decision`
  标签的取值与上面相同。

<!--
For metrics `apiserver_impersonation_attempts_total{mode, decision}` and
`apiserver_impersonation_attempts_duration_seconds{mode, decision}`, the `mode` is
the empty string when `decision` is `denied`.
-->
对于指标 `apiserver_impersonation_attempts_total{mode, decision}` 和
`apiserver_impersonation_attempts_duration_seconds{mode, decision}`，
当 `decision` 为 `denied` 时，`mode` 为空字符串。

## {{% heading "whatsnext" %}}

<!--
- Read about [RBAC authorization](/docs/reference/access-authn-authz/rbac/)
- Understand [Kubernetes authentication](/docs/reference/access-authn-authz/authentication/)
-->
- 阅读 [RBAC 鉴权](/zh-cn/docs/reference/access-authn-authz/rbac/)
- 了解 [Kubernetes 认证](/zh-cn/docs/reference/access-authn-authz/authentication/)
