---
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
cnapprove:
- fatalc
<!-- title: Authorization Overview -->
title: 授权概述
content_template: templates/concept
weight: 60
---

{{% capture overview %}}
<!-- Learn more about Kubernetes authorization, including details about creating
policies using the supported authorization modules. -->
了解有关 Kubernetes 授权的更多信息，包括使用支持的授权模块创建策略的详细信息。
{{% /capture %}}

{{% capture body %}}
<!-- In Kubernetes, you must be authenticated (logged in) before your request can be
authorized (granted permission to access). For information about authentication,
see [Accessing Control Overview](/docs/reference/access-authn-authz/controlling-access/).

Kubernetes expects attributes that are common to REST API requests. This means
that Kubernetes authorization works with existing organization-wide or
cloud-provider-wide access control systems which may handle other APIs besides
the Kubernetes API. -->

在Kubernetes中，您必须在授权（授予访问权限）之前进行身份验证（登录），有关身份验证的信息，
请参阅 [访问控制概述](/docs/reference/access-authn-authz/controlling-access/).

Kubernetes期望REST API请求中常见的属性。
这意味着Kubernetes授权适用于现有的组织范围或云提供商范围的访问控制系统，
除了Kubernetes API之外，它还可以处理其他API。

<!-- ## Determine Whether a Request is Allowed or Denied
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
the request, then the request is denied. A deny returns an HTTP status code 403. -->

## 确定是允许还是拒绝请求
Kubernetes 使用 API ​​服务器授权 API 请求。它根据所有策略评估所有请求属性来决定允许或拒绝请求。
一个API请求的所有部分必须被某些策略允许才能继续。这意味着默认情况下拒绝权限。

（尽管 Kubernetes 使用 API ​​服务器，但是依赖于特定种类对象的特定字段的访问控制和策略由准入控制器处理。）

配置多个授权模块时，将按顺序检查每个模块。
如果任何授权模块批准或拒绝请求，则立即返回该决定，并且不会与其他授权模块协商。
如果所有模块对请求没有意见，则拒绝该请求。一个拒绝响应返回 HTTP 状态代码 403 。

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
 * **API group** - The API group being accessed (for resource requests only). An empty string designates the [core API group](/docs/concepts/overview/kubernetes-api/).
-->

## 审查您的请求属性
Kubernetes仅审查以下API请求属性：

 * **user** - 身份验证期间提供的`user`字符串。
 * **group** - 经过身份验证的用户所属的组名列表。
 * **extra** - 由身份验证层提供的任意字符串键到字符串值的映射。
 * **API** - 指示请求是否针对 API 资源。
 * **Request path** - 各种非资源端点的路径，如`/api`或`/healthz`。
 * **API request verb** - API 动词`get`，`list`，`create`，`update`，`patch`，`watch`，`proxy`，`redirect`，`delete`和`deletecollection`用于资源请求。要确定资源API端点的请求动词，请参阅[确定请求动词](/docs/reference/access-authn-authz/authorization/#determine-whether-a-request-is-allowed-or-denied)。
 * **HTTP request verb** - HTTP 动词`get`，`post`，`put`和`delete`用于非资源请求。
 * **Resource** - 正在访问的资源的 ID 或名称（仅限资源请求） - 对于使用`get`，`update`，`patch`和`delete`动词的资源请求，您必须提供资源名称。
 * **Subresource** - 正在访问的子资源（仅限资源请求）。
 * **Namespace** - 正在访问的对象的名称空间（仅适用于命名空间资源请求）。
 * **API group** - 正在访问的 API 组（仅限资源请求）。空字符串表示[核心API组](/docs/concepts/overview/kubernetes-api/)。

<!--
## Determine the Request Verb
To determine the request verb for a resource API endpoint, review the HTTP verb
used and whether or not the request acts on an individual resource or a
collection of resources:

HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get (for individual resources), list (for collections)
PUT       | update
PATCH     | patch
DELETE    | delete (for individual resources), deletecollection (for collections)

Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/) checks for authorization of the `use` verb on `podsecuritypolicies` resources in the `policy` API group.
* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping) checks for authorization 
of the `bind` verb on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
* [Authentication](/docs/reference/access-authn-authz/authentication/) layer checks for authorization of the `impersonate` verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.
-->

## 确定请求动词

要确定资源API端点的请求谓词，请检查所使用的 HTTP 动词以及请求是否对单个资源或资源集合起作用：

