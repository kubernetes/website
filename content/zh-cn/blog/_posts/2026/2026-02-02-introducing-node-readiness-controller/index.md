---
layout: blog
title: "节点就绪控制器简介"
date: 2026-02-03T10:00:00+08:00
slug: introducing-node-readiness-controller
author: >
  Ajay Sundar Karuppasamy (Google)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "Introducing Node Readiness Controller"
date: 2026-02-03T10:00:00+08:00
slug: introducing-node-readiness-controller
author: >
  Ajay Sundar Karuppasamy (Google)
-->

<img style="float: right; display: inline-block; margin-left: 2em; max-width: 15em;" src="./node-readiness-controller-logo.svg" alt="Logo for node readiness controller" />

<!--
In the standard Kubernetes model, a node’s suitability for workloads hinges on a single binary "Ready" condition. However, in modern Kubernetes environments, nodes require complex infrastructure dependencies—such as network agents, storage drivers, GPU firmware, or custom health checks—to be fully operational before they can reliably host pods.

Today, on behalf of the Kubernetes project, I am announcing the [Node Readiness Controller](https://node-readiness-controller.sigs.k8s.io/).
This project introduces a declarative system for managing node taints, extending the readiness guardrails during node bootstrapping beyond standard conditions.
By dynamically managing taints based on custom health signals, the controller ensures that workloads are only placed on nodes that met all infrastructure-specific requirements.
-->
在标准的 Kubernetes 模型中，节点是否适合运行工作负载取决于一个简单的“就绪”状态。
然而，在现代 Kubernetes 环境中，节点需要复杂的底层架构依赖项
（例如网络代理、存储驱动程序、GPU 固件或自定义健康检查）才能完全运行，从而可靠地托管 Pod。

今天，我代表 Kubernetes 项目宣布推出[节点就绪控制器](https://node-readiness-controller.sigs.k8s.io/)。

该项目引入了一个声明式系统来管理节点污点，从而在节点启动过程中扩展了就绪保护机制，使其超越了标准条件。

通过基于自定义健康信号动态管理污点，该控制器确保工作负载仅部署在满足所有底层架构特定要求的节点上。

<!--
## Why the Node Readiness Controller?

Core Kubernetes Node "Ready" status is often insufficient for clusters with sophisticated bootstrapping requirements. Operators frequently struggle to ensure that specific DaemonSets or local services are healthy before a node enters the scheduling pool.

The Node Readiness Controller fills this gap by allowing operators to define custom scheduling gates tailored to specific node groups. This enables you to enforce
distinct readiness requirements across heterogeneous clusters, ensuring for example, that GPU equipped nodes only accept pods once specialized drivers are verified,
while general purpose nodes follow a standard path.
-->
## 为什么需要节点就绪控制器？

对于具有复杂引导要求的集群，Kubernetes 核心节点的“就绪”状态通常不足以满足需求。
运维人员经常需要确保特定的 DaemonSet 或本地服务在节点进入调度池之前处于健康状态。

节点就绪控制器通过允许运维人员定义针对特定节点组的自定义调度门控来弥补这一不足。
这使你能够在异构集群中强制执行不同的就绪要求，例如，确保配备 GPU 的节点只有在验证了专用驱动程序后才能接受 Pod，
而通用节点则遵循标准路径。

<!--
It provides three primary advantages:

- **Custom Readiness Definitions**: Define what _ready_ means for your specific platform.
- **Automated Taint Management**: The controller automatically applies or removes node taints based on condition status, preventing pods from landing on unready infrastructure.
- **Declarative Node Bootstrapping**: Manage multi-step node initialization reliably, with a clear observability into the bootstrapping process.
-->
它提供三大主要优势：

- **自定义就绪状态定义**：定义特定平台上的“就绪”状态。
- **自动化污点管理**：控制器会根据状态自动应用或移除节点污点，防止 Pod 部署到未就绪的基础设施上。
- **声明式节点引导**：可靠地管理多步骤节点初始化，并清晰地观察引导过程。

<!--
## Core concepts and features

The controller centers around the NodeReadinessRule (NRR) API, which allows you to define declarative _gates_ for your nodes.
-->
## 核心概念和特性

控制器以节点就绪规则（NodeReadinessRule，NRR）API 为核心，该 API 允许你为节点定义声明式的“门控”。

<!--
### Flexible enforcement modes

The controller supports two distinct operational modes:

Continuous enforcement
: Actively maintains the readiness guarantee throughout the node’s entire lifecycle. If a critical dependency (like a device driver) fails later, the node is immediately tainted to prevent new scheduling.

Bootstrap-only enforcement
: Specifically for one-time initialization steps, such as pre-pulling heavy images or hardware provisioning. Once conditions are met, the controller marks the bootstrap as complete and stops monitoring that specific rule for the node.
-->
### 灵活的强制执行模式

控制器支持两种不同的运行模式：

持续强制执行
: 在节点的整个生命周期内主动维护就绪保证。
  如果关键依赖项（例如设备驱动程序）之后发生故障，则该节点会立即被标记为“已污染”，以防止新的调度。

仅引导强制执行
: 专门用于一次性初始化步骤，例如预拉取大型镜像或硬件配置。
  一旦满足条件，控制器会将引导过程标记为已完成，并停止监控该节点的该特定规则。

<!--
### Condition reporting

The controller reacts to Node Conditions rather than performing health checks itself. This decoupled design allows it to integrate seamlessly with other tools existing in the ecosystem as well as custom solutions:

- **[Node Problem Detector](https://github.com/kubernetes/node-problem-detector) (NPD)**: Use existing NPD setups and custom scripts to report node health.
- **Readiness Condition Reporter**: A lightweight agent provided by the project that can be deployed to periodically check local HTTP endpoints and patch node conditions accordingly.
-->
### 状态报告

控制器响应节点状态，而非自行执行健康检查。
这种解耦设计使其能够与生态系统中现有的其他工具以及自定义解决方案无缝集成：

- **[节点问题检测器](https://github.com/kubernetes/node-problem-detector)（NPD）**：
  使用现有的 NPD 配置和自定义脚本来报告节点健康状况。
- **就绪状态报告器**：项目提供的一个轻量级代理，可以部署用于定期检查本地 HTTP 端点并相应地更新节点状态。

<!--
### Operational safety with dry run

Deploying new readiness rules across a fleet carries inherent risk. To mitigate this, _dry run_ mode allows operators to first simulate impact on the cluster.
In this mode, the controller logs intended actions and updates the rule's status to show affected nodes without applying actual taints, enabling safe validation before enforcement.
-->
### 通过试运行确保运行安全

在整个集群中部署新的就绪规则存在固有风险。
为了降低这种风险，**试运行**模式允许运维人员首先模拟对集群的影响。
在此模式下，控制器会记录预期操作并更新规则状态以显示受影响的节点，
而无需实际应用污点，从而在强制执行前实现安全验证。

<!--
## Example: CNI bootstrapping

The following NodeReadinessRule ensures a node remains unschedulable until its CNI agent is functional. The controller monitors a custom `cniplugin.example.net/NetworkReady` condition and only removes the `readiness.k8s.io/acme.com/network-unavailable` taint once the status is True.
-->
## 示例：CNI 引导

以下 NodeReadinessRule 确保节点在 CNI 代理正常工作之前保持不可调度状态。
控制器监控自定义的 `cniplugin.example.net/NetworkReady` 条件，
并且仅当该状态为 True 时才移除 `readiness.k8s.io/acme.com/network-unavailable` 污点。

```yaml
apiVersion: readiness.node.x-k8s.io/v1alpha1
kind: NodeReadinessRule
metadata:
  name: network-readiness-rule
spec:
  conditions:
    - type: "cniplugin.example.net/NetworkReady"
      requiredStatus: "True"
  taint:
    key: "readiness.k8s.io/acme.com/network-unavailable"
    effect: "NoSchedule"
    value: "pending"
  enforcementMode: "bootstrap-only"
  nodeSelector:
    matchLabels:
      node-role.kubernetes.io/worker: ""
```

<!--
**Demo**:
-->
**演示**：

{{< youtube id="hohIIEXlNpo" title="Node Readiness Controller Demo" >}}

<!--
## Getting involved

The Node Readiness Controller is just getting started, with our [initial releases](https://github.com/kubernetes-sigs/node-readiness-controller/releases/tag/v0.1.1) out, and we are seeking community feedback to refine the roadmap. Following our productive Unconference discussions at KubeCon NA 2025, we are excited to continue the conversation in person.

Join us at KubeCon + CloudNativeCon Europe 2026 for our maintainer track session: *[Addressing Non-Deterministic Scheduling: Introducing the Node Readiness Controller](https://sched.co/2EF6E)*.
-->
## 参与方式

节点就绪控制器（Node Readiness Controller）刚刚起步，
我们的[初始版本](https://github.com/kubernetes-sigs/node-readiness-controller/releases/tag/v0.1.1)已经发布，
我们正在寻求社区反馈以完善路线图。
继我们在 KubeCon NA 2025 上富有成效的非正式会议讨论之后，我们很高兴能继续进行线下交流。

欢迎参加 KubeCon + CloudNativeCon Europe 2026 的维护者专场会议：
**[解决非确定性调度问题：节点就绪控制器简介](https://sched.co/2EF6E)**。

<!--
In the meantime, you can contribute or track our progress here:

- GitHub: https://sigs.k8s.io/node-readiness-controller
- Slack: Join the conversation in [#sig-node-readiness-controller](https://kubernetes.slack.com/messages/sig-node-readiness-controller) 
- Documentation: [Getting Started](https://node-readiness-controller.sigs.k8s.io/)
-->
与此同时，你可以通过以下方式贡献力量或关注我们的进展：

- GitHub：https://sigs.k8s.io/node-readiness-controller
- Slack：加入 [#sig-node-readiness-controller](https://kubernetes.slack.com/messages/sig-node-readiness-controller) 参与讨论
- 文档：[入门指南](https://node-readiness-controller.sigs.k8s.io/)

