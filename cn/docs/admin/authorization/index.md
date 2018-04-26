<!--
---
approvers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Overview
---
-->
---
approvers:
- erictune
- lavalamp
- deads2k
- liggitt
title: 概述
---

{% capture overview %}
<!--
Learn more about Kubernetes authorization, including details about creating policies using the supported authorization modules.
-->
学习有关 Kubernetes 授权的更多信息，包括有关使用支持的授权模块创建策略的详细信息。

{% endcapture %}

{% capture body %}
<!--
In Kubernetes, you must be authenticated (logged in) before your request can be authorized (granted permission to access). For information about authentication, see [Accessing Control Overview](/docs/admin/accessing-the-api/).
-->
在 Kubernetes 里，您必须经过身份验证(登录)，才能授权您的请求(授予访问权限).。有关认证的信息，请参阅[访问控制概述](/docs/admin/access-the-api/)。

<!--
Kubernetes expects attributes that are common to REST API requests. This means that Kubernetes authorization works with existing organization-wide or cloud-provider-wide access control systems which may handle other APIs besides the Kubernetes API.
-->
Kubernetes 提供通用的 REST API 请求。这意味着 Kubernetes 授权可以与现有的组织或云提供商的访问控制系统一起使用，该系统可以处理除 Kubernetes API 之外的其他 API。
<!--
## Determine Whether a Request is Allowed or Denied
-->
## 确定请求是允许还是被拒绝
<!--
Kubernetes authorizes API requests using the API server. It evaluates all of the request attributes against all policies and allows or denies the request. All parts of an API request must be allowed by some policy in order to proceed. This means that permissions are denied by default.
-->
Kubernetes 使用 API​​ 服务器授权 API 请求。它根据所有策略评估所有请求属性，并允许或拒绝请求。某些策略必须允许 API 请求的所有部分继续进行，这意味着默认情况下是拒绝权限。
<!--
(Although Kubernetes uses the API server, access controls and policies that depend on specific fields of specific kinds of objects are handled by Admission Controllers.)-->

(虽然 Kubernetes 使用 API ​​服务器，访问控制和依赖特定类型对象的特定领域策略由 Admission 控制器处理。)

<!--
When multiple authorization modules are configured, each is checked in sequence, and if any module authorizes the request, then the request can proceed. If all modules deny the request, then the request is denied (HTTP status code 403).
-->
当配置多个授权模块时，按顺序检查每个模块，如果有任何模块授权请求，则可以继续执行该请求。如果所有模块拒绝请求，则拒绝该请求(HTTP状态代码403)。
<!--
## Review Your Request Attributes
-->
## 查看您的请求属性
<!--
Kubernetes reviews only the following API request attributes:
-->
Kubernetes 仅查看以下API请求属性:
<!--
 * **user** - The `user` string provided during authentication.
 * **group** - The list of group names to which the authenticated user belongs.
 * **"extra"** - A map of arbitrary string keys to string values, provided by the authentication layer.
 * **API** - Indicates whether the request is for an API resource.
 * **Request path** - Path to miscellaneous non-resource endpoints like `/api` or `/healthz`.
 * **API request verb** - API verbs `get`, `list`, `create`, `update`, `patch`, `watch`, `proxy`, `redirect`, `delete`, and `deletecollection` are used for resource requests. To determine the request verb for a resource API endpoint, see **Determine the request verb** below.
 * **HTTP request verb** - HTTP verbs `get`, `post`, `put`, and `delete` are used for non-resource requests.
 * **Resource** - The ID or name of the resource that is being accessed (for resource requests only).
--* For resource requests using `get`, `update`, `patch`, and `delete` verbs, you must provide the resource name.
 * **Subresource** - The subresource that is being accessed (for resource requests only).
 * **Namespace** - The namespace of the object that is being accessed (for namespaced resource requests only).
 * **API group** - The API group being accessed (for resource requests only). An empty string designates the [core API group](/docs/api/).
