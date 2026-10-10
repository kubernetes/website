---
title: 使用 telepresence 在本地开发和调试服务
content_type: task
---
<!--
title: Developing and debugging services locally using telepresence
content_type: task
-->

<!-- overview -->

{{% thirdparty-content %}}

<!--
Kubernetes applications usually consist of multiple, separate services,
each running in its own container. Developing and debugging these services
on a remote Kubernetes cluster can be cumbersome, requiring you to
[get a shell on a running container](/docs/tasks/debug/debug-application/get-shell-running-container/)
in order to run debugging tools.
-->
Kubernetes 应用程序通常由多个独立的服务组成，每个服务都在自己的容器中运行。
在远端的 Kubernetes 集群上开发和调试这些服务可能很麻烦，
需要[在运行的容器上打开 Shell](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)，
以运行调试工具。

<!--
`telepresence` is a tool to ease the process of developing and debugging
services locally while proxying the service to a remote Kubernetes cluster.
Using `telepresence` allows you to use custom tools, such as a debugger and
IDE, for a local service and provides the service full access to ConfigMap,
secrets, and the services running on the remote cluster.
-->
`telepresence` 是一个工具，用于简化本地开发和调试服务的过程，同时可以将服务代理到远程 Kubernetes 集群。
`telepresence` 允许你使用自定义工具（例如调试器和 IDE）调试本地服务，
并能够让此服务完全访问 ConfigMap、Secret 和远程集群上运行的服务。

<!--
This document describes using `telepresence` to develop and debug services
running on a remote cluster locally.
-->
本文档描述如何在本地使用 `telepresence` 开发和调试远程集群上运行的服务。

## {{% heading "prerequisites" %}}

<!--
* Kubernetes cluster is installed
* `kubectl` is configured to communicate with the cluster
* [Telepresence](https://www.telepresence.io/docs/latest/quick-start/) is installed
-->
* Kubernetes 集群安装完毕
* 配置好 `kubectl` 与集群交互
* [Telepresence](https://www.telepresence.io/docs/latest/quick-start/) 安装完毕

<!-- steps -->

<!--
## Connecting your local machine to a remote Kubernetes cluster
 
After installing `telepresence`, run `telepresence connect` to launch
its Daemon and connect your local workstation to the cluster.
-->
## 从本机连接到远程 Kubernetes 集群  {#connecting-your-local-machine-to-a-remote-cluster}

安装 `telepresence` 后，运行 `telepresence connect` 来启动它的守护进程并将本地工作站连接到远程
Kubernetes 集群。

```
$ telepresence connect
 
Launching Telepresence Daemon
...
Connected to context default (https://<cluster public IP>)
```

<!--
You can curl services using the Kubernetes syntax e.g. `curl -ik https://kubernetes.default`
-->
你可以通过 curl 使用 Kubernetes 语法访问服务，例如：`curl -ik https://kubernetes.default`

<!--
## Developing or debugging an existing service

When developing an application on Kubernetes, you typically program
or debug a single service. The service might require access to other
services for testing and debugging. One option is to use the continuous
deployment pipeline, but even the fastest deployment pipeline introduces
a delay in the program or debug cycle.
-->
## 开发和调试现有的服务  {#developing-or-debugging-an-existing-service}

在 Kubernetes 上开发应用程序时，通常对单个服务进行编程或调试。
服务可能需要访问其他服务以进行测试和调试。
一种选择是使用连续部署流水线，但即使最快的部署流水线也会在程序或调试周期中引入延迟。

<!--
Use the `telepresence intercept $SERVICE_NAME --port $LOCAL_PORT:$REMOTE_PORT`
command to create an "intercept" for rerouting remote service traffic.

Where:

-   `$SERVICE_NAME`  is the name of your local service
-   `$LOCAL_PORT` is the port that your service is running on your local workstation
-   And `$REMOTE_PORT` is the port your service listens to in the cluster
-->
使用 `telepresence intercept $SERVICE_NAME --port $LOCAL_PORT:$REMOTE_PORT`
命令创建一个 "拦截器" 用于重新路由远程服务流量。

环境变量：

- `$SERVICE_NAME` 是本地服务名称
- `$LOCAL_PORT` 是服务在本地工作站上运行的端口
- `$REMOTE_PORT` 是服务在集群中侦听的端口

<!--
Running this command tells Telepresence to send remote traffic to your
local service instead of the service in the remote Kubernetes cluster.
Make edits to your service source code locally, save, and see the corresponding
changes when accessing your remote application take effect immediately.
You can also run your local service using a debugger or any other local development tool.
-->
运行此命令会告诉 Telepresence 将远程流量发送到本地服务，而不是远程 Kubernetes 集群中的服务中。
在本地编辑保存服务源代码，并在访问远程应用时查看相应变更会立即生效。
还可以使用调试器或任何其他本地开发工具运行本地服务。

<!--
## How does Telepresence work?

Telepresence installs a traffic-agent sidecar next to your existing
application's container running in the remote cluster. It then captures
all traffic requests going into the Pod, and instead of forwarding this
to the application in the remote cluster, it routes all traffic (when you
create a [global intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#global-intercept)
or a subset of the traffic (when you create a
[personal intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept))
to your local development environment.
-->
## Telepresence 是如何工作的？  {#how-does-telepresence-work}

Telepresence 会在远程集群中运行的现有应用程序容器旁边安装流量代理 Sidecar。
当它捕获进入 Pod 的所有流量请求时，不是将其转发到远程集群中的应用程序，
而是路由所有流量（当创建[全局拦截器](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#global-intercept)时）
或流量的一个子集（当创建[自定义拦截器](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept)时）
到本地开发环境。

## {{% heading "whatsnext" %}}

<!--
If you're interested in a hands-on tutorial, check out
[this tutorial](https://cloud.google.com/community/tutorials/developing-services-with-k8s)
that walks through locally developing the Guestbook application on Google Kubernetes Engine.
-->
如果你对实践教程感兴趣，
请查看[本教程](https://cloud.google.com/community/tutorials/developing-services-with-k8s)，
其中介绍了如何在 Google Kubernetes Engine 上本地开发 Guestbook 应用程序。

<!--
For further reading, visit the [Telepresence website](https://www.telepresence.io).
-->
如需进一步了解，请访问 [Telepresence 官方网站](https://www.telepresence.io)。
