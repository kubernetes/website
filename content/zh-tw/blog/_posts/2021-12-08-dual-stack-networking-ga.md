---
layout: blog
title: 'Kubernetes 1.23：IPv4/IPv6 雙協議棧網路達到 GA'
date: 2021-12-08
slug: dual-stack-networking-ga
---
<!--
layout: blog
title: 'Kubernetes 1.23: Dual-stack IPv4/IPv6 Networking Reaches GA'
date: 2021-12-08
slug: dual-stack-networking-ga
-->

<!--
**Author:** Bridget Kromhout (Microsoft)
-->
**作者:** Bridget Kromhout (微軟)

<!--
"When will Kubernetes have IPv6?" This question has been asked with increasing frequency ever since alpha support for IPv6 was first added in k8s v1.9. While Kubernetes has supported IPv6-only clusters since v1.18, migration from IPv4 to IPv6 was not yet possible at that point. At long last, [dual-stack IPv4/IPv6 networking](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/563-dual-stack/) has reached general availability (GA) in Kubernetes v1.23.

What does dual-stack networking mean for you? Let’s take a look…
-->
“Kubernetes 何時支援 IPv6？” 自從 k8s v1.9 版本中首次新增對 IPv6 的 alpha 支援以來，這個問題的討論越來越頻繁。
雖然 Kubernetes 從 v1.18 版本開始就支援純 IPv6 叢集，但當時還無法支援 IPv4 遷移到 IPv6。
[IPv4/IPv6 雙協議棧網路](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/563-dual-stack/)
在 Kubernetes v1.23 版本中進入正式釋出（GA）階段。

讓我們來看看雙協議棧網路對你來說意味著什麼？

<!--
## Service API updates
-->
## 更新 Service API

<!--
[Services](/docs/concepts/services-networking/service/) were single-stack before 1.20, so using both IP families meant creating one Service per IP family. The user experience was simplified in 1.20, when Services were re-implemented to allow both IP families, meaning a single Service can handle both IPv4 and IPv6 workloads. Dual-stack load balancing is possible between services running any combination of IPv4 and IPv6.
-->
[Services](/zh-cn/docs/concepts/services-networking/service/) 在 1.20 版本之前是單協議棧的，
因此，使用兩個 IP 協議族意味著需為每個 IP 協議族建立一個 Service。在 1.20 版本中對使用者體驗進行簡化，
重新實現了 Service 以支援兩個 IP 協議族，這意味著一個 Service 就可以處理 IPv4 和 IPv6 協議。
對於 Service 而言，任意的 IPv4 和 IPv6 協議組合都可以實現負載均衡。

<!--
The Service API now has new fields to support dual-stack, replacing the single ipFamily field.
* You can select your choice of IP family by setting `ipFamilyPolicy` to one of three options: SingleStack, PreferDualStack, or RequireDualStack. A service can be changed between single-stack and dual-stack (within some limits).
* Setting `ipFamilies` to a list of families assigned allows you to set the order of families used.
* `clusterIPs` is inclusive of the previous `clusterIP` but allows for multiple entries, so it’s no longer necessary to run duplicate services, one in each of the two IP families. Instead, you can assign cluster IP addresses in both IP families.
-->
Service API 現在有了支援雙協議棧的新欄位，取代了單一的 ipFamily 欄位。
* 你可以透過將 `ipFamilyPolicy` 欄位設定為 `SingleStack`、`PreferDualStack` 或
`RequireDualStack` 來設定 IP 協議族。Service 可以在單協議棧和雙協議棧之間進行轉換(在某些限制內)。
* 設定 `ipFamilies` 為指定的協議族列表，可用來設定使用協議族的順序。
* 'clusterIPs' 的能力在涵蓋了之前的 'clusterIP'的情況下，還允許設定多個 IP 地址。
所以不再需要執行重複的 Service，在兩個 IP 協議族中各執行一個。你可以在兩個 IP 協議族中分配叢集 IP 地址。

