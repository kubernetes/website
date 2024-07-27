---
title: 特性门控（已移除）
weight: 15
content_type: concept
---
<!--
title: Feature Gates (removed)
weight: 15
content_type: concept
-->

<!-- overview -->

<!--
This page contains list of feature gates that have been removed. The information on this page is for reference.
A removed feature gate is different from a GA'ed or deprecated one in that a removed one is
no longer recognized as a valid feature gate.
However, a GA'ed or a deprecated feature gate is still recognized by the corresponding Kubernetes
components although they are unable to cause any behavior differences in a cluster.
-->
本页包含了已移除的特性门控的列表。本页的信息仅供参考。
已移除的特性门控不同于正式发布（GA）或废弃的特性门控，因为已移除的特性门控将不再被视为有效的特性门控。
然而，正式发布或废弃的特性门控仍然能被对应的 Kubernetes 组件识别，这些特性门控在集群中不会造成任何行为差异。

<!--
For feature gates that are still recognized by the Kubernetes components, please refer to
the [Alpha/Beta feature gate table](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)
or the [Graduated/Deprecated feature gate table](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)
-->
有关 Kubernetes 组件仍可识别的特性门控，请参阅
[Alpha 和 Beta 状态的特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)或
[已毕业和已废弃的特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)。

<!--
### Feature gates that are removed

In the following table:

- The "From" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "To" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate. If the feature stage is either "Deprecated"
  or "GA", the "To" column is the Kubernetes release when the feature is removed.
-->
### 已移除的特性门控   {#feature-gates-that-are-removed}

在下表中，

- “开始（From）” 列包含了引入某个特性或其发布状态发生变更时的 Kubernetes 版本。
- “结束（To）” 列（如果不为空）包含你仍然可以使用某个特性门控的最后一个 Kubernetes 版本。
  如果对应特性处于 “废弃” 或 “GA” 状态，则 “结束（To）” 列是该特性被移除时的 Kubernetes 版本。

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
<!--
{{< feature-gate-table show-removed="true" caption="Feature Gates Removed" sortable="true" >}}
-->
{{< feature-gate-table show-removed="true" caption="已移除的特性门控" sortable="true" >}}

<!--
## Descriptions for removed feature gates
-->
## 已移除的特性门控的说明   {#description-for-removed-feature-gates}

<!-- Want to edit this list? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-list show-removed="true" >}}
