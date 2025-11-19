---
layout: blog
title: 'Kubernetes 1.18: Fit & Finish'
date: 2020-03-25
slug: kubernetes-1-18-release-announcement
evergreen: true
---

<!--
**Authors:** [Kubernetes 1.18 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md)
-->
**作者:** [Kubernetes 1.18 發佈團隊](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md)

<!--
We're pleased to announce the delivery of Kubernetes 1.18, our first release of 2020! Kubernetes 1.18 consists of 38 enhancements: 15 enhancements are moving to stable, 11 enhancements in beta, and 12 enhancements in alpha.
-->
我們很高興宣佈 Kubernetes 1.18 版本的交付，這是我們 2020 年的第一版！Kubernetes
1.18 包含 38 個增強功能：15 項增強功能已轉爲穩定版，11 項增強功能處於 beta
階段，12 項增強功能處於 alpha 階段。

<!--
Kubernetes 1.18 is a "fit and finish" release. Significant work has gone into improving beta and stable features to ensure users have a better experience. An equal effort has gone into adding new developments and exciting new features that promise to enhance the user experience even more.
-->
Kubernetes 1.18 是一個近乎 “完美” 的版本。爲了改善 beta 和穩定的特性，已進行了大量工作，
以確保使用者獲得更好的體驗。我們在增強現有功能的同時也增加了令人興奮的新特性，這些有望進一步增強使用者體驗。

<!--
Having almost as many enhancements in alpha, beta, and stable is a great achievement. It shows the tremendous effort made by the community on improving the reliability of Kubernetes as well as continuing to expand its existing functionality.
-->
對 alpha、beta 和穩定版進行幾乎同等程度的增強是一項偉大的成就。它展現了社區在提高
Kubernetes 的可靠性以及繼續擴展其現有功能方面所做的巨大努力。


<!--
## Major Themes
-->
## 主要內容

<!--
### Kubernetes Topology Manager Moves to Beta - Align Up!
-->
### Kubernetes 拓撲管理器（Topology Manager）進入 Beta 階段 - 對齊！

