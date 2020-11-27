---
title: Eviction Policy
content_type: concept
weight: 60
---

<!-- overview -->

This page is an overview of Kubernetes' policy for eviction.

<!-- body -->

## Eviction Policy

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} proactively monitors for
and prevents total starvation of a compute resource. In those cases, the `kubelet` can reclaim
the starved resource by failing one or more Pods. When the `kubelet` fails
a Pod, it terminates all of its containers and transitions its `PodPhase` to `Failed`.
If the evicted Pod is managed by a Deployment, the Deployment creates another Pod
to be scheduled by Kubernetes.

## {{% heading "whatsnext" %}}

- Learn how to [configure out of resource handling](/docs/tasks/administer-cluster/out-of-resource/) with eviction signals and thresholds.
