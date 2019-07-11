---
title: Pod management controllers
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

This page lists the {{< glossary_tooltip term_id="pod" >}} management
{{< glossary_tooltip text="controllers" term_id="controller" >}}
that come as part of Kubernetes itself.

{{% /capture %}}

{{% capture body %}}

## HorizontalPodAutoscaler controller

The [HorizontalPodAutoscaler](/docs/reference/controllers/horizontal-pod-autoscaler/)
controller enacts the scaling rules from each HorizontalPodAutoscaler object.

## PodDisruptionBudget controller

The [PodDisruptionBudget controller](/docs/reference/controllers/poddisruptionbudget/)
manages the amount of [disruption](/docs/concepts/workloads/pods/disruptions/) to workloads
running on your cluster.

## PodPreset controller

The [PodPreset controller](/docs/reference/access-authn-authz/admission-controllers/#podpreset)
is an admission controller that applies [Pod presets](/docs/concepts/workloads/pods/podpreset/)
to incoming Pods.

{{% /capture %}}

{{% capture whatsnext %}}
* Read about [Resource management controllers](/docs/reference/controllers/resource-management-controllers)
{{% /capture %}}
