---
layout: blog
title: "SIG Architecture 特別報道：代碼組織"
slug: sig-architecture-code-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/04/11/sig-architecture-code-spotlight-2024
date: 2024-04-11
---

<!--
layout: blog
title: "Spotlight on SIG Architecture: Code Organization"
slug: sig-architecture-code-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/04/11/sig-architecture-code-spotlight-2024
date: 2024-04-11
author: >
  Frederico Muñoz (SAS Institute)
-->

**作者:** Frederico Muñoz (SAS Institute)

**譯者:** Xin Li (DaoCloud)

<!--
_This is the third interview of a SIG Architecture Spotlight series that will cover the different
subprojects. We will cover [SIG Architecture: Code Organization](https://github.com/kubernetes/community/blob/e44c2c9d0d3023e7111d8b01ac93d54c8624ee91/sig-architecture/README.md#code-organization)._

In this SIG Architecture spotlight I talked with [Madhav Jivrajani](https://github.com/MadhavJivrajani)
(VMware), a member of the Code Organization subproject.
-->
**這是 SIG Architecture Spotlight 系列的第三次採訪，該系列將涵蓋不同的子項目。
我們將介紹 [SIG Architecture：代碼組織](https://github.com/kubernetes/community/blob/e44c2c9d0d3023e7111d8b01ac93d54c8624ee91/sig-architecture/README.md#code-organization)。**

在本次 SIG Architecture 聚焦中，我與代碼組織子項目的成員
[Madhav Jivrajani](https://github.com/MadhavJivrajani)（VMware）進行了交談。

<!--
## Introducing the Code Organization subproject

**Frederico (FSM)**: Hello Madhav, thank you for your availability. Could you start by telling us a
bit about yourself, your role and how you got involved in Kubernetes?
-->
## 介紹代碼組織子項目

**Frederico (FSM)**：你好，Madhav，感謝你百忙之中接受我們的採訪。你能否首先向我們介紹一下你自己、你的角色以及你是如何參與 Kubernetes 的？

<!--
**Madhav Jivrajani (MJ)**: Hello! My name is Madhav Jivrajani, I serve as a technical lead for SIG
Contributor Experience and a GitHub Admin for the Kubernetes project. Apart from that I also
contribute to SIG API Machinery and SIG Etcd, but more recently, I’ve been helping out with the work
that is needed to help Kubernetes [stay on supported versions of
Go](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions),
and it is through this that I am involved with the Code Organization subproject of SIG Architecture.
-->
**Madhav Jivrajani (MJ)**：你好！我叫 Madhav Jivrajani，擔任 SIG 貢獻者體驗的技術主管和 Kubernetes 項目的 GitHub 管理員。
除此之外，我還爲 SIG API Machinery 和 SIG Etcd 做出貢獻，但最近，我一直在幫助完成 Kubernetes
[保留受支持的 Go 版本](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions) 所需的工作，
正是通過這一點，參與到了 SIG Architecture 的代碼組織子項目中。

<!--
**FSM**: A project the size of Kubernetes must have unique challenges in terms of code organization
-- is this a fair assumption?  If so, what would you pick as some of the main challenges that are
specific to Kubernetes?
-->
**FSM**：像 Kubernetes 這樣規模的項目在代碼組織方面肯定會遇到獨特的挑戰 -- 這是一個合理的假設嗎？
如果是這樣，你認爲 Kubernetes 特有的一些主要挑戰是什麼？

<!--
**MJ**: That’s a fair assumption! The first interesting challenge comes from the sheer size of the
Kubernetes codebase. We have ≅2.2 million lines of Go code (which is steadily decreasing thanks to
[dims](https://github.com/dims) and other folks in this sub-project!), and a little over 240
dependencies that we rely on either directly or indirectly, which is why having a sub-project
dedicated to helping out with dependency management is crucial: we need to know what dependencies
we’re pulling in, what versions these dependencies are at, and tooling to help make sure we are
managing these dependencies across different parts of the codebase in a consistent manner.
-->
**MJ**：這是一個合理的假設！第一個有趣的挑戰來自 Kubernetes 代碼庫的龐大規模。
我們有大約 220 萬行 Go 代碼（由於 [dims](https://github.com/dims) 和這個子項目中的其他人的努力，該代碼正在穩步減少！），
而且我們的依賴項（無論是直接還是間接）超過 240 個，這就是爲什麼擁有一個致力於幫助進行依賴項管理的子項目至關重要：
我們需要知道我們正在引入哪些依賴項，這些依賴項處於什麼版本，
以及幫助確保我們能夠以一致的方式管理代碼庫不同部分的依賴關係的工具。
以一致的方式管理代碼庫不同部分的這些依賴關係。

<!--
Another interesting challenge with Kubernetes is that we publish a lot of Go modules as part of the
Kubernetes release cycles, one example of this is
[`client-go`](https://github.com/kubernetes/client-go).However, we as a project would also like the
benefits of having everything in one repository to get the advantages of using a monorepo, like
atomic commits... so, because of this, code organization works with other SIGs (like SIG Release) to
automate the process of publishing code from the monorepo to downstream individual repositories
which are much easier to consume, and this way you won’t have to import the entire Kubernetes
codebase!
-->
Kubernetes 的另一個有趣的挑戰是，我們在 Kubernetes 發佈週期中發佈了許多 Go 模塊，其中一個例子是
[`client-go`](https://github.com/kubernetes/client-go)。
然而，作爲一個項目，我們也希望將所有內容都放在一個倉庫中，便獲得使用單一倉庫的優勢，例如原子性的提交……
因此，代碼組織與其他 SIG（例如 SIG Release）合作，以實現將代碼從單一倉庫發佈到下游倉庫的自動化過程，
下游倉庫更容易使用，因爲你就不必導入整個 Kubernetes 代碼庫！

<!--
## Code organization and Kubernetes

**FSM**: For someone just starting contributing to Kubernetes code-wise, what are the main things
they should consider in terms of code organization? How would you sum up the key concepts?

**MJ**: I think one of the key things to keep in mind at least as you’re starting off is the concept
of staging directories. In the [`kubernetes/kubernetes`](https://github.com/kubernetes/kubernetes)
repository, you will come across a directory called
[`staging/`](https://github.com/kubernetes/kubernetes/tree/master/staging). The sub-folders in this
directory serve as a bunch of pseudo-repositories. For example, the
[`kubernetes/client-go`](https://github.com/kubernetes/client-go) repository that publishes releases
for `client-go` is actually a [staging
repo](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/client-go).
-->
## 代碼組織和 Kubernetes

**FSM**：對於剛剛開始爲 Kubernetes 代碼做出貢獻的人來說，在代碼組織方面他們應該考慮的主要事項是什麼？
你認爲有哪些關鍵概念？

**MJ**：我認爲至少在開始時要記住的關鍵事情之一是 staging 目錄的概念。
在 [`kubernetes/kubernetes`](https://github.com/kubernetes/kubernetes) 中，你會遇到一個名爲
[`staging/`](https://github.com/kubernetes/kubernetes/tree/master/staging) 的目錄。
該目錄中的子檔案夾充當一堆僞倉庫。
例如，發佈 `client-go` 版本的 [`kubernetes/client-go`](https://github.com/kubernetes/client-go)
倉庫實際上是一個 [staging 倉庫](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/client-go)。

<!--
**FSM**: So the concept of staging directories fundamentally impact contributions?

**MJ**: Precisely, because if you’d like to contribute to any of the staging repos, you will need to
send in a PR to its corresponding staging directory in `kubernetes/kubernetes`. Once the code merges
there, we have a bot called the [`publishing-bot`](https://github.com/kubernetes/publishing-bot)
that will sync the merged commits to the required staging repositories (like
`kubernetes/client-go`). This way we get the benefits of a monorepo but we also can modularly
publish code for downstream consumption. PS: The `publishing-bot` needs more folks to help out!

For more information on staging repositories, please see the [contributor
documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/staging.md).
-->

**FSM**：那麼 staging 目錄的概念會從根本上影響貢獻？

**MJ**：準確地說，因爲如果你想爲任何 staging 倉庫做出貢獻，你需要將 PR 發送到 `kubernetes/kubernetes` 中相應的 staging 目錄。
一旦代碼合併到那裏，我們就會讓一個名爲 [`publishing-bot`](https://github.com/kubernetes/publishing-bot)
的機器人將合併的提交同步到必要的 staging 倉庫（例如 `kubernetes/client-go`）中。
通過這種方式，我們可以獲得單一倉庫的好處，但我們也可以以模塊化的形式發佈代碼以供下游使用。
PS：`publishing-bot` 需要更多人的幫助！

<!--
**FSM**: Speaking of contributions, the very high number of contributors, both individuals and
companies, must also be a challenge: how does the subproject operate in terms of making sure that
standards are being followed?
-->
**FSM**：說到貢獻，貢獻者數量非常多，包括個人和公司，也一定是一個挑戰：這個子項目是如何運作的以確保大家都遵循標準呢？

<!--
**MJ**: When it comes to dependency management in the project, there is a [dedicated
team](https://github.com/kubernetes/org/blob/a106af09b8c345c301d072bfb7106b309c0ad8e9/config/kubernetes/org.yaml#L1329)
that helps review and approve dependency changes. These are folks who have helped lay the foundation
of much of the
[tooling](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/vendor.md)
that Kubernetes uses today for dependency management. This tooling helps ensure there is a
consistent way that contributors can make changes to dependencies. The project has also worked on
additional tooling to signal statistics of dependencies that is being added or removed:
[`depstat`](https://github.com/kubernetes-sigs/depstat)
-->
**MJ**：當涉及到項目中的依賴關係管理時，
有一個[專門團隊](https://github.com/kubernetes/org/blob/a106af09b8c345c301d072bfb7106b309c0ad8e9/config/kubernetes/org.yaml#L1329)幫助審查和批准依賴關係更改。
這些人爲目前 Kubernetes 用於管理依賴的許多[工具](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/vendor.md)做了開拓性的工作。
這些工具幫助我們確保貢獻者可以以一致的方式更改依賴項。
這個子項目還開發了其他工具來基於被添加或刪除的依賴項的統計資訊發出通知：
[`depstat`](https://github.com/kubernetes-sigs/depstat)

<!--
Apart from dependency management, another crucial task that the project does is management of the
staging repositories. The tooling for achieving this (`publishing-bot`) is completely transparent to
contributors and helps ensure that the staging repos get a consistent view of contributions that are
submitted to `kubernetes/kubernetes`.

Code Organization also works towards making sure that Kubernetes [stays on supported versions of
Go](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions). The
linked KEP provides more context on why we need to do this. We collaborate with SIG Release to
ensure that we are testing Kubernetes as rigorously and as early as we can on Go releases and
working on changes that break our CI as a part of this. An example of how we track this process can
be found [here](https://github.com/kubernetes/release/issues/3076).
-->
除了依賴管理之外，這個項目執行的另一項重要任務是管理 staging 倉庫。
用於實現此目的的工具（`publishing-bot`）對貢獻者完全透明，
有助於確保就提交給 `kubernetes/kubernetes` 的貢獻而言，各個 staging 倉庫獲得的視圖是一致的。

代碼組織還致力於確保 Kubernetes
[一直在使用受支持的 Go 版本](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions)。
鏈接所指向的 KEP 中包含更詳細的背景資訊，用來說明爲什麼我們需要這樣做。
我們與 SIG Release 合作，確保我們在 Go 版本上儘可能嚴格、儘早地測試 Kubernetes；
作爲這些工作的一部分，我們要處理會破壞我們的 CI 的那些變更。
我們如何跟蹤此過程的示例可以在[此處](https://github.com/kubernetes/release/issues/3076)找到。

<!--
## Release cycle and current priorities

**FSM**: Is there anything that changes during the release cycle?

**MJ** During the release cycle, specifically before code freeze, there are often changes that go in
that add/update/delete dependencies, fix code that needs fixing as part of our effort to stay on
supported versions of Go.

Furthermore, some of these changes are also candidates for
[backporting](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md)
to our supported release branches.
-->
## 發佈週期和當前優先級

**FSM**：在發佈週期中有什麼變化嗎？

**MJ**：在發佈週期內，特別是在代碼凍結之前，通常會發生添加、更新、刪除依賴項的變更，以及修復需要修復的代碼等更改，
這些都是我們繼續使用受支持的 Go 版本的努力的一部分。

此外，其中一些更改也可以[向後移植](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md)
到我們支持的發佈分支。

<!--
**FSM**: Is there any major project or theme the subproject is working on right now that you would
like to highlight?

**MJ**: I think one very interesting and immensely useful change that
has been recently added (and I take the opportunity to specifically
highlight the work of [Tim Hockin](https://github.com/thockin) on
this) is the introduction of [Go workspaces to the Kubernetes
repo](https://www.kubernetes.dev/blog/2024/03/19/go-workspaces-in-kubernetes/). A lot of our
current tooling for dependency management and code publishing, as well
as the experience of editing code in the Kubernetes repo, can be
significantly improved by this change.
-->
**FSM**：就子項目中目前正在進行的主要項目或主題而言你有什麼要特別強調的嗎？

**MJ**：我認爲最近添加的一個非常有趣且非常有用的變更（我借這個機會特別強調
[Tim Hockin](https://github.com/thockin) 在這方面的工作）是引入
[Go 工作空間的概念到Kubernetes 倉庫中](https://www.kubernetes.dev/blog/2024/03/19/go-workspaces-in-kubernetes/)。
我們當前的許多依賴管理和代碼發佈工具，以及在 Kubernetes 倉庫中編輯代碼的體驗，
都可以通過此更改得到顯着改善。

<!--
## Wrapping up

**FSM**: How would someone interested in the topic start helping the subproject?

**MJ**: The first step, as is the first step with any project in Kubernetes, is to join our slack:
[slack.k8s.io](https://slack.k8s.io), and after that join the `#k8s-code-organization` channel. There is also a
[code-organization office
hours](https://github.com/kubernetes/community/tree/master/sig-architecture#meetings) that takes
place that you can choose to attend. Timezones are hard, so feel free to also look at the recordings
or meeting notes and follow up on slack!
-->
## 收尾

**FSM**：對這個主題感興趣的人要怎樣開始幫助這個子項目？

**MJ**：與 Kubernetes 中任何項目的第一步一樣，第一步是加入我們的
Slack：[slack.k8s.io](https://slack.k8s.io)，然後加入 `#k8s-code-organization` 頻道，
你還可以選擇參加[代碼組織辦公時間](https://github.com/kubernetes/community/tree/master/sig-architecture#meetings)。
時區是個困難點，所以請隨時查看錄音或會議記錄並跟進 Slack！

<!--
**FSM**: Excellent, thank you! Any final comments you would like to share?

**MJ**: The Code Organization subproject always needs help! Especially areas like the publishing
bot, so don’t hesitate to get involved in the `#k8s-code-organization` Slack channel.
-->
**FSM**：非常好，謝謝！最後你還有什麼想分享的嗎？

**MJ**：代碼組織子項目總是需要幫助！特別是像發佈機器人這樣的領域，所以請不要猶豫，參與到 `#k8s-code-organization` Slack 頻道中。
