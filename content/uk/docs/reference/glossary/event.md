---
title: Подія
id: event
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   Обʼєкти Kubernetes, які описують певну зміну стану в кластері.

aka:
- Event
tags:
- core-object
- fundamental
---

{{< glossary_tooltip text="Обʼєкт" term_id="object" >}} Kubernetes, який описує зміни стану або помітні події в кластері.

<!--more-->
Події мають обмежений час зберігання, а тригери та повідомлення можуть змінюватися з часом. Споживачі подій не повинні розраховувати на те, що час появи події з певною причиною (reason) завжди відображає той самий тригер, або на те, що події з цією причиною існуватимуть і надалі.

Події слід розглядати як інформативні додаткові дані, що надаються за принципом best-effort.

У Kubernetes [аудит](/docs/tasks/debug/debug-cluster/audit/) створює інший вид записів Event (група API `audit.k8s.io`).
