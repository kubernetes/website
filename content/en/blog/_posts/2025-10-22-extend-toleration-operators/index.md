---
layout: blog
title: "Kubernetes v1.35: Extended Toleration Operators (Alpha)"
draft: true
date: 2025-10-22T10:00:00-08:00
slug: kubernetes-v1-35-extended-toleration-operators
author: >
  Heba Elayoty (Microsoft)
---

Imagine you're running a critical payment processing service that requires nodes with less than 1% failure probability, or batch jobs that should only use nodes costing under $0.50 per hour. Today, Kubernetes taints and tolerations can match exact values or check for existence, but they can't compare numeric thresholds. You'd need to create discrete taint categories, use external admission controllers, or accept less-than-optimal placement decisions.

In Kubernetes v1.35, we're introducing **Extended Toleration Operators** as an alpha feature. This enhancement adds `Gt` (Greater Than) and `Lt` (Less Than) operators to tolerations, enabling threshold-based scheduling decisions that unlock new possibilities for SLA-based placement, cost optimization, and performance-aware workload distribution.

## The limitation of current tolerations

Today, Kubernetes supports two toleration operators:

- **`Equal`**: The toleration matches a taint if the key and value are exactly equal
- **`Exists`**: The toleration matches a taint if the key exists, regardless of value

These operators work well for categorical scenarios, such as tolerating nodes dedicated to specific teams, hardware types, or maintenance windows. However, they fall short when you need to make decisions based on numeric comparisons.

Consider these real-world scenarios:

- **SLA requirements**: Schedule high-availability workloads only on nodes with failure probability below a certain threshold
- **Cost optimization**: Allow cost-sensitive batch jobs to run on cheaper nodes that exceed a specific cost-per-hour value
- **Performance guarantees**: Ensure latency-sensitive applications run only on nodes with disk IOPS or network bandwidth above minimum thresholds

Without numeric comparison operators, cluster operators have had to resort to workarounds like creating multiple discrete taint values or using external admission controllers, neither of which scale well or provide the flexibility needed for dynamic threshold-based scheduling.

## Introducing Gt and Lt operators

The Extended Toleration Operators feature introduces two new operators for tolerations:

- **`Gt` (Greater Than)**: The toleration matches if the taint's numeric value is less than the toleration's value
- **`Lt` (Less Than)**: The toleration matches if the taint's numeric value is greater than the toleration's value

When a pod tolerates a taint with `Lt`, it's saying "I can tolerate nodes where this metric is *less than* my threshold". Since tolerations allow scheduling, the pod can run on nodes where the taint value is greater than the toleration value. Think of it as: "I tolerate nodes that are above my minimum requirements".

These operators work with numeric taint values (integers and floats) and enable the scheduler to make sophisticated placement decisions based on continuous metrics rather than discrete categories.

## Use cases and examples

Let's explore how Extended Toleration Operators solve real-world scheduling challenges.

### Example 1: SLA-based scheduling

Imagine you manage a Kubernetes cluster where nodes are tainted with their predicted failure probability based on historical data, hardware age, or cloud provider SLAs. Critical workloads need to run only on highly reliable nodes.

First, nodes are tainted with their failure probability:

```yaml
apiVersion: v1
kind: Node
metadata:
  name: node-a
spec:
  taints:
  - key: "failure-probability"
    value: "0.005"
    effect: "NoSchedule"
```

Then, a high-availability pod can specify its reliability requirements:

```yaml
tolerations:
- key: "failure-probability"
  operator: "Lt"
  value: "0.01"
  effect: "NoSchedule"
```

This toleration ensures the pod only schedules on nodes where `failure-probability` is less than 0.01 (1%). If node-a has a failure probability of 0.005 (0.5%), the pod can be scheduled there. If another node has a failure probability of 0.02 (2%), the pod cannot tolerate that node's taint and won't be scheduled there.

This approach enables SLA-based scheduling without manually categorizing nodes or creating complex admission policies.

### Example 2: Cost-optimized workload placement

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

### Example 3: Performance-based placement

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
--feature-gates=ExtendedTolerationOperators=true
```

1. **Taint your nodes** with numeric values representing the metrics relevant to your scheduling needs:

```bash
kubectl taint nodes node-1 failure-probability=0.005:NoSchedule
kubectl taint nodes node-2 disk-iops=5000:NoSchedule
```

1. **Use the new operators** in your pod specifications:

```yaml
spec:
  tolerations:
  - key: "failure-probability"
    operator: "Lt"
    value: "0.01"
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
- [KEP-5471: Extended Toleration Operators for Threshold-Based Placement](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/5471-enable-sla-based-scheduling)
