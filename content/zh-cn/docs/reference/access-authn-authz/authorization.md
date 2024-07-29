---
title: 鉴权
content_type: concept
weight: 30
description: >
  Kubernetes 鉴权机制和支持的鉴权模式的详细信息。
---

<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Authorization
content_type: concept
weight: 30
description: >
  Details of Kubernetes authorization mechanisms and supported authorization modes.
-->

<!-- overview -->

<!--
Kubernetes authorization takes place following
[authentication](/docs/reference/access-authn-authz/authentication/).
Usually, a client making a request must be authenticated (logged in) before its
request can be allowed; however, Kubernetes also allows anonymous requests in
some circumstances.

For an overview of how authorization fits into the wider context of API access
control, read
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
-->
Kubernetes 鉴权在[身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/)之后进行。
通常，发出请求的客户端必须经过身份验证（登录）才能允许其请求；
但是，Kubernetes 在某些情况下也允许匿名请求。

有关鉴权在 API 访问控制中的位置这类进一步的语境信息，
请阅读[控制对 Kubernetes API 的访问](/zh-cn/docs/concepts/security/controlling-access/)。

<!-- body -->

<!--
## Authorization verdicts {#determine-whether-a-request-is-allowed-or-denied}

Kubernetes authorization of API requests takes place within the API server.
The API server evaluates all of the request attributes against all policies,
potentially also consulting external services, and then allows or denies the
request.
-->
## 鉴权裁定   {#determine-whether-a-request-is-allowed-or-denied}

Kubernetes 对 API 请求的鉴权在 API 服务器内进行。
API 服务器根据所有策略评估所有请求属性，可能还会咨询外部服务，然后允许或拒绝该请求。

<!--
All parts of an API request must be allowed by some authorization
mechanism in order to proceed. In other words: access is denied by default.
-->
API 请求的所有部分都必须通过某种鉴权机制才能继续，
换句话说：默认情况下拒绝访问。

{{% note %}}
<!--
Access controls and policies that
depend on specific fields of specific kinds of objects are handled by
{{< glossary_tooltip text="admission controllers" term_id="admission-controller" >}}.

Kubernetes admission control happens after authorization has completed (and,
therefore, only when the authorization decision was to allow the request).
-->
依赖于特定对象种类的特定字段的访问控制和策略由{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}处理。

Kubernetes 准入控制发生在鉴权完成之后（因此，仅当鉴权决策是允许请求时）。
{{% /note %}}

