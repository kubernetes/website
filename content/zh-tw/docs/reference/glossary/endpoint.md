---
title: 端點（Endpoints）
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  端點負責記錄與服務（Service）的選擇器相匹配的 Pods 的 IP 地址。

aka:
tags:
- networking
---
 端點負責記錄與服務的{{< glossary_tooltip text="選擇器" term_id="selector" >}}相匹配的 Pods 的 IP 地址。

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
   
 Endpoints track the IP addresses of Pods with matching  {{< glossary_tooltip text="selectors" term_id="selector" >}}.
-->

<!--more-->
<!--
Endpoints can be configured manually for {{< glossary_tooltip text="Services" term_id="service" >}} without selectors specified.
-->
端點可以手動配置到{{< glossary_tooltip text="服務（Service）" term_id="service" >}}上，而不必指定選擇器標識。
<!--
The {{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}} resource provides a scalable and extensible alternative to Endpoints.
-->
{{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}}提供了一種可伸縮、可擴充套件的替代方案。
