---
layout: blog
title: "Gateway API v1.6：TCPRoute 和 UDPRoute 进阶为标准版"
date: 2026-08-03T08:00:00-08:00
slug: gateway-api-v1-6-release
author: >
  [Beka Modebadze](https://github.com/bexxmodd) (Google),
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
translator: >
  [Michael Yao](https://github.com/windsonsea)
---
<!--
layout: blog
title: "Gateway API v1.6: TCPRoute and UDPRoute Graduate to Standard"
date: 2026-08-03T08:00:00-08:00
slug: gateway-api-v1-6-release
author: >
  [Beka Modebadze](https://github.com/bexxmodd) (Google),
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
-->

![Gateway API 徽标](gateway-api-logo.svg)

<!--
The Kubernetes SIG Network community is thrilled to share the release of **Gateway API v1.6.0**, which was released on June 30th of this year!
-->
Kubernetes SIG Network 社区欣然宣布 **Gateway API v1.6.0** 发布！该版本已于今年 6 月 30 日发布。

<!--
Gateway API has become the standard for modern, role-oriented,
and expressive service networking in Kubernetes.
In previous releases, Gateway API established a production-grade foundation
for HTTP and TLS layer 7 traffic.
With version 1.6.0, Gateway API takes a major step forward by expanding
standard layer 4 protocol routing and introducing cleaner API boundaries for experimental innovation.
-->
Gateway API 已成为 Kubernetes 中现代化、面向角色且表达力强的服务网络标准。
在之前的版本中，Gateway API 已为 HTTP 和 TLS 第 7 层流量建立了生产级基础。
在 1.6.0 版本中，Gateway API 通过扩展标准的第 4 层协议路由，并为实验性创新引入更清晰的 API 边界，迈出了重要一步。

<!--
Here is a quick summary of what's new in Gateway API v1.6.0:

- **TCPRoute and UDPRoute Graduate to Standard**: Raw L4 TCP and UDP traffic routing reach GA stability in the `v1` API version.
- **Experimental API Group Separation**: Experimental resources transition to a distinct API group (`gateway.networking.x-k8s.io`) with an `X` prefix to make experimental vs. standard boundaries crystal clear.

Let's dive into the details!
-->
以下是 Gateway API v1.6.0 新特性的快速概览：

- **TCPRoute 和 UDPRoute 进阶为标准版**：原始 L4 TCP 和 UDP 流量路由在 `v1` API 版本中达到 GA 稳定级别。
- **实验性 API 组分离**：实验性资源迁移至独立的 API 组（`gateway.networking.x-k8s.io`），
  并添加 `X` 前缀，使实验性与标准 API 的边界一目了然。

下面让我们深入了解详情！

<!--
## TCPRoute and UDPRoute graduate to Standard
-->
## TCPRoute 和 UDPRoute 进阶为标准版 {#tcproute-and-udproute-graduate-to-standard}

<!--
Leads: [Nick Young](https://github.com/youngnick), [Ricardo Katz](https://github.com/rikatz) and [Zac Nixon](https://github.com/zac-nixon)

* [GEP-2644 - TCPRoute](https://gateway-api.sigs.k8s.io/geps/gep-2644/)
* [GEP-2645 - UDPRoute](https://gateway-api.sigs.k8s.io/geps/gep-2645/)
-->
负责人：[Nick Young](https://github.com/youngnick)、[Ricardo Katz](https://github.com/rikatz)
和 [Zac Nixon](https://github.com/zac-nixon)

* [GEP-2644 - TCPRoute](https://gateway-api.sigs.k8s.io/geps/gep-2644/)
* [GEP-2645 - UDPRoute](https://gateway-api.sigs.k8s.io/geps/gep-2645/)

<!--
Until now, Gateway API only offered a stable routing model for HTTP and TLS traffic.
Workloads that speak a raw protocol over TCP or UDP - databases,
DNS, VoIP, gaming, IoT telemetry - had no portable way to plug
into a Gateway. Users either fell back to a plain Kubernetes Service,
or to an implementation-specific CRD that doesn't travel between Gateway controllers.

[TCPRoute] and [UDPRoute] close that gap: they route traffic to backends based on protocol and port alone, no L7 awareness required.
With this release, both have graduated from the Experimental channel to Standard, and moved to the `v1` API version.
The `v1alpha2` version of each was deprecated as of the v1.6 release, and will be removed in a future release.
-->
此前，Gateway API 只为 HTTP 和 TLS 流量提供稳定的路由模型。
对于通过 TCP 或 UDP 使用原始协议的工作负载（例如数据库、DNS、VoIP、游戏和 IoT 遥测），
没有可移植的方式接入 Gateway。用户只能退回使用普通 Kubernetes Service，
或使用无法在不同 Gateway 控制器之间移植的、实现特定的 CRD。

[TCPRoute] 和 [UDPRoute] 填补了这一空白：它们仅依据协议和端口将流量路由到后端，无需感知 L7。
在此版本中，两者均从 Experimental 通道升级到 Standard，并迁移到 `v1` API 版本。
两个资源的 `v1alpha2` 版本自 v1.6 起被弃用，并将在未来版本中移除。

<!--
### How it works

A Gateway needs a listener that allows TCPRoute attachment:
-->
### 工作原理 {#how-it-works}

Gateway 需要配置一个允许附加 TCPRoute 的监听器：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
    - name: foo
      protocol: TCP
      port: 12345
      allowedRoutes:
        kinds:
          - kind: TCPRoute
```

<!--
A TCPRoute then attaches to that listener and forwards traffic to a backend:
-->
随后，TCPRoute 会附加到该监听器并将流量转发到后端：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: TCPRoute
metadata:
  name: tcp-app
spec:
  parentRefs:
    - name: example-gateway
      sectionName: foo
  rules:
    - backendRefs:
        - name: my-foo-service
          port: 6000
```

<!--
Traffic arriving on the Gateway's port `12345` is proxied to the endpoints of `my-foo-service` on port `6000`. Omitting `sectionName` and `port` from `parentRefs` attaches the route to every TCP listener on the Gateway instead of a single one.

UDPRoute follows the same pattern; swap the listener protocol and the route kind:
-->
到达 Gateway 端口 `12345` 的流量会被代理到 `my-foo-service` 的端口 `6000` 上的端点。
从 `parentRefs` 中省略 `sectionName` 和 `port`，会将路由附加到 Gateway 上的每个 TCP 监听器，而非其中的某一个。

UDPRoute 遵循相同模式；只需替换监听器协议和路由类型：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
    - name: foo
      protocol: UDP
      port: 12345
      allowedRoutes:
        kinds:
          - kind: UDPRoute
---
apiVersion: gateway.networking.k8s.io/v1
kind: UDPRoute
metadata:
  name: udp-app
spec:
  parentRefs:
    - name: example-gateway
      sectionName: foo
  rules:
    - backendRefs:
        - name: my-foo-service
          port: 6000
```

<!--
## XBackend arrives in Experimental

Leads: [Keith Mattix II](https://github.com/keithmattix) 

* [GEP-4894 - Backend Resource](https://github.com/kubernetes-sigs/gateway-api/issues/4894)

Gateway API v1.6 introduces the new `XBackend` resource, which is a general-purpose decorator for Service (and other backend types) within Gateway API.
-->
## XBackend 进入 Experimental {#xbackend-arrives-in-experimental}

负责人：[Keith Mattix II](https://github.com/keithmattix)

* [GEP-4894 - Backend Resource](https://github.com/kubernetes-sigs/gateway-api/issues/4894)

Gateway API v1.6 引入了新的 `XBackend` 资源，它是 Gateway API 中适用于 Service（及其他后端类型）的通用装饰器。

<!--
The Service resource is an amazing, stable, and flexible object, but that comes with some costs: The flexibility creates a lot of edge cases that Gateway API needs to handle, and the stability makes it impossible to add new concepts to Service.

The XBackend resource builds on the ideas in the upstream [`EndpointSelector` KEP](https://github.com/kubernetes/enhancements/issues/6116), to add a Gateway API-native object that still targets the backend app, while allowing the community to extend it to handle use cases that are difficult or dangerous to handle with Service.
-->
Service 资源非常出色、稳定且灵活，但这也带来了一些代价：灵活性产生了许多 Gateway API 需要处理的边界情况，
而稳定性又使得无法为 Service 添加新概念。

`XBackend` 资源基于上游 [`EndpointSelector` KEP](https://github.com/kubernetes/enhancements/issues/6116)
中的构想，新增了一个原生 Gateway API 对象，它仍指向后端应用，同时允许社区将其扩展到那些使用
Service 难以或不安全地处理的场景。

<!--
The first version of XBackend includes support for ExternalHostname destinations, which are ruled out from Service support in Gateway API because of the possibility of confused deputy attacks.

For XBackend, this support is an Extended/Optional feature, allowing implementations and users to opt in once they understand the security tradeoffs.

This support is very useful for egress use cases (which are most commonly used for cluster-hosted agentic workloads), which the community is also working towards formalizing in GEPs about Gateways for Egress (work in progress, stay tuned!)
-->
XBackend 的首个版本支持 ExternalHostname 目的地。由于可能发生混淆代理人攻击，
Gateway API 不会在 Service 中支持这种目的地。

对于 XBackend，此支持属于 Extended/Optional 特性，允许实现和用户在理解安全权衡后选择启用。

该支持对于出口场景非常有用（最常见于集群托管的智能体工作负载）。
社区也正通过关于出口 Gateway 的 GEP 来正式化这一场景（仍在进行中，敬请关注！）。

<!--
**The XBackend API is experimental and its behavior can change, do not assume it is ready for production**

An example of a Gateway with an ExternalName backend that can be used for egress to a cloud AI API is as follows:
-->
**XBackend API 处于实验阶段，其行为可能会变更；请勿假定它已可用于生产环境。**

以下示例展示了一个带有 ExternalName 后端的 Gateway，可用于向云端 AI API 发起出口流量：

<!--
```yaml
# Gateway-level TLS remains authoritative for incoming connections
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
spec:
  listeners:
  - name: https
    protocol: HTTPS
    tls:
      certificateRefs:
      - name: gateway-cert
---
# Backend resource for external destination
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XBackend
metadata:
  name: ai-provider-api
  namespace: ai-apps
spec:
  type: ExternalHostname
  externalHostname:
    hostname: api.ai-provider.com

---
# HTTPRoute referencing XBackend
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
spec:
  rules:
  - backendRefs:
    - name: ai-provider-api
      kind: XBackend
      group: gateway.networking.x-k8s.io
```
-->
```yaml
# Gateway 层级的 TLS 对入站连接仍具有最终决定权
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
spec:
  listeners:
  - name: https
    protocol: HTTPS
    tls:
      certificateRefs:
      - name: gateway-cert
---
# 用于外部目的地的后端资源
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XBackend
metadata:
  name: ai-provider-api
  namespace: ai-apps
spec:
  type: ExternalHostname
  externalHostname:
    hostname: api.ai-provider.com

---
# 引用 XBackend 的 HTTPRoute
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
spec:
  rules:
  - backendRefs:
    - name: ai-provider-api
      kind: XBackend
      group: gateway.networking.x-k8s.io
```

<!--
The community is also working on moving Session Persistence config from `XBackendTrafficPolicy` into `XBackend`, along with other use cases like retries, TLS origination and similar config that is useful to be able to configure per-application rather than per-Route.
-->
社区还在努力将会话保持配置从 `XBackendTrafficPolicy` 移至 `XBackend`。
其他工作包括重试、TLS 发起等用例，以及其他适合按应用而非按路由配置的类似设置。

<!--
## Experimental resources move off the standard API group

Previously, experimental resources shared the same API group as standard ones - `gateway.networking.k8s.io` - distinguished only by a `v1alpha2`-style version. TCPRoute and UDPRoute were the last resources to graduate under that scheme.
-->
## 实验性资源迁出标准 API 组 {#experimental-resources-move-off-the-standard-api-group}

此前，实验性资源与标准资源共用同一个 API 组（`gateway.networking.k8s.io`），仅通过
`v1alpha2` 风格的版本号区分。TCPRoute 和 UDPRoute 是在该模式下最后升级的资源。

<!--
Going forward, new experimental resources are defined in a separate group,
`gateway.networking.x-k8s.io`,
and the names of their API types get an `X` prefix - for example XBackend and XMesh.
When one of these graduates to Standard, it's renamed into the `gateway.networking.k8s.io` group
and drops the `X` prefix, the same way XMesh is expected to become Mesh.

This separation makes the experimental/standard boundary explicit at the API group level, rather than relying on version strings alone.
-->
今后，新的实验性资源将在独立的 `gateway.networking.x-k8s.io` 组中定义，
其 API 类型名称将添加 `X` 前缀，例如 XBackend 和 XMesh。
当其中某个资源升级到 Standard 时，它会被重命名并迁移到 `gateway.networking.k8s.io`
组，同时移除 `X` 前缀；例如，预计 XMesh 将变为 Mesh。

这种分离在 API 组层面明确了实验性与标准 API 的边界，不再仅依赖版本字符串进行区分。

<!--
## What's next & getting involved

The graduation of TCPRoute and UDPRoute to Standard marks an essential milestone
in making Gateway API a complete, universal ingress and mesh networking API
for Kubernetes workloads across layer 4 and layer 7 protocols.
-->
## 后续计划与参与方式 {#whats-next--getting-involved}

TCPRoute 和 UDPRoute 进阶为 Standard，是让 Gateway API 成为一个完整、通用的入口和服务网格网络
API 的重要里程碑，可服务 Kubernetes 工作负载在第 4 层和第 7 层协议上的需求。

<!--
### Try it out
-->
### 试用 {#try-it-out}

<!--
You can start using Gateway API v1.6.0 today with your favorite Gateway controller implementation:

- Check out the [Gateway API Documentation](https://gateway-api.sigs.k8s.io/) for detailed guides and API references.
- View the [v1.6.0 Release Notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.6.0) for complete details on the CRD installation and changes.

Gateway API relies on an extensive conformance test suite to ensure consistent,
portable behavior across all implementations.
Here is a list of the implementations that are conforment with v1.6 on the day we published the article:
-->
现在就可以搭配你偏好的 Gateway 控制器实现开始使用 Gateway API v1.6.0：

- 查阅 [Gateway API 文档](https://gateway-api.sigs.k8s.io/)，获取详细指南和 API 参考资料。
- 查看 [v1.6.0 发布说明](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.6.0)，
  了解 CRD 安装和变更的完整详情。

Gateway API 依赖广泛的兼容性测试套件，以确保所有实现都具备一致、可移植的行为。
以下是在本文发布当天，已符合 v1.6 标准的实现列表：

- [Agentgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/agentgateway-agentgateway)
- [Airlock Microgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/airlock-microgateway)
- [GKE Gateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/gke-gateway)
- [kgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/kgateway)
- [NGINX Gateway Fabric](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/nginx-nginx-gateway-fabric)
- [Traefik Proxy](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/traefik-traefik)

<!--
### Get involved

Gateway API is an open, community-driven project built under Kubernetes SIG Network. We welcome contributions, feedback, and participation from everyone!

- **Join our Slack Channel**: Join `#sig-network-gateway-api` on the [Kubernetes Slack](https://slack.k8s.io/).
- **Attend Community Meetings**: We hold weekly community meetings. Check out the [SIG Network Calendar](https://www.kubernetes.dev/community/community-groups/sigs/network/) for dates and agendas.
- **Contribute on GitHub**: File issues, suggest enhancements (GEPs), or submit PRs at [kubernetes-sigs/gateway-api](https://github.com/kubernetes-sigs/gateway-api).
-->
### 参与贡献 {#get-involved}

Gateway API 是 Kubernetes SIG Network 下的开放、社区驱动项目。欢迎所有人贡献、反馈和参与！

- **加入 Slack 频道**：在 [Kubernetes Slack](https://slack.k8s.io/) 中加入 `#sig-network-gateway-api`。
- **参加社区会议**：我们每周举行社区会议。请查看
  [SIG Network 日历](https://www.kubernetes.dev/community/community-groups/sigs/network/)，了解日期和议程。
- **在 GitHub 上贡献**：在 [kubernetes-sigs/gateway-api](https://github.com/kubernetes-sigs/gateway-api)
  创建议题、建议增强功能（GEP），或提交 PR。

<!--
### Acknowledgments

A huge thank you to all the contributors, reviewers, maintainers, and implementation authors whose hard work made Gateway API v1.6.0 possible!

[TCPRoute]: https://gateway-api.sigs.k8s.io/guides/user-guides/tcp/
[UDPRoute]: https://gateway-api.sigs.k8s.io/guides/user-guides/udp/
-->
### 致谢 {#acknowledgments}

衷心感谢所有贡献者、审阅者、维护者和实现作者；正是他们的辛勤工作让 Gateway API v1.6.0 得以发布！

[TCPRoute]: https://gateway-api.sigs.k8s.io/guides/user-guides/tcp/
[UDPRoute]: https://gateway-api.sigs.k8s.io/guides/user-guides/udp/
