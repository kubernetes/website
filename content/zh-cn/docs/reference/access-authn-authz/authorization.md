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
请参阅[访问控制概述](/zh-cn/docs/concepts/security/controlling-access/).

Kubernetes 期望请求中存在 REST API 常见的属性。
这意味着 Kubernetes 鉴权适用于现有的组织范围或云提供商范围的访问控制系统，
除了 Kubernetes API 之外，它还可以处理其他 API。

<!--
## Determine Whether a Request is Allowed or Denied

Kubernetes authorizes API requests using the API server. It evaluates all of the
request attributes against all policies and allows or denies the request. All
parts of an API request must be allowed by some policy in order to proceed. This
means that permissions are denied by default.
-->
## 确定是允许还是拒绝请求  {#determine-whether-a-request-is-allowed-or-denied}

Kubernetes 使用 API 服务器对 API 请求进行鉴权。
它根据所有策略评估所有请求属性来决定允许或拒绝请求。
一个 API 请求的所有部分都必须被某些策略允许才能继续。
这意味着默认情况下拒绝权限。

<!--
(Although Kubernetes uses the API server, access controls and policies that
depend on specific fields of specific kinds of objects are handled by Admission
Controllers.)

When multiple authorization modules are configured, each is checked in sequence.
If any authorizer approves or denies a request, that decision is immediately
returned and no other authorizer is consulted. If all modules have no opinion on
the request, then the request is denied. A deny returns an HTTP status code 403.
-->
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

