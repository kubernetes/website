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
這些指南涵蓋了 Kubernetes 主博客和 Kubernetes 貢獻者博客。

所有博客內容還必須遵循[內容指南](/zh-cn/docs/contribute/style/content-guide/)中的總體政策。

# {{% heading "prerequisites" %}}

<!--
Make sure you are familiar with the introduction sections of
[contributing to Kubernetes blogs](/docs/contribute/blog/), not just to learn about
the two official blogs and the differences between them, but also to get an overview
of the process.
-->
確保你熟悉[爲 Kubernetes 博客貢獻內容](/zh-cn/docs/contribute/blog/)的介紹部分，
不僅是爲了瞭解兩個官方博客及其之間的區別，也是爲了對整個過程有一個概覽。

<!--
## Original content

The Kubernetes project accepts **original content only**, in English.
-->
Kubernetes 項目僅接受**原創內容**，且必須爲英文。

{{< note >}}
<!--
The Kubernetes project cannot accept content for the blog if it has already been submitted
or published outside of the Kubernetes project.

The official blogs are not available as a medium to repurpose existing content from any third
party as new content.
-->
如果內容已經提交或在 Kubernetes 項目之外發布，
Kubernetes 項目則不能接受該內容用於博客。

官方博客不作爲第三方重新利用已有內容並將其作爲新內容發佈的媒介。
{{< /note >}}

<!--
This restriction even carries across to promoting other Linux Foundation and CNCF projects.
Many CNCF projects have their own blog. These are often a better choice for posts about a specific
project, even if that other project is designed specifically to work with Kubernetes (or with Linux,
etc).
-->
這一限制甚至延伸至推廣其他 Linux 基金會和 CNCF 項目。
許多 CNCF 項目都有自己的博客。對於特定項目的帖子，這些博客通常是更好的選擇，
即使那個其他項目是專門爲與 Kubernetes （或與 Linux 等）協同工作而設計的。

<!--
## Relevant content

Articles must contain content that applies broadly to the Kubernetes community. For example, a
submission should focus on upstream Kubernetes as opposed to vendor-specific configurations.
For articles submitted to the main blog that are not
[mirror articles](/docs/contribute/blog/mirroring/), hyperlinks in the article should commonly
be to the official Kubernetes documentation. When making external references, links should be
diverse - for example, a submission shouldn't contain only links back to a single company's blog.
-->
## 相關內容

文章必須包含適用於整個 Kubernetes 社區的內容。例如，投稿應側重於上游
Kubernetes，而不是特定供應商的設定。
對於提交到主博客且不是[映像檔文章](/zh-cn/docs/contribute/blog/mirroring/)的文章，
文章中的超鏈接應通常指向官方 Kubernetes 文檔。
在進行外部引用時，鏈接應該是多樣的 - 例如，投稿不應只包含返回單個公司博客的鏈接。

<!--
The official Kubernetes blogs are **not** the place for vendor pitches or for articles that promote
a specific solution from outside Kubernetes.

Sometimes this is a delicate balance. You can ask in Slack ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J))
for guidance on whether a post is appropriate for the Kubernetes blog and / or contributor blog -
don't hesitate to reach out.

The [content guide](/docs/contribute/style/content-guide/) applies unconditionally to blog articles
and the PRs that add them. Bear in mind that some restrictions in the guide state that they are only relevant to documentation; those marked restrictions don't apply to blog articles.
-->
官方 Kubernetes 博客**不**是進行供應商宣傳或推廣 Kubernetes 外部特定解決方案的地方。

