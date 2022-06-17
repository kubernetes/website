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
Kubernetes 補丁版本的釋出時間表和團隊聯絡資訊。

有關 Kubernetes 釋出週期的常規資訊，請參閱[釋出流程說明]。

<!-- 
## Cadence

Our typical patch release cadence is monthly. It is
commonly a bit faster (1 to 2 weeks) for the earliest patch releases
after a 1.X minor release. Critical bug fixes may cause a more
immediate release outside of the normal cadence. We also aim to not make
releases during major holiday periods.
-->
## 節奏 {#cadence}

我們的補丁釋出節奏通常是每月一次。
在 1.X 次要版本之後，最早的補丁版本通常要快一些（提前 1 到 2 周）。
嚴重錯誤修復可能會導致超出正常節奏而更快速的釋出。
我們儘量避免在主假期期間釋出。

<!-- 
## Contact

See the [Release Managers page][release-managers] for full contact details on the Patch Release Team.

Please give us a business day to respond - we may be in a different timezone!

In between releases the team is looking at incoming cherry pick requests on a weekly basis. The team will get in touch with submitters via GitHub PR, SIG channels in Slack, and direct messages
in Slack and [email](mailto:release-managers-private@kubernetes.io) if there are questions on the PR.
-->
## 聯絡  {#contact}

有關補丁釋出團隊的完整聯絡方式，請參閱[釋出管理員頁面][release-managers]。

請給我們一個工作日回覆，因為我們可能在不同的時區！

在兩次釋出之間，團隊每週都會檢視收到的 cherry pick 請求。
如果對 PR 有任何問題，團隊將透過 GitHub PR、Slack 中的 SIG 頻道以及 Slack 中的直接訊息和
[email](mailto:release-managers-private@kubernetes.io) 與提交者取得聯絡。

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

請遵循 [Cherry Pick 流程][cherry-picks]。

Cherry Pick 必須在 GitHub 中準備好合併，帶有適當的標籤（例如 `approved`、`lgtm`、`release-note`），
並在 Cherry Pick 截止日期之前透過 CI 測試。這通常是目標釋出前兩天，但可能更早。
PR 越早準備好越好，因為在實際釋出之前，合併了你的 Cherry Pick 後，我們需要時間來獲取 CI 訊號。

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
## 支援週期  {#support-period}

根據[年度 KEP][yearly-support]，Kubernetes 社群將在大約 14 個月的時間內支援活躍的補丁釋出系列。

此時間範圍的前 12 個月將被視為標準週期。

在 12 個月後，將發生以下事情：

- [釋出管理員][release-managers]將刪除一個版本
- 補丁釋出系列將進入維護模式

<!--
During the two-month maintenance mode period, Release Managers may cut
additional maintenance releases to resolve:

- CVEs (under the advisement of the Security Response Committee)
- dependency issues (including base image updates)
- critical core component issues

At the end of the two-month maintenance mode period, the patch release series
will be considered EOL (end of life) and cherry picks to the associated branch
are to be closed soon afterwards.

Note that the 28th of the month was chosen for maintenance mode and EOL target
dates for simplicity (every month has it).
-->
在兩個月的維護模式期間，釋出管理員可能會刪減額外的維護版本以解決：

- CVE（在安全響應委員會的建議下）
- 依賴問題（包括基礎映象更新）
- 關鍵核心元件問題

在兩個月的維護模式期結束時，補丁釋出系列將被視為 EOL（生命週期結束），相關分支的 Cherry Pick 將很快關閉。

請注意，為簡單起見，選擇每月 28 日作為維護模式和 EOL 目標日期（每個月都有）。

<!-- 
## Upcoming Monthly Releases

Timelines may vary with the severity of bug fixes, but for easier planning we
will target the following monthly release points. Unplanned, critical
releases may also occur in between these.
-->
## 未來發布的月度版本  {#upcoming-monthly-releases}

時間表可能會因錯誤修復的嚴重程度而有所不同，但為了便於規劃，我們將針對以下每月釋出點。
計劃外的關鍵版本也可能發生在這些版本之間。

