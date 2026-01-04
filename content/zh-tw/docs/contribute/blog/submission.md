---
title: 給 Kubernetes 博客提交文章
slug: article-submission
content_type: concept
weight: 30
---
<!--
title: Submitting articles to Kubernetes blogs
slug: article-submission
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
There are two official Kubernetes blogs, and the CNCF has its own blog where you can cover Kubernetes too.
For the [main Kubernetes blog](/docs/contribute/blog/), we (the Kubernetes project) like to publish articles with different perspectives and special focuses, that have a link to Kubernetes.

With only a few special case exceptions, we only publish content that hasn't been submitted or published anywhere else.
-->
Kubernetes 有兩個官方博客，CNCF 也有自己的博客頻道，你也可以在 CNCF 博客頻道上發佈與
Kubernetes 相關的內容。對於 [Kubernetes 主博客](/zh-cn/docs/contribute/blog/)，
我們（Kubernetes 項目組）希望發佈與 Kubernetes 有關聯的具有不同視角和獨特關注點的文章。

除非有特殊情況，我們只發布尚未在其他任何地方投稿或發佈的內容。

<!-- body -->

<!--
## Writing for the Kubernetes blog(s)

As an author, you have three different routes towards publication.
-->
## 爲 Kubernetes 博客撰寫文章   {#writing-for-the-kubernetes-blogs}

作爲一名作者，你有三個渠道來發表文章。

<!--
### Recommended route {#route-1}

