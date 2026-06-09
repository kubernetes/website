---
title: ResourceClaimTemplate
id: resourceclaimtemplate
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Defines a template for Kubernetes to create ResourceClaims. Used to provide
  per-Pod or per-PodGroup access to separate, similar resources.

tags:
- workload
---
 Defines a template that Kubernetes uses to create
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}.
ResourceClaimTemplates are used in
[dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
to provide _per-Pod or per-{{< glossary_tooltip text="PodGroup" term_id="podgroup" >}} access to separate, similar resources_.

<!--more-->

When a ResourceClaimTemplate is referenced in a workload specification,
Kubernetes automatically creates ResourceClaim objects based on the template.
Each ResourceClaim is bound to a specific Pod or PodGroup. When the Pod
terminates or the PodGroup is deleted, Kubernetes deletes the corresponding
ResourceClaim. PodGroup ResourceClaimTemplates require the
[`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
feature to be enabled.
