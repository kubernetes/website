---
title: Indexed Job для паралельної обробки зі статичним призначенням роботи
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!-- overview -->

У цьому прикладі ви запустите Job Kubernetes, який використовує кілька паралельних робочих процесів. Кожен робочий процес — це окремий контейнер, що працює у власному Podʼі. Podʼи мають _індексний номер_, який автоматично встановлює панель управління, і це дозволяє кожному Podʼу визначити, над якою частиною загального завдання працювати.

Індекс Podʼа доступний в {{< glossary_tooltip text="анотації" term_id="annotation" >}} `batch.kubernetes.io/job-completion-index` як рядок із його десятковим значенням. Щоб контейнеризований процес завдання отримав цей індекс, можна опублікувати значення анотації за допомогою механізму [downward API](/docs/concepts/workloads/pods/downward-api/). Для зручності панель управління автоматично налаштовує downward API так, щоб індекс був доступний у змінній середовища `JOB_COMPLETION_INDEX`.

Нижче наведено огляд кроків у цьому прикладі:

1. **Визначте маніфест Job з індексованим завершенням**. Downward API дозволяє передати анотацію індексу Podʼа контейнеру як змінну середовища або файл.
2. **Запустіть `Indexed` Job на основі цього маніфесту**.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ви вже маєте знати базове, непаралельне використання [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Оберіть підхід {#choose-an-approach}

Щоб отримати доступ до робочого елемента з програми робочого процесу, є кілька варіантів:

1. Прочитати змінну середовища `JOB_COMPLETION_INDEX`. {{< glossary_tooltip text="Контролер" term_id="controller" >}} Job автоматично повʼязує цю змінну з анотацією, що містить індекс завершення.
1. Прочитати файл, який містить індекс завершення.
1. Якщо програму не можна змінити, її можна обгорнути скриптом, який читає індекс будь-яким із наведених вище способів і перетворює його на щось, що програма може використати як вхідні дані.

У цьому прикладі уявіть, що ви обрали варіант 3 і хочете запустити утиліту [rev](https://man7.org/linux/man-pages/man1/rev.1.html). Ця програма приймає файл як аргумент і виводить його вміст у зворотному порядку.

```shell
rev data.txt
```

Ви використаєте інструмент `rev` з образу контейнера [`busybox`](https://hub.docker.com/_/busybox).

Оскільки це лише приклад, кожен Pod виконує лише дрібну частину роботи (розвертає короткий рядок). У реальному робочому навантаженні ви могли б, наприклад, створити Job, що представляє завдання створення 60 секунд відео на основі даних сцени. Кожним робочим елементом у Job рендерингу відео був би рендеринг певного кадру цього відеокліпу. Індексоване завершення означало б, що кожен Pod у Job знає, який кадр рендерити й публікувати, рахуючи кадри від початку кліпу.

## Визначте Indexed Job {#define-an-indexed-job}

Ось приклад маніфесту Job, який використовує режим завершення `Indexed`:

{{% code_sample language="yaml" file="application/job/indexed-job.yaml" %}}

У наведеному вище прикладі ви використовуєте вбудовану змінну середовища `JOB_COMPLETION_INDEX`, яку контролер Job встановлює для всіх контейнерів. [Init-контейнер](/docs/concepts/workloads/pods/init-containers/) зіставляє індекс зі статичним значенням і записує його у файл, спільний із контейнером робочого процесу через [том emptyDir](/docs/concepts/storage/volumes/#emptydir). За бажання можна [визначити власну змінну середовища через downward API](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/), щоб публікувати індекс у контейнери. Також можна завантажити список значень із [ConfigMap як змінну середовища або файл](/docs/tasks/configure-pod-container/configure-pod-configmap/).

Або ви можете безпосередньо [використати downward API для передачі значення анотації як файлу тому](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields), як показано в наведеному нижче прикладі:

{{% code_sample language="yaml" file="application/job/indexed-job-vol.yaml" %}}

## Запуск Job {#running-the-job}

Тепер запустіть Job:

```shell
# Це використовує перший підхід (покладаючись на $JOB_COMPLETION_INDEX)
kubectl apply -f https://kubernetes.io/examples/application/job/indexed-job.yaml
```

Коли ви створюєте цей Job, панель управління створює серію Podʼів, по одному для кожного вказаного індексу. Значення `.spec.parallelism` визначає, скільки їх може працювати одночасно, а `.spec.completions` визначає, скільки Podʼів Job створює загалом.

Оскільки `.spec.parallelism` менше за `.spec.completions`, панель управління чекає завершення деяких перших Podʼів, перш ніж запускати нові.

Ви можете зачекати на успішне завершення Job із тайм-аутом:

```shell
# Перевірка назви умови не залежить від регістру
kubectl wait --for=condition=complete --timeout=300s job/indexed-job
```

Тепер перегляньте опис Job і переконайтеся, що він успішний.

```shell
kubectl describe jobs/indexed-job
```

Вивід подібний до такого:

```
Name:              indexed-job
Namespace:         default
Selector:          controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
Labels:            controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
                   job-name=indexed-job
Annotations:       <none>
Parallelism:       3
Completions:       5
Start Time:        Thu, 11 Mar 2021 15:47:34 +0000
Pods Statuses:     2 Running / 3 Succeeded / 0 Failed
Completed Indexes: 0-2
Pod Template:
  Labels:  controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
           job-name=indexed-job
  Init Containers:
   input:
    Image:      docker.io/library/bash
    Port:       <none>
    Host Port:  <none>
    Command:
      bash
      -c
      items=(foo bar baz qux xyz)
      echo ${items[$JOB_COMPLETION_INDEX]} > /input/data.txt

    Environment:  <none>
    Mounts:
      /input from input (rw)
  Containers:
   worker:
    Image:      docker.io/library/busybox
    Port:       <none>
    Host Port:  <none>
    Command:
      rev
      /input/data.txt
    Environment:  <none>
    Mounts:
      /input from input (rw)
  Volumes:
   input:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:
    SizeLimit:  <unset>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-njkjj
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-9kd4h
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-qjwsz
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-fdhq5
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-ncslj
```

У цьому прикладі ви запускаєте Job із власними значеннями для кожного індексу. Ви можете переглянути вивід одного з Podʼів:

```shell
kubectl logs indexed-job-fdhq5 # Змініть це на назву Podʼа з цього Job
```

Вивід подібний до такого:

```
xuq
```
