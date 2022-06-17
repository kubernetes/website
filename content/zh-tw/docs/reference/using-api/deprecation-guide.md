---
title: 已棄用 API 的遷移指南
weight: 45
content_type: reference
---

<!--
reviewers:
- liggitt
- lavalamp
- thockin
- smarterclayton
title: "Deprecated API Migration Guide"
weight: 45
content_type: reference
-->

<!-- overview -->

<!--
As the Kubernetes API evolves, APIs are periodically reorganized or upgraded.
When APIs evolve, the old API is deprecated and eventually removed.
This page contains information you need to know when migrating from
deprecated API versions to newer and more stable API versions.
-->
隨著 Kubernetes API 的演化，APIs 會週期性地被重組或升級。
當 APIs 演化時，老的 API 會被棄用並被最終刪除。
本頁面包含你在將已棄用 API 版本遷移到新的更穩定的 API 版本時需要了解的知識。

<!-- body -->

<!--
## Removed APIs by release
-->
## 各發行版本中移除的 API  {#removed-apis-by-release}

### v1.27

<!--
The **v1.27** release will stop serving the following deprecated API versions:
-->
**v1.27** 發行版本中將去除以下已棄用的 API 版本：

#### CSIStorageCapacity {#csistoragecapacity-v127}

<!--
The **storage.k8s.io/v1beta1** API version of CSIStorageCapacity will no longer be served in v1.27.

* Migrate manifests and API clients to use the **storage.k8s.io/v1** API version, available since v1.24.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**storage.k8s.io/v1beta1** API版本的 CSIStorageCapacity 將不再在 v1.27 提供。

* 自 v1.24 版本起，遷移清單和 API 客戶端使用 **storage.k8s.io/v1** API 版本
* 所有現有的持久化物件都可以透過新的 API 訪問
* 沒有需要額外注意的變更

### v1.26

<!--
The **v1.26** release will stop serving the following deprecated API versions:
-->
**v1.26** 發行版本中將去除以下已棄用的 API 版本：

<!--
#### Flow control resources {#flowcontrol-resources-v126}
-->
#### 流控制資源     {#flowcontrol-resources-v126}

<!--
The **flowcontrol.apiserver.k8s.io/v1beta1** API version of FlowSchema and PriorityLevelConfiguration will no longer be served in v1.26.

* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1beta2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**flowcontrol.apiserver.k8s.io/v1beta1** API 版本的 FlowSchema
和 PriorityLevelConfiguration 將不會在 v1.26 中提供。

* 遷移清單和 API 客戶端使用 **flowcontrol.apiserver.k8s.io/v1beta2** API 版本，
  此 API 從 v1.23 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v126}

<!--
The **autoscaling/v2beta2** API version of HorizontalPodAutoscaler will no longer be served in v1.26.

* Migrate manifests and API clients to use the **autoscaling/v2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
-->
**autoscaling/v2beta2** API 版本的 HorizontalPodAutoscaler 將不會在
v1.26 版本中提供。

* 遷移清單和 API 客戶端使用 **autoscaling/v2** API 版本，
  此 API 從 v1.23 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；

### v1.25

<!--
The **v1.25** release will stop serving the following deprecated API versions:
-->
**v1.25** 發行版本將停止提供以下已廢棄 API 版本：

#### CronJob {#cronjob-v125}

<!--
The **batch/v1beta1** API version of CronJob will no longer be served in v1.25.

* Migrate manifests and API clients to use the **batch/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**batch/v1beta1** API 版本的 CronJob 將不會在 v1.25 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **batch/v1** API 版本，此 API 從 v1.21 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

#### EndpointSlice {#endpointslice-v125}

<!--
The **discovery.k8s.io/v1beta1** API version of EndpointSlice will no longer be served in v1.25.

* Migrate manifests and API clients to use the **discovery.k8s.io/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* Notable changes in **discovery.k8s.io/v1**:
    * use per Endpoint `nodeName` field instead of deprecated `topology["kubernetes.io/hostname"]` field
    * use per Endpoint `zone` field instead of deprecated `topology["topology.kubernetes.io/zone"]` field
    * `topology` is replaced with the `deprecatedTopology` field which is not writable in v1
