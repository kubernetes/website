---
reviewers:
- smarterclayton
- lavalamp
- caesarxuchao
- deads2k
- liggitt
- jpbetz
<!-- title: Dynamic Admission Control -->
title: 动态准入控制
content_template: templates/concept
weight: 40
---
{{% capture overview %}}

<!--
The [admission controllers documentation](/docs/reference/access-authn-authz/admission-controllers/)
introduces how to use standard, plugin-style admission controllers. However,
plugin admission controllers are not flexible enough for all use cases, due to
the following:

* They need to be compiled into kube-apiserver.
* They are only configurable when the apiserver starts up.

*Admission Webhooks* (beta in 1.9) addresses these limitations. It allows
admission controllers to be developed out-of-tree and configured at runtime.

This page describes how to use Admission Webhooks.
-->
[admission 控制器文档](/docs/reference/access-authn-authz/admission-controllers/)
介绍如何使用标准的插件式 admission 控制器。然而，
由于以下原因插件 admission 控制器对于所有用例来说都不够灵活：

* 他们需要编译到 kube-apiserver 里面。
* 它们仅在 apiserver 启动时可配置。

*Admission Webhooks*（1.9 版中的 beta）解决了这些限制。
它允许 admission 控制器能被独立开发以及在运行时配置。

本页介绍如何使用 Admission Webhooks。
{{% /capture %}}

{{% capture body %}}
<!-- ### What are admission webhooks? -->
### 什么是 admission webhook？

