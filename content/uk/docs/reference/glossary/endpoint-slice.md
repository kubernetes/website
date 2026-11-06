---
title: EndpointSlice
id: endpoint-slice
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  EndpointSlices відстежують IP-адреси Podʼів для Services.

aka:
tags:
- networking
---

EndpointSlices відстежують IP-адреси точок доступу бекенду. EndpointSlices зазвичай повʼязані з {{< glossary_tooltip text="Service" term_id="service" >}}, а точки доступу бекенду зазвичай представляють {{< glossary_tooltip text="Podʼи" term_id="pod" >}}.

<!--more-->
Один Service може обслуговуватися кількома Podʼами. Kubernetes представляє точки доступу, що обслуговують Service, набором EndpointSlices, повʼязаних із цим Service. Точки доступу, що обслуговують Service, зазвичай, але не завжди, є Podʼами, які працюють у кластері.

Панель управління зазвичай автоматично керує EndpointSlices за вас. Однак EndpointSlices можна визначити вручну для {{< glossary_tooltip text="Services" term_id="service" >}} без вказаних {{< glossary_tooltip text="селекторів" term_id="selector" >}}.
