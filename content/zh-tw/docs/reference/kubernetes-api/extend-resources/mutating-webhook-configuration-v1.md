---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MutatingWebhookConfiguration"
content_type: "api_reference"
description: "MutatingWebhookConfiguration 描述准入 Webhook 的設定，該 Webhook 可在更改對象的情況下接受或拒絕對象請求"
title: "MutatingWebhookConfiguration"
weight: 3
---

<!-- 
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MutatingWebhookConfiguration"
content_type: "api_reference"
description: "MutatingWebhookConfiguration describes the configuration of and admission webhook that accept or reject and object without changing it."
title: "MutatingWebhookConfiguration"
weight: 3
-->

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## MutatingWebhookConfiguration {#MutatingWebhookConfiguration}

<!-- 
MutatingWebhookConfiguration describes the configuration of and admission webhook that accept or reject and may change the object.
-->
MutatingWebhookConfiguration 描述准入 Webhook 的設定，該 Webhook 可接受或拒絕對象請求，並且可能變更對象。

<hr>

- **apiVersion**：admissionregistration.k8s.io/v1

- **kind**：MutatingWebhookConfiguration
<!-- 
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata. 
-->

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料，更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

<!-- 
- **webhooks** ([]MutatingWebhook)

  *Patch strategy: merge on key `name`*

  *Map: unique values on key name will be kept during a merge*

  Webhooks is a list of webhooks and the affected resources and operations.

  <a name="MutatingWebhook"></a>
  *MutatingWebhook describes an admission webhook and the resources and operations it applies to.* 
-->