* **用户** —— 身份验证期间提供的 `user` 字符串。
* **组** —— 经过身份验证的用户所属的组名列表。
* **额外信息** —— 由身份验证层提供的任意字符串键到字符串值的映射。
* **API** —— 指示请求是否针对 API 资源。
* **请求路径** —— 各种非资源端点的路径，如 `/api` 或 `/healthz`。
* **API 请求动词** —— API 动词 `get`、`list`、`create`、`update`、`patch`、`watch`、
  `proxy`、`redirect`、`delete` 和 `deletecollection` 用于资源请求。
  要确定资源 API 端点的请求动词，请参阅[确定请求动词](#determine-the-request-verb)。
* **HTTP 请求动词** —— HTTP 动词 `get`、`post`、`put` 和 `delete` 用于非资源请求。
* **资源** —— 正在访问的资源的 ID 或名称（仅限资源请求）- 
  对于使用 `get`、`update`、`patch` 和 `delete` 动词的资源请求，你必须提供资源名称。
* **子资源** —— 正在访问的子资源（仅限资源请求）。
* **名字空间** —— 正在访问的对象的名称空间（仅适用于名字空间资源请求）。
* **API 组** —— 正在访问的 {{< glossary_tooltip text="API 组" term_id="api-group" >}}
  （仅限资源请求）。空字符串表示[核心 API 组](/zh-cn/docs/reference/using-api/#api-groups)。

<!--
## Determine the Request Verb

**Non-resource requests**
Requests to endpoints other than `/api/v1/...` or `/apis/<group>/<version>/...`
are considered "non-resource requests", and use the lower-cased HTTP method of the request as the verb.

For example, a `GET` request to endpoints like `/api` or `/healthz` would use `get` as the verb.
-->
## 确定请求动词  {#determine-the-request-verb}

**非资源请求**

对于 `/api/v1/...` 或 `/apis/<group>/<version>/...`
之外的端点的请求被视为 “非资源请求（Non-Resource Requests）”，
并使用该请求的 HTTP 方法的小写形式作为其请求动词。

例如，对 `/api` 或 `/healthz` 这类端点的 `GET` 请求将使用 `get` 作为其动词。

<!--
**Resource requests**

To determine the request verb for a resource API endpoint, review the HTTP verb
used and whether or not the request acts on an individual resource or a
collection of resources:
-->
**资源请求**

要确定对资源 API 端点的请求动词，需要查看所使用的 HTTP 动词以及该请求是针对单个资源还是一组资源：

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

{{< caution >}}
<!--
The `get`, `list` and `watch` verbs can all return the full details of a resource. In terms of the returned data they are equivalent. For example, `list` on `secrets` will still reveal the `data` attributes of any returned resources.
-->
`get`、`list` 和 `watch` 动作都可以返回一个资源的完整详细信息。就返回的数据而言，它们是等价的。
例如，对 `secrets` 使用 `list` 仍然会显示所有已返回资源的 `data` 属性。
{{< /caution >}}

<!--
Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * `bind` and `escalate` verbs on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
* [Authentication](/docs/reference/access-authn-authz/authentication/)
  * `impersonate` verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.
-->
Kubernetes 有时使用专门的动词以对额外的权限进行鉴权。例如：

* [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * 对 `rbac.authorization.k8s.io` API 组中 `roles` 和 `clusterroles` 资源的 `bind`
    和 `escalate` 动词
* [身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/)
  * 对核心 API 组中 `users`、`groups` 和 `serviceaccounts` 以及 `authentication.k8s.io`
    API 组中的 `userextras` 所使用的 `impersonate` 动词。

<!--
## Authorization Modules  {#authorization-modules}

 * **Node** - A special-purpose authorization mode that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about using the Node authorization mode, see [Node Authorization](/docs/reference/access-authn-authz/node/).
 * **ABAC** - Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes, etc). To learn more about using the ABAC mode, see [ABAC Mode](/docs/reference/access-authn-authz/abac/).
 * **RBAC** - Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file. To learn more about using the RBAC mode, see [RBAC Mode](/docs/reference/access-authn-authz/rbac/)
   * When specified RBAC (Role-Based Access Control) uses the `rbac.authorization.k8s.io` API group to drive authorization decisions, allowing admins to dynamically configure permission policies through the Kubernetes API.
   * To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.
 * **Webhook** - A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen. To learn more about using the Webhook mode, see [Webhook Mode](/docs/reference/access-authn-authz/webhook/).
-->
## 鉴权模块  {#authorization-modules}

* **Node** —— 一个专用鉴权模式，根据调度到 kubelet 上运行的 Pod 为 kubelet 授予权限。
  要了解有关使用节点鉴权模式的更多信息，请参阅[节点鉴权](/zh-cn/docs/reference/access-authn-authz/node/)。
* **ABAC** —— 基于属性的访问控制（ABAC）定义了一种访问控制范型，通过使用将属性组合在一起的策略，
  将访问权限授予用户。策略可以使用任何类型的属性（用户属性、资源属性、对象，环境属性等）。
  要了解有关使用 ABAC 模式的更多信息，请参阅
  [ABAC 模式](/zh-cn/docs/reference/access-authn-authz/abac/)。
* **RBAC** —— 基于角色的访问控制（RBAC）
  是一种基于企业内个人用户的角色来管理对计算机或网络资源的访问的方法。
  在此上下文中，权限是单个用户执行特定任务的能力，
  例如查看、创建或修改文件。要了解有关使用 RBAC 模式的更多信息，请参阅
  [RBAC 模式](/zh-cn/docs/reference/access-authn-authz/rbac/)。
  * 被启用之后，RBAC（基于角色的访问控制）使用 `rbac.authorization.k8s.io` API
    组来驱动鉴权决策，从而允许管理员通过 Kubernetes API 动态配置权限策略。
  * 要启用 RBAC，请使用 `--authorization-mode = RBAC` 启动 API 服务器。
* **Webhook** —— WebHook 是一个 HTTP 回调：发生某些事情时调用的 HTTP POST；
  通过 HTTP POST 进行简单的事件通知。
  实现 WebHook 的 Web 应用程序会在发生某些事情时将消息发布到 URL。
  要了解有关使用 Webhook 模式的更多信息，请参阅
  [Webhook 模式](/zh-cn/docs/reference/access-authn-authz/webhook/)。

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

<!--
The output is similar to this:
-->
输出类似于：

```
yes
```

```shell
kubectl auth can-i create deployments --namespace prod
```

<!--
The output is similar to this:
-->
输出类似于：

```
no
```

<!--
Administrators can combine this with [user impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation)
to determine what action other users can perform.
-->
管理员可以将此与[用户扮演（User Impersonation）](/zh-cn/docs/reference/access-authn-authz/authentication/#user-impersonation)
结合使用，以确定其他用户可以执行的操作。

```bash
kubectl auth can-i list secrets --namespace dev --as dave
```

<!--
The output is similar to this:
-->
输出类似于：

```
no
```

<!--
Similarly, to check whether a ServiceAccount named `dev-sa` in Namespace `dev`
can list Pods in the Namespace `target`:
-->
类似地，检查名字空间 `dev` 里的 `dev-sa` 服务账户是否可以列举名字空间 `target` 里的 Pod：

```bash
kubectl auth can-i list pods \
	--namespace target \
	--as system:serviceaccount:dev:dev-sa
```

<!--
The output is similar to this:
-->
输出类似于：

```
yes
```

<!--
`SelfSubjectAccessReview` is part of the `authorization.k8s.io` API group, which
exposes the API server authorization to external services. Other resources in
this group include:

* `SubjectAccessReview` - Access review for any user, not only the current one. Useful for delegating authorization decisions to the API server. For example, the kubelet and extension API servers use this to determine user access to their own APIs.
* `LocalSubjectAccessReview` - Like `SubjectAccessReview` but restricted to a specific namespace.
* `SelfSubjectRulesReview` - A review which returns the set of actions a user can perform within a namespace. Useful for users to quickly summarize their own access, or for UIs to hide/show actions.

These APIs can be queried by creating normal Kubernetes resources, where the response "status"
field of the returned object is the result of the query.
-->
`SelfSubjectAccessReview` 是 `authorization.k8s.io` API 组的一部分，它将 API
服务器鉴权公开给外部服务。该组中的其他资源包括：

* `SubjectAccessReview` - 对任意用户的访问进行评估，而不仅仅是当前用户。
  当鉴权决策被委派给 API 服务器时很有用。例如，kubelet 和扩展 API
  服务器使用它来确定用户对自己的 API 的访问权限。
* `LocalSubjectAccessReview` - 与 `SubjectAccessReview` 类似，但仅限于特定的名字空间。
* `SelfSubjectRulesReview` - 返回用户可在名字空间内执行的操作集的审阅。
  用户可以快速汇总自己的访问权限，或者用于 UI 中的隐藏/显示动作。

可以通过创建普通的 Kubernetes 资源来查询这些 API，其中返回对象的响应 "status"
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
## 为你的鉴权模块设置参数  {#using-flags-for-your-authorization-module}

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
* `--authorization-mode=ABAC` 基于属性的访问控制（ABAC）模式允许你使用本地文件配置策略。
* `--authorization-mode=RBAC` 基于角色的访问控制（RBAC）模式允许你使用
  Kubernetes API 创建和存储策略。
* `--authorization-mode=Webhook` WebHook 是一种 HTTP 回调模式，允许你使用远程
  REST 端点管理鉴权。
* `--authorization-mode=Node` 节点鉴权是一种特殊用途的鉴权模式，专门对
  kubelet 发出的 API 请求执行鉴权。
* `--authorization-mode=AlwaysDeny` 该标志阻止所有请求。仅将此标志用于测试。
* `--authorization-mode=AlwaysAllow` 此标志允许所有请求。仅在你不需要 API 请求的鉴权时才使用此标志。

<!--
You can choose more than one authorization module. Modules are checked in order
so an earlier module has higher priority to allow or deny a request.
-->
你可以选择多个鉴权模块。模块按顺序检查，以便较靠前的模块具有更高的优先级来允许或拒绝请求。

<!--
## Privilege escalation via workload creation or edits {#privilege-escalation-via-pod-creation}

Users who can create/edit pods in a namespace, either directly or through a [controller](/docs/concepts/architecture/controller/)
such as an operator, could escalate their privileges in that namespace.
-->
## 通过创建或编辑工作负载提升权限 {#privilege-escalation-via-pod-creation}

能够在名字空间中创建或者编辑 Pod 的用户，
无论是直接操作还是通过[控制器](/zh-cn/docs/concepts/architecture/controller/)
（例如，一个 Operator）来操作，都可以提升他们在该名字空间内的权限。

{{< caution >}}
<!--
System administrators, use care when granting access to create or edit workloads.
Details of how these can be misused are documented in [escalation paths](/docs/reference/access-authn-authz/authorization/#escalation-paths)
-->
系统管理员在授予对工作负载的创建或编辑的权限时要小心。
关于这些权限如何被误用的详细信息请参阅
[提升途径](#escalation-paths)
{{< /caution >}}

<!--
### Escalation paths {#escalation-paths}
- Mounting arbitrary secrets in that namespace
  - Can be used to access secrets meant for other workloads
  - Can be used to obtain a more privileged service account's service account token
- Using arbitrary Service Accounts in that namespace
  - Can perform Kubernetes API actions as another workload (impersonation)
  - Can perform any privileged actions that Service Account has
- Mounting configmaps meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, such as DB host names.
- Mounting volumes meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, and change it.
-->
### 特权提升途径 {#escalation-paths}

- 挂载该名字空间内的任意 Secret
  - 可以用来访问其他工作负载专用的 Secret
  - 可以用来获取权限更高的服务账号的令牌
- 使用该名字空间内的任意服务账号
  - 可以用另一个工作负载的身份来访问 Kubernetes API（伪装）
  - 可以执行该服务账号的任意特权操作
- 挂载该名字空间里其他工作负载专用的 ConfigMap
  - 可以用来获取其他工作负载专用的信息，例如数据库主机名。
- 挂载该名字空间里其他工作负载的卷
  - 可以用来获取其他工作负载专用的信息，并且更改它。

{{< caution >}}
<!--
System administrators should be cautious when deploying CRDs that
change the above areas. These may open privilege escalations paths.
This should be considered when deciding on your RBAC controls.
-->
系统管理员在部署改变以上部分的 CRD 的时候要小心。
它们可能会打开权限提升的途径。
在决定你的 RBAC 控制时应该考虑这方面的问题。
{{< /caution >}}


## {{% heading "whatsnext" %}}

<!--
* To learn more about Authentication, see **Authentication** in [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).
-->
* 要了解有关身份验证的更多信息，
  请参阅[控制对 Kubernetes API 的访问](/zh-cn/docs/concepts/security/controlling-access/)中的
  **身份验证**  部分。
* 要了解有关准入控制的更多信息，请参阅[使用准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)。

