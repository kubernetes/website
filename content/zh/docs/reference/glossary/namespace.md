---
title: 命名空间
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  命名空间是 Kubernetes 为了在同一物理集群上实现多个虚拟集群而使用的一种抽象概念。

aka: 
tags:
- fundamental
---

<!--
---
title: Namespace
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  An abstraction used by Kubernetes to support multiple virtual clusters on the same physical cluster.

aka: 
tags:
- fundamental
---
-->

<!--
 An abstraction used by Kubernetes to support multiple virtual clusters on the same physical {{< glossary_tooltip text="cluster" term_id="cluster" >}}.
-->

命名空间是 Kubernetes 为了在同一物理集群上实现多个虚拟集群而使用的一种抽象概念。

<!--more--> 

<!--
Namespaces are used to organize objects in a cluster and provide a way to divide cluster resources. Names of resources need to be unique within a namespace, but not across namespaces.
-->

命名空间是用来组织集群中的资源对象，并为实现集群资源的隔离提供了一种方法。命名空间内的资源名称必须唯一，但是跨命名空间却不必唯一（即不同命名空间的资源名称可以相同）。
