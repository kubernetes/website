---
title: 页面内容类型
content_type: concept
weight: 80
card:
  name: contribute
  weight: 30
---
<!--
title: Page content types
content_type: concept
weight: 80
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
Kubernetes 文档包含以下几种页面内容类型：

- 概念（Concept）
- 任务（Task）
- 教程（Tutorial）
- 参考（Reference）

<!-- body -->

<!--
## Content sections

Each page content type contains a number of sections defined by
Markdown comments and HTML headings. You can add content headings to
your page with the `heading` shortcode. The comments and headings help
maintain the structure of the page content types.

Examples of Markdown comments defining page content sections:
-->
## 内容章节  {#content-sections}

每种页面内容类型都有一些使用 Markdown 注释和 HTML 标题定义的章节。
你可以使用 `heading` 短代码将内容标题添加到你的页面中。
注释和标题有助于维护对应页面内容类型的结构组织。

定义页面内容章节的 Markdown 注释示例：

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
要在内容页面中创建通用的标题，可以使用 `heading` 短代码加上标题字符串。

标题字符串示例：

- whatsnext
- prerequisites
- objectives
- cleanup
- synopsis
- seealso
- options

例如，要创建一个 `whatsnext` 标题，添加 `heading` 短代码并指定 "whatsnext" 字符串：

```none
## {{%/* heading "whatsnext" */%}}
```

<!--
You can declare a `prerequisites` heading as follows:
-->
你可以像下面这样声明一个 `prerequisites` 标题：

```none
## {{%/* heading "prerequisites" */%}}
```

<!--
The `heading` shortcode expects one string parameter.
The heading string parameter matches the prefix of a variable in the `i18n/<lang>.toml` files.
For example:
-->
短代码 `heading` 需要一个字符串参数。
该字符串参数要与 `i18n/<语言>.toml` 文件中以其为前缀的某个变量匹配。
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
## 内容类型 {#content-types}

每种内容类型都非正式地定义了期望的页面结构组织。
请按照所建议的页面章节来创建内容页面。

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

概念页面用来解释 Kubernetes 的某些方面。例如，概念页面可以用来描述 Kubernetes
中的 Deployment 对象，解释其作为应用的角色如何部署、扩缩和更新。
通常，概念页面不需要包含步骤序列，但包含指向任务或教程的链接。

要编写一个新的概念页面，在 `/content/en/docs/concepts` 目录下面的子目录中新建一个 Markdown 文件。
该文件具有以下特点。

概念页面分为三个章节：

| 页面章节           |
|--------------------|
| overview（概述）  |
| body（正文）      |
| whatsnext（接下来）|

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
其中的 `overview` 和 `body` 章节在概念页面中显示为注释。
你可以使用 `heading` 短代码向页面添加 `wahtsnext` 节。

在为每个章节撰写内容时，遵从一些规定：

- 使用二级和三级标题（H2、H3）来组织内容；
- 在 `overview` 节中，使用一段文字概括当前主题的上下文；
- 在 `body` 节中，详细解释对应概念；
- 对于 `whatsnext` 节，提供一个项目符号列表（最多 5 个），帮助读者进一步学习掌握概念。

[注解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)页面是一个已经上线的概念页面的例子。

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
### 任务（Task）  {#task}

任务页面讲解如何完成某项工作，通常包含由为数不多的几个步骤组成的序列。
任务页面的讲解文字很少，不过通常会包含指向概念主题的链接，以便读者能够了解相关的背景和知识。

编写新的任务页面时，在 `/content/en/docs/tasks` 目录下的子目录中创建一个新的 Markdown 文件。
该文件特点如下。

| 页面章节                  |
|---------------------------|
| overview（概述）         |
| prerequisites（准备工作）|
| steps（步骤）            |
| discussion（讨论）       |
| whatsnext（接下来）      |

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
其中的 `overview`、`steps` 和 `discussion` 节在任务页面中显示为注释。
你可以使用 `heading` 短代码添加 `prerequisites` 和 `whatsnext` 小节。

