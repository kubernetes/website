---
title: "工作负载"
weight: 55
description: 理解 Kubernetes 中可部署的最小计算对象 Pod 以及辅助 Pod 运行的上层抽象。
card:
  title: 工作负载与 Pod
  name: concepts
  weight: 60
---
<!--
title: "Workloads"
weight: 55
description: >
  Understand Pods, the smallest deployable compute object in Kubernetes, and the higher-level abstractions that help you to run them.
no_list: true
card:
  title: Workloads and Pods
  name: concepts
  weight: 60
-->

{{< glossary_definition term_id="workload" length="short" >}}

<!--
Whether your workload is a single component or several that work together, on Kubernetes you run
it inside a set of [_pods_](/docs/concepts/workloads/pods).
In Kubernetes, a Pod represents a set of one or more running
{{< glossary_tooltip text="containers" term_id="container" >}} on your cluster.
-->
在 Kubernetes 中，无论你的负载是由单个组件还是由多个一同工作的组件构成，
你都可以在一组 [**Pod**](/zh-cn/docs/concepts/workloads/pods) 中运行它。在 Kubernetes 中，
Pod 代表的是集群上处于运行状态的一组或更多{{< glossary_tooltip text="容器" term_id="container" >}}的集合。

<!--
Kubernetes pods have a [defined lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
For example, once a pod is running in your cluster then a critical fault on the
{{< glossary_tooltip text="node" term_id="node" >}} where that pod is running means that
all the pods on that node fail. Kubernetes treats that level of failure as final: you
would need to create a new Pod to recover, even if the node later becomes healthy.
-->
Kubernetes Pod 遵循[预定义的生命周期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。
例如，当在你的集群中运行了某个 Pod，但是 Pod
所在的{{< glossary_tooltip text="节点" term_id="node" >}}出现致命错误时，
所有该节点上的 Pod 的状态都会变成失败。Kubernetes 将这类失败视为最终状态：
即使该节点后来恢复正常运行，你也需要创建新的 Pod 以恢复应用。

<!--
However, to make life considerably easier, you don't need to manage each Pod directly.
Instead, you can use _workload resources_ that manage a set of pods on your behalf.
These resources configure {{< glossary_tooltip term_id="controller" text="controllers" >}}
that make sure the right number of the right kind of pod are running, to match the state
you specified.

Kubernetes provides several built-in workload resources:
-->
不过，为了减轻用户的使用负担，通常不需要用户直接管理每个 Pod。
而是使用**负载资源**来替用户管理一组 Pod。
这些负载资源通过配置{{< glossary_tooltip term_id="controller" text="控制器" >}}来确保正确类型的、处于运行状态的
Pod 个数是正确的，与用户所指定的状态相一致。

Kubernetes 提供若干种内置的工作负载资源：

<!--
* [Deployment](/docs/concepts/workloads/controllers/deployment/) and [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
  (replacing the legacy resource
  {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}).
  Deployment is a good fit for managing a stateless application workload on your cluster,
  where any Pod in the Deployment is interchangeable and can be replaced if needed.
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) lets you
  run one or more related Pods that do track state somehow. For example, if your workload
  records data persistently, you can run a StatefulSet that matches each Pod with a
  [PersistentVolume](/docs/concepts/storage/persistent-volumes/). Your code, running in the
  Pods for that StatefulSet, can replicate data to other Pods in the same StatefulSet
  to improve overall resilience.
-->
* [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 和
  [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)
  （替换原来的资源 {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}）。
  Deployment 很适合用来管理你的集群上的无状态应用，Deployment 中的所有
  Pod 都是相互等价的，并且在需要的时候被替换。
* [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
  让你能够运行一个或者多个以某种方式跟踪应用状态的 Pod。
  例如，如果你的负载会将数据作持久存储，你可以运行一个 StatefulSet，将每个
  Pod 与某个 [PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)
  对应起来。你在 StatefulSet 中各个 Pod 内运行的代码可以将数据复制到同一
  StatefulSet 中的其它 Pod 中以提高整体的服务可靠性。
<!--
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) defines Pods that provide
  facilities that are local to nodes.
  Every time you add a node to your cluster that matches the specification in a DaemonSet,
  the control plane schedules a Pod for that DaemonSet onto the new node.
  Each pod in a DaemonSet performs a job similar to a system daemon on a classic Unix / POSIX
  server. A DaemonSet might be fundamental to the operation of your cluster, such as
  a plugin to run [cluster networking](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model),
  it might help you to manage the node,
  or it could provide optional behavior that enhances the container platform you are running.
* [Job](/docs/concepts/workloads/controllers/job/) and
  [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) provide different ways to
  define tasks that run to completion and then stop.
  You can use a [Job](/docs/concepts/workloads/controllers/job/) to
  define a task that runs to completion, just once. You can use a
  [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) to run
  the same Job multiple times according a schedule.
-->
* [DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/)
  定义提供节点本地支撑设施的 Pod。这些 Pod 可能对于你的集群的运维是非常重要的，
  例如作为网络链接的辅助工具或者作为网络{{< glossary_tooltip text="插件" term_id="addons" >}}的一部分等等。
  每次你向集群中添加一个新节点时，如果该节点与某 `DaemonSet`
  的规约匹配，则控制平面会为该 DaemonSet 调度一个 Pod 到该新节点上运行。
* [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 和
  [CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)
  提供不同的方式来定义一些一直运行到结束并停止的任务。
  你可以使用 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
  来定义只需要执行一次并且执行后即视为完成的任务。你可以使用
  [CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)
  来根据某个排期表来多次运行同一个 Job。

<!--
In the wider Kubernetes ecosystem, you can find third-party workload resources that provide
additional behaviors. Using a
[custom resource definition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/),
you can add in a third-party workload resource if you want a specific behavior that's not part
of Kubernetes' core. For example, if you wanted to run a group of Pods for your application but
stop work unless _all_ the Pods are available (perhaps for some high-throughput distributed task),
then you can implement or install an extension that does provide that feature.
-->
在庞大的 Kubernetes 生态系统中，你还可以找到一些提供额外操作的第三方工作负载相关的资源。
通过使用[定制资源定义（CRD）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)，
你可以添加第三方工作负载资源，以完成原本不是 Kubernetes 核心功能的工作。
例如，如果你希望运行一组 Pod，但要求**所有** Pod 都可用时才执行操作
（比如针对某种高吞吐量的分布式任务），你可以基于定制资源实现一个能够满足这一需求的扩展，
并将其安装到集群中运行。

<!--
## Workload placement
-->
## 调度工作负载   {#workload-placement}

{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
While standard workload resources (like Deployments and Jobs) manage the lifecycle of Pods,
you may have complex scheduling requirements where groups of Pods must be treated as a single unit.
-->
虽然标准的工作负载资源（例如 Deployment 和 Job）用于管理 Pod 的生命周期，
但在某些场景下，你可能会有更复杂的调度需求，例如需要将几组 Pod 作为一个单元整体来处理。

<!--
The [Workload API](/docs/concepts/workloads/workload-api/) allows you to define `PodGroupTemplates` to group Pods and apply advanced scheduling policies to them, 
such as [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) and apply 
advanced scheduling policies to them, such as [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
Controllers create [PodGroup](/docs/concepts/workloads/podgroup-api/) objects from these templates at runtime, 
and `Pods` reference their `PodGroup` via the
`spec.schedulingGroup` field. This is particularly useful for batch processing and machine
learning workloads where "all-or-nothing" placement is required.
-->
[Workload API](/zh-cn/docs/concepts/workloads/workload-api/)
允许你定义 `PodGroupTemplates` 来对 Pod 进行分组，
并应用高级调度策略，例如
[Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)。
控制器在运行时根据这些模板创建
[PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/) 对象，
而 `Pod` 通过 `spec.schedulingGroup` 字段引用其 `PodGroup`。
在需要“全有或全无”的调度方式时，这对于批处理和机器学习类工作负载尤其有用。

## {{% heading "whatsnext" %}}

<!--
As well as reading about each API kind for workload management, you can read how to
do specific tasks:

* [Run a stateless application using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)
* Run a stateful application either as a [single instance](/docs/tasks/run-application/run-single-instance-stateful-application/)
  or as a [replicated set](/docs/tasks/run-application/run-replicated-stateful-application/)
* [Run automated tasks with a CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)
-->
除了阅读了解每类 API 资源方便管理工作负载外，你还可以了解如何运行以下特定任务：

* [使用 Deployment 运行一个无状态的应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)
* 以[单实例](/zh-cn/docs/tasks/run-application/run-single-instance-stateful-application/)
  或者[多副本集合](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)的形式运行有状态的应用；
* [使用 CronJob 运行自动化的任务](/zh-cn/docs/tasks/job/automated-tasks-with-cron-jobs/)

<!--
To learn about Kubernetes' mechanisms for separating code from configuration,
visit [Configuration](/docs/concepts/configuration/).
-->
要了解 Kubernetes 将代码与配置分离的实现机制，可参阅[配置](/zh-cn/docs/concepts/configuration/)节。

<!--
There are two supporting concepts that provide backgrounds about how Kubernetes manages pods
for applications:
* [Garbage collection](/docs/concepts/architecture/garbage-collection/) tidies up objects
  from your cluster after their _owning resource_ has been removed.
* The [_time-to-live after finished_ controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  removes Jobs once a defined time has passed since they completed.
-->
关于 Kubernetes 如何为应用管理 Pod，还有两个支撑概念能够提供相关背景信息：

* [垃圾收集](/zh-cn/docs/concepts/architecture/garbage-collection/)机制负责在对象的**属主资源**被删除时在集群中清理这些对象。
* [**Time-to-Live** 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)会在 Job
  结束之后的指定时间间隔之后删除它们。

<!--
Once your application is running, you might want to make it available on the internet as
a [Service](/docs/concepts/services-networking/service/) or, for web application only,
using an [Ingress](/docs/concepts/services-networking/ingress).
-->
一旦你的应用处于运行状态，你就可能想要以
[Service](/zh-cn/docs/concepts/services-networking/service/)
的形式使之可在互联网上访问；或者对于 Web 应用而言，使用
[Ingress](/zh-cn/docs/concepts/services-networking/ingress) 资源将其暴露到互联网上。
