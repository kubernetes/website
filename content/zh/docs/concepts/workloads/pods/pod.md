---
reviewers:
title: Pods
content_template: templates/concept
weight: 20
---

<!--
---
reviewers:
title: Pods
content_template: templates/concept
weight: 20
---
-->

{{% capture overview %}}

<!--
_Pods_ are the smallest deployable units of computing that can be created and
managed in Kubernetes.
-->

_Pods_ 是可以在 Kubernetes 中创建和管理的、最小的可部署的计算单元。

{{% /capture %}}


{{% capture body %}}

<!--
## What is a Pod?

A _pod_ (as in a pod of whales or pea pod) is a group of one or more containers
(such as Docker containers), with shared storage/network, and a specification
for how to run the containers.  A pod's contents are always co-located and
co-scheduled, and run in a shared context.  A pod models an
application-specific "logical host" - it contains one or more application
containers which are relatively tightly coupled &mdash; in a pre-container
world, being executed on the same physical or virtual machine would mean being
executed on the same logical host.
-->

## Pod 是什么？

_pod_ （就像在鲸鱼荚或者豌豆荚中）是一组（一个或多个）容器（例如 Docker 容器），这些容器有共享存储、网络、以及怎样运行这些容器的声明。Pod 的内容总是共同定位和共同调度，并且在共享的上下文中运行。
Pod 以特定于应用的“逻辑主机”为模型，它包含一个或多个应用容器，这些容器是相对紧密的耦合在一起；在容器出现之前，在相同的物理机或虚拟机上运行意味着在相同的逻辑主机上运行。

<!--
While Kubernetes supports more container runtimes than just Docker, Docker is
the most commonly known runtime, and it helps to describe pods in Docker terms.

The shared context of a pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a Docker
container.  Within a pod's context, the individual applications may have
further sub-isolations applied.
-->

虽然 Kubernetes 支持多种容器运行时，但 Docker 是最常见的一种运行时，它有助于描述 Docker 术语中的 Pod。

Pod 的共享上下文是一组 Linux 命名空间、cgroups、以及其他潜在的资源隔离相关的因素，这些相同的东西也隔离了 Docker 容器。在 Pod 的上下文中，单个应用程序可能还会应用进一步的子隔离。

<!--
Containers within a pod share an IP address and port space, and
can find each other via `localhost`. They can also communicate with each
other using standard inter-process communications like SystemV semaphores or
POSIX shared memory.  Containers in different pods have distinct IP addresses
and can not communicate by IPC without
[special configuration](/docs/concepts/policy/pod-security-policy/).
These containers usually communicate with each other via Pod IP addresses.

Applications within a pod also have access to shared volumes, which are defined
as part of a pod and are made available to be mounted into each application's
filesystem.
-->

Pod 中的所有容器共享一个 IP 地址和端口空间，并且可以通过 `localhost` 互相发现。他们也能通过标准的进程间通信（如 SystemV 信号量或 POSIX 共享内存）方式进行互相通信。不同 Pod 中的容器的 IP 地址互不相同，没有 [特殊配置](/docs/concepts/policy/pod-security-policy/) 就不能使用 IPC 进行通信。这些容器之间经常通过 Pod IP 地址进行通信。

Pod 中的应用也能访问共享卷，共享卷是 Pod 定义的一部分，可被用来挂载到每个应用的文件系统上。

