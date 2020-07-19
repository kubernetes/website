---
title: 评阅 PRs
content_type: concept
main_menu: true
weight: 10
---
<!--
title: Reviewing pull requests
content_type: concept
main_menu: true
weight: 10
-->

<!-- overview -->
<!--
Anyone can review a documentation pull request. Visit the [pull requests](https://github.com/kubernetes/website/pulls) section in the Kubernetes website repository to see open pull requests.

Reviewing documentation pull requests is a
great way to introduce yourself to the Kubernetes community.
It helps you learn the code base and build trust with other contributors.

Before reviewing, it's a good idea to:

- Read the  [content guide](/docs/contribute/style/content-guide/) and
[style guide](/docs/contribute/style/style-guide/) so you can leave informed comments.
- Understand the different [roles and responsibilities](/docs/contribute/participating/#roles-and-responsibilities) in the Kubernetes documentation community.
-->
任何人均可评阅文档的拉取请求。访问 Kubernetes 网站仓库的
[pull requests](https://github.com/kubernetes/website/pulls)
部分可以查看所有待处理的拉取请求（PRs）。

评阅文档 PR 是将你自己介绍给 Kubernetes 社区的一种很好的方式。
它将有助于你学习代码库并与其他贡献者之间建立相互信任关系。

在评阅之前，可以考虑：

- 阅读[内容指南](/docs/contribute/style/content-guide/)和 
  [样式指南](/docs/contribute/style/style-guide/)以便给出有价值的评论。
- 了解 Kubernetes 文档社区中不同的[角色和职责](/docs/contribute/participating/#roles-and-responsibilities)。

<!-- body -->
<!--
## Before you begin

Before you start a review:

- Read the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) and ensure that you abide by it at all times.
- Be polite, considerate, and helpful.
- Comment on positive aspects of PRs as well as changes.
- Be empathetic and mindful of how your review may be received.
- Assume good intent and ask clarifying questions.
- Experienced contributors, consider pairing with new contributors whose work requires extensive changes.
-->
## 准备工作 {#before-you-begin}

在你开始评阅之前：

- 阅读 [CNCF 行为准则](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)
  确保你会始终遵从其中约定；
- 保持有礼貌、体谅他人，怀助人为乐初心；
- 评论时若给出修改建议，也要兼顾 PR 的积极方面
- 保持同理心，多考虑他人收到评阅意见时的可能反应
- 假定大家都是好意的，通过问问题澄清意图
- 如果你是有经验的贡献者，请考虑和新贡献者一起合作，提高其产出质量

<!--
## Review process

In general, review pull requests for content and style in English.

1.  Go to
    [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
    You see a list of every open pull request against the Kubernetes website and
    docs.

2.  Filter the open PRs using one or all of the following labels:
    - `cncf-cla: yes` (Recommended): PRs submitted by contributors who have not signed the CLA cannot be merged. See [Sign the CLA](/docs/contribute/new-content/overview/#sign-the-cla) for more information.
    - `language/en` (Recommended): Filters for english language PRs only.
    - `size/<size>`: filters for PRs of a certain size. If you're new, start with smaller PRs.

    Additionally, ensure the PR isn't marked as a work in progress. PRs using the `work in progress` label are not ready for review yet.
-->
## 评阅过程  {#review-process}

一般而言，应该使用英语来评阅 PR 的内容和样式。

1. 前往 [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls)，
   你会看到所有针对 Kubernetes 网站和文档的待处理 PRs。

2. 使用以下标签（组合）对待处理 PRs 进行过滤：

    - `cncf-cla: yes` （建议）：由尚未签署 CLA 的贡献者所发起的 PRs 不可以合并。
      参考[签署 CLA](/docs/contribute/new-content/overview/#sign-the-cla) 以了解更多信息。
    - `language/en` （建议）：仅查看英语语言的 PRs。
    - `size/<尺寸>`：过滤特定尺寸（规模）的 PRs。如果你刚入门，可以从较小的 PR 开始。

    此外，确保 PR 没有标记为尚未完成（Work in Progress）。
    包含 `work in progress` 的 PRs 通常还没准备好被评阅。

<!--
3.  Once you've selected a PR to review, understand the change by:
    - Reading the PR description to understand the changes made, and read any linked issues
    - Reading any comments by other reviewers
    - Clicking the **Files changed** tab to see the files and lines changed
    - Previewing the changes in the Netlify preview build by scrolling to the PR's build check section at the bottom of the **Conversation** tab and clicking the **deploy/netlify** line's **Details** link.

4.  Go to the **Files changed** tab to start your review.
    1. Click on the `+` symbol  beside the line you want to comment on.
    2. Fill in any comments you have about the line and click either **Add single comment** (if you have only one comment to make) or  **Start a review** (if you have multiple comments to make).
    3. When finished, click **Review changes** at the top of the page. Here, you can add
       add a summary of your review (and leave some positive comments for the contributor!),
      approve the PR, comment or request changes as needed. New contributors should always
      choose **Comment**.
-->
3. 选定 PR 评阅之后，可以通过以下方式理解所作的变更：

   - 阅读 PR 描述以理解所作变更，并且阅读所有关联的 Issues
   - 阅读其他评阅人给出的评论
   - 点击 **Files changed** Tab 页面，查看被改变的文件和代码行
   - 滚动到 **Conversation** Tab 页面下端的 PR 构建检查节区，点击
     **deploy/netlify** 行的 **Details** 链接，预览 Netlify
     预览构建所生成的结果

4. 前往 **Files changed** Tab 页面，开始你的评阅工作

   1. 点击你希望评论的行旁边的 `+` 号
   2. 填写你对该行的评论，之后或者选择**Add single comment** （如果你只有一条评论）
      或者 **Start a review** （如果你还有其他评论要添加）
   3. 评论结束时，点击页面顶部的 **Review changes**。这里你可以添加你的评论结语
      （记得留下一些正能量的评论！）、根据需要批准 PR、请求作者进一步修改等等。
      新手应该选择 **Comment**。

<!--
## Reviewing checklist

When reviewing, use the following as a starting point.

### Language and grammar

- Are there any obvious errors in language or grammar? Is there a better way to phrase something?
- Are there any complicated or archaic words which could be replaced with a simpler word?
- Are there any words, terms or phrases in use which could be replaced with a non-discriminatory alternative?
- Does the word choice and its capitalization follow the [style guide](/docs/contribute/style/style-guide/)?
- Are there long sentences which could be shorter or less complex?
- Are there any long paragraphs which might work better as a list or table?
-->
## 评阅清单  {#reviewing-checklist}

评阅 PR 时可以从下面的条目入手。

### 语言和语法 {#language-and-grammar}

- 是否存在明显的语言或语法错误？对某事的描述有更好的方式？
- 是否存在一些过于复杂晦涩的用词，本可以用简单词汇来代替？
- 是否有些用词、术语或短语可以用不带歧视性的表达方式代替？
- 用词和大小写方面是否遵从了[样式指南](/docs/contribute/style/style-guide/)？
- 是否有些句子太长，可以改得更短、更简单？
- 是否某些段落过长，可以考虑使用列表或者表格来表达？

<!--
### Content

- Does similar content exist elsewhere on the Kubernetes site?
- Does the content excessively link to off-site, individual vendor or non-open source documentation?
-->
### 内容 {#content}

- Kubernetes 网站上是否别处已经存在类似的内容？
- 内容本身是否过度依赖于网站范畴之外、独立供应商或者非开源的文档？

<!--
### Website

- Did this PR change or remove a page title, slug/alias or anchor link? If so, are there broken links as a result of this PR? Is there another option, like changing the page title without changing the slug?
- Does the PR introduce a new page? If so:
  - Is the page using the right [page content type](/docs/contribute/style/page-content-types/) and associated Hugo shortcodes?
  - Does the page appear correctly in the section's side navigation (or at all)?
  - Should the page appear on the [Docs Home](/docs/home/) listing?
- Do the changes show up in the Netlify preview? Be particularly vigilant about lists, code blocks, tables, notes and images.

### Other

For small issues with a PR, like typos or whitespace, prefix your comments with `nit:`.  This lets the author know the issue is non-critical.
-->
### 网站 {#Website}

- PR 是否改变或者删除了某页面的标题、slug/别名或者链接锚点？
  如果是这样，PR 是否会导致出现新的失效链接？
  是否有其他的办法，比如改变页面标题但不改变其 slug？
- PR 是否引入新的页面？如果是：
  - 该页面是否使用了正确的[页面内容类型](/docs/contribute/style/page-content-types/)
    及相关联的 Hugo 短代码（shortcodes）？
  - 该页面能否在对应章节的侧面导航中显示？显示得正确么？
  - 该页面是否应出现在[网站主页面](/docs/home/)的列表中？
- 变更是否正确出现在 Netlify 预览中了？
  要对列表、代码段、表格、注释和图像等元素格外留心

### 其他 {#other}

对于 PR 中的小问题，例如拼写错误或者空格问题，可以在你的评论前面加上 `nit:`。
这样做可以让作者知道该问题不是一个不得了的大问题。

