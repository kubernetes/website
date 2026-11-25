---
title: Витіснення
id: preemption
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  Логіка витіснення в Kubernetes допомагає Podʼу, що очікує, знайти відповідний вузол, виселяючи Podʼи з низьким пріоритетом, що вже існують на цьому вузлі.

aka:
- Preemption
tags:
- operation
---

Логіка витіснення в Kubernetes допомагає {{< glossary_tooltip term_id="pod" text="Podʼу" >}}, що очікує, знайти відповідний {{< glossary_tooltip term_id="node" text="вузол" >}}, виселяючи Podʼи з низьким пріоритетом, що вже існують на цьому вузлі.

<!--more-->

Якщо Pod не можна призначити, планувальник намагається [витіснити](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) Podʼи з нижчим пріоритетом, щоб уможливити призначення Podʼа, що очікує.
