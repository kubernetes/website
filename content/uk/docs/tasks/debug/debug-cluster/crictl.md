---
title: Налагодження вузлів Kubernetes за допомогою crictl
content_type: task
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

`crictl` — це інтерфейс командного рядка для середовищ виконання контейнерів, сумісних з CRI. За його допомогою можна оглядати й налагоджувати середовища виконання контейнерів і застосунки на вузлі Kubernetes. `crictl` і його вихідний код розміщено в репозиторії [cri-tools](https://github.com/kubernetes-sigs/cri-tools).

## {{% heading "prerequisites" %}} {#before-you-begin}

Для роботи `crictl` потрібна операційна система Linux із середовищем виконання CRI.

<!-- steps -->

## Встановлення crictl {#installing-crictl}

Стиснений архів `crictl` для кількох різних архітектур можна завантажити зі [сторінки релізів](https://github.com/kubernetes-sigs/cri-tools/releases) cri-tools. Завантажте версію, яка відповідає вашій версії Kubernetes. Розпакуйте архів і перемістіть `crictl` у теку з вашого системного шляху, наприклад `/usr/local/bin/`.

## Загальне використання {#general-usage}

Команда `crictl` має кілька підкоманд і прапорців середовища виконання. Докладніше дивіться `crictl help` або `crictl <subcommand> help`.

Точку доступу для `crictl` можна встановити одним із таких способів:

* Встановіть прапорці `--runtime-endpoint` та `--image-endpoint`.
* Встановіть змінні середовища `CONTAINER_RUNTIME_ENDPOINT` та `IMAGE_SERVICE_ENDPOINT`.
* Встановіть точку доступу у файлі конфігурації `/etc/crictl.yaml`. Щоб вказати інший файл, використовуйте прапорець `--config=PATH_TO_FILE` під час запуску `crictl`.

{{<note>}}
Якщо ви не встановите точку доступу, `crictl` намагатиметься підʼєднатися до відомих точок доступу зі списку, що може вплинути на продуктивність.
{{</note>}}

Також можна вказати тайм-аут підʼєднання до сервера й увімкнути або вимкнути налагодження, задавши значення `timeout` або `debug` у файлі конфігурації або використавши прапорці командного рядка `--timeout` і `--debug`.

Щоб переглянути або змінити поточну конфігурацію, перегляньте або відредагуйте вміст `/etc/crictl.yaml`. Наприклад, з середовищем виконання контейнерів `containerd` конфігурація буде схожа на таку:

```
runtime-endpoint: unix:///var/run/containerd/containerd.sock
image-endpoint: unix:///var/run/containerd/containerd.sock
timeout: 10
debug: true
```

Щоб дізнатися більше про `crictl`, зверніться до [документації `crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md).

## Приклади команд crictl {#example-crictl-commands}

Наведені нижче приклади показують деякі команди `crictl` і приклади їхнього виводу.

### Отримання переліку Podʼів {#list-pods}

Вивести всі Podʼи:

```shell
crictl pods
```

Вивід подібний до такого:

```
POD ID              CREATED              STATE               NAME                         NAMESPACE           ATTEMPT
926f1b5a1d33a       About a minute ago   Ready               sh-84d7dcf559-4r2gq          default             0
4dccb216c4adb       About a minute ago   Ready               nginx-65899c769f-wv2gp       default             0
a86316e96fa89       17 hours ago         Ready               kube-proxy-gblk4             kube-system         0
919630b8f81f1       17 hours ago         Ready               nvidia-device-plugin-zgbbv   kube-system         0
```

Вивести Podʼи за назвою:

```shell
crictl pods --name nginx-65899c769f-wv2gp
```

Вивід подібний до такого:

```
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

Вивести Podʼи за міткою:

```shell
crictl pods --label run=nginx
```

Вивід подібний до такого:

```
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

### Отримання переліку образів {#list-images}

Вивести всі образи:

```shell
crictl images
```

Вивід подібний до такого:

```
IMAGE                                     TAG                 IMAGE ID            SIZE
busybox                                   latest              8c811b4aec35f       1.15MB
k8s-gcrio.azureedge.net/hyperkube-amd64   v1.10.3             e179bbfe5d238       665MB
k8s-gcrio.azureedge.net/pause-amd64       3.1                 da86e6ba6ca19       742kB
nginx                                     latest              cd5239a0906a6       109MB
```

Вивести образи за репозиторієм:

```shell
crictl images nginx
```

Вивід подібний до такого:

```
IMAGE               TAG                 IMAGE ID            SIZE
nginx               latest              cd5239a0906a6       109MB
```

Вивести лише ідентифікатори образів:

```shell
crictl images -q
```

Вивід подібний до такого:

```
sha256:8c811b4aec35f259572d0f79207bc0678df4c736eeec50bc9fec37ed936a472a
sha256:e179bbfe5d238de6069f3b03fccbecc3fb4f2019af741bfff1233c4d7b2970c5
sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e
sha256:cd5239a0906a6ccf0562354852fae04bc5b52d72a2aff9a871ddb6bd57553569
```

### Отримання переліку контейнерів {#list-containers}

Вивести всі контейнери:

```shell
crictl ps -a
```

Вивід подібний до такого:

```
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   7 minutes ago       Running             sh                         1
9c5951df22c78       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   8 minutes ago       Exited              sh                         0
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     8 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   18 hours ago        Running             kube-proxy                 0
```

Вивести запущені контейнери:

```shell
crictl ps
```

Вивід подібний до такого:

```
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   6 minutes ago       Running             sh                         1
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     7 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   17 hours ago        Running             kube-proxy                 0
```

### Виконання команди в запущеному контейнері {#execute-a-command-in-a-running-container}

```shell
crictl exec -i -t 1f73f2d81bf98 ls
```

Вивід подібний до такого:

```
bin   dev   etc   home  proc  root  sys   tmp   usr   var
```

### Отримання логів контейнера {#get-a-container-s-logs}

Отримати всі логи контейнера:

```shell
crictl logs 87d3992f84f74
```

Вивід подібний до такого:

```
10.240.0.96 - - [06/Jun/2018:02:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

Отримати лише останні `N` рядків логів:

```shell
crictl logs --tail=1 87d3992f84f74
```

Вивід подібний до такого:

```
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

## {{% heading "whatsnext" %}} {#what-s-next}

* [Дізнайтеся більше про `crictl`](https://github.com/kubernetes-sigs/cri-tools).
