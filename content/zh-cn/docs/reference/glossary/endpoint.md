---
title: 端点（Endpoints）
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  端点负责记录与服务（Service）的选择器相匹配的 Pod 的 IP 地址。

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
  Endpoints track the IP addresses of Pods with matching Service selectors.

aka:
tags:
- networking
-->

<!--
 Endpoints track the IP addresses of Pods with matching  {{< glossary_tooltip text="selectors" term_id="selector" >}}.
-->
端点负责记录与服务的{{< glossary_tooltip text="选择器" term_id="selector" >}}相匹配的 Pod 的 IP 地址。

<!--more-->

<!--
Endpoints can be configured manually for {{< glossary_tooltip text="Services" term_id="service" >}} without selectors specified.
-->
端点可以手动配置到{{< glossary_tooltip text="服务（Service）" term_id="service" >}}上，而不必指定选择器标识。

<!--
The {{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}} resource provides a scalable and extensible alternative to Endpoints.
-->
{{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}} 提供了一种可伸缩、可扩展的替代方案。
