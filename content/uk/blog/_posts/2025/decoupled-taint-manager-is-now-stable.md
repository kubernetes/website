---
layout: blog
title: "Kubernetes v1.34: Виділений Taint Manager тепер Stable"
date: 2025-09-15T10:30:00-08:00
slug: kubernetes-v1-34-decoupled-taint-manager-is-now-stable
author: >
  Baofa Fan (DaoCloud)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Ця функція відокремлює відповідальність за управління життєвим циклом вузлів і виселенням podʼів на два окремі компоненти. Раніше контролер життєвого циклу вузлів обробляв як позначення вузлів як несправних з позначкам (taints) NoExecute, так і виселення podʼів з них. Тепер спеціалізований контролер виселення на основі позначок taint керує процесом, тоді як контролер життєвого циклу вузлів зосереджується виключно на проставлянні taintʼів. Це відокремлення не тільки покращує організацію коду, але й спрощує вдосконалення контролера виселення або створення власних реалізацій виселення на основі позначок.

## Що нового?

Функціональна можливість `SeparateTaintEvictionController` була підвищена до GA в цьому випуску. Користувачі можуть за бажанням вимкнути виселення на основі taintʼів, встановивши `--controllers=-taint-eviction-controller` в kube-controller-manager.

## Як дізнатися більше?

Для отримання додаткової інформації зверніться до [KEP](http://kep.k8s.io/3902) та до статті про бета-версію: [Kubernetes 1.29: Decoupling taint manager from node lifecycle controller](/blog/2023/12/19/kubernetes-1-29-taint-eviction-controller/).

## Як взяти участь?

Ми висловлюємо величезну подяку всім учасникам, які допомогли з проєктуванням, реалізацією та рецензуванням цієї функції та допомогли перевести її з бета-версії в стабільну:

- Ed Bartosh (@bart0sh)
- Yuan Chen (@yuanchen8911)
- Aldo Culquicondor (@alculquicondor)
- Baofa Fan (@carlory)
- Sergey Kanzhelev (@SergeyKanzhelev)
- Tim Bannister (@lmktfy)
- Maciej Skoczeń (@macsko)
- Maciej Szulik (@soltysh)
- Wojciech Tyczynski (@wojtek-t)
