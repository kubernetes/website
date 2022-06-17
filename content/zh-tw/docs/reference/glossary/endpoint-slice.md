---
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/endpoint-slices/
short_description: >
  一種將網路端點與 Kubernetes 資源組合在一起的方法。

aka:
tags:
- networking
---
  一種將網路端點與 Kubernetes 資源組合在一起的方法。

<!--
---
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  A way to group network endpoints together with Kubernetes resources.

aka:
tags:
- networking
---
 A way to group network endpoints together with Kubernetes resources.
-->

<!--more-->

<!--
A scalable and extensible way to group network endpoints together. These can be
used by {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} to
establish network routes on each {{< glossary_tooltip text="node" term_id="node" >}}.
-->


一種將網路端點組合在一起的可擴縮、可擴充套件方式。
它們將被 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} 用於在
每個 {{< glossary_tooltip text="節點" term_id="node">}} 上建立網路路由。
