---
title: 作爲博客寫作夥伴提供幫助
slug: writing-buddy
content_type: concept
weight: 70
---
<!--
title: Helping as a blog writing buddy
slug: writing-buddy
content_type: concept
weight: 70
-->

<!-- overview -->

<!--
There are two official Kubernetes blogs, and the CNCF has its own blog where you can cover Kubernetes too.
Read [contributing to Kubernetes blogs](/docs/contribute/blog/) to learn about these two blogs.

When people contribute to either blog as an author, the Kubernetes project pairs up authors
as _writing buddies_. This page explains how to fulfil the buddy role.

You should make sure that you have at least read an outline of [article submission](/docs/contribute/blog/submission/)
before you read on within this page.
-->
Kubernetes 有兩個官方博客，同時 CNCF 也有自己的博客，你也可以在其中撰寫與 Kubernetes 相關的內容。  
閱讀[爲 Kubernetes 博客貢獻內容](/zh-cn/docs/contribute/blog/)以瞭解這兩個博客的詳細信息。

當人們作爲作者爲任一博客撰稿時，Kubernetes 項目會將作者配對爲**寫作夥伴**。
本頁面解釋瞭如何履行夥伴角色。

在繼續閱讀本頁面之前，你應該確保至少已經閱讀了[文章提交](/zh-cn/docs/contribute/blog/submission/)的概述。

<!-- body -->

<!--
## Buddy responsibilities

As a writing buddy, you:

* help the blog team get articles ready to merge and to publish
* support your buddy to produce content that is good to merge
* provide a review on the article that your buddy has written
-->
## 夥伴職責

作爲寫作夥伴，你的職責包括：

* 協助博客團隊準備文章，使其達到可合併和發佈的狀態；
* 支持你的夥伴創作高質量的內容，確保其適合合併；
* 對你夥伴撰寫的文章提供審閱意見。

<!--
When the team pairs you up with another author, the idea is that you both support each other by
reviewing the other author's draft article.
Most people reading articles on the Kubernetes blog are not experts; the content should
try to make sense for that audience, or at least to support non-expert readers appropriately.

The blog team are also there to help you both along the journey from draft to publication.
They will either be directly able to approve your article for publication, or can arrange for
the approval to happen.
-->
當團隊將你與另一位作者配對時，理念是你們通過互相審閱對方的草稿文章來彼此支持。
大多數閱讀 Kubernetes 博客文章的讀者並非專家；
內容應當嘗試爲這類讀者羣體提供易於理解的信息，或者至少適當地支持非專家讀者。

博客團隊也會在整個從草稿到發佈的流程中幫助你們。他們可以直接批准你的文章發佈，
或者安排相應的批准流程。

<!--
## Supporting the blog team

Your main responsibility here is to communicate about your capacity, availability and progress
in a reasonable timeline. If many weeks go by and your buddy hasn't heard from you, it makes
the overall work take more time.
-->
## 支持博客團隊

你的主要職責是及時溝通你的工作量、可用時間以及進展情況。如果幾周過去了，
你的夥伴還沒有收到你的消息，這將會導致整體工作花費更多的時間。

<!--
## Supporting your buddy

There are two parts to the process
-->
## 支持你的夥伴

支持夥伴的過程分爲兩個部分：

{{< tabs name="buddy_support" >}}
{{% tab name="協同編輯" %}}
<!--
**(This is the recommended option)**

The blog team recommend that the main author for the article sets up collaborative editing
using either a Google Doc or HackMD (their choice). The main author then shares that document
with the following people:

 * Any co-authors
 * You (their writing buddy)
 * Ideally, with a nominated
person from the blog team.
-->
**（這是推薦的選項）**

博客團隊建議文章的主要作者通過 Google Doc 或 HackMD（由作者選擇）構造協作編輯環境。
之後，主作者將該文檔共享給以下人員：

- 所有共同作者  
- 你（他們的寫作夥伴）  
- 理想情況下，還應包括一位博客團隊中指定的負責人。

<!--
As a writing buddy, you then read the draft text and either directly make suggestions or provide
feedback in a different way. The author of the blog is very commonly also **your** writing buddy in turn, so they will provide the
same kind of feedback on the draft for your blog article.
-->
作爲寫作夥伴，你需要閱讀草稿內容，並直接提出建議或以其他方式提供反饋。
博客文章的作者通常也會反過來成爲**你的**寫作夥伴，
因此他們會針對你所撰寫的文章草稿提供類似的反饋。

