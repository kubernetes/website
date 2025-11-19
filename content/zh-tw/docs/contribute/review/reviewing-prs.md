---
title: 評審 PR
content_type: concept
main_menu: true
weight: 10
---
<!--
title: Reviewing pull requests
content_type: concept
main_menu: true
weight: 10
-->

<!-- overview -->

<!--
Anyone can review a documentation pull request. Visit the [pull requests](https://github.com/kubernetes/website/pulls) section in the Kubernetes website repository to see open pull requests.

Reviewing documentation pull requests is a
great way to introduce yourself to the Kubernetes community.
It helps you learn the code base and build trust with other contributors.

Before reviewing, it's a good idea to:

- Read the  [content guide](/docs/contribute/style/content-guide/) and
  [style guide](/docs/contribute/style/style-guide/) so you can leave informed comments.
- Understand the different
  [roles and responsibilities](/docs/contribute/participate/roles-and-responsibilities/)
  in the Kubernetes documentation community.
-->
任何人均可評審文檔的拉取請求。
訪問 Kubernetes 網站倉庫的 [pull requests](https://github.com/kubernetes/website/pulls) 部分，
可以查看所有待處理的拉取請求（PR）。

評審文檔 PR 是將你自己介紹給 Kubernetes 社區的一種很好的方式。
它將有助於你學習代碼庫並與其他貢獻者之間建立相互信任關係。

在評審之前，可以考慮：

- 閱讀[內容指南](/zh-cn/docs/contribute/style/content-guide/)和 
  [樣式指南](/zh-cn/docs/contribute/style/style-guide/)以便給出有價值的評論。
- 瞭解 Kubernetes 文檔社區中不同的[角色和職責](/zh-cn/docs/contribute/participate/roles-and-responsibilities/)。

<!-- body -->

<!--
## Before you begin

Before you start a review:

- Read the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) and ensure that you abide by it at all times.
- Be polite, considerate, and helpful.
- Comment on positive aspects of PRs as well as changes.
- Be empathetic and mindful of how your review may be received.
- Assume good intent and ask clarifying questions.
- Experienced contributors, consider pairing with new contributors whose work requires extensive changes.
-->
## 準備工作 {#before-you-begin}

在你開始評審之前：

- 閱讀 [CNCF 行爲準則](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)。
  確保你會始終遵從其中約定。
- 保持有禮貌、體諒他人，懷助人爲樂初心。
- 評論時若給出修改建議，也要兼顧 PR 的積極方面。
- 保持同理心，多考慮他人收到評審意見時的可能反應。
- 假定大家都是好意的，通過問問題澄清意圖。
- 如果你是有經驗的貢獻者，請考慮和新貢獻者一起合作，提高其產出質量。

<!-- 
## Review process

In general, review pull requests for content and style in English. Figure 1 outlines the steps for the review process. The details for each step follow.
-->
## 評審過程  {#review-process}

一般而言，應該使用英語來評審 PR 的內容和樣式。
圖 1 概述了評審流程的各個步驟。
每個步驟的詳細信息如下。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[開始評審]
    direction TB
    S[ ] -.-
    M[添加評論] --> N[評審變更]
    N --> O[新手應該<br>選擇 Comment]
    end
    subgraph third[選擇 PR]
    direction TB
    T[ ] -.-
    J[閱讀描述<br>和評論]--> K[通過 Netlify 預覽構建<br>來預覽變更]
    end
 
  A[查閱待處理的 PR 清單]--> B[通過標籤過濾<br>待處理的 PR]
  B --> third --> fourth
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,J,K,M,N,O grey
class S,T spacewhite
class third,fourth white
{{</ mermaid >}}

<!-- 
Figure 1. Review process steps.
-->
圖 1. 評審流程步驟。

<!--
1. Go to [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
   You see a list of every open pull request against the Kubernetes website and docs.

2. Filter the open PRs using one or all of the following labels:

   - `cncf-cla: yes` (Recommended): PRs submitted by contributors who have not signed the CLA
     cannot be merged. See [Sign the CLA](/docs/contribute/new-content/#sign-the-cla)
     for more information.
         - `language/en` (Recommended): Filters for english language PRs only.
   - `size/<size>`: filters for PRs of a certain size. If you're new, start with smaller PRs.

    Additionally, ensure the PR isn't marked as a work in progress. PRs using the `work in progress` label are not ready for review yet.
-->
1. 前往 [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls)，
   你會看到所有針對 Kubernetes 網站和文檔的待處理 PR。

2. 使用以下標籤（組合）對待處理 PR 進行過濾：

   - `cncf-cla: yes`（建議）：由尚未簽署 CLA 的貢獻者所發起的 PR 不可以合併。
     參考[簽署 CLA](/zh-cn/docs/contribute/new-content/#sign-the-cla) 以瞭解更多信息。
   - `language/en`（建議）：僅查看英語語言的 PR。
   - `size/<尺寸>`：過濾特定尺寸（規模）的 PR。
     如果你剛入門，可以從較小的 PR 開始。

   此外，確保 PR 沒有標記爲尚未完成（Work in Progress）。
   包含 `work in progress` 的 PR 通常還沒準備好被評審。

<!-- 
3.  Once you've selected a PR to review, understand the change by:
   - Reading the PR description to understand the changes made, and read any linked issues
   - Reading any comments by other reviewers
   - Clicking the **Files changed** tab to see the files and lines changed
   - Previewing the changes in the Netlify preview build by scrolling to the PR's build check section at the bottom of the **Conversation** tab.
     Here's a screenshot (this shows GitHub's desktop site; if you're reviewing
     on a tablet or smartphone device, the GitHub web UI is slightly different):
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="GitHub pull request details including link to Netlify preview" >}}
     To open the preview, click on the  **Details** link of the **deploy/netlify** line in the list of checks.
-->
3. 選定 PR 評審之後，可以通過以下方式理解所作的變更：

   - 閱讀 PR 描述以理解所作變更，並且閱讀所有關聯的 Issues。
   - 閱讀其他評審人給出的評論。
   - 點擊 **Files changed** Tab 頁面，查看被改變的文件和代碼行。
   - 滾動到 **Conversation** Tab 頁面下端的 PR 構建檢查節區，
     預覽 Netlify 預覽構建中的變更。
     以下是一個屏幕截圖（這顯示了 GitHub 的桌面版外觀；
     如果你在平板電腦或智能手機設備上進行評審，
     GitHub 的 Web UI 會略有不同）：
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="GitHub PR 詳細信息，包括 Netlify 預覽鏈接" >}}
     要打開預覽，請點擊 **deploy/netlify** 行的 **Details** 鏈接。

