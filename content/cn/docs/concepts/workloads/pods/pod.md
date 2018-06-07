---
reviewers:
title: Pods
---

{{< toc >}}


_Pods_ 是创建和部署的最小计算单元，由Kubernetes管理

## Pod是什么?

_pod_ (如在鲸群或豌豆荚中)是一组或多个容器(如Docker容器)，具有共享存储/网络和规范关于如何运行容器。Pod总是放在一起共同调度，并在共享上下文中运行。一个Pod模型特定于应用程序的“逻辑主机”——它包含一个或多个应用程序相对紧密耦合的容器;在一个pre-container世界上，他们会在同一个物理或虚拟机器上执行。

虽然Kubernetes支持的容器运行时比Docker更多，但Docker是最常见的运行时，它有助于用Docker术语描述pod。

pod的共享上下文是一组Linux namespace、cgroups和潜在的隔离的其他方面——同样的事情隔离了一个Docker。容器。在pod的上下文中，单个应用程序可能具有进一步sub-isolations应用。

pod中的容器共享一个IP地址和端口空间，以及。可以通过 `localhost` 找到彼此。他们也可以互相交流其他使用标准的进程间通信，如SystemV信号量或POSIX共享内存。不同pod中的容器具有不同的IP地址没有IPC就无法沟通[special configuration](/docs/concepts/policy/pod-security-policy/)。这些容器通常通过Pod IP地址彼此通信。

pod中的应用程序也可以访问已定义的共享卷作为一个pod的一部分，并且可以被安装到每个应用程序的文件系统。

