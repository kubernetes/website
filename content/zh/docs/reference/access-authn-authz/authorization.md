---
title: 鉴权概述
content_type: concept
weight: 60
---

<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Authorization Overview
content_type: concept
weight: 60
-->

<!-- overview -->
<!--
Learn more about Kubernetes authorization, including details about creating
policies using the supported authorization modules.
-->
了解有关 Kubernetes 鉴权的更多信息，包括使用支持的鉴权模块创建策略的详细信息。


<!-- body -->
<!--
In Kubernetes, you must be authenticated (logged in) before your request can be
authorized (granted permission to access). For information about authentication,
see [Accessing Control Overview](/docs/concepts/security/controlling-access/).

Kubernetes expects attributes that are common to REST API requests. This means
that Kubernetes authorization works with existing organization-wide or
cloud-provider-wide access control systems which may handle other APIs besides
the Kubernetes API.
-->
在 Kubernetes 中，你必须在鉴权（授予访问权限）之前进行身份验证（登录），有关身份验证的信息，
请参阅[访问控制概述](/zh/docs/concepts/security/controlling-access/).

Kubernetes 期望请求中存在 REST API 常见的属性。
这意味着 Kubernetes 鉴权适用于现有的组织范围或云提供商范围的访问控制系统，
除了 Kubernetes API 之外，它还可以处理其他 API。

<!--
## Determine Whether a Request is Allowed or Denied

Kubernetes authorizes API requests using the API server. It evaluates all of the
request attributes against all policies and allows or denies the request. All
parts of an API request must be allowed by some policy in order to proceed. This
means that permissions are denied by default.

(Although Kubernetes uses the API server, access controls and policies that
depend on specific fields of specific kinds of objects are handled by Admission
Controllers.)

When multiple authorization modules are configured, each is checked in sequence.
If any authorizer approves or denies a request, that decision is immediately
returned and no other authorizer is consulted. If all modules have no opinion on
the request, then the request is denied. A deny returns an HTTP status code 403.
-->
## 确定是允许还是拒绝请求

Kubernetes 使用 API 服务器对 API 请求进行鉴权。
它根据所有策略评估所有请求属性来决定允许或拒绝请求。
一个 API 请求的所有部分都必须被某些策略允许才能继续。
这意味着默认情况下拒绝权限。

（尽管 Kubernetes 使用 API 服务器，但是依赖于特定对象种类的特定字段的访问控制
和策略由准入控制器处理。）

当系统配置了多个鉴权模块时，Kubernetes 将按顺序使用每个模块。
如果任何鉴权模块批准或拒绝请求，则立即返回该决定，并且不会与其他鉴权模块协商。
如果所有模块对请求没有意见，则拒绝该请求。
被拒绝响应返回 HTTP 状态代码 403。

<!--
## Review Your Request Attributes

