---
title: 自動擴縮工作負載
description: >-
  通過自動擴縮，你可以用某種方式自動更新你的工作負載。在面對資源需求變化的時候可以使你的叢集更靈活、更高效。
content_type: concept
weight: 40
---
<!--
title: Autoscaling Workloads
description: >-
  With autoscaling, you can automatically update your workloads in one way or another. This allows your cluster to react to changes in resource demand more elastically and efficiently.
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
In Kubernetes, you can _scale_ a workload depending on the current demand of resources.
This allows your cluster to react to changes in resource demand more elastically and efficiently.

When you scale a workload, you can either increase or decrease the number of replicas managed by
the workload, or adjust the resources available to the replicas in-place.

The first approach is referred to as _horizontal scaling_, while the second is referred to as
_vertical scaling_.

There are manual and automatic ways to scale your workloads, depending on your use case.
-->
在 Kubernetes 中，你可以根據當前的資源需求**擴縮**工作負載。
這讓你的叢集可以更靈活、更高效地面對資源需求的變化。

當你擴縮工作負載時，你可以增加或減少工作負載所管理的副本數量，或者就地調整副本的可用資源。

第一種手段稱爲**水平擴縮**，第二種稱爲**垂直擴縮**。

擴縮工作負載有手動和自動兩種方式，這取決於你的使用情況。

<!-- body -->

<!--
## Scaling workloads manually
-->
## 手動擴縮工作負載   {#scaling-workloads-manually}

<!--
Kubernetes supports _manual scaling_ of workloads. Horizontal scaling can be done
using the `kubectl` CLI.
For vertical scaling, you need to _patch_ the resource definition of your workload.

See below for examples of both strategies.
-->
Kubernetes 支持工作負載的手動擴縮。水平擴縮可以使用 `kubectl` 命令列工具完成。
對於垂直擴縮，你需要**更新**工作負載的資源定義。

這兩種策略的示例見下文。

