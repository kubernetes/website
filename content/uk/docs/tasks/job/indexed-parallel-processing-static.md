---
title: Індексоване завдання (Job) для паралельної обробки з фіксованим призначенням роботи
content_type: task
min-kubernetes-server-version: v1.21
weight: 31
---

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!-- overview -->

У цьому прикладі ви запустите Job Kubernetes, яке використовує кілька паралельних робочих процесів. Кожен робочий процес — це різний контейнер, що працює у власному Podʼі. Podʼи мають _індексний номер_, який автоматично встановлює панель управління, що дозволяє кожному Podʼу визначити, над якою частиною загального завдання працювати.

Індекс Podʼа доступний в {{< glossary_tooltip text="анотації" term_id="annotation" >}} `batch.kubernetes.io/job-completion-index` у вигляді рядка, який представляє його десяткове значення. Щоб контейнеризований процес завдання отримав цей індекс, можна опублікувати значення анотації за допомогою механізму [downward API](/docs/concepts/workloads/pods/downward-api/). Для зручності панель управління автоматично встановлює downward API для експонування індексу в змінну середовища `JOB_COMPLETION_INDEX`.

Нижче наведено огляд кроків у цьому прикладі:

1. **Визначте маніфест завдання з використанням індексованого завершення**. Downward API дозволяє передавати індекс Podʼа як змінну середовища або файл до контейнера.
2. **Запустіть `Indexed` завдання на основі цього маніфесту**.

## {{% heading "prerequisites" %}}

Ви маєти бути знайомі з базовим, не-паралельним використанням [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Оберіть підхід {#choose-an-approach}

Щоб отримати доступ до робочого елемента з програми робочого процесу, у вас є кілька варіантів:

1. Прочитайте змінну середовища `JOB_COMPLETION_INDEX`. Job {{< glossary_tooltip text="контролер" term_id="controller" >}} автоматично повʼязує цю змінну з анотацією, що містить індекс завершення.
2. Прочитайте файл, який містить індекс завершення.
3. Припускаючи, що ви не можете змінити програму, ви можете обгорнути її сценарієм, який читає індекс за допомогою будь-якого з методів вище і перетворює його в щось, що програма може використовувати як вхід.

У цьому прикладі уявіть, що ви вибрали третій варіант, і ви хочете запустити [rev](https://man7.org/linux/man-pages/man1/rev.1.html) утиліту. Ця програма приймає файл як аргумент і виводить зміст у зворотньому порядку.

```shell
rev data.txt
```

Ви будете використовувати інструмент `rev` з контейнерного образу [`busybox`](https://hub.docker.com/_/busybox).

Оскільки це лише приклад, кожен Pod робить лише невеликий шматок роботи (реверсування короткого рядка). У реальному навантаженні ви, наприклад, можете створити Job, що представляє задачу рендерингу 60 секунд відео на основі даних про сцену. Кожен робочий елемент в завданні відеорендерингу буде створювати певний кадр цього відеокліпу. Індексоване завершення означатиме, що кожен Pod у Job знає, який кадр рендерити та опублікувати, рахуючи кадри від початку кліпу.

## Визначте Indexed Job {#define-indexed-job}

Ось приклад маніфесту Job, який використовує режим завершення `Indexed`:

{{% code_sample language="yaml" file="application/job/indexed-job.yaml" %}}

У вищенаведеному прикладі ви використовуєте вбудовану змінну середовища `JOB_COMPLETION_INDEX`, яку встановлює контролер завдань для всіх контейнерів. [Контейнер ініціалізації](/docs/concepts/workloads/pods/init-containers/) відображає індекс на статичне значення та записує його в файл, який спільно використовується з контейнером, що виконує робочий процес через [том emptyDir](/docs/concepts/storage/volumes/#emptydir). Додатково ви можете [визначити свою власну змінну середовища через downward API](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/) для публікації індексу в контейнерах. Ви також можете вибрати завантаження списку значень з [ConfigMap як змінної середовища або файлу](/docs/tasks/configure-pod-container/configure-pod-configmap/).

У іншому варіанті ви можете безпосередньо [використовувати downward API для передачі значення анотації як файлу тому](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields), як показано у наступному прикладі:

{{% code_sample language="yaml" file="application/job/indexed-job-vol.yaml" %}}

## Запуск Job {#run-the-job}

Тепер запустіть Job:

```shell
# Це використовує перший підхід (покладаючись на $JOB_COMPLETION_INDEX)
kubectl apply -f https://kubernetes.io/examples/application/job/indexed-job.yaml
```

При створенні цього Завдання панель управління створює серію Podʼів, по одному для кожного вказаного індексу. Значення `.spec.parallelism` визначає, скільки може працювати одночасно, в той час, як `.spec.completions` визначає, скільки Podʼів створює Job в цілому.

Оскільки `.spec.parallelism` менше, ніж `.spec.completions`, панель управління чекає, поки деякі з перших Podʼів завершаться, перш ніж запустити ще.

Ви можете зачекати, поки Завдання завершиться успішно, з тайм-аутом:

```shell
# Перевірка умови назви нечутлива до регістру
kubectl wait --for=condition=complete --timeout=300s job/indexed-job
```

Тепер опишіть Завдання та переконайтеся, що воно виконалося успішно.

```shell
kubectl describe jobs/indexed-job
```

Вивід схожий на:

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
    Type:       EmptyDir (тимчасова тека, яка поділяє життя Podʼа)
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

У цьому прикладі ви запускаєте Job з власними значеннями для кожного індексу. Ви можете оглянути вивід одного з Podʼів:

```shell
kubectl logs indexed-job-fdhq5 # Змініть це, щоб відповідати імені Podʼа з цього Завдання ```
```

Вивід схожий на:

```none
xuq
```
