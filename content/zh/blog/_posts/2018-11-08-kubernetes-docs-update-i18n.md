<!--
---
layout: blog
title: 'Kubernetes Docs Updates, International Edition'
date: 2018-11-08
---
-->

---
layout：blog
title：「Kubernetes 文档更新，国际化版本」
date: 2018-11-08
---

<!--
**Author**: Zach Corleissen (Linux Foundation)
-->

**作者**：Zach Corleissen（Linux 基金会）

<!--
As a co-chair of SIG Docs, I'm excited to share that Kubernetes docs have a fully mature workflow for localization (l10n). 
-->

作为 SIG Docs 的联合主席，我很高兴 Kubernetes 文档有一个完全成熟的本地化（l10n）工作流。

<!--
## Abbreviations galore
-->

## 缩略语

<!--
L10n is an abbreviation for _localization_. 
-->

L10n 是 _localization_ 的缩略语。

<!--
I18n is an abbreviation for _internationalization_. 
-->

I18n 是 _internationalization_ 的缩略语。

<!--
I18n is [what you do](https://www.w3.org/International/questions/qa-i18n) to make l10n easier. L10n is a fuller, more comprehensive process than translation (_t9n_). 
-->

I18n 是[你做什么](https://www.w3.org/International/questions/qa-i18n)使 l10n 更容易。L10N 是一个比翻译（_t9n_）更全面的过程。

<!--
## Why localization matters
-->

## 为什么国际化很重要

<!--
The goal of SIG Docs is to make Kubernetes easier to use for as many people as possible.
-->

SIG Docs 的目标是使 Kubernetes 更容易为尽可能多的人使用。

<!--
One year ago, we looked at whether it was possible to host the output of a Chinese team working independently to translate the Kubernetes docs. After many conversations (including experts on OpenStack l10n), [much transformation](https://kubernetes.io/blog/2018/05/05/hugo-migration/), and [renewed commitment to easier localization](https://github.com/kubernetes/website/pull/10485), we realized that open source documentation is, like open source software, an ongoing exercise at the edges of what's possible. 
-->

一年前，我们研究了是否有可能组织一个独立工作的中国团队来翻译 Kubernetes 文档。经过多次交谈（包括 OpenStack l10n 方面的专家），[很大转变](https://kubernetes.io/blog/2018/05/05/hugo-migration/)，和[重新承诺更容易的本地化](https://github.com/kubernetes/website/pull/10485)，我们意识到开源文档和开源软件一样，在可能的边缘不断地努力。

<!--
Consolidating workflows, language labels, and team-level ownership may seem like simple improvements, but these features make l10n scalable for increasing numbers of l10n teams. While SIG Docs continues to iterate improvements, we've paid off a significant amount of technical debt and streamlined l10n in a single workflow. That's great for the future as well as the present.
-->

合并工作流、语言标签和团队级别的所有权看起来像是简单的改进，但是这些特性使 l10n 对于不断增加的 l10n 团队具有可伸缩性。随着 SIG Docs 继续迭代改进，我们为在单一工作流中简化本地化的工作付出了很多。这对未来和现在都是伟大的。

<!--
## Consolidated workflow
-->

## 合并工作流

<!--
Localization is now consolidated in the [kubernetes/website](https://github.com/kubernetes/website) repository. We've configured the Kubernetes CI/CD system, [Prow](https://github.com/kubernetes/test-infra/tree/master/prow), to handle automatic language label assignment as well as team-level PR review and approval.
-->

本地化现在合并在 [kubernetes/website](https://github.com/kubernetes/website) 仓库中。我们已经配置了 Kubernetes CI/CD 系统，[Prow](https://github.com/kubernetes/test-infra/tree/master/prow)，以处理自动语言标签分配以及团队级别的 PR 评审和批准。

<!--
### Language labels 
-->

### 语言标签

<!--
Prow automatically applies language labels based on file path. Thanks to SIG Docs contributor [June Yi](https://github.com/kubernetes/test-infra/pull/9835), folks can also manually assign language labels in pull request (PR) comments. For example, when left as a comment on an issue or PR, this command assigns the label `language/ko` (Korean).
-->

Prow 自动应用基于文件路径的语言标签。多亏 SIG Docs 的贡献者 [June Yi](https://github.com/kubernetes/test-infra/pull/9835)，人们也可以手动分配在拉请求（PR）语言标签的评论。例如，当对 issue 或 PR 进行评论时，该命令指定标签 `language/ko`（Korean）。

<!--
```
/language ko
```
-->

```
/language ko
```

<!--
These repo labels let reviewers filter for PRs and issues by language. For example, you can now filter the k/website dashboard for [PRs with Chinese content](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh).  
-->

这些仓库标签允许审稿人通过语言过滤 PR 和 issue。例如，现在可以过滤 k/web 仪表板中的[中文内容的 PR](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh)。

<!--
### Team review
-->

### 团队评审

<!--
L10n teams can now review and approve their own PRs. For example, review and approval permissions for English are [assigned in an OWNERS file](https://github.com/kubernetes/website/blob/master/content/en/OWNERS) in the top subfolder for English content. 
-->

L10N 团队现在可以评审和批准他们自己的 PR。例如，英语的审阅和批准权限在 [assigned in an OWNERS file](https://github.com/kubernetes/website/blob/master/content/en/OWNERS) 英语内容的顶层子目录中。

<!--
Adding `OWNERS` files to subdirectories lets localization teams review and approve changes without requiring a rubber stamp approval from reviewers who may lack fluency.
-->

将`OWNERS`文件添加到子目录可以让本地化团队评审和批准更改，而不需要外语不流利的审阅者的橡皮图章批准。

<!--
## What's next
-->

## 下一步

<!--
We're looking forward to the [doc sprint in Shanghai](https://kccncchina2018english.sched.com/event/HVb2/contributor-summit-doc-sprint-additional-registration-required) to serve as a resource for the Chinese l10n team.
-->

我们期待着 [doc sprint in Shanghai](https://kccncchina2018english.sched.com/event/HVb2/contributor-summit-doc-sprint-additional-registration-required) 作为中国 L10N 团队的资源。

<!--
We're excited to continue supporting the Japanese and Korean l10n teams, who are making excellent progress.
-->

我们很高兴继续支持日本和韩国的 L10N 队，他们取得了很大的进步。

<!--
If you're interested in localizing Kubernetes for your own language or region, check out our [guide to localizing Kubernetes docs](https://kubernetes.io/docs/contribute/localization/) and reach out to a [SIG Docs chair](https://github.com/kubernetes/community/tree/master/sig-docs#leadership) for support.
-->

如果您有兴趣为您自己的语言或区域本地化 Kubernetes，请参阅我们的 [Kubernetes 文档本地化指南](https://kubernetes.io/docs/contribute/localization/)，并联系 [SIG Docs 主席](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)以获得支持。

<!--
### Get involved with SIG Docs 
-->

### 参与 SIG Docs

<!--
If you're interested in Kubernetes documentation, come to a SIG Docs [weekly meeting](https://github.com/kubernetes/community/tree/master/sig-docs#meetings), or join [#sig-docs in Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/details/).
-->

如果您对 Kubernetes 文档感兴趣，可以参加 SIG Docs [每周会议](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)，或者加入[#sig-docs in Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/details/)。
