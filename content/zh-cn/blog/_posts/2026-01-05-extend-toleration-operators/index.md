---
layout: blog
title: "Kubernetes v1.35：扩展容忍度运算符以支持数值比较（Alpha）"
date: 2026-01-05T10:30:00-08:00
slug: kubernetes-v1-35-numeric-toleration-operators
author: >
  Heba Elayoty (Microsoft)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "Kubernetes v1.35: Extended Toleration Operators to Support Numeric Comparisons (Alpha)"
date: 2026-01-05T10:30:00-08:00
slug: kubernetes-v1-35-numeric-toleration-operators
author: >
  Heba Elayoty (Microsoft)
-->
<!--
Many production Kubernetes clusters blend on-demand (higher-SLA) and spot/preemptible (lower-SLA) nodes to optimize costs while maintaining reliability for critical workloads. Platform teams need a safe default that keeps most workloads away from risky capacity, while allowing specific workloads to opt-in with explicit thresholds like "I can tolerate nodes with failure probability up to 5%".
-->
许多生产级 Kubernetes 集群会混合使用按需（on-demand，高 SLA）节点与 spot/可抢占（preemptible，低 SLA）节点，
以在保证关键工作负载可靠性的同时优化成本。平台团队需要一个“安全默认值”，让大多数工作负载远离风险容量，
同时又允许特定工作负载用明确阈值显式选择接受（opt-in），例如“我可以容忍失败概率最高 5% 的节点”。

<!--
Today, Kubernetes taints and tolerations can match exact values or check for existence, but they can't compare numeric thresholds. You'd need to create discrete taint categories, use external admission controllers, or accept less-than-optimal placement decisions.
-->
目前，Kubernetes 的污点与容忍度（taints and tolerations）可以匹配精确值或检查键是否存在，
但**无法进行数值阈值比较**。你不得不创建离散的污点类别、使用外部准入控制器，或接受不够理想的放置决策。

<!--
In Kubernetes v1.35, we're introducing **Extended Toleration Operators** as an alpha feature. This enhancement adds `Gt` (Greater Than) and `Lt` (Less Than) operators to `spec.tolerations`, enabling threshold-based scheduling decisions that unlock new possibilities for SLA-based placement, cost optimization, and performance-aware workload distribution.
-->
在 Kubernetes v1.35 中，我们以 Alpha 形式引入 **扩展容忍度运算符（Extended Toleration Operators）**。
该增强为 `spec.tolerations` 增加 `Gt`（Greater Than）与 `Lt`（Less Than）运算符，
使调度器能够进行基于阈值的调度决策，从而为基于 SLA 的放置、成本优化以及面向性能的工作负载分发打开新可能。

<!--
## The evolution of tolerations
-->
## 容忍度的演进

<!--
Historically, Kubernetes supported two primary toleration operators:
-->
从历史上看，Kubernetes 主要支持两种容忍度运算符：

<!--
- **`Equal`**: The toleration matches a taint if the key and value are exactly equal
- **`Exists`**: The toleration matches a taint if the key exists, regardless of value
-->
- **`Equal`**：当 key 与 value 完全相等时，容忍度匹配该污点
- **`Exists`**：只要 key 存在（无论 value 是什么），容忍度就匹配该污点

<!--
While these worked well for categorical scenarios, they fell short for numeric comparisons. Starting with v1.35, we are closing this gap.
-->
这两者对“类别型”场景很好用，但在数值比较方面就显得力不从心。从 v1.35 开始，我们在补齐这一缺口。

<!--
Consider these real-world scenarios:
-->
请看一些真实世界的场景：

<!--
- **SLA requirements**: Schedule high-availability workloads only on nodes with failure probability below a certain threshold
- **Cost optimization**: Allow cost-sensitive batch jobs to run on cheaper nodes that exceed a specific cost-per-hour value
- **Performance guarantees**: Ensure latency-sensitive applications run only on nodes with disk IOPS or network bandwidth above minimum thresholds
-->
- **SLA 要求**：只把高可用工作负载调度到失败概率低于某个阈值的节点上
- **成本优化**：允许对成本敏感的批处理作业运行在更便宜、且“每小时成本”超过某个特定值的节点上
- **性能保障**：确保对延迟敏感的应用只运行在磁盘 IOPS 或网络带宽高于最低阈值的节点上

