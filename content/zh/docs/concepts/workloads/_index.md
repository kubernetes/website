---
title: "工作负载"
weight: 50
description: 理解 Pods，Kubernetes 中可部署的最小计算对象，以及辅助它运行它们的高层抽象对象。
---

<!--
title: "Workloads"
weight: 50
description: >
  Understand Pods, the smallest deployable compute object in Kubernetes, and the higher-level abstractions that help you to run them.
no_list: true
-->

{{< glossary_definition term_id="workload" length="short" >}}

<!--
Whether your workload is a single component or several that work together, on Kubernetes you run
it inside a set of [Pods](/docs/concepts/workloads/pods).
In Kubernetes, a Pod represents a set of running
{{< glossary_tooltip text="containers" term_id="container" >}} on your cluster.

A Pod has a defined lifecycle. For example, once a Pod is running in your cluster then
a critical failure on the {{< glossary_tooltip text="node" term_id="node" >}} where that
Pod is running means that all the Pods on that node fail. Kubernetes treats that level
of failure as final: you would need to create a new Pod even if the node later recovers.
-->
无论你的负载是单一组件还是由多个一同工作的组件构成，在 Kubernetes 中你
可以在一组 [Pods](/zh/docs/concepts/workloads/pods) 中运行它。
在 Kubernetes 中，Pod 代表的是集群上处于运行状态的一组
{{< glossary_tooltip text="容器" term_id="container" >}}。