- **webhooks** ([]MutatingWebhook)

  **補丁策略：根據 `name` 鍵執行合併操作**

  **映射：基於 `name` 鍵的唯一值將在合併期間被保留**

  webhooks 是 Webhook 及其所影響的資源和操作的列表。

  <a name="MutatingWebhook"></a>
  **MutatingWebhook 描述了一個准入 Webhook 及其適用的資源和操作。**

  <!-- 
  - **webhooks.admissionReviewVersions** ([]string), required

    *Atomic: will be replaced during a merge*  
  
    AdmissionReviewVersions is an ordered list of preferred `AdmissionReview` versions the Webhook expects. API server will try to use first version in the list which it supports. If none of the versions specified in this list supported by API server, validation will fail for this object. If a persisted webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail and be subject to the failure policy. 
  -->

  - **webhooks.admissionReviewVersions** ([]string)，必需

    **原子性：將在合併期間被替換**

    admissionReviewVersions 是 Webhook 期望的 `AdmissionReview` 版本的優選順序列表。
    API 伺服器將嘗試使用它所支持的版本列表中的第一個版本。如果 API 伺服器不支持此列表中設置的任何版本，則此對象將驗證失敗。
    如果持久化的 Webhook 設定指定了所允許的版本，但其中不包括 API 伺服器所知道的任何版本，
    則對 Webhook 的調用將失敗並根據失敗策略進行處理。

  <!-- 
  - **webhooks.clientConfig** (WebhookClientConfig), required

    ClientConfig defines how to communicate with the hook. Required

    <a name="WebhookClientConfig"></a>
    *WebhookClientConfig contains the information to make a TLS connection with the webhook* 
  -->

  - **webhooks.clientConfig** (WebhookClientConfig)，必需

    clientConfig 定義瞭如何與 Webhook 通信。必需。

    <a name="WebhookClientConfig"></a>
    **WebhookClientConfig 包含與 Webhook 建立 TLS 連接的資訊**

      <!-- 
      - **webhooks.clientConfig.caBundle** ([]byte)

        `caBundle` is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used. 
      -->

    - **webhooks.clientConfig.caBundle** ([]byte)

      `caBundle` 是一個 PEM 編碼的 CA 包，將用於驗證 Webhook 的服務證書。如果未指定，則使用 apiserver 上的系統信任根。

    <!-- 
    - **webhooks.clientConfig.service** (ServiceReference)

      `service` is a reference to the service for this webhook. Either `service` or `url` must be specified.
      
      If the webhook is running within the cluster, then you should use `service`.

      <a name="ServiceReference"></a>
      *ServiceReference holds a reference to Service.legacy.k8s.io* 
    -->

    - **webhooks.clientConfig.service** (ServiceReference)

      `service` 是對此 Webhook 的服務的引用。必須指定 `service` 或 `url` 之一。

      如果 Webhook 在叢集中運行，那麼你應該使用 `service`。

      <a name="ServiceReference"></a>
      **ServiceReference 包含對 Service.legacy.k8s.io 的引用**

        <!-- 
        - **webhooks.clientConfig.service.name** (string), required

          `name` is the name of the service. Required 
        -->

      - **webhooks.clientConfig.service.name** (string)，必需

        `name` 是服務的名稱。必需。

      <!-- 
      - **webhooks.clientConfig.service.namespace** (string), required

        `namespace` is the namespace of the service. Required 
      -->

      - **webhooks.clientConfig.service.namespace** (string)，必需

        `namespace` 是服務的命名空間。必需。

      <!-- 
      - **webhooks.clientConfig.service.path** (string)

        `path` is an optional URL path which will be sent in any request to this service. 
      -->

      - **webhooks.clientConfig.service.path** (string)

        `path` 是一個可選的 URL 路徑，在針對此服務的所有請求中都會發送此路徑。

      <!-- 
      - **webhooks.clientConfig.service.port** (int32)

        If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive). 
      -->

      - **webhooks.clientConfig.service.port** (int32)

        如果指定了，則爲託管 Webhook 的服務上的端口。預設爲 443 以實現向後兼容。
        `port` 應該是一個有效的端口號（包括 1-65535）。

    <!-- 
    - **webhooks.clientConfig.url** (string)

      `url` gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.
      
      The `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.
      
      Please note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.
      
      The scheme must be "https"; the URL must begin with "https://".
      
      A path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.
      
      Attempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either. 
    -->

    - **webhooks.clientConfig.url** (string)

      `url` 以標準 URL 形式（`scheme://host:port/path`）給出了 Webhook 的位置。必須指定 `url` 或 `service` 中的一個。

      `host` 不能用來引用叢集中運行的服務；這種情況應改用 `service` 字段。在某些 API 伺服器上，可能會通過外部 DNS 解析 `host` 值。
      （例如，`kube-apiserver` 無法解析叢集內 DNS，因爲這會違反分層原理）。`host` 也可以是 IP 地址。

      請注意，使用 `localhost` 或 `127.0.0.1` 作爲 `host` 是有風險的，除非你非常小心地在運行 apiserver 的所有主機上運行此 Webhook，
      而這些 API 伺服器可能需要調用此 Webhook。此類部署可能是不可移植的，即不容易在新叢集中重複安裝。

      該方案必須是 “https”；URL 必須以 “https://” 開頭。

      路徑是可選的，如果存在，可以是 URL 中允許的任何字符串。你可以使用路徑將任意字符串傳遞給 Webhook，例如叢集標識符。

      不允許使用使用者或基本身份驗證，例如不允許使用 “user:password@”。
      不允許使用片段（“#...”）和查詢參數（“?...”）。

  <!-- 
  - **webhooks.name** (string), required

    The name of the admission webhook. Name should be fully qualified, e.g., imagepolicy.kubernetes.io, where "imagepolicy" is the name of the webhook, and kubernetes.io is the name of the organization. Required. 
  -->

  - **webhooks.name** (string)，必需

    准入 Webhook 的名稱。應該是完全限定的名稱，例如 `imagepolicy.kubernetes.io`，其中 “imagepolicy” 是 Webhook 的名稱，
    `kubernetes.io` 是組織的名稱。必需。

  <!-- 
  - **webhooks.sideEffects** (string), required

    SideEffects states whether this webhook has side effects. Acceptable values are: None, NoneOnDryRun (webhooks created via v1beta1 may also specify Some or Unknown). Webhooks with side effects MUST implement a reconciliation system, since a request may be rejected by a future step in the admission chain and the side effects therefore need to be undone. Requests with the dryRun attribute will be auto-rejected if they match a webhook with sideEffects == Unknown or Some. 
  -->

  - **webhooks.sideEffects** (string)，必需

    `sideEffects` 說明此 Webhook 是否有副作用。可接受的值爲：None、NoneOnDryRun
    （通過 `v1beta1` 創建的 Webhook 也可以指定 Some 或 Unknown）。
    具有副作用的 Webhook 必須實現協調系統，因爲請求可能會被准入鏈中的未來步驟拒絕，因此需要能夠撤消副作用。
    如果請求與帶有 `sideEffects == Unknown` 或 Some 的 Webhook 匹配，則帶有 dryRun 屬性的請求將被自動拒絕。

    <!--
    Possible enum values:
     - `"None"` means that calling the webhook will have no side effects.
     - `"NoneOnDryRun"` means that calling the webhook will possibly have side effects, but if the request being reviewed has the dry-run attribute, the side effects will be suppressed.
     - `"Some"` means that calling the webhook will possibly have side effects. If a request with the dry-run attribute would trigger a call to this webhook, the request will instead fail.
     - `"Unknown"` means that no information is known about the side effects of calling the webhook. If a request with the dry-run attribute would trigger a call to this webhook, the request will instead fail.
    -->

    可能的枚舉值：
    - `"None"` 表示調用 Webhook 不會產生任何副作用。
    - `"NoneOnDryRun"` 表示調用 Webhook 可能會產生副作用，
      但如果被審查的請求具有 dry-run 屬性，則會抑制這些副作用。
    - `"Some"` 表示調用 Webhook 可能會產生副作用。如果帶有 `dry-run` 屬性的請求觸發了對此
      Webhook 的調用，該請求將會失敗。
    - `"Unknown"` 表示對調用 Webhook 是否會產生副作用未知。如果帶有 `dry-run`
      屬性的請求觸發了對此 Webhook 的調用，該請求將會失敗。
  
  <!-- 
  - **webhooks.failurePolicy** (string)

    FailurePolicy defines how unrecognized errors from the admission endpoint are handled - allowed values are Ignore or Fail. Defaults to Fail. 

    Possible enum values:
     - `"Fail"` means that an error calling the webhook causes the admission to fail.
     - `"Ignore"` means that an error calling the webhook is ignored.
  -->

  - **webhooks.failurePolicy** (string)

    `failurePolicy` 定義如何處理來自准入端點的無法識別的錯誤 - 允許的值是 Ignore 或 Fail。預設爲 Fail。

    可能的枚舉值：
    - `"Fail"` 表示調用 Webhook 出錯會導致准入失敗。
    - `"Ignore"` 表示調用 Webhook 出錯將被忽略。

  <!--
  - **webhooks.matchConditions** ([]MatchCondition)

    *Patch strategy: merge on key `name`*
   
    *Map: unique values on key name will be kept during a merge*
  -->
  
  - **webhooks.matchConditions** ([]MatchCondition)

    **補丁策略：根據 `name` 鍵執行合併操作**

    **映射：鍵 `name` 的唯一值將在合併過程中保留**

    <!--
    MatchConditions is a list of conditions that must be met for a request to be sent to this webhook. Match conditions filter requests that have already been matched by the rules, namespaceSelector, and objectSelector. An empty list of matchConditions matches all requests. There are a maximum of 64 match conditions allowed.
    -->
    
    `matchConditions` 是將請求發送到此 webhook 之前必須滿足的條件列表。
    匹配條件過濾已經被 rules、namespaceSelector、objectSelector 匹配的請求。
    `matchConditions` 取值爲空列表時匹配所有請求。最多允許 64 個匹配條件。
  
    <!--
    The exact matching logic is (in order):
      1. If ANY matchCondition evaluates to FALSE, the webhook is skipped.
      2. If ALL matchConditions evaluate to TRUE, the webhook is called.
      3. If any matchCondition evaluates to an error (but none are FALSE):
        - If failurePolicy=Fail, reject the request
        - If failurePolicy=Ignore, the error is ignored and the webhook is skipped
    -->
    
    精確匹配邏輯是（按順序）：
    1. 如果任一 `matchCondition` 的計算結果爲 FALSE，則跳過該 webhook。
    2. 如果所有 `matchConditions` 的計算結果爲 TRUE，則調用該 webhook。
    3. 如果任一 `matchCondition` 的計算結果爲錯誤（但都不是 FALSE）：
       - 如果 `failurePolicy=Fail`，拒絕該請求；
       - 如果 `failurePolicy=Ignore`，忽略錯誤並跳過該 webhook。

    <!--
    <a name="MatchCondition"></a>
    *MatchCondition represents a condition which must by fulfilled for a request to be sent to a webhook.*
    -->

    <a name="MatchCondition"></a>
    **MatchCondition 表示將請求發送到 Webhook 之前必須滿足的條件。**

    <!--
    - **webhooks.matchConditions.expression** (string), required

      Expression represents the expression which will be evaluated by CEL. Must evaluate to bool. CEL expressions have access to the contents of the AdmissionRequest and Authorizer, organized into CEL variables:
    -->
    
    - **webhooks.matchConditions.expression** (string)，必需

      `expression` 表示將由 CEL 求值的表達式。求值結果必須是 bool 值。CEL 表達式可以訪問
      以 CEL 變量的形式給出的 AdmissionRequest 和 Authorizer 的內容：

      <!--
      'object' - The object from the incoming request. The value is null for DELETE requests. 'oldObject' - The existing object. The value is null for CREATE requests. 'request' - Attributes of the admission request(/pkg/apis/admission/types.go#AdmissionRequest). 'authorizer' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.
      -->
      
      - 'object' - 來自傳入請求的對象。對於 DELETE 請求，該值爲 null。
      - 'oldObject' - 現有對象。對於 CREATE 請求，該值爲 null。
      - 'request' - 准入請求的屬性(/pkg/apis/admission/types.go#AdmissionRequest)。
      - 'authorizer' - CEL 授權者。可用於對請求的主體（使用者或服務賬號）執行授權檢查。

        <!--
        See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
        -->
        
        參閱： https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz

      <!--
      'authorizer.requestResource' - A CEL ResourceCheck constructed from the 'authorizer' and configured with the
        request resource.
      Documentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/
  
      Required.
      -->
      
      - 'authorizer.requestResource' - CEL ResourceCheck 從"授權方"構建並設定請求資源。
  
      CEL 文檔： https://kubernetes.io/zh-cn/docs/reference/using-api/cel/

      此字段爲必需字段。

      <!--
      - **webhooks.matchConditions.name** (string), required

        Name is an identifier for this match condition, used for strategic merging of MatchConditions, as well as providing an identifier for logging purposes. A good name should be descriptive of the associated expression. Name must be a qualified name consisting of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character (e.g. 'MyName',  or 'my.name',  or '123-abc', regex used for validation is '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') with an optional DNS subdomain prefix and '/' (e.g. 'example.com/MyName')   

        Required.
      -->
      
      - **webhooks.matchConditions.name** (string)，必需

       `name` 是此匹配條件的標識符，用於 `MatchConditions` 的策略性合併，
        以及提供用於日誌目的的標識符。一個好的 `name` 應該是對相關表達式的描述。
        `name` 必須是由字母數字字符 `-`、`_` 或 `.` 組成的限定名稱，
        並且必須以字母、數字字符開頭和結尾（例如 `MyName`、`my.name` 或 `123-abc`，
        用於驗證 `name` 的正則表達式是 `([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]`）。
        帶有可選的 DNS 子域前綴和 `/`（例如 `example.com/MyName`）

        此字段爲必需字段。

  <!-- 
  - **webhooks.matchPolicy** (string)

    matchPolicy defines how the "rules" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".
    
    - Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the webhook.
    
    - Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the webhook.
    
    Defaults to "Equivalent" 
  -->

  - **webhooks.matchPolicy** (string)

    `matchPolicy` 定義瞭如何使用 “rules” 列表來匹配傳入的請求。允許的值爲 “Exact” 或 “Equivalent”。

    - Exact: 僅當請求與指定規則完全匹配時才匹配請求。
      例如，如果可以通過 `apps/v1`、`apps/v1beta1` 和 `extensions/v1beta1` 修改 deployments 資源，
      但 “rules” 僅包含 `apiGroups:["apps"]、apiVersions:["v1"]、resources:["deployments"]`，
      對 `apps/v1beta1` 或 `extensions/v1beta1` 的請求不會被髮送到 Webhook。

    - Equivalent: 如果針對的資源包含在 “rules” 中，即使請求是通過另一個 API 組或版本提交，也會匹配。
      例如，如果可以通過 `apps/v1`、`apps/v1beta1` 和 `extensions/v1beta1` 修改 deployments 資源，
      並且 “rules” 僅包含 `apiGroups:["apps"]、apiVersions:["v1"]、resources:["deployments "]`，
      對 `apps/v1beta1` 或 `extensions/v1beta1` 的請求將被轉換爲 `apps/v1` 併發送到 Webhook。

    預設爲 “Equivalent”。

    <!--
    Possible enum values:
     - `"Equivalent"` means requests should be sent to the webhook if they modify a resource listed in rules via another API group or version.
     - `"Exact"` means requests should only be sent to the webhook if they exactly match a given rule.
    -->

    可能的枚舉值：
    - `"Equivalent"` 表示如果請求通過另一個 API 組或版本修改規則中列出的資源，
      則應將請求發送到 Webhook。
    - `"Exact"` 表示僅當請求與給定規則完全匹配時，才應將請求發送到 Webhook。
  

  - **webhooks.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    <!-- 
    NamespaceSelector decides whether to run the webhook on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the webhook.

    For example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: "namespaceSelector": {
    -->

    `namespaceSelector` 根據對象的命名空間是否與 selector 匹配來決定是否在該對象上運行 Webhook。
    如果對象本身是 Namespace，則針對 `object.metadata.labels` 執行匹配。
    如果對象是其他叢集作用域資源，則永遠不會跳過 Webhook 的匹配動作。

    例如，爲了針對 “runlevel” 不爲 “0” 或 “1” 的名字空間中的所有對象運行 Webhook；
    你可以按如下方式設置 selector：

    ```
    "namespaceSelector": {
      "matchExpressions": [
        {
          "key": "runlevel",
          "operator": "NotIn",
          "values": [
            "0",
            "1"
          ]
        }
      ]
    }
    ```

    <!-- 
    If instead you want to only run the webhook on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows: "namespaceSelector": {
    -->
    
    相反，如果你只想針對 “environment” 爲 “prod” 或 “staging” 的名字空間中的對象運行 Webhook；
    你可以按如下方式設置 selector：

    ```
    "namespaceSelector": {
      "matchExpressions": [
        {
          "key": "environment",
          "operator": "In",
          "values": [
            "prod",
            "staging"
          ]
        }
      ]
    }
    ```

    <!-- 
    See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more examples of label selectors.

    Default to the empty LabelSelector, which matches everything.  
    -->

    有關標籤選擇算符的更多示例，請參閱
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels。

    預設爲空的 LabelSelector，匹配所有對象。

  <!-- 
  - **webhooks.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    ObjectSelector decides whether to run the webhook based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the webhook, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything. 
  -->

  - **webhooks.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    `objectSelector` 根據對象是否具有匹配的標籤來決定是否運行 Webhook。
    `objectSelector` 針對將被髮送到 Webhook 的 oldObject 和 newObject 進行評估，如果任一對象與選擇器匹配，則視爲匹配。
    空對象（create 時爲 oldObject，delete 時爲 newObject）或不能有標籤的對象（如 DeploymentRollback 或 PodProxyOptions 對象）
    認爲是不匹配的。
    僅當 Webhook 支持時才能使用對象選擇器，因爲最終使用者可以通過設置標籤來跳過准入 Webhook。
    預設爲空的 LabelSelector，匹配所有內容。
  

  - **webhooks.reinvocationPolicy** (string)

    <!-- 
    reinvocationPolicy indicates whether this webhook should be called multiple times as part of a single admission evaluation. Allowed values are "Never" and "IfNeeded".

        Never: the webhook will not be called more than once in a single admission evaluation.
    
    IfNeeded: the webhook will be called at least one additional time as part of the admission evaluation if the object being admitted is modified by other admission plugins after the initial webhook call. Webhooks that specify this option *must* be idempotent, able to process objects they previously admitted. Note: * the number of additional invocations is not guaranteed to be exactly one. * if additional invocations result in further modifications to the object, webhooks are not guaranteed to be invoked again. * webhooks that use this option may be reordered to minimize the number of additional invocations. * to validate an object after all mutations are guaranteed complete, use a validating admission webhook instead.
    
    Defaults to "Never". 
    -->

    `reinvocationPolicy` 表示這個 Webhook 是否可以被多次調用，作爲一次准入評估的一部分。可取值有 “Never” 和 “IfNeeded”。

    - Never：在一次錄取評估中，Webhook 被調用的次數不會超過一次。
    - IfNeeded：如果被錄取的對象在被最初的 Webhook 調用後又被其他錄取插件修改，
      那麼該 Webhook 將至少被額外調用一次作爲錄取評估的一部分。
      指定此選項的 Webhook **必須**是冪等的，能夠處理它們之前承認的對象。
      注意：**不保證額外調用的次數正好爲1。**
      如果額外的調用導致對對象的進一步修改，Webhook 不保證會再次被調用。
      **使用該選項的 Webhook 可能會被重新排序，以最小化額外調用的數量。**
      在保證所有的變更都完成後驗證一個對象，使用驗證性質的准入 Webhook 代替。

    預設值爲 “Never”。

  <!-- 
  - **webhooks.rules** ([]RuleWithOperations)

    *Atomic: will be replaced during a merge*

    Rules describes what operations on what resources/subresources the webhook cares about. The webhook cares about an operation if it matches _any_ Rule. However, in order to prevent ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks from putting the cluster in a state which cannot be recovered from without completely disabling the plugin, ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks are never called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects.

    <a name="RuleWithOperations"></a>
    *RuleWithOperations is a tuple of Operations and Resources. It is recommended to make sure that all the tuple expansions are valid.*
  -->

  - **webhooks.rules** ([]RuleWithOperations)

    **原子性：將在合併期間被替換**

    rules 描述了 Webhook 關心的資源/子資源上有哪些操作。Webhook 關心操作是否匹配**任何** rules。
    但是，爲了防止 ValidatingAdmissionWebhooks 和 MutatingAdmissionWebhooks 將叢集置於只能完全禁用插件才能恢復的狀態，
    ValidatingAdmissionWebhooks 和 MutatingAdmissionWebhooks 永遠不會在處理 ValidatingWebhookConfiguration
    和 MutatingWebhookConfiguration 對象的准入請求時被調用。

    <a name="RuleWithOperations"></a>
    **RuleWithOperations 是操作和資源的元組。建議確保所有元組組合都是有效的。**

    <!-- 
    - **webhooks.rules.apiGroups** ([]string)

      *Atomic: will be replaced during a merge*

      APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required. 
    -->

    - **webhooks.rules.apiGroups** ([]string)

      **Atomic：將在合併期間被替換**
      
      `apiGroups` 是資源所屬的 API 組列表。`*` 是所有組。
      如果存在 `*`，則列表的長度必須爲 1。必需。

    <!-- 
    - **webhooks.rules.apiVersions** ([]string)

      *Atomic: will be replaced during a merge*
  
      APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required. 
    -->

    - **webhooks.rules.apiVersions** ([]string)

      **Atomic: 將在合併期間被替換**

      `apiVersions` 是資源所屬的 API 版本列表。`*` 是所有版本。
      如果存在 `*`，則列表的長度必須爲 1。必需。

    <!-- 
    - **webhooks.rules.operations** ([]string)

      *Atomic: will be replaced during a merge*

      Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required. 
    -->

    - **webhooks.rules.operations** ([]string)

      **Atomic: 將在合併期間被替換**

      operations 是准入 Webhook 所關心的操作 —— CREATE、UPDATE、DELETE、CONNECT
      或用來指代所有已知操作以及將來可能添加的准入操作的 `*`。
      如果存在 `*`，則列表的長度必須爲 1。必需。

    <!-- 
    - **webhooks.rules.resources** ([]string)

      *Atomic: will be replaced during a merge*

      Resources is a list of resources this rule applies to.
      
      For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.
      
      If wildcard is present, the validation rule will ensure resources do not overlap with each other.
      
      Depending on the enclosing object, subresources might not be allowed. Required. 
    -->

    - **webhooks.rules.resources** ([]string)

      **Atomic: 將在合併期間被替換**

      resources 是此規則適用的資源列表。

      - `pods` 表示 pods，'pods/log' 表示 pods 的日誌子資源。`*` 表示所有資源，但不是子資源。
      - `pods/*` 表示 pods 的所有子資源,
      - `*/scale` 表示所有 scale 子資源,
      - `*/*` 表示所有資源及其子資源。

      如果存在通配符，則驗證規則將確保資源不會相互重疊。

      根據所指定的對象，可能不允許使用子資源。必需。

    <!-- 
    - **webhooks.rules.scope** (string)

      scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".
    -->

    - **webhooks.rules.scope** (string)

      scope 指定此規則的範圍。有效值爲 “Cluster”, “Namespaced” 和 “*”。
      “Cluster” 表示只有叢集範圍的資源纔會匹配此規則。
      Namespace API 對象是叢集範圍的。
      “Namespaced” 意味着只有命名空間作用域的資源會匹配此規則。
      “*” 表示沒有範圍限制。
      子資源與其父資源的作用域相同。預設爲 “*”。

  <!-- 
  - **webhooks.timeoutSeconds** (int32)

    TimeoutSeconds specifies the timeout for this webhook. After the timeout passes, the webhook call will be ignored or the API call will fail based on the failure policy. The timeout value must be between 1 and 30 seconds. Default to 10 seconds. 
  -->

  - **webhooks.timeoutSeconds** (int32)

    timeoutSeconds 指定此 Webhook 的超時時間。
    超時後，Webhook 的調用將被忽略或 API 調用將根據失敗策略失敗。
    超時值必須在 1 到 30 秒之間。預設爲 10 秒。

## MutatingWebhookConfigurationList {#MutatingWebhookConfigurationList}

<!-- 
MutatingWebhookConfigurationList is a list of MutatingWebhookConfiguration. 
-->
MutatingWebhookConfigurationList 是 MutatingWebhookConfiguration 的列表。

<hr>

- **apiVersion**: admissionregistration.k8s.io/v1

- **kind**: MutatingWebhookConfigurationList

<!-- 
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds 
-->

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的對象元資料，更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!-- 
- **items** ([]<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>), required

  List of MutatingWebhookConfiguration. 
-->

- **items** ([]<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>)，必需

  MutatingWebhookConfiguration 列表。

<!-- 
## Operations {#Operations}  
-->
## 操作   {#operations}

<hr>

<!-- 
### `get` read the specified MutatingWebhookConfiguration

#### HTTP Request 
-->
### `get` 讀取指定的 MutatingWebhookConfiguration

#### HTTP 請求

GET /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the MutatingWebhookConfiguration 
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  MutatingWebhookConfiguration 的名稱。

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
 
-->

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response 
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

401: Unauthorized

<!-- 
### `list` list or watch objects of kind MutatingWebhookConfiguration

#### HTTP Request
-->
### `list` 列出或觀察 MutatingWebhookConfiguration 類型的對象

#### HTTP 請求

GET /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

<!-- 
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a> 
-->
#### 參數

- **allowWatchBookmarks**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!-- 
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a> 
-->

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- 
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a> 
-->

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 
-->

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a> 
-->

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a> 
-->

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 
-->

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!-- 
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a> 
-->

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!-- 
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a> 
-->

- **watch**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!-- 
#### Response 
-->
#### 響應


200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfigurationList" >}}">MutatingWebhookConfigurationList</a>): OK

401: Unauthorized

<!-- 
### `create` create a MutatingWebhookConfiguration

#### HTTP Request
-->
### `create` 創建一個 MutatingWebhookConfiguration

#### HTTP 請求

POST /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

<!-- 
#### Parameters

- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>, required
-->
#### 參數

- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>，必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 
-->

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response 
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

202 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Accepted

401: Unauthorized

<!-- 
### `update` replace the specified MutatingWebhookConfiguration

#### HTTP Request 
-->
### `update` 替換指定的 MutatingWebhookConfiguration

#### HTTP 請求

PUT /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the MutatingWebhookConfiguration 
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  MutatingWebhookConfiguration 的名稱。

<!-- 
- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>, required
-->

- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>，必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 
-->

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response 
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

401: Unauthorized

<!-- 
### `patch` partially update the specified MutatingWebhookConfiguration

#### HTTP Request 
-->
### `patch` 部分更新指定的 MutatingWebhookConfiguration

#### HTTP 請求

PATCH /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the MutatingWebhookConfiguration 
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  MutatingWebhookConfiguration 的名稱。

<!-- 
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a> 
-->

- **force**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
#### Response 
-->
#### 響應

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

401: Unauthorized

<!-- 
### `delete` delete a MutatingWebhookConfiguration

#### HTTP Request 
-->
### `delete` 刪除 MutatingWebhookConfiguration

#### HTTP 請求

DELETE /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

<!-- 
#### Parameters

- **name** (*in path*): string, required

  name of the MutatingWebhookConfiguration 
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  MutatingWebhookConfiguration 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a> 
-->

- **gracePeriodSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a> 
-->

- **propagationPolicy**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!-- 
#### Response 
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!-- 
### `deletecollection` delete collection of MutatingWebhookConfiguration

#### HTTP Request 
-->
### `deletecollection` 刪除 MutatingWebhookConfiguration 的集合

#### HTTP 請求

DELETE /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

<!-- 
#### Parameters
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!-- 
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a> 
-->

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a> 
-->

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a> 
-->

- **gracePeriodSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!-- 
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 
-->

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!-- 
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a> 
-->

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a> 
-->

- **propagationPolicy**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!-- 
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a> 
-->

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!-- 
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 
-->

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!-- 
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a> 
-->

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!-- 
#### Response 
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
