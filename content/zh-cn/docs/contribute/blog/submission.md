---
title: 给 Kubernetes 博客提交文章
slug: article-submission
content_type: concept
weight: 30
---
<!--
title: Submitting articles to Kubernetes blogs
slug: article-submission
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
There are two official Kubernetes blogs, and the CNCF has its own blog where you can cover Kubernetes too.
For the [main Kubernetes blog](/docs/contribute/blog/), we (the Kubernetes project) like to publish articles with different perspectives and special focuses, that have a link to Kubernetes.

With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.
-->
Kubernetes 有两个官方博客，CNCF 也有自己的博客频道，你也可以在 CNCF 博客频道上发布与
Kubernetes 相关的内容。对于 [Kubernetes 主博客](/zh-cn/docs/contribute/blog/)，
我们（Kubernetes 项目组）希望发布与 Kubernetes 有关联的具有不同视角和独特关注点的文章。

除非有特殊情况，我们只发布尚未在其他任何地方投稿或发布的内容。

<!-- body -->

<!--
## Writing for the Kubernetes blog(s)

As an author, you have three different routes towards publication.
-->
## 为 Kubernetes 博客撰写文章   {#writing-for-the-kubernetes-blogs}

作为一名作者，你有三个渠道来发表文章。

<!--
### Recommended route {#route-1}

