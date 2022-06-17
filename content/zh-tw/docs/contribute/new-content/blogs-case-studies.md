---
title: 提交部落格和案例分析
linktitle: 部落格和案例分析
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
任何人都可以撰寫部落格並提交評閱。
案例分析則在被批准之前需要更多的評閱。

<!-- body -->

<!--
## The Kubernetes Blog

The Kubernetes blog is used by the project to communicate new features, community reports, and any news that might be relevant to the Kubernetes community. 
This includes end users and developers. 
Most of the blog's content is about things happening in the core project, but we encourage you to submit about things happening elsewhere in the ecosystem too!

Anyone can write a blog post and submit it for review.
-->
## Kubernetes 部落格

Kubernetes 部落格用於專案釋出新功能特性、
社群報告以及其他一些可能對整個社群很重要的新聞。
其讀者包括終端使用者和開發人員。
大多數部落格的內容是關於核心專案中正在發生的事情，
不過我們也鼓勵你提交一些有關生態系統中其他時事的部落格。

任何人都可以撰寫部落格並提交評閱。

<!-- 
### Submit a Post

Blog posts should not be commercial in nature and should consist of original content that applies broadly to the Kubernetes community.
Appropriate blog content includes:

- New Kubernetes capabilities
- Kubernetes projects updates
- Updates from Special Interest Groups
- Tutorials and walkthroughs
- Thought leadership around Kubernetes
- Kubernetes Partner OSS integration
- **Original content only**
-->
### 提交博文

博文不應該是商業性質的，應該包含廣泛適用於 Kubernetes 社群的原創內容。
合適的部落格內容包括：

- Kubernetes 新能力
- Kubernetes 專案更新資訊
- 來自特別興趣小組（Special Interest Groups, SIG）的更新資訊
- 教程和演練
- 有關 Kubernetes 的綱領性理念
- Kubernetes 合作伙伴 OSS 整合資訊
- **僅限原創內容**

<!-- 
Unsuitable content includes:

- Vendor product pitches
- Partner updates without an integration and customer story
- Syndicated posts (language translations ok)
-->

不合適的部落格內容包括：

- 供應商產品推介
- 不含整合資訊和客戶故事的合作伙伴更新資訊
- 已發表的博文（可刊登博文譯稿）

<!-- 
To submit a blog post, follow these steps:

