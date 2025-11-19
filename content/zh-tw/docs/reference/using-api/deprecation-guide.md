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
隨着 Kubernetes API 的演化，API 會週期性地被重組或升級。
當 API 演化時，老的 API 會被棄用並被最終刪除。
本頁面包含你在將已棄用 API 版本遷移到新的更穩定的 API 版本時需要了解的知識。

<!-- body -->

<!--
## Removed APIs by release
-->
## 各發行版本中移除的 API  {#removed-apis-by-release}

### v1.32

<!--
The **v1.32** release will stopped the following deprecated API versions:
-->
**v1.32** 發行版本已停止提供以下已棄用的 API 版本：

<!--
#### Flow control resources {#flowcontrol-resources-v132}

The **flowcontrol.apiserver.k8s.io/v1beta3** API version of FlowSchema and PriorityLevelConfiguration is longer be served in v1.32.
-->
#### 流控制資源   {#flowcontrol-resources-v132}

FlowSchema 和 PriorityLevelConfiguration 的
**flowcontrol.apiserver.k8s.io/v1beta3** API 版本在 v1.32 中不再提供。

<!--
* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1** API version, available since v1.29.
* All existing persisted objects are accessible via the new API
* Notable changes in **flowcontrol.apiserver.k8s.io/v1**:
  * The PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field
    only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.
-->
* 遷移清單和 API 客戶端以使用 **flowcontrol.apiserver.k8s.io/v1** API 版本（自 v1.29 起可用）。
* 所有現有的持久對象都可以通過新的 API 訪問。
* **flowcontrol.apiserver.k8s.io/v1** 中的顯着變化：
  * PriorityLevelConfiguration 的 `spec.limited.nominalConcurrencyShares`
    字段僅在未指定時默認爲 30，並且顯式值 0 時不會更改爲 30。

### v1.29

<!--
The **v1.29** release stopped serving the following deprecated API versions:
-->
**v1.29** 發行版本停止支持以下已棄用的 API 版本：

<!--
#### Flow control resources {#flowcontrol-resources-v129}
-->
#### 流控制資源 {#flowcontrol-resources-v129}

<!--
The **flowcontrol.apiserver.k8s.io/v1beta2** API version of FlowSchema and PriorityLevelConfiguration is no longer be served in v1.29.

* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1** API version, available since v1.29, or the **flowcontrol.apiserver.k8s.io/v1beta3** API version, available since v1.26.
* All existing persisted objects are accessible via the new API
* Notable changes in **flowcontrol.apiserver.k8s.io/v1**:
  * The PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field
    is renamed to `spec.limited.nominalConcurrencyShares` and only defaults to 30 when unspecified,
    and an explicit value of 0 is not changed to 30.
* Notable changes in **flowcontrol.apiserver.k8s.io/v1beta3**:
  * The PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field is renamed to `spec.limited.nominalConcurrencyShares`
-->
從 v1.29 版本開始不再提供 **flowcontrol.apiserver.k8s.io/v1beta2** API 版本的
FlowSchema 和 PriorityLevelConfiguration。

* 遷移清單和 API 客戶端使用 **flowcontrol.apiserver.k8s.io/v1** API 版本（自 v1.29 版本開始可用），
  或 **flowcontrol.apiserver.k8s.io/v1beta3** API 版本（自 v1.26 起可用）；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* **flowcontrol.apiserver.k8s.io/v1** 中的顯着變化：
  * PriorityLevelConfiguration 的 `spec.limited.assuredConcurrencyShares`
    字段已被重命名爲 `spec.limited.nominalConcurrencyShares`，僅在未指定時默認爲 30，
    並且顯式值 0 不會更改爲 30。
* **flowcontrol.apiserver.k8s.io/v1beta3** 中需要額外注意的變更：
  * PriorityLevelConfiguration 的 `spec.limited.assuredConcurrencyShares`
    字段已被更名爲 `spec.limited.nominalConcurrencyShares`。

### v1.27

<!--
The **v1.27** release stopped serving the following deprecated API versions:
-->
**v1.27** 發行版本停止支持以下已棄用的 API 版本：