<!--
A beta feature of Kubernetes in release 1.18,  the [Topology Manager feature](https://github.com/nolancon/website/blob/f4200307260ea3234540ef13ed80de325e1a7267/content/en/docs/tasks/administer-cluster/topology-manager.md) enables NUMA alignment of CPU and devices (such as SR-IOV VFs) that will allow your workload to run in an environment optimized for low-latency. Prior to the introduction of the Topology Manager, the CPU and Device Manager would make resource allocation decisions independent of each other. This could result in undesirable allocations on multi-socket systems, causing degraded performance on latency critical applications.
-->
Kubernetes 在 1.18 版中的 Beta 階段功能[拓撲管理器特性](https://github.com/nolancon/website/blob/f4200307260ea3234540ef13ed80de325e1a7267/content/en/docs/tasks/administer-cluster/topology-manager.md)啓用
CPU 和設備（例如 SR-IOV VF）的 NUMA 對齊，這將使你的工作負載在針對低延遲而優化的環境中運行。
在引入拓撲管理器之前，CPU 和設備管理器將做出彼此獨立的資源分配決策。
這可能會導致在多處理器系統上非預期的資源分配結果，從而導致對延遲敏感的應用程序的性能下降。

<!--
### Serverside Apply Introduces Beta 2
-->
### Serverside Apply 推出 Beta 2

<!--
Server-side Apply was promoted to Beta in 1.16, but is now introducing a second Beta in 1.18. This new version will track and manage changes to fields of all new Kubernetes objects, allowing you to know what changed your resources and when.
-->
Serverside Apply 在1.16 中進入 Beta 階段，但現在在 1.18 中進入了第二個 Beta 階段。
這個新版本將跟蹤和管理所有新 Kubernetes 對象的字段更改，從而使你知道什麼更改了資源以及何時發生了更改。


<!--
### Extending Ingress with and replacing a deprecated annotation with IngressClass
-->
### 使用 IngressClass 擴展 Ingress 並用 IngressClass 替換已棄用的註釋

<!--
In Kubernetes 1.18, there are two significant additions to Ingress: A new `pathType` field and a new `IngressClass` resource. The `pathType` field allows specifying how paths should be matched. In addition to the default `ImplementationSpecific` type, there are new `Exact` and `Prefix` path types. 
-->
在 Kubernetes 1.18 中，Ingress 有兩個重要的補充：一個新的 `pathType` 字段和一個新的
`IngressClass` 資源。`pathType` 字段允許指定路徑的匹配方式。除了默認的
`ImplementationSpecific` 類型外，還有新的 `Exact` 和 `Prefix` 路徑類型。

<!--
The `IngressClass` resource is used to describe a type of Ingress within a Kubernetes cluster. Ingresses can specify the class they are associated with by using a new `ingressClassName` field on Ingresses. This new resource and field replace the deprecated `kubernetes.io/ingress.class` annotation.
-->
`IngressClass` 資源用於描述 Kubernetes 叢集中 Ingress 的類型。Ingress 對象可以通過在
Ingress 資源類型上使用新的 `ingressClassName` 字段來指定與它們關聯的類。
這個新的資源和字段替換了不再建議使用的 `kubernetes.io/ingress.class` 註解。

<!--
### SIG-CLI introduces kubectl alpha debug
-->
### SIG-CLI 引入了 kubectl alpha debug

<!--
SIG-CLI was debating the need for a debug utility for quite some time already. With the development of [ephemeral containers](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/), it became more obvious how we can support developers with tooling built on top of `kubectl exec`. The addition of the [`kubectl alpha debug` command](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/20190805-kubectl-debug.md) (it is alpha but your feedback is more than welcome), allows developers to easily debug their Pods inside the cluster. We think this addition is invaluable.  This command allows one to create a temporary container which runs next to the Pod one is trying to examine, but also attaches to the console for interactive troubleshooting.
-->
SIG-CLI 一直在爭論着調試工具的必要性。隨着[臨時容器](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/)的發展，
我們如何使用基於 `kubectl exec` 的工具來支持開發人員的必要性變得越來越明顯。
[`kubectl alpha debug` 命令](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/20190805-kubectl-debug.md)的增加，
（由於是 alpha 階段，非常歡迎你反饋意見），使開發人員可以輕鬆地在叢集中調試 Pod。
我們認爲這個功能的價值非常高。此命令允許創建一個臨時容器，該容器在要嘗試檢查的
Pod 旁邊運行，並且還附加到控制檯以進行交互式故障排除。

<!--
### Introducing Windows CSI support alpha for Kubernetes
-->
### 爲 Kubernetes 引入 Windows CSI 支持（Alpha）

<!--
The alpha version of CSI Proxy for Windows is being released with Kubernetes 1.18. CSI proxy enables CSI Drivers on Windows by allowing containers in Windows to perform privileged storage operations.
-->
用於 Windows 的 CSI 代理的 Alpha 版本隨 Kubernetes 1.18 一起發佈。CSI 代理通過允許
Windows 中的容器執行特權存儲操作來啓用 Windows 上的 CSI 驅動程序。

<!--
## Other Updates
-->
## 其它更新

<!--
### Graduated to Stable 💯
-->
### 畢業轉爲穩定版

<!--
- [Taint Based Eviction](https://github.com/kubernetes/enhancements/issues/166)
- [`kubectl diff`](https://github.com/kubernetes/enhancements/issues/491)
- [CSI Block storage support](https://github.com/kubernetes/enhancements/issues/565)
- [API Server dry run](https://github.com/kubernetes/enhancements/issues/576)
- [Pass Pod information in CSI calls](https://github.com/kubernetes/enhancements/issues/603)
- [Support Out-of-Tree vSphere Cloud Provider](https://github.com/kubernetes/enhancements/issues/670)
- [Support GMSA for Windows workloads](https://github.com/kubernetes/enhancements/issues/689)
- [Skip attach for non-attachable CSI volumes](https://github.com/kubernetes/enhancements/issues/770)
- [PVC cloning](https://github.com/kubernetes/enhancements/issues/989)
- [Moving kubectl package code to staging](https://github.com/kubernetes/enhancements/issues/1020)
- [RunAsUserName for Windows](https://github.com/kubernetes/enhancements/issues/1043)
- [AppProtocol for Services and Endpoints](https://github.com/kubernetes/enhancements/issues/1507)
- [Extending Hugepage Feature](https://github.com/kubernetes/enhancements/issues/1539)
- [client-go signature refactor to standardize options and context handling](https://github.com/kubernetes/enhancements/issues/1601)
- [Node-local DNS cache](https://github.com/kubernetes/enhancements/issues/1024)
-->
- [基於污點的逐出操作](https://github.com/kubernetes/enhancements/issues/166)
- [`kubectl diff`](https://github.com/kubernetes/enhancements/issues/491)
- [CSI 塊存儲支持](https://github.com/kubernetes/enhancements/issues/565)
- [API 伺服器 dry run](https://github.com/kubernetes/enhancements/issues/576)
- [在 CSI 調用中傳遞 Pod 信息](https://github.com/kubernetes/enhancements/issues/603)
- [支持樹外 vSphere 雲驅動](https://github.com/kubernetes/enhancements/issues/670)
- [對 Windows 負載支持 GMSA](https://github.com/kubernetes/enhancements/issues/689)
- [對不可掛載的CSI卷跳過掛載](https://github.com/kubernetes/enhancements/issues/770)
- [PVC 克隆](https://github.com/kubernetes/enhancements/issues/989)
- [移動 kubectl 包代碼到 staging](https://github.com/kubernetes/enhancements/issues/1020)
- [Windows 的 RunAsUserName](https://github.com/kubernetes/enhancements/issues/1043)
- [服務和端點的 AppProtocol](https://github.com/kubernetes/enhancements/issues/1507)
- [擴展 Hugepage 特性](https://github.com/kubernetes/enhancements/issues/1539)
- [client-go signature refactor to standardize options and context handling](https://github.com/kubernetes/enhancements/issues/1601)
- [Node-local DNS cache](https://github.com/kubernetes/enhancements/issues/1024)


<!--
### Major Changes
-->
### 主要變化

<!--
- [EndpointSlice API](https://github.com/kubernetes/enhancements/issues/752)
- [Moving kubectl package code to staging](https://github.com/kubernetes/enhancements/issues/1020)
- [CertificateSigningRequest API](https://github.com/kubernetes/enhancements/issues/1513)
- [Extending Hugepage Feature](https://github.com/kubernetes/enhancements/issues/1539)
- [client-go signature refactor to standardize options and context handling](https://github.com/kubernetes/enhancements/issues/1601)
-->
- [EndpointSlice API](https://github.com/kubernetes/enhancements/issues/752)
- [Moving kubectl package code to staging](https://github.com/kubernetes/enhancements/issues/1020)
- [CertificateSigningRequest API](https://github.com/kubernetes/enhancements/issues/1513)
- [Extending Hugepage Feature](https://github.com/kubernetes/enhancements/issues/1539)
- [client-go 的調用規範重構來標準化選項和管理上下文](https://github.com/kubernetes/enhancements/issues/1601)


<!--
### Release Notes
-->
### 發佈說明

<!--
Check out the full details of the Kubernetes 1.18 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md).
-->
在我們的[發佈文檔](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md)中查看
Kubernetes 1.18 發行版的完整詳細信息。


<!--
### Availability
-->
### 下載安裝

<!--
Kubernetes 1.18 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/) or run local Kubernetes clusters using Docker container “nodes” with [kind](https://kind.sigs.k8s.io/). You can also easily install 1.18 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/). 
-->
Kubernetes 1.18 可以在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.0)
上下載。要開始使用 Kubernetes，請查看這些[交互教程](https://kubernetes.io/docs/tutorials/)或通過
[kind](https://kind.sigs.k8s.io/) 使用 Docker 容器運行本地 kubernetes 叢集。你還可以使用
[kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/) 輕鬆安裝 1.18。

<!--
### Release Team
-->
### 發佈團隊

<!--
This release is made possible through the efforts of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md) led by Jorge Alarcon Ochoa, Site Reliability Engineer at Searchable AI. The 34 release team members coordinated many aspects of the release, from documentation to testing, validation, and feature completeness. 
-->
通過數百位貢獻了技術和非技術內容的個人的努力，使本次發行成爲可能。
特別感謝由 Searchable AI 的網站可靠性工程師 Jorge Alarcon Ochoa
領導的[發佈團隊](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md)。
34 位發佈團隊成員協調了發佈的各個方面，從文檔到測試、驗證和功能完整性。

<!--
As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid pace. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has had over [40,000 individual contributors](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1) to date and an active community of more than 3,000 people.
-->
隨着 Kubernetes 社區的發展壯大，我們的發佈過程很好地展示了開源軟件開發中的協作。
Kubernetes 繼續快速獲取新使用者。這種增長創造了一個積極的反饋迴路，
其中有更多的貢獻者提交了代碼，從而創建了更加活躍的生態系統。迄今爲止，Kubernetes 已有
[40,000 獨立貢獻者](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1)和一個超過 3000 人的活躍社區。

<!--
### Release Logo
-->
### 發佈 logo

<!--
![Kubernetes 1.18 Release Logo](/images/blog/2020-03-25-kubernetes-1.18-release-announcement/release-logo.png)
-->
![Kubernetes 1.18 發佈圖標](/images/blog/2020-03-25-kubernetes-1.18-release-announcement/release-logo.png)

<!--
#### Why the LHC?
-->
#### 爲什麼是 LHC

<!--
The LHC is the world’s largest and most powerful particle accelerator.  It is the result of the collaboration of thousands of scientists from around the world, all for the advancement of science. In a similar manner, Kubernetes has been a project that has united thousands of contributors from hundreds of organizations – all to work towards the same goal of improving cloud computing in all aspects! "A Bit Quarky" as the release name is meant to remind us that unconventional ideas can bring about great change and keeping an open mind to diversity will lead help us innovate.
-->
LHC 是世界上最大，功能最強大的粒子加速器。它是由來自世界各地成千上萬科學家合作的結果，
所有這些合作都是爲了促進科學的發展。以類似的方式，Kubernetes
已經成爲一個聚集了來自數百個組織的數千名貢獻者–所有人都朝着在各個方面改善雲計算的相同目標努力的項目！
發佈名稱 “A Bit Quarky” 的意思是提醒我們，非常規的想法可以帶來巨大的變化，對開放性保持開放態度將有助於我們進行創新。


<!--
#### About the designer
-->
#### 關於設計者

<!--
Maru Lango is a designer currently based in Mexico City. While her area of expertise is Product Design, she also enjoys branding, illustration and visual experiments using CSS + JS and contributing to diversity efforts within the tech and design communities. You may find her in most social media as @marulango or check her website: https://marulango.com
-->
Maru Lango 是目前居住在墨西哥城的設計師。她的專長是產品設計，她還喜歡使用 CSS + JS
進行品牌、插圖和視覺實驗，爲技術和設計社區的多樣性做貢獻。你可能會在大多數社交媒體上以
@marulango 的身份找到她，或查看她的網站： https://marulango.com

<!--
### User Highlights
-->
### 高光使用者

<!--
- Ericsson is using Kubernetes and other cloud native technology to deliver a [highly demanding 5G network](https://www.cncf.io/case-study/ericsson/) that resulted in up to 90 percent CI/CD savings.
- Zendesk is using Kubernetes to [run around 70% of its existing applications](https://www.cncf.io/case-study/zendesk/). It’s also building all new applications to also run on Kubernetes, which has brought time savings, greater flexibility, and increased velocity  to its application development.
- LifeMiles has [reduced infrastructure spending by 50%](https://www.cncf.io/case-study/lifemiles/) because of its move to Kubernetes. It has also allowed them to double its available resource capacity.
-->
- 愛立信正在使用 Kubernetes 和其他雲原生技術來交付[高標準的 5G 網路](https://www.cncf.io/case-study/ericsson/)，
  這可以在 CI/CD 上節省多達 90％ 的支出。
- Zendesk 正在使用 Kubernetes [運行其現有應用程序的約 70％](https://www.cncf.io/case-study/zendesk/)。
  它還正在使所構建的所有新應用都可以在 Kubernetes 上運行，從而節省時間、提高靈活性並加快其應用程序開發的速度。
- LifeMiles 因遷移到 Kubernetes 而[降低了 50% 的基礎設施開支](https://www.cncf.io/case-study/lifemiles/)。
  Kubernetes 還使他們可以將其可用資源容量增加一倍。

<!--
### Ecosystem Updates
-->
### 生態系統更新

<!--
- The CNCF published the results of its [annual survey](https://www.cncf.io/blog/2020/03/04/2019-cncf-survey-results-are-here-deployments-are-growing-in-size-and-speed-as-cloud-native-adoption-becomes-mainstream/) showing that Kubernetes usage in production is skyrocketing. The survey found that 78% of respondents are using Kubernetes in production compared to 58% last year.
- The “Introduction to Kubernetes” course hosted by the CNCF [surpassed 100,000 registrations](https://www.cncf.io/announcement/2020/01/28/cloud-native-computing-foundation-announces-introduction-to-kubernetes-course-surpasses-100000-registrations/).
-->
- CNCF 發佈了[年度調查](https://www.cncf.io/blog/2020/03/04/2019-cncf-survey-results-are-here-deployments-are-growing-in-size-and-speed-as-cloud-native-adoption-becomes-mainstream/)的結果，
  表明 Kubernetes 在生產中的使用正在飛速增長。調查發現，有 78％ 的受訪者在生產中使用 Kubernetes，而去年這一比例爲 58％。
- CNCF 舉辦的 “Kubernetes 入門” 課程有[超過 100,000 人註冊](https://www.cncf.io/announcement/2020/01/28/cloud-native-computing-foundation-announces-introduction-to-kubernetes-course-surpasses-100000-registrations/)。

<!--
### Project Velocity
-->
### 項目速度

<!--
The CNCF has continued refining DevStats, an ambitious project to visualize the myriad contributions that go into the project. [K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1) illustrates the breakdown of contributions from major company contributors, as well as an impressive set of preconfigured reports on everything from individual contributors to pull request lifecycle times. 
-->
CNCF 繼續完善 DevStats。這是一個雄心勃勃的項目，旨在對項目中的無數貢獻數據進行可視化展示。
[K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1) 展示了主要公司貢獻者的貢獻細目，
以及一系列令人印象深刻的預定義的報告，涉及從貢獻者個人的各方面到 PR 生命週期的各個方面。

<!--
This past quarter, 641 different companies and over 6,409 individuals contributed to Kubernetes. [Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) to learn more about the overall velocity of the Kubernetes project and community.
-->
在過去的一個季度中，641 家不同的公司和超過 6,409 個個人爲 Kubernetes 作出貢獻。
[查看 DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)
以瞭解有關 Kubernetes 項目和社區發展速度的信息。

<!--
### Event Update
-->
### 活動信息

<!--
Kubecon + CloudNativeCon EU 2020 is being pushed back –  for the more most up-to-date information, please check the [Novel Coronavirus Update page](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/attend/novel-coronavirus-update/).
-->
Kubecon + CloudNativeCon EU 2020 已經推遲 - 有關最新信息，
請查看[新型肺炎發佈頁面](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/attend/novel-coronavirus-update/)。

<!--
### Upcoming Release Webinar
-->
### 即將到來的發佈的線上會議

<!--
Join members of the Kubernetes 1.18 release team on April 23rd, 2020 to learn about the major features in this release including kubectl debug, Topography Manager, Ingress to V1 graduation, and client-go. Register here: https://www.cncf.io/webinars/kubernetes-1-18/.
-->
在 2020 年 4 月 23 日，和 Kubernetes 1.18 版本團隊一起了解此版本的主要功能，
包括 kubectl debug、拓撲管理器、Ingress 畢業爲 V1 版本以及 client-go。
在此處註冊： https://www.cncf.io/webinars/kubernetes-1-18/ 。

<!--
### Get Involved
-->
### 如何參與

<!--
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.
-->
參與 Kubernetes 的最簡單方法是加入衆多與你的興趣相關的[特別興趣小組](https://github.com/kubernetes/community/blob/master/sig-list.md)（SIGs）之一。
你有什麼想向 Kubernetes 社區發佈的內容嗎？參與我們的每週[社區會議](https://github.com/kubernetes/community/tree/master/communication)，
並通過以下渠道分享你的聲音。感謝你一直以來的反饋和支持。

<!--
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
- 在 Twitter 上關注我們 [@Kubernetesio](https://twitter.com/kubernetesio)，瞭解最新動態
- 在 [Discuss](https://discuss.kubernetes.io/) 上參與社區討論 
- 加入 [Slack](http://slack.k8s.io/) 上的社區
- 在 [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 提問（或回答）
- 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- 通過 [blog](https://kubernetes.io/blog/) 瞭解更多關於 Kubernetes 的新鮮事
- 瞭解更多關於 [Kubernetes 發佈團隊](https://github.com/kubernetes/sig-release/tree/master/release-team)的信息
