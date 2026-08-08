---
title: Випередження
id: preemption
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  Логіка пріоритетів в Kubernetes допомагає Podʼу, що очікує, знайти відповідний Вузол, виселяючи Podʼи з низьким пріоритетом, що вже існують на цьому Вузлі.

aka:
- Preemption
tags:
- operation
---

Логіка пріоритетів в Kubernetes допомагає {{< glossary_tooltip term_id="pod" text="Podʼу">}}, що очікує, знайти відповідний {{< glossary_tooltip term_id="node" text="Вузол" >}} виселяючи Podʼи з низьким пріоритетом, що вже існують на цьому Вузлі.

<!--more-->

Якщо Pod не можна призначити, планувальник намагається [випередити](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) Podʼи з меншим пріоритетом, щоб забезпечити можливість призначення Podʼа, що перебуває в очікуванні вузла.
