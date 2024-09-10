---
title: Pod
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 10
no_list: true
---
<!--
reviewers:
- erictune
title: Pods
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 10
no_list: true
-->

<!-- overview -->

<!--
_Pods_ are the smallest deployable units of computing that you can create and manage in Kubernetes.

A _Pod_ (as in a pod of whales or pea pod) is a group of one or more
{{< glossary_tooltip text="containers" term_id="container" >}}, with shared storage and network resources,
and a specification for how to run the containers. A Pod's contents are always co-located and
co-scheduled, and run in a shared context. A Pod models an
application-specific "logical host": it contains one or more application
containers which are relatively tightly coupled.
In non-cloud contexts, applications executed on the same physical or virtual machine are
analogous to cloud applications executed on the same logical host.
-->
**Pod** 是可以在 Kubernetes 中创建和管理的、最小的可部署的计算单元。

**Pod**（就像在鲸鱼荚或者豌豆荚中）是一组（一个或多个）
{{< glossary_tooltip text="容器" term_id="container" >}}；
这些容器共享存储、网络、以及怎样运行这些容器的规约。
Pod 中的内容总是并置（colocated）的并且一同调度，在共享的上下文中运行。
Pod 所建模的是特定于应用的 “逻辑主机”，其中包含一个或多个应用容器，
这些容器相对紧密地耦合在一起。
在非云环境中，在相同的物理机或虚拟机上运行的应用类似于在同一逻辑主机上运行的云应用。

