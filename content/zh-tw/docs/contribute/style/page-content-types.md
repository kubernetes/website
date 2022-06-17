---
title: 頁面內容型別
content_type: concept
weight: 30
card:
  name: contribute
  weight: 30
---
<!--
title: Page content types
content_type: concept
weight: 30
card:
  name: contribute
  weight: 30
-->

<!-- overview -->

<!--
The Kubernetes documentation follows several types of page content:

- Concept
- Task
- Tutorial
- Reference
-->
Kubernetes 文件包含以下幾種頁面內容型別：

- 概念（Concept）
- 任務（Task）
- 教程（Tutorial）
- 參考（Reference）

<!-- body -->

<!--
## Content sections

Each page content type contains a number of sections defined by
Markdown comments and HTML headings. You can add content headings to
your page with the `heading` shortcode. The comments and headings help
maintain the structure of the page content types.

Examples of Markdown comments defining page content sections:
-->
## 內容章節  {#content-sections}

每種頁面內容型別都有一些使用 Markdown 註釋和 HTML 標題定義的章節。
你可以使用 `heading` 短程式碼將內容標題新增到你的頁面中。
註釋和標題有助於維護對應頁面內容型別的結構組織。

定義頁面內容章節的 Markdown 註釋示例：

```markdown
<!-- overview -->
```

```markdown
<!-- body -->
```

<!--
To create common headings in your content pages, use the `heading` shortcode with
a heading string.

Examples of heading strings:

- whatsnext
- prerequisites
- objectives
- cleanup
- synopsis
- seealso
- options

For example, to create a `whatsnext` heading, add the heading shortcode with the "whatsnext" string:
-->
要在內容頁面中建立通用的標題，可以使用 `heading` 短程式碼加上標題字串。

標題字串示例：

- whatsnext
- prerequisites
- objectives
- cleanup
- synopsis
- seealso
- options

例如，要建立一個 `whatsnext` 標題，新增 heading 短程式碼並指定 "whatsnext" 字串：

```none
## {{%/* heading "whatsnext" */%}}
```

<!--
You can declare a `prerequisites` heading as follows:
-->
你可以像下面這樣宣告一個 `prerequisites` 標題：

```none
## {{%/* heading "prerequisites" */%}}
```

<!--
The `heading` shortcode expects one string parameter.
The heading string parameter matches the prefix of a variable in the `i18n/<lang>.toml` files.
For example:
-->
短程式碼 `heading` 需要一個字串引數。
該字串引數要與 `i18n/<語言>.toml` 檔案中以其為字首的某個變數匹配。
例如：

`i18n/en.toml`:

```toml
[whatsnext_heading]
other = "What's next"
```

`i18n/ko.toml`:

```toml
[whatsnext_heading]
other = "다음 내용"
```

<!--
## Content types

Each content type informally defines its expected page structure.
Create page content with the suggested page sections.
-->
## 內容型別 {#content-types}

每種內容型別都非正式地定義了期望的頁面結構組織。
請按照所建議的頁面章節來建立內容頁面。

<!--
### Concept

A concept page explains some aspect of Kubernetes. For example, a concept
page might describe the Kubernetes Deployment object and explain the role it
plays as an application once it is deployed, scaled, and updated. Typically, concept
pages don't include sequences of steps, but instead provide links to tasks or
tutorials.

To write a new concept page, create a Markdown file in a subdirectory of the
`/content/en/docs/concepts` directory, with the following characteristics:

Concept pages are divided into three sections:

| Page section   |
|----------------|
| overview       |
| body           |
| whatsnext      |
-->
### 概念 {#concept}

概念頁面用來解釋 Kubernetes 的某些方面。例如，概念頁面可以用來描述 Kubernetes
中的 Deployment 物件，解釋其作為應用的角色如何部署、擴縮和更新。
通常，概念頁面不需要包含步驟序列，但包含指向任務或教程的連結。

要編寫一個新的概念頁面，在 `/content/en/docs/concepts` 目錄下面的子目錄中新建
一個 Markdown 檔案。該檔案具有以下特點。

概念頁面分為三個章節：

