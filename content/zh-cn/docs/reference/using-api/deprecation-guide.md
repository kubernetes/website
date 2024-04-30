---
title: 已弃用 API 的迁移指南
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
随着 Kubernetes API 的演化，API 会周期性地被重组或升级。
当 API 演化时，老的 API 会被弃用并被最终删除。
本页面包含你在将已弃用 API 版本迁移到新的更稳定的 API 版本时需要了解的知识。

<!-- body -->

<!--
## Removed APIs by release
-->
## 各发行版本中移除的 API  {#removed-apis-by-release}

### v1.32

<!--
The **v1.32** release will stop serving the following deprecated API versions:
-->
**v1.32** 发行版本将停止提供以下已弃用的 API 版本：

<!--
#### Flow control resources {#flowcontrol-resources-v132}

The **flowcontrol.apiserver.k8s.io/v1beta3** API version of FlowSchema and PriorityLevelConfiguration will no longer be served in v1.32.
-->
#### 流控制资源   {#flowcontrol-resources-v132}

FlowSchema 和 PriorityLevelConfiguration 的
**flowcontrol.apiserver.k8s.io/v1beta3** API 版本将不再在 v1.32 中提供。

<!--
* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1** API version, available since v1.29.
* All existing persisted objects are accessible via the new API
* Notable changes in **flowcontrol.apiserver.k8s.io/v1**:
  * The PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field
    only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.
-->
* 迁移清单和 API 客户端以使用 **flowcontrol.apiserver.k8s.io/v1** API 版本（自 v1.29 起可用）。
* 所有现有的持久对象都可以通过新的 API 访问。
* **flowcontrol.apiserver.k8s.io/v1** 中的显着变化：
  * PriorityLevelConfiguration 的 `spec.limited.nominalConcurrencyShares`
    字段仅在未指定时默认为 30，并且显式值 0 时不会更改为 30。

### v1.29

<!--
The **v1.29** release stopped serving the following deprecated API versions:
-->
**v1.29** 发行版本停止支持以下已弃用的 API 版本：

<!--
#### Flow control resources {#flowcontrol-resources-v129}
-->
#### 流控制资源 {#flowcontrol-resources-v129}

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
从 v1.29 版本开始不再提供 **flowcontrol.apiserver.k8s.io/v1beta2** API 版本的
FlowSchema 和 PriorityLevelConfiguration。

* 迁移清单和 API 客户端使用 **flowcontrol.apiserver.k8s.io/v1** API 版本（自 v1.29 版本开始可用），
  或 **flowcontrol.apiserver.k8s.io/v1beta3** API 版本（自 v1.26 起可用）；
* 所有的已保存的对象都可以通过新的 API 来访问；
* **flowcontrol.apiserver.k8s.io/v1** 中的显着变化：
  * PriorityLevelConfiguration 的 `spec.limited.assuredConcurrencyShares`
    字段已被重命名为 `spec.limited.nominalConcurrencyShares`，仅在未指定时默认为 30，
    并且显式值 0 不会更改为 30。
* **flowcontrol.apiserver.k8s.io/v1beta3** 中需要额外注意的变更：
  * PriorityLevelConfiguration 的 `spec.limited.assuredConcurrencyShares`
    字段已被更名为 `spec.limited.nominalConcurrencyShares`。

### v1.27

<!--
The **v1.27** release stopped serving the following deprecated API versions:
-->
**v1.27** 发行版本停止支持以下已弃用的 API 版本：

#### CSIStorageCapacity {#csistoragecapacity-v127}

<!--
The **storage.k8s.io/v1beta1** API version of CSIStorageCapacity is no longer be served in v1.27.

* Migrate manifests and API clients to use the **storage.k8s.io/v1** API version, available since v1.24.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
从 v1.27 版本开始不再提供 **storage.k8s.io/v1beta1** API 版本的 CSIStorageCapacity。

* 自 v1.24 版本起，迁移清单和 API 客户端使用 **storage.k8s.io/v1** API 版本
* 所有现有的持久化对象都可以通过新的 API 访问
* 没有需要额外注意的变更

