---
title: Kubernetes 发布周期
type: docs
---
<!-- 
title: Kubernetes Release Cycle
type: docs
auto_generated: true
-->

<!-- THIS CONTENT IS AUTO-GENERATED via ./scripts/releng/update-release-info.sh in kubernetes/website -->

{{< warning >}}
<!-- 
This content is auto-generated and links may not function. The source of the document
is located [here](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md).
-->
此内容原文是自动生成的，链接可能无法正常访问。
文档的来源在[这里](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md)。
{{< /warning >}}

<!-- 
# Targeting enhancements, Issues and PRs to Release Milestones

This document is focused on Kubernetes developers and contributors who need to
create an enhancement, issue, or pull request which targets a specific release
milestone.
-->
# 针对发布里程碑的特性增强、Issue 和 PR  {#targeting-enhancements-issues-and-prs-to-release-milestones}

本文档重点是面向于那些需要创建针对特定发布里程碑的特性增强、问题或拉取请求的 Kubernetes 开发人员和贡献者。

<!-- 
- [TL;DR](#tldr)
  - [Normal Dev (Weeks 1-11)](#normal-dev-weeks-1-11)
  - [Code Freeze (Weeks 12-14)](#code-freeze-weeks-12-14)
  - [Post-Release (Weeks 14+)](#post-release-weeks-14+)
- [Definitions](#definitions)
- [The Release Cycle](#the-release-cycle)
- [Removal Of Items From The Milestone](#removal-of-items-from-the-milestone)
- [Adding An Item To The Milestone](#adding-an-item-to-the-milestone)
  - [Milestone Maintainers](#milestone-maintainers)
  - [Feature additions](#feature-additions)
  - [Issue additions](#issue-additions)
  - [PR Additions](#pr-additions)
- [Other Required Labels](#other-required-labels)
  - [SIG Owner Label](#sig-owner-label)
  - [Priority Label](#priority-label)
  - [Issue/PR Kind Label](#issuepr-kind-label)
-->
- [TL;DR](#tldr)
   - [正常开发（第 1-11周）](#normal-dev-weeks-1-11)
   - [代码冻结（第 12-14 周）](#code-freeze-weeks-12-14)
   - [发布后（第 14 周以上）](#post-release-weeks-14)
- [定义](#definitions)
- [发布周期](#the-release-cycle)
- [从里程碑中删除项目](#removal-of-items-from-the-milestone)
- [向里程碑添加项目](#adding-an-item-to-the-milestone)
   - [里程碑维护者](#milestone-maintainers)
   - [新增特性](#feature-additions)
   - [问题补充](#issue-additions)
   - [新增 PR](#pr-additions)
- [其他必需标签](#other-required-labels)
   - [SIG 所有者标签](#sig-owner-label)
   - [优先级标签](#priority-label)
   - [Issue/PR 分类标签](#issuepr-kind-label)

<!-- 
The process for shepherding enhancements, issues, and pull requests into a
Kubernetes release spans multiple stakeholders:

- the enhancement, issue, and pull request owner(s)
- SIG leadership
- the [Release Team][release-team]

Information on workflows and interactions are described below.
-->
将特性增强、问题和拉取请求引入 Kubernetes 版本的过程涉及多个利益相关者：

- 特性增强、问题和拉取请求的所有者
- SIG 负责人
- [发布团队][release-team]

关于工作流程和交互的信息如下所述。

<!-- 
As the owner of an enhancement, issue, or pull request (PR), it is your
responsibility to ensure release milestone requirements are met. Automation and
the Release Team will be in contact with you if updates are required, but
inaction can result in your work being removed from the milestone. Additional
requirements exist when the target milestone is a prior release (see
[cherry pick process][cherry-picks] for more information).
-->
作为特性增强、问题或拉取请求 (PR) 的所有者，你有责任确保满足里程碑发布要求。
如果需要更新，自动化和发布团队将与你联系，但无响应可能会导致你的工作从里程碑中删除。
当目标里程碑是先前版本时，还存在其他要求（请参阅 [Cherry Pick 流程][cherry-picks]了解更多信息）。

## TL;DR {#tldr}

<!-- 
If you want your PR to get merged, it needs the following required labels and
milestones, represented here by the Prow /commands it would take to add them:
-->
如果你希望你的 PR 被合并，它需要以下必备的标签和里程碑，它们由 Prow /commands 所添加表示：

<!-- 
### Normal Dev (Weeks 1-11)
-->
### 正常开发（第 1-11 周）  {#normal-dev-weeks-1-11}

- /sig {name}
- /kind {type}
- /lgtm
- /approved

<!-- 
### [Code Freeze][code-freeze] (Weeks 12-14)
-->
### [代码冻结][code-freeze]（第 12-14 周）  {#code-freeze-code-freeze-weeks-12-14}

- /milestone {v1.y}
- /sig {name}
- /kind {bug, failing-test}
- /lgtm
- /approved

<!-- 
### Post-Release (Weeks 14+)
-->
### 发布后（第 14 周以上）  {#post-release-weeks-14}

<!-- 
Return to 'Normal Dev' phase requirements:
-->
回到“正常开发”阶段要求：

- /sig {name}
- /kind {type}
- /lgtm
- /approved

<!-- 
Merges into the 1.y branch are now [via cherry picks][cherry-picks], approved
by [Release Managers][release-managers].

In the past, there was a requirement for a milestone-targeted pull requests to
have an associated GitHub issue opened, but this is no longer the case.
Features or enhancements are effectively GitHub issues or [KEPs][keps] which
lead to subsequent PRs.

The general labeling process should be consistent across artifact types.
-->
合并到 1.y 分支现在是[通过 Cherry Pick][cherry-picks]，由[发布管理员][release-managers]批准。

过去，针对里程碑的拉取请求需要打开相关的 GitHub 问题，但现在情况不再如此。
特性或特性增强实际上是 GitHub 问题或导致后续 PR 的 [KEPs][keps]。

一般的打标签过程应该在不同工件类型之间保持一致。

<!-- 
## Definitions

- *issue owners*: Creator, assignees, and user who moved the issue into a
  release milestone

- *Release Team*: Each Kubernetes release has a team doing project management
  tasks described [here][release-team].

  The contact info for the team associated with any given release can be found
  [here](https://git.k8s.io/sig-release/releases/).

- *Y days*: Refers to business days

- *enhancement*: see "[Is My Thing an Enhancement?](https://git.k8s.io/enhancements/README.md#is-my-thing-an-enhancement)"
-->
## 定义  {#definitions}

- **问题所有者**：将问题移至发布里程碑的创建者、委托人和用户

- **发布小组**：每个 Kubernetes 版本都有一个团队来执行[这里][release-team]所描述的项目管理任务。

  可以在[此处](https://git.k8s.io/sig-release/releases/)找到与任何给定版本相关联的团队的联系信息。

- **Y 天**：指工作日

- **增强**：参见“[我的改进是特性增强吗？](https://git.k8s.io/enhancements/README.md#is-my-thing-an-enhancement)”

<!-- 
- *[Enhancements Freeze][enhancements-freeze]*:
  the deadline by which [KEPs][keps] have to be completed in order for
  enhancements to be part of the current release

- *[Exception Request][exceptions]*:
  The process of requesting an extension on the deadline for a particular
  Enhancement

- *[Code Freeze][code-freeze]*:
  The period of ~4 weeks before the final release date, during which only
  critical bug fixes are merged into the release.

- *[Pruning](https://git.k8s.io/sig-release/releases/release_phases.md#pruning)*:
  The process of removing an Enhancement from a release milestone if it is not
  fully implemented or is otherwise considered not stable.
-->
- **[特性增强冻结][enhancements-freeze]**：
  为了使特性增强成为当前版本的一部分，必须在 [KEPs][keps] 的截止日期前完成

- **[异常请求][exceptions]**：
  请求延长特性增强的截止日期的过程

- **[代码冻结][code-freeze]**：
  最终发布日期前约 4 周的时间，在此期间，仅将关键错误修复合并到发布中。

- **[修剪](https://git.k8s.io/sig-release/releases/release_phases.md#pruning)**：
  如果特性增强未完全实现或被认为不稳定，则在此过程中从发布里程碑中删除它。

<!-- 
- *release milestone*: semantic version string or
  [GitHub milestone](https://help.github.com/en/github/managing-your-work-on-github/associating-milestones-with-issues-and-pull-requests)
  referring to a release MAJOR.MINOR `vX.Y` version.

  See also
  [release versioning](https://git.k8s.io/sig-release/release-engineering/versioning.md).

- *release branch*: Git branch `release-X.Y` created for the `vX.Y` milestone.

  Created at the time of the `vX.Y-rc.0` release and maintained after the
  release for approximately 12 months with `vX.Y.Z` patch releases.

  Note: releases 1.19 and newer receive 1 year of patch release support, and
  releases 1.18 and earlier received 9 months of patch release support.
-->
- **发布里程碑**：语义版本字符串或
  [GitHub 里程碑](https://help.github.com/en/github/managing-your-work-on-github/associating-milestones-with-issues-and-pull-requests)
  指的是发布 主.次 `vX.Y` 版本。

  另请参阅[发布版本控制](https://git.k8s.io/sig-release/release-engineering/versioning.md)。

- **发布分支**：为 `vX.Y` 里程碑创建的 Git 分支 `release-X.Y`。

  在 `vX.Y-rc.0` 发布时创建，并在发布后使用 `vX.Y.Z` 补丁版本，维护大约 12 个月。

  注意：1.19 及更高版本获得 1 年的补丁版本支持，1.18 及更早版本获得 9 个月的补丁版本支持。

<!-- 
## The Release Cycle
-->
## 发布周期  {#the-release-cycle}

![Image of one Kubernetes release cycle](/images/releases/release-cycle.jpg)

<!-- 
Kubernetes releases currently happen approximately three times per year.

The release process can be thought of as having three main phases:

- Enhancement Definition
- Implementation
- Stabilization
-->
Kubernetes 目前大约每年发布三次。

发布过程可被认为具有三个主要阶段：

- 特性增强定义
- 实现
- 稳定

<!-- 
But in reality, this is an open source and agile project, with feature planning
and implementation happening at all times. Given the project scale and globally
distributed developer base, it is critical to project velocity to not rely on a
trailing stabilization phase and rather have continuous integration testing
which ensures the project is always stable so that individual commits can be
flagged as having broken something.
-->
但实际上，这是一个灵活的开源项目，功能规划和实施始终在进行。
鉴于项目规模和全球分布的开发人员基础，对项目速度至关重要的是不依赖于后续的稳定阶段，
而是进行持续集成测试，以确保项目始终稳定，以便可以将单个提交标记为有问题。

<!-- 
With ongoing feature definition through the year, some set of items will bubble
up as targeting a given release. **[Enhancements Freeze][enhancements-freeze]**
starts ~4 weeks into release cycle. By this point all intended feature work for
the given release has been defined in suitable planning artifacts in
conjunction with the Release Team's [Enhancements Lead](https://git.k8s.io/sig-release/release-team/role-handbooks/enhancements/README.md).
-->
随着全年功能定义的不断进行，某些项目将冒泡作为给定版本的目标。
在发布周期约 4 周后开始 **[冻结特性增强][enhancements-freeze]**。
至此，针对给定版本的所有预期功能工作都已与发布团队的
[特性增强负责人](https://git.k8s.io/sig-release/release-team/role-handbooks/enhancements/README.md)
一起在合适的规划工件中定义。


<!-- 
After Enhancements Freeze, tracking milestones on PRs and issues is important.
Items within the milestone are used as a punchdown list to complete the
release. *On issues*, milestones must be applied correctly, via triage by the
SIG, so that [Release Team][release-team] can track bugs and enhancements (any
enhancement-related issue needs a milestone).
-->
特性增强冻结后，跟踪 PR 和问题的里程碑很重要。里程碑中的项目作为完成发布的下达列表。
**关于问题**，里程碑必须通过 SIG 的分类正确应用，
以便[发布团队][release-team]可以跟踪错误和特性增强（任何与特性增强相关的问题都需要里程碑）。

<!-- 
There is some automation in place to help automatically assign milestones to
PRs.

This automation currently applies to the following repos:
-->
自动化可以自动将里程碑分配给 PR。

此自动化当前适用于以下存储库：

- `kubernetes/enhancements`
- `kubernetes/kubernetes`
- `kubernetes/release`
- `kubernetes/sig-release`
- `kubernetes/test-infra`

<!--
At creation time, PRs against the `master` branch need humans to hint at which
milestone they might want the PR to target. Once merged, PRs against the
`master` branch have milestones auto-applied so from that time onward human
management of that PR's milestone is less necessary. On PRs against release
branches, milestones are auto-applied when the PR is created so no human
management of the milestone is ever necessary.
-->
在创建时，针对 `master` 分支的 PR 需要人工提示他们可能希望 PR 指向哪个里程碑。
一旦合并，针对 `master` 分支的 PR 会自动应用里程碑，因此从那时起，不再需要人工管理该 PR 的里程碑。
在指向发布分支的 PR 上，会在创建 PR 时自动应用里程碑，因此不需要对里程碑进行人工管理。

<!-- 
Any other effort that should be tracked by the Release Team that doesn't fall
under that automation umbrella should be have a milestone applied.

Implementation and bug fixing is ongoing across the cycle, but culminates in a
code freeze period.

**[Code Freeze][code-freeze]** starts in week ~12 and continues for ~2 weeks.
Only critical bug fixes are accepted into the release codebase during this
time.
-->
任何其他应该由发布团队跟踪的不属于该自动化保护伞的工作都应该应用一个里程碑。

整个周期都在进行实施和错误修复，但最终会出现代码冻结期。

**[代码冻结][code-freeze]** 大约从第 12 周开始，持续约 2 周。
在此期间，只有关键的错误修复才会被接受到发布代码库中。

<!-- 
There are approximately two weeks following Code Freeze, and preceding release,
during which all remaining critical issues must be resolved before release.
This also gives time for documentation finalization.

When the code base is sufficiently stable, the master branch re-opens for
general development and work begins there for the next release milestone. Any
remaining modifications for the current release are cherry picked from master
back to the release branch. The release is built from the release branch.

Each release is part of a broader Kubernetes lifecycle:
-->
在代码冻结之后和之前的发布之间大约有两周时间，在此期间，必须在发布版本前解决所有剩余的严重问题。
这也为文档定稿提供了时间。

当代码库足够稳定时，主分支将重新打开以进行一般开发，并从那里开始下一个发布里程碑的工作。
当前版本的任何剩余修改都是从 master 挑选回发布分支。发布版本是从发布分支构建的。

每个版本都是更广泛的 Kubernetes 生命周期的一部分：

![Image of Kubernetes release lifecycle spanning three releases](/images/releases/release-lifecycle.jpg)

<!-- 
## Removal Of Items From The Milestone

Before getting too far into the process for adding an item to the milestone,
please note:

Members of the [Release Team][release-team] may remove issues from the
milestone if they or the responsible SIG determine that the issue is not
actually blocking the release and is unlikely to be resolved in a timely
fashion.

Members of the Release Team may remove PRs from the milestone for any of the
following, or similar, reasons:
-->
## 从里程碑中删除项目  {#removal-of-items-from-the-milestone}

在深入了解将项目添加到里程碑的过程之前，请注意：

如果[发布小组][release-team]的成员或负责的 SIG
确定问题实际上并未阻止发布并且不太可能及时解决，则可以从里程碑中删除问题。

发布团队的成员可以出于以下任何原因或类似原因从里程碑中删除 PR：

<!-- 
- PR is potentially de-stabilizing and is not needed to resolve a blocking
  issue
- PR is a new, late feature PR and has not gone through the enhancements
  process or the [exception process][exceptions]
- There is no responsible SIG willing to take ownership of the PR and resolve
  any follow-up issues with it
- PR is not correctly labelled
- Work has visibly halted on the PR and delivery dates are uncertain or late
-->
- PR 可能会破坏稳定，并且不需要去解决阻塞问题
- PR 是一个新的、较晚的特性 PR 并且没有经过增强过程或[异常过程][exceptions]
- 没有负责任的 SIG 愿意接管 PR 并解决任何后续问题
- PR 未正确标记
- PR 工作明显停止，交付日期不确定或延迟

<!-- 
While members of the Release Team will help with labelling and contacting
SIG(s), it is the responsibility of the submitter to categorize PRs, and to
secure support from the relevant SIG to guarantee that any breakage caused by
the PR will be rapidly resolved.

Where additional action is required, an attempt at human to human escalation
will be made by the Release Team through the following channels:
-->
虽然发布团队的成员将帮助标记和联系 SIG，但提交者有责任对 PR 进行分类，
并获得相关 SIG 的支持，以保证由 PR 引起的任何破坏都会得到迅速解决。

如果需要采取其他措施，发布团队将通过以下渠道尝试进行人与人之间的对话：

<!-- 
- Comment in GitHub mentioning the SIG team and SIG members as appropriate for
  the issue type
- Emailing the SIG mailing list
  - bootstrapped with group email addresses from the
    [community sig list][sig-list]
  - optionally also directly addressing SIG leadership or other SIG members
- Messaging the SIG's Slack channel
  - bootstrapped with the slackchannel and SIG leadership from the
    [community sig list][sig-list]
  - optionally directly "@" mentioning SIG leadership or others by handle
-->
- 在 GitHub 中发表评论，根据问题类型提及 SIG 团队和 SIG 成员
- 给 SIG 邮件列表发邮件
   - 使用来自[社区 SIG 列表][sig-list]的群组电子邮件地址进行引导
   - 也可选择直接与 SIG 负责人或 SIG 其他成员联系
- 向 SIG 的 Slack 频道发送消息
   - 在 Slack 频道 和 SIG 负责人的引导下
     [社区签名列表][签名列表]
   - 可选地直接 “@” 来提及 SIG 负责人或其他人

<!-- 
## Adding An Item To The Milestone

### Milestone Maintainers

The members of the [`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members)
GitHub team are entrusted with the responsibility of specifying the release
milestone on GitHub artifacts.

This group is [maintained](https://git.k8s.io/sig-release/release-team/README.md#milestone-maintainers)
by SIG Release and has representation from the various SIGs' leadership.
-->
## 向里程碑添加项目  {#adding-an-item-to-the-milestone}

### 里程碑维护者  {#milestone-maintainers}

[`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members)
GitHub 团队的成员负责在 GitHub 工件上指定发布里程碑。

该小组由 SIG Release
[维护](https://git.k8s.io/sig-release/release-team/README.md#milestone-maintainers)，并有来自各个 SIG 负责人的代表。

<!-- 
### Feature additions

Feature planning and definition takes many forms today, but a typical example
might be a large piece of work described in a [KEP][keps], with associated task
issues in GitHub. When the plan has reached an implementable state and work is
underway, the enhancement or parts thereof are targeted for an upcoming milestone
by creating GitHub issues and marking them with the Prow "/milestone" command.
-->
### 特性添加  {#feature-additions}

如今，功能规划和定义有多种形式，但一个典型的例子可能是
[KEP][keps] 中描述的大量工作，以及 GitHub 中的相关任务问题。
当计划达到可实施状态并且工作正在进行中时，通过创建 GitHub 问题并使用
Prow "/milestone" 命令对其进行标记，特性增强或其部分指向未来的里程碑。

<!-- 
For the first ~4 weeks into the release cycle, the Release Team's Enhancements
Lead will interact with SIGs and feature owners via GitHub, Slack, and SIG
meetings to capture all required planning artifacts.

If you have an enhancement to target for an upcoming release milestone, begin a
conversation with your SIG leadership and with that release's Enhancements
Lead.
-->
在发布周期的前 4 周左右内，发布团队的特性增强负责人将通过
GitHub、Slack 和 SIG 会议与 SIG 和特性所有者互动，以获取所有需要的计划工件。

如果你有针对即将发布的里程碑的特性增强，请与你的 SIG 领导以及该版本的特性增强负责人开始对话。

<!-- 
### Issue additions

Issues are marked as targeting a milestone via the Prow "/milestone" command.

The Release Team's [Bug Triage Lead](https://git.k8s.io/sig-release/release-team/role-handbooks/bug-triage/README.md)
and overall community watch incoming issues and triage them, as described in
the contributor guide section on
[issue triage](https://k8s.dev/docs/guide/issue-triage/).
-->
### 问题补充  {#issue-additions}

通过 Prow “/milestone” 命令标记问题并指向里程碑。

发布团队的[错误分类负责人](https://git.k8s.io/sig-release/release-team/role-handbooks/bug-triage/README.md)和整个社区观察新出现的问题并对其进行分类，
在贡献者指南部分中描述[问题分类](https://k8s.dev/docs/guide/issue-triage/)。

<!-- 
Marking issues with the milestone provides the community better visibility
regarding when an issue was observed and by when the community feels it must be
resolved. During [Code Freeze][code-freeze], a milestone must be set to merge
a PR.

An open issue is no longer required for a PR, but open issues and associated
PRs should have synchronized labels. For example a high priority bug issue
might not have its associated PR merged if the PR is only marked as lower
priority.
-->
用里程碑标记问题可以让社区更好地了解何时观察到问题以及社区认为何时必须解决问题。
[代码冻结][code-freeze]期间，必须设置里程碑以合并 PR。

一个 PR 不再需要一个已开启的问题，但已开启的问题和相关的 PR 应该有同步的标签。
例如，如果 PR 仅标记为较低优先级，则高优先级错误问题可能不会合并其关联的 PR。

<!-- 
### PR Additions

PRs are marked as targeting a milestone via the Prow "/milestone" command.

This is a blocking requirement during Code Freeze as described above.
-->
### PR 补充  {#pr-additions}

PR 通过 Prow “/milestone” 命令标记并指向里程碑。

如上所述，这是代码冻结期间的阻塞要求。

<!-- 
## Other Required Labels

[Here is the list of labels and their use and purpose.](https://git.k8s.io/test-infra/label_sync/labels.md#labels-that-apply-to-all-repos-for-both-issues-and-prs)
-->
## 其他必需的标签  {#other-required-labels}

[这里是标签列表及其用途和目的](https://git.k8s.io/test-infra/label_sync/labels.md#labels-that-apply-to-all-repos-for-both-issues-and-prs)。

<!-- 
### SIG Owner Label

The SIG owner label defines the SIG to which we escalate if a milestone issue
is languishing or needs additional attention. If there are no updates after
escalation, the issue may be automatically removed from the milestone.

These are added with the Prow "/sig" command. For example to add the label
indicating SIG Storage is responsible, comment with `/sig storage`.
-->
### SIG 所有者标签  {#sig-owner-label}

SIG 所有者标签定义了当里程碑问题未取得进展或需要额外关注时，我们应该逐步升级的 SIG。
如果升级后没有更新，该问题可能会自动从里程碑中删除。

这些是通过 Prow "/sig" 命令添加的。
例如要添加指示 SIG Storage 负责的标签，请使用 `/sig storage` 进行评论。

<!-- 
### Priority Label

Priority labels are used to determine an escalation path before moving issues
out of the release milestone. They are also used to determine whether or not a
release should be blocked on the resolution of the issue.
-->
### 优先级标签  {#priority-label}

优先级标签用于在将问题移出发布里程碑之前确定升级路径。
它们还用于确定在解决问题时是否应阻止发布。

<!-- 
- `priority/critical-urgent`: Never automatically move out of a release
  milestone; continually escalate to contributor and SIG through all available
  channels.
  - considered a release blocking issue
  - requires daily updates from issue owners during [Code Freeze][code-freeze]
  - would require a patch release if left undiscovered until after the minor
    release
- `priority/important-soon`: Escalate to the issue owners and SIG owner; move
  out of milestone after several unsuccessful escalation attempts.
  - not considered a release blocking issue
  - would not require a patch release
  - will automatically be moved out of the release milestone at Code Freeze
    after a 4 day grace period
- `priority/important-longterm`: Escalate to the issue owners; move out of the
  milestone after 1 attempt.
  - even less urgent / critical than `priority/important-soon`
  - moved out of milestone more aggressively than `priority/important-soon`
-->
- `priority/critical-urgent`：永远不会自动移出发布里程碑；通过所有可用渠道不断上报给贡献者和 SIG。
   - 考虑发布阻塞问题
   - 在[代码冻结][code-freeze]期间需要问题所有者的每日更新
   - 如果在次要版本之后才被发现，则需要补丁版本
- `priority/important-soon`：上报给问题所有者和 SIG 所有者；在几次不成功的升级尝试后退出里程碑。
   - 不考虑发布阻止问题
   - 不需要补丁版本
   - 将在 4 天的宽限期后自动移出代码冻结的发布里程碑
- `priority/important-longterm`：上报给问题所有者；1 次尝试后移出里程碑
   - 比 `priority/important-soon` 更不紧急/不关键
   - 比 `priority/important-soon` 更积极地移出里程碑

<!-- 
### Issue/PR Kind Label

The issue kind is used to help identify the types of changes going into the
release over time. This may allow the Release Team to develop a better
understanding of what sorts of issues we would miss with a faster release
cadence.

For release targeted issues, including pull requests, one of the following
issue kind labels must be set:
-->
### Issue/PR 分类标签  {#issue-pr-kind-label}

Issue 类型用于帮助识别随着时间的推移进入版本的更改类型。
这可以让发布团队更好地了解我们会在更快的发布节奏下错过哪些类型的 Issue。

对于发布版本的目标问题，包括拉取请求，必须设置以下问题类型标签之一：

<!-- 
- `kind/api-change`: Adds, removes, or changes an API
- `kind/bug`: Fixes a newly discovered bug.
- `kind/cleanup`: Adding tests, refactoring, fixing old bugs.
- `kind/design`: Related to design
- `kind/documentation`: Adds documentation
- `kind/failing-test`: CI test case is failing consistently.
- `kind/feature`: New functionality.
- `kind/flake`: CI test case is showing intermittent failures.
-->
- `kind/api-change`：添加、删除或更改 API
- `kind/bug`：修复了一个新发现的错误
- `kind/cleanup`：添加测试、重构、修复旧错误
- `kind/design`：与设计相关
- `kind/documentation`：添加文档
- `kind/failing-test`：CI 测试用例一直失败
- `kind/feature`：新功能
- `kind/flake`：CI 测试用例显示间歇性故障

[cherry-picks]: https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md
[code-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#code-freeze
[enhancements-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#enhancements-freeze
[exceptions]: https://git.k8s.io/sig-release/releases/release_phases.md#exceptions
[keps]: https://git.k8s.io/enhancements/keps
[release-managers]: /releases/release-managers/
[release-team]: https://git.k8s.io/sig-release/release-team
[sig-list]: https://k8s.dev/sigs
