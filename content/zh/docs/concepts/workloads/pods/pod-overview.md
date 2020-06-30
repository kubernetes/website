---
title: Pod 概览
content_type: concept
weight: 10
card: 
  name: concepts
  weight: 60
---

<!--
---
reviewers:
- erictune
title: Pod Overview
content_type: concept
weight: 10
card: 
  name: concepts
  weight: 60
---
-->

<!--
This page provides an overview of `Pod`, the smallest deployable object in the Kubernetes object model.
-->
<!-- overview -->
本节提供了 `Pod` 的概览信息，`Pod` 是最小可部署的 Kubernetes 对象模型。



<!-- body -->

<!--
## Understanding Pods
-->
## 理解 Pod

<!--
A *Pod* is the basic execution unit of a Kubernetes application--the smallest and simplest unit in the Kubernetes object model that you create or deploy. A Pod represents processes running on your {{< glossary_tooltip term_id="cluster" >}}.
-->
*Pod* 是 Kubernetes 应用程序的基本执行单元，即它是 Kubernetes 对象模型中创建或部署的最小和最简单的单元。Pod 表示在 {{< glossary_tooltip term_id="cluster" >}} 上运行的进程。

<!--
A Pod encapsulates an application's container (or, in some cases, multiple containers), storage resources, a unique network IP, and options that govern how the container(s) should run. A Pod represents a unit of deployment: *a single instance of an application in Kubernetes*, which might consist of either a single {{< glossary_tooltip text="container" term_id="container" >}} or a small number of containers that are tightly coupled and that share resources.
-->
Pod 封装了应用程序容器（或者在某些情况下封装多个容器）、存储资源、唯一网络 IP 以及控制容器应该如何运行的选项。
Pod 表示部署单元：*Kubernetes 中应用程序的单个实例*，它可能由单个 {{< glossary_tooltip text="容器" term_id="container" >}} 或少量紧密耦合并共享资源的容器组成。

