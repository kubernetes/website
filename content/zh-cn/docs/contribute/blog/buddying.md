---
title: 作为博客写作伙伴提供帮助
slug: writing-buddy
content_type: concept
weight: 70
---
<!--
title: Helping as a blog writing buddy
slug: writing-buddy
content_type: concept
weight: 70
-->

<!-- overview -->

<!--
There are two official Kubernetes blogs, and the CNCF has its own blog where you can cover Kubernetes too.
Read [contributing to Kubernetes blogs](/docs/contribute/blog/) to learn about these two blogs.

When people contribute to either blog as an author, the Kubernetes project pairs up authors
as _writing buddies_. This page explains how to fulfil the buddy role.

You should make sure that you have at least read an outline of [article submission](/docs/contribute/blog/submission/)
before you read on within this page.
-->
Kubernetes 有两个官方博客，同时 CNCF 也有自己的博客，你也可以在其中撰写与 Kubernetes 相关的内容。  
阅读[为 Kubernetes 博客贡献内容](/zh-cn/docs/contribute/blog/)以了解这两个博客的详细信息。

当人们作为作者为任一博客撰稿时，Kubernetes 项目会将作者配对为**写作伙伴**。
本页面解释了如何履行伙伴角色。

在继续阅读本页面之前，你应该确保至少已经阅读了[文章提交](/zh-cn/docs/contribute/blog/submission/)的概述。

<!-- body -->

<!--
## Buddy responsibilities

As a writing buddy, you:

* help the blog team get articles ready to merge and to publish
* support your buddy to produce content that is good to merge
* provide a review on the article that your buddy has written
-->
## 伙伴职责

作为写作伙伴，你的职责包括：

* 协助博客团队准备文章，使其达到可合并和发布的状态；
* 支持你的伙伴创作高质量的内容，确保其适合合并；
* 对你伙伴撰写的文章提供审阅意见。

<!--
When the team pairs you up with another author, the idea is that you both support each other by
reviewing the other author's draft article.
Most people reading articles on the Kubernetes blog are not experts; the content should
try to make sense for that audience, or at least to support non-expert readers appropriately.

The blog team are also there to help you both along the journey from draft to publication.
They will either be directly able to approve your article for publication, or can arrange for
the approval to happen.
-->
当团队将你与另一位作者配对时，理念是你们通过互相审阅对方的草稿文章来彼此支持。
大多数阅读 Kubernetes 博客文章的读者并非专家；
内容应当尝试为这类读者群体提供易于理解的信息，或者至少适当地支持非专家读者。

博客团队也会在整个从草稿到发布的流程中帮助你们。他们可以直接批准你的文章发布，
或者安排相应的批准流程。

<!--
## Supporting the blog team

Your main responsibility here is to communicate about your capacity, availability and progress
in a reasonable timeline. If many weeks go by and your buddy hasn't heard from you, it makes
the overall work take more time.
-->
## 支持博客团队

你的主要职责是及时沟通你的工作量、可用时间以及进展情况。如果几周过去了，
你的伙伴还没有收到你的消息，这将会导致整体工作花费更多的时间。

<!--
## Supporting your buddy

There are two parts to the process
-->
## 支持你的伙伴

支持伙伴的过程分为两个部分：

{{< tabs name="buddy_support" >}}
{{% tab name="协同编辑" %}}
<!--
**(This is the recommended option)**

The blog team recommend that the main author for the article sets up collaborative editing
using either a Google Doc or HackMD (their choice). The main author then shares that document
with the following people:

 * Any co-authors
 * You (their writing buddy)
 * Ideally, with a nominated
person from the blog team.
-->
**（这是推荐的选项）**

博客团队建议文章的主要作者通过 Google Doc 或 HackMD（由作者选择）构造协作编辑环境。
之后，主作者将该文档共享给以下人员：

- 所有共同作者  
- 你（他们的写作伙伴）  
- 理想情况下，还应包括一位博客团队中指定的负责人。

<!--
As a writing buddy, you then read the draft text and either directly make suggestions or provide
feedback in a different way. The author of the blog is very commonly also **your** writing buddy in turn, so they will provide the
same kind of feedback on the draft for your blog article.
-->
作为写作伙伴，你需要阅读草稿内容，并直接提出建议或以其他方式提供反馈。
博客文章的作者通常也会反过来成为**你的**写作伙伴，
因此他们会针对你所撰写的文章草稿提供类似的反馈。