<!--
Without numeric comparison operators, cluster operators have had to resort to workarounds like creating multiple discrete taint values or using external admission controllers, neither of which scale well or provide the flexibility needed for dynamic threshold-based scheduling.
-->
在缺少数值比较运算符的情况下，集群运维人员不得不采用一些变通方案，例如创建多个离散的污点值，
或使用外部准入控制器。但这些方案既难以规模化，也无法提供“动态阈值调度”所需的灵活性。

<!--
## Why extend tolerations instead of using NodeAffinity?
-->
## 为什么要扩展容忍度，而不是用节点亲和性（NodeAffinity）？

<!--
You might wonder: NodeAffinity already supports numeric comparison operators, so why extend tolerations? While NodeAffinity is powerful for expressing pod preferences, taints and tolerations provide critical operational benefits:
-->
你可能会问：NodeAffinity 已经支持数值比较运算符，为什么还要扩展容忍度？
NodeAffinity 虽然很适合表达 Pod 的偏好，但污点与容忍度提供了一些关键的运维收益：

<!--
- **Policy orientation**: NodeAffinity is per-pod, requiring every workload to explicitly opt-out of risky nodes. Taints invert control—nodes declare their risk level, and only pods with matching tolerations may land there. This provides a safer default; most pods stay away from spot/preemptible nodes unless they explicitly opt-in.
- **Eviction semantics**: NodeAffinity has no eviction capability. Taints support the `NoExecute` effect with `tolerationSeconds`, enabling operators to drain and evict pods when a node's SLA degrades or spot instances receive termination notices.
- **Operational ergonomics**: Centralized, node-side policy is consistent with other safety taints like disk-pressure and memory-pressure, making cluster management more intuitive.
-->
- **策略导向**：NodeAffinity 是按 Pod 配置的，需要每个工作负载显式选择“避开”风险节点。
  污点则把控制反转：由节点声明风险等级，只有带有匹配容忍度的 Pod 才能落到这些节点上。
  这提供了更安全的默认值：大多数 Pod 会默认避开 spot/可抢占节点，除非它们显式选择接受。
- **驱逐语义**：NodeAffinity 不具备驱逐能力。污点支持 `NoExecute` 效果以及 `tolerationSeconds`，
  使运维人员可以在节点 SLA 降级或 spot 实例收到终止通知时，排空（drain）并驱逐 Pod。
- **运维易用性**：集中式、节点侧的策略与磁盘压力、内存压力等其他安全污点一致，让集群管理更直观。

<!--
This enhancement preserves the well-understood safety model of taints and tolerations while enabling threshold-based placement for SLA-aware scheduling.
-->
该增强在保留污点与容忍度这一成熟安全模型的基础上，为 SLA 感知调度提供了基于阈值的放置能力。

<!--
## Introducing Gt and Lt operators
-->
## 引入 Gt 与 Lt 运算符

<!--
Kubernetes v1.35 introduces two new operators for tolerations:
-->
Kubernetes v1.35 为容忍度引入两个新运算符：

<!--
- **`Gt` (Greater Than)**: The toleration matches if the taint's numeric value is less than the toleration's value
- **`Lt` (Less Than)**: The toleration matches if the taint's numeric value is greater than the toleration's value
-->
- **`Gt`（Greater Than）**：当污点的数值 **小于** 容忍度的数值时，容忍度匹配
- **`Lt`（Less Than）**：当污点的数值 **大于** 容忍度的数值时，容忍度匹配

<!--
When a pod tolerates a taint with `Lt`, it's saying "I can tolerate nodes where this metric is *less than* my threshold". Since tolerations allow scheduling, the pod can run on nodes where the taint value is greater than the toleration value. Think of it as: "I tolerate nodes that are above my minimum requirements".
-->
当一个 Pod 使用 `Lt` 来容忍某个污点时，它表达的是：“我可以容忍该指标**小于**我的阈值的节点”。
由于“容忍度”本质上允许调度，因此该 Pod 也可以运行在污点值 **大于** 容忍度值的节点上。
你可以把它理解为：“我容忍满足我最低要求之上的节点”。

<!--
These operators work with numeric taint values and enable the scheduler to make sophisticated placement decisions based on continuous metrics rather than discrete categories.
-->
这些运算符适用于数值型污点值，使调度器能基于连续指标（continuous metrics）而不是离散类别做出更精细的放置决策。

{{< note >}}
<!--
Numeric values for `Gt` and `Lt` operators must be positive 64-bit integers without leading zeros. For example, `"100"` is valid, but `"0100"` (with leading zero) and `"0"` (zero value) are not permitted.

The `Gt` and `Lt` operators work with all taint effects: `NoSchedule`, `NoExecute`, and `PreferNoSchedule`.
-->
`Gt` 与 `Lt` 运算符的数值必须是**正的 64 位整数**，且**不能有前导零**。
例如，`"100"` 是合法的，但 `"0100"`（带前导零）与 `"0"`（零值）不被允许。

`Gt` 与 `Lt` 运算符适用于所有污点效果（effect）：`NoSchedule`、`NoExecute`、`PreferNoSchedule`。
{{< /note >}}

<!--
## Use cases and examples
-->
## 使用场景与示例

<!--
Let's explore how Extended Toleration Operators solve real-world scheduling challenges.
-->
下面我们通过几个例子看看扩展容忍度运算符如何解决真实调度挑战。

<!--
### Example 1: Spot instance protection with SLA thresholds
-->
### 示例 1：用 SLA 阈值限制 spot 实例的使用

<!--
Many clusters mix on-demand and spot/preemptible nodes to optimize costs. Spot nodes offer significant savings but have higher failure rates. You want most workloads to avoid spot nodes by default, while allowing specific workloads to opt-in with clear SLA boundaries.
-->
许多集群会混合按需与 spot/可抢占节点以优化成本。Spot 节点能显著节省费用，但失败率更高。
你希望大多数工作负载默认避开 spot 节点，同时允许某些工作负载在清晰的 SLA 边界内显式选择接受。

<!--
First, taint spot nodes with their failure probability (for example, 15% annual failure rate):
-->
首先，用“失败概率”给 spot 节点打上污点（例如：年化失败率 15%）：

```yaml
apiVersion: v1
kind: Node
metadata:
  name: spot-node-1
spec:
  taints:
  - key: "failure-probability"
    value: "15"
    effect: "NoExecute"
```

<!--
On-demand nodes have much lower failure rates:
-->
按需节点的失败率要低得多：

```yaml
apiVersion: v1
kind: Node
metadata:
  name: ondemand-node-1
spec:
  taints:
  - key: "failure-probability"
    value: "2"
    effect: "NoExecute"
```

<!--
Critical workloads can specify strict SLA requirements:
-->
关键工作负载可以指定严格的 SLA 要求：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: payment-processor
spec:
  tolerations:
  - key: "failure-probability"
    operator: "Lt"
    value: "5"
    effect: "NoExecute"
    tolerationSeconds: 30
  containers:
  - name: app
    image: payment-app:v1
```

<!--
This pod will **only** schedule on nodes with `failure-probability` less than 5 (meaning `ondemand-node-1` with 2% but not `spot-node-1` with 15%). The `NoExecute` effect with `tolerationSeconds: 30` means if a node's SLA degrades (for example, cloud provider changes the taint value), the pod gets 30 seconds to gracefully terminate before forced eviction.
-->
这个 Pod 将**只会**被调度到 `failure-probability` 小于 5 的节点上（也就是 2% 的 `ondemand-node-1`，
而不是 15% 的 `spot-node-1`）。带有 `tolerationSeconds: 30` 的 `NoExecute` 效果意味着：
如果节点 SLA 降级（例如云厂商改变了污点值），该 Pod 会获得 30 秒的时间用于优雅终止，然后才会被强制驱逐。

<!--
Meanwhile, a fault-tolerant batch job can explicitly opt-in to spot instances:
-->
与此同时，一个具备容错能力的批处理作业可以显式选择接受 spot 实例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: batch-job
spec:
  tolerations:
  - key: "failure-probability"
    operator: "Lt"
    value: "20"
    effect: "NoExecute"
  containers:
  - name: worker
    image: batch-worker:v1
```

<!--
This batch job tolerates nodes with failure probability up to 20%, so it can run on both on-demand and spot nodes, maximizing cost savings while accepting higher risk.
-->
该批处理作业可容忍失败概率最高 20% 的节点，因此既能运行在按需节点上，也能运行在 spot 节点上，
在接受更高风险的同时最大化节省成本。

<!--
### Example 2: AI workload placement with GPU tiers
-->
### 示例 2：基于 GPU 分层的 AI 工作负载放置

<!--
AI and machine learning workloads often have specific hardware requirements. With Extended Toleration Operators, you can create GPU node tiers and ensure workloads land on appropriately powered hardware.
-->
AI 与机器学习工作负载通常对硬件有明确要求。通过扩展容忍度运算符，你可以建立 GPU 节点分层，
并确保工作负载落到性能匹配的硬件上。

<!--
Taint GPU nodes with their compute capability score:
-->
用“算力评分”给 GPU 节点打上污点：

```yaml
apiVersion: v1
kind: Node
metadata:
  name: gpu-node-a100
spec:
  taints:
  - key: "gpu-compute-score"
    value: "1000"
    effect: "NoSchedule"
---
apiVersion: v1
kind: Node
metadata:
  name: gpu-node-t4
spec:
  taints:
  - key: "gpu-compute-score"
    value: "500"
    effect: "NoSchedule"
```

<!--
A heavy training workload can require high-performance GPUs:
-->
重训练（heavy training）工作负载可以要求更高性能的 GPU：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: model-training
spec:
  tolerations:
  - key: "gpu-compute-score"
    operator: "Gt"
    value: "800"
    effect: "NoSchedule"
  containers:
  - name: trainer
    image: ml-trainer:v1
    resources:
      limits:
        nvidia.com/gpu: 1
```

<!--
This ensures the training pod only schedules on nodes with compute scores greater than 800 (like the A100 node), preventing placement on lower-tier GPUs that would slow down training.
-->
这将确保训练 Pod 只会被调度到算力评分大于 800 的节点上（如 A100 节点），避免落到低档 GPU 上而拖慢训练。

<!--
Meanwhile, inference workloads with less demanding requirements can use any available GPU:
-->
而对性能要求没那么高的推理工作负载则可以使用任何可用 GPU：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: model-inference
spec:
  tolerations:
  - key: "gpu-compute-score"
    operator: "Gt"
    value: "400"
    effect: "NoSchedule"
  containers:
  - name: inference
    image: ml-inference:v1
    resources:
      limits:
        nvidia.com/gpu: 1
```

<!--
### Example 3: Cost-optimized workload placement
-->
### 示例 3：面向成本优化的工作负载放置

<!--
For batch processing or non-critical workloads, you might want to minimize costs by running on cheaper nodes, even if they have lower performance characteristics.
-->
对于批处理或非关键工作负载，你可能希望即使牺牲一些性能特征，也通过运行在更便宜的节点上来尽量降低成本。

<!--
Nodes can be tainted with their cost rating:
-->
节点可以用成本评级来打污点：

```yaml
spec:
  taints:
  - key: "cost-per-hour"
    value: "50"
    effect: "NoSchedule"
```

<!--
A cost-sensitive batch job can express its tolerance for expensive nodes:
-->
对成本敏感的批处理作业可以表达它对昂贵节点的容忍度：

```yaml
tolerations:
- key: "cost-per-hour"
  operator: "Lt"
  value: "100"
  effect: "NoSchedule"
```

<!--
This batch job will schedule on nodes costing less than $100/hour but avoid more expensive nodes. Combined with Kubernetes scheduling priorities, this enables sophisticated cost-tiering strategies where critical workloads get premium nodes while batch workloads efficiently use budget-friendly resources.
-->
该批处理作业会被调度到成本低于 100 美元/小时的节点上，并避开更昂贵的节点。
结合 Kubernetes 的调度优先级能力，你可以实现更精细的成本分层策略：关键工作负载使用高配节点，
而批处理作业高效利用更经济的资源。

<!--
### Example 4: Performance-based placement
-->
### 示例 4：基于性能的放置

<!--
Storage-intensive applications often require minimum disk performance guarantees. With Extended Toleration Operators, you can enforce these requirements at the scheduling level.
-->
存储密集型应用通常需要最低磁盘性能保障。通过扩展容忍度运算符，你可以在调度层面强制执行这些要求。

```yaml
tolerations:
- key: "disk-iops"
  operator: "Gt"
  value: "3000"
  effect: "NoSchedule"
```

<!--
This toleration ensures the pod only schedules on nodes where `disk-iops` exceeds 3000. The `Gt` operator means "I need nodes that are greater than this minimum".
-->
该容忍度确保 Pod 只会被调度到 `disk-iops` 超过 3000 的节点上。
`Gt` 运算符表达的是：“我需要指标高于这个最低值的节点”。

<!--
## How to use this feature
-->
## 如何使用该特性

<!--
Extended Toleration Operators is an **alpha feature** in Kubernetes v1.35. To try it out:
-->
扩展容忍度运算符是 Kubernetes v1.35 中的 **Alpha 特性**。要试用它：

