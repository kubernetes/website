---
title: 查看 Pod 和节点
weight: 10
---
<!--
title: Viewing Pods and Nodes
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Learn about Kubernetes Pods.
* Learn about Kubernetes Nodes.
* Troubleshoot deployed applications.
-->
* 了解 Kubernetes Pod。
* 了解 Kubernetes 节点。
* 对已部署的应用进行故障排查。

<!--
## Kubernetes Pods
-->
## Kubernetes Pod

{{% alert %}}
<!--
_A Pod is a group of one or more application containers (such as Docker) and includes
shared storage (volumes), IP address and information about how to run them._
-->
**Pod 是一个或多个应用容器（例如 Docker）的组合，并且包含共享的存储（卷）、IP
地址和有关如何运行它们的信息。**
{{% /alert %}}

<!--
When you created a Deployment in [Module 2](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/),
Kubernetes created a **Pod** to host your application instance. A Pod is a Kubernetes
abstraction that represents a group of one or more application containers (such as Docker),
and some shared resources for those containers. Those resources include:

* Shared storage, as Volumes
* Networking, as a unique cluster IP address
* Information about how to run each container, such as the container image version
or specific ports to use
-->
在[模块 2](/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)
中创建 Deployment 时，Kubernetes 创建了一个 **Pod** 来托管你的应用实例。
Pod 是 Kubernetes 抽象出来的，表示一组一个或多个应用容器（如 Docker），
以及这些容器的一些共享资源。这些资源包括：

* 卷形式的共享存储
* 集群内唯一的 IP 地址，用于联网
* 有关每个容器如何运行的信息，例如容器镜像版本或要使用的特定端口

<!--
A Pod models an application-specific "logical host" and can contain different application
containers which are relatively tightly coupled. For example, a Pod might include
both the container with your Node.js app as well as a different container that feeds
the data to be published by the Node.js webserver. The containers in a Pod share an
IP Address and port space, are always co-located and co-scheduled, and run in a shared
context on the same Node.
-->
Pod 为特定于应用的“逻辑主机”建模，并且可以包含相对紧耦合的不同应用容器。
例如，Pod 可能既包含带有 Node.js 应用的容器，也包含另一个不同的容器，
用于提供 Node.js 网络服务器要发布的数据。Pod 中的容器共享 IP 地址和端口，
始终位于同一位置并且共同调度，并在同一节点上的共享上下文中运行。

<!--
Pods are the atomic unit on the Kubernetes platform. When we create a Deployment
on Kubernetes, that Deployment creates Pods with containers inside them (as opposed
to creating containers directly). Each Pod is tied to the Node where it is scheduled,
and remains there until termination (according to restart policy) or deletion. In
case of a Node failure, identical Pods are scheduled on other available Nodes in
the cluster.
-->
Pod 是 Kubernetes 平台上的原子单元。当我们在 Kubernetes 上创建 Deployment 时，
该 Deployment 会创建其中包含容器的 Pod（而不是直接创建容器）。
每个 Pod 都与被调度所在的节点绑定，并保持在那里直到（根据重启策略）终止或删除。
如果节点发生故障，则相同的 Pod 会被调度到集群中的其他可用节点上。

<!--
### Pods overview
-->
### Pod 概述

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_pods.svg" class="diagram-medium" >}}

{{% alert %}}
<!--
_Containers should only be scheduled together in a single Pod if they are tightly
coupled and need to share resources such as disk._
-->
**只有容器紧耦合并且需要共享磁盘等资源时，才应将其编排在一个 Pod 中。**
{{% /alert %}}

<!--
## Nodes

A Pod always runs on a **Node**. A Node is a worker machine in Kubernetes and may
be either a virtual or a physical machine, depending on the cluster. Each Node is
managed by the control plane. A Node can have multiple pods, and the Kubernetes
control plane automatically handles scheduling the pods across the Nodes in the
cluster. The control plane's automatic scheduling takes into account the available
resources on each Node.
-->
## 节点

