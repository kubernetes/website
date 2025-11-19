---
layout: blog
title: 'Kubernetes 文檔更新，國際版'
date: 2018-11-08
slug: kubernetes-docs-updates-international-edition
---
<!--
layout: blog
title: 'Kubernetes Docs Updates, International Edition'
date: 2018-11-08
-->

<!-- **Author**: Zach Corleissen (Linux Foundation) -->
**作者**：Zach Corleissen （Linux 基金會）

<!-- As a co-chair of SIG Docs, I'm excited to share that Kubernetes docs have a fully mature workflow for localization (l10n).  -->
作爲文檔特別興趣小組（SIG Docs）的聯合主席，我很高興能與大家分享 Kubernetes 文檔在本地化（l10n）方面所擁有的一個完全成熟的工作流。

<!-- ## Abbreviations galore -->
## 豐富的縮寫

<!-- L10n is an abbreviation for _localization_. -->
L10n 是 _localization_ 的縮寫。

<!-- I18n is an abbreviation for _internationalization_.  -->
I18n 是 _internationalization_ 的縮寫。

<!-- I18n is [what you do](https://www.w3.org/International/questions/qa-i18n) to make l10n easier. L10n is a fuller, more comprehensive process than translation (_t9n_). -->
I18n 定義了[做什麼](https://www.w3.org/International/questions/qa-i18n) 能讓 l10n 更容易。而 L10n 更全面，相比翻譯（ _t9n_ ）具備更完善的流程。

<!-- ## Why localization matters -->
## 爲什麼本地化很重要

<!-- The goal of SIG Docs is to make Kubernetes easier to use for as many people as possible. -->
SIG Docs 的目標是讓 Kubernetes 更容易爲儘可能多的人使用。

<!-- One year ago, we looked at whether it was possible to host the output of a Chinese team working independently to translate the Kubernetes docs. After many conversations (including experts on OpenStack l10n), [much transformation](https://kubernetes.io/blog/2018/05/05/hugo-migration/), and [renewed commitment to easier localization](https://github.com/kubernetes/website/pull/10485), we realized that open source documentation is, like open source software, an ongoing exercise at the edges of what's possible. -->
一年前，我們研究了是否有可能由一個獨立翻譯 Kubernetes 文檔的中國團隊來主持文檔輸出。經過多次交談（包括 OpenStack l10n 的專家），[多次轉變](https://kubernetes.io/blog/2018/05/05/hugo-migration/)，以及[重新致力於更輕鬆的本地化](https://github.com/kubernetes/website/pull/10485)，我們意識到，開源文檔就像開源軟件一樣，是在可能的邊緣不斷進行實踐。

<!-- Consolidating workflows, language labels, and team-level ownership may seem like simple improvements, but these features make l10n scalable for increasing numbers of l10n teams. While SIG Docs continues to iterate improvements, we've paid off a significant amount of technical debt and streamlined l10n in a single workflow. That's great for the future as well as the present. -->
整合工作流程、語言標籤和團隊級所有權可能看起來像是十分簡單的改進，但是這些功能使 l10n 可以擴展到規模越來越大的 l10n 團隊。隨着 SIG Docs 不斷改進，我們已經在單一工作流程中償還了大量技術債務並簡化了 l10n。這對未來和現在都很有益。

<!-- ## Consolidated workflow -->
## 整合的工作流程

<!-- Localization is now consolidated in the [kubernetes/website](https://github.com/kubernetes/website) repository. We've configured the Kubernetes CI/CD system, [Prow](https://github.com/kubernetes/test-infra/tree/master/prow), to handle automatic language label assignment as well as team-level PR review and approval. -->
現在，本地化已整合到 [kubernetes/website](https://github.com/kubernetes/website) 存儲庫。我們已經配置了 Kubernetes CI/CD 系統，[Prow](https://github.com/kubernetes/test-infra/tree/master/prow) 來處理自動語言標籤分配以及團隊級 PR 審查和批准。

<!-- ### Language labels  -->
### 語言標籤

<!-- Prow automatically applies language labels based on file path. Thanks to SIG Docs contributor [June Yi](https://github.com/kubernetes/test-infra/pull/9835), folks can also manually assign language labels in pull request (PR) comments. For example, when left as a comment on an issue or PR, this command assigns the label `language/ko` (Korean). -->
Prow 根據文件路徑自動添加語言標籤。感謝 SIG Docs 貢獻者 [June Yi](https://github.com/kubernetes/test-infra/pull/9835)，他讓人們還可以在 pull request（PR）註釋中手動分配語言標籤。例如，當爲 issue 或 PR 留下下述註釋時，將爲之分配標籤 `language/ko`（Korean）。

```
/language ko
```


<!-- These repo labels let reviewers filter for PRs and issues by language. For example, you can now filter the kubernetes/website dashboard for [PRs with Chinese content](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh).   -->
這些存儲庫標籤允許審閱者按語言過濾 PR 和 issue。例如，您現在可以過濾 kubernetes/website 面板中[具有中文內容的 PR](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+label%3Alanguage%2Fzh)。

<!-- ### Team review  -->
### 團隊審覈

<!-- L10n teams can now review and approve their own PRs. For example, review and approval permissions for English are [assigned in an OWNERS file](https://github.com/kubernetes/website/blob/main/content/en/OWNERS) in the top subfolder for English content.  -->
L10n 團隊現在可以審查和批准他們自己的 PR。例如，英語的審覈和批准權限在位於用於顯示英語內容的頂級子文件夾中的 [OWNERS 文件中指定](https://github.com/kubernetes/website/blob/main/content/en/OWNERS)。

<!-- Adding `OWNERS` files to subdirectories lets localization teams review and approve changes without requiring a rubber stamp approval from reviewers who may lack fluency. -->
將 `OWNERS` 文件添加到子目錄可以讓本地化團隊審查和批准更改，而無需由可能並不擅長該門語言的審閱者進行批准。

<!-- ## What's next -->
## 下一步是什麼

<!-- We're looking forward to the [doc sprint in Shanghai](https://kccncchina2018english.sched.com/event/HVb2/contributor-summit-doc-sprint-additional-registration-required) to serve as a resource for the Chinese l10n team. -->
我們期待着[上海的 doc sprint](https://kccncchina2018english.sched.com/event/HVb2/contributor-summit-doc-sprint-additional-registration-required) 能作爲中國 l10n 團隊的資源。

<!-- We're excited to continue supporting the Japanese and Korean l10n teams, who are making excellent progress. -->
我們很高興繼續支持正在取得良好進展的日本和韓國 l10n 隊伍。

<!-- If you're interested in localizing Kubernetes for your own language or region, check out our [guide to localizing Kubernetes docs](https://kubernetes.io/docs/contribute/localization/) and reach out to a [SIG Docs chair](https://github.com/kubernetes/community/tree/master/sig-docs#leadership) for support. -->
如果您有興趣將 Kubernetes 本地化爲您自己的語言或地區，請查看我們的[本地化 Kubernetes 文檔指南](https://kubernetes.io/docs/contribute/localization/)，並聯系 [SIG Docs 主席團](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)獲取支持。

<!-- ### Get involved with SIG Docs  -->
### 加入SIG Docs

<!-- If you're interested in Kubernetes documentation, come to a SIG Docs [weekly meeting](https://github.com/kubernetes/community/tree/master/sig-docs#meetings), or join [#sig-docs in Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/details/). -->
如果您對 Kubernetes 文檔感興趣，請參加 SIG Docs [每週會議](https://github.com/kubernetes/community/tree/master/sig-docs#meetings)，或在 [Kubernetes Slack 加入 #sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/details/)。