<!--
[Docker](https://www.docker.com) is the most common container runtime used in a Kubernetes Pod, but Pods support other [container runtimes](/docs/setup/production-environment/container-runtimes/) as well.
-->
[Docker](https://www.docker.com) 是 Kubernetes Pod 中最常用的容器运行时，但 Pod 也能支持其他的[容器运行时](/docs/setup/production-environment/container-runtimes/)。


<!--
Pods in a Kubernetes cluster can be used in two main ways:
-->
Kubernetes 集群中的 Pod 可被用于以下两个主要用途：

<!--
* **Pods that run a single container**. The "one-container-per-Pod" model is the most common Kubernetes use case; in this case, you can think of a Pod as a wrapper around a single container, and Kubernetes manages the Pods rather than the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod might encapsulate an application composed of multiple co-located containers that are tightly coupled and need to share resources. These co-located containers might form a single cohesive unit of service--one container serving files from a shared volume to the public, while a separate "sidecar" container refreshes or updates those files. The Pod wraps these containers and storage resources together as a single manageable entity.
The [Kubernetes Blog](https://kubernetes.io/blog) has some additional information on Pod use cases. For more information, see:
-->

* **运行单个容器的 Pod**。"每个 Pod 一个容器"模型是最常见的 Kubernetes 用例；在这种情况下，可以将 Pod 看作单个容器的包装器，并且 Kubernetes 直接管理 Pod，而不是容器。
* **运行多个协同工作的容器的 Pod**。
Pod 可能封装由多个紧密耦合且需要共享资源的共处容器组成的应用程序。
这些位于同一位置的容器可能形成单个内聚的服务单元 —— 一个容器将文件从共享卷提供给公众，而另一个单独的“挂斗”（sidecar）容器则刷新或更新这些文件。
Pod 将这些容器和存储资源打包为一个可管理的实体。
[Kubernetes 博客](https://kubernetes.io/blog) 上有一些其他的 Pod 用例信息。更多信息请参考：

<!--
  * [The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)
  * [Container Design Patterns](https://kubernetes.io/blog/2016/06/container-design-patterns)
-->
  * [分布式系统工具包：容器组合的模式](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)
  * [容器设计模式](https://kubernetes.io/blog/2016/06/container-design-patterns)

<!--
Each Pod is meant to run a single instance of a given application. If you want to scale your application horizontally (e.g., run multiple instances), you should use multiple Pods, one for each instance. In Kubernetes, this is generally referred to as _replication_. Replicated Pods are usually created and managed as a group by an abstraction called a Controller. See [Pods and Controllers](#pods-and-controllers) for more information.
-->

每个 Pod 表示运行给定应用程序的单个实例。如果希望横向扩展应用程序（例如，运行多个实例），则应该使用多个 Pod，每个应用实例使用一个 Pod 。在 Kubernetes 中，这通常被称为 _副本_。通常使用一个称为控制器的抽象来创建和管理一组副本 Pod。更多信息请参见 [Pod 和控制器](#pods-and-controllers)。

<!--
### How Pods manage multiple Containers
-->
### Pod 怎样管理多个容器

<!--
Pods are designed to support multiple cooperating processes (as containers) that form a cohesive unit of service. The containers in a Pod are automatically co-located and co-scheduled on the same physical or virtual machine in the cluster. The containers can share resources and dependencies, communicate with one another, and coordinate when and how they are terminated.
-->
Pod 被设计成支持形成内聚服务单元的多个协作过程（作为容器）。
Pod 中的容器被自动的安排到集群中的同一物理或虚拟机上，并可以一起进行调度。
容器可以共享资源和依赖、彼此通信、协调何时以及何种方式终止它们。

<!--
Note that grouping multiple co-located and co-managed containers in a single Pod is a relatively advanced use case. You should use this pattern only in specific instances in which your containers are tightly coupled. For example, you might have a container that acts as a web server for files in a shared volume, and a separate "sidecar" container that updates those files from a remote source, as in the following diagram:
-->

注意，在单个 Pod 中将多个并置和共同管理的容器分组是一个相对高级的使用方式。
只在容器紧密耦合的特定实例中使用此模式。
例如，您可能有一个充当共享卷中文件的 Web 服务器的容器，以及一个单独的 sidecar 容器，该容器从远端更新这些文件，如下图所示：


{{< figure src="/images/docs/pod.svg" alt="Pod 图例" width="50%" >}}


<!--
Some Pods have {{< glossary_tooltip text="init containers" term_id="init-container" >}} as well as {{< glossary_tooltip text="app containers" term_id="app-container" >}}. Init containers run and complete before the app containers are started.
-->
有些 Pod 具有 {{< glossary_tooltip text="初始容器" term_id="init-container" >}} 和 {{< glossary_tooltip text="应用容器" term_id="app-container" >}}。初始容器会在启动应用容器之前运行并完成。

<!--
Pods provide two kinds of shared resources for their constituent containers: *networking* and *storage*.
-->

Pod 为其组成容器提供了两种共享资源：*网络* 和 *存储*。

<!--
#### Networking
-->
#### 网络

<!--
Each Pod is assigned a unique IP address. Every container in a Pod shares the network namespace, including the IP address and network ports. Containers *inside a Pod* can communicate with one another using `localhost`. When containers in a Pod communicate with entities *outside the Pod*, they must coordinate how they use the shared network resources (such as ports).
-->
每个 Pod 分配一个唯一的 IP 地址。
Pod 中的每个容器共享网络命名空间，包括 IP 地址和网络端口。
*Pod 内的容器* 可以使用 `localhost` 互相通信。
当 Pod 中的容器与 *Pod 之外* 的实体通信时，它们必须协调如何使用共享的网络资源（例如端口）。

<!--
#### Storage
-->
#### 存储

<!--
A Pod can specify a set of shared storage {{< glossary_tooltip text="Volumes" term_id="volume" >}}. All containers in the Pod can access the shared volumes, allowing those containers to share data. Volumes also allow persistent data in a Pod to survive in case one of the containers within needs to be restarted. See [Volumes](/docs/concepts/storage/volumes/) for more information on how Kubernetes implements shared storage in a Pod.
-->
一个 Pod 可以指定一组共享存储{{< glossary_tooltip text="卷" term_id="volume" >}}。
Pod 中的所有容器都可以访问共享卷，允许这些容器共享数据。
卷还允许 Pod 中的持久数据保留下来，以防其中的容器需要重新启动。
有关 Kubernetes 如何在 Pod 中实现共享存储的更多信息，请参考[卷](/docs/concepts/storage/volumes/)。

<!--
## Working with Pods
-->
## 使用 Pod

<!--
You'll rarely create individual Pods directly in Kubernetes--even singleton Pods. This is because Pods are designed as relatively ephemeral, disposable entities. When a Pod gets created (directly by you, or indirectly by a Controller), it is scheduled to run on a {{< glossary_tooltip term_id="node" >}} in your cluster. The Pod remains on that Node until the process is terminated, the pod object is deleted, the Pod is *evicted* for lack of resources, or the Node fails.
-->
你很少在 Kubernetes 中直接创建单独的 Pod，甚至是单个存在的 Pod。
这是因为 Pod 被设计成了相对短暂的一次性的实体。
当 Pod 由您创建或者间接地由控制器创建时，它被调度在集群中的 {{< glossary_tooltip term_id="node" >}} 上运行。
Pod 会保持在该节点上运行，直到进程被终止、Pod 对象被删除、Pod 因资源不足而被 *驱逐* 或者节点失效为止。

<!--
Restarting a container in a Pod should not be confused with restarting the Pod. The Pod itself does not run, but is an environment the containers run in and persists until it is deleted.
-->
{{< note >}}
重启 Pod 中的容器不应与重启 Pod 混淆。Pod 本身不运行，而是作为容器运行的环境，并且一直保持到被删除为止。
{{< /note >}}

<!--
Pods do not, by themselves, self-heal. If a Pod is scheduled to a Node that fails, or if the scheduling operation itself fails, the Pod is deleted; likewise, a Pod won't survive an eviction due to a lack of resources or Node maintenance. Kubernetes uses a higher-level abstraction, called a *Controller*, that handles the work of managing the relatively disposable Pod instances. Thus, while it is possible to use Pod directly, it's far more common in Kubernetes to manage your pods using a Controller. See [Pods and Controllers](#pods-and-controllers) for more information on how Kubernetes uses Controllers to implement Pod scaling and healing.
-->

Pod 本身并不能自愈。
如果 Pod 被调度到失败的节点，或者如果调度操作本身失败，则删除该 Pod；同样，由于缺乏资源或进行节点维护，Pod 在被驱逐后将不再生存。
Kubernetes 使用了一个更高级的称为 *控制器* 的抽象，由它处理相对可丢弃的 Pod 实例的管理工作。
因此，虽然可以直接使用 Pod，但在 Kubernetes 中，更为常见的是使用控制器管理 Pod。
有关 Kubernetes 如何使用控制器实现 Pod 伸缩和愈合的更多信息，请参考 [Pod 和控制器](#pods-and-controllers)。

<!--
### Pods and Controllers
-->
### Pod 和控制器 {#pods-and-controllers}

<!--
A Controller can create and manage multiple Pods for you, handling replication and rollout and providing self-healing capabilities at cluster scope. For example, if a Node fails, the Controller might automatically replace the Pod by scheduling an identical replacement on a different Node.
-->
控制器可以为您创建和管理多个 Pod，管理副本和上线，并在集群范围内提供自修复能力。
例如，如果一个节点失败，控制器可以在不同的节点上调度一样的替身来自动替换 Pod。

<!--
Some examples of Controllers that contain one or more pods include:
-->
包含一个或多个 Pod 的控制器一些示例包括：

<!--
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
-->
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)

<!--
In general, Controllers use a Pod Template that you provide to create the Pods for which it is responsible.
-->
控制器通常使用您提供的 Pod 模板来创建它所负责的 Pod。

<!--
## Pod Templates
-->
## Pod 模板

<!--
Pod templates are pod specifications which are included in other objects, such as
[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).  Controllers use Pod Templates to make actual pods.
The sample below is a simple manifest for a Pod which contains a container that prints
a message.
-->
Pod 模板是包含在其他对象中的 Pod 规范，例如
[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/)、 [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/) 和
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/)。
控制器使用 Pod 模板来制作实际使用的 Pod。
下面的示例是一个简单的 Pod 清单，它包含一个打印消息的容器。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```

<!--
Rather than specifying the current desired state of all replicas, pod templates are like cookie cutters. Once a cookie has been cut, the cookie has no relationship to the cutter. There is no "quantum entanglement". Subsequent changes to the template or even switching to a new template has no direct effect on the pods already created. Similarly, pods created by a replication controller may subsequently be updated directly. This is in deliberate contrast to pods, which do specify the current desired state of all containers belonging to the pod. This approach radically simplifies system semantics and increases the flexibility of the primitive.
-->

Pod 模板就像饼干切割器，而不是指定所有副本的当前期望状态。
一旦饼干被切掉，饼干就与切割器没有关系。
没有“量子纠缠”。
随后对模板的更改或甚至切换到新的模板对已经创建的 Pod 没有直接影响。
类似地，由副本控制器创建的 Pod 随后可以被直接更新。
这与 Pod 形成有意的对比，Pod 指定了属于 Pod 的所有容器的当前期望状态。
这种方法从根本上简化了系统语义，增加了原语的灵活性。



<!--
* Learn more about [Pods](/docs/concepts/workloads/pods/pod/)
* Learn more about Pod behavior:
  * [Pod Termination](/docs/concepts/workloads/pods/pod/#termination-of-pods)
  * [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/)
-->
## {{% heading "whatsnext" %}}

* 详细了解 [Pod](/docs/concepts/workloads/pods/pod/)
* 了解有关 Pod 行为的更多信息：
  * [Pod 的终止](/docs/concepts/workloads/pods/pod/#termination-of-pods)
  * [Pod 的生命周期](/docs/concepts/workloads/pods/pod-lifecycle/)

