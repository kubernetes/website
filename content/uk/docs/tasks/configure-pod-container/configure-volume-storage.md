---
title: Налаштування Podʼа для використання тому як сховища
content_type: task
weight: 80
---

<!-- overview -->

Ця сторінка показує, як налаштувати Pod для використання тому як сховища.

Файлова система контейнера існує лише доти, доки існує контейнер. Тож коли контейнер завершується й перезапускається, зміни у файловій системі втрачаються. Для стабільнішого зберігання, незалежного від контейнера, можна використовувати [том](/docs/concepts/storage/volumes/). Це особливо важливо для застосунків зі станом, таких як сховища ключ-значення (наприклад, Redis) і бази даних.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Налаштування тому для Podʼа {#configure-a-volume-for-a-pod}

У цій вправі ви створюєте Pod з одним контейнером. Цей Pod має том типу [emptyDir](/docs/concepts/storage/volumes/#emptydir), який існує протягом усього життя Podʼа, навіть якщо контейнер завершиться й перезапуститься. Ось файл конфігурації Podʼа:

{{% code_sample file="pods/storage/redis.yaml" %}}

1. Створіть Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
   ```

1. Перевірте, що контейнер Podʼа працює, а потім стежте за змінами Podʼа:

   ```shell
   kubectl get pod redis --watch
   ```

   Вивід виглядає так:

   ```console
   NAME      READY     STATUS    RESTARTS   AGE
   redis     1/1       Running   0          13s
   ```

1. В іншому терміналі отримайте доступ до оболонки запущеного контейнера:

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

1. У своїй оболонці перейдіть до `/data/redis`, а потім створіть файл:

   ```shell
   root@redis:/data# cd /data/redis/
   root@redis:/data/redis# echo Hello > test-file
   ```

1. У своїй оболонці виведіть список запущених процесів:

   ```shell
   root@redis:/data/redis# apt-get update
   root@redis:/data/redis# apt-get install procps
   root@redis:/data/redis# ps aux
   ```

   Вивід подібний до такого:

   ```console
   USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
   redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
   root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
   root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
   ```

1. У своїй оболонці завершіть процес Redis:

   ```shell
   root@redis:/data/redis# kill <pid>
   ```

   де `<pid>` — це ідентифікатор процесу Redis (PID).

1. У початковому терміналі стежте за змінами Podʼа Redis. Зрештою ви побачите щось подібне:

   ```console
   NAME      READY     STATUS     RESTARTS   AGE
   redis     1/1       Running    0          13s
   redis     0/1       Completed  0         6m
   redis     1/1       Running    1         6m
   ```

На цьому етапі контейнер завершився й перезапустився. Це тому, що Pod Redis має [restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) `Always`.

1. Отримайте доступ до оболонки в перезапущеному контейнері:

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

1. У своїй оболонці перейдіть до `/data/redis` і переконайтеся, що `test-file` досі там.

   ```shell
   root@redis:/data/redis# cd /data/redis/
   root@redis:/data/redis# ls
   test-file
   ```

1. Видаліть Pod, який ви створили для цієї вправи:

   ```shell
   kubectl delete pod redis
   ```

## {{% heading "whatsnext" %}} {#what-s-next}

- Дивіться [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

- Дивіться [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

- Крім локального дискового сховища, яке надає `emptyDir`, Kubernetes підтримує багато різних мережевих сховищ, зокрема PD у GCE та EBS в EC2, яким надають перевагу для критичних даних і які беруть на себе такі деталі, як монтування й демонтування пристроїв на вузлах. Докладніше дивіться [Томи](/docs/concepts/storage/volumes/).
