---
title: Налагодження вузлів Kubernetes за допомогою crictl
content_type: task
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

`crictl` — це інтерфейс командного рядка для сумісних з CRI контейнерних середовищ. Ви можете використовувати його для огляду та налагодження контейнерних середовищ та застосунків на вузлі Kubernetes. `crictl` та його вихідний код розміщені у репозиторії [cri-tools](https://github.com/kubernetes-sigs/cri-tools).

## {{% heading "prerequisites" %}}

Для роботи `crictl` потрібна операційна система Linux з CRI середовищем.

<!-- steps -->

## Встановлення crictl {#installing-crictl}

Ви можете завантажити архів `crictl` зі сторінки релізів у репозиторії cri-tools [release page](https://github.com/kubernetes-sigs/cri-tools/releases), для різних архітектур. Завантажте версію, яка відповідає вашій версії Kubernetes. Розпакуйте її та перемістіть у розташування у вашому системному шляху, наприклад, `/usr/local/bin/`.

## Використання {#general-usage}

Команда `crictl` має кілька підкоманд та прапорців для використання. Використовуйте `crictl help` або `crictl <підкоманда> help` для отримання більш детальної інформації.

Ви можете встановити точку доступу для `crictl`, виконавши одну з наступних дій:

* Встановіть прапорці `--runtime-endpoint` та `--image-endpoint`.
* Встановіть змінні середовища `CONTAINER_RUNTIME_ENDPOINT` та `IMAGE_SERVICE_ENDPOINT`.
* Встановіть точку доступу в файлі конфігурації `/etc/crictl.yaml`. Щоб вказати інший файл, використовуйте прапорець `--config=ШЛЯХ_ДО_ФАЙЛУ` під час запуску `crictl`.

{{<note>}}
Якщо ви не встановите точку доступу, `crictl` спробує приєднатися до списку відомих точок доступу, що може вплинути на продуктивність.
{{</note>}}

Ви також можете вказати значення тайм-ауту при підключенні до сервера та увімкнути або вимкнути налагодження, вказавши значення `timeout` або `debug` в файлі конфігурації або використовуючи прапорці командного рядка `--timeout` та `--debug`.

Щоб переглянути або змінити поточну конфігурацію, перегляньте або відредагуйте вміст `/etc/crictl.yaml`. Наприклад, конфігурація при використанні виконавчого середовища `containerd` буде схожа на цю:

```none
runtime-endpoint: unix:///var/run/containerd/containerd.sock
image-endpoint: unix:///var/run/containerd/containerd.sock
timeout: 10
debug: true
```

Щоб дізнатися більше про `crictl`, зверніться до [документації `crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md).

## Приклади команд crictl {#example-crictl-commands}

Нижче наведено деякі приклади команд `crictl` та їх вивід.

### Отримання переліку Podʼів {#list-pods}

Вивести перелік усіх Podʼів:

```shell
crictl pods
```

Вихідний результат схожий на такий:

```none
POD ID              CREATED              STATE               NAME                         NAMESPACE           ATTEMPT
926f1b5a1d33a       About a minute ago   Ready               sh-84d7dcf559-4r2gq          default             0
4dccb216c4adb       About a minute ago   Ready               nginx-65899c769f-wv2gp       default             0
a86316e96fa89       17 hours ago         Ready               kube-proxy-gblk4             kube-system         0
919630b8f81f1       17 hours ago         Ready               nvidia-device-plugin-zgbbv   kube-system         0
```

Список Podʼів за назвою:

```shell
crictl pods --name nginx-65899c769f-wv2gp
```

Вихідний результат схожий на такий:

```none
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

Список Podʼів за мітками:

```shell
crictl pods --label run=nginx
```

Вихідний результат схожий на такий:

```none
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

### Отримання переліку образів {#list-images}

Вивести всі образи:

```shell
crictl images
```

Вихідний результат схожий на такий:

```none
IMAGE                                     TAG                 IMAGE ID            SIZE
busybox                                   latest              8c811b4aec35f       1.15MB
k8s.gcr.io/hyperkube-amd64                v1.10.3             e179bbfe5d238       665MB
k8s.gcr.io/pause                          3.1                 da86e6ba6ca19       742kB
nginx                                     latest              cd5239a0906a6       109MB
```

Список образів за репозиторієм:

```shell
crictl images nginx
```

Вихідний результат схожий на такий:

```none
IMAGE               TAG                 IMAGE ID            SIZE
nginx               latest              cd5239a0906a6       109MB
```

Вивести лише ідентифікатори образів:

```shell
crictl images -q
```

Вихідний результат схожий на такий:

```none
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

Вихідний результат схожий на такий:

```none
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   7 хвилин тому       Running             sh                         1
9c5951df22c78       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   8 хвилин тому       Exited              sh                         0
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     8 хвилин тому       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   18 годин тому        Running             kube-proxy                 0
```

Вивести працюючі контейнери:

```shell
crictl ps
```

Вихідний результат схожий на такий:

```none
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   6 хвилин тому       Running             sh                         1
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     7 хвилин тому       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   17 годин тому        Running             kube-proxy                 0
```

### Виконання команди у працюючому контейнері {#execute-a-command-in-a-running-container}

```shell
crictl exec -i -t 1f73f2d81bf98 ls
```

Вихідний результат схожий на такий:

```none
bin   dev   etc   home  proc  root  sys   tmp   usr   var
```

### Отримання логів контейнерів {#get-a-container-s-logs}

Отримати всі логи контейнера:

```shell
crictl logs 87d3992f84f74
```

Вихідний результат схожий на такий:

```none
10.240.0.96 - - [06/Jun/2018:02:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

Отримати лише останні `N` рядків логів:

```shell
crictl logs --tail=1 87d3992f84f74
```

Вихідний результат схожий на такий:

```none
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

## {{% heading "whatsnext" %}}

* [Дізнайтеся більше про `crictl`](https://github.com/kubernetes-sigs/cri-tools).
