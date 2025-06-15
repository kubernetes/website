---
title: 发布后沟通
content_type: concept
weight: 60
---
<!--
title: Post-release communications
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
The Kubernetes _Release Comms_ team (part of
[SIG Release](https://github.com/kubernetes/community/tree/master/sig-release))
looks after release announcements, which go onto the
[main project blog](/docs/contribute/blog/#main-blog).

After each release, the Release Comms team take over the main blog for a period
and publish a series of additional articles to explain or announce changes related to
that release. These additional articles are termed _post-release comms_.
-->
Kubernetes 的**发布沟通（Release Comms）** 团队（隶属于
[SIG Release](https://github.com/kubernetes/community/tree/master/sig-release)）
负责管理发布相关的公告，这些公告会发布在[主项目博客](/docs/contribute/blog/#main-blog)上。

每次发布之后，发布沟通团队会在一段时间内接管主博客，并发布一系列额外的文章，
用于解释或宣布与该版本相关的变更。这些额外的文章被称为**发布后沟通（Post-release comms）**。

<!-- body -->

<!--
## Opting in to post-release comms {#opt-in}

During a release cycle, as a contributor, you can opt in to post-release comms about an
upcoming change to Kubernetes.

To opt in you open a draft, _placeholder_ [pull request](https://www.k8s.dev/docs/guide/pull-requests/) (PR)
against [k/website](https://github.com/kubernetes/website). Initially, this can be an
empty commit. Mention the KEP issue or other Kubernetes improvement issue in the description
of your placeholder PR.
-->
## 参与发布后沟通 {#opt-in}

在一个发布周期中，作为贡献者，你可以选择参与关于 Kubernetes
即将发生的变更的发布后沟通。

要选择参与，你需要针对 [k/website](https://github.com/kubernetes/website)
提交一个草稿形式的**占位**[拉取请求（PR）](https://www.k8s.dev/docs/guide/pull-requests/)。
最初，这可以是一个空提交。在占位 PR 的描述中，请提及相关的 KEP（Kubernetes Enhancement Proposal）
问题或其他 Kubernetes 改进相关的问题。

<!--
When you open the **draft** pull request, you open it against _main_ as the base branch
and not against the `dev-{{< skew nextMinorVersion >}}` branch. This is different from
the [process](/docs/contribute/new-content/new-features/#open-a-placeholder-pr) for upcoming release changes and new features.

You should also leave a comment on the related [kubernetes/enhancements](https://github.com/kubernetes/enhancements)
issue with a link to the PR to notify the Release Comms team managing this release. Your comment
helps the team see that the change needs announcing and that your SIG has opted in.

As well as the above, you should ideally contact the Release Comms team via Slack
(channel [`#release-comms`](https://kubernetes.slack.com/archives/CNT9Y603D)) to let them
know that you have done this and would like to opt in.
-->
当你提交**草稿**拉取请求时，需要以 **main** 作为基础分支，
而不是针对 `dev-{{< skew nextMinorVersion >}}` 分支。
这与即将发布的变更和新功能的[流程](/zh-cn/docs/contribute/new-content/new-features/#open-a-placeholder-pr)不同。

你还应在相关的 [kubernetes/enhancements](https://github.com/kubernetes/enhancements)
问题下留下评论，并附上拉取请求的链接，以通知负责本次发布的发布沟通团队。
你的评论有助于团队了解该变更需要发布公告，并确认你的 SIG 已选择参与。

除此之外，理想情况下，你还应通过 Slack（频道
[`#release-comms`](https://kubernetes.slack.com/archives/CNT9Y603D)）
联系发布沟通团队，告知他们你已完成上述操作并希望选择参与。

<!--
## Preparing the article content {#preparation}

You should follow the usual [article submission](/docs/contribute/blog/article-submission/)
process to turn your placeholder PR into something ready for review. However, for
post-release comms, you may not have a _writing buddy_; instead, the Release Comms team
may assign a member of the team to help guide what you're doing.
-->
## 准备文章内容 {#preparation}

你应该遵循常规的[文章提交](/zh-cn/docs/contribute/blog/article-submission/)流程，
将你的占位 PR 转变为可供评审的内容。然而，对于发布后沟通，
你可能不会有一个**写作伙伴**；取而代之的是，发布沟通团队可能会指派一名成员来帮助指导你的工作。

<!--
You should [squash](https://www.k8s.dev/docs/guide/pull-requests/#squashing) the commits
in your pull request; if you're not sure how to, it's absolutely OK to ask Release Comms or
the blog team for help.

Provided that your article is flagged as a draft (`draft: true`) in the
[front matter](https://gohugo.io/content-management/front-matter/), the PR can merge at any
time during the release cycle.
-->
你应该[压缩](https://www.k8s.dev/docs/guide/pull-requests/#squashing)拉取请求中的提交；
如果你不确定如何操作，完全可以向发布沟通团队或博客团队寻求帮助。

只要你的文章在[前言](https://gohugo.io/content-management/front-matter/)中被标记为草稿（`draft: true`），
该 PR 就可以在发布周期的任何时间合并。

<!--
## Publication

Ahead of the actual release, the Release Comms team check what content is ready (if it's
not ready by the deadline, and you didn't get an exception, then the announcement won't
be included). They build a schedule for the articles that will go out and open new
pull requests to turn those articles from draft to published.
-->
## 发布

在实际发布之前，发布沟通团队会检查哪些内容已经准备就绪
（如果到了截止日期仍未准备好，且你没有获得豁免，那么公告将不会被收录）。
他们为即将发布的文章制定时间表，并开启新的拉取请求，将这些文章从草稿转为已发布。
以将这些文章从草稿状态变为已发布状态。

{{< caution >}}
<!--
All these pull requests to actually publish post-release articles **must** be held
(Prow command `/hold`) until the release has actually happened.
-->
所有用于实际发布发布后文章的拉取请求**必须**被暂停（Prow 命令 `/hold`），
直到发布实际完成为止。
{{< /caution >}}

<!--
The blog team approvers still provide final sign off on promoting the content from draft
to accepted for publication. Ahead of release day, the PR (or PRs) for publishing these
announcements should have LGTM (“looks good to me”) and approved labels, along with the
**do-not-merge/hold** label to ensure the PR doesn't merge too early.
-->
博客团队的批准者仍然需要对从草稿到可发布的内容提供最终的签字批准。
在发布日前，用于发布这些公告的拉取请求（PR）应已获得 LGTM（“我觉得不错”）
和批准标签，同时还需要添加 **do-not-merge/hold** 标签，以确保 PR 不会过早合并。

<!--
Release Comms / the Release Team can then _unhold_ that PR (or set of PRs) as soon as the
website Git repository is unfrozen after the actual release.

On the day each article is scheduled to publish, automation triggers a website build and that
article becomes visible.
-->
一旦实际发布完成并且网站 Git 仓库解冻，发布沟通团队或发布团队可以立即**取消保留** PR（或一组 PR）
PR（或一组 PR）的 **hold** 状态。

在每篇文章预定发布的当天，自动化流程将触发网站构建，该文章将会变成可见。
