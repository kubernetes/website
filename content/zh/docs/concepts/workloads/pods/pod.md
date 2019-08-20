---
reviewers:
title: Pod
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Pod是可以创建和管理 Kubernetes 计算的最小可部署的单元。

{{% /capture %}}


{{% capture body %}}

## Pod 是什么?

 Pod 就像是豌豆荚一样，是一组由一个或多个
{{< glossary_tooltip text="容器" term_id="container" >}} (例如
Docker 容器)组成，它们共享容器的存储、网络和运行配置项。 Pod 中的容器总是被同时调度，有共同的运行环境。
一个 Pod 相当于是一个特定应用的“逻辑主机” - 其中运行着一个或者多个紧密相关的应用容器 &mdash;
在容器技术出现之前，在同一个逻辑主机上运行意味着它们是运行在相同的物理机或者虚拟机上。

尽管 Kubernetes 支持多种容器运行时而不只是 Docker， Docker 依然是最常用的运行时环境。我们可以使用 Docker 的术语和规则来定义 Pod 。

 Pod 中共享的环境包括 Linux 的 namespace ，cgroup 和
其他可能的隔绝环境 - 这一点和 Docker 容器一致。在 Pod 的上下文环境中，
每个应用中可能有更小的子隔离环境。

 Pod 的容器中共享IP地址和端口号，它们之间可以通过localhost互相发现。它们之间可以通过像 SystemV 信号量或者
POSIX 共享内存的方式进行进程间通信。 不同Pod之间的容器具有不同的IP地址，不能直接通过没有[特殊配置](/docs/concepts/policy/pod-security-policy/)的IPC通信。
这些容器通常通过 Pod 的IP地址通信。

 Pod 中的容器也有访问共享 {{< glossary_tooltip text="volume" term_id="volume" >}}的权限，这些 volume 会被定义成 Pod
的一部分并被挂载到应用容器的文件系统中。

