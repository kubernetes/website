---
title: 特性門控
weight: 10
content_type: concept
card:
  name: reference
  weight: 60
---
<!--
title: Feature Gates
weight: 10
content_type: concept
card:
  name: reference
  weight: 60
-->

<!-- overview -->
<!--
This page contains an overview of the various feature gates an administrator
can specify on different Kubernetes components.

See [feature stages](#feature-stages) for an explanation of the stages for a feature.
-->
本頁詳述了管理員可以在不同的 Kubernetes 組件上指定的各種特性門控。

關於特性各個階段的說明，請參見[特性階段](#feature-stages)。

<!-- body -->

<!--
## Overview

Feature gates are a set of key=value pairs that describe Kubernetes features.
You can turn these features on or off using the `--feature-gates` command line flag
on each Kubernetes component.
-->
## 概述 {#overview}

特性門控是描述 Kubernetes 特性的一組鍵值對。你可以在 Kubernetes 的各個組件中使用
`--feature-gates` 標誌來啓用或禁用這些特性。

<!--
Each Kubernetes component lets you enable or disable a set of feature gates that
are relevant to that component.
Use `-h` flag to see a full set of feature gates for all components.
To set feature gates for a component, such as kubelet, use the `--feature-gates`
flag assigned to a list of feature pairs:
-->
每個 Kubernetes 組件都支持啓用或禁用與該組件相關的一組特性門控。
使用 `-h` 參數來查看所有組件支持的完整特性門控。
要爲諸如 kubelet 之類的組件設置特性門控，請使用 `--feature-gates` 參數，
並向其傳遞一個特性設置鍵值對列表：

```shell
--feature-gates=...,GracefulNodeShutdown=true
```

<!--
The following tables are a summary of the feature gates that you can set on
different Kubernetes components.
-->
下表總結了在不同的 Kubernetes 組件上可以設置的特性門控。

<!--
- The "Since" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "Until" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate.
- If a feature is in the Alpha or Beta state, you can find the feature listed
  in the [Alpha/Beta feature gate table](#feature-gates-for-alpha-or-beta-features).
- If a feature is stable you can find all stages for that feature listed in the
  [Graduated/Deprecated feature gate table](#feature-gates-for-graduated-or-deprecated-features).
- The [Graduated/Deprecated feature gate table](#feature-gates-for-graduated-or-deprecated-features)
  also lists deprecated and withdrawn features.
-->
- 引入特性或更改其發佈階段後，"開始（Since）" 列將包含 Kubernetes 版本。
- "結束（Until）" 列（如果不爲空）包含最後一個 Kubernetes 版本，你仍可以在其中使用特性門控。
- 如果某個特性處於 Alpha 或 Beta 狀態，你可以在
  [Alpha 和 Beta 特性門控表](#feature-gates-for-alpha-or-beta-features)中找到該特性。
- 如果某個特性處於穩定狀態，
  你可以在[已畢業和廢棄特性門控表](#feature-gates-for-graduated-or-deprecated-features)中找到該特性的所有階段。
- [已畢業和廢棄特性門控表](#feature-gates-for-graduated-or-deprecated-features)還列出了廢棄的和已被移除的特性。

{{< note >}}
<!--
For a reference to old feature gates that are removed, please refer to
[feature gates removed](/docs/reference/command-line-tools-reference/feature-gates-removed/).
-->
有關已移除的原有特性門控的參考資訊，
請參閱[已移除的特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates-removed/)。
{{< /note >}}

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
<!--
### Feature gates for Alpha or Beta features
-->
### Alpha 和 Beta 狀態的特性門控  {#feature-gates-for-alpha-or-beta-features}

<!--
{{< feature-gate-table include="alpha,beta" caption="Feature gates for features in Alpha or Beta states" >}}
-->
{{< feature-gate-table include="alpha,beta" caption="處於 Alpha 或 Beta 狀態的特性門控" >}}

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
<!--
### Feature gates for graduated or deprecated features
-->
### 已畢業和已廢棄的特性門控  {#feature-gates-for-graduated-or-deprecated-features}

<!--
{{< feature-gate-table include="ga,deprecated" caption="Feature Gates for Graduated or Deprecated Features" >}}
-->
{{< feature-gate-table include="ga,deprecated" caption="已畢業或已廢棄的特性門控" >}}

<!--
## Using a feature

### Feature stages
-->
## 使用特性   {#using-a-feature}

### 特性階段    {#feature-stages}

<!--
A feature can be in *Alpha*, *Beta* or *GA* stage.
An *Alpha* feature means:
-->
處於 **Alpha**、**Beta**、**GA** 階段的特性。

**Alpha** 特性代表：

<!--
* Disabled by default.
* Might be buggy. Enabling the feature may expose bugs.
* Support for feature may be dropped at any time without notice.
* The API may change in incompatible ways in a later software release without notice.
* Recommended for use only in short-lived testing clusters, due to increased
  risk of bugs and lack of long-term support.
-->
* 預設禁用。
* 可能有錯誤，啓用此特性可能會導致錯誤。
* 隨時可能刪除對此特性的支持，恕不另行通知。
* 在以後的軟體版本中，API 可能會以不兼容的方式更改，恕不另行通知。
* 建議將其僅用於短期測試中，因爲開啓特性會增加錯誤的風險，並且缺乏長期支持。

<!--
A *Beta* feature means:
-->
**Beta** 特性代表：

<!--
* Usually enabled by default. Beta API groups are
  [disabled by default](https://github.com/kubernetes/enhancements/tree/master/keps/sig-architecture/3136-beta-apis-off-by-default).
* The feature is well tested. Enabling the feature is considered safe.
* Support for the overall feature will not be dropped, though details may change.
* The schema and/or semantics of objects may change in incompatible ways in a
  subsequent beta or stable release. When this happens, we will provide instructions
  for migrating to the next version. This may require deleting, editing, and
  re-creating API objects. The editing process may require some thought.
  This may require downtime for applications that rely on the feature.
* Recommended for only non-business-critical uses because of potential for
  incompatible changes in subsequent releases. If you have multiple clusters
  that can be upgraded independently, you may be able to relax this restriction.
-->
* 通常預設啓用。Beta API 組[預設是被禁用的](https://github.com/kubernetes/enhancements/tree/master/keps/sig-architecture/3136-beta-apis-off-by-default)。
* 該特性已經經過良好測試。啓用該特性是安全的。
* 儘管詳細資訊可能會更改，但不會放棄對整體特性的支持。
* 對象的架構或語義可能會在隨後的 Beta 或穩定版本中以不兼容的方式更改。
  當發生這種情況時，我們將提供遷移到下一版本的說明。此特性可能需要刪除、編輯和重新創建 API 對象。
  編輯過程可能需要慎重操作，因爲這可能會導致依賴該特性的應用程式停機。
* 推薦僅用於非關鍵業務用途，因爲在後續版本中可能會發生不兼容的更改。如果你具有多個可以獨立升級的，則可以放寬此限制。

{{< note >}}
<!--
Please do try *Beta* features and give feedback on them!
After they exit beta, it may not be practical for us to make more changes.
-->
請試用 **Beta** 特性並提供相關反饋！
一旦特性結束 Beta 狀態，我們就不太可能再對特性進行大幅修改。
{{< /note >}}

<!--
A *General Availability* (GA) feature is also referred to as a *stable* feature. It means:
-->
**General Availability**（GA）特性也稱爲**穩定**特性，**GA** 特性代表着：

<!--
* The feature is always enabled; you cannot disable it.
* The corresponding feature gate is no longer needed.
* Stable versions of features will appear in released software for many subsequent versions.
-->
* 此特性會一直啓用；你不能禁用它。
* 不再需要相應的特性門控。
* 對於許多後續版本，特性的穩定版本將出現在發行的軟體中。

<!--
## List of feature gates {#feature-gates}

Each feature gate is designed for enabling/disabling a specific feature:
-->
### 特性門控列表 {#feature-gates}

每個特性門控均用於啓用或禁用某個特定的特性：

<!-- Want to edit this list? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-list include="alpha,beta,ga,deprecated" >}}

## {{% heading "whatsnext" %}}

<!--
* The [deprecation policy](/docs/reference/using-api/deprecation-policy/) for Kubernetes explains
  the project's approach to removing features and components.
* Since Kubernetes 1.24, new beta APIs are not enabled by default.  When enabling a beta
  feature, you will also need to enable any associated API resources.
  For example, to enable a particular resource like
  `storage.k8s.io/v1beta1/csistoragecapacities`, set `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`.
  See [API Versioning](/docs/reference/using-api/#api-versioning) for more details on the command line flags.
-->
* Kubernetes 的[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)介紹了項目針對已移除特性和組件的處理方法。
* 從 Kubernetes 1.24 開始，預設不啓用新的 Beta API。
  啓用 Beta 功能時，還需要啓用所有關聯的 API 資源。
  例如：要啓用一個特定資源，如 `storage.k8s.io/v1beta1/csistoragecapacities`，
  請設置 `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`。
  有關命令列標誌的更多詳細資訊，請參閱 [API 版本控制](/zh-cn/docs/reference/using-api/#api-versioning)。
