---
reviewers:
title: Pods
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

_Pods_ 是Kubernetes创建和管理的最小计算单元。
{{% /capture %}}


{{% capture body %}}

## 什么是 Pod?

_Pod_ (as in a pod of whales or pea pod) 是一个包含一个或多个
{{< glossary_tooltip text="containers" term_id="container" >}}的容器组 (例如
Docker containers), 包含共享的存储/网络，和如何运行容器的规范。一个Pod的所有资源总是同时定位和共同调度，并在共享上下文中运行。Pod模型是特定于应用程序的 "logical host" - 包含一个或多个应用程序相对紧密耦合的容器 &mdash; 在以前的容器中，在同一个物理或虚拟机上执行将意味着它在同一逻辑主机上执行。

Kubernetes 支持不只是Docker的多种容器运行时，但Docker是最常见的运行时，有助于用Docker术语描述Pod。

Pod共享的上下文是一组Linux namespace，cgrops，和可能是隔离的其他内容 — 与隔离Docker 容器相同。在Pod的上下文中，应用程序可能使用进一步sub-isolations。

Pod中的容器共享一个IP地址和端口可以通过`localhost` 找到对方 。他们也可以使用标准进程间通信互相交互，如 SystemV 信号量或 POSIX 共享内存。不同Pod 中的容器有不同的IP地址，没有[特殊配置](/docs/concepts/policy/pod-security-policy/)无法通过IPC通信.这些容器通常通过Pod IP地址彼此通信。

Pod中的应用程序也可以访问共享的 {{< glossary_tooltip text="volumes" term_id="volume" >}}，这是作为Pod 定义的一部分，可以 `mount` 到每个应用程序中文件系统。

在[Docker](https://www.docker.com/)构造中，一个Pod被建模为一组具有共享名称空间和共享文件系统的Docker容器卷。

与单个应用程序容器一样，Pod 被认为是相对的临时的(而不是持久的)实体。如在[pod生命周期](/docs/concepts/workload /pods/pod-lifecycle/)讨论的，Pod 被创建，分配一个惟一的ID (UID)，以及
被调度到节点上，它们将一直在那里直到终止(根据restart)政策)或删除。如果{{< glossary_tooltip term_id="node" >}}死掉，则调度到该节点的Pod在超时时间后将按计划删除。而给定的Pod(由UID定义)则不是“重新调度”到一个新节点;相反，它可以被一个相同的Pod 代替，如果需要，甚至使用相同的名称，但是使用一个新的UID(参见[replication])(/docs/concepts/workload/controllers/)。

当某物被认为与一个Pod (例如 `volume`)具有相同的寿命时，这意味着只要那个Pod(带有那个UID)存在，它就存在。如论Pod无论任何原因被删除，或即使创建了相同的替换，相关的内容(例如 `volume`)也会销毁并重新创建新的。

{{< figure src="/images/docs/pod.svg" title="Pod 图解" width="50%" >}}

*一个包含文件拉出器和Web Server的多容器Pod
使用持久卷在容器之间共享存储*

## Pod概念的动机

### 管理

Pod是构成多个合作过程模式的一个模型内聚的服务单元。它们简化了应用程序的部署和管理通过提供比其组成部分集更高层次的抽象。Pod作为部署、水平扩展和复制的单元。托管(协同调度)、共享命运(例如终止)、协调复制、资源共享和依赖项管理在同一个Pod的容器间自动处理的。

### 资源共享与通信

Pod使数据共享和组成之间的通信成为可能。

Pod中的应用程序都使用相同的网络名称空间(相同的IP和端口)，因此可以“找到”彼此并使用`localhost` 进行通信。因此，Pod中的应用程序必须协调它们对端口的使用。每个Pod都有一个IP地址通过在一个扁平的共享网络空间中其他物理计算机和Pod进行通信。

Pod中的容器看到的 hostname 和配置的Pod的 `name`字段一致，更多相关信息在[网络](/docs/concepts/cluster-administration/networking/)部分。

除了定义在Pod中运行的应用程序容器之外，还要定义Pod指定一组共享存储卷。卷使数据得以保存在容器重新启动后，并在Pod内的应用程序之间共享。

## 使用 Pod

Pods可用于托管垂直集成的应用程序堆栈(例如LAMP)，
但他们的主要动机是支持共同定位，共同管理的帮手
项目,如:

* 内容管理系统、文件和数据加载器、本地缓存管理器等
* 日志和检查点备份、压缩、旋转、快照等
* 数据更改观察者、日志跟踪者、日志记录和监视适配器、事件发布者等。
* 代理、桥接和适配器
* 控制器、管理器、配置器和更新器

一般，单独的 Pod 不打算运行相同应用程序的多个实例。

有关更详细的解释，请参见[分布式系统工具包:模式复合容器](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)。

## 其他考虑

_为什么不在一个(Docker)容器中运行多个程序?_ 

1. 透明度。使容器内的 Pod 可见基础设施使基础设施能够为这些人提供服务
容器，例如进程管理和资源监控。这为用户提供了诸多便利。
1. 解耦软件依赖关系。个别容器可能是独立地进行版本控制、重新构建和重新部署。Kubernetes甚至可能会支持
某个容器的实时更新。
1. 易用性。用户不需要运行自己的进程管理器和担心信号与输出码的处理等。
1. 效率。因为基础设施承担了更多的责任，容器可以更轻。