HTTP 动词 | request 动词
----------|---------------
POST      | create
GET, HEAD | get (单个资源), list (资源集合)
PUT       | update
PATCH     | patch
DELETE    | delete (单个资源), deletecollection (资源集合)

Kubernetes有时使用专门的动词检查授权以获得额外的权限。例如：

* [Pod安全策略](/docs/concepts/policy/pod-security-policy/) 检查`policy` API组中`podsecuritypolicies`资源的`use`动词的授权。
* [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping) 检查`rbac.authorization.k8s.io` API 组中`roles`和`clusterroles`资源的`bind`动词的授权。
* [认证](/docs/reference/access-authn-authz/authentication/) layer检查核心API组中`users`，`groups`和`serviceaccounts`的`impersonate`动词的授权，以及`authentication.k8s.io` API组中的`userextras`。

<!--
## Authorization Modules
 * **Node** - A special-purpose authorizer that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about using the Node authorization mode, see [Node Authorization](/docs/reference/access-authn-authz/node/).
 * **ABAC** - Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes, etc). To learn more about using the ABAC mode, see [ABAC Mode](/docs/reference/access-authn-authz/abac/).
 * **RBAC** - Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file. To learn more about using the RBAC mode, see [RBAC Mode](/docs/reference/access-authn-authz/rbac/)
   * When specified RBAC (Role-Based Access Control) uses the `rbac.authorization.k8s.io` API group to drive authorization decisions, allowing admins to dynamically configure permission policies through the Kubernetes API.
   * To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.
 * **Webhook** - A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen. To learn more about using the Webhook mode, see [Webhook Mode](/docs/reference/access-authn-authz/webhook/).
 -->
 
## 授权模块
 * **Node** - 一个专用授权程序，根据计划运行的 pod 为 kubelet 授予权限。了解有关使用节点授权模式的更多信息，请参阅[节点授权](/docs/reference/access-authn-authz/node/).
 * **ABAC** - 基于属性的访问控制（ABAC) 定义了一种访问控制范例，通过使用将属性组合在一起的策略，将访问权限授予用户。策略可以使用任何类型的属性（用户属性，资源属性，对象，环境属性等）。要了解有关使用 ABAC 模式的更多信息，请参阅[ABAC 模式](/docs/reference/access-authn-authz/abac/)。
 * **RBAC** - 基于角色的访问控制（RBAC）是一种基于企业内个人用户的角色来管理对计算机或网络资源的访问的方法。在此上下文中，权限是单个用户执行特定任务的能力，例如查看，创建或修改文件。要了解有关使用 RBAC 模式的更多信息，请参阅[RBAC 模式](/docs/reference/access-authn-authz/rbac/)。
   * 当指定的RBAC（基于角色的访问控制）使用`rbac.authorization.k8s.io` API 组来驱动授权决策时，允许管理员通过 Kubernetes API 动态配置权限策略。
   * 要启用RBAC，请使用`--authorization-mode = RBAC`启动 apiserver 。
 * **Webhook** - WebHook 是一个 HTTP 回调: 发生某些事情时调用的 HTTP POST;通过 HTTP POST 进行简单的事件通知。实现 WebHooks 的 Web 应用程序会在发生某些事情时将消息发布到URL。要了解有关使用 Webhook 模式的更多信息，请参阅[Webhook 模式](/docs/reference/access-authn-authz/webhook/)。

<!--
#### Checking API Access

`kubectl` provides the `auth can-i` subcommand for quickly querying the API authorization layer.
The command uses the `SelfSubjectAccessReview` API to determine if the current user can perform
a given action, and works regardless of the authorization mode used.
-->

#### 检查API访问

`kubectl`提供`auth can-i`子命令，用于快速查询 API 授权层。
该命令使用`SelfSubjectAccessReview` API来确定当前用户是否可以执行给定操作，并且无论使用何种授权模式都可以工作。

