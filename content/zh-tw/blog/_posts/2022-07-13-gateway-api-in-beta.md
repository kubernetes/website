---
layout: blog
title: Kubernetes Gateway API 進入 Beta 階段
date: 2022-07-13
slug: gateway-api-graduates-to-beta
---
<!-- 
layout: blog
title: Kubernetes Gateway API Graduates to Beta
date: 2022-07-13
slug: gateway-api-graduates-to-beta
canonicalUrl: https://gateway-api.sigs.k8s.io/blog/2022/graduating-to-beta/ 
-->

<!-- 
**Authors:** Shane Utt (Kong), Rob Scott (Google), Nick Young (VMware), Jeff Apple (HashiCorp) 
-->
**作者：** Shane Utt (Kong)、Rob Scott (Google)、Nick Young (VMware)、Jeff Apple (HashiCorp)

**譯者：** Michael Yao (DaoCloud)

<!-- 
We are excited to announce the v0.5.0 release of Gateway API. For the first
time, several of our most important Gateway API resources are graduating to
beta. Additionally, we are starting a new initiative to explore how Gateway API
can be used for mesh and introducing new experimental concepts such as URL
rewrites. We'll cover all of this and more below. 
-->
我們很高興地宣佈 Gateway API 的 v0.5.0 版本發佈。
我們最重要的幾個 Gateway API 資源首次進入 Beta 階段。
此外，我們正在啓動一項新的倡議，探索如何將 Gateway API 用於網格，還引入了 URL 重寫等新的實驗性概念。
下文涵蓋了這部分內容和更多說明。

<!-- 
## What is Gateway API? 
-->
## 什麼是 Gateway API？

<!-- 
Gateway API is a collection of resources centered around [Gateway][gw] resources
(which represent the underlying network gateways / proxy servers) to enable
robust Kubernetes service networking through expressive, extensible and
role-oriented interfaces that are implemented by many vendors and have broad
industry support. 
-->
Gateway API 是以 [Gateway][gw] 資源（代表底層網路網關/代理伺服器）爲中心的資源集合，
Kubernetes 服務網路的健壯性得益於衆多供應商實現、得到廣泛行業支持且極具表達力、可擴展和麪向角色的各個介面。

<!-- 
Originally conceived as a successor to the well known [Ingress][ing] API, the
benefits of Gateway API include (but are not limited to) explicit support for
many commonly used networking protocols (e.g. `HTTP`, `TLS`, `TCP`, `UDP`) as
well as tightly integrated support for Transport Layer Security (TLS). The
`Gateway` resource in particular enables implementations to manage the lifecycle
of network gateways as a Kubernetes API. 
-->
Gateway API 最初被認爲是知名 [Ingress][ing] API 的繼任者，
Gateway API 的好處包括（但不限於）對許多常用網路協議的顯式支持
（例如 `HTTP`、`TLS`、`TCP `、`UDP`) 以及對傳輸層安全 (TLS) 的緊密集成支持。
特別是 `Gateway` 資源能夠實現作爲 Kubernetes API 來管理網路網關的生命週期。

<!-- 
If you're an end-user interested in some of the benefits of Gateway API we
invite you to jump in and find an implementation that suits you. At the time of
this release there are over a dozen [implementations][impl] for popular API
gateways and service meshes and guides are available to start exploring quickly. 
-->
如果你是對 Gateway API 的某些優勢感興趣的終端使用者，我們邀請你加入並找到適合你的實現方式。
值此版本發佈之時，對於流行的 API 網關和服務網格有十多種[實現][impl]，還提供了操作指南便於快速開始探索。

<!-- 
[gw]:https://gateway-api.sigs.k8s.io/api-types/gateway/
[ing]:https://kubernetes.io/docs/reference/kubernetes-api/service-resources/ingress-v1/
[impl]:https://gateway-api.sigs.k8s.io/implementations/ 
-->
[gw]:https://gateway-api.sigs.k8s.io/api-types/gateway/
[ing]:/zh-cn/docs/reference/kubernetes-api/service-resources/ingress-v1/
[impl]:https://gateway-api.sigs.k8s.io/implementations/

<!-- 
### Getting started 
-->
### 入門

