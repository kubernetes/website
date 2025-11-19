---
title: 爲 Kubernetes 博客做貢獻
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
Kubernetes 有兩個官方博客，同時 CNCF 也有[其自己的博客](https://www.cncf.io/blog/)，
你也可以在 CNCF 博客上面撰寫 Kubernetes 相關內容。對於 Kubernetes 主博客，
我們（Kubernetes 項目）希望發佈具有不同視角和特定關注點的文章，這些文章需與 Kubernetes 有所關聯。

<!--
With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.

Read the [blog guidelines](/docs/contribute/blog/guidelines/#what-we-publish) for more about that aspect.
-->
除極少數特殊情況外，我們只發布未在其他任何地方提交過或發表過的內容。

參閱[博客指南](/zh-cn/docs/contribute/blog/guidelines/#what-we-publish)瞭解更多相關要求。

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

[Kubernetes 主博客](/zh-cn/blog/)由 Kubernetes 項目組發佈新特性、社區報告以及可能與
Kubernetes 社區相關的所有新聞。這些內容面向終端用戶和開發者。
大部分博客的內容圍繞核心項目展開，但 Kubernetes 作爲一個開源項目，也鼓勵大家提交關於生態系統中其他方面的內容！

<!--
Anyone can write a blog post and submit it for publication. With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.

### Contributor blog

The [Kubernetes contributor blog](https://k8s.dev/blog/) is aimed at an audience of people who
work **on** Kubernetes more than people who work **with** Kubernetes. The Kubernetes project
deliberately publishes some articles to both blogs.

Anyone can write a blog post and submit it for review.
-->
任何人都可以撰寫博文並提交發布。除極少數特殊情況外，我們僅發佈未在其他任何地方提交過或發表過的內容。

### 貢獻者博客    {#contributor-blog}

[Kubernetes 貢獻者博客](https://k8s.dev/blog/)面向的是**參與 Kubernetes 的開發者**，
而非**使用 Kubernetes 的用戶**。Kubernetes 項目會有意同時在兩個博客上都發布某些文章。

任何人都可以撰寫博文並提交審覈。

<!--
## Article updates and maintenance {#maintenance}

The Kubernetes project does not maintain older articles for its blogs. This means that any
published article more than one year old will normally **not** be eligible for issues or pull
requests that ask for changes. To avoid establishing precedent, even technically correct pull
requests are likely to be rejected.
-->
## 文章更新與維護   {#maintenance}  

Kubernetes 項目不維護博客中較舊的文章。這意味着，
任何發佈超過一年的文章通常**不**接受提交要求修改的 Issue 或 PR。
爲了避免形成慣例，這種即使從技術角度看正確的 PR 也可能會被拒絕。

<!--
However, there are exceptions like the following:

* (updates to) articles marked as [evergreen](#maintenance-evergreen)
* removing or correcting articles giving advice that is now wrong and dangerous to follow
* fixes to ensure that an existing article still renders correctly

For any article that is over a year old and not marked as _evergreen_, the website automatically
displays a notice that the content may be stale.
-->
但以下情況是例外：

* （更新）標記爲 [Evergreen](#maintenance-evergreen) 的文章
* 移除或更正已被證明錯誤且可能導致危險操作的文章
* 一些修復工作，確保現有文章的渲染仍然正確

對於超過一年且未標記爲 **Evergreen** 的文章，網站會自動顯示一條通知，提醒讀者內容可能已經過時。

<!--
### Evergreen articles {#maintenance-evergreen}

You can mark an article as evergreen by setting `evergreen: true` in the front matter.

We only mark blog articles as maintained (`evergreen: true` in front matter) if the Kubernetes project
can commit to maintaining them indefinitely. Some blog articles absolutely merit this; for example, the release comms team always marks official release announcements as evergreen.
-->
### Evergreen 文章   {#maintenance-evergreen}  

你可以在文章的 front matter 中添加 `evergreen: true` 將某篇文章標記爲 Evergreen（長期維護）。

只有當 Kubernetes 項目承諾長期維護某篇博文時，我們纔會將其標記爲長期維護
（即在 front matter 中設置 `evergreen: true`）。
有些博文確實值得長期維護，例如 Kubernetes 發佈公告通常都會由 Release Comms Team（發佈溝通團隊）標記爲 Evergreen。

## {{% heading "whatsnext" %}}

<!--
* Discover the official blogs:
  * [Kubernetes blog](/blog/)
  * [Kubernetes contributor blog](https://k8s.dev/blog/)

* Read about [reviewing blog pull requests](/docs/contribute/review/reviewing-prs/#blog)
-->
* 瞭解官方博客：  
  * [Kubernetes 主博客](/zh-cn/blog/)  
  * [Kubernetes 貢獻者博客](https://k8s.dev/blog/)
* 閱讀[評審博客 PR](/zh-cn/docs/contribute/review/reviewing-prs/#blog)
