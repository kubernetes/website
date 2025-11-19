---
title: 動態准入控制
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
除了[內置的 admission 插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)，
准入插件可以作爲擴展獨立開發，並以運行時所設定的 Webhook 的形式運行。
此頁面描述瞭如何構建、設定、使用和監視准入 Webhook。

<!-- body -->

<!--
## What are admission webhooks?
-->
## 什麼是准入 Webhook？ {#what-are-admission-webhooks}

<!--
Admission webhooks are HTTP callbacks that receive admission requests and do
something with them. You can define two types of admission webhooks,
[validating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
and
[mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
Mutating admission webhooks are invoked first, and can modify objects sent to the API server to enforce custom defaults.
-->
准入 Webhook 是一種用於接收准入請求並對其進行處理的 HTTP 回調機制。
可以定義兩種類型的准入 Webhook，
即[驗證性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
和[變更性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)。
變更性質的准入 Webhook 會先被調用。它們可以修改發送到 API
伺服器的對象以執行自定義的設置默認值操作。

<!--
After all object modifications are complete, and after the incoming object is validated by the API server,
validating admission webhooks are invoked and can reject requests to enforce custom policies.
-->
在完成了所有對象修改並且 API 伺服器也驗證了所傳入的對象之後，
驗證性質的 Webhook 會被調用，並通過拒絕請求的方式來強制實施自定義的策略。

{{< note >}}
<!--
Admission webhooks that need to guarantee they see the final state of the object in order to enforce policy
should use a validating admission webhook, since objects can be modified after being seen by mutating webhooks.
-->
如果准入 Webhook 需要保證它們所看到的是對象的最終狀態以實施某種策略。
則應使用驗證性質的准入 Webhook，因爲對象被修改性質 Webhook 看到之後仍然可能被修改。
{{< /note >}}

<!--
## Experimenting with admission webhooks

Admission webhooks are essentially part of the cluster control-plane. You should
write and deploy them with great caution. Please read the
[user guides](/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server)
for instructions if you intend to write/deploy production-grade admission webhooks.
In the following, we describe how to quickly experiment with admission webhooks.
-->
## 嘗試准入 Webhook {#experimenting-with-admission-webhooks}

准入 Webhook 本質上是叢集控制平面的一部分。你應該非常謹慎地編寫和部署它們。
如果你打算編寫或者部署生產級准入 Webhook，
請閱讀[使用者指南](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server)以獲取相關說明。
在下文中，我們將介紹如何快速試驗准入 Webhook。

<!--
### Prerequisites

* Ensure that MutatingAdmissionWebhook and ValidatingAdmissionWebhook
  admission controllers are enabled.
  [Here](/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)
  is a recommended set of admission controllers to enable in general.

* Ensure that the `admissionregistration.k8s.io/v1` API is enabled.
-->
### 先決條件 {#prerequisites}

* 確保啓用 MutatingAdmissionWebhook 和 ValidatingAdmissionWebhook 控制器。
  [這裏](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)是一組推薦的准入控制器，
  通常可以啓用。

* 確保啓用了 `admissionregistration.k8s.io/v1` API。

<!--
### Write an admission webhook server
-->
### 編寫一個准入 Webhook 伺服器 {#write-an-admission-webhook-server}

<!--
Please refer to the implementation of the [admission webhook server](https://github.com/kubernetes/kubernetes/blob/release-1.21/test/images/agnhost/webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`AdmissionReview` request sent by the API servers, and sends back its decision
as an `AdmissionReview` object in the same version it received.
-->
請參閱 Kubernetes e2e 測試中的
[Admission Webhook 伺服器](https://github.com/kubernetes/kubernetes/blob/release-1.21/test/images/agnhost/webhook/main.go)的實現。
Webhook 處理由 API 伺服器發送的 `AdmissionReview` 請求，並且將其決定作爲
`AdmissionReview` 對象以相同版本發送回去。

<!--
See the [webhook request](#request) section for details on the data sent to webhooks.
-->
有關發送到 Webhook 的數據的詳細信息，請參閱 [Webhook 請求](#request)。

<!--
See the [webhook response](#response) section for the data expected from webhooks.
-->
要獲取來自 Webhook 的預期數據，請參閱 [Webhook 響應](#response)。

<!--
The example admission webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/images/agnhost/webhook/config.go#L38-L39),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly API servers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate API servers](#authenticate-apiservers).
-->
示例准入 Webhook 伺服器置 `ClientAuth`
字段爲[空](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/images/agnhost/webhook/config.go#L38-L39)，
默認爲 `NoClientCert` 。這意味着 Webhook 伺服器不會驗證客戶端的身份，認爲其是 API 伺服器。
如果你需要雙向 TLS 或其他方式來驗證客戶端，
請參閱如何[對 API 伺服器進行身份認證](#authenticate-apiservers)。

<!--
### Deploy the admission webhook service
-->
### 部署准入 Webhook 服務 {#deploy-the-admission-webhook-service}

<!--
The webhook server in the e2e test is deployed in the Kubernetes cluster, via
the [deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps).
The test also creates a [service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
as the front-end of the webhook server. See
[code](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/e2e/apimachinery/webhook.go#L748).
-->
e2e 測試中的 Webhook 伺服器通過
[deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps)
部署在 Kubernetes 叢集中。該測試還將創建一個
[Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
作爲 Webhook 伺服器的前端。
參見[相關代碼](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/e2e/apimachinery/webhook.go#L748)。

<!--
You may also deploy your webhooks outside of the cluster. You will need to update
your webhook configurations accordingly.
-->
你也可以在叢集外部署 Webhook。這樣做需要相應地更新你的 Webhook 設定。

<!--
### Configure admission webhooks on the fly
-->
### 即時設定准入 Webhook {#configure-admission-webhooks-on-the-fly}

<!--
You can dynamically configure what resources are subject to what admission
webhooks via
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io)
or
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io).
-->
你可以通過
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io)
或者
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io) 動態設定哪些資源要被哪些准入 Webhook 處理。

<!--
The following is an example `ValidatingWebhookConfiguration`, a mutating webhook configuration is similar.
See the [webhook configuration](#webhook-configuration) section for details about each config field.
-->
以下是一個 `ValidatingWebhookConfiguration` 示例，Mutating Webhook 設定與此類似。
有關每個設定字段的詳細信息，請參閱 [Webhook 設定](#webhook-configuration)部分。

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
你必須在以上示例中將 `<CA_BUNDLE>` 替換爲一個有效的 CA 證書包，
這是一個用 PEM 編碼的（字段值是 Base64 編碼）CA 證書包，用於校驗 Webhook 的伺服器證書。
{{< /note >}}

<!--
The `scope` field specifies if only cluster-scoped resources ("Cluster") or namespace-scoped
resources ("Namespaced") will match this rule. "&lowast;" means that there are no scope restrictions.
-->
`scope` 字段指定是僅叢集範圍的資源（Cluster）還是名字空間範圍的資源資源（Namespaced）將與此規則匹配。
`*` 表示沒有範圍限制。

{{< note >}}
<!--
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
-->
當使用 `clientConfig.service` 時，伺服器證書必須對 `<svc_name>.<svc_namespace>.svc` 有效。
{{< /note >}}

{{< note >}}
<!--
Default timeout for a webhook call is 10 seconds,
You can set the `timeout` and it is encouraged to use a short timeout for webhooks.
If the webhook call times out, the request is handled according to the webhook's
failure policy.
-->
Webhook 調用的默認超時是 10 秒，你可以設置 `timeout` 並建議對 Webhook 設置較短的超時時間。
如果 Webhook 調用超時，則根據 Webhook 的失敗策略處理請求。
{{< /note >}}

<!--
When an API server receives a request that matches one of the `rules`, the
API server sends an `admissionReview` request to webhook as specified in the
`clientConfig`.

After you create the webhook configuration, the system will take a few seconds
to honor the new configuration.
-->
當一個 API 伺服器收到與 `rules` 相匹配的請求時，
該 API 伺服器將按照 `clientConfig` 中指定的方式向 Webhook 發送一個 `admissionReview` 請求。

創建 Webhook 設定後，系統將花費幾秒鐘使新設定生效。

<!--
### Authenticate API servers   {#authenticate-apiservers}
-->
### 對 API 伺服器進行身份認證 {#authenticate-apiservers}

<!--
If your admission webhooks require authentication, you can configure the
API servers to use basic auth, bearer token, or a cert to authenticate itself to
the webhooks. There are three steps to complete the configuration.
-->
如果你的 Webhook 需要身份驗證，則可以將 API 伺服器設定爲使用基本身份驗證、持有者令牌或證書來向
Webhook 提供身份證明。完成此設定需要三個步驟。

<!--
* When starting the API server, specify the location of the admission control
  configuration file via the `--admission-control-config-file` flag.

* In the admission control configuration file, specify where the
  MutatingAdmissionWebhook controller and ValidatingAdmissionWebhook controller
  should read the credentials. The credentials are stored in kubeConfig files
  (yes, the same schema that's used by kubectl), so the field name is
  `kubeConfigFile`. Here is an example admission control configuration file:
-->
* 啓動 API 伺服器時，通過 `--admission-control-config-file` 參數指定準入控制設定文件的位置。

* 在准入控制設定文件中，指定 MutatingAdmissionWebhook 控制器和 ValidatingAdmissionWebhook 控制器應該讀取憑據的位置。
  憑證存儲在 kubeConfig 文件中（是​​的，與 kubectl 使用的模式相同），因此字段名稱爲 `kubeConfigFile`。
  以下是一個准入控制設定文件示例：

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
# 1.17 中被棄用，推薦使用 apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    # 1.17 中被棄用，推薦使用 apiserver.config.k8s.io/v1，kind = WebhookAdmissionConfiguration
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    # 1.17 中被棄用，推薦使用 apiserver.config.k8s.io/v1，kind = WebhookAdmissionConfiguration
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
有關 `AdmissionConfiguration` 的更多信息，請參見
[AdmissionConfiguration (v1) reference](/zh-cn/docs/reference/config-api/apiserver-webhookadmission.v1/)。
有關每個設定字段的詳細信息，請參見 [Webhook 設定](#webhook-設定)部分。

在 kubeConfig 文件中，提供證書憑據：

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
# name 應設置爲服務的 DNS 名稱或配置了 Webhook 的 URL 的主機名（包括端口）。
# 如果將非 443 端口用於服務，則在配置 1.16+ API 伺服器時，該端口必須包含在名稱中。
#
# 對於配置在默認端口（443）上與服務對話的 Webhook，請指定服務的 DNS 名稱：
# - name: webhook1.ns1.svc
#   user: ...
#
# 對於配置在非默認端口（例如 8443）上與服務對話的 Webhook，請在 1.16+ 中指定服務的 DNS 名稱和端口：
# - name: webhook1.ns1.svc:8443
#   user: ...
# 並可以選擇僅使用服務的 DNS 名稱來創建第二節，以與 1.15 API 伺服器版本兼容：
# - name: webhook1.ns1.svc
#   user: ...
#
# 對於配置爲使用 URL 的 Webhook，請匹配在 Webhook 的 URL 中指定的主機（和端口）。
# 帶有 `url: https://www.example.com` 的 Webhook：
# - name: www.example.com
#   user: ...
#
# 帶有 `url: https://www.example.com:443` 的 Webhook：
# - name: www.example.com:443
#   user: ...
#
# 帶有 `url: https://www.example.com:8443` 的 Webhook：
# - name: www.example.com:8443
#   user: ...
#
- name: 'webhook1.ns1.svc'
  user:
    client-certificate-data: "<pem encoded certificate>"
    client-key-data: "<pem encoded key>"
# `name` 支持使用 * 通配符匹配前綴段。
- name: '*.webhook-company.org'
  user:
    password: "<password>"
    username: "<name>"
# '*' 是默認匹配項。
- name: '*'
  user:
    token: "<token>"
```

<!--
Of course you need to set up the webhook server to handle these authentication requests.
-->
當然，你需要設置 Webhook 伺服器來處理這些身份驗證請求。

<!--
## Webhook request and response
-->
## Webhook 請求與響應 {#webhook-request-and-response}

<!--
### Request

Webhooks are sent as POST requests, with `Content-Type: application/json`,
with an `AdmissionReview` API object in the `admission.k8s.io` API group
serialized to JSON as the body.

Webhooks can specify what versions of `AdmissionReview` objects they accept
with the `admissionReviewVersions` field in their configuration:
-->
### 請求 {#request}

Webhook 發送 POST 請求時，請設置 `Content-Type: application/json` 並對 `admission.k8s.io` API
組中的 `AdmissionReview` 對象進行序列化，將所得到的 JSON 作爲請求的主體。

Webhook 可以在設定中的 `admissionReviewVersions` 字段指定可接受的 `AdmissionReview` 對象版本：

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
創建 Webhook 設定時，`admissionReviewVersions` 是必填字段。
Webhook 必須支持至少一個當前和以前的 API 伺服器都可以解析的 `AdmissionReview` 版本。

<!--
API servers send the first `AdmissionReview` version in the `admissionReviewVersions` list they support.
If none of the versions in the list are supported by the API server, the configuration will not be allowed to be created.
If an API server encounters a webhook configuration that was previously created and does not support any of the `AdmissionReview`
versions the API server knows how to send, attempts to call to the webhook will fail and be subject to the [failure policy](#failure-policy).

This example shows the data contained in an `AdmissionReview` object
for a request to update the `scale` subresource of an `apps/v1` `Deployment`:
-->
API 伺服器將發送的是 `admissionReviewVersions` 列表中所支持的第一個 `AdmissionReview` 版本。
如果 API 伺服器不支持列表中的任何版本，則不允許創建設定。

如果 API 伺服器遇到以前創建的 Webhook 設定，並且不支持該 API 伺服器知道如何發送的任何
`AdmissionReview` 版本，則調用 Webhook 的嘗試將失敗，並依據[失敗策略](#failure-policy)進行處理。

此示例顯示了 `AdmissionReview` 對象中包含的數據，該數據用於請求更新 `apps/v1` `Deployment` 的 `scale` 子資源：

<!--
```
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "request": {
    # Random uid uniquely identifying this admission call
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # Fully-qualified group/version/kind of the incoming object
    "kind": {
      "group": "autoscaling",
      "version": "v1",
      "kind": "Scale"
    },

    # Fully-qualified group/version/kind of the resource being modified
    "resource": {
      "group": "apps",
      "version": "v1",
      "resource": "deployments"
    },

    # Subresource, if the request is to a subresource
    "subResource": "scale",

    # Fully-qualified group/version/kind of the incoming object in the original request to the API server
    # This only differs from `kind` if the webhook specified `matchPolicy: Equivalent` and the original
    # request to the API server was converted to a version the webhook registered for
    "requestKind": {
      "group": "autoscaling",
      "version": "v1",
      "kind": "Scale"
    },

    # Fully-qualified group/version/kind of the resource being modified in the original request to the API server
    # This only differs from `resource` if the webhook specified `matchPolicy: Equivalent` and the original
    # request to the API server was converted to a version the webhook registered for
    "requestResource": {
      "group": "apps",
      "version": "v1",
      "resource": "deployments"
    },

    # Subresource, if the request is to a subresource
    # This only differs from `subResource` if the webhook specified `matchPolicy: Equivalent` and the original
    # request to the API server was converted to a version the webhook registered for
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
      "groups": [
        "system:authenticated",
        "my-admin-group"
      ],

      # Arbitrary extra info associated with the user making the request to the API server
      # This is populated by the API server authentication layer
      "extra": {
        "some-key": [
          "some-value1",
          "some-value2"
        ]
      }
    },

    # object is the new object being admitted. It is null for DELETE operations
    "object": {
      "apiVersion": "autoscaling/v1",
      "kind": "Scale"
    },

    # oldObject is the existing object. It is null for CREATE and CONNECT operations
    "oldObject": {
      "apiVersion": "autoscaling/v1",
      "kind": "Scale"
    },

    # options contain the options for the operation being admitted, like meta.k8s.io/v1 CreateOptions,
    # UpdateOptions, or DeleteOptions. It is null for CONNECT operations
    "options": {
      "apiVersion": "meta.k8s.io/v1",
      "kind": "UpdateOptions"
    },

    # dryRun indicates the API request is running in dry run mode and will not be persisted
    # Webhooks with side effects should avoid actuating those side effects when dryRun is true
    "dryRun": false
  }
}
```
-->
```
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "request": {
    # 唯一標識此准入回調的隨機 uid
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # 傳入完全限定的 group/version/kind 對象
    "kind": {
      "group": "autoscaling",
      "version": "v1",
      "kind": "Scale"
    },

    # 修改 resource 的完全限定 group/version/kind
    "resource": {
      "group": "apps",
      "version": "v1",
      "resource": "deployments"
    },

    # subResource（如果請求是針對 subResource 的）
    "subResource": "scale",

    # 在對 API 伺服器的原始請求中，傳入對象的標準 group/version/kind
    # 僅當 Webhook 指定 `matchPolicy: Equivalent` 且將對 API 伺服器的原始請求
    # 轉換爲 Webhook 註冊的版本時，這一字段的取值纔會與 `kind` 不同。
    "requestKind": {
      "group": "autoscaling",
      "version": "v1",
      "kind": "Scale"
    },

    # 在原始請求中向 API 伺服器修改的資源的標準 group/version/kind
    # 如果 Webhook 指定了 `matchPolicy: Equivalent`，且原始請求被轉換爲
    # Webhook 註冊的版本，則此值與 `resource` 不同。
    "requestResource": {
      "group": "apps",
      "version": "v1",
      "resource": "deployments"
    },

    # subResource（如果請求是針對 subResource 的）
    # 僅當 Webhook 指定了 `matchPolicy：Equivalent` 並且將對
    # API 伺服器的原始請求轉換爲該 Webhook 註冊的版本時，此值才與 `subResource` 不同。
    "requestSubResource": "scale",

    # 被修改資源的名稱
    "name": "my-deployment",

    # 如果資源名字空間作用域的（或者是名字空間對象），則這是被修改資源的名字空間
    "namespace": "my-namespace",

    # operation 可以是 CREATE、UPDATE、DELETE 或 CONNECT
    "operation": "UPDATE",

    "userInfo": {
      # 向 API 伺服器發出請求的經過身份驗證的用戶的用戶名
      "username": "admin",

      # 向 API 伺服器發出請求的經過身份驗證的用戶的 UID
      "uid": "014fbff9a07c",

      # 向 API 伺服器發出請求的經過身份驗證的用戶的組成員身份
      "groups": [
        "system:authenticated",
        "my-admin-group"
      ],

      # 向 API 伺服器發出請求的用戶相關的任意附加信息
      # 該字段由 API 伺服器身份驗證層填充，並且如果 webhook 執行了任何
      # SubjectAccessReview 檢查，則應將其包括在內。
      "extra": {
        "some-key": [
          "some-value1",
          "some-value2"
        ]
      }
    },

    # object 是被接納的新對象。
    # 對於 DELETE 操作，它爲 null。
    "object": {
      "apiVersion": "autoscaling/v1",
      "kind": "Scale"
    },

    # oldObject 是現有對象。
    # 對於 CREATE 和 CONNECT 操作，它爲 null。
    "oldObject": {
      "apiVersion": "autoscaling/v1",
      "kind": "Scale"
    },

    # options 包含要接受的操作的選項，例如 meta.k8s.io/v CreateOptions、UpdateOptions 或 DeleteOptions。
    # 對於 CONNECT 操作，它爲 null。
    "options": {
      "apiVersion": "meta.k8s.io/v1",
      "kind": "UpdateOptions"
    },

    # dryRun 表示 API 請求正在以 `dryrun` 模式運行，並且被持久化。
    # 帶有副作用的 Webhook 應該避免在 dryRun 爲 true 時激活這些副作用。
    "dryRun": false
  }
}
```

<!--
### Response
-->
### 響應   {#response}

<!--
Webhooks respond with a 200 HTTP status code, `Content-Type: application/json`,
and a body containing an `AdmissionReview` object (in the same version they were sent),
with the `response` stanza populated, serialized to JSON.
-->
Webhook 使用 HTTP 200 狀態碼、`Content-Type: application/json` 和一個包含 `AdmissionReview` 對象的 JSON 序列化格式來發送響應。該 `AdmissionReview` 對象與發送的版本相同，且其中包含的 `response` 字段已被有效填充。

<!--
At a minimum, the `response` stanza must contain the following fields:

* `uid`, copied from the `request.uid` sent to the webhook
* `allowed`, either set to `true` or `false`
-->
`response` 至少必須包含以下字段：

* `uid`，從發送到 Webhook 的 `request.uid` 中複製而來
* `allowed`，設置爲 `true` 或 `false`

<!--
Example of a minimal response from a webhook to allow a request:
-->
Webhook 允許請求的最簡單響應示例：

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
Webhook 禁止請求的最簡單響應示例：

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
當拒絕請求時，Webhook 可以使用 `status` 字段自定義 http 響應碼和返回給使用者的消息。
有關狀態類型的詳細信息，請參見
[API 文檔](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#status-v1-meta)。
禁止請求的響應示例，它定製了向使用者顯示的 HTTP 狀態碼和消息：

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
當允許請求時，mutating准入 Webhook 也可以選擇修改傳入的對象。
這是通過在響應中使用 `patch` 和 `patchType` 字段來完成的。
當前唯一支持的 `patchType` 是 `JSONPatch`。
有關更多詳細信息，請參見 [JSON patch](https://jsonpatch.com/)。
對於 `patchType: JSONPatch`，`patch` 字段包含一個以 base64 編碼的 JSON patch 操作數組。

<!--
As an example, a single patch operation that would set `spec.replicas` would be
`[{"op": "add", "path": "/spec/replicas", "value": 3}]`

Base64-encoded, this would be `W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`
-->
例如，設置 `spec.replicas` 的單個補丁操作將是
`[{"op": "add", "path": "/spec/replicas", "value": 3}]`。

如果以 Base64 形式編碼，結果將是
`W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`

<!--
So a webhook response to add that label would be:
-->
因此，添加該標籤的 Webhook 響應爲：

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
准入 Webhook 可以選擇性地返回在 HTTP `Warning` 頭中返回給請求客戶端的警告消息，警告代碼爲 299。
警告可以與允許或拒絕的准入響應一起發送。

<!--
If you're implementing a webhook that returns a warning:

* Don't include a "Warning:" prefix in the message
* Use warning messages to describe problems the client making the API request should correct or be aware of
* Limit warnings to 120 characters if possible
-->
如果你正在實現返回一條警告的 Webhook，則：

* 不要在消息中包括 "Warning:" 前綴
* 使用警告消息描述該客戶端進行 API 請求時會遇到或應意識到的問題
* 如果可能，將警告限制爲 120 個字符

{{< caution >}}
<!-- 
Individual warning messages over 256 characters may be truncated by the API server before being returned to clients.
If more than 4096 characters of warning messages are added (from all sources), additional warning messages are ignored.
-->
超過 256 個字符的單條警告消息在返回給客戶之前可能會被 API 伺服器截斷。
如果超過 4096 個字符的警告消息（來自所有來源），則額外的警告消息會被忽略。
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
## Webhook 設定   {#webhook-configuration}

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
要註冊准入 Webhook，請創建 `MutatingWebhookConfiguration` 或 `ValidatingWebhookConfiguration` API 對象。
`MutatingWebhookConfiguration` 或`ValidatingWebhookConfiguration` 對象的名稱必須是有效的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

每種設定可以包含一個或多個 Webhook。如果在單個設定中指定了多個
Webhook，則應爲每個 Webhook 賦予一個唯一的名稱。
這是必需的，以使生成的審計日誌和指標更易於與激活的設定相匹配。

每個 Webhook 定義以下內容。

<!--
### Matching requests: rules
-->
### 匹配請求-規則   {#matching-requests-rules}

<!--
Each webhook must specify a list of rules used to determine if a request to the API server should be sent to the webhook.
Each rule specifies one or more operations, apiGroups, apiVersions, and resources, and a resource scope:
-->
每個 Webhook 必須指定用於確定是否應將對 apiserver 的請求發送到 Webhook 的規則列表。
每個規則都指定一個或多個 operations、apiGroups、apiVersions 和 resources 以及資源的 scope：

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
* `operations` 列出一個或多個要匹配的操作。
  可以是 `CREATE`、`UPDATE`、`DELETE`、`CONNECT` 或 `*` 以匹配所有內容。
* `apiGroups` 列出了一個或多個要匹配的 API 組。`""` 是核心 API 組。`"*"` 匹配所有 API 組。
* `apiVersions` 列出了一個或多個要匹配的 API 版本。`"*"` 匹配所有 API 版本。
* `resources` 列出了一個或多個要匹配的資源。

  * `"*"` 匹配所有資源，但不包括子資源。
  * `"*/*"` 匹配所有資源，包括子資源。
  * `"pods/*"` 匹配 pod 的所有子資源。
  * `"*/status"` 匹配所有 status 子資源。

* `scope` 指定要匹配的範圍。有效值爲 `"Cluster"`、`"Namespaced"` 和 `"*"`。
  子資源匹配其父資源的範圍。默認值爲 `"*"`。

  * `"Cluster"` 表示只有叢集作用域的資源才能匹配此規則（API 對象 Namespace 是叢集作用域的）。
  * `"Namespaced"` 意味着僅具有名字空間的資源才符合此規則。
  * `"*"` 表示沒有作用域限制。

<!--
If an incoming request matches one of the specified `operations`, `groups`, `versions`,
`resources`, and `scope` for any of a webhook's `rules`, the request is sent to the webhook.

Here are other examples of rules that could be used to specify which resources should be intercepted.

Match `CREATE` or `UPDATE` requests to `apps/v1` and `apps/v1beta1` `deployments` and `replicasets`:
-->
如果傳入請求與任何 Webhook `rules` 的指定 `operations`、`groups`、`versions`、
`resources` 和 `scope` 匹配，則該請求將發送到 Webhook。

以下是可用於指定應攔截哪些資源的規則的其他示例。

匹配針對 `apps/v1` 和 `apps/v1beta1` 組中 `deployments` 和 `replicasets`
資源的 `CREATE` 或 `UPDATE` 請求：

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
匹配所有 API 組和版本中的所有資源（但不包括子資源）的創建請求：

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
匹配所有 API 組和版本中所有 `status` 子資源的更新請求：

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
### 匹配請求：objectSelector {#matching-requests-objectselector}

<!--
Webhooks may optionally limit which requests are intercepted based on the labels of the
objects they would be sent, by specifying an `objectSelector`. If specified, the objectSelector
is evaluated against both the object and oldObject that would be sent to the webhook,
and is considered to match if either object matches the selector.
-->
通過指定 `objectSelector`，Webhook 能夠根據可能發送的對象的標籤來限制哪些請求被攔截。
如果指定，則將對 `objectSelector` 和可能發送到 Webhook 的 object 和 oldObject
進行評估。如果兩個對象之一與選擇算符匹配，則認爲該請求已匹配。

<!--
A null object (`oldObject` in the case of create, or `newObject` in the case of delete),
or an object that cannot have labels (like a `DeploymentRollback` or a `PodProxyOptions` object)
is not considered to match.
-->
空對象（對於創建操作而言爲 `oldObject`，對於刪除操作而言爲 `newObject`），
或不能帶標籤的對象（例如 `DeploymentRollback` 或 `PodProxyOptions` 對象）
被認爲不匹配。

<!--
Use the object selector only if the webhook is opt-in, because end users may skip
the admission webhook by setting the labels.
-->
僅當選擇使用 Webhook 時才使用對象選擇器，因爲最終使用者可以通過設置標籤來
跳過准入 Webhook。

<!--
This example shows a mutating webhook that would match a `CREATE` of any resource (but not subresources) with the label `foo: bar`:
-->
這個例子展示了一個變更性質的 Webhook，它將匹配帶有標籤 `foo:bar` 的所有資源（但不包括子資源）的
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
有關標籤選擇算符的更多示例，請參見[標籤的概念](/zh-cn/docs/concepts/overview/working-with-objects/labels)。

<!--
### Matching requests: namespaceSelector
-->
### 匹配請求：namespaceSelector {#matching-requests-namespaceselector}

<!--
Webhooks may optionally limit which requests for namespaced resources are intercepted,
based on the labels of the containing namespace, by specifying a `namespaceSelector`.
-->
通過指定 `namespaceSelector`，
Webhook 可以根據具有名字空間的資源所處的名字空間的標籤來選擇攔截哪些資源的操作。

<!--
The `namespaceSelector` decides whether to run the webhook on a request for a namespaced resource
(or a Namespace object), based on whether the namespace's labels match the selector.
If the object itself is a namespace, the matching is performed on object.metadata.labels.
If the object is a cluster scoped resource other than a Namespace, `namespaceSelector` has no effect.
-->
`namespaceSelector` 根據名字空間的標籤是否匹配選擇算符，決定是否針對具名字空間的資源
（或 Namespace 對象）的請求運行 Webhook。
如果對象是除 Namespace 以外的叢集範圍的資源，則 `namespaceSelector` 標籤無效。

<!--
This example shows a mutating webhook that matches a `CREATE` of any namespaced resource inside a namespace
that does not have a "runlevel" label of "0" or "1":
-->
本例給出的變更性質的 Webhook 將匹配到對名字空間中具名字空間的資源的 `CREATE` 請求，
前提是這些資源不含值爲 "0" 或 "1" 的 "runlevel" 標籤：

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
此示例顯示了一個驗證性質的 Webhook，它將匹配到對某名字空間中的任何具名字空間的資源的
`CREATE` 請求，前提是該名字空間具有值爲 "prod" 或 "staging" 的 "environment" 標籤：

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
有關標籤選擇算符的更多示例，
請參見[標籤的概念](/zh-cn/docs/concepts/overview/working-with-objects/labels)。

<!--
### Matching requests: matchPolicy
-->
### 匹配請求：matchPolicy {#matching-requests-matchpolicy}

<!--
API servers can make objects available via multiple API groups or versions.
-->
API 伺服器可以通過多個 API 組或版本來提供對象。

<!--
For example, if a webhook only specified a rule for some API groups/versions
(like `apiGroups:["apps"], apiVersions:["v1","v1beta1"]`),
and a request was made to modify the resource via another API group/version (like `extensions/v1beta1`),
the request would not be sent to the webhook.
-->
例如，如果一個 Webhook 僅爲某些 API 組/版本指定了規則（例如
`apiGroups:["apps"], apiVersions:["v1","v1beta1"]`），而修改資源的請求是通過另一個
API 組/版本（例如 `extensions/v1beta1`）發出的，該請求將不會被髮送到 Webhook。

<!--
The `matchPolicy` lets a webhook define how its `rules` are used to match incoming requests.
Allowed values are `Exact` or `Equivalent`.
-->
`matchPolicy` 允許 Webhook 定義如何使用其 `rules` 匹配傳入的請求。
允許的值爲 `Exact` 或 `Equivalent`。

<!--
* `Exact` means a request should be intercepted only if it exactly matches a specified rule.
* `Equivalent` means a request should be intercepted if it modifies a resource listed in `rules`,
  even via another API group or version.

In the example given above, the webhook that only registered for `apps/v1` could use `matchPolicy`:

* `matchPolicy: Exact` would mean the `extensions/v1beta1` request would not be sent to the webhook
* `matchPolicy: Equivalent` means the `extensions/v1beta1` request would be sent to the webhook
  (with the objects converted to a version the webhook had specified: `apps/v1`)
-->
* `Exact` 表示僅當請求與指定規則完全匹配時才應攔截該請求。
* `Equivalent` 表示如果某個請求意在修改 `rules` 中列出的資源，
  即使該請求是通過其他 API 組或版本發起，也應攔截該請求。

在上面給出的示例中，僅爲 `apps/v1` 註冊的 Webhook 可以使用 `matchPolicy`：

* `matchPolicy: Exact` 表示不會將 `extensions/v1beta1` 請求發送到 Webhook
* `matchPolicy:Equivalent` 表示將 `extensions/v1beta1` 請求發送到 Webhook
  （將對象轉換爲 Webhook 指定的版本：`apps/v1`）

<!--
Specifying `Equivalent` is recommended, and ensures that webhooks continue to intercept the
resources they expect when upgrades enable new versions of the resource in the API server.
-->
建議指定 `Equivalent`，確保升級後啓用 API 伺服器中資源的新版本時，
Webhook 繼續攔截他們期望的資源。

<!--
When a resource stops being served by the API server, it is no longer considered equivalent to
other versions of that resource that are still served.
For example, `extensions/v1beta1` deployments were first deprecated and then removed (in Kubernetes v1.16).

Since that removal, a webhook with a `apiGroups:["extensions"], apiVersions:["v1beta1"], resources:["deployments"]` rule
does not intercept deployments created via `apps/v1` APIs. For that reason, webhooks should prefer registering
for stable versions of resources.
-->
當 API 伺服器停止提供某資源時，該資源不再被視爲等同於該資源的其他仍在提供服務的版本。
例如，`extensions/v1beta1` 中的 Deployment 已被廢棄，計劃在 v1.16 中移除。

移除後，帶有 `apiGroups:["extensions"], apiVersions:["v1beta1"], resources: ["deployments"]`
規則的 Webhook 將不再攔截通過 `apps/v1` API 來創建的 Deployment。
因此，Webhook 應該優先註冊穩定版本的資源。

<!--
This example shows a validating webhook that intercepts modifications to deployments (no matter the API group or version),
and is always sent an `apps/v1` `Deployment` object:
-->
此示例顯示了一個驗證性質的 Webhook，該 Webhook 攔截對 Deployment 的修改（無論 API 組或版本是什麼），
始終會發送一個 `apps/v1` 版本的 Deployment 對象：

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
准入 Webhook 所用的 `matchPolicy` 默認爲 `Equivalent`。

<!--
### Matching requests: `matchConditions`
-->
### 匹配請求：`matchConditions`  {#matching-requests-matchConditions}

{{< feature-state feature_gate_name="AdmissionWebhookMatchConditions" >}}

<!--
You can define _match conditions_ for webhooks if you need fine-grained request filtering. These
conditions are useful if you find that match rules, `objectSelectors` and `namespaceSelectors` still
doesn't provide the filtering you want over when to call out over HTTP. Match conditions are
[CEL expressions](/docs/reference/using-api/cel/). All match conditions must evaluate to true for the
webhook to be called.
-->
如果你需要細粒度地過濾請求，你可以爲 Webhook 定義**匹配條件**。
如果你發現匹配規則、`objectSelectors` 和 `namespaceSelectors` 仍然不能提供你想要的何時進行 HTTP
調用的過濾條件，那麼添加這些條件會很有用。
匹配條件是 [CEL 表達式](/zh-cn/docs/reference/using-api/cel/)。
所有匹配條件都必須爲 true 才能調用 Webhook。

<!--
Here is an example illustrating a few different uses for match conditions:
-->
以下是一個例子，說明了匹配條件的幾種不同用法：

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
    failurePolicy: 'Ignore' # 失敗時繼續處理請求但跳過 Webhook (可選值)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitted>'
    # 你可以爲每個 Webhook 配置最多 64 個 matchConditions
    matchConditions:
      - name: 'exclude-leases' # 每個匹配條件必須有唯一的名稱
        expression: '!(request.resource.group == "coordination.k8s.io" && request.resource.resource == "leases")' # 匹配非租約資源
      - name: 'exclude-kubelet-requests'
        expression: '!("system:nodes" in request.userInfo.groups)' # 匹配非節點用戶發出的請求
      - name: 'rbac' # 跳過 RBAC 請求，該請求將由第二個 Webhook 處理
        expression: 'request.resource.group != "rbac.authorization.k8s.io"'

  # 這個示例演示瞭如何使用 “authorizer”。
  # 授權檢查比簡單的表達式更復雜，因此在這個示例中，使用第二個 Webhook 來針對 RBAC 請求進行處理。
  # 兩個 Webhook 都可以由同一個端點提供服務。
  - name: rbac.my-webhook.example.com
    matchPolicy: Equivalent
    rules:
      - operations: ['CREATE','UPDATE']
        apiGroups: ['rbac.authorization.k8s.io']
        apiVersions: ['*']
        resources: ['*']
    failurePolicy: 'Fail' # 失敗時拒絕請求 (默認值)
    sideEffects: None
    clientConfig:
      service:
        namespace: my-namespace
        name: my-webhook
      caBundle: '<omitted>'
    # 你可以爲每個 Webhook 配置最多 64 個 matchConditions
    matchConditions:
      - name: 'breakglass'
        # 跳過由授權給 “breakglass” 的用戶在這個 Webhook 上發起的請求。
        # “breakglass” API 不需要在這個檢查之外存在。
        expression: '!authorizer.group("admissionregistration.k8s.io").resource("validatingwebhookconfigurations").name("my-webhook.example.com").check("breakglass").allowed()'
```

{{< note >}}
<!--
You can define up to 64 elements in the `matchConditions` field per webhook.
-->
你可以爲每個 Webhook 在 `matchConditions` 字段中定義最多 64 個匹配條件。
{{< /note >}}

<!--
Match conditions have access to the following CEL variables:
-->
匹配條件可以訪問以下 CEL 變量：

<!--
- `object` - The object from the incoming request. The value is null for DELETE requests. The object
  version may be converted based on the [matchPolicy](#matching-requests-matchpolicy).
- `oldObject` - The existing object. The value is null for CREATE requests.
- `request` - The request portion of the [AdmissionReview](#request), excluding `object` and `oldObject`.
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal
  (authenticated user) of the request. See
  [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) in the Kubernetes CEL library
  documentation for more details.
- `authorizer.requestResource` - A shortcut for an authorization check configured with the request
  resource (group, resource, (subresource), namespace, name).
-->
- `object` - 來自傳入請求的對象。對於 DELETE 請求，該值爲 null。
  該對象版本可能根據 [matchPolicy](#matching-requests-matchpolicy) 進行轉換。
- `oldObject` - 現有對象。對於 CREATE 請求，該值爲 null。
- `request` - [AdmissionReview](#request) 的請求部分，不包括 object 和 oldObject。
- `authorizer` - 一個 CEL 鑑權組件。可用於對請求的主體（經過身份認證的使用者）執行鑑權檢查。
  更多詳細信息，請參閱 Kubernetes CEL 庫文檔中的
  [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)。
- `authorizer.requestResource` - 對設定的請求資源（組、資源、（子資源）、名字空間、名稱）進行授權檢查的快捷方式。

<!--
For more information on CEL expressions, refer to the
[Common Expression Language in Kubernetes reference](/docs/reference/using-api/cel/).
-->
瞭解有關 CEL 表達式的更多信息，請參閱
[Kubernetes 參考文檔中的通用表達式語言](/zh-cn/docs/reference/using-api/cel/)。

<!--
In the event of an error evaluating a match condition the webhook is never called. Whether to reject
the request is determined as follows:
-->
如果在對匹配條件求值時出現錯誤，則不會調用 Webhook。根據以下方式確定是否拒絕請求：

<!--
1. If **any** match condition evaluated to `false` (regardless of other errors), the API server skips the webhook.
2. Otherwise:
    - for [`failurePolicy: Fail`](#failure-policy), reject the request (without calling the webhook).
    - for [`failurePolicy: Ignore`](#failure-policy), proceed with the request but skip the webhook.
-->
1. 如果**任何一個**匹配條件求值結果爲 `false`（不管其他錯誤），API 伺服器將跳過 Webhook。
2. 否則：
   - 對於 [`failurePolicy: Fail`](#failure-policy)，拒絕請求（不調用 Webhook）。
   - 對於 [`failurePolicy: Ignore`](#failure-policy)，繼續處理請求但跳過 Webhook。

<!--
### Contacting the webhook
-->
### 調用 Webhook {#contacting-the-webhook}

<!--
Once the API server has determined a request should be sent to a webhook,
it needs to know how to contact the webhook. This is specified in the `clientConfig`
stanza of the webhook configuration.

Webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.
-->
API 伺服器確定請求應發送到 Webhook 後，它需要知道如何調用 Webhook。
此信息在 Webhook 設定的 `clientConfig` 節中指定。

Webhook 可以通過 URL 或服務引用來調用，並且可以選擇包含自定義 CA 包，以用於驗證 TLS 連接。

#### URL

<!--
`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`).
-->
`url` 以標準 URL 形式給出 Webhook 的位置（`scheme://host:port/path`）。

<!--
The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some API servers
(e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would
be a layering violation). `host` may also be an IP address.
-->
`host` 不應引用叢集中運行的服務；通過指定 `service` 字段來使用服務引用。
主機可以通過某些 API 伺服器中的外部 DNS 進行解析。
（例如，`kube-apiserver` 無法解析叢集內 DNS，因爲這將違反分層規則）。`host` 也可以是 IP 地址。

<!--
Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an API server which might need to make calls to this
webhook. Such installations are likely to be non-portable or not readily
run in a new cluster.
-->
請注意，將 `localhost` 或 `127.0.0.1` 用作 `host` 是有風險的，
除非你非常小心地在所有運行 apiserver 的、可能需要對此 Webhook
進行調用的主機上運行。這樣的安裝方式可能不具有可移植性，即很難在新叢集中啓用。

<!--
The scheme must be "https"; the URL must begin with "https://".
-->
scheme 必須爲 "https"；URL 必須以 "https://" 開頭。

<!--
Attempting to use a user or basic auth (for example `user:password@`) is not allowed.
Fragments (`#...`) and query parameters (`?...`) are also not allowed.
-->
使用使用者或基本身份驗證（例如：`user:password@`）是不允許的。
使用片段（`#...`）和查詢參數（`?...`）也是不允許的。

<!--
Here is an example of a mutating webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
-->
這是設定爲調用 URL 的變更性質的 Webhook 的示例
（並且期望使用系統信任根證書來驗證 TLS 證書，因此不指定 caBundle）：

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
#### 服務引用  {#service-reference}

<!--
The `service` stanza inside `clientConfig` is a reference to the service for this webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".
-->
`clientConfig` 內部的 Service 是對該 Webhook 服務的引用。
如果 Webhook 在叢集中運行，則應使用 `service` 而不是 `url`。
服務的 `namespace` 和 `name` 是必需的。
`port` 是可選的，默認值爲 443。`path` 是可選的，默認爲 "/"。

<!--
Here is an example of a mutating webhook configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle:
-->
這是一個 mutating Webhook 的示例，該 mutating Webhook 設定爲在子路徑 "/my-path" 端口
"1234" 上調用服務，並使用自定義 CA 包針對 ServerName
`my-service-name.my-service-namespace.svc` 驗證 TLS 連接：

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
你必須在以上示例中將 `<CA_BUNDLE>` 替換爲一個有效的 VA 證書包，
這是一個用 PEM 編碼的 CA 證書包，用於校驗 Webhook 的伺服器證書。
{{< /note >}}

<!--
### Side effects
-->
### 副作用   {#side-effects}

<!--
Webhooks typically operate only on the content of the `AdmissionReview` sent to them.
Some webhooks, however, make out-of-band changes as part of processing admission requests.
-->
Webhook 通常僅對發送給他們的 `AdmissionReview` 內容進行操作。
但是，某些 Webhook 在處理 admission 請求時會進行帶外更改。

<!--
Webhooks that make out-of-band changes ("side effects") must also have a reconciliation mechanism
(like a controller) that periodically determines the actual state of the world, and adjusts
the out-of-band data modified by the admission webhook to reflect reality.
This is because a call to an admission webhook does not guarantee the admitted object will be persisted as is, or at all.
Later webhooks can modify the content of the object, a conflict could be encountered while writing to storage,
or the server could power off before persisting the object.
-->
進行帶外更改的（產生“副作用”的）Webhook 必須具有協調機制（如控制器），
該機制定期確定事物的實際狀態，並調整由准入 Webhook 修改的帶外數據以反映現實情況。
這是因爲對準入 Webhook 的調用不能保證所准入的對象將原樣保留，或根本不保留。
以後，Webhook 可以修改對象的內容，在寫入存儲時可能會發生衝突，
或者伺服器可以在持久保存對象之前關閉電源。

<!--
Additionally, webhooks with side effects must skip those side-effects when `dryRun: true` admission requests are handled.
A webhook must explicitly indicate that it will not have side-effects when run with `dryRun`,
or the dry-run request will not be sent to the webhook and the API request will fail instead.
-->
此外，處理 `dryRun: true` admission 請求時，具有副作用的 Webhook 必須避免產生副作用。
一個 Webhook 必須明確指出在使用 `dryRun` 運行時不會有副作用，
否則 `dry-run` 請求將不會發送到該 Webhook，而 API 請求將會失敗。

<!--
Webhooks indicate whether they have side effects using the `sideEffects` field in the webhook configuration:

* `None`: calling the webhook will have no side effects.
* `NoneOnDryRun`: calling the webhook will possibly have side effects, but if a request with
  `dryRun: true` is sent to the webhook, the webhook will suppress the side effects (the webhook
  is `dryRun`-aware).
-->
Webhook 使用 Webhook 設定中的 `sideEffects` 字段顯示它們是否有副作用：

* `None`：調用 Webhook 沒有副作用。
* `NoneOnDryRun`：調用 Webhook 可能會有副作用，但是如果將帶有 `dryRun: true`
  屬性的請求發送到 Webhook，則 Webhook 將抑制副作用（該 Webhook 可識別 `dryRun`）。

<!--
Here is an example of a validating webhook indicating it has no side effects on `dryRun: true` requests:
-->
這是一個驗證性質的 Webhook 的示例，表明它對 `dryRun: true` 請求沒有副作用：

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
### 超時   {#timeouts}

<!--
Because webhooks add to API request latency, they should evaluate as quickly as possible.
`timeoutSeconds` allows configuring how long the API server should wait for a webhook to respond
before treating the call as a failure.
-->
由於 Webhook 會增加 API 請求的延遲，因此應儘快完成自身的操作。
`timeoutSeconds` 用來設定在將調用視爲失敗之前，允許 API 伺服器等待 Webhook 響應的時間長度。

<!--
If the timeout expires before the webhook responds, the webhook call will be ignored or
the API call will be rejected based on the [failure policy](#failure-policy).

The timeout value must be between 1 and 30 seconds.

Here is an example of a validating webhook with a custom timeout of 2 seconds:
-->
如果超時在 Webhook 響應之前被觸發，則基於[失敗策略](#failure-policy)，將忽略
Webhook 調用或拒絕 API 調用。

超時值必須設置在 1 到 30 秒之間。

這是一個自定義超時設置爲 2 秒的 validating Webhook 的示例：

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
准入 Webhook 所用的超時時間默認爲 10 秒。

<!--
### Reinvocation policy
-->
### 再調用策略  {#reinvocation-policy}

<!--
A single ordering of mutating admissions plugins (including webhooks) does not work for all cases
(see https://issue.k8s.io/64333 as an example). A mutating webhook can add a new sub-structure
to the object (like adding a `container` to a `pod`), and other mutating plugins which have already
run may have opinions on those new structures (like setting an `imagePullPolicy` on all containers).
-->
變更性質的准入插件（包括 Webhook）的任何一種排序方式都不會適用於所有情況。
(參見 https://issue.k8s.io/64333 示例)。
變更性質的 Webhook 可以向對象中添加新的子結構（例如向 `pod` 中添加 `container`），
已經運行的其他修改插件可能會對這些新結構有影響
（就像在所有容器上設置 `imagePullPolicy` 一樣）。

<!--
To allow mutating admission plugins to observe changes made by other plugins,
built-in mutating admission plugins are re-run if a mutating webhook modifies an object,
and mutating webhooks can specify a `reinvocationPolicy` to control whether they are reinvoked as well.
-->
要允許變更性質的准入插件感應到其他插件所做的更改，
如果變更性質的 Webhook 修改了一個對象，則會重新運行內置的變更性質的准入插件，
並且變更性質的 Webhook 可以指定 `reinvocationPolicy` 來控制是否也重新調用它們。

<!--
`reinvocationPolicy` may be set to `Never` or `IfNeeded`. It defaults to `Never`.
-->
可以將 `reinvocationPolicy` 設置爲 `Never` 或 `IfNeeded`。 默認爲 `Never`。

<!--
* `Never`: the webhook must not be called more than once in a single admission evaluation.
* `IfNeeded`: the webhook may be called again as part of the admission evaluation if the object
  being admitted is modified by other admission plugins after the initial webhook call.
-->
* `Never`: 在一次准入測試中，不得多次調用 Webhook。
* `IfNeeded`: 如果在最初的 Webhook 調用之後被其他對象的插件修改了被接納的對象，
  則可以作爲準入測試的一部分再次調用該 Webhook。

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
* 不能保證附加調用的次數恰好是一。
* 如果其他調用導致對該對象的進一步修改，則不能保證再次調用 Webhook。
* 使用此選項的 Webhook 可能會重新排序，以最大程度地減少額外調用的次數。
* 要在確保所有修改都完成後驗證對象，請改用驗證性質的 Webhook
  （推薦用於有副作用的 Webhook）。

<!--
Here is an example of a mutating webhook opting into being re-invoked if later admission plugins
modify the object:
-->
這是一個變更性質的 Webhook 的示例，該 Webhook 在以後的准入插件修改對象時被重新調用：

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
變更性質的 Webhook 必須具有[冪等性](#idempotence)，
並且能夠成功處理已被接納並可能被修改的對象的變更性質的 Webhook。
對於所有變更性質的准入 Webhook 都是如此，
因爲它們可以在對象中進行的任何更改可能已經存在於使用者提供的對象中，但是對於選擇重新調用的 Webhook
來說是必不可少的。

<!--
### Failure policy
-->
### 失敗策略 {#failure-policy}

<!--
`failurePolicy` defines how unrecognized errors and timeout errors from the admission webhook
are handled. Allowed values are `Ignore` or `Fail`.

* `Ignore` means that an error calling the webhook is ignored and the API request is allowed to continue.
* `Fail` means that an error calling the webhook causes the admission to fail and the API request to be rejected.

Here is a mutating webhook configured to reject an API request if errors are encountered calling the admission webhook:
-->
`failurePolicy` 定義瞭如何處理准入 Webhook 中無法識別的錯誤和超時錯誤。允許的值爲 `Ignore` 或 `Fail`。

* `Ignore` 表示調用 Webhook 的錯誤將被忽略並且允許 API 請求繼續。
* `Fail` 表示調用 Webhook 的錯誤導致准入失敗並且 API 請求被拒絕。

這是一個變更性質的 Webhook，設定爲在調用准入 Webhook 遇到錯誤時拒絕 API 請求：

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
准入 Webhook 所用的默認 `failurePolicy` 是 `Fail`。

<!--
## Monitoring admission webhooks
-->
## 監控 Admission Webhook    {#monitoring-admission-webhooks}

<!--
The API server provides ways to monitor admission webhook behaviors. These
monitoring mechanisms help cluster admins to answer questions like:

1. Which mutating webhook mutated the object in a API request?

2. What change did the mutating webhook applied to the object?

3. Which webhooks are frequently rejecting API requests? What's the reason for a rejection?
-->
API 伺服器提供了監視准入 Webhook 行爲的方法。這些監視機制可幫助叢集管理員回答以下問題：

1. 哪個變更性質的 Webhook 改變了 API 請求中的對象？
2. 變更性質的 Webhook 對對象做了哪些更改？
3. 哪些 Webhook 經常拒絕 API 請求？是什麼原因拒絕？

<!--
### Mutating webhook auditing annotations
-->
### 變更性質的 Webhook 審計註解 {#mutating-webhook-auditing-annotations}

<!--
Sometimes it's useful to know which mutating webhook mutated the object in a API request, and what change did the
webhook apply.
-->
有時，瞭解 API 請求中的哪個變更性質的 Webhook 使對象改變以及該 Webhook 應用了哪些更改很有用。

<!--
The Kubernetes API server performs [auditing](/docs/tasks/debug/debug-cluster/audit/) on each
mutating webhook invocation. Each invocation generates an auditing annotation
capturing if a request object is mutated by the invocation, and optionally generates an annotation
capturing the applied patch from the webhook admission response. The annotations are set in the
audit event for given request on given stage of its execution, which is then pre-processed
according to a certain policy and written to a backend.
-->
Kubernetes API 伺服器針對每個變更性質的 Webhook 調用執行[審計](/zh-cn/docs/tasks/debug/debug-cluster/audit/)操作。
每個調用都會生成一個審計註解，記述請求對象是否發生改變，
可選地還可以根據 Webhook 的准入響應生成一個註解，記述所應用的修補。
針對給定請求的給定執行階段，註解被添加到審計事件中，
然後根據特定策略進行預處理並寫入後端。

<!--
The audit level of a event determines which annotations get recorded:
-->
事件的審計級別決定了要記錄哪些註解：

<!--
- At `Metadata` audit level or higher, an annotation with key
  `mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` gets logged with JSON
  payload indicating a webhook gets invoked for given request and whether it mutated the object or not.
-->
- 在 `Metadata` 或更高審計級別上，將使用 JSON 負載記錄帶有鍵名
  `mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` 的註解，
  該註解表示針對給定請求調用了 Webhook，以及該 Webhook 是否更改了對象。

  <!--
  For example, the following annotation gets recorded for a webhook being reinvoked. The webhook is
  ordered the third in the mutating webhook chain, and didn't mutated the request object during the
  invocation.
  -->

  例如，對於正在被重新調用的某 Webhook，所記錄的註解如下。
  Webhook 在 mutating Webhook 鏈中排在第三個位置，並且在調用期間未改變請求對象。

  <!--
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
  -->

  ```yaml
  # 審計事件相關記錄
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "mutation.webhook.admission.k8s.io/round_1_index_2": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook.example.com\",\"mutated\": false}"
          # 其他註解
          ...
      }
      # 其他字段
      ...
  }
  ```

  <!--
  ```yaml
  # the annotation value deserialized
  {
      "configuration": "my-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook.example.com",
      "mutated": false
  }
  ```
  -->

  ```yaml
  # 反序列化的註解值
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

  對於在第一輪中調用的 Webhook，所記錄的註解如下。
  Webhook 在變更性質的 Webhook 鏈中排在第一位，並在調用期間改變了請求對象。

  <!--
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
  -->

  ```yaml
  # 審計事件相關記錄
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "mutation.webhook.admission.k8s.io/round_0_index_0": "{\"configuration\":\"my-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"mutated\": true}"
          # 其他註解
          ...
      }
      # 其他字段
      ...
  }
  ```

  <!--
  ```yaml
  # the annotation value deserialized
  {
      "configuration": "my-mutating-webhook-configuration.example.com",
      "webhook": "my-webhook-always-mutate.example.com",
      "mutated": true
  }
  ```
  -->

  ```yaml
  # 反序列化的註解值
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
- 在 `Request` 或更高審計級別上，將使用 JSON 負載記錄帶有鍵名爲
  `patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` 的註解，
  該註解表明針對給定請求調用了 Webhook 以及應用於請求對象之上的修改。

  <!--
  For example, the following annotation gets recorded for a webhook being reinvoked. The webhook is ordered the fourth in the
  mutating webhook chain, and responded with a JSON patch which got applied to the request object.
  -->
  例如，以下是針對正在被重新調用的某 Webhook 所記錄的註解。
  Webhook 在變更性質的 Webhook 鏈中排在第四，並在其響應中包含一個 JSON 補丁，
  該補丁已被應用於請求對象。

  <!--
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
  -->

  ```yaml
  # 審計事件相關記錄
  {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "annotations": {
          "patch.webhook.admission.k8s.io/round_1_index_3": "{\"configuration\":\"my-other-mutating-webhook-configuration.example.com\",\"webhook\":\"my-webhook-always-mutate.example.com\",\"patch\":[{\"op\":\"add\",\"path\":\"/data/mutation-stage\",\"value\":\"yes\"}],\"patchType\":\"JSONPatch\"}"
          # 其他註解
          ...
      }
      # 其他字段
      ...
  }
  ```

  <!--
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
  -->

  ```yaml
  # 反序列化的註解值
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
API 伺服器從 `/metrics` 端點公開 Prometheus 指標，這些指標可用於監控和診斷 API 伺服器狀態。
以下指標記錄了與准入 Webhook 相關的狀態。

<!--
#### API server admission webhook rejection count
-->
#### apiserver 准入 Webhook 拒絕次數 {#api-server-admission-webhook-rejection-count}

<!--
Sometimes it's useful to know which admission webhooks are frequently rejecting API requests, and the
reason for a rejection.

The API server exposes a Prometheus counter metric recording admission webhook rejections. The
metrics are labelled to identify the causes of webhook rejection(s):
-->
有時，瞭解哪些准入 Webhook 經常拒絕 API 請求以及拒絕的原因是很有用的。

在 v1.16+ 中，kube-apiserver 提供了 Prometheus 計數器度量值，記錄
准入 Webhook 的拒絕次數。
度量值的標籤給出了 Webhook 拒絕該請求的原因：

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
- `name`：拒絕請求 Webhook 的名稱。
- `operation`：請求的操作類型可以是 `CREATE`、`UPDATE`、`DELETE` 和 `CONNECT` 其中之一。
- `type`：Admission Webhook 類型，可以是 `admit` 和 `validating` 其中之一。
- `error_type`：標識在 Webhook 調用期間是否發生了錯誤並且導致了拒絕。其值可以是以下之一：
  - `calling_webhook_error`：發生了來自准入 Webhook 的無法識別的錯誤或超時錯誤，
    並且 Webhook 的 [失敗策略](#failure-policy) 設置爲 `Fail`。
  - `no_error`：未發生錯誤。Webhook 在准入響應中以 `allowed: false` 值拒絕了請求。
    度量標籤 `rejection_code` 記錄了在准入響應中設置的 `.status.code`。
  - `apiserver_internal_error`：apiserver 發生內部錯誤。
- `rejection_code`：當 Webhook 拒絕請求時，在准入響應中設置的 HTTP 狀態碼。

<!--
Example of the rejection count metrics:
-->
拒絕計數指標示例：

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
## 最佳實踐和警告 {#best-practices-and-warnings}

<!--
For recommendations and considerations when writing mutating admission webhooks,
see
[Admission Webhooks Good Practices](/docs/concepts/cluster-administration/admission-webhooks-good-practices).
-->
有關編寫可變 Admission Webhook 時的建議和注意事項，請參閱
[Admission Webhooks 良好實踐](/zh-cn/docs/concepts/cluster-administration/admission-webhooks-good-practices)。
