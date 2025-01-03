---
title: Збирання сміття
id: garbage-collection
date: 2021-07-07
full_link: /uk/docs/concepts/architecture/garbage-collection/
short_description: >
  Загальний термін для різних механізмів, які Kubernetes використовує для очищення ресурсів кластера.

aka: 
- Garbage Collection
tags:
- fundamental
- operation
---

Збирання сміття — це загальний термін для різних механізмів, які Kubernetes використовує для очищення ресурсів кластера.

<!--more-->

Kubernetes використовує збирання сміття для очищення ресурсів, таких як [невикористані контейнери та образи](/uk/docs/concepts/architecture/garbage-collection/#containers-images), [збійні Podʼи](/uk/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection), [обʼєкти, які належать цільовому ресурсу](/uk/docs/concepts/overview/working-with-objects/owners-dependents/), [завершені завдання (Job)](/uk/docs/concepts/workloads/controllers/ttlafterfinished/) та ресурси, строк існування яких сплив або які зазнали збою.
