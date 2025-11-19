---
title: 端點（Endpoints）
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  Service 的一個端點是實現該服務的 Pod 之一（或外部伺服器）。

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
一個 {{< glossary_tooltip text="Service" term_id="service" >}}
的端點是實現該 Service 的 {{< glossary_tooltip text="Pod 之一" term_id="pod" >}}
（或外部伺服器）。

<!--more-->

<!--
For Services with {{< glossary_tooltip text="selectors" term_id="selector" >}},
the EndpointSlice controller will automatically create one or more {{<
glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}} giving the
IP addresses of the selected endpoint Pods.
-->
對於帶有{{< glossary_tooltip text="選擇器" term_id="selector" >}}的 Service，
EndpointSlice 控制器將自動創建一個或多個
{{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}}，
提供選定端點 Pod 的 IP 地址。

<!--
EndpointSlices can also be created manually to indicate the endpoints of
Services that have no selector specified.
-->
EndpointSlices 也可以手動創建，以指示沒有指定選擇器的服務的端點。
