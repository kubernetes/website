---
title: 跨區域執行
weight: 20
content_type: concept
---
<!--
---
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Running in multiple zones
weight: 20
content_type: concept
---
-->

<!-- overview -->

<!--
This page describes running Kubernetes across multiple zones.
-->
本頁面說明如何跨多個區域執行 Kubernetes。

<!-- body -->

<!--
## Background
-->
## 背景 {#background}

<!--
Kubernetes is designed so that a single Kubernetes cluster can run
across multiple failure zones, typically where these zones fit within
a logical grouping called a _region_. Major cloud providers define a region
as a set of failure zones (also called _availability zones_) that provide
a consistent set of features: within a region, each zone offers the same
APIs and services.
-->
Kubernetes 的設計使單一叢集能夠跨多個故障區（Failure Zone）執行；
這些故障區通常隸屬於一個稱為**「地區」（Region）**的邏輯分組。主要的雲端供應商將地區定義為一組故障區，亦稱為**可用區（Availability Zone）**，
並提供一致的功能：在同一個地區內，各故障區提供相同的 API 與服務。

<!--
Typical cloud architectures aim to minimize the chance that a failure in
one zone also impairs services in another zone.
-->
典型的雲端架構旨在將單一故障區故障對其他故障區服務的影響降至最低。

<!--
## Control plane behavior
-->
## 控制平面行為 {#control-plane-behavior}

