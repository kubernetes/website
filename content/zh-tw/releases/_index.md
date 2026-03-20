---
linktitle: 發行版本紀錄
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
Kubernetes 專案會為最近的三個次要版本（{{< skew latestVersion >}}、{{< skew prevMinorVersion >}}、
{{< skew oldestMinorVersion >}}）維護發行分支。
Kubernetes 1.19 及更新版本提供[大約 1 年的修補版本支援](/zh-tw/releases/patch-releases/#support-period)。
Kubernetes 1.18 及更舊版本則提供大約 9 個月的修補版本支援。

<!-- 
Kubernetes versions are expressed as **x.y.z**,
where **x** is the major version, **y** is the minor version, and **z** is the patch version,
following [Semantic Versioning](https://semver.org/) terminology.

More information in the [version skew policy](/releases/version-skew-policy/) document.
-->
Kubernetes 的版本號格式為 **x.y.z**，
其中 **x** 是主要版本，**y** 是次要版本，**z** 是修補版本，遵循[語意化版本控制（Semantic Versioning）](https://semver.org/)的規範。

更多資訊在[版本偏差政策](/zh-tw/releases/version-skew-policy/)文件中。

<!-- body -->

<!--
## Release History
-->
## 發行版本紀錄   {#release-history}

{{< release-data >}}

<!--
## End-of-Life Releases
-->
## 終止支援的版本  {#end-of-life-releases}

<!--
Older Kubernetes releases that are no longer maintained are listed below.
-->
下方列出已不再維護的較舊 Kubernetes 版本。

<!--
<details>
  <summary>End-of-life releases</summary>
  {{< note >}}
  These releases are no longer supported and do not receive security updates or bug fixes.
  If you are running one of these releases, the Kubernetes project strongly recommends upgrading to a [supported version](#release-history).
  {{< /note >}}
  
  {{< eol-releases >}}
</details>
-->
<details>
  <summary>終止支援的版本</summary>
  {{< note >}}
  這些版本已不再受支援且不會收到安全性更新或錯誤修復。
  如果您正執行這些版本之一，Kubernetes 專案強烈建議您升級至[受支援的版本](#release-history)。
  {{< /note >}}
  
  {{< eol-releases >}}
</details>

<!--
## Upcoming Release
-->
## 即將發行的版本   {#upcoming-release}

<!-- 
Check out the [schedule](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
for the upcoming **{{< skew nextMinorVersion >}}** Kubernetes release!
-->
查看即將發行的 Kubernetes **{{< skew nextMinorVersion >}}**
[時程表](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})！

{{< note >}}
<!--
This schedule link may be temporarily unavailable during early release planning phases.  
Check the [SIG Release repository](https://github.com/kubernetes/sig-release/tree/master/releases) for the latest updates.
-->
此時程表連結在規劃發行的早期階段可能會暫時無法使用。
檢查 [SIG Release 儲存庫](https://github.com/kubernetes/sig-release/tree/master/releases)以取得最新更新。
{{< /note >}}

<!--
## Helpful Resources
-->
## 參考資源   {#helpful-resources}

<!--
Refer to the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team) resources 
for key information on roles and the release process.
-->
請參閱 [Kubernetes 發行團隊](https://github.com/kubernetes/sig-release/tree/master/release-team)的資源，
取得關於角色分工和發行流程的重要資訊。
