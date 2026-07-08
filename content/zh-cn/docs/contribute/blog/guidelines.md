---
title: 博客指南
content_type: concept
weight: 40
---
<!--
title: Blog guidelines
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
These guidelines cover the main Kubernetes blog and the Kubernetes
contributor blog.

All blog content must also adhere to the overall policy in the
[content guide](/docs/contribute/style/content-guide/).
-->
这些指南涵盖了 Kubernetes 主博客和 Kubernetes 贡献者博客。

所有博客内容还必须遵循[内容指南](/zh-cn/docs/contribute/style/content-guide/)中的总体政策。

# {{% heading "prerequisites" %}}

<!--
Make sure you are familiar with the introduction sections of
[contributing to Kubernetes blogs](/docs/contribute/blog/), not just to learn about
the two official blogs and the differences between them, but also to get an overview
of the process.
-->
确保你熟悉[为 Kubernetes 博客贡献内容](/zh-cn/docs/contribute/blog/)的介绍部分，
不仅是为了了解两个官方博客及其之间的区别，也是为了对整个过程有一个概览。

<!--
## Original content

The Kubernetes project accepts **original content only**, in English.
-->
Kubernetes 项目仅接受**原创内容**，且必须为英文。

{{< note >}}
<!--
The Kubernetes project cannot accept content for the blog if it has already been submitted
or published outside of the Kubernetes project.

The official blogs are not available as a medium to repurpose existing content from any third
party as new content.
-->
如果内容已经提交或在 Kubernetes 项目之外发布，
Kubernetes 项目则不能接受该内容用于博客。

官方博客不作为第三方重新利用已有内容并将其作为新内容发布的媒介。
{{< /note >}}

<!--
This restriction even carries across to promoting other Linux Foundation and CNCF projects.
Many CNCF projects have their own blog. These are often a better choice for posts about a specific
project, even if that other project is designed specifically to work with Kubernetes (or with Linux,
etc).
-->
这一限制甚至延伸至推广其他 Linux 基金会和 CNCF 项目。
许多 CNCF 项目都有自己的博客。对于特定项目的帖子，这些博客通常是更好的选择，
即使那个其他项目是专门为与 Kubernetes （或与 Linux 等）协同工作而设计的。

<!--
## Relevant content

Articles must contain content that applies broadly to the Kubernetes community. For example, a
submission should focus on upstream Kubernetes as opposed to vendor-specific configurations.
For articles submitted to the main blog that are not
[mirror articles](/docs/contribute/blog/mirroring/), hyperlinks in the article should commonly
be to the official Kubernetes documentation. When making external references, links should be
diverse - for example, a submission shouldn't contain only links back to a single company's blog.
-->
## 相关内容

文章必须包含适用于整个 Kubernetes 社区的内容。例如，投稿应侧重于上游
Kubernetes，而不是特定供应商的配置。
对于提交到主博客且不是[镜像文章](/zh-cn/docs/contribute/blog/mirroring/)的文章，
文章中的超链接应通常指向官方 Kubernetes 文档。
在进行外部引用时，链接应该是多样的 - 例如，投稿不应只包含返回单个公司博客的链接。

<!--
The official Kubernetes blogs are **not** the place for vendor pitches or for articles that promote
a specific solution from outside Kubernetes.

Sometimes this is a delicate balance. You can ask in Slack ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J))
for guidance on whether a post is appropriate for the Kubernetes blog and / or contributor blog -
don't hesitate to reach out.

The [content guide](/docs/contribute/style/content-guide/) applies unconditionally to blog articles
and the PRs that add them. Bear in mind that some restrictions in the guide state that they are only relevant to documentation; those marked restrictions don't apply to blog articles.
-->
官方 Kubernetes 博客**不**是进行供应商宣传或推广 Kubernetes 外部特定解决方案的地方。

