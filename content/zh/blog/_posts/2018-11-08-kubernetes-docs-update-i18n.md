---
布局:博客
标题:“Kubernetes文档更新，国际版”
日期:2018-11-08
---
<!--
---

layout: blog

title: 'Kubernetes Docs Updates, International Edition'
date: 2018-11-08

---		
 -->

**作者:Zach Corleissen (Linux基金会)
<!-- 
**Author**: Zach Corleissen (Linux Foundation)
-->

作为SIG文档的联合主席，我很高兴与大家分享Kubernetes文档有一个完全成熟的本地化工作流(l10n)。
<!--
As a co-chair of SIG Docs, I'm excited to share that Kubernetes docs have a fully mature workflow for localization (l10n). 
-->

# #缩写的
<!--
## Abbreviations galore
-->

L10n是_localization_的缩写。
<!--
L10n is an abbreviation for _localization_.
-->

I18n是_internationalization_的缩写。
<!--
I18n is an abbreviation for _internationalization_. 
-->

I18n是[您所做的](https://www.w3.org/International/questions/qa-i18n)来简化l10n。L10n是一个比翻译更完整、更全面的过程(_t9n_)。
<!--
I18n is [what you do](https://www.w3.org/International/questions/qa-i18n) to make l10n easier. L10n is a fuller, more comprehensive process than translation (_t9n_). 
-->

为什么本地化很重要
<!--
## Why localization matters
-->

SIG文档的目标是让尽可能多的人更容易使用Kubernetes。
<!--
The goal of SIG Docs is to make Kubernetes easier to use for as many people as possible.
-->

一年前，我们研究了是否有可能由一个中国团队独立翻译Kubernetes文档。经过多次对话(包括OpenStack l10n方面的专家)、[大量转换](https://kubernetes.io/blog/2018/05/05/hugo-migration/)和[对更容易本地化的新承诺](https://github.com/kubernetes/website/pull/10485)，我们意识到开源文档就像开源软件一样，是一种不断进行的实践，处于可能实现的边缘。
<!--
One year ago, we looked at whether it was possible to host the output of a Chinese team working independently to translate the Kubernetes docs. After many conversations (including experts on OpenStack l10n), [much transformation](https://kubernetes.io/blog/2018/05/05/hugo-migration/), and [renewed commitment to easier localization](https://github.com/kubernetes/website/pull/10485), we realized that open source documentation is, like open source software, an ongoing exercise at the edges of what's possible. 
-->

合并工作流、语言标签和团队级别的所有权似乎是简单的改进，但是这些特性使l10n可伸缩，以适应越来越多的l10n团队。当SIG文档继续迭代改进时，我们已经在单个工作流中偿还了大量的技术债务并简化了l10n。这对现在和未来都很好。
<!--
Consolidating workflows, language labels, and team-level ownership may seem like simple improvements, but these features make l10n scalable for increasing numbers of l10n teams. While SIG Docs continues to iterate improvements, we've paid off a significant amount of technical debt and streamlined l10n in a single workflow. That's great for the future as well as the present.
-->

# #整合工作流程
<!--
## Consolidated workflow
-->

本地化现在合并到[kubernetes/website](https://github.com/kubernetes/website)存储库中。我们已经配置了Kubernetes CI/CD系统[Prow](https://github.com/kubernetes/testinfra/tree/master/prow)来处理自动语言标签分配以及团队级别的PR审查和批准。
<!--
Localization is now consolidated in the [kubernetes/website](https://github.com/kubernetes/website) repository. We've configured the Kubernetes CI/CD system, [Prow](https://github.com/kubernetes/test-infra/tree/master/prow), to handle automatic language label assignment as well as team-level PR review and approval.
-->

# # #语言标签
<!--
### Language labels 
-->

Prow根据文件路径自动应用语言标签。感谢SIG Docs的贡献者[June Yi](https://github.com/kubernetes/testinfra/pull/9835)，人们还可以在pull request (PR)注释中手动分配语言标签。例如，当作为对某个问题或PR的评论离开时，该命令将分配标签“language/ko”(朝鲜语)。
<!--
Prow automatically applies language labels based on file path. Thanks to SIG Docs contributor [June Yi](https://github.com/kubernetes/test-infra/pull/9835), folks can also manually assign language labels in pull request (PR) comments. For example, when left as a comment on an issue or PR, this command assigns the label `language/ko` (Korean).
-->

' ' '
/语言ko
' ' '
<!--
```

/language ko

```
-->

这些repo标签允许评审员通过语言过滤PRs和问题。例如，您现在可以在k/website指示板中过滤[包含中文内容的PRs](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh)。
<!--
These repo labels let reviewers filter for PRs and issues by language. For example, you can now filter the k/website dashboard for [PRs with Chinese content](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh). 
-->

# # #团队审查
<!--
### Team review
-->

L10n个团队现在可以审查和批准他们自己的PRs。例如，英语的审查和批准权限在英语内容的顶级子文件夹中[在所有者文件中分配](https://github.com/kubernetes/website/blob/master/content/en/OWNERS)。
<!--
L10n teams can now review and approve their own PRs. For example, review and approval permissions for English are [assigned in an OWNERS file](https://github.com/kubernetes/website/blob/master/content/en/OWNERS) in the top subfolder for English content. 
-->

向子目录中添加“所有者”文件可以让本地化团队审查和批准更改，而不需要缺乏流畅性的审阅人员的橡皮图章批准。
<!--
Adding `OWNERS` files to subdirectories lets localization teams review and approve changes without requiring a rubber stamp approval from reviewers who may lack fluency.
-->

# #是什么
<!--
## What's next
-->

我们期待[doc sprint in Shanghai](https://kccncchina2018english.sched.com/event/hvb2/contribut-summit-doc-sprint-additionregistrationrequired)成为中国l10n团队的资源。
<!--
We're looking forward to the [doc sprint in Shanghai](https://kccncchina2018english.sched.com/event/HVb2/contributor-summit-doc-sprint-additional-registration-required) to serve as a resource for the Chinese l10n team.
-->

我们很高兴能够继续支持日本和韩国的l10n球队，他们取得了巨大的进步。
<!--
We're excited to continue supporting the Japanese and Korean l10n teams, who are making excellent progress.
-->

如果您对本地化您自己的语言或地区的Kubernetes感兴趣，请查看我们的[本地化Kubernetes文档指南](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)以获得支持。
<!--
If you're interested in localizing Kubernetes for your own language or region, check out our [guide to localizing Kubernetes docs](https://kubernetes.io/docs/contribute/localization/) and reach out to a [SIG Docs chair](https://github.com/kubernetes/community/tree/master/sig-docs#leadership) for support.
-->

参与SIG文档
<!--
### Get involved with SIG Docs 
-->

如果您对Kubernetes文档感兴趣，可以参加SIG Docs [weekly meeting](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)，或者加入[#sig-docs in Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/details/)。
<!--
If you're interested in Kubernetes documentation, come to a SIG Docs [weekly meeting](https://github.com/kubernetes/community/tree/master/sig-docs#meetings), or join [#sig-docs in Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/details/).
-->