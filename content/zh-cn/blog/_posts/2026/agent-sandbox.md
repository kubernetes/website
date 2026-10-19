---
layout: blog
title: "在 Kubernetes 上使用 Agent Sandbox 运行智能体"
date: 2026-03-20T10:00:00-08:00
slug: running-agents-on-kubernetes-with-agent-sandbox
author: >
  [Janet Kuo](https://github.com/janetkuo)
  [Justin Santa Barbara](https://github.com/justinsb)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "Running Agents on Kubernetes with Agent Sandbox"
date: 2026-03-20T10:00:00-08:00
slug: running-agents-on-kubernetes-with-agent-sandbox
author: >
  [Janet Kuo](https://github.com/janetkuo)
  [Justin Santa Barbara](https://github.com/justinsb)
-->

<!--
The landscape of artificial intelligence is undergoing a massive architectural shift. In the early days of generative AI, interacting with a model was often treated as a transient, stateless function call: a request that spun up, executed for perhaps 50 milliseconds, and terminated.

Today, the world is witnessing AI v2 eating AI v1. The ecosystem is moving from short-lived, isolated tasks to deploying multiple, coordinated AI agents that run constantly. These autonomous agents need to maintain context, use external tools, write and execute code, and communicate with one another over extended periods.

As platform engineering teams look for the right infrastructure to host these new AI workloads, one platform stands out as the natural choice: Kubernetes. However, mapping these unique agentic workloads to traditional Kubernetes primitives requires a new abstraction.

This is where the new [Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox) project (currently in development under SIG Apps) comes into play.
-->
人工智能领域正经历着一场巨大的架构变革。
在生成式人工智能的早期，与模型交互通常被视为一个瞬态的、无状态的函数调用：一个启动、执行可能仅
50 毫秒便终止的请求。

如今，人工智能 2.0 正在取代人工智能 1.0。
人工智能生态系统正从短暂、孤立的任务转向部署多个持续运行的、协同工作的 AI 智能体。
这些自主智能体需要维护上下文信息、使用外部工具、编写和执行代码，并在较长时间内相互通信。

当平台工程团队寻找合适的架构来托管这些新型 AI 工作负载时，
Kubernetes 脱颖而出，成为自然之选。
然而，将这些独特的智能体工作负载映射到传统的 Kubernetes 原语需要一种新的抽象。

这正是新的 [Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox)
项目（目前由 SIG Apps 开发）发挥作用的地方。

<!--
## The Kubernetes advantage (and the abstraction gap)

Kubernetes is the de facto standard for orchestrating cloud-native applications precisely because it solves the challenges of extensibility, robust networking, and ecosystem maturity. However, as AI evolves from short-lived inference requests to long-running, autonomous agents, we are seeing the emergence of a new operational pattern. 

AI agents, by contrast, are typically isolated, stateful, singleton workloads. They act as a digital workspace or execution environment for an LLM. An agent needs a persistent identity and a secure scratchpad for writing and executing (often untrusted) code. Crucially, because these long-lived agents are expected to be mostly idle except for brief bursts of activity, they require a lifecycle that supports mechanisms like suspension and rapid resumption.

While you could theoretically approximate this by stringing together a StatefulSet of size 1, a headless Service, and a PersistentVolumeClaim for every single agent, managing this at scale becomes an operational nightmare.

Because of these unique properties, traditional Kubernetes primitives don't perfectly align.
-->

## Kubernetes 的优势（以及抽象鸿沟）

Kubernetes 之所以成为云原生应用编排的事实标准，
正是因为它解决了可扩展性、稳健的网络和生态系统成熟度方面的挑战。
然而，随着人工智能从短暂的推理请求演变为长时间运行的自主智能体，我们正在见证一种新的运行模式的出现。

相比之下，AI 智能体通常是隔离的、有状态的、单例工作负载。
它们充当生命周期管理（LLM）的数字工作空间或执行环境。
智能体需要一个持久的身份和一个安全的暂存区来编写和执行（通常是不受信任的）代码。
至关重要的是，由于这些长时间运行的智能体除了短暂的活动爆发外，大部分时间都处于空闲状态，
因此它们需要一个支持诸如暂停和快速恢复等机制的生命周期。

虽然理论上可以通过为每个智能体串联一个大小为 1 的
StatefulSet、一个无头服务和一个 PersistentVolumeClaim
来近似实现这一点，但大规模管理这些组件将成为运维噩梦。

由于这些独特的特性，传统的 Kubernetes 原语无法完美契合。

<!--
## Introducing Kubernetes Agent Sandbox

To bridge this gap, SIG Apps is developing [agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox). The project introduces a declarative, standardized API specifically tailored for singleton, stateful workloads like AI agent runtimes.

At its core, the project introduces the Sandbox CRD. It acts as a lightweight, single-container environment built entirely on Kubernetes primitives, offering:
-->
## Kubernetes Agent Sandbox 简介

为了弥合这一差距，SIG Apps 正在开发
[agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox)。
该项目引入了一个声明式、标准化的 API，专门针对单例、有状态工作负载（例如 AI 智能体运行时）量身定制。

该项目的核心是引入了 Sandbox CRD。它是一个轻量级的单容器环境，完全基于
Kubernetes 原语构建，提供以下功能：

<!--
* **Strong isolation for untrusted code**: When an AI agent generates and executes code autonomously, security is paramount. The Sandbox custom resource natively supports different runtimes, like gVisor or Kata Containers. This provides the necessary kernel and network isolation required for multi-tenant, untrusted execution.
* **Lifecycle management**: Unlike traditional web servers optimized for steady, stateless traffic, an AI agent operates as a stateful workspace that may be idle for hours between tasks. Agent Sandbox supports scaling these idle environments to zero to save resources, while ensuring they can resume exactly where they left off.
* **Stable identity**: Coordinated multi-agent systems require stable networking. Every Sandbox is given a stable hostname and network identity, allowing distinct agents to discover and communicate with each other seamlessly.
-->
* **针对不受信任代码的强隔离**：当 AI 智能体自主生成和执行代码时，安全性至关重要。
  Sandbox 自定义资源原生支持不同的运行时环境，例如 gVisor 或 Kata Containers。
  这为多租户、不受信任的执行提供了必要的内核和网络隔离。
* **生命周期管理**：与针对稳定、无状态流量优化的传统 Web 服务器不同，
  AI 智能体作为有状态的工作空间运行，在两次任务之间可能被闲置数小时。
  Agent Sandbox 支持将这些闲置环境缩减至零以节省资源，同时确保它们可以从上次中断的地方恢复。
* **稳定的身份**：协同的多智能体系统需要稳定的网络。
  每个 Sandbox 都拥有稳定的主机名和网络身份，使不同的智能体能够无缝地相互发现和通信。

<!--
## Scaling agents with extensions

Because the AI space is moving incredibly quickly, we built an Extensions API layer that enables even faster iteration and development.

Starting a new pod adds about a second of overhead. That's perfectly fine when deploying a new version of a microservice, but when an agent is invoked after being idle, a one-second cold start breaks the continuity of the interaction. It forces the user or the orchestrating service to wait for the environment to provision before the model can even begin to think or act. SandboxWarmPool solves this by maintaining a pool of pre-provisioned Sandbox pods, effectively eliminating cold starts. Users or orchestration services can simply issue a SandboxClaim against a SandboxTemplate, and the controller immediately hands over a pre-warmed, fully isolated environment to the agent.
-->
## 利用扩展来缩放智能体规模

由于人工智能领域发展迅猛，我们构建了一个扩展 API 层，以支持更快的迭代和开发。

启动一个新的 Pod 会增加大约一秒钟的开销。
部署新版本的微服务时，这完全可以接受，但如果智能体在空闲后被调用，一秒钟的冷启动会中断交互的连续性。
它迫使用户或编排服务等待环境配置完成，模型才能开始思考或行动。SandboxWarmPool
通过维护一个预配置的 Sandbox Pod 池来解决这个问题，从而有效地消除了冷启动。
用户或编排服务只需针对 SandboxTemplate 发出 SandboxClaim，
控制器就会立即将一个预热的、完全隔离的环境交给智能体。

<!--
## Quick start

Ready to try it yourself? You can install the Agent Sandbox core components and extensions directly into your learning or sandbox cluster, using your chosen release.

We recommend you use the latest release as the project is moving fast.
-->
## 快速入门

准备好亲自体验了吗？你可以选择最新版本，将 Agent Sandbox
的核心组件和扩展程序直接安装到你的学习或 Sandbox 集群中。

由于项目进展迅速，我们建议你使用最新版本。

<!--
```bash
# Replace "vX.Y.Z" with a specific version tag (e.g., "v0.1.0") from
# https://github.com/kubernetes-sigs/agent-sandbox/releases
export VERSION="vX.Y.Z"

# Install the core components:
kubectl apply -f https://github.com/kubernetes-sigs/agent-sandbox/releases/download/${VERSION}/manifest.yaml

# Install the extensions components (optional):
kubectl apply -f https://github.com/kubernetes-sigs/agent-sandbox/releases/download/${VERSION}/extensions.yaml

# Install the Python SDK (optional):
# Create a virtual Python environment
python3 -m venv .venv
source .venv/bin/activate
# Install from PyPI
pip install k8s-agent-sandbox
```
-->
```bash
# 将 “vX.Y.Z” 替换为来自 https://github.com/kubernetes-sigs/agent-sandbox/releases
# 的特定版本标签（例如，“v0.1.0”）。
export VERSION="vX.Y.Z"

# 安装核心组件：
kubectl apply -f https://github.com/kubernetes-sigs/agent-sandbox/releases/download/${VERSION}/manifest.yaml

# 安装扩展组件（可选）：
kubectl apply -f https://github.com/kubernetes-sigs/agent-sandbox/releases/download/${VERSION}/extensions.yaml

# 安装 Python SDK（可选）：
# 创建一个虚拟 Python 环境
python3 -m venv .venv
source .venv/bin/activate
# 从 PyPI 安装
pip install k8s-agent-sandbox
```

<!--
Once installed, you can try out the [Python SDK](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/clients/python/agentic-sandbox-client) for AI agents or deploy one of the ready-to-use [examples](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/examples) to see how easy it is to spin up an isolated agent environment.
-->
安装完成后，你可以试用 AI 智能体的
[Python SDK](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/clients/python/agentic-sandbox-client)，
或者部署一个现成的[示例](https://github.com/kubernetes-sigs/agent-sandbox/tree/main/examples)，
看看启动一个隔离的智能体环境是多么容易。

<!--
## The future of agents is cloud native

Whether it’s a 50-millisecond stateless task, or a multi-week, mostly-idle collaborative process, extending Kubernetes with primitives designed specifically for isolated stateful singletons allows us to leverage all the robust benefits of the cloud-native ecosystem.

The Agent Sandbox project is open source and community-driven. If you are building AI platforms, developing agentic frameworks, or are interested in Kubernetes extensibility, we invite you to get involved:
-->
## 智能体的未来在于云原生

无论是 50 毫秒的无状态任务，还是持续数周、大部分时间处于空闲状态的协作流程，
通过扩展 Kubernetes，添加专为隔离的有状态单例设计的原语，
我们都能充分利用云原生生态系统的强大优势。

Agent Sandbox 项目是开源且由社区驱动的。
如果你正在构建 AI 平台、开发智能体框架，或者对 Kubernetes 的可扩展性感兴趣，
我们诚邀您参与其中：

<!--
* Check out the project on GitHub: [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox)
* Join the discussion in the [#sig-apps](https://kubernetes.slack.com/messages/sig-apps) and [#agent-sandbox](https://kubernetes.slack.com/messages/agent-sandbox) channels on the Kubernetes Slack.
-->
* 在 GitHub 上查看项目：[kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox)
* 加入 Kubernetes Slack 上的 [#sig-apps](https://kubernetes.slack.com/messages/sig-apps)
  和 [#agent-sandbox](https://kubernetes.slack.com/messages/agent-sandbox) 频道参与讨论。