<!-- 
| Monthly Patch Release | Cherry Pick Deadline | Target date |
| --------------------- | -------------------- | ----------- |
| May 2022              | 2022-05-20           | 2022-05-24  |
| June 2022             | 2022-06-10           | 2022-06-15  |
| July 2022             | 2022-07-08           | 2022-07-13  |
| August 2022           | 2022-08-12           | 2022-08-16  |
-->
| 月度補丁釋出   | Cherry Pick 截止日期 |   目標日期   |
| ------------ | ------------------ | ----------- |
| 2022 年 5 月  | 2022-05-20         | 2022-05-24  |
| 2022 年 6 月  | 2022-06-10         | 2022-06-15  |
| 2022 年 7 月  | 2022-07-08         | 2022-07-13  |
| 2022 年 8 月  | 2022-08-12         | 2022-08-16  |

<!-- 
## Detailed Release History for Active Branches

### 1.24

Next patch release is **1.24.1**

End of Life for **1.24** is **2023-09-29**

| PATCH RELEASE | CHERRY PICK DEADLINE | TARGET DATE | NOTE |
|---------------|----------------------|-------------|------|
| 1.24.1        | 2022-05-20           | 2022-05-24  |      |
-->
## 活動分支的詳細釋出歷史  {#detailed-release-history-for-active-branches}

### 1.24

下一個補丁版本是 **1.24.1**

**1.24** 的生命週期結束時間為 **2023-09-29**

| 補丁釋出 | Cherry Pick 截止日期 |  目標日期   | 說明 |
|--------|---------------------|------------|-----|
| 1.24.1 | 2022-05-20          | 2022-05-24 |     |

### 1.23

<!-- 
**1.23** enters maintenance mode on **2022-12-28**.

End of Life for **1.23** is **2023-02-28**.
-->
**1.23** 於 **2022-12-28** 進入維護模式。

**1.23** 的生命週期結束時間為 **2023-02-28**。

<!--
| PATCH RELEASE | CHERRY PICK DEADLINE | TARGET DATE | NOTE |

