---
title: "Windows у Kubernetes"
simple_list: true
weight: 200
description: >-
  Kubernetes підтримує вузли, на яких працює Microsoft Windows.
---

Kubernetes підтримує робочі {{< glossary_tooltip text="вузли" term_id="node" >}}, що працюють на Linux або Microsoft Windows.

{{% thirdparty-content single="true" %}}

CNCF та її материнська організація Linux Foundation дотримуються нейтрального щодо постачальників підходу до сумісності. Ви можете приєднати свій [сервер Windows](https://www.microsoft.com/en-us/windows-server) до кластера Kubernetes як робочий вузол.

Ви можете [встановити та налаштувати kubectl у Windows](/docs/tasks/tools/install-kubectl-windows/) незалежно від операційної системи, яку ви використовуєте у своєму кластері.

Якщо ви використовуєте вузли Windows, ви можете прочитати:

* [Мережа у Windows](/docs/concepts/services-networking/windows-networking/)
* [Сховище Windows у Kubernetes](/docs/concepts/storage/windows-storage/)
* [Керування ресурсами для вузлів Windows](/docs/concepts/configuration/windows-resource-management/)
* [Налаштування RunAsUserName для Podʼів та контейнерів Windows](/docs/tasks/configure-pod-container/configure-runasusername/)
* [Створення Podʼа Windows HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* [Налаштування службових облікових записів з груповим керуванням для Podʼів та контейнерів Windows](/docs/tasks/configure-pod-container/configure-gmsa/)
* [Безпека для вузлів Windows](/docs/concepts/security/windows-security/)
* [Поради з налагодження Windows](/docs/tasks/debug/debug-cluster/windows/)
* [Посібник із планування контейнерів Windows у Kubernetes](/docs/concepts/windows/user-guide)

або, для загального огляду, прочитайте:
