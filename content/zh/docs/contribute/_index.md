---
content_type: concept
title: 贡献 Kubernetes 文档
linktitle: 贡献
main_menu: true
no_list: true
weight: 80
card:
  name: contribute
  weight: 10
  title: 开始贡献
---
<!--
---
content_type: concept
title: Contribute to Kubernetes docs
linktitle: Contribute
main_menu: true
no_list: true
weight: 80
card:
  name: contribute
  weight: 10
  title: Start contributing
---
-->

<!-- overview -->

<!--
This website is maintained by [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs).

Kubernetes documentation contributors:

- Improve existing content
- Create new content
- Translate the documentation
- Manage and publish the documentation parts of the Kubernetes release cycle

Kubernetes documentation welcomes improvements from all contributors, new and experienced!
-->

本网站由 [Kubernetes SIG（特别兴趣小组） Docs](/zh/docs/contribute/#get-involved-with-SIG-Docs) 维护.

Kubernetes 文档项目的贡献者:

- 改进现有内容
- 创建新内容
- 翻译文档
- 管理并发布 Kubernetes 周期性发行版的文档

Kubernetes 文档欢迎来自各方贡献者的改进，无论新手还是高手！

<!-- body -->

<!-- 
## Getting started

Anyone can open an issue about documentation, or contribute a change with a
pull request (PR) to the
[`kubernetes/website` GitHub repository](https://github.com/kubernetes/website).
You need to be comfortable with
[git](https://git-scm.com/) and
[GitHub](https://lab.github.com/)
to work effectively in the Kubernetes community.

To get involved with documentation:

1. Sign the CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md).
1. Familiarize yourself with the [documentation repository](https://github.com/kubernetes/website)
   and the website's [static site generator](https://gohugo.io).
1. Make sure you understand the basic processes for
   [opening a pull request](/docs/contribute/new-content/open-a-pr/) and
   [reviewing changes](/docs/contribute/review/reviewing-prs/).

Some tasks require more trust and more access in the Kubernetes organization.
See [Participating in SIG Docs](/docs/contribute/participate/) for more details about
roles and permissions.
-->
## 入门 {#getting-started}

任何人都可以提出文档方面的问题（issue），或贡献一个变更，用拉取请求（PR）的方式提交到
[GitHub 上的 `kubernetes/website` 仓库](https://github.com/kubernetes/website)。
当然你需要熟练使用 [git](https://git-scm.com/) 和 [GitHub](https://lab.github.com/) 才能在 Kubernetes 社区中有效工作。

参与文档编制:

1. 签署 CNCF 的[贡献者许可协议](https://github.com/kubernetes/community/blob/master/CLA.md)。
2. 熟悉[文档仓库](https://github.com/kubernetes/website)
   和网站的[静态站点生成器](https://gohugo.io)。
3. 确保理解
   [发起 PR](/zh/docs/contribute/new-content/open-a-pr/) 和
   [审查变更](/zh/docs/contribute/review/reviewing-prs/)的基本流程。

有些任务要求 Kubernetes 组织内更高的信任级别和访问权限。
阅读[参与 SIG Docs 工作](/zh/docs/contribute/participate/) ，获取角色和权限的更多细节。

<!--
## Your first contribution

- Read the [Contribution overview](/docs/contribute/new-content/overview/) to
  learn about the different ways you can contribute.
- Check [`kubernetes/website` issues list](https://github.com/kubernetes/website/issues/)
  for issues that make good entry points.
- [Open a pull request using GitHub](/docs/contribute/new-content/open-a-pr/#changes-using-github)
  to existing documentation and learn more about filing issues in GitHub.
- [Review pull requests](/docs/contribute/review/reviewing-prs/) from other
  Kubernetes community members for accuracy and language.
- Read the Kubernetes [content](/docs/contribute/style/content-guide/) and
  [style guides](/docs/contribute/style/style-guide/) so you can leave informed comments.
- Learn about [page content types](/docs/contribute/style/page-content-types/)
  and [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/).
-->
## 第一次贡献 {#your-first-contribution}

- 通读[贡献概述](/zh/docs/contribute/new-content/overview/)，了解参与贡献的不同方式。
- 查看[`kubernetes/website` 问题列表](https://github.com/kubernetes/website/issues/)
  ，检索最适合作为切入点的问题。
- 在现有文档上，
  [使用 GitHub 提交 PR ](/zh/docs/contribute/new-content/open-a-pr/#changes-using-github)，
  掌握在 GitHub 上登记 Issue 的方法。
- Kubernetes 社区其他成员会[评审 PR ](/zh/docs/contribute/review/reviewing-prs/)，
  以确保文档精准和语言流畅。
- 阅读 kubernetes 的[内容指南](/zh/docs/contribute/style/content-guide/)和
  [风格指南](/zh/docs/contribute/style/style-guide/)，以发表有见地的评论。
- 了解[页面内容类型](/zh/docs/contribute/style/page-content-types/)和 
  [Hugo 短代码](/zh/docs/contribute/style/hugo-shortcodes/)。

<!--
## Next steps

- Learn to [work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo)
  of the repository.
- Document [features in a release](/docs/contribute/new-content/new-features/).
- Participate in [SIG Docs](/docs/contribute/participate/), and become a
  [member or reviewer](/docs/contribute/participate/roles-and-responsibilities/).
                       
- Start or help with a [localization](/docs/contribute/localization/).
-->
## 下一步 {#next-teps}

- 学习在仓库的[本地克隆中工作](/zh/docs/contribute/new-content/open-a-pr/#fork-the-repo)。
- 为[发行版的特性](/zh/docs/contribute/new-content/new-features/)编写文档。
- 加入 [SIG Docs](/zh/docs/contribute/participate/), 并成为[成员或评审者](/zh/docs/contribute/participate/roles-and-responsibilities/)。
                       
- 开始或帮助[本地化](/zh/docs/contribute/localization/) 工作。

<!--
## Get involved with SIG Docs

[SIG Docs](/docs/contribute/participate/) is the group of contributors who
publish and maintain Kubernetes documentation and the website. Getting
involved with SIG Docs is a great way for Kubernetes contributors (feature
development or otherwise) to have a large impact on the Kubernetes project.

SIG Docs communicates with different methods:

- [Join `#sig-docs` on the Kubernetes Slack instance](https://slack.k8s.io/). Make sure to
  introduce yourself!
- [Join the `kubernetes-sig-docs` mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  where broader discussions take place and official decisions are recorded.
- Join the [weekly SIG Docs video meeting](https://github.com/kubernetes/community/tree/master/sig-docs). Meetings are always announced on `#sig-docs` and added to the [Kubernetes community meetings calendar](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles). You'll need to download the [Zoom client](https://zoom.us/download) or dial in using a phone.
-->
## 参与 SIG Docs 工作 {#get-involved-with-SIG-Docs}

[SIG Docs](/zh/docs/contribute/participate/) 是负责发布、维护 Kubernetes 文档的贡献者团体。
参与 SIG Docs 是 Kubernetes 贡献者（开发者和其他人员）对 Kubernetes 项目产生重大影响力的好方式。

SIG Docs 的几种沟通方式:

- [加入 Kubernetes 在 Slack 上的`#sig-docs` 频道](https://slack.k8s.io/)。
  一定记得自我介绍!
- [加入`kubernetes-sig-docs` 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  这里有更广泛的讨论，和官方决策的记录。
- 参加 [SIG Docs 的每周视频会议](https://github.com/kubernetes/community/tree/master/sig-docs)。会议总是在 `#sig-docs` 上宣告，同时添加到 
  [Kubernetes社区会议日历](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles)。
  你需要下载 [Zoom 客户端软件](https://zoom.us/download)，或电话拨号接入。

<!--
## Other ways to contribute

- Visit the [Kubernetes community site](/community/). Participate on Twitter or Stack Overflow, learn about local Kubernetes meetups and events, and more.
- Read the [contributor cheatsheet](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet) to get involved with Kubernetes feature development.
- Submit a [blog post or case study](/docs/contribute/new-content/blogs-case-studies/).
-->
## 其他贡献方式 {#other-ways-to-contribute}

- 访问 [Kubernetes 社区网站](/zh/community/)。 参与 Twitter 或 Stack Overflow, 了解 Kubernetes 当地的聚会和活动, 等等。
- 阅读[贡献者备忘单](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet)，参与 Kubernetes 功能开发。
- 提交一篇[博客文章或案例研究](/zh/docs/contribute/new-content/blogs-case-studies/)。
