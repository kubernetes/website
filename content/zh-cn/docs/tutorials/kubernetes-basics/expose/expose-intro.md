---
title: 使用 Service 公开你的应用
weight: 10
---
<!--
title: Using a Service to Expose Your App
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Learn about a Service in Kubernetes.
* Understand how labels and selectors relate to a Service.
* Expose an application outside a Kubernetes cluster.
-->
* 了解 Kubernetes 中的 Service
* 了解标签（Label）和选择算符（Selector）如何与 Service 关联
* 用 Service 向 Kubernetes 集群外公开应用

<!--
## Overview of Kubernetes Services

Kubernetes [Pods](/docs/concepts/workloads/pods/) are mortal. Pods have a
[lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/). When a worker node dies,
the Pods running on the Node are also lost. A [Replicaset](/docs/concepts/workloads/controllers/replicaset/)
might then dynamically drive the cluster back to the desired state via the creation
of new Pods to keep your application running. As another example, consider an image-processing
backend with 3 replicas. Those replicas are exchangeable; the front-end system should
not care about backend replicas or even if a Pod is lost and recreated. That said,
each Pod in a Kubernetes cluster has a unique IP address, even Pods on the same Node,
so there needs to be a way of automatically reconciling changes among Pods so that your
applications continue to function.
-->
## Kubernetes Service 概述   {#overview-of-kubernetes-services}

