---
layout: blog
title: "Kubernetes v1.35: Extended Toleration Operators to Support Numeric Comparisons (Alpha)"
date: 2026-01-05T10:30:00-08:00
slug: kubernetes-v1-35-numeric-toleration-operators
author: >
  Heba Elayoty (Microsoft)
---

Many production Kubernetes clusters blend on-demand (higher-SLA) and spot/preemptible (lower-SLA) nodes to optimize costs while maintaining reliability for critical workloads. Platform teams need a safe default that keeps most workloads away from risky capacity, while allowing specific workloads to opt-in with explicit thresholds like "I can tolerate nodes with failure probability up to 5%".

Today, Kubernetes taints and tolerations can match exact values or check for existence, but they can't compare numeric thresholds. You'd need to create discrete taint categories, use external admission controllers, or accept less-than-optimal placement decisions.

In Kubernetes v1.35, we're introducing **Extended Toleration Operators** as an alpha feature. This enhancement adds `Gt` (Greater Than) and `Lt` (Less Than) operators to `spec.tolerations`, enabling threshold-based scheduling decisions that unlock new possibilities for SLA-based placement, cost optimization, and performance-aware workload distribution.

## The evolution of tolerations

Historically, Kubernetes supported two primary toleration operators:

- **`Equal`**: The toleration matches a taint if the key and value are exactly equal
- **`Exists`**: The toleration matches a taint if the key exists, regardless of value

While these worked well for categorical scenarios, they fell short for numeric comparisons. Starting with v1.35, we are closing this gap.

Consider these real-world scenarios:

- **SLA requirements**: Schedule high-availability workloads only on nodes with failure probability below a certain threshold
- **Cost optimization**: Allow cost-sensitive batch jobs to run on cheaper nodes that exceed a specific cost-per-hour value
- **Performance guarantees**: Ensure latency-sensitive applications run only on nodes with disk IOPS or network bandwidth above minimum thresholds

Without numeric comparison operators, cluster operators have had to resort to workarounds like creating multiple discrete taint values or using external admission controllers, neither of which scale well or provide the flexibility needed for dynamic threshold-based scheduling.

## Why extend tolerations instead of using NodeAffinity?

You might wonder: NodeAffinity already supports numeric comparison operators, so why extend tolerations? While NodeAffinity is powerful for expressing pod preferences, taints and tolerations provide critical operational benefits:

- **Policy orientation**: NodeAffinity is per-pod, requiring every workload to explicitly opt-out of risky nodes. Taints invert control—nodes declare their risk level, and only pods with matching tolerations may land there. This provides a safer default; most pods stay away from spot/preemptible nodes unless they explicitly opt-in.
- **Eviction semantics**: NodeAffinity has no eviction capability. Taints support the `NoExecute` effect with `tolerationSeconds`, enabling operators to drain and evict pods when a node's SLA degrades or spot instances receive termination notices.
- **Operational ergonomics**: Centralized, node-side policy is consistent with other safety taints like disk-pressure and memory-pressure, making cluster management more intuitive.

This enhancement preserves the well-understood safety model of taints and tolerations while enabling threshold-based placement for SLA-aware scheduling.

## Introducing Gt and Lt operators

Kubernetes v1.35 introduces two new operators for tolerations:

- **`Gt` (Greater Than)**: The toleration matches if the taint's numeric value is less than the toleration's value
- **`Lt` (Less Than)**: The toleration matches if the taint's numeric value is greater than the toleration's value

When a pod tolerates a taint with `Lt`, it's saying "I can tolerate nodes where this metric is *less than* my threshold". Since tolerations allow scheduling, the pod can run on nodes where the taint value is greater than the toleration value. Think of it as: "I tolerate nodes that are above my minimum requirements".

These operators work with numeric taint values and enable the scheduler to make sophisticated placement decisions based on continuous metrics rather than discrete categories.

{{< note >}}
Numeric values for `Gt` and `Lt` operators must be positive 64-bit integers without leading zeros. For example, `"100"` is valid, but `"0100"` (with leading zero) and `"0"` (zero value) are not permitted.

The `Gt` and `Lt` operators work with all taint effects: `NoSchedule`, `NoExecute`, and `PreferNoSchedule`.
{{< /note >}}

## Use cases and examples

Let's explore how Extended Toleration Operators solve real-world scheduling challenges.

### Example 1: Spot instance protection with SLA thresholds

Many clusters mix on-demand and spot/preemptible nodes to optimize costs. Spot nodes offer significant savings but have higher failure rates. You want most workloads to avoid spot nodes by default, while allowing specific workloads to opt-in with clear SLA boundaries.

First, taint spot nodes with their failure probability (for example, 15% annual failure rate):

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

On-demand nodes have much lower failure rates:

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

