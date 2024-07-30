---
title: 动态准入控制
content_type: concept
weight: 45
---
<!--
reviewers:
- smarterclayton
- lavalamp
- caesarxuchao
- deads2k
- liggitt
- jpbetz
title: Dynamic Admission Control
content_type: concept
weight: 45
-->

<!-- overview -->
<!--
In addition to [compiled-in admission plugins](/docs/reference/access-authn-authz/admission-controllers/),
admission plugins can be developed as extensions and run as webhooks configured at runtime.
This page describes how to build, configure, use, and monitor admission webhooks.
-->
除了[内置的 admission 插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)，
准入插件可以作为扩展独立开发，并以运行时所配置的 Webhook 的形式运行。
此页面描述了如何构建、配置、使用和监视准入 Webhook。

<!-- body -->

<!--
## What are admission webhooks?
-->
## 什么是准入 Webhook？ {#what-are-admission-webhooks}

<!--
Admission webhooks are HTTP callbacks that receive admission requests and do
something with them. You can define two types of admission webhooks,
[validating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
and
[mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
Mutating admission webhooks are invoked first, and can modify objects sent to the API server to enforce custom defaults.
-->
准入 Webhook 是一种用于接收准入请求并对其进行处理的 HTTP 回调机制。
可以定义两种类型的准入 Webhook，
即[验证性质的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
和[变更性质的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)。
变更性质的准入 Webhook 会先被调用。它们可以修改发送到 API
服务器的对象以执行自定义的设置默认值操作。

<!--
After all object modifications are complete, and after the incoming object is validated by the API server,
validating admission webhooks are invoked and can reject requests to enforce custom policies.
-->
在完成了所有对象修改并且 API 服务器也验证了所传入的对象之后，
验证性质的 Webhook 会被调用，并通过拒绝请求的方式来强制实施自定义的策略。

{{< note >}}
<!--
Admission webhooks that need to guarantee they see the final state of the object in order to enforce policy
should use a validating admission webhook, since objects can be modified after being seen by mutating webhooks.
-->
如果准入 Webhook 需要保证它们所看到的是对象的最终状态以实施某种策略。
则应使用验证性质的准入 Webhook，因为对象被修改性质 Webhook 看到之后仍然可能被修改。
{{< /note >}}

<!--
## Experimenting with admission webhooks

Admission webhooks are essentially part of the cluster control-plane. You should
write and deploy them with great caution. Please read the
[user guides](/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server)
for instructions if you intend to write/deploy production-grade admission webhooks.
In the following, we describe how to quickly experiment with admission webhooks.
-->
## 尝试准入 Webhook {#experimenting-with-admission-webhooks}

准入 Webhook 本质上是集群控制平面的一部分。你应该非常谨慎地编写和部署它们。
如果你打算编写或者部署生产级准入 Webhook，
请阅读[用户指南](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server)以获取相关说明。
在下文中，我们将介绍如何快速试验准入 Webhook。

<!--
### Prerequisites

* Ensure that MutatingAdmissionWebhook and ValidatingAdmissionWebhook
  admission controllers are enabled.
  [Here](/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)
  is a recommended set of admission controllers to enable in general.

* Ensure that the `admissionregistration.k8s.io/v1` API is enabled.
-->
### 先决条件 {#prerequisites}

* 确保启用 MutatingAdmissionWebhook 和 ValidatingAdmissionWebhook 控制器。
  [这里](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)是一组推荐的准入控制器，
  通常可以启用。

* 确保启用了 `admissionregistration.k8s.io/v1` API。

<!--
### Write an admission webhook server
-->
### 编写一个准入 Webhook 服务器 {#write-an-admission-webhook-server}

<!--
Please refer to the implementation of the [admission webhook server](https://github.com/kubernetes/kubernetes/blob/release-1.21/test/images/agnhost/webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`AdmissionReview` request sent by the API servers, and sends back its decision
as an `AdmissionReview` object in the same version it received.
-->
请参阅 Kubernetes e2e 测试中的
[Admission Webhook 服务器](https://github.com/kubernetes/kubernetes/blob/release-1.21/test/images/agnhost/webhook/main.go)的实现。
Webhook 处理由 API 服务器发送的 `AdmissionReview` 请求，并且将其决定作为
`AdmissionReview` 对象以相同版本发送回去。

<!--
See the [webhook request](#request) section for details on the data sent to webhooks.
-->
有关发送到 Webhook 的数据的详细信息，请参阅 [Webhook 请求](#request)。

<!--
See the [webhook response](#response) section for the data expected from webhooks.
-->
要获取来自 Webhook 的预期数据，请参阅 [Webhook 响应](#response)。

<!--
The example admission webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/images/agnhost/webhook/config.go#L38-L39),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly API servers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate API servers](#authenticate-apiservers).
-->
示例准入 Webhook 服务器置 `ClientAuth`
字段为[空](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/images/agnhost/webhook/config.go#L38-L39)，
默认为 `NoClientCert` 。这意味着 Webhook 服务器不会验证客户端的身份，认为其是 API 服务器。
如果你需要双向 TLS 或其他方式来验证客户端，
请参阅如何[对 API 服务器进行身份认证](#authenticate-apiservers)。

<!--
### Deploy the admission webhook service
-->
### 部署准入 Webhook 服务 {#deploy-the-admission-webhook-service}

<!--
The webhook server in the e2e test is deployed in the Kubernetes cluster, via
the [deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps).
The test also creates a [service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
as the front-end of the webhook server. See
[code](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/e2e/apimachinery/webhook.go#L748).
-->
e2e 测试中的 Webhook 服务器通过
[deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps)
部署在 Kubernetes 集群中。该测试还将创建一个
[Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
作为 Webhook 服务器的前端。
参见[相关代码](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/e2e/apimachinery/webhook.go#L748)。

<!--
You may also deploy your webhooks outside of the cluster. You will need to update
your webhook configurations accordingly.
-->
你也可以在集群外部署 Webhook。这样做需要相应地更新你的 Webhook 配置。

<!--
### Configure admission webhooks on the fly
-->
### 即时配置准入 Webhook {#configure-admission-webhooks-on-the-fly}

<!--
You can dynamically configure what resources are subject to what admission
webhooks via
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io)
or
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io).
-->
你可以通过
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io)
或者
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io) 动态配置哪些资源要被哪些准入 Webhook 处理。

<!--
The following is an example `ValidatingWebhookConfiguration`, a mutating webhook configuration is similar.
See the [webhook configuration](#webhook-configuration) section for details about each config field.
-->
以下是一个 `ValidatingWebhookConfiguration` 示例，Mutating Webhook 配置与此类似。
有关每个配置字段的详细信息，请参阅 [Webhook 配置](#webhook-configuration)部分。

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "pod-policy.example.com"
webhooks:
- name: "pod-policy.example.com"
  rules:
  - apiGroups: [""]
    apiVersions: ["v1"]
    operations: ["CREATE"]
    resources: ["pods"]
    scope: "Namespaced"
  clientConfig:
    service:
      namespace: "example-namespace"
      name: "example-service"
    caBundle: <CA_BUNDLE>
  admissionReviewVersions: ["v1"]
  sideEffects: None
  timeoutSeconds: 5
```

{{< note >}}
<!-- 
You must replace the `<CA_BUNDLE>` in the above example by a valid CA bundle
which is a PEM-encoded (field value is Base64 encoded) CA bundle for validating the webhook's server certificate.
-->
你必须在以上示例中将 `<CA_BUNDLE>` 替换为一个有效的 CA 证书包，
这是一个用 PEM 编码的（字段值是 Base64 编码） CA 证书包，用于校验 Webhook 的服务器证书。
{{< /note >}}

<!--
The `scope` field specifies if only cluster-scoped resources ("Cluster") or namespace-scoped
resources ("Namespaced") will match this rule. "&lowast;" means that there are no scope restrictions.
-->
`scope` 字段指定是仅集群范围的资源（Cluster）还是名字空间范围的资源资源（Namespaced）将与此规则匹配。
`*` 表示没有范围限制。

{{< note >}}
<!--
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
-->
当使用 `clientConfig.service` 时，服务器证书必须对 `<svc_name>.<svc_namespace>.svc` 有效。
{{< /note >}}

{{< note >}}
<!--
Default timeout for a webhook call is 10 seconds,
You can set the `timeout` and it is encouraged to use a short timeout for webhooks.
If the webhook call times out, the request is handled according to the webhook's
failure policy.
-->
Webhook 调用的默认超时是 10 秒，你可以设置 `timeout` 并建议对 Webhook 设置较短的超时时间。
如果 Webhook 调用超时，则根据 Webhook 的失败策略处理请求。
{{< /note >}}

<!--
When an API server receives a request that matches one of the `rules`, the
API server sends an `admissionReview` request to webhook as specified in the
`clientConfig`.

After you create the webhook configuration, the system will take a few seconds
to honor the new configuration.
-->
当一个 API 服务器收到与 `rules` 相匹配的请求时，
该 API 服务器将按照 `clientConfig` 中指定的方式向 Webhook 发送一个 `admissionReview` 请求。

创建 Webhook 配置后，系统将花费几秒钟使新配置生效。

<!--
### Authenticate API servers   {#authenticate-apiservers}
-->
### 对 API 服务器进行身份认证 {#authenticate-apiservers}

<!--
If your admission webhooks require authentication, you can configure the
API servers to use basic auth, bearer token, or a cert to authenticate itself to
the webhooks. There are three steps to complete the configuration.
-->
如果你的 Webhook 需要身份验证，则可以将 API 服务器配置为使用基本身份验证、持有者令牌或证书来向
Webhook 提供身份证明。完成此配置需要三个步骤。

<!--
* When starting the API server, specify the location of the admission control
  configuration file via the `--admission-control-config-file` flag.

* In the admission control configuration file, specify where the
  MutatingAdmissionWebhook controller and ValidatingAdmissionWebhook controller
  should read the credentials. The credentials are stored in kubeConfig files
  (yes, the same schema that's used by kubectl), so the field name is
  `kubeConfigFile`. Here is an example admission control configuration file:
-->
* 启动 API 服务器时，通过 `--admission-control-config-file` 参数指定准入控制配置文件的位置。

* 在准入控制配置文件中，指定 MutatingAdmissionWebhook 控制器和 ValidatingAdmissionWebhook 控制器应该读取凭据的位置。
  凭证存储在 kubeConfig 文件中（是​​的，与 kubectl 使用的模式相同），因此字段名称为 `kubeConfigFile`。
  以下是一个准入控制配置文件示例：

{{< tabs name="admissionconfiguration_example1" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: WebhookAdmissionConfiguration
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: WebhookAdmissionConfiguration
    kubeConfigFile: "<path-to-kubeconfig-file>"
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
<!--
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    # Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1, kind=WebhookAdmissionConfiguration
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    # Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1, kind=WebhookAdmissionConfiguration
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
```
-->
```yaml
# 1.17 中被淘汰，推荐使用 apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    # 1.17 中被淘汰，推荐使用 apiserver.config.k8s.io/v1，kind = WebhookAdmissionConfiguration
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    # 1.17 中被淘汰，推荐使用 apiserver.config.k8s.io/v1，kind = WebhookAdmissionConfiguration
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
```

{{% /tab %}}
{{< /tabs >}}

<!--
For more information about `AdmissionConfiguration`, see the
[AdmissionConfiguration (v1) reference](/docs/reference/config-api/apiserver-webhookadmission.v1/).
See the [webhook configuration](#webhook-configuration) section for details about each config field.

In the kubeConfig file, provide the credentials:
-->
有关 `AdmissionConfiguration` 的更多信息，请参见
[AdmissionConfiguration (v1) reference](/docs/reference/config-api/apiserver-webhookadmission.v1/)。
有关每个配置字段的详细信息，请参见 [Webhook 配置](#webhook-配置)部分。

在 kubeConfig 文件中，提供证书凭据：

<!--
```yaml
apiVersion: v1
kind: Config
users:
# name should be set to the DNS name of the service or the host (including port) of the URL the webhook is configured to speak to.
# If a non-443 port is used for services, it must be included in the name when configuring 1.16+ API servers.
#
# For a webhook configured to speak to a service on the default port (443), specify the DNS name of the service:
# - name: webhook1.ns1.svc
#   user: ...
#
# For a webhook configured to speak to a service on non-default port (e.g. 8443), specify the DNS name and port of the service in 1.16+:
# - name: webhook1.ns1.svc:8443
#   user: ...
# and optionally create a second stanza using only the DNS name of the service for compatibility with 1.15 API servers:
# - name: webhook1.ns1.svc
#   user: ...
#
# For webhooks configured to speak to a URL, match the host (and port) specified in the webhook's URL. Examples:
# A webhook with `url: https://www.example.com`:
# - name: www.example.com
#   user: ...
#
# A webhook with `url: https://www.example.com:443`:
# - name: www.example.com:443
#   user: ...
#
# A webhook with `url: https://www.example.com:8443`:
# - name: www.example.com:8443
#   user: ...
#
- name: 'webhook1.ns1.svc'
  user:
    client-certificate-data: "<pem encoded certificate>"
    client-key-data: "<pem encoded key>"
# The `name` supports using * to wildcard-match prefixing segments.
- name: '*.webhook-company.org'
  user:
    password: "<password>"
    username: "<name>"
# '*' is the default match.
- name: '*'
  user:
    token: "<token>"
```
-->
```yaml
apiVersion: v1
kind: Config
users:
# 名称应设置为服务的 DNS 名称或配置了 Webhook 的 URL 的主机名（包括端口）。
# 如果将非 443 端口用于服务，则在配置 1.16+ API 服务器时，该端口必须包含在名称中。
#
# 对于配置在默认端口（443）上与服务对话的 Webhook，请指定服务的 DNS 名称：
# - name: webhook1.ns1.svc
#   user: ...
#
# 对于配置在非默认端口（例如 8443）上与服务对话的 Webhook，请在 1.16+ 中指定服务的 DNS 名称和端口：
# - name: webhook1.ns1.svc:8443
#   user: ...
# 并可以选择仅使用服务的 DNS 名称来创建第二节，以与 1.15 API 服务器版本兼容：
# - name: webhook1.ns1.svc
#   user: ...
#
# 对于配置为使用 URL 的 webhook，请匹配在 webhook 的 URL 中指定的主机（和端口）。
# 带有 `url: https://www.example.com` 的 webhook：
# - name: www.example.com
#   user: ...
#
# 带有 `url: https://www.example.com:443` 的 webhook：
# - name: www.example.com:443
#   user: ...
#
# 带有 `url: https://www.example.com:8443` 的 webhook：
# - name: www.example.com:8443
#   user: ...
#
- name: 'webhook1.ns1.svc'
  user:
    client-certificate-data: "<pem encoded certificate>"
    client-key-data: "<pem encoded key>"
# `name` 支持使用 * 通配符匹配前缀段。
- name: '*.webhook-company.org'
  user:
    password: "<password>"
    username: "<name>"
# '*' 是默认匹配项。
- name: '*'
  user:
    token: "<token>"
```

<!--
Of course you need to set up the webhook server to handle these authentication requests.
-->
当然，你需要设置 Webhook 服务器来处理这些身份验证请求。

<!--
## Webhook request and response
-->
## Webhook 请求与响应 {#webhook-request-and-response}

<!--
### Request

Webhooks are sent as POST requests, with `Content-Type: application/json`,
with an `AdmissionReview` API object in the `admission.k8s.io` API group
serialized to JSON as the body.

Webhooks can specify what versions of `AdmissionReview` objects they accept
with the `admissionReviewVersions` field in their configuration:
-->

### 请求 {#request}

Webhook 发送 POST 请求时，请设置 `Content-Type: application/json` 并对 `admission.k8s.io` API
组中的 `AdmissionReview` 对象进行序列化，将所得到的 JSON 作为请求的主体。

Webhook 可以在配置中的 `admissionReviewVersions` 字段指定可接受的 `AdmissionReview` 对象版本：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  admissionReviewVersions: ["v1", "v1beta1"]
```

<!--
`admissionReviewVersions` is a required field when creating webhook configurations.
Webhooks are required to support at least one `AdmissionReview`
version understood by the current and previous API server.
-->
创建 Webhook 配置时，`admissionReviewVersions` 是必填字段。
Webhook 必须支持至少一个当前和以前的 API 服务器都可以解析的 `AdmissionReview` 版本。

<!--
API servers send the first `AdmissionReview` version in the `admissionReviewVersions` list they support.
If none of the versions in the list are supported by the API server, the configuration will not be allowed to be created.
If an API server encounters a webhook configuration that was previously created and does not support any of the `AdmissionReview`
versions the API server knows how to send, attempts to call to the webhook will fail and be subject to the [failure policy](#failure-policy).

This example shows the data contained in an `AdmissionReview` object
for a request to update the `scale` subresource of an `apps/v1` `Deployment`:
-->
API 服务器将发送的是 `admissionReviewVersions` 列表中所支持的第一个 `AdmissionReview` 版本。如果 API 服务器不支持列表中的任何版本，则不允许创建配置。

如果 API 服务器遇到以前创建的 Webhook 配置，并且不支持该 API 服务器知道如何发送的任何 `AdmissionReview` 版本，则调用 Webhook 的尝试将失败，并依据[失败策略](#failure-policy)进行处理。

此示例显示了 `AdmissionReview` 对象中包含的数据，该数据用于请求更新 `apps/v1` `Deployment` 的 `scale` 子资源：

```yaml
apiVersion: admission.k8s.io/v1
kind: AdmissionReview
request:
  # 唯一标识此准入回调的随机 uid
  uid: 705ab4f5-6393-11e8-b7cc-42010a800002

  # 传入完全正确的 group/version/kind 对象
  kind:
    group: autoscaling
    version: v1
    kind: Scale

  # 修改 resource 的完全正确的的 group/version/kind
  resource:
    group: apps
    version: v1
    resource: deployments

  # subResource（如果请求是针对 subResource 的）
  subResource: scale

  # 在对 API 服务器的原始请求中，传入对象的标准 group/version/kind
  # 仅当 Webhook 指定 `matchPolicy: Equivalent` 且将对 API 服务器的原始请求
  # 转换为 Webhook 注册的版本时，这才与 `kind` 不同。
  requestKind:
    group: autoscaling
    version: v1
    kind: Scale

  # 在对 API 服务器的原始请求中正在修改的资源的标准 group/version/kind
  # 仅当 Webhook 指定了 `matchPolicy：Equivalent` 并且将对 API 服务器的原始请求转换为
  # Webhook 注册的版本时，这才与 `resource` 不同。
  requestResource:
    group: apps
    version: v1
    resource: deployments

  # subResource（如果请求是针对 subResource 的）
  # 仅当 Webhook 指定了 `matchPolicy：Equivalent` 并且将对
  # API 服务器的原始请求转换为该 Webhook 注册的版本时，这才与 `subResource` 不同。
  requestSubResource: scale

  # 被修改资源的名称
  name: my-deployment

  # 如果资源是属于名字空间（或者是名字空间对象），则这是被修改的资源的名字空间
  namespace: my-namespace

  # 操作可以是 CREATE、UPDATE、DELETE 或 CONNECT
  operation: UPDATE

  userInfo:
    # 向 API 服务器发出请求的经过身份验证的用户的用户名
    username: admin

    # 向 API 服务器发出请求的经过身份验证的用户的 UID
    uid: 014fbff9a07c

    # 向 API 服务器发出请求的经过身份验证的用户的组成员身份
    groups:
      - system:authenticated
      - my-admin-group
    # 向 API 服务器发出请求的用户相关的任意附加信息
    # 该字段由 API 服务器身份验证层填充，并且如果 webhook 执行了任何
    # SubjectAccessReview 检查，则应将其包括在内。
    extra:
      some-key:
        - some-value1
        - some-value2

  # object 是被接纳的新对象。
  # 对于 DELETE 操作，它为 null。
  object:
    apiVersion: autoscaling/v1
    kind: Scale

  # oldObject 是现有对象。
  # 对于 CREATE 和 CONNECT 操作，它为 null。
  oldObject:
    apiVersion: autoscaling/v1
    kind: Scale

  # options 包含要接受的操作的选项，例如 meta.k8s.io/v CreateOptions、UpdateOptions 或 DeleteOptions。
  # 对于 CONNECT 操作，它为 null。
  options:
    apiVersion: meta.k8s.io/v1
    kind: UpdateOptions

  # dryRun 表示 API 请求正在以 `dryrun` 模式运行，并且将不会保留。
  # 带有副作用的 Webhook 应该避免在 dryRun 为 true 时激活这些副作用。
  # 有关更多详细信息，请参见 http://k8s.io/zh-cn/docs/reference/using-api/api-concepts/#make-a-dry-run-request
  dryRun: False
```

<!--
### Response
-->
### 响应{#response}

<!--
Webhooks respond with a 200 HTTP status code, `Content-Type: application/json`,
and a body containing an `AdmissionReview` object (in the same version they were sent),
with the `response` stanza populated, serialized to JSON.
-->
Webhook 使用 HTTP 200 状态码、`Content-Type: application/json` 和一个包含 `AdmissionReview` 对象的 JSON 序列化格式来发送响应。该 `AdmissionReview` 对象与发送的版本相同，且其中包含的 `response` 字段已被有效填充。

<!--
At a minimum, the `response` stanza must contain the following fields:

* `uid`, copied from the `request.uid` sent to the webhook
* `allowed`, either set to `true` or `false`

Example of a minimal response from a webhook to allow a request:
-->
`response` 至少必须包含以下字段：

* `uid`，从发送到 Webhook 的 `request.uid` 中复制而来
* `allowed`，设置为 `true` 或 `false`

<!--
Example of a minimal response from a webhook to allow a request:
-->
Webhook 允许请求的最简单响应示例：

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true
  }
}
```

<!--
Example of a minimal response from a webhook to forbid a request:
-->
Webhook 禁止请求的最简单响应示例：

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": false
  }
}
```

<!--
When rejecting a request, the webhook can customize the http code and message returned to the user
using the `status` field. The specified status object is returned to the user.
See the [API documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#status-v1-meta)
for details about the `status` type.
Example of a response to forbid a request, customizing the HTTP status code and message presented to the user:
-->
当拒绝请求时，Webhook 可以使用 `status` 字段自定义 http 响应码和返回给用户的消息。
有关状态类型的详细信息，请参见
[API 文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#status-v1-meta)。
禁止请求的响应示例，它定制了向用户显示的 HTTP 状态码和消息：

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": false,
    "status": {
      "code": 403,
      "message": "You cannot do this because it is Tuesday and your name starts with A"
    }
  }
}
```

<!--
When allowing a request, a mutating admission webhook may optionally modify the incoming object as well.
This is done using the `patch` and `patchType` fields in the response.
The only currently supported `patchType` is `JSONPatch`.
See [JSON patch](https://jsonpatch.com/) documentation for more details.
For `patchType: JSONPatch`, the `patch` field contains a base64-encoded array of JSON patch operations.
-->
当允许请求时，mutating准入 Webhook 也可以选择修改传入的对象。
这是通过在响应中使用 `patch` 和 `patchType` 字段来完成的。
当前唯一支持的 `patchType` 是 `JSONPatch`。
有关更多详细信息，请参见 [JSON patch](https://jsonpatch.com/)。
对于 `patchType: JSONPatch`，`patch` 字段包含一个以 base64 编码的 JSON patch 操作数组。

<!--
As an example, a single patch operation that would set `spec.replicas` would be
`[{"op": "add", "path": "/spec/replicas", "value": 3}]`

Base64-encoded, this would be `W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`
-->
例如，设置 `spec.replicas` 的单个补丁操作将是
`[{"op": "add", "path": "/spec/replicas", "value": 3}]`。

如果以 Base64 形式编码，结果将是
`W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`

<!--
So a webhook response to add that label would be:
-->
因此，添加该标签的 Webhook 响应为：

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true,
    "patchType": "JSONPatch",
    "patch": "W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0="
  }
}
```

<!--
Admission webhooks can optionally return warning messages that are returned to the requesting client
in HTTP `Warning` headers with a warning code of 299. Warnings can be sent with allowed or rejected admission responses.
-->
准入 Webhook 可以选择性地返回在 HTTP `Warning` 头中返回给请求客户端的警告消息，警告代码为 299。
警告可以与允许或拒绝的准入响应一起发送。

<!--
If you're implementing a webhook that returns a warning:

* Don't include a "Warning:" prefix in the message
* Use warning messages to describe problems the client making the API request should correct or be aware of
* Limit warnings to 120 characters if possible
-->
如果你正在实现返回一条警告的 Webhook，则：

* 不要在消息中包括 "Warning:" 前缀
* 使用警告消息描述该客户端进行 API 请求时会遇到或应意识到的问题
* 如果可能，将警告限制为 120 个字符

{{< caution >}}
<!-- 
Individual warning messages over 256 characters may be truncated by the API server before being returned to clients.
If more than 4096 characters of warning messages are added (from all sources), additional warning messages are ignored.
-->
超过 256 个字符的单条警告消息在返回给客户之前可能会被 API 服务器截断。
如果超过 4096 个字符的警告消息（来自所有来源），则额外的警告消息会被忽略。
{{< /caution >}}

```json
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true,
    "warnings": [
      "duplicate envvar entries specified with name MY_ENV",
      "memory request less than 4MB specified for container mycontainer, which will not start successfully"
    ]
  }
}
```

<!--
## Webhook configuration
-->
## Webhook 配置{#webhook-configuration}

<!--
To register admission webhooks, create `MutatingWebhookConfiguration` or `ValidatingWebhookConfiguration` API objects.
The name of a `MutatingWebhookConfiguration` or a `ValidatingWebhookConfiguration` object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Each configuration can contain one or more webhooks.
If multiple webhooks are specified in a single configuration, each must be given a unique name.
This is required in order to make resulting audit logs and metrics easier to match up to active
configurations.

Each webhook defines the following things.
-->
要注册准入 Webhook，请创建 `MutatingWebhookConfiguration` 或 `ValidatingWebhookConfiguration` API 对象。
`MutatingWebhookConfiguration` 或`ValidatingWebhookConfiguration` 对象的名称必须是有效的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

每种配置可以包含一个或多个 Webhook。如果在单个配置中指定了多个
Webhook，则应为每个 Webhook 赋予一个唯一的名称。
这是必需的，以使生成的审计日志和指标更易于与激活的配置相匹配。

每个 Webhook 定义以下内容。

<!--
### Matching requests: rules
-->
### 匹配请求-规则{#matching-requests-rules}

<!--
Each webhook must specify a list of rules used to determine if a request to the API server should be sent to the webhook.
Each rule specifies one or more operations, apiGroups, apiVersions, and resources, and a resource scope:
-->
每个 Webhook 必须指定用于确定是否应将对 apiserver 的请求发送到 Webhook 的规则列表。
每个规则都指定一个或多个 operations、apiGroups、apiVersions 和 resources 以及资源的 scope：

<!--
* `operations` lists one or more operations to match. Can be `"CREATE"`, `"UPDATE"`, `"DELETE"`, `"CONNECT"`,
  or `"*"` to match all.
* `apiGroups` lists one or more API groups to match. `""` is the core API group. `"*"` matches all API groups.
* `apiVersions` lists one or more API versions to match. `"*"` matches all API versions.
* `resources` lists one or more resources to match.

  * `"*"` matches all resources, but not subresources.
  * `"*/*"` matches all resources and subresources.
  * `"pods/*"` matches all subresources of pods.
  * `"*/status"` matches all status subresources.

* `scope` specifies a scope to match. Valid values are `"Cluster"`, `"Namespaced"`, and `"*"`.
  Subresources match the scope of their parent resource. Default is `"*"`.

  * `"Cluster"` means that only cluster-scoped resources will match this rule (Namespace API objects are cluster-scoped).
  * `"Namespaced"` means that only namespaced resources will match this rule.
  * `"*"` means that there are no scope restrictions.
-->
* `operations` 列出一个或多个要匹配的操作。
  可以是 `CREATE`、`UPDATE`、`DELETE`、`CONNECT` 或 `*` 以匹配所有内容。
* `apiGroups` 列出了一个或多个要匹配的 API 组。`""` 是核心 API 组。`"*"` 匹配所有 API 组。
* `apiVersions` 列出了一个或多个要匹配的 API 版本。`"*"` 匹配所有 API 版本。
* `resources` 列出了一个或多个要匹配的资源。

  * `"*"` 匹配所有资源，但不包括子资源。
  * `"*/*"` 匹配所有资源，包括子资源。
  * `"pods/*"` 匹配 pod 的所有子资源。
  * `"*/status"` 匹配所有 status 子资源。
* `scope` 指定要匹配的范围。有效值为 `"Cluster"`、`"Namespaced"` 和 `"*"`。
  子资源匹配其父资源的范围。默认值为 `"*"`。

  * `"Cluster"` 表示只有集群作用域的资源才能匹配此规则（API 对象 Namespace 是集群作用域的）。
  * `"Namespaced"` 意味着仅具有名字空间的资源才符合此规则。
  * `"*"` 表示没有作用域限制。

<!--
If an incoming request matches one of the specified `operations`, `groups`, `versions`,
`resources`, and `scope` for any of a webhook's `rules`, the request is sent to the webhook.

Here are other examples of rules that could be used to specify which resources should be intercepted.

Match `CREATE` or `UPDATE` requests to `apps/v1` and `apps/v1beta1` `deployments` and `replicasets`:
-->
如果传入请求与任何 Webhook `rules` 的指定 `operations`、`groups`、`versions`、
`resources` 和 `scope` 匹配，则该请求将发送到 Webhook。

以下是可用于指定应拦截哪些资源的规则的其他示例。

匹配针对 `apps/v1` 和 `apps/v1beta1` 组中 `deployments` 和 `replicasets`
资源的 `CREATE` 或 `UPDATE` 请求：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["CREATE", "UPDATE"]
    apiGroups: ["apps"]
    apiVersions: ["v1", "v1beta1"]
    resources: ["deployments", "replicasets"]
    scope: "Namespaced"
  ...
```

<!--
Match create requests for all resources (but not subresources) in all API groups and versions:
-->
匹配所有 API 组和版本中的所有资源（但不包括子资源）的创建请求：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "*"
```

<!--
Match update requests for all `status` subresources in all API groups and versions:
-->
匹配所有 API 组和版本中所有 `status` 子资源的更新请求：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    rules:
      - operations: ["UPDATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*/status"]
        scope: "*"
```

<!--
### Matching requests: objectSelector
-->
### 匹配请求：objectSelector {#matching-requests-objectselector}

<!--
Webhooks may optionally limit which requests are intercepted based on the labels of the
objects they would be sent, by specifying an `objectSelector`. If specified, the objectSelector
is evaluated against both the object and oldObject that would be sent to the webhook,
and is considered to match if either object matches the selector.
-->
通过指定 `objectSelector`，Webhook 能够根据可能发送的对象的标签来限制哪些请求被拦截。
如果指定，则将对 `objectSelector` 和可能发送到 Webhook 的 object 和 oldObject
进行评估。如果两个对象之一与选择器匹配，则认为该请求已匹配。

<!--
A null object (`oldObject` in the case of create, or `newObject` in the case of delete),
or an object that cannot have labels (like a `DeploymentRollback` or a `PodProxyOptions` object)
is not considered to match.
-->
空对象（对于创建操作而言为 `oldObject`，对于删除操作而言为 `newObject`），
或不能带标签的对象（例如 `DeploymentRollback` 或 `PodProxyOptions` 对象）
被认为不匹配。

<!--
Use the object selector only if the webhook is opt-in, because end users may skip
the admission webhook by setting the labels.
-->
仅当选择使用 Webhook 时才使用对象选择器，因为最终用户可以通过设置标签来
跳过准入 Webhook。

<!--
This example shows a mutating webhook that would match a `CREATE` of any resource (but not subresources) with the label `foo: bar`:
-->
这个例子展示了一个变更性质的 Webhook，它将匹配带有标签 `foo:bar` 的所有资源（但不包括子资源）的
`CREATE` 操作：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  objectSelector:
    matchLabels:
      foo: bar
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "*"
```

<!--
See [labels concept](/docs/concepts/overview/working-with-objects/labels)
for more examples of label selectors.
-->
有关标签选择器的更多示例，请参见[标签](/zh-cn/docs/concepts/overview/working-with-objects/labels)。

<!--
### Matching requests: namespaceSelector
-->
### 匹配请求：namespaceSelector {#matching-requests-namespaceselector}

<!--
Webhooks may optionally limit which requests for namespaced resources are intercepted,
based on the labels of the containing namespace, by specifying a `namespaceSelector`.
-->
通过指定 `namespaceSelector`，
Webhook 可以根据具有名字空间的资源所处的名字空间的标签来选择拦截哪些资源的操作。

<!--
The `namespaceSelector` decides whether to run the webhook on a request for a namespaced resource
(or a Namespace object), based on whether the namespace's labels match the selector.
If the object itself is a namespace, the matching is performed on object.metadata.labels.
If the object is a cluster scoped resource other than a Namespace, `namespaceSelector` has no effect.
-->
`namespaceSelector` 根据名字空间的标签是否匹配选择器，决定是否针对具名字空间的资源
（或 Namespace 对象）的请求运行 Webhook。
如果对象是除 Namespace 以外的集群范围的资源，则 `namespaceSelector` 标签无效。

<!--
This example shows a mutating webhook that matches a `CREATE` of any namespaced resource inside a namespace
that does not have a "runlevel" label of "0" or "1":
-->
本例给出的变更性质的 Webhook 将匹配到对名字空间中具名字空间的资源的 `CREATE` 请求，
前提是这些资源不含值为 "0" 或 "1" 的 "runlevel" 标签：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    namespaceSelector:
      matchExpressions:
        - key: runlevel
          operator: NotIn
          values: ["0", "1"]
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "Namespaced"
```

<!--
This example shows a validating webhook that matches a `CREATE` of any namespaced resource inside
a namespace that is associated with the "environment" of "prod" or "staging":
-->
此示例显示了一个验证性质的 Webhook，它将匹配到对某名字空间中的任何具名字空间的资源的
`CREATE` 请求，前提是该名字空间具有值为 "prod" 或 "staging" 的 "environment" 标签：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    namespaceSelector:
      matchExpressions:
        - key: environment
          operator: In
          values: ["prod", "staging"]
    rules:
      - operations: ["CREATE"]
        apiGroups: ["*"]
        apiVersions: ["*"]
        resources: ["*"]
        scope: "Namespaced"
```

<!--
See [labels concept](/docs/concepts/overview/working-with-objects/labels)
for more examples of label selectors.
-->
有关标签选择器的更多示例，请参见
[标签](/zh-cn/docs/concepts/overview/working-with-objects/labels)。

<!--
### Matching requests: matchPolicy
-->
### 匹配请求：matchPolicy {#matching-requests-matchpolicy}

<!--
API servers can make objects available via multiple API groups or versions.
-->
API 服务器可以通过多个 API 组或版本来提供对象。

<!--
For example, if a webhook only specified a rule for some API groups/versions
(like `apiGroups:["apps"], apiVersions:["v1","v1beta1"]`),
and a request was made to modify the resource via another API group/version (like `extensions/v1beta1`),
the request would not be sent to the webhook.
-->
例如，如果一个 Webhook 仅为某些 API 组/版本指定了规则（例如
`apiGroups:["apps"], apiVersions:["v1","v1beta1"]`），而修改资源的请求是通过另一个
API 组/版本（例如 `extensions/v1beta1`）发出的，该请求将不会被发送到 Webhook。

<!--
The `matchPolicy` lets a webhook define how its `rules` are used to match incoming requests.
Allowed values are `Exact` or `Equivalent`.
-->
`matchPolicy` 允许 Webhook 定义如何使用其 `rules` 匹配传入的请求。
允许的值为 `Exact` 或 `Equivalent`。

<!--
* `Exact` means a request should be intercepted only if it exactly matches a specified rule.
* `Equivalent` means a request should be intercepted if it modifies a resource listed in `rules`,
  even via another API group or version.

In the example given above, the webhook that only registered for `apps/v1` could use `matchPolicy`:

* `matchPolicy: Exact` would mean the `extensions/v1beta1` request would not be sent to the webhook
* `matchPolicy: Equivalent` means the `extensions/v1beta1` request would be sent to the webhook
  (with the objects converted to a version the webhook had specified: `apps/v1`)
-->
* `Exact` 表示仅当请求与指定规则完全匹配时才应拦截该请求。
* `Equivalent` 表示如果某个请求意在修改 `rules` 中列出的资源，
  即使该请求是通过其他 API 组或版本发起，也应拦截该请求。

在上面给出的示例中，仅为 `apps/v1` 注册的 Webhook 可以使用 `matchPolicy`：
* `matchPolicy: Exact` 表示不会将 `extensions/v1beta1` 请求发送到 Webhook
* `matchPolicy:Equivalent` 表示将 `extensions/v1beta1` 请求发送到 Webhook
  （将对象转换为 Webhook 指定的版本：`apps/v1`）

<!--
Specifying `Equivalent` is recommended, and ensures that webhooks continue to intercept the
resources they expect when upgrades enable new versions of the resource in the API server.
-->
建议指定 `Equivalent`，确保升级后启用 API 服务器中资源的新版本时，
Webhook 继续拦截他们期望的资源。

<!--
When a resource stops being served by the API server, it is no longer considered equivalent to
other versions of that resource that are still served.
For example, `extensions/v1beta1` deployments were first deprecated and then removed (in Kubernetes v1.16).

Since that removal, a webhook with a `apiGroups:["extensions"], apiVersions:["v1beta1"], resources:["deployments"]` rule
does not intercept deployments created via `apps/v1` APIs. For that reason, webhooks should prefer registering
for stable versions of resources.
-->
当 API 服务器停止提供某资源时，该资源不再被视为等同于该资源的其他仍在提供服务的版本。
例如，`extensions/v1beta1` 中的 Deployment 已被废弃，计划在 v1.16 中移除。

移除后，带有 `apiGroups:["extensions"], apiVersions:["v1beta1"], resources: ["deployments"]`
规则的 Webhook 将不再拦截通过 `apps/v1` API 来创建的 Deployment。
因此，Webhook 应该优先注册稳定版本的资源。

<!--
This example shows a validating webhook that intercepts modifications to deployments (no matter the API group or version),
and is always sent an `apps/v1` `Deployment` object:
-->
此示例显示了一个验证性质的 Webhook，该 Webhook 拦截对 Deployment 的修改（无论 API 组或版本是什么），
始终会发送一个 `apps/v1` 版本的 Deployment 对象：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  matchPolicy: Equivalent
  rules:
  - operations: ["CREATE","UPDATE","DELETE"]
    apiGroups: ["apps"]
    apiVersions: ["v1"]
    resources: ["deployments"]
    scope: "Namespaced"
```

<!--
The `matchPolicy` for an admission webhooks defaults to `Equivalent`.
-->
准入 Webhook 所用的 `matchPolicy` 默认为 `Equivalent`。

<!--
### Matching requests: `matchConditions`
-->
### 匹配请求：`matchConditions`  {#matching-requests-matchConditions}

{{< feature-state feature_gate_name="AdmissionWebhookMatchConditions" >}}

<!--
You can define _match conditions_ for webhooks if you need fine-grained request filtering. These
conditions are useful if you find that match rules, `objectSelectors` and `namespaceSelectors` still
doesn't provide the filtering you want over when to call out over HTTP. Match conditions are
[CEL expressions](/docs/reference/using-api/cel/). All match conditions must evaluate to true for the
webhook to be called.
-->
如果你需要细粒度地过滤请求，你可以为 Webhook 定义**匹配条件**。
如果你发现匹配规则、`objectSelectors` 和 `namespaceSelectors` 仍然不能提供你想要的何时进行 HTTP
调用的过滤条件，那么添加这些条件会很有用。
匹配条件是 [CEL 表达式](/zh-cn/docs/reference/using-api/cel/)。
所有匹配条件都必须为 true 才能调用 Webhook。

<!--
Here is an example illustrating a few different uses for match conditions:
-->
以下是一个例子，说明了匹配条件的几种不同用法：

<!--
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['*']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Ignore' # Fail-open (optional)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitted>'
    # You can have up to 64 matchConditions per webhook
    matchConditions:
      - name: 'exclude-leases' # Each match condition must have a unique name
        expression: '!(request.resource.group == "coordination.k8s.io" && request.resource.resource == "leases")' # Match non-lease resources.
      - name: 'exclude-kubelet-requests'
        expression: '!("system:nodes" in request.userInfo.groups)' # Match requests made by non-node users.
      - name: 'rbac' # Skip RBAC requests, which are handled by the second webhook.
        expression: 'request.resource.group != "rbac.authorization.k8s.io"'
  
  # This example illustrates the use of the 'authorizer'. The authorization check is more expensive
  # than a simple expression, so in this example it is scoped to only RBAC requests by using a second
  # webhook. Both webhooks can be served by the same endpoint.
  - name: rbac.my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['rbac.authorization.k8s.io']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Fail' # Fail-closed (the default)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitted>'
    # You can have up to 64 matchConditions per webhook
    matchConditions:
      - name: 'breakglass'
        # Skip requests made by users authorized to 'breakglass' on this webhook.
        # The 'breakglass' API verb does not need to exist outside this check.
        expression: '!authorizer.group("admissionregistration.k8s.io").resource("validatingwebhookconfigurations").name("my-webhook.example.com").check("breakglass").allowed()'
```
-->
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['*']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Ignore' # 失败时继续处理请求但跳过 Webhook (可选值)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitted>'
    # 你可以为每个 Webhook 配置最多 64 个 matchConditions
    matchConditions:
      - name: 'exclude-leases' # 每个匹配条件必须有唯一的名称
        expression: '!(request.resource.group == "coordination.k8s.io" && request.resource.resource == "leases")' # 匹配非租约资源
      - name: 'exclude-kubelet-requests'
        expression: '!("system:nodes" in request.userInfo.groups)' # 匹配非节点用户发出的请求
      - name: 'rbac' # 跳过 RBAC 请求，该请求将由第二个 Webhook 处理
        expression: 'request.resource.group != "rbac.authorization.k8s.io"'

  # 这个示例演示了如何使用 “authorizer”。
  # 授权检查比简单的表达式更复杂，因此在这个示例中，使用第二个 Webhook 来针对 RBAC 请求进行处理。
  # 两个 Webhook 都可以由同一个端点提供服务。
  - name: rbac.my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['rbac.authorization.k8s.io']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Fail' # 失败时拒绝请求 (默认值)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitted>'
    # 你可以为每个 Webhook 配置最多 64 个 matchConditions
    matchConditions:
      - name: 'breakglass'
        # 跳过由授权给 “breakglass” 的用户在这个 Webhook 上发起的请求。
        # “breakglass” API 不需要在这个检查之外存在。
        expression: '!authorizer.group("admissionregistration.k8s.io").resource("validatingwebhookconfigurations").name("my-webhook.example.com").check("breakglass").allowed()'
```

{{< note >}}
<!--
You can define up to 64 elements in the `matchConditions` field per webhook.
-->
你可以为每个 Webhook 在 `matchConditions` 字段中定义最多 64 个匹配条件。
{{< /note >}}

<!--
Match conditions have access to the following CEL variables:
-->
匹配条件可以访问以下 CEL 变量：

<!--
- `object` - The object from the incoming request. The value is null for DELETE requests. The object
  version may be converted based on the [matchPolicy](#matching-requests-matchpolicy).
-->
- `object` - 来自传入请求的对象。对于 DELETE 请求，该值为 null。
  该对象版本可能根据 [matchPolicy](#matching-requests-matchpolicy) 进行转换。
<!--
- `oldObject` - The existing object. The value is null for CREATE requests.
-->
- `oldObject` - 现有对象。对于 CREATE 请求，该值为 null。
<!--
- `request` - The request portion of the [AdmissionReview](#request), excluding `object` and `oldObject`.
-->
- `request` - [AdmissionReview](#request) 的请求部分，不包括 object 和 oldObject。
<!--
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal
  (authenticated user) of the request. See
  [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) in the Kubernetes CEL library
  documentation for more details.
-->
- `authorizer` - 一个 CEL 鉴权组件。可用于对请求的主体（经过身份认证的用户）执行鉴权检查。
  更多详细信息，请参阅 Kubernetes CEL 库文档中的
  [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)。
<!--
- `authorizer.requestResource` - A shortcut for an authorization check configured with the request
  resource (group, resource, (subresource), namespace, name).
-->
- `authorizer.requestResource` - 对配置的请求资源（组、资源、（子资源）、名字空间、名称）进行授权检查的快捷方式。

<!--
For more information on CEL expressions, refer to the
[Common Expression Language in Kubernetes reference](/docs/reference/using-api/cel/).
-->
了解有关 CEL 表达式的更多信息，请参阅
[Kubernetes 参考文档中的通用表达式语言](/zh-cn/docs/reference/using-api/cel/)。

<!--
In the event of an error evaluating a match condition the webhook is never called. Whether to reject
the request is determined as follows:
-->
如果在对匹配条件求值时出现错误，则不会调用 Webhook。根据以下方式确定是否拒绝请求：

<!--
1. If **any** match condition evaluated to `false` (regardless of other errors), the API server skips the webhook.
-->
1. 如果**任何一个**匹配条件求值结果为 `false`（不管其他错误），API 服务器将跳过 Webhook。
<!--
1. Otherwise:
    - for [`failurePolicy: Fail`](#failure-policy), reject the request (without calling the webhook).
    - for [`failurePolicy: Ignore`](#failure-policy), proceed with the request but skip the webhook.
-->
1. 否则：
   - 对于 [`failurePolicy: Fail`](#failure-policy)，拒绝请求（不调用 Webhook）。
   - 对于 [`failurePolicy: Ignore`](#failure-policy)，继续处理请求但跳过 Webhook。

<!--
### Contacting the webhook
-->
### 调用 Webhook {#contacting-the-webhook}

<!--
Once the API server has determined a request should be sent to a webhook,
it needs to know how to contact the webhook. This is specified in the `clientConfig`
stanza of the webhook configuration.

Webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.
-->
API 服务器确定请求应发送到 Webhook 后，它需要知道如何调用 Webhook。
此信息在 Webhook 配置的 `clientConfig` 节中指定。

Webhook 可以通过 URL 或服务引用来调用，并且可以选择包含自定义 CA 包，以用于验证 TLS 连接。

<!--
#### URL
-->
#### URL{#url}

<!--
`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`).
-->
`url` 以标准 URL 形式给出 Webhook 的位置（`scheme://host:port/path`）。

<!--
The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some API servers
(e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would
be a layering violation). `host` may also be an IP address.
-->
`host` 不应引用集群中运行的服务；通过指定 `service` 字段来使用服务引用。
主机可以通过某些 API 服务器中的外部 DNS 进行解析。
（例如，`kube-apiserver` 无法解析集群内 DNS，因为这将违反分层规则）。`host` 也可以是 IP 地址。

<!--
Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an API server which might need to make calls to this
webhook. Such installations are likely to be non-portable or not readily
run in a new cluster.
-->
请注意，将 `localhost` 或 `127.0.0.1` 用作 `host` 是有风险的，
除非你非常小心地在所有运行 apiserver 的、可能需要对此 Webhook
进行调用的主机上运行。这样的安装方式可能不具有可移植性，即很难在新集群中启用。

<!--
The scheme must be "https"; the URL must begin with "https://".
-->
scheme 必须为 "https"；URL 必须以 "https://" 开头。

<!--
Attempting to use a user or basic auth (for example `user:password@`) is not allowed.
Fragments (`#...`) and query parameters (`?...`) are also not allowed.
-->
使用用户或基本身份验证（例如："user:password@"）是不允许的。
使用片段（"#..."）和查询参数（"?..."）也是不允许的。

<!--
Here is an example of a mutating webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
-->
这是配置为调用 URL 的变更性质的 Webhook 的示例
（并且期望使用系统信任根证书来验证 TLS 证书，因此不指定 caBundle）：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  clientConfig:
    url: "https://my-webhook.example.com:9443/my-webhook-path"
```

<!--
#### Service reference
-->
#### 服务引用  {#service-reference}

<!--
The `service` stanza inside `clientConfig` is a reference to the service for this webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".
-->
`clientConfig` 内部的 Service 是对该 Webhook 服务的引用。
如果 Webhook 在集群中运行，则应使用 `service` 而不是 `url`。
服务的 `namespace` 和 `name` 是必需的。
`port` 是可选的，默认值为 443。`path` 是可选的，默认为 "/"。

<!--
Here is an example of a mutating webhook configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle:
-->
这是一个 mutating Webhook 的示例，该 mutating Webhook 配置为在子路径 "/my-path" 端口
"1234" 上调用服务，并使用自定义 CA 包针对 ServerName
`my-service-name.my-service-namespace.svc` 验证 TLS 连接：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  clientConfig:
    caBundle: <CA_BUNDLE>
    service:
      namespace: my-service-namespace
      name: my-service-name
      path: /my-path
      port: 1234
```

{{< note >}}
<!-- 
You must replace the `<CA_BUNDLE>` in the above example by a valid CA bundle
which is a PEM-encoded CA bundle for validating the webhook's server certificate.
-->
你必须在以上示例中将 `<CA_BUNDLE>` 替换为一个有效的 VA 证书包，
这是一个用 PEM 编码的 CA 证书包，用于校验 Webhook 的服务器证书。
{{< /note >}}

<!--
### Side effects
-->
### 副作用{#side-effects}

<!--
Webhooks typically operate only on the content of the `AdmissionReview` sent to them.
Some webhooks, however, make out-of-band changes as part of processing admission requests.
-->
Webhook 通常仅对发送给他们的 `AdmissionReview` 内容进行操作。
但是，某些 Webhook 在处理 admission 请求时会进行带外更改。

<!--
Webhooks that make out-of-band changes ("side effects") must also have a reconciliation mechanism
(like a controller) that periodically determines the actual state of the world, and adjusts
the out-of-band data modified by the admission webhook to reflect reality.
This is because a call to an admission webhook does not guarantee the admitted object will be persisted as is, or at all.
Later webhooks can modify the content of the object, a conflict could be encountered while writing to storage,
or the server could power off before persisting the object.
-->
进行带外更改的（产生“副作用”的） Webhook 必须具有协调机制（如控制器），
该机制定期确定事物的实际状态，并调整由准入 Webhook 修改的带外数据以反映现实情况。
这是因为对准入 Webhook 的调用不能保证所准入的对象将原样保留，或根本不保留。
以后，Webhook 可以修改对象的内容，在写入存储时可能会发生冲突，
或者服务器可以在持久保存对象之前关闭电源。

<!--
Additionally, webhooks with side effects must skip those side-effects when `dryRun: true` admission requests are handled.
A webhook must explicitly indicate that it will not have side-effects when run with `dryRun`,
or the dry-run request will not be sent to the webhook and the API request will fail instead.
-->
此外，处理 `dryRun: true` admission 请求时，具有副作用的 Webhook 必须避免产生副作用。
一个 Webhook 必须明确指出在使用 `dryRun` 运行时不会有副作用，
否则 `dry-run` 请求将不会发送到该 Webhook，而 API 请求将会失败。

<!--
Webhooks indicate whether they have side effects using the `sideEffects` field in the webhook configuration:

* `None`: calling the webhook will have no side effects.
* `NoneOnDryRun`: calling the webhook will possibly have side effects, but if a request with
  `dryRun: true` is sent to the webhook, the webhook will suppress the side effects (the webhook
  is `dryRun`-aware).
-->
Webhook 使用 Webhook 配置中的 `sideEffects` 字段显示它们是否有副作用：

* `None`：调用 Webhook 没有副作用。
* `NoneOnDryRun`：调用 Webhook 可能会有副作用，但是如果将带有 `dryRun: true`
  属性的请求发送到 Webhook，则 Webhook 将抑制副作用（该 Webhook 可识别 `dryRun`）。

<!--
Here is an example of a validating webhook indicating it has no side effects on `dryRun: true` requests:
-->
这是一个 validating Webhook 的示例，表明它对 `dryRun: true` 请求没有副作用：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    sideEffects: NoneOnDryRun
```

<!--
### Timeouts
-->
### 超时{#timeouts}

<!--
Because webhooks add to API request latency, they should evaluate as quickly as possible.
`timeoutSeconds` allows configuring how long the API server should wait for a webhook to respond
before treating the call as a failure.
-->
由于 Webhook 会增加 API 请求的延迟，因此应尽快完成自身的操作。
`timeoutSeconds` 用来配置在将调用视为失败之前，允许 API 服务器等待 Webhook 响应的时间长度。

<!--
If the timeout expires before the webhook responds, the webhook call will be ignored or
the API call will be rejected based on the [failure policy](#failure-policy).

The timeout value must be between 1 and 30 seconds.

Here is an example of a validating webhook with a custom timeout of 2 seconds:
-->
如果超时在 Webhook 响应之前被触发，则基于[失败策略](#failure-policy)，将忽略
Webhook 调用或拒绝 API 调用。

超时值必须设置在 1 到 30 秒之间。

这是一个自定义超时设置为 2 秒的 validating Webhook 的示例：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
webhooks:
  - name: my-webhook.example.com
    timeoutSeconds: 2
```

<!--
The timeout for an admission webhook defaults to 10 seconds.
-->
准入 Webhook 所用的超时时间默认为 10 秒。

<!--
### Reinvocation policy
-->
### 再调用策略  {#reinvocation-policy}

<!--
A single ordering of mutating admissions plugins (including webhooks) does not work for all cases
(see https://issue.k8s.io/64333 as an example). A mutating webhook can add a new sub-structure
to the object (like adding a `container` to a `pod`), and other mutating plugins which have already
run may have opinions on those new structures (like setting an `imagePullPolicy` on all containers).
-->
变更性质的准入插件（包括 Webhook）的任何一种排序方式都不会适用于所有情况。
(参见 https://issue.k8s.io/64333 示例)。
变更性质的 Webhook 可以向对象中添加新的子结构（例如向 `pod` 中添加 `container`），
已经运行的其他修改插件可能会对这些新结构有影响
（就像在所有容器上设置 `imagePullPolicy` 一样）。

<!--
To allow mutating admission plugins to observe changes made by other plugins,
built-in mutating admission plugins are re-run if a mutating webhook modifies an object,
and mutating webhooks can specify a `reinvocationPolicy` to control whether they are reinvoked as well.
-->
要允许变更性质的准入插件感应到其他插件所做的更改，
如果变更性质的 Webhook 修改了一个对象，则会重新运行内置的变更性质的准入插件，
并且变更性质的 Webhook 可以指定 `reinvocationPolicy` 来控制是否也重新调用它们。

<!--
`reinvocationPolicy` may be set to `Never` or `IfNeeded`. It defaults to `Never`.
-->
可以将 `reinvocationPolicy` 设置为 `Never` 或 `IfNeeded`。 默认为 `Never`。

<!--
* `Never`: the webhook must not be called more than once in a single admission evaluation.
* `IfNeeded`: the webhook may be called again as part of the admission evaluation if the object
  being admitted is modified by other admission plugins after the initial webhook call.
-->
* `Never`: 在一次准入测试中，不得多次调用 Webhook。
* `IfNeeded`: 如果在最初的 Webhook 调用之后被其他对象的插件修改了被接纳的对象，
  则可以作为准入测试的一部分再次调用该 Webhook。

<!--
The important elements to note are:
-->
要注意的重要因素有：

<!--
* The number of additional invocations is not guaranteed to be exactly one.
* If additional invocations result in further modifications to the object, webhooks are not
  guaranteed to be invoked again.
* Webhooks that use this option may be reordered to minimize the number of additional invocations.
* To validate an object after all mutations are guaranteed complete, use a validating admission
  webhook instead (recommended for webhooks with side-effects).
-->
* 不能保证附加调用的次数恰好是一。
* 如果其他调用导致对该对象的进一步修改，则不能保证再次调用 Webhook。
* 使用此选项的 Webhook 可能会重新排序，以最大程度地减少额外调用的次数。
* 要在确保所有修改都完成后验证对象，请改用验证性质的 Webhook
  （推荐用于有副作用的 Webhook）。

<!--
Here is an example of a mutating webhook opting into being re-invoked if later admission plugins
modify the object:
-->
这是一个变更性质的 Webhook 的示例，该 Webhook 在以后的准入插件修改对象时被重新调用：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  reinvocationPolicy: IfNeeded
```

<!--
Mutating webhooks must be [idempotent](#idempotence), able to successfully process an object they have already admitted
and potentially modified. This is true for all mutating admission webhooks, since any change they can make
in an object could already exist in the user-provided object, but it is essential for webhooks that opt into reinvocation.
-->
变更性质的 Webhook 必须具有[幂等](#idempotence)性，
并且能够成功处理已被接纳并可能被修改的对象的变更性质的 Webhook。
对于所有变更性质的准入 Webhook 都是如此，
因为它们可以在对象中进行的任何更改可能已经存在于用户提供的对象中，但是对于选择重新调用的 Webhook
来说是必不可少的。

<!--
### Failure policy
-->
### 失败策略 {#failure-policy}

<!--
`failurePolicy` defines how unrecognized errors and timeout errors from the admission webhook
are handled. Allowed values are `Ignore` or `Fail`.

* `Ignore` means that an error calling the webhook is ignored and the API request is allowed to continue.
* `Fail` means that an error calling the webhook causes the admission to fail and the API request to be rejected.

Here is a mutating webhook configured to reject an API request if errors are encountered calling the admission webhook:
-->
`failurePolicy` 定义了如何处理准入 Webhook 中无法识别的错误和超时错误。允许的值为 `Ignore` 或 `Fail`。

* `Ignore` 表示调用 Webhook 的错误将被忽略并且允许 API 请求继续。
* `Fail` 表示调用 Webhook 的错误导致准入失败并且 API 请求被拒绝。

这是一个变更性质的 Webhook，配置为在调用准入 Webhook 遇到错误时拒绝 API 请求：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
webhooks:
- name: my-webhook.example.com
  failurePolicy: Fail
```

<!--
The default `failurePolicy` for an admission webhooks is `Fail`.
-->
准入 Webhook 所用的默认 `failurePolicy` 是 `Fail`。

<!--
## Monitoring admission webhooks
-->
## 监控 Admission Webhook    {#monitoring-admission-webhooks}

<!--
The API server provides ways to monitor admission webhook behaviors. These
monitoring mechanisms help cluster admins to answer questions like:

1. Which mutating webhook mutated the object in a API request?

2. What change did the mutating webhook applied to the object?

3. Which webhooks are frequently rejecting API requests? What's the reason for a rejection?
-->
API 服务器提供了监视准入 Webhook 行为的方法。这些监视机制可帮助集群管理员回答以下问题：

1. 哪个变更性质的 Webhook 改变了 API 请求中的对象？
2. 变更性质的 Webhook 对对象做了哪些更改？
3. 哪些 Webhook 经常拒绝 API 请求？是什么原因拒绝？

<!--
### Mutating webhook auditing annotations
-->
### Mutating Webhook 审计注解 {#mutating-webhook-auditing-annotations}

<!--
Sometimes it's useful to know which mutating webhook mutated the object in a API request, and what change did the
webhook apply.
-->
有时，了解 API 请求中的哪个变更性质的 Webhook 使对象改变以及该 Webhook 应用了哪些更改很有用。

<!--
The Kubernetes API server performs [auditing](/docs/tasks/debug/debug-cluster/audit/) on each
mutating webhook invocation. Each invocation generates an auditing annotation
capturing if a request object is mutated by the invocation, and optionally generates an annotation
capturing the applied patch from the webhook admission response. The annotations are set in the
audit event for given request on given stage of its execution, which is then pre-processed
according to a certain policy and written to a backend.
-->
Kubernetes API 服务器针对每个变更性质的 Webhook 调用执行[审计](/zh-cn/docs/tasks/debug/debug-cluster/audit/)操作。
每个调用都会生成一个审计注解，记述请求对象是否发生改变，
可选地还可以根据 Webhook 的准入响应生成一个注解，记述所应用的修补。
针对给定请求的给定执行阶段，注解被添加到审计事件中，
然后根据特定策略进行预处理并写入后端。

<!--
The audit level of a event determines which annotations get recorded:
-->
事件的审计级别决定了要记录哪些注解：

<!--
- At `Metadata` audit level or higher, an annotation with key
- At `Metadata` audit level or higher, an annotation with key
  `mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` gets logged with JSON
  payload indicating a webhook gets invoked for given request and whether it mutated the object or not.
-->
- 在 `Metadata` 或更高审计级别上，将使用 JSON 负载记录带有键名
  `mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` 的注解，
  该注解表示针对给定请求调用了 Webhook，以及该 Webhook 是否更改了对象。

  <!--
  For example, the following annotation gets recorded for a webhook being reinvoked. The webhook is
  ordered the third in the mutating webhook chain, and didn't mutated the request object during the
  invocation.
  -->
  例如，对于正在被重新调用的某 Webhook，所记录的注解如下。
  Webhook 在 mutating Webhook 链中排在第三个位置，并且在调用期间未改变请求对象。

  ```yaml
  # 审计事件相关记录
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "mutation.webhook.admission.k8s.io/round_1_index_2": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook.example.com\",\"mutated\": false}"
          # 其他注解
          ...
      }
      # 其他字段
      ...
  }
  ```

  ```yaml
  # 反序列化的注解值
  {
      "configuration": "my-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook.example.com",
      "mutated": false
  }
  ```

  <!--
  The following annotation gets recorded for a webhook being invoked in the first round. The webhook
  is ordered the first in the mutating webhook chain, and mutated the request object during the
  invocation.
  -->
  对于在第一轮中调用的 Webhook，所记录的注解如下。
  Webhook 在 mutating Webhook 链中排在第一位，并在调用期间改变了请求对象。

  ```yaml
  # 审计事件相关记录
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "mutation.webhook.admission.k8s.io/round_0_index_0": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"mutated\": true}"
          # 其他注解
          ...
      }
      # 其他字段
      ...
  }
  ```

  ```yaml
  # 反序列化的注解值
  {
      "configuration": "my-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook-always-mutate.example.com",
      "mutated": true
  }
  ```

<!--
- At `Request` audit level or higher, an annotation with key
  `patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` gets logged with JSON payload indicating
  a webhook gets invoked for given request and what patch gets applied to the request object.
-->
- 在 `Request` 或更高审计级别上，将使用 JSON 负载记录带有键名为
  `patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` 的注解，
  该注解表明针对给定请求调用了 Webhook 以及应用于请求对象之上的修改。

  <!--
  For example, the following annotation gets recorded for a webhook being reinvoked. The webhook is ordered the fourth in the
  mutating webhook chain, and responded with a JSON patch which got applied to the request object.
  -->
  例如，以下是针对正在被重新调用的某 Webhook 所记录的注解。
  Webhook 在变更性质的 Webhook 链中排在第四，并在其响应中包含一个 JSON 补丁，
  该补丁已被应用于请求对象。

  ```yaml
  # 审计事件相关记录
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "patch.webhook.admission.k8s.io/round_1_index_3": "{\"configuration\":\"my-other-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"patch\":[{\"op\":\"add\",\"path\":\"/data/mutation-stage\",\"value\":\"yes\"}],\"patchType\":\"JSONPatch\"}"
          # 其他注解
          ...
      }
      # 其他字段
      ...
  }
  ```

  ```yaml
  # 反序列化的注解值
  {
      "configuration": "my-other-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook-always-mutate.example.com",
      "patchType": "JSONPatch",
      "patch": [
          {
              "op": "add",
              "path": "/data/mutation-stage",
              "value": "yes"
          }
      ]
  }
  ```

<!--
### Admission webhook metrics
-->
### 准入 Webhook 度量值 {#admission-webhook-metrics}

<!--
The API server  exposes Prometheus metrics from the `/metrics` endpoint, which can be used for monitoring and
diagnosing API server status. The following metrics record status related to admission webhooks.
-->
API 服务器从 `/metrics` 端点公开 Prometheus 指标，这些指标可用于监控和诊断 API 服务器状态。
以下指标记录了与准入 Webhook 相关的状态。

<!--
#### API server admission webhook rejection count
-->
#### apiserver 准入 Webhook 拒绝次数 {#api-server-admission-webhook-rejection-count}

<!--
Sometimes it's useful to know which admission webhooks are frequently rejecting API requests, and the
reason for a rejection.

The API server exposes a Prometheus counter metric recording admission webhook rejections. The
metrics are labelled to identify the causes of webhook rejection(s):
-->
有时，了解哪些准入 Webhook 经常拒绝 API 请求以及拒绝的原因是很有用的。

在 v1.16+ 中，kube-apiserver 提供了 Prometheus 计数器度量值，记录
准入 Webhook 的拒绝次数。
度量值的标签给出了 Webhook 拒绝该请求的原因：

<!--
- `name`: the name of the webhook that rejected a request.
- `operation`: the operation type of the request, can be one of `CREATE`,
  `UPDATE`, `DELETE` and `CONNECT`.
- `type`: the admission webhook type, can be one of `admit` and `validating`.
- `error_type`: identifies if an error occurred during the webhook invocation
  that caused the rejection. Its value can be one of:

  - `calling_webhook_error`: unrecognized errors or timeout errors from the admission webhook happened and the
    webhook's [Failure policy](#failure-policy) is set to `Fail`.
  - `no_error`: no error occurred. The webhook rejected the request with `allowed: false` in the admission
    response. The metrics label `rejection_code` records the `.status.code` set in the admission response.
  - `apiserver_internal_error`: an API server internal error happened.

- `rejection_code`: the HTTP status code set in the admission response when a
  webhook rejected a request.
-->
- `name`：拒绝请求 Webhook 的名称。
- `operation`：请求的操作类型可以是 `CREATE`、`UPDATE`、`DELETE` 和 `CONNECT` 其中之一。
- `type`：Admission Webhook 类型，可以是 `admit` 和 `validating` 其中之一。
- `error_type`：标识在 Webhook 调用期间是否发生了错误并且导致了拒绝。其值可以是以下之一：
  - `calling_webhook_error`：发生了来自准入 Webhook 的无法识别的错误或超时错误，
    并且 Webhook 的 [失败策略](#failure-policy) 设置为 `Fail`。
  - `no_error`：未发生错误。Webhook 在准入响应中以 `allowed: false` 值拒绝了请求。
    度量标签 `rejection_code` 记录了在准入响应中设置的 `.status.code`。
  - `apiserver_internal_error`：apiserver 发生内部错误。
- `rejection_code`：当 Webhook 拒绝请求时，在准入响应中设置的 HTTP 状态码。

<!--
Example of the rejection count metrics:
-->
拒绝计数指标示例：

```
# HELP apiserver_admission_webhook_rejection_count [ALPHA] Admission webhook rejection count, identified by name and broken out for each admission type (validating or admit) and operation. Additional labels specify an error type (calling_webhook_error or apiserver_internal_error if an error occurred; no_error otherwise) and optionally a non-zero rejection code if the webhook rejects the request with an HTTP status code (honored by the apiserver when the code is greater or equal to 400). Codes greater than 600 are truncated to 600, to keep the metrics cardinality bounded.
# TYPE apiserver_admission_webhook_rejection_count counter
apiserver_admission_webhook_rejection_count{error_type="calling_webhook_error",name="always-timeout-webhook.example.com",operation="CREATE",rejection_code="0",type="validating"} 1
apiserver_admission_webhook_rejection_count{error_type="calling_webhook_error",name="invalid-admission-response-webhook.example.com",operation="CREATE",rejection_code="0",type="validating"} 1
apiserver_admission_webhook_rejection_count{error_type="no_error",name="deny-unwanted-configmap-data.example.com",operation="CREATE",rejection_code="400",type="validating"} 13
```

<!--
## Best practices and warnings

### Idempotence
-->
## 最佳实践和警告 {#best-practices-and-warnings}

### 幂等性  {#idempotence}

<!--
An idempotent mutating admission webhook is able to successfully process an object it has already admitted
and potentially modified. The admission can be applied multiple times without changing the result beyond
the initial application.
-->
幂等的变更性质的准入 Webhook 能够成功处理已经被它接纳甚或修改的对象。
即使多次执行该准入测试，也不会产生与初次执行结果相异的结果。

<!--
#### Example of idempotent mutating admission webhooks:

1. For a `CREATE` pod request, set the field `.spec.securityContext.runAsNonRoot` of the
   pod to true, to enforce security best practices.

2. For a `CREATE` pod request, if the field `.spec.containers[].resources.limits`
   of a container is not set, set default resource limits.

3. For a `CREATE` pod request, inject a sidecar container with name `foo-sidecar` if no container
   with the name `foo-sidecar` already exists.

In the cases above, the webhook can be safely reinvoked, or admit an object that already has the fields set.
-->
#### 幂等 mutating admission Webhook 的示例： {#example-of-idempotent-mutating-admission-webhooks}

1. 对于 `CREATE` Pod 请求，将 Pod 的字段 `.spec.securityContext.runAsNonRoot`
   设置为 true，以实施安全最佳实践。
2. 对于 `CREATE` Pod 请求，如果未设置容器的字段
   `.spec.containers[].resources.limits`，设置默认资源限制值。
3. 对于 `CREATE` pod 请求，如果 Pod 中不存在名为 `foo-sidecar` 的边车容器，
   向 Pod 注入一个 `foo-sidecar` 容器。

在上述情况下，可以安全地重新调用 Webhook，或接受已经设置了字段的对象。

<!--
#### Example of non-idempotent mutating admission webhooks:
-->
#### 非幂等 mutating admission Webhook 的示例： {#example-of-non-idempotent-mutating-admission-webhooks}

<!--
1. For a `CREATE` pod request, inject a sidecar container with name `foo-sidecar`
   suffixed with the current timestamp (e.g. `foo-sidecar-19700101-000000`).

2. For a `CREATE`/`UPDATE` pod request, reject if the pod has label `"env"` set,
   otherwise add an `"env": "prod"` label to the pod.

3. For a `CREATE` pod request, blindly append a sidecar container named
   `foo-sidecar` without looking to see if there is already a `foo-sidecar`
   container in the pod.
-->
1. 对于 `CREATE` pod 请求，注入名称为 `foo-sidecar` 并带有当前时间戳的
   边车容器（例如 `foo-sidecar-19700101-000000`）。
2. 对于 `CREATE/UPDATE` pod 请求，如果容器已设置标签 `"env"` 则拒绝，
   否则将 `"env": "prod"` 标签添加到容器。
3. 对于 `CREATE` pod 请求，盲目地添加一个名为 `foo-sidecar` 的边车容器，
   而未查看 Pod 中是否已经有 `foo-sidecar` 容器。

<!--
In the first case above, reinvoking the webhook can result in the same sidecar being injected multiple times to a pod, each time
with a different container name. Similarly the webhook can inject duplicated containers if the sidecar already exists in
a user-provided pod.

In the second case above, reinvoking the webhook will result in the webhook failing on its own output.

In the third case above, reinvoking the webhook will result in duplicated containers in the pod spec, which makes
the request invalid and rejected by the API server.
-->
在上述第一种情况下，重新调用该 Webhook 可能导致同一个 Sidecar 容器
多次注入到 Pod 中，而且每次使用不同的容器名称。
类似地，如果 Sidecar 已存在于用户提供的 Pod 中，则 Webhook 可能注入重复的容器。

在上述第二种情况下，重新调用 Webhook 将导致 Webhook 自身输出失败。

在上述第三种情况下，重新调用 Webhook 将导致 Pod 规范中的容器重复，
从而使请求无效并被 API 服务器拒绝。

<!--
### Intercepting all versions of an object

It is recommended that admission webhooks should always intercept all versions of an object by setting `.webhooks[].matchPolicy`
to `Equivalent`. It is also recommended that admission webhooks should prefer registering for stable versions of resources.
Failure to intercept all versions of an object can result in admission policies not being enforced for requests in certain
versions. See [Matching requests: matchPolicy](#matching-requests-matchpolicy) for examples.
-->
### 拦截对象的所有版本 {#intercepting-all-versions-of-an-object}

建议通过将 `.webhooks[].matchPolicy` 设置为 `Equivalent`，
以确保准入 Webhooks 始终拦截对象的所有版本。
建议准入 Webhooks 应该更偏向注册资源的稳定版本。
如果无法拦截对象的所有版本，可能会导致准入策略未再某些版本的请求上执行。
有关示例，请参见[匹配请求：matchPolicy](#matching-requests-matchpolicy)。

<!--
### Availability

It is recommended that admission webhooks should evaluate as quickly as possible (typically in
milliseconds), since they add to API request latency.
It is encouraged to use a small timeout for webhooks. See [Timeouts](#timeouts) for more detail.

It is recommended that admission webhooks should leverage some format of load-balancing, to
provide high availability and performance benefits. If a webhook is running within the cluster,
you can run multiple webhook backends behind a service to leverage the load-balancing that service
supports.
-->
### 可用性   {#availability}

建议准入 Webhook 尽快完成执行（时长通常是毫秒级），因为它们会增加 API 请求的延迟。
建议对 Webhook 使用较小的超时值。有关更多详细信息，请参见[超时](#timeouts)。

建议 Admission Webhook 应该采用某种形式的负载均衡机制，以提供高可用性和高性能。
如果集群中正在运行 Webhook，则可以在服务后面运行多个 Webhook 后端，以利用该服务支持的负载均衡。

<!--
### Guaranteeing the final state of the object is seen

Admission webhooks that need to guarantee they see the final state of the object in order to enforce policy
should use a validating admission webhook, since objects can be modified after being seen by mutating webhooks.

For example, a mutating admission webhook is configured to inject a sidecar container with name
"foo-sidecar" on every `CREATE` pod request. If the sidecar *must* be present, a validating
admisson webhook should also be configured to intercept `CREATE` pod requests, and validate that a
container with name "foo-sidecar" with the expected configuration exists in the to-be-created
object.
-->

### 确保看到对象的最终状态 {#guaranteeing-the-final-state-of-the-object-is-seen}

如果某准入 Webhook 需要保证自己能够看到对象的最终状态以实施策略，
则应该使用一个验证性质的 webhook，
因为可以通过 mutating Webhook 看到对象后对其进行修改。

例如，一个变更性质的准入 Webhook 被配置为在每个 `CREATE` Pod
请求中注入一个名称为 "foo-sidecar" 的 sidecar 容器。

如果**必须**存在边车容器，则还应配置一个验证性质的准入 Webhook 以拦截
`CREATE` Pod 请求，并验证要创建的对象中是否存在具有预期配置的名称为
"foo-sidecar" 的容器。

<!--
### Avoiding deadlocks in self-hosted webhooks

A webhook running inside the cluster might cause deadlocks for its own deployment if it is configured
to intercept resources required to start its own pods.

For example, a mutating admission webhook is configured to admit `CREATE` pod requests only if a certain label is set in the
pod (e.g. `"env": "prod"`). The webhook server runs in a deployment which doesn't set the `"env"` label.
When a node that runs the webhook server pods
becomes unhealthy, the webhook deployment will try to reschedule the pods to another node. However the requests will
get rejected by the existing webhook server since the `"env"` label is unset, and the migration cannot happen.

It is recommended to exclude the namespace where your webhook is running with a
[namespaceSelector](#matching-requests-namespaceselector).
-->
### 避免自托管的 Webhooks 中出现死锁 {#avoiding-deadlocks-in-self-hosted-webhooks}

如果集群内的 Webhook 配置能够拦截启动其自己的 Pod 所需的资源，
则该 Webhook 可能导致其自身部署时发生死锁。

例如，某变更性质的准入 Webhook 配置为仅当 Pod 中设置了某个标签
（例如 `"env": "prod"`）时，才接受 `CREATE` Pod 请求。
Webhook 服务器在未设置 `"env"` 标签的 Deployment 中运行。当运行 Webhook 服务器的
容器的节点运行不正常时，Webhook 部署尝试将容器重新调度到另一个节点。
但是，由于未设置 `"env"` 标签，因此请求将被现有的 Webhook 服务器拒绝，并且调度迁移不会发生。

建议使用 [namespaceSelector](#matching-requests-namespaceselector) 排除
Webhook 所在的名字空间。

<!--
### Side effects

It is recommended that admission webhooks should avoid side effects if possible, which means the webhooks operate only on the
content of the `AdmissionReview` sent to them, and do not make out-of-band changes. The `.webhooks[].sideEffects` field should
be set to `None` if a webhook doesn't have any side effect.

If side effects are required during the admission evaluation, they must be suppressed when processing an
`AdmissionReview` object with `dryRun` set to `true`, and the `.webhooks[].sideEffects` field should be
set to `NoneOnDryRun`. See [Side effects](#side-effects) for more detail.
-->
### 副作用  {#side-effects}

建议准入 Webhook 应尽可能避免副作用，这意味着该准入 Webhook 仅对发送给他们的
`AdmissionReview` 的内容起作用，并且不要进行额外更改。
如果 Webhook 没有任何副作用，则 `.webhooks[].sideEffects` 字段应设置为
`None`。

如果在准入执行期间存在副作用，则应在处理 `dryRun` 为 `true` 的 `AdmissionReview`
对象时避免产生副作用，并且其 `.webhooks[].sideEffects` 字段应设置为
`NoneOnDryRun`。更多详细信息，请参见[副作用](#side-effects)。

<!--
### Avoiding operating on the kube-system namespace
-->
### 避免对 kube-system 名字空间进行操作 {#avoiding-operating-on-the-kube-system-namespace}

<!--
The `kube-system` namespace contains objects created by the Kubernetes system,
e.g. service accounts for the control plane components, pods like `kube-dns`.
Accidentally mutating or rejecting requests in the `kube-system` namespace may
cause the control plane components to stop functioning or introduce unknown behavior.
If your admission webhooks don't intend to modify the behavior of the Kubernetes control
plane, exclude the `kube-system` namespace from being intercepted using a
[`namespaceSelector`](#matching-requests-namespaceselector).
-->
`kube-system` 名字空间包含由 Kubernetes 系统创建的对象，
例如用于控制平面组件的服务账号，诸如 `kube-dns` 之类的 Pod 等。
意外更改或拒绝 `kube-system`
名字空间中的请求可能会导致控制平面组件停止运行或者导致未知行为发生。
如果你的准入 Webhook 不想修改 Kubernetes 控制平面的行为，请使用
[`namespaceSelector`](#matching-requests-namespaceselector)
避免拦截 `kube-system` 名字空间。