The approach the Kubernetes project recommends is: pitch your article by contacting the blog team. You can do that via Kubernetes Slack ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J)).
For articles that you want to publish to the contributor blog only, you can also pitch directly
to [SIG ContribEx comms](https://kubernetes.slack.com/archives/C03KT3SUJ20).
-->
### 推荐的渠道   {#route-1}

Kubernetes 项目推荐的方式是：联系并向博客团队投稿。你可以通过 Kubernetes Slack 频道
[#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J) 联系他们。
如果你希望文章仅发布在贡献者博客上，也可以直接向
[SIG ContribEx 委员会](https://kubernetes.slack.com/archives/C03KT3SUJ20)投稿。

<!-- FIXME: or using this [form] -->

<!--
Unless there's a problem with your submission, the blog team / SIG ContribEx will pair you up with:

* a blog _editor_
* your _writing buddy_ (another blog author)
-->
除非你的投稿有问题，否则博客团队或 SIG ContribEx 会为你分配：

* 一位博客**编辑**
* 一位**写作搭档**（另一位博客作者）

<!--
When the team pairs you up with another author, the idea is that you both support each other by
reviewing the other author's draft article. You don't need to be a subject matter expert; most of
the people who read the article also won't be experts. We, the Kubernetes blog team, call the other author a writing buddy.

The editor is there to help you along the journey from draft to publication. They will either be
directly able to approve your article for publication, or can arrange for the approval to happen.

Read [authoring a blog article](#authoring) to learn more about the process.
-->
之所以为你分配另一位作者配对，是为了让你们互相支持，互相审阅彼此的文章草稿。
你并不需要非得是某个主题类的专家；大多数读者也不是专家。
Kubernetes 博客团队把为你分配的另一位作者称为“写作搭档”。

编辑会协助你完成从草稿到发表的整个过程。他们可以直接批准文章发布，或安排他人进行批准。

参阅[撰写博客文章](#authoring)以了解更多流程信息。

<!--
### Starting with a pull request {#route-2}

The second route to writing for our blogs is to start directly with a pull request in GitHub. The
blog team actually don't recommend this; GitHub is quite useful for collaborating on code,
but isn't an ideal fit for prose text.
-->
### 渠道 2：提交 PR   {#route-2}

第二种撰写博客的渠道是直接在 GitHub 提交 PR。
不过博客团队并不推荐这种方式；GitHub 很适合协作开发代码，但不太适合处理纯文本写作。

<!--
It's absolutely fine to open a placeholder pull request with just an empty commit, and then
work elsewhere before returning to your placeholder PR.

Similar to the [recommended route](#route-1), we'll try to pair you up with a writing buddy
and a blog editor. They'll help you get the article ready for publication.
-->
你完全可以先提交一个不包含任何 Commit 的占位 PR，然后在其他地方写好后再把文章推送到此 PR。

与[推荐渠道](#route-1)类似，我们会尝试为你配对一位写作搭档和一位博客编辑。
他们会协助你让文章达到发布就绪的状态。

<!--
### Post-release blog article process {#route-3-post-release-comms}

The third route is for blog articles about changes in Kubernetes relating to a release. Each
time there is a release, the Release Comms team takes over the blog publication schedule. People
adding features to a release, or who are planning other changes that the project needs to announce, can
liaise with Release Comms to get their article planned, drafted, edited, and eventually published.
-->
### 渠道 3：发版后的博文流程  {#route-3-post-release-comms}

第三种渠道适合 Kubernetes 新版本发版时讲述版本变更的博客文章。
Kubernetes 每次发版时，Release Comms 团队会接手管理博客发布日程。
如果你是为某个版本添加特性的人员或计划发布项目所需其他变更的人员，
可以联络 Release Comms，规划、撰写、编辑并最终发布博客文章。

<!--
## Article scheduling

For the Kubernetes blog, the blog team usually schedules blog articles to publish on weekdays
(Gregorian calendar, as used in the USA and other countries). When it's important to publish on
a specific date that falls on a weekend, the blog team try to accommodate that.
-->
## 文章时间安排   {#article-scheduling}

对于 Kubernetes 博客，博客团队通常安排在工作日（美国等国家使用的公历）发布文章。
如果很重要，有必要在周末发布文章，博客团队会尽力配合。

<!--
The section on [authoring a blog article](#authoring) explains what to do:

* initially, don't specify a date for the article
* however, do set the article as draft (put `draft: true` in the front matter)
-->
在[撰写博客文章](#authoring)一节中说明了：

* 起初无需指定文章的发布日期
* 但需要将文章标记为 Draft（在 Front Matter 中添加 `draft: true`）

<!--
When the Prow bot merges the PR you write, it will be a draft and won't be set to publish. A
Kubernetes contributor (either you, your writing buddy or someone from the blog team) then opens a small
follow-up PR that marks it for publication. Merging that second PR releases the previously-draft
article so that it can automatically publish.

On the day the article is scheduled to publish, automation triggers a website build and your
article becomes visible.
-->
当 Prow 机器人处理你提交的 PR 时，起初它是一个 Draft（草稿），不会设置为待发布。
随后 Kubernetes 的一名贡献者（你、你的写作搭档或博客团队的其他人）会提交一个小的跟进 PR，将你的 PR 标记为待发布。
Prow 机器人接受第二个跟进 PR 后会修改之前标记为 Draft 的文章状态，这样你的 PR 就可以自动发布。

到了文章计划发布的那一天后，自动化流程会触发网站构建，让你的文章对大众可见。

<!--
## Authoring an article {#authoring}

After you've pitched, we'll encourage you to use either HackMD (a web Markdown editor) or a
Google doc, to share an editable version of the article text. Your writing buddy can read your
draft text and then either directly make suggestions or provide other feedback. They should
also let you know if what you're drafting feedback isn't in line with the
[blog guidelines](/docs/contribute/blog/guidelines/).

At the same time, you'll normally be **their** writing buddy and can follow our
[guide](/docs/contribute/blog/writing-buddy/) about supporting their work.
-->
## 撰写文章 {#authoring}

在你投稿之后，我们会鼓励你使用 HackMD（一种 Web 版 Markdown 编辑器）或 Google 文档来分享可编辑版本的文章。
你的写作搭档可以阅读你的草稿文字，并直接提出建议或反馈。
如果你写的内容不符合[博客指南](/zh-cn/docs/contribute/blog/guidelines/)，他们也会指出来。

同时，你通常也会是他们的写作搭档，
可以参考我们的[写作搭档指南](/zh-cn/docs/contribute/blog/writing-buddy/)支持他们的工作。

<!--
### Initial administrative steps

You should [sign the CLA](/docs/contribute/new-content/#contributing-basics)
if you have not yet done so. It is best to make sure you start this early on; if you are
writing as part of your job, you may need to check with the workplace legal team or with
your manager, to make sure that you are allowed to sign.
-->
### 初始管理步骤   {#initial-administrative-steps}

如果你尚未[签署 CLA](/zh-cn/docs/contribute/new-content/#contributing-basics)，应当先签署 CLA。
最好尽早完成 CLA 的签署。如果你是在工作岗位上把撰写文章作为一部分工作，
你可能需要与公司法律团队或上级主管确认你是否允许签署 CLA。

<!--
### Initial drafting

The blog team recommends that you either use HackMD (a web Markdown editor) or a
Google doc, to prepare and share an initial, live-editable version of the article text.
-->
### 草拟初稿   {#intial-drafting}

博客团队建议你使用 HackMD（一个 Web 版的 Markdown 编辑器）或 Google 文档来准备和分享可编辑版本的文章初稿。

{{< note >}}
<!--
If you choose to use Google Docs, you can set your document into Markdown mode.
-->
如果你选择使用 Google 文档，你可以将文档切换至 Markdown 模式。
{{< /note >}}

<!--
Your writing buddy can provide comments and / or feedback for your draft text and
will (or should) check that it's in line with the guidelines. At the same time, you'll
be their writing buddy and can follow the [guide](/docs/contribute/blog/editing/#writing-buddies)
that explains how you'll be supporting their work.
-->
你的写作搭档可以对你的草稿文字进行评论和反馈，并检查是否符合博客指南。
与此同时，你也是他们的写作搭档，
参考[编辑指南](/zh-cn/docs/contribute/blog/editing/#writing-buddies)了解如何支持搭档的工作。

<!--
Don't worry too much at this stage about getting the Markdown formatting exactly right, though.

If you have images, you can paste in a bitmap copy for early feedback. The blog team can help
you (later in the process), to get illustrations ready for final publication.
-->
你在这个阶段无需顾虑 Markdown 格式是否完美。

如果有图片，你可以粘贴位图副本获取初期反馈。博客团队会（在后续流程中）协助你让插图达到最终发布状态。

<!--
### Markdown for publication

Have a look at the Markdown format for existing blog posts in the
[website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts)
in GitHub.
-->
### Markdown 发布

你可以参考 GitHub 中已有博客文章的 Markdown 格式：
[网站仓库](https://github.com/kubernetes/website/tree/master/content/zh-cn/blog/_posts)。

<!--
If you're not already familiar, read [contributing basics](/docs/contribute/new-content/#contributing-basics).
This section of the page assumes that you don't have a local clone of your fork and that you
are working within the GitHub web UI.
You do need to make a remote fork of the website repository if you haven't already done so.
-->
如果你还不熟悉，参阅[贡献基本知识](/zh-cn/docs/contribute/new-content/#contributing-basics)。
本节假设你没有本地克隆的 Fork，假设你是通过 GitHub 网页 UI 操作的。
如果你还未这样操作，你需要先远程 Fork 网站仓库。

<!--
In the GitHub repository, click the **Create new file** button. Copy your existing content
from HackMD or Google Docs, then paste it into the editor.
There are more details later in the section about what goes into that file.
Name the file to match the proposed title of the blog post, but don’t put the date in the file name.
The blog reviewers will work with you to set the final file name and the date when the article will be published.
-->
在 GitHub 仓库中，点击 **Create new file** 按钮。
复制 HackMD 或 Google Docs 上写好的内容，粘贴到编辑器中。
下文会说明有关如何进入该文件的更多细节。
此文件的命名应与拟定的博客文章标题相匹配，但**不要**在文件名中包含日期。
博客审阅人员会与你一起确定最终文件名和文章发布日期。

<!--
1. When you save the file, GitHub will walk you through the pull request process.

2. Your writing buddy can review your submission and work with you on feedback and final details.
   A blog editor approves your pull request to merge, as a draft that is not yet scheduled.
-->
1. 你在保存文件时，GitHub 会引导你完成 PR 流程。

2. 你的写作搭档会审阅你提交的 PR，并与你协作处理反馈和最终细节。
   博客编辑会将你的 PR 作为未排期的草稿批准合并。

<!--
#### Front matter

The Markdown file you write should use YAML-format Hugo
[front matter](https://gohugo.io/content-management/front-matter/).

Here's an example:
-->
#### Front Matter

你撰写的 Markdown 文件应使用 YAML 格式的 Hugo
[Front Matter](https://gohugo.io/content-management/front-matter/)。

以下是一个例子：

<!--
```yaml
---
layout: blog
title: "Your Title Here"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: lowercase-text-for-link-goes-here-no-spaces # optional
author: >
  Author-1 (Affiliation),
  Author-2 (Affiliation),
  Author-3 (Affiliation)
---
```
-->
```yaml
---
layout: blog
title: "你的文章标题"
draft: true # 发布前会改为 date: YYYY-MM-DD
slug: 小写文字组成的不含空格的链接放在这里 # 可选
author: >
  作者 1（所属机构）,
  作者 2（所属机构）,
  作者 3（所属机构）
---
```

<!--
* initially, don't specify a date for the article
* however, do set the article as draft (put `draft: true` in the
  article [front matter](https://gohugo.io/content-management/front-matter/))
-->
* 起初无需指定文章的发布日期
* 但需要将文章标记为 Draft（在
  [Front Matter](https://gohugo.io/content-management/front-matter/) 中添加 `draft: true`）

<!--
#### Article content

Make sure to use second-level Markdown headings (`##` not `#`) as the topmost heading level in
the article. The `title` you set in the front matter becomes the first-level heading for that
page.

You should follow the [style guide](https://kubernetes.io/docs/contribute/style/style-guide/),
but with the following exceptions:
-->
#### 正文内容

确保使用二级 Markdown 标题（`##`，不要用 `#`）作为正文的最顶级标题。
你在 Front Matter 中设置的 `title` 会作为该页面的一级标题。

你应遵循[风格指南](/zh-cn/docs/contribute/style/style-guide/)，但以下例外：

<!--
- we are OK to have authors write an article in their own writing style, so long as most readers
  would follow the point being made
- it is OK to use “we“ in a blog article that has multiple authors, or where the article introduction clearly indicates that the author is writing on behalf of a specific group.
  As you'll notice from this section, although we [avoid using “we”](/docs/contribute/style/style-guide/#avoid-using-we) in our documentation,
  it's OK to make justifiable exceptions.
-->
- 我们允许作者采用自己的写作风格，只要大多数读者能理解要点就行。
- 对于有多位作者的博客文章，或文章开头已明确说明是代表某组织撰写的，可以使用“我们”。
  如本节所见，虽然我们在文档中[不推荐使用“我们”](/zh-cn/docs/contribute/style/style-guide/#avoid-using-we)这样的表述，
  但也可以有一些例外。
<!--
- we avoid using Kubernetes shortcodes for callouts (such as `{{</* caution */>}}`). This is
  because callouts are aimed at documentation readers, and blog articles aren't documentation.
- statements about the future are OK, albeit we use them with care in official announcements on
  behalf of Kubernetes
- code samples used in blog articles don't need to use the `{{</* code_sample */>}}` shortcode, and often
  it is better (easier to maintain) if they do not
-->
- 避免使用 Kubernetes 短代码（如 `{{</* caution */>}}`）做提醒。
  这是因为提醒主要面向的是文档读者，而博客文章并不是文档。
- 对未来的预测性陈述是允许的，但代表 Kubernetes 的官方公告中应慎用。
- 博客文章中所用的代码示例无需使用 `{{</* code_sample */>}}` 短代码，通常直接展示更便于维护。

<!--
#### Diagrams and illustrations {#illustrations}

For illustrations, diagrams or charts, use the [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure) can be used where feasible. You should set an `alt` attribute for accessibility.
-->
#### 图表与插图 {#illustrations}

如使用图表、插图或图示，推荐使用
[figure shortcode](https://gohugo.io/content-management/shortcodes/#figure)。
你应该设置 `alt` 属性以避免访问速度不佳的问题。

<!--
For illustrations and technical diagrams, try to use vector graphics. The blog team recommend SVG over raster (bitmap / pixel)
diagram formats, and also recommend SVG rather than Mermaid (you can still capture the Mermaid source in a comment).
The preference for SVG over Mermaid is because when maintainers upgrade Mermaid or make changes to diagram rendering, they may not have an easy way to contact the original blog article author to check that the changes are OK.
-->
对于插图或技术图表，应尽量使用矢量图。
博客团队推荐使用 SVG，而非光栅（位图）格式或 Mermaid（但你可以将 Mermaid 源代码作为注释保留）。
我们倾向于 SVG 而非 Mermaid，是因为当维护者升级 Mermaid 或调整图表渲染时，往往无法联系到原文作者确认变更是否合适。

<!--
The [diagram guide](/docs/contribute/style/diagram-guide/) is aimed at Kubernetes documentation,
  not blog articles. It is still good to align with it but:
- there is no need to caption diagrams as Figure 1, Figure 2, etc.

The requirement for scalable (vector) imanges makes the process more difficult for
less-familiar folks to submit articles; Kubernetes SIG Docs continues to look for ways to
lower this bar.
If you have ideas on how to lower the barrier, please volunteer to help out.
-->
[图表指南](/zh-cn/docs/contribute/style/diagram-guide/)主要面向 Kubernetes 文档，而非博客文章。
你可以参考，但：

* 无需为图表编号（如图 1、图 2 等）

因为矢量图要求较高，可能对不熟悉流程的投稿人造成困难；
Kubernetes SIG Docs 正在寻找降低门槛的方法。
如果你有降低门槛的好主意，欢迎志愿者帮助解决这个问题。

<!-- note to maintainers of this page: vector images are easier to localize and
     are resolution independent, so can look consistently good on different screens -->

<!--
For other images (such as photos), the blog team strongly encourages use of `alt` attributes.
It is OK to use an empty `alt` attribute if accessibility software should not mention the
image at all, but this is a rare situation.
-->
对于照片等其他图像，博客团队强烈建议使用 `alt` 属性。
如果不希望辅助工具读出图片内容，也可以使用空的 `alt` 属性，但这种情况较少见。

<!--
#### Commit messages

At the point you mark your pull request ready for review, each commit message should be a
short summary of the work being done. The first commit message should make sense as an overall
description of the blog post.
-->
#### Commit 消息

当你标记 PR 为“Ready for review”时，每条 Commit 消息应简明总结工作内容。
第一条 Commit 消息应能大致描述整篇博文内容。

<!--
Examples of a good commit message:

- _Add blog post on the foo kubernetes feature_
- _blog: foobar announcement_
-->
良好的 Commit 消息示例：

- _Add blog post on the foo kubernetes feature_
- _blog: foobar announcement_

<!--
Examples of bad commit messages:

- _Placeholder commit for announcement about foo_
- _Add blog post_
- _asdf_
- _initial commit_
- _draft post_
-->
不好的 Commit 消息示例：

- _Placeholder commit for announcement about foo_
- _Add blog post_
- _asdf_
- _initial commit_
- _draft post_

<!--
#### Squashing

Once you think the article is ready to merge, you should
[squash](https://www.k8s.dev/docs/guide/pull-requests/#squashing) the commits in your pull
request; if you're not sure how to, it's OK to ask the blog team for help.
-->
#### 压缩 Commit

当你认为文章已准备好合并时，应[压缩（Squash）](https://www.k8s.dev/docs/guide/pull-requests/#squashing)
PR 中的 Commit。如果你不清楚如何操作，可以请博客团队协助。