-->
**discovery.k8s.io/v1beta1** API 版本的 EndpointSlice 將不會在 v1.25 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **discovery.k8s.io/v1** API 版本，此 API 從 v1.21 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* **discovery.k8s.io/v1** 中值得注意的變更有：
  * 使用每個 Endpoint 的 `nodeName` 欄位而不是已被棄用的
    `topology["kubernetes.io/hostname"]` 欄位；
  * 使用每個 Endpoint 的 `zone` 欄位而不是已被棄用的
    `topology["kubernetes.io/zone"]` 欄位；
  * `topology` 欄位被替換為 `deprecatedTopology`，並且在 v1 版本中不可寫入。

#### Event {#event-v125}

<!--
The **events.k8s.io/v1beta1** API version of Event will no longer be served in v1.25.

* Migrate manifests and API clients to use the **events.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
-->
**events.k8s.io/v1beta1** API 版本的 Event 將不會在 v1.25 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **events.k8s.io/v1** API 版本，此 API 從 v1.19 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；

<!--
* Notable changes in **events.k8s.io/v1**:
    * `type` is limited to `Normal` and `Warning`
    * `involvedObject` is renamed to `regarding`
    * `action`, `reason`, `reportingController`, and `reportingInstance` are required when creating new **events.k8s.io/v1** Events
    * use `eventTime` instead of the deprecated `firstTimestamp` field (which is renamed to `deprecatedFirstTimestamp` and not permitted in new **events.k8s.io/v1** Events)
    * use `series.lastObservedTime` instead of the deprecated `lastTimestamp` field (which is renamed to `deprecatedLastTimestamp` and not permitted in new **events.k8s.io/v1** Events)
    * use `series.count` instead of the deprecated `count` field (which is renamed to `deprecatedCount` and not permitted in new **events.k8s.io/v1** Events)
    * use `reportingController` instead of the deprecated `source.component` field (which is renamed to `deprecatedSource.component` and not permitted in new **events.k8s.io/v1** Events)
    * use `reportingInstance` instead of the deprecated `source.host` field (which is renamed to `deprecatedSource.host` and not permitted in new **events.k8s.io/v1** Events)
-->
* **events.k8s.io/v1** 中值得注意的變更有：
  * `type` 欄位只能設定為 `Normal` 和 `Warning` 之一；
  * `involvedObject` 欄位被更名為 `regarding`；
  * `action`、`reason`、`reportingController` 和 `reportingInstance` 欄位
    在建立新的 **events.k8s.io/v1** 版本 Event 時都是必需的欄位；
  * 使用 `eventTime` 而不是已被棄用的 `firstTimestamp` 欄位
    （該欄位已被更名為 `deprecatedFirstTimestamp`，且不允許出現在新的 **events.k8s.io/v1** Event 物件中）；
  * 使用 `series.lastObservedTime` 而不是已被棄用的 `lastTimestamp` 欄位
    （該欄位已被更名為 `deprecatedLastTimestamp`，且不允許出現在新的 **events.k8s.io/v1** Event 物件中）；
  * 使用 `series.count` 而不是已被棄用的 `count` 欄位
    （該欄位已被更名為 `deprecatedCount`，且不允許出現在新的 **events.k8s.io/v1** Event 物件中）；
  * 使用 `reportingController` 而不是已被棄用的 `source.component` 欄位
    （該欄位已被更名為 `deprecatedSource.component`，且不允許出現在新的 **events.k8s.io/v1** Event 物件中）；
   * 使用 `reportingInstance` 而不是已被棄用的 `source.host` 欄位
    （該欄位已被更名為 `deprecatedSource.host`，且不允許出現在新的 **events.k8s.io/v1** Event 物件中）。

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v125}

<!--
The **autoscaling/v2beta1** API version of HorizontalPodAutoscaler will no longer be served in v1.25.

* Migrate manifests and API clients to use the **autoscaling/v2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
-->
**autoscaling/v2beta1** API 版本的 HorizontalPodAutoscaler 將不會在 v1.25 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **autoscaling/v2** API 版本，此 API 從 v1.23 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；

