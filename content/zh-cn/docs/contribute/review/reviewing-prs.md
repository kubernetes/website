---
title: 评审 PR
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
- Understand the different
  [roles and responsibilities](/docs/contribute/participate/roles-and-responsibilities/)
  in the Kubernetes documentation community.
-->
任何人均可评审文档的拉取请求。
访问 Kubernetes 网站仓库的 [pull requests](https://github.com/kubernetes/website/pulls) 部分，
可以查看所有待处理的拉取请求（PR）。

评审文档 PR 是将你自己介绍给 Kubernetes 社区的一种很好的方式。
它将有助于你学习代码库并与其他贡献者之间建立相互信任关系。

在评审之前，可以考虑：

- 阅读[内容指南](/zh-cn/docs/contribute/style/content-guide/)和 
  [样式指南](/zh-cn/docs/contribute/style/style-guide/)以便给出有价值的评论。
- 了解 Kubernetes 文档社区中不同的[角色和职责](/zh-cn/docs/contribute/participate/roles-and-responsibilities/)。

<!-- body -->

<!--
## Before you begin

Before you start a review:

- Read the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) and ensure that you abide by it at all times.
- Be polite, considerate, and helpful.
- Comment on positive aspects of PRs as well as changes.
- Be empathetic and mindful of how your review may be received.
- Assume good intent and ask clarifying questions.
- Experienced contributors, consider pairing with new contributors whose work requires extensive changes.
-->
## 准备工作 {#before-you-begin}

在你开始评审之前：

- 阅读 [CNCF 行为准则](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)。
  确保你会始终遵从其中约定。
- 保持有礼貌、体谅他人，怀助人为乐初心。
- 评论时若给出修改建议，也要兼顾 PR 的积极方面。
- 保持同理心，多考虑他人收到评审意见时的可能反应。
- 假定大家都是好意的，通过问问题澄清意图。
- 如果你是有经验的贡献者，请考虑和新贡献者一起合作，提高其产出质量。

<!-- 
## Review process

In general, review pull requests for content and style in English. Figure 1 outlines the steps for the review process. The details for each step follow.
-->
## 评审过程  {#review-process}

一般而言，应该使用英语来评审 PR 的内容和样式。
图 1 概述了评审流程的各个步骤。
每个步骤的详细信息如下。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[开始评审]
    direction TB
    S[ ] -.-
    M[添加评论] --> N[评审变更]
    N --> O[新手应该<br>选择 Comment]
    end
    subgraph third[选择 PR]
    direction TB
    T[ ] -.-
    J[阅读描述<br>和评论]--> K[通过 Netlify 预览构建<br>来预览变更]
    end
 
  A[查阅待处理的 PR 清单]--> B[通过标签过滤<br>待处理的 PR]
  B --> third --> fourth
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,J,K,M,N,O grey
class S,T spacewhite
class third,fourth white
{{</ mermaid >}}

<!-- 
Figure 1. Review process steps.
-->
图 1. 评审流程步骤。

<!--
1. Go to [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
   You see a list of every open pull request against the Kubernetes website and docs.

2. Filter the open PRs using one or all of the following labels:

   - `cncf-cla: yes` (Recommended): PRs submitted by contributors who have not signed the CLA
     cannot be merged. See [Sign the CLA](/docs/contribute/new-content/#sign-the-cla)
     for more information.
         - `language/en` (Recommended): Filters for english language PRs only.
   - `size/<size>`: filters for PRs of a certain size. If you're new, start with smaller PRs.

    Additionally, ensure the PR isn't marked as a work in progress. PRs using the `work in progress` label are not ready for review yet.
-->
1. 前往 [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls)，
   你会看到所有针对 Kubernetes 网站和文档的待处理 PR。

2. 使用以下标签（组合）对待处理 PR 进行过滤：

   - `cncf-cla: yes`（建议）：由尚未签署 CLA 的贡献者所发起的 PR 不可以合并。
     参考[签署 CLA](/zh-cn/docs/contribute/new-content/#sign-the-cla) 以了解更多信息。
   - `language/en`（建议）：仅查看英语语言的 PR。
   - `size/<尺寸>`：过滤特定尺寸（规模）的 PR。
     如果你刚入门，可以从较小的 PR 开始。

   此外，确保 PR 没有标记为尚未完成（Work in Progress）。
   包含 `work in progress` 的 PR 通常还没准备好被评审。

<!-- 
3.  Once you've selected a PR to review, understand the change by:
   - Reading the PR description to understand the changes made, and read any linked issues
   - Reading any comments by other reviewers
   - Clicking the **Files changed** tab to see the files and lines changed
   - Previewing the changes in the Netlify preview build by scrolling to the PR's build check section at the bottom of the **Conversation** tab.
     Here's a screenshot (this shows GitHub's desktop site; if you're reviewing
     on a tablet or smartphone device, the GitHub web UI is slightly different):
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="GitHub pull request details including link to Netlify preview" >}}
     To open the preview, click on the  **Details** link of the **deploy/netlify** line in the list of checks.