1. [Sign the CLA](https://kubernetes.io/docs/contribute/start/#sign-the-cla) if you have not yet done so.
1. Have a look at the Markdown format for existing blog posts in the [website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).
1. Write out your blog post in a text editor of your choice.
1. On the same link from step 2, click the Create new file button. Paste your content into the editor. Name the file to match the proposed title of the blog post, but don’t put the date in the file name. The blog reviewers will work with you on the final file name and the date the blog will be published.
1. When you save the file, GitHub will walk you through the pull request process.
1. A blog post reviewer will review your submission and work with you on feedback and final details. When the blog post is approved, the blog will be scheduled for publication.
-->
要提交博文，你可以遵從以下步驟：

1. 如果你還未簽署 CLA，請先[簽署 CLA](https://kubernetes.io/docs/contribute/start/#sign-the-cla)。
2. 查閱[網站倉庫](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts)中現有博文的 Markdown 格式。
3. 在你所選的文字編輯器中撰寫你的博文。
4. 在第 2 步的同一連結上，點選 **Create new file** 按鈕。
   將你的內容貼上到編輯器中。為檔案命名，使其與提議的博文標題一致，
   但不要在檔名中寫日期。
   部落格評閱者將與你一起確定最終的檔名和發表部落格的日期。
5. 儲存檔案時，GitHub 將引導你完成 PR 流程。
6. 部落格評閱者將評閱你提交的內容，並與你一起處理反饋和最終細節。
   當博文被批准後，部落格將排期發表。

<!--
### Guidelines and expectations

- Blog posts should not be vendor pitches. 
  - Articles must contain content that applies broadly to the Kubernetes community. For example, a submission should focus on upstream Kubernetes as opposed to vendor-specific configurations. Check the [Documentation style guide](/docs/contribute/style/content-guide/#what-s-allowed) for what is typically allowed on Kubernetes properties. 
  - Links should primarily be to the official Kubernetes documentation. When using external references, links should be diverse - For example a submission shouldn't contain only links back to a single company's blog.
  - Sometimes this is a delicate balance. The [blog team](https://kubernetes.slack.com/messages/sig-docs-blog/) is there to give guidance on whether a post is appropriate for the Kubernetes blog, so don't hesitate to reach out. 
-->
### 指導原則和期望  {#guidelines-and-expectations}

- 部落格內容不可以是銷售用語。
  - 文章內容必須是對整個 Kubernetes 社群中很多人都有參考意義。
    例如，所提交的文章應該關注上游的 Kubernetes 專案本身，而不是某個廠商特定的配置。
    請參閱[文件風格指南](/zh-cn/docs/contribute/style/content-guide/#what-s-allowed)
    以瞭解哪些內容是 Kubernetes 所允許的。
  - 連結應該主要指向官方的 Kubernetes 文件。
    當引用外部資訊時，連結應該是多樣的。
    例如，所提交的部落格文章中不可以只包含指向某個公司的部落格的連結。
  - 有些時候，這是一個比較棘手的權衡過程。
    [部落格團隊](https://kubernetes.slack.com/messages/sig-docs-blog/)的存在目的即是為
    Kubernetes 部落格提供文章是否合適的指導意見。
    所以，需要幫助的時候不要猶豫。
<!--
- Blog posts are not published on specific dates.
    - Articles are reviewed by community volunteers. We'll try our best to accommodate specific timing, but we make no guarantees.
  - Many core parts of the Kubernetes projects submit blog posts during release windows, delaying publication times. Consider submitting during a quieter period of the release cycle.
  - If you are looking for greater coordination on post release dates, coordinating with [CNCF marketing](https://www.cncf.io/about/contact/) is a more appropriate choice than submitting a blog post.
  - Sometimes reviews can get backed up. If you feel your review isn't getting the attention it needs, you can reach out to the blog team via [this slack channel](https://kubernetes.slack.com/messages/sig-docs-blog/) to ask in real time. 
-->
- 部落格內容並非在某特定日期發表。
    - 文章會交由社群自願者評閱。我們會盡力滿足特定的時限要求，只是無法就此作出承諾。
  - Kubernetes 專案的很多核心元件會在釋出視窗期內提交部落格文章，導致發表時間被推遲。
    因此，請考慮在釋出週期內較為平靜的時間段提交部落格文章。
  - 如果你希望就博文發表日期上進行較大範圍的協調，請聯絡
    [CNCF 推廣團隊](https://www.cncf.io/about/contact/)。
    這也許是比提交部落格文章更合適的一種選擇。
  - 有時，部落格的評審可能會堆積起來。如果你覺得你的文章沒有引起該有的重視，
    你可以透過[此 Slack 頻道](https://kubernetes.slack.com/messages/sig-docs-blog/)
    聯絡部落格團隊，以獲得實時反饋。
<!--
- Blog posts should be relevant to Kubernetes users.
  - Topics related to participation in or results of Kubernetes SIGs activities are always on topic (see the work in the [Upstream Marketing Team](https://github.com/kubernetes/community/blob/master/communication/marketing-team/blog-guidelines.md#upstream-marketing-blog-guidelines) for support on these posts). 
  - The components of Kubernetes are purposely modular, so tools that use existing integration points like CNI and CSI are on topic. 
  - Posts about other CNCF projects may or may not be on topic. We recommend asking the blog team before submitting a draft.
    - Many CNCF projects have their own blog. These are often a better choice for posts. There are times of major feature or milestone for a CNCF project that users would be interested in reading on the Kubernetes blog.
  - Blog posts about contributing to the Kubernetes project should be in the [Kubernetes Contributors site](https://kubernetes.dev)
-->
- 部落格內容應該對 Kubernetes 使用者有用。
  - 與參與 Kubernetes SIGs 活動相關，或者與這類活動的結果相關的主題通常是切題的。
    請參考[上游推廣團隊](https://github.com/kubernetes/community/blob/master/communication/marketing-team/blog-guidelines.md#upstream-marketing-blog-guidelines)的工作以獲得對此類博文的支援。
  - Kubernetes 的元件都有意設計得模組化，因此使用類似 CNI、CSI 等整合點的工具
    通常都是切題的。
  - 關於其他 CNCF 專案的部落格可能切題也可能不切題。
    我們建議你在提交草稿之前與部落格團隊聯絡。
    - 很多 CNCF 專案有自己的部落格。這些部落格通常是更好的選擇。
      有些時候，某個 CNCF 專案的主要功能特性或者里程碑的變化可能是使用者有興趣在
      Kubernetes 部落格上閱讀的內容。
  - 關於為 Kubernetes 專案做貢獻的部落格內容應該放在 [Kubernetes 貢獻者站點](https://kubernetes.dev)上。
<!--
- Blog posts should be original content
  - The official blog is not for repurposing existing content from a third party as new content.
  - The [license](https://github.com/kubernetes/website/blob/main/LICENSE) for the blog allows commercial use of the content for commercial purposes, just not the other way around. 
- Blog posts should aim to be future proof
  - Given the development velocity of the project, we want evergreen content that won't require updates to stay accurate for the reader. 
  - It can be a better choice to add a tutorial or update official documentation than to write a high level overview as a blog post.
    - Consider concentrating the long technical content as a call to action of the blog post, and focus on the problem space or why readers should care.
-->
- 部落格文章應該是原創內容。
  - 官方部落格的目的不是將某第三方已發表的內容重新作為新內容發表。
  - 部落格的[授權協議](https://github.com/kubernetes/website/blob/main/LICENSE)
    的確允許出於商業目的來使用部落格內容；但並不是所有可以商用的內容都適合在這裡發表。
- 部落格文章的內容應該在一段時間內不過期。
  - 考慮到專案的開發速度，我們希望讀者看到的是不必更新就能保持長期準確的內容。 
  - 有時候，在官方文件中新增一個教程或者進行內容更新都是比部落格更好的選擇。
    - 可以考慮在部落格文章中將較長技術內容的重點放在鼓勵讀者自行嘗試上，或者
      放在問題域本身或者為什麼讀者應該關注某個話題上。

<!--
### Technical Considerations for submitting a blog post

Submissions need to be in Markdown format to be used by the [Hugo](https://gohugo.io/) generator for the blog. There are [many resources available](https://gohugo.io/documentation/) on how to use this technology stack.

We recognize that this requirement makes the process more difficult for less-familiar folks to submit, and we're constantly looking at solutions to lower this bar. If you have ideas on how to lower the barrier, please volunteer to help out. 
-->
### 提交部落格的技術考慮

所提交的內容應該是 Markdown 格式的，以便能夠被 [Hugo](https://gohugo.io/) 生成器來處理。
關於如何使用相關技術，有[很多可用的資源](https://gohugo.io/documentation/)。

我們知道這一需求可能給那些對此過程不熟悉的朋友們帶來不便，
我們也一直在尋找降低難度的解決方案。
如果你有降低難度的好主意，請自薦幫忙。

<!--
The SIG Docs [blog subproject](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject) manages the review process for blog posts. For more information, see [Submit a post](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post).

To submit a blog post follow these directions:
-->
SIG Docs [部落格子專案](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject) 負責管理部落格的評閱過程。
更多資訊可參考[提交博文](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post)。

要提交博文，你可以遵從以下指南：
<!--
- [Open a pull request](/docs/contribute/new-content/open-a-pr/#fork-the-repo) with a new blog post. New blog posts go under the [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/main/content/en/blog/_posts) directory.

- Ensure that your blog post follows the correct naming conventions and the following frontmatter (metadata) information:

  - The Markdown file name must follow the format `YYYY-MM-DD-Your-Title-Here.md`. For example, `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
  - Do **not** include dots in the filename. A name like `2020-01-01-whats-new-in-1.19.md` causes failures during a build.
  - The front matter must include the following:
-->
- [發起一個包含新博文的 PR](/zh-cn/docs/contribute/new-content/open-a-pr/#fork-the-repo)。
  新博文要創建於 [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/main/content/en/blog/_posts) 目錄下。

- 確保你的博文遵從合適的命名規範，並帶有下面的引言（元資料）資訊：

  - Markdown 檔名必須符合格式 `YYYY-MM-DD-Your-Title-Here.md`。
    例如，`2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`。
  - **不要**在檔名中包含多餘的句點。類似 `2020-01-01-whats-new-in-1.19.md`
    這類檔名會導致檔案無法正確開啟。
  - 引言部分必須包含以下內容：

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
  - 第一個或者最初的提交的描述資訊中應該包含一個所作工作的簡單摘要，
    並作為整個博文的一個獨立描述。
    請注意，對博文的後續修改編輯都會最終合併到此主提交中，所以此提交的描述資訊
    應該儘量有用。
    - 較好的提交訊息（Commit Message）示例：
      -  _Add blog post on the foo kubernetes feature_
      -  _blog: foobar announcement_
    - 較差的提交訊息示例：
      - _Add blog post_
      - _._
      - _initial commit_
      - _draft post_
  - 部落格團隊會對 PR 內容進行評閱，為你提供一些評語以便修訂。
    之後，機器人會將你的博文合併並發表。

<!-- 
  - If the content of the blog post contains only content that is not expected to require updates to stay accurate for the reader, it can be marked as evergreen and exempted from the automatic warning about outdated content added to blog posts older than one year.
    - To mark a blog post as evergreen, add this to the front matter:
      
      ```yaml
      evergreen: true
      ```
    - Examples of content that should not be marked evergreen:
      - **Tutorials** that only apply to specific releases or versions and not all future versions
      - References to pre-GA APIs or features
-->

  - 如果博文的內容僅包含預期無需更新就能對讀者保持精準的內容，
    則可以將這篇博文標記為長期有效（evergreen），
    且免除新增博文發表一年後內容過期的自動警告。
    - 要將一篇博文標記為長期有效，請在引言部分新增以下標記：
      
      ```yaml
      evergreen: true
      ```
    - 不應標記為長期有效的內容示例：
      - 僅適用於特定發行版或版本而不是所有未來版本的**教程**
      - 對非正式發行（Pre-GA）API 或功能特性的引用

<!--
## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve
real-world problems. The Kubernetes marketing team and members of the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} collaborate with you on all case studies.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/main/content/en/case-studies).

Refer to the [case study guidelines](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md) and submit your request as outlined in the guidelines. 
-->
## 提交案例分析

案例分析用來概述組織如何使用 Kubernetes 解決現實世界的問題。
Kubernetes 市場化團隊和 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 成員會與你一起工作，
撰寫所有的案例分析。

請檢視[現有案例分析](https://github.com/kubernetes/website/tree/main/content/en/case-studies)的原始碼。

參考[案例分析指南](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md)，
根據指南中的注意事項提交你的 PR 請求。