有時，這之間的平衡很微妙。你可以在 Slack （[#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J)）
上詢問某篇文章是否適合發佈在 Kubernetes 博客和/或貢獻者博客 - 不要猶豫，隨時聯繫。

[內容指南](/zh-cn/docs/contribute/style/content-guide/)無條件適用於博客文章及其添加的 PR。
請記住，指南中的一些限制僅與文檔相關；那些標記的限制不適用於博客文章。

<!--
## Localization

The website is localized into many languages; English is the “upstream” for all the other
localizations. Even if you speak another language and would be happy to provide a localization,
that should be in a separate pull request (see [languages per PR](/docs/contribute/new-content/#languages-per-pr)).
-->
## 本地化

網站已被本地化爲多種語言；英文是所有其他本地化的“上游”。即使你懂另一種語言並願意提供本地化，
這也應該是一個單獨的 PR（參見[每個 PR 的語言](/zh-cn/docs/contribute/new-content/#languages-per-pr)）。

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
## 版權和重用

你必須編寫[原創內容](#original-content)，
並且你必須擁有將該內容授權給雲原生計算基金會（Cloud Native Computing Foundation）
的權限（這樣 Kubernetes 項目才能合法發佈它）。
這意味着不僅直接抄襲是被禁止的，如果你沒有權限滿足 CNCF 版權許可條件
（例如，如果你的僱主有關於知識產權的政策限制了你能做的事情），
你也不能撰寫博客文章。

[license](https://github.com/kubernetes/website/blob/main/LICENSE)
允許將博客的內容用於商業目的，但反之則不然。

<!--
## Special interest groups and working groups

Topics related to participation in or results of Kubernetes SIG activities are always on
topic (see the work in the [Contributor Comms Team](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)
for support on these posts).

The project typically [mirrors](/docs/contribute/blog/mirroring/) these articles to both blogs.
-->
## 特別興趣小組和工作組

與參與 Kubernetes SIG 活動或其成果相關的主題總是合適的
（參見[貢獻者通訊團隊](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)中的工作以獲得這些帖子的支持）。

該項目通常會將這些文章[映像檔](/zh-cn/docs/contribute/blog/mirroring/)到兩個博客上。

<!--
## National restrictions on content

The Kubernetes website has an Internet Content Provider (ICP) licence from the government of China. Although it's unlikely to be a problem, Kubernetes cannot publish articles that would be blocked by the Chinese government's official filtering of internet content.
-->
## 國家對內容的限制

Kubernetes 網站擁有中國政府頒發的互聯網內容提供者（ICP）許可證。
Kubernetes 不能發佈那些會被中國政府官方網路內容過濾系統阻止的文章
（儘管這種情況不太可能發生）。

<!--
## Blog-specific content guidance {#what-we-publish}

As well as the general [style guide](/docs/contribute/style/style-guide/), blog articles should (not must) align to
the [blog-specific style recommendations](/docs/contribute/blog/article-submission/#article-content).

The remainder of this page is additional guidance; these are not strict rules that articles
must follow, but reviewers are likely to (and should) ask for edits to articles that are
obviously not aligned with the recommendations here.
-->
## 博客特定內容指南   {#what-we-publish}

除了通用的[風格指南](/zh-cn/docs/contribute/style/style-guide/)外，
博客文章應該（但不是必須）遵循
[博客特定風格建議](/zh-cn/docs/contribute/blog/article-submission/#article-content)。

本頁面其餘部分爲附加指南；這些並不是文章必須遵守的嚴格規則，但如果文章明顯不符合這裏的建議，
審稿人可能會（也應該）要求對文章進行編輯。

<!--
### Diagrams and illustrations {#illustrations}

For [illustrations](/docs/contribute/blog/article-submission/#illustrations) - including diagrams or charts - use the [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure)
where feasible. You should set an `alt` attribute for accessibility.
-->
### 圖表和插圖   {#illustrations}

對於[插圖](/zh-cn/docs/contribute/blog/article-submission/#illustrations)
—— 包括圖表或圖形
—— 在可行的情況下，使用[圖形簡碼](https://gohugo.io/content-management/shortcodes/#figure)。
你應該設置一個`alt`屬性以提高可訪問性。

<!--
Use vector images for illustrations, technical diagrams and similar graphics; SVG format is recommended as a strong preference.

Articles that use raster images for illustrations are more difficult to maintain and in some
cases the blog team may ask authors to revise the article before it could be published.
-->
使用矢量圖像進行插圖、技術圖表和類似圖形；強烈建議使用 SVG 格式。

使用光柵圖像進行插圖的文章更難以維護，在某些情況下，
博客團隊可能會要求作者在文章可以發佈之前進行修改。

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
### 時效性

博客文章應力求面向未來：

- 鑑於項目的開發速度，SIG Docs 傾向於 **timeless** 寫作：即不需要更新就能保持準確的內容。
- 相較於撰寫高層次概述的博客文章，添加教程或更新官方文檔可能是更好的選擇。
- 考慮將長技術內容集中在博客文章的呼籲行動中，並關注問題空間或爲什麼讀者應該關心。

<!--
### Content examples

Here are some examples of content that is appropriate for the
[main Kubernetes blog](/docs/contribute/blog/#main-blog):
-->
### 內容示例

以下是一些適合
[主 Kubernetes 博客](/zh-cn/docs/contribute/blog/#main-blog)的內容示例：

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
* 關於 Kubernetes 新功能的公告
* 解釋如何使用 Kubernetes 實現某個目標；例如，告訴我們你在基本滾動更新想法上的低操作改進
* 比較幾個與 Kubernetes 和雲原生有關的不同軟件選項。可以提及其中一個選項的鏈接，但必須充分披露你的利益衝突/關係。
* 講述問題或事件的故事，以及你是如何解決它們的
* 討論構建針對特定用例的雲原生平臺的文章
* 你對 Kubernetes 的優缺點的看法
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
* 關於非核心 Kubernetes 的公告和故事，例如 Gateway API
* [發佈後公告和更新](#post-release-comms)
* 關於重要的 Kubernetes 安全漏洞的消息
* Kubernetes 項目更新
* 教程和操作指南
* 圍繞 Kubernetes 和雲原生的思想領導力
* Kubernetes 的組件是故意設計成模塊化的，因此撰寫關於現有集成點的文章
 （如 CNI 和 CSI）是相關的。只要你不是在寫供應商宣傳，你也可以寫這些集成的另一端是什麼。

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
這裏有一些適合 Kubernetes [貢獻者博客](/zh-cn/docs/contribute/blog/#contributor-blog)的內容示例：

* 關於如何測試你對 Kubernetes 代碼的更改的文章
* 圍繞非代碼貢獻的內容
* 討論設計仍在討論中的 alpha 特性的文章
* “認識團隊”文章，介紹工作組、特別興趣小組等
* 關於如何編寫將成爲 Kubernetes 一部分的安全代碼的指南
* 關於維護者峯會及其成果的文章

<!--
### Examples of content that wouldn't be accepted {#what-we-do-not-publish}

However, the project will not publish:
-->
### 不會被接受的內容示例  {#what-we-do-not-publish}

然而，項目不會發布：

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
* 供應商宣傳
* 你在其他地方已發佈過的文章，即使是發佈在你自己的低流量博客上
* 僅有少量解釋的大段示例源代碼
* 關於外部項目的更新，如果該項目依賴於 Kubernetes（請將這些內容發佈在外項目自己的博客上）
* 關於與特定雲提供商一起使用 Kubernetes 的文章
* 批評特定人士、人羣或企業的文章
* 包含重要技術錯誤或誤導性細節的文章（例如：
  如果你建議在生產叢集中關閉一個重要安全控制，因爲其可能帶來不便，
  Kubernetes 項目可能會拒絕該文章）
