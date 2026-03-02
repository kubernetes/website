---
title: "Windows у Kubernetes"
simple_list: true
weight: 200
description: >-
  Kubernetes підтримує роботу вузлів на яких запущено Microsoft Windows.
---

Kubernetes підтримує робочі {{< glossary_tooltip text="вузли" term_id="node" >}} які запущених на Linux або Microsoft Windows.

{{% thirdparty-content single="true" %}}

CNCF та батьківська організація Linux Foundation використовують вендор-нейтральний підхід до сумісності. Це означає, що можна додати ваш [Windows сервер](https://www.microsoft.com/en-us/windows-server) як робочий вузол до кластера Kubernetes.

Ви можете [встановити та налаштувати kubectl на Windows](/docs/tasks/tools/install-kubectl-windows/) незалежно від операційної системи, яку ви використовуєте в своєму кластері.

Якщо ви використовуєте вузли Windows, ви можете прочитати:

* [Мережа на Windows](/docs/concepts/services-networking/windows-networking/)
* [Зберігання на Windows в Kubernetes](/docs/concepts/storage/windows-storage/)
* [Керування ресурсами для вузлів Windows](/docs/concepts/configuration/windows-resource-management/)
* [Налаштування RunAsUserName для Pod та контейнерів Windows](/docs/tasks/configure-pod-container/configure-runasusername/)
* [Створення Pod Windows HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* [Налаштування службових облікових записів з груповим керуванням для Pod та контейнерів Windows](/docs/tasks/configure-pod-container/configure-gmsa/)
* [Безпека для вузлів Windows](/docs/concepts/security/windows-security/)
* [Поради з налагодження Windows](/docs/tasks/debug/debug-cluster/windows/)
* [Посібник з планування контейнерів Windows в Kubernetes](/docs/concepts/windows/user-guide)

або, для ознайомлення, подивіться:
