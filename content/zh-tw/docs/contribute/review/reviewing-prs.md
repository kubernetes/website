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
- Understand the different [roles and responsibilities](/docs/contribute/participating/#roles-and-responsibilities) in the Kubernetes documentation community.
-->
任何人均可評審文件的拉取請求。
訪問 Kubernetes 網站倉庫的 [pull requests](https://github.com/kubernetes/website/pulls) 部分，
可以檢視所有待處理的拉取請求（PR）。

評審文件 PR 是將你自己介紹給 Kubernetes 社群的一種很好的方式。
它將有助於你學習程式碼庫並與其他貢獻者之間建立相互信任關係。

在評審之前，可以考慮：

- 閱讀[內容指南](/zh-cn/docs/contribute/style/content-guide/)和 
  [樣式指南](/zh-cn/docs/contribute/style/style-guide/)以便給出有價值的評論。
- 瞭解 Kubernetes 文件社群中不同的[角色和職責](/zh-cn/docs/contribute/participate/roles-and-responsibilities/)。

<!-- body -->
<!--
## Before you begin

Before you start a review:

- Read the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) and ensure that you abide by it at all times.
- Be polite, considerate, and helpful.
- Comment on positive aspects of PRs as well as changes.
- Be empathetic and mindful of how your review may be received.
- Assume good intent and ask clarifying questions.
- Experienced contributors, consider pairing with new contributors whose work requires extensive changes.
-->
## 準備工作 {#before-you-begin}

在你開始評審之前：

- 閱讀 [CNCF 行為準則](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)。
  確保你會始終遵從其中約定。
- 保持有禮貌、體諒他人，懷助人為樂初心。
- 評論時若給出修改建議，也要兼顧 PR 的積極方面。
- 保持同理心，多考慮他人收到評審意見時的可能反應。
- 假定大家都是好意的，透過問問題澄清意圖。
- 如果你是有經驗的貢獻者，請考慮和新貢獻者一起合作，提高其產出質量。

<!-- 
## Review process

In general, review pull requests for content and style in English. Figure 1 outlines the steps for the review process. The details for each step follow.
-->
## 評審過程  {#review-process}

一般而言，應該使用英語來評審 PR 的內容和樣式。
圖 1 概述了評審流程的各個步驟。
每個步驟的詳細資訊如下。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[開始評審]
    direction TB
    S[ ] -.-
    M[新增評論] --> N[評審變更]
    N --> O[新手應該<br>選擇 Comment]
    end
    subgraph third[選擇 PR]
    direction TB
    T[ ] -.-
    J[閱讀描述<br>和評論]--> K[透過 Netlify 預覽構建<br>來預覽變更]
    end
 
  A[查閱待處理的 PR 清單]--> B[透過標籤過濾<br>待處理的 PR]
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
1.  Go to
    [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
    You see a list of every open pull request against the Kubernetes website and
    docs.

2.  Filter the open PRs using one or all of the following labels:
    - `cncf-cla: yes` (Recommended): PRs submitted by contributors who have not signed the CLA cannot be merged. See [Sign the CLA](/docs/contribute/new-content/overview/#sign-the-cla) for more information.
    - `language/en` (Recommended): Filters for english language PRs only.
    - `size/<size>`: filters for PRs of a certain size. If you're new, start with smaller PRs.

    Additionally, ensure the PR isn't marked as a work in progress. PRs using the `work in progress` label are not ready for review yet.
-->
1. 前往 [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls)，
   你會看到所有針對 Kubernetes 網站和文件的待處理 PR。

2. 使用以下標籤（組合）對待處理 PR 進行過濾：

    - `cncf-cla: yes` （建議）：由尚未簽署 CLA 的貢獻者所發起的 PR 不可以合併。
      參考[簽署 CLA](/zh-cn/docs/contribute/new-content/overview/#sign-the-cla) 以瞭解更多資訊。
    - `language/en` （建議）：僅檢視英語語言的 PR。
    - `size/<尺寸>`：過濾特定尺寸（規模）的 PR。
      如果你剛入門，可以從較小的 PR 開始。

    此外，確保 PR 沒有標記為尚未完成（Work in Progress）。
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
3. 選定 PR 評審之後，可以透過以下方式理解所作的變更：

   - 閱讀 PR 描述以理解所作變更，並且閱讀所有關聯的 Issues。
   - 閱讀其他評審人給出的評論。
   - 點選 **Files changed** Tab 頁面，檢視被改變的檔案和程式碼行。
   - 滾動到 **Conversation** Tab 頁面下端的 PR 構建檢查節區，
     預覽 Netlify 預覽構建中的變更。
     以下是一個螢幕截圖（這顯示了 GitHub 的桌面版外觀；
     如果你在平板電腦或智慧手機裝置上進行評審，
     GitHub 的 Web UI 會略有不同）：
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="GitHub PR 詳細資訊，包括 Netlify 預覽連結" >}}
    要開啟預覽，請點選 **deploy/netlify** 行的 **Details** 連結。

<!--
4.  Go to the **Files changed** tab to start your review.
    1. Click on the `+` symbol  beside the line you want to comment on.
    2. Fill in any comments you have about the line and click either **Add single comment** (if you have only one comment to make) or  **Start a review** (if you have multiple comments to make).
    3. When finished, click **Review changes** at the top of the page. Here, you can add
      a summary of your review (and leave some positive comments for the contributor!),
      approve the PR, comment or request changes as needed. New contributors should always
      choose **Comment**.
-->
4. 前往 **Files changed** Tab 頁面，開始你的評審工作。

   1. 點選你希望評論的行旁邊的 `+` 號。
   2. 填寫你對該行的評論，
      之後選擇 **Add single comment**（如果你只有一條評論）
      或者 **Start a review**（如果你還有其他評論要新增）。
   3. 評論結束時，點選頁面頂部的 **Review changes**。
      這裡你可以新增你的評論結語（記得留下一些正能量的評論！）、
      根據需要批准 PR、請求作者進一步修改等等。
      新手應該選擇 **Comment**。

<!-- 
## Reviewing checklist

When reviewing, use the following as a starting point.
-->
## 評審清單  {#reviewing-checklist}

評審 PR 時可以從下面的條目入手。

<!--
### Language and grammar

- Are there any obvious errors in language or grammar? Is there a better way to phrase something?
- Are there any complicated or archaic words which could be replaced with a simpler word?
- Are there any words, terms or phrases in use which could be replaced with a non-discriminatory alternative?
- Does the word choice and its capitalization follow the [style guide](/docs/contribute/style/style-guide/)?
- Are there long sentences which could be shorter or less complex?
- Are there any long paragraphs which might work better as a list or table?
-->
### 語言和語法 {#language-and-grammar}

- 是否存在明顯的語言或語法錯誤？對某事的描述有更好的方式？
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
- 內容本身是否過度依賴於網站範疇之外、獨立供應商或者非開源的文件？

<!--
### Website

- Did this PR change or remove a page title, slug/alias or anchor link? If so, are there broken links as a result of this PR? Is there another option, like changing the page title without changing the slug?
- Does the PR introduce a new page? If so:
  - Is the page using the right [page content type](/docs/contribute/style/page-content-types/) and associated Hugo shortcodes?
  - Does the page appear correctly in the section's side navigation (or at all)?
  - Should the page appear on the [Docs Home](/docs/home/) listing?
- Do the changes show up in the Netlify preview? Be particularly vigilant about lists, code blocks, tables, notes and images.
-->
### 網站 {#Website}

- PR 是否改變或者刪除了某頁面的標題、slug/別名或者連結錨點？
  如果是這樣，PR 是否會導致出現新的失效連結？
  是否有其他的辦法，比如改變頁面標題但不改變其 slug？
- PR 是否引入新的頁面？如果是：
  - 該頁面是否使用了正確的[頁面內容型別](/zh-cn/docs/contribute/style/page-content-types/)
    及相關聯的 Hugo 短程式碼（shortcodes）？
  - 該頁面能否在對應章節的側面導航中顯示？顯示得正確麼？
  - 該頁面是否應出現在[網站主頁面](/zh-cn/docs/home/)的列表中？
- 變更是否正確出現在 Netlify 預覽中了？
  要對列表、程式碼段、表格、註釋和影象等元素格外留心。

<!--
### Other

For small issues with a PR, like typos or whitespace, prefix your comments with `nit:`.  This lets the author know the issue is non-critical.
-->
### 其他 {#other}

對於 PR 中的小問題，例如拼寫錯誤或者空格問題，
可以在你的評論前面加上 `nit:`。
這樣做可以讓作者知道該問題不是一個不得了的大問題。
