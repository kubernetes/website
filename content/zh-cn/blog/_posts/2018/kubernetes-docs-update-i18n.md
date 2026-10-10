---
layout: blog
title: 'Kubernetes 文档更新，国际版'
date: 2018-11-08
slug: kubernetes-docs-updates-international-edition
---
<!--
layout: blog
title: 'Kubernetes Docs Updates, International Edition'
date: 2018-11-08
-->

<!-- **Author**: Zach Corleissen (Linux Foundation) -->
**作者**：Zach Corleissen （Linux 基金会）

<!-- As a co-chair of SIG Docs, I'm excited to share that Kubernetes docs have a fully mature workflow for localization (l10n).  -->
作为文档特别兴趣小组（SIG Docs）的联合主席，我很高兴能与大家分享 Kubernetes 文档在本地化（l10n）方面所拥有的一个完全成熟的工作流。

<!-- ## Abbreviations galore -->
## 丰富的缩写

<!-- L10n is an abbreviation for _localization_. -->
L10n 是 _localization_ 的缩写。

<!-- I18n is an abbreviation for _internationalization_.  -->
I18n 是 _internationalization_ 的缩写。

<!-- I18n is [what you do](https://www.w3.org/International/questions/qa-i18n) to make l10n easier. L10n is a fuller, more comprehensive process than translation (_t9n_). -->
I18n 定义了[做什么](https://www.w3.org/International/questions/qa-i18n) 能让 l10n 更容易。而 L10n 更全面，相比翻译（ _t9n_ ）具备更完善的流程。

<!-- ## Why localization matters -->
## 为什么本地化很重要

<!-- The goal of SIG Docs is to make Kubernetes easier to use for as many people as possible. -->
SIG Docs 的目标是让 Kubernetes 更容易为尽可能多的人使用。

<!-- One year ago, we looked at whether it was possible to host the output of a Chinese team working independently to translate the Kubernetes docs. After many conversations (including experts on OpenStack l10n), [much transformation](https://kubernetes.io/blog/2018/05/05/hugo-migration/), and [renewed commitment to easier localization](https://github.com/kubernetes/website/pull/10485), we realized that open source documentation is, like open source software, an ongoing exercise at the edges of what's possible. -->
一年前，我们研究了是否有可能由一个独立翻译 Kubernetes 文档的中国团队来主持文档输出。经过多次交谈（包括 OpenStack l10n 的专家），[多次转变](https://kubernetes.io/blog/2018/05/05/hugo-migration/)，以及[重新致力于更轻松的本地化](https://github.com/kubernetes/website/pull/10485)，我们意识到，开源文档就像开源软件一样，是在可能的边缘不断进行实践。

<!-- Consolidating workflows, language labels, and team-level ownership may seem like simple improvements, but these features make l10n scalable for increasing numbers of l10n teams. While SIG Docs continues to iterate improvements, we've paid off a significant amount of technical debt and streamlined l10n in a single workflow. That's great for the future as well as the present. -->
整合工作流程、语言标签和团队级所有权可能看起来像是十分简单的改进，但是这些功能使 l10n 可以扩展到规模越来越大的 l10n 团队。随着 SIG Docs 不断改进，我们已经在单一工作流程中偿还了大量技术债务并简化了 l10n。这对未来和现在都很有益。

<!-- ## Consolidated workflow -->
## 整合的工作流程

<!-- Localization is now consolidated in the [kubernetes/website](https://github.com/kubernetes/website) repository. We've configured the Kubernetes CI/CD system, [Prow](https://github.com/kubernetes/test-infra/tree/master/prow), to handle automatic language label assignment as well as team-level PR review and approval. -->
现在，本地化已整合到 [kubernetes/website](https://github.com/kubernetes/website) 存储库。我们已经配置了 Kubernetes CI/CD 系统，[Prow](https://github.com/kubernetes/test-infra/tree/master/prow) 来处理自动语言标签分配以及团队级 PR 审查和批准。

<!-- ### Language labels  -->
### 语言标签

<!-- Prow automatically applies language labels based on file path. Thanks to SIG Docs contributor [June Yi](https://github.com/kubernetes/test-infra/pull/9835), folks can also manually assign language labels in pull request (PR) comments. For example, when left as a comment on an issue or PR, this command assigns the label `language/ko` (Korean). -->
Prow 根据文件路径自动添加语言标签。感谢 SIG Docs 贡献者 [June Yi](https://github.com/kubernetes/test-infra/pull/9835)，他让人们还可以在 pull request（PR）注释中手动分配语言标签。例如，当为 issue 或 PR 留下下述注释时，将为之分配标签 `language/ko`（Korean）。

```
/language ko
```


<!-- These repo labels let reviewers filter for PRs and issues by language. For example, you can now filter the kubernetes/website dashboard for [PRs with Chinese content](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh).   -->
这些存储库标签允许审阅者按语言过滤 PR 和 issue。例如，您现在可以过滤 kubernetes/website 面板中[具有中文内容的 PR](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh)。

<!-- ### Team review  -->
### 团队审核

<!-- L10n teams can now review and approve their own PRs. For example, review and approval permissions for English are [assigned in an OWNERS file](https://github.com/kubernetes/website/blob/main/content/en/OWNERS) in the top subfolder for English content.  -->
L10n 团队现在可以审查和批准他们自己的 PR。例如，英语的审核和批准权限在位于用于显示英语内容的顶级子文件夹中的 [OWNERS 文件中指定](https://github.com/kubernetes/website/blob/main/content/en/OWNERS)。

<!-- Adding `OWNERS` files to subdirectories lets localization teams review and approve changes without requiring a rubber stamp approval from reviewers who may lack fluency. -->
将 `OWNERS` 文件添加到子目录可以让本地化团队审查和批准更改，而无需由可能并不擅长该门语言的审阅者进行批准。

<!-- ## What's next -->
## 下一步是什么

<!-- We're looking forward to the [doc sprint in Shanghai](https://kccncchina2018english.sched.com/event/HVb2/contributor-summit-doc-sprint-additional-registration-required) to serve as a resource for the Chinese l10n team. -->
我们期待着[上海的 doc sprint](https://kccncchina2018english.sched.com/event/HVb2/contributor-summit-doc-sprint-additional-registration-required) 能作为中国 l10n 团队的资源。

<!-- We're excited to continue supporting the Japanese and Korean l10n teams, who are making excellent progress. -->
我们很高兴继续支持正在取得良好进展的日本和韩国 l10n 队伍。

<!-- If you're interested in localizing Kubernetes for your own language or region, check out our [guide to localizing Kubernetes docs](https://kubernetes.io/docs/contribute/localization/) and reach out to a [SIG Docs chair](https://github.com/kubernetes/community/tree/master/sig-docs#leadership) for support. -->
如果您有兴趣将 Kubernetes 本地化为您自己的语言或地区，请查看我们的[本地化 Kubernetes 文档指南](https://kubernetes.io/docs/contribute/localization/)，并联系 [SIG Docs 主席团](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)获取支持。

<!-- ### Get involved with SIG Docs  -->
### 加入SIG Docs

<!-- If you're interested in Kubernetes documentation, come to a SIG Docs [weekly meeting](https://github.com/kubernetes/community/tree/master/sig-docs#meetings), or join [#sig-docs in Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/details/). -->
如果您对 Kubernetes 文档感兴趣，请参加 SIG Docs [每周会议](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)，或在 [Kubernetes Slack 加入 #sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/details/)。