一个 Pod 总是运行在某个 **Node（节点）** 上。节点是 Kubernetes 中工作机器，
可以是虚拟机或物理计算机，具体取决于集群。每个 Node 都由控制面管理。
节点可以有多个 Pod，Kubernetes 控制面会自动处理在集群中的节点上调度 Pod。
控制面的自动调度考量了每个节点上的可用资源。

<!--
Every Kubernetes Node runs at least:

* Kubelet, a process responsible for communication between the Kubernetes control
plane and the Node; it manages the Pods and the containers running on a machine.

* A container runtime (like Docker) responsible for pulling the container image
from a registry, unpacking the container, and running the application.
-->
每个 Kubernetes 节点至少运行：

* kubelet，负责 Kubernetes 控制面和节点之间通信的进程；它管理机器上运行的 Pod 和容器。

* 容器运行时（如 Docker）负责从镜像仓库中拉取容器镜像、解压缩容器以及运行应用。

<!--
### Nodes overview
-->
### 节点概述

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_nodes.svg" class="diagram-medium" >}}

<!--
## Troubleshooting with kubectl

In [Module 2](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/), you used
the kubectl command-line interface. You'll continue to use it in Module 3 to get
information about deployed applications and their environments. The most common
operations can be done with the following kubectl subcommands:
-->
## 使用 kubectl 进行故障排查

在[模块 2](/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/) 中，
你使用了 kubectl 命令行界面。你将继续在第 3 个模块中使用 kubectl
来获取有关已部署应用及其环境的信息。最常见的操作可以使用以下 kubectl
子命令完成：

<!--
* `kubectl get` - list resources
* `kubectl describe` - show detailed information about a resource
* `kubectl logs`  - print the logs from a container in a pod
* `kubectl exec` - execute a command on a container in a pod
-->
* `kubectl get` - 列出资源
* `kubectl describe` - 显示有关资源的详细信息
* `kubectl logs` - 打印 Pod 中容器的日志
* `kubectl exec` - 在 Pod 中的容器上执行命令

<!--
You can use these commands to see when applications were deployed, what their current
statuses are, where they are running and what their configurations are.

Now that we know more about our cluster components and the command line, let's
explore our application.
-->
你可以使用这些命令查看应用的部署时间、当前状态、运行位置以及配置。

现在我们了解了有关集群组件和命令行的更多信息，让我们来探索一下我们的应用。

<!--
### Check application configuration

Let's verify that the application we deployed in the previous scenario is running.
We'll use the `kubectl get` command and look for existing Pods:
-->
### 检查应用配置

让我们验证之前场景中部署的应用是否在运行。我们将使用 `kubectl get`
命令查看现存的 Pod：

```shell
kubectl get pods
```

<!--
If no pods are running, please wait a couple of seconds and list the Pods again.
You can continue once you see one Pod running.

Next, to view what containers are inside that Pod and what images are used to build
those containers we run the `kubectl describe pods` command:
-->
如果没有 Pod 在运行，请等几秒，让 Pod 再次列出。一旦看到一个 Pod 在运行，就可以继续操作。
接下来，要查看 Pod 内有哪些容器以及使用了哪些镜像来构建这些容器，我们运行
`kubectl describe pods` 命令：

```shell
kubectl describe pods
```

<!--
We see here details about the Pod’s container: IP address, the ports used and a
list of events related to the lifecycle of the Pod.

The output of the `describe` subcommand is extensive and covers some concepts that
we didn’t explain yet, but don’t worry, they will become familiar by the end of this tutorial.
-->
我们在这里看到了 Pod 的容器相关详情：IP 地址、所使用的端口以及 Pod
生命期有关的事件列表。

`describe` 子命令的输出宽泛，涵盖了一些我们还未讲到的概念，但不用担心，
这节课结束时你就会熟悉这些概念了。

{{< note >}}
<!--
The `describe` subcommand can be used to get detailed information about most of the
Kubernetes primitives, including Nodes, Pods, and Deployments. The describe output is
designed to be human readable, not to be scripted against.
-->
`describe` 子命令可用于获取有关大多数 Kubernetes 原语的详细信息，
包括 Node、Pod 和 Deployment。describe 的输出设计为人类可读的信息，
而不是脚本化的信息。
{{< /note >}}

