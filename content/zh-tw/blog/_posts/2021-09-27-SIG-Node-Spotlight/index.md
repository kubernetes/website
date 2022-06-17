---
layout: blog
title: "關注 SIG Node"
date: 2021-09-27
slug: sig-node-spotlight-2021
---
<!--
---
layout: blog
title: "Spotlight on SIG Node"
date: 2021-09-27
slug: sig-node-spotlight-2021
--- 
-->
**Author:** Dewan Ahmed, Red Hat
<!--
**Author:** Dewan Ahmed, Red Hat
-->

<!--
## Introduction

In Kubernetes, a _Node_ is a representation of a single machine in your cluster. [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) owns that very important Node component and supports various subprojects such as Kubelet, Container Runtime Interface (CRI) and more to support how the pods and host resources interact. In this blog, we have summarized our conversation with [Elana Hashman (EH)](https://twitter.com/ehashdn) & [Sergey Kanzhelev (SK)](https://twitter.com/SergeyKanzhelev), who walk us through the various aspects of being a part of the SIG and share some insights about how others can get involved.
-->

## 介紹

在 Kubernetes 中，一個 _Node_ 是你叢集中的某臺機器。
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 負責這一非常重要的 Node 元件並支援各種子專案，
如 Kubelet, Container Runtime Interface (CRI) 以及其他支援 Pod 和主機資源間互動的子專案。
在這篇文章中，我們總結了和 [Elana Hashman (EH)](https://twitter.com/ehashdn) & [Sergey Kanzhelev (SK)](https://twitter.com/SergeyKanzhelev) 的對話，是他們帶領我們瞭解作為此 SIG 一份子的各個方面，並分享一些關於其他人如何參與的見解。

<!--
## A summary of our conversation

### Could you tell us a little about what SIG Node does?

SK: SIG Node is a vertical SIG responsible for the components that support the controlled interactions between the pods and host resources. We manage the lifecycle of pods that are scheduled to a node. This SIG's focus is to enable a broad set of workload types, including workloads with hardware specific or performance sensitive requirements. All while maintaining isolation boundaries between pods on a node, as well as the pod and the host. This SIG maintains quite a few components and has many external dependencies (like container runtimes or operating system features), which makes the complexity we deal with huge. We tame the complexity and aim to continuously improve node reliability.
-->
## 我們的對話總結

### 你能告訴我們一些關於 SIG Node 的工作嗎？

SK：SIG Node 是一個垂直 SIG，負責支援 Pod 和主機資源之間受控互動的元件。我們管理被排程到節點上的 Pod 的生命週期。
這個 SIG 的重點是支援廣泛的工作負載型別，包括具有硬體特性或效能敏感要求的工作負載。同時保持節點上 Pod 之間的隔離邊界，以及 Pod 和主機的隔離邊界。
這個 SIG 維護了相當多的元件，並有許多外部依賴（如容器執行時間或作業系統功能），這使得我們處理起來十分複雜。但我們戰勝了這種複雜度，旨在不斷提高節點的可靠性。

<!--
### "SIG Node is a vertical SIG" could you explain a bit more?

EH: There are two kinds of SIGs: horizontal and vertical. Horizontal SIGs are concerned with a particular function of every component in Kubernetes: for example, SIG Security considers security aspects of every component in Kubernetes, or SIG Instrumentation looks at the logs, metrics, traces and events of every component in Kubernetes. Such SIGs don't tend to own a lot of code.

Vertical SIGs, on the other hand, own a single component, and are responsible for approving and merging patches to that code base. SIG Node owns the "Node" vertical, pertaining to the kubelet and its lifecycle. This includes the code for the kubelet itself, as well as the node controller, the container runtime interface, and related subprojects like the node problem detector. 
-->
### 你能再解釋一下 “SIG Node 是一種垂直 SIG” 的含義嗎？

EH：有兩種 SIG：橫向和垂直。橫向 SIG 關注 Kubernetes 中每個元件的特定功能：例如，SIG Security 考慮 Kubernetes 中每個元件的安全方面，或者 SIG Instrumentation 關注 Kubernetes 中每個元件的日誌、度量、跟蹤和事件。
這樣的 SIG 並不太會擁有大量的程式碼。

相反，垂直 SIG 擁有一個單一的元件，並負責批准和合並該程式碼庫的補丁。
SIG Node 擁有 "Node" 的垂直性，與 kubelet 和它的生命週期有關。這包括 kubelet 本身的程式碼，以及節點控制器、容器執行時介面和相關的子專案，比如節點問題檢測器。

<!--
### How did the CI subproject start? Is this specific to SIG Node and how does it help the SIG?

SK: The subproject started as a follow up after one of the releases was blocked by numerous test failures of critical tests. These tests haven’t started falling all at once, rather continuous lack of attention led to slow degradation of tests quality. SIG Node was always prioritizing quality and reliability, and forming of the subproject was a way to highlight this priority.
-->
### CI 子專案是如何開始的？這是專門針對 SIG Node 的嗎？它對 SIG 有什麼幫助？

SK：該子專案是在其中一個版本因關鍵測試的大量測試失敗而受阻後開始跟進的。
這些測試並不是一下子就開始下降的，而是持續的缺乏關注導致了測試質量的緩慢下降。
SIG Node 一直將質量和可靠性放在首位，組建這個子專案是強調這一優先事項的一種方式。

<!--
### As the 3rd largest SIG in terms of number of issues and PRs, how does your SIG juggle so much work?

EH: It helps to be organized. When I increased my contributions to the SIG in January of 2021, I found myself overwhelmed by the volume of pull requests and issues and wasn't sure where to start. We were already tracking test-related issues and pull requests on the CI subproject board, but that was missing a lot of our bugfixes and feature work. So I began putting together a triage board for the rest of our pull requests, which allowed me to sort each one by status and what actions to take, and documented its use for other contributors. We closed or merged over 500 issues and pull requests tracked by our two boards in each of the past two releases. The Kubernetes devstats showed that we have significantly increased our velocity as a result.

In June, we ran our first bug scrub event to work through the backlog of issues filed against SIG Node, ensuring they were properly categorized. We closed over 130 issues over the course of this 48 hour global event, but as of writing we still have 333 open issues. 
-->
### 作為 issue 和 PR 數量第三大的 SIG，你們 SIG 是如何兼顧這麼多工作的？

EH：這歸功於有組織性。當我在 2021 年 1 月增加對 SIG 的貢獻時，我發現自己被大量的 PR 和 issue 淹沒了，不知道該從哪裡開始。
我們已經在 CI 子專案板上跟蹤與測試有關的 issue 和 PR 請求，但這缺少了很多 bug 修復和功能工作。
因此，我開始為我們剩餘的 PR 建立一個分流板，這使我能夠根據狀態和採取的行動對其進行分類，併為其他貢獻者記錄它的用途。
在過去的兩個版本中，我們關閉或合併了超過 500 個 issue 和 PR。Kubernetes devstats 顯示，我們的速度因此而大大提升。

6月，我們進行了第一次 bug 清除活動，以解決針對 SIG Node 的積壓問題，確保它們被正確歸類。
在這次 48 小時的全球活動中，我們關閉了 130 多個問題，但截至發稿時，我們仍有 333 個問題沒有解決。
<!--
### Why should new and existing contributors consider joining SIG Node?

SK: Being a SIG Node contributor gives you skills and recognition that are rewarding and useful. Understanding under the hood of a kubelet helps architecting better apps, tune and optimize those apps, and gives leg up in issues troubleshooting. If you are a new contributor, SIG Node gives you the foundational knowledge that is key to understanding why other Kubernetes components are designed the way they are. Existing contributors may benefit as many features will require SIG Node changes one way or another. So being a SIG Node contributor helps building features in other SIGs faster.

SIG Node maintains numerous components, many of which have dependency on external projects or OS features. This makes the onboarding process quite lengthy and demanding. But if you are up for a challenge, there is always a place for you, and a group of people to support. 
-->
### 為什麼新的和現有的貢獻者應該考慮加入 Node 興趣小組呢？

SK：作為 SIG Node 的貢獻者會帶給你有意義且有用的技能和認可度。
瞭解 Kubelet 的內部結構有助於構建更好的應用程式，調整和最佳化這些應用程式，並在 issue 排查上獲得優勢。
如果你是一個新手貢獻者，SIG Node 為你提供了基礎知識，這是理解其他 Kubernetes 元件的設計方式的關鍵。
現在的貢獻者可能會受益於許多功能都需要 SIG Node 的這種或那種變化。所以成為 SIG Node 的貢獻者有助於更快地建立其他 SIG 的功能。

SIG Node 維護著許多元件，其中許多元件都依賴於外部專案或作業系統功能。這使得入職過程相當冗長和苛刻。
但如果你願意接受挑戰，總有一個地方適合你，也有一群人支援你。
<!--
### What do you do to help new contributors get started?

EH: Getting started in SIG Node can be intimidating, since there is so much work to be done, our SIG meetings are very large, and it can be hard to find a place to start.

I always encourage new contributors to work on things that they have some investment in already. In SIG Node, that might mean volunteering to help fix a bug that you have personally been affected by, or helping to triage bugs you care about by priority.

To come up to speed on any open source code base, there are two strategies you can take: start by exploring a particular issue deeply, and follow that to expand the edges of your knowledge as needed, or briefly review as many issues and change requests as you possibly can to get a higher level picture of how the component works. Ultimately, you will need to do both if you want to become a Node reviewer or approver.

[Davanum Srinivas](https://twitter.com/dims) and I each ran a cohort of group mentoring to help teach new contributors the skills to become Node reviewers, and if there's interest we can work to find a mentor to run another session. I also encourage new contributors to attend our Node CI Subproject meeting: it's a smaller audience and we don't record the triage sessions, so it can be a less intimidating way to get started with the SIG. 
-->
###  你是如何幫助新手貢獻者開始工作的？

EH：在 SIG Node 的起步工作可能是令人生畏的，因為有太多的工作要做，我們的 SIG 會議非常大，而且很難找到一個開始的地方。

我總是鼓勵新手貢獻者在他們已經有一些投入的方向上更進一步。
在 SIG Node 中，這可能意味著自願幫助修復一個隻影響到你個人的 bug，或者按優先順序去分流你關心的 bug。

為了儘快瞭解任何開原始碼庫，你可以採取兩種策略：從深入探索一個特定的問題開始，然後根據需要擴充套件你的知識邊緣，或者單純地儘可能多的審查 issues 和變更請求，以瞭解更高層次的元件工作方式。
最終，如果你想成為一名 Node reviewer 或 approver，兩件事是不可避免的。

[Davanum Srinivas](https://twitter.com/dims) 和我各自舉辦了一次小組輔導，以幫助教導新手貢獻者成為 Node reviewer 的技能，如果有興趣，我們可以努力尋找一個導師來舉辦另一次會議。
我也鼓勵新手貢獻者參加我們的 Node CI 子專案會議：它的聽眾較少，而且我們不記錄分流會議，所以它可以是一個比較溫和的方式來開始 SIG 之旅。
<!--
### Are there any particular skills you’d like to recruit for? What skills are contributors to SIG Usability likely to learn?

SK: SIG Node works on many workstreams in very different areas. All of these areas are on system level. For the typical code contributions you need to have a passion for building and utilizing low level APIs and writing performant and reliable components. Being a contributor you will learn how to debug and troubleshoot, profile, and monitor these components, as well as user workload that is run by these components. Often, with the limited to no access to Nodes, as they are running production workloads.

The other way of contribution is to help document SIG node features. This type of contribution requires a deep understanding of features, and ability to explain them in simple terms.

Finally, we are always looking for feedback on how best to run your workload. Come and  explain specifics of it, and what features in SIG Node components may help to run it better. 
-->
### 有什麼特別的技能者是你想招募的嗎？對 SIG 可用性的貢獻者可能會學到什麼技能？

SK：SIG Node 在大相徑庭的領域從事許多工作流。所有這些領域都是系統級的。
對於典型的程式碼貢獻，你需要對建立和善用低級別的 API 以及編寫高效能和可靠的元件有熱情。
作為一個貢獻者，你將學習如何除錯和排除故障，剖析和監控這些元件，以及由這些元件執行的使用者工作負載。
通常情況下，由於節點正在執行生產工作負載，所以對節點的訪問是有限的，甚至是沒有的。

另一種貢獻方式是幫助記錄 SIG Node 的功能。這種型別的貢獻需要對功能有深刻的理解，並有能力用簡單的術語解釋它們。

最後，我們一直在尋找關於如何最好地執行你的工作負載的反饋。來解釋一下它的具體情況，以及 SIG Node 元件中的哪些功能可能有助於更好地執行它。
<!--
### What are you getting positive feedback on, and what’s coming up next for SIG Node?

EH: Over the past year SIG Node has adopted some new processes to help manage our feature development and Kubernetes enhancement proposals, and other SIGs have looked to us for inspiration in managing large workloads. I hope that this is an area we can continue to provide leadership in and further iterate on.

We have a great balance of new features and deprecations in flight right now. Deprecations of unused or difficult to maintain features help us keep technical debt and maintenance load under control, and examples include the dockershim and DynamicKubeletConfiguration deprecations. New features will unlock additional functionality in end users' clusters, and include exciting features like support for cgroups v2, swap memory, graceful node shutdowns, and device management policies.
-->
### 你在哪些方面得到了積極的反饋，以及 SIG Node 的下一步計劃是什麼？

EH：在過去的一年裡，SIG Node 採用了一些新的流程來幫助管理我們的功能開發和 Kubernetes 增強提議，其他 SIG 也向我們尋求在管理大型工作負載方面的靈感。
我希望這是一個我們可以繼續領導並進一步迭代的領域。

現在，我們在新功能和廢棄功能之間保持了很好的平衡。
廢棄未使用或難以維護的功能有助於我們控制技術債務和維護負荷，例子包括 dockershim 和 DynamicKubeletConfiguration 的廢棄。
新功能將在終端使用者的叢集中釋放更多的功能，包括令人興奮的功能，如支援 cgroups v2、交換記憶體、優雅的節點關閉和裝置管理策略。
<!--
### Any closing thoughts/resources you’d like to share?

SK/EH: It takes time and effort to get to any open source community. SIG Node may overwhelm you at first with the number of participants, volume of work, and project scope. But it is totally worth it. Join our welcoming community! [SIG Node GitHub Repo](https://github.com/kubernetes/community/tree/master/sig-node) contains many useful resources including Slack, mailing list and other contact info. 
-->
### 最後你有什麼想法/資源要分享嗎？

SK/EH：進入任何開源社群都需要時間和努力。一開始 SIG Node 可能會因為參與者的數量、工作量和專案範圍而讓你不知所措。但這是完全值得的。
請加入我們這個熱情的社群! [SIG Node GitHub Repo]（https://github.com/kubernetes/community/tree/master/sig-node）包含許多有用的資源，包括 Slack、郵件列表和其他聯絡資訊。
<!--
## Wrap Up

SIG Node hosted a [KubeCon + CloudNativeCon Europe 2021 talk](https://www.youtube.com/watch?v=z5aY4e2RENA) with an intro and deep dive to their awesome SIG. Join the SIG's meetings to find out about the most recent research results, what the plans are for the forthcoming year, and how to get involved in the upstream Node team as a contributor!
-->
## 總結

SIG Node 舉辦了一場 [KubeCon + CloudNativeCon Europe 2021 talk](https://www.youtube.com/watch?v=z5aY4e2RENA)，對他們強大的 SIG 進行了介紹和深入探討。
加入 SIG 的會議，瞭解最新的研究成果，未來一年的計劃是什麼，以及如何作為貢獻者參與到上游的 Node 團隊中!