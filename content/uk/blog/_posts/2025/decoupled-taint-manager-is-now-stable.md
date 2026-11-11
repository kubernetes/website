---
layout: blog
title: "Kubernetes v1.34: Відокремлений Taint Manager тепер стабільний"
date: 2025-09-15T10:30:00-08:00
slug: kubernetes-v1-34-decoupled-taint-manager-is-now-stable
author: >
  Baofa Fan (DaoCloud)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Це вдосконалення розподіляє відповідальність за керування життєвим циклом вузлів і виселення Podʼів між двома окремими компонентами. Раніше контролер життєвого циклу вузлів і позначав вузли як несправні за допомогою taint NoExecute, і виселяв з них Podʼи. Тепер процесом виселення керує окремий контролер виселення за taint, а контролер життєвого циклу вузлів зосереджується лише на застосуванні taint. Таке розділення не лише покращує організацію коду, а й спрощує вдосконалення контролера виселення за taint або створення власних реалізацій виселення на основі taint.

## Що нового? {#what-s-new}

Функціональна можливість `SeparateTaintEvictionController` була підвищена до GA в цьому випуску. Користувачі можуть за бажанням вимкнути виселення на основі taint, встановивши `--controllers=-taint-eviction-controller` в kube-controller-manager.

## Як дізнатися більше? {#how-can-i-learn-more}

Для отримання додаткової інформації зверніться до [KEP](http://kep.k8s.io/3902) та до статті про бета-версію: [Kubernetes 1.29: Decoupling taint manager from node lifecycle controller](/blog/2023/12/19/kubernetes-1-29-taint-eviction-controller/).

## Як взяти участь? {#how-to-get-involved}

Ми висловлюємо величезну подяку всім учасникам, які допомогли з проєктуванням, реалізацією та рецензуванням цієї можливості та допомогли перевести її з бета-версії в стабільну:

- Ed Bartosh (@bart0sh)
- Yuan Chen (@yuanchen8911)
- Aldo Culquicondor (@alculquicondor)
- Baofa Fan (@carlory)
- Sergey Kanzhelev (@SergeyKanzhelev)
- Tim Bannister (@lmktfy)
- Maciej Skoczeń (@macsko)
- Maciej Szulik (@soltysh)
- Wojciech Tyczynski (@wojtek-t)
