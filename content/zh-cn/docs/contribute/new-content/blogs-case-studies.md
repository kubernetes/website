---
title: 提交博客和案例分析
linktitle: 博客和案例分析
slug: blogs-case-studies
content_type: concept
weight: 30
---
<!--
title: Submitting blog posts and case studies
linktitle: Blogs and case studies
slug: blogs-case-studies
content_type: concept
weight: 30
-->

<!-- overview -->
<!--
Anyone can write a blog post and submit it for review.
Case studies require extensive review before they're approved.
-->
任何人都可以撰写博客并提交评阅。
案例分析则在被批准之前需要更多的评阅。

<!-- body -->

<!--
## The Kubernetes Blog

The Kubernetes blog is used by the project to communicate new features, community reports, and any
news that might be relevant to the Kubernetes community. This includes end users and developers. 
Most of the blog's content is about things happening in the core project, but we encourage you to
submit about things happening elsewhere in the ecosystem too!

Anyone can write a blog post and submit it for review.
-->
## Kubernetes 博客   {#the-kubernetes-blog}

Kubernetes 博客用于项目发布新功能特性、
社区报告以及其他一些可能对整个社区很重要的新闻。
其读者包括最终用户和开发人员。
大多数博客的内容是关于核心项目中正在发生的事情，
不过我们也鼓励你提交一些有关生态系统中其他时事的博客。

任何人都可以撰写博客并提交评阅。

<!-- 
### Submit a Post

Blog posts should not be commercial in nature and should consist of original content that applies
broadly to the Kubernetes community. Appropriate blog content includes:

- New Kubernetes capabilities
- Kubernetes projects updates
- Updates from Special Interest Groups
- Tutorials and walkthroughs
- Thought leadership around Kubernetes
- Kubernetes Partner OSS integration
- **Original content only**
-->
### 提交博文   {#submit-a-post}

博文不应该是商业性质的，应该包含广泛适用于 Kubernetes 社区的原创内容。
合适的博客内容包括：

- Kubernetes 新能力
- Kubernetes 项目更新信息
- 来自特别兴趣小组（Special Interest Groups, SIG）的更新信息
- 教程和演练
- 有关 Kubernetes 的纲领性理念
- Kubernetes 合作伙伴 OSS 集成信息
- **仅限原创内容**

<!-- 
Unsuitable content includes:

- Vendor product pitches
- Partner updates without an integration and customer story
- Syndicated posts (language translations ok)
-->
不合适的博客内容包括：

- 供应商产品推介
- 不含集成信息和客户故事的合作伙伴更新信息
- 已发表的博文（可刊登博文译稿）

<!-- 
To submit a blog post, follow these steps:

