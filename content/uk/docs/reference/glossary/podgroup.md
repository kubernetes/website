---
title: PodGroup
id: podgroup
full_link: /docs/concepts/workloads/podgroup-api/
short_description: >
  PodGroup представляє набір Podʼів з спільною політикою планування та обмеженнями.

aka:
tags:
- core-object
- workload
---

PodGroup — це обʼєкт середовища виконання, який представляє групу Podʼів, запланованих до запуску як єдине ціле. У той час як [Workload API](/docs/concepts/workloads/workload-api/) визначає шаблони політик планування, PodGroups є їхніми аналогами в середовищі виконання, які містять як саму політику, так і стан планування для конкретного екземпляра цієї групи.

<!--more-->