<!--
Note that Pods are also dual-stack. For a given pod, there is no possibility of setting multiple IP addresses in the same family.
-->
請注意，Pods 也是雙協議棧的。對於一個給定的 Pod，不可能在同一協議族中設定多個 IP 地址。

<!--
## Default behavior remains single-stack
-->
## 預設行為仍然是單協議棧

<!--
Starting in 1.20 with the re-implementation of dual-stack services as alpha, the underlying networking for Kubernetes has included dual-stack whether or not a cluster was configured with the feature flag to enable dual-stack.
-->
從 1.20 版本開始，重新實現的雙協議棧服務處於 Alpha 階段，無論叢集是否配置了啟用雙協議棧的特性標誌，
Kubernetes 的底層網路都已經包括了雙協議棧。

<!--
Kubernetes 1.23 removed that feature flag as part of graduating the feature to stable. Dual-stack networking is always available if you want to configure it. You can set your cluster network to operate as single-stack IPv4, as single-stack IPv6, or as dual-stack IPv4/IPv6.
-->
Kubernetes 1.23 刪除了這個特性標誌，說明該特性已經穩定。
如果你想要配置雙協議棧網路，這一能力總是存在的。
你可以將叢集網路設定為 IPv4 單協議棧 、IPv6 單協議棧或 IPV4/IPV6 雙協議棧 。

<!--
While Services are set according to what you configure, Pods default to whatever the CNI plugin sets. If your CNI plugin assigns single-stack IPs, you will have single-stack unless `ipFamilyPolicy` specifies PreferDualStack or RequireDualStack. If your CNI plugin assigns dual-stack IPs, `pod.status.PodIPs` defaults to dual-stack.
-->
雖然 Service 是根據你的配置設定的，但 Pod 預設是由 CNI 外掛設定的。
如果你的 CNI 外掛分配單協議棧 IP，那麼就是單協議棧，除非 `ipFamilyPolicy` 設定為 `PreferDualStack` 或 `RequireDualStack`。
如果你的 CNI 外掛分配雙協議棧 IP，則 `pod.status.PodIPs` 預設為雙協議棧。