<!--
1. **Enable the feature gate** on both your API server and scheduler:
-->
1. **在 API server 与 scheduler 上启用特性门控**：

    ```bash
    --feature-gates=TaintTolerationComparisonOperators=true
    ```

<!--
1. **Taint your nodes** with numeric values representing the metrics relevant to your scheduling needs:
-->
2. **用数值型污点给节点打标**，其值代表你调度所关心的指标：

    ```bash
    kubectl taint nodes node-1 failure-probability=5:NoSchedule
    kubectl taint nodes node-2 disk-iops=5000:NoSchedule
    ```

<!--
1. **Use the new operators** in your pod specifications:
-->
3. **在 Pod 规约中使用新运算符**：

    ```yaml
      spec:
        tolerations:
        - key: "failure-probability"
          operator: "Lt"
          value: "1"
          effect: "NoSchedule"
    ```

{{< note >}}
<!--
As an alpha feature, Extended Toleration Operators may change in future releases and should be used with caution in production environments. Always test thoroughly in non-production clusters first.
-->
作为 Alpha 特性，扩展容忍度运算符可能会在未来版本中发生变化，应谨慎用于生产环境。
请务必先在非生产集群中充分测试。
{{< /note >}}

<!--
## What's next?
-->
## 下一步计划是什么？

<!--
This alpha release is just the beginning. As we gather feedback from the community, we plan to:
-->
这次 Alpha 发布只是开始。随着我们收集社区反馈，我们计划：

<!--
- Add support for [CEL (Common Expression Language) expressions](https://github.com/kubernetes/enhancements/issues/5500) in tolerations and node affinity for even more flexible scheduling logic, including semantic versioning comparisons
- Improve integration with cluster autoscaling for threshold-aware capacity planning
- Graduate the feature to beta and eventually GA with production-ready stability
-->
- 在容忍度与节点亲和性（node affinity）中增加对 [CEL（Common Expression Language）表达式](https://github.com/kubernetes/enhancements/issues/5500)
  的支持，以提供更灵活的调度逻辑（包括语义化版本比较）
- 改进与集群自动扩缩容（cluster autoscaling）的集成，以支持“阈值感知”的容量规划
- 将该特性升级为 Beta，并最终达到具备生产级稳定性的 GA

<!--
We're particularly interested in hearing about your use cases! Do you have scenarios where threshold-based scheduling would solve problems? Are there additional operators or capabilities you'd like to see?
-->
我们尤其希望听到你的使用场景！你是否有一些问题可以通过“基于阈值的调度”来解决？
你还希望看到哪些额外运算符或能力？

<!--
## Getting involved
-->
## 参与其中

<!--
This feature is driven by the [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) community. Please join us to connect with the community and share your ideas and feedback around this feature and beyond.
-->
该特性由 [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) 社区推动。
欢迎加入我们，与社区交流并分享你对该特性及其他相关议题的想法与反馈。

<!--
You can reach the maintainers of this feature at:
-->
你可以通过以下方式联系该特性的维护者：

<!--
- Slack: [#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling) on Kubernetes Slack
- Mailing list: [kubernetes-sig-scheduling@googlegroups.com](https://groups.google.com/g/kubernetes-sig-scheduling)
-->
- Slack：Kubernetes Slack 上的 [#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling)
- 邮件列表：[kubernetes-sig-scheduling@googlegroups.com](https://groups.google.com/g/kubernetes-sig-scheduling)

<!--
For questions or specific inquiries related to Extended Toleration Operators, please reach out to the SIG Scheduling community. We look forward to hearing from you!
-->
如果你对扩展容忍度运算符有疑问或具体咨询，请联系 SIG Scheduling 社区。我们期待你的反馈！

<!--
## How can I learn more?
-->
## 如何了解更多？

<!--
- [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) for understanding the fundamentals
- [Numeric comparison operators](/docs/concepts/scheduling-eviction/taint-and-toleration/#numeric-comparison-operators) for details on using `Gt` and `Lt` operators
- [KEP-5471: Extended Toleration Operators for Threshold-Based Placement](https://kep.k8s.io/5471)
-->
- 阅读基础概念：[污点与容忍度（Taints and Tolerations）](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
- 了解 `Gt` / `Lt` 用法细节：[数值比较运算符（Numeric comparison operators）](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#numeric-comparison-operators)
- 阅读提案：[KEP-5471：用于基于阈值放置的扩展容忍度运算符](https://kep.k8s.io/5471)
