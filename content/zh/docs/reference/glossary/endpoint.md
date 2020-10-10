---
title: Endpoints
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  Endpoints 使用匹配的选择器跟踪Pod的IP地址。

aka:
tags:
- networking
---

<!-- 
---
title: Endpoints
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  Endpoints track the IP addresses of Pods with matching Service selectors.

aka:
tags:
- networking
---
 Endpoints track the IP addresses of Pods with matching  {{< glossary_tooltip text="selectors" term_id="selector" >}}.
-->

<!--more-->

<!--
Endpoints can be configured manually for {{< glossary_tooltip text="Services" term_id="service" >}} without selectors specified.
The {{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}} resource provides a scalable and extensible alternative to Endpoints.
-->
Endpoints 可以为{{< glossary_tooltip text="服务" term_id="service" >}}手动配置端点，而无需指定选择器。 {{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}} 资源提供了端点的可扩展和可扩展的替代方案。
