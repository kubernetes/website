---
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/endpoint-slices/
short_description: >
  一种将网络端点与 Kubernetes 资源组合在一起的方法。

aka:
tags:
- networking
---
<!--
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  A way to group network endpoints together with Kubernetes resources.

aka:
tags:
- networking
-->

<!--
 A way to group network endpoints together with Kubernetes resources.
-->
一种将网络端点与 Kubernetes 资源组合在一起的方法。

<!--more-->

<!--
A scalable and extensible way to group network endpoints together. These can be
used by {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} to
establish network routes on each {{< glossary_tooltip text="node" term_id="node" >}}.
-->
一种将网络端点组合在一起的可扩缩、可扩展方式。
它们将被 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} 用于在
每个 {{< glossary_tooltip text="节点" term_id="node">}} 上建立网络路由。
