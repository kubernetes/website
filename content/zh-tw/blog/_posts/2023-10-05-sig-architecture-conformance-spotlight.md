---
layout: blog
title: "聚焦 SIG Architecture: Conformance"
slug: sig-architecture-conformance-spotlight-2023
date: 2023-10-05
---
<!--
layout: blog
title: "Spotlight on SIG Architecture: Conformance"
slug: sig-architecture-conformance-spotlight-2023
date: 2023-10-05
canonicalUrl: https://www.k8s.dev/blog/2023/10/05/sig-architecture-conformance-spotlight-2023/
-->

<!--
**Author**: Frederico Muñoz (SAS Institute)
-->
**作者**：Frederico Muñoz (SAS Institute)

**譯者**：[Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
_This is the first interview of a SIG Architecture Spotlight series
that will cover the different subprojects. We start with the SIG
Architecture: Conformance subproject_

In this [SIG
Architecture](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md)
spotlight, we talked with [Riaan
Kleinhans](https://github.com/Riaankl) (ii.nz), Lead for the
[Conformance
sub-project](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#conformance-definition-1).
-->
**這是 SIG Architecture 焦點訪談系列的首次採訪，這一系列訪談將涵蓋多個子項目。
我們從 SIG Architecture：Conformance 子項目開始。**

在本次 [SIG Architecture](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md)
訪談中，我們與 [Riaan Kleinhans](https://github.com/Riaankl) (ii.nz) 進行了對話，他是
[Conformance 子項目](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#conformance-definition-1)的負責人。

<!--
## About SIG Architecture and the Conformance subproject

**Frederico (FSM)**: Hello Riaan, and welcome! For starters, tell us a
bit about yourself, your role and how you got involved in Kubernetes.

**Riaan Kleinhans (RK)**: Hi! My name is Riaan Kleinhans and I live in
South Africa. I am the Project manager for the [ii.nz](https://ii.nz) in New
Zealand. When I joined ii the plan was to move to New Zealand in April
2020 and then Covid happened. Fortunately, being a flexible and
dynamic team we were able to make it work remotely and in very
different time zones.
-->
## 關於 SIG Architecture 和 Conformance 子項目

**Frederico (FSM)**：你好 Riaan，歡迎！首先，請介紹一下你自己，你的角色以及你是如何參與 Kubernetes 的。

**Riaan Kleinhans (RK)**：嗨！我叫 Riaan Kleinhans，我住在南非。
我是新西蘭 [ii.nz](https://ii.nz) 的項目經理。在我加入 ii 時，本來計劃在 2020 年 4 月搬到新西蘭，
然後新冠疫情爆發了。幸運的是，作爲一個靈活和富有活力的團隊，我們能夠在各個不同的時區以遠程方式協作。

<!--
The ii team have been tasked with managing the Kubernetes Conformance
testing technical debt and writing tests to clear the technical
debt. I stepped into the role of project manager to be the link
between monitoring, test writing and the community. Through that work
I had the privilege of meeting [Dan Kohn](https://github.com/dankohn)
in those first months, his enthusiasm about the work we were doing was
a great inspiration.
-->
ii 團隊負責管理 Kubernetes Conformance 測試的技術債務，並編寫測試內容來消除這些技術債務。
我擔任項目經理的角色，成爲監控、測試內容編寫和社區之間的橋樑。通過這項工作，我有幸在最初的幾個月裏結識了
[Dan Kohn](https://github.com/dankohn)，他對我們的工作充滿熱情，給了我很大的啓發。

<!--
**FSM**: Thank you - so, your involvement in SIG Architecture started
because of the conformance work?

**RK**: SIG Architecture is the home for the Kubernetes Conformance
subproject. Initially, most of my interactions were directly with SIG
Architecture through the Conformance sub-project. However, as we
began organizing the work by SIG, we started engaging directly with
each individual SIG. These engagements with the SIGs that own the
untested APIs have helped us accelerate our work.
-->
**FSM**：謝謝！所以，你參與 SIG Architecture 是因爲合規性的工作？

**RK**：SIG Architecture 負責管理 Kubernetes Conformance 子項目。
最初，我大部分時間直接與 SIG Architecture 交流 Conformance 子項目。
然而，隨着我們開始按 SIG 來組織工作任務，我們開始直接與各個 SIG 進行協作。
與擁有未被測試的 API 的這些 SIG 的協作幫助我們加快了工作進度。

<!--
**FSM**: How would you describe the main goals and
areas of intervention of the Conformance sub-project?

**RM**: The Kubernetes Conformance sub-project focuses on guaranteeing
compatibility and adherence to the Kubernetes specification by
developing and maintaining a comprehensive conformance test suite. Its
main goals include assuring compatibility across different Kubernetes
implementations, verifying adherence to the API specification,
supporting the ecosystem by encouraging conformance certification, and
fostering collaboration within the Kubernetes community. By providing
standardised tests and promoting consistent behaviour and
functionality, the Conformance subproject ensures a reliable and
compatible Kubernetes ecosystem for developers and users alike.
-->
**FSM**：你如何描述 Conformance 子項目的主要目標和介入的領域？

**RM**: Kubernetes Conformance 子項目專注於通過開發和維護全面的合規性測試套件來確保兼容性並遵守
Kubernetes 規範。其主要目標包括確保不同 Kubernetes 實現之間的兼容性，驗證 API 規範的遵守情況，
通過鼓勵合規性認證來支持生態體系，並促進 Kubernetes 社區內的合作。
通過提供標準化的測試並促進一致的行爲和功能，
Conformance 子項目爲開發人員和使用者提供了一個可靠且兼容的 Kubernetes 生態體系。

<!--
## More on the Conformance Test Suite

**FSM**: A part of providing those standardised tests is, I believe,
the [Conformance Test
Suite](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md). Could
you explain what it is and its importance?

**RK**: The Kubernetes Conformance Test Suite checks if Kubernetes
distributions meet the project's specifications, ensuring
compatibility across different implementations. It covers various
features like APIs, networking, storage, scheduling, and
security. Passing the tests confirms proper implementation and
promotes a consistent and portable container orchestration platform.
-->
## 關於 Conformance Test Suite 的更多內容

**FSM**：我認爲，提供這些標準化測試的一部分工作在於
[Conformance Test Suite](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md)。
你能解釋一下它是什麼以及其重要性嗎？

**RK**：Kubernetes Conformance Test Suite 檢查 Kubernetes 發行版是否符合項目的規範，
確保在不同的實現之間的兼容性。它涵蓋了諸如 API、聯網、儲存、調度和安全等各個特性。
能夠通過測試，則表示實現合理，便於推動構建一致且可移植的容器編排平臺。

<!--
**FSM**: Right, the tests are important in the way they define the
minimum features that any Kubernetes cluster must support. Could you
describe the process around determining which features are considered
for inclusion? Is there any tension between a more minimal approach,
and proposals from the other SIGs?

**RK**: The requirements for each endpoint that undergoes conformance
testing are clearly defined by SIG Architecture. Only API endpoints
that are generally available and non-optional features are eligible
for conformance. Over the years, there have been several discussions
regarding conformance profiles, exploring the possibility of including
optional endpoints like RBAC, which are widely used by most end users,
in specific profiles. However, this aspect is still a work in
progress.
-->
**FSM**：是的，這些測試很重要，因爲它們定義了所有 Kubernetes 叢集必須支持的最小特性集合。
你能描述一下決定將哪些特性包含在內的過程嗎？在最小特性集的思路與其他 SIG 提案之間是否有所衝突？

**RK**：SIG Architecture 針對經受合規性測試的每個端點的要求，都有明確的定義。
API 端點只有正式發佈且不是可選的特性，纔會被（進一步）考慮是否合規。
多年來，關於合規性設定檔案已經進行了若干討論，
探討將被大多數終端使用者廣泛使用的可選端點（例如 RBAC）納入特定設定檔案中的可能性。
然而，這一方面仍在不斷改進中。

<!--
Endpoints that do not meet the conformance criteria are listed in
[ineligible_endpoints.yaml](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/testdata/ineligible_endpoints.yaml),
which is publicly accessible in the Kubernetes repo. This file can be
updated to add or remove endpoints as their status or requirements
change. These ineligible endpoints are also visible on
[APISnoop](https://apisnoop.cncf.io/).

Ensuring transparency and incorporating community input regarding the
eligibility or ineligibility of endpoints is of utmost importance to
SIG Architecture.
-->
不滿足合規性標準的端點被列在
[ineligible_endpoints.yaml](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/testdata/ineligible_endpoints.yaml) 中，
該檔案放在 Kubernetes 代碼倉庫中，是被公開訪問的。
隨着這些端點的狀態或要求發生變化，此檔案可能會被更新以添加或刪除端點。
不合格的端點也可以在 [APISnoop](https://apisnoop.cncf.io/) 上看到。

對於 SIG Architecture 來說，確保透明度並納入社區意見以確定端點的合格或不合格狀態是至關重要的。

<!--
**FSM**: Writing tests for new features is something generally
requires some kind of enforcement. How do you see the evolution of
this in Kubernetes? Was there a specific effort to improve the process
in a way that required tests would be a first-class citizen, or was
that never an issue?

**RK**: When discussions surrounding the Kubernetes conformance
programme began in 2018, only approximately 11% of endpoints were
covered by tests. At that time, the CNCF's governing board requested
that if funding were to be provided for the work to cover missing
conformance tests, the Kubernetes Community should adopt a policy of
not allowing new features to be added unless they include conformance
tests for their stable APIs.
-->
**FSM**：爲新特性編寫測試內容通常需要某種強制執行方式。
你如何看待 Kubernetes 中這方面的演變？是否有人在努力改進這個流程，
使得必須具備測試成爲頭等要務，或許這從來都不是一個問題？

**RK**：在 2018 年開始圍繞 Kubernetes 合規性計劃進行討論時，只有大約 11% 的端點被測試所覆蓋。
那時，CNCF 的管理委員會提出一個要求，如果要提供資金覆蓋缺失的合規性測試，Kubernetes 社區應採取一個策略，
即如果新特性沒有包含穩定 API 的合規性測試，則不允許添加此特性。

<!--
SIG Architecture is responsible for stewarding this requirement, and
[APISnoop](https://apisnoop.cncf.io/) has proven to be an invaluable
tool in this regard. Through automation, APISnoop generates a pull
request every weekend to highlight any discrepancies in Conformance
coverage. If any endpoints are promoted to General Availability
without a conformance test, it will be promptly identified. This
approach helps prevent the accumulation of new technical debt.

Additionally, there are plans in the near future to create a release
informing job, which will add an additional layer to prevent any new
technical debt.
-->
SIG Architecture 負責監督這一要求，[APISnoop](https://apisnoop.cncf.io/)
在此方面被證明是一個非常有價值的工具。通過自動化流程，APISnoop 在每個週末生成一個 PR，
以突出 Conformance 覆蓋範圍的變化。如果有端點在沒有進行合規性測試的情況下進階至正式發佈，
將會被迅速識別發現。這種方法有助於防止積累新的技術債務。

此外，我們計劃在不久的將來創建一個發佈通知任務，作用是添加額外一層防護，以防止產生新的技術債務。

<!--
**FSM**: I see, tooling and automation play an important role
there. What are, in your opinion, the areas that, conformance-wise,
still require some work to be done? In other words, what are the
current priority areas marked for improvement?

**RK**: We have reached the “100% Conformance Tested” milestone in
release 1.27!
-->
**FSM**：我明白了，工具化和自動化在其中起着重要的作用。
在你看來，就合規性而言，還有哪些領域需要做一些工作？
換句話說，目前標記爲優先改進的領域有哪些？

**RK**：在 1.27 版本中，我們已完成了 “100% 合規性測試” 的里程碑！

<!--
At that point, the community took another look at all the endpoints
that were listed as ineligible for conformance. The list was populated
through community input over several years.  Several endpoints
that were previously deemed ineligible for conformance have been
identified and relocated to a new dedicated list, which is currently
receiving focused attention for conformance test development. Again,
that list can also be checked on apisnoop.cncf.io.
-->
當時，社區重新審視了所有被列爲不合規的端點。這個列表是收集多年的社區意見後填充的。
之前被認爲不合規的幾個端點已被挑選出來並遷移到一個新的專用列表中，
該列表中包含目前合規性測試開發的焦點。同樣，可以在 apisnoop.cncf.io 上查閱此列表。

<!--
To ensure the avoidance of new technical debt in the conformance
project, there are upcoming plans to establish a release informing job
as an additional preventive measure.

While APISnoop is currently hosted on CNCF infrastructure, the project
has been generously donated to the Kubernetes community. Consequently,
it will be transferred to community-owned infrastructure before the
end of 2023.
-->
爲了確保在合規性項目中避免產生新的技術債務，我們計劃建立一個發佈通知任務作爲額外的預防措施。

雖然 APISnoop 目前被託管在 CNCF 基礎設施上，但此項目已慷慨地捐贈給了 Kubernetes 社區。
因此，它將在 2023 年底之前轉移到社區自治的基礎設施上。

<!--
**FSM**: That's great news! For anyone wanting to help, what are the
venues for collaboration that you would highlight? Do all of them
require solid knowledge of Kubernetes as a whole, or are there ways
someone newer to the project can contribute?

**RK**: Contributing to conformance testing is akin to the task of
"washing the dishes" – it may not be highly visible, but it remains
incredibly important. It necessitates a strong understanding of
Kubernetes, particularly in the areas where the endpoints need to be
tested. This is why working with each SIG that owns the API endpoint
being tested is so important.
-->
**FSM**：這是個好消息！對於想要提供幫助的人們，你能否重點說明一下協作的價值所在？
參與貢獻是否需要對 Kubernetes 有很紮實的知識，或否有辦法讓一些新人也能爲此項目做出貢獻？

**RK**：參與合規性測試就像 "洗碗" 一樣，它可能不太顯眼，但仍然非常重要。
這需要對 Kubernetes 有深入的理解，特別是在需要對端點進行測試的領域。
這就是爲什麼與負責測試 API 端點的每個 SIG 進行協作會如此重要。

<!--
As part of our commitment to making test writing accessible to
everyone, the ii team is currently engaged in the development of a
"click and deploy" solution. This solution aims to enable anyone to
swiftly create a working environment on real hardware within
minutes. We will share updates regarding this development as soon as
we are ready.
-->
我們的承諾是讓所有人都能參與測試內容編寫，作爲這一承諾的一部分，
ii 團隊目前正在開發一個 “點擊即部署（click and deploy）” 的解決方案。
此解決方案旨在使所有人都能在幾分鐘內快速創建一個在真實硬件上工作的環境。
我們將在準備好後分享有關此項開發的更新。

<!--
**FSM**: That's very helpful, thank you. Any final comments you would
like to share with our readers?

**RK**: Conformance testing is a collaborative community endeavour that
involves extensive cooperation among SIGs. SIG Architecture has
spearheaded the initiative and provided guidance. However, the
progress of the work relies heavily on the support of all SIGs in
reviewing, enhancing, and endorsing the tests.
-->
**FSM**：那會非常有幫助，謝謝。最後你還想與我們的讀者分享些什麼見解嗎？

**RK**：合規性測試是一個協作性的社區工作，涉及各個 SIG 之間的廣泛合作。
SIG Architecture 在推動倡議並提供指導方面起到了領頭作用。然而，
工作的進展在很大程度上依賴於所有 SIG 在審查、增強和認可測試方面的支持。

<!--
I would like to extend my sincere appreciation to the ii team for
their unwavering commitment to resolving technical debt over the
years. In particular, [Hippie Hacker](https://github.com/hh)'s
guidance and stewardship of the vision has been
invaluable. Additionally, I want to give special recognition to
Stephen Heywood for shouldering the majority of the test writing
workload in recent releases, as well as to Zach Mandeville for his
contributions to APISnoop.
-->
我要衷心感謝 ii 團隊多年來對解決技術債務的堅定承諾。
特別要感謝 [Hippie Hacker](https://github.com/hh) 的指導和對願景的引領作用，這是非常寶貴的。
此外，我還要特別表揚 Stephen Heywood 在最近幾個版本中承擔了大部分測試內容編寫工作而做出的貢獻，
還有 Zach Mandeville 對 APISnoop 也做了很好的貢獻。

<!--
**FSM**: Many thanks for your availability and insightful comments,
I've personally learned quite a bit with it and I'm sure our readers
will as well.
-->
**FSM**：非常感謝你參加本次訪談並分享你的深刻見解，我本人從中獲益良多，我相信讀者們也會同樣受益。
