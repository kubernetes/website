---
title: ResourceClaimTemplate
id: resourceclaimtemplate
date: 2025-05-26
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  定義一個模板，Kubernetes 據此創建 ResourceClaim。此模板用於爲每個 Pod 提供對一些獨立、相似的資源的訪問權限。

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
定義一個模板，Kubernetes 可據此創建
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}。ResourceClaimTemplate
用於在[動態資源分配（DRA）](/zh/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)中爲每個
Pod 提供對一些獨立、相似的資源的訪問權限。

<!--more-->

<!--
When a ResourceClaimTemplate is referenced in a workload specification,
Kubernetes automatically creates ResourceClaim objects based on the template.
Each ResourceClaim is bound to a specific Pod. When the Pod terminates,
Kubernetes deletes the corresponding ResourceClaim.
-->
當工作負載規約中引用了 ResourceClaimTemplate 時，
Kubernetes 會基於模板自動創建 ResourceClaim 對象。
每個 ResourceClaim 都會綁定到一個特定的 Pod。
當 Pod 終止時，Kubernetes 會刪除相應的 ResourceClaim。
