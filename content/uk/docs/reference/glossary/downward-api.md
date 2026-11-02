---
title: Downward API
id: downward-api
short_description: >
  Механізм використання Kubernetes для надання значень полів Podʼа та контейнера коду, що працює в контейнері.

aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---

Механізм Kubernetes для надання значень полів Podʼа та контейнера коду, що працює в контейнері

<!--more-->

Іноді контейнеру корисно мати інформацію про себе, без необхідності вносити зміни до коду контейнера, який безпосередньо зʼєднує його з Kubernetes.

Механізм downward API Kubernetes дозволяє контейнерам використовувати інформацію про себе або їхній контекст в кластері Kubernetes. Застосунки в контейнерах можуть мати доступ до цієї інформації, без потреби для них діяти як клієнт Kubernetes API.

Є два способи надання доступу до полів Podʼа та контейнера для робочого контейнера:

* використання [змінних оточення](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* використання [томів `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Разом ці два способи надання доступу до полів Podʼів та контейнера називаються _downward API_.