<!--
Admission webhooks are HTTP callbacks that receive admission requests and do
something with them. You can define two types of admission webhooks,
[validating admission Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
and
[mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
With validating admission Webhooks, you may reject requests to enforce custom
admission policies. With mutating admission Webhooks, you may change requests to
enforce custom defaults.
-->
Admission webhooks 是 HTTP 回调，它接收 admission 请求并对它们做一些事情。
您可以定义两种类型的 admission webhook，
[validating admission Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
和
[mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)。
通过 validating admission Webhook，您可以拒绝请求以执行自定义的 admission 策略。
通过 mutating admission webhook，您可以更改请求以执行自定义的默认值。

<!--
### Experimenting with admission webhooks

Admission webhooks are essentially part of the cluster control-plane. You should
write and deploy them with great caution. Please read the [user
guides](/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server) for
instructions if you intend to write/deploy production-grade admission webhooks.
In the following, we describe how to quickly experiment with admission webhooks.
-->
### 尝试 admission webhook

admission webhook 本质上是集群控制平面的一部分。 您应该非常谨慎地编写和部署它们。
如果您打算编写/部署生产级 admission webhook，请阅读[用户指南](/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server)以获取相关说明。
在下文中，我们将介绍如何快速试验 admission webhook。

<!--
### Prerequisites

* Ensure that the Kubernetes cluster is at least as new as v1.9.

* Ensure that MutatingAdmissionWebhook and ValidatingAdmissionWebhook
  admission controllers are enabled.
  [Here](/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)
  is a recommended set of admission controllers to enable in general.

* Ensure that the admissionregistration.k8s.io/v1beta1 API is enabled.
-->
### 先决条件

* 确保 Kubernetes 集群版本至少为 v1.9。

* 确保启用 MutatingAdmissionWebhook 和 ValidatingAdmissionWebhook 控制器。
  [这里](/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)
  是一组推荐的 admission 控制器，通常可以启用。

* 确保启用了`admissionregistration.k8s.io/v1beta1` API。

<!--
### Write an admission webhook server

Please refer to the implementation of the [admission webhook
server](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`admissionReview` requests sent by the apiservers, and sends back its decision
wrapped in `admissionResponse`.

the `admissionReview` request can have different versions (e.g. v1beta1 or `v1` in a future version).
The webhook can define what version they accept using `admissionReviewVersions` field. API server
will try to use first version in the list which it supports. If none of the versions specified
in this list supported by API server, validation will fail for this object. If the webhook
configuration has already been persisted, calls to the webhook will fail and be
subject to the failure policy.

The example admission webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/webhook/config.go#L47-L48),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly apiservers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate apiservers](#authenticate-apiservers).
-->
### 编写一个admission webhook 服务器

请参阅 Kubernetes e2e 测试中的
[admission webhook 服务器](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/webhook/main.go)实现。
 webhook 处理由 apiservers 发送的 `admissionReview` 请求，并将其决定包含在 `admissionResponse` 中发回。

`admissionReview` 请求可以有不同的版本（例如，`v1beta1` 或未来版本中的 `v1`）。
webhook 可以使用 `admissionReviewVersions` 字段定义它们接受的版本。
apiserver 将尝试在其支持的列表中使用第一个版本。
如果 apiserver 不支持此列表中指定的任何版本，则此对象的验证将失败。
如果 webhook 配置依然如此，则对 webhook 的调用将失败并受到失败策略的控制。

示例 admission webhook 服务器置 `ClientAuth` 字段为
[空](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/webhook/config.go#L47-L48)，
默认为 `NoClientCert` 。这意味着 webhook 服务器不会验证客户端的身份，认为其是 apiservers。
如果您需要双向 TLS 或其他方式来验证客户端，请参阅如何 [验证-apiservers](#验证-apiservers)。

<!--
### Deploy the admission webhook service

The webhook server in the e2e test is deployed in the Kubernetes cluster, via
the [deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps).
The test also creates a [service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
as the front-end of the webhook server. See
[code](https://github.com/kubernetes/kubernetes/blob/v1.15.0/test/e2e/apimachinery/webhook.go#L301).

You may also deploy your webhooks outside of the cluster. You will need to update
your [webhook client configurations](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L247) accordingly.
-->
### 部署 admission webhook 服务

e2e 测试中的 webhook 服务器部署在 Kubernetes 集群中，通过 [deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps)。
该测试还创建了 [service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core) 作为 webhook 服务器的前端。 
参见 [code](https://github.com/kubernetes/kubernetes/blob/v1.15.0/test/e2e/apimachinery/webhook.go#L301)。

您还可以在集群外部署 Webhook，
这需要相应地更新 [webhook 客户端配置](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L247)。

<!--
### Configure admission webhooks on the fly

You can dynamically configure what resources are subject to what admission
webhooks via
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io)
or
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io).

The following is an example `ValidatingWebhookConfiguration`, a mutating webhook configuration is similar.
See the [webhook configuration](#webhook-configuration) section for details about each config field.
-->
### 即时配置 admission webhook

您可以动态配置哪些资源需要接受什么许可通过webhooks [ValidatingWebhookConfiguration](/docs/reference/produced/kubernetes-api/{{<param "version">}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io) 要么
[MutatingWebhookConfiguration](/docs/reference/Generated/kubernetes-api/{{<param "version">}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io)。

以下是一个示例`ValidatingWebhookConfiguration`，一个变异的 webhook 配置与此类似。有关每个配置字段的详细信息，请参见 [webhook 配置](#webhook-配置)部分。

{{< tabs name="ValidatingWebhookConfiguration_example_1" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "pod-policy.example.com"
webhooks:
- name: "pod-policy.example.com"
  rules:
  - apiGroups:   [""]
    apiVersions: ["v1"]
    operations:  ["CREATE"]
    resources:   ["pods"]
    scope:       "Namespaced"
  clientConfig:
    service:
      namespace: "example-namespace"
      name: "example-service"
    caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle containing the CA that signed the webhook's serving certificate>...tLS0K"
  admissionReviewVersions: ["v1", "v1beta1"]
  sideEffects: None
  timeoutSeconds: 5
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
metadata:
  name: "pod-policy.example.com"
webhooks:
- name: "pod-policy.example.com"
  rules:
  - apiGroups:   [""]
    apiVersions: ["v1"]
    operations:  ["CREATE"]
    resources:   ["pods"]
    scope:       "Namespaced"
  clientConfig:
    service:
      namespace: "example-namespace"
      name: "example-service"
    caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle containing the CA that signed the webhook's serving certificate>...tLS0K"
  admissionReviewVersions: ["v1beta1"]
  timeoutSeconds: 5
```
{{% /tab %}}
{{< /tabs >}}

<!--
The scope field specifies if only cluster-scoped resources ("Cluster") or namespace-scoped
resources ("Namespaced") will match this rule. "*" means that there are no scope restrictions.
-->
范围字段指定是仅集群范围的资源（Cluster）还是命名空间范围的资源资源（Namespaced）将与此规则匹配。`*`表示没有范围限制。

{{< note >}}
<!--
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
-->
当使用`clientConfig.service`时，服务器证书必须对`<svc_name>.<svc_namespace> .svc`有效。

{{< /note >}}

{{< note >}}
<!--
Default timeout for a webhook call is 30 seconds but starting in kubernetes 1.14 you
can set the timeout and it is encouraged to use a very small timeout for webhooks.
If the webhook call times out, the request is handled according to the webhook's 
failure policy.
-->
Webhook 呼叫的默认超时为 30 秒，但从 kubernetes 1.14 开始，可以设置超时，因此建议对 Webhooks 使用非常小的超时。
如果 webhook 呼叫超时，则根据 webhook 的请求处理请求失败政策。
{{< /note >}}

<!--
When an apiserver receives a request that matches one of the `rules`, the
apiserver sends an `admissionReview` request to webhook as specified in the
`clientConfig`.

After you create the webhook configuration, the system will take a few seconds
to honor the new configuration.
-->

当 apiserver 收到与`rules`匹配的请求时，apiserver 根据`clientConfig`配置定向给 webhook 发送`admissionReview`请求。

创建 webhook 配置后，系统将花费几秒钟来完成新配置的生效。


<!--
### Authenticate apiservers

If your admission webhooks require authentication, you can configure the
apiservers to use basic auth, bearer token, or a cert to authenticate itself to
the webhooks. There are three steps to complete the configuration.

* When starting the apiserver, specify the location of the admission control
  configuration file via the `--admission-control-config-file` flag.

* In the admission control configuration file, specify where the
  MutatingAdmissionWebhook controller and ValidatingAdmissionWebhook controller
  should read the credentials. The credentials are stored in kubeConfig files
  (yes, the same schema that's used by kubectl), so the field name is
  `kubeConfigFile`. Here is an example admission control configuration file:
-->
### 验证-apiservers

如果您的 webhooks 需要身份验证，您可以将 apiservers 配置为使用基本身份验证，不记名令牌或证书来对 webhook 进行身份验证。
完成配置有三个步骤。

* 启动apiserver时，通过 `--admission-control-config-file` 参数指定许可控制配置文件的位置。

* 在准入控制配置文件中，指定 MutatingAdmissionWebhook 控制器和 ValidatingAdmissionWebhook 控制器应该读取凭据的位置。
凭证存储在 kubeConfig 文件中（是​​的，与 kubectl 使用的模式相同），因此字段名称为`kubeConfigFile`。 
以下是一个示例准入控制配置文件：

```yaml
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
```

<!--
The schema of `admissionConfiguration` is defined
[here](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/apiserver/pkg/apis/apiserver/v1alpha1/types.go#L27).
See the [webhook configuration](#webhook-configuration) section for details about each config field.

* In the kubeConfig file, provide the credentials:
-->
`admissionConfiguration`的 shcema 定义在 [这里](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/apiserver/pkg/apis/apiserver/v1alpha1/types.go#L27).
有关每个配置字段的详细信息，请参见 [webhook配置](#webhook-配置)部分。

* 在 kubeConfig 文件中，提供证书凭据：

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
<!--
Of course you need to set up the webhook server to handle these authentications.
-->
当然，您需要设置 webhook 服务器来处理这些身份验证。

<!--
### Request

Webhooks are sent a POST request, with `Content-Type: application/json`,
with an `AdmissionReview` API object in the `admission.k8s.io` API group
serialized to JSON as the body.

Webhooks can specify what versions of `AdmissionReview` objects they accept
with the `admissionReviewVersions` field in their configuration:
-->

### 请求

向 Webhooks 发送 POST 请求，头域带上`Content-Type:application/json`，与`admission.k8s.io` API groups 中的`AdmissionReview` API 对象一起使用
序列化为 JSON 作为主体。

Webhooks 可以指定他们接受的`AdmissionReview`对象的版本在配置中使用`admissionReviewVersions`字段：

{{< tabs name="ValidatingWebhookConfiguration_admissionReviewVersions" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  admissionReviewVersions: ["v1", "v1beta1"]
  ...
```
<!--
`admissionReviewVersions` is a required field when creating 
`admissionregistration.k8s.io/v1` webhook configurations.
Webhooks are required to support at least one `AdmissionReview`
version understood by the current and previous API server.
-->
创建时，`admissionReviewVersions`是必填字段`admissionregistration.k8s.io/v1` Webhook配置。
需要 Webhooks 支持至少一项`AdmissionReview`当前和以前的 apiserver 可以解释的版本。

{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  admissionReviewVersions: ["v1beta1"]
  ...
```
<!--
If no `admissionReviewVersions` are specified, the default when creating 
`admissionregistration.k8s.io/v1beta1` webhook configurations is `v1beta1`.
-->

如果未指定`admissionReviewVersions`，则创建时的默认值`admissionregistration.k8s.io/v1beta1` Webhook 配置为`v1beta1`。
{{% /tab %}}
{{< /tabs >}}

<!--
API servers send the first `AdmissionReview` version in the `admissionReviewVersions` list they support.
If none of the versions in the list are supported by the API server, the configuration will not be allowed to be created.
If an API server encounters a webhook configuration that was previously created and does not support any of the `AdmissionReview`
versions the API server knows how to send, attempts to call to the webhook will fail and be subject to the [failure policy](#failure-policy).

This example shows the data contained in an `AdmissionReview` object
for a request to update the `scale` subresource of an `apps/v1` `Deployment`:
-->
apiserver 在其支持的`admissionReviewVersions`列表中发送第一个`AdmissionReview`版本。如果 apiserver 不支持列表中的任何版本，则不允许创建配置。
如果 apiserver 遇到先前创建的 Webhook 配置，并且不支持任何`AdmissionReview`
apiserver 知道如何发送的版本，调用 Webhook 的尝试将失败，并受 [失败策略](#失败策略) 的约束。

此示例显示了`AdmissionReview`对象中包含的数据请求更新apps/v1 Deployment 的 scale 子资源：

{{< tabs name="AdmissionReview_request" >}}
{{% tab name="admission.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "request": {
    # Random uid uniquely identifying this admission call
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # Fully-qualified group/version/kind of the incoming object
    "kind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    # Fully-qualified group/version/kind of the resource being modified
    "resource": {"group":"apps","version":"v1","resource":"deployments"},
    # subresource, if the request is to a subresource
    "subResource": "scale",

    # Fully-qualified group/version/kind of the incoming object in the original request to the API server.
    # This only differs from `kind` if the webhook specified `matchPolicy: Equivalent` and the 
    # original request to the API server was converted to a version the webhook registered for.
    "requestKind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    # Fully-qualified group/version/kind of the resource being modified in the original request to the API server.
    # This only differs from `resource` if the webhook specified `matchPolicy: Equivalent` and the 
    # original request to the API server was converted to a version the webhook registered for.
    "requestResource": {"group":"apps","version":"v1","resource":"deployments"},
    # subresource, if the request is to a subresource
    # This only differs from `subResource` if the webhook specified `matchPolicy: Equivalent` and the 
    # original request to the API server was converted to a version the webhook registered for.
    "requestSubResource": "scale",

    # Name of the resource being modified
    "name": "my-deployment",
    # Namespace of the resource being modified, if the resource is namespaced (or is a Namespace object)
    "namespace": "my-namespace",

    # operation can be CREATE, UPDATE, DELETE, or CONNECT
    "operation": "UPDATE",

    "userInfo": {
      # Username of the authenticated user making the request to the API server
      "username": "admin",
      # UID of the authenticated user making the request to the API server
      "uid": "014fbff9a07c",
      # Group memberships of the authenticated user making the request to the API server
      "groups": ["system:authenticated","my-admin-group"],
      # Arbitrary extra info associated with the user making the request to the API server.
      # This is populated by the API server authentication layer and should be included
      # if any SubjectAccessReview checks are performed by the webhook.
      "extra": {
        "some-key":["some-value1", "some-value2"]
      }
    },

    # object is the new object being admitted.
    # It is null for DELETE operations.
    "object": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    # oldObject is the existing object.
    # It is null for CREATE and CONNECT operations.
    "oldObject": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    # options contains the options for the operation being admitted, like meta.k8s.io/v1 CreateOptions, UpdateOptions, or DeleteOptions.
    # It is null for CONNECT operations.
    "options": {"apiVersion":"meta.k8s.io/v1","kind":"UpdateOptions",...},

    # dryRun indicates the API request is running in dry run mode and will not be persisted.
    # Webhooks with side effects should avoid actuating those side effects when dryRun is true.
    # See http://k8s.io/docs/reference/using-api/api-concepts/#make-a-dry-run-request for more details.
    "dryRun": false
  }
}
```
{{% /tab %}}
{{% tab name="admission.k8s.io/v1beta1" %}}
```yaml
{
  # Deprecated in v1.16 in favor of admission.k8s.io/v1
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "request": {
    # Random uid uniquely identifying this admission call
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # Fully-qualified group/version/kind of the incoming object
    "kind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    # Fully-qualified group/version/kind of the resource being modified
    "resource": {"group":"apps","version":"v1","resource":"deployments"},
    # subresource, if the request is to a subresource
    "subResource": "scale",

    # Fully-qualified group/version/kind of the incoming object in the original request to the API server.
    # This only differs from `kind` if the webhook specified `matchPolicy: Equivalent` and the 
    # original request to the API server was converted to a version the webhook registered for.
    # Only sent by v1.15+ API servers.
    "requestKind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    # Fully-qualified group/version/kind of the resource being modified in the original request to the API server.
    # This only differs from `resource` if the webhook specified `matchPolicy: Equivalent` and the 
    # original request to the API server was converted to a version the webhook registered for.
    # Only sent by v1.15+ API servers.
    "requestResource": {"group":"apps","version":"v1","resource":"deployments"},
    # subresource, if the request is to a subresource
    # This only differs from `subResource` if the webhook specified `matchPolicy: Equivalent` and the 
    # original request to the API server was converted to a version the webhook registered for.
    # Only sent by v1.15+ API servers.
    "requestSubResource": "scale",

    # Name of the resource being modified
    "name": "my-deployment",
    # Namespace of the resource being modified, if the resource is namespaced (or is a Namespace object)
    "namespace": "my-namespace",

    # operation can be CREATE, UPDATE, DELETE, or CONNECT
    "operation": "UPDATE",

    "userInfo": {
      # Username of the authenticated user making the request to the API server
      "username": "admin",
      # UID of the authenticated user making the request to the API server
      "uid": "014fbff9a07c",
      # Group memberships of the authenticated user making the request to the API server
      "groups": ["system:authenticated","my-admin-group"],
      # Arbitrary extra info associated with the user making the request to the API server.
      # This is populated by the API server authentication layer and should be included
      # if any SubjectAccessReview checks are performed by the webhook.
      "extra": {
        "some-key":["some-value1", "some-value2"]
      }
    },

    # object is the new object being admitted.
    # It is null for DELETE operations.
    "object": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    # oldObject is the existing object.
    # It is null for CREATE and CONNECT operations (and for DELETE operations in API servers prior to v1.15.0)
    "oldObject": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    # options contains the options for the operation being admitted, like meta.k8s.io/v1 CreateOptions, UpdateOptions, or DeleteOptions.
    # It is null for CONNECT operations.
    # Only sent by v1.15+ API servers.
    "options": {"apiVersion":"meta.k8s.io/v1","kind":"UpdateOptions",...},

    # dryRun indicates the API request is running in dry run mode and will not be persisted.
    # Webhooks with side effects should avoid actuating those side effects when dryRun is true.
    # See http://k8s.io/docs/reference/using-api/api-concepts/#make-a-dry-run-request for more details.
    "dryRun": false
  }
}
```
{{% /tab %}}
{{< /tabs >}}
<!--
### Response

Webhooks respond with a 200 HTTP status code, `Content-Type: application/json`,
and a body containing an `AdmissionReview` object (in the same version they were sent),
with the `response` stanza populated, serialized to JSON.

At a minimum, the `response` stanza must contain the following fields:
* `uid`, copied from the `request.uid` sent to the webhook
* `allowed`, either set to `true` or `false`

Example of a minimal response from a webhook to allow a request:
-->
### 响应

Webhooks 会以 200 HTTP 状态代码`Content-Type：application/json`响应，以及包含`AdmissionReview`对象的xaingy（与发送的版本相同），
带有`response`节的序列，并序列化为 JSON。

`response`节至少必须包含以下字段：
*`uid`，从发送到 webhook 的`request.uid`复制而来
*`allowed`，设置为`true`或`false`

Webhook 允许请求的最简单响应示例：

{{< tabs name="AdmissionReview_response_allow" >}}
{{% tab name="admission.k8s.io/v1" %}}
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
{{% /tab %}}
{{% tab name="admission.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true
  }
}
```
{{% /tab %}}
{{< /tabs >}}
<!--
Example of a minimal response from a webhook to forbid a request:
-->
Webhook 禁止请求的最简单响应示例：

{{< tabs name="AdmissionReview_response_forbid_minimal" >}}
{{% tab name="admission.k8s.io/v1" %}}
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
{{% /tab %}}
{{% tab name="admission.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": false
  }
}
```
{{% /tab %}}
{{< /tabs >}}
<!--
When rejecting a request, the webhook can customize the http code and message returned to the user using the `status` field.
The specified status object is returned to the user.
See the [API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.14/#status-v1-meta) for details about the status type.
Example of a response to forbid a request, customizing the HTTP status code and message presented to the user:
-->
当拒绝请求时，webhook 可以使用`status`字段自定义http代码和消息体返回给用户。
指定的状态对象返回给用户。有关状态类型的详细信息，请参见 [API 文档](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.14/#status-v1-meta)。
禁止请求，定制 HTTP 状态代码和显示给用户的消息的响应示例：

{{< tabs name="AdmissionReview_response_forbid_details" >}}
{{% tab name="admission.k8s.io/v1" %}}
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
{{% /tab %}}
{{% tab name="admission.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
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
{{% /tab %}}
{{< /tabs >}}
<!--
When allowing a request, a mutating admission webhook may optionally modify the incoming object as well.
This is done using the `patch` and `patchType` fields in the response.
The only currently supported `patchType` is `JSONPatch`.
See [JSON patch](http://jsonpatch.com/) documentation for more details.
For `patchType: JSONPatch`, the `patch` field contains a base64-encoded array of JSON patch operations.

As an example, a single patch operation that would set `spec.replicas` would be `[{"op": "add", "path": "/spec/replicas", "value": 3}]`

Base64-encoded, this would be `W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`

So a webhook response to add that label would be:
-->
当允许请求时，变异接纳 Webhook 也可以选择修改传入对象。这是通过在响应中使用`patch`和`patchType`字段来完成的。
当前唯一支持的`patchType`是`JSONPatch`。有关更多详细信息，请参见 [JSON 补丁](http://jsonpatch.com/) 文档。
对于`patchType:JSONPatch`，`patch`字段包含一个以 base64 编码的 JSON 补丁操作数组。

例如，设置`spec.replicas`的单个补丁操作将是`[{"op"："add"，"path":"/spec/replicas","value":3}]]`。

以 Base64 编码，这将是`W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`

因此，添加该标签的 webhook 响应为：

{{< tabs name="AdmissionReview_response_modify" >}}
{{% tab name="admission.k8s.io/v1" %}}
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
{{% /tab %}}
{{% tab name="admission.k8s.io/v1beta1" %}}
```json
{
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "response": {
    "uid": "<value from request.uid>",
    "allowed": true,
    "patchType": "JSONPatch",
    "patch": "W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0="
  }
}
```
{{% /tab %}}
{{< /tabs >}}
<!--
## Webhook configuration

To register admission webhooks, create `MutatingWebhookConfiguration` or `ValidatingWebhookConfiguration` API objects.

Each configuration can contain one or more webhooks.
If multiple webhooks are specified in a single configuration, each should be given a unique name.
This is required in `admissionregistration.k8s.io/v1`, but strongly recommended when using `admissionregistration.k8s.io/v1beta1`,
in order to make resulting audit logs and metrics easier to match up to active configurations.

Each webhook defines the following things.
-->
## Webhook-配置

要注册 admssion webhook，请创建`MutatingWebhookConfiguration`或`ValidatingWebhookConfiguration` API 对象。

每种配置可以包含一个或多个 Web 钩子。如果在单个配置中指定了多个 webhook，则应为每个 webhook 赋予一个唯一的名称。
这在`admissionregistration.k8s.io/v1`中是必需的，但在使用`admissionregistration.k8s.io/v1beta1`时强烈建议，
为了使生成的审核日志和指标更易于与活动配置匹配。

每个 Webhook 定义以下内容。

<!--
### Matching requests: rules

Each webhook must specify a list of rules used to determine if a request to the API server should be sent to the webhook.
Each rule specifies one or more operations, apiGroups, apiVersions, and resources, and a resource scope:

* `operations` lists one or more operations to match. Can be `"CREATE"`, `"UPDATE"`, `"DELETE"`, `"CONNECT"`, or `"*"` to match all.
* `apiGroups` lists one or more API groups to match. `""` is the core API group. `"*"` matches all API groups.
* `apiVersions` lists one or more API versions to match. `"*"` matches all API versions.
* `resources` lists one or more resources to match.
    * `"*"` matches all resources, but not subresources.
    * `"*/*"` matches all resources and subresources.
    * `"pods/*"` matches all subresources of pods.
    * `"*/status"` matches all status subresources.
* `scope` specifies a scope to match. Valid values are `"Cluster"`, `"Namespaced"`, and `"*"`. Subresources match the scope of their parent resource. Supported in v1.14+. Default is `"*"`, matching pre-1.14 behavior.
    * `"Cluster"` means that only cluster-scoped resources will match this rule (Namespace API objects are cluster-scoped).
    * `"Namespaced"` means that only namespaced resources will match this rule.
    * `"*"` means that there are no scope restrictions.

If an incoming request matches one of the specified operations, groups, versions, resources, and scope for any of a webhook's rules, the request is sent to the webhook.

Here are other examples of rules that could be used to specify which resources should be intercepted.

Match `CREATE` or `UPDATE` requests to `apps/v1` and `apps/v1beta1` `deployments` and `replicasets`:
-->

### 匹配请求-规则

每个 Webhook 必须指定用于确定是否应将对 apiserver 的请求发送到 Webhook 的规则列表。
每个规则都指定一个或多个操作，apiGroups，apiVersions 和资源以及资源范围：

*`operations`列出一个或多个要匹配的操作。可以是`CREATE`，`UPDATE`，`DELETE`，`CONNECT`或 `*` 以匹配所有内容。

*`apiGroups`列出了一个或多个要匹配的 API 组。``是核心 API 组。`*` 匹配所有 API 组。

*`apiVersions`列出了一个或多个要匹配的 API 版本。`*` 匹配所有 API 版本。

*`resources`列出了一个或多个要匹配的资源。
    *`*`匹配所有资源，但不匹配子资源。
    *`*/*` 匹配所有资源和子资源。
    *`pod/*` 匹配 pod 的所有子资源。
    *`*/status` 匹配所有状态子资源。

*`scope`指定要匹配的范围。有效值为`Cluster`，`Namespaced`和 `*`。子资源匹配其父资源的范围。在 v1.14+ 中受支持。默认值为`*`，匹配 1.14 之前的行为。
    *`Cluster`表示只有群集作用域的资源才能匹配此规则（名称空间 API 对象是群集作用域的）。
    *`Namespaced`意味着只有命名空间资源才符合此规则。
    *`*` 表示没有范围限制。

如果传入请求与任何 Webhook 规则的指定操作，组，版本，资源和范围匹配，则该请求将发送到 Webhook。

以下是可用于指定应拦截哪些资源的规则的其他示例。

将`CREATE`或`UPDATE`请求匹配到`apps/v1`和`apps/v1beta1`，`deployments`和`replicasets`：

{{< tabs name="ValidatingWebhookConfiguration_rules_1" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
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
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
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
{{% /tab %}}
{{< /tabs >}}

<!--
Match create requests for all resources (but not subresources) in all API groups and versions:
-->
匹配所有 API 组和版本中的所有资源（但不包括子资源）的创建请求：

{{< tabs name="ValidatingWebhookConfiguration_rules_2" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "*"
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "*"
  ...
```
{{% /tab %}}
{{< /tabs >}}

Match update requests for all `status` subresources in all API groups and versions:

{{< tabs name="ValidatingWebhookConfiguration_rules_3" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["UPDATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*/status"]
    scope: "*"
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  rules:
  - operations: ["UPDATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*/status"]
    scope: "*"
  ...
```
{{% /tab %}}
{{< /tabs >}}

### Matching requests: objectSelector
<!--
In v1.15+, webhooks may optionally limit which requests are intercepted based on the labels of the
objects they would be sent, by specifying an `objectSelector`. If specified, the objectSelector
is evaluated against both the object and oldObject that would be sent to the webhook,
and is considered to match if either object matches the selector.

A null object (oldObject in the case of create, or newObject in the case of delete),
or an object that cannot have labels (like a `DeploymentRollback` or a `PodProxyOptions` object)
is not considered to match.

Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels.

This example shows a mutating webhook that would match a `CREATE` of any resource with the label `foo: bar`:
-->
### 匹配请求-对象选择器

在v1.15 +中，基于Web服务的标签，webhook 可以选择限制拦截哪些请求
通过指定一个 objectSelector 来发送它们的对象。如果指定，则为 objectSelector同时针对将要发送到Webhook的对象和oldObject进行评估，
并且如果两个对象中的任何一个与选择器都匹配，则视为匹配。

空对象（对于 create 而言为 oldObject，对于 delete 而言为 newObject），
或没有标签的对象（例如 DeploymentDeployRollback 或 PodProxyOptions 对象）
被认为不匹配。

仅在选择加入 Webhook 时才使用对象选择器，因为最终用户可以通过设置标签来跳过 admission Webhook。

这个例子展示了一个可变的 webhook，它将匹配带有标签`foo:bar`的任何资源的`CREATE`：

{{< tabs name="ValidatingWebhookConfiguration_example_1" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
...
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
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
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
  ...
```
{{% /tab %}}
{{< /tabs >}}
<!--
See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels for more examples of label selectors.

### Matching requests: namespaceSelector

Webhooks may optionally limit which requests for namespaced resources are intercepted,
based on the labels of the containing namespace, by specifying a `namespaceSelector`.

The `namespaceSelector` decides whether to run the webhook on a request for a namespaced resource
(or a Namespace object), based on whether the namespace's labels match the selector.
If the object itself is a namespace, the matching is performed on object.metadata.labels.
If the object is a cluster scoped resource other than a Namespace, `namespaceSelector` has no effect.

This example shows a mutating webhook that matches a `CREATE` of any namespaced resource inside a namespace
that does not have a "runlevel" label of "0" or "1":
-->
有关标签选择器的更多示例，请参见 [更多](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels)。

### 匹配请求-命名空间选择器

Webhooks 可以选择限制拦截对命名空间资源的请求，
通过指定`namespaceSelector`，基于包含名称空间的标签。

namespaceSelector 命名空间选择器决定是否在对命名空间资源的请求上运行 webhook（或命名空间对象），取决于命名空间的标签是否与选择器匹配。
如果对象本身是名称空间，则对`object.metadata.labels`执行匹配。
如果对象是除命名空间以外的群集范围内的资源，则`namespaceSelector`无效。

这个例子展示了一个可变的webhook，它匹配命名空间内任何命名空间资源的`CREATE`
没有`0`或`1`的`runlevel`标签：
{{< tabs name="MutatingWebhookConfiguration_namespaceSelector_1" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  namespaceSelector:
    matchExpressions:
    - key: runlevel
      operator: NotIn
      values: ["0","1"]
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "Namespaced"
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  namespaceSelector:
    matchExpressions:
    - key: runlevel
      operator: NotIn
      values: ["0","1"]
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "Namespaced"
  ...
```
{{% /tab %}}
{{< /tabs >}}
<!--
This example shows a validating webhook that matches a `CREATE` of any namespaced resource inside a namespace
that is associated with the "environment" of "prod" or "staging":
-->

此示例显示了一个验证 Webhook，该 Webhook 与名称空间内任何名称空间资源的`CREATE`匹配
与`产品`或`阶段`的`环境`相关联：

{{< tabs name="ValidatingWebhookConfiguration_namespaceSelector_2" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  namespaceSelector:
    matchExpressions:
    - key: environment
      operator: In
      values: ["prod","staging"]
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "Namespaced"
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  namespaceSelector:
    matchExpressions:
    - key: environment
      operator: In
      values: ["prod","staging"]
  rules:
  - operations: ["CREATE"]
    apiGroups: ["*"]
    apiVersions: ["*"]
    resources: ["*"]
    scope: "Namespaced"
  ...
```
{{% /tab %}}
{{< /tabs >}}
<!--
See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels for more examples of label selectors.

### Matching requests: matchPolicy

API servers can make objects available via multiple API groups or versions.
For example, the Kubernetes API server allows creating and modifying `Deployment` objects
via `extensions/v1beta1`, `apps/v1beta1`, `apps/v1beta2`, and `apps/v1` APIs.

For example, if a webhook only specified a rule for some API groups/versions (like `apiGroups:["apps"], apiVersions:["v1","v1beta1"]`),
and a request was made to modify the resource via another API group/version (like `extensions/v1beta1`),
the request would not be sent to the webhook.

In v1.15+, `matchPolicy` lets a webhook define how its `rules` are used to match incoming requests.
Allowed values are `Exact` or `Equivalent`.

* `Exact` means a request should be intercepted only if it exactly matches a specified rule.
* `Equivalent` means a request should be intercepted if modifies a resource listed in `rules`, even via another API group or version.

In the example given above, the webhook that only registered for `apps/v1` could use `matchPolicy`:
* `matchPolicy: Exact` would mean the `extensions/v1beta1` request would not be sent to the webhook
* `matchPolicy: Equivalent` means the `extensions/v1beta1` request would be sent to the webhook (with the objects converted to a version the webhook had specified: `apps/v1`)

Specifying `Equivalent` is recommended, and ensures that webhooks continue to intercept the 
resources they expect when upgrades enable new versions of the resource in the API server.

When a resource stops being served by the API server, it is no longer considered equivalent to other versions of that resource that are still served.
For example, deprecated `extensions/v1beta1` deployments are scheduled to stop being served by default in v1.16.
Once that occurs, a webhook with a `apiGroups:["extensions"], apiVersions:["v1beta1"], resources:["deployments"]` rule
would no longer intercept deployments created via `apps/v1` APIs. For that reason, webhooks should prefer registering
for stable versions of resources.

This example shows a validating webhook that intercepts modifications to deployments (no matter the API group or version),
and is always sent an `apps/v1` `Deployment` object:
-->

有关标签选择器的更多示例，请参见 [更多](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels)。
 
### 匹配请求-策略匹配

apiserver 可以通过多个 API 组或版本使对象可用。
例如，Kubernetes apiserver 允许创建和修改`Deployment`对象
通过 `extensions/v1beta1`，`apps/v1beta1`，`apps/v1beta2`和`apps/v1` APIs 进行。

例如，如果一个 Webhook 仅为某些`Api groups/version`指定了规则（例如`apiGroups:["apps"]`，`apiVersions:[`v1`,`v1beta1`]`），
并提出了通过另一个`Api groups/version`（例如`extensions/v1beta1`）修改资源的请求，
该请求将不会发送到 Webhook。

在 v1.15+ 中，`matchPolicy`允许 webhook 定义如何使用其`rules`匹配传入的请求。
允许的值为`Exact`或`Equivalent`。

*`Exact`表示仅当请求与指定规则完全匹配时才应拦截该请求。
*`Equivalent`表示如果修改了`rules`中列出的资源，即使通过另一个`Api groups/version`，也应拦截请求。

在上面给出的示例中，仅为`apps/v1`注册的 webhook 可以使用`matchPolicy`，`matchPolicy:Exact`表示将不会将`extensions/v1beta1`请求发送到 Webhook
*`matchPolicy:Equivalent`意味着将`extensions/v1beta1`请求发送到 webhook（将对象转换为 webhook 指定的版本：`apps/v1`）

建议指定`Equivalent`，并确保 Webhook 继续拦截他们期望在升级时启用 apiserver 中资源的新版本的资源。

当资源停止由 apiserver 提供服务时，它不再被视为等同于仍在提供服务的该资源的其他版本。
例如，计划在 v1.16 中默认停止使用已弃用的`extensions/v1beta1`部署。
一旦发生，带有`apiGroups:["extensions"]`，`apiVersions:["v1beta1"]`，`resources:["deployments"]`规则的 webhook
将不再拦截通过`apps/v1` API 创建的部署。因此，webhooks 应该更优先注册用于稳定版本的资源。

此示例显示了一个验证 Webhook，该 Webhook 拦截对部署的修改（无论 API 组或版本），
并始终会发送一个`apps/v1`部署对象：

{{< tabs name="ValidatingWebhookConfiguration_matchPolicy" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  matchPolicy: Equivalent
  rules:
  - operations: ["CREATE","UPDATE","DELETE"]
    apiGroups: ["apps"]
    apiVersions: ["v1"]
    resources: ["deployments"]
    scope: "Namespaced"
  ...
```
<!--
Admission webhooks created using `admissionregistration.k8s.io/v1` default to `Equivalent`.
-->
使用`admissionregistration.k8s.io/v1`创建的 admission webhhok 默认为`Equivalent`。

{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  matchPolicy: Equivalent
  rules:
  - operations: ["CREATE","UPDATE","DELETE"]
    apiGroups: ["apps"]
    apiVersions: ["v1"]
    resources: ["deployments"]
    scope: "Namespaced"
  ...
```
<!--
Admission webhooks created using `admissionregistration.k8s.io/v1beta1` default to `Exact`.
-->
使用`admissionregistration.k8s.io/v1beta1`创建的 admission webhhok 默认为`Exact`。
{{% /tab %}}
{{< /tabs >}}
<!--
### Contacting the webhook

Once the API server has determined a request should be sent to a webhook,
it needs to know how to contact the webhook. This is specified in the `clientConfig`
stanza of the webhook configuration.

Webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.
-->
### 调用 Webhook

apiserver 确定请求应发送到 Webhook 后，
它需要知道如何调用 Webhook。这在`clientConfig`中指定 webhook 配置的节。

可以通过 URL 或服务引用来调用 Webhooks，并且可以选择包含自定义 CA 包，以用于验证 TLS 连接。

<!--
#### URL

`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`).

The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some apiservers
(e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would 
be a layering violation). `host` may also be an IP address.

Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an apiserver which might need to make calls to this
webhook. Such installs are likely to be non-portable, i.e., not easy
to turn up in a new cluster.

The scheme must be "https"; the URL must begin with "https://".

Attempting to use a user or basic auth e.g. "user:password@" is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.

Here is an example of a mutating webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
-->
#### URL

url以标准URL形式给出webhook的位置（`scheme://host:port/path`）。

`host`不应引用集群中运行的服务；采用通过指定`service`字段来提供服务引用。主机可以通过某些 apiserver 中的外部 DNS 进行解析
（例如，`kube-apiserver`无法解析集群内 DNS 违反分层规则）。主机也可以是IP地址。

请注意，将 localhost 或 127.0.0.1 用作主机是除非您非常小心在所有主机上运行此 Webhook，否则风险很大
运行一个 apiserver 可能需要对此进行调用 webhook。这样的安装很可能是不可移植的，即不容易出现在新集群中。

方案必须为`https`； URL 必须以`https://`开头。

尝试使用用户或基本身份验证，例如不允许使用`user:password@`。片段（`#...`）和查询参数（`?...`）也不允许。

这是配置为调用 URL 的可变 Webhook 的示例（并且期望使用系统信任根来验证 TLS 证书，因此不指定 caBundle）：
{{< tabs name="MutatingWebhookConfiguration_url" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  clientConfig:
    url: "https://my-webhook.example.com:9443/my-webhook-path"
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  clientConfig:
    url: "https://my-webhook.example.com:9443/my-webhook-path"
  ...
```
{{% /tab %}}
{{< /tabs >}}
<!--
#### Service reference

The `service` stanza inside `clientConfig` is a reference to the service for this webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".

Here is an example of a mutating webhook configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle:
-->
#### 服务参考

clientConfig 内部的 service 节是对该 Webhook 服务的引用。如果 Webhook 在集群中运行，则应使用`service`而不是`url`。
服务名称空间和名称是必需的。端口是可选的，默认为 443。该路径是可选的，默认为`/`。

这是配置为在端口`1234`上调用服务的可变 Webhook 的示例在子路径`/my-path`下，并针对 ServerName 验证 TLS 连接
使用自定义 CA 包的`my-service-name.my-service-namespace.svc`：

{{< tabs name="MutatingWebhookConfiguration_service" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  clientConfig:
    caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle containing the CA that signed the webhook's serving certificate>...tLS0K"
    service:
      namespace: my-service-namespace
      name: my-service-name
      path: /my-path
      port: 1234
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  clientConfig:
    caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle containing the CA that signed the webhook's serving certificate>...tLS0K"
    service:
      namespace: my-service-namespace
      name: my-service-name
      path: /my-path
      port: 1234
  ...
```
{{% /tab %}}
{{< /tabs >}}
<!--
### Side effects

Webhooks typically operate only on the content of the `AdmissionReview` sent to them.
Some webhooks, however, make out-of-band changes as part of processing admission requests.

Webhooks that make out-of-band changes ("side effects") must also have a reconcilation mechanism
(like a controller) that periodically determines the actual state of the world, and adjusts
the out-of-band data modified by the admission webhook to reflect reality.
This is because a call to an admission webhook does not guarantee the admitted object will be persisted as is, or at all.
Later webhooks can modify the content of the object, a conflict could be encountered while writing to storage,
or the server could power off before persisting the object.

Additionally, webhooks with side effects must skip those side-effects when `dryRun: true` admission requests are handled.
A webhook must explicitly indicate that it will not have side-effects when run with `dryRun`,
or the dry-run request will not be sent to the webhook and the API request will fail instead.

Webhooks indicate whether they have side effects using the `sideEffects` field in the webhook configuration:
* `Unknown`: no information is known about the side effects of calling the webhook.
If a request with `dryRun: true` would trigger a call to this webhook, the request will instead fail, and the webhook will not be called.
* `None`: calling the webhook will have no side effects.
* `Some`: calling the webhook will possibly have side effects.
If a request with the dry-run attribute would trigger a call to this webhook, the request will instead fail, and the webhook will not be called.
* `NoneOnDryRun`: calling the webhook will possibly have side effects,
but if a request with `dryRun: true` is sent to the webhook, the webhook will suppress the side effects (the webhook is `dryRun`-aware).

Allowed values:
* In `admissionregistration.k8s.io/v1beta1`, `sideEffects` may be set to `Unknown`, `None`, `Some`, or `NoneOnDryRun`, and defaults to `Unknown`.
* In `admissionregistration.k8s.io/v1`, `sideEffects` must be set to `None` or `NoneOnDryRun`.

Here is an example of a validating webhook indicating it has no side effects on `dryRun: true` requests:
-->
### 副作用

Webhook 通常只对发送给他们的`AdmissionReview`的内容起作用。
但是，某些 Webhook 在处理接纳请求时会进行带外更改。

进行带外更改（`副作用`）的 Webhooks 也必须具有协调机制（如控制器）定期确定世界的实际状态并进行调整录入 Webhook 修改的带外数据以反映现实情况。
这是因为对 admission Webhook 的调用不能保证所准入的对象将原样保留或完全保留。后来的 webhook 可以修改对象的内容，在写入存储设备时可能会发生冲突，
否则服务器可以在持久保存对象之前关闭电源。

另外，当处理`dryRun:true`接纳请求时，具有副作用的 webhooks 必须跳过那些副作用。
一个webhook必须明确指出在使用`dryRun`运行时不会产生副作用，
否则试运行请求将不会发送到 Webhook，而 API 请求将失败。

Webhooks 使用 webhook 配置中的`sideEffects`字段指示它们是否有副作用：
*`Unknown`：未知有关调用 Webhook 的副作用的信息。
如果带有`dryRun：true`的请求将触发对该 Webhook 的调用，则该请求将失败，并且不会调用该 Webhook。
*`None`：调用 webhook 不会有副作用。
*`Some`：调用 webhook 可能会有副作用。
如果具有 dry-run 属性的请求将触发对此 Webhook 的调用，则该请求将失败，并且不会调用该 Webhook。
*`NoneOnDryRun`：调用 webhook 可能会有副作用，
但是如果将带有`dryRun:true`的请求发送到 Webhook，则该 Webhook 将抑制副作用（该 Webhook 可识别`dryRun`）。

允许值：
*在`admissionregistration.k8s.io/v1beta1`中，`sideEffects`可以设置为`Unknown`，`None`，`Some`，或者`NoneOnDryRun`，并且默认为`Unknown`。
*在`admissionregistration.k8s.io/v1`中，`sideEffects`必须设置为`None`或`NoneOnDryRun`。

这是一个验证 webhook 的示例，表明它对`dryRun:true`请求没有副作用：
{{< tabs name="ValidatingWebhookConfiguration_sideEffects" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  sideEffects: NoneOnDryRun
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  sideEffects: NoneOnDryRun
  ...
```
{{% /tab %}}
{{< /tabs >}}
<!--
### Timeouts

Because webhooks add to API request latency, they should evaluate as quickly as possible.
`timeoutSeconds` allows configuring how long the API server should wait for a webhook to respond
before treating the call as a failure.

If the timeout expires before the webhook responds, the webhook call will be ignored or 
the API call will be rejected based on the [failure policy](#failure-policy).

The timeout value must be between 1 and 30 seconds.

Here is an example of a validating webhook with a custom timeout of 2 seconds:
-->

### 超时

由于 Webhooks 会增加 API 请求的延迟，因此应尽快评估。timeoutSeconds 允许配置 apiserver 等待 Webhook 响应的时间在将通话视为失败之前。

如果超时在 Webhook 响应之前到期，则 Webhook 调用将被忽略或 API 调用将基于 [失败策略](#失败策略) 被拒绝。

超时值必须在 1 到 30 秒之间。

这是一个自定义超时为 2 秒的验证 Webhook 的示例：

{{< tabs name="ValidatingWebhookConfiguration_timeoutSeconds" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  timeoutSeconds: 2
  ...
```
<!--
Admission webhooks created using `admissionregistration.k8s.io/v1` default timeouts to 10 seconds.
-->
使用`admissionregistration.k8s.io/v1`创建的 admission Webhook 默认超时为 10 秒。
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  timeoutSeconds: 2
  ...
```
<!--
Admission webhooks created using `admissionregistration.k8s.io/v1` default timeouts to 30 seconds.
-->
使用`admissionregistration.k8s.io/v1`创建的 admission Webhook 默认超时为 30 秒。
{{% /tab %}}
{{< /tabs >}}
<!--
### Reinvocation policy

A single ordering of mutating admissions plugins (including webhooks) does not work for all cases
(see https://issue.k8s.io/64333 as an example). A mutating webhook can add a new sub-structure 
to the object (like adding a `container` to a `pod`), and other mutating plugins which have already 
run may have opinions on those new structures (like setting an `imagePullPolicy` on all containers).

In v1.15+, to allow mutating admission plugins to observe changes made by other plugins,
built-in mutating admission plugins are re-run if a mutating webhook modifies an object,
and mutating webhooks can specify a `reinvocationPolicy` to control whether they are reinvoked as well.

`reinvocationPolicy` may be set to `Never` or `IfNeeded`. It defaults to `Never`.

* `Never`: the webhook must not be called more than once in a single admission evaluation
* `IfNeeded`: the webhook may be called again as part of the admission evaluation if the object
being admitted is modified by other admission plugins after the initial webhook call.

The important elements to note are:

* The number of additional invocations is not guaranteed to be exactly one.
* If additional invocations result in further modifications to the object, webhooks are not guaranteed to be invoked again.
* Webhooks that use this option may be reordered to minimize the number of additional invocations.
* To validate an object after all mutations are guaranteed complete, use a validating admission webhook instead (recommended for webhooks with side-effects).

Here is an example of a mutating webhook opting into being re-invoked if later admission plugins modify the object:
-->
### 撤销策略

可变准入插件（包括 Webhooks）的单次订购不适用于所有情况（例如，请参见 [更多](#https://issue.k8s.io/64333)。可变的 Webhook 可以添加新的子结构
到对象（例如向`pod`中添加`container`），以及其他已经运行可能会对这些新结构有影响（例如在所有容器上设置`imagePullPolicy`）。

在 v1.15+ 中，允许准入插件观察到其他插件所做的更改，如果可变的 Webhook 修改了一个对象，则会重新运行内置的可变准入插件，
并且可变的 Webhook 可以指定`reinvocationPolicy`来控制是否也重新调用它们。

可以将`reinvocationPolicy`设置为`Never`或者`IfNeeded`. 默认为`Never`.。

*`Never`:Webhook 在一次接纳评估中不得被多次调用
*`IfNeeded`:如果对象被接纳，则可以再次调用 Webhook 作为准入评估的一部分
最初的 webhook 调用之后，其他准入插件会被修改。

要注意的重要元素是：

*附加调用的数量不能保证完全是一个。
*如果其他调用导致对该对象的进一步修改，则不能保证再次调用 webhooks。
*使用此选项的 Webhook 可能会重新排序，以最大程度地减少其他调用。
*要在所有可变都保证完成后验证对象，请改用 验证 admission Webhook（建议对有副作用的 Webhook 使用）。

这是一个可变的 webhook 选择在以后的准入插件修改对象时重新调用的示例：

{{< tabs name="MutatingWebhookConfiguration_reinvocationPolicy" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  reinvocationPolicy: IfNeeded
  ...
```
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  reinvocationPolicy: IfNeeded
  ...
```
{{% /tab %}}
{{< /tabs >}}
<!--
Mutating webhooks must be [idempotent](#idempotence), able to successfully process an object they have already admitted
and potentially modified. This is true for all mutating admission webhooks, since any change they can make
in an object could already exist in the user-provided object, but it is essential for webhooks that opt into reinvocation.

### Failure policy

`failurePolicy` defines how unrecognized errors and timeout errors from the admission webhook
are handled. Allowed values are `Ignore` or `Fail`.

* `Ignore` means that an error calling the webhook is ignored and the API request is allowed to continue.
* `Fail` means that an error calling the webhook causes the admission to fail and the API request to be rejected.

Here is a mutating webhook configured to reject an API request if errors are encountered calling the admission webhook:
-->

可变的 Webhook 必须是 [幂等](#幂等)，能够成功处理他们已经允许的对象并可能进行修改。可变的 Webhook 都是如此，因为它们可以
进行任何更改用户提供的对象中可能已经存在一个对象，但是对于选择重新调用的 Webhook 来说这是必不可少的。

### 失败策略

`failurePolicy`定义了来自 admission webhook 的无法识别的错误和超时错误被处理。允许的值为`Ignore`或者`Fail`。

*`Ignore`意味着调用 webhook 的错误将被忽略并且允许 API 请求继续。
*`Fail`表示调用 webhook 的错误导致准入失败并且 API 请求被拒绝。

这是一个变异的 Webhook，配置为在调用接纳 Webhook 遇到错误时拒绝 API 请求：

{{< tabs name="MutatingWebhookConfiguration_failurePolicy" >}}
{{% tab name="admissionregistration.k8s.io/v1" %}}
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  failurePolicy: Fail
  ...
```
<!--
Admission webhooks created using `admissionregistration.k8s.io/v1` default `failurePolicy` to `Fail`.
-->
使用`admissionregistration.k8s.io/v1`创建的 admission Webhook 将默认`failurePolicy`设置为`Fail`。
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  failurePolicy: Fail
  ...
```
<!--
Admission webhooks created using `admissionregistration.k8s.io/v1beta1` default `failurePolicy` to `Ignore`.
-->
使用`admissionregistration.k8s.io/v1`创建的 admission Webhook 将默认`failurePolicy`设置为`Ignore`。
{{% /tab %}}
{{< /tabs >}}
<!--
## Monitoring admission webhooks

The API server provides ways to monitor admission webhook behaviors. These
monitoring mechanisms help cluster admins to answer questions like:

1. Which mutating webhook mutated the object in a API request?

2. What change did the mutating webhook applied to the object?

3. Which webhooks are frequently rejecting API requests? What's the reason for a
   rejection?
-->
## 监控 Admission Webhook

apiserver 提供了监控 admission Webhook 行为的方法。这些监控机制可帮助集群管理员回答以下问题：

1. 哪个可变 webhook 使 API 请求中的对象变化？

2. 可变 webhook 应用于对象有什么变化？

3. 哪些 webhook 经常拒绝 API 请求？是什么原因拒绝？

<!--
### Mutating webhook auditing annotations

Sometimes it's useful to know which mutating webhook mutated the object in a API request, and what change did the
webhook apply.

In v1.16+, kube-apiserver performs [auditing](/docs/tasks/debug-application-cluster/audit/) on each mutating webhook
invocation. Each invocation generates an auditing annotation
capturing if a request object is mutated by the invocation, and optionally generates an annotation capturing the applied
patch from the webhook admission response. The annotations are set in the audit event for given request on given stage of
its execution, which is then pre-processed according to a certain policy and written to a backend.

The audit level of a event determines which annotations get recorded:

- At `Metadata` audit level or higher, an annotation with key
`mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` gets logged with JSON payload indicating
a webhook gets invoked for given request and whether it mutated the object or not.

For example, the following annotation gets recorded for a webhook being reinvoked. The webhook is ordered the third in the
mutating webhook chain, and didn't mutated the request object during the invocation.
-->
### 更改 Webhook 审核注释

有时候了解API要求中的哪个可变 webhook 修改了对象，以及 webhook 适用。

在 v1.16+ 中，kube-apiserver 在每个可变的 Webhook 上执行 [auditing](/docs/tasks/debug-application-cluster/audit/)调用。每次调用都会生成审核注释
捕获请求对象是否因调用而发生了变化，并可选地生成注释来捕获应用的对象来自 Webhook 接纳响应的补丁。在审核事件中为注释的给定阶段的给定请求设置注释。
它的执行，然后根据某种策略进行预处理，并写入后端。

事件的审核级别确定要记录哪些注释：

- 在`Metadata`审核级别或更高级别，带有键的注释`mutation.webhook.admission.k8s.io/round_{round idx} _index_ {order idx}`记录了 JSON 有效负载，表明
Webhook 会针对给定的请求以及是否更改了对象而被调用。

例如，对于正在被重新调用的 Webhook，记录了以下注释。Webhook 在更改 webhook 链，并且在调用期间未更改请求对象。
```yaml
# the audit event recorded
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "mutation.webhook.admission.k8s.io/round_1_index_2": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook.example.com\",\"mutated\": false}"
        # other annotations
        ...
    }
    # other fields
    ...
}
```

```yaml
# the annotation value deserialized
{
    "configuration": "my-mutating-webhook-configuration.example.com",
    "webhook": "my-webhook.example.com",
    "mutated": false
}
```

The following annotatino gets recorded for a webhook being invoked in the first round. The webhook is ordered the first in\
the mutating webhook chain, and mutated the request object during the invocation.

```yaml
# the audit event recorded
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "mutation.webhook.admission.k8s.io/round_0_index_0": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"mutated\": true}"
        # other annotations
        ...
    }
    # other fields
    ...
}
```

```yaml
# the annotation value deserialized
{
    "configuration": "my-mutating-webhook-configuration.example.com",
    "webhook": "my-webhook-always-mutate.example.com",
    "mutated": true
}
```

- At `Request` audit level or higher, an annotation with key
`patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` gets logged with JSON payload indicating
a webhook gets invoked for given request and what patch gets applied to the request object.

For example, the following annotation gets recorded for a webhook being reinvoked. The webhook is ordered the fourth in the
mutating webhook chain, and responded with a JSON patch which got applied to the request object.

```yaml
# the audit event recorded
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "patch.webhook.admission.k8s.io/round_1_index_3": "{\"configuration\":\"my-other-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"patch\":[{\"op\":\"add\",\"path\":\"/data/mutation-stage\",\"value\":\"yes\"}],\"patchType\":\"JSONPatch\"}"
        # other annotations
        ...
    }
    # other fields
    ...
}
```

```yaml
# the annotation value deserialized
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

Kube-apiserver exposes Prometheus metrics from the `/metrics` endpoint, which can be used for monitoring and
diagnosing API server status. The following metrics record status related to admission webhooks.

#### API server admission webhook rejection count

Sometimes it's useful to know which admission webhooks are frequently rejecting API requests, and the
reason for a rejection.

In v1.16+, kube-apiserver exposes a Prometheus counter metric recording admission webhook rejections. The
metrics are labelled to identify the causes of webhook rejection(s):

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

### Amission webhook 监控指标

Kube-apiserver 从`/metrics`端点公开 Prometheus 指标，可用于监控和诊断 apiserver 状态。以下指标记录与准入网络挂钩相关的状态。

#### Apiserver Admission Webhook 拒绝次数

有时，了解哪些 Admission Webhook 经常拒绝 API 请求非常有用，并且拒绝的原因。

在 v1.16+ 中，kube-apiserver 公开了 Prometheus 计数器度量记录 Admission Webhook 拒绝。度量标准被标记为识别 Webhook 拒绝的原因：

-`name`：拒绝请求 Webhook 的名称。
-`operation`：请求的操作类型，可以是`CREATE`之一，更新，删除和连接。
-`type`：Admission webhook 类型，可以是`admit`和`validating`中的一种。
-`error_type`：标识在 webhook 调用期间是否发生了错误导致了拒绝。其值可以是以下之一：
   -`calling_webhook_error`：发生了来自Admission Webhook 的无法识别的错误或超时错误，并且
   webhook 的 [失败策略](#失败策略) 设置为`Fail`。
   -`no_error`：未发生错误。Webhook 在准入中以`allowed:false`拒绝了请求响应。
   度量标签`rejection_code`记录了在准入响应中设置的`.status.code`。
   -`apiserver_internal_error`：发生 apiserver 内部错误。
-`rejection_code`：在以下情况下在准入响应中设置的 HTTP 状态代码 webhook 拒绝了请求。

<--
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

An idempotent mutating admission webhook is able to successfully process an object it has already admitted
and potentially modified. The admission can be applied multiple times without changing the result beyond
the initial application.

#### Example of idempotent mutating admission webhooks:

1. For a `CREATE` pod request, set the field `.spec.securityContext.runAsNonRoot` of the
   pod to true, to enforce security best practices.

2. For a `CREATE` pod request, if the field `.spec.containers[].resources.limits`
   of a container is not set, set default resource limits.

3. For a `CREATE` pod request, inject a sidecar container with name `foo-sidecar` if no container with the name `foo-sidecar` already exists.

In the cases above, the webhook can be safely reinvoked, or admit an object that already has the fields set.

-->

## 最佳实践和警告

### 幂等

一个幂等的可变 Admission Webhook 能够成功处理它已经被接纳的对象并可能进行修改。可以多次应用准入，而不会改变结果初始应用程序。

#### 幂等可变 Webhook 的示例：

1. 对于`CREATE` Pod 请求，请设置以下字段的`.spec.securityContext.runAsNonRoot`字段：转换为`true`，以实施安全性最佳做法。

2. 对于`CREATE` Pod 请求，如果字段`.spec.containers[].resources.limits`未设置容器的容器，请设置默认资源限制。

3. 对于`CREATE` Pod 请求，如果尚不存在名称为`foo-sidecar`的容器，则注入名称为`foo-sidecar`的边车容器。

在上述情况下，可以安全地重新调用 Webhook，或接受已设置字段的对象。

<!--
#### Example of non-idempotent mutating admission webhooks:

1. For a `CREATE` pod request, inject a sidecar container with name `foo-sidecar`
   suffixed with the current timestamp (e.g. `foo-sidecar-19700101-000000`).

2. For a `CREATE`/`UPDATE` pod request, reject if the pod has label `"env"` set,
   otherwise add an `"env": "prod"` label to the pod.

3. For a `CREATE` pod request, blindly append a sidecar container named
   `foo-sidecar` without looking to see if there is already a `foo-sidecar`
   container in the pod.

In the first case above, reinvoking the webhook can result in the same sidecar being injected multiple times to a pod, each time
with a different container name. Similarly the webhook can inject duplicated containers if the sidecar already exists in
a user-provided pod.

In the second case above, reinvoking the webhook will result in the webhook failing on its own output.

In the third case above, reinvoking the webhook will result in duplicated containers in the pod spec, which makes
the request invalid and rejected by the API server.
-->

#### 非幂等可变 Admission Webhooks 的示例：

1.对于`CREATE` pod 请求，注入一个名为`foo-sidecar`的边车容器当前时间戳后缀（例如`foo-sidecar-19700101-000000`）。

2.对于`CREATE/UPDATE` pod 请求，如果设置了标签`env`，则拒绝该请求，否则，将`env：prod`标签添加到标签组中。

3.对于`CREATE` pod 请求，附加一个名为`foo-sidecar`的 sidecar 容器而无需查看是否已经有`foo-sidecar`容器。

在上述第一种情况下，重新调用 Webhook 可能导致同一侧边车每次被多次注入 Pod 使用不同的容器名称。同样，如果 sidecar 已存在，则 webhook 可以注入重复的容器。

在上述第二种情况下，重新调用 Webhook 将导致 Webhook 自身输出失败。

在上述第三种情况下，重新调用 Webhook 将导致 pod 规范中的容器重复，这使得该请求无效，并被 apiserver 拒绝。

<!--
### Intercepting all versions of an object

It is recommended that admission webhooks should always intercept all versions of an object by setting `.webhooks[].matchPolicy`
to `Equivalent`. It is also recommended that admission webhooks should prefer registering for stable versions of resources.
Failure to intercept all versions of an object can result in admission policies not being enforced for requests in certain
versions. See [Matching requests: matchPolicy](#matching-requests-matchpolicy) for examples.
-->
### 拦截对象的所有版本

建议通过设置`.webhooks[].matchPolicy`，Admission webhooks 应该始终拦截对象的所有版本。到`Equivalent`。建议 Admission Webhook 应该优先注册资源的稳定版本。
如果未能拦截对象的所有版本，则可能导致某些请求中的请求未实施准入策略版本。有关示例，请参见 [匹配请求-策略匹配](#匹配请求-策略匹配)。

<!--
### Availability

It is recommended that admission webhooks should evaluate as quickly as possible (typically in milliseconds), since they add to API request latency.
It is encouraged to use a small timeout for webhooks. See [Timeouts](#timeouts) for more detail.

It is recommended that admission webhooks should leverage some format of load-balancing, to provide high availability and
performance benefits. If a webhook is running within the cluster, you can run multiple webhook backends behind a service
to leverage the load-balancing that service supports.
-->
### 可用性

建议 Admission webhook 尽快评估（通常以毫秒为单位），因为它们会增加 API 请求的延迟。期望对 Webhooks 使用较小的超时。有关更多详细信息，请参见 [超时](#超时)。

建议 Admission Webhook 应该利用某种形式的负载平衡，以提供高可用性和性能优势。如果群集中正在运行 Webhook，则可以在服务后面运行多个 Webhook 后端利用服务支持的负载平衡。

<!--
### Guaranteeing the final state of the object is seen

Admission webhooks that need to guarantee they see the final state of the object in order to enforce policy
should use a validating admission webhook, since objects can be modified after being seen by mutating webhooks.

For example, a mutating admission webhook is configured to inject a sidecar container with name "foo-sidecar" on every
`CREATE` pod request. If the sidecar *must* be present, a validating admisson webhook should also be configured to intercept `CREATE` pod requests, and validate
that a container with name "foo-sidecar" with the expected configuration exists in the to-be-created object.
-->

### 确保看到对象的最终状态

需要确保他们看到对象的最终状态以实施策略的 Admission Webhook 应该使用一个有效的 Admission webhook，因为可以通过更改 webhooks 看到对象后对其进行修改。

例如，一个可变 Webhook 配置为在每个容器上注入一个名称为`foo-sidecar`的边车容器。
`CREATE`pod 请求。如果*必须*提供 sidecar，则还应该配置一个有效的 Admission webhook 来拦截`CREATE` pod 请求并进行验证
在要创建的对象中存在一个具有预期配置的名称为`foo-sidecar`的容器。

<!--
### Avoiding deadlocks in self-hosted webhooks

A webhook running inside the cluster might cause deadlocks for its own deployment if it is configured
to intercept resources required to start its own pods.

For example, a mutating admission webhook is configured to admit `CREATE` pod requests only if a certain label is set in the
pod (e.g. `"env": "prod"`). The webhook server runs in a deployment which doesn't set the `"env"` label.
When a node that runs the webhook server pods
becomes unhealthy, the webhook deployment will try to reschedule the pods to another node. However the requests will
get rejected by the existing webhook server since the `"env"` label is unset, and the migration cannot happen.

It is recommended to exclude the namespace where your webhook is running with a [namespaceSelector](#matching-requests-namespaceselector).
-->
### 避免自托管的 Webhooks 中出现死锁

如果配置了群集，则在群集内运行的 Webhook 可能会导致死锁拦截启动自己的 Pod 所需的资源。

例如，可变 Admission Webhook 被配置为仅当在标签中设置了某个标签时才接纳`CREATE` pod 请求（例如`env：prod`）。Webhook 服务器在未设置`env`标签的部署中运行。
当运行 Webhook 服务器 Pod 的节点变得不正常后，webhook 部署将尝试将 Pod 重新安排到另一个节点。但是请求将
因为未设置`env`标签，所以现有的 webhook 服务器拒绝了它，并且无法进行迁移。

建议使用 [namespaceSelector](#匹配请求-命名空间选择器) 排除运行 Webhook 的名称空间。

<!--
### Side effects

It is recommended that admission webhooks should avoid side effects if possible, which means the webhooks operate only on the
content of the `AdmissionReview` sent to them, and do not make out-of-band changes. The `.webhooks[].sideEffects` field should
be set to `None` if a webhook doesn't have any side effect.

If side effects are required during the admission evaluation, they must be suppressed when processing an
`AdmissionReview` object with `dryRun` set to `true`, and the `.webhooks[].sideEffects` field should be
set to `NoneOnDryRun`. See [Side effects](#side-effects) for more detail.
-->
### Side Effects

建议 Admission Webhook 尽可能避免副作用，这意味着 Webhook 只能在发送给他们的`AdmissionReview`的内容，请勿进行带外更改。如果 Webhook 没有任何副作用，将`.webhooks[].sideEffects`字段应设置为`None`。

如果在准入评估过程中需要副作用，则在处理 AdmissionReview 对象将`DryRun`设置为`true`，并将`.webhooks[].sideEffects`字段设置为`NoneOnDryRun`。有关更多详细信息，请参见 [副作用](#副作用)。

<!--
### Avoiding operating on the kube-system namespace

The `kube-system` namespace contains objects created by the Kubernetes system,
e.g. service accounts for the control plane components, pods like `kube-dns`.
Accidentally mutating or rejecting requests in the `kube-system` namespace may
cause the control plane components to stop functioning or introduce unknown behavior.
If your admission webhooks don't intend to modify the behavior of the Kubernetes control
plane, exclude the `kube-system` namespace from being intercepted using a
[`namespaceSelector`](#matching-requests-namespaceselector).
-->

### 避免对 kube-system 名称空间进行操作

`kube-system`名称空间包含由 Kubernetes 系统创建的对象，例如服务负责控制平面组件，如`kube-dns`之类的 Pod。
意外地更改或拒绝`kube-system`名称空间中的请求导致控制平面组件停止运行或引入未知行为。
如果您的 Webhook 不打算修改控制平面上 Kubernetes 的行为，将`kube-system`命名空间排除在使用 [命名空间选择器](#匹配请求-命名空间选择器)。
{{% /capture %}}
