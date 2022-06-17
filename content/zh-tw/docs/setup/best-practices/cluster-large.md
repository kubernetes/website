---
title: 大規模叢集的注意事項
weight: 20
---

<!-- 
reviewers:
- davidopp
- lavalamp
title: Considerations for large clusters
weight: 20
-->

<!--
A cluster is a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (physical
or virtual machines) running Kubernetes agents, managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
Kubernetes {{< param "version" >}} supports clusters with up to 5000 nodes. More specifically,
Kubernetes is designed to accommodate configurations that meet *all* of the following criteria:
-->
叢集是執行 Kubernetes 代理的、
由{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}管理的一組
{{< glossary_tooltip text="節點" term_id="node" >}}（物理機或虛擬機器）。
Kubernetes {{< param "version" >}} 支援的最大節點數為 5000。
更具體地說，Kubernetes旨在適應滿足以下*所有*標準的配置：

<!--
* No more than 110 pods per node
* No more than 5000 nodes
* No more than 150000 total pods
* No more than 300000 total containers
-->
* 每個節點的 Pod 數量不超過 110
* 節點數不超過 5000
* Pod 總數不超過 150000
* 容器總數不超過 300000

<!-- 
You can scale your cluster by adding or removing nodes. The way you do this depends
on how your cluster is deployed.
-->
你可以透過新增或刪除節點來擴充套件叢集。叢集擴縮的方式取決於叢集的部署方式。

<!--  
## Cloud provider resource quotas {#quota-issues}

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
* Gating the cluster scaling actions to brings up new nodes in batches, with a pause
  between batches, because some cloud providers rate limit the creation of new instances.
-->
## 雲供應商資源配額 {#quota-issues}

為避免遇到雲供應商配額問題，在建立具有大規模節點的叢集時，請考慮以下事項：
* 請求增加雲資源的配額，例如：
    * 計算例項
    * CPUs
    * 儲存卷
    * 使用中的 IP 地址
    * 資料包過濾規則集
    * 負載均衡數量
    * 網路子網
    * 日誌流
* 由於某些雲供應商限制了建立新例項的速度，因此透過分批啟動新節點來控制叢集擴充套件操作，並在各批之間有一個暫停。

<!--  
## Control plane components

For a large cluster, you need a control plane with sufficient compute and other
resources.

Typically you would run one or two control plane instances per failure zone,
scaling those instances vertically first and then scaling horizontally after reaching
the point of falling returns to (vertical) scale.
-->
## 控制面元件

對於大型叢集，你需要一個具有足夠計算能力和其他資源的控制平面。

通常，你將在每個故障區域執行一個或兩個控制平面例項，
先垂直縮放這些例項，然後在到達下降點（垂直）後再水平縮放。

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
你應該在每個故障區域至少應執行一個例項，以提供容錯能力。 
Kubernetes 節點不會自動將流量引向相同故障區域中的控制平面端點。 
但是，你的雲供應商可能有自己的機制來執行此操作。

例如，使用託管的負載均衡器時，你可以配置負載均衡器傳送源自故障區域 _A_ 中的 kubelet 和 Pod 的流量，
並將該流量僅定向到也位於區域 _A_ 中的控制平面主機。 
如果單個控制平面主機或端點故障區域 _A_ 離線，則意味著區域 _A_ 中的節點的所有控制平面流量現在都在區域之間傳送。
在每個區域中執行多個控制平面主機能降低出現這種結果的可能性。

<!--
### etcd storage
-->
### etcd 儲存

<!--
To improve performance of large clusters, you can store Event objects in a separate
dedicated etcd instance.
-->
為了提高大規模叢集的效能，你可以將事件物件儲存在單獨的專用 etcd 例項中。

<!--
When creating a cluster, you can (using custom tooling):

* start and configure additional etcd instance
* configure the {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} to use it for storing events
-->
在建立叢集時，你可以（使用自定義工具）：

* 啟動並配置額外的 etcd 例項
* 配置 {{< glossary_tooltip term_id="kube-apiserver" text="API 伺服器" >}}，將它用於儲存事件

