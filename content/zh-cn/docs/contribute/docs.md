---
content_type: concept
title: 为 Kubernetes 文档出一份力
weight: 09
card:
  name: contribute
  weight: 11
  title: 为文档做出贡献
---

<!--
content_type: concept
title: Contribute to Kubernetes Documentation
weight: 09
card:
  name: contribute
  weight: 11
  title: Contribute to documentation
-->

<!--
This website is maintained by [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs).
The Kubernetes project welcomes help from all contributors, new or experienced!

Kubernetes documentation contributors:

- Improve existing content
- Create new content
- Translate the documentation
- Manage and publish the documentation parts of the Kubernetes release cycle
-->
本网站由 [Kubernetes SIG Docs](/zh-cn/docs/contribute/#get-involved-with-SIG-Docs)（文档特别兴趣小组）维护。
Kubernetes 项目欢迎所有贡献者（无论是新手还是经验丰富的贡献者）提供帮助！

Kubernetes 文档项目的贡献者：

- 改进现有内容
- 创建新内容
- 翻译文档
- 管理并发布 Kubernetes 周期性发行版的文档

---

{{< note >}}
<!--
To learn more about contributing to Kubernetes in general, see the general
[contributor documentation](https://www.kubernetes.dev/docs/) site.
-->
要了解有关为 Kubernetes 做出贡献的更多信息，
请参阅[贡献者文档](https://www.kubernetes.dev/docs/)。
{{< /note >}}

<!-- body -->

<!--
## Getting started

Anyone can open an issue about documentation, or contribute a change with a
pull request (PR) to the
[`kubernetes/website` GitHub repository](https://github.com/kubernetes/website).
You need to be comfortable with
[git](https://git-scm.com/) and
[GitHub](https://skills.github.com/)
to work effectively in the Kubernetes community.
-->
## 入门 {#getting-started}

任何人都可以提出文档方面的问题（issue），或贡献一个变更，用拉取请求（PR）的方式提交到
[GitHub 上的 `kubernetes/website` 仓库](https://github.com/kubernetes/website)。
当然你需要熟练使用 [git](https://git-scm.com/) 和 [GitHub](https://lab.github.com/)
才能在 Kubernetes 社区中有效工作。

<!--
To get involved with documentation:

1. Sign the CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md).
2. Familiarize yourself with the [documentation repository](https://github.com/kubernetes/website)
   and the website's [static site generator](https://gohugo.io).
3. Make sure you understand the basic processes for
   [opening a pull request](/docs/contribute/new-content/open-a-pr/) and
   [reviewing changes](/docs/contribute/review/reviewing-prs/).
-->
如何参与文档编制：

1. 签署 CNCF 的[贡献者许可协议](https://github.com/kubernetes/community/blob/master/CLA.md)。
2. 熟悉[文档仓库](https://github.com/kubernetes/website)和网站的[静态站点生成器](https://gohugo.io)。
3. 确保理解[发起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)
   和[审查变更](/zh-cn/docs/contribute/review/reviewing-prs/)的基本流程。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[发起 PR]
direction TB
U[ ] -.-
Q[改进现有内容] --- N[创建新内容]
N --- O[翻译文档]
O --- P[管理并发布 K8s<br>周期性发行版的文档]

end

subgraph second[评审]
direction TB
   T[ ] -.-
   D[仔细查看<br>kubernetes/website<br>仓库] --- E[下载安装 Hugo<br>静态站点<br>生成器]
   E --- F[了解基本的<br>GitHub 命令]
   F --- G[评审待处理的 PR<br>并遵从变更审查<br>流程]
end

subgraph first[注册]
    direction TB
    S[ ] -.-
    B[签署 CNCF<br>贡献者<br>许可协议] --- C[加入 sig-docs<br>Slack 频道] 
    C --- V[加入 kubernetes-sig-docs<br>邮件列表]
    V --- M[参加每周的<br>sig-docs 电话会议<br>或 slack 会议]
end

A([fa:fa-user 新的<br>贡献者]) --> first
A --> second
A --> third
A --> H[提出问题!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}

<!--
Figure 1. Getting started for a new contributor.

Figure 1 outlines a roadmap for new contributors. You can follow some or all of
the steps for `Sign up` and `Review`. Now you are ready to open PRs that achieve
your contribution objectives with some listed under `Open PR`. Again, questions
are always welcome!
-->
图 1. 新手入门指示。

图 1 概述了新贡献者的路线图。
你可以遵从“注册”和“评审”所述的某些或全部步骤。
至此，你完成了发起 PR 的准备工作，
可以通过“发起 PR” 列出的事项实现你的贡献目标。
再次重申，欢迎随时提出问题！

<!-- 
Some tasks require more trust and more access in the Kubernetes organization.
See [Participating in SIG Docs](/docs/contribute/participate/) for more details about
roles and permissions.
-->
有些任务要求 Kubernetes 组织内更高的信任级别和访问权限。
阅读[参与 SIG Docs 工作](/zh-cn/docs/contribute/participate/)，获取角色和权限的更多细节。

<!--
## Your first contribution

You can prepare for your first contribution by reviewing several steps beforehand.
Figure 2 outlines the steps and the details follow. 
-->
## 第一次贡献 {#your-first-contribution}

你可以提前查阅几个步骤，来准备你的第一次贡献。
图 2 概述了后续的步骤和细节。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[第一次贡献]
    direction TB
    S[ ] -.-
    G[查阅其他 K8s<br>成员发起的 PR] -->
    A[检索 kubernetes/website<br>问题列表是否有<br>good first 一类的 PR] --> B[发起一个 PR!!]
    end
    subgraph first[建议的准备工作]
    direction TB
       T[ ] -.-
       D[阅读贡献概述] -->E[阅读 K8s 内容<br>和风格指南]
       E --> F[了解 Hugo 页面<br>内容类型<br>和短代码]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

<!-- 
Figure 2. Preparation for your first contribution.
-->
图 2. 第一次贡献的准备工作。

<!--
- Read the [Contribution overview](/docs/contribute/new-content/) to
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
- 通读[贡献概述](/zh-cn/docs/contribute/new-content/)，了解参与贡献的不同方式。
- 查看 [`kubernetes/website` 问题列表](https://github.com/kubernetes/website/issues/)，
  检索最适合作为切入点的问题。
- 在现有文档上，[使用 GitHub 提交 PR](/zh-cn/docs/contribute/new-content/open-a-pr/#changes-using-github)，
  掌握在 GitHub 上登记 Issue 的方法。
- Kubernetes 社区其他成员会[评审 PR](/zh-cn/docs/contribute/review/reviewing-prs/)，
  以确保文档精准和语言流畅。
- 阅读 kubernetes 的[内容指南](/zh-cn/docs/contribute/style/content-guide/)和
  [风格指南](/zh-cn/docs/contribute/style/style-guide/)，以发表有见地的评论。
- 了解[页面内容类型](/zh-cn/docs/contribute/style/page-content-types/)和
  [Hugo 短代码](/zh-cn/docs/contribute/style/hugo-shortcodes/)。

<!--
## Getting help when contributing

Making your first contribution can be overwhelming. The
[New Contributor Ambassadors](https://github.com/kubernetes/website#new-contributor-ambassadors)
are there to walk you through making your first few contributions. You can reach out to them in the
[Kubernetes Slack](https://slack.k8s.io/) preferably in the `#sig-docs` channel. There is also the
[New Contributors Meet and Greet call](https://www.kubernetes.dev/resources/calendar/)
that happens on the first Tuesday of every month. You can interact with the New Contributor Ambassadors
and get your queries resolved here.
-->
## 贡献时获取帮助

做出第一个贡献可能会让人感觉比较困难。
[新贡献者大使](https://github.com/kubernetes/website#new-contributor-ambassadors)
将引导你完成最初的一些贡献。你可以在 [Kubernetes Slack](https://slack.k8s.io/)
中联系他们，最好是在 `#sig-docs` 频道中。还有每月第一个星期二举行的
[新贡献者见面会](https://www.kubernetes.dev/resources/calendar/)，
你可以在此处与新贡献者大使互动并解决你的疑问。

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

- 学习在仓库的[本地克隆中工作](/zh-cn/docs/contribute/new-content/open-a-pr/#fork-the-repo)。
- 为[发行版的特性](/zh-cn/docs/contribute/new-content/new-features/)编写文档。
- 加入 [SIG Docs](/zh-cn/docs/contribute/participate/)，
  并成为[成员或评审者](/zh-cn/docs/contribute/participate/roles-and-responsibilities/)。
- 开始或帮助[本地化](/zh-cn/docs/contribute/localization/)工作。

<!-- 
## Get involved with SIG Docs

[SIG Docs](/docs/contribute/participate/) is the group of contributors who
publish and maintain Kubernetes documentation and the website. Getting
involved with SIG Docs is a great way for Kubernetes contributors (feature
development or otherwise) to have a large impact on the Kubernetes project.

SIG Docs communicates with different methods:
-->
## 参与 SIG Docs 工作 {#get-involved-with-SIG-Docs}

[SIG Docs](/zh-cn/docs/contribute/participate/) 是负责发布、维护 Kubernetes 文档的贡献者团体。
参与 SIG Docs 是 Kubernetes 贡献者（开发者和其他人员）对 Kubernetes 项目产生重大影响力的好方式。

SIG Docs 的几种沟通方式：

<!--
- [Join `#sig-docs` on the Kubernetes Slack instance](https://slack.k8s.io/). Make sure to
  introduce yourself!
- [Join the `kubernetes-sig-docs` mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  where broader discussions take place and official decisions are recorded.
- Join the [SIG Docs video meeting](https://github.com/kubernetes/community/tree/master/sig-docs)
  held every two weeks. Meetings are always announced on `#sig-docs` and added to the
  [Kubernetes community meetings calendar](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
  You'll need to download the [Zoom client](https://zoom.us/download) or dial in using a phone.
- Join the SIG Docs async Slack standup meeting on those weeks when the in-person Zoom
  video meeting does not take place. Meetings are always announced on `#sig-docs`.
  You can contribute to any one of the threads up to 24 hours after meeting announcement. 
-->
- [加入 Kubernetes 在 Slack 上的 `#sig-docs` 频道](https://slack.k8s.io/)。
  一定记得自我介绍!
- [加入 `kubernetes-sig-docs` 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)，
  这里有更广泛的讨论，和官方决策的记录。
- 参加每两周召开一次的 [SIG Docs 视频会议](https://github.com/kubernetes/community/tree/master/sig-docs)。
  会议总是在 `#sig-docs` 上发出公告，同时添加到
  [Kubernetes 社区会议日历](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles)。
  你需要下载 [Zoom 客户端软件](https://zoom.us/download)，或电话拨号接入。
- 如果有几周未召开实况 Zoom 视频会议，请参加 SIG Docs 异步 Slack 站会。
  会议总是在 `#sig-docs` 上发出公告。
  你可以在会议公告后 24 小时内为其中任一议题做贡献。

<!--
## Other ways to contribute

- Visit the [Kubernetes community site](/community/). Participate on Twitter or Stack Overflow,
  learn about local Kubernetes meetups and events, and more.
- Read the [contributor cheatsheet](https://www.kubernetes.dev/docs/contributor-cheatsheet/)
  to get involved with Kubernetes feature development.
- Visit the contributor site to learn more about [Kubernetes Contributors](https://www.kubernetes.dev/)
  and [additional contributor resources](https://www.kubernetes.dev/resources/).
- Submit a [blog post or case study](/docs/contribute/new-content/blogs-case-studies/).
-->
## 其他贡献方式 {#other-ways-to-contribute}

- 访问 [Kubernetes 社区网站](/zh-cn/community/)。
  参与 Twitter 或 Stack Overflow，了解当地的 Kubernetes 会议和活动等等。
- 阅读[贡献者备忘单](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet)，
  参与 Kubernetes 功能开发。
- 访问贡献者网站，进一步了解有关 [Kubernetes 贡献者](https://www.kubernetes.dev/)
  和[更多贡献者资源](https://www.kubernetes.dev/resources/)的信息。
- 提交一篇[博客文章或案例研究](/zh-cn/docs/contribute/new-content/blogs-case-studies/)。
