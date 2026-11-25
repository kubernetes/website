---
title: Виконання автоматизованих завдань за допомогою CronJob
min-kubernetes-server-version: v1.21
content_type: task
weight: 10
---

<!-- overview -->

На цій сторінці показано, як виконувати автоматизовані завдання за допомогою обʼєкта Kubernetes {{< glossary_tooltip text="CronJob" term_id="cronjob" >}}.

## {{% heading "prerequisites" %}} {#before-you-begin}

* {{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Створення CronJob {#creating-a-cron-job}

CronJobs потребують файлу конфігурації. Ось маніфест CronJob, який щохвилини запускає просте демонстраційне завдання:

{{% code_sample file="application/job/cronjob.yaml" %}}

Запустіть приклад CronJob за допомогою цієї команди:

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```

Вивід подібний до такого:

```
cronjob.batch/hello created
```

Після створення CronJob отримайте його статус за допомогою цієї команди:

```shell
kubectl get cronjob hello
```

Вивід подібний до такого:

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          10s
```

Як видно з результатів команди, CronJob ще не запланував і не запустив жодного Job. {{< glossary_tooltip text="Відстежуйте" term_id="watch" >}} створення Job упродовж приблизно однієї хвилини:

```shell
kubectl get jobs --watch
```

Вивід подібний до такого:

```
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

Тепер ви побачили один запущений Job, запланований CronJob "hello". Ви можете припинити відстеження Job і знову переглянути CronJob, щоб побачити, що він запланував Job:

```shell
kubectl get cronjob hello
```

Вивід подібний до такого:

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

Ви маєте побачити, що CronJob `hello` успішно запланував Job у час, вказаний у `LAST SCHEDULE`. Наразі активних Jobs 0, тобто Job завершився успішно або з помилкою.

Тепер знайдіть Podʼи, які створив останній запланований Job, і перегляньте стандартний вивід одного з Podʼів.

{{< note >}}
Назва Job відрізняється від назви Podʼа.
{{< /note >}}

```shell
# Замініть "hello-4111706356" на назву Job у вашій системі
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items[*].metadata.name})
```

Покажіть лог Podʼа:

```shell
kubectl logs $pods
```

Вивід подібний до такого:

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

## Видалення CronJob {#deleting-a-cron-job}

Коли CronJob більше не потрібен, видаліть його за допомогою `kubectl delete cronjob <cronjob name>`:

```shell
kubectl delete cronjob hello
```

Видалення CronJob вилучає всі створені ним Jobs і Podʼи та зупиняє створення нових Jobs. Докладніше про вилучення Jobs читайте в розділі [збір сміття](/docs/concepts/architecture/garbage-collection/).