<!--
All [control plane components](/docs/concepts/architecture/#control-plane-components)
support running as a pool of interchangeable resources, replicated per
component.
-->
所有[控制平面組件](/zh-tw/docs/concepts/architecture/#control-plane-components)都支援以可互換資源池的方式執行，
並為各個組件建立多個副本

<!--
When you deploy a cluster control plane, place replicas of
control plane components across multiple failure zones. If availability is
an important concern, select at least three failure zones and replicate
each individual control plane component (API server, scheduler, etcd,
cluster controller manager) across at least three failure zones.
If you are running a cloud controller manager then you should
also replicate this across all the failure zones you selected.
-->
當您部署叢集控制平面時，需將控制平面組件的副本分散部署於多個故障區。
若高可用性是重要考量，應選擇至少三個故障區，並為各個控制平面組件（API 伺服器、排程器、etcd、叢集控制器管理器）建立多個副本，分散部署於這些故障區中。
若有使用雲端控制器管理器，也應將它複製到您所選擇的所有故障區中。

<!--
{{< note >}}
Kubernetes does not provide cross-zone resilience for the API server
endpoints. You can use various techniques to improve availability for
the cluster API server, including DNS round-robin, SRV records, or
a third-party load balancing solution with health checking.
{{< /note >}}
-->
{{< note >}}
Kubernetes 不會為 API 伺服器端點提供跨故障區的系統韌性。您可以使用多種技術來改善叢集 API 伺服器的可用性，
包括 DNS 輪詢、SRV 記錄，或是具備健康檢查功能的第三方負載平衡方案。
{{< /note >}}

<!--
## Node behavior
-->
## 節點行為 {#node-behavior}

<!--
Kubernetes automatically spreads the Pods for
workload resources (such as {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
or {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}})
across different nodes in a cluster. This spreading helps
reduce the impact of failures.
-->
Kubernetes 會自動將工作負載資源
（例如 {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}）
的 Pod 分散部署於叢集中的不同節點。這種分散部署有助於降低故障造成的影響。

<!--
When nodes start up, the kubelet on each node automatically adds
{{< glossary_tooltip text="labels" term_id="label" >}} to the Node object
that represents that specific kubelet in the Kubernetes API.
These labels can include
[zone information](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).
-->
當節點啟動時，每個節點上的 kubelet 會自動在 Kubernetes API 中代表此特定節點的 Node 物件加上{{< glossary_tooltip text="標籤" term_id="label" >}}。
這些標籤可以包含[區域資訊](/zh-tw/docs/reference/labels-annotations-taints/#topologykubernetesiozone)。

<!--
If your cluster spans multiple zones or regions, you can use node labels
in conjunction with
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
to control how Pods are spread across your cluster among fault domains:
regions, zones, and even specific nodes.
These hints enable the
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} to place
Pods for better expected availability, reducing the risk that a correlated
failure affects your whole workload.
-->
如果您的叢集跨越多個故障區或地區，您可以結合使用節點標籤與 [Pod 拓撲散佈限制](/zh-tw/docs/concepts/scheduling-eviction/topology-spread-constraints/)，
來控制 Pod 在叢集中的各個故障域（地區、故障區，甚至特定節點）之間的分佈方式。
這些提示可讓{{< glossary_tooltip text="排程器" term_id="kube-scheduler" >}}將 Pod 排程到更有利於可用性的位置，
從而降低相關故障影響整個工作負載的風險。

<!--
For example, you can set a constraint to make sure that the
3 replicas of a StatefulSet are all running in different zones to each
other, whenever that is feasible. You can define this declaratively
without explicitly defining which availability zones are in use for
each workload.
-->
例如，您可以設定一項限制：確保在可行的情況下，一個 StatefulSet 的 3 個副本分別執行於不同的故障區
您可以透過宣告式的方式來定義此限制，不需要為每個工作負載明確指定使用哪些可用區。

<!--
### Distributing nodes across zones
-->
### 跨區域分散節點 {#distributing-nodes-across-zones}

<!--
Kubernetes' core does not create nodes for you; you need to do that yourself,
or use a tool such as the [Cluster API](https://cluster-api.sigs.k8s.io/) to
manage nodes on your behalf.
-->
Kubernetes 核心本身不會為您建立節點；您需要自行建立，
或使用像是 [Cluster API](https://cluster-api.sigs.k8s.io/) 的工具來代為管理節點。

<!--
Using tools such as the Cluster API you can define sets of machines to run as
worker nodes for your cluster across multiple failure domains, and rules to
automatically heal the cluster in case of whole-zone service disruption.
-->
透過使用 Cluster API 等工具，您可以定義一組機器，將其分散在多個故障域中作為叢集的工作節點執行，
並定義規則，在發生整個區域的服務中斷時自動修復叢集。

<!--
## Manual zone assignment for Pods
-->
## 手動為 Pod 指定區域 {#manual-zone-assignment-for-pods}

<!--
You can apply [node selector constraints](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
to Pods that you create, as well as to Pod templates in workload resources
such as Deployment, StatefulSet, or Job.
-->
您可以套用[節點選擇器限制](/zh-tw/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)到您建立的 Pod，
以及 Deployment、StatefulSet 或 Job 等工作負載資源中的 Pod 模板。

<!--
## Storage access for zones
-->
## 區域的儲存存取 {#storage-access-for-zones}

<!--
When persistent volumes are created, Kubernetes automatically adds zone labels 
to any PersistentVolumes that are linked to a specific zone.
The {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} then ensures,
through its `NoVolumeZoneConflict` predicate, that pods which claim a given PersistentVolume
are only placed into the same zone as that volume.
-->
當建立持久卷時，Kubernetes 會自動為連結至特定故障區的 PersistentVolume 加上區域標籤。
接著{{< glossary_tooltip text="排程器" term_id="kube-scheduler" >}}會透過 `NoVolumeZoneConflict` 預選規則，
確保使用該 PersistentVolume 的 Pod 只會被排程到與該卷相同的故障區。

<!--
Please note that the method of adding zone labels can depend on your 
cloud provider and the storage provisioner you’re using. Always refer to the specific 
documentation for your environment to ensure correct configuration.
-->
請注意到區域標籤的新增方式可能取決於您使用的雲端供應商與儲存佈建器。
請務必參考適用於您環境的特定文件，確保配置正確。

<!--
You can specify a {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
for PersistentVolumeClaims that specifies the failure domains (zones) that the
storage in that class may use.
To learn about configuring a StorageClass that is aware of failure domains or zones,
see [Allowed topologies](/docs/concepts/storage/storage-classes/#allowed-topologies).
-->
您可以為 PersistentVolumeClaims 指定一個{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}，
用來指定該類別中的儲存空間可以使用的故障域（區域）。
要了解配置能夠感知到故障域或區域的 StorageClass，請參閱[允許的拓撲](/zh-tw/docs/concepts/storage/storage-classes/#allowed-topologies)。

<!--
## Networking
-->
## 網路 {#networking}

<!--
By itself, Kubernetes does not include zone-aware networking. You can use a
[network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
to configure cluster networking, and that network solution might have zone-specific
elements. For example, if your cloud provider supports Services with
`type=LoadBalancer`, the load balancer might only send traffic to Pods running in the
same zone as the load balancer element processing a given connection.
Check your cloud provider's documentation for details.
-->
Kubernetes 本身並不包含故障區感知的網路功能。
您可以使用[網路外掛](/zh-tw/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)來配置叢集網路，
而選用的網路解決方案可能包含與特定故障區相關的設定。例如，如果您的雲端供應商支援 `type=LoadBalancer` 的 Service，
負載平衡器可能只會將流量傳送至與處理此連線的負載平衡器位於相同區域的 Pod。請查看您的雲端供應商文件以瞭解詳情。

<!--
For custom or on-premises deployments, similar considerations apply.
{{< glossary_tooltip text="Service" term_id="service" >}} and
{{< glossary_tooltip text="Ingress" term_id="ingress" >}} behavior, including handling
of different failure zones, does vary depending on exactly how your cluster is set up.
-->
對於自訂或本地端部署，類似的考量同樣適用。
{{< glossary_tooltip text="Service" term_id="service" >}} 與 {{< glossary_tooltip text="Ingress" term_id="ingress" >}} 的行為，包含對不同故障區的處理方式，
會根據您叢集的實際部署方式而有所不同。

<!--
## Fault recovery
-->
## 故障復原 {#fault-recovery}

<!--
When you set up your cluster, you might also need to consider whether and how
your setup can restore service if all the failure zones in a region go
off-line at the same time. For example, do you rely on there being at least
one node able to run Pods in a zone?  
Make sure that any cluster-critical repair work does not rely
on there being at least one healthy node in your cluster. For example: if all nodes
are unhealthy, you might need to run a repair Job with a special
{{< glossary_tooltip text="toleration" term_id="toleration" >}} so that the repair
can complete enough to bring at least one node into service.
-->
當您架設叢集時，還需要考慮：若某個地區內的所有故障區同時離線，您的架構是否能恢復服務，以及應如何恢復。
例如，是否仰賴某個故障區中至少有一個節點能夠執行 Pod？
請確保任何叢集關鍵的修復工作，都不依賴叢集中至少有一個健康節點。例如：如果所有節點皆處於不健康狀態，
您可能需要執行一個帶有特殊 {{< glossary_tooltip text="容許" term_id="toleration" >}} 的修復 Job，
使修復能順利完成，並讓至少一個節點恢復運作。

<!--
Kubernetes doesn't come with an answer for this challenge; however, it's
something to consider.
-->
Kubernetes 並未提供此問題的解法；但在規劃時仍需納入考量。

## {{% heading "whatsnext" %}}

<!--
To learn how the scheduler places Pods in a cluster, honoring the configured constraints,
visit [Scheduling and Eviction](/docs/concepts/scheduling-eviction/).
-->
若想了解排程器如何在叢集中依照設定的限制來排程 Pod，
請參閱[排程與驅逐](/zh-tw/docs/concepts/scheduling-eviction/)。