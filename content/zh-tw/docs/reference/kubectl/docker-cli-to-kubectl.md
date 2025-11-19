---
title: 適用於 Docker 使用者的 kubectl
content_type: concept
weight: 50
---
<!--
title: kubectl for Docker Users
content_type: concept
reviewers:
- brendandburns
- thockin
weight: 50
-->

<!-- overview -->
<!--
You can use the Kubernetes command line tool `kubectl` to interact with the API Server. Using kubectl is straightforward if you are familiar with the Docker command line tool. However, there are a few differences between the Docker commands and the kubectl commands. The following sections show a Docker sub-command and describe the equivalent `kubectl` command.
-->
你可以使用 Kubernetes 命令列工具 `kubectl` 與 API 伺服器進行交互。如果你熟悉 Docker 命令列工具，
則使用 kubectl 非常簡單。但是，Docker 命令和 kubectl 命令之間有一些區別。以下顯示了 Docker 子命令，
並描述了等效的 `kubectl` 命令。

<!-- body -->
## docker run

<!--
To run an nginx Deployment and expose the Deployment, see [kubectl create deployment](/docs/reference/generated/kubectl/kubectl-commands#-em-deployment-em-).
-->
要運行 nginx 部署並將其暴露，請參見 [kubectl create deployment](/docs/reference/generated/kubectl/kubectl-commands#-em-deployment-em-)

<!--
docker:
-->
使用 docker 命令：

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

<!--
kubectl:
-->
使用 kubectl 命令：

<!--
```shell
# start the pod running nginx
kubectl run --image=nginx nginx-app --port=80 --env="DOMAIN=cluster"
```
-->
```shell
# 啓動運行 nginx 的 Pod
kubectl create deployment --image=nginx nginx-app
```
```
deployment.apps/nginx-app created
```

```shell
# 添加 env 到 nginx-app
kubectl set env deployment/nginx-app  DOMAIN=cluster
```
```
deployment.apps/nginx-app env updated
```

{{< note >}}
<!--
`kubectl` commands print the type and name of the resource created or mutated, which can then be used in subsequent commands. You can expose a new Service after a Deployment is created.
-->
`kubectl` 命令打印創建或突變資源的類型和名稱，然後可以在後續命令中使用。部署後，你可以公開新的 Service。
{{< /note >}}

<!--
```shell
# expose a port through with a service
kubectl expose deployment nginx-app --port=80 --name=nginx-http
```
-->
```shell
# 通過 Service 公開端口
kubectl expose deployment nginx-app --port=80 --name=nginx-http
```
```
service "nginx-http" exposed
```

<!--
By using kubectl, you can create a [Deployment](/docs/concepts/workloads/controllers/deployment/) to ensure that N pods are running nginx, where N is the number of replicas stated in the spec and defaults to 1. You can also create a [service](/docs/concepts/services-networking/service/) with a selector that matches the pod labels. For more information, see [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster).
-->
在 kubectl 命令中，我們創建了一個 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)，
這將保證有 N 個運行 nginx 的 Pod（N 代表 spec 中聲明的副本數，默認爲 1）。
我們還創建了一個 [Service](/zh-cn/docs/concepts/services-networking/service/)，其選擇算符與容器標籤匹配。
查看[使用 Service 訪問叢集中的應用程序](/zh-cn/docs/tasks/access-application-cluster/service-access-application-cluster)獲取更多信息。

<!--
By default images run in the background, similar to `docker run -d ...`. To run things in the foreground, use [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) to create pod:
-->
默認情況下映像檔會在後臺運行，與 `docker run -d ...` 類似，如果你想在前臺運行，
使用 [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) 在前臺運行 Pod：

```shell
kubectl run [-i] [--tty] --attach <name> --image=<image>
```

<!--
Unlike `docker run ...`, if you specify `--attach`, then you attach `stdin`, `stdout` and `stderr`. You cannot control which streams are attached (`docker -a ...`).
To detach from the container, you can type the escape sequence Ctrl+P followed by Ctrl+Q.
-->
與 `docker run ...` 不同的是，如果指定了 `--attach`，我們將連接到 `stdin`、`stdout` 和 `stderr`，
而不能控制具體連接到哪個輸出流（`docker -a ...`）。要從容器中退出，可以輸入 Ctrl + P，然後按 Ctrl + Q。

<!--
Because the kubectl run command starts a Deployment for the container, the Deployment restarts if you terminate the attached process by using Ctrl+C, unlike `docker run -it`.
To destroy the Deployment and its pods you need to run `kubectl delete deployment <name>`.
-->
因爲我們使用 Deployment 啓動了容器，如果你終止連接到的進程（例如 `ctrl-c`），容器將會重啓，
這跟 `docker run -it` 不同。如果想銷燬該 Deployment（和它的 Pod），
你需要運行 `kubectl delete deployment <name>`。

## docker ps

<!--
To list what is currently running, see [kubectl get](/docs/reference/generated/kubectl/kubectl-commands/#get).
-->
如何列出哪些正在運行？查看 [kubectl get](/docs/reference/generated/kubectl/kubectl-commands/#get)。

<!--
docker:
-->
使用 docker 命令：

```shell
docker ps -a
```
```
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS                     PORTS                NAMES
14636241935f        ubuntu:16.04        "echo test"              5 seconds ago        Exited (0) 5 seconds ago                        cocky_fermi
55c103fa1296        nginx               "nginx -g 'daemon of…"   About a minute ago   Up About a minute          0.0.0.0:80->80/tcp   nginx-app
```

<!--
kubectl:
-->
使用 kubectl 命令：

```shell
kubectl get po
```
```
NAME                        READY     STATUS      RESTARTS   AGE
nginx-app-8df569cb7-4gd89   1/1       Running     0          3m
ubuntu                      0/1       Completed   0          20s
```

## docker attach

<!--
To attach a process that is already running in a container, see [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands/#attach).
-->
如何連接到已經運行在容器中的進程？
查看 [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands/#attach)。

<!--
docker:
-->
使用 docker 命令：

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

<!--
kubectl:
-->
使用 kubectl 命令：

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

<!--
To detach from the container, you can type the escape sequence Ctrl+P followed by Ctrl+Q.
-->
要從容器中分離，可以輸入 Ctrl + P，然後按 Ctrl + Q。

## docker exec

<!--
To execute a command in a container, see [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec).
-->
如何在容器中執行命令？查看 [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)。

<!--
docker:
-->
使用 docker 命令：

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

<!--
kubectl:
-->
使用 kubectl 命令：

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

<!--
To use interactive commands.
-->
執行交互式命令怎麼辦？

<!--
docker:
-->
使用 docker 命令：

```shell
docker exec -ti 55c103fa1296 /bin/sh
# exit
```

<!--
kubectl:
-->
使用 kubectl 命令：

```shell
kubectl exec -ti nginx-app-5jyvm -- /bin/sh
# exit
```

<!--
For more information, see [Get a Shell to a Running Container](/docs/tasks/debug/debug-application/get-shell-running-container/).
-->
更多信息請查看[獲取運行中容器的 Shell 環境](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)。

## docker logs

<!--
To follow stdout/stderr of a process that is running, see [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs).
-->
如何查看運行中進程的 stdout/stderr？查看 [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs)。

<!--
docker:
-->
使用 docker 命令：

```shell
docker logs -f a9e
```
```
192.168.9.1 - - [14/Jul/2015:01:04:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
192.168.9.1 - - [14/Jul/2015:01:04:03 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
```

<!--
kubectl:
-->
使用 kubectl 命令：

```shell
kubectl logs -f nginx-app-zibvs
```
```
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

<!--
There is a slight difference between pods and containers; by default pods do not terminate if their processes exit. Instead the pods restart the process. This is similar to the docker run option `--restart=always` with one major difference. In docker, the output for each invocation of the process is concatenated, but for Kubernetes, each invocation is separate. To see the output from a previous run in Kubernetes, do this:
-->
現在是時候提一下 Pod 和容器之間的細微差別了；默認情況下如果 Pod 中的進程退出 Pod 也不會終止，
相反它將會重啓該進程。這類似於 `docker run` 時的 `--restart=always` 選項，這是主要差別。
在 Docker 中，進程的每個調用的輸出都是被連接起來的，但是對於 Kubernetes，每個調用都是分開的。
要查看以前在 Kubernetes 中執行的輸出，請執行以下操作：

```shell
kubectl logs --previous nginx-app-zibvs
```
```
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

<!--
For more information, see [Logging Architecture](/docs/concepts/cluster-administration/logging/).
-->
查看[日誌架構](/zh-cn/docs/concepts/cluster-administration/logging/)獲取更多信息。

<!--
## docker stop and docker rm
-->
## docker stop 和 docker rm   {#docker-stop-and-docker-rm}

<!--
To stop and delete a running process, see [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete).
-->
如何停止和刪除運行中的進程？查看 [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete)。

<!--
docker:
-->
使用 docker 命令：

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

<!--
kubectl:
-->
使用 kubectl 命令：

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
# 什麼都沒有返回
```

{{< note >}}
<!--
When you use kubectl, you don't delete the pod directly. You have to first delete the Deployment that owns the pod. If you delete the pod directly, the Deployment recreates the pod.
-->
請注意，我們不直接刪除 Pod。使用 kubectl 命令，我們要刪除擁有該 Pod 的 Deployment。
如果我們直接刪除 Pod，Deployment 將會重新創建該 Pod。
{{< /note >}}

## docker login

<!--
There is no direct analog of `docker login` in kubectl. If you are interested in using Kubernetes with a private registry, see [Using a Private Registry](/docs/concepts/containers/images/#using-a-private-registry).
-->
在 kubectl 中沒有對 `docker login` 的直接模擬。如果你有興趣在私有映像檔倉庫中使用 Kubernetes，
請參閱[使用私有映像檔倉庫](/zh-cn/docs/concepts/containers/images/#using-a-private-registry)。

## docker version

<!--
To get the version of client and server, see [kubectl version](/docs/reference/generated/kubectl/kubectl-commands/#version).
-->
如何查看客戶端和服務端的版本？查看 [kubectl version](/zh-cn/docs/reference/generated/kubectl/kubectl-commands/#version)。

<!--
docker:
-->
使用 docker 命令：

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

<!--
kubectl:
-->
使用 kubectl 命令：

```shell
kubectl version
```
```
Client Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
```

## docker info

<!--
To get miscellaneous information about the environment and configuration, see [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands/#cluster-info).
-->
如何獲取有關環境和設定的各種信息？查看 [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands/#cluster-info)。

<!--
docker:
-->
使用 docker 命令：

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

<!--
kubectl:
-->
使用 kubectl 命令：

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
