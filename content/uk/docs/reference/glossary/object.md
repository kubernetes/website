---
title: Обʼєкт
id: object
date: 2020-10-12
full_link: /docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
   Сутність у системі Kubernetes, що представляє частину стану вашого кластера.

aka:
tags:
- fundamental
---

Сутність у системі Kubernetes. Обʼєкт є {{< glossary_tooltip text="ресурсом API" term_id="api-resource" >}}, який API Kubernetes використовує для представлення стану вашого кластера.

<!--more-->

Обʼєкт Kubernetes зазвичай є "записом наміру" — коли ви створюєте обʼєкт, {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} Kubernetes постійно працює над тим, щоб забезпечити існування представленого ним елемента. Створюючи обʼєкт, ви повідомляєте системі Kubernetes, як ви хочете, щоб ця частина робочого навантаження вашого кластера виглядала; це бажаний стан вашого кластера.