<!--
When multiple [authorization modules](#authorization-modules) are configured, 
each is checked in sequence.
If any authorizer _approves_ or _denies_ a request, that decision is immediately
returned and no other authorizer is consulted. If all modules have  _no opinion_
on the request, then the request is denied. An overall deny verdict means that
the API server rejects the request and responds with an HTTP 403 (Forbidden)
status.
-->
当系统配置了多个[鉴权模块](#authorization-modules)时，Kubernetes 将按顺序使用每个模块。
如果任何鉴权模块**批准**或**拒绝**请求，则立即返回该决定，并且不会与其他鉴权模块协商。
如果所有模块对请求**没有意见**，则拒绝该请求。
总体拒绝裁决意味着 API 服务器拒绝请求并以 HTTP 403（禁止）状态进行响应。

<!--
## Request attributes used in authorization

Kubernetes reviews only the following API request attributes:

 * **user** - The `user` string provided during authentication.
 * **group** - The list of group names to which the authenticated user belongs.
 * **extra** - A map of arbitrary string keys to string values, provided by the authentication layer.
 * **API** - Indicates whether the request is for an API resource.
 * **Request path** - Path to miscellaneous non-resource endpoints like `/api` or `/healthz`.
 * **API request verb** - API verbs `get`, `list`, `create`, `update`, `patch`, `watch`, `proxy`, `redirect`, `delete`, and `deletecollection` are used for resource requests. To determine the request verb for a resource API endpoint, see [request verbs and authorization](/docs/reference/access-authn-authz/authorization/#determine-the-request-verb).
 * **HTTP request verb** - HTTP verbs `get`, `post`, `put`, and `delete` are used for non-resource requests.
 * **Resource** - The ID or name of the resource that is being accessed (for resource requests only) -- For resource requests using `get`, `update`, `patch`, and `delete` verbs, you must provide the resource name.
 * **Subresource** - The subresource that is being accessed (for resource requests only).
 * **Namespace** - The namespace of the object that is being accessed (for namespaced resource requests only).
 * **API group** - The {{< glossary_tooltip text="API Group" term_id="api-group" >}} being accessed (for resource requests only). An empty string designates the _core_ [API group](/docs/reference/using-api/#api-groups).
-->
## 鉴权中使用的请求属性

Kubernetes 仅审查以下 API 请求属性：

* **用户** —— 身份验证期间提供的 `user` 字符串。
* **组** —— 经过身份验证的用户所属的组名列表。
* **额外信息** —— 由身份验证层提供的任意字符串键到字符串值的映射。
* **API** —— 指示请求是否针对 API 资源。
* **请求路径** —— 各种非资源端点的路径，如 `/api` 或 `/healthz`。
* **API 请求动词** —— API 动词 `get`、`list`、`create`、`update`、`patch`、`watch`、
  `proxy`、`redirect`、`delete` 和 `deletecollection` 用于资源请求。
  要确定资源 API 端点的请求动词，请参阅[请求动词和鉴权](#determine-the-request-verb)。
* **HTTP 请求动词** —— HTTP 动词 `get`、`post`、`put` 和 `delete` 用于非资源请求。
* **资源** —— 正在访问的资源的 ID 或名称（仅限资源请求）- 
  对于使用 `get`、`update`、`patch` 和 `delete` 动词的资源请求，你必须提供资源名称。
* **子资源** —— 正在访问的子资源（仅限资源请求）。
* **名字空间** —— 正在访问的对象的名称空间（仅适用于名字空间资源请求）。
* **API 组** —— 正在访问的 {{< glossary_tooltip text="API 组" term_id="api-group" >}}
  （仅限资源请求）。空字符串表示[核心 API 组](/zh-cn/docs/reference/using-api/#api-groups)。

<!--
### Request verbs and authorization {#determine-the-request-verb}

#### Non-resource requests {#request-verb-non-resource}

Requests to endpoints other than `/api/v1/...` or `/apis/<group>/<version>/...`
are considered _non-resource requests_, and use the lower-cased HTTP method of the request as the verb.

For example, making a `GET` request to endpoints like `/api` or `/healthz` would use **get** as the verb.
-->
### 请求动词和鉴权  {#determine-the-request-verb}

#### 非资源请求   {#request-verb-non-resource}

对于 `/api/v1/...` 或 `/apis/<group>/<version>/...`
之外的端点的请求被视为**非资源请求（Non-Resource Requests）**，
并使用该请求的 HTTP 方法的小写形式作为其请求动词。

例如，对 `/api` 或 `/healthz` 这类端点的 `GET` 请求将使用 **get** 作为其动词。

<!--
#### Resource requests

To determine the request verb for a resource API endpoint, Kubernetes maps the HTTP verb
used and considers whether or not the request acts on an individual resource or a
collection of resources:
-->
#### 资源请求    {#resource-requests}

为了确定资源 API 端点的请求动词，Kubernetes 会映射所使用的 HTTP 动词，
并考虑该请求是否作用于单个资源或资源集合：

<!--
HTTP verb     | request verb
--------------|---------------
`POST`        | **create**
`GET`, `HEAD` | **get** (for individual resources), **list** (for collections, including full object content), **watch** (for watching an individual resource or collection of resources)
`PUT`         | **update**
`PATCH`       | **patch**
`DELETE`      | **delete** (for individual resources), **deletecollection** (for collections)
-->
HTTP 动词 | 请求动词
--------------|---------------
`POST`        | **create**
`GET`、`HEAD` | **get**（针对单个资源）、**list**（针对集合，包括完整的对象内容）、**watch**（用于查看单个资源或资源集合）
`PUT`         | **update**
`PATCH`       | **patch**
`DELETE`      | **delete**（针对单个资源）、**deletecollection**（针对集合）

{{< caution >}}
<!--
The **get**, **list** and **watch** can all return the full details of a resource. In
terms of the returned data they are equivalent. For example, **list** on **secrets**
will still reveal the **data** attributes of any returned resources.
-->
**get**、**list** 和 **watch** 动作都可以返回一个资源的完整详细信息。就返回的数据而言，它们是等价的。
例如，对 **secrets** 使用 **list** 仍然会显示所有已返回资源的 **data** 属性。
{{< /caution >}}

<!--
Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:

* Special cases of [authentication](/docs/reference/access-authn-authz/authentication/)
  * **impersonate** verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.
* [Authorization of CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#authorization)
  * **approve** verb for CertificateSigningRequests, and **update** for revisions to existing approvals
 [RBAC](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * **bind** and **escalate** verbs on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
-->
Kubernetes 有时使用专门的动词以对额外的权限进行鉴权。例如：

* [身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/)的特殊情况
  * 对核心 API 组中 `users`、`groups` 和 `serviceaccounts` 以及 `authentication.k8s.io`
    API 组中的 `userextras` 所使用的 **impersonate** 动词。
* [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)
  * 对 `rbac.authorization.k8s.io` API 组中 `roles` 和 `clusterroles` 资源的 **bind**
    和 **escalate** 动词

<!--
## Authorization context

Kubernetes expects attributes that are common to REST API requests. This means
that Kubernetes authorization works with existing organization-wide or
cloud-provider-wide access control systems which may handle other APIs besides
the Kubernetes API.
-->
## 鉴权上下文    {#authorization-context}

Kubernetes 需要 REST API 请求所共有的属性，
这意味着 Kubernetes 鉴权可与现有的组织范围或云提供商范围的访问控制系统配合使用，
这些系统可以处理除 Kubernetes API 之外的其他 API。

<!--
## Authorization modes  {#authorization-modules}

`AlwaysAllow`
: This mode allows all requests, which brings [security risks](#warning-always-allow). Use this authorization mode only if you do not require authorization for your API requests (for example, for testing).

`AlwaysDeny`
: This mode blocks all requests. Use this authorization mode only for testing.

`ABAC` ([attribute-based access control](/docs/reference/access-authn-authz/abac/))
: Kubernetes ABAC mode defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes, etc).
-->
## 鉴权模式  {#authorization-modules}

`AlwaysAllow`
: 此模式允许所有请求，但存在[安全风险](#warning-always-allow)，
  仅当你的 API 请求不需要鉴权时（例如，用于测试），才使用此鉴权模式。

`AlwaysDeny`
: 此模式阻止所有请求。此鉴权模式仅适用于测试。

`ABAC`（[基于属性的访问控制](/zh-cn/docs/reference/access-authn-authz/abac/)）
: Kubernetes ABAC 模式定义了一种访问控制范例，通过使用将属性组合在一起的策略向用户授予访问权限，
  策略可以使用任何类型的属性（用户属性、资源属性、对象、环境属性等）。

<!--
`RBAC` ([role-based access control](/docs/reference/access-authn-authz/rbac/))
: Kubernetes RBAC is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file.  
  In this mode, Kubernetes uses the `rbac.authorization.k8s.io` API group to drive authorization decisions, allowing you to dynamically configure permission policies through the Kubernetes API.

`Node`
: A special-purpose authorization mode that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about the Node authorization mode, see [Node Authorization](/docs/reference/access-authn-authz/node/).

`Webhook`
: Kubernetes [webhook mode](/docs/reference/access-authn-authz/webhook/) for authorization makes a synchronous HTTP callout, blocking the request until the remote HTTP service responds to the query.You can write your own software to handle the callout, or use solutions from the ecosystem.
-->
`RBAC`（[基于角色的访问控制](/zh-cn/docs/reference/access-authn-authz/rbac/)）
: Kubernetes RBAC 是一种根据企业内各个用户的角色来管理其对计算机或网络资源的访问权限的方法。
  在此上下文中，访问权限是单个用户执行特定任务（例如查看、创建或修改文件）的能力。
  在这种模式下，Kubernetes 使用 `rbac.authorization.k8s.io` API 组来驱动鉴权决策，
  允许你通过 Kubernetes API 动态配置权限策略。

`Node`
: 一种特殊用途的鉴权模式，根据 kubelet 计划运行的 Pod 向其授予权限。
  要了解有关 Node 鉴权模式的更多信息，请参阅 [Node 鉴权](/zh-cn/docs/reference/access-authn-authz/node/)。

`Webhook`
: Kubernetes 的 [Webhook 鉴权模式](/docs/reference/access-authn-authz/webhook/)用于鉴权，进行同步 HTTP 调用，
  阻塞请求直到远程 HTTP 服务响应查询。你可以编写自己的软件来处理这种向外调用，也可以使用生态系统中的解决方案。

<a id="warning-always-allow" />

{{< warning >}}
<!--
Enabling the `AlwaysAllow` mode bypasses authorization; do not use this on a cluster where
you do not trust **all** potential API clients, including the workloads that you run.

Authorization mechanisms typically return either a _deny_ or _no opinion_ result; see
[authorization verdicts](#determine-whether-a-request-is-allowed-or-denied) for more on this.
Activating the `AlwaysAllow` means that if all other authorizers return “no opinion”,
the request is allowed. For example, `--authorization-mode=AlwaysAllow,RBAC` has the
same effect as `--authorization-mode=AlwaysAllow` because Kubernetes RBAC does not
provide negative (deny) access rules.

You should not use the `AlwaysAllow` mode on a Kubernetes cluster where the API server
is reachable from the public internet.
-->
启用 `AlwaysAllow` 模式会绕过鉴权；请勿在你不信任**所有**潜在 API
客户端（包括你运行的工作负载）的集群上使用该模式。

鉴权机制通常返回“拒绝”或“无意见”的结果；
有关更多信息，请参阅[鉴权裁决](#determine-whether-a-request-is-allowed-or-denied)。
激活 `AlwaysAllow` 意味着如果所有其他鉴权组件都返回“无意见”，则允许该请求。
例如，`--authorization-mode=AlwaysAllow,RBAC` 与 `--authorization-mode=AlwaysAllow`
具有相同的效果，因为 Kubernetes RBAC 不提供否定（拒绝）访问规则。

你不应在可从公共互联网访问 API 服务器的 Kubernetes 集群上使用 `AlwaysAllow` 模式。
{{< /warning >}}

<!--
### Authorization mode configuration {#choice-of-authz-config}

You can configure the Kubernetes API server's authorizer chain using either
[command line arguments](#using-flags-for-your-authorization-module) only or, as a beta feature,
using a [configuration file](#using-configuration-file-for-authorization).

You have to pick one of the two configuration approaches; setting both `--authorization-config`
path and configuring an authorization webhook using the `--authorization-mode` and
`--authorization-webhook-*` command line arguments is not allowed.
If you try this, the API server reports an error message during startup, then exits immediately.
-->
### 鉴权模式配置 {#choice-of-authz-config}

你可以仅使用[命令行参数](#using-flags-for-your-authorization-module)，
或使用[配置文件](#using-configuration-file-for-authorization)来配置 Kubernetes API
服务器的鉴权链，后者目前是 Beta 特性。

你必须选择两种配置方法之一；不允许同时设置 `--authorization-config` 路径并使用
`--authorization-mode` 和 `--authorization-webhook-*` 命令行参数配置鉴权 Webhook。
如果你尝试这样做，API 服务器会在启动期间报告错误消息，然后立即退出。

<!--
### Command line authorization mode configuration {#using-flags-for-your-authorization-module}
-->
### 命令行鉴权模式配置  {#using-flags-for-your-authorization-module}

{{< feature-state state="stable" for_k8s_version="v1.8" >}}

<!--
You can use the following modes:

* `--authorization-mode=ABAC` (Attribute-based access control mode)
* `--authorization-mode=RBAC` (Role-based access control mode)
* `--authorization-mode=Node` (Node authorizer)
* `--authorization-mode=Webhook` (Webhook authorization mode)
* `--authorization-mode=AlwaysAllow` (always allows requests; carries [security risks](#warning-always-allow))
* `--authorization-mode=AlwaysDeny` (always denies requests)

You can choose more than one authorization mode; for example:
`--authorization-mode=Node,Webhook`
-->
你可以使用以下模式：

* `--authorization-mode=ABAC`（基于属性的访问控制模式）
* `--authorization-mode=RBAC`（基于角色的访问控制模式）
* `--authorization-mode=Node`（节点鉴权组件）
* `--authorization-mode=Webhook`（Webhook 鉴权模式）
* `--authorization-mode=AlwaysAllow`（始终允许请求；存在[安全风险](#warning-always-allow))
* `--authorization-mode=AlwaysDeny`（始终拒绝请求）

你可以选择多种鉴权模式；例如：`--authorization-mode=Node,Webhook`

<!--
Kubernetes checks authorization modules based on the order that you specify them
on the API server's command line, so an earlier module has higher priority to allow
or deny a request.

You cannot combine the `--authorization-mode` command line argument with the
`--authorization-config` command line argument used for
[configuring authorization using a local file](#using-configuration-file-for-authorization-mode).
-->
Kubernetes 根据你在 API 服务器的命令行上指定鉴权模块的顺序来检查鉴权模块，
因此较早的模块具有更高的优先级来允许或拒绝请求。

你不能将 `--authorization-mode` 命令行参数与用于[使用本地文件配置鉴权](#using-configuration-file-for-authorization-mode)的
`--authorization-config` 命令行参数结合使用。

<!--
For more information on command line arguments to the API server, read the
[`kube-apiserver` reference](/docs/reference/command-line-tools-reference/kube-apiserver/).
-->
有关 API 服务器命令行参数的更多信息，请阅读
[`kube-apiserver` 参考](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。

<!-- keep legacy hyperlinks working -->
<a id="configuring-the-api-server-using-an-authorization-config-file" />

<!--
### Configuring the API Server using an authorization config file {#using-configuration-file-for-authorization}
-->
### 使用鉴权配置文件配置 API 服务器 {#using-configuration-file-for-authorization}

{{< feature-state feature_gate_name="StructuredAuthorizationConfiguration" >}}

<!--
As a beta feature, Kubernetes lets you configure authorization chains that can include multiple
webhooks. The authorization items in that chain can have well-defined parameters that validate
requests in a particular order, offering you fine-grained control, such as explicit Deny on failures.

The configuration file approach even allows you to specify
[CEL](/docs/reference/using-api/cel/) rules to pre-filter requests before they are dispatched
to webhooks, helping you to prevent unnecessary invocations. The API server also automatically
reloads the authorizer chain when the configuration file is modified.
-->
作为一项 Beta 级别特性，Kubernetes 允许你配置可包含多个 Webhook 的鉴权链。
该链中的鉴权项可以具有明确定义的参数，这些参数可以按特定顺序检查请求，
从而为你提供细粒度的控制，例如在失败时明确拒绝。

配置文件方法甚至允许你指定 [CEL](/zh-cn/docs/reference/using-api/cel/)规则，
在将请求发送到 Webhook 之前对其进行预过滤，从而帮助你防止不必要的调用。
修改配置文件时，API 服务器还会自动重新加载鉴权链。

<!--
You specify the path to the authorization configuration using the
`--authorization-config` command line argument.

If you want to use command line arguments instead of a configuration file, that's also a valid and supported approach.
Some authorization capabilities (for example: multiple webhooks, webhook failure policy, and pre-filter rules)
are only available if you use an authorization configuration file.
-->
你可以使用 `--authorization-config` 命令行参数指定鉴权配置的路径。

如果你想使用命令行参数而不是配置文件，这也是一种有效且受支持的方法。
某些鉴权功能（例如：多个 Webhook、Webhook 失败策略和预过滤规则）仅在使用鉴权配置文件时可用。

<!--
#### Example configuration {#authz-config-example}
-->
#### 示例配置   {#authz-config-example}

<!--
---
#
# DO NOT USE THE CONFIG AS IS. THIS IS AN EXAMPLE.
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthorizationConfiguration
authorizers:
  - type: Webhook
    # Name used to describe the authorizer
    # This is explicitly used in monitoring machinery for metrics
    # Note:
    #   - Validation for this field is similar to how K8s labels are validated today.
    # Required, with no default
    name: webhook
    webhook:
      # The duration to cache 'authorized' responses from the webhook
      # authorizer.
      # Same as setting `--authorization-webhook-cache-authorized-ttl` flag
      # Default: 5m0s
      authorizedTTL: 30s
      # The duration to cache 'unauthorized' responses from the webhook
      # authorizer.
      # Same as setting `--authorization-webhook-cache-unauthorized-ttl` flag
      # Default: 30s
      unauthorizedTTL: 30s
      # Timeout for the webhook request
      # Maximum allowed is 30s.
      # Required, with no default.
      timeout: 3s
      # The API version of the authorization.k8s.io SubjectAccessReview to
      # send to and expect from the webhook.
      # Same as setting `--authorization-webhook-version` flag
      # Required, with no default
      # Valid values: v1beta1, v1
      subjectAccessReviewVersion: v1
      # MatchConditionSubjectAccessReviewVersion specifies the SubjectAccessReview
      # version the CEL expressions are evaluated against
      # Valid values: v1
      # Required, no default value
      matchConditionSubjectAccessReviewVersion: v1
      # Controls the authorization decision when a webhook request fails to
      # complete or returns a malformed response or errors evaluating
      # matchConditions.
      # Valid values:
      #   - NoOpinion: continue to subsequent authorizers to see if one of
      #     them allows the request
      #   - Deny: reject the request without consulting subsequent authorizers
      # Required, with no default.
      failurePolicy: Deny
      connectionInfo:
        # Controls how the webhook should communicate with the server.
        # Valid values:
        # - KubeConfig: use the file specified in kubeConfigFile to locate the
        #   server.
        # - InClusterConfig: use the in-cluster configuration to call the
        #   SubjectAccessReview API hosted by kube-apiserver. This mode is not
        #   allowed for kube-apiserver.
        type: KubeConfig
        # Path to KubeConfigFile for connection info
        # Required, if connectionInfo.Type is KubeConfig
        kubeConfigFile: /kube-system-authz-webhook.yaml
        # matchConditions is a list of conditions that must be met for a request to be sent to this
        # webhook. An empty list of matchConditions matches all requests.
        # There are a maximum of 64 match conditions allowed.
        #
        # The exact matching logic is (in order):
        #   1. If at least one matchCondition evaluates to FALSE, then the webhook is skipped.
        #   2. If ALL matchConditions evaluate to TRUE, then the webhook is called.
        #   3. If at least one matchCondition evaluates to an error (but none are FALSE):
        #      - If failurePolicy=Deny, then the webhook rejects the request
        #      - If failurePolicy=NoOpinion, then the error is ignored and the webhook is skipped
      matchConditions:
      # expression represents the expression which will be evaluated by CEL. Must evaluate to bool.
      # CEL expressions have access to the contents of the SubjectAccessReview in v1 version.
      # If version specified by subjectAccessReviewVersion in the request variable is v1beta1,
      # the contents would be converted to the v1 version before evaluating the CEL expression.
      #
      # Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
      #
      # only send resource requests to the webhook
      - expression: has(request.resourceAttributes)
      # only intercept requests to kube-system
      - expression: request.resourceAttributes.namespace == 'kube-system'
      # don't intercept requests from kube-system service accounts
      - expression: !('system:serviceaccounts:kube-system' in request.user.groups)
  - type: Node
    name: node
  - type: RBAC
    name: rbac
  - type: Webhook
    name: in-cluster-authorizer
    webhook:
      authorizedTTL: 5m
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      failurePolicy: NoOpinion
      connectionInfo:
        type: InClusterConfig
-->
{{< highlight yaml "linenos=false,hl_lines=2-4" >}}
---
#
# 请勿按原样使用配置，这只是一个示例。
#
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthorizationConfiguration
authorizers:
  - type: Webhook
    # 用于描述鉴权人的名称
    # 这明确用于监控机制的指标
    # 注意
    #   - 该字段的验证与今天的 K8s 标签的验证方式类似。
    # 必填，无默认值
    name: webhook
    webhook:
      # 缓存来自 Webhook 鉴权组件的“鉴权”响应的持续时间
      # 与设置 `--authorization-webhook-cache-authorized-ttl` 标志相同
      # 默认值：5m0s
      authorizedTTL: 30s
      # 缓存来自 Webhook 鉴权组件的“未授权”响应的持续时间。
      # 与设置 `--authorization-webhook-cache-unauthorized-ttl` 标志相同
      # 默认值：30s
      unauthorizedTTL: 30s
      # Webhook 请求超时
      # 允许的最大时间为 30 秒。
      # 必填，没有默认值。
      timeout: 3s
      # 要发送到 Webhook 并期望从 webhook 获得的 authorization.k8s.io SubjectAccessReview 的 API 版本。
      # 与设置 `--authorization-webhook-version` 标志相同
      # 必填，无默认值
      # 有效值：v1beta1、v1
      subjectAccessReviewVersion: v1
      # MatchConditionSubjectAccessReviewVersion 指定评估 CEL 表达式的 SubjectAccessReview 版本
      # 有效值：v1
      # 必填，无默认值
      matchConditionSubjectAccessReviewVersion: v1
      # 当 Webhook 请求无法完成或返回格式错误的响应或评估 matchConditions 时出现错误时，控制鉴权决定。
      # 有效值：
      #   - NoOpinion：继续联系后续鉴权组件，看其中是否有人允许该请求
      #   - Deny：拒绝请求而不咨询后续鉴权组件
      # 必填，没有默认值。
      failurePolicy: Deny
      connectionInfo:
        # 控制 Webhook 如何与服务器通信。
        # 有效值：
        # - KubeConfig：使用 kubeConfigFile 中指定的文件来定位服务器。
        # - InClusterConfig：使用集群内配置来调用由 kube-apiserver 托管的 SubjectAccessReview API，kube-apiserver 不允许使用此模式。
        type: KubeConfig
        # 连接信息的 KubeConfig 文件的路径
        # 如果 connectionInfo.Type 是 KubeConfig，则为必填项
        kubeConfigFile: /kube-system-authz-webhook.yaml
        # matchConditions 是将请求发送到此 Webhook 必须满足的条件列表。
        # matchConditions 为空列表表示匹配所有请求。
        # 最多允许 64 个匹配条件。
        #
        # 精确匹配逻辑如下（按顺序）：
        # 1. 如果至少一个 matchCondition 计算结果为 FALSE，则跳过 Webhook。
        # 2. 如果所有 matchConditions 计算结果为 TRUE，则调用 Webhook。
        # 3. 如果至少一个 matchCondition 计算结果为错误（但没有一个为 FALSE）：
        # - 如果 FailurePolicy=Deny，则 Webhook 拒绝请求
        # - 如果 FailurePolicy=NoOpinion，则忽略错误并跳过 Webhook
      matchConditions:
        # 表达式表示将由 CEL 评估的表达式。必须评估为布尔值。
        # CEL 表达式可以访问 v1 版本中的 SubjectAccessReview 的内容。
        # 如果请求变量中 subjectAccessReviewVersion 指定的版本是 v1beta1，
        # 在评估 CEL 表达式之前，内容将转换为 v1 版本。
      #
      # CEL 文档：https://kubernetes.io/docs/reference/using-api/cel/
      #
      # 仅向 Webhook 发送资源请求
      - expression: has(request.resourceAttributes)
      # 仅拦截对 kube-system 的请求
      - expression: request.resourceAttributes.namespace == 'kube-system'
      # 不要拦截来自 kube-system 服务账户的请求
      - expression: !('system:serviceaccounts:kube-system' in request.user.groups)
  - type: Node
    name: node
  - type: RBAC
    name: rbac
  - type: Webhook
    name: in-cluster-authorizer
    webhook:
      authorizedTTL: 5m
      unauthorizedTTL: 30s
      timeout: 3s
      subjectAccessReviewVersion: v1
      failurePolicy: NoOpinion
      connectionInfo:
        type: InClusterConfig
{{< /highlight >}}

<!--
When configuring the authorizer chain using a configuration file, make sure all the
control plane nodes have the same file contents. Take a note of the API server
configuration when upgrading / downgrading your clusters. For example, if upgrading
from Kubernetes {{< skew currentVersionAddMinor -1 >}} to Kubernetes {{< skew currentVersion >}},
you would need to make sure the config file is in a format that Kubernetes {{< skew currentVersion >}}
can understand, before you upgrade the cluster. If you downgrade to {{< skew currentVersionAddMinor -1 >}},
you would need to set the configuration appropriately.
-->
使用配置文件配置鉴权链时，请确保所有控制平面节点具有相同的文件内容。升级/降级集群时，请记下 API 服务器配置。
例如，如果从 Kubernetes {{< skew currentVersionAddMinor -1 >}}
升级到 Kubernetes {{< skew currentVersion >}}，则需要确保配置文件的格式是
Kubernetes {{< skew currentVersion >}} 可以理解的，然后再升级集群。
如果降级到 {{< skew currentVersionAddMinor -1 >}}，则需要适当设置配置。

<!--
#### Authorization configuration and reloads

Kubernetes reloads the authorization configuration file when the API server observes a change
to the file, and also on a 60 second schedule if no change events were observed.
-->
#### 鉴权配置和重新加载

当 API 服务器观察到文件的更改时，Kubernetes 会重新加载鉴权配置文件，
如果没有观察到更改事件，则也会按照 60 秒的计划重新加载。

{{< note >}}
<!--
You must ensure that all non-webhook authorizer types remain unchanged in the file on reload.

A reload **must not** add or remove Node or RBAC authorizers (they can be reordered,
but cannot be added or removed).
-->
你必须确保重新加载时文件中所有非 Webhook 鉴权组件类型保持不变。

重新加载**不能**添加或删除节点或 RBAC 鉴权组件（可以重新排序，但不能添加或删除）。
{{< /note >}}

<!--
## Privilege escalation via workload creation or edits {#privilege-escalation-via-pod-creation}

Users who can create/edit pods in a namespace, either directly or through an object that
enables indirect [workload management](/docs/concepts/architecture/controller/), may be
able to escalate their privileges in that namespace. The potential routes to privilege
escalation include Kubernetes [API extensions](/docs/concepts/extend-kubernetes/#api-extensions)
and their associated {{< glossary_tooltip term_id="controller" text="controllers" >}}.
-->
## 通过创建或编辑工作负载来提升权限  {#privilege-escalation-via-pod-creation}

能够直接或通过启用间接[工作负载管理](/zh-cn/docs/concepts/architecture/controller/)的对象在命名空间中创建/编辑
Pod 的用户可能能够在该命名空间中提升其权限。
权限提升的潜在途径包括 Kubernetes
[API 扩展](/zh-cn/docs/concepts/extend-kubernetes/#api-extensions)及其相关的
{{< glossary_tooltip term_id="controller" text="控制器" >}}。

{{< caution >}}
<!--
As a cluster administrator, use caution when granting access to create or edit workloads.
Some details of how these can be misused are documented in
[escalation paths](/docs/reference/access-authn-authz/authorization/#escalation-paths).
-->
作为集群管理员，授予创建或编辑工作负载的访问权限时请务必小心谨慎。
[权限提升路径](/zh-cn/docs/reference/access-authn-authz/authorization/#escalation-paths)中记录了有关滥用这些内容的一些细节。
{{< /caution >}}

<!--
### Escalation paths {#escalation-paths}

There are different ways that an attacker or untrustworthy user could gain additional
privilege within a namespace, if you allow them to run arbitrary Pods in that namespace:
-->
### 权限提升路径  {#escalation-paths}

如果你允许攻击者或不值得信任的用户在该命名空间中运行任意 Pod，
则他们可以通过不同的方式在命名空间内获得额外的权限：

<!--
- Mounting arbitrary Secrets in that namespace
  - Can be used to access confidential information meant for other workloads
  - Can be used to obtain a more privileged ServiceAccount's service account token
- Using arbitrary ServiceAccounts in that namespace
  - Can perform Kubernetes API actions as another workload (impersonation)
  - Can perform any privileged actions that ServiceAccount has
- Mounting or using ConfigMaps meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, such as database host names.
- Mounting volumes meant for other workloads in that namespace
  - Can be used to obtain information meant for other workloads, and change it.
-->
- 在该命名空间中挂载任意 Secret
  - 可用于访问其他工作负载的机密信息
  - 可用于获取更具特权的 ServiceAccount 的服务帐户令牌
- 在该命名空间中使用任意 ServiceAccount
  - 可以作为另一个工作负载执行 Kubernetes API 操作（模拟）
  - 可以执行 ServiceAccount 拥有的任何特权操作
- 在该命名空间中挂载或使用其他工作负载的 ConfigMap
  - 可用于获取其他工作负载的信息，例如数据库主机名。
- 在该命名空间中挂载其他工作负载的卷
  - 可用于获取其他工作负载的信息并进行更改。

{{< caution >}}
<!--
As a system administrator, you should be cautious when deploying CustomResourceDefinitions
that let users make changes to the above areas. These may open privilege escalations paths.
Consider the consequences of this kind of change when deciding on your authorization controls.
-->
作为系统管理员，在部署允许用户更改上述区域的 CustomResourceDefinitions 时应谨慎行事，这些可能会打开特权升级路径。
在配置你的鉴权控制时，请考虑这种变化的后果。
{{< /caution >}}

<!--
#### Checking API access

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
SelfSubjectAccessReview is part of the `authorization.k8s.io` API group, which
exposes the API server authorization to external services. Other resources in
this group include:

* SubjectAccessReview
： Access review for any user, not only the current one. Useful for delegating authorization decisions to the API server. For example, the kubelet and extension API servers use this to determine user access to their own APIs.

`LocalSubjectAccessReview`
: Like `SubjectAccessReview` but restricted to a specific namespace.

* `SelfSubjectRulesReview`
: A review which returns the set of actions a user can perform within a namespace. Useful for users to quickly summarize their own access, or for UIs to hide/show actions.

These APIs can be queried by creating normal Kubernetes resources, where the response `status`
field of the returned object is the result of the query. For example:
-->
SelfSubjectAccessReview 是 `authorization.k8s.io` API 组的一部分，它将 API
服务器鉴权公开给外部服务。该组中的其他资源包括：

* `SubjectAccessReview`
: 对任意用户的访问进行评估，而不仅仅是当前用户。
  当鉴权决策被委派给 API 服务器时很有用。例如，kubelet 和扩展 API
  服务器使用它来确定用户对自己的 API 的访问权限。

* `LocalSubjectAccessReview`
: 与 `SubjectAccessReview` 类似，但仅限于特定的名字空间。

* `SelfSubjectRulesReview`
: 返回用户可在名字空间内执行的操作集的审阅。
  用户可以快速汇总自己的访问权限，或者用于 UI 中的隐藏/显示动作。

可以通过创建普通的 Kubernetes 资源来查询这些 API，其中返回对象的响应 `status`
字段是查询的结果，例如：

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
The generated SelfSubjectAccessReview is similar to:
-->
生成的 SelfSubjectAccessReview 类似于：

{{< highlight yaml "linenos=false,hl_lines=11-13" >}}
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
{{< /highlight >}}

## {{% heading "whatsnext" %}}

<!--
* To learn more about Authentication, see [Authentication](/docs/reference/access-authn-authz/authentication/).
* For an overview, read [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/).
* Read more about [Common Expression Language in Kubernetes](/docs/reference/using-api/cel/).
-->
* 要了解有关身份验证的更多信息，
  请参阅[身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/)。
* 有关概述，请阅读[控制对 Kubernetes API 的访问](/zh-cn/docs/concepts/security/controlling-access/)。
* 要了解有关准入控制的更多信息，请参阅[使用准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)。
* 阅读更多关于 [Kubernetes 中的通用表达语言](/zh-cn/docs/reference/using-api/cel/)。