<!--
4.  Go to the **Files changed** tab to start your review.

   1. Click on the `+` symbol  beside the line you want to comment on.
   1. Fill in any comments you have about the line and click either **Add single comment**
      (if you have only one comment to make) or **Start a review** (if you have multiple comments to make).
   1. When finished, click **Review changes** at the top of the page. Here, you can add
      a summary of your review (and leave some positive comments for the contributor!).
      Please always use the "Comment"

      - Avoid clicking the "Request changes" button when finishing your review.
        If you want to block a PR from being merged before some further changes are made,
        you can leave a "/hold" comment.
        Mention why you are setting a hold, and optionally specify the conditions under
        which the hold can be removed by you or other reviewers.

      - Avoid clicking the "Approve" button when finishing your review.
        Leaving a "/approve" comment is recommended most of the time.

-->
4. 前往 **Files changed** Tab 頁面，開始你的評審工作。

   1. 點擊你希望評論的行旁邊的 `+` 號。
   1. 填寫你對該行的評論，
      之後選擇 **Add single comment**（如果你只有一條評論）
      或者 **Start a review**（如果你還有其他評論要添加）。
   1. 評論結束時，點擊頁面頂部的 **Review changes**。
      這裏你可以添加你的評論結語（記得留下一些正能量的評論！）、
      根據需要批准 PR、請求作者進一步修改等等。
      新手應該選擇 **Comment**。

      - 避免在完成審查後點擊 "Request changes（請求修改）"按鈕。
        如果在完成進一步修改之前你想阻止某 PR 被合併。你可以在評論中留下一個 “/hold”。
        同時在評論中說明你爲什麼要設置 Hold，並且在必要時指定在什麼條件下可以由你或其他評審人取消 Hold。
      - 避免在完成審查後直接點擊 "Approve（批准）"按鈕。
        在大多數情況下，建議在評論區留下一個"/approve（批准）"的評論。

<!-- 
## Reviewing checklist

When reviewing, use the following as a starting point.
-->
## 評審清單  {#reviewing-checklist}

評審 PR 時可以從下面的條目入手。

<!--
### Language and grammar

