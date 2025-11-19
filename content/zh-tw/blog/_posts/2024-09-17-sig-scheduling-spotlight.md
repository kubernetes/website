---
layout: blog
title: "SIG Scheduling 訪談"
slug: sig-scheduling-spotlight-2024
date: 2024-09-24
author: "Arvind Parekh"
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Spotlight on SIG Scheduling"
slug: sig-scheduling-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/09/24/sig-scheduling-spotlight-2024
date: 2024-09-24
author: "Arvind Parekh"
-->

<!--
In this SIG Scheduling spotlight we talked with [Kensei Nakada](https://github.com/sanposhiho/), an
approver in SIG Scheduling.

## Introductions

**Arvind:** **Hello, thank you for the opportunity to learn more about SIG Scheduling! Would you
like to introduce yourself and tell us a bit about your role, and how you got involved with
Kubernetes?**
-->
在本次 SIG Scheduling 的訪談中，我們與 [Kensei Nakada](https://github.com/sanposhiho/)
進行了交流，他是 SIG Scheduling 的一名 Approver。

## 介紹

**Arvind:** **你好，感謝你讓我們有機會了解 SIG Scheduling！
你能介紹一下自己，告訴我們你的角色以及你是如何參與 Kubernetes 的嗎？**

<!--
**Kensei**: Hi, thanks for the opportunity! I’m Kensei Nakada
([@sanposhiho](https://github.com/sanposhiho/)), a software engineer at
[Tetrate.io](https://tetrate.io/). I have been contributing to Kubernetes in my free time for more
than 3 years, and now I’m an approver of SIG Scheduling in Kubernetes. Also, I’m a founder/owner of
two SIG subprojects,
[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) and
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension).
-->
**Kensei**: 嗨，感謝你給我這個機會！我是 Kensei Nakada
([@sanposhiho](https://github.com/sanposhiho/))，是來自 [Tetrate.io](https://tetrate.io/) 的一名軟件工程師。
我在業餘時間爲 Kubernetes 貢獻了超過 3 年的時間，現在我是 Kubernetes 中 SIG Scheduling 的一名 Approver。
同時，我還是兩個 SIG 子項目的創始人/負責人：
[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) 和
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)。

<!--
## About SIG Scheduling

**AP: That's awesome! You've been involved with the project since a long time. Can you provide a
brief overview of SIG Scheduling and explain its role within the Kubernetes ecosystem?**

**KN**: As the name implies, our responsibility is to enhance scheduling within
Kubernetes. Specifically, we develop the components that determine which Node is the best place for
each Pod. In Kubernetes, our main focus is on maintaining the
[kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/), along
with other scheduling-related components as part of our SIG subprojects.
-->
## 關於 SIG Scheduling

**AP: 太棒了！你參與這個項目已經很久了。你能簡要概述一下 SIG Scheduling，並說明它在 Kubernetes 生態系統中的角色嗎？**

**KN**: 正如名字所示，我們的責任是增強 Kubernetes 中的調度特性。
具體來說，我們開發了一些組件，將每個 Pod 調度到最合適的 Node。
在 Kubernetes 中，我們的主要關注點是維護
[kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)，
以及其他調度相關的組件，這些組件是 SIG Scheduling 的子項目。

<!--
**AP: I see, got it! That makes me curious--what recent innovations or developments has SIG
Scheduling introduced to Kubernetes scheduling?**

**KN**: From a feature perspective, there have been
[several enhancements](/blog/2023/04/17/fine-grained-pod-topology-spread-features-beta/)
to `PodTopologySpread` recently. `PodTopologySpread` is a relatively new feature in the scheduler,
and we are still in the process of gathering feedback and making improvements.
-->
**AP: 明白了！我有點好奇，SIG Scheduling 最近爲 Kubernetes 調度引入了哪些創新或發展？**

**KN**: 從特性的角度來看，最近對 `PodTopologySpread`
進行了[幾項增強](/zh-cn/blog/2023/04/17/fine-grained-pod-topology-spread-features-beta/)。
`PodTopologySpread` 是調度器中一個相對較新的特性，我們仍在收集反饋並進行改進。

<!--
Most recently, we have been focusing on a new internal enhancement called
[QueueingHint](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)
which aims to enhance scheduling throughput. Throughput is one of our crucial metrics in
scheduling. Traditionally, we have primarily focused on optimizing the latency of each scheduling
cycle. QueueingHint takes a different approach, optimizing when to retry scheduling, thereby
reducing the likelihood of wasting scheduling cycles.
-->
最近，我們專注於一個內部增強特性，稱爲
[QueueingHint](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)，
這個特性旨在提高調度的吞吐量。吞吐量是我們調度中的關鍵指標之一。傳統上，我們主要關注優化每個調度週期的延遲。
而 QueueingHint 採取了一種不同的方法，它可以優化何時重試調度，從而減少浪費調度週期的可能性。

<!--
**A: That sounds interesting! Are there any other interesting topics or projects you are currently
working on within SIG Scheduling?**

**KN**: I’m leading the development of `QueueingHint` which I just shared. Given that it’s a big new
challenge for us, we’ve been facing many unexpected challenges, especially around the scalability,
and we’re trying to solve each of them to eventually enable it by default.
-->
**A: 聽起來很有趣！你目前在 SIG Scheduling 中還有其他有趣的主題或項目嗎？**

**KN**: 我正在牽頭剛剛提到的 `QueueingHint` 的開發。考慮到這是我們面臨的一項重大新挑戰，
我們遇到了許多意想不到的問題，特別是在可擴展性方面，我們正在努力解決每一個問題，使這項特性最終能夠默認啓用。

<!--
And also, I believe
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)
(a SIG subproject) that I started last year would be interesting to many people. Kubernetes has
various extensions from many components. Traditionally, extensions are provided via webhooks
([extender](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md)
in the scheduler) or Go SDK ([Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/)
in the scheduler). However, these come with drawbacks - performance issues with webhooks and the need to
rebuild and replace schedulers with Go SDK, posing difficulties for those seeking to extend the
scheduler but lacking familiarity with it. The project is trying to introduce a new solution to
this general challenge - a [WebAssembly](https://webassembly.org/) based extension. Wasm allows
users to build plugins easily, without worrying about recompiling or replacing their scheduler, and
sidestepping performance concerns.
-->
此外，我認爲我去年啓動的
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)（SIG 子項目）
對許多人來說也會很有趣。Kubernetes 有各種擴展來自許多組件。傳統上，擴展通過 Webhook
（調度器中的 [extender](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md)）或
Go SDK（調度器中的[調度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)）提供。
然而，這些方法存在缺點，首先是 Webhook 的性能問題以及需要重建和替換調度器的 Go SDK，這就給那些希望擴展調度器但對其不熟悉的人帶來了困難。
此項目嘗試引入一種新的解決方案來應對這一普遍挑戰，即基於 [WebAssembly](https://webassembly.org/) 的擴展。
Wasm 允許使用者輕鬆構建插件，而無需擔心重新編譯或替換調度器，還能規避性能問題。

<!--
Through this project, SIG Scheduling has been learning valuable insights about WebAssembly's
interaction with large Kubernetes objects. And I believe the experience that we’re gaining should be
useful broadly within the community, beyond SIG Scheduling.

**A: Definitely! Now, there are 8 subprojects inside SIG Scheduling. Would you like to
talk about them? Are there some interesting contributions by those teams you want to highlight?**

**KN**: Let me pick up three subprojects: Kueue, KWOK and descheduler.
-->
通過這個項目，SIG Scheduling 正在積累 WebAssembly 與大型 Kubernetes 對象交互的寶貴洞察。
我相信我們所獲得的經驗應該對整個社區都很有用，而不僅限於 SIG Scheduling 的範圍。

**A: 當然！目前 SIG Scheduling 有 8 個子項目。你想談談它們嗎？有沒有一些你想強調的有趣貢獻？**

**KN**: 讓我挑選三個子項目：Kueue、KWOK 和 Descheduler。

<!--
[Kueue](https://github.com/kubernetes-sigs/kueue)
: Recently, many people have been trying to manage batch workloads with Kubernetes, and in 2022,
  Kubernetes community founded
  [WG-Batch](https://github.com/kubernetes/community/blob/master/wg-batch/README.md) for better
  support for such batch workloads in Kubernetes. [Kueue](https://github.com/kubernetes-sigs/kueue)
  is a project that takes a crucial role for it. It’s a job queueing controller, deciding when a job
  should wait, when a job should be admitted to start, and when a job should be preempted. Kueue aims
  to be installed on a vanilla Kubernetes cluster while cooperating with existing matured controllers
  (scheduler, cluster-autoscaler, kube-controller-manager, etc).
-->
[Kueue](https://github.com/kubernetes-sigs/kueue):
: 最近，許多人嘗試使用 Kubernetes 管理批處理工作負載，2022 年，Kubernetes 社區成立了
  [WG-Batch](https://github.com/kubernetes/community/blob/master/wg-batch/README.md)，
  以更好地支持 Kubernetes 中的此類批處理工作負載。
  [Kueue](https://github.com/kubernetes-sigs/kueue) 是一個在其中扮演關鍵角色的項目。
  它是一個作業隊列控制器，決定何時一個作業應該等待，何時一個作業應該被准許啓動，以及何時一個作業應該被搶佔。
  Kueue 旨在安裝在一個普通的 Kubernetes 叢集上，
  同時與現有的成熟控制器（調度器、cluster-autoscaler、kube-controller-manager 等）協作。

<!--
[KWOK](https://github.com/kubernetes-sigs/kwok)
: KWOK is a component in which you can create a cluster of thousands of Nodes in seconds. It’s
  mostly useful for simulation/testing as a lightweight cluster, and actually another SIG sub
  project [kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator)
  uses KWOK background.

[descheduler](https://github.com/kubernetes-sigs/descheduler)
: Descheduler is a component recreating pods that are running on undesired Nodes. In Kubernetes,
  scheduling constraints (`PodAffinity`, `NodeAffinity`, `PodTopologySpread`, etc) are honored only at
  Pod schedule, but it’s not guaranteed that the contrtaints are kept being satisfied afterwards.
  Descheduler evicts Pods violating their scheduling constraints (or other undesired conditions) so
  that they’re recreated and rescheduled.
-->
[KWOK](https://github.com/kubernetes-sigs/kwok)
: KWOK 這個組件可以在幾秒鐘內創建一個包含數千個節點的叢集。它主要用於模擬/測試輕量級叢集，實際上另一個 SIG 子項目
  [kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) 就在後端使用了 KWOK。

[Descheduler](https://github.com/kubernetes-sigs/descheduler)
: Descheduler 這個組件可以將運行在不理想的節點上的 Pod 重新創建。
  在 Kubernetes 中，調度約束（`PodAffinity`、`NodeAffinity`、`PodTopologySpread` 等）僅在 Pod 調度時被考慮，
  但不能保證這些約束在之後仍然被滿足。Descheduler 會驅逐違反其調度約束（或其他不符合預期狀況）的 Pod，
  以便這些 Pod 被重新創建和重新調度。

<!--
[Descheduling Framework](https://github.com/kubernetes-sigs/descheduler/blob/master/keps/753-descheduling-framework/README.md)
: One very interesting on-going project, similar to
  [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/) in the
  scheduler, aiming to make descheduling logic extensible and allow maintainers to focus on building
  a core engine of descheduler.
-->
[Descheduling Framework](https://github.com/kubernetes-sigs/descheduler/blob/master/keps/753-descheduling-framework/README.md):
: 一個非常有趣的正在進行的項目，類似於調度器中的[調度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)，
  旨在使去調度邏輯可擴展，並允許維護者們專注於構建 Descheduler 的核心引擎。

<!--
**AP: Thank you for letting us know! And I have to ask, what are some of your favorite things about
this SIG?**

**KN**: What I really like about this SIG is how actively engaged everyone is. We come from various
companies and industries, bringing diverse perspectives to the table. Instead of these differences
causing division, they actually generate a wealth of opinions. Each view is respected, and this
makes our discussions both rich and productive.

I really appreciate this collaborative atmosphere, and I believe it has been key to continuously
improving our components over the years.
-->
**AP: 感謝你告訴我們這些！我想問一下，你最喜歡這個 SIG 的哪些方面？**

**KN**: 我真正喜歡這個 SIG 的地方在於每個人都積極參與。
我們來自不同的公司和行業，帶來了多樣的視角。
這些差異並沒有造成分歧，實際上產生了豐富的觀點。
每種觀點都會受到尊重，這使我們的討論既豐富又富有成效。

我非常欣賞這種協作氛圍，我相信這對我們多年來不斷改進組件至關重要。

<!--
## Contributing to SIG Scheduling

**AP: Kubernetes is a community-driven project. Any recommendations for new contributors or
beginners looking to get involved and contribute to SIG scheduling? Where should they start?**

**KN**: Let me start with a general recommendation for contributing to any SIG: a common approach is to look for
[good-first-issue](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
However, you'll soon realize that many people worldwide are trying to contribute to the Kubernetes
repository.
-->
## 給 SIG Scheduling 做貢獻

**AP: Kubernetes 是一個社區驅動的項目。你對新貢獻者或希望參與併爲
SIG Scheduling 做出貢獻的初學者有什麼建議？他們應該從哪裏開始？**

**KN**: 讓我先給出一個關於爲任何 SIG 貢獻的通用建議：一種常見的方法是尋找
[good-first-issue](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)。
然而，你很快就會意識到，世界各地有很多人正在嘗試爲 Kubernetes 倉庫做貢獻。

<!--
I suggest starting by examining the implementation of a component that interests you. If you have
any questions about it, ask in the corresponding Slack channel (e.g., #sig-scheduling for the
scheduler, #sig-node for kubelet, etc). Once you have a rough understanding of the implementation,
look at issues within the SIG (e.g.,
[sig-scheduling](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fscheduling)),
where you'll find more unassigned issues compared to good-first-issue ones. You may also want to
filter issues with the
[kind/cleanup](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue++label%3Akind%2Fcleanup+)
label, which often indicates lower-priority tasks and can be starting points.
-->
我建議先查看你感興趣的某個組件的實現。如果你對該組件有任何疑問，可以在相應的
Slack 頻道中提問（例如，調度器的 #sig-scheduling，kubelet 的 #sig-node 等）。
一旦你對實現有了大致瞭解，就可以查看 SIG 中的 Issue
（例如，[sig-scheduling](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fscheduling)），
相比 good-first-issue，在這裏你會發現更多未分配的 Issue。你可能還想過濾帶有
[kind/cleanup](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue++label%3Akind%2Fcleanup+)
標籤的 Issue，這通常表示較低優先級的任務，可以作爲起點。

<!--
Specifically for SIG Scheduling, you should first understand the
[Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/), which is
the fundamental architecture of kube-scheduler. Most of the implementation is found in
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler).
I suggest starting with
[ScheduleOne](https://github.com/kubernetes/kubernetes/blob/0590bb1ac495ae8af2a573f879408e48800da2c5/pkg/scheduler/schedule_one.go#L66)
function and then exploring deeper from there.

Additionally, apart from the main kubernetes/kubernetes repository, consider looking into
sub-projects. These typically have fewer maintainers and offer more opportunities to make a
significant impact. Despite being called "sub" projects, many have a large number of users and a
considerable impact on the community.
-->
具體對於 SIG Scheduling 而言，你應該先了解[調度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)，
這是 kube-scheduler 的基本架構。大多數實現都可以在
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)中找到。我建議從
[ScheduleOne](https://github.com/kubernetes/kubernetes/blob/0590bb1ac495ae8af2a573f879408e48800da2c5/pkg/scheduler/schedule_one.go#L66)
函數開始，然後再深入探索。

此外，除了 kubernetes/kubernetes 主倉庫外，還可以考慮查看一些子項目。
這些子項目的維護者通常比較少，你有更多的機會來對其產生重大影響。儘管被稱爲“子”項目，
但許多項目實際上有大量使用者，並對社區產生了相當大的影響。

<!--
And last but not least, remember contributing to the community isn’t just about code. While I
talked a lot about the implementation contribution, there are many ways to contribute, and each one
is valuable. One comment to an issue, one feedback to an existing feature, one review comment in PR,
one clarification on the documentation; every small contribution helps drive the Kubernetes
ecosystem forward.

**AP: Those are some pretty useful tips! And if I may ask, how do you assist new contributors in
getting started, and what skills are contributors likely to learn by participating in SIG Scheduling?**
-->
最後但同樣重要的是，記住爲社區做貢獻不僅僅是編寫代碼。
雖然我談到了很多關於實現的貢獻，但還有許多其他方式可以做貢獻，每一種都很有價值。
對某個 Issue 的一條評論，對現有特性的一個反饋，對 PR 的一個審查建議，對文檔的一個說明闡述；
每一個小貢獻都有助於推動 Kubernetes 生態系統向前發展。

**AP: 這些建議非常有用！冒昧問一下，你是如何幫助新貢獻者入門的，參與 SIG Scheduling 的貢獻者可能會學習到哪些技能？**

<!--
**KN**: Our maintainers are available to answer your questions in the #sig-scheduling Slack
channel. By participating, you'll gain a deeper understanding of Kubernetes scheduling and have the
opportunity to collaborate and network with maintainers from diverse backgrounds. You'll learn not
just how to write code, but also how to maintain a large project, design and discuss new features,
address bugs, and much more.

## Future Directions

**AP: What are some Kubernetes-specific challenges in terms of scheduling? Are there any particular
pain points?**
-->
**KN**: 我們的維護者在 #sig-scheduling Slack 頻道中隨時可以回答你的問題。
多多參與，你將深入瞭解 Kubernetes 的調度，並有機會與來自不同背景的維護者合作和建立聯繫。
你將學習到的不僅僅是如何編寫代碼，還有如何維護大型項目、設計和討論新特性、解決 Bug 等等。

## 未來方向

**AP: 在調度方面，Kubernetes 特有的挑戰有哪些？有沒有特別的痛點？**

<!--
**KN**: Scheduling in Kubernetes can be quite challenging because of the diverse needs of different
organizations with different business requirements. Supporting all possible use cases in
kube-scheduler is impossible. Therefore, extensibility is a key focus for us. A few years ago, we
rearchitected kube-scheduler with [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/),
which offers flexible extensibility for users to implement various scheduling needs through plugins. This
allows maintainers to focus on the core scheduling features and the framework runtime.
-->
**KN**: 在 Kubernetes 中進行調度可能相當具有挑戰性，因爲不同組織有不同的業務要求。
在 kube-scheduler 中支持所有可能的使用場景是不可能的。因此，可擴展性是我們關注的核心焦點。
幾年前，我們使用[調度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)爲
kube-scheduler 重新設計了架構，爲使用者通過插件實現各種調度需求提供了靈活的可擴展性。
這使得維護者們能夠專注於核心調度特性和框架運行時。

<!--
Another major issue is maintaining sufficient scheduling throughput. Typically, a Kubernetes cluster
has only one kube-scheduler, so its throughput directly affects the overall scheduling scalability
and, consequently, the cluster's scalability. Although we have an internal performance test
([scheduler_perf](https://github.com/kubernetes/kubernetes/tree/master/test/integration/scheduler_perf)),
unfortunately, we sometimes overlook performance degradation in less common scenarios. It’s
difficult as even small changes, which look irrelevant to performance, can lead to degradation.
-->
另一個主要問題是保持足夠的調度吞吐量。通常，一個 Kubernetes 叢集只有一個 kube-scheduler，
因此其吞吐量直接影響整體調度的可擴展性，從而影響叢集的可擴展性。儘管我們有一個內部性能測試
([scheduler_perf](https://github.com/kubernetes/kubernetes/tree/master/test/integration/scheduler_perf))，
但不巧的是，我們有時會忽視在不常見場景下的性能下降。即使是與性能無關的小改動也有難度，可能導致性能下降。

<!--
**AP: What are some upcoming goals or initiatives for SIG Scheduling? How do you envision the SIG evolving in the future?**

**KN**: Our primary goal is always to build and maintain _extensible_ and _stable_ scheduling
runtime, and I bet this goal will remain unchanged forever.

As already mentioned, extensibility is key to solving the challenge of the diverse needs of
scheduling. Rather than trying to support every different use case directly in kube-scheduler, we
will continue to focus on enhancing extensibility so that it can accommodate various use
cases. [kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)
that I mentioned is also part of this initiative.
-->
**AP: 接下來 SIG Scheduling 有哪些即將實現的目標或計劃？你如何看待 SIG 的未來發展？**

**KN**: 我們的主要目標始終是構建和維護**可擴展的**和**穩定的**調度運行時，我敢打賭這個目標將永遠不會改變。

正如之前所提到的，可擴展性是解決調度多樣化需求挑戰的關鍵。我們不會嘗試直接在 kube-scheduler 中支持每種不同的使用場景，
而是將繼續專注於增強可擴展性，以便能夠適應各種用例。我提到的
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)
也是這一計劃的一部分。

<!--
Regarding stability, introducing new optimizations like QueueHint is one of our
strategies. Additionally, maintaining throughput is also a crucial goal towards the future. We’re
planning to enhance our throughput monitoring
([ref](https://github.com/kubernetes/kubernetes/issues/124774)), so that we can notice degradation
as much as possible on our own before releasing. But, realistically, we can't cover every possible
scenario. We highly appreciate any attention the community can give to scheduling throughput and
encourage feedback and alerts regarding performance issues!
-->
關於穩定性，引入 QueueHint 這類新的優化是我們的一項策略。
此外，保持吞吐量也是面向未來的關鍵目標。我們計劃增強我們的吞吐量監控
([參考](https://github.com/kubernetes/kubernetes/issues/124774))，
以便在發佈之前儘可能多地發現性能下降問題。但實際上，我們無法覆蓋每個可能的場景。
我們非常感謝社區對調度吞吐量的關注，鼓勵大家提出反饋，就性能問題提出警示！

<!--
## Closing Remarks

**AP: Finally, what message would you like to convey to those who are interested in learning more
about SIG Scheduling?**

**KN**: Scheduling is one of the most complicated areas in Kubernetes, and you may find it difficult
at first. But, as I shared earlier, you can find many opportunities for contributions, and many
maintainers are willing to help you understand things. We know your unique perspective and skills
are what makes our open source so powerful 😊
-->
## 結束語

**AP: 最後，你想對那些有興趣瞭解 SIG Scheduling 的人說些什麼？**

**KN**: 調度是 Kubernetes 中最複雜的領域之一，你可能一開始會覺得很困難。但正如我之前分享的，
你可以找到許多貢獻的機會，許多維護者願意幫助你理解各事項。
我們知道你獨特的視角和技能是我們的開源項目能夠如此強大的源泉 😊

<!--
Feel free to reach out to us in Slack
([#sig-scheduling](https://kubernetes.slack.com/archives/C09TP78DV)) or
[meetings](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#meetings).
I hope this article interests everyone and we can see new contributors!

**AP: Thank you so much for taking the time to do this! I'm confident that many will find this
information invaluable for understanding more about SIG Scheduling and for contributing to the SIG.**
-->
隨時可以通過 Slack ([#sig-scheduling](https://kubernetes.slack.com/archives/C09TP78DV))
或[會議](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#meetings)聯繫我們。
我希望這篇文章能引起大家的興趣，希望能吸引到新的貢獻者！

**AP: 非常感謝你抽出時間進行這次訪談！我相信很多人會發現這些信息對理解 SIG Scheduling 和參與 SIG 的貢獻非常有價值。**
