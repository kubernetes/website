---
assignees:
- erictune
title: Pod Overview
redirect_from:
- "/docs/concepts/abstractions/pod/"
- "/docs/concepts/abstractions/pod.html"
- "/docs/user-guide/pod-templates/"
- "/docs/user-guide/pod-templates.html"
---

<!--
{% capture overview %}
This page provides an overview of `Pod`, the smallest deployable object in the Kubernetes object model.
{% endcapture %}
-->
{% capture overview %}
这章概述了在 Kubernetes 对象模式里最小的可部署单元 `Pod`
{% endcapture %}

<!--  
{:toc}

{% capture body %}
## Understanding Pods

A *Pod* is the basic building block of Kubernetes--the smallest and simplest unit in the Kubernetes object model that you create or deploy. A Pod represents a running process on your cluster.

A Pod encapsulates an application container (or, in some cases, multiple containers), storage resources, a unique network IP, and options that govern how the container(s) should run. A Pod represents a unit of deployment: *a single instance of an application in Kubernetes*, which might consist of either a single container or a small number of containers that are tightly coupled and that share resources.

> [Docker](https://www.docker.com) is the most common container runtime used in a Kubernetes Pod, but Pods support other container runtimes as well.
-->
{:toc}

{% capture body %}
##什么是 Pod

*Pod* 是 Kubernetes 最基本的组成块 -- 这是 Kubernetes 最小、最简单的可用来创建和部署的单元。 一个 Pod 代表了一个运行在集群里的进程。

Pod 里封装了一个（或者多个）应用容器，存储资源，以及惟一的网络 IP，和指导容器如何运行的选贤。 一个 Pod 表示这样一组部署： 由一个容器或者一组紧耦合容器组成共享资源的 *Kubernets 应用实例*，

> [Docker](https://www.docker.com)是 Kubernetes Pod 里最常见的运行环境， 当然 Pod 也支持其他的容器环境。

<!--
Pods are employed in a number of ways in a Kubernetes cluster, including:

* **Pods that run a single container**. The "one-container-per-Pod" model is the most common Kubernetes use case; in this case, you can think of a Pod as a wrapper around a single container, and Kubernetes manages the Pods rather than the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod might encapsulate an application composed of multiple co-located containers that are tightly coupled and need to share resources. These co-located containers might form a single cohesive unit of service--one container serving files from a shared volume to the public, while a separate "sidecar" container refreshes or updates those files. The Pod wraps these containers and storage resources together as a single manageable entity.
-->
Kubernetes 运用 pod 的方式：

* **Pod 里只运行一个单独容器** "one-container-per-Pod" 模式是 Kubernetes 最常见的使用场景；在这种情况下，可以把 Pod 看做是一个单独容器的连接器， Kubernetes 通过 Pod 去管理容器。
* **Pod 中运行多个相互作用容器**。 Pod 封装了一组紧耦合、共享资源、协同寻址的容器。 这些协同寻址的容器可能来自一组粘性很强的服务 -- 比如说：在用容器的共享卷提供对外文件服务的同时用 "sidecar" 容器刷新、更新这些文件。Pod 将这些容器和存储资源打包成一个管理实体。

<!--
The [Kubernetes Blog](http://blog.kubernetes.io) has some additional information on Pod use cases. For more information, see:

* [The Distributed System Toolkit: Patterns for Composite Containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html)
* [Container Design Patterns](http://blog.kubernetes.io/2016/06/container-design-patterns.html)

Each Pod is meant to run a single instance of a given application. If you want to scale your application horizontally (e.g., run multiple instances), you should use multiple Pods, one for each instance. In Kubernetes, this is generally referred to as _replication_. Replicated Pods are usually created and managed as a group by an abstraction called a Controller. See [Pods and Controllers](#pods-and-controllers) for more information.
-->
更多关于 Pod 应用场景可以在[Kubernetes 博客](http://blog.kubernetes.io)里找到。 详细内容如下：

* [分布式系统工具箱: 混合容器模式](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html)。
* [容器设计模式](http://blog.kubernetes.io/2016/06/container-design-patterns.html)。

每一个 Pod 都是一个指定应用的实例。 如果想水平扩展某个应用（比如说：跑多个实例），应该部署多个 Pod 每个 pod 对应一个实例。 在 Kubernet 术语里， 这种方式被称为_replication_。 Replicated Pod 通常是由一个被称为 Controller 的抽象来创建和管理的。更多信息请参见 [Pods and Controllers](#pods-and-controllers)。
<!--
### How Pods manage multiple Containers

Pods are designed to support multiple cooperating processes (as containers) that form a cohesive unit of service. The containers in a Pod are automatically co-located and co-scheduled on the same physical or virtual machine in the cluster. The containers can share resources and dependencies, communicate with one another, and coordinate when and how they are terminated.

Note that grouping multiple co-located and co-managed containers in a single Pod is a relatively advanced use case. You should use this pattern only in specific instances in which your containers are tightly coupled. For example, you might have a container that acts as a web server for files in a shared volume, and a separate "sidecar" container that updates those files from a remote source, as in the following diagram:

![pod diagram](/images/docs/pod.svg){: style="max-width: 50%" }

Pods provide two kinds of shared resources for their constituent containers: *networking* and *storage*.

-->
### Pod 如何管理多个容器

Pod 被设计成支持用多个相互协作的进程（比如说：容器）来构成一组高粘性的服务。 Pod 的容器能在集群里的物理或者虚拟机上自动协同寻址、协同调度到同一台机器上。 容器之间能够共享资源和依赖，能相互通信，还能相互协调容器终止的方式和终止的时间点。

在高级应用中我们将一组协同寻址，协同管理的容器放到一个单独的 Pod 里. 这种模式往往被运用在容器紧耦合的场景里。比如说：你可以部署一个容器充当共享卷里文件的 web 服务器同时用 "sidecar" 容器来更新文件， 示例图如下：

![pod 图](/images/docs/pod.svg){: style="max-width: 50%" }

Pod 为它的容器们提供了两类共享资源： *网络*和*存储*

<!--

#### Networking

Each Pod is assigned a unique IP address. Every container in a Pod shares the network namespace, including the IP address and network ports. Containers *inside a Pod* can communicate with one another using `localhost`. When containers in a Pod communicate with entities *outside the Pod*, they must coordinate how they use the shared network resources (such as ports).

#### Storage

A Pod can specify a set of shared storage *volumes*. All containers in the Pod can access the shared volumes, allowing those containers to share data. Volumes also allow persistent data in a Pod to survive in case one of the containers within needs to be restarted. See Volumes for more information on how Kubernetes implements shared storage in a Pod.
-->
#### 网络
每一个 Pod 都被分配了一个唯一的 IP 地址。pod 里的所有容器共享着一个网络空间，这个网络空间包含了 IP 地址和网络端口。*Pod 内部*的容器彼此之间可以通过 `localhost` 相互通信。 但当 Pod 里的容器需要与*Pod 以外*实体进行通信时，就要使用到这个共享网络资源了（比如说：端口）。

####存储

Pod 可以指定一系列的共享存储*卷*。Pod 里所有的容器都由权限访问这个共享卷，同时也可以使用这个共享卷来分享数据。 卷的出现使 Pod 能够支持数据持久性，这样就算是在 Pod 内部容器需要重启的场景里，数据也可以长期保持。 更多关于卷的内容请参见[Kubernets 如何在 Pod 上实现共享存储]。
<!--
## Working with Pods

You'll rarely create individual Pods directly in Kubernetes--even singleton Pods. This is because Pods are designed as relatively ephemeral, disposable entities. When a Pod gets created (directly by you, or indirectly by a Controller), it is scheduled to run on a Node in your cluster. The Pod remains on that Node until the process is terminated, the pod object is deleted, or the pod is *evicted* for lack of resources, or the Node fails.

> Note: Restarting a container in a Pod should not be confused with restarting the Pod. The Pod itself does not run, but is an environment the containers run in and persists until it is deleted.
-->
在 Kubernets 里很少直接创建一个单独的 Pod - 就算是在只有一个 pod 的场景里也是这样。 从设计上来说 Pod 是一个一次性的、短暂的实体，在创建一个 Pod（直接被创建，或者是通过 Controller 间接创建）时，这个 pod 会被调用到集群里某一个节点上。 除非 Pod 进程被终止，或者 pod 对象被删除，或者由于缺少资源、节点失败等原因 pod 被*驱逐*，Pod 将一直存在在这个节点上。
<!--
Pods do not, by themselves, self-heal. If a Pod is scheduled to a Node that fails, or if the scheduling operation itself fails, the Pod is deleted; likewise, a Pod won't survive an eviction due to a lack of resources or Node maintenance. Kubernetes uses a higher-level abstraction, called a *Controller*, that handles the work of managing the relatively disposable Pod instances. Thus, while it is possible to use Pod directly, it's far more common in Kubernetes to manage your pods using a Controller. See [Pods and Controllers](#pods-and-controllers) for more information on how Kubernetes uses Controllers to implement Pod scaling and healing.

### Pods and Controllers

A Controller can create and manage multiple Pods for you, handling replication and rollout and providing self-healing capabilities at cluster scope. For example, if a Node fails, the Controller might automatically replace the Pod by scheduling an identical replacement on a different Node. 

Some examples of Controllers that contain one or more pods include:

* Deployment
* [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/)
* DaemonSet

In general, Controllers use a Pod Template that you provide to create the Pods for which it is responsible.
-->
从 pod 本身而言，它不具备自我恢复的功能。如果 pod 被调度到一个宕机的节点，或者调度的操作本身就失败了，那么这个 pod 立刻会被删除；这个场景同样适用于缺少资源或者节点宕机的情况。Kubernetes 使用一个称作 *Controller* 高度抽象来管理相对可删除 pod。因此与单独直接使用一个 pod 相比，在 Kubernets 里更常见的情况是使用一个 Controller来管理所有的 pod。 更多关于 Kubernetes 如何使用Controllers 实现 Pod 扩展和自我恢复的内容请参见 [Pods and Controllers](#pods-and-controllers)。

### Pods and Controllers
一个 Controllers 可以创建和管理很多个 Pod, 也提供复制、初始化，以及提供集群范围的自我恢复的功能。比如说： 如果一个节点宕机，Controller 将调度一个在其他节点上完全相同的 pod 来自动取代当前的 pod。

下面这些是 Controllers 里包含多个 pod 的具体例子：

* Deployment
* [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/)
* DaemonSet  

普遍来说，Controllers 使用用户提供的 Pod 模版来创建、控制 pod。
<!--
## Pod Templates

Pod templates are pod specifications which are included in other objects, such as
[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).  Controllers use Pod Templates to make actual pods.

Rather than specifying the current desired state of all replicas, pod templates are like cookie cutters. Once a cookie has been cut, the cookie has no relationship to the cutter. There is no quantum entanglement. Subsequent changes to the template or even switching to a new template has no direct effect on the pods already created. Similarly, pods created by a replication controller may subsequently be updated directly. This is in deliberate contrast to pods, which do specify the current desired state of all containers belonging to the pod. This approach radically simplifies system semantics and increases the flexibility of the primitive.

{% endcapture %}

{% capture whatsnext %}
* Learn more about Pod behavior:
  * Pod Termination
  * Other Pod Topics
{% endcapture %}

{% include templates/concept.md %}
-->
## Pod 模版

Pod 模版是为 pod 量身定制的，其中也包含了一些额外的对象，比如说：[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), 和
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/). Controllers 使用 pod 模版生成 pod.

与指定当前理想状态副本的方式相比， pod 模版更像一个饼干模具：一旦饼干出炉就与模具没有任何关系。 模版和实例之间不会互相纠缠， 随后在模版上的改动，或者切换到新模版都不会对已创建成功的 pod 产生影响。同样的， 通过 replication controller 创建的 pod 随后就可以直接更新。 这种方法从根本上简化了系统语义，同时增加了灵活性。

{% endcapture %}

{% capture whatsnext %}
* 关于 pod 更多内容:
  * Pod 终止
  * 其他 Pod 内容
{% endcapture %}

{% include templates/concept.md %}

