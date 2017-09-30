---
assignees:
- erictune
- lavalamp
- deads2k
- liggitt
title: Webhook Mode
---

{% capture overview %}
WebHook 是一个 HTTP 回调：当某些事情发生时的一个 HTTP POST 请求；通过 HTTP POST 发送的一个简单事件通知。一个继续 web 应用实现的 WebHook 会在特定事件发生时把消息发送给特定的 URL 。
{% endcapture %}

{% capture body %}
具体来说，当在判断用户权限时，`Webhook` 模式会使 Kubernetes 查询外部的 REST 服务。

## 配置文件格式

`Webhook` 模式需要一个 HTTP 配置文件，通过 `--authorization-webhook-config-file=SOME_FILENAME` 的参数声明。

配置文件的格式使用 [kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)。
在文件中，"users" 代表着 API 服务器的 webhook，而 "cluster" 代表着远程服务。

使用 HTTPS 客户端认证的配置例子：

```yaml
# clusters 代表远程服务。
clusters:
  - name: name-of-remote-authz-service
    cluster:
      certificate-authority: /path/to/ca.pem      # 用于确认远程服务的CA.
      server: https://authz.example.com/authorize # 远程服务的查询 URL. 必须是 'https'.

# users 代表 API 服务器的 webhook 配置.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # webhook plugin 使用的 cert。
      client-key: /path/to/key.pem          # cert 所对应的 key。

# kubeconfig 文件必须有上下文. 需要提供一个给 API 服务器.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authz-service
    user: name-of-api-server
  name: webhook
```


## 请求载荷

在做认证决策时，API 服务器会 POST 一个 JSON 序列化的 api.authorization.v1beta1.SubjectAccessReview 对象来描述这个动作。这个对象包含了描述用户请求的字段，同时也包含了需要被访问资源或者请求特征的具体信息。

需要注意的是 webhook API 对象对于 [versioning compatibility rules](/docs/api/) 和其他 Kuberntes API 来说是同一个主题。
实施人员应该了解 beta 对象的松耦合承诺，同时确认请求的 "apiVersion" 字段以确保能被正确地反序列化。
此外，API 服务器还必须启用 `authorization.k8s.io/v1beta1` API 扩展组(`--runtime-config=authorization.k8s.io/v1beta1=true`)。


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

远程服务被预期能填写请求和反馈的 SubjectAccessReviewStatus 字段，无论是允许访问还是拒绝访问。
反馈内容的 "spec" 字段是被忽略的，也是可以被省略的。一个允许的反馈的返回值会是：

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": true
  }
}
```


如拒绝，远程服务器会返回：

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


对于非资源的路径访问是这么发送的：

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


非资源类的路径包括：`/api`, `/apis`, `/metrics`, `/resetMetrics`,
`/logs`, `/debug`, `/healthz`, `/swagger-ui/`, `/swaggerapi/`, `/ui`, and
`/version`。 客户端需要访问 `/api`, `/api/*`, `/apis`, `/apis/*`, 和 `/version` 以便
能发现服务器上有什么资源和版本。对于其他非资源类的路径访问在没有 REST api 访问限制的情况下拒绝。


更多信息可以参考 uthorization.v1beta1 API 对象和
[webhook.go](https://git.k8s.io/kubernetes/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go).

{% endcapture %}

{% include templates/concept.md %}
