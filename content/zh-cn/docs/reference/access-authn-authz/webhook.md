---
title: Webhook 模式
content_type: concept
weight: 36
---
<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Webhook Mode
content_type: concept
weight: 36
-->

<!-- overview -->

<!--
A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen.
-->
WebHook 是一种 HTTP 回调：某些条件下触发的 HTTP POST 请求；通过 HTTP POST
发送的简单事件通知。一个基于 web 应用实现的 WebHook 会在特定事件发生时把消息发送给特定的 URL。

<!-- body -->

<!--
When specified, mode `Webhook` causes Kubernetes to query an outside REST
service when determining user privileges.
-->
具体来说，当在判断用户权限时，`Webhook` 模式会使 Kubernetes 查询外部的 REST 服务。

<!--
## Configuration File Format
-->
## 配置文件格式 {#configuration-file-format}

<!--
Mode `Webhook` requires a file for HTTP configuration, specify by the
`--authorization-webhook-config-file=SOME_FILENAME` flag.
-->
`Webhook` 模式需要一个 HTTP 配置文件，通过
`--authorization-webhook-config-file=SOME_FILENAME` 的参数声明。

<!--
The configuration file uses the [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
file format. Within the file "users" refers to the API Server webhook and
"clusters" refers to the remote service.
-->
配置文件的格式使用
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)。
在该文件中，“users” 代表着 API 服务器的 Webhook，而 “cluster” 代表着远程服务。

<!--
A configuration example which uses HTTPS client auth:
-->
使用 HTTPS 客户端认证的配置例子：

<!--
```yaml
# Kubernetes API version
apiVersion: v1
# kind of the API object
kind: Config
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-authz-service
    cluster:
      # CA for verifying the remote service.
      certificate-authority: /path/to/ca.pem
      # URL of remote service to query. Must use 'https'. May not include parameters.
      server: https://authz.example.com/authorize

# users refers to the API Server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
      client-key: /path/to/key.pem          # key matching the cert

# kubeconfig files require a context. Provide one for the API Server.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authz-service
    user: name-of-api-server
  name: webhook
```
-->
```yaml
# Kubernetes API 版本
apiVersion: v1
# API 对象种类
kind: Config
# clusters 代表远程服务
clusters:
  - name: name-of-remote-authz-service
    cluster:
      # 对远程服务进行身份认证的 CA
      certificate-authority: /path/to/ca.pem
      # 远程服务的查询 URL。必须使用 'https'。不可以包含参数。
      server: https://authz.example.com/authorize

# users 代表 API 服务器的 webhook 配置
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # 要使用的 webhook 插件的证书
      client-key: /path/to/key.pem          # 与证书匹配的密钥

# kubeconfig 文件必须有 context。需要提供一个给 API 服务器。
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authz-service
    user: name-of-api-server
  name: webhook
```

<!--
## Request Payloads
-->
## 请求载荷 {#request-payloads}

<!--
When faced with an authorization decision, the API Server POSTs a JSON-
serialized `authorization.k8s.io/v1beta1` `SubjectAccessReview` object describing the
action. This object contains fields describing the user attempting to make the
request, and either details about the resource being accessed or requests
attributes.
-->
在做认证决策时，API 服务器会 POST 一个 JSON 序列化的 `authorization.k8s.io/v1beta1` `SubjectAccessReview`
对象来描述这个动作。这个对象包含了描述用户请求的字段，同时也包含了需要被访问资源或请求特征的具体信息。

<!--
Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/concepts/overview/kubernetes-api/)
as other Kubernetes API objects. Implementers should be aware of looser
compatibility promises for beta objects and check the "apiVersion" field of the
request to ensure correct deserialization. Additionally, the API Server must
enable the `authorization.k8s.io/v1beta1` API extensions group (`--runtime-config=authorization.k8s.io/v1beta1=true`).
-->
需要注意的是 webhook API 对象与其他 Kubernetes API
对象一样都同样都遵从[版本兼容规则](/zh-cn/docs/concepts/overview/kubernetes-api/)。
实施人员应该了解 beta 对象的更宽松的兼容性承诺，同时确认请求的 "apiVersion" 字段能被正确地反序列化。
此外，API 服务器还必须启用 `authorization.k8s.io/v1beta1` API
扩展组 (`--runtime-config=authorization.k8s.io/v1beta1=true`)。

