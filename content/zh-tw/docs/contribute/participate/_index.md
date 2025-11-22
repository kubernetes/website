---
title: 參與 SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---
<!--
title: Participating in SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
-->

<!-- overview -->

<!--
SIG Docs is one of the
[special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md)
within the Kubernetes project, focused on writing, updating, and maintaining
the documentation for Kubernetes as a whole. See
[SIG Docs from the community github repo](https://github.com/kubernetes/community/tree/master/sig-docs)
for more information about the SIG.
-->
SIG Docs 是 Kubernetes 項目
[特別興趣小組](https://github.com/kubernetes/community/blob/master/sig-list.md)
中的一個，負責編寫、更新和維護 Kubernetes 的總體文檔。
參見[社區 GitHub 倉庫中 SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs)
以進一步瞭解該 SIG。

<!--
SIG Docs welcomes content and reviews from all contributors. Anyone can open a
pull request (PR), and anyone is welcome to file issues about content or comment
on pull requests in progress.
-->
SIG Docs 歡迎所有貢獻者提供內容和審閱。任何人可以提交拉取請求（PR）。
歡迎所有人對文檔內容創建 Issue 和對正在處理中的 PR 進行評論。

<!--
You can also become a [member](/docs/contribute/participate/roles-and-responsibilities/#members),
[reviewer](/docs/contribute/participate/roles-and-responsibilities/#reviewers), or [approver](/docs/contribute/participate/roles-and-responsibilities/#approvers). These roles require greater
access and entail certain responsibilities for approving and committing changes.
See [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md)
for more information on how membership works within the Kubernetes community.

The rest of this document outlines some unique ways these roles function within
SIG Docs, which is responsible for maintaining one of the most public-facing
aspects of Kubernetes - the Kubernetes website and documentation.
-->
你也可以成爲[成員（member）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#members)、
[評閱人（reviewer）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#reviewers) 或者
[批准人（approver）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#approvers)。
這些角色擁有更高的權限，且需要承擔批准和提交變更的責任。
有關 Kubernetes 社區中的成員如何工作的更多資訊，請參見
[社區成員身份](https://github.com/kubernetes/community/blob/master/community-membership.md)。

本文檔的其餘部分概述了這些角色在 SIG Docs 中發揮作用的一些獨特方式。
SIG Docs 負責維護 Kubernetes 最面向公衆的方面之一 —— Kubernetes 網站和文檔。

<!-- body -->

<!--
#### SIG Docs chairperson

Each SIG, including SIG Docs, selects one or more SIG members to act as
chairpersons. These are points of contact between SIG Docs and other parts of
the Kubernetes organization. They require extensive knowledge of the structure
of the Kubernetes project as a whole and how SIG Docs works within it. See
[Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
for the current list of chairpersons.
-->
## SIG Docs 主席   {#sig-docs-chairperson}

每個 SIG，包括 SIG Docs，都會選出一位或多位成員作爲主席。
主席會成爲 SIG Docs 和其他 Kubernetes 組織的聯絡介面人。
他們需要了解整個 Kubernetes 項目的架構，並明白 SIG Docs 如何在其中運作。
如需查詢當前的主席名單，請查閱
[領導人員](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)。

<!--
## SIG Docs teams and automation

Automation in SIG Docs relies on two different mechanisms:
GitHub teams and OWNERS files.
-->
## SIG Docs 團隊和自動化 {#sig-docs-teams-and-automation}

SIG 文檔中的自動化服務依賴於兩種不同的機制:
GitHub 團隊和 OWNERS 檔案。

<!--
### GitHub teams

There are two categories of SIG Docs [teams](https://github.com/orgs/kubernetes/teams?query=sig-docs) on GitHub:

- `@sig-docs-{language}-owners` are approvers and leads
- `@sig-docs-{language}-reviews` are reviewers

Each can be referenced with their `@name` in GitHub comments to communicate with
everyone in that group.

Sometimes Prow and GitHub teams overlap without matching exactly. For assignment of issues, pull requests, and to support PR approvals,
the automation uses information from `OWNERS` files.
-->
### GitHub 團隊 {#github-teams}

GitHub 上有兩類 SIG Docs 團隊：

- `@sig-docs-{language}-owners` 包含批准人和牽頭人
- `@sig-docs-{language}-reviews` 包含評閱人

可以在 GitHub 的評論中使用團隊的名稱 `@name` 來與團隊成員溝通。

有時候 Prow 所定義的團隊和 GitHub 團隊有所重疊，並不完全一致。
對於指派 Issue、PR 和批准 PR，自動化工具使用來自 `OWNERS` 檔案的資訊。

<!--
### OWNERS files and front-matter

The Kubernetes project uses an automation tool called prow for automation
related to GitHub issues and pull requests. The
[Kubernetes website repository](https://github.com/kubernetes/website) uses
two [prow plugins](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):
-->
### OWNERS 檔案和扉頁   {#owners-files-and-front-matter}

Kubernetes 項目使用名爲 prow 的自動化工具來自動處理 GitHub issue 和 PR。
[Kubernetes website 倉庫](https://github.com/kubernetes/website) 使用了兩個
[prow 插件](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins)：

- blunderbuss
- approve

<!--
These two plugins use the
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) and
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
files in the top level of the `kubernetes/website` GitHub repository to control
how prow works within the repository.
-->
這兩個插件使用位於 `kubernetes/website` 倉庫頂層的
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) 檔案和
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
檔案來控制 prow 在倉庫範圍的工作方式。

<!--
An OWNERS file contains a list of people who are SIG Docs reviewers and
approvers. OWNERS files can also exist in subdirectories, and can override who
can act as a reviewer or approver of files in that subdirectory and its
descendants. For more information about OWNERS files in general, see
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).
-->
OWNERS 檔案包含 SIG Docs 評閱人和批准人的列表。
OWNERS 檔案也可以存在於子目錄中，可以在子目錄層級重新設置哪些人可以作爲評閱人和
批准人，並將這一設定傳遞到下層子目錄。
關於 OWNERS 的更多資訊，請參考
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md)
文檔。

<!--
In addition, an individual Markdown file can list reviewers and approvers in its
front-matter, either by listing individual GitHub usernames or GitHub groups.

The combination of OWNERS files and front-matter in Markdown files determines
the advice PR owners get from automated systems about who to ask for technical
and editorial review of their PR.
-->
此外，每個獨立的 Markdown 檔案都可以在其前言部分列出評閱人和批准人，
每一項可以是 GitHub 使用者名，也可以是 GitHub 組名。

結合 OWNERS 檔案及 Markdown 檔案的前言資訊，自動化系統可以給 PR 作者可以就應該
向誰請求技術和文字評閱給出建議。

<!--
## How merging works

When a pull request is merged to the branch used to publish content, that content
is published to https://kubernetes.io. To ensure that
the quality of our published content is high, we limit merging pull requests to
SIG Docs approvers. Here's how it works.

- When a pull request has both the `lgtm` and `approve` labels, has no `hold`
  labels, and all tests are passing, the pull request merges automatically.
- Kubernetes organization members and SIG Docs approvers can add comments to
  prevent automatic merging of a given pull request (by adding a `/hold` comment
  or withholding a `/lgtm` comment).
- Any Kubernetes member can add the `lgtm` label by adding a `/lgtm` comment.
- Only SIG Docs approvers can merge a pull request
  by adding an `/approve` comment. Some approvers also perform additional
  specific roles, such as [PR Wrangler](/docs/contribute/participate/pr-wranglers/) or
  [SIG Docs chairperson](#sig-docs-chairperson).
-->
## PR 是怎樣被合併的 {#how-merging-works}

當某個拉取請求（PR）被合併到用來發布內容的分支，對應的內容就會被髮布到 https://kubernetes.io。
爲了確保我們所發佈的內容的質量足夠好，合併 PR 的權限僅限於
SIG Docs 批准人。下面是合併的工作機制：

- 當某個 PR 同時具有 `lgtm` 和 `approve` 標籤，沒有 `hold` 標籤且通過所有測試時，
  該 PR 會被自動合併。
- Kubernetes 組織的成員和 SIG Docs 批准人可以添加評論以阻止給定 PR 的自動合併，
  即通過 `/hold` 評論或者收回某個 `/lgtm` 評論實現這點。
- 所有 Kubernetes 成員可以通過 `/lgtm` 評論添加 `lgtm` 標籤。
- 只有 SIG Docs 批准人可以通過評論 `/approve` 合併 PR。
  某些批准人還會執行一些其他角色，例如
  [PR 管理者](/zh-cn/docs/contribute/participate/pr-wranglers/) 或
  [SIG Docs 主席](#sig-docs-chairperson)等。

## {{% heading "whatsnext" %}}

<!--
For more information about contributing to the Kubernetes documentation, see:

- [Contributing new content](/docs/contribute/new-content/)
- [Reviewing content](/docs/contribute/review/reviewing-prs)
- [Documentation style guide](/docs/contribute/style/)
-->
關於貢獻 Kubernetes 文檔的更多資訊，請參考：

- [貢獻新內容](/zh-cn/docs/contribute/new-content/)
- [評閱內容](/zh-cn/docs/contribute/review/reviewing-prs)
- [文檔樣式指南](/zh-cn/docs/contribute/style/)