<!-- 
Gateway API is an official Kubernetes API like
[Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/).
Gateway API represents a superset of Ingress functionality, enabling more
advanced concepts. Similar to Ingress, there is no default implementation of
Gateway API built into Kubernetes. Instead, there are many different
[implementations][impl] available, providing significant choice in terms of underlying
technologies while providing a consistent and portable experience. 
-->
Gateway API 是一個類似 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
的正式 Kubernetes API。Gateway API 代表了 Ingress 功能的一個父集，使得一些更高級的概念成爲可能。
與 Ingress 類似，Kubernetes 中沒有內置 Gateway API 的預設實現。
相反，有許多不同的[實現][impl]可用，在提供一致且可移植體驗的同時，還在底層技術方面提供了重要的選擇。

<!-- 
Take a look at the [API concepts documentation][concepts] and check out some of
the [Guides][guides] to start familiarizing yourself with the APIs and how they
work. When you're ready for a practical application open the [implementations
page][impl] and select an implementation that belongs to an existing technology
you may already be familiar with or the one your cluster provider uses as a
default (if applicable). Gateway API is a [Custom Resource Definition
(CRD)][crd] based API so you'll need to [install the CRDs][install-crds] onto a
cluster to use the API. 
-->
查看 [API 概念文檔][concepts] 並查閱一些[指南][guides]以開始熟悉這些 API 及其工作方式。
當你準備好一個實用的應用程式時，
請打開[實現頁面][impl]並選擇屬於你可能已經熟悉的現有技術或叢集提供商預設使用的技術（如果適用）的實現。
Gateway API 是一個基於 [CRD][crd] 的 API，因此你將需要[安裝 CRD][install-crds] 到叢集上才能使用該 API。

<!-- 
If you're specifically interested in helping to contribute to Gateway API, we
would love to have you! Please feel free to [open a new issue][issue] on the
repository, or join in the [discussions][disc]. Also check out the [community
page][community] which includes links to the Slack channel and community meetings. 
-->
如果你對 Gateway API 做貢獻特別有興趣，我們非常歡迎你的加入！
你可以隨時在倉庫上[提一個新的 issue][issue]，或[加入討論][disc]。
另請查閱[社區頁面][community]以瞭解 Slack 頻道和社區會議的鏈接。

<!-- 
[crd]:https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
[concepts]:https://gateway-api.sigs.k8s.io/concepts/api-overview/
[guides]:https://gateway-api.sigs.k8s.io/guides/getting-started/
[impl]:https://gateway-api.sigs.k8s.io/implementations/
[install-crds]:https://gateway-api.sigs.k8s.io/guides/getting-started/#install-the-crds
[issue]:https://github.com/kubernetes-sigs/gateway-api/issues/new/choose
[disc]:https://github.com/kubernetes-sigs/gateway-api/discussions
[community]:https://gateway-api.sigs.k8s.io/contributing/community/ 
-->
[crd]:/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
[concepts]:https://gateway-api.sigs.k8s.io/concepts/api-overview/
[guides]:https://gateway-api.sigs.k8s.io/guides/getting-started/
[impl]:https://gateway-api.sigs.k8s.io/implementations/
[install-crds]:https://gateway-api.sigs.k8s.io/guides/getting-started/#install-the-crds
[issue]:https://github.com/kubernetes-sigs/gateway-api/issues/new/choose
[disc]:https://github.com/kubernetes-sigs/gateway-api/discussions
[community]:https://gateway-api.sigs.k8s.io/contributing/community/

<!-- 
## Release highlights

### Graduation to beta 
-->
## 發佈亮點

### 進入 Beta 階段

<!-- 
The `v0.5.0` release is particularly historic because it marks the growth in
maturity to a beta API version (`v1beta1`) release for some of the key APIs: 
-->
`v0.5.0` 版本特別具有歷史意義，因爲它標誌着一些關鍵 API 成長至 Beta API 版本（`v1beta1`）：

