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

<!--more-->
Endpoints can be configured manually for {{< glossary_tooltip text="Services" term_id="service" >}} without selectors specified.
The {{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}} resource provides a scalable and extensible alternative to Endpoints.