在 [Docker](https://www.docker.com/) 的术语中，Pod 可以看做一组共享 namespace 和文件系统 volume的 Docker 容器。

就像每个应用容器，Pods 被认为是相对临时的 (而不是持久性的) 实体。 在
[Pod 生命周期](/docs/concepts/workloads/pods/pod-lifecycle/)中，Pod 被创建后，被分配一个唯一ID (UID)，调度到节点上，并一直维持期望的状态
直到被终结 (根据重启策略) 或者被删除。 如果一个 {{< glossary_tooltip term_id="node" >}} 死掉，被分配到这个节点上的 Pod 在经过一个超时时间后
会被重新调度到其他节点上，原来死掉的 Pod 会被删除。一个给定的 Pod (例如UID定义的) 不会被重调度到新的节点上，
而是被一个同样的 Pod 取代。如果期望的话甚至可以是相同的名字，但是会有一个新的 UID (查看 [replication
controller](/docs/concepts/workloads/controllers/replicationcontroller/) 获取详情)。

如果一个东西比如 volume ，和 Pod 有一样的生命周期，意味着相同UID的 Pod 存在则它就存在。
如果这个Pod 由于任何原因被删除，即使是一个完全相同的代替品被创建了，相关的东西 (如 volume) 也会被销毁重建。

{{< figure src="/images/docs/pod.svg" title="Pod 图解" width="50%" >}}

*一个包含文件提取器和web服务的多容器 Pod 使用持久化的 volume 来进行容器间的共享存储。*

## Pod 的设计理念

### 管理

 Pod 是一种可以同时运行多个进程形成一个统一服务的模式。
它们通过提供一个高层的抽象而不是一套组合的应用来简化应用部署和管理。
 Pod 作为一个部署、水平扩容和复制单元提供服务。
 Pod 中的容器自动处理主机代管 (协同调度)、生命周期 (例如:停止)、并行复制、资源共享和独立管理。

### 资源共享和通信

 Pod 能够在成员之间进行数据共享和通信。

在同一个 Pod 中的应用使用相同的网络 namespace (相同的IP和端口空间)，所以可以通过localhost找到对方并进行通信。
因此，在同一个 Pod 中的应用必须协调好各自使用的端口。
每一个 Pod 在一个扁平共享网络空间拥有一个IP地址。这使得它可以和其他物理计算器和 Pod 进行跨网络的通信。

在 Pod 中的容器看到的系统主机名是和 Pod 名字相同。
这个问题在 [网络](/docs/concepts/cluster-administration/networking/)有更多的介绍。

除了定义在 Pod 中运行的应用容器，Pod还指定了一套共享的 volume 。
 volume 可以使得数据在容器重启时存活，并且在 Pod 的应用之间共享。

## 使用Pod

 Pod 可用于承载垂直集成的应用程序堆栈 (例如LAMP)，
但是他们的主要设计理念是支持共享的共存、共同管理的帮助程序，例如:

* 内容管理系统，文件和数据加载器, 本地缓存管理
* 日志和检查点备份，压缩，滚动更新，快照
* 数据变更观察者，日志采集，日志和监控适配，发布
* 代理，桥接和适配
* 控制器，管理器，配置器和更新器

各个 Pod 一般来说不是用来运行一个应用的多个实例的。


查看 [分布式系统套件: 容器构成模式](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)获取进一步说明。

## 其他考虑

_为什么不仅仅在一个(Docker)容器里运行多个程序呢?_

1. 出于透明度考虑。
   使得 Pod 内的容器对基础设施可见可以让基础设施对那些容器提供服务，例如:进程管理和资源监控。
   这给使用者带来了很多便利。
1. 出于解耦软件依赖考虑。
   各个容器可以独立的被版本化、重建和重新部署。 Kubernetes 有一天甚至可以支持各个容器在线更新。
1. 出于方便使用考虑。
   用户不需要运行他们自己的进程管理器，担心信号和退出码传播等。
1. 出于有效性考虑。
   由于基础设施承载了更多责任，容器可以更轻量。

_为什么不支持基于 affinity 的容器重调度?_

这种方式提供共存的实现，但是不能发挥 Pod 的优势，例如: 资源共享、IPC、授权的命运共享和简化的管理。


##  Pod 的持久化(或者说不支持的原因)

 Pod 不是以持久化实体为目的的。它们不能够在调度失败、 节点失败、或者其他如缺少资源等而被驱逐或者节点维护中存活。

总而言之，用户不应该有需要直接创建 Pod 的场景。它们就算在单例情况下也应该总是使用控制器。
例如[Deployments](/docs/concepts/workloads/controllers/deployment/)。
控制器提供集群范围内的自愈、副本和卷展览管理。
像 [StatefulSet](/docs/concepts/workloads/controllers/statefulset.md) 这样的控制器也可以提供有状态的 Pod 。


使用集合API作为主要的面向用户原语在集群调度系统中是很常见的，包括 [Borg](https://research.google.com/pubs/pub43438.html)， [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html)， [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)， 和 [Tupperware](https://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997)。


Pod 作为原语对外暴露主要是出于方便的考虑：

* 调度器和控制器可插拔
* 无需控制器API代理就可以支持 Pod 层面的操作
* 将 Pod 的生命周期和控制器的生命周期解耦例如 bootstrapping
* 解耦 控制器 和 service &mdash; 终端控制器只是监控 Pod
* 清除 Kubelet 层面和 集群层面的功能组合 &mdash;  Kubelet 是一个高效的 Pod  控制器
* 高可用应用，Pod 在由于计划好的驱逐停止、镜像拉取等原因造成的停止或删除之前进行替换

##  Pod 停止

由于 Pod 代表集群中节点中运行中的进程，当它们不再被需要时允许这些进程优雅的停止是很重要的 (相比暴力的用 KILL 信号来杀死没有机会做清理而言)。
用户应该可以请求删除并在进程停止时得到消息，但是也应该能够确保删除最终完成。
当一个用户请求删除一个 Pod ，系统先记录其目标的优雅退出时限然后才可以被强制杀死，在各个容器里会发出一个TERM信号。一旦过了优雅退出时限，KILL信号就被发送到这些进程，API服务就会删除 Pod 。
如果 Kubelet 或者容器管理器在等待进程停止时被重启，在优雅退出时限内会重试停止直到超过时限。

一个流程例子:

1. 用户用默认的有效期(30s)发送删除 Pod 命令
1. 更新API server中的 Pod 优雅退出有效期，超过该时间的 Pod 会被认为死亡
1. 在客户端命令行中，此Pod的状态显示为”Terminating（退出中）”
1. （与第3步同时）当Kubelet检查到Pod的状态被标记为退出中的时候，由于在第2步设置了时间，它将开始关闭 Pod 进程。
    1. 如果其中一个 Pod 容器定义了一个 [停止前钩子](/docs/concepts/containers/container-lifecycle-hooks/#hook-details)，就会在容器内被调用。如果在优雅退出时间到期后，停止前钩子仍然在运行，第2步后会延长优雅退出时间 (2秒)。
    1. 容器发送TERM信号。值得注意的是不是所有的此 Pod 中的容器同时收到TERM信号的。如果停止的顺序有要求的话可能需要一个停止前钩子。
1. （与第3步同时）从服务的终端列表中删除 Pod，对于副本控制器来说，此 Pod 将不再被认为是运行着的Pod的一部分。 缓慢关闭的 Pod 可以继续像负载均衡器(类似服务代理)一样对外服务，直到将其移除。
1. 到优雅退出时限到来，任何在此 Pod 中运行的进程都会被SIGKILL杀死。
1. Kubelet 会通过设置优雅退出时间为0(立即删除)来完成API server上此 Pod 的删除。 Pod 从API中消失并对客户端不可见。

默认，所有的删除操作可以在30秒内优雅的完成。 kubectl 删除命令支持 `--grace-period=<秒数>` 选项。这样用户可以覆盖默认，指定他们自己的值。值 `0` 代表[强制删除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) 这个 Pod 。
你必须指定一个额外的 `--force` 标识和 `--grace-period=0` 标识来完整强制删除。

### 强制删除 Pod

强制删除 Pod 被定义为从集群状态和 etcd 中立即删除这个 Pod。强制删除一旦执行，API server 不再等待其运行节点上的 kubelet 发出的 Pod 已停止的确认。它将立即删除API里的这个 Pod 来使得相同名字的新 Pod 可以被创建。在这个节点上，被设置为立即停止的 Pod 在被强制杀死前会仍然有一小段优雅退出时间。

强制删除对一些 Pod 来说会有潜在的危险应该被谨慎使用。在 StatefulSet 的 Pod上, 请参考任务文档 [使用 StatefulSet 删除 Pod ](/docs/tasks/run-application/force-delete-stateful-set-pod/)。

## Pod容器的优先模式

任何 Pod 中的容器都可以使用优先模式，在容器  spec 中使用`privileged(优先的)` 标识 [安全上下文](/docs/tasks/configure-pod-container/security-context/)。这适用于容器希望使用Linux的能力例如操作网络堆栈和设备连接。容器内的进程和容器外的进程拥有几乎一样的优先权。使用优先模式，在写网络和存储卷插件时，不同的 Pod 不用编译到一个 kubelet 里。

{{< note >}}
当涉及这个设置时，你的容器运行时必须支持优先容器的概念。
{{< /note >}}

## API对象

Pod 在 Kubernetes REST API 中是一个顶级资源。
[Pod API对象](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core) 这个定义中详细描述了这个对象。

{{% /capture %}}
