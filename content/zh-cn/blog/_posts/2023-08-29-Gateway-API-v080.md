---
layout: blog
title: "Gateway API v0.8.0：引入服务网格支持"
date: 2023-08-29T10:00:00-08:00
slug: gateway-api-v0-8
---
<!--
layout: blog
title: "Gateway API v0.8.0: Introducing Service Mesh Support"
date: 2023-08-29T10:00:00-08:00
slug: gateway-api-v0-8
-->

<!--
***Authors:*** Flynn (Buoyant), John Howard (Google), Keith Mattix (Microsoft), Michael Beaumont (Kong), Mike Morris (independent), Rob Scott (Google)
-->
**作者：** Flynn (Buoyant), John Howard (Google), Keith Mattix (Microsoft), Michael Beaumont (Kong), Mike Morris (independent), Rob Scott (Google)

**译者：** Xin Li (Daocloud)

<!--
We are thrilled to announce the v0.8.0 release of Gateway API! With this
release, Gateway API support for service mesh has reached [Experimental
status][status]. We look forward to your feedback!

We're especially delighted to announce that Kuma 2.3+, Linkerd 2.14+, and Istio
1.16+ are all fully-conformant implementations of Gateway API service mesh
support.
-->
我们很高兴地宣布 Gateway API 的 v0.8.0 版本发布了！
通过此版本，Gateway API 对服务网格的支持已达到[实验性（Experimental）状态][status]。
我们期待你的反馈！

我们很高兴地宣布 Kuma 2.3+、Linkerd 2.14+ 和 Istio 1.16+ 都是 Gateway API
服务网格支持的完全一致实现。

<!--
## Service mesh support in Gateway API

While the initial focus of Gateway API was always ingress (north-south)
traffic, it was clear almost from the beginning that the same basic routing
concepts should also be applicable to service mesh (east-west) traffic. In
2022, the Gateway API subproject started the [GAMMA initiative][gamma], a
dedicated vendor-neutral workstream, specifically to examine how best to fit
service mesh support into the framework of the Gateway API resources, without
requiring users of Gateway API to relearn everything they understand about the
API.
-->
## Gateway API 中的服务网格支持

虽然 Gateway API 最初的重点一直是入站（南北）流量，但几乎从最开始就比较明确，
相同的基本路由概念也应适用于服务网格（东西）流量。2022 年，Gateway API
子项目启动了 [GAMMA 计划][gamma]，这是一个专门的供应商中立的工作流，
旨在专门研究如何最好地将服务网格支持纳入 Gateway API 资源的框架中，
而不需要 Gateway API 的用户重新学习他们了解的有关 API 的一切。

<!--
Over the last year, GAMMA has dug deeply into the challenges and possible
solutions around using Gateway API for service mesh. The end result is a small
number of [enhancement proposals][geps] that subsume many hours of thought and
debate, and provide a minimum viable path to allow Gateway API to be used for
service mesh.
-->
在过去的一年中，GAMMA 深入研究了使用 Gateway API 用于服务网格的挑战和可能的解决方案。
最终结果是少量的[增强提案][geps]，其中包含了很长时间的思考和辩论，并提供允许使用 Gateway API
用于服务网格的最短可行路径。

<!--
### How will mesh routing work when using Gateway API?

You can find all the details in the [Gateway API Mesh routing
documentation][mesh-routing] and [GEP-1426], but the short version for Gateway
API v0.8.0 is that an HTTPRoute can now have a `parentRef` that is a Service,
rather than just a Gateway. We anticipate future GEPs in this area as we gain
more experience with service mesh use cases -- binding to a Service makes it
possible to use the Gateway API with a service mesh, but there are several
interesting use cases that remain difficult to cover.

As an example, you might use an HTTPRoute to do an A-B test in the mesh as
follows:
-->
### 当使用 Gateway API 时，网格路由将如何工作？

你可以在 [Gateway API Mesh 路由文档][mesh-routing]和 [GEP-1426] 中找到所有详细信息，
但对于 Gateway API v0.8.0 的简短的版本是现在 HTTPRoute 可以设置 `parentRef`，
它是一个 Service，而不仅仅是一个网关。随着我们对服务网格用例的经验不断丰富，我们预计在这个领域会出现更多
GEP -- 绑定到 Service 使得将 Gateway API 与服务网格结合使用成为可能，但仍有几个有趣的用例难以覆盖。

例如，你可以使用 HTTPRoute 在网格中进行 A-B 测试，如下所示：

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
  name: bar-route
