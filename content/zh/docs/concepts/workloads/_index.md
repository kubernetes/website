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
In Kubernetes, a Pod represents a set of running {{< glossary_tooltip text="containers" term_id="container" >}}
on your cluster.

A Pod has a defined lifecycle. For example, once a Pod is running in your cluster then
a critical failure on the {{< glossary_tooltip text="node" term_id="node" >}} where that
Pod is running means that all the Pods on that node fail. Kubernetes treats that level
of failure as final: you would need to create a new Pod even if the node later recovers.
-->
无论你的负载是单一组件还是由多个一同工作的组件构成，在 Kubernetes 中你
可以在一组 [Pods](/zh/docs/concepts/workloads/pods) 中运行它。
在 Kubernetes 中，Pod 代表的是集群上处于运行状态的一组
{{< glossary_tooltip text="容器" term_id="container" >}}。

Pod 有确定的生命周期。例如，一旦某 Pod 在你的集群中运行，Pod 运行所在的
{{< glossary_tooltip text="节点" term_id="node" >}} 出现致命错误时，
所有该节点上的 Pods 都会失败。Kubernetes 将这类失败视为最终状态：
即使节点后来恢复正常运行，你也需要创建新的 Pod。

<!--
However, to make life considerably easier, you don't need to manage each Pod directly.
Instead, you can use _workload resources_ that manage a set of Pods on your behalf.
These resources configure {{< glossary_tooltip term_id="controller" text="controllers" >}}
that make sure the right number of the right kind of Pod are running, to match the state
you specified.

Those workload resources include:
-->
不过，为了让用户的日子略微好过一些，你并不需要直接管理每个 Pod。
相反，你可以使用 _负载资源_ 来替你管理一组 Pods。
这些资源配置 {{< glossary_tooltip term_id="controller" text="控制器" >}}
来确保合适类型的、处于运行状态的 Pod 个数是正确的，与你所指定的状态相一致。

这些工作负载资源包括：

<!--
* [Deployment](/docs/concepts/workloads/controllers/deployment/) and [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
  (replacing the legacy resource {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}});
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/);
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) for running Pods that provide
  node-local facilities, such as a storage driver or network plugin;
* [Job](/docs/concepts/workloads/controllers/job/) and
  [CronJob](/docs/concepts/workloads/controllers/cron-jobs/)
  for tasks that run to completion.
-->
* [Deployment](/zh/docs/concepts/workloads/controllers/deployment/) 和
  [ReplicaSet](/zh/docs/concepts/workloads/controllers/replicaset/)
  （替换原来的资源 {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}）；
* [StatefulSet](/zh/docs/concepts/workloads/controllers/statefulset/);
* 用来运行提供节点本地支撑设施（如存储驱动或网络插件）的 Pods 的
  [DaemonSet](/zh/docs/concepts/workloads/controllers/daemonset/)；
* 用来执行运行到结束为止的
  [Job](/zh/docs/concepts/workloads/controllers/job/) 和
  [CronJob](/zh/docs/concepts/workloads/controllers/cron-jobs/)。

<!--
There are also two supporting concepts that you might find relevant:
* [Garbage collection](/docs/concepts/workloads/controllers/garbage-collection/) tidies up objects
  from your cluster after their _owning resource_ has been removed.
* The [_time-to-live after finished_ controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  removes Jobs once a defined time has passed since they completed.
-->
你可能发现还有两种支撑概念很有用：

* [垃圾收集](/zh/docs/concepts/workloads/controllers/garbage-collection/)机制负责在
  对象的 _属主资源_ 被删除时在集群中清理这些对象。
* [_结束后存在时间_ 控制器](/zh/docs/concepts/workloads/controllers/ttlafterfinished/)
  会在 Job 结束之后的指定时间间隔之后删除它们。

## {{% heading "whatsnext" %}}

<!--
As well as reading about each resource, you can learn about specific tasks that relate to them:

* [Run a stateless application using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)
* Run a stateful application either as a [single instance](/docs/tasks/run-application/run-single-instance-stateful-application/)
  or as a [replicated set](/docs/tasks/run-application/run-replicated-stateful-application/)
* [Run Automated Tasks with a CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)
-->
除了阅读了解每类资源外，你还可以了解与这些资源相关的任务：

* [使用 Deployment 运行一个无状态的应用](/zh/docs/tasks/run-application/run-stateless-application-deployment/)
* 以[单实例](/zh/docs/tasks/run-application/run-single-instance-stateful-application/)
  或者[多副本集合](/zh/docs/tasks/run-application/run-replicated-stateful-application/)
  的形式运行有状态的应用；
* [使用 CronJob 运行自动化的任务](/zh/docs/tasks/job/automated-tasks-with-cron-jobs/)

<!--
Once your application is running, you might want to make it available on the internet as
a [Service](/docs/concepts/services-networking/service/) or, for web application only,
using an [Ingress](/docs/concepts/services-networking/ingress).

You can also visit [Configuration](/docs/concepts/configuration/) to learn about Kubernetes'
mechanisms for separating code from configuration.
-->
一旦你的应用处于运行状态，你就可能想要
以[服务](/zh/docs/concepts/services-networking/service/)
使之在互联网上可访问；或者对于 Web 应用而言，使用
[Ingress](/docs/concepts/services-networking/ingress) 资源将其暴露到互联网上。

