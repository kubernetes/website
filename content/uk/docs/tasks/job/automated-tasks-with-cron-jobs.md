---
title: Виконання автоматизованих завдань за допомогою CronJob
min-kubernetes-server-version: v1.21
content_type: task
weight: 10
---

<!-- overview -->

Ця сторінка показує, як виконувати автоматизовані завдання за допомогою обʼєкта Kubernetes {{< glossary_tooltip text="CronJob" term_id="cronjob" >}}.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Створення CronJob {#creating-a-cron-job}

Для роботи з CronJob потрібен файл конфігурації. Нижче подано маніфест для CronJob, який запускає просте демонстраційне завдання кожну хвилину:

{{% code_sample file="application/job/cronjob.yaml" %}}

Запустіть приклад CronJob за допомогою цієї команди:

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```

Вивід буде подібний до цього:

```none
cronjob.batch/hello created
```

Після створення CronJob отримайте його статус за допомогою цієї команди:

```shell
kubectl get cronjob hello
```

Вивід буде подібний до цього:

```none
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          10s
```

Як видно з результатів команди, CronJob ще не планував або не запускав жодних завдань. Спостерігайте ({{< glossary_tooltip text="watch" term_id="watch" >}}) за створенням завдання протягом хвилини:

```shell
kubectl get jobs --watch
```

Вивід буде подібний до цього:

```none
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

Тепер ви бачите одне запущене завдання, заплановане cron job "hello". Ви можете припинити спостереження за завданням і переглянути cron job ще раз, щоб побачити, що він запланував завдання:

```shell
kubectl get cronjob hello
```

Вивід буде подібний до цього:

```none
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

Ви повинні побачити, що cron job `hello` успішно запланував завдання в час, вказаний у `LAST SCHEDULE`. Наразі немає активних завдань, що означає, що завдання завершилось або зазнало невдачі.

Тепер знайдіть Podʼи, які створило останнє заплановане завдання, та перегляньте стандартний вивід одного з них.

{{< note >}}
Назва завдання відрізняється від назви Pod.
{{< /note >}}

```shell
# Замініть "hello-4111706356" на назву завдання у вашій системі
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items[*].metadata.name})
```

Покажіть лог Pod:

```shell
kubectl logs $pods
```

Вивід буде подібний до цього:

```none
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

## Видалення CronJob {#deleting-a-cron-job}

Коли вам більше не потрібно cron job, видаліть його за допомогою `kubectl delete cronjob <cronjob name>`:

```shell
kubectl delete cronjob hello
```

Видалення cron job призводить до видалення всіх створених ним завдань і Podʼів і припинення створення додаткових завдань. Докладніше про видалення завдань читайте в [збиранні сміття](/docs/concepts/architecture/garbage-collection/).
