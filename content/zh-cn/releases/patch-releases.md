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
我们尽量避免在重要的节假日期间发布。

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
## Cherry Pick

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

时间表可能会因错误修复的严重程度而有所不同，但为了便于规划，我们每月将按照以下时间点进行发布。
中间可能会发布一些计划外的关键版本。

<!--
| Monthly Patch Release | Cherry Pick Deadline | Target date |
| --------------------- | -------------------- | ----------- |
| April 2023            | 2023-04-07           | 2023-04-12  |
| May 2023              | 2023-05-12           | 2023-05-17  |
| June 2023             | 2023-06-09           | 2023-06-14  |
-->
| 月度补丁发布     | Cherry Pick 截止日期 | 目标日期       |
|------------|------------------|------------|
| 2023 年 4 月 | 2023-04-07       | 2023-04-12 |
| 2023 年 5 月 | 2023-05-12       | 2023-05-17 |
| 2023 年 6 月 | 2023-06-09       | 2023-06-14 |

<!--
## Detailed Release History for Active Branches
-->
## 活动分支的详细发布历史  {#detailed-release-history-for-active-branches}

{{< release-branches >}}

<!--
## Non-Active Branch history

These releases are no longer supported.
-->
## 非活动分支历史  {#non-active-branch-history}

不再支持这些版本。

{{< eol-releases >}}
