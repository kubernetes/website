---
title: Виселення через тиск на вузол
id: node-pressure-eviction
short_description: >
  Виселення через тиск на вузол — це процес, при якому kubelet активно завершує роботу Podʼів для звільнення ресурсів на вузлах.

aka:
- kubelet eviction
- Node-pressure eviction
tags:
- operation
---

Виселення через тиск на вузол — це процес, при якому {{<glossary_tooltip term_id="kubelet" text="kubelet">}} активно завершує роботу Podʼів для звільнення {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} на вузлах.

<!--more-->

Kubelet веде моніторинг ресурсів, таких як ЦП, памʼять, місце на диску та inode файлової системи на вузлах вашого кластера. Коли один або кілька з цих ресурсів досягають певних рівнів використання, kubelet може активно завершувати роботу одного або кількох Podʼів на вузлі для звільнення ресурсів та запобігання їх нестачі.

Виселення через тиск на вузол не є тим самим, що й [Виселення, ініційоване API](/docs/concepts/scheduling-eviction/api-eviction/).