#### PodDisruptionBudget {#poddisruptionbudget-v125}

<!--
The **policy/v1beta1** API version of PodDisruptionBudget will no longer be served in v1.25.

* Migrate manifests and API clients to use the **policy/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* Notable changes in **policy/v1**:
  * an empty `spec.selector` (`{}`) written to a `policy/v1` PodDisruptionBudget selects all pods in the namespace (in `policy/v1beta1` an empty `spec.selector` selected no pods). An unset `spec.selector` selects no pods in either API version.
-->
**policy/v1beta1** API 版本的 PodDisruptionBudget 將不會在 v1.25 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **policy/v1** API 版本，此 API 從 v1.21 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* **policy/v1** 中需要額外注意的變更有：
  * 在 `policy/v1` 版本的 PodDisruptionBudget 中將 `spec.selector`
    設定為空（`{}`）時會選擇名字空間中的所有 Pods（在 `policy/v1beta1`
    版本中，空的 `spec.selector` 不會選擇任何 Pods）。如果 `spec.selector`
    未設定，則在兩個 API 版本下都不會選擇任何 Pods。

#### PodSecurityPolicy {#psp-v125}

<!--
PodSecurityPolicy in the **policy/v1beta1** API version will no longer be served in v1.25, and the PodSecurityPolicy admission controller will be removed.

Migrate to [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
or a [3rd party admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/).
For a migration guide, see [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
For more information on the deprecation, see [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).
-->
**policy/v1beta1** API 版本中的 PodSecurityPolicy 將不會在 v1.25 中提供，
並且 PodSecurityPolicy 准入控制器也會被刪除。

遷移到 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)或[第三方准入 webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)。
有關遷移指南，請參閱[從 PodSecurityPolicy 遷移到內建 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。
有關棄用的更多資訊，請參閱 [PodSecurityPolicy 棄用：過去、現在和未來](/zh-cn/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。

#### RuntimeClass {#runtimeclass-v125}

<!--
RuntimeClass in the **node.k8s.io/v1beta1** API version will no longer be served in v1.25.

* Migrate manifests and API clients to use the **node.k8s.io/v1** API version, available since v1.20.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**node.k8s.io/v1beta1** API 版本中的 RuntimeClass 將不會在 v1.25 中提供。

* 遷移清單和 API 客戶端使用 **node.k8s.io/v1** API 版本，此 API 從 v1.20 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

### v1.22

<!--
The **v1.22** release stopped serving the following deprecated API versions:
-->
**v1.22** 發行版本停止提供以下已廢棄 API 版本：

<!--
#### Webhook resources {#webhook-resources-v122}
-->
#### Webhook 資源   {#webhook-resources-v122}

<!--
The **admissionregistration.k8s.io/v1beta1** API version of MutatingWebhookConfiguration and ValidatingWebhookConfiguration is no longer served as of v1.22.
-->
**admissionregistration.k8s.io/v1beta1** API 版本的 MutatingWebhookConfiguration
和 ValidatingWebhookConfiguration 不在 v1.22 版本中繼續提供。

<!--
* Migrate manifests and API clients to use the **admissionregistration.k8s.io/v1** API version, available since v1.16.
* All existing persisted objects are accessible via the new APIs
-->
* 遷移清單和 API 客戶端使用 **admissionregistration.k8s.io/v1** API 版本，
此 API 從 v1.16 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；

<!--
* Notable changes:
    * `webhooks[*].failurePolicy` default changed from `Ignore` to `Fail` for v1
    * `webhooks[*].matchPolicy` default changed from `Exact` to `Equivalent` for v1
    * `webhooks[*].timeoutSeconds` default changed from `30s` to `10s` for v1
    * `webhooks[*].sideEffects` default value is removed, and the field made required, and only `None` and `NoneOnDryRun` are permitted for v1
    * `webhooks[*].admissionReviewVersions` default value is removed and the field made required for v1 (supported versions for AdmissionReview are `v1` and `v1beta1`)
    * `webhooks[*].name` must be unique in the list for objects created via `admissionregistration.k8s.io/v1`
-->
* 值得注意的變更：
    * `webhooks[*].failurePolicy` 在 v1 版本中預設值從 `Ignore` 改為 `Fail`
    * `webhooks[*].matchPolicy` 在 v1 版本中預設值從 `Exact` 改為 `Equivalent`
    * `webhooks[*].timeoutSeconds` 在 v1 版本中預設值從 `30s` 改為 `10s`
    * `webhooks[*].sideEffects` 的預設值被刪除，並且該欄位變為必須指定；
      在 v1 版本中可選的值只能是 `None` 和 `NoneOnDryRun` 之一
    * `webhooks[*].admissionReviewVersions` 的預設值被刪除，在 v1
      版本中此欄位變為必須指定（AdmissionReview 的被支援版本包括 `v1` 和 `v1beta1`）
    * `webhooks[*].name` 必須在透過 `admissionregistration.k8s.io/v1`
      建立的物件列表中唯一

#### CustomResourceDefinition {#customresourcedefinition-v122}

<!--
The **apiextensions.k8s.io/v1beta1** API version of CustomResourceDefinition is no longer served as of v1.22.

* Migrate manifests and API clients to use the **apiextensions.k8s.io/v1** API version, available since v1.16.
* All existing persisted objects are accessible via the new API
-->
**apiextensions.k8s.io/v1beta1** API 版本的 CustomResourceDefinition
不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **apiextensions/v1** API 版本，此 API 從 v1.16 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
<!--
* Notable changes:
    * `spec.scope` is no longer defaulted to `Namespaced` and must be explicitly specified
    * `spec.version` is removed in v1; use `spec.versions` instead
    * `spec.validation` is removed in v1; use `spec.versions[*].schema` instead
    * `spec.subresources` is removed in v1; use `spec.versions[*].subresources` instead
    * `spec.additionalPrinterColumns` is removed in v1; use `spec.versions[*].additionalPrinterColumns` instead
    * `spec.conversion.webhookClientConfig` is moved to `spec.conversion.webhook.clientConfig` in v1
-->
* 值得注意的變更：
    * `spec.scope` 的預設值不再是 `Namespaced`，該欄位必須顯式指定
    * `spec.version` 在 v1 版本中被刪除；應改用 `spec.versions`
    * `spec.validation` 在 v1 版本中被刪除；應改用 `spec.versions[*].schema`
    * `spec.subresources` 在 v1 版本中被刪除；應改用 `spec.versions[*].subresources`
    * `spec.additionalPrinterColumns` 在 v1 版本中被刪除；應改用
      `spec.versions[*].additionalPrinterColumns`
    * `spec.conversion.webhookClientConfig` 在 v1 版本中被移動到
      `spec.conversion.webhook.clientConfig` 中
    <!--
    * `spec.conversion.conversionReviewVersions` is moved to `spec.conversion.webhook.conversionReviewVersions` in v1
    * `spec.versions[*].schema.openAPIV3Schema` is now required when creating v1 CustomResourceDefinition objects, and must be a [structural schema](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)
    * `spec.preserveUnknownFields: true` is disallowed when creating v1 CustomResourceDefinition objects; it must be specified within schema definitions as `x-kubernetes-preserve-unknown-fields: true`
    * In `additionalPrinterColumns` items, the `JSONPath` field was renamed to `jsonPath` in v1 (fixes [#66531](https://github.com/kubernetes/kubernetes/issues/66531))
    -->
    * `spec.conversion.conversionReviewVersions` 在 v1 版本中被移動到
      `spec.conversion.webhook.conversionReviewVersions`
    * `spec.versions[*].schema.openAPIV3Schema` 在建立 v1 版本的
      CustomResourceDefinition 物件時變成必需欄位，並且其取值必須是一個
      [結構化的 Schema](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)
    * `spec.preserveUnknownFields: true` 在建立 v1 版本的 CustomResourceDefinition
      物件時不允許指定；該配置必須在 Schema 定義中使用
      `x-kubernetes-preserve-unknown-fields: true` 來設定
    * 在 v1 版本中，`additionalPrinterColumns` 的條目中的 `JSONPath` 欄位被更名為
      `jsonPath`（補丁 [#66531](https://github.com/kubernetes/kubernetes/issues/66531)）

#### APIService {#apiservice-v122}

<!--
The **apiregistration.k8s.io/v1beta1** API version of APIService is no longer served as of v1.22.

* Migrate manifests and API clients to use the **apiregistration.k8s.io/v1** API version, available since v1.10.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**apiregistration/v1beta1** API 版本的 APIService 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **apiregistration.k8s.io/v1** API 版本，此 API 從
  v1.10 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

#### TokenReview {#tokenreview-v122}

<!--
The **authentication.k8s.io/v1beta1** API version of TokenReview is no longer served as of v1.22.

* Migrate manifests and API clients to use the **authentication.k8s.io/v1** API version, available since v1.6.
* No notable changes
-->
**authentication.k8s.io/v1beta1** API 版本的 TokenReview 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **authentication.k8s.io/v1** API 版本，此 API 從
  v1.6 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

#### SubjectAccessReview resources {#subjectaccessreview-resources-v122}

<!--
The **authorization.k8s.io/v1beta1** API version of LocalSubjectAccessReview, SelfSubjectAccessReview, SubjectAccessReview, and SelfSubjectRulesReview is no longer served as of v1.22.

* Migrate manifests and API clients to use the **authorization.k8s.io/v1** API version, available since v1.6.
* Notable changes:
    * `spec.group` was renamed to `spec.groups` in v1 (fixes [#32709](https://github.com/kubernetes/kubernetes/issues/32709))
-->
**authorization.k8s.io/v1beta1** API 版本的 LocalSubjectAccessReview、
SelfSubjectAccessReview、SubjectAccessReview、SelfSubjectRulesReview 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **authorization.k8s.io/v1** API 版本，此 API 從
  v1.6 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 需要額外注意的變更：
  * `spec.group` 在 v1 版本中被更名為 `spec.groups`
    （補丁 [#32709](https://github.com/kubernetes/kubernetes/issues/32709)）


#### CertificateSigningRequest {#certificatesigningrequest-v122}

<!--
The **certificates.k8s.io/v1beta1** API version of CertificateSigningRequest is no longer served as of v1.22.

* Migrate manifests and API clients to use the **certificates.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
-->
**certificates.k8s.io/v1beta1** API 版本的 CertificateSigningRequest 不在
v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **certificates.k8s.io/v1** API 版本，此 API 從
  v1.19 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；

<!--
* Notable changes in `certificates.k8s.io/v1`:
    * For API clients requesting certificates:
        * `spec.signerName` is now required (see [known Kubernetes signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)), and requests for `kubernetes.io/legacy-unknown` are not allowed to be created via the `certificates.k8s.io/v1` API
        * `spec.usages` is now required, may not contain duplicate values, and must only contain known usages
    * For API clients approving or signing certificates:
        * `status.conditions` may not contain duplicate types
        * `status.conditions[*].status` is now required
        * `status.certificate` must be PEM-encoded, and contain only `CERTIFICATE` blocks
-->
* `certificates.k8s.io/v1` 中需要額外注意的變更：
  * 對於請求證書的 API 客戶端而言：
    * `spec.signerName` 現在變成必需欄位（參閱
      [已知的 Kubernetes 簽署者](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)），
      並且透過 `certificates.k8s.io/v1` API 不可以建立簽署者為
      `kubernetes.io/legacy-unknown` 的請求
    * `spec.usages` 現在變成必需欄位，其中不可以包含重複的字串值，
       並且只能包含已知的用法字串
  * 對於要批准或者簽署證書的 API 客戶端而言：
    * `status.conditions` 中不可以包含重複的型別
    * `status.conditions[*].status` 欄位現在變為必需欄位
    * `status.certificate` 必須是 PEM 編碼的，而且其中只能包含 `CERTIFICATE`
      資料塊

#### Lease {#lease-v122}

<!--
The **coordination.k8s.io/v1beta1** API version of Lease is no longer served as of v1.22.

* Migrate manifests and API clients to use the **coordination.k8s.io/v1** API version, available since v1.14.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**coordination.k8s.io/v1beta1** API 版本的 Lease 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **coordination.k8s.io/v1** API 版本，此 API 從
  v1.14 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

#### Ingress {#ingress-v122}

<!--
The **extensions/v1beta1** and **networking.k8s.io/v1beta1** API versions of Ingress is no longer served as of v1.22.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1** 和 **networking.k8s.io/v1beta1** API 版本的 Ingress
不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **networking.k8s.io/v1** API 版本，此 API 從
  v1.19 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
<!--
* Notable changes:
    * `spec.backend` is renamed to `spec.defaultBackend`
    * The backend `serviceName` field is renamed to `service.name`
    * Numeric backend `servicePort` fields are renamed to `service.port.number`
    * String backend `servicePort` fields are renamed to `service.port.name`
    * `pathType` is now required for each specified path. Options are `Prefix`, `Exact`, and `ImplementationSpecific`. To match the undefined `v1beta1` behavior, use `ImplementationSpecific`.
-->
* 值得注意的變更：
    * `spec.backend` 欄位被更名為 `spec.defaultBackend`
    * 後端的  `serviceName` 欄位被更名為 `service.name`
    * 數值表示的後端 `servicePort` 欄位被更名為 `service.port.number`
    * 字串表示的後端 `servicePort` 欄位被更名為 `service.port.name`
    * 對所有要指定的路徑，`pathType` 都成為必需欄位。
      可選項為 `Prefix`、`Exact` 和 `ImplementationSpecific`。
      要匹配 `v1beta1` 版本中未定義路徑型別時的行為，可使用 `ImplementationSpecific`

#### IngressClass {#ingressclass-v122}

<!--
The **networking.k8s.io/v1beta1** API version of IngressClass is no longer served as of v1.22.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**networking.k8s.io/v1beta1** API 版本的 IngressClass 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **networking.k8s.io/v1** API 版本，此 API 從
  v1.19 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更


<!--
#### RBAC resources  {#rbac-resources-v122}

The **rbac.authorization.k8s.io/v1beta1** API version of ClusterRole, ClusterRoleBinding, Role, and RoleBinding is no longer served as of v1.22.

* Migrate manifests and API clients to use the **rbac.authorization.k8s.io/v1** API version, available since v1.8.
* All existing persisted objects are accessible via the new APIs
* No notable changes
-->
#### RBAC 資源   {#rbac-resources-v122}

**rbac.authorization.k8s.io/v1beta1** API 版本的 ClusterRole、ClusterRoleBinding、
Role 和 RoleBinding 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **rbac.authorization.k8s.io/v1** API 版本，此 API 從
  v1.8 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

#### PriorityClass {#priorityclass-v122}

<!--
The **scheduling.k8s.io/v1beta1** API version of PriorityClass is no longer served as of v1.22.

* Migrate manifests and API clients to use the **scheduling.k8s.io/v1** API version, available since v1.14.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**scheduling.k8s.io/v1beta1** API 版本的 PriorityClass 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **scheduling.k8s.io/v1** API 版本，此 API 從
  v1.14 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

<!--
#### Storage resources {#storage-resources-v122}
-->
#### 儲存資源  {#storage-resources-v122}

<!--
The **storage.k8s.io/v1beta1** API version of CSIDriver, CSINode, StorageClass, and VolumeAttachment is no longer served as of v1.22.

* Migrate manifests and API clients to use the **storage.k8s.io/v1** API version
  * CSIDriver is available in **storage.k8s.io/v1** since v1.19.
  * CSINode is available in **storage.k8s.io/v1** since v1.17
  * StorageClass is available in **storage.k8s.io/v1** since v1.6
  * VolumeAttachment is available in **storage.k8s.io/v1** v1.13
* All existing persisted objects are accessible via the new APIs
* No notable changes
-->
**storage.k8s.io/v1beta1** API 版本的 CSIDriver、CSINode、StorageClass
和 VolumeAttachment 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **storage.k8s.io/v1** API 版本
  * CSIDriver 從 v1.19 版本開始在 **storage.k8s.io/v1** 中提供；
  * CSINode 從 v1.17 版本開始在 **storage.k8s.io/v1** 中提供；
  * StorageClass 從 v1.6 版本開始在 **storage.k8s.io/v1** 中提供；
  * VolumeAttachment 從 v1.13 版本開始在 **storage.k8s.io/v1** 中提供；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
* 沒有需要額外注意的變更

### v1.16

<!--
The **v1.16** release stopped serving the following deprecated API versions:
-->
**v1.16** 發行版本停止提供以下已廢棄 API 版本：

#### NetworkPolicy {#networkpolicy-v116}

<!--
The **extensions/v1beta1** API version of NetworkPolicy is no longer served as of v1.16.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.8.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1** API 版本的 NetworkPolicy 不在 v1.16 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **networking.k8s.io/v1** API 版本，此 API 從
  v1.8 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；

#### DaemonSet {#daemonset-v116}

<!--
The **extensions/v1beta1** and **apps/v1beta2** API versions of DaemonSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1** 和 **apps/v1beta2** API 版本的 DaemonSet 在
v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **apps/v1** API 版本，此 API 從 v1.9 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
<!--
* Notable changes:
    * `spec.templateGeneration` is removed
    * `spec.selector` is now required and immutable after creation; use the existing template labels as the selector for seamless upgrades
    * `spec.updateStrategy.type` now defaults to `RollingUpdate` (the default in `extensions/v1beta1` was `OnDelete`)
-->
* 值得注意的變更：
  * `spec.templateGeneration` 欄位被刪除
  * `spec.selector` 現在變成必需欄位，並且在物件建立之後不可變更；
    可以將現有模板的標籤作為選擇算符以實現無縫遷移。
  * `spec.updateStrategy.type` 的預設值變為 `RollingUpdate`
    （`extensions/v1beta1` API 版本中的預設值是 `OnDelete`）。

#### Deployment {#deployment-v116}

<!--
The **extensions/v1beta1**, **apps/v1beta1**, and **apps/v1beta2** API versions of Deployment are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1**、**apps/v1beta1** 和 **apps/v1beta2** API 版本的
Deployment 在 v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **apps/v1** API 版本，此 API 從 v1.9 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
<!--
* Notable changes:
    * `spec.rollbackTo` is removed
    * `spec.selector` is now required and immutable after creation; use the existing template labels as the selector for seamless upgrades
    * `spec.progressDeadlineSeconds` now defaults to `600` seconds (the default in `extensions/v1beta1` was no deadline)
    * `spec.revisionHistoryLimit` now defaults to `10` (the default in `apps/v1beta1` was `2`, the default in `extensions/v1beta1` was to retain all)
    * `maxSurge` and `maxUnavailable` now default to `25%` (the default in `extensions/v1beta1` was `1`)
-->
* 值得注意的變更：
  * `spec.rollbackTo` 欄位被刪除
  * `spec.selector` 欄位現在變為必需欄位，並且在 Deployment 建立之後不可變更；
    可以使用現有的模板的標籤作為選擇算符以實現無縫遷移。
  * `spec.progressDeadlineSeconds` 的預設值變為 `600` 秒
    （`extensions/v1beta1` 中的預設值是沒有期限）
  * `spec.revisionHistoryLimit` 的預設值變為 `10`
    （`apps/v1beta1` API 版本中此欄位預設值為 `2`，在`extensions/v1beta1` API
    版本中的預設行為是保留所有歷史記錄）。
  * `maxSurge` 和 `maxUnavailable` 的預設值變為 `25%`
    （在 `extensions/v1beta1` API 版本中，這些欄位的預設值是 `1`）。

#### StatefulSet {#statefulset-v116}

<!--
The **apps/v1beta1** and **apps/v1beta2** API versions of StatefulSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**apps/v1beta1** 和 **apps/v1beta2** API 版本的 StatefulSet 在 v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **apps/v1** API 版本，此 API 從 v1.9 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
<!--
* Notable changes:
    * `spec.selector` is now required and immutable after creation; use the existing template labels as the selector for seamless upgrades
    * `spec.updateStrategy.type` now defaults to `RollingUpdate` (the default in `apps/v1beta1` was `OnDelete`)
-->
* 值得注意的變更：
  * `spec.selector` 欄位現在變為必需欄位，並且在 StatefulSet 建立之後不可變更；
    可以使用現有的模板的標籤作為選擇算符以實現無縫遷移。
  * `spec.updateStrategy.type` 的預設值變為 `RollingUpdate`
    （`apps/v1beta1` API 版本中的預設值是 `OnDelete`）。

#### ReplicaSet {#replicaset-v116}

<!--
The **extensions/v1beta1**, **apps/v1beta1**, and **apps/v1beta2** API versions of ReplicaSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1**、**apps/v1beta1** 和 **apps/v1beta2** API 版本的
ReplicaSet 在 v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **apps/v1** API 版本，此 API 從 v1.9 版本開始可用；
* 所有的已儲存的物件都可以透過新的 API 來訪問；
<!--
* Notable changes:
    * `spec.selector` is now required and immutable after creation; use the existing template labels as the selector for seamless upgrades
-->
* 值得注意的變更：
  * `spec.selector` 現在變成必需欄位，並且在物件建立之後不可變更；
    可以將現有模板的標籤作為選擇算符以實現無縫遷移。

#### PodSecurityPolicy {#psp-v116}

<!--
The **extensions/v1beta1** API version of PodSecurityPolicy is no longer served as of v1.16.

* Migrate manifests and API client to use the **policy/v1beta1** API version, available since v1.10.
* Note that the **policy/v1beta1** API version of PodSecurityPolicy will be removed in v1.25.
-->
**extensions/v1beta1** API 版本的 PodSecurityPolicy 在 v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **policy/v1beta1** API 版本，此 API 從 v1.10 版本開始可用；
* 注意 **policy/v1beta1** API 版本的 PodSecurityPolicy 會在 v1.25 版本中移除。

<!--
## What to do

### Test with deprecated APIs disabled
-->
## 需要做什麼   {#what-to-do}

### 在禁用已啟用 API 的情況下執行測試

<!--
You can test your clusters by starting an API server with specific API versions disabled
to simulate upcoming removals. Add the following flag to the API server startup arguments:
-->
你可以透過在啟動 API 伺服器時禁用特定的 API 版本來模擬即將發生的
API 移除，從而完成測試。在 API 伺服器啟動引數中新增如下標誌：

`--runtime-config=<group>/<version>=false`

<!--
For example:
-->
例如：

`--runtime-config=admissionregistration.k8s.io/v1beta1=false,apiextensions.k8s.io/v1beta1,...`

<!--
### Locate use of deprecated APIs

Use [client warnings, metrics, and audit information available in 1.19+](https://kubernetes.io/blog/2020/09/03/warnings/#deprecation-warnings)
to locate use of deprecated APIs.
-->
### 定位何處使用了已棄用的 API

使用 [client warnings, metrics, and audit information available in 1.19+](https://kubernetes.io/blog/2020/09/03/warnings/#deprecation-warnings)
來定位在何處使用了已啟用的 API。

<!--
### Migrate to non-deprecated APIs
-->
### 遷移到未被棄用的 API

<!--
* Update custom integrations and controllers to call the non-deprecated APIs
* Change YAML files to reference the non-deprecated APIs
-->
* 更新自定義的整合元件和控制器，呼叫未被棄用的 API
* 更改 YAML 檔案引用未被棄用的 API

<!--
You can use the `kubectl-convert` command (`kubectl convert` prior to v1.20)
to automatically convert an existing object:
-->
你可以用 `kubectl-convert` 命令（在 v1.20 之前是 `kubectl convert`）
來自動轉換現有物件：

`kubectl-convert -f <file> --output-version <group>/<version>`.

<!--
For example, to convert an older Deployment to `apps/v1`, you can run:
-->
例如，要將較老的 Deployment 轉換為 `apps/v1` 版本，你可以執行

`kubectl-convert -f ./my-deployment.yaml --output-version apps/v1`

<!--
Note that this may use non-ideal default values. To learn more about a specific
resource, check the Kubernetes [API reference](/docs/reference/kubernetes-api/).
-->
注意這種操作生成的結果中可能使用的預設值並不理想。
要進一步瞭解某個特定資源，可查閱 Kubernetes [API 參考](/zh-cn/docs/reference/kubernetes-api/)。
