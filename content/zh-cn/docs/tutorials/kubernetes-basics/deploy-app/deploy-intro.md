---
title: 使用 kubectl 创建 Deployment
weight: 10
---
<!--
title: Using kubectl to Create a Deployment
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Learn about application Deployments.
* Deploy your first app on Kubernetes with kubectl.
-->
* 学习应用的部署。
* 使用 kubectl 在 Kubernetes 上部署第一个应用。

<!--
## Kubernetes Deployments
-->
## Kubernetes Deployment

{{% alert %}}
<!--
_A Deployment is responsible for creating and updating instances of your application._
-->
**Deployment 负责创建和更新应用的实例**
{{% /alert %}}

{{< note >}}
<!--
This tutorial uses a container that requires the AMD64 architecture. If you are using
minikube on a computer with a different CPU architecture, you could try using minikube with
a driver that can emulate AMD64. For example, the Docker Desktop driver can do this.
-->
本教程使用了一个需要 AMD64 架构的容器。如果你在使用 Minikube
的计算机上使用了不同的 CPU 架构，可以尝试使用能够模拟 AMD64
的 Minikube 驱动程序。例如，Docker Desktop 驱动程序可以实现这一点。
{{< /note >}}

<!--
Once you have a [running Kubernetes cluster](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/),
you can deploy your containerized applications on top of it. To do so, you create a
Kubernetes **Deployment**. The Deployment instructs Kubernetes how to create and
update instances of your application. Once you've created a Deployment, the Kubernetes
control plane schedules the application instances included in that Deployment to run
on individual Nodes in the cluster.
-->
一旦[运行了 Kubernetes 集群](/zh-cn/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/)，
就可以在其上部署容器化应用。为此，你需要创建 Kubernetes **Deployment**。
Deployment 指挥 Kubernetes 如何创建和更新应用的实例。
创建 Deployment 后，Kubernetes 控制平面将 Deployment
中包含的应用实例调度到集群中的各个节点上。

<!--
Once the application instances are created, a Kubernetes Deployment controller continuously
monitors those instances. If the Node hosting an instance goes down or is deleted,
the Deployment controller replaces the instance with an instance on another Node
in the cluster. **This provides a self-healing mechanism to address machine failure
or maintenance.**
-->
创建应用实例后，Kubernetes Deployment 控制器会持续监视这些实例。
如果托管实例的节点关闭或被删除，则 Deployment 控制器会将该实例替换为集群中另一个节点上的实例。
**这提供了一种自我修复机制来解决机器故障维护问题。**

<!--
In a pre-orchestration world, installation scripts would often be used to start
applications, but they did not allow recovery from machine failure. By both creating
your application instances and keeping them running across Nodes, Kubernetes Deployments
provide a fundamentally different approach to application management.
-->
在没有 Kubernetes 这种编排系统之前，安装脚本通常用于启动应用，
但它们不允许从机器故障中恢复。通过创建应用实例并使它们在节点之间运行，
Kubernetes Deployment 提供了一种与众不同的应用管理方法。

<!--
## Deploying your first app on Kubernetes
-->
## 部署你在 Kubernetes 上的第一个应用

{{% alert %}}
<!--
_Applications need to be packaged into one of the supported container formats in
order to be deployed on Kubernetes._
-->
**应用需要打包成一种受支持的容器格式，以便部署在 Kubernetes 上。**
{{% /alert %}}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_02_first_app.svg" class="diagram-medium" >}}

<!--
You can create and manage a Deployment by using the Kubernetes command line interface,
[kubectl](/docs/reference/kubectl/). `kubectl` uses the Kubernetes API to interact
with the cluster. In this module, you'll learn the most common `kubectl` commands
needed to create Deployments that run your applications on a Kubernetes cluster.

