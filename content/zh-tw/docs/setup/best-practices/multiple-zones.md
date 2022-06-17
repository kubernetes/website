---
title: 運行於多可用區環境
weight: 10
content_type: concept
---
<!--
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Running in multiple zones
weight: 10
content_type: concept
-->

<!-- overview -->

<!--
This page describes running a cluster across multiple zones.
-->
本頁描述如何跨多個區（Zone）中執行叢集。

<!-- body -->

<!--
## Background

Kubernetes is designed so that a single Kubernetes cluster can run
across multiple failure zones, typically where these zones fit within
a logical grouping called a _region_. Major cloud providers define a region
as a set of failure zones (also called _availability zones_) that provide
a consistent set of features: within a region, each zone offers the same
APIs and services.

Typical cloud architectures aim to minimize the chance that a failure in
one zone also impairs services in another zone.
-->
## 背景

Kubernetes 從設計上允許同一個 Kubernetes 叢集跨多個失效區來執行，
通常這些區位於某個稱作 _區域（region）_ 邏輯分組中。
主要的雲提供商都將區域定義為一組失效區的集合（也稱作 _可用區（Availability Zones）_），
能夠提供一組一致的功能特性：每個區域內，各個可用區提供相同的 API 和服務。

典型的雲體系結構都會嘗試降低某個區中的失效影響到其他區中服務的機率。

<!--
## Control plane behavior

All [control plane components](/docs/concepts/overview/components/#control-plane-components)
support running as a pool of interchangeable resources, replicated per
component.
-->
## 控制面行為   {#control-plane-behavior}

所有的[控制面元件](/zh-cn/docs/concepts/overview/components/#control-plane-components)
都支援以一組可相互替換的資源池的形式來執行，每個元件都有多個副本。

<!--
When you deploy a cluster control plane, place replicas of
control plane components across multiple failure zones. If availability is
an important concern, select at least three failure zones and replicate
each individual control plane component (API server, scheduler, etcd,
cluster controller manager) across at least three failure zones.
If you are running a cloud controller manager then you should
also replicate this across all the failure zones you selected.
-->
當你部署叢集控制面時，應將控制面元件的副本跨多個失效區來部署。
如果可用性是一個很重要的指標，應該選擇至少三個失效區，並將每個
控制面元件（API 伺服器、排程器、etcd、控制器管理器）複製多個副本，
跨至少三個失效區來部署。如果你在運行雲控制器管理器，則也應該將
該元件跨所選的三個失效區來部署。

{{< note >}}
<!--
Kubernetes does not provide cross-zone resilience for the API server
endpoints. You can use various techniques to improve availability for
the cluster API server, including DNS round-robin, SRV records, or
a third-party load balancing solution with health checking.
-->
Kubernetes 並不會為 API 伺服器端點提供跨失效區的彈性。
你可以為叢集 API 伺服器使用多種技術來提升其可用性，包括使用
DNS 輪轉、SRV 記錄或者帶健康檢查的第三方負載均衡解決方案等等。
{{< /note >}}

<!--
## Node behavior

Kubernetes automatically spreads the Pods for
workload resources (such as {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
or {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}})
across different nodes in a cluster. This spreading helps
reduce the impact of failures.
-->
## 節點行為   {#node-behavior}

Kubernetes 自動為負載資源（如{{< glossary_tooltip text="Deployment" term_id="deployment" >}}
或 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}})）
跨叢集中不同節點來部署其 Pods。
這種分佈邏輯有助於降低失效帶來的影響。

<!--
When nodes start up, the kubelet on each node automatically adds
{{< glossary_tooltip text="labels" term_id="label" >}} to the Node object
that represents that specific kubelet in the Kubernetes API.
These labels can include
[zone information](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).
-->
節點啟動時，每個節點上的 kubelet 會向 Kubernetes API 中代表該 kubelet 的 Node 物件
新增 {{< glossary_tooltip text="標籤" term_id="label" >}}。
這些標籤可能包含[區資訊](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesiozone)。

