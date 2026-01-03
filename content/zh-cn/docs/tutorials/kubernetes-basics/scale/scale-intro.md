---
title: 运行多实例的应用
weight: 10
---
<!--
title: Running Multiple Instances of Your App
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Scale an existing app manually using kubectl.
-->
* 使用 kubectl 手动扩缩现有的应用

<!--
## Scaling an application
-->
## 扩缩应用

{{% alert %}}
<!--
_You can create from the start a Deployment with multiple instances using the --replicas
parameter for the kubectl create deployment command._
-->
**通过在使用 `kubectl create deployment` 命令时设置 `--replicas` 参数，
你可以在启动 Deployment 时创建多个实例。**
{{% /alert %}}

<!--
Previously we created a [Deployment](/docs/concepts/workloads/controllers/deployment/),
and then exposed it publicly via a [Service](/docs/concepts/services-networking/service/).
The Deployment created only one Pod for running our application. When traffic increases,
we will need to scale the application to keep up with user demand.

If you haven't worked through the earlier sections, start from
[Using minikube to create a cluster](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/).

_Scaling_ is accomplished by changing the number of replicas in a Deployment.
-->
之前我们创建了一个 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)，
然后通过 [Service](/zh-cn/docs/concepts/services-networking/service/) 让其可以公开访问。
Deployment 仅创建了一个 Pod 用于运行这个应用。当流量增加时，我们需要扩容应用满足用户需求。

如果你还没有学习过之前的章节，
需要从[使用 Minikube 创建集群](/zh-cn/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/)开始。

扩缩是通过改变 Deployment 中的副本数量来实现的。

{{< note >}}
<!--
If you are trying this after the
[previous section](/docs/tutorials/kubernetes-basics/expose/expose-intro/), then you
may have deleted the service you created, or have created a Service of `type: NodePort`.
In this section, it is assumed that a service with `type: LoadBalancer` is created
for the kubernetes-bootcamp Deployment.

If you have _not_ deleted the Service created in
[the previous section](/docs/tutorials/kubernetes-basics/expose/expose-intro),
first delete that Service and then run the following command to create a new Service
with its `type` set to `LoadBalancer`:
-->
如果你是在[上一节](/zh-cn/docs/tutorials/kubernetes-basics/expose/expose-intro/)之后尝试此操作，
那么你可能已经删除了创建的 Service 或已创建了 `type: NodePort` 类型的 Service。
在本节中，假设你已经为 kubernetes-bootcamp Deployment 创建了 `type: LoadBalancer`
类型的 Service。