<!--
See [Operating etcd clusters for Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) and
[Set up a High Availability etcd cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
for details on configuring and managing etcd for a large cluster.
-->
有關為大型叢集配置和管理 etcd 的詳細資訊，請參閱
[為 Kubernetes 執行 etcd 叢集](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/)
和使用 [kubeadm 建立一個高可用 etcd 叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)。

<!--
### Addon Resources
-->
### 外掛資源   {#addon-resources}

<!--
Kubernetes [resource limits](/docs/concepts/configuration/manage-resources-containers/)
help to minimize the impact of memory leaks and other ways that pods and containers can
impact on other components. These resource limits apply to
{{< glossary_tooltip text="addon" term_id="addons" >}} resources just as they apply to application workloads.

  For example, you can set CPU and memory limits for a logging component:
-->
Kubernetes [資源限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
有助於最大程度地減少記憶體洩漏的影響以及 Pod 和容器可能對其他元件的其他方式的影響。
這些資源限制適用於{{< glossary_tooltip text="外掛" term_id="addons" >}}資源，
就像它們適用於應用程式工作負載一樣。

例如，你可以對日誌元件設定 CPU 和記憶體限制

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
外掛的預設限制通常基於從中小規模 Kubernetes 叢集上執行每個外掛的經驗收集的資料。
外掛在大規模叢集上執行時，某些資源消耗常常比其預設限制更多。
如果在不調整這些值的情況下部署了大規模叢集，則外掛可能會不斷被殺死，因為它們不斷達到記憶體限制。
或者，外掛可能會執行，但由於 CPU 時間片的限制而導致效能不佳。

<!--  
To avoid running into cluster addon resource issues, when creating a cluster with
many nodes, consider the following:

* Some addons scale vertically - there is one replica of the addon for the cluster
  or serving a whole failure zone. For these addons, increase requests and limits
  as you scale out your cluster.
* Many addons scale horizontally - you add capacity by running more pods - but with
  a very large cluster you may also need to raise CPU or memory limits slightly.
  The VerticalPodAutoscaler can run in _recommender_ mode to provide suggested
  figures for requests and limits.
* Some addons run as one copy per node, controlled by a {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}: for example, a node-level log aggregator. Similar to
  the case with horizontally-scaled addons, you may also need to raise CPU or memory
  limits slightly.
-->
為避免遇到叢集外掛資源問題，在建立大規模叢集時，請考慮以下事項：

* 部分垂直擴充套件外掛 —— 總有一個外掛副本服務於整個叢集或服務於整個故障區域。
  對於這些附加元件，請在擴大叢集時加大資源請求和資源限制。
* 許多水平擴充套件外掛 —— 你可以透過執行更多的 Pod 來增加容量——但是在大規模叢集下，
  可能還需要稍微提高 CPU 或記憶體限制。
  VerticalPodAutoscaler 可以在 _recommender_ 模式下執行，
  以提供有關請求和限制的建議數字。
* 一些外掛在每個節點上執行一個副本，並由 DaemonSet 控制：
  例如，節點級日誌聚合器。與水平擴充套件外掛的情況類似，
  你可能還需要稍微提高 CPU 或記憶體限制。

<!-- 
## {{% heading "whatsnext" %}}

`VerticalPodAutoscaler` is a custom resource that you can deploy into your cluster
to help you manage resource requests and limits for pods.  
Visit [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
to learn more about `VerticalPodAutoscaler` and how you can use it to scale cluster
components, including cluster-critical addons.

The [cluster autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)
integrates with a number of cloud providers to help you run the right number of
nodes for the level of resource demand in your cluster.
-->
## {{% heading "whatsnext" %}}

`VerticalPodAutoscaler` 是一種自定義資源，你可以將其部署到叢集中，幫助你管理資源請求和 Pod 的限制。
訪問 [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
以瞭解有關 `VerticalPodAutoscaler` 的更多資訊，
以及如何使用它來擴充套件叢集元件（包括對叢集至關重要的外掛）的資訊。

[叢集自動擴縮器](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)
與許多雲供應商整合在一起，幫助你在你的叢集中，按照資源需求級別執行正確數量的節點。

<!-- 
The [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
helps you in resizing the addons automatically as your cluster's scale changes.
-->

[addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
可幫助你在叢集規模變化時自動調整外掛的大小。
