---
reviewers:
title: Webhook 模式
content_template: templates/concept
weight: 95
---
<!-- 
---
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Webhook Mode
content_template: templates/concept
weight: 95
--- 
-->

{{% capture overview %}}
WebHook 是一种 HTTP 回调：一种当有事情发生时的 HTTP POST 请求；一种通过 HTTP POST 方式的事件通知。一种实现 WebHooks 的 web 应用 当特定事件发生时通过 POST 方式向对应 URL 发送消息。
<!-- 
A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen. 
-->
{{% /capture %}}

{{% capture body %}}
当 `Webhook` 模式被启用时，Kubernetes 会在确定用户权限时访问外部 REST 服务。
<!-- 
When specified, mode `Webhook` causes Kubernetes to query an outside REST
service when determining user privileges. 
-->

## 配置文件格式
<!-- 
## Configuration File Format 
-->

`Webhook` 模式需要一个通过 `--authorization-webhook-config-file=SOME_FILENAME` 标志指定的 HTTP 配置文件。
<!-- Mode `Webhook` requires a file for HTTP configuration, specify by the
`--authorization-webhook-config-file=SOME_FILENAME` flag. -->

配置文件使用 [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) 文件格式。在文件中，"users" 指API 服务器 webhook，"clusters" 指远程服务
<!-- 
The configuration file uses the [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
file format. Within the file "users" refers to the API Server webhook and
"clusters" refers to the remote service. 
-->

使用 HTTPS 客户端鉴权的配置文件示例：
<!-- 
A configuration example which uses HTTPS client auth: 
-->

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

## 请求的载荷
<!-- 
## Request Payloads 
-->

鉴权时，API 服务器使用 POST 方式发送一条 JSON-序列化的 `authorization.k8s.io/v1beta1` `SubjectAccessReview` 对象来描述操作。此对象包含了描述发出请求的用户的字段，还包含了将要被访问的资源信息或请求属性。
<!-- 
When faced with an authorization decision, the API Server POSTs a JSON-
serialized `authorization.k8s.io/v1beta1` `SubjectAccessReview` object describing the
action. This object contains fields describing the user attempting to make the
request, and either details about the resource being accessed or requests
attributes. 
-->

请注意，webhook API 对象和其它 Kubernetes API 对象一样遵循 [版本兼容性规则](/docs/concepts/overview/kubernetes-api/)。实施者应当注意 beta 对象的更宽松的兼容性承诺，并且检查请求的 "apiVersion" 字段来保证正确的反序列化。此外，API服务器必须启用 `authorization.k8s.io/v1beta1` API 扩展组 (`--runtime-config=authorization.k8s.io/v1beta1=true`)。
<!-- 
Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/concepts/overview/kubernetes-api/)
as other Kubernetes API objects. Implementers should be aware of looser
compatibility promises for beta objects and check the "apiVersion" field of the
request to ensure correct deserialization. Additionally, the API Server must
enable the `authorization.k8s.io/v1beta1` API extensions group (`--runtime-config=authorization.k8s.io/v1beta1=true`). 
-->

请求体示例：
<!-- 
An example request body: 
-->

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

远程服务应当填写请求的 `status` 字段，并且返回是否允许访问的响应。响应体的 `spec` 字段应当被忽略，且可以被省略。允许访问的响应返回格式如下：
<!-- 
The remote service is expected to fill the `status` field of
the request and respond to either allow or disallow access. The response body's
`spec` field is ignored and may be omitted. A permissive response would return: 
-->

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": true
  }
}
```

远程服务拒绝访问的返回格式如下：
<!-- 
To disallow access, the remote service would return: 
-->

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

对非资源路径的请求格式如下
<!-- 
Access to non-resource paths are sent as: 
-->

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

非资源路径包括： `/api`，`/apis`，`/metrics`，`/resetMetrics`，`/logs`，`/debug`, `/healthz`，`/swagger-ui/`，`/swaggerapi/`，`/ui` 和
`/version`。客户端需要访问 `/api`，`/api/*`，`/apis`，`/apis/*`,
和 `/version` 来获取服务器上存在哪些资源和版本。对其它非资源路径的访问可以在不限制对 REST api 进行访问的同时进行禁止。
<!-- 
Non-resource paths include: `/api`, `/apis`, `/metrics`, `/resetMetrics`,
`/logs`, `/debug`, `/healthz`, `/swagger-ui/`, `/swaggerapi/`, `/ui`, and
`/version.` Clients require access to `/api`, `/api/*`, `/apis`, `/apis/*`,
and `/version` to discover what resources and versions are present on the server.
Access to other non-resource paths can be disallowed without restricting access
to the REST api. 
-->

点击以获取更多有关 authorization.v1beta1 API 对象和 [webhook.go](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go) 的信息。
<!-- 
For further documentation refer to the authorization.v1beta1 API objects and
[webhook.go](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go). -->

{{% /capture %}}