在[Docker](https://www.docker.com/)构造方面，一个pod被建模为具有共享名称空间和共享名称空间的Docker容器组[volumes](/docs/concepts/storage/volumes/)。

与单个应用程序容器一样，pods被认为是相对的短暂的(而非持久的)实体。正如在[life of a pod](/docs/concepts/workloads/pods/pod-lifecycle/)中所讨论的、pod被创建、分配了唯一ID (UID)和计划到节点，直到终止(根据重新启动策略)或删除。如果一个节点死了，计划到该节点的pod是计划在超时后删除。给定的pod(由UID定义)不是“重新调度”到新节点;取而代之的是，它可以被一个相同的pod所取代，如果需要，甚至使用相同的名称，但使用一个新的UID(参见 [replication controller](/docs/concepts/workloads/controllers/replicationcontroller/) 的更多信息)。

当说某物与pod具有相同的寿命时，如volume，这意味着只要pod(使用UID)存在，它就存在。如果这即使创建了相同的替换，pod也会被删除。相关的事物(如volume)也被破坏并重新创建。

{{< figure src="/images/docs/pod.svg" title="pod diagram" width="50%" >}}

*包含文件提取器和多容器pod web服务器，它使用一个持久卷来存储容器之间的共享存储。*

## 动机

### 管理

Pod是由多个合作过程组成的模式内聚单元的服务。它们简化了应用程序的部署和管理通过提供比组成元素集更高层次的抽象应用程序。Pod作为部署单元，水平扩展和复制。托管(联合调度)、共享命运(如终止)、协调复制、资源共享和依赖项管理都是如此自动处理容器中的容器。

### 资源共享和通信

Pod支持数据共享和通信。

pod中的应用程序都使用相同的网络名称空间(相同的IP和端口)，这样就可以“找到”对方并使用`localhost`进行通信。因此，pod中的应用程序必须协调它们对端口的使用。每个pod都有一个IP地址，位于一个拥有完整的扁平共享网络空间中通过网络与其他物理计算机和pod进行通信。

主机名设置为pod中应用程序容器的名称。[更多网络细节](/docs/concepts/cluster-administration/networking/)。

除了定义在pod中运行的应用程序容器之外，pod也是如此指定一组共享存储卷。卷使数据得以保存容器重新启动并在pod中的应用程序之间共享。

## Pod的用途

pod可以用于托管垂直集成的应用程序堆栈(例如LAMP)，但他们的主要动机是支持共同定位、共同管理的助手项目,如:

* 内容管理系统、文件和数据加载程序、本地缓存管理器等。
* 日志和检查点备份、压缩、旋转、快照等。
* 数据更改观察者、日志裁缝、日志和监视适配器、事件发布者等。
* 代理、桥接和适配器
* 控制器、管理器、配置程序和更新程序

一般来说，单独的pod不建议运行同一个实例的多个实例应用程序。

有关更详细的解释，请参见[The Distributed System ToolKit: Patterns for Composite Containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html)。

## 其他考虑

_为什么不直接在一个容器(Docker)中运行多个程序呢?_

1、透明。使容器在荚内可见基础设施使基础设施能够为这些人提供服务容器，例如过程管理和资源监视。这为用户提供了许多方便。

2、解耦软件依赖关系。单个容器可能是独立进行版本控制、重建和重新部署。Kubernetes甚至可能支持有一天，单个容器的实时更新。

3、易用性。用户不需要运行他们自己的流程管理器，担心信号和输出码的传播等。

4、效率。因为基础设施承担了更多的责任，容器更轻量。

_为什么不支持基于关联的容器联合调度?_

这种方法将提供合作地点，但不会提供大部分pod的优点，例如资源共享、IPC、保证命运共享以及简化管理。

## Pod的稳定性 (或不足)

Pod不被视为持久实体。它们在调度失败、节点失败或其他驱逐(如由于缺乏资源)或节点维护的情况下无法生存。

通常，用户不需要直接创建pod。他们应该差不多即使对于单例，也要始终使用控制器，例如，[Deployments](/docs/concepts/workloads/controllers/deployment/)。控制器除了提供复制外，还提供集群范围的自修复和推广管理。
控制器[StatefulSet](/docs/concepts/workloads/controllers/statefulset.md)还可以为有状态的pod提供支持。

使用集合api作为主要的面向用户的原语在集群调度系统中比较常见，包括[Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](http://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).

pod以简单的方式暴露出来，以便:

* 调度器和控制器可插拔性
* 支持池级操作，无需通过控制器api“代理”它们
* 分离pod生命周期与控制器生命周期，如引导
* 控制器与服务的解耦--端点控制器只是观察pod。
* 使用集群级功能和mdash清洁库级别功能的组合;Kubelet实际上是"pod控制器"
* 高可用性的应用程序，预计将在其终止之前被替换，并且在删除之前肯定会被替换，例如在计划的驱逐或图像预取的情况下。

## Pod终止

由于pods表示集群中节点上正在运行的进程，所以在不再需要这些进程时，允许它们优雅地终止(与使用KILL信号而被暴力杀死并且没有清理的机会相比)是很重要的。用户应该能够请求删除并知道进程何时终止，但也应该能够确保删除最终完成。当用户请求删除pod时，系统会在允许强制终止pod之前记录预期的宽限期，并向每个容器中的主进程发送一个期限信号。一旦grace期结束，KILL信号就被发送到这些进程，然后从API服务器中删除pod。如果在等待进程终止时重新启动Kubelet或容器管理器，终止将在整个宽限期内重新尝试。

如下的例子:

1、用户发送命令删除Pod，默认时间(30s)

2、API服务器中的Pod会随着超出该Pod被认为“死亡”的时间以及宽限期而更新

3、当在客户端命令中列出时，Pod显示为“终止”

4、(与3同步)当Kubelet看到一个Pod被标记为终止时，因为在2中时间已被设置，它将开始Pod关闭过程
    1、如果pod已经定义了一个[preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details)，那么它将在pod中调用。如果“preStop”钩子在宽限期结束后仍在运行，那么将使用一个小的(2秒)延长的宽限期来调用步骤2。
    2、Pod中的进程被发送TERM信号。

5、(与3同步)Pod从服务的端点列表中删除，不再被视为复制控制器运行的Pod集合的一部分。缓慢关闭的豆荚可以继续作为负载平衡器(如服务代理)从它们的旋转中删除它们。

6、当宽限期届满，仍在吊舱中运行的任何进程都被SIGKILL杀死。

7、Kubelet将通过设置grace perid 0(立即删除)来删除API服务器上的Pod。Pod从API中消失，并且在客户端中不再可见。

默认情况下，所有删除操作都是在30秒内完成的。 `kubectl delete` 命令支持 `—grace-period=<seconds>` 选项，允许用户覆盖默认值并指定自己的值。值 `0` [force deletes](/docs/concept /workload /pods/pod/#force- delete) pod。在kubectl版本的>= 1.5中，您必须指定一个额外的标志 `——force` 和 `grace-period=0` 以执行强制删除。

### 强制删除Pod

强制删除一个pod的定义是，立即删除集群状态和etcd上的pod。当执行力删除时，apiserver不会等待kubelet的确认，即pod已在其运行的节点上终止。它立即删除API中的pod，以便使用相同的名称创建新的pod。在节点上，被设置为立即终止的pod在被强制杀死之前仍然会有一个小的宽限期。

对某些pod来说，强制删除可能是潜在的危险，应该谨慎执行。对于有状态集的pod，请参考任务文档[从有状态集中删除pod](/docs/tasks/run-application/force-delete-stateful-set-pod/)。

## Pod容器的权限

从Kubernetes v1.1开始，pod中的任何容器都可以使用容器规范的 `SecurityContext` 上的 `privileged` 标志来启用特权模式。容器内的进程获得的特权与容器外的进程几乎相同。有了特权模式，就应该更容易编写网络和卷插件，因为它们不需要编译成kubelet。

如果master运行的是Kubernetes v1.1或更高版本，并且节点运行的版本低于v1.1，那么api-server将接受新的特权pod，但不会启动。他们将处于悬而未决的状态。
如果用户调用 `kubectl describe pod FooPodName` ，用户可以看到pod处于挂起状态的原因。描述命令输出中的eventsb将会:
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`

如果主版本运行的版本低于v1.1，则无法创建特权豆荚。如果用户尝试创建一个有特权容器的pod，用户将会得到以下错误:
`The Pod "FooPodName" is invalid.spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`

## API对象

Pod是Kubernetes REST API中的顶级资源。更详细的API对象可在:
[Pod API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).