<!--
If your cluster spans multiple zones or regions, you can use node labels
in conjunction with
[Pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
to control how Pods are spread across your cluster among fault domains:
regions, zones, and even specific nodes.
These hints enable the
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} to place
Pods for better expected availability, reducing the risk that a correlated
failure affects your whole workload.
-->
如果你的叢集跨了多個可用區或者地理區域，你可以使用節點標籤，結合
[Pod 拓撲分佈約束](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
來控制如何在你的叢集中多個失效域之間分佈 Pods。這裡的失效域可以是
地理區域、可用區甚至是特定節點。
這些提示資訊使得{{< glossary_tooltip text="排程器" term_id="kube-scheduler" >}}
能夠更好地分佈 Pods，以實現更好的可用性，降低因為某種失效給整個工作負載
帶來的風險。

<!--
For example, you can set a constraint to make sure that the
3 replicas of a StatefulSet are all running in different zones to each
other, whenever that is feasible. You can define this declaratively
without explicitly defining which availability zones are in use for
each workload.
-->
例如，你可以設定一種約束，確保某個 StatefulSet 中的三個副本都執行在
不同的可用區中，只要其他條件允許。你可以透過宣告的方式來定義這種約束，
而不需要顯式指定每個工作負載使用哪些可用區。

<!--
### Distributing nodes across zones

Kubernetes' core does not create nodes for you; you need to do that yourself,
or use a tool such as the [Cluster API](https://cluster-api.sigs.k8s.io/) to
manage nodes on your behalf.

Using tools such as the Cluster API you can define sets of machines to run as
worker nodes for your cluster across multiple failure domains, and rules to
automatically heal the cluster in case of whole-zone service disruption.
-->
### 跨多個區分佈節點 {#distributing-nodes-across-zones}

Kubernetes 的核心邏輯並不會幫你建立節點，你需要自行完成此操作，或者使用
類似 [Cluster API](https://cluster-api.sigs.k8s.io/) 這類工具來替你管理節點。

<!--
Using tools such as the Cluster API you can define sets of machines to run as
worker nodes for your cluster across multiple failure domains, and rules to
automatically heal the cluster in case of whole-zone service disruption.
-->
使用類似 Cluster API 這類工具，你可以跨多個失效域來定義一組用做你的叢集
工作節點的機器，以及當整個區的服務出現中斷時如何自動治癒叢集的策略。

<!--
## Manual zone assignment for Pods

You can apply [node selector constraints](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
to Pods that you create, as well as to Pod templates in workload resources
such as Deployment, StatefulSet, or Job.
-->
## 為 Pods 手動指定區

<!--
You can apply [node selector constraints](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
to Pods that you create, as well as to Pod templates in workload resources
such as Deployment, StatefulSet, or Job.
-->
你可以應用[節點選擇算符約束](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
到你所建立的 Pods 上，或者為 Deployment、StatefulSet 或 Job 這類工作負載資源
中的 Pod 模板設定此類約束。

<!--
## Storage access for zones

When persistent volumes are created, the `PersistentVolumeLabel`
[admission controller](/docs/reference/access-authn-authz/admission-controllers/)
automatically adds zone labels to any PersistentVolumes that are linked to a specific
zone. The {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} then ensures,
through its `NoVolumeZoneConflict` predicate, that pods which claim a given PersistentVolume
are only placed into the same zone as that volume.
-->
## 跨區的儲存訪問

當建立持久卷時，`PersistentVolumeLabel` 
[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
會自動向那些連結到特定區的 PersistentVolume 新增區標籤。
{{< glossary_tooltip text="排程器" term_id="kube-scheduler" >}}透過其
`NoVolumeZoneConflict` 斷言確保申領給定 PersistentVolume 的 Pods 只會
被排程到該卷所在的可用區。

<!--
You can specify a {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
for PersistentVolumeClaims that specifies the failure domains (zones) that the
storage in that class may use.
To learn about configuring a StorageClass that is aware of failure domains or zones,
see [Allowed topologies](/docs/concepts/storage/storage-classes/#allowed-topologies).
-->
你可以為 PersistentVolumeClaim 指定{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
以設定該類中的儲存可以使用的失效域（區）。
要了解如何配置能夠感知失效域或區的 StorageClass，請參閱
[可用的拓撲邏輯](/zh-cn/docs/concepts/storage/storage-classes/#allowed-topologies)。

<!--
## Networking

By itself, Kubernetes does not include zone-aware networking. You can use a
[network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
to configure cluster networking, and that network solution might have zone-specific
elements. For example, if your cloud provider supports Services with
`type=LoadBalancer`, the load balancer might only send traffic to Pods running in the
same zone as the load balancer element processing a given connection.
Check your cloud provider's documentation for details.
-->
## 網路  {#networking}

Kubernetes 自身不提供與可用區相關的聯網配置。
你可以使用[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
來配置叢集的聯網，該網路解決方案可能擁有一些與可用區相關的元素。
例如，如果你的雲提供商支援 `type=LoadBalancer` 的 Service，則負載均衡器
可能僅會將請求流量傳送到執行在負責處理給定連線的負載均衡器元件所在的區。
請查閱雲提供商的文件瞭解詳細資訊。

<!--
For custom or on-premises deployments, similar considerations apply.
{{< glossary_tooltip text="Service" term_id="service" >}} and
{{< glossary_tooltip text="Ingress" term_id="ingress" >}} behavior, including handling
of different failure zones, does vary depending on exactly how your cluster is set up.
-->
對於自定義的或本地叢集部署，也可以考慮這些因素
{{< glossary_tooltip text="Service" term_id="service" >}} 
{{< glossary_tooltip text="Ingress" term_id="ingress" >}} 的行為，
包括處理不同失效區的方法，在很大程度上取決於你的叢集是如何搭建的。

<!--
## Fault recovery

When you set up your cluster, you might also need to consider whether and how
your setup can restore service if all the failure zones in a region go
off-line at the same time. For example, do you rely on there being at least
one node able to run Pods in a zone?  
Make sure that any cluster-critical repair work does not rely
on there being at least one healthy node in your cluster. For example: if all nodes
are unhealthy, you might need to run a repair Job with a special
{{< glossary_tooltip text="toleration" term_id="toleration" >}} so that the repair
can complete enough to bring at least one node into service.

Kubernetes doesn't come with an answer for this challenge; however, it's
something to consider.
-->
## 失效恢復    {#fault-recovery}

在搭建叢集時，你可能需要考慮當某區域中的所有失效區都同時掉線時，是否以及如何
恢復服務。例如，你是否要求在某個區中至少有一個節點能夠執行 Pod？
請確保任何對叢集很關鍵的修復工作都不要指望叢集中至少有一個健康節點。
例如：當所有節點都不健康時，你可能需要執行某個修復性的 Job，
該 Job 要設定特定的{{< glossary_tooltip text="容忍度" term_id="toleration" >}}
以便修復操作能夠至少將一個節點恢復為可用狀態。

Kubernetes 對這類問題沒有現成的解決方案；不過這也是要考慮的因素之一。

## {{% heading "whatsnext" %}}

<!--
To learn how the scheduler places Pods in a cluster, honoring the configured constraints,
visit [Scheduling and Eviction](/docs/concepts/scheduling-eviction/).
-->
要了解排程器如何在叢集中放置 Pods 並遵從所配置的約束，可參閱
[排程與驅逐](/zh-cn/docs/concepts/scheduling-eviction/)。