When you create a Deployment, you'll need to specify the container image for your
application and the number of replicas that you want to run. You can change that
information later by updating your Deployment; [Module 5](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
and [Module 6](/docs/tutorials/kubernetes-basics/update/update-intro/) of the bootcamp
discuss how you can scale and update your Deployments.
-->
你可以使用 Kubernetes 命令行界面 `kubectl` 创建和管理 Deployment。
kubectl 使用 Kubernetes API 与集群进行交互。在本单元中，你将学习创建在 Kubernetes
集群上运行应用的 Deployment 所需的最常见的 kubectl 命令。

创建 Deployment 时，你需要指定应用的容器镜像以及要运行的副本数。
你可以稍后通过更新 Deployment 来更改该信息；
[模块 5](/zh-cn/docs/tutorials/kubernetes-basics/scale/scale-intro/)
和[模块 6](/zh-cn/docs/tutorials/kubernetes-basics/update/update-intro/)
讨论了如何扩展和更新 Deployment。

<!--
For your first Deployment, you'll use a hello-node application packaged in a Docker
container that uses NGINX to echo back all the requests. (If you didn't already try
creating a hello-node application and deploying it using a container, you can do
that first by following the instructions from the [Hello Minikube tutorial](/docs/tutorials/hello-minikube/).
-->
对于你第一次部署，你将使用打包在 Docker 容器中的 hello-node 应用，该应用使用 NGINX 回显所有请求。
（如果你尚未尝试创建 hello-node 应用并使用容器进行部署，则可以首先按照
[Hello Minikube 教程](/zh-cn/docs/tutorials/hello-minikube/)中的说明进行操作）。

<!--
You will need to have installed kubectl as well. If you need to install it, visit
[install tools](/docs/tasks/tools/#kubectl).

Now that you know what Deployments are, let's deploy our first app!
-->
你也需要安装好 kubectl。如果你需要安装 kubectl，
参阅[安装工具](/zh-cn/docs/tasks/tools/#kubectl)。

现在你已经了解了部署的内容，让我们部署第一个应用！

<!--
### kubectl basics

The common format of a kubectl command is: `kubectl action resource`.

This performs the specified _action_ (like `create`, `describe` or `delete`) on the
specified _resource_ (like `node` or `deployment`. You can use `--help` after the
subcommand to get additional info about possible parameters (for example: `kubectl get nodes --help`).
-->
### kubectl 基础知识

kubectl 命令的常见格式是：`kubectl action resource`。

这会对指定的**资源**（类似 `node` 或 `deployment`）执行指定的**操作**（类似
`create`、`describe` 或 `delete`）。
你可以在子命令之后使用 `--help` 获取可能参数相关的更多信息
（例如：`kubectl get nodes --help`）。

<!--
Check that kubectl is configured to talk to your cluster, by running the `kubectl version` command.

Check that kubectl is installed and that you can see both the client and the server versions.

To view the nodes in the cluster, run the `kubectl get nodes` command.

You see the available nodes. Later, Kubernetes will choose where to deploy our
application based on Node available resources.
-->
通过运行 `kubectl version` 命令，查看 kubectl 是否被配置为与你的集群通信。

查验 kubectl 是否已安装，你能同时看到客户端和服务器版本。

要查看集群中的节点，运行 `kubectl get nodes` 命令。

你可以看到可用的节点。稍后 Kubernetes 将根据节点可用的资源选择在哪里部署应用。

<!--
### Deploy an app

Let’s deploy our first app on Kubernetes with the `kubectl create deployment` command.
We need to provide the deployment name and app image location (include the full
repository url for images hosted outside Docker Hub).
-->
### 部署一个应用

让我们使用 `kubectl create deployment` 命令在 Kubernetes 上部署第一个应用。
我们需要提供 Deployment 命令以及应用镜像位置（包括托管在 Docker Hub
之外的镜像的完整仓库地址）。

```shell
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

<!--
Great! You just deployed your first application by creating a deployment. This performed a few things for you:

* searched for a suitable node where an instance of the application could be run (we have only 1 available node)
* scheduled the application to run on that Node
* configured the cluster to reschedule the instance on a new Node when needed

To list your deployments use the `kubectl get deployments` command:
-->
很好！你刚刚通过创建 Deployment 部署了第一个应用。这个过程中执行了以下一些操作：

* 搜索应用实例可以运行的合适节点（我们只有一个可用的节点）
* 调度应用在此节点上运行
* 配置集群在需要时将实例重新调度到新的节点上

要列出你的 Deployment，使用 `kubectl get deployments` 命令：

```shell
kubectl get deployments
```

<!--
We see that there is 1 deployment running a single instance of your app. The instance
is running inside a container on your node.
-->
我们看到有 1 个 Deployment 运行应用的单个实例。这个实例运行在节点上的一个容器内。

<!--
### View the app

[Pods](/docs/concepts/workloads/pods/) that are running inside Kubernetes are running
on a private, isolated network. By default they are visible from other pods and services
within the same Kubernetes cluster, but not outside that network. When we use `kubectl`,
we're interacting through an API endpoint to communicate with our application.

We will cover other options on how to expose your application outside the Kubernetes
cluster later, in [Module 4](/docs/tutorials/kubernetes-basics/expose/).
Also as a basic tutorial, we're not explaining what `Pods` are in any
detail here, it will be covered in later topics.
-->
### 查看应用

在 Kubernetes 内运行的 [Pod](/zh-cn/docs/concepts/workloads/pods/) 
运行在一个私有的、隔离的网络上。
默认这些 Pod 可以从同一 Kubernetes 集群内的其他 Pod 和服务看到，但超出这个网络后则看不到。
当我们使用 `kubectl` 时，我们通过 API 端点交互与应用进行通信。

<!--
The `kubectl proxy` command can create a proxy that will forward communications
into the cluster-wide, private network. The proxy can be terminated by pressing
control-C and won't show any output while it's running.

**You need to open a second terminal window to run the proxy.**
-->
`kubectl proxy` 命令可以创建一个代理，将通信转发到集群范围的私有网络。
按下 Ctrl-C 此代理可以被终止，且在此代理运行期间不会显示任何输出。

**你需要打开第二个终端窗口来运行此代理。**

```shell
kubectl proxy
```

<!--
We now have a connection between our host (the terminal) and the Kubernetes cluster.
The proxy enables direct access to the API from these terminals.

You can see all those APIs hosted through the proxy endpoint. For example, we can
query the version directly through the API using the `curl` command:
-->
现在我们在主机（终端）和 Kubernetes 集群之间有一个连接。此代理能够从这些终端直接访问 API。

你可以看到通过代理端点托管的所有 API。
例如，我们可以使用以下 `curl` 命令直接通过 API 查询版本：

```shell
curl http://localhost:8001/version
```

{{< note >}}
<!--
If port 8001 is not accessible, ensure that the `kubectl proxy` that you started
above is running in the second terminal.
-->
如果 Port 8001 不可访问，确保你上述启动的 `kubectl proxy` 运行在第二个终端中。
{{< /note >}}

<!--
The API server will automatically create an endpoint for each pod, based on the
pod name, that is also accessible through the proxy.

First we need to get the Pod name, and we'll store it in the environment variable `POD_NAME`.
-->
API 服务器将基于也能通过代理访问的 Pod 名称为每个 Pod 自动创建端点。

首先我们需要获取 Pod 名称，我们将存储到环境变量 `POD_NAME` 中：

```shell
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Name of the Pod: $POD_NAME
```

<!--
You can access the Pod through the proxied API, by running:
-->
你可以运行以下命令通过代理的 API 访问 Pod：

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

<!--
In order for the new Deployment to be accessible without using the proxy, a Service
is required which will be explained in [Module 4](/docs/tutorials/kubernetes-basics/expose/).
-->
为了不使用代理也能访问新的 Deployment，需要一个 Service，
这将在下一个[模块 4](/zh-cn/docs/tutorials/kubernetes-basics/expose/)
中讲述。

## {{% heading "whatsnext" %}}

<!--
* Tutorial [Viewing Pods and Nodes](/docs/tutorials/kubernetes-basics/explore/explore-intro/).
* Learn more about [Deployments](/docs/concepts/workloads/controllers/deployment/).
-->
* [查看 Pod 和节点](/zh-cn/docs/tutorials/kubernetes-basics/explore/explore-intro/)教程。
* 了解更多关于 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 的信息。
