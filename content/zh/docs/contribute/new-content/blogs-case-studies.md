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
案例研究在获得批准之前需要广泛的审查。

<!-- body -->

<!--
## The Kubernetes Blog

The Kubernetes blog is used by the project to communicate new features, community reports, and any news that might be relevant to the Kubernetes community. 
This includes end users and developers. 
Most of the blog's content is about things happening in the core project, but we encourage you to submit about things happening elsewhere in the ecosystem too!

Anyone can write a blog post and submit it for review.
-->
## Kubernetes 博客

Kubernetes 博客用于项目发布新功能特性、社区报告以及其他一些可能对整个社区
很重要的新闻。
其读者包括最终用户和开发人员。
大多数博客的内容是关于核心项目中正在发生的事情，不过我们也鼓励你提交一些
关于生态系统中其他地方发生的事情的博客。

任何人都可以撰写博客并提交评阅。

<!--
### Guidelines and expectations

- Blog posts should not be vendor pitches. 
  - Articles must contain content that applies broadly to the Kubernetes community. For example, a submission should focus on upstream Kubernetes as opposed to vendor-specific configurations. Check the [Documentation style guide](https://kubernetes.io/docs/contribute/style/content-guide/#what-s-allowed) for what is typically allowed on Kubernetes properties. 
  - Links should primarily be to the official Kubernetes documentation. When using external references, links should be diverse - For example a submission shouldn't contain only links back to a single company's blog.
  - Sometimes this is a delicate balance. The [blog team](https://kubernetes.slack.com/messages/sig-docs-blog/) is there to give guidance on whether a post is appropriate for the Kubernetes blog, so don't hesitate to reach out. 
-->
### 指导原则和期望  {#guidelines-and-expectations}

- 博客内容不可以是销售用语。
  - 文章内容必须是对整个 Kubernetes 社区中很多人都有参考意义。
    例如，所提交的文章应该关注上游的 Kubernetes 项目本身，而不是某个厂商特定的配置。
    请参阅[文档风格指南](/zh/docs/contribute/style/content-guide/#what-s-allowed)
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
    - Articles are reviewed by community volunteers. We'll try our best to accommodate specific timing, but we make no guarantees.
  - Many core parts of the Kubernetes projects submit blog posts during release windows, delaying publication times. Consider submitting during a quieter period of the release cycle.
  - If you are looking for greater coordination on post release dates, coordinating with [CNCF marketing](https://www.cncf.io/about/contact/) is a more appropriate choice than submitting a blog post.
  - Sometimes reviews can get backed up. If you feel your review isn't getting the attention it needs, you can reach out to the blog team via [this slack channel](https://kubernetes.slack.com/messages/sig-docs-blog/) to ask in real time. 
-->
- 博客内容并非在某特定日期发表。
    - 文章会交由社区自愿者评阅。我们会尽力满足特定的时限要求，只是无法就此作出承诺。
  - Kubernetes 项目的很多核心组件会在发布窗口期内提交博客文章，导致发表时间被推迟。
    因此，请考虑在发布周期内较为平静的时间段提交博文。
  - 如果你希望就博文发表日期上进行较大范围的协调，请联系
    [CNCF 推广团队](https://www.cncf.io/about/contact/)。
    这也许是比提交博客文章更合适的一种选择。
  - 有时，博客的评审可能会堆积起来。如果你觉得你的文章没有引起该有的重视，
    你可以通过[此 Slack 频道](https://kubernetes.slack.com/messages/sig-docs-blog/)
    联系博客团队，以获得实时反馈。
<!--
- Blog posts should be relevant to Kubernetes users.
  - Topics related to participation in or results of Kubernetes SIGs activities are always on topic (see the work in the [Upstream Marketing Team](https://github.com/kubernetes/community/blob/master/communication/marketing-team/blog-guidelines.md#upstream-marketing-blog-guidelines) for support on these posts). 
  - The components of Kubernetes are purposely modular, so tools that use existing integration points like CNI and CSI are on topic. 
  - Posts about other CNCF projects may or may not be on topic. We recommend asking the blog team before submitting a draft.
    - Many CNCF projects have their own blog. These are often a better choice for posts. There are times of major feature or milestone for a CNCF project that users would be interested in reading on the Kubernetes blog.
-->
- 博客内容应该对 Kubernetes 用户有用。
  - 与参与 Kubernetes SIGs 活动相关，或者与这类活动的结果相关的主题通常是切题的。
    请参考[上游推广团队](https://github.com/kubernetes/community/blob/master/communication/marketing-team/blog-guidelines.md#upstream-marketing-blog-guidelines)的工作以获得对此类博文的支持。
  - Kubernetes 的组件都有意设计得模块化，因此使用类似 CNI、CSI 等集成点的工具
    通常都是切题的。
  - 关于其他 CNCF 项目的博客可能切题也可能不切题。
    我们建议你在提交草稿之前与博客团队联系。
    - 很多 CNCF 项目有自己的博客。这些博客通常是更好的选择。
      有些时候，某个 CNCF 项目的主要功能特性或者里程碑的变化可能是用户有兴趣在
      Kubernetes 博客上阅读的内容。
<!--
- Blog posts should be original content
    - The official blog is not for repurposing existing content from a third party as new content.
    - The [license](https://github.com/kubernetes/website/blob/master/LICENSE) for the blog does allow commercial use of the content for commercial purposes, just not the other way around. 
- Blog posts should aim to be future proof
  - Given the development velocity of the project, we want evergreen content that won't require updates to stay accurate for the reader. 
  - It can be a better choice to add a tutorial or update official documentation than to write a high level overview as a blog post.
    - Consider concentrating the long technical content as a call to action of the blog post, and focus on the problem space or why readers should care.
-->
- 博客文章应该是原创内容。
  - 官方博客的目的不是将某第三方已发表的内容重新作为新内容发表。
  - 博客的[授权协议](https://github.com/kubernetes/website/blob/master/LICENSE)
    的确允许出于商业目的来使用博客内容；但并不是所有可以商用的内容都适合在这里发表。
- 博客文章的内容应该在一段时间内不过期。
  - 考虑到项目的开发速度，我们希望读者看到的是不必更新就能保持长期准确的内容。 
  - 有时候，在官方文档中添加一个教程或者进行内容更新都是比博客更好的选择。
    - 可以考虑在博客文章中将较长技术内容的重点放在鼓励读者自行尝试上，或者
      放在问题域本身或者为什么读者应该关注某个话题上。

<!--
### Technical Considerations for submitting a blog post

Submissions need to be in Markdown format to be used by the [Hugo](https://gohugo.io/) generator for the blog. There are [many resources available](https://gohugo.io/documentation/) on how to use this technology stack.

We recognize that this requirement makes the process more difficult for less-familiar folks to submit, and we're constantly looking at solutions to lower this bar. If you have ideas on how to lower the barrier, please volunteer to help out. 
-->
### 提交博客的技术考虑

所提交的内容应该是 Markdown 格式的，以便能够被[Hugo](https://gohugo.io/) 生成器来处理。
关于如何使用相关技术，有[很多可用的资源](https://gohugo.io/documentation/)。

我们知道这一需求可能给那些对此过程不熟悉的朋友们带来不便，
我们也一直在寻找降低难度的解决方案。
如果你有降低难度的好主意，请自荐帮忙。

<!--
The SIG Docs [blog subproject](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject) manages the review process for blog posts. For more information, see [Submit a post](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post).

To submit a blog post follow these directions:
-->
SIG Docs [博客子项目](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject) 负责管理博客的评阅过程。
更多信息可参考[提交博文](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post)。


要提交博文，你可以遵从以下指南：
<!--
- [Open a pull request](/docs/contribute/new-content/new-content/#fork-the-repo) with a new blog post. New blog posts go under the [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts) directory.

- Ensure that your blog post follows the correct naming conventions and the following frontmatter (metadata) information:

  - The Markdown file name must follow the format `YYYY-MM-DD-Your-Title-Here.md`. For example, `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
  - Do **not** include dots in the filename. A name like `2020-01-01-whats-new-in-1.19.md` causes failures during a build.
  - The front matter must include the following:
-->
- [发起一个包含博文的 PR](/zh/docs/contribute/new-content/open-a-pr/#fork-the-repo)。
  新博文要创建于 [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts) 目录下。

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
  - The first or initial commit message should be a short summary of the work being done and should stand alone as a description of the blog post. Please note that subsequent edits to your blog will be squashed into this main commit, so it should be as useful as possible. 
    - Examples of a good commit message:
      -  _Add blog post on the foo kubernetes feature_
      -  _blog: foobar announcement_
    - Examples of bad commit message:
      - _Add blog post_
      - _._
      - _initial commit_
      - _draft post_
  - The blog team will then review your PR and give you comments on things you might need to fix. After that the bot will merge your PR and your blog post will be published. 
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
## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve
real-world problems. The Kubernetes marketing team and members of the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} collaborate with you on all case studies.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/master/content/en/case-studies).

Refer to the [case study guidelines](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md) and submit your request as outlined in the guidelines. 
-->
## 提交案例分析

案例分析用来概述组织如何使用 Kubernetes 解决现实世界的问题。
Kubernetes 市场化团队和 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 成员
会与你一起工作，撰写所有的案例分析。

请查看
[现有案例分析](https://github.com/kubernetes/website/tree/master/content/en/case-studies)
的源码。

参考[案例分析指南](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md)
根据指南中的注意事项提交你的 PR 请求。

