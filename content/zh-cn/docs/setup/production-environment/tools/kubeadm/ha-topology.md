---
title: 高可用拓扑选项
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
本页面介绍了配置高可用（HA）Kubernetes 集群拓扑的两个选项。

<!--
You can set up an HA cluster:
-->
你可以设置 HA 集群：

<!--
- With stacked control plane nodes, where etcd nodes are colocated with control plane nodes
- With external etcd nodes, where etcd runs on separate nodes from the control plane
-->
- 使用堆叠（stacked）控制平面节点，其中 etcd 节点与控制平面节点共存
- 使用外部 etcd 节点，其中 etcd 在与控制平面不同的节点上运行

<!--
You should carefully consider the advantages and disadvantages of each topology before setting up an HA cluster.
-->
在设置 HA 集群之前，你应该仔细考虑每种拓扑的优缺点。

{{< note >}}
<!--
kubeadm bootstraps the etcd cluster statically. Read the etcd [Clustering Guide](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
for more details.
-->
kubeadm 静态引导 etcd 集群。
阅读 etcd [集群指南](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)以获得更多详细信息。
{{< /note >}}

<!-- body -->

<!--
## Stacked etcd topology
-->
## 堆叠（Stacked）etcd 拓扑    {#stacked-etcd-topology}

<!--
A stacked HA cluster is a [topology](https://en.wikipedia.org/wiki/Network_topology) where the distributed
data storage cluster provided by etcd is stacked on top of the cluster formed by the nodes managed by
kubeadm that run control plane components.
-->
堆叠（Stacked）HA 集群是一种这样的[拓扑](https://zh.wikipedia.org/wiki/%E7%BD%91%E7%BB%9C%E6%8B%93%E6%89%91)，
其中 etcd 分布式数据存储集群堆叠在 kubeadm 管理的控制平面节点上，作为控制平面的一个组件运行。

<!--
Each control plane node runs an instance of the `kube-apiserver`, `kube-scheduler`, and `kube-controller-manager`.
The `kube-apiserver` is exposed to worker nodes using a load balancer.
-->
每个控制平面节点运行 `kube-apiserver`、`kube-scheduler` 和 `kube-controller-manager` 实例。
`kube-apiserver` 使用负载均衡器暴露给工作节点。

<!--
Each control plane node creates a local etcd member and this etcd member communicates only with
the `kube-apiserver` of this node. The same applies to the local `kube-controller-manager`
and `kube-scheduler` instances.
-->
每个控制平面节点创建一个本地 etcd 成员（member），这个 etcd 成员只与该节点的 `kube-apiserver` 通信。
这同样适用于本地 `kube-controller-manager` 和 `kube-scheduler` 实例。

<!--
This topology couples the control planes and etcd members on the same nodes. It is simpler to set up than a cluster
with external etcd nodes, and simpler to manage for replication.
-->
这种拓扑将控制平面和 etcd 成员耦合在同一节点上。相对使用外部 etcd 集群，
设置起来更简单，而且更易于副本管理。

<!--
However, a stacked cluster runs the risk of failed coupling. If one node goes down, both an etcd member and a control
plane instance are lost, and redundancy is compromised. You can mitigate this risk by adding more control plane nodes.
-->
然而，堆叠集群存在耦合失败的风险。如果一个节点发生故障，则 etcd 成员和控制平面实例都将丢失，
并且冗余会受到影响。你可以通过添加更多控制平面节点来降低此风险。

<!--
You should therefore run a minimum of three stacked control plane nodes for an HA cluster.
-->
因此，你应该为 HA 集群运行至少三个堆叠的控制平面节点。

<!--
This is the default topology in kubeadm. A local etcd member is created automatically
on control plane nodes when using `kubeadm init` and `kubeadm join --control-plane`.
-->
这是 kubeadm 中的默认拓扑。当使用 `kubeadm init` 和 `kubeadm join --control-plane` 时，
在控制平面节点上会自动创建本地 etcd 成员。

<!--
![Stacked etcd topology](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)
-->
![堆叠的 etcd 拓扑](/zh-cn/docs/images/kubeadm-ha-topology-stacked-etcd.svg)

<!--
## External etcd topology
-->
## 外部 etcd 拓扑    {#external-etcd-topology}

<!--
An HA cluster with external etcd is a [topology](https://en.wikipedia.org/wiki/Network_topology) where the distributed data storage cluster provided by etcd is external to the cluster formed by the nodes that run control plane components.
-->
具有外部 etcd 的 HA 集群是一种这样的[拓扑](https://zh.wikipedia.org/wiki/%E7%BD%91%E7%BB%9C%E6%8B%93%E6%89%91)，
其中 etcd 分布式数据存储集群在独立于控制平面节点的其他节点上运行。

<!--
Like the stacked etcd topology, each control plane node in an external etcd topology runs an instance of the `kube-apiserver`, `kube-scheduler`, and `kube-controller-manager`. And the `kube-apiserver` is exposed to worker nodes using a load balancer. However, etcd members run on separate hosts, and each etcd host communicates with the `kube-apiserver` of each control plane node.
-->
就像堆叠的 etcd 拓扑一样，外部 etcd 拓扑中的每个控制平面节点都会运行
`kube-apiserver`、`kube-scheduler` 和 `kube-controller-manager` 实例。
同样，`kube-apiserver` 使用负载均衡器暴露给工作节点。但是 etcd 成员在不同的主机上运行，
每个 etcd 主机与每个控制平面节点的 `kube-apiserver` 通信。

<!--
This topology decouples the control plane and etcd member. It therefore provides an HA setup where
losing a control plane instance or an etcd member has less impact and does not affect
the cluster redundancy as much as the stacked HA topology.
-->
这种拓扑结构解耦了控制平面和 etcd 成员。因此它提供了一种 HA 设置，
其中失去控制平面实例或者 etcd 成员的影响较小，并且不会像堆叠的 HA 拓扑那样影响集群冗余。

<!--
However, this topology requires twice the number of hosts as the stacked HA topology.
A minimum of three hosts for control plane nodes and three hosts for etcd nodes are required for an HA cluster with this topology.
-->
但此拓扑需要两倍于堆叠 HA 拓扑的主机数量。
具有此拓扑的 HA 集群至少需要三个用于控制平面节点的主机和三个用于 etcd 节点的主机。

<!--
![External etcd topology](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)
-->
![外部 etcd 拓扑](/zh-cn/docs/images/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

<!--
- [Set up a highly available cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
-->
- [使用 kubeadm 设置高可用集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)