```bash
$ kubectl auth can-i create deployments --namespace dev
yes
$ kubectl auth can-i create deployments --namespace prod
no
```
<!-- 
Administrators can combine this with [user impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation)
to determine what action other users can perform.
-->
管理员可以将此与[用户模拟](/docs/reference/access-authn-authz/authentication/#user-impersonation)结合使用，以确定其他用户可以执行的操作。

```bash
$ kubectl auth can-i list secrets --namespace dev --as dave
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

`SelfSubjectAccessReview`是`authorization.k8s.io` API组的一部分，它将 API 服务器授权公开给外部服务。
该组中的其他资源包括：

* `SubjectAccessReview` - 访问任何用户的 Review ，而不仅仅是当前用户。用于将授权决策委派给API服务器。例如，kubelet 和扩展 API 服务器使用它来确定用户对自己的API的访问权限。
* `LocalSubjectAccessReview` - 与`SubjectAccessReview`类似，但仅限于特定的命名空间。
* `SelfSubjectRulesReview` - 返回用户可在命名空间内执行的操作集的审阅。用户可以快速汇总自己的访问权限，或者用于隐藏/显示操作的UI。

可以通过创建普通 Kubernetes 资源来查询这些 API ，其中返回对象的响应“status”字段是查询的结果。

```bash
$ kubectl create -f - -o yaml << EOF
apiVersion: authorization.k8s.io/v1
kind: SelfSubjectAccessReview
spec:
  resourceAttributes:
    group: apps
    name: deployments
    verb: create
    namespace: dev
EOF

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

  * `--authorization-mode=ABAC` Attribute-Based Access Control (ABAC) mode allows you to configure policies using local files.
  * `--authorization-mode=RBAC` Role-based access control (RBAC) mode allows you to create and store policies using the Kubernetes API.
  * `--authorization-mode=Webhook` WebHook is an HTTP callback mode that allows you to manage authorization using a remote REST endpoint.
  * `--authorization-mode=Node` Node authorization is a special-purpose authorization mode that specifically authorizes API requests made by kubelets.
  * `--authorization-mode=AlwaysDeny` This flag blocks all requests. Use this flag only for testing.
  * `--authorization-mode=AlwaysAllow` This flag allows all requests. Use this flag only if you do not require authorization for your API requests.

You can choose more than one authorization module. Modules are checked in order
so an earlier module has higher priority to allow or deny a request.
-->

## 为您的授权模块使用标志

您必须在策略中包含一个标志，以指明您的策略包含哪个授权模块：

可以使用以下标志：

  * `--authorization-mode=ABAC` 基于属性的访问控制（ABAC）模式允许您使用本地文件配置策略。
  * `--authorization-mode=RBAC` 基于角色的访问控制（RBAC）模式允许您使用 Kubernetes API 创建和存储策略。
  * `--authorization-mode=Webhook` WebHook 是一种 HTTP 回调模式，允许您使用远程REST端点管理授权。
  * `--authorization-mode=Node` 节点授权是一种特殊用途的授权模式，专门授权由 kubelet 发出的API请求。
  * `--authorization-mode=AlwaysDeny` 该标志阻止所有请求。仅将此标志用于测试。
  * `--authorization-mode=AlwaysAllow` 此标志允许所有请求。仅在您不需要 API 请求的授权时才使用此标志。

您可以选择多个授权模块。按顺序检查模块，以便较早的模块具有更高的优先级来允许或拒绝请求。

<!--
## Privilege escalation via pod creation

Users who have the ability to create pods in a namespace can potentially
escalate their privileges within that namespace.  They can create pods that
access their privileges within that namespace. They can create pods that access
secrets the user cannot themselves read, or that run under a service account
with different/greater permissions.
-->
## 通过pod创建权限升级

能够在命名空间中创建 pod 的用户可能会升级其在该命名空间内的权限。
他们可以创建在该命名空间内访问其权限的 pod 。
他们可以创建用户无法自己读取 secret 的 pod ，或者在具有不同/更高权限的服务帐户下运行的 pod 。

{{< caution >}}
<!--
System administrators, use care when granting access to pod
creation.  A user granted permission to create pods (or controllers that create
pods) in the namespace can: read all secrets in the namespace; read all config
maps in the namespace; and impersonate any service account in the namespace and
take any action the account could take. This applies regardless of authorization
mode.
-->
**注意：** 系统管理员在授予对 pod 创建的访问权限时要小心。
授予在命名空间中创建 pod（或创建pod的控制器）的权限的用户可以：
读取命名空间中的所有秘密;读取命名空间中的所有配置映射;
并模拟命名空间中的任何服务帐户并执行帐户可以执行的任何操作。
无论采用何种授权方式，这都适用。
{{< /caution >}}
{{% /capture %}}

{{% capture whatsnext %}}
<!--
* To learn more about Authentication, see **Authentication** in [Controlling Access to the Kubernetes API](/docs/reference/access-authn-authz/controlling-access/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).
-->
* 要了解有关身份验证的更多信息，请参阅 **身份验证** [控制对Kubernetes API的访问](/docs/reference/access-authn-authz/controlling-access/).
* 要了解有关准入控制的更多信息，请参阅 [使用准入控制器](/docs/reference/access-authn-authz/admission-controllers/).
{{% /capture %}}