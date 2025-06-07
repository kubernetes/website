---
title: Налаштування Podʼа для використання тому для зберігання
content_type: task
weight: 80
---

<!-- overview -->

Ця сторінка показує, як налаштувати Pod для використання тому для зберігання.

Файлова система контейнера існує лише поки існує сам контейнер. Отже, коли контейнер завершує роботу та перезавантажується, зміни в файловій системі втрачаються. Для більш стійкого зберігання, яке не залежить від контейнера, ви можете використовувати [том](/docs/concepts/storage/volumes/). Це особливо важливо для застосунків, що зберігають стан, таких як бази даних і сховища ключ-значення (наприклад, Redis).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Налаштування тому для Podʼа

У цьому завданні ви створюєте Pod, який запускає один контейнер. У цьому Podʼі є том типу [emptyDir](/docs/concepts/storage/volumes/#emptydir), який існує протягом усього життєвого циклу Podʼа, навіть якщо контейнер завершиться та перезапуститься. Ось конфігураційний файл для Podʼа:

{{% code_sample file="pods/storage/redis.yaml" %}}

1. Створіть Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
   ```

1. Перевірте, що контейнер Podʼа працює, а потім спостерігайте за змінами в Podʼі:

   ```shell
   kubectl get pod redis --watch
   ```

   Вивід буде подібний до цього:

   ```console
   NAME      READY     STATUS    RESTARTS   AGE
   redis     1/1       Running   0          13s
   ```

1. В іншому терміналі отримайте доступ до оболонки запущеного контейнера:

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

1. У вашій оболонці перейдіть до `/data/redis`, а потім створіть файл:

   ```shell
   root@redis:/data# cd /data/redis/
   root@redis:/data/redis# echo Hello > test-file
   ```

1. У вашій оболонці виведіть список запущених процесів:

   ```shell
   root@redis:/data/redis# apt-get update
   root@redis:/data/redis# apt-get install procps
   root@redis:/data/redis# ps aux
   ```

   Вивід буде схожий на це:

   ```console
   USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
   redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
   root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
   root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
   ```

1. У вашій оболонці завершіть процес Redis:

   ```shell
   root@redis:/data/redis# kill <pid>
   ```

   де `<pid>` — це ідентифікатор процесу Redis (PID).

1. У вашому початковому терміналі спостерігайте за змінами в Podʼі Redis. В кінцевому результаті ви побачите щось подібне:

   ```console
   NAME      READY     STATUS     RESTARTS   AGE
   redis     1/1       Running    0          13s
   redis     0/1       Completed  0         6m
   redis     1/1       Running    1         6m
   ```

На цьому етапі контейнер завершився та перезапустився. Це тому, що Pod Redis має [restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) `Always`.

1. Отримайте доступ до оболонки в перезапущеному контейнері:

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

1. У вашій оболонці перейдіть до `/data/redis` та перевірте, що `test-file` все ще там.

   ```shell
   root@redis:/data/redis# cd /data/redis/
   root@redis:/data/redis# ls
   test-file
   ```

1. Видаліть Pod, який ви створили для цього завдання:

   ```shell
   kubectl delete pod redis
   ```

## {{% heading "whatsnext" %}}

- Дивіться [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

- Дивіться [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

- Крім локального сховища на диску, яке надає `emptyDir`, Kubernetes підтримує багато різних рішень для мережевого сховища, включаючи PD на GCE та EBS на EC2, які бажані для критичних даних та будуть обробляти деталі, такі як монтування та розмонтування пристроїв на вузлах. Дивіться [Volumes](/docs/concepts/storage/volumes/) для отримання додаткової інформації.
