---
title: Груба паралельна обробка за допомогою робочої черги
content_type: task
weight: 20
---

<!-- overview -->

У цьому прикладі ви запустите Job Kubernetes з кількома паралельними робочими процесами.

У цьому прикладі кожен створений Pod бере одну одиницю роботи з черги завдань, виконує її, видаляє її з черги та завершує роботу.

Ось огляд кроків у цьому прикладі:

1. **Запустіть сервіс черги повідомлень.** У цьому прикладі використовується RabbitMQ, але можна використати інший. На практиці ви налаштували б сервіс черги повідомлень один раз і повторно використовували б його для багатьох Jobs.
1. **Створіть чергу й заповніть її повідомленнями.** Кожне повідомлення представляє одне завдання, яке потрібно виконати. У цьому прикладі повідомлення — це ціле число, над яким ми виконаємо тривалі обчислення.
1. **Запустіть Job, який працює над завданнями з черги**. Job запускає кілька Podʼів. Кожен Pod бере одне завдання з черги повідомлень, обробляє його й завершує роботу.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ви вже маєте знати базове, непаралельне використання [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}}

Вам знадобиться реєстр образів контейнерів, куди можна завантажувати образи для запуску у вашому кластері.

Цей приклад завдання також передбачає, що Docker встановлено локально.

<!-- steps -->

## Запуск сервісу черги повідомлень {#starting-a-message-queue-service}

У цьому прикладі використовується RabbitMQ, проте ви можете адаптувати його для іншого сервісу повідомлень типу AMQP.

На практиці ви можете один раз налаштувати сервіс черги повідомлень у кластері й повторно використовувати його для багатьох Jobs, а також для довготривалих сервісів.

Запустіть RabbitMQ таким чином:

```shell
# Створіть Service для використання StatefulSet
kubectl create -f https://kubernetes.io/examples/application/job/rabbitmq/rabbitmq-service.yaml
```

```
service "rabbitmq-service" created
```

```shell
kubectl create -f https://kubernetes.io/examples/application/job/rabbitmq/rabbitmq-statefulset.yaml
```

```
statefulset "rabbitmq" created
```

## Тестування сервісу черги повідомлень {#testing-the-message-queue-service}

Тепер можна спробувати звернутися до черги повідомлень. Ми створимо тимчасовий інтерактивний Pod, встановимо на ньому деякі інструменти й поекспериментуємо з чергами.

Спочатку створіть тимчасовий інтерактивний Pod.

```shell
# Створіть тимчасовий інтерактивний контейнер
kubectl run -i --tty temp --image ubuntu:22.04
```

```
Waiting for pod default/temp-loe07 to be running, status is Pending, pod ready: false
... [ previous line repeats several times .. hit return when it stops ] ...
```

Зверніть увагу, що назва вашого Podʼа й запрошення командного рядка будуть іншими.

Далі встановіть `amqp-tools`, щоб працювати з чергами повідомлень. Наведені нижче команди показують, що потрібно виконати в інтерактивній оболонці цього Podʼа:

```shell
apt-get update && apt-get install -y curl ca-certificates amqp-tools python3 dnsutils
```

Пізніше ви створите образ контейнера, що містить ці пакети.

Далі перевірте, чи можете виявити Service для RabbitMQ:

```
# Виконайте ці команди всередині Podʼа
# Зверніть увагу, що rabbitmq-service має DNS-імʼя, надане Kubernetes:
nslookup rabbitmq-service
```

```
Server:        10.0.0.10
Address:    10.0.0.10#53

Name:    rabbitmq-service.default.svc.cluster.local
Address: 10.0.147.152
```

(IP-адреси будуть іншими)

Якщо надбудову DNS кластера налаштовано неправильно, попередній крок може не спрацювати. Ви також можете знайти IP-адресу цього Service у змінній середовища:

```shell
# виконайте цю перевірку всередині Podʼа
env | grep RABBITMQ_SERVICE | grep HOST
```

```
RABBITMQ_SERVICE_SERVICE_HOST=10.0.147.152
```

(IP-адреса буде іншою)

