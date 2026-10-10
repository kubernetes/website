---
title: 为 Kubernetes 博客做贡献
slug: blog-contribution
content_type: concept
weight: 15
simple_list: true
---
<!--
title: Contributing to Kubernetes blogs
slug: blog-contribution
content_type: concept
weight: 15
simple_list: true
-->

<!-- overview -->

<!--
There are two official Kubernetes blogs, and the CNCF has [its own blog](https://www.cncf.io/blog/) where you can cover Kubernetes too.
For the main Kubernetes blog, we (the Kubernetes project) like to publish articles with different perspectives and special focuses, that have a link to Kubernetes.
-->
Kubernetes 有两个官方博客，同时 CNCF 也有[其自己的博客](https://www.cncf.io/blog/)，
你也可以在 CNCF 博客上面撰写 Kubernetes 相关内容。对于 Kubernetes 主博客，
我们（Kubernetes 项目）希望发布具有不同视角和特定关注点的文章，这些文章需与 Kubernetes 有所关联。

<!--
With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.

Read the [blog guidelines](/docs/contribute/blog/guidelines/#what-we-publish) for more about that aspect.
-->
除极少数特殊情况外，我们只发布未在其他任何地方提交过或发表过的内容。

参阅[博客指南](/zh-cn/docs/contribute/blog/guidelines/#what-we-publish)了解更多相关要求。

<!--
## Official Kubernetes blogs

### Main blog

The main [Kubernetes blog](/blog/) is used by the project to communicate new features, community reports, and any
news that might be relevant to the Kubernetes community. This includes end users and developers.
Most of the blog's content is about things happening in the core project, but Kubernetes
as a project encourages you to submit about things happening elsewhere in the ecosystem too!
-->
## Kubernetes 官方博客   {#official-kubernetes-blogs}

### 主博客   {#main-blog}

[Kubernetes 主博客](/zh-cn/blog/)由 Kubernetes 项目组发布新特性、社区报告以及可能与
Kubernetes 社区相关的所有新闻。这些内容面向终端用户和开发者。
大部分博客的内容围绕核心项目展开，但 Kubernetes 作为一个开源项目，也鼓励大家提交关于生态系统中其他方面的内容！

<!--
Anyone can write a blog post and submit it for publication. With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.

### Contributor blog

The [Kubernetes contributor blog](https://k8s.dev/blog/) is aimed at an audience of people who
work **on** Kubernetes more than people who work **with** Kubernetes. The Kubernetes project
deliberately publishes some articles to both blogs.

Anyone can write a blog post and submit it for review.
-->
任何人都可以撰写博文并提交发布。除极少数特殊情况外，我们仅发布未在其他任何地方提交过或发表过的内容。

### 贡献者博客    {#contributor-blog}

[Kubernetes 贡献者博客](https://k8s.dev/blog/)面向的是**参与 Kubernetes 的开发者**，
而非**使用 Kubernetes 的用户**。Kubernetes 项目会有意同时在两个博客上都发布某些文章。

任何人都可以撰写博文并提交审核。

<!--
## Article updates and maintenance {#maintenance}

The Kubernetes project does not maintain older articles for its blogs. This means that any
published article more than one year old will normally **not** be eligible for issues or pull
requests that ask for changes. To avoid establishing precedent, even technically correct pull
requests are likely to be rejected.
-->
## 文章更新与维护   {#maintenance}  

Kubernetes 项目不维护博客中较旧的文章。这意味着，
任何发布超过一年的文章通常**不**接受提交要求修改的 Issue 或 PR。
为了避免形成惯例，这种即使从技术角度看正确的 PR 也可能会被拒绝。

<!--
However, there are exceptions like the following:

* (updates to) articles marked as [evergreen](#maintenance-evergreen)
* removing or correcting articles giving advice that is now wrong and dangerous to follow
* fixes to ensure that an existing article still renders correctly

For any article that is over a year old and not marked as _evergreen_, the website automatically
displays a notice that the content may be stale.
-->
但以下情况是例外：

* （更新）标记为 [Evergreen](#maintenance-evergreen) 的文章
* 移除或更正已被证明错误且可能导致危险操作的文章
* 一些修复工作，确保现有文章的渲染仍然正确

对于超过一年且未标记为 **Evergreen** 的文章，网站会自动显示一条通知，提醒读者内容可能已经过时。

<!--
### Evergreen articles {#maintenance-evergreen}

You can mark an article as evergreen by setting `evergreen: true` in the front matter.

We only mark blog articles as maintained (`evergreen: true` in front matter) if the Kubernetes project
can commit to maintaining them indefinitely. Some blog articles absolutely merit this; for example, the release comms team always marks official release announcements as evergreen.
-->
### Evergreen 文章   {#maintenance-evergreen}  

你可以在文章的 front matter 中添加 `evergreen: true` 将某篇文章标记为 Evergreen（长期维护）。

只有当 Kubernetes 项目承诺长期维护某篇博文时，我们才会将其标记为长期维护
（即在 front matter 中设置 `evergreen: true`）。
有些博文确实值得长期维护，例如 Kubernetes 发布公告通常都会由 Release Comms Team（发布沟通团队）标记为 Evergreen。

## {{% heading "whatsnext" %}}

<!--
* Discover the official blogs:
  * [Kubernetes blog](/blog/)
  * [Kubernetes contributor blog](https://k8s.dev/blog/)

* Read about [reviewing blog pull requests](/docs/contribute/review/reviewing-prs/#blog)
-->
* 了解官方博客：  
  * [Kubernetes 主博客](/zh-cn/blog/)  
  * [Kubernetes 贡献者博客](https://k8s.dev/blog/)
* 阅读[评审博客 PR](/zh-cn/docs/contribute/review/reviewing-prs/#blog)