#### CSIStorageCapacity {#csistoragecapacity-v127}

<!--
The **storage.k8s.io/v1beta1** API version of CSIStorageCapacity is no longer be served in v1.27.

* Migrate manifests and API clients to use the **storage.k8s.io/v1** API version, available since v1.24.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
從 v1.27 版本開始不再提供 **storage.k8s.io/v1beta1** API 版本的 CSIStorageCapacity。

* 自 v1.24 版本起，遷移清單和 API 客戶端使用 **storage.k8s.io/v1** API 版本
* 所有現有的持久化對象都可以通過新的 API 訪問
* 沒有需要額外注意的變更

### v1.26

<!--
The **v1.26** release stopped serving the following deprecated API versions:
-->
**v1.26** 發行版本中將去除以下已棄用的 API 版本：

<!--
#### Flow control resources {#flowcontrol-resources-v126}
-->
#### 流控制資源     {#flowcontrol-resources-v126}

<!--
The **flowcontrol.apiserver.k8s.io/v1beta1** API version of FlowSchema and PriorityLevelConfiguration is no longer served as of v1.26.

* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1beta2** API version.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
從 v1.26 版本開始不再提供 **flowcontrol.apiserver.k8s.io/v1beta1** API 版本的
FlowSchema 和 PriorityLevelConfiguration。

* 遷移清單和 API 客戶端使用 **flowcontrol.apiserver.k8s.io/v1beta2** API 版本；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v126}

<!--
The **autoscaling/v2beta2** API version of HorizontalPodAutoscaler is no longer served as of v1.26.

* Migrate manifests and API clients to use the **autoscaling/v2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `targetAverageUtilization` is replaced with `target.averageUtilization` and `target.type: Utilization`. See [Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).
-->
從 v1.26 版本開始不再提供 **autoscaling/v2beta2** API 版本的
HorizontalPodAutoscaler。

* 遷移清單和 API 客戶端使用 **autoscaling/v2** API 版本，
  此 API 從 v1.23 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問。
* 值得注意的變更：
  * `targetAverageUtilization` 被替換爲 `target.averageUtilization` 和 `target.type: Utilization`。
  請參閱[基於多項度量指標和自定義度量指標自動擴縮](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)。

### v1.25

<!--
The **v1.25** release stopped serving the following deprecated API versions:
-->
**v1.25** 發行版本將停止提供以下已廢棄 API 版本：

#### CronJob {#cronjob-v125}

<!--
The **batch/v1beta1** API version of CronJob is no longer served as of v1.25.

* Migrate manifests and API clients to use the **batch/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
從 v1.25 版本開始不再提供 **batch/v1beta1** API 版本的 CronJob。

* 遷移清單和 API 客戶端使用 **batch/v1** API 版本，此 API 從 v1.21 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

#### EndpointSlice {#endpointslice-v125}

<!--
The **discovery.k8s.io/v1beta1** API version of EndpointSlice is no longer served as of v1.25.

* Migrate manifests and API clients to use the **discovery.k8s.io/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* Notable changes in **discovery.k8s.io/v1**:
  * use per Endpoint `nodeName` field instead of deprecated `topology["kubernetes.io/hostname"]` field
  * use per Endpoint `zone` field instead of deprecated `topology["topology.kubernetes.io/zone"]` field
  * `topology` is replaced with the `deprecatedTopology` field which is not writable in v1
-->
從 v1.25 版本開始不再提供 **discovery.k8s.io/v1beta1** API 版本的 EndpointSlice。

* 遷移清單和 API 客戶端使用 **discovery.k8s.io/v1** API 版本，此 API 從 v1.21 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* **discovery.k8s.io/v1** 中值得注意的變更有：
  * 使用每個 Endpoint 的 `nodeName` 字段而不是已被棄用的
    `topology["kubernetes.io/hostname"]` 字段；
  * 使用每個 Endpoint 的 `zone` 字段而不是已被棄用的
    `topology["kubernetes.io/zone"]` 字段；
  * `topology` 字段被替換爲 `deprecatedTopology`，並且在 v1 版本中不可寫入。

#### Event {#event-v125}