如果你**没有**删除在[前一节](/zh-cn/docs/tutorials/kubernetes-basics/expose/expose-intro)中创建的 Service，
请先删除该 Service，然后运行以下命令来创建一个新的 `type` 设置为 `LoadBalancer` 的 Service：

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```
{{< /note >}}

<!--
## Scaling overview
-->
## 扩缩概述

{{< tutorials/carousel id="myCarousel" interval="3000" >}}
{{< tutorials/carousel-item
     image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg"
     active="true" >}}

{{< tutorials/carousel-item
     image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
<!--
_Scaling is accomplished by changing the number of replicas in a Deployment._
-->
**扩缩是通过改变 Deployment 中的副本数量来实现的。**
{{% /alert %}}

<!--
Scaling out a Deployment will ensure new Pods are created and scheduled to Nodes
with available resources. Scaling will increase the number of Pods to the new desired
state. Kubernetes also supports [autoscaling](/docs/concepts/workloads/autoscaling/)
of Pods, but it is outside of the scope of this tutorial. Scaling to zero is also
possible, and it will terminate all Pods of the specified Deployment.
-->
对 Deployment 横向扩容将保证新的 Pod 被创建并调度到有可用资源的 Node 上，
扩容会将 Pod 数量增加至新的预期状态。
Kubernetes 还支持 Pod 的[自动扩缩容](/zh-cn/docs/concepts/workloads/autoscaling/)，
但这并不在本教程的讨论范围内。
将 Pod 数量收缩到 0 也是可以的，这会终止指定 Deployment 上所有的 Pod。

<!--
Running multiple instances of an application will require a way to distribute the
traffic to all of them. Services have an integrated load-balancer that will distribute
network traffic to all Pods of an exposed Deployment. Services will monitor continuously
the running Pods using endpoints, to ensure the traffic is sent only to available Pods.

Once you have multiple instances of an application running, you would be able to
do Rolling updates without downtime. We'll cover that in the next section of the
tutorial. Now, let's go to the terminal and scale our application.
-->
运行多实例的应用，需要有方法在多个实例之间分配流量。Service 有一个集成的负载均衡器，
将网络流量分配到一个可公开访问的 Deployment 的所有 Pod 上。
Service 将会通过 Endpoints 来持续监视运行中的 Pod 集合，保证流量只分配到可用的 Pod 上。

一旦有了多个应用实例，就可以进行滚动更新而不会出现服务中断情况。我们将会在教程的下一节介绍这些内容。
现在让我们进入终端，扩缩我们的应用。

<!--
### Scaling a Deployment

To list your Deployments, use the `get deployments` subcommand:
-->
### 扩缩 Deployment

要列出你的 Deployment，可以使用 `get deployments` 子命令：

```shell
kubectl get deployments
```

<!--
The output should be similar to:
-->
输出应该类似这样：

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

<!--
We should have 1 Pod. If not, run the command again. This shows:

* _NAME_ lists the names of the Deployments in the cluster.
* _READY_ shows the ratio of CURRENT/DESIRED replicas
* _UP-TO-DATE_ displays the number of replicas that have been updated to achieve the desired state.
* _AVAILABLE_ displays how many replicas of the application are available to your users.
* _AGE_ displays the amount of time that the application has been running.

To see the ReplicaSet created by the Deployment, run:
-->
我们应该有 1 个 Pod。如果没有，请重新运行命令。结果显示：

* **NAME** 列出了集群中的 Deployment 的名称。
* **READY** 显示当前副本数与期望副本数的比例。
* **UP-TO-DATE** 显示已更新至期望状态的副本数。
* **AVAILABLE** 显示可用的 Pod 的数量。
* **AGE** 显示应用已运行的时间。

```shell
kubectl get rs
```

<!--
Notice that the name of the ReplicaSet is always formatted as
<nobr>[DEPLOYMENT-NAME]-[RANDOM-STRING]</nobr>.
The random string is randomly generated and uses the pod-template-hash as a seed.

Two important columns of this output are:
-->
注意 ReplicaSet 名称总是遵循 <nobr>[DEPLOYMENT-NAME]-[RANDOM-STRING]</nobr> 的格式。
随机字符串是使用 `pod-template-hash` 作为种子随机生成的。

两个重要的列是：
<!--
* _DESIRED_ displays the desired number of replicas of the application, which you
define when you create the Deployment. This is the desired state.
* _CURRENT_ displays how many replicas are currently running.

Next, let’s scale the Deployment to 4 replicas. We’ll use the `kubectl scale` command,
followed by the Deployment type, name and desired number of instances:
-->
* **DESIRED** 显示期望应用具有的副本数量，在你创建 Deployment 时要定义这个值。这是期望的状态。
* **CURRENT** 显示当前正在运行的副本数量。

接下来，让我们将 Deployment 扩容到 4 个副本。
我们将使用 `kubectl scale` 命令，后面给出 Deployment 类别、名称和预期的实例数量：

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

<!--
To list your Deployments once again, use `get deployments`:
-->
要再次列举出你的 Deployment 集合，使用 `get deployments`：

```shell
kubectl get deployments
```

<!--
The change was applied, and we have 4 instances of the application available. Next,
let’s check if the number of Pods changed:
-->
更改已经被应用，我们有 4 个应用实例可用。接下来，让我们检查 Pod 的数量是否发生变化：

```shell
kubectl get pods -o wide
```

<!--
There are 4 Pods now, with different IP addresses. The change was registered in
the Deployment events log. To check that, use the `describe` subcommand:
-->
现在有 4 个 Pod，各有不同的 IP 地址。这一变化会记录到 Deployment 的事件日志中。
要检查这一点，可以使用 `describe` 子命令：

```shell
kubectl describe deployments/kubernetes-bootcamp
```

<!--
You can also view in the output of this command that there are 4 replicas now.
-->
你还可以从该命令的输出中看到，现在有 4 个副本。

<!--
### Load Balancing

Let's check that the Service is load-balancing the traffic. To find out the exposed
IP and Port we can use `describe service` as we learned in the previous part of the tutorial:
-->
### 负载均衡

让我们来检查 Service 是否在进行流量负载均衡。要查找对外公开的 IP 和端口，
我们可以使用在教程之前部份学到的 `describe services`：

```shell
kubectl describe services/kubernetes-bootcamp
```

<!--
Create an environment variable called NODE_PORT that has a value as the Node port:
-->
创建一个名为 `NODE_PORT` 的环境变量，值为 Node 的端口：

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

<!--
Next, we’ll do a `curl` to the exposed IP address and port. Execute the command multiple times:
-->
接下来，我们将使用 `curl` 访问对外公开的 IP 和端口。多次执行以下命令：

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

<!--
We hit a different Pod with every request. This demonstrates that the load-balancing is working.

The output should be similar to:
-->
我们每个请求都命中了不同的 Pod，这证明负载均衡正在工作。

输出应该类似于：

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< note >}}
<!--
If you're running minikube with Docker Desktop as the container driver, a minikube
tunnel is needed. This is because containers inside Docker Desktop are isolated
from your host computer.

In a separate terminal window, execute:
-->
如果你使用 Docker Desktop 作为容器驱动程序运行 Minikube，则需要使用 Minikube 隧道。
这是因为 Docker Desktop 内的容器与主机隔离。

在另一个终端窗口中，执行：

```shell
minikube service kubernetes-bootcamp --url
```

<!--
The output looks like this:
-->
输出类似于：

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

<!--
Then use the given URL to access the app:
-->
然后使用给定的 URL 访问应用：

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

<!--
### Scale Down

To scale down the Deployment to 2 replicas, run again the `scale` subcommand:
-->
### 缩容

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

<!--
List the Deployments to check if the change was applied with the `get deployments` subcommand:
-->
要检查更改是否已应用，可使用 `get deployments` 子命令：

```shell
kubectl get deployments
```

<!--
The number of replicas decreased to 2. List the number of Pods, with `get pods`:
-->
副本数量减少到了 2 个，要列出 Pod 的数量，使用 `get pods` 列举 Pod：

```shell
kubectl get pods -o wide
```

<!--
This confirms that 2 Pods were terminated.
-->
这证实了有 2 个 Pod 被终止。

## {{% heading "whatsnext" %}}

<!--
* Tutorial
[Performing a Rolling Update](/docs/tutorials/kubernetes-basics/update/update-intro/).
* Learn more about [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/).
* Learn more about [Autoscaling](/docs/concepts/workloads/autoscaling/).
-->
* [滚动更新](/zh-cn/docs/tutorials/kubernetes-basics/update/update-intro/)教程。
* 了解更多关于 [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)。
* 了解更多关于[自动伸缩](/zh-cn/docs/concepts/workloads/autoscaling/)。
