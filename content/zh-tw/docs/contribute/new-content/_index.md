---
title: 貢獻新內容
content_type: 概念
main_menu: true
weight: 25
simple_list: true # 針對 whatsnext 一節
---
<!-- 
title: Contributing new content
content_type: concept
main_menu: true
weight: 25
simple_list: true # for whatsnext section
-->

<!-- overview -->

<!-- 
This section contains information you should know before contributing new
content.

There are also dedicated pages about submitting [case studies](/docs/contribute/new-content/case-studies)
and [blog articles](/docs/contribute/blog/).
-->
本節包含你在貢獻新內容之前需要知曉的信息。

另請參閱如何提交[案例分析](/zh-cn/docs/contribute/new-content/case-studies)和[博客文章](/zh-cn/docs/contribute/blog/)的專門頁面。

<!-- body -->

<!--
## New content task flow
-->
## 新內容的任務流程   {#new-content-task-flow}

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR 
    subgraph second[開始之前]
    direction TB
    S[ ] -.-
    A[簽署 CNCF CLA] --> B[選擇 Git 分支]
    B --> C[每個 PR 一種語言]
    C --> F[檢查貢獻者工具]
    end
    subgraph first[基本知識]
    direction TB
       T[ ] -.-
       D[用 markdown 編寫文檔<br>並用 Hugo 構建網站] --- E[GitHub 源代碼]
       E --- G['/content/../docs' 文件夾包含<br>多語言文檔]
       G --- H[評審 Hugo 頁面內容<br>類型和短代碼]
    end
    

    first ----> second


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

<!--
***Figure - Contributing new content preparation***

The figure above depicts the information you should know
prior to submitting new content. The information details follow.
-->
**插圖 - 貢獻新內容準備工作**

上圖描述了你在提交新內容之前需要知曉的信息。
詳細信息見下文。

<!-- body -->
<!-- 
## Contributing basics