### v1.26

<!--
The **v1.26** release stopped serving the following deprecated API versions:
-->
**v1.26** 发行版本中将去除以下已弃用的 API 版本：

<!--
#### Flow control resources {#flowcontrol-resources-v126}
-->
#### 流控制资源     {#flowcontrol-resources-v126}

<!--
The **flowcontrol.apiserver.k8s.io/v1beta1** API version of FlowSchema and PriorityLevelConfiguration is no longer served as of v1.26.

* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1beta2** API version.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
从 v1.26 版本开始不再提供 **flowcontrol.apiserver.k8s.io/v1beta1** API 版本的
FlowSchema 和 PriorityLevelConfiguration。

* 迁移清单和 API 客户端使用 **flowcontrol.apiserver.k8s.io/v1beta2** API 版本；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v126}

<!--
The **autoscaling/v2beta2** API version of HorizontalPodAutoscaler is no longer served as of v1.26.

* Migrate manifests and API clients to use the **autoscaling/v2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `targetAverageUtilization` is replaced with `target.averageUtilization` and `target.type: Utilization`. See [Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).
-->
从 v1.26 版本开始不再提供 **autoscaling/v2beta2** API 版本的
HorizontalPodAutoscaler。

* 迁移清单和 API 客户端使用 **autoscaling/v2** API 版本，
  此 API 从 v1.23 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问。
* 值得注意的变更：
  * `targetAverageUtilization` 被替换为 `target.averageUtilization` 和 `target.type: Utilization`。
  请参阅[基于多项度量指标和自定义度量指标自动扩缩](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)。

### v1.25

<!--
The **v1.25** release stopped serving the following deprecated API versions:
-->
**v1.25** 发行版本将停止提供以下已废弃 API 版本：

#### CronJob {#cronjob-v125}

<!--
The **batch/v1beta1** API version of CronJob is no longer served as of v1.25.

* Migrate manifests and API clients to use the **batch/v1** API version, available since v1.21.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
从 v1.25 版本开始不再提供 **batch/v1beta1** API 版本的 CronJob。

* 迁移清单和 API 客户端使用 **batch/v1** API 版本，此 API 从 v1.21 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

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
从 v1.25 版本开始不再提供 **discovery.k8s.io/v1beta1** API 版本的 EndpointSlice。

* 迁移清单和 API 客户端使用 **discovery.k8s.io/v1** API 版本，此 API 从 v1.21 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* **discovery.k8s.io/v1** 中值得注意的变更有：
  * 使用每个 Endpoint 的 `nodeName` 字段而不是已被弃用的
    `topology["kubernetes.io/hostname"]` 字段；
  * 使用每个 Endpoint 的 `zone` 字段而不是已被弃用的
    `topology["kubernetes.io/zone"]` 字段；
  * `topology` 字段被替换为 `deprecatedTopology`，并且在 v1 版本中不可写入。

#### Event {#event-v125}

<!--
The **events.k8s.io/v1beta1** API version of Event is no longer served as of v1.25.

* Migrate manifests and API clients to use the **events.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
-->
从 v1.25 版本开始不再提供 **events.k8s.io/v1beta1** API 版本的 Event。

* 迁移清单和 API 客户端使用 **events.k8s.io/v1** API 版本，此 API 从 v1.19 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；

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
* **events.k8s.io/v1** 中值得注意的变更有：
  * `type` 字段只能设置为 `Normal` 和 `Warning` 之一；
  * `involvedObject` 字段被更名为 `regarding`；
  * `action`、`reason`、`reportingController` 和 `reportingInstance` 字段
    在创建新的 **events.k8s.io/v1** 版本 Event 时都是必需的字段；
  * 使用 `eventTime` 而不是已被弃用的 `firstTimestamp` 字段
    （该字段已被更名为 `deprecatedFirstTimestamp`，且不允许出现在新的 **events.k8s.io/v1** Event 对象中）；
  * 使用 `series.lastObservedTime` 而不是已被弃用的 `lastTimestamp` 字段
    （该字段已被更名为 `deprecatedLastTimestamp`，且不允许出现在新的 **events.k8s.io/v1** Event 对象中）；
  * 使用 `series.count` 而不是已被弃用的 `count` 字段
    （该字段已被更名为 `deprecatedCount`，且不允许出现在新的 **events.k8s.io/v1** Event 对象中）；
  * 使用 `reportingController` 而不是已被弃用的 `source.component` 字段
    （该字段已被更名为 `deprecatedSource.component`，且不允许出现在新的 **events.k8s.io/v1** Event 对象中）；
  * 使用 `reportingInstance` 而不是已被弃用的 `source.host` 字段
    （该字段已被更名为 `deprecatedSource.host`，且不允许出现在新的 **events.k8s.io/v1** Event 对象中）。

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v125}