- Are there any obvious errors in language or grammar? Is there a better way to phrase something?
  - Focus on the language and grammar of the parts of the page that the author is changing.
     Unless the author is clearly aiming to update the entire page, they have no obligation to
     fix every issue on the page.
  - When a PR updates an existing page, you should focus on reviewing the parts of
    the page that are being updated. That changed content should be reviewed for technical
    and editorial correctness.
    If you find errors on the page that don't directly relate to what the PR author
    is attempting to address, then it should be treated as a separate issue (check
    that there isn't an existing issue about this first).
  - Watch out for pull requests that _move_ content. If an author renames a page
    or combines two pages, we (Kubernetes SIG Docs) usually avoid asking that author to fix every grammar or spelling nit
    that we could spot within that moved content.
- Are there any complicated or archaic words which could be replaced with a simpler word?
- Are there any words, terms or phrases in use which could be replaced with a non-discriminatory alternative?
- Does the word choice and its capitalization follow the [style guide](/docs/contribute/style/style-guide/)?
- Are there long sentences which could be shorter or less complex?
- Are there any long paragraphs which might work better as a list or table?
-->
### 語言和語法 {#language-and-grammar}

- 是否存在明顯的語言或語法錯誤？對某事的描述有更好的方式？
  - 關注作者正在更改的頁面部分的語言和語法。除非作者明確打算更新整個頁面，否則他們沒有義務修復頁面上的所有問題。
  - 當一個 PR 更新現有頁面時，你應專注於評審正在更新的頁面部分。你應評審所更改內容的技術和編輯的正確性。
    如果你發現頁面上的一些錯誤與 PR 作者嘗試解決的問題沒有直接關係，
    則應將其視爲一個單獨的 Issue（首先檢查是否存在與此相關的 Issue）。
  - 要特別注意那些**移動**內容的 PR。如果作者重命名一個頁面或合併兩個頁面，
    我們（Kubernetes SIG Docs）通常應避免要求該作者修復可能在所移動的內容中發現的所有語法或拼寫錯誤。
- 是否存在一些過於複雜晦澀的用詞，本可以用簡單詞彙來代替？
- 是否有些用詞、術語或短語可以用不帶歧視性的表達方式代替？
- 用詞和大小寫方面是否遵從了[樣式指南](/zh-cn/docs/contribute/style/style-guide/)？
- 是否有些句子太長，可以改得更短、更簡單？
- 是否某些段落過長，可以考慮使用列表或者表格來表達？

<!--
### Content

- Does similar content exist elsewhere on the Kubernetes site?
- Does the content excessively link to off-site, individual vendor or non-open source documentation?
-->
### 內容 {#content}

- Kubernetes 網站上是否別處已經存在類似的內容？
- 內容本身是否過度依賴於網站範疇之外、獨立供應商或者非開源的文檔？

<!--
### Documentation

Some checks to consider:

- Did this PR change or remove a page title, slug/alias or anchor link? If so, are there broken
  links as a result of this PR? Is there another option, like changing the page title without
  changing the slug?

- Does the PR introduce a new page? If so:

  - Is the page using the right [page content type](/docs/contribute/style/page-content-types/)
    and associated Hugo shortcodes?
  - Does the page appear correctly in the section's side navigation (or at all)?
  - Should the page appear on the [Docs Home](/docs/home/) listing?

- Do the changes show up in the Netlify preview? Be particularly vigilant about lists, code
  blocks, tables, notes and images.
-->
### 文檔   {#documentation}

考慮做一些檢查：

- PR 是否改變或者刪除了某頁面的標題、slug/別名或者鏈接錨點？
  如果是這樣，PR 是否會導致出現新的失效鏈接？
  是否有其他的辦法，比如改變頁面標題但不改變其 slug？

- PR 是否引入新的頁面？如果是：

  - 該頁面是否使用了正確的[頁面內容類型](/zh-cn/docs/contribute/style/page-content-types/)
    及相關聯的 Hugo 短代碼（shortcodes）？
  - 該頁面能否在對應章節的側面導航中顯示？顯示得正確麼？
  - 該頁面是否應出現在[網站主頁面](/zh-cn/docs/home/)的列表中？

- 變更是否正確出現在 Netlify 預覽中了？
  要對列表、代碼段、表格、註釋和圖像等元素格外留心。

<!--
### Blog

Early feedback on blog posts is welcome via a Google Doc or HackMD. Please request input early from the [#sig-docs-blog Slack channel](https://kubernetes.slack.com/archives/CJDHVD54J).

Before reviewing blog PRs, be familiar with the [blog guidelines](/docs/contribute/blog/guidelines/)
  and with [submitting blog posts and case studies](/docs/contribute/new-content/blogs-case-studies/).
-->
### 博客   {#blog}

歡迎通過 Google Doc 或 HackMD 對博文提供早期反饋。請儘早通過
[#sig-docs-blog Slack 頻道](https://kubernetes.slack.com/archives/CJDHVD54J)請求輸入。

在審查博客的拉取請求（PR）之前，請熟悉[博客指南](/zh-cn/docs/contribute/blog/guidelines/)
和[提交博文和案例分析](/zh-cn/docs/contribute/new-content/blogs-case-studies/)。

<!--
Make sure you also know about [evergreen](/docs/contribute/blog/#maintenance-evergreen) articles
and how to decide if an article is evergreen.

Blog articles may contain [direct quotes](https://en.wikipedia.org/wiki/Direct_discourse) and
[indirect speech](https://en.wikipedia.org/wiki/Indirect_speech). Avoid suggesting a rewording for
anything that is attributed to someone or part of a dialog that has happened - even if you think
the original speaker's grammar was not correct. For those cases, also, try to respect the article
author's suggested punctuation unless it is obviously wrong.
-->
確保你瞭解[長期維護（Evergreen）](/zh-cn/docs/contribute/blog/#maintenance-evergreen)文章，
並知道如何判斷一篇文章是否應標記爲長期維護。

博文可能包含[直接引語](https://en.wikipedia.org/wiki/Direct_discourse)和[間接引語](https://en.wikipedia.org/wiki/Indirect_speech)。
避免對任何歸因於個人或已發生的部分對話提出修改建議，即使你認爲原話的語法不正確，也不應該如此操作。
在這些情況下，也應儘量尊重文章作者的標點符號建議，除非是明顯錯誤。  

<!--
As a project, we only mark blog articles as maintained (`evergreen: true` in front matter) if the Kubernetes project
is happy to commit to maintaining them indefinitely.
Some blog articles absolutely merit this, and we always mark our release announcements evergreen. Check with other contributors if you are not sure how to review on this point.
-->
作爲一個項目，我們只有在 Kubernetes 社區願意長期維護某篇博文時，纔會將其標記爲長期維護
（即在 front matter 中設置 `evergreen: true`）。
有些博文絕對值得這樣做，我們始終將發佈公告標記爲長期維護。
如果你不確定如何評審這部分內容，請諮詢其他貢獻者。

<!--
The [content guide](/docs/contribute/style/content-guide/) applies unconditionally to blog articles and the PRs that add them. Bear in mind that some restrictions in the guide state that they are only relevant to documentation; those restrictions don't apply to blog articles.

Check if the Markdown source is using the right [page content type](/docs/contribute/style/page-content-types/) and / or `layout`.
-->
[內容指南](/zh-cn/docs/contribute/style/content-guide/)無條件適用於博文及相關 PR。
請注意，該指南中的某些限制僅適用於文檔，而不適用於博文。  

檢查 Markdown 源文件是否使用了正確的[頁面內容類型](/zh-cn/docs/contribute/style/page-content-types/)和/或 `layout`。

<!--
### Other

Watch out for [trivial edits](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits);
  if you see a change that you think is a trivial edit, please point out that policy
(it's still OK to accept the change if it is genuinely an improvement).

Encourage authors who are making whitespace fixes to do
so in the first commit of their PR, and then add other changes on top of that. This
makes both merges and reviews easier. Watch out especially for a trivial change that
happens in a single commit along with a large amount of whitespace cleanup
(and if you see that, encourage the author to fix it).
-->
### 其他 {#other}

查閱 [Trivial Edits](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)；
如果你看到某個變更在你看來是一個 Trivial Edit，請向作者指明這項政策（如果該變更確實會有所改進，那仍然可以接受）。

鼓勵作者們在第一次發 PR 時修復一些空格相關的問題，在隨後的 PR 中增加其他更改。
這樣更便於合併和評審。尤其要注意在單個 commit 中大量空格清理附帶的微小變更（如果你看到，請鼓勵作者進行修復）。

<!--
As a reviewer, if you identify small issues with a PR that aren't essential to the meaning,
such as typos or incorrect whitespace, prefix your comments with `nit:`.
This lets the author know that this part of your feedback is non-critical.

If you are considering a pull request for approval and all the remaining feedback is
marked as a nit, you can merge the PR anyway. In that case, it's often useful to open
an issue about the remaining nits. Consider whether you're able to meet the requirements
for marking that new issue as a [Good First Issue](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue); if you can, these are a good source.
-->
作爲一名 Reviewer，如果你發現 PR 有一些無關緊要的小問題，例如拼寫錯誤或不正確的空格，
可以在你的評論前面加上 `nit:`。這樣做可以讓作者知道該問題不是一個不得了的大問題。

如果你正在考慮批准一個 PR，並且所有剩餘的反饋都被標記爲 nit，那麼你確實可以合併該 PR。
在這種情況下，你需要針對剩餘的 nit 發帖登記一個 Issue。
考慮一下是否能把這些新 Issue 標記爲
[Good First Issue](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue)。
如果可以，這就是這類 Issue 的良好來源。
