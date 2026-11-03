---
title: Налагодження init-контейнерів
content_type: task
weight: 40
---

<!-- overview -->

На цій сторінці показано, як досліджувати проблеми, повʼязані з виконанням init-контейнерів. У наведених нижче прикладах командного рядка Pod позначено як `<pod-name>`, а init-контейнери — як `<init-container-1>` і `<init-container-2>`.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Ви повинні бути знайомі з основами [init-контейнерів](/docs/concepts/workloads/pods/init-containers/).
* У вас має бути [налаштований init-контейнер](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).

<!-- steps -->

## Перевірка стану init-контейнерів {#checking-the-status-of-init-containers}

Виведіть статус вашого Podʼа:

```shell
kubectl get pod <pod-name>
```

Наприклад, статус `Init:1/2` вказує на те, що один з двох init-контейнерів успішно завершено:

```
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

Більше прикладів значень статусу та їхнього змісту дивіться в розділі [Розуміння статусу Podʼа](#understanding-pod-status).

## Отримання деталей про init-контейнери {#getting-details-about-init-containers}

Перегляньте докладнішу інформацію про виконання init-контейнерів:

```shell
kubectl describe pod <pod-name>
```

Наприклад, Pod із двома init-контейнерами може показати таке:

```
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

Ви також можете отримувати доступ до статусів init-контейнерів програмно, читаючи поле `status.initContainerStatuses` у Pod Spec:

```shell
kubectl get pod <pod-name> --template '{{.status.initContainerStatuses}}'
```

Ця команда поверне ту саму інформацію, що й вище, відформатовану за допомогою [шаблону Go](https://pkg.go.dev/text/template).

## Отримання логів з init-контейнерів {#accessing-logs-from-init-containers}

Щоб отримати логи init-контейнера, вкажіть його назву разом із назвою Podʼа.

```shell
kubectl logs <pod-name> -c <init-container-2>
```

Init-контейнери, що виконують скрипт оболонки, виводять команди під час їх виконання. Наприклад, у Bash це можна зробити, виконавши `set -x` на початку скрипта.

<!-- discussion -->

## Розуміння статусу Podʼа {#understanding-pod-status}

Статус Podʼа, що починається з `Init:`, узагальнює стан виконання init-контейнерів. У таблиці нижче наведено деякі приклади значень статусу, які ви можете бачити під час налагодження init-контейнерів.

Статус | Значення
------ | -------
`Init:N/M` | Pod має `M` init-контейнерів, і `N` вже завершено.
`Init:Error` | Не вдалося виконати init-контейнер.
`Init:CrashLoopBackOff` | Init-контейнер неодноразово завершувався збоєм.
`Pending` | Pod ще не розпочав виконувати init-контейнери.
`PodInitializing` або `Running` | Pod вже завершив виконання init-контейнерів.