<!--
The **events.k8s.io/v1beta1** API version of Event is no longer served as of v1.25.

* Migrate manifests and API clients to use the **events.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
-->
從 v1.25 版本開始不再提供 **events.k8s.io/v1beta1** API 版本的 Event。

* 遷移清單和 API 客戶端使用 **events.k8s.io/v1** API 版本，此 API 從 v1.19 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；

<!--
* Notable changes in **events.k8s.io/v1**:
  * `type` is limited to `Normal` and `Warning`
  * `involvedObject` is renamed to `regarding`
  * `action`, `reason`, `reportingController`, and `reportingInstance` are required
    when creating new **events.k8s.io/v1** Events
  * use `eventTime` instead of the deprecated `firstTimestamp` field (which is renamed
    to `deprecatedFirstTimestamp` and not permitted in new **events.k8s.io/v1** Events)
  * use `series.lastObservedTime` instead of the deprecated `lastTimestamp` field
    (which is renamed to `deprecatedLastTimestamp` and not permitted in new **events.k8s.io/v1** Events)
  * use `series.count` instead of the deprecated `count` field
    (which is renamed to `deprecatedCount` and not permitted in new **events.k8s.io/v1** Events)
  * use `reportingController` instead of the deprecated `source.component` field
    (which is renamed to `deprecatedSource.component` and not permitted in new **events.k8s.io/v1** Events)
  * use `reportingInstance` instead of the deprecated `source.host` field
    (which is renamed to `deprecatedSource.host` and not permitted in new **events.k8s.io/v1** Events)
-->
* **events.k8s.io/v1** 中值得注意的變更有：
  * `type` 字段只能設置爲 `Normal` 和 `Warning` 之一；
  * `involvedObject` 字段被更名爲 `regarding`；
  * `action`、`reason`、`reportingController` 和 `reportingInstance` 字段
    在創建新的 **events.k8s.io/v1** 版本 Event 時都是必需的字段；
  * 使用 `eventTime` 而不是已被棄用的 `firstTimestamp` 字段
    （該字段已被更名爲 `deprecatedFirstTimestamp`，且不允許出現在新的 **events.k8s.io/v1** Event 對象中）；
  * 使用 `series.lastObservedTime` 而不是已被棄用的 `lastTimestamp` 字段
    （該字段已被更名爲 `deprecatedLastTimestamp`，且不允許出現在新的 **events.k8s.io/v1** Event 對象中）；
  * 使用 `series.count` 而不是已被棄用的 `count` 字段
    （該字段已被更名爲 `deprecatedCount`，且不允許出現在新的 **events.k8s.io/v1** Event 對象中）；
  * 使用 `reportingController` 而不是已被棄用的 `source.component` 字段
    （該字段已被更名爲 `deprecatedSource.component`，且不允許出現在新的 **events.k8s.io/v1** Event 對象中）；
  * 使用 `reportingInstance` 而不是已被棄用的 `source.host` 字段
    （該字段已被更名爲 `deprecatedSource.host`，且不允許出現在新的 **events.k8s.io/v1** Event 對象中）。

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v125}

<!--
The **autoscaling/v2beta1** API version of HorizontalPodAutoscaler is no longer served as of v1.25.

* Migrate manifests and API clients to use the **autoscaling/v2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `targetAverageUtilization` is replaced with `target.averageUtilization` and `target.type: Utilization`. See [Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).
-->
從 v1.25 版本開始不再提供 **autoscaling/v2beta1** API 版本的
HorizontalPodAutoscaler。

* 遷移清單和 API 客戶端使用 **autoscaling/v2** API 版本，此 API 從 v1.23 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問。
* 值得注意的變更：
  * `targetAverageUtilization` 被替換爲 `target.averageUtilization` 和 `target.type: Utilization`。
  請參閱[基於多項度量指標和自定義度量指標自動擴縮](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)。

#### PodDisruptionBudget {#poddisruptionbudget-v125}

<!--
The **policy/v1beta1** API version of PodDisruptionBudget is no longer served as of v1.25.