- Write Kubernetes documentation in Markdown and build the Kubernetes site
  using [Hugo](https://gohugo.io/).
- Kubernetes documentation uses [CommonMark](https://commonmark.org/) as its flavor of  Markdown. 
- The source is in [GitHub](https://github.com/kubernetes/website). You can find
  Kubernetes documentation at `/content/en/docs/`. Some of the reference
  documentation is automatically generated from scripts in
  the `update-imported-docs/` directory.
- [Page content types](/docs/contribute/style/page-content-types/) describe the
  presentation of documentation content in Hugo.
-->
## 基本知識   {#contributing-basics}

- 使用 Markdown 編寫 Kubernetes 文檔並使用 [Hugo](https://gohugo.io/) 構建網站。
- Kubernetes 文檔使用 [CommonMark](https://commonmark.org/) 作爲 Markdown 的風格。
- 源代碼位於 [GitHub](https://github.com/kubernetes/website) 倉庫中。
  你可以在 `/content/zh-cn/docs/` 目錄下找到 Kubernetes 文檔。
  某些參考文檔是使用位於 `update-imported-docs/` 目錄下的腳本自動生成的。
- [頁面內容類型](/zh-cn/docs/contribute/style/page-content-types/)使用 Hugo 描述文檔內容的呈現。

<!-- 
- You can use [Docsy shortcodes](https://www.docsy.dev/docs/adding-content/shortcodes/) or [custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/) to contribute to Kubernetes documentation.
- In addition to the standard Hugo shortcodes, we use a number of
  [custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/) in our
  documentation to control the presentation of content.
- Documentation source is available in multiple languages in `/content/`. Each
  language has its own folder with a two-letter code determined by the
  [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php)
  . For example, English documentation source is stored in `/content/en/docs/`.
- For more information about contributing to documentation in multiple languages
  or starting a new translation,
  see [localization](/docs/contribute/localization).
-->
- 你可以使用 [Docsy 短代碼](https://www.docsy.dev/docs/adding-content/shortcodes/)
  或[定製的 Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/)貢獻 Kubernetes 文檔。
- 除了標準的 Hugo 短代碼外，
  我們還在文檔中使用一些[定製的 Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/)來控制內容的呈現。
- 文檔的源代碼有多種語言形式，位於 `/content/` 目錄下。
  每種語言都有一個自己的目錄，用兩個字母表示，這兩個字母是基於
  [ISO 639-1 標準](https://www.loc.gov/standards/iso639-2/php/code_list.php)來確定的。
  例如，英語文檔的源代碼位於 `/content/en/docs/` 目錄下。
- 關於爲多語言文檔做貢獻以及如何開始新翻譯的詳細信息，
  可參考[本地化文檔](/zh-cn/docs/contribute/localization)。

<!-- 
## Before you begin {#before-you-begin}

### Sign the CNCF CLA {#sign-the-cla}

All Kubernetes contributors **must** read
the [Contributor guide](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md)
and [sign the Contributor License Agreement (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md).

Pull requests from contributors who haven't signed the CLA fail the automated
tests. The name and email you provide must match those found in
your `git config`, and your git name and email must match those used for the
CNCF CLA.
-->
## 開始之前   {#before-you-begin}

### 簽署 CNCF CLA   {#sign-the-cla}

所有 Kubernetes 貢獻者**必須**閱讀[貢獻者指南](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md)
並[簽署貢獻者授權同意書 (Contributor License Agreement, CLA)](https://github.com/kubernetes/community/blob/master/CLA.md)。  

若貢獻者尚未簽署 CLA，其發起的 PR 將無法通過自動化測試。
你所提供的姓名和郵件地址必須與 `git config` 中配置的完全相同，
而且你的 Git 用戶名和郵件地址必須與用來簽署 CNCF CLA 的信息一致。

<!-- 
### Choose which Git branch to use

When opening a pull request, you need to know in advance which branch to base
your work on.

Scenario | Branch
:---------|:------------
Existing or new English language content for the current release | `main`
Content for a feature change release | The branch which corresponds to the major and minor version the feature change is in, using the pattern `dev-<version>`. For example, if a feature changes in the `v{{< skew nextMinorVersion >}}` release, then add documentation changes to the ``dev-{{< skew nextMinorVersion >}}`` branch.
Content in other languages (localizations) | Use the localization's convention. See the [Localization branching strategy](/docs/contribute/localization/#branch-strategy) for more information.

If you're still not sure which branch to choose, ask in `#sig-docs` on Slack.
-->
### 選擇要使用的 Git 分支   {#choose-which-git-branch-to-use}

在發起 PR 時，你需要預先知道基於哪個分支來開展工作。

場景 | 分支
:---------|:------------
針對當前發行版本的，對現有英文內容的修改或新的英文內容 | `main`
針對功能特性變更的內容 | 分支對應於功能特性變更的主要和次要版本，分支名稱採用 `dev-<version>` 的模式。例如，如果某功能特性在 `v{{< skew nextMinorVersion >}}` 版本發生變化，則對應的文檔變化要添加到 `dev-{{< skew nextMinorVersion >}}` 分支。
其他語言的內容（本地化） | 基於本地化團隊的約定。參見[本地化分支策略](/zh-cn/docs/contribute/localization/#branch-strategy)瞭解更多信息。

如果你仍不能確定要選擇哪個分支，請在 Slack 的 `#sig-docs` 頻道上提出問題。  

{{< note >}}
<!-- 
If you already submitted your pull request and you know that the
base branch was wrong, you (and only you, the submitter) can change it.
-->
如果你已經提交了 PR，並且發現所針對的分支選錯了，你（且只有作爲提交人的你）可以更改分支。
{{< /note >}}

<!-- 
### Languages per PR

Limit pull requests to one language per PR. If you need to make an identical
change to the same code sample in multiple languages, open a separate PR for
each language.
-->
### 每個 PR 牽涉的語言   {#languages-per-pr}

請確保每個 PR 僅涉及一種語言。
如果你需要對多種語言下的同一代碼示例進行相同的修改，也請爲每種語言發起一個獨立的 PR。

<!-- 
## Tools for contributors

The [doc contributors tools](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools)
directory in the `kubernetes/website` repository contains tools to help your
contribution journey go more smoothly.
-->
## 爲貢獻者提供的工具   {#tools-for-contributors}

`kubernetes/website` 倉庫的[文檔貢獻者工具](https://github.com/kubernetes/website/tree/main/content/zh-cn/docs/doc-contributor-tools)目錄中包含了一些工具，
有助於使你的貢獻過程更爲順暢。