<!--
An example request body:
-->
一个请求内容的例子：

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
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
    ]
  }
}
```

<!--
The remote service is expected to fill the `status` field of
the request and respond to either allow or disallow access. The response body's
`spec` field is ignored and may be omitted. A permissive response would return:
-->
期待远程服务填充请求的 `status` 字段并响应允许或禁止访问。
响应主体的 `spec` 字段被忽略，可以省略。允许的响应将返回：

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": true
  }
}
```

<!--
For disallowing access there are two methods.
-->
为了禁止访问，有两种方法。

<!--
The first method is preferred in most cases, and indicates the authorization
webhook does not allow, or has "no opinion" about the request, but if other
authorizers are configured, they are given a chance to allow the request.
If there are no other authorizers, or none of them allow the request, the
request is forbidden. The webhook would return:
-->
在大多数情况下，第一种方法是首选方法，它指示授权 Webhook 不允许或对请求 “无意见”。
但是，如果配置了其他授权者，则可以给他们机会允许请求。
如果没有其他授权者，或者没有一个授权者，则该请求被禁止。Webhook 将返回：

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "reason": "user does not have read access to the namespace"
  }
}
```

<!--
The second method denies immediately, short-circuiting evaluation by other
configured authorizers. This should only be used by webhooks that have
detailed knowledge of the full authorizer configuration of the cluster.
The webhook would return:
-->
第二种方法立即拒绝其他配置的授权者进行短路评估。
仅应由对集群的完整授权者配置有详细了解的 Webhook 使用。Webhook 将返回：

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "denied": true,
    "reason": "user does not have read access to the namespace"
  }
}
```

<!--
Access to non-resource paths are sent as:
-->
对于非资源的路径访问是这么发送的:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "nonResourceAttributes": {
      "path": "/debug",
      "verb": "get"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

{{< feature-state feature_gate_name="AuthorizeWithSelectors" >}}

<!--
With the `AuthorizeWithSelectors` feature enabled, field and label selectors in the request
are passed to the authorization webhook. The webhook can make authorization decisions
informed by the scoped field and label selectors, if it wishes.
-->
启用 `AuthorizeWithSelectors` 特性后，请求中的字段和标签选择算符将被传递给授权 Webhook。
此 Webhook 可以根据作用域字段和标签选择算符做出授权决策（如果它愿意的话）。

<!--
The [SubjectAccessReview API documentation](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)
gives guidelines for how these fields should be interpreted and handled by authorization webhooks,
specifically using the parsed requirements rather than the raw selector strings,
and how to handle unrecognized operators safely.
-->
[SubjectAccessReview API 文档](/zh-cn/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)提供了这些字段应如何被授权
Webhook 解释和处理的指南，特别是应使用解析后的要求而不是原始选择算符字符串，以及如何安全地处理未识别的操作符。

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "verb": "list",
      "group": "",
      "resource": "pods",
      "fieldSelector": {
        "requirements": [
          {"key":"spec.nodeName", "operator":"In", "values":["mynode"]}
        ]
      },
      "labelSelector": {
        "requirements": [
          {"key":"example.com/mykey", "operator":"In", "values":["myvalue"]}
        ]
      }
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

<!--
Non-resource paths include: `/api`, `/apis`, `/metrics`,
`/logs`, `/debug`, `/healthz`, `/livez`, `/openapi/v2`, `/readyz`, and
`/version.` Clients require access to `/api`, `/api/*`, `/apis`, `/apis/*`,
and `/version` to discover what resources and versions are present on the server.
Access to other non-resource paths can be disallowed without restricting access
to the REST api.
-->
非资源类的路径包括：`/api`、`/apis`、`/metrics`、`/logs`、`/debug`、
`/healthz`、`/livez`、`/openapi/v2`、`/readyz`、和 `/version`。
客户端需要访问 `/api`、`/api/*`、`/apis`、`/apis/*` 和 `/version` 以便
能发现服务器上有什么资源和版本。对于其他非资源类的路径访问在没有 REST API 访问限制的情况下拒绝。

<!--
For further information, refer to the
[SubjectAccessReview API documentation](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)
and
[webhook.go implementation](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go).
-->
更多信息请参阅
[SubjectAccessReview API 文档](/zh-cn/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)和
[webhook.go 实现](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go)。