<!--
Kubernetes pods have a [defined lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
For example, once a pod is running in your cluster then a critical fault on the
{{< glossary_tooltip text="node" term_id="node" >}} where that pod is running means that
all the pods on that node fail. Kubernetes treats that level of failure as final: you
would need to create a new `Pod` to recover, even if the node later becomes healthy.
-->
Kubernetes Pods 有[确定的生命周期](/zh/docs/concepts/workloads/pods/pod-lifecycle/)。
例如，当某 Pod 在你的集群中运行时，Pod 运行所在的
{{< glossary_tooltip text="节点" term_id="node" >}} 出现致命错误时，
所有该节点上的 Pods 都会失败。Kubernetes 将这类失败视为最终状态：
即使该节点后来恢复正常运行，你也需要创建新的 Pod 来恢复应用。

<!--
However, to make life considerably easier, you don't need to manage each Pod directly.
Instead, you can use _workload resources_ that manage a set of Pods on your behalf.
These resources configure {{< glossary_tooltip term_id="controller" text="controllers" >}}
that make sure the right number of the right kind of Pod are running, to match the state
you specified.

Kubernetes provides several built-in workload resources:
-->
不过，为了让用户的日子略微好过一些，你并不需要直接管理每个 Pod。
相反，你可以使用 _负载资源_ 来替你管理一组 Pods。
这些资源配置 {{< glossary_tooltip term_id="controller" text="控制器" >}}
来确保合适类型的、处于运行状态的 Pod 个数是正确的，与你所指定的状态相一致。

Kubernetes 提供若干种内置的工作负载资源：

<!--
* [Deployment](/docs/concepts/workloads/controllers/deployment/) and [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
  (replacing the legacy resource
  {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}).
  `Deployment` is a good fit for managing a stateless application workload on your cluster,
  where any `Pod` in the `Deployment` is interchangeable and can be replaced if needed.
* [`StatefulSet`](/docs/concepts/workloads/controllers/statefulset/) lets you
  run one or more related Pods that do track state somehow. For example, if your workload
  records data persistently, you can run a `StatefulSet` that matches each `Pod` with a
  [`PersistentVolume`](/docs/concepts/storage/persistent-volumes/). Your code, running in the
  `Pods` for that `StatefulSet`, can replicate data to other `Pods` in the same `StatefulSet`
  to improve overall resilience.
-->
* [Deployment](/zh/docs/concepts/workloads/controllers/deployment/) 和
  [ReplicaSet](/zh/docs/concepts/workloads/controllers/replicaset/)
  （替换原来的资源 {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}）。
  `Deployment` 很适合用来管理你的集群上的无状态应用，`Deployment` 中的所有
  `Pod` 都是相互等价的，并且在需要的时候被换掉。
* [StatefulSet](/zh/docs/concepts/workloads/controllers/statefulset/)
  让你能够运行一个或者多个以某种方式跟踪应用状态的 Pods。
  例如，如果你的负载会将数据作持久存储，你可以运行一个 `StatefulSet`，将每个
  `Pod` 与某个 [`PersistentVolume`](/zh/docs/concepts/storage/persistent-volumes/)
  对应起来。你在 `StatefulSet` 中各个 `Pod` 内运行的代码可以将数据复制到同一
  `StatefulSet` 中的其它 `Pod` 中以提高整体的服务可靠性。
<!--
* [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) defines `Pods` that provide
  node-local facilities. These might be fundamental to the operation of your cluster, such
  as a networking helper tool, or be part of an
  {{< glossary_tooltip text="add-on" term_id="addons" >}}.
  Every time you add a node to your cluster that matches the specification in a `DaemonSet`,
  the control plane schedules a `Pod` for that `DaemonSet` onto the new node.
* [`Job`](/docs/concepts/workloads/controllers/job/) and
  [`CronJob`](/docs/concepts/workloads/controllers/cron-jobs/)
  define tasks that run to completion and then stop. Jobs represent one-off tasks, whereas
  `CronJobs` recur according to a schedule.
-->
* [DaemonSet](/zh/docs/concepts/workloads/controllers/daemonset/)
  定义提供节点本地支撑设施的 `Pods`。这些 Pods 可能对于你的集群的运维是
  非常重要的，例如作为网络链接的辅助工具或者作为网络
  {{< glossary_tooltip text="插件" term_id="addons" >}}
  的一部分等等。每次你向集群中添加一个新节点时，如果该节点与某 `DaemonSet`
  的规约匹配，则控制面会为该 `DaemonSet` 调度一个 `Pod` 到该新节点上运行。
* [Job](/zh/docs/concepts/workloads/controllers/job/) 和
  [CronJob](/zh/docs/concepts/workloads/controllers/cron-jobs/)。
  定义一些一直运行到结束并停止的任务。`Job` 用来表达的是一次性的任务，而
  `CronJob` 会根据其时间规划反复运行。

<!--
In the wider Kubernetes ecosystem, you can find third-party workload resources that provide
additional behaviors. Using a
[custom resource definition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/),
you can add in a third-party workload resource if you want a specific behavior that's not part
of Kubernetes' core. For example, if you wanted to run a group of `Pods` for your application but
stop work unless _all_ the Pods are available (perhaps for some high-throughput distributed task),
then you can implement or install an extension that does provide that feature.
-->
在庞大的 Kubernetes 生态系统中，你还可以找到一些提供额外操作的第三方
工作负载资源。通过使用
[定制资源定义（CRD）](/zh/docs/concepts/extend-kubernetes/api-extension/custom-resources/)，
你可以添加第三方工作负载资源，以完成原本不是 Kubernetes 核心功能的工作。
例如，如果你希望运行一组 `Pods`，但要求所有 Pods 都可用时才执行操作
（比如针对某种高吞吐量的分布式任务），你可以实现一个能够满足这一需求
的扩展，并将其安装到集群中运行。

## {{% heading "whatsnext" %}}

<!--
As well as reading about each resource, you can learn about specific tasks that relate to them:

* [Run a stateless application using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)
* Run a stateful application either as a [single instance](/docs/tasks/run-application/run-single-instance-stateful-application/)
  or as a [replicated set](/docs/tasks/run-application/run-replicated-stateful-application/)
* [Run Automated Tasks with a `CronJob`](/docs/tasks/job/automated-tasks-with-cron-jobs/)
-->
除了阅读了解每类资源外，你还可以了解与这些资源相关的任务：

* [使用 Deployment 运行一个无状态的应用](/zh/docs/tasks/run-application/run-stateless-application-deployment/)
* 以[单实例](/zh/docs/tasks/run-application/run-single-instance-stateful-application/)
  或者[多副本集合](/zh/docs/tasks/run-application/run-replicated-stateful-application/)
  的形式运行有状态的应用；
* [使用 `CronJob` 运行自动化的任务](/zh/docs/tasks/job/automated-tasks-with-cron-jobs/)

<!--
To learn about Kubernetes' mechanisms for separating code from configuration,
visit [Configuration](/docs/concepts/configuration/).
-->
要了解 Kubernetes 将代码与配置分离的实现机制，可参阅
[配置部分](/zh/docs/concepts/configuration/)。

<!--
There are two supporting concepts that provide backgrounds about how Kubernetes manages pods
for applications:
* [Garbage collection](/docs/concepts/workloads/controllers/garbage-collection/) tidies up objects
  from your cluster after their _owning resource_ has been removed.
* The [_time-to-live after finished_ controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  removes Jobs once a defined time has passed since they completed.
-->
关于 Kubernetes 如何为应用管理 Pods，还有两个支撑概念能够提供相关背景信息：

* [垃圾收集](/zh/docs/concepts/workloads/controllers/garbage-collection/)机制负责在
  对象的 _属主资源_ 被删除时在集群中清理这些对象。
* [_Time-to-Live_ 控制器](/zh/docs/concepts/workloads/controllers/ttlafterfinished/)
  会在 Job 结束之后的指定时间间隔之后删除它们。

<!--
Once your application is running, you might want to make it available on the internet as
a [`Service`](/docs/concepts/services-networking/service/) or, for web application only,
using an [`Ingress`](/docs/concepts/services-networking/ingress).
-->
一旦你的应用处于运行状态，你就可能想要以
[`Service`](/zh/docs/concepts/services-networking/service/)
的形式使之可在互联网上访问；或者对于 Web 应用而言，使用
[`Ingress`](/zh/docs/concepts/services-networking/ingress) 资源将其暴露到互联网上。
