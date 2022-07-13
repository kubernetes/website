---
title: 补丁版本
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
Kubernetes 补丁版本的发布时间表和团队联系信息。

有关 Kubernetes 发布周期的常规信息，请参阅[发布流程说明](/zh-cn/releases/release)。

<!-- 
## Cadence

Our typical patch release cadence is monthly. It is
commonly a bit faster (1 to 2 weeks) for the earliest patch releases
after a 1.X minor release. Critical bug fixes may cause a more
immediate release outside of the normal cadence. We also aim to not make
releases during major holiday periods.
-->
## 节奏 {#cadence}

我们的补丁发布节奏通常是每月一次。
在 1.X 次要版本之后，最早的补丁版本通常要快一些（提前 1 到 2 周）。
严重错误修复可能会导致超出正常节奏而更快速的发布。
我们尽量避免在主假期期间发布。

<!-- 
## Contact

See the [Release Managers page][release-managers] for full contact details on the Patch Release Team.

Please give us a business day to respond - we may be in a different timezone!

In between releases the team is looking at incoming cherry pick requests on a weekly basis. The team will get in touch with submitters via GitHub PR, SIG channels in Slack, and direct messages
in Slack and [email](mailto:release-managers-private@kubernetes.io) if there are questions on the PR.
-->
## 联系方式  {#contact}

有关补丁发布团队（Patch Release Team）的完整联系方式，
请参阅[发布管理员页面](/zh-cn/releases/release-managers)。

请给我们一个工作日回复，因为我们可能在不同的时区！

在两次发布之间，团队每周都会查看收到的 cherry pick 请求。
如果对 PR 有任何问题，团队将通过 GitHub PR、Slack 中的 SIG 频道以及 Slack 中的直接消息和
[email](mailto:release-managers-private@kubernetes.io) 与提交者取得联系。

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

## Cherry Picks

请遵循 [Cherry Pick 流程](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md)。

Cherry Pick 必须在 GitHub 中准备好合并，带有适当的标签（例如 `approved`、`lgtm`、`release-note`），
并在 Cherry Pick 截止日期之前通过 CI 测试。这通常是目标发布前两天，但可能更早。
PR 越早准备好越好，因为在实际发布之前，合并了你的 Cherry Pick 后，我们需要时间来获取 CI 信号。

不符合合并标准的 Cherry Pick PR 将被带入下一个补丁版本中跟踪。

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
## 支持周期  {#support-period}

