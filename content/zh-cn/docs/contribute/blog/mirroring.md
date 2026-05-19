---
title: 博客文章镜像
slug: article-mirroring
content_type: concept
weight: 50
---
<!--
title: Blog article mirroring
slug: article-mirroring
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
There are two official Kubernetes blogs, and the CNCF has its own blog where you can cover Kubernetes too.
For the main Kubernetes blog, we (the Kubernetes project) like to publish articles with different perspectives and special focuses, that have a link to Kubernetes.

Some articles appear on both blogs: there is a primary version of the article, and
a _mirror article_ on the other blog.

This page describes the criteria for mirroring, the motivation for mirroring, and
explains what you should do to ensure that an article publishes to both blogs.
-->
官方有两个 Kubernetes 博客，CNCF 也有自己的博客，你也可以在其中了解 Kubernetes。  
对于主要的 Kubernetes 博客，我们（Kubernetes 项目）喜欢发表具有不同视角和特别焦点的文章，
这些文章与 Kubernetes 有一定的关联。

有些文章会同时出现在两个博客上：一篇文章是主要版本，另一篇是另一个博客上的**镜像文章**。

本文介绍了镜像的标准、镜像的动机，并解释了你应该做什么来确保文章发布到两个博客。

# {{% heading "prerequisites" %}}

<!--
Make sure you are familiar with the introduction sections of
[contributing to Kubernetes blogs](/docs/contribute/blog/), not just to learn about
the two official blogs and the differences between them, but also to get an overview
of the process.
-->
请确保你已熟悉[为 Kubernetes 博客贡献内容](/zh-cn/docs/contribute/blog/)的介绍部分，
这不仅是为了了解两个官方博客及其之间的区别，还能帮助你概览整个发布流程。

<!-- content -->

<!--
## Why we mirror

Mirroring is nearly always from the contributor blog to the main blog. The project does this
for articles that are about the contributor community, or a part of it, but are also relevant
to the wider set of readers for Kubernetes' main blog.
-->
## 为什么要镜像

镜像几乎总是从贡献者博客到主博客。项目组不仅针对有关贡献者社区或一部分文章这么做，
而且和 Kubernetes 主博客更为广泛的读者相关。

<!--
As an author (or reviewer), consider the target audience and whether the blog post is appropriate for the [main blog](/docs/contribute/blog/#main-blog).
For example: if the target audience are Kubernetes contributors only, then the
[contributor blog](/docs/contribute/blog/#contributor-blog).
may be more appropriate;
if the blog post is about open source in general then it may be more suitable on another site outside the Kubernetes project.

This consideration about target audience applies to original and mirrored articles equally.
-->
作为作者（或评审者），请考虑目标受众，并判断该博客文章是否适合发布在[主博客](/zh-cn/docs/contribute/blog/#main-blog)上。  
例如：如果目标受众仅限于 Kubernetes 的贡献者，
那么[贡献者博客](/zh-cn/docs/contribute/blog/#contributor-blog)可能更为合适；  
如果博客文章是关于开源的普遍话题，那么它可能更适合发布在 Kubernetes 项目之外的其他网站上。

这种对目标受众的考量同样适用于原创文章和镜像文章。

<!--
The Kubernetes project is willing to mirror any blog article that was published to https://kubernetes.dev/blog/
(the contributor blog), provided that all of the following criteria are met:

- the mirrored article has the same publication date as the original (it should have the same publication time too,
  but you can also set a time stamp up to 12 hours later for special cases)

- For PRs that add a mirrored article to the main blog *after* the original article has merged into the contributor blog, ensure that all of the following criteria are met:
    - No articles were published to the main blog after the original article was published to the contributor blog.
    - There are no main blog articles scheduled for publication between the publication time of the original article and the publication time of your mirrored article.
    
  This is because the Kubernetes project doesn't want to add articles to people's feeds, such as RSS, except at the very end of their feed.
-->
Kubernetes 项目愿意镜像任何发布在 https://kubernetes.dev/blog/ （贡献者博客）上的文章，但前提是满足以下所有条件：

- 镜像文章的发布日期必须与原始文章相同（发布时间也应相同，但在特殊情况下，可以设置最多延迟 12 小时的时间戳）。

- 对于在原始文章已合并到贡献者博客**之后**，向主博客添加镜像文章的 PR，请确保满足以下所有条件：
  - 在原始文章发布到贡献者博客之后，没有文章发布到主博客。
 - 在原始文章的发布时间和镜像文章的发布时间之间，主博客没有文章发布计划。

  这是因为 Kubernetes 项目不希望在人们的订阅源（例如 RSS）中插入文章，除非是在订阅源的末尾。

<!--
- the original article doesn't contravene any strongly recommended review guidelines or community norms

- the mirrored article will have `canonicalUrl` set correctly in its
  [front matter](https://gohugo.io/content-management/front-matter/)
-->
- 原始文章不违反任何强烈推荐的评审指南或社区规范。

- 镜像文章的 `canonicalUrl` 将在其[前言](https://gohugo.io/content-management/front-matter/)中正确设置。
  `canonicalUrl`。

<!--
- the audience for the original article would find it relevant

- the article content is not off-topic for the target blog where the mirror article would
  appear


Mirroring from the main blog to the contributor blog is rare, but could feasibly happen.
-->
- 原文章的读者会认为其相关

- 文章内容与镜像文章出现的目标博客主题一致

从主博客到贡献者博客的镜像操作很少见，但理论上是可行的。

<!--
## How to mirror

You make a PR against the other Git repository (usually,
[https://github.com/kubernetes/website](https://github.com/kubernetes/website)) that adds
the article. You do this _before_ the articles merge.

As the article author, you should set the canonical URL for the mirrored article, to the URL of the original article
(you can use a preview to predict the URL and fill this in ahead of actual publication). Use the `canonicalUrl`
field in [front matter](https://gohugo.io/content-management/front-matter/) for this.
-->
## 如何镜像

你需要向另一个 Git 仓库（通常是 [https://github.com/kubernetes/website](https://github.com/kubernetes/website)）
提交一个 PR，以添加该文章。此操作应在文章合并**之前**完成。

作为文章的作者，你应该为镜像文章设置规范 URL，
并将其指向原始文章的 URL（你可以使用预览功能预测 URL，并在实际发布前填写此内容）。
在[前言](https://gohugo.io/content-management/front-matter/)中使用
`canonicalUrl` 字段来完成这一设置。