-->
3. 选定 PR 评审之后，可以通过以下方式理解所作的变更：

   - 阅读 PR 描述以理解所作变更，并且阅读所有关联的 Issues。
   - 阅读其他评审人给出的评论。
   - 点击 **Files changed** Tab 页面，查看被改变的文件和代码行。
   - 滚动到 **Conversation** Tab 页面下端的 PR 构建检查节区，
     预览 Netlify 预览构建中的变更。
     以下是一个屏幕截图（这显示了 GitHub 的桌面版外观；
     如果你在平板电脑或智能手机设备上进行评审，
     GitHub 的 Web UI 会略有不同）：
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="GitHub PR 详细信息，包括 Netlify 预览链接" >}}
     要打开预览，请点击 **deploy/netlify** 行的 **Details** 链接。

<!--
4.  Go to the **Files changed** tab to start your review.

   1. Click on the `+` symbol  beside the line you want to comment on.
   1. Fill in any comments you have about the line and click either **Add single comment**
      (if you have only one comment to make) or **Start a review** (if you have multiple comments to make).
   1. When finished, click **Review changes** at the top of the page. Here, you can add
      a summary of your review (and leave some positive comments for the contributor!).
      Please always use the "Comment"

      - Avoid clicking the "Request changes" button when finishing your review.
        If you want to block a PR from being merged before some further changes are made,
        you can leave a "/hold" comment.
        Mention why you are setting a hold, and optionally specify the conditions under
        which the hold can be removed by you or other reviewers.

      - Avoid clicking the "Approve" button when finishing your review.
        Leaving a "/approve" comment is recommended most of the time.

-->
4. 前往 **Files changed** Tab 页面，开始你的评审工作。

   1. 点击你希望评论的行旁边的 `+` 号。
   1. 填写你对该行的评论，
      之后选择 **Add single comment**（如果你只有一条评论）
      或者 **Start a review**（如果你还有其他评论要添加）。
   1. 评论结束时，点击页面顶部的 **Review changes**。
      这里你可以添加你的评论结语（记得留下一些正能量的评论！）、
      根据需要批准 PR、请求作者进一步修改等等。
      新手应该选择 **Comment**。

      - 避免在完成审查后点击 "Request changes（请求修改）"按钮。
        如果在完成进一步修改之前你想阻止某 PR 被合并。你可以在评论中留下一个 “/hold”。
        同时在评论中说明你为什么要设置 Hold，并且在必要时指定在什么条件下可以由你或其他评审人取消 Hold。
      - 避免在完成审查后直接点击 "Approve（批准）"按钮。
        在大多数情况下，建议在评论区留下一个"/approve（批准）"的评论。

<!-- 
## Reviewing checklist

When reviewing, use the following as a starting point.
-->
## 评审清单  {#reviewing-checklist}

评审 PR 时可以从下面的条目入手。

<!--
### Language and grammar

