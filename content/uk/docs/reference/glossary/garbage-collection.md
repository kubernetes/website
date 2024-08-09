---
title: Збирання сміття
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
  Загальний термін для різних механізмів, які Kubernetes використовує для очищення ресурсів кластера.

aka: 
tags:
- fundamental
- operation
---

Збирання сміття — це загальний термін для різних механізмів, які Kubernetes використовує для очищення ресурсів кластера.

<!--more-->

Kubernetes використовує збирання сміття для очищення ресурсів, таких як [невикористані контейнери та образи](/docs/concepts/architecture/garbage-collection/#containers-images), [збійні Podʼи](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection), [обʼєкти, які належать цільовому ресурсу](/docs/concepts/overview/working-with-objects/owners-dependents/), [завершені завдання](/docs/concepts/workloads/controllers/ttlafterfinished/) та ресурси, строк існування яких сплив або які зазнали збою.