-->
* **user**  - 验证期间提供的 `user` 字符串
* **group**  - 认证用户所属的组名列表
* **“extra"**  - 由认证层提供的任意字符串键到字符串值的映射
* **API**  - 指示请求是否用于API资源
* **Request path**  - 诸如`/api`或`/healthz`的其他非资源端点的路径(请参阅[kubectl](#kubectl)).
* **API request verb**  -  API 动词 `get`，`list`，`create`，`update`，`patch`，`watch`，`proxy`，`redirect`，`delete`和`deletecollection`用于资源请求。要确定资源 API 端点的请求动词，请参阅**确定下面的请求动词**.
* **HTTP request verb**  -  HTTP动词`get`，`post`，`put`和`delete`用于非资源请求
* **Resource**  - 正在访问的资源的ID或名称(仅适用于资源请求)
 --* 对于使用`get`, `update`, `patch`, 和 `delete`动词的资源请求，您必须提供资源名称。
* **Subresource**  - 正在访问的子资源(仅用于资源请求)
* **Namespace**  - 正在被访问的对象的命名空间(仅针对命名空间的资源请求)
* **API group**  - 正在访问的API组(仅用于资源请求). 一个空字符串指定[核心 API 组](/docs/api/).
<!--
## Determine the Request Verb
-->
## 确定请求动词
<!--
To determine the request verb for a resource API endpoint, review the HTTP verb used and whether or not the request acts on an individual resource or a collection of resources:
-->
要确定资源 API 端点的请求动词，请查看所使用的HTTP动词以及请求是否对单个资源或资源集合进行操作:
<!--
HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get (for individual resources), list (for collections)
PUT       | update
PATCH     | patch
DELETE    | delete (for individual resources), deletecollection (for collections)
-->

HTTP动词| 请求动词
---------- | ---------------
POST | 创建
GET，HEAD | 获取(个人资源)，列表(集合)
PUT | 更新
PATCH | 补丁
DELETE| 删除(个人资源)，删除(收藏)

<!--
Kubernetes sometimes checks authorization for additional permissions using specialized verbs. For example:
-->
Kubernetes 有时会使用专门的动词检查授权以获得额外的权限。例如:
<!--
* [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/) checks for authorization of the `use` verb on `podsecuritypolicies` resources in the `extensions` API group.
* [RBAC](/docs/admin/authorization/rbac/#privilege-escalation-prevention-and-bootstrapping) checks for authorization
of the `bind` verb on `roles` and `clusterroles` resources in the `rbac.authorization.k8s.io` API group.
* [Authentication](/docs/admin/authentication/) layer checks for authorization of the `impersonate` verb on `users`, `groups`, and `serviceaccounts` in the core API group, and the `userextras` in the `authentication.k8s.io` API group.
-->
* [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/)在`extensions` API组中的`podsecuritypolicies`资源上检查`use`动词的授权。
* [RBAC](/docs/admin/authorization/rbac/#privilege-escalation-prevention-and-bootstrapping) 在`rbac.authorization.k8s.io` API组中的`roles`和`clusterroles`资源上检查`bind`动词的授权。
* [认证](/docs/admin/authentication/) 在核心API组中的`users`，`groups`和`serviceaccounts`上的`impersonate`动词的授权以及`authentication.k8s.io` API组中的`userextras`进行层次检查。
<!--
## Authorization Modules
-->
## 授权模块
<!--
 * **Node** - A special-purpose authorizer that grants permissions to kubelets based on the pods they are scheduled to run. To learn more about using the Node authorization mode, see [Node Authorization](/docs/admin/authorization/node/)
 * **ABAC** - Attribute-based access control (ABAC) defines an access control paradigm whereby access rights are granted to users through the use of policies which combine attributes together. The policies can use any type of attributes (user attributes, resource attributes, object, environment attributes etc). To learn more about using the ABAC mode, see [ABAC Mode](/docs/admin/authorization/abac/)
 * **RBAC** - Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file. To learn more about using the RBAC mode, see [RBAC Mode](/docs/admin/authorization/rbac/)
 ..* When specified "RBAC" (Role-Based Access Control) uses the "rbac.authorization.k8s.io" API group to drive authorization decisions, allowing admins to dynamically configure permission policies through the Kubernetes API.
 ..* As of 1.6 RBAC mode is in beta.
 ..* To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.
 * **Webhook** - A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen. To learn more about using the Webhook mode, see [Webhook Mode](/docs/admin/authorization/webhook/).
-->
* **ABAC模式**  - 基于属性的访问控制(ABAC)定义了访问控制范例，通过使用将属性组合在一起的策略来授予用户访问权限。策略可以使用任何类型的属性(用户属性，资源属性，对象，环境属性等)。要了解有关使用ABAC模式的更多信息，请参阅[ABAC模式](/docs/admin/authorization/abac/)
* **RBAC模式**  - 基于角色的访问控制(RBAC)是一种根据企业内个人用户的角色来调整对计算机或网络资源的访问的方法。在这种情况下，访问是单个用户执行特定任务(例如查看，创建或修改文件)的能力。要了解有关使用RBAC模式的更多信息，请参阅[RBAC模式](/docs/admin/authorization/rbac/)
*当指定 "RBAC"(基于角色的访问控制)使用 "rbac.authorization.k8s.io" API组来驱动授权决定时，允许管理员通过Kubernetes API动态配置权限策略.
.. *截至1.6 RBAC模式是测试版.
.. *要启用RBAC，请使用 `--authorization-mode=RBAC` 启动 apiserver.
* **Webhook模式**  -  WebHook 是HTTP回调:发生事件时发生的HTTP POST; 通过HTTP POST简单的事件通知. 实施 WebHooks 的 Web 应用程序将在某些事情发生时向URL发送消息. 要了解有关使用Webhook模式的更多信息，请参阅[Webhook模式](/docs/admin/authorization/webhook/)

<!--
#### Checking API Access-->
#### 检查API访问
<!--
Kubernetes exposes the `subjectaccessreviews.v1.authorization.k8s.io` resource as a
normal resource that allows external access to API authorizer decisions.  No matter which authorizer
you choose to use, you can issue a `POST` with a `SubjectAccessReview` just like the webhook
authorizer to the `apis/authorization.k8s.io/v1/subjectaccessreviews` endpoint and
get back a response.  For instance:
-->
Kubernetes 将 `subjectaccessreviews.v1.authorization.k8s.io`  资源公开为允许外部访问API授权者决策的普通资源。 无论您选择使用哪个授权器，您都可以使用`SubjectAccessReview`发出一个`POST`，就像webhook授权器的`apis/authorization.k8s.io/v1/subjectaccessreviews` 端点一样，并回复一个响应。 例如：

```bash
kubectl create --v=8 -f -  << __EOF__
{
  "apiVersion": "authorization.k8s.io/v1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "kittensandponies",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ],
    "extra": {
      "scopes": [
        "openid",
        "profile"
      ]
    }
  }
}
__EOF__

--- snip lots of output ---

I0913 08:12:31.362873   27425 request.go:908] Response Body: {"kind":"SubjectAccessReview","apiVersion":"authorization.k8s.io/v1","metadata":{"creationTimestamp":null},"spec":{"resourceAttributes":{"namespace":"kittensandponies","verb":"GET","group":"unicorn.example.org","resource":"pods"},"user":"jane","group":["group1","group2"],"extra":{"scopes":["openid","profile"]}},"status":{"allowed":true}}
subjectaccessreview "" created
```
<!--
This is useful for debugging access problems, in that you can use this resource
to determine what access an authorizer is granting.-->
这对于调试访问问题非常有用，因为您可以使用此资源来确定授权者授予哪些访问权限。
<!--
## Using Flags for Your Authorization Module-->
## 为您的授权模块使用标志
<!--
You must include a flag in your policy to indicate which authorization module your policies include:

The following flags can be used:
  - `--authorization-mode=ABAC` Attribute-Based Access Control (ABAC) mode allows you to configure policies using local files.
  - `--authorization-mode=RBAC` Role-based access control (RBAC) mode allows you to create and store policies using the Kubernetes API.
  - `--authorization-mode=Webhook` WebHook is an HTTP callback mode that allows you to manage authorization using a remote REST.
  - `--authorization-mode=AlwaysDeny` This flag blocks all requests. Use this flag only for testing.
  - `--authorization-mode=AlwaysAllow` This flag allows all requests. Use this flag only if you do not require authorization for your API requests.

You can choose more than one authorization module. If one of the modes is `AlwaysAllow`, then it overrides the other modes and all API requests are allowed.
-->
您的策略中必须包含一个标志，以指出您的策略包含哪个授权模块:

可以使用以下标志:
 * `--authorization-mode=ABAC` 基于属性的访问控制(ABAC)模式允许您使用本地文件配置策略。
 * `--authorization-mode=RBAC` 基于角色的访问控制(RBAC)模式允许您使用Kubernetes API创建和存储策略.
 * `--authorization-mode=Webhook` WebHook是一种HTTP回调模式，允许您使用远程REST管理授权。
 * `--authorization-mode=AlwaysDeny` 此标志阻止所有请求. 仅使用此标志进行测试。
 * `--authorization-mode=AlwaysAllow` 此标志允许所有请求. 只有在您不需要API请求授权的情况下才能使用此标志。

您可以选择多个授权模块. 如果其中一种模式为 `AlwaysAllow`，则覆盖其他模式，并允许所有API请求。
<!--
## Versioning-->
## 版本控制
<!--
For version 1.2, clusters created by kube-up.sh are configured so that no authorization is required for any request.

As of version 1.3, clusters created by kube-up.sh are configured so that the ABAC authorization modules are enabled. However, its input file is initially set to allow all users to do all operations. The cluster administrator needs to edit that file, or configure a different authorizer to restrict what users can do.
-->
对于版本 1.2，配置了 kube-up.sh 创建的集群，以便任何请求都不需要授权。

从版本 1.3 开始，配置由 kube-up.sh 创建的集群，使得 ABAC 授权模块处于启用状态。但是，其输入文件最初设置为允许所有用户执行所有操作，集群管理员需要编辑该文件，或者配置不同的授权器来限制用户可以执行的操作。

{% endcapture %}
{% capture whatsnext %}
<!--
* To learn more about Authentication, see **Authentication** in [Controlling Access to the Kubernetes API](/docs/admin/accessing-the-api/).
* To learn more about Admission Control, see [Using Admission Controllers](/docs/admin/admission-controllers/).
-->
* 要学习有关身份验证的更多信息，请参阅**身份验证**[控制访问 Kubernetes API](docs/admin/access-the-api/)。
* 要了解有关入学管理的更多信息，请参阅[使用 Admission 控制器](docs/admin/admission-controllers/)。
{% endcapture %}

{% include templates/concept.md %}
