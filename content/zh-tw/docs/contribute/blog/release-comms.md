---
title: 發佈後溝通
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
Kubernetes 的**發佈溝通（Release Comms）** 團隊（隸屬於
[SIG Release](https://github.com/kubernetes/community/tree/master/sig-release)）
負責管理發佈相關的公告，這些公告會發布在[主項目博客](/docs/contribute/blog/#main-blog)上。

每次發佈之後，發佈溝通團隊會在一段時間內接管主博客，併發布一系列額外的文章，
用於解釋或宣佈與該版本相關的變更。這些額外的文章被稱爲**發佈後溝通（Post-release comms）**。

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
## 參與發佈後溝通 {#opt-in}

在一個發佈週期中，作爲貢獻者，你可以選擇參與關於 Kubernetes
即將發生的變更的發佈後溝通。

要選擇參與，你需要針對 [k/website](https://github.com/kubernetes/website)
提交一個草稿形式的**佔位**[拉取請求（PR）](https://www.k8s.dev/docs/guide/pull-requests/)。
最初，這可以是一個空提交。在佔位 PR 的描述中，請提及相關的 KEP（Kubernetes Enhancement Proposal）
問題或其他 Kubernetes 改進相關的問題。

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
當你提交**草稿**拉取請求時，需要以 **main** 作爲基礎分支，
而不是針對 `dev-{{< skew nextMinorVersion >}}` 分支。
這與即將發佈的變更和新功能的[流程](/zh-cn/docs/contribute/new-content/new-features/#open-a-placeholder-pr)不同。

你還應在相關的 [kubernetes/enhancements](https://github.com/kubernetes/enhancements)
問題下留下評論，並附上拉取請求的鏈接，以通知負責本次發佈的發佈溝通團隊。
你的評論有助於團隊瞭解該變更需要發佈公告，並確認你的 SIG 已選擇參與。

除此之外，理想情況下，你還應通過 Slack（頻道
[`#release-comms`](https://kubernetes.slack.com/archives/CNT9Y603D)）
聯繫發佈溝通團隊，告知他們你已完成上述操作並希望選擇參與。

<!--
## Preparing the article content {#preparation}

You should follow the usual [article submission](/docs/contribute/blog/article-submission/)
process to turn your placeholder PR into something ready for review. However, for
post-release comms, you may not have a _writing buddy_; instead, the Release Comms team
may assign a member of the team to help guide what you're doing.
-->
## 準備文章內容 {#preparation}

你應該遵循常規的[文章提交](/zh-cn/docs/contribute/blog/article-submission/)流程，
將你的佔位 PR 轉變爲可供評審的內容。然而，對於發佈後溝通，
你可能不會有一個**寫作夥伴**；取而代之的是，發佈溝通團隊可能會指派一名成員來幫助指導你的工作。

<!--
You should [squash](https://www.k8s.dev/docs/guide/pull-requests/#squashing) the commits
in your pull request; if you're not sure how to, it's absolutely OK to ask Release Comms or
the blog team for help.

Provided that your article is flagged as a draft (`draft: true`) in the
[front matter](https://gohugo.io/content-management/front-matter/), the PR can merge at any
time during the release cycle.
-->
你應該[壓縮](https://www.k8s.dev/docs/guide/pull-requests/#squashing)拉取請求中的提交；
如果你不確定如何操作，完全可以向發佈溝通團隊或博客團隊尋求幫助。

只要你的文章在[前言](https://gohugo.io/content-management/front-matter/)中被標記爲草稿（`draft: true`），
該 PR 就可以在發佈週期的任何時間合併。

<!--
## Publication

Ahead of the actual release, the Release Comms team check what content is ready (if it's
not ready by the deadline, and you didn't get an exception, then the announcement won't
be included). They build a schedule for the articles that will go out and open new
pull requests to turn those articles from draft to published.
-->
## 發佈

在實際發佈之前，發佈溝通團隊會檢查哪些內容已經準備就緒
（如果到了截止日期仍未準備好，且你沒有獲得豁免，那麼公告將不會被收錄）。
他們爲即將發佈的文章制定時間表，並開啓新的拉取請求，將這些文章從草稿轉爲已發佈。
以將這些文章從草稿狀態變爲已發佈狀態。

{{< caution >}}
<!--
All these pull requests to actually publish post-release articles **must** be held
(Prow command `/hold`) until the release has actually happened.
-->
所有用於實際發佈發佈後文章的拉取請求**必須**被暫停（Prow 命令 `/hold`），
直到發佈實際完成爲止。
{{< /caution >}}

<!--
The blog team approvers still provide final sign off on promoting the content from draft
to accepted for publication. Ahead of release day, the PR (or PRs) for publishing these
announcements should have LGTM (“looks good to me”) and approved labels, along with the
**do-not-merge/hold** label to ensure the PR doesn't merge too early.
-->
博客團隊的批准者仍然需要對從草稿到可發佈的內容提供最終的簽字批准。
在發佈日前，用於發佈這些公告的拉取請求（PR）應已獲得 LGTM（“我覺得不錯”）
和批准標籤，同時還需要添加 **do-not-merge/hold** 標籤，以確保 PR 不會過早合併。

<!--
Release Comms / the Release Team can then _unhold_ that PR (or set of PRs) as soon as the
website Git repository is unfrozen after the actual release.

On the day each article is scheduled to publish, automation triggers a website build and that
article becomes visible.
-->
一旦實際發佈完成並且網站 Git 倉庫解凍，發佈溝通團隊或發佈團隊可以立即**取消保留** PR（或一組 PR）
PR（或一組 PR）的 **hold** 狀態。

在每篇文章預定發佈的當天，自動化流程將觸發網站構建，該文章將會變成可見。
