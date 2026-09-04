---
layout: blog
title: "Kubernetes v1.35: Узгодження маршрутів на основі спостереження в Cloud Controller Manager"
date: 2025-12-30T10:30:00-08:00
slug: kubernetes-v1-35-watch-based-route-reconciliation-in-ccm
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
translator: >
  [Андрій Головін](https://github.com/andygol)
---

До Kubernetes v1.34 включно контролер маршрутів у реалізаціях Cloud Controller Manager (CCM), створених за допомогою бібліотеки [k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider), узгоджує маршрути через фіксований інтервал. Це призводить до непотрібних запитів до API хмарного провайдера, коли не відбуваються зміни маршрутів. Інші контролери, реалізовані через ту ж бібліотеку, вже використовують механізми на основі спостереження, використовуючи інформери для уникнення непотрібних викликів API. У версії v1.35 запроваджується нова функціональна можливість, яка дозволяє змінити поведінку контролера маршрутів на використання інформерів на основі спостереження.

## Що нового? {#what-s-new}

Функціональна можливість `CloudControllerManagerWatchBasedRoutesReconciliation` була запроваджена у [k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider) на стадії альфа-версії [SIG Cloud Provider](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md). Щоб увімкнути цю функцію, можна використовувати `--feature-gate=CloudControllerManagerWatchBasedRoutesReconciliation=true` у реалізації CCM, яку ви використовуєте.

## Про функціональну можливість {#about-the-feature-gate}

Ця функціональна можливість запустить цикл узгодження маршрутів кожного разу, коли вузол додається, видаляється або оновлюються поля `.spec.podCIDRs` або `.status.addresses`.

Додаткове узгодження виконується через випадковий інтервал від 12 до 24 годин,
який вибирається під час запуску контролера.

Ця функціональна можливість не змінює логіку в циклі узгодження. Тому користувачі реалізації CCM не повинні відчувати значних змін у своїх поточних конфігураціях маршрутів.

## Як я можу дізнатися більше? {#how-can-i-learn-more}

Для отримання додаткової інформації зверніться до [KEP-5237](https://kep.k8s.io/5237).
