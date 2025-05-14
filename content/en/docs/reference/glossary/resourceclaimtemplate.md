---
title: ResourceClaimTemplate
id: resourceclaimtemplate
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Defines a template for Kubernetes to create ResourceClaims. Used to provide
  per-Pod access to separate, similar resources.

tags:
- workload
---
 Defines a template that Kubernetes uses to create
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. 
ResourceClaimTemplates are used in
[dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
to provide _per-Pod access to separate, similar resources_.

<!--more-->

When a ResourceClaimTemplate is referenced in a workload specification,
Kubernetes automatically creates ResourceClaim objects based on the template.
Each ResourceClaim is bound to a specific Pod. When the Pod terminates,
Kubernetes deletes the corresponding ResourceClaim. 