<!--
In terms of [Docker](https://www.docker.com/) constructs, a pod is modelled as
a group of Docker containers with shared namespaces and shared
[volumes](/docs/concepts/storage/volumes/).

Like individual application containers, pods are considered to be relatively
ephemeral (rather than durable) entities. As discussed in [life of a
pod](/docs/concepts/workloads/pods/pod-lifecycle/), pods are created, assigned a unique ID (UID), and
scheduled to nodes where they remain until termination (according to restart
policy) or deletion. If a node dies, the pods scheduled to that node are
scheduled for deletion, after a timeout period. A given pod (as defined by a UID) is not
"rescheduled" to a new node; instead, it can be replaced by an identical pod,
with even the same name if desired, but with a new UID (see [replication
controller](/docs/concepts/workloads/controllers/replicationcontroller/) for more details).
-->

在 [Docker](https://www.docker.com/) 体系的术语中，Pod 被建模为一组具有共享命名空间和共享 [卷](/docs/concepts/storage/volumes/) 的 Docker 容器。

与单个应用程序容器一样，Pod被认为是相对短暂的（而不是持久的）实体。如 [Pod 的生命](/docs/concepts/workloads/pods/pod-lifecycle/) 所讨论的那样：Pod 被创建、给它指定一个唯一 ID （UID）、被调度到节点、在节点上存续直到终止（取决于重启策略）或被删除。如果节点宕机，调度到该节点上的 Pod 会在一个超时周期后被安排删除。给定 Pod （由 UID 定义）不会重新调度到新节点；相反，它会被一个完全相同的 Pod 替换掉，如果需要甚至连 Pod 名称都可以一样，除了 UID 是新的(更多信息请查阅 [副本控制器（replication
controller）](/docs/concepts/workloads/controllers/replicationcontroller/))。

<!--
When something is said to have the same lifetime as a pod, such as a volume,
that means that it exists as long as that pod (with that UID) exists. If that
pod is deleted for any reason, even if an identical replacement is created, the
related thing (e.g. volume) is also destroyed and created anew.
-->

当某些东西被说成与 Pod（如卷）具有相同的生存期时，这意味着只要pod（具有该UID）存在，它就存在。如果那个 Pod 因为某种原因被删除了，即使创建了相同的 Pod 做替换，Pod 的相关的资源（如卷等）也会被销毁进行重新创建。

{{< figure src="/images/docs/pod.svg" title="pod diagram" width="50%" >}}

<!--
*A multi-container pod that contains a file puller and a
web server that uses a persistent volume for shared storage between the containers.*
-->

包含多个容器的 Pod 包含文件拉取器和 web 服务器，使用了持久卷在容器之间进行存储共享。

{{< figure src="/images/docs/pod.svg" title="pod diagram" width="50%" >}}


<!--
## Motivation for pods

### Management

Pods are a model of the pattern of multiple cooperating processes which form a
cohesive unit of service.  They simplify application deployment and management
by providing a higher-level abstraction than the set of their constituent
applications. Pods serve as unit of deployment, horizontal scaling, and
replication. Colocation (co-scheduling), shared fate (e.g. termination),
coordinated replication, resource sharing, and dependency management are
handled automatically for containers in a pod.
-->

## Pod 的动机

### 管理

Pod 是形成内聚服务单元的多个协作过程模式的模型。它们提供了一个比它们的应用组成集合更高级的抽象，从而简化了应用的部署和管理。Pod 可以用作部署单元、水平缩放和复制。在 Pod中，多个容器的共同定位（协同调度）、共享命运（例如，终止）、协调复制、资源共享和依赖项管理都是自动处理的。


<!--
### Resource sharing and communication

Pods enable data sharing and communication among their constituents.

The applications in a pod all use the same network namespace (same IP and port
space), and can thus "find" each other and communicate using `localhost`.
Because of this, applications in a pod must coordinate their usage of ports.
Each pod has an IP address in a flat shared networking space that has full
communication with other physical computers and pods across the network.
-->

### 资源共享和通信

Pod 使它的组成容器间能够进行数据共享和通信。

Pod 中的应用都使用相同的网络命名空间（相同 IP 和 端口空间），而且能够互相“发现”并使用 `localhost` 进行通信。因此，在 Pod 中的应用必须协调它们的端口使用情况。每个 Pod 在扁平的共享网络空间中具有一个IP地址，该空间能与整个网络上的其他物理机或虚拟机进行完全通信。

<!--
The hostname is set to the pod's Name for the application containers within the
pod. [More details on networking](/docs/concepts/cluster-administration/networking/).

In addition to defining the application containers that run in the pod, the pod
specifies a set of shared storage volumes. Volumes enable data to survive
container restarts and to be shared among the applications within the pod.
-->

主机名被设置为 Pod 内的应用程序容器的 Pod 名称。请参考[组网的更多信息](/docs/concepts/cluster-administration/networking/)。

Pod 除了定义了 Pod 中运行的应用程序容器之外，Pod 还指定了一组共享存储卷。该共享存储卷能使数据在容器重新启动后继续保留，并能在 Pod 内的应用程序之间共享。

<!--
## Uses of pods

Pods can be used to host vertically integrated application stacks (e.g. LAMP),
but their primary motivation is to support co-located, co-managed helper
programs, such as:

* content management systems, file and data loaders, local cache managers, etc.
* log and checkpoint backup, compression, rotation, snapshotting, etc.
* data change watchers, log tailers, logging and monitoring adapters, event publishers, etc.
* proxies, bridges, and adapters
* controllers, managers, configurators, and updaters
-->

## 使用 Pod

Pod 可以用于托管垂直集成的应用程序栈（例如，LAMP），但最主要的动机是支持位于同一位置的、共同管理的帮助程序，例如：

* 内容管理系统、文件和数据加载器、本地缓存管理器等。
* 日志和检查点备份、压缩、旋转、快照等。
* 数据更改监视器、日志跟踪器、日志和监视适配器、事件发布器等。
* 代理、桥接器和适配器
* 控制器、管理器、配置器和更新器


<!--
Individual pods are not intended to run multiple instances of the same
application, in general.

For a longer explanation, see [The Distributed System ToolKit: Patterns for
Composite
Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns).
-->

通常，单个 Pod 并不打算运行同一应用程序的多个实例。

更多解释，请参考 [分布式系统工具包：复合容器的模式](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)

<!--
## Alternatives considered

_Why not just run multiple programs in a single (Docker) container?_

1. Transparency. Making the containers within the pod visible to the
   infrastructure enables the infrastructure to provide services to those
   containers, such as process management and resource monitoring. This
   facilitates a number of conveniences for users.
1. Decoupling software dependencies. The individual containers may be
   versioned, rebuilt and redeployed independently. Kubernetes may even support
   live updates of individual containers someday.
1. Ease of use. Users don't need to run their own process managers, worry about
   signal and exit-code propagation, etc.
1. Efficiency. Because the infrastructure takes on more responsibility,
   containers can be lighter weight.
-->

## 备选方案的思考

_为什么不在单个（Docker）容器中运行多个程序？_

1. 透明度。Pod 内的容器对基础设施可见，使得基础设施能够向这些容器提供服务，例如流程管理和资源监控。这为用户提供了许多便利。
1. 解耦软件依赖关系。可以独立地对单个容器进行版本控制、重新构建和重新部署。Kubernetes 有一天甚至可能支持单个容器的实时更新。
1. 易用性。用户不需要运行他们自己的进程管理器、也不用担心信号和退出代码传播等。
1. 效率。因为基础结构承担了更多的责任，所以容器可以变得更加轻量化。

<!--
_Why not support affinity-based co-scheduling of containers?_

That approach would provide co-location, but would not provide most of the
benefits of pods, such as resource sharing, IPC, guaranteed fate sharing, and
simplified management.
-->

_为什么不支持基于亲和性的容器联合调度？_

这种处理方法尽管可以提供同址，但不能提供 Pod 的大部分好处，如资源共享、IPC、有保证的命运共享和简化的管理。

<!--
## Durability of pods (or lack thereof)

Pods aren't intended to be treated as durable entities. They won't survive scheduling failures, node failures, or other evictions, such as due to lack of resources, or in the case of node maintenance.

In general, users shouldn't need to create pods directly. They should almost
always use controllers even for singletons, for example,
[Deployments](/docs/concepts/workloads/controllers/deployment/).
Controllers provide self-healing with a cluster scope, as well as replication
and rollout management.
Controllers like [StatefulSet](/docs/concepts/workloads/controllers/statefulset.md)
can also provide support to stateful pods.
-->

## Pod 的持久性（或稀缺性）

Pod 并没想被视为持久的实体。它们无法在调度失败、节点故障或其他驱逐策略（例如由于缺乏资源或在节点维护的情况下）中生存。

一般来说，用户不需要直接创建 Pod。他们几乎都是使用控制器进行创建，即使对于单例的创建也一样使用控制器，例如 [Deployments](/docs/concepts/workloads/controllers/deployment/)。
控制器提供集群范围的自修复以及复制和滚动管理。
像 [StatefulSet](/docs/concepts/workloads/controllers/statefulset.md) 这样的控制器还可以提供支持有状态的 Pod。

<!--
The use of collective APIs as the primary user-facing primitive is relatively common among cluster scheduling systems, including [Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](https://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).
-->

在集群调度系统中，使用 API 合集作为面向用户的主要原语是比较常见的，包括 [Borg](https://research.google.com/pubs/pub43438.html)、[Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html)、[Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)、和 [Tupperware](https://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997)。

<!--
Pod is exposed as a primitive in order to facilitate:
d
* scheduler and controller pluggability
* support for pod-level operations without the need to "proxy" them via controller APIs
* decoupling of pod lifetime from controller lifetime, such as for bootstrapping
* decoupling of controllers and services &mdash; the endpoint controller just watches pods
* clean composition of Kubelet-level functionality with cluster-level functionality &mdash; Kubelet is effectively the "pod controller"
* high-availability applications, which will expect pods to be replaced in advance of their termination and certainly in advance of deletion, such as in the case of planned evictions or image prefetching.
-->

Pod 暴露为原语是为了便于：

* 调度器和控制器可插拔性
* 支持 Pod 级别的操作，而不需要通过控制器 API "代理" 它们
* Pod 生命与控制器生命的解耦，如自举
* 控制器和服务的解耦；端点控制器只监视 Pod
* Kubelet 级别的功能与集群级别功能的清晰组合；Kubelet 实际上是 "Pod 控制器"
* 高可用性应用程序期望在 Pod 终止之前并且肯定要在 Pod 被删除之前替换 Pod，例如在计划驱逐或镜像预先提取的情况下。

<!--
## Termination of Pods

Because pods represent running processes on nodes in the cluster, it is important to allow those processes to gracefully terminate when they are no longer needed (vs being violently killed with a KILL signal and having no chance to clean up). Users should be able to request deletion and know when processes terminate, but also be able to ensure that deletes eventually complete. When a user requests deletion of a pod, the system records the intended grace period before the pod is allowed to be forcefully killed, and a TERM signal is sent to the main process in each container. Once the grace period has expired, the KILL signal is sent to those processes, and the pod is then deleted from the API server. If the Kubelet or the container manager is restarted while waiting for processes to terminate, the termination will be retried with the full grace period.
-->

## Pod 的终止

因为 Pod 代表在集群中的节点上运行的进程，所以当不再需要这些进程时（与被 KILL 信号粗暴地杀死并且没有机会清理相比），允许这些进程优雅地终止是非常重要的。
用户应该能够请求删除并且知道进程何时终止，但是也能够确保删除最终完成。当用户请求删除 Pod 时，系统会记录在允许强制删除 Pod 之前所期望的宽限期，并向每个容器中的主进程发送 TERM 信号。一旦过了宽限期，KILL 信号就发送到这些进程，然后就从 API 服务器上删除 Pod。如果 Kubelet 或容器管理器在等待进程终止时发生重启，则终止操作将以完整的宽限期进行重试。


<!--
An example flow:

1. User sends command to delete Pod, with default grace period (30s)
1. The Pod in the API server is updated with the time beyond which the Pod is considered "dead" along with the grace period.
1. Pod shows up as "Terminating" when listed in client commands
1. (simultaneous with 3) When the Kubelet sees that a Pod has been marked as terminating because the time in 2 has been set, it begins the pod shutdown process.
    1. If the pod has defined a [preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details), it is invoked inside of the pod. If the `preStop` hook is still running after the grace period expires, step 2 is then invoked with a small (2 second) extended grace period.
    1. The processes in the Pod are sent the TERM signal.
1. (simultaneous with 3) Pod is removed from endpoints list for service, and are no longer considered part of the set of running pods for replication controllers. Pods that shutdown slowly cannot continue to serve traffic as load balancers (like the service proxy) remove them from their rotations.
1. When the grace period expires, any processes still running in the Pod are killed with SIGKILL.
1. The Kubelet will finish deleting the Pod on the API server by setting grace period 0 (immediate deletion). The Pod disappears from the API and is no longer visible from the client.
-->

流程示例：

1. 用户发送命令删除 Pod，使用的是默认的宽限期（30秒）
2. API 服务器中的 Pod 会随着宽限期规定的时间进行更新，过了这个时间 Pod 就会被认为已 "死亡"。
3. 当使用客户端命令查询 Pod 状态时，Pod 显示为 "Terminating"。
4. （和第3步同步进行）当 Kubelet 看到 Pod 由于步骤2中设置的时间而被标记为 terminating 状态时，它就开始执行关闭 Pod 流程。
    1. 如果 Pod 定义了 [preStop 钩子](/docs/concepts/containers/container-lifecycle-hooks/#hook-details)，就在 Pod 内部调用它。如果宽限期结束了 `preStop` 钩子还在运行，那么就用小的（2秒）扩展宽限期调用步骤2。

    2. 给 Pod 内的进程发送 TERM 信号。
5. （和第3步同步进行）从服务的端点列表中删除 Pod，Pod也不再被视为副本控制器的运行状态的 Pod 集的一部分。当负载平衡器（如服务代理）将 Pod 从轮换中移除时，关闭迟缓的 Pod 将不能继续为流量服务。
6. 当宽限期结束后，Pod 中运行的任何进程都将被用 SIGKILL 杀死。
7. Kubelet 将通过设置宽限期为0（立即删除）来完成删除 API 服务器上的 Pod。Pod 从 API 中消失，从客户端也不再可见。


<!--
By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports the `--grace-period=<seconds>` option which allows a user to override the default and specify their own value. The value `0` [force deletes](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) the pod. In kubectl version >= 1.5, you must specify an additional flag `--force` along with `--grace-period=0` in order to perform force deletions.
-->

默认情况下，所有删除在30秒内都是优雅的。`kubectl delete` 命令支持 `--grace-period=<seconds>` 选项，允许用户覆盖默认值并声明他们自己的宽限期。设置为 ‘0’ 会[强制删除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) Pod。在 kubectl 1.5以后的版本（含1.5版本）中，为了执行强制删除，您还必须为 `--grace-period=0` 声明一个额外的 `--force` 标志。

<!--
### Force deletion of pods

Force deletion of a Pod is defined as deletion of a Pod from the cluster state and etcd immediately. When a force deletion is performed, the API server does not wait for confirmation from the kubelet that the Pod has been terminated on the node it was running on. It removes the Pod in the API immediately so a new Pod can be created with the same name. On the node, Pods that are set to terminate immediately will still be given a small grace period before being force killed.

Force deletions can be potentially dangerous for some pods and should be performed with caution. In case of StatefulSet pods, please refer to the task documentation for [deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
-->

### Pod 的强制删除

强制删除pod定义为从集群状态和 etcd 中立即删除 Pod。当执行强制删除时，apiserver 并不会等待 kubelet 的确认信息，该 Pod 已在所运行的节点上被终止了。强制删除操作从 API 中立即清除了 Pod， 因此可以用相同的名称创建一个新的 Pod。在节点上，设置为立即终止的 Pod 还是会在被强制删除前设置一个小的宽限期。

强制删除对某些 Pod 可能具有潜在危险，因此应该谨慎地执行。对于 StatefulSet 管理的 Pod，请参考 [从 StatefulSet 中删除 Pod](/docs/tasks/run-application/force-delete-stateful-set-pod/)的任务文档。

<!--
## Privileged mode for pod containers

From Kubernetes v1.1, any container in a pod can enable privileged mode, using the `privileged` flag on the `SecurityContext` of the container spec. This is useful for containers that want to use linux capabilities like manipulating the network stack and accessing devices. Processes within the container get almost the same privileges that are available to processes outside a container. With privileged mode, it should be easier to write network and volume plugins as separate pods that don't need to be compiled into the kubelet.

If the master is running Kubernetes v1.1 or higher, and the nodes are running a version lower than v1.1, then new privileged pods will be accepted by api-server, but will not be launched. They will be pending state.
If user calls `kubectl describe pod FooPodName`, user can see the reason why the pod is in pending state. The events table in the describe command output will say:
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`
-->

## Pod 容器的特权模式

从 Kubernetes v1.1 开始，Pod 内的任何容器都可以开启特权模式，开启的方法是在容器声明中的  `SecurityContext` 域使用  `privileged` 标志。这对于希望使用linux功能（如操作网络堆栈和访问设备）的容器非常有用。容器内的进程获得的特权与容器外的进程几乎相同。使用特权模式，将网络和卷插件编写为不需要编译到 kubelet 中的独立的 Pod 应该更容易。

如果主节点的 Kubernetes 版本是 v1.1 或更高，而工作节点的版本低于 v1.1，新的特权 Pod 将被 API 服务器接受，但不会被启动。它们将处于 pending 状态。如果用户使用命令 `kubectl describe pod FooPodName`，就可以看到 Pod 处于 pending 状态的原因。`describe` 命令的输出事件列表将显示：
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`

<!--
If the master is running a version lower than v1.1, then privileged pods cannot be created. If user attempts to create a pod, that has a privileged container, the user will get the following error:
`The Pod "FooPodName" is invalid.
spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`
-->

如果主节点的版本低于 v1.1，那么特权 Pod 就不能被创建。如果用户尝试创建有特权容器的 Pod，将会得到下面的错误信息：
`The Pod "FooPodName" is invalid.
spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`

<!--
## API Object

Pod is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at:
[Pod API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

{{% /capture %}}
-->

## API 对象

Pod 是 Kubernetes REST API 中的顶级资源。关于该 API 对象的更详细信息请参考 [Pod API 对象](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)。
