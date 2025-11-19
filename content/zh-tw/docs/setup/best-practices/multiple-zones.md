---
title: 運行於多可用區環境
weight: 20
content_type: concept
---
<!--
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Running in multiple zones
weight: 20
content_type: concept
-->

<!-- overview -->

<!--
This page describes running a cluster across multiple zones.
-->
本頁描述如何跨多個區（Zone）運行集羣。

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
## 背景   {#background}

Kubernetes 從設計上允許同一個 Kubernetes 集羣跨多個失效區來運行，
通常這些區位於某個稱作 **區域（Region）** 邏輯分組中。
主要的雲提供商都將區域定義爲一組失效區的集合（也稱作 **可用區（Availability Zones**）），
能夠提供一組一致的功能特性：每個區域內，各個可用區提供相同的 API 和服務。

典型的雲體系結構都會嘗試降低某個區中的失效影響到其他區中服務的概率。

<!--
## Control plane behavior

All [control plane components](/docs/concepts/architecture/#control-plane-components)
support running as a pool of interchangeable resources, replicated per
component.
-->
## 控制面行爲   {#control-plane-behavior}

所有的[控制面組件](/zh-cn/docs/concepts/architecture/#control-plane-components)
都支持以一組可相互替換的資源池的形式來運行，每個組件都有多個副本。

<!--
When you deploy a cluster control plane, place replicas of
control plane components across multiple failure zones. If availability is
an important concern, select at least three failure zones and replicate
each individual control plane component (API server, scheduler, etcd,
cluster controller manager) across at least three failure zones.
If you are running a cloud controller manager then you should
also replicate this across all the failure zones you selected.
-->
當你部署集羣控制面時，應將控制面組件的副本跨多個失效區來部署。
如果可用性是一個很重要的指標，應該選擇至少三個失效區，
並將每個控制面組件（API 服務器、調度器、etcd、控制器管理器）複製多個副本，
跨至少三個失效區來部署。如果你在運行雲控制器管理器，
則也應該將該組件跨所選的三個失效區來部署。

{{< note >}}
<!--
Kubernetes does not provide cross-zone resilience for the API server
endpoints. You can use various techniques to improve availability for
the cluster API server, including DNS round-robin, SRV records, or
a third-party load balancing solution with health checking.
-->
Kubernetes 並不會爲 API 服務器端點提供跨失效區的彈性。
你可以爲集羣 API 服務器使用多種技術來提升其可用性，包括使用
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
## 節點行爲   {#node-behavior}

Kubernetes 自動爲負載資源（如 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
或 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}）
跨集羣中不同節點來部署其 Pod。
這種分佈邏輯有助於降低失效帶來的影響。

<!--
When nodes start up, the kubelet on each node automatically adds
{{< glossary_tooltip text="labels" term_id="label" >}} to the Node object
that represents that specific kubelet in the Kubernetes API.
These labels can include
[zone information](/docs/reference/labels-annotations-taints/#topologykubernetesiozone).
-->
節點啓動時，每個節點上的 kubelet 會向 Kubernetes API 中代表該 kubelet 的 Node
對象添加{{< glossary_tooltip text="標籤" term_id="label" >}}。
這些標籤可能包含[區信息](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesiozone)。

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
如果你的集羣跨了多個可用區或者地理區域，你可以使用節點標籤，結合
[Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
來控制如何在你的集羣中多個失效域之間分佈 Pod。這裏的失效域可以是地理區域、可用區甚至是特定節點。
這些提示信息使得{{< glossary_tooltip text="調度器" term_id="kube-scheduler" >}}能夠更好地調度
Pod，以實現更好的可用性，降低因爲某種失效給整個工作負載帶來的風險。

<!--
For example, you can set a constraint to make sure that the
3 replicas of a StatefulSet are all running in different zones to each
other, whenever that is feasible. You can define this declaratively
without explicitly defining which availability zones are in use for
each workload.
-->
例如，你可以設置一種約束，確保某個 StatefulSet 中的 3 個副本都運行在不同的可用區中，
只要其他條件允許。你可以通過聲明的方式來定義這種約束，
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
### 跨多個區分佈節點   {#distributing-nodes-across-zones}

Kubernetes 的核心邏輯並不會幫你創建節點，你需要自行完成此操作，或者使用類似
[Cluster API](https://cluster-api.sigs.k8s.io/) 這類工具來替你管理節點。

<!--
Using tools such as the Cluster API you can define sets of machines to run as
worker nodes for your cluster across multiple failure domains, and rules to
automatically heal the cluster in case of whole-zone service disruption.
-->
使用類似 Cluster API 這類工具，你可以跨多個失效域來定義一組用做你的集羣工作節點的機器，
以及當整個區的服務出現中斷時如何自動治癒集羣的策略。

<!--
## Manual zone assignment for Pods

You can apply [node selector constraints](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
to Pods that you create, as well as to Pod templates in workload resources
such as Deployment, StatefulSet, or Job.
-->
## 爲 Pod 手動指定區   {#manual-zone-assignment-for-pods}

<!--
You can apply [node selector constraints](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
to Pods that you create, as well as to Pod templates in workload resources
such as Deployment, StatefulSet, or Job.
-->
你可以應用[節點選擇算符約束](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)到你所創建的
Pod 上，或者爲 Deployment、StatefulSet 或 Job 這類工作負載資源中的 Pod 模板設置此類約束。

<!--
## Storage access for zones

When persistent volumes are created, Kubernetes automatically adds zone labels 
to any PersistentVolumes that are linked to a specific zone.
The {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} then ensures,
through its `NoVolumeZoneConflict` predicate, that pods which claim a given PersistentVolume
are only placed into the same zone as that volume.

Please note that the method of adding zone labels can depend on your 
cloud provider and the storage provisioner you’re using. Always refer to the specific 
documentation for your environment to ensure correct configuration.
-->
## 跨區的存儲訪問   {#storage-access-for-zones}

當創建持久卷時，Kubernetes 會自動向那些鏈接到特定區的 PersistentVolume 添加區標籤。
{{< glossary_tooltip text="調度器" term_id="kube-scheduler" >}}通過其
`NoVolumeZoneConflict` 斷言確保申領給定 PersistentVolume 的 Pod
只會被調度到該卷所在的可用區。

<!--
Please note that the method of adding zone labels can depend on your 
cloud provider and the storage provisioner you’re using. Always refer to the specific 
documentation for your environment to ensure correct configuration.
-->
請注意，添加區標籤的方法可能取決於你的雲提供商和存儲製備器。
請參閱具體的環境文檔，確保配置正確。

請注意，添加區標籤的方法可能會根據你所使用的雲提供商和存儲製備器而有所不同。
爲確保配置正確，請始終參閱你的環境的特定文檔。

<!--
You can specify a {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
for PersistentVolumeClaims that specifies the failure domains (zones) that the
storage in that class may use.
To learn about configuring a StorageClass that is aware of failure domains or zones,
see [Allowed topologies](/docs/concepts/storage/storage-classes/#allowed-topologies).
-->
你可以爲 PersistentVolumeClaim 指定
{{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
以設置該類中的存儲可以使用的失效域（區）。
要了解如何配置能夠感知失效域或區的 StorageClass，
請參閱[可用的拓撲邏輯](/zh-cn/docs/concepts/storage/storage-classes/#allowed-topologies)。

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
## 網絡   {#networking}

Kubernetes 自身不提供與可用區相關的聯網配置。
你可以使用[網絡插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
來配置集羣的聯網，該網絡解決方案可能擁有一些與可用區相關的元素。
例如，如果你的雲提供商支持 `type=LoadBalancer` 的 Service，
則負載均衡器可能僅會將請求流量發送到運行在負責處理給定連接的負載均衡器組件所在的區。
請查閱雲提供商的文檔瞭解詳細信息。

<!--
For custom or on-premises deployments, similar considerations apply.
{{< glossary_tooltip text="Service" term_id="service" >}} and
{{< glossary_tooltip text="Ingress" term_id="ingress" >}} behavior, including handling
of different failure zones, does vary depending on exactly how your cluster is set up.
-->
對於自定義的或本地集羣部署，也可以考慮這些因素。
{{< glossary_tooltip text="Service" term_id="service" >}} 和
{{< glossary_tooltip text="Ingress" term_id="ingress" >}} 的行爲，
包括處理不同失效區的方法，在很大程度上取決於你的集羣是如何搭建的。

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

在搭建集羣時，你可能需要考慮當某區域中的所有失效區都同時掉線時，是否以及如何恢復服務。
例如，你是否要求在某個區中至少有一個節點能夠運行 Pod？
請確保任何對集羣很關鍵的修復工作都不要指望集羣中至少有一個健康節點。
例如：當所有節點都不健康時，你可能需要運行某個修復性的 Job，
該 Job 要設置特定的{{< glossary_tooltip text="容忍度" term_id="toleration" >}}，
以便修復操作能夠至少將一個節點恢復爲可用狀態。

Kubernetes 對這類問題沒有現成的解決方案；不過這也是要考慮的因素之一。

## {{% heading "whatsnext" %}}

<!--
To learn how the scheduler places Pods in a cluster, honoring the configured constraints,
visit [Scheduling and Eviction](/docs/concepts/scheduling-eviction/).
-->
要了解調度器如何在集羣中放置 Pod 並遵從所配置的約束，
可參閱[調度與驅逐](/zh-cn/docs/concepts/scheduling-eviction/)。