- Are there any obvious errors in language or grammar? Is there a better way to phrase something?
  - Focus on the language and grammar of the parts of the page that the author is changing.
     Unless the author is clearly aiming to update the entire page, they have no obligation to
     fix every issue on the page.
  - When a PR updates an existing page, you should focus on reviewing the parts of
    the page that are being updated. That changed content should be reviewed for technical
    and editorial correctness.
    If you find errors on the page that don't directly relate to what the PR author
    is attempting to address, then it should be treated as a separate issue (check
    that there isn't an existing issue about this first).
  - Watch out for pull requests that _move_ content. If an author renames a page
    or combines two pages, we (Kubernetes SIG Docs) usually avoid asking that author to fix every grammar or spelling nit
    that we could spot within that moved content.
- Are there any complicated or archaic words which could be replaced with a simpler word?
- Are there any words, terms or phrases in use which could be replaced with a non-discriminatory alternative?
- Does the word choice and its capitalization follow the [style guide](/docs/contribute/style/style-guide/)?
- Are there long sentences which could be shorter or less complex?
- Are there any long paragraphs which might work better as a list or table?
-->
### 语言和语法 {#language-and-grammar}

- 是否存在明显的语言或语法错误？对某事的描述有更好的方式？
  - 关注作者正在更改的页面部分的语言和语法。除非作者明确打算更新整个页面，否则他们没有义务修复页面上的所有问题。
  - 当一个 PR 更新现有页面时，你应专注于评审正在更新的页面部分。你应评审所更改内容的技术和编辑的正确性。
    如果你发现页面上的一些错误与 PR 作者尝试解决的问题没有直接关系，
    则应将其视为一个单独的 Issue（首先检查是否存在与此相关的 Issue）。
  - 要特别注意那些**移动**内容的 PR。如果作者重命名一个页面或合并两个页面，
    我们（Kubernetes SIG Docs）通常应避免要求该作者修复可能在所移动的内容中发现的所有语法或拼写错误。
- 是否存在一些过于复杂晦涩的用词，本可以用简单词汇来代替？
- 是否有些用词、术语或短语可以用不带歧视性的表达方式代替？
- 用词和大小写方面是否遵从了[样式指南](/zh-cn/docs/contribute/style/style-guide/)？
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

- Did this PR change or remove a page title, slug/alias or anchor link? If so, are there broken
  links as a result of this PR? Is there another option, like changing the page title without
  changing the slug?

- Does the PR introduce a new page? If so:

  - Is the page using the right [page content type](/docs/contribute/style/page-content-types/)
    and associated Hugo shortcodes?
  - Does the page appear correctly in the section's side navigation (or at all)?
  - Should the page appear on the [Docs Home](/docs/home/) listing?

- Do the changes show up in the Netlify preview? Be particularly vigilant about lists, code
  blocks, tables, notes and images.
-->
### 网站 {#Website}

- PR 是否改变或者删除了某页面的标题、slug/别名或者链接锚点？
  如果是这样，PR 是否会导致出现新的失效链接？
  是否有其他的办法，比如改变页面标题但不改变其 slug？

- PR 是否引入新的页面？如果是：

  - 该页面是否使用了正确的[页面内容类型](/zh-cn/docs/contribute/style/page-content-types/)
    及相关联的 Hugo 短代码（shortcodes）？
  - 该页面能否在对应章节的侧面导航中显示？显示得正确么？
  - 该页面是否应出现在[网站主页面](/zh-cn/docs/home/)的列表中？

- 变更是否正确出现在 Netlify 预览中了？
  要对列表、代码段、表格、注释和图像等元素格外留心。

<!--
### Blog

- Early feedback on blog posts is welcome via a Google Doc or HackMD. Please request input early from the [#sig-docs-blog Slack channel](https://kubernetes.slack.com/archives/CJDHVD54J).
- Before reviewing blog PRs, be familiar with [Submitting blog posts and case studies](/docs/contribute/new-content/blogs-case-studies/).
-->
### 博客

- 欢迎通过 Google Doc 或 HackMD 对博客文章提供早期反馈。请尽早通过
  [#sig-docs-blog Slack 频道](https://kubernetes.slack.com/archives/CJDHVD54J)请求输入。
- 在审查博客的拉取请求（PR）之前，请熟悉[提交博客文章和案例研究](/zh-cn/docs/contribute/new-content/blogs-case-studies/)的相关指南。
<!--
- We are willing to mirror any blog article that was published to https://kubernetes.dev/blog/ (the contributor blog) provided that:
  - the mirrored article has the same publication date as the original (it should have the same publication time too, but you can also set a time stamp up to 12 hours later for special cases)
  - for PRs that arrive the original article was merged to https://kubernetes.dev/, there haven't been 
    (and won't be) any articles published to the main blog between time that the original and mirrored article 
    [will] publish. 
    This is because we don't want to add articles to people's feeds, such as RSS, except at the very end of their feed.
  - the original article doesn't contravene any strongly recommended review guidelines or community norms.
- You should set the canonical URL for the mirrored article, to the URL of the original article
  (you can use a preview to predict the URL and fill this in ahead of actual publication). Use the `canonicalUrl`
  field in [front matter](https://gohugo.io/content-management/front-matter/) for this.
-->
- 我们愿意镜像任何发布到 https://kubernetes.dev/blog/（贡献者博客）的博客文章，前提是：
  - 镜像的文章应与原文有相同的发布日期（理想情况下，发布时间也应相同，但在特殊情况下，
    可以设置一个最多晚于原时间 12 小时的时间戳）。
  - 对于那些原始文章已被合并到 https://kubernetes.dev/ 的拉取请求（PR），在原始文章和镜像文章发布之间，
    主博客上没有（也不会有）任何文章发布。这是因为我们不希望除了在 RSS 等订阅源的末端之外添加新的文章到人们的订阅源中。
  - 原始文章不应违反任何强烈推荐的审核指南或社区规范。
- 应为镜像文章设置规范URL（canonical URL），指向原始文章的URL（你可以使用预览来预测URL并在实际发布前填写）。
  为此，请在[前置元数据](https://gohugo.io/content-management/front-matter/)中使用 `canonicalUrl` 字段。
<!--
- Consider the target audience and whether the blog post is appropriate for kubernetes.io 
  For example, if the target audience are Kubernetes contributors only then kubernetes.dev
  may be more appropriate, 
  or if the blog post is on general platform engineering then it may be more suitable on another site.

  This consideration applies to mirrored articles too; although we are willing to consider all valid
  contributor articles for mirroring if a PR is opened, we don't mirror all of them.
-->
- 考虑目标受众以及博客文章是否适合发布在 kubernetes.io 上。例如，如果目标受众仅限于
  Kubernetes 贡献者，则 kubernetes.dev 可能更为合适；如果博客文章是关于通用平台工程的内容，
  则可能更适合跨站发布。

  这一考量同样适用于镜像文章；虽然我们愿意考虑镜像所有有效的贡献者文章（如果有拉取请求的话），
  我们并不会镜像所有的文章。

<!--
- We only mark blog articles as maintained (`evergreen: true` in front matter) if the Kubernetes project 
  is happy to commit to maintaining them indefinitely. Some blog articles absolutely merit this, and we 
  always mark our release announcements evergreen. Check with other contributors if you are not sure 
  how to review on this point.
-->
- 我们仅在 Kubernetes 项目愿意无限期维护某博客文章的情况下，才将其标记为持续维护状态（在前置元数据中设置
  `evergreen: true`）。某些博客文章确实值得这样做，而且我们总是将版本发布通知标记为持续维护状态。
  如果你不确定如何在此点上进行审查，请与其他贡献者确认。
<!--
- The [content guide](/docs/contribute/style/content-guide/) applies unconditionally to blog articles
  and the PRs that add them. Bear in mind that some restrictions in the guide state that they are only relevant to documentation; those restrictions don't apply to blog articles.
-->
- [内容指南](/zh-cn/docs/contribute/style/content-guide/)无条件地适用于博客文章及添加这些文章的拉取请求（PR）。
  请注意，指南中的一些限制规定仅适用于文档，并不适用于博客文章。
<!--
- The [style guide](/docs/contribute/style/style-guide/) largely also applies to blog PRs, but we make some exceptions.

  - it is OK to use “we“ in a blog article that has multiple authors, or where the article introduction clearly indicates that the author is writing on behalf of a specific group.
  - we avoid using Kubernetes shortcodes for callouts (such as `{{</* caution */>}}`)
  - statements about the future are OK, albeit we use them with care in official announcements on
    behalf of Kubernetes
  - code samples don't need to use the `{{</* code_sample */>}}` shortcode, and often it is better if they do not
  - we are OK to have authors write an article in their own writing style, so long as most readers
    would follow the point being made
-->
- [样式指南](/zh-cn/docs/contribute/style/style-guide/)大部分也适用于博客的拉取请求（PR），
  但我们做出了一些例外。

  - 在有多位作者的博客文章中，或者文章介绍明确指出作者代表特定群体写作的情况下，使用“我们”是可以接受的。
  - 我们避免使用 Kubernetes 短代码（如 `{{</* caution */>}}`）来创建提示框。
  - 关于未来的陈述是可以接受的，尽管我们在代表 Kubernetes 发布官方公告时会谨慎使用。
  - 代码示例不需要使用 `{{</* code_sample */>}}` 短代码，通常情况下不使用反而更好。
  - 只要大多数读者能够理解作者所表达的观点，我们允许作者以自己的写作风格撰写文章。
<!--
- The [diagram guide](/docs/contribute/style/diagram-guide/) is aimed at Kubernetes documentation,
  not blog articles. It is still good to align with it but:
  - we prefer SVG over raster diagram formats, and also over Mermaid (you can still capture the Mermaid source in a comment)
  - there is no need to caption diagrams as Figure 1, Figure 2 etc
-->
- [图表指南](/zh-cn/docs/contribute/style/diagram-guide/)主要针对 Kubernetes 文档，
  而不是博客文章。尽管如此，保持一致仍然是好的，但是：
  - 我们更倾向于使用 SVG 而不是栅格图像格式，也优于 Mermaid（你仍然可以在注释中保留 Mermaid 源码）。
  - 不需要将图表标注为图 1、图 2 等。

<!--
### Other

- Watch out for [trivial edits](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits);
  if you see a change that you think is a trivial edit, please point out that policy
  (it's still OK to accept the change if it is genuinely an improvement).
- Encourage authors who are making whitespace fixes to do
  so in the first commit of their PR, and then add other changes on top of that. This
  makes both merges and reviews easier. Watch out especially for a trivial change that
  happens in a single commit along with a large amount of whitespace cleanup
  (and if you see that, encourage the author to fix it).
-->
### 其他 {#other}

- 查阅 [Trivial Edits](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)；
  如果你看到某个变更在你看来是一个 Trivial Edit，请向作者指明这项政策（如果该变更确实会有所改进，那仍然可以接受）。
- 鼓励作者们在第一次发 PR 时修复一些空格相关的问题，在随后的 PR 中增加其他更改。
  这样更便于合并和评审。尤其要注意在单个 commit 中大量空格清理附带的微小变更（如果你看到，请鼓励作者进行修复）。

<!--
As a reviewer, if you identify small issues with a PR that aren't essential to the meaning,
such as typos or incorrect whitespace, prefix your comments with `nit:`.
This lets the author know that this part of your feedback is non-critical.

If you are considering a pull request for approval and all the remaining feedback is
marked as a nit, you can merge the PR anyway. In that case, it's often useful to open
an issue about the remaining nits. Consider whether you're able to meet the requirements
for marking that new issue as a [Good First Issue](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue); if you can, these are a good source.
-->
作为一名 Reviewer，如果你发现 PR 有一些无关紧要的小问题，例如拼写错误或不正确的空格，
可以在你的评论前面加上 `nit:`。这样做可以让作者知道该问题不是一个不得了的大问题。

如果你正在考虑批准一个 PR，并且所有剩余的反馈都被标记为 nit，那么你确实可以合并该 PR。
在这种情况下，你需要针对剩余的 nit 发帖登记一个 Issue。
考虑一下是否能把这些新 Issue 标记为
[Good First Issue](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue)。
如果可以，这就是这类 Issue 的良好来源。
