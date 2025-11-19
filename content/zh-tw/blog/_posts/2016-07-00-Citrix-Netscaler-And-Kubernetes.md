---
title: " Citrix + Kubernetes = 全壘打 "
date: 2016-07-14
slug: citrix-netscaler-and-kubernetes
---

<!--
title: " Citrix + Kubernetes = A Home Run "
date: 2016-07-14
slug: citrix-netscaler-and-kubernetes
url: /blog/2016/07/Citrix-Netscaler-And-Kubernetes
-->

<!--
_Editor’s note: today’s guest post is by Mikko Disini, a Director of Product Management at Citrix Systems, sharing their collaboration experience on a Kubernetes integration.&nbsp;_
-->
編者按：今天的客座文章來自 Citrix Systems 的產品管理總監 Mikko Disini，他分享了他們在 Kubernetes 集成上的合作經驗。&nbsp;_

<!--
Technical collaboration is like sports. If you work together as a team, you can go down the homestretch and pull through for a win. That’s our experience with the Google Cloud Platform team.
-->
技術合作就像體育運動。如果你能像一個團隊一樣合作，你就能在最後關頭取得勝利。這就是我們對谷歌雲平臺團隊的經驗。

<!--
Recently, we approached Google Cloud Platform (GCP) to collaborate on behalf of Citrix customers and the broader enterprise market looking to migrate workloads.&nbsp;This migration required including the [NetScaler Docker load balancer](https://www.citrix.com/blogs/2016/06/20/the-best-docker-load-balancer-at-dockercon-in-seattle-this-week/), CPX, into Kubernetes nodes and resolving any issues with getting traffic into the CPX proxies. &nbsp;
-->
最近，我們與 Google 雲平臺（GCP）聯繫，代表 Citrix 客戶以及更廣泛的企業市場，希望就工作負載的遷移進行協作。此遷移需要將 [NetScaler Docker 負載均衡器]https://www.citrix.com/blogs/2016/06/20/the-best-docker-load-balancer-at-dockercon-in-seattle-this-week/) CPX 包含到 Kubernetes 節點中，並解決將流量引入 CPX 代理的任何問題。

<!--
**Why NetScaler and Kubernetes?**
-->

**爲什麼是 NetScaler 和 Kubernetes**

<!--
1. Citrix customers want the same Layer 4 to Layer 7 capabilities from NetScaler that they have on-prem as they move to the cloud as they begin deploying their container and microservices architecture with Kubernetes&nbsp;
2. Kubernetes provides a proven infrastructure for running containers and VMs with automated workload delivery
3. NetScaler CPX provides Layer 4 to Layer 7 services and highly efficient telemetry data to a logging and analytics platform, [NetScaler Management and Analytics System](https://www.citrix.com/blogs/2016/05/24/introducing-the-next-generation-netscaler-management-and-analytics-system/)
-->

1. Citrix 的客戶希望他們開始使用 Kubernetes 部署他們的容器和微服務體系結構時，能夠像當初遷移到雲計算時一樣，享有 NetScaler 所提供的第 4 層到第 7 層能力&nbsp;
2. Kubernetes 提供了一套經過驗證的基礎設施，可用來運行容器和虛擬機，並自動交付工作負載；
3. NetScaler CPX 提供第 4 層到第 7 層的服務，併爲日誌和分析平臺 [NetScaler 管理和分析系統](https://www.citrix.com/blogs/2016/05/24/introducing-the-next-generation-netscaler-management-and-analytics-system/) 提供高效的度量數據。

<!--
I wish all our experiences working together with a technical partner were as good as working with GCP. We had a list of issues to enable our use cases and were able to collaborate swiftly on a solution. To resolve these, GCP team offered in depth technical assistance, working with Citrix such that NetScaler CPX can spin up and take over as a client-side proxy running on each host.&nbsp;
-->
我希望我們所有與技術合作夥伴一起工作的經驗都能像與 GCP 一起工作一樣好。我們有一個列表，包含支持我們的用例所需要解決的問題。我們能夠快速協作形成解決方案。爲了解決這些問題，GCP 團隊提供了深入的技術支持，與 Citrix 合作，從而使得 NetScaler CPX 能夠在每臺主機上作爲客戶端代理啓動運行。

<!--
Next, NetScaler CPX needed to be inserted in the data path of GCP ingress load balancer so that NetScaler CPX can spread traffic to front end web servers. The NetScaler team made modifications so that NetScaler CPX listens to API server events and configures itself to create a VIP, IP table rules and server rules to take ingress traffic and load balance across front end applications. Google Cloud Platform team provided feedback and assistance to verify modifications made to overcome the technical hurdles. Done!
-->
接下來，需要在 GCP 入口負載均衡器的數據路徑中插入 NetScaler CPX，使 NetScaler CPX 能夠將流量分散到前端 web 伺服器。NetScaler 團隊進行了修改，以便 NetScaler CPX 監聽 API 伺服器事件，並設定自己來創建 VIP、IP 表規則和伺服器規則，以便跨前端應用程序接收流量和負載均衡。谷歌雲平臺團隊提供反饋和幫助，驗證爲克服技術障礙所做的修改。完成了!

<!--
NetScaler CPX use case is supported in [Kubernetes 1.3](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/). Citrix customers and the broader enterprise market will have the opportunity to leverage NetScaler with Kubernetes, thereby lowering the friction to move workloads to the cloud.&nbsp;
-->
NetScaler CPX 用例在 [Kubernetes 1.3](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/) 中提供支持。Citrix 的客戶和更廣泛的企業市場將有機會基於 Kubernetes 享用 NetScaler 服務，從而降低將工作負載轉移到雲平臺的阻力。&nbsp;

<!--
You can learn more about&nbsp;NetScaler CPX [here](https://www.citrix.com/networking/microservices.html).
-->
您可以在[此處](https://www.citrix.com/networking/microservices.html)瞭解有關 NetScaler CPX 的更多信息。

<!--
_&nbsp;-- Mikko Disini, Director of Product Management - NetScaler, Citrix Systems_
-->
_&nbsp;-- Mikko Disini，Citrix Systems NetScaler 產品管理總監

