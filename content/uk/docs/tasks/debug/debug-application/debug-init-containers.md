---
title: Налагодження контейнерів ініціалізації
content_type: task
weight: 40
---

<!-- overview -->

Ця сторінка показує, як розвʼязувати проблеми, повʼязані з запуском контейнерів ініціалізації. Приклади команд нижче вказують на Pod як `<pod-name>` та на контейнери ініціалізації як `<init-container-1>` та `<init-container-2>`.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Ви повинні бути знайомі з основами [контейнерів ініціалізації](/docs/concepts/workloads/pods/init-containers/).
* Ви повинні [Налаштувати контейнер ініціалізації](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).

<!-- steps -->

## Перевірка стану контейнерів ініціалізації {#checking-the-status-of-init-containers}

Показ статусу вашого Podʼа:

```shell
kubectl get pod <pod-name>
```

Наприклад, статус `Init:1/2` вказує на те, що один з двох контейнерів ініціалізації успішно завершено:

```none
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

Дивіться [Розуміння статусів Podʼа](#understanding-pod-status) для отримання прикладів значень статусу та їх значень.

## Отримання деталей про контейнери ініціалізації {#getting-details-about-init-containers}

Показ більш детальної інформації про виконання контейнерів ініціалізації:

```shell
kubectl describe pod <pod-name>
```

Наприклад, Pod з двома контейнерами ініціалізації може показати наступне:

```none
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

Ви також можете отримувати доступ до статусів контейнерів ініціалізації програмно, читаючи поле `status.initContainerStatuses` у Pod Spec:

```shell
kubectl get pod <pod-name> --template '{{.status.initContainerStatuses}}'
```

Ця команда поверне ту саму інформацію, що й вище, відформатовану за допомогою [Go template](https://pkg.go.dev/text/template).

## Отримання логів з контейнерів ініціалізації {#accessing-logs-from-init-containers}

Вкажіть імʼя контейнера ініціалізації разом з імʼям Podʼа, щоб отримати його логи.

```shell
kubectl logs <pod-name> -c <init-container-2>
```

Контейнери ініціалізації, що виконують скрипт оболонки, друкують команди в міру їх виконання. Наприклад, це можна зробити в Bash, запустивши `set -x` на початку скрипта.

<!-- discussion -->

## Розуміння статусів Podʼа {#understanding-pod-status}

Статус Podʼа, що починається з `Init:`, узагальнює стан виконання контейнерів ініціалізації. У таблиці нижче наведено деякі приклади значень статусу, які ви можете бачити під час налагодження контейнерів ініціалізації.

Статус | Значення
------ | -------
`Init:N/M` | Pod має `M` контейнерів ініціалізації, і `N` вже завершено.
`Init:Error` | Контейнер ініціалізації не вдалося виконати.
`Init:CrashLoopBackOff` | Контейнер ініціалізації неперервно виходить з ладу.
`Pending` | Pod ще не розпочав виконувати контейнер ініціалізації.
`PodInitializing` або `Running` | Pod вже завершив виконання контейнерів ініціалізації.