_为什么不支持基于亲和性的容器协同调度?_

这种方法将提供协同定位，但不会提供大部分的pod的好处，如资源共享、IPC、保证命运共享等简化管理。
## Pod 持久性 (or lack thereof)

Pod 并不意图作为持久的实体。它们无法在调度失败、节点失败或其他驱逐(如由于缺乏资源或在节点维护的情况下)中幸存下来。

一般来说,用户不需要直接创建 Pod。他们应该总是使用控制器来处理，例如，[Deployments](/docs/concepts/workloads/controllers/deployment/)。控制器在集群内提供自我修复,以及副本和扩展管理。
控制器如[StatefulSet] (/docs/concepts/workloads/controllers/statefulset.md)可以提供有状态的 Pod的支持。

使用集合API 作为主要的面向用户的原语在集群调度系统中比较常见，包含在[Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](https://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997)中。

Pod 作为基础被暴露，以便于:

* 调度程序和控制器可插拔性
* 支持不需要通过控制器api“代理” 的 Pod 级别的操作
* 解耦Pod 的生命周期和控制器的生命周期，例如 启动
* 解耦控制器和服务 &mdash; endpoint控制器之监控Pod
* 使Kubelet和集群级别功能更清晰 &mdash; Kubelet实际上是Pod的控制器
* 高可用应用，期望 Pod 在终止或删除的时候被替换，如在计划驱除和镜像拉取的情况。



## Pod 的终止

因为Pods表示集群中节点上正在运行的进程，所以允许这些进程在不再需要它们时优雅地终止是很重要的(与使用终止信号被暴力杀死而没有机会清理的情况相比)。用户应该能够请求删除并知道进程何时终止，也能够确保删除最终完成。当用户请求删除一个Pod时，系统记录允许强制杀死Pod之前的预期宽限期，并向每个容器中的主进程发送TERM 信号。宽限期一过，KILL信号就发送给这些进程，然后从API服务器删除Pod。如果在等待进程终止时重新启动了Kubelet或容器管理器，则将在完整的宽限期内重试终止。

示例流程：

1. 用户发送删除 Pod 命令，默认的等待时间(30s)
1. API服务器中的Pod会随着Pod被认为“死亡”的时间以及宽限期进行更新。
1. 当在client 命令中查看时Pod 将显示我为 "Terminating"
1. (与3同时)当Kubelet看到一个Pod已经被标记为终止，因为2中的时间已经被设置，开始Pod关闭过程。 
    1. 如果Pod的一个容器定义了一个[preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details)，则在容器内部调用它。如果“preStop”钩子在宽限期过期后仍在运行，则使用一个小(2秒)的延长宽限期来调用步骤2。
    1. 容器被发送 TERM 信号。请注意，不是所有的容器都将在同一时间收到 TERM 信号，如果它们关闭的顺序有问题，可能需要一个“预停止”挂钩。
1. (与3同时)Pod同时从服务的端点列表中删除，不再被视为复制控制器运行的Pod集的一部分。缓慢关闭的pod不能继续作为负载平衡器(如服务代理)来服务于流量，从而将它们从轮调中移除。
1. 当宽限期结束时，Pod中仍在运行的任何进程将被SIGKILL杀死。
1. Kubelet将通过设置grace period 0(立即删除)完成删除API服务器上的Pod。Pod从API中消失，在客户机中不再可见。


默认情况下，所有的删除都在30秒内完成。`kubectl delete` 支持 `--grace-period=<seconds>` 选项来运行用户重写默认的设置，`0`[强制删除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)Pod。你必须提供 `--force` 和  `--grace-period=0` 标志来执行强制删除 

### 强制删除 Pod

强制删除一个Pod定义为立即从集群状态和etcd中删除一个Pod。当强制删除被执行时，API服务器不会等待来自kubelet的确认，确认Pod已在其运行的节点上终止。它立即删除API中的Pod，这样就可以用相同的名称创建新的Pod。在节点上，立即终止的Pod在被强制杀死前仍有一小段宽限期。

强制删除对某些 Pod 可能是危险的，应该谨慎执行。如 StatefulSet Pod，请参考[从StatefulSet 删除pod]的任务文档(/docs/tasks/run-application/force-delete-stateful-set-pod/).

## Pod 容器的特权模式

Pod中的任何容器都可以启用特权模式，在容器规范的[安全上下文](/docs/tasks/configure-pod-container/security-context/)上使用 `privileged` 标志。这对于希望使用Linux功能(比如操作网络堆栈和访问设备)的容器非常有用。容器内的进程获得的特权几乎与容器外的进程相同。使用特权模式，可以更容易地将网络和卷插件编写为独立的pod，不需要编译到kubelet中。

{{< note >}}

您的容器运行时必须支持此设置相关的特权容器的概念。
{{< /note >}}

## API Object

Pod 是 Kubernetes REST API中的顶级资源。[Pod API对象](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/# Pod -v1-core)定义详细描述对象。
{{% /capture %}}