根据[年度支持 KEP](https://git.k8s.io/enhancements/keps/sig-release/1498-kubernetes-yearly-support-period/README.md)
约定，Kubernetes 社区将在大约 14 个月的时间内支持活跃的补丁发布系列。

此时间范围的前 12 个月将被视为标准周期。

在 12 个月后，将发生以下事情：

- [发布管理员](/zh-cn/releases/release-managers)将删除一个版本
- 补丁发布系列将进入维护模式

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
在两个月的维护模式期间，发布管理员可能会删减额外的维护版本以解决：

- CVE（在安全响应委员会的建议下）
- 依赖问题（包括基础镜像更新）
- 关键核心组件问题

在两个月的维护模式期结束时，补丁发布系列将被视为 EOL（生命周期结束），相关分支的 Cherry Pick 将很快关闭。

请注意，为简单起见，选择每月 28 日作为维护模式和 EOL 目标日期（每个月都有）。

<!-- 
## Upcoming Monthly Releases

Timelines may vary with the severity of bug fixes, but for easier planning we
will target the following monthly release points. Unplanned, critical
releases may also occur in between these.
-->
## 未来发布的月度版本  {#upcoming-monthly-releases}

时间表可能会因错误修复的严重程度而有所不同，但为了便于规划，我们将针对以下每月发布点。
计划外的关键版本也可能发生在这些版本之间。

<!-- 
| Monthly Patch Release | Cherry Pick Deadline | Target date |
| --------------------- | -------------------- | ----------- |
| July 2022             | 2022-07-08           | 2022-07-13  |
| August 2022           | 2022-08-12           | 2022-08-17  |
| September 2022        | 2022-09-09           | 2022-09-14  |
| October 2022          | 2022-10-07           | 2022-10-12  |
-->
| 月度补丁发布  | Cherry Pick 截止日期 |   目标日期  |
| ------------- | -------------------- | ----------- |
| 2022 年 7 月  | 2022-07-08           | 2022-07-13  |
| 2022 年 8 月  | 2022-08-12           | 2022-08-16  |
| 2022 年 9 月  | 2022-09-09           | 2022-09-14  |
| 2022 年 10 月 | 2022-10-07           | 2022-10-12  |

<!-- 
## Detailed Release History for Active Branches

### 1.24

Next patch release is **1.24.1**

End of Life for **1.24** is **2023-09-29**

| PATCH RELEASE | CHERRY PICK DEADLINE | TARGET DATE | NOTE |
|---------------|----------------------|-------------|------|
| 1.24.3        | 2022-07-08           | 2022-07-13  |      |
| 1.24.2        | 2022-06-10           | 2022-06-15  |      |
| 1.24.1        | 2022-05-20           | 2022-05-24  |      |
-->
## 活动分支的详细发布历史  {#detailed-release-history-for-active-branches}

### 1.24

下一个补丁版本是 **1.24.1**

**1.24** 的生命周期结束时间为 **2023-09-29**

| 补丁发布 | Cherry Pick 截止日期 |  目标日期  | 说明 |
|----------|----------------------|------------|------|
| 1.24.3   | 2022-07-08           | 2022-07-13 |      |
| 1.24.2   | 2022-06-10           | 2022-06-15 |      |
| 1.24.1   | 2022-05-20           | 2022-05-24 |      |

### 1.23

<!-- 
**1.23** enters maintenance mode on **2022-12-28**.

End of Life for **1.23** is **2023-02-28**.
-->
**1.23** 于 **2022-12-28** 进入维护模式。

**1.23** 的生命周期结束时间为 **2023-02-28**。

<!--
| Patch Release | Cherry Pick Deadline | Target Date | Note |

[Out-of-Band Release](https://groups.google.com/a/kubernetes.io/g/dev/c/Xl1sm-CItaY)
-->
| 补丁发布      | Cherry Pick 截止日期 |  目标日期   | 说明  |
|---------------|----------------------|-------------|------|
| 1.23.9        | 2022-07-08           | 2022-07-13  |      |
| 1.23.8        | 2022-06-10           | 2022-06-15  |      |
| 1.23.7        | 2022-05-20           | 2022-05-24  |      |
| 1.23.6        | 2022-04-08           | 2022-04-13  |      |
| 1.23.5        | 2022-03-11           | 2022-03-16  |      |
| 1.23.4        | 2022-02-11           | 2022-02-16  |      |
| 1.23.3        | 2022-01-24           | 2022-01-25  | [带外发布](https://groups.google.com/a/kubernetes.io/g/dev/c/Xl1sm-CItaY) |
| 1.23.2        | 2022-01-14           | 2022-01-19  |      |
| 1.23.1        | 2021-12-14           | 2021-12-16  |      |

### 1.22

<!-- 
**1.22** enters maintenance mode on **2022-08-28**

End of Life for **1.22** is **2022-10-28**
-->
**1.22** 于 **2022-08-28** 进入维护模式

**1.22** 的生命周期结束时间为 **2022-10-28**

<!-- 
| PATCH RELEASE | CHERRY PICK DEADLINE | TARGET DATE | NOTE |
-->
| 补丁发布      | Cherry Pick 截止日期 |  目标日期   | 说明 |
|---------------|----------------------|-------------|------|
| 1.22.12       | 2022-07-08           | 2022-07-13  |      |
| 1.22.11       | 2022-06-10           | 2022-06-15  |      |
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

<!-- 
## Non-Active Branch History

These releases are no longer supported.
-->
## 非活动分支历史  {#non-active-branch-history}

不再支持这些版本。

<!--
| Minor Version | Final Patch Release | EOL Date   | Note                                                                   |

Created to resolve regression introduced in 1.18.19

[Regression](https://groups.google.com/g/kubernetes-dev/c/KuF8s2zueFs)
-->
| 次要版本      | 最终补丁发布版本    | EOL 日期   | 说明                                                                   |
| ------------- | ------------------- | ---------- | ---------------------------------------------------------------------- |
| 1.21          | 1.21.14             | 2022-06-28 |                                                                        |
| 1.20          | 1.20.15             | 2022-02-28 |                                                                        |
| 1.19          | 1.19.16             | 2021-10-28 |                                                                        |
| 1.18          | 1.18.20             | 2021-06-18 | 创建用于解决 1.18.19 版本引入的回退                                    |
| 1.18          | 1.18.19             | 2021-05-12 | [版本回退](https://groups.google.com/g/kubernetes-dev/c/KuF8s2zueFs)   |
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