<!--
Your role here is to recommend the smallest set of changes that will get the article look good
for publication. If there's a diagram that really doesn't make sense, or the writing is really
unclear: provide feedback. If you have a slight different of opinion about wording or punctuation,
skip it. Let the article author(s) write in their own style, provided that they align to
the [blog guidelines](/docs/contribute/blog/guidelines/).

After this is ready, the lead author will open a pull request and use Markdown to submit the
article. You then provide a [review](#pull-request-review).
-->
你的角色是推荐最小的修改集，以使文章适合发布。如果某个图表完全无法理解，
或者文字表达非常不清晰，请提供反馈。如果你对措辞或标点符号有轻微的不同意见，
请忽略它。只要符合[博客指南](/zh-cn/docs/contribute/blog/guidelines/)，
让文章作者以他们自己的风格写作即可。

在此完成后，主作者将发起一个 PR 并使用 Markdown 提交文章。
然后你可以提供[审阅](#pull-request-review)意见。

{{% /tab %}}
{{% tab name="Markdown / Git 编辑" %}}
<!--
Some authors prefer to start with
[collaborative editing](#buddy-support-0); others like to go straight into
GitHub.

Whichever route they take, your role is to provide feedback that lets the blog team provide
a simple signoff and confirm that the article can merge as a draft. See
[submitting articles to Kubernetes blogs](/docs/contribute/blog/submission/) for what the authors
need to do.
-->
一些作者更喜欢从[协同编辑](#buddy-support-0)开始，
而另一些人则喜欢直接进入 GitHub。

无论他们选择哪种方式，你的角色是提供反馈，使博客团队能够轻松完成审核，
并确认文章可以作为草稿合并。有关作者需要完成的操作，
请参阅[向 Kubernetes 博客提交文章](/zh-cn/docs/contribute/blog/submission/)。

<!--
Use GitHub suggestions to point out any required changes.

Once the Markdown and other content (such as images) look right, you provide a
formal [review](#pull-request-review).
-->
使用 GitHub 的建议功能指出需要修改的地方。

一旦 Markdown 文件和其他内容（例如图片）看起来没有问题，
你就可以提供正式的[审阅](#pull-request-review)意见。

{{% /tab %}}
{{< /tabs >}}

<!--
## Pull request review

Follow the [blog](/docs/contribute/review/reviewing-prs/#blog) section of _Reviewing pull requests_.

When you think that the open blog pull request is good enough to merge, add the `/lgtm` comment to the pull request.
-->
## 审阅 PR

遵循**审阅 PR **一文的[博客](/zh-cn/docs/contribute/review/reviewing-prs/#blog)部分所给的要求。

当你认为所发起的博客 PR 足够好可以合并时，在 PR 中添加 `/lgtm` 评论。

<!--
This indicates to the repository automation tooling (Prow) that the content "looks good to me". Prow moves things forward. The `/lgtm` command lets you add your opinion to the record whether or not you are formally a member of the Kubernetes project.

Either you or the article author(s) should let the blog team know that there is an article
ready for signoff. It should already be marked as `draft: true` in the front matter, as
explained in the submission guidance.
-->
这一注释向仓库自动化工具（Prow）内容申明内容“在我看来没有问题”。
Prow 会推进相关流程。`/lgtm` 命令允许你将自己的意见公开出来，
无论你是否正式成为 Kubernetes 项目的一员。

你或文章作者应通知博客团队有文章已准备好进行签发。根据提交指南，
文章前面应已标记为 `draft: true`。

<!--
## Subsequent steps

For you as a writing buddy, **there is no step four**. Once the pull request is good to merge,
the blog team (or, for the contributor site, the contributor comms team) take things from there.
It's possible that you'll need to return to an earlier step based on feedback, but you can usually expect that your work as a buddy is done.
-->
## 后续步骤

作为写作伙伴，**没有第四步**。一旦 PR 准备好合并，
博客团队（或者，对于贡献者网站，贡献者通信团队）将会接手。
根据反馈，你可能需要返回到前面的步骤，但通常你可以认为作为伙伴的工作已经完成。