spec:
  parentRefs:
  - group: ""
    kind: Service
    name: demo-app
    port: 5000
  rules:
  - matches:
    - headers:
      - type: Exact
        name: env
        value: v1
    backendRefs:
    - name: demo-app-v1
      port: 5000
  - backendRefs:
    - name: demo-app-v2
      port: 5000
```

<!--
Any request to port 5000 of the `demo-app` Service that has the header `env:
v1` will be routed to `demo-app-v1`, while any request without that header
will be routed to `demo-app-v2` -- and since this is being handled by the
service mesh, not the ingress controller, the A/B test can happen anywhere in
the application's call graph.
-->
任何对 `demo-app` Service 5000 端口且具有 `env: v1` 表头的请求都将被路由到 `demo-app-v1`，
而没有该标头的请求都将被路由到 `demo-app-v2` -- 并且由于这是由服务网格而不是
Ingress 控制器处理的，A/B 测试可以发生在应用程序的调用图中的任何位置。

<!--
### How do I know this will be truly portable?

Gateway API has been investing heavily in conformance tests across all
features it supports, and mesh is no exception. One of the challenges that the
GAMMA initiative ran into is that many of these tests were strongly tied to
the idea that a given implementation provides an ingress controller. Many
service meshes don't, and requiring a GAMMA-conformant mesh to also implement
an ingress controller seemed impractical at best. This resulted in work
restarting on Gateway API _conformance profiles_, as discussed in [GEP-1709].
-->
### 如何确定这种方案的可移植性是真的？

Gateway API 一直在其支持的所有功能的一致性测试上投入大量资源，网格也不例外。
GAMMA 面临的挑战之一是，许多测试都认为一个给定实现会提供 Ingress 控制器。
许多服务网格不提供 Ingress 控制器，要求符合 GAMMA 标准的网格同时实现 Ingress 控制器似乎并不切实际。
这导致在 Gateway API **一致性配置文件**的工作重新启动，如 [GEP-1709] 中所述。

<!--
The basic idea of conformance profiles is that we can define subsets of the
Gateway API, and allow implementations to choose (and document) which subsets
they conform to. GAMMA is adding a new profile, named `Mesh` and described in
[GEP-1686], which checks only the mesh functionality as defined by GAMMA. At
this point, Kuma 2.3+, Linkerd 2.14+, and Istio 1.16+ are all conformant with
the `Mesh` profile.
-->
一致性配置文件的基本思想是，我们可以定义 Gateway API 的子集，并允许实现选择（并记录）他们符合哪些子集。
GAMMA 正在添加一个名为 `Mesh` 的新配置文件，其描述在 [GEP-1686] 中，仅检查由 GAMMA 定义的网格功能。
此时，Kuma 2.3+、Linkerd 2.14+ 和 Istio 1.16+ 都符合 `Mesh` 配置文件的标准。

<!--
## What else is in Gateway API v0.8.0?

This release is all about preparing Gateway API for the upcoming v1.0 release
where HTTPRoute, Gateway, and GatewayClass will graduate to GA. There are two
main changes related to this: CEL validation and API version changes.
-->
## Gateway API v0.8.0 中还有什么？

这个版本的发布都是为了即将到来的 v1.0 版本做准备，其中
HTTPRoute、Gateway 和 GatewayClass 将进级为 GA。与此相关的有两个主要更改：
CEL 验证和 API 版本更改。

<!--
### CEL Validation

The first major change is that Gateway API v0.8.0 is the start of a transition
from webhook validation to [CEL validation][cel] using information built into
the CRDs. That will mean different things depending on the version of
Kubernetes you're using:
-->
### CEL 验证

第一个重大变化是，Gateway API v0.8.0 起从 Webhook 验证转向使用内置于
CRD 中的信息的 [CEL 验证][cel]。取决于你使用的 Kubernetes 版本，这一转换的影响有些不同：

<!--
#### Kubernetes 1.25+

CEL validation is fully supported, and almost all validation is implemented in
CEL. (The sole exception is that header names in header modifier filters can
only do case-insensitive validation. There is more information in [issue
2277].)

We recommend _not_ using the validating webhook on these Kubernetes versions.
-->
#### Kubernetes 1.25+

CEL 验证得到了完全支持，并且几乎所有验证都是在 CEL 中实现的。
（唯一的例外是，标头修饰符过滤器中的标头名称只能进行不区分大小写的验证，
更多的相关信息，请参见 [issue 2277]。）

我们建议在这些 Kubernetes 版本上不使用验证 Webhook。

<!--
#### Kubernetes 1.23 and 1.24

CEL validation is not supported, but Gateway API v0.8.0 CRDs can still be
installed. When you upgrade to Kubernetes 1.25+, the validation included in
these CRDs will automatically take effect.

We recommend continuing to use the validating webhook on these Kubernetes
versions.
-->
#### Kubernetes 1.23 和 1.24

不支持 CEL 验证，但仍可以安装 Gateway API v0.8.0 CRD。
当你升级到 Kubernetes 1.25+ 时，这些 CRD 中包含的验证将自动生效。

我们建议在这些 Kubernetes 版本上继续使用验证 Webhook。

<!--
#### Kubernetes 1.22 and older

Gateway API only commits to support for [5 most recent versions of
Kubernetes][supported-versions]. As such, these versions are no longer
supported by Gateway API, and unfortunately Gateway API v0.8.0 cannot be
installed on them, since CRDs containing CEL validation will be rejected.
-->
#### Kubernetes 1.22 及更早版本

Gateway API 只承诺支持[最新的 5 个 Kubernetes 版本][supported-versions]。
因此，Gateway API 不再支持这些版本，不幸的是，在这些集群版本中无法安装 Gateway API v0.8.0，
因为包含 CEL 验证的 CRD 将被拒绝。

<!--
### API Version Changes

As we prepare for a v1.0 release that will graduate Gateway, GatewayClass, and
HTTPRoute to the `v1` API Version from `v1beta1`, we are continuing the process
of moving away from `v1alpha2` for resources that have graduated to `v1beta1`.
For more information on this change and everything else included in this
release, refer to the [v0.8.0 release notes][v0.8.0 release notes].
-->
### API 版本更改

在我们所准备的 v1.0 版本中，Gateway、GatewayClass 和 HTTPRoute 都会从
`v1beta1` 升级到 `v1` API 版本，对于已升级到 `v1beta1` 的资源，我们将继续从 `v1alpha2` 迁移的过程。

有关此更改以及此版本中包含的所有其他内容的更多信息，请参见 [v0.8.0 发布说明][v0.8.0 release notes]。

<!--
## How can I get started with Gateway API?

Gateway API represents the future of load balancing, routing, and service mesh
APIs in Kubernetes. There are already more than 20 [implementations][impl]
available (including both ingress controllers and service meshes) and the list
keeps growing.
-->
## 如何开始使用 Gateway API？

Gateway API 代表了 Kubernetes 中负载平衡、路由和服务网格 API 的未来。
已经有超过 20 个[实现][impl]可用（包括入口控制器和服务网格），而这一列表还在不断增长。

<!--
If you're interested in getting started with Gateway API, take a look at the
[API concepts documentation][concepts] and check out some of the
[Guides][guides] to try it out. Because this is a CRD-based API, you can
install the latest version on any Kubernetes 1.23+ cluster.
-->
如果你有兴趣开始使用 Gateway API，请查阅 [API 概念文档][concepts] 和一些[指南][guides]以尝试使用它。
因为这是一个基于 CRD 的 API，所以你可以在任何 Kubernetes 1.23+ 集群上安装最新版本。

<!--
If you're specifically interested in helping to contribute to Gateway API, we
would love to have you! Please feel free to [open a new issue][issue] on the
repository, or join in the [discussions][disc]. Also check out the [community
page][community] which includes links to the Slack channel and community
meetings. We look forward to seeing you!!
-->
如果你有兴趣为 Gateway API 做出贡献，我们非常欢迎你！
请随时在仓库中[报告问题][issue]，或加入[讨论][disc]。
另请查看[社区页面][community]，其中包含 Slack 频道和社区会议的链接。
我们期待你的光临！！

<!--
## Further Reading:

- [GEP-1324] provides an overview of the GAMMA goals and some important
  definitions. This GEP is well worth a read for its discussion of the problem
  space.
- [GEP-1426] defines how to use Gateway API route resources, such as
  HTTPRoute, to manage traffic within a service mesh.
- [GEP-1686] builds on the work of [GEP-1709] to define a _conformance
  profile_ for service meshes to be declared conformant with Gateway API.
-->
## 进一步阅读：

- [GEP-1324] 提供了 GAMMA 目标和一些重要定义的概述。这个 GEP 值得一读，因为它讨论了问题空间。
- [GEP-1426] 定义了如何使用 Gateway API 路由资源（如 HTTPRoute）管理服务网格内的流量。
- [GEP-1686] 在 [GEP-1709] 的工作基础上，为声明符合 Gateway API 的服务网格定义了一个一致性配置文件。

<!--
Although these are [Experimental][status] patterns, note that they are available
in the [`standard` release channel][ch], since the GAMMA initiative has not
needed to introduce new resources or fields to date.
-->
虽然这些都是[实验特性][status]，但请注意，它们可在 [standard 发布频道][ch]使用，
因为 GAMMA 计划迄今为止不需要引入新的资源或字段。

<!--
[gamma]:https://gateway-api.sigs.k8s.io/concepts/gamma/
[status]:https://gateway-api.sigs.k8s.io/geps/overview/#status
[ch]:https://gateway-api.sigs.k8s.io/concepts/versioning/#release-channels-eg-experimental-standard
[cel]:/docs/reference/using-api/cel/
[crd]:/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
[concepts]:https://gateway-api.sigs.k8s.io/concepts/api-overview/
[geps]:https://gateway-api.sigs.k8s.io/contributing/enhancement-requests/
[guides]:https://gateway-api.sigs.k8s.io/guides/getting-started/
[impl]:https://gateway-api.sigs.k8s.io/implementations/
[install-crds]:https://gateway-api.sigs.k8s.io/guides/getting-started/#install-the-crds
[issue]:https://github.com/kubernetes-sigs/gateway-api/issues/new/choose
[disc]:https://github.com/kubernetes-sigs/gateway-api/discussions
[community]:https://gateway-api.sigs.k8s.io/contributing/community/
[mesh-routing]:https://gateway-api.sigs.k8s.io/concepts/gamma/#how-the-gateway-api-works-for-service-mesh
[GEP-1426]:https://gateway-api.sigs.k8s.io/geps/gep-1426/
[GEP-1324]:https://gateway-api.sigs.k8s.io/geps/gep-1324/
[GEP-1686]:https://gateway-api.sigs.k8s.io/geps/gep-1686/
[GEP-1709]:https://gateway-api.sigs.k8s.io/geps/gep-1709/
[issue 2277]:https://github.com/kubernetes-sigs/gateway-api/issues/2277
[supported-versions]:https://gateway-api.sigs.k8s.io/concepts/versioning/#supported-versions
[v0.8.0 release notes]:https://github.com/kubernetes-sigs/gateway-api/releases/tag/v0.8.0
[versioning docs]:https://gateway-api.sigs.k8s.io/concepts/versioning/
-->
[gamma]:https://gateway-api.sigs.k8s.io/concepts/gamma/
[status]:https://gateway-api.sigs.k8s.io/geps/overview/#status
[ch]:https://gateway-api.sigs.k8s.io/concepts/versioning/#release-channels-eg-experimental-standard
[cel]:/zh-cn/docs/reference/using-api/cel/
[crd]:/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
[concepts]:https://gateway-api.sigs.k8s.io/concepts/api-overview/
[geps]:https://gateway-api.sigs.k8s.io/contributing/enhancement-requests/
[guides]:https://gateway-api.sigs.k8s.io/guides/getting-started/
[impl]:https://gateway-api.sigs.k8s.io/implementations/
[install-crds]:https://gateway-api.sigs.k8s.io/guides/getting-started/#install-the-crds
[issue]:https://github.com/kubernetes-sigs/gateway-api/issues/new/choose
[disc]:https://github.com/kubernetes-sigs/gateway-api/discussions
[community]:https://gateway-api.sigs.k8s.io/contributing/community/
[mesh-routing]:https://gateway-api.sigs.k8s.io/concepts/gamma/#how-the-gateway-api-works-for-service-mesh
[GEP-1426]:https://gateway-api.sigs.k8s.io/geps/gep-1426/
[GEP-1324]:https://gateway-api.sigs.k8s.io/geps/gep-1324/
[GEP-1686]:https://gateway-api.sigs.k8s.io/geps/gep-1686/
[GEP-1709]:https://gateway-api.sigs.k8s.io/geps/gep-1709/
[issue 2277]:https://github.com/kubernetes-sigs/gateway-api/issues/2277
[supported-versions]:https://gateway-api.sigs.k8s.io/concepts/versioning/#supported-versions
[v0.8.0 release notes]:https://github.com/kubernetes-sigs/gateway-api/releases/tag/v0.8.0
[versioning docs]:https://gateway-api.sigs.k8s.io/concepts/versioning/
