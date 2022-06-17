---
title: 高可用拓撲選項
content_type: concept
weight: 50
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Options for Highly Available Topology
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
This page explains the two options for configuring the topology of your highly available (HA) Kubernetes clusters.
-->
本頁面介紹了配置高可用（HA）Kubernetes 叢集拓撲的兩個選項。

<!--
You can set up an HA cluster:
-->
你可以設定 HA 叢集：

<!--
- With stacked control plane nodes, where etcd nodes are colocated with control plane nodes
- With external etcd nodes, where etcd runs on separate nodes from the control plane
-->
 - 使用堆疊（stacked）控制平面節點，其中 etcd 節點與控制平面節點共存
 - 使用外部 etcd 節點，其中 etcd 在與控制平面不同的節點上執行

<!--
You should carefully consider the advantages and disadvantages of each topology before setting up an HA cluster.
-->
在設定 HA 叢集之前，你應該仔細考慮每種拓撲的優缺點。

{{< note >}}
<!--
kubeadm bootstraps the etcd cluster statically. Read the etcd [Clustering Guide](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
for more details.
-->
kubeadm 靜態引導 etcd 叢集。
閱讀 etcd [叢集指南](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)以獲得更多詳細資訊。
{{< /note >}}



<!-- body -->

<!--
## Stacked etcd topology
-->
## 堆疊（Stacked）etcd 拓撲    {#stacked-etcd-topology}

<!--
A stacked HA cluster is a [topology](https://en.wikipedia.org/wiki/Network_topology) where the distributed
data storage cluster provided by etcd is stacked on top of the cluster formed by the nodes managed by
kubeadm that run control plane components.
-->
堆疊（Stacked）HA 叢集是一種這樣的[拓撲](https://en.wikipedia.org/wiki/Network_topology)，
其中 etcd 分散式資料儲存叢集堆疊在 kubeadm 管理的控制平面節點上，作為控制平面的一個元件執行。

<!--
Each control plane node runs an instance of the `kube-apiserver`, `kube-scheduler`, and `kube-controller-manager`.
-->
每個控制平面節點執行 `kube-apiserver`、`kube-scheduler` 和 `kube-controller-manager` 例項。
<!--
The `kube-apiserver` is exposed to worker nodes using a load balancer.
-->
`kube-apiserver` 使用負載均衡器暴露給工作節點。

<!--
Each control plane node creates a local etcd member and this etcd member communicates only with
the `kube-apiserver` of this node. The same applies to the local `kube-controller-manager`
and `kube-scheduler` instances.
-->
每個控制平面節點建立一個本地 etcd 成員（member），這個 etcd 成員只與該節點的 `kube-apiserver` 通訊。
這同樣適用於本地 `kube-controller-manager` 和 `kube-scheduler` 例項。

<!--
This topology couples the control planes and etcd members on the same nodes. It is simpler to set up than a cluster
with external etcd nodes, and simpler to manage for replication.
-->
這種拓撲將控制平面和 etcd 成員耦合在同一節點上。相對使用外部 etcd 叢集，
設定起來更簡單，而且更易於副本管理。

<!--
However, a stacked cluster runs the risk of failed coupling. If one node goes down, both an etcd member and a control
plane instance are lost, and redundancy is compromised. You can mitigate this risk by adding more control plane nodes.
-->
然而，堆疊叢集存在耦合失敗的風險。如果一個節點發生故障，則 etcd 成員和控制平面例項都將丟失，
並且冗餘會受到影響。你可以透過新增更多控制平面節點來降低此風險。

<!--
You should therefore run a minimum of three stacked control plane nodes for an HA cluster.
-->
因此，你應該為 HA 叢集執行至少三個堆疊的控制平面節點。

<!--
This is the default topology in kubeadm. A local etcd member is created automatically
on control plane nodes when using `kubeadm init` and `kubeadm join --control-plane`.
-->
這是 kubeadm 中的預設拓撲。當使用 `kubeadm init` 和 `kubeadm join --control-plane` 時，
在控制平面節點上會自動建立本地 etcd 成員。

<!--
![Stacked etcd topology](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)
-->
![堆疊的 etcd 拓撲](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

<!--
## External etcd topology
-->
## 外部 etcd 拓撲    {#external-etcd-topology}

<!--
An HA cluster with external etcd is a [topology](https://en.wikipedia.org/wiki/Network_topology) where the distributed data storage cluster provided by etcd is external to the cluster formed by the nodes that run control plane components.
-->
具有外部 etcd 的 HA 叢集是一種這樣的[拓撲](https://zh.wikipedia.org/wiki/%E7%BD%91%E7%BB%9C%E6%8B%93%E6%89%91)，
其中 etcd 分散式資料儲存叢集在獨立於控制平面節點的其他節點上執行。

<!--
Like the stacked etcd topology, each control plane node in an external etcd topology runs an instance of the `kube-apiserver`, `kube-scheduler`, and `kube-controller-manager`. And the `kube-apiserver` is exposed to worker nodes using a load balancer. However, etcd members run on separate hosts, and each etcd host communicates with the `kube-apiserver` of each control plane node.
-->
就像堆疊的 etcd 拓撲一樣，外部 etcd 拓撲中的每個控制平面節點都執行 `kube-apiserver`，`kube-scheduler` 和 `kube-controller-manager` 例項。
同樣，`kube-apiserver` 使用負載均衡器暴露給工作節點。但是 etcd 成員在不同的主機上執行，
每個 etcd 主機與每個控制平面節點的 `kube-apiserver` 通訊。

<!--
This topology decouples the control plane and etcd member. It therefore provides an HA setup where
losing a control plane instance or an etcd member has less impact and does not affect
the cluster redundancy as much as the stacked HA topology.
-->
這種拓撲結構解耦了控制平面和 etcd 成員。因此它提供了一種 HA 設定，
其中失去控制平面例項或者 etcd 成員的影響較小，並且不會像堆疊的 HA 拓撲那樣影響叢集冗餘。

<!--
However, this topology requires twice the number of hosts as the stacked HA topology.
-->
但此拓撲需要兩倍於堆疊 HA 拓撲的主機數量。
<!--
A minimum of three hosts for control plane nodes and three hosts for etcd nodes are required for an HA cluster with this topology.
-->
具有此拓撲的 HA 叢集至少需要三個用於控制平面節點的主機和三個用於 etcd 節點的主機。

<!--
![External etcd topology](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)
-->
![外部 etcd 拓撲](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

<!--
- [Set up a highly available cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
-->
- [使用 kubeadm 設定高可用叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)


