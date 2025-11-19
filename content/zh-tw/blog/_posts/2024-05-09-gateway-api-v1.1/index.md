---
layout: blog
title: "Gateway API v1.1：服務網格、GRPCRoute 和更多變化"
date: 2024-05-09T09:00:00-08:00
slug: gateway-api-v1-1
author: >
  [Richard Belleville](https://github.com/gnossen) (Google),
  [Frank Budinsky](https://github.com/frankbu) (IBM),
  [Arko Dasgupta](https://github.com/arkodg) (Tetrate),
  [Flynn](https://github.com/kflynn) (Buoyant),
  [Candace Holman](https://github.com/candita) (Red Hat),
  [John Howard](https://github.com/howardjohn) (Solo.io),
  [Christine Kim](https://github.com/xtineskim) (Isovalent),
  [Mattia Lavacca](https://github.com/mlavacca) (Kong),
  [Keith Mattix](https://github.com/keithmattix) (Microsoft),
  [Mike Morris](https://github.com/mikemorris) (Microsoft),
  [Rob Scott](https://github.com/robscott) (Google),
  [Grant Spence](https://github.com/gcs278) (Red Hat),
  [Shane Utt](https://github.com/shaneutt) (Kong),
  [Gina Yeh](https://github.com/ginayeh) (Google),
  和其他評審及發佈說明的貢獻者
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Gateway API v1.1: Service mesh, GRPCRoute, and a whole lot more"
date: 2024-05-09T09:00:00-08:00
slug: gateway-api-v1-1
author: >
  [Richard Belleville](https://github.com/gnossen) (Google),
  [Frank Budinsky](https://github.com/frankbu) (IBM),
  [Arko Dasgupta](https://github.com/arkodg) (Tetrate),
  [Flynn](https://github.com/kflynn) (Buoyant),
  [Candace Holman](https://github.com/candita) (Red Hat),
  [John Howard](https://github.com/howardjohn) (Solo.io),
  [Christine Kim](https://github.com/xtineskim) (Isovalent),
  [Mattia Lavacca](https://github.com/mlavacca) (Kong),
  [Keith Mattix](https://github.com/keithmattix) (Microsoft),
  [Mike Morris](https://github.com/mikemorris) (Microsoft),
  [Rob Scott](https://github.com/robscott) (Google),
  [Grant Spence](https://github.com/gcs278) (Red Hat),
  [Shane Utt](https://github.com/shaneutt) (Kong),
  [Gina Yeh](https://github.com/ginayeh) (Google),
  and other review and release note contributors
-->

![Gateway API logo](gateway-api-logo.svg)

<!--
Following the GA release of Gateway API last October, Kubernetes
SIG Network is pleased to announce the v1.1 release of
[Gateway API](https://gateway-api.sigs.k8s.io/). In this release, several features are graduating to
_Standard Channel_ (GA), notably including support for service mesh and
GRPCRoute. We're also introducing some new experimental features, including
session persistence and client certificate verification.
-->
繼去年十月正式發佈 Gateway API 之後，Kubernetes SIG Network 現在又很高興地宣佈
[Gateway API](https://gateway-api.sigs.k8s.io/) v1.1 版本發佈。
在本次發佈中，有幾個特性已進階至**標準渠道**（GA），特別是對服務網格和 GRPCRoute 的支持也已進階。
我們還引入了一些新的實驗性特性，包括會話持久性和客戶端證書驗證。

<!--
## What's new

### Graduation to Standard
-->
## 新內容   {#whats-new}

### 進階至標準渠道   {#graduation-to-standard}

<!--
This release includes the graduation to Standard of four eagerly awaited features.
This means they are no longer experimental concepts; inclusion in the Standard
release channel denotes a high level of confidence in the API surface and
provides guarantees of backward compatibility. Of course, as with any other
Kubernetes API, Standard Channel features can continue to evolve with
backward-compatible additions over time, and we certainly expect further
refinements and improvements to these new features in the future.
For more information on how all of this works, refer to the
[Gateway API Versioning Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).
-->
本次發佈有四個備受期待的特性進階至標準渠道。這意味着它們不再是實驗性的概念；
包含在標準發佈渠道中的舉措展現了大家對 API 接口的高度信心，並提供向後兼容的保證。
當然，與所有其他 Kubernetes API 一樣，標準渠道的特性可以隨着時間的推移通過向後兼容的方式演進，
我們當然期待未來對這些新特性有進一步的優化和改進。
有關細節請參閱 [Gateway API 版本控制政策](https://gateway-api.sigs.k8s.io/concepts/versioning/)。

<!--
#### [Service Mesh Support](https://gateway-api.sigs.k8s.io/mesh/)

Service mesh support in Gateway API allows service mesh users to use the same
API to manage ingress traffic and mesh traffic, reusing the same policy and
routing interfaces. In Gateway API v1.1, routes (such as HTTPRoute) can now have
a Service as a `parentRef`, to control how traffic to specific services behave.
For more information, read the
[Gateway API service mesh documentation](https://gateway-api.sigs.k8s.io/mesh/)
or see the
[list of Gateway API implementations](https://gateway-api.sigs.k8s.io/implementations/#service-mesh-implementation-status).
-->
#### [服務網格支持](https://gateway-api.sigs.k8s.io/mesh/)

在 Gateway API 中支持服務網格意味着允許服務網格使用者使用相同的 API 來管理 Ingress 流量和網格流量，
能夠重用相同的策略和路由接口。在 Gateway API v1.1 中，路由（如 HTTPRoute）現在可以將一個 Service 作爲 `parentRef`，
以控制到特定服務的流量行爲。有關細節請查閱
[Gateway API 服務網格文檔](https://gateway-api.sigs.k8s.io/mesh/)或
[Gateway API 實現列表](https://gateway-api.sigs.k8s.io/implementations/#service-mesh-implementation-status)。

<!--
As an example, one could do a canary deployment of a workload deep in an
application's call graph with an HTTPRoute as follows:
-->
例如，你可以使用如下 HTTPRoute 以金絲雀部署深入到應用調用圖中的工作負載：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: color-canary
  namespace: faces
spec:
  parentRefs:
    - name: color
      kind: Service
      group: ""
      port: 80
  rules:
  - backendRefs:
    - name: color
      port: 80
      weight: 50
    - name: color2
      port: 80
      weight: 50
```

<!--
This would split traffic sent to the `color` Service in the `faces` namespace
50/50 between the original `color` Service and the `color2` Service, using a
portable configuration that's easy to move from one mesh to another.
-->
通過使用一種便於從一個網格遷移到另一個網格的可移植設定，
此 HTTPRoute 對象將把發送到 `faces` 命名空間中的 `color` Service 的流量按 50/50
拆分到原始的 `color` Service 和 `color2` Service 上。

<!--
#### [GRPCRoute](https://gateway-api.sigs.k8s.io/guides/grpc-routing/)

If you are already using the experimental version of GRPCRoute, we recommend holding
off on upgrading to the standard channel version of GRPCRoute until the
controllers you're using have been updated to support GRPCRoute v1. Until then,
it is safe to upgrade to the experimental channel version of GRPCRoute in v1.1
that includes both v1alpha2 and v1 API versions.
-->
#### [GRPCRoute](https://gateway-api.sigs.k8s.io/guides/grpc-routing/)

如果你已經在使用實驗性版本的 GRPCRoute，我們建議你暫時不要升級到標準渠道版本的 GRPCRoute，
除非你正使用的控制器已被更新爲支持 GRPCRoute v1。
在此之後，你纔可以安全地升級到實驗性渠道版本的 GRPCRoute v1.1，這個版本同時包含了 v1alpha2 和 v1 的 API。

<!--
#### [ParentReference Port](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.ParentReference)

The `port` field was added to ParentReference, allowing you to attach resources
to Gateway Listeners, Services, or other parent resources
(depending on the implementation). Binding to a port also allows you to attach
to multiple Listeners at once.
-->
#### [ParentReference 端口](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.ParentReference)

`port` 字段已被添加到 ParentReference 中，
允許你將資源掛接到 Gateway 監聽器、Service 或其他父資源（取決於實現）。
綁定到某個端口還允許你一次掛接到多個監聽器。

<!--
For example, you can attach an HTTPRoute to one or more specific Listeners of a
Gateway as specified by the Listener `port`, instead of the Listener `name` field.

For more information, see
[Attaching to Gateways](https://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways).
-->
例如，你可以將 HTTPRoute 掛接到由監聽器 `port` 而不是監聽器 `name` 字段所指定的一個或多個特定監聽器。

有關細節請參閱[掛接到 Gateways](https://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways)。

<!--
#### [Conformance Profiles and Reports](https://gateway-api.sigs.k8s.io/concepts/conformance/#conformance-profiles)

The conformance report API has been expanded with the `mode` field (intended to
specify the working mode of the implementation), and the `gatewayAPIChannel`
(standard or experimental). The `gatewayAPIVersion` and `gatewayAPIChannel` are
now filled in automatically by the suite machinery, along with a brief
description of the testing outcome. The Reports have been reorganized in a more
structured way, and the implementations can now add information on how the tests
have been run and provide reproduction steps.
-->
#### [合規性設定文件和報告](https://gateway-api.sigs.k8s.io/concepts/conformance/#conformance-profiles)

合規性報告 API 被擴展了，添加了 `mode` 字段（用於指定實現的工作模式）以及 `gatewayAPIChannel`（標準或實驗性）。
`gatewayAPIVersion` 和 `gatewayAPIChannel` 現在由套件機制自動填充，並附有測試結果的簡要描述。
這些報告已通過更加結構化的方式進行重新組織，現在實現可以添加測試是如何運行的有關信息，還能提供復現步驟。

<!--
### New additions to Experimental channel

#### [Gateway Client Certificate Verification](https://gateway-api.sigs.k8s.io/geps/gep-91/)

Gateways can now configure client cert verification for each Gateway Listener by
introducing a new `frontendValidation` field within `tls`. This field
supports configuring a list of CA Certificates that can be used as a trust
anchor to validate the certificates presented by the client.
-->
### 實驗性渠道的新增內容

#### [Gateway 客戶端證書驗證](https://gateway-api.sigs.k8s.io/geps/gep-91/)

Gateway 現在可以通過在 `tls` 內引入的新字段 `frontendValidation` 來爲每個
Gateway 監聽器設定客戶端證書驗證。此字段支持設定可用作信任錨的 CA 證書列表，以驗證客戶端呈現的證書。

<!--
The following example shows how the CACertificate stored in
the `foo-example-com-ca-cert` ConfigMap can be used to validate the certificates
presented by clients connecting to the `foo-https` Gateway Listener.
-->
以下示例顯示瞭如何使用存儲在 `foo-example-com-ca-cert` ConfigMap 中的 CACertificate
來驗證連接到 `foo-https` Gateway 監聽器的客戶端所呈現的證書。

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: client-validation-basic
spec:
  gatewayClassName: acme-lb
  listeners:
  - name: foo-https
    protocol: HTTPS
    port: 443
    hostname: foo.example.com
    tls:
      certificateRefs:
      - kind: Secret
        group: ""
        name: foo-example-com-cert
      frontendValidation:
        caCertificateRefs:
        - kind: ConfigMap
          group: ""
          name: foo-example-com-ca-cert
```

<!--
#### [Session Persistence and BackendLBPolicy](https://gateway-api.sigs.k8s.io/geps/gep-1619/)

[Session Persistence](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.SessionPersistence)
is being introduced to Gateway API via a new policy
([BackendLBPolicy](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.BackendLBPolicy))
for Service-level configuration and as fields within HTTPRoute
and GRPCRoute for route-level configuration. The BackendLBPolicy and route-level
APIs provide the same session persistence configuration, including session
timeouts, session name, session type, and cookie lifetime type.
-->
#### [會話持久性和 BackendLBPolicy](https://gateway-api.sigs.k8s.io/geps/gep-1619/)

[會話持久性](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.SessionPersistence)
通過新的策略（[BackendLBPolicy](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.BackendLBPolicy)）
引入到 Gateway API 中用於服務級設定，在 HTTPRoute 和 GRPCRoute 內以字段的形式用於路由級設定。
BackendLBPolicy 和路由級 API 提供相同的會話持久性設定，包括會話超時、會話名稱、會話類型和 cookie 生命週期類型。

<!--
Below is an example configuration of `BackendLBPolicy` that enables cookie-based
session persistence for the `foo` service. It sets the session name to
`foo-session`, defines absolute and idle timeouts, and configures the cookie to
be a session cookie:
-->
以下是 `BackendLBPolicy` 的示例設定，爲 `foo` 服務啓用基於 Cookie 的會話持久性。
它將會話名稱設置爲 `foo-session`，定義絕對超時時間和空閒超時時間，並將 Cookie 設定爲會話 Cookie：

```yaml
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: BackendLBPolicy
metadata:
  name: lb-policy
  namespace: foo-ns
spec:
  targetRefs:
  - group: core
    kind: service
    name: foo
  sessionPersistence:
    sessionName: foo-session
    absoluteTimeout: 1h
    idleTimeout: 30m
    type: Cookie
    cookieConfig:
      lifetimeType: Session
```

<!--
### Everything else

#### [TLS Terminology Clarifications](https://gateway-api.sigs.k8s.io/geps/gep-2907/)
-->
### 其他更新

#### [TLS 術語闡述](https://gateway-api.sigs.k8s.io/geps/gep-2907/)

<!--
As part of a broader goal of making our TLS terminology more consistent
throughout the API, we've introduced some breaking changes to BackendTLSPolicy.
This has resulted in a new API version (v1alpha3) and will require any existing
implementations of this policy to properly handle the version upgrade, e.g.
by backing up data and uninstalling the v1alpha2 version before installing this
newer version.

Any references to v1alpha2 BackendTLSPolicy fields will need to be updated to
v1alpha3. Specific changes to fields include:
-->
爲了在整個 API 中讓我們的 TLS 術語更加一致以實現更廣泛的目標，
我們對 BackendTLSPolicy 做了一些破壞性變更。
這就產生了新的 API 版本（v1alpha3），且將需要這個策略所有現有的實現來正確處理版本升級，
例如通過備份數據並在安裝這個新版本之前卸載 v1alpha2 版本。

所有引用了 v1alpha2 BackendTLSPolicy 的字段都將需要更新爲 v1alpha3。這些字段的具體變更包括：

<!--
- `targetRef` becomes `targetRefs` to allow a BackendTLSPolicy to attach to
  multiple targets
- `tls` becomes `validation`
- `tls.caCertRefs` becomes `validation.caCertificateRefs`
- `tls.wellKnownCACerts` becomes `validation.wellKnownCACertificates`
-->
- `targetRef` 變爲 `targetRefs` 以允許 BackendTLSPolicy 掛接到多個目標
- `tls` 變爲 `validation`
- `tls.caCertRefs` 變爲 `validation.caCertificateRefs`
- `tls.wellKnownCACerts` 變爲 `validation.wellKnownCACertificates`

<!--
For a full list of the changes included in this release, please refer to the
[v1.1.0 release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.1.0).
-->
有關本次發佈包含的完整變更列表，請參閱
[v1.1.0 發佈說明](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.1.0)。

<!--
## Gateway API background

The idea of Gateway API was initially [proposed](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)
at the 2019 KubeCon San Diego as the next generation
of Ingress API. Since then, an incredible community has formed to develop what
has likely become the
[most collaborative API in Kubernetes history](https://www.youtube.com/watch?v=V3Vu_FWb4l4).
Over 200 people have contributed to this API so far, and that number continues to grow.
-->
## Gateway API 背景   {#gateway-api-background}

Gateway API 的想法最初是在 2019 年 KubeCon San Diego 上作爲下一代 Ingress API
[提出的](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)。
從那時起，一個令人矚目的社區逐漸形成，共同開發出了可能成爲
[Kubernetes 歷史上最具合作精神的 API](https://www.youtube.com/watch?v=V3Vu_FWb4l4)。
到目前爲止，已有超過 200 人爲該 API 做過貢獻，而且這一數字還在不斷攀升。

<!--
The maintainers would like to thank _everyone_ who's contributed to Gateway API, whether in the
form of commits to the repo, discussion, ideas, or general support. We literally
couldn't have gotten this far without the support of this dedicated and active
community.
-->
維護者們要感謝爲 Gateway API 做出貢獻的**每一個人**，
無論是提交代碼、參與討論、提供創意，還是給予常規支持，我們都在此表示誠摯的感謝。
沒有這個專注且活躍的社區的支持，我們不可能走到這一步。

<!--
## Try it out

Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
Kubernetes 1.26 or later, you'll be able to get up and running with this
version of Gateway API.
-->
## 試用一下   {#try-it-out}

與其他 Kubernetes API 不同，你不需要升級到最新版本的 Kubernetes 即可獲得最新版本的 Gateway API。
只要你運行的是 Kubernetes 1.26 或更高版本，你就可以使用這個版本的 Gateway API。

<!--
To try out the API, follow our [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).

## Get involved

There are lots of opportunities to get involved and help define the future of
Kubernetes routing APIs for both ingress and service mesh.
-->
要試用此 API，請參閱[入門指南](https://gateway-api.sigs.k8s.io/guides/)。

## 參與進來   {#get-involved}

你有很多機會可以參與進來並幫助爲 Ingress 和服務網格定義 Kubernetes 路由 API 的未來。

<!--
* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
  and help us build the future of Gateway API together!
-->
* 查閱[使用者指南](https://gateway-api.sigs.k8s.io/guides)以瞭解可以解決哪些用例。
* 試用其中一個[現有的 Gateway 控制器](https://gateway-api.sigs.k8s.io/implementations/)。
* 或者[加入我們的社區](https://gateway-api.sigs.k8s.io/contributing/)，幫助我們一起構建 Gateway API 的未來！

<!--
## Related Kubernetes blog articles

* [New Experimental Features in Gateway API v1.0](/blog/2023/11/28/gateway-api-ga/)
  11/2023
* [Gateway API v1.0: GA Release](/blog/2023/10/31/gateway-api-ga/)
  10/2023
* [Introducing ingress2gateway; Simplifying Upgrades to Gateway API](/blog/2023/10/25/introducing-ingress2gateway/)
  10/2023
* [Gateway API v0.8.0: Introducing Service Mesh Support](/blog/2023/08/29/gateway-api-v0-8/)
  08/2023
-->
## 相關的 Kubernetes 博文   {#related-kubernetes-blog-articles}

* 2023 年 11 月 [Gateway API v1.0 中的新實驗性特性](/blog/2023/11/28/gateway-api-ga/)
* 2023 年 10 月 [Gateway API v1.0：正式發佈（GA）](/zh-cn/blog/2023/10/31/gateway-api-ga/)
* 2023 年 10 月[介紹 ingress2gateway；簡化 Gateway API 升級](/blog/2023/10/25/introducing-ingress2gateway/)
* 2023 年 8 月 [Gateway API v0.8.0：引入服務網格支持](/zh-cn/blog/2023/08/29/gateway-api-v0-8/)
  