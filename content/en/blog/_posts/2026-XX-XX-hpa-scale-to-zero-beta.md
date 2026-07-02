---
layout: blog
title: "Kubernetes v1.37: Scale HorizontalPodAutoscaler Workloads to and from Zero"
date: 2026-XX-XX
slug: hpa-scale-to-zero-beta
author: >
  Johannes Würbach
draft: true
---

<!--
This is a placeholder / skeleton for a Kubernetes v1.37 feature blog. It will be
expanded before the release. The `date` (front matter and file name) uses `XX`
on purpose — the Communications Team will set the publication date later.
Remove this comment before publishing.
-->

In Kubernetes v1.37, the
[`HPAScaleToZero`](/docs/reference/command-line-tools-reference/feature-gates/)
feature gate graduates to **beta** and is **enabled by default**. With it, a
{{< glossary_tooltip text="HorizontalPodAutoscaler" term_id="horizontal-pod-autoscaler" >}}
(HPA) that scales on object or external metrics can scale a workload all the way
down to zero replicas — and back up again when work arrives.

<!-- TODO: one or two sentence hook on why this matters (cost savings, idle GPU
workloads, energy use). -->

## The problem: paying for idle workloads

<!-- TODO: describe the motivation — e.g. queue consumers that are idle most of
the time, or expensive GPU workloads that only need to run on demand. Until now
an HPA could only scale down to a minimum of one replica. -->

## Scaling to and from zero

<!-- TODO: explain that setting `minReplicas: 0` lets the HPA scale the workload
to zero when the metric is 0, and back up once it crosses the target. Note that
this is limited to object and external metrics, since resource metrics (CPU /
memory) can only be measured on running Pods. -->

### Example

<!-- TODO: a minimal HorizontalPodAutoscaler manifest using `minReplicas: 0`
with an external metric (e.g. a queue length). -->

```yaml
# TODO: example HPA with minReplicas: 0 and an external metric
```

## How it works

<!-- TODO: describe the `ScaledToZero` status condition (set to `True` while the
controller holds the workload at zero, `False` with reason `NotScaledToZero`
after it scales back up) and how it lets the HPA distinguish a workload it scaled
to zero from one that was manually paused by setting replicas to 0. -->

## Before you use it

<!-- TODO:
- Only object and external metrics can scale to zero (not CPU / memory).
- `minReplicas: 0` requires at least one object or external metric; the API
  server rejects the HPA otherwise.
- The feature gate must be enabled on both kube-apiserver and
  kube-controller-manager.
- Upgrade / downgrade and version-skew considerations.
-->

## How can I learn more?

- Read the documentation:
  [Horizontal Pod Autoscaling — Scaling to and from zero](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/#scaling-to-and-from-zero).
- Read the KEP:
  [KEP-2021: HPA supports scaling to/from zero pods for object/external metrics](https://github.com/kubernetes/enhancements/issues/2021).

## How to get involved

<!-- TODO: SIG Autoscaling meeting / Slack channel, and an invitation to give
feedback on the beta. -->

## Acknowledgements

<!-- TODO: thank the contributors and reviewers who helped bring this feature to
beta. -->
