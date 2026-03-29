---
title: 大型叢集的考量事項
weight: 10
---
<!--
---
reviewers:
- davidopp
- lavalamp
title: Considerations for large clusters
weight: 10
---
-->

<!--
A cluster is a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (physical
or virtual machines) running Kubernetes agents, managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
Kubernetes {{< param "version" >}} supports clusters with up to 5,000 nodes. More specifically,
Kubernetes is designed to accommodate configurations that meet *all* of the following criteria:
-->
叢集是由一組執行 Kubernetes 代理程式的{{< glossary_tooltip text="節點" term_id="node" >}}
（實體機器或虛擬機器）所組成，並由{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}進行管理。
Kubernetes {{< param "version" >}} 支援最多 5,000 個節點的叢集。
更具體來說，Kubernetes 的設計可支援符合以下所有準則的配置：

<!--
* No more than 110 pods per node
* No more than 5,000 nodes
* No more than 150,000 total pods
* No more than 300,000 total containers
-->
* 每個節點不超過 110 個 Pod
* 不超過 5,000 個節點
* Pod 總數不超過 150,000
* 容器總數不超過 300,000

<!--
You can scale your cluster by adding or removing nodes. The way you do this depends
on how your cluster is deployed.
-->
您可以透過新增或移除節點來調整叢集規模。具體作法取決於叢集的部署方式。

<!--
## Cloud provider resource quotas {#quota-issues}
-->
## 雲端供應商資源配額 {#quota-issues}

<!--
To avoid running into cloud provider quota issues, when creating a cluster with many nodes,
consider:
* Requesting a quota increase for cloud resources such as:
    * Computer instances
    * CPUs
    * Storage volumes
    * In-use IP addresses
    * Packet filtering rule sets
    * Number of load balancers
    * Network subnets
    * Log streams
* Gating the cluster scaling actions to bring up new nodes in batches, with a pause
  between batches, because some cloud providers rate limit the creation of new instances.
-->
為了避免碰到雲端供應商的配額問題，在建立多個節點的叢集時，建議考量：
* 申請提高雲端資源的配額，例如：
  * 運算執行個體
  * CPU
  * 儲存卷
  * 使用中的 IP 位址
  * 封包過濾規則
  * 負載平衡器的數量
  * 子網路
  * 日誌串流
* 控制叢集的擴展流程，分批啟動新節點，並在各批之間加入間隔，
  因為部分雲端供應商會限制新執行個體的建立速率。

<!--
## Control plane components
-->
## 控制平面組件 {#control-plane-components}

<!--
For a large cluster, you need a control plane with sufficient compute and other
resources.

Typically you would run one or two control plane instances per failure zone,
scaling those instances vertically first and then scaling horizontally after reaching
the point of falling returns to (vertical) scale.
-->
對於大型叢集，您需要一個具備足夠運算及其他資源的控制平面。

通常您會在每個故障區執行一到兩個控制平面執行個體，並優先對這些執行個體進行垂直擴展；
直到垂直擴展達到邊際效益遞減的臨界點後，再進行水平擴展。

<!--
You should run at least one instance per failure zone to provide fault-tolerance. Kubernetes
nodes do not automatically steer traffic towards control-plane endpoints that are in the
same failure zone; however, your cloud provider might have its own mechanisms to do this.

For example, using a managed load balancer, you configure the load balancer to send traffic
that originates from the kubelet and Pods in failure zone _A_, and direct that traffic only
to the control plane hosts that are also in zone _A_. If a single control-plane host or
endpoint failure zone _A_ goes offline, that means that all the control-plane traffic for
nodes in zone _A_ is now being sent between zones. Running multiple control plane hosts in
each zone makes that outcome less likely.
-->
您應該在每個故障區執行至少一個執行個體來提供容錯能力。
Kubernetes 節點不會自動將流量導向位於相同故障區的控制平面端點；然而，
您的雲端供應商可能有其獨有的機制來做到這一點。

例如，使用託管的負載平衡器時，
您可以設定此負載平衡器將源於故障區 **A** 的 kubelet 與 Pod 流量僅導向同樣位於故障區 **A** 的控制平面主機。
如果故障區 **A** 內的單一控制平面主機或端點離線，這意味著 **A** 區節點的所有控制平面流量現在都將改為跨區傳輸。
在每個區域中執行多個控制平面主機可以降低發生這種情況的可能性。

<!--
### etcd storage
-->
### etcd 儲存 {#etcd-storage}

<!--
To improve performance of large clusters, you can store Event objects in a separate
dedicated etcd instance.
-->
為了提升大型叢集的效能，您可以將 Event 物件儲存於一個獨立且專屬的 etcd 執行個體中。

<!--
When creating a cluster, you can (using custom tooling):

* start and configure additional etcd instance
* configure the {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} to use it for storing events
-->
您可以使用自訂工具，在建立叢集時：

* 啟動並設定額外的 etcd 執行個體
* 設定 {{< glossary_tooltip term_id="kube-apiserver" text="API 伺服器" >}}將 Event 儲存在該執行個體中

