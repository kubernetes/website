---
title: 适用于 Docker 用户的 kubectl
content_type: concept
reviewers:
- brendandburns
- thockin
---
<!--
---
title: kubectl for Docker Users
content_type: concept
reviewers:
- brendandburns
- thockin
---
-->

<!-- overview -->
<!--
You can use the Kubernetes command line tool kubectl to interact with the API Server. Using kubectl is straightforward if you are familiar with the Docker command line tool. However, there are a few differences between the docker commands and the kubectl commands. The following sections show a docker sub-command and describe the equivalent kubectl command.
-->
您可以使用 Kubernetes 命令行工具 kubectl 与 API 服务器进行交互。如果您熟悉 Docker 命令行工具，则使用 kubectl 非常简单。但是，docker 命令和 kubectl 命令之间有一些区别。以下显示了 docker 子命令，并描述了等效的 kubectl 命令。


<!-- body -->
## docker run

<!--
To run an nginx Deployment and expose the Deployment, see [kubectl create deployment](/docs/reference/generated/kubectl/kubectl-commands#-em-deployment-em-).
-->
要运行 nginx 部署并将其暴露，请参见[kubectl create deployment](/docs/reference/generated/kubectl/kubectl-commands#-em-deployment-em-)
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

<!--
```shell
# start the pod running nginx
kubectl run --image=nginx nginx-app --port=80 --env="DOMAIN=cluster"
```
-->
```shell
# 启动运行 nginx 的 Pod
kubectl create deployment --image=nginx nginx-app
```
```
deployment.apps/nginx-app created
```

```shell
# add env to nginx-app
kubectl set env deployment/nginx-app  DOMAIN=cluster
```
```
deployment.apps/nginx-app env updated
```

{{< note >}}
<!--
`kubectl` commands print the type and name of the resource created or mutated, which can then be used in subsequent commands. You can expose a new Service after a Deployment is created.
-->
`kubectl` 命令打印创建或突变资源的类型和名称，然后可以在后续命令中使用。部署后，您可以公开新服务。
{{< /note >}}

<!--
```shell
# expose a port through with a service
kubectl expose deployment nginx-app --port=80 --name=nginx-http
```
-->
```shell
# 通过服务公开端口
kubectl expose deployment nginx-app --port=80 --name=nginx-http
```
```
service "nginx-http" exposed
```

<!--
By using kubectl, you can create a [Deployment](/docs/concepts/workloads/controllers/deployment/) to ensure that N pods are running nginx, where N is the number of replicas stated in the spec and defaults to 1. You can also create a [service](/docs/concepts/services-networking/service/) with a selector that matches the pod labels. For more information, see [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster).
-->
在 kubectl 命令中，我们创建了一个 [Deployment](/zh/docs/concepts/workloads/controllers/deployment/)，这将保证有 N 个运行 nginx 的 pod(N 代表 spec 中声明的 replica 数，默认为 1)。我们还创建了一个 [service](/zh/docs/concepts/services-networking/service/)，其选择器与容器标签匹配。查看[使用服务访问群集中的应用程序](/zh/docs/tasks/access-application-cluster/service-access-application-cluster) 获取更多信息。

<!--
By default images run in the background, similar to `docker run -d ...`. To run things in the foreground, use [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) to create pod:
-->
默认情况下镜像会在后台运行，与 `docker run -d ...` 类似，如果您想在前台运行，使用 [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) 在前台运行 Pod:

```shell
kubectl run [-i] [--tty] --attach <name> --image=<image>
```

<!--
Unlike `docker run ...`, if you specify `--attach`, then you attach `stdin`, `stdout` and `stderr`. You cannot control which streams are attached (`docker -a ...`).
To detach from the container, you can type the escape sequence Ctrl+P followed by Ctrl+Q.
-->
与 `docker run ...` 不同的是，如果指定了 `--attach` ，我们将连接到 `stdin`，`stdout` 和 `stderr`，而不能控制具体连接到哪个输出流（`docker -a ...`）。要从容器中退出，可以输入 Ctrl + P，然后按 Ctrl + Q。

<!--
Because the kubectl run command starts a Deployment for the container, the Deployment restarts if you terminate the attached process by using Ctrl+C, unlike `docker run -it`.
To destroy the Deployment and its pods you need to run `kubectl delete deployment <name>`.
-->
因为我们使用 Deployment 启动了容器，如果您终止连接到的进程（例如 `ctrl-c`），容器将会重启，这跟 `docker run -it` 不同。
如果想销毁该 Deployment（和它的 pod），您需要运行 `kubectl delete deployment <name>`。

## docker ps

<!--
To list what is currently running, see [kubectl get](/docs/reference/generated/kubectl/kubectl-commands/#get).
-->
如何列出哪些正在运行？查看 [kubectl get](/docs/reference/generated/kubectl/kubectl-commands/#get)。

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
如何连接到已经运行在容器中的进程？查看 [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands/#attach)。

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

<!--
To detach from the container, you can type the escape sequence Ctrl+P followed by Ctrl+Q.
-->
要从容器中分离，可以输入 Ctrl + P，然后按 Ctrl + Q。

## docker exec

<!--
To execute a command in a container, see [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec).
-->
如何在容器中执行命令？查看 [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)。

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
执行交互式命令怎么办？

<!--
docker:
-->
使用 docker 命令：

```shell
docker exec -ti 55c103fa1296 /bin/sh
# exit
```

kubectl:

```shell
kubectl exec -ti nginx-app-5jyvm -- /bin/sh      
# exit
```

<!--
For more information, see [Get a Shell to a Running Container](/docs/tasks/debug-application-cluster/get-shell-running-container/).
-->
更多信息请查看[获取运行中容器的 Shell 环境](/zh/docs/tasks/debug-application-cluster/get-shell-running-container/)。

## docker logs

<!--
To follow stdout/stderr of a process that is running, see [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs).
-->
如何查看运行中进程的 stdout/stderr？查看 [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs)。


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
现在是时候提一下 pod 和容器之间的细微差别了；默认情况下如果 pod 中的进程退出 pod 也不会终止，相反它将会重启该进程。这类似于 docker run 时的 `--restart=always` 选项， 这是主要差别。在 docker 中，进程的每个调用的输出都是被连接起来的，但是对于 kubernetes，每个调用都是分开的。要查看以前在 kubernetes 中执行的输出，请执行以下操作：

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
查看[日志架构](/zh/docs/concepts/cluster-administration/logging/)获取更多信息。

## docker stop and docker rm

<!--
To stop and delete a running process, see [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete).
-->
如何停止和删除运行中的进程？查看 [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete)。

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
NAME        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-app   1         1         1            1           2m
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
<!--
When you use kubectl, you don't delete the pod directly.You have to first delete the Deployment that owns the pod. If you delete the pod directly, the Deployment recreates the pod.
-->
请注意，我们不直接删除 pod。使用 kubectl 命令，我们要删除拥有该 pod 的 Deployment。如果我们直接删除 pod，Deployment 将会重新创建该 pod。
{{< /note >}}

## docker login

<!--
There is no direct analog of `docker login` in kubectl. If you are interested in using Kubernetes with a private registry, see [Using a Private Registry](/docs/concepts/containers/images/#using-a-private-registry).
-->
在 kubectl 中没有对 `docker login` 的直接模拟。如果您有兴趣在私有镜像仓库中使用 Kubernetes，请参阅[使用私有镜像仓库](/zh/docs/concepts/containers/images/#using-a-private-registry)。

## docker version

<!--
To get the version of client and server, see [kubectl version](/docs/reference/generated/kubectl/kubectl-commands/#version).
-->
如何查看客户端和服务端的版本？查看 [kubectl version](/docs/reference/generated/kubectl/kubectl-commands/#version)。

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
如何获取有关环境和配置的各种信息？查看 [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands/#cluster-info)。

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
Kubernetes master is running at https://108.59.85.141
KubeDNS is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/kube-dns/proxy
kubernetes-dashboard is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy
Grafana is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
Heapster is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
InfluxDB is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```
