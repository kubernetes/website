---
title: Endpoints
id: endpoints
date: 2020-04-23
full_link:
short_description: >
  Точка доступу Service — це один з Podʼів (або зовнішніх серверів), який реалізує Service.

aka:
- Точки доступу
tags:
- networking
---

Точка доступу {{< glossary_tooltip text="Service" term_id="service" >}} — це один з {{< glossary_tooltip text="Podʼів" term_id="pod" >}} (або зовнішніх серверів), який реалізує Service.

<!--more-->

Для Services з {{< glossary_tooltip text="селекторами" term_id="selector" >}}, контролер EndpointSlice автоматично створить один або кілька {{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}} з IP-адресами вибраних точок доступу Podʼів.

EndpointSlices також можна створити вручну для позначення точок доступу Service, для яких не вказано селектор.
