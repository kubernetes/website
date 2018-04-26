---
assignees:
title: Pods
redirect_from:
- "/docs/user-guide/pods/index/"
- "/docs/user-guide/pods/index.html"
---

* TOC
{:toc}

<!--
_pods_ are the smallest deployable units of computing that can be created and
managed in Kubernetes.
-->
_pods_ 是 Kubernetes 可以创建和管理的最小单元。
<!--
## What is a Pod?

A _pod_ (as in a pod of whales or pea pod) is a group of one or more containers
(such as Docker containers), the shared storage for those containers, and
options about how to run the containers.  A pod's contents are always co-located and
co-scheduled, and run in a shared context.  A pod models an
application-specific "logical host" - it contains one or more application
containers which are relatively tightly coupled &mdash; in a pre-container
world, they would have executed on the same physical or virtual machine.
-->
## Pod 是什么？

_pod_ (就像鲸群或者豌豆荚一样）是一组共享存储空间和运行选项的容器(例如 Docker 容器)。一个 pod 的内容是运行在一个共享的上下文里，并且总是协同寻址，协同调度的。pod 为应用模拟了一个逻辑主机 - 这个主机包含了一个或者多个相互紧密联系的应用容器；在没有容器技术之前，我们可以把它们看作是执行在同一物理或者虚拟机上的应用。
<!--
While Kubernetes supports more container runtimes than just Docker, Docker is
the most commonly known runtime, and it helps to describe pods in Docker terms.

The shared context of a pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a Docker
container.  Within a pod's context, the individual applications may have
further sub-isolations applied.
-->
虽然 Kubernetes 也支持除了 Docker 以外的其他容器运行环境，但是 Docker 是最为人们所认可的容器运行环境，所以使用 Docker 术语来描述 pod 有助于用户理解。

pod 所共享的上下文其实是一系列 Linux namespaces, cgroups, 和其他底层的隔离设施 - 这些技术同样是 Docker 容器隔离的基础。在 Pod的上下文中，各个应用可能具有进一步的子隔离。
<!--
Containers within a pod share an IP address and port space, and
can find each other via `localhost`. They can also communicate with each
other using standard inter-process communications like SystemV semaphores or
POSIX shared memory.  Containers in different pods have distinct IP addresses
and can not communicate by IPC.

Applications within a pod also have access to shared volumes, which are defined
as part of a pod and are made available to be mounted into each application's
filesystem.
-->
pod 里的所有容器共享一个 IP 地址和端口，通过 `localhost` 这些容器可以很容易地发现彼此。 它们也可以使用标准的进程间通信，比如说 SystemV semaphores 或者 POSIX 共享内存相互通信。不同 pod 中的容器有自己单独的 IP 地址, 而且相互之间不能通过 IPC 进行通信。

作为 pod 的组成部分，共享卷可以被 pod 内的所有应用访问，可以挂载到所有应用的文件系统中。
<!--
In terms of [Docker](https://www.docker.com/) constructs, a pod is modelled as
a group of Docker containers with shared namespaces and shared
[volumes](/docs/concepts/storage/volumes/). PID namespace sharing is not yet implemented in Docker.

Like individual application containers, pods are considered to be relatively
ephemeral (rather than durable) entities. As discussed in [life of a
pod](/docs/concepts/workloads/pods/pod-lifecycle/), pods are created, assigned a unique ID (UID), and
scheduled to nodes where they remain until termination (according to restart
policy) or deletion. If a node dies, the pods scheduled to that node are
scheduled for deletion, after a timeout period. A given pod (as defined by a UID) is not
"rescheduled" to a new node; instead, it can be replaced by an identical pod,
with even the same name if desired, but with a new UID (see [replication
controller](/docs/concepts/workloads/controllers/replicationcontroller/) for more details). (In the future, a
higher-level API may support pod migration.)
-->
在 [Docker](https://www.docker.com/) 的术语里， pod 是一组被模块化的拥有共享命名空间和共享 [卷](/docs/concepts/storage/volumes/) 的容器。 到现在为止Docker并没有实现 PID 命名空间共享。

就像独立的应用容器， pod 也是相对短暂（非持久）的实体。 就像在 [life of a
pod](/docs/concepts/workloads/pods/pod-lifecycle/) 里描述的， pod 被创建后会分配一个唯一的 ID (UID),然后 pod 会被调度到一个节点上直到被终止（ 通过重启策略）或者被删除。如果一个节点停止运行， 其上的 pod 在一段时间后将被删除。 指定的 pod (由 UID 来标识)不会被重新调度到新节点上，而是会被另外一个等价 pod 取代。 这个 pod 名字可以与原来的相同，但是 UID 会重新生成（详细内容请参见 [replication
controller](/docs/concepts/workloads/controllers/replicationcontroller/)）。（在后续版本中，一个高级别的 API 将能实现 pod 迁移。）
<!--
When something is said to have the same lifetime as a pod, such as a volume,
that means that it exists as long as that pod (with that UID) exists. If that
pod is deleted for any reason, even if an identical replacement is created, the
related thing (e.g. volume) is also destroyed and created anew.

![pod diagram](/images/docs/pod.svg){: style="max-width: 50%" }

*A multi-container pod that contains a file puller and a
web server that uses a persistent volume for shared storage between the containers.*
-->
当我们说某一事物（例如卷）与 pod 生命周期相同，这意味着只要 pod（由 UID 标识）存在该事物就存在。如果pod被删除，不管出于什么原因，哪怕有等价 pod 被创建，这个 pod 上同周期的资源都会被销毁然后重新创建。

![pod diagram](/images/docs/pod.svg){: style="max-width: 50%" }

*一个包含了多个容器的 pod，包含了一个文件下拉器和 web 服务器，其中 web 服务器使用持久卷作为容器间的共享存储。
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
## 为什么需要 pod ？

###管理需求

Pod 是这样一个模式的抽象：互相协作的多个进程共同形成一个完整的服务。通过提供对应用的更高层次的抽象，pod简化了应用部署和管理。pod是部署、水平扩展以及复制的基本单元。容器的协同工作（协同调度)，共享生命周期(比如说：终止), 复制协调，资源共享以及依赖管理都自动在 pod 内部进行处理。
<!--
### Resource sharing and communication

Pods enable data sharing and communication among their constituents.

The applications in a pod all use the same network namespace (same IP and port
space), and can thus "find" each other and communicate using `localhost`.
Because of this, applications in a pod must coordinate their usage of ports.
Each pod has an IP address in a flat shared networking space that has full
communication with other physical computers and pods across the network.

The hostname is set to the pod's Name for the application containers within the
pod. [More details on networking](/docs/concepts/cluster-administration/networking/).

In addition to defining the application containers that run in the pod, the pod
specifies a set of shared storage volumes. Volumes enable data to survive
container restarts and to be shared among the applications within the pod.
-->
###资源共享和通信

Pod 内部实现了数据共享和相互通信。

在 pod 里的所有应用使用同一个网络空间(相同的 IP 和端口)， 彼此之间可以通过 `localhost` 相互通信。因此在同一个 pod 里的应用必须相互之间协调好端口的使用。每一个 pod 都拥有一个平面网络空间的 IP 地址，使用这个地址可以与网络中其他物理机器和 pods 进行通信。

pod 里的应用容器的主机名被设置成 pod 名字[更多的网络细节](/docs/concepts/cluster-administration/networking/)。

除了定义运行在pod中的应用容器，pod还可以指定一系列共享存储卷。有了卷，数据就不会在容器重启后丢失，数据还可以在pod内的容器之间共享。
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
## pods 的使用

Pods 可以被用于托管垂直集成的应用栈（比如说 LAMP)，但是 pod 最显著的优势是支持协同定位，协作管理辅助程序。比如说：
*内容管理系统， 文件和数据的导入，本地缓存管理等。
*日志和检查点的备份，压缩，轮转，快照等。
*数据变化监测，日志检测，日志和监控，事件发布等。
*代理， 桥接器, 和连接器。
*控制，管理，配置和更新管理。
<!--
Individual pods are not intended to run multiple instances of the same
application, in general.

For a longer explanation, see [The Distributed System ToolKit: Patterns for
Composite
Containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html).
-->
通常独立的 pod 不应该用于运行同一应用的多个实例。

关于这部分的详细解释，请参见[The Distributed System ToolKit: Patterns for
Composite
Containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html)。
<!--
## Alternatives considered

_Why not just run multiple programs in a single (Docker) container?_

1. Transparency. Making the containers within the pod visible to the
   infrastructure enables the infrastructure to provide services to those
   containers, such as process management and resource monitoring. This
   facilitates a number of conveniences for users.
2. Decoupling software dependencies. The individual containers may be
   versioned, rebuilt and redeployed independently. Kubernetes may even support
   live updates of individual containers someday.
3. Ease of use. Users don't need to run their own process managers, worry about
   signal and exit-code propagation, etc.
4. Efficiency. Because the infrastructure takes on more responsibility,
   containers can be lighter weight.
-->
## 关于选择的思考

_为什么不在一个容器 (Docker) 里运行多个程序？

1.透明度。让 pod 里的容器可见于框架，框架则可以很容易的给这些容器提供服务，比如说：进程管理，资源监控。 这种机制给用户带来了很大的便利。
2.解耦软件依赖。每一个独立的容器都可以单独管理版本，也可以单独重构和重新部署。 Kubernetes 甚至有一天可以实现为单独容器的在线升级。
3.易用性。用户们不需要运行自己的进程管理，也不需要担心信号和退出处理等等。
4.效率。由于基础设施承担了更多的职责，容器从而变得更加轻量级。
<!--
_Why not support affinity-based co-scheduling of containers?_

That approach would provide co-location, but would not provide most of the
benefits of pods, such as resource sharing, IPC, guaranteed fate sharing, and
simplified management.
-->
_为什么不支持基于亲和性的容器协同调度？_

这个方法可以提供协同寻址，但是不能提供大多数 pods 优势，比如说资源共享， IPC, 生命周期共享以及最简化的管理。
<!--
## Durability of pods (or lack thereof)

Pods aren't intended to be treated as durable entities. They won't survive scheduling failures, node failures, or other evictions, such as due to lack of resources, or in the case of node maintenance.

In general, users shouldn't need to create pods directly. They should almost always use controllers (e.g., [Deployments](/docs/concepts/workloads/controllers/deployment/)), even for singletons.  Controllers provide self-healing with a cluster scope, as well as replication and rollout management.

The use of collective APIs as the primary user-facing primitive is relatively common among cluster scheduling systems, including [Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](http://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).
-->
## pods 持久性（pod 需要提升的方面）

Pod 从一开始就没有被设计成一个持续性的实体。一旦遇到下面这些场景时 Pod 就会死亡：调度失败，节点宕机、Pod驱逐（比如由于资源不足）、节点维护。

通常情况下，用户不必直接创建 pod， 而是应该总是使用 controller(比如说：[Deployment](/docs/concepts/workloads/controllers/deployment/))，哪怕是用户只需要一个pod。 Controller 提供了集群内部 Pod 自我修复、Pod 复制和回滚管理。

使用集群 API 作为面向用户的主要原语言的方法在集群调度系统里很常见，包含了[Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](http://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997)


<!--
Pod is exposed as a primitive in order to facilitate:

* scheduler and controller pluggability
* support for pod-level operations without the need to "proxy" them via controller APIs
* decoupling of pod lifetime from controller lifetime, such as for bootstrapping
* decoupling of controllers and services &mdash; the endpoint controller just watches pods
* clean composition of Kubelet-level functionality with cluster-level functionality &mdash; Kubelet is effectively the "pod controller"
* high-availability applications, which will expect pods to be replaced in advance of their termination and certainly in advance of deletion, such as in the case of planned evictions, image prefetching, or live pod migration [#3949](http://issue.k8s.io/3949)
-->
Pod作为Kubernetes的最小管理单元，带来了下述好处：

*调度器和控制器的可拔插性。
*支持 pod 层操作，而不需要通过 controller APIs “代理”。
*将 pod 的生存期从 controller 中剥离出来，从而减少相互影响。
*剥离出 controller 和 services &mdash; endpoint controller 只需要监控 pod。
*集群级别的功能和 Kubelet 级别的功能组合更加清晰 &mdash; Kubelet 是一个非常有效的 “pod controller"。
*高可用应用。在终止和删除 Pod 前，必须提前生成替代 pod, 比如说在下面这些情景里：有计划的删除，镜像预取或者实时 pod 迁移 [#3949](http://issue.k8s.io/3949)。
<!--
There is new first-class support for stateful pods with the [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/) controller (currently in beta). The feature was alpha in 1.4 and was called [PetSet](/docs/concepts/workloads/controllers/petset/). For prior versions of Kubernetes, best practice for having stateful pods is to create a replication controller with `replicas` equal to `1` and a corresponding service, see [this MySQL deployment example](/docs/tutorials/stateful-application/run-stateful-application/). 
-->
StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/) 控制器（当前处于 beta 版本）中有状态 Pod 的优先支持。这个功能在 1.4 版本中是alpha版本，被称为 [PetSet](/docs/concepts/workloads/controllers/petset/)。 在 Kubernets 之前的版本里， 最好的实现有状态 pod 的方法是创建一个 replicas 设置为1的 replication controller 以及相应的 service，详细介绍请参考[this MySQL deployment example](/docs/tutorials/stateful-application/run-stateful-application/)。
<!--
## Termination of Pods

Because pods represent running processes on nodes in the cluster, it is important to allow those processes to gracefully terminate when they are no longer needed (vs being violently killed with a KILL signal and having no chance to clean up). Users should be able to request deletion and know when processes terminate, but also be able to ensure that deletes eventually complete. When a user requests deletion of a pod the system records the intended grace period before the pod is allowed to be forcefully killed, and a TERM signal is sent to the main process in each container. Once the grace period has expired the KILL signal is sent to those processes and the pod is then deleted from the API server. If the Kubelet or the container manager is restarted while waiting for processes to terminate, the termination will be retried with the full grace period.
-->
## Pods 的终止

由于 pods 是一个运行在集群中的进程，所以很重要的一点是，当它们不再被需要时如何优雅地终止 Pod (而不是粗暴的使用 KILL 命令杀死它们以至于没有做清理工作)。用户需要能够发起一个删除 Pod 的请求，知晓 Pod 何时终止，同时应该也能够确认这个删除事件是否已经完成。当用户提出删除一个 pod 的请求时，系统会先发送 TERM 信号给每个容器的主进程，如果在预设的宽限期之后这些进程没有自主终止运行，系统会发送 KILL 信号给这些进程，接着 pod 将被从 API server 中删除。如果 Kubelet 或者 container manager 在等待结束进程时重新启动，终止操作将在宽限期内反复重试。
<!--
An example flow:

1. User sends command to delete Pod, with default grace period (30s)
2. The Pod in the API server is updated with the time beyond which the Pod is considered "dead" along with the grace period.
3. Pod shows up as "Terminating" when listed in client commands
4. (simultaneous with 3) When the Kubelet sees that a Pod has been marked as terminating because the time in 2 has been set, it begins the pod shutdown process.
  1. If the pod has defined a [preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details), it is invoked inside of the pod. If the `preStop` hook is still running after the grace period expires, step 2 is then invoked with a small (2 second) extended grace period.
  2. The processes in the Pod are sent the TERM signal.
5. (simultaneous with 3), Pod is removed from endpoints list for service, and are no longer considered part of the set of running pods for replication controllers. Pods that shutdown slowly can continue to serve traffic as load balancers (like the service proxy) remove them from their rotations.
6. When the grace period expires, any processes still running in the Pod are killed with SIGKILL.
7. The Kubelet will finish deleting the Pod on the API server by setting grace period 0 (immediate deletion). The Pod disappears from the API and is no longer visible from the client.
-->
示例流程：

1. 用户发送一个删除 Pod 的命令， 并使用默认的宽限期（30s)。
2. 把 API server 上的 pod 的时间更新成 Pod 与宽限期一起被认为 "dead" 之外的时间点。
3. 使用客户端的命令，显示出的Pod的状态为 ”terminating”。
4. （与第3步同时发生）Kubelet 发现某一个 Pod 由于时间超过第2步的设置而被标志成 terminating 状态时， Kubelet j将启动一个停止进程。
   1. 如果 pod 已经被定义成一个 [preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details)，这会在 pod 内部进行调用。如果宽限期已经过期但 `preStop` 锚依然还在运行，将调用第2步并在原来的宽限期上加一个小的时间窗口（2 秒钟）。
   2. 把 Pod 里的进程发送到 TERM 信号。
5. （与第3步同时发生），Pod 被从终端的服务列表里移除，同时也不再被 replication controllers 看做时一组运行中的 pods. 在负载均衡（比如说 service proxy）会将它们从轮做中移除前， Pods 这种慢关闭的方式可以继续为流量提供服务。
6. 当宽期限过期时， 任何还在 Pod 里运行的进程都会被 SIGKILL 杀掉。
7. Kubelet 通过在 API server 把宽期限设置成0(立刻删除)的方式完成删除 Pod的过程。 这时 Pod 在 API 里消失，也不再能被用户看到。
<!--
By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports the `--grace-period=<seconds>` option which allows a user to override the default and specify their own value. The value `0` [force deletes](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) the pod. In kubectl version >= 1.5, you must specify an additional flag `--force` along with `--grace-period=0` in order to perform force deletions.
-->
默认所有的宽期限都在30秒内。`kubectl delete` 命令支持 `--grace-period=<seconds>` 选项，这个选项允许用户用他们自己指定的值覆盖默认值。值’0‘代表 [强制删除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) pod. 在 kubectl 1.5 及以上的版本里，执行强制删除时必须同时指定 `--force` ， `--grace-period=0`。
<!--
### Force deletion of pods

Force deletion of a pod is defined as deletion of a pod from the cluster state and etcd immediately. When a force deletion is performed, the apiserver does not wait for confirmation from the kubelet that the pod has been terminated on the node it was running on. It removes the pod in the API immediately so a new pod can be created with the same name. On the node, pods that are set to terminate immediately will still be given a small grace period before being force killed.

Force deletions can be potentially dangerous for some pods and should be performed with caution. In case of StatefulSet pods, please refer to the task documentation for [deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
-->
###强制删除 pods

强制删除一个 pod 是从集群状态还有 etcd 里立刻删除这个 pod. 当 Pod 被强制删除时， api 服务器不会等待来自 Pod 所在节点上的 kubelet 的确认信息：pod 已经被终止。在 API 里 pod 会被立刻删除，这样新的 pod 就能被创建并且使用完全一样的名字。在节点上， pods 被设置成立刻终止后，在强行杀掉前还会有一个很小的宽限期。

<!--
## Privileged mode for pod containers

From Kubernetes v1.1, any container in a pod can enable privileged mode, using the `privileged` flag on the `SecurityContext` of the container spec. This is useful for containers that want to use linux capabilities like manipulating the network stack and accessing devices. Processes within the container get almost the same privileges that are available to processes outside a container. With privileged mode, it should be easier to write network and volume plugins as separate pods that don't need to be compiled into the kubelet.
-->
##Pod 容器的特权模式

从 Kubernetes v1.1 开始， pod 的容器都可以启动特权模式，只需要将 container spec 的 SecurityContext 指定为 privileged 标志。这对于那些想使用网络栈操作以及访问系统设备等 Linux 能力的容器来说，是个非常有用的功能。 容器里的进程获得了与容器外进程几乎完全相同的权限。有了特权模式，编写网络和卷插件变得更加容易，因为它们可以作为独立的 Pod 运行，而无需编译到 kubelet 中去。

<!--
If the master is running Kubernetes v1.1 or higher, and the nodes are running a version lower than v1.1, then new privileged pods will be accepted by api-server, but will not be launched. They will be pending state.
If user calls `kubectl describe pod FooPodName`, user can see the reason why the pod is in pending state. The events table in the describe command output will say:
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`
-->
如果 master 运行的 Kubernetes 版本是 v1.1 或者更高，但是节点上运行的版本低于 v1.1，api-server 虽然会接受新的特权 pod ，但这些 pod 却无法正常运行起来。 它们将一直处于 pending 状态。
当用户调用 `kubectl describe pod FooPodName` 查看 pod 一直处于 pending 状态的原因时，在 describe command 的输出事件表里会有类似下面的信息：
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`
<!--
If the master is running a version lower than v1.1, then privileged pods cannot be created. If user attempts to create a pod, that has a privileged container, the user will get the following error:
`The Pod "FooPodName" is invalid.
spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`
-->
如果 master 运行的 Kubernetes 版本低于 v1.1，则不能创建特权Pod。在这种情况如果用户尝试去创建一个包含特权容器的 pod ，那么将会返回类似下面的错误信息：
`The Pod "FooPodName" is invalid.
spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`
<!--
## API Object

Pod is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at: [Pod API
object](/docs/api-reference/v1.6/#pod-v1-core).
-->
## API 对象
Pod 是一个 Kubernetes REST API 的顶层资源。更多关于 API 对象的信息可以在 [Pod API
object](/docs/api-reference/v1.6/#pod-v1-core) 找到。