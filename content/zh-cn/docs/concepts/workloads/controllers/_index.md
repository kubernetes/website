---
title: "工作负载管理"
weight: 20
simple_list: true
---
<!--
title: "Workload Management"
weight: 20
simple_list: true
-->

<!--
Kubernetes provides several built-in APIs for declarative management of your
{{< glossary_tooltip text="workloads" term_id="workload" >}}
and the components of those workloads.
-->
Kubernetes 提供了几个内置的 API
来声明式管理{{< glossary_tooltip text="工作负载" term_id="workload" >}}及其组件。

<!--
Ultimately, your applications run as containers inside
{{< glossary_tooltip term_id="Pod" text="Pods" >}}; however, managing individual
Pods would be a lot of effort. For example, if a Pod fails, you probably want to
run a new Pod to replace it. Kubernetes can do that for you.
-->
最终，你的应用以容器的形式在 {{< glossary_tooltip term_id="Pod" text="Pods" >}} 中运行；
但是，直接管理单个 Pod 的工作量将会非常繁琐。例如，如果一个 Pod 失败了，你可能希望运行一个新的
Pod 来替换它。Kubernetes 可以为你完成这些操作。

<!--
You use the Kubernetes API to create workload
{{< glossary_tooltip text="object" term_id="object" >}} that represent a higher level
abstraction than a Pod, and then the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} automatically manages
Pod objects on your behalf, based on the specification for the workload object you defined.
-->
你可以使用 Kubernetes API 创建工作负载{{< glossary_tooltip text="对象" term_id="object" >}}，
这些对象所表达的是比 Pod 更高级别的抽象概念，Kubernetes
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}根据你定义的工作负载对象规约自动管理 Pod 对象。

<!--
The built-in APIs for managing workloads are:
-->
用于管理工作负载的内置 API 包括：

<!--
[Deployment](/docs/concepts/workloads/controllers/deployment/) (and, indirectly, [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)),
the most common way to run an application on your cluster.
Deployment is a good fit for managing a stateless application workload on your cluster, where
any Pod in the Deployment is interchangeable and can be replaced if needed.
(Deployments are a replacement for the legacy
{{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}} API).
-->
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)
（也间接包括 [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)）
是在集群上运行应用的最常见方式。Deployment 适合在集群上管理无状态应用工作负载，
其中 Deployment 中的任何 Pod 都是可互换的，可以在需要时进行替换。
（Deployment 替代原来的 {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}} API）。

<!--
A [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) lets you
manage one or more Pods – all running the same application code – where the Pods rely
on having a distinct identity. This is different from a Deployment where the Pods are
expected to be interchangeable.
The most common use for a StatefulSet is to be able to make a link between its Pods and
their persistent storage. For example, you can run a StatefulSet that associates each Pod
with a [PersistentVolume](/docs/concepts/storage/persistent-volumes/). If one of the Pods
in the StatefulSet fails, Kubernetes makes a replacement Pod that is connected to the
same PersistentVolume.
-->
[StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
允许你管理一个或多个运行相同应用代码、但具有不同身份标识的 Pod。
StatefulSet 与 Deployment 不同。Deployment 中的 Pod 预期是可互换的。
StatefulSet 最常见的用途是能够建立其 Pod 与其持久化存储之间的关联。
例如，你可以运行一个将每个 Pod 关联到 [PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)
的 StatefulSet。如果该 StatefulSet 中的一个 Pod 失败了，Kubernetes 将创建一个新的 Pod，
并连接到相同的 PersistentVolume。

<!--
A [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) defines Pods that provide
facilities that are local to a specific {{< glossary_tooltip text="node" term_id="node" >}};
for example, a driver that lets containers on that node access a storage system. You use a DaemonSet
when the driver, or other node-level service, has to run on the node where it's useful.
Each Pod in a DaemonSet performs a role similar to a system daemon on a classic Unix / POSIX
server.
A DaemonSet might be fundamental to the operation of your cluster,
such as a plugin to let that node access
[cluster networking](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model),
it might help you to manage the node,
or it could provide less essential facilities that enhance the container platform you are running.
You can run DaemonSets (and their pods) across every node in your cluster, or across just a subset (for example,
only install the GPU accelerator driver on nodes that have a GPU installed).
-->
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/)
定义了在特定{{< glossary_tooltip text="节点" term_id="node" >}}上提供本地设施的 Pod，
例如允许该节点上的容器访问存储系统的驱动。当必须在合适的节点上运行某种驱动或其他节点级别的服务时，
你可以使用 DaemonSet。DaemonSet 中的每个 Pod 执行类似于经典 Unix / POSIX
服务器上的系统守护进程的角色。DaemonSet 可能对集群的操作至关重要，
例如作为插件让该节点访问[集群网络](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)，
也可能帮助你管理节点，或者提供增强正在运行的容器平台所需的、不太重要的设施。
你可以在集群的每个节点上运行 DaemonSets（及其 Pod），或者仅在某个子集上运行
（例如，只在安装了 GPU 的节点上安装 GPU 加速驱动）。

<!--
You can use a [Job](/docs/concepts/workloads/controllers/job/) and / or
a [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) to
define tasks that run to completion and then stop. A Job represents a one-off task,
whereas each CronJob repeats according to a schedule.
-->
你可以使用 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 和/或
[CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/) 定义一次性任务和定时任务。
Job 表示一次性任务，而每个 CronJob 可以根据排期表重复执行。

<!--
Other topics in this section:
-->
本节中的其他主题：
<!-- relies on simple_list: true in the front matter -->
