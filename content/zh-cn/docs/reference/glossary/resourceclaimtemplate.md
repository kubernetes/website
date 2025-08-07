---
title: ResourceClaimTemplate
id: resourceclaimtemplate
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  定义一个模板，Kubernetes 据此创建 ResourceClaim。此模板用于为每个 Pod 提供对一些独立、相似的资源的访问权限。

tags:
- workload
---
<!--
title: ResourceClaimTemplate
id: resourceclaimtemplate
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Defines a template for Kubernetes to create ResourceClaims. Used to provide
  per-Pod access to separate, similar resources.

tags:
- workload
-->

<!--
Defines a template that Kubernetes uses to create
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. 
ResourceClaimTemplates are used in
[dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
to provide _per-Pod access to separate, similar resources_.
-->
定义一个模板，Kubernetes 可据此创建
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}。ResourceClaimTemplate
用于在[动态资源分配（DRA）](/zh/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)中为每个
Pod 提供对一些独立、相似的资源的访问权限。

<!--more-->

<!--
When a ResourceClaimTemplate is referenced in a workload specification,
Kubernetes automatically creates ResourceClaim objects based on the template.
Each ResourceClaim is bound to a specific Pod. When the Pod terminates,
Kubernetes deletes the corresponding ResourceClaim.
-->
当工作负载规约中引用了 ResourceClaimTemplate 时，
Kubernetes 会基于模板自动创建 ResourceClaim 对象。
每个 ResourceClaim 都会绑定到一个特定的 Pod。
当 Pod 终止时，Kubernetes 会删除相应的 ResourceClaim。
