---
title: 特性門控（已移除）
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
本頁包含了已移除的特性門控的列表。本頁的信息僅供參考。
已移除的特性門控不同於正式發佈（GA）或廢棄的特性門控，因爲已移除的特性門控將不再被視爲有效的特性門控。
然而，正式發佈或廢棄的特性門控仍然能被對應的 Kubernetes 組件識別，這些特性門控在叢集中不會造成任何行爲差異。

<!--
For feature gates that are still recognized by the Kubernetes components, please refer to
the [Alpha/Beta feature gate table](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)
or the [Graduated/Deprecated feature gate table](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)
-->
有關 Kubernetes 組件仍可識別的特性門控，請參閱
[Alpha 和 Beta 狀態的特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)或
[已畢業和已廢棄的特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)。

<!--
### Feature gates that are removed

In the following table:

- The "From" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "To" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate. If the feature stage is either "Deprecated"
  or "GA", the "To" column is the Kubernetes release when the feature is removed.
-->
### 已移除的特性門控   {#feature-gates-that-are-removed}

在下表中，

- “開始（From）” 列包含了引入某個特性或其發佈狀態發生變更時的 Kubernetes 版本。
- “結束（To）” 列（如果不爲空）包含你仍然可以使用某個特性門控的最後一個 Kubernetes 版本。
  如果對應特性處於 “廢棄” 或 “GA” 狀態，則 “結束（To）” 列是該特性被移除時的 Kubernetes 版本。

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
<!--
{{< feature-gate-table show-removed="true" caption="Feature Gates Removed" sortable="true" >}}
-->
{{< feature-gate-table show-removed="true" caption="已移除的特性門控" sortable="true" >}}

<!--
## Descriptions for removed feature gates
-->
## 已移除的特性門控的說明   {#description-for-removed-feature-gates}

<!-- Want to edit this list? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-list show-removed="true" >}}
