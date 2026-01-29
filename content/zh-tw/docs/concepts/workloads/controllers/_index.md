---
title: "工作負載管理"
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
Kubernetes 提供了幾個內置的 API
來聲明式管理{{< glossary_tooltip text="工作負載" term_id="workload" >}}及其組件。

<!--
Ultimately, your applications run as containers inside
{{< glossary_tooltip term_id="Pod" text="Pods" >}}; however, managing individual
Pods would be a lot of effort. For example, if a Pod fails, you probably want to
run a new Pod to replace it. Kubernetes can do that for you.
-->
最終，你的應用以容器的形式在 {{< glossary_tooltip term_id="Pod" text="Pods" >}} 中運行；
但是，直接管理單個 Pod 的工作量將會非常繁瑣。例如，如果一個 Pod 失敗了，你可能希望運行一個新的
Pod 來替換它。Kubernetes 可以爲你完成這些操作。

<!--
You use the Kubernetes API to create workload
{{< glossary_tooltip text="object" term_id="object" >}} that represent a higher level
abstraction than a Pod, and then the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} automatically manages
Pod objects on your behalf, based on the specification for the workload object you defined.
-->
你可以使用 Kubernetes API 創建工作負載{{< glossary_tooltip text="對象" term_id="object" >}}，
這些對象所表達的是比 Pod 更高級別的抽象概念，Kubernetes
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}根據你定義的工作負載對象規約自動管理 Pod 對象。

<!--
The built-in APIs for managing workloads are:
-->
用於管理工作負載的內置 API 包括：

<!--
[Deployment](/docs/concepts/workloads/controllers/deployment/) (and, indirectly, [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)),
the most common way to run an application on your cluster.
Deployment is a good fit for managing a stateless application workload on your cluster, where
any Pod in the Deployment is interchangeable and can be replaced if needed.
(Deployments are a replacement for the legacy
{{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}} API).
-->
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)
（也間接包括 [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)）
是在叢集上運行應用的最常見方式。Deployment 適合在叢集上管理無狀態應用工作負載，
其中 Deployment 中的任何 Pod 都是可互換的，可以在需要時進行替換。
（Deployment 替代原來的 {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}} API）。

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
允許你管理一個或多個運行相同應用代碼、但具有不同身份標識的 Pod。
StatefulSet 與 Deployment 不同。Deployment 中的 Pod 預期是可互換的。
StatefulSet 最常見的用途是能夠建立其 Pod 與其持久化儲存之間的關聯。
例如，你可以運行一個將每個 Pod 關聯到 [PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)
的 StatefulSet。如果該 StatefulSet 中的一個 Pod 失敗了，Kubernetes 將創建一個新的 Pod，
並連接到相同的 PersistentVolume。

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
定義了在特定{{< glossary_tooltip text="節點" term_id="node" >}}上提供本地設施的 Pod，
例如允許該節點上的容器訪問儲存系統的驅動。當必須在合適的節點上運行某種驅動或其他節點級別的服務時，
你可以使用 DaemonSet。DaemonSet 中的每個 Pod 執行類似於經典 Unix / POSIX
伺服器上的系統守護進程的角色。DaemonSet 可能對叢集的操作至關重要，
例如作爲插件讓該節點訪問[叢集網路](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)，
也可能幫助你管理節點，或者提供增強正在運行的容器平臺所需的、不太重要的設施。
你可以在叢集的每個節點上運行 DaemonSets（及其 Pod），或者僅在某個子集上運行
（例如，只在安裝了 GPU 的節點上安裝 GPU 加速驅動）。

<!--
You can use a [Job](/docs/concepts/workloads/controllers/job/) and / or
a [CronJob](/docs/concepts/workloads/controllers/cron-jobs/) to
define tasks that run to completion and then stop. A Job represents a one-off task,
whereas each CronJob repeats according to a schedule.
-->
你可以使用 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 和/或
[CronJob](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/) 定義一次性任務和定時任務。
Job 表示一次性任務，而每個 CronJob 可以根據排期表重複執行。

<!--
Other topics in this section:
-->
本節中的其他主題：
<!-- relies on simple_list: true in the front matter -->