- [GatewayClass](https://gateway-api.sigs.k8s.io/api-types/gatewayclass/)
- [Gateway](https://gateway-api.sigs.k8s.io/api-types/gateway/)
- [HTTPRoute](https://gateway-api.sigs.k8s.io/api-types/httproute/)

<!-- 
This achievement was marked by the completion of several graduation criteria:

- API has been [widely implemented][impl].
- Conformance tests provide basic coverage for all resources and have multiple implementations passing tests.
- Most of the API surface is actively being used.
- Kubernetes SIG Network API reviewers have approved graduation to beta. 
-->
這一成就的標誌是達到了以下幾個進入標準：

- API 已[廣泛實現][impl]。
- 合規性測試基本覆蓋了所有資源且可以讓多種實現通過測試。
- 大多數 API 介面正被積極地使用。
- Kubernetes SIG Network API 評審團隊已批准其進入 Beta 階段。

<!-- 
For more information on Gateway API versioning, refer to the [official
documentation](https://gateway-api.sigs.k8s.io/concepts/versioning/). To see
what's in store for future releases check out the [next steps](#next-steps)
section. 
-->
有關 Gateway API 版本控制的更多資訊，請參閱[官方文檔](https://gateway-api.sigs.k8s.io/concepts/versioning/)。
要查看未來版本的計劃，請查看[下一步](#next-steps)。

[impl]:https://gateway-api.sigs.k8s.io/implementations/

<!-- 
### Release channels

This release introduces the `experimental` and `standard` [release channels][ch]
which enable a better balance of maintaining stability while still enabling
experimentation and iterative development. 
-->
### 發佈渠道

此版本引入了 `experimental` 和 `standard` [發佈渠道][ch]，
這樣能夠更好地保持平衡，在確保穩定性的同時，還能支持實驗和迭代開發。

<!-- 
The `standard` release channel includes:

- resources that have graduated to beta
- fields that have graduated to standard (no longer considered experimental) 
-->
`standard` 發佈渠道包括：

- 已進入 Beta 階段的資源
- 已進入 standard 的字段（不再被視爲 experimental）

<!-- 
The `experimental` release channel includes everything in the `standard` release
channel, plus:

- `alpha` API resources
- fields that are considered experimental and have not graduated to `standard` channel 
-->
`experimental` 發佈渠道包括 `standard` 發佈渠道的所有內容，另外還有：

- `alpha` API 資源
- 視爲 experimental 且還未進入 `standard` 渠道的字段

<!-- 
Release channels are used internally to enable iterative development with
quick turnaround, and externally to indicate feature stability to implementors
and end-users. 
-->
使用發佈渠道能讓內部實現快速流轉的迭代開發，且能讓外部實現者和最終使用者標示功能穩定性。

<!-- 
For this release we've added the following experimental features:

- [Routes can attach to Gateways by specifying port numbers](https://gateway-api.sigs.k8s.io/geps/gep-957/)
- [URL rewrites and path redirects](https://gateway-api.sigs.k8s.io/geps/gep-726/) 
-->
本次發佈新增了以下實驗性的功能特性：

- [路由通過指定端口號可以掛接到 Gateway](https://gateway-api.sigs.k8s.io/geps/gep-957/)
- [URL 重寫和路徑重定向](https://gateway-api.sigs.k8s.io/geps/gep-726/)

[ch]:https://gateway-api.sigs.k8s.io/concepts/versioning/#release-channels-eg-experimental-standard

<!-- 
### Other improvements

For an exhaustive list of changes included in the `v0.5.0` release, please see
the [v0.5.0 release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v0.5.0). 
-->
### 其他改進

有關 `v0.5.0` 版本中包括的完整變更清單，請參閱
[v0.5.0 發佈說明](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v0.5.0)。

<!-- 
## Gateway API for service mesh: the GAMMA Initiative
Some service mesh projects have [already implemented support for the Gateway
API](https://gateway-api.sigs.k8s.io/implementations/). Significant overlap
between the Service Mesh Interface (SMI) APIs and the Gateway API has [inspired
discussion in the SMI
community](https://github.com/servicemeshinterface/smi-spec/issues/249) about
possible integration. 
-->
## 適用於服務網格的 Gateway API：GAMMA 倡議

某些服務網格項目[已實現對 Gateway API 的支持](https://gateway-api.sigs.k8s.io/implementations/)。
服務網格介面 (Service Mesh Interface，SMI) API 和 Gateway API 之間的顯著重疊
[已激發了 SMI 社區討論](https://github.com/servicemeshinterface/smi-spec/issues/249)可能的集成方式。

<!-- 
We are pleased to announce that the service mesh community, including
representatives from Cilium Service Mesh, Consul, Istio, Kuma, Linkerd, NGINX
Service Mesh and Open Service Mesh, is coming together to form the [GAMMA
Initiative](https://gateway-api.sigs.k8s.io/contributing/gamma/), a dedicated
workstream within the Gateway API subproject focused on Gateway API for Mesh
Management and Administration. 
-->
我們很高興地宣佈，來自 Cilium Service Mesh、Consul、Istio、Kuma、Linkerd、NGINX Service Mesh
和 Open Service Mesh 等服務網格社區的代表匯聚一堂組成
[GAMMA 倡議小組](https://gateway-api.sigs.k8s.io/contributing/gamma/)，
這是 Gateway API 子項目內一個專門的工作流，專注於網格管理所用的 Gateway API。

<!-- 
This group will deliver [enhancement
proposals](https://gateway-api.sigs.k8s.io/geps/overview/) consisting
of resources, additions, and modifications to the Gateway API specification for
mesh and mesh-adjacent use-cases.

This work has begun with [an exploration of using Gateway API for
service-to-service
traffic](https://docs.google.com/document/d/1T_DtMQoq2tccLAtJTpo3c0ohjm25vRS35MsestSL9QU/edit#heading=h.jt37re3yi6k5)
and will continue with enhancement in areas such as authentication and
authorization policy.
-->
這個小組將交付[增強提案](https://gateway-api.sigs.k8s.io/geps/overview/)，
包括對網格和網格相關用例適用的 Gateway API 規約的資源、添加和修改。

這項工作已從[探索針對服務間流量使用 Gateway API](https://docs.google.com/document/d/1T_DtMQoq2tccLAtJTpo3c0ohjm25vRS35MsestSL9QU/edit#heading=h.jt37re3yi6k5)
開始，並將繼續增強身份驗證和鑑權策略等領域。

<!-- 
## Next steps

As we continue to mature the API for production use cases, here are some of the highlights of what we'll be working on for the next Gateway API releases:

- [GRPCRoute][gep1016] for [gRPC][grpc] traffic routing
- [Route delegation][pr1085]
- Layer 4 API maturity: Graduating [TCPRoute][tcpr], [UDPRoute][udpr] and
  [TLSRoute][tlsr] to beta
- [GAMMA Initiative](https://gateway-api.sigs.k8s.io/contributing/gamma/) - Gateway API for Service Mesh 
-->
## 下一步

隨着我們不斷完善用於生產用例的 API，以下是我們將爲下一個 Gateway API 版本所做的一些重點工作：

- 針對 [gRPC][grpc] 流量路由的 [GRPCRoute][gep1016]
- [路由代理][pr1085]
- 4 層 API 成熟度：[TCPRoute][tcpr]、[UDPRoute][udpr] 和 [TLSRoute][tlsr] 正進入 Beta 階段
- [GAMMA 倡議](https://gateway-api.sigs.k8s.io/contributing/gamma/) - 針對服務網格的 Gateway API

<!-- 
If there's something on this list you want to get involved in, or there's
something not on this list that you want to advocate for to get on the roadmap
please join us in the #sig-network-gateway-api channel on Kubernetes Slack or our weekly [community calls](https://gateway-api.sigs.k8s.io/contributing/community/#meetings). 
-->
如果你想參與此列表中的某些工作，或者你想倡導加入路線圖的內容不在此列表中，
請通過 Kubernetes Slack 的 #sig-network-gateway-api 頻道或我們每週的
[社區電話會議](https://gateway-api.sigs.k8s.io/contributing/community/#meetings)加入我們。

[gep1016]:https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1016.md
[grpc]:https://grpc.io/
[pr1085]:https://github.com/kubernetes-sigs/gateway-api/pull/1085
[tcpr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/tcproute_types.go
[udpr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/udproute_types.go
[tlsr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/tlsroute_types.go
[community]:https://gateway-api.sigs.k8s.io/contributing/community/
