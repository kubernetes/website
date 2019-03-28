---
title: Docker 用户的 kubectl  指南
content_template: templates/concept
reviewers:
- bgrant0607
- brendandburns
- thockin
---

<!--
---
title: kubectl for Docker Users
content_template: templates/concept
reviewers:
- bgrant0607
- brendandburns
- thockin
---
-->

{{% capture overview %}}
<!--
You can use the Kubernetes command line tool kubectl to interact with the API Server. Using kubectl is straightforward if you are familiar with the Docker command line tool. However, there are a few differences between the docker commands and the kubectl commands. The following sections show a docker sub-command and describe the equivalent kubectl command.
-->
您可以使用 Kubernetes 命令行工具 kubectl 与 API 服务器交互。如果您熟悉 Docker 命令行工具，那么使用 kubectl 非常简单。
但是，Docker 命令和 kubectl 命令之间存在一些差异。以下部分介绍了 Docker 子命令，并描述了等效的 kubectl 命令。
{{% /capture %}}

{{% capture body %}}
## docker run

<!--
To run an nginx Deployment and expose the Deployment, see [kubectl run](/docs/reference/generated/kubectl/kubectl-commands/#run).
-->
要运行 nginx Deployment 并公开该 Deployment，请参考 [kubectl run](/docs/reference/generated/kubectl/kubectl-commands/#run)。

docker:

```shell
$ docker run -d --restart=always -e DOMAIN=cluster --name nginx-app -p 80:80 nginx
55c103fa129692154a7652490236fee9be47d70a8dd562281ae7d2f9a339a6db

$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   9 seconds ago       Up 9 seconds        0.0.0.0:80->80/tcp   nginx-app
```

<!--
```shell
# start the pod running nginx
$ kubectl run --image=nginx nginx-app --port=80 --env="DOMAIN=cluster"
deployment "nginx-app" created
```
-->

kubectl:

```shell
# 启动 Pod 运行 nginx
$ kubectl run --image=nginx nginx-app --port=80 --env="DOMAIN=cluster"
deployment "nginx-app" created
```

{{< note >}}
<!--
`kubectl` commands print the type and name of the resource created or mutated, which can then be used in subsequent commands. You can expose a new Service after a Deployment is created.
-->
`kubectl` 命令打印创建或变更的资源类型和名称，以便可以在后续的命令中使用。可以在创建 Deployment 后公开一个新 Service。
{{< /note >}}

<!--
```shell
# expose a port through with a service
$ kubectl expose deployment nginx-app --port=80 --name=nginx-http
service "nginx-http" exposed
```
-->

```shell
# 通过 Service 暴露端口
$ kubectl expose deployment nginx-app --port=80 --name=nginx-http
service "nginx-http" exposed
```

<!--
By using kubectl, you can create a [Deployment](/docs/concepts/workloads/controllers/deployment/) to ensure that N pods are running nginx, where N is the number of replicas stated in the spec and defaults to 1. You can also create a [service](/docs/concepts/services-networking/service/) with a selector that matches the pod labels. For more information, see [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster).
-->
通过使用 kubectl，您可以创建一个[Deployment](/zh/docs/concepts/workloads/controllers/deployment/) 来确保 N 个 Pod 运行 nginx，其中 N 是声明中规定的副本数，默认值为 1。
您还可以使用与 Pod 标签匹配的选择器创建 [服务](/zh/docs/concepts/services-networking/service/)。
有关详细信息，请参阅[使用服务访问群集中的应用](/zh/docs/tasks/access-application-cluster/service-access-application-cluster)。

<!--
By default images run in the background, similar to `docker run -d ...`. To run things in the foreground, use:
-->

默认情况下，镜像在后台运行，类似于 `docker run -d ...`。要在前台运行，请使用：

```shell
kubectl run [-i] [--tty] --attach <name> --image=<image>
```
<!--
Unlike `docker run ...`, if you specify `--attach`, then you attach `stdin`, `stdout` and `stderr`. You cannot control which streams are attached (`docker -a ...`).
To detach from the container, you can type the escape sequence Ctrl+P followed by Ctrl+Q.
-->

不像 `docker run ...`，如果您指定了 `--attach` 参数，那您实际上就为其关联了 `stdin`、`stdout` 和 `stderr`。
无法控制关联哪个流（`docker -a ...`）。

<!--
Because the kubectl run command starts a Deployment for the container, the Deployment restarts if you terminate the attached process by using Ctrl+C, unlike `docker run -it`.
To destroy the Deployment and its pods you need to run `kubectl delete deployment <name>`.
-->

因为 kubectl run 命令会为容器启动 Deployment，所以如果使用 Ctrl+C 终止关联的进程，则 Deployment 将重新启动，这与 `docker run -it` 不同。

要销毁 Deployment 及其 Pod，需要运行 `kubectl delete deployment <name>`。

## docker ps

<!--
To list what is currently running, see [kubectl get](/docs/reference/generated/kubectl/kubectl-commands/#get).
-->

要列出当前正在运行的内容，请参考 [kubectl get](/docs/reference/generated/kubectl/kubectl-commands/#get)。

docker:

```shell
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS                     PORTS                NAMES
14636241935f        ubuntu:16.04        "echo test"              5 seconds ago        Exited (0) 5 seconds ago                        cocky_fermi
55c103fa1296        nginx               "nginx -g 'daemon of…"   About a minute ago   Up About a minute          0.0.0.0:80->80/tcp   nginx-app
```

kubectl:

```shell
$ kubectl get po
NAME                        READY     STATUS      RESTARTS   AGE
nginx-app-8df569cb7-4gd89   1/1       Running     0          3m
ubuntu                      0/1       Completed   0          20s
```

## docker attach

<!--
To attach a process that is already running in a container, see [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands/#attach).
-->

要和已在容器中运行的进程建立联系，请参见 [kubectl attach](/docs/reference/generated/kubectl/kubectl-commands/#attach)。

docker:

```shell
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   5 minutes ago       Up 5 minutes        0.0.0.0:80->80/tcp   nginx-app

$ docker attach 55c103fa1296
...
```

kubectl:

```shell
$ kubectl get pods
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m

$ kubectl attach -it nginx-app-5jyvm
...
```

<!--
To detach from the container, you can type the escape sequence Ctrl+P followed by Ctrl+Q.
-->

要退出容器，可以键入转义序列 Ctrl+P，然后键入 Ctrl+Q。

## docker exec

<!--
To execute a command in a container, see [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec).
-->

要在容器中执行命令，请参见 [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)。

docker:

```shell
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   6 minutes ago       Up 6 minutes        0.0.0.0:80->80/tcp   nginx-app

$ docker exec 55c103fa1296 cat /etc/hostname
55c103fa1296
```

kubectl:

```shell
$ kubectl get po
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m

$ kubectl exec nginx-app-5jyvm -- cat /etc/hostname
nginx-app-5jyvm
```

<!--
To use interactive commands.
-->

使用交互命令。

docker:

```shell
$ docker exec -ti 55c103fa1296 /bin/sh
# exit
```

kubectl:

```shell
$ kubectl exec -ti nginx-app-5jyvm -- /bin/sh      
# exit
```

<!--
For more information, see [Get a Shell to a Running Container](/docs/tasks/debug-application-cluster/get-shell-running-container/).
-->

更多信息，请参见[获取正在运行的容器的 shell](/docs/tasks/debug-application-cluster/get-shell-running-container/)。

## docker logs

<!--
To follow stdout/stderr of a process that is running, see [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs).
-->

要跟踪正在运行的进程的 stdout/stderr，请参见 [kubectl logs](/docs/reference/generated/kubectl/kubectl-commands/#logs)。

docker:

```shell
$ docker logs -f a9e
192.168.9.1 - - [14/Jul/2015:01:04:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
192.168.9.1 - - [14/Jul/2015:01:04:03 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
```

kubectl:

```shell
$ kubectl logs -f nginx-app-zibvs
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

<!--
There is a slight difference between pods and containers; by default pods do not terminate if their processes exit. Instead the pods restart the process. This is similar to the docker run option `--restart=always` with one major difference. In docker, the output for each invocation of the process is concatenated, but for Kubernetes, each invocation is separate. To see the output from a previous run in Kubernetes, do this:
-->

Pod 和容器之间有细微的区别；默认情况下，如果进程退出，Pod 不会终止。相反，Pod 会重新启动进程。
这与 docker run 的选项 `--restart=always` 类似，不过有一点不同。
在 Docker 中，每次进程调用的输出都是串联的，但是对于 Kubernetes，每次调用是独立的。
要查看 Kubernetes 上一次运行的输出，请执行以下操作：

```shell
$ kubectl logs --previous nginx-app-zibvs
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

<!--
For more information, see [Logging Architecture](/docs/concepts/cluster-administration/logging/).
-->

更多信息请参考[日志架构](/docs/concepts/cluster-administration/logging/)。

<!--
## docker stop and docker rm
-->
## docker stop 和 docker rm

<!--
To stop and delete a running process, see [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete).
-->
要停止并删除一个运行中的进程，请参考 [kubectl delete](/docs/reference/generated/kubectl/kubectl-commands/#delete)。

docker:

```shell
$ docker ps
CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS              PORTS                         NAMES
a9ec34d98787        nginx               "nginx -g 'daemon of"  22 hours ago        Up 22 hours         0.0.0.0:80->80/tcp, 443/tcp   nginx-app

$ docker stop a9ec34d98787
a9ec34d98787

$ docker rm a9ec34d98787
a9ec34d98787
```

kubectl:

<!--
```shell
$ kubectl get deployment nginx-app
NAME        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-app   1         1         1            1           2m

$ kubectl get po -l run=nginx-app
NAME                         READY     STATUS    RESTARTS   AGE
nginx-app-2883164633-aklf7   1/1       Running   0          2m

$ kubectl delete deployment nginx-app
deployment "nginx-app" deleted

$ kubectl get po -l run=nginx-app
# Return nothing
```
-->

```shell
$ kubectl get deployment nginx-app
NAME        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-app   1         1         1            1           2m

$ kubectl get po -l run=nginx-app
NAME                         READY     STATUS    RESTARTS   AGE
nginx-app-2883164633-aklf7   1/1       Running   0          2m

$ kubectl delete deployment nginx-app
deployment "nginx-app" deleted

$ kubectl get po -l run=nginx-app
# 什么都没返回
```

{{< note >}}
<!--
When you use kubectl, you don't delete the pod directly.You have to first delete the Deployment that owns the pod. If you delete the pod directly, the Deployment recreates the pod.
-->
使用 kubectl 时，不会直接删除 Pod，必须先删除拥有该 Pod 的 Deployment。如果直接删除 Pod，Deployment 将重新创建 Pod。
{{< /note >}}

## docker login

<!--
There is no direct analog of `docker login` in kubectl. If you are interested in using Kubernetes with a private registry, see [Using a Private Registry](/docs/concepts/containers/images/#using-a-private-registry).
-->

在 kubectl 中没有与 docker login 直接对应的操作。如果您有兴趣在 Kubernetes 中使用私有仓库，请参考 [使用私有仓库](/zh/docs/concepts/containers/images/#using-a-private-registry)。

## docker version

<!--
To get the version of client and server, see [kubectl version](/docs/reference/generated/kubectl/kubectl-commands/#version).
-->

要获取客户端和服务器的版本，请参考 [kubectl version](/docs/reference/generated/kubectl/kubectl-commands/#version)。

docker:

```shell
$ docker version
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
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
```

## docker info

<!--
To get miscellaneous information about the environment and configuration, see [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands/#cluster-info).
-->

要获取有关环境和配置的其他信息，请参阅 [kubectl cluster-info](/docs/reference/generated/kubectl/kubectl-commands/#cluster-info)。

docker:

```shell
$ docker info
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
$ kubectl cluster-info
Kubernetes master is running at https://108.59.85.141
KubeDNS is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/kube-dns/proxy
kubernetes-dashboard is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy
Grafana is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
Heapster is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
InfluxDB is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```
{{% /capture %}}
