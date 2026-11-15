---
title: Downward API
id: downward-api
short_description: >
  Механізм, що надає коду, який працює в контейнері, значення полів Podʼа та контейнера.

aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---

Механізм Kubernetes, що надає коду, який працює в контейнері, значення полів Podʼа та контейнера.

<!--more-->

Іноді контейнеру корисно мати інформацію про себе без змін у коді контейнера, які безпосередньо привʼязують його до Kubernetes.

Downward API в Kubernetes дозволяє контейнерам отримувати інформацію про себе або свій контекст у кластері Kubernetes. Застосунки в контейнерах можуть мати доступ до цієї інформації без потреби діяти як клієнт API Kubernetes.

Є два способи надати запущеному контейнеру доступ до полів Podʼа та контейнера:

- за допомогою [змінних середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
- за допомогою [тому `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Разом ці два способи надання доступу до полів Podʼа та контейнера називаються _downward API_.