Далі перевірте, чи можете створити чергу, а також публікувати й отримувати повідомлення.

```shell
# Виконайте ці команди всередині Podʼа
# У наступному рядку rabbitmq-service — це імʼя хоста, за яким доступний rabbitmq-service.
# 5672 — стандартний порт rabbitmq.
export BROKER_URL=amqp://guest:guest@rabbitmq-service:5672
# Якщо на попередньому кроці не вдалося розвʼязати "rabbitmq-service",
# використайте натомість цю команду:
BROKER_URL=amqp://guest:guest@$RABBITMQ_SERVICE_SERVICE_HOST:5672

# Тепер створіть чергу:

/usr/bin/amqp-declare-queue --url=$BROKER_URL -q foo -d
```

```
foo
```

Опублікуйте одне повідомлення в чергу:

```shell
/usr/bin/amqp-publish --url=$BROKER_URL -r foo -p -b Hello

# І отримайте його назад.

/usr/bin/amqp-consume --url=$BROKER_URL -q foo -c 1 cat && echo 1>&2
```

```
Hello
```

В останній команді інструмент `amqp-consume` взяв одне повідомлення (`-c 1`) із черги й передав його на стандартний ввід довільної команди. У цьому випадку програма `cat` виводить символи, прочитані зі стандартного вводу, а echo додає повернення каретки, щоб приклад було зручно читати.

## Заповнення черги завданнями {#fill-the-queue-with-tasks}

Тепер заповніть чергу кількома імітованими завданнями. У цьому прикладі завдання — це рядки, які потрібно вивести.

На практиці вміст повідомлень може бути таким:

- назви файлів, які потрібно обробити
- додаткові прапорці для програми
- діапазони ключів у таблиці бази даних
- параметри конфігурації для симуляції
- номери кадрів сцени для рендерингу

Якщо всім Podʼам Job потрібні великі дані лише для читання, їх зазвичай розміщують у спільній файловій системі на кшталт NFS і монтують лише для читання в усі Podʼи або пишуть програму в Podʼі так, щоб вона могла напряму читати дані з кластерної файлової системи (наприклад, HDFS).

У цьому прикладі ви створите чергу й заповните її за допомогою інструментів командного рядка AMQP. На практиці можна написати програму для заповнення черги за допомогою клієнтської бібліотеки AMQP.

```shell
# Виконайте це на вашому компʼютері, а не в Podʼі
/usr/bin/amqp-declare-queue --url=$BROKER_URL -q job1  -d
```

```
job1
```

Додайте елементи до черги:

```shell
for f in apple banana cherry date fig grape lemon melon
do
  /usr/bin/amqp-publish --url=$BROKER_URL -r job1 -p -b $f
done
```

Ви додали 8 повідомлень до черги.

## Створення образу контейнера {#create-a-container-image}

Тепер ви готові створити образ, який ви будете запускати як Job.

Job використовуватиме утиліту `amqp-consume`, щоб читати повідомлення з черги й виконувати фактичну роботу. Ось дуже простий приклад програми:

{{% code_sample language="python" file="application/job/rabbitmq/worker.py" %}}

Надайте скрипту дозвіл на виконання:

```shell
chmod +x worker.py
```

Тепер зберіть образ. Створіть тимчасову теку, перейдіть до неї, завантажте [Dockerfile](/examples/application/job/rabbitmq/Dockerfile) і [worker.py](/examples/application/job/rabbitmq/worker.py). У будь-якому разі зберіть образ за допомогою цієї команди:

```shell
docker build -t job-wq-1 .
```

