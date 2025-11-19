---
title: ResourceSlice
id: resourceslice
date: 2025-05-26
full_link: /docs/reference/kubernetes-api/workload-resources/resource-slice-v1beta1/
short_description: >
  用一個相似資源所構成的池來表示一個或多個基礎設施資源（如設備）。

tags:
- workload
---
<!--
title: ResourceSlice
id: resourceslice
date: 2025-05-26
full_link: /docs/reference/kubernetes-api/workload-resources/resource-slice-v1beta1/
short_description: >
  Represents one or more infrastructure resources, like devices, in a pool of
  similar resources.

tags:
- workload
-->

<!--
Represents one or more infrastructure resources, such as
{{< glossary_tooltip text="devices" term_id="device" >}}, that are attached to
nodes. Drivers create and manage ResourceSlices in the cluster. ResourceSlices
are used for
[dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).
-->
表示掛接到節點上的一個或多個基礎設施資源，
例如{{< glossary_tooltip text="設備" term_id="device" >}}。
驅動會在集羣中創建並管理 ResourceSlice。ResourceSlice
用於[動態資源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)。

<!--more-->

<!--
When a {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} is
created, Kubernetes uses ResourceSlices to find nodes that have access to
resources that can satisfy the claim. Kubernetes allocates resources to the
ResourceClaim and schedules the Pod onto a node that can access the resources.
-->
當 {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}
被創建時，Kubernetes 使用 ResourceSlice 找到有權限訪問滿足申領資源的節點。
Kubernetes 將這些資源分配給 ResourceClaim，並將對應的 Pod 調度到能夠訪問這些資源的節點上。