Critical workloads can specify strict SLA requirements:

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

This pod will **only** schedule on nodes with `failure-probability` less than 5 (meaning `ondemand-node-1` with 2% but not `spot-node-1` with 15%). The `NoExecute` effect with `tolerationSeconds: 30` means if a node's SLA degrades (for example, cloud provider changes the taint value), the pod gets 30 seconds to gracefully terminate before forced eviction.

Meanwhile, a fault-tolerant batch job can explicitly opt-in to spot instances:

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

This batch job tolerates nodes with failure probability up to 20%, so it can run on both on-demand and spot nodes, maximizing cost savings while accepting higher risk.

### Example 2: AI workload placement with GPU tiers

AI and machine learning workloads often have specific hardware requirements. With Extended Toleration Operators, you can create GPU node tiers and ensure workloads land on appropriately powered hardware.

Taint GPU nodes with their compute capability score:

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

A heavy training workload can require high-performance GPUs:

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

This ensures the training pod only schedules on nodes with compute scores greater than 800 (like the A100 node), preventing placement on lower-tier GPUs that would slow down training.

Meanwhile, inference workloads with less demanding requirements can use any available GPU:

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

### Example 3: Cost-optimized workload placement

For batch processing or non-critical workloads, you might want to minimize costs by running on cheaper nodes, even if they have lower performance characteristics.

Nodes can be tainted with their cost rating:

```yaml
spec:
  taints:
  - key: "cost-per-hour"
    value: "50"
    effect: "NoSchedule"
```

A cost-sensitive batch job can express its tolerance for expensive nodes:

```yaml
tolerations:
- key: "cost-per-hour"
  operator: "Lt"
  value: "100"
  effect: "NoSchedule"
```

This batch job will schedule on nodes costing less than $100/hour but avoid more expensive nodes. Combined with Kubernetes scheduling priorities, this enables sophisticated cost-tiering strategies where critical workloads get premium nodes while batch workloads efficiently use budget-friendly resources.

### Example 4: Performance-based placement

Storage-intensive applications often require minimum disk performance guarantees. With Extended Toleration Operators, you can enforce these requirements at the scheduling level.

```yaml
tolerations:
- key: "disk-iops"
  operator: "Gt"
  value: "3000"
  effect: "NoSchedule"
```

This toleration ensures the pod only schedules on nodes where `disk-iops` exceeds 3000. The `Gt` operator means "I need nodes that are greater than this minimum".

## How to use this feature

Extended Toleration Operators is an **alpha feature** in Kubernetes v1.35. To try it out:

1. **Enable the feature gate** on both your API server and scheduler:

    ```bash
    --feature-gates=TaintTolerationComparisonOperators=true
    ```

1. **Taint your nodes** with numeric values representing the metrics relevant to your scheduling needs:

    ```bash
      kubectl taint nodes node-1 failure-probability=5:NoSchedule
      kubectl taint nodes node-2 disk-iops=5000:NoSchedule
    ```

1. **Use the new operators** in your pod specifications:

    ```yaml
      spec:
        tolerations:
        - key: "failure-probability"
          operator: "Lt"
          value: "1"
          effect: "NoSchedule"
    ```

{{< note >}}
As an alpha feature, Extended Toleration Operators may change in future releases and should be used with caution in production environments. Always test thoroughly in non-production clusters first.
{{< /note >}}

## What's next?

This alpha release is just the beginning. As we gather feedback from the community, we plan to:

- Add support for [CEL (Common Expression Language) expressions](https://github.com/kubernetes/enhancements/issues/5500) in tolerations and node affinity for even more flexible scheduling logic, including semantic versioning comparisons
- Improve integration with cluster autoscaling for threshold-aware capacity planning
- Graduate the feature to beta and eventually GA with production-ready stability

We're particularly interested in hearing about your use cases! Do you have scenarios where threshold-based scheduling would solve problems? Are there additional operators or capabilities you'd like to see?

## Getting involved

This feature is driven by the [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) community. Please join us to connect with the community and share your ideas and feedback around this feature and beyond.

You can reach the maintainers of this feature at:

- Slack: [#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling) on Kubernetes Slack
- Mailing list: [kubernetes-sig-scheduling@googlegroups.com](https://groups.google.com/g/kubernetes-sig-scheduling)

For questions or specific inquiries related to Extended Toleration Operators, please reach out to the SIG Scheduling community. We look forward to hearing from you!

## How can I learn more?

- [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) for understanding the fundamentals
- [Numeric comparison operators](/docs/concepts/scheduling-eviction/taint-and-toleration/#numeric-comparison-operators) for details on using `Gt` and `Lt` operators
- [KEP-5471: Extended Toleration Operators for Threshold-Based Placement](https://kep.k8s.io/5471)