* Migrate manifests and API clients to use the **policy/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* Notable changes in **policy/v1**:
  * an empty `spec.selector` (`{}`) written to a `policy/v1` PodDisruptionBudget selects all
    pods in the namespace (in `policy/v1beta1` an empty `spec.selector` selected no pods).
    An unset `spec.selector` selects no pods in either API version.
-->
從 v1.25 版本開始不再提供 **policy/v1beta1** API 版本的 PodDisruptionBudget。

* 遷移清單和 API 客戶端使用 **policy/v1** API 版本，此 API 從 v1.21 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* **policy/v1** 中需要額外注意的變更有：
  * 在 `policy/v1` 版本的 PodDisruptionBudget 中將 `spec.selector`
    設置爲空（`{}`）時會選擇名字空間中的所有 Pod（在 `policy/v1beta1`
    版本中，空的 `spec.selector` 不會選擇任何 Pod）。如果 `spec.selector`
    未設置，則在兩個 API 版本下都不會選擇任何 Pod。

#### PodSecurityPolicy {#psp-v125}

<!--
PodSecurityPolicy in the **policy/v1beta1** API version is no longer served as of v1.25,
and the PodSecurityPolicy admission controller will be removed.

Migrate to [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
or a [3rd party admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/).
For a migration guide, see [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
For more information on the deprecation, see [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).
-->
從 v1.25 版本開始不再提供 **policy/v1beta1** API 版本中的 PodSecurityPolicy，
並且 PodSecurityPolicy 准入控制器也會被刪除。

遷移到 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)或[第三方准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)。
有關遷移指南，請參閱[從 PodSecurityPolicy 遷移到內置 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。
有關棄用的更多信息，請參閱 [PodSecurityPolicy 棄用：過去、現在和未來](/zh-cn/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。

#### RuntimeClass {#runtimeclass-v125}

<!--
RuntimeClass in the **node.k8s.io/v1beta1** API version is no longer served as of v1.25.

* Migrate manifests and API clients to use the **node.k8s.io/v1** API version, available since v1.20.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
從 v1.25 版本開始不再提供 **node.k8s.io/v1beta1** API 版本中的 RuntimeClass。

* 遷移清單和 API 客戶端使用 **node.k8s.io/v1** API 版本，此 API 從 v1.20 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

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
The **admissionregistration.k8s.io/v1beta1** API version of MutatingWebhookConfiguration
and ValidatingWebhookConfiguration is no longer served as of v1.22.
-->
**admissionregistration.k8s.io/v1beta1** API 版本的 MutatingWebhookConfiguration
和 ValidatingWebhookConfiguration 不在 v1.22 版本中繼續提供。

<!--
* Migrate manifests and API clients to use the **admissionregistration.k8s.io/v1** API version, available since v1.16.
* All existing persisted objects are accessible via the new APIs
-->
* 遷移清單和 API 客戶端使用 **admissionregistration.k8s.io/v1** API 版本，
  此 API 從 v1.16 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；

<!--
* Notable changes:
  * `webhooks[*].failurePolicy` default changed from `Ignore` to `Fail` for v1
  * `webhooks[*].matchPolicy` default changed from `Exact` to `Equivalent` for v1
  * `webhooks[*].timeoutSeconds` default changed from `30s` to `10s` for v1
  * `webhooks[*].sideEffects` default value is removed, and the field made required,
    and only `None` and `NoneOnDryRun` are permitted for v1
  * `webhooks[*].admissionReviewVersions` default value is removed and the field made
    required for v1 (supported versions for AdmissionReview are `v1` and `v1beta1`)
  * `webhooks[*].name` must be unique in the list for objects created via `admissionregistration.k8s.io/v1`
-->
* 值得注意的變更：
  * `webhooks[*].failurePolicy` 在 v1 版本中默認值從 `Ignore` 改爲 `Fail`
  * `webhooks[*].matchPolicy` 在 v1 版本中默認值從 `Exact` 改爲 `Equivalent`
  * `webhooks[*].timeoutSeconds` 在 v1 版本中默認值從 `30s` 改爲 `10s`
  * `webhooks[*].sideEffects` 的默認值被刪除，並且該字段變爲必須指定；
    在 v1 版本中可選的值只能是 `None` 和 `NoneOnDryRun` 之一
  * `webhooks[*].admissionReviewVersions` 的默認值被刪除，在 v1
    版本中此字段變爲必須指定（AdmissionReview 的被支持版本包括 `v1` 和 `v1beta1`）
  * `webhooks[*].name` 必須在通過 `admissionregistration.k8s.io/v1`
    創建的對象列表中唯一

#### CustomResourceDefinition {#customresourcedefinition-v122}

<!--
The **apiextensions.k8s.io/v1beta1** API version of CustomResourceDefinition is no longer served as of v1.22.

* Migrate manifests and API clients to use the **apiextensions.k8s.io/v1** API version, available since v1.16.
* All existing persisted objects are accessible via the new API
-->
**apiextensions.k8s.io/v1beta1** API 版本的 CustomResourceDefinition
不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **apiextensions.k8s.io/v1** API 版本，此 API 從 v1.16 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
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
  * `spec.scope` 的默認值不再是 `Namespaced`，該字段必須顯式指定
  * `spec.version` 在 v1 版本中被刪除；應改用 `spec.versions`
  * `spec.validation` 在 v1 版本中被刪除；應改用 `spec.versions[*].schema`
  * `spec.subresources` 在 v1 版本中被刪除；應改用 `spec.versions[*].subresources`
  * `spec.additionalPrinterColumns` 在 v1 版本中被刪除；應改用
    `spec.versions[*].additionalPrinterColumns`
  * `spec.conversion.webhookClientConfig` 在 v1 版本中被移動到
    `spec.conversion.webhook.clientConfig` 中

  <!--
  * `spec.conversion.conversionReviewVersions` is moved to `spec.conversion.webhook.conversionReviewVersions` in v1
  * `spec.versions[*].schema.openAPIV3Schema` is now required when creating v1 CustomResourceDefinition objects,
    and must be a [structural schema](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)
  * `spec.preserveUnknownFields: true` is disallowed when creating v1 CustomResourceDefinition objects;
    it must be specified within schema definitions as `x-kubernetes-preserve-unknown-fields: true`
  * In `additionalPrinterColumns` items, the `JSONPath` field was renamed to `jsonPath` in v1
    (fixes [#66531](https://github.com/kubernetes/kubernetes/issues/66531))
  -->

  * `spec.conversion.conversionReviewVersions` 在 v1 版本中被移動到
    `spec.conversion.webhook.conversionReviewVersions`
  * `spec.versions[*].schema.openAPIV3Schema` 在創建 v1 版本的
    CustomResourceDefinition 對象時變成必需字段，並且其取值必須是一個
    [結構化的 Schema](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)
  * `spec.preserveUnknownFields: true` 在創建 v1 版本的 CustomResourceDefinition
    對象時不允許指定；該配置必須在 Schema 定義中使用
    `x-kubernetes-preserve-unknown-fields: true` 來設置
  * 在 v1 版本中，`additionalPrinterColumns` 的條目中的 `JSONPath` 字段被更名爲
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
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

#### TokenReview {#tokenreview-v122}

<!--
The **authentication.k8s.io/v1beta1** API version of TokenReview is no longer served as of v1.22.

* Migrate manifests and API clients to use the **authentication.k8s.io/v1** API version, available since v1.6.
* No notable changes
-->
**authentication.k8s.io/v1beta1** API 版本的 TokenReview 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **authentication.k8s.io/v1** API 版本，此 API 從
  v1.6 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

#### SubjectAccessReview resources {#subjectaccessreview-resources-v122}

<!--
The **authorization.k8s.io/v1beta1** API version of LocalSubjectAccessReview,
SelfSubjectAccessReview, SubjectAccessReview, and SelfSubjectRulesReview is no longer served as of v1.22.

* Migrate manifests and API clients to use the **authorization.k8s.io/v1** API version, available since v1.6.
* Notable changes:
  * `spec.group` was renamed to `spec.groups` in v1 (fixes [#32709](https://github.com/kubernetes/kubernetes/issues/32709))
-->
**authorization.k8s.io/v1beta1** API 版本的 LocalSubjectAccessReview、
SelfSubjectAccessReview、SubjectAccessReview、SelfSubjectRulesReview 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **authorization.k8s.io/v1** API 版本，此 API 從
  v1.6 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 需要額外注意的變更：
  * `spec.group` 在 v1 版本中被更名爲 `spec.groups`
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
* 所有的已保存的對象都可以通過新的 API 來訪問；

<!--
* Notable changes in `certificates.k8s.io/v1`:
  * For API clients requesting certificates:
    * `spec.signerName` is now required
      (see [known Kubernetes signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)),
      and requests for `kubernetes.io/legacy-unknown` are not allowed to be created via the `certificates.k8s.io/v1` API
    * `spec.usages` is now required, may not contain duplicate values, and must only contain known usages
  * For API clients approving or signing certificates:
    * `status.conditions` may not contain duplicate types
    * `status.conditions[*].status` is now required
    * `status.certificate` must be PEM-encoded, and contain only `CERTIFICATE` blocks
-->
* `certificates.k8s.io/v1` 中需要額外注意的變更：
  * 對於請求證書的 API 客戶端而言：
    * `spec.signerName` 現在變成必需字段（參閱
      [已知的 Kubernetes 簽署者](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)），
      並且通過 `certificates.k8s.io/v1` API 不可以創建簽署者爲
      `kubernetes.io/legacy-unknown` 的請求
    * `spec.usages` 現在變成必需字段，其中不可以包含重複的字符串值，
      並且只能包含已知的用法字符串
  * 對於要批准或者簽署證書的 API 客戶端而言：
    * `status.conditions` 中不可以包含重複的類型
    * `status.conditions[*].status` 字段現在變爲必需字段
    * `status.certificate` 必須是 PEM 編碼的，而且其中只能包含 `CERTIFICATE`
      數據塊

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
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

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
* 所有的已保存的對象都可以通過新的 API 來訪問；
<!--
* Notable changes:
  * `spec.backend` is renamed to `spec.defaultBackend`
  * The backend `serviceName` field is renamed to `service.name`
  * Numeric backend `servicePort` fields are renamed to `service.port.number`
  * String backend `servicePort` fields are renamed to `service.port.name`
  * `pathType` is now required for each specified path. Options are `Prefix`,
    `Exact`, and `ImplementationSpecific`. To match the undefined `v1beta1` behavior, use `ImplementationSpecific`.
-->
* 值得注意的變更：
  * `spec.backend` 字段被更名爲 `spec.defaultBackend`
  * 後端的 `serviceName` 字段被更名爲 `service.name`
  * 數值表示的後端 `servicePort` 字段被更名爲 `service.port.number`
  * 字符串表示的後端 `servicePort` 字段被更名爲 `service.port.name`
  * 對所有要指定的路徑，`pathType` 都成爲必需字段。
    可選項爲 `Prefix`、`Exact` 和 `ImplementationSpecific`。
    要匹配 `v1beta1` 版本中未定義路徑類型時的行爲，可使用 `ImplementationSpecific`

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
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

<!--
#### RBAC resources {#rbac-resources-v122}

The **rbac.authorization.k8s.io/v1beta1** API version of ClusterRole, ClusterRoleBinding,
Role, and RoleBinding is no longer served as of v1.22.

* Migrate manifests and API clients to use the **rbac.authorization.k8s.io/v1** API version, available since v1.8.
* All existing persisted objects are accessible via the new APIs
* No notable changes
-->
#### RBAC 資源   {#rbac-resources-v122}

**rbac.authorization.k8s.io/v1beta1** API 版本的 ClusterRole、ClusterRoleBinding、
Role 和 RoleBinding 不在 v1.22 版本中繼續提供。

* 遷移清單和 API 客戶端使用 **rbac.authorization.k8s.io/v1** API 版本，此 API 從
  v1.8 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

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
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

<!--
#### Storage resources {#storage-resources-v122}
-->
#### 存儲資源  {#storage-resources-v122}

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
* 所有的已保存的對象都可以通過新的 API 來訪問；
* 沒有需要額外注意的變更。

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
* 所有的已保存的對象都可以通過新的 API 來訪問。

#### DaemonSet {#daemonset-v116}

<!--
The **extensions/v1beta1** and **apps/v1beta2** API versions of DaemonSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1** 和 **apps/v1beta2** API 版本的 DaemonSet 在
v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **apps/v1** API 版本，此 API 從 v1.9 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
<!--
* Notable changes:
  * `spec.templateGeneration` is removed
  * `spec.selector` is now required and immutable after creation; use the existing
    template labels as the selector for seamless upgrades
  * `spec.updateStrategy.type` now defaults to `RollingUpdate`
    (the default in `extensions/v1beta1` was `OnDelete`)
-->
* 值得注意的變更：
  * `spec.templateGeneration` 字段被刪除
  * `spec.selector` 現在變成必需字段，並且在對象創建之後不可變更；
    可以將現有模板的標籤作爲選擇算符以實現無縫遷移。
  * `spec.updateStrategy.type` 的默認值變爲 `RollingUpdate`
    （`extensions/v1beta1` API 版本中的默認值是 `OnDelete`）。

#### Deployment {#deployment-v116}

<!--
The **extensions/v1beta1**, **apps/v1beta1**, and **apps/v1beta2** API versions of Deployment are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1**、**apps/v1beta1** 和 **apps/v1beta2** API 版本的
Deployment 在 v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **apps/v1** API 版本，此 API 從 v1.9 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
<!--
* Notable changes:
  * `spec.rollbackTo` is removed
  * `spec.selector` is now required and immutable after creation; use the existing
    template labels as the selector for seamless upgrades
  * `spec.progressDeadlineSeconds` now defaults to `600` seconds
    (the default in `extensions/v1beta1` was no deadline)
  * `spec.revisionHistoryLimit` now defaults to `10`
    (the default in `apps/v1beta1` was `2`, the default in `extensions/v1beta1` was to retain all)
  * `maxSurge` and `maxUnavailable` now default to `25%`
    (the default in `extensions/v1beta1` was `1`)
-->
* 值得注意的變更：
  * `spec.rollbackTo` 字段被刪除
  * `spec.selector` 字段現在變爲必需字段，並且在 Deployment 創建之後不可變更；
    可以使用現有的模板的標籤作爲選擇算符以實現無縫遷移。
  * `spec.progressDeadlineSeconds` 的默認值變爲 `600` 秒
    （`extensions/v1beta1` 中的默認值是沒有期限）
  * `spec.revisionHistoryLimit` 的默認值變爲 `10`
    （`apps/v1beta1` API 版本中此字段默認值爲 `2`，在`extensions/v1beta1` API
    版本中的默認行爲是保留所有歷史記錄）。
  * `maxSurge` 和 `maxUnavailable` 的默認值變爲 `25%`
    （在 `extensions/v1beta1` API 版本中，這些字段的默認值是 `1`）。

#### StatefulSet {#statefulset-v116}

<!--
The **apps/v1beta1** and **apps/v1beta2** API versions of StatefulSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**apps/v1beta1** 和 **apps/v1beta2** API 版本的 StatefulSet 在 v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **apps/v1** API 版本，此 API 從 v1.9 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
<!--
* Notable changes:
  * `spec.selector` is now required and immutable after creation;
    use the existing template labels as the selector for seamless upgrades
  * `spec.updateStrategy.type` now defaults to `RollingUpdate`
    (the default in `apps/v1beta1` was `OnDelete`)
-->
* 值得注意的變更：
  * `spec.selector` 字段現在變爲必需字段，並且在 StatefulSet 創建之後不可變更；
    可以使用現有的模板的標籤作爲選擇算符以實現無縫遷移。
  * `spec.updateStrategy.type` 的默認值變爲 `RollingUpdate`
    （`apps/v1beta1` API 版本中的默認值是 `OnDelete`）。

#### ReplicaSet {#replicaset-v116}

<!--
The **extensions/v1beta1**, **apps/v1beta1**, and **apps/v1beta2** API versions of ReplicaSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1**、**apps/v1beta1** 和 **apps/v1beta2** API 版本的
ReplicaSet 在 v1.16 版本中不再繼續提供。

* 遷移清單和 API 客戶端使用 **apps/v1** API 版本，此 API 從 v1.9 版本開始可用；
* 所有的已保存的對象都可以通過新的 API 來訪問；
<!--
* Notable changes:
  * `spec.selector` is now required and immutable after creation; use the existing template labels as the selector for seamless upgrades
-->
* 值得注意的變更：
  * `spec.selector` 現在變成必需字段，並且在對象創建之後不可變更；
    可以將現有模板的標籤作爲選擇算符以實現無縫遷移。

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

### 在禁用已啓用 API 的情況下執行測試

<!--
You can test your clusters by starting an API server with specific API versions disabled
to simulate upcoming removals. Add the following flag to the API server startup arguments:
-->
你可以通過在啓動 API 服務器時禁用特定的 API 版本來模擬即將發生的
API 移除，從而完成測試。在 API 服務器啓動參數中添加如下標誌：

`--runtime-config=<group>/<version>=false`

<!--
For example:
-->
例如：

`--runtime-config=admissionregistration.k8s.io/v1beta1=false,apiextensions.k8s.io/v1beta1,...`

<!--
### Locate use of deprecated APIs

Use [client warnings, metrics, and audit information available in 1.19+](/blog/2020/09/03/warnings/#deprecation-warnings)
to locate use of deprecated APIs.
-->
### 定位何處使用了已棄用的 API

使用 [1.19 及更高版本中可用的客戶端警告、指標和審計信息](/zh-cn/blog/2020/09/03/warnings/#deprecation-warnings)
來定位在何處使用了已棄用的 API。

<!--
### Migrate to non-deprecated APIs
-->
### 遷移到未被棄用的 API

<!--
* Update custom integrations and controllers to call the non-deprecated APIs
* Change YAML files to reference the non-deprecated APIs
-->
* 更新自定義的集成組件和控制器，調用未被棄用的 API
* 更改 YAML 文件引用未被棄用的 API

  <!--
  You can use the `kubectl convert` command to automatically convert an existing object:
  -->
  你可以用 `kubectl-convert` 命令自動轉換現有對象：

  ```shell
  kubectl convert -f <file> --output-version <group>/<version>
  ```

  <!--
  For example, to convert an older Deployment to `apps/v1`, you can run:
  -->
  例如，要將較老的 Deployment 版本轉換爲 `apps/v1` 版本，你可以運行：

  ```shell
  kubectl convert -f ./my-deployment.yaml --output-version apps/v1
  ```

  <!--
  This conversion may use non-ideal default values. To learn more about a specific
  resource, check the Kubernetes [API reference](/docs/reference/kubernetes-api/).
  -->
  這個轉換可能使用了非理想的默認值。要了解更多關於特定資源的信息，
  請查閱 Kubernetes [API 參考文檔](/zh-cn/docs/reference/kubernetes-api/)。

  {{< note >}}
  <!--
  The `kubectl convert` tool is not installed by default, although
  in fact it once was part of `kubectl` itself. For more details, you can read the
  [deprecation and removal issue](https://github.com/kubernetes/kubectl/issues/725)
  for the built-in subcommand.
  -->
  儘管實際上 `kubectl convert` 工具曾經是 `kubectl` 自身的一部分，但此工具不是默認安裝的。
  如果想了解更多詳情，可以閱讀內置子命令的[棄用和移除問題](https://github.com/kubernetes/kubectl/issues/725)。
  
  <!--
  To learn how to set up `kubectl convert` on your computer, visit the page that is right for your 
  operating system:
  [Linux](/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin),
  [macOS](/docs/tasks/tools/install-kubectl-macos/#install-kubectl-convert-plugin), or
  [Windows](/docs/tasks/tools/install-kubectl-windows/#install-kubectl-convert-plugin).
  -->
  要了解如何在你的計算機上設置 `kubectl convert`，查閱適合你操作系統的頁面：
  [Linux](/zh-cn/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin)、
  [macOS](/zh-cn/docs/tasks/tools/install-kubectl-macos/#install-kubectl-convert-plugin) 或
  [Windows](/zh-cn/docs/tasks/tools/install-kubectl-windows/#install-kubectl-convert-plugin)。
  {{< /note >}}
