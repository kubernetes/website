---
title: 動態准入控制
content_type: concept
weight: 40
---

<!--
title: Dynamic Admission Control
content_type: concept
weight: 40
-->

<!-- overview -->
<!--
In addition to [compiled-in admission plugins](/docs/reference/access-authn-authz/admission-controllers/),
admission plugins can be developed as extensions and run as webhooks configured at runtime.
This page describes how to build, configure, use, and monitor admission webhooks.
-->
除了[內建的 admission 外掛](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)，
准入外掛可以作為擴充套件獨立開發，並以執行時所配置的 Webhook 的形式執行。
此頁面描述瞭如何構建、配置、使用和監視准入 Webhook。

<!-- body -->
<!--
## What are admission webhooks?
-->
## 什麼是准入 Webhook？

<!--
Admission webhooks are HTTP callbacks that receive admission requests and do
something with them. You can define two types of admission webhooks,
[validating admission Webhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
and
[mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
Mutating admission Webhooks are invoked first, and can modify objects sent to the API server to enforce custom defaults.
-->
准入 Webhook 是一種用於接收准入請求並對其進行處理的 HTTP 回撥機制。
可以定義兩種型別的准入 webhook，即
[驗證性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook) 和
[修改性質的准入 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)。
修改性質的准入 Webhook 會先被呼叫。它們可以更改傳送到 API 
伺服器的物件以執行自定義的設定預設值操作。

<!--
After all object modifications are complete, and after the incoming object is validated by the API server,
validating admission webhooks are invoked and can reject requests to enforce custom policies.
-->
在完成了所有物件修改並且 API 伺服器也驗證了所傳入的物件之後，
驗證性質的 Webhook 會被呼叫，並透過拒絕請求的方式來強制實施自定義的策略。

<!--
Admission webhooks that need to guarantee they see the final state of the object in order to enforce policy
should use a validating admission webhook, since objects can be modified after being seen by mutating webhooks.
-->
{{< note >}}
如果准入 Webhook 需要保證它們所看到的是物件的最終狀態以實施某種策略。
則應使用驗證性質的准入 Webhook，因為物件被修改性質 Webhook 看到之後仍然可能被修改。
{{< /note >}}


<!--
### Experimenting with admission webhooks

Admission webhooks are essentially part of the cluster control-plane. You should
write and deploy them with great caution. Please read the [user
guides](/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server) for
instructions if you intend to write/deploy production-grade admission webhooks.
In the following, we describe how to quickly experiment with admission webhooks.
-->
### 嘗試准入 Webhook

准入 Webhook 本質上是叢集控制平面的一部分。你應該非常謹慎地編寫和部署它們。
如果你打算編寫或者部署生產級准入 webhook，請閱讀[使用者指南](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#write-an-admission-webhook-server)以獲取相關說明。
在下文中，我們將介紹如何快速試驗准入 Webhook。

<!--
### Prerequisites

* Ensure that the Kubernetes cluster is at least as new as v1.16 (to use `admissionregistration.k8s.io/v1`),
  or v1.9 (to use `admissionregistration.k8s.io/v1beta1`).

* Ensure that MutatingAdmissionWebhook and ValidatingAdmissionWebhook
  admission controllers are enabled.
  [Here](/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)
  is a recommended set of admission controllers to enable in general.

* Ensure that the admissionregistration.k8s.io/v1beta1 API is enabled.
-->
### 先決條件 {#prerequisites}

* 確保 Kubernetes 叢集版本至少為 v1.16（以便使用 `admissionregistration.k8s.io/v1` API） 或者 v1.9 （以便使用 `admissionregistration.k8s.io/v1beta1` API）。

* 確保啟用 MutatingAdmissionWebhook 和 ValidatingAdmissionWebhook 控制器。
  [這裡](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#is-there-a-recommended-set-of-admission-controllers-to-use)
  是一組推薦的 admission 控制器，通常可以啟用。

* 確保啟用了 `admissionregistration.k8s.io/v1beta1` API。

<!--
### Write an admission webhook server
-->
### 編寫一個准入 Webhook 伺服器

<!--
Please refer to the implementation of the [admission webhook
server](https://github.com/kubernetes/kubernetes/blob/release-1.21/test/images/agnhost/webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`AdmissionReview` request sent by the apiservers, and sends back its decision
as an `AdmissionReview` object in the same version it received.
-->
請參閱 Kubernetes e2e 測試中的
[admission webhook 伺服器](https://github.com/kubernetes/kubernetes/blob/release-1.21/test/images/agnhost/webhook/main.go)
的實現。webhook 處理由 apiserver 傳送的 `AdmissionReview` 請求，並且將其決定
作為 `AdmissionReview` 物件以相同版本傳送回去。

<!--
See the [webhook request](#request) section for details on the data sent to webhooks.
-->
有關傳送到 webhook 的資料的詳細資訊，請參閱 [webhook 請求](#request)。

<!--
See the [webhook response](#response) section for the data expected from webhooks.
-->
要獲取來自 webhook 的預期資料，請參閱 [webhook 響應](#response)。

<!--
The example admission webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/images/agnhost/webhook/config.go#L38-L39),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly apiservers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate apiservers](#authenticate-apiservers).
-->
示例准入 Webhook 伺服器置 `ClientAuth` 欄位為
[空](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/images/agnhost/webhook/config.go#L38-L39)，
預設為 `NoClientCert` 。這意味著 webhook 伺服器不會驗證客戶端的身份，認為其是 apiservers。
如果你需要雙向 TLS 或其他方式來驗證客戶端，請參閱
如何[對 apiservers 進行身份認證](#authenticate-apiservers)。

<!--
### Deploy the admission webhook service
-->
### 部署准入 Webhook 服務

<!--
The webhook server in the e2e test is deployed in the Kubernetes cluster, via
the [deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps).
The test also creates a [service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
as the front-end of the webhook server. See
[code](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/e2e/apimachinery/webhook.go#L748).
-->
e2e 測試中的 webhook 伺服器透過
[deployment API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deployment-v1-apps)
部署在 Kubernetes 叢集中。該測試還將建立一個
[service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
作為 webhook 伺服器的前端。參見
[相關程式碼](https://github.com/kubernetes/kubernetes/blob/v1.22.0/test/e2e/apimachinery/webhook.go#L748)。

<!--
You may also deploy your webhooks outside of the cluster. You will need to update
your webhook configurations accordingly.
-->
你也可以在叢集外部署 webhook。這樣做需要相應地更新你的 webhook 配置。

<!--
### Configure准入 Webhooks on the fly
-->
### 即時配置准入 Webhook

<!--
You can dynamically configure what resources are subject to what admission
webhooks via
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io)
or
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io).
-->
你可以透過 
[ValidatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhookconfiguration-v1-admissionregistration-k8s-io)
或者 
[MutatingWebhookConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#mutatingwebhookconfiguration-v1-admissionregistration-k8s-io) 動態配置哪些資源要被哪些准入 Webhook 處理。
<!--
The following is an example `ValidatingWebhookConfiguration`, a mutating webhook configuration is similar.
See the [webhook configuration](#webhook-configuration) section for details about each config field.
-->
以下是一個 `ValidatingWebhookConfiguration` 示例，mutating webhook 配置與此類似。有關每個配置欄位的詳細資訊，請參閱 [webhook 配置](#webhook-configuration) 部分。

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
# 1.16 中被淘汰，推薦使用 admissionregistration.k8s.io/v1
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
resources ("Namespaced") will match this rule. "&lowast;" means that there are no scope restrictions.
-->
scope 欄位指定是僅叢集範圍的資源（Cluster）還是名字空間範圍的資源資源（Namespaced）將與此規則匹配。`*` 表示沒有範圍限制。

<!--
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
-->
{{< note >}}
當使用 `clientConfig.service` 時，伺服器證書必須對 `<svc_name>.<svc_namespace>.svc` 有效。
{{< /note >}}

<!--
Default timeout for a webhook call is 10 seconds for webhooks registered created using `admissionregistration.k8s.io/v1`,
and 30 seconds for webhooks created using `admissionregistration.k8s.io/v1beta1`. Starting in kubernetes 1.14 you
can set the timeout and it is encouraged to use a small timeout for webhooks.
If the webhook call times out, the request is handled according to the webhook's
failure policy.
-->
{{< note >}}
對於使用 `admissionregistration.k8s.io/v1` 建立的 webhook 而言，其 webhook 呼叫的預設超時是 10 秒；
對於使用 `admissionregistration.k8s.io/v1beta1` 建立的 webhook 而言，其預設超時是 30 秒。
從 kubernetes 1.14 開始，可以設定超時。建議對 webhooks 設定較短的超時時間。
如果 webhook 呼叫超時，則根據 webhook 的失敗策略處理請求。
{{< /note >}}

<!--
When an apiserver receives a request that matches one of the `rules`, the
apiserver sends an `admissionReview` request to webhook as specified in the
`clientConfig`.

After you create the webhook configuration, the system will take a few seconds
to honor the new configuration.
-->
當 apiserver 收到與 `rules` 相匹配的請求時，apiserver 按照 `clientConfig` 中指定的方式向 webhook 傳送一個 `admissionReview` 請求。

建立 webhook 配置後，系統將花費幾秒鐘使新配置生效。

<!--
### Authenticate apiservers
-->
### 對 apiservers 進行身份認證 {#authenticate-apiservers}

<!--
If your admission webhooks require authentication, you can configure the
apiservers to use basic auth, bearer token, or a cert to authenticate itself to
the webhooks. There are three steps to complete the configuration.
-->
如果你的 webhook 需要身份驗證，則可以將 apiserver 配置為使用基本身份驗證、持有者令牌或證書來向 webhook 提供身份證明。完成此配置需要三個步驟。

<!--
* When starting the apiserver, specify the location of the admission control
  configuration file via the `--admission-control-config-file` flag.

* In the admission control configuration file, specify where the
  MutatingAdmissionWebhook controller and ValidatingAdmissionWebhook controller
  should read the credentials. The credentials are stored in kubeConfig files
  (yes, the same schema that's used by kubectl), so the field name is
  `kubeConfigFile`. Here is an example admission control configuration file:
-->
* 啟動 apiserver 時，透過 `--admission-control-config-file` 引數指定準入控制配置檔案的位置。

* 在准入控制配置檔案中，指定 MutatingAdmissionWebhook 控制器和 ValidatingAdmissionWebhook 控制器應該讀取憑據的位置。
憑證儲存在 kubeConfig 檔案中（是  的，與 kubectl 使用的模式相同），因此欄位名稱為 `kubeConfigFile`。
以下是一個准入控制配置檔案示例：

<!--
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1, kind=WebhookAdmissionConfiguration
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1, kind=WebhookAdmissionConfiguration
-->


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
```yaml
# 1.17 中被淘汰，推薦使用 apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionWebhook
  configuration:
    # 1.17 中被淘汰，推薦使用 apiserver.config.k8s.io/v1，kind = WebhookAdmissionConfiguration
    apiVersion: apiserver.config.k8s.io/v1alpha1
    kind: WebhookAdmission
    kubeConfigFile: "<path-to-kubeconfig-file>"
- name: MutatingAdmissionWebhook
  configuration:
    # 1.17 中被淘汰，推薦使用 apiserver.config.k8s.io/v1，kind = WebhookAdmissionConfiguration
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

* In the kubeConfig file, provide the credentials:
-->
有關 `AdmissionConfiguration` 的更多資訊，請參見
[AdmissionConfiguration (v1) reference](/docs/reference/config-api/apiserver-webhookadmission.v1/)。
有關每個配置欄位的詳細資訊，請參見 [webhook 配置](#webhook-配置)部分。

* 在 kubeConfig 檔案中，提供證書憑據：

    ```yaml
    apiVersion: v1
    kind: Config
    users:
    # 名稱應設定為服務的 DNS 名稱或配置了 Webhook 的 URL 的主機名（包括埠）。
    # 如果將非 443 埠用於服務，則在配置 1.16+ API 伺服器時，該埠必須包含在名稱中。
    #
    # 對於配置在預設埠（443）上與服務對話的 Webhook，請指定服務的 DNS 名稱：
    # - name: webhook1.ns1.svc
    #   user: ...
    #
    # 對於配置在非預設埠（例如 8443）上與服務對話的 Webhook，請在 1.16+ 中指定服務的 DNS 名稱和埠：
    # - name: webhook1.ns1.svc:8443
    #   user: ...
    # 並可以選擇僅使用服務的 DNS 名稱來建立第二節，以與 1.15 API 伺服器版本相容：
    # - name: webhook1.ns1.svc
    #   user: ...
    #
    # 對於配置為使用 URL 的 webhook，請匹配在 webhook 的 URL 中指定的主機（和埠）。
    # 帶有 `url: https://www.example.com` 的 webhook：
    # - name: www.example.com
    #   user: ...
    #
    # 帶有 `url: https://www.example.com:443` 的 webhook：
    # - name: www.example.com:443
    #   user: ...
    #
    # 帶有 `url: https://www.example.com:8443` 的 webhook：
    # - name: www.example.com:8443
    #   user: ...
    #
    - name: 'webhook1.ns1.svc'
      user:
        client-certificate-data: "<pem encoded certificate>"
        client-key-data: "<pem encoded key>"
    # `name` 支援使用 * 萬用字元匹配字首段。
    - name: '*.webhook-company.org'
      user:
        password: "<password>"
        username: "<name>"
    # '*' 是預設匹配項。
    - name: '*'
      user:
        token: "<token>"
    ```
<!--
Of course you need to set up the webhook server to handle these authentications.
-->
當然，你需要設定 webhook 伺服器來處理這些身份驗證。

<!--
### Request

Webhooks are sent as POST request, with `Content-Type: application/json`,
with an `AdmissionReview` API object in the `admission.k8s.io` API group
serialized to JSON as the body.

Webhooks can specify what versions of `AdmissionReview` objects they accept
with the `admissionReviewVersions` field in their configuration:
-->

### 請求 {#request}

Webhook 傳送 POST 請求時，請設定 `Content-Type: application/json` 並對 `admission.k8s.io`  API 組中的 `AdmissionReview` 物件進行序列化，將所得到的 JSON 作為請求的主體。

Webhook 可以在配置中的 `admissionReviewVersions` 欄位指定可接受的 `AdmissionReview` 物件版本：

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
建立 `admissionregistration.k8s.io/v1` webhook 配置時，`admissionReviewVersions` 是必填欄位。
Webhook 必須支援至少一個當前和以前的 apiserver 都可以解析的 `AdmissionReview` 版本。
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# v1.16 中被淘汰，推薦使用 admissionregistration.k8s.io/v1
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
如果未指定 `admissionReviewVersions`，則建立 `admissionregistration.k8s.io/v1beta1` Webhook 配置時的預設值為 `v1beta1`。
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
API 伺服器將傳送的是 `admissionReviewVersions` 列表中所支援的第一個 `AdmissionReview` 版本。如果 API 伺服器不支援列表中的任何版本，則不允許建立配置。

如果 API 伺服器遇到以前建立的 Webhook 配置，並且不支援該 API 伺服器知道如何傳送的任何 `AdmissionReview` 版本，則呼叫 Webhook 的嘗試將失敗，並依據[失敗策略](#failure-policy)進行處理。

此示例顯示了 `AdmissionReview` 物件中包含的資料，該資料用於請求更新 `apps/v1` `Deployment` 的 `scale` 子資源：

{{< tabs name="AdmissionReview_request" >}}
{{% tab name="admission.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "admission.k8s.io/v1",
  "kind": "AdmissionReview",
  "request": {
    # 唯一標識此准入回撥的隨機 uid
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # 傳入完全正確的 group/version/kind 物件
    "kind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    # 修改 resource 的完全正確的的 group/version/kind
    "resource": {"group":"apps","version":"v1","resource":"deployments"},
    # subResource（如果請求是針對 subResource 的）
    "subResource": "scale",

    # 在對 API 伺服器的原始請求中，傳入物件的標準 group/version/kind
    # 僅當 webhook 指定 `matchPolicy: Equivalent` 且將對 API 伺服器的原始請求轉換為 webhook 註冊的版本時，這才與 `kind` 不同。
    "requestKind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    # 在對 API 伺服器的原始請求中正在修改的資源的標準 group/version/kind
    # 僅當 webhook 指定了 `matchPolicy：Equivalent` 並且將對 API 伺服器的原始請求轉換為 webhook 註冊的版本時，這才與 `resource` 不同。
    "requestResource": {"group":"apps","version":"v1","resource":"deployments"},
    # subResource（如果請求是針對 subResource 的）
    # 僅當 webhook 指定了 `matchPolicy：Equivalent` 並且將對 API 伺服器的原始請求轉換為該 webhook 註冊的版本時，這才與 `subResource` 不同。
    "requestSubResource": "scale",

    # 被修改資源的名稱
    "name": "my-deployment",
    # 如果資源是屬於名字空間（或者是名字空間物件），則這是被修改的資源的名字空間
    "namespace": "my-namespace",

    # 操作可以是 CREATE、UPDATE、DELETE 或 CONNECT
    "operation": "UPDATE",

    "userInfo": {
      # 向 API 伺服器發出請求的經過身份驗證的使用者的使用者名稱
      "username": "admin",
      # 向 API 伺服器發出請求的經過身份驗證的使用者的 UID
      "uid": "014fbff9a07c",
      # 向 API 伺服器發出請求的經過身份驗證的使用者的組成員身份
      "groups": ["system:authenticated","my-admin-group"],
      # 向 API 伺服器發出請求的使用者相關的任意附加資訊
      # 該欄位由 API 伺服器身份驗證層填充，並且如果 webhook 執行了任何 SubjectAccessReview 檢查，則應將其包括在內。
      "extra": {
        "some-key":["some-value1", "some-value2"]
      }
    },

    # object 是被接納的新物件。
    # 對於 DELETE 操作，它為 null。
    "object": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    # oldObject 是現有物件。
    # 對於 CREATE 和 CONNECT 操作，它為 null。
    "oldObject": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    # options 包含要接受的操作的選項，例如 meta.k8s.io/v CreateOptions、UpdateOptions 或 DeleteOptions。
    # 對於 CONNECT 操作，它為 null。
    "options": {"apiVersion":"meta.k8s.io/v1","kind":"UpdateOptions",...},

    # dryRun 表示 API 請求正在以 `dryrun` 模式執行，並且將不會保留。
    # 帶有副作用的 Webhook 應該避免在 dryRun 為 true 時啟用這些副作用。
    # 有關更多詳細資訊，請參見 http://k8s.io/docs/reference/using-api/api-concepts/#make-a-dry-run-request
    "dryRun": false
  }
}
```
{{% /tab %}}
{{% tab name="admission.k8s.io/v1beta1" %}}
```yaml
{
  # v1.16 中被廢棄，推薦使用 admission.k8s.io/v1
  "apiVersion": "admission.k8s.io/v1beta1",
  "kind": "AdmissionReview",
  "request": {
    # 唯一標識此准入回撥的隨機 uid
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",

    # 傳入完全正確的 group/version/kind 物件
    "kind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    # 修改 resource 的完全正確的的 group/version/kind
    "resource": {"group":"apps","version":"v1","resource":"deployments"},
    # subResource（如果請求是針對 subResource 的）
    "subResource": "scale",

    # 在對 API 伺服器的原始請求中，傳入物件的標準 group/version/kind。
    # 僅當 Webhook 指定了 `matchPolicy：Equivalent` 並且將對 API 伺服器的原始請求轉換為該 Webhook 註冊的版本時，這與 `kind` 不同。
    # 僅由 v1.15+ API 伺服器傳送。
    "requestKind": {"group":"autoscaling","version":"v1","kind":"Scale"},
    # 在對 API 伺服器的原始請求中正在修改的資源的標準 group/version/kind
    # 僅當 webhook 指定了 `matchPolicy：Equivalent` 並且將對 API 伺服器的原始請求轉換為 webhook 註冊的版本時，這才與 `resource` 不同。
    # 僅由 v1.15+ API 伺服器傳送。
    "requestResource": {"group":"apps","version":"v1","resource":"deployments"},
    # subResource（如果請求是針對 subResource 的）
    # 僅當 webhook 指定了 `matchPolicy：Equivalent` 並且將對 API 伺服器的原始請求轉換為該 webhook 註冊的版本時，這才與 `subResource` 不同。
    # 僅由 v1.15+ API 伺服器傳送。
    "requestSubResource": "scale",

    # 被修改資源的名稱
    "name": "my-deployment",
    # 如果資源是屬於名字空間（或者是名字空間物件），則這是被修改的資源的名字空間
    "namespace": "my-namespace",

    # 操作可以是 CREATE、UPDATE、DELETE 或 CONNECT
    "operation": "UPDATE",

    "userInfo": {
      # 向 API 伺服器發出請求的經過身份驗證的使用者的使用者名稱
      "username": "admin",
      # 向 API 伺服器發出請求的經過身份驗證的使用者的 UID
      "uid": "014fbff9a07c",
      # 向 API 伺服器發出請求的經過身份驗證的使用者的組成員身份
      "groups": ["system:authenticated","my-admin-group"],
      # 向 API 伺服器發出請求的使用者相關的任意附加資訊
      # 該欄位由 API 伺服器身份驗證層填充，並且如果 webhook 執行了任何 SubjectAccessReview 檢查，則應將其包括在內。
      "extra": {
        "some-key":["some-value1", "some-value2"]
      }
    },

    # object 是被接納的新物件。
    # 對於 DELETE 操作，它為 null。
    "object": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    # oldObject 是現有物件。
    # 對於 CREATE 和 CONNECT 操作（對於 v1.15.0 之前版本的 API 伺服器中的 DELETE 操作），它為 null。
    "oldObject": {"apiVersion":"autoscaling/v1","kind":"Scale",...},
    # options 包含要接受的操作的選項，例如 meta.k8s.io/v CreateOptions、UpdateOptions 或 DeleteOptions。
    # 對於 CONNECT 操作，它為 null。
    # 僅由 v1.15+ API 伺服器傳送。
    "options": {"apiVersion":"meta.k8s.io/v1","kind":"UpdateOptions",...},

    # dryRun 表示 API 請求正在以 `dryrun` 模式執行，並且將不會保留。
    # 帶有副作用的 Webhook 應該避免在 dryRun 為 true 時啟用這些副作用。
    # 有關更多詳細資訊，請參見 http://k8s.io/docs/reference/using-api/api-concepts/#make-a-dry-run-request
    "dryRun": false
  }
}
```
{{% /tab %}}
{{< /tabs >}}
<!--
### Response
-->
### 響應{#response}

<!--
Webhooks respond with a 200 HTTP status code, `Content-Type: application/json`,
and a body containing an `AdmissionReview` object (in the same version they were sent),
with the `response` stanza populated, serialized to JSON.
-->
Webhook 使用 HTTP 200 狀態碼、`Content-Type: application/json` 和一個包含 `AdmissionReview` 物件的 JSON 序列化格式來發送響應。該 `AdmissionReview` 物件與傳送的版本相同，且其中包含的 `response` 欄位已被有效填充。

<!--
At a minimum, the `response` stanza must contain the following fields:

* `uid`, copied from the `request.uid` sent to the webhook
* `allowed`, either set to `true` or `false`

Example of a minimal response from a webhook to allow a request:
-->
`response` 至少必須包含以下欄位：

* `uid`，從傳送到 webhook 的 `request.uid` 中複製而來
* `allowed`，設定為 `true` 或 `false`

<!--
Example of a minimal response from a webhook to allow a request:
-->
Webhook 允許請求的最簡單響應示例：

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
Webhook 禁止請求的最簡單響應示例：

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
See the [API documentation](/docs/reference/generated/kubernetes-api/v1.14/#status-v1-meta) for details about the status type.
Example of a response to forbid a request, customizing the HTTP status code and message presented to the user:
-->
當拒絕請求時，Webhook 可以使用 `status` 欄位自定義 http 響應碼和返回給使用者的訊息。
有關狀態型別的詳細資訊，請參見
[API 文件](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#status-v1-meta)。
禁止請求的響應示例，它定製了向用戶顯示的 HTTP 狀態碼和訊息：

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
-->
當允許請求時，mutating准入 Webhook 也可以選擇修改傳入的物件。
這是透過在響應中使用 `patch` 和 `patchType` 欄位來完成的。
當前唯一支援的 `patchType` 是 `JSONPatch`。
有關更多詳細資訊，請參見 [JSON patch](https://jsonpatch.com/)。
對於 `patchType: JSONPatch`，`patch` 欄位包含一個以 base64 編碼的 JSON patch 運算元組。

<!--
As an example, a single patch operation that would set `spec.replicas` would be `[{"op": "add", "path": "/spec/replicas", "value": 3}]`

Base64-encoded, this would be `W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`
-->
例如，設定 `spec.replicas` 的單個補丁操作將是
`[{"op": "add", "path": "/spec/replicas", "value": 3}]`。

如果以 Base64 形式編碼，結果將是
`W3sib3AiOiAiYWRkIiwgInBhdGgiOiAiL3NwZWMvcmVwbGljYXMiLCAidmFsdWUiOiAzfV0=`

<!--
So a webhook response to add that label would be:
-->
因此，新增該標籤的 webhook 響應為：
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
-->
## Webhook 配置{#webhook-configuration}

<!--
To register admission webhooks, create `MutatingWebhookConfiguration` or `ValidatingWebhookConfiguration` API objects.

Each configuration can contain one or more webhooks.
If multiple webhooks are specified in a single configuration, each should be given a unique name.
This is required in `admissionregistration.k8s.io/v1`, but strongly recommended when using `admissionregistration.k8s.io/v1beta1`,
in order to make resulting audit logs and metrics easier to match up to active configurations.

Each webhook defines the following things.
-->
要註冊准入 Webhook，請建立 `MutatingWebhookConfiguration` 或
`ValidatingWebhookConfiguration` API 物件。

每種配置可以包含一個或多個 Webhook。如果在單個配置中指定了多個
Webhook，則應為每個 webhook 賦予一個唯一的名稱。
這在 `admissionregistration.k8s.io/v1` 中是必需的，但是在使用
`admissionregistration.k8s.io/v1beta1` 時強烈建議使用，
以使生成的稽核日誌和指標更易於與活動配置相匹配。

每個 Webhook 定義以下內容。

<!--
### Matching requests: rules
-->
### 匹配請求-規則{#matching-requests-rules}

<!--
Each webhook must specify a list of rules used to determine if a request to the API server should be sent to the webhook.
Each rule specifies one or more operations, apiGroups, apiVersions, and resources, and a resource scope:
-->
每個 webhook 必須指定用於確定是否應將對 apiserver 的請求傳送到 webhook 的規則列表。
每個規則都指定一個或多個 operations、apiGroups、apiVersions 和 resources 以及資源的 scope：

<!--
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
* `scope` 指定要匹配的範圍。有效值為 `"Cluster"`、`"Namespaced"` 和 `"*"`。
  子資源匹配其父資源的範圍。在 Kubernetes v1.14+ 版本中才被支援。
  預設值為 `"*"`，對應 1.14 版本之前的行為。
    * `"Cluster"` 表示只有叢集作用域的資源才能匹配此規則（API 物件 Namespace 是叢集作用域的）。
    * `"Namespaced"` 意味著僅具有名字空間的資源才符合此規則。
    * `"*"` 表示沒有範圍限制。

<!--
If an incoming request matches one of the specified operations, groups, versions, resources, and scope for any of a webhook's rules, the request is sent to the webhook.

Here are other examples of rules that could be used to specify which resources should be intercepted.

Match `CREATE` or `UPDATE` requests to `apps/v1` and `apps/v1beta1` `deployments` and `replicasets`:
-->
如果傳入請求與任何 Webhook 規則的指定操作、組、版本、資源和範圍匹配，則該請求將傳送到 Webhook。

以下是可用於指定應攔截哪些資源的規則的其他示例。

匹配針對 `apps/v1` 和 `apps/v1beta1` 組中 `deployments` 和 `replicasets`
資源的 `CREATE` 或 `UPDATE` 請求：

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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
匹配所有 API 組和版本中的所有資源（但不包括子資源）的建立請求：

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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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

<!--
Match update requests for all `status` subresources in all API groups and versions:
-->
匹配所有 API 組和版本中所有 `status` 子資源的更新請求：

{{< tabs name="ValidatingWebhookConfiguration_rules_2" >}}
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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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

<!--
### Matching requests: objectSelector
-->
### 匹配請求：objectSelector{#matching-requests-objectselector}

<!--
In v1.15+, webhooks may optionally limit which requests are intercepted based on the labels of the
objects they would be sent, by specifying an `objectSelector`. If specified, the objectSelector
is evaluated against both the object and oldObject that would be sent to the webhook,
and is considered to match if either object matches the selector.
-->
在版本 v1.15+ 中, 透過指定 `objectSelector`，Webhook 能夠根據
可能傳送的物件的標籤來限制哪些請求被攔截。
如果指定，則將對 `objectSelector` 和可能傳送到 Webhook 的 object 和 oldObject
進行評估。如果兩個物件之一與選擇器匹配，則認為該請求已匹配。

<!--
A null object (oldObject in the case of create, or newObject in the case of delete),
or an object that cannot have labels (like a `DeploymentRollback` or a `PodProxyOptions` object)
is not considered to match.
-->
空物件（對於建立操作而言為 oldObject，對於刪除操作而言為 newObject），
或不能帶標籤的物件（例如 `DeploymentRollback` 或 `PodProxyOptions` 物件）
被認為不匹配。

<!--
Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels.
-->
僅當選擇使用 webhook 時才使用物件選擇器，因為終端使用者可以透過設定標籤來
跳過准入 Webhook。

<!--
This example shows a mutating webhook that would match a `CREATE` of any resource with the label `foo: bar`:
-->
這個例子展示了一個 mutating webhook，它將匹配帶有標籤 `foo:bar` 的任何資源的
`CREATE` 的操作：

{{< tabs name="objectSelector_example" >}}
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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
-->
有關標籤選擇器的更多示例，請參見[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels)。

<!--
### Matching requests: namespaceSelector
-->
### 匹配請求：namespaceSelector {#matching-requests-namespaceselector}

<!--
Webhooks may optionally limit which requests for namespaced resources are intercepted,
based on the labels of the containing namespace, by specifying a `namespaceSelector`.
-->
透過指定 `namespaceSelector`，Webhook 可以根據具有名字空間的資源所處的
名字空間的標籤來選擇攔截哪些資源的操作。

<!--
The `namespaceSelector` decides whether to run the webhook on a request for a namespaced resource
(or a Namespace object), based on whether the namespace's labels match the selector.
If the object itself is a namespace, the matching is performed on object.metadata.labels.
If the object is a cluster scoped resource other than a Namespace, `namespaceSelector` has no effect.
-->
`namespaceSelector` 根據名字空間的標籤是否匹配選擇器，決定是否針對具名字空間的資源
（或 Namespace 物件）的請求執行 webhook。
如果物件是除 Namespace 以外的叢集範圍的資源，則 `namespaceSelector` 標籤無效。

<!--
This example shows a mutating webhook that matches a `CREATE` of any namespaced resource inside a namespace
that does not have a "runlevel" label of "0" or "1":
-->
本例給出的修改性質的 Webhook 將匹配到對名字空間中具名字空間的資源的 `CREATE` 請求，
前提是這些資源不含值為 "0" 或 "1" 的 "runlevel" 標籤：

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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
此示例顯示了一個驗證性質的 Webhook，它將匹配到對某名字空間中的任何具名字空間的資源的
`CREATE` 請求，前提是該名字空間具有值為 "prod" 或 "staging" 的 "environment" 標籤：

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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
-->
有關標籤選擇器的更多示例，請參見
[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels)。

<!--
### Matching requests: matchPolicy
-->
### 匹配請求：matchPolicy {#matching-requests-matchpolicy}

<!--
API servers can make objects available via multiple API groups or versions.
For example, the Kubernetes API server allows creating and modifying `Deployment` objects
via `extensions/v1beta1`, `apps/v1beta1`, `apps/v1beta2`, and `apps/v1` APIs.
-->
API 伺服器可以透過多個 API 組或版本來提供物件。
例如，Kubernetes API 伺服器允許透過 `extensions/v1beta1`、`apps/v1beta1`、
`apps/v1beta2` 和 `apps/v1` API 建立和修改 `Deployment` 物件。

<!--
For example, if a webhook only specified a rule for some API groups/versions (like `apiGroups:["apps"], apiVersions:["v1","v1beta1"]`),
and a request was made to modify the resource via another API group/version (like `extensions/v1beta1`),
the request would not be sent to the webhook.
-->
例如，如果一個 webhook 僅為某些 API 組/版本指定了規則（例如
`apiGroups:["apps"], apiVersions:["v1","v1beta1"]`），而修改資源的請求
是透過另一個 API 組/版本（例如 `extensions/v1beta1`）發出的，
該請求將不會被髮送到 Webhook。

<!--
In v1.15+, `matchPolicy` lets a webhook define how its `rules` are used to match incoming requests.
Allowed values are `Exact` or `Equivalent`.
-->
在 v1.15+ 中，`matchPolicy` 允許 webhook 定義如何使用其 `rules` 匹配傳入的請求。
允許的值為 `Exact` 或 `Equivalent`。

<!--
* `Exact` means a request should be intercepted only if it exactly matches a specified rule.
* `Equivalent` means a request should be intercepted if modifies a resource listed in `rules`, even via another API group or version.

In the example given above, the webhook that only registered for `apps/v1` could use `matchPolicy`:
* `matchPolicy: Exact` would mean the `extensions/v1beta1` request would not be sent to the webhook
* `matchPolicy: Equivalent` means the `extensions/v1beta1` request would be sent to the webhook (with the objects converted to a version the webhook had specified: `apps/v1`)
-->
* `Exact` 表示僅當請求與指定規則完全匹配時才應攔截該請求。
* `Equivalent` 表示如果某個請求意在修改 `rules` 中列出的資源，
  即使該請求是透過其他 API 組或版本發起，也應攔截該請求。

在上面給出的示例中，僅為 `apps/v1` 註冊的 webhook 可以使用 `matchPolicy`：
* `matchPolicy: Exact` 表示不會將 `extensions/v1beta1` 請求傳送到 Webhook
* `matchPolicy:Equivalent` 表示將 `extensions/v1beta1` 請求傳送到 webhook
  （將物件轉換為 webhook 指定的版本：`apps/v1`）

<!--
Specifying `Equivalent` is recommended, and ensures that webhooks continue to intercept the
resources they expect when upgrades enable new versions of the resource in the API server.
-->
建議指定 `Equivalent`，確保升級後啟用 API 伺服器中資源的新版本時，
Webhook 繼續攔截他們期望的資源。

<!--
When a resource stops being served by the API server, it is no longer considered equivalent to other versions of that resource that are still served.
For example, deprecated `extensions/v1beta1` deployments are scheduled to stop being served by default in v1.16.
Once that occurs, a webhook with a `apiGroups:["extensions"], apiVersions:["v1beta1"], resources:["deployments"]` rule
would no longer intercept deployments created via `apps/v1` APIs. For that reason, webhooks should prefer registering
for stable versions of resources.
-->
當 API 伺服器停止提供某資源時，該資源不再被視為等同於該資源的其他仍在提供服務的版本。
例如，`extensions/v1beta1` 中的 Deployment 已被廢棄，計劃在 v1.16 中預設停止使用。
在這種情況下，帶有 `apiGroups:["extensions"], apiVersions:["v1beta1"], resources: ["deployments"]` 
規則的 Webhook 將不再攔截透過 `apps/v1` API 來建立 Deployment 的請求。
["deployments"] 規則將不再攔截透過 `apps/v1` API 建立的部署。

<!--
This example shows a validating webhook that intercepts modifications to deployments (no matter the API group or version),
and is always sent an `apps/v1` `Deployment` object:
-->
此示例顯示了一個驗證性質的 Webhook，該 Webhook 攔截對 Deployment 的修改（無論 API 組或版本是什麼），
始終會發送一個 `apps/v1` 版本的 Deployment 物件：

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
使用 `admissionregistration.k8s.io/v1` 建立的 admission webhhok 預設為 `Equivalent`。

{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
使用 `admissionregistration.k8s.io/v1beta1` 建立的准入 Webhook 預設為 `Exact`。
{{% /tab %}}
{{< /tabs >}}

<!--
### Contacting the webhook
-->
### 呼叫 Webhook

<!--
Once the API server has determined a request should be sent to a webhook,
it needs to know how to contact the webhook. This is specified in the `clientConfig`
stanza of the webhook configuration.

Webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.
-->
API 伺服器確定請求應傳送到 webhook 後，它需要知道如何呼叫 webhook。
此資訊在 webhook 配置的 `clientConfig` 節中指定。

Webhook 可以透過 URL 或服務引用來呼叫，並且可以選擇包含自定義 CA 包，以用於驗證 TLS 連線。

<!--
#### URL
-->
#### URL{#url}

<!--
`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`).
-->
`url` 以標準 URL 形式給出 webhook 的位置（`scheme://host:port/path`）。

<!--
The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some apiservers
(e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would
be a layering violation). `host` may also be an IP address.
-->
`host` 不應引用叢集中執行的服務；透過指定 `service` 欄位來使用服務引用。
主機可以透過某些 apiserver 中的外部 DNS 進行解析。
（例如，`kube-apiserver` 無法解析叢集內 DNS，因為這將違反分層規則）。`host` 也可以是 IP 地址。

<!--
Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an apiserver which might need to make calls to this
webhook. Such installations are likely to be non-portable, i.e., not easy
to turn up in a new cluster.
-->
請注意，將 `localhost` 或 `127.0.0.1` 用作 `host` 是有風險的，
除非你非常小心地在所有執行 apiserver 的、可能需要對此 webhook 
進行呼叫的主機上執行。這樣的安裝方式可能不具有可移植性，即很難在新叢集中啟用。

<!--
The scheme must be "https"; the URL must begin with "https://".
-->
scheme 必須為 "https"；URL 必須以 "https://" 開頭。

<!--
Attempting to use a user or basic auth e.g. "user:password@" is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.
-->
使用使用者或基本身份驗證（例如："user:password@"）是不允許的。
使用片段（"#..."）和查詢引數（"?..."）也是不允許的。

<!--
Here is an example of a mutating webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
-->
這是配置為呼叫 URL 的修改性質的 Webhook 的示例
（並且期望使用系統信任根證書來驗證 TLS 證書，因此不指定 caBundle）：

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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
-->
#### 服務引用  {#service-reference}

<!--
The `service` stanza inside `clientConfig` is a reference to the service for this webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".
-->
`clientConfig` 內部的 Service 是對該 Webhook 服務的引用。
如果 Webhook 在叢集中執行，則應使用 `service` 而不是 `url`。
服務的 `namespace` 和 `name` 是必需的。
`port` 是可選的，預設值為 443。`path` 是可選的，預設為 "/"。

<!--
Here is an example of a mutating webhook configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle:
-->
這是一個 mutating Webhook 的示例，該 mutating Webhook 配置為在子路徑 "/my-path" 埠
"1234" 上呼叫服務，並使用自定義 CA 包針對 ServerName
`my-service-name.my-service-namespace.svc` 驗證 TLS 連線：

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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
-->
### 副作用{#side-effects}

<!--
Webhooks typically operate only on the content of the `AdmissionReview` sent to them.
Some webhooks, however, make out-of-band changes as part of processing admission requests.
-->
Webhook 通常僅對傳送給他們的 `AdmissionReview` 內容進行操作。
但是，某些 Webhook 在處理 admission 請求時會進行帶外更改。

<!--
Webhooks that make out-of-band changes ("side effects") must also have a reconcilation mechanism
(like a controller) that periodically determines the actual state of the world, and adjusts
the out-of-band data modified by the admission webhook to reflect reality.
This is because a call to an admission webhook does not guarantee the admitted object will be persisted as is, or at all.
Later webhooks can modify the content of the object, a conflict could be encountered while writing to storage,
or the server could power off before persisting the object.
-->
進行帶外更改的（產生“副作用”的） Webhook 必須具有協調機制（如控制器），
該機制定期確定事物的實際狀態，並調整由准入 Webhook 修改的帶外資料以反映現實情況。
這是因為對準入 Webhook 的呼叫不能保證所准入的物件將原樣保留，或根本不保留。
以後，webhook 可以修改物件的內容，在寫入儲存時可能會發生衝突，或者
伺服器可以在持久儲存物件之前關閉電源。

<!--
Additionally, webhooks with side effects must skip those side-effects when `dryRun: true` admission requests are handled.
A webhook must explicitly indicate that it will not have side-effects when run with `dryRun`,
or the dry-run request will not be sent to the webhook and the API request will fail instead.
-->
此外，處理 `dryRun: true` admission 請求時，具有副作用的 Webhook 必須避免產生副作用。
一個 Webhook 必須明確指出在使用 `dryRun` 執行時不會有副作用，
否則 `dry-run` 請求將不會發送到該 Webhook，而 API 請求將會失敗。

<!--
Webhooks indicate whether they have side effects using the `sideEffects` field in the webhook configuration:
* `Unknown`: no information is known about the side effects of calling the webhook.
If a request with `dryRun: true` would trigger a call to this webhook, the request will instead fail, and the webhook will not be called.
* `None`: calling the webhook will have no side effects.
* `Some`: calling the webhook will possibly have side effects.
If a request with the dry-run attribute would trigger a call to this webhook, the request will instead fail, and the webhook will not be called.
* `NoneOnDryRun`: calling the webhook will possibly have side effects,
but if a request with `dryRun: true` is sent to the webhook, the webhook will suppress the side effects (the webhook is `dryRun`-aware).
-->
Webhook 使用 webhook 配置中的 `sideEffects` 欄位顯示它們是否有副作用：
* `Unknown`：有關呼叫 Webhook 的副作用的資訊是不可知的。
如果帶有 `dryRun：true` 的請求將觸發對該 Webhook 的呼叫，則該請求將失敗，並且不會呼叫該 Webhook。
* `None`：呼叫 webhook 沒有副作用。
* `Some`：呼叫 webhook 可能會有副作用。
  如果請求具有 `dry-run` 屬性將觸發對此 Webhook 的呼叫，
  則該請求將會失敗，並且不會呼叫該 Webhook。
* `NoneOnDryRun`：呼叫 webhook 可能會有副作用，但是如果將帶有 `dryRun: true`
  屬性的請求傳送到 webhook，則 webhook 將抑制副作用（該 webhook 可識別 `dryRun`）。

<!--
Allowed values:
* In `admissionregistration.k8s.io/v1beta1`, `sideEffects` may be set to `Unknown`, `None`, `Some`, or `NoneOnDryRun`, and defaults to `Unknown`.
* In `admissionregistration.k8s.io/v1`, `sideEffects` must be set to `None` or `NoneOnDryRun`.
-->
允許值：
* 在 `admissionregistration.k8s.io/v1beta1` 中，`sideEffects` 可以設定為
  `Unknown`、`None`、`Some` 或者 `NoneOnDryRun`，並且預設值為 `Unknown`。
* 在 `admissionregistration.k8s.io/v1` 中, `sideEffects` 必須設定為
  `None` 或者 `NoneOnDryRun`。

<!--
Here is an example of a validating webhook indicating it has no side effects on `dryRun: true` requests:
-->
這是一個 validating webhook 的示例，表明它對 `dryRun: true` 請求沒有副作用：

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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
-->
### 超時{#timeouts}

<!--
Because webhooks add to API request latency, they should evaluate as quickly as possible.
`timeoutSeconds` allows configuring how long the API server should wait for a webhook to respond
before treating the call as a failure.
-->
由於 Webhook 會增加 API 請求的延遲，因此應儘快完成自身的操作。
`timeoutSeconds` 用來配置在將呼叫視為失敗之前，允許 API 伺服器等待 Webhook 響應的時間長度。

<!--
If the timeout expires before the webhook responds, the webhook call will be ignored or
the API call will be rejected based on the [failure policy](#failure-policy).

The timeout value must be between 1 and 30 seconds.

Here is an example of a validating webhook with a custom timeout of 2 seconds:
-->
如果超時在 Webhook 響應之前被觸發，則基於[失敗策略](#failure-policy)，將忽略
Webhook 呼叫或拒絕 API 呼叫。

超時值必須設定在 1 到 30 秒之間。

這是一個自定義超時設定為 2 秒的 validating Webhook 的示例：

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
使用 `admissionregistration.k8s.io/v1` 建立的准入 Webhook 預設超時為 10 秒。
{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
...
webhooks:
- name: my-webhook.example.com
  timeoutSeconds: 2
  ...
```

<!--
Admission webhooks created using `admissionregistration.k8s.io/v1beta1` default timeouts to 30 seconds.
-->
使用 `admissionregistration.k8s.io/v1beta1` 建立的准入 Webhook 預設超時為 30 秒。
{{% /tab %}}
{{< /tabs >}}

<!--
### Reinvocation policy
-->
### 再呼叫策略  {#reinvocation-policy}

<!--
A single ordering of mutating admissions plugins (including webhooks) does not work for all cases
(see https://issue.k8s.io/64333 as an example). A mutating webhook can add a new sub-structure
to the object (like adding a `container` to a `pod`), and other mutating plugins which have already
run may have opinions on those new structures (like setting an `imagePullPolicy` on all containers).
-->
修改性質的准入外掛（包括 Webhook）的任何一種排序方式都不會適用於所有情況。
(參見 https://issue.k8s.io/64333 示例)。
修改性質的 Webhook 可以向物件中新增新的子結構（例如向 `pod` 中新增 `container`），
已經執行的其他修改外掛可能會對這些新結構有影響
（就像在所有容器上設定 `imagePullPolicy` 一樣）。

<!--
In v1.15+, to allow mutating admission plugins to observe changes made by other plugins,
built-in mutating admission plugins are re-run if a mutating webhook modifies an object,
and mutating webhooks can specify a `reinvocationPolicy` to control whether they are reinvoked as well.
-->
在 v1.15+ 中，允許修改性質的准入外掛感應到其他外掛所做的更改，
如果修改性質的 Webhook 修改了一個物件，則會重新執行內建的修改性質的准入外掛，
並且修改性質的 Webhook 可以指定 `reinvocationPolicy` 來控制是否也重新呼叫它們。

<!--
`reinvocationPolicy` may be set to `Never` or `IfNeeded`. It defaults to `Never`.
-->
可以將 `reinvocationPolicy` 設定為 `Never` 或 `IfNeeded`。 預設為 `Never`。

<!--
* `Never`: the webhook must not be called more than once in a single admission evaluation
* `IfNeeded`: the webhook may be called again as part of the admission evaluation if the object
being admitted is modified by other admission plugins after the initial webhook call.
-->
* `Never`: 在一次准入測試中，不得多次呼叫 Webhook。
* `IfNeeded`: 如果在最初的 Webhook 呼叫之後被其他物件的外掛修改了被接納的物件，
  則可以作為準入測試的一部分再次呼叫該 webhook。

<!--
The important elements to note are:
-->
要注意的重要因素有：

<!--
* The number of additional invocations is not guaranteed to be exactly one.
* If additional invocations result in further modifications to the object, webhooks are not guaranteed to be invoked again.
* Webhooks that use this option may be reordered to minimize the number of additional invocations.
* To validate an object after all mutations are guaranteed complete, use a validating admission webhook instead (recommended for webhooks with side-effects).
-->
* 不能保證附加呼叫的次數恰好是一。
* 如果其他呼叫導致對該物件的進一步修改，則不能保證再次呼叫 Webhook。
* 使用此選項的 Webhook 可能會重新排序，以最大程度地減少額外呼叫的次數。
* 要在確保所有修改都完成後驗證物件，請改用驗證性質的 Webhook
  （推薦用於有副作用的 Webhook）。

<!--
Here is an example of a mutating webhook opting into being re-invoked if later admission plugins modify the object:
-->
這是一個修改性質的 Webhook 的示例，該 Webhook 在以後的准入外掛修改物件時被重新呼叫：

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
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
-->
修改性質的 Webhook 必須具有[冪等](#idempotence)性，並且能夠成功處理
已被接納並可能被修改的物件的修改性質的 Webhook。
對於所有修改性質的准入 Webhook 都是如此，因為它們可以在物件中進行的
任何更改可能已經存在於使用者提供的物件中，但是對於選擇重新呼叫的 webhook
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
`failurePolicy` 定義瞭如何處理准入 webhook 中無法識別的錯誤和超時錯誤。允許的值為 `Ignore` 或 `Fail`。

* `Ignore` 表示呼叫 webhook 的錯誤將被忽略並且允許 API 請求繼續。
* `Fail` 表示呼叫 webhook 的錯誤導致准入失敗並且 API 請求被拒絕。

這是一個修改性質的 webhook，配置為在呼叫准入 Webhook 遇到錯誤時拒絕 API 請求：

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
使用 `admissionregistration.k8s.io/v1` 建立的准入 Webhook 將
`failurePolicy` 預設設定為 `Fail`。

{{% /tab %}}
{{% tab name="admissionregistration.k8s.io/v1beta1" %}}
```yaml
# v1.16 中被廢棄，推薦使用 admissionregistration.k8s.io/v1
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
使用 `admissionregistration.k8s.io/v1beta1` 建立的准入 Webhook 將
`failurePolicy` 預設設定為 `Ignore`。
{{% /tab %}}
{{< /tabs >}}

<!--
## Monitoring admission webhooks
-->
## 監控 Admission Webhook    {#monitoring-admission-webhooks}

<!--
The API server provides ways to monitor admission webhook behaviors. These
monitoring mechanisms help cluster admins to answer questions like:

1. Which mutating webhook mutated the object in a API request?

2. What change did the mutating webhook applied to the object?

3. Which webhooks are frequently rejecting API requests? What's the reason for a
   rejection?
-->
API 伺服器提供了監視准入 Webhook 行為的方法。這些監視機制可幫助叢集管理員
回答以下問題：

1. 哪個修改性質的 webhook 改變了 API 請求中的物件？
2. 修改性質的 Webhook 對物件做了哪些更改？
3. 哪些 webhook 經常拒絕 API 請求？是什麼原因拒絕？

<!--
### Mutating webhook auditing annotations
-->
### Mutating Webhook 審計註解

<!--
Sometimes it's useful to know which mutating webhook mutated the object in a API request, and what change did the
webhook apply.
-->
有時，瞭解 API 請求中的哪個修改性質的 Webhook 使物件改變以及該
Webhook 應用了哪些更改很有用。

<!--
In v1.16+, kube-apiserver performs [auditing](/docs/tasks/debug/debug-cluster/audit/) on each mutating webhook
invocation. Each invocation generates an auditing annotation
capturing if a request object is mutated by the invocation, and optionally generates an annotation capturing the applied
patch from the webhook admission response. The annotations are set in the audit event for given request on given stage of
its execution, which is then pre-processed according to a certain policy and written to a backend.
-->
在 v1.16+ 中，kube-apiserver 針對每個修改性質的 Webhook 呼叫執行[審計](/zh-cn/docs/tasks/debug/debug-cluster/audit/)操作。
每個呼叫都會生成一個審計註解，記述請求物件是否發生改變，
可選地還可以根據 webhook 的准入響應生成一個註解，記述所應用的修補。
針對給定請求的給定執行階段，註解被新增到審計事件中，
然後根據特定策略進行預處理並寫入後端。

<!--
The audit level of a event determines which annotations get recorded:
-->
事件的審計級別決定了要記錄哪些註解：

<!--
- At `Metadata` audit level or higher, an annotation with key
`mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` gets logged with JSON payload indicating
a webhook gets invoked for given request and whether it mutated the object or not.
-->
在 `Metadata` 或更高審計級別上，將使用 JSON 負載記錄帶有鍵名
`mutation.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` 的註解，
該註解表示針對給定請求呼叫了 Webhook，以及該 Webhook 是否更改了物件。

<!--
For example, the following annotation gets recorded for a webhook being reinvoked. The webhook is ordered the third in the
mutating webhook chain, and didn't mutated the request object during the invocation.
-->
例如，對於正在被重新呼叫的某 Webhook，所記錄的註解如下。
Webhook 在 mutating Webhook 鏈中排在第三個位置，並且在呼叫期間未改變請求物件。

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
    # 其他欄位
    ...
}
```

```yaml
# 反序列化的註解值
{
    "configuration": "my-mutating-webhook-configuration.example.com",
    "webhook": "my-webhook.example.com",
    "mutated": false
}
```

<!--
The following annotation gets recorded for a webhook being invoked in the first round. The webhook is ordered the first in\
the mutating webhook chain, and mutated the request object during the invocation.
-->
對於在第一輪中呼叫的 Webhook，所記錄的註解如下。
Webhook 在 mutating Webhook 鏈中排在第一位，並在呼叫期間改變了請求物件。

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
    # 其他欄位
    ...
}
```

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
在 `Request` 或更高審計級別上，將使用 JSON 負載記錄帶有鍵名為
`patch.webhook.admission.k8s.io/round_{round idx}_index_{order idx}` 的註解，
該註解表明針對給定請求呼叫了 Webhook 以及應用於請求物件之上的修改。

<!--
For example, the following annotation gets recorded for a webhook being reinvoked. The webhook is ordered the fourth in the
mutating webhook chain, and responded with a JSON patch which got applied to the request object.
-->
例如，以下是針對正在被重新呼叫的某 Webhook 所記錄的註解。
Webhook 在修改性質的 Webhook 鏈中排在第四，並在其響應中包含一個 JSON 補丁，
該補丁已被應用於請求物件。

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
    # 其他欄位
    ...
}
```

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
### 准入 Webhook 度量值

<!--
Kube-apiserver exposes Prometheus metrics from the `/metrics` endpoint, which can be used for monitoring and
diagnosing API server status. The following metrics record status related to admission webhooks.
-->
Kube-apiserver 從 `/metrics` 端點公開 Prometheus 指標，這些指標可用於監控和診斷
apiserver 狀態。以下指標記錄了與准入 Webhook 相關的狀態。

<!--
#### API server admission webhook rejection count
-->
#### apiserver 准入 Webhook 拒絕次數

<!--
Sometimes it's useful to know which admission webhooks are frequently rejecting API requests, and the
reason for a rejection.

In v1.16+, kube-apiserver exposes a Prometheus counter metric recording admission webhook rejections. The
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
- `operation`：請求的操作型別可以是 `CREATE`、`UPDATE`、`DELETE` 和 `CONNECT` 其中之一。
- `type`：Admission webhook 型別，可以是 `admit` 和 `validating` 其中之一。
- `error_type`：標識在 webhook 呼叫期間是否發生了錯誤並且導致了拒絕。其值可以是以下之一：
  - `calling_webhook_error`：發生了來自准入 Webhook 的無法識別的錯誤或超時錯誤，
    並且 webhook 的 [失敗策略](#failure-policy) 設定為 `Fail`。
  - `no_error`：未發生錯誤。Webhook 在准入響應中以 `allowed: false` 值拒絕了請求。
    度量標籤 `rejection_code` 記錄了在准入響應中設定的 `.status.code`。
  - `apiserver_internal_error`：apiserver 發生內部錯誤。
- `rejection_code`：當 Webhook 拒絕請求時，在准入響應中設定的 HTTP 狀態碼。

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
## 最佳實踐和警告

### 冪等性  {#idempotence}

<!--
An idempotent mutating admission webhook is able to successfully process an object it has already admitted
and potentially modified. The admission can be applied multiple times without changing the result beyond
the initial application.
-->
冪等的修改性質的准入 Webhook 能夠成功處理已經被它接納甚或修改的物件。
即使多次執行該准入測試，也不會產生與初次執行結果相異的結果。

<!--
#### Example of idempotent mutating admission webhooks:

1. For a `CREATE` pod request, set the field `.spec.securityContext.runAsNonRoot` of the
   pod to true, to enforce security best practices.

2. For a `CREATE` pod request, if the field `.spec.containers[].resources.limits`
   of a container is not set, set default resource limits.

3. For a `CREATE` pod request, inject a sidecar container with name `foo-sidecar` if no container with the name `foo-sidecar` already exists.

In the cases above, the webhook can be safely reinvoked, or admit an object that already has the fields set.
-->
#### 冪等 mutating admission Webhook 的示例：

1. 對於 `CREATE` Pod 請求，將 Pod 的欄位 `.spec.securityContext.runAsNonRoot`
   設定為 true，以實施安全最佳實踐。
2. 對於 `CREATE` Pod 請求，如果未設定容器的欄位
   `.spec.containers[].resources.limits`，設定預設資源限制值。
3. 對於 `CREATE` pod 請求，如果 Pod 中不存在名為 `foo-sidecar` 的邊車容器，
   向 Pod 注入一個 `foo-sidecar` 容器。

在上述情況下，可以安全地重新呼叫 Webhook，或接受已經設定了欄位的物件。

<!--
#### Example of non-idempotent mutating admission webhooks:
-->
#### 非冪等 mutating admission Webhook 的示例：

<!--
1. For a `CREATE` pod request, inject a sidecar container with name `foo-sidecar`
   suffixed with the current timestamp (e.g. `foo-sidecar-19700101-000000`).

2. For a `CREATE`/`UPDATE` pod request, reject if the pod has label `"env"` set,
   otherwise add an `"env": "prod"` label to the pod.

3. For a `CREATE` pod request, blindly append a sidecar container named
   `foo-sidecar` without looking to see if there is already a `foo-sidecar`
   container in the pod.
-->
1. 對於 `CREATE` pod 請求，注入名稱為 `foo-sidecar` 並帶有當前時間戳的
   邊車容器（例如 `foo-sidecar-19700101-000000`）。
2. 對於 `CREATE/UPDATE` pod 請求，如果容器已設定標籤 `"env"` 則拒絕，
   否則將 `"env": "prod"` 標籤新增到容器。
3. 對於 `CREATE` pod 請求，盲目地新增一個名為 `foo-sidecar` 的邊車容器，
   而未檢視 Pod 中是否已經有 `foo-sidecar` 容器。

<!--
In the first case above, reinvoking the webhook can result in the same sidecar being injected multiple times to a pod, each time
with a different container name. Similarly the webhook can inject duplicated containers if the sidecar already exists in
a user-provided pod.

In the second case above, reinvoking the webhook will result in the webhook failing on its own output.

In the third case above, reinvoking the webhook will result in duplicated containers in the pod spec, which makes
the request invalid and rejected by the API server.
-->
在上述第一種情況下，重新呼叫該 Webhook 可能導致同一個 Sidecar 容器
多次注入到 Pod 中，而且每次使用不同的容器名稱。
類似地，如果 Sidecar 已存在於使用者提供的 Pod 中，則 Webhook 可能注入重複的容器。

在上述第二種情況下，重新呼叫 Webhook 將導致 Webhook 自身輸出失敗。

在上述第三種情況下，重新呼叫 Webhook 將導致 Pod 規範中的容器重複，
從而使請求無效並被 API 伺服器拒絕。

<!--
### Intercepting all versions of an object

It is recommended that admission webhooks should always intercept all versions of an object by setting `.webhooks[].matchPolicy`
to `Equivalent`. It is also recommended that admission webhooks should prefer registering for stable versions of resources.
Failure to intercept all versions of an object can result in admission policies not being enforced for requests in certain
versions. See [Matching requests: matchPolicy](#matching-requests-matchpolicy) for examples.
-->
### 攔截物件的所有版本

建議透過將 `.webhooks[].matchPolicy` 設定為 `Equivalent`，
以確保准入 Webhooks 始終攔截物件的所有版本。
建議准入 Webhooks 應該更偏向註冊資源的穩定版本。
如果無法攔截物件的所有版本，可能會導致准入策略未再某些版本的請求上執行。
有關示例，請參見[匹配請求：matchPolicy](#matching-requests-matchpolicy)。

<!--
### Availability

It is recommended that admission Webhooks should evaluate as quickly as possible (typically in milliseconds), since they add to API request latency.
It is encouraged to use a small timeout for webhooks. See [Timeouts](#timeouts) for more detail.

It is recommended that admission webhooks should leverage some format of load-balancing, to provide high availability and
performance benefits. If a webhook is running within the cluster, you can run multiple webhook backends behind a service
to leverage the load-balancing that service supports.
-->
### 可用性   {#availability}

建議准入 webhook 儘快完成執行（時長通常是毫秒級），因為它們會增加 API 請求的延遲。
建議對 Webhook 使用較小的超時值。有關更多詳細資訊，請參見[超時](#timeouts)。

建議 Admission Webhook 應該採用某種形式的負載均衡機制，以提供高可用性和高效能。
如果叢集中正在執行 Webhook，則可以在服務後面執行多個 Webhook 後端，以利用該服務支援的負載均衡。

<!--
### Guaranteeing the final state of the object is seen

Admission webhooks that need to guarantee they see the final state of the object in order to enforce policy
should use a validating admission webhook, since objects can be modified after being seen by mutating webhooks.

For example, a mutating admission webhook is configured to inject a sidecar container with name "foo-sidecar" on every
`CREATE` pod request. If the sidecar *must* be present, a validating admisson webhook should also be configured to intercept `CREATE` pod requests, and validate
that a container with name "foo-sidecar" with the expected configuration exists in the to-be-created object.
-->

### 確保看到物件的最終狀態

如果某准入 Webhook 需要保證自己能夠看到物件的最終狀態以實施策略，
則應該使用一個驗證性質的 webhook，
因為可以透過 mutating Webhook 看到物件後對其進行修改。

例如，一個修改性質的准入Webhook 被配置為在每個 `CREATE` Pod 請求中
注入一個名稱為 "foo-sidecar" 的 sidecar 容器。

如果*必須*存在邊車容器，則還應配置一個驗證性質的准入 Webhook 以攔截
`CREATE` Pod 請求，並驗證要建立的物件中是否存在具有預期配置的名稱為
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

It is recommended to exclude the namespace where your webhook is running with a [namespaceSelector](#matching-requests-namespaceselector).
-->
### 避免自託管的 Webhooks 中出現死鎖

如果叢集內的 Webhook 配置能夠攔截啟動其自己的 Pod 所需的資源，
則該 Webhook 可能導致其自身部署時發生死鎖。

例如，某修改性質的准入 Webhook 配置為僅當 Pod 中設定了某個標籤
（例如 `"env": "prod"`）時，才接受 `CREATE` Pod 請求。
Webhook 伺服器在未設定 `"env"` 標籤的 Deployment 中執行。當執行 Webhook 伺服器的
容器的節點執行不正常時，Webhook 部署嘗試將容器重新排程到另一個節點。
但是，由於未設定 `"env"` 標籤，因此請求將被現有的 Webhook 伺服器拒絕，並且排程遷移不會發生。

建議使用 [namespaceSelector](#matching-requests-namespaceselector) 排除
Webhook 所在的名字空間。

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

建議准入 Webhook 應儘可能避免副作用，這意味著該准入 webhook 僅對傳送給他們的
`AdmissionReview` 的內容起作用，並且不要進行額外更改。
如果 Webhook 沒有任何副作用，則 `.webhooks[].sideEffects` 欄位應設定為
`None`。

如果在准入執行期間存在副作用，則應在處理 `dryRun` 為 `true` 的 `AdmissionReview`
物件時避免產生副作用，並且其 `.webhooks[].sideEffects` 欄位應設定為
`NoneOnDryRun`。更多詳細資訊，請參見[副作用](#side-effects)。

<!--
### Avoiding operating on the kube-system namespace
-->
### 避免對 kube-system 名字空間進行操作

<!--
The `kube-system` namespace contains objects created by the Kubernetes system,
e.g. service accounts for the control plane components, pods like `kube-dns`.
Accidentally mutating or rejecting requests in the `kube-system` namespace may
cause the control plane components to stop functioning or introduce unknown behavior.
If your admission webhooks don't intend to modify the behavior of the Kubernetes control
plane, exclude the `kube-system` namespace from being intercepted using a
[`namespaceSelector`](#matching-requests-namespaceselector).
-->
`kube-system` 名字空間包含由 Kubernetes 系統建立的物件，
例如用於控制平面元件的服務賬號，諸如 `kube-dns` 之類的 Pod 等。
意外更改或拒絕 `kube-system` 名字空間中的請求可能會導致控制平面元件
停止執行或者導致未知行為發生。
如果你的准入 Webhook 不想修改 Kubernetes 控制平面的行為，請使用
[`namespaceSelector`](#matching-requests-namespaceselector) 避免
攔截 `kube-system` 名字空間。

