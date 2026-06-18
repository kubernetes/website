---
title: 高可用拓撲選項
content_type: concept
weight: 50
---
<!--
---
title: Options for Highly Available Topology
content_type: concept
weight: 50
---
-->

<!-- overview -->

<!--
This page explains the two options for configuring the topology of your highly available (HA) Kubernetes clusters.
-->
本頁說明為高可用（HA）Kubernetes 叢集設定拓撲的兩種選項。

<!--
You can set up an HA cluster:

- With stacked control plane nodes, where etcd nodes are colocated with control plane nodes
- With external etcd nodes, where etcd runs on separate nodes from the control plane
-->
您可以透過以下方式建立 HA 叢集：

- 採用堆疊（stacked）控制平面節點，讓 etcd 節點與控制平面節點部署在一起
- 採用外部 etcd 節點，讓 etcd 執行於與控制平面分開的節點上

<!--
You should carefully consider the advantages and disadvantages of each topology before setting up an HA cluster.
-->
在建立 HA 叢集之前，您應仔細評估每種拓撲的優缺點。

{{< note >}}
<!--
kubeadm bootstraps the etcd cluster statically. Read the etcd
[Clustering Guide](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
for more details.
-->
kubeadm 會以靜態方式啟動 etcd 叢集。更多細節請閱讀 etcd 的
[Clustering Guide](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)。
{{< /note >}}

<!-- body -->

<!--
## Stacked etcd topology
-->
## 堆疊 etcd 拓撲 {#stacked-etcd-topology}

<!--
A stacked HA cluster is a [topology](https://en.wikipedia.org/wiki/Network_topology) where the distributed
data storage cluster provided by etcd is stacked on top of the cluster formed by the nodes managed by
kubeadm that run control plane components.
-->
堆疊式（stacked）HA 叢集是一種[拓撲](https://en.wikipedia.org/wiki/Network_topology)，
其中由 etcd 提供的分散式資料儲存叢集，疊加在由 kubeadm 管理、執行控制平面組件的節點所組成的叢集之上。

<!--
Each control plane node runs an instance of the `kube-apiserver`, `kube-scheduler`, and `kube-controller-manager`.
The `kube-apiserver` is exposed to worker nodes using a load balancer.
-->
每個控制平面節點都會執行一個 `kube-apiserver`、`kube-scheduler` 與 `kube-controller-manager` 執行個體。
`kube-apiserver` 透過負載平衡器開放給工作節點存取。

<!--
Each control plane node creates a local etcd member and this etcd member communicates only with
the `kube-apiserver` of this node. The same applies to the local `kube-controller-manager`
and `kube-scheduler` instances.
-->
每個控制平面節點都會建立一個本機 etcd 成員，且此 etcd 成員只與該節點的 `kube-apiserver` 通訊。
本機的 `kube-controller-manager` 與 `kube-scheduler` 執行個體也是如此。

<!--
This topology couples the control planes and etcd members on the same nodes. It is simpler to set up than a cluster
with external etcd nodes, and simpler to manage for replication.
-->
此拓撲將控制平面與 etcd 成員耦合在相同的節點上。
相較於使用外部 etcd 節點的叢集，它的設定較為簡單，在複本管理上也較為容易。

<!--
However, a stacked cluster runs the risk of failed coupling. If one node goes down, both an etcd member and a control
plane instance are lost, and redundancy is compromised. You can mitigate this risk by adding more control plane nodes.
-->
然而，堆疊式叢集存在因耦合而連帶失效的風險。若有一個節點故障，該節點上的 etcd 成員與控制平面執行個體會同時失效，冗餘性也會受到影響。
您可以透過增加控制平面節點的數量來降低此風險。

<!--
You should therefore run a minimum of three stacked control plane nodes for an HA cluster.
-->
因此，對於 HA 叢集，您至少應執行三個堆疊式控制平面節點。

<!--
This is the default topology in kubeadm. A local etcd member is created automatically
on control plane nodes when using `kubeadm init` and `kubeadm join --control-plane`.
-->
這是 kubeadm 的預設拓撲。當使用 `kubeadm init` 與 `kubeadm join --control-plane` 時，
會自動在控制平面節點上建立本機 etcd 成員。

<!--
![Stacked etcd topology](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)
-->
![堆疊 etcd 拓撲](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

<!--
## External etcd topology
-->
## 外部 etcd 拓撲 {#external-etcd-topology}

<!--
An HA cluster with external etcd is a [topology](https://en.wikipedia.org/wiki/Network_topology)
where the distributed data storage cluster provided by etcd is external to the cluster formed by
the nodes that run control plane components.
-->
使用外部 etcd 的 HA 叢集是一種[拓撲](https://en.wikipedia.org/wiki/Network_topology)，
其中由 etcd 提供的分散式資料儲存叢集，位於由執行控制平面組件的節點所組成的叢集之外。

<!--
Like the stacked etcd topology, each control plane node in an external etcd topology runs
an instance of the `kube-apiserver`, `kube-scheduler`, and `kube-controller-manager`.
And the `kube-apiserver` is exposed to worker nodes using a load balancer. However,
etcd members run on separate hosts, and each etcd host communicates with the
`kube-apiserver` of each control plane node.
-->
與堆疊 etcd 拓撲類似，外部 etcd 拓撲中的每個控制平面節點都會執行一個
`kube-apiserver`、`kube-scheduler` 與 `kube-controller-manager` 執行個體，
且 `kube-apiserver` 透過負載平衡器開放給工作節點存取。不過，etcd 成員執行於各自獨立的主機上，
而每台 etcd 主機都會與每個控制平面節點的 `kube-apiserver` 通訊。

<!--
This topology decouples the control plane and etcd member. It therefore provides an HA setup where
losing a control plane instance or an etcd member has less impact and does not affect
the cluster redundancy as much as the stacked HA topology.
-->
此拓撲將控制平面與 etcd 成員解耦。因此，在這種 HA 架構下，
失去一個控制平面執行個體或一個 etcd 成員所造成的影響較小，
對叢集冗餘性的衝擊也不像堆疊式 HA 拓撲那麼大。

<!--
However, this topology requires twice the number of hosts as the stacked HA topology.
A minimum of three hosts for control plane nodes and three hosts for etcd nodes are
required for an HA cluster with this topology.
-->
然而，此拓撲所需的主機數量是堆疊式 HA 拓撲的兩倍。
採用此拓撲的 HA 叢集，至少需要三台主機作為控制平面節點，以及三台主機作為 etcd 節點。

<!--
![External etcd topology](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)
-->
![外部 etcd 拓撲](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

<!--
- [Set up a highly available cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
-->
- [使用 kubeadm 建立高可用叢集](/docs/setup/production-environment/tools/kubeadm/high-availability/)
