---
layout: blog
title: "Kubernetes v1.34: Політика заміни Podʼів для Job переходить у GA"
date: 2025-09-05T10:30:00-08:00
slug: kubernetes-v1-34-pod-replacement-policy-for-jobs-goes-ga
author: >
  [Dejan Zele Pejchev](https://github.com/dejanzele) (G-Research)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

У Kubernetes v1.34 можливість _політики заміни Podʼів_ досягла загальної доступності (GA). Ця стаття описує політику заміни Podʼів і те, як її використовувати у ваших Job.

## Про політику заміни Podʼів {#about-pod-replacement-policy}

Типово контролер Job негайно відтворює Podʼи, як тільки вони виходять з ладу або починають завершувати роботу (коли вони мають мітку часу видалення).

У результаті, поки деякі Podʼи завершуються, загальна кількість працюючих Podʼів для Job може тимчасово перевищувати заданий рівень паралельності. Для індексованих Job це може навіть означати, що кілька Podʼів працюють для одного й того ж індексу одночасно.

Ця поведінка добре працює для багатьох робочих навантажень, але в певних випадках може викликати проблеми.

Наприклад, популярні фреймворки машинного навчання, такі як TensorFlow та [JAX](https://jax.readthedocs.io/en/latest/), очікують, що для кожного індексу виконавця буде точно один Pod. Якщо два Podʼи працюють одночасно, ви можете зіткнутися з такими помилками:

```
/job:worker/task:4: Duplicate task registration with task_name=/job:worker/replica:0/task:4
```

Крім того, запуск замінних Podʼів до повного завершення старих може призвести до:

- Затримок у плануванні з боку kube-scheduler, оскільки вузли залишаються зайнятими.
- Непотрібного масштабування кластера для розміщення замінних Podʼів.
- Тимчасового обходу перевірок квот з боку оркестраторів робочих навантажень, таких як [Kueue](https://kueue.sigs.k8s.io/).

З політикою заміни Podʼів Kubernetes надає вам контроль над тим, коли панель управління замінює Podʼи, що завершуються, допомагаючи уникнути цих проблем.

## Як працює політика заміни Podʼів {#how-pod-replacement-policy-works}

Це вдосконалення означає, що Job у Kubernetes мають необовʼязкове поле `.spec.podReplacementPolicy`. Ви можете вибрати одну з двох політик:

- `TerminatingOrFailed` (типово): Замінює Podʼи, щойно вони починають завершуватися.
- `Failed`: Замінює Podʼи лише після того, як вони повністю завершаться і перейдуть у фазу `Failed`.

Встановлення політики на `Failed` забезпечує створення нового Podʼа лише після повного завершення попереднього.

Для Job з політикою відмови Podʼів (Pod Failure Policy) типове значення для `podReplacementPolicy` — `Failed`, і жодне інше значення не дозволяється. Дивіться [Політика відмови Podʼів](/docs/concepts/workloads/controllers/job/#pod-failure-policy), щоб дізнатися більше про політики відмови Podʼів для Job.

Ви можете перевірити, скільки Podʼів наразі завершуються, перевіривши поле `.status.terminating` Job:

```shell
kubectl get job myjob -o=jsonpath='{.status.terminating}'
```

## Приклад {#example}

Ось приклад Job, який виконує завдання двічі (`spec.completions: 2`) паралельно (`spec.parallelism: 2`) і замінює Podʼи лише після їх повного завершення (`spec.podReplacementPolicy: Failed`):

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  completions: 2
  parallelism: 2
  podReplacementPolicy: Failed
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: worker
        image: your-image
```

Якщо Pod отримує сигнал SIGTERM (видалення, виселення, витіснення…), він починає завершувати роботу. Коли контейнер обробляє завершення роботи належним чином, очищення може зайняти деякий час.

Коли Job починається, ми побачимо два Podʼи, які працюють:

```shell
kubectl get pods

NAME                READY   STATUS    RESTARTS   AGE
example-job-qr8kf   1/1     Running   0          2s
example-job-stvb4   1/1     Running   0          2s
```

Видалимо один з Podʼів (`example-job-qr8kf`).

З політикою `TerminatingOrFailed`, як тільки один Pod (`example-job-qr8kf`) починає завершуватися, контролер Job негайно створює новий Pod (`example-job-b59zk`) для його заміни.

```shell
kubectl get pods

NAME                READY   STATUS        RESTARTS   AGE
example-job-b59zk   1/1     Running       0          1s
example-job-qr8kf   1/1     Terminating   0          17s
example-job-stvb4   1/1     Running       0          17s
```

З політикою `Failed`, новий Pod (`example-job-b59zk`) не створюється, поки старий Pod (`example-job-qr8kf`) завершує свою роботу.

```shell
kubectl get pods

NAME                READY   STATUS        RESTARTS   AGE
example-job-qr8kf   1/1     Terminating   0          17s
example-job-stvb4   1/1     Running       0          17s
```

Коли Pod, що завершується, повністю переходить у фазу `Failed`, створюється новий Pod:

```shell
kubectl get pods

NAME                READY   STATUS        RESTARTS   AGE
example-job-b59zk   1/1     Running       0          1s
example-job-stvb4   1/1     Running       0          25s
```

## Як ви можете дізнатися більше? {#how-can-you-learn-more}

- Ознайомтесь з документацією для користувачів про [Політику заміни Podʼів](/docs/concepts/workloads/controllers/job/#pod-replacement-policy), [Ліміт повторних спроб для кожного індексу](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index), та [Політику відмови Podʼів](/docs/concepts/workloads/controllers/job/#pod-failure-policy).
- Ознайомтесь з KEP для [Політики заміни Podʼів](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated), [Ліміту повторних спроб для кожного індексу](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs), та [Політики відмови Podʼів](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures).

## Подяки {#acknowledgments}

Як і з будь-якою функцією Kubernetes, багато людей внесли свій вклад у реалізацію цієї можливості, від тестування та повідомлень про помилки до перегляду коду.

Оскільки ця можливість переходить у стабільний стан після 2 років, ми хотіли б подякувати таким людям:

* [Kevin Hannon](https://github.com/kannon92) - за написання KEP та початкову реалізацію.
* [Michał Woźniak](https://github.com/mimowo) - за настанови, менторство та рецензії.
* [Aldo Culquicondor](https://github.com/alculquicondor) - за настанови, менторство та рецензії.
* [Maciej Szulik](https://github.com/soltysh) - за настанови, менторство та рецензії.
* [Dejan Zele Pejchev](https://github.com/dejanzele) - за те, що взяв на себе цю можливість та просував її з Alpha через Beta до GA.

## Долучайтесь {#get-involved}

Цю роботу спонсорувала [batch working group](https://github.com/kubernetes/community/tree/master/wg-batch) Kubernetes у тісній співпраці зі спільнотою [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps).

Якщо ви зацікавлені в роботі над новими можливостями в цій сфері, ми рекомендуємо підписатися на наш канал у [Slack](https://kubernetes.slack.com/messages/wg-batch) і відвідувати регулярні зустрічі спільноти.
