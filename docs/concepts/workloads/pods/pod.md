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
_pods_ 是 Kubernetes 在部署时可以用于创建和管理的最小单元
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

一个 _pod_ (在 whales 和 pea的范围里）包含了一个或者多个容器(比如说 Docker 容器), 同时也包括了被这组容器所共享的存储，以及运行这组容器的选项。一个 pod 的内容总是共同定位，共同调度，并且是运行在一个共享的上下问里。pod 模块化一个制定应用的逻辑主机 - 这个主机包含了一个或者多个应用程序容器，这些容器之间的联系非常紧密；在没有容器技术之前，我们可以把他们看作是执行在同一物理或者虚拟机上的应用。
<!--
While Kubernetes supports more container runtimes than just Docker, Docker is
the most commonly known runtime, and it helps to describe pods in Docker terms.

The shared context of a pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a Docker
container.  Within a pod's context, the individual applications may have
further sub-isolations applied.
-->
虽然 Kubernetes 也支持除了 Docker 以外的其他容器运行环境，但是 Docker 是最为人们所认识的容器运行环境，所以 Kubernetes 所值的 pod 概念是基于 Docker领域的。

一个 pod 所共享的上下文其实是一系列 Linux namespaces, cgroups, 以及其他底层的隔离技术 - 这些技术同样是 Docker 容器隔离的基础。 在一个 pod 上下文，一个独立的应用可能会运用到深层次的次级隔离技术
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
一个 pod 里的所有容器共享同一个 IP 地址和端口， 这些容器可以很容易的通过 `localhost` 找到彼此。 它们也可以使用标准的进程间通信比如说 SystemV semaphores 或者 POSIX shared memory 相互通信。 与容器不一样的是 pods 有自己单独的 IP 地址而且相互之间不能通过 IPC 进行通信。

共享卷作为 pod 定义的一部分被设置成可以被挂载到任何一个应用文件系上，pod 里的所有应用都有权限访问共享卷，
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
在 [Docker](https://www.docker.com/) 的结构里， 一个 pod 是一组被模块化的拥有共享 namespaces 和共享 [volumes](/docs/concepts/storage/volumes/) 的容器。 到现在为止Docker并没有实现 PID namespace 的共享。

就像独立的应用容器， pods 也是被认为是相互联系的暂时的（而非永久型）的实体。 就像在 [life of a
pod](/docs/concepts/workloads/pods/pod-lifecycle/) 里描述的， pods 被创建后会分配一个唯一的 ID (UID),然后 pod 会被调度到一个节点上直到被中断（ 通过重启的策略）或者被删除。如果一个节点停止运行， 其上的 pod 在时间限制超过后将被删除。 特定的 pod (通过 UID 指定)不会被重新调度到新街店， 而是会被另外一个一样的 pod 取代。 这个 pod 就算名字与原来的保持一样，但是 UID 会重新生成（详细内容请参见 (see [replication
controller](/docs/concepts/workloads/controllers/replicationcontroller/)。（在未来，一个高级别的 API 将能实现 pod 迁移。
<!--
When something is said to have the same lifetime as a pod, such as a volume,
that means that it exists as long as that pod (with that UID) exists. If that
pod is deleted for any reason, even if an identical replacement is created, the
related thing (e.g. volume) is also destroyed and created anew.

![pod diagram](/images/docs/pod.svg){: style="max-width: 50%" }

*A multi-container pod that contains a file puller and a
web server that uses a persistent volume for shared storage between the containers.*
-->
当我们谈论某一个东西和 pod 在同一个生命周期， 比如说 volume, 那就意味着它只在在 pod(通过 UID 标识) 存在的时候存在。无论这个 pod 是由于什么原因被删除， 甚至创建一个完全一样的替代，这个 pod 上同周期的资源都会被销毁然后重新创建。

![pod diagram](/images/docs/pod.svg){: style="max-width: 50%" }

*一个包含多个容器的 pod 使用一个持久卷作为容器间的共享存储，其中包含一个文件的下拉器和一个 web 服务
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
## pods 出现的原因

###管理需求

Pods 是一个大量相互合作的进程模块模式，pods 大早了一群具有粘性的服务。 这种方式区别与其他使用一系列的其构成应用来部署的方式，它提供更加高层次的、抽象的应用以实现简单化的应该部署。Pods 可以看作一组部署，平行扩展和复制服务。容器的协同工作（协同调度）， 共享生命周期(比如说： 终止), 复制协调，资源共享以及依赖管理都是自动在 pod 内部进行处理的。
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

Pods 之间的资源能够共享数据和相互通信

在 pod 里的所有应用使用同一个网络空间(相同的 IP 和端口)， 由此资源之间可以通过 `localhost` 相互通信。因此在同一个 pod 里的应用必须相互之间协调端口的使用。每一个 pod 都拥有一个平面网络空间的 IP 地址，使用这个地址可以与网络中其他物理机器和 pods 进行通信。

pod 里的应用容器的主机名被设置成 pod 名字[更多的网络细节](/docs/concepts/cluster-administration/networking/).

另外当定义一个运行在 pod 里的应用容器时， pod 同时会指定一系列共享存储卷，这些卷用来存储容器重启数据，同时这些卷被 pod 里的应用所共享
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

Pods 可以被用于光里垂直集成的应用群（比如说 LAPMP)，但是 pod 最显著的优势是支持协同定位，协作管理辅助程序。比如说：
*内容管理系统， 文件和数据的导入，本地缓存管理等。
*日志和检查点的备份，压缩，回放，快照等
*数据变化监测，日志检测，日志和监控，事件发布等
*代理， 桥接起, 和连接器。
*控制，管理，配置和更新管理
<!--
Individual pods are not intended to run multiple instances of the same
application, in general.

For a longer explanation, see [The Distributed System ToolKit: Patterns for
Composite
Containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html).
-->
通常每一个独立的 pods 是不会去运行多个由同一个应用生产的实例。

关于这部分的详细解释，请参见[The Distributed System ToolKit: Patterns for
Composite
Containers](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html).
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

_为什么不在一个容器 (Docker) 里运行多个程序

1.透明度。让 pod 里的容器可见得框架使得 pod 可以很容易的给这些容器通过服务， 比如说：进程管理，资源监控。 这种机制给用户带来了很大的便利
2.减少软件间依赖。每一个独立的容器都是可以版本化，也可以单独的重构和重新部署。 Kubernetes 甚至有一天可以实现为单独的容器的在线升级
3.易用性。用户们不需要运行自己的进程管理，也不需要担心型号和退出处理等等。
4.效率。 由于 pod 的框架仅需要对container负责，从而变得更加轻量级。
<!--
_Why not support affinity-based co-scheduling of containers?_

That approach would provide co-location, but would not provide most of the
benefits of pods, such as resource sharing, IPC, guaranteed fate sharing, and
simplified management.
-->
_为什么不使用支持相似协同调度的容器组？_

这个方法将提过一个协同调度，但是不能将提供大多数的 pods 优势，比如说资源共享， IPC, 生命周期共享以及最简化的管理
<!--
## Durability of pods (or lack thereof)

Pods aren't intended to be treated as durable entities. They won't survive scheduling failures, node failures, or other evictions, such as due to lack of resources, or in the case of node maintenance.

In general, users shouldn't need to create pods directly. They should almost always use controllers (e.g., [Deployments](/docs/concepts/workloads/controllers/deployment/)), even for singletons.  Controllers provide self-healing with a cluster scope, as well as replication and rollout management.

The use of collective APIs as the primary user-facing primitive is relatively common among cluster scheduling systems, including [Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](http://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).
-->
## pods 持久性（或者说是 pod 需要提升的方面）

Pods 从一开始就没有被设计成一个持续性的实体。 它不能检测到调度的失败，节点上的错误以及被终止的问题比如：说资源缺乏，也不能用于节点的维护。

总体来说，用户不应该需要直接创建 pod， 而是应该总是使用 controller(比如说：[部署](/docs/concepts/workloads/controllers/deployment/))，甚至是单独一个节点也建议这么做。 Controllers 提供了一个在集群内部自行修复的功能， 就好像一个复制和启动的管理。

使用集群 API 作为面向用户的主要原语言的方法在集群调度系统里是非常常见的，包含了[Borg](h ), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), and [Tupperware](http://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997)


<!--
Pod is exposed as a primitive in order to facilitate:

* scheduler and controller pluggability
* support for pod-level operations without the need to "proxy" them via controller APIs
* decoupling of pod lifetime from controller lifetime, such as for bootstrapping
* decoupling of controllers and services &mdash; the endpoint controller just watches pods
* clean composition of Kubelet-level functionality with cluster-level functionality &mdash; Kubelet is effectively the "pod controller"
* high-availability applications, which will expect pods to be replaced in advance of their termination and certainly in advance of deletion, such as in the case of planned evictions, image prefetching, or live pod migration [#3949](http://issue.k8s.io/3949)
-->
Pod 被主要暴露用来实现

*调度和管理
*支持 pod 层操作，而不需要通过 controller APIs “代理”
*将 pod 的生存期从 controller中剥离出来，以减少相互影响。
*剥离 controller 和 services &mdash; endpoint controller 只需要监控 pods
*使用集群层的功能使 Kubelet-level 功能组成更加清晰 &mdash; Kubelet 是一个非常有效的 “pod controller"
*高可用应用在终止特别是在被删除前，会生成替代 pods, 比如说在下面这些情景里：有计划的删除， 镜像提取或者实时 pod 迁移 [#3949](http://issue.k8s.io/3949)
<!--
There is new first-class support for stateful pods with the [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/) controller (currently in beta). The feature was alpha in 1.4 and was called [PetSet](/docs/concepts/workloads/controllers/petset/). For prior versions of Kubernetes, best practice for having stateful pods is to create a replication controller with `replicas` equal to `1` and a corresponding service, see [this MySQL deployment example](/docs/tutorials/stateful-application/run-stateful-application/). 
-->
alpha是第一个实现使用 [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/) controller 支持有状态 pod，这个功能在 1.4 版本也被称为 [PetSet](/docs/concepts/workloads/controllers/petset/)。 在 Kubernets之前的版本里， 最好的实现有状态 pods 的方法是创建一个对应的 service, 并在replication controller 把这个 service 的 `replicas` 的值设置成1， 详细介绍请参考[this MySQL deployment example](/docs/tutorials/stateful-application/run-stateful-application/)
<!--
## Termination of Pods

Because pods represent running processes on nodes in the cluster, it is important to allow those processes to gracefully terminate when they are no longer needed (vs being violently killed with a KILL signal and having no chance to clean up). Users should be able to request deletion and know when processes terminate, but also be able to ensure that deletes eventually complete. When a user requests deletion of a pod the system records the intended grace period before the pod is allowed to be forcefully killed, and a TERM signal is sent to the main process in each container. Once the grace period has expired the KILL signal is sent to those processes and the pod is then deleted from the API server. If the Kubelet or the container manager is restarted while waiting for processes to terminate, the termination will be retried with the full grace period.
-->
## Pods 的结束

由于 pods 是一个运行在集群中的进程，所以很重要的一点是当它们在被需要时如何被愉快的结束(而不是粗暴的使用 KILL 命令，这种粗暴的方式使我们没有机会做清理工作)。 当进程结束时用户应该能够提出一个删除的请求，同时应该也能够确认这个删除事件是否已经完成。当用户提出删除一个 pod 的请求时，在 pod 被强行杀死之前系统会记录预期的宽时间窗口， 同时一个 TEERM 的信号被发送给每个容器的主进程。一旦宽时间窗口过期 KILL 信号就会被发送给这些进程， 接着 pod 将被从 API server中删除。 如果 Kubelet 或者 container manager 在等待结束进程时重启， 终止操作将看作在整个时间窗口内失效
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
比如下面的例子：

1. 用户发送一个删除 Pod 的命令， 并使用默认的宽限期（30s)
2. 把 API server 上的 pod 的时间更新成 Pod 与宽限期一起被认为 "dead" 之外的时间点
3. 使用客户端的命令，显示出的Pod的状态为 ”正在终止”
4.（与第3步同时发生）Kubelet 发现某一个 Pod 由于时间超过在第2步的设置而被标志成 “终止”状态时， Kubelet就启动一个停止进程。
   1.如果 pod 已经被定义成一个 [preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details)，这在 pod 内部进行调用。如果当宽限期已经过期但是 `preStop` 锚依然还在运行， 将调用第2步并在原来的宽限期上加一个小的时间窗口（2 秒钟）
   2.把 Pod 里的进程发送到 TERM 信号
5.（与第3步同时发生）， Pod 被从终端的服务列表里移除，同时也不在被 replication controllers 看做时一组运行中的 pods. 由于load balancers（比如说 service proxy）会将它们从轮做中移除， Pods 这种缓慢关闭的方式可以继续为通讯提供服务。
6.当宽期限国旗时， 任何还在 Pod 里运行的进程都会被 SIGKILL 杀掉。
7. Kubelet 通过在在 the API server 把宽期限设置成 0（立刻删除）的方式完成删除 Pod。 Pod 在 API里消失，也不能再被用户所看到。
<!--
By default, all deletes are graceful within 30 seconds. The `kubectl delete` command supports the `--grace-period=<seconds>` option which allows a user to override the default and specify their own value. The value `0` [force deletes](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) the pod. In kubectl version >= 1.5, you must specify an additional flag `--force` along with `--grace-period=0` in order to perform force deletions.
-->
默认所有的宽期限都是在30秒内。`kubectl delete` 命令支持 `--grace-period=<seconds>` 选项，这个选项允许用户用他们自己指定的值覆盖默认值。 值’0‘代表 [强制删除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) pod. 在 kubectl 1.5 及以上的版本里，执行强制删除时你必须同时指定 `--force` ， `--grace-period=0`
<!--
### Force deletion of pods

Force deletion of a pod is defined as deletion of a pod from the cluster state and etcd immediately. When a force deletion is performed, the apiserver does not wait for confirmation from the kubelet that the pod has been terminated on the node it was running on. It removes the pod in the API immediately so a new pod can be created with the same name. On the node, pods that are set to terminate immediately will still be given a small grace period before being force killed.

Force deletions can be potentially dangerous for some pods and should be performed with caution. In case of StatefulSet pods, please refer to the task documentation for [deleting Pods from a StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
-->
###强制删除 pods

强制删除一个 pod 是从集群状态还有 etcd 里立刻删除这个 pod. 当一个强制删除被执行是， apiserver 不会等待 kubelet 的确认信息，pod 已经在其运行的节点上被终止 。在 API 里 pod 会被立刻删除这样一个新的 pod 就能被创建并且使用完全一样的名字。在节点上， pods 被立刻设置成终止后，在强行杀掉前还会有一个很小的时间窗口。

<!--
## Privileged mode for pod containers

From Kubernetes v1.1, any container in a pod can enable privileged mode, using the `privileged` flag on the `SecurityContext` of the container spec. This is useful for containers that want to use linux capabilities like manipulating the network stack and accessing devices. Processes within the container get almost the same privileges that are available to processes outside a container. With privileged mode, it should be easier to write network and volume plugins as separate pods that don't need to be compiled into the kubelet.
-->
##pod 容器的授权模式

从 Kubernetes v1.1 开始， 在同一个 pod 里的容器都可以启动授权模式，只需要将 container spec 的 `SecurityContext` 指定为`privileged`标志。这是个非常有用的功能，特别是对于哪些想使用 linux 自带功能的容器，如：manipulating the network stack 和 accessing devices。 pod 里的进程获得与容器外进程基本相同的权限。 在授权模式里，由于分散的 pods 不需要在 kubelet里编译，它必须使用更容易写的网络和卷插件
<!--
If the master is running Kubernetes v1.1 or higher, and the nodes are running a version lower than v1.1, then new privileged pods will be accepted by api-server, but will not be launched. They will be pending state.
If user calls `kubectl describe pod FooPodName`, user can see the reason why the pod is in pending state. The events table in the describe command output will say:
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`
-->
如果 master 跑在 Kubernetes v1.1 或者更高的版本上，但是节点上运行的是低于 v1.1 的版本，新的授权 pods 虽然会被 api-server 接受，但是却无法正常运行起来。 它们将一直处于 pending 状态／
用户调用 `kubectl describe pod FooPodName` 可以查看 pod 一直处于 pending 状态的原因。
在 describe command 的输出事件表里会有类似下面的信息“
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`
<!--
If the master is running a version lower than v1.1, then privileged pods cannot be created. If user attempts to create a pod, that has a privileged container, the user will get the following error:
`The Pod "FooPodName" is invalid.
spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`
-->
如果 master 是泡在一个比 v1.1 低的版本上， 授权的 pods 直接就不能创建。 如果用户还是要尝试去创建一个 pod并在这个 pod 里生成一个授权容器，那么用户将会获得类似下面的错误信息：
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
object](/docs/api-reference/v1.6/#pod-v1-core) 找到