<!--
### Show the app in the terminal

Recall that Pods are running in an isolated, private network - so we need to proxy access
to them so we can debug and interact with them. To do this, we'll use the `kubectl proxy`
command to run a proxy in a **second terminal**. Open a new terminal window, and
in that new terminal, run:
-->
### 在终端中显示应用

回想一下，Pod 运行在隔离的、私有的网络中 —— 因此我们需要代理访问它们，这样才能进行调试和交互。
为了做到这一点，我们将使用 `kubectl proxy` 命令在**第二个终端**中运行一个代理。
打开一个新的终端窗口，在这个新的终端中运行以下命令：

```shell
kubectl proxy
```

<!--
Now again, we'll get the Pod name and query that pod directly through the proxy.
To get the Pod name and store it in the `POD_NAME` environment variable:
-->
现在我们再次获取 Pod 名称并直接通过代理查询该 Pod。
要获取 Pod 命令并将其存到 `POD_NAME` 环境变量中，
运行以下命令：

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo Name of the Pod: $POD_NAME
```

<!--
To see the output of our application, run a `curl` request:
-->
要查看应用的输出，执行一个 `curl` 请求：

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

<!--
The URL is the route to the API of the Pod.
-->
URL 是到 Pod API 的路由。

{{< note >}}
<!--
We don't need to specify the container name, because we only have one container inside the pod.
-->
我们不需要指定容器名称，因为在 Pod 内只有一个容器。
{{< /note >}}

<!--
### Executing commands on the container
-->
### 在容器上执行命令

<!--
We can execute commands directly on the container once the Pod is up and running.
For this, we use the `exec` subcommand and use the name of the Pod as a parameter.
Let’s list the environment variables:
-->
一旦 Pod 启动并运行，我们就可以直接在容器上执行命令。
为此，我们使用 `exec` 子命令，并将 Pod 的名称作为参数。
让我们列出环境变量：

```shell
kubectl exec "$POD_NAME" -- env
```

<!--
Again, it's worth mentioning that the name of the container itself can be omitted
since we only have a single container in the Pod.

Next let’s start a bash session in the Pod’s container:
-->
另外值得一提的是，由于 Pod 中只有一个容器，所以容器本身的名称可以被省略。

接下来，让我们在 Pod 的容器中启动一个 bash 会话：

```shell
kubectl exec -ti $POD_NAME -- bash
```

<!--
We have now an open console on the container where we run our NodeJS application.
The source code of the app is in the `server.js` file:
-->
现在我们有了一个在运行 Node.js 应用的容器上打开的控制台。
该应用的源代码位于 `server.js` 文件中：

```shell
cat server.js
```

<!--
You can check that the application is up by running a curl command:
-->
你可以通过运行 `curl` 命令查看应用是否启动：

```shell
curl http://localhost:8080
```

{{< note >}}
<!--
Here we used `localhost` because we executed the command inside the NodeJS Pod.
If you cannot connect to `localhost:8080`, check to make sure you have run the
`kubectl exec` command and are launching the command from within the Pod.
-->
在这里我们使用了 `localhost`，因为我们在 NodeJS Pod 内执行了此命令。
如果你无法连接到 `localhost:8080`，请确保你已经运行了 `kubectl exec`
命令，并且是从 Pod 内启动的该命令。
{{< /note >}}

<!--
To close your container connection, type `exit`.
-->
要关闭你的容器连接，键入 `exit`。

## {{% heading "whatsnext" %}}

<!--
* Tutorial
[Using A Service To Expose Your App](/docs/tutorials/kubernetes-basics/expose/expose-intro/).
* Learn more about [Pods](/docs/concepts/workloads/pods/).
* Learn more about [Nodes](/docs/concepts/architecture/nodes/).
-->
* [使用 Service 来公开你的应用](/zh-cn/docs/tutorials/kubernetes-basics/expose/expose-intro/)教程。
* 进一步了解 [Pod](/zh-cn/docs/concepts/workloads/pods/)。
* 进一步了解[节点](/zh-cn/docs/concepts/architecture/nodes/)的。
