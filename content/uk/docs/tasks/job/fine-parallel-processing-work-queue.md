---
title: Тонка паралельна обробка за допомогою черги роботи
content_type: task
weight: 30
---

<!-- overview -->

In цьому прикладі ви запустите Job Kubernetes, яке виконує декілька паралельних завдань як робочі процеси, кожен з яких працює як окремий Pod.

У цьому прикладі, при створенні кожного Podʼа, він бере одиницю роботи з черги завдань, обробляє її та повторює цей процес до досягнення кінця черги.

Ось загальний огляд кроків у цьому прикладі:

1. **Запустіть службу зберігання, щоб зберігати чергу завдань.** У цьому прикладі ви використаєте Redis для зберігання робочих елементів. У [попередньому прикладі](/docs/tasks/job/coarse-parallel-processing-work-queue), ви використали RabbitMQ. У цьому прикладі ви будете використовувати Redis та власну бібліотеку клієнтів черг завдань; це тому, що AMQP не надає зручний спосіб клієнтам виявити, коли скінчиться черга робочих елементів з обмеженою довжиною. На практиці ви налаштуєте сховище, таке як Redis, один раз і повторно використовуватимете його для черг робочих завдань багатьох завдань та іншого.
2. **Створіть чергу та заповніть її повідомленнями.** Кожне повідомлення представляє одне завдання, яке потрібно виконати. У цьому прикладі повідомленням є ціле число, над яким ми виконаємо тривалі обчислення.
3. **Запустіть завдання, яке працює над завданнями з черги**. Завдання запускає декілька Podʼів.  Кожний Pod бере одне завдання з черги повідомлень, обробляє його та повторює цей процес до досягнення кінця черги.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Вам знадобиться реєстр контейнерних образів, де ви можете завантажувати образи для запуску у вашому кластері. У прикладі використовується [Docker Hub](https://hub.docker.com/), але ви можете адаптувати його до іншого реєстру контейнерних образів.

Цей приклад передбачає, що у вас встановлено Docker локально. Ви будете використовувати Docker для створення контейнерних образів.

<!-- steps -->

Ви маєти бути знайомі з базовим, не-паралельним використанням [Job](/docs/concepts/workloads/controllers/job/).

<!-- steps -->

## Запуск Redis {#starting-redis}

У цьому прикладі, для спрощення, ви запустите один екземпляр Redis. Дивіться [Приклад Redis](https://github.com/kubernetes/examples/tree/master/web/guestbook/) для прикладу розгортання Redis масштабовано та надійно.

Ви також можете завантажити наступні файли безпосередньо:

- [`redis-pod.yaml`](/examples/application/job/redis/redis-pod.yaml)
- [`redis-service.yaml`](/examples/application/job/redis/redis-service.yaml)
- [`Dockerfile`](/examples/application/job/redis/Dockerfile)
- [`job.yaml`](/examples/application/job/redis/job.yaml)
- [`rediswq.py`](/examples/application/job/redis/rediswq.py)
- [`worker.py`](/examples/application/job/redis/worker.py)

Для запуску одного екземпляра Redis вам потрібно створити Pod Redis та Service Redis:

```shell
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-pod.yaml
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-service.yaml
```

## Заповнення черги завданнями {#filling-the-qeue-with-tasks}

Тепер заповнімо чергу деякими "задачами". У цьому прикладі завданнями є рядки, які потрібно вивести.

Запустіть тимчасовий інтерактивний Pod для використання Redis CLI.

```shell
kubectl run -i --tty temp --image redis --command "/bin/sh"
```

```none
Waiting for pod default/redis2-c7h78 to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

Тепер натисніть Enter, запустіть Redis CLI та створіть список з деякими елементами роботи в ньому.

```shell
redis-cli -h redis
```

```console
redis:6379> rpush job2 "apple"
(integer) 1
redis:6379> rpush job2 "banana"
(integer) 2
redis:6379> rpush job2 "cherry"
(integer) 3
redis:6379> rpush job2 "date"
(integer) 4
redis:6379> rpush job2 "fig"
(integer) 5
redis:6379> rpush job2 "grape"
(integer) 6
redis:6379> rpush job2 "lemon"
(integer) 7
redis:6379> rpush job2 "melon"
(integer) 8
redis:6379> rpush job2 "orange"
(integer) 9
redis:6379> lrange job2 0 -1
1) "apple"
2) "banana"
3) "cherry"
4) "date"
5) "fig"
6) "grape"
7) "lemon"
8) "melon"
9) "orange"
```

Отже, список з ключем `job2` буде чергою роботи.

Примітка: якщо у вас неправильно налаштовано Kube DNS, вам може знадобитися змінити перший крок вищезазначеного блоку на `redis-cli -h $REDIS_SERVICE_HOST`.

## Створення образу контейнера {#create-an-image}

Тепер ви готові створити образ, який буде обробляти завдання в цій черзі.

Ви будете використовувати робочу програму на Python з клієнтом Redis для читання повідомлень з черги повідомлень.

Надається проста бібліотека клієнтів черги роботи Redis, яка називається `rediswq.py` ([Завантажити](/examples/application/job/redis/rediswq.py)).

Програма "робітник" в кожному Pod Job використовує бібліотеку клієнтів черги роботи, щоб отримати роботу. Ось вона:

{{% code_sample language="python" file="application/job/redis/worker.py" %}}

Ви також можете завантажити файли [`worker.py`](/examples/application/job/redis/worker.py), [`rediswq.py`](/examples/application/job/redis/rediswq.py) та [`Dockerfile`](/examples/application/job/redis/Dockerfile), а потім побудувати контейнерний образ. Ось приклад використання Docker для побудови образу:

```shell
docker build -t job-wq-2 .
```

### Збереження образу в реєстрі {#push-the-image}

Для [Docker Hub](https://hub.docker.com/), позначте свій образ програми імʼям користувача та завантажте його до Hub за допомогою наступних команд. Замість `<username>` вкажіть своє імʼя користувача Hub.

```shell
docker tag job-wq-2 <username>/job-wq-2
docker push <username>/job-wq-2
```

Вам потрібно завантажити в публічний репозиторій або [налаштувати кластер для доступу до вашого приватного репозиторію](/docs/concepts/containers/images/).

## Визначення завдання {#defining-a-job}

Ось маніфест для створення Job:

{{% code_sample file="application/job/redis/job.yaml" %}}

{{< note >}}
Не забудьте відредагувати маніфест, змінивши `gcr.io/myproject` на свій власний шлях.
{{< /note >}}

У цьому прикладі кожний Pod працює з кількома елементами черги, а потім виходить, коли елементи закінчуються. Оскільки самі робочі процеси виявляють порожнечу робочої черги, а контролер завдань не володіє інформацією про робочу чергу, він покладається на робочі процеси, щоб сигналізувати, коли вони закінчили роботу. Робочі процеси сигналізують, що черга порожня, вийшовши з успіхом. Таким чином, як тільки **будь-який** робочий процес виходить з успіхом, контролер знає, що робота виконана, і що Podʼи скоро вийдуть. Тому вам потрібно залишити лічильник завершення завдання невизначеним. Контролер завдань зачекає, доки інші Podʼи завершаться також.

## Запуск завдання {#running-the-job}

Отже, зараз запустіть завдання:

```shell
# передбачається, що ви вже завантажили та відредагували маніфест
kubectl apply -f ./job.yaml
```

Тепер зачекайте трохи, а потім перевірте стан завдання:

```shell
kubectl describe jobs/job-wq-2
```

```none
Name:             job-wq-2
Namespace:        default
Selector:         controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
Labels:           controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                  job-name=job-wq-2
Annotations:      <none>
Parallelism:      2
Completions:      <unset>
Start Time:       Mon, 11 Jan 2022 17:07:59 +0000
Pods Statuses:    1 Running / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                job-name=job-wq-2
  Containers:
   c:
    Image:              container-registry.example/exampleproject/job-wq-2
    Port:
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From            SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----            -------------    --------    ------            -------
  33s          33s         1        {job-controller }                Normal      SuccessfulCreate  Created pod: job-wq-2-lglf8
```

Ви можете зачекати, поки завдання завершиться успішно, з тайм-аутом:

```shell
# Перевірка умови назви нечутлива до регістру
kubectl wait --for=condition=complete --timeout=300s job/job-wq-2
```

```shell
kubectl logs pods/job-wq-2-7r7b2
```

```none
Worker with sessionID: bbd72d0a-9e5c-4dd6-abf6-416cc267991f
Initial queue state: empty=False
Working on banana
Working on date
Working on lemon
```

Як бачите, один з Podʼів для цього завдання працював над кількома робочими одиницями.

<!-- discussion -->

## Альтернативи {#alternatives}

Якщо запуск служби черги або модифікація ваших контейнерів для використання робочої черги є незручними, ви можете розглянути один з інших [шаблонів завдань](/docs/concepts/workloads/controllers/job/#job-patterns).

Якщо у вас є постійний потік фонової обробки, яку потрібно виконувати, то розгляньте запуск ваших фонових робітників за допомогою ReplicaSet, і розгляньте використання бібліотеки фонової обробки, такої як [https://github.com/resque/resque](https://github.com/resque/resque).
