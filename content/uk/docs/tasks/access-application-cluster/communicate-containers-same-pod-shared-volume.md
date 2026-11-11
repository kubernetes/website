---
title: Взаємодія контейнерів в одному Podʼі за допомогою спільного тому
content_type: task
weight: 120
---

<!-- overview -->

На цій сторінці показано, як використовувати том для взаємодії двох контейнерів, що працюють в одному Podʼі. Дивіться також, як дозволити процесам взаємодіяти через [спільний простір імен процесів](/docs/tasks/configure-pod-container/share-process-namespace/) між контейнерами.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Створення Podʼа, що запускає два контейнери {#creating-a-pod-that-runs-two-containers}

У цій вправі ви створите Pod, який запускає два контейнери. Ці контейнери спільно використовують том, через який вони можуть взаємодіяти. Ось файл конфігурації Podʼа:

{{% code_sample file="pods/two-container-pod.yaml" %}}

У файлі конфігурації видно, що Pod має том з назвою `shared-data`.

Перший контейнер, вказаний у файлі конфігурації, запускає сервер nginx. Шлях монтування спільного тому — `/usr/share/nginx/html`. Другий контейнер базується на образі debian і має шлях монтування `/pod-data`. Другий контейнер виконує таку команду, а потім завершується.

    echo Hello from the debian container > /pod-data/index.html

Зверніть увагу, що другий контейнер записує файл `index.html` в кореневу теку сервера nginx.

Створіть Pod і два контейнери:

    kubectl apply -f https://k8s.io/examples/pods/two-container-pod.yaml

Перегляньте інформацію про Pod та контейнери:

    kubectl get pod two-containers --output=yaml

Ось частина виводу:

    apiVersion: v1
    kind: Pod
    metadata:
      ...
      name: two-containers
      namespace: default
      ...
    spec:
      ...
      containerStatuses:

      - containerID: docker://c1d8abd1 ...
        image: debian
        ...
        lastState:
          terminated:
            ...
        name: debian-container
        ...

      - containerID: docker://96c1ff2c5bb ...
        image: nginx
        ...
        name: nginx-container
        ...
        state:
          running:
        ...

Ви бачите, що контейнер debian завершив роботу, а контейнер nginx досі працює.

Отримайте доступ до оболонки контейнера nginx:

    kubectl exec -it two-containers -c nginx-container -- /bin/bash

В оболонці перевірте, що nginx працює:

    root@two-containers:/# apt-get update
    root@two-containers:/# apt-get install curl procps
    root@two-containers:/# ps aux

Вивід подібний до такого:

    USER       PID  ...  STAT START   TIME COMMAND
    root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;

Згадайте, що контейнер debian створив файл `index.html` у кореневій теці nginx. Використайте `curl`, щоб надіслати GET-запит на сервер nginx:

```
root@two-containers:/# curl localhost
```

Вивід показує, що nginx обслуговує вебсторінку, записану контейнером debian:

```
Hello from the debian container
```

<!-- discussion -->

## Обговорення {#discussion}

Основна причина, чому Podʼи можуть мати кілька контейнерів, — підтримка допоміжних застосунків, які допомагають основному застосунку. Типові приклади допоміжних застосунків — програми для отримання й надсилання даних, а також проксі. Допоміжні й основні застосунки часто мають взаємодіяти між собою. Зазвичай це робиться через спільну файлову систему, як показано в цій вправі, або через петлевий мережевий інтерфейс localhost. Приклад такого шаблону — вебсервер разом із допоміжною програмою, яка перевіряє наявність нових оновлень у репозиторії Git.

Том у цій вправі надає контейнерам спосіб взаємодіяти протягом життя Podʼа. Якщо Pod видалено й створено заново, усі дані, збережені в спільному томі, втрачаються.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [шаблони для композитних контейнерів](/blog/2015/06/the-distributed-system-toolkit-patterns/).

* Дізнайтеся про [композитні контейнери для модульної архітектури](https://www.slideshare.net/Docker/slideshare-burns).

* Перегляньте [Налаштування Podʼа для використання тому для зберігання](/docs/tasks/configure-pod-container/configure-volume-storage/).

* Перегляньте [Налаштування Podʼа для спільного використання простору імен процесів між контейнерами в Podʼі](/docs/tasks/configure-pod-container/share-process-namespace/).

* Перегляньте [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

* Перегляньте [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).
