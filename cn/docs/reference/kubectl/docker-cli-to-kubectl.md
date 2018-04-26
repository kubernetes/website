---
approvers:
- bgrant0607
- brendandburns
- thockin
cn-approvers:
- lichuqiang
title: 针对 Docker 用户的 kubectl（相关功能）
---
<!--
---
approvers:
- bgrant0607
- brendandburns
- thockin
title: kubectl for Docker Users
---
-->

<!--
In this doc, we introduce the Kubernetes command line for interacting with the api to docker-cli users. The tool, kubectl, is designed to be familiar to docker-cli users but there are a few necessary differences. Each section of this doc highlights a docker subcommand explains the kubectl equivalent.
-->
本文中，我们将向 docker-cli 用户介绍与 api 进行交互的 Kubernetes 命令行工具。该工具-- kubectl 被设计为
docker-cli 用户所熟悉的方式，但也存在一些必要的区别。本文的每一节都强调了一个与 kubectl 相关命令等效的 docker 子命令。

* TOC
{:toc}

#### docker run

<!--
How do I run an nginx Deployment and expose it to the world? Checkout [kubectl run](/docs/user-guide/kubectl/{{page.version}}/#run).
-->
如何运行一个 nginx Deployment，并将其公布于世呢？ 请查看 [kubectl run](/docs/user-guide/kubectl/{{page.version}}/#run)。

<!--
With docker:
-->
使用 docker：

```shell
$ docker run -d --restart=always -e DOMAIN=cluster --name nginx-app -p 80:80 nginx
55c103fa129692154a7652490236fee9be47d70a8dd562281ae7d2f9a339a6db

$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   9 seconds ago       Up 9 seconds        0.0.0.0:80->80/tcp   nginx-app
```

<!--
With kubectl:
-->
使用 kubectl：

```shell
# start the pod running nginx
$ kubectl run --image=nginx nginx-app --port=80 --env="DOMAIN=cluster"
deployment "nginx-app" created
```

<!--
`kubectl run` creates a Deployment named "nginx-app" on Kubernetes cluster >= v1.2. If you are running older versions, it creates replication controllers instead.
-->
在 1.2 或更高版本的 Kubernetes 集群中，`kubectl run` 会创建一个名为 “nginx-app” 的 Deployment。
如果您运行的是更旧的版本，那么该命令创建的不是 Deployment，而是 replication controller。
<!--
If you want to obtain the old behavior, use `--generator=run/v1` to create replication controllers. See [`kubectl run`](/docs/user-guide/kubectl/{{page.version}}/#run) for more details.
-->
如果您想按照旧版本的方式执行，请使用 `--generator=run/v1` 参数来创建 replication controller。
查看 [`kubectl run`](/docs/user-guide/kubectl/{{page.version}}/#run) 了解更多细节。
<!--
Note that `kubectl` commands will print the type and name of the resource created or mutated, which can then be used in subsequent commands. Now, we can expose a new Service with the deployment created above:
-->
注意： `kubectl` 命令会打印所创建或改变的资源的类型和名称， 这些信息可以被用于随后的命令中。
现在，我们可以使用上面创建的 deployment 发布一个新的 Service：

```shell
# expose a port through with a service
$ kubectl expose deployment nginx-app --port=80 --name=nginx-http
service "nginx-http" exposed
```

<!--
With kubectl, we create a [Deployment](/docs/concepts/workloads/controllers/deployment/) which will make sure that N pods are running nginx (where N is the number of replicas stated in the spec, which defaults to 1). We also create a [service](/docs/user-guide/services) with a selector that matches the Deployment's selector. See the [Quick start](/docs/user-guide/quick-start) for more information.
-->
通过使用 kubectl，我们创建了一个 [Deployment](/docs/concepts/workloads/controllers/deployment/)，它会确保存在 N 个运行 nginx 的 pod。(其中 N 是 spec 中声明的副本数，默认值为1)。 我们还创建了一个 [service](/docs/user-guide/services)，它的 selector 与 Deployment 的相匹配。 查看 [快速入门](/docs/user-guide/quick-start) 了解更多信息。

<!--
By default images are run in the background, similar to `docker run -d ...`, if you want to run things in the foreground, use:
-->
默认情况下应用运行在后台，类似于 `docker run -d ...`，如果您希望将其运行在前台，请使用：

```shell
kubectl run [-i] [--tty] --attach <name> --image=<image>
```

<!--
Unlike `docker run ...`, if `--attach` is specified, we attach to `stdin`, `stdout` and `stderr`, there is no ability to control which streams are attached (`docker -a ...`).
-->
与 `docker run ...` 不同， 如果指定了 `--attach`， 我们默认附加到 `stdin`、 `stdout` 和 `stderr`中，而没有控制附加到哪个流的能力（`docker -a ...`）。

<!--
Because we start a Deployment for your container, it will be restarted if you terminate the attached process (e.g. `ctrl-c`), this is different from `docker run -it`.
To destroy the Deployment (and its pods) you need to run `kubectl delete deployment <name>`.
-->
因为我们为容器启动了一个 Deployment，如果您终止了容器的附加进程（例如执行 `ctrl-c`），容器会被重新启动，
这与 `docker run -it` 不同。
如果想销毁 Deployment（及其 pod），您需要执行 `kubectl delete deployment <name>`。

#### docker ps

<!--
How do I list what is currently running? Checkout [kubectl get](/docs/user-guide/kubectl/{{page.version}}/#get).

With docker:
-->
如何列出当前运行的内容呢？ 请查看 [kubectl get](/docs/user-guide/kubectl/{{page.version}}/#get)。

使用 docker：

```shell
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS                     PORTS                NAMES
14636241935f        ubuntu:16.04        "echo test"              5 seconds ago        Exited (0) 5 seconds ago                        cocky_fermi
55c103fa1296        nginx               "nginx -g 'daemon of…"   About a minute ago   Up About a minute          0.0.0.0:80->80/tcp   nginx-app
```

<!--
With kubectl:
-->
使用 kubectl：

```shell
$ kubectl get po -a
NAME                        READY     STATUS      RESTARTS   AGE
nginx-app-8df569cb7-4gd89   1/1       Running     0          3m
ubuntu                      0/1       Completed   0          20s
```

#### docker attach

<!--
How do I attach to a process that is already running in a container?  Checkout [kubectl attach](/docs/user-guide/kubectl/{{page.version}}/#attach).

With docker:
-->
如何向已经运行的容器中附加进程呢？ 请查看 [kubectl attach](/docs/user-guide/kubectl/{{page.version}}/#attach)。

使用 docker：

```shell
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   5 minutes ago       Up 5 minutes        0.0.0.0:80->80/tcp   nginx-app

$ docker attach 55c103fa1296
...
```

<!--
With kubectl:
-->
使用 kubectl：

```shell
$ kubectl get pods
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m

$ kubectl attach -it nginx-app-5jyvm
...
```

#### docker exec

<!--
How do I execute a command in a container? Checkout [kubectl exec](/docs/user-guide/kubectl/{{page.version}}/#exec).

With docker:
-->
如何在容器中执行命令呢？请查看 [kubectl exec](/docs/user-guide/kubectl/{{page.version}}/#exec)。

使用 docker：

```shell
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
55c103fa1296        nginx               "nginx -g 'daemon of…"   6 minutes ago       Up 6 minutes        0.0.0.0:80->80/tcp   nginx-app

$ docker exec 55c103fa1296 cat /etc/hostname
55c103fa1296
```

<!--
With kubectl:
-->
使用 kubectl：

```shell
$ kubectl get po
NAME              READY     STATUS    RESTARTS   AGE
nginx-app-5jyvm   1/1       Running   0          10m

$ kubectl exec nginx-app-5jyvm -- cat /etc/hostname
nginx-app-5jyvm
```

<!--
What about interactive commands?
-->
交互命令怎么样呢？


<!--
With docker:
-->
使用 docker：

```shell
$ docker exec -ti 55c103fa1296 /bin/sh
# exit
```

<!--
With kubectl:
-->
使用 kubectl：

```shell
$ kubectl exec -ti nginx-app-5jyvm -- /bin/sh      
# exit
```

<!--
For more information see [Getting a Shell to a Running Container](/docs/tasks/debug-application-cluster/get-shell-running-container/).
-->
要了解更多信息，请查看 [为运行的容器打开 Shell ](/docs/tasks/debug-application-cluster/get-shell-running-container/)。

#### docker logs

<!--
How do I follow stdout/stderr of a running process? Checkout [kubectl logs](/docs/user-guide/kubectl/{{page.version}}/#logs).
-->
如何跟踪运行进程的标准输出/标准错误呢？ 请查看 [kubectl logs](/docs/user-guide/kubectl/{{page.version}}/#logs)。

<!--
With docker:
-->
使用 docker：

```shell
$ docker logs -f a9e
192.168.9.1 - - [14/Jul/2015:01:04:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
192.168.9.1 - - [14/Jul/2015:01:04:03 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.35.0" "-"
```

<!--
With kubectl:
-->
使用 kubectl：

```shell
$ kubectl logs -f nginx-app-zibvs
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

<!--
Now's a good time to mention slight difference between pods and containers; by default pods will not terminate if their processes exit. Instead it will restart the process. This is similar to the docker run option `--restart=always` with one major difference. In docker, the output for each invocation of the process is concatenated, but for Kubernetes, each invocation is separate. To see the output from a previous run in Kubernetes, do this:
-->
现在是提及 pod 和容器间细微差别的好时机了。默认情况下，如果 pod 的进程退出，pod 本身不会终止，而是重启进程。
这类似于 docker run 选项 `--restart=always`， 但两者有一个重要区别： 在 docker 中， 对进程的每次调用输出都是连续性的，但对于 Kubernetes，每次调用都是独立的。为查看 Kubernetes 中先前运行的输出，请执行以下操作：

```shell
$ kubectl logs --previous nginx-app-zibvs
10.240.63.110 - - [14/Jul/2015:01:09:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
10.240.63.110 - - [14/Jul/2015:01:09:02 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.26.0" "-"
```

<!--
See [Logging and Monitoring Cluster Activity](/docs/concepts/cluster-administration/logging/) for more information.
-->
查看 [日志和集群活动监控](/docs/concepts/cluster-administration/logging/) 了解更多信息。


#### docker stop and docker rm

<!--
How do I stop and delete a running process? Checkout [kubectl delete](/docs/user-guide/kubectl/{{page.version}}/#delete).

With docker:
-->
如何停止并删除运行的进程呢？请查看 [kubectl delete](/docs/user-guide/kubectl/{{page.version}}/#delete)。

使用 docker：

```shell
$ docker ps
CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS              PORTS                         NAMES
a9ec34d98787        nginx               "nginx -g 'daemon of"  22 hours ago        Up 22 hours         0.0.0.0:80->80/tcp, 443/tcp   nginx-app

$ docker stop a9ec34d98787
a9ec34d98787

$ docker rm a9ec34d98787
a9ec34d98787
```

<!--
With kubectl:
-->
使用 kubectl：

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

<!--
Notice that we don't delete the pod directly. With kubectl we want to delete the Deployment that owns the pod. If we delete the pod directly, the Deployment will recreate the pod.
-->
注意：我们不会直接删除 pod。我们希望使用 kubectl 删除拥有该 pod 的 Deployment。如果我们直接删除 pod，
Deployment 会重新创建它。

#### docker login

<!--
There is no direct analog of `docker login` in kubectl. If you are interested in using Kubernetes with a private registry, see [Using a Private Registry](/docs/concepts/containers/images/#using-a-private-registry).
-->
Kubectl 中没有直接类似于 `docker login` 的功能。如果您对于在 Kubernetes 中使用私有镜像仓库有兴趣，请查看
[使用私有镜像仓库](/docs/concepts/containers/images/#using-a-private-registry)。

#### docker version

<!--
How do I get the version of my client and server? Checkout [kubectl version](/docs/user-guide/kubectl/{{page.version}}/#version).

With docker:
-->
如何获取客户端和服务端的版本信息呢？ 请查看 [kubectl version](/docs/user-guide/kubectl/{{page.version}}/#version)。

使用 docker：

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

<!--
With kubectl:
-->
使用 kubectl：

```shell
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"6", GitVersion:"v1.6.9+a3d1dfa6f4335", GitCommit:"9b77fed11a9843ce3780f70dd251e92901c43072", GitTreeState:"dirty", BuildDate:"2017-08-29T20:32:58Z", OpenPaasKubernetesVersion:"v1.03.02", GoVersion:"go1.7.5", Compiler:"gc", Platform:"linux/amd64"}
```

#### docker info

<!--
How do I get miscellaneous info about my environment and configuration? Checkout [kubectl cluster-info](/docs/user-guide/kubectl/{{page.version}}/#cluster-info).

With docker:
-->
如何获取环境和配置相关的各种信息呢？查看 [kubectl cluster-info](/docs/user-guide/kubectl/{{page.version}}/#cluster-info)。

使用 docker：

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

<!--
With kubectl:
-->
使用 kubectl：

```shell
$ kubectl cluster-info
Kubernetes master is running at https://108.59.85.141
KubeDNS is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/kube-dns/proxy
KubeUI is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/kube-ui/proxy
Grafana is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
Heapster is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
InfluxDB is running at https://108.59.85.141/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```