| 頁面章節           |
|--------------------|
| overview （概述）  |
| body (主體）       |
| whatsnext (接下來）|

<!--
The `overview` and `body` sections appear as comments in the concept page.
You can add the `whatsnext` section to your page with the `heading` shortcode.

Fill each section with content. Follow these guidelines:

- Organize content with H2 and H3 headings.
- For `overview`, set the topic's context with a single paragraph.
- For `body`, explain the concept.
- For `whatsnext`, provide a bulleted list of topics (5 maximum) to learn more about the concept.

[Annotations](/docs/concepts/overview/working-with-objects/annotations/) is a
published example of a concept page.
-->
其中的 `overview` 和 `body` 章節在概念頁面中顯示為註釋。
你可以使用 `heading` 短程式碼向頁面新增 `wahtsnext` 節。

在為每個章節撰寫內容時，遵從一些規定：

- 使用二級和三級標題（H2、H3）來組織內容
- 在 `overview` 節中，使用一段文字來為主體部分鋪陳上下文；
- 在 `body` 節中，詳細解釋對應概念；
- 對於 `whatsnext` 節，提供一個專案符號列表（最多 5 個），幫助讀者進一步學習掌握概念

[註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)頁面是一個已經
上線的概念頁面的例子。

<!--
### Task

A task page shows how to do a single thing, typically by giving a short
sequence of steps. Task pages have minimal explanation, but often provide links
to conceptual topics that provide related background and knowledge.

To write a new task page, create a Markdown file in a subdirectory of the
`/content/en/docs/tasks` directory, with the following characteristics:

| Page section   |
|----------------|
| overview       |
| prerequisites  |
| steps          |
| discussion     |
| whatsnext      |
-->
### 任務（Task）  {#task}

任務頁面講解如何完成某項工作，通常包含由為數不多的幾個步驟組成的序列。
任務頁面的講解文字很少，不過通常會包含指向概念主題的連結，以便讀者
能夠了解相關的背景和知識。

編寫新的任務頁面時，在 `/content/en/docs/tasks` 目錄下的子目錄中建立一個
新的 Markdown 檔案。該檔案特點如下。

| 頁面章節                  |
|---------------------------|
| overview （概述）         |
| prerequisites （準備工作）|
| steps （步驟）            |
| discussion （討論）       |
| whatsnext （接下來）      |

<!--
The `overview`, `steps`, and `discussion` sections appear as comments in the task page.
You can add the `prerequisites` and `whatsnext` sections to your page
with the `heading` shortcode.

Within each section, write your content. Use the following guidelines:

- Use a minimum of H2 headings (with two leading `#` characters). The sections
  themselves are titled automatically by the template.
- For `overview`, use a paragraph to set context for the entire topic.
- For `prerequisites`, use bullet lists when possible. Start adding additional
  prerequisites below the `include`. The default prerequisites include a running Kubernetes cluster.
- For `steps`, use numbered lists.
- For discussion, use normal content to expand upon the information covered
  in `steps`.
- For `whatsnext`, give a bullet list of up to 5 topics the reader might be
  interested in reading next.

An example of a published task topic is [Using an HTTP proxy to access the Kubernetes API](/docs/tasks/extend-kubernetes/http-proxy-access-api/).
-->
其中的 `overview`、`steps` 和 `discussion` 節在任務頁面中顯示為註釋。
你可以使用 `heading` 短程式碼新增 `prerequisites` 和 `whatsnext` 小節。

在每個小節內撰寫內容時注意以下規定：

- 最低使用二級標題（H2，標題行前帶兩個 `#` 字元）。每個小節都會由模版自動給出標題。
- 在 `overview` 節中，用一個段落為整個任務主體設定語境；
- 在 `prerequisites` 節中，儘可能使用專案符號列表。
  額外的環境準備條件要加在 `include` 短程式碼之後。
  預設的環境準備條件是擁有一個在執行的 Kubernetes 叢集。
- 在 `steps` 節中，使用編號符號列表。
- 在 `discussion` 節中，使用正常文字內容來對 `steps` 節中內容展開敘述。
- 在 `whatsnext` 節中，使用專案符號列表（不超過 5 項），列舉讀者可能接下來有興趣
  閱讀的主題。

已上線的任務主題示例之一是[使用 HTTP 代理來訪問 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/http-proxy-access-api/)。

<!--
### Tutorial

A tutorial page shows how to accomplish a goal that is larger than a single
task. Typically a tutorial page has several sections, each of which has a
sequence of steps. For example, a tutorial might provide a walkthrough of a
code sample that illustrates a certain feature of Kubernetes. Tutorials can
include surface-level explanations, but should link to related concept topics
for deep explanations.

To write a new tutorial page, create a Markdown file in a subdirectory of the
`/content/en/docs/tutorials` directory, with the following characteristics:

| Page section   |
|----------------|
| overview       |
| prerequisites  |
| objectives     |
| lessoncontent  |
| cleanup        |
| whatsnext      |
-->
### 教程（Tutorial）  {#tutorial}

教程頁面描述如果完成一個比單一任務規模更大的目標。通常教程頁面會有多個小節，
每個小節由一系列步驟組成。例如，每個教程可能提供對程式碼示例的講解，便於使用者
瞭解 Kubernetes 的某個功能特性。教程可以包含表面層面的概念解釋，對於更深層面
的概念主題應該使用連結。

撰寫新的教程頁面時，在 `/content/en/docs/tutorials` 目錄下面的子目錄中建立新的
Markdown 檔案。該檔案有以下特點。

| 頁面節區                  |
|---------------------------|
| overview （概述）         |
| prerequisites （環境準備）|
| objectives （目標）       |
| lessoncontent （教程內容）|
| cleanup （清理工作）      |
| whatsnext （接下來）      |

<!--
The `overview`, `objectives`, and `lessoncontent` sections appear as comments in the tutorial page.
You can add the `prerequisites`, `cleanup`, and `whatsnext` sections to your page
with the `heading` shortcode.

Within each section, write your content. Use the following guidelines:

- Use a minimum of H2 headings (with two leading `#` characters). The sections
  themselves are titled automatically by the template.
- For `overview`, use a paragraph to set context for the entire topic.
- For `prerequisites`, use bullet lists when possible. Add additional
  prerequisites below the ones included by default.
- For `objectives`, use bullet lists.
- For `lessoncontent`, use a mix of numbered lists and narrative content as
  appropriate.
- For `cleanup`, use numbered lists to describe the steps to clean up the
  state of the cluster after finishing the task.
- For `whatsnext`, give a bullet list of up to 5 topics the reader might be
  interested in reading next.

An example of a published tutorial topic is
[Running a Stateless Application Using a Deployment](/docs/tutorials/stateless-application/run-stateless-application-deployment/).
-->
教程頁面的 `overview`、`objectives` 和 `lessoncontent` 小節顯示為註釋形式。
你可以使用 `heading` 短程式碼根據需要新增 `prerequisites`、`cleanup` 和
`whatsnext` 小節。

在每個小節中編寫內容時，請注意以下規定：

- 最低使用二級標題（H2，標題前面有兩個 `#` 字元）。模版會自動為每個小節設定標題。
- 在 `overview` 節中，用一個段落為整個主題設定語境；
- 在 `prerequisites` 節中，儘可能使用專案符號列表。
  額外的環境準備條件要加在已包含的條件之後。
- 在 `objectives` 節中，使用專案符號列表。
- 在 `lessoncontent` 節中，結合使用編號符號列表和敘述性文字。
- 在 `cleanup` 節中，使用編號符號列表來描述任務結束後清理叢集狀態所需要的步驟。
- 在 `whatsnext` 節中，使用專案符號列表（不超過 5 項），列舉讀者可能接下來有興趣
  閱讀的主題。

已釋出的教程主題的一個例子是
[使用 Deployment 執行無狀態應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/).

<!--
### Reference

A component tool reference page shows the description and flag options output for
a Kubernetes component tool. Each page generates from scripts using the component tool commands.

A tool reference page has several possible sections:

| Page section                 |
|--------------------------------|
| synopsis                     |
| options                      |
| options from parent commands |
| examples                     |
| seealso                      |

Examples of published tool reference pages are:

- [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/)
- [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
- [kubectl](/docs/reference/kubectl/kubectl/)
-->
### 參考（Reference）  {#reference}

元件工具的參考頁面給出的是某個 Kubernetes 元件工具的描述和引數選項輸出。
每個頁面都是使用元件工具命令基於指令碼生成的。

每個工具參考頁面可能包含以下小節：

| 頁面小節        |
|-----------------|
| synopsis (用法）|
| options（選項） |
| options from parent commands (從父命令整合的選項） |
| examples （示例）|
| seealso （參考）|

已釋出的工具參考頁面示例包括：

- [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
- [kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
- [kubectl](/zh-cn/docs/reference/kubectl/kubectl/)

## {{% heading "whatsnext" %}}

<!--
- Learn about the [Style guide](/docs/contribute/style/style-guide/)
- Learn about the [Content guide](/docs/contribute/style/content-guide/)
- Learn about [content organization](/docs/contribute/style/content-organization/)
-->
- 瞭解[樣式指南](/zh-cn/docs/contribute/style/style-guide/)
- 瞭解[內容指南](/zh-cn/docs/contribute/style/content-guide/)
- 瞭解[內容組織](/zh-cn/docs/contribute/style/content-organization/)

