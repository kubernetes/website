---
title: 端点（Endpoints）
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  Service 的一个端点是实现该服务的 Pod 之一（或外部服务器）。

aka:
tags:
- networking
---
<!--
title: Endpoints
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  An endpoint of a Service is one of the Pods (or external servers) that implements the Service.

aka:
tags:
- networking
-->

<!--
 An endpoint of a {{< glossary_tooltip text="Service" term_id="service" >}} is one of the {{< glossary_tooltip text="Pods" term_id="pod" >}} (or external servers) that implements the Service.
-->
一个 {{< glossary_tooltip text="Service" term_id="service" >}}
的端点是实现该 Service 的 {{< glossary_tooltip text="Pod 之一" term_id="pod" >}}
（或外部服务器）。

<!--more-->

<!--
For Services with {{< glossary_tooltip text="selectors" term_id="selector" >}},
the EndpointSlice controller will automatically create one or more {{<
glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}} giving the
IP addresses of the selected endpoint Pods.
-->
对于带有{{< glossary_tooltip text="选择器" term_id="selector" >}}的 Service，
EndpointSlice 控制器将自动创建一个或多个
{{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}}，
提供选定端点 Pod 的 IP 地址。

<!--
EndpointSlices can also be created manually to indicate the endpoints of
Services that have no selector specified.
-->
EndpointSlices 也可以手动创建，以指示没有指定选择器的服务的端点。
