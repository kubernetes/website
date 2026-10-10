---
layout: blog
title: Kubernetes Gateway API 进入 Beta 阶段
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

**译者：** Michael Yao (DaoCloud)

<!-- 
We are excited to announce the v0.5.0 release of Gateway API. For the first
time, several of our most important Gateway API resources are graduating to
beta. Additionally, we are starting a new initiative to explore how Gateway API
can be used for mesh and introducing new experimental concepts such as URL
rewrites. We'll cover all of this and more below. 
-->
我们很高兴地宣布 Gateway API 的 v0.5.0 版本发布。
我们最重要的几个 Gateway API 资源首次进入 Beta 阶段。
此外，我们正在启动一项新的倡议，探索如何将 Gateway API 用于网格，还引入了 URL 重写等新的实验性概念。
下文涵盖了这部分内容和更多说明。

<!-- 
## What is Gateway API? 
-->
## 什么是 Gateway API？

<!-- 
Gateway API is a collection of resources centered around [Gateway][gw] resources
(which represent the underlying network gateways / proxy servers) to enable
robust Kubernetes service networking through expressive, extensible and
role-oriented interfaces that are implemented by many vendors and have broad
industry support. 
-->
Gateway API 是以 [Gateway][gw] 资源（代表底层网络网关/代理服务器）为中心的资源集合，
Kubernetes 服务网络的健壮性得益于众多供应商实现、得到广泛行业支持且极具表达力、可扩展和面向角色的各个接口。

<!-- 
Originally conceived as a successor to the well known [Ingress][ing] API, the
benefits of Gateway API include (but are not limited to) explicit support for
many commonly used networking protocols (e.g. `HTTP`, `TLS`, `TCP`, `UDP`) as
well as tightly integrated support for Transport Layer Security (TLS). The
`Gateway` resource in particular enables implementations to manage the lifecycle
of network gateways as a Kubernetes API. 
-->
Gateway API 最初被认为是知名 [Ingress][ing] API 的继任者，
Gateway API 的好处包括（但不限于）对许多常用网络协议的显式支持
（例如 `HTTP`、`TLS`、`TCP `、`UDP`) 以及对传输层安全 (TLS) 的紧密集成支持。
特别是 `Gateway` 资源能够实现作为 Kubernetes API 来管理网络网关的生命周期。

<!-- 
If you're an end-user interested in some of the benefits of Gateway API we
invite you to jump in and find an implementation that suits you. At the time of
this release there are over a dozen [implementations][impl] for popular API
gateways and service meshes and guides are available to start exploring quickly. 
-->
如果你是对 Gateway API 的某些优势感兴趣的终端用户，我们邀请你加入并找到适合你的实现方式。
值此版本发布之时，对于流行的 API 网关和服务网格有十多种[实现][impl]，还提供了操作指南便于快速开始探索。

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
### 入门

<!-- 
Gateway API is an official Kubernetes API like
[Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/).
Gateway API represents a superset of Ingress functionality, enabling more
advanced concepts. Similar to Ingress, there is no default implementation of
Gateway API built into Kubernetes. Instead, there are many different
[implementations][impl] available, providing significant choice in terms of underlying
technologies while providing a consistent and portable experience. 
-->
Gateway API 是一个类似 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
的正式 Kubernetes API。Gateway API 代表了 Ingress 功能的一个父集，使得一些更高级的概念成为可能。
与 Ingress 类似，Kubernetes 中没有内置 Gateway API 的默认实现。
相反，有许多不同的[实现][impl]可用，在提供一致且可移植体验的同时，还在底层技术方面提供了重要的选择。

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
查看 [API 概念文档][concepts] 并查阅一些[指南][guides]以开始熟悉这些 API 及其工作方式。
当你准备好一个实用的应用程序时，
请打开[实现页面][impl]并选择属于你可能已经熟悉的现有技术或集群提供商默认使用的技术（如果适用）的实现。
Gateway API 是一个基于 [CRD][crd] 的 API，因此你将需要[安装 CRD][install-crds] 到集群上才能使用该 API。

