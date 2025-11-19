---
title: 補丁版本
type: docs
---
<!--
title: Patch Releases
type: docs
-->

<!--
Schedule and team contact information for Kubernetes patch releases.

For general information about Kubernetes release cycle, see the
[release process description].
-->
Kubernetes 補丁版本的發佈時間表和團隊聯繫信息。

有關 Kubernetes 發佈週期的常規信息，請參閱[發佈流程說明](/zh-cn/releases/release)。

<!--
## Cadence

Our typical patch release cadence is monthly. It is
commonly a bit faster (1 to 2 weeks) for the earliest patch releases
after a 1.X minor release. Critical bug fixes may cause a more
immediate release outside of the normal cadence. We also aim to not make
releases during major holiday periods.
-->
## 節奏 {#cadence}

我們的補丁發佈節奏通常是每月一次。
在 1.X 次要版本之後，最早的補丁版本通常要快一些（提前 1 到 2 周）。
嚴重錯誤修復可能會導致超出正常節奏而更快速的發佈。
我們儘量避免在重要的節假日期間發佈。

<!--
## Contact

See the [Release Managers page][release-managers] for full contact details on the Patch Release Team.

Please give us a business day to respond - we may be in a different timezone!

In between releases the team is looking at incoming cherry pick
requests on a weekly basis. The team will get in touch with
submitters via GitHub PR, SIG channels in Slack, and direct messages
in Slack and [email](mailto:release-managers-private@kubernetes.io)
if there are questions on the PR.
-->
## 聯繫方式  {#contact}

有關補丁發佈團隊（Patch Release Team）的完整聯繫方式，
請參閱[發佈管理員頁面](/zh-cn/releases/release-managers)。

請給我們一個工作日回覆，因爲我們可能在不同的時區！

在兩次發佈之間，團隊每週都會查看收到的 cherry pick 請求。
如果對 PR 有任何問題，團隊將通過 GitHub PR、Slack 中的 SIG 頻道以及 Slack 中的直接消息和
[Email](mailto:release-managers-private@kubernetes.io) 與提交者取得聯繫。

<!--
## Cherry picks

Please follow the [cherry pick process][cherry-picks].

Cherry picks must be merge-ready in GitHub with proper labels (e.g.,
`approved`, `lgtm`, `release-note`) and passing CI tests ahead of the
cherry pick deadline. This is typically two days before the target
release, but may be more. Earlier PR readiness is better, as we
need time to get CI signal after merging your cherry picks ahead
of the actual release.

Cherry pick PRs which miss merge criteria will be carried over and tracked
for the next patch release.
-->
## Cherry Pick

請遵循 [Cherry Pick 流程](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md)。

Cherry Pick 必須在 GitHub 中準備好合併，帶有適當的標籤（例如 `approved`、`lgtm`、`release-note`），
並在 Cherry Pick 截止日期之前通過 CI 測試。這通常是目標發佈前兩天，但可能更早。
PR 越早準備好越好，因爲在實際發佈之前，合併了你的 Cherry Pick 後，我們需要時間來獲取 CI 信號。

不符合合併標準的 Cherry Pick PR 將被帶入下一個補丁版本中跟蹤。

<!--
## Support Period

In accordance with the [yearly support KEP][yearly-support], the Kubernetes
Community will support active patch release series for a period of roughly
fourteen (14) months.

The first twelve months of this timeframe will be considered the standard
period.

Towards the end of the twelve month, the following will happen:

- [Release Managers][release-managers] will cut a release
- The patch release series will enter maintenance mode
-->
## 支持週期  {#support-period}

根據[年度支持 KEP](https://git.k8s.io/enhancements/keps/sig-release/1498-kubernetes-yearly-support-period/README.md)
約定，Kubernetes 社區將在大約 14 個月的時間內支持活躍的補丁發佈系列。

此時間範圍的前 12 個月將被視爲標準週期。

在 12 個月後，將發生以下事情：

- [發佈管理員](/zh-cn/releases/release-managers)將刪除一個版本
- 補丁發佈系列將進入維護模式

<!--
During the two-month maintenance mode period, Release Managers may cut
additional maintenance releases to resolve:

- CVEs (under the advisement of the Security Response Committee)
- [Vulnerabilities](/docs/reference/issues-security/official-cve-feed/) that have an assigned
  CVE ID (under the advisement of the Security Response Committee)
- dependency issues (including base image updates)
- critical core component issues

At the end of the two-month maintenance mode period, the patch release series
will be considered EOL (end of life) and cherry picks to the associated branch
are to be closed soon afterwards.

Note that the 28th of the month was chosen for maintenance mode and EOL target
dates for simplicity (every month has it).
-->
在兩個月的維護模式期間，發佈管理員可能會刪減額外的維護版本以解決：

- CVE（在安全響應委員會的建議下）
- 已分配 CVE ID 的[漏洞](/zh-cn/docs/reference/issues-security/official-cve-feed/)（在安全響應委員會的建議下）
- 依賴問題（包括基礎映像檔更新）
- 關鍵核心組件問題

在兩個月的維護模式期結束時，補丁發佈系列將被視爲 EOL（生命週期結束），相關分支的 Cherry Pick 將很快關閉。

請注意，爲簡單起見，選擇每月 28 日作爲維護模式和 EOL 目標日期（每個月都有）。

<!--
## Upcoming Monthly Releases

Timelines may vary with the severity of bug fixes, but for easier planning we
will target the following monthly release points. Unplanned, critical
releases may also occur in between these.
-->
## 未來發布的月度版本  {#upcoming-monthly-releases}

時間表可能會因錯誤修復的嚴重程度而有所不同，但爲了便於規劃，我們每月將按照以下時間點進行發佈。
中間可能會發布一些計劃外的關鍵版本。

{{< upcoming-releases >}}

<!--
## Detailed Release History for Active Branches
-->
## 活動分支的詳細發佈歷史  {#detailed-release-history-for-active-branches}

{{< release-branches >}}

<!--
## Non-Active Branch history

These releases are no longer supported.
-->
## 非活動分支歷史  {#non-active-branch-history}

不再支持這些版本。

{{< eol-releases >}}