<!--
Even though dual-stack is possible, it is not mandatory to use it. Examples in the documentation show the variety possible in [dual-stack service configurations](/docs/concepts/services-networking/dual-stack/#dual-stack-service-configuration-scenarios).
-->
儘管雙協議棧是可用的，但並不強制你使用它。
在[雙協議棧服務配置](/zh-cn/docs/concepts/services-networking/dual-stack/#dual-stack-service-configuration-scenarios)
文件中的示例列出了可能出現的各種場景.

<!--
## Try dual-stack right now
-->
## 現在嘗試雙協議棧

<!--
While upstream Kubernetes now supports [dual-stack networking](/docs/concepts/services-networking/dual-stack/) as a GA or stable feature, each provider’s support of dual-stack Kubernetes may vary. Nodes need to be provisioned with routable IPv4/IPv6 network interfaces. Pods need to be dual-stack. The [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) is what assigns the IP addresses to the Pods, so it's the network plugin being used for the cluster that needs to support dual-stack. Some Container Network Interface (CNI) plugins support dual-stack, as does kubenet.
-->
雖然現在上游 Kubernetes 支援[雙協議棧網路](/zh-cn/docs/concepts/services-networking/dual-stack/)
作為 GA 或穩定特性，但每個提供商對雙協議棧 Kubernetes 的支援可能會有所不同。節點需要提供可路由的 IPv4/IPv6 網路介面。
Pod 需要是雙協議棧的。[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
是用來為 Pod 分配 IP 地址的，所以叢集需要支援雙協議棧的網路外掛。一些容器網路介面（CNI）外掛支援雙協議棧，例如 kubenet。

<!--
Ecosystem support of dual-stack is increasing; you can create [dual-stack clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/), try a [dual-stack cluster locally with KIND](https://kind.sigs.k8s.io/docs/user/configuration/#ip-family), and deploy dual-stack clusters in cloud providers (after checking docs for CNI or kubenet availability).
-->
支援雙協議棧的生態系統在不斷壯大；你可以使用
[kubeadm 建立雙協議棧叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/dual-stack-support/),
在本地嘗試用 [KIND 建立雙協議棧叢集](https://kind.sigs.k8s.io/docs/user/configuration/#ip-family)，
還可以將雙協議棧叢集部署到雲上（在查閱 CNI 或 kubenet 可用性的文件之後）

<!--
## Get involved with SIG Network
-->
## 加入 Network SIG

<!--
SIG-Network wants to learn from community experiences with dual-stack networking to find out more about evolving needs and your use cases. The [SIG-network update video from KubeCon NA 2021](https://www.youtube.com/watch?v=uZ0WLxpmBbY&list=PLj6h78yzYM2Nd1U4RMhv7v88fdiFqeYAP&index=4) summarizes the SIG’s recent updates, including dual-stack going to stable in 1.23.
-->
SIG-Network 希望從雙協議棧網路的社群體驗中學習，以瞭解更多不斷變化的需求和你的用例資訊。
[SIG-network 更新了來自 KubeCon 2021 北美大會的影片](https://www.youtube.com/watch?v=uZ0WLxpmBbY&list=PLj6h78yzYM2Nd1U4RMhv7v88fdiFqeYAP&index=4)
總結了 SIG 最近的更新，包括雙協議棧將在 1.23 版本中穩定。

<!--
The current SIG-Network [KEPs](https://github.com/orgs/kubernetes/projects/10) and [issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork) on GitHub illustrate the SIG’s areas of emphasis. The [dual-stack API server](https://github.com/kubernetes/enhancements/issues/2438) is one place to consider contributing.
-->
當前 SIG-Network 在 GitHub 上的 [KEPs](https://github.com/orgs/kubernetes/projects/10) 和
[issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork)
說明了該 SIG 的重點領域。[雙協議棧 API 伺服器](https://github.com/kubernetes/enhancements/issues/2438)
是一個考慮貢獻的方向。

<!--
[SIG-Network meetings](https://github.com/kubernetes/community/tree/master/sig-network#meetings) are a friendly, welcoming venue for you to connect with the community and share your ideas. Looking forward to hearing from you!
-->
[SIG-Network 會議](https://github.com/kubernetes/community/tree/master/sig-network#meetings)
是一個友好、熱情的場所，你可以與社群聯絡並分享你的想法。期待你的加入！

<!--
## Acknowledgments
-->
## 致謝

<!--
The dual-stack networking feature represents the work of many Kubernetes contributors. Thanks to all who contributed code, experience reports, documentation, code reviews, and everything in between. Bridget Kromhout details this community effort in [Dual-Stack Networking in Kubernetes](https://containerjournal.com/features/dual-stack-networking-in-kubernetes/). KubeCon keynotes by Tim Hockin & Khaled (Kal) Henidak in 2019 ([The Long Road to IPv4/IPv6 Dual-stack Kubernetes](https://www.youtube.com/watch?v=o-oMegdZcg4)) and by Lachlan Evenson in 2021 ([And Here We Go: Dual-stack Networking in Kubernetes](https://www.youtube.com/watch?v=lVrt8F2B9CM)) talk about the dual-stack journey, spanning five years and a great many lines of code.
-->
許多 Kubernetes 貢獻者為雙協議棧網路做出了貢獻。感謝所有貢獻了程式碼、經驗報告、文件、程式碼審查以及其他工作的人。
Bridget Kromhout 在 [Kubernetes的雙協議棧網路](https://containerjournal.com/features/dual-stack-networking-in-kubernetes/)
中詳細介紹了這項社群工作。Tim Hockin 和 Khaled (Kal) Henidak 在 2019 年的 KubeCon 大會演講
（[Kubernetes 通往 IPv4/IPv6 雙協議棧的漫漫長路](https://www.youtube.com/watch?v=o-oMegdZcg4)）
和 Lachlan Evenson 在 2021 年演講（[我們來啦，Kubernetes 雙協議棧網路](https://www.youtube.com/watch?v=o-oMegdZcg4)）
中討論了雙協議棧的發展旅程，耗時 5 年和海量程式碼。
