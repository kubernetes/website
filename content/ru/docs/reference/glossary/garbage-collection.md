---
title: Сбор мусора
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/workloads/controllers/garbage-collection/
short_description: >
  Сбор мусора — это собирательный термин для различных механизмов,
  используемых Kubernetes для очистки ресурсов кластера.

aka: 
tags:
- fundamental
- operation
---
 Сбор мусора — это собирательный термин для различных механизмов, используемых Kubernetes для очистки ресурсов кластера.

<!--more-->

Kubernetes использует сборку мусора для очистки таких ресурсов, как [неиспользуемые контейнеры и образы](/docs/concepts/workloads/controllers/garbage-collection/#containers-images),
[неисправные поды](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection),
[объекты, принадлежащие целевому ресурсу](/docs/concepts/overview/working-with-objects/owners-dependents/),
[завершенные задачи](/docs/concepts/workloads/controllers/ttlafterfinished/) и ресурсы,
время работы которых истекло или которые завершились ошибкой.
