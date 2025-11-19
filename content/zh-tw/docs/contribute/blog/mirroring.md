---
title: 博客文章鏡像
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
官方有兩個 Kubernetes 博客，CNCF 也有自己的博客，你也可以在其中瞭解 Kubernetes。  
對於主要的 Kubernetes 博客，我們（Kubernetes 項目）喜歡發表具有不同視角和特別焦點的文章，
這些文章與 Kubernetes 有一定的關聯。

有些文章會同時出現在兩個博客上：一篇文章是主要版本，另一篇是另一個博客上的**鏡像文章**。

本文介紹了鏡像的標準、鏡像的動機，並解釋了你應該做什麼來確保文章發佈到兩個博客。

# {{% heading "prerequisites" %}}

<!--
Make sure you are familiar with the introduction sections of
[contributing to Kubernetes blogs](/docs/contribute/blog/), not just to learn about
the two official blogs and the differences between them, but also to get an overview
of the process.
-->
請確保你已熟悉[爲 Kubernetes 博客貢獻內容](/zh-cn/docs/contribute/blog/)的介紹部分，
這不僅是爲了瞭解兩個官方博客及其之間的區別，還能幫助你概覽整個發佈流程。

<!-- content -->

<!--
## Why we mirror

Mirroring is nearly always from the contributor blog to the main blog. The project does this
for articles that are about the contributor community, or a part of it, but are also relevant
to the wider set of readers for Kubernetes' main blog.
-->
## 爲什麼要鏡像

鏡像幾乎總是從貢獻者博客到主博客。項目組不僅針對有關貢獻者社區或一部分文章這麼做，
而且和 Kubernetes 主博客更爲廣泛的讀者相關。

<!--
As an author (or reviewer), consider the target audience and whether the blog post is appropriate for the [main blog](/docs/contribute/blog/#main-blog).
For example: if the target audience are Kubernetes contributors only, then the
[contributor blog](/docs/contribute/blog/#contributor-blog).
may be more appropriate;
if the blog post is about open source in general then it may be more suitable on another site outside the Kubernetes project.

This consideration about target audience applies to original and mirrored articles equally.
-->
作爲作者（或評審者），請考慮目標受衆，並判斷該博客文章是否適合發佈在[主博客](/zh-cn/docs/contribute/blog/#main-blog)上。  
例如：如果目標受衆僅限於 Kubernetes 的貢獻者，
那麼[貢獻者博客](/zh-cn/docs/contribute/blog/#contributor-blog)可能更爲合適；  
如果博客文章是關於開源的普遍話題，那麼它可能更適合發佈在 Kubernetes 項目之外的其他網站上。

這種對目標受衆的考量同樣適用於原創文章和鏡像文章。

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
Kubernetes 項目願意鏡像任何發佈在 https://kubernetes.dev/blog/ （貢獻者博客）上的文章，但前提是滿足以下所有條件：

- 鏡像文章的發佈日期必須與原始文章相同（發佈時間也應相同，但在特殊情況下，可以設置最多延遲 12 小時的時間戳）。

- 對於在原始文章已合併到貢獻者博客**之後**，向主博客添加鏡像文章的 PR，請確保滿足以下所有條件：
  - 在原始文章發佈到貢獻者博客之後，沒有文章發佈到主博客。
 - 在原始文章的發佈時間和鏡像文章的發佈時間之間，主博客沒有文章發佈計劃。

  這是因爲 Kubernetes 項目不希望在人們的訂閱源（例如 RSS）中插入文章，除非是在訂閱源的末尾。

<!--
- the original article doesn't contravene any strongly recommended review guidelines or community norms

- the mirrored article will have `canonicalUrl` set correctly in its
  [front matter](https://gohugo.io/content-management/front-matter/)
-->
- 原始文章不違反任何強烈推薦的評審指南或社區規範。

- 鏡像文章的 `canonicalUrl` 將在其[前言](https://gohugo.io/content-management/front-matter/)中正確設置。
  `canonicalUrl`。

<!--
- the audience for the original article would find it relevant

- the article content is not off-topic for the target blog where the mirror article would
  appear


Mirroring from the main blog to the contributor blog is rare, but could feasibly happen.
-->
- 原文章的讀者會認爲其相關

- 文章內容與鏡像文章出現的目標博客主題一致

從主博客到貢獻者博客的鏡像操作很少見，但理論上是可行的。

<!--
## How to mirror

You make a PR against the other Git repository (usually,
[https://github.com/kubernetes/website](https://github.com/kubernetes/website)) that adds
the article. You do this _before_ the articles merge.

As the article author, you should set the canonical URL for the mirrored article, to the URL of the original article
(you can use a preview to predict the URL and fill this in ahead of actual publication). Use the `canonicalUrl`
field in [front matter](https://gohugo.io/content-management/front-matter/) for this.
-->
## 如何鏡像

你需要向另一個 Git 倉庫（通常是 [https://github.com/kubernetes/website](https://github.com/kubernetes/website)）
提交一個 PR，以添加該文章。此操作應在文章合併**之前**完成。

作爲文章的作者，你應該爲鏡像文章設置規範 URL，
並將其指向原始文章的 URL（你可以使用預覽功能預測 URL，並在實際發佈前填寫此內容）。
在[前言](https://gohugo.io/content-management/front-matter/)中使用
`canonicalUrl` 字段來完成這一設置。
