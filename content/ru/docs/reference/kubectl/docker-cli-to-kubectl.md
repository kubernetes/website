---
title: kubectl для пользователей Docker
content_type: concept
---

<!-- overview -->
Вы можете использовать инструмент командной строки kubectl в Kubernetes для работы с API-сервером. Если вы знакомы с инструментом командной строки Docker, то использование kubectl не составит проблем. Однако команды docker и kubectl отличаются. В следующих разделах показана подкоманда docker и приведена эквивалентная команда в kubectl.


<!-- body -->

## docker run

Для развёртывания nginx и открытия доступа к объекту Deployment используйте команду [kubectl run](/docs/reference/generated/kubectl/kubectl-commands/#run).

docker:

```shell
docker run -d --restart=always -e DOMAIN=cluster --name nginx-app -p 80:80 nginx
```
```
55c103fa129692154a7652490236fee9be47d70a8dd562281ae7d2f9a339a6db
```

```shell
docker ps
```
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   9 seconds ago       Up 9 seconds        0.0.0.0:80->80/tcp   nginx-app
```

kubectl:

```shell
# запустить под, в котором работает nginx
kubectl create deployment --image=nginx nginx-app
```
```
deployment "nginx-app" created
```

```shell
# add env to nginx-app
kubectl set env deployment/nginx-app  DOMAIN=cluster
```
```
deployment.apps/nginx-app env updated
```

{{< note >}}
Команды `kubectl` выводят тип и имя созданного или измененного ресурса, который затем может быть использован в последующих командах. После создания объекта Deployment можно открыть новый сервис Service.
{{< /note >}}

```shell
# открыть порт, чтобы иметь доступ к сервису
kubectl expose deployment nginx-app --port=80 --name=nginx-http
```
```
service "nginx-http" exposed
```

С помощью kubectl можно создать объект [Deployment](/docs/concepts/workloads/controllers/deployment/), чтобы убедиться, что N подов, запущены под nginx, где N — это количество реплик, указанных в спецификации (по умолчанию — 1).
Вы также можете создать [сервис](/docs/concepts/services-networking/service/) с селектором, соответствующим меткам подов. Для получения дополнительной информации перейдите на страницу [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster).

По умолчанию образы запускаются в фоновом режиме, аналогично команде `docker run -d ...`. Для запуска в центральном (интерактивном) режиме используйте команду ниже:

```shell
kubectl run [-i] [--tty] --attach <name> --image=<image>
```

В отличие от `docker run ...`, если вы укажете `--attach`, то присоедините `stdin`, `stdout` and `stderr`. Нельзя проконтролировать, какие потоки прикрепляются (`docker -a ...`).
Чтобы отсоединиться от контейнера воспользуетесь комбинацией клавиш Ctrl+P, а затем Ctrl+Q.

Так как команда kubectl run запускает развёртывание для контейнера, то оно начнет перезапускаться, если завершить прикрепленный процесс по нажатию Ctrl+C, в отличие от команды `docker run -it`.
Для удаления объекта Deployment вместе с подами, необходимо выполнить команду `kubectl delete deployment <name>`.

## docker ps

Посмотреть, что сейчас запущено можно с помощью команды [kubectl get](/docs/reference/generated/kubectl/kubectl-commands/#get).

docker:

```shell
docker ps -a
```
```
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS                     PORTS                NAMES
14636241935f        ubuntu:16.04        "echo test"              5 seconds ago        Exited (0) 5 seconds ago                        cocky_fermi
55c103fa1296        nginx               "nginx -g 'daemon of…"   About a minute ago   Up About a minute          0.0.0.0:80->80/tcp   nginx-app
```

kubectl:

```shell
kubectl get po
```
```
NAME                        READY     STATUS      RESTARTS   AGE
nginx-app-8df569cb7-4gd89   1/1       Running     0          3m
ubuntu                      0/1       Completed   0          20s
```

## docker attach

Чтобы присоединить процесс, который уже запущен в контейнере, используйте команду [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands/#attach).

docker:

```shell
docker ps
```
```
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
```
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m
```

```shell
kubectl attach -it nginx-app-5jyvm
...
```

Для отсоединения его от контейнера используйте сочетания клавиш Ctrl+P и Ctrl+Q.

## docker exec

Для выполнения команды в контейнере используйте команду [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec).

docker:

```shell
docker ps
```
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   6 minutes ago       Up 6 minutes        0.0.0.0:80->80/tcp   nginx-app
```
```shell
docker exec 55c103fa1296 cat /etc/hostname
```
```
55c103fa1296
```

kubectl:

```shell
kubectl get po
```
```
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m
```

```shell
kubectl exec nginx-app-5jyvm -- cat /etc/hostname
```
```
nginx-app-5jyvm
```

Примеры с командной оболочкой


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

Для получения дополнительной информации обратитесь к странице [Get a Shell to a Running Container](/docs/tasks/debug-application-cluster/get-shell-running-container/).

## docker logs

Для отслеживания логов в потоки stdout/stderr запущенного процесса используйте команду [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs).

docker:

```shell
docker logs -f a9e
```
```
192.168.9.1 - - [14/Jul/2015:01:04:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
192.168.9.1 - - [14/Jul/2015:01:04:03 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
```

kubectl:

```shell
kubectl logs -f nginx-app-zibvs
```
```
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

Есть небольшая разница между подами и контейнерами: по умолчанию поды не прекращают выполнение, если их процессы завершаются. Вместо этого поды перезапускают процесс. Это похоже на опцию `--restart=always` в Docker, только с одной большой разницей. В Docker вывод каждого вызова процесса объединяется, в отличие от Kubernetes, где каждый вызов является отдельным. Для просмотра вывода предыдущего запуска в Kubernetes, используйте команду ниже:

```shell
kubectl logs --previous nginx-app-zibvs
```
```
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

Для получения дополнительной информации обратитесь к странице [Logging Architecture](/docs/concepts/cluster-administration/logging/).

## docker stop и docker rm

Для завершения и удаления запущенного процесса используйте команду [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete).

docker:

```shell
docker ps
```
```
CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS              PORTS                         NAMES
a9ec34d98787        nginx               "nginx -g 'daemon of"  22 hours ago        Up 22 hours         0.0.0.0:80->80/tcp, 443/tcp   nginx-app
```

```shell
docker stop a9ec34d98787
```
```
a9ec34d98787
```

```shell
docker rm a9ec34d98787
```
```
a9ec34d98787
```

kubectl:

```shell
kubectl get deployment nginx-app
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
nginx-app    1/1     1            1           2m
```

```shell
kubectl get po -l app=nginx-app
```
```
NAME                         READY     STATUS    RESTARTS   AGE
nginx-app-2883164633-aklf7   1/1       Running   0          2m
```
```shell
kubectl delete deployment nginx-app
```
```
deployment "nginx-app" deleted
```

```shell
kubectl get po -l app=nginx-app
# Return nothing
```

{{< note >}}
При использовании kubectl удалить под напрямую не получится. Для этого сначала нужно удалить объект Deployment, которому принадлежит под. Если вы удалите под напрямую, то объект Deployment пересоздаст под.
{{< /note >}}

## docker login

В kubectl нет прямого аналога команды `docker login`. Если вы планируете использовать Kubernetes с приватным реестром, изучите страницу [Using a Private Registry](/docs/concepts/containers/images/#using-a-private-registry).

## docker version

Для получения версии клиента и сервера используйте команду [kubectl version](/docs/reference/generated/kubectl/kubectl-commands/#version).

docker:

```shell
docker version
```
```
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
```
Client Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
```

## docker info

Для получения разной информации про окружение и конфигурации перейдите в раздел [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands/#cluster-info).

docker:

```shell
docker info
```
```
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
```
Kubernetes master is running at https://203.0.113.141
KubeDNS is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/kube-dns/proxy
kubernetes-dashboard is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy
Grafana is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
Heapster is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
InfluxDB is running at https://203.0.113.141/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```

