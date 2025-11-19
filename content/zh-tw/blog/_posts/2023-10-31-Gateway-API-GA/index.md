---
layout: blog
title: "Gateway API v1.0：正式發佈（GA）"
date: 2023-10-31T10:00:00-08:00
slug: gateway-api-ga
---

<!--
layout: blog
title: "Gateway API v1.0: GA Release"
date: 2023-10-31T10:00:00-08:00
slug: gateway-api-ga
-->

<!--
**Authors:** Shane Utt (Kong), Nick Young (Isovalent), Rob Scott (Google)
-->
**作者：** Shane Utt (Kong), Nick Young (Isovalent), Rob Scott (Google)

**譯者：** Xin Li (Daocloud)

<!--
On behalf of Kubernetes SIG Network, we are pleased to announce the v1.0 release of [Gateway
API](https://gateway-api.sigs.k8s.io/)! This release marks a huge milestone for
this project. Several key APIs are graduating to GA (generally available), while
other significant features have been added to the Experimental channel.
-->
我們代表 Kubernetes SIG Network 很高興地宣佈 [Gateway API](https://gateway-api.sigs.k8s.io/)
v1.0 版本發佈！此版本是該項目的一個重要里程碑。幾個關鍵的 API 正在逐步進入 GA（正式發佈）階段，
同時其他重要特性已添加到實驗（Experimental）通道中。

<!--
## What's new

### Graduation to v1
This release includes the graduation of
[Gateway](https://gateway-api.sigs.k8s.io/api-types/gateway/),
[GatewayClass](https://gateway-api.sigs.k8s.io/api-types/gatewayclass/), and
[HTTPRoute](https://gateway-api.sigs.k8s.io/api-types/httproute/) to v1, which
means they are now generally available (GA). This API version denotes a high
level of confidence in the API surface and provides guarantees of backwards
compatibility. Note that although, the version of these APIs included in the
Standard channel are now considered stable, that does not mean that they are
complete. These APIs will continue to receive new features via the Experimental
channel as they meet graduation criteria. For more information on how all of
this works, refer to the [Gateway API Versioning
Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).
-->
## 新增內容

### 升級到 v1

此版本將 [Gateway](https://gateway-api.sigs.k8s.io/api-types/gateway/)、
[GatewayClass](https://gateway-api.sigs.k8s.io/api-types/gatewayclass/) 和
[HTTPRoute](https://gateway-api.sigs.k8s.io/api-types/httproute/) 升級到 v1 版本，
這意味着它們現在是正式發佈（GA）的版本。這個 API 版本表明我們對 API 的可感知方面具有較強的信心，並提供向後兼容的保證。
需要注意的是，雖然標準（Standard）通道中所包含的這個版本的 API 集合現在被認爲是穩定的，但這並不意味着它們是完整的。
即便這些 API 已滿足畢業標準，仍將繼續通過實驗（Experimental）通道接收新特性。要了解相關工作的組織方式的進一步信息，請參閱
[Gateway API 版本控制策略](https://gateway-api.sigs.k8s.io/concepts/versioning/)。

<!--
### Logo
Gateway API now has a logo! This logo was designed through a collaborative
process, and is intended to represent the idea that this is a set of Kubernetes
APIs for routing traffic both north-south and east-west:
-->
Gateway API 現在有了自己的 Logo！這個 Logo 是通過協作方式設計的，
旨在表達這是一組用於路由南北向和東西向流量的 Kubernetes API：

![Gateway API Logo](gateway-api-logo.png "Gateway API Logo")

<!--
### CEL Validation
Historically, Gateway API has bundled a validating webhook as part of installing
the API. Starting in v1.0, webhook installation is optional and only recommended
for Kubernetes 1.24. Gateway API now includes
[CEL](/docs/reference/using-api/cel/) validation rules as
part of the
[CRDs](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
This new form of validation is supported in Kubernetes 1.25+, and thus the
validating webhook is no longer required in most installations.
-->
### CEL 驗證

過去，Gateway API 在安裝 API 時綁定了一個驗證性質（Validation）的 Webhook。
從 v1.0 開始，Webhook 的安裝是可選的，僅建議在 Kubernetes 1.24 版本上使用。
Gateway API 現在將 [CEL](/zh-cn/docs/reference/using-api/cel/) 驗證規則包含在
[CRD](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
中。Kubernetes 1.25 及以上版本支持這種新形式的驗證，因此大多數安裝中不再需要驗證性質的 Webhook。

<!--
### Standard channel
This release was primarily focused on ensuring that the existing beta APIs were
well defined and sufficiently stable to graduate to GA. That led to a variety of
spec clarifications, as well as some improvements to status to improve the
overall UX when interacting with Gateway API.
-->
### 標準（Standard）通道

此發行版本主要側重於確保現有 Beta 級別 API 定義良好且足夠穩定，可以升級爲 GA。
其背後意味着爲了提高與 Gateway API 交互時的整體使用者體驗而作的各種規範的澄清以及一些改進。

<!--
### Experimental channel
Most of the changes included in this release were limited to the experimental
channel. These include HTTPRoute timeouts, TLS config from Gateways to backends,
WebSocket support, Gateway infrastructure labels, and more. Stay tuned for a
follow up blog post that will cover each of these new features in detail.
-->
## 實驗（Experimental）通道

此發行版本中包含的大部分更改都限於實驗通道。這些更改包括 HTTPRoute
超時、用於 Gateway 訪問後端的 TLS 設定、WebSocket 支持、Gateway 基礎設施的標籤等等。
請繼續關注後續博客，我們將詳細介紹這些新特性。

<!--
### Everything else
For a full list of the changes included in this release, please refer to the
[v1.0.0 release
notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.0.0).
-->
## 其他內容

有關此版本中包含的所有更改的完整列表，請參閱
[v1.0.0 版本說明](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.0.0)。

<!--
## How we got here

The idea of Gateway API was initially [proposed](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)
4 years ago at KubeCon San Diego as the next generation
of Ingress API. Since then, an incredible community has formed to develop what
has likely become the most collaborative API in Kubernetes history. Over 170
people have contributed to this API so far, and that number continues to grow.
-->
## 發展歷程

Gateway API 的想法最初是在 4 年前的 KubeCon 聖地亞哥[提出](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)的，
下一代 Ingress API。那次會議之後，誕生了一個令人難以置信的社區，致力於開發一種可能是 Kubernetes
歷史上協作關係最密切的 API。
迄今爲止，已有超過 170 人爲此 API 做出了貢獻，而且這個數字還在不斷增長。

<!--
A special thank you to the 20+ [community members who agreed to take on an
official role in the
project](https://github.com/kubernetes-sigs/gateway-api/blob/main/OWNERS_ALIASES),
providing some time for reviews and sharing the load of maintaining the project!

We especially want to highlight the emeritus maintainers that played a pivotal
role in the early development of this project:
-->
特別感謝 20 多位[願意在項目中擔任正式角色](https://github.com/kubernetes-sigs/gateway-api/blob/main/OWNERS_ALIASES)的社區成員，
他們付出了時間進行評審並分擔項目維護的負擔！

我們特別要強調那些在項目早期發展中起到關鍵作用的榮譽維護者：

* [Bowei Du](https://github.com/bowei)
* [Daneyon Hansen](https://github.com/danehans)
* [Harry Bagdi](https://github.com/hbagdi)

<!--
## Try it out

Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
one of the 5 most recent minor versions of Kubernetes (1.24+), you'll be able to
get up and running with the latest version of Gateway API.

To try out the API, follow our [Getting Started
guide](https://gateway-api.sigs.k8s.io/guides/).
-->
## 嘗試一下

與其他 Kubernetes API 不同，你無需升級到最新版本的 Kubernetes 即可獲取最新版本的
Gateway API。只要運行的是 Kubernetes 最新的 5 個次要版本之一（1.24+），
就可以使用最新版本的 Gateway API。

要嘗試此 API，請參照我們的[入門指南](https://gateway-api.sigs.k8s.io/guides/)。

<!--
## What's next

This release is just the beginning of a much larger journey for Gateway API, and
there are still plenty of new features and new ideas in flight for future
releases of the API.
-->
## 下一步

此版本只是 Gateway API 更廣泛前景的開始，將來的 API 版本中還有很多新特性和新想法。

<!--
One of our key goals going forward is to work to stabilize and graduate other
experimental features of the API. These include [support for service
mesh](https://gateway-api.sigs.k8s.io/concepts/gamma/), additional route types
([GRPCRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.GRPCRoute),
[TCPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.TCPRoute),
[TLSRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.TLSRoute),
[UDPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.UDPRoute)),
and a variety of experimental features.
-->
我們未來的一個關鍵目標是努力穩定和升級 API 的其他實驗級特性。
這些特性包括支持[服務網格](https://gateway-api.sigs.k8s.io/concepts/gamma/)、
額外的路由類型（[GRPCRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.GRPCRoute)、
[TCPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.TCPRoute)、
[TLSRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.TLSRoute)、
[UDPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.UDPRoute)）以及各種實驗級特性。

<!--
We've also been working towards moving
[ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/) into
a built-in Kubernetes API that can be used for more than just Gateway API.
Within Gateway API, we've used this resource to safely enable cross-namespace
references, and that concept is now being adopted by other SIGs. The new version
of this API will be owned by SIG Auth and will likely include at least some
modifications as it migrates to a built-in Kubernetes API.
-->
我們還致力於將 [ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/)
移入內置的 Kubernetes API 中，使其不僅僅可用於網關 API。在 Gateway API 中，我們使用這個資源來安全地實現跨命名空間引用，
而這個概念現在被其他 SIG 採納。這個 API 的新版本將歸 SIG Auth 所有，在移到內置的
Kubernetes API 時可能至少包含一些修改。

<!--
### Gateway API at KubeCon + CloudNativeCon

At [KubeCon North America
(Chicago)](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)
and the adjacent [Contributor
Summit](https://www.kubernetes.dev/events/2023/kcsna/) there are several talks
related to Gateway API that will go into more detail on these topics. If you're
attending either of these events this year, considering adding these to your
schedule.
-->
### Gateway API 現身於 KubeCon + CloudNativeCon

在 [KubeCon 北美（芝加哥）](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)
和同場的[貢獻者峯會](https://www.kubernetes.dev/events/2023/kcsna/)上，
有幾個與 Gateway API 相關的演講將詳細介紹這些主題。如果你今年要參加其中的一場活動，
請考慮將它們添加到你的日程安排中。

<!--
**Contributor Summit:**

- [Lessons Learned Building a GA API with CRDs](https://sched.co/1Sp9u)
- [Conformance Profiles: Building a generic conformance test reporting framework](https://sched.co/1Sp9l)
- [Gateway API: Beyond GA](https://sched.co/1SpA9)
-->
**貢獻者峯會：**

- [使用 CRD 構建 GA API 的經驗教訓](https://sched.co/1Sp9u)
- [合規性設定文件：構建通用合規性測試報告框架](https://sched.co/1Sp9l)
- [Gateway API：GA 以後](https://sched.co/1SpA9)

<!--
**KubeCon Main Event:**

- [Gateway API: The Most Collaborative API in Kubernetes History Is GA](https://sched.co/1R2qM)
-->
**KubeCon 主要活動：**

- [Gateway API：Kubernetes 歷史上協作性最強的 API 已經正式發佈](https://sched.co/1R2qM)

<!--
**KubeCon Office Hours:**

Gateway API maintainers will be holding office hours sessions at KubeCon if
you'd like to discuss or brainstorm any related topics. To get the latest
updates on these sessions, join the `#sig-network-gateway-api` channel on
[Kubernetes Slack](https://slack.kubernetes.io/).
-->
**KubeCon 辦公時間：**

如果你想就相關主題發起討論或參與頭腦風暴，請參加 Gateway API 維護人員在 KubeCon 上舉行辦公時間會議。
要獲取有關這些會議的最新更新，請加入 [Kubernetes Slack](https://slack.kubernetes.io/)
上的 `#sig-network-gateway-api` 頻道。

<!--
## Get involved

We've only barely scratched the surface of what's in flight with Gateway API.
There are lots of opportunities to get involved and help define the future of
Kubernetes routing APIs for both Ingress and Mesh.
-->
## 參與其中

我們只是初步介紹了 Gateway API 正在進行的工作。
有很多機會參與並幫助定義 Ingress 和 Mesh 的 Kubernetes 路由 API 的未來。

<!--
If this is interesting to you, please [join us in the
community](https://gateway-api.sigs.k8s.io/contributing/) and help us build the
future of Gateway API together!
-->
如果你對此感興趣，請[加入我們的社區](https://gateway-api.sigs.k8s.io/contributing/)並幫助我們共同構建
Gateway API 的未來！
