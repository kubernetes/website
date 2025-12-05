---
layout: blog
title: "聚光燈下的 SIG Instrumentation"
slug: sig-instrumentation-spotlight-2023
date: 2023-02-03
---
<!--
layout: blog
title: "Spotlight on SIG Instrumentation"
slug: sig-instrumentation-spotlight-2023
date: 2023-02-03
canonicalUrl: https://www.kubernetes.dev/blog/2023/02/03/sig-instrumentation-spotlight-2023/
-->

<!--
**Author:** Imran Noor Mohamed (Delivery Hero)
-->
**作者**: Imran Noor Mohamed (Delivery Hero)

**譯者**: [Kevin Yang](https://github.com/kevin1689-cloud)

<!--
Observability requires the right data at the right time for the right consumer
(human or piece of software) to make the right decision. In the context of Kubernetes,
having best practices for cluster observability across all Kubernetes components is crucial.
-->
可觀測性需要在合適的時間提供合適的資料，以便合適的消費者（人員或軟體）做出正確的決策。
在 Kubernetes 的環境中，擁有跨所有 Kubernetes 組件的叢集可觀測性最佳實踐是至關重要的。

<!--
SIG Instrumentation helps to address this issue by providing best practices and tools
that all other SIGs use to instrument Kubernetes components-like the *API server*,
*scheduler*, *kubelet* and *kube-controller-manager*.
-->
SIG Instrumentation 通過提供最佳實踐和工具來解決這個問題， 所有其他 SIG 都可以使用它們來對如
**API 伺服器**、**kubelet** 和 **kube-controller-manager** 這類 Kubernetes 組件進行插樁。

<!--
In this SIG Instrumentation spotlight, [Imran Noor Mohamed](https://www.linkedin.com/in/imrannoormohamed/),
SIG ContribEx-Comms tech lead talked with [Elana Hashman](https://twitter.com/ehashdn),
and [Han Kang](https://www.linkedin.com/in/hankang), chairs of SIG Instrumentation,
on how the SIG is organized, what are the current challenges and how anyone can get involved and contribute.
-->
在這次 SIG Instrumentation 採訪報道中，SIG ContribEx-Comms 技術主管 [Imran Noor Mohamed](https://www.linkedin.com/in/imrannoormohamed/)
與 SIG Instrumentation 的兩位主席 [Elana Hashman](https://twitter.com/ehashdn) 和 [Han Kang](https://www.linkedin.com/in/hankang)
討論了 SIG 的組織結構、當前的挑戰以及大家如何參與並貢獻。

<!--
## About SIG Instrumentation

**Imran (INM)**: Hello, thank you for the opportunity of learning more about SIG Instrumentation.
Could you tell us a bit about yourself, your role, and how you got involved in SIG Instrumentation?
-->
## 關於 SIG Instrumentation

**Imran (INM)**: 你好，感謝你給我這個機會進一步瞭解關於 SIG Instrumentation 的情況。
你能否介紹一下你自己、你的角色以及你是如何參與 SIG Instrumentation 的？

<!--
**Han (HK)**: I started in SIG Instrumentation in 2018, and became a chair in 2020.
I primarily got involved with SIG instrumentation due to a number of upstream issues
with metrics which ended up affecting GKE in bad ways. As a result, we ended up
launching an initiative to stabilize our metrics and make metrics a proper API.
-->
**Han (HK)**: 我在 2018 年開始參與 SIG Instrumentation，並於 2020 年成爲主席。
我參與 SIG Instrumentation 主要是因爲一些上游的指標問題對 GKE 造成了不好的影響。
因此我們發起了一個活動，目的是讓我們的指標更穩定並將這些指標打造成一個合適的 API 。

<!--
**Elana (EH)**: I also joined SIG Instrumentation in 2018 and became a chair at the
same time as Han. I was working as a site reliability engineer (SRE) on bare metal
Kubernetes clusters and was working to build out our observability stack.
I encountered some issues with label joins where Kubernetes metrics didn’t match
kube-state-metrics ([KSM](https://github.com/kubernetes/kube-state-metrics)) and
started participating in SIG meetings to improve things. I helped test performance
improvements to kube-state-metrics and ultimately coauthored a KEP for overhauling
metrics in the 1.14 release to improve usability.
-->
**Elana (EH)**: 我也是在 2018 年加入了 SIG Instrumentation，並與 Han 同時成爲主席。
當時我是一名負責裸金屬 Kubernetes 叢集的站點可靠性工程師（site reliability engineer，SRE），
致力於構建我們的可觀測性堆棧。我在標籤關聯方面遇到了一些問題，具體來說是 Kubernetes 的指標與
kube-state-metrics（[KSM](https://github.com/kubernetes/kube-state-metrics)）不匹配，
因此我開始參加 SIG 會議以改進這些方面。我幫助測試了 kube-state-metrics 的性能改進，
並最終共同撰寫了一個關於在 1.14 版本中徹底改進指標以提高其可用性的 KEP 提案。

<!--
**Imran (INM)**: Interesting! Does that mean SIG Instrumentation involves a lot of plumbing?
-->
**Imran (INM)**: 有趣！這是否意味着 SIG Instrumentation 涉及很多的鑽研工作？

<!--
**Han (HK)**: I wouldn’t say it involves a ton of plumbing, though it does touch
basically every code base. We have our own dedicated directories for our metrics,
logs, and tracing frameworks which we tend to work out of primarily. We do have to
interact with other SIGs in order to propagate our changes which makes us more of
a horizontal SIG.
-->
**Han (HK)**: 我不會說它涉及大量的鑽研工作，但它確實觸及了基本上每個代碼庫。
我們有專門的目錄用於我們的 metrics、logs 和 tracing 框架，這些是我們要完成的主要工作。
我們必須與其他 SIG 進行互動以推動我們的變更，這使我們更加成爲一個橫向的 SIG。

<!--
**Imran (INM)**: Speaking about interaction and coordination with other SIG could
you describe how the SIGs is organized?
-->
**Imran (INM)**: 談到與其他 SIG 的互動和協調，你能描述一下 SIG 是如何組織的嗎？

<!--
**Elana (EH)**: In SIG Instrumentation, we have two chairs, Han and myself, as well
as two tech leads, David Ashpole and Damien Grisonnet. We all work together as the
SIG’s leads in order to run meetings, triage issues and PRs, review and approve KEPs,
plan for each release, present at KubeCon and community meetings, and write our annual
report. Within the SIG we also have a number of important subprojects, each of which is
stewarded by its subproject owners. For example, Marek Siarkowicz is a subproject owner
of [metrics-server](https://github.com/kubernetes-sigs/metrics-server).
-->
**Elana (EH)**: 在 SIG Instrumentation 中，我們有兩位主席：Han 和我自己，還有兩位技術負責人：
David Ashpole 和 Damien Grisonnet。作爲 SIG 的領導者，我們一起工作，負責組織會議、分類問題和
PR、審查和批准 KEP、規劃每個發佈版本、在 KubeCon 和社區會議上演講，以及撰寫我們的年度報告。
在 SIG 內部，我們還有許多重要的子項目，每個子項目都有負責人來指導。例如，Marek Siarkowicz 是
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) 這個子項目的負責人。

<!--
Because we’re a horizontal SIG, some of our projects have a wide scope and require
coordination from a dedicated group of contributors. For example, in order to guide
the Kubernetes migration to structured logging, we chartered the
[Structured Logging](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md)
Working Group (WG), organized by Marek and Patrick Ohly. The WG doesn’t own any code,
but helps with various components such as the *kubelet*, *scheduler*, etc. in migrating
their code to use structured logs.
-->
由於我們是一個橫向的 SIG，我們的一些項目的牽涉面很廣，需要由一組專門的貢獻者來協調。
例如，爲了指導 Kubernetes 向結構化日誌的遷移，我們成立了由 Marek 和 Patrick Ohly 組織的
[Structured Logging](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md)
工作組（Working Group，WG）。這個工作組沒有自己的代碼，但會幫助各個組件（如 **kubelet**、**scheduler**
等）遷移它們的代碼以使用結構化日誌。

<!--
**Imran (INM)**: Walking through the
[charter](https://github.com/kubernetes/community/blob/master/sig-instrumentation/charter.md)
alone it’s clear that SIG Instrumentation has a lot of sub-projects.
Could you highlight some important ones?
-->
**Imran (INM)**: 從章程（[charter](https://github.com/kubernetes/community/blob/master/sig-instrumentation/charter.md)）來看，
SIG Instrumentation 顯然有許多子項目。你能重點說一下其中一些重要的項目嗎？

<!--
**Han (HK)**: We have many different sub-projects and we are in dire need of
people who can come and help shepherd them. Our most important projects in-tree
(that is, within the kubernetes/kubernetes repo) are metrics, tracing, and,
structured logging. Our most important projects out-of-tree are
(a) KSM (kube-state-metrics) and (b) metrics-server.
-->
**Han (HK)**: 我們有許多不同的子項目，我們急需能夠來協助推動它們的人員。我們最重要的樹內（in-tree）項目（即在
kubernetes/kubernetes 代碼倉庫中）是 metrics、tracing 和 structured logging。
我們最重要的樹外（out-of-tree）項目是：（a）KSM（kube-state-metrics）和（b）metrics-server。

<!--
**Elana (EH)**: Echoing this, we would love to bring on more maintainers for
kube-state-metrics and metrics-server. Our friends at WG Structured Logging are
also looking for contributors. Other subprojects include klog, prometheus-adapter,
and a new subproject that we just launched for collecting high-fidelity, scalable
utilization metrics called [usage-metrics-collector](https://github.com/kubernetes-sigs/usage-metrics-collector).
All are seeking new contributors!
-->
**Elana (EH)**: 與上面所說的相呼應，我們希望爲 kube-state-metrics 和 metrics-server
引入更多的維護者。我們在 Structure Logging 工作組的朋友也在尋找貢獻者。其他子項目包括 klog、prometheus-Adapter，
以及我們剛剛啓動的一個用於收集高保真度、可伸縮利用率指標的新子項目，稱爲
[usage-metrics-collector](https://github.com/kubernetes-sigs/usage-metrics-collector)
，它們都在尋找新的貢獻者！

<!--
## Current status and ongoing challenges

**Imran (INM)**: For release [1.26](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.26)
we can see that there are a relevant number of metrics, logs, and tracing
[KEPs](https://www.k8s.dev/resources/keps/) in the pipeline. Would you like to
point out important things for last release (maybe alpha & stable milestone candidates?)
-->
## 現狀和持續的挑戰

**Imran (INM)**: 在 [1.26](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.26)
版本中，我們可以在流水線中看到有相當數量的關於 metrics、logs 和 tracing 方面的
[KEPs](https://www.k8s.dev/resources/keps/)。您可否談談上個版本中的重要事項
（例如 alpha 和 stable 里程碑的候選項？）

<!--
**Han (HK)**: We can now generate [documentation](https://kubernetes.io/docs/reference/instrumentation/metrics/)
for every single metric in the main Kubernetes code base! We have a pretty fancy
static analysis pipeline that enables this functionality. We’ve also added feature
metrics so that you can look at your metrics to determine which features are enabled
in your cluster at a given time. Lastly, we added a component-sli endpoint, which
should make it easy for people to create availability SLOs for *control-plane* components.
-->
**Han (HK)**: 現在我們可以爲 Kubernetes 的 main 代碼庫中的所有監控指標生成[文檔](https://kubernetes.io/docs/reference/instrumentation/metrics/)！
我們有一個相當不錯的靜態分析流水線，使這一功能成爲可能。
我們還添加了 feature 指標，這樣你可以查看這個指標來確定在給定時間內叢集中啓用了哪些特性。
最後，我們添加了一個 component-sli 端點，它應該使人們爲**控制平面（control-plane）**
組件制定可用性 SLOs 變得容易。

<!--
**Elana (EH)**: We’ve also been working on tracing KEPs for both the *API server*
and *kubelet*, though neither graduated in 1.26. I’m also really excited about the
work Han is doing with WG Reliability to extend and improve our metrics stability framework.
-->
**Elana (EH)**: 我們還在做關於 **API 伺服器** 和 **kubelet** 的 tracing 方面的 KEPs 工作，
儘管它們都沒有在 1.26 版本中畢業。我對於 Han 與可靠性工作組合作，來擴展和改進我們的指標穩定性框架的工作也感到非常興奮。

<!--
**Imran (INM)**: What do you think are the Kubernetes-specific challenges tackled by
the SIG Instrumentation? What are the future efforts to solve them?
-->
**Imran (INM)**: 您認爲 SIG Instrumentation 所應對的 Kubernetes 特有挑戰有哪些？未來打算如何來解決它們？

<!--
**Han (HK)**:  SIG instrumentation suffered a bit in the past from being a horizontal SIG.
We did not have an obvious location to put our code and did not have a good mechanism to
audit metrics that people would randomly add. We’ve fixed this over the years and now we
have dedicated spots for our code and a reliable mechanism for auditing new metrics.
We also now offer stability guarantees for metrics. We hope to have full-blown tracing
up and down the kubernetes stack, and metric support via exemplars.
-->
**Han (HK)**: SIG Instrumentation 作爲一個橫向的 SIG 曾經遇到一些困難，我們沒有明確的位置來存放我們的代碼，
也沒有一個良好的機制來審覈隨意添加的指標。經過多年努力我們已經解決了這個問題，現在我們有了專門的代碼存放位置，
並且有可靠的機制來審覈新的指標。我們現在還爲指標提供穩定性保證。我們希望在 Kubernetes 堆棧上下游進行全面的跟蹤，
並通過示例提供指標支持。

<!--
**Elana (EH)**: I think SIG Instrumentation is a really interesting SIG because it
poses different kinds of opportunities to get involved than in other SIGs. You don’t
have to be a software developer to contribute to our SIG! All of our components and
subprojects are focused on better understanding Kubernetes and its performance in
production, which allowed me to get involved as one of the few SIG Chairs working as
an SRE at that time. I like that we provide opportunities for newcomers to contribute
through using, testing, and providing feedback on our subprojects, which is a lower
barrier to entry. Because many of these projects are out-of-tree, I think one of our
challenges is to figure out what’s in scope for core Kubernetes SIGs instrumentation
subprojects, what’s missing, and then fill in the gaps.
-->
**Elana (EH)**: 我認爲 SIG Instrumentation 是一個非常有趣的 SIG，因爲與其他 SIG
相比，它提供了不同類型的參與機會。您不必是一名軟體開發人員就可以爲我們的 SIG 做出貢獻！
我們的所有組件和子項目都專注於更好地瞭解 Kubernetes 及其在生產環境中的性能，
這也使得我當時能參與進來併成爲少數幾個 SRE 身份的 SIG 主席。
我喜歡我們通過使用、測試和提供反饋意見的方式來爲新人提供貢獻機會，這降低了加入的門檻。
由於這些項目中許多都是 out-of-tree 的，我認爲我們面臨的挑戰之一是確定 Kubernetes 核心
SIGs Instrumentation 子項目的範圍並找出缺失的部分，然後填補這些空白。

<!--
## Community and contribution

**Imran (INM)**: Kubernetes values community over products. Any recommendation
for anyone looking into getting involved in SIG Instrumentation work? Where
should they start (new contributor-friendly areas within SIG?)
-->
## 社區和貢獻

**Imran (INM)**: Kubernetes 重視社區勝過重視產品。如果有人想參與 SIG Instrumentation 的工作，
您有什麼建議？他們應該從哪裏開始（在 SIG 中適合新貢獻者的領域？）

<!--
**Han(HK) and Elana (EH)**: Come to our bi-weekly triage
[meetings](https://github.com/kubernetes/community/tree/master/sig-instrumentation#meetings)!
They aren’t recorded and are a great place to ask questions and learn about our ongoing work.
We strive to be a friendly community and one of the easiest SIGs to get started with.
You can check out our latest KubeCon NA 2022 [SIG Instrumentation Deep Dive](https://youtu.be/JIzrlWtAA8Y)
to get more insight into our work. We also invite you to join our Slack channel #sig-instrumentation
and feel free to reach out to any of our SIG leads or subproject owners directly.
-->
**Han(HK) and Elana (EH)**: 參加我們的雙週分類[會議](https://github.com/kubernetes/community/tree/master/sig-instrumentation#meetings)！
這些會議不會被錄製，它們是一個很好的提問的地方並可以瞭解我們正在進行的工作。我們致力於打造一個友好的社區，
同時也是最容易入門的 SIG 之一。你可以查看我們最新的 KubeCon NA 2022 [SIG Instrumentation Deep Dive](https://youtu.be/JIzrlWtAA8Y)，
以更深入地瞭解我們的工作。我們還邀請你加入我們的 Slack 頻道 #sig-instrumentation，並隨時與我們的
SIG 負責人或子項目所有者直接聯繫。

<!--
Thank you so much for your time and insights into the workings of SIG Instrumentation!
-->
非常感謝你抽出寶貴時間並深入瞭解了 SIG Instrumentation 的工作！