<!--
The **autoscaling/v2beta1** API version of HorizontalPodAutoscaler is no longer served as of v1.25.

* Migrate manifests and API clients to use the **autoscaling/v2** API version, available since v1.23.
* All existing persisted objects are accessible via the new API
* Notable changes:
  * `targetAverageUtilization` is replaced with `target.averageUtilization` and `target.type: Utilization`. See [Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).
-->
从 v1.25 版本开始不再提供 **autoscaling/v2beta1** API 版本的
HorizontalPodAutoscaler。

* 迁移清单和 API 客户端使用 **autoscaling/v2** API 版本，此 API 从 v1.23 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问。
* 值得注意的变更：
  * `targetAverageUtilization` 被替换为 `target.averageUtilization` 和 `target.type: Utilization`。
  请参阅[基于多项度量指标和自定义度量指标自动扩缩](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)。

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
从 v1.25 版本开始不再提供 **policy/v1beta1** API 版本的 PodDisruptionBudget。

* 迁移清单和 API 客户端使用 **policy/v1** API 版本，此 API 从 v1.21 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* **policy/v1** 中需要额外注意的变更有：
  * 在 `policy/v1` 版本的 PodDisruptionBudget 中将 `spec.selector`
    设置为空（`{}`）时会选择名字空间中的所有 Pod（在 `policy/v1beta1`
    版本中，空的 `spec.selector` 不会选择任何 Pod）。如果 `spec.selector`
    未设置，则在两个 API 版本下都不会选择任何 Pod。

#### PodSecurityPolicy {#psp-v125}

<!--
PodSecurityPolicy in the **policy/v1beta1** API version is no longer served as of v1.25,
and the PodSecurityPolicy admission controller will be removed.

