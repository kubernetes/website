---
title: Admission Webhook 良好實踐
description: >
  在 Kubernetes 中設計和部署 Admission Webhook 的建議。
content_type: concept
weight: 60
---
<!--
title: Admission Webhook Good Practices
description: >
  Recommendations for designing and deploying admission webhooks in Kubernetes.
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
This page provides good practices and considerations when designing
_admission webhooks_ in Kubernetes. This information is intended for
cluster operators who run admission webhook servers or third-party applications
that modify or validate your API requests.

Before reading this page, ensure that you're familiar with the following
concepts:

* [Admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
* [Admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
-->
本頁面提供了在 Kubernetes 中設計 **Admission Webhook** 時的良好實踐和注意事項。
此資訊適用於運行准入 Webhook 伺服器或第三方應用程式的叢集操作員，
這些程式用於修改或驗證你的 API 請求。

在閱讀本頁之前，請確保你熟悉以下概念：

* [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
* [准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)

<!-- body -->

<!--
## Importance of good webhook design {#why-good-webhook-design-matters}

Admission control occurs when any create, update, or delete request
is sent to the Kubernetes API. Admission controllers intercept requests that
match specific criteria that you define. These requests are then sent to
mutating admission webhooks or validating admission webhooks. These webhooks are
often written to ensure that specific fields in object specifications exist or
have specific allowed values.
-->
## 良好的 Webhook 設計的重要性   {#why-good-webhook-design-matters}

當任何創建、更新或刪除請求發送到 Kubernetes API 時，就會發生准入控制。
准入控制器會攔截符合你定義的特定條件的請求。然後，這些請求會被髮送到變更准入 Webhook（Mutating Admission Webhook）
或驗證准入 Webhook（Validating Admission Webhook）。這些 Webhook 通常用於確保對象規範中的特定字段存在或具有特定允許值。

<!--
Webhooks are a powerful mechanism to extend the Kubernetes API. Badly-designed
webhooks often result in workload disruptions because of how much control
the webhooks have over objects in the cluster. Like other API extension
mechanisms, webhooks are challenging to test at scale for compatibility with
all of your workloads, other webhooks, add-ons, and plugins. 
-->
Webhook 是擴展 Kubernetes API 的強大機制。設計不良的 Webhook 由於對叢集中對象具有很大的控制權，
常常會導致工作負載中斷。與其他 API 擴展機制一樣，對 Webhook 與所有工作負載、其他
Webhook、插件及附加組件的兼容性進行大規模測試是一個挑戰。

<!--
Additionally, with every release, Kubernetes adds or modifies the API with new
features, feature promotions to beta or stable status, and deprecations. Even
stable Kubernetes APIs are likely to change. For example, the `Pod` API changed
in v1.29 to add the
[Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) feature.
While it's rare for a Kubernetes object to enter a broken state because of a new
Kubernetes API, webhooks that worked as expected with earlier versions of an API
might not be able to reconcile more recent changes to that API. This can result
in unexpected behavior after you upgrade your clusters to newer versions.
-->
此外，隨着每個版本的發佈，Kubernetes 會通過新增特性、將特性提升爲測試版或穩定版以及棄用舊特性來添加或修改 API。
即使是穩定的 Kubernetes API 也可能會發生變化。例如，在 v1.29 中，`Pod` API 發生了變化，
以添加 [Sidecar 容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)特性。
雖然因爲新的 Kubernetes API 導致 Kubernetes 對象進入損壞狀態的情況很少見，
但那些在早期 API 版本中正常工作的 Webhook 可能無法適配該 API 的最新更改。
這可能會導致在你將叢集升級到較新版本後出現意外行爲。

<!--
This page describes common webhook failure scenarios and how to avoid them by
cautiously and thoughtfully designing and implementing your webhooks. 
-->
本頁面描述了常見的 Webhook 失敗場景，以及如何通過謹慎和周到地設計與實現你的
Webhook 來避免這些問題。

<!--
## Identify whether you use admission webhooks {#identify-admission-webhooks}

Even if you don't run your own admission webhooks, some third-party applications
that you run in your clusters might use mutating or validating admission
webhooks.

To check whether your cluster has any mutating admission webhooks, run the
following command:
-->
## 識別是否使用 Admission Webhook   {#identify-admission-webhooks}

即使你沒有運行自己的 Admission Webhook，
你在叢集中運行的一些第三方應用程式也可能使用變更或驗證准入 Webhook。

要檢查你的叢集是否存在變更性質的准入 Webhook，請運行以下命令：

```shell
kubectl get mutatingwebhookconfigurations
```

<!---
The output lists any mutating admission controllers in the cluster. 

To check whether your cluster has any validating admission webhooks, run the
following command:
-->
輸出列出了叢集中的所有變更准入控制器。

要檢查你的叢集是否存在驗證性質的准入 Webhook，運行以下命令：

```shell
kubectl get validatingwebhookconfigurations
```

<!---
The output lists any validating admission controllers in the cluster. 
-->
輸出列出了叢集中的所有驗證性質准入控制器。

<!---
## Choose an admission control mechanism {#choose-admission-mechanism}

Kubernetes includes multiple admission control and policy enforcement options.
Knowing when to use a specific option can help you to improve latency and
performance, reduce management overhead, and avoid issues during version
upgrades. The following table describes the mechanisms that let you mutate or
validate resources during admission:
-->
## 選擇准入控制機制 {#choose-admission-mechanism}

Kubernetes 包含多個准入控制和策略執行選項。知道何時使用特定選項可以幫助你改善延遲和性能，
減少管理開銷，並避免版本升級期間的問題。下表中描述的是你可以在准入時變更或驗證資源的一些機制：

<!-- This table is HTML because it uses unordered lists for readability. -->

<table>
  <caption><!--Mutating and validating admission control in Kubernetes-->Kubernetes 中的變更和驗證准入控制</caption>
  <thead>
    <tr>
      <th><!--Mechanism-->機制</th>
      <th><!--Description-->描述</th>
      <th><!--Use cases-->使用場景</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/"><!--Mutating admission webhook-->變更性准入 Webhook</a></td>
      <td>
        <!--
        Intercept API requests before admission and modify as needed using
        custom logic.
        -->
        在准入前攔截 API 請求，並根據需要使用自定義邏輯進行修改。
      </td>
      <td><ul>
        <li>
          <!--
          Make critical modifications that must happen before resource
          admission.
          -->
          執行資源准入前必須發生的關鍵修改。
          </li>
        <li>
          <!--
          Make complex modifications that require advanced logic, like calling
          external APIs.
          -->
          執行需要高級邏輯的複雜修改，例如調用外部 API。
          </li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/"><!--Mutating admission policy-->變更性准入策略</a></td>
      <td>
        <!--
        Intercept API requests before admission and modify as needed using
        Common Expression Language (CEL) expressions.
        -->
        在准入前攔截 API 請求，並使用通用表達式語言（CEL）表達式進行必要的修改。
      </td>
      <td><ul>
        <li>
          <!--
         Make critical modifications that must happen before resource
          admission.
          -->
          執行資源准入前必須發生的關鍵修改。
        </li>
        <li>
        <!--
        Make simple modifications, such as adjusting labels or replica
        counts.
        -->
          執行簡單的修改，例如調整標籤或副本數量。
        </li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/"><!--Validating admission webhook-->驗證性准入 Webhook</a></td>
      <td>
        <!--
        Intercept API requests before admission and validate against complex
        policy declarations.
        -->
        在准入前攔截 API 請求，並根據複雜的策略聲明進行驗證。
      </td>
      <td><ul>
        <li><!--Validate critical configurations before resource admission.-->在資源准入前驗證關鍵設定。</li>
        <li><!--Enforce complex policy logic before admission.-->在准入前執行復雜的策略邏輯。</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/"><!--Validating admission policy-->驗證性准入策略</a></td>
      <td>
        <!--
        Intercept API requests before admission and validate against CEL
        expressions.
        -->
        在准入前攔截 API 請求，並根據通用表達式語言（CEL）表達式進行驗證。
      </td>
      <td><ul>
        <li><!--Validate critical configurations before resource admission.-->在資源准入前驗證關鍵設定。</li>
        <li><!--Enforce policy logic using CEL expressions.-->使用 CEL 表達式執行策略邏輯。</li>
      </ul></td>
    </tr>
  </tbody>
</table>

<!--
In general, use _webhook_ admission control when you want an extensible way to
declare or configure the logic. Use built-in CEL-based admission control when
you want to declare simpler logic without the overhead of running a webhook
server. The Kubernetes project recommends that you use CEL-based admission
control when possible.
-->
一般來說，當你希望以可擴展的方式聲明或設定邏輯時，可以使用 **Webhook** 准入控制。
當你希望聲明更簡單的邏輯而無需運行 Webhook 伺服器的開銷時，可以使用基於 CEL
的內置准入控制。Kubernetes 項目建議在可能的情況下使用基於 CEL 的准入控制。

<!--
### Use built-in validation and defaulting for CustomResourceDefinitions {#no-crd-validation-defaulting}

If you use
{{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}},
don't use admission webhooks to validate values in CustomResource specifications
or to set default values for fields. Kubernetes lets you define validation rules
and default field values when you create CustomResourceDefinitions.

To learn more, see the following resources:

* [Validation rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
* [Defaulting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)
-->
### 爲 CustomResourceDefinitions 使用內置驗證和預設值 {#no-crd-validation-defaulting}

如果你使用 {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}，
請勿使用准入 Webhook 來驗證 CustomResource 規約中的值，或者爲其中的字段設置預設值。
Kubernetes 允許你在創建 CustomResourceDefinitions 時定義驗證規則和字段的預設值。

要了解更多，請參閱以下資源：

* [驗證規則](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
* [預設值](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)

<!--
## Performance and latency {#performance-latency}

This section describes recommendations for improving performance and reducing
latency. In summary, these are as follows:

* Consolidate webhooks and limit the number of API calls per webhook.
* Use audit logs to check for webhooks that repeatedly do the same action.
* Use load balancing for webhook availability.
* Set a small timeout value for each webhook.
* Consider cluster availability needs during webhook design.
-->
## 性能和延遲   {#performance-latency}

本節描述的是一些可以提高性能和減少延遲的建議。總結如下：

* 整合 Webhook 並限制每個 Webhook 的 API 調用次數。
* 使用審計日誌檢查反覆執行相同操作的 Webhook。
* 使用負載均衡確保 Webhook 的可用性。
* 爲每個 Webhook 設置較小的超時值。
* 在設計 Webhook 時考慮叢集的可用性需求。

<!--
### Design admission webhooks for low latency {#design-admission-webhooks-low-latency}

Mutating admission webhooks are called in sequence. Depending on the mutating
webhook setup, some webhooks might be called multiple times. Every mutating
webhook call adds latency to the admission process. This is unlike validating
webhooks, which get called in parallel. 

When designing your mutating webhooks, consider your latency requirements and
tolerance. The more mutating webhooks there are in your cluster, the greater the
chance of latency increases. 
-->
### 設計低延遲的准入 Webhook   {#design-admission-webhooks-low-latency}

變更性質的准入 Webhook 是按順序調用的。根據變更性質 Webhook 的設置，某些 Webhook
可能會被多次調用。對變更性質的 Webhook 的每次調用都會增加准入過程的延遲。
這一點與驗證性質的 Webhook 不同，驗證性質的 Webhook 是被並行調用的。

在設計你的變更性質 Webhook 時，請考慮你的延遲要求和容忍度。叢集中的變更性 Webhook 越多，
延遲增加的可能性就越大。

<!--
Consider the following to reduce latency:

* Consolidate webhooks that perform a similar mutation on different objects.
* Reduce the number of API calls made in the mutating webhook server logic.
* Limit the match conditions of each mutating webhook to reduce how many
  webhooks are triggered by a specific API request.
* Consolidate small webhooks into one server and configuration to help with
  ordering and organization.
-->
考慮以下措施以減少延遲：

* 整合對不同對象執行類似變更的 Webhook。
* 減少變更性質 Webhook 伺服器邏輯中進行的 API 調用次數。
* 限制每個變更性質 Webhook 對應的匹配條件，以減少特定 API 請求所觸發的 Webhook 數量。
* 將多個小型的 Webhook 整合到一個伺服器和設定中，以幫助進行排序和組織。

<!--
### Prevent loops caused by competing controllers {#prevent-loops-competing-controllers}

Consider any other components that run in your cluster that might conflict with
the mutations that your webhook makes. For example, if your webhook adds a label
that a different controller removes, your webhook gets called again. This leads
to a loop.

To detect these loops, try the following:
-->
### 防止由相互競爭的控制器所引起的循環處理   {#prevent-loops-competing-controllers}

考慮叢集中運行的其他可能與你的 Webhook 所做的變更發生衝突的組件。例如，如果你的
Webhook 要添加某個標籤，而另一個控制器要刪除該標籤，那麼你的 Webhook
會被再次調用，從而導致循環處理。

要檢測這些循環，可以嘗試以下方法：

<!--
1.  Update your cluster audit policy to log audit events. Use the following
    parameters:
    
      * `level`: `RequestResponse`
      * `verbs`: `["patch"]`
      * `omitStages`: `RequestReceived`

    Set the audit rule to create events for the specific resources that your
    webhook mutates.

1.  Check your audit events for webhooks being reinvoked multiple times with the
    same patch being applied to the same object, or for an object having
    a field updated and reverted multiple times.
-->
1. 更新叢集的審計策略以記錄審計事件。使用以下參數：

   * `level`: `RequestResponse`
   * `verbs`: `["patch"]`
   * `omitStages`: `RequestReceived`

   設置審計規則，爲你的 Webhook 所變更的特定資源創建事件。

1. 檢查審計事件，查看是否有 Webhook 被多次重新調用並應用了相同的補丁到同一個對象的情況，
   或者某個對象的字段被多次更新和回滾的情況。

<!--
### Set a small timeout value {#small-timeout}

Admission webhooks should evaluate as quickly as possible (typically in
milliseconds), since they add to API request latency. Use a small timeout for
webhooks.

For details, see
[Timeouts](/docs/reference/access-authn-authz/extensible-admission-controllers/#timeouts).
-->
### 設置較小的超時值   {#small-timeout}

准入性質的 Webhook 應儘可能快速評估（通常在毫秒級別），因爲它們會增加 API 請求的延遲。
爲 Webhook 設置較小的超時值。

更多詳細資訊，請參見[超時](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#timeouts)。

<!--
### Use a load balancer to ensure webhook availability {#load-balancer-webhook}

Admission webhooks should leverage some form of load-balancing to provide high
availability and performance benefits. If a webhook is running within the
cluster, you can run multiple webhook backends behind a Service of type
`ClusterIP`.
-->
### 使用負載均衡器確保 Webhook 可用性   {#load-balancer-webhook}

准入性質的 Webhook 應該利用某種形式的負載均衡來提供高可用性和性能優勢。
如果 Webhook 在叢集內運行，你可以在類型爲 `ClusterIP` 的 Service 後面運行多個 Webhook 後端。

這樣可以確保請求被均勻分配到不同的後端實例上，提高處理能力和可靠性。

<!--
### Use a high-availability deployment model {#ha-deployment}

Consider your cluster's availability requirements when designing your webhook. 
For example, during node downtime or zonal outages, Kubernetes marks Pods as
`NotReady` to allow load balancers to reroute traffic to available zones and
nodes. These updates to Pods might trigger your mutating webhooks. Depending on
the number of affected Pods, the mutating webhook server has a risk of timing
out or causing delays in Pod processing. As a result, traffic won't get
rerouted as quickly as you need.

Consider situations like the preceding example when writing your webhooks.
Exclude operations that are a result of Kubernetes responding to unavoidable
incidents.
-->
### 使用高可用部署模型    {#ha-deployment}

在設計 Webhook 時，請考慮叢集的可用性需求。例如，在節點停機或可用區中斷期間，
Kubernetes 會將一些 Pod 標記爲 `NotReady`，以便負載均衡器可以將流量重新路由到可用的可用區和節點。
這些對 Pod 的更新可能會觸發你的變更性 Webhook。取決於受影響 Pod 的數量，變更性 Webhook
伺服器有超時或導致 Pod 處理延遲的風險。結果是，流量不會像你所需要的那樣被快速地重新路由。

在編寫 Webhook 時，請考慮上述示例中的情況。排除那些由 Kubernetes
爲響應不可避免的事件所執行的操作。

<!--
## Request filtering {#request-filtering}

This section provides recommendations for filtering which requests trigger
specific webhooks. In summary, these are as follows:

* Limit the webhook scope to avoid system components and read-only requests.
* Limit webhooks to specific namespaces.
* Use match conditions to perform fine-grained request filtering.
* Match all versions of an object.
-->
## 請求過濾   {#request-filtering}

本節提供關於過濾哪些請求以觸發特定 Webhook 的建議。總結如下：

* 限制 Webhook 的作用範圍，避免處理系統組件和只讀請求。
* 將 Webhook 限制到特定的名字空間。
* 使用匹配條件執行細粒度的請求過濾。
* 匹配對象的所有版本。

<!--
### Limit the scope of each webhook {#webhook-limit-scope}

Admission webhooks are only called when an API request matches the corresponding
webhook configuration. Limit the scope of each webhook to reduce unnecessary
calls to the webhook server. Consider the following scope limitations:
-->
### 限制每個 Webhook 的作用範圍 {#webhook-limit-scope}

准入性質的 Webhook 僅在 API 請求與相應的 Webhook 設定匹配時纔會被調用。
限制每個 Webhook 的作用範圍，以減少對 Webhook 伺服器的不必要調用。
考慮以下作用範圍限制：

<!--
* Avoid matching objects in the `kube-system` namespace. If you run your own
  Pods in the `kube-system` namespace, use an
  [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)
  to avoid mutating a critical workload.
* Don't mutate node leases, which exist as Lease objects in the
  `kube-node-lease` system namespace. Mutating node leases might result in
  failed node upgrades. Only apply validation controls to Lease objects in this
  namespace if you're confident that the controls won't put your cluster at
  risk.
* Don't mutate TokenReview or SubjectAccessReview objects. These are always
  read-only requests. Modifying these objects might break your cluster.
* Limit each webhook to a specific namespace by using a
  [`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector).
-->
* 避免匹配 `kube-system` 命名空間中的對象。如果你在 `kube-system`
  名字空間中運行自己的 Pod，請使用
  [`objectSelector`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)
  來避免對關鍵工作負載進行變更。
* 不要對節點租約（Node Leases）進行變更，這些租約以 Lease 對象的形式存在於
  `kube-node-lease` 系統命名空間中。對節點租約進行變更可能會導致節點升級失敗。
  只有在你確信驗證控制不會對叢集造成風險時，纔對這個命名空間中的 Lease 對象應用驗證規則。
* 不要對 TokenReview 或 SubjectAccessReview 對象進行變更。這些始終是隻讀請求。
  修改這些對象可能會破壞你的叢集。
* 使用 [`namespaceSelector`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)
  將每個 Webhook 限制到特定的名字空間上。

<!--
### Filter for specific requests by using match conditions {#filter-match-conditions}

Admission controllers support multiple fields that you can use to match requests
that meet specific criteria. For example, you can use a `namespaceSelector` to
filter for requests that target a specific namespace.
-->
### 使用匹配條件過濾特定請求   {#filter-match-conditions}

准入控制器允許你使用多個字段來匹配符合特定條件的請求。例如，
你可以使用 `namespaceSelector` 來過濾針對特定命名空間的請求。

<!--
For more fine-grained request filtering, use the `matchConditions` field in your
webhook configuration. This field lets you write multiple CEL expressions that
must evaluate to `true` for a request to trigger your admission webhook. Using
`matchConditions` might significantly reduce the number of calls to your webhook
server.

For details, see
[Matching requests: `matchConditions`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions).
-->
爲了實現更細粒度的請求過濾，可以在 Webhook 設定中使用 `matchConditions` 字段。
該字段允許你編寫多個 CEL 表達式，只有當這些表達式都評估爲 `true` 時，
請求才會觸發你的准入 Webhook。使用 `matchConditions` 可能會顯著減少對
Webhook 伺服器的調用次數。

更多詳細資訊，請參見[匹配請求：`matchConditions`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions)。

<!--
### Match all versions of an API {#match-all-versions}

By default, admission webhooks run on any API versions that affect a specified
resource. The `matchPolicy` field in the webhook configuration controls this
behavior. Specify a value of `Equivalent` in the `matchPolicy` field or omit
the field to allow the webhook to run on any API version. 

For details, see
[Matching requests: `matchPolicy`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy).
-->
### 匹配 API 的所有版本 {#match-all-versions}

預設情況下，系統會針對針對影響指定資源的所有 API 版本運行准入 Webhook。Webhook
設定中的 `matchPolicy` 字段控制此行爲。在 `matchPolicy` 字段中指定值爲
`Equivalent` 或省略該字段，以允許 Webhook 對所有 API 版本起作用。

更多詳細資訊，請參見[匹配請求：`matchPolicy`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)。

<!--
## Mutation scope and field considerations {#mutation-scope-considerations}

This section provides recommendations for the scope of mutations and any special
considerations for object fields. In summary, these are as follows:

* Patch only the fields that you need to patch.
* Don't overwrite array values.
* Avoid side effects in mutations when possible.
* Avoid self-mutations.
* Fail open and validate the final state.
* Plan for future field updates in later versions.
* Prevent webhooks from self-triggering.
* Don't change immutable objects.
-->
## 變更範圍和字段注意事項    {#mutation-scope-considerations}

本節提供關於變更範圍和對象字段特殊考慮的建議。總結如下：

* 僅修補需要修補的字段。
* 不要覆蓋數組值。
* 儘可能避免在變更中產生副作用。
* 避免自我變更。
* 以開放的形式失敗並驗證最終狀態。
* 爲未來版本中對字段執行變更作規劃。
* 防止 Webhook 自我觸發。
* 不要更改不可變更的對象。

<!--
### Patch only required fields {#patch-required-fields}

Admission webhook servers send HTTP responses to indicate what to do with a
specific Kubernetes API request. This response is an AdmissionReview object.
A mutating webhook can add specific fields to mutate before allowing admission
by using the `patchType` field and the `patch` field in the response. Ensure
that you only modify the fields that require a change. 
-->
### 僅修補必要的字段   {#patch-required-fields}

准入 Webhook 伺服器發送 HTTP 響應來指示如何處理特定的 Kubernetes API 請求。
此響應是一個 AdmissionReview 對象。通過使用響應中的 `patchType` 字段和 `patch` 字段，
變更性 Webhook 可以添加具體的字段進行變更，之後才允許准入。確保你僅修改需要更改的字段。

<!--
For example, consider a mutating webhook that's configured to ensure that
`web-server` Deployments have at least three replicas. When a request to
create a Deployment object matches your webhook configuration, the webhook
should only update the value in the `spec.replicas` field.
-->
例如，考慮一個設定爲確保 `web-server` 部署至少具有三個副本的變更性質 Webhook。
當創建 Deployment 對象的某個請求與你的 Webhook 設定匹配時，Webhook
應僅更新 `spec.replicas` 字段中的值。

<!--
### Don't overwrite array values {#dont-overwrite-arrays}

Fields in Kubernetes object specifications might include arrays. Some arrays
contain key:value pairs (like the `envVar` field in a container specification),
while other arrays are unkeyed (like the `readinessGates` field in a Pod
specification). The order of values in an array field might matter in some
situations. For example, the order of arguments in the `args` field of a
container specification might affect the container. 

Consider the following when modifying arrays:
-->
### 不要覆蓋數組值   {#dont-overwrite-arrays}

Kubernetes 對象規約中的字段可能包含數組。有些數組包含鍵值對
（如容器規約中的 `envVar` 字段），而其他數組則沒有鍵（如 Pod 規約中的 `readinessGates` 字段）。
在某些情況下，數組字段中值的順序可能很重要。例如，容器規約中 `args`
字段的參數順序可能會影響容器。

在修改數組時，要考慮以下幾點：

<!--
* Whenever possible, use the `add` JSONPatch operation instead of `replace` to
  avoid accidentally replacing a required value.
* Treat arrays that don't use key:value pairs as sets.
* Ensure that the values in the field that you modify aren't required to be
  in a specific order. 
* Don't overwrite existing key:value pairs unless absolutely necessary.
* Use caution when modifying label fields. An accidental modification might
  cause label selectors to break, resulting in unintended behavior.
-->
* 儘可能使用 `add` JSONPatch 操作，而不是 `replace`，以避免意外替換掉必需的值。
* 將不使用鍵值對的數組視爲集合來處理。
* 確保你所要修改的字段中的值不需要特定的順序。
* 除非絕對必要，否則不要覆蓋現有的鍵值對。
* 在修改標籤字段時要小心。意外的修改可能會導致標籤選擇器失效，從而引發意外行爲。

<!--
### Avoid side effects {#avoid-side-effects}

Ensure that your webhooks operate only on the content of the AdmissionReview
that's sent to them, and do not make out-of-band changes. These additional
changes, called _side effects_, might cause conflicts during admission if they
aren't reconciled properly. The `.webhooks[].sideEffects` field should
be set to `None` if a webhook doesn't have any side effect. 
-->
### 避免副作用   {#avoid-side-effects}

確保你的 Webhook 僅操作發送給它們的 AdmissionReview 內容，
而不進行帶外更改。這些額外的更改（稱爲“副作用”）如果未妥善協調，
可能會在准入期間引發衝突。如果 Webhook 沒有任何副作用，則應將
`.webhooks[].sideEffects` 字段設置爲 `None`。

<!--
If side effects are required during the admission evaluation, they must be
suppressed when processing an AdmissionReview object with `dryRun` set to
`true`, and the `.webhooks[].sideEffects` field should be set to `NoneOnDryRun`.

For details, see
[Side effects](/docs/reference/access-authn-authz/extensible-admission-controllers/#side-effects).
-->
如果在准入評估期間需要副作用，則必須在處理 `dryRun` 設置爲 `true`
的 AdmissionReview 對象時抑制這些副作用，並且應將 `.webhooks[].sideEffects`
字段設置爲 `NoneOnDryRun`。

更多詳細資訊，請參見[副作用](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#side-effects)。

<!--
### Avoid self-mutations {#avoid-self-mutation}

A webhook running inside the cluster might cause deadlocks for its own
deployment if it is configured to intercept resources required to start its own
Pods.

For example, a mutating admission webhook is configured to admit **create** Pod
requests only if a certain label is set in the Pod (such as `env: prod`).
The webhook server runs in a Deployment that doesn't set the `env` label.
-->
### 避免自我變更   {#avoid-self-mutation}

在叢集內運行的 Webhook 可能會因爲其自身的部署攔截了啓動自身 Pod
所需的資源而導致死鎖。

例如，你可能設定了一個變更性質的准入 Webhook，僅當 Pod 中設置了特定標籤（如 `env: prod`）時才允許**創建**
Pod 請求，而 Webhook 伺服器卻運行在一個沒有設置 `env` 標籤的 Deployment 中。

<!--
When a node that runs the webhook server Pods becomes unhealthy, the webhook
Deployment tries to reschedule the Pods to another node. However, the existing
webhook server rejects the requests since the `env` label is unset. As a
result, the migration cannot happen.

Exclude the namespace where your webhook is running with a
[`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector).
-->
當運行 Webhook 伺服器 Pod 的節點變得不健康時，Webhook 的 Deployment
會嘗試將這些 Pod 重新調度到另一個節點。然而，由於 `env` 標籤未設置，
現有的 Webhook 伺服器會拒絕這些請求。結果是，遷移無法完成。

通過 [`namespaceSelector`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)
排除運行 Webhook 的命名空間，以避免此問題。

<!--
### Avoid dependency loops {#avoid-dependency-loops}

Dependency loops can occur in scenarios like the following:

* Two webhooks check each other's Pods. If both webhooks become unavailable
  at the same time, neither webhook can start.
* Your webhook intercepts cluster add-on components, such as networking plugins
  or storage plugins, that your webhook depends on. If both the webhook and the
  dependent add-on become unavailable, neither component can function.
-->
### 避免依賴循環   {#avoid-dependency-loops}

依賴循環可能在如下場景中發生：

* 兩個 Webhook 相互檢查對方的 Pod。如果這兩個 Webhook 同時變得不可用，
  那麼任何一個 Webhook 都無法啓動。
* 你的 Webhook 攔截了叢集插件組件（如網路插件或儲存插件），而這些插件是
  Webhook 所依賴的。如果 Webhook 和依賴的插件同時變得不可用，則兩個組件都無法正常工作。

<!--
To avoid these dependency loops, try the following:

* Use
  [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
  to avoid introducing dependencies.
* Prevent webhooks from validating or mutating other webhooks. Consider
  [excluding specific namespaces](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)
  from triggering your webhook.
* Prevent your webhooks from acting on dependent add-ons by using an
  [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector).
-->
爲了避免這種循環依賴，可以嘗試以下方法：

* 使用[驗證准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)以避免引入依賴關係。
* 避免讓一個 Webhook 驗證或變更其他 Webhook。
  考慮[排除特定命名空間](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)，
  使其不觸發你的 Webhook。
* 通過使用
  [`objectSelector`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)，
  防止你的 Webhook 對依賴的插件進行操作。

<!---
### Fail open and validate the final state {#fail-open-validate-final-state}

Mutating admission webhooks support the `failurePolicy` configuration field.
This field indicates whether the API server should admit or reject the request
if the webhook fails. Webhook failures might occur because of timeouts or errors
in the server logic.

By default, admission webhooks set the `failurePolicy` field to Fail. The API
server rejects a request if the webhook fails. However, rejecting requests by
default might result in compliant requests being rejected during webhook
downtime. 
-->
### 失敗時開放並驗證最終狀態   {#fail-open-validate-final-state}

變更性質的准入 Webhook 支持 `failurePolicy` 設定字段。此字段指示如果 Webhook
失敗，API 伺服器是應允許還是拒絕請求。Webhook 失敗可能是由於超時或伺服器邏輯中的錯誤造成的。

預設情況下，准入 Webhook 將 `failurePolicy` 字段設置爲 `Fail`。
如果 Webhook 失敗，API 伺服器將拒絕該請求。然而，預設情況下拒絕請求可能會導致在
Webhook 停機期間合規的請求也被拒絕。

<!--
Let your mutating webhooks "fail open" by setting the `failurePolicy` field to
Ignore. Use a validating controller to check the state of requests to ensure
that they comply with your policies. 

This approach has the following benefits:

* Mutating webhook downtime doesn't affect compliant resources from deploying.
* Policy enforcement occurs during validating admission control.
* Mutating webhooks don't interfere with other controllers in the cluster.
-->
通過將 `failurePolicy` 字段設置爲 `Ignore`，可以讓你的變更性質 Webhook 在失敗時更爲“開放”。
使用驗證控制器檢查請求的狀態，確保它們符合你的策略。

這種方法有以下好處：

* 變更性 Webhook 的停機不會影響合規資源的部署。
* 策略執行發生在驗證准入控制階段。
* 變更性 Webhooks 不會干擾叢集中的其他控制器。

<!--
### Plan for future updates to fields {#plan-future-field-updates}

In general, design your webhooks under the assumption that Kubernetes APIs might
change in a later version. Don't write a server that takes the stability of an
API for granted. For example, the release of sidecar containers in Kubernetes
added a `restartPolicy` field to the Pod API. 
-->
### 爲未來的字段更新做計劃 {#plan-future-field-updates}

通常，在設計 Webhook 時應假設 Kubernetes API 可能在後續版本中會發生變化。
不要編寫一個理所當然地認爲某個 API 是穩定的伺服器。例如，Kubernetes 中 Sidecar
容器的發佈爲 Pod API 添加了一個 `restartPolicy` 字段。

<!--
### Prevent your webhook from triggering itself {#prevent-webhook-self-trigger}

Mutating webhooks that respond to a broad range of API requests might
unintentionally trigger themselves. For example, consider a webhook that
responds to all requests in the cluster. If you configure the webhook to create
Event objects for every mutation, it'll respond to its own Event object
creation requests.

To avoid this, consider setting a unique label in any resources that your
webhook creates. Exclude this label from your webhook match conditions.
-->
### 防止 Webhook 自我觸發 {#prevent-webhook-self-trigger}

響應廣泛 API 請求的變更性質的 Webhook 可能會無意中觸發自身。例如，考慮一個響應叢集內所有請求的
Webhook。如果設定該 Webhook 爲每次變更創建 Event 對象，則它會對自己的 Event 對象創建請求作出響應。

爲了避免這種情況，可以考慮在 Webhook 創建的任何資源中設置一個唯一的標籤，
並將此標籤從 Webhook 的匹配條件中排除。

<!--
### Don't change immutable objects {#dont-change-immutable-objects}

Some Kubernetes objects in the API server can't change. For example, when you
deploy a {{< glossary_tooltip text="static Pod" term_id="static-pod" >}}, the
kubelet on the node creates a 
{{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}} in the API
server to track the static Pod. However, changes to the mirror Pod don't
propagate to the static Pod. 
-->
### 不要更改不可變更的對象   {#dont-change-immutable-objects}

API 伺服器中的一些 Kubernetes 對象是不可更改的。例如，
當你部署一個{{< glossary_tooltip text="靜態 Pod" term_id="static-pod" >}} 時，
節點上的 kubelet 會在 API 伺服器中創建一個{{< glossary_tooltip text="映像檔 Pod" term_id="mirror-pod" >}}
來跟蹤該靜態 Pod。然而，對映像檔 Pod 的更改不會被傳播到靜態 Pod。

<!--
Don't attempt to mutate these objects during admission. All mirror Pods have the
`kubernetes.io/config.mirror` annotation. To exclude mirror Pods while reducing
the security risk of ignoring an annotation, allow static Pods to only run in
specific namespaces. 
-->
不要在准入期間嘗試對這些對象進行變更。所有映像檔 Pod 都帶有
`kubernetes.io/config.mirror` 註解。爲了在排除映像檔 Pod
的同時降低忽略註解的安全風險，可以僅允許靜態 Pod 在特定的名字空間中運行。

<!--
## Mutating webhook ordering and idempotence {#ordering-idempotence}

This section provides recommendations for webhook order and designing idempotent
webhooks. In summary, these are as follows:
-->
## 變更性質 Webhook 的順序與冪等性 {#ordering-idempotence}

本節提供關於 Webhook 順序設計和冪等性 Webhook 的建議。總結如下：

<!--
* Don't rely on a specific order of execution.
* Validate mutations before admission.
* Check for mutations being overwritten by other controllers.
* Ensure that the set of mutating webhooks is idempotent, not just the
  individual webhooks.
-->
* 不要依賴特定的執行順序。
* 在准入前驗證變更。
* 檢查是否存在其他控制器覆蓋的變更。
* 確保整個變更性 Webhook 集合是冪等的，而不僅僅是單個 Webhook 具有冪等性。

<!--
### Don't rely on mutating webhook invocation order {#dont-rely-webhook-order}

Mutating admission webhooks don't run in a consistent order. Various factors
might change when a specific webhook is called. Don't rely on your webhook
running at a specific point in the admission process. Other webhooks could still
mutate your modified object.
-->
### 不要依賴變更准入 Webhook 的調用順序   {#dont-rely-webhook-order}

變更准入 Webhook 的執行順序並不固定。某些因素可能會改變特定 Webhook
被調用的時機。不要指望你的 Webhook 在准入流程中的某個特定點運行，
因爲其他 Webhook 仍可能對你所修改的對象進行進一步變更。

<!--
The following recommendations might help to minimize the risk of unintended
changes:

* [Validate mutations before admission](#validate-mutations)
* Use a reinvocation policy to observe changes to an object by other plugins
  and re-run the webhook as needed. For details, see
  [Reinvocation policy](/docs/reference/access-authn-authz/extensible-admission-controllers/#reinvocation-policy).
-->
以下建議可能有助於最小化意外更改的風險：

* [在准入前驗證變更](#validate-mutations)
* 使用重新調用策略來觀察其他插件對對象的更改，並根據需要重新運行 Webhook。
  更多詳細資訊，請參見[重新調用策略](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#reinvocation-policy)。

<!--
### Ensure that the mutating webhooks in your cluster are idempotent {#ensure-mutating-webhook-idempotent}

Every mutating admission webhook should be _idempotent_. The webhook should be
able to run on an object that it already modified without making additional
changes beyond the original change.
-->
### 確保叢集中的變更准入 Webhook 具有冪等性   {#ensure-mutating-webhook-idempotent}

每個變更性質的准入 Webhook 都應該是**冪等的**。Webhook 應能夠在已經修改過的對象上運行，
而不會在原始更改之外產生額外的更改。

<!--
Additionally, all of the mutating webhooks in your cluster should, as a
collection, be idempotent. After the mutation phase of admission control ends,
every individual mutating webhook should be able to run on an object without 
making additional changes to the object.

Depending on your environment, ensuring idempotence at scale might be
challenging. The following recommendations might help:
-->
此外，叢集中的所有變更性質的 Webhook 集合也應當是冪等的。在准入控制的變更階段結束後，
每個變更性質的 Webhook 都應能夠針對該對象運行而不會對該對象產生額外的更改。

取決於你的環境，確保大規模冪等性可能會具有挑戰性。以下建議可能有所幫助：

<!--
* Use validating admission controllers to verify the final state of
  critical workloads.
* Test your deployments in a staging cluster to see if any objects get modified
  multiple times by the same webhook. 
* Ensure that the scope of each mutating webhook is specific and limited.

The following examples show idempotent mutation logic:
-->
* 使用驗證性質的准入控制器來對關鍵工作負載的最終狀態進行檢查。
* 在測試叢集中測試你的部署，查看是否有對象被同一個 Webhook 多次修改。
* 確保每個變更性 Webhook 的作用範圍具體且受限。

以下示例展示的是一些冪等的變更邏輯：

<!--
1. For a **create** Pod request, set the field
  `.spec.securityContext.runAsNonRoot` of the Pod to true.

1. For a **create** Pod request, if the field
   `.spec.containers[].resources.limits` of a container is not set, set default
   resource limits.

1. For a **create** Pod request, inject a sidecar container with name
   `foo-sidecar` if no container with the name `foo-sidecar` already exists.
-->
1. 對於 **create** Pod 請求，將 Pod 的字段 `.spec.securityContext.runAsNonRoot`
   設置爲 `true`。

2. 對於 **create** Pod 請求，如果容器的字段 `.spec.containers[].resources.limits`
   未設置，則設置預設的資源限制。

3. 對於 **create** Pod 請求，如果不存在名爲 `foo-sidecar` 的容器，
   則注入一個名爲 `foo-sidecar` 的邊車容器。

<!--
In these cases, the webhook can be safely reinvoked, or admit an object that
already has the fields set.

The following examples show non-idempotent mutation logic:
-->
在這些情況下，Webhook 可以被安全地重新調用，或者允許已經設置了相關字段的對象通過准入控制。

以下示例展示了非冪等的變更邏輯：

<!--
1. For a **create** Pod request, inject a sidecar container with name
   `foo-sidecar` suffixed with the current timestamp (such as
   `foo-sidecar-19700101-000000`).

   Reinvoking the webhook can result in the same sidecar being injected multiple
   times to a Pod, each time with a different container name. Similarly, the
   webhook can inject duplicated containers if the sidecar already exists in
   a user-provided pod.
-->
1. 對於 **create** Pod 請求，注入一個名稱爲 `foo-sidecar`
   並附加當前時間戳的邊車容器（例如 `foo-sidecar-19700101-000000`）。

   重新調用 Webhook 可能會導致同一個邊車容器被多次注入到 Pod 中，
   每次使用不同的容器名稱。同樣，如果邊車容器已經存在於使用者提供的 Pod 中，
   Webhook 也可能注入重複的容器。

<!--
2. For a **create**/**update** Pod request, reject if the Pod has label `env`
   set, otherwise add an `env: prod` label to the Pod.

   Reinvoking the webhook will result in the webhook failing on its own output.
-->
2. 對於 **create**/**update** Pod 請求，如果 Pod 已設置標籤 `env`，則拒絕請求；
   否則，向 Pod 添加標籤 `env: prod`。

   重新調用 Webhook 將導致 Webhook 在面對自身的輸出時失敗。

<!--
3. For a **create** Pod request, append a sidecar container named `foo-sidecar`
   without checking whether a `foo-sidecar` container exists.

   Reinvoking the webhook will result in duplicated containers in the Pod, which
   makes the request invalid and rejected by the API server.
-->
3. 對於 **create** Pod 請求，在不檢查是否已存在名爲 `foo-sidecar`
   的容器的情況下，追加一個名爲 `foo-sidecar` 的邊車容器。

   重新調用 Webhook 將導致 Pod 中出現重複的容器，這會使請求無效並被
   API 伺服器拒絕。

<!--
## Mutation testing and validation {#mutation-testing-validation}

This section provides recommendations for testing your mutating webhooks and
validating mutated objects. In summary, these are as follows:

* Test webhooks in staging environments.
* Avoid mutations that violate validations.
* Test minor version upgrades for regressions and conflicts.
* Validate mutated objects before admission.
-->
## 變更的測試與驗證 {#mutation-testing-validation}

本節提供關於測試變更性質 Webhook 和對已變更對象進行檢驗的建議。總結如下：

* 在測試環境中測試 Webhook。
* 避免違反驗證規則的變更。
* 測試小版本升級時的迴歸和衝突。
* 在准入前驗證變更的對象。

<!--
### Test webhooks in staging environments {#test-in-staging-environments}

Robust testing should be a core part of your release cycle for new or updated
webhooks. If possible, test any changes to your cluster webhooks in a staging
environment that closely resembles your production clusters. At the very least,
consider using a tool like [minikube](https://minikube.sigs.k8s.io/docs/) or
[kind](https://kind.sigs.k8s.io/) to create a small test cluster for webhook
changes.
-->
本節提供關於測試變更性質 Webhook 和對已變更對象進行檢驗的建議。總結如下：

穩健的測試應該是你發佈新的 Webhook 或更新現有 Webhook 的核心部分。如果可能的話，
在一個與生產叢集相似的預發佈（staging）環境中測試對叢集 Webhook 的所有更改。至少，
考慮使用 [minikube](https://minikube.sigs.k8s.io/docs/) 或
[kind](https://kind.sigs.k8s.io/) 等工具創建一個小的測試叢集來進行
Webhook 的更改測試。

<!--
### Ensure that mutations don't violate validations {#ensure-mutations-dont-violate-validations}

Your mutating webhooks shouldn't break any of the validations that apply to an
object before admission. For example, consider a mutating webhook that sets the 
default CPU request of a Pod to a specific value. If the CPU limit of that Pod
is set to a lower value than the mutated request, the Pod fails admission. 

Test every mutating webhook against the validations that run in your cluster.
-->
### 確保變更不會違反驗證規則   {#ensure-mutations-dont-violate-validations}

你的變更性質 Webhook 不應破壞對象在被准入前將被應用的任何驗證規則。例如，考慮一個將
Pod 的預設 CPU 請求設置爲特定值的變更性質 Webhook。如果該 Pod 的 CPU
限制設置爲低於變更後的請求值，則該 Pod 將無法通過准入。

針對叢集中運行的驗證規則測試每個變更性質的 Webhook。

<!--
### Test minor version upgrades to ensure consistent behavior {#test-minor-version-upgrades}

Before upgrading your production clusters to a new minor version, test your
webhooks and workloads in a staging environment. Compare the results to ensure
that your webhooks continue to function as expected after the upgrade. 

Additionally, use the following resources to stay informed about API changes:

* [Kubernetes release notes](/releases/)
* [Kubernetes blog](/blog/)
-->
### 測試小版本升級以確保一致的行爲   {#test-minor-version-upgrades}

在將生產叢集升級到新的小版本之前，在一個預發佈環境中測試你的 Webhook 和工作負載。
比較結果，確保升級後你的 Webhook 仍能按預期運行。

此外，使用以下資源來了解 API 變更的相關資訊：

* [Kubernetes 發行說明](/zh-cn/releases/)
* [Kubernetes 博客](/zh-cn/blog/)

<!--
### Validate mutations before admission {#validate-mutations}

Mutating webhooks run to completion before any validating webhooks run. There is
no stable order in which mutations are applied to objects. As a result, your
mutations could get overwritten by a mutating webhook that runs at a later time.
-->
### 在准入前驗證變更   {#validate-mutations}

變更性質的 Webhook 會在所有驗證性質的 Webhook 運行之前完成運行。
多項變更在對象的應用順序並不穩定。因此，你所作的變更可能會被後續運行的變更性 Webhook 覆蓋。

<!--
Add a validating admission controller like a ValidatingAdmissionWebhook or a
ValidatingAdmissionPolicy to your cluster to ensure that your mutations
are still present. For example, consider a mutating webhook that inserts the
`restartPolicy: Always` field to specific init containers to make them run as
sidecar containers. You could run a validating webhook to ensure that those
init containers retained the `restartPolicy: Always` configuration after all
mutations were completed. 
-->
可以添加如 ValidatingAdmissionWebhook 或 ValidatingAdmissionPolicy
這樣的驗證性准入控制器到你的叢集中，以確保你的變更是仍然存在的。例如，
考慮一個變更性質的 Webhook，它將 `restartPolicy: Always` 字段插入特定的初始化容器中，
使它們作爲邊車容器運行。你可以運行一個驗證 Webhook 來確保這些初始化容器在所有變更完成後仍保留
`restartPolicy: Always` 設定。

<!--
For details, see the following resources:

* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
* [ValidatingAdmissionWebhooks](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
-->
詳情請參閱以下資源：

* [驗證准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
* [ValidatingAdmissionWebhooks](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)

<!--
## Mutating webhook deployment {#mutating-webhook-deployment}

This section provides recommendations for deploying your mutating admission
webhooks. In summary, these are as follows:

* Gradually roll out the webhook configuration and monitor for issues by
  namespace.
* Limit access to edit the webhook configuration resources. 
* Limit access to the namespace that runs the webhook server, if the server is
  in-cluster.
-->
## 變更性 Webhook 的部署   {#mutating-webhook-deployment}

本節給出關於部署變更性准入 Webhook 的建議。總結如下：

* 逐步推出 Webhook 設定，並按名字空間監控可能出現的問題。
* 限制對 Webhook 設定資源的編輯訪問權限。
* 如果伺服器位於叢集內，則限制對運行 Webhook 伺服器的命名空間的訪問權限。

<!--
### Install and enable a mutating webhook {#install-enable-mutating-webhook}

When you're ready to deploy your mutating webhook to a cluster, use the
following order of operations: 
-->
### 安裝、啓用變更性 Webhook {#install-enable-mutating-webhook}

當你準備將變更性質的 Webhook 部署到叢集時，請按照以下操作順序進行：

<!--
1.  Install the webhook server and start it.
1.  Set the `failurePolicy` field in the MutatingWebhookConfiguration manifest
    to Ignore. This lets you avoid disruptions caused by misconfigured webhooks.
1.  Set the `namespaceSelector` field in the MutatingWebhookConfiguration
    manifest to a test namespace.
1.  Deploy the MutatingWebhookConfiguration to your cluster.
-->
1. 安裝 Webhook 伺服器並啓動它。
2. 在 MutatingWebhookConfiguration 清單中將 `failurePolicy`
   字段設置爲 `Ignore`。這樣可以避免因 Webhook 設定錯誤而導致的干擾。
3. 在 MutatingWebhookConfiguration 清單中將 `namespaceSelector`
   字段設置爲一個測試命名空間。
4. 將 MutatingWebhookConfiguration 部署到你的叢集中。

<!--
Monitor the webhook in the test namespace to check for any issues, then roll the
webhook out to other namespaces. If the webhook intercepts an API request that
it wasn't meant to intercept, pause the rollout and adjust the scope of the
webhook configuration.
-->
在測試命名空間中監控 Webhook，檢查是否有任何問題，然後將 Webhook
推廣到其他命名空間。如果 Webhook 攔截了不應攔截的 API 請求，
請暫停推廣並調整 Webhook 設定的範圍。

<!--
### Limit edit access to mutating webhooks {#limit-edit-access}

Mutating webhooks are powerful Kubernetes controllers. Use RBAC or another
authorization mechanism to limit access to your webhook configurations and
servers. For RBAC, ensure that the following access is only available to trusted
entities:
-->
### 限制對變更性 Webhook 的編輯訪問 {#limit-edit-access}

變更性質的 Webhook 是一種強大的 Kubernetes 控制器。使用 RBAC
或其他鑑權機制來限制對你的 Webhook 和伺服器的編輯訪問權限。
對於 RBAC，確保只有受信任的實體纔可以具有以下訪問權限：

<!--
* Verbs: **create**, **update**, **patch**, **delete**, **deletecollection**
* API group: `admissionregistration.k8s.io/v1`
* API kind: MutatingWebhookConfigurations

If your mutating webhook server runs in the cluster, limit access to create or
modify any resources in that namespace.
-->
* 動詞：**create**（創建）、**update**（更新）、**patch**（補丁）、
  **delete**（刪除）、**deletecollection**（刪除集合）
* API 組：`admissionregistration.k8s.io/v1`
* API 資源類型：MutatingWebhookConfigurations

如果你的變更性 Webhook 的伺服器在叢集內運行，請限制對該命名空間中任何資源的創建或修改權限。

<!--
## Examples of good implementations {#example-good-implementations}
-->
## 良好實現的示例   {#example-good-implementations}

{{% thirdparty-content %}}

<!--
The following projects are examples of "good" custom webhook server
implementations. You can use them as a starting point when designing your own
webhooks. Don't use these examples as-is; use them as a starting point and
design your webhooks to run well in your specific environment.
-->
以下項目是“良好的”自定義 Webhook 伺服器實現的示例。在設計你自己的 Webhook 時，
可以將它們作爲起點。請勿直接使用這些示例，而是應根據你的具體環境進行調整和設計。

* [`cert-manager`](https://github.com/cert-manager/cert-manager/tree/master/internal/webhook)
* [Gatekeeper Open Policy Agent (OPA)](https://open-policy-agent.github.io/gatekeeper/website/docs/mutation)


## {{% heading "whatsnext" %}}

<!--
* [Use webhooks for authentication and authorization](/docs/reference/access-authn-authz/webhook/)
* [Learn about MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/)
* [Learn about ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
-->
* [使用 Webhook 進行身份認證和鑑權](/zh-cn/docs/reference/access-authn-authz/webhook/)
* [瞭解 MutatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/)
* [瞭解 ValidatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
