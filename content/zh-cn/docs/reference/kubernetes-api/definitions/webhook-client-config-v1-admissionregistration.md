---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "WebhookClientConfig"
content_type: "api_reference"
description: "WebhookClientConfig 包含建立与 Webhook 的 TLS 连接所需的信息。"
title: "WebhookClientConfig"
weight: 650
---

<!--
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "WebhookClientConfig"
content_type: "api_reference"
description: "WebhookClientConfig contains the information to make a TLS connection with the webhook"
title: "WebhookClientConfig"
weight: 650
auto_generated: true
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## WebhookClientConfig {#WebhookClientConfig}

<!--
WebhookClientConfig contains the information to make a TLS connection with the webhook
-->
WebhookClientConfig 包含建立与 Webhook 的 TLS 连接所需的信息。

<hr>

<table>
  <thead><tr><th><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
  <tbody>
    <tr>
      <td><code>caBundle</code><br/><em>string</em></td>
      <td>
      <!--
      caBundle is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used.
      -->
      caBundle 是一个 PEM 编码的 CA 证书包，用于验证 Webhook 的服务器证书。
      如果未指定，则使用 apiserver 上的系统受信任根证书。
      </td>
    </tr>
    <tr>
      <td><code>service</code><br/><em><a href="{{< ref "../apiregistration/api-service-v1#ServiceReference" >}}">ServiceReference</a></em></td>
      <td>
      <!--
      service is a reference to the service for this webhook. Either `service` or `url` must be specified.  If the webhook is running within the cluster, then you should use `service`.
      -->
      service 字段用于指定该 Webhook 对应的 Service。
      必须指定 `service` 或 `url` 中的一项。如果 Webhook 运行在集群内部，
      则应使用 `service`。
      </td>
    </tr>
    <tr>
      <td><code>url</code><br/><em>string</em></td>
      <td>
      <!--
      url gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.  The `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.  Please note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.  The scheme must be "https"; the URL must begin with "https://".  A path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.  Attempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either. 
      -->
      `url` 字段指定了 Webhook 的位置，采用标准 URL 格式（`scheme://host:port/path`）。
      必须且只能指定 `url` 或 `service` 中的一个。
      `host` 不应指向集群内运行的服务；若需指向集群内服务，请改用 `service` 字段。
      在某些 API Server 实现中，`host` 可能会通过外部 DNS 进行解析（例如，`kube-apiserver`
      无法解析集群内 DNS，因为这会违反分层架构原则）。`host` 也可以是 IP 地址。
      请注意，将 `localhost` 或 `127.0.0.1` 用作 `host` 存在风险，
      除非你确保在所有可能需要调用该 Webhook 的 API Server 所在的主机上都部署了该 Webhook。
      此类部署方式通常不具备可移植性，即难以在新集群中快速搭建。
      协议（scheme）必须为 "https"；URL 必须以 "https://" 开头。
      路径（path）为可选字段；若包含路径，则其内容可以是 URL 允许的任意字符串。
      你可以利用路径向 Webhook 传递任意字符串，例如集群标识符。
      不允许使用用户名或基本认证信息（例如 "user:password@"）。
      同样，也不允许使用片段标识符（fragment，即 "#..."）或查询参数（query parameter，即 "?..."）。
      </td>
    </tr>
  </tbody>
</table>