<!--
Your role here is to recommend the smallest set of changes that will get the article look good
for publication. If there's a diagram that really doesn't make sense, or the writing is really
unclear: provide feedback. If you have a slight different of opinion about wording or punctuation,
skip it. Let the article author(s) write in their own style, provided that they align to
the [blog guidelines](/docs/contribute/blog/guidelines/).

After this is ready, the lead author will open a pull request and use Markdown to submit the
article. You then provide a [review](#pull-request-review).
-->
你的角色是推薦最小的修改集，以使文章適合發佈。如果某個圖表完全無法理解，
或者文字表達非常不清晰，請提供反饋。如果你對措辭或標點符號有輕微的不同意見，
請忽略它。只要符合[博客指南](/zh-cn/docs/contribute/blog/guidelines/)，
讓文章作者以他們自己的風格寫作即可。

在此完成後，主作者將發起一個 PR 並使用 Markdown 提交文章。
然後你可以提供[審閱](#pull-request-review)意見。

{{% /tab %}}
{{% tab name="Markdown / Git 編輯" %}}
<!--
Some authors prefer to start with
[collaborative editing](#buddy-support-0); others like to go straight into
GitHub.

Whichever route they take, your role is to provide feedback that lets the blog team provide
a simple signoff and confirm that the article can merge as a draft. See
[submitting articles to Kubernetes blogs](/docs/contribute/blog/submission/) for what the authors
need to do.
-->
一些作者更喜歡從[協同編輯](#buddy-support-0)開始，
而另一些人則喜歡直接進入 GitHub。

無論他們選擇哪種方式，你的角色是提供反饋，使博客團隊能夠輕鬆完成審覈，
並確認文章可以作爲草稿合併。有關作者需要完成的操作，
請參閱[向 Kubernetes 博客提交文章](/zh-cn/docs/contribute/blog/submission/)。

<!--
Use GitHub suggestions to point out any required changes.

Once the Markdown and other content (such as images) look right, you provide a
formal [review](#pull-request-review).
-->
使用 GitHub 的建議功能指出需要修改的地方。

一旦 Markdown 文件和其他內容（例如圖片）看起來沒有問題，
你就可以提供正式的[審閱](#pull-request-review)意見。

{{% /tab %}}
{{< /tabs >}}

<!--
## Pull request review

Follow the [blog](/docs/contribute/review/reviewing-prs/#blog) section of _Reviewing pull requests_.

When you think that the open blog pull request is good enough to merge, add the `/lgtm` comment to the pull request.
-->
## 審閱 PR

遵循**審閱 PR **一文的[博客](/zh-cn/docs/contribute/review/reviewing-prs/#blog)部分所給的要求。

當你認爲所發起的博客 PR 足夠好可以合併時，在 PR 中添加 `/lgtm` 評論。

<!--
This indicates to the repository automation tooling (Prow) that the content "looks good to me". Prow moves things forward. The `/lgtm` command lets you add your opinion to the record whether or not you are formally a member of the Kubernetes project.

Either you or the article author(s) should let the blog team know that there is an article
ready for signoff. It should already be marked as `draft: true` in the front matter, as
explained in the submission guidance.
-->
這一註釋向倉庫自動化工具（Prow）內容申明內容“在我看來沒有問題”。
Prow 會推進相關流程。`/lgtm` 命令允許你將自己的意見公開出來，
無論你是否正式成爲 Kubernetes 項目的一員。

你或文章作者應通知博客團隊有文章已準備好進行簽發。根據提交指南，
文章前面應已標記爲 `draft: true`。

<!--
## Subsequent steps

For you as a writing buddy, **there is no step four**. Once the pull request is good to merge,
the blog team (or, for the contributor site, the contributor comms team) take things from there.
It's possible that you'll need to return to an earlier step based on feedback, but you can usually expect that your work as a buddy is done.
-->
## 後續步驟

作爲寫作夥伴，**沒有第四步**。一旦 PR 準備好合併，
博客團隊（或者，對於貢獻者網站，貢獻者通信團隊）將會接手。
根據反饋，你可能需要返回到前面的步驟，但通常你可以認爲作爲夥伴的工作已經完成。
