---
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/endpoint-slices/
short_description: >
  EndpointSlices 跟踪提供 Service 的 Pod 的 IP 地址。

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
  EndpointSlices track the IP addresses of Pods for Services.

aka:
tags:
- networking
-->

<!--
EndpointSlices track the IP addresses of backend endpoints.
EndpointSlices are normally associated with a
{{< glossary_tooltip text="Service" term_id="service" >}} and the backend endpoints typically represent
{{< glossary_tooltip text="Pods" term_id="pod" >}}.
-->
EndpointSlices 跟踪后端端点的 IP 地址。
EndpointSlices 通常与某个 {{< glossary_tooltip text="Service" term_id="service" >}} 关联，
后端端点通常表示 {{< glossary_tooltip text="Pod" term_id="pod" >}}。

<!--more-->

<!--
One Service can be backed by multiple Pods. Kubernetes represents the backing endpoints of a Service
with a set of EndpointSlices that are associated with that Service.
The backing endpoints are usually, but not always, pods running in the cluster.

The control plane usually manages EndpointSlices for you automatically. However,
EndpointSlices can be defined manually for {{< glossary_tooltip text="Services" term_id="service" >}} without
{{< glossary_tooltip text="selectors" term_id="selector" >}} specified.
-->
一个 Service 可以由多个 Pod 支撑。Kubernetes 使用与该 Service 关联的一组 EndpointSlice
来表示这些支撑 Service 的端点。这些支撑的端点通常是集群中运行的 Pod，但并非总是如此。

控制平面通常为你自动管理 EndpointSlice。
EndpointSlice 可以手动定义给没有指定{{< glossary_tooltip text="选择算符" term_id="selector" >}}的
{{< glossary_tooltip text="Service" term_id="service" >}}。
