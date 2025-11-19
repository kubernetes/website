---
layout: blog
title: "介紹 SIG etcd"
slug: introducing-sig-etcd
date: 2023-11-07
canonicalUrl: https://etcd.io/blog/2023/introducing-sig-etcd/
---

<!--
layout: blog
title: "Introducing SIG etcd"
slug: introducing-sig-etcd
date: 2023-11-07
canonicalUrl: https://etcd.io/blog/2023/introducing-sig-etcd/
-->

<!--
**Authors**:  Han Kang (Google), Marek Siarkowicz (Google), Frederico Muñoz (SAS Institute)
-->
**作者**：Han Kang (Google), Marek Siarkowicz (Google), Frederico Muñoz (SAS Institute)

**譯者**：Xin Li (Daocloud)

<!--
Special Interest Groups (SIGs) are a fundamental part of the Kubernetes project,
with a substantial share of the community activity happening within them.
When the need arises, [new SIGs can be created](https://github.com/kubernetes/community/blob/master/sig-wg-lifecycle.md),
and that was precisely what happened recently.
-->
特殊興趣小組（SIG）是 Kubernetes 項目的基本組成部分，很大一部分的 Kubernetes 社區活動都在其中進行。
當有需要時，可以創建[新的 SIG](https://github.com/kubernetes/community/blob/master/sig-wg-lifecycle.md)，
而這正是最近發生的事情。

<!--
[SIG etcd](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md)
is the most recent addition to the list of Kubernetes SIGs.
In this article we will get to know it a bit better, understand its origins, scope, and plans.
-->
[SIG etcd](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md)
是 Kubernetes SIG 列表中的最新成員。在這篇文章中，我們將更好地認識它，瞭解它的起源、職責和計劃。

<!--
## The critical role of etcd

If we look inside the control plane of a Kubernetes cluster, we will find
[etcd](https://kubernetes.io/docs/concepts/overview/components/#etcd),
a consistent and highly-available key value store used as Kubernetes' backing
store for all cluster data -- this description alone highlights the critical role that etcd plays,
and the importance of it within the Kubernetes ecosystem.
-->
## etcd 的關鍵作用

如果我們查看 Kubernetes 集羣的控制平面內部，我們會發現
[etcd](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#etcd)，
一個一致且高可用的鍵值存儲，用作 Kubernetes 所有集羣數據的後臺數據庫 -- 僅此描述就突出了
etcd 所扮演的關鍵角色，以及它在 Kubernetes 生態系統中的重要性。

<!--
This critical role makes the health of the etcd project and community an important consideration,
and [concerns about the state of the project](https://groups.google.com/a/kubernetes.io/g/steering/c/e-O-tVSCJOk/m/N9IkiWLEAgAJ)
in early 2022 did not go unnoticed. The changes in the maintainer team, amongst other factors,
contributed to a situation that needed to be addressed.
-->
由於 etcd 在生態中的關鍵作用，其項目和社區的健康成爲了一個重要的考慮因素，
並且人們 2022 年初[對項目狀態的擔憂](https://groups.google.com/a/kubernetes.io/g/steering/c/e-O-tVSCJOk/m/N9IkiWLEAgAJ)
並沒有被忽視。維護團隊的變化以及其他因素導致了一些情況需要被解決。

<!--
## Why a special interest group

With the critical role of etcd in mind, it was proposed that the way forward would
be to create a new special interest group. If etcd was already at the heart of Kubernetes,
creating a dedicated SIG not only recognises that role, it would make etcd a first-class citizen of the Kubernetes community.
-->
## 爲什麼要設立特殊興趣小組

考慮到 etcd 的關鍵作用，有人提出未來的方向是創建一個新的特殊興趣小組。
如果 etcd 已經成爲 Kubernetes 的核心，創建專門的 SIG 不僅是對這一角色的認可，
還會使 etcd 成爲 Kubernetes 社區的一等公民。

<!--
Establishing SIG etcd creates a dedicated space to make explicit the contract
between etcd and Kubernetes api machinery and to prevent, on the etcd level,
changes which violate this contract. Additionally, etcd will be able to adop
the processes that Kubernetes offers its SIGs ([KEPs](https://www.kubernetes.dev/resources/keps/),
[PRR](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md),
[phased feature gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/),
amongst others) in order to improve the consistency and reliability of the codebase. Being able to use these processes will be a substantial benefit to the etcd community.
-->
SIG etcd 的成立爲明確 etcd 和 Kubernetes API 機制之間的契約關係創造了一個專門的空間，
並防止在 etcd 級別上發生違反此契約的更改。此外，etcd 將能夠採用 Kubernetes 提供的 SIG
流程（[KEP](https://www.kubernetes.dev/resources/keps/)、
[PRR](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)、
[分階段特性門控](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)以及其他流程）
以提高代碼庫的一致性和可靠性，這將爲 etcd 社區帶來巨大的好處。

<!--
As a SIG, etcd will also be able to draw contributor support from Kubernetes proper:
active contributions to etcd from Kubernetes maintainers would decrease the likelihood
of breaking Kubernetes changes, through the increased number of potential reviewers
and the integration with existing testing framework. This will not only benefit Kubernetes,
which will be able to better participate and shape the direction of etcd in terms of the critical role it plays,
but also etcd as a whole.
-->
作爲 SIG，etcd 還能夠從 Kubernetes 獲得貢獻者的支持：Kubernetes 維護者對 etcd
的積極貢獻將通過增加潛在審覈者數量以及與現有測試框架的集成來降低破壞 Kubernetes 更改的可能性。
這不僅有利於 Kubernetes，由於它能夠更好地參與並塑造 etcd 所發揮的關鍵作用，從而也將有利於整個 etcd。

<!--
## About SIG etcd

The recently created SIG is already working towards its goals, defined in its
[Charter](https://github.com/kubernetes/community/blob/master/sig-etcd/charter.md)
and [Vision](https://github.com/kubernetes/community/blob/master/sig-etcd/vision.md).
The purpose is clear: to ensure etcd is a reliable, simple, and scalable production-ready
store for building cloud-native distributed systems and managing cloud-native infrastructure
via orchestrators like Kubernetes.
-->
## 關於 SIG etcd

最近創建的 SIG 已經在努力實現其[章程](https://github.com/kubernetes/community/blob/master/sig-etcd/charter.md)
和[願景](https:///github.com/kubernetes/community/blob/master/sig-etcd/vision.md)中定義的目標。
其目的很明確：確保 etcd 是一個可靠、簡單且可擴展的生產就緒存儲，用於構建雲原生分佈式系統並通過 Kubernetes 等編排器管理雲原生基礎設施。

<!--
The scope of SIG etcd is not exclusively about etcd as a Kubernetes component,
it also covers etcd as a standard solution. Our goal is to make etcd the most
reliable key-value storage to be used anywhere, unconstrained by any Kubernetes-specific
limits and scaling to meet the requirements of many diverse use-cases.
-->
SIG etcd 的範圍不僅僅涉及將 etcd 作爲 Kubernetes 組件，還涵蓋將 etcd 作爲標準解決方案。
我們的目標是使 etcd 成爲可在任何地方使用的最可靠的鍵值存儲，不受任何 kubernetes 特定限制的約束，並且可以擴展以滿足許多不同用例的需求。

<!--
We are confident that the creation of SIG etcd constitutes an important milestone
in the lifecycle of the project, simultaneously improving etcd itself,
and also the integration of etcd with Kubernetes. We invite everyone interested in etcd to
[visit our page](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md),
[join us at our Slack channel](https://kubernetes.slack.com/messages/etcd),
and get involved in this new stage of etcd's life.
-->
我們相信，SIG etcd 的創建將成爲項目生命週期中的一個重要里程碑，同時改進 etcd 本身以及
etcd 與 Kubernetes 的集成。我們歡迎所有對 etcd
感興趣的人[訪問我們的頁面](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md)、
[加入我們的 Slack 頻道](https://kubernetes.slack.com/messages/etcd)，並參與 etcd 生命的新階段。