Kubernetes [Pod](/zh-cn/docs/concepts/workloads/pods/) 是有生命期的。
Pod 拥有[生命周期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。
当一个工作节点停止工作后，在节点上运行的 Pod 也会消亡。
[ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)
会自动地通过创建新的 Pod 驱动集群回到期望状态，以保证应用正常运行。
换一个例子，考虑一个具有 3 个副本的用作图像处理的后端程序。
这些副本是彼此可替换的。前端系统不应该关心后端副本，即使某个 Pod 丢失或被重新创建。
此外，Kubernetes 集群中的每个 Pod 都有一个唯一的 IP 地址，即使是在同一个 Node 上的 Pod 也是如此，
因此需要一种方法来自动协调 Pod 集合中的变化，以便应用保持运行。

{{% alert %}}
<!--
_A Kubernetes Service is an abstraction layer which defines a logical set of Pods and
enables external traffic exposure, load balancing and service discovery for those Pods._
-->
**Kubernetes 的 Service 是一个抽象层，它所定义的是 Pod 的一个逻辑集合，
并为这些 Pod 支持外部流量公开、负载平衡和服务发现。**
{{% /alert %}}

<!--
A [Service](/docs/concepts/services-networking/service/) in Kubernetes is an abstraction
which defines a logical set of Pods and a policy by which to access them. Services
enable a loose coupling between dependent Pods. A Service is defined using YAML or JSON,
like all Kubernetes object manifests. The set of Pods targeted by a Service is usually
determined by a _label selector_ (see below for why you might want a Service without
including a `selector` in the spec).
-->
Kubernetes 中的 [Service](/zh-cn/docs/concepts/services-networking/service/)
是一种抽象概念，它定义的是 Pod 的一个逻辑集合和一种用来访问 Pod 的协议。
Service 使从属 Pod 之间的松耦合成为可能。
和所有 Kubernetes 对象清单一样，Service 用 YAML 或者 JSON 来定义。
Service 下的一组 Pod 通常由一个**标签选择算符**来标记
（请参阅下面的说明来了解为什么你可能想要一个 spec 中不包含 `selector` 的 Service）。

<!--
Although each Pod has a unique IP address, those IPs are not exposed outside the
cluster without a Service. Services allow your applications to receive traffic.
Services can be exposed in different ways by specifying a `type` in the `spec` of the Service:
-->
虽然每个 Pod 都有唯一的 IP 地址，但如果没有 Service，这些 IP 地址不会公开到集群外部。
Service 允许你的应用接收流量。通过在 Service 的 `spec` 中指定 `type`，可以以不同的方式公开 Service：

<!--
* _ClusterIP_ (default) - Exposes the Service on an internal IP in the cluster. This
type makes the Service only reachable from within the cluster.

* _NodePort_ - Exposes the Service on the same port of each selected Node in the cluster using NAT.
Makes a Service accessible from outside the cluster using `NodeIP:NodePort`. Superset of ClusterIP.

* _LoadBalancer_ - Creates an external load balancer in the current cloud (if supported)
and assigns a fixed, external IP to the Service. Superset of NodePort.

* _ExternalName_ - Maps the Service to the contents of the `externalName` field
(e.g. `foo.bar.example.com`), by returning a `CNAME` record with its value.
No proxying of any kind is set up. This type requires v1.7 or higher of `kube-dns`,
or CoreDNS version 0.0.8 or higher.
-->
* **ClusterIP**（默认）- 在集群的内部 IP 上公开 Service。
  这种类型使得 Service 只能从集群内访问。
* **NodePort** - 使用 NAT 在集群中每个选定 Node 的相同端口上公开 Service 。
  使用 `NodeIP:NodePort` 从集群外部访问 Service。这是 ClusterIP 的超集。
* **LoadBalancer** - 在当前云中创建一个外部负载均衡器（如果支持的话），
  并为 Service 分配一个固定的外部 IP。这是 NodePort 的超集。
* **ExternalName** - 将 Service 映射到 `externalName`
  字段的内容（例如 `foo.bar.example.com`），
  通过返回带有该名称的 `CNAME` 记录实现。不设置任何类型的代理。
  这种类型需要 `kube-dns` 的 v1.7 或更高版本，或者 CoreDNS 的 v0.8 或更高版本。

<!--
More information about the different types of Services can be found in the
[Using Source IP](/docs/tutorials/services/source-ip/) tutorial. Also see
[Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/).

Additionally, note that there are some use cases with Services that involve not defining
a `selector` in the spec. A Service created without `selector` will also not create
the corresponding Endpoints object. This allows users to manually map a Service to
specific endpoints. Another possibility why there may be no selector is you are strictly
using `type: ExternalName`.
-->
关于不同 Service 类型的更多信息可以在[使用源 IP](/zh-cn/docs/tutorials/services/source-ip/)
教程找到。也请参阅[使用 Service 连接到应用](/zh-cn/docs/tutorials/services/connect-applications-service/)。

另外，需要注意的是有一些 Service 的用例不需要在 spec 中定义 `selector`。
一个创建时未设置 `selector` 的 Service 也不会创建相应的 Endpoints 对象。
这允许用户手动将 Service 映射到特定的端点。
没有 `selector` 的另一种可能是你在严格使用 `type: ExternalName` Service。

<!--
## Services and Labels

A Service routes traffic across a set of Pods. Services are the abstraction that allows
pods to die and replicate in Kubernetes without impacting your application. Discovery
and routing among dependent Pods (such as the frontend and backend components in an application)
are handled by Kubernetes Services.
-->
## Service 和标签   {#services-and-labels}

Service 为一组 Pod 提供流量路由。Service 是一种抽象，
使得 Kubernetes 中的 Pod 死亡和复制不会影响应用。
在依赖的 Pod（如应用中的前端和后端组件）之间进行发现和路由是由
Kubernetes Service 处理的。

<!--
Services match a set of Pods using
[labels and selectors](/docs/concepts/overview/working-with-objects/labels), a grouping
primitive that allows logical operation on objects in Kubernetes. Labels are key/value
pairs attached to objects and can be used in any number of ways:

* Designate objects for development, test, and production
* Embed version tags
* Classify an object using tags
-->
Service 通过[标签和选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels)来匹配一组 Pod。
标签和选择算符是允许对 Kubernetes 中的对象进行逻辑操作的一种分组原语。
标签是附加在对象上的键/值对，可以以多种方式使用：

* 指定用于开发、测试和生产的对象
* 嵌入版本标记
* 使用标记将对象分类

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_04_labels.svg" class="diagram-medium" >}}

<!--
Labels can be attached to objects at creation time or later on. They can be modified
at any time. Let's expose our application now using a Service and apply some labels.
-->
标签可以在对象创建时或之后附加到对象上，它们可以随时被修改。
现在使用 Service 发布我们的应用并添加一些标签。

<!--
### Step 1: Creating a new Service

Let’s verify that our application is running. We’ll use the `kubectl get` command
and look for existing Pods:
-->
### 第一步：创建新 Service   {#step1-creating-a-new-service}

让我们来验证我们的应用正在运行。我们将使用 `kubectl get`
命令并查找现有的 Pod：

```shell
kubectl get pods
```

<!--
If no Pods are running then it means the objects from the previous tutorials were
cleaned up. In this case, go back and recreate the deployment from the
[Using kubectl to create a Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app)
tutorial. Please wait a couple of seconds and list the Pods again. You can continue
once you see the one Pod running.

Next, let’s list the current Services from our cluster:
-->
如果没有 Pod 正在运行，则意味着之前教程中的对象已被清理。这时，
请返回并参考[使用 kubectl 创建 Deployment](/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app)
教程重新创建 Deployment。
请等待几秒钟，然后再次列举 Pod。一旦看到一个 Pod 正在运行，你就可以继续了。

接下来，让我们列举当前集群中的 Service：

```shell
kubectl get services
```

<!--
To expose the deployment to external traffic, we'll use the kubectl expose command with the --type=NodePort option:
-->
为了将 Deployment 公开给外部流量，我们将使用 `kubectl expose` 命令和 `--type=NodePort` 选项：

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

<!--
We have now a running Service called kubernetes-bootcamp. Here we see that the Service
received a unique cluster-IP, an internal port and an external-IP (the IP of the Node).

To find out what port was opened externally (for the `type: NodePort` Service) we’ll
run the `describe service` subcommand:
-->
我们现在有一个运行中的 Service 名为 kubernetes-bootcamp。
这里我们看到 Service 收到了一个唯一的集群内 IP（Cluster-IP）、一个内部端口和一个外部 IP
（External-IP）（Node 的 IP）。

要得到外部打开的端口号（对于 `type: NodePort` 的 Service），
我们需要运行 `describe service` 子命令：

```shell
kubectl describe services/kubernetes-bootcamp
```

<!--
Create an environment variable called `NODE_PORT` that has the value of the Node
port assigned:
-->
创建一个名为 `NODE_PORT` 的环境变量，它的值为所分配的 Node 端口：

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

<!--
Now we can test that the app is exposed outside of the cluster using `curl`, the
IP address of the Node and the externally exposed port:
-->
现在我们可以使用 `curl`、Node 的 IP 地址和对外公开的端口，
来测试应用是否已经被公开到了集群外部：

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

{{< note >}}
<!--
If you're running minikube with Docker Desktop as the container driver, a minikube
tunnel is needed. This is because containers inside Docker Desktop are isolated
from your host computer.

In a separate terminal window, execute:
-->
如果你正在使用 Docker Desktop 作为容器驱动来运行 minikube，需要使用
minikube 隧道。这是因为 Docker Desktop 内部的容器和宿主机是隔离的。

在另一个终端窗口中，执行：

```shell
minikube service kubernetes-bootcamp --url
```

<!--
The output looks like this:
-->
输出结果如下：

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

<!--
Then use the given URL to access the app:
-->
然后使用提供的 URL 访问应用：

```shell
curl 127.0.0.1:51082
```
{{< /note >}}

<!--
And we get a response from the server. The Service is exposed.

### Step 2: Using labels

The Deployment created automatically a label for our Pod. With the `describe deployment`
subcommand you can see the name (the _key_) of that label:
-->
然后我们就会收到服务器的响应。Service 已经被公开出来。

### 第二步：使用标签   {#step2-using-labels}

Deployment 自动给我们的 Pod 创建了一个标签。通过 `describe deployment`
子命令你可以看到那个标签的名称（对应 `key`）：

```shell
kubectl describe deployment
```

<!--
Let’s use this label to query our list of Pods. We’ll use the `kubectl get pods`
command with `-l` as a parameter, followed by the label values:
-->
让我们使用这个标签来查询 Pod 列表。我们将使用 `kubectl get pods`
命令和 `-l` 参数，后面给出标签值：

```shell
kubectl get pods -l app=kubernetes-bootcamp
```

<!--
You can do the same to list the existing Services:
-->
你可以用同样的方法列出现有的 Service：

```shell
kubectl get services -l app=kubernetes-bootcamp
```

<!--
Get the name of the Pod and store it in the POD_NAME environment variable:
-->
获取 Pod 的名称，然后存放到 `POD_NAME` 环境变量：

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo "Name of the Pod: $POD_NAME"
```

<!--
To apply a new label we use the label subcommand followed by the object type,
object name and the new label:
-->
要应用一个新的标签，我们使用 `label` 子命令，
接着是对象类型、对象名称和新的标签：

```shell
kubectl label pods "$POD_NAME" version=v1
```

<!--
This will apply a new label to our Pod (we pinned the application version to the Pod),
and we can check it with the `describe pod` command:
-->
这将会在我们的 Pod 上应用一个新标签（我们把应用版本锁定到 Pod 上），
然后我们可以通过 `describe pods` 命令检查它：

```shell
kubectl describe pods "$POD_NAME"
```

<!--
We see here that the label is attached now to our Pod. And we can query now the
list of pods using the new label:
-->
我们可以看到现在标签已经被附加到我们的 Pod 上。
我们可以通过新的标签来查询 Pod 列表：

```shell
kubectl get pods -l version=v1
```

<!--
And we see the Pod.
-->
我们看到了对应的 Pod。

<!--
### Step 3: Deleting a service

To delete Services you can use the `delete service` subcommand. Labels can be used
also here:
-->
### 第三步：删除一个 Service   {#step3-deleting-a-service}

要删除一个 Service 你可以使用 `delete service` 子命令。这里也可以使用标签：

```shell
kubectl delete service -l app=kubernetes-bootcamp
```

<!--
Confirm that the Service is gone:
-->
确认对应的 Service 已经消失：

```shell
kubectl get services
```

<!--
This confirms that our Service was removed. To confirm that route is not exposed
anymore you can `curl` the previously exposed IP and port:
-->
这里确认了我们的 Service 已经被删除。要确认路由已经不再被公开，
你可以 `curl` 之前公开的 IP 和端口：

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

<!--
This proves that the application is not reachable anymore from outside of the cluster.
You can confirm that the app is still running with a `curl` from inside the pod:
-->
这证明了集群外部已经不再可以访问应用。
你可以通过在 Pod 内部运行 `curl` 确认应用仍在运行：

```shell
kubectl exec -ti $POD_NAME -- curl http://localhost:8080
```

<!--
We see here that the application is up. This is because the Deployment is managing
the application. To shut down the application, you would need to delete the Deployment
as well.
-->
这里我们看到应用是运行状态。这是因为 Deployment 正在管理应用。
要关闭应用，你还需要删除 Deployment。

## {{% heading "whatsnext" %}}

<!--
* Tutorial
[Running Multiple Instances of Your App](/docs/tutorials/kubernetes-basics/scale/scale-intro/).
* Learn more about [Service](/docs/concepts/services-networking/service/).
-->
* [运行应用的多个实例](/zh-cn/docs/tutorials/kubernetes-basics/scale/scale-intro/)的教程。
* 进一步了解 [Service](/zh-cn/docs/concepts/services-networking/service/)。
