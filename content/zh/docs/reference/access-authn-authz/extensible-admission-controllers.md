---
reviewers:
- smarterclayton
- lavalamp
- whitlockjc
- caesarxuchao
- deads2k
- liggitt
- mbohlool
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
API 服务器将尝试在其支持的列表中使用第一个版本。
如果 API 服务器不支持此列表中指定的任何版本，则此对象的验证将失败。
如果 webhook 配置依然如此，则对 we​​bhook 的调用将失败并受到失败策略的控制。

示例 admission webhook 服务器置 `ClientAuth` 字段为
[空](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/webhook/config.go#L47-L48)，
默认为 `NoClientCert` 。这意味着 webhook 服务器不会验证客户端的身份，认为其是 apiservers。
如果您需要双向 TLS 或其他方式来验证客户端，请参阅如何[验证 apiservers](#验证 apiservers)。

<!--
### Deploy the admission webhook service

The webhook server in the e2e test is deployed in the Kubernetes cluster, via
the [deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1beta1-apps).
The test also creates a [service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
as the front-end of the webhook server. See
[code](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/e2e/apimachinery/webhook.go#L227).

You may also deploy your webhooks outside of the cluster. You will need to update
your [webhook client configurations](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L247) accordingly.
-->
### 部署 admission webhook 服务

e2e 测试中的 webhook 服务器部署在 Kubernetes 集群中，通过 [deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1beta1-apps)。
该测试还创建了 [service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core) 作为 webhook 服务器的前端。 
参见[代码](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/e2e/apimachinery/webhook.go#L227)。

您还可以在集群外部署 Webhook，
这需要相应地更新 [webhook 客户端配置](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L247)。

<!--
### Configure admission webhooks on the fly

You can dynamically configure what resources are subject to what admission
webhooks via
[ValidatingWebhookConfiguration](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L84)
or
[MutatingWebhookConfiguration](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L114).

The following is an example `validatingWebhookConfiguration`, a mutating webhook
configuration is similar.
-->
### 动态配置 admission webhook

您可以通过
[ValidatingWebhookConfiguration](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L84)
或
[MutatingWebhookConfiguration](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/api/admissionregistration/v1beta1/types.go#L114)
动态配置哪些资源通过哪些 admission webhook

以下是 `validatingWebhookConfiguration` 的示例，Mutating Webhook Configuration 类似。

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
metadata:
  name: <name of this configuration object>
webhooks:
- name: <webhook name, e.g., pod-policy.example.io>
  rules:
  - apiGroups:
    - ""
    apiVersions:
    - v1
    operations:
    - CREATE
    resources:
    - pods
    scope: "Namespaced"
  clientConfig:
    service:
      namespace: <namespace of the front-end service>
      name: <name of the front-end service>
    caBundle: <pem encoded ca cert that signs the server cert used by the webhook>
  admissionReviewVersions:
  - v1beta1
  timeoutSeconds: 1
```

<!--
The scope field specifies if only cluster-scoped resources ("Cluster") or namespace-scoped
resources ("Namespaced") will match this rule. "*" means that there are no scope restrictions.

{{< note >}}
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
{{< /note >}}

{{< note >}}
Default timeout for a webhook call is 30 seconds but starting in kubernetes 1.14 you
can set the timeout and it is encouraged to use a very small timeout for webhooks.
If the webhook call times out, the request is handled according to the webhook's 
failure policy.
{{< /note >}}

When an apiserver receives a request that matches one of the `rules`, the
apiserver sends an `admissionReview` request to webhook as specified in the
`clientConfig`.

After you create the webhook configuration, the system will take a few seconds
to honor the new configuration.
-->
scope 字段指定是否只有集群范围的资源（“Cluster”）或命名空间范围的资源（“Namespaced”）才匹配此规则。 “*” 表示没有范围限制。

{{< note >}}
使用`clientConfig.service`时，服务器证书必须对`<svc_name>.<svc_namespace>.svc`有效。
{{< /note >}}

{{< note >}}
webhook 调用的默认超时为 30 秒，但从 kubernetes 1.14 开始，您可以设置超时，并鼓励对 webhook 使用非常小的超时时间。
如果 webhook 调用超时，则根据 webhook 的失败策略处理请求。
{{< /note >}}

当一个 apiserver 收到一个与 `rules` 之一匹配的请求时，apiserver 会向 `clientConfig` 中指定的 webhook 发送一个 `admissionReview` 请求。

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
### 验证 apiservers

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
    kubeConfigFile: <path-to-kubeconfig-file>
- name: MutatingAdmissionWebhook
  configuration:
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: <path-to-kubeconfig-file>
```

<!--
The schema of `admissionConfiguration` is defined
[here](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/apiserver/pkg/apis/apiserver/v1alpha1/types.go#L27).

* In the kubeConfig file, provide the credentials:
-->
`admissionConfiguration` 的 shcema 在
[这里](https://github.com/kubernetes/kubernetes/blob/v1.13.0/staging/src/k8s.io/apiserver/pkg/apis/apiserver/v1alpha1/types.go#L27).

* 在 kubeConfig 文件中，提供凭据：

```yaml
apiVersion: v1
kind: Config
users:
# DNS name of webhook service, i.e., <service name>.<namespace>.svc, or the URL
# of the webhook server.
- name: 'webhook1.ns1.svc'
  user:
    client-certificate-data: <pem encoded certificate>
    client-key-data: <pem encoded key>
# The `name` supports using * to wildmatch prefixing segments.
- name: '*.webhook-company.org'
  user:
    password: <password>
    username: <name>
# '*' is the default match.
- name: '*'
  user:
    token: <token>
```

<!--
Of course you need to set up the webhook server to handle these authentications.
-->
当然，您需要设置 webhook 服务器来处理这些身份验证。
{{% /capture %}}
