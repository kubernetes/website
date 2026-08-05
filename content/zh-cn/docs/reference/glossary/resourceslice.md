---
title: ResourceSlice
id: resourceslice
date: 2025-05-26
full_link: /docs/reference/kubernetes-api/workload-resources/resource-slice-v1beta1/
short_description: >
  用一个相似资源所构成的池来表示一个或多个基础设施资源（如设备）。

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
表示挂接到节点上的一个或多个基础设施资源，
例如{{< glossary_tooltip text="设备" term_id="device" >}}。
驱动会在集群中创建并管理 ResourceSlice。ResourceSlice
用于[动态资源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)。

<!--more-->

<!--
When a {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} is
created, Kubernetes uses ResourceSlices to find nodes that have access to
resources that can satisfy the claim. Kubernetes allocates resources to the
ResourceClaim and schedules the Pod onto a node that can access the resources.
-->
当 {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}
被创建时，Kubernetes 使用 ResourceSlice 找到有权限访问满足申领资源的节点。
Kubernetes 将这些资源分配给 ResourceClaim，并将对应的 Pod 调度到能够访问这些资源的节点上。
