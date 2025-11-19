---
title: 名字空間（Namespace）
id: namespace
date: 2018-04-12
full_link: /zh-cn/docs/concepts/overview/working-with-objects/namespaces/
short_description: >
  名字空間是 Kubernetes 用來支持隔離單個集羣中的資源組的一種抽象。

aka: 
tags:
- fundamental
---

<!--
---
title: Namespace
id: namespace
date: 2018-04-12
full_link: /docs/concepts/overview/working-with-objects/namespaces/
short_description: >
  An abstraction used by Kubernetes to support isolation of groups of resources within a single cluster.

aka: 
tags:
- fundamental
---
-->

<!--
 An abstraction used by Kubernetes to support isolation of groups of resources within a single {{< glossary_tooltip text="cluster" term_id="cluster" >}}.
-->

名字空間是 Kubernetes 用來支持隔離單個 {{< glossary_tooltip text="集羣" term_id="cluster" >}}中的資源組的一種抽象。

<!--more--> 

<!--
Namespaces are used to organize objects in a cluster and provide a way to divide cluster resources. Names of resources need to be unique within a namespace, but not across namespaces. Namespace-based scoping is applicable only for namespaced objects _(e.g. Deployments, Services, etc)_ and not for cluster-wide objects _(e.g. StorageClass, Nodes, PersistentVolumes, etc)_.
-->

名字空間用來組織集羣中對象，併爲集羣資源劃分提供了一種方法。
同一名字空間內的資源名稱必須唯一，但跨名字空間時不作要求。
基於名字空間的作用域限定僅適用於名字空間作用域的對象（例如 Deployment、Services 等），
而不適用於集羣作用域的對象（例如 StorageClass、Node、PersistentVolume 等）。
在一些文檔里名字空間也稱爲命名空間。
