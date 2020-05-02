---
title: Eviction Policy
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
This page is an overview of Kubernetes' policy for eviction.
{{% /capture %}}

{{% capture body %}}

## Eviction Policy

The `kubelet` can proactively monitor for and prevent total starvation of a
compute resource. In those cases, the `kubelet` can reclaim the starved
resource by proactively failing one or more Pods. When the `kubelet` fails
a Pod, it terminates all of its containers and transitions its `PodPhase` to `Failed`.
If the evicted Pod is managed by a Deployment, the Deployment will create another Pod
to be scheduled by Kubernetes.
{{% /capture %}}