The approach the Kubernetes project recommends is: pitch your article by contacting the blog team. You can do that via Kubernetes Slack ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J)).
For articles that you want to publish to the contributor blog only, you can also pitch directly
to [SIG ContribEx comms](https://kubernetes.slack.com/archives/C03KT3SUJ20).
-->
### 推薦的渠道   {#route-1}

Kubernetes 項目推薦的方式是：聯繫並向博客團隊投稿。你可以通過 Kubernetes Slack 頻道
[#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J) 聯繫他們。
如果你希望文章僅發佈在貢獻者博客上，也可以直接向
[SIG ContribEx 委員會](https://kubernetes.slack.com/archives/C03KT3SUJ20)投稿。

<!-- FIXME: or using this [form] -->

<!--
Unless there's a problem with your submission, the blog team / SIG ContribEx will pair you up with:

* a blog _editor_
* your _writing buddy_ (another blog author)
-->
除非你的投稿有問題，否則博客團隊或 SIG ContribEx 會爲你分配：

* 一位博客**編輯**
* 一位**寫作搭檔**（另一位博客作者）

<!--
When the team pairs you up with another author, the idea is that you both support each other by
reviewing the other author's draft article. You don't need to be a subject matter expert; most of
the people who read the article also won't be experts. We, the Kubernetes blog team, call the other author a writing buddy.

The editor is there to help you along the journey from draft to publication. They will either be
directly able to approve your article for publication, or can arrange for the approval to happen.

Read [authoring a blog article](#authoring) to learn more about the process.
-->
之所以爲你分配另一位作者配對，是爲了讓你們互相支持，互相審閱彼此的文章草稿。
你並不需要非得是某個主題類的專家；大多數讀者也不是專家。
Kubernetes 博客團隊把爲你分配的另一位作者稱爲“寫作搭檔”。

編輯會協助你完成從草稿到發表的整個過程。他們可以直接批准文章發佈，或安排他人進行批准。

參閱[撰寫博客文章](#authoring)以瞭解更多流程資訊。

<!--
### Starting with a pull request {#route-2}

The second route to writing for our blogs is to start directly with a pull request in GitHub. The
blog team actually don't recommend this; GitHub is quite useful for collaborating on code,
but isn't an ideal fit for prose text.
-->
### 渠道 2：提交 PR   {#route-2}

第二種撰寫博客的渠道是直接在 GitHub 提交 PR。
不過博客團隊並不推薦這種方式；GitHub 很適合協作開發代碼，但不太適合處理純文本寫作。

<!--
It's absolutely fine to open a placeholder pull request with just an empty commit, and then
work elsewhere before returning to your placeholder PR.

Similar to the [recommended route](#route-1), we'll try to pair you up with a writing buddy
and a blog editor. They'll help you get the article ready for publication.
-->
你完全可以先提交一個不包含任何 Commit 的佔位 PR，然後在其他地方寫好後再把文章推送到此 PR。

與[推薦渠道](#route-1)類似，我們會嘗試爲你配對一位寫作搭檔和一位博客編輯。
他們會協助你讓文章達到發佈就緒的狀態。

<!--
### Post-release blog article process {#route-3-post-release-comms}

The third route is for blog articles about changes in Kubernetes relating to a release. Each
time there is a release, the Release Comms team takes over the blog publication schedule. People
adding features to a release, or who are planning other changes that the project needs to announce, can
liaise with Release Comms to get their article planned, drafted, edited, and eventually published.
-->
### 渠道 3：發版後的博文流程  {#route-3-post-release-comms}

第三種渠道適合 Kubernetes 新版本發版時講述版本變更的博客文章。
Kubernetes 每次發版時，Release Comms 團隊會接手管理博客發佈日程。
如果你是爲某個版本添加特性的人員或計劃發佈項目所需其他變更的人員，
可以聯絡 Release Comms，規劃、撰寫、編輯並最終發佈博客文章。

<!--
## Article scheduling

For the Kubernetes blog, the blog team usually schedules blog articles to publish on weekdays
(Gregorian calendar, as used in the USA and other countries). When it's important to publish on
a specific date that falls on a weekend, the blog team try to accommodate that.
-->
## 文章時間安排   {#article-scheduling}

對於 Kubernetes 博客，博客團隊通常安排在工作日（美國等國家使用的公曆）發佈文章。
如果很重要，有必要在週末發佈文章，博客團隊會盡力配合。

<!--
The section on [authoring a blog article](#authoring) explains what to do:

* initially, don't specify a date for the article
* however, do set the article as draft (put `draft: true` in the front matter)
-->
在[撰寫博客文章](#authoring)一節中說明了：

* 起初無需指定文章的發佈日期
* 但需要將文章標記爲 Draft（在 Front Matter 中添加 `draft: true`）

<!--
When the Prow bot merges the PR you write, it will be a draft and won't be set to publish. A
Kubernetes contributor (either you, your writing buddy or someone from the blog team) then opens a small
follow-up PR that marks it for publication. Merging that second PR releases the previously-draft
article so that it can automatically publish.

On the day the article is scheduled to publish, automation triggers a website build and your
article becomes visible.
-->
當 Prow 機器人處理你提交的 PR 時，起初它是一個 Draft（草稿），不會設置爲待發布。
隨後 Kubernetes 的一名貢獻者（你、你的寫作搭檔或博客團隊的其他人）會提交一個小的跟進 PR，將你的 PR 標記爲待發布。
Prow 機器人接受第二個跟進 PR 後會修改之前標記爲 Draft 的文章狀態，這樣你的 PR 就可以自動發佈。

到了文章計劃發佈的那一天後，自動化流程會觸發網站構建，讓你的文章對大衆可見。

<!--
## Authoring an article {#authoring}

After you've pitched, we'll encourage you to use either HackMD (a web Markdown editor) or a
Google doc, to share an editable version of the article text. Your writing buddy can read your
draft text and then either directly make suggestions or provide other feedback. They should
also let you know if what you're drafting feedback isn't in line with the
[blog guidelines](/docs/contribute/blog/guidelines/).

At the same time, you'll normally be **their** writing buddy and can follow our
[guide](/docs/contribute/blog/writing-buddy/) about supporting their work.
-->
## 撰寫文章 {#authoring}

在你投稿之後，我們會鼓勵你使用 HackMD（一種 Web 版 Markdown 編輯器）或 Google 文檔來分享可編輯版本的文章。
你的寫作搭檔可以閱讀你的草稿文字，並直接提出建議或反饋。
如果你寫的內容不符合[博客指南](/zh-cn/docs/contribute/blog/guidelines/)，他們也會指出來。

同時，你通常也會是他們的寫作搭檔，
可以參考我們的[寫作搭檔指南](/zh-cn/docs/contribute/blog/writing-buddy/)支持他們的工作。

<!--
### Initial administrative steps

You should [sign the CLA](/docs/contribute/new-content/#contributing-basics)
if you have not yet done so. It is best to make sure you start this early on; if you are
writing as part of your job, you may need to check with the workplace legal team or with
your manager, to make sure that you are allowed to sign.
-->
### 初始管理步驟   {#initial-administrative-steps}

如果你尚未[簽署 CLA](/zh-cn/docs/contribute/new-content/#contributing-basics)，應當先簽署 CLA。
最好儘早完成 CLA 的簽署。如果你是在工作崗位上把撰寫文章作爲一部分工作，
你可能需要與公司法律團隊或上級主管確認你是否允許簽署 CLA。

<!--
### Initial drafting

The blog team recommends that you either use HackMD (a web Markdown editor) or a
Google doc, to prepare and share an initial, live-editable version of the article text.
-->
### 草擬初稿   {#intial-drafting}

博客團隊建議你使用 HackMD（一個 Web 版的 Markdown 編輯器）或 Google 文檔來準備和分享可編輯版本的文章初稿。

{{< note >}}
<!--
If you choose to use Google Docs, you can set your document into Markdown mode.
-->
如果你選擇使用 Google 文檔，你可以將文檔切換至 Markdown 模式。
{{< /note >}}

<!--
Your writing buddy can provide comments and / or feedback for your draft text and
will (or should) check that it's in line with the guidelines. At the same time, you'll
be their writing buddy and can follow the [guide](/docs/contribute/blog/writing-buddy/)
that explains how you'll be supporting their work.
-->
你的寫作搭檔可以對你的草稿文字進行評論和反饋，並檢查是否符合博客指南。
與此同時，你也是他們的寫作搭檔，
參考[編輯指南](/zh-cn/docs/contribute/blog/writing-buddy/)瞭解如何支持搭檔的工作。

<!--
Don't worry too much at this stage about getting the Markdown formatting exactly right, though.

If you have images, you can paste in a bitmap copy for early feedback. The blog team can help
you (later in the process), to get illustrations ready for final publication.
-->
你在這個階段無需顧慮 Markdown 格式是否完美。

如果有圖片，你可以粘貼位圖副本獲取初期反饋。博客團隊會（在後續流程中）協助你讓插圖達到最終發佈狀態。

<!--
### Markdown for publication

Have a look at the Markdown format for existing blog posts in the
[website repository](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts)
in GitHub.
-->
### Markdown 發佈

你可以參考 GitHub 中已有博客文章的 Markdown 格式：
[網站倉庫](https://github.com/kubernetes/website/tree/master/content/zh-cn/blog/_posts)。

<!--
If you're not already familiar, read [contributing basics](/docs/contribute/new-content/#contributing-basics).
This section of the page assumes that you don't have a local clone of your fork and that you
are working within the GitHub web UI.
You do need to make a remote fork of the website repository if you haven't already done so.
-->
如果你還不熟悉，參閱[貢獻基本知識](/zh-cn/docs/contribute/new-content/#contributing-basics)。
本節假設你沒有本地克隆的 Fork，假設你是通過 GitHub 網頁 UI 操作的。
如果你還未這樣操作，你需要先遠程 Fork 網站倉庫。

<!--
In the GitHub repository, click the **Create new file** button. Copy your existing content
from HackMD or Google Docs, then paste it into the editor.
There are more details later in the section about what goes into that file.
Name the file to match the proposed title of the blog post, but don’t put the date in the file name.
The blog reviewers will work with you to set the final file name and the date when the article will be published.
-->
在 GitHub 倉庫中，點擊 **Create new file** 按鈕。
複製 HackMD 或 Google Docs 上寫好的內容，粘貼到編輯器中。
下文會說明有關如何進入該檔案的更多細節。
此檔案的命名應與擬定的博客文章標題相匹配，但**不要**在檔案名中包含日期。
博客審閱人員會與你一起確定最終檔案名和文章發佈日期。

<!--
1. When you save the file, GitHub will walk you through the pull request process.

2. Your writing buddy can review your submission and work with you on feedback and final details.
   A blog editor approves your pull request to merge, as a draft that is not yet scheduled.
-->
1. 你在保存檔案時，GitHub 會引導你完成 PR 流程。

2. 你的寫作搭檔會審閱你提交的 PR，並與你協作處理反饋和最終細節。
   博客編輯會將你的 PR 作爲未排期的草稿批准合併。

<!--
#### Front matter

The Markdown file you write should use YAML-format Hugo
[front matter](https://gohugo.io/content-management/front-matter/).

Here's an example:
-->
#### Front Matter

你撰寫的 Markdown 檔案應使用 YAML 格式的 Hugo
[Front Matter](https://gohugo.io/content-management/front-matter/)。

以下是一個例子：

<!--
```yaml
---
layout: blog
title: "Your Title Here"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: lowercase-text-for-link-goes-here-no-spaces # optional
author: >
  Author-1 (Affiliation),
  Author-2 (Affiliation),
  Author-3 (Affiliation)
---
```
-->
```yaml
---
layout: blog
title: "你的文章標題"
draft: true # 發佈前會改爲 date: YYYY-MM-DD
slug: 小寫文字組成的不含空格的鏈接放在這裏 # 可選
author: >
  作者 1（所屬機構）,
  作者 2（所屬機構）,
  作者 3（所屬機構）
---
```

<!--
* initially, don't specify a date for the article
* however, do set the article as draft (put `draft: true` in the
  article [front matter](https://gohugo.io/content-management/front-matter/))
-->
* 起初無需指定文章的發佈日期
* 但需要將文章標記爲 Draft（在
  [Front Matter](https://gohugo.io/content-management/front-matter/) 中添加 `draft: true`）

<!--
#### Article content

Make sure to use second-level Markdown headings (`##` not `#`) as the topmost heading level in
the article. The `title` you set in the front matter becomes the first-level heading for that
page.

You should follow the [style guide](https://kubernetes.io/docs/contribute/style/style-guide/),
but with the following exceptions:
-->
#### 正文內容

確保使用二級 Markdown 標題（`##`，不要用 `#`）作爲正文的最頂級標題。
你在 Front Matter 中設置的 `title` 會作爲該頁面的一級標題。

你應遵循[風格指南](/zh-cn/docs/contribute/style/style-guide/)，但以下例外：

<!--
- we are OK to have authors write an article in their own writing style, so long as most readers
  would follow the point being made
- it is OK to use “we“ in a blog article that has multiple authors, or where the article introduction clearly indicates that the author is writing on behalf of a specific group.
  As you'll notice from this section, although we [avoid using “we”](/docs/contribute/style/style-guide/#avoid-using-we) in our documentation,
  it's OK to make justifiable exceptions.
-->
- 我們允許作者採用自己的寫作風格，只要大多數讀者能理解要點就行。
- 對於有多位作者的博客文章，或文章開頭已明確說明是代表某組織撰寫的，可以使用“我們”。
  如本節所見，雖然我們在文檔中[不推薦使用“我們”](/zh-cn/docs/contribute/style/style-guide/#avoid-using-we)這樣的表述，
  但也可以有一些例外。
<!--
- we avoid using Kubernetes shortcodes for callouts (such as `{{</* caution */>}}`). This is
  because callouts are aimed at documentation readers, and blog articles aren't documentation.
- statements about the future are OK, albeit we use them with care in official announcements on
  behalf of Kubernetes
- code samples used in blog articles don't need to use the `{{</* code_sample */>}}` shortcode, and often
  it is better (easier to maintain) if they do not
-->
- 避免使用 Kubernetes 短代碼（如 `{{</* caution */>}}`）做提醒。
  這是因爲提醒主要面向的是文檔讀者，而博客文章並不是文檔。
- 對未來的預測性陳述是允許的，但代表 Kubernetes 的官方公告中應慎用。
- 博客文章中所用的代碼示例無需使用 `{{</* code_sample */>}}` 短代碼，通常直接展示更便於維護。

<!--
#### Diagrams and illustrations {#illustrations}

For illustrations, diagrams or charts, use the [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure) can be used where feasible. You should set an `alt` attribute for accessibility.
-->
#### 圖表與插圖 {#illustrations}

如使用圖表、插圖或圖示，推薦使用
[figure shortcode](https://gohugo.io/content-management/shortcodes/#figure)。
你應該設置 `alt` 屬性以避免訪問速度不佳的問題。

<!--
For illustrations and technical diagrams, try to use vector graphics. The blog team recommend SVG over raster (bitmap / pixel)
diagram formats, and also recommend SVG rather than Mermaid (you can still capture the Mermaid source in a comment).
The preference for SVG over Mermaid is because when maintainers upgrade Mermaid or make changes to diagram rendering, they may not have an easy way to contact the original blog article author to check that the changes are OK.
-->
對於插圖或技術圖表，應儘量使用矢量圖。
博客團隊推薦使用 SVG，而非光柵（位圖）格式或 Mermaid（但你可以將 Mermaid 源代碼作爲註釋保留）。
我們傾向於 SVG 而非 Mermaid，是因爲當維護者升級 Mermaid 或調整圖表渲染時，往往無法聯繫到原文作者確認變更是否合適。

<!--
The [diagram guide](/docs/contribute/style/diagram-guide/) is aimed at Kubernetes documentation,
  not blog articles. It is still good to align with it but:
- there is no need to caption diagrams as Figure 1, Figure 2, etc.

The requirement for scalable (vector) imanges makes the process more difficult for
less-familiar folks to submit articles; Kubernetes SIG Docs continues to look for ways to
lower this bar.
If you have ideas on how to lower the barrier, please volunteer to help out.
-->
[圖表指南](/zh-cn/docs/contribute/style/diagram-guide/)主要面向 Kubernetes 文檔，而非博客文章。
你可以參考，但：

* 無需爲圖表編號（如圖 1、圖 2 等）

因爲矢量圖要求較高，可能對不熟悉流程的投稿人造成困難；
Kubernetes SIG Docs 正在尋找降低門檻的方法。
如果你有降低門檻的好主意，歡迎志願者幫助解決這個問題。

<!-- note to maintainers of this page: vector images are easier to localize and
     are resolution independent, so can look consistently good on different screens -->

<!--
For other images (such as photos), the blog team strongly encourages use of `alt` attributes.
It is OK to use an empty `alt` attribute if accessibility software should not mention the
image at all, but this is a rare situation.
-->
對於照片等其他圖像，博客團隊強烈建議使用 `alt` 屬性。
如果不希望輔助工具讀出圖片內容，也可以使用空的 `alt` 屬性，但這種情況較少見。

<!--
#### Commit messages

At the point you mark your pull request ready for review, each commit message should be a
short summary of the work being done. The first commit message should make sense as an overall
description of the blog post.
-->
#### Commit 消息

當你標記 PR 爲“Ready for review”時，每條 Commit 消息應簡明總結工作內容。
第一條 Commit 消息應能大致描述整篇博文內容。

<!--
Examples of a good commit message:

- _Add blog post on the foo kubernetes feature_
- _blog: foobar announcement_
-->
良好的 Commit 消息示例：

- _Add blog post on the foo kubernetes feature_
- _blog: foobar announcement_

<!--
Examples of bad commit messages:

- _Placeholder commit for announcement about foo_
- _Add blog post_
- _asdf_
- _initial commit_
- _draft post_
-->
不好的 Commit 消息示例：

- _Placeholder commit for announcement about foo_
- _Add blog post_
- _asdf_
- _initial commit_
- _draft post_

<!--
#### Squashing

Once you think the article is ready to merge, you should
[squash](https://www.k8s.dev/docs/guide/pull-requests/#squashing) the commits in your pull
request; if you're not sure how to, it's OK to ask the blog team for help.
-->
#### 壓縮 Commit

當你認爲文章已準備好合併時，應[壓縮（Squash）](https://www.k8s.dev/docs/guide/pull-requests/#squashing)
PR 中的 Commit。如果你不清楚如何操作，可以請博客團隊協助。
