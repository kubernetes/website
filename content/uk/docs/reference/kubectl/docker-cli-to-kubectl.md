---
title: kubectl для користувачів Docker
content_type: concept
weight: 50
---

<!-- overview -->

Ви можете використовувати інструмент командного рядка Kubernetes `kubectl` для взаємодії з сервером API. Використання kubectl є простим, якщо ви знайомі з інструментом командного рядка Docker. Однак, існує декілька відмінностей між командами Docker і командами kubectl. У наступних розділах показано субкоманду Docker та опис еквівалентної команди `kubectl`.

<!-- body -->

## docker run

Щоб запустити Deployment nginx і експонувати Deployment, див. [kubectl create deployment](/docs/reference/generated/kubectl/kubectl-commands#-em-deployment-em-).

docker:

```shell
docker run -d --restart=always -e DOMAIN=cluster --name nginx-app -p 80:80 nginx
```

```output
55c103fa129692154a7652490236fee9be47d70a8dd562281ae7d2f9a339a6db
```

```shell
docker ps
```

```output
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   9 seconds ago       Up 9 seconds        0.0.0.0:80->80/tcp   nginx-app
```

kubectl:

```shell
# запуск pod з nginx
kubectl create deployment --image=nginx nginx-app
```

```output
deployment.apps/nginx-app created
```

```shell
# додати env до nginx-app
kubectl set env deployment/nginx-app  DOMAIN=cluster
```

```output
deployment.apps/nginx-app env updated
```

{{< note >}}
Команди `kubectl` виводять тип і назву створеного або зміненого ресурсу, які потім можна використовувати у наступних командах. Ви можете експонувати новий Service після створення Deployment.
{{< /note >}}

```shell
# експонування порта через service
kubectl expose deployment nginx-app --port=80 --name=nginx-http
```

```output
service "nginx-http" exposed
```

За допомогою kubectl ви можете створити [Deployment](/docs/concepts/workloads/controllers/deployment/), щоб переконатися, що N Podʼів працюють під управлінням nginx, де N — це кількість реплік, вказана у специфікації, типово дорівнює 1. Ви також можете створити [Service](/docs/concepts/services-networking/service/) з селектором, який відповідає міткам Podʼів. Докладні відомості наведено у статті [Використання Service для доступу до застосунку у кластері](/docs/tasks/access-application-cluster/service-access-application-cluster).

Стандартно образи запускаються у фоновому режимі, подібно до `docker run -d ...`. Щоб запустити щось на передньому плані, скористайтеся [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) для створення Pod:

```shell
kubectl run [-i] [--tty] --attach <name> --image=<image>
```

На відміну від `docker run ...`, якщо ви вкажете `--attach`, то приєднаєте `stdin`, `stdout` і `stderr`. Ви не можете контролювати, які саме потоки буде приєднано (`docker -a ...`). Щоб відʼєднатися від контейнера, ви можете використатись комбінацією клавіш Ctrl+P, а потім Ctrl+Q.

## docker ps

Для виводу переліку того, що працює, скористайтеся командою [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get):

docker:

```shell
docker ps -a
```

```output
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS                     PORTS                NAMES
14636241935f        ubuntu:16.04        "echo test"              5 seconds ago        Exited (0) 5 seconds ago                        cocky_fermi
55c103fa1296        nginx               "nginx -g 'daemon of…"   About a minute ago   Up About a minute          0.0.0.0:80->80/tcp   nginx-app
```

kubectl:

```shell
kubectl get po
```

```output
NAME                        READY     STATUS      RESTARTS   AGE
nginx-app-8df569cb7-4gd89   1/1       Running     0          3m
ubuntu                      0/1       Completed   0          20s
```

## docker attach

Щоб приєднати процес, який вже запущено у контейнері, див. [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands/#attach).

docker:

```shell
docker ps
```

```output
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   5 minutes ago       Up 5 minutes        0.0.0.0:80->80/tcp   nginx-app
```

```shell
docker attach 55c103fa1296
...
```

kubectl:

```shell
kubectl get pods
```

```output
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m
```

```shell
kubectl attach -it nginx-app-5jyvm
...
```

Щоб відʼєднатися від контейнера, ви можете скористатись комбінацією клавіш Ctrl+P, а потім Ctrl+Q.

## docker exec

Щоб виконати команду у контейнері, див. [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec).

docker:

```shell
docker ps
```

```output
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   6 minutes ago       Up 6 minutes        0.0.0.0:80->80/tcp   nginx-app
```

```shell
docker exec 55c103fa1296 cat /etc/hostname
```

```output
55c103fa1296
```

kubectl:

```shell
kubectl get po
```

```output
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m
```

```shell
kubectl exec nginx-app-5jyvm -- cat /etc/hostname
```

```output
nginx-app-5jyvm
```

Використання інтерактивних команд.

docker:

```shell
docker exec -ti 55c103fa1296 /bin/sh
# exit
```

kubectl:

```shell
kubectl exec -ti nginx-app-5jyvm -- /bin/sh
# exit
```

Докладнішу інформацію наведено у статті [Отримання доступу до оболонки запущеного контейнера](/docs/tasks/debug/debug-application/get-shell-running-container/).

## docker logs

Щоб переглянути stdout/stderr запущеного процесу, див. [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs).


docker:

```shell
docker logs -f a9e
```

```output
192.168.9.1 - - [14/Jul/2015:01:04:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
192.168.9.1 - - [14/Jul/2015:01:04:03 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
```

kubectl:

```shell
kubectl logs -f nginx-app-zibvs
```

```output
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

Існує невелика різниця між Podʼами та контейнерами; стандартно Podʼи не завершують роботу, якщо їхні процеси завершуються. Замість цього вони перезапускають процес. Це схоже на параметр запуску docker `--restart=always` з однією суттєвою відмінністю. У docker вивід для кожного виклику процесу обʼєднується, а у Kubernetes кожен виклик є окремим. Щоб переглянути результати попереднього запуску у Kubernetes, зробіть так:

```shell
kubectl logs --previous nginx-app-zibvs
```

```output
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

Для отримання додаткової інформації див. [Архітектура логування](/docs/concepts/cluster-administration/logging/).

## docker stop та docker rm {#docker-stop-and-docker-rm}

Щоб зупинити і видалити запущений процес, див. [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete).

docker:

```shell
docker ps
```

```output
CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS              PORTS                         NAMES
a9ec34d98787        nginx               "nginx -g 'daemon of"  22 hours ago        Up 22 hours         0.0.0.0:80->80/tcp, 443/tcp   nginx-app
```

```shell
docker stop a9ec34d98787
```

```output
a9ec34d98787
```

```shell
docker rm a9ec34d98787
```

```output
a9ec34d98787
```

kubectl:

```shell
kubectl get deployment nginx-app
```

```output
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
nginx-app    1/1     1            1           2m
```

```shell
kubectl get po -l app=nginx-app
```

```output
NAME                         READY     STATUS    RESTARTS   AGE
nginx-app-2883164633-aklf7   1/1       Running   0          2m
```

```shell
kubectl delete deployment nginx-app
```

```output
deployment "nginx-app" deleted
```

```shell
kubectl get po -l app=nginx-app
# Нічого не повертає
```

{{< note >}}
Якщо ви використовуєте kubectl, ви не можете видалити безпосередньо сам pod. Спочатку слід вилучити Deployment, якому належить цей pod. Якщо ви видалите безпосередньо сам Pod, то у Deployment буде перестворено цей Pod.
{{< /note >}}

## docker login

У kubectl немає прямого аналога `docker login`. Якщо вас цікавить використання Kubernetes з приватним реєстром, див. [Використання приватного реєстру](/docs/concepts/containers/images/#using-a-private-registry).

## docker version

Щоб отримати версії клієнта і сервера, див. [kubectl version](/docs/reference/generated/kubectl/kubectl-commands/#version).

docker:

```shell
docker version
```

```output
Client version: 1.7.0
Client API version: 1.19
Go version (client): go1.4.2
Git commit (client): 0baf609
OS/Arch (client): linux/amd64
Server version: 1.7.0
Server API version: 1.19
Go version (server): go1.4.2
Git commit (server): 0baf609
OS/Arch (server): linux/amd64
```

kubectl:

```shell
kubectl version
```

```output
Client Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
```

## docker info

Для отримання різноманітної інформації про середовище та конфігурацію див. [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands/#cluster-info).

docker:

```shell
docker info
```

```output
Containers: 40
Images: 168
Storage Driver: aufs
 Root Dir: /usr/local/google/docker/aufs
 Backing Filesystem: extfs
 Dirs: 248
 Dirperm1 Supported: false
Execution Driver: native-0.2
Logging Driver: json-file
Kernel Version: 3.13.0-53-generic
Operating System: Ubuntu 14.04.2 LTS
CPUs: 12
Total Memory: 31.32 GiB
Name: k8s-is-fun.mtv.corp.google.com
ID: ADUV:GCYR:B3VJ:HMPO:LNPQ:KD5S:YKFQ:76VN:IANZ:7TFV:ZBF4:BYJO
WARNING: No swap limit support
```

kubectl:

```shell
kubectl cluster-info
```

```output
Kubernetes master is running at https://203.0.113.141
KubeDNS is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/kube-dns/proxy
kubernetes-dashboard is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy
Grafana is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
Heapster is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
InfluxDB is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```