Kubernetes reviews only the following API request attributes:

 * **user** - The `user` string provided during authentication.
 * **group** - The list of group names to which the authenticated user belongs.
 * **extra** - A map of arbitrary string keys to string values, provided by the authentication layer.
 * **API** - Indicates whether the request is for an API resource.
 * **Request path** - Path to miscellaneous non-resource endpoints like `/api` or `/healthz`.
 * **API request verb** - API verbs `get`, `list`, `create`, `update`, `patch`, `watch`, `proxy`, `redirect`, `delete`, and `deletecollection` are used for resource requests. To determine the request verb for a resource API endpoint, see [Determine the request verb](/docs/reference/access-authn-authz/authorization/#determine-whether-a-request-is-allowed-or-denied) below.
 * **HTTP request verb** - HTTP verbs `get`, `post`, `put`, and `delete` are used for non-resource requests.
 * **Resource** - The ID or name of the resource that is being accessed (for resource requests only) -- For resource requests using `get`, `update`, `patch`, and `delete` verbs, you must provide the resource name.
 * **Subresource** - The subresource that is being accessed (for resource requests only).
 * **Namespace** - The namespace of the object that is being accessed (for namespaced resource requests only).
 * **API group** - The {{< glossary_tooltip text="API Group" term_id="api-group" >}} being accessed (for resource requests only). An empty string designates the _core_ [API group](/docs/reference/using-api/#api-groups).
-->
## 审查你的请求属性

Kubernetes 仅审查以下 API 请求属性：

* **用户** - 身份验证期间提供的 `user` 字符串。
* **组** - 经过身份验证的用户所属的组名列表。
* **额外信息** - 由身份验证层提供的任意字符串键到字符串值的映射。
* **API** - 指示请求是否针对 API 资源。
* **请求路径** - 各种非资源端点的路径，如 `/api` 或 `/healthz`。
* **API 请求动词** - API 动词 `get`、`list`、`create`、`update`、`patch`、`watch`、
  `proxy`、`redirect`、`delete` 和 `deletecollection` 用于资源请求。
  要确定资源 API 端点的请求动词，请参阅
  [确定请求动词](#determine-the-request-verb)。
* **HTTP 请求动词** - HTTP 动词 `get`、`post`、`put` 和 `delete` 用于非资源请求。
* **Resource** - 正在访问的资源的 ID 或名称（仅限资源请求）--
  对于使用 `get`、`update`、`patch` 和 `delete` 动词的资源请求，你必须提供资源名称。
* **子资源** - 正在访问的子资源（仅限资源请求）。
* **名字空间** - 正在访问的对象的名称空间（仅适用于名字空间资源请求）。
* **API 组** - 正在访问的 {{< glossary_tooltip text="API 组" term_id="api-group" >}}
  （仅限资源请求）。空字符串表示[核心 API 组](/zh/docs/reference/using-api/#api-groups)。

<!--
## Determine the Request Verb

**Non-resource requests**
Requests to endpoints other than `/api/v1/...` or `/apis/<group>/<version>/...`
are considered "non-resource requests", and use the lower-cased HTTP method of the request as the verb.
For example, a `GET` request to endpoints like `/api` or `/healthz` would use `get` as the verb.
-->
## 确定请求动词  {#determine-the-request-verb}

**非资源请求**

对于 `/api/v1/...` 或 `/apis/<group>/<version>/...` 之外的端点的请求被
视为“非资源请求（Non-Resource Requests）”，并使用该请求的 HTTP 方法的
小写形式作为其请求动词。
例如，对 `/api` 或 `/healthz` 这类端点的 `GET` 请求将使用 `get` 作为其动词。

<!--
**Resource requests**

To determine the request verb for a resource API endpoint, review the HTTP verb
used and whether or not the request acts on an individual resource or a
collection of resources:
-->
**资源请求**

要确定对资源 API 端点的请求动词，需要查看所使用的 HTTP 动词以及该请求是针对
单个资源还是一组资源：

<!--
HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get (for individual resources), list (for collections)
PUT       | update
PATCH     | patch
DELETE    | delete (for individual resources), deletecollection (for collections)
-->
HTTP 动词 | 请求动词
----------|---------------
POST      | create
GET, HEAD | get （针对单个资源）、list（针对集合）
PUT       | update
PATCH     | patch
DELETE    | delete（针对单个资源）、deletecollection（针对集合）

<!--
Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/)
  * `use` verb on `podsecuritypolicies` resources in the `policy` API group.
* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * `bind` and `escalate` verbs on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
* [Authentication](/docs/reference/access-authn-authz/authentication/)
  * `impersonate` verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.
-->
Kubernetes 有时使用专门的动词以对额外的权限进行鉴权。例如：

* [PodSecurityPolicy](/zh/docs/concepts/policy/pod-security-policy/)
  * `policy` API 组中 `podsecuritypolicies` 资源使用 `use` 动词
* [RBAC](/zh/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * 对 `rbac.authorization.k8s.io` API 组中 `roles` 和 `clusterroles` 资源的 `bind`
    和 `escalate` 动词
* [身份认证](/zh/docs/reference/access-authn-authz/authentication/)
  * 对核心 API 组中 `users`、`groups` 和 `serviceaccounts` 以及 `authentication.k8s.io`
    API 组中的 `userextras` 所使用的 `impersonate` 动词。

<!--
## Authorization Modules  {#authorization-modules}

 * **Node** - A special-purpose authorizer that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about using the Node authorization mode, see [Node Authorization](/docs/reference/access-authn-authz/node/).
 * **ABAC** - Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes, etc). To learn more about using the ABAC mode, see [ABAC Mode](/docs/reference/access-authn-authz/abac/).
 * **RBAC** - Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file. To learn more about using the RBAC mode, see [RBAC Mode](/docs/reference/access-authn-authz/rbac/)
   * When specified RBAC (Role-Based Access Control) uses the `rbac.authorization.k8s.io` API group to drive authorization decisions, allowing admins to dynamically configure permission policies through the Kubernetes API.
   * To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.
 * **Webhook** - A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen. To learn more about using the Webhook mode, see [Webhook Mode](/docs/reference/access-authn-authz/webhook/).
-->
## 鉴权模块  {#authorization-modules}

* **Node** - 一个专用鉴权组件，根据调度到 kubelet 上运行的 Pod 为 kubelet 授予权限。
  了解有关使用节点鉴权模式的更多信息，请参阅[节点鉴权](/zh/docs/reference/access-authn-authz/node/)。
* **ABAC** - 基于属性的访问控制（ABAC）定义了一种访问控制范型，通过使用将属性组合
  在一起的策略，将访问权限授予用户。策略可以使用任何类型的属性（用户属性、资源属性、
  对象，环境属性等）。要了解有关使用 ABAC 模式的更多信息，请参阅
  [ABAC 模式](/zh/docs/reference/access-authn-authz/abac/)。
* **RBAC** - 基于角色的访问控制（RBAC）是一种基于企业内个人用户的角色来管理对
  计算机或网络资源的访问的方法。在此上下文中，权限是单个用户执行特定任务的能力，
  例如查看、创建或修改文件。要了解有关使用 RBAC 模式的更多信息，请参阅
  [RBAC 模式](/zh/docs/reference/access-authn-authz/rbac/)。
  * 被启用之后，RBAC（基于角色的访问控制）使用 `rbac.authorization.k8s.io` API 组来
    驱动鉴权决策，从而允许管理员通过 Kubernetes API 动态配置权限策略。
  * 要启用 RBAC，请使用 `--authorization-mode = RBAC` 启动 API 服务器。
* **Webhook** - WebHook 是一个 HTTP 回调：发生某些事情时调用的 HTTP POST；
  通过 HTTP POST 进行简单的事件通知。实现 WebHook 的 Web 应用程序会在发生某些事情时
  将消息发布到 URL。要了解有关使用 Webhook 模式的更多信息，请参阅
  [Webhook 模式](/zh/docs/reference/access-authn-authz/webhook/)。

<!--
#### Checking API Access

`kubectl` provides the `auth can-i` subcommand for quickly querying the API authorization layer.
The command uses the `SelfSubjectAccessReview` API to determine if the current user can perform
a given action, and works regardless of the authorization mode used.
-->
#### 检查 API 访问   {#checking-api-access}

`kubectl` 提供 `auth can-i` 子命令，用于快速查询 API 鉴权。
该命令使用 `SelfSubjectAccessReview` API 来确定当前用户是否可以执行给定操作，
无论使用何种鉴权模式该命令都可以工作。

```shell
kubectl auth can-i create deployments --namespace dev
```
```
yes
```

```shell
kubectl auth can-i create deployments --namespace prod
```
```
no
```

<!--
Administrators can combine this with [user impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation)
to determine what action other users can perform.
-->
管理员可以将此与
[用户扮演](/zh/docs/reference/access-authn-authz/authentication/#user-impersonation)
结合使用，以确定其他用户可以执行的操作。

```bash
kubectl auth can-i list secrets --namespace dev --as dave
```
```
no
```

<!--
`SelfSubjectAccessReview` is part of the `authorization.k8s.io` API group, which
exposes the API server authorization to external services. Other resources in
this group include:

* `SubjectAccessReview` - Access review for any user, not just the current one. Useful for delegating authorization decisions to the API server. For example, the kubelet and extension API servers use this to determine user access to their own APIs.
* `LocalSubjectAccessReview` - Like `SubjectAccessReview` but restricted to a specific namespace.
* `SelfSubjectRulesReview` - A review which returns the set of actions a user can perform within a namespace. Useful for users to quickly summarize their own access, or for UIs to hide/show actions.

These APIs can be queried by creating normal Kubernetes resources, where the response "status"
field of the returned object is the result of the query.
-->
`SelfSubjectAccessReview` 是 `authorization.k8s.io` API 组的一部分，它将 API
服务器鉴权公开给外部服务。该组中的其他资源包括：

* `SubjectAccessReview` - 对任意用户的访问进行评估，而不仅仅是当前用户。
  当鉴权决策被委派给 API 服务器时很有用。例如，kubelet 和扩展 API 服务器使用
  它来确定用户对自己的 API 的访问权限。
* `LocalSubjectAccessReview` - 与 `SubjectAccessReview` 类似，但仅限于特定的
  名字空间。
* `SelfSubjectRulesReview` - 返回用户可在名字空间内执行的操作集的审阅。
  用户可以快速汇总自己的访问权限，或者用于 UI 中的隐藏/显示动作。

可以通过创建普通的 Kubernetes 资源来查询这些 API，其中返回对象的响应 “status”
字段是查询的结果。

```bash
kubectl create -f - -o yaml << EOF
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
spec:
  resourceAttributes:
    group: apps
    name: deployments
    verb: create
    namespace: dev
EOF
```

<!--
The generated `SelfSubjectAccessReview` is:
-->
生成的 `SelfSubjectAccessReview` 为：

```yaml
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
metadata:
  creationTimestamp: null
spec:
  resourceAttributes:
    group: apps
    name: deployments
    namespace: dev
    verb: create
status:
  allowed: true
  denied: false
```

<!--
## Using Flags for Your Authorization Module

You must include a flag in your policy to indicate which authorization module
your policies include:

The following flags can be used:
-->
## 为你的鉴权模块设置参数

你必须在策略中包含一个参数标志，以指明你的策略包含哪个鉴权模块：

可以使用的参数有：

<!--
  * `--authorization-mode=ABAC` Attribute-Based Access Control (ABAC) mode allows you to configure policies using local files.
  * `--authorization-mode=RBAC` Role-based access control (RBAC) mode allows you to create and store policies using the Kubernetes API.
  * `--authorization-mode=Webhook` WebHook is an HTTP callback mode that allows you to manage authorization using a remote REST endpoint.
  * `--authorization-mode=Node` Node authorization is a special-purpose authorization mode that specifically authorizes API requests made by kubelets.
  * `--authorization-mode=AlwaysDeny` This flag blocks all requests. Use this flag only for testing.
  * `--authorization-mode=AlwaysAllow` This flag allows all requests. Use this flag only if you do not require authorization for your API requests.
-->
* `--authorization-mode=ABAC` 基于属性的访问控制（ABAC）模式允许你
  使用本地文件配置策略。
* `--authorization-mode=RBAC` 基于角色的访问控制（RBAC）模式允许你使用
  Kubernetes API 创建和存储策略。
* `--authorization-mode=Webhook` WebHook 是一种 HTTP 回调模式，允许你使用远程
  REST 端点管理鉴权。
* `--authorization-mode=Node` 节点鉴权是一种特殊用途的鉴权模式，专门对
  kubelet 发出的 API 请求执行鉴权。
* `--authorization-mode=AlwaysDeny` 该标志阻止所有请求。仅将此标志用于测试。
* `--authorization-mode=AlwaysAllow` 此标志允许所有请求。仅在你不需要 API 请求
  的鉴权时才使用此标志。

<!--
You can choose more than one authorization module. Modules are checked in order
so an earlier module has higher priority to allow or deny a request.
-->
你可以选择多个鉴权模块。模块按顺序检查，以便较靠前的模块具有更高的优先级来允许
或拒绝请求。

<!--
## Privilege escalation via pod creation

Users who have the ability to create pods in a namespace can potentially
escalate their privileges within that namespace.  They can create pods that
access their privileges within that namespace. They can create pods that access
secrets the user cannot themselves read, or that run under a service account
with different/greater permissions.
-->
## 通过创建 Pod 提升权限

能够在名字空间中创建 Pod 的用户可能会提升其在该名字空间内的权限。
他们可以创建在该名字空间内访问其权限的 Pod。
他们可以创建 Pod 访问用户自己无法读取的 Secret，或者在具有不同/更高权限的
服务帐户下运行的 Pod 。

{{< caution >}}
<!--
System administrators, use care when granting access to pod creation.  A user
granted permission to create pods (or controllers that create pods) in the
namespace can: read all secrets in the namespace; read all config maps in the
namespace; and impersonate any service account in the namespace and take any
action the account could take. This applies regardless of authorization mode.
-->
系统管理员在授予对 Pod 创建的访问权限时要小心。
被授予在名字空间中创建 Pod（或创建 Pod 的控制器）的权限的用户可以：
读取名字空间中的所有 Secret；读取名字空间中的所有 ConfigMap；
并模拟名字空间中的任意服务账号并执行账号可以执行的任何操作。
无论采用何种鉴权方式，这都适用。
{{< /caution >}}

## {{% heading "whatsnext" %}}

<!--
* To learn more about Authentication, see **Authentication** in [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).
-->
* 要了解有关身份验证的更多信息，请参阅
  [控制对 Kubernetes API 的访问](/zh/docs/concepts/security/controlling-access/)
  中的 **身份验证**  部分。
* 要了解有关准入控制的更多信息，请参阅
  [使用准入控制器](/zh/docs/reference/access-authn-authz/admission-controllers/)。