<!--
As well as application containers, a Pod can contain
{{< glossary_tooltip text="init containers" term_id="init-container" >}} that run
during Pod startup. You can also inject
{{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}
for debugging a running Pod.
-->
除了应用容器，Pod 还可以包含在 Pod 启动期间运行的
{{< glossary_tooltip text="Init 容器" term_id="init-container" >}}。
你也可以注入{{< glossary_tooltip text="临时性容器" term_id="ephemeral-container" >}}来调试正在运行的 Pod。

<!-- body -->

<!--
## What is a Pod?
-->
## 什么是 Pod？   {#what-is-a-pod}

{{< note >}}
<!--
You need to install a [container runtime](/docs/setup/production-environment/container-runtimes/)
into each node in the cluster so that Pods can run there.
-->
为了运行 Pod，你需要提前在每个节点安装好[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)。
{{< /note >}}

<!--
The shared context of a Pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a {{< glossary_tooltip text="container" term_id="container" >}}.
Within a Pod's context, the individual applications may have
further sub-isolations applied.

A Pod is similar to a set of containers with shared namespaces and shared filesystem volumes.
-->
Pod 的共享上下文包括一组 Linux 名字空间、控制组（cgroup）和可能一些其他的隔离方面，
即用来隔离{{< glossary_tooltip text="容器" term_id="container" >}}的技术。
在 Pod 的上下文中，每个独立的应用可能会进一步实施隔离。

Pod 类似于共享名字空间并共享文件系统卷的一组容器。

<!--
Pods in a Kubernetes cluster are used in two main ways:

* **Pods that run a single container**. The "one-container-per-Pod" model is the
  most common Kubernetes use case; in this case, you can think of a Pod as a
  wrapper around a single container; Kubernetes manages Pods rather than managing
  the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod can
  encapsulate an application composed of
  [multiple co-located containers](#how-pods-manage-multiple-containers) that are
  tightly coupled and need to share resources. These co-located containers
  form a single cohesive unit.
-->
Kubernetes 集群中的 Pod 主要有两种用法：

* **运行单个容器的 Pod**。"每个 Pod 一个容器"模型是最常见的 Kubernetes 用例；
  在这种情况下，可以将 Pod 看作单个容器的包装器，并且 Kubernetes 直接管理 Pod，而不是容器。
* **运行多个协同工作的容器的 Pod**。
  Pod 可以封装由紧密耦合且需要共享资源的[多个并置容器](#how-pods-manage-multiple-containers)组成的应用。
  这些位于同一位置的容器构成一个内聚单元。

  <!--
  Grouping multiple co-located and co-managed containers in a single Pod is a
  relatively advanced use case. You should use this pattern only in specific
  instances in which your containers are tightly coupled.
  
  You don't need to run multiple containers to provide replication (for resilience
  or capacity); if you need multiple replicas, see
  [Workload management](/docs/concepts/workloads/controllers/).
  -->
  将多个并置、同管的容器组织到一个 Pod 中是一种相对高级的使用场景。
  只有在一些场景中，容器之间紧密关联时你才应该使用这种模式。

  你不需要运行多个容器来扩展副本（为了弹性或容量）；
  如果你需要多个副本，请参阅[工作负载管理](/zh-cn/docs/concepts/workloads/controllers/)。

<!--
## Using Pods

The following is an example of a Pod which consists of a container running the image `nginx:1.14.2`.
-->
## 使用 Pod   {#using-pods}

下面是一个 Pod 示例，它由一个运行镜像 `nginx:1.14.2` 的容器组成。

{{% code_sample file="pods/simple-pod.yaml" %}}

<!--
To create the Pod shown above, run the following command:
-->
要创建上面显示的 Pod，请运行以下命令：

```shell
kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml
```

<!--
Pods are generally not created directly and are created using workload resources.
See [Working with Pods](#working-with-pods) for more information on how Pods are used
with workload resources.

### Workload resources for managing pods
-->
Pod 通常不是直接创建的，而是使用工作负载资源创建的。
有关如何将 Pod 用于工作负载资源的更多信息，请参阅[使用 Pod](#working-with-pods)。

### 用于管理 Pod 的工作负载资源   {#workload-resources-for-managing-pods}

<!--
Usually you don't need to create Pods directly, even singleton Pods. Instead,
create them using workload resources such as {{< glossary_tooltip text="Deployment"
term_id="deployment" >}} or {{< glossary_tooltip text="Job" term_id="job" >}}.
If your Pods need to track state, consider the
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} resource.
-->
通常你不需要直接创建 Pod，甚至单实例 Pod。相反，你会使用诸如
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或
{{< glossary_tooltip text="Job" term_id="job" >}} 这类工作负载资源来创建 Pod。
如果 Pod 需要跟踪状态，可以考虑
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} 资源。

<!--
Each Pod is meant to run a single instance of a given application. If you want to
scale your application horizontally (to provide more overall resources by running
more instances), you should use multiple Pods, one for each instance. In
Kubernetes, this is typically referred to as _replication_.
Replicated Pods are usually created and managed as a group by a workload resource
and its {{< glossary_tooltip text="controller" term_id="controller" >}}.

See [Pods and controllers](#pods-and-controllers) for more information on how
Kubernetes uses workload resources, and their controllers, to implement application
scaling and auto-healing.
-->
每个 Pod 都旨在运行给定应用程序的单个实例。如果希望横向扩展应用程序
（例如，运行多个实例以提供更多的资源），则应该使用多个 Pod，每个实例使用一个 Pod。
在 Kubernetes 中，这通常被称为**副本（Replication）**。
通常使用一种工作负载资源及其{{< glossary_tooltip text="控制器" term_id="controller" >}}来创建和管理一组 Pod 副本。

参见 [Pod 和控制器](#pods-and-controllers)以了解 Kubernetes
如何使用工作负载资源及其控制器以实现应用的扩缩和自动修复。

<!--
Pods natively provide two kinds of shared resources for their constituent containers:
[networking](#pod-networking) and [storage](#pod-storage).
-->
Pod 天生地为其成员容器提供了两种共享资源：[网络](#pod-networking)和[存储](#pod-storage)。

<!--
## Working with Pods

You'll rarely create individual Pods directly in Kubernetes—even singleton Pods. This
is because Pods are designed as relatively ephemeral, disposable entities. When
a Pod gets created (directly by you, or indirectly by a
{{< glossary_tooltip text="controller" term_id="controller" >}}), the new Pod is
scheduled to run on a {{< glossary_tooltip term_id="node" >}} in your cluster.
The Pod remains on that node until the Pod finishes execution, the Pod object is deleted,
the Pod is *evicted* for lack of resources, or the node fails.
-->
## 使用 Pod   {#working-with-pods}

你很少在 Kubernetes 中直接创建一个个的 Pod，甚至是单实例（Singleton）的 Pod。
这是因为 Pod 被设计成了相对临时性的、用后即抛的一次性实体。
当 Pod 由你或者间接地由{{< glossary_tooltip text="控制器" term_id="controller" >}}
创建时，它被调度在集群中的{{< glossary_tooltip text="节点" term_id="node" >}}上运行。
Pod 会保持在该节点上运行，直到 Pod 结束执行、Pod 对象被删除、Pod 因资源不足而被**驱逐**或者节点失效为止。

{{< note >}}
<!--
Restarting a container in a Pod should not be confused with restarting a Pod. A Pod
is not a process, but an environment for running container(s). A Pod persists until
it is deleted.
-->
重启 Pod 中的容器不应与重启 Pod 混淆。
Pod 不是进程，而是容器运行的环境。
在被删除之前，Pod 会一直存在。
{{< /note >}}

<!--
The name of a Pod must be a valid
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
value, but this can produce unexpected results for the Pod hostname.  For best compatibility,
the name should follow the more restrictive rules for a
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).
-->
Pod 的名称必须是一个合法的
[DNS 子域](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)值，
但这可能对 Pod 的主机名产生意外的结果。为获得最佳兼容性，名称应遵循更严格的
[DNS 标签](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)规则。

<!-- 
### Pod OS
-->
### Pod 操作系统   {#pod-os}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

<!--
You should set the `.spec.os.name` field to either `windows` or `linux` to indicate the OS on
which you want the pod to run. These two are the only operating systems supported for now by
Kubernetes. In the future, this list may be expanded.

In Kubernetes v{{< skew currentVersion >}}, the value of `.spec.os.name` does not affect
how the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
picks a node for the Pod to run on. In any cluster where there is more than one operating system for
running nodes, you should set the
[kubernetes.io/os](/docs/reference/labels-annotations-taints/#kubernetes-io-os)
label correctly on each node, and define pods with a `nodeSelector` based on the operating system
label. The kube-scheduler assigns your pod to a node based on other criteria and may or may not
succeed in picking a suitable node placement where the node OS is right for the containers in that Pod.
The [Pod security standards](/docs/concepts/security/pod-security-standards/) also use this
field to avoid enforcing policies that aren't relevant to the operating system.
-->
你应该将 `.spec.os.name` 字段设置为 `windows` 或 `linux` 以表示你希望 Pod 运行在哪个操作系统之上。
这两个是 Kubernetes 目前支持的操作系统。将来，这个列表可能会被扩充。

在 Kubernetes v{{< skew currentVersion >}} 中，`.spec.os.name` 的值对
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
如何选择要运行 Pod 的节点没有影响。在任何有多种操作系统运行节点的集群中，你应该在每个节点上正确设置
[kubernetes.io/os](/zh-cn/docs/reference/labels-annotations-taints/#kubernetes-io-os)
标签，并根据操作系统标签为 Pod 设置 `nodeSelector` 字段。
kube-scheduler 将根据其他标准将你的 Pod 分配到节点，
并且可能会也可能不会成功选择合适的节点位置，其中节点操作系统适合该 Pod 中的容器。
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)也使用这个字段来避免强制执行与该操作系统无关的策略。

<!--
### Pods and controllers

You can use workload resources to create and manage multiple Pods for you. A controller
for the resource handles replication and rollout and automatic healing in case of
Pod failure. For example, if a Node fails, a controller notices that Pods on that
Node have stopped working and creates a replacement Pod. The scheduler places the
replacement Pod onto a healthy Node.

Here are some examples of workload resources that manage one or more Pods:
-->
### Pod 和控制器    {#pods-and-controllers}

你可以使用工作负载资源来创建和管理多个 Pod。
资源的控制器能够处理副本的管理、上线，并在 Pod 失效时提供自愈能力。
例如，如果一个节点失败，控制器注意到该节点上的 Pod 已经停止工作，
就可以创建替换性的 Pod。调度器会将替身 Pod 调度到一个健康的节点执行。

下面是一些管理一个或者多个 Pod 的工作负载资源的示例：

* {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
* {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
* {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}

<!--
### Pod templates

Controllers for {{< glossary_tooltip text="workload" term_id="workload" >}} resources create Pods
from a _pod template_ and manage those Pods on your behalf.

PodTemplates are specifications for creating Pods, and are included in workload resources such as
[Deployments](/docs/concepts/workloads/controllers/deployment/),
[Jobs](/docs/concepts/workloads/controllers/job/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).
-->
### Pod 模板    {#pod-templates}

{{< glossary_tooltip text="工作负载" term_id="workload" >}}资源的控制器通常使用
**Pod 模板（Pod Template）** 来替你创建 Pod 并管理它们。

Pod 模板是包含在工作负载对象中的规范，用来创建 Pod。这类负载资源包括
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)、
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 和
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 等。

<!--
Each controller for a workload resource uses the `PodTemplate` inside the workload
object to make actual Pods. The `PodTemplate` is part of the desired state of whatever
workload resource you used to run your app.

When you create a Pod, you can include
[environment variables](/docs/tasks/inject-data-application/define-environment-variable-container/)
in the Pod template for the containers that run in the Pod.

The sample below is a manifest for a simple Job with a `template` that starts one
container. The container in that Pod prints a message then pauses.
-->
工作负载的控制器会使用负载对象中的 `PodTemplate` 来生成实际的 Pod。
`PodTemplate` 是你用来运行应用时指定的负载资源的目标状态的一部分。

创建 Pod 时，你可以在 Pod 模板中包含 Pod
中运行的容器的[环境变量](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/)。

下面的示例是一个简单的 Job 的清单，其中的 `template` 指示启动一个容器。
该 Pod 中的容器会打印一条消息之后暂停。

<!--
# This is the pod template
# The pod template ends here
-->
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # 这里是 Pod 模板
    spec:
      containers:
      - name: hello
        image: busybox:1.28
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # 以上为 Pod 模板
```

<!--
Modifying the pod template or switching to a new pod template has no direct effect
on the Pods that already exist. If you change the pod template for a workload
resource, that resource needs to create replacement Pods that use the updated template.

For example, the StatefulSet controller ensures that the running Pods match the current
pod template for each StatefulSet object. If you edit the StatefulSet to change its pod
template, the StatefulSet starts to create new Pods based on the updated template.
Eventually, all of the old Pods are replaced with new Pods, and the update is complete.

Each workload resource implements its own rules for handling changes to the Pod template.
If you want to read more about StatefulSet specifically, read
[Update strategy](/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets) in the StatefulSet Basics tutorial.
-->
修改 Pod 模板或者切换到新的 Pod 模板都不会对已经存在的 Pod 直接起作用。
如果改变工作负载资源的 Pod 模板，工作负载资源需要使用更新后的模板来创建 Pod，
并使用新创建的 Pod 替换旧的 Pod。

例如，StatefulSet 控制器针对每个 StatefulSet 对象确保运行中的 Pod 与当前的 Pod
模板匹配。如果编辑 StatefulSet 以更改其 Pod 模板，
StatefulSet 将开始基于更新后的模板创建新的 Pod。

每个工作负载资源都实现了自己的规则，用来处理对 Pod 模板的更新。
如果你想了解更多关于 StatefulSet 的具体信息，
请阅读 StatefulSet 基础教程中的[更新策略](/zh-cn/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets)。

<!--
On Nodes, the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} does not
directly observe or manage any of the details around pod templates and updates; those
details are abstracted away. That abstraction and separation of concerns simplifies
system semantics, and makes it feasible to extend the cluster's behavior without
changing existing code.
-->
在节点上，{{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 并不直接监测或管理与
Pod 模板相关的细节或模板的更新，这些细节都被抽象出来。
这种抽象和关注点分离简化了整个系统的语义，
并且使得用户可以在不改变现有代码的前提下就能扩展集群的行为。

<!--
## Pod update and replacement

As mentioned in the previous section, when the Pod template for a workload
resource is changed, the controller creates new Pods based on the updated
template instead of updating or patching the existing Pods.
-->
## Pod 更新与替换   {#pod-update-and-replacement}

正如前面章节所述，当某工作负载的 Pod 模板被改变时，
控制器会基于更新的模板创建新的 Pod 对象而不是对现有 Pod 执行更新或者修补操作。

<!--
Kubernetes doesn't prevent you from managing Pods directly. It is possible to
update some fields of a running Pod, in place. However, Pod update operations
like 
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core), and
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
have some limitations:
-->
Kubernetes 并不禁止你直接管理 Pod。对运行中的 Pod 的某些字段执行就地更新操作还是可能的。不过，类似
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core) 和
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
这类更新操作有一些限制：

<!--
- Most of the metadata about a Pod is immutable. For example, you cannot
  change the `namespace`, `name`, `uid`, or `creationTimestamp` fields;
  the `generation` field is unique. It only accepts updates that increment the
  field's current value.
- If the `metadata.deletionTimestamp` is set, no new entry can be added to the
  `metadata.finalizers` list.
- Pod updates may not change fields other than `spec.containers[*].image`,
  `spec.initContainers[*].image`, `spec.activeDeadlineSeconds` or
  `spec.tolerations`. For `spec.tolerations`, you can only add new entries.
- When updating the `spec.activeDeadlineSeconds` field, two types of updates
  are allowed:

  1. setting the unassigned field to a positive number; 
  1. updating the field from a positive number to a smaller, non-negative
     number.
-->
- Pod 的绝大多数元数据都是不可变的。例如，你不可以改变其 `namespace`、`name`、
  `uid` 或者 `creationTimestamp` 字段；`generation` 字段是比较特别的，
  如果更新该字段，只能增加字段取值而不能减少。
- 如果 `metadata.deletionTimestamp` 已经被设置，则不可以向 `metadata.finalizers`
  列表中添加新的条目。
- Pod 更新不可以改变除 `spec.containers[*].image`、`spec.initContainers[*].image`、
  `spec.activeDeadlineSeconds` 或 `spec.tolerations` 之外的字段。
  对于 `spec.tolerations`，你只被允许添加新的条目到其中。
- 在更新 `spec.activeDeadlineSeconds` 字段时，以下两种更新操作是被允许的：

  1. 如果该字段尚未设置，可以将其设置为一个正数；
  1. 如果该字段已经设置为一个正数，可以将其设置为一个更小的、非负的整数。

<!--
## Resource sharing and communication

Pods enable data sharing and communication among their constituent
containers.
-->
### 资源共享和通信 {#resource-sharing-and-communication}

Pod 使它的成员容器间能够进行数据共享和通信。

<!--
### Storage in Pods {#pod-storage}

A Pod can specify a set of shared storage
{{< glossary_tooltip text="volumes" term_id="volume" >}}. All containers
in the Pod can access the shared volumes, allowing those containers to
share data. Volumes also allow persistent data in a Pod to survive
in case one of the containers within needs to be restarted. See
[Storage](/docs/concepts/storage/) for more information on how
Kubernetes implements shared storage and makes it available to Pods.
-->
### Pod 中的存储 {#pod-storage}

一个 Pod 可以设置一组共享的存储{{< glossary_tooltip text="卷" term_id="volume" >}}。
Pod 中的所有容器都可以访问该共享卷，从而允许这些容器共享数据。
卷还允许 Pod 中的持久数据保留下来，即使其中的容器需要重新启动。
有关 Kubernetes 如何在 Pod 中实现共享存储并将其提供给 Pod 的更多信息，
请参考[存储](/zh-cn/docs/concepts/storage/)。

<!--
### Pod networking

Each Pod is assigned a unique IP address for each address family. Every
container in a Pod shares the network namespace, including the IP address and
network ports. Inside a Pod (and **only** then), the containers that belong to the Pod
can communicate with one another using `localhost`. When containers in a Pod communicate
with entities *outside the Pod*,
they must coordinate how they use the shared network resources (such as ports).
-->
### Pod 联网    {#pod-networking}

每个 Pod 都在每个地址族中获得一个唯一的 IP 地址。
Pod 中的每个容器共享网络名字空间，包括 IP 地址和网络端口。
**Pod 内**的容器可以使用 `localhost` 互相通信。
当 Pod 中的容器与 **Pod 之外**的实体通信时，它们必须协调如何使用共享的网络资源（例如端口）。

<!--
Within a Pod, containers share an IP address and port space, and
can find each other via `localhost`. The containers in a Pod can also communicate
with each other using standard inter-process communications like SystemV semaphores
or POSIX shared memory.  Containers in different Pods have distinct IP addresses
and can not communicate by OS-level IPC without special configuration.
Containers that want to interact with a container running in a different Pod can
use IP networking to communicate.
-->
在同一个 Pod 内，所有容器共享一个 IP 地址和端口空间，并且可以通过 `localhost` 发现对方。
他们也能通过如 SystemV 信号量或 POSIX 共享内存这类标准的进程间通信方式互相通信。
不同 Pod 中的容器的 IP 地址互不相同，如果没有特殊配置，就无法通过 OS 级 IPC 进行通信。
如果某容器希望与运行于其他 Pod 中的容器通信，可以通过 IP 联网的方式实现。

<!--
Containers within the Pod see the system hostname as being the same as the configured
`name` for the Pod. There's more about this in the [networking](/docs/concepts/cluster-administration/networking/)
section.
-->
Pod 中的容器所看到的系统主机名与为 Pod 配置的 `name` 属性值相同。
[网络](/zh-cn/docs/concepts/cluster-administration/networking/)部分提供了更多有关此内容的信息。

<!--
## Pod security settings {#pod-security}
-->
## Pod 安全设置     {#pod-security}

<!--
To set security constraints on Pods and containers, you use the
`securityContext` field in the Pod specification. This field gives you
granular control over what a Pod or individual containers can do. For example:
-->
要对 Pod 和容器设置安全约束，请使用 Pod 规约中的 `securityContext` 字段。
该字段使你可以精细控制 Pod 或单个容器可以执行的操作。例如：

<!--
* Drop specific Linux capabilities to avoid the impact of a CVE.
* Force all processes in the Pod to run as a non-root user or as a specific
  user or group ID.
* Set a specific seccomp profile.
* Set Windows security options, such as whether containers run as HostProcess.
-->
* 放弃特定的 Linux 权能（Capability）以避免受到某 CVE 的影响。
* 强制 Pod 中的所有进程以非 root 用户或特定用户或组 ID 的身份运行。
* 设置特定的 seccomp 配置文件。
* 设置 Windows 安全选项，例如容器是否作为 HostProcess 运行。

{{< caution >}}
<!--
You can also use the Pod securityContext to enable
[_privileged mode_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)
in Linux containers. Privileged mode overrides many of the other security
settings in the securityContext. Avoid using this setting unless you can't grant
the equivalent permissions by using other fields in the securityContext.
In Kubernetes 1.26 and later, you can run Windows containers in a similarly
privileged mode by setting the `windowsOptions.hostProcess` flag on the
security context of the Pod spec. For details and instructions, see
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
-->
你还可以使用 Pod securityContext 在 Linux 容器中启用[**特权模式**](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)。
特权模式会覆盖 securityContext 中的许多其他安全设置。
请避免使用此设置，除非你无法通过使用 securityContext 中的其他字段授予等效权限。
在 Kubernetes 1.26 及更高版本中，你可以通过在 Pod 规约的安全上下文中设置
`windowsOptions.hostProcess` 标志，以类似的特权模式运行 Windows 容器。
有关详细信息和说明，请参阅[创建 Windows HostProcess Pod](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)。
{{< /caution >}}

<!--
* To learn about kernel-level security constraints that you can use,
  see [Linux kernel security constraints for Pods and containers](/docs/concepts/security/linux-kernel-security-constraints).
* To learn more about the Pod security context, see
  [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).
-->
* 要了解可以使用的内核级安全约束，请参阅 [Pod 和容器的 Linux 内核安全约束](/zh-cn/docs/concepts/security/linux-kernel-security-constraints)。
* 要了解有关 Pod 安全上下文的更多信息，请参阅[为 Pod 或容器配置安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)。

<!--
## Static Pods

_Static Pods_ are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Whereas most Pods are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}), for static
Pods, the kubelet directly supervises each static Pod (and restarts it if it fails).
-->
## 静态 Pod    {#static-pods}

**静态 Pod（Static Pod）** 直接由特定节点上的 `kubelet` 守护进程管理，
不需要 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}看到它们。
尽管大多数 Pod 都是通过控制面（例如，{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
来管理的，对于静态 Pod 而言，`kubelet` 直接监控每个 Pod，并在其失效时重启之。

<!--
Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.
The main use for static Pods is to run a self-hosted control plane: in other words,
using the kubelet to supervise the individual [control plane components](/docs/concepts/overview/components/#control-plane-components).

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there. See the guide [Create static Pods](/docs/tasks/configure-pod-container/static-pod) for more information.
-->
静态 Pod 通常绑定到某个节点上的 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}。
其主要用途是运行自托管的控制面。
在自托管场景中，使用 `kubelet`
来管理各个独立的[控制面组件](/zh-cn/docs/concepts/overview/components/#control-plane-components)。

`kubelet` 自动尝试为每个静态 Pod 在 Kubernetes API
服务器上创建一个{{< glossary_tooltip text="镜像 Pod" term_id="mirror-pod" >}}。
这意味着在节点上运行的 Pod 在 API 服务器上是可见的，但不可以通过 API 服务器来控制。
有关更多信息，请参阅[创建静态 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod) 的指南。

{{< note >}}
<!--
The `spec` of a static Pod cannot refer to other API objects
(e.g., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
-->
静态 Pod 的 `spec` 不能引用其他的 API 对象（例如：
{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}、
{{< glossary_tooltip text="Secret" term_id="secret" >}} 等）。
{{< /note >}}

<!--
### Pods manage multiple containers  {#how-pods-manage-multiple-containers}

Pods are designed to support multiple cooperating processes (as containers) that form
a cohesive unit of service. The containers in a Pod are automatically co-located and
co-scheduled on the same physical or virtual machine in the cluster. The containers
can share resources and dependencies, communicate with one another, and coordinate
when and how they are terminated.
-->
### Pod 管理多个容器   {#how-pods-manage-multiple-containers}

Pod 被设计成支持构造内聚的服务单元的多个协作进程（形式为容器）。
Pod 中的容器被自动并置到集群中的同一物理机或虚拟机上，并可以一起进行调度。
容器之间可以共享资源和依赖、彼此通信、协调何时以及何种方式终止自身。

<!--intentionally repeats some text from earlier in the page, with more detail -->

<!--
Pods in a Kubernetes cluster are used in two main ways:

* **Pods that run a single container**. The "one-container-per-Pod" model is the
  most common Kubernetes use case; in this case, you can think of a Pod as a
  wrapper around a single container; Kubernetes manages Pods rather than managing
  the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod can
  encapsulate an application composed of
  multiple co-located containers that are
  tightly coupled and need to share resources. These co-located containers
  form a single cohesive unit of service—for example, one container serving data
  stored in a shared volume to the public, while a separate
  {{< glossary_tooltip text="sidecar container" term_id="sidecar-container" >}}
  refreshes or updates those files.
  The Pod wraps these containers, storage resources, and an ephemeral network
  identity together as a single unit.
-->
Kubernetes 集群中的 Pod 主要有两种用法：

* **运行单个容器的 Pod**。"每个 Pod 一个容器" 模型是最常见的 Kubernetes 用例；
  在这种情况下，可以将 Pod 看作单个容器的包装器。Kubernetes 直接管理 Pod，而不是容器。
* **运行多个需要协同工作的容器的 Pod**。
  Pod 可以封装由多个紧密耦合且需要共享资源的并置容器组成的应用。
  这些位于同一位置的容器可能形成单个内聚的服务单元 —— 一个容器将文件从共享卷提供给公众，
  而另一个单独的{{< glossary_tooltip text="边车容器" term_id="sidecar-container" >}}则刷新或更新这些文件。
  Pod 将这些容器和存储资源打包为一个可管理的实体。

<!--
For example, you might have a container that
acts as a web server for files in a shared volume, and a separate
[sidecar container](/docs/concepts/workloads/pods/sidecar-containers/)
that updates those files from a remote source, as in the following diagram:
-->
例如，你可能有一个容器，为共享卷中的文件提供 Web 服务器支持，以及一个单独的
[边车（Sidercar）](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)
容器负责从远端更新这些文件，如下图所示：

{{< figure src="/zh-cn/docs/images/pod.svg" alt="Pod 创建示意图" class="diagram-medium" >}}

<!--
Some Pods have {{< glossary_tooltip text="init containers" term_id="init-container" >}}
as well as {{< glossary_tooltip text="app containers" term_id="app-container" >}}.
By default, init containers run and complete before the app containers are started.
-->
有些 Pod 具有 {{< glossary_tooltip text="Init 容器" term_id="init-container" >}}和
{{< glossary_tooltip text="应用容器" term_id="app-container" >}}。
Init 容器默认会在启动应用容器之前运行并完成。

<!--
You can also have [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
that provide auxiliary services to the main application Pod (for example: a service mesh).
-->
你还可以拥有为主应用 Pod 提供辅助服务的
[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)（例如：服务网格）。


{{< feature-state for_k8s_version="v1.29" state="beta" >}}

<!--
Enabled by default, the `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
allows you to specify `restartPolicy: Always` for init containers.
Setting the `Always` restart policy ensures that the init containers where you set it are
treated as _sidecars_ that are kept running during the entire lifetime of the Pod.
See [Sidecar containers and restartPolicy](/docs/concepts/workloads/pods/init-containers/#sidecar-containers-and-restartpolicy)
for more details.
-->
启用 `SidecarContainers` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)（默认启用）允许你为
Init 容器指定 `restartPolicy: Always`。设置重启策略为 `Always` 会确保设置的 Init 容器被视为**边车**，
并在 Pod 的整个生命周期内保持运行。
更多细节参阅[边车容器和重启策略](/zh-cn/docs/concepts/workloads/pods/init-containers/#sidecar-containers-and-restartpolicy)

<!--
## Container probes

A _probe_ is a diagnostic performed periodically by the kubelet on a container. To perform a diagnostic, the kubelet can invoke different actions:

- `ExecAction` (performed with the help of the container runtime)
- `TCPSocketAction` (checked directly by the kubelet)
- `HTTPGetAction` (checked directly by the kubelet)

You can read more about [probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) 
in the Pod Lifecycle documentation.
-->
## 容器探针   {#container-probes}

**Probe** 是由 kubelet 对容器执行的定期诊断。要执行诊断，kubelet 可以执行三种动作：
    
- `ExecAction`（借助容器运行时执行）
- `TCPSocketAction`（由 kubelet 直接检测）
- `HTTPGetAction`（由 kubelet 直接检测）

你可以参阅 Pod 的生命周期文档中的[探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)部分。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [lifecycle of a Pod](/docs/concepts/workloads/pods/pod-lifecycle/).
* Learn about [RuntimeClass](/docs/concepts/containers/runtime-class/) and how you can use it to
  configure different Pods with different container runtime configurations.
* Read about [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) and how you can use it to manage application availability during disruptions.
* Pod is a top-level resource in the Kubernetes REST API.
  The {{< api-reference page="workload-resources/pod-v1" >}}
  object definition describes the object in detail.
* [The Distributed System Toolkit: Patterns for Composite Containers](/blog/2015/06/the-distributed-system-toolkit-patterns/) explains common layouts for Pods with more than one container.
* Read about [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
-->
* 了解 [Pod 生命周期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。
* 了解 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)，
  以及如何使用它来配置不同的 Pod 使用不同的容器运行时配置。
* 了解 [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/)，
  以及你可以如何利用它在出现干扰因素时管理应用的可用性。
* Pod 在 Kubernetes REST API 中是一个顶层资源。
  {{< api-reference page="workload-resources/pod-v1" >}}
  对象的定义中包含了更多的细节信息。
* 博客[分布式系统工具箱：复合容器模式](/blog/2015/06/the-distributed-system-toolkit-patterns/)中解释了在同一
  Pod 中包含多个容器时的几种常见布局。
* 了解 [Pod 拓扑分布约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)。

<!--
To understand the context for why Kubernetes wraps a common Pod API in other resources (such as {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} or {{< glossary_tooltip text="Deployments" term_id="deployment" >}}), you can read about the prior art, including:
-->
要了解为什么 Kubernetes 会在其他资源
（如 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
或 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
封装通用的 Pod API，相关的背景信息可以在前人的研究中找到。具体包括：

<!--
* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google.com/pubs/pub43438.html)
* [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/).
-->
* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google.com/pubs/pub43438.html)
* [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/)。
