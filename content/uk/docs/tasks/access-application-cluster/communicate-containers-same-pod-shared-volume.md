---
title: Спілкування між контейнерами в одному Podʼі за допомогою спільного тому
content_type: task
weight: 120
---

<!-- overview -->

Ця сторінка показує, як використовувати Том для спілкування між двома контейнерами, що працюють в одному Podʼі. Також дивіться, як дозволити процесам спілкуватися між контейнерами через [спільний простір процесів](/docs/tasks/configure-pod-container/share-process-namespace/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Створення Pod, що запускає два контейнери {#creating-a-pod-that-runs-two-containers}

У цьому завданні ви створите Pod, який запускає два контейнери. Ці два контейнери спільно використовують Том, який вони можуть використовувати для спілкування. Ось конфігураційний файл для Podʼа:

{{% code_sample file="pods/two-container-pod.yaml" %}}

У конфігураційному файлі видно, що Pod має Том з назвою `shared-data`.

Перший контейнер, зазначений у конфігураційному файлі, запускає сервер nginx. Шлях монтування для спільного тому — `/usr/share/nginx/html`. Другий контейнер базується на образі debian і має шлях монтування `/pod-data`. Другий контейнер виконує наступну команду і потім завершується.

```shell
echo Hello from the debian container > /pod-data/index.html
```

Зверніть увагу, що другий контейнер записує файл `index.html` в кореневу теку сервера nginx.

Створіть Pod і два контейнери:

```shell
kubectl apply -f https://k8s.io/examples/pods/two-container-pod.yaml
```

Перегляньте інформацію про Pod та контейнери:

```shell
kubectl get pod two-containers --output=yaml
```

Ось частина вихідних даних:

```yaml
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
```

Ви бачите, що контейнер debian завершив роботу, а контейнер nginx все ще працює.

Отримайте доступ до shell контейнера nginx:

```shell
kubectl exec -it two-containers -c nginx-container -- /bin/bash
```

У вашому shell перевірте, що nginx працює:

```shell
root@two-containers:/# apt-get update
root@two-containers:/# apt-get install curl procps
root@two-containers:/# ps aux
```

Вихідні дані схожі на це:

```none
USER       PID  ...  STAT START   TIME COMMAND
root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;
```

Згадайте, що контейнер debian створив файл `index.html` в кореневій теці nginx. Використовуйте `curl`, щоб надіслати GET запит на сервер nginx:

```none
root@two-containers:/# curl localhost
```

Вихідні дані показують, що nginx обслуговує вебсторінку, написану контейнером debian:

```none
Hello from the debian container
```

<!-- discussion -->

## Обговорення {#discussion}

Основна причина, через яку Podʼи можуть мати кілька контейнерів, полягає у підтримці допоміжних застосунків, що допомагають основному застосунку. Типові приклади допоміжних застосунків включають інструменти для завантаження, надсилання даних та проксі. Допоміжні та основні застосунки часто потребують спілкування між собою. Зазвичай це робиться через спільну файлову систему, як показано в цій вправі, або через інтерфейс локальної мережі, localhost. Прикладом цього шаблону є вебсервер разом із допоміжним застосунком, яка перевіряє репозиторій Git на наявність нових оновлень.

Том у цьому завданні надає спосіб спілкування контейнерів під час життя Pod. Якщо Pod видалено та створено знову, всі дані, збережені в спільному томі, будуть втрачені.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [шаблони для композитних контейнерів](/blog/2015/06/the-distributed-system-toolkit-patterns/).

* Дізнайтеся про [композитні контейнери для модульної архітектури](https://www.slideshare.net/Docker/slideshare-burns).

* Перегляньте [Налаштування Pod для використання тому для зберігання](/docs/tasks/configure-pod-container/configure-volume-storage/).

* Перегляньте [Налаштування Pod для спільного використання простору процесів між контейнерами](/docs/tasks/configure-pod-container/share-process-namespace/).

* Перегляньте [Том](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

* Перегляньте [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).
