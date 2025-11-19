---
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /zh-cn/docs/concepts/services-networking/endpoint-slices/
short_description: >
  EndpointSlices 跟蹤具有匹配 Service 選擇算符的 Pod 的 IP 地址。

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
  EndpointSlices track the IP addresses of Pods with matching Service selectors.

aka:
tags:
- networking
-->

<!--
 EndpointSlices track the IP addresses of Pods with matching  {{< glossary_tooltip text="selectors" term_id="selector" >}}.
-->
EndpointSlices 跟蹤具有匹配{{< glossary_tooltip text="選擇算符" term_id="selector" >}}的
Pod 的 IP 地址。

<!--more-->

<!--
EndpointSlices can be configured manually for {{< glossary_tooltip text="Services" term_id="service" >}} without selectors specified.
-->
EndpointSlices 可以手動配置給沒有指定選擇算符的
{{< glossary_tooltip text="Service" term_id="service" >}}。