<!--
See [Operating etcd clusters for Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) and
[Set up a High Availability etcd cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
for details on configuring and managing etcd for a large cluster.
-->
請參閱[針對 Kubernetes 維運 etcd 叢集](/zh-tw/docs/tasks/administer-cluster/configure-upgrade-etcd/)
與[使用 kubeadm 架設高可用性 etcd 叢集](/zh-tw/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)，
以了解為大型叢集設定與管理 etcd 的詳細資訊。

<!--
## Addon resources
-->
## 附加元件資源 {#addon-resources}

<!--
Kubernetes [resource limits](/docs/concepts/configuration/manage-resources-containers/)
help to minimize the impact of memory leaks and other ways that pods and containers can
impact on other components. These resource limits apply to
{{< glossary_tooltip text="addon" term_id="addons" >}} resources just as they apply to application workloads.

For example, you can set CPU and memory limits for a logging component:
-->
Kubernetes [資源限制](/zh-tw/docs/concepts/configuration/manage-resources-containers/)有助於將記憶體洩漏，
以及 Pod 與容器對其他組件的影響降至最低。
這些資源限制同樣適用於{{< glossary_tooltip text="附加元件" term_id="addons" >}}的資源，
也適用於應用程式工作負載。

例如，您可以為日誌組件設定 CPU 與記憶體限制：

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

<!--
Addons' default limits are typically based on data collected from experience running
each addon on small or medium Kubernetes clusters. When running on large
clusters, addons often consume more of some resources than their default limits.
If a large cluster is deployed without adjusting these values, the addon(s)
may continuously get killed because they keep hitting the memory limit.
Alternatively, the addon may run but with poor performance due to CPU time
slice restrictions.
-->
附加元件的預設限制，通常是基於在小型或中型 Kubernetes 叢集上執行各個附加元件的經驗所蒐集的資料。
當在大型叢集上執行時，某些資源的使用量可能會超過預設限制。若在部署大型叢集時未調整這些數值，
附加元件可能會因為不斷觸及記憶體限制而反覆被終止；或者，附加元件雖能維持執行，
但會受 CPU 時間切片限制影響而效能低落。

<!--
To avoid running into cluster addon resource issues, when creating a cluster with
many nodes, consider the following:
-->
為了避免遇到叢集附加元件的資源問題，在建立包含多個節點的叢集時，建議考量以下事項：

<!--
* Some addons scale vertically - there is one replica of the addon for the cluster
  or serving a whole failure zone. For these addons, increase requests and limits
  as you scale out your cluster.
* Many addons scale horizontally - you add capacity by running more pods - but with
  a very large cluster you may also need to raise CPU or memory limits slightly.
  The [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) can run in _recommender_ mode to provide suggested
  figures for requests and limits.
* Some addons run as one copy per node, controlled by a {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}: for example, a node-level log aggregator. Similar to
  the case with horizontally-scaled addons, you may also need to raise CPU or memory
  limits slightly.
-->
* 部分附加元件採垂直擴展 — 整個叢集或每個故障區僅執行一個附加元件副本。
  對於此類附加元件，當您擴展叢集規模時，請增加其資源請求與限制。
* 許多附加元件採水平擴展 — 透過增加 Pod 數量來提升容量；但在超大型叢集中，您可能仍需稍微提高 CPU 或記憶體限制。
  [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
  可以以**recommender 模式**執行，以提供資源請求與限制的建議值。
* 部分附加元件以每個節點一個副本的方式執行，並由 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} 進行控制：
  例如節點級別的日誌聚合器。與水平擴展的附加元件類似，您可能也需要稍微調高 CPU 或記憶體限制。

<!--
## Prioritizing cluster-essential components
-->
## 優先處理叢集關鍵組件 {#prioritizing-cluster-essential-components}

<!--
To ensure cluster-essential components (such as CoreDNS, metrics-server, and other critical add-ons) are scheduled ahead of other workloads and are not preempted by lower-priority pods, run them with a system [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/), such as `system-cluster-critical` or `system-node-critical`.
-->
為了確保叢集的必要組件（例如 CoreDNS、metrics-server 與其他關鍵附加元件）優先於其他工作負載進行排程，且不會被較低優先權的 Pod 搶佔，
請使用系統的 [PriorityClass](/zh-tw/docs/concepts/scheduling-eviction/pod-priority-preemption/) 來設定這些組件的優先順序，
例如 `system-cluster-critical` 或 `system-node-critical`。

## {{% heading "whatsnext" %}}

<!--
* `VerticalPodAutoscaler` is a custom resource that you can deploy into your cluster
to help you manage resource requests and limits for pods.  
Learn more about [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) 
and how you can use it to scale cluster
components, including cluster-critical addons.
-->
* `VerticalPodAutoscaler` 是一個您可以部署到叢集中的自訂資源，用來協助您管理 Pod 的資源請求與限制。
請參閱 [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) 以了解更多資訊，
並學習如何使用它來調整叢集組件的規模，包括叢集關鍵的附加元件。

<!--
* Read about [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)
-->
* 請參閱[節點自動擴展](/zh-tw/docs/concepts/cluster-administration/node-autoscaling/)

<!--
* The [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
helps you in resizing the addons automatically as your cluster's scale changes.
-->
* [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme) 可協助您隨著叢集規模的變化，
自動調整附加元件的資源配置。
---