Migrate to [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
or a [3rd party admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/).
For a migration guide, see [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
For more information on the deprecation, see [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).
-->
从 v1.25 版本开始不再提供 **policy/v1beta1** API 版本中的 PodSecurityPolicy，
并且 PodSecurityPolicy 准入控制器也会被删除。

迁移到 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)或[第三方准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)。
有关迁移指南，请参阅[从 PodSecurityPolicy 迁移到内置 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。
有关弃用的更多信息，请参阅 [PodSecurityPolicy 弃用：过去、现在和未来](/zh-cn/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。

#### RuntimeClass {#runtimeclass-v125}

<!--
RuntimeClass in the **node.k8s.io/v1beta1** API version is no longer served as of v1.25.

* Migrate manifests and API clients to use the **node.k8s.io/v1** API version, available since v1.20.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
从 v1.25 版本开始不再提供 **node.k8s.io/v1beta1** API 版本中的 RuntimeClass。

* 迁移清单和 API 客户端使用 **node.k8s.io/v1** API 版本，此 API 从 v1.20 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

### v1.22

<!--
The **v1.22** release stopped serving the following deprecated API versions:
-->
**v1.22** 发行版本停止提供以下已废弃 API 版本：

<!--
#### Webhook resources {#webhook-resources-v122}
-->
#### Webhook 资源   {#webhook-resources-v122}

<!--
The **admissionregistration.k8s.io/v1beta1** API version of MutatingWebhookConfiguration
and ValidatingWebhookConfiguration is no longer served as of v1.22.
-->
**admissionregistration.k8s.io/v1beta1** API 版本的 MutatingWebhookConfiguration
和 ValidatingWebhookConfiguration 不在 v1.22 版本中继续提供。

<!--
* Migrate manifests and API clients to use the **admissionregistration.k8s.io/v1** API version, available since v1.16.
* All existing persisted objects are accessible via the new APIs
-->
* 迁移清单和 API 客户端使用 **admissionregistration.k8s.io/v1** API 版本，
  此 API 从 v1.16 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；

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
* 值得注意的变更：
  * `webhooks[*].failurePolicy` 在 v1 版本中默认值从 `Ignore` 改为 `Fail`
  * `webhooks[*].matchPolicy` 在 v1 版本中默认值从 `Exact` 改为 `Equivalent`
  * `webhooks[*].timeoutSeconds` 在 v1 版本中默认值从 `30s` 改为 `10s`
  * `webhooks[*].sideEffects` 的默认值被删除，并且该字段变为必须指定；
    在 v1 版本中可选的值只能是 `None` 和 `NoneOnDryRun` 之一
  * `webhooks[*].admissionReviewVersions` 的默认值被删除，在 v1
    版本中此字段变为必须指定（AdmissionReview 的被支持版本包括 `v1` 和 `v1beta1`）
  * `webhooks[*].name` 必须在通过 `admissionregistration.k8s.io/v1`
    创建的对象列表中唯一

#### CustomResourceDefinition {#customresourcedefinition-v122}

<!--
The **apiextensions.k8s.io/v1beta1** API version of CustomResourceDefinition is no longer served as of v1.22.

* Migrate manifests and API clients to use the **apiextensions.k8s.io/v1** API version, available since v1.16.
* All existing persisted objects are accessible via the new API
-->
**apiextensions.k8s.io/v1beta1** API 版本的 CustomResourceDefinition
不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **apiextensions.k8s.io/v1** API 版本，此 API 从 v1.16 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
<!--
* Notable changes:
  * `spec.scope` is no longer defaulted to `Namespaced` and must be explicitly specified
  * `spec.version` is removed in v1; use `spec.versions` instead
  * `spec.validation` is removed in v1; use `spec.versions[*].schema` instead
  * `spec.subresources` is removed in v1; use `spec.versions[*].subresources` instead
  * `spec.additionalPrinterColumns` is removed in v1; use `spec.versions[*].additionalPrinterColumns` instead
  * `spec.conversion.webhookClientConfig` is moved to `spec.conversion.webhook.clientConfig` in v1
-->
* 值得注意的变更：
  * `spec.scope` 的默认值不再是 `Namespaced`，该字段必须显式指定
  * `spec.version` 在 v1 版本中被删除；应改用 `spec.versions`
  * `spec.validation` 在 v1 版本中被删除；应改用 `spec.versions[*].schema`
  * `spec.subresources` 在 v1 版本中被删除；应改用 `spec.versions[*].subresources`
  * `spec.additionalPrinterColumns` 在 v1 版本中被删除；应改用
    `spec.versions[*].additionalPrinterColumns`
  * `spec.conversion.webhookClientConfig` 在 v1 版本中被移动到
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

  * `spec.conversion.conversionReviewVersions` 在 v1 版本中被移动到
    `spec.conversion.webhook.conversionReviewVersions`
  * `spec.versions[*].schema.openAPIV3Schema` 在创建 v1 版本的
    CustomResourceDefinition 对象时变成必需字段，并且其取值必须是一个
    [结构化的 Schema](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)
  * `spec.preserveUnknownFields: true` 在创建 v1 版本的 CustomResourceDefinition
    对象时不允许指定；该配置必须在 Schema 定义中使用
    `x-kubernetes-preserve-unknown-fields: true` 来设置
  * 在 v1 版本中，`additionalPrinterColumns` 的条目中的 `JSONPath` 字段被更名为
    `jsonPath`（补丁 [#66531](https://github.com/kubernetes/kubernetes/issues/66531)）

#### APIService {#apiservice-v122}

<!--
The **apiregistration.k8s.io/v1beta1** API version of APIService is no longer served as of v1.22.

* Migrate manifests and API clients to use the **apiregistration.k8s.io/v1** API version, available since v1.10.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**apiregistration/v1beta1** API 版本的 APIService 不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **apiregistration.k8s.io/v1** API 版本，此 API 从
  v1.10 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

#### TokenReview {#tokenreview-v122}

<!--
The **authentication.k8s.io/v1beta1** API version of TokenReview is no longer served as of v1.22.

* Migrate manifests and API clients to use the **authentication.k8s.io/v1** API version, available since v1.6.
* No notable changes
-->
**authentication.k8s.io/v1beta1** API 版本的 TokenReview 不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **authentication.k8s.io/v1** API 版本，此 API 从
  v1.6 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

#### SubjectAccessReview resources {#subjectaccessreview-resources-v122}

<!--
The **authorization.k8s.io/v1beta1** API version of LocalSubjectAccessReview,
SelfSubjectAccessReview, SubjectAccessReview, and SelfSubjectRulesReview is no longer served as of v1.22.

* Migrate manifests and API clients to use the **authorization.k8s.io/v1** API version, available since v1.6.
* Notable changes:
  * `spec.group` was renamed to `spec.groups` in v1 (fixes [#32709](https://github.com/kubernetes/kubernetes/issues/32709))
-->
**authorization.k8s.io/v1beta1** API 版本的 LocalSubjectAccessReview、
SelfSubjectAccessReview、SubjectAccessReview、SelfSubjectRulesReview 不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **authorization.k8s.io/v1** API 版本，此 API 从
  v1.6 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 需要额外注意的变更：
  * `spec.group` 在 v1 版本中被更名为 `spec.groups`
    （补丁 [#32709](https://github.com/kubernetes/kubernetes/issues/32709)）

#### CertificateSigningRequest {#certificatesigningrequest-v122}

<!--
The **certificates.k8s.io/v1beta1** API version of CertificateSigningRequest is no longer served as of v1.22.

* Migrate manifests and API clients to use the **certificates.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
-->
**certificates.k8s.io/v1beta1** API 版本的 CertificateSigningRequest 不在
v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **certificates.k8s.io/v1** API 版本，此 API 从
  v1.19 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；

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
* `certificates.k8s.io/v1` 中需要额外注意的变更：
  * 对于请求证书的 API 客户端而言：
    * `spec.signerName` 现在变成必需字段（参阅
      [已知的 Kubernetes 签署者](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)），
      并且通过 `certificates.k8s.io/v1` API 不可以创建签署者为
      `kubernetes.io/legacy-unknown` 的请求
    * `spec.usages` 现在变成必需字段，其中不可以包含重复的字符串值，
      并且只能包含已知的用法字符串
  * 对于要批准或者签署证书的 API 客户端而言：
    * `status.conditions` 中不可以包含重复的类型
    * `status.conditions[*].status` 字段现在变为必需字段
    * `status.certificate` 必须是 PEM 编码的，而且其中只能包含 `CERTIFICATE`
      数据块

#### Lease {#lease-v122}

<!--
The **coordination.k8s.io/v1beta1** API version of Lease is no longer served as of v1.22.

* Migrate manifests and API clients to use the **coordination.k8s.io/v1** API version, available since v1.14.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**coordination.k8s.io/v1beta1** API 版本的 Lease 不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **coordination.k8s.io/v1** API 版本，此 API 从
  v1.14 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

#### Ingress {#ingress-v122}

<!--
The **extensions/v1beta1** and **networking.k8s.io/v1beta1** API versions of Ingress is no longer served as of v1.22.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1** 和 **networking.k8s.io/v1beta1** API 版本的 Ingress
不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **networking.k8s.io/v1** API 版本，此 API 从
  v1.19 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
<!--
* Notable changes:
  * `spec.backend` is renamed to `spec.defaultBackend`
  * The backend `serviceName` field is renamed to `service.name`
  * Numeric backend `servicePort` fields are renamed to `service.port.number`
  * String backend `servicePort` fields are renamed to `service.port.name`
  * `pathType` is now required for each specified path. Options are `Prefix`,
    `Exact`, and `ImplementationSpecific`. To match the undefined `v1beta1` behavior, use `ImplementationSpecific`.
-->
* 值得注意的变更：
  * `spec.backend` 字段被更名为 `spec.defaultBackend`
  * 后端的 `serviceName` 字段被更名为 `service.name`
  * 数值表示的后端 `servicePort` 字段被更名为 `service.port.number`
  * 字符串表示的后端 `servicePort` 字段被更名为 `service.port.name`
  * 对所有要指定的路径，`pathType` 都成为必需字段。
    可选项为 `Prefix`、`Exact` 和 `ImplementationSpecific`。
    要匹配 `v1beta1` 版本中未定义路径类型时的行为，可使用 `ImplementationSpecific`

#### IngressClass {#ingressclass-v122}

<!--
The **networking.k8s.io/v1beta1** API version of IngressClass is no longer served as of v1.22.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.19.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**networking.k8s.io/v1beta1** API 版本的 IngressClass 不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **networking.k8s.io/v1** API 版本，此 API 从
  v1.19 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

<!--
#### RBAC resources {#rbac-resources-v122}

The **rbac.authorization.k8s.io/v1beta1** API version of ClusterRole, ClusterRoleBinding,
Role, and RoleBinding is no longer served as of v1.22.

* Migrate manifests and API clients to use the **rbac.authorization.k8s.io/v1** API version, available since v1.8.
* All existing persisted objects are accessible via the new APIs
* No notable changes
-->
#### RBAC 资源   {#rbac-resources-v122}

**rbac.authorization.k8s.io/v1beta1** API 版本的 ClusterRole、ClusterRoleBinding、
Role 和 RoleBinding 不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **rbac.authorization.k8s.io/v1** API 版本，此 API 从
  v1.8 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

#### PriorityClass {#priorityclass-v122}

<!--
The **scheduling.k8s.io/v1beta1** API version of PriorityClass is no longer served as of v1.22.

* Migrate manifests and API clients to use the **scheduling.k8s.io/v1** API version, available since v1.14.
* All existing persisted objects are accessible via the new API
* No notable changes
-->
**scheduling.k8s.io/v1beta1** API 版本的 PriorityClass 不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **scheduling.k8s.io/v1** API 版本，此 API 从
  v1.14 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

<!--
#### Storage resources {#storage-resources-v122}
-->
#### 存储资源  {#storage-resources-v122}

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
和 VolumeAttachment 不在 v1.22 版本中继续提供。

* 迁移清单和 API 客户端使用 **storage.k8s.io/v1** API 版本
  * CSIDriver 从 v1.19 版本开始在 **storage.k8s.io/v1** 中提供；
  * CSINode 从 v1.17 版本开始在 **storage.k8s.io/v1** 中提供；
  * StorageClass 从 v1.6 版本开始在 **storage.k8s.io/v1** 中提供；
  * VolumeAttachment 从 v1.13 版本开始在 **storage.k8s.io/v1** 中提供；
* 所有的已保存的对象都可以通过新的 API 来访问；
* 没有需要额外注意的变更。

### v1.16

<!--
The **v1.16** release stopped serving the following deprecated API versions:
-->
**v1.16** 发行版本停止提供以下已废弃 API 版本：

#### NetworkPolicy {#networkpolicy-v116}

<!--
The **extensions/v1beta1** API version of NetworkPolicy is no longer served as of v1.16.

* Migrate manifests and API clients to use the **networking.k8s.io/v1** API version, available since v1.8.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1** API 版本的 NetworkPolicy 不在 v1.16 版本中继续提供。

* 迁移清单和 API 客户端使用 **networking.k8s.io/v1** API 版本，此 API 从
  v1.8 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问。

#### DaemonSet {#daemonset-v116}

<!--
The **extensions/v1beta1** and **apps/v1beta2** API versions of DaemonSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1** 和 **apps/v1beta2** API 版本的 DaemonSet 在
v1.16 版本中不再继续提供。

* 迁移清单和 API 客户端使用 **apps/v1** API 版本，此 API 从 v1.9 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
<!--
* Notable changes:
  * `spec.templateGeneration` is removed
  * `spec.selector` is now required and immutable after creation; use the existing
    template labels as the selector for seamless upgrades
  * `spec.updateStrategy.type` now defaults to `RollingUpdate`
    (the default in `extensions/v1beta1` was `OnDelete`)
-->
* 值得注意的变更：
  * `spec.templateGeneration` 字段被删除
  * `spec.selector` 现在变成必需字段，并且在对象创建之后不可变更；
    可以将现有模板的标签作为选择算符以实现无缝迁移。
  * `spec.updateStrategy.type` 的默认值变为 `RollingUpdate`
    （`extensions/v1beta1` API 版本中的默认值是 `OnDelete`）。

#### Deployment {#deployment-v116}

<!--
The **extensions/v1beta1**, **apps/v1beta1**, and **apps/v1beta2** API versions of Deployment are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1**、**apps/v1beta1** 和 **apps/v1beta2** API 版本的
Deployment 在 v1.16 版本中不再继续提供。

* 迁移清单和 API 客户端使用 **apps/v1** API 版本，此 API 从 v1.9 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
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
* 值得注意的变更：
  * `spec.rollbackTo` 字段被删除
  * `spec.selector` 字段现在变为必需字段，并且在 Deployment 创建之后不可变更；
    可以使用现有的模板的标签作为选择算符以实现无缝迁移。
  * `spec.progressDeadlineSeconds` 的默认值变为 `600` 秒
    （`extensions/v1beta1` 中的默认值是没有期限）
  * `spec.revisionHistoryLimit` 的默认值变为 `10`
    （`apps/v1beta1` API 版本中此字段默认值为 `2`，在`extensions/v1beta1` API
    版本中的默认行为是保留所有历史记录）。
  * `maxSurge` 和 `maxUnavailable` 的默认值变为 `25%`
    （在 `extensions/v1beta1` API 版本中，这些字段的默认值是 `1`）。

#### StatefulSet {#statefulset-v116}

<!--
The **apps/v1beta1** and **apps/v1beta2** API versions of StatefulSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**apps/v1beta1** 和 **apps/v1beta2** API 版本的 StatefulSet 在 v1.16 版本中不再继续提供。

* 迁移清单和 API 客户端使用 **apps/v1** API 版本，此 API 从 v1.9 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
<!--
* Notable changes:
  * `spec.selector` is now required and immutable after creation;
    use the existing template labels as the selector for seamless upgrades
  * `spec.updateStrategy.type` now defaults to `RollingUpdate`
    (the default in `apps/v1beta1` was `OnDelete`)
-->
* 值得注意的变更：
  * `spec.selector` 字段现在变为必需字段，并且在 StatefulSet 创建之后不可变更；
    可以使用现有的模板的标签作为选择算符以实现无缝迁移。
  * `spec.updateStrategy.type` 的默认值变为 `RollingUpdate`
    （`apps/v1beta1` API 版本中的默认值是 `OnDelete`）。

#### ReplicaSet {#replicaset-v116}

<!--
The **extensions/v1beta1**, **apps/v1beta1**, and **apps/v1beta2** API versions of ReplicaSet are no longer served as of v1.16.

* Migrate manifests and API clients to use the **apps/v1** API version, available since v1.9.
* All existing persisted objects are accessible via the new API
-->
**extensions/v1beta1**、**apps/v1beta1** 和 **apps/v1beta2** API 版本的
ReplicaSet 在 v1.16 版本中不再继续提供。

* 迁移清单和 API 客户端使用 **apps/v1** API 版本，此 API 从 v1.9 版本开始可用；
* 所有的已保存的对象都可以通过新的 API 来访问；
<!--
* Notable changes:
  * `spec.selector` is now required and immutable after creation; use the existing template labels as the selector for seamless upgrades
-->
* 值得注意的变更：
  * `spec.selector` 现在变成必需字段，并且在对象创建之后不可变更；
    可以将现有模板的标签作为选择算符以实现无缝迁移。

#### PodSecurityPolicy {#psp-v116}

<!--
The **extensions/v1beta1** API version of PodSecurityPolicy is no longer served as of v1.16.

* Migrate manifests and API client to use the **policy/v1beta1** API version, available since v1.10.
* Note that the **policy/v1beta1** API version of PodSecurityPolicy will be removed in v1.25.
-->
**extensions/v1beta1** API 版本的 PodSecurityPolicy 在 v1.16 版本中不再继续提供。

* 迁移清单和 API 客户端使用 **policy/v1beta1** API 版本，此 API 从 v1.10 版本开始可用；
* 注意 **policy/v1beta1** API 版本的 PodSecurityPolicy 会在 v1.25 版本中移除。

<!--
## What to do

### Test with deprecated APIs disabled
-->
## 需要做什么   {#what-to-do}

### 在禁用已启用 API 的情况下执行测试

<!--
You can test your clusters by starting an API server with specific API versions disabled
to simulate upcoming removals. Add the following flag to the API server startup arguments:
-->
你可以通过在启动 API 服务器时禁用特定的 API 版本来模拟即将发生的
API 移除，从而完成测试。在 API 服务器启动参数中添加如下标志：

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
### 定位何处使用了已弃用的 API

使用 [1.19 及更高版本中可用的客户端警告、指标和审计信息](/zh-cn/blog/2020/09/03/warnings/#deprecation-warnings)
来定位在何处使用了已弃用的 API。

<!--
### Migrate to non-deprecated APIs
-->
### 迁移到未被弃用的 API

<!--
* Update custom integrations and controllers to call the non-deprecated APIs
* Change YAML files to reference the non-deprecated APIs
-->
* 更新自定义的集成组件和控制器，调用未被弃用的 API
* 更改 YAML 文件引用未被弃用的 API

  <!--
  You can use the `kubectl convert` command to automatically convert an existing object:
  -->
  你可以用 `kubectl-convert` 命令自动转换现有对象：

  ```shell
  kubectl convert -f <file> --output-version <group>/<version>
  ```

  <!--
  For example, to convert an older Deployment to `apps/v1`, you can run:
  -->
  例如，要将较老的 Deployment 版本转换为 `apps/v1` 版本，你可以运行：

  ```shell
  kubectl convert -f ./my-deployment.yaml --output-version apps/v1
  ```

  <!--
  This conversion may use non-ideal default values. To learn more about a specific
  resource, check the Kubernetes [API reference](/docs/reference/kubernetes-api/).
  -->
  这个转换可能使用了非理想的默认值。要了解更多关于特定资源的信息，
  请查阅 Kubernetes [API 参考文档](/zh-cn/docs/reference/kubernetes-api/)。

  {{< note >}}
  <!--
  The `kubectl convert` tool is not installed by default, although
  in fact it once was part of `kubectl` itself. For more details, you can read the
  [deprecation and removal issue](https://github.com/kubernetes/kubectl/issues/725)
  for the built-in subcommand.
  -->
  尽管实际上 `kubectl convert` 工具曾经是 `kubectl` 自身的一部分，但此工具不是默认安装的。
  如果想了解更多详情，可以阅读内置子命令的[弃用和移除问题](https://github.com/kubernetes/kubectl/issues/725)。
  
  <!--
  To learn how to set up `kubectl convert` on your computer, visit the page that is right for your 
  operating system:
  [Linux](/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin),
  [macOS](/docs/tasks/tools/install-kubectl-macos/#install-kubectl-convert-plugin), or
  [Windows](/docs/tasks/tools/install-kubectl-windows/#install-kubectl-convert-plugin).
  -->
  要了解如何在你的计算机上设置 `kubectl convert`，查阅适合你操作系统的页面：
  [Linux](/zh-cn/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin)、
  [macOS](/zh-cn/docs/tasks/tools/install-kubectl-macos/#install-kubectl-convert-plugin) 或
  [Windows](/zh-cn/docs/tasks/tools/install-kubectl-windows/#install-kubectl-convert-plugin)。
  {{< /note >}}
