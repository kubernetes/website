---
title: Condition
id: condition
full_link: /docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
short_description: >
  Condition представляє поточний стан ресурсу Kubernetes, надаючи інформацію про те, чи є певні аспекти ресурсу вірними.

aka:
- Стан
tags:
- fundamental
---

Condition — це поле в статусі ресурсу Kubernetes, яке описує поточний стан цього ресурсу.

<!--more-->

Стани забезпечують стандартизований спосіб передачі інформації про стан ресурсів компонентами Kubernetes. Кожен стан має `type`, `status` (True, False або Unknown) та необовʼязкові поля, такі як `reason` та `message`, що містять додаткову інформацію. Наприклад, Pod може мати такі стани, як `Ready`, `ContainersReady` або `PodScheduled`.
