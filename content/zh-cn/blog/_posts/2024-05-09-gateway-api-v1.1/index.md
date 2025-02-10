---
layout: blog
title: "Gateway API v1.1：服务网格、GRPCRoute 和更多变化"
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
  和其他评审及发布说明的贡献者
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
继去年十月正式发布 Gateway API 之后，Kubernetes SIG Network 现在又很高兴地宣布
[Gateway API](https://gateway-api.sigs.k8s.io/) v1.1 版本发布。
在本次发布中，有几个特性已进阶至**标准渠道**（GA），特别是对服务网格和 GRPCRoute 的支持也已进阶。
我们还引入了一些新的实验性特性，包括会话持久性和客户端证书验证。

<!--
## What's new

### Graduation to Standard
-->
## 新内容   {#whats-new}

### 进阶至标准渠道   {#graduation-to-standard}

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
本次发布有四个备受期待的特性进阶至标准渠道。这意味着它们不再是实验性的概念；
包含在标准发布渠道中的举措展现了大家对 API 接口的高度信心，并提供向后兼容的保证。
当然，与所有其他 Kubernetes API 一样，标准渠道的特性可以随着时间的推移通过向后兼容的方式演进，
我们当然期待未来对这些新特性有进一步的优化和改进。
有关细节请参阅 [Gateway API 版本控制政策](https://gateway-api.sigs.k8s.io/concepts/versioning/)。

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
#### [服务网格支持](https://gateway-api.sigs.k8s.io/mesh/)

在 Gateway API 中支持服务网格意味着允许服务网格用户使用相同的 API 来管理 Ingress 流量和网格流量，
能够重用相同的策略和路由接口。在 Gateway API v1.1 中，路由（如 HTTPRoute）现在可以将一个 Service 作为 `parentRef`，
以控制到特定服务的流量行为。有关细节请查阅
[Gateway API 服务网格文档](https://gateway-api.sigs.k8s.io/mesh/)或
[Gateway API 实现列表](https://gateway-api.sigs.k8s.io/implementations/#service-mesh-implementation-status)。

<!--
As an example, one could do a canary deployment of a workload deep in an
application's call graph with an HTTPRoute as follows:
-->
例如，你可以使用如下 HTTPRoute 以金丝雀部署深入到应用调用图中的工作负载：

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
通过使用一种便于从一个网格迁移到另一个网格的可移植配置，
此 HTTPRoute 对象将把发送到 `faces` 命名空间中的 `color` Service 的流量按 50/50
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

如果你已经在使用实验性版本的 GRPCRoute，我们建议你暂时不要升级到标准渠道版本的 GRPCRoute，
除非你正使用的控制器已被更新为支持 GRPCRoute v1。
在此之后，你才可以安全地升级到实验性渠道版本的 GRPCRoute v1.1，这个版本同时包含了 v1alpha2 和 v1 的 API。

<!--
#### [ParentReference Port](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.ParentReference)

The `port` field was added to ParentReference, allowing you to attach resources
to Gateway Listeners, Services, or other parent resources
(depending on the implementation). Binding to a port also allows you to attach
to multiple Listeners at once.
-->
#### [ParentReference 端口](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.ParentReference)

`port` 字段已被添加到 ParentReference 中，
允许你将资源挂接到 Gateway 监听器、Service 或其他父资源（取决于实现）。
绑定到某个端口还允许你一次挂接到多个监听器。

<!--
For example, you can attach an HTTPRoute to one or more specific Listeners of a
Gateway as specified by the Listener `port`, instead of the Listener `name` field.

For more information, see
[Attaching to Gateways](https://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways).
-->
例如，你可以将 HTTPRoute 挂接到由监听器 `port` 而不是监听器 `name` 字段所指定的一个或多个特定监听器。

有关细节请参阅[挂接到 Gateways](https://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways)。

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
#### [合规性配置文件和报告](https://gateway-api.sigs.k8s.io/concepts/conformance/#conformance-profiles)

合规性报告 API 被扩展了，添加了 `mode` 字段（用于指定实现的工作模式）以及 `gatewayAPIChannel`（标准或实验性）。
`gatewayAPIVersion` 和 `gatewayAPIChannel` 现在由套件机制自动填充，并附有测试结果的简要描述。
这些报告已通过更加结构化的方式进行重新组织，现在实现可以添加测试是如何运行的有关信息，还能提供复现步骤。

<!--
### New additions to Experimental channel

#### [Gateway Client Certificate Verification](https://gateway-api.sigs.k8s.io/geps/gep-91/)

Gateways can now configure client cert verification for each Gateway Listener by
introducing a new `frontendValidation` field within `tls`. This field
supports configuring a list of CA Certificates that can be used as a trust
anchor to validate the certificates presented by the client.
-->
### 实验性渠道的新增内容

#### [Gateway 客户端证书验证](https://gateway-api.sigs.k8s.io/geps/gep-91/)

Gateway 现在可以通过在 `tls` 内引入的新字段 `frontendValidation` 来为每个
Gateway 监听器配置客户端证书验证。此字段支持配置可用作信任锚的 CA 证书列表，以验证客户端呈现的证书。

<!--
The following example shows how the CACertificate stored in
the `foo-example-com-ca-cert` ConfigMap can be used to validate the certificates
presented by clients connecting to the `foo-https` Gateway Listener.
-->
以下示例显示了如何使用存储在 `foo-example-com-ca-cert` ConfigMap 中的 CACertificate
来验证连接到 `foo-https` Gateway 监听器的客户端所呈现的证书。

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: client-validation-basic
spec:
  gatewayClassName: acme-lb
  listeners:
    name: foo-https
    protocol: HTTPS
    port: 443
    hostname: foo.example.com
  tls:
    certificateRefs:
      kind: Secret
      group: ""
      name: foo-example-com-cert
    frontendValidation:
      caCertificateRefs:
        kind: ConfigMap
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
#### [会话持久性和 BackendLBPolicy](https://gateway-api.sigs.k8s.io/geps/gep-1619/)

[会话持久性](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.SessionPersistence)
通过新的策略（[BackendLBPolicy](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.BackendLBPolicy)）
引入到 Gateway API 中用于服务级配置，在 HTTPRoute 和 GRPCRoute 内以字段的形式用于路由级配置。
BackendLBPolicy 和路由级 API 提供相同的会话持久性配置，包括会话超时、会话名称、会话类型和 cookie 生命周期类型。

<!--
Below is an example configuration of `BackendLBPolicy` that enables cookie-based
session persistence for the `foo` service. It sets the session name to
`foo-session`, defines absolute and idle timeouts, and configures the cookie to
be a session cookie:
-->
以下是 `BackendLBPolicy` 的示例配置，为 `foo` 服务启用基于 Cookie 的会话持久性。
它将会话名称设置为 `foo-session`，定义绝对超时时间和空闲超时时间，并将 Cookie 配置为会话 Cookie：

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

#### [TLS 术语阐述](https://gateway-api.sigs.k8s.io/geps/gep-2907/)

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
为了在整个 API 中让我们的 TLS 术语更加一致以实现更广泛的目标，
我们对 BackendTLSPolicy 做了一些破坏性变更。
这就产生了新的 API 版本（v1alpha3），且将需要这个策略所有现有的实现来正确处理版本升级，
例如通过备份数据并在安装这个新版本之前卸载 v1alpha2 版本。

所有引用了 v1alpha2 BackendTLSPolicy 的字段都将需要更新为 v1alpha3。这些字段的具体变更包括：

<!--
- `targetRef` becomes `targetRefs` to allow a BackendTLSPolicy to attach to
  multiple targets
- `tls` becomes `validation`
- `tls.caCertRefs` becomes `validation.caCertificateRefs`
- `tls.wellKnownCACerts` becomes `validation.wellKnownCACertificates`
-->
- `targetRef` 变为 `targetRefs` 以允许 BackendTLSPolicy 挂接到多个目标
- `tls` 变为 `validation`
- `tls.caCertRefs` 变为 `validation.caCertificateRefs`
- `tls.wellKnownCACerts` 变为 `validation.wellKnownCACertificates`

<!--
For a full list of the changes included in this release, please refer to the
[v1.1.0 release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.1.0).
-->
有关本次发布包含的完整变更列表，请参阅
[v1.1.0 发布说明](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.1.0)。

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

Gateway API 的想法最初是在 2019 年 KubeCon San Diego 上作为下一代 Ingress API
[提出的](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)。
从那时起，一个令人瞩目的社区逐渐形成，共同开发出了可能成为
[Kubernetes 历史上最具合作精神的 API](https://www.youtube.com/watch?v=V3Vu_FWb4l4)。
到目前为止，已有超过 200 人为该 API 做过贡献，而且这一数字还在不断攀升。

<!--
The maintainers would like to thank _everyone_ who's contributed to Gateway API, whether in the
form of commits to the repo, discussion, ideas, or general support. We literally
couldn't have gotten this far without the support of this dedicated and active
community.
-->
维护者们要感谢为 Gateway API 做出贡献的**每一个人**，
无论是提交代码、参与讨论、提供创意，还是给予常规支持，我们都在此表示诚挚的感谢。
没有这个专注且活跃的社区的支持，我们不可能走到这一步。

<!--
## Try it out

Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
Kubernetes 1.26 or later, you'll be able to get up and running with this
version of Gateway API.
-->
## 试用一下   {#try-it-out}

与其他 Kubernetes API 不同，你不需要升级到最新版本的 Kubernetes 即可获得最新版本的 Gateway API。
只要你运行的是 Kubernetes 1.26 或更高版本，你就可以使用这个版本的 Gateway API。

<!--
To try out the API, follow our [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).

## Get involved

There are lots of opportunities to get involved and help define the future of
Kubernetes routing APIs for both ingress and service mesh.
-->
要试用此 API，请参阅[入门指南](https://gateway-api.sigs.k8s.io/guides/)。

## 参与进来   {#get-involved}

你有很多机会可以参与进来并帮助为 Ingress 和服务网格定义 Kubernetes 路由 API 的未来。

<!--
* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
  and help us build the future of Gateway API together!
-->
* 查阅[用户指南](https://gateway-api.sigs.k8s.io/guides)以了解可以解决哪些用例。
* 试用其中一个[现有的 Gateway 控制器](https://gateway-api.sigs.k8s.io/implementations/)。
* 或者[加入我们的社区](https://gateway-api.sigs.k8s.io/contributing/)，帮助我们一起构建 Gateway API 的未来！

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
## 相关的 Kubernetes 博文   {#related-kubernetes-blog-articles}

* 2023 年 11 月 [Gateway API v1.0 中的新实验性特性](/blog/2023/11/28/gateway-api-ga/)
* 2023 年 10 月 [Gateway API v1.0：正式发布（GA）](/zh-cn/blog/2023/10/31/gateway-api-ga/)
* 2023 年 10 月[介绍 ingress2gateway；简化 Gateway API 升级](/blog/2023/10/25/introducing-ingress2gateway/)
* 2023 年 8 月 [Gateway API v0.8.0：引入服务网格支持](/zh-cn/blog/2023/08/29/gateway-api-v0-8/)
  