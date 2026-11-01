---
title: "宣布成立 AI 网关工作组"
date: 2026-03-09T10:00:00-08:00
slug: announcing-ai-gateway-wg
author: >
  [Keith Mattix](https://github.com/keithmattix),
  [Nir Rozenbaum](https://github.com/nirrozenbaum),
  [Morgan Foster](https://github.com/usize),
  [Flynn](https://github.com/kflynn)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
title: "Announcing the AI Gateway Working Group"
date: 2026-03-09T10:00:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2026/03/09/announcing-ai-gateway-wg/
slug: announcing-ai-gateway-wg
author: >
  [Keith Mattix](https://github.com/keithmattix),
  [Nir Rozenbaum](https://github.com/nirrozenbaum),
  [Morgan Foster](https://github.com/usize),
  [Flynn](https://github.com/kflynn)
-->

<!--
The community around Kubernetes includes a number of Special Interest Groups (SIGs) and Working Groups (WGs) facilitating discussions on important topics between interested contributors. Today, we're excited to announce the formation of the [AI Gateway Working Group](https://github.com/kubernetes-sigs/wg-ai-gateway), a new initiative focused on developing standards and best practices for networking infrastructure that supports AI workloads in Kubernetes environments.
-->
Kubernetes 社区包含多个特别兴趣小组（SIG）和工作组（WG），
旨在促进相关贡献者之间就重要议题展开讨论。
今天，我们很高兴地宣布成立 [AI 网关工作组](https://github.com/kubernetes-sigs/wg-ai-gateway)，
这是一项专注于为 Kubernetes 环境中支持 AI 工作负载的网络基础设施制定标准和最佳实践的新举措。

<!--
## What is an AI Gateway?

In a Kubernetes context, an *AI Gateway* refers to network gateway infrastructure (including proxy servers, load-balancers, etc.) that generally implements the [Gateway API](https://gateway-api.sigs.k8s.io/) specification with enhanced capabilities for AI workloads. Rather than defining a distinct product category, AI Gateways describe infrastructure designed to enforce policy on AI traffic, including:
- Token-based rate limiting for AI APIs.
- Fine-grained access controls for inference APIs.
- Payload inspection enabling intelligent routing, caching, and guardrails.
- Support for AI-specific protocols and routing patterns.
-->
## 什么是 AI 网关？

在 Kubernetes 环境中，**AI 网关**指的是网络网关基础设施（包括代理服务器、负载均衡器等），
它通常实现 [Gateway API](https://gateway-api.sigs.k8s.io/) 规范，并针对 AI 工作负载提供增强功能。
AI 网关并非定义一个独立的产品类别，而是描述旨在对 AI 流量实施策略的基础设施，包括：
- 基于 token 的 AI API 速率限制。
- 推理 API 的细粒度访问控制。
- 有效负载检查，实现智能路由、缓存和防护机制。
- 支持 AI 特有的协议和路由模式。

<!--
## Working group charter and mission

The AI Gateway Working Group operates under a clear [charter](https://github.com/kubernetes/community/blob/master/wg-ai-gateway/charter.md) with the mission to develop proposals for Kubernetes Special Interest Groups (SIGs) and their sub-projects.
Its primary goals include:
- **Standards Development**: Create declarative APIs, standards, and guidance for AI workload networking in Kubernetes.
- **Community Collaboration**: Foster discussions and build consensus around best practices for AI infrastructure.
- **Extensible Architecture**: Ensure composability, pluggability, and ordered processing for AI-specific gateway extensions.
- **Standards-Based Approach**: Build on established networking foundations, layering AI-specific capabilities on top of proven standards.
-->
## 工作组章程和使命

AI 网关工作组遵循清晰的[章程](https://github.com/kubernetes/community/blob/master/wg-ai-gateway/charter.md)运作，
其使命是为 Kubernetes 特别兴趣小组（SIG）及其子项目制定提案。
其主要目标包括：
- **标准制定**：为 Kubernetes 中的 AI 工作负载网络创建声明式 API、标准和指南。
- **社区协作**：促进讨论并就 AI 基础设施的最佳实践达成共识。
- **可扩展架构**：确保 AI 专用网关扩展的可组合性、可插拔性和有序处理。
- **基于标准的方法**：基于已建立的网络基础，在成熟的标准之上构建 AI 专用功能。

<!--
## Active proposals

WG AI Gateway currently has several [active proposals](https://github.com/kubernetes-sigs/wg-ai-gateway/tree/main/proposals) that address key challenges in
AI workload networking:
-->
## 活跃提案

AI 网关工作组目前有多个[活跃提案](https://github.com/kubernetes-sigs/wg-ai-gateway/tree/main/proposals)，
旨在解决 AI 工作负载网络领域的关键挑战：

<!--
### Payload Processing

The [payload processing proposal](https://github.com/kubernetes-sigs/wg-ai-gateway/tree/main/proposals/7-payload-processing.md) addresses the critical need for AI workloads to inspect and transform full HTTP request and response payloads.
This enables:
#### AI Inference Security
- Guard against malicious prompts and prompt injection attacks.
- Content filtering for AI responses.
- Signature-based detection and anomaly detection for AI traffic.
-->
### 有效载荷处理

[有效载荷处理提案](https://github.com/kubernetes-sigs/wg-ai-gateway/tree/main/proposals/7-payload-processing.md)
旨在满足 AI 工作负载检查和转换完整 HTTP 请求和响应有效载荷的关键需求。

这可以实现：

#### AI 推理安全

- 防御恶意提示和提示注入攻击。
- 对 AI 响应进行内容过滤。
- 对 AI 流量进行基于特征的检测和异常检测。

<!--
#### AI Inference Optimization
- Semantic routing based on request content.
- Intelligent caching to reduce inference costs and improve response times.
- RAG (Retrieval-Augmented Generation) system integration for context enhancement.

The proposal defines standards for declarative payload processor configuration, ordered processing pipelines, and configurable failure modes - all essential for production AI workload deployments.
-->
#### AI 推理优化

- 基于请求内容的语义路由。
- 智能缓存，以降低推理成本并缩短响应时间。
- 集成 RAG 系统，以增强上下文信息。

该提案定义了声明式有效载荷处理器配置、有序处理流水线和可配置故障模式的标准
—— 所有这些对于生产级 AI 工作负载部署都至关重要。

<!--
### Egress gateways

Modern AI applications increasingly depend on external inference services, whether for specialized models,
failover scenarios, or cost optimization.
The [egress gateways proposal](https://github.com/kubernetes-sigs/wg-ai-gateway/tree/main/proposals/10-egress-gateways.md) aims to define standards for securely routing traffic outside the cluster.
Key features include:
-->
### 出口网关

现代 AI 应用越来越依赖外部推理服务，无论是用于构建专用模型、实现故障转移，还是优化成本。

[出口网关提案](https://github.com/kubernetes-sigs/wg-ai-gateway/tree/main/proposals/10-egress-gateways.md)
旨在定义将流量安全地路由到集群外部的标准。
主要特性包括：

<!--
#### External AI Service Integration
- Secure access to cloud-based AI services (OpenAI, Vertex AI, Bedrock, etc.).
- Managed authentication and token injection for third-party AI APIs.
- Regional compliance and failover capabilities.
#### Advanced Traffic Management
- Backend resource definitions for external FQDNs and services.
- TLS policy management and certificate authority control.
- Cross-cluster routing for centralized AI infrastructure.
#### User Stories We're Addressing
- Platform operators providing managed access to external AI services.
- Developers requiring inference failover across multiple cloud providers.
- Compliance engineers enforcing regional restrictions on AI traffic.
- Organizations centralizing AI workloads on dedicated clusters.
-->
#### 外部 AI 服务集成

- 安全访问云端 AI 服务（OpenAI、Vertex AI、Bedrock 等）。
- 为第三方 AI API 提供托管身份验证和令牌注入。
- 具备区域合规性和故障转移功能。

#### 高级流量管理

- 为外部 FQDN 和服务定义后端资源。
- TLS 策略管理和证书颁发机构控制。
- 为集中式 AI 基础设施提供跨集群路由。

#### 我们正在解决的用户场景

- 提供外部 AI 服务托管访问的平台运营商。
- 需要跨多个云提供商进行推理故障转移的开发人员。
- 执行 AI 流量区域限制的合规工程师。
- 将 AI 工作负载集中部署在专用集群上的组织。

<!--
## Upcoming events

### KubeCon + CloudNativeCon Europe 2026, Amsterdam
AI Gateway working group members will be presenting at [KubeCon + CloudNativeCon Europe](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/) in Amsterdam, discussing the problems at the intersection of AI and networking, including the working group's active proposals, as well as the intersection of AI gateways with Model Context Protocol (MCP) and agent networking patterns.  
This session will showcase how AI Gateway working group proposals enable the infrastructure needed for next-generation AI deployments and communication patterns.  
The session will also include the initial designs, early prototypes, and emerging directions shaping the WG’s roadmap.  
For more details see our session here:
- [AI'm at the Gate! Introducing the AI Gateway Working Group in Kubernetes](https://kccnceu2026.sched.com/event/2EF5t/aim-at-the-gate-introducing-the-ai-gateway-working-group-in-kubernetes-morgan-foster-nir-rozenbaum-red-hat-shachar-tal-palo-alto-networks?iframe=yes&w=100%&sidebar=yes&bg=no)
-->
## 即将举行的活动

### KubeCon + CloudNativeCon Europe 2026，阿姆斯特丹

AI 网关工作组成员将在阿姆斯特丹举行的
[KubeCon + CloudNativeCon Europe](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/)
上发表演讲，探讨人工智能与网络交叉领域的问题，包括工作组正在推进的提案，以及
AI 网关与模型上下文协议（MCP）和代理网络模式的交叉应用。
本次会议将展示 AI 网关工作组的提案如何为下一代 AI 部署和通信模式构建所需的基础设施。
会议还将介绍工作组路线图的初始设计、早期原型和新兴方向。
更多详情，请点击此处查看我们的会议：

- [AI 已抵达网关！Kubernetes 中的 AI 网关工作组简介](https://kccnceu2026.sched.com/event/2EF5t/aim-at-the-gate-introducing-the-ai-gateway-working-group-in-kubernetes-morgan-foster-nir-rozenbaum-red-hat-shachar-tal-palo-alto-networks?iframe=yes&w=100%&sidebar=yes&bg=no)

<!--
## Get involved

The AI Gateway Working Group represents the Kubernetes community's commitment to standardizing AI workload networking. As AI becomes increasingly integral to modern applications, we need robust, standardized infrastructure that can support the unique requirements of inference workloads while maintaining the security, observability, and reliability standards that Kubernetes users expect.  
Our proposals are currently in active development, with implementations beginning across various gateway projects. We're working closely with SIG Network on Gateway API enhancements and collaborating with the broader cloud-native community to ensure our standards meet real-world production needs.
-->
## 参与其中

AI 网关工作组代表 Kubernetes 社区致力于 AI 工作负载网络标准化。随着
AI 日益融入现代应用，我们需要强大且标准化的基础设施，以满足推理工作负载的独特需求，
同时保持 Kubernetes 用户所期望的安全性、可观测性和可靠性标准。

我们的提案目前正在积极开发中，并已开始在各个网关项目中实施。
我们正与 SIG Network 紧密合作，增强网关 API，并与更广泛的云原生社区协作，
以确保我们的标准能够满足实际生产需求。

<!--
Whether you're a gateway implementer, platform operator, AI application developer, or simply interested in the intersection of Kubernetes and AI, we'd love your input. The working group follows an open contribution model - you can review our proposals, join our weekly meetings, or start discussions on our GitHub repository.
To learn more:

- Visit the working group's umbrella [GitHub repository](https://github.com/kubernetes-sigs/wg-ai-gateway).
- Read the working group's [charter](https://github.com/kubernetes/community/blob/master/wg-ai-gateway/charter.md).
- Join the [weekly meeting](https://docs.google.com/document/d/1nRRkRK2e82mxkT8zdLoAtuhkom2X6dEhtYOJ9UtfZKs) on Thursdays at 2PM EST.
- Connect with the working group on [Slack (#wg-ai-gateway)](https://kubernetes.slack.com/messages/wg-ai-gateway) (visit https://slack.k8s.io/ for an invitation).
- Join the AI Gateway [mailing list](https://groups.google.com/a/kubernetes.io/g/wg-ai-gateway).
-->
无论您是网关实现者、平台运维人员、AI 应用开发者，还是仅仅对 Kubernetes 和 AI
的交叉领域感兴趣，我们都欢迎您的参与。
工作组采用开放贡献模式——您可以查看我们的提案、参加每周例会，或在我们的 GitHub 代码库上发起讨论。

了解更多信息：

- 访问工作组的 [GitHub 代码库](https://github.com/kubernetes-sigs/wg-ai-gateway)。
- 阅读工作组的[章程](https://github.com/kubernetes/community/blob/master/wg-ai-gateway/charter.md)。
- 参加每周四下午 2 点（美国东部时间）的[每周例会](https://docs.google.com/document/d/1nRRkRK2e82mxkT8zdLoAtuhkom2X6dEhtYOJ9UtfZKs)。
- 加入工作组的 Slack 频道（#wg-ai-gateway）（访问 https://slack.k8s.io/ 获取邀请）。
- 加入 AI Gateway 邮件列表（https://groups.google.com/a/kubernetes.io/g/wg-ai-gateway）。

<!--
The future of AI infrastructure in Kubernetes is being built today, join up and learn how you can contribute and help shape the future of AI-aware gateway capabilities in Kubernetes.
-->
Kubernetes 中 AI 基础设施的未来正在构建中，加入我们，了解如何贡献力量，帮助塑造
Kubernetes 中 AI 感知网关功能的未来。
