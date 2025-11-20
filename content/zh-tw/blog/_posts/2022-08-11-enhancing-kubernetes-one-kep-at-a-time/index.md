---
layout: blog
title: "逐個 KEP 地增強 Kubernetes"
date: 2022-08-11
slug: enhancing-kubernetes-one-kep-at-a-time
---
<!--
layout: blog
title: "Enhancing Kubernetes one KEP at a Time"
date: 2022-08-11
slug: enhancing-kubernetes-one-kep-at-a-time
canonicalUrl: https://www.k8s.dev/blog/2022/08/11/enhancing-kubernetes-one-kep-at-a-time/
-->

<!--
**Author:** Ryler Hockenbury (Mastercard)
-->
**作者：** Ryler Hockenbury（Mastercard）

<!--
Did you know that Kubernetes v1.24 has [46 enhancements](https://kubernetes.io/blog/2022/05/03/kubernetes-1-24-release-announcement/)? That's a lot of new functionality packed into a 4-month release cycle. The Kubernetes release team coordinates the logistics of the release, from remediating test flakes to publishing updated docs. It's a ton of work, but they always deliver.

The release team comprises around 30 people across six subteams - Bug Triage, CI Signal, Enhancements, Release Notes, Communications, and Docs.  Each of these subteams manages a component of the release. This post will focus on the role of the enhancements subteam and how you can get involved.
-->
你是否知道 Kubernetes v1.24 有
[46 個增強特性](https://kubernetes.io/zh-cn/blog/2022/05/03/kubernetes-1-24-release-announcement/)？
在爲期 4 個月的發佈週期內包含了大量新特性。
Kubernetes 發佈團隊協調發布的後勤工作，從修復測試問題到發佈更新的文檔。他們需要完成成噸的工作，但發佈團隊總是能按期交付。

發佈團隊由大約 30 人組成，分佈在六個子團隊：Bug Triage、CI Signal、Enhancements、Release Notes、Communications 和 Docs。
每個子團隊負責管理發佈的一個組件。這篇博文將重點介紹增強子團隊的角色以及你如何能夠參與其中。

<!--
## What's the enhancements subteam?

Great question. We'll get to that in a second but first, let's talk about how features are managed in Kubernetes.

Each new feature requires a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) - KEP for short. KEPs are small structured design documents that provide a way to propose and coordinate new features. The KEP author describes the motivation, design (and alternatives), risks, and tests - then community members provide feedback to build consensus.
-->
## 增強子團隊是什麼？

好問題。我們稍後會討論這個問題，但首先讓我們談談 Kubernetes 中是如何管理功能特性的。

每個新特性都需要一個 [Kubernetes 增強提案](https://github.com/kubernetes/enhancements/blob/master/keps/README.md)，
簡稱爲 KEP。KEP 是一些小型結構化設計文檔，提供了一種提出和協調新特性的方法。
KEP 作者描述其提案動機、設計理念（和替代方案）、風險和測試，然後社區成員會提供反饋以達成共識。

<!--
KEPs are submitted and updated through a pull request (PR) workflow on the [k/enhancements repo](https://github.com/kubernetes/enhancements). Features start in alpha and move through a graduation process to beta and stable as they mature. For example, here's a cool KEP about [privileged container support on Windows Server](https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/1981-windows-privileged-container-support/kep.yaml).  It was introduced as alpha in Kubernetes v1.22 and graduated to beta in v1.23.

Now getting back to the question - the enhancements subteam coordinates the lifecycle tracking of the KEPs for each release. Each KEP is required to meet a set of requirements to be cleared for inclusion in a release. The enhancements subteam verifies each requirement for each KEP and tracks the status.
-->
你可以通過 [Kubernetes/enhancements 倉庫](https://github.com/kubernetes/enhancements)的拉取請求（PR）工作流來提交和更新 KEP。
每個功能特性始於 Alpha 階段，隨着不斷成熟，經由畢業流程進入 Beta 和 Stable 階段。
這裏有一個很酷的 KEP 例子，是關於 [Windows Server 上的特權容器支持](https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/1981-windows-privileged-container-support/kep.yaml)。
這個 KEP 在 Kubernetes v1.22 中作爲 Alpha 引入，並在 v1.23 中進入 Beta 階段。

現在回到上一個問題：增強子團隊如何協調每個版本的 KEP 生命週期跟蹤。
每個 KEP 都必須滿足一組清晰具體的要求，才能被納入一個發佈版本中。
增強子團隊負責驗證每個 KEP 的要求並跟蹤其狀態。

<!--
At the start of a release, [Kubernetes Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) submit their enhancements to opt into a release. A typical release might have from 60 to 90 enhancements at the beginning.  During the release, many enhancements will drop out. Some do not quite meet the KEP requirements, and others do not complete their implementation in code. About 60%-70% of the opted-in KEPs will make it into the final release.
-->
在一個發行版本啓動時，各個 [Kubernetes 特別興趣小組](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIG)
會提交各自的增強特性以進入某版本發佈。通常一個版本最初可能有 60 到 90 個增強特性。隨後，許多增強特性會被過濾掉。
這是因爲有些不完全符合 KEP 要求，而另一些還未完成代碼的實現。最初選擇加入的 KEP 中大約有 60% - 70% 將進入最終發佈。

<!--
## What does the enhancements subteam do?

Another great question, keep them coming! The enhancements team is involved in two crucial milestones during each release: enhancements freeze and code freeze.
-->
## 增強子團隊做什麼？

這是另一個很好的問題，切中了要點！增強特性的團隊在每個版本中會涉及兩個重要的里程碑：增強特性凍結和代碼凍結。

<!--
#### Enhancements Freeze

Enhancements freeze is the deadline for a KEP to be complete in order for the enhancement to be included in a release. It's a quality gate to enforce alignment around maintaining and updating KEPs. The most notable requirements are a (1) [production readiness review ](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)(PRR) and a (2) [KEP file](https://github.com/kubernetes/enhancements/tree/master/keps/NNNN-kep-template) with a complete test plan and graduation criteria.
-->
#### 增強特性凍結

增強特性凍結是一個 KEP 按序完成增強特性並納入一個發佈版本的最後期限。
這是一個質量門控，用於強制對齊與 KEP 維護和更新相關的事項。
最值得注意的要求是
(1) [生產就緒審查](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)(PRR)
和 (2) 附帶完整測試計劃和畢業標準的 [KEP 檔案](https://github.com/kubernetes/enhancements/tree/master/keps/NNNN-kep-template)。

<!--
The enhancements subteam communicates to each KEP author through comments on the KEP issue on Github. As a first step, they'll verify the status and check if it meets the requirements.  The KEP gets marked as tracked after satisfying the requirements; otherwise, it's considered at risk. If a KEP is still at risk when enhancement freeze is in effect, the KEP is removed from the release.

This part of the cycle is typically the busiest for the enhancements subteam because of the large number of KEPs to groom, and each KEP might need to be visited multiple times to verify whether it meets requirements.
-->
增強子團隊通過在 Github 上對 KEP 問題發表評論與每位 KEP 作者進行溝通。
作爲第一步，子團隊成員將檢查 KEP 狀態並確認其是否符合要求。
KEP 在滿足要求後被標記爲已被跟蹤（Tracked）；否則，它會被認爲有風險。
如果在增強特性凍結生效時 KEP 仍然存在風險，該 KEP 將被從發佈版本中移除。

在發佈週期的這個階段，增強子團隊通常是最繁忙的，因爲他們要梳理大量的 KEP，可能需要反覆審查每個 KEP 才能驗證某個 KEP 是否滿足要求。

<!--
#### Code Freeze

Code freeze is the implementation deadline for all enhancements. The code must be implemented, reviewed, and merged by this point if a code change or update is needed for the enhancement. The latter third of the release is focused on stabilizing the codebase - fixing flaky tests, resolving various regressions, and preparing docs - and all the code needs to be in place before those steps can happen.

The enhancements subteam verifies that all PRs for an enhancement are merged into the [Kubernetes codebase](https://github.com/kubernetes/kubernetes) (k/k). During this period, the subteam reaches out to KEP authors to understand what PRs are part of the KEP, verifies that those PRs get merged, and then updates the status of the KEP. The enhancement is removed from the release if the code isn't all merged before the code freeze deadline.
-->
#### 代碼凍結

代碼凍結是從代碼上實現所有增強特性的最後期限。
如果某增強特性的代碼需要更改或更新，則必須在這個時間節點完成所有代碼實現、代碼審查和代碼合併工作。
版本發佈的最後三個工作專注於穩定代碼庫：修復測試問題，解決各種迴歸並準備文檔。而在此之前，所有代碼必須就位。

增強子團隊將驗證某增強特性相關的所有 PR 均已合併到 [Kubernetes 代碼庫](https://github.com/kubernetes/kubernetes) (k/k)。
在此期間，子團隊將聯繫 KEP 作者以瞭解哪些 PR 是 KEP 的一部分，檢查這些 PR 是否已合併，然後更新 KEP 的狀態。
如果在代碼凍結的最後期限之前這些代碼還未全部合併，該增強特性將從發佈版本中移除。

<!--
## How can I get involved with the release team?

I'm glad you asked. The most direct way is to apply to be a [release team shadow](https://github.com/kubernetes/sig-release/blob/master/release-team/shadows.md). The shadow role is a hands-on apprenticeship intended to prepare individuals for leadership positions on the release team. Many shadow roles are non-technical and do not require prior contributions to the Kubernetes codebase.

With 3 Kubernetes releases every year and roughly 25 shadows per release, the release team is always in need of individuals wanting to contribute. Before each release cycle, the release team opens the application for the shadow program. When the application goes live, it's posted in the [Kubernetes Dev Mailing List](https://groups.google.com/a/kubernetes.io/g/dev).  You can subscribe to notifications from that list (or check it regularly!) to watch when the application opens. The announcement will typically go out in mid-April, mid-July, and mid-December - or roughly a month before the start of each release.
-->
## 我如何才能參與發佈團隊？

很高興你提出這個問題。
最直接的方式就是申請成爲一名[發佈團隊影子](https://github.com/kubernetes/sig-release/blob/master/release-team/shadows.md)。
影子角色是一個見習職位，旨在幫助個人在發佈團隊中擔任領導職位做好準備。許多影子角色是非技術性的，且不需要事先對 Kubernetes 代碼庫做出貢獻。

Kubernetes 每年發佈 3 個版本，每個版本大約有 25 個影子，發佈團隊總是需要願意做出貢獻的人。
在每個發佈週期之前，發佈團隊都會爲影子計劃打開申請渠道。當申請渠道上線時，
會公佈在 [Kubernetes 開發郵件清單](https://groups.google.com/a/kubernetes.io/g/dev)中。
你可以訂閱該列表中的通知（或定期查看！），以瞭解申請渠道何時開通。該公告通常會在 4 月中旬、7 月中旬和 12 月中旬發佈，
或者在每個版本開始前大約一個月時發佈。

<!--
## How can I find out more?

Check out the [role handbooks](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks) if you're curious about the specifics of all the Kubernetes release subteams. The handbooks capture the logistics of each subteam, including a week-by-week breakdown of the subteam activities.  It's an excellent reference for getting to know each team better.

You can also check out the release-related Kubernetes slack channels - particularly #release, #sig-release, and #sig-arch. These channels have discussions and updates surrounding many aspects of the release.
-->
## 我怎樣才能找到更多資訊？

如果你對所有 Kubernetes 發佈子團隊的詳情感到好奇，
請查閱[角色手冊](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks)。
這些手冊記錄了每個子團隊的後勤工作，包括每週對子團隊活動的細分任務。這是更好地瞭解每個團隊的絕佳參考。

你還可以查看與發佈相關的 Kubernetes slack 頻道，特別是 #release、#sig-release 和 #sig-arch。
這些頻道圍繞發佈的許多方面進行了討論和更新。
