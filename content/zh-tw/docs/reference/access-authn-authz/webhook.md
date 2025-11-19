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
WebHook 是一種 HTTP 回調：某些條件下觸發的 HTTP POST 請求；通過 HTTP POST
發送的簡單事件通知。一個基於 web 應用實現的 WebHook 會在特定事件發生時把消息發送給特定的 URL。

<!-- body -->

<!--
When specified, mode `Webhook` causes Kubernetes to query an outside REST
service when determining user privileges.
-->
具體來說，當在判斷用戶權限時，`Webhook` 模式會使 Kubernetes 查詢外部的 REST 服務。

<!--
## Configuration File Format
-->
## 配置文件格式 {#configuration-file-format}

<!--
Mode `Webhook` requires a file for HTTP configuration, specify by the
`--authorization-webhook-config-file=SOME_FILENAME` flag.
-->
`Webhook` 模式需要一個 HTTP 配置文件，通過
`--authorization-webhook-config-file=SOME_FILENAME` 的參數聲明。

<!--
The configuration file uses the [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
file format. Within the file "users" refers to the API Server webhook and
"clusters" refers to the remote service.
-->
配置文件的格式使用
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)。
在該文件中，“users” 代表着 API 服務器的 Webhook，而 “cluster” 代表着遠程服務。

<!--
A configuration example which uses HTTPS client auth:
-->
使用 HTTPS 客戶端認證的配置例子：

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
# API 對象種類
kind: Config
# clusters 代表遠程服務
clusters:
  - name: name-of-remote-authz-service
    cluster:
      # 對遠程服務進行身份認證的 CA
      certificate-authority: /path/to/ca.pem
      # 遠程服務的查詢 URL。必須使用 'https'。不可以包含參數。
      server: https://authz.example.com/authorize

# users 代表 API 服務器的 webhook 配置
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # 要使用的 webhook 插件的證書
      client-key: /path/to/key.pem          # 與證書匹配的密鑰

# kubeconfig 文件必須有 context。需要提供一個給 API 服務器。
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
## 請求載荷 {#request-payloads}

<!--
When faced with an authorization decision, the API Server POSTs a JSON-
serialized `authorization.k8s.io/v1beta1` `SubjectAccessReview` object describing the
action. This object contains fields describing the user attempting to make the
request, and either details about the resource being accessed or requests
attributes.
-->
在做認證決策時，API 服務器會 POST 一個 JSON 序列化的 `authorization.k8s.io/v1beta1` `SubjectAccessReview`
對象來描述這個動作。這個對象包含了描述用戶請求的字段，同時也包含了需要被訪問資源或請求特徵的具體信息。

<!--
Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/concepts/overview/kubernetes-api/)
as other Kubernetes API objects. Implementers should be aware of looser
compatibility promises for beta objects and check the "apiVersion" field of the
request to ensure correct deserialization. Additionally, the API Server must
enable the `authorization.k8s.io/v1beta1` API extensions group (`--runtime-config=authorization.k8s.io/v1beta1=true`).
-->
需要注意的是 webhook API 對象與其他 Kubernetes API
對象一樣都同樣都遵從[版本兼容規則](/zh-cn/docs/concepts/overview/kubernetes-api/)。
實施人員應該瞭解 beta 對象的更寬鬆的兼容性承諾，同時確認請求的 "apiVersion" 字段能被正確地反序列化。
此外，API 服務器還必須啓用 `authorization.k8s.io/v1beta1` API
擴展組 (`--runtime-config=authorization.k8s.io/v1beta1=true`)。

<!--
An example request body:
-->
一個請求內容的例子：

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
期待遠程服務填充請求的 `status` 字段並響應允許或禁止訪問。
響應主體的 `spec` 字段被忽略，可以省略。允許的響應將返回：

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
爲了禁止訪問，有兩種方法。

<!--
The first method is preferred in most cases, and indicates the authorization
webhook does not allow, or has "no opinion" about the request, but if other
authorizers are configured, they are given a chance to allow the request.
If there are no other authorizers, or none of them allow the request, the
request is forbidden. The webhook would return:
-->
在大多數情況下，第一種方法是首選方法，它指示授權 Webhook 不允許或對請求 “無意見”。
但是，如果配置了其他授權者，則可以給他們機會允許請求。
如果沒有其他授權者，或者沒有一個授權者，則該請求被禁止。Webhook 將返回：

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
第二種方法立即拒絕其他配置的授權者進行短路評估。
僅應由對集羣的完整授權者配置有詳細瞭解的 Webhook 使用。Webhook 將返回：

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
對於非資源的路徑訪問是這麼發送的:

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
啓用 `AuthorizeWithSelectors` 特性後，請求中的字段和標籤選擇算符將被傳遞給授權 Webhook。
此 Webhook 可以根據作用域字段和標籤選擇算符做出授權決策（如果它願意的話）。

<!--
The [SubjectAccessReview API documentation](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)
gives guidelines for how these fields should be interpreted and handled by authorization webhooks,
specifically using the parsed requirements rather than the raw selector strings,
and how to handle unrecognized operators safely.
-->
[SubjectAccessReview API 文檔](/zh-cn/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)提供了這些字段應如何被授權
Webhook 解釋和處理的指南，特別是應使用解析後的要求而不是原始選擇算符字符串，以及如何安全地處理未識別的操作符。

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
非資源類的路徑包括：`/api`、`/apis`、`/metrics`、`/logs`、`/debug`、
`/healthz`、`/livez`、`/openapi/v2`、`/readyz`、和 `/version`。
客戶端需要訪問 `/api`、`/api/*`、`/apis`、`/apis/*` 和 `/version` 以便
能發現服務器上有什麼資源和版本。對於其他非資源類的路徑訪問在沒有 REST API 訪問限制的情況下拒絕。

<!--
For further information, refer to the
[SubjectAccessReview API documentation](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)
and
[webhook.go implementation](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go).
-->
更多信息請參閱
[SubjectAccessReview API 文檔](/zh-cn/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/)和
[webhook.go 實現](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go)。