Для [Docker Hub](https://hub.docker.com/) додайте до образу застосунку теґ зі своїм іменем користувача й надішліть його в Hub наведеними нижче командами. Замініть `<username>` своїм іменем користувача Hub.

```shell
docker tag job-wq-1 <username>/job-wq-1
docker push <username>/job-wq-1
```

Якщо ви використовуєте інший реєстр образів контейнерів, додайте теґ до образу й надішліть його туди.

## Визначення Job {#defining-a-job}

Ось маніфест Job. Потрібно зробити копію маніфесту Job (назвіть її `./job.yaml`) і змінити назву образу контейнера на ту, яку ви використали.

{{% code_sample file="application/job/rabbitmq/job.yaml" %}}

У цьому прикладі кожен Pod працює над одним елементом із черги, а потім завершує роботу. Отже, кількість завершень Job відповідає кількості виконаних робочих елементів. Тому в маніфесті прикладу `.spec.completions` дорівнює `8`.

## Запуск Job {#running-the-job}

Тепер запустіть Job:

```shell
# це передбачає, що ви вже завантажили та відредагували маніфест
kubectl apply -f ./job.yaml
```

Ви можете зачекати на успішне завершення Job із тайм-аутом:

```shell
# Перевірка назви умови не залежить від регістру
kubectl wait --for=condition=complete --timeout=300s job/job-wq-1
```

Далі перевірте Job:

```shell
kubectl describe jobs/job-wq-1
```

```
Name:             job-wq-1
Namespace:        default
Selector:         controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
Labels:           controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
                  job-name=job-wq-1
Annotations:      <none>
Parallelism:      2
Completions:      8
Start Time:       Wed, 06 Sep 2022 16:42:02 +0000
Pods Statuses:    0 Running / 8 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
                job-name=job-wq-1
  Containers:
   c:
    Image:      container-registry.example/causal-jigsaw-637/job-wq-1
    Port:
    Environment:
      BROKER_URL:       amqp://guest:guest@rabbitmq-service:5672
      QUEUE:            job1
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen  LastSeen   Count    From    SubobjectPath    Type      Reason              Message
  ─────────  ────────   ─────    ────    ─────────────    ──────    ──────              ───────
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-hcobb
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-weytj
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-qaam5
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-b67sr
  26s        26s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-xe5hj
  15s        15s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-w2zqe
  14s        14s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-d6ppa
  14s        14s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-p17e0
```

Усі Podʼи цього Job завершилися успішно! Готово.

<!-- discussion -->

## Альтернативи {#alternatives}

Перевага цього підходу в тому, що вам не потрібно змінювати свою програму-«робітника», щоб вона знала про робочу чергу. Ви можете додати незмінену робочу програму до образу контейнера.

Цей підхід потребує запуску сервісу черги повідомлень. Якщо запускати сервіс черги незручно, варто розглянути один з інших [шаблонів Job](/docs/concepts/workloads/controllers/job/#job-patterns).

Цей підхід створює Pod для кожного робочого елемента. Однак якщо робочі елементи виконуються лише кілька секунд, створення Podʼа для кожного з них може додати значні накладні витрати. Розгляньте інший підхід, наприклад із [прикладу тонкої паралельної робочої черги](/docs/tasks/job/fine-parallel-processing-work-queue/), де один Pod виконує кілька робочих елементів.

У цьому прикладі ви використали утиліту `amqp-consume`, щоб читати повідомлення з черги й запускати фактичну програму. Перевага в тому, що програму не потрібно змінювати, щоб вона знала про чергу. У [прикладі тонкої паралельної робочої черги](/docs/tasks/job/fine-parallel-processing-work-queue/) показано, як взаємодіяти з робочою чергою за допомогою клієнтської бібліотеки.

## Застереження {#caveats}

Якщо кількість завершень менша за кількість елементів у черзі, не всі елементи буде оброблено.

Якщо кількість завершень більша за кількість елементів у черзі, Job не вважатиметься завершеним, навіть якщо всі елементи в черзі оброблено. Він запускатиме додаткові Podʼи, які блокуватимуться в очікуванні повідомлення. Вам потрібно створити власний механізм, щоб виявляти наявність роботи й вимірювати розмір черги, задаючи відповідну кількість завершень.

У цього шаблону є малоймовірний стан гонитви. Якщо контейнер буде завершено між моментом, коли команда `amqp-consume` підтвердила повідомлення, і моментом успішного завершення контейнера, або якщо вузол вийде з ладу, перш ніж kubelet зможе надіслати API-серверу повідомлення про успіх Podʼа, Job не вважатиметься завершеним, навіть якщо всі елементи в черзі оброблено.