1. [Sign the CLA](https://github.com/kubernetes/community/blob/master/CLA.md)
   if you have not yet done so.
1. Have a look at the Markdown format for existing blog posts in the
   [website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).
1. Write out your blog post in a text editor of your choice.
1. On the same link from step 2, click the Create new file button. Paste your content into the editor.
   Name the file to match the proposed title of the blog post, but don’t put the date in the file name.
   The blog reviewers will work with you on the final file name and the date the blog will be published.
1. When you save the file, GitHub will walk you through the pull request process.
1. A blog post reviewer will review your submission and work with you on feedback and final details.
   When the blog post is approved, the blog will be scheduled for publication.
-->
要提交博文，你可以遵从以下步骤：

1. 如果你还未签署 CLA，请先[签署 CLA](/zh-cn/docs/contribute/start/#sign-the-cla)。
2. 查阅[网站仓库](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts)中现有博文的 Markdown 格式。
3. 在你所选的文本编辑器中撰写你的博文。
4. 在第 2 步的同一链接上，点击 **Create new file** 按钮。
   将你的内容粘贴到编辑器中。为文件命名，使其与提议的博文标题一致，
   但不要在文件名中写日期。
   博客评阅者将与你一起确定最终的文件名和发表博客的日期。
5. 保存文件时，GitHub 将引导你完成 PR 流程。
6. 博客评阅者将评阅你提交的内容，并与你一起处理反馈和最终细节。
   当博文被批准后，博客将排期发表。

<!--
### Guidelines and expectations

- Blog posts should not be vendor pitches. 
  - Articles must contain content that applies broadly to the Kubernetes community. For example, a
    submission should focus on upstream Kubernetes as opposed to vendor-specific configurations.
    Check the [Documentation style guide](/docs/contribute/style/content-guide/#what-s-allowed) for
    what is typically allowed on Kubernetes properties. 
  - Links should primarily be to the official Kubernetes documentation. When using external
    references, links should be diverse - For example a submission shouldn't contain only links
    back to a single company's blog.
  - Sometimes this is a delicate balance. The [blog team](https://kubernetes.slack.com/messages/sig-docs-blog/)
    is there to give guidance on whether a post is appropriate for the Kubernetes blog, so don't
    hesitate to reach out. 
-->
### 指导原则和期望  {#guidelines-and-expectations}

- 博客内容不可以是销售用语。
  - 文章内容必须是对整个 Kubernetes 社区中很多人都有参考意义。
    例如，所提交的文章应该关注上游的 Kubernetes 项目本身，而不是某个厂商特定的配置。
    请参阅[文档风格指南](/zh-cn/docs/contribute/style/content-guide/#what-s-allowed)
    以了解哪些内容是 Kubernetes 所允许的。
  - 链接应该主要指向官方的 Kubernetes 文档。
    当引用外部信息时，链接应该是多样的。
    例如，所提交的博客文章中不可以只包含指向某个公司的博客的链接。
  - 有些时候，这是一个比较棘手的权衡过程。
    [博客团队](https://kubernetes.slack.com/messages/sig-docs-blog/)的存在目的即是为
    Kubernetes 博客提供文章是否合适的指导意见。
    所以，需要帮助的时候不要犹豫。
<!--
- Blog posts are not published on specific dates.
    - Articles are reviewed by community volunteers. We'll try our best to accommodate specific
      timing, but we make no guarantees.
  - Many core parts of the Kubernetes projects submit blog posts during release windows, delaying
    publication times. Consider submitting during a quieter period of the release cycle.
  - If you are looking for greater coordination on post release dates, coordinating with
    [CNCF marketing](https://www.cncf.io/about/contact/) is a more appropriate choice than submitting a blog post.
  - Sometimes reviews can get backed up. If you feel your review isn't getting the attention it needs,
    you can reach out to the blog team on the [`#sig-docs-blog` Slack channel](https://kubernetes.slack.com/messages/sig-docs-blog/)
    to ask in real time.
-->
- 博客内容并非在某特定日期发表。
  - 文章会交由社区自愿者评阅。我们会尽力满足特定的时限要求，只是无法就此作出承诺。
  - Kubernetes 项目的很多核心组件会在发布窗口期内提交博客文章，导致发表时间被推迟。
    因此，请考虑在发布周期内较为平静的时间段提交博客文章。
  - 如果你希望就博文发表日期上进行较大范围的协调，请联系
    [CNCF 推广团队](https://www.cncf.io/about/contact/)。
    这也许是比提交博客文章更合适的一种选择。
  - 有时，博客的评审可能会堆积起来。如果你觉得你的文章没有引起该有的重视，你可以通过
    [`#sig-docs-blog` Slack 频道](https://kubernetes.slack.com/messages/sig-docs-blog/)联系博客团队，
    以获得实时反馈。

<!--
- Blog posts should be relevant to Kubernetes users.

  - Topics related to participation in or results of Kubernetes SIGs activities are always on
    topic (see the work in the [Contributor Comms Team](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)
    for support on these posts). 
  - The components of Kubernetes are purposely modular, so tools that use existing integration
    points like CNI and CSI are on topic. 
  - Posts about other CNCF projects may or may not be on topic. We recommend asking the blog team
    before submitting a draft.
    - Many CNCF projects have their own blog. These are often a better choice for posts. There are
      times of major feature or milestone for a CNCF project that users would be interested in
      reading on the Kubernetes blog.
  - Blog posts about contributing to the Kubernetes project should be in the
    [Kubernetes Contributors site](https://kubernetes.dev)
-->
- 博客内容应该对 Kubernetes 用户有用。
  - 与参与 Kubernetes SIG 活动相关，或者与这类活动的结果相关的主题通常是切题的。
    请参考 [贡献者沟通（Contributor Comms）团队](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)的工作以获得对此类博文的支持。
  - Kubernetes 的组件都有意设计得模块化，因此使用类似 CNI、CSI 等集成点的工具通常都是切题的。
  - 关于其他 CNCF 项目的博客可能切题也可能不切题。
    我们建议你在提交草稿之前与博客团队联系。
    - 很多 CNCF 项目有自己的博客。这些博客通常是更好的选择。
      有些时候，某个 CNCF 项目的主要功能特性或者里程碑的变化可能是用户有兴趣在
      Kubernetes 博客上阅读的内容。
  - 关于为 Kubernetes 项目做贡献的博客内容应该放在 [Kubernetes 贡献者站点](https://kubernetes.dev)上。

<!--
- Blog posts should be original content
  - The official blog is not for repurposing existing content from a third party as new content.
  - The [license](https://github.com/kubernetes/website/blob/main/LICENSE) for the blog allows
    commercial use of the content for commercial purposes, but not the other way around.
- Blog posts should aim to be future proof
  - Given the development velocity of the project, we want evergreen content that won't require
    updates to stay accurate for the reader. 
  - It can be a better choice to add a tutorial or update official documentation than to write a
    high level overview as a blog post.
    - Consider concentrating the long technical content as a call to action of the blog post, and
      focus on the problem space or why readers should care.
-->
- 博客文章须是原创内容。
  - 官方博客的目的不是将某第三方已发表的内容重新作为新内容发表。
  - 博客的[授权协议](https://github.com/kubernetes/website/blob/main/LICENSE)
    的确允许出于商业目的来使用博客内容；但并不是所有可以商用的内容都适合在这里发表。
- 博客文章的内容应该在一段时间内不过期。
  - 考虑到项目的开发速度，我们希望读者看到的是不必更新就能保持长期准确的内容。
  - 有时候，在官方文档中添加一个教程或者进行内容更新都是比博客更好的选择。
    - 可以考虑在博客文章中将较长技术内容的重点放在鼓励读者自行尝试上，
      或者放在问题域本身或者为什么读者应该关注某个话题上。

<!--
### Technical Considerations for submitting a blog post

Submissions need to be in Markdown format to be used by the [Hugo](https://gohugo.io/) generator
for the blog. There are [many resources available](https://gohugo.io/documentation/) on how to use
this technology stack.

For illustrations, diagrams or charts, the [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure)
can be used. For other images, we strongly encourage use of alt attributes; if an image doesn't
need any alt attrribute, maybe it's not needed in the article at all.

We recognize that this requirement makes the process more difficult for less-familiar folks to
submit, and we're constantly looking at solutions to lower this bar. If you have ideas on how to
lower the barrier, please volunteer to help out. 
-->
### 提交博客的技术考虑   {#technical-consideration-for-submitting-a-blog-post}

所提交的内容应该是 Markdown 格式的，以便能够被 [Hugo](https://gohugo.io/) 生成器来处理。
关于如何使用相关技术，有[很多可用的资源](https://gohugo.io/documentation/)。

对于插图、表格或图表，可以使用 [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure)。
对于其他图片，我们强烈建议使用 alt 属性；如果一张图片不需要任何 alt 属性，
那么这张图片在文章中就不是必需的。

我们知道这一需求可能给那些对此过程不熟悉的朋友们带来不便，
我们也一直在寻找降低难度的解决方案。
如果你有降低难度的好主意，请自荐帮忙。

<!--
The SIG Docs [blog subproject](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject)
manages the review process for blog posts. For more information, see
[Submit a post](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post).

To submit a blog post follow these directions:
-->
SIG Docs
[博客子项目](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject)负责管博客的评阅过程。
更多信息可参考[提交博文](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post)。

要提交博文，你可以遵从以下指南：

<!--
- [Open a pull request](/docs/contribute/new-content/open-a-pr/#fork-the-repo) with a new blog post.
  New blog posts go under the [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/main/content/en/blog/_posts)
  directory.

- Ensure that your blog post follows the correct naming conventions and the following frontmatter
  (metadata) information:

  - The Markdown file name must follow the format `YYYY-MM-DD-Your-Title-Here.md`. For example,
    `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
  - Do **not** include dots in the filename. A name like `2020-01-01-whats-new-in-1.19.md` causes
    failures during a build.
  - The front matter must include the following:
-->
- [发起一个包含新博文的 PR](/zh-cn/docs/contribute/new-content/open-a-pr/#fork-the-repo)。
  新博文要创建于 [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/main/content/en/blog/_posts) 目录下。

- 确保你的博文遵从合适的命名规范，并带有下面的引言（元数据）信息：

  - Markdown 文件名必须符合格式 `YYYY-MM-DD-Your-Title-Here.md`。
    例如，`2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`。
  - **不要**在文件名中包含多余的句点。类似 `2020-01-01-whats-new-in-1.19.md`
    这类文件名会导致文件无法正确打开。
  - 引言部分必须包含以下内容：

    ```yaml
    ---
    layout: blog
    title: "Your Title Here"
    date: YYYY-MM-DD
    slug: text-for-URL-link-here-no-spaces
    ---
    ```

  <!--
  - The first or initial commit message should be a short summary of the work being done and
    should stand alone as a description of the blog post. Please note that subsequent edits to
    your blog will be squashed into this main commit, so it should be as useful as possible. 

    - Examples of a good commit message:
      - _Add blog post on the foo kubernetes feature_
      - _blog: foobar announcement_
    - Examples of bad commit message:
      - _Add blog post_
      - _._
      - _initial commit_
      - _draft post_

  - The blog team will then review your PR and give you comments on things you might need to fix.
    After that the bot will merge your PR and your blog post will be published. 
  -->

  - 第一个或者最初的提交的描述信息中应该包含一个所作工作的简单摘要，
    并作为整个博文的一个独立描述。
    请注意，对博文的后续修改编辑都会最终合并到此主提交中，所以此提交的描述信息
    应该尽量有用。
    - 较好的提交消息（Commit Message）示例：
      -  _Add blog post on the foo kubernetes feature_
      -  _blog: foobar announcement_
    - 较差的提交消息示例：
      - _Add blog post_
      - _._
      - _initial commit_
      - _draft post_
  - 博客团队会对 PR 内容进行评阅，为你提供一些评语以便修订。
    之后，机器人会将你的博文合并并发表。

  <!-- 
  - If the content of the blog post contains only content that is not expected to require updates
    to stay accurate for the reader, it can be marked as evergreen and exempted from the automatic
    warning about outdated content added to blog posts older than one year.

    - To mark a blog post as evergreen, add this to the front matter:
      
      ```yaml
      evergreen: true
      ```
    - Examples of content that should not be marked evergreen:
      - **Tutorials** that only apply to specific releases or versions and not all future versions
      - References to pre-GA APIs or features
  -->

  - 如果博文的内容仅包含预期无需更新就能对读者保持精准的内容，
    则可以将这篇博文标记为长期有效（evergreen），
    且免除添加博文发表一年后内容过期的自动警告。
    - 要将一篇博文标记为长期有效，请在引言部分添加以下标记：
      
      ```yaml
      evergreen: true
      ```

    - 不应标记为长期有效的内容示例：
      - 仅适用于特定发行版或版本而不是所有未来版本的**教程**
      - 对非正式发行（Pre-GA）API 或功能特性的引用

<!--
### Mirroring from the Kubernetes Contributor Blog

To mirror a blog post from the [Kubernetes contributor blog](https://www.kubernetes.dev/blog/), follow these guidelines:
-->
### 制作 Kubernetes 贡献者博客的镜像   {#mirroring-from-the-kubernetes-contributor-blog}

要从 [Kubernetes 贡献者博客](https://www.kubernetes.dev/blog/)制作某篇博文的镜像，遵循以下指导原则：

<!--
- Keep the blog content the same. If there are changes, they should be made to the original article first, and then to the mirrored article.
- The mirrored blog should have a `canonicalUrl`, that is, essentially the url of the original blog after it has been published.
- [Kubernetes contributor blogs](https://kubernetes.dev/blog) have their authors mentioned in the YAML header, while the Kubernetes blog posts mention authors in the blog content itself. This should be changed when mirroring the content.
- Publication dates stay the same as the original blog.

All of the other guidelines and expectations detailed above apply as well.
-->
- 保持博客内容不变。如有变更，应该先在原稿上进行更改，然后再更改到镜像的文章上。
- 镜像博客应该有一个 `canonicalUrl`，即基本上是原始博客发布后的网址。
- [Kubernetes 贡献者博客](https://kubernetes.dev/blog)在 YAML 头部中提及作者，
  而 Kubernetes 博文在博客内容中提及作者。你在镜像内容时应修改这一点。
- 发布日期与原博客保持一致。

在制作镜像博客时，你也需遵守本文所述的所有其他指导原则和期望。

<!--
## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve real-world problems. The
Kubernetes marketing team and members of the {{< glossary_tooltip text="CNCF" term_id="cncf" >}}
collaborate with you on all case studies.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/main/content/en/case-studies).

Refer to the [case study guidelines](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md)
and submit your request as outlined in the guidelines.
-->
## 提交案例分析   {#submit-a-case-study}

案例分析用来概述组织如何使用 Kubernetes 解决现实世界的问题。
Kubernetes 市场化团队和 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 成员会与你一起工作，
撰写所有的案例分析。

请查看[现有案例分析](https://github.com/kubernetes/website/tree/main/content/zh-cn/case-studies)的源码。

参考[案例分析指南](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md)，
根据指南中的注意事项提交你的 PR 请求。
