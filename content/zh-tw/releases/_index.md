---
linktitle: 發行版本歷史
title: 發行版本
type: docs
layout: release-info
notoc: true
---
<!-- 
linktitle: Release History
title: Releases
type: docs
layout: release-info
notoc: true
-->

<!-- overview -->

<!-- 
The Kubernetes project maintains release branches for the most recent three minor releases
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 and newer receive
[approximately 1 year of patch support](/releases/patch-releases/#support-period).
Kubernetes 1.18 and older received approximately 9 months of patch support.
-->
Kubernetes 項目維護最近三個次要版本（{{< skew latestVersion >}}、{{< skew prevMinorVersion >}}、
{{< skew oldestMinorVersion >}}）的發佈分支。
Kubernetes 1.19 和更新版本獲得[大約 1 年的補丁支持](/zh-cn/releases/patch-releases/#support-period)。
Kubernetes 1.18 及更早版本獲得了大約 9 個月的補丁支持週期。

<!-- 
Kubernetes versions are expressed as **x.y.z**,
where **x** is the major version, **y** is the minor version, and **z** is the patch version,
following [Semantic Versioning](https://semver.org/) terminology.

More information in the [version skew policy](/releases/version-skew-policy/) document.
-->
Kubernetes 版本表示爲 **x.y.z**，
其中 **x** 是主要版本，**y** 是次要版本，**z** 是補丁版本，遵循[語義版本控制](https://semver.org/)術語。

更多資訊在[版本偏差策略](/zh-cn/releases/version-skew-policy/)文檔中。

<!-- body -->

<!--
## Release History
-->
## 發行版本歷史   {#release-history}

{{< release-data >}}

<!--
## Upcoming Release
-->
## 未來的發行版本   {#upcoming-release}

<!-- 
Check out the [schedule](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
for the upcoming **{{< skew nextMinorVersion >}}** Kubernetes release!
-->
查看即將發佈的 Kubernetes **{{< skew nextMinorVersion >}}**
[時間表](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})！

{{< note >}}
<!--
This schedule link may be temporarily unavailable during early release planning phases.  
Check the [SIG Release repository](https://github.com/kubernetes/sig-release/tree/master/releases) for the latest updates.
-->
此時間表鏈接可能在早期發佈計劃期間暫時不可用。
檢查 [SIG Release 倉庫](https://github.com/kubernetes/sig-release/tree/master/releases)以獲取最新版本。
{{< /note >}}

<!--
## Helpful Resources
-->
## 有用的資源   {#helpful-resources}

<!--
Refer to the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team) resources 
for key information on roles and the release process.
-->
有關角色和發佈流程的重要資訊，
請參閱 [Kubernetes 發佈團隊](https://github.com/kubernetes/sig-release/tree/master/release-team) 資源。