有时，这之间的平衡很微妙。你可以在 Slack （[#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J)）
上询问某篇文章是否适合发布在 Kubernetes 博客和/或贡献者博客 - 不要犹豫，随时联系。

[内容指南](/zh-cn/docs/contribute/style/content-guide/)无条件适用于博客文章及其添加的 PR。
请记住，指南中的一些限制仅与文档相关；那些标记的限制不适用于博客文章。

<!--
## Localization

The website is localized into many languages; English is the “upstream” for all the other
localizations. Even if you speak another language and would be happy to provide a localization,
that should be in a separate pull request (see [languages per PR](/docs/contribute/new-content/#languages-per-pr)).
-->
## 本地化

网站已被本地化为多种语言；英文是所有其他本地化的“上游”。即使你懂另一种语言并愿意提供本地化，
这也应该是一个单独的 PR（参见[每个 PR 的语言](/zh-cn/docs/contribute/new-content/#languages-per-pr)）。

<!--
## Copyright and reuse

You must write [original content](#original-content) and you must have permission to license
that content to the Cloud Native Computing Foundation (so that the Kubernetes project can
legally publish it).
This means that not only is direct plagiarism forbidden, you cannot write a blog article if
you don't have permission to meet the CNCF copyright license conditions (for example, if your
employer has a policy about intellectual property that restricts what you are allowed to do).

The [license](https://github.com/kubernetes/website/blob/main/LICENSE) for the blog allows
commercial use of the content for commercial purposes, but not the other way around.
-->
## 版权和重用

你必须编写[原创内容](#original-content)，
并且你必须拥有将该内容授权给云原生计算基金会（Cloud Native Computing Foundation）
的权限（这样 Kubernetes 项目才能合法发布它）。
这意味着不仅直接抄袭是被禁止的，如果你没有权限满足 CNCF 版权许可条件
（例如，如果你的雇主有关于知识产权的政策限制了你能做的事情），
你也不能撰写博客文章。

[license](https://github.com/kubernetes/website/blob/main/LICENSE)
允许将博客的内容用于商业目的，但反之则不然。

<!--
## Special interest groups and working groups

Topics related to participation in or results of Kubernetes SIG activities are always on
topic (see the work in the [Contributor Comms Team](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)
for support on these posts).

The project typically [mirrors](/docs/contribute/blog/mirroring/) these articles to both blogs.
-->
## 特别兴趣小组和工作组

与参与 Kubernetes SIG 活动或其成果相关的主题总是合适的
（参见[贡献者通讯团队](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)中的工作以获得这些帖子的支持）。

该项目通常会将这些文章[镜像](/zh-cn/docs/contribute/blog/mirroring/)到两个博客上。

<!--
## National restrictions on content

The Kubernetes website has an Internet Content Provider (ICP) licence from the government of China. Although it's unlikely to be a problem, Kubernetes cannot publish articles that would be blocked by the Chinese government's official filtering of internet content.
-->
## 国家对内容的限制

Kubernetes 网站拥有中国政府颁发的互联网内容提供者（ICP）许可证。
Kubernetes 不能发布那些会被中国政府官方网络内容过滤系统阻止的文章
（尽管这种情况不太可能发生）。

<!--
## Blog-specific content guidance {#what-we-publish}

As well as the general [style guide](/docs/contribute/style/style-guide/), blog articles should (not must) align to
the [blog-specific style recommendations](/docs/contribute/blog/article-submission/#article-content).

The remainder of this page is additional guidance; these are not strict rules that articles
must follow, but reviewers are likely to (and should) ask for edits to articles that are
obviously not aligned with the recommendations here.
-->
## 博客特定内容指南   {#what-we-publish}

除了通用的[风格指南](/zh-cn/docs/contribute/style/style-guide/)外，
博客文章应该（但不是必须）遵循
[博客特定风格建议](/zh-cn/docs/contribute/blog/article-submission/#article-content)。

本页面其余部分为附加指南；这些并不是文章必须遵守的严格规则，但如果文章明显不符合这里的建议，
审稿人可能会（也应该）要求对文章进行编辑。

<!--
### Diagrams and illustrations {#illustrations}

For [illustrations](/docs/contribute/blog/article-submission/#illustrations) - including diagrams or charts - use the [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure)
where feasible. You should set an `alt` attribute for accessibility.
-->
### 图表和插图   {#illustrations}

对于[插图](/zh-cn/docs/contribute/blog/article-submission/#illustrations)
—— 包括图表或图形
—— 在可行的情况下，使用[图形简码](https://gohugo.io/content-management/shortcodes/#figure)。
你应该设置一个`alt`属性以提高可访问性。

<!--
Use vector images for illustrations, technical diagrams and similar graphics; SVG format is recommended as a strong preference.

Articles that use raster images for illustrations are more difficult to maintain and in some
cases the blog team may ask authors to revise the article before it could be published.
-->
使用矢量图像进行插图、技术图表和类似图形；强烈建议使用 SVG 格式。

使用光栅图像进行插图的文章更难以维护，在某些情况下，
博客团队可能会要求作者在文章可以发布之前进行修改。

<!--
### Timelessness

Blog posts should aim to be future proof

- Given the development velocity of the project, SIG Docs prefers _timeless_ writing: content that
  won't require updates to stay accurate for the reader.
- It can be a better choice to add a tutorial or update official documentation than to write a
  high level overview as a blog post.
- Consider concentrating the long technical content as a call to action of the blog post, and
  focus on the problem space or why readers should care.
-->
### 时效性

博客文章应力求面向未来：

- 鉴于项目的开发速度，SIG Docs 倾向于 **timeless** 写作：即不需要更新就能保持准确的内容。
- 相较于撰写高层次概述的博客文章，添加教程或更新官方文档可能是更好的选择。
- 考虑将长技术内容集中在博客文章的呼吁行动中，并关注问题空间或为什么读者应该关心。

<!--
### Content examples

Here are some examples of content that is appropriate for the
[main Kubernetes blog](/docs/contribute/blog/#main-blog):
-->
### 内容示例

以下是一些适合
[主 Kubernetes 博客](/zh-cn/docs/contribute/blog/#main-blog)的内容示例：

<!--
* Announcements about new Kubernetes capabilities
* Explanations of how to achieve an outcome using Kubernetes; for example, tell us about your
  low-toil improvement on the basic idea of a rolling deploy
* Comparisons of several different software options that have a link to Kubernetes and cloud native. It's
  OK to have a link to one of these options so long as you fully disclose your conflict of
  interest / relationship.
* Stories about problems or incidents, and how you resolved them
* Articles discussing building a cloud native platform for specific use cases
* Your opinion about the good or bad points about Kubernetes
-->
* 关于 Kubernetes 新功能的公告
* 解释如何使用 Kubernetes 实现某个目标；例如，告诉我们你在基本滚动更新想法上的低操作改进
* 比较几个与 Kubernetes 和云原生有关的不同软件选项。可以提及其中一个选项的链接，但必须充分披露你的利益冲突/关系。
* 讲述问题或事件的故事，以及你是如何解决它们的
* 讨论构建针对特定用例的云原生平台的文章
* 你对 Kubernetes 的优缺点的看法
<!--
* Announcements and stories about non-core Kubernetes, such as the Gateway API
* [Post-release announcements and updates](#post-release-comms)
* Messages about important Kubernetes security vulnerabilities
* Kubernetes projects updates
* Tutorials and walkthroughs
* Thought leadership around Kubernetes and cloud native
* The components of Kubernetes are purposely modular, so writing about existing integration
  points like CNI and CSI are on topic. Provided you don't write a vendor pitch, you can also write
  about what is on the other end of these integrations.
-->
* 关于非核心 Kubernetes 的公告和故事，例如 Gateway API
* [发布后公告和更新](#post-release-comms)
* 关于重要的 Kubernetes 安全漏洞的消息
* Kubernetes 项目更新
* 教程和操作指南
* 围绕 Kubernetes 和云原生的思想领导力
* Kubernetes 的组件是故意设计成模块化的，因此撰写关于现有集成点的文章
 （如 CNI 和 CSI）是相关的。只要你不是在写供应商宣传，你也可以写这些集成的另一端是什么。

<!--
Here are some examples of content that is appropriate for the Kubernetes
[contributor blog](/docs/contribute/blog/#contributor-blog):

* articles about how to test your change to Kubernetes code
* content around non-code contribution
* discussions about alpha features where the design is still under discussion
* "Meet the team" articles about working groups, special interest groups, etc.
* a guide about how to write secure code that will become part of Kubernetes itself
* articles about maintainer summits and the outcome of those summits
-->
这里有一些适合 Kubernetes [贡献者博客](/zh-cn/docs/contribute/blog/#contributor-blog)的内容示例：

* 关于如何测试你对 Kubernetes 代码的更改的文章
* 围绕非代码贡献的内容
* 讨论设计仍在讨论中的 alpha 特性的文章
* “认识团队”文章，介绍工作组、特别兴趣小组等
* 关于如何编写将成为 Kubernetes 一部分的安全代码的指南
* 关于维护者峰会及其成果的文章

<!--
### Examples of content that wouldn't be accepted {#what-we-do-not-publish}

However, the project will not publish:
-->
### 不会被接受的内容示例  {#what-we-do-not-publish}

然而，项目不会发布：

<!--
* vendor pitches
* an article you've published elsewhere, even if only to your own low-traffic blog
* large chunks of example source code with only a minimal explanation
* updates about an external project that works with our relies on Kubernetes (put those on
  the external project's own blog)
* articles about using Kubernetes with a specific cloud provider
* articles that criticise specific people, groups of people, or businesses
* articles that have important technical mistakes or misleading details (for example: if you
  recommend turning off an important security control in production clusters, because it can
  be inconvenient, the Kubernetes project is likely to reject the article).
-->
* 供应商宣传
* 你在其他地方已发布过的文章，即使是发布在你自己的低流量博客上
* 仅有少量解释的大段示例源代码
* 关于外部项目的更新，如果该项目依赖于 Kubernetes（请将这些内容发布在外项目自己的博客上）
* 关于与特定云提供商一起使用 Kubernetes 的文章
* 批评特定人士、人群或企业的文章
* 包含重要技术错误或误导性细节的文章（例如：
  如果你建议在生产集群中关闭一个重要安全控制，因为其可能带来不便，
  Kubernetes 项目可能会拒绝该文章）
