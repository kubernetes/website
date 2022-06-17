---
title: Webhook 模式
content_type: concept
weight: 95
---
<!--
reviewers:
- erictune
- lavalamp
- deads2k
- liggitt
title: Webhook Mode
content_type: concept
weight: 95
-->

<!-- overview -->
<!--
A WebHook is an HTTP callback: an HTTP POST that occurs when something happens; a simple event-notification via HTTP POST. A web application implementing WebHooks will POST a message to a URL when certain things happen.
-->
WebHook 是一種 HTTP 回撥：某些條件下觸發的 HTTP POST 請求；透過 HTTP POST 傳送的簡單事件通知。一個基於 web 應用實現的 WebHook 會在特定事件發生時把訊息傳送給特定的 URL。


<!-- body -->
<!--
When specified, mode `Webhook` causes Kubernetes to query an outside REST
service when determining user privileges.
-->
具體來說，當在判斷使用者許可權時，`Webhook` 模式會使 Kubernetes 查詢外部的 REST 服務。

<!--
## Configuration File Format
-->
## 配置檔案格式 {#configuration-file-format}

<!--
Mode `Webhook` requires a file for HTTP configuration, specify by the
`--authorization-webhook-config-file=SOME_FILENAME` flag.
-->
`Webhook` 模式需要一個 HTTP 配置檔案，透過 `--authorization-webhook-config-file=SOME_FILENAME` 的引數宣告。

<!--
The configuration file uses the [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
file format. Within the file "users" refers to the API Server webhook and
"clusters" refers to the remote service.
-->
配置檔案的格式使用 [kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)。
在該檔案中，“users” 代表著 API 伺服器的 webhook，而 “cluster” 代表著遠端服務。

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
# API 物件種類
kind: Config
# clusters 代表遠端服務。
clusters:
  - name: name-of-remote-authz-service
    cluster:
      # 對遠端服務進行身份認證的 CA。
      certificate-authority: /path/to/ca.pem
      # 遠端服務的查詢 URL。必須使用 'https'。
      server: https://authz.example.com/authorize

# users 代表 API 伺服器的 webhook 配置
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # webhook plugin 使用 cert
      client-key: /path/to/key.pem          # cert 所對應的 key

# kubeconfig 檔案必須有 context。需要提供一個給 API 伺服器。
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
在做認證決策時，API 伺服器會 POST 一個 JSON 序列化的 `authorization.k8s.io/v1beta1` `SubjectAccessReview`
物件來描述這個動作。這個物件包含了描述使用者請求的欄位，同時也包含了需要被訪問資源或請求特徵的具體資訊。

<!--
Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/concepts/overview/kubernetes-api/)
as other Kubernetes API objects. Implementers should be aware of looser
compatibility promises for beta objects and check the "apiVersion" field of the
request to ensure correct deserialization. Additionally, the API Server must
enable the `authorization.k8s.io/v1beta1` API extensions group (`--runtime-config=authorization.k8s.io/v1beta1=true`).
-->
需要注意的是 webhook API 物件與其他 Kubernetes API 物件一樣都同樣都遵從[版本相容規則](/zh-cn/docs/concepts/overview/kubernetes-api/)。
實施人員應該瞭解 beta 物件的更寬鬆的相容性承諾，同時確認請求的 "apiVersion" 欄位能被正確地反序列化。
此外，API 伺服器還必須啟用 `authorization.k8s.io/v1beta1` API 擴充套件組 (`--runtime-config=authorization.k8s.io/v1beta1=true`)。

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
期待遠端服務填充請求的 `status` 欄位並響應允許或禁止訪問。響應主體的 `spec` 欄位被忽略，可以省略。允許的響應將返回:

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
為了禁止訪問，有兩種方法。

<!--
The first method is preferred in most cases, and indicates the authorization
webhook does not allow, or has "no opinion" about the request, but if other
authorizers are configured, they are given a chance to allow the request.
If there are no other authorizers, or none of them allow the request, the
request is forbidden. The webhook would return:
-->
在大多數情況下，第一種方法是首選方法，它指示授權 webhook 不允許或對請求 “無意見”。
但是，如果配置了其他授權者，則可以給他們機會允許請求。如果沒有其他授權者，或者沒有一個授權者，則該請求被禁止。webhook 將返回：

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
第二種方法立即拒絕其他配置的授權者進行短路評估。僅應由對叢集的完整授權者配置有詳細瞭解的 webhook 使用。webhook 將返回：

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
對於非資源的路徑訪問是這麼傳送的:

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
能發現伺服器上有什麼資源和版本。對於其他非資源類的路徑訪問在沒有 REST API 訪問限制的情況下拒絕。

<!--
For further documentation refer to the authorization.v1beta1 API objects and
[webhook.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go).
-->
更多資訊可以參考 authorization.v1beta1 API 物件和 [webhook.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go)。