[Out-of-Band Release](https://groups.google.com/a/kubernetes.io/g/dev/c/Xl1sm-CItaY)
-->
| 補丁釋出       | Cherry Pick 截止日期   |  目標日期    | 說明  |
|---------------|----------------------|-------------|------|
| 1.23.7        | 2022-05-20           | 2022-05-24  |      |
| 1.23.6        | 2022-04-08           | 2022-04-13  |      |
| 1.23.5        | 2022-03-11           | 2022-03-16  |      |
| 1.23.4        | 2022-02-11           | 2022-02-16  |      |
| 1.23.3        | 2022-01-24           | 2022-01-25  | [帶外發布](https://groups.google.com/a/kubernetes.io/g/dev/c/Xl1sm-CItaY) |
| 1.23.2        | 2022-01-14           | 2022-01-19  |      |
| 1.23.1        | 2021-12-14           | 2021-12-16  |      |

### 1.22

<!-- 
**1.22** enters maintenance mode on **2022-08-28**

End of Life for **1.22** is **2022-10-28**
-->
**1.22** 於 **2022-08-28** 進入維護模式

**1.22** 的生命週期結束時間為 **2022-10-28**

<!-- 
| PATCH RELEASE | CHERRY PICK DEADLINE | TARGET DATE | NOTE |
-->
| 補丁釋出       | Cherry Pick 截止日期   |  目標日期    | 說明  |
|---------------|----------------------|-------------|------|
| 1.22.10       | 2022-05-20           | 2022-05-24  |      |
| 1.22.9        | 2022-04-08           | 2022-04-13  |      |
| 1.22.8        | 2022-03-11           | 2022-03-16  |      |
| 1.22.7        | 2022-02-11           | 2022-02-16  |      |
| 1.22.6        | 2022-01-14           | 2022-01-19  |      |
| 1.22.5        | 2021-12-10           | 2021-12-15  |      |
| 1.22.4        | 2021-11-12           | 2021-11-17  |      |
| 1.22.3        | 2021-10-22           | 2021-10-27  |      |
| 1.22.2        | 2021-09-10           | 2021-09-15  |      |
| 1.22.1        | 2021-08-16           | 2021-08-19  |      |

### 1.21

<!-- 
**1.21** enters maintenance mode on **2022-04-28**

End of Life for **1.21** is **2022-06-28**
-->
**1.21** 於 **2022-04-28** 進入維護模式

**1.21** 的生命週期結束時間為 **2022-06-28**

<!-- 
| Patch Release | Cherry Pick Deadline | Target Date | Note |

[Regression](https://groups.google.com/g/kubernetes-dev/c/KuF8s2zueFs)
-->
| 補丁釋出       | Cherry Pick 截止日期   |  目標日期    | 說明  |
| ------------- | -------------------- | ----------- | ---------------------------------------------------------------------- |
| 1.21.13       | 2022-05-20           | 2022-05-24  |                                                                        |
| 1.21.12       | 2022-04-08           | 2022-04-13  |                                                                        |
| 1.21.11       | 2022-03-11           | 2022-03-16  |                                                                        |
| 1.21.10       | 2022-02-11           | 2022-02-16  |                                                                        |
| 1.21.9        | 2022-01-14           | 2022-01-19  |                                                                        |
| 1.21.8        | 2021-12-10           | 2021-12-15  |                                                                        |
| 1.21.7        | 2021-11-12           | 2021-11-17  |                                                                        |
| 1.21.6        | 2021-10-22           | 2021-10-27  |                                                                        |
| 1.21.5        | 2021-09-10           | 2021-09-15  |                                                                        |
| 1.21.4        | 2021-08-07           | 2021-08-11  |                                                                        |
| 1.21.3        | 2021-07-10           | 2021-07-14  |                                                                        |
| 1.21.2        | 2021-06-12           | 2021-06-16  |                                                                        |
| 1.21.1        | 2021-05-07           | 2021-05-12  | [版本回退](https://groups.google.com/g/kubernetes-dev/c/KuF8s2zueFs)    |

<!-- 
## Non-Active Branch History

These releases are no longer supported.
-->
## 非活動分支歷史  {#non-active-branch-history}

不再支援這些版本。

<!--
| Minor Version | Final Patch Release | EOL Date   | Note                                                                   |

Created to resolve regression introduced in 1.18.19

[Regression](https://groups.google.com/g/kubernetes-dev/c/KuF8s2zueFs)
-->
| 次要版本       | 最終補丁釋出版本       | EOL 日期    | 說明                                                                   |
| ------------- | ------------------- | ---------- | ---------------------------------------------------------------------- |
| 1.20          | 1.20.15             | 2022-02-28 |                                                                        |
| 1.19          | 1.19.16             | 2021-10-28 |                                                                        |
| 1.18          | 1.18.20             | 2021-06-18 | 建立用於解決 1.18.19 版本引入的回退                                        |
| 1.18          | 1.18.19             | 2021-05-12 | [版本回退](https://groups.google.com/g/kubernetes-dev/c/KuF8s2zueFs)    |
| 1.17          | 1.17.17             | 2021-01-13 |                                                                        |
| 1.16          | 1.16.15             | 2020-09-02 |                                                                        |
| 1.15          | 1.15.12             | 2020-05-06 |                                                                        |
| 1.14          | 1.14.10             | 2019-12-11 |                                                                        |
| 1.13          | 1.13.12             | 2019-10-15 |                                                                        |
| 1.12          | 1.12.10             | 2019-07-08 |                                                                        |
| 1.11          | 1.11.10             | 2019-05-01 |                                                                        |
| 1.10          | 1.10.13             | 2019-02-13 |                                                                        |
| 1.9           | 1.9.11              | 2018-09-29 |                                                                        |
| 1.8           | 1.8.15              | 2018-07-12 |                                                                        |
| 1.7           | 1.7.16              | 2018-04-04 |                                                                        |
| 1.6           | 1.6.13              | 2017-11-23 |                                                                        |
| 1.5           | 1.5.8               | 2017-10-01 |                                                                        |
| 1.4           | 1.4.12              | 2017-04-21 |                                                                        |
| 1.3           | 1.3.10              | 2016-11-01 |                                                                        |
| 1.2           | 1.2.7               | 2016-10-23 |                                                                        |

[cherry-picks]: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md
[release-managers]: /releases/release-managers
[釋出流程說明]: /releases/release
[yearly-support]: https://git.k8s.io/enhancements/keps/sig-release/1498-kubernetes-yearly-support-period/README.md
