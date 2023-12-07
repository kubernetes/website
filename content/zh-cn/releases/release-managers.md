---
title: 发布管理员
type: docs
---
<!-- 
title: Release Managers
type: docs
-->

<!-- 
"Release Managers" is an umbrella term that encompasses the set of Kubernetes
contributors responsible for maintaining release branches and creating releases
by using the tools SIG Release provides.

The responsibilities of each role are described below.
-->
“发布管理员（Release Managers）” 是一个总称，通过使用 SIG Release 提供的工具，
负责维护发布分支、标记发行版本以及创建发行版本的贡献者。

每个角色的职责如下所述。

<!-- 
- [Contact](#contact)
  - [Security Embargo Policy](#security-embargo-policy)
- [Handbooks](#handbooks)
- [Release Managers](#release-managers)
  - [Becoming a Release Manager](#becoming-a-release-manager)
- [Release Manager Associates](#release-manager-associates)
  - [Becoming a Release Manager Associate](#becoming-a-release-manager-associate)
- [SIG Release Leads](#sig-release-leads)
  - [Chairs](#chairs)
  - [Technical Leads](#technical-leads)
-->
- [联系方式](#contact)
   - [安全禁运政策](#security-embargo-policy)
- [手册](#handbooks)
- [发布管理员](#release-managers)
   - [成为发布管理员](#becoming-a-release-manager)
- [发布管理员助理](#release-manager-associates)
   - [成为发布管理员助理](#becoming-a-release-manager-associate)
- [SIG 发布负责人](#sig-release-leads)
   - [首席](#chairs)
   - [技术负责人](#technical-leads)

<!-- 
## Contact

| Mailing List | Slack | Visibility | Usage | Membership |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (channel) / @release-managers (user group) | Public | Public discussion for Release Managers | All Release Managers (including Associates, and SIG Chairs) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | Private | Private discussion for privileged Release Managers | Release Managers, SIG Release leadership |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (channel) / @security-rel-team (user group) | Private | Security release coordination with the Security Response Committee | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |
-->
## 联系方式  {#contact}

| 邮件列表                                                                                     | Slack                                                                                                         | 可见范围  | 用法                      | 会员资格                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io)                    | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y)（频道）/@release-managers（用户组）        | 公共     | 发布管理员公开讨论          | 所有发布管理员（包括助理和 SIG 主席）                                                                                                                                                 |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io)    | 不适用                                                                                                          | 私人     | 拥有特权的发布管理员私人讨论  | 发布管理员，SIG Release 负责人                                                                                                                                                      |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io)          | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG)（频道）/@security-rel-team（用户组）  | 私人     | 与安全响应委员会协调安全发布  | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

<!-- 
### Security Embargo Policy

Some information about releases is subject to embargo and we have defined policy about
how those embargoes are set. Please refer to the
[Security Embargo Policy](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)
for more information.
-->
### 安全禁运政策  {#security-embargo-policy}

发布的相关信息受到禁运，我们已经定义了有关如何设置这些禁运的政策。
更多信息请参考[安全禁运政策](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)。

<!-- 
## Handbooks

**NOTE: The Patch Release Team and Branch Manager handbooks will be de-duplicated at a later date.**

- [Patch Release Team][handbook-patch-release]
- [Branch Managers][handbook-branch-mgmt]
-->
## 手册  {#handbooks}

**注意：补丁发布团队和分支管理员手册以后将会删除重复数据。**

- [补丁发布团队][handbook-patch-release]
- [分支管理员][handbook-branch-mgmt]

<!-- 
## Release Managers

**Note:** The documentation might refer to the Patch Release Team and the
Branch Management role. Those two roles were consolidated into the
Release Managers role.

Minimum requirements for Release Managers and Release Manager Associates are:

- Familiarity with basic Unix commands and able to debug shell scripts.
- Familiarity with branched source code workflows via `git` and associated
  `git` command line invocations.
- General knowledge of Google Cloud (Cloud Build and Cloud Storage).
- Open to seeking help and communicating clearly.
- Kubernetes Community [membership][community-membership]
-->
## 发布管理员  {#release-managers}

**注意：** 文档可能涉及补丁发布团队和分支管理角色。这两个角色被合并到发布管理员角色中。

发布管理员和发布管理员助理的最低要求是：

- 熟悉基本的 Unix 命令并能够调试 shell 脚本。
- 熟悉通过 `git` 和 `git` 相关命令行触发的分支源代码工作流。
- 谷歌云的常识（云构建和云存储）。
- 乐于寻求帮助和清晰地沟通。
- Kubernetes 社区[会员资格][community-membership]

<!-- 
Release Managers are responsible for:

- Coordinating and cutting Kubernetes releases:
  - Patch releases (`x.y.z`, where `z` > 0)
  - Minor releases (`x.y.z`, where `z` = 0)
  - Pre-releases (alpha, beta, and release candidates)
  - Working with the [Release Team][release-team] through each
  release cycle
  - Setting the [schedule and cadence for patch releases][patches]
- Maintaining the release branches:
  - Reviewing cherry picks
  - Ensuring the release branch stays healthy and that no unintended patch
    gets merged
- Mentoring the [Release Manager Associates](#release-manager-associates) group
- Actively developing features and maintaining the code in k/release
- Supporting Release Manager Associates and contributors through actively
  participating in the Buddy program
  - Check in monthly with Associates and delegate tasks, empower them to cut
    releases, and mentor
  - Being available to support Associates in onboarding new contributors e.g.,
    answering questions and suggesting appropriate work for them to do
-->
发布管理员负责：

- 协调和确定 Kubernetes 发行版本：
  - 补丁发布（`x.y.z`，其中 `z` > 0）
  - 次要版本（`x.y.z`，其中 `z` = 0）
  - 预发布（alpha、beta 和候选发布）
  - 通过每个发布周期与[发布团队][release-team]合作
  - 设置[补丁发布的时间表和节奏][patches]
- 维护发布分支：
  - 审查 Cherry Pick
  - 确保发布分支保持健康并且没有合并意外的补丁
- 指导[发布管理员助理](#release-manager-associates)小组
- 积极开发功能并维护 kubernetes/release 中的代码
- 通过积极参与 Buddy 计划来支持发布管理员助理和贡献者
  - 每月与助理核对并委派任务，授权他们生成发行版本并指导工作
  - 支持助理小组加入新的贡献者，例如回答问题并建议他们做适当的工作

<!-- 
This team at times works in close conjunction with the
[Security Response Committee][src] and therefore should abide by the guidelines
set forth in the [Security Release Process][security-release-process].

GitHub Access Controls: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub Mentions: [@kubernetes/release-engineering](https://github.com/orgs/kubernetes/teams/release-engineering)
-->
该团队有时与[安全响应委员会][src]密切合作，因此应遵守[安全发布流程][security-release-process]中规定的指导方针。

GitHub 访问控制：[@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub 提及：[@kubernetes/release-engineering](https://github.com/orgs/kubernetes/teams/release-engineering)

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

<!--
### Becoming a Release Manager

To become a Release Manager, one must first serve as a Release Manager
Associate. Associates graduate to Release Manager by actively working on
releases over several cycles and:

- demonstrating the willingness to lead
- tag-teaming with Release Managers on patches, to eventually cut a release
  independently
  - because releases have a limiting function, we also consider substantial
    contributions to image promotion and other core Release Engineering tasks
- questioning how Associates work, suggesting improvements, gathering feedback,
  and driving change
- being reliable and responsive
- leaning into advanced work that requires Release Manager-level access and
  privileges to complete
-->
### 成为发布管理员  {#becoming-a-release-manager}

要成为发布管理员，须先担任发布管理员助理。助理通过在多个周期内积极处理发布，从而毕业成为发布管理员，并且：

- 表现出带头的意愿
- 与发布管理员合作，为补丁打标记，最终独立制作发行版本
   - 因为发布具有限制功能，我们还考虑对镜像推广和其他核心发布工程任务的实质性贡献
- 质疑助理的工作方式、提出改进建议、收集反馈并推动变革
- 可靠且反应迅速
- 专注于需要发布管理员级别访问和权限才能完成的高级工作

<!-- 
## Release Manager Associates

Release Manager Associates are apprentices to the Release Managers, formerly
referred to as Release Manager shadows. They are responsible for:

- Patch release work, cherry pick review
- Contributing to k/release: updating dependencies and getting used to the
  source codebase
- Contributing to the documentation: maintaining the handbooks, ensuring that
  release processes are documented
- With help from a release manager: working with the Release Team during the
  release cycle and cutting Kubernetes releases
- Seeking opportunities to help with prioritization and communication
  - Sending out pre-announcements and updates about patch releases
  - Updating the calendar, helping with the release dates and milestones from
    the [release cycle timeline][k-sig-release-releases]
- Through the Buddy program, onboarding new contributors and pairing up with
  them on tasks

GitHub Mentions: @kubernetes/release-engineering
-->
## 发布管理员助理  {#release-manager-associates}

发布管理员助理是发布管理员的学徒，以前称为发布管理员影子。他们负责：

- 补丁发布工作，Cherry Pick 审查
- 为 kubernetes/release 做贡献：更新依赖并习惯源代码库
- 为文档做贡献：维护手册，确保发布过程记录在案
- 在发布管理员的帮助下：在发布周期中与发布团队合作并减少 Kubernetes 发型版本
- 寻求机会帮助确定优先级和沟通
   - 发送有关补丁发布的预告和更新
   - 更新日历，帮助确定[发布周期时间线][k-sig-release-releases]中的发布日期和里程碑
- 通过 Buddy 计划，加入新的贡献者并与他们合作完成任务

GitHub 提及：@kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski([@salaxander](https://github.com/salaxander))

<!-- 
### Becoming a Release Manager Associate

Contributors can become Associates by demonstrating the following:

- consistent participation, including 6-12 months of active release
  engineering-related work
- experience fulfilling a technical lead role on the Release Team during a
  release cycle
  - this experience provides a solid baseline for understanding how SIG Release
    works overall—including our expectations regarding technical skills,
    communications/responsiveness, and reliability
- working on k/release items that improve our interactions with Testgrid,
  cleaning up libraries, etc.
  - these efforts require interacting and pairing with Release Managers and
    Associates
-->
### 成为发布管理员助理  {#becoming-a-release-manager-associate}

贡献者可以通过展示以下内容成为助理：

- 持续参与，包括 6-12 个月的发布工程相关的积极工作
- 在发布周期内担任发布团队的技术负责人角色的经验
   - 这种经验为理解 SIG Release 如何整体运作提供了坚实的基础——包括我们对技术技能、沟通、响应能力和可靠性的期望
- 致力于改进我们与 Testgrid 交互的 kubernetes/release 项目，清理仓库等。
   - 这些工作需要与发布管理员和助理进行互动和合作

<!-- 
## SIG Release Leads

SIG Release Chairs and Technical Leads are responsible for:

- The governance of SIG Release
- Leading knowledge exchange sessions for Release Managers and Associates
- Coaching on leadership and prioritization

They are mentioned explicitly here as they are owners of the various
communications channels and permissions groups (GitHub teams, GCP access) for
each role. As such, they are highly privileged community members and privy to
some private communications, which can at times relate to Kubernetes security
disclosures.

GitHub team: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)
-->
## SIG Release 负责人  {#sig-release-leads}

SIG Release 主席和技术负责人负责：

- SIG Release 的治理
- 领导发布管理员和助理的知识交流会议
- 传授领导力和优先排序方法

之所以此处明确提及他们，是因为他们是每个角色的各种沟通渠道和权限组（GitHub 团队、GCP 访问）的所有者。
因此，他们是享有很高特权的社区成员，并参与了一些私人沟通，这些沟通有时可能与 Kubernetes 安全披露有关。

GitHub 团队：[@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

<!-- 
### Chairs
-->
### 主席  {#chairs}

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

<!-- 
### Technical Leads
-->
### 技术负责人  {#technical-leads}

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

<!-- 
Past Branch Managers, can be found in the [releases directory][k-sig-release-releases]
of the kubernetes/sig-release repository within `release-x.y/release_team.md`.

Example: [1.15 Release Team](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)
-->
有关以往的分支管理员，可以在 `release-x.y/release_team.md`
中 kubernetes/sig-release 仓库的[发布目录][k-sig-release-releases]中找到。

例如：[1.15 发布团队](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
<!--
[patches]: /releases/patch-releases/
-->
[patches]: /zh-cn/releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md
