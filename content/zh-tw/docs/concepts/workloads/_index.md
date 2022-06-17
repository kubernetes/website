---
title: "工作負載"
weight: 50
description: 理解 Pods，Kubernetes 中可部署的最小計算物件，以及輔助它執行它們的高層抽象物件。
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
無論你的負載是單一元件還是由多個一同工作的元件構成，在 Kubernetes 中你
可以在一組 [Pods](/zh-cn/docs/concepts/workloads/pods) 中執行它。
在 Kubernetes 中，Pod 代表的是叢集上處於執行狀態的一組
{{< glossary_tooltip text="容器" term_id="container" >}}。

<!--
Kubernetes pods have a [defined lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
For example, once a pod is running in your cluster then a critical fault on the
{{< glossary_tooltip text="node" term_id="node" >}} where that pod is running means that
all the pods on that node fail. Kubernetes treats that level of failure as final: you
would need to create a new `Pod` to recover, even if the node later becomes healthy.
-->
Kubernetes Pods 有[確定的生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。
例如，當某 Pod 在你的叢集中執行時，Pod 執行所在的
{{< glossary_tooltip text="節點" term_id="node" >}} 出現致命錯誤時，
所有該節點上的 Pods 都會失敗。Kubernetes 將這類失敗視為最終狀態：
即使該節點後來恢復正常執行，你也需要建立新的 Pod 來恢復應用。

<!--
However, to make life considerably easier, you don't need to manage each Pod directly.
Instead, you can use _workload resources_ that manage a set of Pods on your behalf.
These resources configure {{< glossary_tooltip term_id="controller" text="controllers" >}}
that make sure the right number of the right kind of Pod are running, to match the state
you specified.

Kubernetes provides several built-in workload resources:
-->
不過，為了讓使用者的日子略微好過一些，你並不需要直接管理每個 Pod。
相反，你可以使用 _負載資源_ 來替你管理一組 Pods。
這些資源配置 {{< glossary_tooltip term_id="controller" text="控制器" >}}
來確保合適型別的、處於執行狀態的 Pod 個數是正確的，與你所指定的狀態相一致。

Kubernetes 提供若干種內建的工作負載資源：

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
* [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 和
  [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)
  （替換原來的資源 {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}）。
  `Deployment` 很適合用來管理你的叢集上的無狀態應用，`Deployment` 中的所有
  `Pod` 都是相互等價的，並且在需要的時候被換掉。
* [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
  讓你能夠執行一個或者多個以某種方式跟蹤應用狀態的 Pods。
  例如，如果你的負載會將資料作持久儲存，你可以執行一個 `StatefulSet`，將每個
  `Pod` 與某個 [`PersistentVolume`](/zh-cn/docs/concepts/storage/persistent-volumes/)
  對應起來。你在 `StatefulSet` 中各個 `Pod` 內執行的程式碼可以將資料複製到同一
  `StatefulSet` 中的其它 `Pod` 中以提高整體的服務可靠性。
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
* [DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/)
  定義提供節點本地支撐設施的 `Pods`。這些 Pods 可能對於你的叢集的運維是
  非常重要的，例如作為網路連結的輔助工具或者作為網路
  {{< glossary_tooltip text="外掛" term_id="addons" >}}
  的一部分等等。每次你向叢集中新增一個新節點時，如果該節點與某 `DaemonSet`
  的規約匹配，則控制面會為該 `DaemonSet` 排程一個 `Pod` 到該新節點上執行。
* [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 和
  [CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)。
  定義一些一直執行到結束並停止的任務。`Job` 用來表達的是一次性的任務，而
  `CronJob` 會根據其時間規劃反覆執行。

<!--
In the wider Kubernetes ecosystem, you can find third-party workload resources that provide
additional behaviors. Using a
[custom resource definition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/),
you can add in a third-party workload resource if you want a specific behavior that's not part
of Kubernetes' core. For example, if you wanted to run a group of `Pods` for your application but
stop work unless _all_ the Pods are available (perhaps for some high-throughput distributed task),
then you can implement or install an extension that does provide that feature.
-->
在龐大的 Kubernetes 生態系統中，你還可以找到一些提供額外操作的第三方
工作負載資源。透過使用
[定製資源定義（CRD）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)，
你可以新增第三方工作負載資源，以完成原本不是 Kubernetes 核心功能的工作。
例如，如果你希望執行一組 `Pods`，但要求所有 Pods 都可用時才執行操作
（比如針對某種高吞吐量的分散式任務），你可以實現一個能夠滿足這一需求
的擴充套件，並將其安裝到叢集中執行。

## {{% heading "whatsnext" %}}

<!--
As well as reading about each resource, you can learn about specific tasks that relate to them:

* [Run a stateless application using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)
* Run a stateful application either as a [single instance](/docs/tasks/run-application/run-single-instance-stateful-application/)
  or as a [replicated set](/docs/tasks/run-application/run-replicated-stateful-application/)
* [Run Automated Tasks with a `CronJob`](/docs/tasks/job/automated-tasks-with-cron-jobs/)
-->
除了閱讀了解每類資源外，你還可以瞭解與這些資源相關的任務：

* [使用 Deployment 執行一個無狀態的應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)
* 以[單例項](/zh-cn/docs/tasks/run-application/run-single-instance-stateful-application/)
  或者[多副本集合](/zh-cn/docs/tasks/run-application/run-replicated-stateful-application/)
  的形式執行有狀態的應用；
* [使用 `CronJob` 執行自動化的任務](/zh-cn/docs/tasks/job/automated-tasks-with-cron-jobs/)

<!--
To learn about Kubernetes' mechanisms for separating code from configuration,
visit [Configuration](/docs/concepts/configuration/).
-->
要了解 Kubernetes 將程式碼與配置分離的實現機制，可參閱
[配置部分](/zh-cn/docs/concepts/configuration/)。

<!--
There are two supporting concepts that provide backgrounds about how Kubernetes manages pods
for applications:
* [Garbage collection](/docs/concepts/workloads/controllers/garbage-collection/) tidies up objects
  from your cluster after their _owning resource_ has been removed.
* The [_time-to-live after finished_ controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  removes Jobs once a defined time has passed since they completed.
-->
關於 Kubernetes 如何為應用管理 Pods，還有兩個支撐概念能夠提供相關背景資訊：

* [垃圾收集](/zh-cn/docs/concepts/workloads/controllers/garbage-collection/)機制負責在
  物件的 _屬主資源_ 被刪除時在叢集中清理這些物件。
* [_Time-to-Live_ 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)
  會在 Job 結束之後的指定時間間隔之後刪除它們。

<!--
Once your application is running, you might want to make it available on the internet as
a [`Service`](/docs/concepts/services-networking/service/) or, for web application only,
using an [`Ingress`](/docs/concepts/services-networking/ingress).
-->
一旦你的應用處於執行狀態，你就可能想要以
[`Service`](/zh-cn/docs/concepts/services-networking/service/)
的形式使之可在網際網路上訪問；或者對於 Web 應用而言，使用
[`Ingress`](/zh-cn/docs/concepts/services-networking/ingress) 資源將其暴露到網際網路上。
