---
layout: blog
title: "Kubernetes v1.34: Політика заміни Pod для Jobs переходить у GA"
date: 2025-09-05T10:30:00-08:00
slug: kubernetes-v1-34-pod-replacement-policy-for-jobs-goes-ga
author: >
  [Dejan Zele Pejchev](https://github.com/dejanzele) (G-Research)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

В Kubernetes v1.34, функція _Політика заміни Pod_ досягла загальної доступності (GA). Ця стаття описує функцію політики заміни Pod і те, як її використовувати у ваших Jobs.

## Про політику заміни Pod

Стандартно контролер Job негайно відтворює Podʼи, як тільки вони виходять з ладу або починають завершувати роботу (коли вони мають мітку часу видалення).

В результаті, хоча деякі Podʼи припиняють роботу, загальна кількість працюючих Podʼів для завдання може тимчасово перевищувати заданий рівень паралельності. Для індексованих Jobs це може навіть означати, що кілька Podʼів працюють для одного й того ж індексу одночасно.

Ця поведінка добре працює для багатьох робочих навантажень, але в певних випадках може викликати проблеми.

Наприклад, популярні фреймворки машинного навчання, такі як TensorFlow та [JAX](https://jax.readthedocs.io/en/latest/), очікують, що для кожного індексу виконавця буде точно один Pod. Якщо два Podʼа працюють одночасно, ви можете зіткнутися з такими помилками:

```none
/job:worker/task:4: Duplicate task registration with task_name=/job:worker/replica:0/task:4
```

Крім того, запуск замінних Podʼів до повного завершення старих може призвести до:

- Затримок у плануванні з боку kube-scheduler, оскільки вузли залишаються зайнятими.
- Непотрібного масштабування кластера для розміщення замінних Podʼів.
- Тимчасового обходу перевірок квот з боку оркестраторів робочих навантажень, таких як [Kueue](https://kueue.sigs.k8s.io/).

З політикою заміни Podʼів Kubernetes надає вам контроль над тим, коли панель управління замінює Podʼи, що завершуються, допомагаючи уникнути цих проблем.

## Як працює політика заміни Pod

Це вдосконалення означає, що Jobs у Kubernetes мають необовʼязкове поле `.spec.podReplacementPolicy`. Ви можете вибрати одну з двох політик:

- `TerminatingOrFailed` (стандартно): Замінює Podʼи, щойно вони починають завершуватися.
- `Failed`: Замінює Podʼи лише після того, як вони повністю завершаться і перейдуть у фазу `Failed`.

Встановлення політики на `Failed` забезпечує створення нового Pod лише після повного завершення попереднього.

Для Jobs з політикою відмови Podʼів (Pod Failure Policy), стандартне значення для `podReplacementPolicy` — `Failed`, і жодне інше значення не дозволяється. Дивіться [Політика відмови Podʼів](/docs/concepts/workloads/controllers/job/#pod-failure-policy), щоб дізнатися більше про політики відмови Podʼів для Jobs.

Ви можете перевірити, скільки Podʼів наразі завершуються, перевіривши поле `.status.terminating` Job:

```shell
kubectl get job myjob -o=jsonpath='{.status.terminating}'
```

## Приклад

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

Якщо Pod отримує сигнал SIGTERM (видалення, виселення, примусове завершення…), він починає завершувати роботу. Коли контейнер обробляє завершення роботи відповідним чином, очищення може зайняти деякий час.

Коли Job починається, ми побачимо два Podʼа, які працюють:

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

## Як ви можете дізнатися більше?

- Ознайомтесь з документацією для користувачів про [Політику замини Podʼів](/docs/concepts/workloads/controllers/job/#pod-replacement-policy), [Ліміт затримки для кожного індексу](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index), та [Політику відмови Podʼів](/docs/concepts/workloads/controllers/job/#pod-failure-policy).
- Ознайомтесь з KEP для [Політики замини Podʼів](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated), [Ліміту затримки для кожного індексу](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3850-backoff-limits-per-index-for-indexed-jobs), та [Політики відмови Podʼів](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures).

## Подяки

Як і з будь-якою функцією Kubernetes, багато людей внесли свій вклад у реалізацію цієї функції, від тестування та подання помилок до перегляду коду.

Оскільки ця функція переходить у стабільний стан після 2 років, ми хотіли б подякувати наступним людям:

* [Kevin Hannon](https://github.com/kannon92) - за написання KEP та початкову реалізацію.
* [Michał Woźniak](https://github.com/mimowo) - за керівництво, менторство та рецензії.
* [Aldo Culquicondor](https://github.com/alculquicondor) - за керівництво, менторство та рецензії.
* [Maciej Szulik](https://github.com/soltysh) - за керівництво, менторство та рецензії.
* [Dejan Zele Pejchev](https://github.com/dejanzele) - за те, що взяв на себе цю функцію та просував її з Alpha через Beta до GA.

## Долучайтесь

Ця робота була підтримана групою [batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
в тісній співпраці з [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) спільнотою.

Якщо ви зацікавлені в роботі над новими функціями в цій області, ми рекомендуємо підписатися на наш [Slack](https://kubernetes.slack.com/messages/wg-batch) канал і відвідувати регулярні зустрічі спільноти.
