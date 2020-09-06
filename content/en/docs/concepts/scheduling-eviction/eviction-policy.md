---
title: Eviction Policy
content_template: templates/concept
weight: 60
---

<!-- overview -->

This page is an overview of Kubernetes' policy for eviction.

<!-- body -->

## Eviction Policy

The {{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} can proactively monitor for and prevent total starvation of a
compute resource. In those cases, the `kubelet` can reclaim the starved
resource by proactively failing one or more Pods. When the `kubelet` fails
a Pod, it terminates all of its containers and transitions its `PodPhase` to `Failed`.
If the evicted Pod is managed by a Deployment, the Deployment will create another Pod
to be scheduled by Kubernetes.

## {{% heading "whatsnext" %}}
- Read [Configure out of resource handling](/docs/tasks/administer-cluster/out-of-resource/) to learn more about eviction signals, thresholds, and handling.