<!--
- **Horizontal scaling**: [Running multiple instances of your app](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **Vertical scaling**: [Resizing CPU and memory resources assigned to containers](/docs/tasks/configure-pod-container/resize-container-resources)
-->
- **水平擴縮**：[運行應用程式的多個實例](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **垂直擴縮**：[調整分配給容器的 CPU 和內存資源](/docs/tasks/configure-pod-container/resize-container-resources)

<!--
## Scaling workloads automatically
-->
## 自動擴縮工作負載   {#scaling-workloads-automatically}

<!--
Kubernetes also supports _automatic scaling_ of workloads, which is the focus of this page.
-->
Kubernetes 也支持工作負載的**自動擴縮**，這也是本頁的重點。

<!--
The concept of _Autoscaling_ in Kubernetes refers to the ability to automatically update an
object that manages a set of Pods (for example a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}).
-->
在 Kubernetes 中**自動擴縮**的概念是指自動更新管理一組 Pod 的能力（例如
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）。

<!--
### Scaling workloads horizontally
-->
### 水平擴縮工作負載   {#scaling-workloads-horizontally}

<!--
In Kubernetes, you can automatically scale a workload horizontally using a _HorizontalPodAutoscaler_ (HPA).
-->
在 Kubernetes 中，你可以使用 HorizontalPodAutoscaler (HPA) 實現工作負載的自動水平擴縮。

<!--
It is implemented as a Kubernetes API resource and a {{< glossary_tooltip text="controller" term_id="controller" >}}
and periodically adjusts the number of {{< glossary_tooltip text="replicas" term_id="replica" >}}
in a workload to match observed resource utilization such as CPU or memory usage.
-->
它以 Kubernetes API 資源和{{< glossary_tooltip text="控制器" term_id="controller" >}}的方式實現，
並定期調整工作負載中{{< glossary_tooltip text="副本" term_id="replica" >}}的數量
以滿足設置的資源利用率，如 CPU 或內存利用率。

<!--
There is a [walkthrough tutorial](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough) of configuring a HorizontalPodAutoscaler for a Deployment.
-->
這是一個爲 Deployment 部署設定 HorizontalPodAutoscaler 的[示例教程](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough)。

<!--
### Scaling workloads vertically
-->
### 垂直擴縮工作負載   {#scaling-workloads-vertically}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
You can automatically scale a workload vertically using a _VerticalPodAutoscaler_ (VPA).
Unlike the HPA, the VPA doesn't come with Kubernetes by default, but is a separate project
that can be found [on GitHub](https://github.com/kubernetes/autoscaler/tree/9f87b78df0f1d6e142234bb32e8acbd71295585a/vertical-pod-autoscaler).
-->
你可以使用 VerticalPodAutoscaler (VPA) 實現工作負載的垂直擴縮。
不同於 HPA，VPA 並非預設來源於 Kubernetes，而是一個獨立的項目，
參見 [on GitHub](https://github.com/kubernetes/autoscaler/tree/9f87b78df0f1d6e142234bb32e8acbd71295585a/vertical-pod-autoscaler)。

<!--
Once installed, it allows you to create {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}
(CRDs) for your workloads which define _how_ and _when_ to scale the resources of the managed replicas.
-->
安裝後，你可以爲工作負載創建 {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}(CRDs)，
定義**如何**以及**何時**擴縮被管理副本的資源。

{{< note >}}
<!--
You will need to have the [Metrics Server](https://github.com/kubernetes-sigs/metrics-server)
installed to your cluster for the VPA to work.
-->
你需要在叢集中安裝 [Metrics Server](https://github.com/kubernetes-sigs/metrics-server)，這樣，你的 VPA 才能正常工作。
{{< /note >}}

<!--
At the moment, the VPA can operate in four different modes:
-->
目前，VPA 可以有四種不同的運行模式：

<!--
{{< table caption="Different modes of the VPA" >}}
Mode | Description
:----|:-----------
`Auto` | Currently `Recreate`. This might change to in-place updates in the future.
`Recreate` | The VPA assigns resource requests on pod creation as well as updates them on existing pods by evicting them when the requested resources differ significantly from the new recommendation
`Initial` | The VPA only assigns resource requests on pod creation and never changes them later.
`Off` | The VPA does not automatically change the resource requirements of the pods. The recommendations are calculated and can be inspected in the VPA object.
{{< /table >}}
-->
{{< table caption="VPA 的不同模式" >}}
模式 | 描述
:----|:-----------
`Auto` | 目前是 `Recreate`，未來可能會變更爲就地更新（in-place updates）
`Recreate` | VPA 會在創建 Pod 時分配資源請求，並且當請求的資源與新的建議值區別很大時通過驅逐 Pod 的方式來更新現存的 Pod
`Initial` | VPA 只有在創建時分配資源請求，之後不做更改
`Off` | VPA 不會自動更改 Pod 的資源需求，建議值仍會計算並可在 VPA 對象中查看
{{< /table >}}

<!--
#### In-place pod vertical scaling
-->
#### 就地 Pod 垂直擴縮容   {#in-place-pod-vertical-scaling}

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

<!--
As of Kubernetes {{< skew currentVersion >}}, VPA does not support resizing pods in-place,
but this integration is being worked on.
For manually resizing pods in-place, see [Resize Container Resources In-Place](/docs/tasks/configure-pod-container/resize-container-resources/).
-->
截至 Kubernetes {{< skew currentVersion >}}，VPA（垂直 Pod 自動伸縮）尚不支持就地調整 Pod 大小，但該集成正在開發中。
如需手動進行就地擴縮容，請參閱 [就地調整容器資源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。

<!--
### Autoscaling based on cluster size
-->
### 根據叢集規模自動擴縮   {#autoscaling-based-on-cluster-size}

<!--
For workloads that need to be scaled based on the size of the cluster (for example
`cluster-dns` or other system components), you can use the
[_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).
Just like the VPA, it is not part of the Kubernetes core, but hosted as its
own project on GitHub.
-->
對於需要根據叢集規模實現擴縮的工作負載（例如：`cluster-dns` 或者其他系統組件），
你可以使用 [Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)。
與 VPA 一樣，這個項目不是 Kubernetes 核心項目的一部分，它在 GitHub 上有自己的項目。 

<!--
The Cluster Proportional Autoscaler watches the number of schedulable {{< glossary_tooltip text="nodes" term_id="node" >}}
and cores and scales the number of replicas of the target workload accordingly.
-->
叢集彈性伸縮器 (Cluster Proportional Autoscaler)會觀測可調度 {{< glossary_tooltip text="節點" term_id="node" >}}和處理器核數量，
並調整目標工作負載的副本數量。

<!--
If the number of replicas should stay the same, you can scale your workloads vertically according to the cluster size using
the [_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler).
The project is **currently in beta** and can be found on GitHub.
-->
如果副本的數量需要保持一致，
你可以使用 [Cluster Proportional Vertical Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler)
來根據叢集規模進行垂直擴縮。
這個項目目前處於 **beta** 階段，你可以在 GitHub 上找到它。

<!--
While the Cluster Proportional Autoscaler scales the number of replicas of a workload,
the Cluster Proportional Vertical Autoscaler adjusts the resource requests for a workload
(for example a Deployment or DaemonSet) based on the number of nodes and/or cores in the cluster.
-->
叢集彈性伸縮器 (Cluster Proportional Autoscaler) 通過調整工作負載副本數量實現擴縮容，
而垂直叢集彈性伸縮器 (Cluster Proportional Vertical Autoscaler) 則根據叢集中的節點數和 / 或 CPU 核心數，
調整工作負載（例如 Deployment 或 DaemonSet）的資源請求值。

<!--
### Event driven Autoscaling
-->
### 事件驅動型自動擴縮   {#event-driven-autoscaling}

<!--
It is also possible to scale workloads based on events, for example using the
[_Kubernetes Event Driven Autoscaler_ (**KEDA**)](https://keda.sh/).
-->
通過事件驅動實現工作負載的擴縮也是可行的，
例如使用 [Kubernetes Event Driven Autoscaler (**KEDA**)](https://keda.sh/)。

<!--
KEDA is a CNCF-graduated project enabling you to scale your workloads based on the number
of events to be processed, for example the amount of messages in a queue. There exists
a wide range of adapters for different event sources to choose from.
-->
KEDA 是 CNCF 的畢業項目，能讓你根據要處理事件的數量對工作負載進行擴縮，例如隊列中消息的數量。
有多種針對不同事件源的適配可供選擇。

<!--
### Autoscaling based on schedules
-->
### 根據計劃自動擴縮   {#autoscaling-based-on-schedules}

<!--
Another strategy for scaling your workloads is to **schedule** the scaling operations, for example in order to
reduce resource consumption during off-peak hours.
-->
擴縮工作負載的另一種策略是**計劃**進行擴縮，例如在非高峯時段減少資源消耗。

<!--
Similar to event driven autoscaling, such behavior can be achieved using KEDA in conjunction with
its [`Cron` scaler](https://keda.sh/docs/latest/scalers/cron/).
The `Cron` scaler allows you to define schedules (and time zones) for scaling your workloads in or out.
-->
與事件驅動自動擴縮容類似，
這種行爲可以使用 KEDA 和 [`Cron` scaler](https://keda.sh/docs/latest/scalers/cron/) 實現。
`Cron` 擴縮器允許你根據預設的時間表（以及時區）對工作負載進行擴容或縮容。

<!--
## Scaling cluster infrastructure
-->
## 擴縮叢集基礎設施   {#scaling-cluster-infrastructure}

<!--
If scaling workloads isn't enough to meet your needs, you can also scale your cluster infrastructure itself.
-->
如果擴縮工作負載無法滿足你的需求，你也可以擴縮叢集基礎設施本身。

<!--
Scaling the cluster infrastructure normally means adding or removing {{< glossary_tooltip text="nodes" term_id="node" >}}.
-->
擴縮叢集基礎設施通常是指增加或移除{{< glossary_tooltip text="節點" term_id="node" >}}。

<!--
Read [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)
for more information.
-->
閱讀[節點自動擴縮](/zh-cn/docs/concepts/cluster-administration/node-autoscaling/)瞭解更多資訊。

## {{% heading "whatsnext" %}}

<!--
- Learn more about scaling horizontally
  - [Scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/)
  - [HorizontalPodAutoscaler Walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [Resize Container Resources In-Place](/docs/tasks/configure-pod-container/resize-container-resources/)
- [Autoscale the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- Learn about [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)
-->
- 瞭解有關橫向擴縮的更多資訊
  - [擴縮 StatefulSet](/zh-cn/docs/tasks/run-application/scale-stateful-set/)
  - [HorizontalPodAutoscaler 演練](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [調整分配給容器的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
- [自動擴縮叢集 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- 瞭解[節點自動擴縮]((/zh-cn/docs/concepts/cluster-administration/node-autoscaling/))
