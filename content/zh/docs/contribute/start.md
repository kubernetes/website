---
title: 开始贡献
slug: start
content_type: concept
weight: 10
card:
  name: contribute
  weight: 10
---
<!-- 
---
title: Start contributing
slug: start
content_type: concept
weight: 10
card:
  name: contribute
  weight: 10
--- 
-->

<!-- overview -->

<!-- 
If you want to get started contributing to the Kubernetes documentation, this
page and its linked topics can help you get started. You don't need to be a
developer or a technical writer to make a big impact on the Kubernetes
documentation and user experience! All you need for the topics on this page is
a [GitHub account](https://github.com/join) and a web browser.

If you're looking for information on how to start contributing to Kubernetes
code repositories, refer to
[the Kubernetes community guidelines](https://github.com/kubernetes/community/blob/master/governance.md). 
-->
如果您想要为 Kubernetes 文档做贡献，本页面的内容和链接的主题能够给您帮助。您不必是一位开发者或者技术作者，也同样可以为 Kubernetes 文档及其用户体验带来巨大的影响！您只需要有一个 [Github 账号](https://github.com/join) 和一个浏览器。

如果您在寻找有关如何开始向 Kubernetes 仓库贡献代码的信息，请参考 [Kubernetes 社区指南](https://github.com/kubernetes/community/blob/master/governance.md)。




<!-- body -->

<!-- 
## The basics about our docs 
-->
## 关于我们文档的基础知识

<!-- 
The Kubernetes documentation is written in Markdown and processed and deployed using Hugo. The source is in GitHub at [https://github.com/kubernetes/website](https://github.com/kubernetes/website). Most of the documentation source is stored in `/content/en/docs/`. Some of the reference documentation is automatically generated from scripts in the `update-imported-docs/` directory.

You can file issues, edit content, and review changes from others, all from the
GitHub website. You can also use GitHub's embedded history and search tools. 
-->
Kubernetes 文档是以 Markdown 形式编写的，使用 Hugo 进行部署。源码位于 Github 的 [https://github.com/kubernetes/website](https://github.com/kubernetes/website)。大部分文档源码位于 `/content/en/docs/`。有些参考文档是由 `update-imported-docs/` 目录内的脚本自动生产的。

您可以提交 issue、编辑内容或者对其他人的提交内容进行复审，这些都可以在 Github 网站上完成。您也可以使用 Github 内置的历史功能和查询工具。

<!-- 
Not all tasks can be done in the GitHub UI, but these are discussed in the
[intermediate](/docs/contribute/intermediate/) and
[advanced](/docs/contribute/advanced/) docs contribution guides.

### Participating in SIG Docs 
-->
并非所有的任务都可以通过 Github UI 完成，这些任务会在[中级](/docs/contribute/intermediate/)和[高级](/docs/contribute/advanced/)文档贡献指南中讨论

### 参与文档特别兴趣小组（SIG Docs）

<!-- 
The Kubernetes documentation is maintained by a
{{< glossary_tooltip text="Special Interest Group" term_id="sig" >}} (SIG)
called SIG Docs. We [communicate](#participate-in-sig-docs-discussions) using a Slack channel, a mailing list, and
weekly video meetings. New participants are welcome. For more information, see
[Participating in SIG Docs](/docs/contribute/participating/). 
-->
Kubernetes 文档是由 {{< glossary_tooltip text="特别兴趣小组" term_id="sig" >}} (SIG) 维护的，该小组名为 SIG Docs。我们通过 Slack 频道、邮件列表和网络视频周会进行[交流](#参与-sig-docs-讨论)。欢迎新的参与者加入。更多信息，请参考[参与 SIG Docs](/docs/contribute/participating/)。

<!-- 
### Content guildelines

The SIG Docs community created guidelines about what kind of content is allowed 
in the Kubernetes documentation. Look over the [Documentation Content 
Guide](/docs/contribute/style/content-guide/) to determine if the content 
contribution you want to make is allowed. You can ask questions about allowed 
content in the [#sig-docs]((#participate-in-sig-docs-discussions)) Slack 
channel. 
-->
### 内容指南

SIG Docs 社区创建了有关 Kubernetes 文档中允许哪种内容的指南。查看[文档内容指南](/docs/contribute/style/content-guide/)确定是否允许您要进行的内容贡献。您可以在 [#sig-docs](#参与-sig-docs-讨论) 频道中询问有关允许内容的问题。

<!-- 
### Style guidelines

We maintain a [style guide](/docs/contribute/style/style-guide/) with information
about choices the SIG Docs community has made about grammar, syntax, source
formatting, and typographic conventions. Look over the style guide before you
make your first contribution, and use it when you have questions. 
-->
### 风格指南

我们维护了一个[风格指南](/docs/contribute/style/style-guide/)页面，上面有关于 SIG Docs 社区对于语法、句法、源格式和排版的约定。在您做首次贡献前或者在有疑问的时候请先查阅风格指南。

<!-- 
Changes to the style guide are made by SIG Docs as a group. To propose a change
or addition, [add it to the agenda](https://docs.google.com/document/d/1zg6By77SGg90EVUrhDIhopjZlSDg2jCebU-Ks9cYx0w/edit#) for an upcoming SIG Docs meeting, and attend the meeting to participate in the
discussion. See the [advanced contribution](/docs/contribute/advanced/) topic for more
information. 
-->
风格的变化是由 SIG Docs 组共同决定的。如您想提交变更或增加内容，请将内容[添加到议题](https://docs.google.com/document/d/1zg6By77SGg90EVUrhDIhopjZlSDg2jCebU-Ks9cYx0w/edit#)并参与会议讨论。更多信息，参见[进阶贡献](/docs/contribute/advanced/)主题。

<!-- 
### Page templates

We use page templates to control the presentation of our documentation pages.
Be sure to understand how these templates work by reviewing
[Using page templates](/docs/contribute/style/page-templates/).

### Hugo shortcodes 
-->
### 页面模板

我们使用页面模板来控制文档页面。需要确保您理解这些模版是如何工作的，请阅读[使用页面模板](/docs/contribute/style/page-templates/)。

### Hugo 短代码

<!-- 
The Kubernetes documentation is transformed from Markdown to HTML using Hugo.
We make use of the standard Hugo shortcodes, as well as a few that are custom to
the Kubernetes documentation. See [Custom Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/) for
information about how to use them.

### Multiple languages 
-->
Kubernetes 文档使用 Hugo 将 Markdown 转换成 HTML。我们使用标准的 Hugo 短代码，同时也会有部分为 Kubernetes 定制化的代码。有关如何使用短代码的信息，请参见[自定义 Hugo 短代码](/docs/contribute/style/hugo-shortcodes/)。

### 多语言

<!-- 
Documentation source is available in multiple languages in `/content/`. Each language has its own folder with a two-letter code determined by the [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php). For example, English documentation source is stored in `/content/en/docs/`.

For more information about contributing to documentation in multiple languages, see ["Localize content"](/docs/contribute/intermediate#localize-content) in the intermediate contributing guide. 
-->
在 `/content/` 目录中有文档源码的多语言版本。每个语言拥有其自己的目录，采用 [ISO 639-1 标准](https://www.loc.gov/standards/iso639-2/php/code_list.php) 的两位编码命名。例如，英文文档源码位于 `/content/en/docs/` 目录。

更多关于对多语言文档做贡献的信息，请参考中级贡献指南中的["本地化内容"](/docs/contribute/intermediate#localize-content)。

<!-- 
If you're interested in starting a new localization, see ["Localization"](/docs/contribute/localization/).

## File actionable issues 
-->
如果您有兴趣开始一个新的本地化语言项目，请参考["本地化"](/docs/contribute/localization/)。

## 提出可操作的 issues

<!-- 
Anyone with a GitHub account can file an issue (bug report) against the
Kubernetes documentation. If you see something wrong, even if you have no idea
how to fix it, [file an issue](#how-to-file-an-issue). The exception to this
rule is a tiny bug like a typo that you intend to fix yourself. In that case,
you can instead [fix it](#improve-existing-content) without filing a bug first.

### How to file an issue 
-->
任何拥有 Github 账号的人都能对于 Kubernetes 提出可行的 issue（或者 bug report）。如果发现问题，即便您不知道如何修复它，请[提出 issue](#how-to-file-an-issue)。除非您发现微小的错误的情况，例如发现了一个拼写错误，您想自己进行修复。在这种情况下，您可以[修复它](#improve-existing-content)，而不用先提出一个 bug。

### 如何提出 issue

<!-- 
- **On an existing page**

    If you see a problem in an existing page in the [Kubernetes docs](/docs/),
    go to the bottom of the page and click the **Create an Issue** button. If
    you are not currently logged in to GitHub, log in. A GitHub issue form
    appears with some pre-populated content.

    Using Markdown, fill in as many details as you can. In places where you see
    empty square brackets (`[ ]`), put an `x` between the set of brackets that
    represents the appropriate choice. If you have a proposed solution to fix
    the issue, add it.  
-->
- **对于已有页面**

    如果您在已有的 [Kubernetes 文档](/docs/)页面，在页面底部直接点击 **创建 Issue** 按钮。如果您当前未登录 Github，那么请登录。Github 文档表单会带着预填的信息出现。

    使用 Markdown 格式，填写尽可能多的详细信息。在方括号 (`[ ]`) 中，使用 `x` 代码选择了该选项。如果您提交了修复 issue 的方法，也填在里面。

<!-- 
- **Request a new page**

    If you think content should exist, but you aren't sure where it should go or
    you don't think it fits within the pages that currently exist, you can
    still file an issue. You can either choose an existing page near where you think the
    new content should go and file the issue from that page, or go straight to
    [https://github.com/kubernetes/website/issues/new/](https://github.com/kubernetes/website/issues/new/)
    and file the issue from there. 
-->
- **请求创建一个新页面**

    如果认为有些内容应该存在，但您不知道应该将这些内容存放在哪里，或者任何不适合放在现有页面中，那么也可以提出一个 issue。您可以选择通过内容相近的页面创建 issue，或者直接在 [https://github.com/kubernetes/website/issues/new/](https://github.com/kubernetes/website/issues/new/)中记录 issue。

<!-- 
### How to file great issues

To ensure that we understand your issue and can act on it, keep these guidelines
in mind: 
-->
### 如何记录好的 issues

要确保我们能理解您的 issue，并能付诸行动，请谨记如下指南：

<!-- 
- Use the issue template, and fill out as many details as you can.
- Clearly explain the specific impact the issue has on users.
- Limit the scope of a given issue to a reasonable unit of work. For problems
  with a large scope, break them down into smaller issues.
  
    For instance, "Fix the security docs" is not an actionable issue, but "Add
    details to the 'Restricting network access' topic" might be.
- If the issue relates to another issue or pull request, you can refer to it
  either by its full URL or by the issue or pull request number prefixed
  with a `#` character. For instance, `Introduced by #987654`.
- Be respectful and avoid venting. For instance, "The docs about X suck" is not
  helpful or actionable feedback. The
  [Code of Conduct](/community/code-of-conduct/) also applies to interactions on
  Kubernetes GitHub repositories. 
-->
- 使用 issue 模板，尽可能填写详细的信息。
- 清楚地描述该 issue 对用户造成的具体影响。
- 限制 issue 的范围，以提交给合理的工作组。如果问题范围很大，将其拆分成若干个 issues。

        例如，“修复安全文档”就是一个不可执行的 issue，但 “为'限制网络访问'主题添加详细信息”就是可执行的。
- 如果 issue 与另一个 issue 或者拉取请求（PR）有关，您可以通过 issue 的完整 URL 或者 PR 的序号（以 `#` 为前缀）进行关联。例如 `如 #987654`。
- 保持尊重，避免发泄。例如，“关于 X 的文档很差”就是无用且不可执行的反馈。[行为准测](/community/code-of-conduct/) 也适用于 Kubernetes Github 仓库的交互。

<!-- 
## Participate in SIG Docs discussions

The SIG Docs team communicates using the following mechanisms:

- [Join the Kubernetes Slack instance](http://slack.k8s.io/), then join the
  `#sig-docs` channel, where we discuss docs issues in real-time. Be sure to
  introduce yourself!
- [Join the `kubernetes-sig-docs` mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  where broader discussions take place and official decisions are recorded.
- Participate in the [weekly SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) video meeting, which is announced on the Slack channel and the mailing list. Currently, these meetings take place on Zoom, so you'll need to download the [Zoom client](https://zoom.us/download) or dial in using a phone. 
-->
## 参与 SIG Docs 讨论

SIG Docs 团队交流采用如下机制：

- [加入 Kubernetes 的 Slack 工作组](http://slack.k8s.io/)，然后加入 `#sig-docs` 频道，在那里我会实时讨论文档的 issues。一定要做自我介绍！
- [加入 `kubernetes-sig-docs` 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)，在这里会有广泛的讨论以及官方决策的记录。
- 参与 [SIG Docs 视频周例会](https://github.com/kubernetes/community/tree/master/sig-docs)，会通过 Slack 频道和邮件列表通知。
  目前通过 Zoom 进行会议，所以您需要下载 [Zoom 客户端](https://zoom.us/download)，或者通过手机拨入。

<!-- 
You can also check the SIG Docs weekly meeting on the [Kubernetes community meetings calendar](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
-->

{{< note >}}
您也可以查看 [Kubernetes 社区会议日历](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles)。
{{< /note >}}

<!-- 
## Improve existing content

To improve existing content, you file a _pull request (PR)_ after creating a
_fork_. Those two terms are [specific to GitHub](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/).
For the purposes of this topic, you don't need to know everything about them,
because you can do everything using your web browser. When you continue to the
[intermediate docs contributor guide](/docs/contribute/intermediate/), you will
need more background in Git terminology. 
-->
## 改进现有内容

要改进现有的内容，您可以在创建 _fork_ 之后起草一个 _拉取请求（PR）_ 。这两个术语是 [Github 专用的](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/)。
出于本主题的目的，您无需了解有关它们的所有信息，因为您可以通过浏览器做所有的事情。当您继续阅读[贡献者中级指南](/docs/contribute/intermediate/)，您会需要更多 Git 术语的背景知识。

<!-- 
**Kubernetes code developers**: If you are documenting a new feature for an
upcoming Kubernetes release, your process is a bit different. See
[Document a feature](/docs/contribute/intermediate/#sig-members-documenting-new-features) for
process guidelines and information about deadlines.
-->

{{< note >}}
**Kubernetes 代码开发者**：如果您在撰写 Kubernetes 新版本的新功能文档，流程会稍有不同。
关于流程指南和最后期限的信息，请参阅[编写功能文档](/docs/contribute/intermediate/#sig-members-documenting-new-features)。
{{< /note >}}

<!-- 
### Sign the CNCF CLA {#sign-the-cla}

Before you can contribute code or documentation to Kubernetes, you **must** read
the [Contributor guide](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) and
[sign the Contributor License Agreement (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md).
Don't worry -- this doesn't take long!

### Find something to work on 
-->
## 签署 CNCF CLA {#sign-the-cla}

在贡献 Kubernetes 的代码或文档前，您 **必须** 阅读[贡献者指南](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md)，并[签署贡献者许可协议（CLA）](https://github.com/kubernetes/community/blob/master/CLA.md)。
别担心 -- 不需要太多时间！

### 开始贡献

<!-- 
If you see something you want to fix right away, just follow the instructions
below. You don't need to [file an issue](#file-actionable-issues) (although you
certainly can).

If you want to start by finding an existing issue to work on, go to
[https://github.com/kubernetes/website/issues](https://github.com/kubernetes/website/issues)
and look for issues with the label `good first issue` (you can use
[this](https://github.com/kubernetes/website/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) shortcut). Read through the comments and make sure there is not an open pull
request against the issue and that nobody has left a comment saying they are
working on the issue recently (3 days is a good rule). Leave a comment saying
that you would like to work on the issue. 
-->
如果您发现了一些想要马上修复的问题，只需要遵循如下指南。您不需要[提出一个 issue](#file-actionable-issues)（尽管你当然可以这么做）。

如果您想从处理现有的 issue 开始，前往 [https://github.com/kubernetes/website/issues](https://github.com/kubernetes/website/issues) 找一些有 `good first issue` 标签的 issue （您可以使用[这个](https://github.com/kubernetes/website/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) 快捷方式)。阅读评论，确保针对此 issue 没有打开的 PR，并且没有人留言说他们最近正在解决这个 issue （3 天是个很好的规则）。留言说您会去解决这个 issue。

<!-- 
### Choose which Git branch to use

The most important aspect of submitting pull requests is choosing which branch
to base your work on. Use these guidelines to make the decision: 
-->
### 选择使用的 Git 分支

提交 PR 最重要的方面就是选择您工作所基于的基础分支。使用如下指南来做决定：

<!-- 
- Use `master` for fixing problems in content that is already published, or
  making improvements to content that already exists.
  - Use a release branch (such as `dev-{{< release-branch >}}` for the {{< release-branch >}} release) to document upcoming features
  or changes for an upcoming release that is not yet published.
- Use a feature branch that has been agreed upon by SIG Docs to collaborate on
  big improvements or changes to the existing documentation, including content
  reorganization or changes to the look and feel of the website.

If you're still not sure which branch to choose, ask in `#sig-docs` on Slack or
attend a weekly SIG Docs meeting to get clarity. 
-->
- 用 `master` 来解决以及发布的内容中的问题，或者对于已经存在的内容进行改进。
- 使用 release 分支（比如 `dev-{{< release-branch >}}` 用于 {{< release-branch >}} 发布）来撰写新的特性或者下个版本还未发布的变更说明。
- 使用 SIG Docs 已经同意的 feature 分支来协作对现有文档进行重大改进或更改，包括内容重组或网站外观的更改。

如果您还不确定应该使用哪个分支，在 Slack 上询问 `#sig-docs` 或者参与 SIG Docs 周例会来确认。

<!-- 
### Submit a pull request 
-->
### 提交 PR

<!-- 
Follow these steps to submit a pull request to improve the Kubernetes
documentation.

1.  On the page where you see the issue, click the pencil icon at the top right.
    A new GitHub page appears, with some help text.
2.  If you have never created a fork of the Kubernetes documentation
    repository, you are prompted to do so. Create the fork under your GitHub
    username, rather than another organization you may be a member of. The
    fork usually has a URL such as `https://github.com/<username>/website`,
    unless you already have a repository with a conflicting name.

    The reason you are prompted to create a fork is that you do not have
    access to push a branch directly to the definitive Kubernetes repository.

3.  The GitHub Markdown editor appears with the source Markdown file loaded.
    Make your changes. Below the editor, fill in the **Propose file change**
    form. The first field is the summary of your commit message and should be
    no more than 50 characters long. The second field is optional, but can
    include more detail if appropriate. 
-->

按照如下步骤提交 PR 来改善 Kubernetes 文档。

1.  在您提交 issue 的页面上，点击右上角的铅笔图标。新的页面就会出现，上面会有一些帮助信息。
2.  如果您从未创建过 Kubernetes 文档仓库的 fork，会提示您需要创建。请在您的 Github 账号下创建 fork，而不是在您所在的组织下创建。fork URL 通常是这样的 `https://github.com/<username>/website`，除非您已经有一个同名的仓库，那样会造成冲突。
    您创建 fork 的原因是您无权直接将分支推送到确定的 Kubernetes 仓库。

3.  Github Markdown 编辑器会载入着文档源码一起出现。根据实际情况撰写变化内容。在编辑器下方填写 **Propose file change（建议修改文件）** 表格。第一个区域需要填写提交说明消息，不能超过 50 个字符。第二个区域是可选的，也能够填写更多详细信息。

    {{< note >}}
<!-- 
Do not include references to other GitHub issues or pull
requests in your commit message. You can add those to the pull request
description later. 
-->不要把 Github issues 或者 PR 的关联信息放在您的提交说明消息中。您可以之后把这些内容添加到 PR 的描述中。
{{< /note >}}
      
    <!-- 
    Click **Propose file change**. The change is saved as a commit in a
    new branch in your fork, which is automatically named something like
    `patch-1`. 
    -->
    点击 **建议修改文件（Propose file change）** 按钮。变更会保存为您 fork 新分支（通常会自动命名为 `patch-1`）中的一个提交内容。

<!-- 
4.  The next screen summarizes the changes you made, by comparing your new
    branch (the **head fork** and **compare** selection boxes) to the current
    state of the **base fork** and **base** branch (`master` on the
    `kubernetes/website` repository by default). You can change any of the
    selection boxes, but don't do that now. Have a look at the difference
    viewer on the bottom of the screen, and if everything looks right, click
    **Create pull request**. 
-->
4.  接下来屏幕会总结您的变更，将您的新分支（**head fork** 和 **compare** 选择框）与 **base fork** 
    和 **base** 分支(默认是 `kubernetes/website` 的 `master` 分支)进行比较。您可以更改选择框，但现在请不要这么做。看一下屏幕底部显示的变化内容，如果看起来没问题，点击 **创建 PR（Create pull request）** 按钮。

    {{< note >}} 
<!-- 
If you don't want to create the pull request now, you can do it
later, by browsing to the main URL of the Kubernetes website repository or
your fork's repository. The GitHub website will prompt you to create the
pull request if it detects that you pushed a new branch to your fork.  
-->如果您现在还不想创建 PR，也可以稍后再做，通过浏览 Kubernetes 网站代码仓库或者您 fork 仓库的网站主页 URL。Github 网站会检查到您推送了一个新分支到 fork，并提示创建 PR。
{{< /note >}}

<!-- 
5.  The **Open a pull request** screen appears. The subject of the pull request
    is the same as the commit summary, but you can change it if needed. The
    body is populated by your extended commit message (if present) and some
    template text. Read the template text and fill out the details it asks for,
    then delete the extra template text. If you add to the description `fixes #<000000>` 
    or `closes #<000000>`, where `#<000000>` is the number of an associated issue,
    GitHub will automatically close the issue when the PR merges. 
    Leave the **Allow edits from maintainers** checkbox selected. Click
    **Create pull request**. 
-->
5.  **Open a pull request（打开一个 PR）** 屏幕出现了。PR 的主题和提交说明的内容一致，
    如有需要您也可以修改。主体内容会自动填充您的扩展提交消息（如果存在）和一些模板文本。
    阅读模板文本并填写要求的详细信息，然后删除额外的模板文本。
    如果在描述中添加 `fixes #<000000>` 或者 `closes #<000000>`，其中 `#<000000>` 是相关问题的编号，则当PR合并时，GitHub 将自动关闭该问题。
    保留选中 **Allow edits from maintainers（允许维护者编辑）** 复选框。
    单击 **Create pull request（创建拉取请求）** 按钮。
    
    <!--
    Congratulations! Your pull request is available in
    [Pull requests](https://github.com/kubernetes/website/pulls).

    After a few minutes, you can preview the website with your PR's changes
    applied. Go to the **Conversation** tab of your PR and click the **Details**
    link for the `deploy/netlify` test, near the bottom of the page. It opens in
    the same browser window by default.
    -->
    祝贺您！您的 PR 就出现在了[拉取请求](https://github.com/kubernetes/website/pulls) 中。

    几分钟后，您可以预览 PR 所带来的变化。前往您 PR 的 **Conversation（对话）** 标签页，
    点击 `deploy/netlify` 测试的 **Details（详细信息）** 链接，它在页面底部附件。
    默认会在同一个浏览器窗口中打开。

    {{< note >}}
    <!--
    Please limit pull requests to one language per PR. For example, if you need to make an identical change to the same code sample in multiple languages, open a separate PR for each language. 
    -->请将 PR 请求限制为每种 PR 只能使用一种语言。例如，如果您需要对多种语言的同一代码示例进行相同的更改，请为每种语言打开一个单独的 PR。
    {{< /note >}}

<!-- 
6.  Wait for review. Generally, reviewers are suggested by the `k8s-ci-robot`.
    If a reviewer asks you to make changes, you can go to the **Files changed**
    tab and click the pencil icon on any files that have been changed by the
    pull request. When you save the changed file, a new commit is created in
    the branch being monitored by the pull request. If you are waiting on a 
    reviewer to review the changes, proactively reach out to the reviewer 
    once every 7 days. You can also drop into #sig-docs Slack channel, 
    which is a good place to ask for help regarding PR reviews.

7.  If your change is accepted, a reviewer merges your pull request, and the
    change is live on the Kubernetes website a few minutes later. 
-->
6.  等待复审。通常，复审人员会由 `k8s-ci-robot` 建议指定。如果复审人员建议您修改，您可以
    前往 **Files changed（改变的文件内容）** 标签页，点击任意 PR 中改变的文件页面上的铅笔图标。
    保存更改的文件时，将在 PR 监视的分支中创建新的提交。如果您正在等待复审者审核更改，
    请每 7 天主动与复审者联系一次。您也可以进入 #sig-docs Slack 频道，这是寻求有关 PR 审查的帮助的好地方。

7.  如果修改被接受，复审人员会合并您的 PR，修改就会在几分钟后在 Kubernetes 网站上生效。

<!-- 
This is only one way to submit a pull request. If you are already a Git and
GitHub advanced user, you can use a local GUI or command-line Git client
instead of using the GitHub UI. Some basics about using the command-line Git
client are discussed in the [intermediate](/docs/contribute/intermediate/) docs
contribution guide. 
-->
这是提交 PR 的唯一方式。如果您已经是一名 Git 和 Github 的高级用户，您也可以使用本地 GUI 或者
Git 命令行。关于使用 Git 客户端的基础会在[中级](/docs/contribute/intermediate/) 贡献者指南中讨论。

<!-- 
## Review docs pull requests

People who are not yet approvers or reviewers can still review pull requests.
The reviews are not considered "binding", which means that your review alone
won't cause a pull request to be merged. However, it can still be helpful. Even
if you don't leave any review comments, you can get a sense of pull request
conventions and etiquette and get used to the workflow. 
-->
## 复审文档 PR

就算不是批注者或者复审者，也同样可以复审 PR。复审人员并不是"固定"的，意味着您单独的评审并不会让 PR 合并。然而，这依然对我们是很有帮助的。即使您没有留下任何评审意见，您可以了解 PR 的规范和礼仪，并习惯工作流程。

<!-- 
1.  Go to
    [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
    You see a list of every open pull request against the Kubernetes website and
    docs. 
-->
1.  前往 [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls)。
    请会看到一个列表，里面包含了所有对于 Kubernetes 网站和文档提的 PR。

<!-- 
2.  By default, the only filter that is applied is `open`, so you don't see
    pull requests that have already been closed or merged. It's a good idea to
    apply the `cncf-cla: yes` filter, and for your first review, it's a good
    idea to add `size/S` or `size/XS`. The `size` label is applied automatically
    based on how many lines of code the PR modifies. You can apply filters using
    the selection boxes at the top of the page, or use
    [this shortcut](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+yes%22+label%3Asize%2FS) for only small PRs. All filters are `AND`ed together, so
    you can't search for both `size/XS` and `size/S` in the same query. 
-->
2.  默认情况下，使用的筛选器是 `open`，所以您不会看见已经关闭或合并的 PR。
    最好使用 `cncf-cla: yes` 筛选器，并且对于第一次复审来说，最好加上 `size/S`
    或者 `size/XS`。`size` 标签会根据 PR 修改的代码行数自动生成。
    您可以通过页面顶端的选择框应用筛选器，或者使用
    [快捷方式](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+yes%22+label%3Asize%2FS)
    来查找所有小型 PR。所有筛选条件都是 `与` 的，所以您不能在一次查询中同时查找 `size/XS` 和 `size/S` 的结果。

<!-- 
3.  Go to the **Files changed** tab. Look through the changes introduced in the
    PR, and if applicable, also look at any linked issues. If you see a problem
    or room for improvement, hover over the line and click the `+` symbol that
    appears.

      You can type a comment, and either choose **Add single comment** or **Start
      a review**. Typically, starting a review is better because it allows you to
      leave multiple comments and notifies the PR owner only when you have
      completed the review, rather than a separate notification for each comment. 
-->
3.  前往 **Files changed（文件修改）** 标签页。查看 PR 中的变化部分，如果适用，也看一下关联的问题。如果您发现问题或者可以改进的空间，
    将鼠标悬浮在那一行并点击前面出现的 `+` 加号。

      你可以留下评论，选择 **Add single comment（仅添加评论）** 或者也可以 **Start a review（开始复审）**。典型来说，开始复审更好，因为这样您就可以在多行下留下评论，并且只有在完成复审后统一提交并通知 PR 的作者，而不是每一条评论都发送通知。

<!-- 
4.  When finished, click **Review changes** at the top of the page. You can
    summarize your review, and you can choose to comment, approve, or request
    changes. New contributors should always choose **Comment**. 
-->
4.  完成后，点击页面顶端但 **Review changes（复审修改）** 按钮。您可以总结复审，并且可以选择comment（评论），approve（批准），或者 request changes（请求变更）。新的贡献者应该选择  **Comment（评论）**。

<!-- 
Thanks for reviewing a pull request! When you are new to the project, it's a
good idea to ask for feedback on your pull request reviews. The `#sig-docs`
Slack channel is a great place to do this.

## Write a blog post 
-->
感谢您对于 PR 的复审工作！当您对于项目还是新人时，最好在拉取请求评论中征求反馈意见。Slack 的 `#sig-docs` 频道就是一个征求意见好去处。

## 撰写博客文章

<!-- 
Anyone can write a blog post and submit it for review. Blog posts should not be
commercial in nature and should consist of content that will apply broadly to
the Kubernetes community.

To submit a blog post, you can either submit it using the
[Kubernetes blog submission form](https://docs.google.com/forms/d/e/1FAIpQLSdMpMoSIrhte5omZbTE7nB84qcGBy8XnnXhDFoW0h7p2zwXrw/viewform),
or follow the steps below. 
-->
任何人都可以撰写博客并提交复审。博客文章不应具有商业性质，而应包含广泛适用于 Kubernetes 社区的内容。

要提交博客文章，您可以选择使用 [Kubernetes 博客提交表单](https://docs.google.com/forms/d/e/1FAIpQLSdMpMoSIrhte5omZbTE7nB84qcGBy8XnnXhDFoW0h7p2zwXrw/viewform)或者按如下步骤进行：

<!-- 
1.  [Sign the CLA](#sign-the-cla) if you have not yet done so.
2.  Have a look at the Markdown format for existing blog posts in the
    [website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).
3.  Write out your blog post in a text editor of your choice.
4.  On the same link from step 2, click the **Create new file** button. Paste
    your content into the editor. Name the file to match the proposed title of
    the blog post, but don't put the date in the file name. The blog reviewers
    will work with you on the final file name and the date the blog will be
    published.
5.  When you save the file, GitHub will walk you through the pull request
    process.
6.  A blog post reviewer will review your submission and work with you on
    feedback and final details. When the blog post is approved, the blog will be
    scheduled for publication. 
-->
1.  如果您还未签署 CLA，请[签署 CLA](#sign-the-cla)。
2.  查看现有博客文章的 Markdown 格式，位于[网站代码仓库](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts)。
3.  在您选择的文本编辑器中写下您的博客文章。
4.  在步骤 2 的相同链接中，点击 **Create new file（创建新文件）** 按钮。
    将您的内容粘贴到编辑器中。将文件命名为与博客文章的标题的名称，
    但不要将日期放在文件名中。博客复审人员将与您一起确定最终文件名和博客发布日期。
5.  保存文件时，Github 将引导您完成 PR 过程。
6.  博客复审人员会对您的提交对内容进行复审，并与您一起完成反馈意见和最终的详细信息。
    博客文章获得批准后，博客将会安排时间进行发布。

<!-- 
## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve
real-world problems. They are written in collaboration with the Kubernetes
marketing team, which is handled by the {{< glossary_tooltip text="CNCF" term_id="cncf" >}}.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/master/content/en/case-studies).
Use the [Kubernetes case study submission form](https://www.cncf.io/people/end-user-community/)
to submit your proposal. 
-->
## 提交案例研究

案例研究强调组织如何使用 Kubernetes 解决实际问题。它们是由 Kubernetes 市场团队共同撰写的，由 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 进行处理。

看一下[现有案例研究](https://github.com/kubernetes/website/tree/master/content/en/case-studies)的源码。
使用 [Kubernetes 案例研究提交表](https://www.cncf.io/people/end-user-community/)提交您的提案。



## {{% heading "whatsnext" %}}


<!-- 
When you are comfortable with all of the tasks discussed in this topic and you
want to engage with the Kubernetes docs team in deeper ways, read the
[intermediate docs contribution guide](/docs/contribute/intermediate/). 
-->
当您对本主题中讨论的所有任务感到满意，并且您希望以更深入的方式与 Kubernetes 文档团队合作，请阅读[中级贡献者指南](/docs/contribute/intermediate/)。


