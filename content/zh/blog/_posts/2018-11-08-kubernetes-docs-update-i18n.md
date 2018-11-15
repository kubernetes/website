---
layout: blog
title: 'Kubernetes Docs Updates, International Edition'
date: 2018-11-08
---

**Author**: Zach Corleissen (Linux Foundation)

作为SIG Docs的联合主席，我很高兴地Kubernetes文档有一个完全成熟的本地化(l10n)工作流。

## 缩略语

L10n是_localization_的缩略语。

I18n是_internationalization_的缩略语。

I18n是["你做什么"](https://www.w3.org/International/questions/qa-i18n)使l10n更容易。L10N是一个比翻译(_t9n_)更全面的过程。

## 为什么国际化很重要

SIG Docs的目标是使Kubernetes更容易为尽可能多的人使用。

一年前，我们考察了是否有可能主持一个独立翻译Kubernetes文档的中国团队的输出。经过多次交谈（包括OpenStack l10n方面的专家），[很大转变](https://kubernetes.io/blog/2018/05/05/hugo-migration/)，和[重新承诺更容易的本地化](https://github.com/kubernetes/website/pull/10485)，我们意识到开源文档和开放文档一样，在可能的边缘不断地努力。

合并工作流、语言标签和团队级别的所有权看起来像是简单的改进，但是这些特性使l10n对于不断增加的l10n团队具有可伸缩性。随着SIG Docs继续迭代改进，我们为在单一工作流程中简化本地化的工作付出了很多。这对未来和现在都是伟大的。

## 合并工作流

本地化现在合并在[kubernetes/website](https://github.com/kubernetes/website)仓库中。我们已经配置了Kubernetes CI/CD系统，[Prow](https://github.com/kubernetes/test-infra/tree/master/prow)，以处理自动语言标签分配以及团队级别的PR审查和批准。

### 语言标签

Prow自动应用基于文件路径的语言标签。多亏SIG Docs的贡献者[June Yi](https://github.com/kubernetes/test-infra/pull/9835)，人们也可以手动分配在拉请求语言标签(PR)的评论。例如，当对问题或PR进行评论时，该命令指定标签 `language/ko` (Korean)。


```
/language ko
```
 
这些仓库标签允许审稿人通过语言过滤PR和问题。例如，现在可以过滤k/web仪表板中的[PRs with Chinese content](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh)。

### 团队审查

L10N团队现在可以审查和批准他们自己的PR。例如，英语的审阅和批准权限在[assigned in an OWNERS file](https://github.com/kubernetes/website/blob/master/content/en/OWNERS)英语内容的顶级子目录中。

将`OWNERS`文件添加到子目录可以让本地化团队审查和批准更改，而不需要外语不流利的审阅者的橡皮图章批准。

## 下一步是什么

我们期待着[doc sprint in Shanghai](https://kccncchina2018english.sched.com/event/HVb2/contributor-summit-doc-sprint-additional-registration-required)作为中国L10N团队的资源。

我们很高兴继续支持日本和韩国的L10N队，他们取得了很大的进步。

如果您有兴趣为您自己的语言或区域本地化Kubernetes，请参阅我们的[guide to localizing Kubernetes docs](https://kubernetes.io/docs/contribute/localization/)，并联系到[SIG Docs chair](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)以获得支持。

### 参与SIG Docs

如果您对Kubernetes文档感兴趣，可以参加SIG文档[每周会议](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)，或者加入[#sig-docs in Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/details/)。
