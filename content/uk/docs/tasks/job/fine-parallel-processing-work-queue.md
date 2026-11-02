---
title: Тонка паралельна обробка за допомогою робочої черги
content_type: task
weight: 30
---

<!-- overview -->

У цьому прикладі ви запустите Job Kubernetes, який виконує кілька паралельних завдань як робочі процеси, кожен з яких працює в окремому Podʼі.

У цьому прикладі кожен створений Pod бере одну одиницю роботи з черги завдань, обробляє її й повторює це, доки не буде досягнуто кінця черги.

Ось загальний огляд кроків у цьому прикладі:

1. **Запустіть сервіс зберігання для робочої черги.** У цьому прикладі ви використаєте Redis для зберігання робочих елементів. У [попередньому прикладі](/docs/tasks/job/coarse-parallel-processing-work-queue) ви використовували RabbitMQ. У цьому прикладі ви використаєте Redis і власну клієнтську бібліотеку робочої черги, тому що AMQP не дає клієнтам зручного способу виявити, що робоча черга скінченної довжини порожня. На практиці ви один раз налаштуєте сховище на кшталт Redis і повторно використовуватимете його для робочих черг багатьох Jobs та для інших потреб.
1. **Створіть чергу й заповніть її повідомленнями.** Кожне повідомлення представляє одне завдання, яке потрібно виконати. У цьому прикладі повідомлення — це ціле число, над яким ми виконаємо тривалі обчислення.
1. **Запустіть Job, який працює над завданнями з черги**. Job запускає кілька Podʼів. Кожен Pod бере одне завдання з черги повідомлень, обробляє його й повторює це, доки не буде досягнуто кінця черги.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Вам знадобиться реєстр образів контейнерів, куди можна завантажувати образи для запуску у вашому кластері. У прикладі використовується [Docker Hub](https://hub.docker.com/), але ви можете адаптувати його до іншого реєстру образів контейнерів.

Цей приклад завдання також передбачає, що Docker встановлено локально. Docker використовується для збирання образів контейнерів.

<!-- steps -->

Ви маєте знати базове, непаралельне використання [Job](/docs/concepts/workloads/controllers/job/).

<!-- steps -->

## Запуск Redis {#starting-redis}

Для простоти в цьому прикладі ви запустите один екземпляр Redis. Приклад масштабованого й відмовостійкого розгортання Redis дивіться в [прикладі Redis](https://github.com/kubernetes/examples/tree/master/web/guestbook/).

Ви також можете безпосередньо завантажити такі файли:

- [`redis-pod.yaml`](/examples/application/job/redis/redis-pod.yaml)
- [`redis-service.yaml`](/examples/application/job/redis/redis-service.yaml)
- [`Dockerfile`](/examples/application/job/redis/Dockerfile)
- [`job.yaml`](/examples/application/job/redis/job.yaml)
- [`rediswq.py`](/examples/application/job/redis/rediswq.py)
- [`worker.py`](/examples/application/job/redis/worker.py)

Щоб запустити один екземпляр Redis, потрібно створити Pod redis і Service redis:

```shell
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-pod.yaml
kubectl apply -f https://k8s.io/examples/application/job/redis/redis-service.yaml
```

## Заповнення черги завданнями {#filling-the-queue-with-tasks}

Тепер заповнімо чергу кількома «завданнями». У цьому прикладі завдання — це рядки, які потрібно вивести.

Запустіть тимчасовий інтерактивний Pod для запуску Redis CLI.

```shell
kubectl run -i --tty temp --image redis --command "/bin/sh"
```

```
Waiting for pod default/redis2-c7h78 to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

Тепер натисніть Enter, запустіть Redis CLI і створіть список із кількома робочими елементами.

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

Отже, список із ключем `job2` буде робочою чергою.

Примітка: якщо Kube DNS налаштовано неправильно, може знадобитися змінити перший крок у наведеному вище блоці на `redis-cli -h $REDIS_SERVICE_HOST`.

## Створення образу контейнера {#create-an-image}

Тепер ви готові створити образ, який оброблятиме роботу в цій черзі.

Ви використаєте робочу програму на Python із клієнтом Redis для читання повідомлень із черги повідомлень.

Надається проста клієнтська бібліотека робочої черги Redis `rediswq.py` ([Завантажити](/examples/application/job/redis/rediswq.py)).

Програма-«робітник» у кожному Podʼі Job використовує клієнтську бібліотеку робочої черги, щоб отримувати роботу. Ось вона:

{{% code_sample language="python" file="application/job/redis/worker.py" %}}

Ви також можете завантажити файли [`worker.py`](/examples/application/job/redis/worker.py), [`rediswq.py`](/examples/application/job/redis/rediswq.py) і [`Dockerfile`](/examples/application/job/redis/Dockerfile), а потім зібрати образ контейнера. Ось приклад збирання образу за допомогою Docker:

```shell
docker build -t job-wq-2 .
```

### Надішліть образ у реєстр {#push-the-image}

Для [Docker Hub](https://hub.docker.com/) додайте до образу застосунку теґ зі своїм іменем користувача й надішліть його в Hub наведеними нижче командами. Замініть `<username>` своїм іменем користувача Hub.

```shell
docker tag job-wq-2 <username>/job-wq-2
docker push <username>/job-wq-2
```

Потрібно надіслати образ у публічний репозиторій або [налаштувати кластер для доступу до вашого приватного репозиторію](/docs/concepts/containers/images/).

## Визначення Job {#defining-a-job}

Ось маніфест для створення Job:

{{% code_sample file="application/job/redis/job.yaml" %}}

{{< note >}}
Не забудьте відредагувати маніфест, змінивши `gcr.io/myproject` на свій власний шлях.
{{< /note >}}

У цьому прикладі кожен Pod працює над кількома елементами черги, а потім завершується, коли елементів більше немає. Оскільки робочі процеси самі виявляють, що робоча черга порожня, а контролер Job не знає про робочу чергу, він покладається на те, що робочі процеси повідомлять про завершення роботи. Робочі процеси сигналізують, що черга порожня, успішно завершуючись. Тож щойно **будь-який** робочий процес успішно завершиться, контролер знає, що роботу виконано і що Podʼи незабаром завершаться. Тому кількість завершень Job потрібно лишити незаданою. Контролер Job також зачекає завершення інших Podʼів.

## Запуск Job {#running-the-job}

Отже, тепер запустіть Job:

```shell
# передбачається, що ви вже завантажили та відредагували маніфест
kubectl apply -f ./job.yaml
```

Тепер трохи зачекайте, а потім перевірте стан Job:

```shell
kubectl describe jobs/job-wq-2
```

```
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

Ви можете зачекати на успішне завершення Job із тайм-аутом:

```shell
# Перевірка назви умови не залежить від регістру
kubectl wait --for=condition=complete --timeout=300s job/job-wq-2
```

```shell
kubectl logs pods/job-wq-2-7r7b2
```

```
Worker with sessionID: bbd72d0a-9e5c-4dd6-abf6-416cc267991f
Initial queue state: empty=False
Working on banana
Working on date
Working on lemon
```

Як бачите, один із Podʼів цього Job працював над кількома одиницями роботи.

<!-- discussion -->

## Альтернативи {#alternatives}

Якщо запускати сервіс черги або змінювати контейнери для використання робочої черги незручно, варто розглянути один з інших [шаблонів Job](/docs/concepts/workloads/controllers/job/#job-patterns).

Якщо у вас є постійний потік фонової роботи, натомість розгляньте запуск фонових робочих процесів за допомогою ReplicaSet і використання бібліотеки фонової обробки, наприклад [https://github.com/resque/resque](https://github.com/resque/resque).