<!-- 
If you're specifically interested in helping to contribute to Gateway API, we
would love to have you! Please feel free to [open a new issue][issue] on the
repository, or join in the [discussions][disc]. Also check out the [community
page][community] which includes links to the Slack channel and community meetings. 
-->
如果你对 Gateway API 做贡献特别有兴趣，我们非常欢迎你的加入！
你可以随时在仓库上[提一个新的 issue][issue]，或[加入讨论][disc]。
另请查阅[社区页面][community]以了解 Slack 频道和社区会议的链接。

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
## 发布亮点

### 进入 Beta 阶段

<!-- 
The `v0.5.0` release is particularly historic because it marks the growth in
maturity to a beta API version (`v1beta1`) release for some of the key APIs: 
-->
`v0.5.0` 版本特别具有历史意义，因为它标志着一些关键 API 成长至 Beta API 版本（`v1beta1`）：

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
这一成就的标志是达到了以下几个进入标准：

- API 已[广泛实现][impl]。
- 合规性测试基本覆盖了所有资源且可以让多种实现通过测试。
- 大多数 API 接口正被积极地使用。
- Kubernetes SIG Network API 评审团队已批准其进入 Beta 阶段。

<!-- 
For more information on Gateway API versioning, refer to the [official
documentation](https://gateway-api.sigs.k8s.io/concepts/versioning/). To see
what's in store for future releases check out the [next steps](#next-steps)
section. 
-->
有关 Gateway API 版本控制的更多信息，请参阅[官方文档](https://gateway-api.sigs.k8s.io/concepts/versioning/)。
要查看未来版本的计划，请查看[下一步](#next-steps)。

[impl]:https://gateway-api.sigs.k8s.io/implementations/

<!-- 
### Release channels

This release introduces the `experimental` and `standard` [release channels][ch]
which enable a better balance of maintaining stability while still enabling
experimentation and iterative development. 
-->
### 发布渠道

此版本引入了 `experimental` 和 `standard` [发布渠道][ch]，
这样能够更好地保持平衡，在确保稳定性的同时，还能支持实验和迭代开发。

<!-- 
The `standard` release channel includes:

- resources that have graduated to beta
- fields that have graduated to standard (no longer considered experimental) 
-->
`standard` 发布渠道包括：

- 已进入 Beta 阶段的资源
- 已进入 standard 的字段（不再被视为 experimental）

<!-- 
The `experimental` release channel includes everything in the `standard` release
channel, plus:

- `alpha` API resources
- fields that are considered experimental and have not graduated to `standard` channel 
-->
`experimental` 发布渠道包括 `standard` 发布渠道的所有内容，另外还有：

- `alpha` API 资源
- 视为 experimental 且还未进入 `standard` 渠道的字段

<!-- 
Release channels are used internally to enable iterative development with
quick turnaround, and externally to indicate feature stability to implementors
and end-users. 
-->
使用发布渠道能让内部实现快速流转的迭代开发，且能让外部实现者和最终用户标示功能稳定性。

<!-- 
For this release we've added the following experimental features:

- [Routes can attach to Gateways by specifying port numbers](https://gateway-api.sigs.k8s.io/geps/gep-957/)
- [URL rewrites and path redirects](https://gateway-api.sigs.k8s.io/geps/gep-726/) 
-->
本次发布新增了以下实验性的功能特性：

- [路由通过指定端口号可以挂接到 Gateway](https://gateway-api.sigs.k8s.io/geps/gep-957/)
- [URL 重写和路径重定向](https://gateway-api.sigs.k8s.io/geps/gep-726/)

[ch]:https://gateway-api.sigs.k8s.io/concepts/versioning/#release-channels-eg-experimental-standard

<!-- 
### Other improvements

For an exhaustive list of changes included in the `v0.5.0` release, please see
the [v0.5.0 release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v0.5.0). 
-->
### 其他改进

有关 `v0.5.0` 版本中包括的完整变更清单，请参阅
[v0.5.0 发布说明](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v0.5.0)。

<!-- 
## Gateway API for service mesh: the GAMMA Initiative
Some service mesh projects have [already implemented support for the Gateway
API](https://gateway-api.sigs.k8s.io/implementations/). Significant overlap
between the Service Mesh Interface (SMI) APIs and the Gateway API has [inspired
discussion in the SMI
community](https://github.com/servicemeshinterface/smi-spec/issues/249) about
possible integration. 
-->
## 适用于服务网格的 Gateway API：GAMMA 倡议

某些服务网格项目[已实现对 Gateway API 的支持](https://gateway-api.sigs.k8s.io/implementations/)。
服务网格接口 (Service Mesh Interface，SMI) API 和 Gateway API 之间的显著重叠
[已激发了 SMI 社区讨论](https://github.com/servicemeshinterface/smi-spec/issues/249)可能的集成方式。

<!-- 
We are pleased to announce that the service mesh community, including
representatives from Cilium Service Mesh, Consul, Istio, Kuma, Linkerd, NGINX
Service Mesh and Open Service Mesh, is coming together to form the [GAMMA
Initiative](https://gateway-api.sigs.k8s.io/contributing/gamma/), a dedicated
workstream within the Gateway API subproject focused on Gateway API for Mesh
Management and Administration. 
-->
我们很高兴地宣布，来自 Cilium Service Mesh、Consul、Istio、Kuma、Linkerd、NGINX Service Mesh
和 Open Service Mesh 等服务网格社区的代表汇聚一堂组成
[GAMMA 倡议小组](https://gateway-api.sigs.k8s.io/contributing/gamma/)，
这是 Gateway API 子项目内一个专门的工作流，专注于网格管理所用的 Gateway API。

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
这个小组将交付[增强提案](https://gateway-api.sigs.k8s.io/geps/overview/)，
包括对网格和网格相关用例适用的 Gateway API 规约的资源、添加和修改。

这项工作已从[探索针对服务间流量使用 Gateway API](https://docs.google.com/document/d/1T_DtMQoq2tccLAtJTpo3c0ohjm25vRS35MsestSL9QU/edit#heading=h.jt37re3yi6k5)
开始，并将继续增强身份验证和鉴权策略等领域。

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

随着我们不断完善用于生产用例的 API，以下是我们将为下一个 Gateway API 版本所做的一些重点工作：

- 针对 [gRPC][grpc] 流量路由的 [GRPCRoute][gep1016]
- [路由代理][pr1085]
- 4 层 API 成熟度：[TCPRoute][tcpr]、[UDPRoute][udpr] 和 [TLSRoute][tlsr] 正进入 Beta 阶段
- [GAMMA 倡议](https://gateway-api.sigs.k8s.io/contributing/gamma/) - 针对服务网格的 Gateway API

<!-- 
If there's something on this list you want to get involved in, or there's
something not on this list that you want to advocate for to get on the roadmap
please join us in the #sig-network-gateway-api channel on Kubernetes Slack or our weekly [community calls](https://gateway-api.sigs.k8s.io/contributing/community/#meetings). 
-->
如果你想参与此列表中的某些工作，或者你想倡导加入路线图的内容不在此列表中，
请通过 Kubernetes Slack 的 #sig-network-gateway-api 频道或我们每周的
[社区电话会议](https://gateway-api.sigs.k8s.io/contributing/community/#meetings)加入我们。

[gep1016]:https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1016.md
[grpc]:https://grpc.io/
[pr1085]:https://github.com/kubernetes-sigs/gateway-api/pull/1085
[tcpr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/tcproute_types.go
[udpr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/udproute_types.go
[tlsr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/tlsroute_types.go
[community]:https://gateway-api.sigs.k8s.io/contributing/community/