在每个小节内撰写内容时注意以下规定：

- 最低使用二级标题（H2，标题行前带两个 `#` 字符）。每个小节都会由模板自动给出标题。
- 在 `overview` 节中，用一个段落为整个任务主题设定语境；
- 在 `prerequisites` 节中，尽可能使用项目符号列表。
  额外的环境准备条件要加在 `include` 短代码之后。
  默认的环境准备条件是拥有一个在运行的 Kubernetes 集群。
- 在 `steps` 节中，使用编号符号列表。
- 在 `discussion` 节中，使用正常文字内容来对 `steps` 节中内容展开叙述。
- 在 `whatsnext` 节中，使用项目符号列表（不超过 5 项），列举读者可能接下来有兴趣阅读的主题。

已上线的任务主题示例之一是[使用 HTTP 代理访问 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/http-proxy-access-api/)。

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

教程页面描述如果完成一个比单一任务规模更大的目标。通常教程页面会有多个小节，
每个小节由一系列步骤组成。例如，每个教程可能提供对代码示例的讲解，
便于用户了解 Kubernetes 的某个功能特性。教程可以包含表面层面的概念解释，
对于更深层面的概念主题应该使用链接。

撰写新的教程页面时，在 `/content/en/docs/tutorials` 目录下面的子目录中创建新的
Markdown 文件。该文件有以下特点。

| 页面节区                  |
|---------------------------|
| overview（概述）         |
| prerequisites（环境准备）|
| objectives（目标）       |
| lessoncontent（教程内容）|
| cleanup（清理工作）      |
| whatsnext（接下来）      |

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
[Running a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).
-->
教程页面的 `overview`、`objectives` 和 `lessoncontent` 小节显示为注释形式。
你可以使用 `heading` 短代码根据需要添加 `prerequisites`、`cleanup` 和
`whatsnext` 小节。

在每个小节中编写内容时，请注意以下规定：

- 最低使用二级标题（H2，标题前面有两个 `#` 字符）。模板会自动为每个小节设置标题。
- 在 `overview` 节中，用一个段落为整个主题设定语境；
- 在 `prerequisites` 节中，尽可能使用项目符号列表。
  额外的环境准备条件要加在已包含的条件之后。
- 在 `objectives` 节中，使用项目符号列表。
- 在 `lessoncontent` 节中，结合使用编号符号列表和叙述性文字。
- 在 `cleanup` 节中，使用编号符号列表来描述任务结束后清理集群状态所需要的步骤。
- 在 `whatsnext` 节中，使用项目符号列表（不超过 5 项），列举读者可能接下来有兴趣阅读的主题。

已发布的教程主题的一个例子是
[使用 Deployment 运行无状态应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/).

<!--
### Reference

A component tool reference page shows the description and flag options output for
a Kubernetes component tool. Each page generates from scripts using the component tool commands.

A tool reference page has several possible sections:

| Page section                 |
|------------------------------|
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
### 参考（Reference）  {#reference}

组件工具的参考页面给出的是某个 Kubernetes 组件工具的描述和参数选项输出。
每个页面都是使用组件工具命令基于脚本生成的。

每个工具参考页面可能包含以下小节：

| 页面小节        |
|-----------------|
| synopsis（用法）|
| options（选项） |
| options from parent commands（从父命令集成的选项） |
| examples（示例）|
| seealso（参考）|

已发布的工具参考页面示例包括：

- [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
- [kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
- [kubectl](/zh-cn/docs/reference/kubectl/kubectl/)

## {{% heading "whatsnext" %}}

<!--
- Learn about the [Style guide](/docs/contribute/style/style-guide/)
- Learn about the [Content guide](/docs/contribute/style/content-guide/)
- Learn about [content organization](/docs/contribute/style/content-organization/)
-->
- 了解[样式指南](/zh-cn/docs/contribute/style/style-guide/)
- 了解[内容指南](/zh-cn/docs/contribute/style/content-guide/)
- 了解[内容组织](/zh-cn/docs/contribute/style/content-organization/)
